import re

# English Trail – Zeiten-Werkstatt (ersetzt die Fall-Werkstatt) und Simple vs. Progressive (ersetzt Verb-Aspekt).
# Jede Aufgabe trägt ein Grammatik-Thema (g) mit Klassenstufe (Gymnasium BW, Bildungsplan 2016) –
# der Schulmodus filtert darüber, was zur eigenen Klasse passt.
# Zeilenformat CASES: thema | Satz mit ___ | Grundform | richtige Antwort | Ablenker1; Ablenker2 | Warum | Übersetzung

TOPICS = {
  # id: (Anzeigename, Klasse ab)
  'pres':   ('Simple present', 5),
  'prog':   ('Present progressive', 5),
  'can':    ('can / must / may', 5),
  'past':   ('Simple past', 6),
  'goingto':('going to-future', 6),
  'will':   ('will-future', 6),
  'perf':   ('Present perfect', 6),
  'comp':   ('Steigerung (comparison)', 6),
  'quant':  ('some / any, much / many', 5),
  'pastprog': ('Past progressive', 7),
  'perfpast': ('Present perfect oder simple past', 7),
  'if1':    ('If-Satz Typ I', 7),
  'rel':    ('Relativsätze (who / which / whose)', 7),
  'adv':    ('Adjektiv oder Adverb', 7),
  'if2':    ('If-Satz Typ II', 8),
  'pastperf': ('Past perfect', 8),
  'passive':('Passiv', 8),
  'reported': ('Indirekte Rede', 8),
  'perfprog': ('Present perfect progressive', 8),
  'if3':    ('If-Satz Typ III', 9),
  'gerund': ('Gerundium oder Infinitiv', 9),
  'passive2': ('Passiv (alle Zeiten)', 9),
  'future': ('Zukunftsformen', 10),
  'part':   ('Partizipialkonstruktionen', 10),
}

