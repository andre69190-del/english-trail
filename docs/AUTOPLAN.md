# English Trail – Arbeitsplan für die Samstags-Läufe

Jeden Samstag um 15:00 Uhr arbeitet eine geplante Aufgabe automatisch an English Trail weiter, bis das Nutzungslimit erreicht ist.
**Diese Datei ist die Arbeitsliste.** Jeder Lauf nimmt den obersten offenen Punkt (⬜), erledigt ihn vollständig, hakt ihn ab (✅ + Datum + Version) und macht mit dem nächsten weiter.
Neue Ideen kommen unten in „Ideen-Speicher“, nicht mitten in die Liste.

## Feste Regeln (immer)
1. **Polski Szlak nie anfassen**: kein Schreiben in `C:\Users\Andre\Desktop\Cowork\PolskiSzlak`, keine `ps_*`-Tabellen, keine `ps-chat`-Funktion.
2. **Lernstände bleiben erhalten**: localStorage-Schlüssel `english_trail_v1` nie ändern; Einheiten/Wörter/Grammatik-Themen/Pakete/Raben-Teile **nur hinten anhängen**, IDs nie ändern; neue Felder mit Standardwerten; `checks/progress_lock.py` muss grün sein (nach Ergänzungen `--update`).
3. **Keine Verlags-Vokabellisten** (Urheberrecht). Eigene Inhalte schreiben.
4. **Vor jedem Hochladen**: `python3 content/merge.py && python3 build.py && python3 tools/seo_pages.py`, alle `checks/*.py`, `node tests/core.test.js`, `python3 tests/ui_test.py` → alles grün. Neue Funktion = neuer Test.
5. **Release**: `APP_VER` in `src/app.js` und `CACHE_NAME` in `sw.js` erhöhen, Eintrag in `content/extras.py` → `NEWS_ALL` (kindgerecht), ggf. `GUIDE`, `PROJEKTSTAND.md` ergänzen. Dateien auf den PC schreiben, **`RELEASE.txt` immer zuletzt** (das löst den automatischen Upload aus: PC → GitHub → Coolify).
6. **Datenschutz**: Neue Datenflüsse in `datenschutz.html` beschreiben; Kinder < 16 beachten.
7. **Kleine, fertige Schritte**: Lieber ein Punkt ganz fertig und online als drei halb. Bei knappem Limit: Zwischenstand in PROJEKTSTAND.md + diese Datei schreiben, nichts halb Hochgeladenes.
8. Am Ende jedes Laufs: kurze Nachricht an Andre (was ist neu, was als Nächstes, was er ggf. tun muss).

