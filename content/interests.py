# English Trail – Interessen-Pakete (Schulmodus): Kinder wählen selbst, was sie mögen (nie nach Geschlecht vorgegeben).
# Hintergrund (docs/SCHULE_RECHERCHE_MOTIVATION.md): Interessen motivieren stark, bringen aber oft keinen Schulwortschatz.
# Darum verbindet jedes Paket das Lieblingsthema mit Wortschatz und Grammatik aus Klasse 5–7.

PACKS = []


def K(**k):
    PACKS.append(k)


K(id='i_game', ico='🎮', name='Gaming and streaming', title='Gaming und Streaming',
  can='Ich kann über Spiele sprechen, Spielregeln erklären und sagen, was ich gestern gespielt habe.',
  tip='Beim Erzählen vom letzten Spiel: simple past – „We won the match.“ „I found a secret level.“ Regeln erklärt man im simple present: „You have to collect coins.“',
  fact='Viele Spiele und Streams sind auf Englisch. Wer Begriffe wie „level up“ oder „respawn“ versteht, versteht oft auch die Schulgrammatik dahinter (to level up = aufsteigen).',
  words='''game | Spiel
player | Spieler(in)
level | Level / Stufe
to level up | aufsteigen
to win | gewinnen
to lose | verlieren
score | Punktestand
team | Team
to build | bauen
to collect | sammeln
enemy | Gegner / Feind
weapon | Waffe
health | Lebensenergie
to save | speichern / retten
controller | Controller
streamer | Streamer(in)''',
  sentences=[('You have to collect all the coins to level up.', 'Du musst alle Münzen sammeln, um aufzusteigen.'),
             ('Yesterday we won three matches in a row.', 'Gestern haben wir drei Spiele hintereinander gewonnen.'),
             ("Don't forget to save the game!", 'Vergiss nicht, das Spiel zu speichern!'),
             ('My favourite streamer plays every Friday.', 'Mein Lieblingsstreamer spielt jeden Freitag.'),
             ('If you lose all your health, you have to start again.', 'Wenn du deine ganze Energie verlierst, musst du neu anfangen.'),
             ('We built a huge castle together.', 'Wir haben zusammen eine riesige Burg gebaut.')],
  scene=dict(intro='Online-Spiel mit einem Spieler aus Manchester. Ihr seid im selben Team.',
             steps=[dict(npc=('Hey! Are you new here?', 'Hey! Bist du neu hier?'),
                         opts=[("Yes, it's my first game.", 'Ja, es ist mein erstes Spiel.', 1), ('Yes, I am first game.', 'Ja, ich bin erstes Spiel.', 0)],
                         hint='„It’s my first …“'),
                    dict(npc=("OK, you have to collect the keys. I'll fight the enemies.", 'OK, du musst die Schlüssel sammeln. Ich kämpfe gegen die Gegner.'),
                         opts=[('Got it! Where are the keys?', 'Verstanden! Wo sind die Schlüssel?', 1), ('Got it! Where is the keys?', 'Verstanden! Wo ist die Schlüssel?', 0)],
                         hint='Mehrzahl: Where are …?'),
                    dict(npc=('We won! Good game!', 'Gewonnen! Gutes Spiel!'),
                         opts=[('Good game! That was fun.', 'Gutes Spiel! Das hat Spaß gemacht.', 1), ('Good game! That is fun yesterday.', 'Gutes Spiel! Das ist Spaß gestern.', 0)],
                         hint='Vergangenheit: That was fun.')],
             outro='„GG!“ – ihr verabredet euch für morgen. Ganz auf Englisch.'))

