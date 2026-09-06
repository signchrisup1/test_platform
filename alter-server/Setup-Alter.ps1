<#
.SYNOPSIS
    One-time setup for an Alter (RSMod) server on Windows, without IntelliJ.

.DESCRIPTION
    Performs every step the upstream README asks you to do by hand in IntelliJ:

      1. Finds (or installs) a JDK 17.
      2. Clones AlterRSPS/Alter next to this script.
      3. Downloads the revision 228 cache and XTEA keys from archive.openrs2.org
         and drops them into data\cache\ and data\xteas.json.
      4. Runs the Gradle `game-server:install` task, which builds the project,
         generates the RSA keypair, decrypts the world map and writes game.yml.
      5. Prints your RSA modulus and the RSProx client config that needs it.

    Run this once. Afterwards use Start-Alter.ps1 to boot the server and
    Update-Alter.ps1 to pull upstream changes.

.PARAMETER AlterPath
    Where to clone Alter. Defaults to <parent of this script>\Alter.

.PARAMETER SkipDownload
    Do not fetch the cache or XTEA keys. Use this if you already placed them
    into data\cache\ and data\xteas.json yourself.

.PARAMETER InstallJava
    Allow the script to install Temurin JDK 17 via winget when no JDK is found.

.PARAMETER Force
    Re-run the destructive `install` task even though it has already been run.
    See the warning in README.md before using this.

.EXAMPLE
    .\Setup-Alter.ps1 -InstallJava

.EXAMPLE
    .\Setup-Alter.ps1 -AlterPath D:\rsps\Alter -SkipDownload
#>
[CmdletBinding()]
param(
    [string]$AlterPath,
    [switch]$SkipDownload,
    [switch]$InstallJava,
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'AlterCommon.ps1')

$AlterRoot = Resolve-AlterRoot -AlterPath $AlterPath

Write-Host ''
Write-Host 'Alter server setup' -ForegroundColor White
Write-Host "Target: $AlterRoot" -ForegroundColor DarkGray

# --- 1. JDK -------------------------------------------------------------------

Write-Step 'Locating a JDK'
$jdk = Assert-JavaHome -AllowInstall:$InstallJava

# --- 2. Clone -----------------------------------------------------------------

Write-Step 'Fetching the Alter source'
if (Test-AlterRoot -AlterRoot $AlterRoot) {
    Write-Ok "Existing clone found, leaving it alone."
} elseif (Test-Path $AlterRoot) {
    Stop-WithError "$AlterRoot already exists but does not look like an Alter checkout. Move it aside or pass -AlterPath."
} else {
    if (-not (Get-Command git.exe -ErrorAction SilentlyContinue)) {
        Stop-WithError "git is not installed. Install it with 'winget install Git.Git' and re-run."
    }
    Write-Info "git clone $script:AlterRepoUrl"
    & git.exe clone $script:AlterRepoUrl $AlterRoot
    if ($LASTEXITCODE -ne 0) { Stop-WithError "git clone failed with exit code $LASTEXITCODE." }
    if (-not (Test-AlterRoot -AlterRoot $AlterRoot)) {
        Stop-WithError "Clone completed but $AlterRoot is missing settings.gradle.kts or the Gradle wrapper."
    }
    Write-Ok 'Cloned.'
}

# --- 3. Cache and XTEA keys ---------------------------------------------------

Write-Step 'Checking the game cache'
$cacheStatus = Get-AlterCacheStatus -AlterRoot $AlterRoot
$installStatus = Get-AlterInstallStatus -AlterRoot $AlterRoot

