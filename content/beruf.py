# English Trail – Berufliche Schulen (14.11.2026, Version 0.39, AUTOPLAN 16)
# Berufsschule, Berufsfachschule, Berufskolleg: Grundpakete Berufsenglisch für alle + je ein Berufsfeld.
# Klasse 11/12/13 = 1./2./3. Ausbildungsjahr. Ausrichtung am KMK-Fremdsprachenzertifikat (Rezeption, Produktion,
# Mediation, Interaktion) – eigene Texte, keine Verlagsinhalte. IDs nur anhängen, nie ändern.
# 'field' = Berufsfeld (leer = Grundpaket für alle), 'bs' = 1 kennzeichnet Pakete der beruflichen Schulen.

BS_PACKS = []
FIELDS = [('tech', 'Technik und Handwerk', 'bst'), ('wirt', 'Wirtschaft und Verwaltung', 'bsw'),
          ('ges', 'Gesundheit und Pflege', 'bsg'), ('gast', 'Gastronomie und Hotel', 'bsh')]


def K(**k):
    k.setdefault('grade', 11); k.setdefault('field', ''); k['bs'] = 1
    BS_PACKS.append(k)


K(id='b_apply', ico='📄', name='Applying for a job', title='Bewerbung und Vorstellungsgespräch',
  can='Ich kann mich auf Englisch bewerben, meinen Lebenslauf erklären und im Vorstellungsgespräch antworten.',
  tip='Im Lebenslauf (CV) und im Gespräch: Erfahrungen im simple past („I worked …“), was bis heute gilt im present perfect („I have been an apprentice since 2025“).',
  fact='In Großbritannien und den USA kommt in den Lebenslauf meist kein Foto und kein Geburtsdatum – so soll niemand benachteiligt werden.',
  words="""application | Bewerbung
to apply for | sich bewerben um
CV (curriculum vitae) | Lebenslauf
cover letter | Anschreiben
job interview | Vorstellungsgespräch
apprenticeship | Ausbildung
apprentice | Auszubildende(r)
qualification | Abschluss / Qualifikation
work experience | Berufserfahrung / Praktikum
skills | Fähigkeiten
reliable | zuverlässig
strength | Stärke
weakness | Schwäche
to be responsible for | verantwortlich sein für
employer | Arbeitgeber(in)
salary | Gehalt""",
  sentences=[('I am writing to apply for the position of trainee in your company.', 'Hiermit bewerbe ich mich um die Stelle als Auszubildende(r) in Ihrem Unternehmen.'),
             ('I have been an apprentice at a car repair shop since September.', 'Seit September bin ich Auszubildender in einer Autowerkstatt.'),
             ('During my work experience, I was responsible for the stock.', 'Während meines Praktikums war ich für das Lager verantwortlich.'),
             ('One of my strengths is that I am very reliable.', 'Eine meiner Stärken ist, dass ich sehr zuverlässig bin.'),
             ('Please find my CV attached.', 'Meinen Lebenslauf finden Sie im Anhang.'),
             ('I look forward to hearing from you.', 'Ich freue mich darauf, von Ihnen zu hören.')],
  scene=dict(intro='Videogespräch mit Ms Taylor von einer Firma in Dublin – du bewirbst dich um ein Auslandspraktikum.',
             steps=[dict(npc=('Thank you for your application. Could you tell me a bit about yourself?', 'Danke für Ihre Bewerbung. Können Sie etwas über sich erzählen?'),
                         opts=[("Sure. I'm in my second year of an apprenticeship, and I've always enjoyed working with people.", 'Gern. Ich bin im zweiten Ausbildungsjahr und habe schon immer gern mit Menschen gearbeitet.', 1), ('I am 19 and I am liking my job very much since two years.', 'Ich bin 19 und mag meinen Job seit zwei Jahren (fehlerhaft).', 0)],
                         hint='Kurz vorstellen: present perfect für „schon immer / seit“.'),
                    dict(npc=('What would you say is your greatest strength?', 'Was ist Ihre größte Stärke?'),
                         opts=[("I'm very reliable – I've never been late in two years.", 'Ich bin sehr zuverlässig – ich war in zwei Jahren nie zu spät.', 1), ('I have no weaknesses.', 'Ich habe keine Schwächen.', 0)],
                         hint='Stärke nennen + Beispiel.'),
                    dict(npc=('Great. Do you have any questions for us?', 'Prima. Haben Sie Fragen an uns?'),
                         opts=[('Yes – what would a typical day look like for an intern?', 'Ja – wie sähe ein typischer Tag für einen Praktikanten aus?', 1), ('No. When do I get the money?', 'Nein. Wann bekomme ich das Geld?', 0)],
                         hint='Interesse zeigen mit einer Frage zur Arbeit.')],
             outro='Ms Taylor lächelt: „We’ll be in touch by Friday.“ Eine Woche später kommt die Zusage.'))