K(id='i_foot', ico='⚽', name='Football and sport', title='Fußball und Sport',
  can='Ich kann über Fußball und Sport sprechen, Spiele kommentieren und Ergebnisse vergleichen.',
  tip='Steigerung passt perfekt zum Sport: faster, stronger, the best team. Ergebnis: „We won 3–1“ (three–one), „It was a draw“ (Unentschieden).',
  fact='In England heißt es „football“, in den USA „soccer“. Die Premier League ist die meistgesehene Fußballliga der Welt.',
  words='''pitch | Spielfeld
goal | Tor
goalkeeper | Torwart
to score | ein Tor schießen
to kick | treten / schießen
referee | Schiedsrichter
penalty | Elfmeter
draw | Unentschieden
match | Spiel
league | Liga
fans | Fans
training | Training
coach | Trainer(in)
fast | schnell
strong | stark
champion | Meister / Sieger''',
  sentences=[('He scored the best goal of the season.', 'Er hat das beste Tor der Saison geschossen.'),
             ('The match ended in a draw.', 'Das Spiel endete unentschieden.'),
             ('Our goalkeeper is faster than theirs.', 'Unser Torwart ist schneller als ihrer.'),
             ('The referee gave a penalty.', 'Der Schiedsrichter gab einen Elfmeter.'),
             ('We have training on Tuesdays and Thursdays.', 'Wir haben dienstags und donnerstags Training.'),
             ('If we win on Saturday, we will be champions.', 'Wenn wir am Samstag gewinnen, werden wir Meister.')],
  scene=dict(intro='Im Stadion in Liverpool. Ein Fan neben dir will wissen, für wen du bist.',
             steps=[dict(npc=('Who do you support?', 'Für wen bist du?'),
                         opts=[('I support Liverpool, of course!', 'Für Liverpool natürlich!', 1), ('I am support Liverpool.', 'Ich bin unterstützen Liverpool.', 0)],
                         hint='support = Fan sein von.'),
                    dict(npc=('Goal! What a shot!', 'Tor! Was für ein Schuss!'),
                         opts=[("That's the best goal I've ever seen!", 'Das ist das beste Tor, das ich je gesehen habe!', 1), ("That's the goodest goal!", 'Das ist das guteste Tor!', 0)],
                         hint='good – better – best.'),
                    dict(npc=('If we score again, we win the league!', 'Wenn wir noch eins schießen, gewinnen wir die Liga!'),
                         opts=[("Come on, Liverpool!", 'Los, Liverpool!', 1), ('Come in, Liverpool!', 'Komm rein, Liverpool!', 0)],
                         hint='Anfeuern: „Come on!“')],
             outro='3:1 – das ganze Stadion singt. Du singst einfach mit.'))

K(id='i_anim', ico='🐴', name='Animals and horses', title='Tiere und Pferde',
  can='Ich kann Tiere beschreiben, über Haustiere und Pferde sprechen und sagen, wie man sie pflegt.',
  tip='Wie oft? Häufigkeitsadverbien vor dem Verb: „I always feed my rabbit in the morning.“ – „She never rides without a helmet.“',
  fact='In Großbritannien gibt es über 50 Millionen Haustiere. Hunde und Katzen sind am beliebtesten.',
  words='''horse | Pferd
pony | Pony
to ride | reiten
saddle | Sattel
stable | Stall
to feed | füttern
to brush | bürsten / striegeln
hay | Heu
rabbit | Kaninchen
hamster | Hamster
puppy | Welpe
kitten | Kätzchen
cute | süß
wild | wild
vet | Tierarzt / Tierärztin
to look after | sich kümmern um''',
  sentences=[('I ride my pony every Saturday.', 'Ich reite jeden Samstag mein Pony.'),
             ('You have to brush the horse before you ride.', 'Du musst das Pferd vor dem Reiten striegeln.'),
             ('My rabbit always eats hay in the morning.', 'Mein Kaninchen frisst morgens immer Heu.'),
             ('The puppy is sleeping in its basket.', 'Der Welpe schläft in seinem Korb.'),
             ('We took the cat to the vet yesterday.', 'Wir haben die Katze gestern zum Tierarzt gebracht.'),
             ('Who looks after your pets when you are on holiday?', 'Wer kümmert sich um deine Haustiere, wenn du im Urlaub bist?')],
  scene=dict(intro='Auf einem Reiterhof in Wales. Die Stallbesitzerin begrüßt dich.',
             steps=[dict(npc=('Hello! Have you ever ridden a horse?', 'Hallo! Bist du schon einmal geritten?'),
                         opts=[('Yes, I have. I ride every week.', 'Ja. Ich reite jede Woche.', 1), ('Yes, I rode ever.', 'Ja, ich ritt je.', 0)],
                         hint='Have you ever …? → Yes, I have.'),
                    dict(npc=('Great. First, can you brush Bella?', 'Super. Kannst du zuerst Bella striegeln?'),
                         opts=[('Of course! Where is the brush?', 'Klar! Wo ist die Bürste?', 1), ('Of course! Where the brush is?', 'Klar! Wo die Bürste ist?', 0)],
                         hint='Frage mit be: Where is …?'),
                    dict(npc=('She loves apples. Do you want to feed her?', 'Sie liebt Äpfel. Willst du sie füttern?'),
                         opts=[("Yes, please! She's so cute.", 'Ja, gerne! Sie ist so süß.', 1), ("Yes, please! He's so cute.", 'Ja, gerne! Er ist so süß.', 0)],
                         hint='Bella ist eine Stute → she.')],
             outro='Bella frisst dir den Apfel aus der Hand – und schnaubt zufrieden.'))

