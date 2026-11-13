// Logik-Tests für src/core.js (node --test tests/)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'core.js'), 'utf8'), ctx);
const C = ctx.PSCore;
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data.json'), 'utf8'));

test('norm: Kleinschreibung, Satzzeichen, Leerraum', () => {
  assert.equal(C.norm('  Dzień   dobry!  '), 'dzień dobry');
  assert.equal(C.norm('Jak się masz?'), 'jak się masz');
  assert.equal(C.norm('Żółw', true), 'zolw');
  assert.equal(C.norm('mam na imię …'), 'mam na imię');
});

test('checkAnswer: exakt, Akzente, Tippfehler, falsch', () => {
  assert.deepEqual({ ...C.checkAnswer('dziękuję', 'dziękuję') }, { ok: true, kind: 'exact' }); // Spread: Objekt kommt aus anderem vm-Realm
  const d = C.checkAnswer('dziekuje', 'dziękuję');
  assert.equal(d.kind, 'diacritics'); assert.equal(d.ok, true);
  assert.equal(C.checkAnswer('dziekuje', 'dziękuję', { hardcore: true }).ok, false);
  const ty = C.checkAnswer('dziękuje', 'dziękuję');
  assert.ok(ty.kind === 'diacritics' || ty.kind === 'typo');
  assert.equal(C.checkAnswer('przeprasam', 'przepraszam').kind, 'typo');
  assert.equal(C.checkAnswer('kot', 'pies').ok, false);
  assert.equal(C.checkAnswer('', 'pies').kind, 'empty');
  assert.equal(C.checkAnswer('kot', 'kos').ok, false, 'kurze Wörter: kein Tippfehler-Bonus');
});

test('checkAnswer: Varianten mit Schrägstrich', () => {
  assert.equal(C.checkAnswer('ona', 'on / ona').ok, true);
  assert.equal(C.checkAnswer('on', 'on / ona').ok, true);
  assert.equal(C.checkAnswer('moja', 'mój / moja').ok, true);
});

test('Zahlen 0–999 auf Polnisch', () => {
  const cases = { 0: 'zero', 1: 'jeden', 5: 'pięć', 11: 'jedenaście', 15: 'piętnaście', 20: 'dwadzieścia', 21: 'dwadzieścia jeden',
    44: 'czterdzieści cztery', 99: 'dziewięćdziesiąt dziewięć', 100: 'sto', 101: 'sto jeden', 250: 'dwieście pięćdziesiąt', 999: 'dziewięćset dziewięćdziesiąt dziewięć' };
  for (const [n, w] of Object.entries(cases)) assert.equal(C.numToPl(+n), w, n);
  assert.throws(() => C.numToPl(1000));
});

test('Złoty-Formen (1 / 2–4 / 5+ mit 12–14-Ausnahme)', () => {
  const exp = { 1: 'złoty', 2: 'złote', 4: 'złote', 5: 'złotych', 11: 'złotych', 12: 'złotych', 14: 'złotych', 21: 'złotych', 22: 'złote', 24: 'złote', 25: 'złotych', 32: 'złote', 112: 'złotych', 102: 'złote' };
  for (const [n, f] of Object.entries(exp)) assert.equal(C.zlotyForm(+n), f, n);
  assert.equal(C.priceWords(22), 'dwadzieścia dwa złote');
});

test('Spaced Repetition: Aufstieg, Absturz, Fälligkeit', () => {
  let c = C.srsUpdate(null, true, '2026-10-18');
  assert.equal(c.box, 1); assert.equal(c.due, '2026-10-19');
  c = C.srsUpdate(c, true, '2026-10-19'); assert.equal(c.box, 2); assert.equal(c.due, '2026-10-21');
  c = C.srsUpdate(c, true, '2026-10-21'); c = C.srsUpdate(c, true, '2026-10-25'); assert.equal(c.box, 4);
  c = C.srsUpdate(c, false, '2026-11-02'); assert.equal(c.box, 2); assert.equal(c.due, '2026-11-03'); assert.equal(c.wrong, 1);
  assert.ok(C.isDue(c, '2026-11-03')); assert.ok(!C.isDue(c, '2026-11-02'));
  // Richtig, aber noch nicht fällig: kein Aufstieg am selben Tag
  let early = C.srsUpdate(null, true, '2026-10-18'); early = C.srsUpdate(early, true, '2026-10-18');
  assert.equal(early.box, 1); assert.equal(early.due, '2026-10-19'); assert.equal(early.seen, 2);
  early = C.srsUpdate(early, false, '2026-10-18'); assert.equal(early.box, 1); assert.equal(early.wrong, 1);
  let top = { box: 6, due: 'x', seen: 9, wrong: 0 }; top = C.srsUpdate(top, true, '2026-10-18'); assert.equal(top.box, 6);
});

test('Datum: Wochenschlüssel beginnt Montag, Monats-/Jahreswechsel', () => {
  assert.equal(C.weekKey('2026-10-18'), '2026-10-12'); // Sonntag -> Montag davor
  assert.equal(C.weekKey('2026-10-19'), '2026-10-19'); // Montag
  assert.equal(C.weekKey('2027-01-01'), '2026-12-28');
  assert.equal(C.addDays('2026-02-28', 1), '2026-03-01');
  assert.equal(C.addDays('2028-02-28', 1), '2028-02-29');
});

test('Wochen-Serie: verpasster Tag bricht nichts, verpasste Woche schon', () => {
  const a = {};
  ['2026-10-05', '2026-10-06', '2026-10-08'].forEach(d => a[d] = 1); // KW 41: 3 Tage
  ['2026-09-28', '2026-09-30', '2026-10-02'].forEach(d => a[d] = 1); // KW 40: 3 Tage
  assert.equal(C.weekStreak(a, 3, '2026-10-13'), 2, 'laufende Woche noch offen');
  ['2026-10-12', '2026-10-14', '2026-10-15'].forEach(d => a[d] = 1);
  assert.equal(C.weekStreak(a, 3, '2026-10-15'), 3, 'laufende Woche erfüllt');
  assert.equal(C.weekStreak(a, 4, '2026-10-15'), 0, 'höheres Ziel');
  assert.equal(C.totalDays(a), 9);
  assert.equal(C.weekStreak(a, 3, '2026-10-27'), 0, 'eine Woche komplett ausgelassen');
});

test('Zufall: deterministisch pro Seed (Tagesrätsel gleich für alle)', () => {
  const r1 = C.rng('daily-2026-10-18'), r2 = C.rng('daily-2026-10-18'), r3 = C.rng('daily-2026-10-19');
  const a = [r1(), r1(), r1()], b = [r2(), r2(), r2()], c = [r3(), r3(), r3()];
  assert.deepEqual(a, b); assert.notDeepEqual(a, c);
  const s = C.shuffle([1, 2, 3, 4, 5, 6], C.rng(1)); assert.equal(s.length, 6); assert.deepEqual([...s].sort(), [1, 2, 3, 4, 5, 6]);
});

