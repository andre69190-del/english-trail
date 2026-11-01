# English Trail – Trail 2 (A2): Großbritannien & Irland, 12 weitere Orte.
# Gleiches Format wie trail1.py. Passt zum Stoff Klasse 6–8 (going to, past simple, Vergleiche, must, present perfect, will).
# IDs nie ändern oder umsortieren (Lernstand hängt daran), nur hinten anhängen.

UNITS = []


def U(**k):
    k.setdefault('trail', 'blue')
    k['r'] = 2
    UNITS.append(k)


U(id='oxf', city='Oxford', cityDe='Oxford', lon=-1.26, lat=51.75, trail='blue',
  title='Schule und Pläne',
  can='Ich kann über meine Schule sprechen und sagen, was ich vorhabe (going to).',
  tip='Pläne drückst du mit „going to“ aus: „I’m going to study harder.“ – Im Gespräch klingt es oft wie „gonna“.',
  fact='Die Universität Oxford ist die älteste im englischsprachigen Raum – dort wurde schon vor über 900 Jahren unterrichtet.',
  words='''university | Universität
college | College
student | Student/in
teacher | Lehrer/in
head teacher | Schulleiter/in
library | Bibliothek
to study | lernen / studieren
to learn | lernen
exam | Prüfung
test | Test / Arbeit
mark | Note
to pass | bestehen
to fail | durchfallen
term | Schulhalbjahr / Trimester
holidays | Ferien
plan | Plan
future | Zukunft
I'm going to | ich werde (vorhaben)
next year | nächstes Jahr
after school | nach der Schule''',
  sentences=[
    ("I'm going to study for my exam tonight.", 'Ich werde heute Abend für meine Prüfung lernen.'),
    ('What are you going to do after school?', 'Was hast du nach der Schule vor?'),
    ('My favourite subject is history.', 'Mein Lieblingsfach ist Geschichte.'),
    ('We have got a test on Friday.', 'Wir schreiben am Freitag einen Test.'),
    ('I passed my English exam!', 'Ich habe meine Englischprüfung bestanden!'),
    ('The library is open until eight.', 'Die Bibliothek hat bis acht Uhr offen.'),
    ("Next year I'm going to learn Spanish.", 'Nächstes Jahr werde ich Spanisch lernen.'),
    ('Our term ends in July.', 'Unser Schuljahr endet im Juli.'),
  ],
  scene=dict(
    intro='Oxford, vor der berühmten Bodleian Library. Studentinnen mit Fahrrädern sausen vorbei. Ein Mädchen setzt sich neben dich auf die Treppe.',
    steps=[
      dict(npc=("Hi! Are you a student here?", 'Hi! Studierst du hier?'),
           opts=[("No, I'm still at school. I'm in year eight.", 'Nein, ich gehe noch zur Schule. Ich bin in der achten Klasse.', 1),
                 ("Yes, I'm a teacher's favourite.", 'Ja, ich bin Lehrers Liebling.', 0)],
           hint='Klassenstufe auf Englisch: „I’m in year eight.“'),
      dict(npc=("Cool! What's your favourite subject?", 'Cool! Was ist dein Lieblingsfach?'),
           opts=[("I really like maths and art.", 'Ich mag Mathe und Kunst sehr.', 1),
                 ("I'm going to the library yesterday.", 'Ich gehe gestern in die Bibliothek.', 0)],
           hint='„Favourite subject“ = Lieblingsfach. „Yesterday“ passt nicht zu „going to“.'),
      dict(npc=("And what are you going to do after school?", 'Und was hast du nach der Schule vor?'),
           opts=[("I'm going to study at a university like this one!", 'Ich werde an einer Uni wie dieser studieren!', 1),
                 ("I passed it last week.", 'Ich habe es letzte Woche bestanden.', 0)],
           hint='Pläne: „I’m going to …“'),
    ],
    outro='„Good luck!“, ruft sie und radelt davon. Vielleicht sitzt du in ein paar Jahren selbst hier.'),
)

U(id='cam', city='Cambridge', cityDe='Cambridge', lon=0.12, lat=52.21, trail='blue',
  title='Den Weg finden',
  can='Ich kann nach dem Weg fragen und eine Wegbeschreibung verstehen.',
  tip='Höflich fragen: „Excuse me, how do I get to …?“ Antworten kommen oft im Imperativ: „Go straight on, turn left …“',
  fact='In Cambridge fahren so viele Menschen Fahrrad wie in kaum einer anderen Stadt Großbritanniens – fast jeder Dritte fährt mit dem Rad zur Arbeit.',
  words='''bike | Fahrrad
to ride | fahren (Rad)
street | Straße
road | Straße / Landstraße
corner | Ecke
crossing | Überweg
traffic lights | Ampel
roundabout | Kreisverkehr
bridge | Brücke
river | Fluss
turn left | links abbiegen
turn right | rechts abbiegen
go straight on | geradeaus gehen
opposite | gegenüber
next to | neben
between | zwischen
near | nahe / in der Nähe
far | weit
map | Karte / Stadtplan
How do I get to …? | Wie komme ich zu …?''',
  sentences=[
    ('Excuse me, how do I get to the station?', 'Entschuldigung, wie komme ich zum Bahnhof?'),
    ('Go straight on and turn left at the traffic lights.', 'Geh geradeaus und bieg an der Ampel links ab.'),
    ("It's opposite the bank.", 'Es ist gegenüber der Bank.'),
    ('Is it far from here?', 'Ist es weit von hier?'),
    ("No, it's only five minutes on foot.", 'Nein, nur fünf Minuten zu Fuß.'),
    ('Cross the bridge and take the second road on the right.', 'Geh über die Brücke und nimm die zweite Straße rechts.'),
    ('The museum is between the café and the church.', 'Das Museum ist zwischen dem Café und der Kirche.'),
    ('Can you show me on the map?', 'Kannst du es mir auf der Karte zeigen?'),
  ],
  scene=dict(
    intro='Cambridge, am Fluss Cam. Du willst zum Fitzwilliam Museum, aber dein Handy-Akku ist leer. Ein Mann schließt gerade sein Fahrrad ab.',
    steps=[
      dict(npc=("You look lost. Can I help?", 'Du siehst verloren aus. Kann ich helfen?'),
           opts=[("Yes, please! How do I get to the Fitzwilliam Museum?", 'Ja, bitte! Wie komme ich zum Fitzwilliam Museum?', 1),
                 ("No, I'm a bike.", 'Nein, ich bin ein Fahrrad.', 0)],
           hint='„How do I get to …?“ = Wie komme ich zu …?'),
      dict(npc=("Go straight on, cross the bridge and turn right.", 'Geh geradeaus, über die Brücke und bieg rechts ab.'),
           opts=[("Straight on, over the bridge, then right. Is it far?", 'Geradeaus, über die Brücke, dann rechts. Ist es weit?', 1),
                 ("Turn left at the river and swim.", 'Bieg am Fluss links ab und schwimm.', 0)],
           hint='Wiederhole die Beschreibung kurz – so merkst du sie dir.'),
      dict(npc=("Not at all. It's opposite a big church.", 'Gar nicht. Es ist gegenüber einer großen Kirche.'),
           opts=[("Great, thank you very much!", 'Super, vielen Dank!', 1),
                 ("Between yesterday, please.", 'Zwischen gestern, bitte.', 0)],
           hint='Bedanken nicht vergessen.'),
    ],
    outro='Zehn Minuten später stehst du vor dem Museum – ganz ohne Handy.'),
)

