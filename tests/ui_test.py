#!/usr/bin/env python3
"""Browser-Test mit Playwright/Chromium (Idee aus ARDOC e2e/app.spec.js und GeoQuest smoke_test.js).

Spielt jeden Modus einmal komplett durch, prüft auf JS-Fehler, horizontales Scrollen am Handy,
Speichern in localStorage, Freischalten per Stadtprüfung und Dark Mode.
Aufruf: python3 tests/ui_test.py [--shots]    (Screenshots nach tests/shots/)
Voraussetzung: pip install playwright && python3 -m playwright install chromium
"""
import os, sys, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
# Über einen kleinen lokalen Webserver (wie im echten Betrieb): Schriften, Service Worker und Nachladen gehen nicht über file://
import http.server, threading, functools
_srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT)))
_srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=_srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:%d/index.html' % _srv.server_address[1]
SHOTS = '--shots' in sys.argv
SHOT_DIR = ROOT / 'tests' / 'shots'
fails, oks, OPTQ = [], [], []


def ok(m): oks.append(m); print('  [OK]', m)
def bad(m): fails.append(m); print('  [!!]', m)


def play_through(page, max_steps=150):
    """Klickt sich durch eine Runde (erste Option, falsche Eingaben) bis zum Ergebnis-Bildschirm."""
    for _ in range(max_steps):
        if page.locator('.result').count():
            return True
        if page.locator('#nx').count() and page.locator('#nx').is_visible():
            page.click('#nx'); continue
        if page.locator('[data-c]').count():  # Memory: Brute-Force-Paarsuche
            first = page.locator('[data-c]:not([disabled])').first
            fid = first.get_attribute('data-c'); first.click()
            n = page.locator('[data-c]').count()
            for j in range(n):
                if str(j) == fid: continue
                if page.locator(f'[data-c="{j}"]').is_disabled(): continue
                page.click(f'[data-c="{j}"]')
                if page.locator('.result').count() or page.locator(f'[data-c="{fid}"]').is_disabled(): break
                page.wait_for_timeout(480); page.click(f'[data-c="{fid}"]')
            continue
        if page.locator('.opt:not([disabled])').count():
            # Options-Qualität (aus GeoQuest option_quality_test.js): keine doppelten Optionen, mind. 2
            texts = [t.strip().lower() for t in page.locator('.opts .opt').all_inner_texts()]
            if len(texts) < 2: OPTQ.append(f'nur {len(texts)} Option(en): {texts}')
            if len(set(texts)) != len(texts): OPTQ.append(f'doppelte Option: {texts}')
            page.locator('.opt:not([disabled])').first.click()
            continue
        if page.locator('#ans:not([disabled])').count():
            page.fill('#ans', 'xyz'); page.click('#tf button.primary'); continue
        if page.locator('[data-in]:not(.used)').count():
            page.locator('[data-in]:not(.used)').first.click()
            if page.locator('#chk:not([disabled])').count(): page.click('#chk')
            continue
        if page.locator('#sg').count(): page.click('#sg'); continue
        if page.locator('#fin').count(): page.click('#fin'); continue
        if page.locator('[data-o]').count():
            page.locator('[data-o]').first.click(); continue
        page.wait_for_timeout(100)
    return page.locator('.result').count() > 0


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, locale='de-DE')
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    # Headless hat kein Mikrofon: Spracherkennung abschalten -> Selbstbewertung wird getestet
    page.add_init_script("window.SpeechRecognition = undefined; window.webkitSpeechRecognition = undefined;")
    page.goto(URL)
    page.wait_for_selector('#ob-go')
    ok('Onboarding sichtbar')
    if SHOTS: SHOT_DIR.mkdir(exist_ok=True); page.screenshot(path=str(SHOT_DIR / '01_onboarding.png'), full_page=True)
    page.click('#ob-why [data-v="travel"]'); page.click('#ob-goal [data-v="3"]'); page.click('#ob-go')
    page.wait_for_selector('.city-head')
    ok('Nach Onboarding: Stadt London')

    modes = ['learn', 'scene', 'quiz', 'listen', 'type', 'build', 'cloze', 'match', 'speak']
    for m in modes:
        page.evaluate(f"() => window.PSApp.startMode('{m}', 0)")
        done = play_through(page)
        (ok if done else bad)(f'Stadtmodus {m} durchgespielt')
        page.evaluate("() => window.PSApp.go('home')")

    for m in ['review', 'daily', 'cases', 'sounds', 'prices', 'twister', 'mistakes']:
        page.evaluate(f"() => window.PSApp.startMode('{m}')")
        if m == 'mistakes' and not page.locator('.game, .result').count():
            ok('Fehlerheft leer -> Hinweis'); continue
        done = play_through(page)
        (ok if done else bad)(f'Übungsmodus {m} durchgespielt')
        page.evaluate("() => window.PSApp.go('home')")

    page.evaluate("() => window.PSApp.startMode('blitz')")
    page.wait_for_timeout(1500)
    page.evaluate("() => { for (let i=0;i<3;i++){ const o=document.querySelector('.opt:not([disabled])'); if(o) o.click(); } }")
    ok('Blitz startet mit Timer') if page.locator('#timer').count() else bad('Blitz ohne Timer')
    page.click('#quit')

    # Familienduell
    page.evaluate("() => window.PSApp.go('practice')")
    page.click('[data-mode="duel"]'); page.click('#dgo')
    done = play_through(page)
    (ok if done and page.locator('.result h2').count() else bad)('Familienduell mit Sieger/Unentschieden')
    page.evaluate("() => window.PSApp.go('home')")

    # Meine Wörter
    page.evaluate("() => window.PSApp.go('practice')"); page.click('[data-mode="mywords"]')
    for pl, de in [('kręgosłup', 'Wirbelsäule'), ('mięsień', 'Muskel'), ('staw', 'Gelenk'), ('rozciąganie', 'Dehnen')]:
        page.fill('#mw-pl', pl); page.fill('#mw-m', de); page.click('#mw-add')
    n = page.locator('[data-del]').count()
    (ok if n == 4 else bad)(f'Eigene Wörter angelegt ({n})')
    page.click('#mw-practice'); (ok if play_through(page) else bad)('Eigene Wörter geübt')

    # XSS-Schutz: Spielername mit HTML
    page.evaluate("() => window.PSApp.go('practice')"); page.click('[data-mode="duel"]')
    page.fill('#p0', '<img src=x onerror="window.__xss=1">'); page.click('#dgo')
    page.wait_for_timeout(200)
    (bad if page.evaluate("() => window.__xss === 1") else ok)('Spielername wird escaped (kein XSS)')
    page.click('#quit')

    # Stadtprüfung: Durchlauf bis zum Ergebnis, danach Freischalt-Darstellung auf der Karte
    page.evaluate("() => window.PSApp.startMode('boss', 0)")
    done = play_through(page)
    (ok if done else bad)('Stadtprüfung läuft bis zum Ergebnis')
    page.evaluate("""() => { const s = window.PSApp.state(); s.boss = {lon: 90}; s.unlocked = 1; }""")
    page.evaluate("() => window.PSApp.go('home')")
    (ok if page.locator('.node.done').count() == 1 and page.locator('.node.next').count() == 1 else bad)('Karte zeigt erledigte und nächste Stadt')

    # Speichern
    saved = page.evaluate("() => localStorage.getItem('english_trail_v1') !== null")
    (ok if saved else bad)('Fortschritt in localStorage gespeichert')
    page.reload(); page.wait_for_selector('.map')
    xp = page.evaluate("() => window.PSApp.state().xp")
    (ok if xp > 0 else bad)(f'Fortschritt nach Neuladen erhalten ({xp} XP)')

    # Horizontal-Scroll am Handy auf allen Hauptseiten
    for t in ['home', 'practice', 'album', 'me']:
        page.evaluate(f"() => window.PSApp.go('{t}')")
        w = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        (ok if w <= 0 else bad)(f'Kein horizontales Scrollen auf {t} (390px)')
        if SHOTS: page.screenshot(path=str(SHOT_DIR / f'02_{t}.png'), full_page=True)
    page.evaluate("() => window.PSApp.go('city', 0)")
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '03_city.png'), full_page=True)
    page.evaluate("() => window.PSApp.startMode('build', 0)")
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '04_build.png'))
    page.click('#quit')
    page.evaluate("() => window.PSApp.startMode('scene', 0)")
    page.locator('[data-o]').first.click()
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '05_scene.png'), full_page=True)
    page.click('#quit')

    # Englisch als Basissprache
    page.evaluate("() => { window.PSApp.state().base='en'; window.PSApp.go('home'); }")
    (ok if 'Continue on the Szlak' in page.inner_text('#cta') else bad)('Englische Oberfläche')

    # Dark Mode
    page.emulate_media(color_scheme='dark'); page.evaluate("() => window.PSApp.go('home')")
    bg = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    (ok if bg == 'rgb(15, 21, 26)' else bad)(f'Dark Mode Hintergrund ({bg})')
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '06_home_dark.png'), full_page=True)

    # Regression: offene Einführungs-Tour darf nicht über einem Spiel liegen bleiben
    page.evaluate("() => { window.PSApp.state().tour = false; window.PSApp.go('home'); }"); page.wait_for_timeout(700)
    page.evaluate("() => window.PSApp.startMode('match', 0)"); page.wait_for_timeout(100)
    (ok if not page.locator('#tour').count() else bad)('Tour verschwindet, sobald ein Spiel startet')
    page.click('#quit'); page.evaluate("() => { window.PSApp.state().tour = true; }")

    # ---------- 3.0 ----------
    page.emulate_media(color_scheme='light')
    page.evaluate("() => { window.PSApp.state().base='de'; window.PSApp.go('home'); }")
    page.click('[data-mode="themes"]'); page.wait_for_selector('[data-th]')
    (ok if page.locator('[data-th]').count() >= 5 else bad)('Nach Thema: Themenliste')
    page.click('[data-th="schule"]'); page.wait_for_selector('[data-tu]')
    (ok if page.locator('[data-tu]').count() == 29 else bad)('Thema Schule: 29 Lernpakete (Klassen 5–10)')
    page.click('[data-mode="themelearn"]'); (ok if play_through(page) else bad)('Thema: neue Wörter')
    page.click('#home'); page.wait_for_selector('[data-tu]'); (ok if page.locator('h1').inner_text().startswith('Schule') else bad)('Zurück landet im Thema')
    page.click('[data-mode="themeq"]'); (ok if play_through(page) else bad)('Thema üben')
    pk = page.evaluate("() => window.PSApp.data().units.findIndex(u => u.sch === 8)")
    for m in ['learn', 'scene', 'quiz', 'build', 'boss']:
        page.evaluate(f"() => window.PSApp.startMode('{m}', {pk})")
        (ok if play_through(page) else bad)(f'Schul-Paket-Modus {m}')
    (ok if page.evaluate("() => window.PSApp.state().unlocked") < 12 else bad)('Paket-Prüfung schaltet keine Stadt frei')
    # Aussprache (English Trail statt Sprecherform)
    page.evaluate("() => window.PSApp.go('me')"); page.click('#s-acc [data-v="us"]')
    (ok if page.evaluate("() => window.PSApp.state().accent") == 'us' else bad)('Aussprache auf Amerikanisch umschaltbar')
    page.click('#s-acc [data-v="gb"]')
    # Konjugation
    page.evaluate("() => window.PSApp.go('practice')"); page.click('[data-mode="conj"]'); page.wait_for_selector('#cj-go')
    page.locator('[data-cv]').first.click(); (ok if page.locator('.conj-tab').count() else bad)('Verbtabelle klappt auf')
    (ok if all(x in page.inner_text('.conj-tab') for x in ('was / were', 'been')) else bad)('Verbtabelle: be – was / were – been')
    page.click('#cj-go'); page.wait_for_timeout(300)
    (ok if any(x in page.inner_text('main').lower() for x in ('2. form', '3. form')) else bad)('Unregelmäßige Verben: Abfrage 2./3. Form startet')
    (ok if play_through(page) else bad)('Runde unregelmäßige Verben')
    # Wochenrückblick + Kalender
    page.evaluate("() => { const s = window.PSApp.state(); const f = x => x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); const d = new Date(); d.setDate(d.getDate() - 7); const k = f(d); d.setDate(d.getDate() - (d.getDay()+6)%7); s.wlog = {}; s.wlog[f(d)] = { n: 12, m: 3, r: 40, w: 10 }; s.active[k] = 1; s.wrSeen = ''; s.welcomeDay = f(new Date()); window.PSApp.go('home'); }")
    (ok if page.locator('#wr').count() else bad)('Wochenrückblick sichtbar')
    if page.locator('#wr-x').count(): page.click('#wr-x')
    (ok if not page.locator('#wr').count() else bad)('Wochenrückblick schließbar')
    page.evaluate("() => window.PSApp.go('me')")
    with page.expect_download() as dl: page.click('#rem-go')
    (ok if dl.value.suggested_filename.endswith('.ics') else bad)('Kalender-Datei (.ics) wird erzeugt')
    (ok if page.locator('#voice').count() else bad)('Stimmen-Bereich unter Ich')
    for t2 in ['home', 'themes', 'me']:
        page.evaluate(f"() => window.PSApp.go('{t2}')")
        w = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        (ok if w <= 0 else bad)(f'Kein horizontales Scrollen auf {t2} (390px, 3.0)')
        if SHOTS: page.screenshot(path=str(SHOT_DIR / f'30_{t2}.png'), full_page=True)
    # Prüfmodus für Muttersprachler
    rv = ctx.new_page(); rv.on('pageerror', lambda e: errors.append(str(e)))
    rv.goto(URL + '?review'); rv.wait_for_selector('.rv-card')
    (ok if rv.inner_text('h1').strip() else bad)('Prüfmodus öffnet')
    k1 = rv.inner_text('.rv-card .eyebrow'); rv.click('#rv-ok'); rv.wait_for_timeout(100)
    (ok if rv.inner_text('.rv-card .eyebrow') != k1 else bad)('✓ springt zum nächsten Eintrag')
    rv.click('#rv-bad'); rv.fill('#rv-txt', 'Test'); rv.click('#rv-send'); rv.wait_for_timeout(1500)
    st = rv.evaluate("() => JSON.parse(localStorage.getItem('english_trail_review'))")
    (ok if st and len(st['res']) == 2 else bad)('Prüfergebnisse gespeichert (2)')
    rv.click('#rv-undo'); st = rv.evaluate("() => JSON.parse(localStorage.getItem('english_trail_review'))")
    (ok if len(st['res']) == 1 else bad)('Rückgängig im Prüfmodus')
    rv.close()

    # 3.1.2: übersprungene Stadt bleibt Ziel des Weiter-Knopfs, Prüfung erst nach Festigen
    page.evaluate("() => { const s = window.PSApp.state(); s._bk = JSON.stringify({b: s.boss, k: s.skipped, u: s.unlocked}); s.boss = {}; s.skipped = { lon: true, brg: true }; s.unlocked = 3; window.PSApp.go('home'); }")
    (ok if 'London' in page.inner_text('#cta') else bad)('Weiter führt zur übersprungenen Stadt London')
    page.evaluate("() => window.PSApp.go('city', 2)"); page.locator('.tiles [data-mode="boss"]').click(); page.wait_for_timeout(200)
    (ok if not page.locator('.game').count() else bad)('Stadtprüfung vor dem Festigen gesperrt')
    page.evaluate("() => { const s = window.PSApp.state(); const o = JSON.parse(s._bk); s.boss = o.b; s.skipped = o.k; s.unlocked = o.u; delete s._bk; }")

    # Was ist neu
    page.evaluate("() => { window.PSApp.state().seenVer = ''; window.PSApp.go('home'); }")
    (ok if page.locator('#nw').count() else bad)('Update-Hinweis auf der Startseite')
    page.click('#nw-all'); page.wait_for_selector('.news-ul')
    (ok if page.locator('.news-ul').count() >= 1 else bad)('Seite „Was ist neu“')
    page.evaluate("() => window.PSApp.go('home')"); (ok if not page.locator('#nw').count() else bad)('Update-Hinweis nur einmal')

    # Selbst schreiben (nur Eintippen) + Schreib-Momente im Antipp-Modus
    page.evaluate("() => { const s = window.PSApp.state(); s._inp = s.input; s.input = 'tap'; window.PSApp.startMode('selfwrite'); }"); page.wait_for_timeout(200)
    (ok if page.locator('.game #ans').count() and not page.locator('.game .opt').count() and page.locator('#sw-first').count() else bad)('Selbst schreiben: Eingabefeld statt Auswahl, auch im Antipp-Modus')
    qa = page.evaluate("() => window.PSApp.game().qs[0].a"); page.fill('#ans', qa); page.press('#ans', 'Enter'); page.wait_for_timeout(200)
    (ok if page.evaluate("() => window.PSApp.game().right") == 1 else bad)('Selbst schreiben: richtige Antwort zählt')
    (ok if page.evaluate("() => window.PSApp.state().wrOk") >= 1 else bad)('Selbst schreiben zählt für Extra-Federn')
    page.evaluate("() => { window.PSApp.go('practice'); }")
    page.evaluate("() => { const s = window.PSApp.state(); s.input = s._inp; delete s._inp; }")

    # Trail 3: Buchkapitel lesen
    page.evaluate("() => { window.PSApp.go('read', window.PSApp.data().units.findIndex(u => u.id === 'gcw')); }"); page.wait_for_timeout(300)
    (ok if 'Emma had always loved old books' in page.inner_text('main') else bad)('Trail 3: Kapitel 1 von „The Raven’s Key“ lesbar')
    page.evaluate("() => window.PSApp.go('practice')")
    (ok if page.locator('[data-mode="exam"]').count() else bad)('Prüfungstraining Cambridge als Kachel')
    def exam_run(lv):
        page.evaluate("() => window.PSApp.go('exam')"); page.wait_for_selector('#ex-lv')
        page.click('#ex-lv [data-v="%s"]' % lv); page.click('#ex-go')
        for _ in range(40):
            if page.locator('#ex-rcheck').count():
                for qi in range(page.locator('.rd-q').count()): page.locator('.rd-q').nth(qi).locator('.opt').first.click()
                page.click('#ex-rcheck')
            elif page.locator('#ex-txt').count() and page.locator('#ex-wcheck').count():
                page.fill('#ex-txt', 'Hi Sam, last weekend I went to the cinema with my friends because it was raining. Next weekend I am visiting my grandma. Could you come with me? It would be fun. See you soon, best wishes, Lea')
                page.click('#ex-wcheck')
            elif page.locator('[data-r]').count():
                page.locator('[data-r]').first.click(); break
            elif page.locator('[data-o]:not([disabled])').count():
                page.locator('[data-o]').first.click()
            if page.locator('#ex-next').count(): page.click('#ex-next')
            page.wait_for_timeout(40)
        page.wait_for_timeout(150)
        return page.evaluate("(lv) => window.PSApp.state().cam && window.PSApp.state().cam[lv]", lv), page.inner_text('main')
    r, txt = exam_run('a2')
    (ok if r and r.get('n') == 1 and 'Cambridge' in txt and 'Lesen' in txt else bad)('Prüfungstraining A2 Key komplett (%s)' % (r and r.get('best')))
    r, txt = exam_run('b1')
    (ok if r and r.get('n') == 1 else bad)('Prüfungstraining B1 Preliminary komplett (%s)' % (r and r.get('best')))
    (ok if not any(w in txt for w in ['Zdane', 'certyfikat', 'Pozdrawiam']) else bad)('Prüfungstraining ohne polnische Reste')

    # Alltags-Pakete in „Nach Thema“
    page.evaluate("() => window.PSApp.go('themes', 'notfall')"); page.wait_for_timeout(300)
    (ok if 'Notfälle' in page.inner_text('main') and 'Telefon' in page.inner_text('main') else bad)('Thema Notfall und Telefon mit Alltags-Paketen')
    ix = page.evaluate("() => window.PSApp.data().units.findIndex(u => u.id === 'a_rest')")
    page.evaluate("(i) => window.PSApp.startMode('scene', i)", ix); (ok if play_through(page) else bad)('Alltags-Paket Restaurant: Szene spielbar')

    # Mein Rabe (C): Federn nur aus XP/Raben, freischalten, bleibt gespeichert
    page.evaluate("() => { const s = window.PSApp.state(); s._xp = s.xp; s.xp = 150; s._kr = s.krasnale; s.krasnale = []; window.PSApp.go('album'); }")
    page.click('[data-rvopen]'); page.wait_for_selector('[data-rv]')
    page.click('[data-rv="hat:crown"]'); page.wait_for_timeout(100)
    (ok if page.evaluate("() => window.PSApp.state().raven.on.hat") == 'none' else bad)('Mein Rabe: zu wenig Federn → nichts freigeschaltet')
    page.click('[data-rv="hat:cap"]'); page.wait_for_timeout(100)
    rv = page.evaluate("() => window.PSApp.state().raven")
    (ok if rv['on']['hat'] == 'cap' and 'hat:cap' in rv['own'] and '🪶 0' in page.inner_text('main') else bad)('Mein Rabe: Cap für 3 Federn freigeschaltet (%s)' % rv)
    page.evaluate("() => { const s = window.PSApp.state(); s.xp = s._xp; s.krasnale = s._kr; delete s._xp; delete s._kr; }")
    col = page.evaluate("() => getComputedStyle(document.querySelector('[data-rv][aria-pressed=true]')).color") ; bgc = page.evaluate("() => getComputedStyle(document.querySelector('[data-rv][aria-pressed=true]')).backgroundColor")
    (ok if col != bgc else bad)('Gewählter Chip lesbar (Text ≠ Hintergrund)')

    # Übersicht „Was kann English Trail?“ + kinderleichtes Fehler melden (0.5)
    page.evaluate("() => window.PSApp.go('news')"); page.wait_for_selector('#nw-guide'); page.click('#nw-guide'); page.wait_for_selector('[data-gw]')
    n_k = page.locator('main section.card').count(); page.click('[data-gw="adults"]'); page.wait_for_timeout(100)
    (ok if n_k >= 5 and page.locator('main section.card').count() >= 4 and 'Datenschutz' in page.inner_text('main') else bad)('Übersicht für Kinder (%d) und Eltern & Lehrkräfte' % n_k)
    page.click('[data-gg="school"]'); page.wait_for_timeout(150)
    (ok if page.evaluate("() => window.PSApp.state() && document.querySelector('h1').textContent.indexOf('🎒') >= 0") else bad)('Übersicht: Ausprobieren öffnet die Ansicht')
    page.evaluate("() => window.PSApp.go('me')"); (ok if page.locator('#guide-open').count() else bad)('Übersicht unter „Ich“ verlinkt')
    if page.locator('#sy-up').count():
        page.fill('#sy-mail', 'kind@example.org'); page.fill('#sy-pw', 'geheim1234'); page.click('#sy-up'); page.wait_for_timeout(150)
        (ok if '16' in page.inner_text('#sync') and page.locator('#sy-u16').count() else bad)('Konto anlegen fragt nach 16+ / Einverständnis der Eltern')
    sent = []
    _cors = {'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, OPTIONS'}
    page.route('**/rest/v1/et_feedback', lambda r: (sent.append(r.request.post_data) if r.request.method == 'POST' else None, r.fulfill(status=201 if r.request.method == 'POST' else 204, headers=_cors, body='')))
    page.locator('#rep-me summary').click(); page.click('#rep-me [data-rc="rep_c1"]'); page.click('#rep-me button.btn'); page.wait_for_timeout(300)
    (ok if sent and 'Übersetzung falsch' in sent[0] and 'Danke' in page.inner_text('#rep-me') else bad)('Fehler melden mit einem Tipp (ohne Text)')
    page.evaluate("() => setTimeout(function(){ throw new Error('testfehler'); }, 0)"); page.wait_for_timeout(200)
    page.click('#rep-me [data-rc="rep_c5"]'); page.click('#rep-me button.btn'); page.wait_for_timeout(300)
    (ok if len(sent) > 1 and 'testfehler' in sent[1] else bad)('Fehler melden hängt die letzte technische Fehlermeldung an')
    page.unroute('**/rest/v1/et_feedback')
    errors[:] = [e for e in errors if 'testfehler' not in e]

    # ---------- 3.1 KI-Gespräch (Server nachgebaut) ----------
    import json as _json
    def _sb(route):
        u = route.request.url
        if '/functions/v1/et-chat' in u:
            b = _json.loads(route.request.post_data or '{}')
            if b.get('ping'): return route.fulfill(status=200, content_type='application/json', body='{"ok":true,"configured":true,"limit":40}')
            last = b['messages'][-1]['content']
            return route.fulfill(status=200, content_type='application/json', body=_json.dumps({'reply': 'Super! A co pijesz?', 'fix': 'Poproszę kawę.' if 'kawe' in last else '', 'hint': 'kawę (Akkusativ)', 'used': 3, 'limit': 40}))
        if '/rest/v1/et_progress' in u: return route.fulfill(status=200, content_type='application/json', body='[]')
        return route.fulfill(status=200, content_type='application/json', body='{}')
    ch = ctx.new_page(); ch.on('pageerror', lambda e: errors.append(str(e)))
    ch.route('https://supabase.arndt-software.de/**', _sb)
    ch.goto(URL); ch.wait_for_selector('#app')
    ch.evaluate("() => { localStorage.setItem('english_trail_auth', JSON.stringify({ at: 'x', rt: 'y', exp: Date.now() + 3600000, email: 'test@example.org', uid: '00000000-0000-0000-0000-000000000001' })); }")
    ch.reload(); ch.wait_for_selector('.map')
    ch.evaluate("() => window.PSApp.startMode('chat', 0)"); ch.wait_for_selector('#ch-in')
    (ok if ch.locator('.chat-log .npc').count() == 1 else bad)('KI-Gespräch startet mit dem ersten Satz der Szene')
    ch.fill('#ch-in', 'Poprosze kawe'); ch.click('#ch-f button.primary'); ch.wait_for_selector('.chat-fix')
    (ok if 'A co pijesz' in ch.inner_text('.chat-log') and 'Poproszę kawę.' in ch.inner_text('.chat-fix') else bad)('KI-Antwort und Korrektur werden angezeigt')
    (ok if 'heute 3 von 40' in ch.inner_text('main') else bad)('Tageszähler sichtbar')
    w = ch.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
    (ok if w <= 0 else bad)('KI-Gespräch ohne horizontales Scrollen')
    if SHOTS: ch.screenshot(path=str(SHOT_DIR / '31_chat.png'), full_page=True)
    ch.evaluate("() => { localStorage.removeItem('english_trail_auth'); }"); ch.reload(); ch.wait_for_selector('.map')
    ch.evaluate("() => window.PSApp.startMode('chat')"); ch.wait_for_selector('#ch-login')
    ok('Ohne Konto: Hinweis zur Anmeldung')
    ch.close()

    # ---------- 3.2 Lernstände sind sicher ----------
    sx = b.new_context(); sp = sx.new_page(); sp.on('pageerror', lambda e: errors.append(str(e)))
    sp.goto(URL); sp.wait_for_selector('#app')
    # a) alter Spielstand (Felder wie in 1.x/2.0, ohne neue Schlüssel) lädt vollständig
    OLD = '{"app":"english-trail","v":1,"base":"de","onboarded":true,"xp":412,"cards":{"lon:0":{"box":4,"seen":9,"due":"2026-01-01"},"lon:1":{"box":2,"seen":3,"due":"2026-01-01"}},"unlocked":2,"boss":{"lon":85,"brg":72},"scenes":{"lon":true},"krasnale":[1,2]}'
    sp.evaluate("(o) => { localStorage.clear(); localStorage.setItem('english_trail_v1', o); }", OLD); sp.reload(); sp.wait_for_selector('.map')
    st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.xp, s.cards['lon:0'].box, s.boss.brg, s.unlocked, s.appVer]; }")
    (ok if st[:4] == [412, 4, 72, 2] and st[4] else bad)('Alter Spielstand (2.0) lädt vollständig: %s' % st)
    bk = sp.evaluate("() => JSON.parse(localStorage.getItem('english_trail_bak') || '[]').map(b => [b.why, b.d.xp])")
    (ok if bk and bk[0] == ['auto', 412] else bad)('Beim Start wird automatisch gesichert: %s' % bk)
    # b) Versions-Update → Sicherung „vor Update“
    sp.evaluate("() => { const s = JSON.parse(localStorage.getItem('english_trail_v1')); s.appVer = '3.1.4'; localStorage.setItem('english_trail_v1', JSON.stringify(s)); }"); sp.reload(); sp.wait_for_selector('.map')
    bk = sp.evaluate("() => JSON.parse(localStorage.getItem('english_trail_bak')).map(b => b.why)")
    (ok if 'update' in bk else bad)('Vor einem Update wird gesichert: %s' % bk)
    # c) kaputter Text im Speicher → letzte Sicherung wird geladen, Original aufbewahrt
    sp.evaluate("() => localStorage.setItem('english_trail_v1', '{kaputt')"); sp.reload(); sp.wait_for_selector('.map')
    st = sp.evaluate("() => [window.PSApp.state().xp, localStorage.getItem('english_trail_rescue'), JSON.parse(localStorage.getItem('english_trail_v1')).xp]")
    (ok if st == [412, '{kaputt', 412] else bad)('Beschädigter Stand: Sicherung geladen, Original aufbewahrt: %s' % st)
    # d) reparierbarer Stand (xp kaputt) → Karten bleiben
    sp.evaluate("() => { localStorage.removeItem('english_trail_bak'); localStorage.removeItem('english_trail_rescue'); localStorage.setItem('english_trail_v1', JSON.stringify({ app: 'english-trail', onboarded: true, xp: 'NaN', cards: { 'lon:0': { box: 3, seen: 5 } }, boss: { lon: 80 } })); }")
    sp.reload(); sp.wait_for_selector('.map')
    st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.cards['lon:0'].box, s.boss.lon]; }")
    (ok if st[0] >= 3 and st[1] >= 80 else bad)('Reparierbarer Stand behält Karten und Prüfungen: %s' % st)
    # e) Neustart sichert vorher; Zurückholen fügt nur hinzu
    sp.evaluate("(o) => { localStorage.clear(); localStorage.setItem('english_trail_v1', o); }", OLD); sp.reload(); sp.wait_for_selector('.map')
    sp.evaluate("() => window.PSApp.go('me')"); sp.wait_for_selector('#safe')
    (ok if '412 XP' in sp.inner_text('#safe') else bad)('Ich: Abschnitt „Dein Fortschritt ist sicher“ zeigt den Stand')
    sp.click('#reset'); sp.click('#reset'); sp.wait_for_selector('#app')
    st = sp.evaluate("() => [window.PSApp.state().xp, JSON.parse(localStorage.getItem('english_trail_bak')).some(b => b.why === 'reset' && b.d.xp === 412)]")
    (ok if st == [0, True] else bad)('Neustart: vorher gesichert: %s' % st)
    sp.click('#ob-why [data-v="travel"]'); sp.click('#ob-goal [data-v="3"]'); sp.click('#ob-go'); sp.wait_for_timeout(500)
    if SHOTS: sp.screenshot(path=str(SHOT_DIR / '40_after_reset.png'), full_page=True)
    sp.evaluate("() => window.PSApp.go('me')"); sp.wait_for_selector('#safe')
    sp.click('#safe summary'); sp.locator('#safe [data-bk]').first.click(); sp.wait_for_timeout(300)
    st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.xp, s.boss.brg, s.cards['lon:0'].box]; }")
    (ok if st == [412, 72, 4] else bad)('Zurückholen bringt alles wieder: %s' % st)
    # f) Datei speichern / laden
    with sp.expect_download() as dl: sp.click('#bk-file')
    import json as _j2, tempfile as _tf; path = _tf.mktemp(suffix='.json'); dl.value.save_as(path); d = _j2.load(open(path, encoding='utf-8'))
    (ok if d.get('xp') == 412 else bad)('Sicherung als Datei')
    sx.close(); sx = b.new_context(); sp = sx.new_page(); sp.on('pageerror', lambda e: errors.append(str(e))); sp.goto(URL); sp.wait_for_selector('#ob-go')
    sp.click('#ob-why [data-v="travel"]'); sp.click('#ob-goal [data-v="3"]'); sp.click('#ob-go'); sp.wait_for_timeout(500)
    sp.evaluate("() => window.PSApp.go('me')"); sp.wait_for_selector('#bk-in', state='attached'); sp.set_input_files('#bk-in', path); sp.wait_for_timeout(400)
    (ok if sp.evaluate("() => window.PSApp.state().xp") == 412 else bad)('Sicherungs-Datei laden')
    # g) eigene Wörter: Löschen verschiebt den Fortschritt der anderen nicht
    sp.evaluate("() => { const s = window.PSApp.state(); s.custom = [['a','A','A'],['b','B','B'],['c','C','C']]; s.cards['my:0'] = {box:1,seen:1}; s.cards['my:1'] = {box:2,seen:2}; s.cards['my:2'] = {box:5,seen:5}; localStorage.setItem('english_trail_v1', JSON.stringify(s)); }")
    sp.reload(); sp.wait_for_selector('#app'); sp.evaluate("() => window.PSApp.go('mywords')"); sp.wait_for_timeout(300)
    if sp.locator('[data-del="0"]').count():
        sp.click('[data-del="0"]')
        st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.custom.map(w => w[0]).join(''), s.cards['my:0'] && s.cards['my:0'].box, s.cards['my:1'] && s.cards['my:1'].box, !!s.cards['my:2']]; }")
        (ok if st == ['bc', 2, 5, False] else bad)('Eigenes Wort löschen: Fortschritt der anderen bleibt richtig zugeordnet: %s' % st)
    else: bad('Eigene Wörter: Löschen-Knopf nicht gefunden')
    sx.close()

    # ---------- English Trail: keine App-Stimmen (Tondateien), Gerätestimme en-GB ----------
    vx = b.new_context(); vp = vx.new_page(); vp.on('pageerror', lambda e: errors.append(str(e)))
    vp.goto(URL); vp.wait_for_selector('#ob-go')
    vp.click('#ob-why [data-v="travel"]'); vp.click('#ob-goal [data-v="3"]'); vp.click('#ob-go'); vp.wait_for_timeout(400)
    vp.evaluate("() => window.PSApp.go('me')"); vp.wait_for_selector('#voice')
    (ok if vp.locator('#vs-src').count() == 0 else bad)('Keine polnischen App-Stimmen in English Trail')
    vx.close()

    # ---------- 3.5 Weiterlernen statt warten, „sicher“ erklärt ----------
    wx = b.new_context(); wp = wx.new_page(); wp.on('pageerror', lambda e: errors.append(str(e)))
    wp.goto(URL); wp.wait_for_selector('#app')
    wp.evaluate("""() => { const tm = new Date(Date.now() + 86400000), pad = n => String(n).padStart(2, '0'), d = tm.getFullYear() + '-' + pad(tm.getMonth() + 1) + '-' + pad(tm.getDate());
      const s = { app: 'english-trail', v: 1, base: 'de', onboarded: true, tour: true, xp: 300, cards: {}, unlocked: 0, boss: {}, scenes: { lon: true }, done: { lon: { learn: 1, quiz: 1, build: 1 } }, appVer: '3.5', seenVer: '3.5' };
      for (let i = 0; i < 19; i++) s.cards['lon:' + i] = { box: 1, seen: 2, due: d };
      localStorage.setItem('english_trail_v1', JSON.stringify(s)); }""")
    wp.reload(); wp.wait_for_selector('.map')
    cta = wp.inner_text('#cta')
    (ok if 'Brighton' in cta and 'vorlernen' in cta and 'mehr für heute' in wp.inner_text('main').lower() else bad)('Stadt für heute gefestigt: Hauptknopf schlägt Vorlernen vor, „Mehr für heute“: %s' % cta)
    wp.click('#cta'); wp.wait_for_timeout(300)
    (ok if wp.evaluate("() => { const g = window.PSApp.game(); return g && g.cfg && window.PSApp.data().units[g.cfg.unit].id; }") == 'brg' else bad)('Vorlernen startet „Neue Wörter“ der nächsten Stadt')
    # bestandene Stadt mit Wörtern im Aufbau, davon einige heute fällig
    wp.evaluate("""() => { const s = window.PSApp.state(), d = new Date(), pad = n => String(n).padStart(2, '0'), td = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      s.boss.lon = 90; s.unlocked = 1; for (let i = 0; i < 19; i++) s.cards['lon:' + i] = { box: i < 10 ? 4 : 2, seen: 6, due: i >= 15 ? td : '2099-01-01' };
      localStorage.setItem('english_trail_v1', JSON.stringify(s)); }""")
    wp.reload(); wp.wait_for_selector('.map'); wp.evaluate("() => window.PSApp.go('city', 0)"); wp.wait_for_selector('.city-head')
    txt = wp.inner_text('main')
    (ok if '10 sicher' in txt and '9 im Aufbau' in txt and wp.locator('[data-mode="due"]').count() == 1 else bad)('Stadt: „Wie sicher sind die Wörter?“ mit 10 sicher, 8 im Aufbau, Knopf für fällige')
    wp.click('[data-mode="due"]'); wp.wait_for_timeout(300)
    (ok if wp.evaluate("() => !!window.PSApp.game()") else bad)('Fällige Wörter der Stadt wiederholen startet')
    wp.evaluate("() => window.PSApp.go('me')"); wp.wait_for_selector('#sync')
    (ok if 'bleibt beim Anmelden erhalten' in wp.inner_text('#sync') else bad)('Konto-Bereich: Fortschritt bleibt beim Anmelden erhalten')
    wx.close()

    # ---------- English Trail: Schulmodus (BW Gymnasium) ----------
    sx = b.new_context(viewport={'width': 375, 'height': 812}); sp = sx.new_page(); sp.on('pageerror', lambda e: errors.append(str(e)))
    sp.goto(URL); sp.wait_for_selector('#ob-go')
    (ok if not sp.evaluate("() => { const R = window.PSApp.raw(); return !!(R.schoolHave && R.schoolHave['bw-gym']); }") else bad)('Ohne Schule: Schulpakete werden nicht geladen')
    sp.click('#ob-why [data-v="school"]'); sp.click('#ob-go'); sp.wait_for_selector('#sc-st', state='attached')
    (ok if sp.evaluate("() => { const R = window.PSApp.raw(); return !!(R.schoolHave && R.schoolHave['bw-gym']); }") else bad)('Schule gewählt: Pakete für BW-Gymnasium nachgeladen')
    (ok if sp.locator('#sc-st option[value="be"][disabled]').count() == 1 else bad)('Schule: andere Bundesländer noch gesperrt (bald)')
    sp.click('#sc-g [data-v="7"]'); sp.select_option('#sc-bk', 'gl25'); sp.click('#sc-cu [data-v="Unit 2"]'); sp.click('#sc-save'); sp.wait_for_selector('#sc-exam')
    (ok if 'aktuell im buch' in sp.inner_text('main').lower() and sp.evaluate("() => window.PSApp.state().school.unit") == 'Unit 2' else bad)('Schule: aktuelle Unit im Buch wählbar (Unit 2)')
    (ok if sp.locator('#cu-photo.primary #cu-ph-in[capture]').count() == 1 else bad)('Schule: Kamera-Knopf groß (primär) und öffnet direkt die Kamera, solange die Unit leer ist')
    sp.locator('[data-ug]').first.click(); sp.wait_for_timeout(150); sp.locator('[data-su="Unit 2"]').first.click(); sp.wait_for_selector('.game')
    (ok if sp.evaluate("() => window.PSApp.game().qs.length") >= 3 else bad)('Unit 2 üben: startet mit der gewählten Grammatik (auch ohne eigene Wörter)')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#cu-next'); sp.click('#cu-next'); sp.wait_for_timeout(100)
    (ok if sp.evaluate("() => window.PSApp.state().school.unit") == 'Unit 3' else bad)('Weiter zur nächsten Unit')
    (ok if sp.locator('#sc-check').count() and 'Willkommen in Klasse 7' in sp.inner_text('main') else bad)('Nach der Einrichtung: Startcheck wird angeboten')
    sp.click('#sc-check'); sp.wait_for_selector('.game'); nq = sp.evaluate("() => window.PSApp.game().qs.length")
    play_through(sp, 300); sp.wait_for_timeout(200)
    chk = sp.evaluate("() => window.PSApp.state().schCheck && window.PSApp.state().schCheck[7]")
    (ok if chk and 'pct' in chk and nq >= 15 else bad)('Startcheck: %d Aufgaben, Ergebnis gespeichert (%s)' % (nq, chk and chk.get('pct')))
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#sc-edit')
    (ok if sp.locator('[data-sg]').count() else bad)('Startcheck: Themen zum Wiederholen verlinkt')
    # Wechsel mit Warnung und Bestätigung
    sp.click('#sc-edit'); sp.click('#sc-g [data-v="8"]'); sp.click('#sc-save'); sp.wait_for_selector('#sc-conf')
    sp.click('#sc-conf-no'); sp.wait_for_timeout(150)
    (ok if sp.evaluate("() => window.PSApp.state().school.grade") == 7 else bad)('Wechsel abbrechen: Klasse bleibt 7')
    sp.click('#sc-edit'); sp.click('#sc-g [data-v="8"]'); sp.click('#sc-save'); sp.wait_for_selector('#sc-conf'); sp.click('#sc-conf-yes'); sp.wait_for_timeout(150)
    (ok if sp.evaluate("() => window.PSApp.state().school.grade") == 8 and sp.evaluate("() => !!window.PSApp.state().schCheck[7]") else bad)('Wechsel bestätigt: Klasse 8, alte Ergebnisse bleiben')
    sp.click('#sc-edit'); sp.click('#sc-g [data-v="7"]'); sp.click('#sc-save'); sp.click('#sc-conf-yes'); sp.wait_for_selector('#sc-exam')
    txt = sp.inner_text('main')
    (ok if all(x in txt.lower() for x in ('klasse 7', 'gymnasium', 'band 3')) else bad)('Schule: Klasse 7, Gymnasium, Lehrwerk Band 3')
    (ok if sp.locator('[data-sp]').count() == 4 else bad)('Schule: 4 Wortschatz-Pakete für Klasse 7')
    (ok if sp.locator('[data-sg="perfpast"]').count() and sp.locator('[data-sg="if2"]').count() == 0 else bad)('Schule: Grammatik 7/8 – present perfect vs. simple past ja, Typ II (Kl. 8) noch nicht')
    sp.click('[data-sg="if1"]'); sp.wait_for_timeout(300)
    (ok if play_through(sp) else bad)('Schule: Grammatik-Runde If-Satz Typ I')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('[data-sp]')
    sp.locator('[data-sp]').first.click(); sp.wait_for_selector('.city-head')
    (ok if 'klasse 7' in sp.inner_text('.city-head').lower() else bad)('Schule: Paket öffnet als Lektion')
    sp.click('#back'); sp.wait_for_selector('#sc-exam')
    sp.click('#sc-exam'); sp.wait_for_timeout(300)
    (ok if sp.evaluate("() => { const g = window.PSApp.game(); return g && g.qs.length; }") == 20 else bad)('Probe-Klassenarbeit: 20 Fragen')
    (ok if play_through(sp, 400) else bad)('Probe-Klassenarbeit durchspielbar')
    (ok if sp.evaluate("() => (window.PSApp.state().schoolBest || {})[7] != null") else bad)('Probe-Klassenarbeit: Bestwert gespeichert')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#par-txt')
    # Vokabeln per Foto (echte Texterkennung auf dem Gerät, Testbild schräg und unscharf)
    sp.click('#sc-photo'); sp.wait_for_selector('#ph-in', state='attached')
    (ok if sp.evaluate("() => { const ph = document.getElementById('ph'), pl = document.getElementById('mw-pl'); return !!(ph && pl && (ph.compareDocumentPosition(pl) & Node.DOCUMENT_POSITION_FOLLOWING)); }") else bad)('Meine Wörter: Foto steht vor dem Eintippen')
    sp.set_input_files('#ph-in', os.path.join(ROOT, 'tests', 'fixtures', 'vokabelseite.jpg'))
    for _ in range(90):
        if 'erkannt' in sp.inner_text('#ph-st') or 'konnte' in sp.inner_text('#ph-st') or 'geklappt' in sp.inner_text('#ph-st'): break
        sp.wait_for_timeout(1000)
    got = sp.input_value('#mw-bulk')
    (ok if 'library = Bibliothek' in got and 'timetable = Stundenplan' in got and got.count('\n') >= 4 else bad)('Vokabeln per Foto erkannt (%d Zeilen)' % (got.count('\n') + 1))
    n0 = sp.evaluate("() => window.PSApp.state().custom.length"); sp.fill('#mw-u', 'Unit 9'); sp.click('#mw-bulk-go'); sp.wait_for_timeout(200)
    (ok if sp.evaluate("() => window.PSApp.state().custom.filter(w => w[3] === 'Unit 9').length") >= 5 else bad)('Foto-Vokabeln mit Unit gespeichert')
    # Wortliste per Link teilen und in einem anderen Browser übernehmen
    sp.evaluate("() => { window._sh = ''; navigator.share = undefined; navigator.clipboard.writeText = (x) => { window._sh = x; return Promise.resolve(); }; window.PSApp.go('school'); }")
    sp.wait_for_selector('[data-wshare="Unit 9"]'); sp.click('[data-wshare="Unit 9"]'); sp.wait_for_timeout(200)
    link = sp.evaluate("() => window._sh || ''")
    m = __import__('re').search(r'#w=[A-Za-z0-9_-]+', link)
    (ok if m else bad)('Wortliste teilen erzeugt Link')
    if m:
        wx = b.new_context(viewport={'width': 375, 'height': 812}); wp = wx.new_page(); wp.goto(URL + m.group(0)); wp.wait_for_selector('#ws-ok')
        nprev = wp.locator('.list .li').count(); wp.click('#ws-ok'); wp.wait_for_timeout(200)
        got = wp.evaluate("() => window.PSApp.state().custom.filter(w => w[3] === 'Unit 9').length")
        (ok if nprev >= 5 and got == nprev else bad)('Geteilte Liste übernommen (%d Wörter, Unit 9)' % got)
        wx.close()
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#par-txt')
    sp.evaluate("() => { window._sh = []; navigator.share = undefined; }")
    sp.click('#hw-make'); sp.wait_for_timeout(150); hcode = sp.inner_text('#hw-out').split()[-1]
    (ok if hcode.startswith('HA7-P') else bad)('Hausaufgaben-Code erstellen (%s)' % hcode)
    sp.fill('#hw-in', hcode); sp.click('#hw-go'); sp.wait_for_selector('.game'); qa = sp.evaluate("() => window.PSApp.game().qs.map(q => q.a).join('|')")
    sp.evaluate("() => window.PSApp.go('school')"); sp.fill('#hw-in', hcode.lower()); sp.click('#hw-go'); sp.wait_for_selector('.game')
    (ok if qa and qa == sp.evaluate("() => window.PSApp.game().qs.map(q => q.a).join('|')") else bad)('Hausaufgabe: gleicher Code → gleiche Fragen')
    play_through(sp, 400); sp.wait_for_timeout(200)
    (ok if sp.locator('#hw-res').count() and hcode in str(sp.evaluate("() => window.PSApp.state().hwDone")) else bad)('Hausaufgabe: Ergebnis gespeichert und teilbar')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#par-txt')
    rep_txt = sp.inner_text('#par-txt')
    (ok if 'Klasse 7' in rep_txt and 'Note' in rep_txt and 'english.arndt-software.de' in rep_txt else bad)('Eltern-Bericht im Schulbereich (mit Probe-Note)')
    ix5 = sp.evaluate("() => window.PSApp.data().units.findIndex(u => u.id === 's5sch')") if sp.evaluate("() => !!(window.PSApp.data)") else -1
    if ix5 >= 0:
        sp.evaluate("(i) => window.PSApp.go('city', i)", ix5); sp.locator('.tiles [data-mode="learn"]').click(); sp.wait_for_timeout(300)
        (ok if sp.locator('.q-em').count() else bad)('Emojis bei Lernkarten Klasse 5')
        sp.evaluate("() => window.PSApp.go('school')")
    else:
        bad('PSApp.data fehlt für Emoji-Test')
    sw = sp.evaluate("() => document.documentElement.scrollWidth")
    (ok if sw <= 375 else bad)('Schule ohne horizontales Scrollen (%s px)' % sw)
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#sc-own'); sp.click('#sc-own'); sp.wait_for_selector('#mw-u')
    for en, de in [('scarf', 'Schal'), ('library', 'Bibliothek'), ('to borrow', 'ausleihen')]:
        sp.fill('#mw-pl', en); sp.fill('#mw-m', de); sp.fill('#mw-u', 'Unit 3'); sp.click('#mw-add')
    (ok if sp.locator('.badge', has_text='Unit 3').count() == 3 else bad)('Meine Wörter: Vokabeln mit Unit markiert')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('[data-su]')
    sp.click('[data-su="Unit 3"]'); sp.wait_for_timeout(300)
    (ok if sp.evaluate("() => !!window.PSApp.game()") and play_through(sp) else bad)('Schule: eigene Buch-Vokabeln einer Unit üben')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('[data-xu]')
    (ok if sp.locator('[data-xu="Unit 3"]').count() == 1 else bad)('Probe-Arbeit: eigene Unit auswählbar')
    kinds = sp.evaluate("() => { document.getElementById('sc-exam').click(); const g = window.PSApp.game(); return g ? g.qs.map(q => q.ask || '').join('|') : ''; }")
    (ok if all(k in kinds for k in ('🎧', '📖', '🔁')) else bad)('Probe-Arbeit enthält Hören, Lesen und Sprachmittlung')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('[data-sw]')
    sp.locator('[data-sw]').first.click(); sp.wait_for_selector('#wr-txt')
    sp.fill('#wr-txt', 'I have a lot of friends. My best friend is Ben and he is funny. We often argue, but we make up fast. A good friend is someone who listens. I trust my friends because they help me.')
    sp.click('#wr-check'); sp.wait_for_timeout(200)
    (ok if '%' in sp.inner_text('#wr-res') else bad)('Schreibauftrag wird geprüft: %s' % sp.inner_text('#wr-res').split('\n')[-1][:40])
    sp.evaluate("() => window.PSApp.go('mywords')"); sp.wait_for_selector('#mw-bulk-go', state='attached')
    sp.click('summary'); sp.fill('#mw-bulk', 'castle = Burg\nknight - Ritter\ntower\tTurm'); sp.fill('#mw-u', 'Unit 4'); sp.click('#mw-bulk-go'); sp.wait_for_timeout(200)
    (ok if sp.locator('.badge', has_text='Unit 4').count() == 3 else bad)('Vokabelliste einfügen mit Unit')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#sc-week')
    sp.click('#sc-week'); sp.wait_for_timeout(300)
    (ok if 'WEEK-' in sp.inner_text('main') else bad)('Wochen-Challenge öffnet mit Klassen-Code')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#sc-face'); sp.click('#sc-face'); sp.wait_for_selector('#fsrc')
    (ok if sp.locator('#fsrc [data-v="school"][aria-pressed="true"]').count() == 1 and sp.locator('#fsrc [data-v="u:Unit 3"]').count() == 0 and sp.locator('#fsrc [data-v="u:Unit 4"]').count() == 0 else bad)('Gegenüber: Quelle Klasse gewählt (Units mit < 4 Wörtern ausgeblendet)')
    sp.click('#fgo'); sp.wait_for_timeout(300)
    (ok if sp.locator('.face').count() else bad)('Gegenüber mit Schulstoff startet')
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('#sc-duel'); sp.click('#sc-duel'); sp.wait_for_selector('#d2code')
    (ok if sp.input_value('#d2code').endswith('-K7') else bad)('Duell-Code mit Klasse 7: %s' % sp.input_value('#d2code'))
    sp.evaluate("() => window.PSApp.go('school')"); sp.wait_for_selector('[data-like]')
    (ok if sp.locator('[data-like]').count() == 8 else bad)('Interessen: 8 Themen zur Auswahl')
    sp.click('[data-like="i_game"]'); sp.click('[data-like="i_anim"]'); sp.click('#likes-ok'); sp.wait_for_selector('#likes-edit')
    (ok if 'Gaming' in sp.inner_text('main') and 'Pferde' in sp.inner_text('main') else bad)('Interessen gespeichert und angezeigt')
    sp.locator('#likes-edit').locator('xpath=..').locator('[data-sp]').first.click(); sp.wait_for_selector('.city-head')
    sp.evaluate("() => window.PSApp.startMode('scene', window.PSApp.data().units.findIndex(u => u.id === 'i_game'))")
    (ok if play_through(sp) else bad)('Interessen-Paket Gaming: Szene spielbar')
    sx.close()

    # ---------- 0.14: Realschule (Bildungsplan Sekundarstufe I) ----------
    rx = b.new_context(viewport={'width': 375, 'height': 812}); rp = rx.new_page(); rp.on('pageerror', lambda e: errors.append(str(e)))
    rp.goto(URL); rp.wait_for_selector('#ob-go'); rp.click('#ob-why [data-v="school"]'); rp.click('#ob-go'); rp.wait_for_selector('#sc-ty')
    rp.click('#sc-ty [data-v="rs"]'); rp.wait_for_selector('#sc-ty [data-v="rs"][aria-pressed="true"]')
    bks = rp.evaluate("() => [...document.querySelectorAll('#sc-bk option')].map(o => o.value)")
    (ok if 'rl14' in bks and 'hlbw' in bks and 'gl25' not in bks else bad)('Realschule: passende Lehrwerke (Red Line, Highlight), kein Green Line')
    rp.click('#sc-g [data-v="8"]'); rp.select_option('#sc-bk', 'rl14'); rp.click('#sc-save'); rp.wait_for_selector('#sc-exam')
    txt = rp.inner_text('main').lower()
    (ok if 'realschule' in txt and 'klasse 8' in txt and 'red line' in txt else bad)('Realschule Klasse 8 eingerichtet')
    ids = rp.evaluate("() => [...document.querySelectorAll('[data-sp]')].map(b => window.PSApp.raw().units.length && b.textContent)")
    (ok if any('Jobs' in x for x in ids) and not any('History' in x for x in ids) else bad)('Realschule Kl. 8: Paket Arbeitswelt ja, Britische Geschichte (Kl. 9) noch nicht')
    (ok if rp.locator('[data-sg="pastprog"]').count() and rp.locator('[data-sg="reported"]').count() == 0 and rp.locator('[data-sg="pastperfprog"]').count() == 0 else bad)('Realschule Kl. 8: Grammatik 7/8/9 bis Kl. 8 (Past progressive ja, indirekte Rede mit Zeitverschiebung noch nicht)')
    (ok if '7/8/9' in txt else bad)('Realschule: Standardstufe 7/8/9 angezeigt')
    (ok if '-S8' in rp.inner_text('main') else bad)('Realschule: Wochen-Challenge-Code mit S')
    rp.click('#sc-edit'); rp.click('#sc-ty [data-v="gym"]'); rp.click('#sc-save'); rp.wait_for_selector('#sc-conf')
    (ok if 'realschule' in rp.inner_text('#sc-conf').lower() else bad)('Schulart wechseln: Warnung nennt Realschule → Gymnasium')
    rp.click('#sc-conf-no'); rp.wait_for_timeout(150)
    (ok if rp.evaluate("() => window.PSApp.state().school.type") == 'rs' else bad)('Schulart-Wechsel abbrechen: bleibt Realschule')
    # 0.16: Niveau E an der Gemeinschaftsschule, Werkrealschule mit Niveau G
    rp.click('#sc-edit'); rp.click('#sc-ty [data-v="gms"]'); rp.wait_for_selector('#sc-nv [data-v="e"]')
    (ok if rp.locator('#sc-nv [data-v]').count() == 3 else bad)('Gemeinschaftsschule: Niveau G/M/E wählbar')
    rp.click('#sc-nv [data-v="e"]'); rp.click('#sc-g [data-v="6"]'); rp.click('#sc-save'); rp.wait_for_selector('#sc-conf'); rp.click('#sc-conf-yes'); rp.wait_for_selector('#sc-exam')
    t2 = rp.inner_text('main')
    (ok if 'e (erweitert)' in t2.lower() and rp.locator('[data-sg="repsimple"]').count() and '-E6' in t2 else bad)('GMS Niveau E Kl. 6: indirekte Rede ohne Zeitverschiebung schon dran, Code mit E')
    rp.click('#sc-edit'); rp.click('#sc-ty [data-v="wrs"]'); rp.wait_for_selector('#sc-nv [data-v="g"][aria-pressed="true"]')
    rp.click('#sc-g [data-v="7"]'); rp.click('#sc-save'); rp.wait_for_selector('#sc-conf'); rp.click('#sc-conf-yes'); rp.wait_for_selector('#sc-exam')
    t3 = rp.inner_text('main')
    (ok if 'werkrealschule' in t3.lower() and rp.locator('[data-sg="perf"]').count() and rp.locator('[data-sg="pastprog"]').count() == 0 else bad)('Werkrealschule Niveau G Kl. 7: present perfect jetzt neu, past progressive noch nicht')
    # 0.17: Abschluss-Training (Werkrealschule Kl. 7 → noch keins; Realschule Kl. 10 → ja)
    (ok if rp.locator('#grad-open').count() == 0 else bad)('Abschluss-Training erst ab Klasse 9')
    rp.click('#sc-edit'); rp.click('#sc-ty [data-v="rs"]'); rp.click('#sc-g [data-v="10"]'); rp.click('#sc-save'); rp.wait_for_selector('#sc-conf'); rp.click('#sc-conf-yes'); rp.wait_for_selector('#grad-open')
    (ok if 'realschulabschluss' in rp.inner_text('main').lower() else bad)('Realschule Kl. 10: Abschluss-Training Realschulabschluss angeboten')
    rp.click('#grad-open'); rp.wait_for_selector('[data-gp="a"]')
    rp.click('[data-gp="a"]'); rp.wait_for_selector('#ga-topic'); rp.fill('#ga-notes', 'castles, tartan, Edinburgh'); rp.click('#ga-fq'); rp.wait_for_timeout(150)
    (ok if rp.locator('[data-say]').count() >= 15 else bad)('Präsentation: Thema, Stichworte, Redemittel und Nachfragen')
    rp.click('#gr-1 [data-v="4"]'); rp.click('#gr-2 [data-v="3"]'); rp.click('#gr-save'); rp.wait_for_selector('[data-gp="c"]')
    rp.click('[data-gp="c"]'); rp.wait_for_selector('#gc-show'); rp.click('#gc-show'); rp.wait_for_selector('#gc-next')
    rp.click('#gr-1 [data-v="8"]'); rp.click('#gr-save'); rp.wait_for_selector('[data-gp="b"]')
    rp.click('[data-gp="b"]'); rp.click('#gr-1 [data-v="5"]'); rp.click('#gr-2 [data-v="4"]'); rp.click('#gr-save'); rp.wait_for_selector('[data-gp="a"]')
    (ok if 'note 2,0' in rp.inner_text('main').lower() and rp.evaluate("() => window.PSApp.state().grad.notes['s10gen'] || Object.values(window.PSApp.state().grad.notes)[0]") else bad)('Kommunikationsprüfung: 24 Punkte → ungefähr Note 2,0, Stichworte gespeichert')
    rp.click('#gw-quiz'); rp.wait_for_selector('.game')
    (ok if rp.evaluate("() => window.PSApp.game().qs.length") == 24 else bad)('Schriftliche Prüfung: 24 Fragen A/B/C/E')
    (ok if play_through(rp, 300) else bad)('Schriftliche Prüfung durchspielbar')
    rp.evaluate("() => window.PSApp.go('grad')"); rp.wait_for_selector('#gw-write'); rp.click('#gw-write'); rp.fill('#gw-txt', 'Dear Mrs Smith, I would like to introduce myself. My hobbies are football and music. I am looking forward to my stay. I have a question about the food. Do you have pets? Best wishes, Tom.'); rp.click('#gw-check'); rp.wait_for_timeout(100)
    (ok if '%' in rp.inner_text('#gw-res') else bad)('Teil D Writing: Text wird geprüft')
    rx.close()
    # ---------- 0.15: Nordrhein-Westfalen, Gymnasium ----------
    nx = b.new_context(viewport={'width': 375, 'height': 812}); np_ = nx.new_page(); np_.on('pageerror', lambda e: errors.append(str(e)))
    np_.goto(URL); np_.wait_for_selector('#ob-go'); np_.click('#ob-why [data-v="school"]'); np_.click('#ob-go'); np_.wait_for_selector('#sc-st')
    (ok if np_.locator('#sc-st option[value="nw"]:not([disabled])').count() == 1 else bad)('NRW im Bundesland-Menü freigeschaltet')
    np_.select_option('#sc-st', 'nw'); np_.wait_for_timeout(150)
    tys = np_.evaluate("() => [...document.querySelectorAll('#sc-ty [data-v]')].map(b => b.getAttribute('data-v'))")
    bks = np_.evaluate("() => [...document.querySelectorAll('#sc-bk option')].map(o => o.value)")
    (ok if 'gym' in tys and 'acnw' in bks and 'glnw' in bks and 'gl25' not in bks and 'rl14' not in bks else bad)('NRW Gymnasium: NRW-Lehrwerke (%s)' % ','.join(bks))
    np_.click('#sc-g [data-v="6"]'); np_.select_option('#sc-bk', 'acnw'); np_.click('#sc-save'); np_.wait_for_selector('#sc-exam')
    txt = np_.inner_text('main')
    (ok if 'Nordrhein-Westfalen' in txt.upper().title() or 'NORDRHEIN-WESTFALEN' in txt.upper() else bad)('NRW Klasse 6 eingerichtet')
    (ok if np_.locator('[data-sg="rel"]').count() and np_.locator('[data-sg="if1"]').count() and np_.locator('[data-sg="passive"]').count() == 0 else bad)('NRW Kl. 6: Relativsätze und if I schon dran, Passiv (Kl. 7) noch nicht')
    (ok if '-N6' in txt else bad)('NRW: Wochen-Challenge-Code mit N')
    (ok if np_.evaluate("() => { const R = window.PSApp.raw(); return !!(R.schoolHave && R.schoolHave['nw-gym']); }") else bad)('NRW: Schulpakete geladen')
    # 0.18: Bayern
    np_.click('#sc-edit'); np_.select_option('#sc-st', 'by'); np_.wait_for_timeout(150)
    bks = np_.evaluate("() => [...document.querySelectorAll('#sc-bk option')].map(o => o.value)")
    (ok if 'glby' in bks and 'acnw' not in bks else bad)('Bayern: Lehrwerke Green Line/Access Bayern')
    np_.click('#sc-g [data-v="7"]'); np_.click('#sc-save'); np_.wait_for_selector('#sc-conf'); np_.click('#sc-conf-yes'); np_.wait_for_selector('#sc-exam')
    tb = np_.inner_text('main')
    (ok if 'bayern' in tb.lower() and '-B7' in tb and np_.locator('[data-sg="if3"]').count() and np_.locator('details [data-sg="if1"]').count() == 1 and 'Neu in Klasse 7.' in tb else bad)('Bayern Kl. 7: if III neu, if I nur noch unter Wiederholen, Code mit B')
    # 0.19: Niedersachsen
    np_.click('#sc-edit'); np_.select_option('#sc-st', 'ni'); np_.wait_for_timeout(150)
    bks = np_.evaluate("() => [...document.querySelectorAll('#sc-bk option')].map(o => o.value)")
    (ok if 'acni' in bks and 'ctni' in bks and 'glby' not in bks else bad)('Niedersachsen: eigene Lehrwerke')
    np_.click('#sc-save'); np_.wait_for_selector('#sc-conf'); np_.click('#sc-conf-yes'); np_.wait_for_selector('#sc-exam')
    (ok if 'niedersachsen' in np_.inner_text('main').lower() and '-K7' in np_.inner_text('main') else bad)('Niedersachsen Kl. 7 eingerichtet')
    # 0.20: Hessen
    np_.click('#sc-edit'); np_.select_option('#sc-st', 'he'); np_.wait_for_timeout(150); np_.click('#sc-save'); np_.wait_for_selector('#sc-conf'); np_.click('#sc-conf-yes'); np_.wait_for_selector('#sc-exam')
    th = np_.inner_text('main')
    (ok if 'hessen' in th.lower() and '-H7' in th and np_.locator('[data-sg="passive"]').count() and 'Neu in Klasse 7.' in th else bad)('Hessen Kl. 7: Passiv neu, Code mit H')
    # 0.21: NRW Gesamtschule mit Kursen, Hauptschule
    np_.click('#sc-edit'); np_.select_option('#sc-st', 'nw'); np_.wait_for_timeout(150)
    tys = np_.evaluate("() => [...document.querySelectorAll('#sc-ty [data-v]')].map(b => b.getAttribute('data-v'))")
    (ok if set(['gym', 'rs', 'ge', 'sek', 'hs']) <= set(tys) and 'wrs' not in tys and 'gms' not in tys else bad)('NRW: alle Schularten (%s)' % ','.join(tys))
    np_.click('#sc-ty [data-v="ge"]'); np_.wait_for_selector('#sc-nv [data-v="gk"]'); np_.click('#sc-nv [data-v="gk"]'); np_.click('#sc-g [data-v="8"]'); np_.click('#sc-save'); np_.wait_for_selector('#sc-conf'); np_.click('#sc-conf-yes'); np_.wait_for_selector('#sc-exam')
    tg = np_.inner_text('main')
    (ok if 'gesamtschule' in tg.lower() and '-U8' in tg and np_.locator('[data-sg="if1"]').count() and np_.locator('[data-sg="passive"]').count() == 0 else bad)('NRW Gesamtschule G-Kurs Kl. 8: if I ja, Passiv noch nicht, Code mit U')
    np_.click('#sc-edit'); np_.click('#sc-nv [data-v="ek"]'); np_.click('#sc-save'); np_.wait_for_selector('#sc-conf'); np_.click('#sc-conf-yes'); np_.wait_for_selector('#sc-exam')
    (ok if '-R8' in np_.inner_text('main') and np_.locator('[data-sg="passive"]').count() else bad)('NRW Gesamtschule E-Kurs Kl. 8: Passiv dran, Code mit R')
    nx.close()

    # ---------- English Trail: Live-Duell (2 Seiten, WebSocket durch BroadcastChannel ersetzt) ----------
    MOCK = """(() => { window.WebSocket = function (url) { const self = this; this.readyState = 0; this.url = url; const bc = new BroadcastChannel('mockrt'); let topic = null;
      setTimeout(() => { self.readyState = 1; self.onopen && self.onopen(); }, 30);
      bc.onmessage = (e) => { const m = e.data; if (m.topic === topic && self.onmessage) self.onmessage({ data: JSON.stringify({ topic, event: 'broadcast', payload: m.payload }) }); };
      this.send = (txt) => { const m = JSON.parse(txt); if (m.event === 'phx_join') { topic = m.topic; setTimeout(() => self.onmessage && self.onmessage({ data: JSON.stringify({ topic, event: 'phx_reply', ref: m.ref, payload: { status: 'ok', response: {} } }) }), 20); } else if (m.event === 'broadcast') bc.postMessage({ topic: m.topic, payload: m.payload }); };
      this.close = () => { bc.close(); self.readyState = 3; }; }; })();"""
    lx = b.new_context(viewport={'width': 375, 'height': 812}); lx.add_init_script(MOCK)
    p1 = lx.new_page(); p2 = lx.new_page()
    for pg in (p1, p2):
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.goto(URL); pg.wait_for_selector('#app'); pg.wait_for_timeout(300)
        if pg.locator('#ob-go').count(): pg.click('#ob-go'); pg.wait_for_timeout(200)
        pg.evaluate("() => window.PSApp.go('live')"); pg.wait_for_selector('#ld-new')
    p1.fill('#ld-name', 'Mia'); p1.click('#ld-new'); p1.wait_for_selector('#ld-copy')
    code = p1.evaluate("() => window.PSApp.live().code")
    p2.fill('#ld-name', 'Ben'); p2.fill('#ld-code', code); p2.click('#ld-go')
    try:
        p2.wait_for_selector('#ld-ready', timeout=8000); p1.wait_for_selector('#ld-ready', timeout=8000)
    except Exception:
        print('DEBUGLIVE', code, [pg.evaluate("() => { const L = window.PSApp.live(); return L && [L.phase, L.err, L.opp && L.opp.name, L.code]; }") for pg in (p1, p2)], p2.inner_text('main')[:300]); raise
    (ok if 'Ben' in p1.inner_text('main') and 'Mia' in p2.inner_text('main') else bad)('Live-Duell: beide sehen sich (Code %s)' % code)
    p1.click('#ld-ready'); p2.click('#ld-ready'); p1.wait_for_selector('[data-lo]', timeout=8000); p2.wait_for_selector('[data-lo]', timeout=8000)
    same = p1.evaluate("() => window.PSApp.live().q.a") == p2.evaluate("() => window.PSApp.live().q.a")
    (ok if same else bad)('Live-Duell: beide haben dieselbe Frage')
    a1 = p1.evaluate("() => window.PSApp.live().q.a"); wrong = [o for o in p2.evaluate("() => window.PSApp.live().q.opts") if o != a1][0]
    p2.click('[data-lo="%s"]' % wrong.replace('"', '\\"')); p1.wait_for_timeout(150); p1.click('[data-lo="%s"]' % a1.replace('"', '\\"')); p1.wait_for_timeout(500)
    s1 = p1.evaluate("() => window.PSApp.live().score"); s2 = p2.evaluate("() => window.PSApp.live().score")
    (ok if s1 == [1, 0] and s2 == [0, 1] else bad)('Live-Duell: Punkt für die richtige Antwort, beide Handys gleich (%s / %s)' % (s1, s2))
    p1.wait_for_timeout(2200)
    (ok if p1.evaluate("() => window.PSApp.live().i") == 1 and p2.evaluate("() => window.PSApp.live().i") == 1 else bad)('Live-Duell: beide gehen gemeinsam zur nächsten Frage')
    a2 = p1.evaluate("() => window.PSApp.live().q.a")
    p1.click('[data-lo="%s"]' % a2.replace('"', '\\"')); p1.wait_for_timeout(100); p2.click('[data-lo="%s"]' % a2.replace('"', '\\"')); p1.wait_for_timeout(500)
    (ok if p1.evaluate("() => window.PSApp.live().score") == [2, 0] and p2.evaluate("() => window.PSApp.live().score") == [0, 2] else bad)('Live-Duell: der Schnellere bekommt den Punkt')
    p2.click('#brand'); p1.wait_for_timeout(500)
    (ok if p1.evaluate("() => window.PSApp.live().phase") == 'done' and p1.evaluate("() => window.PSApp.live().left") else bad)('Live-Duell: Gegner verlässt → Ergebnis')
    sw = p1.evaluate("() => document.documentElement.scrollWidth")
    (ok if sw <= 375 else bad)('Live-Duell ohne horizontales Scrollen')
    lx.close()

    (ok if not OPTQ else bad)('Antwortoptionen eindeutig in allen Modi' + ('' if not OPTQ else ': ' + ' | '.join(OPTQ[:3])))
    real = [e for e in errors if 'speechSynthesis' not in e and 'supabase' not in e and 'Failed to load resource' not in e and 'CORS' not in e]
    (ok if not real else bad)('Keine JS-Fehler' + ('' if not real else ': ' + ' | '.join(real[:3])))
    b.close()

print(f'\n{len(oks)} OK, {len(fails)} Fehler')
print('PASS' if not fails else 'FAIL')
sys.exit(1 if fails else 0)
