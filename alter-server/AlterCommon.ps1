<#
.SYNOPSIS
    Shared helpers for the Alter PowerShell tooling. Dot-source this; do not run it directly.
#>

Set-StrictMode -Version Latest

# PowerShell 7.4+ turns a non-zero native exit code into a terminating error when
# $ErrorActionPreference is 'Stop'. These scripts check $LASTEXITCODE themselves and
# report failures in plain language, so opt out where the setting exists.
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -Scope Global -ErrorAction Ignore) {
    $PSNativeCommandUseErrorActionPreference = $false
}

# --- Defaults -----------------------------------------------------------------

$script:AlterRepoUrl = 'https://github.com/AlterRSPS/Alter.git'
$script:OpenRs2CacheId = 2038          # OSRS revision 228 cache on archive.openrs2.org
$script:XteaUrl  = "https://archive.openrs2.org/caches/runescape/$script:OpenRs2CacheId/keys.json"
$script:CacheUrl = "https://archive.openrs2.org/caches/runescape/$script:OpenRs2CacheId/disk.zip"

# Files game-server/build.gradle.kts checks for before it will let `install` run.
$script:RequiredCacheFiles = @(
    'main_file_cache.dat2'
) + @(0,1,2,3,4,5,7,8,9,10,11,12,13,14,15,17,18,19,20,255 | ForEach-Object { "main_file_cache.idx$_" })

# --- Console ------------------------------------------------------------------

function Write-Step    { param([string]$Message) Write-Host "`n==> $Message" -ForegroundColor Cyan }
function Write-Info    { param([string]$Message) Write-Host "    $Message" -ForegroundColor Gray }
function Write-Ok      { param([string]$Message) Write-Host "    $Message" -ForegroundColor Green }
function Write-Warn    { param([string]$Message) Write-Host "    $Message" -ForegroundColor Yellow }
function Write-Err     { param([string]$Message) Write-Host "    $Message" -ForegroundColor Red }

function Stop-WithError {
    param([string]$Message)
    Write-Host ''
    Write-Host "ERROR: $Message" -ForegroundColor Red
    Write-Host ''
    exit 1
}

# --- Paths --------------------------------------------------------------------

function Resolve-AlterRoot {
    <#
        Returns the absolute path Alter is (or will be) cloned to.
        Defaults to a sibling of this script's parent, i.e. <repo>\Alter.
    #>
    param([string]$AlterPath)

    if ([string]::IsNullOrWhiteSpace($AlterPath)) {
        $AlterPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'Alter'
    }
    if (-not [System.IO.Path]::IsPathRooted($AlterPath)) {
        $AlterPath = Join-Path (Get-Location).Path $AlterPath
    }
    return [System.IO.Path]::GetFullPath($AlterPath)
}

function Test-AlterRoot {
    param([Parameter(Mandatory)][string]$AlterRoot)
    return (Test-Path (Join-Path $AlterRoot 'settings.gradle.kts')) -and
           (Test-Path (Join-Path $AlterRoot 'gradle\wrapper\gradle-wrapper.jar'))
}

# --- Java discovery -----------------------------------------------------------

function Get-JdkMajorVersion {
    <# Reads the `release` file in a JDK home and returns its major version, or 0. #>
    param([Parameter(Mandatory)][string]$JavaHome)

    $releaseFile = Join-Path $JavaHome 'release'
    $version = $null

    if (Test-Path $releaseFile) {
        $line = Select-String -Path $releaseFile -Pattern '^JAVA_VERSION="(.+)"$' -ErrorAction SilentlyContinue |
                Select-Object -First 1
        if ($line) { $version = $line.Matches[0].Groups[1].Value }
    }

    if (-not $version) {
        # Fall back to asking the binary itself (works for JDKs with no `release` file).
        $javaExe = Join-Path $JavaHome 'bin\java.exe'
        if (-not (Test-Path $javaExe)) { return 0 }
        try {
            $output = & $javaExe -version 2>&1 | Out-String
            if ($output -match 'version "([^"]+)"') { $version = $Matches[1] }
        } catch { return 0 }
    }

    if (-not $version) { return 0 }
    if ($version -match '^1\.(\d+)') { return [int]$Matches[1] }   # 1.8.0_392 -> 8
    if ($version -match '^(\d+)')    { return [int]$Matches[1] }   # 17.0.11   -> 17
    return 0
}

