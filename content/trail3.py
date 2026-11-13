# English Trail – Trail 3 (B1): 12 weitere Orte in Großbritannien & Irland, passend zu Klasse 8–10.
# Grammatik-Faden: past perfect, Zukunftsformen, if II, Passiv, Relativsätze, indirekte Rede, Gerundium/Infinitiv, if III,
# Modalverben der Vergangenheit, Meinungen begründen, present perfect progressive, Partizipien.
# Jeder Ort hat ein Kapitel aus Emmas Buch „The Raven's Key“ (read: 6–7 Sätze + 3 Fragen).
# IDs nie ändern oder umsortieren (Lernstand hängt daran), nur hinten anhängen. Nur gerade Apostrophe (') in Buchtexten.

UNITS = []


def U(**k):
    k['r'] = 3
    UNITS.append(k)


def R(t, lines, qs):
    """Kapitel: t = Titel (de), lines = [(en, de)], qs = [(Frage en, Frage de, [Optionen en], Index richtig)]"""
    return {'t': t, 'lines': lines, 'q': qs}


U(id='gcw', city="Giant's Causeway", cityDe="Giant's Causeway", lon=-6.51, lat=55.24, trail='blue', lab='l',
  title='Legenden erzählen',
  can='Ich kann eine Legende nacherzählen und sagen, was vorher passiert war (past perfect).',
  tip='Past perfect (had + 3. Form) zeigt, was noch früher passiert war: „When we arrived, the bus had already left.“',
  fact='Die rund 40 000 sechseckigen Basaltsäulen entstanden vor etwa 60 Millionen Jahren aus Lava. Die Legende sagt: Der Riese Finn McCool hat sie gebaut.',
  words='''legend | Legende / Sage
giant | Riese
myth | Mythos
column | Säule
coast | Küste
lava | Lava
to cool down | abkühlen
to form | (sich) bilden
to pretend | so tun, als ob
to be scared of | Angst haben vor
brave | mutig
clever | schlau
to escape | fliehen / entkommen
enemy | Feind
had already | hatte schon
had never | hatte noch nie
before that | davor
by the time | als … schon
according to | laut / gemäß
to tell a story | eine Geschichte erzählen''',
  sentences=[
    ('According to the legend, a giant built the causeway.', 'Laut der Legende hat ein Riese den Damm gebaut.'),
    ('By the time we arrived, the rain had stopped.', 'Als wir ankamen, hatte der Regen schon aufgehört.'),
    ('I had never seen such strange rocks before.', 'Ich hatte noch nie zuvor so seltsame Felsen gesehen.'),
    ('The columns formed when the lava cooled down.', 'Die Säulen bildeten sich, als die Lava abkühlte.'),
    ('Finn pretended to be a baby to trick his enemy.', 'Finn tat so, als wäre er ein Baby, um seinen Feind auszutricksen.'),
    ('The other giant was scared and escaped to Scotland.', 'Der andere Riese bekam Angst und floh nach Schottland.'),
    ('After we had walked along the coast, we had lunch.', 'Nachdem wir an der Küste entlanggelaufen waren, aßen wir zu Mittag.'),
    ('Do you know any legends from your region?', 'Kennst du Sagen aus deiner Region?'),
  ],
  scene=dict(
    intro="Giant's Causeway, Nordirland. Wind und Wellen. Ein Guide in grüner Jacke erzählt einer Gruppe von der Legende.",
    steps=[
      dict(npc=("Do you know who built the causeway?", 'Weißt du, wer den Damm gebaut hat?'),
           opts=[("According to the legend, it was a giant called Finn McCool.", 'Laut der Legende war es ein Riese namens Finn McCool.', 1),
                 ("I had built it yesterday.", 'Ich hatte ihn gestern gebaut.', 0)],
           hint='„According to the legend …“ leitet eine Sage ein.'),
      dict(npc=("Right! And what had happened before the Scottish giant ran away?", 'Richtig! Und was war passiert, bevor der schottische Riese weglief?'),
           opts=[("He had seen Finn's 'baby' and thought the father must be enormous.", 'Er hatte Finns „Baby“ gesehen und dachte, der Vater müsse riesig sein.', 1),
                 ("He has run away tomorrow.", 'Er ist morgen weggelaufen.', 0)],
           hint='Was vorher passiert war: had + 3. Form.'),
      dict(npc=("Exactly. And what's the real explanation?", 'Genau. Und was ist die echte Erklärung?'),
           opts=[("The columns formed when lava cooled down millions of years ago.", 'Die Säulen entstanden, als vor Millionen Jahren Lava abkühlte.', 1),
                 ("A giant is cooling down.", 'Ein Riese kühlt gerade ab.', 0)],
           hint='Wissenschaft statt Sage: lava, cooled down.'),
    ],
    outro='Die Gruppe klatscht. Der Guide zwinkert: „Personally, I prefer the giant.“'),
  mission=('Tell a legend', 'Erzähle jemandem auf Englisch eine Sage aus deiner Gegend in fünf Sätzen – mit mindestens einem „had + 3. Form“.'),
  radio=('BBC Radio Ulster', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_ulster'),
  read=R('Kapitel 1: Der Brief im Buch', [
    ("Emma had always loved old books, but this one was different.", 'Emma hatte alte Bücher immer geliebt, aber dieses war anders.'),
    ("Her grandfather had left it to her before he died.", 'Ihr Großvater hatte es ihr hinterlassen, bevor er starb.'),
    ("Inside the cover she found a letter and a small black feather.", 'Im Umschlag fand sie einen Brief und eine kleine schwarze Feder.'),
    ("The letter said: 'Follow the ravens and you will find the key.'", 'Im Brief stand: „Folge den Raben, und du wirst den Schlüssel finden.“'),
    ("Under the words there was a drawing of rocks shaped like honeycombs.", 'Unter den Worten war eine Zeichnung von Felsen, die wie Honigwaben aussahen.'),
    ("Emma knew the place at once: the Giant's Causeway.", 'Emma kannte den Ort sofort: den Giant’s Causeway.'),
    ("On the highest column, someone had carved a tiny raven.", 'Auf der höchsten Säule hatte jemand einen winzigen Raben eingeritzt.'),
  ], [
    ("Who had left Emma the book?", 'Wer hatte Emma das Buch hinterlassen?', ['her grandfather', 'her teacher', 'a giant'], 0),
    ("What did she find inside the cover?", 'Was fand sie im Umschlag?', ['a letter and a feather', 'a key and a map', 'a photo of a raven'], 0),
    ("What was carved on the highest column?", 'Was war in die höchste Säule eingeritzt?', ['a tiny raven', 'her name', 'a key'], 0),
  ]),
)

U(id='abd', city='Aberdeen', cityDe='Aberdeen', lon=-2.09, lat=57.15, trail='blue',
  title='Energie und Zukunft',
  can='Ich kann über Pläne, Vorhersagen und feste Termine sprechen (will, going to, present progressive).',
  tip='Fester Termin: „I’m meeting Sam at six.“ Plan: „I’m going to study engineering.“ Vermutung: „I think it will rain.“',
  fact='Aberdeen war jahrzehntelang die Ölhauptstadt Europas. Heute baut die Stadt Windparks im Meer und Wasserstoff-Busse.',
  words='''energy | Energie
oil | Öl
wind farm | Windpark
offshore | vor der Küste
renewable | erneuerbar
hydrogen | Wasserstoff
engineer | Ingenieur/in
apprenticeship | Ausbildung
to predict | vorhersagen
prediction | Vorhersage
probably | wahrscheinlich
definitely | auf jeden Fall
I'm meeting | ich treffe (fester Termin)
I'm going to | ich habe vor
it will | es wird (Vermutung)
in the future | in Zukunft
by 2040 | bis 2040
to switch to | umsteigen auf
to reduce | verringern
career | Laufbahn / Beruf''',
  sentences=[
    ('I think renewable energy will become cheaper.', 'Ich glaube, erneuerbare Energie wird billiger werden.'),
    ("I'm going to do an apprenticeship as an engineer.", 'Ich habe vor, eine Ausbildung zum Ingenieur zu machen.'),
    ("We're visiting a wind farm tomorrow morning.", 'Morgen früh besichtigen wir einen Windpark.'),
    ('By 2040 most buses will probably run on hydrogen.', 'Bis 2040 werden die meisten Busse wahrscheinlich mit Wasserstoff fahren.'),
    ('Look at those clouds – it is going to rain.', 'Schau dir die Wolken an – es wird gleich regnen.'),
    ('Aberdeen is switching from oil to wind.', 'Aberdeen steigt von Öl auf Wind um.'),
    ('Nobody can predict the future exactly.', 'Niemand kann die Zukunft genau vorhersagen.'),
    ('This job will definitely be important in the future.', 'Dieser Beruf wird in Zukunft auf jeden Fall wichtig sein.'),
  ],
  scene=dict(
    intro='Aberdeen, Hafen. Ein Schiff bringt Teile für einen Windpark. Eine Ingenieurin macht eine Führung für Schulklassen.',
    steps=[
      dict(npc=("What are you going to do after school?", 'Was hast du nach der Schule vor?'),
           opts=[("I'm going to study engineering – maybe here in Scotland!", 'Ich werde Ingenieurwesen studieren – vielleicht hier in Schottland!', 1),
                 ("I will meeting my future.", 'Ich werde Zukunft treffen.', 0)],
           hint='Plan: going to + Grundform.'),
      dict(npc=("Great! Do you think wind energy will replace oil?", 'Super! Glaubst du, Windenergie wird Öl ersetzen?'),
           opts=[("I think it will, but it will probably take a long time.", 'Ich denke schon, aber es wird wahrscheinlich lange dauern.', 1),
                 ("Yes, it is replacing tomorrow.", 'Ja, es ersetzt morgen.', 0)],
           hint='Vermutung: I think … will …'),
      dict(npc=("Our boat to the wind farm leaves at ten. Are you coming?", 'Unser Boot zum Windpark fährt um zehn. Kommst du mit?'),
           opts=[("Yes! I'm meeting my class at the harbour at half past nine.", 'Ja! Ich treffe meine Klasse um halb zehn am Hafen.', 1),
                 ("I'm predicting a boat.", 'Ich sage ein Boot voraus.', 0)],
           hint='Fester Termin: present progressive.'),
    ],
    outro='Auf dem Boot zeigt die Ingenieurin auf die riesigen Rotoren: „One of them powers 7,000 homes.“'),
  mission=('Three futures', 'Schreib drei Sätze über deine Zukunft: einen festen Termin (I’m …ing), einen Plan (going to) und eine Vermutung (will).'),
  radio=('BBC Radio Scotland', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_scotland_fm'),
  read=R('Kapitel 2: Die Nachricht im Hafen', [
    ("The raven on the rock pointed north, so Emma took the ferry to Scotland.", 'Der Rabe auf dem Felsen zeigte nach Norden, also nahm Emma die Fähre nach Schottland.'),
    ("In Aberdeen it was cold, and the wind was blowing hard.", 'In Aberdeen war es kalt, und der Wind blies stark.'),
    ("At the harbour an old fisherman was mending a net.", 'Am Hafen flickte ein alter Fischer ein Netz.'),
    ("'Your grandfather worked here on the oil platforms,' he said.", '„Dein Großvater hat hier auf den Ölplattformen gearbeitet“, sagte er.'),
    ("'He told me that a girl with a black feather would come one day.'", '„Er hat mir gesagt, dass eines Tages ein Mädchen mit einer schwarzen Feder kommen würde.“'),
    ("He gave her an envelope with a train ticket inside.", 'Er gab ihr einen Umschlag mit einer Zugfahrkarte darin.'),
    ("The ticket was for tomorrow morning – to the Isle of Man.", 'Die Fahrkarte war für morgen früh – zur Isle of Man.'),
  ], [
    ("Where had Emma's grandfather worked?", 'Wo hatte Emmas Großvater gearbeitet?', ['on oil platforms', 'in a bookshop', 'on a farm'], 0),
    ("What was the fisherman doing?", 'Was machte der Fischer?', ['mending a net', 'reading a book', 'selling fish'], 0),
    ("What was in the envelope?", 'Was war in dem Umschlag?', ['a ticket', 'a key', 'money'], 0),
  ]),
)

U(id='iom', city='Isle of Man', cityDe='Isle of Man', lon=-4.48, lat=54.20, trail='green', lab='l',
  title='Was wäre, wenn …?',
  can='Ich kann über unwahrscheinliche Situationen sprechen (if-Satz Typ II).',
  tip='If-Satz Typ II: If + simple past, would + Grundform. „If I had a motorbike, I would ride it every day.“ Bei be: „If I were you …“',
  fact='Auf der Isle of Man findet seit 1907 das TT-Motorradrennen statt – auf ganz normalen Straßen, die dafür gesperrt werden.',
  words='''island | Insel
race | Rennen
motorbike | Motorrad
speed | Geschwindigkeit
dangerous | gefährlich
risk | Risiko
safe | sicher
helmet | Helm
to take a risk | ein Risiko eingehen
to crash | verunglücken / crashen
If I were you | Wenn ich du wäre
I would | ich würde
I wouldn't | ich würde nicht
if I had | wenn ich hätte
if I could | wenn ich könnte
to be allowed to | dürfen
rule | Regel
cat without a tail | Katze ohne Schwanz
parliament | Parlament
independent | unabhängig''',
  sentences=[
    ('If I had a motorbike, I would ride it every day.', 'Wenn ich ein Motorrad hätte, würde ich es jeden Tag fahren.'),
    ("If I were you, I wouldn't take that risk.", 'Wenn ich du wäre, würde ich das Risiko nicht eingehen.'),
    ('What would you do if you could fly?', 'Was würdest du tun, wenn du fliegen könntest?'),
    ('The race is dangerous, but the riders love the speed.', 'Das Rennen ist gefährlich, aber die Fahrer lieben die Geschwindigkeit.'),
    ('The island has its own parliament.', 'Die Insel hat ein eigenes Parlament.'),
    ('If it were safer, more people would watch the race.', 'Wenn es sicherer wäre, würden mehr Leute das Rennen anschauen.'),
    ('Manx cats have no tail.', 'Manx-Katzen haben keinen Schwanz.'),
    ('You are not allowed to ride without a helmet.', 'Ohne Helm darfst du nicht fahren.'),
  ],
  scene=dict(
    intro='Douglas, Isle of Man. Am Straßenrand stehen Strohballen, gleich beginnt ein Training. Ein Fan mit Fernglas spricht dich an.',
    steps=[
      dict(npc=("Would you ever ride in the TT race?", 'Würdest du jemals beim TT-Rennen mitfahren?'),
           opts=[("No! If I rode that fast, I would be terrified.", 'Nein! Wenn ich so schnell fahren würde, hätte ich riesige Angst.', 1),
                 ("If I will ride, I am terrified.", 'Wenn ich fahren werde, habe ich Angst.', 0)],
           hint='Typ II: If + simple past, would + Grundform.'),
      dict(npc=("Ha! And what would you do if you lived on this island?", 'Ha! Und was würdest du machen, wenn du auf dieser Insel leben würdest?'),
           opts=[("I would go hiking and I would get a cat without a tail!", 'Ich würde wandern gehen und mir eine Katze ohne Schwanz holen!', 1),
                 ("I live here if I would.", 'Ich lebe hier, wenn ich würde.', 0)],
           hint='would + Grundform für Träume.'),
      dict(npc=("My son wants to ride without a helmet. What would you say?", 'Mein Sohn will ohne Helm fahren. Was würdest du sagen?'),
           opts=[("If I were him, I would always wear a helmet.", 'Wenn ich er wäre, würde ich immer einen Helm tragen.', 1),
                 ("If I was helmet, I ride.", 'Wenn ich Helm war, fahre ich.', 0)],
           hint='Ratschlag: If I were …, I would …'),
    ],
    outro='Ein Motorrad rast vorbei – 200 km/h. Der Fan grinst: „If I were twenty years younger …“'),
  mission=('What would you do?', 'Stell drei Leuten eine „What would you do if …?“-Frage auf Englisch und notiere die Antworten.'),
  radio=('Manx Radio', 'https://www.manxradio.com/'),
  read=R('Kapitel 3: Die Katze ohne Schwanz', [
    ("On the Isle of Man, Emma stayed in a tiny cottage by the sea.", 'Auf der Isle of Man wohnte Emma in einem winzigen Häuschen am Meer.'),
    ("A grey cat without a tail sat on the doorstep every morning.", 'Jeden Morgen saß eine graue Katze ohne Schwanz auf der Türschwelle.'),
    ("Around its neck it wore a collar with a little silver tag.", 'Um den Hals trug sie ein Halsband mit einer kleinen silbernen Marke.'),
    ("On the tag Emma read: 'If you were a raven, where would you fly?'", 'Auf der Marke las Emma: „Wenn du ein Rabe wärst, wohin würdest du fliegen?“'),
    ("She thought about it for a long time.", 'Sie dachte lange darüber nach.'),
    ("'If I were a raven, I would fly to a castle,' she said to the cat.", '„Wenn ich ein Rabe wäre, würde ich zu einer Burg fliegen“, sagte sie zur Katze.'),
    ("The cat jumped onto her map and sat on Hadrian's Wall.", 'Die Katze sprang auf ihre Karte und setzte sich auf den Hadrianswall.'),
  ], [
    ("What was special about the cat?", 'Was war besonders an der Katze?', ['it had no tail', 'it could talk', 'it was black'], 0),
    ("Where was the question written?", 'Wo stand die Frage?', ['on a silver tag', 'on the door', 'in the book'], 0),
    ("Where did the cat sit on the map?", 'Wohin setzte sich die Katze auf der Karte?', ["on Hadrian's Wall", 'on Aberdeen', 'on Dublin'], 0),
  ]),
)

U(id='hdw', city="Hadrian's Wall", cityDe='Hadrianswall', lon=-2.37, lat=55.00, trail='green',
  title='Wie es gemacht wurde',
  can='Ich kann erklären, was gebaut, erfunden oder entdeckt wurde (Passiv).',
  tip='Passiv: be + 3. Form. „The wall was built by the Romans.“ Wer es getan hat, steht mit „by“ – oder fällt weg.',
  fact='Der Hadrianswall wurde ab dem Jahr 122 gebaut und ist 117 km lang. Archäologen fanden hier sogar Briefe römischer Soldaten auf Holztäfelchen.',
  words='''wall | Mauer
the Romans | die Römer
soldier | Soldat/in
fort | Kastell / Festung
emperor | Kaiser
to build – built | bauen – gebaut
to find – found | finden – gefunden
to discover | entdecken
was built | wurde gebaut
were found | wurden gefunden
is visited | wird besucht
by | von (im Passiv)
archaeologist | Archäologe / Archäologin
to dig | graben
ruins | Ruinen
century | Jahrhundert
border | Grenze
to protect | schützen
museum | Museum
World Heritage Site | Welterbe''',
  sentences=[
    ('The wall was built by Roman soldiers.', 'Die Mauer wurde von römischen Soldaten gebaut.'),
    ('It was ordered by Emperor Hadrian in the year 122.', 'Sie wurde im Jahr 122 von Kaiser Hadrian in Auftrag gegeben.'),
    ('Old letters were found near the fort.', 'In der Nähe des Kastells wurden alte Briefe gefunden.'),
    ('Today the wall is visited by thousands of tourists.', 'Heute wird die Mauer von Tausenden Touristen besucht.'),
    ('The ruins are protected as a World Heritage Site.', 'Die Ruinen sind als Welterbe geschützt.'),
    ('Archaeologists are still digging here.', 'Archäologen graben hier immer noch.'),
    ('Many stones were taken away to build farms.', 'Viele Steine wurden weggebracht, um Bauernhöfe zu bauen.'),
    ('The wall marked the border of the Roman Empire.', 'Die Mauer markierte die Grenze des Römischen Reiches.'),
  ],
  scene=dict(
    intro='Housesteads Fort am Hadrianswall. Nebel über den Hügeln. Eine Archäologin kniet in einer Grube und winkt dich heran.',
    steps=[
      dict(npc=("Do you know when this wall was built?", 'Weißt du, wann diese Mauer gebaut wurde?'),
           opts=[("It was built about 1,900 years ago by the Romans.", 'Sie wurde vor etwa 1900 Jahren von den Römern gebaut.', 1),
                 ("The Romans was built it.", 'Die Römer wurde sie gebaut.', 0)],
           hint='Passiv: was built by …'),
      dict(npc=("Look – this shoe was found here yesterday!", 'Schau – dieser Schuh wurde gestern hier gefunden!'),
           opts=[("Wow! Who was it worn by?", 'Wow! Von wem wurde er getragen?', 1),
                 ("Who found by it?", 'Wer gefunden von ihm?', 0)],
           hint='Frage im Passiv: Who was it worn by?'),
      dict(npc=("Probably by a soldier's child. Children lived here too.", 'Wahrscheinlich von einem Soldatenkind. Hier lebten auch Kinder.'),
           opts=[("Amazing. Will it be shown in the museum?", 'Unglaublich. Wird er im Museum ausgestellt?', 1),
                 ("Amazing. It shows the museum.", 'Unglaublich. Er zeigt das Museum.', 0)],
           hint='Zukunft im Passiv: will be shown.'),
    ],
    outro='Ein kleiner Lederschuh, 1900 Jahre alt – und er passt fast in deine Hand.'),
  mission=('It was invented by …', 'Finde drei Dinge in deinem Zimmer und schreib auf Englisch, wo sie hergestellt wurden („It was made in …“).'),
  radio=('BBC Radio Cumbria', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_cumbria'),
  read=R('Kapitel 4: Die Tafel im Museum', [
    ("At the museum near the wall, Emma looked at the Roman letters.", 'Im Museum an der Mauer sah sich Emma die römischen Briefe an.'),
    ("They had been written on thin pieces of wood.", 'Sie waren auf dünne Holzstücke geschrieben worden.'),
    ("One letter had been sent to a soldier by his mother.", 'Ein Brief war von seiner Mutter an einen Soldaten geschickt worden.'),
    ("Next to it, Emma noticed a modern card that was not part of the exhibition.", 'Daneben bemerkte Emma eine moderne Karte, die nicht zur Ausstellung gehörte.'),
    ("It was signed with a raven and her grandfather's initials.", 'Sie war mit einem Raben und den Initialen ihres Großvaters unterschrieben.'),
    ("'The key was not made of iron, but of steel,' it said.", '„Der Schlüssel wurde nicht aus Eisen gemacht, sondern aus Stahl“, stand darauf.'),
    ("Steel? Emma knew which city was famous for steel: Sheffield.", 'Stahl? Emma wusste, welche Stadt für Stahl berühmt war: Sheffield.'),
  ], [
    ("What were the Roman letters written on?", 'Worauf waren die römischen Briefe geschrieben?', ['wood', 'paper', 'stone'], 0),
    ("How was the modern card signed?", 'Wie war die moderne Karte unterschrieben?', ["with a raven and initials", 'with a Roman name', 'with a feather'], 0),
    ("What was the key made of?", 'Woraus war der Schlüssel gemacht?', ['steel', 'iron', 'gold'], 0),
  ]),
)

U(id='shf', city='Sheffield', cityDe='Sheffield', lon=-1.47, lat=53.38, trail='yellow',
  title='Dinge und Menschen beschreiben',
  can='Ich kann Menschen und Dinge mit Relativsätzen genauer beschreiben (who, which, that, whose).',
  tip='Personen: who – Dinge: which – beides: that – Besitz: whose. „The man who made it …“, „the knife which/that I bought …“',
  fact='In Sheffield wurde 1913 der rostfreie Edelstahl erfunden. Heute ist die Stadt eine der grünsten Großbritanniens – mit über zwei Millionen Bäumen.',
  words='''steel | Stahl
stainless | rostfrei
knife | Messer
cutlery | Besteck
factory | Fabrik
worker | Arbeiter/in
to invent | erfinden
invention | Erfindung
to recycle | recyceln
material | Material
to repair | reparieren
second-hand | gebraucht
who | der/die (Person)
which | der/die/das (Sache)
that | der/die/das (Person oder Sache)
whose | dessen / deren
where | wo
craft | Handwerk
tool | Werkzeug
green city | grüne Stadt''',
  sentences=[
    ('Harry Brearley was the man who invented stainless steel.', 'Harry Brearley war der Mann, der rostfreien Stahl erfand.'),
    ('This is the factory where my grandfather worked.', 'Das ist die Fabrik, in der mein Großvater gearbeitet hat.'),
    ('I bought a knife which will last for fifty years.', 'Ich habe ein Messer gekauft, das fünfzig Jahre halten wird.'),
    ('The girl whose bike was stolen got it back.', 'Das Mädchen, dessen Fahrrad gestohlen wurde, hat es zurückbekommen.'),
    ('Things that can be repaired should not be thrown away.', 'Dinge, die repariert werden können, sollte man nicht wegwerfen.'),
    ('Sheffield is a city that has more trees than people.', 'Sheffield ist eine Stadt, die mehr Bäume als Einwohner hat.'),
    ('The tools which we used were very old.', 'Die Werkzeuge, die wir benutzten, waren sehr alt.'),
    ('I like shops that sell second-hand clothes.', 'Ich mag Läden, die gebrauchte Kleidung verkaufen.'),
  ],
  scene=dict(
    intro='Sheffield, eine Werkstatt im alten Fabrikviertel. Eine Messerschmiedin schleift Klingen. Funken fliegen.',
    steps=[
      dict(npc=("Do you know who invented stainless steel?", 'Weißt du, wer rostfreien Stahl erfunden hat?'),
           opts=[("It was a man who lived here in Sheffield – Harry Brearley.", 'Es war ein Mann, der hier in Sheffield lebte – Harry Brearley.', 1),
                 ("It was a man which invented here.", 'Es war ein Mann, welches hier erfand.', 0)],
           hint='Person → who.'),
      dict(npc=("Right. This is a knife which I made for a famous chef.", 'Richtig. Das ist ein Messer, das ich für einen berühmten Koch gemacht habe.'),
           opts=[("Is that the chef whose restaurant is in London?", 'Ist das der Koch, dessen Restaurant in London ist?', 1),
                 ("Is that the chef who's knife is London?", 'Ist das der Koch, wer’s Messer London ist?', 0)],
           hint='Besitz → whose.'),
      dict(npc=("Yes! And I also repair old knives that people bring me.", 'Ja! Und ich repariere auch alte Messer, die mir Leute bringen.'),
           opts=[("That's great – things that last are better for the planet.", 'Super – Dinge, die lange halten, sind besser für den Planeten.', 1),
                 ("That's great – things who break are good.", 'Super – Dinge, wer kaputtgehen, sind gut.', 0)],
           hint='Dinge → that/which.'),
    ],
    outro='Zum Abschied schenkt sie dir einen kleinen Stahlanhänger in Form eines Raben.'),
  mission=('Describe it!', 'Beschreibe drei Gegenstände mit Relativsätzen, ohne den Namen zu sagen – kann jemand sie erraten? („It’s a thing which …“)'),
  radio=('BBC Radio Sheffield', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_sheffield'),
  read=R('Kapitel 5: Die Werkstatt', [
    ("In Sheffield, Emma found the workshop that was drawn on the card.", 'In Sheffield fand Emma die Werkstatt, die auf der Karte gezeichnet war.'),
    ("An old woman, whose hands were black from work, opened the door.", 'Eine alte Frau, deren Hände schwarz von der Arbeit waren, öffnete die Tür.'),
    ("'I'm the one who made the key,' she said with a smile.", '„Ich bin diejenige, die den Schlüssel gemacht hat“, sagte sie lächelnd.'),
    ("'But I don't have it. Your grandfather took it to a city where stories are kept.'", '„Aber ich habe ihn nicht. Dein Großvater hat ihn in eine Stadt gebracht, in der Geschichten aufbewahrt werden.“'),
    ("She showed Emma a photo of a man who was standing outside a castle.", 'Sie zeigte Emma ein Foto von einem Mann, der vor einer Burg stand.'),
    ("In his hand he held a bow and arrow.", 'In der Hand hielt er Pfeil und Bogen.'),
    ("'Nottingham,' Emma whispered. 'Robin Hood.'", '„Nottingham“, flüsterte Emma. „Robin Hood.“'),
  ], [
    ("Who opened the door?", 'Wer öffnete die Tür?', ['an old woman', 'a young man', 'Emma\'s grandfather'], 0),
    ("Who had made the key?", 'Wer hatte den Schlüssel gemacht?', ['the old woman', 'a Roman soldier', 'Robin Hood'], 0),
    ("What did the man in the photo hold?", 'Was hielt der Mann auf dem Foto?', ['a bow and arrow', 'a key', 'a knife'], 0),
  ]),
)

U(id='ntm', city='Nottingham', cityDe='Nottingham', lon=-1.15, lat=52.95, trail='yellow',
  title='Was andere gesagt haben',
  can='Ich kann wiedergeben, was jemand gesagt oder gefragt hat (indirekte Rede).',
  tip='Indirekte Rede mit Zeitverschiebung: „I am tired“ → She said (that) she was tired. Fragen: He asked if/where …',
  fact='Robin Hood soll im Sherwood Forest bei Nottingham gelebt haben. Ob es ihn wirklich gab, weiß niemand – die ältesten Lieder über ihn sind über 600 Jahre alt.',
  words='''forest | Wald
outlaw | Geächteter / Gesetzloser
to steal | stehlen
the rich | die Reichen
the poor | die Armen
fair | gerecht
unfair | ungerecht
justice | Gerechtigkeit
to volunteer | ehrenamtlich helfen
charity | Wohltätigkeitsorganisation
he said that | er sagte, dass
she told me | sie sagte mir
he asked if | er fragte, ob
she asked where | sie fragte, wo
to promise | versprechen
to explain | erklären
to complain | sich beschweren
to admit | zugeben
rumour | Gerücht
sheriff | Sheriff''',
  sentences=[
    ('The guide said that Robin Hood had lived in the forest.', 'Der Guide sagte, dass Robin Hood im Wald gelebt hatte.'),
    ('She told me she was volunteering for a charity.', 'Sie sagte mir, dass sie ehrenamtlich für eine Hilfsorganisation arbeitete.'),
    ('He asked if I had ever been to Sherwood Forest.', 'Er fragte, ob ich schon einmal im Sherwood Forest gewesen sei.'),
    ('My friend asked where the castle was.', 'Mein Freund fragte, wo die Burg sei.'),
    ('The sheriff promised that he would catch Robin.', 'Der Sheriff versprach, dass er Robin fangen würde.'),
    ('Robin explained that he only stole from the rich.', 'Robin erklärte, dass er nur von den Reichen stehle.'),
    ('People complained that the taxes were unfair.', 'Die Leute beschwerten sich, dass die Steuern ungerecht seien.'),
    ('She admitted that she had believed the rumour.', 'Sie gab zu, dass sie dem Gerücht geglaubt hatte.'),
  ],
  scene=dict(
    intro='Sherwood Forest, an der riesigen Major Oak. Eine Ehrenamtliche im Robin-Hood-Kostüm sammelt Spenden für eine Kindertafel.',
    steps=[
      dict(npc=("What did your guide tell you about Robin Hood?", 'Was hat dir dein Guide über Robin Hood erzählt?'),
           opts=[("He said that Robin had stolen from the rich and given to the poor.", 'Er sagte, Robin habe von den Reichen gestohlen und den Armen gegeben.', 1),
                 ("He said that Robin steals tomorrow.", 'Er sagte, dass Robin morgen stiehlt.', 0)],
           hint='Zeitverschiebung: stole → had stolen.'),
      dict(npc=("And what did your friend ask me a minute ago?", 'Und was hat mich dein Freund eben gefragt?'),
           opts=[("She asked if you were paid for this job.", 'Sie fragte, ob Sie für diese Arbeit bezahlt werden.', 1),
                 ("She asked are you paid.", 'Sie fragte, sind Sie bezahlt.', 0)],
           hint='Ja/Nein-Frage → asked if + normale Satzstellung.'),
      dict(npc=("And I told her that I was a volunteer!", 'Und ich habe ihr gesagt, dass ich ehrenamtlich arbeite!'),
           opts=[("You explained that the money went to a food bank, right?", 'Sie haben erklärt, dass das Geld an eine Tafel geht, richtig?', 1),
                 ("You told that money go bank.", 'Sie sagten das Geld gehen Bank.', 0)],
           hint='explained that + Vergangenheit.'),
    ],
    outro='Du wirfst eine Münze in die Dose. „A modern Robin Hood!“, lacht sie.'),
  mission=('Report it', 'Frag ein Familienmitglied drei Dinge auf Englisch und erzähle danach in indirekter Rede, was es gesagt hat („She said that …“).'),
  radio=('BBC Radio Nottingham', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_nottingham'),
  read=R('Kapitel 6: Was der Wächter sagte', [
    ("At Nottingham Castle, Emma asked the guard if he had seen a man with a raven feather.", 'Auf der Burg von Nottingham fragte Emma den Wächter, ob er einen Mann mit einer Rabenfeder gesehen habe.'),
    ("The guard said that he had worked there for thirty years.", 'Der Wächter sagte, dass er seit dreißig Jahren dort arbeite.'),
    ("He told her that an old Irishman had visited every summer.", 'Er erzählte ihr, dass jeden Sommer ein alter Ire zu Besuch gekommen sei.'),
    ("'He said he was looking for a place to hide a secret,' the guard explained.", '„Er sagte, dass er einen Ort suche, um ein Geheimnis zu verstecken“, erklärte der Wächter.'),
    ("Emma asked where the man had gone after that.", 'Emma fragte, wohin der Mann danach gegangen sei.'),
    ("The guard answered that he had talked about a city full of books.", 'Der Wächter antwortete, dass er von einer Stadt voller Bücher gesprochen habe.'),
    ("'Norwich,' he added. 'They call it the City of Stories.'", '„Norwich“, fügte er hinzu. „Man nennt sie die Stadt der Geschichten.“'),
  ], [
    ("How long had the guard worked at the castle?", 'Wie lange arbeitete der Wächter schon an der Burg?', ['thirty years', 'three years', 'one summer'], 0),
    ("What was the old man looking for?", 'Was suchte der alte Mann?', ['a place to hide a secret', 'Robin Hood', 'a job'], 0),
    ("Which city did the man talk about?", 'Von welcher Stadt sprach der Mann?', ['Norwich', 'London', 'Dublin'], 0),
  ]),
)

U(id='nrw', city='Norwich', cityDe='Norwich', lon=1.30, lat=52.63, trail='red',
  title='Lesen, Schreiben, Medien',
  can='Ich kann über Bücher und Medien sprechen und Gerundium oder Infinitiv richtig verwenden.',
  tip='Nach enjoy, avoid, finish, mind: -ing („I enjoy reading“). Nach want, decide, hope, plan: to + Grundform („I want to write“).',
  fact='Norwich war 2012 die erste englische „City of Literature“ der UNESCO. Hier schrieb Julian of Norwich um 1395 das erste bekannte Buch einer Frau auf Englisch.',
  words='''novel | Roman
author | Autor/in
chapter | Kapitel
character | Figur
plot | Handlung
poem | Gedicht
e-book | E-Book
audiobook | Hörbuch
podcast | Podcast
to enjoy doing | gern tun
to avoid doing | vermeiden zu tun
to finish doing | fertig sein mit
to decide to | sich entscheiden zu
to hope to | hoffen zu
to plan to | planen zu
to be good at | gut sein in
to be interested in | sich interessieren für
review | Rezension / Kritik
to recommend | empfehlen
fake news | Falschmeldungen''',
  sentences=[
    ('I enjoy reading fantasy novels.', 'Ich lese gern Fantasy-Romane.'),
    ('She decided to write her own story.', 'Sie beschloss, ihre eigene Geschichte zu schreiben.'),
    ('Have you finished reading the last chapter?', 'Hast du das letzte Kapitel fertig gelesen?'),
    ('I try to avoid reading fake news online.', 'Ich versuche zu vermeiden, online Falschmeldungen zu lesen.'),
    ('He is good at writing poems.', 'Er kann gut Gedichte schreiben.'),
    ('We hope to meet the author at the festival.', 'Wir hoffen, die Autorin auf dem Festival zu treffen.'),
    ('Which book would you recommend?', 'Welches Buch würdest du empfehlen?'),
    ('I prefer listening to audiobooks on the bus.', 'Im Bus höre ich lieber Hörbücher.'),
  ],
  scene=dict(
    intro='Norwich, die Bibliothek „The Forum“. Ein Schreibworkshop für Jugendliche. Die Autorin fragt in die Runde.',
    steps=[
      dict(npc=("What do you enjoy doing in your free time?", 'Was machst du gern in deiner Freizeit?'),
           opts=[("I enjoy reading and I sometimes try writing stories.", 'Ich lese gern und versuche manchmal, Geschichten zu schreiben.', 1),
                 ("I enjoy to read.", 'Ich genieße zu lesen (falsch).', 0)],
           hint='enjoy + -ing.'),
      dict(npc=("Lovely. What do you want to write about?", 'Schön. Worüber möchtest du schreiben?'),
           opts=[("I want to write about a girl who follows ravens.", 'Ich möchte über ein Mädchen schreiben, das Raben folgt.', 1),
                 ("I want writing raven.", 'Ich möchte schreibend Rabe.', 0)],
           hint='want + to + Grundform.'),
      dict(npc=("Fantastic plot! Have you finished planning it?", 'Tolle Handlung! Bist du mit der Planung fertig?'),
           opts=[("Not yet, but I hope to finish the first chapter this week.", 'Noch nicht, aber ich hoffe, das erste Kapitel diese Woche fertigzuschreiben.', 1),
                 ("Yes, I finished to plan.", 'Ja, ich beendete zu planen.', 0)],
           hint='finish + -ing, hope + to.'),
    ],
    outro='Die Autorin notiert sich deine Idee: „I would like to read that book one day.“'),
  mission=('Recommend a book', 'Schreib eine kurze Buch-, Film- oder Serienempfehlung auf Englisch (5 Sätze) mit „I enjoyed …“ und „I would recommend …“.'),
  radio=('BBC Radio Norfolk', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_norfolk'),
  read=R('Kapitel 7: Das fehlende Kapitel', [
    ("In the library in Norwich, Emma asked to see the old books.", 'In der Bibliothek in Norwich bat Emma darum, die alten Bücher sehen zu dürfen.'),
    ("A librarian with green glasses remembered meeting her grandfather.", 'Eine Bibliothekarin mit grüner Brille erinnerte sich daran, ihren Großvater getroffen zu haben.'),
    ("'He enjoyed sitting at that window,' she said, 'and he loved writing.'", '„Er saß gern an diesem Fenster“, sagte sie, „und er schrieb leidenschaftlich gern.“'),
    ("Under the window seat, Emma found a notebook with one page missing.", 'Unter dem Fenstersitz fand Emma ein Notizbuch, in dem eine Seite fehlte.'),
    ("On the last page he had written: 'I decided to sail home.'", 'Auf der letzten Seite hatte er geschrieben: „Ich habe beschlossen, nach Hause zu segeln.“'),
    ("There was a stamp of a ship and the name of a port: Plymouth.", 'Darunter war ein Stempel mit einem Schiff und dem Namen eines Hafens: Plymouth.'),
  ], [
    ("Who remembered Emma's grandfather?", 'Wer erinnerte sich an Emmas Großvater?', ['a librarian', 'a sailor', 'an author'], 0),
    ("What was missing from the notebook?", 'Was fehlte in dem Notizbuch?', ['one page', 'the cover', 'the key'], 0),
    ("Which port was on the stamp?", 'Welcher Hafen stand auf dem Stempel?', ['Plymouth', 'Aberdeen', 'Cork'], 0),
  ]),
)

U(id='ply', city='Plymouth', cityDe='Plymouth', lon=-4.14, lat=50.37, trail='red', lab='l',
  title='Was wäre gewesen, wenn …?',
  can='Ich kann über Vergangenes spekulieren, das anders hätte laufen können (if-Satz Typ III).',
  tip='If-Satz Typ III: If + had + 3. Form, would have + 3. Form. „If the ship hadn’t left, history would have been different.“',
  fact='1620 segelte die „Mayflower“ von Plymouth nach Amerika. Rund 100 Passagiere suchten ein neues Leben – heute sagen Millionen US-Amerikaner, sie stammen von ihnen ab.',
  words='''ship | Schiff
voyage | Seereise
passenger | Passagier/in
to emigrate | auswandern
emigrant | Auswanderer/in
immigrant | Einwanderer/in
new life | neues Leben
storm | Sturm
to survive | überleben
to regret | bereuen
if I had known | wenn ich gewusst hätte
I would have | ich hätte / wäre
I wouldn't have | ich hätte nicht
if it hadn't | wenn es nicht … hätte
lucky | glücklich / Glück haben
to miss the boat | das Schiff verpassen
harbour | Hafen
history | Geschichte
to change | (sich) verändern
different | anders''',
  sentences=[
    ('If the storm had been worse, the ship would have sunk.', 'Wenn der Sturm schlimmer gewesen wäre, wäre das Schiff gesunken.'),
    ('If I had known about the trip, I would have come.', 'Wenn ich von der Reise gewusst hätte, wäre ich mitgekommen.'),
    ("We wouldn't have missed the boat if we had got up earlier.", 'Wir hätten das Schiff nicht verpasst, wenn wir früher aufgestanden wären.'),
    ('Many emigrants left to find a new life.', 'Viele Auswanderer gingen, um ein neues Leben zu finden.'),
    ('The voyage to America took more than two months.', 'Die Reise nach Amerika dauerte über zwei Monate.'),
    ('Half of the passengers did not survive the first winter.', 'Die Hälfte der Passagiere überlebte den ersten Winter nicht.'),
    ("I don't regret moving to another country.", 'Ich bereue nicht, in ein anderes Land gezogen zu sein.'),
    ('History would have been different if they had stayed.', 'Die Geschichte wäre anders verlaufen, wenn sie geblieben wären.'),
  ],
  scene=dict(
    intro='Plymouth, Mayflower Steps am Hafen. Ein Museumsguide zeigt auf das Meer. Eine Schülergruppe aus den USA ist auch da.',
    steps=[
      dict(npc=("What would have happened if the Mayflower hadn't reached America?", 'Was wäre passiert, wenn die Mayflower Amerika nicht erreicht hätte?'),
           opts=[("If it hadn't arrived, history would have been very different.", 'Wenn sie nicht angekommen wäre, wäre die Geschichte ganz anders verlaufen.', 1),
                 ("If it doesn't arrive, history is different.", 'Wenn sie nicht ankommt, ist die Geschichte anders.', 0)],
           hint='Typ III: had + 3. Form … would have + 3. Form.'),
      dict(npc=("Would you have joined the voyage in 1620?", 'Wärst du 1620 mitgefahren?'),
           opts=[("No – if I had known about the storms, I would have stayed at home.", 'Nein – wenn ich von den Stürmen gewusst hätte, wäre ich zu Hause geblieben.', 1),
                 ("Yes, I would join if I know.", 'Ja, ich würde mitfahren, wenn ich weiß.', 0)],
           hint='if I had known … I would have …'),
      dict(npc=("My family emigrated to the USA, too. Do you think they regret it?", 'Meine Familie ist auch in die USA ausgewandert. Glaubst du, sie bereuen es?'),
           opts=[("Probably not – they found a new life there, didn't they?", 'Wahrscheinlich nicht – sie haben dort ein neues Leben gefunden, oder?', 1),
                 ("They regret to emigrate tomorrow.", 'Sie bereuen morgen auszuwandern.', 0)],
           hint='Eine Vermutung mit Rückfrage (question tag).'),
    ],
    outro='Ein Junge aus Boston lacht: „If they hadn’t sailed, I would be British!“'),
  mission=('If I had …', 'Denk an eine Entscheidung aus der letzten Woche: Schreib zwei Sätze, was passiert wäre, wenn du dich anders entschieden hättest (Typ III).'),
  radio=('BBC Radio Devon', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_devon'),
  read=R('Kapitel 8: Der verpasste Hafen', [
    ("In Plymouth, Emma found the harbour office that was on the stamp.", 'In Plymouth fand Emma das Hafenbüro, das auf dem Stempel war.'),
    ("A woman showed her an old list of boats from 1975.", 'Eine Frau zeigte ihr eine alte Liste mit Booten von 1975.'),
    ("Her grandfather's boat was on it: the 'Black Feather'.", 'Das Boot ihres Großvaters stand darauf: die „Black Feather“.'),
    ("'If he had left a day earlier, he would have avoided the storm,' the woman read.", '„Wenn er einen Tag früher abgefahren wäre, hätte er den Sturm vermieden“, las die Frau vor.'),
    ("'He had to stop in Wales to repair the boat.'", '„Er musste in Wales anhalten, um das Boot zu reparieren.“'),
    ("If he hadn't stopped there, Emma thought, he would never have met Grandma.", 'Wenn er dort nicht angehalten hätte, dachte Emma, hätte er Oma nie kennengelernt.'),
    ("Grandma came from Swansea. Emma's next stop was clear.", 'Oma stammte aus Swansea. Emmas nächstes Ziel war klar.'),
  ], [
    ("What was the name of the boat?", 'Wie hieß das Boot?', ["the 'Black Feather'", "the 'Mayflower'", "the 'Raven'"], 0),
    ("Why did he stop in Wales?", 'Warum hielt er in Wales an?', ['to repair the boat', 'to buy food', 'to visit friends'], 0),
    ("Where did Emma's grandmother come from?", 'Woher stammte Emmas Großmutter?', ['Swansea', 'Plymouth', 'Norwich'], 0),
  ]),
)

U(id='swa', city='Swansea', cityDe='Swansea', lon=-3.94, lat=51.62, trail='black', lab='l',
  title='Hätte, sollte, könnte',
  can='Ich kann über Vergangenes urteilen: Was jemand hätte tun sollen oder können (should have, could have, must have).',
  tip='should have + 3. Form = hätte … sollen; could have = hätte … können; must have = muss … haben (Vermutung).',
  fact='In Swansea wurde der Dichter Dylan Thomas geboren. Die Halbinsel Gower nebenan war das erste Gebiet Großbritanniens mit dem Titel „Area of Outstanding Natural Beauty“ (1956).',
  words='''coast | Küste
cliff | Klippe
tide | Gezeiten
high tide | Flut
low tide | Ebbe
to get stuck | festsitzen
rescue | Rettung
lifeboat | Rettungsboot
warning | Warnung
to ignore | ignorieren
should have | hätte … sollen
shouldn't have | hätte nicht … sollen
could have | hätte … können
must have | muss … haben
might have | könnte … haben
mistake | Fehler
careless | leichtsinnig
to check | prüfen / nachsehen
poet | Dichter/in
Welsh | walisisch''',
  sentences=[
    ('We should have checked the tide times.', 'Wir hätten die Gezeitenzeiten prüfen sollen.'),
    ("They shouldn't have ignored the warning signs.", 'Sie hätten die Warnschilder nicht ignorieren sollen.'),
    ('You could have called the lifeboat earlier.', 'Ihr hättet das Rettungsboot früher rufen können.'),
    ('The path is wet – it must have rained in the night.', 'Der Weg ist nass – es muss in der Nacht geregnet haben.'),
    ('He might have forgotten his phone.', 'Er könnte sein Handy vergessen haben.'),
    ('At high tide the island is cut off.', 'Bei Flut ist die Insel abgeschnitten.'),
    ('It was careless to climb the cliff without a rope.', 'Es war leichtsinnig, ohne Seil auf die Klippe zu klettern.'),
    ('Many people in Swansea speak Welsh.', 'Viele Menschen in Swansea sprechen Walisisch.'),
  ],
  scene=dict(
    intro='Worm’s Head bei Swansea. Zwei Wanderer sitzen auf der Felszunge fest – die Flut kommt. Eine Rettungsschwimmerin funkt das Rettungsboot.',
    steps=[
      dict(npc=("Those two walkers are stuck. What should they have done?", 'Die beiden Wanderer sitzen fest. Was hätten sie tun sollen?'),
           opts=[("They should have checked the tide times before they left.", 'Sie hätten vorher die Gezeitenzeiten prüfen sollen.', 1),
                 ("They should check tide yesterday.", 'Sie sollten gestern Gezeiten prüfen.', 0)],
           hint='should have + 3. Form.'),
      dict(npc=("There's a big sign at the start. Why didn't they see it?", 'Am Anfang steht ein großes Schild. Warum haben sie es nicht gesehen?'),
           opts=[("They must have been looking at their phones.", 'Sie müssen auf ihre Handys geschaut haben.', 1),
                 ("They must look phone.", 'Sie müssen Handy schauen.', 0)],
           hint='Vermutung über Vergangenes: must have + 3. Form.'),
      dict(npc=("The lifeboat is on its way. Could it have been dangerous?", 'Das Rettungsboot ist unterwegs. Hätte es gefährlich werden können?'),
           opts=[("Yes, they could have been swept away by the waves.", 'Ja, sie hätten von den Wellen weggerissen werden können.', 1),
                 ("Yes, they could swept the waves.", 'Ja, sie konnten die Wellen fegen.', 0)],
           hint='could have + 3. Form.'),
    ],
    outro='Zehn Minuten später sind beide an Bord. Einer ruft: „We should have listened to you!“'),
  mission=('I should have …', 'Schreib zwei Sätze über etwas, das du diese Woche hättest anders machen sollen – ehrlich, aber freundlich zu dir selbst.'),
  radio=('BBC Radio Wales', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_wales_fm'),
  read=R('Kapitel 9: Omas Gedicht', [
    ("In Swansea, Emma visited her grandmother's old school.", 'In Swansea besuchte Emma die alte Schule ihrer Großmutter.'),
    ("A teacher showed her a poem that Grandma had written in Welsh.", 'Ein Lehrer zeigte ihr ein Gedicht, das Oma auf Walisisch geschrieben hatte.'),
    ("'She must have been very good at writing,' the teacher said.", '„Sie muss sehr gut im Schreiben gewesen sein“, sagte der Lehrer.'),
    ("The poem was about a raven that flew across the sea to Ireland.", 'Das Gedicht handelte von einem Raben, der übers Meer nach Irland flog.'),
    ("'I should have read it years ago,' Emma thought.", '„Ich hätte es vor Jahren lesen sollen“, dachte Emma.'),
    ("The last line said: 'Where the lakes are many, the key is waiting.'", 'Die letzte Zeile lautete: „Wo die Seen zahlreich sind, wartet der Schlüssel.“'),
    ("Lakes in Ireland? That could only mean Killarney.", 'Seen in Irland? Das konnte nur Killarney bedeuten.'),
  ], [
    ("Who had written the poem?", 'Wer hatte das Gedicht geschrieben?', ["Emma's grandmother", 'the teacher', 'Dylan Thomas'], 0),
    ("What was the poem about?", 'Wovon handelte das Gedicht?', ['a raven flying to Ireland', 'a storm at sea', 'a school in Wales'], 0),
    ("Where does Emma go next?", 'Wohin reist Emma als Nächstes?', ['Killarney', 'Cardiff', 'London'], 0),
  ]),
)

U(id='kil', city='Killarney', cityDe='Killarney', lon=-9.51, lat=52.06, trail='black', lab='l',
  title='Meinung und Diskussion',
  can='Ich kann meine Meinung sagen, begründen und auf andere Meinungen eingehen.',
  tip='Für Diskussionen: „In my opinion …“, „I agree / disagree because …“, „That’s a good point, but …“, „On the other hand …“',
  fact='Der Killarney-Nationalpark war 1932 der erste Nationalpark Irlands. Hier leben die einzigen wilden Rothirsche, die es in Irland seit der Eiszeit ununterbrochen gibt.',
  words='''national park | Nationalpark
tourism | Tourismus
tourist | Tourist/in
nature | Natur
to protect | schützen
to allow | erlauben
to ban | verbieten
in my opinion | meiner Meinung nach
I agree | ich stimme zu
I disagree | ich bin anderer Meinung
that's a good point | das ist ein gutes Argument
on the other hand | andererseits
however | jedoch
the advantage is | der Vorteil ist
the disadvantage is | der Nachteil ist
I'm not sure | ich bin nicht sicher
to compromise | einen Kompromiss finden
traffic | Verkehr
local people | Einheimische
balance | Gleichgewicht''',
  sentences=[
    ('In my opinion, cars should be banned in the park.', 'Meiner Meinung nach sollten Autos im Park verboten werden.'),
    ("I agree, because the traffic disturbs the animals.", 'Ich stimme zu, weil der Verkehr die Tiere stört.'),
    ("That's a good point, but local people need tourists.", 'Das ist ein gutes Argument, aber die Einheimischen brauchen Touristen.'),
    ('On the other hand, too many visitors damage nature.', 'Andererseits schaden zu viele Besucher der Natur.'),
    ('The advantage of buses is that they are cleaner.', 'Der Vorteil von Bussen ist, dass sie sauberer sind.'),
    ("I'm not sure if a ban is the best solution.", 'Ich bin nicht sicher, ob ein Verbot die beste Lösung ist.'),
    ('We need a balance between tourism and nature.', 'Wir brauchen ein Gleichgewicht zwischen Tourismus und Natur.'),
    ('Maybe we can find a compromise.', 'Vielleicht können wir einen Kompromiss finden.'),
  ],
  scene=dict(
    intro='Killarney, Rathaus. Eine Bürgerversammlung: Sollen Autos aus dem Nationalpark verbannt werden? Jugendliche dürfen mitreden.',
    steps=[
      dict(npc=("What's your opinion? Should cars be banned from the park?", 'Was ist deine Meinung? Sollen Autos aus dem Park verbannt werden?'),
           opts=[("In my opinion, yes – the animals need peace and quiet.", 'Meiner Meinung nach ja – die Tiere brauchen Ruhe.', 1),
                 ("My opinion is car.", 'Meine Meinung ist Auto.', 0)],
           hint='Meinung + Begründung.'),
      dict(npc=("But the jaunting car drivers need tourists to earn money!", 'Aber die Kutschenfahrer brauchen Touristen, um Geld zu verdienen!'),
           opts=[("That's a good point. However, horse carriages could still be allowed.", 'Das ist ein gutes Argument. Allerdings könnten Pferdekutschen weiter erlaubt sein.', 1),
                 ("I disagree. Horses are cars.", 'Ich bin anderer Meinung. Pferde sind Autos.', 0)],
           hint='Gegenargument anerkennen: That’s a good point. However, …'),
      dict(npc=("So what do you suggest?", 'Was schlägst du also vor?'),
           opts=[("A compromise: electric buses and carriages, but no private cars.", 'Ein Kompromiss: E-Busse und Kutschen, aber keine Privatautos.', 1),
                 ("I suggest that nothing.", 'Ich schlage vor, dass nichts.', 0)],
           hint='Lösung vorschlagen: a compromise …'),
    ],
    outro='Applaus! Die Bürgermeisterin schreibt deinen Vorschlag auf.'),
  mission=('Debate at dinner', 'Diskutiere beim Abendessen eine Frage auf Englisch (z. B. „Should phones be banned at school?“) – mit mindestens zwei Redemitteln aus dieser Lektion.'),
  radio=('RTÉ Radio 1', 'https://www.rte.ie/radio/radio1/'),
  read=R('Kapitel 10: Der Streit am See', [
    ("At the lakes of Killarney, Emma met two brothers who were arguing.", 'An den Seen von Killarney traf Emma zwei Brüder, die sich stritten.'),
    ("'In my opinion, the old boathouse should be sold,' said the older one.", '„Meiner Meinung nach sollte das alte Bootshaus verkauft werden“, sagte der Ältere.'),
    ("'I disagree – Grandad wanted us to keep it,' said the younger one.", '„Da bin ich anderer Meinung – Opa wollte, dass wir es behalten“, sagte der Jüngere.'),
    ("When Emma showed them the black feather, they stopped arguing.", 'Als Emma ihnen die schwarze Feder zeigte, hörten sie auf zu streiten.'),
    ("'Your grandfather was our grandfather's best friend,' they said.", '„Dein Großvater war der beste Freund unseres Großvaters“, sagten sie.'),
    ("In the boathouse there was a wooden box with a lock, but no key.", 'Im Bootshaus stand eine Holzkiste mit einem Schloss, aber ohne Schlüssel.'),
    ("A note on the box said: 'Ask the stone-cutters in the medieval city.'", 'Ein Zettel auf der Kiste sagte: „Frag die Steinmetze in der mittelalterlichen Stadt.“'),
  ], [
    ("What were the brothers arguing about?", 'Worüber stritten die Brüder?', ['the old boathouse', 'a football match', 'the weather'], 0),
    ("Why did they stop arguing?", 'Warum hörten sie auf zu streiten?', ['Emma showed them the feather', 'it started to rain', 'their mother called'], 0),
    ("What was in the boathouse?", 'Was war im Bootshaus?', ['a wooden box with a lock', 'the key', 'a raven'], 0),
  ]),
)

U(id='klk', city='Kilkenny', cityDe='Kilkenny', lon=-7.25, lat=52.65, trail='black',
  title='Was ich schon lange mache',
  can='Ich kann sagen, wie lange ich etwas schon mache (present perfect progressive), z. B. im Bewerbungsgespräch.',
  tip='Seit wann? How long have you been …ing? – „I have been learning English for six years.“ for = Zeitraum, since = Zeitpunkt.',
  fact='Kilkenny heißt „Marble City“ wegen des schwarzen Kalksteins, der hier abgebaut wurde. Die mittelalterliche Altstadt hat ein Schloss, eine Kathedrale und viele Handwerksbetriebe.',
  words='''medieval | mittelalterlich
castle | Schloss / Burg
craft | Handwerk
craftsman | Handwerker
stonemason | Steinmetz/in
apprentice | Auszubildende/r
apprenticeship | Ausbildung
job interview | Vorstellungsgespräch
experience | Erfahrung
skill | Fähigkeit
to apply for | sich bewerben um
CV | Lebenslauf
I have been working | ich arbeite schon (seit)
How long have you been …? | Wie lange … schon?
for six years | seit sechs Jahren
since 2020 | seit 2020
reliable | zuverlässig
hard-working | fleißig
to be interested in | sich interessieren für
work experience | Praktikum''',
  sentences=[
    ('I have been learning English for six years.', 'Ich lerne seit sechs Jahren Englisch.'),
    ('How long have you been working here?', 'Wie lange arbeiten Sie schon hier?'),
    ('She has been carving stone since she was sixteen.', 'Sie bearbeitet Stein, seit sie sechzehn ist.'),
    ("I'm applying for an apprenticeship as a stonemason.", 'Ich bewerbe mich um eine Ausbildung als Steinmetz.'),
    ('I did two weeks of work experience at a workshop.', 'Ich habe zwei Wochen Praktikum in einer Werkstatt gemacht.'),
    ('I am reliable and hard-working.', 'Ich bin zuverlässig und fleißig.'),
    ("It has been raining all day – let's stay inside.", 'Es regnet schon den ganzen Tag – lass uns drinnen bleiben.'),
    ("I'm interested in old crafts.", 'Ich interessiere mich für alte Handwerke.'),
  ],
  scene=dict(
    intro='Kilkenny, eine Steinmetzwerkstatt neben der Kathedrale. Die Meisterin sucht Praktikanten für den Sommer.',
    steps=[
      dict(npc=("So, why are you interested in this work experience?", 'Warum interessierst du dich für dieses Praktikum?'),
           opts=[("I'm interested in old crafts and I love working with my hands.", 'Ich interessiere mich für altes Handwerk und arbeite gern mit den Händen.', 1),
                 ("I am interest for work.", 'Ich bin Interesse für Arbeit.', 0)],
           hint='interested in + -ing / Nomen.'),
      dict(npc=("How long have you been learning English?", 'Wie lange lernst du schon Englisch?'),
           opts=[("I've been learning it for six years, since year five.", 'Ich lerne es seit sechs Jahren, seit der fünften Klasse.', 1),
                 ("I learn it since six years.", 'Ich lerne es seit sechs Jahren (falsch: since).', 0)],
           hint='have been + -ing, for + Zeitraum.'),
      dict(npc=("Good. Why should I choose you?", 'Gut. Warum sollte ich dich nehmen?'),
           opts=[("Because I'm reliable and I've already done a project with stone at school.", 'Weil ich zuverlässig bin und schon ein Steinprojekt in der Schule gemacht habe.', 1),
                 ("Because you choose.", 'Weil du wählst.', 0)],
           hint='Eigenschaft + Erfahrung nennen.'),
    ],
    outro='Die Meisterin gibt dir die Hand: „You start on Monday. Don’t be late!“'),
  mission=('Mini CV', 'Schreib einen Mini-Lebenslauf auf Englisch: drei Sätze mit „I have been …ing for/since …“ und zwei Stärken.'),
  radio=('RTÉ Radio 1', 'https://www.rte.ie/radio/radio1/'),
  read=R('Kapitel 11: Die Steinmetzin', [
    ("In Kilkenny, Emma found a stonemason who had been working there for fifty years.", 'In Kilkenny fand Emma eine Steinmetzin, die seit fünfzig Jahren dort arbeitete.'),
    ("'I've been waiting for you for a long time,' the old woman said.", '„Ich warte schon lange auf dich“, sagte die alte Frau.'),
    ("She took a black stone from a shelf and gave it to Emma.", 'Sie nahm einen schwarzen Stein aus einem Regal und gab ihn Emma.'),
    ("Inside the stone, a small steel key was hidden.", 'Im Stein war ein kleiner Stahlschlüssel versteckt.'),
    ("'Your grandfather asked me to keep it until you were ready,' she explained.", '„Dein Großvater bat mich, ihn aufzubewahren, bis du bereit bist“, erklärte sie.'),
    ("'But the box is not the end. He wanted you to climb the highest mountain.'", '„Aber die Kiste ist nicht das Ende. Er wollte, dass du den höchsten Berg besteigst.“'),
    ("The highest mountain in Britain: Ben Nevis.", 'Der höchste Berg Großbritanniens: der Ben Nevis.'),
  ], [
    ("How long had the stonemason been working there?", 'Wie lange arbeitete die Steinmetzin schon dort?', ['fifty years', 'five years', 'one year'], 0),
    ("Where was the key hidden?", 'Wo war der Schlüssel versteckt?', ['inside a black stone', 'in a book', 'under the castle'], 0),
    ("What did her grandfather want her to do?", 'Was sollte sie nach dem Wunsch ihres Großvaters tun?', ['climb the highest mountain', 'sell the box', 'stay in Kilkenny'], 0),
  ]),
)

U(id='bnv', city='Ben Nevis', cityDe='Ben Nevis', lon=-5.00, lat=56.80, trail='black',
  title='Abenteuer und Grenzen',
  can='Ich kann von einem Abenteuer berichten und Sätze mit Partizipien verkürzen.',
  tip='Partizipien machen Sätze kürzer: „Feeling tired, we stopped.“ = Because we felt tired, we stopped. „Having reached the top, …“ = After we had reached the top, …',
  fact='Der Ben Nevis ist mit 1345 m der höchste Berg Großbritanniens. Auf dem Gipfel ist es so oft neblig, dass man ihn an nur etwa 50 Tagen im Jahr klar sieht.',
  words='''summit | Gipfel
mountain rescue | Bergwacht
fog | Nebel
path | Weg
equipment | Ausrüstung
challenge | Herausforderung
to give up | aufgeben
to keep going | weitermachen
exhausted | erschöpft
proud | stolz
limit | Grenze
teamwork | Teamarbeit
feeling tired | weil wir müde waren
having reached | nachdem wir erreicht hatten
seen from above | von oben gesehen
to set off | aufbrechen
to turn back | umkehren
weather forecast | Wettervorhersage
compass | Kompass
achievement | Leistung / Erfolg''',
  sentences=[
    ('Feeling exhausted, we stopped for a break.', 'Weil wir erschöpft waren, machten wir eine Pause.'),
    ('Having reached the summit, we took a photo.', 'Nachdem wir den Gipfel erreicht hatten, machten wir ein Foto.'),
    ('Seen from above, the lakes looked like mirrors.', 'Von oben gesehen sahen die Seen wie Spiegel aus.'),
    ('We set off at six after checking the weather forecast.', 'Wir brachen um sechs auf, nachdem wir die Wettervorhersage geprüft hatten.'),
    ("When the fog came, we didn't give up.", 'Als der Nebel kam, gaben wir nicht auf.'),
    ('It is important to know your limits.', 'Es ist wichtig, seine Grenzen zu kennen.'),
    ('Without teamwork we would have turned back.', 'Ohne Teamarbeit wären wir umgekehrt.'),
    ("I'm proud of this achievement.", 'Ich bin stolz auf diese Leistung.'),
  ],
  scene=dict(
    intro='Ben Nevis, kurz unter dem Gipfel. Dichter Nebel. Ein Mitglied der Bergwacht kommt euch mit Kompass entgegen.',
    steps=[
      dict(npc=("You look tired. Do you want to turn back?", 'Ihr seht müde aus. Wollt ihr umkehren?'),
           opts=[("Feeling tired, yes – but we checked the forecast and we have the right equipment.", 'Müde schon – aber wir haben die Vorhersage geprüft und die richtige Ausrüstung.', 1),
                 ("Tired feeling turn.", 'Müde Gefühl umkehren.', 0)],
           hint='Partizip am Satzanfang: Feeling tired, …'),
      dict(npc=("Good. Stay on the path and use your compass. Have you done this before?", 'Gut. Bleibt auf dem Weg und nutzt den Kompass. Habt ihr das schon mal gemacht?'),
           opts=[("Yes, having practised in the Alps, we know how to use it.", 'Ja, da wir in den Alpen geübt haben, wissen wir, wie man ihn benutzt.', 1),
                 ("Yes, having practise Alps.", 'Ja, habend üben Alpen.', 0)],
           hint='Vorzeitigkeit: having + 3. Form.'),
      dict(npc=("Then off you go – the summit is ten minutes away.", 'Dann los – der Gipfel ist zehn Minuten entfernt.'),
           opts=[("Thanks! We'll keep going and be careful.", 'Danke! Wir machen weiter und passen auf.', 1),
                 ("Thanks! We give up going.", 'Danke! Wir geben gehen auf.', 0)],
           hint='Weitermachen: keep going.'),
    ],
    outro='Plötzlich reißt der Nebel auf. Ganz Schottland liegt unter dir.'),
  mission=('My adventure', 'Schreib einen kurzen Bericht (6–8 Sätze) über ein eigenes kleines Abenteuer – mit mindestens einem Partizip am Satzanfang.'),
  radio=('BBC Radio Scotland', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_scotland_fm'),
  read=R('Kapitel 12: Auf dem Gipfel', [
    ("Having climbed for five hours, Emma finally reached the summit of Ben Nevis.", 'Nachdem sie fünf Stunden geklettert war, erreichte Emma endlich den Gipfel des Ben Nevis.'),
    ("Feeling tired but happy, she sat down next to the old stone shelter.", 'Müde, aber glücklich setzte sie sich neben die alte Steinhütte.'),
    ("In a gap in the wall, she found a small steel box with a raven on it.", 'In einer Lücke in der Mauer fand sie eine kleine Stahlkiste mit einem Raben darauf.'),
    ("The key from Kilkenny fitted perfectly.", 'Der Schlüssel aus Kilkenny passte genau.'),
    ("Inside there was no gold, only a letter written by her grandfather.", 'Darin war kein Gold, nur ein Brief, den ihr Großvater geschrieben hatte.'),
    ("'The treasure is the journey,' it said. 'Now you speak the language of the whole island.'", '„Der Schatz ist die Reise“, stand darin. „Jetzt sprichst du die Sprache der ganzen Insel.“'),
    ("Above her, a black raven flew through the clouds.", 'Über ihr flog ein schwarzer Rabe durch die Wolken.'),
  ], [
    ("How long did Emma climb?", 'Wie lange kletterte Emma?', ['five hours', 'one hour', 'two days'], 0),
    ("What did the key open?", 'Was öffnete der Schlüssel?', ['a small steel box', 'a castle door', 'a boathouse'], 0),
    ("What was the treasure, according to the letter?", 'Was war laut Brief der Schatz?', ['the journey', 'gold', 'the raven'], 0),
  ]),
)

BOOK = dict(title="The Raven's Key",
            prolog='Emma hat dir ein Buch geschickt: „The Raven’s Key“ – Der Schlüssel des Raben. Auf der ersten Seite steht: „Lies an jedem Ort ein Kapitel. Am Ende wartet ein Schatz auf dem höchsten Berg.“',
            finale='Du hast das ganze Buch auf Englisch gelesen – von der Legende am Giant’s Causeway bis zum Gipfel des Ben Nevis. Emma schreibt dir: „You did it! Your English is B1 now.“')