K(id='i_music', ico='🎤', name='Music and stars', title='Musik und Stars',
  can='Ich kann über Musik, Lieblingssongs und Stars sprechen und meine Meinung begründen.',
  tip='Meinung begründen: „I like her songs because they are catchy.“ – mit „because“. Vergleiche: „Her new album is better than the last one.“',
  fact='Viele Superstars wie Taylor Swift, Ed Sheeran oder Adele singen auf Englisch – Liedtexte sind ein beliebter Weg, neue Wörter zu lernen.',
  words='''song | Lied
singer | Sänger(in)
band | Band
album | Album
lyrics | Liedtext
concert | Konzert
stage | Bühne
tour | Tournee
fan | Fan
to dance | tanzen
catchy | eingängig
loud | laut
to listen to | anhören
playlist | Playlist
famous | berühmt
favourite | Lieblings-''',
  sentences=[('My favourite singer is going on tour next year.', 'Meine Lieblingssängerin geht nächstes Jahr auf Tournee.'),
             ('I like this song because it is so catchy.', 'Ich mag dieses Lied, weil es so eingängig ist.'),
             ('Her new album is better than the last one.', 'Ihr neues Album ist besser als das letzte.'),
             ('We danced all night at the concert.', 'Wir haben beim Konzert die ganze Nacht getanzt.'),
             ('Can you send me your playlist?', 'Kannst du mir deine Playlist schicken?'),
             ('She has been famous since she was sixteen.', 'Sie ist berühmt, seit sie sechzehn ist.')],
  scene=dict(intro='Vor einem Konzert in London. Ein Mädchen mit Glitzer-Shirt steht neben dir in der Schlange.',
             steps=[dict(npc=('Hi! Is this your first concert?', 'Hi! Ist das dein erstes Konzert?'),
                         opts=[("Yes, and I'm so excited!", 'Ja, und ich bin so aufgeregt!', 1), ("Yes, and I'm so exciting!", 'Ja, und ich bin so aufregend!', 0)],
                         hint='excited = aufgeregt (Gefühl), exciting = aufregend (Sache).'),
                    dict(npc=("What's your favourite song?", 'Was ist dein Lieblingssong?'),
                         opts=[("I love the new one because it's so catchy.", 'Ich liebe den neuen, weil er so eingängig ist.', 1), ('I love the new one why it is catchy.', 'Ich liebe den neuen warum er eingängig ist.', 0)],
                         hint='Begründen mit „because“.'),
                    dict(npc=('Look, the doors are opening!', 'Schau, die Türen gehen auf!'),
                         opts=[("Let's go! Let's get close to the stage.", 'Los! Lass uns nah an die Bühne gehen.', 1), ("Let's going to the stage.", 'Lass uns gehend zur Bühne.', 0)],
                         hint='Let’s + Grundform.')],
             outro='Ihr singt jedes Lied mit – und tauscht danach eure Playlists.'))