test('XP und Stufen', () => {
  assert.deepEqual({ ...C.levelFromXp(0) }, { level: 1, into: 0, need: 100 });
  assert.equal(C.levelFromXp(100).level, 2);
  assert.equal(C.levelFromXp(299).level, 2);
  assert.equal(C.levelFromXp(300).level, 3);
  assert.equal(C.xpFor(false, 5, false), 0);
  assert.equal(C.xpFor(true, 1, false), 10);
  assert.equal(C.xpFor(true, 3, false), 14);
  assert.equal(C.xpFor(true, 50, false), 20, 'Kombo-Bonus gedeckelt');
  assert.equal(C.xpFor(true, 1, true), 20, 'strenger Modus doppelt');
});

test('Teilen-Text', () => {
  const s = C.shareText('2026-10-18', [true, false, true]);
  assert.match(s, /2\/3/); assert.match(s, /🟩⬜🟩/);
});

test('Satzbau: alle Sätze aus den Daten lassen sich aus ihren Wörtern zurückbauen', () => {
  for (const u of DATA.units) for (const s of u.sentences) {
    const tk = C.tokens(s[0]);
    assert.ok(C.sameSentence(tk.join(' '), s[0]), s[0]);
    assert.ok(tk.length >= 3, s[0]);
  }
});

test('Fall-Übungen: Lösung füllt die Lücke sinnvoll', () => {
  for (const c of DATA.cases) {
    assert.ok(c.opts.includes(c.a), c.s);
    assert.equal(c.s.split('___').length, 2, c.s);
  }
});

test('Backup-Validierung', () => {
  assert.equal(C.validateSave({ app: 'english-trail', xp: 10, cards: {} }), true);
  assert.equal(C.validateSave({ app: 'x', xp: 10, cards: {} }), false);
  assert.equal(C.validateSave({ app: 'english-trail', xp: -1, cards: {} }), false);
  assert.equal(C.validateSave(null), false);
});

/* ---------- 1.1: Schwierigkeit, Einstufung, Land und Leute ---------- */
test('Schwierigkeit: Stufen vollständig, Mischungen summieren auf 1', () => {
  for (const k of ['easy', 'medium', 'hard']) {
    const d = C.diffCfg(k), sum = d.mix.reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sum - 1) < 1e-9, k + ': ' + sum);
    assert.ok(d.boss.pass >= 50 && d.boss.lives >= 1, k);
  }
  assert.equal(C.diffCfg('quatsch'), C.diffCfg('easy'), 'unbekannte Stufe fällt auf leicht zurück');
  assert.ok(C.diffCfg('hard').strict && !C.diffCfg('easy').strict);
});

test('Fragetyp-Auswahl folgt der Mischung', () => {
  assert.equal(C.pickKind('easy', 0), 'pl2x');
  assert.equal(C.pickKind('easy', 0.999), 'type');
  assert.notEqual(C.pickKind('hard', 0), 'pl2x', 'schwer hat keine reinen Erkennungsfragen');
  assert.equal(C.pickKind('hard', 0.99), 'dictate');
});

test('Einstufung: erste Stadt mit Fehler', () => {
  assert.equal(C.placementStart([[true, true], [true, false], [true, true]]), 1);
  assert.equal(C.placementStart([[true, true], [true, true]]), 2);
  assert.equal(C.placementStart([[false, true]]), 0);
  assert.equal(C.placementStart([[true, true], []]), 1, 'unbeantwortete Stadt zählt nicht als bestanden');
});

test('Karte: Projektion umkehrbar, Entfernung plausibel', () => {
  const [x, y] = C.proj(21.01, 52.23), [lon, lat] = C.unproj(x, y);
  assert.ok(Math.abs(lon - 21.01) < 1e-9 && Math.abs(lat - 52.23) < 1e-9);
  const d = C.distKm(52.23, 21.01, 50.06, 19.94); // Warschau–Krakau
  assert.ok(d > 240 && d < 270, String(d));
});

test('Höher/Tiefer: Paare mit klarem Abstand, Zeitstrahl-Reihenfolge', () => {
  const items = [['a', 100], ['b', 105], ['c', 200]], r = C.rng('hl');
  for (let i = 0; i < 30; i++) {
    const p = C.hlPair(items, r); assert.ok(p, 'Paar gefunden');
    assert.ok(Math.max(p[0][1], p[1][1]) / Math.min(p[0][1], p[1][1]) >= 1.15);
  }
  assert.ok(C.orderOk([966, 1410, 1989]));
  assert.ok(!C.orderOk([1410, 966]));
});

test('Literki: Buchstabensalat ist eine echte Umstellung', () => {
  const r = C.rng('lit');
  for (const w of ['pierogi', 'Kraków', 'dziękuję']) {
    const s = C.scramble(w, r);
    assert.notEqual(s, w);
    assert.deepEqual(s.split('').sort(), w.split('').sort());
  }
});

test('Rechtschreibung: Fehlformen sind verschieden und nie das Original', () => {
  for (const w of ['góra', 'rzeka', 'chleb', 'żaba', 'może']) {
    assert.ok(C.spellWorthy(w), w);
    const m = C.misspell(w, 3, C.rng(w));
    assert.ok(m.length >= 1, w);
    const forms = m.map(x => x.w);
    assert.ok(!forms.includes(w), w);
    assert.equal(new Set(forms).size, forms.length, w);
  }
  assert.ok(!C.spellWorthy('to'));
});

/* ---------- 1.2: Państwa-Miasta ---------- */
test('Państwa-Miasta: Anfangsbuchstabe mit Ł/Ż-Gleichsetzung', () => {
  assert.ok(C.pmLetterOk('Łódź', 'L'));
  assert.ok(C.pmLetterOk('żurek', 'Z'));
  assert.ok(C.pmLetterOk('  Kraków ', 'K'));
  assert.ok(!C.pmLetterOk('Gdańsk', 'K'));
  assert.ok(!C.pmLetterOk('', 'K'));
});

test('Stadt-Land-Fluss: bekannte englische Wörter, Groß-/Kleinschreibung egal', () => {
  const list = DATA.pm.cats.find(c => c.id === 'city').words;
  assert.ok(C.pmKnown('london', 'L', list), 'klein geschrieben');
  assert.ok(C.pmKnown('Los Angeles', 'L', list), 'mit Leerzeichen');
  assert.ok(!C.pmKnown('London', 'M', list), 'falscher Buchstabe');
  assert.ok(!C.pmKnown('Kartoffelstadt', 'K', list));
});

test('Państwa-Miasta: Punkte 10 / 5 / 20 / 0', () => {
  assert.deepEqual([...C.pmScore(['Kot', 'koń', ''], [true, true, false])], [10, 10, 0]);
  assert.deepEqual([...C.pmScore(['kot', 'Kot', 'koza'], [true, true, true])], [5, 5, 10]);
  assert.deepEqual([...C.pmScore(['kot', 'xyz', ''], [true, false, false])], [20, 0, 0]);
  assert.deepEqual([...C.pmScore(['kot', 'kot'], [false, false])], [0, 0]);
});

