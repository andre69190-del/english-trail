# English Trail — Claude Session Starter

> Diesen Block an den Anfang einer neuen Session kopieren (oder einfach „weiter mit English Trail“ sagen).

```
Projekt: English Trail – Single-File Englisch-Lern-App (PWA), Basissprache Deutsch, Schulmodus (BW Gymnasium 5–10)
Ordner:  C:\Users\Andre\Desktop\Cowork\EnglishTrail
Vorlage: C:\Users\Andre\Desktop\Cowork\PolskiSzlak  ⛔ NUR LESEN – die Polnisch-App darf nicht geändert werden

Aktueller Stand, Entscheidungen, Phasenplan: PROJEKTSTAND.md (immer zuerst lesen und nach jedem Schritt pflegen)

Arbeitsweise:
- Arbeitskopie in der Cloud (/home/claude/EnglishTrail). Fehlt sie: kompletten Ordner EnglishTrail vom PC stagen.
- Inhalte NICHT direkt in src/data.json schreiben, sondern in content/*.py → python3 content/merge.py
- build.py ist die EINZIGE Build-Quelle → index.html (+ dist/english_trail_artifact.html)
- Logik in src/core.js (ohne DOM), UI in src/app.js, CSS in src/app.css
- Noch nicht portierte Vorlage-Teile tragen "legacy": 1 (content_check warnt)
- Bis zur Veröffentlichung: nach Inhaltsänderungen python3 checks/progress_lock.py --update

Pflicht nach JEDER Änderung:
1. python3 build.py && bash checks/run_all.sh   → „alles bestanden“
2. python3 tests/ui_test.py                       → 0 Fehler
3. PROJEKTSTAND.md aktualisieren
4. Geänderte Dateien auf den PC zurückschreiben (SendUserFile → device_commit_files)

Designprinzipien (aus Polski Szlak übernommen):
- Wochenziel statt Tages-Streak, keine Push-Nachrichten, keine Käufe, keine Schuld-Texte
- Benutzereingaben immer durch esc(); Farben nur als Tokens (hell + dunkel), WCAG ≥ 4,5:1
- Eigene Supabase-Tabellen et_* und Function et-chat (nie ps_* anfassen)
- Lehrwerke: nur Struktur (Unit-Themen, Grammatik), keine Verlagstexte/-vokabellisten
```
