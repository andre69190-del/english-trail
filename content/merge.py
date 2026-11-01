#!/usr/bin/env python3
"""English Trail – Inhalte aus content/*.py in src/data.json einmischen.

    python3 content/merge.py

Bis alles portiert ist, bleiben noch nicht übertragene Teile (Trail 2/3, Pakete, …) aus der
Polski-Szlak-Vorlage stehen und sind mit "legacy": 1 markiert (siehe PROJEKTSTAND.md, Abschnitt 4).
Basissprache ist immer Deutsch: Das frühere Englisch-Feld wird mit dem deutschen Text gefüllt.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'content'))
import trail1  # noqa: E402
import grammar  # noqa: E402
import extras  # noqa: E402
import school  # noqa: E402
import interests  # noqa: E402

DATA = os.path.join(ROOT, 'src', 'data.json')
D = json.load(open(DATA, encoding='utf-8'))


def P(de):
    return [de, de]


def unit(k):
    words = []
    for line in k['words'].strip().split('\n'):
        en, de = [x.strip() for x in line.split('|', 1)]
        words.append([en, de, de])
    sc = k['scene']
    steps = [{'npc': [s['npc'][0], s['npc'][1], s['npc'][1]],
              'opts': [[o[0], o[1], o[1], o[2]] for o in s['opts']],
              'hint': P(s['hint'])} for s in sc['steps']]
    u = {'id': k['id'], 'city': k['city'], 'cityDe': k['cityDe'], 'cityEn': k['city'], 'lon': k['lon'], 'lat': k['lat'],
         'trail': k['trail'], 'title': P(k['title']), 'can': P(k['can']), 'tip': P(k['tip']), 'fact': P(k['fact']),
         'words': words, 'sentences': [[en, de, de] for en, de in k['sentences']],
         'scene': {'intro': P(sc['intro']), 'steps': steps, 'outro': P(sc['outro'])}}
    if k.get('lab'): u['lab'] = k['lab']
    return u


old = D['units']
old_r1 = [u for u in old if not u.get('pack') and (u.get('r') or 1) == 1 and not u.get('legacy')]
new_r1 = [unit(k) for k in trail1.UNITS]
assert len(new_r1) == 12
idmap = {}
if old_r1 and old_r1[0]['id'] != new_r1[0]['id']:
    idmap = {a['id']: b['id'] for a, b in zip(old_r1, new_r1)}
rest = [u for u in old if u['id'] not in idmap and u['id'] not in {n['id'] for n in new_r1}]
for u in rest:
    u['legacy'] = 1
D['units'] = new_r1 + rest

# Missionen, Radio, Brief für Trail 1
mi = D.get('missions') or {}
for a in idmap: mi.pop(a, None)
ra = D['listen'].get('radio') or {}
for a in idmap: ra.pop(a, None)
for k in trail1.UNITS:
    mi[k['id']] = {'pl': k['mission'][0], 'd': P(k['mission'][1])}
    ra[k['id']] = list(k['radio'])
D['missions'] = mi; D['listen']['radio'] = ra
D['letter'] = {'prolog': P(trail1.LETTER['prolog']), 'finale': P(trail1.LETTER['finale']),
               'lines': [dict({'u': k['id'], 'pl': k['letter']['en'], 'tr': P(k['letter']['de'])},
                              **({'bridge': P(k['letter']['bridge'])} if k['letter'].get('bridge') else {})) for k in trail1.UNITS]}
D['letterQuiz'] = [{'l': l, 'q': P(q), 'o': [P(o) for o in opts]} for l, q, opts in trail1.LETTER_QUIZ]
D['outline'] = [trail1.OUTLINE_GB, trail1.OUTLINE_IE]

# Themen-Zuordnung auf neue IDs umstellen
for th in D.get('themes') or []:
    th['u'] = [idmap.get(x, x) for x in th['u']]

# Phase 3: Zeiten-Werkstatt, Simple vs. Progressive, unregelmäßige Verben
D['cases'] = grammar.cases()
D['aspects'] = grammar.aspects()
D['verbs'] = grammar.verbs()

# Phase 3: Laute, Zungenbrecher, Raben, Stadt-Land-Fluss, Land & Leute
D['sounds'] = [{'g': g, 'de': d, 'en': d, 'ex': ex, 'exm': P(m)} for g, d, ex, m in
               ([x.strip() for x in l.split('|')] for l in extras.SOUNDS.strip().split('\n'))]
D['twisters'] = [[en, de, de] for en, de in extras.TWISTERS]
D['krasnale'] = [[n, w, de, de] for n, w, de in ([x.strip() for x in l.split('|')] for l in extras.RAVENS.strip().split('\n'))]
D['pm'] = {'letters': extras.PM_LETTERS, 'cats': [{'id': i, 'pl': en, 'de': de, 'en': en, 'words': [w.replace('_', ' ') for w in ws.replace('Los Angeles', 'Los_Angeles').replace('police officer', 'police_officer').split(' ')]}
                                                 for i, en, de, ws in extras.PM_CATS]}
C = D['culture']
C['facts'] = [[k, k, v] for k, v in extras.FACTS]
C['people'] = [{'name': n, 'clues': [P(c) for c in cl]} for n, cl in extras.PEOPLE]
C['tf'] = [[int(a), st, st, ex, ex] for a, st, ex in ([x.strip() for x in l.split('|')] for l in extras.TF.strip().split('\n'))]
C['timeline'] = [[int(y), ev, ev] for y, ev in ([x.strip() for x in l.split('|')] for l in extras.TIMELINE.strip().split('\n'))]
C['places'] = [[n, d, d, float(lo), float(la)] for n, d, lo, la in ([x.strip() for x in l.split('|')] for l in extras.PLACES.strip().split('\n'))]
C['hl'] = [{'q': P(h['q']), 'unit': P(h['unit']), 'items': [[a, b] for a, b in h['items']]} for h in extras.HL]

# Phase 4: Schulmodus (BW Gymnasium 5–10) – Lernpakete als Einheiten mit "pack": 1 und "sch": Klasse
D['units'] = [u for u in D['units'] if not u.get('sch')]
for k in school.PACKS:
    u = unit(dict(k, city=k['name'], cityDe='Klasse %d: %s' % (k['grade'], k['title']), lon=-0.13, lat=51.51, trail='blue',
                  mission=None, radio=None, letter=None))
    u['pack'] = 1; u['sch'] = k['grade']; u['ico'] = k['ico']
    D['units'].append(u)
D['school'] = {'states': [{'id': i, 'name': n, 'on': a} for i, n, a in school.STATES],
               'types': [{'id': i, 'name': n, 'on': a} for i, n, a in school.TYPES],
               'grades': school.GRADES, 'books': [{'id': i, 'name': n} for i, n in school.BOOKS],
               'topics': {g: {'t': n, 'k': kk} for g, (n, kk) in grammar.TOPICS.items()}}

# Schule: Interessen-Pakete (frei wählbar) – Einheiten mit "pack": 1 und "int": 1
D['units'] = [u for u in D['units'] if not u.get('int')]
for k in interests.PACKS:
    u = unit(dict(k, city=k['name'], cityDe=k['title'], lon=-0.13, lat=51.51, trail='green', mission=None, radio=None, letter=None))
    u['pack'] = 1; u['int'] = 1; u['ico'] = k['ico']
    D['units'].append(u)

# Vor der Veröffentlichung (01.11.2026): alle noch polnischen Vorlage-Teile entfernen.
# Trail 2/3, Themenpakete, Profi-Bereich, Tagebuch, Buch und B1-Prüfung kommen in Phase 6 neu auf Englisch dazu.
D['units'] = [u for u in D['units'] if not u.get('legacy')]
UID = {u['id'] for u in D['units']}
for k in ('polacy', 'diary', 'book'):
    D.pop(k, None)
D['missions'] = {k: v for k, v in D['missions'].items() if k in UID}
D['listen']['radio'] = {k: v for k, v in D['listen']['radio'].items() if k in UID}
D['listen']['learn'] = [list(x) for x in extras.LEARN]
D['themes'] = [dict(th, u=[x for x in th['u'] if x in UID]) for th in D.get('themes') or []]
D['themes'] = [th for th in D['themes'] if th['u'] and th['id'] != 'schule']
D['themes'] = [th for th in D['themes'] if th['id'] != 'hobby']
D['themes'].append({'id': 'hobby', 'ico': '⭐', 't': P('Interessen: Gaming, Sport, Tiere, Musik …'), 'u': [u['id'] for u in D['units'] if u.get('int')]})
D['themes'].append({'id': 'schule', 'ico': '🎒', 't': P('Schule: Gymnasium BW, Klassen 5–10'), 'u': [u['id'] for u in D['units'] if u.get('sch')]})
D['news'] = [{'v': v, 'date': d, 'de': n, 'en': n} for v, d, n in extras.NEWS_ALL]
D['audio'] = {}
D['guide'] = extras.GUIDE

json.dump(D, open(DATA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'OK  Trail 1: {len(new_r1)} Orte · Einheiten gesamt {len(D["units"])} (davon Schule {sum(1 for u in D["units"] if u.get("sch"))})')