test('Państwa-Miasta: jede Kategorie hat zu jedem Buchstaben mehrere Beispiele', () => {
  assert.ok(DATA.pm.cats.length >= 5);
  for (const L of DATA.pm.letters) for (const c of DATA.pm.cats) {
    const n = c.words.filter(w => C.pmLetterOk(w, L)).length;
    assert.ok(n >= 2, c.id + ' ' + L + ': ' + n);
  }
  for (const c of DATA.pm.cats) assert.equal(new Set(c.words.map(w => C.norm(w, true))).size, c.words.length, c.id + ' ohne Dubletten');
});

test('Duell-Code: Format, Parsen, Stufe im Code', () => {
  const code = C.duelNewCode(C.rng(7), 3);
  assert.match(code, /^[A-Z]{2,8}-\d{3}-3$/);
  assert.equal(C.duelParse(' kot 472 2 ').code, 'KOT-472-2');
  assert.equal(C.duelParse('KOT4721').diff, 'easy');
  assert.equal(C.duelParse('KOT-472-4'), null);
  assert.equal(C.duelParse(''), null);
});

test('Duell-Code: gleicher Code = exakt gleiche Fragen (sprach- und lernstandsunabhängig)', () => {
  const a = C.duelPlan(DATA, 'kot-472-2'), b = C.duelPlan(DATA, 'KOT 472 2');
  assert.equal(JSON.stringify(a.plan), JSON.stringify(b.plan));
  assert.equal(a.check, b.check);
  assert.equal(a.plan.length, 20);
  assert.notEqual(C.duelPlan(DATA, 'KOT-473-2').check, a.check);
  assert.notEqual(C.duelPlan(DATA, 'KOT-472-3').check, a.check);
  // Math.random darf keinen Einfluss haben
  const orig = Math.random; Math.random = () => 0.999;
  try { assert.equal(C.duelPlan(DATA, 'KOT-472-2').check, a.check); } finally { Math.random = orig; }
});

test('Duell-Code: Antwortoptionen eindeutig in PL, DE und EN', () => {
  for (const code of ['KOT-100-1', 'LAS-555-2', 'SER-999-3', 'ZUPA-321-1']) {
    const pl = C.duelPlan(DATA, code), n = C.diffCfg(pl.diff).opts;
    for (const it of pl.plan) {
      if (it.k !== 'w') continue;
      assert.equal(it.opts.length, n);
      assert.ok(it.opts.some(x => x[0] === it.item[0] && x[1] === it.item[1]));
      for (const lang of [0, 1, 2]) {
        const labels = it.opts.map(x => C.norm(DATA.units[x[0]].words[x[1]][lang]));
        assert.equal(new Set(labels).size, labels.length, code + ' Sprache ' + lang);
      }
    }
  }
});

test('Duell-Ergebnis: Text hin und zurück, Sieger mit Zeit als Tie-Break', () => {
  const txt = C.duelResultText('KOT-472-2', 'AB12', [1, 1, 0, 1], 133000);
  const r = C.duelReadResult(txt);
  assert.equal(r.code, 'KOT-472-2'); assert.equal(r.check, 'AB12'); assert.equal(r.right, 3); assert.equal(r.total, 4); assert.equal(r.ms, 133000);
  assert.equal(C.duelCompare({ right: 3, ms: 90000 }, { right: 2, ms: 10000 }), 1);
  assert.equal(C.duelCompare({ right: 3, ms: 90000 }, { right: 3, ms: 80000 }), -1);
  assert.equal(C.duelCompare({ right: 3, ms: 80000 }, { right: 3, ms: 80000 }), 0);
  assert.equal(C.duelReadResult('hallo'), null);
});

test('polLevel: Stufe nur, wenn alle darunter auch sitzen', function () {
  function L(a, b, c) { var r = []; [a, b, c].forEach(function (n, i) { for (var k = 0; k < 6; k++) r.push({ lv: i + 1, ok: k < n }); }); return r; }
  assert.equal(C.polLevel(L(6, 6, 6)), 3);
  assert.equal(C.polLevel(L(4, 4, 3)), 2);
  assert.equal(C.polLevel(L(3, 6, 6)), 0);
  assert.equal(C.polLevel(L(5, 2, 6)), 1);
  assert.equal(C.polLevel([]), 0);
});

test('Duell-Ergebnis mit Name und Prüfsumme: Fälschung fällt auf, Rangliste', () => {
  const txt = C.duelResultText('KOT-472-P1', 'AB12', [1, 0, 1], 65000, { name: 'Ania', input: 'tap' });
  const r = C.duelReadResult(txt);
  assert.equal(r.name, 'Ania'); assert.equal(r.input, 'T'); assert.equal(r.lv, 'P1'); assert.equal(r.base, 'KOT-472'); assert.equal(r.signed, true);
  assert.equal(r.right, 2); assert.equal(r.ms, 65000);
  assert.equal(C.duelReadResult(txt.replace('2/3', '3/3')).signed, false);
  assert.equal(C.duelReadResult(txt.replace('Ania', 'Ola')).signed, false);
  assert.equal(C.duelReadResult('English Trail ⚔ KOT-472-2 #AB12\n3/4 · 2:13').signed, false);
  let rank = {};
  rank = C.rankAdd(rank, { name: 'Ania', right: 12, total: 20, lv: '3' }, 1);
  rank = C.rankAdd(rank, { name: 'Ben', right: 15, total: 20, lv: '1' }, -1);
  rank = C.rankAdd(rank, { name: 'ania', right: 10, total: 20, lv: '2' }, 0);
  const list = C.rankList(rank);
  assert.equal(list.length, 2); assert.equal(list[0].name, 'ania'); assert.equal(list[0].g, 2); assert.equal(list[0].w, 1); assert.equal(list[0].d, 1); assert.equal(list[0].pts, 39);
});