if ($cacheStatus.CachePresent) {
    Write-Ok "Cache already present in $($cacheStatus.CacheDir)"
} elseif ($SkipDownload) {
    Stop-WithError @"
-SkipDownload was passed but the cache is incomplete.
Missing from $($cacheStatus.CacheDir):
  $($cacheStatus.Missing -join "`n  ")
"@
} else {
    $tempDir = Join-Path ([System.IO.Path]::GetTempPath()) "alter-cache-$([guid]::NewGuid().ToString('N').Substring(0,8))"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    $zipPath = Join-Path $tempDir 'disk.zip'

    # Invoke-WebRequest's progress bar makes large downloads roughly an order of
    # magnitude slower in Windows PowerShell 5.1, so switch it off.
    $previousProgress = $ProgressPreference
    $ProgressPreference = 'SilentlyContinue'
    try {
        Write-Info "Downloading cache from $script:CacheUrl (a few hundred MB, be patient)..."
        Invoke-WebRequest -Uri $script:CacheUrl -OutFile $zipPath -UseBasicParsing
        Write-Info 'Extracting...'
        Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force
    } catch {
        Stop-WithError "Failed to download or extract the cache: $($_.Exception.Message)"
    } finally {
        $ProgressPreference = $previousProgress
    }

    # The archive layout has changed over time, so find the cache by its contents.
    $dat2 = Get-ChildItem -Path $tempDir -Filter 'main_file_cache.dat2' -Recurse -File |
            Select-Object -First 1
    if (-not $dat2) {
        Stop-WithError "The downloaded archive did not contain main_file_cache.dat2. Extracted to $tempDir for inspection."
    }

    New-Item -ItemType Directory -Path $cacheStatus.CacheDir -Force | Out-Null
    Copy-Item -Path (Join-Path $dat2.Directory.FullName 'main_file_cache.*') `
              -Destination $cacheStatus.CacheDir -Force
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Ok "Cache installed into $($cacheStatus.CacheDir)"
}

Write-Step 'Checking the XTEA keys'
if ($installStatus.MapDecrypted) {
    Write-Ok 'World map is already decrypted, so the keys are no longer needed.'
} elseif ($cacheStatus.XteasPresent) {
    Write-Ok 'data\xteas.json already present.'
} elseif ($SkipDownload) {
    Stop-WithError "-SkipDownload was passed but $($cacheStatus.XteasPath) is missing."
} else {
    Write-Info "Downloading $script:XteaUrl"
    $previousProgress = $ProgressPreference
    $ProgressPreference = 'SilentlyContinue'
    try {
        Invoke-WebRequest -Uri $script:XteaUrl -OutFile $cacheStatus.XteasPath -UseBasicParsing
    } catch {
        Stop-WithError "Failed to download the XTEA keys: $($_.Exception.Message)"
    } finally {
        $ProgressPreference = $previousProgress
    }
    Write-Ok "Saved to $($cacheStatus.XteasPath)"
}

# --- 4. Build and install -----------------------------------------------------

# Re-check now that files have moved. The install task's own error for a missing
# cache file is famously unhelpful, so catch it here with the actual file list.
$cacheStatus = Get-AlterCacheStatus -AlterRoot $AlterRoot
if (-not $cacheStatus.CachePresent) {
    Write-Err "These cache files are still missing from $($cacheStatus.CacheDir):"
    $cacheStatus.Missing | ForEach-Object { Write-Err "  $_" }
    Stop-WithError 'The cache is incomplete, so the install task would fail. See README.md for placing a cache by hand.'
}

$installStatus = Get-AlterInstallStatus -AlterRoot $AlterRoot

if ($installStatus.HasRun -and -not $Force) {
    Write-Step 'Skipping the install task'
    Write-Warn 'Alter has already been installed in this checkout:'
    if ($installStatus.GameYmlExists) { Write-Warn '  - game.yml exists' }
    if ($installStatus.MapDecrypted)  { Write-Warn '  - data\xteas.json.backup exists (world map already decrypted)' }
    Write-Warn ''
    Write-Warn 'Re-running install would decrypt an already-decrypted cache against an empty'
    Write-Warn 'key set and corrupt it. To genuinely start over, delete data\cache and'
    Write-Warn 'data\xteas.json*, then run this script with -Force.'
    Write-Warn ''
    Write-Warn 'To just recompile after code changes, use Update-Alter.ps1 instead.'
} else {
    if ($installStatus.HasRun -and $Force) {
        Write-Warn '-Force given: running install over an existing installation.'
    }
    Write-Step 'Building Alter and running the install task'
    Write-Info 'The first run downloads Gradle 8.11 plus all dependencies and can take 10-20 minutes.'

    Invoke-AlterGradle -AlterRoot $AlterRoot -Jdk $jdk -Tasks @('game-server:install')
    if ($LASTEXITCODE -ne 0) {
        Stop-WithError "The install task failed with exit code $LASTEXITCODE. See the Gradle output above."
    }
    Write-Ok 'Install completed.'
}

# --- 5. Client configuration --------------------------------------------------

Write-Step 'Client configuration (RSProx)'
$modulus = Get-AlterModulus -AlterRoot $AlterRoot

if (-not $modulus) {
    Write-Warn "No modulus file found at $($installStatus.ModulusPath); skipping client config."
} else {
    $rsproxDir  = Join-Path $env:USERPROFILE '.rsprox'
    $targetFile = Join-Path $rsproxDir 'proxy-targets.yaml'
    $yaml = @"
config:
  - id: 1
    name: Alter
    jav_config_url: https://client.blurite.io/jav_local_228.ws
    varp_count: 15000
    revision: 228.2
    modulus: $modulus
"@

    if (Test-Path $targetFile) {
        Write-Warn "$targetFile already exists, so it was left untouched."
        Write-Warn 'Add or update the Alter entry yourself using this block:'
        Write-Host ''
        Write-Host $yaml -ForegroundColor DarkGray
    } else {
        New-Item -ItemType Directory -Path $rsproxDir -Force | Out-Null
        # Windows PowerShell's -Encoding UTF8 emits a BOM, which some YAML parsers
        # reject on the first key, so write UTF-8 without one.
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($targetFile, ($yaml + [Environment]::NewLine), $utf8NoBom)
        Write-Ok "Wrote $targetFile"
    }
}

Write-Host ''
Write-Host 'Setup complete.' -ForegroundColor Green
Write-Host ''
Write-Host '  Start the server:  .\Start-Alter.ps1' -ForegroundColor White
Write-Host '  Pull updates:      .\Update-Alter.ps1' -ForegroundColor White
Write-Host ''
Write-Host "  Server config:     $(Join-Path $AlterRoot 'game.yml')" -ForegroundColor DarkGray
Write-Host "  Dev toggles:       $(Join-Path $AlterRoot 'dev-settings.yml')" -ForegroundColor DarkGray
Write-Host ''
Write-Host '  Client: launch RSProx and pick the "Alter" target.' -ForegroundColor DarkGray
Write-Host '          Download it from https://github.com/blurite/rsprox/releases' -ForegroundColor DarkGray
Write-Host ''
