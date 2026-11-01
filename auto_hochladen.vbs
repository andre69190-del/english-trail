' Startet auto_hochladen.bat ohne sichtbares Fenster (fuer die Windows-Aufgabenplanung)
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
CreateObject("WScript.Shell").Run """" & dir & "\auto_hochladen.bat""", 0, False