test('Geräte-Abgleich: zwei Spielstände zusammenführen ohne Verlust', () => {
  const base = { app: 'english-trail', v: 1, onboarded: true, xp: 0, cards: {}, active: {}, unlocked: 0, boss: {}, scenes: {}, krasnale: [], mistakes: [], custom: [], weekXp: {}, daily: {}, best: {}, plBest: {}, plv: null, skipped: {}, rank: {}, rankSeen: [], goal: 4 };
  const handy = Object.assign(JSON.parse(JSON.stringify(base)), { ts: 100, xp: 50, unlocked: 2, goal: 3,
    cards: { w1: { box: 3, due: '2026-10-20', seen: 5, wrong: 1 }, w2: { box: 1, due: '2026-10-19', seen: 1, wrong: 0 }, 'my:0': { box: 2, due: 'x', seen: 4, wrong: 0 } },
    active: { '2026-10-18': 3 }, boss: { u1: 70 }, krasnale: [1, 4], custom: [['kot', 'Katze', 'Katze']], mistakes: ['w2'], plv: 2, rank: { ania: { name: 'Ania', g: 2 } } });
  const laptop = Object.assign(JSON.parse(JSON.stringify(base)), { ts: 200, xp: 30, unlocked: 1, goal: 5,
    cards: { w1: { box: 1, due: '2026-10-19', seen: 2, wrong: 1 }, w3: { box: 1, due: '2026-10-19', seen: 1, wrong: 0 }, 'my:0': { box: 1, due: 'y', seen: 1, wrong: 0 } },
    active: { '2026-10-18': 1, '2026-10-19': 2 }, boss: { u1: 90, u2: 60 }, krasnale: [4, 7], custom: [['pies', 'Hund', 'Hund']], mistakes: ['w3'], rank: { ania: { name: 'Ania', g: 1 }, ben: { name: 'Ben', g: 1 } } });
  for (const m of [C.mergeSave(handy, laptop), C.mergeSave(laptop, handy)]) {
    assert.equal(m.xp, 50); assert.equal(m.unlocked, 2); assert.equal(m.goal, 5); assert.equal(m.ts, 200); assert.equal(m.plv, 2);
    assert.equal(m.cards.w1.seen, 5); assert.ok(m.cards.w2 && m.cards.w3);
    assert.equal(JSON.stringify(m.active), JSON.stringify({ '2026-10-18': 3, '2026-10-19': 2 })); assert.equal(JSON.stringify(m.boss), JSON.stringify({ u1: 90, u2: 60 }));
    assert.equal([...m.krasnale].sort().join(), '1,4,7'); assert.equal(m.rank.ania.g, 2); assert.ok(m.rank.ben);
    // eigene Wörter: beide da, Karten bleiben beim richtigen Wort
    assert.equal(m.custom.map((w) => w[0]).join(), 'pies,kot');
    assert.equal(m.cards['my:0'].due, 'y'); assert.equal(m.cards['my:1'].due, 'x');
    assert.equal([...m.mistakes].sort().join(), 'w2,w3');
  }
  assert.equal(C.mergeSave(handy, { app: 'x' }), handy);
  assert.equal(C.mergeSave(null, laptop), laptop);
});

test('daysSince: Tage seit letzter Aktivität', () => {
  assert.equal(C.daysSince({}, '2026-10-19'), -1);
  assert.equal(C.daysSince({ '2026-10-19': 1 }, '2026-10-19'), -1);
  assert.equal(C.daysSince({ '2026-10-01': 1, '2026-10-10': 2, '2026-10-19': 1 }, '2026-10-19'), 9);
  assert.equal(C.daysSince({ '2026-03-20': 1 }, '2026-04-03'), 14);
});

test('nextStep: roter Faden pro Stadt', () => {
  assert.equal(C.nextStep({}, 'waw'), 'learn');
  assert.equal(C.nextStep({ done: { waw: { learn: 1 } } }, 'waw'), 'scene');
  assert.equal(C.nextStep({ done: { waw: { learn: 1 } }, scenes: { waw: true } }, 'waw'), 'quiz');
  assert.equal(C.nextStep({ done: { waw: { learn: 1, quiz: 1, build: 1 } }, scenes: { waw: true } }, 'waw'), 'boss');
  assert.equal(C.nextStep({ boss: { waw: 80 } }, 'waw'), null);
  // Reife-Bremse: mit Wortzahl erst alle Wörter kennen, dann 80 % an zwei Tagen (Box ≥ 2)
  const all = { done: { waw: { learn: 1, quiz: 1, build: 1 } }, scenes: { waw: true } };
  const cards = (box, k) => Object.fromEntries(Array.from({ length: k }, (_, i) => ['waw:' + i, { box, due: '2026-10-20' }]));
  assert.equal(C.nextStep({ ...all, cards: cards(1, 6) }, 'waw', 10), 'learn');
  assert.equal(C.nextStep({ ...all, cards: cards(1, 10) }, 'waw', 10), 'ripen');
  assert.equal(C.nextStep({ ...all, cards: { ...cards(1, 10), ...cards(2, 8) } }, 'waw', 10), 'ripen');   // 8 von 10 reicht nicht mehr
  assert.equal(C.nextStep({ ...all, cards: cards(2, 10) }, 'waw', 10), 'boss');
  assert.deepEqual({ ...C.cityRipe({ cards: cards(2, 3) }, 'waw', 18) }, { n: 18, seen: 3, ripe: 3, need: 18 });
  const m = C.mergeSave({ app: 'english-trail', xp: 1, cards: {}, ts: 2, done: { waw: { learn: 1 } } }, { app: 'english-trail', xp: 1, cards: {}, ts: 1, done: { waw: { quiz: 1 }, lod: { learn: 1 } } });
  assert.equal(JSON.stringify(m.done), JSON.stringify({ waw: { quiz: 1, learn: 1 }, lod: { learn: 1 } }));
});

test('letterRead: Brief wird Stadt für Stadt lesbar', () => {
  const lines = [{ u: 'waw' }, { u: 'lod' }, { u: 'poz' }];
  assert.equal(JSON.stringify(C.letterRead(lines, {})), JSON.stringify([false, false, false]));
  assert.equal(JSON.stringify(C.letterRead(lines, { boss: { waw: 70 }, skipped: { poz: true } })), JSON.stringify([true, false, true]));
  const m = C.mergeSave({ app: 'english-trail', xp: 1, cards: {}, ts: 2, letterSeen: 1 }, { app: 'english-trail', xp: 1, cards: {}, ts: 1, letterSeen: 3 });
  assert.equal(m.letterSeen, 3);
});

test('mergeSave: Missionen, Tour und Brief-Quiz gehen nicht verloren', () => {
  const m = C.mergeSave({ app: 'english-trail', xp: 1, cards: {}, ts: 2, missions: { waw: '2026-10-20' }, letterQuiz: 60 },
    { app: 'english-trail', xp: 1, cards: {}, ts: 1, missions: { lod: '2026-10-19' }, tour: true, letterQuiz: 90 });
  assert.deepEqual({ ...m.missions }, { waw: '2026-10-20', lod: '2026-10-19' });
  assert.equal(m.tour, true);
  assert.equal(m.letterQuiz, 90);
});

test('gform: Sprecherform männlich/weiblich', () => {
  assert.equal(C.gform('Wczoraj {byłem|byłam} w kinie.', 'm'), 'Wczoraj byłem w kinie.');
  assert.equal(C.gform('Wczoraj {byłem|byłam} w kinie.', 'f'), 'Wczoraj byłam w kinie.');
  assert.equal(C.gform('Jestem {zmęczony|zmęczona}, {chciałbym|chciałabym} spać.', ''), 'Jestem zmęczony, chciałbym spać.');
  assert.equal(C.gform('bez znaczników', 'f'), 'bez znaczników');
  assert.equal(C.hasG('{a|b}'), true); assert.equal(C.hasG('a/b'), false);
});

