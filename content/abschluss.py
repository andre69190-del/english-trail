# English Trail – Abschluss-Training Sekundarstufe I BW (Realschulabschluss, Hauptschul-/Werkrealschulabschluss)
# Grundlage: Zentrale Prüfungsmaßstäbe Kommunikationsprüfung in der Pflichtfremdsprache (KM BW, RSAP 2025/26):
# drei Teile ohne Vorbereitungszeit – a) Präsentation des Schwerpunktthemas, b) dialogisches Sprechen, c) Sprachmittlung –
# ca. 15 Minuten je Schüler, je Teil 10 Punkte (Monolog: Inhalt/Darstellung 5 + Sprache 5; Dialog: Situation/Reaktion 5 + Sprache 5;
# Sprachmittlung 10). Schriftlich: A Listening, B Text-based Tasks, C Use of Language, D Writing, E Interpreting (150 Min.).
# Alle Texte eigene Formulierungen (keine Prüfungsaufgaben übernommen).

# Redemittel für die Präsentation: (Teil, Englisch, Deutsch)
PHRASES = [
  ('start', 'Today I would like to talk about …', 'Heute möchte ich über … sprechen.'),
  ('start', 'I chose this topic because …', 'Ich habe dieses Thema gewählt, weil …'),
  ('start', 'My presentation has three parts.', 'Meine Präsentation hat drei Teile.'),
  ('main', 'First of all, …', 'Zuerst …'),
  ('main', 'Another important point is …', 'Ein weiterer wichtiger Punkt ist …'),
  ('main', 'For example, …', 'Zum Beispiel …'),
  ('main', 'On the one hand … on the other hand …', 'Einerseits … andererseits …'),
  ('main', 'As you can see on this picture, …', 'Wie ihr auf diesem Bild seht, …'),
  ('main', 'In my opinion, …', 'Meiner Meinung nach …'),
  ('end', 'To sum up, …', 'Zusammenfassend …'),
  ('end', 'What I find most interesting is …', 'Am interessantesten finde ich …'),
  ('end', 'Thank you for listening. Do you have any questions?', 'Danke fürs Zuhören. Habt ihr Fragen?'),
  ('help', 'Sorry, could you repeat the question, please?', 'Entschuldigung, können Sie die Frage bitte wiederholen?'),
  ('help', 'I am not sure, but I think …', 'Ich bin nicht sicher, aber ich glaube …'),
  ('help', 'That is a good question. Let me think.', 'Das ist eine gute Frage. Lassen Sie mich nachdenken.'),
  ('help', 'I don’t know the word in English, but it is something like …', 'Ich kenne das Wort auf Englisch nicht, aber es ist so etwas wie …'),
]

# Nachfragen nach der Präsentation ({t} = Thema)
FOLLOWUP = [
  'Why did you choose {t} as your topic?',
  'What was the most interesting thing you found out?',
  'Where did you get your information from?',
  'What do you think about {t} personally?',
  'Is {t} important for young people in Germany too? Why?',
  'What would you like to find out next about {t}?',
  'Was there anything that surprised you?',
  'How is this different in Germany?',
  'Can you give me one more example?',
  'If a friend asked you about {t}, what would you tell them in one sentence?',
  'What was difficult when you prepared your presentation?',
  'Would you recommend this topic to other students? Why or why not?',
]

