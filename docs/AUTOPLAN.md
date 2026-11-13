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
- ✅ 13.11.2026 **1. Live-Prüfung**: Seite liefert 0.12, unbekannte Pfade 404 (Änderung vom 09.11.). Feedback-Tabelle noch nicht vorhanden → übersprungen. Hinweis: Die Samstagsläufe am 07.11. haben nichts veröffentlicht (PC vermutlich aus).: english.arndt-software.de prüfen (aktuelle Version ausgeliefert, keine JS-Fehler). Falls Andre die Tabelle `et_feedback` angelegt hat und ein Weg zum Lesen besteht: Meldungen auswerten und Fehler beheben (sonst überspringen).
- ✅ 13.11.2026 (0.13) **2. Schulinhalte nur bei Bedarf laden** – erledigt: `data-school-bw-gym.json` (build.py, Felder `land`/`stype` an Paketen, Standard bw/gym), `needSchool`, index.html 822 → 720 KB, Budget 760 KB. Noch offen für Schritt 9: Grammatik-Zuordnung je Land (TOPICS-Klassen) ebenfalls in die Land-Datei. (Vorbereitung für weitere Bundesländer)**: index.html liegt bei ~820 KB. Aufteilen in
  - **Kern** (immer): App, Trail 1, gemeinsame Grammatik-Aufgaben, Interessen.
  - **je Bundesland + Schulart eine Datei** `data-school-<land>-<schulart>.json` (z. B. `data-school-bw-gym.json`): Zuordnung Thema → Klasse, Pakete, Lehrwerke, Startcheck-Auswahl. Geladen wird nur die gewählte Datei (wie data-szlak.json, offline aus dem Service-Worker-Cache). Wechsel lädt die neue Datei nach.
  - Wichtig: Paket-IDs bleiben weltweit eindeutig; gleiche Pakete können in mehreren Ländern vorkommen (nur andere Klassenzuordnung) → Lernstand bleibt beim Wechsel erhalten.
  - Budget danach ≤ 700 KB; Test: Einrichtung lädt nur die gewählte Datei.
