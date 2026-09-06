<#
.SYNOPSIS
    Starts the Alter game server from PowerShell.

.DESCRIPTION
    Equivalent to IntelliJ's "Run Server" configuration (the Gradle task
    game-server:run), plus pre-flight checks that catch the mistakes that
    otherwise show up as a silent or half-started server.

    The server runs in the foreground; press Ctrl+C to stop it.

.PARAMETER AlterPath
    Path to the Alter checkout. Defaults to <parent of this script>\Alter.

.PARAMETER Port
    Port to check for a conflict before starting. Defaults to the game-port
    value in game.yml, or 43594.

.PARAMETER LogLevel
    Gradle log level: quiet, lifecycle, info or debug. Defaults to lifecycle.
    Alter's gradle.properties sets info, which buries the server's own output.

.NOTES
    Source changes are picked up automatically: the Gradle `run` task compiles
    game-server and everything on its runtime classpath, game-plugins included,
    before launching. Use Update-Alter.ps1 -NoPull -Clean if you need to clear
    stale build output.

.EXAMPLE
    .\Start-Alter.ps1

.EXAMPLE
    .\Start-Alter.ps1 -LogLevel info -Port 43595
#>
[CmdletBinding()]
param(
    [string]$AlterPath,
    [int]$Port,
    [ValidateSet('quiet', 'lifecycle', 'info', 'debug')]
    [string]$LogLevel = 'lifecycle'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'AlterCommon.ps1')

$AlterRoot = Resolve-AlterRoot -AlterPath $AlterPath

if (-not (Test-AlterRoot -AlterRoot $AlterRoot)) {
    Stop-WithError "No Alter checkout at $AlterRoot. Run .\Setup-Alter.ps1 first."
}

# --- Pre-flight ---------------------------------------------------------------

Write-Step 'Pre-flight checks'

$installStatus = Get-AlterInstallStatus -AlterRoot $AlterRoot
$cacheStatus   = Get-AlterCacheStatus -AlterRoot $AlterRoot
$problems      = @()

if (-not $installStatus.GameYmlExists) {
    $problems += "game.yml is missing - the install task has not been run."
}
if (-not $cacheStatus.CachePresent) {
    $problems += "The cache in $($cacheStatus.CacheDir) is incomplete (missing $($cacheStatus.Missing.Count) file(s))."
}
if (-not $installStatus.RsaKeyExists) {
    # Without this the server blocks on a stdin prompt from RsaService instead of starting.
    $problems += "The RSA key at $($installStatus.RsaKeyPath) is missing."
}

if ($problems.Count -gt 0) {
    foreach ($problem in $problems) { Write-Err $problem }
    Stop-WithError 'Setup is incomplete. Run .\Setup-Alter.ps1 first.'
}
Write-Ok 'Cache, RSA key and game.yml are all in place.'

$jdk = Assert-JavaHome

if (-not $PSBoundParameters.ContainsKey('Port')) {
    $Port = 43594
    $portLine = Select-String -Path $installStatus.GameYml -Pattern '^game-port:\s*(\d+)' -ErrorAction SilentlyContinue |
                Select-Object -First 1
    if ($portLine) { $Port = [int]$portLine.Matches[0].Groups[1].Value }
}

try {
    $inUse = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($inUse) {
        Write-Warn "Port $Port is already in use (PID $($inUse[0].OwningProcess))."
        Write-Warn 'Another Alter instance is probably still running; the server will fail to bind.'
    } else {
        Write-Ok "Port $Port is free."
    }
} catch {
    Write-Info "Could not check port $Port on this system, continuing."
}

# --- Run ----------------------------------------------------------------------

Write-Step "Starting Alter on port $Port"
Write-Info 'Press Ctrl+C to stop the server.'
Write-Host ''

# --no-daemon keeps the server in a single-use JVM, so Ctrl+C tears everything
# down instead of leaving a 4 GB Gradle daemon holding the port.
Invoke-AlterGradle -AlterRoot $AlterRoot -Jdk $jdk `
    -Tasks @('game-server:run') `
    -ExtraArgs @('--no-daemon', '--console=plain') `
    -LogLevel $LogLevel
$exitCode = $LASTEXITCODE

Write-Host ''
if ($exitCode -eq 0) {
    Write-Ok 'Server stopped.'
} else {
    Write-Err "Server exited with code $exitCode."
}
exit $exitCode