function Find-JavaHome {
    <#
        Locates a usable JDK. Alter compiles against a Java 17 toolchain and Gradle 8.11
        runs on 8-23, so 17 is the safe choice; anything in [17,23] will still work
        because settings.gradle.kts registers the foojay toolchain resolver, which will
        fetch a JDK 17 for compilation on demand.
    #>
    param(
        [int]$Preferred = 17,
        [int]$MinMajor  = 17,
        [int]$MaxMajor  = 23
    )

    $candidates = [System.Collections.Generic.List[string]]::new()
    foreach ($envVar in @($env:ALTER_JAVA_HOME, $env:JAVA_HOME)) {
        if (-not [string]::IsNullOrWhiteSpace($envVar)) { $candidates.Add($envVar) }
    }

    $searchPairs = @(
        @($env:ProgramFiles,          'Eclipse Adoptium'),
        @($env:ProgramFiles,          'Microsoft'),
        @($env:ProgramFiles,          'Java'),
        @($env:ProgramFiles,          'Amazon Corretto'),
        @($env:ProgramFiles,          'Zulu'),
        @($env:ProgramFiles,          'BellSoft'),
        @(${env:ProgramFiles(x86)},   'Java'),
        @($env:LOCALAPPDATA,          'Programs\Eclipse Adoptium'),
        @($env:USERPROFILE,           '.jdks')          # IntelliJ downloads JDKs here
    )
    $searchRoots = foreach ($pair in $searchPairs) {
        if (-not [string]::IsNullOrWhiteSpace($pair[0])) { Join-Path $pair[0] $pair[1] }
    }
    foreach ($root in $searchRoots) {
        if ([string]::IsNullOrWhiteSpace($root) -or -not (Test-Path $root)) { continue }
        Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue |
            ForEach-Object { $candidates.Add($_.FullName) }
    }

    # Whatever `java` is on PATH, resolved back to its home.
    $onPath = Get-Command java.exe -ErrorAction SilentlyContinue
    if ($onPath) {
        $pathJavaHome = Split-Path -Parent (Split-Path -Parent $onPath.Source)
        if (-not [string]::IsNullOrWhiteSpace($pathJavaHome)) { $candidates.Add($pathJavaHome) }
    }

    $found = @{}
    foreach ($candidate in $candidates) {
        if (-not (Test-Path (Join-Path $candidate 'bin\java.exe'))) { continue }
        $full = [System.IO.Path]::GetFullPath($candidate)
        if ($found.ContainsKey($full)) { continue }
        $major = Get-JdkMajorVersion -JavaHome $full
        if ($major -ge $MinMajor -and $major -le $MaxMajor) { $found[$full] = $major }
    }

    if ($found.Count -eq 0) { return $null }

    # Exact preferred major first, then the lowest usable version.
    $exact = $found.GetEnumerator() | Where-Object { $_.Value -eq $Preferred } | Select-Object -First 1
    if ($exact) { return [pscustomobject]@{ Path = $exact.Key; Major = $exact.Value } }

    $best = $found.GetEnumerator() | Sort-Object Value | Select-Object -First 1
    return [pscustomobject]@{ Path = $best.Key; Major = $best.Value }
}