- ✅ 13.11.2026 (0.13) **3. Trail 3 (B1)**: `content/trail3.py` – 12 Orte (gcw, abd, iom, hdw, shf, ntm, nrw, ply, swa, kil, klk, bnv) mit Buch „The Raven's Key“ (12 Kapitel, je 3 Fragen), Missionen, Radio. Polnische B1-Prüfung per `EXAM_ON = false` ausgeblendet bis Punkt 4.
- ✅ 13.11.2026 (0.13) **4. Prüfungstraining Cambridge**: Tab `exam` umgebaut – Stufe A2 Key / B1 Preliminary (`S.exLv`, Ergebnisse `S.cam[lv]`), Hören/Grammatik nach Stufe, Lesen A2 = Emmas Postkarten (Wo war Emma?), B1 = Buchkapitel, eigene Schreib-/Sprechaufgaben auf Englisch, Kriterien englisch, Rabe statt Zwerg. Kachel immer sichtbar.
- ✅ 13.11.2026 (0.13) **5. Weitere Länder Klasse 9/10**: Pakete s9ind, s10can, s10saf + Grammatik pastperfprog, advorder, passive3 (16 Aufgaben). (Punkt 4 Prüfungstraining zurückgestellt, kommt als Nächstes.)
- ✅ 13.11.2026 (0.13) **6. Wortlisten teilen**: `C.wordShareEncode/Decode` (Base64url im Anker `#w=`, max. 80 Wörter), Knopf „Liste teilen“ je Unit im Schulbereich, Import-Seite `wimport` mit Vorschau (auch vor dem Onboarding). Außerdem: aktuelle Unit im Buch + Grammatik je Unit (Andres Wunsch).
- ✅ 13.11.2026 (0.13) **7. Themenpakete Alltag**: `content/alltag.py` – a_travel, a_doc, a_rest, a_hotel, a_emer, a_phone (pack + alt), in Themen reisen/arzt/essen + neues Thema „notfall“; werden mit data-szlak.json nachgeladen (index.html bleibt 749 KB).
- ✅ 13.11.2026 (0.14) **8. Weitere Schularten in BW** – Realschule + Gemeinschaftsschule nach Sek I (Niveau M), gleiche Pakete mit eigener Klassen-Zuordnung (`SEK1_PACKS/SEK1_TOPICS`), Codes mit S, Lehrwerke Red Line/Highlight, neues Paket Arbeitswelt (s9job), SEO-Seite Realschule. Ursprünglich:: Realschule (Bildungsplan BW Sek I, Niveau M), Gemeinschaftsschule (G/M/E-Niveau) – Lehrwerke (z. B. Red Line, Highlight, Lighthouse) nur als Namen; Zuordnung der vorhandenen Pakete/Grammatik + fehlende Pakete ergänzen.
- 🔶 13.11.2026 (0.15) **9. Weitere Bundesländer, Gymnasium** – NRW ✅ (NW_PACKS/NW_TOPICS, Codes mit N, Lehrwerke Access/Green Line/Camden Town, SEO-Seite). Kernlehrplan-Original noch gegenprüfen. Bayern ✅ (0.18, BY_PACKS/BY_TOPICS, Codes mit B). Niedersachsen ✅ (0.19, Grundzuordnung). Hessen ✅ (0.20, Plan he, Codes mit H). **Nächstes Land: Rheinland-Pfalz.** Ursprünglich: (Reihenfolge nach Schülerzahl): NRW (G9, Kernlehrplan), Bayern (G9, LehrplanPLUS), Niedersachsen, Hessen, Rheinland-Pfalz – je Land: Lehrplan recherchieren (Quelle verlinken), Datei `data-school-<land>-gym.json`, Lehrwerke (Green Line/Access-Länderausgaben), SEO-Seiten je Land, Startseite „weitere Länder folgen“ anpassen.
- ⬜ **10. Weitere Länder + Schularten** schrittweise (Realschule/Oberschule/Gesamtschule), jeweils erst wenn ein Land vollständig getestet ist.
- ⬜ **11. Design Phase 8**: Raben-Grafik statt Zwerg (`krasnalSvg`), Postkarten-Gestaltung, Startseite mit „Mein Rabe“ als Begleiter.
- ⬜ **12. Muttersprachler-Prüfmodus (`?review`) für englische Texte** anpassen (Polnisch-Reste in den Texten entfernen), damit jemand alle Inhalte gegenlesen kann.
- ⬜ **13. Aufräumen**: alle restlichen polnischen Texte in TX (en-Texte, ausgeblendete Funktionen) entfernen oder ersetzen; `content_check.py` um eine Prüfung „keine polnischen Wörter in sichtbaren Texten“ erweitern.

## Erledigt
- ✅ 06.11.2026 (0.12): Schul-Einrichtung vereinfacht (BW/Gymnasium eingeklappt), Startcheck „Wie fit bin ich?“, Buch/Klasse wechseln mit Warnung + Bestätigung, Unit-Auswahl als Knöpfe (Welcome, Unit 1–6, Extra).

## Ideen-Speicher (noch nicht eingeplant)
- ✅ 0.16: Niveau G/M/E, Werkrealschule.
- ✅ 0.17: Abschluss-Training Sek I BW (Kommunikationsprüfung a/b/c mit Note, schriftlich A–E). Nächste Ausbaustufe: Aufnahme/Spracherkennung bei der Präsentation, echte Lesetexte für Teil B.
- Englisch als 2. Fremdsprache (Gymnasium, z. B. Rheinschiene). Oberstufe / berufliche Schulen.
- Sommer 2026: G9-Bildungsplan Englisch (gedehnt, bis Kl. 11) prüfen; Sek I V2 (Kl. 5–7) prüfen.
- Eltern-Ansicht mit PIN (wie GeoQuest), Klassen-Rangliste über Codes, Sprechprüfung (Kommunikationsprüfung Kl. 10) mit Aufnahme + Checkliste, weitere Bundesländer/Schularten.
