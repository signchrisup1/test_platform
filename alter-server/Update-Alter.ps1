<#
.SYNOPSIS
    Pulls upstream Alter changes and recompiles, without touching the cache.

.DESCRIPTION
    Deliberately runs `build`, never `install`. The install task decrypts the
    world map into the cache and empties data\xteas.json, so running it a second
    time against an already-decrypted cache corrupts it. Use this script for all
    routine updates and recompiles.

.PARAMETER AlterPath
    Path to the Alter checkout. Defaults to <parent of this script>\Alter.

.PARAMETER NoPull
    Recompile only; skip git pull. Useful after editing plugins locally.

.PARAMETER Clean
    Run a clean build. Slow, but clears stale build output.

.PARAMETER SkipTests
    Compile and package without running the test suite.

.EXAMPLE
    .\Update-Alter.ps1

.EXAMPLE
    .\Update-Alter.ps1 -NoPull -Clean
#>
[CmdletBinding()]
param(
    [string]$AlterPath,
    [switch]$NoPull,
    [switch]$Clean,
    [switch]$SkipTests
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'AlterCommon.ps1')

$AlterRoot = Resolve-AlterRoot -AlterPath $AlterPath

if (-not (Test-AlterRoot -AlterRoot $AlterRoot)) {
    Stop-WithError "No Alter checkout at $AlterRoot. Run .\Setup-Alter.ps1 first."
}

$jdk = Assert-JavaHome

if (-not $NoPull) {
    Write-Step 'Pulling upstream changes'
    if (-not (Get-Command git.exe -ErrorAction SilentlyContinue)) {
        Stop-WithError "git is not installed. Pass -NoPull to skip this step."
    }

    $blocked = $null
    Push-Location $AlterRoot
    try {
        $dirty = & git.exe status --porcelain
        if ($LASTEXITCODE -ne 0) { Stop-WithError "git status failed with exit code $LASTEXITCODE." }

        if ($dirty) {
            $blocked = $dirty
        } else {
            & git.exe pull --ff-only
            if ($LASTEXITCODE -ne 0) { Stop-WithError "git pull failed with exit code $LASTEXITCODE." }
        }
    } finally {
        Pop-Location
    }

    if ($blocked) {
        Write-Warn 'The checkout has local changes:'
        $blocked | ForEach-Object { Write-Warn "  $_" }
        Write-Warn 'Commit or stash them first, or pass -NoPull to just recompile.'
        exit 1
    }
    Write-Ok 'Up to date.'
}

Write-Step 'Building'
$tasks = @()
if ($Clean) { $tasks += 'clean' }
$tasks += 'game-server:build'

$extraArgs = @()
if ($SkipTests) { $extraArgs += '-x'; $extraArgs += 'test' }

Invoke-AlterGradle -AlterRoot $AlterRoot -Jdk $jdk -Tasks $tasks -ExtraArgs $extraArgs
if ($LASTEXITCODE -ne 0) { Stop-WithError "Build failed with exit code $LASTEXITCODE." }

Write-Host ''
Write-Ok 'Build succeeded. Start the server with .\Start-Alter.ps1'
Write-Host ''