test('wordDiff: Ausspracherückmeldung je Wort', () => {
  const r = C.wordDiff('Proszę usiąść i wziąć głęboki wdech.', 'prosze usiasc i wziac gleboki');
  assert.deepEqual([...r].map(x => x.ok), [true, true, true, true, true, false]);
  assert.equal(r[5].w, 'wdech.');
  assert.deepEqual([...C.wordDiff('Dzień dobry!', 'dobry dzien')].map(x => x.ok), [true, true]);
  assert.deepEqual([...C.wordDiff('Dziękuję bardzo.', 'dziekuje')].map(x => x.ok), [true, false]);
});

test('icsReminder: wöchentliche Kalender-Erinnerung', () => {
  const now = new Date(2026, 9, 27, 23, 0); // Di 27.10.2026, 23:00
  const s = C.icsReminder(['MO', 'WE', 'FR'], '19:00', 'English Trail; 5 Minuten', 'Kurz üben', 'https://english.arndt-software.de/', now);
  assert.match(s, /RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR\r\n/);
  assert.match(s, /DTSTART:20261028T190000\r\n/);          // nächster passender Tag: Mi 28.10.
  assert.ok(s.includes('SUMMARY:English Trail' + String.fromCharCode(92) + '; 5 Minuten\r\n'));
  assert.match(s, /BEGIN:VALARM/); assert.ok(s.endsWith('END:VCALENDAR\r\n'));
  assert.equal(C.icsReminder([], '19:00', 'x', '', '', now), null);
  assert.equal(C.icsReminder(['MO'], '25:00', 'x', '', '', now), null);
  assert.match(C.icsReminder(['TU'], '23:30', 'x', '', '', now), /DTSTART:20261027T233000/); // heute noch
});

test('mergeSave: Wochenlog (Wochenrückblick) bleibt erhalten', () => {
  const m = C.mergeSave({ app: 'english-trail', xp: 1, cards: {}, ts: 2, wlog: { '2026-10-19': { n: 5, r: 10 } } },
    { app: 'english-trail', xp: 1, cards: {}, ts: 1, wlog: { '2026-10-19': { n: 7, w: 2 }, '2026-10-12': { n: 1 } } });
  assert.equal(m.wlog['2026-10-19'].n, 7); assert.equal(m.wlog['2026-10-19'].r, 10); assert.equal(m.wlog['2026-10-19'].w, 2);
  assert.equal(m.wlog['2026-10-12'].n, 1);
});

test('Duell-Code: Szlak 2 und Pakete ändern die Fragen nicht', () => {
  const p1 = C.duelPlan(DATA, 'KOT-472-2');
  const only1 = JSON.parse(JSON.stringify(DATA)); only1.units = only1.units.filter(u => !u.r && !u.pack);
  const p2 = C.duelPlan(only1, 'KOT-472-2');
  assert.equal(p1.check, p2.check);
});

test('3.2 Sicherung: beschädigte Stände werden gerettet, nicht verworfen', () => {
  const r = C.repairSave({ app: 'english-trail', xp: 'x', cards: { 'waw:0': { box: 3, seen: 4 } }, boss: [], custom: 'kaputt' });
  assert.ok(r); assert.equal(r.xp, 0); assert.equal(r.cards['waw:0'].box, 3); assert.equal(r.boss, undefined); assert.equal(r.custom, undefined);
  assert.ok(C.repairSave({ app: 'english-trail', xp: 10 }));                   // Karten fehlen → leer, Rest bleibt
  assert.equal(C.repairSave({ app: 'anderes-spiel', xp: 1, cards: {} }), null);
  assert.equal(C.repairSave(null), null); assert.equal(C.repairSave([1]), null);
  assert.ok(C.repairSave({ xp: 5, cards: { 'waw:1': { box: 1 } } }).app === 'english-trail');
});

test('3.2 Sicherung: Liste behält 7 Tage, Anlass-Sicherungen und immer den besten Stand', () => {
  const st = (xp) => ({ app: 'english-trail', xp, cards: {} });
  let L = [];
  L = C.addBackup(L, st(500), 'update', 1, '2026-10-01');                      // bester Stand, ganz alt
  for (let d = 2; d <= 20; d++) L = C.addBackup(L, st(d), 'auto', d, '2026-10-' + String(d).padStart(2, '0'));
  for (let k = 0; k < 8; k++) L = C.addBackup(L, st(1), 'reset', 100 + k, '2026-10-20');
  assert.equal(L.filter(b => b.why === 'auto').length, 7);
  assert.ok(L.some(b => b.d.xp === 500), 'bester Stand bleibt immer');
  assert.ok(L.filter(b => b.why !== 'auto').length <= 6);
  L = C.addBackup(L, st(30), 'auto', 200, '2026-10-20'); L = C.addBackup(L, st(31), 'auto', 201, '2026-10-20');
  assert.equal(L.filter(b => b.why === 'auto' && b.day === '2026-10-20').length, 1);   // pro Tag eine
  assert.equal(L[0].d.xp, 31);
  assert.equal(JSON.stringify(C.saveStats({ xp: 3.4, cards: { a: { box: 2 }, b: { box: 0 } }, boss: { waw: 80, lod: 0 } })), JSON.stringify({ xp: 3, words: 2, solid: 1, cities: 1 }));
});

test('3.2 Zurückholen per Zusammenführen verliert nie Fortschritt', () => {
  const now = { app: 'english-trail', xp: 50, ts: 9, cards: { 'waw:0': { box: 4, seen: 9 } }, boss: { waw: 90 }, unlocked: 3 };
  const old = { app: 'english-trail', xp: 20, ts: 1, cards: { 'waw:0': { box: 1, seen: 2 }, 'waw:5': { box: 2, seen: 3 } }, boss: { waw: 70 }, unlocked: 1 };
  const m = C.mergeSave(now, old);
  assert.equal(m.xp, 50); assert.equal(m.unlocked, 3); assert.equal(m.boss.waw, 90);
  assert.equal(m.cards['waw:0'].box, 4); assert.ok(m.cards['waw:5']);
});

test('3.3 Zusammenführen: Buchkapitel und B1-Probeprüfung gehen nicht verloren', () => {
  const a = { app: 'english-trail', xp: 1, cards: {}, ts: 2, read: { jel: 67 }, exam: { n: 1, best: 55, last: { tot: 55 } } };
  const b = { app: 'english-trail', xp: 1, cards: {}, ts: 1, read: { jel: 100, klo: 33 }, exam: { n: 3, best: 72, passed: '2026-10-20' } };
  const m = C.mergeSave(a, b);
  assert.equal(m.read.jel, 100); assert.equal(m.read.klo, 33);
  assert.equal(m.exam.n, 3); assert.equal(m.exam.best, 72); assert.equal(m.exam.passed, '2026-10-20'); assert.equal(m.exam.last.tot, 55);
});

