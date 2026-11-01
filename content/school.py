# English Trail – Schulmodus: Baden-Württemberg, Gymnasium, Englisch als 1. Fremdsprache, Klassen 5–10.
# Grundlage: Bildungsplan 2016 BW (Themen 3.x.1, Grammatik 3.x.3.8), siehe content/schule/RECHERCHE_BW.md.
# Eigene Inhalte – keine Texte oder Vokabellisten aus Lehrwerken.
# Jedes Lernpaket wird eine Einheit mit "pack": 1 und "sch": Klasse (erscheint nicht auf der Karte, nur im Bereich Schule).

STATES = [
  ('bw', 'Baden-Württemberg', 1), ('by', 'Bayern', 0), ('be', 'Berlin', 0), ('bb', 'Brandenburg', 0), ('hb', 'Bremen', 0),
  ('hh', 'Hamburg', 0), ('he', 'Hessen', 0), ('mv', 'Mecklenburg-Vorpommern', 0), ('ni', 'Niedersachsen', 0),
  ('nw', 'Nordrhein-Westfalen', 0), ('rp', 'Rheinland-Pfalz', 0), ('sl', 'Saarland', 0), ('sn', 'Sachsen', 0),
  ('st', 'Sachsen-Anhalt', 0), ('sh', 'Schleswig-Holstein', 0), ('th', 'Thüringen', 0),
]
TYPES = [('gym', 'Gymnasium', 1), ('rs', 'Realschule', 0), ('gms', 'Gemeinschaftsschule', 0), ('wrs', 'Werkrealschule / Hauptschule', 0)]
GRADES = [5, 6, 7, 8, 9, 10]
# Lehrwerke für BW-Gymnasium (nur Name/Band – Unit-Struktur folgt in Phase 5)
BOOKS = [
  ('gl25', 'Green Line – Ausgabe Baden-Württemberg G9 (ab 2025, Klett)'),
  ('gl16', 'Green Line – Ausgabe Baden-Württemberg (ältere Ausgabe, Klett)'),
  ('ac25', 'Access – Baden-Württemberg G9 (ab 2025, Cornelsen)'),
  ('other', 'anderes Lehrwerk / weiß ich nicht'),
]

PACKS = []


def K(**k):
    PACKS.append(k)


K(id='s5sch', grade=5, ico='🏫', name='My school', title='Meine Schule',
  can='Ich kann meine Schule, Fächer, Stundenplan und Klassenzimmer beschreiben.',
  tip='Simple present für Stundenplan und Gewohnheiten: „We have maths on Monday.“ – bei he/she/it das -s nicht vergessen: „Our teacher speaks German too.“',
  fact='In Großbritannien tragen fast alle Schülerinnen und Schüler eine Schuluniform, und die Schule dauert meist bis etwa 15.30 Uhr.',
  words='''school | Schule
classroom | Klassenzimmer
subject | Schulfach
maths | Mathe
history | Geschichte
art | Kunst
PE | Sport (Schulfach)
timetable | Stundenplan
lesson | Unterrichtsstunde
break | Pause
homework | Hausaufgaben
board | Tafel
exercise book | Heft
pencil case | Mäppchen
uniform | Schuluniform
rubber | Radiergummi''',
  sentences=[('We have English on Monday and Thursday.', 'Wir haben montags und donnerstags Englisch.'),
             ('My favourite subject is art.', 'Mein Lieblingsfach ist Kunst.'),
             ('Our classroom is on the first floor.', 'Unser Klassenzimmer ist im ersten Stock.'),
             ("I don't like maths homework.", 'Ich mag keine Mathe-Hausaufgaben.'),
             ('Can I borrow your rubber, please?', 'Kann ich bitte deinen Radiergummi leihen?'),
             ('The first lesson starts at a quarter to eight.', 'Die erste Stunde beginnt um Viertel vor acht.')],
  scene=dict(intro='Erster Tag an der Partnerschule in Brighton. Ein Mädchen in Schuluniform zeigt dir alles.',
             steps=[dict(npc=("Hi, I'm Mia! What's your favourite subject?", 'Hi, ich bin Mia! Was ist dein Lieblingsfach?'),
                         opts=[('My favourite subject is PE.', 'Mein Lieblingsfach ist Sport.', 1), ('My favourite subject PE.', 'Mein Lieblingsfach Sport.', 0)],
                         hint='Ganzer Satz mit „is“: „My favourite subject is …“'),
                    dict(npc=('Cool! Do you wear a uniform at your school?', 'Cool! Tragt ihr an deiner Schule eine Uniform?'),
                         opts=[("No, we don't.", 'Nein.', 1), ("No, we aren't.", 'Nein, wir sind nicht.', 0)],
                         hint='Kurzantwort auf eine do-Frage: „No, we don’t.“'),
                    dict(npc=('Lucky you! Come on, the lesson starts at nine.', 'Du Glückliche(r)! Komm, die Stunde beginnt um neun.'),
                         opts=[('Which lesson is it?', 'Welche Stunde ist es?', 1), ('Which lesson it is?', 'Welche Stunde es ist?', 0)],
                         hint='In Fragen mit „be“ steht das Verb vor dem Subjekt: „Which lesson is it?“')],
             outro='Es ist Geschichte – über die Römer in Britannien. Du verstehst fast alles.'))

K(id='s5hom', grade=5, ico='🏠', name='Home and pets', title='Zuhause und Haustiere',
  can='Ich kann mein Zuhause, mein Zimmer und meine Haustiere beschreiben.',
  tip='„There is / There are“ = es gibt: „There is a desk in my room. There are two windows.“ Ort mit Präpositionen: in, on, under, next to, behind.',
  fact='In Großbritannien wohnen viele Familien in Reihenhäusern (terraced houses) mit kleinem Garten hinter dem Haus.',
  words='''house | Haus
flat | Wohnung
bedroom | Schlafzimmer
kitchen | Küche
living room | Wohnzimmer
bathroom | Badezimmer
garden | Garten
upstairs | oben (im Haus)
downstairs | unten (im Haus)
there is | es gibt (Einzahl)
there are | es gibt (Mehrzahl)
under | unter
behind | hinter
pet | Haustier
guinea pig | Meerschweinchen
budgie | Wellensittich''',
  sentences=[('There is a big bed in my room.', 'In meinem Zimmer gibt es ein großes Bett.'),
             ('There are two cats in our garden.', 'In unserem Garten sind zwei Katzen.'),
             ('My bedroom is upstairs.', 'Mein Schlafzimmer ist oben.'),
             ('The cat is sleeping under the table.', 'Die Katze schläft unter dem Tisch.'),
             ('Have you got a pet?', 'Hast du ein Haustier?'),
             ('We live in a flat in the city centre.', 'Wir wohnen in einer Wohnung im Stadtzentrum.')],
  scene=dict(intro='Videoanruf mit deiner Brieffreundin Lily aus York. Sie will dein Zimmer sehen.',
             steps=[dict(npc=('Show me your room! Is that your bed?', 'Zeig mir dein Zimmer! Ist das dein Bett?'),
                         opts=[("Yes, and there is a desk next to it.", 'Ja, und daneben steht ein Schreibtisch.', 1), ('Yes, and it gives a desk next.', 'Ja, und es gibt einen Tisch neben.', 0)],
                         hint='„es gibt“ heißt „there is“, nicht „it gives“.'),
                    dict(npc=("What's that under your desk?", 'Was ist das unter deinem Schreibtisch?'),
                         opts=[("That's my guinea pig, Krümel!", 'Das ist mein Meerschweinchen Krümel!', 1), ('That are my guinea pig.', 'Das sind mein Meerschweinchen.', 0)],
                         hint='Einzahl: „That’s …“'),
                    dict(npc=('So cute! Where is your kitchen?', 'So süß! Wo ist eure Küche?'),
                         opts=[("It's downstairs.", 'Sie ist unten.', 1), ('It downstairs is.', 'Sie unten ist.', 0)],
                         hint='Wortstellung: It’s + Ort.')],
             outro='Lily zeigt dir auch ihr Zimmer – mit einem Poster von Big Ben.'))

