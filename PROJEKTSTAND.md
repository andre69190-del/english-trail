# English Trail – Projektstand (laufend gepflegt)

> **Das Gedächtnis des Projekts.** Wird nach jedem Arbeitsschritt aktualisiert, damit die Arbeit über
> mehrere Tage, Sessions, Token-Limits und Kontext-Komprimierungen weiterläuft.
> **Neue Session? Zuerst diese Datei lesen, dann `docs/CLAUDE_SESSION_STARTER.md`.**

- Ordner: `C:\Users\Andre\Desktop\Cowork\EnglishTrail`
- Vorlage: `C:\Users\Andre\Desktop\Cowork\PolskiSzlak` (Version 3.3)

> ⛔ **HARTE REGEL (Andre, 30.10.2026): Die Polnisch-App darf aktuell NICHT geändert werden und muss immer funktionieren.**
> - In `PolskiSzlak` wird nur gelesen, nie geschrieben. Kein Commit, kein Push, kein `hochladen.bat` dort.
> - Live-Seite `polski.arndt-software.de`, ihr GitHub-Repo und ihre Coolify-Ressource bleiben unberührt.
> - Supabase: English Trail bekommt **eigene** Tabellen (`et_*`) und eine **eigene** Edge Function (`et-chat`).
>   `ps_*`-Tabellen und `ps-chat` werden nicht angefasst. SQL-Skripte von English Trail nie mit `drop`/`alter` auf `ps_*`.
> - Eigener localStorage-Schlüssel (`english_trail_v1`) und eigene Domain → kein Konflikt im Browser.
- Arbeitsweise: Arbeitskopie in der Cloud (`/home/claude/EnglishTrail`), nach jedem Meilenstein in den Ordner auf dem PC zurückgeschrieben
- Geplante Adresse: `english.arndt-software.de`

---

## 1. Auftrag (Andre, 30.10.2026)

1. Die Polnisch-App **1:1 mit allen Funktionen** für **Englisch** übernehmen.
2. Zusätzlich **Schulmodus**: Bundesland + Klasse wählen → App stellt den relevanten Schulstoff bereit.
3. Gezielt **Englischbücher** (Lehrwerke) angeben, aus denen man lernt.
4. Stand immer aufschreiben (diese Datei). Neuer Ordner unter Cowork.
5. „Deine Vorschläge setze auch um“ (siehe Abschnitt 3).

## 2. Entscheidungen

| Thema | Entscheidung | Wer/Wann |
|---|---|---|
| Schulmodus Start | **Gymnasium, Baden-Württemberg** | Andre, 30.10. |
| Klassen | **5–10**, später mehr (Kursstufe) | Andre, 30.10. |
| Weitere Länder/Schulformen | später; Datenmodell ist dafür vorbereitet | Andre, 30.10. |
| Name / Ordner | „English Trail“ / `EnglishTrail` (analog Polski Szlak; änderbar) | Claude-Vorschlag, noch nicht bestätigt |
| Basissprache | nur Deutsch (Englisch als Basis ergibt keinen Sinn); Auswahl durch „Aussprache“ ersetzt | Claude |
| Aussprache | Britisch (en-GB) als Standard, umschaltbar auf Amerikanisch (en-US) | Claude |
| Architektur | eigene Kopie der Engine (Polski Szlak bleibt unberührt); sprachspezifisches nur in `src/data.json` + Sprach-Konfig | Claude (Vorschlag „gemeinsamer Kern“ später möglich) |
| Lehrwerke | Struktur (Unit-Themen, Grammatik) abbilden, **keine Verlagstexte/-vokabellisten kopieren**; eigene Vokabeln aus dem Buch eintippen (später Foto) | Claude (Urheberrecht) |
| KI-Gespräch | gleiche günstige Lösung wie Polski Szlak (Supabase-Edge-Function, Groq gratis); im Schulmodus auf Klassenniveau begrenzt | Claude |
| Supabase | eigene Tabellen mit Präfix `et_` (et_progress, et_feedback, et_chat_usage) | Claude |

## 3. Umgesetzte/geplante Vorschläge (Andre: „setze auch um“)

- [x] Lehrplan als Daten (`content/school.py` → `D.school` + Pakete mit `sch`) → neue Länder ohne Code-Änderung
- [x] Klassenarbeits-Trainer: Themen/Pakete wählen → 20 Fragen, 15 Min., Bestwert + Notentendenz
- [x] Aussprache britisch/amerikanisch umschaltbar (alle Hör-Übungen)
- [x] KI-Gesprächspartner auf Klassenniveau (Level K5–K10 in `et-chat`; Server-Teil noch einzurichten)
- [x] Lehrwerk-Auswahl (Green Line BW G9 2025, Green Line BW alt, Access BW G9 2025; Band = Klasse − 4) – [ ] Unit-Auswahl
- [ ] Eigene Buch-Vokabeln eintippen (Phase 5), Foto-Erkennung später prüfen

## 4. Übertragung Polnisch → Englisch (Funktionsliste)

| Polski Szlak | English Trail | Status |
|---|---|---|
| Szlak 1 (12 Städte, A1) | Trail 1: London → Brighton → Bath → Cardiff → Liverpool → Manchester → Lake District → York → Edinburgh → Inverness → Belfast → Dublin | ✅ |
| Szlak 2 (12 Orte, A2) | Trail 2 (12 Orte, A2) – Vorschlag USA/Kanada oder weitere UK-Orte | offen |
| Szlak 3 (12 Orte, B1) | Trail 3 (12 Orte, B1) | offen |
| Themenpakete (Praxis, Notfall, Kleine Wörter, 40 Verben) | gleich (Praxis-Englisch Physio, Notfall, Little words, Top-Verben) | offen |
| Fall-Werkstatt (`cases`, 108) | **Zeiten-Werkstatt**: 118 Aufgaben, 24 Grammatik-Themen, jede mit Klasse (5–10) für den Schulmodus | ✅ |
| Konjugation (`verbs`, 40) | **Unregelmäßige Verben**: 71 Verben, 4 Muster (aaa/aba/abb/abc), Abfrage 2./3. Form | ✅ |
| Verbaspekt (`aspects`) | **Simple vs. Progressive**: 18 Aufgaben | ✅ |
| Laut-Detektiv (`sounds`) | 27 englische Laute (th, w/v, stummes k, -ed …) | ✅ |
| Preise hören (Złoty) | Preise hören (£/$) | offen |
| Zungenbrecher | 19 englische Zungenbrecher | ✅ |
| Krasnale (Sammelzwerge) | 24 **Tower-Raben** (je ein Beruf = ein Wort) | ✅ (Grafik noch Zwerg → Phase 8) |
| Polska-Quiz (`culture`) | UK/USA/Irland: 9 Fakten, 30 Personen, 40 Wahr/Falsch, 26 Jahreszahlen, 30 Orte, 6 Höher/Tiefer | ✅ Grundstock (Ausbau auf je 100 in Phase 6) |
| Państwa-Miasta (`pm`) | Stadt-Land-Fluss auf Englisch: 8 Kategorien, 12 Buchstaben | ✅ |
| Dla Polaków (`polacy`, 600 Fragen) | **Profi-Bereich**: False Friends, typische Fehler, Phrasal Verbs, Idioms, Spelling, Wissen | offen |
| Der Brief / Brief-Quiz / Tagebuch / Buch | Brief von Emma (Dublin), Bote: Rabe Rufus ✅; Tagebuch (Trail 2) + Buch (Trail 3) offen | teilweise |
| Missionen, Radio-Links (`listen`) | englische Alltagsmissionen, BBC/NPR-Links | offen |
| Sprecherform m/f | entfällt (Auswahl entfernt, Engine bleibt) | ✅ |
| Duell-Code, Familienduell, Gegenüber, Rangliste | unverändert übernehmen | offen |
| Tagesrätsel, Blitz 60, Memory, Fehlerheft, Meine Wörter, SRS | unverändert übernehmen | offen |
| Geräte-Abgleich Supabase, KI-Gespräch, Prüfmodus | übernehmen, eigene Tabellen/Function | offen |
| PWA, Impressum, Datenschutz, Checks, Tests, GitHub-Actions | übernehmen, umbenennen | offen |