K(id='b_phone', ico='☎️', name='Business calls', title='Telefonieren im Beruf',
  can='Ich kann geschäftliche Anrufe annehmen, weiterverbinden, Nachrichten aufnehmen und Termine vereinbaren.',
  tip='Höflich am Telefon: „Could you …?“, „Would you like to leave a message?“, „I’ll put you through.“ Buchstabieren mit dem Alphabet üben!',
  fact='Am Telefon meldet man sich auf Englisch mit Firmenname und eigenem Namen: „Good morning, Miller Electrics, Anna speaking. How can I help you?“',
  words="""to call back | zurückrufen
to put through | durchstellen / verbinden
to hold the line | am Apparat bleiben
extension | Durchwahl
to leave a message | eine Nachricht hinterlassen
to take a message | etwas ausrichten
to spell | buchstabieren
appointment | Termin
to arrange | vereinbaren
to confirm | bestätigen
to cancel | absagen
available | erreichbar / verfügbar
engaged / busy | besetzt
voicemail | Mailbox
urgent | dringend
I'm afraid … | Leider …""",
  sentences=[("Good morning, Miller Electrics, Anna speaking. How can I help you?", 'Guten Morgen, Miller Electrics, Anna am Apparat. Wie kann ich Ihnen helfen?'),
             ("I'm afraid Mr Smith is not available at the moment.", 'Leider ist Herr Smith im Moment nicht erreichbar.'),
             ('Would you like to leave a message?', 'Möchten Sie eine Nachricht hinterlassen?'),
             ('Could you spell your surname, please?', 'Könnten Sie bitte Ihren Nachnamen buchstabieren?'),
             ("Please hold the line. I'll put you through.", 'Bitte bleiben Sie dran. Ich verbinde Sie.'),
             ("I'm calling to confirm our appointment on Thursday at ten.", 'Ich rufe an, um unseren Termin am Donnerstag um zehn zu bestätigen.')],
  scene=dict(intro='Du sitzt am Empfang deines Ausbildungsbetriebs. Ein Kunde aus England ruft an.',
             steps=[dict(npc=('Hello, this is David Brown. Can I speak to Mrs Weber, please?', 'Hallo, hier ist David Brown. Kann ich bitte Frau Weber sprechen?'),
                         opts=[("I'm afraid she's in a meeting. Would you like to leave a message?", 'Sie ist leider in einer Besprechung. Möchten Sie eine Nachricht hinterlassen?', 1), ('No, she is not here. Bye.', 'Nein, sie ist nicht da. Tschüss.', 0)],
                         hint='Höflich absagen + Hilfe anbieten.'),
                    dict(npc=('Yes, please. Could she call me back today? It\'s urgent.', 'Ja, bitte. Kann sie mich heute zurückrufen? Es ist dringend.'),
                         opts=[('Of course. Could you spell your surname and give me your number?', 'Natürlich. Könnten Sie Ihren Nachnamen buchstabieren und mir Ihre Nummer geben?', 1), ('Of course. She call you tomorrow maybe.', 'Natürlich. Sie ruft vielleicht morgen an (fehlerhaft).', 0)],
                         hint='Daten aufnehmen: Name buchstabieren lassen, Nummer.'),
                    dict(npc=("It's B-R-O-W-N, and my number is 0044 20 7946 0321.", 'B-R-O-W-N, und meine Nummer ist 0044 20 7946 0321.'),
                         opts=[("Thank you, Mr Brown. I'll make sure she gets the message.", 'Danke, Herr Brown. Ich sorge dafür, dass sie die Nachricht bekommt.', 1), ('OK. Is that all?', 'OK. War es das?', 0)],
                         hint='Zusage machen: „I’ll make sure …“')],
             outro='Frau Weber ruft Mr Brown eine Stunde später zurück – der Auftrag ist gerettet.'))