K(id='s5hob', grade=5, ico='⚽', name='Hobbies and free time', title='Hobbys und Freizeit',
  can='Ich kann über meine Hobbys sprechen und sagen, wie oft ich etwas mache.',
  tip='Häufigkeitsadverbien stehen vor dem Vollverb, aber nach „be“: „I often play football.“ – „I’m never late.“',
  fact='Cricket und Rugby wurden in England erfunden; in Großbritannien spielen viele Kinder in Vereinen oder in der Schulmannschaft.',
  words='''hobby | Hobby
free time | Freizeit
play football | Fußball spielen
ride a bike | Fahrrad fahren
read | lesen
swim | schwimmen
dance | tanzen
draw | zeichnen
play the piano | Klavier spielen
always | immer
usually | normalerweise
often | oft
sometimes | manchmal
never | nie
club | Verein / AG
team | Mannschaft''',
  sentences=[('I often ride my bike to school.', 'Ich fahre oft mit dem Fahrrad zur Schule.'),
             ('My sister never plays computer games.', 'Meine Schwester spielt nie Computerspiele.'),
             ('We usually go swimming on Saturdays.', 'Wir gehen samstags normalerweise schwimmen.'),
             ('He is in the school football team.', 'Er ist in der Fußballmannschaft der Schule.'),
             ('What do you do in your free time?', 'Was machst du in deiner Freizeit?'),
             ('Can you play the piano?', 'Kannst du Klavier spielen?')],
  scene=dict(intro='In der Mittagspause in Brighton. Ein Junge fragt dich nach deinen Hobbys.',
             steps=[dict(npc=('What do you do in your free time?', 'Was machst du in deiner Freizeit?'),
                         opts=[('I often play football.', 'Ich spiele oft Fußball.', 1), ('I play often football.', 'Ich spiele oft Fußball (falsche Stellung).', 0)],
                         hint='Häufigkeitswörter stehen vor dem Verb: „I often play …“'),
                    dict(npc=('Me too! Are you in a club?', 'Ich auch! Bist du in einem Verein?'),
                         opts=[('Yes, I am.', 'Ja.', 1), ('Yes, I do.', 'Ja, ich tue.', 0)],
                         hint='Frage mit „Are you …?“ → Kurzantwort „Yes, I am.“'),
                    dict(npc=('Do you want to play with us after school?', 'Willst du nach der Schule mit uns spielen?'),
                         opts=[('Yes, I’d love to!', 'Ja, sehr gern!', 1), ('Yes, I love to it.', 'Ja, ich liebe zu es.', 0)],
                         hint='Begeistert zusagen: „I’d love to!“')],
             outro='Nach der Schule spielst du mit der Mannschaft – und schießt ein Tor.'))

K(id='s6fes', grade=6, ico='🎃', name='Festivals and customs', title='Feste und Bräuche',
  can='Ich kann über Feste in Großbritannien erzählen und sagen, was ich letztes Jahr gefeiert habe.',
  tip='Für Vergangenes: simple past – „Last year we celebrated Halloween.“ Unregelmäßige Verben lernen: go – went, have – had, eat – ate.',
  fact='Am 5. November ist in Großbritannien Bonfire Night: Man zündet Feuer und Feuerwerk an und erinnert an Guy Fawkes.',
  words='''festival | Fest
birthday | Geburtstag
Christmas | Weihnachten
Easter | Ostern
Halloween | Halloween
Bonfire Night | Feuerwerksnacht (5. November)
fireworks | Feuerwerk
costume | Kostüm
present | Geschenk
to celebrate | feiern
party | Party / Feier
candle | Kerze
pumpkin | Kürbis
cracker | Knallbonbon
card | Karte
custom | Brauch''',
  sentences=[('Last year we celebrated Halloween with our neighbours.', 'Letztes Jahr haben wir Halloween mit unseren Nachbarn gefeiert.'),
             ('I wore a scary costume.', 'Ich trug ein gruseliges Kostüm.'),
             ('On Bonfire Night we watched the fireworks.', 'An der Bonfire Night haben wir das Feuerwerk angeschaut.'),
             ('At Christmas British people pull crackers.', 'An Weihnachten ziehen Briten Knallbonbons auseinander.'),
             ('Did you get many presents for your birthday?', 'Hast du zum Geburtstag viele Geschenke bekommen?'),
             ('We are going to have a party next Saturday.', 'Wir werden nächsten Samstag eine Party feiern.')],
  scene=dict(intro='Am 6. November auf dem Schulhof in Liverpool. Deine Austauschpartnerin erzählt von gestern.',
             steps=[dict(npc=('Did you see the fireworks last night?', 'Hast du gestern Abend das Feuerwerk gesehen?'),
                         opts=[('Yes, I did! They were amazing.', 'Ja! Es war toll.', 1), ('Yes, I saw! They was amazing.', 'Ja, ich sah! Es war (falsch) toll.', 0)],
                         hint='Kurzantwort „Yes, I did.“ und Mehrzahl „they were“.'),
                    dict(npc=('What did you do at Halloween in Germany?', 'Was hast du an Halloween in Deutschland gemacht?'),
                         opts=[('I went trick-or-treating with friends.', 'Ich bin mit Freunden von Haus zu Haus gezogen.', 1), ('I go trick-or-treating yesterday.', 'Ich gehe gestern Süßes sammeln.', 0)],
                         hint='Vergangenheit: go → went.'),
                    dict(npc=('Are you going to celebrate Christmas here?', 'Wirst du Weihnachten hier feiern?'),
                         opts=[("No, I'm going to fly home.", 'Nein, ich werde nach Hause fliegen.', 1), ('No, I fly home going.', 'Nein, ich fliege nach Hause gehend.', 0)],
                         hint='Plan → going to + Grundform.')],
             outro='Sie schenkt dir einen Knallbonbon – „for Christmas in Germany“.'))