## 5. Schulmodus – Konzept

Ablauf: **Bundesland → Schulform → Klasse → Lehrwerk (optional) → Unit (optional)**.
Aktiv zuerst: Baden-Württemberg · Gymnasium · Englisch 1. Fremdsprache · Klassen 5–10.

Grundlage: Bildungsplan 2016 BW, Gymnasium, Englisch als 1. Fremdsprache (Standards je Doppeljahrgang 5/6, 7/8, 9/10).
Recherche-Notizen: `content/schule/RECHERCHE_BW.md`.

Pro Klasse: Lernpakete aus Wortschatz (Themen des Bildungsplans), Grammatik-Werkstatt (Strukturen des Doppeljahrgangs),
Satzbau, Hörverstehen, Szenen, Klassenarbeits-Trainer, eigene Vokabeln.

Datenmodell (geplant, `src/data.json` → `school`):
```jsonc
"school": {
  "states": [{ "id": "bw", "name": "Baden-Württemberg", "active": 1,
    "types": [{ "id": "gym", "name": "Gymnasium", "grades": [5,6,7,8,9,10],
      "books": [{ "id": "gl-bw", "name": "Green Line (Klett), Ausgabe BW", "units": { "5": [ {id, title, topics, grammar[]} ] } }],
      "plan": { "5": { "topics": [...], "grammar": ["g-simple-present", ...] } } }] }],
  "grammar": { "g-simple-present": { "t": "Simple present", "items": [ {s, opts, a, why, tr} ] } },
  "packs": { "bw-gym-5-family": { "words": [[en, de]], "sentences": [[en, de]] } }
}
```

## 6. Phasenplan

| Phase | Inhalt | Status |
|---|---|---|
| 0 | Vorlage analysiert, Ordner + Statusdatei angelegt, BW-Lehrplan recherchiert | ✅ 30.10. |
| 1 | Engine umstellen: Name, Speicher-Schlüssel, Sprache en-GB/en-US, Basissprache fest DE, UI-Texte, Icons/Manifest, Checks | ✅ 30.10. (Icons/Farben: Feinschliff in Phase 8) |
| 2 | Inhalte Trail 1 (A1, 12 Orte) + Karte Großbritannien/Irland | ✅ 30.10. (Brief, Brief-Quiz, Missionen, Radio inkl.) |
| 3 | Übergreifende Inhalte: Zeiten-Werkstatt, unregelmäßige Verben, Laute, Zungenbrecher, Raben, Quiz, Stadt-Land-Fluss | ✅ 31.10. |
| 4 | Schulmodus: Onboarding + Datenmodell + BW Gym 5–10 Grammatik/Wortschatz | ✅ 01.11. |
| 5 | Lehrwerke + eigene Vokabeln + Klassenarbeits-Trainer | teilweise ✅ (Lehrwerk-Auswahl + Band, Probe-Klassenarbeit, eigene Vokabeln über „Meine Wörter“); offen: Unit-Liste je Lehrwerk, Vokabeln je Unit taggen, Foto-Erkennung |
| 6 | Trail 2 + 3, Themenpakete, Profi-Bereich, Brief/Buch/Tagebuch | offen |
| 7 | KI-Gespräch Englisch, Supabase-Tabellen, Prüfmodus | offen |
| 8 | Tests (Node + Browser), Doku, Handy-Test im WLAN | offen |
| 9 | Veröffentlichung english.arndt-software.de (GitHub, Coolify, Impressum/Datenschutz) | offen |

## 7. Erledigt (Log)

- 30.10.2026 23:20 – Vorlage Polski Szlak 3.3 kopiert (ohne Audio, .git, Backups); Build + alle Checks + 48 Tests grün als Ausgangsbasis.
- 30.10.2026 – Polnisch-spezifische Doku entfernt (Arbeitsstand, Änderungsprotokoll, Magdalena-Prüfung, B1-Roadmap, Audio-Tools).
- 30.10.2026 – BW-Bildungsplan Englisch Gym (5/6, 7/8, 9/10) recherchiert → `content/schule/RECHERCHE_BW.md`.

- 30.10.2026 – **Phase 1 fertig:** Name/Marke English Trail, Speicher-Schlüssel `english_trail_*`, Sprachausgabe + Spracherkennung en-GB/en-US (Einstellung „Aussprache“ im Onboarding und unter Ich), Basissprache fest Deutsch, Sprecherform-Auswahl entfernt, UI-Texte (Deutsch) auf Englisch-Kontext umgestellt, Supabase-Namen `et_progress`/`et_feedback`/`et-chat`, Shell/Manifest/SW/Docker/Skripte umbenannt. Polnische App-Stimmen (Tondateien) deaktiviert.
- 30.10.2026 – **Phase 2 fertig:** Trail 1 (12 Orte, 229 Wörter, 108 Sätze, 12 Szenen) in `content/trail1.py`, eingemischt mit `content/merge.py`; Karte Großbritannien + Irland (zwei Umrisse, neue Projektion in core.js); Brief von Emma + 8 Quizfragen; Missionen + BBC/RTÉ-Radio je Ort. Fortschritts-Schutz neu angelegt.
- 30.10.2026 – Alle Checks grün, 48 Logik-Tests grün, Browser-Test 111 OK / 0 Fehler.

- 31.10.2026 – **Phase 3 fertig:** `content/grammar.py` (Zeiten-Werkstatt, Simple/Progressive, unregelmäßige Verben – Verb-Modus in app.js neu: Grundform/2./3. Form), `content/extras.py` (Laute, Zungenbrecher, Raben, Stadt-Land-Fluss, Land & Leute). Checks + Tests angepasst. Alle Checks grün, 48 Logik-Tests, Browser 113 OK / 0 Fehler. Größenbudget vorübergehend 700 KB (sinkt, wenn die Vorlage-Reste raus sind).
- Hinweis: `.github/workflows/checks.yml` ist auf dem PC geschützt und konnte nicht geschrieben werden – beim GitHub-Einrichten aus PolskiSzlak kopieren (Name im Kommentar anpassen).

