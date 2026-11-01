# English Trail – Trail 1 (A1): Großbritannien & Irland, 12 Orte.
# Format wie Polski Szlak: Zielsprache (Englisch) steht in Feld 0. Basissprache ist immer Deutsch;
# das dritte Feld (früher Englisch als Basissprache) wird mit dem Deutschen gefüllt (siehe merge.py).
# words: "englisch | deutsch" je Zeile; sentences: (en, de); scene steps: npc (en, de), opts [(en, de, 1/0)], hint de

UNITS = []


def U(**k):
    UNITS.append(k)


U(id='lon', city='London', cityDe='London', lon=-0.13, lat=51.51, trail='red',
  title='Erste Worte',
  can='Ich kann grüßen, mich bedanken, mich entschuldigen und sagen, dass ich etwas nicht verstehe.',
  tip='„Sorry“ sagt man in England ständig: als Entschuldigung, aber auch, wenn man etwas nicht verstanden hat („Sorry?“ = Wie bitte?).',
  fact='Die Londoner U-Bahn („the Tube“) wurde 1863 eröffnet und ist die älteste U-Bahn der Welt.',
  words='''hello | hallo
hi | hi / hallo (locker)
good morning | guten Morgen
good afternoon | guten Tag (nachmittags)
good evening | guten Abend
goodbye | auf Wiedersehen
bye | tschüss
good night | gute Nacht
yes | ja
no | nein
please | bitte
thank you | danke
thanks | danke (locker)
you're welcome | gern geschehen
sorry | Entschuldigung / Wie bitte?
excuse me | Entschuldigen Sie (bitte)
how are you? | wie geht's?
I'm fine | mir geht's gut
I don't understand | ich verstehe nicht''',
  sentences=[
    ('Hello, how are you?', 'Hallo, wie geht es dir?'),
    ("I'm fine, thank you.", 'Mir geht es gut, danke.'),
    ("Sorry, I don't understand.", 'Entschuldigung, ich verstehe nicht.'),
    ('Excuse me, can you help me?', 'Entschuldigen Sie, können Sie mir helfen?'),
    ('Thank you very much!', 'Vielen Dank!'),
    ('Good morning, Mrs Smith!', 'Guten Morgen, Frau Smith!'),
    ('Can you say that again, please?', 'Können Sie das bitte noch einmal sagen?'),
    ('Goodbye and have a nice day!', 'Auf Wiedersehen und einen schönen Tag!'),
    ('Please speak slowly.', 'Bitte sprechen Sie langsam.'),
  ],
  scene=dict(
    intro='Du steigst an der Station Westminster aus. Big Ben schlägt. Eine Frau mit Stadtplan spricht dich an.',
    steps=[
      dict(npc=('Hello! Excuse me, are you from London?', 'Hallo! Entschuldigung, bist du aus London?'),
           opts=[("Hello! No, sorry, I'm not.", 'Hallo! Nein, tut mir leid, bin ich nicht.', 1),
                 ('Goodbye! Yes, I am night.', 'Tschüss! Ja, ich bin Nacht.', 0),
                 ('Thank you, I am fine.', 'Danke, mir geht es gut.', 0)],
           hint='Erst grüßen, dann mit „No, sorry“ freundlich verneinen.'),
      dict(npc=('Oh! How are you today?', 'Oh! Wie geht es dir heute?'),
           opts=[("I'm fine, thanks. And you?", 'Gut, danke. Und dir?', 1),
                 ("You're welcome.", 'Gern geschehen.', 0)],
           hint='Auf „How are you?“ antwortet man kurz und fragt zurück: „And you?“'),
      dict(npc=('Very well! Where is Big Ben, please?', 'Sehr gut! Wo ist bitte Big Ben?'),
           opts=[("Sorry, I don't understand.", 'Entschuldigung, ich verstehe nicht.', 1),
                 ('Good night!', 'Gute Nacht!', 0)],
           hint='Wenn du etwas nicht verstehst: „Sorry, I don’t understand.“ (Er steht übrigens direkt hinter dir.)'),
      dict(npc=('Ha! It’s behind you! Thank you, goodbye!', 'Ha! Er ist hinter dir! Danke, tschüss!'),
           opts=[("You're welcome. Bye!", 'Gern geschehen. Tschüss!', 1),
                 ('Good morning, please!', 'Guten Morgen, bitte!', 0)],
           hint='Auf „Thank you“ antwortet man „You’re welcome“.'),
    ],
    outro='Ihr lacht beide. Dein erstes Gespräch auf Englisch – mitten in London.'),
  mission=("Hello! Thank you! Sorry!", 'Sag heute dreimal etwas auf Englisch zu einem echten Menschen: „Hello“, „Thank you“ oder „Sorry“ – im Laden, am Telefon oder in einer Sprachnachricht.'),
  radio=('BBC Radio London', 'https://www.bbc.co.uk/sounds/play/live:bbc_london'),
  letter=dict(en='Hello! Thank you for reading my letter.', de='Hallo! Danke, dass du meinen Brief liest.',
              bridge='Rufus klopft mit dem Schnabel auf den Umschlag: „Die erste Zeile kannst du schon lesen! Wer da schreibt, erfährst du in Brighton.“'),
)