K(id='s6sho', grade=6, ico='🛒', name='Shopping and British food', title='Einkaufen und britisches Essen',
  can='Ich kann Mengen angeben, beim Einkaufen nach Dingen fragen und typisch britisches Essen beschreiben.',
  tip='some in Aussagen und Bitten, any in Fragen und Verneinungen: „I need some apples. Have you got any milk? There isn’t any bread.“ – much bei nicht Zählbarem, many bei Zählbarem.',
  fact='Ein „full English breakfast“ besteht aus Eiern, Speck, Würstchen, Bohnen in Tomatensoße, Tomaten, Pilzen und Toast.',
  words='''a bottle of | eine Flasche
a packet of | eine Packung
a loaf of bread | ein Laib Brot
a piece of | ein Stück
a kilo of | ein Kilo
some | etwas / einige
any | (irgend)welche
how much | wie viel (nicht zählbar)
how many | wie viele (zählbar)
a lot of | viel / viele
beans | Bohnen
crisps | Kartoffelchips
chips | Pommes
supermarket | Supermarkt
shopping list | Einkaufszettel
fish and chips | Fisch mit Pommes''',
  sentences=[('We need some eggs and a bottle of milk.', 'Wir brauchen ein paar Eier und eine Flasche Milch.'),
             ("There isn't any bread left.", 'Es ist kein Brot mehr da.'),
             ('How many apples do you want?', 'Wie viele Äpfel möchtest du?'),
             ('How much is a packet of crisps?', 'Wie viel kostet eine Packung Chips?'),
             ('British people eat a lot of beans on toast.', 'Briten essen viel Bohnen auf Toast.'),
             ('Fish and chips is cheaper than a burger here.', 'Fish and Chips ist hier billiger als ein Burger.')],
  scene=dict(intro='In einem kleinen Laden in Cornwall. Du sollst für die Gastfamilie einkaufen.',
             steps=[dict(npc=('Hello, love. What can I get you?', 'Hallo, Schatz. Was darf’s sein?'),
                         opts=[("I'd like a loaf of bread and some milk, please.", 'Ich hätte gern einen Laib Brot und etwas Milch.', 1), ("I'd like a bread and many milk.", 'Ich hätte gern ein Brot und viele Milch.', 0)],
                         hint='„a loaf of bread“, und bei Milch „some“ (nicht zählbar).'),
                    dict(npc=('How many eggs do you need?', 'Wie viele Eier brauchst du?'),
                         opts=[('Six, please.', 'Sechs, bitte.', 1), ('Much, please.', 'Viel, bitte.', 0)],
                         hint='Auf „How many …?“ antwortet man mit einer Zahl.'),
                    dict(npc=("Sorry, we haven't got any brown bread today.", 'Tut mir leid, wir haben heute kein Vollkornbrot.'),
                         opts=[("That's OK. White bread is fine.", 'Kein Problem. Weißbrot ist auch gut.', 1), ('OK. I want some brown bread any.', 'OK. Ich will etwas braunes Brot irgendwelche.', 0)],
                         hint='Freundlich reagieren: „That’s OK.“')],
             outro='Zum Dank gibt es abends bei der Gastfamilie Fish and Chips aus Zeitungspapier.'))

K(id='s6lon', grade=6, ico='🎡', name='London and Cornwall', title='Eine Stadt und eine Region: London und Cornwall',
  can='Ich kann Sehenswürdigkeiten vergleichen und sagen, was ich in London oder Cornwall schon erlebt habe.',
  tip='Steigerung: kurze Adjektive mit -er/-est (bigger, the biggest), lange mit more/most (more interesting). Unregelmäßig: good – better – best.',
  fact='Cornwall ist die südwestlichste Grafschaft Englands. Dort liegt Land’s End, und früher sprach man dort Kornisch, eine keltische Sprache.',
  words='''sights | Sehenswürdigkeiten
tower | Turm
palace | Palast
bridge | Brücke
the Underground | die U-Bahn (London)
double-decker | Doppeldecker
coast | Küste
beach | Strand
cliff | Klippe
village | Dorf
fisherman | Fischer
surfing | Surfen
bigger | größer
the biggest | der/die/das größte
more interesting | interessanter
have been to | gewesen sein (in/bei)''',
  sentences=[('London is bigger than any other city in Britain.', 'London ist größer als jede andere Stadt in Großbritannien.'),
             ('The beaches in Cornwall are more beautiful than in London.', 'Die Strände in Cornwall sind schöner als in London.'),
             ('Have you ever been to London?', 'Warst du schon einmal in London?'),
             ("I've seen Buckingham Palace.", 'Ich habe den Buckingham Palace gesehen.'),
             ('We took the Underground to Tower Bridge.', 'Wir sind mit der U-Bahn zur Tower Bridge gefahren.'),
             ('Cornwall is the best place for surfing.', 'Cornwall ist der beste Ort zum Surfen.')],
  scene=dict(intro='Klassenfahrt nach London. Ihr steht auf der Tower Bridge und plant den Nachmittag.',
             steps=[dict(npc=('Which is better – the London Eye or the Tower?', 'Was ist besser – das London Eye oder der Tower?'),
                         opts=[('The Tower is more interesting, I think.', 'Der Tower ist interessanter, finde ich.', 1), ('The Tower is interestinger.', 'Der Tower ist interessanter (falsch gebildet).', 0)],
                         hint='Lange Adjektive: more + Adjektiv.'),
                    dict(npc=('Have you ever been on a double-decker?', 'Bist du schon einmal Doppeldecker gefahren?'),
                         opts=[("Yes, I have. It was great!", 'Ja. Es war toll!', 1), ('Yes, I was it.', 'Ja, ich war es.', 0)],
                         hint='Auf „Have you ever …?“ antwortet man „Yes, I have.“'),
                    dict(npc=("Next summer my family is going to Cornwall.", 'Nächsten Sommer fährt meine Familie nach Cornwall.'),
                         opts=[('Lucky you! The beaches there are the best.', 'Glückspilz! Die Strände dort sind die besten.', 1), ('Lucky! The beaches there are the goodest.', 'Glück! Die Strände sind die gutesten.', 0)],
                         hint='good – better – best.')],
             outro='Ihr nehmt den Doppeldecker zurück – oben, ganz vorne.'))

K(id='s7fri', grade=7, ico='🤝', name='Friends and groups', title='Freunde und Gruppen',
  can='Ich kann über Freundschaft, Streit und Gruppen sprechen und Personen mit Relativsätzen beschreiben.',
  tip='Relativsätze: who für Personen, which für Dinge, whose für Besitz. „A friend is someone who listens to you.“',
  fact='An britischen Schulen gibt es oft „houses“ – Gruppen, die über das Schuljahr in Sport und Wettbewerben Punkte sammeln.',
  words='''friendship | Freundschaft
best friend | beste(r) Freund(in)
to trust | vertrauen
to argue | streiten
to make up | sich versöhnen
to get on well with | sich gut verstehen mit
peer pressure | Gruppenzwang
to fit in | dazugehören
lonely | einsam
reliable | zuverlässig
jealous | eifersüchtig
to apologise | sich entschuldigen
to support | unterstützen
gang | Clique / Bande
someone who | jemand, der
role model | Vorbild''',
  sentences=[('A good friend is someone who listens to you.', 'Ein guter Freund ist jemand, der dir zuhört.'),
             ('I get on well with most people in my class.', 'Ich verstehe mich mit den meisten in meiner Klasse gut.'),
             ('We argued yesterday, but we have made up now.', 'Wir haben gestern gestritten, aber jetzt haben wir uns versöhnt.'),
             ("If you feel lonely, you should talk to someone.", 'Wenn du dich einsam fühlst, solltest du mit jemandem reden.'),
             ('The girl whose bag was stolen is my cousin.', 'Das Mädchen, dessen Tasche gestohlen wurde, ist meine Cousine.'),
             ('Peer pressure can make people do stupid things.', 'Gruppenzwang kann Menschen dazu bringen, dumme Dinge zu tun.')],
  scene=dict(intro='Dein Austauschpartner Sam wirkt traurig. Ihr sitzt auf einer Bank im Park.',
             steps=[dict(npc=("I had an argument with Josh. He's not talking to me.", 'Ich hatte Streit mit Josh. Er redet nicht mehr mit mir.'),
                         opts=[("Oh no. What happened?", 'Oh nein. Was ist passiert?', 1), ('Oh no. What has happen?', 'Oh nein. Was hat passieren?', 0)],
                         hint='Nachfragen im simple past: „What happened?“'),
                    dict(npc=('I told his secret to some other people.', 'Ich habe sein Geheimnis anderen Leuten erzählt.'),
                         opts=[("If you apologise, he will forgive you.", 'Wenn du dich entschuldigst, wird er dir verzeihen.', 1), ('If you will apologise, he forgives you.', 'Wenn du dich entschuldigen wirst, verzeiht er dir.', 0)],
                         hint='If-Satz Typ I: if + simple present, dann will.'),
                    dict(npc=("You're right. You're someone who always helps.", 'Du hast recht. Du bist jemand, der immer hilft.'),
                         opts=[("That's what friends are for!", 'Dafür sind Freunde da!', 1), ("That's which friends are for!", 'Das ist welche Freunde sind für!', 0)],
                         hint='Feste Wendung: „That’s what friends are for.“')],
             outro='Am nächsten Tag sitzen Sam und Josh in der Pause wieder zusammen.'))