K(id='b_mail', ico='📧', name='Business e-mails', title='Geschäftliche E-Mails',
  can='Ich kann geschäftliche E-Mails mit passender Anrede, klarem Anliegen und höflichem Schluss schreiben.',
  tip='Aufbau: Anrede („Dear Ms Taylor,“) – Anlass („I am writing to …“) – Anliegen – Schluss („Kind regards“). Unbekannter Name: „Dear Sir or Madam,“',
  fact='„Yours sincerely“ schreibt man, wenn man den Namen kennt, „Yours faithfully“ bei „Dear Sir or Madam“. In E-Mails ist „Kind regards“ heute am häufigsten.',
  words="""Dear Sir or Madam | Sehr geehrte Damen und Herren
regarding | bezüglich
enquiry | Anfrage
to attach | anhängen
attachment | Anhang
order | Bestellung / Auftrag
delivery | Lieferung
invoice | Rechnung
to apologise for | sich entschuldigen für
inconvenience | Unannehmlichkeit
as soon as possible | so bald wie möglich
to reply | antworten
further information | weitere Informationen
Kind regards | Mit freundlichen Grüßen
in advance | im Voraus
deadline | Frist / Termin""",
  sentences=[('I am writing regarding your enquiry of 3 May.', 'Ich schreibe Ihnen bezüglich Ihrer Anfrage vom 3. Mai.'),
             ('Please find the invoice attached.', 'Die Rechnung finden Sie im Anhang.'),
             ('We apologise for any inconvenience caused.', 'Wir entschuldigen uns für eventuelle Unannehmlichkeiten.'),
             ('Could you please send us further information?', 'Könnten Sie uns bitte weitere Informationen schicken?'),
             ('The delivery will arrive by Friday at the latest.', 'Die Lieferung kommt spätestens am Freitag an.'),
             ('Thank you in advance for your help.', 'Vielen Dank im Voraus für Ihre Hilfe.')],
  scene=dict(intro='Deine Chefin bittet dich, eine E-Mail an einen Lieferanten in Manchester zu schreiben. Du wählst die passenden Sätze.',
             steps=[dict(npc=('How do you start an e-mail to someone whose name you don\'t know?', 'Wie beginnt man eine E-Mail an jemanden, dessen Namen man nicht kennt?'),
                         opts=[('Dear Sir or Madam,', 'Sehr geehrte Damen und Herren,', 1), ('Hey you,', 'Hey du,', 0)],
                         hint='Formelle Anrede ohne Namen.'),
                    dict(npc=('The delivery is late. How do you say that politely?', 'Die Lieferung ist zu spät. Wie sagt man das höflich?'),
                         opts=[('Unfortunately, we have not received the order yet. Could you please check the status?', 'Leider haben wir die Bestellung noch nicht erhalten. Könnten Sie bitte den Stand prüfen?', 1), ('Where is our stuff? Send it now!', 'Wo ist unser Zeug? Schicken Sie es sofort!', 0)],
                         hint='Höflich: „Unfortunately …“ + „Could you please …?“'),
                    dict(npc=('And how do you end the e-mail?', 'Und wie beendet man die E-Mail?'),
                         opts=[('Thank you in advance. Kind regards, …', 'Vielen Dank im Voraus. Mit freundlichen Grüßen, …', 1), ('Bye!!! xoxo', 'Tschüss!!! Küsschen', 0)],
                         hint='Höflicher Schluss.')],
             outro='Am nächsten Morgen antwortet der Lieferant: Die Ware ist unterwegs – mit Entschuldigung.'))

