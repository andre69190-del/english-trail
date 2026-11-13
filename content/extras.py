# English Trail – übergreifende Inhalte: Laute, Zungenbrecher, Tower-Raben, Stadt-Land-Fluss, Land & Leute (UK/USA/Irland).
# Alle Texte für Deutschsprachige; das frühere Englisch-Basisfeld wird in merge.py mit Deutsch gefüllt.

# Laut-Detektiv: Graphem/Laut | Beschreibung | Beispielwort | Bedeutung
SOUNDS = '''
th (stimmlos) | Zunge zwischen die Zähne, ohne Stimme – nicht „s“! | think | denken
th (stimmhaft) | Zunge zwischen die Zähne, mit Stimme – nicht „d“ oder „s“! | mother | Mutter
w | Lippen rund wie bei „u“, kein deutsches „w“ | water | Wasser
v | wie deutsches „w“ (Oberzähne auf Unterlippe) | very | sehr
r | Zungenspitze nach hinten, nicht rollen, nicht im Rachen | red | rot
-er am Ende | britisch fast nur „ä“ wie in „bitte“ | teacher | Lehrer
a in cat | sehr offenes „ä“ | cat | Katze
u in bus | kurzes, dunkles „a“ | bus | Bus
ee / ea | langes „i“ | tea | Tee
i in sit | kurzes, offenes „i“ | sit | sitzen
oo | langes „u“ | food | Essen
o in hot | kurzes, offenes „o“ (britisch) | hot | heiß
ow / ou | „au“ | house | Haus
o in go | „ou“ | go | gehen
ay / ai | „ei“ wie in „okay“ | day | Tag
y am Ende | meist „i“ | happy | glücklich
i in time | „ai“ | time | Zeit
stummes k | k vor n wird nicht gesprochen | know | wissen
stummes w | w vor r wird nicht gesprochen | write | schreiben
stummes b | b nach m wird nicht gesprochen | climb | klettern
-ed nach t/d | „id“ als eigene Silbe | wanted | wollte
-ed nach p/k/s | nur „t“ | walked | ging
-ed sonst | nur „d“ | played | spielte
s am Wortende | oft stimmhaft wie „s“ in „Sonne“ | dogs | Hunde
j | wie „dsch“ | job | Arbeit
ch | wie „tsch“ | chair | Stuhl
sh | wie „sch“ | shop | Laden
'''

TWISTERS = [
  ('She sells seashells by the seashore.', 'Sie verkauft Muscheln am Strand.'),
  ('Red lorry, yellow lorry.', 'Roter Lastwagen, gelber Lastwagen.'),
  ('Peter Piper picked a peck of pickled peppers.', 'Peter Piper pflückte einen Scheffel eingelegter Paprika.'),
  ('How much wood would a woodchuck chuck if a woodchuck could chuck wood?', 'Wie viel Holz würde ein Murmeltier werfen, wenn ein Murmeltier Holz werfen könnte?'),
  ('Three free throws.', 'Drei Freiwürfe.'),
  ('Fred fed Ted bread, and Ted fed Fred bread.', 'Fred fütterte Ted mit Brot, und Ted fütterte Fred mit Brot.'),
  ('I scream, you scream, we all scream for ice cream!', 'Ich schreie, du schreist, wir alle schreien nach Eis!'),
  ('Betty Botter bought some butter.', 'Betty Botter kaufte etwas Butter.'),
  ('A proper copper coffee pot.', 'Eine richtige Kaffeekanne aus Kupfer.'),
  ('Unique New York.', 'Einzigartiges New York.'),
  ('Six slippery snails slid slowly seaward.', 'Sechs glitschige Schnecken glitten langsam zum Meer.'),
  ('Thirty-three thousand people think that Thursday is their thirtieth birthday.', 'Dreiunddreißigtausend Menschen denken, Donnerstag sei ihr dreißigster Geburtstag.'),
  ('Whether the weather is warm, whether the weather is hot, we have to put up with the weather, whether we like it or not.', 'Ob das Wetter warm ist, ob das Wetter heiß ist, wir müssen das Wetter nehmen, ob es uns gefällt oder nicht.'),
  ('Willy’s real rear wheel.', 'Willys echtes Hinterrad.'),
  ('Toy boat. Toy boat. Toy boat.', 'Spielzeugboot. Spielzeugboot. Spielzeugboot.'),
  ('Eleven benevolent elephants.', 'Elf gutmütige Elefanten.'),
  ('The sixth sick sheikh’s sixth sheep’s sick.', 'Das sechste Schaf des sechsten kranken Scheichs ist krank.'),
  ('Rory the warrior and Roger the worrier were reared wrongly in a rural brewery.', 'Rory der Krieger und Roger der Sorgenmacher wurden in einer ländlichen Brauerei falsch erzogen.'),
  ('Vincent vowed vengeance very vehemently.', 'Vincent schwor sehr heftig Rache.'),
]

# Tower-Raben (ersetzen die Krasnale): je ein Beruf/Typ = ein neues Wort
RAVENS = '''
Raven Postman | postman | Briefträger
Raven Baker | baker | Bäcker
Raven Teacher | teacher | Lehrer
Raven Doctor | doctor | Ärztin / Arzt
Raven Guard | guard | Wächter
Raven Chef | chef | Koch
Raven Gardener | gardener | Gärtner
Raven Pilot | pilot | Pilot
Raven Firefighter | firefighter | Feuerwehrmann / -frau
Raven Farmer | farmer | Bauer / Landwirtin
Raven Painter | painter | Maler
Raven Singer | singer | Sänger
Raven Footballer | footballer | Fußballer
Raven Detective | detective | Detektiv
Raven Librarian | librarian | Bibliothekar
Raven Scientist | scientist | Wissenschaftlerin
Raven Driver | driver | Fahrer
Raven Nurse | nurse | Pflegekraft
Raven Builder | builder | Bauarbeiter
Raven Waiter | waiter | Kellner
Raven Sailor | sailor | Seemann
Raven Tourist | tourist | Tourist
Raven Queen | queen | Königin
Raven King | king | König
'''