K(id='s7med', grade=7, ico='📱', name='Phones and social media', title='Handy und soziale Netzwerke',
  can='Ich kann über Handy-Nutzung und soziale Netzwerke sprechen, Vor- und Nachteile nennen und Regeln formulieren.',
  tip='Present perfect mit „for“ (Zeitraum) und „since“ (Zeitpunkt): „I have had my phone for two years / since 2024.“ – im Deutschen steht hier Präsens!',
  fact='In vielen britischen Schulen sind Handys im Unterricht verboten; seit 2024 empfiehlt die Regierung ein Handyverbot während des ganzen Schultags.',
  words='''mobile phone | Handy
smartphone | Smartphone
app | App
to post | posten
to share | teilen
to follow | folgen
follower | Follower
to chat | chatten
screen time | Bildschirmzeit
online | online
password | Passwort
to download | herunterladen
advantage | Vorteil
disadvantage | Nachteil
addicted | süchtig
cyberbullying | Cybermobbing''',
  sentences=[('I have had my phone since my eleventh birthday.', 'Ich habe mein Handy seit meinem elften Geburtstag.'),
             ('She has posted three photos today.', 'Sie hat heute drei Fotos gepostet.'),
             ('One advantage of apps is that they are fast.', 'Ein Vorteil von Apps ist, dass sie schnell sind.'),
             ('You should never share your password.', 'Du solltest nie dein Passwort weitergeben.'),
             ('Too much screen time is bad for your eyes.', 'Zu viel Bildschirmzeit ist schlecht für die Augen.'),
             ('If someone sends you nasty messages, tell an adult.', 'Wenn dir jemand gemeine Nachrichten schickt, sag es einem Erwachsenen.')],
  scene=dict(intro='Diskussion in der Englischstunde: Sollen Handys in der Schule verboten werden?',
             steps=[dict(npc=('How long have you had a smartphone?', 'Wie lange hast du schon ein Smartphone?'),
                         opts=[("I've had it for two years.", 'Ich habe es seit zwei Jahren.', 1), ('I have it since two years.', 'Ich habe es seit zwei Jahren (falsch).', 0)],
                         hint='Zeitraum bis jetzt: present perfect + for.'),
                    dict(npc=('What is one disadvantage of phones at school?', 'Was ist ein Nachteil von Handys in der Schule?'),
                         opts=[('People check them instead of listening.', 'Man schaut drauf, statt zuzuhören.', 1), ('People are checking them always never.', 'Leute prüfen sie immer nie.', 0)],
                         hint='Allgemeine Aussage → simple present.'),
                    dict(npc=('So should we ban phones?', 'Sollen wir Handys also verbieten?'),
                         opts=[('In lessons yes, but not at break.', 'Im Unterricht ja, aber nicht in der Pause.', 1), ('In lessons yes, but not in break time is.', 'Im Unterricht ja, aber nicht in Pause ist.', 0)],
                         hint='Kurz und klar Stellung nehmen.')],
             outro='Die Klasse stimmt ab: Handyverbot im Unterricht, aber Musik in der Pause erlaubt.'))

K(id='s7spo', grade=7, ico='🎸', name='Sport and music', title='Sport und Musik',
  can='Ich kann über Sport und Musik berichten und erzählen, was gerade passierte, als etwas anderes geschah.',
  tip='Past progressive für Hintergrund, simple past für das, was dazwischenkommt: „We were playing when it started to rain.“',
  fact='Wimbledon ist das älteste Tennisturnier der Welt (seit 1877). Die Spielerinnen und Spieler müssen dort Weiß tragen.',
  words='''match | Spiel (Sport)
to win | gewinnen
to lose | verlieren
score | Spielstand
goal | Tor
fan | Fan
stadium | Stadion
coach | Trainer(in)
band | Band
concert | Konzert
song | Lied
lyrics | Liedtext
to practise | üben
instrument | Instrument
drums | Schlagzeug
audience | Publikum''',
  sentences=[('We were winning when the referee stopped the match.', 'Wir lagen vorne, als der Schiedsrichter das Spiel abbrach.'),
             ('The fans were singing all the time.', 'Die Fans sangen die ganze Zeit.'),
             ('I practise the drums every day.', 'Ich übe jeden Tag Schlagzeug.'),
             ('The audience loved the new song.', 'Das Publikum liebte das neue Lied.'),
             ('Our coach is stricter than the old one.', 'Unser Trainer ist strenger als der alte.'),
             ('While I was watching the concert, my phone rang.', 'Während ich das Konzert anschaute, klingelte mein Handy.')],
  scene=dict(intro='Montagmorgen in der Schule. Dein Freund Leo erzählt vom Konzert am Wochenende.',
             steps=[dict(npc=('What were you doing on Saturday night?', 'Was hast du am Samstagabend gemacht?'),
                         opts=[('I was watching a football match.', 'Ich habe ein Fußballspiel angeschaut.', 1), ('I watching a football match.', 'Ich schauend ein Fußballspiel.', 0)],
                         hint='Past progressive: was + -ing.'),
                    dict(npc=('Did your team win?', 'Hat deine Mannschaft gewonnen?'),
                         opts=[('No, they lost two–one.', 'Nein, sie haben 1:2 verloren.', 1), ('No, they losed two–one.', 'Nein, sie verlierten 1:2.', 0)],
                         hint='lose – lost – lost.'),
                    dict(npc=('I was at a concert. The singer fell off the stage while she was dancing!', 'Ich war auf einem Konzert. Die Sängerin fiel von der Bühne, während sie tanzte!'),
                         opts=[('Oh no! Was she OK?', 'Oh nein! Ging es ihr gut?', 1), ('Oh no! Did she OK?', 'Oh nein! Tat sie OK?', 0)],
                         hint='Frage mit „be“: Was she …?')],
             outro='Die Sängerin war okay – und hat danach im Sitzen weitergesungen.'))