K(id='i_social', ico='📸', name='Social media and creators', title='Social Media und Creator',
  can='Ich kann über Videos, Posts und Creator sprechen und Tipps für sicheres Posten geben.',
  tip='Tipps und Regeln mit „should“ und „shouldn’t“: „You should check your settings.“ „You shouldn’t share your address.“',
  fact='Viele Creator machen Videos auf Englisch. Englische Untertitel einzuschalten ist ein einfacher Trick, um nebenbei zu lernen.',
  words='''video | Video
creator | Creator / Ersteller(in)
to upload | hochladen
to post | posten
comment | Kommentar
like | Like / gefällt mir
to follow | folgen
channel | Kanal
filter | Filter
trend | Trend
viral | viral
tutorial | Anleitung (Video)
to edit | bearbeiten / schneiden
settings | Einstellungen
private | privat
to share | teilen''',
  sentences=[('She uploads a new tutorial every week.', 'Sie lädt jede Woche ein neues Tutorial hoch.'),
             ('The video went viral in one day.', 'Das Video ging an einem Tag viral.'),
             ('You should make your account private.', 'Du solltest dein Konto auf privat stellen.'),
             ("You shouldn't share your address online.", 'Du solltest deine Adresse nicht online teilen.'),
             ('How long does it take to edit a video?', 'Wie lange dauert es, ein Video zu schneiden?'),
             ('I follow a creator who explains science.', 'Ich folge einem Creator, der Naturwissenschaft erklärt.')],
  scene=dict(intro='Deine Austauschpartnerin Zoe dreht ein Video für ihren Kanal und fragt dich um Hilfe.',
             steps=[dict(npc=('Can you film me? I want to post a dance video.', 'Kannst du mich filmen? Ich will ein Tanzvideo posten.'),
                         opts=[('Sure! Tell me when to start.', 'Klar! Sag mir, wann ich anfangen soll.', 1), ('Sure! Say me when starting.', 'Klar! Sag mir wann anfangend.', 0)],
                         hint='tell me = sag mir.'),
                    dict(npc=('Should I add a filter?', 'Soll ich einen Filter drauflegen?'),
                         opts=[("You don't need one. You look great!", 'Brauchst du nicht. Du siehst toll aus!', 1), ("You don't need. You look greatly.", 'Brauchst nicht. Du siehst großartiglich aus.', 0)],
                         hint='look + Adjektiv (great), nicht Adverb.'),
                    dict(npc=('Is my account private, by the way?', 'Ist mein Konto eigentlich privat?'),
                         opts=[('Check your settings – it should be private.', 'Schau in die Einstellungen – es sollte privat sein.', 1), ('Check your settings – it should being private.', 'Schau – es sollte seiend privat.', 0)],
                         hint='should + Grundform.')],
             outro='Das Video bekommt 50 Likes – von Freunden, denn das Konto ist privat. Gut so.'))