U(id='str', city='Stratford-upon-Avon', cityDe='Stratford-upon-Avon', lon=-1.71, lat=52.19, trail='green', lab='l',
  title='Theater und Gefühle',
  can='Ich kann sagen, wie ich mich fühle und wie mir etwas gefallen hat.',
  tip='Vorsicht bei -ed und -ing: „I’m bored“ = mir ist langweilig, aber „I’m boring“ = ich bin langweilig!',
  fact='William Shakespeare wurde 1564 in Stratford geboren. Viele Redewendungen von ihm benutzt man heute noch, z. B. „break the ice“.',
  words='''theatre | Theater
play | Theaterstück
actor | Schauspieler
actress | Schauspielerin
stage | Bühne
audience | Publikum
ticket | Eintrittskarte
happy | glücklich
sad | traurig
angry | wütend
scared | ängstlich / erschrocken
nervous | nervös
excited | aufgeregt (vor Freude)
bored | gelangweilt
boring | langweilig
surprised | überrascht
funny | lustig
exciting | spannend
to feel | sich fühlen
How do you feel? | Wie fühlst du dich?''',
  sentences=[
    ("I'm so excited – the play starts in ten minutes!", 'Ich bin so aufgeregt – das Stück beginnt in zehn Minuten!'),
    ('How did you feel at the end?', 'Wie hast du dich am Ende gefühlt?'),
    ('The first part was a bit boring.', 'Der erste Teil war etwas langweilig.'),
    ('I was scared when the ghost appeared.', 'Ich hatte Angst, als der Geist erschien.'),
    ('The actors were really funny.', 'Die Schauspieler waren echt lustig.'),
    ("Don't be nervous, you'll be great!", 'Sei nicht nervös, du wirst super sein!'),
    ('Romeo and Juliet is a very sad story.', 'Romeo und Julia ist eine sehr traurige Geschichte.'),
    ('We bought two tickets for tonight.', 'Wir haben zwei Karten für heute Abend gekauft.'),
  ],
  scene=dict(
    intro='Stratford, Pause im Royal Shakespeare Theatre. Neben dir an der Saftbar steht ein Junge in deinem Alter.',
    steps=[
      dict(npc=("So, how do you like the play?", 'Und, wie gefällt dir das Stück?'),
           opts=[("I love it! It's really exciting.", 'Ich liebe es! Es ist richtig spannend.', 1),
                 ("I'm very boring, thanks.", 'Ich bin sehr langweilig, danke.', 0)],
           hint='Das Stück ist „exciting“ (-ing). Du bist „excited“ (-ed).'),
      dict(npc=("Me too! Were you scared of the witches?", 'Ich auch! Hattest du Angst vor den Hexen?'),
           opts=[("A little! I was really surprised when they appeared.", 'Ein bisschen! Ich war echt überrascht, als sie auftauchten.', 1),
                 ("Yes, I'm going to be scared yesterday.", 'Ja, ich werde gestern Angst haben.', 0)],
           hint='Über die Vergangenheit: „I was …“'),
      dict(npc=("My sister is an actress in this play – she's very nervous.", 'Meine Schwester spielt in dem Stück – sie ist sehr nervös.'),
           opts=[("Tell her she's great!", 'Sag ihr, dass sie super ist!', 1),
                 ("Is she a ticket?", 'Ist sie eine Eintrittskarte?', 0)],
           hint='Ein netter Satz zum Mutmachen.'),
    ],
    outro='Der Gong ertönt. Ihr eilt zurück zu euren Plätzen – zweiter Teil!'),
)