K(id='b_cust', ico='🤝', name='Customer service', title='Kundengespräch und Beschwerden',
  can='Ich kann Kunden beraten, auf Beschwerden reagieren und Lösungen anbieten.',
  tip='Beschwerden: zuhören, entschuldigen, Lösung anbieten. „I’m sorry to hear that.“ – „Let me see what I can do.“ – „Would a replacement be OK?“',
  fact='In englischsprachigen Ländern gilt: Erst Verständnis zeigen, dann die Lösung. Ein freundliches „I completely understand“ wirkt oft Wunder.',
  words="""customer | Kunde / Kundin
complaint | Beschwerde
to complain about | sich beschweren über
faulty | fehlerhaft / defekt
refund | Rückerstattung
replacement | Ersatz
receipt | Kassenbon / Quittung
warranty | Garantie
to deal with | sich kümmern um
to recommend | empfehlen
discount | Rabatt
in stock | vorrätig
out of stock | ausverkauft
to exchange | umtauschen
satisfied | zufrieden
I'm sorry to hear that | Das tut mir leid""",
  sentences=[("I'm sorry to hear that. Let me see what I can do.", 'Das tut mir leid. Ich schaue, was ich tun kann.'),
             ('Do you have the receipt with you?', 'Haben Sie den Kassenbon dabei?'),
             ('We can offer you a replacement or a refund.', 'Wir können Ihnen Ersatz oder eine Rückerstattung anbieten.'),
             ("I'm afraid this model is out of stock at the moment.", 'Leider ist dieses Modell gerade ausverkauft.'),
             ('I would recommend this one – it has a two-year warranty.', 'Ich würde dieses empfehlen – es hat zwei Jahre Garantie.'),
             ('Is there anything else I can help you with?', 'Kann ich Ihnen sonst noch helfen?')],
  scene=dict(intro='Eine Kundin aus Kanada kommt verärgert in euren Laden. Ihr neuer Föhn funktioniert nicht.',
             steps=[dict(npc=('I bought this hairdryer here last week and it already doesn\'t work!', 'Ich habe den Föhn letzte Woche hier gekauft und er funktioniert schon nicht mehr!'),
                         opts=[("I'm sorry to hear that. Do you have the receipt with you?", 'Das tut mir leid. Haben Sie den Kassenbon dabei?', 1), ('Not my problem. You broke it.', 'Nicht mein Problem. Sie haben ihn kaputt gemacht.', 0)],
                         hint='Verständnis zeigen, dann nach dem Beleg fragen.'),
                    dict(npc=('Yes, here it is. What can you do?', 'Ja, hier ist er. Was können Sie tun?'),
                         opts=[('We can exchange it for a new one or give you a refund – whichever you prefer.', 'Wir können ihn umtauschen oder Ihnen das Geld zurückgeben – wie es Ihnen lieber ist.', 1), ('We can do nothing for you.', 'Wir können nichts für Sie tun.', 0)],
                         hint='Lösungen anbieten.'),
                    dict(npc=("A new one, please. Thank you – that's very kind.", 'Einen neuen, bitte. Danke – das ist sehr nett.'),
                         opts=[("You're welcome. Is there anything else I can help you with?", 'Gern geschehen. Kann ich Ihnen sonst noch helfen?', 1), ('Yes, yes. Go now.', 'Ja, ja. Gehen Sie jetzt.', 0)],
                         hint='Freundlicher Abschluss.')],
             outro='Die Kundin geht zufrieden und schreibt später eine Fünf-Sterne-Bewertung.'))