CASES = '''
pres | She ___ to school by bus every day. | go | goes | go; going | he/she/it im simple present: -s anhängen (bei go: goes). | Sie fährt jeden Tag mit dem Bus zur Schule.
pres | My parents ___ in Heidelberg. | live | live | lives; living | Bei they/we/I/you kein -s. | Meine Eltern wohnen in Heidelberg.
pres | Tom ___ like fish. | do | doesn't | don't; isn't | Verneinung bei he/she/it: doesn't + Grundform. | Tom mag keinen Fisch.
pres | ___ you play the guitar? | do | Do | Does; Are | Fragen im simple present mit do/does; bei you: Do. | Spielst du Gitarre?
pres | ___ your sister speak French? | do | Does | Do; Is | Bei he/she/it fragt man mit Does. | Spricht deine Schwester Französisch?
pres | The shop ___ at nine o'clock. | open | opens | open; opening | Fahrpläne und Öffnungszeiten stehen im simple present, it → -s. | Der Laden öffnet um neun Uhr.
pres | He always ___ his homework after lunch. | do | does | do; doing | Signalwort always → simple present; he → does. | Er macht seine Hausaufgaben immer nach dem Mittagessen.
pres | My dog ___ a lot. | sleep | sleeps | sleep; is sleep | it (der Hund) → -s. | Mein Hund schläft viel.
pres | We ___ to the cinema on Fridays. | go | go | goes; going | Gewohnheit (on Fridays), we → ohne -s. | Wir gehen freitags ins Kino.
pres | Ben ___ maths very much. | not like | doesn't like | don't like; not likes | doesn't + Grundform (ohne -s!). | Ben mag Mathe nicht besonders.
prog | Look! It ___. | snow | is snowing | snows; snowing | Look! zeigt: genau jetzt → present progressive (am/is/are + -ing). | Schau! Es schneit.
prog | Be quiet, the baby ___. | sleep | is sleeping | sleeps; sleeping | Gerade jetzt → is + -ing. | Sei leise, das Baby schläft.
prog | We ___ a film at the moment. | watch | are watching | watch; is watching | at the moment → present progressive; we → are. | Wir schauen gerade einen Film.
prog | I ___ my homework right now. | do | am doing | do; doing | right now → am + -ing. | Ich mache gerade meine Hausaufgaben.
prog | What ___ you ___? – I'm reading. | do | are … doing | do … do; is … doing | Frage im progressive: are + Subjekt + -ing. | Was machst du gerade? – Ich lese.
prog | Listen! Someone ___ the piano. | play | is playing | plays; play | Listen! → es passiert gerade. | Hör mal! Jemand spielt Klavier.
can | ___ you help me, please? | can | Can | Do; Are | Bitte um Hilfe: Can you …? | Kannst du mir bitte helfen?
can | You ___ wear a helmet on your bike. It's the law. | must | must | can; may | Pflicht → must. | Du musst auf dem Fahrrad einen Helm tragen. Es ist Vorschrift.
can | My little brother ___ swim yet. | can | can't | mustn't; doesn't | Fähigkeit verneint → can't. | Mein kleiner Bruder kann noch nicht schwimmen.
can | You ___ use your phone in the exam. | must | mustn't | don't must; can | Verbot → mustn't (nicht: needn't!). | Du darfst dein Handy in der Prüfung nicht benutzen.
can | ___ I open the window? | may | May | Must; Do | Höfliche Erlaubnis-Frage: May I …? | Darf ich das Fenster öffnen?
quant | Have you got ___ brothers or sisters? | some/any | any | some; much | Fragen und Verneinung → any. | Hast du Geschwister?
quant | I'd like ___ water, please. | some/any | some | any; many | Bitte/Angebot → some. | Ich hätte gern etwas Wasser.
quant | How ___ money have you got? | much/many | much | many; lot | money ist nicht zählbar → much. | Wie viel Geld hast du?
quant | How ___ students are in your class? | much/many | many | much; lots | students sind zählbar → many. | Wie viele Schüler sind in deiner Klasse?
quant | There isn't ___ milk in the fridge. | some/any | any | some; many | Verneinung → any. | Es ist keine Milch im Kühlschrank.
past | Yesterday we ___ football in the park. | play | played | play; plays | yesterday → simple past, regelmäßig: -ed. | Gestern haben wir im Park Fußball gespielt.
past | Last summer I ___ to Scotland. | go | went | goed; gone | go ist unregelmäßig: go – went – gone. | Letzten Sommer bin ich nach Schottland gefahren.
past | She ___ a nice present for her mum. | buy | bought | buyed; buys | buy – bought – bought. | Sie hat ein schönes Geschenk für ihre Mutter gekauft.
past | We ___ to school yesterday because we were ill. | not go | didn't go | didn't went; not went | Verneinung: didn't + Grundform. | Wir sind gestern nicht zur Schule gegangen, weil wir krank waren.
past | ___ you see the match last night? | do | Did | Do; Have | Frage im simple past: Did + Grundform. | Hast du gestern Abend das Spiel gesehen?
past | The film ___ very funny. | be | was | were; is | it → was. | Der Film war sehr lustig.
past | My friends ___ at the party. | be | were | was; are | they → were. | Meine Freunde waren auf der Party.
past | Two years ago they ___ to London. | move | moved | move; moving | two years ago → simple past. | Vor zwei Jahren sind sie nach London gezogen.
past | I ___ a strange noise in the night. | hear | heard | heared; hear | hear – heard – heard. | Ich habe in der Nacht ein seltsames Geräusch gehört.
past | Tom ___ his phone on the bus. | leave | left | leaved; leaves | leave – left – left. | Tom hat sein Handy im Bus liegen lassen.
goingto | Look at the clouds! It ___ rain. | be going to | is going to | will be going to; goes to | Man sieht es schon kommen → going to. | Sieh dir die Wolken an! Es wird regnen.
goingto | We ___ visit our grandma next weekend. We've got the tickets. | be going to | are going to | is going to; going to | Fester Plan → going to. | Wir werden nächstes Wochenende unsere Oma besuchen. Wir haben die Fahrkarten.
goingto | What ___ you ___ do after school? | be going to | are … going to | do … going to; will … going to | Frage: are + Subjekt + going to. | Was hast du nach der Schule vor?
will | I think it ___ be sunny tomorrow. | will | will | is going; is | Vermutung (I think) → will. | Ich glaube, morgen wird es sonnig.
will | The phone is ringing. – I ___ answer it! | will | 'll | am going to; am | Spontane Entscheidung → will. | Das Telefon klingelt. – Ich geh ran!
will | In 2050 people ___ live on Mars. | not | won't | don't will; willn't | Verneinung von will: won't. | Im Jahr 2050 werden die Menschen nicht auf dem Mars leben.
perf | I ___ my homework. Can I go out now? | finish | have finished | finished; has finished | Ergebnis jetzt wichtig → present perfect: have + 3. Form. | Ich habe meine Hausaufgaben fertig. Darf ich jetzt raus?
perf | She ___ never ___ to America. | be | has … been | have … been; has … went | never + present perfect; she → has. | Sie war noch nie in Amerika.
perf | ___ you ever ___ sushi? | eat | Have … eaten | Did … eaten; Have … ate | ever-Frage → Have + 3. Form (eat – ate – eaten). | Hast du schon einmal Sushi gegessen?
perf | We ___ just ___ the new Harry Potter film. | see | have … seen | have … saw; has … seen | just + present perfect; see – saw – seen. | Wir haben gerade den neuen Film gesehen.
perf | He ___ his keys. He can't open the door. | lose | has lost | lost; have lost | Folge in der Gegenwart (kann nicht öffnen) → present perfect. | Er hat seine Schlüssel verloren. Er kann die Tür nicht öffnen.
comp | London is ___ than Bath. | big | bigger | more big; biggest | Kurzes Adjektiv: -er; Konsonant verdoppeln: big → bigger. | London ist größer als Bath.
comp | This is the ___ day of my life! | good | best | goodest; better | good – better – best. | Das ist der schönste Tag meines Lebens!
comp | Maths is ___ than English for me. | difficult | more difficult | difficulter; most difficult | Lange Adjektive: more. | Mathe ist für mich schwieriger als Englisch.
comp | My sister is as tall ___ me. | as | as | than; like | Gleichheit: as … as. | Meine Schwester ist so groß wie ich.
comp | The Shard is the ___ building in London. | tall | tallest | most tall; taller | Superlativ: the + -est. | The Shard ist das höchste Gebäude Londons.
comp | My cold is ___ today than yesterday. | bad | worse | badder; worst | bad – worse – worst. | Meine Erkältung ist heute schlimmer als gestern.
pastprog | I ___ TV when the phone rang. | watch | was watching | watched; were watching | Laufende Handlung (past progressive) wird unterbrochen (simple past). | Ich sah gerade fern, als das Telefon klingelte.
pastprog | What ___ you ___ at 8 o'clock last night? | do | were … doing | did … doing; was … doing | Was war gerade im Gange? → were + -ing. | Was hast du gestern um 8 Uhr gemacht?
pastprog | While we ___ in the park, it started to rain. | walk | were walking | walked; was walking | while + past progressive. | Während wir im Park spazieren gingen, fing es an zu regnen.
pastprog | She ___ when she cut her finger. | cook | was cooking | cooked; is cooking | Hintergrundhandlung → was + -ing. | Sie kochte gerade, als sie sich in den Finger schnitt.
perfpast | I ___ to Paris last year. | go | went | have gone; have been | Fester Zeitpunkt in der Vergangenheit (last year) → simple past. | Ich bin letztes Jahr nach Paris gefahren.
perfpast | I ___ to Paris three times. | be | have been | was; went | Erfahrung ohne Zeitpunkt → present perfect. | Ich war schon dreimal in Paris.
perfpast | We ___ here since 2020. | live | have lived | lived; live | since + Zeitpunkt bis jetzt → present perfect (im Deutschen Präsens!). | Wir wohnen seit 2020 hier.
perfpast | She ___ her leg when she was ten. | break | broke | has broken; breaks | when she was ten = abgeschlossene Zeit → simple past. | Sie hat sich das Bein gebrochen, als sie zehn war.
perfpast | I ___ him for five years. | know | have known | know; knew | for + Zeitraum bis jetzt → present perfect. | Ich kenne ihn seit fünf Jahren.
perfpast | When ___ you ___ your bike? | buy | did … buy | have … bought; did … bought | Frage mit when → simple past. | Wann hast du dein Fahrrad gekauft?
perfpast | ___ you finished your project yet? | have | Have | Did; Do | yet in Fragen → present perfect. | Bist du schon mit deinem Projekt fertig?
if1 | If it rains, we ___ at home. | stay | will stay | would stay; stayed | Typ I: if + simple present, Hauptsatz will. | Wenn es regnet, bleiben wir zu Hause.
if1 | If you ___ hard, you will pass the test. | study | study | will study; studied | Im if-Satz Typ I steht kein will. | Wenn du fleißig lernst, wirst du den Test bestehen.
if1 | I'll call you if I ___ time. | have | have | will have; had | if-Teil im simple present. | Ich rufe dich an, wenn ich Zeit habe.
if1 | If we miss the bus, we ___ late. | be | will be | are; would be | Folge in der Zukunft → will. | Wenn wir den Bus verpassen, kommen wir zu spät.
rel | The girl ___ lives next door is my friend. | who/which | who | which; whose | Personen → who. | Das Mädchen, das nebenan wohnt, ist meine Freundin.
rel | The book ___ I'm reading is great. | who/which | which | who; whose | Sachen → which (oder that). | Das Buch, das ich gerade lese, ist toll.
rel | That's the boy ___ dog bit me. | who/whose | whose | who; which | Besitz → whose. | Das ist der Junge, dessen Hund mich gebissen hat.
rel | London, ___ is the capital of the UK, has nine million people. | which/that | which | that; who | Nicht notwendiger Relativsatz (mit Kommas) → nie that. | London, das die Hauptstadt des Vereinigten Königreichs ist, hat neun Millionen Einwohner.
adv | She sings very ___. | beautiful | beautifully | beautiful; more beautiful | Wie singt sie? → Adverb (-ly). | Sie singt sehr schön.
adv | He is a ___ driver. | careful | careful | carefully; care | Nomen beschreiben → Adjektiv. | Er ist ein vorsichtiger Fahrer.
adv | Please drive ___. | careful | carefully | careful; caring | Verb beschreiben → Adverb. | Bitte fahr vorsichtig.
adv | You speak English very ___. | good | well | good; goodly | Adverb zu good ist well. | Du sprichst sehr gut Englisch.
adv | The test was ___ easy. | real | really | real; realy | Adjektiv verstärken → Adverb really. | Der Test war wirklich leicht.
if2 | If I ___ rich, I would buy a castle. | be | were | am; would be | Typ II: if + simple past (bei be oft were). | Wenn ich reich wäre, würde ich eine Burg kaufen.
if2 | If I had more time, I ___ more books. | read | would read | will read; read | Typ II Hauptsatz: would + Grundform. | Wenn ich mehr Zeit hätte, würde ich mehr Bücher lesen.
if2 | What would you do if you ___ the lottery? | win | won | win; would win | if-Teil im simple past. | Was würdest du tun, wenn du im Lotto gewinnen würdest?
if2 | She ___ come if she weren't ill. | will | would | will; can | Unwirklich → would. | Sie würde kommen, wenn sie nicht krank wäre.
pastperf | When we arrived, the film ___ already ___. | start | had … started | has … started; was … started | Vorvergangenheit: had + 3. Form. | Als wir ankamen, hatte der Film schon angefangen.
pastperf | She was tired because she ___ badly. | sleep | had slept | has slept; slept | Ursache liegt noch weiter zurück → past perfect. | Sie war müde, weil sie schlecht geschlafen hatte.
pastperf | After he ___ his homework, he went out. | finish | had finished | has finished; finishing | after + past perfect für das Frühere. | Nachdem er seine Hausaufgaben gemacht hatte, ging er hinaus.
passive | English ___ all over the world. | speak | is spoken | speaks; is speaking | Passiv: be + 3. Form (speak – spoke – spoken). | Englisch wird auf der ganzen Welt gesprochen.
passive | The Titanic ___ in Belfast. | build | was built | built; is built | Passiv simple past: was/were + 3. Form. | Die Titanic wurde in Belfast gebaut.
passive | The windows ___ every week. | clean | are cleaned | clean; is cleaned | Plural → are + 3. Form. | Die Fenster werden jede Woche geputzt.
passive | My bike ___ ! | steal | has been stolen | has stolen; is stealing | Passiv present perfect: has been + 3. Form. | Mein Fahrrad ist gestohlen worden!
passive | Harry Potter ___ by J. K. Rowling. | write | was written | wrote; is writing | Täter mit by. | Harry Potter wurde von J. K. Rowling geschrieben.
reported | Tom: "I am tired." – Tom said that he ___ tired. | be | was | is; were | Indirekte Rede mit Zeitverschiebung: am → was. | Tom sagte, dass er müde sei.
reported | Anna: "I like pizza." – Anna said she ___ pizza. | like | liked | likes; like | simple present → simple past. | Anna sagte, sie möge Pizza.
reported | "Close the door!" – The teacher told us ___ the door. | close | to close | close; closing | Aufforderung → told + Person + to. | Die Lehrerin forderte uns auf, die Tür zu schließen.
reported | "Where do you live?" – She asked me where I ___. | live | lived | do live; did live | Indirekte Frage: keine Umschreibung mit do. | Sie fragte mich, wo ich wohne.
reported | Ben: "I will call you." – Ben said he ___ call me. | will | would | will; shall | will → would. | Ben sagte, er werde mich anrufen.
perfprog | I ___ for you for an hour! | wait | have been waiting | am waiting; waited | Dauer bis jetzt → have been + -ing. | Ich warte seit einer Stunde auf dich!
perfprog | She ___ English since she was six. | learn | has been learning | is learning; learns | since + Dauer bis jetzt. | Sie lernt Englisch, seit sie sechs ist.
perfprog | Your eyes are red. ___ you been crying? | have | Have | Did; Are | Spuren in der Gegenwart → present perfect progressive. | Deine Augen sind rot. Hast du geweint?
if3 | If I had known, I ___ you. | help | would have helped | would help; had helped | Typ III: would have + 3. Form. | Wenn ich es gewusst hätte, hätte ich dir geholfen.
if3 | If we ___ earlier, we wouldn't have missed the train. | leave | had left | left; would have left | if-Teil Typ III: had + 3. Form. | Wenn wir früher losgegangen wären, hätten wir den Zug nicht verpasst.
if3 | She would have passed if she ___ harder. | study | had studied | studied; would study | Unwirkliche Vergangenheit → past perfect im if-Teil. | Sie hätte bestanden, wenn sie mehr gelernt hätte.
gerund | I enjoy ___ in the sea. | swim | swimming | to swim; swim | Nach enjoy → -ing. | Ich schwimme gern im Meer.
gerund | She decided ___ to university. | go | to go | going; go | Nach decide → to + Grundform. | Sie entschied sich, an die Uni zu gehen.
gerund | He is good at ___ jokes. | tell | telling | to tell; tell | Nach Präposition (at) → -ing. | Er kann gut Witze erzählen.
gerund | I'm looking forward to ___ you. | see | seeing | see; to see | look forward to + -ing (to ist hier Präposition!). | Ich freue mich darauf, dich zu sehen.
gerund | Do you want ___ with us? | come | to come | coming; come | want + to. | Willst du mit uns kommen?
gerund | Stop ___ so much noise! | make | making | to make; make | stop + -ing = aufhören, etwas zu tun. | Hör auf, so viel Lärm zu machen!
passive2 | The new bridge ___ next year. | open | will be opened | will open; is opening | Passiv Zukunft: will be + 3. Form. | Die neue Brücke wird nächstes Jahr eröffnet.
passive2 | The road ___ at the moment. | repair | is being repaired | is repaired; repairs | Passiv progressive: is being + 3. Form. | Die Straße wird gerade repariert.
passive2 | The letter had ___ before I arrived. | send | been sent | sent; be sent | Passiv past perfect: had been + 3. Form. | Der Brief war abgeschickt worden, bevor ich ankam.
passive2 | I ___ a new laptop for my birthday. | give | was given | gave; was give | Verben mit zwei Objekten: Person als Subjekt im Passiv. | Ich habe zum Geburtstag einen neuen Laptop bekommen.
future | The train ___ at 6.15 tomorrow morning. | leave | leaves | will leave; is leaving | Fahrplan → simple present mit Zukunftsbedeutung. | Der Zug fährt morgen früh um 6.15 Uhr ab.
future | I ___ my aunt on Saturday – it's all arranged. | visit | am visiting | visit; will visit | Feste Verabredung → present progressive. | Ich besuche am Samstag meine Tante – es ist alles abgemacht.
future | This time tomorrow I ___ on the beach. | lie | will be lying | will lie; am lying | Gerade im Verlauf in der Zukunft → future progressive. | Morgen um diese Zeit liege ich am Strand.
future | By 2030 I ___ school. | finish | will have finished | will finish; finish | Bis zu einem Zeitpunkt abgeschlossen → future perfect. | Bis 2030 werde ich die Schule abgeschlossen haben.
part | ___ the door, she saw a big dog. | open | Opening | Opened; To open | Gleichzeitige Handlung → present participle (-ing). | Als sie die Tür öffnete, sah sie einen großen Hund.
part | The boy ___ next to me is my cousin. | sit | sitting | sat; who sitting | Verkürzter Relativsatz (who is sitting) → -ing. | Der Junge, der neben mir sitzt, ist mein Cousin.
part | ___ in 1863, the Tube is the oldest underground in the world. | open | Opened | Opening; Having opening | Passivische Bedeutung → past participle. | 1863 eröffnet, ist die Tube die älteste U-Bahn der Welt.
part | ___ finished his work, he went home. | have | Having | Had; Has | Vorzeitigkeit → having + 3. Form. | Nachdem er seine Arbeit beendet hatte, ging er nach Hause.
'''

