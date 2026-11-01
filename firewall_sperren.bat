@echo off
REM Freigabe fuer Port 8789 wieder entfernen
net session >nul 2>&1 || (powershell -NoProfile -Command "Start-Process -FilePath %~f0 -Verb RunAs" & exit /b)
netsh advfirewall firewall delete rule name="English Trail Test 8789"
echo Freigabe entfernt.
pause