# Sprachmittlung: Situation (DE), was gesagt wird (Quelle), Aufgabe, Musterlösung, Punkte, die drin sein sollten.
# r: Richtung 'de-en' (Deutsch hören, Englisch weitergeben) oder 'en-de'
MEDIATION = [
  dict(r='de-en', sit='Eure Austauschschülerin Emily aus Leeds steht mit dir am Bahnhof. Die Durchsage ist nur auf Deutsch.',
       src='„Der ICE nach München hat heute circa 20 Minuten Verspätung und fährt ausnahmsweise von Gleis 7 statt von Gleis 4.“',
       task='Erkläre Emily auf Englisch, was durchgesagt wurde.',
       model='Our train to Munich is about twenty minutes late, and today it leaves from platform 7, not platform 4.',
       keys=['train to Munich', 'about 20 minutes late', 'platform 7 (not 4)']),
  dict(r='de-en', sit='Ein Tourist aus den USA steht vor dem Freibad. Auf dem Schild steht etwas auf Deutsch.',
       src='„Heute wegen Gewitterwarnung ab 16 Uhr geschlossen. Eintrittskarten können bis Ende des Monats an der Kasse erstattet werden.“',
       task='Erkläre ihm auf Englisch das Wichtigste.',
       model='The pool closes at four o’clock today because there is a storm warning. You can get your money back at the ticket office until the end of the month.',
       keys=['closes at 4 pm today', 'because of a storm warning', 'money back at the ticket office', 'until the end of the month']),
  dict(r='de-en', sit='Deine Mutter spricht kein Englisch. Euer Gast Liam aus Dublin fragt, was es zum Abendessen gibt.',
       src='Mutter: „Sag ihm, es gibt Maultaschen mit Kartoffelsalat. Wenn er kein Fleisch isst, mache ich ihm Käsespätzle.“',
       task='Gib Liam die Information auf Englisch weiter. Erkläre „Maultaschen“ kurz.',
       model='We are having Maultaschen with potato salad – they are a kind of big pasta pockets filled with meat and spinach, a typical dish from our region. If you don’t eat meat, my mum will make you Käsespätzle, that’s noodles with cheese.',
       keys=['Maultaschen + potato salad', 'explain: pasta pockets with meat', 'if no meat: cheese noodles']),
  dict(r='en-de', sit='Du bist mit deinem Opa in London. Er versteht die Ansage im Museum nicht.',
       src='"The museum will close in thirty minutes. The café on the ground floor is already closed, but the gift shop is open until six."',
       task='Erkläre deinem Opa auf Deutsch, was gesagt wurde.',
       model='Das Museum schließt in einer halben Stunde. Das Café im Erdgeschoss hat schon zu, aber der Souvenirladen ist bis 18 Uhr offen.',
       keys=['schließt in 30 Minuten', 'Café schon geschlossen', 'Laden bis 18 Uhr offen']),
  dict(r='de-en', sit='Beim Praktikum in einer Autowerkstatt ruft ein englischsprachiger Kunde an. Dein Chef sagt dir, was du antworten sollst.',
       src='Chef: „Sag ihm, das Auto ist erst morgen Nachmittag fertig, weil wir ein Ersatzteil bestellen mussten. Die Reparatur kostet ungefähr 250 Euro.“',
       task='Gib die Information höflich auf Englisch weiter.',
       model='I’m sorry, but your car will only be ready tomorrow afternoon, because we had to order a spare part. The repair will cost about 250 euros.',
       keys=['ready tomorrow afternoon', 'had to order a part', 'about 250 euros', 'polite (I’m sorry …)']),
  dict(r='en-de', sit='Deine kleine Schwester will ein Online-Spiel kaufen. Auf der Seite steht ein Hinweis auf Englisch.',
       src='"Players under 16 need permission from a parent. In-game purchases are possible. Your account will be deleted if you share your password."',
       task='Erkläre deiner Schwester auf Deutsch, worauf sie achten muss.',
       model='Unter 16 brauchst du die Erlaubnis von Mama oder Papa. Im Spiel kann man Sachen kaufen – pass auf, das kostet echtes Geld. Und gib dein Passwort nie weiter, sonst wird dein Konto gelöscht.',
       keys=['unter 16: Eltern müssen zustimmen', 'Käufe im Spiel möglich', 'Passwort nicht weitergeben, sonst Konto weg']),
  dict(r='de-en', sit='Eine Austauschschülerin aus Kanada fragt dich nach dem Schulfest. Der Zettel ist auf Deutsch.',
       src='„Schulfest am Freitag, 15 bis 19 Uhr. Die Klassen 10 verkaufen Kuchen, der Erlös geht an ein Tierheim. Bitte eigenen Becher mitbringen.“',
       task='Erkläre ihr auf Englisch das Wichtigste.',
       model='The school party is on Friday from three to seven. The year 10 classes are selling cakes, and the money goes to an animal shelter. You should bring your own cup.',
       keys=['Friday 3–7 pm', 'year 10 sells cakes', 'money for an animal shelter', 'bring your own cup']),
  dict(r='en-de', sit='Deine Eltern buchen ein Hotel in Edinburgh und bitten dich, die E-Mail zu erklären.',
       src='"Check-in is from 3 pm. Breakfast is not included but can be booked for £12 per person. Free parking is available, but please reserve a space in advance."',
       task='Erkläre deinen Eltern auf Deutsch die wichtigsten Informationen.',
       model='Einchecken kann man ab 15 Uhr. Frühstück ist nicht dabei, man kann es für 12 Pfund pro Person dazubuchen. Parken ist kostenlos, aber man muss den Platz vorher reservieren.',
       keys=['Check-in ab 15 Uhr', 'Frühstück nicht inklusive, 12 £ pro Person', 'Parken gratis, vorher reservieren']),
  dict(r='de-en', sit='In der Apotheke: Ein englischsprachiger Tourist braucht etwas gegen Kopfschmerzen. Die Apothekerin sagt etwas auf Deutsch.',
       src='„Nehmen Sie höchstens drei Tabletten am Tag, immer mit viel Wasser und nach dem Essen. Wenn es in drei Tagen nicht besser ist, gehen Sie bitte zum Arzt.“',
       task='Gib es dem Touristen auf Englisch weiter.',
       model='Take no more than three tablets a day, always with a lot of water and after a meal. If it isn’t better in three days, please see a doctor.',
       keys=['max. 3 tablets a day', 'with water, after eating', 'see a doctor if not better in 3 days']),
  dict(r='en-de', sit='Im Videochat mit der Partnerklasse in New York: Deine Lehrerin versteht den Schüler nicht ganz.',
       src='"At our school we have a lot of clubs after class. I’m in the robotics club – we meet twice a week and this year we are going to a competition in Boston."',
       task='Fasse für deine Lehrerin auf Deutsch zusammen, was er erzählt.',
       model='An seiner Schule gibt es nach dem Unterricht viele AGs. Er ist in der Robotik-AG, die trifft sich zweimal pro Woche, und dieses Jahr fahren sie zu einem Wettbewerb nach Boston.',
       keys=['viele AGs nach dem Unterricht', 'Robotik-AG, 2× pro Woche', 'Wettbewerb in Boston']),
  dict(r='de-en', sit='Dein englischer Brieffreund fragt im Chat, was ihr am Wochenende macht. Dein Vater ruft aus der Küche.',
       src='Vater: „Sag ihm, wir fahren am Samstag an den Bodensee, wenn das Wetter gut ist. Er kann gern mitkommen, aber er braucht Badesachen.“',
       task='Antworte dem Brieffreund auf Englisch.',
       model='On Saturday we are going to Lake Constance if the weather is good. You are welcome to come with us – just bring your swimming things.',
       keys=['Saturday: Lake Constance', 'only if the weather is good', 'he is invited', 'bring swimming things']),
  dict(r='en-de', sit='Am Flughafen in Manchester: Deine Tante versteht die Durchsage nicht.',
       src='"Passengers on flight LH 947 to Stuttgart: due to fog, boarding is delayed by forty-five minutes. Please stay near gate 12."',
       task='Erkläre deiner Tante auf Deutsch, was los ist.',
       model='Unser Flug nach Stuttgart hat wegen Nebel 45 Minuten Verspätung beim Einsteigen. Wir sollen in der Nähe von Gate 12 bleiben.',
       keys=['Flug nach Stuttgart', 'Einsteigen 45 Minuten später, wegen Nebel', 'bei Gate 12 bleiben']),
]