- 01.11.2026 – **Phase 4 fertig (Schulmodus):** Kachel „🎒 Schule“ unter Üben + Onboarding-Antwort „Schule“. Einrichtung: Bundesland (16, nur BW aktiv), Schulform (nur Gymnasium aktiv), Klasse 5–10, Lehrwerk. Übersicht je Klasse: 3 Wortschatz-Pakete (18 Pakete, 288 Wörter, 108 Sätze, 18 Szenen, eigene Inhalte nach Bildungsplan-Themen) – öffnen als normale Lektion mit allen Modi; Grammatik des Doppeljahrgangs + „Wiederholen“; Probe-Klassenarbeit; Hinweis auf eigene Buch-Vokabeln; KI-Gespräch auf Klassenniveau. Tests: 49 Logik, Browser 123 OK / 0 Fehler.

- 01.11.2026 – **Vor der Veröffentlichung bereinigt:** Alle noch polnischen Vorlage-Teile entfernt (Trail 2/3, Pakete, Profi-Bereich, Tagebuch, Buch, B1-Prüfung, polnische Rechtschreib-Kachel). Neu: Preise hören in Pfund (£3.50 = three pounds fifty), Thema „Schule“, englische Hör-Links (BBC, British Council). Version 0.1. Alle Checks grün, 47 Logik-Tests, Browser 100 OK / 0 Fehler, Scan: keine polnischen Texte mehr sichtbar.
- 01.11.2026 – **Veröffentlichung vorbereitet:** `einrichten_github.bat` (einmalig: Repo + erster Upload + Windows-Aufgabe), `auto_hochladen.bat/.vbs` (alle 10 Min., lädt nur hoch, wenn `RELEASE.txt` geändert wurde = geprüfte Version), `auto_hochladen_aus.bat`. Startseiten-Karte English Trail vorbereitet (`homepage/index.html`, wird erst nach dem Live-Gang geschrieben).

- 01.11.2026 08:24 – **LIVE:** https://english.arndt-software.de (GitHub `andre69190-del/english-trail`, Coolify Dockerfile, Webhook). Andre hat `einrichten_github.bat` ausgeführt; der automatische Upload hat um 08:25 englisch-trail **und** homepage gepusht (auto_hochladen.log). Polski Szlak geprüft: unverändert online.
- 01.11.2026 – Startseiten-Karte English Trail ins homepage-Repo gepusht – auf arndt-software.de aber noch nicht sichtbar → homepage in Coolify neu deployen / Auto-Deploy prüfen (Andre).
- 01.11.2026 – **Version 0.2 (Phase 5 Teil 2):** Eigene Buch-Vokabeln mit Unit markieren („Meine Wörter“ zeigt im Schulmodus ein Feld „Unit“), Bereich Schule listet die Units → gezielt üben; Units in der Probe-Klassenarbeit wählbar. Verlags-Unit-Listen bewusst nicht übernommen (Urheberrecht, nicht frei verfügbar) – die Unit-Namen gibt der Schüler selbst ein. Browser-Test 103 OK / 0 Fehler.

- 01.11.2026 – **Recherche Schule/Motivation** (Elternforen, r/duolingo, ANTON-Test, Stiftung Warentest, Schul-Merkblätter): `docs/SCHULE_RECHERCHE_MOTIVATION.md` mit Lückenliste A–H.
- 01.11.2026 – **Version 0.3:** (A) Probe-Klassenarbeit mit Hörverstehen, Leseverstehen, Sprachmittlung; Schreibauftrag je Paket mit Checkliste (Länge, Pflichtwörter, Verbindungswörter, Großschreibung, „I“). (B) Vokabelliste einfügen (`word = Wort`, `-`, Tab, `;`) mit Unit. Tests: 50 Logik, Browser 106 OK.

- 01.11.2026 – **Version 0.4:** Wochen-Challenge der Klasse (Code `WEEK-nnn-2-K<Klasse>`, Mo–So gleich), Duell-Code mit Schulstoff (`…-K7`), Gegenüber mit Quelle Trail/Klasse/Buch-Unit, Kurzwege im Bereich Schule, 8 Interessen-Pakete (frei wählbar), Duell-Wörter englisch (FOX, CASTLE …). GeoQuest geprüft (Live-1vs1 per Supabase-Broadcast, anonyme Anmeldung, Liga) → Plan Live-Duell siehe docs/SCHULE_RECHERCHE_MOTIVATION.md. Tests: 51 Logik, Browser 113 OK.
- **Lernstände bleiben erhalten (Regel ab 0.1 live):** localStorage-Schlüssel `english_trail_v1` nie ändern; Einheiten/Wörter nur anhängen, nie umsortieren/löschen (`checks/progress_lock.py` bricht sonst ab); neue Felder nur mit Standardwert; automatische Sicherung vor jedem Update (aus Polski Szlak 3.2) bleibt aktiv.

## Ablauf „automatisch online“ (ab 01.11.2026)
1. Claude ändert, baut, testet (alles grün) → schreibt die Dateien in den Ordner auf dem PC und **zuletzt** `RELEASE.txt` mit neuer Versionsnummer.
2. Die Windows-Aufgabe „English Trail Auto-Upload“ merkt die neue RELEASE.txt (spätestens nach 10 Minuten) → `git commit` + `git push` nach github.com/andre69190-del/english-trail.
3. GitHub-Webhook → Coolify baut https://english.arndt-software.de neu (ca. 1–2 Minuten).
4. Handys holen die neue Version beim nächsten Öffnen (Service Worker network-first; `CACHE_NAME` in sw.js bei jeder Version erhöhen).

## 8. Nächster Schritt

1. ✅ Live-Gang erledigt (01.11.).
1b. **Schulmodus fertig bauen (Andre, 01.11.: zuerst!):** ✅ D Klassen-Challenge, ✅ F Interessen. Offen: **Live-Duell 2 Handys (GeoQuest-Art, ohne Konto)**, C Mein Rabe (gestalten, Federn), E Hausaufgaben-Code für Lehrkräfte, G Eltern-Bericht + Datenschutz U16, H Emojis Kl. 5/6. Danach erst Phase 6.
2. Optional Phase 5: Foto-Erkennung für Buch-Vokabeln (Texterkennung im Browser) prüfen.
3. Phase 6: Trail 2 (A2) + Trail 3 (B1) auf Englisch, Themenpakete, Profi-Bereich, Tagebuch/Buch, B1-Probeprüfung (englisch), Prüfmodus-Texte (?review) auf Englisch.
4. Phase 8: Optik (Farben/Logo, Rabe statt Zwerg-Grafik).

## 9. Offene Punkte beim Nutzer

- Name „English Trail“ bestätigen oder anderen nennen.
- Optional später: englische Gratis-Stimmen (Piper) als Tondateien wie bei Polski Szlak – vorerst spricht die Gerätestimme.
- Später: Supabase-SQL ausführen, Coolify-Ressource anlegen (wie bei Polski Szlak).