K(id='s8tow', grade=8, ico='🏘️', name='Town and country', title='Stadt und Land',
  can='Ich kann Leben in der Stadt und auf dem Land vergleichen und Vermutungen mit if-Sätzen (Typ II) äußern.',
  tip='If-Satz Typ II für Unwirkliches: „If I lived in the country, I would have a horse.“ – im if-Teil simple past, im Hauptsatz would.',
  fact='Über 80 Prozent der Menschen in England leben in Städten – trotzdem sind rund zwei Drittel der Fläche Landwirtschaft.',
  words='''countryside | Land (im Gegensatz zur Stadt)
city life | Stadtleben
rural | ländlich
urban | städtisch
neighbourhood | Nachbarschaft / Viertel
public transport | öffentliche Verkehrsmittel
traffic | Verkehr
pollution | Verschmutzung
quiet | ruhig
crowded | überfüllt
convenient | praktisch
facilities | Einrichtungen
farm | Bauernhof
commute | pendeln
rent | Miete
on the other hand | andererseits''',
  sentences=[('If I lived in the countryside, I would have a horse.', 'Wenn ich auf dem Land leben würde, hätte ich ein Pferd.'),
             ('Public transport in the city is very convenient.', 'Die öffentlichen Verkehrsmittel in der Stadt sind sehr praktisch.'),
             ('On the other hand, the traffic is terrible.', 'Andererseits ist der Verkehr schrecklich.'),
             ('Rents are much higher in London than in the north.', 'Mieten sind in London viel höher als im Norden.'),
             ('Many people commute to work by train.', 'Viele Menschen pendeln mit dem Zug zur Arbeit.'),
             ('Our neighbourhood is quiet but a bit boring.', 'Unser Viertel ist ruhig, aber ein bisschen langweilig.')],
  scene=dict(intro='Debatte im Englischunterricht: „City or countryside – where would you rather live?“',
             steps=[dict(npc=('Where would you rather live – in a city or in the country?', 'Wo würdest du lieber leben – in der Stadt oder auf dem Land?'),
                         opts=[('I would rather live in a city.', 'Ich würde lieber in der Stadt leben.', 1), ('I will rather live in a city.', 'Ich werde lieber in einer Stadt leben.', 0)],
                         hint='Vorliebe: „I would rather …“'),
                    dict(npc=('Why? The countryside is so quiet.', 'Warum? Auf dem Land ist es so ruhig.'),
                         opts=[('If I lived there, I would be bored.', 'Wenn ich dort leben würde, wäre mir langweilig.', 1), ('If I would live there, I am bored.', 'Wenn ich dort leben würde, bin ich gelangweilt.', 0)],
                         hint='Typ II: if + simple past, Hauptsatz would.'),
                    dict(npc=('But the city is crowded and expensive.', 'Aber die Stadt ist voll und teuer.'),
                         opts=[("That's true. On the other hand, there are more facilities.", 'Stimmt. Andererseits gibt es mehr Angebote.', 1), ("That's true. In other hand, it gives more.", 'Stimmt. In anderer Hand gibt es mehr.', 0)],
                         hint='Gegenargument: „On the other hand, …“')],
             outro='Am Ende steht es unentschieden – 14 zu 14.'))

K(id='s8env', grade=8, ico='🌍', name='Nature and the environment', title='Natur und Umwelt',
  can='Ich kann über Umweltprobleme sprechen und mit dem Passiv beschreiben, was getan wird.',
  tip='Passiv: be + 3. Form. „Plastic is recycled.“ „The forest was destroyed.“ Wer es tut, steht mit „by“: „…by the town council“.',
  fact='In England kosten Plastiktüten im Supermarkt seit 2015 Geld – seitdem ist ihr Verbrauch um über 95 Prozent gesunken.',
  words='''environment | Umwelt
climate change | Klimawandel
to recycle | recyceln
waste | Abfall
plastic | Plastik
energy | Energie
to save | sparen / retten
to protect | schützen
pollution | Verschmutzung
endangered | vom Aussterben bedroht
species | Art (Tier/Pflanze)
renewable | erneuerbar
solar panel | Solarmodul
flood | Überschwemmung
to reduce | verringern
litter | Müll (auf der Straße)''',
  sentences=[('Paper and glass are recycled in our town.', 'Papier und Glas werden in unserer Stadt recycelt.'),
             ('Many species are endangered because of climate change.', 'Viele Arten sind wegen des Klimawandels bedroht.'),
             ('We should reduce the amount of plastic we use.', 'Wir sollten die Menge an Plastik reduzieren, die wir verwenden.'),
             ('The solar panels were installed last year.', 'Die Solarmodule wurden letztes Jahr installiert.'),
             ('Litter was collected by the whole class.', 'Der Müll wurde von der ganzen Klasse eingesammelt.'),
             ('If everybody saved energy, it would help a lot.', 'Wenn alle Energie sparen würden, würde das viel helfen.')],
  scene=dict(intro='Projektwoche: Eure Klasse plant eine Müllsammelaktion mit einer Schule aus Bristol.',
             steps=[dict(npc=('What happens to the plastic we collect?', 'Was passiert mit dem Plastik, das wir sammeln?'),
                         opts=[('It is taken to a recycling centre.', 'Es wird zu einem Wertstoffhof gebracht.', 1), ('It takes to a recycling centre.', 'Es nimmt zu einem Wertstoffhof.', 0)],
                         hint='Passiv: is + 3. Form (take – took – taken).'),
                    dict(npc=('Our school was given an award for saving energy.', 'Unsere Schule hat einen Preis fürs Energiesparen bekommen.'),
                         opts=[('Congratulations! How did you do it?', 'Glückwunsch! Wie habt ihr das gemacht?', 1), ('Congratulation! How you did it?', 'Glückwunsch! Wie ihr es machtet?', 0)],
                         hint='Frage im simple past: How did you …?'),
                    dict(npc=('Solar panels were put on the roof.', 'Auf das Dach wurden Solarmodule montiert.'),
                         opts=[('We should do that at our school too.', 'Das sollten wir an unserer Schule auch machen.', 1), ('We should doing that too.', 'Wir sollten das machend auch.', 0)],
                         hint='should + Grundform.')],
             outro='Eure Aktion bringt 42 Säcke Müll – und ein Foto in der Lokalzeitung.'))

K(id='s8usa', grade=8, ico='🗽', name='The USA', title='Die USA',
  can='Ich kann Grundlegendes über die USA erzählen und wiedergeben, was andere gesagt haben (indirekte Rede).',
  tip='Indirekte Rede mit Zeitverschiebung: „I like New York.“ → She said (that) she liked New York. Fragen: „Where do you live?“ → He asked where I lived.',
  fact='Die USA haben 50 Bundesstaaten. In vielen Schulen sprechen die Kinder morgens den „Pledge of Allegiance“, ein Treuegelöbnis auf die Flagge.',
  words='''state | Bundesstaat
president | Präsident(in)
flag | Flagge
coast to coast | von Küste zu Küste
skyscraper | Wolkenkratzer
national park | Nationalpark
high school | weiterführende Schule (USA)
grade | Klassenstufe (USA)
soccer | Fußball (USA)
fall | Herbst (USA)
vacation | Urlaub (USA)
sidewalk | Gehweg (USA)
elevator | Aufzug (USA)
apartment | Wohnung (USA)
to immigrate | einwandern
diverse | vielfältig''',
  sentences=[('The USA has fifty states.', 'Die USA haben fünfzig Bundesstaaten.'),
             ('She said that New York was amazing.', 'Sie sagte, dass New York großartig sei.'),
             ('He asked me where I lived.', 'Er fragte mich, wo ich wohne.'),
             ('In American English you say “elevator”, not “lift”.', 'Im amerikanischen Englisch sagt man „elevator“, nicht „lift“.'),
             ('Many people immigrated to America through New York.', 'Viele Menschen wanderten über New York nach Amerika ein.'),
             ('Yellowstone was the first national park in the world.', 'Yellowstone war der erste Nationalpark der Welt.')],
  scene=dict(intro='Videochat mit einer Austauschschülerin aus Chicago. Danach erzählst du deiner Klasse davon.',
             steps=[dict(npc=('Emily: "I am in eighth grade and I play soccer."', 'Emily: „Ich bin in der achten Klasse und spiele Fußball.“'),
                         opts=[('Emily said that she was in eighth grade.', 'Emily sagte, dass sie in der achten Klasse sei.', 1), ('Emily said that she is being in eighth grade.', 'Emily sagte, dass sie gerade in der achten Klasse seiend sei.', 0)],
                         hint='Indirekte Rede: am → was.'),
                    dict(npc=('Emily: "Do you have a school uniform?"', 'Emily: „Habt ihr eine Schuluniform?“'),
                         opts=[('She asked if we had a school uniform.', 'Sie fragte, ob wir eine Schuluniform haben.', 1), ('She asked do we have a uniform.', 'Sie fragte, haben wir eine Uniform.', 0)],
                         hint='Ja/Nein-Frage → asked if …, ohne do.'),
                    dict(npc=('Emily: "Visit me next fall!"', 'Emily: „Besuch mich nächsten Herbst!“'),
                         opts=[('She told me to visit her next fall.', 'Sie sagte, ich solle sie nächsten Herbst besuchen.', 1), ('She told me visit her.', 'Sie sagte mir besuchen sie.', 0)],
                         hint='Aufforderung → told + Person + to.')],
             outro='Deine Klasse will jetzt einen Austausch mit Chicago planen.'))

