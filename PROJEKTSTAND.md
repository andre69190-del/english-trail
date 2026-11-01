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

## Ablauf „automatisch online“ (ab 01.11.2026)
1. Claude ändert, baut, testet (alles grün) → schreibt die Dateien in den Ordner auf dem PC und **zuletzt** `RELEASE.txt` mit neuer Versionsnummer.
2. Die Windows-Aufgabe „English Trail Auto-Upload“ merkt die neue RELEASE.txt (spätestens nach 10 Minuten) → `git commit` + `git push` nach github.com/andre69190-del/english-trail.
3. GitHub-Webhook → Coolify baut https://english.arndt-software.de neu (ca. 1–2 Minuten).
4. Handys holen die neue Version beim nächsten Öffnen (Service Worker network-first; `CACHE_NAME` in sw.js bei jeder Version erhöhen).

## 8. Nächster Schritt

1. ✅ Live-Gang erledigt (01.11.).
2. Optional Phase 5: Foto-Erkennung für Buch-Vokabeln (Texterkennung im Browser) prüfen.
3. Phase 6: Trail 2 (A2) + Trail 3 (B1) auf Englisch, Themenpakete, Profi-Bereich, Tagebuch/Buch, B1-Probeprüfung (englisch), Prüfmodus-Texte (?review) auf Englisch.
4. Phase 8: Optik (Farben/Logo, Rabe statt Zwerg-Grafik).

## 9. Offene Punkte beim Nutzer

- Name „English Trail“ bestätigen oder anderen nennen.
- Optional später: englische Gratis-Stimmen (Piper) als Tondateien wie bei Polski Szlak – vorerst spricht die Gerätestimme.
- Später: Supabase-SQL ausführen, Coolify-Ressource anlegen (wie bei Polski Szlak).