# Simple vs. Progressive (ersetzt Verb-Aspekt): pf = 1 → simple richtig, 0 → progressive richtig
ASPECTS = '''
I ___ tea every morning. | drink | drink; am drinking | 1 | every morning = Gewohnheit → simple present. | Ich trinke jeden Morgen Tee.
Shh! I ___ on the phone. | talk | talk; am talking | 0 | Genau jetzt → present progressive. | Psst! Ich telefoniere gerade.
Water ___ at 100 degrees. | boil | boils; is boiling | 1 | Allgemeine Tatsache → simple present. | Wasser kocht bei 100 Grad.
The water ___ – can you make the tea? | boil | boils; is boiling | 0 | Es passiert gerade → progressive. | Das Wasser kocht – kannst du den Tee machen?
She usually ___ to work by bike. | go | goes; is going | 1 | usually → simple present. | Sie fährt normalerweise mit dem Rad zur Arbeit.
This week she ___ by bus because her bike is broken. | go | goes; is going | 0 | Vorübergehend (this week) → progressive. | Diese Woche fährt sie mit dem Bus, weil ihr Rad kaputt ist.
I ___ what you mean. | understand | understand; am understanding | 1 | understand ist ein Zustandsverb → kein -ing. | Ich verstehe, was du meinst.
This cake ___ delicious! | taste | tastes; is tasting | 1 | taste (= schmecken nach) ist ein Zustand → simple. | Dieser Kuchen schmeckt köstlich!
Look, Dad ___ the cake to see if it's sweet enough. | taste | tastes; is tasting | 0 | taste als Handlung (probieren) → progressive möglich. | Schau, Papa probiert den Kuchen, ob er süß genug ist.
I ___ this song! | love | love; am loving | 1 | love/like/hate: Zustandsverben → simple. | Ich liebe dieses Lied!
We ___ dinner when the lights went out. | have | had; were having | 0 | Laufende Handlung wird unterbrochen → past progressive. | Wir aßen gerade zu Abend, als das Licht ausging.
He ___ the door, went in and sat down. | open | opened; was opening | 1 | Handlungskette → simple past. | Er öffnete die Tür, ging hinein und setzte sich.
They ___ a new house at the moment. | build | build; are building | 0 | at the moment → progressive. | Sie bauen gerade ein neues Haus.
My brother ___ three languages. | speak | speaks; is speaking | 1 | Fähigkeit/Tatsache → simple. | Mein Bruder spricht drei Sprachen.
Why ___ you ___ so loudly? I can't hear the TV! | speak | do … speak; are … speaking | 0 | Jetzt, ärgerlich → progressive. | Warum sprichst du so laut? Ich höre den Fernseher nicht!
This book ___ to my sister. | belong | belongs; is belonging | 1 | belong ist ein Zustandsverb. | Dieses Buch gehört meiner Schwester.
It ___ a lot in Manchester. | rain | rains; is raining | 1 | Allgemein, typisch → simple. | In Manchester regnet es viel.
Take an umbrella – it ___. | rain | rains; is raining | 0 | Jetzt gerade → progressive. | Nimm einen Schirm mit – es regnet.
'''