K(id='b_safe', ico='⛑️', name='Health and safety at work', title='Arbeitssicherheit',
  can='Ich kann Sicherheitsregeln verstehen und erklären, Gefahren melden und bei einem Unfall Hilfe holen.',
  tip='Regeln: „You must wear …“, „You mustn’t …“ (= verboten!), „Make sure you …“. Warnungen kurz und klar: „Watch out!“, „Careful – the floor is wet.“',
  fact='Achtung, falscher Freund: „mustn’t“ heißt „darf nicht“, nicht „muss nicht“. „Muss nicht“ heißt „don’t have to“ oder „needn’t“.',
  words="""safety | Sicherheit
hazard | Gefahr / Gefahrenquelle
protective clothing | Schutzkleidung
safety goggles | Schutzbrille
gloves | Handschuhe
hard hat | Schutzhelm
fire exit | Notausgang
fire extinguisher | Feuerlöscher
first aid kit | Verbandskasten
injury | Verletzung
to injure | verletzen
to report | melden
slippery | rutschig
to switch off | ausschalten
emergency | Notfall
to prevent | verhindern""",
  sentences=[('You must wear safety goggles when you use this machine.', 'Du musst eine Schutzbrille tragen, wenn du diese Maschine benutzt.'),
             ("You mustn't block the fire exit.", 'Du darfst den Notausgang nicht versperren.'),
             ('Make sure you switch off the power before you repair it.', 'Schalte unbedingt den Strom aus, bevor du es reparierst.'),
             ('Careful – the floor is slippery!', 'Vorsicht – der Boden ist rutschig!'),
             ('Every accident must be reported to your supervisor.', 'Jeder Unfall muss deinem Vorgesetzten gemeldet werden.'),
             ('The first aid kit is next to the door.', 'Der Verbandskasten ist neben der Tür.')],
  scene=dict(intro='Ein neuer Kollege aus Irland beginnt heute in deinem Betrieb. Du zeigst ihm die Sicherheitsregeln.',
             steps=[dict(npc=('Do I have to wear these goggles all the time?', 'Muss ich die Brille die ganze Zeit tragen?'),
                         opts=[('Yes, you must wear them whenever the machines are running.', 'Ja, du musst sie tragen, sobald die Maschinen laufen.', 1), ("No, you mustn't wear them.", 'Nein, du darfst sie nicht tragen.', 0)],
                         hint='must = muss; mustn’t = darf nicht.'),
                    dict(npc=('What should I do if someone gets injured?', 'Was soll ich tun, wenn sich jemand verletzt?'),
                         opts=[('Get the first aid kit, call the first aider and report the accident.', 'Hol den Verbandskasten, ruf den Ersthelfer und melde den Unfall.', 1), ('Wait until the end of the shift.', 'Bis zum Schichtende warten.', 0)],
                         hint='Klare Schritte im Imperativ.'),
                    dict(npc=('And where is the nearest fire exit?', 'Und wo ist der nächste Notausgang?'),
                         opts=[("It's at the end of the hall, next to the fire extinguisher. Never block it.", 'Am Ende der Halle, neben dem Feuerlöscher. Niemals zustellen.', 1), ('Fire? There is no fire.', 'Feuer? Es brennt doch nicht.', 0)],
                         hint='Ort beschreiben + Regel.')],
             outro='Dein Kollege bedankt sich: „Thanks – that was really clear.“'))

