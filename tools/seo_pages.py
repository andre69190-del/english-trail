#!/usr/bin/env python3
"""Erzeugt statische, von Google lesbare Seiten je Klassenstufe (englisch-klasse-5.html … -10.html)
und eine Übersicht (englisch-gymnasium-bw.html) aus den App-Inhalten. Dazu sitemap.xml.

    python3 tools/seo_pages.py

Nur eigene Inhalte der App (Themen, Grammatik, Beispielsätze) – keine Texte oder Vokabellisten aus Schulbüchern.
"""
import os, sys, html, datetime, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'content'))
import grammar, school  # noqa: E402

SITE = 'https://english.arndt-software.de/'
TODAY = datetime.date.today().isoformat()
E = html.escape

CSS = """:root{--bg:#f4f6f9;--ink:#14212b;--muted:#55606b;--acc:#1d4f91;--box:#fff;--line:#dde3ea}
@media (prefers-color-scheme:dark){:root{--bg:#0f151a;--ink:#e7eef3;--muted:#9fb0bc;--acc:#8fb6ff;--box:#18222a;--line:#2b3a46}}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6;max-width:760px;margin:0 auto;padding:24px 16px 48px}
h1{color:var(--acc);font-size:1.7rem;line-height:1.25;margin:.3em 0}h2{color:var(--acc);font-size:1.15rem;margin-top:28px}
a{color:var(--acc);font-weight:600}.box{background:var(--box);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:12px 0}
.cta{display:inline-block;background:var(--acc);color:#fff;padding:12px 18px;border-radius:12px;text-decoration:none;margin:8px 0}
@media (prefers-color-scheme:dark){.cta{color:#0b1424}}
ul{padding-left:20px}.muted{color:var(--muted);font-size:.92rem}nav a{margin-right:10px;white-space:nowrap}
.ex{font-style:italic}"""


def page(fname, title, desc, body, grade=None):
    ld = {"@context": "https://schema.org", "@type": "LearningResource", "name": title, "description": desc,
          "url": SITE + fname, "inLanguage": ["de", "en"], "isAccessibleForFree": True, "learningResourceType": "Übungs-App",
          "educationalLevel": ("Klasse %d, Gymnasium Baden-Württemberg" % grade) if grade else "Klassen 5–10, Gymnasium Baden-Württemberg",
          "teaches": "Englisch", "provider": {"@type": "Person", "name": "Andre Arndt"}}
    nav = '<nav class="muted">' + ' '.join('<a href="englisch-klasse-%d.html">Klasse %d</a>' % (g, g) for g in range(5, 11)) + '</nav>'
    doc = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{SITE}{fname}">
<meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:url" content="{SITE}{fname}"><meta property="og:image" content="{SITE}icon-512.png"><meta property="og:locale" content="de_DE">
<meta name="theme-color" content="#1d4f91">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<style>{CSS}</style>
</head>
<body>
<p><a href="./">‹ English Trail öffnen</a></p>
{body}
<h2>Alle Klassen</h2>
{nav}
<p class="muted" style="margin-top:28px">English Trail ist kostenlos, ohne Werbung und ohne Anmeldung nutzbar. <a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></p>
</body>
</html>
"""
    open(os.path.join(ROOT, fname), 'w', encoding='utf-8').write(doc)


def main():
    cases = grammar.cases()
    files = []
    for g in range(5, 11):
        packs = [k for k in school.PACKS if k['grade'] == g]
        lo = g - ((g - 5) % 2)
        tops = [(k, v) for k, v in grammar.TOPICS.items() if lo <= v[1] <= g]
        rep = [(k, v) for k, v in grammar.TOPICS.items() if v[1] < lo]
        title = f'Englisch Klasse {g} Gymnasium Baden-Württemberg – kostenlos üben'
        desc = (f'Englisch für Klasse {g} am Gymnasium in Baden-Württemberg üben: ' + ', '.join(k['title'] for k in packs) +
                ' – plus Grammatik (' + ', '.join(v[0] for _, v in tops[:4]) + ') und Probe-Klassenarbeit. Kostenlos, ohne Werbung.')
        b = [f'<h1>Englisch Klasse {g} – Gymnasium Baden-Württemberg</h1>',
             f'<p>Passend zum Bildungsplan BW (Englisch als 1. Fremdsprache, Doppeljahrgang {lo}/{lo + 1}). '
             'Ob du mit <b>Green Line</b> (Klett) oder <b>Access</b> (Cornelsen) lernst: Deine Vokabeln aus dem Buch trägst du Unit für Unit in die App ein '
             'und übst sie mit Wiederholung, Spielen und Duellen.</p>',
             '<a class="cta" href="./">Jetzt kostenlos üben →</a>',
             '<h2>Themen und Wortschatz</h2>']
        for k in packs:
            words = [l.split('|')[0].strip() for l in k['words'].strip().split('\n')][:8]
            b.append(f'<div class="box"><b>{E(k["ico"])} {E(k["title"])}</b><br>{E(k["can"])}<br><span class="muted">Beispielwörter: {E(", ".join(words))} …</span></div>')
        b.append('<h2>Grammatik in Klasse %d</h2><ul>' % g)
        for key, (name, kk) in tops:
            ex = next((c for c in cases if c['g'] == key), None)
            exs = (' – <span class="ex">' + E(ex['s'].replace('___', ex['a'])) + '</span>') if ex else ''
            b.append(f'<li><b>{E(name)}</b>{exs}</li>')
        b.append('</ul>')
        if rep:
            b.append('<p class="muted">Zum Wiederholen: ' + E(', '.join(v[0] for _, v in rep)) + '.</p>')
        b.append('<h2>Was die App für Klasse %d bietet</h2><ul>' % g +
                 '<li><b>Probe-Klassenarbeit</b> mit Grammatik, Vokabeln, Hörverstehen, Leseverstehen und Sprachmittlung – mit Note.</li>'
                 '<li><b>Schreibauftrag</b> mit Checkliste (Länge, Pflichtwörter, Verbindungswörter).</li>'
                 '<li><b>Buch-Vokabeln</b> nach Unit eintragen – als Liste oder einfach <b>per Foto</b> der Vokabelseite (Texterkennung direkt auf dem Handy).</li>'
                 '<li><b>Wochen-Challenge, Live-Duell und Hausaufgaben-Code</b> für die ganze Klasse – ohne Anmeldung.</li>'
                 '<li><b>Wiederholung mit Karteikasten-Prinzip</b>, Aussprache britisch oder amerikanisch.</li></ul>')
        b.append('<a class="cta" href="./">English Trail öffnen →</a>')
        fn = f'englisch-klasse-{g}.html'
        page(fn, title, desc, '\n'.join(b), g); files.append(fn)
    # Übersicht
    b = ['<h1>Englisch üben für das Gymnasium in Baden-Württemberg (Klasse 5–10)</h1>',
         '<p>English Trail ist eine kostenlose Lern-App ohne Werbung: eine Reise durch Großbritannien und Irland mit Alltagsszenen, '
         'Wortschatz mit Wiederholung und einem <b>Schulmodus</b> passend zum Bildungsplan BW. Kinder wählen Klasse und Lehrwerk '
         '(Green Line oder Access) und üben genau ihren Stoff.</p><a class="cta" href="./">Jetzt kostenlos üben →</a>',
         '<h2>Nach Klasse</h2><ul>'] + [f'<li><a href="englisch-klasse-{g}.html">Englisch Klasse {g}</a> – ' + E(', '.join(k['title'] for k in school.PACKS if k['grade'] == g)) + '</li>' for g in range(5, 11)] + [
         '</ul><h2>Für Eltern und Lehrkräfte</h2><ul><li>Ohne Konto nutzbar, Fortschritt bleibt auf dem Gerät.</li>'
         '<li>Hausaufgaben-Code: Themen auswählen, Code teilen – alle bekommen dieselben Fragen.</li>'
         '<li>Wochenbericht für Eltern zum Teilen.</li><li>Keine Käufe, keine Werbung, kein Streak-Druck.</li></ul>']
    page('englisch-gymnasium-bw.html', 'Englisch üben Gymnasium Baden-Württemberg Klasse 5–10 – kostenlose App',
         'Kostenlose Englisch-App für das Gymnasium in Baden-Württemberg: Wortschatz und Grammatik für Klasse 5 bis 10, Probe-Klassenarbeit, Buch-Vokabeln (Green Line, Access), Duelle. Ohne Werbung.',
         '\n'.join(b)); files.insert(0, 'englisch-gymnasium-bw.html')
    # 13.11.2026: Realschule / Gemeinschaftsschule (Bildungsplan Sekundarstufe I, Niveau M) – eine Übersichtsseite
    PK = {k['id']: k for k in school.PACKS}
    b = ['<h1>Englisch üben für Realschule und Gemeinschaftsschule in Baden-Württemberg (Klasse 5–10)</h1>',
         '<p>English Trail ist eine kostenlose Lern-App ohne Werbung. Im <b>Schulmodus</b> wählst du <b>Realschule</b> oder '
         '<b>Gemeinschaftsschule</b> oder <b>Werkrealschule</b>, dein Niveau (G, M oder E), deine Klasse und dein Lehrwerk (z. B. <b>Red Line</b> von Klett oder <b>Highlight</b> von Cornelsen). '
         'Wortschatz und Grammatik sind nach dem gemeinsamen Bildungsplan der Sekundarstufe I (mittleres Niveau M) den Klassen zugeordnet. Die Übersicht unten zeigt Niveau M.</p>'
         '<a class="cta" href="./">Jetzt kostenlos üben →</a>', '<h2>Themen und Grammatik nach Klasse (Niveau M)</h2>']
    for g in range(5, 11):
        pk = [PK[i] for i, kk in school.SEK1_PACKS.items() if kk == g]
        gr = [grammar.TOPICS[t][0] for t, kk in school.SEK1_TOPICS.items() if kk == g]
        b.append(f'<div class="box"><b>Klasse {g}</b><br>' + E(', '.join(k['title'] for k in pk)) +
                 (f'<br><span class="muted">Grammatik: {E(", ".join(gr))}</span>' if gr else '') + '</div>')
    b.append('<h2>Was die App bietet</h2><ul><li><b>Buch-Vokabeln per Foto</b>: Vokabelseite fotografieren, die App liest die Wörter direkt auf dem Handy.</li>'
             '<li><b>Probe-Klassenarbeit</b> mit Grammatik, Vokabeln, Hör- und Leseverstehen und Sprachmittlung.</li>'
             '<li><b>Thema Berufe und Praktikum</b> (Orientierung in der Arbeitswelt) mit Szene und Bewerbungssätzen.</li>'
             '<li><b>Wochen-Challenge, Live-Duell und Hausaufgaben-Code</b> für die ganze Klasse – ohne Anmeldung.</li>'
             '<li>Keine Käufe, keine Werbung, kein Streak-Druck.</li></ul><a class="cta" href="./">English Trail öffnen →</a>')
    page('englisch-realschule-bw.html', 'Englisch üben Realschule und Gemeinschaftsschule Baden-Württemberg Klasse 5–10 – kostenlose App',
         'Kostenlose Englisch-App für Realschule und Gemeinschaftsschule in Baden-Württemberg: Wortschatz und Grammatik nach Bildungsplan Sek I, Klasse 5 bis 10, Vokabeln per Foto (Red Line, Highlight), Probe-Klassenarbeit. Ohne Werbung.',
         '\n'.join(b)); files.insert(1, 'englisch-realschule-bw.html')
    # 13.11.2026: Gymnasium Nordrhein-Westfalen (G9)
    b = ['<h1>Englisch üben für das Gymnasium in Nordrhein-Westfalen (G9, Klasse 5–10)</h1>',
         '<p>English Trail ist eine kostenlose Lern-App ohne Werbung. Im <b>Schulmodus</b> wählst du <b>Nordrhein-Westfalen</b>, deine Klasse und dein Lehrwerk '
         '(z. B. <b>English G Access G9</b> von Cornelsen, <b>Green Line G9</b> von Klett oder <b>Camden Town G9</b> von Westermann). '
         'Wortschatz und Grammatik sind nach dem Kernlehrplan Englisch für das Gymnasium (Erprobungsstufe, erste und zweite Stufe) den Klassen zugeordnet.</p>'
         '<a class="cta" href="./">Jetzt kostenlos üben →</a>', '<h2>Themen und Grammatik nach Klasse</h2>']
    for g in range(5, 11):
        pk = [PK[i] for i, kk in school.NW_PACKS.items() if kk == g]
        gr = [grammar.TOPICS[t][0] for t, kk in school.NW_TOPICS.items() if kk == g]
        b.append(f'<div class="box"><b>Klasse {g}</b><br>' + E(', '.join(k['title'] for k in pk)) +
                 (f'<br><span class="muted">Grammatik: {E(", ".join(gr))}</span>' if gr else '') + '</div>')
    b.append('<h2>Was die App bietet</h2><ul><li><b>Buch-Vokabeln per Foto</b>: Vokabelseite fotografieren, die App liest die Wörter direkt auf dem Handy.</li>'
             '<li><b>Probe-Klassenarbeit</b> mit Grammatik, Vokabeln, Hör- und Leseverstehen und Sprachmittlung.</li>'
             '<li><b>Wochen-Challenge, Live-Duell und Hausaufgaben-Code</b> für die ganze Klasse – ohne Anmeldung.</li>'
             '<li>Keine Käufe, keine Werbung, kein Streak-Druck.</li></ul><a class="cta" href="./">English Trail öffnen →</a>')
    page('englisch-gymnasium-nrw.html', 'Englisch üben Gymnasium NRW G9 Klasse 5–10 – kostenlose App',
         'Kostenlose Englisch-App für das Gymnasium in Nordrhein-Westfalen (G9): Wortschatz und Grammatik nach Kernlehrplan, Klasse 5 bis 10, Vokabeln per Foto (Access, Green Line, Camden Town), Probe-Klassenarbeit. Ohne Werbung.',
         '\n'.join(b)); files.insert(2, 'englisch-gymnasium-nrw.html')
    # 13.11.2026: Gymnasium Bayern (LehrplanPLUS)
    b = ['<h1>Englisch üben für das Gymnasium in Bayern (Klasse 5–10)</h1>',
         '<p>English Trail ist eine kostenlose Lern-App ohne Werbung. Im <b>Schulmodus</b> wählst du <b>Bayern</b>, deine Klasse und dein Lehrwerk '
         '(z. B. <b>Green Line</b> von Klett oder <b>English G Access</b> von Cornelsen, Ausgabe Bayern). '
         'Wortschatz und Grammatik folgen dem LehrplanPLUS Englisch (1. Fremdsprache) – Jahrgangsstufe für Jahrgangsstufe.</p>'
         '<a class="cta" href="./">Jetzt kostenlos üben →</a>', '<h2>Themen und Grammatik nach Klasse</h2>']
    for g in range(5, 11):
        pk = [PK[i] for i, kk in school.BY_PACKS.items() if kk == g]
        gr = [grammar.TOPICS[t][0] for t, kk in school.BY_TOPICS.items() if kk == g]
        b.append(f'<div class="box"><b>Klasse {g}</b><br>' + E(', '.join(k['title'] for k in pk)) +
                 (f'<br><span class="muted">Grammatik: {E(", ".join(gr))}</span>' if gr else '') + '</div>')
    b.append('<h2>Was die App bietet</h2><ul><li><b>Buch-Vokabeln per Foto</b>: Vokabelseite fotografieren, die App liest die Wörter direkt auf dem Handy.</li>'
             '<li><b>Probe-Klassenarbeit</b> mit Grammatik, Vokabeln, Hör- und Leseverstehen und Sprachmittlung.</li>'
             '<li><b>Wochen-Challenge, Live-Duell und Hausaufgaben-Code</b> für die ganze Klasse – ohne Anmeldung.</li>'
             '<li>Keine Käufe, keine Werbung, kein Streak-Druck.</li></ul><a class="cta" href="./">English Trail öffnen →</a>')
    page('englisch-gymnasium-bayern.html', 'Englisch üben Gymnasium Bayern Klasse 5–10 – kostenlose App',
         'Kostenlose Englisch-App für das Gymnasium in Bayern: Wortschatz und Grammatik nach LehrplanPLUS, Klasse 5 bis 10, Vokabeln per Foto (Green Line, Access), Probe-Klassenarbeit. Ohne Werbung.',
         '\n'.join(b)); files.insert(3, 'englisch-gymnasium-bayern.html')
    # 13.11.2026: Gymnasium Niedersachsen (Zuordnung wie Gymnasium BW, passend zum KC Englisch Gymnasium NI)
    b = ['<h1>Englisch üben für das Gymnasium in Niedersachsen (Klasse 5–10)</h1>',
         '<p>English Trail ist eine kostenlose Lern-App ohne Werbung. Im <b>Schulmodus</b> wählst du <b>Niedersachsen</b>, deine Klasse und dein Lehrwerk '
         '(z. B. <b>English G Access</b>, <b>Green Line</b> oder <b>Camden Town</b>). Die Themen folgen dem Kerncurriculum Englisch: '
         'Familie, Schule und Hobbys in 5/6, Freizeit, Reisen, Medien und Sport in 7/8, Arbeitswelt und aktuelle Themen in 9/10.</p>'
         '<a class="cta" href="./">Jetzt kostenlos üben →</a>', '<h2>Themen und Grammatik nach Klasse</h2>']
    for g in range(5, 11):
        pk = [k for k in school.PACKS if k['grade'] == g]
        gr = [v[0] for t, v in grammar.TOPICS.items() if v[1] == g]
        b.append(f'<div class="box"><b>Klasse {g}</b><br>' + E(', '.join(k['title'] for k in pk)) +
                 (f'<br><span class="muted">Grammatik: {E(", ".join(gr))}</span>' if gr else '') + '</div>')
    b.append('<h2>Was die App bietet</h2><ul><li><b>Buch-Vokabeln per Foto</b>: Vokabelseite fotografieren, die App liest die Wörter direkt auf dem Handy.</li>'
             '<li><b>Probe-Klassenarbeit</b> mit Grammatik, Vokabeln, Hör- und Leseverstehen und Sprachmittlung.</li>'
             '<li><b>Wochen-Challenge, Live-Duell und Hausaufgaben-Code</b> für die ganze Klasse – ohne Anmeldung.</li>'
             '<li>Keine Käufe, keine Werbung, kein Streak-Druck.</li></ul><a class="cta" href="./">English Trail öffnen →</a>')
    page('englisch-gymnasium-niedersachsen.html', 'Englisch üben Gymnasium Niedersachsen Klasse 5–10 – kostenlose App',
         'Kostenlose Englisch-App für das Gymnasium in Niedersachsen: Wortschatz und Grammatik passend zum Kerncurriculum, Klasse 5 bis 10, Vokabeln per Foto (Access, Green Line, Camden Town), Probe-Klassenarbeit. Ohne Werbung.',
         '\n'.join(b)); files.insert(4, 'englisch-gymnasium-niedersachsen.html')
    # 13.11.2026: Gymnasium Hessen (G9)
    b = ['<h1>Englisch üben für das Gymnasium in Hessen (G9, Klasse 5–10)</h1>',
         '<p>English Trail ist eine kostenlose Lern-App ohne Werbung. Im <b>Schulmodus</b> wählst du <b>Hessen</b>, deine Klasse und dein Lehrwerk '
         '(z. B. <b>English G Access</b>, <b>Green Line</b> oder <b>Camden Town</b>). '
         'Wortschatz und Grammatik folgen dem hessischen Lehrplan Englisch für das Gymnasium – Jahrgangsstufe für Jahrgangsstufe.</p>'
         '<a class="cta" href="./">Jetzt kostenlos üben →</a>', '<h2>Themen und Grammatik nach Klasse</h2>']
    for g in range(5, 11):
        pk = [PK[i] for i, kk in school.HE_PACKS.items() if kk == g]
        gr = [grammar.TOPICS[t][0] for t, kk in school.HE_TOPICS.items() if kk == g]
        b.append(f'<div class="box"><b>Klasse {g}</b><br>' + E(', '.join(k['title'] for k in pk)) +
                 (f'<br><span class="muted">Grammatik: {E(", ".join(gr))}</span>' if gr else '') + '</div>')
    b.append('<h2>Was die App bietet</h2><ul><li><b>Buch-Vokabeln per Foto</b>: Vokabelseite fotografieren, die App liest die Wörter direkt auf dem Handy.</li>'
             '<li><b>Probe-Klassenarbeit</b> mit Grammatik, Vokabeln, Hör- und Leseverstehen und Sprachmittlung.</li>'
             '<li><b>Wochen-Challenge, Live-Duell und Hausaufgaben-Code</b> für die ganze Klasse – ohne Anmeldung.</li>'
             '<li>Keine Käufe, keine Werbung, kein Streak-Druck.</li></ul><a class="cta" href="./">English Trail öffnen →</a>')
    page('englisch-gymnasium-hessen.html', 'Englisch üben Gymnasium Hessen Klasse 5–10 – kostenlose App',
         'Kostenlose Englisch-App für das Gymnasium in Hessen: Wortschatz und Grammatik nach Lehrplan, Klasse 5 bis 10, Vokabeln per Foto (Access, Green Line, Camden Town), Probe-Klassenarbeit. Ohne Werbung.',
         '\n'.join(b)); files.insert(5, 'englisch-gymnasium-hessen.html')
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          f'  <url><loc>{SITE}</loc><lastmod>{TODAY}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>']
    sm += [f'  <url><loc>{SITE}{f}</loc><lastmod>{TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>' for f in files]
    sm.append('</urlset>')
    open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(sm) + '\n')
    print('OK  SEO-Seiten:', ', '.join(files))


if __name__ == '__main__':
    main()
