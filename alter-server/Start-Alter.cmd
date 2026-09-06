@echo off
rem Double-click helper: runs Start-Alter.ps1 without changing your execution policy.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-Alter.ps1" %*
pause