K(id='b_tech', field='tech', ico='🔧', name='In the workshop', title='Technik und Werkstatt',
  can='Ich kann Werkzeuge, Materialien und Arbeitsschritte beschreiben und einen Fehler erklären.',
  tip='Arbeitsschritte: „First, … Then, … After that, … Finally, …“ Fehler beschreiben: „It doesn’t work.“, „It’s broken / leaking / loose.“',
  fact='In Großbritannien und Irland fährt man links – deshalb sitzen Lenkrad und Pedale bei Autos von dort auf der rechten Seite.',
  words="""tool | Werkzeug
screwdriver | Schraubenzieher
spanner | Schraubenschlüssel
drill | Bohrmaschine
screw | Schraube
cable | Kabel
to measure | messen
to install | einbauen / installieren
to repair | reparieren
to replace | austauschen
spare part | Ersatzteil
to leak | undicht sein / tropfen
loose | locker
broken | kaputt
manual | Bedienungsanleitung
to check | prüfen""",
  sentences=[('First, switch off the power. Then remove the cover.', 'Zuerst den Strom ausschalten. Dann die Abdeckung abnehmen.'),
             ('The pipe under the sink is leaking.', 'Das Rohr unter dem Waschbecken ist undicht.'),
             ('We need to replace this part – it is broken.', 'Wir müssen dieses Teil austauschen – es ist kaputt.'),
             ('Could you pass me the screwdriver, please?', 'Kannst du mir bitte den Schraubenzieher geben?'),
             ('The spare part will be delivered tomorrow.', 'Das Ersatzteil wird morgen geliefert.'),
             ('Check the manual before you install the new unit.', 'Lies die Anleitung, bevor du das neue Gerät einbaust.')],
  scene=dict(intro='Auf Montage in Belfast: Ein Kunde ruft dich zu einer Maschine, die nicht mehr läuft.',
             steps=[dict(npc=("The machine stopped working this morning. Can you have a look?", 'Die Maschine ist heute Morgen ausgefallen. Können Sie mal schauen?'),
                         opts=[('Of course. First, I need to switch off the power and check the cables.', 'Natürlich. Zuerst muss ich den Strom ausschalten und die Kabel prüfen.', 1), ('Of course. I hit it with a hammer.', 'Natürlich. Ich haue mit dem Hammer drauf.', 0)],
                         hint='Arbeitsschritte: „First, …“'),
                    dict(npc=('So what is the problem?', 'Und was ist das Problem?'),
                         opts=[('One cable is loose and a part is broken. We need to replace it.', 'Ein Kabel ist locker und ein Teil ist kaputt. Wir müssen es austauschen.', 1), ('Problem is big. Machine is dead.', 'Problem ist groß. Maschine ist tot.', 0)],
                         hint='Fehler beschreiben: loose, broken, replace.'),
                    dict(npc=('How long will it take?', 'Wie lange dauert das?'),
                         opts=[("The spare part will arrive tomorrow, so it'll be ready by noon.", 'Das Ersatzteil kommt morgen, also ist sie bis mittags fertig.', 1), ('It takes long time maybe.', 'Es dauert vielleicht lange Zeit (fehlerhaft).', 0)],
                         hint='Zeitangabe mit will.')],
             outro='Am nächsten Mittag läuft die Maschine wieder. Der Kunde bestellt gleich die Wartung fürs nächste Jahr.'))

K(id='b_off', field='wirt', ico='💼', name='In the office', title='Büro und Wirtschaft',
  can='Ich kann über Büroabläufe, Bestellungen, Zahlen und Termine sprechen.',
  tip='Zahlen sicher sagen: „1,5 Mio.“ = „1.5 million“ (Punkt statt Komma!), „3.000“ = „3,000“. Termine: „on Monday“, „at 3 pm“, „by Friday“ (= bis spätestens).',
  fact='Im Englischen trennt das Komma Tausender und der Punkt Dezimalstellen – genau umgekehrt wie im Deutschen.',
  words="""meeting | Besprechung
agenda | Tagesordnung
schedule | Zeitplan
colleague | Kollege / Kollegin
department | Abteilung
to order | bestellen
to deliver | liefern
quote | Angebot (Preis)
price list | Preisliste
payment | Zahlung
to pay by bank transfer | per Überweisung zahlen
turnover | Umsatz
profit | Gewinn
to increase | steigen / erhöhen
to decrease | sinken / senken
figures | Zahlen""",
  sentences=[('The meeting has been moved to Thursday at 2 pm.', 'Die Besprechung wurde auf Donnerstag 14 Uhr verschoben.'),
             ('Could you send us a quote for 500 units?', 'Könnten Sie uns ein Angebot für 500 Stück schicken?'),
             ('Payment is due within 30 days.', 'Die Zahlung ist innerhalb von 30 Tagen fällig.'),
             ('Our turnover increased by 12 percent last year.', 'Unser Umsatz ist letztes Jahr um 12 Prozent gestiegen.'),
             ('I will forward your e-mail to the sales department.', 'Ich leite Ihre E-Mail an die Vertriebsabteilung weiter.'),
             ('The figures show that costs decreased slightly.', 'Die Zahlen zeigen, dass die Kosten leicht gesunken sind.')],
  scene=dict(intro='Videokonferenz mit dem Team eurer Partnerfirma in Leeds. Teamleiterin Jess fragt nach den aktuellen Zahlen.',
             steps=[dict(npc=('How were the sales figures last month?', 'Wie waren die Verkaufszahlen letzten Monat?'),
                         opts=[('Sales increased by 8 percent, mainly because of our new online shop.', 'Der Absatz stieg um 8 Prozent, vor allem wegen unseres neuen Onlineshops.', 1), ('The sales were 8 percent more bigger.', 'Die Verkäufe waren 8 Prozent mehr größer (fehlerhaft).', 0)],
                         hint='Entwicklung: increase by + Prozent, Grund mit because of.'),
                    dict(npc=("Great. Can you send me the details by Friday?", 'Super. Können Sie mir die Details bis Freitag schicken?'),
                         opts=[("Sure, I'll send you the report by Friday morning.", 'Klar, ich schicke Ihnen den Bericht bis Freitagmorgen.', 1), ('Sure, I send it until Friday.', 'Klar, ich schicke es bis Freitag (fehlerhaft: until).', 0)],
                         hint='„by Friday“ = spätestens Freitag; „until“ = andauernd bis.'),
                    dict(npc=('Perfect. Shall we schedule the next meeting?', 'Perfekt. Sollen wir das nächste Treffen planen?'),
                         opts=[('How about Tuesday the 14th at 10 am?', 'Wie wäre Dienstag, der 14., um 10 Uhr?', 1), ('Tuesday at 10 o\'clock in the evening in the night.', 'Dienstag um 10 Uhr abends in der Nacht.', 0)],
                         hint='Vorschlag: „How about …?“')],
             outro='Jess bedankt sich – dein Bericht wird in der nächsten Runde allen gezeigt.'))