test('Schulmodus: Notentendenz der Probe-Klassenarbeit', () => {
  assert.equal(C.schoolMark(100), 'Tendenz Note 1');
  assert.equal(C.schoolMark(81), 'Tendenz Note 2');
  assert.equal(C.schoolMark(66), 'Tendenz Note 4');
  assert.equal(C.schoolMark(10), 'Tendenz Note 6');
});

test('Preise auf Englisch: Zahlwörter und Pfund', () => {
  assert.equal(C.numToEn(21), 'twenty-one');
  assert.equal(C.numToEn(13), 'thirteen');
  assert.equal(C.priceEn(3, 50), 'three pounds fifty');
  assert.equal(C.priceEn(1, 0), 'one pound');
  assert.equal(C.priceTag(4, 5), '£4.05');
});

test('Schule: Vokabelliste einfügen in verschiedenen Formaten', () => {
  const l = C.parseWordList('library = Bibliothek\nto borrow - ausleihen\nscarf\tSchal\n\nkaputt\nhappy; glücklich');
  assert.equal(JSON.stringify(l), JSON.stringify([['library', 'Bibliothek'], ['to borrow', 'ausleihen'], ['scarf', 'Schal'], ['happy', 'glücklich']]));
});
test('Schule: Schreibauftrag-Check', () => {
  const good = C.writingCheck('I live in a small town. I go to school by bus. My best friend is Tom and he is funny. We play football because it is fun. After school I do my homework.', ['school', 'friend', 'football', 'homework', 'bus']);
  assert.equal(good.score, 100);
  const bad = C.writingCheck('i like dogs', ['school']);
  assert.ok(bad.score < 50);
});

test('Duell-Code mit Schulklasse: -K7 nur Schulstoff, deterministisch', () => {
  const p = C.duelParse('fox 123 1 k7');
  assert.equal(p.code, 'FOX-123-1-K7'); assert.equal(p.grade, 7);
  assert.equal(C.duelParse('FOX-123-1-K4'), null);
  const a = C.duelPlan(DATA, 'FOX-123-1-K7'), b = C.duelPlan(DATA, 'FOX-123-1-K7');
  assert.ok(a && a.plan.length >= 15); assert.equal(a.check, b.check);
  for (const it of a.plan) {
    if (it.k === 'w') assert.ok([7, 8].includes(DATA.units[it.item[0]].sch) || DATA.units[it.item[0]].sch === 7, 'nur Pakete Kl. 7');
    if (it.k === 'c') assert.ok((DATA.cases[it.i].k || 5) <= 7, 'Grammatik bis Kl. 7');
  }
  assert.notEqual(C.duelPlan(DATA, 'FOX-123-1').check, a.check);
  assert.ok(/-K8$/.test(C.duelNewCode(() => 0.5, '2', 8)));
});

test('Wochen-Challenge: ganze Woche gleicher Code je Klasse, nächste Woche neu', () => {
  const a = C.weekChallengeCode('2026-11-02', 7), b = C.weekChallengeCode('2026-11-08', 7), c = C.weekChallengeCode('2026-11-09', 7);
  assert.equal(a, b); assert.notEqual(a, c); assert.ok(/^WEEK-\d{3}-2-K7$/.test(a));
  assert.ok(C.duelPlan(DATA, a));
  assert.notEqual(C.weekChallengeCode('2026-11-02', 8), a);
});

test('Live-Duell: Punktvergabe identisch auf beiden Handys', () => {
  const A = { ok: true, ms: 1200 }, B = { ok: true, ms: 1500 }, X = { ok: false, ms: 900 };
  assert.equal(C.liveWinner(A, B, 'a', 'b'), 1); assert.equal(C.liveWinner(B, A, 'b', 'a'), -1);
  assert.equal(C.liveWinner(X, B, 'a', 'b'), -1); assert.equal(C.liveWinner(X, X, 'a', 'b'), 0);
  assert.equal(C.liveWinner(A, A, 'a', 'b'), 1); assert.equal(C.liveWinner(A, A, 'b', 'a'), -1);
});

test('Hausaufgaben-Code: kodieren und lesen', () => {
  const L = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah'];
  const pm = C.maskOf([10, 11, 12], [10, 12]), tm = C.maskOf(L, ['b', 'ah']);
  const code = C.hwCode(7, pm, tm); assert.ok(/^HA7-P[0-9A-Z]+-T[0-9A-Z]+$/.test(code));
  const h = C.hwParse(code.toLowerCase().replace(/-/g, ' - '));
  assert.equal(h.grade, 7); assert.equal(JSON.stringify(C.fromMask([10, 11, 12], h.pm)), '[10,12]');
  assert.equal(JSON.stringify(C.fromMask(L, h.tm)), '["b","ah"]');
  assert.equal(C.hwParse('HA4-P1-T1'), null); assert.equal(C.hwParse('HA7-P0-T0'), null); assert.equal(C.hwCode(7, 0, 0), null);
});

test('Vokabeln per Foto: Spalten, Lautschrift, Überschriften', () => {
  const W = (t, x0, x1) => ({ t, x0, x1, y0: 0, y1: 20 });
  const L = [
    { words: [W('Unit', 0, 40), W('3', 45, 55)] },
    { words: [W('library', 0, 60), W('[ˈlaɪbrəri]', 120, 220), W('Bibliothek', 300, 390)] },
    { words: [W('to', 0, 15), W('borrow', 20, 80), W('(sich)', 300, 340), W('ausleihen', 345, 420)] },
    { words: [W('library', 0, 60), W('Bücherei', 300, 380)] },
    { words: [W('house', 0, 40), W('Haus', 50, 80)] },
    { words: [W('a', 0, 8), W('piece', 12, 50), W('of', 55, 70), W('ein', 75, 95), W('Stück', 100, 140)] },
    { words: [W('12', 0, 20)] },
  ];
  assert.equal(JSON.stringify(C.ocrToList(L)), JSON.stringify([['library', 'Bibliothek'], ['to borrow', '(sich) ausleihen'], ['house', 'Haus'], ['a piece of', 'ein Stück']]));
  assert.equal(JSON.stringify(C.ocrSplitText('weather = Wetter')), JSON.stringify(['weather', 'Wetter']));
  assert.equal(JSON.stringify(C.ocrSplitText('I like it Ich mag es')), JSON.stringify(['I like it', 'Ich mag es']));
});

test('Vokabeln per Foto: falsch gelesene Lautschrift in Klammern wird übersprungen', () => {
  const W = (t, x0, x1) => ({ t, x0, x1, y0: 0, y1: 20 });
  const L = [
    { words: [W('exercise', 0, 70), W('book', 75, 110), W("['cksasaiz", 150, 230), W('bk]', 235, 260), W('Schulheft', 320, 400)] },
    { words: [W('headteacher', 0, 100), W('[', 150, 155), W('hed', 158, 190), W('ti:tfa]', 195, 250), W('Schulleiter/in', 320, 420)] },
  ];
  assert.equal(JSON.stringify(C.ocrToList(L)), JSON.stringify([['exercise book', 'Schulheft'], ['headteacher', 'Schulleiter/in']]));
});