## Release 0.5 (01.11.2026)
- ✅ Live-Duell fertig (app.js/core.js, Tests grün).
- ✅ Geprüft: Tabellen `et_feedback` und `et_progress` gibt es auf supabase.arndt-software.de noch NICHT (404 PGRST205) → Fehlermeldungen landen derzeit nur per Mail/Kopie. Andre muss `deploy/supabase_et_feedback.sql` (+ progress, chat) im Studio ausführen. Supabase-MCP hat keinen Token (Unauthorized).
- ✅ Fehler melden kinderleicht: 5 Tipp-Kategorien (`rep_c1..5`), Text freiwillig; letzte JS-Fehlermeldung wird an ctx angehängt; einmaliger Hinweis-Toast `rep_oops`; Melde-Box auch im Schulbereich (`rep-sch`).
- ✅ Übersicht „Was kann English Trail?“ (`renderGuide`, Tab `guide`, Daten `extras.GUIDE` → `D.guide`), verlinkt unter Ich, auf „Was ist neu“ und im Schulbereich.
- ✅ APP_VER 0.5, sw v0-6, NEWS 0.5, datenschutz.html (Live-Duell, Kinder U16, Polnisch-Reste Gosia/Darek entfernt).
- ✅ Fehler behoben: Senden-Knopf war an den ersten Chip gebunden (`querySelector('button')` → `button.btn`). Alle Checks, 52 Core-Tests, UI-Test 125 OK / 0 Fehler.
- ✅ Release 0.5 auf PC synchronisiert (RELEASE.txt zuletzt) → Auto-Upload veröffentlicht.
- Nächste Schritte: Andre führt et_*-SQL aus; dann C Mein Rabe, E Hausaufgaben-Code, G Eltern-Bericht, H Emojis Kl. 5/6; danach Phase 6.

## Release 0.6 (01.11.2026)
- ✅ E Hausaufgaben-Code: `C.hwCode/hwParse/maskOf/fromMask`, Format `HA<Kl>-P<Pakete36>-T<Themen36>`; Bitmasken über `schPacks(g)` und `Object.keys(D.school.topics)` → **beide Listen nur anhängen, nie umsortieren** (sonst ändern alte Codes ihre Bedeutung). Fragen deterministisch über `C.rng('hw|'+code)`. Ergebnis in `S.hwDone`.
- ✅ G Eltern-Bericht (`parentReport`, Schulbereich, teilen) + U16-Bestätigung beim Konto anlegen (`sy-u16`, `S.u16ok`).
- ✅ H Emojis Klasse 5/6 (`school.EMOJI` → `u.em`, `emOf(q)`; nicht wenn das Bild die Lösung verrät). lang-Attribut der Frage 'pl' → 'en' korrigiert.
- Tests: 53 Core, UI 131 OK / 0 Fehler.
- ⚠️ **Live-Seite steht noch auf 0.1!** GitHub hat alle Commits (0.2–0.6), aber Coolify baut nicht neu (Webhook fehlt/greift nicht). Andre informiert: Coolify → App → Webhooks (GitHub-Secret) + GitHub → Settings → Webhooks, dann Redeploy. Danach prüfen: sw.js enthält `english-trail-v0-7`.
- Offen Schule: C Mein Rabe. Danach Phase 6.