# Schriftliche Prüfung: Schreibaufgaben im Stil „Writing“ (Wahl zwischen Aufgaben; eigene Aufgaben)
WRITING = [
  dict(t='An e-mail to a host family', d='Du machst ein Praktikum in England und wohnst bei einer Gastfamilie. Schreib eine E-Mail: stell dich vor, nenne deine Hobbys, frag nach zwei Dingen (z. B. Essen, Schulweg). ca. 120 Wörter.',
       words=['would like', 'looking forward', 'hobbies', 'question']),
  dict(t='Social media – good or bad?', d='Schreib einen Kommentar für die Schülerzeitung eurer Partnerschule: Nenne Vor- und Nachteile von sozialen Netzwerken und deine Meinung. ca. 150 Wörter.',
       words=['on the one hand', 'on the other hand', 'in my opinion', 'for example']),
  dict(t='My dream job', d='Beschreibe deinen Traumberuf: Was macht man dort? Warum passt er zu dir? Was musst du dafür tun? ca. 120 Wörter.',
       words=['I would like to', 'because', 'skills', 'apprenticeship']),
  dict(t='A day I will never forget', d='Erzähle von einem besonderen Tag (echt oder ausgedacht) im simple past. ca. 150 Wörter.',
       words=['suddenly', 'when', 'after that', 'finally']),
]