K(id='i_fant', ico='🐉', name='Fantasy, books and films', title='Fantasy, Bücher und Filme',
  can='Ich kann über Bücher und Filme sprechen, eine Geschichte nacherzählen und Figuren beschreiben.',
  tip='Geschichten erzählt man im simple past: „The dragon flew over the castle.“ Hintergrund mit past progressive: „While the hero was sleeping, …“',
  fact='Viele berühmte Fantasy-Geschichten kommen aus Großbritannien: Harry Potter, Der Herr der Ringe und Die Chroniken von Narnia.',
  words='''story | Geschichte
hero | Held(in)
villain | Bösewicht
dragon | Drache
wizard | Zauberer
witch | Hexe
magic | Magie / magisch
spell | Zauberspruch
castle | Burg / Schloss
sword | Schwert
secret | Geheimnis / geheim
brave | mutig
scary | gruselig
to escape | entkommen
chapter | Kapitel
ending | Ende (Geschichte)''',
  sentences=[('The dragon flew over the castle.', 'Der Drache flog über die Burg.'),
             ('While the hero was sleeping, the villain stole the sword.', 'Während der Held schlief, stahl der Bösewicht das Schwert.'),
             ('The wizard knew a secret spell.', 'Der Zauberer kannte einen geheimen Zauberspruch.'),
             ('I read the last chapter in one night.', 'Ich habe das letzte Kapitel in einer Nacht gelesen.'),
             ('The film was scarier than the book.', 'Der Film war gruseliger als das Buch.'),
             ('She was brave enough to escape from the tower.', 'Sie war mutig genug, aus dem Turm zu entkommen.')],
  scene=dict(intro='In einer Buchhandlung in Edinburgh, nicht weit von dem Café, in dem Harry Potter entstand.',
             steps=[dict(npc=('Can I help you find a book?', 'Kann ich dir helfen, ein Buch zu finden?'),
                         opts=[("Yes, I'm looking for a fantasy story with dragons.", 'Ja, ich suche eine Fantasy-Geschichte mit Drachen.', 1), ("Yes, I look for a fantasy with dragon.", 'Ja, ich suche Fantasy mit Drache.', 0)],
                         hint='I’m looking for … = ich suche …'),
                    dict(npc=('This one is brilliant. Have you seen the film?', 'Das hier ist großartig. Hast du den Film gesehen?'),
                         opts=[("Yes, but the book is usually better.", 'Ja, aber das Buch ist meistens besser.', 1), ('Yes, but the book is usually more good.', 'Ja, aber das Buch ist meistens mehr gut.', 0)],
                         hint='good – better – best.'),
                    dict(npc=("Don't tell me the ending!", 'Verrat mir nicht das Ende!'),
                         opts=[("Don't worry, I won't!", 'Keine Sorge, mach ich nicht!', 1), ("Don't worry, I don't will!", 'Keine Sorge, ich nicht werde!', 0)],
                         hint='Verneinung von will: won’t.')],
             outro='Du kaufst das Buch und liest das erste Kapitel noch im Zug.'))

K(id='i_tech', ico='🤖', name='Science and technology', title='Technik und Naturwissenschaft',
  can='Ich kann einfache Experimente und Erfindungen beschreiben und erklären, wie etwas funktioniert.',
  tip='Wie etwas funktioniert, erklärt man oft im Passiv: „The robot is controlled by an app.“ – „Electricity is made by the wind.“',
  fact='Großbritannien hat viele Erfinder hervorgebracht: Das World Wide Web, das Telefon (Alexander Graham Bell, Schotte) und die Dampflok.',
  words='''science | Naturwissenschaft
experiment | Experiment
to invent | erfinden
invention | Erfindung
robot | Roboter
battery | Batterie / Akku
electricity | Strom
engine | Motor
space | Weltraum
planet | Planet
rocket | Rakete
to measure | messen
result | Ergebnis
to control | steuern
code | Code
lab | Labor''',
  sentences=[('The robot is controlled by an app.', 'Der Roboter wird über eine App gesteuert.'),
             ('We did an experiment with batteries in science.', 'Wir haben in Naturwissenschaften ein Experiment mit Batterien gemacht.'),
             ('Who invented the telephone?', 'Wer hat das Telefon erfunden?'),
             ('The rocket was launched in 2024.', 'Die Rakete wurde 2024 gestartet.'),
             ('First we measure the water, then we heat it.', 'Zuerst messen wir das Wasser, dann erhitzen wir es.'),
             ('If I could invent something, I would build a homework robot.', 'Wenn ich etwas erfinden könnte, würde ich einen Hausaufgaben-Roboter bauen.')],
  scene=dict(intro='Im Science Museum in London. An einer Station kannst du einen Roboter steuern.',
             steps=[dict(npc=('Do you want to try? The robot is controlled by this tablet.', 'Willst du es versuchen? Der Roboter wird mit diesem Tablet gesteuert.'),
                         opts=[('Yes! How does it work?', 'Ja! Wie funktioniert das?', 1), ('Yes! How it works?', 'Ja! Wie es funktioniert?', 0)],
                         hint='Frage mit does: How does it work?'),
                    dict(npc=('Write a short code and press start.', 'Schreib einen kurzen Code und drück Start.'),
                         opts=[("Done! Look, it's moving!", 'Fertig! Schau, er bewegt sich!', 1), ("Done! Look, it moves now at the moment!", 'Fertig! Schau, er bewegt jetzt gerade!', 0)],
                         hint='Gerade jetzt → present progressive (it’s moving).'),
                    dict(npc=('Great! What would you invent if you could?', 'Super! Was würdest du erfinden, wenn du könntest?'),
                         opts=[('I would invent a robot that tidies my room.', 'Ich würde einen Roboter erfinden, der mein Zimmer aufräumt.', 1), ('I will invent a robot who tidy my room.', 'Ich werde einen Roboter erfinden, wer aufräum mein Zimmer.', 0)],
                         hint='If-Satz Typ II → would + Grundform.')],
             outro='Am Ende bekommst du ein „Junior Engineer“-Abzeichen.'))