## 0.6.1 (01.11.2026) – Polnisch-Reste nach Andres Hinweis („Los nach Warszawa“)
- ob_go → „Los nach London“; polnische Sonderzeichen-Leiste (`plKeys`) aus; Akzentfarbe `--red` jetzt Blau (#1d4f91 / dunkel #8fb6ff); Marke + Icons blau (aus icon.svg per Chromium neu gerendert); Trail-1-Markierungen rot↔blau getauscht (sah aus wie Polen-Flagge). IDs unverändert → Fortschritt bleibt.
- Noch polnische Texte nur in ausgeblendeten Teilen (B1-Prüfung, Tagebuch, en-Texte der Basis „en“ – Basis ist immer Deutsch). Bei Phase 6 bereinigen.

## Live-Prüfung 01.11.2026 12:30
- ✅ english.arndt-software.de liefert 0.6.1 (sw `english-trail-v0-8`) → Coolify baut wieder automatisch.
- ✅ Live-Duell echt über supabase.arndt-software.de getestet (2 Tabs, Code RAVEN-551-1): Verbinden, Bereit, gleiche Frage, Punkt an den Richtigen (1:0 / 0:1), nächste Frage, Verlassen → Ergebnis.
- ⏳ `et_feedback` fehlt weiterhin (404) → Andre: `deploy/supabase_et_feedback.sql` im Studio ausführen.
- Nächster Schritt: C „Mein Rabe“, danach Phase 6.

## Release 0.7 (01.11.2026) – C „Mein Rabe“ ✅ → Schulbereich (A–H) komplett
- Tab `raven` (`renderRaven`, `ravenSvg`, `RV_PARTS`), Karte im Album und im Schulbereich (`ravenCard`).
- Federn = floor(XP/50) + 2 × gefundene Raben − ausgegeben (berechnet, nicht gespeichert → kann nicht verloren gehen). Gespeichert nur `S.raven = {on, own, name}` (neues Feld, Standardwerte bei Bedarf).
- **RV_PARTS nur ergänzen, nie Kosten senken/IDs ändern** (sonst stimmen ausgegebene Federn nicht).
- CSS-Fix: gewählte Chips in `.seg` hatten Text in Hintergrundfarbe (betraf auch Fehler-melden-Kategorien und Übersicht-Reiter).
- Tests: UI 134 OK / 0 Fehler, Core 53.
- Nächster Schritt: Phase 6 (Trail 2/3 auf Englisch, Themenpakete, Profi-Bereich, Tagebuch/Buch, B1 → für Schule eher „Cambridge A2 Key / B1 Preliminary“-Training), dann Phase 8 Design.

## Release 0.8 (01.11.2026) – Phase 6 Teil 1: Trail 2 (A2)
- `content/trail2.py`: 12 Orte (oxf, cam, str, sth, cnt, siv, snw, gla, sky, gal, crk, ncl) mit `r: 2`, je 20 Wörter, 8 Sätze, Szene, Mission, Radio, Emmas Postkarte (`D.diary`). Grammatik-Faden: going to, Wegbeschreibung, -ed/-ing, simple past, must/mustn’t, Wetter/Kleidung, Vergleiche, present perfect, should, Einladungen, much/many, will.
- **Wichtig (Fehler gefunden):** Trail 2/3 werden aus `data-szlak.json` nachgeladen (build.py). Die Datei war in .gitignore und nicht im Dockerfile → jetzt im Repo, im Dockerfile und im Service-Worker-Cache.
- progress_lock aktualisiert: 50 Orte, 885 Wörter.
- Nächste Schritte: Abgleich Bildungsplan BW + Lehrwerks-Units (Andres Auftrag 01.11. 12:59), SEO/Google, Trail 3 (B1) + Cambridge-Training.

## Release 0.9 (01.11.2026) – Abdeckung BW + Google
- Abgleich Bildungsplan → `content/schule/ABDECKUNG_BW.md`. 7 neue Pakete (s5fam, s5day, s6wea, s7rol, s8his, s9aus, s10sus, hinten angehängt), 10 neue Grammatik-Themen (60 Aufgaben, TOPICS hinten angehängt).
- Google: statische Seiten `englisch-gymnasium-bw.html`, `englisch-klasse-5…10.html` (tools/seo_pages.py, nach Inhaltsänderungen neu erzeugen), sitemap.xml mit allen Seiten, JSON-LD, Footer-Link in der App. Seite war bei Google noch nicht gefunden (neu). Andre: Google Search Console → Domain-Property arndt-software.de, Sitemap einreichen.
- Impressum: Polnisch-Rest „Stimmen Gosia/Darek“ entfernt. perf-Budget 820 KB.
- Tests: UI 134 OK, Core 53.

## Release 0.10 (01.11.2026) – Vokabeln per Foto
- „Meine Wörter“ (+ Knopf im Schulbereich): Foto der Vokabelseite → tesseract.js (selbst gehostet in `ocr/`, eng+deu best_int, ~8 MB, erst bei Nutzung geladen) → `C.ocrRows` (Schräglage ausgleichen, Zeilen bilden) → `C.ocrToList` (Spalten über Lücken, Lautschrift [..] /../ raus, Überschriften raus) → Textfeld „Liste einfügen“ zum Prüfen → mit Unit speichern. Foto verlässt das Gerät nicht.
- Dockerfile `COPY ocr`, nginx-Cache für /ocr/, Datenschutz ergänzt, Testbild `tests/fixtures/vokabelseite.jpg` (eigene Wörter, schräg+unscharf).
- Tests: Core 57, UI 136 OK.
- Grund ohne Verlagslisten: Unit-Vokabellisten sind urheberrechtlich geschützt (Sammelwerk/Datenbank); privat abfotografieren/abtippen ist ok. Andre fragt ggf. Klett/Cornelsen nach Lizenz.
- 0.10 live geprüft 01.11. 14:06: OCR-Dateien und SEO-Seiten werden echt ausgeliefert; Foto-Test auf der Live-Seite 6/6 Wörter in ~2 s. 0.10.1: Lesefehler ü→„ii“ im Deutschen wird korrigiert.

## Release 0.11 (02.11.2026) – Selbst schreiben
- Kachel „✍️ Selbst schreiben“ (Üben, Modus `selfwrite`): alle Wörter mit Karteikarte (auch eigene/Foto-Wörter), Fehlerwörter und niedrige Boxen zuerst, nur Eintippen (`q.forceWrite = 1`), Hilfe „Anfangsbuchstabe“, Bestwert `S.swBest`.
- „Schreib-Momente“ im Antipp-Modus: Wörter mit Box ≥ 2 werden mit 30 % Chance zur Schreibfrage (`q.forceWrite = 2`), max. 2 pro Runde, nie in Duellen/Live/Zeit/Probe-Arbeit. Abschaltbar unter Ich (`S.writeMix`, Standard an).
- perf-Budget 880 KB. Tests: UI 138 OK.
- 0.11.1: Extra-Federn fürs Selbstschreiben – `S.wrOk` (+1 je richtig geschriebenem Wort mit `forceWrite`, +0,5 mit Anfangsbuchstaben-Hilfe), `rvEarned` + floor(wrOk/5). Toast bei neuer Feder. UI 139 OK.

## Release 0.12 (06.11.2026) – Schule einfacher, Startcheck, Wechsel mit Bestätigung
- Einrichtung: Bundesland/Schulart eingeklappt (nur BW-Gymnasium aktiv), Klasse + Buch reichen.
- Startcheck (`scheck`, `startSchoolCheck`): 1 Aufgabe je Grammatikthema bis Klasse g (max. 16) + 4 Wörter der Vorjahre, keine Note; Ergebnis `S.schCheck[g] = {pct, d, weak}`, schwache Themen im Schulbereich verlinkt; nach der ersten Einrichtung angeboten (`SCH.offerCheck`).
- Klasse/Buch ändern: `SCH.prev` beim Klick auf „Ändern“; Speichern mit anderer Klasse/Buch → Warnkarte `#sc-conf` (Ja, wechseln / Abbrechen); Zurück/Abbrechen stellt den alten Stand her. Nichts geht verloren.
- Meine Wörter: Unit-Knöpfe Welcome, Unit 1–6, Extra.
- Fehler behoben: zweiter Tab hat beim Speichern im anderen Tab die Seite neu gezeichnet (Eingaben weg, Live-Duell gestört) → kein Neuzeichnen beim Tippen/Live-Duell.
- Samstags-Aufgabe „English Trail Samstags-Weiterarbeit“ (14:53 Uhr, PC muss an sein) arbeitet `docs/AUTOPLAN.md` ab.
- Tests: UI 144 OK (2× hintereinander), Core 58.

## Release 0.13 (13.11.2026) – Trail 3, Schulinhalte nachladen, neue Länder
- Übernommen aus GitHub (Änderungen vom 09.11. auf dem PC): nginx 404 für unbekannte Pfade, sichtbarer „Über English Trail“-Text (shell.html/app.css/app.js `in-play`).
- **Schulpakete nur bei Bedarf**: build.py schreibt `data-school-<land>-<schulart>.json` (bisher nur bw-gym, Felder `land`/`stype` am Paket, Standard bw/gym), Kern enthält `schoolLazy` + `schoolIds`. App: `needSchool`, `schoolReady`, `needsSchoolData` (lädt beim Start, wenn Schule gewählt oder Schulwörter gelernt), Schutz in Schule/Themen/Duell-/Live-Codes mit -K. Pakete werden hinten angehängt (Reihenfolge innerhalb der Datei bleibt → Hausaufgaben-/Duell-Codes stabil). Dockerfile kopiert `data-school-*.json`. index.html 822 → 734 KB (Budget 760).
- **Trail 3 (B1)**: `content/trail3.py`, 12 Orte + Buch „The Raven's Key“ (`D.book`, `u.read`), Missionen, Radio. Polnische B1-Prüfung ausgeblendet (`EXAM_ON = false`).
- **Klasse 9/10**: Pakete s9ind, s10can, s10saf; Grammatik pastperfprog, advorder, passive3.
- **Prüfungstraining Cambridge** (A2 Key / B1 Preliminary) ersetzt die polnische B1-Prüfung: `exLv`, `EX.rd`, `S.cam`, englische Schreib-/Sprechaufgaben und Kriterien.
- **Aktuelle Unit im Buch** (Andres Hinweis 13.11.): Einrichtung „Wo seid ihr gerade?“ (`S.school.unit`, Welcome/Unit 1–6), Karte `schCurBox` oben im Schulbereich (Unit üben, Foto, „Wir sind jetzt bei Unit x“), Grammatik je Unit wählbar (`S.unitGram[unit]`), Modus `sunit` mischt Unit-Wörter + gewählte Grammatik (geht auch ohne Wörter).
- **Wortlisten teilen** per Link `#w=…` (kein Server), Import-Seite mit Vorschau; Datenschutz ergänzt.
- **Alltags-Pakete** (content/alltag.py, 6 Pakete) für „Nach Thema“, nachgeladen über data-szlak.json.
- Tests: UI 158 OK, Core 59. progress_lock 78 Einheiten, 1381 Wörter. progress_lock: 72 Orte/Pakete, 1285 Wörter.
- Hinweis: Samstagsläufe 07.11. haben nichts veröffentlicht (PC nicht verbunden). Am 13.11. war der PC ebenfalls nicht verbunden → Dateien liegen fertig in /mnt/user-data/outputs/EnglishTrail und müssen auf den PC.

## Release 0.14 (13.11.2026) – Realschule + Gemeinschaftsschule BW, Kamera-Knopf
- **Schularten Realschule und Gemeinschaftsschule** aktiv (`TYPES` on, `TYPE_PLAN` → Plan `sek1`). Grundlage: gemeinsamer Bildungsplan Sekundarstufe I BW 2016, Englisch, **Niveau M** (Standards Ende Kl. 6, 9, 10). Recherche: `content/schule/RECHERCHE_BW_SEK1.md`.
- **Gleiche Pakete und Aufgaben wie am Gymnasium** (gleiche IDs → Lernstand bleibt beim Schulart-Wechsel), nur andere Klassen-Zuordnung: `school.SEK1_PACKS` (Paket → Klasse) und `school.SEK1_TOPICS` (Thema → Klasse, `None` = nur E-Niveau, z. B. past perfect progressive). merge.py prüft, dass beide vollständig sind. Daten: `D.school.plans.sek1 = {p, t}`, `types[].plan`.
- build.py: `bw-rs`/`bw-gms` zeigen auf **dieselbe Datei** `data-school-bw-gym.json`.
- core.js: `schGradeOf`, `schLoOf`/`schHiOf` (Sek I: 5/6, 7/8/9, 10). Codes mit **S** statt K für Sek I: Duell `FOX-123-1-S8`, Woche `WEEK-…-2-S8`, Hausaufgabe `HA8S-P…-T…`. Gymnasium-Codes unverändert.
- app.js: `schPlan`, `schGrade`, `topK`, `schPacks(g, plan)`, Startcheck/Gegenüber/KI-Level nach Plan. Einrichtung: **Schulform als Knöpfe sichtbar** (Bundesland weiter eingeklappt), Lehrwerke je Schulart (`books[].ty`): Realschule/GMS → Red Line (Klett, 2014), Highlight (Cornelsen BW); Wechsel der Schulart mit Sicherheitsfrage.
- Neues Paket **s9job „Berufe, Praktikum und Bewerbung“** (Gym Kl. 9, Sek I Kl. 8; hinten angehängt).
- **Kamera-Knopf** (Andres Frage 13.11.): Startkarte „Aktuell im Buch“ → „📷 Vokabelseite fotografieren“ öffnet direkt die Kamera (primär/blau, solange die Unit leer ist), danach Prüfen unter „Meine Wörter“. In „Meine Wörter“ steht das Foto jetzt **vor** dem Eintippen (großer Knopf).
- SEO: `englisch-realschule-bw.html` (Dockerfile, sitemap, Links in shell.html + Footer).
- perf-Budget 780 KB (index.html 756 KB). Tests: Core 60, UI 168 OK (2× hintereinander).
- Offen/Idee: GMS mit Niveauwahl G/M/E (E ≈ Gymnasium-Zuordnung), Werkrealschule (Niveau G) – siehe AUTOPLAN.

## Release 0.15 (13.11.2026) – Nordrhein-Westfalen, Gymnasium (G9)
- Datenmodell verallgemeinert: `school.COMBOS` (freigeschaltete Bundesland-Schulart-Paare: bw-gym, bw-rs, bw-gms, nw-gym), `PLAN_OF` (Kombination → Plan), `BOOK_WHERE` (Lehrwerk → Kombinationen; `books[].k`). `TYPE_PLAN`/`BOOK_TYPES` aus 0.14 ersetzt. `D.school.planOf`, `D.school.combos`.
- Plan **nw**: `NW_PACKS`, `NW_TOPICS` (alle Pakete/Themen zugeordnet, merge.py prüft). Stufen wie BW-Gymnasium (5/6, 7/8, 9/10). NRW ist schneller in der Grammatik (Relativsätze, perfect vs. past, if I in Kl. 6; Passiv, if II in Kl. 7). Recherche: `content/schule/RECHERCHE_NRW.md` (Kernlehrplan-Original noch gegenprüfen).
- Codes mit **N** (`OWL-555-2-N7`, `WEEK-…-2-N6`, `HA6N-…`). build.py: Lazy-Dateien nur für COMBOS; nw-gym nutzt `data-school-bw-gym.json`.
- Einrichtung: Bundesland jetzt sichtbar (nur freigeschaltete wählbar), Schulformen je Land, Lehrwerke je Land+Schulart („anderes Lehrwerk“ immer zuletzt); Wechsel des Bundeslands mit Sicherheitsfrage.
- Lehrwerke NRW: English G Access G9, Green Line G9, Camden Town G9. SEO: `englisch-gymnasium-nrw.html`; Texte in shell.html (Beschreibung) um RS/GMS/NRW ergänzt.
- Tests: Core 61, UI 174+.
- Offen: Startseite arndt-software.de (homepage-Repo) Text „weitere Länder folgen“ anpassen; Bayern als nächstes Land.

## Release 0.16 (13.11.2026) – Niveaus G/M/E, Werkrealschule, G9-Anpassung
- **G9 / Bildungsplan V2 (Gymnasium Kl. 5/6):** Lesehilfe KM 2025 nimmt u. a. indirekte Rede ohne Zeitverschiebung und das Stützwort „one“ aus dem Standardraum 5/6 → `TOPICS['repsimple']` 6 → 7. Sonst keine Grammatik unserer Themen betroffen (present perfect, will, going to, Steigerung nicht genannt). Inkraftsetzung des „gedehnten“ G9-Plans für Sommer 2026 angekündigt → dann erneut prüfen (G9 hat Klasse 11!). Sek I V2 gilt seit 2025/26 in Kl. 5–7 – Details noch nicht geprüft.
- **Niveaus Sek I:** `school.NIVEAUS` (RS: M/G, GMS: M/G/E, WRS: G/M; erstes = Standard), `S.school.niv`. Pläne `sek1g` (G) und `sek1e` (E) aus `SEK1_*` abgeleitet (`SEK1G_*`, `SEK1E_*`; `None` = entfällt). Codes: G/E (`FOX-123-1-G9`, `HA9E-…`).
- **Werkrealschule/Hauptschule** freigeschaltet (bw-wrs, Standard Niveau G).
- core.js: Duell-Grammatik (`cases`) jetzt nach Lehrplan des Codes (vorher immer Gymnasium-Klasse).
- Tests: Core 62, UI 177 OK.

## Release 0.17 (13.11.2026) – Abschluss-Training Sek I BW
- Grundlage: Zentrale Prüfungsmaßstäbe Kommunikationsprüfung Pflichtfremdsprache RSAP 2025/26 (KM BW): a) Präsentation Schwerpunktthema, b) dialogisches Sprechen, c) Sprachmittlung; ca. 15 Min. je Schüler, je Teil 10 Punkte; Notentabelle 30 = 1,0 · 15 = 3,5 · 6 = 5,0 · 0 = 6,0 (→ `C.kpGrade` = 6 − Punkte/6). Schriftlich: A Listening, B Text-based Tasks, C Use of Language, D Writing, E Interpreting (150 Min.).
- `content/abschluss.py` (eigene Texte): 16 Redemittel, 12 Nachfragen, 12 Sprachmittlungs-Situationen (DE↔EN, Muster + Kernpunkte), 4 Schreibaufgaben → `D.grad`.
- Tab `grad` (`renderGrad`, `GR`, `gradCard` im Schulbereich für Sek-I-Pläne ab Kl. 9): Teil a mit Themenwahl (Pakete Kl. 7 bis eigene Klasse oder eigenes Thema), Stichworte (`S.grad.notes`), 5-Minuten-Timer, Nachfragen per Sprachausgabe, Selbsteinschätzung; Teil b startet eine zufällige Szene; Teil c Sprachmittlung mit Lösungsvorschlag. `S.grad.sc` → Summe + ungefähre Note. Schriftlich: `startGradQuiz` (6 A, 6 B, 8 C, 4 E) + Teil D mit `writingCheck`. Prüfungsname: Realschulabschluss / Werkrealschulabschluss (WRS Kl. 10) / Hauptschulabschluss (WRS Kl. 9).
- perf-Budget 820 KB (index.html ~792 KB). Tests: Core 63, UI 184 OK (2×).
- Ideen: Präsentation mit Spracherkennung/Aufnahme, Teil B mit echten Lesetexten (Buchkapitel), KI-Gesprächspartner als Prüfer (et-chat).