# Stadt-Land-Fluss (ersetzt Państwa-Miasta): Kategorie-ID | Englisch | Deutsch | Wörter
PM_LETTERS = ['B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'P', 'R', 'S', 'T']
PM_CATS = [
  ('country', 'Country', 'Land', 'Belgium Brazil Bulgaria Bolivia Canada China Chile Colombia Croatia Cuba Cyprus Denmark Dominica Finland France Fiji Germany Greece Ghana Georgia Guatemala Hungary Haiti Honduras Latvia Lithuania Luxembourg Lebanon Libya Laos Malta Mexico Morocco Monaco Mongolia Malaysia Madagascar Poland Portugal Peru Pakistan Panama Paraguay Philippines Russia Romania Rwanda Spain Sweden Switzerland Scotland Slovakia Slovenia Serbia Singapore Turkey Thailand Tunisia Tanzania Togo'),
  ('city', 'City', 'Stadt', 'Berlin Birmingham Bristol Brighton Boston Barcelona Bath Belfast Cardiff Cambridge Chicago Cairo Copenhagen Dublin Dallas Denver Delhi Detroit Florence Frankfurt Glasgow Geneva Hamburg Houston Helsinki London Liverpool Leeds Lisbon Los Angeles Madrid Manchester Munich Miami Moscow Paris Prague Plymouth Portsmouth Rome Rio Seattle Sydney Stockholm Toronto Tokyo Tallinn'),
  ('animal', 'Animal', 'Tier', 'bear bird bat bee cat cow camel chicken crocodile dog duck deer dolphin fox frog fish goat giraffe gorilla horse hamster hedgehog lion lamb leopard mouse monkey mole parrot pig penguin panda rabbit rat robin shark sheep snake squirrel tiger turtle toad'),
  ('food', 'Food', 'Essen', 'date dumpling garlic gravy hot_dog hamburger raspberry roast_beef bread banana bacon beans butter cheese cake carrot chips chicken chocolate doughnut fish fruit grapes ham honey lemon lettuce mango milk muffin pasta pizza pear potato rice salad sandwich sausage soup steak tea tomato toast'),
  ('job', 'Job', 'Beruf', 'guard guide hotel_manager hunter receptionist referee baker builder cook chef dentist doctor driver designer farmer firefighter gardener hairdresser lawyer librarian mechanic musician nurse painter pilot police officer plumber reporter scientist singer teacher tailor'),
  ('plant', 'Plant', 'Pflanze', 'dandelion dahlia foxglove fir geranium gorse heather hazel hydrangea snowdrop sage bamboo bush cactus clover daisy fern grass holly lily lavender maple moss oak palm poppy pine rose rosemary sunflower tulip thistle'),
  ('thing', 'Thing at home', 'Ding im Haus', 'glove guitar hairbrush hammer bed bottle book bowl chair clock cup cupboard door desk fork fridge glass hairdryer lamp laptop mirror mug pan pillow plate radio rug sofa spoon shelf table towel toothbrush tap'),
  ('sport', 'Sport', 'Sportart', 'fencing fishing handball hiking horse_riding long_jump marathon motor_racing parkour pool table_tennis triathlon badminton baseball basketball boxing cricket cycling darts diving football golf gymnastics hockey judo karate lacrosse polo rowing rugby running sailing skiing squash swimming tennis'),
]

# Land & Leute: Zahlen (Vereinigtes Königreich, Stand 2026, gerundet)
FACTS = [
  ('Hauptstadt', 'London'),
  ('Einwohner (Vereinigtes Königreich)', 'ca. 69 Mio.'),
  ('Landesteile', 'England, Schottland, Wales, Nordirland'),
  ('Währung', 'Pfund Sterling (£)'),
  ('Höchster Berg', 'Ben Nevis, 1345 m'),
  ('Längster Fluss', 'Severn, ca. 354 km'),
  ('Linksverkehr', 'ja'),
  ('Vorwahl', '+44'),
  ('Staatsoberhaupt', 'König Charles III. (seit 2022)'),
]

# Wer bin ich? Name | drei Hinweise (vom schwersten zum leichtesten)
PEOPLE = [
  ('William Shakespeare', ['Ich wurde 1564 in Stratford-upon-Avon geboren.', 'Ich habe fast 40 Theaterstücke geschrieben.', 'In einem meiner Stücke heißt es: „To be or not to be“.']),
  ('Queen Elizabeth II', ['Ich war über 70 Jahre lang im Amt – länger als alle vor mir.', 'Ich liebte Corgis und Pferde.', 'Mein Sohn wurde 2022 König Charles III.']),
  ('The Beatles', ['Wir waren vier Jungs aus Liverpool.', 'Wir spielten oft im Cavern Club.', 'Unsere bekanntesten Lieder heißen „Yesterday“ und „Hey Jude“.']),
  ('J. K. Rowling', ['Ich schrieb meinen ersten Roman teilweise in Cafés in Edinburgh.', 'Mein Held wohnt im Schrank unter der Treppe.', 'Ich habe Harry Potter erfunden.']),
  ('Charles Darwin', ['Ich reiste fünf Jahre lang mit dem Schiff „Beagle“ um die Welt.', 'Auf den Galápagos-Inseln beobachtete ich Finken.', 'Ich schrieb über die Entstehung der Arten durch Evolution.']),
  ('Isaac Newton', ['Ich lebte im 17. Jahrhundert und studierte in Cambridge.', 'Ich erklärte, wie sich Planeten bewegen.', 'Angeblich brachte mich ein fallender Apfel auf die Schwerkraft.']),
  ('Winston Churchill', ['Ich bekam den Nobelpreis für Literatur.', 'Ich rauchte gern Zigarren.', 'Ich war britischer Premierminister im Zweiten Weltkrieg.']),
  ('Abraham Lincoln', ['Ich wurde in einer Blockhütte in Kentucky geboren.', 'Ich hielt die berühmte Gettysburg Address.', 'Ich war der 16. Präsident der USA und schaffte die Sklaverei ab.']),
  ('Martin Luther King', ['Ich war Pastor in Montgomery, Alabama.', 'Ich kämpfte gewaltfrei für die Rechte der Schwarzen in den USA.', 'Meine berühmte Rede beginnt mit „I have a dream“.']),
  ('Neil Armstrong', ['Ich war Testpilot und Ingenieur.', 'Mein Raumschiff hieß Apollo 11.', 'Ich war 1969 der erste Mensch auf dem Mond.']),
  ('Charles Dickens', ['Als Kind musste ich in einer Fabrik arbeiten.', 'Ich schrieb über arme Kinder in London, zum Beispiel Oliver Twist.', 'Meine Weihnachtsgeschichte handelt von Ebenezer Scrooge.']),
  ('Jane Austen', ['Ich lebte eine Zeit lang in Bath.', 'Meine Romane handeln von Liebe und Heirat in der feinen Gesellschaft.', 'Ich schrieb „Stolz und Vorurteil“ (Pride and Prejudice).']),
  ('Florence Nightingale', ['Ich wurde in Florenz geboren, daher mein Vorname.', 'Ich pflegte Soldaten im Krimkrieg.', 'Man nannte mich „die Dame mit der Lampe“.']),
  ('Charlie Chaplin', ['Ich wurde in London geboren und wurde in Hollywood berühmt.', 'Meine Filme waren meist ohne Ton.', 'Meine Figur trägt Melone, Schnurrbart und einen Spazierstock.']),
  ('David Beckham', ['Ich spielte für Manchester United, Real Madrid und LA Galaxy.', 'Ich war Kapitän der englischen Nationalmannschaft.', 'Meine Frau Victoria war ein Spice Girl.']),
  ('Adele', ['Ich komme aus London.', 'Meine Alben heißen nach meinem Alter, zum Beispiel „21“ und „25“.', 'Ich sang den James-Bond-Song „Skyfall“.']),
  ('Ed Sheeran', ['Ich habe rote Haare und komme aus Suffolk.', 'Ich spiele Gitarre und benutze eine Loop-Station.', 'Mein großer Hit heißt „Shape of You“.']),
  ('Taylor Swift', ['Ich wuchs in Pennsylvania auf und begann mit Country-Musik.', 'Meine Fans heißen „Swifties“.', 'Meine Tour „The Eras Tour“ brach alle Rekorde.']),
  ('Barack Obama', ['Ich wurde auf Hawaii geboren.', 'Ich bekam 2009 den Friedensnobelpreis.', 'Ich war der erste schwarze Präsident der USA.']),
  ('Walt Disney', ['Ich gründete mit meinem Bruder ein Filmstudio.', 'Ich baute einen berühmten Freizeitpark in Kalifornien.', 'Ich erfand Micky Maus.']),
  ('Steve Jobs', ['Ich gründete meine Firma in einer Garage in Kalifornien.', 'Ich trug fast immer einen schwarzen Rollkragenpullover.', 'Ich stellte 2007 das erste iPhone vor.']),
  ('Emmeline Pankhurst', ['Ich lebte in Manchester.', 'Ich gründete eine Bewegung von Frauen, die man „Suffragettes“ nannte.', 'Ich kämpfte dafür, dass Frauen wählen dürfen.']),
  ('Alan Turing', ['Ich studierte Mathematik in Cambridge.', 'Im Zweiten Weltkrieg knackte ich in Bletchley Park geheime Codes.', 'Ich gelte als Vater der Informatik; ein Test für KI ist nach mir benannt.']),
  ('Robert Burns', ['Ich war ein Bauer und Dichter aus Schottland.', 'Am 25. Januar isst man mir zu Ehren Haggis.', 'Mein Lied „Auld Lang Syne“ singt man zu Silvester.']),
  ('James Bond', ['Ich bin keine echte Person – Ian Fleming hat mich erfunden.', 'Ich trinke meinen Martini „geschüttelt, nicht gerührt“.', 'Mein Code ist 007.']),
  ('Sherlock Holmes', ['Ich bin eine erfundene Figur von Arthur Conan Doyle.', 'Ich spiele Geige und rauche Pfeife.', 'Ich wohne in der Baker Street 221B und mein Freund heißt Dr. Watson.']),
  ('Paddington Bear', ['Ich komme aus „dem dunkelsten Peru“.', 'Ich trage einen blauen Dufflecoat und einen roten Hut.', 'Ich liebe Orangenmarmelade und wurde an einem Londoner Bahnhof gefunden.']),
  ('Mo Farah', ['Ich wurde in Somalia geboren und kam als Kind nach London.', 'Ich bin Langstreckenläufer.', 'Ich gewann bei den Olympischen Spielen 2012 in London zweimal Gold.']),
  ('Malala Yousafzai', ['Ich wurde in Pakistan geboren und lebe in Großbritannien.', 'Ich setze mich dafür ein, dass Mädchen zur Schule gehen dürfen.', 'Mit 17 Jahren bekam ich den Friedensnobelpreis.']),
  ('Freddie Mercury', ['Ich wurde auf Sansibar geboren.', 'Ich war der Sänger der Band Queen.', 'Mein berühmtestes Lied heißt „Bohemian Rhapsody“.']),
]

# Wahr oder falsch? 1/0 | Aussage | Erklärung
TF = '''
1 | In Großbritannien fährt man auf der linken Straßenseite. | Wie auch in Irland, Australien und Japan.
0 | Die Hauptstadt von Schottland ist Glasgow. | Glasgow ist die größte Stadt, die Hauptstadt ist aber Edinburgh.
1 | Big Ben ist eigentlich der Name der großen Glocke im Turm. | Der Turm heißt offiziell Elizabeth Tower.
0 | In Irland bezahlt man mit dem britischen Pfund. | In der Republik Irland zahlt man mit dem Euro, in Nordirland mit dem Pfund.
1 | Wales hat eine eigene Sprache. | Walisisch (Cymraeg) ist neben Englisch Amtssprache in Wales.
1 | Zum Tee gibt man in Großbritannien oft Milch dazu. | Tee mit Milch ist dort ganz normal.
0 | Die USA haben 48 Bundesstaaten. | Es sind 50 – Alaska und Hawaii kamen 1959 dazu.
1 | Die Freiheitsstatue war ein Geschenk aus Frankreich. | Sie wurde 1886 in New York eingeweiht.
0 | Thanksgiving feiert man in den USA im Dezember. | Thanksgiving ist am vierten Donnerstag im November.
1 | Am 5. November feiert man in England die Bonfire Night mit Feuerwerk. | Man erinnert an den gescheiterten Anschlag von Guy Fawkes 1605.
1 | In Schottland tragen Männer zu festlichen Anlässen oft einen Kilt. | Das karierte Muster heißt Tartan.
0 | Fish and Chips isst man in Großbritannien traditionell mit Ketchup und Mayonnaise. | Traditionell mit Salz und Essig (salt and vinegar).
1 | Der St. Patrick’s Day am 17. März ist Irlands Nationalfeiertag. | Man trägt Grün und feiert auf der ganzen Welt.
1 | Die Schuluniform ist an vielen britischen Schulen Pflicht. | Meist mit Pullover, Krawatte oder Blazer in Schulfarben.
0 | In Großbritannien beginnt die Schule meistens erst um 10 Uhr. | Meist zwischen 8.30 und 9 Uhr, dafür geht sie oft bis 15.30 Uhr.
1 | Ein „football“ in den USA ist etwas anderes als in Großbritannien. | In den USA meint man American Football, Fußball heißt dort „soccer“.
1 | In den USA misst man Temperaturen in Fahrenheit. | 32 °F sind 0 °C, 100 °F sind fast 38 °C.
0 | „Handy“ ist das englische Wort für Mobiltelefon. | Das ist ein „falscher Freund“: Es heißt „mobile phone“ (UK) oder „cell phone“ (US).
1 | Der Union Jack vereint die Kreuze von England, Schottland und Irland. | Wales ist auf der Flagge nicht vertreten.
0 | Loch Ness liegt in Wales. | Loch Ness liegt in den schottischen Highlands.
1 | Stonehenge ist über 4000 Jahre alt. | Die ersten Steinkreise entstanden um 3000 bis 2000 v. Chr.
1 | In London gibt es rote Doppeldeckerbusse. | Der klassische Routemaster ist ein Wahrzeichen der Stadt.
0 | Der britische König wohnt in London im Tower. | Seine Londoner Residenz ist der Buckingham Palace; im Tower liegen die Kronjuwelen.
1 | Im Tower of London leben Raben. | Der Legende nach fällt das Königreich, wenn sie den Tower verlassen.
0 | In den USA ist Englisch per Bundesgesetz seit 1776 Amtssprache. | Lange gab es keine offizielle Sprache; erst 2025 wurde Englisch per Präsidentenerlass zur Amtssprache erklärt.
1 | Kanada, Australien und Neuseeland gehören zum Commonwealth. | Insgesamt sind es über 50 Länder.
0 | In Großbritannien heißt die Wohnung „apartment“, in den USA „flat“. | Umgekehrt: „flat“ (UK) und „apartment“ (US).
1 | Ein britisches „biscuit“ ist ein Keks. | In den USA heißt der Keks „cookie“.
1 | Harry Potter wurde in Edinburgh teilweise in Cafés geschrieben. | J. K. Rowling schrieb dort viele Kapitel.
0 | Schottland ist eine Insel. | Schottland liegt im Norden der Insel Großbritannien.
1 | „Cheers“ sagt man in Großbritannien auch als „Danke“. | Ganz locker, zum Beispiel beim Bezahlen.
1 | Am Boxing Day (26. Dezember) ist in Großbritannien Feiertag. | Früher bekamen Angestellte an diesem Tag eine „Christmas box“.
0 | In Großbritannien hat jede Region eine eigene Uhrzeit. | Im ganzen Land gilt dieselbe Zeit, eine Stunde hinter Deutschland.
1 | Die Themse fließt durch London. | Englisch: the River Thames.
0 | Ein „gymnasium“ ist im Englischen eine Schule. | Ein „gym“ ist eine Turnhalle oder ein Fitnessstudio. Unser Gymnasium heißt „grammar school“ oder „secondary school“.
1 | Shakespeare wurde in Stratford-upon-Avon geboren. | Sein Geburtshaus kann man besuchen.
1 | Das Pfund Sterling ist eine der ältesten noch genutzten Währungen. | Es ist über 1200 Jahre alt.
0 | Die USA haben einen König. | Die USA sind eine Republik mit einem Präsidenten.
1 | Halloween stammt ursprünglich aus Irland. | Das keltische Fest Samhain gilt als Vorläufer.
1 | „Become“ heißt „werden“, nicht „bekommen“. | Ein typischer falscher Freund: bekommen = get.
'''

# Zeitstrahl: Jahr | Ereignis
TIMELINE = '''
43 | Die Römer erobern Britannien.
122 | Kaiser Hadrian lässt einen Wall gegen die Stämme im Norden bauen.
1066 | Wilhelm der Eroberer siegt in der Schlacht bei Hastings.
1215 | König Johann unterschreibt die Magna Carta.
1564 | William Shakespeare wird geboren.
1605 | Guy Fawkes will das Parlament sprengen (Gunpowder Plot).
1620 | Die Mayflower bringt Siedler nach Amerika.
1666 | Der große Brand zerstört weite Teile Londons.
1707 | England und Schottland vereinigen sich zu Großbritannien.
1776 | Die USA erklären ihre Unabhängigkeit.
1837 | Königin Victoria besteigt den Thron.
1863 | In London fährt die erste U-Bahn der Welt.
1865 | Der Amerikanische Bürgerkrieg endet, die Sklaverei wird abgeschafft.
1912 | Die Titanic sinkt auf ihrer ersten Fahrt.
1918 | Frauen über 30 dürfen in Großbritannien zum ersten Mal wählen.
1922 | Der größte Teil Irlands wird unabhängig.
1945 | Der Zweite Weltkrieg endet.
1953 | Elizabeth II. wird gekrönt.
1963 | Die Beatles werden weltberühmt („Beatlemania“).
1969 | Neil Armstrong betritt als erster Mensch den Mond.
1973 | Großbritannien und Irland treten der Europäischen Gemeinschaft bei.
1994 | Der Eurotunnel unter dem Ärmelkanal wird eröffnet.
1997 | Der erste Harry-Potter-Band erscheint.
2012 | London richtet die Olympischen Sommerspiele aus.
2020 | Großbritannien verlässt die Europäische Union.
2022 | Charles III. wird König.
'''

# Wo liegt das? Name | Beschreibung | lon | lat (alles auf der Karte Großbritannien/Irland)
PLACES = '''
London | Hauptstadt des Vereinigten Königreichs | -0.13 | 51.51
Edinburgh | Hauptstadt Schottlands | -3.19 | 55.95
Cardiff | Hauptstadt von Wales | -3.18 | 51.48
Belfast | Hauptstadt Nordirlands | -5.93 | 54.6
Dublin | Hauptstadt Irlands | -6.26 | 53.35
Stonehenge | Steinkreis aus der Jungsteinzeit | -1.83 | 51.18
Ben Nevis | höchster Berg Großbritanniens | -5.0 | 56.8
Loch Ness | See mit Seeungeheuer-Legende | -4.45 | 57.3
Oxford | älteste Universität der englischsprachigen Welt | -1.26 | 51.75
Cambridge | Universitätsstadt mit Stocherkähnen | 0.12 | 52.2
Liverpool | Heimat der Beatles | -2.98 | 53.41
Manchester | Industrie- und Fußballstadt | -2.24 | 53.48
Birmingham | zweitgrößte Stadt Englands | -1.9 | 52.48
Glasgow | größte Stadt Schottlands | -4.25 | 55.86
Cornwall (Land’s End) | westlichster Punkt Englands | -5.7 | 50.07
Dover | weiße Klippen am Ärmelkanal | 1.31 | 51.13
Snowdon (Yr Wyddfa) | höchster Berg von Wales | -4.08 | 53.07
Giant’s Causeway | Basaltsäulen an der Küste Nordirlands | -6.51 | 55.24
Cliffs of Moher | Steilklippen an Irlands Westküste | -9.43 | 52.97
Hadrian’s Wall | römischer Grenzwall in Nordengland | -2.3 | 55.0
Stratford-upon-Avon | Geburtsort von Shakespeare | -1.71 | 52.19
Windsor | Schloss der königlichen Familie | -0.6 | 51.48
Brighton | Seebad mit Pier | -0.14 | 50.82
York | mittelalterliche Stadtmauern | -1.08 | 53.96
Isle of Skye | Insel der Inneren Hebriden | -6.2 | 57.3
Aberdeen | „Granitstadt“ an der Nordsee | -2.1 | 57.15
Lake District | Seen- und Berglandschaft | -3.1 | 54.5
Bath | römische Bäder | -2.36 | 51.38
Galway | Hafenstadt an der irischen Westküste | -9.05 | 53.27
Cork | zweitgrößte Stadt Irlands | -8.47 | 51.9
'''

# Höher oder tiefer?
HL = [
  dict(q='Welche Stadt hat mehr Einwohner?', unit='Tsd. Einwohner (ca.)',
       items=[('London', 8900), ('Birmingham', 1150), ('Glasgow', 630), ('Liverpool', 500), ('Manchester', 560), ('Edinburgh', 525), ('Bristol', 470), ('Cardiff', 360), ('Belfast', 345), ('Dublin', 590), ('Cork', 225), ('York', 205)]),
  dict(q='Welcher Berg ist höher?', unit='Meter',
       items=[('Ben Nevis', 1345), ('Snowdon', 1085), ('Scafell Pike', 978), ('Carrauntoohil', 1039), ('Slieve Donard', 850), ('Ben Macdui', 1309), ('Helvellyn', 950), ('Pen y Fan', 886)]),
  dict(q='Welcher US-Bundesstaat hat mehr Einwohner?', unit='Mio. Einwohner (ca.)',
       items=[('California', 39), ('Texas', 31), ('Florida', 23), ('New York', 20), ('Pennsylvania', 13), ('Illinois', 12.5), ('Ohio', 11.8), ('Georgia', 11), ('Washington', 7.9), ('Alaska', 0.74), ('Wyoming', 0.59)]),
  dict(q='Welches Bauwerk ist höher?', unit='Meter',
       items=[('The Shard (London)', 310), ('Blackpool Tower', 158), ('Big Ben (Elizabeth Tower)', 96), ('London Eye', 135), ('Empire State Building', 443), ('Freiheitsstatue (mit Sockel)', 93), ('One World Trade Center', 541)]),
  dict(q='Welches Ereignis war später?', unit='Jahr',
       items=[('Magna Carta', 1215), ('Schlacht bei Hastings', 1066), ('Unabhängigkeit der USA', 1776), ('Erste U-Bahn in London', 1863), ('Titanic-Untergang', 1912), ('Mondlandung', 1969), ('Großer Brand von London', 1666)]),
  dict(q='Welcher Fluss ist länger?', unit='km (ca.)',
       items=[('Severn', 354), ('Themse', 346), ('Shannon', 360), ('Trent', 297), ('Mississippi', 3770), ('Hudson', 507), ('Colorado', 2330)]),
]


# Echtes Englisch hören (Links): Name | URL | Beschreibung
LEARN = [
  ('BBC Learning English', 'https://www.bbc.co.uk/learningenglish', 'Kurze Videos und Audios mit Untertiteln, nach Niveau sortiert. Kostenlos.', 'Kurze Videos und Audios mit Untertiteln, nach Niveau sortiert. Kostenlos.'),
  ('British Council LearnEnglish Teens', 'https://learnenglishteens.britishcouncil.org/', 'Für Jugendliche: Grammatik, Hören und Lesen passend zur Schule. Kostenlos.', 'Für Jugendliche: Grammatik, Hören und Lesen passend zur Schule. Kostenlos.'),
  ('BBC 6 Minute English', 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', 'Wöchentlicher Podcast: zwei Sprecher, ein Thema, sechs Minuten.', 'Wöchentlicher Podcast: zwei Sprecher, ein Thema, sechs Minuten.'),
  ('BBC Newsround', 'https://www.bbc.co.uk/newsround', 'Nachrichten für Kinder und Jugendliche in einfachem Englisch.', 'Nachrichten für Kinder und Jugendliche in einfachem Englisch.'),
]

NEWS = [
  'English Trail ist da: Englisch lernen Ort für Ort – von London bis Dublin.',
  'Schulmodus für das Gymnasium in Baden-Württemberg (Klassen 5–10): Wortschatz, Grammatik und Probe-Klassenarbeit passend zum Bildungsplan.',
  'Zeiten-Werkstatt, unregelmäßige Verben, Simple oder Progressive, Aussprache britisch oder amerikanisch.',
]

NEWS_ALL = [
  ('0.20', '2026-11-13', ['Jetzt auch für Hessen: Wähle im Schulbereich Hessen und Gymnasium – Wörter und Grammatik kommen Jahrgangsstufe für Jahrgangsstufe nach dem hessischen Lehrplan.']),
  ('0.19', '2026-11-13', ['Jetzt auch für Niedersachsen: Wähle im Schulbereich Niedersachsen und Gymnasium.', 'Lehrwerke: English G Access, Green Line und Camden Town.']),
  ('0.18', '2026-11-13', ['Jetzt auch für Bayern: Wähle im Schulbereich Bayern und Gymnasium – Wörter und Grammatik kommen Jahrgangsstufe für Jahrgangsstufe nach dem LehrplanPLUS.', 'Lehrwerke für Bayern: Green Line und English G Access.']),
  ('0.17', '2026-11-13', ['Neu für Klasse 9 und 10 an Realschule, Gemeinschaftsschule und Werkrealschule: Abschluss-Training! Übe die Kommunikationsprüfung – Präsentation mit Stichworten, Timer und Nachfragen, Gespräch in Alltagssituationen und Sprachmittlung – und sieh deine ungefähre Note.', 'Schriftliche Prüfung üben: Listening, Reading, Use of Language und Interpreting – dazu Schreibaufgaben mit Checkliste.']),
  ('0.16', '2026-11-13', ['Gemeinschaftsschule und Realschule: Wähle dein Niveau – G, M oder E. Wörter und Grammatik kommen dann im passenden Tempo.', 'Neu: Werkrealschule / Hauptschule in Baden-Württemberg.', 'Gymnasium Klasse 5/6: an den neuen G9-Bildungsplan angepasst.']),
  ('0.15', '2026-11-13', ['Jetzt auch für Nordrhein-Westfalen: Wähle im Schulbereich NRW und Gymnasium – Wörter und Grammatik kommen in der Reihenfolge, wie ihr sie in NRW lernt.', 'Lehrwerke für NRW: English G Access G9, Green Line G9 und Camden Town G9.']),
  ('0.14', '2026-11-13', ['Jetzt auch für Realschule und Gemeinschaftsschule in Baden-Württemberg: Wähle im Schulbereich deine Schulart – Wörter und Grammatik passen dann zu deinem Bildungsplan.', 'Neue Lehrwerke zur Auswahl: Red Line (Klett) und Highlight (Cornelsen).', 'Neues Paket „Berufe, Praktikum und Bewerbung“ – mit Szene im Hotel in Edinburgh.', 'Vokabeln per Foto noch schneller: Der Kamera-Knopf im Schulbereich öffnet direkt die Kamera, und unter „Meine Wörter“ steht das Foto jetzt ganz oben.']),
  ('0.13', '2026-11-13', ['Trail 3 (B1) ist da: 12 neue Orte vom Giant’s Causeway bis zum Ben Nevis – mit if-Sätzen, Passiv, indirekter Rede, Relativsätzen und mehr. Passt zu Klasse 8–10.', 'Schule: Gib an, bei welcher Unit ihr im Buch gerade seid – der Schulbereich startet dann mit dieser Unit. Wähle die Grammatik der Unit aus und übe sie zusammen mit deinen Wörtern.', 'Nach Thema: 6 neue Alltags-Pakete – Bahn und Flugzeug, Beim Arzt, Im Restaurant, Im Hotel, Hilfe und Notfälle, Am Telefon.', 'Vokabellisten teilen: Deine eingetragene Unit-Liste als Link an die Klasse schicken – die anderen übernehmen sie mit einem Tipp.', 'Neu unter Üben: Prüfungstraining Cambridge – A2 Key oder B1 Preliminary mit Hören, Grammatik, Lesen, Schreiben und Sprechen.', 'Neues Buch: „The Raven’s Key“ – an jedem Ort von Trail 3 liest du ein Kapitel auf Englisch und löst Fragen dazu.', 'Klasse 9/10: neue Länder-Pakete Indien, Kanada und Südafrika – dazu Grammatik: past perfect progressive, Stellung der Adverbiale, Passiv mit zwei Objekten.', 'English Trail startet schneller: Die Schulinhalte werden nur noch geladen, wenn du den Schulbereich nutzt – und nur für dein Bundesland und deine Schulart.', 'Vorbereitung für weitere Bundesländer und Schularten.']),
  ('0.12', '2026-11-06', ['Schule einrichten geht schneller: nur noch Klasse und Buch wählen.', 'Neu: Startcheck „Wie fit bin ich?“ – 20 kurze Aufgaben, danach zeigt dir die App, was du wiederholen solltest. Keine Note!', 'Klasse oder Buch vertan? Unter „Ändern“ wechseln – mit Sicherheitsfrage, deine Wörter und Ergebnisse bleiben erhalten.', 'Buch-Vokabeln: Unit jetzt per Knopf wählen (Welcome, Unit 1–6, Extra).']),
  ('0.11', '2026-11-02', ['Neu unter Üben: „Selbst schreiben“ – alle Wörter, die du schon kennst, ohne Auswahl, nur selbst eintippen (mit Anfangsbuchstaben-Hilfe).', 'Wer lieber antippt: Ab und zu kommt ein „Schreib-Moment“ – ein schon bekanntes Wort schreibst du selbst. Höchstens zweimal pro Runde, abschaltbar unter „Ich“.', 'Selbst schreiben lohnt sich: Für je 5 selbst geschriebene Wörter gibt es eine Extra-Feder für „Mein Rabe“.']),
  ('0.10', '2026-11-01', ['Neu: Vokabeln per Foto! Fotografiere die Vokabelseite aus deinem Englischbuch – die App liest die Wörter, du prüfst kurz und speicherst sie mit deiner Unit. Das Foto bleibt auf deinem Handy.']),
  ('0.9', '2026-11-01', ['Schule: 7 neue Themenpakete – Familie und Freunde, Mein Tag und die Uhrzeit, Wetter und Kleidung, Vorbilder, Britische Geschichte, Australien und Neuseeland, Nachhaltigkeit.', 'Grammatik: 10 neue Themen nach dem Bildungsplan BW – z. B. Possessivbegleiter, s-Genitiv, Fragewörter, have to/needn’t, Question tags, Verbindungswörter, Zustandsverben.']),
  ('0.8', '2026-11-01', ['Trail 2 (A2) ist da: 12 neue Orte von Oxford bis Newcastle – mit going to, simple past, Vergleichen, must, present perfect und will. Passt zu Klasse 6–8.', 'Emmas Postkarten: Nach jedem Ort von Trail 2 kannst du eine neue Karte lesen.']),
  ('0.7', '2026-11-01', ['Mein Rabe: Gestalte deinen eigenen Raben – Gefieder, Krone, Zauberhut, Schal, Brille, Kopfhörer, Fußball … Federn dafür verdienst du nur durchs Üben. Keine Käufe.', 'Unter „Album“ und im Schulbereich.']),
  ('0.6', '2026-11-01', ['Hausaufgabe per Code: Lehrkräfte (oder du) wählen Themen aus und teilen einen Code wie HA7-P3-T5 – alle bekommen dieselben 20 Fragen.', 'Bericht für Eltern: Wochenüberblick mit einem Tipp teilen (nur Zahlen, kein Name).', 'Klasse 5 und 6: Bilder (Emojis) helfen beim Merken der Wörter.', 'Konto anlegen nur mit Bestätigung: 16 oder älter oder Eltern einverstanden.', 'English Trail ist jetzt blau, und die Reise startet in London.']),
  ('0.5', '2026-11-01', ['Live-Duell: Zwei Handys, gleiche Vokabeln in Echtzeit – wer zuerst richtig antwortet, bekommt den Punkt. Ohne Konto, nur mit Spitznamen.', 'Fehler melden geht jetzt mit einem Tipp: „Übersetzung falsch“, „Tippfehler“, „zu schwer“ … – auch direkt im Schulbereich.', 'Neu: „Was kann English Trail?“ – alle Funktionen auf einen Blick, für Kinder und für Eltern & Lehrkräfte (unter „Ich“).']),
  ('0.4', '2026-11-01', ['Wochen-Challenge: Die ganze Klassenstufe bekommt eine Woche lang dieselben 20 Fragen – vergleicht euch im Klassenchat.', 'Duelle mit Schulstoff: „Gegenüber“ (ein Handy, wer zuerst richtig tippt, bekommt den Punkt) und Duell-Code (zwei Handys, gleiche Fragen) jetzt auch mit dem Stoff deiner Klasse oder deinen Buch-Vokabeln.', 'Neu: 8 Lieblingsthemen zum Auswählen – Gaming, Fußball, Tiere & Pferde, Musik, Social Media, Fantasy, Technik, Mode.']),
  ('0.3', '2026-11-01', ['Probe-Klassenarbeit wie in BW: jetzt mit Hörverstehen, Leseverstehen und Sprachmittlung.', 'Neu: Schreibauftrag zu jedem Schulthema – die App prüft Länge, Pflichtwörter, Verbindungswörter und Großschreibung.', 'Vokabeln aus dem Buch als Liste einfügen (eine pro Zeile) – mit Unit.']),
  ('0.2', '2026-11-01', ['Schule: Vokabeln aus deinem Englischbuch mit der Unit eintragen (z. B. „Unit 3“) und jede Unit gezielt üben – auch in der Probe-Klassenarbeit.']),
  ('0.1', '2026-11-01', NEWS),
]


# Übersicht „Was kann English Trail?“ (Seite guide). go = Ziel-Ansicht zum Ausprobieren.
GUIDE = {
 'kids': [
  {'ico': '🗺️', 't': 'Die Reise', 'go': 'home', 'items': [
    ['12 Orte', 'Von London bis Dublin – jeder Ort hat ein Thema, Wörter, Sätze und eine kleine Szene.'],
    ['Brief von Emma', 'Nach jedem Ort kannst du einen Satz mehr lesen. Rabe Rufus bringt ihn dir.'],
    ['Orts-Prüfung', 'Wenn die Wörter sitzen, schaltest du den nächsten Ort frei.']]},
  {'ico': '🎒', 't': 'Schule (BW: Gymnasium, Realschule, Gemeinschaftsschule, Werkrealschule · NRW, Bayern, Niedersachsen, Hessen: Gymnasium – Klasse 5–10)', 'go': 'school', 'items': [
    ['Stoff deiner Klasse', 'Wortschatz-Pakete und Grammatik passend zum Bildungsplan.'],
    ['Startcheck', 'Wie fit bist du für deine Klasse? Danach weißt du, was du wiederholen solltest.'],
    ['Deine Buch-Vokabeln', 'Trag die Wörter aus deinem Englischbuch mit Unit ein – auch als ganze Liste.'],
    ['Vokabeln per Foto', 'Vokabelseite fotografieren, Wörter prüfen, fertig – kein Abtippen mehr.'],
    ['Probe-Klassenarbeit', 'Grammatik, Vokabeln, Hören, Lesen, Sprachmittlung – mit Note.'],
    ['Schreibauftrag', 'Die App prüft Länge, Pflichtwörter und Verbindungswörter.'],
    ['Lieblingsthemen', 'Gaming, Fußball, Tiere, Musik, Social Media, Fantasy, Technik, Mode – du wählst.']]},
  {'ico': '⚔️', 't': 'Gegen andere spielen', 'go': 'practice', 'items': [
    ['Live-Duell', 'Zwei Handys, gleiche Fragen in Echtzeit. Wer zuerst richtig antwortet, bekommt den Punkt.'],
    ['Gegenüber', 'Ein Handy, zwei Spieler – wer zuerst richtig tippt.'],
    ['Duell-Code', 'Gleiche Fragen für alle, die den Code haben – vergleicht danach die Punkte.'],
    ['Wochen-Challenge', 'Die ganze Klassenstufe bekommt eine Woche lang dieselben 20 Fragen.'],
    ['Hausaufgabe per Code', 'Code eingeben (z. B. HA7-P3-T5) – alle aus der Klasse bekommen dieselben Fragen.']]},
  {'ico': '🎮', 't': 'Üben & Spiele', 'go': 'practice', 'items': [
    ['Wiederholen', 'Die App merkt sich, welche Wörter du bald vergisst, und fragt sie rechtzeitig.'],
    ['Selbst schreiben', 'Alle bekannten Wörter ohne Auswahl selbst eintippen – so merkt man sie sich am besten.'],
    ['Prüfungstraining Cambridge', 'A2 Key oder B1 Preliminary üben: Hören, Grammatik, Lesen, Schreiben, Sprechen – mit Rückmeldung.'],
    ['Zeiten-Werkstatt & unregelmäßige Verben', 'Simple Past, Present Perfect, go – went – gone …'],
    ['Blitz, Memory, Stadt-Land-Fluss, Zungenbrecher', 'Schnelle Spiele für zwischendurch.'],
    ['KI-Gespräch', 'Unterhalte dich auf Englisch – passend zu deiner Klasse.']]},
  {'ico': '🏅', 't': 'Sammeln & Belohnungen', 'go': 'album', 'items': [
    ['Mein Rabe', 'Gestalte deinen eigenen Raben. Federn bekommst du fürs Üben (1 pro 50 XP, 2 pro gefundenem Raben, 1 Extra-Feder pro 5 selbst geschriebenen Wörtern).'],
    ['Raben-Album', 'Sammle 24 Raben auf deiner Reise.'],
    ['Wochenziel statt Tages-Druck', 'Ein Tag Pause ist kein Problem – es zählt die Woche.'],
    ['Joker', '50:50, Tipp und Pause-Joker für schwere Fragen.']]},
  {'ico': '🛟', 't': 'Hilfe', 'go': 'me', 'items': [
    ['Fehler melden', 'Etwas falsch? Unter jeder Frage und unter „Ich“ auf „Fehler melden“ tippen. Ein Tipp auf „Übersetzung falsch“ reicht.'],
    ['Was ist neu', 'Alle Neuerungen findest du unter „Ich“.'],
    ['Dein Fortschritt bleibt', 'Bei Updates geht nichts verloren. Vorher wird automatisch gesichert.']]},
 ],
 'adults': [
  {'ico': '📚', 't': 'Was das Kind lernt', 'go': 'school', 'items': [
    ['Bildungsplan BW (Gymnasium; Realschule/GMS nach Sek I, Niveau M; Kl. 5–10)', 'Wortschatz- und Grammatikthemen je Klassenstufe und Schulart.'],
    ['Lehrwerk', 'Green Line, Access oder andere Bücher auswählen; eigene Unit-Vokabeln eintragen.'],
    ['Bericht für Eltern', 'Im Schulbereich: Wochenüberblick (Übungstage, neue Wörter, Probe-Note, knifflige Wörter) zum Teilen.'],
    ['Klassenarbeits-Training', 'Probe-Arbeit mit Hörverstehen, Leseverstehen, Sprachmittlung und Note.']]},
  {'ico': '🧠', 't': 'Wie gelernt wird', 'items': [
    ['Verteilte Wiederholung', 'Wörter kommen in wachsenden Abständen wieder (Leitner-System).'],
    ['Kurze Einheiten', '5–10 Minuten reichen. Sprechen, Hören und beide Richtungen werden geübt.'],
    ['Kein Streak-Druck, keine Werbung, keine Käufe', 'Wochenziel statt Tages-Serie, keine Push-Nachrichten.']]},
  {'ico': '👩‍🏫', 't': 'Für Lehrkräfte', 'go': 'school', 'items': [
    ['Wochen-Challenge', 'Alle Kinder einer Klassenstufe bekommen dieselben Fragen – ohne Anmeldung.'],
    ['Duell-Code mit Klassenstufe', 'Codes mit „-K7“ nutzen nur Stoff bis Klasse 7.'],
    ['Live-Duell', 'Zwei Kinder treten in Echtzeit an – ohne Konto, nur Spitzname.'],
    ['Hausaufgaben-Code', 'Unter Schule → Probe-Klassenarbeit Themen und Pakete ankreuzen, „Als Hausaufgaben-Code teilen“ – fertig. Ohne Anmeldung, ohne Schülerdaten.'],
    ['Wortlisten teilen', 'Eine selbst eingetippte oder fotografierte Unit-Liste als Link an die Klasse schicken; die Liste steckt nur im Link, kein Server.']]},
  {'ico': '🔒', 't': 'Datenschutz', 'items': [
    ['Ohne Konto nutzbar', 'Fortschritt bleibt auf dem Gerät. Geräte-Sync ist freiwillig.'],
    ['Live-Duell', 'Läuft über einen kurzlebigen Kanal; es wird nichts gespeichert, nur der Spitzname wird übertragen.'],
    ['Fehler melden', 'Gesendet werden nur Text, Übung und App-Version – keine Namen, keine Konto-ID.'],
    ['Unter 16', 'Für Geräte-Sync und KI-Gespräch bitte gemeinsam mit den Eltern entscheiden.']]},
  {'ico': '💾', 't': 'Sicherheit des Fortschritts', 'go': 'me', 'items': [
    ['Automatische Sicherung', 'Vor jedem Update wird der Stand gesichert.'],
    ['Sicherung kopieren', 'Unter „Ich“ kann der ganze Stand kopiert und wiederhergestellt werden.']]},
 ],
}