test('Vokabeln per Foto: Spalten aus getrennten Blöcken werden zu Zeilen', () => {
  const W = (t, x0, x1, y) => ({ t, x0, x1, y0: y, y1: y + 20 });
  const rows = C.ocrRows([W('Haus', 300, 350, 2), W('house', 0, 50, 0), W('Schule', 300, 360, 41), W('school', 0, 60, 40)]);
  assert.equal(JSON.stringify(C.ocrToList(rows)), JSON.stringify([['house', 'Haus'], ['school', 'Schule']]));
});

test('Vokabeln per Foto: schräges Foto wird ausgeglichen', () => {
  const W = (t, x0, x1, y) => ({ t, x0, x1, y0: y, y1: y + 20 });
  const k = 0.05, R = (t, x0, x1, row) => W(t, x0, x1, row * 40 + k * x0);
  const words = [R('house', 0, 50, 0), R('Haus', 400, 450, 0), R('school', 0, 60, 1), R('Schule', 400, 460, 1), R('garden', 0, 70, 2), R('Garten', 400, 470, 2)];
  const lines = [[words[0], words[1]], [words[2], words[3]], [words[4], words[5]]];
  assert.equal(JSON.stringify(C.ocrToList(C.ocrRows(words, lines))), JSON.stringify([['house', 'Haus'], ['school', 'Schule'], ['garden', 'Garten']]));
});

test('Vokabeln per Foto: ü-Lesefehler „ii“ wird im Deutschen korrigiert', () => {
  const W = (t, x0, x1) => ({ t, x0, x1, y0: 0, y1: 20 });
  assert.equal(JSON.stringify(C.ocrToList([{ words: [W('bridge', 0, 60), W('Briicke', 300, 380)] }, { words: [W('to fly', 0, 60), W('fliegen', 300, 380)] }])), JSON.stringify([['bridge', 'Brücke'], ['to fly', 'fliegen']]));
});

test('Wortliste teilen: Link kodieren und lesen (Umlaute, Sonderzeichen)', () => {
  const code = C.wordShareEncode('Unit 3', 7, [['library', 'Bibliothek'], ['to borrow', '(sich) ausleihen'], ['bridge', 'Brücke'], ['a=b', 'x|y']]);
  assert.ok(/^[A-Za-z0-9_-]+$/.test(code));
  const d = C.wordShareDecode(code);
  assert.equal(d.unit, 'Unit 3'); assert.equal(d.grade, 7); assert.equal(d.words.length, 4);
  assert.equal(JSON.stringify(d.words[2]), JSON.stringify(['bridge', 'Brücke']));
  assert.equal(C.wordShareDecode('kaputt'), null); assert.equal(C.wordShareDecode(''), null);
});

test('Realschule/GMS (Sek I): Codes mit S, eigene Klassen-Zuordnung, Gymnasium-Codes unverändert', () => {
  assert.equal(C.schLoOf(8), 7); assert.equal(C.schLoOf(10), 9);
  assert.equal(C.schLoOf(6, 'sek1'), 5); assert.equal(C.schLoOf(9, 'sek1'), 7); assert.equal(C.schLoOf(10, 'sek1'), 10);
  assert.equal(C.schHiOf(8, 'sek1'), 9); assert.equal(C.schHiOf(8), 8);
  const u = DATA.units.find(x => x.id === 's9job'); assert.ok(u, 'Arbeitswelt-Paket fehlt');
  assert.equal(C.schGradeOf(DATA, u, ''), 9); assert.equal(C.schGradeOf(DATA, u, 'sek1'), 8);
  assert.equal(C.schGradeOf(DATA, { id: 'x' }, 'sek1'), 0);
  DATA.units.filter(x => x.sch).forEach(x => assert.ok(C.schGradeOf(DATA, x, 'sek1') >= 5, 'Sek-I-Klasse fehlt: ' + x.id));
  const d = C.duelParse('fox 123 1 s7'); assert.equal(d.code, 'FOX-123-1-S7'); assert.equal(d.plan, 'sek1'); assert.equal(d.grade, 7);
  assert.equal(C.duelParse('FOX-123-1-K7').plan, '');
  assert.ok(/-S8$/.test(C.duelNewCode(() => 0.5, '1', 8, 'sek1'))); assert.ok(/-K8$/.test(C.duelNewCode(() => 0.5, '1', 8)));
  const g = C.duelPlan(DATA, 'FOX-123-1-K8'), s = C.duelPlan(DATA, 'FOX-123-1-S8');
  assert.ok(g && s); assert.notEqual(g.check, s.check);
  assert.ok(/-2-S9$/.test(C.weekChallengeCode('2026-11-13', 9, 'sek1'))); assert.ok(/-2-K9$/.test(C.weekChallengeCode('2026-11-13', 9)));
  const h = C.hwParse(C.hwCode(7, 5, 3, 'sek1')); assert.equal(h.plan, 'sek1'); assert.equal(h.code, 'HA7S-P5-T3');
  assert.equal(C.hwParse('HA7-P5-T3').plan, '');
});

test('NRW Gymnasium: eigene Klassen-Zuordnung, Codes mit N', () => {
  const u = DATA.units.find(x => x.id === 's8usa'), v = DATA.units.find(x => x.id === 's8his');
  assert.equal(C.schGradeOf(DATA, u, 'nw'), 8); assert.equal(C.schGradeOf(DATA, v, 'nw'), 7);
  DATA.units.filter(x => x.sch).forEach(x => assert.ok(C.schGradeOf(DATA, x, 'nw') >= 5, 'NRW-Klasse fehlt: ' + x.id));
  assert.equal(C.schLoOf(8, 'nw'), 7); assert.equal(C.schLoOf(10, 'nw'), 9);
  assert.equal(C.duelParse('owl-555-2-n7').code, 'OWL-555-2-N7'); assert.equal(C.duelParse('OWL-555-2-N7').plan, 'nw');
  assert.notEqual(C.duelPlan(DATA, 'OWL-555-2-N7').check, C.duelPlan(DATA, 'OWL-555-2-K7').check);
  assert.ok(/-2-N6$/.test(C.weekChallengeCode('2026-11-13', 6, 'nw')));
  const h = C.hwParse(C.hwCode(6, 3, 9, 'nw')); assert.equal(h.plan, 'nw'); assert.equal(h.code, 'HA6N-P3-T9');
  assert.ok(DATA.school.combos.includes('nw-gym')); assert.equal(DATA.school.planOf['nw-gym'], 'nw');
  assert.ok(DATA.school.books.filter(b => (b.k || []).includes('nw-gym')).length >= 2);
});

