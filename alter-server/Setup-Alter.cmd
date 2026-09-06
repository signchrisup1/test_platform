@echo off
rem Double-click helper: runs Setup-Alter.ps1 without changing your execution policy.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Setup-Alter.ps1" -InstallJava %*
pause
