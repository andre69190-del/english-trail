@echo off
REM English Trail - Update einspielen und danach den Test-Server starten
cd /d "%~dp0"
echo ================================================
echo  English Trail - Update
echo ================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1"
if errorlevel 1 ( pause & exit /b 1 )
echo.
echo Starte den Test-Server ...
echo.
call "%~dp0serve_local.bat"
