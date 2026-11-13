/* English Trail – Kernlogik (rein, ohne DOM). Wird von tests/core.test.js direkt geprüft.
   Alles hängt an globalThis.PSCore. */
(function (G) {
  'use strict';
  var DIA = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z','ä':'a','ö':'o','ü':'u','ß':'ss' };

  function stripDia(s) { return String(s).replace(/[ąćęłńóśźżäöüß]/g, function (c) { return DIA[c]; }); }

  /* Kleinschreibung, Satzzeichen weg, Leerraum zusammenfassen. lenient=true entfernt zusätzlich Diakritika. */
  function norm(s, lenient) {
    var t = String(s == null ? '' : s).toLowerCase()
      .replace(/[…]/g, ' ')
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[.,!?;:"„“”'’«»()\-–—]/g, ' ')
      .replace(/\s+/g, ' ').trim();
    return lenient ? stripDia(t) : t;
  }

  /* "on / ona" → ["on","ona", "on / ona"]; "Katze / Kater" → ["katze","kater", …] */
  function variants(target) {
    var raw = String(target);
    var parts = raw.split(/\s*\/\s*/).filter(Boolean);
    var out = [norm(raw)];
    parts.forEach(function (p) { var n = norm(p); if (n && out.indexOf(n) < 0) out.push(n); });
    return out;
  }

  function lev(a, b) {
    a = String(a); b = String(b);
    if (a === b) return 0;
    var m = a.length, n = b.length, i, j, prev = [], cur = [];
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  /* Prüft eine getippte Antwort.
     kind: exact | diacritics (nur Akzente fehlen) | typo (1 Tippfehler, ab 5 Zeichen) | wrong
     ok:   true für exact; diacritics nur wenn !hardcore; typo nur wenn !hardcore */
  function checkAnswer(input, target, opts) {
    opts = opts || {};
    var inN = norm(input), vs = variants(target), i;
    if (!inN) return { ok: false, kind: 'empty' };
    for (i = 0; i < vs.length; i++) if (inN === vs[i]) return { ok: true, kind: 'exact' };
    var inL = stripDia(inN);
    for (i = 0; i < vs.length; i++) if (inL === stripDia(vs[i])) return { ok: !opts.hardcore, kind: 'diacritics', expected: vs[i] };
    for (i = 0; i < vs.length; i++) {
      var v = vs[i];
      if (v.length >= 5 && lev(inL, stripDia(v)) === 1) return { ok: !opts.hardcore, kind: 'typo', expected: v };
    }
    return { ok: false, kind: 'wrong', expected: vs[0] };
  }

  /* Sprecherform (3.0): Inhalte schreiben geschlechtsabhängige Formen als {männlich|weiblich}, z. B. „{byłem|byłam}“.
     gform wählt die Form ('f' = weiblich, sonst männlich). */
  var GRX = /\{([^{}|]*)\|([^{}|]*)\}/g;
  function gform(text, g) { return String(text == null ? '' : text).replace(GRX, function (m, a, b) { return g === 'f' ? b : a; }); }
  function hasG(text) { GRX.lastIndex = 0; var r = GRX.test(String(text)); GRX.lastIndex = 0; return r; }
  /* Ausspracherückmeldung je Wort: welche Wörter des Zielsatzes wurden erkannt? Reihenfolge-tolerant, 1 Tippfehler ab 5 Buchstaben. */
  function wordDiff(target, heard) {
    var hs = norm(heard, true).split(' ').filter(Boolean), used = {};
    return String(target).trim().split(/\s+/).map(function (w) {
      var n = norm(w, true); if (!n) return { w: w, ok: true };
      for (var i = 0; i < hs.length; i++) {
        if (used[i]) continue;
        if (hs[i] === n || (n.length >= 5 && lev(hs[i], n) <= 1)) { used[i] = 1; return { w: w, ok: true }; }
      }
      return { w: w, ok: false };
    });
  }

  /* Kalender-Erinnerung (3.0): iCalendar-Datei mit wöchentlicher Wiederholung, ohne Push und ohne Server.
     days = ['MO','WE',…], time = 'HH:MM' (Ortszeit, „floating“), now = Date für Startdatum und Zeitstempel */
  var ICS_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function icsReminder(days, time, title, desc, url, now) {
    days = (days || []).filter(function (d) { return ICS_DAYS.indexOf(d) >= 0; }); if (!days.length) return null;
    var m = /^(\d{1,2}):(\d{2})$/.exec(time || ''); if (!m || +m[1] > 23 || +m[2] > 59) return null;
    now = now || new Date();
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +m[1], +m[2]);
    for (var i = 0; i < 8 && (days.indexOf(ICS_DAYS[d.getDay()]) < 0 || d <= now); i++) d.setDate(d.getDate() + 1);
    var p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var loc = d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + 'T' + p2(d.getHours()) + p2(d.getMinutes()) + '00';
    var st = now.getUTCFullYear() + p2(now.getUTCMonth() + 1) + p2(now.getUTCDate()) + 'T' + p2(now.getUTCHours()) + p2(now.getUTCMinutes()) + p2(now.getUTCSeconds()) + 'Z';
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//English Trail//Erinnerung//DE', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:english-trail-' + hash(days.join() + time + st) + '@english.arndt-software.de', 'DTSTAMP:' + st, 'DTSTART:' + loc, 'DURATION:PT10M',
      'RRULE:FREQ=WEEKLY;BYDAY=' + days.join(','), 'SUMMARY:' + icsEsc(title), 'DESCRIPTION:' + icsEsc(desc + (url ? '\n' + url : '')), url ? 'URL:' + url : null,
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(title), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n') + '\r\n';
  }

  /* Zahlen 0–999 auf Polnisch */
  var ONES = ['zero','jeden','dwa','trzy','cztery','pięć','sześć','siedem','osiem','dziewięć'];
  var TEENS = ['dziesięć','jedenaście','dwanaście','trzynaście','czternaście','piętnaście','szesnaście','siedemnaście','osiemnaście','dziewiętnaście'];
  var TENS = ['','','dwadzieścia','trzydzieści','czterdzieści','pięćdziesiąt','sześćdziesiąt','siedemdziesiąt','osiemdziesiąt','dziewięćdziesiąt'];
  var HUND = ['','sto','dwieście','trzysta','czterysta','pięćset','sześćset','siedemset','osiemset','dziewięćset'];
  function numToPl(n) {
    n = Math.floor(n);
    if (n < 0 || n > 999) throw new Error('numToPl: 0..999');
    if (n < 10) return ONES[n];
    var parts = [], h = Math.floor(n / 100), r = n % 100;
    if (h) parts.push(HUND[h]);
    if (r >= 10 && r < 20) parts.push(TEENS[r - 10]);
    else {
      if (r >= 20) parts.push(TENS[Math.floor(r / 10)]);
      if (r % 10) parts.push(ONES[r % 10]);
    }
    return parts.join(' ');
  }
  /* 1 złoty · 2–4 złote (nicht 12–14) · sonst złotych */
  function zlotyForm(n) {
    if (n === 1) return 'złoty';
    var l = n % 10, t = n % 100;
    if (l >= 2 && l <= 4 && !(t >= 12 && t <= 14)) return 'złote';
    return 'złotych';
  }
  function priceWords(n) { return numToPl(n) + ' ' + zlotyForm(n); }
  /* English Trail: englische Zahlwörter und Preise in Pfund (£3.50 = "three pounds fifty") */
  var EN1 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var EN10 = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function numToEn(n) {
    n = Math.floor(n);
    if (n < 0 || n > 999) throw new Error('numToEn: 0..999');
    if (n < 20) return EN1[n];
    if (n < 100) return EN10[Math.floor(n / 10)] + (n % 10 ? '-' + EN1[n % 10] : '');
    return EN1[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numToEn(n % 100) : '');
  }
  function priceEn(pounds, pence) { return numToEn(pounds) + (pounds === 1 ? ' pound' : ' pounds') + (pence ? ' ' + numToEn(pence) : ''); }
  function priceTag(pounds, pence) { return '£' + pounds + '.' + (pence < 10 ? '0' : '') + pence; }

  /* Spaced Repetition (Leitner, 0–6). Intervalle in Tagen. */
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32];
  var MASTERED_BOX = 4;
  function srsUpdate(card, correct, today) {
    card = card ? { box: card.box | 0, due: card.due, seen: (card.seen | 0), wrong: (card.wrong | 0) } : { box: 0, due: today, seen: 0, wrong: 0 };
    card.seen += 1;
    /* Richtig, aber noch nicht fällig: zählt nicht als neuer Schritt – Wiederholung braucht Abstand */
    if (correct && card.due > today) return card;
    if (correct) card.box = Math.min(card.box + 1, INTERVALS.length - 1);
    else { card.box = card.box > 2 ? 2 : 1; card.wrong += 1; }
    card.due = addDays(today, correct ? INTERVALS[card.box] : 1);
    return card;
  }
  function isDue(card, today) { return !!card && card.due <= today; }

  /* Datum als YYYY-MM-DD in lokaler Zeit */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseDay(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function addDays(k, n) { var d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); }
  /* Woche beginnt Montag. Schlüssel = Datum des Montags. */
  function weekKey(k) { var d = parseDay(k), wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return dayKey(d); }
  function prevWeek(wk) { return addDays(wk, -7); }
  /* Tage seit dem letzten aktiven Tag (vor heute); -1 = noch nie aktiv */
  function daysSince(activeDays, todayKey) {
    var last = Object.keys(activeDays || {}).filter(function (k) { return k < todayKey; }).sort().pop();
    if (!last) return -1;
    return Math.round((parseDay(todayKey) - parseDay(last)) / 86400000);
  }
  /* Roter Faden pro Stadt: empfohlene Reihenfolge, nächster offener Schritt (null = Stadt geschafft) */
  var STEPS = ['learn', 'scene', 'quiz', 'build'];
  /* Reife einer Stadt: wie viele ihrer n Wörter gesehen sind und an zwei Tagen saßen (Box ≥ 2) */
  var RIPE_BOX = 2, RIPE_SHARE = 1;   /* 3.1.2: ALLE Wörter einer Stadt müssen an zwei Tagen gesessen haben (Wunsch des Nutzers) */
  function cityRipe(st, uid, n) {
    var seen = 0, ripe = 0, cards = st.cards || {};
    for (var i = 0; i < n; i++) { var c = cards[uid + ':' + i]; if (c) { seen++; if (c.box >= RIPE_BOX) ripe++; } }
    return { n: n, seen: seen, ripe: ripe, need: Math.ceil(n * RIPE_SHARE) };
  }
  /* n = Wortzahl der Stadt; ohne n entfällt die Reife-Bremse vor der Prüfung */
  function nextStep(st, uid, n) {
    var d = (st.done && st.done[uid]) || {};
    if (st.boss && st.boss[uid]) return null;
    for (var i = 0; i < STEPS.length; i++) {
      var m = STEPS[i];
      if (m === 'scene' ? !(st.scenes && st.scenes[uid]) : !d[m]) return m;
    }
    if (n) {
      var r = cityRipe(st, uid, n);
      if (r.seen < n) return 'learn';
      if (r.ripe < r.need) return 'ripen';
    }
    return 'boss';
  }
  /* Der Brief: ein Satz pro Stadt wird lesbar, sobald die Stadt geschafft (oder per Einstufung übersprungen) ist */
  function letterRead(lines, st) {
    return (lines || []).map(function (l) { return !!((st.boss && st.boss[l.u]) || (st.skipped && st.skipped[l.u])); });
  }
  function daysInWeek(activeDays, wk) {
    var c = 0; for (var i = 0; i < 7; i++) if (activeDays[addDays(wk, i)]) c++; return c;
  }
  /* Wochen-Serie: zusammenhängende Wochen mit erfülltem Wochenziel.
     Die laufende Woche zählt nur, wenn sie schon erfüllt ist – sie bricht die Serie aber nie. */
  function weekStreak(activeDays, goal, todayKey) {
    var wk = weekKey(todayKey), s = 0;
    if (daysInWeek(activeDays, wk) >= goal) s++;
    wk = prevWeek(wk);
    var guard = 0;
    while (daysInWeek(activeDays, wk) >= goal && guard++ < 520) { s++; wk = prevWeek(wk); }
    return s;
  }
  function totalDays(activeDays) { return Object.keys(activeDays || {}).length; }

  /* Deterministischer Zufall (für Tagesrätsel: alle bekommen dieselben Fragen) */
  function hash(str) { var h = 2166136261 >>> 0; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {
    var a = typeof seed === 'number' ? seed >>> 0 : hash(String(seed));
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function shuffle(arr, r) { r = r || Math.random; var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(arr, n, r) { return shuffle(arr, r).slice(0, n); }

  /* XP & Stufen: Stufe n braucht 50·n·(n+1) XP insgesamt */
  function xpForLevel(n) { return 50 * n * (n + 1); }
  function levelFromXp(xp) {
    var lv = 0; while (xp >= xpForLevel(lv + 1)) lv++;
    var base = xpForLevel(lv), next = xpForLevel(lv + 1);
    return { level: lv + 1, into: xp - base, need: next - base };
  }
  function comboBonus(combo) { return Math.min(Math.max(combo - 1, 0) * 2, 10); }
  function xpFor(correct, combo, hardcore) { if (!correct) return 0; return (10 + comboBonus(combo)) * (hardcore ? 2 : 1); }

  /* Teilen-Text fürs Tagesrätsel (wie Wordle) */
  function shareText(dateKey, results) {
    var good = results.filter(Boolean).length;
    var bar = results.map(function (r) { return r ? '🟩' : '⬜'; }).join('');
    return 'English Trail · ' + dateKey + ' · ' + good + '/' + results.length + '\n' + bar;
  }

  /* Duell-Code: zwei Handys, gleicher Code = exakt gleiche Fragen.
     Format WORT-123-S (S = Stufe 1 leicht, 2 mittel, 3 schwer, P1–P3 = Dla Polaków). Die Stufe steckt im Code,
     damit nicht die Einstellung des Handys über die Fragen entscheidet.
     Gemischtes Duell: gleicher Stamm WORT-123, jeder seine eigene Stufe → andere Fragen, Punkte gewichtet. */
  var DUEL_WORDS = ['CAT', 'DOG', 'FOX', 'OWL', 'BEAR', 'LION', 'TIGER', 'RAVEN', 'TRAIN', 'CASTLE', 'BRIDGE', 'TEA', 'RAIN', 'STAR', 'MOON', 'APPLE', 'PIZZA', 'ROBOT', 'DRAGON', 'SHARK'];
  var DUEL_DIFFS = ['easy', 'medium', 'hard'];
  var DUEL_WEIGHT = { '1': 1, '2': 1.5, '3': 2, 'P1': 2, 'P2': 2.5, 'P3': 3 };
  /* English Trail: optional „-K7“ = nur Schulstoff der Klasse 7 (Gymnasium BW) – gleiche Fragen für alle mit diesem Code */
  /* 13.11.2026: „-S7“ = Schulstoff Klasse 7 nach Bildungsplan Sekundarstufe I (Realschule, Gemeinschaftsschule) */
  /* 13.11.2026: Lehrplan im Code: K = Gymnasium BW, S = Sekundarstufe I BW (Realschule/GMS), N = Gymnasium NRW */
  var PLAN_L = { sek1: 'S', nw: 'N', sek1g: 'G', sek1e: 'E' }, L_PLAN = { S: 'sek1', N: 'nw', G: 'sek1g', E: 'sek1e' };
  function planLetter(plan) { return PLAN_L[plan] || 'K'; }
  function duelNewCode(r, level, grade, plan) {
    r = r || Math.random;
    var w = DUEL_WORDS[Math.floor(r() * DUEL_WORDS.length)], n = 100 + Math.floor(r() * 900);
    var lv = DUEL_WEIGHT[String(level).toUpperCase()] ? String(level).toUpperCase() : '1';
    return w + '-' + n + '-' + lv + (grade >= 5 && grade <= 10 ? '-' + planLetter(plan) + grade : '');
  }
  /* Klasse eines Schulpakets je Bildungsplan (ohne Plan = Gymnasium = u.sch); 0 = in diesem Plan nicht vorgesehen */
  function schGradeOf(data, u, plan) {
    if (!u || !u.sch) return 0;
    if (!plan) return u.sch;
    var P = data && data.school && data.school.plans && data.school.plans[plan];
    return P && P.p && P.p[u.id] ? P.p[u.id] : 0;
  }
  /* Erste Klasse der Standardstufe: Gymnasium 5/6, 7/8, 9/10 – Sekundarstufe I 5/6, 7/8/9, 10 */
  function schLoOf(g, plan) { if (/^sek1/.test(plan || '')) return g <= 6 ? 5 : g <= 9 ? 7 : 10; return g - ((g - 5) % 2); }
  function schHiOf(g, plan) { if (/^sek1/.test(plan || '')) return g <= 6 ? 6 : g <= 9 ? 9 : 10; return schLoOf(g) + 1; }
  function duelWeight(lv) { return DUEL_WEIGHT[String(lv)] || 1; }
  function duelParse(str) {
    var c = String(str || '').toUpperCase().replace(/[\s_.]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    var m = c.match(/^([A-Z]{2,8})-?(\d{3})-?(P?)-?([123])(?:-?([KSNGE])(5|6|7|8|9|10))?$/);
    if (!m) return null;
    var n = +m[4], lv = m[3] + n, k = m[6] ? +m[6] : 0, pl = k ? (L_PLAN[m[5]] || '') : '';
    return { code: m[1] + '-' + m[2] + '-' + lv + (k ? '-' + planLetter(pl) + k : ''), base: m[1] + '-' + m[2], lv: lv, pol: !!m[3], level: n, diff: m[3] ? 'hard' : DUEL_DIFFS[n - 1], weight: duelWeight(lv), grade: k, plan: pl };
  }
  /* Prüfzeichen über die sprachunabhängige Fragen-Signatur: beide Handys müssen dasselbe zeigen */
  function duelCheck(sig) { return ('0000' + hash(String(sig)).toString(36).toUpperCase()).slice(-4); }
  function fmtTime(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  /* Prüfsumme über Code + Ergebnis: nachträglich geänderte Ergebnisse fallen auf (kein Kryptoschutz, aber gegen Tippen/Schummeln per Hand) */
  var INP_MARK = { write: 'W', speak: 'S', tap: 'T' };
  function duelName(n) { return String(n || '').replace(/[\n\r#~\/\u00b7:0-9]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20); }
  function duelSign(code, check, name, right, total, secs, inp) { return duelCheck(['sig', code, check, duelName(name).toLowerCase(), right, total, secs, inp || ''].join('|')); }
  function duelResultText(code, check, results, ms, extra) {
    var good = results.filter(Boolean).length, x = extra || {}, name = duelName(x.name), inp = INP_MARK[x.input] || '', secs = Math.max(0, Math.round(ms / 1000));
    return 'English Trail \u2694 ' + code + ' #' + check + '\n' + (name ? name + ' \u00b7 ' : '') + good + '/' + results.length + ' \u00b7 ' + fmtTime(ms) + (inp ? ' \u00b7 ' + inp : '') + '\n' +
      results.map(function (r) { return r ? '\ud83d\udfe9' : '\u2b1c'; }).join('') + '\n~' + duelSign(code, check, name, good, results.length, secs, inp);
  }
  function duelReadResult(text) {
    var t = String(text || ''), mc = t.match(/([A-Za-z]{2,8}-\d{3}-[Pp]?[123])/), ms = t.match(/(\d+)\s*\/\s*(\d+)/), mt = t.match(/(\d+):(\d{2})/), mk = t.match(/#([0-9A-Za-z]{4})/);
    if (!ms) return null;
    var line = t.match(/\n\s*([^\n\u00b7]*?)\s*\u00b7\s*\d+\s*\/\s*\d+/), mi = t.match(/\d:\d{2}\s*\u00b7\s*([WST])\b/), msg = t.match(/~([0-9A-Za-z]{4})/);
    var pc = mc ? duelParse(mc[1]) : null, o = { code: pc ? pc.code : null, base: pc ? pc.base : null, lv: pc ? pc.lv : null, check: mk ? mk[1].toUpperCase() : null, right: +ms[1], total: +ms[2], ms: mt ? (+mt[1] * 60 + +mt[2]) * 1000 : null,
      name: line ? duelName(line[1]) : '', input: mi ? mi[1] : '' };
    o.signed = !!(msg && pc && o.check && o.ms != null && msg[1].toUpperCase() === duelSign(o.code, o.check, o.name, o.right, o.total, o.ms / 1000, o.input));
    return o;
  }
  function duelScore(o) { return Math.round(o.right * duelWeight(o.lv) * 10) / 10; }
  /* Fragenplan fürs Duell: hängt NUR vom Code und den Inhalten ab – nicht vom Lernstand,
     nicht von der Basissprache, nicht von Math.random und nicht von der Stufe in den Einstellungen.
     Ablenker werden über Wort-Positionen gewählt und sind in PL, DE und EN verschieden. */
  var DUEL_MIX = { w: 10, c: 4, t: 3, p: 2, h: 1 };
  function duelPlan(data, code) {
    var pc = duelParse(code); if (!pc) return null;
    var r = rng('duel|' + pc.code), cfg = diffCfg(pc.diff), plan = [], i;
    if (pc.pol) {
      if (!data.polacy) return null;
      var pq = [];
      Object.keys(data.polacy).sort().forEach(function (c) { data.polacy[c].forEach(function (x, xi) { if (x.lv === pc.level) pq.push([c, xi]); }); });
      shuffle(pq, r).slice(0, 20).forEach(function (x) { var q = data.polacy[x[0]][x[1]]; plan.push({ k: 'q', c: x[0], i: x[1], opts: shuffle([q.a].concat(q.o), r) }); });
      return { code: pc.code, base: pc.base, lv: pc.lv, level: pc.level, pol: true, diff: pc.diff, plan: plan, check: duelCheck(JSON.stringify(plan)) };
    }
    var words = [], K = pc.grade, KLO = K ? schLoOf(K, pc.plan) : 0;
    /* nur Trail 1 (ohne Pakete) bzw. mit „-K“ nur die Schulpakete des Doppeljahrgangs: neue Inhalte ändern die Duell-Fragen nicht */
    data.units.forEach(function (u, ui) { var ug = K ? schGradeOf(data, u, pc.plan) : 0; if (K ? !(ug >= KLO && ug <= K) : (u.r || u.pack)) return; u.words.forEach(function (w, wi) { words.push([ui, wi]); }); });
    var W = function (x) { return data.units[x[0]].words[x[1]]; };
    var keys = function (w) { return ['p' + norm(w[0]), 'd' + norm(w[1]), 'e' + norm(w[2])]; };
    var idx = function (n) { var a = []; for (var k = 0; k < n; k++) a.push(k); return a; };
    var MIX = K ? { w: 14, c: 6, t: 0, p: 0, h: 0 } : DUEL_MIX;
    shuffle(words, r).slice(0, MIX.w).forEach(function (x, n) {
      var seen = {}, outs = [];
      keys(W(x)).forEach(function (k) { seen[k] = 1; });
      shuffle(words, r).forEach(function (y) {
        if (outs.length >= cfg.opts - 1) return;
        var ks = keys(W(y));
        if (ks.some(function (k) { return seen[k]; })) return;
        ks.forEach(function (k) { seen[k] = 1; }); outs.push(y);
      });
      plan.push({ k: 'w', dir: n % 2 ? 'x2pl' : 'pl2x', item: x, opts: shuffle([x].concat(outs), r) });
    });
    var PT = pc.plan && data.school && data.school.plans && data.school.plans[pc.plan] ? data.school.plans[pc.plan].t : null;   /* Grammatik nach Lehrplan des Codes */
    var cIdx = idx(data.cases.length).filter(function (ci) { var c = data.cases[ci], ck = PT && c.g ? (PT[c.g] || 99) : (c.k || 5); return !K || ck <= K; });
    shuffle(cIdx, r).slice(0, MIX.c).forEach(function (ci) {
      plan.push({ k: 'c', i: ci, type: cfg.clozeType, opts: shuffle(data.cases[ci].opts, r) });
    });
    shuffle(idx(data.culture.tf.length), r).slice(0, MIX.t).forEach(function (ti) { plan.push({ k: 't', i: ti }); });
    var people = data.culture.people;
    shuffle(idx(people.length), r).slice(0, MIX.p).forEach(function (pi) {
      var others = people.map(function (x) { return x.name; }).filter(function (nm) { return nm !== people[pi].name; });
      plan.push({ k: 'p', i: pi, opts: shuffle([people[pi].name].concat(shuffle(others, r).slice(0, Math.max(3, cfg.opts - 1))), r) });
    });
    for (i = 0; i < MIX.h; i++) {
      var hs = Math.floor(r() * data.culture.hl.length), pr = hlPair(data.culture.hl[hs].items, r);
      if (pr) plan.push({ k: 'h', i: hs, pair: [pr[0][0], pr[1][0]] });
    }
    plan = shuffle(plan, r);
    if (!plan.length) return null;
    return { code: pc.code, base: pc.base, lv: pc.lv, level: pc.level, pol: false, diff: pc.diff, grade: K, plan: plan, check: duelCheck(JSON.stringify(plan)) };
  }

  /* 1 = ich gewinne, -1 = Gegner, 0 = Gleichstand. Mehr richtig gewinnt, bei Gleichstand die schnellere Zeit. */
  function duelCompare(me, other) {
    if (me.lv && other.lv && me.lv !== other.lv) { var sa = duelScore(me), sb = duelScore(other); if (sa !== sb) return sa > sb ? 1 : -1; }
    else if (me.right !== other.right) return me.right > other.right ? 1 : -1;
    if (me.ms == null || other.ms == null) return 0;
    var a = Math.round(me.ms / 1000), b = Math.round(other.ms / 1000);
    return a === b ? 0 : (a < b ? 1 : -1);
  }

  /* Geräte-Abgleich: zwei Spielstände zusammenführen, ohne Fortschritt zu verlieren.
     Zähler und Rekorde = Maximum, Sammlungen = Vereinigung, Wortkarten = die mit mehr Wiederholungen,
     Einstellungen = vom zuletzt gespeicherten Stand (ts). Eigene Wörter werden angehängt, ihre Karten umnummeriert. */
  function mergeSave(a, b) {
    if (!validateSave(a)) return validateSave(b) ? b : a;
    if (!validateSave(b)) return a;
    var nw = (b.ts || 0) > (a.ts || 0) ? b : a, ol = nw === a ? b : a, o = JSON.parse(JSON.stringify(nw));
    function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; }
    function arr(x) { return Array.isArray(x) ? x : []; }
    function each(k, f) { var A = obj(nw[k]), B = obj(ol[k]), r = {}; Object.keys(A).concat(Object.keys(B)).forEach(function (i) { r[i] = i in A ? (i in B ? f(A[i], B[i]) : A[i]) : B[i]; }); o[k] = r; }
    function max(x, y) { return Math.max(+x || 0, +y || 0); }
    o.xp = max(nw.xp, ol.xp); o.unlocked = max(nw.unlocked, ol.unlocked); o.letterSeen = max(nw.letterSeen, ol.letterSeen); o.diarySeen = max(nw.diarySeen, ol.diarySeen);
    o.onboarded = !!(nw.onboarded || ol.onboarded); o.tour = !!(nw.tour || ol.tour); o.letterQuiz = max(nw.letterQuiz, ol.letterQuiz);
    if (ol.plv != null && (nw.plv == null || ol.plv > nw.plv)) o.plv = ol.plv;
    ['active', 'weekXp', 'boss', 'plBest', 'best', 'read'].forEach(function (k) { each(k, max); });
    /* 3.3 B1-Probeprüfung: bestes Ergebnis, Anzahl Versuche, „bestanden“ bleibt */
    var ea = obj(nw.exam), eb = obj(ol.exam);
    if (Object.keys(ea).length || Object.keys(eb).length) o.exam = { n: max(ea.n, eb.n), best: max(ea.best, eb.best), passed: ea.passed || eb.passed || undefined, last: ea.last || eb.last };
    ['scenes', 'skipped'].forEach(function (k) { each(k, function (x, y) { return !!(x || y); }); });
    each('opened', function (x, y) { return x || y; });
    each('done', function (x, y) { return Object.assign({}, y, x); });
    each('missions', function (x, y) { return x || y; });
    each('wlog', function (x, y) { var r = {}; [x, y].forEach(function (z) { Object.keys(obj(z)).forEach(function (f) { r[f] = Math.max(r[f] || 0, +z[f] || 0); }); }); return r; });
    each('daily', function (x, y) { return ((y && y.score) || 0) > ((x && x.score) || 0) ? y : x; });
    each('rank', function (x, y) { return ((y && y.g) || 0) > ((x && x.g) || 0) ? y : x; });
    /* eigene Wörter: vom neueren Stand, fehlende vom älteren hinten anhängen */
    var custom = arr(nw.custom).slice(), mapOld = {}, keyOf = function (w) { return String(w && w[0]).toLowerCase() + '|' + String(w && w[1]).toLowerCase(); };
    var idx = {}; custom.forEach(function (w, i) { idx[keyOf(w)] = i; });
    arr(ol.custom).forEach(function (w, i) { var k = keyOf(w); if (!(k in idx)) { idx[k] = custom.length; custom.push(w); } mapOld[i] = idx[k]; });
    o.custom = custom;
    var oc = {}; Object.keys(obj(ol.cards)).forEach(function (id) { var m = /^my:(\d+)$/.exec(id); oc[m ? 'my:' + mapOld[m[1]] : id] = ol.cards[id]; });
    var na = obj(nw.cards), cards = {};
    Object.keys(na).concat(Object.keys(oc)).forEach(function (id) {
      var x = na[id], y = oc[id];
      cards[id] = !x ? y : !y ? x : ((y.seen | 0) > (x.seen | 0) || ((y.seen | 0) === (x.seen | 0) && (y.box | 0) > (x.box | 0))) ? y : x;
    });
    o.cards = cards;
    function union(k, lim) { var r = arr(nw[k]).slice(); arr(ol[k]).forEach(function (v) { if (r.indexOf(v) < 0) r.push(v); }); o[k] = lim ? r.slice(0, lim) : r; }
    union('krasnale'); union('rankSeen'); union('mistakes', 60);
    o.ts = max(nw.ts, ol.ts);
    return o;
  }

  /* Lokale Rangliste: pro Spielername Spiele, Siege, Unentschieden, gewichtete Punkte, je Stufe.
     res = 1 Sieg, 0 unentschieden, -1 Niederlage (aus Sicht dieses Spielers). */
  function rankAdd(rank, p, res) {
    var name = duelName(p.name) || '?', key = name.toLowerCase(), e = rank[key] || { name: name, g: 0, w: 0, d: 0, pts: 0, right: 0, total: 0, lv: {} };
    e.name = name; e.g++; if (res > 0) e.w++; else if (res === 0) e.d++;
    e.pts = Math.round((e.pts + duelScore(p)) * 10) / 10; e.right += p.right; e.total += p.total;
    e.lv[p.lv] = (e.lv[p.lv] || 0) + 1;
    rank[key] = e; return rank;
  }
  function rankList(rank) {
    return Object.keys(rank || {}).map(function (k) { return rank[k]; }).sort(function (a, b) { return b.w - a.w || b.pts - a.pts || a.g - b.g || (a.name < b.name ? -1 : 1); });
  }

  /* Satzbau: Wörter eines Satzes (Satzzeichen bleiben am Wort) */
  function tokens(sentence) { return String(sentence).trim().split(/\s+/); }
  function sameSentence(a, b) { return norm(a) === norm(b); }

  /* Ist ein Fortschritt-Export gültig? */
  function validateSave(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.app !== 'english-trail') return false;
    if (typeof obj.xp !== 'number' || obj.xp < 0) return false;
    if (!obj.cards || typeof obj.cards !== 'object') return false;
    return true;
  }

  /* 3.2 Sicherung: beschädigten Spielstand retten statt verwerfen. Gibt einen gültigen Stand zurück oder null. */
  function repairSave(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    if (obj.app != null && obj.app !== 'english-trail') return null;
    var o = JSON.parse(JSON.stringify(obj));
    if (o.app == null) { if (!o.cards && !o.boss && !o.xp) return null; o.app = 'english-trail'; }
    if (typeof o.xp !== 'number' || !(o.xp >= 0)) o.xp = Math.max(0, +o.xp || 0);
    if (!o.cards || typeof o.cards !== 'object' || Array.isArray(o.cards)) o.cards = {};
    ['boss', 'skipped', 'scenes', 'opened', 'active', 'best', 'done', 'missions', 'weekXp', 'wlog', 'daily', 'plBest', 'rank'].forEach(function (k) {
      if (o[k] != null && (typeof o[k] !== 'object' || Array.isArray(o[k]))) delete o[k];
    });
    ['custom', 'krasnale', 'mistakes', 'rankSeen'].forEach(function (k) { if (o[k] != null && !Array.isArray(o[k])) delete o[k]; });
    if (o.unlocked != null && !(o.unlocked >= 0)) o.unlocked = 0;
    return validateSave(o) ? o : null;
  }
  /* Kennzahlen eines Stands (für die Sicherungsliste) */
  function saveStats(o) {
    var c = (o && o.cards) || {}, ids = Object.keys(c);
    return { xp: Math.round(+(o && o.xp) || 0), words: ids.length, solid: ids.filter(function (k) { return (c[k] && c[k].box) >= 2; }).length, cities: Object.keys((o && o.boss) || {}).filter(function (k) { return o.boss[k]; }).length };
  }
  /* Wie viel „Fortschritt“ steckt in einem Stand? (zum Vergleich: Sicherung nur, wenn sich etwas getan hat) */
  function saveWeight(o) { var s = saveStats(o); return s.xp + s.words * 3 + s.solid * 5 + s.cities * 50; }
  /* Sicherungsliste pflegen: neuester Eintrag vorne; täglich höchstens eine automatische Sicherung, die anderen Anlässe immer.
     Behalten: die letzten 7 Tage täglich + bis zu 5 Anlass-Sicherungen; nie eine Sicherung, die der einzige Stand mit dem Höchstwert ist. */
  function addBackup(list, save, why, now, day) {
    list = Array.isArray(list) ? list.filter(function (b) { return b && b.d && validateSave(b.d); }) : [];
    if (!validateSave(save)) return list;
    var e = { t: now, day: day, why: why, d: JSON.parse(JSON.stringify(save)) };
    if (why === 'auto') {
      if (list.some(function (b) { return b.why === 'auto' && b.day === day; })) list = list.filter(function (b) { return !(b.why === 'auto' && b.day === day); });
    }
    list.unshift(e);
    var best = list.reduce(function (m, b) { return Math.max(m, saveWeight(b.d)); }, 0), bestKept = false, autos = 0, other = 0;
    return list.filter(function (b) {
      var isBest = !bestKept && saveWeight(b.d) === best;
      if (isBest) bestKept = true;
      if (b.why === 'auto') { autos++; return autos <= 7 || isBest; }
      other++; return other <= 5 || isBest;
    });
  }

  /* PATCH002: Schwierigkeitsstufen. mix = Anteile [Bedeutung wählen, Polnisch wählen, Hören, Schreiben, Diktat] */
  var DIFF = {
    easy:   { opts: 4, mix: [0.35, 0.25, 0.2, 0.2, 0],    strict: false, xp: 1,   boss: { n: 12, lives: 3, pass: 60 }, blitz: 60, clozeType: false, extraTiles: 0, hideTr: false },
    medium: { opts: 4, mix: [0.15, 0.2, 0.25, 0.25, 0.15], strict: false, xp: 1.5, boss: { n: 12, lives: 3, pass: 70 }, blitz: 50, clozeType: false, extraTiles: 1, hideTr: false },
    hard:   { opts: 6, mix: [0, 0.1, 0.15, 0.4, 0.35],    strict: true,  xp: 2,   boss: { n: 15, lives: 2, pass: 80 }, blitz: 45, clozeType: true,  extraTiles: 2, hideTr: true }
  };
  function diffCfg(level) { return DIFF[level] || DIFF.easy; }
  /* Welcher Fragetyp bei Zufallswert r? */
  function pickKind(level, r) {
    var mix = diffCfg(level).mix, kinds = ['pl2x', 'x2pl', 'listen', 'type', 'dictate'], acc = 0;
    for (var i = 0; i < mix.length; i++) { acc += mix[i]; if (r < acc) return kinds[i]; }
    return 'type';
  }
  /* Einstufung: Ergebnisse je Stadt [[ok,ok],[ok,false],…] → Index der ersten Stadt, die nicht sitzt */
  /* Dla Polaków: Stufe = höchste Stufe, bei der (wie bei allen darunter) mind. 2/3 richtig sind. items: [{lv, ok}] */
  function polLevel(items) {
    var level = 0;
    for (var lv = 1; lv <= 3; lv++) {
      var at = items.filter(function (x) { return x.lv === lv; });
      if (!at.length || at.filter(function (x) { return x.ok; }).length * 3 < at.length * 2) break;
      level = lv;
    }
    return level;
  }
  function placementStart(perCity) {
    for (var i = 0; i < perCity.length; i++) {
      var r = perCity[i] || [];
      if (!r.length || r.filter(Boolean).length < r.length) return i;
    }
    return perCity.length;
  }

  /* PATCH003: Karte, Entfernung, Höher/Tiefer, Zeitstrahl, Buchstabensalat */
  /* Live-Duell: Wer bekommt den Punkt? 1 = ich, -1 = Gegner, 0 = keiner. Nur richtige Antworten zählen, dann die schnellere;
     bei exakt gleicher Zeit entscheidet die kleinere Spieler-ID – so rechnen beide Handys dasselbe Ergebnis aus. */
  /* Hausaufgaben-Code (E): Klasse + Pakete + Grammatikthemen als Bitmasken (Reihenfolge der Daten ist nur anhängend) */
  function hwCode(grade, packMask, topicMask, plan) {
    if (!packMask && !topicMask) return null;
    return 'HA' + grade + (PLAN_L[plan] || '') + '-P' + packMask.toString(36).toUpperCase() + '-T' + topicMask.toString(36).toUpperCase();
  }
  function hwParse(code) {
    var m = /^HA(5|6|7|8|9|10)([SNGE]?)-?P([0-9A-Z]+)-?T([0-9A-Z]+)$/.exec(String(code || '').toUpperCase().replace(/\s+/g, ''));
    if (!m) return null;
    var g = +m[1], pl = L_PLAN[m[2]] || '', pm = parseInt(m[3], 36), tm = parseInt(m[4], 36);
    if (!(pm || tm) || isNaN(pm) || isNaN(tm)) return null;
    return { grade: g, plan: pl, pm: pm, tm: tm, code: hwCode(g, pm, tm, pl) };
  }
  function maskOf(list, picked) { var m = 0; list.forEach(function (x, i) { if (picked.indexOf(x) >= 0) m += Math.pow(2, i); }); return m; }
  function fromMask(list, m) { return list.filter(function (x, i) { return Math.floor(m / Math.pow(2, i)) % 2 === 1; }); }
  /* Wortliste teilen (ohne Server): Liste steckt im Link-Anker #w=… (Base64url von „v1|Unit|Klasse\nen=de\n…“) */
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  function b64e(str) {   /* Base64url ohne Abhängigkeiten (läuft in Browser und Tests gleich) */
    var b = unescape(encodeURIComponent(str)), out = '';
    for (var i = 0; i < b.length; i += 3) {
      var n = (b.charCodeAt(i) << 16) | ((b.charCodeAt(i + 1) || 0) << 8) | (b.charCodeAt(i + 2) || 0), k = b.length - i;
      out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (k > 1 ? B64[(n >> 6) & 63] : '') + (k > 2 ? B64[n & 63] : '');
    }
    return out;
  }
  function b64d(s0) {
    var s1 = String(s0 || ''), bytes = '', buf = 0, bits = 0;
    for (var i = 0; i < s1.length; i++) { var v = B64.indexOf(s1[i]); if (v < 0) throw new Error('b64'); buf = (buf << 6) | v; bits += 6; if (bits >= 8) { bits -= 8; bytes += String.fromCharCode((buf >> bits) & 255); } }
    return decodeURIComponent(escape(bytes));
  }
  function wordShareEncode(unit, grade, words) {
    var clean = function (x) { return String(x || '').replace(/[\n|=]/g, ' ').trim().slice(0, 80); };
    var lines = ['v1|' + clean(unit).slice(0, 20) + '|' + (grade || '')].concat((words || []).slice(0, 80).map(function (w) { return clean(w[0]) + '=' + clean(w[1]); }));
    return b64e(lines.join('\n'));
  }
  function wordShareDecode(code) {
    try {
      var lines = b64d(code).split('\n'), head = lines[0].split('|');
      if (head[0] !== 'v1') return null;
      var words = lines.slice(1).map(function (l) { var i = l.indexOf('='); return i > 0 ? [l.slice(0, i).trim().slice(0, 80), l.slice(i + 1).trim().slice(0, 80)] : null; }).filter(function (w) { return w && w[0] && w[1]; }).slice(0, 80);
      return words.length ? { unit: (head[1] || '').slice(0, 20), grade: +head[2] || 0, words: words } : null;
    } catch (e) { return null; }
  }
  function liveWinner(me, opp, myId, oppId) {
    var a = me && me.ok, b = opp && opp.ok;
    if (!a && !b) return 0; if (a && !b) return 1; if (b && !a) return -1;
    if (me.ms !== opp.ms) return me.ms < opp.ms ? 1 : -1;
    return String(myId) < String(oppId) ? 1 : -1;
  }
  /* English Trail: Wochen-Challenge der Klasse – die ganze Woche (Mo–So) derselbe Code für alle in dieser Klasse */
  function weekChallengeCode(todayKey, grade, plan) {
    var mon = parseDay(weekKey(todayKey)), base = new Date(2026, 0, 5), idx = Math.round((mon - base) / 864e5 / 7);
    return 'WEEK-' + (100 + ((idx % 900) + 900) % 900) + '-2-' + planLetter(plan) + grade;
  }
  /* English Trail: Vokabelliste einfügen – „word = Wort“, „word - Wort“, „word<TAB>Wort“ oder „word; Wort“, eine pro Zeile */
  function parseWordList(txt) {
    return String(txt || '').split(/\r?\n/).map(function (l) {
      var m = l.match(/^\s*(.+?)\s*(?:\t|\s=\s?|=|\s[-–]\s|;)\s*(.+?)\s*$/);
      return m && m[1] && m[2] ? [m[1].slice(0, 80), m[2].slice(0, 80)] : null;
    }).filter(Boolean);
  }
  /* Vokabeln per Foto: Texterkennung liefert Zeilen mit Wörtern und Positionen. Spalten erkennt man an großen Lücken;
     Lautschrift ([ˈhaʊs], /haʊs/) wird übersprungen. Ohne Spalten: Trennzeichen oder erstes deutsches Wort (groß, Umlaut, Artikel). */
  var OCR_IPA = /[ʃʒθðŋəɪʊæɑɒɔʌɜːˈˌ]|^[\[\/].*[\]\/]$/, OCR_DE = /^(der|die|das|den|dem|des|ein|eine|einen|einem|sich|zu|jdn|jdm|etw|etwas|jemanden|jemandem|nicht|kein|keine)$/i;
  var OCR_SKIP = /^(unit|vocabulary|vocab|words?|page|seite|station|check|across cultures|wortschatz|lernwörter|englisch|deutsch|english|german)\b/i;
  function ocrClean(x) { return String(x || '').replace(/[|_•·►▶◆■□~«»]+/g, ' ').replace(/\s+/g, ' ').replace(/^[\s,.;:\-–)0-9]+|[\s,;:\-–(]+$/g, '').trim(); }
  function ocrSplitText(t) {
    var m = t.match(/^(.+?)\s*(?:\t|\s=\s?|=|\s[-–]\s|;|\s{2,})\s*(.+)$/); if (m) return [m[1], m[2]];
    var w = t.split(' ');
    for (var i = 1; i < w.length; i++) {
      var x = w[i];
      if (OCR_DE.test(x) || /[äöüßÄÖÜ]/.test(x) || (/^[A-ZÄÖÜ][a-zäöüß]/.test(x) && !/^(I|I'm|I'll|I've|I'd|Mr|Mrs|Ms|Dr|English|British|London|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December)$/.test(x)))
        return [w.slice(0, i).join(' '), w.slice(i).join(' ')];
    }
    return null;
  }
  /* Wörter aus allen erkannten Zeilen nach Höhe zu Tabellenzeilen zusammenfassen (Texterkennung trennt Spalten manchmal in eigene Blöcke) */
  function ocrRows(words, lines) {
    /* Schräglage schätzen: Steigung langer Zeilen (Median), dann Höhe jedes Worts entlang dieser Steigung korrigieren */
    var sl = [];
    (lines || []).forEach(function (l) { var w = (l || []).filter(function (x) { return x && x.x1 > x.x0; }); if (w.length < 2) return; var a = w[0], b = w[w.length - 1], dx = ((b.x0 + b.x1) - (a.x0 + a.x1)) / 2; if (dx > 80) sl.push((((b.y0 + b.y1) - (a.y0 + a.y1)) / 2) / dx); });
    sl.sort(function (a, b) { return a - b; }); var k = sl.length ? sl[Math.floor(sl.length / 2)] : 0; if (Math.abs(k) > 0.2) k = 0;
    var ws = (words || []).filter(function (w) { return w && String(w.t || '').trim(); }).map(function (w) { return { t: w.t, x0: w.x0, x1: w.x1, y0: w.y0, y1: w.y1, c: (w.y0 + w.y1) / 2 - k * (w.x0 + w.x1) / 2, h: Math.max(1, w.y1 - w.y0) }; });
    ws.sort(function (a, b) { return a.c - b.c; });
    var rows = [];
    ws.forEach(function (w) { var r = rows[rows.length - 1]; if (r && Math.abs(w.c - r.c) <= 0.55 * Math.max(w.h, r.h)) { r.words.push(w); r.c = (r.c * (r.words.length - 1) + w.c) / r.words.length; r.h = Math.max(r.h, w.h); } else rows.push({ c: w.c, h: w.h, words: [w] }); });
    return rows.map(function (r) { return { words: r.words.sort(function (a, b) { return a.x0 - b.x0; }) }; });
  }
  function ocrToList(lines) {
    var out = [], seen = {};
    (lines || []).forEach(function (ln) {
      var inBr = false, ws = (ln.words || []).filter(function (w) {
        var x = String(w && w.t || '').trim(); if (!x) return false;
        if (inBr) { if (/[\]\/]$/.test(x) || x.indexOf(']') >= 0) inBr = false; return false; }
        if (/^['‘’]?[\[\/]/.test(x)) { if (!/[\]\/].?$/.test(x.slice(1))) inBr = true; return false; }   /* Lautschrift [ … ] oder / … / */
        return !OCR_IPA.test(x) && !/^[^A-Za-zÄÖÜäöüß(]*$/.test(x) && !/\w:\w/.test(x);
      });
      if (!ws.length) return;
      var hs = ws.map(function (w) { return Math.max(1, (w.y1 || 0) - (w.y0 || 0)); }).sort(function (a, b) { return a - b; }), h = hs[Math.floor(hs.length / 2)];
      var segs = [[ws[0]]];
      for (var i = 1; i < ws.length; i++) { if ((ws[i].x0 - ws[i - 1].x1) > Math.max(1.6 * h, 14)) segs.push([]); segs[segs.length - 1].push(ws[i]); }
      var txt = segs.map(function (sg) { var x = sg.map(function (w) { return w.t; }).join(' '); if (/\]/.test(x) && !/\[/.test(x.split(']')[0])) x = x.slice(x.indexOf(']') + 1); return ocrClean(x.replace(/\[[^\]]*\]?/g, ' ')); }).filter(function (x) { return /[A-Za-zÄÖÜäöüß]{2}/.test(x); });
      if (!txt.length) return;
      txt = txt.filter(function (x) { return !/^[^(]*\)$/.test(x); });   /* Reste von Lautschrift wie „bretk)“ */
      if (!txt.length) return;
      var pair = txt.length >= 3 ? [txt[0], txt[txt.length - 1]] : txt.length === 2 ? [txt[0], txt[1]] : ocrSplitText(txt[0]);
      if (!pair) return;
      var en = ocrClean(pair[0]), de = ocrClean(pair[1]).replace(/([a-zäöüß])ii(?=[a-zß])/g, '$1ü').replace(/^([A-Z])ii/, function (m, c) { return c + 'ü'; });   /* typischer Lesefehler: ü → ii */
      if (!/[a-z]{2}/i.test(en) || !/[a-zäöüß]{2}/i.test(de) || OCR_SKIP.test(en) || en.length > 60 || de.length > 80) return;
      var k = en.toLowerCase(); if (seen[k]) return; seen[k] = 1;
      out.push([en, de]);
    });
    return out;
  }
  /* Schreibauftrag: einfache, transparente Kriterien wie im Unterricht (keine KI) */
  function writingCheck(txt, words) {
    var t = String(txt || ''), low = ' ' + t.toLowerCase().replace(/[^a-z' ]+/g, ' ') + ' ';
    var sents = t.split(/[.!?]+/).filter(function (x) { return x.trim().split(/\s+/).length >= 3; });
    var used = (words || []).filter(function (w) { return low.indexOf(' ' + String(w).toLowerCase().replace(/^to /, '') ) >= 0; }).length;
    var links = (low.match(/ (and|but|because|so|when|then|after|before|however|although|if|or) /g) || []).length;
    var capsOk = sents.length > 0 && !/(^|[.!?]["”’]?\s+)[a-z]/.test(t.trim()) && /[.!?]["”’]?\s*$/.test(t.trim());
    var iOk = !/(^|[\s,])i([\s,'’]|$)/.test(t);
    var items = [['wc_len', sents.length >= 5, sents.length], ['wc_words', used >= 3, used], ['wc_link', links >= 2, links], ['wc_caps', capsOk, 0], ['wc_i', iOk, 0]];
    return { items: items, score: Math.round(items.filter(function (x) { return x[1]; }).length / items.length * 100) };
  }
  /* English Trail: Probe-Klassenarbeit – grobe Notentendenz (übliche Schlüssel in BW schwanken je Schule) */
  function schoolMark(pct) {
    var m = pct >= 92 ? 'Note 1' : pct >= 81 ? 'Note 2' : pct >= 67 ? 'Note 3' : pct >= 50 ? 'Note 4' : pct >= 30 ? 'Note 5' : 'Note 6';
    return 'Tendenz ' + m;
  }
  /* English Trail: Großbritannien & Irland (lon -10.6…1.8, lat 50…58.7) im selben viewBox wie bei Polski Szlak */
  function proj(lon, lat) { return [(lon + 10.6) * 42 + 70, (58.95 - lat) * 72]; }
  function unproj(x, y) { return [(x - 70) / 42 - 10.6, 58.95 - y / 72]; }
  function distKm(lat1, lon1, lat2, lon2) {
    var R = 6371, toR = Math.PI / 180, dLat = (lat2 - lat1) * toR, dLon = (lon2 - lon1) * toR;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }
  /* Zwei Einträge mit klarem Abstand (≥ 15 %), damit gerundete Quellen nicht zur Falle werden */
  function hlPair(items, r) {
    r = r || Math.random;
    for (var tries = 0; tries < 200; tries++) {
      var a = items[Math.floor(r() * items.length)], b = items[Math.floor(r() * items.length)];
      if (a === b) continue;
      var hi = Math.max(a[1], b[1]), lo = Math.min(a[1], b[1]);
      if (hi / lo >= 1.15) return [a, b];
    }
    return null;
  }
  function orderOk(years) { for (var i = 1; i < years.length; i++) if (years[i] < years[i - 1]) return false; return true; }
  function scramble(word, r) {
    r = r || Math.random; var w = String(word), out = w;
    for (var i = 0; i < 20 && out === w; i++) out = shuffle(w.split(''), r).join('');
    return out;
  }

  /* PATCH005: typische Rechtschreibfehler erzeugen. Rückgabe: [{w: falsche Form, rule}] */
  var MUT = [
    ['ó', 'u', 'ou'], ['u', 'ó', 'ou'], ['rz', 'ż', 'rz'], ['ż', 'rz', 'rz'], ['ch', 'h', 'ch'], ['h', 'ch', 'ch'],
    ['ą', 'om', 'nasal'], ['ę', 'en', 'nasal'],
    ['ś', 'sz', 'soft'], ['sz', 'ś', 'soft'], ['ć', 'cz', 'soft'], ['cz', 'ć', 'soft'], ['ź', 'ż', 'soft'], ['si', 'ś', 'soft'], ['ci', 'ć', 'soft'],
    ['ą', 'a', 'dia'], ['ę', 'e', 'dia'], ['ł', 'l', 'dia'], ['ś', 's', 'dia'], ['ć', 'c', 'dia'], ['ń', 'n', 'dia'], ['ź', 'z', 'dia'], ['ż', 'z', 'dia'], ['ó', 'o', 'dia'],
    ['a', 'ą', 'dia'], ['e', 'ę', 'dia'], ['l', 'ł', 'dia'], ['o', 'ó', 'ou'], ['z', 'ż', 'dia'], ['s', 'ś', 'dia'], ['n', 'ń', 'dia'], ['c', 'ć', 'dia']
  ];
  var FINAL = [['b', 'p'], ['d', 't'], ['g', 'k'], ['w', 'f'], ['z', 's'], ['ż', 'sz'], ['dz', 'c']];
  /* Eine Regel an einer erlaubten Stelle anwenden, sonst null */
  function applyMut(w, m, r) {
    var spots = [], i = w.indexOf(m[0]);
    while (i >= 0) {
      var ok = true;
      if (m[0] === 'h' && (w[i - 1] === 'c' || w[i - 1] === 's')) ok = false;            /* h in ch/sh nicht */
      if (m[0] === 'u' && /[aeo]/.test(w[i - 1] || '')) ok = false;                         /* au/eu/ou nicht */
      if ((m[0] === 'si' || m[0] === 'ci') && !/[aeiouyąęó]/.test(w[i + 2] || '')) ok = false; /* nur vor Vokal sinnvoll */
      if (m[0] === 'ź' && w[i + 1] === 'd') ok = false;
      if ((m[0] === 'c' || m[0] === 's') && /[hz]/.test(w[i + 1] || '')) ok = false;            /* ch, cz, sz bleiben Paare */
      if (m[0] === 'z' && /[rscd]/.test(w[i - 1] || '')) ok = false;                         /* rz, sz, cz, dz bleiben Paare */
      if (m[0] === 'z' && m[1] === 'ż' && w[i + 1] === 'i') ok = false;
      if (ok) spots.push(i);
      i = w.indexOf(m[0], i + 1);
    }
    if (!spots.length) return null;
    var at = spots[Math.floor((r || Math.random)() * spots.length)];
    return w.slice(0, at) + m[1] + w.slice(at + m[0].length);
  }
  function finalDevoice(w) {
    var m = String(w).match(/^(.*?)([^\s?!.,]+)([?!.,]?)$/); if (!m) return null;
    var word = m[2];
    for (var i = 0; i < FINAL.length; i++) { var f = FINAL[i]; if (word.length > 2 && word.slice(-f[0].length) === f[0]) return m[1] + word.slice(0, -f[0].length) + f[1] + m[3]; }
    return null;
  }
  function misspell(word, n, r, exclude) {
    r = r || Math.random; n = n || 3; exclude = exclude || [];
    var w = String(word), out = [], seen = {}; seen[w] = 1;
    exclude.forEach(function (x) { seen[x] = 1; });
    function add(v, rule) { if (v && !seen[v]) { seen[v] = 1; out.push({ w: v, rule: rule }); } }
    add(finalDevoice(w), 'final');
    var muts = shuffle(MUT, r);
    for (var i = 0; i < muts.length && out.length < n; i++) add(applyMut(w, muts[i], r), muts[i][2]);
    for (var j = 0; out.length < n && j < out.length; j++)       /* Doppelfehler aus vorhandenen Varianten */
      for (var k = 0; k < muts.length && out.length < n; k++) add(applyMut(out[j].w, muts[k], r), out[j].rule);
    if (out.length < n) add(stripDia(w), 'dia');
    return shuffle(out, r).slice(0, n);
  }
  /* Hat das Wort eine echte Stolperfalle? */
  function spellWorthy(word) { return /ó|u|ż|rz|ch|h|ą|ę|ł|ś|ć|ń|ź|sz|cz/.test(word) && String(word).length >= 3; }

  /* Państwa-Miasta: Anfangsbuchstabe (Ł→L, Ż→Z), bekanntes Wort, Punkte (10 / 5 doppelt / 20 allein gültig) */
  function pmLetterOk(word, letter) { var w = stripDia(norm(word)); return !!w && w.charAt(0) === stripDia(String(letter).toLowerCase()); }
  function pmKnown(word, letter, list) {
    if (!pmLetterOk(word, letter)) return false;
    var w = norm(word, true);
    for (var i = 0; i < list.length; i++) if (norm(list[i], true) === w) return true;
    return false;
  }
  function pmScore(answers, valid) {
    var keys = answers.map(function (a, i) { return valid[i] ? norm(a, true) : null; });
    var nValid = keys.filter(Boolean).length;
    return keys.map(function (k) {
      if (!k) return 0;
      if (nValid === 1) return 20;
      return keys.filter(function (x) { return x === k; }).length > 1 ? 5 : 10;
    });
  }

  G.PSCore = {
    gform: gform, hasG: hasG, wordDiff: wordDiff, icsReminder: icsReminder,
    pmLetterOk: pmLetterOk, pmKnown: pmKnown, pmScore: pmScore,
    misspell: misspell, spellWorthy: spellWorthy,
    schoolMark: schoolMark, liveWinner: liveWinner, hwCode: hwCode, schGradeOf: schGradeOf, schLoOf: schLoOf, schHiOf: schHiOf, wordShareEncode: wordShareEncode, wordShareDecode: wordShareDecode, ocrToList: ocrToList, ocrRows: ocrRows, ocrSplitText: ocrSplitText, hwParse: hwParse, maskOf: maskOf, fromMask: fromMask, weekChallengeCode: weekChallengeCode, parseWordList: parseWordList, writingCheck: writingCheck, numToEn: numToEn, priceEn: priceEn, priceTag: priceTag, proj: proj, unproj: unproj, distKm: distKm, hlPair: hlPair, orderOk: orderOk, scramble: scramble,
    DIFF: DIFF, diffCfg: diffCfg, pickKind: pickKind, placementStart: placementStart, polLevel: polLevel,
    stripDia: stripDia, norm: norm, variants: variants, lev: lev, checkAnswer: checkAnswer,
    numToPl: numToPl, zlotyForm: zlotyForm, priceWords: priceWords,
    INTERVALS: INTERVALS, MASTERED_BOX: MASTERED_BOX, srsUpdate: srsUpdate, isDue: isDue,
    dayKey: dayKey, addDays: addDays, weekKey: weekKey, prevWeek: prevWeek, daysInWeek: daysInWeek, daysSince: daysSince, STEPS: STEPS, nextStep: nextStep, cityRipe: cityRipe, letterRead: letterRead,
    weekStreak: weekStreak, totalDays: totalDays,
    duelPlan: duelPlan, duelNewCode: duelNewCode, duelParse: duelParse, duelCheck: duelCheck, duelResultText: duelResultText, duelReadResult: duelReadResult, duelCompare: duelCompare, fmtTime: fmtTime, duelWeight: duelWeight, duelScore: duelScore, duelSign: duelSign, duelName: duelName, rankAdd: rankAdd, rankList: rankList, mergeSave: mergeSave,
    hash: hash, rng: rng, shuffle: shuffle, sample: sample,
    xpForLevel: xpForLevel, levelFromXp: levelFromXp, comboBonus: comboBonus, xpFor: xpFor,
    shareText: shareText, tokens: tokens, sameSentence: sameSentence, validateSave: validateSave, repairSave: repairSave, saveStats: saveStats, saveWeight: saveWeight, addBackup: addBackup
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
