@echo off
REM English Trail - EINMALIG: Git-Repo anlegen, zu GitHub hochladen und automatisches Hochladen einrichten.
REM Voraussetzung: Auf GitHub gibt es das leere Repo andre69190-del/english-trail (legt Claude an).
REM Die Polnisch-App (PolskiSzlak) wird dabei NICHT angefasst.
cd /d "%~dp0"
echo.
echo === English Trail: GitHub einrichten ===
where git >nul 2>&1 || (echo Git ist nicht installiert. Bitte Claude Bescheid geben. & pause & exit /b 1)
if not exist ".git" (
  git init -b main
  git remote add origin https://github.com/andre69190-del/english-trail.git
)
git config user.name >nul 2>&1 || git config user.name "Andre Arndt"
git config user.email >nul 2>&1 || git config user.email "farndt691@gmail.com"
git add -A
git commit -m "English Trail 0.1 - erste Version" >nul 2>&1
git push -u origin main
if errorlevel 1 (echo. & echo Hochladen hat nicht geklappt - bitte die Meldung oben an Claude schicken. & pause & exit /b 1)
echo.
echo === Automatisches Hochladen alle 10 Minuten einrichten ===
schtasks /create /tn "English Trail Auto-Upload" /sc minute /mo 10 /tr "wscript.exe \"%~dp0auto_hochladen.vbs\"" /f
if errorlevel 1 (echo Aufgabe konnte nicht angelegt werden - bitte Claude Bescheid geben.) else (echo Fertig. Neue Versionen gehen ab jetzt automatisch online.)
echo.
pause
