# English Trail – Alltags-Pakete für die Ansicht „Nach Thema“ (Reisen, Arzt, Restaurant, Hotel, Notfall, Telefon).
# Gleiches Format wie interests.py. IDs nie ändern, nur hinten anhängen.

PACKS = []


def K(**k):
    PACKS.append(k)


K(id='a_travel', ico='🚆', name='Travelling by train and plane', title='Unterwegs: Bahn und Flugzeug', theme='reisen',
  can='Ich kann Fahrkarten kaufen, nach Gleis und Abfahrt fragen und am Flughafen zurechtkommen.',
  tip='„Single“ = einfache Fahrt, „return“ = hin und zurück. In Großbritannien heißt der Bahnsteig „platform“.',
  fact='In London gibt es über 270 U-Bahn-Stationen. Mit einer kontaktlosen Bankkarte kann man direkt durch die Sperre gehen.',
  words='''ticket | Fahrkarte / Ticket
single | einfache Fahrt
return | Hin- und Rückfahrt
platform | Bahnsteig / Gleis
departure | Abfahrt / Abflug
arrival | Ankunft
delay | Verspätung
to change trains | umsteigen
boarding pass | Bordkarte
gate | Flugsteig
luggage | Gepäck
hand luggage | Handgepäck
security check | Sicherheitskontrolle
passport | Reisepass
window seat | Fensterplatz
cancelled | gestrichen / ausgefallen''',
  sentences=[('A return ticket to Oxford, please.', 'Eine Rückfahrkarte nach Oxford, bitte.'),
             ('Which platform does the train leave from?', 'Von welchem Gleis fährt der Zug ab?'),
             ('Do I have to change trains?', 'Muss ich umsteigen?'),
             ('The flight has a delay of forty minutes.', 'Der Flug hat vierzig Minuten Verspätung.'),
             ('Can I take this bag as hand luggage?', 'Kann ich diese Tasche als Handgepäck mitnehmen?'),
             ('Could I have a window seat, please?', 'Könnte ich bitte einen Fensterplatz haben?')],
  scene=dict(intro='London King’s Cross. Du willst nach York. Am Schalter wartet ein freundlicher Mitarbeiter.',
             steps=[dict(npc=('Hello! Where would you like to go?', 'Hallo! Wohin möchtest du fahren?'),
                         opts=[('A return ticket to York, please.', 'Eine Rückfahrkarte nach York, bitte.', 1), ('I would like a platform.', 'Ich hätte gern einen Bahnsteig.', 0)],
                         hint='Ziel + Art der Fahrkarte.'),
                    dict(npc=('That’s £45. The next train leaves at 10:30.', 'Das macht 45 Pfund. Der nächste Zug fährt um 10:30.'),
                         opts=[('Which platform does it leave from?', 'Von welchem Gleis fährt er?', 1), ('Is it a passport?', 'Ist es ein Reisepass?', 0)],
                         hint='Nach dem Gleis fragen.'),
                    dict(npc=('Platform 4. And it’s direct – no need to change.', 'Gleis 4. Und er fährt direkt – kein Umsteigen.'),
                         opts=[('Great, thank you!', 'Super, danke!', 1), ('Do I have to delay?', 'Muss ich verspäten?', 0)],
                         hint='Bedanken.')],
             outro='Pünktlich um 10:30 rollt der Zug los – Richtung Norden.'))