K(id='s9vol', grade=9, ico='🤲', name='Making a difference', title='Etwas bewegen: Ehrenamt und Charity',
  can='Ich kann über Ehrenamt, Spendenaktionen und gesellschaftliches Engagement sprechen und Vergangenes hypothetisch bewerten (Typ III).',
  tip='If-Satz Typ III für die Vergangenheit, die nicht so war: „If we had started earlier, we would have collected more money.“',
  fact='In Großbritannien gibt es Charity Shops in fast jeder Einkaufsstraße: Gebrauchtwarenläden, deren Gewinn an Hilfsorganisationen geht.',
  words='''charity | Wohltätigkeit / Hilfsorganisation
volunteer | Freiwillige(r)
to volunteer | sich freiwillig melden
to raise money | Geld sammeln
donation | Spende
fundraising | Spendensammeln
homeless | obdachlos
to make a difference | etwas bewirken
community | Gemeinschaft / Gemeinde
food bank | Tafel (Essensausgabe)
sponsored run | Spendenlauf
to be involved in | beteiligt sein an
responsibility | Verantwortung
elderly | ältere Menschen
committed | engagiert
cause | Anliegen / Zweck''',
  sentences=[('Our class raised four hundred euros for a food bank.', 'Unsere Klasse hat vierhundert Euro für eine Tafel gesammelt.'),
             ('Volunteering helps you to make a difference in your community.', 'Ehrenamt hilft dir, in deiner Gemeinde etwas zu bewirken.'),
             ('If we had advertised more, more people would have come.', 'Wenn wir mehr Werbung gemacht hätten, wären mehr Leute gekommen.'),
             ('She has been volunteering at an animal shelter since June.', 'Sie arbeitet seit Juni ehrenamtlich in einem Tierheim.'),
             ('Taking part in a sponsored run is good fun.', 'An einem Spendenlauf teilzunehmen macht Spaß.'),
             ('Young people should take responsibility for their community.', 'Junge Menschen sollten Verantwortung für ihre Gemeinschaft übernehmen.')],
  scene=dict(intro='Nach dem Spendenlauf eurer Schule. Die Schülersprecherin aus der Partnerschule in Leeds fragt nach.',
             steps=[dict(npc=('How much money did you raise?', 'Wie viel Geld habt ihr gesammelt?'),
                         opts=[('We raised over two thousand euros.', 'Wir haben über zweitausend Euro gesammelt.', 1), ('We rose over two thousand euros.', 'Wir stiegen über zweitausend Euro.', 0)],
                         hint='Geld sammeln = raise money (raise – raised – raised).'),
                    dict(npc=('Great! What would you do differently?', 'Super! Was würdet ihr anders machen?'),
                         opts=[('If we had asked local shops, we would have got more sponsors.', 'Wenn wir Läden gefragt hätten, hätten wir mehr Sponsoren bekommen.', 1), ('If we asked local shops, we would have got.', 'Wenn wir Läden fragten, hätten wir bekommen.', 0)],
                         hint='Typ III: if + had + 3. Form, would have + 3. Form.'),
                    dict(npc=('Why do you think volunteering is important?', 'Warum findest du Ehrenamt wichtig?'),
                         opts=[('Because helping others makes a real difference.', 'Weil anderen zu helfen wirklich etwas bewirkt.', 1), ('Because help others make a difference real.', 'Weil helfen andere machen Unterschied echt.', 0)],
                         hint='Gerundium als Subjekt: „Helping others …“')],
             outro='Das Geld geht an ein Jugendzentrum – mit einem Dankesbrief auf Englisch.'))

K(id='s9tec', grade=9, ico='🤖', name='Technology and change', title='Technik und Wandel',
  can='Ich kann über technische Entwicklungen, künstliche Intelligenz und ihre Folgen diskutieren.',
  tip='Gerundium oder Infinitiv: nach enjoy, avoid, finish, mind → -ing; nach want, decide, hope, plan → to. „I enjoy coding.“ „I decided to learn Python.“',
  fact='Der Brite Tim Berners-Lee erfand 1989 das World Wide Web, Alan Turing gilt als Vater der Informatik.',
  words='''technology | Technik / Technologie
invention | Erfindung
artificial intelligence | künstliche Intelligenz
robot | Roboter
device | Gerät
to develop | entwickeln
to replace | ersetzen
automated | automatisiert
data | Daten
privacy | Privatsphäre
to rely on | sich verlassen auf
benefit | Nutzen
risk | Risiko
to control | steuern / kontrollieren
coding | Programmieren
in the future | in der Zukunft''',
  sentences=[('Robots will replace many jobs in the future.', 'Roboter werden in Zukunft viele Arbeitsplätze ersetzen.'),
             ('I enjoy coding small games.', 'Ich programmiere gern kleine Spiele.'),
             ('We rely on our devices far too much.', 'Wir verlassen uns viel zu sehr auf unsere Geräte.'),
             ('Artificial intelligence is used in many apps.', 'Künstliche Intelligenz wird in vielen Apps verwendet.'),
             ('She decided to study computer science.', 'Sie entschied sich, Informatik zu studieren.'),
             ('One benefit of technology is faster communication.', 'Ein Nutzen der Technik ist schnellere Kommunikation.')],
  scene=dict(intro='Diskussionsrunde: „Is artificial intelligence good for students?“',
             steps=[dict(npc=('Do you use AI for homework?', 'Benutzt du KI für Hausaufgaben?'),
                         opts=[('Sometimes, but I avoid copying answers.', 'Manchmal, aber ich vermeide es, Antworten abzuschreiben.', 1), ('Sometimes, but I avoid to copy answers.', 'Manchmal, aber ich vermeide zu kopieren.', 0)],
                         hint='avoid + -ing.'),
                    dict(npc=('What is the biggest risk?', 'Was ist das größte Risiko?'),
                         opts=[('People might stop thinking for themselves.', 'Menschen könnten aufhören, selbst zu denken.', 1), ('People might stop to think themselves.', 'Menschen könnten anhalten, um sich zu denken.', 0)],
                         hint='stop + -ing = aufhören, etwas zu tun.'),
                    dict(npc=('And the biggest benefit?', 'Und der größte Nutzen?'),
                         opts=[('It can explain things in different ways.', 'Sie kann Dinge auf verschiedene Arten erklären.', 1), ('It can explaining things.', 'Sie kann erklärend Dinge.', 0)],
                         hint='can + Grundform.')],
             outro='Ergebnis der Runde: KI als Hilfe ja – als Ersatz fürs eigene Denken nein.'))

