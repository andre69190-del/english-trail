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
    (ok if page.locator('[data-tu]').count() == 18 else bad)('Thema Schule: 18 Lernpakete (Klassen 5–10)')
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
    sp.click('#ob-why [data-v="school"]'); sp.click('#ob-go'); sp.wait_for_selector('#sc-st')
    (ok if sp.locator('#sc-st option[value="by"][disabled]').count() == 1 else bad)('Schule: andere Bundesländer noch gesperrt (bald)')
    sp.click('#sc-g [data-v="7"]'); sp.select_option('#sc-bk', 'gl25'); sp.click('#sc-save'); sp.wait_for_selector('#sc-exam')
    txt = sp.inner_text('main')
    (ok if all(x in txt.lower() for x in ('klasse 7', 'gymnasium', 'band 3')) else bad)('Schule: Klasse 7, Gymnasium, Lehrwerk Band 3')
    (ok if sp.locator('[data-sp]').count() == 3 else bad)('Schule: 3 Wortschatz-Pakete für Klasse 7')
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

    (ok if not OPTQ else bad)('Antwortoptionen eindeutig in allen Modi' + ('' if not OPTQ else ': ' + ' | '.join(OPTQ[:3])))
    real = [e for e in errors if 'speechSynthesis' not in e and 'supabase' not in e and 'Failed to load resource' not in e and 'CORS' not in e]
    (ok if not real else bad)('Keine JS-Fehler' + ('' if not real else ': ' + ' | '.join(real[:3])))
    b.close()

print(f'\n{len(oks)} OK, {len(fails)} Fehler')
print('PASS' if not fails else 'FAIL')
sys.exit(1 if fails else 0)