K(id='a_doc', ico='🩺', name='At the doctor’s', title='Beim Arzt', theme='arzt',
  can='Ich kann sagen, was mir wehtut, und verstehen, was der Arzt oder die Apotheke rät.',
  tip='Schmerzen: „I’ve got a headache / a sore throat.“ „My leg hurts.“ In Großbritannien geht man zuerst zum „GP“ (Hausarzt).',
  fact='Im Notfall wählt man in Großbritannien 999 oder 112, in Irland 112 oder 999. Für nicht dringende Fälle gibt es die Nummer 111.',
  words='''doctor | Arzt / Ärztin
appointment | Termin
headache | Kopfschmerzen
stomach ache | Bauchschmerzen
sore throat | Halsschmerzen
cough | Husten
cold | Erkältung
temperature | Fieber / Temperatur
to hurt | wehtun
pain | Schmerz
medicine | Medikament
tablet | Tablette
chemist’s | Apotheke
prescription | Rezept
allergic to | allergisch gegen
to feel sick | sich übel fühlen''',
  sentences=[('I’ve got a terrible headache.', 'Ich habe schlimme Kopfschmerzen.'),
             ('My ankle hurts when I walk.', 'Mein Knöchel tut weh, wenn ich gehe.'),
             ('I’d like to make an appointment, please.', 'Ich möchte bitte einen Termin vereinbaren.'),
             ('I’m allergic to nuts.', 'Ich bin allergisch gegen Nüsse.'),
             ('Take one tablet three times a day.', 'Nimm dreimal täglich eine Tablette.'),
             ('I feel sick and I’ve got a temperature.', 'Mir ist übel und ich habe Fieber.')],
  scene=dict(intro='Austauschwoche in Brighton. Du fühlst dich nicht gut. Deine Gastmutter bringt dich zur Praxis.',
             steps=[dict(npc=('Hello. What seems to be the problem?', 'Hallo. Was fehlt dir denn?'),
                         opts=[('I’ve got a sore throat and a cough.', 'Ich habe Halsschmerzen und Husten.', 1), ('I’ve got a chemist.', 'Ich habe eine Apotheke.', 0)],
                         hint='Beschwerden mit „I’ve got …“.'),
                    dict(npc=('Do you have a temperature?', 'Hast du Fieber?'),
                         opts=[('Yes, a little. 38 degrees this morning.', 'Ja, ein bisschen. Heute Morgen 38 Grad.', 1), ('Yes, it is cold weather.', 'Ja, es ist kaltes Wetter.', 0)],
                         hint='temperature = Fieber.'),
                    dict(npc=('It’s just a cold. Are you allergic to any medicine?', 'Es ist nur eine Erkältung. Bist du gegen Medikamente allergisch?'),
                         opts=[('No, I’m not allergic to anything.', 'Nein, ich bin gegen nichts allergisch.', 1), ('I am medicine.', 'Ich bin Medizin.', 0)],
                         hint='allergic to …')],
             outro='Mit Tee, Honig und Ruhe bist du nach zwei Tagen wieder fit.'))

K(id='a_rest', ico='🍽️', name='At the restaurant', title='Im Restaurant', theme='essen',
  can='Ich kann einen Tisch reservieren, bestellen, nach Zutaten fragen und bezahlen.',
  tip='Höflich bestellen: „Could I have …?“ oder „I’d like …“. Die Rechnung heißt in GB „the bill“, in den USA „the check“.',
  fact='In Großbritannien gibt man im Restaurant meist 10–12,5 % Trinkgeld – manchmal steht es schon als „service charge“ auf der Rechnung.',
  words='''menu | Speisekarte
starter | Vorspeise
main course | Hauptgericht
dessert | Nachtisch
vegetarian | vegetarisch
vegan | vegan
gluten-free | glutenfrei
to order | bestellen
waiter | Kellner
waitress | Kellnerin
bill | Rechnung
tip | Trinkgeld
to book a table | einen Tisch reservieren
still water | stilles Wasser
spicy | scharf
delicious | lecker''',
  sentences=[('Could we have a table for four, please?', 'Könnten wir bitte einen Tisch für vier haben?'),
             ('Can I see the menu, please?', 'Kann ich bitte die Speisekarte sehen?'),
             ('I’d like the fish and chips, please.', 'Ich hätte gern Fish and Chips, bitte.'),
             ('Is this dish vegetarian?', 'Ist dieses Gericht vegetarisch?'),
             ('Could we have the bill, please?', 'Könnten wir bitte die Rechnung haben?'),
             ('Is service included?', 'Ist das Trinkgeld inbegriffen?')],
  scene=dict(intro='Ein Pub in York, Sonntagmittag. Die Kellnerin kommt mit ihrem Block.',
             steps=[dict(npc=('Are you ready to order?', 'Seid ihr bereit zu bestellen?'),
                         opts=[('Yes, I’d like the Sunday roast, please.', 'Ja, ich hätte gern den Sonntagsbraten, bitte.', 1), ('Yes, I’d like the bill to eat.', 'Ja, ich hätte gern die Rechnung zu essen.', 0)],
                         hint='Bestellen: I’d like …'),
                    dict(npc=('Anything to drink?', 'Etwas zu trinken?'),
                         opts=[('Still water, please.', 'Stilles Wasser, bitte.', 1), ('Spicy water, please.', 'Scharfes Wasser, bitte.', 0)],
                         hint='still water = stilles Wasser.'),
                    dict(npc=('Here you are. Enjoy your meal!', 'Bitte schön. Guten Appetit!'),
                         opts=[('Thank you! It looks delicious.', 'Danke! Sieht lecker aus.', 1), ('Thank you! It’s vegan the bill.', 'Danke! Es ist vegan die Rechnung.', 0)],
                         hint='Bedanken und loben.')],
             outro='Yorkshire Pudding, Kartoffeln und Soße – einfach lecker.'))

