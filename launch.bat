@echo off
title AutoParts Pro - Store System
echo ===================================================
echo     AutoParts Pro - Multi-Floor Store Manager
echo ===================================================
echo Starting local store server...
echo.

:: Start the background local server
start /b powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080

:: Give server 1 second to bind
timeout /t 1 /nobreak >nul

:: Launch in clean native app window mode (Edge or Chrome)
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start msedge --app=http://localhost:8080/index.html
    exit
)

where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start chrome --app=http://localhost:8080/index.html
    exit
)

start "" "http://localhost:8080/index.html"
exit