def one_gap(s, opts):
    """Zwei Lücken („___ you ___“) zu einer zusammenfassen: Antwort „are … doing“ → „are you doing“"""
    m = re.search(r'___ ((?:\S+ ){0,2}?\S+) ___', s)
    if not m: return s, opts
    mid = m.group(1)
    return s[:m.start()] + '___' + s[m.end():], [o.replace(' … ', ' ' + mid + ' ') for o in opts]


def cases():
    out = []
    for line in CASES.strip().split('\n'):
        g, s, base, a, wrong, why, tr = [x.strip() for x in line.split('|')]
        opts = [a] + [x.strip() for x in wrong.split(';')]
        s, opts = one_gap(s, opts); a = opts[0]
        name, k = TOPICS[g]
        out.append({'s': s, 'base': base, 'opts': opts, 'a': a, 'case': [name, name], 'why': [why, why], 'tr': [tr, tr], 'g': g, 'k': k})
    return out


def aspects():
    out = []
    for line in ASPECTS.strip().split('\n'):
        s, base, opts, pf, why, tr = [x.strip() for x in line.split('|')]
        o = [x.strip() for x in opts.split(';')]
        s, o = one_gap(s, o)
        a = o[0] if pf == '1' else o[1]
        out.append({'s': s, 'base': base, 'opts': o, 'a': a, 'pf': int(pf), 'why': [why, why], 'tr': [tr, tr]})
    return out