## Release 0.18 (13.11.2026) – Bayern, Gymnasium (LehrplanPLUS)
- Plan **by**: `BY_PACKS`, `BY_TOPICS` (Recherche `content/schule/RECHERCHE_BY.md`, Jgst. 10 noch nicht abrufbar gewesen → nachprüfen). Fenster = eine Jahrgangsstufe (`schLoOf/schHiOf` → g). Codes mit **B**. Lehrwerke Green Line Bayern, English G Access Bayern. SEO `englisch-gymnasium-bayern.html`.
- Bayern ist früher dran (simple past Kl. 5; present perfect, if I, Relativsätze, tags Kl. 6; if II/III Kl. 7).
- Tests: Core 64, UI 186 OK (2×).
- Nächste Länder laut AUTOPLAN: Niedersachsen, Hessen, Rheinland-Pfalz.

## Release 0.19 (13.11.2026) – Niedersachsen, Gymnasium
- `ni-gym` freigeschaltet, **ohne eigenen Plan** (Grundzuordnung wie BW-Gymnasium, Codes mit K): Das KC Englisch Gymnasium NI 2015 beschreibt Grammatik nur funktional (Passiv, indirekte Rede bis Ende 8; Arbeitswelt 9/10) – passt zur BW-Progression. Recherche `content/schule/RECHERCHE_NI.md`.
- Lehrwerke: English G Access, Green Line, Camden Town (ohne Ausgabe-Angabe). SEO `englisch-gymnasium-niedersachsen.html`.
- Tests: Core 65, UI 188 OK (2×). Nächste Länder: Hessen, Rheinland-Pfalz; offen: Oberschule NI.

