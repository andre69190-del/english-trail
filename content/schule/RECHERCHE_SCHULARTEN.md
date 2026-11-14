# Weitere Schularten Bayern, Niedersachsen, Hessen, Sachsen (14.11.2026, Release 0.31)

Grundlage: In allen vier Ländern folgen die nicht-gymnasialen Schularten dem Bildungsstandard „Mittlerer Schulabschluss“ (KMK) bzw. dem Ersten Schulabschluss.
Die Grammatik-Progression ist dort langsamer als am Gymnasium → wir nutzen die gemeinsamen Sek-I-Pläne (wie BW-Realschule/GMS):
`sek1` = Niveau Mittlerer Abschluss, `sek1g` = grundlegend/Hauptschulabschluss, `sek1e` = erweitert (nicht genutzt).

| Kombination | Plan | Niveaus | Quelle (Lehrplan) |
|---|---|---|---|
| by-rs Realschule Bayern | sek1 | – | LehrplanPLUS Realschule Englisch (Jgst. 5–10) |
| by-ms Mittelschule Bayern | sek1g (Regelklasse) / sek1 (M-Zug) | hsa, rsa | LehrplanPLUS Mittelschule Englisch (Jgst. 5–10, M-Zug ab 7) |
| ni-obs / ni-igs | sek1 (E-Kurs) / sek1g (G-Kurs) | ek, gk | KC Englisch Sek I Haupt-/Real-/Oberschule bzw. IGS (2015) |
| ni-rs Realschule | sek1 | – | KC Realschule |
| ni-hs Hauptschule | sek1g | – | KC Hauptschule |
| he-rs / he-hs | sek1 / sek1g | – | Kerncurriculum Hessen Sek I (Realschule/Hauptschule) |
| he-igs | sek1 / sek1g | ek, gk | Kerncurriculum Hessen, IGS mit Kursdifferenzierung |
| sn-obs Oberschule Sachsen | sek1 (Realschulabschluss) / sek1g (Hauptschulabschluss) | rsa, hsa | Lehrplan Oberschule Englisch Sachsen (2019) |

**Annahme:** Einzelzuordnung je Klasse aus den Plänen nicht geprüft (Mittelschule Bayern ist Jahrgangsstufen-genau – bei Gelegenheit eigenen Plan `bym` anlegen).
Mittelschule Bayern: Regelklasse → qualifizierender Abschluss (≈ Hauptschulabschluss), M-Zug → Mittlerer Schulabschluss.