K(id='a_hotel', ico='🏨', name='At the hotel', title='Im Hotel', theme='reisen',
  can='Ich kann einchecken, Fragen zum Zimmer stellen und ein Problem melden.',
  tip='Ein Problem höflich melden: „I’m afraid the shower doesn’t work.“ – „I’m afraid“ macht die Beschwerde freundlicher.',
  fact='In Großbritannien ist das „Full English Breakfast“ im Hotel oft inklusive: Eier, Bacon, Würstchen, Bohnen, Toast und Tomaten.',
  words='''reception | Rezeption
reservation | Reservierung
to check in | einchecken
to check out | auschecken
single room | Einzelzimmer
double room | Doppelzimmer
key card | Schlüsselkarte
breakfast included | Frühstück inklusive
floor | Stockwerk
lift | Aufzug
towel | Handtuch
Wi-Fi | WLAN
to work | funktionieren
noisy | laut
I’m afraid | leider
receipt | Quittung''',
  sentences=[('I have a reservation in the name of Weber.', 'Ich habe eine Reservierung auf den Namen Weber.'),
             ('Is breakfast included?', 'Ist das Frühstück inklusive?'),
             ('What time is check-out?', 'Wann muss man auschecken?'),
             ('I’m afraid the Wi-Fi doesn’t work.', 'Leider funktioniert das WLAN nicht.'),
             ('Could I have another towel, please?', 'Könnte ich bitte noch ein Handtuch bekommen?'),
             ('The room is on the third floor.', 'Das Zimmer ist im dritten Stock.')],
  scene=dict(intro='Ein kleines Hotel in Edinburgh, abends. Hinter der Rezeption steht ein Mann mit Schottenkaro-Krawatte.',
             steps=[dict(npc=('Good evening! How can I help you?', 'Guten Abend! Wie kann ich helfen?'),
                         opts=[('Hello, I have a reservation in the name of Müller.', 'Hallo, ich habe eine Reservierung auf den Namen Müller.', 1), ('Hello, I am a double room.', 'Hallo, ich bin ein Doppelzimmer.', 0)],
                         hint='Reservierung + Name.'),
                    dict(npc=('Here’s your key card. Room 204, second floor.', 'Hier ist deine Schlüsselkarte. Zimmer 204, zweiter Stock.'),
                         opts=[('Thank you. Is breakfast included?', 'Danke. Ist Frühstück inklusive?', 1), ('Thank you. Is the lift a towel?', 'Danke. Ist der Aufzug ein Handtuch?', 0)],
                         hint='Nach dem Frühstück fragen.'),
                    dict(npc=('Yes, from 7 to 10. Anything else?', 'Ja, von 7 bis 10. Sonst noch etwas?'),
                         opts=[('What’s the Wi-Fi password, please?', 'Wie ist bitte das WLAN-Passwort?', 1), ('I check out the reception.', 'Ich checke die Rezeption aus.', 0)],
                         hint='Eine praktische Frage stellen.')],
             outro='Zimmer 204 hat einen Blick auf das Schloss. Perfekt!'))

K(id='a_emer', ico='🚨', name='Help and emergencies', title='Hilfe und Notfälle', theme='notfall',
  can='Ich kann um Hilfe bitten, einen Unfall oder Verlust melden und wichtige Notfallsätze sagen.',
  tip='Notruf in GB: 999 (oder 112). Man wird gefragt: „Which service? Police, fire or ambulance?“',
  fact='Fundsachen gibt man in London bei „Transport for London Lost Property“ ab – dort landen jedes Jahr über 300 000 Gegenstände.',
  words='''help | Hilfe
emergency | Notfall
ambulance | Krankenwagen
police | Polizei
fire brigade | Feuerwehr
accident | Unfall
injured | verletzt
to lose – lost | verlieren – verloren
stolen | gestohlen
wallet | Geldbeutel
lost property | Fundbüro
to call | anrufen
quickly | schnell
address | Adresse
Are you OK? | Alles in Ordnung?
Watch out! | Pass auf!''',
  sentences=[('Help! Please call an ambulance!', 'Hilfe! Bitte ruft einen Krankenwagen!'),
             ('There has been an accident.', 'Es hat einen Unfall gegeben.'),
             ('I think my wallet has been stolen.', 'Ich glaube, mein Geldbeutel wurde gestohlen.'),
             ('I’ve lost my phone on the bus.', 'Ich habe mein Handy im Bus verloren.'),
             ('Where is the nearest police station?', 'Wo ist die nächste Polizeiwache?'),
             ('Are you OK? Can I help you?', 'Ist alles in Ordnung? Kann ich helfen?')],
  scene=dict(intro='Ein Platz in Manchester. Ein Radfahrer ist gestürzt. Eine Passantin kniet bei ihm und schaut dich an.',
             steps=[dict(npc=('Can you call 999? He’s injured!', 'Kannst du 999 anrufen? Er ist verletzt!'),
                         opts=[('Yes! … Hello, we need an ambulance, please.', 'Ja! … Hallo, wir brauchen bitte einen Krankenwagen.', 1), ('Yes, I need a wallet.', 'Ja, ich brauche einen Geldbeutel.', 0)],
                         hint='Dienst nennen: ambulance.'),
                    dict(npc=('(Phone) What is the address?', '(Telefon) Wie ist die Adresse?'),
                         opts=[('We are in Albert Square, next to the town hall.', 'Wir sind am Albert Square, neben dem Rathaus.', 1), ('The address is an accident.', 'Die Adresse ist ein Unfall.', 0)],
                         hint='Ort möglichst genau beschreiben.'),
                    dict(npc=('(Phone) Is he conscious? Can he talk?', '(Telefon) Ist er bei Bewusstsein? Kann er sprechen?'),
                         opts=[('Yes, he can talk, but his arm hurts.', 'Ja, er kann sprechen, aber sein Arm tut weh.', 1), ('Yes, he talks police.', 'Ja, er redet Polizei.', 0)],
                         hint='Ruhig und kurz antworten.')],
             outro='Fünf Minuten später ist der Krankenwagen da. „Well done!“, sagt die Sanitäterin.'))