## Release 0.20 (13.11.2026) – Hessen, Gymnasium (G9)
- Plan **he** (`HE_PACKS`, `HE_TOPICS`), Quelle: Lehrplan Englisch Gymnasium G9 Hessen, je Jahrgangsstufe (`content/schule/RECHERCHE_HE.md`). Fenster = eine Jahrgangsstufe, Codes mit **H**. Lehrwerke Access, Green Line, Camden Town. SEO `englisch-gymnasium-hessen.html`.
- Hessen: going to schon Kl. 5; simple past, present perfect, will, if I Kl. 6; Passiv, if II Kl. 7; USA-Schwerpunkt Kl. 8.
- Tests: Core 66, UI 189 OK (2×). Nächstes Land: Rheinland-Pfalz.

## Release 0.21 (13.11.2026) – NRW alle Schularten
- Neue Schularten (TYPES angehängt): ge Gesamtschule, sek Sekundarschule, hs Hauptschule. COMBOS: nw-rs, nw-ge, nw-sek, nw-hs.
- Pläne **nwrs** (Realschule + E-Kurs; Codes R) und **nwg** (G-Kurs + Hauptschule; Codes U). `NIV_PLAN` (verallgemeinert, ersetzt die feste sek1-Regel): Niveau → Plan je Kombination; NRW-Kurse `ek`/`gk`.
- Lehrwerke: Red Line, Orange Line, English G Lighthouse, English G Highlight, Camden Market (je nach Schulart). Recherche-Ergänzung in `content/schule/RECHERCHE_NRW.md` (Realschul-KLP 2022 nicht direkt abrufbar; Gesamtschul-KLP 2004).
- Abschluss-Training bleibt BW-spezifisch (NRW: ZP 10 → später).
- Tests: Core 67, UI 192 OK (2×).

## Release 0.22 (13.11.2026) – ZP10-Training NRW
- Quelle: QUA-LiS „Zentrale Prüfungen 10 Englisch – Informationen zur Prüfung 2026“ (Teil 1 Hörverstehen, 2 Hörtexte, ca. 20 Min.; Teil 2 Leseverstehen, themengebundener Wortschatz, Schreiben; Gewichtung EESA 20/20/15/45, MSA/GYM 15/15/10/60). Bezugskulturen 2026: Großbritannien und Neuseeland.
- `gradOn` jetzt auch für NRW (alle Schularten, ab Kl. 9); `gradNrw`, `zpLevel` (nwg → EESA, Gymnasium → GYM, sonst MSA), `startZpQuiz` (8 Hören, 8 Lesen, 8 Wortschatz), Bestwert `S.grad.zp`, Schreiben über vorhandene Schreibaufgaben, Link zum Paket Australien/Neuseeland.
- Tests: UI 196 OK (2×), Core 67.

## Release 0.23 (13.11.2026) – Rheinland-Pfalz
- Schularten angehängt: rsp Realschule plus, igs Integrierte Gesamtschule. COMBOS rp-gym, rp-rsp, rp-igs.
- Plan **rp** (Gymnasium/erhöhtes Niveau; Codes P): `RP_TOPICS` nach Green-Line-RP-Progression (Klett-Synopse Band 4 = Kl. 8), `RP_PACKS` = Grundzuordnung. Realschule plus/IGS: Niveau `st` (Standard → sek1, Codes S) / `eh` (erhöht → rp). **Annahmen**, siehe `content/schule/RECHERCHE_RP.md` – Lehrplan-PDF 2022 nicht abrufbar.
- Abschluss-Training BW nur noch für Bundesland BW (vorher hätte RP-Standardniveau es wegen Plan sek1 angezeigt); Sek-I-BW-Hinweis ebenso.
- SEO `englisch-rheinland-pfalz.html`. Tests: Core 68, UI 198 OK (2×).