## Arbeitsliste (Reihenfolge = Priorität)
- ⬜ **1. Live-Prüfung + Kinder-Feedback**: english.arndt-software.de prüfen (aktuelle Version ausgeliefert, keine JS-Fehler). Falls Andre die Tabelle `et_feedback` angelegt hat und ein Weg zum Lesen besteht: Meldungen auswerten und Fehler beheben (sonst überspringen).
- ⬜ **2. Trail 3 (B1, Klasse 8–10)**: 12 neue Orte als `content/trail3.py` (r: 3), z. B. USA/Kanada-Reise oder weitere UK-Städte (Belfast-Titanic, Bristol, Brighton …) – mit Wörtern (20), Sätzen (8), Szene, Mission, Radio, Lesetext. Grammatik-Faden: if II/III, passive, reported speech, relative clauses, gerund/infinitive. Merge wie trail2 (nach Trail 2, vor Paketen). Prüfen: Karte/Projektion (bei USA eigene Karte nötig → dann lieber weitere Orte in UK/IE).
- ⬜ **3. Prüfungstraining „Cambridge A2 Key / B1 Preliminary“** statt polnischer B1-Prüfung: Teile Reading, Writing (E-Mail 100 Wörter), Listening (TTS), Speaking-Vorbereitung; eigene Aufgaben; Kachel erst ab Klasse 8 oder nach Trail 2.
- ⬜ **4. Weitere Länder Klasse 9/10**: Pakete `s9ind` (Indien), `s10can` (Kanada), `s10saf` (Südafrika) – nur anhängen; dazu Grammatik: Stellung der Adverbiale, Passiv mit zwei Objekten, past perfect progressive.
- ⬜ **5. Wortlisten teilen**: Lehrkraft/Kind kann eine selbst getippte/fotografierte Unit-Liste als Link teilen (Liste komprimiert im Link-Anker `#w=…`, kein Server). Empfänger sieht Vorschau und übernimmt mit Unit. Hinweis: nur eigene Listen, privat teilen.
- ⬜ **6. Themenpakete Alltag (Englisch)**: Reisen, Arzt, Restaurant, Hotel, Notfall, Telefon – für die „Nach Thema“-Ansicht (polnische Vorlage wurde entfernt).
- ⬜ **7. Schulinhalte nur bei Bedarf laden (Vorbereitung für weitere Bundesländer)**: index.html liegt bei ~820 KB. Aufteilen in
  - **Kern** (immer): App, Trail 1, gemeinsame Grammatik-Aufgaben, Interessen.
  - **je Bundesland + Schulart eine Datei** `data-school-<land>-<schulart>.json` (z. B. `data-school-bw-gym.json`): Zuordnung Thema → Klasse, Pakete, Lehrwerke, Startcheck-Auswahl. Geladen wird nur die gewählte Datei (wie data-szlak.json, offline aus dem Service-Worker-Cache). Wechsel lädt die neue Datei nach.
  - Wichtig: Paket-IDs bleiben weltweit eindeutig; gleiche Pakete können in mehreren Ländern vorkommen (nur andere Klassenzuordnung) → Lernstand bleibt beim Wechsel erhalten.
  - Budget danach ≤ 700 KB; Test: Einrichtung lädt nur die gewählte Datei.
- ⬜ **7b. Weitere Schularten in BW**: Realschule (Bildungsplan BW Sek I, Niveau M), Gemeinschaftsschule (G/M/E-Niveau) – Lehrwerke (z. B. Red Line, Highlight, Lighthouse) nur als Namen; Zuordnung der vorhandenen Pakete/Grammatik + fehlende Pakete ergänzen.
- ⬜ **7c. Weitere Bundesländer, Gymnasium** (Reihenfolge nach Schülerzahl): NRW (G9, Kernlehrplan), Bayern (G9, LehrplanPLUS), Niedersachsen, Hessen, Rheinland-Pfalz – je Land: Lehrplan recherchieren (Quelle verlinken), Datei `data-school-<land>-gym.json`, Lehrwerke (Green Line/Access-Länderausgaben), SEO-Seiten je Land, Startseite „weitere Länder folgen“ anpassen.
- ⬜ **7d. Weitere Länder + Schularten** schrittweise (Realschule/Oberschule/Gesamtschule), jeweils erst wenn ein Land vollständig getestet ist.
- ⬜ **8. Design Phase 8**: Raben-Grafik statt Zwerg (`krasnalSvg`), Postkarten-Gestaltung, Startseite mit „Mein Rabe“ als Begleiter.
- ⬜ **9. Muttersprachler-Prüfmodus (`?review`) für englische Texte** anpassen (Polnisch-Reste in den Texten entfernen), damit jemand alle Inhalte gegenlesen kann.
- ⬜ **10. Aufräumen**: alle restlichen polnischen Texte in TX (en-Texte, ausgeblendete Funktionen) entfernen oder ersetzen; `content_check.py` um eine Prüfung „keine polnischen Wörter in sichtbaren Texten“ erweitern.

## Erledigt
- ✅ 06.11.2026 (0.12): Schul-Einrichtung vereinfacht (BW/Gymnasium eingeklappt), Startcheck „Wie fit bin ich?“, Buch/Klasse wechseln mit Warnung + Bestätigung, Unit-Auswahl als Knöpfe (Welcome, Unit 1–6, Extra).

## Ideen-Speicher (noch nicht eingeplant)
- Eltern-Ansicht mit PIN (wie GeoQuest), Klassen-Rangliste über Codes, Sprechprüfung (Kommunikationsprüfung Kl. 10) mit Aufnahme + Checkliste, weitere Bundesländer/Schularten.