function Install-Jdk17 {
    <# Installs Temurin 17 via winget. Returns the discovered JDK object, or $null. #>
    if (-not (Get-Command winget.exe -ErrorAction SilentlyContinue)) {
        Write-Warn 'winget is not available on this machine, so JDK 17 cannot be installed automatically.'
        return $null
    }

    Write-Info 'Installing Eclipse Temurin JDK 17 via winget (this may prompt for elevation)...'
    # Out-Host keeps winget's chatter off this function's output stream, which would
    # otherwise be returned to the caller alongside the JDK object.
    & winget.exe install --id EclipseAdoptium.Temurin.17.JDK --exact `
        --accept-source-agreements --accept-package-agreements --silent | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "winget exited with code $LASTEXITCODE."
        return $null
    }
    return (Find-JavaHome)
}

function Assert-JavaHome {
    <# Resolves a JDK, optionally installing one, and fails loudly if it cannot. #>
    param([switch]$AllowInstall)

    $jdk = Find-JavaHome
    if (-not $jdk -and $AllowInstall) { $jdk = Install-Jdk17 }

    if (-not $jdk) {
        Stop-WithError @'
No suitable JDK found (Alter needs Java 17; Java 17-23 is tolerated).

Fix it with either:
  winget install EclipseAdoptium.Temurin.17.JDK
or download it from https://adoptium.net/temurin/releases/?version=17

Then re-run this script. If your JDK lives somewhere unusual, point at it directly:
  $env:ALTER_JAVA_HOME = "C:\path\to\jdk-17"
'@
    }

    if ($jdk.Major -ne 17) {
        Write-Warn "Using JDK $($jdk.Major) at $($jdk.Path)."
        Write-Warn 'Alter targets Java 17. Gradle will download a JDK 17 toolchain for compilation,'
        Write-Warn 'which works but adds a one-off download. Installing JDK 17 directly is smoother.'
    } else {
        Write-Ok "Using JDK 17 at $($jdk.Path)"
    }
    return $jdk
}

# --- Gradle -------------------------------------------------------------------

function Invoke-AlterGradle {
    <#
        Runs a Gradle task in the Alter checkout without gradlew.bat.

        Alter's .gitignore excludes gradlew/gradlew.bat, so a fresh clone has the
        wrapper JAR and properties but no launcher script - which is exactly why the
        upstream README tells you to use IntelliJ's bundled Gradle. We invoke the
        wrapper's entry point ourselves, which is all gradlew.bat does anyway.
    #>
    param(
        [Parameter(Mandatory)][string]$AlterRoot,
        [Parameter(Mandatory)][pscustomobject]$Jdk,
        [Parameter(Mandatory)][string[]]$Tasks,
        [string[]]$ExtraArgs = @(),
        [string]$LogLevel = 'lifecycle'
    )

    $wrapperJar = Join-Path $AlterRoot 'gradle\wrapper\gradle-wrapper.jar'
    if (-not (Test-Path $wrapperJar)) {
        Stop-WithError "Gradle wrapper JAR missing at $wrapperJar. Is $AlterRoot a complete Alter clone?"
    }

    $javaExe = Join-Path $Jdk.Path 'bin\java.exe'
    $arguments = @(
        '-Dorg.gradle.appname=alter',
        "-Dorg.gradle.java.home=$($Jdk.Path)",
        "-Dorg.gradle.logging.level=$LogLevel",
        '-classpath', $wrapperJar,
        'org.gradle.wrapper.GradleWrapperMain'
    ) + $Tasks + $ExtraArgs

    Write-Info "gradle $($Tasks -join ' ') $($ExtraArgs -join ' ')"

    # Deliberately not returning the exit code: capturing this function's output
    # would swallow Gradle's console stream and hand the caller an array of output
    # lines. Leaving it uncaptured lets the JVM keep the real console, which the
    # foreground server needs for live output and a clean Ctrl+C. Callers read
    # $LASTEXITCODE afterwards; neither Pop-Location nor the assignment below
    # disturbs it.
    $previousJavaHome = $env:JAVA_HOME
    $env:JAVA_HOME = $Jdk.Path
    Push-Location $AlterRoot
    try {
        & $javaExe @arguments
    } finally {
        Pop-Location
        $env:JAVA_HOME = $previousJavaHome
    }
}

function Stop-AlterGradleDaemons {
    param(
        [Parameter(Mandatory)][string]$AlterRoot,
        [Parameter(Mandatory)][pscustomobject]$Jdk
    )
    Invoke-AlterGradle -AlterRoot $AlterRoot -Jdk $Jdk -Tasks @('--stop')
}

# --- Install state ------------------------------------------------------------

function Get-AlterCacheStatus {
    <# Reports which of the cache files the `install` task requires are present. #>
    param([Parameter(Mandatory)][string]$AlterRoot)

    $cacheDir = Join-Path $AlterRoot 'data\cache'
    $missing = @()
    foreach ($file in $script:RequiredCacheFiles) {
        if (-not (Test-Path (Join-Path $cacheDir $file))) { $missing += $file }
    }
    $xteas = Join-Path $AlterRoot 'data\xteas.json'

    return [pscustomobject]@{
        CacheDir     = $cacheDir
        Missing      = $missing
        CachePresent = ($missing.Count -eq 0)
        XteasPresent = (Test-Path $xteas)
        XteasPath    = $xteas
    }
}

function Get-AlterInstallStatus {
    <#
        `install` is a one-way door: it decrypts the world map into the cache and then
        renames data/xteas.json to xteas.json.backup, leaving an empty [] behind.
        These markers tell us it has already happened.
    #>
    param([Parameter(Mandatory)][string]$AlterRoot)

    $gameYml     = Join-Path $AlterRoot 'game.yml'
    $xteasBackup = Join-Path $AlterRoot 'data\xteas.json.backup'
    $rsaKey      = Join-Path $AlterRoot 'data\rsa\key.pem'
    $modulus     = Join-Path $AlterRoot 'modulus'

    return [pscustomobject]@{
        GameYml       = $gameYml
        GameYmlExists = (Test-Path $gameYml)
        MapDecrypted  = (Test-Path $xteasBackup)
        RsaKeyExists  = (Test-Path $rsaKey)
        RsaKeyPath    = $rsaKey
        ModulusPath   = $modulus
        HasRun        = (Test-Path $gameYml) -or (Test-Path $xteasBackup)
    }
}

function Get-AlterModulus {
    <# Extracts the RSA modulus that RsaService wrote to <root>\modulus. #>
    param([Parameter(Mandatory)][string]$AlterRoot)

    $modulusFile = Join-Path $AlterRoot 'modulus'
    if (-not (Test-Path $modulusFile)) { return $null }

    $match = Select-String -Path $modulusFile -Pattern '^modulus:\s*(\S+)\s*$' |
             Select-Object -First 1
    if (-not $match) { return $null }
    return $match.Matches[0].Groups[1].Value
}