U(id='sth', city='Stonehenge', cityDe='Stonehenge', lon=-1.83, lat=51.18, trail='green', lab='l',
  title='Was ist passiert?',
  can='Ich kann erzählen, was gestern oder letztes Wochenende passiert ist (simple past).',
  tip='Regelmäßige Verben bekommen -ed (walked, visited). Die wichtigsten unregelmäßigen lernst du am besten als Lied: go – went, see – saw, take – took …',
  fact='Die ältesten Teile von Stonehenge sind rund 5000 Jahre alt. Wie die tonnenschweren Steine hierherkamen, wird bis heute erforscht.',
  words='''stone | Stein
circle | Kreis
mystery | Rätsel / Geheimnis
ancient | uralt
to discover | entdecken
to build | bauen
built | gebaut
went | ging / fuhr
saw | sah
took | nahm
had | hatte
was | war
were | waren
yesterday | gestern
last weekend | letztes Wochenende
ago | vor (zeitlich)
first | zuerst
then | dann
after that | danach
finally | schließlich''',
  sentences=[
    ('Last weekend we went to Stonehenge.', 'Letztes Wochenende sind wir nach Stonehenge gefahren.'),
    ('First we took the bus, then we walked.', 'Zuerst nahmen wir den Bus, dann sind wir gelaufen.'),
    ('The stones were bigger than I thought.', 'Die Steine waren größer, als ich dachte.'),
    ('People built it about 5,000 years ago.', 'Menschen haben es vor etwa 5000 Jahren gebaut.'),
    ('We saw the sunrise – it was amazing!', 'Wir haben den Sonnenaufgang gesehen – er war fantastisch!'),
    ('Did you have a good time?', 'Hattest du eine schöne Zeit?'),
    ("I didn't take any photos.", 'Ich habe keine Fotos gemacht.'),
    ('Finally we had a picnic.', 'Zum Schluss haben wir gepicknickt.'),
  ],
  scene=dict(
    intro='Stonehenge am frühen Morgen. Nebel liegt über der Wiese. Eine Reporterin vom Schulradio deiner Partnerschule interviewt Besucher.',
    steps=[
      dict(npc=("Hi! When did you arrive here?", 'Hi! Wann bist du hier angekommen?'),
           opts=[("We arrived yesterday evening.", 'Wir sind gestern Abend angekommen.', 1),
                 ("We arrive tomorrow ago.", 'Wir kommen morgen vor an.', 0)],
           hint='Vergangenheit: arrive → arrived. „Yesterday“ = gestern.'),
      dict(npc=("And what did you do this morning?", 'Und was hast du heute Morgen gemacht?'),
           opts=[("We saw the sunrise and took lots of photos.", 'Wir haben den Sonnenaufgang gesehen und viele Fotos gemacht.', 1),
                 ("We see the sunrise next week.", 'Wir sehen den Sonnenaufgang nächste Woche.', 0)],
           hint='see → saw, take → took (unregelmäßig).'),
      dict(npc=("Wonderful! Was it cold?", 'Wunderbar! War es kalt?'),
           opts=[("Yes, it was really cold, but it was worth it!", 'Ja, es war richtig kalt, aber es hat sich gelohnt!', 1),
                 ("Yes, it were cold tomorrow.", 'Ja, es waren kalt morgen.', 0)],
           hint='it → was, we/they → were.'),
    ],
    outro='Dein Interview läuft nächste Woche im Schulradio. Ganz im simple past!'),
)

U(id='cnt', city='Canterbury', cityDe='Canterbury', lon=1.08, lat=51.28, trail='green',
  title='In der Gastfamilie',
  can='Ich kann Regeln verstehen und fragen, was ich darf und was ich muss (must, mustn’t, can).',
  tip='„You mustn’t …“ heißt „du darfst nicht“ – nicht „du musst nicht“! „Du musst nicht“ = „you don’t have to“.',
  fact='Canterbury liegt nur eine Stunde von Dover entfernt – viele Schülergruppen vom Festland wohnen hier bei Gastfamilien.',
  words='''host family | Gastfamilie
guest | Gast
bedroom | Schlafzimmer
key | Schlüssel
rule | Regel
must | muss
mustn't | darf nicht
don't have to | muss nicht
can | kann / darf
allowed | erlaubt
to be home | zu Hause sein
dinner | Abendessen
to tidy | aufräumen
shower | Dusche
towel | Handtuch
Wi-Fi password | WLAN-Passwort
to borrow | ausleihen
to help | helfen
quiet | leise / ruhig
late | spät''',
  sentences=[
    ('You must be home by nine o’clock.', 'Du musst um neun Uhr zu Hause sein.'),
    ("You mustn't eat in your bedroom.", 'Du darfst nicht in deinem Zimmer essen.'),
    ("You don't have to make your bed.", 'Du musst dein Bett nicht machen.'),
    ('Can I have the Wi-Fi password, please?', 'Kann ich bitte das WLAN-Passwort haben?'),
    ('Dinner is at half past six.', 'Abendessen gibt es um halb sieben.'),
    ('Can I borrow a towel?', 'Kann ich mir ein Handtuch leihen?'),
    ('Please be quiet after ten.', 'Bitte sei nach zehn leise.'),
    ('Can I help you with the dishes?', 'Kann ich dir beim Abwasch helfen?'),
  ],
  scene=dict(
    intro='Canterbury, ein kleines Reihenhaus mit roter Tür. Deine Gastmutter Mrs Patel öffnet und lächelt.',
    steps=[
      dict(npc=("Welcome! You must be tired. Here's your key.", 'Willkommen! Du bist bestimmt müde. Hier ist dein Schlüssel.'),
           opts=[("Thank you! Nice to meet you, Mrs Patel.", 'Danke! Schön, Sie kennenzulernen, Mrs Patel.', 1),
                 ("I mustn't key.", 'Ich darf nicht Schlüssel.', 0)],
           hint='Freundlich bedanken und begrüßen.'),
      dict(npc=("Just one rule: you must be home by nine.", 'Nur eine Regel: Du musst um neun zu Hause sein.'),
           opts=[("OK, no problem. Can I have the Wi-Fi password, please?", 'Okay, kein Problem. Kann ich bitte das WLAN-Passwort haben?', 1),
                 ("Yes, I must be late.", 'Ja, ich muss spät sein.', 0)],
           hint='Höflich um etwas bitten: „Can I have …, please?“'),
      dict(npc=("Of course, it's on the fridge. Dinner is at half past six.", 'Natürlich, es hängt am Kühlschrank. Abendessen gibt es um halb sieben.'),
           opts=[("Great! Can I help you with dinner?", 'Super! Kann ich beim Abendessen helfen?', 1),
                 ("I don't have to dinner.", 'Ich muss nicht Abendessen.', 0)],
           hint='Hilfe anbieten kommt in Gastfamilien gut an.'),
    ],
    outro='Mrs Patel strahlt: „What a lovely guest!“ Der Start ist geglückt.'),
)

