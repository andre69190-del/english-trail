@echo off
REM English Trail - wird alle 10 Minuten unsichtbar von der Windows-Aufgabenplanung gestartet.
REM Laedt NUR hoch, wenn Claude eine neue, gepruefte Version freigegeben hat (RELEASE.txt geaendert).
REM Danach baut Coolify english.arndt-software.de automatisch neu. PolskiSzlak wird nie angefasst.
cd /d "%~dp0"
if not exist ".git" exit /b 0
git diff --quiet HEAD -- RELEASE.txt 2>nul && git ls-files --error-unmatch RELEASE.txt >nul 2>&1 && exit /b 0
set /p REL=<RELEASE.txt
git add -A
git commit -m "English Trail %REL%" >nul 2>&1
git push >> "%~dp0auto_hochladen.log" 2>&1
REM Startseite arndt-software.de (Karte English Trail) ebenfalls hochladen, falls geaendert
if exist "..\homepage\.git" (
  pushd "..\homepage"
  git add index.html sitemap.xml
  git diff --cached --quiet || (git commit -m "English Trail auf der Startseite" >nul 2>&1 & git push >> "%~dp0auto_hochladen.log" 2>&1)
  popd
)
exit /b 0