# Unregelmäßige Verben (ersetzt die polnische Konjugation): Grundform | 2. Form (simple past) | 3. Form (past participle) | deutsch
# Gruppe wird automatisch bestimmt: aaa (alle gleich), aba (1. = 3.), abb (2. = 3.), abc (alle verschieden)
VERBS = '''
be | was / were | been | sein
have | had | had | haben
do | did | done | tun, machen
go | went | gone | gehen, fahren
come | came | come | kommen
become | became | become | werden
run | ran | run | rennen
see | saw | seen | sehen
say | said | said | sagen
tell | told | told | erzählen, sagen
speak | spoke | spoken | sprechen
get | got | got | bekommen, werden
give | gave | given | geben
take | took | taken | nehmen
make | made | made | machen, herstellen
know | knew | known | wissen, kennen
think | thought | thought | denken, glauben
find | found | found | finden
buy | bought | bought | kaufen
bring | brought | brought | bringen
teach | taught | taught | unterrichten
catch | caught | caught | fangen
eat | ate | eaten | essen
drink | drank | drunk | trinken
write | wrote | written | schreiben
read | read | read | lesen
put | put | put | legen, stellen
cut | cut | cut | schneiden
let | let | let | lassen
hit | hit | hit | schlagen, treffen
cost | cost | cost | kosten
hurt | hurt | hurt | verletzen, wehtun
begin | began | begun | beginnen
swim | swam | swum | schwimmen
sing | sang | sung | singen
ring | rang | rung | klingeln, anrufen
sit | sat | sat | sitzen
stand | stood | stood | stehen
understand | understood | understood | verstehen
sleep | slept | slept | schlafen
feel | felt | felt | fühlen
keep | kept | kept | behalten
leave | left | left | verlassen, abfahren
meet | met | met | treffen
pay | paid | paid | bezahlen
send | sent | sent | schicken
spend | spent | spent | ausgeben, verbringen
lose | lost | lost | verlieren
win | won | won | gewinnen
sell | sold | sold | verkaufen
hear | heard | heard | hören
hold | held | held | halten
build | built | built | bauen
lend | lent | lent | (ver)leihen
fly | flew | flown | fliegen
drive | drove | driven | fahren (Auto)
ride | rode | ridden | reiten, (Rad) fahren
wear | wore | worn | tragen (Kleidung)
break | broke | broken | (zer)brechen
choose | chose | chosen | wählen
forget | forgot | forgotten | vergessen
fall | fell | fallen | fallen
grow | grew | grown | wachsen
throw | threw | thrown | werfen
draw | drew | drawn | zeichnen
show | showed | shown | zeigen
steal | stole | stolen | stehlen
wake | woke | woken | aufwachen
hide | hid | hidden | verstecken
bite | bit | bitten | beißen
shut | shut | shut | schließen
'''


def verbs():
    out = []
    for line in VERBS.strip().split('\n'):
        inf, past, pp, de = [x.strip() for x in line.split('|')]
        p0 = past.split(' / ')[0]
        cls = 'aaa' if inf == p0 == pp else ('aba' if inf == pp else ('abb' if p0 == pp else 'abc'))
        out.append({'inf': inf, 'de': de, 'en': de, 'cls': cls, 'past': past, 'pp': pp})
    return out
