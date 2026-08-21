@echo off
title AutoParts Pro - Create Desktop Shortcut
echo =======================================================
echo    AutoParts Pro - Desktop Shortcut Installer
echo =======================================================
echo.

set SCRIPT_DIR=%~dp0
set TARGET_BAT=%SCRIPT_DIR%launch.bat
set SHORTCUT_PATH=%USERPROFILE%\Desktop\AutoParts Store.lnk

echo Creating Desktop Shortcut: "AutoParts Store"...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%TARGET_BAT%'; $s.WorkingDirectory = '%SCRIPT_DIR%'; $s.WindowStyle = 7; $s.Save()"

echo.
echo =======================================================
echo [SUCCESS] Shortcut created on your Desktop!
echo Your father can now just double-click "AutoParts Store"
echo on the Desktop to launch the system anytime.
echo =======================================================
echo.
pause