K(id='s9gap', grade=9, ico='🎒', name='Gap year and travel', title='Gap Year und Reisen',
  can='Ich kann über ein Auslandsjahr, Reisepläne und Erfahrungen im Ausland sprechen.',
  tip='Zukunftspläne: going to für Absichten, present progressive für feste Verabredungen, will für spontane Entscheidungen und Vermutungen.',
  fact='Ein „gap year“ ist in Großbritannien üblich: Viele machen nach der Schule ein Jahr Pause, reisen, jobben oder arbeiten ehrenamtlich.',
  words='''gap year | Auszeit-Jahr (vor Studium/Ausbildung)
abroad | im / ins Ausland
experience | Erfahrung
host family | Gastfamilie
exchange | Austausch
to apply for | sich bewerben um
work and travel | Arbeiten und Reisen
backpack | Rucksack
destination | Reiseziel
visa | Visum
independent | selbstständig
homesick | heimwehkrank
to broaden your mind | den Horizont erweitern
culture shock | Kulturschock
accommodation | Unterkunft
to look forward to | sich freuen auf''',
  sentences=[('After school I am going to spend a year abroad.', 'Nach der Schule werde ich ein Jahr im Ausland verbringen.'),
             ('I am flying to Sydney on the fifth of August.', 'Ich fliege am fünften August nach Sydney.'),
             ('Living with a host family helps you to improve your English.', 'Bei einer Gastfamilie zu wohnen, hilft dir, dein Englisch zu verbessern.'),
             ('At first I was homesick, but then I made friends.', 'Zuerst hatte ich Heimweh, aber dann fand ich Freunde.'),
             ('I am looking forward to meeting new people.', 'Ich freue mich darauf, neue Leute kennenzulernen.'),
             ('You have to apply for a visa before you go.', 'Du musst ein Visum beantragen, bevor du fährst.')],
  scene=dict(intro='Info-Abend zum Auslandsjahr. Eine Rückkehrerin aus Neuseeland beantwortet Fragen.',
             steps=[dict(npc=('So, what are your plans after school?', 'Also, was hast du nach der Schule vor?'),
                         opts=[("I'm going to do work and travel in Canada.", 'Ich werde Work and Travel in Kanada machen.', 1), ('I will going to do work in Canada.', 'Ich werde gehen zu arbeiten in Kanada.', 0)],
                         hint='Absicht → going to + Grundform.'),
                    dict(npc=('Are you worried about being homesick?', 'Hast du Angst vor Heimweh?'),
                         opts=[("A bit, but I'm looking forward to being independent.", 'Ein bisschen, aber ich freue mich darauf, selbstständig zu sein.', 1), ('A bit, but I look forward to be independent.', 'Ein bisschen, aber ich freue zu sein selbstständig.', 0)],
                         hint='look forward to + -ing.'),
                    dict(npc=("That's the spirit! It will broaden your mind.", 'So ist’s richtig! Es wird deinen Horizont erweitern.'),
                         opts=[('Thanks for the advice!', 'Danke für den Rat!', 1), ('Thanks for the advices!', 'Danke für die Räte!', 0)],
                         hint='advice ist nicht zählbar – kein -s.')],
             outro='Du nimmst einen Stapel Broschüren mit nach Hause.'))

K(id='s10gen', grade=10, ico='👪', name='Growing up', title='Erwachsenwerden und Generationen',
  can='Ich kann über das Erwachsenwerden, Rechte ab einem bestimmten Alter und das Verhältnis der Generationen sprechen.',
  tip='Partizipialkonstruktionen verkürzen Nebensätze: „Having finished school, she moved to Berlin.“ – „The boy sitting next to me …“',
  fact='In Großbritannien darf man mit 17 Auto fahren lernen und mit 18 wählen; in Schottland dürfen schon 16-Jährige bei Regionalwahlen wählen.',
  words='''to grow up | erwachsen werden
teenager | Jugendliche(r)
adult | Erwachsene(r)
generation | Generation
to be allowed to | dürfen
independence | Unabhängigkeit
rights | Rechte
to vote | wählen (Wahl)
driving licence | Führerschein
rite of passage | Übergangsritual
expectations | Erwartungen
to rebel | rebellieren
generation gap | Generationenkonflikt
pocket money | Taschengeld
to move out | ausziehen
to take for granted | für selbstverständlich halten''',
  sentences=[('In Scotland sixteen-year-olds are allowed to vote in local elections.', 'In Schottland dürfen Sechzehnjährige bei Kommunalwahlen wählen.'),
             ('Having passed her driving test, she bought a car.', 'Nachdem sie die Fahrprüfung bestanden hatte, kaufte sie ein Auto.'),
             ('Teenagers often feel that adults do not understand them.', 'Jugendliche haben oft das Gefühl, dass Erwachsene sie nicht verstehen.'),
             ('My grandparents grew up without the internet.', 'Meine Großeltern sind ohne Internet aufgewachsen.'),
             ('Most young people move out when they start university.', 'Die meisten jungen Leute ziehen aus, wenn sie mit dem Studium beginnen.'),
             ('We often take our freedom for granted.', 'Wir halten unsere Freiheit oft für selbstverständlich.')],
  scene=dict(intro='Interview-Projekt: Du befragst die Großmutter deiner Gastfamilie in Edinburgh über ihre Jugend.',
             steps=[dict(npc=('When I was your age, we were not allowed to stay out after nine.', 'Als ich so alt war wie du, durften wir nach neun nicht mehr draußen sein.'),
                         opts=[('Were your parents very strict?', 'Waren deine Eltern sehr streng?', 1), ('Was your parents very strict?', 'War deine Eltern sehr streng?', 0)],
                         hint='Mehrzahl → were.'),
                    dict(npc=('Very! But having grown up on a farm, I had lots of freedom outside.', 'Sehr! Aber da ich auf einem Hof aufwuchs, hatte ich draußen viel Freiheit.'),
                         opts=[('Do you think young people today have it easier?', 'Glaubst du, junge Leute haben es heute leichter?', 1), ('Do you think young people today has it easier?', 'Glaubst du, junge Leute hat es leichter?', 0)],
                         hint='young people = Mehrzahl → have.'),
                    dict(npc=('In some ways. But you have so much pressure from social media.', 'In mancher Hinsicht. Aber ihr habt so viel Druck durch soziale Medien.'),
                         opts=[("That's true – we take a lot for granted, though.", 'Stimmt – wir halten aber auch viel für selbstverständlich.', 1), ("That's true – we take a lot for grant.", 'Stimmt – wir nehmen viel für Gewähr.', 0)],
                         hint='Feste Wendung: take something for granted.')],
             outro='Für dein Projekt bekommst du ein altes Foto von ihr – auf dem Traktor.'))

