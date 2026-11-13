@echo off
REM English Trail - neue Version zu GitHub hochladen (danach veroeffentlicht Coolify automatisch)
REM 13.11.2026: speichert vorher alle Aenderungen (Commit mit Text aus RELEASE.txt), dann Upload.
cd /d "%~dp0"
set /p REL=<RELEASE.txt
echo Speichere Version: %REL%
git add -A
git commit -m "English Trail %REL%"
echo.
echo Lade zu GitHub hoch ...
git push
if errorlevel 1 (echo. & echo Hochladen hat nicht geklappt - bitte Meldung oben an Claude schicken.) else (echo. & echo Fertig. In ca. 1-2 Minuten ist https://english.arndt-software.de aktuell.)
echo.
pause