U(id='siv', city='St Ives', cityDe='St Ives (Cornwall)', lon=-5.48, lat=50.21, trail='yellow', lab='l',
  title='Strand, Wetter, Kleidung',
  can='Ich kann über das Wetter sprechen und sagen, was ich anziehe.',
  tip='Briten reden gern übers Wetter – das ist der perfekte Gesprächsanfang: „Lovely day, isn’t it?“',
  fact='Cornwall hat eine eigene keltische Sprache, Kornisch. „Kernow“ ist der kornische Name für Cornwall.',
  words='''weather | Wetter
sunny | sonnig
cloudy | bewölkt
windy | windig
rainy | regnerisch
it's raining | es regnet
hot | heiß
cold | kalt
warm | warm
temperature | Temperatur
beach | Strand
wave | Welle
surfboard | Surfbrett
swimsuit | Badeanzug
shorts | kurze Hose
T-shirt | T-Shirt
jumper | Pullover
jacket | Jacke
sunglasses | Sonnenbrille
to wear | tragen (Kleidung)''',
  sentences=[
    ("It's sunny but very windy today.", 'Heute ist es sonnig, aber sehr windig.'),
    ('What’s the weather like in Germany?', 'Wie ist das Wetter in Deutschland?'),
    ("Take a jumper – it's cold in the evening.", 'Nimm einen Pullover mit – abends ist es kalt.'),
    ("I'm wearing shorts and a T-shirt.", 'Ich trage kurze Hosen und ein T-Shirt.'),
    ('The waves are perfect for surfing!', 'Die Wellen sind perfekt zum Surfen!'),
    ("It's raining again – let's go to the café.", 'Es regnet schon wieder – lass uns ins Café gehen.'),
    ('Lovely day, isn’t it?', 'Schöner Tag, nicht wahr?'),
    ("Don't forget your sunglasses.", 'Vergiss deine Sonnenbrille nicht.'),
  ],
  scene=dict(
    intro='St Ives, Porthmeor Beach. Surfer warten auf die nächste Welle. Eine ältere Dame mit Hund setzt sich neben dein Handtuch.',
    steps=[
      dict(npc=("Lovely day, isn't it?", 'Schöner Tag, nicht wahr?'),
           opts=[("Yes, it's beautiful! Nice and sunny.", 'Ja, wunderschön! Schön sonnig.', 1),
                 ("No, I'm a jumper.", 'Nein, ich bin ein Pullover.', 0)],
           hint='Einfach zustimmen und das Wetter beschreiben.'),
      dict(npc=("Enjoy it – it's going to rain this afternoon.", 'Genieß es – heute Nachmittag wird es regnen.'),
           opts=[("Oh no! Good thing I've got my jacket.", 'Oh nein! Gut, dass ich meine Jacke dabeihabe.', 1),
                 ("Yes, it's raining yesterday.", 'Ja, es regnet gestern.', 0)],
           hint='Reagiere auf die Vorhersage – was hast du dabei?'),
      dict(npc=("Is it warmer in Germany?", 'Ist es in Deutschland wärmer?'),
           opts=[("In summer, yes. But in winter it's much colder.", 'Im Sommer ja. Aber im Winter ist es viel kälter.', 1),
                 ("Yes, Germany is a surfboard.", 'Ja, Deutschland ist ein Surfbrett.', 0)],
           hint='Vergleich: warmer, colder.'),
    ],
    outro='Pünktlich um drei fängt es an zu regnen. Die Dame zwinkert dir zu: „Told you!“'),
)

U(id='snw', city='Snowdonia', cityDe='Snowdonia (Eryri)', lon=-4.08, lat=53.07, trail='yellow', lab='l',
  title='Natur und Vergleiche',
  can='Ich kann Dinge vergleichen: größer, am höchsten, schöner als …',
  tip='Kurze Adjektive: -er/-est (high, higher, the highest). Lange: more/most (more beautiful). Ausnahmen: good – better – the best.',
  fact='Der Snowdon (walisisch Yr Wyddfa) ist mit 1085 m der höchste Berg von Wales. Auf Walisisch heißt der Nationalpark „Eryri“.',
  words='''mountain | Berg
hill | Hügel
lake | See
valley | Tal
forest | Wald
waterfall | Wasserfall
path | Weg / Pfad
top | Gipfel / Spitze
high | hoch
higher | höher
the highest | am höchsten
long | lang
steep | steil
easy | einfach
difficult | schwierig
more beautiful | schöner
better | besser
the best | am besten
than | als
to climb | (be)steigen / klettern''',
  sentences=[
    ('Snowdon is the highest mountain in Wales.', 'Der Snowdon ist der höchste Berg in Wales.'),
    ('This path is steeper than the other one.', 'Dieser Weg ist steiler als der andere.'),
    ('The lake is more beautiful than in the photos.', 'Der See ist schöner als auf den Fotos.'),
    ("Let's climb to the top!", 'Lass uns bis zum Gipfel steigen!'),
    ('Going down is easier than going up.', 'Runtergehen ist einfacher als Hochgehen.'),
    ('This is the best view I have ever seen.', 'Das ist die beste Aussicht, die ich je gesehen habe.'),
    ('The waterfall is in the valley.', 'Der Wasserfall ist im Tal.'),
    ('Is the long path more difficult?', 'Ist der lange Weg schwieriger?'),
  ],
  scene=dict(
    intro='Snowdonia, am Fuß des Snowdon. Zwei Wanderwege, ein Schild auf Walisisch und Englisch. Ein Ranger trinkt Tee aus einer Thermoskanne.',
    steps=[
      dict(npc=("Morning! Which path are you taking?", 'Morgen! Welchen Weg nimmst du?'),
           opts=[("Which one is easier?", 'Welcher ist einfacher?', 1),
                 ("The highest tea, please.", 'Den höchsten Tee, bitte.', 0)],
           hint='Frag nach einem Vergleich: easier.'),
      dict(npc=("The Llanberis Path is longer, but it's not as steep.", 'Der Llanberis-Weg ist länger, aber nicht so steil.'),
           opts=[("Then I'll take the Llanberis Path. Is the view good?", 'Dann nehme ich den Llanberis-Weg. Ist die Aussicht gut?', 1),
                 ("Then it is steepest than long.", 'Dann ist es steilst als lang.', 0)],
           hint='Entscheide dich und frag nach der Aussicht.'),
      dict(npc=("It's the best view in Wales – if it isn't cloudy!", 'Es ist die beste Aussicht in Wales – wenn es nicht bewölkt ist!'),
           opts=[("Great! I hope it's sunnier than yesterday.", 'Super! Hoffentlich ist es sonniger als gestern.', 1),
                 ("I'm more cloudy than you.", 'Ich bin bewölkter als du.', 0)],
           hint='sunny → sunnier (than).'),
    ],
    outro='Drei Stunden später stehst du oben. Unter dir liegen Seen, Täler und – zum Glück – keine einzige Wolke.'),
)