K(id='s10med', grade=10, ico='📰', name='Media and privacy', title='Medien und Privatsphäre',
  can='Ich kann über Nachrichten, Fake News, Datenschutz und Privatsphäre diskutieren und Passivformen sicher verwenden.',
  tip='Passiv in allen Zeiten: „Our data is being collected.“ „The photo had been shared before I noticed.“ „The law will be changed.“',
  fact='Die BBC wurde 1922 gegründet und finanziert sich vor allem über eine Rundfunkgebühr, die „licence fee“.',
  words='''media | Medien
news | Nachrichten
headline | Schlagzeile
fake news | Falschmeldungen
source | Quelle
reliable | verlässlich
to influence | beeinflussen
privacy | Privatsphäre
personal data | persönliche Daten
to collect | sammeln
consent | Zustimmung / Einwilligung
to protect | schützen
surveillance | Überwachung
influencer | Influencer(in)
advertising | Werbung
to check the facts | Fakten prüfen''',
  sentences=[('Our personal data is being collected all the time.', 'Unsere persönlichen Daten werden ständig gesammelt.'),
             ('Always check the facts before you share a story.', 'Prüfe immer die Fakten, bevor du eine Geschichte teilst.'),
             ('The photo had been shared a thousand times before it was deleted.', 'Das Foto war tausendmal geteilt worden, bevor es gelöscht wurde.'),
             ('Influencers are paid to advertise products.', 'Influencer werden bezahlt, um Produkte zu bewerben.'),
             ('A reliable source tells you where its information comes from.', 'Eine verlässliche Quelle sagt dir, woher ihre Informationen stammen.'),
             ('Without your consent, your data must not be passed on.', 'Ohne deine Einwilligung dürfen deine Daten nicht weitergegeben werden.')],
  scene=dict(intro='Medienprojekt: Ihr prüft eine virale Meldung („Schools will be closed on Fridays!“).',
             steps=[dict(npc=('Is this headline true?', 'Stimmt diese Schlagzeile?'),
                         opts=[("We don't know yet. Let's check the source.", 'Wissen wir noch nicht. Prüfen wir die Quelle.', 1), ("We don't know. Let's to check the source.", 'Wissen wir nicht. Lass uns zu prüfen die Quelle.', 0)],
                         hint='Let’s + Grundform (ohne to).'),
                    dict(npc=('The post was shared by an account with no name.', 'Der Beitrag wurde von einem Konto ohne Namen geteilt.'),
                         opts=[('Then it is probably not reliable.', 'Dann ist er wahrscheinlich nicht verlässlich.', 1), ('Then it is probable not reliable.', 'Dann ist er wahrscheinliche nicht verlässlich.', 0)],
                         hint='Adverb vor Adjektiv: probably.'),
                    dict(npc=('The ministry says no decision has been made.', 'Das Ministerium sagt, es sei keine Entscheidung getroffen worden.'),
                         opts=[('So it is fake news.', 'Also ist es eine Falschmeldung.', 1), ('So it are fake news.', 'Also sind es eine Falschmeldung.', 0)],
                         hint='news ist im Englischen Einzahl: „The news is …“')],
             outro='Ihr schreibt einen kurzen Faktencheck für die Schülerzeitung – auf Englisch.'))

K(id='s10ide', grade=10, ico='🏴', name='Regional identity', title='Regionale Identität: Schottland, Wales, Irland',
  can='Ich kann über regionale Identität, Sprache und Geschichte in Schottland, Wales und Irland sprechen.',
  tip='Zero article bei Abstrakta und Allgemeinem: „History is important.“ „Language is part of identity.“ – aber „the history of Scotland“.',
  fact='In Wales sprechen rund 18 Prozent der Menschen Walisisch; in Irland ist Irisch erste Amtssprache, Englisch zweite.',
  words='''identity | Identität
heritage | Erbe / kulturelles Erbe
independence | Unabhängigkeit
to belong to | gehören zu
proud | stolz
tradition | Tradition
Gaelic | Gälisch
Welsh | walisisch / Walisisch
Scottish | schottisch
Irish | irisch / Irisch
border | Grenze
nation | Nation
devolution | Übertragung von Befugnissen (an Regionen)
parliament | Parlament
referendum | Volksabstimmung
minority language | Minderheitensprache''',
  sentences=[('Many Scots are proud of their heritage.', 'Viele Schotten sind stolz auf ihr Erbe.'),
             ('Language is an important part of identity.', 'Sprache ist ein wichtiger Teil der Identität.'),
             ('In 2014 Scotland held a referendum on independence.', '2014 hielt Schottland ein Referendum über die Unabhängigkeit ab.'),
             ('Welsh is taught in all schools in Wales.', 'Walisisch wird an allen Schulen in Wales unterrichtet.'),
             ('Northern Ireland has a border with the Republic of Ireland.', 'Nordirland hat eine Grenze zur Republik Irland.'),
             ('Scotland and Wales have had their own parliaments since 1999.', 'Schottland und Wales haben seit 1999 eigene Parlamente.')],
  scene=dict(intro='In Cardiff interviewst du für ein Schulprojekt eine walisische Schülerin.',
             steps=[dict(npc=('Do you feel British or Welsh?', 'Fühlst du dich britisch oder walisisch?'),
                         opts=[('I feel Welsh first, then British.', 'Zuerst walisisch, dann britisch.', 1), ('I feel me Welsh first.', 'Ich fühle mich walisisch zuerst (falsch).', 0)],
                         hint='feel + Adjektiv, ohne „me“.'),
                    dict(npc=('Do you speak Welsh at home?', 'Sprecht ihr zu Hause Walisisch?'),
                         opts=[("Yes, we do. It's been part of our family for generations.", 'Ja. Es gehört seit Generationen zu unserer Familie.', 1), ("Yes, we do. It is part since generations.", 'Ja. Es ist Teil seit Generationen.', 0)],
                         hint='Seit … bis jetzt → present perfect (it’s been).'),
                    dict(npc=('What do you think makes a nation?', 'Was macht deiner Meinung nach eine Nation aus?'),
                         opts=[('Language, history and shared traditions.', 'Sprache, Geschichte und gemeinsame Traditionen.', 1), ('The language, the history and the traditions shared.', 'Die Sprache, die Geschichte und die Traditionen geteilt.', 0)],
                         hint='Allgemein und abstrakt → ohne „the“ (zero article).')],
             outro='Zum Abschied bringt sie dir einen Satz bei: „Diolch!“ – Danke auf Walisisch.'))


# Emojis für Klasse 5/6 (gleiche Reihenfolge wie die Wörter; leer = kein passendes Bild)
EMOJI = {
  's5sch': ['🏫', '🧑‍🏫', '📚', '➗', '🏰', '🎨', '🤸', '🗓️', '⏰', '🍎', '📝', '🖍️', '📒', '✏️', '👔', '🧽'],
  's5hom': ['🏠', '🏢', '🛏️', '🍳', '🛋️', '🛁', '🌳', '⬆️', '⬇️', '👉', '👉', '⤵️', '🔙', '🐶', '🐹', '🦜'],
  's5hob': ['⭐', '🕹️', '⚽', '🚲', '📖', '🏊', '💃', '✏️', '🎹', '', '', '', '', '', '🏅', '👥'],
  's6fes': ['🎪', '🎂', '🎄', '🐣', '🎃', '🔥', '🎆', '🦸', '🎁', '🥳', '🎉', '🕯️', '🎃', '🎊', '💌', ''],
  's6sho': ['🍾', '📦', '🍞', '🍰', '⚖️', '', '', '❓', '❓', '', '🫘', '🥔', '🍟', '🛒', '📝', '🐟'],
  's6lon': ['📸', '🗼', '🏰', '🌉', '🚇', '🚌', '🏖️', '🏝️', '🪨', '🏘️', '🎣', '🏄', '', '', '', '✈️'],
}