K(id='i_fash', ico='👗', name='Fashion and style', title='Mode und Style',
  can='Ich kann Kleidung und Style beschreiben, Outfits vergleichen und beim Shoppen nach Größen fragen.',
  tip='Adjektive stehen vor dem Nomen und haben keine Endung: „a black hoodie“, „comfortable trainers“. Reihenfolge: Meinung – Größe – Farbe: „a cool big blue jacket“.',
  fact='In Großbritannien heißen Turnschuhe „trainers“, in den USA „sneakers“. Viele Modetrends starten in London.',
  words='''clothes | Kleidung
outfit | Outfit
hoodie | Kapuzenpulli
trainers | Turnschuhe
jeans | Jeans
jacket | Jacke
dress | Kleid
skirt | Rock
cap | Kappe
earrings | Ohrringe
comfortable | bequem
fashionable | modisch
to wear | tragen (Kleidung)
to try on | anprobieren
style | Stil
second-hand | gebraucht''',
  sentences=[("I'm wearing my new trainers today.", 'Ich trage heute meine neuen Turnschuhe.'),
             ('This hoodie is more comfortable than that jacket.', 'Dieser Hoodie ist bequemer als die Jacke.'),
             ('Can I try on this dress in a small?', 'Kann ich dieses Kleid in S anprobieren?'),
             ('She buys a lot of second-hand clothes.', 'Sie kauft viel gebrauchte Kleidung.'),
             ('What are you going to wear to the party?', 'Was wirst du auf der Party tragen?'),
             ('Your earrings look really cool.', 'Deine Ohrringe sehen echt cool aus.')],
  scene=dict(intro='In einem Second-Hand-Laden in Brighton. Eine Verkäuferin hilft dir.',
             steps=[dict(npc=('Hi! Are you looking for anything special?', 'Hi! Suchst du etwas Bestimmtes?'),
                         opts=[("Yes, an outfit for a party on Saturday.", 'Ja, ein Outfit für eine Party am Samstag.', 1), ('Yes, a outfit for party in Saturday.', 'Ja, ein Outfit für Party in Samstag.', 0)],
                         hint='an outfit (Vokal!) und on Saturday.'),
                    dict(npc=('What about this black jacket?', 'Wie wäre es mit dieser schwarzen Jacke?'),
                         opts=[("It's nice. Can I try it on?", 'Schön. Kann ich sie anprobieren?', 1), ("It's nice. Can I try on it?", 'Schön. Kann ich anprobieren sie?', 0)],
                         hint='try it on – das Pronomen steht in der Mitte.'),
                    dict(npc=('It looks great on you!', 'Sie steht dir super!'),
                         opts=[("Thanks! I'll take it.", 'Danke! Ich nehme sie.', 1), ("Thanks! I take her.", 'Danke! Ich nehme sie (Person).', 0)],
                         hint='Dinge sind „it“, nicht „her“.')],
             outro='Für sieben Pfund hast du das beste Outfit der Party.'))