U(id='gla', city='Glasgow', cityDe='Glasgow', lon=-4.25, lat=55.86, trail='red', lab='l',
  title='Sport: Hast du schon mal …?',
  can='Ich kann fragen und erzählen, was ich schon einmal gemacht habe (present perfect).',
  tip='„Have you ever …?“ fragt nach Erfahrungen, ohne Zeitpunkt. Mit Zeitangabe (yesterday, in 2024) nimmst du das simple past.',
  fact='In Glasgow gibt es drei große Fußballstadien. Das Spiel Celtic gegen Rangers heißt „Old Firm“ und ist eines der berühmtesten Derbys der Welt.',
  words='''match | Spiel
team | Mannschaft
player | Spieler/in
fan | Fan
goal | Tor
to score | (ein Tor) schießen
to win | gewinnen
to lose | verlieren
draw | Unentschieden
stadium | Stadion
coach | Trainer/in
training | Training
Have you ever …? | Hast du schon einmal …?
I have never | ich habe noch nie
already | schon
yet | schon / noch (nicht)
been | gewesen
seen | gesehen
played | gespielt
won | gewonnen''',
  sentences=[
    ('Have you ever been to a football match?', 'Warst du schon einmal bei einem Fußballspiel?'),
    ("I've never seen a real stadium.", 'Ich habe noch nie ein echtes Stadion gesehen.'),
    ('Our team has won three matches this season.', 'Unser Team hat diese Saison drei Spiele gewonnen.'),
    ("Have you finished your training yet?", 'Bist du schon mit dem Training fertig?'),
    ("She's already scored two goals.", 'Sie hat schon zwei Tore geschossen.'),
    ('It was a draw: two – two.', 'Es war unentschieden: zwei zu zwei.'),
    ('The coach is very strict.', 'Der Trainer ist sehr streng.'),
    ("I've played hockey but I've never played rugby.", 'Ich habe schon Hockey gespielt, aber noch nie Rugby.'),
  ],
  scene=dict(
    intro='Glasgow, vor dem Hampden Park. Es ist Länderspieltag, überall Schals in Blau. Ein Mädchen mit Trikot fragt dich nach einem Foto.',
    steps=[
      dict(npc=("Can you take a photo of us? … Thanks! Have you ever been to a match here?", 'Kannst du ein Foto von uns machen? … Danke! Warst du schon mal bei einem Spiel hier?'),
           opts=[("No, never! It's my first time.", 'Nein, noch nie! Es ist mein erstes Mal.', 1),
                 ("Yes, I go yesterday.", 'Ja, ich gehe gestern.', 0)],
           hint='„Have you ever …?“ → „No, never.“ / „Yes, I have.“'),
      dict(npc=("Brilliant! Do you play football?", 'Klasse! Spielst du Fußball?'),
           opts=[("Yes, in a club. I've scored five goals this season!", 'Ja, im Verein. Ich habe diese Saison fünf Tore geschossen!', 1),
                 ("Yes, I am a stadium.", 'Ja, ich bin ein Stadion.', 0)],
           hint='present perfect: I’ve scored …'),
      dict(npc=("Wow! Have you seen Scotland play before?", 'Wow! Hast du Schottland schon mal spielen sehen?'),
           opts=[("Only on TV. I've never seen them live.", 'Nur im Fernsehen. Ich habe sie noch nie live gesehen.', 1),
                 ("I have never yesterday.", 'Ich habe nie gestern.', 0)],
           hint='never + seen.'),
    ],
    outro='Das Stadion bebt, als das erste Tor fällt. Jetzt hast du es erlebt!'),
)

U(id='sky', city='Isle of Skye', cityDe='Isle of Skye', lon=-6.19, lat=57.41, trail='red', lab='l',
  title='Tiere und Umwelt',
  can='Ich kann über Tiere und Umweltschutz sprechen und sagen, was man tun sollte (should).',
  tip='Ratschläge gibst du mit „should“: „We should use less plastic.“ Verneint: „shouldn’t“.',
  fact='Vor der Isle of Skye kann man Delfine, Robben und manchmal sogar Wale beobachten. Der Name „Skye“ kommt vermutlich vom altnordischen Wort für Wolke.',
  words='''animal | Tier
seal | Robbe
dolphin | Delfin
whale | Wal
eagle | Adler
sheep | Schaf
deer | Hirsch / Reh
island | Insel
nature | Natur
environment | Umwelt
plastic | Plastik
rubbish | Müll
to recycle | recyceln
to protect | schützen
to pollute | verschmutzen
climate | Klima
should | sollte
shouldn't | sollte nicht
to save | retten / sparen
wild | wild''',
  sentences=[
    ('Look – there are seals on the rocks!', 'Schau – da sind Robben auf den Felsen!'),
    ('We should protect wild animals.', 'Wir sollten wilde Tiere schützen.'),
    ("You shouldn't leave rubbish on the beach.", 'Man sollte keinen Müll am Strand lassen.'),
    ('Plastic pollutes the sea.', 'Plastik verschmutzt das Meer.'),
    ('Do you recycle at home?', 'Recycelt ihr zu Hause?'),
    ('An eagle is flying over the island.', 'Ein Adler fliegt über die Insel.'),
    ('There are more sheep than people here.', 'Hier gibt es mehr Schafe als Menschen.'),
    ('We can all help to save the environment.', 'Wir alle können helfen, die Umwelt zu retten.'),
  ],
  scene=dict(
    intro='Isle of Skye, ein kleines Boot schaukelt in der Bucht. Die Kapitänin zeigt auf etwas Glänzendes im Wasser.',
    steps=[
      dict(npc=("Look over there! Can you see them?", 'Schau mal da drüben! Siehst du sie?'),
           opts=[("Yes! Are those dolphins?", 'Ja! Sind das Delfine?', 1),
                 ("Yes, I can see rubbish yesterday.", 'Ja, ich sehe Müll gestern.', 0)],
           hint='Frag nach, was du siehst.'),
      dict(npc=("They are! But there's less fish for them every year.", 'Ja! Aber es gibt jedes Jahr weniger Fisch für sie.'),
           opts=[("That's sad. What should we do?", 'Das ist traurig. Was sollten wir tun?', 1),
                 ("Great, more plastic!", 'Super, mehr Plastik!', 0)],
           hint='Reagiere mitfühlend und frag nach Ratschlägen: „What should we do?“'),
      dict(npc=("We should use less plastic and keep the sea clean.", 'Wir sollten weniger Plastik benutzen und das Meer sauber halten.'),
           opts=[("I'll start today – no more plastic bottles!", 'Ich fange heute an – keine Plastikflaschen mehr!', 1),
                 ("You shouldn't dolphins.", 'Du solltest nicht Delfine.', 0)],
           hint='Ein eigener Vorsatz passt gut.'),
    ],
    outro='Ein Delfin springt direkt neben dem Boot aus dem Wasser – als hätte er zugehört.'),
)