## Release 0.24 (13.11.2026) – Sachsen, Gymnasium
- Plan **sn** (`SN_PACKS`, `SN_TOPICS`, Doppeljahrgänge), Quelle Lehrplan Gymnasium Englisch Sachsen 2019 (`content/schule/RECHERCHE_SN.md`). Codes mit **X**. Lehrwerke Green Line, Access, Camden Town. SEO `englisch-gymnasium-sachsen.html`.
- Sachsen: if I/II in 5/6; Passiv, indirekte Rede, if III, Gerundium, Partizipien in 7/8.
- index.html 809 KB (Budget 820) – nächster Ausbau: Schuldaten (plans/books) in die nachgeladene Schuldatei verschieben.
- Tests: Core 69, UI 199 OK (2×). Offen: Oberschule Sachsen; Berlin/Brandenburg (gemeinsamer Rahmenlehrplan 1–10).

## Release 0.25 (13.11.2026) – Berlin und Brandenburg
- Gemeinsamer Rahmenlehrplan 1–10 (Teil C Moderne Fremdsprachen), Notiz `content/schule/RECHERCHE_BE_BB.md`. COMBOS be-gs, be-gym, be-iss, bb-gs, bb-gym, bb-obs, bb-ge.
- Grundschule (5/6) und Gymnasium → Grundzuordnung (wie Gymnasium BW). ISS/Oberschule/Gesamtschule → Plan sek1 mit Niveau/Kurs: be-iss er/gr, bb-obs for/ebr, bb-ge ek/gk (grundlegend → sek1g). **Annahme:** Rahmenlehrplan beschreibt Grammatik nur funktional, Zuordnung daher nach Lehrwerk-Progression.
- Lehrwerke: Green Line, Access, Camden Town (Gym/GS), Red Line, Lighthouse, Highlight, Camden Market (ISS/Oberschule/Gesamtschule).
- NEWS ohne Duplikat 'en' (spart ~8 KB). SEO `englisch-berlin-brandenburg.html`.
- index.html 812 KB (Budget 820). Tests: Core 70, UI 201 OK (2×).

## Release 0.26 (14.11.2026) – Schleswig-Holstein und Hamburg
- Pläne kompakt: `D.school.plans[x]` ist jetzt ein String "<Pakete>|<Themen>" (ein Zeichen je Eintrag, 0/5–9/a=10, Reihenfolge `D.school.pOrd` bzw. Schlüssel von `D.school.topics`). Entpacken nur über `PSCore.schPlanObj(data, plan)` (zwischengespeichert). Spart ~5 KB; neue Pläne kosten ~70 Byte.
- Schleswig-Holstein (Fachanforderungen Englisch 2014): sh-gym → Grundzuordnung; sh-gms Gemeinschaftsschule mit Niveau MSA (sek1), ESA (sek1g), Oberstufen-Niveau (sek1e).
- Hamburg (Bildungspläne 2022, in Kraft 1.8.2024): hh-gym → Grundzuordnung; hh-sts Stadtteilschule (neue Schulart `sts`) erhöht (sek1) / grundlegend (sek1g).
- **Annahme:** Beide Länder beschreiben Grammatik nur funktional (HH: Mindestanforderungen Ende 6/8/10) → Zuordnung über vorhandene Pläne. Notiz `content/schule/RECHERCHE_SH_HH.md`.
- SEO `englisch-schleswig-holstein-hamburg.html`. index.html 809 KB (Budget 820). Tests: Core 72, UI 205 OK (2×).
- Offen: ESA/MSA-Training SH/HH; Thüringen, Sachsen-Anhalt, MV, Saarland, Bremen.

## Release 0.27 (14.11.2026) – Thüringen, Sachsen-Anhalt, Mecklenburg-Vorpommern
- Neue Schularten (angehängt): `rgs` Regelschule, `reg` Regionale Schule. Neue Niveaus `rsa` (Realschulabschluss/Mittlere Reife → sek1), `hsa` (Hauptschulabschluss/Berufsreife → sek1g); `ob` → sek1e.
- COMBOS th-gym/rgs/gms, st-gym/sek/gms, mv-gym/reg/ge. TH/ST Gymnasium → Grundzuordnung (**Annahme**, Plan-PDF ST nur mit Anmeldung, TH ohne Einzelzuordnung).
- **Neuer Plan `mv`** (Codes **M**) nach Rahmenplan MV Gymnasium 7–10 (2019): Kl. 7 Passiv, indirekte Rede, if II, past perfect; Kl. 8 Gerundium, Partizipien, if III; Kl. 9 Zeitformen-/Zukunftsüberblick; Kl. 10 nichts Neues. Ab Kl. 7 einzelne Klassen (schLoOf/schHiOf), 5/6 Doppeljahrgang.
- Notiz `content/schule/RECHERCHE_TH_ST_MV.md`. SEO `englisch-thueringen-sachsen-anhalt-mv.html`.
- index.html 811 KB (Budget 820). Tests: Core 73, UI 210 OK (2×). Offen: Saarland, Bremen.

## Release 0.28 (14.11.2026) – Aufräumen: Polnisch-Reste entfernt (AUTOPLAN 13, interaktive Sitzung)
- `TX.en` (ungenutzt, `S.base` ist immer `de`, voller Polnisch-Texte) entfernt → `TX.en = TX.de`. i18n_check angepasst (keine DE=EN-Warnungen mehr, Fehler bei polnischen Buchstaben in TX.de).
- Entfernt: Bereich „Dla Polaków“ (renderPolacy/startPol/startPolTest, Kachel unter Land, Ergebnis-Zweig polTest), `PLX`-Texte, polnischer Rechtschreib-Modus (`qSpell`, Modus `spell`), `plKeysPl`, tote Schlüssel pol_*, spell*, rule_*, g_*, cls_am/i/uje/e, clsn_i/uje/e, conj_past_tip. `needPolacy` ist nur noch ein Stub; `PCATS`/`qPol` bleiben für alte Duell-Codes (P-Stufe). Spielstand-Felder `plv`/`plBest` bleiben unverändert.
- Sichtbare Fehler behoben: Stimmen-Test sprach „Kiedy mogę zacząć pracę?“ / „Dzień dobry!“ → jetzt Englisch; freier KI-Chat begann mit „Cześć! Jak się masz?“ → „Hi! How are you today?“.
- Neue Prüfung in `checks/content_check.py`: keine polnischen Buchstaben in data.json, allen data-*.json und app.js (ohne Kommentare; Prüfmodus `RVX` ausgenommen bis AUTOPLAN 12).
- index.html 830 → 774 KB. Tests: Core 73, UI 212 OK (2×), alle Checks grün.
- Offen: AUTOPLAN 12 (Prüfmodus `?review` auf Englisch umbauen), core.js enthält noch polnische Hilfsfunktionen (Zahlwörter, misspell) – ungenutzt, getestet, unschädlich.