K(id='b_care', field='ges', ico='🩺', name='Health and care', title='Gesundheit und Pflege',
  can='Ich kann mit Patientinnen und Patienten freundlich sprechen, nach Beschwerden fragen und Abläufe erklären.',
  tip='Fragen nach Beschwerden: „Where does it hurt?“, „How long have you had the pain?“ (present perfect!). Beruhigen: „Don’t worry, …“, „I’m going to …“',
  fact='In Großbritannien heißt das staatliche Gesundheitssystem NHS (National Health Service) – die Behandlung ist dort für alle kostenlos.',
  words="""patient | Patient(in)
nurse | Pflegekraft / Krankenschwester
pain | Schmerz
to hurt | wehtun
to feel dizzy | sich schwindelig fühlen
blood pressure | Blutdruck
temperature | Temperatur / Fieber
medication | Medikamente
prescription | Rezept
treatment | Behandlung
to lie down | sich hinlegen
to take a deep breath | tief einatmen
swollen | geschwollen
allergic to | allergisch gegen
appointment | Termin
to recover | sich erholen""",
  sentences=[('Where does it hurt?', 'Wo tut es weh?'),
             ('How long have you had the pain?', 'Seit wann haben Sie die Schmerzen?'),
             ("I'm going to check your blood pressure now.", 'Ich messe jetzt Ihren Blutdruck.'),
             ('Are you allergic to any medication?', 'Sind Sie gegen Medikamente allergisch?'),
             ('Please lie down and take a deep breath.', 'Bitte legen Sie sich hin und atmen Sie tief ein.'),
             ("Don't worry – you will recover quickly.", 'Keine Sorge – Sie werden sich schnell erholen.')],
  scene=dict(intro='Ein Tourist aus Australien kommt mit Knieschmerzen in die Physiotherapie-Praxis, in der du deine Ausbildung machst.',
             steps=[dict(npc=('Hi, my knee really hurts. I hurt it while hiking.', 'Hallo, mein Knie tut sehr weh. Ich habe es mir beim Wandern verletzt.'),
                         opts=[("I'm sorry to hear that. How long have you had the pain?", 'Das tut mir leid. Seit wann haben Sie die Schmerzen?', 1), ('How long do you have the pain since?', 'Wie lange haben Sie die Schmerzen seit? (fehlerhaft)', 0)],
                         hint='„How long have you had …?“ – present perfect.'),
                    dict(npc=('Since Monday. It\'s a bit swollen too.', 'Seit Montag. Es ist auch etwas geschwollen.'),
                         opts=[("Please lie down. I'm going to have a look at your knee.", 'Bitte legen Sie sich hin. Ich schaue mir Ihr Knie an.', 1), ('Lie! I look knee.', 'Liegen! Ich schauen Knie.', 0)],
                         hint='Ablauf ankündigen: „I’m going to …“'),
                    dict(npc=('Is it serious?', 'Ist es schlimm?'),
                         opts=[("Don't worry. With some exercises and rest, you should recover in a few weeks.", 'Keine Sorge. Mit ein paar Übungen und Schonung sollten Sie sich in ein paar Wochen erholen.', 1), ('Yes. Very bad. Maybe never walking.', 'Ja. Sehr schlimm. Vielleicht nie mehr laufen.', 0)],
                         hint='Beruhigen: „Don’t worry …“')],
             outro='Der Patient lacht erleichtert: „Cheers, mate – you’ve been a great help!“'))

