@echo off
title StartupOS AI Runner
echo ===================================================
echo             Starting StartupOS AI
echo ===================================================
echo.

echo [1/2] Starting Flask Backend in a new window...
cd /d "%~dp0backend"
start "StartupOS Backend" cmd /k "venv\Scripts\activate && python run.py"

echo [2/2] Starting React Frontend in a new window...
cd /d "%~dp0frontend"
start "StartupOS Frontend" cmd /k "npm run dev"

cd /d "%~dp0"

echo.
echo ===================================================
echo Both Backend and Frontend are starting up!
echo.
echo - Backend logs are in the "StartupOS Backend" window.
echo - Frontend logs are in the "StartupOS Frontend" window.
echo.
echo Web App: http://localhost:3000
echo Backend API: http://localhost:5000
echo ===================================================
echo.
pause