U(id='gal', city='Galway', cityDe='Galway', lon=-9.05, lat=53.27, trail='black', lab='l',
  title='Musik und Einladungen',
  can='Ich kann jemanden einladen, eine Einladung annehmen oder höflich absagen.',
  tip='Einladen: „Would you like to …?“ Annehmen: „I’d love to!“ Absagen: „Sorry, I can’t. I have to …“',
  fact='In Galway spielen fast jeden Abend Musiker in den Pubs traditionelle irische Musik – diese Treffen heißen „sessions“.',
  words='''music | Musik
band | Band
singer | Sänger/in
song | Lied
concert | Konzert
festival | Festival
fiddle | Geige (Volksmusik)
to dance | tanzen
to sing | singen
Would you like to …? | Möchtest du …?
I'd love to! | Sehr gern!
Sorry, I can't. | Tut mir leid, ich kann nicht.
I have to … | Ich muss …
maybe | vielleicht
tonight | heute Abend
tomorrow | morgen
weekend | Wochenende
invitation | Einladung
to meet | (sich) treffen
Let's … | Lass(t) uns …''',
  sentences=[
    ('Would you like to come to the concert tonight?', 'Möchtest du heute Abend mit zum Konzert?'),
    ("I'd love to! What time does it start?", 'Sehr gern! Wann fängt es an?'),
    ("Sorry, I can't. I have to babysit my brother.", 'Tut mir leid, ich kann nicht. Ich muss auf meinen Bruder aufpassen.'),
    ("Let's meet at the bridge at seven.", 'Lass uns um sieben an der Brücke treffen.'),
    ('Maybe we can meet tomorrow?', 'Vielleicht können wir uns morgen treffen?'),
    ('This song is my favourite!', 'Dieses Lied ist mein Lieblingslied!'),
    ('Thanks for the invitation.', 'Danke für die Einladung.'),
    ('Do you want to dance?', 'Willst du tanzen?'),
  ],
  scene=dict(
    intro='Galway, Shop Street. Ein Straßenmusiker spielt Geige, Leute tanzen. Siobhán aus deiner Sprachschule winkt dir zu.',
    steps=[
      dict(npc=("Hi! Would you like to come to a music session tonight?", 'Hi! Hast du Lust, heute Abend zu einer Musik-Session zu kommen?'),
           opts=[("I'd love to! Where is it?", 'Sehr gern! Wo ist sie?', 1),
                 ("Would you like to me?", 'Möchtest du mich?', 0)],
           hint='Annehmen: „I’d love to!“'),
      dict(npc=("At a pub by the river. Kids can come until nine.", 'In einem Pub am Fluss. Kinder dürfen bis neun bleiben.'),
           opts=[("Perfect. Let's meet at seven at the bridge.", 'Perfekt. Lass uns um sieben an der Brücke treffen.', 1),
                 ("Sorry, I'm a fiddle.", 'Tut mir leid, ich bin eine Geige.', 0)],
           hint='Treffpunkt vorschlagen: „Let’s meet …“'),
      dict(npc=("Great! And on Saturday there's a festival. Can you come?", 'Super! Und am Samstag ist ein Festival. Kannst du kommen?'),
           opts=[("Sorry, I can't on Saturday. I have to go home.", 'Tut mir leid, Samstag kann ich nicht. Ich muss nach Hause fahren.', 1),
                 ("Yes, I can't love.", 'Ja, ich kann nicht lieben.', 0)],
           hint='Höflich absagen mit Grund.'),
    ],
    outro='Abends sitzt ihr im Pub, die Geigen spielen, und am Ende tanzt sogar der Wirt.'),
)

