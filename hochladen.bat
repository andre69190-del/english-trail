@echo off
REM English Trail - lokale Commits zu GitHub hochladen (danach veroeffentlicht Coolify automatisch)
cd /d "%~dp0"
echo Lade zu GitHub hoch ...
git push
if errorlevel 1 (echo. & echo Hochladen hat nicht geklappt - bitte Meldung oben an Claude schicken.) else (echo. & echo Fertig. In ca. 1-2 Minuten ist https://english.arndt-software.de aktuell.)
echo.
pause
