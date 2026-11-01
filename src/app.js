/* English Trail (Kopie von English Trail) – Oberfläche & Spielmodi. Daten: #ps-data (JSON), Logik: PSCore (core.js). */
(function () {
  'use strict';
  var C = window.PSCore;
  /* Rohdaten bleiben unverändert (Duell: gleiche Fragen auf allen Handys); D = Anzeige mit Sprecherform (3.0) */
  var RAW = JSON.parse(document.getElementById('ps-data').textContent);
  var D = RAW, U = RAW.units, ALTG = {}, WALT = {};
  function gwalk(x, g) {
    if (typeof x === 'string') {
      if (x.indexOf('{') < 0 || !C.hasG(x)) return x;
      var a = C.gform(x, g), b = C.gform(x, g === 'f' ? 'm' : 'f');
      ALTG[C.norm(a)] = b;
      x.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, function (m, mm, ff) { var mine = g === 'f' ? ff : mm, other = g === 'f' ? mm : ff; WALT[C.norm(mine)] = other; return m; });
      return a;
    }
    if (Array.isArray(x)) return x.map(function (y) { return gwalk(y, g); });
    if (x && typeof x === 'object') { var o = {}; Object.keys(x).forEach(function (k) { o[k] = gwalk(x[k], g); }); return o; }
    return x;
  }
  /* 3.0: „Dla Polaków“ (600 Fragen) wird erst bei Bedarf geladen (data-polacy.json, offline aus dem Service-Worker-Cache) */
  var POL_URL = 'data-polacy.json', polWait = null;
  /* 3.3: Szlak 2 (A2) und 3 (B1) kommen aus data-szlak.json und werden direkt nach Szlak 1 eingefügt – Fortschritt hängt nur an den IDs */
  var S3_URL = 'data-szlak.json', s3Wait = null;
  function addUnits(arr) {
    var u = RAW.units, k = 0, have = {}; while (k < u.length && !u[k].pack) k++;
    u.forEach(function (x) { have[x.id] = 1; });
    RAW.units = u.slice(0, k).concat(arr.filter(function (x) { return x && x.id && !have[x.id]; }), u.slice(k)); delete RAW.unitsLazy;
    loadData(); fixUnlock();
  }
  function needS3(cb) {
    if (!RAW.unitsLazy) { if (cb) cb(); return; }
    if (!s3Wait) s3Wait = fetch(S3_URL).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(addUnits, function (e) { s3Wait = null; throw e; });
    s3Wait.then(function () { if (cb) cb(); }, function () {});
  }
  function needPolacy(cb, quiet) {
    if (RAW.polacy) return cb();
    if (!polWait) polWait = fetch(POL_URL).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(function (j) { RAW.polacy = j; loadData(); }, function (e) { polWait = null; throw e; });
    polWait.then(cb, function () { if (!quiet) toast(t('lazy_fail')); });
  }
  function loadData() { ALTG = {}; WALT = {}; D = gwalk(RAW, S.gender === 'f' ? 'f' : 'm'); U = D.units; }
  /* Antwort prüfen; die andere Sprecherform gilt immer auch als richtig */
  function chk(input, target, opts) {
    var r = C.checkAnswer(input, target, opts); if (r.ok) return r;
    var alts = [ALTG[C.norm(target)], String(target).split(' ').map(function (w) { var k = C.norm(w); return WALT[k] ? w.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), WALT[k]) : w; }).join(' ')];
    for (var i = 0; i < alts.length; i++) { if (!alts[i] || alts[i] === target) continue; var r2 = C.checkAnswer(input, alts[i], opts); if (r2.ok || (r.kind === 'wrong' && r2.kind !== 'wrong')) return r2; }
    return r;
  }
  var KEY = 'english_trail_v1';
  var $app = document.getElementById('app');

  /* ---------- Texte (UI-Sprache = Basissprache) ---------- */
  var TX = {
    de: {
      live: 'Live-Duell', live_tile_d: '2 Handys, gleichzeitig – wer zuerst richtig antwortet, bekommt den Punkt', live_d: 'Du und ein Freund oder eine Freundin spielt gleichzeitig auf zwei Handys dieselben 20 Fragen. Wer zuerst richtig antwortet, bekommt den Punkt. Falsch getippt? Dann ist die Frage für dich gesperrt.', live_name: 'Dein Spitzname', live_new: 'Neues Duell erstellen', live_join: 'Oder einem Duell beitreten', live_join_btn: 'Beitreten', live_privacy: 'Kein Konto nötig, nichts wird gespeichert: Nur dein Spitzname und deine Antworten gehen live an das andere Handy.', live_offline: 'Für das Live-Duell brauchst du Internet.', live_connect: 'Verbinde …', live_err: 'Verbindung nicht möglich. Prüf dein Internet und versuch es noch einmal.', live_code: 'Euer Duell-Code', live_wait: 'Schick den Code an deinen Gegner. Sobald er beitritt, geht es los.', live_found: '{n} ist da!', live_ver: 'Achtung: Ihr habt verschiedene App-Versionen – bitte beide die Seite neu laden.', live_ready: 'Ich bin bereit', live_wait_ready: 'Warte auf {n} …', live_opp_ready: '{n} ist bereit!', live_pt_me: 'Punkt für dich! ⚡', live_pt_opp: 'Punkt für {n}', live_pt_none: 'Kein Punkt – keiner hatte es richtig', live_ok_wait: 'Richtig! Mal sehen, wer schneller war …', live_wrong: 'Leider falsch – diese Frage ist für dich gesperrt.', live_opp_done: '{n} hat schon geantwortet!', live_win: 'Du hast gewonnen! 🏆', live_lose: '{n} hat gewonnen', live_draw: 'Unentschieden!', live_left: 'Dein Gegner hat das Duell verlassen.', live_right: '{n} von {t} richtig', live_again: 'Revanche (neuer Code)', live_me: 'Ich', live_opp: 'Gegner',
      sch_likes: 'Was magst du?', sch_likes_d: 'Wähl so viele Themen, wie du willst. Dazu bekommst du Englisch-Pakete mit Wörtern, Sätzen und Szenen – passend zur Schulgrammatik.', sch_likes_mine: 'Deine Lieblingsthemen',
      sch_week: 'Wochen-Challenge deiner Klasse', sch_week_d: 'Diese Woche bekommen alle in deiner Klassenstufe genau dieselben 20 Fragen. Vergleicht im Klassenchat, wer am meisten richtig hat – bei Gleichstand gewinnt die schnellere Zeit. Jeden Montag gibt es eine neue Challenge.', sch_week_go: 'Challenge spielen', sch_duel: 'Duell auf 2 Handys',
      d2_src: 'Fragen aus', d2_src_trail: 'Trail (Reise)',
      sch_q_listen: 'Hör zu: Was wurde gesagt?', sch_q_read: 'Lies: Was bedeutet der Satz?', sch_q_mediate: 'Sprachmittlung: Wie sagst du das auf Englisch?', sch_write: 'Schreibauftrag', sch_write_d: 'Wie in der Klassenarbeit: ein kurzer Text zum Thema – die App prüft Länge, Pflichtwörter und Satzbau.', sch_write_task: 'Schreib einen kurzen Text (5–8 Sätze) auf Englisch zum Thema „{t}“.', sch_write_use: 'Benutze mindestens 3 dieser Wörter', sch_write_check: 'Text prüfen', sch_write_good: 'Stark! So kannst du das in der Arbeit schreiben.', sch_write_more: 'Guter Anfang – schau dir die offenen Punkte an.', wc_len: 'Mindestens 5 Sätze ({n} geschrieben)', wc_words: 'Mindestens 3 Pflichtwörter benutzt ({n})', wc_link: 'Verbindungswörter (and, but, because, so, when …) ({n})', wc_caps: 'Sätze beginnen groß und enden mit . ! ?', wc_i: '„I“ immer großgeschrieben', mw_bulk: 'Mehrere Vokabeln auf einmal', mw_bulk_d: 'Eine Vokabel pro Zeile: englisch = deutsch (auch mit - oder Tab). Die Unit von oben wird übernommen.', mw_bulk_go: 'Alle hinzufügen', mw_bulk_ok: '{n} Vokabeln hinzugefügt',
      sch_unit: 'Unit (aus deinem Buch, freiwillig)', sch_unit_go: 'üben', sch_unit_few: 'Trag erst mindestens 2 Wörter für diese Unit ein.', sch_own_add: 'Vokabeln eintragen', sch_mine: 'meine Vokabeln',
      sch: 'Schule', sch_d: 'Englisch passend zu Bundesland, Klasse und Lehrwerk', sch_grade: 'Klasse {g}', sch_setup: 'Deine Schule', sch_setup_d: 'Wähle Bundesland, Schulform und Klasse. Dann zeigt dir die App den Stoff, der laut Bildungsplan dran ist. Weitere Länder und Schulformen folgen.', sch_state: 'Bundesland', sch_type: 'Schulform', sch_class: 'Klasse', sch_book: 'Lehrwerk', sch_book_none: '– kein Lehrwerk angeben –', sch_book_d: 'Die App nutzt nur Themen und Grammatik passend zum Bildungsplan, keine Texte aus dem Schulbuch. Vokabeln aus deinem Buch kannst du unter „Meine Wörter“ selbst eintragen.', sch_save: 'Speichern', sch_soon: 'bald', sch_band: 'Band', sch_change: 'Ändern', sch_words: 'Wortschatz deiner Klasse', sch_words_d: 'Themen aus dem Bildungsplan – mit Szene, Quiz, Hören, Schreiben und Prüfung wie auf dem Trail.', sch_gram: 'Grammatik', sch_gram_d: 'Neu in Klasse {a}/{b}. Tippe ein Thema an und übe mit Sätzen.', sch_gram_all: 'Alle Themen gemischt', sch_repeat: 'Wiederholen aus früheren Klassen', sch_from: 'ab Klasse', sch_exam: 'Probe-Klassenarbeit', sch_exam_d: 'Wie in der echten Arbeit: Grammatik, Wortschatz, Hörverstehen, Leseverstehen und Sprachmittlung. Wähle, was drankommt. 20 Fragen, 15 Minuten.', sch_exam_pick: 'Was kommt dran?', sch_exam_go: 'Probe-Arbeit starten', sch_exam_none: 'Wähle mindestens ein Thema.', sch_own: 'Vokabeln aus deinem Buch', sch_own_d: 'Trag die Vokabeln aus deinem Buch mit der Unit ein (z. B. „Unit 3“). Dann kannst du jede Unit gezielt üben, und sie kommen in Wiederholung und Probe-Arbeit.', sch_chat_d: 'Schreib mit der KI auf Englisch – sie benutzt nur Wörter und Grammatik bis Klasse {g}.', why_school: 'Schule',
      conj_inf: 'Grundform', conj_q_past: 'Wie heißt die 2. Form (simple past)?', conj_q_pp: 'Wie heißt die 3. Form (past participle)?', clsn_aaa: 'alle gleich', clsn_aba: '1. = 3.', clsn_abb: '2. = 3.', clsn_abc: 'alle verschieden', cls_aaa: 'Alle drei Formen sind gleich: cut – cut – cut.', cls_aba: 'Grundform und 3. Form sind gleich: come – came – come.', cls_abb: '2. und 3. Form sind gleich: buy – bought – bought.', cls_abc: 'Alle drei Formen sind verschieden: go – went – gone.',
      nav_home: 'Start', nav_practice: 'Üben', nav_album: 'Album', nav_me: 'Ich',
      level: 'Stufe', week: 'Diese Woche', of: 'von', days: 'Tagen', wk_streak: 'Wochen in Folge',
      total_days: 'Lerntage gesamt', mastered: 'Wörter sicher', due: 'fällig', continue: 'Weiter auf dem Trail',
      review: 'Wiederholen', review_d: 'Was dein Gedächtnis gerade vergisst', daily: 'Tagesrätsel', daily_d: '10 Fragen, heute für dich gleich',
      blitz: 'Blitz 60', blitz_d: 'Eine Minute, so viele wie möglich', cases: 'Zeiten-Werkstatt', cases_d: 'Die englischen Zeiten mit Sätzen statt Tabellen',
      sounds: 'Laut-Detektiv', sounds_d: 'th, w, v, stumme Buchstaben … richtig hören', twister: 'Zungenbrecher', twister_d: 'Sprich die Klassiker nach',
      prices: 'Preise hören', prices_d: 'Pfund-Beträge verstehen: three pounds fifty', duel: 'Familienduell', duel_d: '2–4 Leute an einem Handy',
      face: 'Gegenüber', face_d: '2 Leute, 1 Handy: wer tippt zuerst?', face_rules: 'Legt das Handy flach zwischen euch – jeder hat seine Bildschirmhälfte. Beide sehen dieselbe Frage. Wer zuerst richtig tippt, bekommt den Punkt. Falsch getippt = für diese Frage gesperrt.', face_n: 'Fragen', face_fast: 'war schneller', face_wrong: 'Falsch – gesperrt', face_point: '+1 Punkt!', face_nobody: 'Keiner wusste es', face_win: 'Gewonnen!', face_lose: 'Knapp verloren', face_quit: 'Beenden',
      mistakes: 'Fehlerheft', mistakes_d: 'Deine Stolpersteine gezielt', mywords: 'Meine Wörter', mywords_d: 'Eigene Vokabeln, z. B. aus deinem Beruf',
      lex: 'Wortschatz', lex_d: 'Alle Wörter aus deinen Lektionen nachschlagen', lex_ph: 'Suchen: Englisch oder Deutsch', lex_seen: 'Schon gelernt', lex_all: 'Alle offenen Städte', lex_count: '{n} Wörter', lex_one: '1 Wort', lex_none: 'Nichts gefunden.', lex_more: 'In allen offenen Städten suchen', lex_empty: 'Noch keine Wörter gelernt. Starte in einer Stadt mit „Neue Wörter“.', lex_mic_pl: 'Englisch sprechen', lex_mic_x: 'Deutsch sprechen', lex_listen: 'Ich höre zu …',
      learn: 'Neue Wörter', learn_d: 'Hören, sehen, merken', quiz: 'Quiz', quiz_d: 'Gemischte Fragen', listen: 'Hören', listen_d: 'Nur das Ohr zählt',
      type: 'Schreiben', type_d: 'Selbst tippen statt wählen', build: 'Satzbau', build_d: 'Sätze aus Wörtern bauen', cloze: 'Lückensatz', cloze_d: 'Das fehlende Wort finden',
      match: 'Paare', match_d: 'Memory gegen die Uhr', speak: 'Sprechen', speak_d: 'Laut nachsprechen', scene: 'Szene', scene_d: 'Ein echtes Gespräch vor Ort',
      boss: 'Stadtprüfung', boss_d: '12 Fragen, 3 Leben. Schaltet die nächste Stadt frei', locked: 'Noch gesperrt', test_out: 'Abkürzung: Prüfung direkt machen',
      can: 'Danach kannst du', tip: 'Kurz erklärt', words: 'Wortschatz', check: 'Prüfen', next: 'Weiter', skip: 'Überspringen', right: 'Richtig', wrong: 'Nicht ganz',
      solution: 'Lösung', almost_dia: 'Richtig, achte auf die Schreibweise', almost_typo: 'Fast, ein Tippfehler', listen_again: 'Nochmal hören', slow: 'Langsam',
      done: 'Fertig', score: 'Ergebnis', xp: 'XP', combo: 'Kombo', back: 'Zurück', home: 'Zur Karte', again: 'Nochmal', share: 'Ergebnis kopieren', copied: 'Kopiert',
      postcards: 'Postkarten', krasnale: 'Tower-Raben', krasnal_found: 'Du hast einen Raben gefunden', krasnal_hint: 'Die Raben aus dem Tower of London verstecken sich nach Übungen. Jeder bringt ein neues Wort mit.',
      postcard_new: 'Neue Postkarte', unlocked: 'Neue Stadt freigeschaltet', passed: 'Bestanden', failed: 'Diesmal nicht. Die Fehler kommen in dein Fehlerheft.',
      accent: 'Aussprache', accent_gb: 'Britisch', accent_us: 'Amerikanisch', accent_d: 'Gilt für Vorlesen und Spracherkennung. In der Schule in Baden-Württemberg ist Britisch üblich.',
      settings: 'Einstellungen', base_lang: 'Ich lerne Englisch über', goal: 'Wochenziel (Lerntage)', len: 'Länge einer Runde', short: 'Kurz', medium: 'Mittel', long: 'Lang',
      hardcore: 'Strenger Schreibmodus (Akzente zählen, doppelte XP)', theme: 'Darstellung', auto: 'Automatisch', light: 'Hell', dark: 'Dunkel',
      backup: 'Fortschritt sichern', backup_d: 'Kopiere diesen Text und füge ihn auf einem anderen Gerät wieder ein.', restore: 'Wiederherstellen', restored: 'Fortschritt geladen', bad_backup: 'Der Text ist kein gültiger Spielstand.',
      reset: 'Alles zurücksetzen', reset_q: 'Wirklich alles löschen? Tippe nochmal zum Bestätigen.',
      vs_last: 'Du gegen dich letzte Woche', this_w: 'diese Woche', last_w: 'letzte Woche',
      fresh: 'Neue Woche, frischer Start', fresh_d: 'Letzte Woche: {a} von {g} Lerntagen. Diese Woche zählt neu.', fresh_ok: 'Wochenziel letzte Woche erreicht. Stark.',
      pause_ok: 'Ein Tag Pause bricht hier nichts. Gezählt wird die Woche.',
      no_due: 'Gerade ist nichts fällig. Wir nehmen deine schwächsten Wörter.', empty_mistakes: 'Dein Fehlerheft ist leer.',
      add: 'Hinzufügen', pl: 'Englisch', meaning: 'Bedeutung', mywords_empty: 'Noch keine eigenen Wörter. Füge Vokabeln hinzu, die du wirklich brauchst.', practice_mine: 'Meine Wörter üben', delete: 'Löschen',
      d2: 'Duell-Code (2 Handys)', d2_d: 'Jeder spielt am eigenen Handy. Gleicher Code = exakt dieselben 20 Fragen, egal wie weit ihr seid.', d2_new: 'Neuen Code erstellen', d2_code: 'Code', d2_bad: 'Code ungültig. Beispiel: KOT-472-1', d2_level: 'Stufe (steckt im Code)',
      d2_check: 'Prüfzeichen', d2_check_d: 'Vergleicht das Prüfzeichen, bevor ihr startet. Nur wenn beide dasselbe sehen, habt ihr dieselben Fragen – sonst bei beiden die App neu laden.', d2_send_code: 'Code teilen', d2_share: 'Ergebnis teilen', d2_time: 'Zeit',
      d2_paste: 'Ergebnis von deinem Gegenüber hier einfügen', d2_compare: 'Vergleichen', d2_win: 'Du gewinnst!', d2_lose: 'Dein Gegenüber gewinnt', d2_other_code: 'Anderer Code – das Ergebnis gehört nicht zu diesem Duell.', d2_other_check: 'Anderes Prüfzeichen – ihr hattet nicht dieselben Fragen. Bitte bei beiden die App neu laden.', d2_unreadable: 'Kein Ergebnis gefunden (z. B. „15/20 · 2:13“).', d2_same: 'Gleiche Fragen bestätigt',
      d2_name: 'Dein Name (für Ergebnis und Rangliste)', d2_me: 'Ich', d2_pol: 'Profi-Bereich', d2_learn: 'Lernende', d2_weight: 'Punkte ×',
      d2_mix: 'Gemischt spielen: Dein Gegenüber nimmt denselben Code mit eigener Stufe, z. B. KOT-472-1 gegen KOT-472-P2. Dann gibt es unterschiedliche Fragen, und die richtigen Antworten werden gewichtet: Stufe 1 ×1 · 2 ×1,5 · 3 ×2 · P1 ×2 · P2 ×2,5 · P3 ×3.',
      d2_rec: 'Empfohlen für dich', d2_mixed: 'Gemischtes Duell – unterschiedliche Fragen, Punkte gewichtet', d2_pts: 'Punkte', d2_inp_diff: 'Hinweis: Ihr habt mit unterschiedlicher Antwortart gespielt (W = Schreiben, S = Sprechen, T = Antippen).',
      d2_other_base: 'Anderer Code-Stamm – das Ergebnis gehört nicht zu diesem Duell.',
      rank: 'Rangliste', rank_d: 'Auf diesem Handy gespeichert (wird mit „Fortschritt sichern“ mitgesichert). Es zählen nur Ergebnisse mit gültiger Prüfsumme, jedes Duell nur einmal. Sortiert nach Siegen, dann Punkten.',
      rank_empty: 'Noch keine Duelle eingetragen. Nach einem Duell-Code-Spiel das Ergebnis deines Gegenübers einfügen und vergleichen.', rank_g: 'Spiele', rank_w: 'Siege', rank_d2: 'Unent.', rank_pts: 'Punkte', rank_clear: 'Rangliste löschen', rank_clear_q: 'Rangliste wirklich löschen?',
      rank_added: 'In die Rangliste eingetragen.', rank_dupe: 'Dieses Duell steht schon in der Rangliste.', rank_unsigned: 'Nicht in die Rangliste eingetragen: Das Ergebnis hat keine gültige Prüfsumme (verändert oder alte App-Version).',
      players: 'Spieler', start: 'Los geht’s', turn: 'ist dran', winner: 'gewinnt', tie: 'Unentschieden',
      duel_quiz: 'Wortquiz', pm: 'Stadt-Land-Fluss', pm_d: 'Stadt-Land-Fluss auf Englisch', pm_letter: 'Buchstabe', pm_pass: 'Gib das Handy an', pm_ready: 'Bereit – Buchstabe zeigen',
      pm_done: 'Fertig', pm_check: 'Auswertung', pm_count: 'Punkte zählen', pm_next_round: 'Nächste Runde', pm_round: 'Runde', pm_examples: 'Möglich wäre',
      pm_valid: 'gilt', pm_invalid: 'gilt nicht', pm_total: 'Gesamt', pm_lookaway: 'Die anderen schauen bitte weg.', pm_mode: 'Spiel',
      pm_rules: 'Zu jedem Buchstaben ein englisches Wort pro Kategorie. Einzigartig = 10, doppelt = 5, als Einzige/r gültig = 20 Punkte. Unbekannte Wörter kann die Runde per Tipp gelten lassen. Jedes Spiel nimmt 5 zufällige Kategorien.',
      memo_w: 'Wort-Memory', memo_w_d: 'Paare aus allen offenen Städten', memo_p: 'Orte-Memory', memo_p_d: 'Ort und Beschreibung finden', memo_y: 'Jahres-Memory', memo_y_d: 'Jahreszahl und Ereignis verbinden',
      pol: 'Profi-Bereich', pol_d: 'Mówisz po polsku? Sprawdź, jak dobrze – ortografia, poprawność, frazeologia i wiedza.',
      pol_intro: 'Strefa dla osób, dla których polski jest językiem ojczystym lub które znają go bardzo dobrze. Wszystko po polsku.',
      pol_lv: 'Twój poziom', pol_lvx: 'jeszcze bez testu', pol_lv0: 'podstawowy', pol_lv1: 'dobry', pol_lv2: 'bardzo dobry', pol_lv3: 'mistrz',
      pol_test: 'Test poziomu', pol_test_d: '18 pytań, po 3 z każdej kategorii – od łatwych do bardzo trudnych.',
      pol_qlv: 'Poziom pytań', pol_mix: 'Mieszanka', pol_mix_d: '10 pytań ze wszystkich kategorii', pol_res_up: 'Gratulacje! Nowy poziom', pol_res: 'Twój wynik testu',
      pol_c_ortografia: 'Ortografia', pol_c_ortografia_d: 'ó/u, rz/ż, ch/h, nie razem czy osobno',
      pol_c_poprawnosc: 'Poprawna polszczyzna', pol_c_poprawnosc_d: 'Typowe błędy: wziąć czy wziąść?',
      pol_c_aspekt: 'Aspekt i czasowniki', pol_c_aspekt_d: 'Dokonany, niedokonany, czasowniki ruchu',
      pol_c_liczebniki: 'Liczebniki', pol_c_liczebniki_d: 'Dwóch, dwie, dwoje – i odmiana',
      pol_c_frazeologia: 'Frazeologia', pol_c_frazeologia_d: 'Idiomy, przysłowia, skrzydlate słowa',
      pol_c_wiedza: 'Wiedza o Polsce', pol_c_wiedza_d: 'Literatura, historia, geografia, kultura',
      inp: 'Antworten durch', inp_write: 'Schreiben', inp_speak: 'Sprechen', inp_tap: 'Antippen', inp_rather: 'Lieber',
      inp_write_d: 'Du tippst die Antwort selbst ein – am meisten Lerneffekt.', inp_speak_d: 'Du sagst die Antwort laut (Mikro). Ohne Mikro: laut sagen, aufdecken, selbst bewerten.', inp_tap_d: 'Du wählst die Antwort aus vier Vorschlägen – nur lesen, nichts schreiben.',
      inp_say: 'Sag die Antwort auf Englisch', inp_reveal: 'Aufdecken', inp_ok: 'Richtig gesagt', inp_no: 'Falsch gesagt', inp_selfq: 'Laut gesagt? Dann aufdecken und ehrlich bewerten.',
      speak_tap: 'Tippe aufs Mikro und sprich', speak_self: 'Sprich laut nach. Wie lief es?', speak_good: 'Gut', speak_retry: 'Nochmal', you_said: 'Erkannt',
      no_mic: 'Spracherkennung ist hier nicht verfügbar. Sprich laut nach und bewerte dich selbst.',
      tts_missing: 'Dein Gerät hat keine englische Stimme. Der Text bleibt sichtbar.',
      ob_title: 'Englisch lernen, Ort für Ort.', ob_sub: 'Eine Reise über den Trail: 12 Orte, echte Gespräche, kurze Runden. Ohne Druck, ohne schlechtes Gewissen.',
      ob_why: 'Wofür lernst du?', why_travel: 'Reisen', why_family: 'Familie & Freunde', why_work: 'Arbeit', why_curious: 'Neugier',
      ob_goal: 'An wie vielen Tagen pro Woche willst du üben?', ob_go: 'Los nach Warszawa',
      hear: 'Was hörst du?', choose_meaning: 'Was bedeutet das?', choose_pl: 'Wie sagt man das auf Englisch?', type_pl: 'Schreib es auf Englisch', build_pl: 'Bau den Satz', fill: 'Welches Wort fehlt?',
      price_q: 'Welcher Betrag?', sound_q: 'Wie klingt der markierte Teil?', hear_word: 'Welches Wort hörst du?', case_q: 'Welche Form passt?',
      learned_today: 'Das kannst du jetzt sagen', pairs_left: 'Paare übrig', time_left: 'Sekunden',
      week_short: ['Mo','Di','Mi','Do','Fr','Sa','So'], city_progress: 'sicher', all_cities: 'Alle Städte',
      diff: 'Schwierigkeit', diff_easy: 'Leicht', diff_medium: 'Mittel', diff_hard: 'Schwer',
      diff_easy_d: 'Viel Auswahl, Akzente egal, Übersetzungen sichtbar.',
      diff_medium_d: 'Mehr Hören und Schreiben, Diktate, Prüfung ab 70 %. 1,5-fache XP.',
      diff_hard_d: 'Fast alles selbst schreiben, 6 Optionen, Akzente zählen, Übersetzungen versteckt, Prüfung 15 Fragen / 2 Leben / 80 %. Doppelte XP.',
      dictate: 'Schreib, was du hörst', translate_pl: 'Übersetze ins Englische', show_tr: 'Übersetzung zeigen',
      skip_q: 'Frage überspringen', skip_city: 'Stadt überspringen', skip_city_d: 'Die nächste Stadt wird frei. Die Postkarte gibt es nur mit bestandener Prüfung.',
      skipped_city: 'Übersprungen', skipped_toast: 'Weiter geht\u2019s in', free_roam: 'Freie Reise: alle Städte sofort offen',
      placement: 'Einstufungstest', placement_d: 'Du kannst schon etwas? 2 Fragen pro Stadt, danach startest du dort, wo es hakt.',
      placement_res: 'Dein Start', placement_all: 'Alle Städte sitzen. Freie Reise ist an.',
      ob_diff: 'Wie schwer soll es sein?', ob_place: 'Ich kann schon etwas: Einstufungstest',
      nav_land: 'UK & USA', land: 'Land und Leute', land_d: 'Geschichte, Bräuche, Menschen und Orte. Jede Runde bringt Wissen, das du auf Reisen und im Gespräch brauchst.',
      facts: 'Großbritannien in Zahlen', whoami: 'Wer bin ich?', whoami_d: 'Berühmte Briten und Amerikaner erraten', tf: 'Wahr oder falsch?', tf_d: 'Bräuche, Alltag, Feiertage',
      timeline: 'Zeitstrahl', timeline_d: 'Die Geschichte Großbritanniens in die richtige Reihenfolge', pin: 'Wo liegt das?', pin_d: 'Orte auf der Karte finden',
      hl: 'Höher oder tiefer?', hl_d: 'Städte, Flüsse, Berge vergleichen', literki: 'Literki', literki_d: 'Buchstabensalat: das englische Wort finden',
      t_true: 'Wahr', t_false: 'Falsch', more_clue: 'Noch ein Hinweis', clue: 'Hinweis', tap_order: 'Tippe die Ereignisse an, das älteste zuerst',
      tap_map: 'Tippe auf die Karte', km_off: 'km daneben', letters_q: 'Welches Wort steckt darin?', order_q: 'Reihenfolge',
      survival: 'Survival', survival_d: 'Wenige Sekunden pro Frage, 3 Leben, so weit du kommst', best: 'Rekord',
      j_5050: '50:50', j_freeze: '+10 s', j_hint: 'Tipp', jokers: 'Joker', jokers_d: 'Jeden Montag gibt es wieder 3 von jedem. 50:50 streicht zwei falsche Antworten, Tipp zeigt Anfangsbuchstaben, +10 s hält die Uhr an.',
      sec: 'Sek.',
      spell: 'Rechtschreibung', spell_d: 'ó oder u? rz oder ż? Die richtige Schreibweise finden', spell_q: 'Wie schreibt man es richtig?',
      rule_ou: 'ó und u klingen gleich. Die Schreibweise muss man sich merken.', rule_rz: 'rz und ż klingen gleich. Tipp: Wechselt das r in verwandten Wörtern (morze → morski), schreibt man rz.',
      rule_ch: 'ch und h klingen heute gleich. ch ist viel häufiger, h steht oft in Lehnwörtern (herbata, hotel).', rule_dia: 'Ohne Akzent ist es ein anderer Laut, manchmal sogar ein anderes Wort.', rule_nasal: 'ą und ę sind eigene Nasallaute und werden nicht als om/en geschrieben.', rule_soft: 'ś/ć/ź sind weich (Zunge vorn), sz/cz/ż hart. Vor Vokal schreibt man si/ci/zi statt ś/ć/ź.', rule_final: 'Am Wortende werden b, d, g, w, z stimmlos gesprochen (chleb klingt wie „chlep“), geschrieben bleibt der Originalbuchstabe.',
      sync: 'Geräte-Abgleich', sync_d: 'Mit einem Konto ist dein Fortschritt auf Handy, Tablet und Laptop gleich. Ohne Konto bleibt alles nur auf diesem Gerät.', sync_email: 'E-Mail', sync_pw: 'Passwort (mind. 8 Zeichen)', sync_login: 'Anmelden', sync_signup: 'Konto anlegen', sync_forgot: 'Passwort vergessen?', sync_as: 'Angemeldet als', sync_now: 'Jetzt abgleichen', sync_last: 'Zuletzt abgeglichen', sync_never: 'noch nicht', sync_busy: 'Gleiche ab …', sync_done: 'Abgeglichen ✓', sync_logout: 'Abmelden', sync_del: 'Meine Daten vom Server löschen', sync_del_q: 'Wirklich löschen? Nochmal tippen', sync_deleted: 'Daten auf dem Server gelöscht. Auf diesem Gerät bleibt alles.', sync_mail_sent: 'Fast fertig: Öffne den Link in der E-Mail. Hast du English Trail als App installiert, melde dich danach in der App selbst an (Ich → Geräte-Abgleich → Anmelden) – dann wird dein Fortschritt aus der App übernommen.', sync_reset_sent: 'Wenn es das Konto gibt, kommt gleich eine E-Mail zum Zurücksetzen.', sync_newpw: 'Neues Passwort', sync_setpw: 'Passwort speichern', sync_pw_saved: 'Neues Passwort gespeichert ✓', sync_shared: 'Ein Konto für alle Apps auf arndt-software.de (z. B. auch GeoQuest).', sync_err_cred: 'E-Mail oder Passwort stimmt nicht.', sync_err_confirm: 'Bitte zuerst den Link in der Bestätigungs-Mail öffnen.', sync_err_exists: 'Für diese E-Mail gibt es schon ein Konto. Bitte anmelden.', sync_err_pw: 'Das Passwort ist zu kurz oder zu einfach.', sync_err_rate: 'Zu viele Versuche. Bitte später nochmal.', sync_err_net: 'Keine Verbindung zum Server. Dein Fortschritt bleibt auf dem Gerät und wird später abgeglichen.', sync_err: 'Das hat nicht geklappt', sync_ob: 'Schon ein Konto? Anmelden und Fortschritt laden', bk_more: 'Ohne Konto: Spielstand als Text übertragen', bk_copy: 'Text kopieren', inst: 'Als App installieren', inst_hint: 'Tipp: Als App installieren', inst_btn: 'Jetzt installieren', inst_d: 'Dann startet English Trail wie eine App vom Startbildschirm, ohne Browserleiste, und läuft offline.', inst_done: 'English Trail läuft schon als App. Gut so!', inst_ios: 'iPhone/iPad: In Safari unten auf das Teilen-Symbol (Viereck mit Pfeil) tippen, dann „Zum Home-Bildschirm“.', inst_other: 'Im Browsermenü (⋮ oder ⋯) „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen. Am Laptop: Symbol rechts in der Adressleiste.', legal: 'Impressum', privacy: 'Datenschutz',
      about: 'Über die App', about_d: 'Lern-Grundlagen: verteilte Wiederholung, aktives Abrufen, Sätze statt Listen, Wochenziel statt Tagesdruck. Läuft offline. Ohne Konto bleibt alles auf diesem Gerät; mit Konto wird dein Fortschritt zusätzlich zwischen deinen Geräten abgeglichen.', to_start: 'Zur Startseite', next_up: 'Als Nächstes', next_station: 'Nächste Station', go_on: 'Weiter', view_city: 'Stadt ansehen', trip_done: 'Du hast alle Städte geschafft. Gratulacje! Wiederholen hilft jetzt, damit alles sitzt.', step_learn: 'Neue Wörter kennenlernen', step_scene: 'Ein echtes Gespräch vor Ort führen', step_quiz: 'Die neuen Wörter festigen', step_build: 'Eigene Sätze bauen', step_boss: 'Die Stadtprüfung – danach geht die Reise weiter', step_ripen: 'Die Wörter von gestern festigen', step_wait: 'Pause bis morgen – dann die Wörter festigen', ripen: 'Festigen', wait: 'Morgen weiter',
      ripe_title: 'Bereit für die Prüfung?', ripe_d: 'Die Prüfung wird frei, wenn ALLE Wörter dieser Stadt an zwei verschiedenen Tagen gesessen haben. Abstand hilft dem Gedächtnis mehr als Tempo.', ripe_learn: 'Noch {n} neue Wörter kennenlernen, dann geht es ans Festigen.', ripe_wait: 'Für heute ist alles gefestigt. Morgen sind die Wörter wieder dran – dann ist die Prüfung frei.', ripe_ok: 'Die Wörter sitzen. Die Prüfung ist frei.', boss_early_q: 'Die Wörter dieser Stadt sitzen noch nicht an zwei Tagen. Prüfung trotzdem jetzt machen?', wb_title: 'Willkommen zurück!', wb_d: 'Schön, dass du wieder da bist. Pausen gehören dazu, nichts ist verloren. Wir frischen kurz 5 Wörter auf, dann geht die Reise weiter.', wb_go: '5 Wörter auffrischen', wb_later: 'Später', cando: 'Das kann ich schon', cando_empty: 'Nach deiner ersten Stadtprüfung steht hier, was du auf Englisch schon kannst.', cando_stats: '{w} Wörter sicher · {s} Gespräche geführt · {c} Städte geschafft', cando_next: 'Als Nächstes lernst du', ob_inp: 'Wie möchtest du antworten?', ob_inp_d: 'Kannst du jederzeit unter „Ich“ ändern. Bei jeder Schreibfrage gibt es außerdem „Lieber: …“.', letter: 'Der Brief', letter_start: 'Rufus, ein Rabe aus dem Tower of London, hat dir einen Brief auf Englisch gebracht. Noch kannst du ihn nicht lesen, aber nach jeder Stadt wird ein Satz lesbar.', letter_d: '{n} von {t} Sätzen kannst du schon lesen.', letter_new: 'Neu im Brief', letter_open: 'Brief lesen', letter_locked: 'lesbar nach {c}', letter_done: 'Du hast den ganzen Brief gelesen.', letter_from: 'Ein Brief aus Edinburgh', mission: 'Mini-Mission', mission_d: 'Freiwillig und im echten Leben. Hak ab, wenn du es gemacht hast.', mission_done: 'Erledigt', mission_ok: 'Mission erledigt', mission_xp: 'Mission erledigt: +15 XP', hear: 'Echtes Englisch hören', hear_d: 'Hör ein paar Minuten das Radio dieser Region. Du musst nicht alles verstehen: Melodie und einzelne Wörter reichen.', hear_more: 'Englisch hören', hear_more_d: 'Echte Stimmen, echtes Tempo. Ausgewählte, frei zugängliche Angebote (externe Seiten).', ext: 'externe Seite', aspect: 'Simple oder Progressive', aspect_d: 'Gewohnheit oder gerade jetzt? I play oder I am playing', aspect_q: 'Welche Form passt?', asp_pf: 'simple (Gewohnheit, Tatsache, Zustand, Abfolge)', asp_ipf: 'progressive (gerade jetzt, im Verlauf, vorübergehend)', rep: 'Fehler melden', rep_ph: 'Was stimmt nicht? (ohne persönliche Daten)', rep_send: 'Senden', rep_thanks: 'Danke! Die Meldung ist angekommen.', rep_fail: 'Senden hat nicht geklappt. Der Text ist kopiert, du kannst ihn per Mail schicken:', rep_empty: 'Bitte kurz beschreiben, was nicht stimmt.', rep_d: 'Ein Wort falsch übersetzt, ein Satz komisch? Sag Bescheid. Gesendet werden nur dein Text, die Übung und die App-Version.', share_boss: 'Ich habe die Stadtprüfung in {c} geschafft ({p} %)! Englisch lernen Stadt für Stadt:', share_lq: 'Ich kann den Brief aus Edinburgh auf Englisch lesen ({p} %)! English Trail:', rec: 'Mich aufnehmen und vergleichen', rec_stop: 'Aufnahme stoppen', offline: 'Offline', net_ok: 'Abgeglichen', net_busy: 'Gleiche ab …', net_err: 'Abgleich gestört', tour_next: 'Weiter', tour_skip: 'Überspringen', tour_done: 'Los geht’s', tour_again: 'Kurze Tour wiederholen', tour1: 'Hier geht deine Reise weiter. Der Knopf führt dich immer zum nächsten sinnvollen Schritt.', tour2: 'Die Karte: 12 Städte, jede mit eigenem Thema. Tippe eine Stadt an, um sie zu öffnen.', tour3: 'Der Brief: Nach jeder Stadt kannst du einen Satz mehr lesen.', tour4: 'Üben: Wiederholung, Tagesrätsel, Zeiten-Werkstatt, unregelmäßige Verben, Spiele – und der Bereich Schule.', tour5: 'Ich: Einstellungen, Geräte-Abgleich und was du schon kannst.', lq: 'Brief selbst lesen', lq_d: 'Jetzt ohne Übersetzung: Lies jeden Satz und beantworte die Frage dazu.', lq_start: 'Verständnisfragen starten', lq_best: 'Bestes Ergebnis', lq_pass: 'Du verstehst Emmas Brief auf Englisch!',
      wd_miss: 'nicht erkannt', wd_hint: '{n} Wort/Wörter nicht erkannt (rot). Hör sie dir langsam an und versuch es noch einmal.', g_title: 'Ich spreche als …', g_d: 'Für Formen wie „byłem / byłam“ (ich war) oder „zmęczony / zmęczona“ (müde). Beide Formen gelten beim Antworten immer als richtig.', g_m: 'Mann (byłem)', g_f: 'Frau (byłam)',
      rv_me: 'Englisch gegenlesen lassen', rv_me_d: 'Kennst du jemanden mit Englisch als Muttersprache? Schick ihr oder ihm den Prüf-Link: Dort lassen sich alle englischen Inhalte Stück für Stück mit ✓ oder ✗ prüfen (komplett auf Englisch). Die Hinweise kommen direkt beim Entwickler an.', rv_me_btn: 'Prüf-Link teilen', rv_me_share: 'Hilfst du mir? Bitte prüf kurz die englischen Sätze dieser Lern-App (Could you help? Please check the English sentences in this app):',
      wr_title: 'Deine Woche', wr_close: 'Schließen', wr_days: 'Lerntage', wr_new: 'neue Wörter', wr_sure: 'neu sicher', wr_more: 'mehr als die Woche davor', wr_less: 'weniger als die Woche davor', wr_goal_ok: 'Wochenziel geschafft – stark!', wr_goal_no: 'Neue Woche, neuer Anfang.', wr_pct: '{p} % deiner Antworten waren richtig.', wr_hard: 'Am kniffligsten', wr_go: 'Diese 3 kurz üben', rem: 'Erinnerung im Kalender', rem_d: 'Keine Push-Nachrichten: Du legst dir selbst einen wiederkehrenden Termin in deinen Kalender. Ändern oder löschen kannst du ihn jederzeit dort.', rem_days: 'Tage', rem_time: 'Uhrzeit', rem_btn: 'Kalender-Termin erstellen', rem_title: 'English Trail – 5 Minuten Englisch', rem_desc: 'Kurz üben, kein Druck. See you!', rem_none: 'Bitte mindestens einen Tag wählen.', dn: 'Mo,Di,Mi,Do,Fr,Sa,So',
      conj: 'Unregelmäßige Verben', conj_d: '71 wichtige Verben: go – went – gone', conj_intro: 'Die meisten englischen Verben bilden die Vergangenheit mit -ed. Die wichtigsten sind aber unregelmäßig – sie folgen vier Mustern. Wer die Muster kennt, lernt schneller.', conj_tense: 'Zeit', conj_pres: '2. Form (simple past)', conj_past: '3. Form (past participle)', conj_mix: 'Gemischt', conj_cls: 'Muster', conj_all: 'Alle', conj_all_d: 'Alle Muster gemischt.', conj_verbs: 'Verben', conj_list: 'Verbliste zum Nachschlagen', conj_q: 'Welche Form passt?', clsn_am: '-am, -asz', clsn_i: '-ę, -isz', clsn_uje: '-uję', clsn_e: '-ę, -esz', clsn_irr: 'unregelmäßig', cls_am: 'Muster -am: ja czytam, ty czytasz, on czyta, my czytamy, wy czytacie, oni czytają.', cls_i: 'Muster -ę/-isz: ja robię, ty robisz, on robi, my robimy, wy robicie, oni robią (nach cz, sz, rz, ż: -ysz, -y).', cls_uje: 'Verben auf -ować: -ow- wird zu -uj-: pracować → pracuję, pracujesz, pracuje … pracują.', cls_e: 'Muster -ę/-esz: ja piszę, ty piszesz, on pisze, my piszemy, wy piszecie, oni piszą. Oft ändert sich der Stamm (pisać → pisz-).', cls_irr: 'Unregelmäßig – einfach auswendig lernen: jestem, jem, wiem, rozumiem …', conj_past_tip: 'Vergangenheit: Stamm + -łem (Mann) / -łam (Frau) für „ich“, -ł (er), -ła (sie), -li (Männer oder gemischt).',
      themes: 'Nach Thema', themes_d: 'Alles zu Arzt, Essen, Amt … gebündelt', themes_intro: 'Dieselben Lektionen wie auf dem Trail, nur nach Alltagsthemen sortiert – zum Beispiel alles, was du für einen Arztbesuch brauchst. Dein Fortschritt zählt in beiden Ansichten.', theme_stats: '{n} Wörter · {s} schon gesehen · {m} sicher', theme_learn: 'Neue Wörter', theme_learn_d: 'Die nächsten 6 Wörter aus diesem Thema', theme_quiz: 'Thema üben', theme_quiz_d: 'Gemischte Runde mit deinen Wörtern aus dem Thema', theme_lessons: 'Lektionen in diesem Thema', theme_note: 'Gesperrte Städte kannst du auf ihrer Seite trotzdem öffnen – die Reihenfolge auf dem Trail bleibt davon unberührt.', pack: 'Themenpaket', open_city: 'Trotzdem öffnen (zum Lernen)', open_city_d: 'Für Themen außer der Reihe: Du kannst hier lernen und üben. Die Stadtprüfung schaltet auf dem Trail nur die nächste Stadt der Reihe frei.', diary: 'Emmas Postkarten', diary_new: 'Neue Postkarte', diary_d: '{n} von {t} Karten lesbar. Jede geschaffte Stadt auf Trail 2 bringt eine neue.', diary_done: 'Alle Postkarten gelesen – wir sehen uns auf der Śnieżka!', diary_start: 'Emma reist dir voraus. Schaffe die erste Stadt auf Trail 2, um ihre erste Karte zu lesen.', diary_open: 'Postkarten lesen', diary_from: 'Postkarten von Ania',
      lazy_fail: 'Dieser Bereich wird beim ersten Öffnen geladen. Bitte einmal mit Internet öffnen – danach geht er auch offline.',
      vc: 'Stimme', vc_pick: 'Englische Stimme', vc_test: 'Stimme testen', vc_d: 'Natürliche oder „verbesserte“ Stimmen klingen deutlich besser. Mehr Stimmen bekommst du in den Einstellungen deines Geräts.', vc_none: 'Auf diesem Gerät ist keine englische Stimme installiert.', vc_none_toast: 'Keine englische Stimme gefunden – Tipp unter Ich → Stimme.', vc_ios: 'iPhone/iPad: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Englisch → z. B. „Daniel (verbessert)“ laden. Danach die App neu öffnen.', vc_and: 'Android: Einstellungen → Bedienungshilfen bzw. System → Sprache → Sprachausgabe → Google-Sprachausgabe → Sprachdaten installieren → Englisch (UK). Danach die App neu öffnen.', vc_pc: 'Windows: Einstellungen → Zeit und Sprache → Sprache → Englisch (Vereinigtes Königreich) hinzufügen (mit Sprachausgabe). Chrome und Edge bringen oft eigene Online-Stimmen mit.',
      chat: 'KI-Gespräch', chat_d: 'Frei auf Englisch schreiben oder sprechen – mit Korrektur', chat_city_d: 'Die Szene dieser Stadt frei weiterspielen', chat_free: 'Freies Gespräch (Café-Smalltalk)', chat_free_sc: 'ein lockeres Gespräch in einem Café in London', chat_sc: 'Situation', chat_lv: 'Niveau', chat_ph: 'Auf Englisch antworten … (Enter = senden)', chat_send: 'Senden', chat_talk: 'Antworten vorlesen', chat_used: 'heute {n} von {l}', chat_new: 'Neu anfangen', chat_better: 'Besser', chat_note: 'Deine Nachrichten gehen über unseren Server an einen KI-Dienst (derzeit Groq, USA) und werden nicht gespeichert. Bitte keine persönlichen Daten eingeben. Die KI kann Fehler machen.', chat_login: 'Das KI-Gespräch gibt es mit Konto (kostenlos, Ich → Geräte-Abgleich) – so bleibt es für alle kostenlos und fair begrenzt.', chat_offline: 'Für das KI-Gespräch brauchst du Internet.', chat_soon: 'Das KI-Gespräch wird gerade eingerichtet und ist bald verfügbar.', chat_limit: 'Für heute sind alle KI-Nachrichten verbraucht. Morgen geht es weiter!', chat_err: 'Die KI antwortet gerade nicht. Bitte gleich noch einmal versuchen.',
      vc_auto: 'Automatisch (empfohlen)', vc_apple: 'Auf iPhone/iPad/Mac: Wähl nur Stimmen, die unter Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Englisch geladen sind – sonst bleibt es stumm.',
      par_title: 'Bericht für Eltern', par_d: 'Ein kurzer Überblick zum Teilen, z. B. per Messenger. Nur Zahlen von diesem Gerät, kein Name.', par_share: 'Bericht teilen', par_h: 'English Trail – Wochenbericht (Klasse {g})', par_week: 'Diese Woche: an {d} von {goal} Tagen geübt · {n} neue Wörter · {r} richtig, {w} falsch', par_words: 'Sicher gelernte Wörter insgesamt: {m}', par_mine: 'Eigene Buch-Vokabeln: {n} in {u} Units', par_exam: 'Beste Probe-Klassenarbeit: {p} % (Note {m})', par_noexam: 'Probe-Klassenarbeit: noch nicht geschrieben', par_hard: 'Knifflige Wörter:', sync_u16: 'Ich bin 16 oder älter – oder meine Eltern sind einverstanden.', sync_u16_need: 'Bitte bestätige zuerst: 16 oder älter oder Einverständnis der Eltern.',
      hw: 'Hausaufgabe per Code', hw_d: 'Deine Lehrkraft oder jemand aus der Klasse hat einen Code geschickt? Eingeben – alle bekommen dieselben Fragen.', hw_go: 'Los', hw_bad: 'Diesen Code kenne ich nicht. Er sieht so aus: HA7-P3-T5', hw_make: 'Als Hausaufgaben-Code teilen', hw_made: 'Code:', hw_share: 'Englisch-Hausaufgabe (Klasse {g}): Code {c} in English Trail unter Schule → Hausaufgabe eingeben.', hw_done: 'Erledigt:', hw_res: 'Ergebnis teilen', hw_res_t: 'Hausaufgabe {c} erledigt: {p} %',
      gd_title: 'Was kann English Trail?', gd_kids: 'Für Kinder', gd_adults: 'Für Eltern & Lehrkräfte', gd_open: 'Alles ansehen', gd_try: 'Ausprobieren', gd_sch_d: 'Alle Spiele, Duelle und Hilfen auf einen Blick.', rep_pick: 'Was ist los? Tippe an (Text ist freiwillig):', rep_c1: 'Übersetzung falsch', rep_c2: 'Tippfehler', rep_c3: 'Aussprache klingt komisch', rep_c4: 'Viel zu schwer', rep_c5: 'Etwas funktioniert nicht', rep_oops: 'Ups, da hat etwas nicht geklappt. Unter „Fehler melden“ kannst du es uns sagen.',
      news: 'Was ist neu', news_new: 'Neu in dieser Version', news_all: 'Alle Neuerungen ansehen', news_ver: 'Version',
      boss_locked: 'Die Prüfung öffnet, wenn alle Wörter gefestigt sind ({r} von {n}).',
      learn_first: 'Lerne zuerst ein paar neue Wörter dieser Stadt kennen.',
      inst_mac: 'Mac mit Safari: Menü Ablage → „Zum Dock hinzufügen“. Mac mit Chrome oder Edge: Installieren-Symbol rechts in der Adressleiste. Danach startet English Trail wie ein eigenes Programm.', sync_err_mail: 'Das Konto konnte gerade nicht angelegt werden: Der Server kann keine Bestätigungs-Mail senden. Bitte später noch einmal versuchen – wir kümmern uns darum.',
      bk_title: 'Dein Fortschritt ist sicher', bk_d_local: 'Die App sichert deinen Stand automatisch auf diesem Gerät (die letzten 7 Tage und vor jedem Update). Zurückholen fügt nur hinzu – es geht nie etwas verloren.', bk_d_acc: 'Dein Stand liegt auf diesem Gerät, in automatischen Sicherungen (7 Tage, vor jedem Update) und zusätzlich auf dem Server. Zurückholen fügt nur hinzu – es geht nie etwas verloren.', bk_acc_tip: 'Tipp: Mit einem kostenlosen Konto ist dein Fortschritt auch sicher, wenn das Handy verloren geht.', bk_now: 'Jetzt', bk_words: 'Wörter', bk_cities: 'Städte geschafft', bk_list: 'Automatische Sicherungen', bk_get: 'Zurückholen', bk_get_d: 'Zurückholen führt die Sicherung mit deinem jetzigen Stand zusammen: Es kommt nur dazu, was fehlt.', bk_file: 'Als Datei speichern', bk_load: 'Datei laden', bk_w_auto: 'automatisch', bk_w_update: 'vor Update', bk_w_reset: 'vor Neustart', bk_w_restore: 'vor Zurückholen', bk_w_sync: 'vor erstem Abgleich', save_full: 'Der Speicher des Browsers ist voll. Bitte „Als Datei speichern“ nutzen oder ein Konto anlegen.', rescue_repaired: 'Dein Spielstand war beschädigt und wurde repariert.', rescue_backup: 'Dein Spielstand fehlte oder war beschädigt – die letzte Sicherung wurde geladen.', rescue_lost: 'Dein Spielstand war beschädigt. Das Original ist aufbewahrt – bitte melde dich über „Problem melden“.',
      beta_d: 'Neu – wird gerade von einer Muttersprachlerin geprüft.', rd_tile: 'Kapitel lesen', rd_tile_d: 'Ein Kapitel aus Emmas Buch, mit Fragen', rd_new: 'Neues Kapitel', rd_card_d: '{n} von {t} Kapiteln gelesen. Jede Stadt auf Trail 3 schaltet ein neues Kapitel frei.', rd_open: 'Kapitel {n} lesen', rd_chapter: 'Kapitel', rd_listen: 'Ganzes Kapitel vorlesen', rd_tr: 'Übersetzung zeigen', rd_hint: 'Tipp: Tippe auf einen Satz – er wird vorgelesen und übersetzt.', rd_q: 'Hast du alles verstanden?', rd_perfect: 'Alles verstanden – super!', rd_ok: 'Gut! Lies die Stelle noch einmal nach.', rd_talk: 'Über das Kapitel sprechen',
      ex_title: 'B1-Probeprüfung', ex_tile_d: 'Fünf Teile wie die echte Prüfung – ohne Stress', ex_start_btn: 'Zur B1-Probeprüfung', ex_intro: 'Wie weit bist du auf dem Weg zu B1? Die Probeprüfung hat fünf Teile wie die staatliche Prüfung – nur kürzer, ohne Zeitdruck und mit Rückmeldung sofort. Jedes Mal kommen andere Aufgaben.', ex_p_listen: 'Hören', ex_p_gram: 'Grammatik', ex_p_read: 'Lesen', ex_p_write: 'Schreiben', ex_p_speak: 'Sprechen', ex_pd_listen: '5 Sätze hören und verstehen', ex_pd_gram: '6 Lücken mit der richtigen Form', ex_pd_read: 'ein kurzer Text mit Fragen', ex_pd_write: 'eine kurze Nachricht oder E-Mail', ex_pd_speak: 'eine Minute frei sprechen', ex_note: 'Bestanden: im Schnitt mindestens 60 % und jeder Teil mindestens 50 %. Dauer etwa 15 Minuten.', ex_passed_once: 'schon bestanden', ex_tries: 'Versuche', ex_go: 'Los geht’s', ex_l_ask: 'Hör zu: Was bedeutet der Satz?', ex_g_ask: 'Welche Form passt in die Lücke?', ex_words: 'Wörter',
      ex_w_len: 'mindestens 30 Wörter', ex_w_hi: 'Anrede (z. B. Hello, Hi, Dear Sir or Madam)', ex_w_ask: 'eine Frage oder Bitte', ex_w_bye: 'Gruß am Ende (z. B. Pozdrawiam)', ex_w_gram: 'Vergangenheit oder Konditional und ein Verbindungswort (bo, ale, że …)', ex_ai_fix: 'Text von der KI korrigieren lassen', ex_ai_login: 'Mit Konto kann die KI deinen Text korrigieren.', ex_ai_sc: 'Bitte korrigiere meinen Text Satz für Satz und erkläre kurz die Fehler.', ex_ai_open: 'Wklej swój tekst, a ja go poprawię.', ex_s_how: 'Sprich laut etwa eine Minute (5–8 Sätze) – allein, mit jemandem oder im KI-Gespräch. Danach schätzt du dich ehrlich ein.', ex_s_ai: 'Mit der KI sprechen', ex_s_rate: 'Wie ist es gelaufen?', ex_s_r1: 'Ich habe eine Minute gesprochen, fast ohne Pausen', ex_s_r2: 'Es ging, mit ein paar Pausen und Lücken', ex_s_r3: 'Schwierig – nur einzelne Sätze',
      ex_result: 'Ergebnis', ex_pass: 'Zdane! Bestanden!', ex_fail: 'Noch nicht ganz – aber du bist auf dem Weg!', ex_pass_d: 'Gratulacje! Das ist eine Probeprüfung der App, kein offizielles Zertifikat – aber ein richtig gutes Zeichen. Probier es ruhig noch einmal mit neuen Aufgaben.', ex_tip_listen: 'Tipp: Hören übst du am besten mit den Szenen und dem Radio-Link der Städte – und mit „Langsam sprechen“ aus.', ex_tip_gram: 'Tipp: Die Grammatik-Lücken kommen aus „Fälle“ und „Aspekt“. Ein paar Runden davon helfen sofort.', ex_tip_read: 'Tipp: Lies die Kapitel aus Emmas Buch zuerst ohne Übersetzung.', ex_tip_write: 'Tipp: Achte auf Anrede, Bitte oder Frage, Gruß – und schreib mindestens 30 Wörter.', ex_tip_speak: 'Tipp: Erledige die Sprech-Missionen der Städte – am besten mit echten Menschen.', ex_disclaimer: 'Hinweis: Die echte staatliche Prüfung (certyfikatpolski.pl) ist länger und anders bewertet.',
      vs_src: 'Stimme der App', vs_dev: 'Gerät', vs_d: 'Die eingebauten Stimmen sind natürliche englische Stimmen (kostenlos, offen lizenziert). Sie sprechen alle Wörter, Sätze, Szenen und Buchkapitel. Ohne Netz oder bei freien Antworten spricht dein Gerät.', vs_on_d: 'Alle Wörter, Sätze, Szenen und Kapitel kommen jetzt von dieser Stimme. Was sie nicht kennt (z. B. KI-Antworten) oder offline noch nicht geladen ist, spricht die Gerätestimme.', vs_test: 'Probehören', vs_dev_more: 'Gerätestimme für alles andere:',
      due_city: 'Fällige Wörter wiederholen', due_none_city: 'In dieser Stadt ist heute kein Wort fällig – morgen wieder.', more_review: 'Fällige Wörter wiederholen', more_pre: 'Schon vorlernen: {c}', more_wait: '{c} ist für heute gefestigt – morgen geht es dort weiter. Bis dahin zählt alles hier auch.', more_title: 'Mehr für heute', more_d: 'Alles hier bringt dich weiter: Fällige Wörter machen Wörter „sicher“, neue Wörter der nächsten Stadt kannst du schon vorlernen – sie festigen sich dann parallel.',
      sure_title: 'Wie sicher sind die Wörter?', sure_ok: 'sicher', sure_build: 'im Aufbau', sure_new: 'neu', sure_tomorrow: 'morgen', sure_next: 'Nächste Wiederholung: {d}. Vorher kannst du gern üben – das hilft dem Gedächtnis, gibt aber noch keinen Punkt.', sure_d: 'Sicher (4 Punkte) wird ein Wort, wenn du es an mehreren Tagen mit wachsendem Abstand richtig weißt: nach 1, 2 und 4 Tagen. Einen Punkt gibt es nur, wenn das Wort dran ist – auch nach bestandener Prüfung. Fällige Wörter aus allen Städten findest du unter „Wiederholen“.',
      sync_keep: 'Dein bisheriger Fortschritt auf diesem Gerät bleibt beim Anmelden erhalten und wird mit dem Konto zusammengeführt – es geht nichts verloren.', sync_merged: 'Angemeldet – dein Fortschritt ist im Konto ({x} XP).', sync_app_hint: 'Hier in Safari ist noch kein Fortschritt. Hast du English Trail als App installiert? Dann öffne die App und melde dich dort unter Ich → Geräte-Abgleich mit derselben E-Mail an – dein Fortschritt aus der App wird übernommen.',
      vc_diag: 'Ton-Test mit Diagnose'
    },
    en: {
      live: 'Live duel', live_tile_d: '2 phones at the same time', live_d: 'Play the same 20 questions at the same time.', live_name: 'Your nickname', live_new: 'Create new duel', live_join: 'Or join a duel', live_join_btn: 'Join', live_privacy: 'No account needed, nothing is stored.', live_offline: 'You need internet for the live duel.', live_connect: 'Connecting …', live_err: 'Could not connect.', live_code: 'Your duel code', live_wait: 'Send the code to your opponent.', live_found: '{n} is here!', live_ver: 'Different app versions – please both reload.', live_ready: "I'm ready", live_wait_ready: 'Waiting for {n} …', live_opp_ready: '{n} is ready!', live_pt_me: 'Point for you!', live_pt_opp: 'Point for {n}', live_pt_none: 'No point', live_ok_wait: 'Correct! Who was faster …', live_wrong: 'Wrong – locked for you.', live_opp_done: '{n} has answered!', live_win: 'You won!', live_lose: '{n} won', live_draw: 'Draw!', live_left: 'Your opponent left.', live_right: '{n} of {t} correct', live_again: 'Rematch (new code)', live_me: 'Me', live_opp: 'Opponent',
      sch_likes: 'What do you like?', sch_likes_d: 'Pick as many topics as you like.', sch_likes_mine: 'Your favourite topics',
      sch_week: 'Weekly class challenge', sch_week_d: 'Everyone in your year gets the same 20 questions this week.', sch_week_go: 'Play challenge', sch_duel: 'Duel on 2 phones',
      d2_src: 'Questions from', d2_src_trail: 'Trail',
      sch_q_listen: 'Listen: what was said?', sch_q_read: 'Read: what does it mean?', sch_q_mediate: 'Mediation: how do you say it in English?', sch_write: 'Writing task', sch_write_d: 'A short text on the topic.', sch_write_task: 'Write a short text (5–8 sentences) about “{t}”.', sch_write_use: 'Use at least 3 of these words', sch_write_check: 'Check text', sch_write_good: 'Great!', sch_write_more: 'Good start – check the open points.', wc_len: 'At least 5 sentences ({n})', wc_words: 'At least 3 key words ({n})', wc_link: 'Linking words ({n})', wc_caps: 'Capital letters and full stops', wc_i: 'Capital I', mw_bulk: 'Add several words', mw_bulk_d: 'One word per line: english = german.', mw_bulk_go: 'Add all', mw_bulk_ok: '{n} words added',
      sch_unit: 'Unit (from your textbook, optional)', sch_unit_go: 'practise', sch_unit_few: 'Add at least 2 words for this unit first.', sch_own_add: 'Add words', sch_mine: 'my words',
      sch: 'School', sch_d: 'English for your state, year and textbook', sch_grade: 'Year {g}', sch_setup: 'Your school', sch_setup_d: 'Choose state, school type and year.', sch_state: 'State', sch_type: 'School type', sch_class: 'Year', sch_book: 'Textbook', sch_book_none: '– no textbook –', sch_book_d: 'Only topics and grammar from the curriculum, no textbook texts.', sch_save: 'Save', sch_soon: 'soon', sch_band: 'Volume', sch_change: 'Change', sch_words: 'Vocabulary for your year', sch_words_d: 'Curriculum topics.', sch_gram: 'Grammar', sch_gram_d: 'New in years {a}/{b}.', sch_gram_all: 'All topics mixed', sch_repeat: 'Revise earlier years', sch_from: 'from year', sch_exam: 'Practice test', sch_exam_d: '20 questions, 15 minutes.', sch_exam_pick: 'What is in the test?', sch_exam_go: 'Start practice test', sch_exam_none: 'Choose at least one topic.', sch_own: 'Words from your textbook', sch_own_d: 'Add your unit words under My words.', sch_chat_d: 'Chat in English up to year {g} level.', why_school: 'School',
      conj_inf: 'Base form', conj_q_past: 'What is the simple past?', conj_q_pp: 'What is the past participle?', clsn_aaa: 'all the same', clsn_aba: '1st = 3rd', clsn_abb: '2nd = 3rd', clsn_abc: 'all different', cls_aaa: 'All three forms are the same: cut – cut – cut.', cls_aba: 'Base form and 3rd form are the same: come – came – come.', cls_abb: '2nd and 3rd form are the same: buy – bought – bought.', cls_abc: 'All three forms are different: go – went – gone.',
      nav_home: 'Home', nav_practice: 'Practice', nav_album: 'Album', nav_me: 'Me',
      level: 'Level', week: 'This week', of: 'of', days: 'days', wk_streak: 'weeks in a row',
      total_days: 'Total study days', mastered: 'Words solid', due: 'due', continue: 'Continue on the Szlak',
      review: 'Review', review_d: 'What your memory is about to forget', daily: 'Daily puzzle', daily_d: '10 questions, fixed for today',
      blitz: 'Blitz 60', blitz_d: 'One minute, as many as you can', cases: 'Case workshop', cases_d: 'The 7 cases through sentences, not tables',
      sounds: 'Sound detective', sounds_d: 'Hear cz, sz, rz, ł, ą … properly', twister: 'Tongue twisters', twister_d: 'Say the classics out loud',
      prices: 'Hear prices', prices_d: 'Understand złoty amounts', duel: 'Family duel', duel_d: '2–4 people, one phone',
      face: 'Face-off', face_d: '2 people, 1 phone: who taps first?', face_rules: 'Lay the phone flat between you – each of you has one half of the screen. Both see the same question. The first correct tap wins the point. A wrong tap locks you out of that question.', face_n: 'Questions', face_fast: 'was faster', face_wrong: 'Wrong – locked', face_point: '+1 point!', face_nobody: 'Nobody knew it', face_win: 'You win!', face_lose: 'Close – you lose', face_quit: 'Quit',
      mistakes: 'Mistake book', mistakes_d: 'Target your stumbling blocks', mywords: 'My words', mywords_d: 'Your own vocabulary, e.g. from your job',
      lex: 'Vocabulary', lex_d: 'Look up every word from your lessons', lex_ph: 'Search: Polish or English', lex_seen: 'Already learnt', lex_all: 'All open cities', lex_count: '{n} words', lex_one: '1 word', lex_none: 'Nothing found.', lex_more: 'Search all open cities', lex_empty: 'No words learnt yet. Start in a city with “New words”.', lex_mic_pl: 'Speak Polish', lex_mic_x: 'Speak English', lex_listen: 'Listening …',
      learn: 'New words', learn_d: 'Hear, see, remember', quiz: 'Quiz', quiz_d: 'Mixed questions', listen: 'Listening', listen_d: 'Only your ears count',
      type: 'Writing', type_d: 'Type it yourself', build: 'Sentence builder', build_d: 'Build sentences from words', cloze: 'Fill the gap', cloze_d: 'Find the missing word',
      match: 'Pairs', match_d: 'Memory against the clock', speak: 'Speaking', speak_d: 'Say it out loud', scene: 'Scene', scene_d: 'A real conversation on location',
      boss: 'City test', boss_d: '12 questions, 3 lives. Unlocks the next city', locked: 'Still locked', test_out: 'Shortcut: take the test now',
      can: 'Afterwards you can', tip: 'In short', words: 'Vocabulary', check: 'Check', next: 'Next', skip: 'Skip', right: 'Correct', wrong: 'Not quite',
      solution: 'Answer', almost_dia: 'Correct, mind the Polish letters', almost_typo: 'Almost, one typo', listen_again: 'Hear again', slow: 'Slow',
      done: 'Done', score: 'Result', xp: 'XP', combo: 'Combo', back: 'Back', home: 'Back to map', again: 'Again', share: 'Copy result', copied: 'Copied',
      postcards: 'Postcards', krasnale: 'Krasnale', krasnal_found: 'You found a krasnal', krasnal_hint: 'Wrocław’s bronze dwarfs hide after practice sessions. Each one brings a new word.',
      postcard_new: 'New postcard', unlocked: 'New city unlocked', passed: 'Passed', failed: 'Not this time. Your mistakes go into your mistake book.',
      accent: 'Pronunciation', accent_gb: 'British', accent_us: 'American', accent_d: 'Used for read-aloud and speech recognition.',
      settings: 'Settings', base_lang: 'I learn Polish via', goal: 'Weekly goal (study days)', len: 'Round length', short: 'Short', medium: 'Medium', long: 'Long',
      hardcore: 'Strict typing (accents count, double XP)', theme: 'Appearance', auto: 'Automatic', light: 'Light', dark: 'Dark',
      backup: 'Back up progress', backup_d: 'Copy this text and paste it on another device.', restore: 'Restore', restored: 'Progress loaded', bad_backup: 'That text isn’t a valid save.',
      reset: 'Reset everything', reset_q: 'Really delete everything? Tap again to confirm.',
      vs_last: 'You vs. you last week', this_w: 'this week', last_w: 'last week',
      fresh: 'New week, fresh start', fresh_d: 'Last week: {a} of {g} study days. This week starts clean.', fresh_ok: 'You hit last week’s goal. Nice.',
      pause_ok: 'A day off breaks nothing here. The week is what counts.',
      no_due: 'Nothing is due right now. We’ll take your weakest words.', empty_mistakes: 'Your mistake book is empty.',
      add: 'Add', pl: 'Polish', meaning: 'Meaning', mywords_empty: 'No words of your own yet. Add vocabulary you actually need.', practice_mine: 'Practise my words', delete: 'Delete',
      d2: 'Duel code (2 phones)', d2_d: 'Each plays on their own phone. Same code = exactly the same 20 questions, whatever your progress.', d2_new: 'Create new code', d2_code: 'Code', d2_bad: 'Invalid code. Example: KOT-472-1', d2_level: 'Level (part of the code)',
      d2_check: 'Check mark', d2_check_d: 'Compare the check mark before you start. Only if both see the same one do you have the same questions – otherwise reload the app on both phones.', d2_send_code: 'Share code', d2_share: 'Share result', d2_time: 'Time',
      d2_paste: 'Paste your opponent’s result here', d2_compare: 'Compare', d2_win: 'You win!', d2_lose: 'Your opponent wins', d2_other_code: 'Different code – that result is not from this duel.', d2_other_check: 'Different check mark – you did not have the same questions. Please reload the app on both phones.', d2_unreadable: 'No result found (e.g. “15/20 · 2:13”).', d2_same: 'Same questions confirmed',
      d2_name: 'Your name (for result and leaderboard)', d2_me: 'Me', d2_pol: 'Dla Polaków (native speakers)', d2_learn: 'Learners', d2_weight: 'Points ×',
      d2_mix: 'Mixed play: your opponent uses the same code with their own level, e.g. KOT-472-1 vs KOT-472-P2. Then you get different questions and correct answers are weighted: level 1 ×1 · 2 ×1.5 · 3 ×2 · P1 ×2 · P2 ×2.5 · P3 ×3.',
      d2_rec: 'Recommended for you', d2_mixed: 'Mixed duel – different questions, weighted points', d2_pts: 'Points', d2_inp_diff: 'Note: you played with different answer modes (W = writing, S = speaking, T = tapping).',
      d2_other_base: 'Different code base – this result does not belong to this duel.',
      rank: 'Leaderboard', rank_d: 'Stored on this phone (included in “Back up progress”). Only results with a valid checksum count, each duel only once. Sorted by wins, then points.',
      rank_empty: 'No duels yet. After a duel-code game, paste your opponent’s result and compare.', rank_g: 'Games', rank_w: 'Wins', rank_d2: 'Draws', rank_pts: 'Points', rank_clear: 'Clear leaderboard', rank_clear_q: 'Really clear the leaderboard?',
      rank_added: 'Added to the leaderboard.', rank_dupe: 'This duel is already on the leaderboard.', rank_unsigned: 'Not added to the leaderboard: the result has no valid checksum (edited or old app version).',
      players: 'Players', start: 'Let’s go', turn: '’s turn', winner: 'wins', tie: 'It’s a tie',
      duel_quiz: 'Word quiz', pm: 'Państwa-Miasta', pm_d: 'Scattergories in Polish', pm_letter: 'Letter', pm_pass: 'Hand the phone to', pm_ready: 'Ready – show the letter',
      pm_done: 'Done', pm_check: 'Review', pm_count: 'Count points', pm_next_round: 'Next round', pm_round: 'Round', pm_examples: 'Possible answers',
      pm_valid: 'counts', pm_invalid: 'doesn’t count', pm_total: 'Total', pm_lookaway: 'Everyone else, please look away.', pm_mode: 'Game',
      pm_rules: 'One Polish word per category for each letter. Unique = 10, shared = 5, only valid answer = 20 points. The group can accept unknown words with a tap. Each game uses 5 random categories.',
      memo_w: 'Word memory', memo_w_d: 'Pairs from all open cities', memo_p: 'Places memory', memo_p_d: 'Match place and description', memo_y: 'Year memory', memo_y_d: 'Match year and event',
      pol: 'Dla Polaków', pol_d: 'Mówisz po polsku? Sprawdź, jak dobrze – ortografia, poprawność, frazeologia i wiedza.',
      pol_intro: 'Strefa dla osób, dla których polski jest językiem ojczystym lub które znają go bardzo dobrze. Wszystko po polsku.',
      pol_lv: 'Twój poziom', pol_lvx: 'jeszcze bez testu', pol_lv0: 'podstawowy', pol_lv1: 'dobry', pol_lv2: 'bardzo dobry', pol_lv3: 'mistrz',
      pol_test: 'Test poziomu', pol_test_d: '18 pytań, po 3 z każdej kategorii – od łatwych do bardzo trudnych.',
      pol_qlv: 'Poziom pytań', pol_mix: 'Mieszanka', pol_mix_d: '10 pytań ze wszystkich kategorii', pol_res_up: 'Gratulacje! Nowy poziom', pol_res: 'Twój wynik testu',
      pol_c_ortografia: 'Ortografia', pol_c_ortografia_d: 'ó/u, rz/ż, ch/h, nie razem czy osobno',
      pol_c_poprawnosc: 'Poprawna polszczyzna', pol_c_poprawnosc_d: 'Typowe błędy: wziąć czy wziąść?',
      pol_c_aspekt: 'Aspekt i czasowniki', pol_c_aspekt_d: 'Dokonany, niedokonany, czasowniki ruchu',
      pol_c_liczebniki: 'Liczebniki', pol_c_liczebniki_d: 'Dwóch, dwie, dwoje – i odmiana',
      pol_c_frazeologia: 'Frazeologia', pol_c_frazeologia_d: 'Idiomy, przysłowia, skrzydlate słowa',
      pol_c_wiedza: 'Wiedza o Polsce', pol_c_wiedza_d: 'Literatura, historia, geografia, kultura',
      inp: 'Answer by', inp_write: 'Typing', inp_speak: 'Speaking', inp_tap: 'Tapping', inp_rather: 'Rather',
      inp_write_d: 'You type the answer yourself – best for learning.', inp_speak_d: 'You say the answer out loud (mic). No mic: say it, reveal, rate yourself.', inp_tap_d: 'You pick the answer from four options – just read, no typing.',
      inp_say: 'Say the answer in Polish', inp_reveal: 'Reveal', inp_ok: 'Said it right', inp_no: 'Got it wrong', inp_selfq: 'Said it out loud? Then reveal and rate yourself honestly.',
      speak_tap: 'Tap the mic and speak', speak_self: 'Say it out loud. How did it go?', speak_good: 'Good', speak_retry: 'Again', you_said: 'Heard',
      no_mic: 'Speech recognition isn’t available here. Say it out loud and rate yourself.',
      tts_missing: 'Your device has no Polish voice. The text stays visible.',
      ob_title: 'Learn Polish, city by city.', ob_sub: 'A journey along the Szlak: 12 cities, real conversations, short rounds. No pressure, no guilt.',
      ob_why: 'Why are you learning?', why_travel: 'Travel', why_family: 'Family & friends', why_work: 'Work', why_curious: 'Curiosity',
      ob_goal: 'How many days a week do you want to practise?', ob_go: 'Off to Warszawa',
      hear: 'What do you hear?', choose_meaning: 'What does it mean?', choose_pl: 'How do you say it in Polish?', type_pl: 'Write it in Polish', build_pl: 'Build the sentence', fill: 'Which word is missing?',
      price_q: 'Which amount?', sound_q: 'How does the marked part sound?', hear_word: 'Which word do you hear?', case_q: 'Which form fits?',
      learned_today: 'You can now say', pairs_left: 'pairs left', time_left: 'seconds',
      week_short: ['Mo','Tu','We','Th','Fr','Sa','Su'], city_progress: 'solid', all_cities: 'All cities',
      diff: 'Difficulty', diff_easy: 'Easy', diff_medium: 'Medium', diff_hard: 'Hard',
      diff_easy_d: 'Lots of choices, accents optional, translations visible.',
      diff_medium_d: 'More listening and writing, dictation, test pass mark 70 %. 1.5× XP.',
      diff_hard_d: 'Write almost everything yourself, 6 options, accents count, translations hidden, test 15 questions / 2 lives / 80 %. Double XP.',
      dictate: 'Write what you hear', translate_pl: 'Translate into Polish', show_tr: 'Show translation',
      skip_q: 'Skip question', skip_city: 'Skip city', skip_city_d: 'Unlocks the next city. The postcard still needs a passed test.',
      skipped_city: 'Skipped', skipped_toast: 'On to', free_roam: 'Free travel: all cities open',
      placement: 'Placement test', placement_d: 'Already know some Polish? 2 questions per city, then you start where it gets tricky.',
      placement_res: 'Your start', placement_all: 'You know all cities. Free travel is on.',
      ob_diff: 'How hard should it be?', ob_place: 'I already know some: placement test',
      nav_land: 'Polska', land: 'Land and people', land_d: 'History, customs, people and places. Every round brings knowledge you need when travelling and talking.',
      facts: 'Poland in numbers', whoami: 'Who am I?', whoami_d: 'Guess famous Poles', tf: 'True or false?', tf_d: 'Customs, everyday life, holidays',
      timeline: 'Timeline', timeline_d: 'Put Polish history in order', pin: 'Where is it?', pin_d: 'Find places on the map',
      hl: 'Higher or lower?', hl_d: 'Compare cities, rivers, mountains', literki: 'Literki', literki_d: 'Letter salad: find the Polish word',
      t_true: 'True', t_false: 'False', more_clue: 'Another clue', clue: 'Clue', tap_order: 'Tap the events, oldest first',
      tap_map: 'Tap the map', km_off: 'km off', letters_q: 'Which word is hidden here?', order_q: 'Order',
      survival: 'Survival', survival_d: 'A few seconds per question, 3 lives, see how far you get', best: 'Record',
      j_5050: '50:50', j_freeze: '+10 s', j_hint: 'Hint', jokers: 'Jokers', jokers_d: 'Every Monday you get 3 of each again. 50:50 removes two wrong answers, Hint shows the first letters, +10 s stops the clock.',
      sec: 'sec',
      spell: 'Spelling', spell_d: 'ó or u? rz or ż? Find the correct spelling', spell_q: 'Which spelling is correct?',
      rule_ou: 'ó and u sound the same. You have to remember the spelling.', rule_rz: 'rz and ż sound the same. Tip: if related words have an r (morze → morski), write rz.',
      rule_ch: 'ch and h sound the same today. ch is much more common; h appears mostly in loanwords (herbata, hotel).', rule_dia: 'Without the accent it is a different sound, sometimes even a different word.', rule_nasal: 'ą and ę are nasal vowels of their own and are not written om/en.', rule_soft: 'ś/ć/ź are soft (tongue forward), sz/cz/ż hard. Before a vowel you write si/ci/zi instead of ś/ć/ź.', rule_final: 'At the end of a word b, d, g, w, z are pronounced voiceless (chleb sounds like "chlep"), but the spelling keeps the original letter.',
      sync: 'Device sync', sync_d: 'With an account your progress is the same on phone, tablet and laptop. Without one, everything stays on this device only.', sync_email: 'Email', sync_pw: 'Password (min. 8 characters)', sync_login: 'Sign in', sync_signup: 'Create account', sync_forgot: 'Forgot password?', sync_as: 'Signed in as', sync_now: 'Sync now', sync_last: 'Last synced', sync_never: 'not yet', sync_busy: 'Syncing …', sync_done: 'Synced ✓', sync_logout: 'Sign out', sync_del: 'Delete my data from the server', sync_del_q: 'Really delete? Tap again', sync_deleted: 'Server data deleted. Everything stays on this device.', sync_mail_sent: 'Almost done: open the link in the email. If you installed English Trail as an app, then sign in inside the app itself (Me → Device sync → Sign in) – your progress from the app will be taken over.', sync_reset_sent: 'If the account exists, a reset email is on its way.', sync_newpw: 'New password', sync_setpw: 'Save password', sync_pw_saved: 'New password saved ✓', sync_shared: 'One account for all apps on arndt-software.de (e.g. GeoQuest too).', sync_err_cred: 'Email or password is wrong.', sync_err_confirm: 'Please open the link in the confirmation email first.', sync_err_exists: 'This email already has an account. Please sign in.', sync_err_pw: 'The password is too short or too simple.', sync_err_rate: 'Too many attempts. Please try again later.', sync_err_net: 'No connection to the server. Your progress stays on this device and will sync later.', sync_err: 'That did not work', sync_ob: 'Already have an account? Sign in and load progress', bk_more: 'Without an account: transfer progress as text', bk_copy: 'Copy text', inst: 'Install as app', inst_hint: 'Tip: install as an app', inst_btn: 'Install now', inst_d: 'English Trail then starts like an app from your home screen, without the browser bar, and works offline.', inst_done: 'English Trail is already running as an app. Nice!', inst_ios: 'iPhone/iPad: in Safari tap the Share icon (square with arrow), then “Add to Home Screen”.', inst_other: 'In the browser menu (⋮ or ⋯) choose “Install app” or “Add to Home screen”. On a laptop: icon on the right of the address bar.', legal: 'Legal notice', privacy: 'Privacy',
      about: 'About', about_d: 'Built on spaced repetition, active recall, sentences instead of lists, and a weekly goal instead of daily pressure. Works offline. Without an account everything stays on this device; with an account your progress is also synced between your devices.', to_start: 'Go to home screen', next_up: 'Up next', next_station: 'Next stop', go_on: 'Continue', view_city: 'View city', trip_done: 'You have completed every city. Gratulacje! Reviewing now helps everything stick.', step_learn: 'Get to know new words', step_scene: 'Have a real conversation on location', step_quiz: 'Practise the new words', step_build: 'Build your own sentences', step_boss: 'The city test – then the journey goes on', step_ripen: "Reinforce yesterday's words", step_wait: 'Pause until tomorrow – then reinforce the words', ripen: 'Reinforce', wait: 'Tomorrow',
      ripe_title: 'Ready for the test?', ripe_d: 'The test opens once ALL words of this city have stuck on two different days. Spacing helps memory more than speed.', ripe_learn: '{n} more new words to meet, then it is time to reinforce.', ripe_wait: 'All done for today. Tomorrow the words come back – then the test opens.', ripe_ok: 'The words have stuck. The test is open.', boss_early_q: "This city's words have not stuck on two days yet. Take the test now anyway?", wb_title: 'Welcome back!', wb_d: 'Great to see you again. Breaks are part of it, nothing is lost. Let us refresh 5 words, then the journey continues.', wb_go: 'Refresh 5 words', wb_later: 'Later', cando: 'What I can already do', cando_empty: 'After your first city test, this shows what you can already do in Polish.', cando_stats: '{w} words mastered · {s} conversations · {c} cities done', cando_next: 'Next you will learn', ob_inp: 'How would you like to answer?', ob_inp_d: 'You can change this any time under “Me”. Every typing question also offers “Rather: …”.', letter: 'The letter', letter_start: 'Szymek, a Krasnal from Wrocław, has brought you a letter in Polish. You can’t read it yet, but after every city one more sentence becomes readable.', letter_d: 'You can already read {n} of {t} sentences.', letter_new: 'New in the letter', letter_open: 'Read the letter', letter_locked: 'readable after {c}', letter_done: 'You have read the whole letter.', letter_from: 'A letter from Wrocław', mission: 'Mini mission', mission_d: 'Optional, in real life. Tick it off when you have done it.', mission_done: 'Done', mission_ok: 'Mission done', mission_xp: 'Mission done: +15 XP', hear: 'Hear real Polish', hear_d: 'Listen to this region\'s radio for a few minutes. You don\'t have to understand everything: the melody and a few words are enough.', hear_more: 'Listen to Polish', hear_more_d: 'Real voices, real speed. Selected, freely available resources (external sites).', ext: 'external site', aspect: 'Verb aspect', aspect_d: 'Perfective or imperfective? piję or wypiję', aspect_q: 'Which form fits?', asp_pf: 'perfective (result, once, finished)', asp_ipf: 'imperfective (in progress, duration, habit)', rep: 'Report a mistake', rep_ph: 'What is wrong? (no personal data)', rep_send: 'Send', rep_thanks: 'Thank you! Your report has arrived.', rep_fail: 'Sending failed. The text has been copied, you can send it by email:', rep_empty: 'Please describe briefly what is wrong.', rep_d: 'A word translated wrongly, an odd sentence? Let us know. Only your text, the exercise and the app version are sent.', share_boss: 'I passed the city test in {c} ({p}%)! Learn Polish city by city:', share_lq: 'I can read the letter from Wrocław in Polish ({p}%)! English Trail:', rec: 'Record myself and compare', rec_stop: 'Stop recording', offline: 'Offline', net_ok: 'Synced', net_busy: 'Syncing …', net_err: 'Sync problem', tour_next: 'Next', tour_skip: 'Skip', tour_done: 'Let’s go', tour_again: 'Repeat the short tour', tour1: 'Your journey continues here. This button always takes you to the next sensible step.', tour2: 'The map: 12 cities, each with its own topic. Tap a city to open it.', tour3: 'The letter: after every city you can read one more sentence.', tour4: 'Practice: review, daily puzzle, cases, verb aspect and games.', tour5: 'Me: settings, device sync and what you can already do.', lq: 'Read the letter yourself', lq_d: 'Now without translation: read each sentence and answer the question.', lq_start: 'Start the questions', lq_best: 'Best result', lq_pass: 'You understand Ania\'s letter in Polish!',
      wd_miss: 'not recognised', wd_hint: '{n} word(s) not recognised (red). Listen to them slowly and try again.', g_title: 'I speak as …', g_d: 'For forms like “byłem / byłam” (I was) or “zmęczony / zmęczona” (tired). Both forms are always accepted as answers.', g_m: 'man (byłem)', g_f: 'woman (byłam)',
      rv_me: 'Have the Polish checked', rv_me_d: 'Do you know a native Polish speaker? Send them the review link: they can check all Polish content piece by piece with ✓ or ✗ (entirely in Polish). Their notes go straight to the developer.', rv_me_btn: 'Share review link', rv_me_share: 'Can you help me? Please check the Polish sentences in this learning app (Pomożesz? Sprawdź proszę polskie zdania w tej aplikacji):',
      wr_title: 'Your week', wr_close: 'Close', wr_days: 'learning days', wr_new: 'new words', wr_sure: 'newly solid', wr_more: 'more than the week before', wr_less: 'less than the week before', wr_goal_ok: 'Weekly goal reached – great!', wr_goal_no: 'New week, fresh start.', wr_pct: '{p}% of your answers were correct.', wr_hard: 'Trickiest', wr_go: 'Practise these 3', rem: 'Calendar reminder', rem_d: 'No push notifications: you add a recurring event to your own calendar. Change or delete it there any time.', rem_days: 'Days', rem_time: 'Time', rem_btn: 'Create calendar event', rem_title: 'English Trail – 5 minutes of Polish', rem_desc: 'Quick practice, no pressure. Do zobaczenia!', rem_none: 'Please choose at least one day.', dn: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
      conj: 'Conjugation', conj_d: '40 key verbs: present and past', conj_intro: 'Polish verbs change their ending for each person. Most follow a few patterns (verb classes). Once you know them, you can form new verbs too.', conj_tense: 'Tense', conj_pres: 'Present', conj_past: 'Past', conj_mix: 'Mixed', conj_cls: 'Verb class', conj_all: 'All', conj_all_d: 'All verb classes mixed.', conj_verbs: 'verbs', conj_list: 'Verb tables for reference', conj_q: 'Which form fits?', clsn_am: '-am, -asz', clsn_i: '-ę, -isz', clsn_uje: '-uję', clsn_e: '-ę, -esz', clsn_irr: 'irregular', cls_am: 'Pattern -am: ja czytam, ty czytasz, on czyta, my czytamy, wy czytacie, oni czytają.', cls_i: 'Pattern -ę/-isz: ja robię, ty robisz, on robi, my robimy, wy robicie, oni robią (after cz, sz, rz, ż: -ysz, -y).', cls_uje: 'Verbs in -ować: -ow- becomes -uj-: pracować → pracuję, pracujesz, pracuje … pracują.', cls_e: 'Pattern -ę/-esz: ja piszę, ty piszesz, on pisze, my piszemy, wy piszecie, oni piszą. The stem often changes (pisać → pisz-).', cls_irr: 'Irregular – just learn them by heart: jestem, jem, wiem, rozumiem …', conj_past_tip: 'Past tense: stem + -łem (man) / -łam (woman) for “I”, -ł (he), -ła (she), -li (men or mixed group).',
      themes: 'By topic', themes_d: 'Everything for the doctor, food, offices … bundled', themes_intro: 'The same lessons as on the Szlak, sorted by everyday topic – for example everything you need for a visit to the doctor. Your progress counts in both views.', theme_stats: '{n} words · {s} seen · {m} solid', theme_learn: 'New words', theme_learn_d: 'The next 6 words from this topic', theme_quiz: 'Practise topic', theme_quiz_d: 'Mixed round with your words from this topic', theme_lessons: 'Lessons in this topic', theme_note: 'You can still open locked cities on their page – the order on the Szlak stays the same.', pack: 'Topic pack', open_city: 'Open anyway (to learn)', open_city_d: 'For topics out of order: you can learn and practise here. On the Szlak the city test only unlocks the next city in line.', diary: 'Ania’s postcards', diary_new: 'New postcard', diary_d: '{n} of {t} cards readable. Every city you complete on Szlak 2 brings a new one.', diary_done: 'All postcards read – see you on Śnieżka!', diary_start: 'Ania is travelling ahead of you. Complete the first city on Szlak 2 to read her first card.', diary_open: 'Read postcards', diary_from: 'Postcards from Ania',
      lazy_fail: 'This section is loaded the first time you open it. Please open it once while online – after that it works offline too.',
      vc: 'Voice', vc_pick: 'Polish voice', vc_test: 'Test voice', vc_d: 'Natural or “enhanced” voices sound much better. You can add more voices in your device settings.', vc_none: 'No Polish voice is installed on this device.', vc_none_toast: 'No Polish voice found – see Me → Voice for a tip.', vc_ios: 'iPhone/iPad: Settings → Accessibility → Spoken Content → Voices → Polish → download “Zosia (Enhanced)”. Then reopen the app.', vc_and: 'Android: Settings → Accessibility or System → Language → Text-to-speech → Google Speech Services → Install voice data → Polish. Then reopen the app.', vc_pc: 'Windows: Settings → Time & language → Language → add Polish (with text-to-speech). Chrome and Edge often include their own online voices.',
      chat: 'AI conversation', chat_d: 'Write or speak freely in Polish – with corrections', chat_city_d: 'Continue this city’s scene freely', chat_free: 'Free conversation (café small talk)', chat_free_sc: 'a relaxed conversation in a café in Poland', chat_sc: 'Situation', chat_lv: 'Level', chat_ph: 'Answer in Polish … (Enter = send)', chat_send: 'Send', chat_talk: 'Read replies aloud', chat_used: 'today {n} of {l}', chat_new: 'Start over', chat_better: 'Better', chat_note: 'Your messages go via our server to an AI service (currently Groq, USA) and are not stored. Please don’t enter personal data. The AI can make mistakes.', chat_login: 'The AI conversation needs an account (free, Me → Device sync) – that keeps it free and fairly limited for everyone.', chat_offline: 'You need internet for the AI conversation.', chat_soon: 'The AI conversation is being set up and will be available soon.', chat_limit: 'You’ve used all AI messages for today. See you tomorrow!', chat_err: 'The AI isn’t answering right now. Please try again in a moment.',
      vc_auto: 'Automatic (recommended)', vc_apple: 'On iPhone/iPad/Mac: only pick voices downloaded under Settings → Accessibility → Spoken Content → Voices → Polish – otherwise there is no sound.',
      par_title: 'Report for parents', par_d: 'A short overview to share, e.g. by messenger. Only numbers from this device, no name.', par_share: 'Share report', par_h: 'English Trail – weekly report (year {g})', par_week: 'This week: practised on {d} of {goal} days · {n} new words · {r} right, {w} wrong', par_words: 'Words learned for sure in total: {m}', par_mine: 'Own textbook words: {n} in {u} units', par_exam: 'Best practice test: {p} % (mark {m})', par_noexam: 'Practice test: not taken yet', par_hard: 'Tricky words:', sync_u16: 'I am 16 or older – or my parents agree.', sync_u16_need: 'Please confirm first: 16 or older, or your parents agree.',
      hw: 'Homework by code', hw_d: 'Got a code from your teacher or a classmate? Enter it – everyone gets the same questions.', hw_go: 'Go', hw_bad: 'I do not know this code. It looks like this: HA7-P3-T5', hw_make: 'Share as homework code', hw_made: 'Code:', hw_share: 'English homework (year {g}): enter code {c} in English Trail under School → Homework.', hw_done: 'Done:', hw_res: 'Share result', hw_res_t: 'Homework {c} done: {p} %',
      gd_title: 'What can English Trail do?', gd_kids: 'For kids', gd_adults: 'For parents & teachers', gd_open: 'See everything', gd_try: 'Try it', gd_sch_d: 'All games, duels and helpers at a glance.', rep_pick: 'What is wrong? Tap one (text is optional):', rep_c1: 'Wrong translation', rep_c2: 'Typo', rep_c3: 'Pronunciation sounds odd', rep_c4: 'Far too hard', rep_c5: 'Something does not work', rep_oops: 'Oops, something went wrong. Use “Report a mistake” to tell us.',
      news: 'What’s new', news_new: 'New in this version', news_all: 'See all updates', news_ver: 'Version',
      boss_locked: 'The test opens once all words are consolidated ({r} of {n}).',
      learn_first: 'First get to know a few new words of this city.',
      inst_mac: 'Mac with Safari: File menu → “Add to Dock”. Mac with Chrome or Edge: install icon on the right of the address bar. English Trail then starts like its own app.', sync_err_mail: 'The account couldn’t be created right now: the server can’t send the confirmation email. Please try again later – we’re on it.',
      bk_title: 'Your progress is safe', bk_d_local: 'The app backs up your progress automatically on this device (the last 7 days and before every update). Restoring only adds – nothing is ever lost.', bk_d_acc: 'Your progress is on this device, in automatic backups (7 days, before every update) and also on the server. Restoring only adds – nothing is ever lost.', bk_acc_tip: 'Tip: with a free account your progress is safe even if you lose your phone.', bk_now: 'Now', bk_words: 'words', bk_cities: 'cities done', bk_list: 'Automatic backups', bk_get: 'Restore', bk_get_d: 'Restoring merges the backup with your current progress: only what is missing is added.', bk_file: 'Save as file', bk_load: 'Load file', bk_w_auto: 'automatic', bk_w_update: 'before update', bk_w_reset: 'before reset', bk_w_restore: 'before restore', bk_w_sync: 'before first sync', save_full: 'The browser storage is full. Please use “Save as file” or create an account.', rescue_repaired: 'Your save was damaged and has been repaired.', rescue_backup: 'Your save was missing or damaged – the latest backup was loaded.', rescue_lost: 'Your save was damaged. The original has been kept – please use “Report a problem”.',
      beta_d: 'New – currently being checked by a native speaker.', rd_tile: 'Read a chapter', rd_tile_d: 'A chapter of Ania’s book, with questions', rd_new: 'New chapter', rd_card_d: '{n} of {t} chapters read. Every town on Szlak 3 unlocks a new chapter.', rd_open: 'Read chapter {n}', rd_chapter: 'Chapter', rd_listen: 'Read the whole chapter aloud', rd_tr: 'Show translation', rd_hint: 'Tip: tap a sentence – it is read aloud and translated.', rd_q: 'Did you understand everything?', rd_perfect: 'You understood everything – great!', rd_ok: 'Good! Have another look at that part.', rd_talk: 'Talk about the chapter',
      ex_title: 'B1 practice exam', ex_tile_d: 'Five parts like the real exam – without the stress', ex_start_btn: 'Go to the B1 practice exam', ex_intro: 'How far along are you on the way to B1? The practice exam has five parts like the state exam – just shorter, with no time pressure and instant feedback. You get different tasks every time.', ex_p_listen: 'Listening', ex_p_gram: 'Grammar', ex_p_read: 'Reading', ex_p_write: 'Writing', ex_p_speak: 'Speaking', ex_pd_listen: 'hear and understand 5 sentences', ex_pd_gram: '6 gaps with the right form', ex_pd_read: 'a short text with questions', ex_pd_write: 'a short message or email', ex_pd_speak: 'speak freely for a minute', ex_note: 'Pass: at least 60 % on average and at least 50 % in every part. Takes about 15 minutes.', ex_passed_once: 'already passed', ex_tries: 'attempts', ex_go: 'Let’s go', ex_l_ask: 'Listen: what does the sentence mean?', ex_g_ask: 'Which form fits the gap?', ex_words: 'words',
      ex_w_len: 'at least 30 words', ex_w_hi: 'a greeting (e.g. Dzień dobry, Cześć, Szanowni Państwo)', ex_w_ask: 'a question or request', ex_w_bye: 'a closing (e.g. Pozdrawiam)', ex_w_gram: 'past tense or conditional plus a linking word (bo, ale, że …)', ex_ai_fix: 'Have the AI correct your text', ex_ai_login: 'With an account, the AI can correct your text.', ex_ai_sc: 'Please correct my text sentence by sentence and briefly explain the mistakes.', ex_ai_open: 'Wklej swój tekst, a ja go poprawię.', ex_s_how: 'Speak out loud for about a minute (5–8 sentences) – on your own, with someone or in the AI conversation. Then rate yourself honestly.', ex_s_ai: 'Talk to the AI', ex_s_rate: 'How did it go?', ex_s_r1: 'I spoke for a minute, almost without pauses', ex_s_r2: 'It went OK, with a few pauses and gaps', ex_s_r3: 'Difficult – only single sentences',
      ex_result: 'Result', ex_pass: 'Zdane! Passed!', ex_fail: 'Not quite yet – but you’re on your way!', ex_pass_d: 'Gratulacje! This is the app’s practice exam, not an official certificate – but a really good sign. Feel free to try again with new tasks.', ex_tip_listen: 'Tip: practise listening with the scenes and each town’s radio link – and with “Speak slowly” switched off.', ex_tip_gram: 'Tip: the grammar gaps come from “Cases” and “Aspect”. A few rounds of those help straight away.', ex_tip_read: 'Tip: read the chapters of Ania’s book without the translation first.', ex_tip_write: 'Tip: remember the greeting, a request or question, a closing – and write at least 30 words.', ex_tip_speak: 'Tip: do the towns’ speaking missions – ideally with real people.', ex_disclaimer: 'Note: the real state exam (certyfikatpolski.pl) is longer and marked differently.',
      vs_src: 'App voice', vs_dev: 'Device', vs_d: 'Gosia and Darek are natural Polish voices (free, openly licensed). They speak all words, sentences, scenes and book chapters. Offline or for free answers, your device speaks.', vs_on_d: 'All words, sentences, scenes and chapters now come from this voice. Anything it doesn’t know (e.g. AI replies) or hasn’t loaded offline is spoken by the device voice.', vs_test: 'Listen', vs_dev_more: 'Device voice for everything else:',
      due_city: 'Review due words', due_none_city: 'No words are due in this city today – back tomorrow.', more_review: 'Review due words', more_pre: 'Get a head start: {c}', more_wait: '{c} is consolidated for today – it continues there tomorrow. Until then, everything here counts too.', more_title: 'More for today', more_d: 'Everything here moves you forward: due words make words “solid”, and you can already learn the next city’s new words – they consolidate in parallel.',
      sure_title: 'How solid are the words?', sure_ok: 'solid', sure_build: 'building', sure_new: 'new', sure_tomorrow: 'tomorrow', sure_next: 'Next review: {d}. Feel free to practise before then – it helps your memory but doesn’t give a point yet.', sure_d: 'A word becomes solid (4 points) when you know it on several days with growing gaps: after 1, 2 and 4 days. You only get a point when the word is due – even after passing the test. Due words from all cities are under “Review”.',
      sync_keep: 'Your existing progress on this device is kept when you sign in and merged with the account – nothing is lost.', sync_merged: 'Signed in – your progress is in your account ({x} XP).', sync_app_hint: 'There is no progress in Safari yet. Did you install English Trail as an app? Then open the app and sign in there under Me → Device sync with the same email – your progress from the app will be taken over.',
      vc_diag: 'Sound test with diagnostics'
    }
  };

  /* ---------- Zustand ---------- */
  function fresh() {
    return { app: 'english-trail', v: 1, base: 'de', accent: 'gb', school: null, onboarded: false, why: '', goal: 4, len: 10,
      xp: 0, cards: {}, active: {}, unlocked: 0, boss: {}, scenes: {}, krasnale: [], mistakes: [], custom: [], weekXp: {}, hardcore: false, slow: false,
      theme: 'auto', instHint: false, ts: 0, daily: {}, seenWeek: '', diff: 'easy', free: false, skipped: {}, jokers: { five0: 3, freeze: 3, hint: 3 }, jokerWeek: '', best: {}, input: 'write', plv: null, plBest: {}, name: '', gender: '', rank: {}, rankSeen: [], done: {}, welcomeDay: '', missions: {}, tour: false, letterQuiz: 0, wlog: {}, wrSeen: '', seenVer: '', rem: { days: ['MO', 'WE', 'FR'], time: '19:00' }, voice: '', vsrc: '', read: {}, exam: {} }; /* PATCH002 PATCH004 */
  }
  var BAK_KEY = 'english_trail_bak', RESCUE_KEY = 'english_trail_rescue', RESCUE = '', saveFailed = false;
  var S = load();
  /* English Trail: Basissprache immer Deutsch; Aussprache britisch/amerikanisch; Sprecherform gibt es im Englischen nicht */
  S.base = 'de'; if (S.accent !== 'us') S.accent = 'gb'; if (!S.gender) S.gender = 'm';
  loadData();
  fixUnlock();
  try { pickVoice(); } catch (e) {}
  /* 3.2 Sicherung: Ein beschädigter oder fehlender Stand wird NIE stillschweigend durch einen leeren ersetzt.
     Reihenfolge: gespeicherter Stand → reparierter Stand → beste lokale Sicherung. Das Original bleibt unter RESCUE_KEY liegen. */
  function getBaks() { try { var l = JSON.parse(localStorage.getItem(BAK_KEY) || '[]'); return Array.isArray(l) ? l.filter(function (b) { return b && b.d && C.validateSave(b.d); }) : []; } catch (e) { return []; } }
  function putBaks(l) { try { localStorage.setItem(BAK_KEY, JSON.stringify(l)); return true; } catch (e) { return false; } }
  function bestBackup() { var b = null; getBaks().forEach(function (x) { if (!b || C.saveWeight(x.d) > C.saveWeight(b)) b = x.d; }); return b; }
  function hasProgress(o) { return !!(o && (o.xp > 0 || Object.keys(o.cards || {}).length)); }
  function backup(why) {
    if (!hasProgress(S)) return;
    var l = C.addBackup(getBaks(), S, why, Date.now(), today());
    if (!putBaks(l)) putBaks(l.slice(0, 3));
  }
  function load() {
    var raw = null; try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (raw) {
      var o = null; try { o = JSON.parse(raw); } catch (e) {}
      if (o && C.validateSave(o)) return Object.assign(fresh(), o);
      try { if (!localStorage.getItem(RESCUE_KEY)) localStorage.setItem(RESCUE_KEY, raw); } catch (e) {}
      var r = C.repairSave(o), b = bestBackup();
      if (r && (!b || C.saveWeight(r) >= C.saveWeight(b))) { RESCUE = 'repaired'; return Object.assign(fresh(), r); }
      if (b) { RESCUE = 'backup'; return Object.assign(fresh(), r ? C.mergeSave(r, b) : b); }
      RESCUE = 'lost';
    } else { var b2 = bestBackup(); if (b2) { RESCUE = 'backup'; return Object.assign(fresh(), b2); } }
    try { var h = window.claude && window.claude.hot && window.claude.hot.data; if (h && C.validateSave(h)) return Object.assign(fresh(), h); } catch (e) {}
    return fresh();
  }
  function saveLocal() {
    var txt = JSON.stringify(S);
    try { localStorage.setItem(KEY, txt); saveFailed = false; return; } catch (e) {}
    /* Speicher voll: zuerst ältere Sicherungen kürzen, dann nochmal – der aktuelle Stand geht vor */
    putBaks(getBaks().slice(0, 2));
    try { localStorage.setItem(KEY, txt); saveFailed = false; return; } catch (e) {}
    try { localStorage.removeItem(BAK_KEY); localStorage.setItem(KEY, txt); saveFailed = false; return; } catch (e) {}
    if (!saveFailed) { saveFailed = true; try { toast(t('save_full')); } catch (e2) {} }
  }
  function save() { S.ts = Date.now(); saveLocal(); syncSoon(); }
  try { if (window.claude && window.claude.hot) window.claude.hot.snapshot(function () { return S; }); } catch (e) {}

  function diff() { return C.diffCfg(S.diff); }
  /* 3.0: Route = Szlak 1 (r fehlt/1) + Szlak 2 (r = 2), danach Themenpakete (pack = 1, immer offen, nicht auf der Karte) */
  function isPack(i) { return !!(U[i] && U[i].pack); }
  function routeIdx() { var a = []; for (var i = 0; i < U.length; i++) if (!U[i].pack) a.push(i); return a; }
  function lastRoute() { return routeIdx().length - 1; }
  function szlakOf(i) { return (U[i] && U[i].r) || 1; }
  function szlakUnits(r) { return routeIdx().filter(function (i) { return szlakOf(i) === r; }); }
  function isOpen(i) { return S.free || i <= S.unlocked || isPack(i) || !!(S.opened && U[i] && S.opened[U[i].id]); }
  /* Wer alle Städte bis zur Grenze geschafft hat (z. B. vor 3.0 ganz Szlak 1), bekommt die nächste Stadt frei */
  function fixUnlock() { var lr = lastRoute(); while (S.unlocked < lr && U[S.unlocked] && (S.boss[U[S.unlocked].id] || S.skipped[U[S.unlocked].id])) S.unlocked++; }
  /* Dla Polaków: Spieloberfläche komplett Polnisch (polUI an, solange man im Bereich ist) */
  var polUI = false, PLX = { again: 'Jeszcze raz', back: 'Wróć', best: 'Rekord', combo: 'Seria', done: 'Koniec', failed: 'Tym razem się nie udało.', home: 'Wróć', next: 'Dalej', passed: 'Zaliczone', right: 'Dobrze', score: 'Wynik', skip: 'Pomiń', skip_q: 'Pomiń pytanie', solution: 'Odpowiedź', wrong: 'Niestety nie', check: 'Sprawdź', share: 'Kopiuj wynik', copied: 'Skopiowano', start: 'Start', j_hint: 'Podpowiedź', jokers_d: 'Co poniedziałek znowu po 3 sztuki. 50:50 usuwa dwie złe odpowiedzi, +10 s zatrzymuje zegar.' };
  function t(k) { if (polUI && PLX[k] != null) return PLX[k]; var v = TX[S.base][k]; return v == null ? k : v; }
  function L(pair) { return S.base === 'en' ? pair[1] : pair[0]; }
  /* Emojis für Klasse 5/6 (H): als Bildhilfe bei Lernkarten und wenn das deutsche Wort gezeigt wird – nie, wenn das Bild die Lösung verraten würde */
  function emOf(q) {
    if (!q || !q.id || q.hideText || typeof q.id !== 'string') return '';
    var p = q.id.split(':'), ui = -1; for (var i = 0; i < U.length; i++) if (U[i].id === p[0]) { ui = i; break; }
    var u = U[ui]; if (!u || !u.em) return '';
    var e = u.em[+p[1]] || '', w = u.words[+p[1]]; if (!e || !w) return '';
    return q.type === 'card' || q.big !== w[0] ? e : '';
  }
  function meaning(w) { return S.base === 'en' ? w[2] : w[1]; }
  function cityName(u) { return S.base === 'en' ? u.cityEn : u.cityDe; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { return C.dayKey(new Date()); }
  function applyTheme() { if (S.theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', S.theme); document.documentElement.lang = S.base; }

  /* ---------- Karten / Wörter ---------- */
  function allWords() {
    var out = [];
    U.forEach(function (u, ui) { u.words.forEach(function (w, i) { out.push({ id: u.id + ':' + i, w: w, u: ui }); }); });
    S.custom.forEach(function (w, i) { out.push({ id: 'my:' + i, w: w, u: -1 }); });
    return out;
  }
  function wordsOf(ui) { return U[ui].words.map(function (w, i) { return { id: U[ui].id + ':' + i, w: w, u: ui }; }); }
  function byId(id) { var a = allWords(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
  function masteredCount(list) { return (list || allWords()).filter(function (x) { var c = S.cards[x.id]; return c && c.box >= C.MASTERED_BOX; }).length; }
  function dueList() { var d = today(); return allWords().filter(function (x) { return C.isDue(S.cards[x.id], d); }); }
  function packStarted(i) { return U[i].words.some(function (w, k) { return !!S.cards[U[i].id + ':' + k]; }); }
  function openUnits() { var a = []; for (var i = 0; i < U.length; i++) if (isPack(i) ? packStarted(i) : isOpen(i)) a.push(i); return a; }
  /* Wörter der Stadt, die heute zum Festigen fällig sind (noch nicht an zwei Tagen gesessen) */
  function ripenList(ui) { var d = today(); return wordsOf(ui).filter(function (x) { var c = S.cards[x.id]; return c && c.box < 2 && C.isDue(c, d); }); }
  /* Nächster Schritt einer Stadt; 'ripen' ohne fällige Wörter wird zu 'wait' (morgen geht es weiter) */
  function cityStep(ui) { var s = C.nextStep(S, U[ui].id, U[ui].words.length); return s === 'ripen' && !ripenList(ui).length ? 'wait' : s; }
  /* 3.1.2: „Weiter“ führt immer zur ersten Stadt ohne bestandene Prüfung – übersprungene Städte zählen nicht als geschafft */
  function nextUnit() { var ri = routeIdx(); for (var k = 0; k < ri.length; k++) { var i = ri[k]; if (isOpen(i) && !S.boss[U[i].id]) return i; } return Math.min(S.unlocked, lastRoute()); }
  function poolOpen() { var p = []; openUnits().forEach(function (ui) { p = p.concat(wordsOf(ui)); }); return p; }

  /* ---------- Sprachausgabe ---------- */
  var voice = null;
  /* 3.0: beste polnische Stimme wählen (natürliche / verbesserte Stimmen bevorzugt), eigene Wahl unter „Ich“ */
  /* English Trail: Zielsprache Englisch, Aussprache britisch (en-GB, Standard) oder amerikanisch (en-US) */
  function TL() { return S && S.accent === 'us' ? 'en-US' : 'en-GB'; }
  function plVoices() { try { var all = speechSynthesis.getVoices(), want = TL().toLowerCase(), exact = all.filter(function (v) { return String(v.lang).replace('_', '-').toLowerCase() === want; }); return exact.length ? exact : all.filter(function (v) { return /^en/i.test(v.lang); }); } catch (e) { return []; } }
  /* 3.1.1: Apple (iPhone, iPad, Mac-Safari) listet auch NICHT installierte „verbesserte“ Stimmen – damit bliebe es stumm.
     Dort wählt deshalb das System die Stimme (nur lang = pl-PL), außer man hat unter „Ich“ selbst eine gewählt. Sonst: Online-/Natural-Stimmen bevorzugen. */
  function isApple() { try { var ua = navigator.userAgent; return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || (/macintosh/i.test(ua) && !/chrome|chromium|edg|firefox/i.test(ua)); } catch (e) { return false; } }
  function voiceScore(v) { var n = v.name || ''; return (/natural|neural|online/i.test(n) ? 4 : 0) + (/google/i.test(n) ? 2 : 0) + (v['default'] ? 1 : 0); }
  /* 3.1.3: Auf Apple wieder wie bis 2.0 (da ging der Ton): die ERSTE polnische Stimme der Liste – das ist die vom System
     installierte Standardstimme. Eine unter „Ich“ gewählte Stimme gilt auf Apple nur, wenn sie lokal installiert ist. */
  function pickVoice() {
    var vs = plVoices(), mine = S && S.voice && vs.filter(function (v) { return v.name === S.voice && (!isApple() || v.localService !== false); })[0];
    voice = mine || (isApple() ? vs[0] || null : vs.slice().sort(function (a, b) { return voiceScore(b) - voiceScore(a); })[0] || null);
    if (tab === 'me' && document.getElementById('voice')) refreshVoiceBox();
  }
  try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
  /* Muttersprachler-Aufnahmen (Vorschlag L): data.json "audio" ordnet Text -> Datei unter audio/ zu. Fehlt eine Aufnahme, spricht die Gerätestimme. */
  /* 3.4: kostenlose Piper-Stimmen (Gosia, Darek) als Tondateien audio/<stimme>/<schlüssel>.mp3, Liste in audio/voices.json.
     Reihenfolge: echte Aufnahme (D.audio) → gewählte App-Stimme → Gerätestimme. Fehlt eine Datei oder ist man offline, spricht das Gerät. */
  var curAudio = null, AV_URL = 'audio/voices.json', AV = null, avWait = null, VSRC = {}; /* English Trail: noch keine eigenen Tondateien – Gerätestimme (en-GB/en-US). Englische Piper-Stimmen: siehe PROJEKTSTAND */
  function audioKey(text) { return ('00000000' + C.hash(String(text).replace(/…/g, '').replace(/\s+/g, ' ').trim().toLowerCase()).toString(16)).slice(-8); }
  function needAV(cb) {
    if (AV) { if (cb) cb(); return; }
    if (!avWait) avWait = fetch(AV_URL).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(function (j) { var k = {}; (j.keys || []).forEach(function (x) { k[x] = 1; }); AV = { keys: k, voices: j.voices || [] }; }, function (e) { avWait = null; throw e; });
    avWait.then(function () { if (cb) cb(); }, function () {});
  }
  function audioFor(text) {
    var m = D.audio || {}, k = String(text).replace(/…/g, '').trim(); if (m[k] || m[k.toLowerCase()]) return m[k] || m[k.toLowerCase()];
    if (S.vsrc && VSRC[S.vsrc] && AV && AV.keys[audioKey(text)]) return 'audio/' + S.vsrc + '/' + audioKey(text) + '.mp3';
    return null;
  }
  function stopAll() { try { if (curAudio) { curAudio.onended = null; curAudio.pause(); } speechSynthesis.cancel(); } catch (e) {} }
  function playClip(src, slow, onEnd, onFail) {
    audioPlayback(); stopAll();
    var a = new Audio(src), failed = false; curAudio = a; a.playbackRate = slow ? 0.75 : 1;
    try { a.preservesPitch = true; } catch (e) {}
    var fail = function () { if (failed) return; failed = true; if (curAudio === a) curAudio = null; onFail(); };
    a.onerror = fail; a.onended = function () { if (onEnd) onEnd(); };
    try { var p = a.play(); if (p && p.catch) p.catch(fail); } catch (e) { fail(); }
  }
  function speak(text, slow) {
    var src = audioFor(text), sl = !!(slow || S.slow);
    if (src) return playClip(src, sl, null, function () { ttsSpeak(text, slow); });
    ttsSpeak(text, slow);
  }
  /* Mehrere Sätze nacheinander (Buchkapitel): mit App-Stimme Datei für Datei, sonst in einem Stück mit der Gerätestimme */
  function speakSeq(list) {
    if (!list.every(function (x) { return audioFor(x); })) return speak(list.join(' '));
    var i = 0; (function next() { if (i >= list.length) return; var x = list[i++]; playClip(audioFor(x), !!S.slow, next, function () { ttsSpeak(list.slice(i - 1).join(' ')); }); })();
  }
  var vcWarned = false, ttsLog = [], ttsKeep = [];
  function tlog(m) { ttsLog.push(new Date().toISOString().slice(11, 23) + ' ' + m); if (ttsLog.length > 40) ttsLog.shift(); }
  /* 3.1.3 robuster für Safari/iOS: nur abbrechen, wenn wirklich etwas läuft (cancel() direkt vor speak() verschluckt dort
     manchmal den neuen Satz), Sprachausgabe ggf. fortsetzen (resume), Satz-Objekt festhalten (sonst räumt Safari es weg),
     und wenn nach 1,5 s nichts startet: einmal ohne feste Stimme wiederholen. */
  function ttsSpeak(text, slow, retry) {
    if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') { tlog('keine Sprachausgabe im Browser'); toast(t('tts_missing')); return; }
    if (!voice && !retry) pickVoice();
    if (!voice && !vcWarned && speechSynthesis.getVoices().length && !plVoices().length) { vcWarned = true; toast(t('vc_none_toast')); }
    audioPlayback();
    try {
      /* Lief noch etwas: abbrechen und kurz warten – Safari verschluckt sonst den neuen Satz oder bleibt „hängen“ */
      var busy = speechSynthesis.speaking || speechSynthesis.pending;
      if (busy) speechSynthesis.cancel();
      if (speechSynthesis.paused) speechSynthesis.resume();
      var u = new SpeechSynthesisUtterance(String(text).replace(/…/g, '')), started = false, v0 = retry ? null : voice;
      u.lang = TL(); if (v0) u.voice = v0; u.rate = (slow || S.slow) ? 0.7 : 0.95; u.volume = 1; u.pitch = 1;
      u.onstart = function () { started = true; tlog('start' + (v0 ? ' (' + v0.name + ')' : ' (Systemstimme)')); };
      u.onend = function () { tlog('ende'); var i = ttsKeep.indexOf(u); if (i >= 0) ttsKeep.splice(i, 1); };
      u.onerror = function (e) { tlog('fehler: ' + (e && e.error)); if (!started && !retry && e && e.error !== 'interrupted' && e.error !== 'canceled') ttsSpeak(text, slow, true); };
      ttsKeep.push(u); if (ttsKeep.length > 5) ttsKeep.shift();
      tlog('sprich: ' + String(text).slice(0, 30) + (v0 ? ' · Stimme ' + v0.name : ' · ohne feste Stimme'));
      if (busy) setTimeout(function () { speechSynthesis.speak(u); }, 80); else speechSynthesis.speak(u);
      if (!retry) setTimeout(function () { if (!started && !speechSynthesis.speaking) { tlog('nach 1,5 s kein Start – zweiter Versuch'); ttsSpeak(text, slow, true); } }, 1500);
    } catch (e) { tlog('ausnahme: ' + e); toast(t('tts_missing')); }
  }
  /* iPhone/iPad: Web-Apps laufen sonst in der Audio-Sitzung „ambient“ – die folgt dem Stumm-Schalter, die Sprachausgabe
     läuft dann (start/ende), ist aber nicht zu hören. „playback“ (Safari 17+) spielt wie ein Video auch bei Stumm-Schalter. */
  function audioPlayback() {
    try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') { navigator.audioSession.type = 'playback'; tlog('Audio-Sitzung: playback'); } } catch (e) { tlog('Audio-Sitzung: ' + e); }
  }
  /* Ton-Test mit Diagnose (Ich → Stimme): zeigt, was der Browser meldet – für Fehlersuche per Bildschirmfoto */
  function ttsDiag() {
    var vs = []; try { vs = speechSynthesis.getVoices(); } catch (e) {}
    var pl = vs.filter(function (v) { return /^pl/i.test(v.lang); });
    return ['App ' + APP_VER + ' · ' + (isApple() ? 'Apple' : 'kein Apple') + (isStandalone() ? ' · als App installiert' : ' · im Browser'),
      navigator.userAgent.replace(/\s*\(KHTML, like Gecko\)/, '').slice(0, 140),
      'Stimmen gesamt: ' + vs.length + ' · polnisch: ' + pl.length,
      pl.map(function (v) { return '  - ' + v.name + ' [' + v.lang + (v.localService ? ', lokal' : ', online') + (v['default'] ? ', Standard' : '') + ']'; }).join('\n') || '  (keine polnische Stimme)',
      'gewählt: ' + (voice ? voice.name : '(keine feste Stimme)') + (S.voice ? ' · eingestellt: ' + S.voice : ''),
      'Audio-Sitzung: ' + (navigator.audioSession ? navigator.audioSession.type + ' / ' + navigator.audioSession.state : '(nicht vorhanden)'),
      'Status: speaking=' + speechSynthesis.speaking + ' pending=' + speechSynthesis.pending + ' paused=' + speechSynthesis.paused,
      '--- Ablauf ---'].concat(ttsLog).join('\n');
  }

  /* ---------- Icons ---------- */
  var I = {
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
    dumb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
    snail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h13a5 5 0 1 0-5-5 2.5 2.5 0 1 0 2.5-2.5"/><path d="M16 18l3-6M19 12l1-3M19 12l-2-2"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h13v5H5"/><path d="M5 9h13v5H5" fill="currentColor" fill-opacity=".35"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  function blaze(tr) { return '<span class="blaze tr-' + tr + '" aria-hidden="true"><i></i><i></i><i></i></span>'; }
  function krasnalSvg() {
    return '<svg viewBox="0 0 56 64" aria-hidden="true"><path d="M28 2 14 26h28z" fill="var(--red)"/><circle cx="28" cy="31" r="9" fill="var(--amber)"/><path d="M18 34c2 10 18 10 20 0-3 6-17 6-20 0z" fill="var(--blaze-white)" stroke="var(--map-edge)"/><rect x="17" y="40" width="22" height="16" rx="5" fill="var(--t-green)"/><rect x="18" y="56" width="8" height="6" rx="2" fill="var(--ink)"/><rect x="30" y="56" width="8" height="6" rx="2" fill="var(--ink)"/></svg>';
  }

  /* ---------- Fortschritt buchen ---------- */
  function markActive() { var d = today(); S.active[d] = (S.active[d] || 0) + 1; }
  function addXp(n) { S.xp += n; var wk = C.weekKey(today()); S.weekXp[wk] = (S.weekXp[wk] || 0) + n; }
  /* Wochenlog für den Wochenrückblick (3.0): n = neue Wörter, m = neu sicher, r/w = richtig/falsch */
  function wlog(f, n) { var wk = C.weekKey(today()); S.wlog = S.wlog || {}; var e = S.wlog[wk] = S.wlog[wk] || {}; e[f] = (e[f] || 0) + (n || 1); }
  function grade(id, ok) {
    if (!id) return;
    var before = S.cards[id]; if (!before) wlog('n');
    S.cards[id] = C.srsUpdate(S.cards[id], ok, today());
    wlog(ok ? 'r' : 'w'); if ((!before || before.box < C.MASTERED_BOX) && S.cards[id].box >= C.MASTERED_BOX) wlog('m');
    if (!ok) { S.mistakes = S.mistakes.filter(function (m) { return m !== id; }); S.mistakes.unshift(id); S.mistakes = S.mistakes.slice(0, 60); }
    else if (S.cards[id].box >= 3) S.mistakes = S.mistakes.filter(function (m) { return m !== id; });
  }

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) { var el = document.querySelector('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2200); }
  function copy(text) {
    try { navigator.clipboard.writeText(text).then(function () { toast(t('copied')); }, function () { fallbackCopy(text); }); } catch (e) { fallbackCopy(text); }
  }
  function fallbackCopy(text) { var ta = document.getElementById('copy-fallback'); if (ta) { ta.value = text; ta.hidden = false; ta.select(); } }

  /* ---------- Routing ---------- */
  var tab = 'home', view = null;
  function go(name, arg) { if (name !== 'live' && typeof ldLeave === 'function' && LD) ldLeave(); var tb = document.getElementById('tour'); if (tb) { tb.remove(); document.querySelectorAll('.tour-hl').forEach(function (e) { e.classList.remove('tour-hl'); }); } view = null; tab = name; polUI = name === 'polacy'; render(arg); window.scrollTo(0, 0); }

  function shell(inner, showNav) {
    /* Spielbildschirm: eine noch offene Einführungs-Tour darf nicht über den Antworten liegen bleiben */
    if (showNav === false) { var tb = document.getElementById('tour'); if (tb) { tb.remove(); document.querySelectorAll('.tour-hl').forEach(function (e) { e.classList.remove('tour-hl'); }); } }
    var lv = C.levelFromXp(S.xp);
    var html = '<header class="top"><div class="top-in"><button type="button" class="brand" id="brand" title="' + esc(t('to_start')) + '" aria-label="English Trail – ' + esc(t('to_start')) + '">' + blaze('red') + 'English Trail</button>' +
      '<span class="chip num" title="' + t('level') + '">' + t('level') + ' ' + lv.level + '</span>' +
      '<span class="chip amber num">' + S.xp + ' ' + t('xp') + '</span>' + netChip() + '</div></header><main id="main">' + inner +
      '<footer class="legal-foot small"><a href="impressum.html">' + esc(t('legal')) + '</a> · <a href="datenschutz.html">' + esc(t('privacy')) + '</a></footer></main>';
    if (showNav !== false) {
      html += '<nav class="nav" aria-label="Navigation"><div class="nav-in">' +
        navBtn('home', I.map, t('nav_home')) + navBtn('practice', I.dumb, t('nav_practice')) + navBtn('land', I.flag, t('nav_land')) + navBtn('album', I.book, t('nav_album')) + navBtn('me', I.user, t('nav_me')) +
        '</div></nav>';
    }
    html += '<textarea id="copy-fallback" hidden aria-label="Copy"></textarea>';
    $app.innerHTML = html;
    $app.querySelectorAll('[data-nav]').forEach(function (b) { b.onclick = function () { go(b.getAttribute('data-nav')); }; });
    document.getElementById('brand').onclick = function () { if (G) { stopTimer(); G = null; } go('home'); };
    bindNet();
  }
  /* Kleine Anzeige im Kopf: offline, oder (mit Konto) Stand des Geräte-Abgleichs */
  function netChip() {
    var off = !navigator.onLine, st = off ? 'off' : (A && A.uid ? (syncBusy ? 'busy' : (syncErr ? 'err' : 'ok')) : '');
    if (!st) return '<span id="net" hidden></span>';
    var lab = t(st === 'off' ? 'offline' : 'net_' + st);
    return '<button type="button" id="net" class="chip net ' + st + '" title="' + esc(lab) + '" aria-label="' + esc(lab) + '"><i aria-hidden="true"></i>' + (st === 'off' ? '<span>' + esc(lab) + '</span>' : '') + '</button>';
  }
  function bindNet() { var n = document.getElementById('net'); if (n && n.tagName === 'BUTTON') n.onclick = function () { if (G) return; go('me'); setTimeout(function () { var y = document.getElementById('sync'); if (y) y.scrollIntoView({ block: 'center' }); }, 50); }; }
  function updateNet() { var n = document.getElementById('net'); if (!n) return; var tmp = document.createElement('div'); tmp.innerHTML = netChip(); n.replaceWith(tmp.firstChild); bindNet(); }
  try { window.addEventListener('online', function () { updateNet(); syncSoon(); }); window.addEventListener('offline', updateNet); } catch (e) {}
  function navBtn(k, ic, label) { return '<button data-nav="' + k + '"' + (tab === k ? ' aria-current="page"' : '') + '>' + ic + '<span>' + esc(label) + '</span></button>'; }

  function render(arg) {
    applyTheme();
    var jw = C.weekKey(today()); if (S.jokerWeek !== jw) { S.jokers = { five0: 3, freeze: 3, hint: 3 }; S.jokerWeek = jw; save(); }
    if (!S.onboarded) return renderOnboarding();
    if (tab === 'home') return renderHome();
    if (tab === 'city') return renderCity(arg);
    if (tab === 'practice') return renderPractice();
    if (tab === 'album') return renderAlbum();
    if (tab === 'me') return renderMe();
    if (tab === 'land') return renderLand();
    if (tab === 'mywords') return renderMyWords();
    if (tab === 'lex') return renderLex();
    if (tab === 'duel') return renderDuelSetup();
    if (tab === 'face') return renderFaceSetup();
    if (tab === 'polacy') return RAW.polacy ? renderPolacy() : needPolacy(function () { renderPolacy(); });
    if (tab === 'letter') return renderLetter(arg);
    if (tab === 'read') return renderRead(arg);
    if (tab === 'exam') return renderExam();
    if (tab === 'themes') return renderThemes(arg);
    if (tab === 'chat') return renderChat(arg);
    if (tab === 'news') return renderNews();
    if (tab === 'guide') return renderGuide(arg);
    if (tab === 'conj') return renderConj();
    if (tab === 'school') return renderSchool();
    if (tab === 'live') return LD ? ldRender() : renderLiveSetup();
    if (tab === 'writing') return renderWriting(arg);
  }

  /* ---------- Onboarding ---------- */
  function renderOnboarding() {
    if (obSync) {
      shell('<button class="btn ghost" id="ob-back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button>' + syncBox(), false);
      document.getElementById('ob-back').onclick = function () { obSync = false; renderOnboarding(); };
      bindSync(); return;
    }
    shell('<section class="ob">' +
      '<div class="stack"><span class="eyebrow">English Trail</span><div class="big">' + esc(t('ob_title')) + '</div><p class="muted">' + esc(t('ob_sub')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('accent')) + '</b><div class="seg" id="ob-acc">' + segBtn('gb', t('accent_gb'), S.accent !== 'us') + segBtn('us', t('accent_us'), S.accent === 'us') + '</div><p class="small muted">' + esc(t('accent_d')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('ob_why')) + '</b><div class="seg" id="ob-why">' +
        ['school', 'travel', 'family', 'work', 'curious'].map(function (k) { return segBtn(k, t('why_' + k), S.why === k); }).join('') + '</div></div>' +
      '<div class="stack"><b>' + esc(t('ob_goal')) + '</b><div class="seg" id="ob-goal">' +
        [2, 3, 4, 5, 7].map(function (n) { return segBtn(String(n), String(n), S.goal === n); }).join('') + '</div><p class="small muted">' + esc(t('pause_ok')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('ob_diff')) + '</b><div class="seg" id="ob-diff">' + ['easy', 'medium', 'hard'].map(function (k) { return segBtn(k, t('diff_' + k), S.diff === k); }).join('') + '</div><p class="small muted">' + esc(t('diff_' + S.diff + '_d')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('ob_inp')) + '</b><div class="seg" id="ob-inp">' + ['write', 'speak', 'tap'].map(function (k) { return segBtn(k, t('inp_' + k), S.input === k); }).join('') + '</div><p class="small muted">' + esc(t('inp_' + S.input + '_d')) + ' ' + esc(t('ob_inp_d')) + '</p></div>' +
      '<button class="btn primary block" id="ob-go">' + esc(t('ob_go')) + '</button><button class="btn block" id="ob-place">' + esc(t('ob_place')) + '</button><button class="btn ghost block" id="ob-sync">' + esc(t('sync_ob')) + '</button></section>', false);
    document.getElementById('ob-sync').onclick = function () { obSync = true; renderOnboarding(); };
    bindSeg('ob-acc', function (v) { S.accent = v; pickVoice(); renderOnboarding(); });
    bindSeg('ob-why', function (v) { S.why = v; renderOnboarding(); });
    bindSeg('ob-goal', function (v) { S.goal = +v; renderOnboarding(); });
    bindSeg('ob-diff', function (v) { S.diff = v; renderOnboarding(); });
    bindSeg('ob-inp', function (v) { S.input = v; renderOnboarding(); });
    document.getElementById('ob-place').onclick = function () { S.seenVer = APP_VER; S.onboarded = true; S.seenWeek = C.weekKey(today()); save(); tab = 'home'; startMode('placement'); };
    document.getElementById('ob-go').onclick = function () { S.seenVer = APP_VER; S.onboarded = true; S.seenWeek = C.weekKey(today()); save(); if (S.why === 'school') go('school'); else go('city', 0); };
  }
  function segBtn(v, label, on) { return '<button type="button" data-v="' + esc(v) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(label) + '</button>'; }
  function bindSeg(id, fn) { document.querySelectorAll('#' + id + ' button').forEach(function (b) { b.onclick = function () { fn(b.getAttribute('data-v')); }; }); }

  /* ---------- Karte ---------- */
  function proj(lon, lat) { return C.proj(lon, lat); } /* PATCH003 */
  /* English Trail: Umriss kann aus mehreren Flächen bestehen (Großbritannien + Irland) */
  function landSvg() { var o = D.outline, polys = Array.isArray(o[0][0]) ? o : [o]; return polys.map(function (pl) { return '<polygon class="land" points="' + pl.map(function (p) { var q = proj(p[0], p[1]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ') + '"/>'; }).join(''); }
  function mapSvg() {
    var idx = szlakUnits(mapR()), route = idx.map(function (i) { return proj(U[i].lon, U[i].lat); });
    var routeAll = route.map(function (q) { return q.join(','); }).join(' ');
    var doneN = idx.filter(function (i) { return i <= S.unlocked; }).length;
    var routeDone = route.slice(0, doneN).map(function (q) { return q.join(','); }).join(' ');
    var nodes = idx.map(function (i, k) {
      var u = U[i], q = route[k], cls = 'node ' + (S.boss[u.id] ? 'done' : (isOpen(i) ? 'open' : 'locked')) + (i === nextUnit() && !S.boss[u.id] ? ' next' : '');
      var lx = q[0] + 16, anchor = 'start';
      if (q[0] > 470 || u.lab === 'l') { lx = q[0] - 16; anchor = 'end'; }
      return '<g class="' + cls + '" data-city="' + i + '" role="button" tabindex="0" aria-label="' + esc(u.city) + '">' +
        '<circle class="halo" cx="' + q[0] + '" cy="' + q[1] + '" r="24" fill="transparent"/>' +
        '<circle class="dot" cx="' + q[0] + '" cy="' + q[1] + '" r="10"/>' +
        '<text x="' + lx + '" y="' + (q[1] + 7) + '" text-anchor="' + anchor + '">' + esc(u.city) + '</text></g>';
    }).join('');
    return '<svg class="map" viewBox="-10 0 680 650" role="img" aria-label="' + esc(t('all_cities')) + '">' + landSvg() + '' +
      '<polyline class="route" points="' + routeAll + '"/>' + (doneN > 1 ? '<polyline class="route-done" points="' + routeDone + '"/>' : '') + nodes + '</svg>';
  }

  var mapSel = null;
  var LV = { 1: 'A1', 2: 'A2', 3: 'B1' };
  function mapR() { var r = mapSel || szlakOf(nextUnit()); return szlakUnits(r).length ? r : 1; }
  function mapSeg() {
    var rs = [1, 2, 3].filter(function (r) { return szlakUnits(r).length; });
    return rs.length > 1 ? '<div class="seg map-seg" id="map-r">' + rs.map(function (r) { return segBtn(String(r), 'Trail ' + r + ' · ' + LV[r], mapR() === r); }).join('') + '</div>' : '';
  }
  function weekRing() {
    var wk = C.weekKey(today()), n = C.daysInWeek(S.active, wk), g = S.goal, r = 38, cx = 46, cy = 46, segs = '';
    for (var i = 0; i < g; i++) {
      var a0 = (i / g) * Math.PI * 2 - Math.PI / 2 + 0.06, a1 = ((i + 1) / g) * Math.PI * 2 - Math.PI / 2 - 0.06;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      segs += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke-width="9" stroke-linecap="round" stroke="' + (i < n ? 'var(--red)' : 'var(--line)') + '"/>';
    }
    return '<svg class="ring" viewBox="0 0 92 92" role="img" aria-label="' + n + ' ' + t('of') + ' ' + g + '">' + segs +
      '<text x="46" y="52" text-anchor="middle" font-size="22">' + Math.min(n, 99) + '/' + g + '</text></svg>';
  }

  function renderHome() {
    var d = today(), wk = C.weekKey(d), nUnit = nextUnit(), u = U[nUnit];
    var due = dueList().length, ws = C.weekStreak(S.active, S.goal, d);
    var banner = '', gap = C.daysSince(S.active, d), step = cityStep(nUnit);
    if (gap >= 7 && S.welcomeDay !== d && Object.keys(S.cards).length) {
      banner = '<section class="card stack pop welcome" id="wb"><b class="big">' + esc(t('wb_title')) + '</b><p>' + esc(t('wb_d')) + '</p>' +
        '<div class="row"><button class="btn primary" id="wb-go">' + esc(t('wb_go')) + '</button><button class="btn ghost" id="wb-later">' + esc(t('wb_later')) + '</button></div></section>';
      S.welcomeDay = d; S.seenWeek = wk; save();
    } else if (S.seenWeek && S.seenWeek !== wk) {
      var lastN = C.daysInWeek(S.active, C.prevWeek(wk));
      banner = '<div class="banner pop"><strong>' + esc(t('fresh')) + '</strong><span>' + esc(lastN >= S.goal ? t('fresh_ok') : t('fresh_d').replace('{a}', lastN).replace('{g}', S.goal)) + '</span></div>';
      S.seenWeek = wk; save();
    }
    var wr = newsBox() + weekReviewBox(wk);
    /* 3.5: Stadt ist für heute gefestigt → sinnvolle Alternativen, die alle zählen */
    var riX = routeIdx(), pre = riX[riX.indexOf(nUnit) + 1], preOk = step === 'wait' && pre != null && wordsOf(pre).some(function (x) { return !S.cards[x.id]; });
    var alt = step === 'wait' ? (due ? 'review' : preOk ? 'pre' : null) : null;
    var lastXp = S.weekXp[C.prevWeek(wk)] || 0, thisXp = S.weekXp[wk] || 0, mx = Math.max(lastXp, thisXp, 1);
    var html = banner + wr +
      '<section class="card hero"><div class="hero-top">' + weekRing() + '<div class="stack" style="gap:4px;min-width:0"><span class="eyebrow">' + esc(t('week')) + '</span>' +
      '<b class="num">' + ws + ' ' + esc(t('wk_streak')) + '</b><span class="small muted num">' + C.totalDays(S.active) + ' ' + esc(t('total_days')) + ' · ' + masteredCount() + ' ' + esc(t('mastered')) + '</span></div></div>' +
      (alt ? '<button class="btn primary block" id="cta">' + (alt === 'review' ? esc(t('more_review')) + ' · ' + due : blaze(U[pre].trail) + esc(t('more_pre').replace('{c}', U[pre].city))) + '</button><p class="small muted">' + esc(t('more_wait').replace('{c}', u.city)) + '</p>'
        : '<button class="btn primary block" id="cta">' + blaze(u.trail) + esc(t('continue')) + ': ' + esc(u.city) + (step ? ' · ' + esc(t(step)) : '') + '</button>') +
      (step ? '<div class="row small" style="justify-content:space-between"><span class="muted">' + (alt ? '' : esc(t('next_up')) + ': ' + esc(t('step_' + step))) + '</span><button class="btn ghost small" id="cta-city" style="min-height:36px;padding:4px 0">' + esc(t('view_city')) + ' →</button></div>' : '') + '</section>' +
      (step === 'wait' ? moreBox(nUnit, pre, preOk, due, alt) : '') +
      storyCard() +
      '<section class="map-wrap card" style="padding:8px">' + mapSeg() + mapSvg() + '</section>' +
      '<section class="tiles">' + tileBtn('themes', t('themes'), t('themes_d')) +
        tileBtn('review', t('review'), t('review_d'), due ? '<span class="badge num">' + due + ' ' + esc(t('due')) + '</span>' : '') +
        tileBtn('daily', t('daily'), t('daily_d'), S.daily[d] ? '<span class="badge good num">' + S.daily[d].score + '/10</span>' : '') +
      '</section>' +
      '<section class="card stack"><span class="eyebrow">' + esc(t('vs_last')) + '</span>' +
        '<div class="row small"><span style="width:110px">' + esc(t('this_w')) + '</span><div class="bar" style="flex:1"><i style="width:' + (thisXp / mx * 100) + '%"></i></div><b class="num">' + thisXp + '</b></div>' +
        '<div class="row small"><span style="width:110px">' + esc(t('last_w')) + '</span><div class="bar muted" style="flex:1"><i style="width:' + (lastXp / mx * 100) + '%"></i></div><b class="num">' + lastXp + '</b></div>' +
      '</section>';
    shell(html);
    document.getElementById('cta').onclick = function () { if (alt === 'review') startMode('review'); else if (alt === 'pre') startMode('learn', pre); else if (step && isOpen(nUnit)) startMode(step, nUnit); else go('city', nUnit); };
    document.querySelectorAll('[data-more]').forEach(function (b) { b.onclick = function () { var m = b.getAttribute('data-more'), i = b.getAttribute('data-ui'); startMode(m, i == null ? undefined : +i); }; });
    var cc = document.getElementById('cta-city'); if (cc) cc.onclick = function () { go('city', nUnit); };
    var lo = document.getElementById('letter-open'); if (lo) lo.onclick = function () { go('letter', lo.getAttribute('data-story')); };
    var bo = document.getElementById('book-open'); if (bo) bo.onclick = function () { startMode('read', +bo.getAttribute('data-ui')); window.scrollTo(0, 0); };
    var eo = document.getElementById('exam-open'); if (eo) eo.onclick = function () { go('exam'); };
    bindSeg('map-r', function (v) { mapSel = +v; renderHome(); });
    var lold = document.getElementById('letter-old'); if (lold) lold.onclick = function () { go('letter', 'letter'); };
    var wg = document.getElementById('wb-go'); if (wg) wg.onclick = function () { startMode('welcome'); };
    var nwx = document.getElementById('nw-x'); if (nwx) nwx.onclick = function () { S.seenVer = APP_VER; save(); var e = document.getElementById('nw'); if (e) e.remove(); };
    var nwa = document.getElementById('nw-all'); if (nwa) nwa.onclick = function () { S.seenVer = APP_VER; save(); go('news'); };
    var wrx = document.getElementById('wr-x'); if (wrx) wrx.onclick = function () { S.wrSeen = wk; save(); var e = document.getElementById('wr'); if (e) e.remove(); };
    var wrg = document.getElementById('wr-go'); if (wrg) wrg.onclick = function () { S.wrSeen = wk; save(); startMode('wr3'); };
    var wl = document.getElementById('wb-later'); if (wl) wl.onclick = function () { var w = document.getElementById('wb'); if (w) w.remove(); };
    bindTiles();
    if (!S.tour && !banner) setTimeout(function () { if (tab === 'home' && !view && !G) startTour(); }, 400);
    document.querySelectorAll('[data-city]').forEach(function (g) {
      var open = function () { go('city', +g.getAttribute('data-city')); };
      g.onclick = open; g.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
    });
  }
  /* 3.5 Wie werden Wörter „sicher“? Stand der Stadt, heute fällige Wörter, nächster Termin */
  function sureBox(ui, list) {
    var d = today(), sure = 0, build = 0, none = 0, dueN = 0, nextD = null;
    list.forEach(function (x) { var c = S.cards[x.id]; if (!c) { none++; return; } if (c.box >= C.MASTERED_BOX) sure++; else build++; if (C.isDue(c, d)) dueN++; else if (c.box < C.MASTERED_BOX && (!nextD || c.due < nextD)) nextD = c.due; });
    if (!sure && !build) return '';
    var when = nextD ? (nextD === C.addDays(d, 1) ? t('sure_tomorrow') : new Date(nextD + 'T12:00:00').toLocaleDateString(S.base === 'en' ? 'en-GB' : 'de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' })) : '';
    return '<section class="card stack"><span class="eyebrow">' + esc(t('sure_title')) + '</span>' +
      '<div class="row small num" style="flex-wrap:wrap;gap:6px"><span class="badge good">' + sure + ' ' + esc(t('sure_ok')) + '</span><span class="badge">' + build + ' ' + esc(t('sure_build')) + '</span>' + (none ? '<span class="badge">' + none + ' ' + esc(t('sure_new')) + '</span>' : '') + '</div>' +
      (dueN ? '<button class="btn primary" data-mode="due" style="justify-self:start">' + esc(t('due_city')) + ' · ' + dueN + '</button>' : (when && build ? '<p class="small">' + esc(t('sure_next').replace('{d}', when)) + '</p>' : '')) +
      '<p class="small muted">' + esc(t('sure_d')) + '</p></section>';
  }
  /* 3.5 „Mehr für heute“: wenn die aktuelle Stadt erst morgen weitergeht */
  function moreBox(cu, pre, preOk, due, alt) {
    var b = function (mode, ui, label) { return '<button class="btn" data-more="' + mode + '"' + (ui != null ? ' data-ui="' + ui + '"' : '') + ' style="justify-self:start">' + label + '</button>'; };
    var u = U[cu], items = [];
    if (due && alt !== 'review') items.push(b('review', null, esc(t('more_review')) + ' · ' + due));
    if (preOk && alt !== 'pre') items.push(b('learn', pre, esc(t('more_pre').replace('{c}', U[pre].city))));
    if (u.read && !(S.read && S.read[u.id] != null)) items.push(b('read', cu, '📖 ' + esc(t('rd_tile'))));
    if (!(S.scenes && S.scenes[u.id])) items.push(b('scene', cu, esc(t('scene'))));
    items.push(b('chat', cu, '💬 ' + esc(t('chat'))));
    items.push(b('build', cu, esc(t('build'))));
    return '<section class="card stack"><span class="eyebrow">' + esc(t('more_title')) + '</span><p class="small">' + esc(t('more_d')) + '</p><div class="row" style="flex-wrap:wrap">' + items.join('') + '</div></section>';
  }
  /* Wochenrückblick (3.0): in der neuen Woche einmal oben, bis man ihn schließt. Vergleich mit der Woche davor, die 3 kniffligsten Wörter */
  function weekReviewBox(wk) {
    var pw = C.prevWeek(wk), L0 = (S.wlog || {})[pw];
    if (S.wrSeen === wk || !L0 || !((L0.r || 0) + (L0.w || 0) + (L0.n || 0))) return '';
    var L1 = (S.wlog || {})[C.prevWeek(pw)] || {}, days = C.daysInWeek(S.active, pw), pct = (L0.r || 0) + (L0.w || 0) ? Math.round((L0.r || 0) / ((L0.r || 0) + (L0.w || 0)) * 100) : 0;
    var arrow = function (a, b) { return a > b ? ' <span class="good-t" aria-label="' + esc(t('wr_more')) + '">▲</span>' : (a < b ? ' <span class="muted" aria-label="' + esc(t('wr_less')) + '">▼</span>' : ''); };
    var hard = S.mistakes.map(byId).filter(Boolean).slice(0, 3);
    return '<section class="card stack pop wr" id="wr"><div class="row" style="justify-content:space-between"><span class="eyebrow">' + esc(t('wr_title')) + '</span><button class="icon-btn" id="wr-x" aria-label="' + esc(t('wr_close')) + '">' + I.x + '</button></div>' +
      '<div class="stats3"><div class="stat"><b class="num">' + days + '/' + S.goal + '</b><span class="small muted">' + esc(t('wr_days')) + '</span></div><div class="stat"><b class="num">' + (L0.n || 0) + arrow(L0.n || 0, L1.n || 0) + '</b><span class="small muted">' + esc(t('wr_new')) + '</span></div><div class="stat"><b class="num">' + (L0.m || 0) + arrow(L0.m || 0, L1.m || 0) + '</b><span class="small muted">' + esc(t('wr_sure')) + '</span></div></div>' +
      '<p class="small">' + esc((days >= S.goal ? t('wr_goal_ok') : t('wr_goal_no')) + ' ' + t('wr_pct').replace('{p}', pct)) + '</p>' +
      (hard.length ? '<p class="small"><b>' + esc(t('wr_hard')) + ':</b> ' + hard.map(function (x) { return '<span lang="en">' + esc(x.w[0]) + '</span>'; }).join(' · ') + '</p><button class="btn primary" id="wr-go" style="justify-self:start">' + esc(t('wr_go')) + '</button>' : '') + '</section>';
  }
  /* Was ist neu (3.1.1): nach einem Update einmal auf der Startseite, alle Versionen unter Ich → Was ist neu */
  /* Eltern-Bericht (G): kurzer Text zum Teilen – nur Zahlen aus dem Gerät, keine Namen */
  function parentReport(g) {
    var wk = C.weekKey(today()), L0 = (S.wlog || {})[wk] || {}, days = C.daysInWeek(S.active, wk);
    var mine = schUnits(), mw = 0; Object.keys(mine).forEach(function (k) { mw += mine[k].length; });
    var lines = [t('par_h').replace('{g}', g),
      t('par_week').replace('{d}', days).replace('{goal}', S.goal).replace('{n}', L0.n || 0).replace('{r}', L0.r || 0).replace('{w}', L0.w || 0),
      t('par_words').replace('{m}', masteredCount()).replace('{k}', g),
      t('par_mine').replace('{n}', mw).replace('{u}', Object.keys(mine).length),
      S.schoolBest && S.schoolBest[g] != null ? t('par_exam').replace('{p}', S.schoolBest[g]).replace('{m}', C.schoolMark(S.schoolBest[g])) : t('par_noexam'),
      (S.mistakes || []).length ? t('par_hard') + ' ' + S.mistakes.map(byId).filter(Boolean).slice(0, 5).map(function (x) { return x.w[0]; }).join(', ') : '',
      SITE];
    return lines.filter(Boolean).join('\n');
  }
  /* ---------- Was kann English Trail? Übersicht für Kinder und für Eltern & Lehrkräfte ---------- */
  function renderGuide(who) {
    who = who === 'adults' ? 'adults' : 'kids';
    var G = D.guide || {}, list = G[who] || [];
    shell('<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>❓ ' + esc(t('gd_title')) + '</h1>' +
      '<div class="seg" role="tablist"><button class="chip" role="tab" data-gw="kids" aria-pressed="' + (who === 'kids') + '">🧒 ' + esc(t('gd_kids')) + '</button><button class="chip" role="tab" data-gw="adults" aria-pressed="' + (who === 'adults') + '">👪 ' + esc(t('gd_adults')) + '</button></div>' +
      list.map(function (sec) { return '<section class="card stack"><h2>' + esc(sec.ico + ' ' + sec.t) + '</h2><ul class="news-ul">' + sec.items.map(function (it) { return '<li class="small"><b>' + esc(it[0]) + '</b> – ' + esc(it[1]) + '</li>'; }).join('') + '</ul>' + (sec.go ? '<button class="btn" data-gg="' + esc(sec.go) + '" style="justify-self:start">' + esc(t('gd_try')) + ' →</button>' : '') + '</section>'; }).join(''));
    document.getElementById('back').onclick = function () { go('me'); };
    document.querySelectorAll('[data-gw]').forEach(function (b) { b.onclick = function () { renderGuide(b.getAttribute('data-gw')); }; });
    document.querySelectorAll('[data-gg]').forEach(function (b) { b.onclick = function () { go(b.getAttribute('data-gg')); }; });
  }
  function newsItems(n) { return (D.news || []).slice(0, n || 99); }
  function newsHtml(x) { return '<div class="stack" style="gap:4px"><b class="num">' + esc(t('news_ver')) + ' ' + esc(x.v) + ' <span class="small muted">· ' + esc(new Date(x.date + 'T12:00').toLocaleDateString(S.base === 'en' ? 'en-GB' : 'de-DE', { day: 'numeric', month: 'long', year: 'numeric' })) + '</span></b><ul class="news-ul">' + (S.base === 'en' ? x.en : x.de).map(function (l) { return '<li class="small">' + esc(l) + '</li>'; }).join('') + '</ul></div>'; }
  function newsBox() {
    var top = newsItems(1)[0]; if (!top || S.seenVer === APP_VER) return '';   /* neue Nutzer: seenVer wird im Onboarding gesetzt */
    return '<section class="card stack pop news" id="nw"><div class="row" style="justify-content:space-between"><span class="eyebrow">✨ ' + esc(t('news_new')) + '</span><button class="icon-btn" id="nw-x" aria-label="' + esc(t('wr_close')) + '">' + I.x + '</button></div>' + newsHtml(top) +
      '<button class="btn ghost" id="nw-all" style="justify-self:start;padding-left:0">' + esc(t('news_all')) + ' →</button></section>';
  }
  function renderNews() {
    shell('<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('news')) + '</h1><section class="card stack">' + newsItems().map(newsHtml).join('<hr class="news-hr">') + '</section><button class="btn" id="nw-guide" style="justify-self:start">❓ ' + esc(t('gd_title')) + ' →</button>');
    document.getElementById('nw-guide').onclick = function () { go('guide', 'kids'); };
    document.getElementById('back').onclick = function () { go('me'); };
    if (S.seenVer !== APP_VER) { S.seenVer = APP_VER; save(); }
  }
  function tileBtn(k, title, desc, extra) { return '<button class="tile" data-mode="' + k + '"><span class="t">' + esc(title) + '</span><span class="d">' + esc(desc) + '</span>' + (extra || '') + '</button>'; }
  function bindTiles(ui) { document.querySelectorAll('[data-mode]').forEach(function (b) { b.onclick = function () { startMode(b.getAttribute('data-mode'), ui); }; }); }

  /* ---------- Stadt ---------- */
  function renderCity(ui) {
    ui = ui == null ? 0 : ui; var u = U[ui], locked = !isOpen(ui);
    var list = wordsOf(ui), m = masteredCount(list);
    var html = '<section class="city-head"><button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('home')) + '</button>' +
      '<div class="row">' + (u.pack ? '<span aria-hidden="true">' + esc(u.ico) + '</span><span class="eyebrow">' + esc(t('pack')) + ' · ' + esc(cityName(u)) + '</span>' : blaze(u.trail) + '<span class="eyebrow">Trail ' + szlakOf(ui) + ' · ' + (szlakUnits(szlakOf(ui)).indexOf(ui) + 1) + ' / ' + szlakUnits(szlakOf(ui)).length + ' · ' + esc(cityName(u)) + '</span>' + (u.beta ? '<span class="badge" title="' + esc(t('beta_d')) + '">Beta</span>' : '')) + '</div>' +
      '<div class="pl">' + esc(u.city) + '</div><h2>' + esc(L(u.title)) + '</h2>' +
      '<div class="row small muted num"><div class="bar" style="flex:1;max-width:240px"><i style="width:' + (m / list.length * 100) + '%"></i></div>' + m + '/' + list.length + ' ' + esc(t('city_progress')) + (S.boss[u.id] ? ' · <span class="badge good">' + esc(t('passed')) + '</span>' : (S.skipped[u.id] ? ' · <span class="badge">' + esc(t('skipped_city')) + '</span>' : '')) + '</div></section>' +
      '<section class="card stack"><span class="eyebrow">' + esc(t('can')) + '</span><p>' + esc(L(u.can)) + '</p></section>';
    if (locked) {
      html += '<section class="card stack"><b>' + esc(t('locked')) + '</b><button class="btn primary" data-mode="boss">' + esc(t('test_out')) + '</button><button class="btn" id="skip-city">' + esc(t('skip_city')) + '</button><p class="small muted">' + esc(t('skip_city_d')) + '</p>' +
        '<button class="btn ghost" id="open-city" style="justify-self:start">' + esc(t('open_city')) + '</button><p class="small muted">' + esc(t('open_city_d')) + '</p></section>';
    } else {
      var nst = cityStep(ui), rp = C.cityRipe(S, u.id, list.length), ready = S.boss[u.id] || (rp.seen >= rp.n && rp.ripe >= rp.need), nx = function (k) { return k === nst ? '<span class="badge next">' + esc(t('next_up')) + '</span>' : ''; };
      if (!S.boss[u.id]) html += '<section class="card stack ripe"><div class="row" style="justify-content:space-between"><span class="eyebrow">' + esc(t('ripe_title')) + '</span><span class="small num">' + rp.ripe + '/' + rp.need + '</span></div>' +
        '<div class="bar"><i style="width:' + Math.min(100, rp.ripe / rp.need * 100) + '%"></i></div><p class="small muted">' + esc(ready ? t('ripe_ok') : rp.seen < rp.n ? t('ripe_learn').replace('{n}', rp.n - rp.seen) : nst === 'wait' ? t('ripe_wait') : t('ripe_d')) + '</p>' +
        (nst === 'ripen' ? '<button class="btn primary" data-mode="ripen" style="justify-self:start">' + esc(t('ripen')) + ' · ' + ripenList(ui).length + '</button>' : '') + '</section>';
      html += '<section class="tiles">' +
        tileBtn('learn', t('learn'), t('learn_d'), nx('learn')) + tileBtn('scene', t('scene'), t('scene_d'), S.scenes[u.id] ? '<span class="badge good">✓</span>' : nx('scene')) +
        (u.read ? tileBtn('read', t('rd_tile'), t('rd_tile_d'), S.read && S.read[u.id] != null ? '<span class="badge good num">' + S.read[u.id] + '%</span>' : '<span class="badge next">📖</span>') : '') +
        tileBtn('quiz', t('quiz'), t('quiz_d'), nx('quiz')) + tileBtn('listen', t('listen'), t('listen_d')) +
        tileBtn('type', t('type'), t('type_d')) + tileBtn('build', t('build'), t('build_d'), nx('build')) +
        tileBtn('cloze', t('cloze'), t('cloze_d')) + tileBtn('match', t('match'), t('match_d')) +
        tileBtn('speak', t('speak'), t('speak_d')) + tileBtn('chat', t('chat'), t('chat_city_d'), '<span class="badge">Beta</span>') + tileBtn('boss', t('boss'), t('boss_d'), S.boss[u.id] ? '<span class="badge good num">' + S.boss[u.id] + '%</span>' : ready ? nx('boss') : '<span class="badge num">🔒 ' + rp.ripe + '/' + rp.need + '</span>') +
        '</section>';
      if (!S.boss[u.id] && !u.pack && ui < lastRoute()) html += '<button class="btn ghost" id="skip-city" style="justify-self:start">' + esc(t('skip_city')) + ' →</button>';
      html += missionBox(u);
    }
    html += '<section class="tip"><span class="eyebrow">' + esc(t('tip')) + '</span><p>' + esc(L(u.tip)) + '</p></section>' + radioBox(u) +
      sureBox(ui, list) +
      '<section class="card"><span class="eyebrow">' + esc(t('words')) + '</span><div class="list">' +
      list.map(function (x) {
        var c = S.cards[x.id], b = c ? c.box : 0, dots = '';
        for (var i = 1; i <= C.MASTERED_BOX; i++) dots += '<i class="' + (b >= i ? 'on' : '') + '"></i>';
        return '<div class="li"><button class="icon-btn" data-say="' + esc(x.w[0]) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button>' +
          '<div class="grow"><div class="pl-word">' + esc(x.w[0]) + '</div><div class="small muted">' + esc(meaning(x.w)) + '</div></div><span class="box-dots" aria-hidden="true">' + dots + '</span></div>';
      }).join('') + '</div></section>';
    shell(html);
    document.getElementById('back').onclick = function () { if (u.sch || (u.int && S.school && S.school.grade && !cityBack)) go('school'); else if (cityBack) { var th = cityBack; cityBack = null; go('themes', th); } else go('home'); };
    var oc = document.getElementById('open-city'); if (oc) oc.onclick = function () { S.opened = S.opened || {}; S.opened[u.id] = today(); save(); renderCity(ui); };
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
    bindTiles(ui);
    var bt = !locked && !ready && document.querySelector('.tiles [data-mode="boss"]');
    if (bt) bt.onclick = function () { toast(t('boss_locked').replace('{r}', rp.ripe).replace('{n}', rp.need)); var rs = document.querySelector('.ripe'); if (rs) rs.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
    var sk = document.getElementById('skip-city'); if (sk) sk.onclick = function () { skipCity(ui); };
    var mi = document.getElementById('mis'); if (mi) mi.onclick = function () {
      if (S.missions[u.id]) return;
      S.missions[u.id] = today(); addXp(15); markActive(); save(); toast(t('mission_xp')); confetti(); renderCity(ui);
    };
  }
  /* Mini-Mission (Vorschlag H): freiwillige Aufgabe im echten Leben, eine pro Stadt */
  function missionBox(u) {
    var m = D.missions && D.missions[u.id]; if (!m) return '';
    var done = S.missions && S.missions[u.id];
    return '<section class="card stack mission"><div class="row" style="justify-content:space-between"><span class="eyebrow">' + esc(t('mission')) + '</span>' + (done ? '<span class="badge good">✓ ' + esc(t('mission_ok')) + '</span>' : '') + '</div>' +
      '<p class="lt-pl" lang="en">' + esc(m.pl) + '</p><p class="small">' + esc(L(m.d)) + '</p>' +
      (done ? '' : '<p class="small muted">' + esc(t('mission_d')) + '</p><button class="btn" id="mis" style="justify-self:start">✓ ' + esc(t('mission_done')) + ' · +15 XP</button>') + '</section>';
  }
  /* Echtes Polnisch hören (Vorschlag I): Radio der Region, externe Seite */
  function extLink(name, url, cls) { return '<a class="' + (cls || 'btn') + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(name) + ' <span aria-hidden="true">↗</span><span class="sr-only"> (' + esc(t('ext')) + ')</span></a>'; }
  function radioBox(u) {
    var r = D.listen && D.listen.radio && D.listen.radio[u.id]; if (!r) return '';
    return '<section class="card stack"><span class="eyebrow">' + esc(t('hear')) + '</span><p class="small">' + esc(t('hear_d')) + '</p>' + extLink(r[0], r[1]).replace('class="btn"', 'class="btn" style="justify-self:start"') + '</section>';
  }
  function skipCity(ui) {
    for (var i = 0; i <= ui; i++) if (!S.boss[U[i].id]) S.skipped[U[i].id] = true;
    var lr = lastRoute(); if (ui < lr) S.unlocked = Math.max(S.unlocked, ui + 1);
    save(); toast(t('skipped_toast') + ' ' + U[Math.min(ui + 1, lr)].city); go('city', Math.min(ui + 1, lr));
  }

  /* ---------- Üben ---------- */
  function renderPractice() {
    var due = dueList().length;
    var html = '<h1>' + esc(t('nav_practice')) + '</h1><section class="tiles">' +
      tileBtn('live', '⚡ ' + t('live'), t('live_tile_d')) +
      tileBtn('school', '🎒 ' + t('sch'), S.school && S.school.grade ? t('sch_grade').replace('{g}', S.school.grade) : t('sch_d')) +
      tileBtn('review', t('review'), t('review_d'), due ? '<span class="badge num">' + due + ' ' + esc(t('due')) + '</span>' : '') +
      tileBtn('lex', t('lex'), t('lex_d'), '<span class="badge num">' + allWords().filter(function (x) { return S.cards[x.id]; }).length + '</span>') +
      (szlakUnits(3).length ? tileBtn('exam', '🎓 ' + t('ex_title'), t('ex_tile_d'), S.exam && S.exam.best ? '<span class="badge ' + (S.exam.passed ? 'good' : '') + ' num">' + S.exam.best + '%</span>' : '') : '') +
      tileBtn('themes', t('themes'), t('themes_d')) + tileBtn('daily', t('daily'), t('daily_d')) + tileBtn('blitz', t('blitz'), t('blitz_d')) + tileBtn('survival', t('survival'), t('survival_d'), S.best.survival ? '<span class="badge num">' + esc(t('best')) + ' ' + S.best.survival + '</span>' : '') + tileBtn('cases', t('cases'), t('cases_d')) + tileBtn('chat', t('chat'), t('chat_d'), '<span class="badge">Beta</span>') + tileBtn('conj', t('conj'), t('conj_d')) + tileBtn('aspect', t('aspect'), t('aspect_d')) + 
      tileBtn('sounds', t('sounds'), t('sounds_d')) + tileBtn('prices', t('prices'), t('prices_d')) +
      tileBtn('twister', t('twister'), t('twister_d')) + tileBtn('memo_w', t('memo_w'), t('memo_w_d')) + tileBtn('duel', t('duel'), t('duel_d')) + tileBtn('face', t('face'), t('face_d')) +
      tileBtn('mistakes', t('mistakes'), t('mistakes_d'), S.mistakes.length ? '<span class="badge num">' + S.mistakes.length + '</span>' : '') +
      tileBtn('mywords', t('mywords'), t('mywords_d'), S.custom.length ? '<span class="badge num">' + S.custom.length + '</span>' : '') +
      '</section>';
    shell(html); bindTiles();
  }

  /* ---------- Land und Leute ---------- */
  function renderLand() {
    var K = D.culture;
    var html = '<h1>' + esc(t('land')) + '</h1><p class="muted">' + esc(t('land_d')) + '</p>' +
      (RAW.polacy || RAW.polacyLazy ? '<button class="card pol-entry" data-mode="polacy" lang="en"><span class="pol-flag" aria-hidden="true"></span><span class="stack" style="gap:2px;text-align:left"><b>' + esc(t('pol')) + '</b><span class="small muted">' + esc(t('pol_d')) + '</span>' +
        (S.plv != null ? '<span class="small"><b>' + esc(t('pol_lv')) + ':</b> ' + esc(t('pol_lv' + S.plv)) + '</span>' : '') + '</span></button>' : '') +
      '<section class="tiles">' + tileBtn('whoami', t('whoami'), t('whoami_d')) + tileBtn('tf', t('tf'), t('tf_d')) + tileBtn('timeline', t('timeline'), t('timeline_d')) +
      tileBtn('pin', t('pin'), t('pin_d')) + tileBtn('hl', t('hl'), t('hl_d')) + tileBtn('literki', t('literki'), t('literki_d')) +
      tileBtn('memo_p', t('memo_p'), t('memo_p_d')) + tileBtn('memo_y', t('memo_y'), t('memo_y_d')) + '</section>' +
      '<section class="card"><span class="eyebrow">' + esc(t('facts')) + '</span><div class="list">' +
      K.facts.map(function (f) { return '<div class="li"><span class="grow muted small">' + esc(S.base === 'en' ? f[1] : f[0]) + '</span><b class="num" style="text-align:right">' + esc(f[2]) + '</b></div>'; }).join('') + '</div></section>' +
      (D.listen && D.listen.learn ? '<section class="card stack" id="hear-more"><span class="eyebrow">' + esc(t('hear_more')) + '</span><p class="small muted">' + esc(t('hear_more_d')) + '</p><div class="list">' +
        D.listen.learn.map(function (x) { return '<div class="li"><div class="grow">' + extLink(x[0], x[1], 'ext') + '<div class="small muted">' + esc(S.base === 'en' ? x[3] : x[2]) + '</div></div></div>'; }).join('') + '</div></section>' : '');
    shell(html); bindTiles();
  }

  /* ---------- Album ---------- */
  function renderAlbum() {
    var html = '<h1>' + esc(t('nav_album')) + '</h1><section class="stack"><h2>' + esc(t('postcards')) + ' <span class="muted num">' + routeIdx().filter(function (i) { return S.boss[U[i].id]; }).length + '/' + routeIdx().length + '</span></h2><div class="grid2">' +
      routeIdx().map(function (i) {
        var u = U[i], got = !!S.boss[u.id];
        return '<article class="postcard tr-' + u.trail + (got ? '' : ' locked') + '"><div class="pc-top"><div class="row" style="justify-content:space-between;align-items:start"><div><div class="pl">' + esc(u.city) + '</div><div class="small muted">' + esc(L(u.title)) + '</div></div><div class="stamp">' + (got ? 'PL' : (i + 1)) + '</div></div></div>' +
          '<div class="pc-bot">' + (got ? esc(L(u.fact)) : '<span class="muted">' + esc(t('locked')) + '</span>') + '</div></article>';
      }).join('') + '</div></section>' +
      '<section class="stack"><h2>' + esc(t('krasnale')) + ' <span class="muted num">' + S.krasnale.length + '/' + D.krasnale.length + '</span></h2><p class="small muted">' + esc(t('krasnal_hint')) + '</p><div class="grid3">' +
      D.krasnale.map(function (k, i) {
        var got = S.krasnale.indexOf(i) >= 0;
        return '<div class="card krasnal' + (got ? '' : ' locked') + '">' + krasnalSvg() + '<b class="small">' + (got ? esc(k[0]) : '?') + '</b>' + (got ? '<span class="small muted">' + esc(k[1]) + ' = ' + esc(S.base === 'en' ? k[3] : k[2]) + '</span>' : '') + '</div>';
      }).join('') + '</div></section>';
    shell(html);
  }

  /* ---------- Ich / Einstellungen ---------- */
  /* ---------- Der Brief (Rahmengeschichte) ---------- */
  function storyOf(w) { return w === 'diary' ? D.diary : D.letter; }
  function letterLines(w) { var s = storyOf(w); return (s && s.lines) || []; }
  function seenKey(w) { return w === 'diary' ? 'diarySeen' : 'letterSeen'; }
  /* Startseite: der Brief (Szlak 1), ab Szlak 2 Anias Postkarten */
  function storyCard() { var r2 = szlakUnits(2), r3 = szlakUnits(3); if (D.book && r3.length && S.unlocked >= r3[0]) return bookCard(); return letterCard(D.diary && r2.length && S.unlocked >= r2[0] ? 'diary' : 'letter'); }
  /* 3.3 Szlak 3: Anias Buch „Klucz z Wieliczki“ – ein Kapitel pro Stadt (Lesetext + Verständnisfragen) */
  function bookCard() {
    var r3 = szlakUnits(3), rd = S.read || {}, n = r3.filter(function (i) { return rd[U[i].id] != null; }).length;
    var nx = r3.filter(function (i) { return isOpen(i) && rd[U[i].id] == null; })[0];
    return '<section class="card stack letter-card"><div class="row" style="justify-content:space-between"><span class="eyebrow">📖 ' + esc(D.book.title) + '</span>' +
      (nx != null ? '<span class="badge next">' + esc(t('rd_new')) + '</span>' : '<span class="small muted num">' + n + '/' + r3.length + '</span>') + '</div>' +
      '<p class="small">' + esc(n ? t('rd_card_d').replace('{n}', n).replace('{t}', r3.length) : L(D.book.prolog)) + '</p>' +
      '<div class="bar"><i style="width:' + (n / r3.length * 100) + '%"></i></div>' +
      (nx != null ? '<button class="btn" id="book-open" data-ui="' + nx + '" style="justify-self:start">' + esc(t('rd_open').replace('{n}', r3.indexOf(nx) + 1)) + ' →</button>' : '') +
      (n === r3.length ? '<p class="small">' + esc(L(D.book.finale)) + '</p><button class="btn primary" id="exam-open" style="justify-self:start">🎓 ' + esc(t('ex_start_btn')) + ' →</button>' : '') + '</section>';
  }
  var rdShow = false, rdAns = null;
  function renderRead(ui) {
    var u = U[ui]; if (!u || !u.read) return go('home');
    var rd = u.read, r3 = szlakUnits(3), no = r3.indexOf(ui) + 1, best = S.read && S.read[u.id];
    if (!rdAns || rdAns.ui !== ui) rdAns = { ui: ui, pick: {}, done: false, order: rd.q.map(function (q) { return C.shuffle(q.o.map(function (o, k) { return k; }), R); }) };
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(u.city) + '</button>' +
      '<span class="eyebrow">📖 ' + esc(D.book ? D.book.title : '') + ' · ' + esc(t('rd_chapter')) + ' ' + no + '/' + r3.length + (u.beta ? ' · Beta' : '') + '</span><h1>' + esc(L(rd.t)) + '</h1>' +
      (no === 1 && D.book ? '<section class="card row letter-szymek" style="align-items:start"><div class="krasnal" style="padding:0">' + krasnalSvg() + '</div><p class="small scene-intro grow">' + esc(L(D.book.prolog)) + '</p></section>' : '') +
      '<div class="row"><button class="btn" id="rd-all">' + I.spk + esc(t('rd_listen')) + '</button><label class="row small"><input type="checkbox" id="rd-tr"' + (rdShow ? ' checked' : '') + '> ' + esc(t('rd_tr')) + '</label></div>' +
      '<article class="card stack book" lang="en">' + rd.lines.map(function (l, i) {
        return '<div class="rd-line"><p><button class="rd-pl" data-i="' + i + '">' + esc(l.pl) + '</button></p><p class="small muted rd-trl" lang="' + S.base + '"' + (rdShow ? '' : ' hidden') + '>' + esc(L(l.tr)) + '</p></div>';
      }).join('') + '</article><p class="small muted">' + esc(t('rd_hint')) + '</p>' +
      '<section class="card stack"><h2>' + esc(t('rd_q')) + '</h2>' + rd.q.map(function (q, qi) {
        var pk = rdAns.pick[qi];
        return '<fieldset class="rd-q stack"><legend><b lang="en">' + esc(q.q) + '</b> <span class="small muted">(' + esc(L(q.tr)) + ')</span></legend>' + rdAns.order[qi].map(function (k) {
          var cls = rdAns.done ? (k === q.a ? ' right' : pk === k ? ' wrong' : '') : (pk === k ? ' sel' : '');
          return '<button class="opt' + cls + '" data-q="' + qi + '" data-k="' + k + '" lang="en"' + (rdAns.done ? ' disabled' : '') + '>' + esc(q.o[k]) + '</button>';
        }).join('') + '</fieldset>';
      }).join('') +
      (rdAns.done ? '<div class="banner pop"><strong class="num">' + rdAns.score + ' %</strong> · ' + esc(rdAns.score === 100 ? t('rd_perfect') : t('rd_ok')) + '</div><div class="row"><button class="btn" id="rd-again">' + esc(t('again')) + '</button><button class="btn primary" id="rd-chat">💬 ' + esc(t('rd_talk')) + '</button></div>'
        : '<button class="btn primary" id="rd-check" style="justify-self:start"' + (Object.keys(rdAns.pick).length < rd.q.length ? ' disabled' : '') + '>' + esc(t('check')) + '</button>') +
      (best != null ? '<p class="small muted num">' + esc(t('best')) + ': ' + best + ' %</p>' : '') + '</section>' +
      (rdAns.done && no === r3.length && D.book ? '<section class="card stack next-box pop"><p>' + esc(L(D.book.finale)) + '</p><button class="btn primary" id="exam-open2" style="justify-self:start">🎓 ' + esc(t('ex_start_btn')) + ' →</button></section>' : '');
    shell(html);
    document.getElementById('back').onclick = function () { rdAns = null; tab = 'city'; render(ui); window.scrollTo(0, 0); };
    document.getElementById('rd-all').onclick = function () { speakSeq(rd.lines.map(function (l) { return l.pl; })); };
    document.getElementById('rd-tr').onchange = function (e) { rdShow = e.target.checked; document.querySelectorAll('.rd-trl').forEach(function (x) { x.hidden = !rdShow; }); };
    document.querySelectorAll('.rd-pl').forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-i'); speak(rd.lines[i].pl); var tr = b.parentNode.nextSibling; if (tr) tr.hidden = false; }; });
    document.querySelectorAll('.rd-q .opt').forEach(function (b) { b.onclick = function () { rdAns.pick[+b.getAttribute('data-q')] = +b.getAttribute('data-k'); renderRead(ui); }; });
    var ck = document.getElementById('rd-check'); if (ck) ck.onclick = function () {
      var ok = rd.q.filter(function (q, qi) { return rdAns.pick[qi] === q.a; }).length, sc = Math.round(ok / rd.q.length * 100), first = !(S.read && S.read[u.id] != null);
      rdAns.done = true; rdAns.score = sc; S.read = S.read || {}; S.read[u.id] = Math.max(S.read[u.id] || 0, sc);
      addXp(first ? 10 + ok * 10 : ok * 3); markActive(); save(); renderRead(ui); toast('+' + (first ? 10 + ok * 10 : ok * 3) + ' XP');
    };
    var ag = document.getElementById('rd-again'); if (ag) ag.onclick = function () { rdAns = null; renderRead(ui); };
    var tc = document.getElementById('rd-chat'); if (tc) tc.onclick = function () { rdAns = null; startMode('chat', ui); };
    ['exam-open2'].forEach(function (id) { var b = document.getElementById(id); if (b) b.onclick = function () { go('exam'); }; });
  }
  function unitById(id) { for (var i = 0; i < U.length; i++) if (U[i].id === id) return U[i]; return null; }
  function letterCard(w) {
    var dy = w === 'diary', lines = letterLines(w), n = C.letterRead(lines, S).filter(Boolean).length, tot = lines.length, isNew = n > (S[seenKey(w)] || 0);
    if (!tot) return '';
    return '<section class="card stack letter-card"><div class="row" style="justify-content:space-between"><span class="eyebrow">✉ ' + esc(t(dy ? 'diary' : 'letter')) + '</span>' +
      (isNew ? '<span class="badge next">' + esc(t(dy ? 'diary_new' : 'letter_new')) + '</span>' : '<span class="small muted num">' + n + '/' + tot + '</span>') + '</div>' +
      '<p class="small">' + esc(n ? (n === tot && !isNew ? t(dy ? 'diary_done' : 'letter_done') : t(dy ? 'diary_d' : 'letter_d').replace('{n}', n).replace('{t}', tot)) : t(dy ? 'diary_start' : 'letter_start')) + '</p>' +
      '<div class="bar"><i style="width:' + (n / tot * 100) + '%"></i></div><button class="btn" id="letter-open" data-story="' + (dy ? 'diary' : 'letter') + '" style="justify-self:start">' + esc(t(dy ? 'diary_open' : 'letter_open')) + ' →</button>' +
      (dy ? '<button class="btn ghost small" id="letter-old" style="justify-self:start;min-height:36px;padding:4px 0">✉ ' + esc(t('letter')) + ' →</button>' : '') + '</section>';
  }
  function letterLineHtml(l, readable, fresh) {
    if (!readable) { var u = unitById(l.u); return '<div class="lt-line locked"><p class="lt-pl" aria-hidden="true">' + esc(l.pl) + '</p><p class="small muted">' + esc(t('letter_locked').replace('{c}', u ? u.city : '')) + '</p></div>'; }
    return '<div class="lt-line' + (fresh ? ' fresh' : '') + '"><div class="row" style="align-items:start"><p class="lt-pl grow" lang="en">' + esc(l.pl) + '</p><button class="icon-btn" data-say="' + esc(l.pl) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button></div><p class="small muted">' + esc(L(l.tr)) + '</p></div>';
  }
  function renderLetter(w) {
    w = w === 'diary' && D.diary ? 'diary' : 'letter';
    var dy = w === 'diary', ST = storyOf(w), lines = letterLines(w), rd = C.letterRead(lines, S), n = rd.filter(Boolean).length, seen = S[seenKey(w)] || 0, all = n === lines.length, k = 0;
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('home')) + '</button><h1>' + esc(t(dy ? 'diary' : 'letter')) + '</h1>' +
      (D.diary ? '<div class="seg" id="story-sw">' + segBtn('letter', t('letter'), !dy) + segBtn('diary', t('diary'), dy) + '</div>' : '') +
      '<section class="card row letter-szymek" style="align-items:start"><div class="krasnal" style="padding:0">' + krasnalSvg() + '</div><p class="small scene-intro grow">' + esc(L(ST.prolog)) + '</p></section>' +
      '<article class="card stack letter" aria-label="' + esc(t(dy ? 'diary_from' : 'letter_from')) + '"><span class="eyebrow">' + esc(t(dy ? 'diary_from' : 'letter_from')) + ' · <span class="num">' + n + '/' + lines.length + '</span></span>' +
      lines.map(function (l, i) { var fresh = rd[i] && ++k > seen; return letterLineHtml(l, rd[i], fresh && seen > 0); }).join('') + '</article>' +
      (all ? '<section class="card stack next-box pop"><span class="eyebrow">' + esc(unitById(lines[lines.length - 1].u).city) + '</span><p>' + esc(L(ST.finale)) + '</p></section>' +
        (!dy && D.letterQuiz ? '<section class="card stack letter-card"><span class="eyebrow">✉ ' + esc(t('lq')) + '</span><p class="small">' + esc(t('lq_d')) + '</p>' + (S.letterQuiz ? '<p class="small muted num">' + esc(t('lq_best')) + ': ' + S.letterQuiz + ' %</p>' : '') +
          '<button class="btn primary" id="lq" style="justify-self:start">' + esc(t('lq_start')) + ' →</button></section>' : '') : '');
    shell(html);
    var lqb = document.getElementById('lq'); if (lqb) lqb.onclick = function () { startMode('letterquiz'); };
    if (n !== seen) { S[seenKey(w)] = n; save(); }
    bindSeg('story-sw', function (v) { renderLetter(v); });
    document.getElementById('back').onclick = function () { go('home'); };
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
  }
  /* Nach der ersten bestandenen Stadtprüfung: der neue Satz, dazu Szymeks Ausblick oder das Finale */
  function letterNewBox(uid) {
    var w = 'letter', lines = letterLines(w), i = -1, j;
    for (j = 0; j < lines.length; j++) if (lines[j].u === uid) i = j;
    if (i < 0 && D.diary) { w = 'diary'; lines = letterLines(w); for (j = 0; j < lines.length; j++) if (lines[j].u === uid) i = j; }
    if (i < 0) return '';
    var l = lines[i], all = C.letterRead(lines, S).every(Boolean), dy = w === 'diary';
    return '<div class="card stack letter-card pop" style="text-align:left;width:100%"><span class="eyebrow">✉ ' + esc(t(dy ? 'diary_new' : 'letter_new')) + '</span>' +
      '<p class="lt-pl" lang="en">' + esc(l.pl) + '</p><p class="small muted">' + esc(L(l.tr)) + '</p>' +
      '<p class="small scene-intro">' + esc(L((all || !l.bridge) ? storyOf(w).finale : l.bridge)) + '</p>' +
      '<button class="btn" id="letter-res" data-story="' + w + '" style="justify-self:start">' + esc(t(dy ? 'diary_open' : 'letter_open')) + ' →</button></div>';
  }

  /* Szymek am Anfang jeder Stadt-Szene: sein Ausblick aus der vorigen Stadt (in Warschau: der Prolog) */
  function szymekBubble(ui) {
    if (!D.letter || isPack(ui)) return '';
    var txt = null, r2 = szlakUnits(2);
    if (ui === 0) txt = D.letter.prolog;
    else if (D.diary && ui === r2[0]) txt = D.diary.prolog;
    else if (D.book && ui === szlakUnits(3)[0]) txt = D.book.prolog;
    else { var pu = U[ui - 1].id; letterLines('letter').concat(letterLines('diary')).forEach(function (l) { if (l.u === pu && l.bridge) txt = l.bridge; }); }
    if (!txt) return '';
    return '<div class="szymek row pop"><div class="krasnal" style="padding:0">' + krasnalSvg() + '</div><p class="small grow">' + (ui ? '<b>Szymek:</b> ' : '') + esc(L(txt)) + '</p></div>';
  }


  /* ---------- 3.3 B1-Probeprüfung: fünf Teile wie die staatliche Prüfung (Hören, Grammatik, Lesen, Schreiben, Sprechen) ----------
     Spielerisch: kein Zeitdruck, sofortige Rückmeldung, jedes Mal andere Aufgaben. Bestanden: im Schnitt ≥ 60 % und jeder Teil ≥ 50 %. */
  var EX = null;
  var EX_WRITE = [
    { pl: 'Napisz e-mail do właściciela mieszkania: od tygodnia nie działa ogrzewanie. Opisz problem i poproś o pomoc.', d: ['E-Mail an den Vermieter: Die Heizung geht seit einer Woche nicht. Problem beschreiben, um Hilfe bitten.', 'Email to your landlord: the heating hasn’t worked for a week. Describe the problem and ask for help.'] },
    { pl: 'Napisz wiadomość do koleżanki: opowiedz, co robiłeś albo robiłaś w weekend, i zaproś ją na kawę.', d: ['Nachricht an eine Freundin: Erzähl vom Wochenende und lade sie auf einen Kaffee ein.', 'Message to a friend: tell her about your weekend and invite her for coffee.'] },
    { pl: 'Napisz krótką opinię o filmie albo książce: o czym jest i czy ci się podobał. Dlaczego?', d: ['Kurze Meinung zu einem Film oder Buch: Worum geht es, hat es dir gefallen, warum?', 'A short opinion on a film or book: what it’s about, whether you liked it, why.'] },
    { pl: 'Napisz e-mail do hotelu: chcesz zarezerwować pokój na dwie noce i masz dwa pytania.', d: ['E-Mail an ein Hotel: Du willst ein Zimmer für zwei Nächte buchen und hast zwei Fragen.', 'Email to a hotel: you want to book a room for two nights and have two questions.'] }];
  var EX_SPEAK = [
    { pl: 'Opowiedz o swojej ostatniej podróży: gdzie byłeś albo byłaś i co się wydarzyło?', d: ['Erzähl von deiner letzten Reise: Wo warst du, was ist passiert?', 'Talk about your last trip: where were you and what happened?'] },
    { pl: 'Jakie jest twoje ulubione miejsce w Polsce albo w twoim kraju? Dlaczego?', d: ['Was ist dein Lieblingsort in Polen oder in deinem Land? Warum?', 'What is your favourite place in Poland or your country? Why?'] },
    { pl: 'Co byś zrobił albo zrobiła, gdybyś miał albo miała rok wolnego?', d: ['Was würdest du tun, wenn du ein Jahr frei hättest?', 'What would you do if you had a year off?'] },
    { pl: 'Czy lepiej mieszkać w mieście czy na wsi? Podaj argumenty.', d: ['Lebt man besser in der Stadt oder auf dem Land? Nenne Argumente.', 'Is it better to live in the city or the countryside? Give reasons.'] }];
  var EX_PARTS = ['listen', 'gram', 'read', 'write', 'speak'];
  function exNew() {
    var pool = []; routeIdx().forEach(function (i) { if (szlakOf(i) >= 2) U[i].sentences.forEach(function (x) { pool.push(x); }); });
    if (pool.length < 10) U.forEach(function (u) { u.sentences.forEach(function (x) { pool.push(x); }); });
    var ls = C.sample(pool, 5, R).map(function (x) {
      var wrong = C.sample(pool.filter(function (y) { return y !== x && L(y.slice(1)) !== L(x.slice(1)); }), 2, R);
      return { pl: x[0], a: L(x.slice(1)), o: C.shuffle([L(x.slice(1))].concat(wrong.map(function (y) { return L(y.slice(1)); })), R) };
    });
    var gr = C.sample(D.cases || [], 4, R).concat(C.sample(D.aspects || [], 2, R)).map(function (c) { return { s: c.s, a: c.a, o: C.shuffle(c.opts.slice(), R), tr: L(c.tr), why: L(c.why) }; });
    var rus = U.map(function (u, i) { return u.read ? i : -1; }).filter(function (i) { return i >= 0; }), ru = rus.length ? rus[Math.floor(R() * rus.length)] : null;
    EX = { step: 0, i: 0, pick: null, sc: {}, ls: ls, gr: gr, ru: ru, rpick: {}, rorder: ru == null ? [] : U[ru].read.q.map(function (q) { return C.shuffle(q.o.map(function (o, k) { return k; }), R); }),
      wt: EX_WRITE[Math.floor(R() * EX_WRITE.length)], st: EX_SPEAK[Math.floor(R() * EX_SPEAK.length)], txt: '', wres: null };
    if (ru == null) EX.sc.read = null;
  }
  /* Schreiben: einfache, nachvollziehbare Kriterien (Länge, Anrede, Bitte/Frage, Gruß, Zeitformen) */
  function exWriteScore(txt) {
    var tx = String(txt || ''), w = tx.trim().split(/\s+/).filter(Boolean).length, low = tx.toLowerCase();
    var crit = [
      ['ex_w_len', w >= 30],
      ['ex_w_hi', /\b(dzień dobry|szanown|cześć|witaj|hej|droga|drogi|kochana|kochany)/.test(low)],
      ['ex_w_ask', /\?|proszę|czy mógłby|czy mogłaby|czy możesz|chciałbym|chciałabym|zapraszam/.test(low)],
      ['ex_w_bye', /(pozdrawiam|pozdrowienia|z poważaniem|do zobaczenia|całuję|ściskam|trzymaj się|na razie)/.test(low)],
      ['ex_w_gram', /\b\w+(łem|łam|łeś|łaś|ł|ła|ło|liśmy|łyśmy|bym|byś)\b/.test(low) && /\b(bo|ponieważ|ale|więc|dlatego|że|który|która|które|kiedy|jeśli)\b/.test(low)]];
    return { w: w, crit: crit, score: Math.round(crit.filter(function (c) { return c[1]; }).length / crit.length * 100) };
  }
  function exTotal() { var v = EX_PARTS.map(function (k) { return EX.sc[k]; }).filter(function (x) { return x != null; }); return v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length) : 0; }
  function exPassed() { return exTotal() >= 60 && EX_PARTS.every(function (k) { return EX.sc[k] == null || EX.sc[k] >= 50; }); }
  function renderExam() {
    if (RAW.unitsLazy) return needS3(function () { renderExam(); });
    if (!EX) exNew();
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>🎓 ' + esc(t('ex_title')) + '</h1>';
    var prog = '<div class="ex-steps" aria-hidden="true">' + EX_PARTS.map(function (k, i) { return '<span class="' + (i + 1 < EX.step ? 'done' : i + 1 === EX.step ? 'cur' : '') + '">' + esc(t('ex_p_' + k)) + '</span>'; }).join('') + '</div>';
    var step = EX.step, part = EX_PARTS[step - 1];
    if (step === 0) {
      var ex = S.exam || {};
      html += '<section class="card stack"><p>' + esc(t('ex_intro')) + '</p><ul class="small ex-list">' + EX_PARTS.map(function (k) { return '<li><b>' + esc(t('ex_p_' + k)) + '</b> – ' + esc(t('ex_pd_' + k)) + '</li>'; }).join('') + '</ul>' +
        '<p class="small muted">' + esc(t('ex_note')) + '</p>' + (ex.best ? '<p class="small num">' + esc(t('best')) + ': ' + ex.best + ' %' + (ex.passed ? ' · ✓ ' + esc(t('ex_passed_once')) : '') + ' · ' + esc(t('ex_tries')) + ': ' + (ex.n || 0) + '</p>' : '') +
        '<button class="btn primary" id="ex-go" style="justify-self:start">' + esc(t('ex_go')) + ' →</button></section>';
    } else if (part === 'listen' || part === 'gram') {
      var list = part === 'listen' ? EX.ls : EX.gr, q = list[EX.i];
      html += prog + '<section class="card stack"><span class="eyebrow">' + esc(t('ex_p_' + part)) + ' · <span class="num">' + (EX.i + 1) + '/' + list.length + '</span></span>' +
        (part === 'listen' ? '<p>' + esc(t('ex_l_ask')) + '</p><button class="btn" id="ex-say">' + I.spk + esc(t('listen_again')) + '</button>' + (EX.pick != null ? '<p class="lt-pl" lang="en">' + esc(q.pl) + '</p>' : '')
          : '<p>' + esc(t('ex_g_ask')) + '</p><p class="lt-pl" lang="en">' + esc(q.s.replace('___', EX.pick != null ? q.a : '___')) + '</p>') +
        '<div class="stack">' + q.o.map(function (o) {
          var cls = EX.pick == null ? '' : (o === q.a ? ' right' : o === EX.pick ? ' wrong' : '');
          return '<button class="opt' + cls + '" data-o="' + esc(o) + '"' + (EX.pick != null ? ' disabled' : '') + (part === 'gram' ? ' lang="en"' : '') + '>' + esc(o) + '</button>';
        }).join('') + '</div>' +
        (EX.pick != null ? (part === 'gram' ? '<p class="small muted">' + esc(q.tr) + (q.why ? ' · ' + esc(q.why) : '') + '</p>' : '') + '<button class="btn primary" id="ex-next" style="justify-self:start">' + esc(t('next')) + ' →</button>' : '') + '</section>';
    } else if (part === 'read') {
      var u = U[EX.ru], rd = u.read, done = EX.rdone;
      html += prog + '<section class="card stack"><span class="eyebrow">' + esc(t('ex_p_read')) + ' · ' + esc(L(rd.t)) + '</span><article class="stack book" lang="en">' + rd.lines.map(function (l) { return '<p>' + esc(l.pl) + '</p>'; }).join('') + '</article></section>' +
        '<section class="card stack">' + rd.q.map(function (qq, qi) {
          var pk = EX.rpick[qi];
          return '<fieldset class="rd-q stack"><legend><b lang="en">' + esc(qq.q) + '</b></legend>' + EX.rorder[qi].map(function (k) {
            var cls = done ? (k === qq.a ? ' right' : pk === k ? ' wrong' : '') : (pk === k ? ' sel' : '');
            return '<button class="opt' + cls + '" data-q="' + qi + '" data-k="' + k + '" lang="en"' + (done ? ' disabled' : '') + '>' + esc(qq.o[k]) + '</button>';
          }).join('') + '</fieldset>';
        }).join('') + (done ? '<button class="btn primary" id="ex-next" style="justify-self:start">' + esc(t('next')) + ' →</button>' : '<button class="btn primary" id="ex-rcheck" style="justify-self:start"' + (Object.keys(EX.rpick).length < rd.q.length ? ' disabled' : '') + '>' + esc(t('check')) + '</button>') + '</section>';
    } else if (part === 'write') {
      var wr = EX.wres;
      html += prog + '<section class="card stack"><span class="eyebrow">' + esc(t('ex_p_write')) + '</span><p class="lt-pl" lang="en">' + esc(EX.wt.pl) + '</p><p class="small muted">' + esc(L(EX.wt.d)) + '</p>' +
        '<textarea id="ex-txt" rows="7" lang="en" maxlength="1500" aria-label="' + esc(t('ex_p_write')) + '"' + (wr ? ' readonly' : '') + '>' + esc(EX.txt) + '</textarea>' + (wr ? '' : plKeys()) +
        '<p class="small muted num" id="ex-wc">' + exWriteScore(EX.txt).w + ' ' + esc(t('ex_words')) + '</p>' +
        (wr ? '<ul class="ex-crit">' + wr.crit.map(function (c) { return '<li class="' + (c[1] ? 'ok' : 'no') + '">' + (c[1] ? '✓ ' : '○ ') + esc(t(c[0])) + '</li>'; }).join('') + '</ul><p class="num"><b>' + wr.score + ' %</b></p>' +
          (A && A.uid ? '<button class="btn" id="ex-ai">💬 ' + esc(t('ex_ai_fix')) + '</button>' : '<p class="small muted">' + esc(t('ex_ai_login')) + '</p>') +
          '<button class="btn primary" id="ex-next" style="justify-self:start">' + esc(t('next')) + ' →</button>'
          : '<button class="btn primary" id="ex-wcheck" style="justify-self:start">' + esc(t('check')) + '</button>') + '</section>';
    } else if (part === 'speak') {
      html += prog + '<section class="card stack"><span class="eyebrow">' + esc(t('ex_p_speak')) + '</span><p class="lt-pl" lang="en">' + esc(EX.st.pl) + '</p><p class="small muted">' + esc(L(EX.st.d)) + '</p>' +
        '<p class="small">' + esc(t('ex_s_how')) + '</p>' +
        (A && A.uid ? '<button class="btn" id="ex-sai" style="justify-self:start">💬 ' + esc(t('ex_s_ai')) + '</button>' : '') +
        '<p><b>' + esc(t('ex_s_rate')) + '</b></p><div class="stack">' + [['100', 'ex_s_r1'], ['70', 'ex_s_r2'], ['40', 'ex_s_r3']].map(function (r) { return '<button class="opt" data-r="' + r[0] + '">' + esc(t(r[1])) + '</button>'; }).join('') + '</div></section>';
    } else {
      var tot = exTotal(), ok = exPassed();
      html += '<section class="card stack ex-result' + (ok ? ' pass' : '') + ' pop"><div class="row" style="align-items:center"><div class="krasnal" style="padding:0">' + krasnalSvg() + '</div><div class="stack grow" style="gap:4px"><span class="eyebrow">' + esc(t('ex_result')) + '</span><b class="num" style="font-size:2rem">' + tot + ' %</b><b>' + esc(ok ? t('ex_pass') : t('ex_fail')) + '</b></div></div>' +
        EX_PARTS.map(function (k) { var v = EX.sc[k]; return '<div class="stack" style="gap:2px"><div class="row small" style="justify-content:space-between"><span>' + esc(t('ex_p_' + k)) + '</span><span class="num">' + (v == null ? '–' : v + ' %') + '</span></div><div class="bar"><i style="width:' + (v || 0) + '%"></i></div></div>'; }).join('') +
        '<p class="small">' + esc(ok ? t('ex_pass_d') : t('ex_tip_' + EX_PARTS.filter(function (k) { return EX.sc[k] != null; }).sort(function (a, b) { return EX.sc[a] - EX.sc[b]; })[0])) + '</p>' +
        '<p class="small muted">' + esc(t('ex_disclaimer')) + '</p><div class="row"><button class="btn primary" id="ex-again">' + esc(t('again')) + '</button><button class="btn" id="ex-home">' + esc(t('home')) + '</button></div></section>';
    }
    shell(html);
    document.getElementById('back').onclick = function () { go('practice'); };
    var b;
    if ((b = document.getElementById('ex-go'))) b.onclick = function () { EX.step = 1; EX.i = 0; EX.pick = null; renderExam(); setTimeout(function () { if (EX.ls[0]) speak(EX.ls[0].pl); }, 300); };
    if ((b = document.getElementById('ex-say'))) b.onclick = function () { speak(EX.ls[EX.i].pl); };
    document.querySelectorAll('[data-o]').forEach(function (x) { x.onclick = function () {
      var list = part === 'listen' ? EX.ls : EX.gr, q = list[EX.i]; EX.pick = x.getAttribute('data-o');
      EX['n_' + part] = (EX['n_' + part] || 0) + (EX.pick === q.a ? 1 : 0); renderExam();
    }; });
    if ((b = document.getElementById('ex-next'))) b.onclick = function () {
      if (part === 'listen' || part === 'gram') {
        var list = part === 'listen' ? EX.ls : EX.gr;
        if (EX.i + 1 < list.length) { EX.i++; EX.pick = null; renderExam(); if (part === 'listen') setTimeout(function () { speak(EX.ls[EX.i].pl); }, 250); return; }
        EX.sc[part] = Math.round((EX['n_' + part] || 0) / list.length * 100);
      }
      EX.step++; EX.i = 0; EX.pick = null;
      if (EX_PARTS[EX.step - 1] === 'read' && EX.ru == null) EX.step++;
      if (EX.step > EX_PARTS.length) exFinish();
      renderExam(); window.scrollTo(0, 0);
    };
    document.querySelectorAll('.rd-q .opt').forEach(function (x) { x.onclick = function () { EX.rpick[+x.getAttribute('data-q')] = +x.getAttribute('data-k'); renderExam(); }; });
    if ((b = document.getElementById('ex-rcheck'))) b.onclick = function () { var q = U[EX.ru].read.q; EX.rdone = true; EX.sc.read = Math.round(q.filter(function (qq, qi) { return EX.rpick[qi] === qq.a; }).length / q.length * 100); renderExam(); };
    var ta = document.getElementById('ex-txt');
    if (ta && !EX.wres) { ta.oninput = function () { EX.txt = ta.value; var wc = document.getElementById('ex-wc'); if (wc) wc.textContent = exWriteScore(ta.value).w + ' ' + t('ex_words'); }; document.querySelectorAll('.pl-keys [data-k]').forEach(function (k) { k.onclick = function () { var p0 = ta.selectionStart || ta.value.length; ta.value = ta.value.slice(0, p0) + k.getAttribute('data-k') + ta.value.slice(ta.selectionEnd || p0); ta.focus(); ta.selectionStart = ta.selectionEnd = p0 + 1; ta.oninput(); }; }); }
    if ((b = document.getElementById('ex-wcheck'))) b.onclick = function () { EX.txt = ta.value; EX.wres = exWriteScore(EX.txt); EX.sc.write = EX.wres.score; renderExam(); };
    if ((b = document.getElementById('ex-ai'))) b.onclick = function () { startMode('chat', { txt: 'B1: ' + EX.wt.pl + ' – ' + t('ex_ai_sc'), open: t('ex_ai_open') }); setTimeout(function () { var i = document.getElementById('ch-in'); if (i) i.value = EX.txt.slice(0, 400); }, 60); };
    if ((b = document.getElementById('ex-sai'))) b.onclick = function () { startMode('chat', { txt: 'B1: ' + EX.st.pl, open: EX.st.pl }); };
    document.querySelectorAll('[data-r]').forEach(function (x) { x.onclick = function () { EX.sc.speak = +x.getAttribute('data-r'); EX.step++; exFinish(); renderExam(); window.scrollTo(0, 0); }; });
    if ((b = document.getElementById('ex-again'))) b.onclick = function () { exNew(); renderExam(); window.scrollTo(0, 0); };
    if ((b = document.getElementById('ex-home'))) b.onclick = function () { EX = null; go('home'); };
  }
  function exFinish() {
    if (EX.finished) return; EX.finished = true;
    var tot = exTotal(), ok = exPassed(), ex = S.exam = S.exam || {}, first = ok && !ex.passed;
    ex.n = (ex.n || 0) + 1; ex.best = Math.max(ex.best || 0, tot); ex.last = { d: today(), tot: tot, sc: EX.sc }; if (ok) ex.passed = today();
    addXp(first ? 150 : 40); markActive(); save(); toast('+' + (first ? 150 : 40) + ' XP');
  }
  /* ---------- Fehler melden (Vorschlag J): Text + Übungs-Kontext in public.ps_feedback, sonst per Mail ---------- */
  var APP_VER = '0.6', SITE = 'https://english.arndt-software.de/', FB_MAIL = 'farndt691@gmail.com';
  function reportHtml(id) {
    return '<details class="report" id="' + id + '"><summary class="small">⚑ ' + esc(t('rep')) + '</summary><div class="stack" style="margin-top:8px">' +
      '<p class="small muted">' + esc(t('rep_pick')) + '</p><div class="seg">' + ['rep_c1', 'rep_c2', 'rep_c3', 'rep_c4', 'rep_c5'].map(function (k) { return '<button type="button" class="chip" data-rc="' + k + '" aria-pressed="false">' + esc(t(k)) + '</button>'; }).join('') + '</div>' +
      '<textarea maxlength="1000" rows="3" aria-label="' + esc(t('rep')) + '" placeholder="' + esc(t('rep_ph')) + '"></textarea>' +
      '<button type="button" class="btn" style="justify-self:start">' + esc(t('rep_send')) + '</button><p class="small muted" role="status"></p></div></details>';
  }
  function bindReport(id, ctx) {
    var el = document.getElementById(id); if (!el) return;
    var ta = el.querySelector('textarea'), b = el.querySelector('button.btn'), st = el.querySelector('[role=status]');
    ta.onkeydown = function (e) { e.stopPropagation(); };
    var cat = '';
    el.querySelectorAll('[data-rc]').forEach(function (c) { c.onclick = function () {
      el.querySelectorAll('[data-rc]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true'); cat = c.getAttribute('data-rc'); st.textContent = ''; }; });
    b.onclick = function () {
      var txt = ta.value.trim(), msg = (cat ? '[' + T_DE(cat) + '] ' : '') + txt; if (!txt && !cat) { st.textContent = t('rep_empty'); return; }
      var cx = String(ctx) + (LAST_ERR ? ' | JS: ' + LAST_ERR : '');
      b.disabled = true; st.textContent = t('sync_busy');
      sbFetch('/rest/v1/et_feedback', { method: 'POST', prefer: 'return=minimal', body: { msg: msg.slice(0, 1000), ctx: cx.slice(0, 500), lang: S.base, ver: APP_VER } })
        .then(function () { st.textContent = t('rep_thanks'); ta.value = ''; b.disabled = false; cat = ''; el.querySelectorAll('[data-rc]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); },
          function () { b.disabled = false; copy(msg + '\n\n[' + cx + ' · ' + APP_VER + ']'); st.innerHTML = esc(t('rep_fail')) + ' <a href="mailto:' + FB_MAIL + '?subject=English%20Trail%20Feedback">' + FB_MAIL + '</a>'; });
    };
  }

  /* ---------- Teilen (Vorschlag K): Teilen-Menü des Geräts, sonst kopieren ---------- */
  /* Technische Fehler merken (nur Text der Fehlermeldung, nichts wird automatisch gesendet) und einmal freundlich auf „Fehler melden“ hinweisen */
  var LAST_ERR = '', errHinted = false;
  function T_DE(k) { return (TX.de && TX.de[k]) || k; }
  function noteErr(m) {
    LAST_ERR = String(m || '').slice(0, 200); if (errHinted) return; errHinted = true;
    try { toast(t('rep_oops')); } catch (e) {}
  }
  window.addEventListener('error', function (e) { noteErr((e && e.message) + (e && e.lineno ? ' @' + e.lineno : '')); });
  window.addEventListener('unhandledrejection', function (e) { var r = e && e.reason; if (r && r.name === 'AbortError') return; if (r && /fetch|network|Load failed/i.test(String(r.message || r))) return; noteErr('promise: ' + (r && (r.message || r))); });

  function shareOut(text) {
    if (navigator.share) { navigator.share({ text: text }).catch(function (e) { if (!e || e.name !== 'AbortError') copy(text); }); return; }
    copy(text);
  }

  /* ---------- Konfetti bei Erfolgen (nicht bei „Bewegung reduzieren“) ---------- */
  function confetti() {
    try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}
    var box = document.createElement('div'), cols = ['var(--red)', 'var(--amber)', 'var(--t-green)', 'var(--t-blue)', 'var(--t-yellow)'], h = '';
    box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 46; i++) h += '<i style="left:' + Math.round(Math.random() * 100) + '%;background:' + cols[i % cols.length] + ';animation-delay:' + (Math.random() * 0.5).toFixed(2) + 's;animation-duration:' + (1.6 + Math.random() * 1.2).toFixed(2) + 's;transform:rotate(' + Math.round(Math.random() * 360) + 'deg)"></i>';
    box.innerHTML = h; document.body.appendChild(box);
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 3200);
  }

  /* ---------- Aufnehmen und vergleichen (zu Vorschlag L): eigene Stimme, danach das Vorbild ---------- */
  function recHtml() { return (window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? '<button type="button" class="btn ghost" id="rec" style="justify-self:start">● ' + esc(t('rec')) + '</button>' : ''; }
  function bindRec(text) {
    var b = document.getElementById('rec'); if (!b) return; var mr = null;
    b.onclick = function () {
      if (mr && mr.state === 'recording') { mr.stop(); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        var chunks = []; mr = new MediaRecorder(stream);
        mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = function () {
          stream.getTracks().forEach(function (tr) { tr.stop(); });
          b.textContent = '● ' + t('rec');
          var url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })), au = new Audio(url);
          au.onended = function () { URL.revokeObjectURL(url); setTimeout(function () { speak(text); }, 300); };
          au.play().catch(function () { speak(text); });
        };
        mr.start(); b.textContent = '■ ' + t('rec_stop');
        setTimeout(function () { if (mr && mr.state === 'recording') mr.stop(); }, 6000);
      }, function () { toast(t('no_mic')); });
    };
  }

  /* ---------- Kurze Einführungs-Tour (einmalig, unter „Ich“ wiederholbar) ---------- */
  function startTour() {
    var steps = [['#cta', 'tour1'], ['.map-wrap', 'tour2'], ['.letter-card', 'tour3'], ['[data-nav="practice"]', 'tour4'], ['[data-nav="me"]', 'tour5']], i = 0;
    var old = document.getElementById('tour'); if (old) old.remove();
    var box = document.createElement('div'); box.id = 'tour'; box.className = 'tour card stack pop'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Tour');
    document.body.appendChild(box);
    function clear() { document.querySelectorAll('.tour-hl').forEach(function (e) { e.classList.remove('tour-hl'); }); }
    function end() { clear(); box.remove(); S.tour = true; save(); }
    function paint() {
      clear();
      var el = document.querySelector(steps[i][0]), last = i === steps.length - 1;
      if (el) { el.classList.add('tour-hl'); try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }
      box.innerHTML = '<span class="eyebrow num">' + (i + 1) + ' / ' + steps.length + '</span><p>' + esc(t(steps[i][1])) + '</p><div class="row"><button class="btn primary" id="tour-n">' + esc(last ? t('tour_done') : t('tour_next')) + '</button>' + (last ? '' : '<button class="btn ghost" id="tour-x">' + esc(t('tour_skip')) + '</button>') + '</div>';
      document.getElementById('tour-n').onclick = function () { if (last) end(); else { i++; paint(); } };
      var x = document.getElementById('tour-x'); if (x) x.onclick = end;
      try { document.getElementById('tour-n').focus({ preventScroll: true }); } catch (e) {}
    }
    paint();
  }

  function candoBox() {
    var done = routeIdx().map(function (i) { return U[i]; }).filter(function (u) { return S.boss[u.id]; }), nu = U[nextUnit()], ns = cityStep(nextUnit());
    var stats = t('cando_stats').replace('{w}', masteredCount()).replace('{s}', Object.keys(S.scenes).length).replace('{c}', done.length);
    return '<section class="card stack" id="cando"><h2>' + esc(t('cando')) + '</h2><p class="small muted num">' + esc(stats) + '</p>' +
      (done.length ? '<div class="list">' + done.map(function (u) { return '<div class="li"><span class="badge good">✓</span><div class="grow"><b>' + esc(u.city) + '</b><div class="small">' + esc(L(u.can)) + '</div></div></div>'; }).join('') + '</div>'
        : '<p class="small muted">' + esc(t('cando_empty')) + '</p>') +
      (ns ? '<p class="small"><b>' + esc(t('cando_next')) + ' (' + esc(nu.city) + '):</b> ' + esc(L(nu.can)) + '</p>' : '') + '</section>';
  }
  function voiceBox() {
    var vs = plVoices(), ios = isIOS(), and = /android/i.test(navigator.userAgent);
    return '<section class="card stack" id="voice"><h2>' + esc(t('vc')) + '</h2>' +
      (Object.keys(VSRC).length ?       '<div class="stack"><b>' + esc(t('vs_src')) + '</b><div class="seg" id="vs-src">' + segBtn('', t('vs_dev'), !S.vsrc) + segBtn('gosia', 'Gosia ♀', S.vsrc === 'gosia') + segBtn('darkman', 'Darek ♂', S.vsrc === 'darkman') + '</div>' +
      '<p class="small muted">' + esc(S.vsrc ? t('vs_on_d') : t('vs_d')) + '</p>' + (S.vsrc ? '<button class="btn" id="vs-test" style="justify-self:start">' + I.spk + esc(t('vs_test')) + '</button>' : '') + '</div>' +
      (S.vsrc ? '<p class="small"><b>' + esc(t('vs_dev_more')) + '</b></p>' : '') : '') +
      (vs.length ? '<label class="fld">' + esc(t('vc_pick')) + '<select id="vc-sel"><option value=""' + (!S.voice ? ' selected' : '') + '>' + esc(t('vc_auto')) + '</option>' + vs.map(function (v) { return '<option value="' + esc(v.name) + '"' + (S.voice && S.voice === v.name ? ' selected' : '') + '>' + esc(v.name) + '</option>'; }).join('') + '</select></label>' +
        '<div class="row"><button class="btn" id="vc-test">' + I.spk + esc(t('vc_test')) + '</button><button class="btn ghost" id="vc-diag">' + esc(t('vc_diag')) + '</button></div><pre id="vc-out" class="vc-out" hidden></pre><p class="small muted">' + esc(t('vc_d')) + (isApple() ? ' ' + esc(t('vc_apple')) : '') + '</p>'
        : '<p class="small"><b>' + esc(t('vc_none')) + '</b></p><p class="small muted">' + esc(ios ? t('vc_ios') : and ? t('vc_and') : t('vc_pc')) + '</p><button class="btn ghost" id="vc-diag" style="justify-self:start">' + esc(t('vc_diag')) + '</button><pre id="vc-out" class="vc-out" hidden></pre>') + '</section>';
  }
  var VS_TEST = 'Kiedy mogę zacząć pracę?';
  function refreshVoiceBox() { var el = document.getElementById('voice'); if (!el) return; var tmp = document.createElement('div'); tmp.innerHTML = voiceBox(); el.replaceWith(tmp.firstChild); bindVoice(); }
  function bindVoice() {
    bindSeg('vs-src', function (v) { S.vsrc = v; save(); if (v) needAV(function () { refreshVoiceBox(); speak(VS_TEST); }); refreshVoiceBox(); });
    var vst = document.getElementById('vs-test'); if (vst) vst.onclick = function () { needAV(function () { speak(VS_TEST); }); };
    var sel = document.getElementById('vc-sel'); if (sel) sel.onchange = function () { S.voice = sel.value; save(); pickVoice(); };
    var vt = document.getElementById('vc-test'); if (vt) vt.onclick = function () { ttsSpeak('Dzień dobry! Miło mi cię poznać. Jak się masz?'); };
    var vd = document.getElementById('vc-diag'); if (vd) vd.onclick = function () {
      var out = document.getElementById('vc-out'); out.hidden = false; out.textContent = '…';
      ttsLog = []; ttsSpeak('Dzień dobry!');
      setTimeout(function () { var o = document.getElementById('vc-out'); if (o) { o.hidden = false; o.textContent = ttsDiag(); } }, 2500);
    };
  }
  var REM_DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  function remBox() {
    var r = S.rem || { days: [], time: '19:00' }, dn = t('dn').split(',');
    return '<section class="card stack" id="rem"><h2>' + esc(t('rem')) + '</h2><p class="small muted">' + esc(t('rem_d')) + '</p>' +
      '<div class="stack"><b>' + esc(t('rem_days')) + '</b><div class="row" id="rem-days">' + REM_DAYS.map(function (d, i) { return '<button type="button" class="chip" data-d="' + d + '" aria-pressed="' + (r.days.indexOf(d) >= 0) + '">' + esc(dn[i]) + '</button>'; }).join('') + '</div></div>' +
      '<label class="fld" style="max-width:160px">' + esc(t('rem_time')) + '<input type="time" id="rem-time" value="' + esc(r.time) + '"></label>' +
      '<button class="btn" id="rem-go" style="justify-self:start">📅 ' + esc(t('rem_btn')) + '</button></section>';
  }
  function bindRem() {
    var r = S.rem = S.rem || { days: [], time: '19:00' };
    document.querySelectorAll('#rem-days [data-d]').forEach(function (b) { b.onclick = function () { var d = b.getAttribute('data-d'), i = r.days.indexOf(d); if (i >= 0) r.days.splice(i, 1); else r.days.push(d); r.days.sort(function (a, c) { return REM_DAYS.indexOf(a) - REM_DAYS.indexOf(c); }); b.setAttribute('aria-pressed', String(i < 0)); save(); }; });
    document.getElementById('rem-time').onchange = function (e) { r.time = e.target.value || '19:00'; save(); };
    document.getElementById('rem-go').onclick = function () {
      var ics = C.icsReminder(r.days, r.time, t('rem_title'), t('rem_desc'), SITE, new Date());
      if (!ics) { toast(t('rem_none')); return; }
      var a = document.createElement('a'); a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics); a.download = 'english-trail-erinnerung.ics';
      document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 100);
    };
  }
  var resetArmed = false;
  function renderMe() {
    var lv = C.levelFromXp(S.xp);
    var html = '<h1>' + esc(t('nav_me')) + '</h1>' +
      '<section class="card stack"><div class="row" style="justify-content:space-between"><b>' + esc(t('level')) + ' ' + lv.level + '</b><span class="small muted num">' + lv.into + ' / ' + lv.need + ' ' + t('xp') + '</span></div><div class="bar amber"><i style="width:' + (lv.into / lv.need * 100) + '%"></i></div>' +
      '<div class="stats3"><div class="stat"><b class="num">' + masteredCount() + '</b><span class="small muted">' + esc(t('mastered')) + '</span></div><div class="stat"><b class="num">' + C.totalDays(S.active) + '</b><span class="small muted">' + esc(t('total_days')) + '</span></div><div class="stat"><b class="num">' + C.weekStreak(S.active, S.goal, today()) + '</b><span class="small muted">' + esc(t('wk_streak')) + '</span></div></div></section>' +
      candoBox() + installBox() + syncBox() +
      '<section class="card stack"><h2>' + esc(t('settings')) + '</h2>' +
      '<div class="stack"><b>' + esc(t('accent')) + '</b><div class="seg" id="s-acc">' + segBtn('gb', t('accent_gb'), S.accent !== 'us') + segBtn('us', t('accent_us'), S.accent === 'us') + '</div><p class="small muted">' + esc(t('accent_d')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('goal')) + '</b><div class="seg" id="s-goal">' + [2, 3, 4, 5, 7].map(function (n) { return segBtn(String(n), String(n), S.goal === n); }).join('') + '</div></div>' +
      '<div class="stack"><b>' + esc(t('diff')) + '</b><div class="seg" id="s-diff">' + ['easy', 'medium', 'hard'].map(function (k) { return segBtn(k, t('diff_' + k), S.diff === k); }).join('') + '</div><p class="small muted">' + esc(t('diff_' + S.diff + '_d')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('inp')) + '</b><div class="seg" id="s-inp">' + ['write', 'speak', 'tap'].map(function (k) { return segBtn(k, t('inp_' + k), S.input === k); }).join('') + '</div><p class="small muted">' + esc(t('inp_' + S.input + '_d')) + '</p></div>' +
      '<label class="row"><input type="checkbox" id="s-free"' + (S.free ? ' checked' : '') + '> ' + esc(t('free_roam')) + '</label>' +
      '<button class="btn" id="s-place" style="justify-self:start">' + esc(t('placement')) + '</button><p class="small muted">' + esc(t('placement_d')) + '</p>' +
      '<div class="stack"><b>' + esc(t('len')) + '</b><div class="seg" id="s-len">' + segBtn('6', t('short'), S.len === 6) + segBtn('10', t('medium'), S.len === 10) + segBtn('15', t('long'), S.len === 15) + '</div></div>' +
      '<div class="stack"><b>' + esc(t('theme')) + '</b><div class="seg" id="s-theme">' + segBtn('auto', t('auto'), S.theme === 'auto') + segBtn('light', t('light'), S.theme === 'light') + segBtn('dark', t('dark'), S.theme === 'dark') + '</div></div>' +
      '<label class="row"><input type="checkbox" id="s-hard"' + (S.hardcore ? ' checked' : '') + '> ' + esc(t('hardcore')) + '</label>' +
      '<label class="row"><input type="checkbox" id="s-slow"' + (S.slow ? ' checked' : '') + '> ' + esc(t('slow')) + ' (TTS)</label></section>' +
      voiceBox() + remBox() +
      '<section class="card stack"><h2>' + esc(t('jokers')) + '</h2><div class="row"><span class="chip num">' + esc(t('j_5050')) + ' ' + S.jokers.five0 + '</span><span class="chip num">' + esc(t('j_hint')) + ' ' + S.jokers.hint + '</span><span class="chip num">' + esc(t('j_freeze')) + ' ' + S.jokers.freeze + '</span></div><p class="small muted">' + esc(t('jokers_d')) + '</p></section>' +
      safeBox() +
      '<section class="card"><details><summary class="small" style="cursor:pointer;font-weight:700">' + esc(t('bk_more')) + '</summary><div class="stack" style="margin-top:10px"><p class="small muted">' + esc(t('backup_d')) + '</p><textarea id="bk" aria-label="' + esc(t('backup')) + '">' + esc(JSON.stringify(S)) + '</textarea>' +
      '<div class="row"><button class="btn" id="bk-copy">' + esc(t('bk_copy')) + '</button><button class="btn" id="bk-restore">' + esc(t('restore')) + '</button></div></div></details></section>' +
      '<section class="card stack"><h2>' + esc(t('news')) + '</h2><p class="small muted">' + esc(t('news_ver')) + ' ' + esc(APP_VER) + '</p><div class="row" style="flex-wrap:wrap"><button class="btn" id="news-open">' + esc(t('news_all')) + ' →</button><button class="btn" id="guide-open">❓ ' + esc(t('gd_title')) + '</button></div></section>' +
      '<section class="card stack"><h2>' + esc(t('rv_me')) + '</h2><p class="small">' + esc(t('rv_me_d')) + '</p><button class="btn" id="rv-link" style="justify-self:start">' + esc(t('rv_me_btn')) + '</button></section>' +
      '<section class="card stack"><h2>' + esc(t('about')) + '</h2><p class="small">' + esc(t('about_d')) + '</p><p class="small"><a href="impressum.html">' + esc(t('legal')) + '</a> · <a href="datenschutz.html">' + esc(t('privacy')) + '</a></p><button class="btn ghost" id="tour-again" style="justify-self:start;padding-left:0">' + esc(t('tour_again')) + '</button><p class="small muted">' + esc(t('rep_d')) + '</p>' + reportHtml('rep-me') + '<button class="btn" id="reset" style="justify-self:start;color:var(--bad)">' + esc(resetArmed ? t('reset_q') : t('reset')) + '</button></section>';
    shell(html);
    bindSeg('s-acc', function (v) { S.accent = v; pickVoice(); save(); renderMe(); });
    bindSeg('s-goal', function (v) { S.goal = +v; save(); renderMe(); });
    bindSeg('s-len', function (v) { S.len = +v; save(); renderMe(); });
    bindSeg('s-theme', function (v) { S.theme = v; save(); renderMe(); });
    bindSync(); bindRem(); bindVoice();
    var ib = document.getElementById('s-inst'); if (ib && ib.tagName === 'BUTTON') ib.onclick = doInstall;
    document.getElementById('s-hard').onchange = function (e) { S.hardcore = e.target.checked; save(); };
    document.getElementById('s-slow').onchange = function (e) { S.slow = e.target.checked; save(); };
    bindSeg('s-diff', function (v) { S.diff = v; save(); renderMe(); });
    bindSeg('s-inp', function (v) { S.input = v; save(); renderMe(); });
    document.getElementById('s-free').onchange = function (e) { S.free = e.target.checked; save(); };
    document.getElementById('s-place').onclick = function () { startMode('placement'); };
    document.getElementById('bk-copy').onclick = function () { copy(JSON.stringify(S)); };
    document.getElementById('bk-restore').onclick = function () {
      try { var o = JSON.parse(document.getElementById('bk').value); o = C.validateSave(o) ? o : C.repairSave(o); if (!o) throw 0; mergeIn(o); } catch (e) { toast(t('bad_backup')); }
    };
    bindSafe();
    bindReport('rep-me', 'Ich / allgemein');
    document.getElementById('news-open').onclick = function () { go('news'); };
    document.getElementById('guide-open').onclick = function () { go('guide', 'kids'); };
    document.getElementById('rv-link').onclick = function () { shareOut(t('rv_me_share') + ' ' + SITE + '?review'); };
    document.getElementById('tour-again').onclick = function () { S.tour = false; save(); go('home'); };
    document.getElementById('reset').onclick = function () { if (!resetArmed) { resetArmed = true; renderMe(); return; } resetArmed = false; backup('reset'); S = fresh(); S.onboarded = false; loadData(); save(); render(); };
  }

  /* ---------- 3.2 Sicherungen (Ich → „Dein Fortschritt ist sicher“) ---------- */
  function mergeIn(o) { backup('restore'); S = Object.assign(fresh(), C.mergeSave(S, o)); S.onboarded = true; loadData(); fixUnlock(); save(); toast(t('restored')); render(); }
  function whyLabel(w) { return t('bk_w_' + w) === 'bk_w_' + w ? w : t('bk_w_' + w); }
  function safeBox() {
    var l = getBaks(), loc = S.base === 'en' ? 'en-GB' : 'de-DE', st = C.saveStats(S);
    return '<section class="card stack" id="safe"><h2>' + esc(t('bk_title')) + '</h2>' +
      '<p class="small">' + esc(A && A.uid ? t('bk_d_acc') : t('bk_d_local')) + '</p>' +
      (A && A.uid ? '' : '<p class="small"><b>' + esc(t('bk_acc_tip')) + '</b></p><button class="btn ghost" id="bk-acc" style="justify-self:start;padding-left:0">' + esc(t('sync_signup')) + ' →</button>') +
      '<p class="small muted num">' + esc(t('bk_now')) + ': ' + st.xp + ' XP · ' + st.words + ' ' + esc(t('bk_words')) + ' · ' + st.cities + ' ' + esc(t('bk_cities')) + '</p>' +
      (l.length ? '<details><summary class="small" style="cursor:pointer;font-weight:700">' + esc(t('bk_list')) + ' (' + l.length + ')</summary><ul class="bk-list">' + l.map(function (b, i) {
        var x = C.saveStats(b.d);
        return '<li><span class="small num">' + esc(new Date(b.t).toLocaleString(loc, { dateStyle: 'short', timeStyle: 'short' })) + ' · ' + esc(whyLabel(b.why)) + '<br>' + x.xp + ' XP · ' + x.words + ' ' + esc(t('bk_words')) + '</span><button class="btn" data-bk="' + i + '">' + esc(t('bk_get')) + '</button></li>';
      }).join('') + '</ul><p class="small muted">' + esc(t('bk_get_d')) + '</p></details>' : '') +
      '<div class="row"><button class="btn" id="bk-file">' + esc(t('bk_file')) + '</button><label class="btn" for="bk-in" style="cursor:pointer">' + esc(t('bk_load')) + '</label><input type="file" id="bk-in" accept="application/json,.json,.txt" hidden></div></section>';
  }
  function bindSafe() {
    var b = document.getElementById('bk-acc'); if (b) b.onclick = function () { var el = document.getElementById('sync'); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
    document.querySelectorAll('[data-bk]').forEach(function (x) { x.onclick = function () { var e = getBaks()[+x.getAttribute('data-bk')]; if (e) mergeIn(e.d); }; });
    document.getElementById('bk-file').onclick = function () {
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' }));
      a.download = 'english-trail-sicherung-' + today() + '.json'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    };
    document.getElementById('bk-in').onchange = function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { try { var o = JSON.parse(String(r.result)); o = C.validateSave(o) ? o : C.repairSave(o); if (!o) throw 0; mergeIn(o); } catch (er) { toast(t('bad_backup')); } }; r.readAsText(f);
    };
  }
  /* Start: Sicherung vom Stand der letzten Sitzung, vor jedem Versions-Update, beim Verlassen; Speicher dauerhaft anfordern */
  function startSafety() {
    if (S.appVer && S.appVer !== APP_VER) backup('update'); else backup('auto');
    if (S.appVer !== APP_VER) { S.appVer = APP_VER; saveLocal(); }
    try { if (navigator.storage && navigator.storage.persist && hasProgress(S)) navigator.storage.persisted().then(function (p) { if (!p) navigator.storage.persist(); }); } catch (e) {}
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') backup('auto'); });
    /* Zweiter Tab/zweites Fenster: dessen Fortschritt übernehmen statt ihn beim nächsten Speichern zu überschreiben */
    window.addEventListener('storage', function (e) {
      if (e.key !== KEY || !e.newValue) return;
      try { var o = JSON.parse(e.newValue); if (C.validateSave(o)) { S = Object.assign(fresh(), C.mergeSave(S, o)); loadData(); fixUnlock(); if (!G && !view) render(); } } catch (er) {}
    });
    if (RESCUE) { if (RESCUE !== 'lost') saveLocal(); setTimeout(function () { toast(t('rescue_' + RESCUE)); }, 600); }
  }

  /* ---------- Geräte-Abgleich über das eigene Supabase (wie GeoQuest, gleiches Konto) ----------
     Freiwillig: ohne Anmeldung verlässt nichts das Gerät. Mit Anmeldung: Spielstand als JSON in public.ps_progress
     (nur eigene Zeile, RLS), beim Start/Wiederkommen/Speichern abgleichen. Zusammenführen statt überschreiben (C.mergeSave). */
  var SB_URL = 'https://supabase.arndt-software.de', SB_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NDgxMTAwMCwiZXhwIjo0OTQwNDg0NjAwLCJyb2xlIjoiYW5vbiJ9.kMAlX4dS_sXjH6dsLoICMKnwyHFLAAuEwum7zuJh2DQ', AUTH_KEY = 'english_trail_auth';
  var A = null; try { A = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) {}
  var syncBusy = false, syncTimer = null, syncMsg = '', syncErr = '', syncDelArmed = false, syncRecovery = false, obSync = false;
  function saveAuth() { try { if (A) localStorage.setItem(AUTH_KEY, JSON.stringify(A)); else localStorage.removeItem(AUTH_KEY); } catch (e) {} }
  function sbFetch(path, o) {
    o = o || {}; var h = { apikey: SB_KEY, 'Content-Type': 'application/json' };
    if (o.auth && A) h.Authorization = 'Bearer ' + A.at; if (o.prefer) h.Prefer = o.prefer;
    return fetch(SB_URL + path, { method: o.method || 'GET', headers: h, body: o.body ? JSON.stringify(o.body) : undefined }).then(function (r) {
      return r.text().then(function (txt) {
        var j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
        if (!r.ok) { var er = new Error((j && (j.msg || j.error_description || j.message || j.error)) || ('HTTP ' + r.status)); er.status = r.status; er.code = j && (j.error_code || j.code || j.error); throw er; }
        return j;
      });
    }, function () { var er = new Error('net'); er.code = 'net'; throw er; });
  }
  function setSession(j) {
    var u = j.user || {};
    A = { at: j.access_token, rt: j.refresh_token, exp: Date.now() + ((+j.expires_in || 3600) - 60) * 1000, email: u.email || (A && A.email) || '', uid: u.id || (A && A.uid) || '', last: A && A.last };
    saveAuth();
  }
  function sbToken() {
    if (!A) return Promise.reject(new Error('auth'));
    if (Date.now() < A.exp) return Promise.resolve();
    return sbFetch('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: A.rt } }).then(setSession, function (e) {
      if (e.status === 400 || e.status === 401) { A = null; saveAuth(); } throw e;
    });
  }
  function syncErrText(e) {
    var c = String((e && e.code) || ''), m = String((e && e.message) || '');
    if (c === 'net' || !navigator.onLine) return t('sync_err_net');
    if (c === 'invalid_credentials' || /invalid login/i.test(m)) return t('sync_err_cred');
    if (c === 'email_not_confirmed' || /not confirmed/i.test(m)) return t('sync_err_confirm');
    if (c === 'user_already_exists' || /already registered/i.test(m)) return t('sync_err_exists');
    if (c === 'weak_password' || (/password/i.test(m) && e.status === 422)) return t('sync_err_pw');
    if ((e && e.status === 429) || /rate limit/i.test(m)) return t('sync_err_rate');
    if ((e && (e.status === 504 || e.status === 500)) || /timed out|sending confirmation|smtp|mail/i.test(m)) return t('sync_err_mail');
    return t('sync_err') + ' (' + m.slice(0, 80) + ')';
  }
  function syncSoon() { if (!A) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 4000); }
  function syncNow() {
    if (!A || !A.uid || syncBusy) return Promise.resolve();
    if (!navigator.onLine) { syncErr = t('sync_err_net'); refreshSyncBox(); return Promise.resolve(); }
    syncBusy = true; syncErr = ''; refreshSyncBox();
    var before = JSON.stringify(S);
    return sbToken().then(function () { return sbFetch('/rest/v1/et_progress?select=data&user_id=eq.' + encodeURIComponent(A.uid), { auth: true }); })
      .then(function (rows) {
        var remote = rows && rows[0] && rows[0].data;
        if (remote && C.validateSave(remote)) { if (!A.last) backup('sync'); S = Object.assign(fresh(), C.mergeSave(S, remote)); loadData(); fixUnlock(); saveLocal(); }
        return sbFetch('/rest/v1/et_progress?on_conflict=user_id', { method: 'POST', auth: true, prefer: 'resolution=merge-duplicates,return=minimal', body: { user_id: A.uid, data: S } });
      })
      .then(function () { A.last = Date.now(); saveAuth(); syncMsg = t('sync_done'); }, function (e) { syncErr = syncErrText(e); })
      .then(function () {
        syncBusy = false;
        if (JSON.stringify(S) !== before && !view) render(); else refreshSyncBox();
      });
  }
  function afterLogin(j) { setSession(j); syncMsg = ''; syncErr = ''; obSync = false; return syncNow().then(function () { if (!syncErr) toast(t('sync_merged').replace('{x}', S.xp)); render(); }); }
  /* iPhone/iPad: Die installierte App und Safari haben getrennte Speicher. Kommt man über den Mail-Link in Safari an
     und dort ist kein Fortschritt, zeigen wir, wie man den Fortschritt aus der App mitnimmt. */
  function appHintNeeded() { return isApple() && !isStandalone() && !hasProgress(S); }
  /* Rückkehr aus Bestätigungs- oder Passwort-Mail: Tokens stehen im #-Teil der Adresse */
  function sbFromHash() {
    var h = location.hash || ''; if (!/[#&](access_token|error)/.test(h)) return;
    var q = {}; h.slice(1).split('&').forEach(function (kv) { var i = kv.indexOf('='); if (i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); });
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (q.error || q.error_description) { syncErr = t('sync_err') + ' (' + String(q.error_description || q.error).slice(0, 80) + ')'; if (S.onboarded) tab = 'me'; else obSync = true; return; }
    if (!q.access_token) return;
    A = { at: q.access_token, rt: q.refresh_token, exp: Date.now() + ((+q.expires_in || 3600) - 60) * 1000, email: '', uid: '' };
    syncRecovery = q.type === 'recovery'; if (S.onboarded) tab = 'me';
    sbFetch('/auth/v1/user', { auth: true }).then(function (u) { A.email = u.email || ''; A.uid = u.id || ''; saveAuth(); var hint = appHintNeeded(); return syncNow().then(function () { if (hint && !hasProgress(S)) { syncMsg = t('sync_app_hint'); if (!S.onboarded) obSync = true; } render(); }); },
      function (e) { A = null; saveAuth(); syncErr = syncErrText(e); refreshSyncBox(); });
  }
  function syncBox() {
    var h = '<section class="card stack" id="sync"><h2>' + esc(t('sync')) + '</h2>';
    if (A && A.uid) {
      h += '<p class="small">' + esc(t('sync_as')) + ' <b>' + esc(A.email) + '</b></p>' +
        '<p class="small muted" role="status">' + esc(syncBusy ? t('sync_busy') : syncErr || ((syncMsg ? syncMsg + ' · ' : '') + t('sync_last') + ': ' + (A.last ? new Date(A.last).toLocaleString(S.base === 'en' ? 'en-GB' : 'de-DE', { dateStyle: 'short', timeStyle: 'short' }) : t('sync_never')))) + '</p>' +
        (syncRecovery ? '<label class="fld">' + esc(t('sync_newpw')) + '<input type="password" id="sy-npw" autocomplete="new-password" minlength="8"></label><button class="btn primary" id="sy-setpw" style="justify-self:start">' + esc(t('sync_setpw')) + '</button>' : '') +
        '<div class="row"><button class="btn primary" id="sy-now"' + (syncBusy ? ' disabled' : '') + '>' + esc(t('sync_now')) + '</button><button class="btn" id="sy-out">' + esc(t('sync_logout')) + '</button></div>' +
        '<button class="btn ghost" id="sy-del" style="justify-self:start;color:var(--bad)">' + esc(syncDelArmed ? t('sync_del_q') : t('sync_del')) + '</button>';
    } else {
      h += '<p class="small muted">' + esc(t('sync_d')) + '</p>' +
        '<label class="fld">' + esc(t('sync_email')) + '<input type="email" id="sy-mail" autocomplete="email" inputmode="email"></label>' +
        '<label class="fld">' + esc(t('sync_pw')) + '<input type="password" id="sy-pw" autocomplete="current-password" minlength="8"></label>' +
        '<label class="row small"><input type="checkbox" id="sy-u16"' + (S.u16ok ? ' checked' : '') + '> ' + esc(t('sync_u16')) + '</label>' +
        '<div class="row"><button class="btn primary" id="sy-in"' + (syncBusy ? ' disabled' : '') + '>' + esc(t('sync_login')) + '</button><button class="btn" id="sy-up"' + (syncBusy ? ' disabled' : '') + '>' + esc(t('sync_signup')) + '</button></div>' +
        '<button class="btn ghost" id="sy-forgot" style="justify-self:start;padding-left:0">' + esc(t('sync_forgot')) + '</button>' +
        (syncErr || syncMsg ? '<p class="small" role="status">' + esc(syncErr || syncMsg) + '</p>' : '') +
        '<p class="small">' + esc(t('sync_keep')) + '</p><p class="small muted">' + esc(t('sync_shared')) + ' <a href="datenschutz.html">' + esc(t('privacy')) + '</a></p>';
    }
    return h + '</section>';
  }
  function refreshSyncBox() {
    updateNet();
    var el = document.getElementById('sync'); if (!el) return;
    var keep = {}; ['sy-mail', 'sy-pw', 'sy-npw'].forEach(function (id) { var i = document.getElementById(id); if (i) keep[id] = i.value; });
    var u16 = document.getElementById('sy-u16'); if (u16 && u16.checked) S.u16ok = 1;
    var tmp = document.createElement('div'); tmp.innerHTML = syncBox(); el.replaceWith(tmp.firstChild);
    Object.keys(keep).forEach(function (id) { var i = document.getElementById(id); if (i) i.value = keep[id]; });
    bindSync();
  }
  function bindSync() {
    function $(id) { return document.getElementById(id); }
    function creds() { return { email: ($('sy-mail').value || '').trim(), password: $('sy-pw').value || '' }; }
    function fail(e) { syncBusy = false; syncErr = syncErrText(e); syncMsg = ''; refreshSyncBox(); }
    function busy() { syncBusy = true; syncErr = ''; syncMsg = ''; refreshSyncBox(); }
    var redirect = encodeURIComponent(location.origin + location.pathname);
    if ($('sy-in')) $('sy-in').onclick = function () {
      var c = creds(); if (!c.email || !c.password) return;
      busy(); sbFetch('/auth/v1/token?grant_type=password', { method: 'POST', body: c }).then(function (j) { syncBusy = false; return afterLogin(j); }, fail);
    };
    if ($('sy-up')) $('sy-up').onclick = function () {
      var c = creds(); if (!c.email) return; if (c.password.length < 8) { syncErr = t('sync_err_pw'); refreshSyncBox(); return; }
      if (!$('sy-u16') || !$('sy-u16').checked) { syncErr = t('sync_u16_need'); refreshSyncBox(); return; }
      S.u16ok = 1; save();
      busy(); sbFetch('/auth/v1/signup?redirect_to=' + redirect, { method: 'POST', body: c }).then(function (j) {
        syncBusy = false;
        if (j && j.access_token) return afterLogin(j);
        if (j && Array.isArray(j.identities) && !j.identities.length) syncErr = t('sync_err_exists'); else syncMsg = t('sync_mail_sent');
        refreshSyncBox();
      }, fail);
    };
    if ($('sy-forgot')) $('sy-forgot').onclick = function () {
      var c = creds(); if (!c.email) { $('sy-mail').focus(); return; }
      busy(); sbFetch('/auth/v1/recover?redirect_to=' + redirect, { method: 'POST', body: { email: c.email } }).then(function () { syncBusy = false; syncMsg = t('sync_reset_sent'); refreshSyncBox(); }, fail);
    };
    if ($('sy-now')) $('sy-now').onclick = function () { syncNow(); };
    if ($('sy-setpw')) $('sy-setpw').onclick = function () {
      var pw = $('sy-npw').value || ''; if (pw.length < 8) { syncErr = t('sync_err_pw'); refreshSyncBox(); return; }
      sbToken().then(function () { return sbFetch('/auth/v1/user', { method: 'PUT', auth: true, body: { password: pw } }); })
        .then(function () { syncRecovery = false; syncErr = ''; syncMsg = t('sync_pw_saved'); refreshSyncBox(); }, fail);
    };
    if ($('sy-out')) $('sy-out').onclick = function () {
      var at = A && A.at; clearTimeout(syncTimer);
      if (at) fetch(SB_URL + '/auth/v1/logout', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + at } }).catch(function () {});
      A = null; saveAuth(); syncMsg = ''; syncErr = ''; syncDelArmed = false; syncRecovery = false; refreshSyncBox();
    };
    if ($('sy-del')) $('sy-del').onclick = function () {
      if (!syncDelArmed) { syncDelArmed = true; refreshSyncBox(); return; }
      syncDelArmed = false;
      sbToken().then(function () { return sbFetch('/rest/v1/et_progress?user_id=eq.' + encodeURIComponent(A.uid), { method: 'DELETE', auth: true }); })
        .then(function () { var at = A.at; clearTimeout(syncTimer); fetch(SB_URL + '/auth/v1/logout', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + at } }).catch(function () {}); A = null; saveAuth(); syncMsg = t('sync_deleted'); refreshSyncBox(); }, fail);
    };
  }
  window.addEventListener('online', function () { syncNow(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && A && (!A.last || Date.now() - A.last > 60000)) syncNow(); });

  /* ---------- Als App installieren: einmaliger Hinweis + Bereich unter „Ich“ ---------- */
  var instEvt = null;
  function isStandalone() { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function installBox() {
    var body = isStandalone() ? '<p class="small muted">' + esc(t('inst_done')) + '</p>' :
      (instEvt ? '<button class="btn primary" id="s-inst" style="justify-self:start">' + esc(t('inst_btn')) + '</button><p class="small muted">' + esc(t('inst_d')) + '</p>' :
        '<p class="small muted" id="s-inst">' + esc(isIOS() ? t('inst_ios') : (/macintosh/i.test(navigator.userAgent) && !/chrome|chromium|edg|firefox/i.test(navigator.userAgent)) ? t('inst_mac') : t('inst_other')) + '</p><p class="small muted">' + esc(t('inst_d')) + '</p>');
    return '<section class="card stack" id="inst"><h2>' + esc(t('inst')) + '</h2>' + body + '</section>';
  }
  function doInstall() {
    if (!instEvt) { go('me'); var el = document.getElementById('inst'); if (el) el.scrollIntoView(); return; }
    var e = instEvt; e.prompt(); e.userChoice.then(function () { instEvt = null; if (document.getElementById('inst')) renderMe(); }, function () {});
  }
  function refreshInstallBox() { if (document.getElementById('inst')) renderMe(); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); instEvt = e; refreshInstallBox(); });
  window.addEventListener('appinstalled', function () { instEvt = null; S.instHint = true; save(); refreshInstallBox(); });
  /* Einmalig 2 Sekunden einblenden, nicht in der installierten App, nicht während der Einstufung beim ersten Start */
  function installHint() {
    if (S.instHint || !S.onboarded || isStandalone()) return;
    S.instHint = true; save();
    var el = document.createElement('button'); el.className = 'inst-hint'; el.type = 'button';
    el.textContent = '📲 ' + t('inst_hint'); el.onclick = function () { el.remove(); doInstall(); };
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 400); }, 2000);
  }

  /* ---------- Meine Wörter ---------- */
  function renderMyWords() {
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('mywords')) + '</h1>' +
      '<section class="card stack"><label class="fld">' + esc(t('pl')) + '<input type="text" id="mw-pl" autocomplete="off" lang="en"></label>' +
      '<label class="fld">' + esc(t('meaning')) + '<input type="text" id="mw-m" autocomplete="off"></label>' + (S.school && S.school.grade ? '<label class="fld">' + esc(t('sch_unit')) + '<input type="text" id="mw-u" autocomplete="off" maxlength="20" placeholder="z. B. Unit 3" value="' + esc(S.lastUnit || '') + '"></label>' : '') + '<button class="btn primary" id="mw-add">' + esc(t('add')) + '</button>' +
      '<details><summary class="small"><b>' + esc(t('mw_bulk')) + '</b></summary><p class="small muted">' + esc(t('mw_bulk_d')) + '</p><textarea id="mw-bulk" rows="6" lang="en" placeholder="library = Bibliothek&#10;to borrow = ausleihen"></textarea><button class="btn" id="mw-bulk-go" style="justify-self:start">' + esc(t('mw_bulk_go')) + '</button></details></section>' +
      '<section class="card">' + (S.custom.length ? '<div class="list">' + S.custom.map(function (w, i) {
        return '<div class="li"><button class="icon-btn" data-say="' + esc(w[0]) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button><div class="grow"><div class="pl-word">' + esc(w[0]) + '</div><div class="small muted">' + esc(meaning(w)) + (w[3] ? ' · <span class="badge">' + esc(w[3]) + '</span>' : '') + '</div></div><button class="icon-btn" data-del="' + i + '" aria-label="' + esc(t('delete')) + '">' + I.x + '</button></div>';
      }).join('') + '</div>' : '<p class="muted">' + esc(t('mywords_empty')) + '</p>') + '</section>' +
      (S.custom.length >= 4 ? '<button class="btn primary block" id="mw-practice">' + esc(t('practice_mine')) + '</button>' : '');
    shell(html);
    document.getElementById('back').onclick = function () { go('practice'); };
    document.getElementById('mw-add').onclick = function () {
      var p = document.getElementById('mw-pl').value.trim(), m = document.getElementById('mw-m').value.trim();
      if (!p || !m) return; var ue = document.getElementById('mw-u'), un = ue ? ue.value.trim() : ''; if (un) S.lastUnit = un; S.custom.push(un ? [p, m, m, un] : [p, m, m]); save(); renderMyWords(); var f = document.getElementById('mw-pl'); if (f) f.focus();
    };
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
    document.querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-del'), n = S.custom.length; S.custom.splice(i, 1); delete S.cards['my:' + i];
      for (var j = i + 1; j < n; j++) { if (S.cards['my:' + j]) S.cards['my:' + (j - 1)] = S.cards['my:' + j]; else delete S.cards['my:' + (j - 1)]; delete S.cards['my:' + j]; } save(); renderMyWords(); }; });
    var pr = document.getElementById('mw-practice'); if (pr) pr.onclick = function () { startMode('mine'); };
    document.getElementById('mw-bulk-go').onclick = function () {
      var ue = document.getElementById('mw-u'), un = ue ? ue.value.trim() : '', list = C.parseWordList(document.getElementById('mw-bulk').value), have = {};
      S.custom.forEach(function (w) { have[(w[0] + '|' + w[1]).toLowerCase()] = 1; });
      var n = 0; list.forEach(function (p) { if (have[(p[0] + '|' + p[1]).toLowerCase()]) return; S.custom.push(un ? [p[0], p[1], p[1], un] : [p[0], p[1], p[1]]); n++; });
      if (un) S.lastUnit = un; save(); renderMyWords(); toast(t('mw_bulk_ok').replace('{n}', n));
    };
  }

  /* ---------- Wortschatz: alle Wörter aus den Lektionen nachschlagen (Suche tippen oder sprechen) ---------- */
  var lexAll = false, lexQ = '';
  function lexSource() {
    return allWords().filter(function (x) { return x.u < 0 || (lexAll ? isOpen(x.u) : !!S.cards[x.id]); });
  }
  function lexMatch(list, query) {
    var q = C.norm(query, true); if (!q) return list;
    var hay = function (x) { return [C.norm(x.w[0], true), C.norm(meaning(x.w), true)]; };
    var hits = list.filter(function (x) { return hay(x).some(function (h) { return h.indexOf(q) >= 0; }); });
    /* Gesprochene Sätze: wenn der ganze Text nichts findet, die einzelnen Wörter suchen */
    var parts = q.split(' ').filter(function (p) { return p.length >= 3; });
    if (!hits.length && parts.length > 1) hits = list.filter(function (x) { return hay(x).some(function (h) { return parts.some(function (p) { return h.indexOf(p) >= 0; }); }); });
    return hits;
  }
  function lexRows(list) {
    var groups = [], cur = null;
    list.forEach(function (x) { if (!cur || cur.u !== x.u) { cur = { u: x.u, items: [] }; groups.push(cur); } cur.items.push(x); });
    return groups.map(function (g) {
      return '<section class="card"><span class="eyebrow">' + esc(g.u < 0 ? t('mywords') : U[g.u].city + ' · ' + cityName(U[g.u])) + '</span><div class="list">' + g.items.map(function (x) {
        var c = S.cards[x.id], b = c ? c.box : 0, dots = '';
        for (var i = 1; i <= C.MASTERED_BOX; i++) dots += '<i class="' + (b >= i ? 'on' : '') + '"></i>';
        return '<div class="li"><button class="icon-btn" data-say="' + esc(x.w[0]) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button>' +
          '<div class="grow"><div class="pl-word" lang="en">' + esc(x.w[0]) + '</div><div class="small muted">' + esc(meaning(x.w)) + '</div></div><span class="box-dots" aria-hidden="true">' + dots + '</span></div>';
      }).join('') + '</div></section>';
    }).join('');
  }
  function renderLex() {
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('lex')) + '</h1>' +
      '<section class="card stack"><input type="search" id="lex-q" class="lex-q" autocomplete="off" enterkeyhint="search" placeholder="' + esc(t('lex_ph')) + '" aria-label="' + esc(t('lex_ph')) + '" value="' + esc(lexQ) + '">' +
      (Rec ? '<div class="row"><button class="btn" id="lex-mic-pl" style="flex:1">' + I.mic + esc(t('lex_mic_pl')) + '</button><button class="btn" id="lex-mic-x" style="flex:1">' + I.mic + esc(t('lex_mic_x')) + '</button></div>' : '') +
      '<p id="lex-heard" class="small muted" aria-live="polite"' + (Rec ? '' : ' hidden') + '></p>' +
      '<div class="seg" id="lex-f">' + segBtn('seen', t('lex_seen'), !lexAll) + segBtn('all', t('lex_all'), lexAll) + '</div></section>' +
      '<p class="small muted num" id="lex-n"></p><div class="stack" id="lex-list"></div>';
    shell(html);
    var inp = document.getElementById('lex-q');
    function draw() {
      var src = lexSource(), hits = lexMatch(src, lexQ), box = document.getElementById('lex-list');
      document.getElementById('lex-n').textContent = hits.length === 1 ? t('lex_one') : t('lex_count').replace('{n}', hits.length);
      if (!src.length) box.innerHTML = '<p class="muted">' + esc(t('lex_empty')) + '</p>';
      else if (!hits.length) box.innerHTML = '<p class="muted">' + esc(t('lex_none')) + '</p>' + (!lexAll && lexMatch(allWords().filter(function (x) { return x.u >= 0 && isOpen(x.u); }), lexQ).length ? '<button class="btn" id="lex-more">' + esc(t('lex_more')) + '</button>' : '');
      else box.innerHTML = lexRows(hits);
      box.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
      var more = document.getElementById('lex-more'); if (more) more.onclick = function () { lexAll = true; renderLex(); };
    }
    inp.oninput = function () { lexQ = inp.value; draw(); };
    document.getElementById('back').onclick = function () { go('practice'); };
    document.querySelectorAll('#lex-f button').forEach(function (b) { b.onclick = function () { lexAll = b.getAttribute('data-v') === 'all'; renderLex(); }; });
    function listen(lang, btn) {
      var heard = document.getElementById('lex-heard');
      try {
        var rec = new Rec(); rec.lang = lang; rec.interimResults = false; rec.maxAlternatives = 1;
        btn.disabled = true; heard.textContent = t('lex_listen');
        rec.onresult = function (e) { var s = e.results[0][0].transcript || ''; heard.textContent = t('you_said') + ': ' + s; inp.value = lexQ = s; draw(); };
        rec.onerror = function () { heard.textContent = t('no_mic'); };
        rec.onend = function () { btn.disabled = false; if (heard.textContent === t('lex_listen')) heard.textContent = ''; };
        rec.start();
      } catch (e) { btn.disabled = false; heard.textContent = t('no_mic'); }
    }
    if (Rec) {
      var bp = document.getElementById('lex-mic-pl'), bx = document.getElementById('lex-mic-x');
      bp.onclick = function () { listen(TL(), bp); };
      bx.onclick = function () { listen(S.base === 'en' ? 'en-GB' : 'de-DE', bx); };
    }
    draw();
  }

  /* ================================================================
     Fragen bauen
     ================================================================ */
  var R = Math.random;
  function distractors(x, pool, n, field) {
    var key = function (y) { return field === 'pl' ? y.w[0] : meaning(y.w); };
    var mine = key(x), seen = {}; seen[C.norm(mine)] = 1;
    var out = [];
    C.shuffle(pool, R).forEach(function (y) { var k = key(y); if (out.length < n && !seen[C.norm(k)]) { seen[C.norm(k)] = 1; out.push(k); } });
    return out;
  }
  function qMC(x, pool, dir) {
    if (dir === 'pl2x') return { type: 'mc', id: x.id, ask: t('choose_meaning'), big: x.w[0], say: x.w[0], a: meaning(x.w), opts: C.shuffle([meaning(x.w)].concat(distractors(x, pool, diff().opts - 1, 'm')), R) };
    return { type: 'mc', id: x.id, ask: t('choose_pl'), big: meaning(x.w), a: x.w[0], say: null, sayAfter: x.w[0], opts: C.shuffle([x.w[0]].concat(distractors(x, pool, diff().opts - 1, 'pl')), R) };
  }
  function qListen(x, pool) { return { type: 'mc', id: x.id, ask: t('hear'), big: '', say: x.w[0], hideText: true, reveal: x.w[0], a: meaning(x.w), opts: C.shuffle([meaning(x.w)].concat(distractors(x, pool, diff().opts - 1, 'm')), R) }; }
  function qDictate(x) { return { type: 'type', id: x.id, ask: t('dictate'), big: '', say: x.w[0], hideText: true, reveal: x.w[0] + ' = ' + meaning(x.w), a: x.w[0] }; }
  function qTranslate(s) { return { type: 'type', id: null, ask: t('translate_pl'), big: L([s[1], s[2]]), a: s[0] }; }
  function qType(x) { return { type: 'type', id: x.id, ask: t('type_pl'), big: meaning(x.w), a: x.w[0] }; }
  function qBuild(s, extra) {
    var tk = C.tokens(s[0]);
    if (!extra && diff().extraTiles) { var others = []; U.forEach(function (u) { u.sentences.forEach(function (x) { if (x[0] !== s[0]) others = others.concat(C.tokens(x[0])); }); }); extra = C.sample(others.filter(function (w) { return tk.indexOf(w) < 0; }), diff().extraTiles, R); }
    var pool = tk.concat(extra || []);
    return { type: 'build', id: null, ask: t('build_pl'), big: L([s[1], s[2]]), a: s[0], tiles: C.shuffle(pool, R) };
  }
  function qCloze(s, unitWords) {
    var tk = C.tokens(s[0]), cand = [];
    tk.forEach(function (w, i) { if (C.norm(w).length >= 3) cand.push(i); });
    var idx = cand[Math.floor(R() * cand.length)], ans = tk[idx].replace(/[.,!?]/g, '');
    var others = C.shuffle(unitWords.map(function (x) { return x.w[0]; }).filter(function (w) { return w.indexOf(' ') < 0 && C.norm(w) !== C.norm(ans); }), R).slice(0, 3);
    var shown = tk.map(function (w, i) { return i === idx ? '___' + (w.match(/[.,!?]+$/) || [''])[0] : w; }).join(' ');
    if (diff().clozeType) return { type: 'type', id: null, ask: t('fill'), sentence: shown, sub: L([s[1], s[2]]), a: ans, sayAfter: s[0], alt: others };
    return { type: 'mc', id: null, ask: t('fill'), sentence: shown, sub: L([s[1], s[2]]), a: ans, sayAfter: s[0], opts: C.shuffle([ans].concat(others), R) };
  }
  /* Verb-Aspekt (Vorschlag M): vollendet / unvollendet im Satz */
  function qAspect(c) { return { type: 'mc', id: null, plOpts: true, ask: t('aspect_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, opts: C.shuffle(c.opts.slice(), R), explain: t(c.pf ? 'asp_pf' : 'asp_ipf') + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) }; }
  /* Brief selbst lesen: polnischer Satz ohne Übersetzung, Frage in der Basissprache */
  function qLetter(x) { var l = letterLines('letter')[x.l]; return { type: 'mc', id: null, fixed: true, ask: L(x.q), sentence: l.pl, say: l.pl, a: L(x.o[0]), opts: C.shuffle(x.o.map(L), R), explain: L(l.tr) }; }
  function qCase(c) { if (diff().clozeType) return { type: 'type', id: null, ask: t('case_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, alt: c.opts, explain: L(c.case) + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) }; return { type: 'mc', id: null, ask: t('case_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, opts: C.shuffle(c.opts.slice(), R), explain: L(c.case) + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) }; }
  function qPrice() {
    var PEN = [0, 0, 50, 99, 25, 75, 20, 49], n = 1 + Math.floor(R() * 49), pc = PEN[Math.floor(R() * PEN.length)], opts = [[n, pc]], guard = 0;
    while (opts.length < 4 && guard++ < 50) {
      var m = Math.max(1, Math.min(99, n + [-10, -2, -1, 1, 2, 10, 11, -11, 20, 0][Math.floor(R() * 10)])), q = m === n ? PEN[Math.floor(R() * PEN.length)] : pc;
      if (!opts.some(function (o) { return o[0] === m && o[1] === q; })) opts.push([m, q]);
    }
    var w = C.priceEn(n, pc), tag = C.priceTag(n, pc);
    return { type: 'mc', id: null, ask: t('price_q'), big: '', say: w, hideText: true, reveal: tag + ' = ' + w, a: tag, opts: C.shuffle(opts, R).map(function (o) { return C.priceTag(o[0], o[1]); }) };
  }
  function qSound(sd) {
    var others = C.shuffle(D.sounds.filter(function (o) { return o.g !== sd.g; }), R).slice(0, 2).map(function (o) { return o[S.base]; });
    return { type: 'mc', id: null, ask: t('sound_q') + ' „' + sd.g + '“', big: sd.ex, say: sd.ex, sub: L(sd.exm), a: sd[S.base], opts: C.shuffle([sd[S.base]].concat(others), R) };
  }
  function qHearWord(pool) {
    var x = pool[Math.floor(R() * pool.length)];
    return { type: 'mc', id: x.id, ask: t('hear_word'), big: '', say: x.w[0], hideText: true, reveal: x.w[0] + ' = ' + meaning(x.w), a: x.w[0], opts: C.shuffle([x.w[0]].concat(distractors(x, pool, 3, 'pl')), R) };
  }
  function qWho(p) {
    var names = D.culture.people.map(function (x) { return x.name; }).filter(function (n) { return n !== p.name; });
    return { type: 'mc', id: null, ask: t('whoami'), clues: p.clues.map(L), shown: 1, a: p.name, opts: C.shuffle([p.name].concat(C.sample(names, Math.max(3, diff().opts - 1), R)), R), sayAfter: p.name };
  }
  function qTF(s) { return { type: 'mc', id: null, ask: t('tf'), big: L([s[1], s[2]]), small: true, a: s[0] ? t('t_true') : t('t_false'), opts: [t('t_true'), t('t_false')], explain: L([s[3], s[4]]), fixed: true }; }
  function qHL(set) {
    var pr = C.hlPair(set.items, R); if (!pr) return null; var hi = pr[0][1] > pr[1][1] ? pr[0] : pr[1];
    return { type: 'mc', id: null, ask: L(set.q), big: '', a: hi[0], opts: [pr[0][0], pr[1][0]], fixed: true, plOpts: true, explain: pr[0][0] + ': ' + pr[0][1].toLocaleString(S.base) + ' · ' + pr[1][0] + ': ' + pr[1][1].toLocaleString(S.base) + ' ' + L(set.unit) };
  }
  function qOrder(evts) { return { type: 'order', id: null, ask: t('tap_order'), items: C.shuffle(evts, R) }; }
  function qPin(pl) { return { type: 'pin', id: null, ask: t('tap_map'), big: pl.name, sub: pl.desc, target: pl }; }
  function qLetters(x) { return { type: 'type', id: x.id, ask: t('letters_q'), big: C.scramble(x.w[0].toUpperCase(), R).split('').join(' '), bigPl: true, sub: meaning(x.w), a: x.w[0] }; }
  function placesAll() { return D.culture.places.map(function (p) { return { name: p[0], desc: L([p[1], p[2]]), lon: p[3], lat: p[4] }; }).concat(routeIdx().map(function (i) { var u = U[i]; return { name: u.city, desc: cityName(u), lon: u.lon, lat: u.lat }; })); }
  function qSpell(x, pool) {
    var word = x.w[0], bad = C.misspell(word, diff().opts - 1, R, pool.map(function (y) { return y.w[0]; }));
    var rules = {}; bad.forEach(function (b) { rules[b.rule] = 1; });
    var why = Object.keys(rules).map(function (k) { return t('rule_' + k); }).join(' ');
    return { type: 'mc', id: x.id, ask: t('spell_q'), big: meaning(x.w), say: S.diff === 'hard' ? null : word, a: word, opts: C.shuffle([word].concat(bad.map(function (b) { return b.w; })), R), plOpts: true, explain: why, sayAfter: word };
  } /* PATCH005 */
  function qSpeak(s) { return { type: 'speak', id: null, ask: t('speak_tap'), big: s[0], sub: L([s[1], s[2]]), a: s[0] }; }

  function mixedFor(list, pool, n) {
    var qs = [], items = C.shuffle(list, R);
    for (var i = 0; i < n; i++) {
      var x = items[i % items.length], k = C.pickKind(S.diff, R());
      if (k === 'pl2x') qs.push(qMC(x, pool, 'pl2x'));
      else if (k === 'x2pl') qs.push(qMC(x, pool, 'x2pl'));
      else if (k === 'listen') qs.push(qListen(x, pool));
      else if (k === 'dictate') qs.push(qDictate(x));
      else qs.push(qType(x));
    }
    return qs;
  }
  function sentencesOf(uis) { var s = []; uis.forEach(function (ui) { s = s.concat(U[ui].sentences); }); return s; }

  /* ================================================================
     Modi starten
     ================================================================ */
  /* ---------- Schulmodus (English Trail): Bundesland → Schulform → Klasse → Lehrwerk ----------
     Inhalte: D.school (Länder, Schulformen, Lehrwerke, Grammatik-Themen mit Klasse), Lernpakete = Einheiten mit "sch": Klasse,
     Grammatik = D.cases mit g (Thema) und k (Klasse ab). Doppeljahrgänge nach Bildungsplan BW: 5/6, 7/8, 9/10. */
  var SCH = { edit: false, topics: [], exam: null };
  function schPacks(g) { var a = []; for (var i = 0; i < U.length; i++) if (U[i].sch === g) a.push(i); return a; }
  function schLo(g) { return g - ((g - 5) % 2); }
  function schTopics(g, mode) {
    var T = (D.school && D.school.topics) || {}, lo = schLo(g);
    return Object.keys(T).filter(function (k) { var kk = T[k].k; return mode === 'new' ? kk >= lo && kk <= g : kk < lo; })
      .filter(function (k) { return D.cases.some(function (c) { return c.g === k; }); });
  }
  function schUnits() { var o = {}; S.custom.forEach(function (w, i) { if (w[3]) (o[w[3]] = o[w[3]] || []).push({ id: 'my:' + i, w: w, u: -1 }); }); return o; }
  /* Interessen: frei wählbar (nie nach Geschlecht vorgegeben). Gewählte Pakete stehen im Bereich Schule oben. */
  function intPacks() { var a = []; for (var i = 0; i < U.length; i++) if (U[i].int) a.push(i); return a; }
  function schLikesBox() {
    var all = intPacks(), likes = (S.likes || []).filter(function (id) { return all.some(function (i) { return U[i].id === id; }); });
    if (!likes.length || SCH.likeEdit) return '<section class="card stack"><h2>⭐ ' + esc(t('sch_likes')) + '</h2><p class="small">' + esc(t('sch_likes_d')) + '</p><div class="row" style="flex-wrap:wrap" id="likes">' +
      all.map(function (i) { var on = likes.indexOf(U[i].id) >= 0; return '<button type="button" class="btn' + (on ? ' primary' : '') + '" data-like="' + esc(U[i].id) + '" aria-pressed="' + on + '">' + esc(U[i].ico + ' ' + L(U[i].title)) + '</button>'; }).join('') +
      '</div><button class="btn primary" id="likes-ok" style="justify-self:start"' + (likes.length ? '' : ' disabled') + '>' + esc(t('sch_save')) + '</button></section>';
    return '<section class="card stack"><h2>⭐ ' + esc(t('sch_likes_mine')) + '</h2><div class="list">' + all.filter(function (i) { return likes.indexOf(U[i].id) >= 0; }).map(function (i) {
      var u = U[i], l = wordsOf(i), m = masteredCount(l);
      return '<button class="li linkish" data-sp="' + i + '" style="width:100%"><span aria-hidden="true">' + esc(u.ico) + '</span><span class="grow" style="text-align:left"><b>' + esc(L(u.title)) + '</b><br><span class="small muted" lang="en">' + esc(u.city) + '</span></span><span class="small num muted">' + m + '/' + l.length + '</span></button>';
    }).join('') + '</div><button class="btn ghost" id="likes-edit" style="justify-self:start">' + esc(t('sch_change')) + '</button></section>';
  }
  function bindLikes() {
    document.querySelectorAll('[data-like]').forEach(function (b) { b.onclick = function () { var id = b.getAttribute('data-like'), l = S.likes = (S.likes || []).slice(), k = l.indexOf(id); if (k >= 0) l.splice(k, 1); else l.push(id); SCH.likeEdit = true; save(); renderSchool(); }; });
    var ok = document.getElementById('likes-ok'); if (ok) ok.onclick = function () { SCH.likeEdit = false; save(); renderSchool(); };
    var ed = document.getElementById('likes-edit'); if (ed) ed.onclick = function () { SCH.likeEdit = true; renderSchool(); };
  }
  function schCount(g) { return D.cases.filter(function (c) { return c.g === g; }).length; }
  function schSetup() {
    var sc = S.school || {}, SD = D.school;
    var opt = function (list, cur) { return list.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.on ? '' : ' disabled') + (cur === x.id ? ' selected' : '') + '>' + esc(x.name) + (x.on ? '' : ' (' + t('sch_soon') + ')') + '</option>'; }).join(''); };
    return '<section class="card stack"><h2>' + esc(t('sch_setup')) + '</h2><p class="small muted">' + esc(t('sch_setup_d')) + '</p>' +
      '<label class="fld">' + esc(t('sch_state')) + '<select id="sc-st">' + opt(SD.states, sc.state || 'bw') + '</select></label>' +
      '<label class="fld">' + esc(t('sch_type')) + '<select id="sc-ty">' + opt(SD.types, sc.type || 'gym') + '</select></label>' +
      '<div class="stack"><b>' + esc(t('sch_class')) + '</b><div class="seg" id="sc-g">' + SD.grades.map(function (g) { return segBtn(String(g), String(g), sc.grade === g); }).join('') + '</div></div>' +
      '<label class="fld">' + esc(t('sch_book')) + '<select id="sc-bk"><option value="">' + esc(t('sch_book_none')) + '</option>' + SD.books.map(function (b) { return '<option value="' + esc(b.id) + '"' + (sc.book === b.id ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</select></label>' +
      '<p class="small muted">' + esc(t('sch_book_d')) + '</p>' +
      '<button class="btn primary" id="sc-save"' + (sc.grade ? '' : ' disabled') + '>' + esc(t('sch_save')) + '</button></section>';
  }
  function renderSchool() {
    var sc = S.school, html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>🎒 ' + esc(t('sch')) + '</h1>';
    if (!sc || !sc.grade || SCH.edit) {
      S.school = S.school || { state: 'bw', type: 'gym', grade: 0, book: '' };
      shell(html + schSetup());
      document.getElementById('back').onclick = function () { SCH.edit = false; go('practice'); };
      var st = function () { S.school.state = document.getElementById('sc-st').value; S.school.type = document.getElementById('sc-ty').value; S.school.book = document.getElementById('sc-bk').value; };
      bindSeg('sc-g', function (v) { st(); S.school.grade = +v; SCH.edit = true; renderSchool(); });
      document.getElementById('sc-save').onclick = function () { st(); SCH.edit = false; save(); renderSchool(); };
      return;
    }
    var g = sc.grade, SD = D.school, nm = function (list, id) { var x = list.filter(function (y) { return y.id === id; })[0]; return x ? x.name : ''; };
    var packs = schPacks(g), tNew = schTopics(g, 'new'), tOld = schTopics(g, 'old'), T = SD.topics, UN = schUnits();
    var topicBtn = function (k) { return '<button class="li linkish" data-sg="' + esc(k) + '" style="width:100%;justify-content:space-between"><span><b>' + esc(T[k].t) + '</b> <span class="small muted">· ' + esc(t('sch_from')) + ' ' + T[k].k + '</span></span><span class="badge num">' + schCount(k) + '</span></button>'; };
    html += '<section class="card stack"><span class="eyebrow">' + esc(nm(SD.states, sc.state)) + ' · ' + esc(nm(SD.types, sc.type)) + '</span><div class="big">' + esc(t('sch_grade').replace('{g}', g)) + '</div>' +
      (sc.book ? '<p class="small">' + esc(t('sch_book')) + ': ' + esc(nm(SD.books, sc.book)) + (sc.book !== 'other' ? ' · ' + esc(t('sch_band')) + ' ' + (g - 4) : '') + '</p>' : '') +
      '<button class="btn ghost" id="sc-edit" style="justify-self:start">' + esc(t('sch_change')) + '</button></section>' +
      schLikesBox() +
      '<section class="card stack"><h2>' + esc(t('sch_words')) + '</h2><p class="small muted">' + esc(t('sch_words_d')) + '</p><div class="list">' + packs.map(function (i) {
        var u = U[i], l = wordsOf(i), m = masteredCount(l);
        return '<button class="li linkish" data-sp="' + i + '" style="width:100%"><span aria-hidden="true">' + esc(u.ico) + '</span><span class="grow" style="text-align:left"><b>' + esc(u.city) + '</b><br><span class="small muted">' + esc(L(u.title)) + '</span></span><span class="small num muted">' + m + '/' + l.length + '</span></button>';
      }).join('') + '</div></section>' +
      '<section class="card stack"><h2>' + esc(t('sch_gram')) + '</h2><p class="small muted">' + esc(t('sch_gram_d').replace('{a}', schLo(g)).replace('{b}', schLo(g) + 1)) + '</p><div class="list">' + tNew.map(topicBtn).join('') + '</div>' +
      (tNew.length ? '<button class="btn" id="sc-gall" style="justify-self:start">' + esc(t('sch_gram_all')) + '</button>' : '') +
      (tOld.length ? '<details><summary class="small"><b>' + esc(t('sch_repeat')) + '</b> (' + tOld.length + ')</summary><div class="list">' + tOld.map(topicBtn).join('') + '</div></details>' : '') + '</section>' +
      '<section class="card stack"><h2>🏆 ' + esc(t('sch_week')) + '</h2><p class="small">' + esc(t('sch_week_d')) + '</p><p class="small muted">Code: <b class="num">' + esc(C.weekChallengeCode(today(), g)) + '</b></p><div class="row" style="flex-wrap:wrap"><button class="btn primary" id="sc-week">' + esc(t('sch_week_go')) + '</button><button class="btn" id="sc-face">' + esc(t('face')) + '</button><button class="btn" id="sc-duel">' + esc(t('sch_duel')) + '</button><button class="btn" id="sc-live">⚡ ' + esc(t('live')) + '</button></div></section>' +
      '<section class="card stack"><h2>📮 ' + esc(t('hw')) + '</h2><p class="small">' + esc(t('hw_d')) + '</p><div class="row" style="flex-wrap:nowrap"><input id="hw-in" class="num" autocapitalize="characters" autocomplete="off" placeholder="HA7-P3-T5" aria-label="' + esc(t('hw')) + '" style="flex:1;min-width:0"><button class="btn primary" id="hw-go">' + esc(t('hw_go')) + '</button></div>' + (S.hwDone && Object.keys(S.hwDone).length ? '<p class="small muted">' + esc(t('hw_done')) + ' ' + Object.keys(S.hwDone).slice(-3).map(function (k) { return k + ' (' + S.hwDone[k] + ' %)'; }).join(' · ') + '</p>' : '') + '</section>' +
      '<section class="card stack"><h2>📝 ' + esc(t('sch_exam')) + '</h2><p class="small muted">' + esc(t('sch_exam_d')) + '</p>' +
      '<fieldset class="stack" style="border:0;padding:0;margin:0"><legend class="small"><b>' + esc(t('sch_exam_pick')) + '</b></legend>' +
      tNew.concat(tOld).map(function (k) { return '<label class="row small"><input type="checkbox" data-xt="' + esc(k) + '"' + (tNew.indexOf(k) >= 0 ? ' checked' : '') + '> ' + esc(T[k].t) + '</label>'; }).join('') +
      packs.map(function (i) { return '<label class="row small"><input type="checkbox" data-xp="' + i + '" checked> ' + esc(U[i].ico + ' ' + U[i].city) + '</label>'; }).join('') +
      Object.keys(UN).sort().map(function (k) { return '<label class="row small"><input type="checkbox" data-xu="' + esc(k) + '" checked> 📘 ' + esc(k) + ' (' + esc(t('sch_mine')) + ')</label>'; }).join('') + '</fieldset>' +
      '<div class="row" style="flex-wrap:wrap"><button class="btn primary" id="sc-exam">' + esc(t('sch_exam_go')) + '</button><button class="btn" id="hw-make">📮 ' + esc(t('hw_make')) + '</button></div><p class="small muted" id="hw-out" role="status"></p>' + (S.schoolBest && S.schoolBest[g] != null ? '<p class="small muted">' + esc(t('best')) + ': ' + S.schoolBest[g] + '%</p>' : '') + '</section>' +
      (packs.length ? '<section class="card stack"><h2>✍️ ' + esc(t('sch_write')) + '</h2><p class="small muted">' + esc(t('sch_write_d')) + '</p><div class="row" style="flex-wrap:wrap">' + packs.map(function (i) { return '<button class="btn" data-sw="' + i + '">' + esc(U[i].ico + ' ' + U[i].city) + '</button>'; }).join('') + '</div></section>' : '') +
      '<section class="card stack"><h2>' + esc(t('sch_own')) + '</h2><p class="small">' + esc(t('sch_own_d')) + '</p>' +
      (Object.keys(UN).length ? '<div class="list">' + Object.keys(UN).sort().map(function (k) { return '<button class="li linkish" data-su="' + esc(k) + '" style="width:100%;justify-content:space-between"><b>📘 ' + esc(k) + '</b><span class="small muted">' + UN[k].length + ' ' + esc(t('words')) + ' · ' + esc(t('sch_unit_go')) + ' →</span></button>'; }).join('') + '</div>' : '') +
      '<button class="btn" id="sc-own" style="justify-self:start">' + esc(t('sch_own_add')) + '</button></section>' +
      (packs.length ? '<section class="card stack"><h2>' + esc(t('chat')) + '</h2><p class="small">' + esc(t('sch_chat_d').replace('{g}', g)) + '</p><button class="btn" id="sc-chat" style="justify-self:start">' + esc(t('chat')) + '</button></section>' : '') +
      '<section class="card stack"><h2>👪 ' + esc(t('par_title')) + '</h2><p class="small">' + esc(t('par_d')) + '</p><pre class="small par-rep" id="par-txt">' + esc(parentReport(g)) + '</pre><button class="btn" id="par-share" style="justify-self:start">' + esc(t('par_share')) + '</button></section>' +
      '<section class="card stack"><h2>❓ ' + esc(t('gd_title')) + '</h2><p class="small">' + esc(t('gd_sch_d')) + '</p><button class="btn" id="sc-guide" style="justify-self:start">' + esc(t('gd_open')) + ' →</button><p class="small muted">' + esc(t('rep_d')) + '</p>' + reportHtml('rep-sch') + '</section>';
    shell(html);
    document.getElementById('sc-guide').onclick = function () { go('guide', 'kids'); };
    document.getElementById('par-share').onclick = function () { shareOut(parentReport(g)); };
    bindReport('rep-sch', 'school K' + g);
    document.getElementById('back').onclick = function () { go('practice'); };
    document.getElementById('sc-edit').onclick = function () { SCH.edit = true; renderSchool(); };
    bindLikes();
    document.querySelectorAll('[data-sp]').forEach(function (b) { b.onclick = function () { go('city', +b.getAttribute('data-sp')); }; });
    document.querySelectorAll('[data-sg]').forEach(function (b) { b.onclick = function () { SCH.topics = [b.getAttribute('data-sg')]; startMode('sgram'); }; });
    var ga = document.getElementById('sc-gall'); if (ga) ga.onclick = function () { SCH.topics = tNew.slice(); startMode('sgram'); };
    document.getElementById('sc-exam').onclick = function () {
      SCH.exam = { g: g, topics: [], packs: [], units: [] };
      document.querySelectorAll('[data-xu]').forEach(function (c) { if (c.checked) SCH.exam.units.push(c.getAttribute('data-xu')); });
      document.querySelectorAll('[data-xt]').forEach(function (c) { if (c.checked) SCH.exam.topics.push(c.getAttribute('data-xt')); });
      document.querySelectorAll('[data-xp]').forEach(function (c) { if (c.checked) SCH.exam.packs.push(+c.getAttribute('data-xp')); });
      if (!SCH.exam.topics.length && !SCH.exam.packs.length && !SCH.exam.units.length) return toast(t('sch_exam_none'));
      startMode('sexam');
    };
    document.getElementById('sc-own').onclick = function () { go('mywords'); };
    document.getElementById('hw-make').onclick = function () {
      var tp = [], pk = []; document.querySelectorAll('[data-xt]').forEach(function (c) { if (c.checked) tp.push(c.getAttribute('data-xt')); });
      document.querySelectorAll('[data-xp]').forEach(function (c) { if (c.checked) pk.push(+c.getAttribute('data-xp')); });
      var code = C.hwCode(g, C.maskOf(schPacks(g), pk), C.maskOf(hwTopicList(), tp)), out = document.getElementById('hw-out');
      if (!code) { out.textContent = t('sch_exam_none'); return; }
      out.innerHTML = esc(t('hw_made')) + ' <b class="num">' + esc(code) + '</b>';
      shareOut(t('hw_share').replace('{c}', code).replace('{g}', g) + ' ' + SITE);
    };
    document.getElementById('hw-go').onclick = function () {
      var h = C.hwParse(document.getElementById('hw-in').value);
      if (!h) return toast(t('hw_bad'));
      SCH.hw = h; startMode('shw');
    };
    document.getElementById('sc-week').onclick = function () { var pl = C.duelPlan(RAW, C.weekChallengeCode(today(), g)); if (!pl) return toast(t('d2_bad')); duelCodeDraft = pl.code; duelGrade = g; tab = 'duel'; renderDuelReady(pl); };
    document.getElementById('sc-face').onclick = function () { faceSrc = 'school'; go('face'); };
    document.getElementById('sc-live').onclick = function () { S.liveSrc = 'school'; go('live'); };
    document.getElementById('sc-duel').onclick = function () { duelGrade = g; duelCodeDraft = C.duelNewCode(Math.random, '1', g); go('duel'); };
    document.querySelectorAll('[data-sw]').forEach(function (b) { b.onclick = function () { SCH.wr = null; go('writing', +b.getAttribute('data-sw')); }; });
    document.querySelectorAll('[data-su]').forEach(function (b) { b.onclick = function () { SCH.unit = b.getAttribute('data-su'); startMode('sunit'); }; });
    var ch = document.getElementById('sc-chat'); if (ch) ch.onclick = function () { startMode('chat', packs[0]); };
  }
  /* Probe-Klassenarbeit wie in BW: Grammatik, Wortschatz, Hörverstehen (Listening), Leseverstehen (Reading) und
     Sprachmittlung (Mediation). 20 Fragen, 15 Minuten, Ergebnis als Bestwert je Klasse + Notentendenz. */
  function schSentQ(sv, all, kind) {
    var others = C.shuffle(all.filter(function (x) { return x[0] !== sv[0]; }), R).slice(0, 3);
    if (kind === 'listen') return { type: 'mc', id: null, ask: '🎧 ' + t('sch_q_listen'), big: '', say: sv[0], hideText: true, reveal: sv[0] + ' = ' + sv[1], a: sv[1], opts: C.shuffle([sv[1]].concat(others.map(function (x) { return x[1]; })), R) };
    if (kind === 'read') return { type: 'mc', id: null, ask: '📖 ' + t('sch_q_read'), big: sv[0], small: true, bigPl: true, a: sv[1], opts: C.shuffle([sv[1]].concat(others.map(function (x) { return x[1]; })), R), sayAfter: sv[0] };
    return { type: 'mc', id: null, ask: '🔁 ' + t('sch_q_mediate'), big: sv[1], small: true, a: sv[0], opts: C.shuffle([sv[0]].concat(others.map(function (x) { return x[0]; })), R), sayAfter: sv[0], plOpts: true };
  }
  /* Hausaufgabe per Code: gleiche 20 Fragen für alle mit demselben Code (Zufall aus dem Code) */
  function hwTopicList() { return Object.keys((D.school && D.school.topics) || {}); }
  function startHomework() {
    var h = SCH.hw; if (!h) return go('school');
    var packs = C.fromMask(schPacks(h.grade), h.pm), topics = C.fromMask(hwTopicList(), h.tm);
    if (!packs.length && !topics.length) { toast(t('hw_bad')); return go('school'); }
    var saved = R; R = C.rng('hw|' + h.code);
    SCH.exam = { g: h.grade, topics: topics, packs: packs, units: [] };
    try { startSchoolExam(h); } finally { R = saved; }
  }
  function startSchoolExam(hw) {
    var X = SCH.exam, gl = D.cases.filter(function (c) { return X.topics.indexOf(c.g) >= 0; }), wl = [], sl = sentencesOf(X.packs);
    X.packs.forEach(function (i) { wl = wl.concat(wordsOf(i)); });
    var UN = schUnits(), own = []; (X.units || []).forEach(function (k) { own = own.concat(UN[k] || []); });
    if (own.length) wl = C.shuffle(own, R).slice(0, 8).concat(C.shuffle(wl, R));
    var nS = sl.length >= 4 ? 7 : 0, nG = Math.min(gl.length, wl.length ? (nS ? 8 : 12) : 20 - nS), nW = Math.min(20 - nG - nS, wl.length);
    var ss = C.shuffle(sl, R).slice(0, nS), kinds = ['listen', 'listen', 'listen', 'read', 'read', 'mediate', 'mediate'];
    var qs = C.shuffle(gl, R).slice(0, nG).map(qCase)
      .concat(C.shuffle(wl, R).slice(0, nW).map(function (x, k) { return qMC(x, wl, k % 2 ? 'x2pl' : 'pl2x'); }))
      .concat(ss.map(function (sv, k) { return schSentQ(sv, sl, kinds[k]); }));
    if (hw) return runGame({ title: '📮 ' + t('hw') + ' ' + hw.code, qs: C.shuffle(qs, R), back: 'school', homework: hw.code });
    return runGame({ title: t('sch_exam'), qs: C.shuffle(qs, R), timer: 900, back: 'school', schoolExam: X.g });
  }
  /* Schreibauftrag (Writing) wie in der Klassenarbeit: Thema eines Pakets, 5 Pflichtwörter, Selbstkontrolle mit Checkliste */
  function renderWriting(i) {
    var u = U[i], W = SCH.wr && SCH.wr.i === i ? SCH.wr : (SCH.wr = { i: i, words: C.shuffle(wordsOf(i).map(function (x) { return x.w[0]; }), R).slice(0, 5), txt: '', done: false });
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>✍️ ' + esc(t('sch_write')) + '</h1>' +
      '<section class="card stack"><span class="eyebrow">' + esc(u.ico + ' ' + u.city) + '</span><p>' + esc(t('sch_write_task').replace('{t}', L(u.title))) + '</p>' +
      '<p class="small"><b>' + esc(t('sch_write_use')) + ':</b> ' + W.words.map(function (w) { return '<span class="badge" lang="en">' + esc(w) + '</span>'; }).join(' ') + '</p>' +
      '<p class="small muted">' + esc(L(u.tip)) + '</p>' +
      '<textarea id="wr-txt" rows="8" lang="en" maxlength="2000" aria-label="' + esc(t('sch_write')) + '">' + esc(W.txt) + '</textarea>' +
      '<button class="btn primary" id="wr-check" style="justify-self:start">' + esc(t('sch_write_check')) + '</button><div id="wr-res"></div></section>';
    shell(html);
    document.getElementById('back').onclick = function () { go('school'); };
    var res = function () {
      var txt = document.getElementById('wr-txt').value; W.txt = txt;
      var r = C.writingCheck(txt, W.words);
      document.getElementById('wr-res').innerHTML = '<ul class="news-ul">' + r.items.map(function (it) { return '<li class="small">' + (it[1] ? '✅ ' : '⬜ ') + esc(t(it[0]).replace('{n}', it[2])) + '</li>'; }).join('') + '</ul>' +
        '<p><b>' + r.score + ' %</b> · ' + esc(r.score >= 80 ? t('sch_write_good') : t('sch_write_more')) + '</p>';
      if (r.score >= 80 && !W.done) { W.done = true; addXp(30); markActive(); save(); }
    };
    document.getElementById('wr-check').onclick = res;
  }

  /* ---------- Live-Duell: 2 Handys in Echtzeit, wer zuerst richtig antwortet, bekommt den Punkt ----------
     Idee aus GeoQuest (Supabase-Realtime „Broadcast“ in einem Raum), aber robuster: Die Fragen kommen deterministisch
     aus dem Duell-Code (C.duelPlan) – über den Kanal laufen nur „hi“, „ready“, „go“, „ans“ (Frage, richtig?, Zeit) und „bye“.
     Kein Konto, nichts wird gespeichert: nur Spitzname und Antworten gehen live ans andere Handy (Kinder unter 16). */
  var LD = null, LD_Q_MS = 20000, LD_WAIT_MS = 25000;
  function ldRT(code, onMsg, onState) {
    var url = SB_URL.replace(/^http/, 'ws') + '/realtime/v1/websocket?' + new URLSearchParams({ apikey: SB_KEY, vsn: '1.0.0' }).toString();
    var topic = 'realtime:et_live_' + code, ref = 0, hb = null, ws = new WebSocket(url), joined = false;
    var rt = {
      send: function (ev, payload) { if (ws.readyState === 1 && joined) ws.send(JSON.stringify({ topic: topic, event: 'broadcast', payload: { type: 'broadcast', event: ev, payload: payload }, ref: String(++ref), join_ref: '1' })); },
      close: function () { clearInterval(hb); try { ws.close(); } catch (e) {} }
    };
    ws.onopen = function () {
      ws.send(JSON.stringify({ topic: topic, event: 'phx_join', payload: { config: { broadcast: { self: false, ack: false }, presence: { key: '' }, postgres_changes: [], private: false }, access_token: SB_KEY }, ref: String(++ref), join_ref: '1' }));
      hb = setInterval(function () { if (ws.readyState === 1) ws.send(JSON.stringify({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(++ref) })); }, 25000);
    };
    ws.onmessage = function (e) {
      var m; try { m = JSON.parse(e.data); } catch (er) { return; }
      if (m.event === 'phx_reply' && m.topic === topic && !joined) { joined = m.payload && m.payload.status === 'ok'; onState(joined ? 'joined' : 'error'); return; }
      if (m.event === 'broadcast' && m.payload) onMsg(m.payload.event, m.payload.payload || {});
    };
    ws.onerror = function () { onState('error'); };
    ws.onclose = function () { clearInterval(hb); onState('closed'); };
    return rt;
  }
  function ldLeave() { if (LD) { clearTimeout(LD.tq); clearTimeout(LD.tw); clearInterval(LD.tc); if (LD.rt) { LD.rt.send('bye', { id: LD.me.id }); LD.rt.close(); } } LD = null; }
  function renderLiveSetup() {
    ldLeave();
    var g = S.school && S.school.grade, src = S.liveSrc === 'trail' || !g ? 'trail' : 'school';
    shell('<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>⚡ ' + esc(t('live')) + '</h1>' +
      '<section class="card stack"><p class="small">' + esc(t('live_d')) + '</p>' +
      '<label class="small" for="ld-name"><b>' + esc(t('live_name')) + '</b></label><input type="text" id="ld-name" maxlength="20" autocomplete="off" value="' + esc(S.name || '') + '">' +
      (g ? '<b class="small">' + esc(t('d2_src')) + '</b><div class="seg" id="ld-src">' + segBtn('trail', t('d2_src_trail'), src === 'trail') + segBtn('school', t('sch_grade').replace('{g}', g), src === 'school') + '</div>' : '') +
      '<button class="btn primary" id="ld-new">' + esc(t('live_new')) + '</button></section>' +
      '<section class="card stack"><b>' + esc(t('live_join')) + '</b><input type="text" id="ld-code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="FOX-472-1" style="text-transform:uppercase;letter-spacing:.08em">' +
      '<p class="small" id="ld-err" role="alert" hidden></p><button class="btn" id="ld-go">' + esc(t('live_join_btn')) + '</button></section>' +
      '<p class="small muted">' + esc(t('live_privacy')) + '</p>');
    document.getElementById('back').onclick = function () { go(S.school && S.school.grade ? 'school' : 'practice'); };
    bindSeg('ld-src', function (v) { S.liveSrc = v; save(); renderLiveSetup(); });
    var nm = function () { S.name = C.duelName(document.getElementById('ld-name').value) || S.name || ''; save(); return S.name || t('live_me'); };
    document.getElementById('ld-new').onclick = function () { ldStart(C.duelNewCode(Math.random, '1', src === 'school' ? g : 0), nm()); };
    document.getElementById('ld-go').onclick = function () {
      var pc = C.duelParse(document.getElementById('ld-code').value), er = document.getElementById('ld-err');
      if (!pc || !C.duelPlan(RAW, pc.code)) { er.textContent = t('d2_bad'); er.hidden = false; return; }
      ldStart(pc.code, nm());
    };
  }
  function ldStart(code, name) {
    if (!navigator.onLine) return toast(t('live_offline'));
    var pl = C.duelPlan(RAW, code); if (!pl) return toast(t('d2_bad'));
    tab = 'live';
    LD = { code: pl.code, check: pl.check, plan: pl.plan, me: { id: Math.random().toString(36).slice(2, 10), name: name, ready: false }, opp: null, phase: 'connect', i: -1, ans: {}, score: [0, 0], right: 0 };
    var me = LD;
    LD.rt = ldRT(pl.code, function (ev, p) { if (LD === me) ldOnMsg(ev, p); }, function (st) {
      if (LD !== me) return;
      if (st === 'joined') { LD.phase = 'wait'; LD.rt.send('hi', { id: LD.me.id, name: LD.me.name, check: LD.check }); }
      else if (st === 'error' || (st === 'closed' && LD.phase !== 'done')) { LD.phase = 'error'; }
      ldRender();
    });
    ldRender();
  }
  function ldOnMsg(ev, p) {
    if (ev === 'hi') {
      if (p.id === LD.me.id || (LD.opp && LD.opp.id !== p.id)) return;
      var first = !LD.opp; LD.opp = { id: p.id, name: C.duelName(p.name) || t('live_opp'), ready: false, bad: p.check && p.check !== LD.check };
      if (first) LD.rt.send('hi', { id: LD.me.id, name: LD.me.name, check: LD.check });
      if (LD.phase === 'wait') LD.phase = 'lobby';
      return ldRender();
    }
    if (!LD.opp || p.id && p.id !== LD.opp.id && ev !== 'go') return;
    if (ev === 'ready') { LD.opp.ready = true; ldMaybeGo(); return ldRender(); }
    if (ev === 'go' && LD.phase === 'lobby') return ldCountdown();
    if (ev === 'ans') { (LD.ans[p.i] = LD.ans[p.i] || {}).opp = { ok: !!p.ok, ms: +p.ms || LD_Q_MS }; return ldResolve(p.i); }
    if (ev === 'bye' && LD.phase !== 'done') { LD.left = true; if (LD.phase === 'play') ldFinish(); else { LD.phase = 'wait'; LD.opp = null; ldRender(); } }
  }
  function ldMaybeGo() { if (LD.me.ready && LD.opp && LD.opp.ready && LD.phase === 'lobby' && LD.me.id < LD.opp.id) { LD.rt.send('go', { id: LD.me.id }); ldCountdown(); } }
  function ldCountdown() {
    LD.phase = 'count'; LD.count = 3; ldRender();
    LD.tc = setInterval(function () { if (!LD) return; LD.count--; if (LD.count <= 0) { clearInterval(LD.tc); LD.phase = 'play'; ldShowQ(0); } else ldRender(); }, 1000);
  }
  function ldShowQ(i) {
    if (i >= LD.plan.length) return ldFinish();
    var it = LD.plan[i], q = duelQ(it);
    if (q.type !== 'mc') { q.type = 'mc'; q.opts = (it.opts || []).slice(); }
    LD.i = i; LD.q = q; LD.t0 = Date.now(); LD.locked = false; LD.reveal = null; ldRender();
    clearTimeout(LD.tq); clearTimeout(LD.tw);
    LD.tq = setTimeout(function () { if (LD && LD.i === i && !LD.locked) ldAnswer(null); }, LD_Q_MS);
    LD.tw = setTimeout(function () { if (LD && LD.i === i) { var a = LD.ans[i] = LD.ans[i] || {}; if (!a.opp) a.opp = { ok: false, ms: LD_Q_MS }; ldResolve(i); } }, LD_WAIT_MS);
  }
  function ldAnswer(opt) {
    if (!LD || LD.locked || LD.phase !== 'play') return;
    var i = LD.i, ok = opt != null && C.norm(opt) === C.norm(LD.q.a), ms = opt == null ? LD_Q_MS : Date.now() - LD.t0;
    LD.locked = true; LD.picked = opt; (LD.ans[i] = LD.ans[i] || {}).me = { ok: ok, ms: ms };
    if (ok) LD.right++;
    LD.rt.send('ans', { id: LD.me.id, i: i, ok: ok, ms: ms });
    if (LD.q.sayAfter || LD.q.say) try { speak(LD.q.sayAfter || LD.q.say); } catch (e) {}
    ldResolve(i); ldRender();
  }
  function ldResolve(i) {
    var a = LD && LD.ans[i]; if (!a || !a.me || !a.opp || i !== LD.i || LD.reveal) return;
    var w = C.liveWinner(a.me, a.opp, LD.me.id, LD.opp ? LD.opp.id : '');
    if (w === 1) LD.score[0]++; else if (w === -1) LD.score[1]++;
    LD.reveal = { w: w }; clearTimeout(LD.tq); clearTimeout(LD.tw); ldRender();
    setTimeout(function () { if (LD && LD.i === i && LD.phase === 'play') ldShowQ(i + 1); }, 1800);
  }
  function ldFinish() {
    LD.phase = 'done'; clearTimeout(LD.tq); clearTimeout(LD.tw);
    addXp(LD.right * 10); if (LD.i >= 2) markActive(); save(); ldRender();
  }
  function ldRender() {
    if (!LD || tab !== 'live') return;
    var on = LD.opp ? esc(LD.opp.name) : '…', me = esc(LD.me.name), html = '';
    var head = '<section class="card row" style="justify-content:space-between"><span><b>' + me + '</b> <span class="num">' + LD.score[0] + '</span></span><span class="small muted num">' + (LD.phase === 'play' ? (LD.i + 1) + '/' + LD.plan.length : '') + '</span><span><span class="num">' + LD.score[1] + '</span> <b>' + on + '</b></span></section>';
    if (LD.phase === 'connect') html = '<section class="card"><p>' + esc(t('live_connect')) + '</p></section>';
    else if (LD.phase === 'error') html = '<section class="card stack"><p>' + esc(t('live_err')) + '</p><button class="btn" id="ld-back">' + esc(t('back')) + '</button></section>';
    else if (LD.phase === 'wait') html = '<section class="card stack" style="text-align:center"><span class="eyebrow">' + esc(t('live_code')) + '</span><div class="score num" lang="en" style="letter-spacing:.06em">' + esc(LD.code) + '</div><p class="small">' + esc(t('live_wait')) + '</p><button class="btn" id="ld-copy">' + esc(t('d2_send_code')) + '</button><button class="btn ghost" id="ld-back">' + esc(t('back')) + '</button></section>';
    else if (LD.phase === 'lobby') html = '<section class="card stack" style="text-align:center"><p>' + esc(t('live_found').replace('{n}', LD.opp.name)) + '</p>' + (LD.opp.bad ? '<p class="small" role="alert">' + esc(t('live_ver')) + '</p>' : '') +
      '<p class="small muted">' + esc(LD.me.ready ? (LD.opp.ready ? '' : t('live_wait_ready').replace('{n}', LD.opp.name)) : (LD.opp.ready ? t('live_opp_ready').replace('{n}', LD.opp.name) : '')) + '</p>' +
      (LD.me.ready ? '' : '<button class="btn primary" id="ld-ready">' + esc(t('live_ready')) + '</button>') + '<button class="btn ghost" id="ld-back">' + esc(t('back')) + '</button></section>';
    else if (LD.phase === 'count') html = '<section class="card" style="text-align:center"><div class="score num">' + LD.count + '</div></section>';
    else if (LD.phase === 'play') {
      var q = LD.q, a = LD.ans[LD.i] || {}, rv = LD.reveal;
      html = head + '<section class="card stack"><span class="small muted">' + esc(q.ask || '') + '</span>' +
        (q.big ? '<div class="' + (q.small ? 'sentence' : 'big') + '" lang="' + (q.bigPl ? 'en' : 'de') + '">' + esc(q.big) + '</div>' : '') +
        (q.sentence ? '<div class="sentence" lang="en">' + esc(q.sentence).replace('___', '<span class="blank">&nbsp;</span>') + '</div>' : '') +
        '<div class="opts">' + q.opts.map(function (o) {
          var cls = rv || LD.locked ? (C.norm(o) === C.norm(q.a) ? ' good' : (o === LD.picked ? ' bad' : '')) : '';
          return '<button class="opt' + cls + '" data-lo="' + esc(o) + '"' + (LD.locked ? ' disabled' : '') + (q.plOpts ? ' lang="en"' : '') + '>' + esc(o) + '</button>';
        }).join('') + '</div>' +
        '<p class="small" role="status">' + (rv ? esc(rv.w === 1 ? t('live_pt_me') : rv.w === -1 ? t('live_pt_opp').replace('{n}', LD.opp.name) : t('live_pt_none')) : LD.locked ? esc(a.me && a.me.ok ? t('live_ok_wait') : t('live_wrong')) : (a.opp ? esc(t('live_opp_done').replace('{n}', LD.opp ? LD.opp.name : '')) : '')) + '</p></section>';
    } else if (LD.phase === 'done') {
      var res = LD.score[0] > LD.score[1] ? t('live_win') : LD.score[0] < LD.score[1] ? t('live_lose').replace('{n}', LD.opp ? LD.opp.name : t('live_opp')) : t('live_draw');
      html = head + '<section class="card stack" style="text-align:center"><div class="big">' + esc(res) + '</div>' + (LD.left ? '<p class="small muted">' + esc(t('live_left')) + '</p>' : '') +
        '<p class="small">' + esc(t('live_right').replace('{n}', LD.right).replace('{t}', LD.plan.length)) + '</p><button class="btn primary" id="ld-again">' + esc(t('live_again')) + '</button><button class="btn ghost" id="ld-back">' + esc(t('back')) + '</button></section>';
    }
    shell('<h1>⚡ ' + esc(t('live')) + '</h1>' + html);
    var b;
    if ((b = document.getElementById('ld-back'))) b.onclick = function () { ldLeave(); renderLiveSetup(); };
    if ((b = document.getElementById('ld-copy'))) b.onclick = function () { copy('English Trail ⚡ ' + t('live') + ': ' + LD.code + ' – ' + SITE); };
    if ((b = document.getElementById('ld-ready'))) b.onclick = function () { LD.me.ready = true; LD.rt.send('ready', { id: LD.me.id }); ldMaybeGo(); ldRender(); };
    if ((b = document.getElementById('ld-again'))) b.onclick = function () { var nm = LD.me.name, g = C.duelParse(LD.code).grade; ldLeave(); ldStart(C.duelNewCode(Math.random, '1', g), nm); };
    document.querySelectorAll('[data-lo]').forEach(function (x) { x.onclick = function () { ldAnswer(x.getAttribute('data-lo')); }; });
  }

  var lastMode = null;
  function startMode(mode, ui) {
    lastMode = { m: mode, ui: ui };
    var n = S.len, u = ui != null ? U[ui] : null, list = ui != null ? wordsOf(ui) : null, pool = poolOpen(), qs;
    if (pool.length < 8) pool = pool.concat(wordsOf(Math.min(1, U.length - 1)));
    if (mode === 'learn') {
      var newOnes = list.filter(function (x) { return !S.cards[x.id]; }), pick = (newOnes.length ? newOnes : C.shuffle(list, R)).slice(0, 6);
      qs = pick.map(function (x) { return { type: 'card', id: x.id, big: x.w[0], sub: meaning(x.w), say: x.w[0] }; })
        .concat(C.shuffle(pick, R).map(function (x) { return qMC(x, list, 'pl2x'); }))
        .concat(C.shuffle(pick, R).slice(0, 3).map(function (x) { return qMC(x, list, 'x2pl'); }));
      return runGame({ title: t('learn'), qs: qs, unit: ui });
    }
    /* 3.1.2: Abfragen nur mit Wörtern, die man schon kennengelernt hat (sonst erst „Neue Wörter“) */
    if (mode === 'quiz' || mode === 'listen' || mode === 'type' || mode === 'match') {
      var known = list.filter(function (x) { return S.cards[x.id]; });
      if (known.length < 4) { toast(t('learn_first')); return startMode('learn', ui); }
      if (mode === 'quiz') return runGame({ title: t('quiz'), qs: mixedFor(known, list, n), unit: ui });
      if (mode === 'listen') return runGame({ title: t('listen'), qs: C.shuffle(known, R).slice(0, n).map(function (x) { return qListen(x, list); }), unit: ui });
      if (mode === 'type') return runGame({ title: t('type'), qs: C.shuffle(known, R).slice(0, n).map(qType), unit: ui });
      return runMatch(known, ui);
    }
    if (mode === 'build') return runGame({ title: t('build'), qs: C.shuffle(u.sentences, R).map(function (s) { return qBuild(s); }), unit: ui });
    if (mode === 'cloze') return runGame({ title: t('cloze'), qs: C.shuffle(u.sentences, R).map(function (s) { return qCloze(s, list); }), unit: ui });
    if (mode === 'speak') return runGame({ title: t('speak'), qs: u.sentences.map(qSpeak), unit: ui });
    if (mode === 'wait') return go('city', ui);
    /* 3.5: fällige Wörter einer Stadt – nur diese bringen Wörter Richtung „sicher“ (Wiederholung mit Abstand) */
    if (mode === 'due') {
      var dl = list.filter(function (x) { return C.isDue(S.cards[x.id], today()); });
      if (!dl.length) { toast(t('due_none_city')); return go('city', ui); }
      return runGame({ title: t('due_city') + ' · ' + u.city, qs: mixedFor(C.shuffle(dl, R).slice(0, Math.max(n, 8)), list, Math.min(Math.max(n, 8), dl.length)), unit: ui });
    }
    if (mode === 'ripen') {
      var rl = ripenList(ui); if (!rl.length) { toast(t('ripe_wait')); return go('city', ui); }
      rl = C.shuffle(rl, R).slice(0, Math.max(n, 6));
      return runGame({ title: t('ripen') + ' · ' + u.city, qs: mixedFor(rl, list, Math.min(n, Math.max(rl.length, 4))), unit: ui });
    }
    if (mode === 'scene') return runScene(ui);
    if (mode === 'read') { tab = 'read'; view = null; polUI = false; return renderRead(ui); }
    if (mode === 'boss') {
      var bc = diff().boss, ss = C.shuffle(u.sentences, R);
      qs = mixedFor(list, list, bc.n - 4).concat(ss.slice(0, 2).map(function (s) { return S.diff === 'easy' ? qBuild(s) : qTranslate(s); })).concat(ss.slice(2, 4).map(function (s) { return qCloze(s, list); }));
      return runGame({ title: t('boss') + ' · ' + u.city, qs: C.shuffle(qs, R), unit: ui, boss: true, lives: bc.lives, pass: bc.pass });
    }
    if (mode === 'themes') { tab = 'themes'; return renderThemes(); }
    if (mode === 'exam') { go('exam'); return; }
    if (mode === 'chat') { tab = 'chat'; view = null; polUI = false; return renderChat(ui != null ? ui : null); }
    if (mode === 'themelearn' || mode === 'themeq') {
      var th = themeById(curTheme); if (!th) return go('themes');
      var tw = themeWords(th);
      if (mode === 'themelearn') {
        var nw = tw.filter(function (x) { return !S.cards[x.id]; }), tp = (nw.length ? nw : C.shuffle(tw, R)).slice(0, 6);
        qs = tp.map(function (x) { return { type: 'card', id: x.id, big: x.w[0], sub: meaning(x.w), say: x.w[0] }; }).concat(C.shuffle(tp, R).map(function (x) { return qMC(x, tw, 'pl2x'); })).concat(C.shuffle(tp, R).slice(0, 3).map(function (x) { return qMC(x, tw, 'x2pl'); }));
        return runGame({ title: L(th.t), qs: qs, back: 'themes', rerun: function () { curTheme = th.id; startMode('themelearn'); } });
      }
      var ts = tw.filter(function (x) { return S.cards[x.id]; }); if (ts.length < 4) ts = tw;
      return runGame({ title: L(th.t), qs: mixedFor(ts, tw, n), back: 'themes', rerun: function () { curTheme = th.id; startMode('themeq'); } });
    }
    if (mode === 'conj') { tab = 'conj'; return renderConj(); }
    if (mode === 'school') return go('school');
    if (mode === 'live') return go('live');
    if (mode === 'sgram') { var gl = D.cases.filter(function (c) { return SCH.topics.indexOf(c.g) >= 0; }); return runGame({ title: t('sch_gram'), qs: C.shuffle(gl, R).slice(0, Math.min(n, gl.length)).map(qCase), back: 'school' }); }
    if (mode === 'sexam') return startSchoolExam();
    if (mode === 'shw') return startHomework();
    if (mode === 'sunit') { var uw = schUnits()[SCH.unit] || []; if (uw.length < 2) return toast(t('sch_unit_few')); return runGame({ title: SCH.unit, qs: mixedFor(uw, uw.length >= 4 ? uw : uw.concat(pool), Math.min(n, Math.max(uw.length * 2, 4))), back: 'school' }); }
    if (mode === 'conjgo') return runGame({ title: t('conj'), qs: conjQs(n), rerun: function () { startMode('conjgo'); }, back: 'conj' });
    if (mode === 'wr3') { var w3 = S.mistakes.map(byId).filter(Boolean).slice(0, 3); if (!w3.length) return go('home'); return runGame({ title: t('wr_title'), qs: mixedFor(w3, pool.concat(w3), 6) }); }
    if (mode === 'welcome') {
      var wsrc = allWords().filter(function (x) { return S.cards[x.id]; }).sort(function (a, b) { return S.cards[a.id].box - S.cards[b.id].box; }).slice(0, 5);
      if (wsrc.length < 2) wsrc = pool.slice(0, 5);
      return runGame({ title: t('wb_title'), qs: mixedFor(wsrc, pool.concat(wsrc), 5) });
    }
    if (mode === 'review' || mode === 'mistakes' || mode === 'mine') {
      var src;
      if (mode === 'review') { src = dueList(); if (!src.length) { toast(t('no_due')); src = allWords().filter(function (x) { return S.cards[x.id]; }).sort(function (a, b) { return S.cards[a.id].box - S.cards[b.id].box; }); if (!src.length) src = pool; } }
      else if (mode === 'mistakes') { src = S.mistakes.map(byId).filter(Boolean); if (!src.length) { toast(t('empty_mistakes')); return; } }
      else { src = S.custom.map(function (w, i) { return { id: 'my:' + i, w: w, u: -1 }; }); }
      src = src.slice(0, Math.max(n, 6));
      return runGame({ title: t(mode === 'mine' ? 'mywords' : mode), qs: mixedFor(src, mode === 'mine' ? src : pool.concat(src), Math.min(n, Math.max(src.length, 4))) });
    }
    if (mode === 'daily') {
      var d = today(), r0 = C.rng('daily-' + d), saved = R; R = r0;
      var src2 = C.sample(pool, 8, r0), sents = sentencesOf(openUnits());
      qs = src2.slice(0, 6).map(function (x, i) { return i % 2 ? qMC(x, pool, 'x2pl') : qListen(x, pool); }).concat(C.sample(sents, 2, r0).map(function (s) { return qBuild(s); }))
        .concat([qTF(D.culture.tf[Math.floor(r0() * D.culture.tf.length)]), qWho(D.culture.people[Math.floor(r0() * D.culture.people.length)])]);
      R = saved;
      return runGame({ title: t('daily'), qs: qs, daily: d });
    }
    if (mode === 'blitz') return runGame({ title: t('blitz'), qs: mixedFor(pool, pool, 80).filter(function (q) { return q.type === 'mc'; }), timer: diff().blitz });
    if (mode === 'spell') { var need = diff().opts - 1, sp = pool.filter(function (x) { return C.spellWorthy(x.w[0]) && C.misspell(x.w[0], need, C.rng(x.w[0])).length >= need; }); return runGame({ title: t('spell'), qs: C.sample(sp, Math.min(n, sp.length), R).map(function (x) { return qSpell(x, pool); }) }); }
    if (mode === 'survival') return runGame({ title: t('survival'), qs: mixedFor(pool, pool, 300).filter(function (q) { return q.type === 'mc'; }), lives: 3, survival: S.diff === 'hard' ? 6 : (S.diff === 'medium' ? 8 : 12) });
    if (mode === 'whoami') return runGame({ title: t('whoami'), qs: C.sample(D.culture.people, Math.min(n, 6), R).map(qWho) });
    if (mode === 'tf') return runGame({ title: t('tf'), qs: C.sample(D.culture.tf, Math.min(n, D.culture.tf.length), R).map(qTF) });
    if (mode === 'timeline') { qs = []; for (var ti = 0; ti < 4; ti++) qs.push(qOrder(C.sample(D.culture.timeline, S.diff === 'hard' ? 5 : 4, R))); return runGame({ title: t('timeline'), qs: qs }); }
    if (mode === 'pin') return runGame({ title: t('pin'), qs: C.sample(placesAll(), Math.min(n, 8), R).map(qPin) });
    if (mode === 'hl') { qs = []; for (var hi2 = 0; hi2 < Math.min(n, 10); hi2++) { var qh = qHL(D.culture.hl[hi2 % D.culture.hl.length]); if (qh) qs.push(qh); } return runGame({ title: t('hl'), qs: qs }); }
    if (mode === 'literki') return runGame({ title: t('literki'), qs: C.sample(pool.filter(function (x) { return x.w[0].indexOf(' ') < 0 && x.w[0].length >= 4 && x.w[0].length <= 10; }), Math.min(n, 8), R).map(qLetters) });
    if (mode === 'placement') {
      qs = [];
      /* 3.1.2: 3 Fragen pro Stadt (1× Auswahl, 2× Schreiben), alle müssen stimmen – zwei bekannte Wörter reichen nicht mehr zum Überspringen */
      routeIdx().forEach(function (i) { var w = C.sample(wordsOf(i), 3, R); [qMC(w[0], wordsOf(i), 'x2pl'), qType(w[1]), qType(w[2])].forEach(function (q) { q.city = i; qs.push(q); }); });
      return runGame({ title: t('placement'), qs: qs, placement: true });
    }
    if (mode === 'aspect') return runGame({ title: t('aspect'), qs: C.shuffle(D.aspects, R).slice(0, Math.min(n, D.aspects.length)).map(qAspect) });
    if (mode === 'letterquiz') return runGame({ title: t('lq'), qs: C.shuffle(D.letterQuiz, R).map(qLetter), letterQuiz: true, back: 'letter' });
    if (mode === 'cases') return runGame({ title: t('cases'), qs: C.shuffle(D.cases, R).slice(0, Math.min(n, D.cases.length)).map(qCase) });
    if (mode === 'sounds') {
      qs = C.shuffle(D.sounds, R).slice(0, 6).map(qSound);
      for (var k = 0; k < 4; k++) qs.push(qHearWord(pool));
      return runGame({ title: t('sounds'), qs: C.shuffle(qs, R) });
    }
    if (mode === 'prices') { qs = []; for (var p = 0; p < n; p++) qs.push(qPrice()); return runGame({ title: t('prices'), qs: qs }); }
    if (mode === 'memo_w' || mode === 'memo_p' || mode === 'memo_y') return runMemo(mode);
    if (mode === 'twister') return runGame({ title: t('twister'), qs: C.sample(D.twisters, Math.min(6, D.twisters.length), R).map(qSpeak) });
    if (mode === 'duel') { tab = 'duel'; return renderDuelSetup(); }
    if (mode === 'face') { tab = 'face'; return renderFaceSetup(); }
    if (mode === 'polacy') return needPolacy(function () { tab = 'polacy'; renderPolacy(); });
    if (mode === 'mywords') { tab = 'mywords'; return renderMyWords(); }
    if (mode === 'lex') { tab = 'lex'; return renderLex(); }
  }

  /* ---------- Nach Thema (3.0): dieselben Lektionen aus Szlak 1, Szlak 2 und den Paketen, nach Alltagsthema gebündelt ---------- */
  var cityBack = null, curTheme = null;
  function themeById(id) { return (D.themes || []).filter(function (x) { return x.id === id; })[0] || null; }
  function themeUnits(th) { return th.u.map(function (id) { for (var i = 0; i < U.length; i++) if (U[i].id === id) return i; return -1; }).filter(function (i) { return i >= 0; }); }
  function themeWords(th) { var a = []; themeUnits(th).forEach(function (i) { a = a.concat(wordsOf(i)); }); return a; }
  function renderThemes(id) {
    var th = id ? themeById(id) : null, html;
    if (!th) {
      html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('home')) + '</button><h1>' + esc(t('themes')) + '</h1><p class="muted">' + esc(t('themes_intro')) + '</p><section class="stack">' +
        (D.themes || []).map(function (x) {
          var ws = themeWords(x), m = masteredCount(ws), seen = ws.filter(function (w) { return S.cards[w.id]; }).length;
          return '<button class="card theme-card" data-th="' + esc(x.id) + '"><span class="theme-ico" aria-hidden="true">' + esc(x.ico) + '</span><span class="stack grow" style="gap:4px;text-align:left"><b>' + esc(L(x.t)) + '</b>' +
            '<span class="small muted">' + esc(themeUnits(x).map(function (i) { return U[i].pack ? cityName(U[i]) : U[i].city; }).join(' · ')) + '</span>' +
            '<span class="bar"><i style="width:' + (ws.length ? seen / ws.length * 100 : 0) + '%"></i></span><span class="small muted num">' + esc(t('theme_stats').replace('{n}', ws.length).replace('{s}', seen).replace('{m}', m)) + '</span></span></button>';
        }).join('') + '</section>';
      shell(html);
      document.getElementById('back').onclick = function () { go('home'); };
      document.querySelectorAll('[data-th]').forEach(function (b) { b.onclick = function () { go('themes', b.getAttribute('data-th')); }; });
      return;
    }
    var ws = themeWords(th), seen = ws.filter(function (w) { return S.cards[w.id]; }).length, fresh = ws.length - seen;
    html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('themes')) + '</button><div class="row"><span class="theme-ico" aria-hidden="true">' + esc(th.ico) + '</span><h1>' + esc(L(th.t)) + '</h1></div>' +
      '<p class="small muted num">' + esc(t('theme_stats').replace('{n}', ws.length).replace('{s}', seen).replace('{m}', masteredCount(ws))) + '</p>' +
      '<section class="tiles">' + tileBtn('themelearn', t('theme_learn'), t('theme_learn_d'), fresh ? '<span class="badge num">' + fresh + '</span>' : '<span class="badge good">✓</span>') + tileBtn('themeq', t('theme_quiz'), t('theme_quiz_d')) + '</section>' +
      '<section class="card"><span class="eyebrow">' + esc(t('theme_lessons')) + '</span><div class="list">' + themeUnits(th).map(function (i) {
        var u = U[i], l = wordsOf(i), m = masteredCount(l), lab = u.pack ? t('pack') : 'Trail ' + szlakOf(i);
        return '<button class="li linkish theme-lesson" data-tu="' + i + '" style="width:100%"><span aria-hidden="true">' + (u.pack ? esc(u.ico) : blaze(u.trail)) + '</span><span class="grow" style="text-align:left"><b>' + esc(u.pack ? cityName(u) : u.city) + '</b> <span class="small muted">· ' + esc(L(u.title)) + '</span>' +
          '<span class="row small muted num" style="flex-wrap:nowrap"><span class="badge">' + esc(lab) + '</span>' + (isOpen(i) ? '' : '<span class="badge">🔒</span>') + (S.boss[u.id] ? '<span class="badge good">✓</span>' : '') + '<span class="bar" style="flex:1"><i style="width:' + (m / l.length * 100) + '%"></i></span>' + m + '/' + l.length + '</span></span></button>';
      }).join('') + '</div></section><p class="small muted">' + esc(t('theme_note')) + '</p>';
    shell(html);
    document.getElementById('back').onclick = function () { go('themes'); };
    document.querySelectorAll('[data-tu]').forEach(function (b) { b.onclick = function () { cityBack = th.id; var i = +b.getAttribute('data-tu'); tab = 'city'; view = null; polUI = false; render(i); window.scrollTo(0, 0); }; });
    document.querySelectorAll('[data-mode]').forEach(function (b) { b.onclick = function () { curTheme = th.id; startMode(b.getAttribute('data-mode')); }; });
  }

  /* ---------- KI-Gespräch (3.1): Rollenspiel zur Szene einer Stadt, über die eigene Supabase-Funktion ps-chat ----------
     Nur mit Konto (Tageslimit pro Konto) und online. Der KI-Schlüssel liegt auf dem Server, nie in der App. */
  var CH = { ui: null, msgs: [], busy: false, err: '', used: 0, limit: 0, avail: null, talk: true };
  function chatScenario(ui) {
    if (ui && typeof ui === 'object') return { txt: ui.txt, lv: 'A2', open: ui.open };
    if (ui == null || !U[ui]) return { txt: t('chat_free_sc'), lv: szlakOf(nextUnit()) >= 2 ? 'A2' : 'A1', open: 'Cześć! Jak się masz?' };
    var u = U[ui], sc = u.scene;
    return { txt: (u.pack ? cityName(u) : u.city) + ': ' + L(u.title) + (sc ? ' – ' + L(sc.intro) : ''), lv: u.sch ? 'K' + u.sch : (u.pack || szlakOf(ui) >= 2 ? 'A2' : 'A1'), open: sc ? sc.steps[0].npc[0] : 'Hello! How are you?' };
  }
  function chatReset(ui) { CH.ui = ui; CH.err = ''; CH.msgs = [{ role: 'assistant', content: chatScenario(ui).open }]; }
  function renderChat(arg) {
    if (arg !== undefined && arg !== CH.ui) chatReset(arg); else if (!CH.msgs.length) chatReset(CH.ui);
    var logged = A && A.uid, html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('chat')) + ' <span class="badge">Beta</span></h1>';
    if (!navigator.onLine) html += '<section class="card"><p>' + esc(t('chat_offline')) + '</p></section>';
    else if (!logged) html += '<section class="card stack"><p>' + esc(t('chat_login')) + '</p><button class="btn primary" id="ch-login" style="justify-self:start">' + esc(t('sync_login')) + ' →</button></section>';
    else if (CH.avail === false) html += '<section class="card"><p>' + esc(t('chat_soon')) + '</p></section>';
    else {
      var sc = chatScenario(CH.ui), opts = '<option value="">' + esc(t('chat_free')) + '</option>' + openUnits().map(function (i) { return '<option value="' + i + '"' + (i === CH.ui ? ' selected' : '') + '>' + esc((U[i].pack ? cityName(U[i]) : U[i].city) + ' – ' + L(U[i].title)) + '</option>'; }).join('');
      html += '<section class="card stack"><label class="fld">' + esc(t('chat_sc')) + '<select id="ch-sc">' + opts + '</select></label><p class="small muted">' + esc(sc.txt) + ' · ' + esc(t('chat_lv')) + ' ' + sc.lv + '</p></section>' +
        '<section class="stack chat-log" id="ch-log" aria-live="polite">' + CH.msgs.map(function (m, i) {
          if (m.role === 'assistant') return '<div class="npc"><div class="row" style="flex-wrap:nowrap;align-items:start"><button class="icon-btn" data-say="' + esc(m.content) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button><b lang="en">' + esc(m.content) + '</b></div></div>';
          return '<div class="me"><b lang="en">' + esc(m.content) + '</b>' + (m.fix ? '<div class="small chat-fix"><span>' + esc(t('chat_better')) + ':</span> <b lang="en">' + esc(m.fix) + '</b></div>' : '') + (m.hint ? '<div class="small muted">' + esc(m.hint) + '</div>' : '') + '</div>';
        }).join('') + (CH.busy ? '<div class="npc"><span class="muted">…</span></div>' : '') + '</section>' +
        (CH.err ? '<p class="small" role="status" style="color:var(--bad)">' + esc(CH.err) + '</p>' : '') +
        '<form id="ch-f" class="stack"><textarea id="ch-in" rows="2" maxlength="400" lang="en" placeholder="' + esc(t('chat_ph')) + '" aria-label="' + esc(t('chat_ph')) + '"></textarea>' + plKeys() +
        '<div class="row"><button class="btn primary" style="flex:1"' + (CH.busy ? ' disabled' : '') + '>' + esc(t('chat_send')) + '</button>' + ((window.SpeechRecognition || window.webkitSpeechRecognition) ? '<button type="button" class="btn" id="ch-mic" aria-label="' + esc(t('inp_say')) + '">' + I.mic + '</button>' : '') + '</div></form>' +
        '<div class="row small muted" style="justify-content:space-between"><label class="row"><input type="checkbox" id="ch-talk"' + (CH.talk ? ' checked' : '') + '> ' + esc(t('chat_talk')) + '</label><span class="num">' + (CH.limit ? esc(t('chat_used').replace('{n}', CH.used).replace('{l}', CH.limit)) : '') + '</span></div>' +
        '<button class="btn ghost" id="ch-new" style="justify-self:start">↺ ' + esc(t('chat_new')) + '</button><p class="small muted">' + esc(t('chat_note')) + '</p>';
    }
    shell(html);
    document.getElementById('back').onclick = function () { if (CH.ui && typeof CH.ui === 'object') go('exam'); else if (CH.ui != null && U[CH.ui] && !U[CH.ui].pack && arg != null) go('city', CH.ui); else go('practice'); };
    var lg = document.getElementById('ch-login'); if (lg) lg.onclick = function () { go('me'); setTimeout(function () { var y = document.getElementById('sync'); if (y) y.scrollIntoView({ block: 'center' }); }, 50); };
    if (logged && navigator.onLine && CH.avail === null) {
      sbToken().then(function () { return sbFetch('/functions/v1/et-chat', { method: 'POST', auth: true, body: { ping: true } }); }).then(function (j) { CH.avail = !!(j && j.configured); CH.limit = (j && j.limit) || 0; if (tab === 'chat') renderChat(); }, function () { CH.avail = false; if (tab === 'chat') renderChat(); });
    }
    var log = document.getElementById('ch-log'); if (log) log.lastElementChild && log.lastElementChild.scrollIntoView({ block: 'nearest' });
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
    var sel = document.getElementById('ch-sc'); if (sel) sel.onchange = function () { chatReset(sel.value === '' ? null : +sel.value); renderChat(); };
    var nw = document.getElementById('ch-new'); if (nw) nw.onclick = function () { chatReset(CH.ui); renderChat(); };
    var tk = document.getElementById('ch-talk'); if (tk) tk.onchange = function () { CH.talk = tk.checked; };
    var inp = document.getElementById('ch-in');
    if (inp) {
      inp.onkeydown = function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('ch-f').requestSubmit(); } };
      document.querySelectorAll('#ch-f [data-k]').forEach(function (b) { b.onclick = function () { var s = inp.selectionStart || inp.value.length; inp.value = inp.value.slice(0, s) + b.getAttribute('data-k') + inp.value.slice(inp.selectionEnd || s); inp.focus(); inp.setSelectionRange(s + 1, s + 1); }; });
      var mic = document.getElementById('ch-mic'); if (mic) mic.onclick = function () {
        try { var Rec = window.SpeechRecognition || window.webkitSpeechRecognition, rec = new Rec(); rec.lang = TL(); rec.interimResults = false; mic.disabled = true;
          rec.onresult = function (e) { inp.value = (inp.value ? inp.value + ' ' : '') + (e.results[0][0].transcript || ''); };
          rec.onend = function () { mic.disabled = false; inp.focus(); }; rec.onerror = function () { mic.disabled = false; toast(t('no_mic')); }; rec.start();
        } catch (e) { toast(t('no_mic')); }
      };
      document.getElementById('ch-f').onsubmit = function (e) { e.preventDefault(); chatSend(inp.value); };
    }
  }
  function chatSend(text) {
    text = String(text || '').trim(); if (!text || CH.busy) return;
    var sc = chatScenario(CH.ui), me = { role: 'user', content: text.slice(0, 400) };
    CH.msgs.push(me); CH.busy = true; CH.err = ''; renderChat();
    var hist = CH.msgs.slice(-12).map(function (m) { return { role: m.role, content: m.content }; });
    sbToken().then(function () { return sbFetch('/functions/v1/et-chat', { method: 'POST', auth: true, body: { messages: hist, scenario: sc.txt, level: sc.lv, base: S.base, gender: S.gender === 'f' ? 'f' : 'm' } }); })
      .then(function (j) {
        CH.busy = false; if (j.fix) me.fix = j.fix; if (j.hint) me.hint = j.hint; CH.used = j.used || CH.used; CH.limit = j.limit || CH.limit;
        if (j.reply) { CH.msgs.push({ role: 'assistant', content: j.reply }); if (CH.talk) speak(j.reply); }
        markActive(); addXp(2); save(); if (tab === 'chat') renderChat();
      }, function (e) {
        CH.busy = false; CH.msgs.pop();
        CH.err = e && e.status === 429 ? t('chat_limit') : e && e.status === 401 ? t('chat_login') : e && e.status === 503 ? t('chat_soon') : (e && e.code === 'net') ? t('chat_offline') : t('chat_err');
        if (tab === 'chat') { renderChat(); var i2 = document.getElementById('ch-in'); if (i2) i2.value = text; }
      });
  }

  /* ---------- Konjugations-Trainer (3.0): 40 Verben, Gegenwart + Vergangenheit, nach Verbklassen ---------- */
  /* English Trail: unregelmäßige Verben – Grundform, simple past (2. Form), past participle (3. Form).
     Gruppen: aaa (cut-cut-cut), aba (come-came-come), abb (buy-bought-bought), abc (go-went-gone). S.conj.tense: past | pp | mix */
  var CLS = ['aaa', 'aba', 'abb', 'abc'], conjOpen = null;
  function verbsFor(cls) { return (D.verbs || []).filter(function (v) { return !cls || cls === 'all' || v.cls === cls; }); }
  function conjQs(n) {
    var cf = S.conj || { tense: 'mix', cls: 'all' }, vs = verbsFor(cf.cls), qs = [];
    if (!vs.length) vs = D.verbs;
    for (var i = 0; i < n; i++) {
      var v = vs[Math.floor(R() * vs.length)], pp = cf.tense === 'pp' || (cf.tense === 'mix' && R() < 0.5);
      var a = pp ? v.pp : v.past, alts = a.split(' / ');
      var pool = [v.inf, v.past, v.pp, v.inf.replace(/e$/, '') + 'ed', v.inf + 's', v.inf.replace(/e$/, '') + 'ing'].concat(alts).filter(function (f, k, arr) { return f && arr.indexOf(f) === k && alts.indexOf(f) < 0 && f !== a; });
      var q = { type: diff().clozeType || S.diff === 'medium' ? 'type' : 'mc', id: null, ask: t(pp ? 'conj_q_pp' : 'conj_q_past'), big: v.inf, bigPl: true, sub: v.de, a: alts[0], explain: v.inf + ' – ' + v.past + ' – ' + v.pp + ' · ' + t('clsn_' + v.cls), sayAfter: v.inf + ', ' + v.past.replace(' / ', ', ') + ', ' + v.pp, plOpts: true };
      if (q.type === 'mc') q.opts = C.shuffle([alts[0]].concat(C.shuffle(pool, R).slice(0, diff().opts - 1)), R);
      else q.alt = alts.slice(1);
      qs.push(q);
    }
    return qs;
  }
  function conjTable(v) {
    var cell = function (f) { return '<td lang="en"><button class="linkish" data-say="' + esc(f.replace(' / ', ', ')) + '">' + esc(f) + '</button></td>'; };
    return '<div class="conj-tab"><table><tr><th scope="col">' + esc(t('conj_inf')) + '</th><th scope="col">' + esc(t('conj_pres')) + '</th><th scope="col">' + esc(t('conj_past')) + '</th></tr><tr>' + cell(v.inf) + cell(v.past) + cell(v.pp) + '</tr></table></div><p class="small muted">' + esc(t('cls_' + v.cls)) + '</p>';
  }
  function renderConj() {
    var cf = S.conj = S.conj || { tense: 'mix', cls: 'all' };
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('conj')) + '</h1><p class="muted">' + esc(t('conj_intro')) + '</p>' +
      '<section class="card stack"><b>' + esc(t('conj_tense')) + '</b><div class="seg" id="cj-t">' + segBtn('past', t('conj_pres'), cf.tense === 'past') + segBtn('pp', t('conj_past'), cf.tense === 'pp') + segBtn('mix', t('conj_mix'), cf.tense === 'mix') + '</div>' +
      '<b>' + esc(t('conj_cls')) + '</b><div class="seg rv-secs" id="cj-c">' + segBtn('all', t('conj_all'), cf.cls === 'all') + CLS.map(function (c) { return segBtn(c, t('clsn_' + c), cf.cls === c); }).join('') + '</div>' +
      '<p class="small muted">' + esc(cf.cls === 'all' ? t('conj_all_d') : t('cls_' + cf.cls)) + '</p><button class="btn primary" id="cj-go">' + esc(t('start')) + ' · ' + verbsFor(cf.cls).length + ' ' + esc(t('conj_verbs')) + '</button></section>' +
      '<section class="card"><span class="eyebrow">' + esc(t('conj_list')) + '</span><div class="list">' + verbsFor(cf.cls).map(function (v) {
        var open = conjOpen === v.inf;
        return '<div class="li" style="display:block"><button class="row linkish" data-cv="' + esc(v.inf) + '" aria-expanded="' + open + '" style="width:100%;justify-content:space-between"><span><b lang="en">' + esc(v.inf) + '</b> <span class="small muted">' + esc(L([v.de, v.en])) + '</span></span><span aria-hidden="true">' + (open ? '▾' : '▸') + '</span></button>' + (open ? conjTable(v) : '') + '</div>';
      }).join('') + '</div></section>';
    shell(html);
    document.getElementById('back').onclick = function () { go('practice'); };
    bindSeg('cj-t', function (v) { cf.tense = v; save(); renderConj(); });
    bindSeg('cj-c', function (v) { cf.cls = v; save(); renderConj(); });
    document.getElementById('cj-go').onclick = function () { startMode('conjgo'); };
    document.querySelectorAll('[data-cv]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-cv'); conjOpen = conjOpen === k ? null : k; renderConj(); }; });
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
  }

  /* ================================================================
     Spiel-Engine
     ================================================================ */
  var G = null;
  function runGame(cfg) {
    if (!cfg.players) cfg.mode = cfg.mode || lastMode;
    G = { cfg: cfg, i: 0, qs: cfg.qs, combo: 0, best: 0, right: 0, wrong: 0, xp: 0, results: [], lives: cfg.lives || 0, learned: [], start: Date.now(), ended: false, timerId: null, players: cfg.players || null, pi: 0, pscore: cfg.players ? cfg.players.map(function () { return 0; }) : null };
    view = 'game';
    if (cfg.timer) { G.left = cfg.timer; var g0 = G; G.timerId = setInterval(function () { if (G !== g0) { clearInterval(g0.timerId); return; } G.left--; var el = document.getElementById('timer'); if (el) el.textContent = G.left; if (G.left <= 0) { clearInterval(G.timerId); endGame(); } }, 1000); }
    drawQ();
  }
  function gameTop() {
    var g = G, pct = g.cfg.timer ? (g.left / g.cfg.timer * 100) : (g.i / g.qs.length * 100), lives = '';
    if (g.cfg.lives) { lives = '<span class="lives" aria-label="' + g.lives + '">'; for (var i = 0; i < g.cfg.lives; i++) lives += '<i class="' + (i < g.lives ? '' : 'off') + '"></i>'; lives += '</span>'; }
    return '<div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      (g.cfg.timer ? '<span class="timer num" id="timer">' + g.left + '</span>' : '') + (g.cfg.survival ? '<span class="timer num" id="qtimer">' + g.cfg.survival + '</span>' : '') + lives + (g.combo > 1 ? '<span class="combo num">×' + g.combo + '</span>' : '') + '</div>' +
      (g.players ? '<div class="banner"><strong>' + esc(g.players[g.pi]) + ' ' + esc(t('turn')) + '</strong></div>' : '');
  }
  function drawQ() {
    if (!G || G.ended) return;
    if (G.i >= G.qs.length) return endGame();
    var q = G.qs[G.i], html = '<section class="game">' + gameTop() + '<div class="prompt"><span class="eyebrow">' + esc(G.cfg.title) + (q.ask ? ' · ' + esc(q.ask) : '') + '</span>';
    var em = emOf(q); if (em) html += '<div class="q-em" aria-hidden="true">' + em + '</div>';
    if (q.big && !q.hideText) html += '<div class="' + (q.small ? 'sentence' : 'big') + '" lang="' + (q.bigPl ? 'en' : (q.type === 'type' || q.small || q.type === 'pin' || q.ask === t('choose_pl') ? S.base : 'en')) + '">' + esc(q.big) + '</div>';
    if (q.clues) html += '<ol class="clues">' + q.clues.slice(0, q.shown).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' + (q.shown < q.clues.length ? '<button class="btn ghost" id="more" style="justify-self:start;padding-left:0">+ ' + esc(t('more_clue')) + '</button>' : '');
    if (q.sentence) html += '<div class="sentence" lang="en">' + esc(q.sentence).replace('___', '<span class="blank" aria-label="gap">&nbsp;</span>') + '</div>';
    if (q.sub) html += '<div class="muted">' + esc(q.sub) + '</div>';
    if (q.say) html += '<div class="row"><button class="icon-btn" id="say" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button><button class="icon-btn" id="say-slow" aria-label="' + esc(t('slow')) + '">' + I.snail + '</button></div>';
    html += '</div><div id="jk" class="row"></div><div id="area"></div><div id="fb"></div></section>';
    shell(html, false);
    document.getElementById('quit').onclick = function () { stopTimer(); var cu = G.cfg.unit; G = null; if (cu != null) go('city', cu); else go(tab === 'city' ? 'home' : tab); };
    if (q.say) { document.getElementById('say').onclick = function () { speak(q.say); }; document.getElementById('say-slow').onclick = function () { speak(q.say, true); }; speak(q.say); }
    var area = document.getElementById('area');
    if (q.type !== 'card' && !G.cfg.timer && !G.players && !G.cfg.boss && !G.cfg.placement && !G.cfg.survival && !G.cfg.duel) {
      var fbEl = document.getElementById('fb'); fbEl.insertAdjacentHTML('afterend', '<button class="btn ghost" id="qskip" style="justify-self:start">' + esc(t('skip_q')) + ' →</button>');
      document.getElementById('qskip').onclick = function () { G.i++; drawQ(); };
    }
    var mb = document.getElementById('more'); if (mb) mb.onclick = function () { q.shown++; drawQ(); };
    renderJokers(q); startQTimer(q);
    if (q.type === 'order') return drawOrder(q, area);
    if (q.type === 'pin') return drawPin(q, area);
    if (q.type === 'card') return drawCard(q, area);
    if (q.type === 'mc') return drawMC(q, area);
    if (q.type === 'type') return drawInput(q, area);
    if (q.type === 'build') return drawBuild(q, area);
    if (q.type === 'speak') return drawSpeak(q, area);
  }
  function stopTimer() { if (G && G.timerId) clearInterval(G.timerId); stopQTimer(); }
  function stopQTimer() { if (G && G.qtId) { clearInterval(G.qtId); G.qtId = null; } }
  function startQTimer(q) {
    if (!G.cfg.survival || q.type !== 'mc') return;
    stopQTimer(); G.qLeft = G.cfg.survival;
    G.qtId = setInterval(function () {
      G.qLeft--; var el = document.getElementById('qtimer'); if (el) el.textContent = Math.max(G.qLeft, 0);
      if (G.qLeft <= 0) { stopQTimer(); var area = document.getElementById('area'); if (!area) return;
        area.querySelectorAll('.opt').forEach(function (bb) { bb.disabled = true; if (C.norm(q.opts[+bb.getAttribute('data-i')]) === C.norm(q.a)) bb.classList.add('right'); });
        answer(q, false, q.a, '\u23F1'); }
    }, 1000);
  }
  function renderJokers(q) {
    var jk = document.getElementById('jk'); if (!jk || G.players || G.cfg.placement || G.cfg.duel) return;
    var J = S.jokers, h = '';
    if (q.type === 'mc' && q.opts && q.opts.length >= 3 && J.five0 > 0) h += '<button class="chip" id="j5050" title="' + esc(t('jokers_d')) + '">' + esc(t('j_5050')) + ' <span class="num muted">' + J.five0 + '</span></button>';
    if (q.type === 'type' && (S.input || 'write') === 'write' && J.hint > 0) h += '<button class="chip" id="jhint" title="' + esc(t('jokers_d')) + '">' + esc(t('j_hint')) + ' <span class="num muted">' + J.hint + '</span></button>';
    if ((G.cfg.survival || G.cfg.timer) && J.freeze > 0) h += '<button class="chip" id="jfreeze" title="' + esc(t('jokers_d')) + '">' + esc(t('j_freeze')) + ' <span class="num muted">' + J.freeze + '</span></button>';
    jk.innerHTML = h;
    var b1 = document.getElementById('j5050'); if (b1) b1.onclick = function () {
      var wrong = [].slice.call(document.querySelectorAll('#area .opt:not([disabled])')).filter(function (b) { return C.norm(q.opts[+b.getAttribute('data-i')]) !== C.norm(q.a); });
      C.shuffle(wrong, R).slice(0, Math.max(1, Math.floor(wrong.length * 2 / 3))).forEach(function (b) { b.disabled = true; b.style.opacity = '.35'; });
      J.five0--; q.jf = 0.6; b1.remove(); save();
    };
    var b2 = document.getElementById('jhint'); if (b2) b2.onclick = function () {
      var inp = document.getElementById('ans'); var n = Math.max(1, Math.ceil(q.a.length / 4));
      if (inp) { inp.value = q.a.slice(0, n); inp.focus(); }
      J.hint--; q.jf = 0.5; b2.remove(); save();
    };
    var b3 = document.getElementById('jfreeze'); if (b3) b3.onclick = function () {
      if (G.cfg.survival) G.qLeft += 10; else G.left += 10;
      J.freeze--; b3.remove(); save();
    };
  }

  function drawCard(q, area) {
    area.innerHTML = '<button class="btn primary block" id="nx">' + esc(t('next')) + '</button>';
    document.getElementById('nx').onclick = function () { if (!S.cards[q.id]) { S.cards[q.id] = { box: 0, due: today(), seen: 0, wrong: 0 }; wlog('n'); } G.i++; drawQ(); };
  }
  function drawMC(q, area) {
    area.innerHTML = '<div class="opts">' + q.opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '" lang="' + (looksPl(o, q) ? 'en' : S.base) + '">' + esc(o) + '</button>'; }).join('') + '</div>';
    area.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var pick = q.opts[+b.getAttribute('data-i')], ok = C.norm(pick) === C.norm(q.a);
        area.querySelectorAll('.opt').forEach(function (bb) { bb.disabled = true; if (C.norm(q.opts[+bb.getAttribute('data-i')]) === C.norm(q.a)) bb.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        answer(q, ok, ok ? '' : q.a, '', q.clues ? [1, 0.7, 0.4][q.shown - 1] : 1);
      };
    });
  }
  function looksPl(o, q) { if (q.plOpts || q.clues) return true; if (q.fixed) return false; return q.ask === t('choose_pl') || q.ask === t('fill') || q.ask === t('hear_word') || (q.ask || '').indexOf(t('case_q')) === 0; }
  function plKeys() { return '<div class="pl-keys" aria-label="Polish letters">' + ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'].map(function (c) { return '<button type="button" data-k="' + c + '">' + c + '</button>'; }).join('') + '</div>'; }
  /* Antwortart (Einstellung S.input): Schreib-Fragen auch per Sprechen oder Antippen beantworten.
     Antippen-Optionen sind fest aus der Antwort abgeleitet (eigener Zufall) – im Duell-Code auf beiden Handys gleich. */
  function drawInput(q, area) {
    var m = S.input || 'write';
    if (m === 'tap') drawTapType(q, area); else if (m === 'speak') drawSayType(q, area); else drawType(q, area);
    var other = ['write', 'speak', 'tap'].filter(function (k) { return k !== m; });
    area.insertAdjacentHTML('beforeend', '<div class="row small muted inp-switch">' + esc(t('inp_rather')) + ': ' + other.map(function (k) { return '<button type="button" class="btn ghost" data-inp="' + k + '">' + esc(t('inp_' + k)) + '</button>'; }).join('') + '</div>');
    area.querySelectorAll('[data-inp]').forEach(function (b) { b.onclick = function () { S.input = b.getAttribute('data-inp'); save(); area.innerHTML = ''; drawInput(q, area); }; });
  }
  function tapOpts(q) {
    var r = C.rng('tap|' + q.a), a = C.norm(q.a), seen = {}, out = [], src;
    seen[a] = 1;
    if (q.alt && q.alt.length) src = q.alt;
    else { src = []; U.forEach(function (u, i) { wordsOf(i).forEach(function (x) { src.push(x.w[0]); }); if (q.a.indexOf(' ') >= 0) u.sentences.forEach(function (x) { src.push(x[0]); }); }); }
    var words = q.a.split(' ').length;
    C.shuffle(src, r).sort(function (x, y) { return Math.abs(x.split(' ').length - words) - Math.abs(y.split(' ').length - words); }).forEach(function (o) {
      var k = C.norm(o); if (out.length < 3 && !seen[k]) { seen[k] = 1; out.push(o); }
    });
    return C.shuffle([q.a].concat(out), r);
  }
  function drawTapType(q, area) {
    var opts = tapOpts(q);
    area.innerHTML = '<div class="opts">' + opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '" lang="en">' + esc(o) + '</button>'; }).join('') + '</div>';
    area.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var ok = C.norm(opts[+b.getAttribute('data-i')]) === C.norm(q.a);
        area.querySelectorAll('button').forEach(function (bb) { bb.disabled = true; if (bb.hasAttribute('data-i') && C.norm(opts[+bb.getAttribute('data-i')]) === C.norm(q.a)) bb.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        if (ok) speak(q.a);
        answer(q, ok, ok ? '' : q.a, '', 0.7);
      };
    });
  }
  function drawSayType(q, area) {
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    function lock() { area.querySelectorAll('button').forEach(function (b) { b.disabled = true; }); }
    function selfRate() {
      area.innerHTML = '<p class="small muted">' + esc(t('inp_selfq')) + '</p><button class="btn primary block" id="srev">' + esc(t('inp_reveal')) + '</button>';
      document.getElementById('srev').onclick = function () {
        area.innerHTML = '<div class="big" lang="en">' + esc(q.a) + '</div><div class="row"><button class="btn primary" id="sok" style="flex:1">' + esc(t('inp_ok')) + '</button><button class="btn" id="sno" style="flex:1">' + esc(t('inp_no')) + '</button></div>';
        speak(q.a);
        document.getElementById('sok').onclick = function () { lock(); answer(q, true, '', '', 0.8); };
        document.getElementById('sno').onclick = function () { lock(); answer(q, false, q.a); };
      };
    }
    if (!Rec) return selfRate();
    area.innerHTML = '<button class="btn primary block" id="mic">' + I.mic + esc(t('inp_say')) + '</button><p id="heard" class="small muted"></p><button type="button" class="btn ghost" id="sself" style="justify-self:start">' + esc(t('inp_reveal')) + '</button>';
    document.getElementById('sself').onclick = selfRate;
    document.getElementById('mic').onclick = function () {
      try {
        var rec = new Rec(); rec.lang = TL(); rec.interimResults = false; rec.maxAlternatives = 3;
        rec.onresult = function (e) {
          var alts = []; for (var i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
          var ok = alts.some(function (a) { var r = chk(a, q.a, {}); return r.ok || C.lev(C.norm(a, true), C.norm(q.a, true)) <= Math.max(1, Math.round(q.a.length * 0.15)); });
          document.getElementById('heard').innerHTML = wdiffHtml(q.a, alts, ok);
          lock(); if (ok) speak(q.a);
          answer(q, ok, ok ? '' : q.a);
        };
        rec.onerror = function () { selfRate(); };
        rec.start();
      } catch (e) { selfRate(); }
    };
  }
  /* Ausspracherückmeldung je Wort (3.0): erkannte Wörter grün, fehlende rot unterstrichen; beste der Erkennungs-Varianten */
  function wdiffHtml(target, alts, ok) {
    var best = null;
    (alts.length ? alts : ['']).forEach(function (a) { var d = C.wordDiff(target, a), n = d.filter(function (x) { return x.ok; }).length; if (!best || n > best.n) best = { d: d, n: n, a: a }; });
    var miss = best.d.filter(function (x) { return !x.ok; }).length;
    return '<span class="small muted">' + esc(t('you_said')) + ': „' + esc(best.a) + '“</span><span class="wdiff" lang="en">' + best.d.map(function (x) { return '<span class="wd ' + (x.ok ? 'ok' : 'no') + '">' + esc(x.w) + (x.ok ? '' : '<span class="sr-only"> (' + esc(t('wd_miss')) + ')</span>') + '</span>'; }).join(' ') + '</span>' +
      (!ok && miss ? '<span class="small">' + esc(t('wd_hint').replace('{n}', miss)) + '</span>' : '');
  }
  function drawType(q, area) {
    area.innerHTML = '<form id="tf" class="stack"><input class="answer-in" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" lang="en" aria-label="' + esc(t('type_pl')) + '">' + plKeys() +
      '<div class="row"><button class="btn primary" style="flex:1">' + esc(t('check')) + '</button><button type="button" class="btn ghost" id="skip">' + esc(t('skip')) + '</button></div></form>';
    var inp = document.getElementById('ans'); try { inp.focus(); } catch (e) {}
    area.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { var s = inp.selectionStart || inp.value.length; inp.value = inp.value.slice(0, s) + b.getAttribute('data-k') + inp.value.slice(inp.selectionEnd || s); inp.focus(); inp.setSelectionRange(s + 1, s + 1); }; });
    document.getElementById('skip').onclick = function () { lockForm(); answer(q, false, q.a); };
    document.getElementById('tf').onsubmit = function (e) {
      e.preventDefault(); if (!inp.value.trim()) return;
      var r = chk(inp.value, q.a, { hardcore: G && G.cfg.duel ? C.diffCfg(G.cfg.duel.diff).strict : (S.hardcore || diff().strict) }); lockForm();
      var note = r.kind === 'diacritics' ? t('almost_dia') + ': ' + q.a : r.kind === 'typo' ? t('almost_typo') + ': ' + q.a : '';
      answer(q, r.ok, r.ok ? '' : q.a, note, r.kind === 'typo' ? 0.5 : 1);
    };
    function lockForm() { inp.disabled = true; area.querySelectorAll('button').forEach(function (b) { b.disabled = true; }); }
  }
  function drawBuild(q, area) {
    var picked = [];
    function paint() {
      area.innerHTML = '<div class="tiles-build" id="bt" aria-live="polite">' + picked.map(function (ti, k) { return '<button class="wtile" data-out="' + k + '" lang="en">' + esc(q.tiles[ti]) + '</button>'; }).join('') + '</div>' +
        '<div class="tiles-pool">' + q.tiles.map(function (w, i) { return '<button class="wtile' + (picked.indexOf(i) >= 0 ? ' used' : '') + '" data-in="' + i + '" lang="en">' + esc(w) + '</button>'; }).join('') + '</div>' +
        '<button class="btn primary block" id="chk"' + (picked.length ? '' : ' disabled') + '>' + esc(t('check')) + '</button>';
      area.querySelectorAll('[data-in]').forEach(function (b) { b.onclick = function () { picked.push(+b.getAttribute('data-in')); paint(); }; });
      area.querySelectorAll('[data-out]').forEach(function (b) { b.onclick = function () { picked.splice(+b.getAttribute('data-out'), 1); paint(); }; });
      document.getElementById('chk').onclick = function () {
        var built = picked.map(function (i) { return q.tiles[i]; }).join(' '), ok = C.sameSentence(built, q.a);
        area.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
        answer(q, ok, ok ? '' : q.a);
        if (ok) speak(q.a);
      };
    }
    paint();
  }
  function drawOrder(q, area) {
    var picked = [];
    function paint() {
      area.innerHTML = '<div class="opts">' + q.items.map(function (e, i) { var k = picked.indexOf(i); return '<button class="opt" data-ord="' + i + '"' + (k >= 0 ? ' disabled' : '') + '>' + (k >= 0 ? '<span class="num" style="color:var(--red)">' + (k + 1) + '. </span>' : '') + esc(L([e[1], e[2]])) + '</button>'; }).join('') + '</div>';
      area.querySelectorAll('[data-ord]').forEach(function (b) { b.onclick = function () {
        picked.push(+b.getAttribute('data-ord'));
        if (picked.length < q.items.length) return paint();
        paint(); area.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
        var ok = C.orderOk(picked.map(function (i) { return q.items[i][0]; }));
        var sorted = q.items.slice().sort(function (a, b) { return a[0] - b[0]; });
        q.reveal = sorted.map(function (e) { return e[0] + ': ' + L([e[1], e[2]]); }).join(' · ');
        answer(q, ok, '');
      }; });
    }
    paint();
  }
  function drawPin(q, area) {
    area.innerHTML = '<div class="card" style="padding:8px"><svg class="map" id="pinmap" viewBox="-10 0 680 650" role="img" aria-label="' + esc(t('tap_map')) + '" style="cursor:crosshair">' + landSvg() + '<g id="pinlayer"></g></svg></div>';
    var svg = document.getElementById('pinmap'), done = false;
    svg.addEventListener('click', function (ev) {
      if (done) return; done = true;
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; var m = svg.getScreenCTM(); var p = m ? pt.matrixTransform(m.inverse()) : { x: 330, y: 320 };
      var ll = C.unproj(p.x, p.y), tg = q.target, d = C.distKm(ll[1], ll[0], tg.lat, tg.lon), tp = proj(tg.lon, tg.lat);
      document.getElementById('pinlayer').innerHTML = '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + tp[0] + '" y2="' + tp[1] + '" stroke="var(--route)" stroke-width="3" stroke-dasharray="4 6"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="10" fill="var(--amber)"/><circle cx="' + tp[0] + '" cy="' + tp[1] + '" r="12" fill="var(--red)" stroke="var(--surface)" stroke-width="3"/>';
      var lim = S.diff === 'hard' ? 50 : (S.diff === 'medium' ? 70 : 100), ok = d <= lim;
      answer(q, ok, '', Math.round(d) + ' ' + t('km_off'), ok ? Math.max(0.3, 1 - d / (lim * 1.5)) : 1);
    });
  }
  function drawSpeak(q, area) {
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    function selfRate(msg) {
      area.innerHTML = (msg ? '<p class="small muted">' + esc(msg) + '</p>' : '') + '<p>' + esc(t('speak_self')) + '</p><div class="row"><button class="btn primary" id="sg" style="flex:1">' + esc(t('speak_good')) + '</button><button class="btn" id="sr" style="flex:1">' + esc(t('speak_retry')) + '</button></div>';
      document.getElementById('sg').onclick = function () { answer(q, true, ''); };
      document.getElementById('sr').onclick = function () { speak(q.a, true); };
    }
    speak(q.a);
    area.insertAdjacentHTML('afterend', recHtml()); bindRec(q.a);
    if (!Rec) return selfRate(t('no_mic'));
    area.innerHTML = '<button class="btn primary block" id="mic">' + I.mic + esc(t('speak_tap')) + '</button><p id="heard" class="small muted"></p>';
    document.getElementById('mic').onclick = function () {
      try {
        var rec = new Rec(); rec.lang = TL(); rec.interimResults = false; rec.maxAlternatives = 3;
        rec.onresult = function (e) {
          var alts = []; for (var i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
          var best = alts[0] || '', ok = alts.some(function (a) { var r = chk(a, q.a, {}); return r.ok || C.lev(C.norm(a, true), C.norm(q.a, true)) <= Math.max(2, Math.round(q.a.length * 0.15)); });
          document.getElementById('heard').innerHTML = wdiffHtml(q.a, alts, ok);
          answer(q, ok, ok ? '' : q.a);
        };
        rec.onerror = function () { selfRate(t('no_mic')); };
        rec.start();
      } catch (e) { selfRate(t('no_mic')); }
    };
  }

  function answer(q, ok, solution, note, factor) {
    var g = G; if (!g) return; stopQTimer();
    factor = (factor == null ? 1 : factor) * (q.jf || 1);
    if (ok) { g.combo++; g.best = Math.max(g.best, g.combo); g.right++; } else { g.combo = 0; g.wrong++; if (g.cfg.lives) g.lives--; }
    var xp = Math.round(C.xpFor(ok, g.combo, S.hardcore && !diff().strict && q.type === 'type') * factor * diff().xp);
    g.xp += xp; g.results.push(ok);
    if (g.players) { if (ok) g.pscore[g.pi] += 1; }
    if (q.id && !g.players) grade(q.id, ok);
    if (ok && q.id && g.learned.length < 3) { var x = byId(q.id); if (x) g.learned.push(x.w); }
    if (!ok && q.sayAfter) speak(q.sayAfter);
    if (ok && q.sayAfter && q.type === 'mc') speak(q.sayAfter);
    if (g.cfg.timer) { g.i++; setTimeout(function () { if (G === g) drawQ(); }, ok ? 250 : 900); return; } /* PATCH007 */
    var fb = document.getElementById('fb'), html = '<div class="feedback ' + (ok ? 'ok' : 'no') + ' pop" role="status"><span class="h">' + esc(ok ? t('right') : t('wrong')) + (ok && xp ? ' <span class="num small">+' + xp + ' XP</span>' : '') + '</span>';
    if (note) html += '<span>' + esc(note) + '</span>';
    if (solution) html += '<span>' + esc(t('solution')) + ': <b lang="en">' + esc(solution) + '</b></span>';
    if (q.reveal) html += '<span lang="en">' + esc(q.reveal) + '</span>';
    if (q.explain) html += '<span class="small">' + esc(q.explain) + '</span>';
    html += '</div><button class="btn primary block" id="nx" style="margin-top:12px">' + esc(t('next')) + '</button>' + (polUI || g.players ? '' : reportHtml('rep-q'));
    fb.innerHTML = html;
    bindReport('rep-q', g.cfg.title + ' | ' + [q.ask, q.big, q.sentence, q.a].filter(function (v) { return v != null && v !== ''; }).map(String).join(' | ') + (solution ? ' | ' + solution : '') + ' | ' + (ok ? 'ok' : 'falsch'));
    var nx = document.getElementById('nx'); try { nx.focus({ preventScroll: true }); } catch (e) {}
    nx.onclick = function () {
      if (g.cfg.lives && g.lives <= 0) return endGame();
      if (g.cfg.placement && g.results.length >= 4 && g.results.slice(-4).every(function (r) { return !r; })) return endGame();
      if (g.players) g.pi = g.cfg.block ? Math.floor((g.i + 1) / g.cfg.block) % g.players.length : (g.pi + 1) % g.players.length;
      g.i++; drawQ();
    };
  }

  function endGame() {
    var g = G; if (!g || g.ended) return; g.ended = true; stopTimer();
    var total = g.right + g.wrong, pct = total ? Math.round(g.right / total * 100) : 0, extras = '', shareTxt = '', party = false;
    if (!g.players) { addXp(g.xp); if (total >= 3 || g.cfg.timer) markActive(); }
    if (g.cfg.daily) { S.daily[g.cfg.daily] = { score: g.right, results: g.results }; }
    if (g.cfg.homework) { var hp = Math.round(g.right / g.qs.length * 100); S.hwDone = S.hwDone || {}; if (hp >= (S.hwDone[g.cfg.homework] || 0)) S.hwDone[g.cfg.homework] = hp; extras += '<div class="banner pop"><strong>📮 ' + esc(t('hw')) + ' ' + esc(g.cfg.homework) + ': ' + hp + ' %</strong><button class="btn" id="hw-res" style="margin-top:8px">' + esc(t('hw_res')) + '</button></div>'; }
    if (g.cfg.schoolExam) { var xp = Math.round(g.right / g.qs.length * 100); S.schoolBest = S.schoolBest || {}; if (xp > (S.schoolBest[g.cfg.schoolExam] || 0)) S.schoolBest[g.cfg.schoolExam] = xp; extras += '<div class="banner pop"><strong>' + esc(t('sch_exam')) + ': ' + xp + ' %</strong> · ' + esc(C.schoolMark(xp)) + '</div>'; }
    if (g.cfg.survival) { S.best = S.best || {}; if (g.right > (S.best.survival || 0)) { S.best.survival = g.right; extras += '<div class="banner pop"><strong>' + esc(t('best')) + ': ' + g.right + '</strong></div>'; } }
    if (g.cfg.boss) {
      var u = U[g.cfg.unit], passed = g.lives > 0 && g.i >= g.qs.length - 1 && pct >= (g.cfg.pass || 60);
      if (passed) {
        var first = !S.boss[u.id];
        S.boss[u.id] = Math.max(S.boss[u.id] || 0, pct);
        if (!isPack(g.cfg.unit) && g.cfg.unit < lastRoute() && (g.cfg.unit === S.unlocked || (S.free && g.cfg.unit > S.unlocked))) { S.unlocked = g.cfg.unit + 1; extras += '<div class="banner pop"><strong>' + esc(t('unlocked')) + ': ' + esc(U[S.unlocked].city) + '</strong></div>'; }
        if (first) extras += '<div class="card stack pop"><span class="eyebrow">' + esc(t('postcard_new')) + '</span><b>' + esc(u.city) + '</b><p class="small">' + esc(L(u.fact)) + '</p></div>' + letterNewBox(u.id);
        shareTxt = t('share_boss').replace('{c}', u.city).replace('{p}', pct) + ' ' + SITE; party = true;
        extras += maybeKrasnal(true);
      } else extras += '<p class="muted">' + esc(t('failed')) + '</p>';
    } else if (!g.players && !polUI && total >= 5) extras += maybeKrasnal(false);
    if (g.cfg.unit != null && !g.players && lastMode && lastMode.ui === g.cfg.unit && total >= 1) { var did = U[g.cfg.unit].id; S.done = S.done || {}; S.done[did] = S.done[did] || {}; S.done[did][lastMode.m] = 1; }
    save();
    if (g.cfg.placement) {
      var per = routeIdx().map(function () { return []; });
      g.qs.forEach(function (q, i) { if (i < g.results.length) per[q.city].push(g.results[i]); });
      var st = C.placementStart(per);
      if (st >= per.length) { S.free = true; S.unlocked = lastRoute(); extras += '<div class="banner pop"><strong>' + esc(t('placement_all')) + '</strong></div>'; }
      else { for (var pi2 = 0; pi2 < st; pi2++) if (!S.boss[U[pi2].id]) S.skipped[U[pi2].id] = true; S.unlocked = Math.max(S.unlocked, st); extras += '<div class="banner pop"><strong>' + esc(t('placement_res')) + ': ' + esc(U[st].city) + '</strong><span>' + esc(L(U[st].title)) + '</span></div>'; }
      save();
    }
    if (g.cfg.polTest) {
      var newLv = C.polLevel(g.qs.slice(0, g.results.length).map(function (q, i) { return { lv: q.lvq, ok: g.results[i] }; })), up = S.plv == null || newLv > S.plv;
      S.plv = newLv; save();
      extras += '<div class="banner pop" lang="en"><strong>' + esc(up && newLv > 0 ? t('pol_res_up') : t('pol_res')) + ': ' + esc(t('pol_lv' + newLv)) + '</strong></div>';
    }
    if (g.cfg.letterQuiz && total) {
      S.letterQuiz = Math.max(S.letterQuiz || 0, pct); save();
      if (pct >= 80) { extras += '<div class="banner pop"><strong>' + esc(t('lq_pass')) + '</strong></div>'; shareTxt = t('share_lq').replace('{p}', pct) + ' ' + SITE; party = true; }
    }
    if (g.cfg.daily) shareTxt = C.shareText(g.cfg.daily, g.results);
    if (!g.players && total >= 5 && pct === 100) party = true;
    if (g.cfg.polKey && total) { S.plBest[g.cfg.polKey] = Math.max(S.plBest[g.cfg.polKey] || 0, pct); save(); }
    var title = g.cfg.boss ? (g.lives > 0 && pct >= (g.cfg.pass || 60) ? t('passed') : t('score')) : t('done');
    var learned = g.learned.length ? '<div class="card stack" style="text-align:left;width:100%"><span class="eyebrow">' + esc(t('learned_today')) + '</span>' + g.learned.map(function (w) { return '<div><b lang="en">' + esc(w[0]) + '</b> <span class="muted">· ' + esc(meaning(w)) + '</span></div>'; }).join('') + '</div>' : '';
    var duelRes = '';
    if (g.players) {
      var max = Math.max.apply(null, g.pscore), win = g.players.filter(function (p, i) { return g.pscore[i] === max; });
      duelRes = '<div class="card stack" style="width:100%;text-align:left">' + g.players.map(function (p, i) { return '<div class="row" style="justify-content:space-between"><b>' + esc(p) + '</b><span class="num">' + g.pscore[i] + '</span></div>'; }).join('') + '</div><h2>' + esc(win.length > 1 ? t('tie') : win[0] + ' ' + t('winner')) + '</h2>';
    }
    if (g.cfg.duel) { g.ms = Date.now() - g.start; extras = duelResultBox(g) + extras; }
    var outlook = (!g.players && !g.cfg.duel && !polUI && g.cfg.back !== 'school') ? outlookBox(g) : '';
    var html = '<section class="result pop"><span class="eyebrow">' + esc(g.cfg.title) + '</span><h1>' + esc(title) + '</h1>' +
      (g.players ? duelRes : '<div class="score num">' + g.right + '/' + total + '</div>') +
      '<div class="stats3"><div class="stat"><b class="num">+' + g.xp + '</b><span class="small muted">' + t('xp') + '</span></div><div class="stat"><b class="num">' + pct + '%</b><span class="small muted">' + esc(t('right')) + '</span></div><div class="stat"><b class="num">×' + g.best + '</b><span class="small muted">' + esc(t('combo')) + '</span></div></div>' +
      extras + learned + outlook +
      (shareTxt && !polUI ? '<button class="btn" id="share">' + esc(t(navigator.share ? 'd2_share' : 'share')) + '</button>' : '') +
      '<div class="row" style="width:100%"><button class="btn" id="again" style="flex:1">' + esc(t('again')) + '</button><button class="btn' + (outlook.indexOf('next-step') >= 0 ? '' : ' primary') + '" id="home" style="flex:1">' + esc(t(g.cfg.back && g.cfg.unit == null ? 'back' : 'home')) + '</button></div></section>';
    shell(html);
    var cfg = g.cfg;
    document.getElementById('home').onclick = function () { G = null; if (cfg.back === 'themes' && cfg.unit == null) return go('themes', curTheme); go(cfg.unit != null ? 'city' : (cfg.back || 'home'), cfg.unit); };
    document.getElementById('again').onclick = function () { G = null; if (cfg.duel) { tab = 'duel'; return renderDuelSetup(); } if (cfg.players) return startDuel(cfg.players); if (cfg.rerun) return cfg.rerun(); var c2 = Object.assign({}, cfg); restart(c2); };
    var sh = document.getElementById('share'); if (sh) sh.onclick = function () { shareOut(shareTxt); };
    var hr = document.getElementById('hw-res'); if (hr) hr.onclick = function () { shareOut(t('hw_res_t').replace('{c}', cfg.homework).replace('{p}', S.hwDone[cfg.homework])); };
    if (party) confetti();
    var nxb = document.getElementById('next-step'); if (nxb) nxb.onclick = function () { G = null; var nui = +nxb.getAttribute('data-ui'); if (isOpen(nui)) startMode(nxb.getAttribute('data-step'), nui); else go('city', nui); };
    var lr = document.getElementById('letter-res'); if (lr) lr.onclick = function () { G = null; go('letter', lr.getAttribute('data-story')); };
    if (cfg.duel) bindDuelResult(g);
  }
  /* Ausblick: was als Nächstes kommt – mit dem Szenen-Anfang der nächsten Stadt als kleiner Spannungsbogen */
  function outlookBox(g) {
    var cu = g.cfg.unit, ui = (cu != null && !S.boss[U[cu].id]) ? cu : nextUnit(), u = U[ui], step = cityStep(ui);
    if (!step) return routeIdx().every(function (i) { return S.boss[U[i].id]; }) ? '<div class="card stack next-box" style="text-align:left;width:100%"><span class="eyebrow">' + esc(t('next_up')) + '</span><p>' + esc(t('trip_done')) + '</p></div>' : '';
    var newCity = cu != null && ui !== cu, teaser = (newCity || step === 'scene') && u.scene ? '<p class="small scene-intro">' + esc(L(u.scene.intro)) + '</p>' : '';
    return '<div class="card stack next-box pop" style="text-align:left;width:100%"><span class="eyebrow">' + esc((newCity ? t('next_station') : t('next_up')) + ' · ' + u.city) + '</span>' + teaser +
      '<b>' + esc(t('step_' + step)) + '</b><button class="btn primary" id="next-step" data-ui="' + ui + '" data-step="' + esc(step) + '">' + esc(t('go_on')) + ' →</button></div>';
  }
  function restart(cfg) {
    if (cfg.mode) return startMode(cfg.mode.m, cfg.mode.ui);
    var map = { }; map[t('learn')] = 'learn'; map[t('quiz')] = 'quiz'; map[t('listen')] = 'listen'; map[t('type')] = 'type'; map[t('build')] = 'build'; map[t('cloze')] = 'cloze'; map[t('speak')] = 'speak';
    var m = map[cfg.title]; if (m) return startMode(m, cfg.unit);
    if (cfg.boss) return startMode('boss', cfg.unit);
    if (cfg.daily) return startMode('daily');
    if (cfg.timer) return startMode('blitz');
    var t2 = cfg.title, keys = ['review', 'mistakes', 'cases', 'sounds', 'prices', 'twister'];
    for (var i = 0; i < keys.length; i++) if (t(keys[i]) === t2) return startMode(keys[i]);
    if (t2 === t('mywords')) return startMode('mine');
    go('home');
  }
  function maybeKrasnal(sure) {
    var missing = D.krasnale.map(function (k, i) { return i; }).filter(function (i) { return S.krasnale.indexOf(i) < 0; });
    if (!missing.length) return '';
    if (!sure && R() > 0.3) return '';
    var i = missing[Math.floor(R() * missing.length)], k = D.krasnale[i]; S.krasnale.push(i);
    return '<div class="card krasnal pop" style="width:100%">' + krasnalSvg() + '<span class="eyebrow">' + esc(t('krasnal_found')) + '</span><b lang="en">' + esc(k[0]) + '</b><span class="small muted"><span lang="en">' + esc(k[1]) + '</span> = ' + esc(S.base === 'en' ? k[3] : k[2]) + '</span></div>';
  }

  /* ---------- Paare (Memory) ---------- */
  /* Memory-Themen: Paare aus allen offenen Städten, Orten oder Jahreszahlen */
  function runMemo(mode) {
    var back = mode === 'memo_w' ? 'practice' : 'land', pairs;
    if (mode === 'memo_w') pairs = C.shuffle(poolOpen(), R).slice(0, 6).map(function (x) { return { a: x.w[0], b: meaning(x.w), pl: true, id: x.id }; });
    else if (mode === 'memo_p') pairs = C.sample(D.culture.places, 6, R).map(function (x) { return { a: x[0], b: L([x[1], x[2]]), pl: true }; });
    else pairs = C.sample(D.culture.timeline, 6, R).map(function (x) { return { a: String(x[0]), b: L([x[1], x[2]]), pl: false }; });
    runMatch(null, null, { pairs: pairs, title: t(mode), back: back, rerun: function () { runMemo(mode); } });
  }
  function runMatch(list, ui, th) {
    var pick = th ? th.pairs : C.shuffle(list, R).slice(0, 6), cards = [];
    pick.forEach(function (x, i) { cards.push({ k: i, s: 0, txt: th ? x.a : x.w[0], pl: th ? x.pl : true }); cards.push({ k: i, s: 1, txt: th ? x.b : meaning(x.w), pl: false }); });
    cards = C.shuffle(cards, R);
    var sel = null, gone = {}, wrong = 0, start = Date.now();
    var title = th ? th.title : t('match');
    G = { cfg: { title: title, unit: th ? null : ui }, ended: false };
    function paint() {
      var left = pick.length - Object.keys(gone).length / 2;
      shell('<section class="game"><div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + ((pick.length - left) / pick.length * 100) + '%"></i></div><span class="small num">' + left + ' ' + esc(t('pairs_left')) + '</span></div>' +
        '<div class="match-grid' + (th && !th.pairs[0].pl ? ' long' : '') + '">' + cards.map(function (c, i) { return '<button class="opt' + (gone[i] ? ' gone' : '') + (sel === i ? ' sel' : '') + '" data-c="' + i + '" lang="' + (c.pl ? 'en' : S.base) + '"' + (gone[i] ? ' disabled' : '') + '>' + esc(c.txt) + '</button>'; }).join('') + '</div></section>', false);
      document.getElementById('quit').onclick = function () { G = null; if (th) go(th.back); else go('city', ui); };
      document.querySelectorAll('[data-c]').forEach(function (b) {
        b.onclick = function () {
          var i = +b.getAttribute('data-c'), c = cards[i];
          if (c.pl) speak(c.txt);
          if (sel === null) { sel = i; return paint(); }
          if (sel === i) { sel = null; return paint(); }
          var a = cards[sel];
          if (a.k === c.k && a.s !== c.s) { gone[sel] = 1; gone[i] = 1; if (pick[c.k].id) grade(pick[c.k].id, true); sel = null; if (Object.keys(gone).length === cards.length) return finish(); return paint(); }
          wrong++; b.classList.add('wrong'); setTimeout(function () { sel = null; paint(); }, 450);
        };
      });
    }
    function finish() {
      var secs = Math.round((Date.now() - start) / 1000), xp = Math.max(20, 80 - secs - wrong * 5);
      G = { cfg: { title: title, unit: th ? null : ui, rerun: th ? th.rerun : function () { runMatch(list, ui); } }, i: 1, qs: [1], right: pick.length, wrong: wrong, xp: xp, best: pick.length, results: [], learned: th ? [] : pick.slice(0, 3).map(function (x) { return x.w; }), ended: false };
      endGame();
    }
    paint();
  }

  /* ---------- Szene ---------- */
  function runScene(ui) {
    var u = U[ui], sc = u.scene, step = 0, log = [], errors = 0;
    G = { cfg: { title: t('scene') }, ended: false };
    function paint(fbHtml) {
      var html = '<section class="game"><div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + (step / sc.steps.length * 100) + '%"></i></div></div>' +
        '<p class="scene-intro">' + esc(L(sc.intro)) + '</p>' + (step === 0 && !log.length ? szymekBubble(ui) : '') + log.join('');
      if (step < sc.steps.length) {
        var st = sc.steps[step];
        html += '<div class="npc pop"><div class="row" style="flex-wrap:nowrap"><button class="icon-btn" id="say" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button><b lang="en">' + esc(st.npc[0]) + '</b></div>' + (diff().hideTr ? '<button class="btn ghost small" id="show-tr" style="justify-self:start;min-height:36px;padding:4px 0">' + esc(t('show_tr')) + '</button><span class="small muted" id="npc-tr" hidden>' : '<span class="small muted">') + esc(L([st.npc[1], st.npc[2]])) + '</span></div>' +
          '<div class="opts" id="so">' + st.opts.map(function (o, i) { return '<button class="opt" data-o="' + i + '" lang="en">' + esc(o[0]) + '</button>'; }).join('') + '</div><div id="fb">' + (fbHtml || '') + '</div>';
      } else {
        html += '<div class="banner pop"><strong>' + esc(L(sc.outro)) + '</strong></div><button class="btn primary block" id="fin">' + esc(t('next')) + '</button>';
      }
      html += '</section>';
      shell(html, false);
      document.getElementById('quit').onclick = function () { G = null; go('city', ui); };
      if (step < sc.steps.length) {
        var st2 = sc.steps[step];
        document.getElementById('say').onclick = function () { speak(st2.npc[0]); };
        var stb = document.getElementById('show-tr'); if (stb) stb.onclick = function () { document.getElementById('npc-tr').hidden = false; stb.hidden = true; };
        if (!fbHtml) speak(st2.npc[0]);
        document.querySelectorAll('[data-o]').forEach(function (b) {
          b.onclick = function () {
            var o = st2.opts[+b.getAttribute('data-o')];
            if (o[3]) {
              speak(o[0]);
              log.push('<div class="npc"><b lang="en">' + esc(st2.npc[0]) + '</b><span class="small muted">' + esc(L([st2.npc[1], st2.npc[2]])) + '</span></div><div class="me"><b lang="en">' + esc(o[0]) + '</b><div class="small muted">' + esc(L([o[1], o[2]])) + '</div></div>');
              step++; paint();
            } else {
              errors++;
              paint('<div class="feedback no pop" role="status"><span class="h">' + esc(t('wrong')) + '</span><span>' + esc(L([o[1], o[2]])) + '</span><span class="small">' + esc(L(st2.hint)) + '</span></div>');
            }
          };
        });
      } else {
        document.getElementById('fin').onclick = function () {
          S.scenes[u.id] = true;
          G = { cfg: { title: t('scene') + ' · ' + u.city, unit: ui, rerun: function () { runScene(ui); } }, i: sc.steps.length, qs: sc.steps, right: sc.steps.length, wrong: errors, xp: Math.max(20, 60 - errors * 10), best: sc.steps.length, results: [], learned: [], ended: false };
          endGame();
        };
      }
    }
    paint();
  }

  /* ---------- Duell-Code: 2 Handys, gleiche Fragen (Plan aus C.duelPlan) ---------- */
  var duelGrade = 0;
  var duelLevel = null, duelCodeDraft = '';
  var DUEL_LVS = ['1', '2', '3', 'P1', 'P2', 'P3'];
  function duelLvLabel(lv) { return lv.charAt(0) === 'P' ? 'P' + lv.charAt(1) + ' · ' + PLX_LV[+lv.charAt(1) - 1] : t('diff_' + ['easy', 'medium', 'hard'][+lv - 1]); }
  var PLX_LV = ['dobry', 'bardzo dobry', 'mistrz'];
  function duelRecLv() { return S.plv ? 'P' + Math.min(3, Math.max(1, S.plv)) : String(['easy', 'medium', 'hard'].indexOf(S.diff) + 1 || 1); }
  function renderDuelReady(pl) {
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button>' +
      '<section class="card stack" style="text-align:center"><span class="eyebrow">' + esc(t('d2')) + '</span>' +
      '<div class="score num" lang="en" style="letter-spacing:.06em">' + esc(pl.code) + '</div>' +
      '<span class="small muted">' + esc(duelLvLabel(pl.lv)) + ' · ' + pl.plan.length + ' × · ' + esc(t('d2_weight')) + String(C.duelWeight(pl.lv)).replace('.', S.base === 'de' ? ',' : '.') + '</span>' +
      '<div><span class="small">' + esc(t('d2_check')) + '</span> <b class="chip num" id="d2chk" style="font-size:1.25rem">' + esc(pl.check) + '</b></div>' +
      '<p class="small muted">' + esc(t('d2_check_d')) + '</p><p class="small muted">' + esc(t('d2_mix')) + '</p>' +
      '<button class="btn" id="d2send">' + esc(t('d2_send_code')) + '</button>' +
      '<button class="btn primary" id="d2play">' + esc(t('start')) + '</button></section>';
    shell(html);
    document.getElementById('back').onclick = function () { renderDuelSetup(); };
    document.getElementById('d2send').onclick = function () { copy('English Trail \u2694 ' + pl.code + ' #' + pl.check); };
    document.getElementById('d2play').onclick = function () { startCodeDuel(pl); };
  }
  function duelQ(it) {
    if (it.k === 'q') { var pq = D.polacy[it.c][it.i]; return { type: 'mc', id: null, ask: '', big: pq.q, bigPl: true, small: true, sentence: pq.s, a: pq.a, opts: it.opts.slice(), plOpts: true, explain: pq.x, lvq: pq.lv }; }
    if (it.k === 'w') {
      var w = U[it.item[0]].words[it.item[1]], id = U[it.item[0]].id + ':' + it.item[1], ow = it.opts.map(function (x) { return U[x[0]].words[x[1]]; });
      if (it.dir === 'pl2x') return { type: 'mc', id: id, ask: t('choose_meaning'), big: w[0], say: w[0], a: meaning(w), opts: ow.map(meaning) };
      return { type: 'mc', id: id, ask: t('choose_pl'), big: meaning(w), a: w[0], say: null, sayAfter: w[0], opts: ow.map(function (x) { return x[0]; }), plOpts: true };
    }
    if (it.k === 'c') {
      var c = D.cases[it.i], q = { id: null, ask: t('case_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, explain: L(c.case) + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) };
      if (it.type) q.type = 'type'; else { q.type = 'mc'; q.opts = it.opts.slice(); q.plOpts = true; }
      return q;
    }
    if (it.k === 't') return qTF(D.culture.tf[it.i]);
    if (it.k === 'p') { var pp = D.culture.people[it.i]; return { type: 'mc', id: null, ask: t('whoami'), clues: pp.clues.map(L), shown: 1, a: pp.name, opts: it.opts.slice(), sayAfter: pp.name }; }
    var set = D.culture.hl[it.i], val = {}; set.items.forEach(function (x) { val[x[0]] = x[1]; });
    var a0 = it.pair[0], b0 = it.pair[1];
    return { type: 'mc', id: null, ask: L(set.q), big: '', a: val[a0] > val[b0] ? a0 : b0, opts: [a0, b0], fixed: true, plOpts: true, explain: a0 + ': ' + val[a0].toLocaleString(S.base) + ' · ' + b0 + ': ' + val[b0].toLocaleString(S.base) + ' ' + L(set.unit) };
  }
  function startCodeDuel(pl) {
    runGame({ title: t('d2') + ' · ' + pl.code, qs: pl.plan.map(duelQ), duel: { code: pl.code, check: pl.check, diff: pl.diff, lv: pl.lv, base: pl.base } });
  }
  function duelResultBox(g) {
    var d = g.cfg.duel;
    return '<div class="card stack" style="width:100%;text-align:left">' +
      '<div class="row" style="justify-content:space-between"><span>' + esc(t('d2_code')) + '</span><b class="num" lang="en">' + esc(d.code) + ' #' + esc(d.check) + '</b></div>' +
      '<div class="row" style="justify-content:space-between"><span>' + esc(t('d2_time')) + '</span><b class="num">' + esc(C.fmtTime(g.ms)) + '</b></div>' +
      '<button class="btn primary" id="d2share">' + esc(t('d2_share')) + '</button>' +
      '<label class="small" for="d2other">' + esc(t('d2_paste')) + '</label><textarea id="d2other" rows="3" placeholder="English Trail \u2694 ' + esc(d.code) + ' #' + esc(d.check) + '&#10;15/20 \u00b7 2:13"></textarea>' +
      '<button class="btn" id="d2cmp">' + esc(t('d2_compare')) + '</button><div id="d2verdict" role="status"></div></div>';
  }
  function bindDuelResult(g) {
    var d = g.cfg.duel, myName = C.duelName(S.name) || t('d2_me'), me = { right: g.right, total: g.results.length, ms: g.ms, lv: d.lv, name: myName };
    var myInp = { write: 'W', speak: 'S', tap: 'T' }[S.input] || '';
    function fmtP(x) { return String(x).replace('.', S.base === 'de' ? ',' : '.'); }
    function line(p) { return esc(p.name || '?') + ' (' + esc(p.lv || '?') + '): ' + p.right + '/' + p.total + (p.ms != null ? ' · ' + esc(C.fmtTime(p.ms)) : ''); }
    document.getElementById('d2share').onclick = function () { copy(C.duelResultText(d.code, d.check, g.results, g.ms, { name: S.name, input: S.input })); };
    document.getElementById('d2cmp').onclick = function () {
      var o = C.duelReadResult(document.getElementById('d2other').value), out = document.getElementById('d2verdict'), msg, mixed = false;
      if (o && !o.lv) o.lv = d.lv;
      if (o && o.code && o.code !== d.code) { mixed = true; var op = C.duelPlan(RAW, o.code); if (o.check && (!op || op.check !== o.check)) o.badCheck = true; }
      if (!o) msg = '<p class="small">' + esc(t('d2_unreadable')) + '</p>';
      else if (o.base && o.base !== d.base) msg = '<p class="small">' + esc(t('d2_other_base')) + '</p>';
      else if (o.badCheck || (!mixed && o.check && o.check !== d.check)) msg = '<p class="small">' + esc(t('d2_other_check')) + '</p>';
      else {
        o.name = o.name || '?';
        var v = C.duelCompare(me, o);
        msg = '<h2>' + esc(v > 0 ? t('d2_win') : (v < 0 ? t('d2_lose') : t('tie'))) + '</h2>' +
          (mixed ? '<p class="small"><b>' + esc(t('d2_mixed')) + '</b></p>' : '') +
          '<p class="small muted num">' + line(me) + (mixed ? ' → ' + fmtP(C.duelScore(me)) + ' ' + esc(t('d2_pts')) : '') + '<br>' + line(o) + (mixed ? ' → ' + fmtP(C.duelScore(o)) + ' ' + esc(t('d2_pts')) : '') + (o.check && !mixed ? '<br>' + esc(t('d2_same')) : '') + '</p>' +
          (o.input && myInp && o.input !== myInp ? '<p class="small muted">' + esc(t('d2_inp_diff')) + '</p>' : '');
        var key = String(C.hash([d.code, g.right, g.ms, o.code, o.name.toLowerCase(), o.right, o.ms].join('|')));
        if (!o.signed) msg += '<p class="small muted">' + esc(t('rank_unsigned')) + '</p>';
        else if (S.rankSeen.indexOf(key) >= 0) msg += '<p class="small muted">' + esc(t('rank_dupe')) + '</p>';
        else {
          C.rankAdd(S.rank, me, v); C.rankAdd(S.rank, o, -v);
          S.rankSeen.push(key); if (S.rankSeen.length > 300) S.rankSeen = S.rankSeen.slice(-300); save();
          msg += '<p class="small">' + esc(t('rank_added')) + '</p>';
        }
      }
      out.innerHTML = msg;
    };
  }

  /* ---------- Lokale Rangliste (S.rank, Logik in C.rankAdd/C.rankList) ---------- */
  function rankBox() {
    var list = C.rankList(S.rank), h = '<section class="card stack"><b>' + esc(t('rank')) + '</b><p class="small muted">' + esc(t('rank_d')) + '</p>';
    if (!list.length) return h + '<p class="small">' + esc(t('rank_empty')) + '</p></section>';
    h += '<table class="small num" style="width:100%;border-collapse:collapse"><thead><tr><th scope="col" style="text-align:left">#</th><th scope="col" style="text-align:left">' + esc(t('players')) + '</th><th scope="col">' + esc(t('rank_g')) + '</th><th scope="col">' + esc(t('rank_w')) + '</th><th scope="col">' + esc(t('rank_d2')) + '</th><th scope="col">' + esc(t('rank_pts')) + '</th></tr></thead><tbody>' +
      list.slice(0, 20).map(function (e, i) { return '<tr><td>' + (i + 1) + '</td><td style="text-align:left">' + esc(e.name) + '</td><td style="text-align:center">' + e.g + '</td><td style="text-align:center">' + e.w + '</td><td style="text-align:center">' + e.d + '</td><td style="text-align:center">' + String(e.pts).replace('.', S.base === 'de' ? ',' : '.') + '</td></tr>'; }).join('') + '</tbody></table>';
    return h + '<button class="btn ghost" id="rankclr">' + esc(t('rank_clear')) + '</button></section>';
  }

  /* ---------- Familienduell ---------- */
  var duelMode = 'quiz';
  function renderDuelSetup() {
    if (!RAW.polacy && RAW.polacyLazy) try { needPolacy(function () {}, true); } catch (e) {}
    if (!duelLevel) duelLevel = duelRecLv();
    if (!S.rank || typeof S.rank !== 'object') S.rank = {};
    if (!Array.isArray(S.rankSeen)) S.rankSeen = [];
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('duel')) + '</h1>' +
      '<section class="card stack"><b>' + esc(t('d2')) + '</b><p class="small muted">' + esc(t('d2_d')) + '</p>' +
      '<label class="small" for="d2name"><b>' + esc(t('d2_name')) + '</b></label><input type="text" id="d2name" maxlength="20" autocomplete="off" value="' + esc(S.name || '') + '">' +
      '<b class="small">' + esc(t('d2_level')) + '</b><span class="small muted">' + esc(t('d2_rec')) + ': ' + esc(duelLvLabel(duelRecLv())) + '</span>' +
      '<span class="small muted">' + esc(t('d2_learn')) + '</span><div class="seg" id="d2lv">' + DUEL_LVS.slice(0, 3).map(function (lv) { return segBtn(lv, duelLvLabel(lv), duelLevel === lv); }).join('') + '</div>' +
      (S.school && S.school.grade ? '<b class="small">' + esc(t('d2_src')) + '</b><div class="seg" id="d2src">' + segBtn('0', t('d2_src_trail'), !duelGrade) + segBtn(String(S.school.grade), t('sch_grade').replace('{g}', S.school.grade), !!duelGrade) + '</div>' : '') +
      '<p class="small muted">' + esc(t('d2_mix')) + '</p>' +
      '<button class="btn" id="d2new">' + esc(t('d2_new')) + '</button>' +
      '<label class="small" for="d2code">' + esc(t('d2_code')) + '</label><input type="text" id="d2code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="FOX-472-1" value="' + esc(duelCodeDraft) + '" style="text-transform:uppercase;letter-spacing:.08em">' +
      '<p class="small" id="d2err" role="alert" hidden></p>' +
      '<button class="btn primary" id="d2go">' + esc(t('start')) + '</button></section>' + rankBox() +
      '<h2>' + esc(t('duel_d')) + '</h2>' +
      '<section class="card stack"><b>' + esc(t('players')) + '</b>' + [0, 1, 2, 3].map(function (i) { return '<input type="text" id="p' + i + '" placeholder="' + esc(t('players')) + ' ' + (i + 1) + '" value="' + (i < 2 ? esc(['Ola', 'Tomek'][i]) : '') + '" aria-label="' + esc(t('players')) + ' ' + (i + 1) + '">'; }).join('') +
      '<b>' + esc(t('pm_mode')) + '</b><div class="seg" id="dmode">' + [['quiz', t('duel_quiz')], ['pm', t('pm')]].map(function (m) { return '<button data-m="' + m[0] + '" aria-pressed="' + (duelMode === m[0]) + '"' + (m[0] === 'pm' ? ' lang="en"' : '') + '>' + esc(m[1]) + '</button>'; }).join('') + '</div>' +
      '<p class="small muted" id="dmode-d">' + esc(duelMode === 'pm' ? t('pm_d') : t('duel_d')) + '</p>' +
      '<button class="btn primary" id="dgo">' + esc(t('start')) + '</button></section>';
    shell(html);
    document.getElementById('back').onclick = function () { go('practice'); };
    function markLv() { document.querySelectorAll('#d2lv button, #d2lvp button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === duelLevel)); }); }
    function pickLv(v) { duelLevel = v; markLv(); var c0 = C.duelParse(document.getElementById('d2code').value); if (c0) { document.getElementById('d2code').value = c0.base + '-' + v + (duelGrade ? '-K' + duelGrade : ''); duelCodeDraft = document.getElementById('d2code').value; } }
    bindSeg('d2lv', pickLv);
    bindSeg('d2src', function (v) { duelGrade = +v; document.querySelectorAll('#d2src button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); }); pickLv(duelLevel); });
    document.getElementById('d2name').onchange = function () { S.name = C.duelName(this.value); this.value = S.name; save(); };
    document.getElementById('d2new').onclick = function () { duelCodeDraft = C.duelNewCode(Math.random, duelLevel, duelGrade); document.getElementById('d2code').value = duelCodeDraft; document.getElementById('d2err').hidden = true; };
    document.getElementById('d2code').oninput = function () { duelCodeDraft = this.value; var c1 = C.duelParse(this.value); if (c1 && c1.lv !== duelLevel) { duelLevel = c1.lv; markLv(); } if (c1) duelGrade = c1.grade || 0; };
    var rc = document.getElementById('rankclr');
    if (rc) rc.onclick = function () { if (!window.confirm(t('rank_clear_q'))) return; S.rank = {}; S.rankSeen = []; save(); renderDuelSetup(); };
    document.getElementById('d2go').onclick = function () {
      S.name = C.duelName(document.getElementById('d2name').value); save();
      var pc0 = C.duelParse(document.getElementById('d2code').value);
      if (pc0 && pc0.pol && !RAW.polacy) { needPolacy(function () { document.getElementById('d2go').click(); }); return; }
      var pl = C.duelPlan(RAW, document.getElementById('d2code').value), er = document.getElementById('d2err');
      if (!pl) { er.textContent = t('d2_bad'); er.hidden = false; return; }
      duelCodeDraft = pl.code; renderDuelReady(pl);
    };
    document.querySelectorAll('#dmode [data-m]').forEach(function (b) {
      b.onclick = function () {
        duelMode = b.getAttribute('data-m');
        document.querySelectorAll('#dmode [data-m]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        document.getElementById('dmode-d').textContent = duelMode === 'pm' ? t('pm_d') : t('duel_d');
      };
    });
    document.getElementById('dgo').onclick = function () {
      var ps = [0, 1, 2, 3].map(function (i) { return document.getElementById('p' + i).value.trim(); }).filter(Boolean);
      if (ps.length < 2) return; if (duelMode === 'pm') startPM(ps); else startDuel(ps);
    };
  }
  function startDuel(ps) {
    /* Alle bekommen DIESELBEN Fragen (gleiche Wörter, gleiche Antwortreihenfolge), nacheinander im Block */
    var pool = poolOpen(), base = [], qs = [], per = 5, pick = C.shuffle(pool, R).slice(0, per);
    pick.forEach(function (x, i) { base.push(i % 2 ? qListen(x, pool) : qMC(x, pool, 'pl2x')); });
    ps.forEach(function () { base.forEach(function (q) { qs.push(JSON.parse(JSON.stringify(q))); }); });
    runGame({ title: t('duel'), qs: qs, players: ps, block: per });
  }

  /* ---------- Dla Polaków: Bereich für Muttersprachler (komplett Polnisch), eigene Einstufung in 3 Stufen ---------- */
  var PCATS = ['ortografia', 'poprawnosc', 'aspekt', 'liczebniki', 'frazeologia', 'wiedza'], polLv = 0;
  function qPol(x) { return { type: 'mc', id: null, ask: '', big: x.q, bigPl: true, small: true, sentence: x.s, a: x.a, opts: C.shuffle([x.a].concat(x.o), R), plOpts: true, explain: x.x, lvq: x.lv }; }
  function polPool(cat, lv) { var out = []; (cat ? [cat] : PCATS).forEach(function (c) { (D.polacy[c] || []).forEach(function (x) { if (!lv || x.lv === lv) out.push(x); }); }); return out; }
  function renderPolacy() {
    polUI = true;
    if (!polLv) polLv = Math.max(1, S.plv || 1);
    var lvTxt = S.plv == null ? t('pol_lvx') : t('pol_lv' + S.plv);
    function best(k) { var b = S.plBest[k + '|' + polLv]; return b != null ? '<span class="badge good num">' + b + '%</span>' : ''; }
    shell('<div lang="en" class="stack"><button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('pol')) + '</h1><p class="muted">' + esc(t('pol_intro')) + '</p>' +
      '<section class="card stack"><div class="row" style="justify-content:space-between"><b>' + esc(t('pol_lv')) + '</b><span class="chip">' + esc(lvTxt) + '</span></div>' +
      '<div class="row" style="gap:6px">' + [1, 2, 3].map(function (n) { return '<i class="pol-star' + (S.plv >= n ? ' on' : '') + '" aria-hidden="true"></i>'; }).join('') + '</div>' +
      '<button class="btn primary" id="ptest">' + esc(t('pol_test')) + '</button><p class="small muted">' + esc(t('pol_test_d')) + '</p></section>' +
      '<section class="stack"><b>' + esc(t('pol_qlv')) + '</b><div class="seg" id="plv">' + [1, 2, 3].map(function (n) { return segBtn(String(n), t('pol_lv' + n), polLv === n); }).join('') + '</div></section>' +
      '<section class="tiles">' + PCATS.map(function (c) { return tileBtn('pol:' + c, t('pol_c_' + c), t('pol_c_' + c + '_d'), best(c)); }).join('') + tileBtn('pol:mix', t('pol_mix'), t('pol_mix_d'), best('mix')) + '</section></div>');
    document.getElementById('back').onclick = function () { go('land'); };
    document.getElementById('ptest').onclick = startPolTest;
    bindSeg('plv', function (v) { polLv = +v; renderPolacy(); });
    document.querySelectorAll('[data-mode^="pol:"]').forEach(function (b) { b.onclick = function () { startPol(b.getAttribute('data-mode').slice(4)); }; });
  }
  function startPol(cat) {
    var lv = polLv, pool = polPool(cat === 'mix' ? null : cat, lv);
    if (!pool.length) pool = polPool(cat === 'mix' ? null : cat, 0);
    runGame({ title: t(cat === 'mix' ? 'pol_mix' : 'pol_c_' + cat) + ' · ' + t('pol_lv' + lv), qs: C.shuffle(pool, R).slice(0, 10).map(qPol), back: 'polacy', polKey: cat + '|' + lv, rerun: function () { startPol(cat); } });
  }
  function startPolTest() {
    var qs = [];
    [1, 2, 3].forEach(function (lv) { C.shuffle(PCATS, R).forEach(function (c) { var p = polPool(c, lv); if (p.length) qs.push(qPol(p[Math.floor(R() * p.length)])); }); });
    runGame({ title: t('pol_test'), qs: qs, back: 'polacy', polTest: true, rerun: startPolTest });
  }

  /* ---------- Gegenüber: 2 Leute, 1 Handy, geteilter Bildschirm (obere Hälfte 180° gedreht) ----------
     Beide sehen in jeder Runde DIESELBE Frage-Instanz (gleiche Antwortreihenfolge). Erster richtiger Tipp = Punkt. */
  var faceNames = ['Ola', 'Tomek'], faceN = 10;
  function renderFaceSetup() {
    shell('<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('face')) + '</h1>' +
      '<section class="card stack"><p class="small">' + esc(t('face_rules')) + '</p>' +
      '<b>' + esc(t('players')) + '</b>' + [0, 1].map(function (i) { return '<input type="text" id="f' + i + '" value="' + esc(faceNames[i]) + '" aria-label="' + esc(t('players')) + ' ' + (i + 1) + '">'; }).join('') +
      faceSrcSeg() +
      '<b>' + esc(t('face_n')) + '</b><div class="seg" id="fn">' + [5, 10, 15].map(function (n) { return segBtn(String(n), String(n), faceN === n); }).join('') + '</div>' +
      '<button class="btn primary" id="fgo">' + esc(t('start')) + '</button></section>');
    document.getElementById('back').onclick = function () { go('practice'); };
    bindSeg('fsrc', function (v) { faceSrc = v; renderFaceSetup(); });
    bindSeg('fn', function (v) { faceN = +v; document.querySelectorAll('#fn button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); }); });
    document.getElementById('fgo').onclick = function () {
      faceNames = [0, 1].map(function (i) { return document.getElementById('f' + i).value.trim() || ['Ola', 'Tomek'][i]; });
      startFace();
    };
  }
  /* English Trail: Gegenüber auch mit Schulstoff (Klasse) oder eigenen Buch-Vokabeln einer Unit – wer zuerst richtig tippt, bekommt den Punkt */
  var faceSrc = 'trail';
  function faceSrcSeg() {
    if (!(S.school && S.school.grade)) return '';
    var g = S.school.grade, un = Object.keys(schUnits()).filter(function (k) { return schUnits()[k].length >= 4; }).sort();
    if (faceSrc !== 'trail' && faceSrc !== 'school' && un.indexOf(faceSrc.slice(2)) < 0) faceSrc = 'trail';
    return '<b>' + esc(t('d2_src')) + '</b><div class="seg" id="fsrc">' + segBtn('trail', t('d2_src_trail'), faceSrc === 'trail') + segBtn('school', t('sch_grade').replace('{g}', g), faceSrc === 'school') +
      un.map(function (k) { return segBtn('u:' + k, '📘 ' + k, faceSrc === 'u:' + k); }).join('') + '</div>';
  }
  function facePool() {
    if (S.school && S.school.grade && faceSrc !== 'trail') {
      var g = S.school.grade, packW = []; schPacks(g).forEach(function (i) { packW = packW.concat(wordsOf(i)); });
      var cs0 = D.cases.filter(function (c) { return (c.k || 5) <= g; });
      if (faceSrc === 'school') return { words: packW, cases: cs0 };
      var own = schUnits()[faceSrc.slice(2)] || [];
      return { words: own.length >= 4 ? own : own.concat(packW), cases: cs0, own: own.length >= 4 };
    }
    return { words: poolOpen(), cases: D.cases };
  }
  function faceQs(n) {
    var fp = facePool(), pool = fp.words, words = C.shuffle(pool, R), cs = C.shuffle(fp.cases, R), tf = C.shuffle(D.culture.tf, R), qs = [];
    for (var i = 0; i < n; i++) {
      var k = fp.own ? (i % 3 === 2 ? 2 : i % 3) : i % 4, q;
      if (k === 0) q = qMC(words[i % words.length], pool, 'pl2x');
      else if (k === 1) q = qMC(words[i % words.length], pool, 'x2pl');
      else if (k === 2) { var c = cs[i % cs.length]; q = { ask: t('case_q') + ' (' + c.base + ')', big: c.s, sub: L(c.tr), a: c.a, opts: C.shuffle(c.opts.slice(), R), plOpts: true, small: true, sayAfter: c.s.replace('___', c.a) }; }
      else q = qTF(tf[i % tf.length]);
      if (q.opts.length > 4) q.opts = C.shuffle(q.opts.filter(function (o) { return o !== q.a; }).slice(0, 3).concat([q.a]), R);
      qs.push(q);
    }
    return qs;
  }
  function startFace() {
    G = null;
    var F = { qs: faceQs(faceN), i: 0, sc: [0, 0], out: [false, false], done: false, tId: null };
    function half(p, inner) { return '<div class="fhalf' + (p === 0 ? ' flip' : '') + '" data-p="' + p + '">' + inner + '</div>'; }
    function quit() { if (F) clearTimeout(F.tId); F = null; document.removeEventListener('keydown', onKey); go('practice'); }
    function onKey(e) { if (e.key === 'Escape' && F) quit(); }
    document.addEventListener('keydown', onKey);
    function paint() {
      var q = F.qs[F.i], plo = q.plOpts ? ' lang="en"' : '', plb = q.plOpts || q.ask === t('tf') ? '' : ' lang="en"';
      var body = function (p) {
        return '<div class="fhead"><b>' + esc(faceNames[p]) + '</b><span class="num fsc">' + F.sc[p] + '</span></div>' +
          '<div class="fask">' + esc(q.ask) + '</div>' +
          '<div class="fbig' + (q.small || String(q.big).length > 34 ? ' sm' : '') + '"' + plb + '>' + esc(q.big) + '</div>' +
          (q.sub ? '<div class="small muted">' + esc(q.sub) + '</div>' : '') +
          '<div class="fopts">' + q.opts.map(function (o, j) { return '<button class="opt" data-o="' + j + '"' + plo + '>' + esc(o) + '</button>'; }).join('') + '</div>' +
          '<div class="fmsg" role="status"></div>';
      };
      $app.innerHTML = '<div class="face">' + half(0, body(0)) +
        '<div class="fbar"><span class="num">' + (F.i + 1) + '/' + F.qs.length + '</span><button class="btn ghost" id="fquit">' + esc(t('face_quit')) + '</button></div>' +
        half(1, body(1)) + '</div>';
      document.getElementById('fquit').onclick = quit;
      $app.querySelectorAll('.fhalf').forEach(function (h) {
        var p = +h.getAttribute('data-p');
        h.querySelectorAll('[data-o]').forEach(function (b) {
          var fire = function (e) { if (e.type === 'pointerdown') e.preventDefault(); answer(p, +b.getAttribute('data-o')); };
          b.addEventListener('pointerdown', fire); b.addEventListener('click', fire);
        });
      });
    }
    function msg(p, txt) { $app.querySelector('.fhalf[data-p="' + p + '"] .fmsg').textContent = txt; }
    function reveal() {
      var q = F.qs[F.i];
      $app.querySelectorAll('.fhalf').forEach(function (h) {
        h.querySelectorAll('[data-o]').forEach(function (b) { b.disabled = true; if (q.opts[+b.getAttribute('data-o')] === q.a) b.classList.add('right'); });
        h.querySelector('.fsc').textContent = F.sc[+h.getAttribute('data-p')];
      });
      if (q.sayAfter || q.say) speak(q.sayAfter || q.say);
      F.tId = setTimeout(function () { if (!F) return; F.i++; F.out = [false, false]; F.done = false; if (F.i >= F.qs.length) end(); else paint(); }, 1800);
    }
    function answer(p, j) {
      if (!F || F.done || F.out[p]) return;
      var q = F.qs[F.i], h = $app.querySelector('.fhalf[data-p="' + p + '"]');
      if (q.opts[j] === q.a) {
        F.done = true; F.sc[p]++; msg(p, t('face_point')); msg(1 - p, faceNames[p] + ' ' + t('face_fast'));
        try { if (navigator.vibrate) navigator.vibrate(40); } catch (e) {}
        reveal();
      } else {
        F.out[p] = true; h.querySelector('[data-o="' + j + '"]').classList.add('wrong');
        h.querySelectorAll('[data-o]').forEach(function (b) { b.disabled = true; });
        msg(p, t('face_wrong'));
        if (F.out[0] && F.out[1]) { F.done = true; msg(0, t('face_nobody')); msg(1, t('face_nobody')); reveal(); }
      }
    }
    function end() {
      document.removeEventListener('keydown', onKey);
      var tie = F.sc[0] === F.sc[1];
      var body = function (p) {
        return '<div class="fend"><h2>' + esc(tie ? t('tie') : F.sc[p] > F.sc[1 - p] ? t('face_win') : t('face_lose')) + '</h2>' +
          '<div class="fscore num">' + F.sc[p] + ' : ' + F.sc[1 - p] + '</div><div class="small muted">' + esc(faceNames[p]) + ' – ' + esc(faceNames[1 - p]) + '</div></div>';
      };
      $app.innerHTML = '<div class="face">' + half(0, body(0)) +
        '<div class="fbar"><button class="btn primary" id="fagain">' + esc(t('again')) + '</button><button class="btn ghost" id="fquit">' + esc(t('face_quit')) + '</button></div>' +
        half(1, body(1)) + '</div>';
      document.getElementById('fagain').onclick = function () { startFace(); };
      document.getElementById('fquit').onclick = function () { F = null; go('practice'); };
      document.getElementById('fagain').focus();
    }
    paint();
  }

  /* ---------- Państwa-Miasta (Stadt-Land-Fluss) ---------- */
  var PM = null;
  function startPM(ps) {
    pmStop();
    PM = { ps: ps, cats: C.shuffle(D.pm.cats, R).slice(0, 5), letters: C.shuffle(D.pm.letters, R).slice(0, 3), round: 0, pi: 0, ans: null, ok: null, tot: ps.map(function () { return 0; }), tId: null };
    pmRound();
  }
  function pmStop() { if (PM && PM.tId) { clearInterval(PM.tId); PM.tId = null; } }
  function pmQuit() { pmStop(); PM = null; go('practice'); }
  function pmTop(extra) {
    return '<div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + (PM.round / PM.letters.length * 100) + '%"></i></div>' + (extra || '') + '</div>';
  }
  function pmRound() {
    PM.pi = 0;
    PM.ans = PM.ps.map(function () { return PM.cats.map(function () { return ''; }); });
    PM.ok = PM.ps.map(function () { return PM.cats.map(function () { return false; }); });
    pmPass();
  }
  function pmPass() {
    view = 'game';
    shell('<section class="game">' + pmTop() + '<div class="prompt"><span class="eyebrow"><span lang="en">' + esc(t('pm')) + '</span> · ' + esc(t('pm_round')) + ' ' + (PM.round + 1) + '/' + PM.letters.length + '</span>' +
      '<p class="muted">' + esc(t('pm_pass')) + '</p><div class="big">' + esc(PM.ps[PM.pi]) + '</div><p class="small muted">' + esc(t('pm_lookaway')) + '</p></div>' +
      (PM.round === 0 && PM.pi === 0 ? '<div class="card small">' + esc(t('pm_rules')) + '</div>' : '') +
      '<button class="btn primary block" id="pmgo">' + esc(t('pm_ready')) + '</button></section>', false);
    document.getElementById('quit').onclick = pmQuit;
    document.getElementById('pmgo').onclick = pmPlay;
  }
  function pmPlay() {
    var letter = PM.letters[PM.round], secs = { easy: 90, medium: 60, hard: 45 }[S.diff] || 60, left = secs, done = false;
    shell('<section class="game">' + pmTop('<span class="timer num" id="pmt">' + left + '</span>') +
      '<div class="prompt"><span class="eyebrow">' + esc(PM.ps[PM.pi]) + ' · ' + esc(t('pm_letter')) + '</span><div class="pm-letter" lang="en">' + esc(letter) + '</div></div>' +
      '<form id="pmf" class="stack" autocomplete="off">' + PM.cats.map(function (c, ci) {
        return '<label class="stack" style="gap:4px"><span class="small"><b lang="en">' + esc(c.pl) + '</b> <span class="muted">· ' + esc(L([c.de, c.en])) + '</span></span>' +
          '<input type="text" id="pm' + ci + '" lang="en" autocapitalize="off" spellcheck="false" placeholder="' + esc(letter) + '…"></label>';
      }).join('') + '<button class="btn primary block" type="submit">' + esc(t('pm_done')) + '</button></form></section>', false);
    document.getElementById('quit').onclick = pmQuit;
    function fin() {
      if (done || !PM) return; done = true; pmStop();
      PM.ans[PM.pi] = PM.cats.map(function (c, ci) { var el = document.getElementById('pm' + ci); return el ? el.value.trim() : ''; });
      PM.pi++;
      if (PM.pi < PM.ps.length) pmPass(); else pmReview();
    }
    document.getElementById('pmf').onsubmit = function (e) { e.preventDefault(); fin(); };
    document.getElementById('pm0').focus();
    pmStop();
    PM.tId = setInterval(function () { left--; var el = document.getElementById('pmt'); if (el) el.textContent = Math.max(left, 0); if (left <= 0) fin(); }, 1000);
  }
  function pmReview() {
    var letter = PM.letters[PM.round];
    PM.ans.forEach(function (row, pi) { row.forEach(function (a, ci) { PM.ok[pi][ci] = C.pmKnown(a, letter, PM.cats[ci].words); }); });
    var ex = PM.cats.map(function (c) { return C.shuffle(c.words.filter(function (w) { return C.pmLetterOk(w, letter); }), R).slice(0, 3); });
    function paint() {
      var html = '<section class="game">' + pmTop() + '<div class="prompt"><span class="eyebrow">' + esc(t('pm_check')) + ' · ' + esc(t('pm_letter')) + '</span><div class="pm-letter" lang="en">' + esc(letter) + '</div></div>';
      PM.cats.forEach(function (c, ci) {
        html += '<div class="card stack"><b><span lang="en">' + esc(c.pl) + '</span> <span class="muted small">· ' + esc(L([c.de, c.en])) + '</span></b>' +
          PM.ps.map(function (p, pi) {
            var a = PM.ans[pi][ci], ok = PM.ok[pi][ci], canTg = a && C.pmLetterOk(a, letter);
            return '<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="grow"><span class="small muted">' + esc(p) + '</span><br><b lang="en">' + (a ? esc(a) : '–') + '</b></span>' +
              (canTg ? '<button class="chip pm-tg' + (ok ? ' on' : '') + '" data-p="' + pi + '" data-c="' + ci + '" aria-pressed="' + ok + '">' + esc(ok ? t('pm_valid') : t('pm_invalid')) + '</button>'
                : '<span class="chip">' + esc(t('pm_invalid')) + '</span>') + '</div>';
          }).join('') +
          (ex[ci].length ? '<span class="small muted">' + esc(t('pm_examples')) + ': <span lang="en">' + esc(ex[ci].join(', ')) + '</span></span>' : '') + '</div>';
      });
      html += '<button class="btn primary block" id="pmc">' + esc(t('pm_count')) + '</button></section>';
      shell(html, false);
      document.getElementById('quit').onclick = pmQuit;
      document.querySelectorAll('.pm-tg').forEach(function (b) {
        b.onclick = function () { var pi = +b.getAttribute('data-p'), ci = +b.getAttribute('data-c'), y = window.scrollY; PM.ok[pi][ci] = !PM.ok[pi][ci]; paint(); window.scrollTo(0, y); };
      });
      document.getElementById('pmc').onclick = pmScoreRound;
    }
    paint(); window.scrollTo(0, 0);
  }
  function pmScoreRound() {
    var pts = PM.ps.map(function () { return 0; });
    PM.cats.forEach(function (c, ci) {
      C.pmScore(PM.ps.map(function (p, pi) { return PM.ans[pi][ci]; }), PM.ps.map(function (p, pi) { return PM.ok[pi][ci]; }))
        .forEach(function (v, pi) { pts[pi] += v; });
    });
    pts.forEach(function (v, pi) { PM.tot[pi] += v; });
    PM.round++;
    var last = PM.round >= PM.letters.length, max = Math.max.apply(null, PM.tot), win = PM.ps.filter(function (p, i) { return PM.tot[i] === max; });
    var rows = PM.ps.map(function (p, i) { return '<div class="row" style="justify-content:space-between"><b>' + esc(p) + '</b><span class="num">+' + pts[i] + ' · <b>' + PM.tot[i] + '</b></span></div>'; }).join('');
    shell('<section class="result pop"><span class="eyebrow" lang="en">' + esc(t('pm')) + '</span><h1>' + esc(last ? t('done') : t('pm_round') + ' ' + PM.round + '/' + PM.letters.length) + '</h1>' +
      '<div class="card stack" style="width:100%;text-align:left"><span class="eyebrow">' + esc(t('pm_total')) + '</span>' + rows + '</div>' +
      (last ? '<h2>' + esc(win.length > 1 ? t('tie') : win[0] + ' ' + t('winner')) + '</h2><div class="row" style="width:100%"><button class="btn" id="again" style="flex:1">' + esc(t('again')) + '</button><button class="btn primary" id="home" style="flex:1">' + esc(t('home')) + '</button></div>'
        : '<button class="btn primary block" id="pmn">' + esc(t('pm_next_round')) + '</button>') + '</section>', false);
    if (last) {
      var ps = PM.ps; markActive(); save();
      document.getElementById('again').onclick = function () { startPM(ps); };
      document.getElementById('home').onclick = function () { PM = null; go('home'); };
    } else document.getElementById('pmn').onclick = pmRound;
  }

  /* ---------- Start ---------- */
  /* ================================================================
     Prüfmodus für Muttersprachler (3.0): english.arndt-software.de/?review
     Alle polnischen Inhalte nacheinander: ✓ poprawne / ✗ do poprawy (+ Vorschlag). Ergebnisse gehen in ps_feedback,
     ✓ gesammelt in Paketen, ✗ sofort. Fortschritt bleibt im Browser (localStorage english_trail_review).
     ================================================================ */
  var REVIEW = /[?&]review\b/.test(location.search), RVK = 'english_trail_review', RV = null, rvSec = 'new', rvCur = null, rvBad = false;
  var RVX = { title: 'Sprawdzanie treści', intro: 'Dziękujemy za pomoc! Sprawdź, czy polskie zdania są poprawne i naturalne, a tłumaczenia pasują. Formy w nawiasach {…|…} pokazujemy jako wersję męską i żeńską.', name: 'Twoje imię (opcjonalnie)', all: 'Wszystko', newer: 'Najpierw: Szlak 2, 3 i pakiety', ok: '✓ Poprawne', bad: '✗ Do poprawy', skip: 'Pomiń', how: 'Jak powinno być? Co jest nie tak?', send: 'Wyślij uwagę', done: 'Gotowe! Wszystko w tej części sprawdzone.', prog: 'sprawdzone', sent: 'Wysłano', pend: 'czeka na wysłanie', flush: 'Wyślij teraz', export: 'Wyniki jako tekst (kopia zapasowa)', copy: 'Kopiuj', fail: 'Brak połączenia – wyniki są zapisane i zostaną wysłane później.', back: 'Do aplikacji', listen: 'Odsłuchaj', undo: 'Cofnij ostatnie',
    secs: { rd: 'Książka (Szlak 3)', w: 'Słówka', s: 'Zdania', sc: 'Scenki', l: 'List i pocztówki', m: 'Misje', c: 'Przypadki', a: 'Aspekt', v: 'Czasowniki', t: 'Łamańce językowe', k: 'Krasnale', p: 'Dla Polaków' } };
  function rvLoad() { try { RV = JSON.parse(localStorage.getItem(RVK) || 'null'); } catch (e) {} if (!RV || typeof RV !== 'object') RV = { name: '', res: {}, pend: [], hist: [] }; RV.res = RV.res || {}; RV.pend = RV.pend || []; RV.hist = RV.hist || []; }
  function rvSave() { try { localStorage.setItem(RVK, JSON.stringify(RV)); } catch (e) {} }
  function rvShow(s) { return C.hasG(s) ? C.gform(s, 'm') + '  ·  ' + C.gform(s, 'f') : String(s); }
  function rvItems() {
    var it = [], R0 = RAW;
    function add(k, sec, pl, de, en, note) { it.push({ k: k, sec: sec, pl: rvShow(pl), de: de ? rvShow(de) : '', en: en ? rvShow(en) : '', note: note || '', r: rvR }); }
    var rvR = 1;
    R0.units.forEach(function (u) { rvR = u.pack ? 2 : (u.r || 1);
      u.words.forEach(function (w, i) { add('w:' + u.id + ':' + i, 'w', w[0], w[1], w[2], u.city); });
      u.sentences.forEach(function (s, i) { add('s:' + u.id + ':' + i, 's', s[0], s[1], s[2], u.city); });
      if (u.read) {
        u.read.lines.forEach(function (l, i) { add('r:' + u.id + ':' + i, 'rd', l.pl, l.tr[0], l.tr[1], u.city + ' · ' + L(u.read.t)); });
        u.read.q.forEach(function (q, i) { add('rq:' + u.id + ':' + i, 'rd', q.q + '  →  ' + q.o.join(' / '), q.tr[0], q.tr[1], u.city + ' · ✓ ' + q.o[q.a]); });
      }
      if (u.scene) u.scene.steps.forEach(function (st, si) {
        add('sc:' + u.id + ':' + si + ':n', 'sc', st.npc[0], st.npc[1], st.npc[2], u.city + ' · NPC');
        st.opts.forEach(function (o, oi) { add('sc:' + u.id + ':' + si + ':' + oi, 'sc', o[0], o[1], o[2], u.city + (o[3] ? ' · ✓' : ' · (zła odpowiedź – ma być poprawna polszczyzna, ale nie pasuje do sytuacji)')); });
      });
    });
    rvR = 1;
    [['l', R0.letter], ['d', R0.diary]].forEach(function (x) { rvR = x[0] === 'd' ? 2 : 1; if (x[1]) x[1].lines.forEach(function (l, i) { add(x[0] + ':' + i, 'l', l.pl, l.tr[0], l.tr[1]); }); });
    rvR = 2;
    Object.keys(R0.missions || {}).forEach(function (k) { add('m:' + k, 'm', R0.missions[k].pl, R0.missions[k].d[0], R0.missions[k].d[1]); });
    rvR = 1;
    (R0.cases || []).forEach(function (c, i) { add('c:' + i, 'c', c.s.replace('___', c.a), c.tr[0], c.tr[1], c.base + ' → ' + c.a + ' · ' + c.case[0]); });
    (R0.aspects || []).forEach(function (c, i) { add('a:' + i, 'a', c.s.replace('___', c.a), c.tr[0], c.tr[1], c.base + ' → ' + c.a); });
    (R0.verbs || []).forEach(function (v) { add('v:' + v.inf, 'v', v.inf + ' – ' + v.past + ' – ' + v.pp, v.de, v.en); });
    (R0.twisters || []).forEach(function (x, i) { add('t:' + i, 't', x[0], x[1], x[2]); });
    (R0.krasnale || []).forEach(function (x, i) { add('k:' + i, 'k', x[0] + ' – ' + x[1], x[2], x[3]); });
    Object.keys(R0.polacy || {}).forEach(function (c) { R0.polacy[c].forEach(function (x, i) { add('p:' + c + ':' + i, 'p', (x.s ? x.s.replace('___', x.a) + '  —  ' : '') + x.q + ' → ' + x.a, '', '', 'Źle: ' + x.o.join(' / ') + (x.x ? ' · ' + x.x : '')); }); });
    return it;
  }
  function rvSend(msg, ctx) { return sbFetch('/rest/v1/et_feedback', { method: 'POST', prefer: 'return=minimal', body: { msg: String(msg).slice(0, 1000), ctx: String(ctx).slice(0, 500), lang: S.base === 'en' ? 'en' : 'de', ver: APP_VER } }); } /* Tabelle erlaubt nur de/en; „review“ steht im ctx */
  function rvFlush() {
    if (!RV.pend.length) return Promise.resolve();
    var batch = RV.pend.slice(0, 60);
    return rvSend('REVIEW ✓ ' + batch.length + ': ' + batch.join(' '), 'review|' + (RV.name || '?')).then(function () { RV.pend = RV.pend.slice(batch.length); rvSave(); return rvFlush(); });
  }
  function renderReview() {
    if (!RV) rvLoad();
    var all = rvItems(), secs = {}, list = all.filter(function (x) { secs[x.sec] = secs[x.sec] || { n: 0, d: 0 }; secs[x.sec].n++; if (RV.res[x.k]) secs[x.sec].d++; return rvSec === 'all' || x.sec === rvSec || (rvSec === 'new' && x.r >= 2); });
    var done = list.filter(function (x) { return RV.res[x.k]; }).length;
    if (!rvCur || !list.some(function (x) { return x.k === rvCur; }) || RV.res[rvCur]) { var nx = list.filter(function (x) { return !RV.res[x.k]; })[0]; rvCur = nx ? nx.k : null; rvBad = false; }
    var cur = list.filter(function (x) { return x.k === rvCur; })[0];
    var tot = all.filter(function (x) { return RV.res[x.k]; }).length;
    var html = '<section class="stack" lang="en"><h1>' + esc(RVX.title) + '</h1><p class="small">' + esc(RVX.intro) + '</p>' +
      '<label class="fld">' + esc(RVX.name) + '<input type="text" id="rv-name" maxlength="30" autocomplete="name" value="' + esc(RV.name) + '"></label>' +
      '<div class="seg rv-secs" id="rv-sec">' + segBtn('new', RVX.newer + ' ' + all.filter(function (x) { return x.r >= 2 && RV.res[x.k]; }).length + '/' + all.filter(function (x) { return x.r >= 2; }).length, rvSec === 'new') + segBtn('all', RVX.all + ' ' + tot + '/' + all.length, rvSec === 'all') + Object.keys(secs).map(function (k) { return segBtn(k, RVX.secs[k] + ' ' + secs[k].d + '/' + secs[k].n, rvSec === k); }).join('') + '</div>' +
      '<div class="row small muted num"><div class="bar" style="flex:1"><i style="width:' + (list.length ? done / list.length * 100 : 0) + '%"></i></div>' + done + '/' + list.length + ' ' + esc(RVX.prog) + '</div>';
    if (cur) {
      html += '<article class="card stack rv-card"><span class="eyebrow">' + esc(RVX.secs[cur.sec]) + (cur.note ? ' · ' + esc(cur.note) : '') + ' · <span class="num">' + esc(cur.k) + '</span></span>' +
        '<div class="row" style="align-items:start;flex-wrap:nowrap"><p class="rv-pl grow">' + esc(cur.pl) + '</p><button class="icon-btn" id="rv-say" aria-label="' + esc(RVX.listen) + '">' + I.spk + '</button></div>' +
        (cur.de ? '<p class="small" lang="de">DE: ' + esc(cur.de) + '</p>' : '') + (cur.en ? '<p class="small" lang="en">EN: ' + esc(cur.en) + '</p>' : '') +
        (rvBad ? '<label class="fld">' + esc(RVX.how) + '<textarea id="rv-txt" rows="3" maxlength="800"></textarea></label><div class="row"><button class="btn primary" id="rv-send">' + esc(RVX.send) + '</button><button class="btn ghost" id="rv-cancel">' + esc(RVX.skip) + '</button></div>'
          : '<div class="row"><button class="btn primary" id="rv-ok" style="flex:1">' + esc(RVX.ok) + '</button><button class="btn" id="rv-bad" style="flex:1">' + esc(RVX.bad) + '</button></div><button class="btn ghost" id="rv-skip" style="justify-self:start">' + esc(RVX.skip) + ' →</button>') +
        '<p class="small muted" id="rv-st" role="status"></p></article>';
    } else html += '<div class="banner pop"><strong>' + esc(RVX.done) + '</strong></div>';
    html += '<div class="row">' + (RV.hist.length ? '<button class="btn ghost" id="rv-undo">↶ ' + esc(RVX.undo) + '</button>' : '') + (RV.pend.length ? '<button class="btn" id="rv-flush">' + esc(RVX.flush) + ' (' + RV.pend.length + ' ' + esc(RVX.pend) + ')</button>' : '') + '</div>' +
      '<details class="card"><summary class="small" style="cursor:pointer;font-weight:700">' + esc(RVX.export) + '</summary><textarea id="rv-exp" rows="6" style="width:100%;margin-top:8px">' + esc(Object.keys(RV.res).map(function (k) { return k + ' ' + RV.res[k]; }).join('\n')) + '</textarea><button class="btn" id="rv-copy">' + esc(RVX.copy) + '</button></details>' +
      '<a class="btn ghost" href="./" style="justify-self:start">← ' + esc(RVX.back) + '</a></section>';
    shell(html, false);
    var st = function (m) { var e = document.getElementById('rv-st'); if (e) e.textContent = m; };
    document.getElementById('rv-name').onchange = function (e) { RV.name = e.target.value.trim().slice(0, 30); rvSave(); };
    bindSeg('rv-sec', function (v) { rvSec = v; rvCur = null; renderReview(); });
    var b;
    if ((b = document.getElementById('rv-say'))) b.onclick = function () { ttsSpeak(C.gform(cur.pl.split('  ·  ')[0].split(' → ')[0], 'm')); };
    if ((b = document.getElementById('rv-ok'))) b.onclick = function () { RV.res[cur.k] = 'ok'; RV.pend.push(cur.k); RV.hist.push(cur.k); rvSave(); if (RV.pend.length >= 20) rvFlush().catch(function () {}); renderReview(); };
    if ((b = document.getElementById('rv-bad'))) b.onclick = function () { rvBad = true; renderReview(); setTimeout(function () { var t2 = document.getElementById('rv-txt'); if (t2) t2.focus(); }, 30); };
    if ((b = document.getElementById('rv-skip'))) b.onclick = function () { var idx = list.indexOf(cur), nx = list.slice(idx + 1).concat(list.slice(0, idx)).filter(function (x) { return !RV.res[x.k]; })[0]; rvCur = nx ? nx.k : null; renderReview(); };
    if ((b = document.getElementById('rv-cancel'))) b.onclick = function () { rvBad = false; renderReview(); };
    if ((b = document.getElementById('rv-send'))) b.onclick = function () {
      var txt = document.getElementById('rv-txt').value.trim(), item = cur; if (!txt) return;
      b.disabled = true; st('…');
      RV.res[item.k] = 'bad: ' + txt.replace(/\s+/g, ' '); RV.hist.push(item.k); rvSave();
      rvSend('REVIEW ✗ [' + item.k + '] ' + item.pl + ' → ' + txt, 'review|' + (RV.name || '?') + '|' + item.k).then(function () { toast(RVX.sent); rvBad = false; renderReview(); },
        function () { copy('[' + item.k + '] ' + item.pl + ' → ' + txt); toast(RVX.fail); rvBad = false; renderReview(); });
    };
    if ((b = document.getElementById('rv-undo'))) b.onclick = function () { var k = RV.hist.pop(); if (k) { delete RV.res[k]; RV.pend = RV.pend.filter(function (x) { return x !== k; }); rvCur = k; rvBad = false; } rvSave(); renderReview(); };
    if ((b = document.getElementById('rv-flush'))) b.onclick = function () { b.disabled = true; rvFlush().then(function () { toast(RVX.sent); renderReview(); }, function () { toast(RVX.fail); renderReview(); }); };
    if ((b = document.getElementById('rv-copy'))) b.onclick = function () { copy(document.getElementById('rv-exp').value); };
  }
  if (REVIEW) document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && RV && RV.pend.length) rvFlush().catch(function () {}); });

  function boot() {
    if (REVIEW) { needS3(function () { renderReview(); }); renderReview(); if (!RAW.polacy && RAW.polacyLazy) needPolacy(function () { renderReview(); }); return; }
    startSafety(); sbFromHash(); if (S.vsrc) needAV();
    /* Erst zeichnen, wenn Szlak 2/3 da sind (aus dem Cache: Millisekunden) – spätestens nach 1,2 s; kommt es später, Startseite neu zeichnen */
    var first = false;
    function go1() { if (first) return; first = true; render(); setTimeout(installHint, 1200); if (A && A.uid) syncNow(); }
    needS3(function () { if (first) { if (!G && tab === 'home') render(); } else go1(); });
    setTimeout(go1, 1200);
  }
  if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(boot); else boot();

  /* Service Worker nur im eigenen Hosting (nicht in Vorschauen/iframes) */
  try { if ('serviceWorker' in navigator && location.protocol === 'https:' && window.top === window.self && document.documentElement.getAttribute('data-pwa') === '1') navigator.serviceWorker.register('sw.js'); } catch (e) {}

  window.PSApp = { state: function () { return S; }, startMode: startMode, go: go, game: function () { return G; }, data: function () { return D; }, live: function () { return LD; } };
})();