U(id='crk', city='Cork', cityDe='Cork', lon=-8.47, lat=51.90, trail='black', lab='l',
  title='Auf dem Markt',
  can='Ich kann Essen einkaufen, nach Preisen und Mengen fragen und sagen, was ich mag.',
  tip='Zählbares: „How many apples?“ – Unzählbares: „How much cheese?“ Ein Stück: „a piece of cake“.',
  fact='Der English Market in Cork ist seit 1788 in Betrieb. Sogar Queen Elizabeth II. hat ihn 2011 besucht.',
  words='''market | Markt
stall | Stand
fresh | frisch
fruit | Obst
vegetables | Gemüse
cheese | Käse
bread | Brot
fish | Fisch
meat | Fleisch
cake | Kuchen
How much is …? | Was kostet …?
How many …? | Wie viele …?
a piece of | ein Stück
half a kilo | ein halbes Kilo
euro | Euro
cent | Cent
change | Wechselgeld
to taste | probieren / schmecken
delicious | lecker
vegetarian | vegetarisch''',
  sentences=[
    ('How much is the cheese?', 'Wie viel kostet der Käse?'),
    ("Half a kilo of strawberries, please.", 'Ein halbes Kilo Erdbeeren, bitte.'),
    ('Can I taste it?', 'Darf ich probieren?'),
    ('This bread is still warm – delicious!', 'Das Brot ist noch warm – lecker!'),
    ("I'm vegetarian, so no meat for me.", 'Ich bin Vegetarier/in, also kein Fleisch für mich.'),
    ('How many apples would you like?', 'Wie viele Äpfel möchtest du?'),
    ("Here's your change.", 'Hier ist Ihr Wechselgeld.'),
    ('Can I have a piece of chocolate cake?', 'Kann ich ein Stück Schokokuchen haben?'),
  ],
  scene=dict(
    intro='Cork, im English Market. Es duftet nach frischem Brot und Käse. Ein Verkäufer mit Schürze ruft: „Fresh today!“',
    steps=[
      dict(npc=("Hello there! What can I get you?", 'Hallo! Was darf ich dir geben?'),
           opts=[("Hello! How much is the cheese?", 'Hallo! Was kostet der Käse?', 1),
                 ("How many is cheese?", 'Wie viele ist Käse?', 0)],
           hint='Preis fragen: „How much is …?“'),
      dict(npc=("Three euros for a piece. Would you like to taste it?", 'Drei Euro das Stück. Möchtest du probieren?'),
           opts=[("Yes, please! … Mmm, delicious. I'll take a piece.", 'Ja, bitte! … Mmm, lecker. Ich nehme ein Stück.', 1),
                 ("No, I'm a vegetable.", 'Nein, ich bin ein Gemüse.', 0)],
           hint='Probieren, loben, kaufen.'),
      dict(npc=("Anything else?", 'Sonst noch etwas?'),
           opts=[("Half a kilo of apples, please. That's all.", 'Ein halbes Kilo Äpfel, bitte. Das ist alles.', 1),
                 ("Yes, change, please.", 'Ja, Wechselgeld, bitte.', 0)],
           hint='Menge angeben und abschließen: „That’s all.“'),
    ],
    outro='Mit Käse, Äpfeln und einem Stück Kuchen „on the house“ gehst du weiter.'),
)

U(id='ncl', city='Newcastle', cityDe='Newcastle upon Tyne', lon=-1.61, lat=54.97, trail='black',
  title='Berufe und Zukunft',
  can='Ich kann über Berufe sprechen und Vermutungen über die Zukunft äußern (will).',
  tip='„Will“ für Vermutungen und spontane Entscheidungen: „I think I’ll be a vet.“ Für feste Pläne nimmst du „going to“.',
  fact='Die Menschen aus Newcastle heißen „Geordies“ und haben einen eigenen, sehr bekannten Dialekt – „Howay man!“ heißt so viel wie „Komm schon!“.',
  words='''job | Beruf / Job
to work | arbeiten
doctor | Arzt / Ärztin
nurse | Pfleger/in
vet | Tierarzt / Tierärztin
engineer | Ingenieur/in
programmer | Programmierer/in
police officer | Polizist/in
chef | Koch / Köchin
farmer | Landwirt/in
pilot | Pilot/in
designer | Designer/in
office | Büro
company | Firma
to earn | verdienen
will | werden (Zukunft)
I think I'll … | Ich glaube, ich werde …
probably | wahrscheinlich
dream | Traum
one day | eines Tages''',
  sentences=[
    ('What do you want to be?', 'Was möchtest du werden?'),
    ("I think I'll be a vet – I love animals.", 'Ich glaube, ich werde Tierärztin – ich liebe Tiere.'),
    ('My mum works as a nurse.', 'Meine Mutter arbeitet als Krankenpflegerin.'),
    ('One day I will build robots.', 'Eines Tages werde ich Roboter bauen.'),
    ('Programmers probably earn a lot of money.', 'Programmierer verdienen wahrscheinlich viel Geld.'),
    ("It will be difficult, but it's my dream.", 'Es wird schwierig, aber es ist mein Traum.'),
    ('He works for a big company.', 'Er arbeitet für eine große Firma.'),
    ("I'll help you with your homework.", 'Ich helfe dir bei den Hausaufgaben.'),
  ],
  scene=dict(
    intro='Newcastle, Berufsmesse in der Schule deiner Austauschpartnerin Amy. An einem Stand kann man Drohnen steuern.',
    steps=[
      dict(npc=("Hi! Are you interested in engineering?", 'Hi! Interessierst du dich für Technik?'),
           opts=[("Yes! I think I'll be an engineer one day.", 'Ja! Ich glaube, ich werde eines Tages Ingenieur/in.', 1),
                 ("Yes, I am a job.", 'Ja, ich bin ein Beruf.', 0)],
           hint='Vermutung über die Zukunft: „I think I’ll …“'),
      dict(npc=("Brilliant! What do your parents do?", 'Klasse! Was machen deine Eltern beruflich?'),
           opts=[("My dad is a chef and my mum works in an office.", 'Mein Vater ist Koch und meine Mutter arbeitet in einem Büro.', 1),
                 ("They will be yesterday.", 'Sie werden gestern sein.', 0)],
           hint='Berufe: „is a …“, „works in/as …“'),
      dict(npc=("Do you want to try flying the drone?", 'Willst du mal die Drohne fliegen?'),
           opts=[("Yes, please! I'll be careful.", 'Ja, bitte! Ich passe auf.', 1),
                 ("No, I'll probably a pilot.", 'Nein, ich wahrscheinlich Pilot.', 0)],
           hint='Spontane Zusage: „I’ll …“'),
    ],
    outro='Die Drohne landet sicher. Amy grinst: „Howay man – you’re a natural!“'),
)


