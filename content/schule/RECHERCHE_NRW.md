# Recherche: Englisch Gymnasium Nordrhein-Westfalen (G9, Klassen 5–10)

Stand 13.11.2026.

- Grundlage: Kernlehrplan für die Sekundarstufe I Gymnasium in NRW, Englisch (Heft 3417, 2019). Gliederung der Kompetenzerwartungen: bis Ende der Erprobungsstufe, erste Stufe, zweite Stufe (Ende Sek I). Die Schulen verteilen die Stufen; üblich: Erprobungsstufe 5/6, erste Stufe 7/8, zweite Stufe 9/10 (z. B. schulinterner Lehrplan Irmgardis-Gymnasium Köln).
  Der Kernlehrplan selbst war beim Abruf nicht direkt lesbar (Weiterleitung auf qua-lis.nrw.de) → **beim nächsten Lauf gegen das Original prüfen** (lehrplannavigator.nrw.de).
- Klassen-Zuordnung (Progression): schulinterner Lehrplan Gymnasium Aspel (English G Access G9, NRW):
  - Kl. 5: be, can, simple present (Fragen, Kurzantworten), s-Genitiv, Possessivbegleiter, Häufigkeitsadverbien, present progressive. Themen: Schule in GB, Familie/Zuhause, Hobbys, eine Stadt am Meer (Plymouth).
  - Kl. 6: simple past, going to, Steigerung, Relativsätze, Adjektiv/Adverb, present perfect (auch Kontrast zu simple past), some/any, will, Modalverben, if I. Themen: Ferien/Wetter, Schultag, Einkaufen/Wege, Land (Dartmoor), Feste.
  - Kl. 7: past progressive, question tags, if II, Relativpronomen/contact clauses, present perfect progressive, Gründe/Folgen, past perfect, Passiv. Themen: London, Umzug/Kleinstadt, Wales, Stadt/Sport/Musik, Irland, Schottland/Edinburgh.
  - Kl. 8 (USA): gerund, Konzessivsätze, if III, Zukunftsformen, (non-)defining relative clauses, state vs. activity verbs, indirekte Rede, Artikel. Themen: New York, New Orleans, Kalifornien (Umwelt), South Dakota/Lakota.
  - Kl. 9: participle clauses, Modalverben, Passiv mit zwei Objekten, Infinitivsätze, weitere Zukunftsformen/Aspekt. Themen: Australien, GB (Lebensstile, Konsum, Medien), USA Südwesten (Jobs und Bewerbungen), Neuseeland.
  - Kl. 10: Jugendliteratur, Gemeinschaft/Demokratie/Menschenrechte, Technik und KI.
- Lehrwerke (nur Namen): English G Access G9 NRW (Cornelsen), Green Line G9 NRW (Klett), Camden Town G9 (Westermann).
- Umsetzung: content/school.py → NW_PACKS, NW_TOPICS (gleiche Pakete/Aufgaben wie BW, andere Klassen), Codes mit N.

Quellen:
- https://www.schulentwicklung.nrw.de/lehrplaene/lehrplan/199/g9_e_klp_%203417_2019_06_23.pdf
- https://schule.erzbistum-koeln.de/export/sites/schule/irmgardis-gymnasium-koeln/.content/.galleries/Fachbereiche/Englisch/Englisch_Homepageversion_G9_2_9_22.pdf
- https://www.gymnasiumaspel.de/wp-content/uploads/2026/03/Englisch-G9_-5-10.pdf

## Ergänzung 13.11.2026: Realschule, Gesamtschule, Sekundarschule, Hauptschule
- Realschule: Kernlehrplan Englisch Realschule NRW (Heft 3303, 2022; Kompetenzerwartungen Ende Erprobungsstufe, Ende 8, Ende 10). Original nicht direkt abrufbar (Weiterleitung) → Progression 5/6 aus dem Klett-Abgleich Red Line 1/2 mit dem KLP: simple past in Red Line 1 (Kl. 5); present progressive, present perfect, will-future, Steigerung in Red Line 2 (Kl. 6); KLP 5/6: Bedingungen ausdrücken, Ereignisse in Gegenwart/Vergangenheit/Zukunft. https://assets.klett.de/assets/4b2866a6/NRW_Abgleich_RedLine_1_2_Realschule_NEU.pdf
- Gesamtschule (KLP 2004, Ende 6/8/10; G- und E-Kurs): Ende 6 u. a. simple past, present perfect, will, going to; Ende 8 G-Kurs: present/past, Modalverben, Aktiv, Relativsätze, Vergleich, if I – E-Kurs zusätzlich past perfect, Passiv, if I und II; Ende 10 G-Kurs (teils rezeptiv): past perfect, if II, indirekte Rede, Passiv, Gerundium – E-Kurs: weitere Zukunftsformen, Modal-Ersatzformen, indirekte Rede, if II und III. https://lehrplannavigator.nrw.de/system/files/media/document/file/gs_englisch.pdf
- Sekundarschule: wie Gesamtschule (G-/E-Kurs). Hauptschule (KLP 2022): Grundkurs-Zuordnung.
- Umsetzung: Plan „nwrs“ (Realschule, E-Kurs; Codes R) und „nwg“ (G-Kurs, Hauptschule; Codes U), `NIV_PLAN` für nw-ge/nw-sek (ek/gk). Abschluss-Training (BW) gilt nicht für NRW (ZP 10 hat anderes Format) – später.