K(id='a_phone', ico='📞', name='On the phone', title='Am Telefon', theme='notfall',
  can='Ich kann auf Englisch telefonieren: mich melden, nach jemandem fragen, eine Nachricht hinterlassen.',
  tip='Am Telefon sagt man „This is Lena“ statt „I am Lena“. Buchstabieren lernen lohnt sich: A wie „ay“, E wie „ee“, I wie „eye“.',
  fact='Die Telefonzelle ist ein Symbol Großbritanniens. Viele rote Häuschen sind heute Mini-Bibliotheken oder enthalten einen Defibrillator.',
  words='''to call | anrufen
to ring back | zurückrufen
to hang up | auflegen
Hold on, please. | Bleiben Sie bitte dran.
Speaking. | Am Apparat.
This is … | Hier ist …
Can I speak to …? | Kann ich … sprechen?
message | Nachricht
voicemail | Mailbox
to spell | buchstabieren
number | Nummer
line | Leitung
busy | besetzt
bad connection | schlechte Verbindung
Could you repeat that? | Könnten Sie das wiederholen?
text message | SMS / Textnachricht''',
  sentences=[('Hello, this is Max. Can I speak to Mrs Brown, please?', 'Hallo, hier ist Max. Kann ich bitte Frau Brown sprechen?'),
             ('Hold on, please. I’ll put you through.', 'Bleiben Sie bitte dran. Ich verbinde.'),
             ('Could you repeat that, please? The connection is bad.', 'Könnten Sie das bitte wiederholen? Die Verbindung ist schlecht.'),
             ('Can I leave a message?', 'Kann ich eine Nachricht hinterlassen?'),
             ('Could you spell your name, please?', 'Könnten Sie bitte Ihren Namen buchstabieren?'),
             ('I’ll ring you back later.', 'Ich rufe dich später zurück.')],
  scene=dict(intro='Du rufst bei deiner Gastfamilie in Liverpool an. Der Vater geht ran.',
             steps=[dict(npc=('Hello, 0151 496 0732.', 'Hallo, 0151 496 0732.'),
                         opts=[('Hello, this is Lena from Germany. Can I speak to Sophie, please?', 'Hallo, hier ist Lena aus Deutschland. Kann ich bitte Sophie sprechen?', 1), ('Hello, I am a phone.', 'Hallo, ich bin ein Telefon.', 0)],
                         hint='Am Telefon: This is …'),
                    dict(npc=('Sorry, she’s out at the moment. Can I take a message?', 'Tut mir leid, sie ist gerade nicht da. Soll ich etwas ausrichten?'),
                         opts=[('Yes, please. Could you tell her I’ll arrive on Friday?', 'Ja, bitte. Könnten Sie ihr sagen, dass ich am Freitag ankomme?', 1), ('Yes, please hang up.', 'Ja, bitte auflegen.', 0)],
                         hint='Nachricht hinterlassen.'),
                    dict(npc=('Of course. Could you spell your name?', 'Natürlich. Kannst du deinen Namen buchstabieren?'),
                         opts=[('Sure: L-E-N-A.', 'Klar: L-E-N-A.', 1), ('Sure: busy line.', 'Klar: besetzte Leitung.', 0)],
                         hint='Buchstabieren!')],
             outro='„Lovely, I’ll tell her. Safe journey, Lena!“'))