# Missionen (echtes Leben), Radio, Emmas Postkarten (ein Satz pro Ort, Simple-Past-lastig wie eine Urlaubskarte)
EXTRA = {
  'oxf': dict(mission=("I'm going to …", 'Schreib drei Sätze auf Englisch, was du nächste Woche vorhast („I’m going to …“), und lies sie jemandem vor.'),
              radio=('BBC Radio Oxford', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_oxford'),
              card=('Greetings from Oxford! I visited a very old library today.', 'Grüße aus Oxford! Ich habe heute eine sehr alte Bibliothek besucht.', 'Rufus flattert los: „Emma ist schon weiter nach Cambridge. Hinterher!“')),
  'cam': dict(mission=('Go straight on!', 'Beschreibe jemandem auf Englisch deinen Schulweg – mit „turn left“, „turn right“ und „go straight on“.'),
              radio=('BBC Radio Cambridgeshire', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_cambridge'),
              card=('I rode a bike along the river. I got lost twice!', 'Ich bin am Fluss Rad gefahren. Ich habe mich zweimal verfahren!', 'Rufus kichert: „Zweimal verfahren – typisch Emma. Nächste Karte: Stratford.“')),
  'str': dict(mission=('How do you feel?', 'Frag heute zwei Menschen „How do you feel today?“ und antworte selbst mit einem Gefühls-Adjektiv.'),
              radio=('BBC CWR', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_coventry_warwickshire'),
              card=('I saw a play by Shakespeare. I was so excited!', 'Ich habe ein Stück von Shakespeare gesehen. Ich war so aufgeregt!', 'Rufus verbeugt sich wie ein Schauspieler. „Weiter zu den alten Steinen!“')),
  'sth': dict(mission=('Last weekend …', 'Erzähl jemandem in fünf Sätzen auf Englisch, was du letztes Wochenende gemacht hast (went, saw, had …).'),
              radio=('BBC Radio Wiltshire', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_wiltshire'),
              card=('We watched the sunrise at Stonehenge. It was magic!', 'Wir haben in Stonehenge den Sonnenaufgang angeschaut. Es war magisch!', 'Rufus gähnt: „So früh aufgestanden … Emma wohnt jetzt bei einer Gastfamilie in Canterbury.“')),
  'cnt': dict(mission=('House rules', 'Schreib drei Regeln eurer Familie auf Englisch auf: „You must …“, „You mustn’t …“, „You don’t have to …“.'),
              radio=('BBC Radio Kent', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_kent'),
              card=('My host family is very nice, but I must be home by ten.', 'Meine Gastfamilie ist sehr nett, aber ich muss um zehn zu Hause sein.', 'Rufus: „Um zehn! Da schlafe ich schon. Ab ans Meer – nach Cornwall!“')),
  'siv': dict(mission=("What's the weather like?", 'Sag morgens beim Blick aus dem Fenster auf Englisch, wie das Wetter ist und was du deshalb anziehst.'),
              radio=('BBC Radio Cornwall', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_cornwall'),
              card=('It rained in the morning, but in the afternoon I went surfing!', 'Morgens hat es geregnet, aber nachmittags war ich surfen!', 'Rufus schüttelt Wassertropfen aus dem Gefieder: „Jetzt in die Berge von Wales!“')),
  'snw': dict(mission=('Bigger, better, the best', 'Vergleiche drei Dinge in deinem Zimmer auf Englisch: „My bed is bigger than my desk …“'),
              radio=('BBC Radio Cymru', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_cymru'),
              card=('I climbed the highest mountain in Wales. My legs hurt!', 'Ich bin auf den höchsten Berg von Wales gestiegen. Meine Beine tun weh!', 'Rufus fliegt voraus nach Norden: „Glasgow! Da ist heute ein Spiel.“')),
  'gla': dict(mission=('Have you ever …?', 'Stell drei Leuten eine „Have you ever …?“-Frage auf Englisch (z. B. „Have you ever been to London?“).'),
              radio=('BBC Radio Scotland', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_scotland_fm'),
              card=("I've never seen so many football fans!", 'Ich habe noch nie so viele Fußballfans gesehen!', 'Rufus trägt jetzt einen blauen Schal. „Zur Insel Skye – da gibt es Delfine!“')),
  'sky': dict(mission=('We should …', 'Überlege dir drei Dinge, die eure Familie für die Umwelt tun sollte, und schreib sie auf Englisch auf („We should …“).'),
              radio=('BBC Radio nan Gàidheal', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_nan_gaidheal'),
              card=('A dolphin swam next to our boat. We should protect the sea!', 'Ein Delfin ist neben unserem Boot geschwommen. Wir sollten das Meer schützen!', 'Rufus ist ganz still vor Staunen. Dann: „Übers Meer nach Irland – Galway!“')),
  'gal': dict(mission=('Would you like to …?', 'Lade jemanden auf Englisch zu etwas ein („Would you like to …?“) – oder sag höflich ab.'),
              radio=('RTÉ Radio 1', 'https://www.rte.ie/radio/radio1/'),
              card=('Would you like to come to a music session with me? I danced all night!', 'Möchtest du mit mir zu einer Musik-Session? Ich habe die ganze Nacht getanzt!', 'Rufus tanzt auf einem Bein. „Hunger! Auf zum Markt in Cork.“')),
  'crk': dict(mission=('How much is it?', 'Schreib einen Einkaufszettel auf Englisch mit Mengen („half a kilo of …“, „a piece of …“).'),
              radio=('RTÉ Radio 1', 'https://www.rte.ie/radio/radio1/'),
              card=('I bought cheese and cake at the market. Delicious!', 'Ich habe auf dem Markt Käse und Kuchen gekauft. Lecker!', 'Rufus hat Krümel am Schnabel. „Letzte Station: Newcastle. Emma wartet!“')),
  'ncl': dict(mission=("I think I'll be …", 'Erzähl jemandem auf Englisch, was du später werden möchtest und warum („I think I’ll be …“).'),
              radio=('BBC Radio Newcastle', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_newcastle'),
              card=("I'm in Newcastle now. Come and meet me – I'll be at the bridge!", 'Ich bin jetzt in Newcastle. Komm mich treffen – ich bin an der Brücke!', '')),
}
DIARY = dict(prolog='Emma ist wieder unterwegs – diesmal reist sie dir voraus und schickt von jedem Ort eine Postkarte. Rufus bringt sie dir.',
             finale='An der Millennium Bridge winkt Emma dir zu. „You did it! Your English is brilliant now.“ Rufus landet stolz auf deiner Schulter.')