test('Sek I Niveaus G/E: eigene Zuordnung, Codes mit G/E, Grammatik im Duell nach Lehrplan', () => {
  const P = DATA.school.plans;
  assert.equal(P.sek1e.t.repsimple, 6); assert.equal(P.sek1.t.repsimple, 7); assert.equal(P.sek1g.t.perf, 7);
  assert.equal(P.sek1g.p.s8his, undefined); assert.equal(C.schGradeOf(DATA, DATA.units.find(x => x.id === 's8his'), 'sek1g'), 0);
  assert.equal(C.schLoOf(8, 'sek1g'), 7); assert.equal(C.schLoOf(10, 'sek1e'), 10);
  assert.equal(C.duelParse('FOX-123-1-G9').plan, 'sek1g'); assert.equal(C.duelParse('FOX-123-1-E9').plan, 'sek1e');
  assert.equal(C.hwParse('HA9E-P3-T3').plan, 'sek1e');
  const pl = C.duelPlan(DATA, 'FOX-123-1-G6');
  pl.plan.filter(q => q.k === 'c').forEach(q => { const c = DATA.cases[q.i]; assert.ok(P.sek1g.t[c.g] && P.sek1g.t[c.g] <= 6, 'Grammatik zu früh für G6: ' + c.g); });
  assert.equal(DATA.school.topics.repsimple.k, 7);
});

test('Kommunikationsprüfung: Note aus Punkten wie Tabelle des KM', () => {
  assert.equal(C.kpGrade(30), 1); assert.equal(C.kpGrade(15), 3.5); assert.equal(C.kpGrade(6), 5); assert.equal(C.kpGrade(0), 6);
  assert.equal(C.kpGrade(99), 1); assert.equal(C.kpGrade(-3), 6);
  assert.ok(DATA.grad.med.length >= 10 && DATA.grad.fq.length >= 10 && DATA.grad.phr.length >= 12 && DATA.grad.wr.length >= 4);
  DATA.grad.med.forEach(m => assert.ok(['de-en', 'en-de'].includes(m.r) && m.keys.length >= 2 && m.model && m.src, 'Sprachmittlung unvollständig'));
});

test('Bayern Gymnasium: Jahrgangsstufen statt Doppeljahrgänge, Codes mit B', () => {
  assert.equal(C.schLoOf(7, 'by'), 7); assert.equal(C.schHiOf(7, 'by'), 7);
  assert.equal(DATA.school.plans.by.t.past, 5); assert.equal(DATA.school.plans.by.t.if3, 7);
  assert.equal(C.duelParse('FOX-123-1-B7').plan, 'by'); assert.equal(C.hwParse('HA7B-P1-T1').plan, 'by');
  DATA.units.filter(x => x.sch).forEach(x => assert.ok(C.schGradeOf(DATA, x, 'by') >= 5, 'BY-Klasse fehlt: ' + x.id));
});

test('Niedersachsen Gymnasium: freigeschaltet, Grundzuordnung, eigene Lehrwerke', () => {
  assert.ok(DATA.school.combos.includes('ni-gym')); assert.equal(DATA.school.planOf['ni-gym'], undefined);
  assert.ok(DATA.school.books.filter(b => (b.k || []).includes('ni-gym')).length >= 3);
});

test('Hessen Gymnasium: Plan he, Codes mit H, Jahrgangsstufen', () => {
  assert.equal(DATA.school.planOf['he-gym'], 'he'); assert.equal(DATA.school.plans.he.t.passive, 7); assert.equal(DATA.school.plans.he.t.goingto, 5);
  assert.equal(C.schLoOf(8, 'he'), 8); assert.equal(C.duelParse('FOX-123-1-H8').plan, 'he'); assert.equal(C.hwParse('HA8H-P1-T1').plan, 'he');
  DATA.units.filter(x => x.sch).forEach(x => assert.ok(C.schGradeOf(DATA, x, 'he') >= 5, 'HE-Klasse fehlt: ' + x.id));
});

test('NRW alle Schularten: Realschule/E-Kurs (R), G-Kurs/Hauptschule (U)', () => {
  const S = DATA.school; ['nw-rs', 'nw-ge', 'nw-sek', 'nw-hs'].forEach(k => assert.ok(S.combos.includes(k), k));
  assert.equal(S.planOf['nw-hs'], 'nwg'); assert.equal(S.nivPlan['nw-ge'].gk, 'nwg');
  assert.equal(S.plans.nwrs.t.past, 5); assert.equal(S.plans.nwg.t.perf, 7); assert.equal(S.plans.nwg.t.if3, undefined);
  assert.equal(C.duelParse('FOX-123-1-R8').plan, 'nwrs'); assert.equal(C.hwParse('HA8U-P1-T1').plan, 'nwg');
  DATA.units.filter(x => x.sch).forEach(x => assert.ok(C.schGradeOf(DATA, x, 'nwrs') >= 5, 'NWRS fehlt: ' + x.id));
});

test('Rheinland-Pfalz: Gymnasium (P), Realschule plus/IGS mit Standard/erhöhtem Niveau', () => {
  const S = DATA.school; ['rp-gym', 'rp-rsp', 'rp-igs'].forEach(k => assert.ok(S.combos.includes(k), k));
  assert.equal(S.planOf['rp-gym'], 'rp'); assert.equal(S.nivPlan['rp-rsp'].eh, 'rp'); assert.equal(S.plans.rp.t.reported, 8);
  assert.equal(C.duelParse('FOX-123-1-P8').plan, 'rp');
  DATA.units.filter(x => x.sch).forEach(x => assert.ok(C.schGradeOf(DATA, x, 'rp') >= 5, 'RP fehlt: ' + x.id));
});

test('Sachsen Gymnasium: Plan sn, Codes mit X', () => {
  assert.equal(DATA.school.planOf['sn-gym'], 'sn'); assert.equal(DATA.school.plans.sn.t.if2, 6); assert.equal(DATA.school.plans.sn.t.passive, 7);
  assert.equal(C.duelParse('FOX-123-1-X7').plan, 'sn');
  DATA.units.filter(x => x.sch).forEach(x => assert.ok(C.schGradeOf(DATA, x, 'sn') >= 5, 'SN fehlt: ' + x.id));
});

test('Berlin/Brandenburg: Schularten mit Niveau/Kurs', () => {
  const S = DATA.school; ['be-gs', 'be-gym', 'be-iss', 'bb-gs', 'bb-gym', 'bb-obs', 'bb-ge'].forEach(k => assert.ok(S.combos.includes(k), k));
  assert.equal(S.nivPlan['be-iss'].gr, 'sek1g'); assert.equal(S.planOf['bb-obs'], 'sek1');
  ['be-gym', 'be-iss', 'bb-obs', 'bb-ge'].forEach(k => assert.ok(S.books.filter(b => (b.k || []).includes(k)).length >= 2, 'Lehrwerke ' + k));
});