U(id='brg', city='Brighton', cityDe='Brighton', lon=-0.14, lat=50.82, trail='red',
  title='Das bin ich',
  can='Ich kann sagen, wie ich heiße, woher ich komme, wo ich wohne und wie alt ich bin.',
  tip='„I am“ wird fast immer zu „I’m“ verkürzt. Das Alter sagt man mit „be“: „I’m twelve (years old).“ – nicht „I have twelve years“.',
  fact='Der Brighton Palace Pier ist über 500 Meter lang und wurde 1899 eröffnet.',
  words='''my name is | ich heiße
I'm | ich bin
I'm from | ich komme aus
I live in | ich wohne in
Germany | Deutschland
German | deutsch / Deutsch
England | England
English | englisch / Englisch
years old | Jahre alt
I like | ich mag
student | Schüler / Student
friend | Freund / Freundin
nice to meet you | schön, dich kennenzulernen
what's your name? | wie heißt du?
where are you from? | woher kommst du?
how old are you? | wie alt bist du?
and you? | und du?
first name | Vorname
surname | Nachname''',
  sentences=[
    ('My name is Anna.', 'Ich heiße Anna.'),
    ("I'm from Germany.", 'Ich komme aus Deutschland.'),
    ('I live in a small town near Heidelberg.', 'Ich wohne in einer kleinen Stadt bei Heidelberg.'),
    ("I'm twelve years old.", 'Ich bin zwölf Jahre alt.'),
    ('Nice to meet you!', 'Schön, dich kennenzulernen!'),
    ("What's your name?", 'Wie heißt du?'),
    ('Where are you from?', 'Woher kommst du?'),
    ('I like music and football.', 'Ich mag Musik und Fußball.'),
    ('This is my friend Tom.', 'Das ist mein Freund Tom.'),
  ],
  scene=dict(
    intro='Am Strand von Brighton, bei den bunten Strandhütten. Ein Junge mit Frisbee kommt zu dir.',
    steps=[
      dict(npc=("Hi! I'm Jack. What's your name?", 'Hi! Ich bin Jack. Wie heißt du?'),
           opts=[('Hi Jack! My name is Lena.', 'Hi Jack! Ich heiße Lena.', 1),
                 ('Hi Jack! I name Lena.', 'Hi Jack! Ich Name Lena.', 0),
                 ('Hi! I have Lena.', 'Hi! Ich habe Lena.', 0)],
           hint='„My name is …“ oder „I’m …“.'),
      dict(npc=('Nice to meet you! Where are you from?', 'Schön, dich kennenzulernen! Woher kommst du?'),
           opts=[("I'm from Germany.", 'Ich komme aus Deutschland.', 1),
                 ('I come of Germany.', 'Ich komme von Deutschland (falsch).', 0)],
           hint='Herkunft: „I’m from …“ oder „I come from …“.'),
      dict(npc=('Cool! How old are you?', 'Cool! Wie alt bist du?'),
           opts=[("I'm eleven.", 'Ich bin elf.', 1),
                 ('I have eleven years.', 'Ich habe elf Jahre.', 0)],
           hint='Alter mit „be“: „I’m eleven (years old)“ – nie mit „have“.'),
      dict(npc=('Do you want to play frisbee?', 'Willst du Frisbee spielen?'),
           opts=[('Yes, please!', 'Ja, gern!', 1),
                 ('Yes, I am frisbee.', 'Ja, ich bin Frisbee.', 0)],
           hint='Kurz und freundlich: „Yes, please!“'),
    ],
    outro='Ihr spielt bis zum Sonnenuntergang. Du hast dich zum ersten Mal auf Englisch vorgestellt.'),
  mission=("My name is … I'm from …", 'Stell dich laut auf Englisch vor: Name, woher du kommst, wo du wohnst, was du magst. Vor dem Spiegel oder als Sprachnachricht an dich selbst.'),
  radio=('BBC Sussex', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_sussex'),
  letter=dict(en='My name is Emma and I live in Dublin.', de='Ich heiße Emma und ich wohne in Dublin.',
              bridge='Rufus nickt: „Emma! Sie ist Lehrerin in Dublin. Was sie sonst noch schreibt, liest du in Bath.“'),
)

U(id='bat', city='Bath', cityDe='Bath', lon=-2.36, lat=51.38, trail='red',
  title='Zahlen und Preise',
  can='Ich kann bis 100 zählen, nach Preisen fragen und Preise in Pfund und Pence verstehen.',
  tip='Preise: £3.50 sagt man „three pounds fifty“ (oder „three fifty“). Bei Dezimalzahlen steht ein Punkt, kein Komma.',
  fact='Die Römer bauten in Bath vor fast 2000 Jahren ein Bad über einer heißen Quelle – das Wasser ist bis heute rund 46 °C warm.',
  words='''one | eins
two | zwei
three | drei
four | vier
five | fünf
six | sechs
seven | sieben
eight | acht
nine | neun
ten | zehn
twelve | zwölf
twenty | zwanzig
fifty | fünfzig
a hundred | hundert
pound | Pfund
penny / pence | Penny / Pence
how much is it? | wie viel kostet das?
it's | es kostet / es ist
cheap | billig
expensive | teuer''',
  sentences=[
    ('How much is it?', 'Wie viel kostet das?'),
    ("It's three pounds fifty.", 'Es kostet drei Pfund fünfzig.'),
    ('That is very expensive!', 'Das ist sehr teuer!'),
    ('Two tickets, please.', 'Zwei Karten, bitte.'),
    ('My phone number is double four seven two.', 'Meine Telefonnummer ist vier vier sieben zwei.'),
    ('The museum costs twenty pounds.', 'Das Museum kostet zwanzig Pfund.'),
    ('I have ten pounds.', 'Ich habe zehn Pfund.'),
    ('Is it cheap or expensive?', 'Ist es billig oder teuer?'),
    ('Can I pay by card?', 'Kann ich mit Karte bezahlen?'),
  ],
  scene=dict(
    intro='Vor den Roman Baths in Bath. Du stehst an der Kasse.',
    steps=[
      dict(npc=('Hello! How many tickets?', 'Hallo! Wie viele Eintrittskarten?'),
           opts=[('Two tickets, please.', 'Zwei Karten, bitte.', 1),
                 ('Two ticket, please.', 'Zwei Karte, bitte.', 0),
                 ('Two, thank you, goodbye.', 'Zwei, danke, tschüss.', 0)],
           hint='Mehrzahl mit -s: one ticket, two tickets.'),
      dict(npc=('One adult and one child?', 'Ein Erwachsener und ein Kind?'),
           opts=[('Yes, please. How much is it?', 'Ja, bitte. Wie viel kostet das?', 1),
                 ('Yes. How many is it?', 'Ja. Wie viele ist es?', 0)],
           hint='Preis erfragen: „How much is it?“'),
      dict(npc=("That's thirty-five pounds, please.", 'Das macht fünfunddreißig Pfund, bitte.'),
           opts=[('Can I pay by card?', 'Kann ich mit Karte bezahlen?', 1),
                 ('I pay with card for you yes.', 'Ich zahle mit Karte für dich ja.', 0)],
           hint='Höfliche Frage mit „Can I …?“'),
      dict(npc=('Of course. Enjoy your visit!', 'Natürlich. Viel Spaß beim Besuch!'),
           opts=[('Thank you!', 'Danke!', 1), ('You are expensive!', 'Du bist teuer!', 0)],
           hint='Ein einfaches „Thank you!“ passt.'),
    ],
    outro='Durch die Glastür siehst du das grüne, dampfende Wasser des römischen Bades.'),
  mission=('How much is it? Three pounds fifty.', 'Lies heute beim Einkaufen drei Preise leise auf Englisch mit („four ninety-nine“). Zählt auch auf dem Kassenzettel.'),
  radio=('BBC Radio Bristol', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_bristol'),
  letter=dict(en='I have two cats and a small house.', de='Ich habe zwei Katzen und ein kleines Haus.',
              bridge='Rufus grinst: „Zwei Katzen! Ich halte Abstand. Weiter geht’s in Cardiff – da trinken wir erst mal etwas.“'),
)

U(id='crd', city='Cardiff', cityDe='Cardiff', lon=-3.18, lat=51.48, trail='red',
  title='Im Café',
  can='Ich kann im Café bestellen, um etwas bitten und bezahlen.',
  tip='Höflich bestellen: „Can I have …, please?“ oder „I’d like …“. „Give me …“ klingt im Englischen unhöflich.',
  fact='In Wales sind Walisisch und Englisch Amtssprachen. In Cardiff stehen deshalb fast alle Schilder in beiden Sprachen.',
  words='''coffee | Kaffee
tea | Tee
milk | Milch
sugar | Zucker
water | Wasser
juice | Saft
cake | Kuchen
sandwich | Sandwich / belegtes Brot
breakfast | Frühstück
cup | Tasse
glass | Glas
can I have …? | kann ich … haben?
I'd like | ich hätte gern
with | mit
without | ohne
the bill | die Rechnung
to take away | zum Mitnehmen
to eat in | zum Hieressen
delicious | lecker''',
  sentences=[
    ('Can I have a cup of tea, please?', 'Kann ich bitte eine Tasse Tee haben?'),
    ("I'd like a coffee with milk.", 'Ich hätte gern einen Kaffee mit Milch.'),
    ('No sugar, thank you.', 'Keinen Zucker, danke.'),
    ('Is it to eat in or to take away?', 'Zum Hieressen oder zum Mitnehmen?'),
    ('The cake is delicious!', 'Der Kuchen ist lecker!'),
    ('Can I have the bill, please?', 'Kann ich bitte die Rechnung haben?'),
    ('A glass of water, please.', 'Ein Glas Wasser, bitte.'),
    ('Do you have orange juice?', 'Haben Sie Orangensaft?'),
    ('I would like a cheese sandwich.', 'Ich hätte gern ein Käsesandwich.'),
  ],
  scene=dict(
    intro='Ein kleines Café in den viktorianischen Arkaden von Cardiff. Die Kellnerin kommt mit ihrem Block.',
    steps=[
      dict(npc=('Hiya! What can I get you?', 'Hallo! Was darf ich dir bringen?'),
           opts=[('Can I have a tea, please?', 'Kann ich bitte einen Tee haben?', 1),
                 ('Give me tea.', 'Gib mir Tee.', 0),
                 ('I am a tea, please.', 'Ich bin ein Tee, bitte.', 0)],
           hint='„Can I have …, please?“ ist höflich. „Give me …“ klingt im Englischen sehr unfreundlich.'),
      dict(npc=('With milk and sugar?', 'Mit Milch und Zucker?'),
           opts=[('With milk, no sugar, thanks.', 'Mit Milch, ohne Zucker, danke.', 1),
                 ('With milk, without sugars of me.', 'Mit Milch, ohne Zuckers von mir.', 0)],
           hint='„no sugar“ oder „without sugar“ – kurz und einfach.'),
      dict(npc=('Anything else? The Welsh cakes are lovely.', 'Sonst noch etwas? Die walisischen Küchlein sind köstlich.'),
           opts=[("Yes, I'd like a Welsh cake.", 'Ja, ich hätte gern ein walisisches Küchlein.', 1),
                 ('Yes, I like cake every Welsh.', 'Ja, ich mag Kuchen jeder walisisch.', 0)],
           hint='„I’d like …“ = ich hätte gern.'),
      dict(npc=('To eat in or to take away?', 'Zum Hieressen oder zum Mitnehmen?'),
           opts=[('To eat in, please.', 'Zum Hieressen, bitte.', 1), ('To take a way in.', 'Einen Weg hinein nehmen.', 0)],
           hint='Eine der beiden Möglichkeiten wiederholen: „To eat in.“'),
    ],
    outro='Der Tee kommt in einer großen Tasse mit viel Milch – so wie man ihn in Großbritannien meist trinkt.'),
  mission=("Can I have …, please?", 'Bestell heute in Gedanken (oder wirklich) auf Englisch: Getränk, mit oder ohne Milch/Zucker, zum Mitnehmen oder hier.'),
  radio=('BBC Radio Wales', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_wales_fm'),
  letter=dict(en='Every morning I drink tea with milk.', de='Jeden Morgen trinke ich Tee mit Milch.',
              bridge='Rufus schlürft aus deiner Tasse: „Typisch! In Liverpool erzählt Emma von ihrer Familie.“'),
)

U(id='lvp', city='Liverpool', cityDe='Liverpool', lon=-2.98, lat=53.41, trail='red',
  title='Familie',
  can='Ich kann meine Familie vorstellen und einfache Fragen zu Geschwistern und Eltern beantworten.',
  tip='Besitz mit ’s: „my mum’s car“ = das Auto meiner Mutter. Bei mehreren Personen nur ein Apostroph: „my parents’ house“.',
  fact='Die Beatles kommen aus Liverpool. Im Cavern Club, wo sie oft auftraten, wird noch heute jeden Tag Livemusik gespielt.',
  words='''family | Familie
mother / mum | Mutter / Mama
father / dad | Vater / Papa
parents | Eltern
sister | Schwester
brother | Bruder
son | Sohn
daughter | Tochter
grandma | Oma
grandpa | Opa
aunt | Tante
uncle | Onkel
cousin | Cousin / Cousine
baby | Baby
husband | Ehemann
wife | Ehefrau
have got | haben (besitzen)
older | älter
younger | jünger''',
  sentences=[
    ("I've got one sister and two brothers.", 'Ich habe eine Schwester und zwei Brüder.'),
    ('My mum is a nurse.', 'Meine Mutter ist Krankenschwester.'),
    ('This is my grandma.', 'Das ist meine Oma.'),
    ('Have you got any brothers or sisters?', 'Hast du Geschwister?'),
    ('My brother is older than me.', 'Mein Bruder ist älter als ich.'),
    ("My dad's name is Peter.", 'Mein Vater heißt Peter.'),
    ('My parents live in Liverpool.', 'Meine Eltern wohnen in Liverpool.'),
    ("I haven't got a sister.", 'Ich habe keine Schwester.'),
    ('My aunt has got a baby.', 'Meine Tante hat ein Baby.'),
  ],
  scene=dict(
    intro='Im Haus von Emmas Cousine Sophie in Liverpool. Sie zeigt dir Familienfotos.',
    steps=[
      dict(npc=('Look, this is my family! Have you got any brothers or sisters?', 'Schau, das ist meine Familie! Hast du Geschwister?'),
           opts=[("Yes, I've got one brother.", 'Ja, ich habe einen Bruder.', 1),
                 ('Yes, I am one brother.', 'Ja, ich bin ein Bruder.', 0),
                 ('Yes, I got brother sister.', 'Ja, ich bekam Bruder Schwester.', 0)],
           hint='„I’ve got …“ = ich habe.'),
      dict(npc=('Is he older or younger?', 'Ist er älter oder jünger?'),
           opts=[("He's older. He's fifteen.", 'Er ist älter. Er ist fünfzehn.', 1),
                 ('He has older fifteen.', 'Er hat älter fünfzehn.', 0)],
           hint='Alter mit „be“: „He’s fifteen.“'),
      dict(npc=("And who's this on your phone?", 'Und wer ist das auf deinem Handy?'),
           opts=[("That's my grandma.", 'Das ist meine Oma.', 1),
                 ('That my grandma is.', 'Das meine Oma ist.', 0)],
           hint='Wortstellung: That’s + Person.'),
      dict(npc=('She looks lovely!', 'Sie sieht nett aus!'),
           opts=[('Thank you! She is very funny.', 'Danke! Sie ist sehr lustig.', 1),
                 ("You're welcome! He is funny.", 'Gern geschehen! Er ist lustig.', 0)],
           hint='Auf ein Kompliment: „Thank you!“ – und für die Oma „she“, nicht „he“.'),
    ],
    outro='Sophie spielt dir zum Abschied einen Beatles-Song vor. Familie geht auf Englisch schon richtig gut.'),
  mission=("I've got one sister and …", 'Beschreibe heute laut deine Familie auf Englisch: Wer gehört dazu, wie alt sind sie, was machen sie?'),
  radio=('BBC Radio Merseyside', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_merseyside'),
  letter=dict(en='My brother lives in Liverpool with his wife.', de='Mein Bruder wohnt mit seiner Frau in Liverpool.',
              bridge='Rufus flattert los: „In Manchester verrät Emma, wann sie Zeit hat.“'),
)

U(id='mcr', city='Manchester', cityDe='Manchester', lon=-2.24, lat=53.48, trail='red',
  title='Zeit und Tage',
  can='Ich kann die Uhrzeit sagen, Wochentage und Monate nennen und Termine vereinbaren.',
  tip='Wochentage und Monate schreibt man im Englischen groß: Monday, July. Uhrzeit: „half past three“ = halb vier (nicht halb drei!).',
  fact='In Manchester fuhr 1830 die erste Personenbahn zwischen zwei Städten – nach Liverpool.',
  words='''Monday | Montag
Tuesday | Dienstag
Wednesday | Mittwoch
Thursday | Donnerstag
Friday | Freitag
Saturday | Samstag
Sunday | Sonntag
weekend | Wochenende
today | heute
tomorrow | morgen
yesterday | gestern
morning | Morgen / Vormittag
evening | Abend
o'clock | Uhr (volle Stunde)
half past | halb (+1)
quarter past | Viertel nach
what time is it? | wie spät ist es?
week | Woche
month | Monat''',
  sentences=[
    ('What time is it?', 'Wie spät ist es?'),
    ("It's half past three.", 'Es ist halb vier.'),
    ('See you on Monday!', 'Bis Montag!'),
    ('The match is on Saturday at three o’clock.', 'Das Spiel ist am Samstag um drei Uhr.'),
    ('I go to school from Monday to Friday.', 'Ich gehe von Montag bis Freitag zur Schule.'),
    ('My birthday is in July.', 'Mein Geburtstag ist im Juli.'),
    ('Are you free tomorrow?', 'Hast du morgen Zeit?'),
    ('The shop opens at nine.', 'Der Laden öffnet um neun.'),
    ('We play football every weekend.', 'Wir spielen jedes Wochenende Fußball.'),
  ],
  scene=dict(
    intro='Vor dem Fußballstadion in Manchester. Ein Fan mit Schal fragt dich etwas.',
    steps=[
      dict(npc=('Excuse me, what time is it?', 'Entschuldigung, wie spät ist es?'),
           opts=[("It's quarter past two.", 'Es ist Viertel nach zwei.', 1),
                 ('It has two hours.', 'Es hat zwei Stunden.', 0),
                 ('I am two o’clock.', 'Ich bin zwei Uhr.', 0)],
           hint='Uhrzeit: „It’s …“'),
      dict(npc=('Great, the match starts at three. Are you coming?', 'Super, das Spiel beginnt um drei. Kommst du mit?'),
           opts=[('Sorry, not today. Maybe on Saturday?', 'Tut mir leid, heute nicht. Vielleicht am Samstag?', 1),
                 ('Sorry, not today. Maybe in Saturday?', 'Tut mir leid, heute nicht. Vielleicht im Samstag?', 0)],
           hint='Vor Wochentagen steht „on“: on Saturday.'),
      dict(npc=('Saturday is good! At what time?', 'Samstag passt! Um wie viel Uhr?'),
           opts=[('At half past two?', 'Um halb drei?', 1), ('At half past three to two?', 'Um halb vier vor zwei?', 0)],
           hint='Vor Uhrzeiten steht „at“: at half past two (= 14:30).'),
      dict(npc=('Perfect. See you on Saturday!', 'Perfekt. Bis Samstag!'),
           opts=[('See you!', 'Bis dann!', 1), ('Good night, see you yesterday!', 'Gute Nacht, bis gestern!', 0)],
           hint='Kurz verabschieden: „See you!“'),
    ],
    outro='Du hast deine erste Verabredung auf Englisch – mit Tag und Uhrzeit.'),
  mission=("It's half past …", 'Sag heute dreimal die Uhrzeit auf Englisch, wenn du auf die Uhr schaust.'),
  radio=('BBC Radio Manchester', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_manchester'),
  letter=dict(en='On Saturday I am free all day.', de='Am Samstag habe ich den ganzen Tag frei.',
              bridge='Rufus schaut zum Himmel: „Regen? Im Lake District erzählt Emma vom Wetter.“'),
)

U(id='lak', city='Lake District', cityDe='Lake District (Seenland)', lon=-3.13, lat=54.6, trail='green',
  title='Natur und Wetter',
  can='Ich kann das Wetter beschreiben und über Natur und Jahreszeiten sprechen.',
  tip='Wetter beschreibt man mit „It’s …“: It’s sunny. It’s raining. – „It’s raining“ ist Verlaufsform, weil es gerade jetzt passiert.',
  fact='Der Lake District ist UNESCO-Welterbe. Hier steht Englands höchster Berg, der Scafell Pike (978 m).',
  words='''weather | Wetter
sun | Sonne
sunny | sonnig
rain | Regen
it's raining | es regnet
cloudy | bewölkt
windy | windig
cold | kalt
warm | warm
hot | heiß
snow | Schnee
lake | See
mountain | Berg
tree | Baum
river | Fluss
spring | Frühling
summer | Sommer
autumn | Herbst
winter | Winter''',
  sentences=[
    ("It's sunny today.", 'Heute ist es sonnig.'),
    ("It's raining again!", 'Es regnet schon wieder!'),
    ("What's the weather like?", 'Wie ist das Wetter?'),
    ("It's cold and windy in winter.", 'Im Winter ist es kalt und windig.'),
    ('The lake is very beautiful.', 'Der See ist sehr schön.'),
    ('Take your umbrella!', 'Nimm deinen Regenschirm mit!'),
    ('We walk up the mountain.', 'Wir wandern auf den Berg.'),
    ('In summer it is warm.', 'Im Sommer ist es warm.'),
    ('I love autumn in the Lake District.', 'Ich liebe den Herbst im Lake District.'),
  ],
  scene=dict(
    intro='Am Ufer des Derwentwater bei Keswick. Ein Wanderer mit Rucksack bleibt stehen.',
    steps=[
      dict(npc=("Lovely day, isn't it?", 'Schöner Tag, oder?'),
           opts=[("Yes, it's sunny and warm.", 'Ja, es ist sonnig und warm.', 1),
                 ('Yes, it sunnies.', 'Ja, es sonnt.', 0), ('Yes, I am warm day.', 'Ja, ich bin warmer Tag.', 0)],
           hint='Wetter mit „It’s …“: It’s sunny.'),
      dict(npc=('But look at the clouds! Maybe rain later.', 'Aber schau die Wolken! Vielleicht regnet es später.'),
           opts=[("Oh no! I haven't got an umbrella.", 'Oh nein! Ich habe keinen Regenschirm.', 1),
                 ('Oh no! I am not umbrella.', 'Oh nein! Ich bin nicht Regenschirm.', 0)],
           hint='„I haven’t got …“ = ich habe kein(e/n) …'),
      dict(npc=('Where are you going?', 'Wohin gehst du?'),
           opts=[('Up the mountain.', 'Auf den Berg.', 1), ('In the lake, swimming cold.', 'In den See, schwimmen kalt.', 0)],
           hint='Kurze Antwort reicht: „Up the mountain.“'),
      dict(npc=('Be careful, it can get windy up there!', 'Pass auf, da oben kann es windig werden!'),
           opts=[('Thanks! Have a nice day.', 'Danke! Einen schönen Tag noch.', 1), ('Yes, I am windy.', 'Ja, ich bin windig.', 0)],
           hint='Dank + guter Wunsch.'),
    ],
    outro='Oben am Gipfel regnet es kurz, dann scheint wieder die Sonne. Typisch englisches Wetter.'),
  mission=("It's sunny / It's raining.", 'Beschreibe heute morgens das Wetter vor deinem Fenster auf Englisch – laut, in zwei Sätzen.'),
  radio=('BBC Radio Cumbria', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_cumbria'),
  letter=dict(en='In Dublin it often rains, but I love it.', de='In Dublin regnet es oft, aber ich liebe es.',
              bridge='Rufus schüttelt sich trocken: „In York geht Emma einkaufen. Komm mit!“'),
)

U(id='yrk', city='York', cityDe='York', lon=-1.08, lat=53.96, trail='red',
  title='Einkaufen und Farben',
  can='Ich kann in Geschäften nach Dingen fragen, Farben und Größen nennen und etwas kaufen.',
  tip='Farbe steht vor dem Nomen und bleibt immer gleich: a red T-shirt, two red T-shirts. Nach Größen fragt man: „Have you got it in medium?“',
  fact='Die Shambles in York ist eine der besterhaltenen mittelalterlichen Einkaufsstraßen Europas – die oberen Stockwerke berühren sich fast.',
  words='''shop | Laden
red | rot
blue | blau
green | grün
yellow | gelb
black | schwarz
white | weiß
grey | grau
pink | rosa
T-shirt | T-Shirt
jumper | Pullover
shoes | Schuhe
size | Größe
small | klein
big | groß
I'm looking for | ich suche
can I try it on? | kann ich es anprobieren?
I'll take it | ich nehme es
present | Geschenk''',
  sentences=[
    ("I'm looking for a blue jumper.", 'Ich suche einen blauen Pullover.'),
    ('Have you got this in red?', 'Haben Sie das in Rot?'),
    ('Can I try it on?', 'Kann ich es anprobieren?'),
    ('It is too small.', 'Es ist zu klein.'),
    ('Have you got a bigger size?', 'Haben Sie eine größere Größe?'),
    ("I'll take it.", 'Ich nehme es.'),
    ('The black shoes are cheaper.', 'Die schwarzen Schuhe sind billiger.'),
    ("It's a present for my sister.", 'Es ist ein Geschenk für meine Schwester.'),
    ('My favourite colour is green.', 'Meine Lieblingsfarbe ist Grün.'),
  ],
  scene=dict(
    intro='Ein kleiner Laden in den Shambles von York. Die Verkäuferin lächelt.',
    steps=[
      dict(npc=('Hello! Can I help you?', 'Hallo! Kann ich Ihnen helfen?'),
           opts=[("Yes, please. I'm looking for a scarf.", 'Ja, bitte. Ich suche einen Schal.', 1),
                 ('Yes, I search a scarf for me now.', 'Ja, ich suche Schal für mich jetzt.', 0),
                 ('No, I am a scarf.', 'Nein, ich bin ein Schal.', 0)],
           hint='„I’m looking for …“ = ich suche …'),
      dict(npc=('What colour?', 'Welche Farbe?'),
           opts=[('Green, please.', 'Grün, bitte.', 1), ('Greens, please.', 'Grüns, bitte.', 0)],
           hint='Farben haben kein Plural-s.'),
      dict(npc=('This one is green. Do you like it?', 'Dieser hier ist grün. Gefällt er Ihnen?'),
           opts=[('Yes, I love it! How much is it?', 'Ja, ich liebe ihn! Wie viel kostet er?', 1),
                 ('Yes, it likes me.', 'Ja, er mag mich.', 0)],
           hint='Gefallen: „I like it / I love it“.'),
      dict(npc=('Twelve pounds.', 'Zwölf Pfund.'),
           opts=[("Great, I'll take it.", 'Super, ich nehme ihn.', 1), ('Great, I take you.', 'Super, ich nehme dich.', 0)],
           hint='Kaufentscheidung: „I’ll take it.“'),
    ],
    outro='Mit einem grünen Schal geht es weiter nach Norden. Die Shambles ist dein Lieblingsort in York.'),
  mission=("I'm looking for …", 'Benenne heute zu Hause fünf Dinge mit Farbe auf Englisch: „a red cup“, „a black jumper“ …'),
  radio=('BBC Radio York', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_york'),
  letter=dict(en='I have a present for you: a green scarf.', de='Ich habe ein Geschenk für dich: einen grünen Schal.',
              bridge='Rufus zupft an deinem neuen Schal: „Emmas Geschenk passt! In Edinburgh brauchst du den Weg.“'),
)

U(id='edi', city='Edinburgh', cityDe='Edinburgh', lon=-3.19, lat=55.95, trail='blue',
  title='In der Stadt',
  can='Ich kann nach dem Weg fragen, einfache Wegbeschreibungen verstehen und Orte in der Stadt benennen.',
  tip='Weg erfragen: „How do I get to …?“ oder „Where is …?“. Antwort: „Go straight on, then turn left.“ – „on the left“ = auf der linken Seite.',
  fact='Edinburgh Castle steht auf einem erloschenen Vulkan. Jeden Tag außer sonntags wird um 13 Uhr eine Kanone abgefeuert.',
  words='''street | Straße
square | Platz
station | Bahnhof
church | Kirche
castle | Burg / Schloss
museum | Museum
bank | Bank
hospital | Krankenhaus
bridge | Brücke
left | links
right | rechts
straight on | geradeaus
turn | abbiegen
near | nah / in der Nähe
far | weit
next to | neben
opposite | gegenüber
corner | Ecke
how do I get to …? | wie komme ich zu …?''',
  sentences=[
    ('How do I get to the castle?', 'Wie komme ich zur Burg?'),
    ('Go straight on and turn left.', 'Geh geradeaus und bieg links ab.'),
    ('The station is on the right.', 'Der Bahnhof ist auf der rechten Seite.'),
    ('Is it far from here?', 'Ist es weit von hier?'),
    ('The bank is next to the church.', 'Die Bank ist neben der Kirche.'),
    ("It's about five minutes on foot.", 'Es sind ungefähr fünf Minuten zu Fuß.'),
    ('The museum is opposite the park.', 'Das Museum ist gegenüber dem Park.'),
    ('Turn right at the corner.', 'Bieg an der Ecke rechts ab.'),
    ('Excuse me, where is the nearest bus stop?', 'Entschuldigung, wo ist die nächste Bushaltestelle?'),
  ],
  scene=dict(
    intro='Auf der Royal Mile in Edinburgh. Ein Dudelsackspieler macht Pause und du fragst nach dem Weg.',
    steps=[
      dict(npc=('Hello there! Are you lost?', 'Hallo! Hast du dich verlaufen?'),
           opts=[('A bit. How do I get to the castle?', 'Ein bisschen. Wie komme ich zur Burg?', 1),
                 ('A bit. Where I get castle?', 'Ein bisschen. Wo ich bekomme Burg?', 0),
                 ('Yes, I am a castle.', 'Ja, ich bin eine Burg.', 0)],
           hint='„How do I get to …?“'),
      dict(npc=('Go straight on, up the hill.', 'Geh geradeaus, den Hügel hinauf.'),
           opts=[('Straight on. Is it far?', 'Geradeaus. Ist es weit?', 1), ('Straight on. Is it near far?', 'Geradeaus. Ist es nah weit?', 0)],
           hint='„Is it far?“ = Ist es weit?'),
      dict(npc=("No, it's about five minutes. It's at the top, you can't miss it.", 'Nein, ungefähr fünf Minuten. Sie ist ganz oben, du kannst sie nicht verfehlen.'),
           opts=[('Great, thank you very much!', 'Super, vielen Dank!', 1), ('Great, you are five minutes!', 'Super, du bist fünf Minuten!', 0)],
           hint='Bedanken: „Thank you very much!“'),
      dict(npc=('Enjoy the castle! And listen for the one o’clock gun!', 'Viel Spaß auf der Burg! Und hör auf die Kanone um eins!'),
           opts=[('I will. Bye!', 'Mach ich. Tschüss!', 1), ('Yes, I am a gun.', 'Ja, ich bin eine Kanone.', 0)],
           hint='Kurz zusagen: „I will.“'),
    ],
    outro='Punkt eins knallt die Kanone. Du stehst oben an der Burg und siehst über die ganze Stadt.'),
  mission=('How do I get to …? Go straight on.', 'Beschreibe heute auf Englisch den Weg von deiner Haustür zum nächsten Supermarkt (left, right, straight on).'),
  radio=('BBC Radio Scotland', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_scotland_fm'),
  letter=dict(en='My school is next to a big park.', de='Meine Schule ist neben einem großen Park.',
              bridge='Rufus zeigt nach Norden: „Ab in die Highlands! In Inverness geht’s um Zug und Hotel.“'),
)

U(id='inv', city='Inverness', cityDe='Inverness (Highlands)', lon=-4.22, lat=57.48, trail='blue',
  title='Unterwegs',
  can='Ich kann Fahrkarten kaufen, nach Abfahrtszeiten fragen und ein Hotelzimmer buchen.',
  tip='Hin- und Rückfahrt heißt in Großbritannien „return ticket“, nur hin „single“. In den USA sagt man „round-trip“ und „one-way“.',
  fact='Vom Bahnhof Inverness fahren Züge durch die Highlands. Ganz in der Nähe liegt Loch Ness – samt Seeungeheuer-Legende.',
  words='''train | Zug
bus | Bus
ticket | Fahrkarte
single | einfache Fahrt
return | Hin- und Rückfahrt
platform | Gleis / Bahnsteig
timetable | Fahrplan
to leave | abfahren
to arrive | ankommen
late | spät / verspätet
hotel | Hotel
room | Zimmer
key | Schlüssel
night | Nacht
reservation | Reservierung
luggage | Gepäck
passport | Reisepass
airport | Flughafen
holiday | Urlaub / Ferien''',
  sentences=[
    ('A return ticket to Edinburgh, please.', 'Eine Hin- und Rückfahrkarte nach Edinburgh, bitte.'),
    ('What time does the train leave?', 'Um wie viel Uhr fährt der Zug ab?'),
    ('The train leaves from platform two.', 'Der Zug fährt von Gleis zwei ab.'),
    ('The bus is late again.', 'Der Bus hat schon wieder Verspätung.'),
    ('I have a reservation for two nights.', 'Ich habe eine Reservierung für zwei Nächte.'),
    ('Here is your key. Room twelve.', 'Hier ist Ihr Schlüssel. Zimmer zwölf.'),
    ('Is breakfast included?', 'Ist das Frühstück inbegriffen?'),
    ('We are on holiday in Scotland.', 'Wir machen Urlaub in Schottland.'),
    ('Where can I leave my luggage?', 'Wo kann ich mein Gepäck lassen?'),
  ],
  scene=dict(
    intro='Ein kleines Hotel am Fluss Ness. Der Mann an der Rezeption trägt einen Kilt.',
    steps=[
      dict(npc=('Good evening! Can I help you?', 'Guten Abend! Kann ich Ihnen helfen?'),
           opts=[('Good evening. I have a reservation.', 'Guten Abend. Ich habe eine Reservierung.', 1),
                 ('Good morning. I reserve me.', 'Guten Morgen. Ich reserviere mich.', 0),
                 ('Good night! Bye!', 'Gute Nacht! Tschüss!', 0)],
           hint='Am Abend: „Good evening“. „Good night“ sagt man nur zum Abschied.'),
      dict(npc=("What's your name, please?", 'Wie ist Ihr Name, bitte?'),
           opts=[("It's Weber. W-E-B-E-R.", 'Weber. W-E-B-E-R.', 1), ('I am name Weber.', 'Ich bin Name Weber.', 0)],
           hint='Namen buchstabiert man gern: „W-E-B-E-R“.'),
      dict(npc=('Two nights, room twelve. Here is your key.', 'Zwei Nächte, Zimmer zwölf. Hier ist Ihr Schlüssel.'),
           opts=[('Thank you. Is breakfast included?', 'Danke. Ist das Frühstück inbegriffen?', 1),
                 ('Thank you. Breakfast is my key?', 'Danke. Frühstück ist mein Schlüssel?', 0)],
           hint='„Is … included?“ = Ist … inbegriffen?'),
      dict(npc=('Yes, from seven to ten. Enjoy your stay!', 'Ja, von sieben bis zehn. Schönen Aufenthalt!'),
           opts=[('Thanks a lot!', 'Vielen Dank!', 1), ('From seven, you!', 'Ab sieben, du!', 0)],
           hint='Einfacher Dank genügt.'),
    ],
    outro='Vom Zimmerfenster siehst du den Fluss Ness. Morgen geht es mit der Fähre nach Nordirland.'),
  mission=('A return ticket to …, please.', 'Plane heute im Kopf eine Reise auf Englisch: Fahrkarte kaufen, Gleis fragen, Hotel einchecken – sprich jeden Satz einmal laut.'),
  radio=('BBC Radio nan Gàidheal', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_nan_gaidheal'),
  letter=dict(en='In summer I travel by train to Scotland.', de='Im Sommer fahre ich mit dem Zug nach Schottland.',
              bridge='Rufus packt seine Federn: „Auf nach Belfast! Dort erzählt Emma von ihrer Arbeit.“'),
)

U(id='bel', city='Belfast', cityDe='Belfast', lon=-5.93, lat=54.6, trail='black',
  title='Arbeit',
  can='Ich kann sagen, was ich beruflich mache oder später machen möchte, und über meinen Alltag in Schule und Beruf sprechen.',
  tip='Berufe mit „a/an“: „She’s a teacher.“ „I’m an engineer.“ – im Deutschen ohne Artikel, im Englischen mit!',
  fact='In Belfast wurde die Titanic gebaut. Das Museum „Titanic Belfast“ steht genau dort, wo das Schiff 1911 vom Stapel lief.',
  words='''job | Job / Beruf
work | Arbeit / arbeiten
teacher | Lehrer / Lehrerin
doctor | Arzt / Ärztin
nurse | Krankenpfleger / -schwester
engineer | Ingenieur
office | Büro
meeting | Besprechung
computer | Computer
email | E-Mail
boss | Chef / Chefin
colleague | Kollege / Kollegin
team | Team
project | Projekt
busy | beschäftigt
break | Pause
to start | anfangen
to finish | aufhören / beenden
company | Firma''',
  sentences=[
    ("What's your job?", 'Was machst du beruflich?'),
    ("I'm a teacher.", 'Ich bin Lehrer.'),
    ('I work in an office in the city centre.', 'Ich arbeite in einem Büro im Stadtzentrum.'),
    ('I start work at eight o’clock.', 'Ich fange um acht Uhr an zu arbeiten.'),
    ('We have a meeting at ten.', 'Wir haben um zehn eine Besprechung.'),
    ("Sorry, I'm very busy today.", 'Tut mir leid, ich habe heute viel zu tun.'),
    ('My colleagues are very nice.', 'Meine Kollegen sind sehr nett.'),
    ('I want to be a doctor.', 'Ich möchte Arzt werden.'),
    ('Can you send me an email?', 'Kannst du mir eine E-Mail schicken?'),
  ],
  scene=dict(
    intro='Im Titanic-Museum in Belfast. In der Pause kommst du mit einer Mitarbeiterin ins Gespräch.',
    steps=[
      dict(npc=('Hi! Are you here on holiday?', 'Hi! Bist du im Urlaub hier?'),
           opts=[('Yes. And you? Do you work here?', 'Ja. Und du? Arbeitest du hier?', 1),
                 ('Yes. And you? Are you work here?', 'Ja. Und du? Bist du arbeiten hier?', 0),
                 ('Yes, I am a holiday.', 'Ja, ich bin ein Urlaub.', 0)],
           hint='Fragen im simple present mit „do“: „Do you work here?“'),
      dict(npc=("Yes, I'm a guide. What's your job?", 'Ja, ich bin Führerin. Was machst du beruflich?'),
           opts=[("I'm an engineer.", 'Ich bin Ingenieur.', 1), ("I'm engineer.", 'Ich bin Ingenieur (ohne Artikel).', 0)],
           hint='Vor Berufen steht im Englischen a/an: „I’m an engineer.“'),
      dict(npc=('Oh, like the people who built the Titanic!', 'Oh, wie die Leute, die die Titanic gebaut haben!'),
           opts=[('Ha, yes! But I build computers, not ships.', 'Ha, ja! Aber ich baue Computer, keine Schiffe.', 1),
                 ('Ha, yes! I am a ship.', 'Ha, ja! Ich bin ein Schiff.', 0)],
           hint='Mit „but“ einen Gegensatz ausdrücken.'),
      dict(npc=('My break is over. Nice to meet you!', 'Meine Pause ist vorbei. Schön, dich kennenzulernen!'),
           opts=[('Nice to meet you too!', 'Ebenso schön, dich kennenzulernen!', 1), ('You too meet nice!', 'Du auch treffen schön!', 0)],
           hint='Antwort: „Nice to meet you too!“'),
    ],
    outro='Du kannst jetzt über Arbeit sprechen – und weißt, wo die Titanic gebaut wurde.'),
  mission=("I'm a … / I want to be a …", 'Erkläre heute laut auf Englisch, was du beruflich machst oder werden möchtest – und was du dort jeden Tag tust.'),
  radio=('BBC Radio Ulster', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_ulster'),
  letter=dict(en='I am a teacher, and my students are great.', de='Ich bin Lehrerin und meine Schüler sind toll.',
              bridge='Rufus sieht die Küste: „Letzte Station: Dublin! Dort wartet Emma auf dich.“'),
)

U(id='dub', city='Dublin', cityDe='Dublin', lon=-6.26, lat=53.35, trail='green',
  title='Körper und Gesundheit',
  can='Ich kann sagen, was mir wehtut, beim Arzt oder in der Apotheke einfache Gespräche führen und gute Besserung wünschen.',
  tip='Schmerzen: „I’ve got a headache / a sore throat.“ oder „My back hurts.“ – „hurt“ = wehtun.',
  fact='Dublins Trinity College ist über 430 Jahre alt. In seiner Bibliothek liegt das Book of Kells, eine Handschrift aus der Zeit um 800.',
  words='''head | Kopf
arm | Arm
leg | Bein
back | Rücken
stomach | Bauch / Magen
tooth | Zahn
eye | Auge
ear | Ohr
hand | Hand
foot | Fuß
it hurts | es tut weh
headache | Kopfschmerzen
sore throat | Halsschmerzen
ill / sick | krank
doctor's | Arztpraxis
chemist's | Apotheke
medicine | Medikament
appointment | Termin
get well soon! | gute Besserung!''',
  sentences=[
    ("I've got a headache.", 'Ich habe Kopfschmerzen.'),
    ('My back hurts.', 'Mein Rücken tut weh.'),
    ("I don't feel well.", 'Ich fühle mich nicht gut.'),
    ('I need an appointment, please.', 'Ich brauche bitte einen Termin.'),
    ('Take this medicine three times a day.', 'Nimm dieses Medikament dreimal am Tag.'),
    ('Where is the nearest chemist’s?', 'Wo ist die nächste Apotheke?'),
    ('Stay in bed and drink a lot of water.', 'Bleib im Bett und trink viel Wasser.'),
    ('Get well soon!', 'Gute Besserung!'),
    ('Exercise is good for your back.', 'Bewegung ist gut für deinen Rücken.'),
  ],
  scene=dict(
    intro='In Dublin wachst du mit Halsschmerzen auf. Du gehst in eine Apotheke in der Grafton Street.',
    steps=[
      dict(npc=('Hello, how can I help?', 'Hallo, wie kann ich helfen?'),
           opts=[("Hello. I've got a sore throat.", 'Hallo. Ich habe Halsschmerzen.', 1),
                 ('Hello. My throat is sore me.', 'Hallo. Mein Hals ist wund mich.', 0),
                 ('Hello. I am a throat.', 'Hallo. Ich bin ein Hals.', 0)],
           hint='„I’ve got a sore throat.“'),
      dict(npc=('Oh dear. Have you got a temperature?', 'Oh je. Hast du Fieber?'),
           opts=[("No, I haven't. But my head hurts.", 'Nein. Aber mein Kopf tut weh.', 1),
                 ('No, I am not temperature.', 'Nein, ich bin nicht Fieber.', 0)],
           hint='Kurzantwort: „No, I haven’t.“ – und „my head hurts“.'),
      dict(npc=('Take these tablets twice a day, after meals.', 'Nimm diese Tabletten zweimal am Tag, nach dem Essen.'),
           opts=[('Twice a day. How much are they?', 'Zweimal am Tag. Wie viel kosten sie?', 1), ('Twice a meal day after.', 'Zweimal ein Essen Tag nach.', 0)],
           hint='Wiederholen, was man verstanden hat, ist immer gut.'),
      dict(npc=('Six euros. Get well soon!', 'Sechs Euro. Gute Besserung!'),
           opts=[('Thank you very much!', 'Vielen Dank!', 1), ('Get well soon too!', 'Dir auch gute Besserung!', 0)],
           hint='Auf „Get well soon!“ einfach „Thank you!“ (In Irland zahlt man übrigens mit Euro.)'),
    ],
    outro='Am Nachmittag geht es dir besser. Emma wartet schon vor dem Trinity College – mit einer Tasse Tee.'),
  mission=('My … hurts. Get well soon!', 'Zeig heute auf zehn Körperteile und benenne sie laut auf Englisch.'),
  radio=('RTÉ Radio 1', 'https://www.rte.ie/radio/radio1/'),
  letter=dict(en='See you soon in Dublin! Love, Emma.', de='Bis bald in Dublin! Liebe Grüße, Emma.', bridge=None),
)

LETTER = dict(
  prolog='Kurz vor deiner Reise klingelt es. Auf dem Fensterbrett sitzt ein großer schwarzer Rabe mit Posttasche: Rufus, einer der Raben aus dem Tower of London. Er bringt dir einen Brief auf Englisch. „Lesen kannst du ihn noch nicht ganz“, krächzt er. „Aber mit jedem Ort wird ein Satz lesbar. Ich fliege mit.“',
  finale='Dublin, vor dem Trinity College. Eine Frau mit grünem Schal winkt dir zu: „Hello! I’m Emma. Welcome to Dublin!“ Rufus landet auf ihrer Schulter. Du hast den ganzen Brief gelesen – und verstehst jedes Wort.',
)

LETTER_QUIZ = [
  (1, 'Wie heißt die Schreiberin, und wo wohnt sie?', ['Emma, in Dublin', 'Anna, in London', 'Emma, in Edinburgh']),
  (2, 'Welche Haustiere hat Emma?', ['zwei Katzen', 'zwei Hunde', 'keine']),
  (3, 'Was trinkt Emma jeden Morgen?', ['Tee mit Milch', 'Kaffee ohne Zucker', 'Orangensaft']),
  (4, 'Wo wohnt Emmas Bruder?', ['in Liverpool', 'in Manchester', 'in Belfast']),
  (6, 'Wie ist das Wetter in Dublin?', ['Es regnet oft', 'Es ist immer sonnig', 'Es schneit oft']),
  (7, 'Was schenkt Emma dir?', ['einen grünen Schal', 'einen roten Pullover', 'ein Buch']),
  (8, 'Wo liegt Emmas Schule?', ['neben einem großen Park', 'gegenüber dem Bahnhof', 'am See']),
  (10, 'Was ist Emma von Beruf?', ['Lehrerin', 'Ärztin', 'Ingenieurin']),
]

OUTLINE_GB = [
  [1.35, 51.13], [1.45, 51.38], [0.9, 51.5], [0.95, 51.75], [1.3, 51.95], [1.75, 52.48], [1.7, 52.75], [1.3, 52.95], [0.4, 52.95],
  [0.35, 53.1], [0.3, 53.45], [0.15, 53.6], [-0.1, 54.1], [-0.6, 54.5], [-1.2, 54.65], [-1.45, 55.0], [-1.6, 55.6], [-2.0, 55.8],
  [-2.6, 56.0], [-3.2, 55.98], [-2.8, 56.3], [-2.5, 56.6], [-2.1, 57.1], [-1.8, 57.5], [-2.5, 57.68], [-3.5, 57.7], [-4.2, 57.5],
  [-3.9, 57.85], [-3.1, 58.3], [-3.03, 58.64], [-3.4, 58.6], [-4.4, 58.55], [-5.0, 58.62], [-5.25, 58.3], [-5.45, 57.9], [-5.8, 57.55],
  [-5.65, 57.2], [-5.75, 56.75], [-6.2, 56.7], [-5.55, 56.45], [-5.6, 55.75], [-5.75, 55.3], [-4.9, 55.65], [-4.7, 55.45], [-5.0, 55.05],
  [-4.86, 54.64], [-4.4, 54.7], [-3.6, 54.95], [-3.4, 54.55], [-3.15, 54.1], [-2.95, 53.75], [-3.05, 53.4], [-3.3, 53.35], [-4.0, 53.3],
  [-4.6, 53.4], [-4.6, 53.15], [-4.7, 52.8], [-4.1, 52.8], [-4.05, 52.4], [-4.7, 52.1], [-5.3, 51.88], [-5.0, 51.65], [-4.2, 51.65],
  [-3.7, 51.5], [-3.1, 51.45], [-2.7, 51.6], [-3.0, 51.25], [-3.8, 51.2], [-4.55, 51.0], [-5.1, 50.6], [-5.7, 50.05], [-5.2, 50.0],
  [-4.2, 50.35], [-3.5, 50.6], [-2.5, 50.6], [-1.9, 50.7], [-1.0, 50.75], [0.25, 50.75], [1.0, 50.95], [1.35, 51.13]]
OUTLINE_IE = [
  [-7.37, 55.38], [-6.2, 55.2], [-5.7, 54.75], [-5.45, 54.35], [-6.0, 54.0], [-6.2, 53.65], [-6.1, 53.3], [-6.0, 52.95], [-6.25, 52.2],
  [-7.0, 52.15], [-7.85, 51.9], [-8.3, 51.8], [-9.4, 51.45], [-10.2, 51.6], [-10.4, 52.1], [-9.8, 52.6], [-9.3, 52.9], [-9.9, 53.4],
  [-10.1, 53.8], [-9.95, 54.25], [-8.6, 54.3], [-8.7, 54.65], [-8.4, 55.1], [-7.37, 55.38]]