K(id='b_gast', field='gast', ico='🍽️', name='Hospitality', title='Gastronomie und Hotel',
  can='Ich kann Gäste begrüßen, Bestellungen aufnehmen, Speisen erklären und auf Wünsche eingehen.',
  tip='Höflich anbieten: „Would you like …?“, „Can I get you anything else?“ Gerichte erklären: „It’s made with …“, „It comes with …“',
  fact='In Großbritannien bestellt man im Pub an der Theke und bezahlt sofort – Bedienung am Tisch gibt es dort meist nur beim Essen.',
  words="""guest | Gast
reservation | Reservierung
to book a table | einen Tisch reservieren
starter | Vorspeise
main course | Hauptgericht
dessert | Nachtisch
side dish | Beilage
vegetarian | vegetarisch
vegan | vegan
gluten-free | glutenfrei
to recommend | empfehlen
the bill | die Rechnung
tip | Trinkgeld
to check in | einchecken
double room | Doppelzimmer
reception | Rezeption""",
  sentences=[('Good evening. Do you have a reservation?', 'Guten Abend. Haben Sie reserviert?'),
             ('Would you like something to drink first?', 'Möchten Sie zuerst etwas trinken?'),
             ("Today's special is fish – it comes with potatoes and salad.", 'Das Tagesgericht ist Fisch – dazu gibt es Kartoffeln und Salat.'),
             ('We have several vegetarian and gluten-free dishes.', 'Wir haben mehrere vegetarische und glutenfreie Gerichte.'),
             ('Can I get you anything else?', 'Darf ich Ihnen noch etwas bringen?'),
             ("Here's your key – your room is on the second floor.", 'Hier ist Ihr Schlüssel – Ihr Zimmer ist im zweiten Stock.')],
  scene=dict(intro='Abendservice im Hotelrestaurant: Ein Paar aus Schottland setzt sich an deinen Tisch.',
             steps=[dict(npc=("Hello! What would you recommend tonight?", 'Hallo! Was würden Sie heute Abend empfehlen?'),
                         opts=[("I'd recommend the trout – it comes with potatoes and fresh vegetables.", 'Ich würde die Forelle empfehlen – dazu gibt es Kartoffeln und frisches Gemüse.', 1), ('Everything is good. Choose.', 'Alles ist gut. Wählen Sie.', 0)],
                         hint='Empfehlen + Gericht erklären: „It comes with …“'),
                    dict(npc=('My wife is vegan. Is there anything for her?', 'Meine Frau ist Veganerin. Gibt es etwas für sie?'),
                         opts=[('Yes, our curry is vegan, and the chef can make it without nuts if needed.', 'Ja, unser Curry ist vegan, und der Koch kann es bei Bedarf ohne Nüsse machen.', 1), ('Vegan? She can eat the salad without the meat.', 'Vegan? Sie kann den Salat ohne Fleisch essen.', 0)],
                         hint='Auf Wünsche eingehen.'),
                    dict(npc=("Lovely. And could we have the bill later, please?", 'Schön. Und könnten wir später bitte die Rechnung haben?'),
                         opts=[("Of course. Just let me know when you're ready.", 'Natürlich. Sagen Sie einfach Bescheid, wenn Sie so weit sind.', 1), ('No, pay now.', 'Nein, jetzt zahlen.', 0)],
                         hint='Höflich: „Just let me know …“')],
             outro='Das Paar lobt den Abend – und lässt ein großzügiges Trinkgeld da.'))
