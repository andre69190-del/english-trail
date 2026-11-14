# English Trail – Oberstufe (14.11.2026, Version 0.38, AUTOPLAN 15)
# Klasse 11 = Einführungsphase / Kursstufe 1, Klasse 12 und 13 = Qualifikationsphase.
# Themen nach den gemeinsamen Abitur-Schwerpunkten der Länder (Globalisierung, Medien, Umwelt, USA, Literatur/Film,
# Textaufgaben Analyse/Kommentar). Eigene Texte – keine Verlagsinhalte. IDs nur anhängen, nie ändern.
# Gleiches Format wie school.K(...): grade, ico, name, title, can, tip, fact, words (16), sentences (6), scene (3 Schritte).

OB_PACKS = []


def K(**k):
    OB_PACKS.append(k)


K(id='s11glo', grade=11, ico='🌐', name='Global village', title='Globalisierung',
  can='Ich kann Chancen und Risiken der Globalisierung beschreiben und abwägen.',
  tip='Abwägen: „On the one hand …, on the other hand …“, „Whereas …“, „Admittedly, … However, …“. Ursachen und Folgen: „This leads to …“, „As a result, …“',
  fact='Ein typisches Smartphone enthält Teile aus mehr als 30 Ländern – vom Rohstoff in Afrika bis zur Montage in Asien.',
  words="""globalisation | Globalisierung
supply chain | Lieferkette
to outsource | auslagern
developing country | Entwicklungsland
multinational company | internationaler Konzern
fair trade | fairer Handel
working conditions | Arbeitsbedingungen
wage | Lohn
to benefit from | profitieren von
inequality | Ungleichheit
to compete | konkurrieren
consumer | Verbraucher(in)
cultural diversity | kulturelle Vielfalt
to exploit | ausbeuten
economic growth | Wirtschaftswachstum
interdependence | gegenseitige Abhängigkeit""",
  sentences=[('On the one hand, globalisation has created millions of jobs.', 'Einerseits hat die Globalisierung Millionen Arbeitsplätze geschaffen.'),
             ('On the other hand, many workers still earn very low wages.', 'Andererseits verdienen viele Arbeiter immer noch sehr niedrige Löhne.'),
             ('Many companies outsource production to save costs.', 'Viele Firmen lagern die Produktion aus, um Kosten zu sparen.'),
             ('Consumers can make a difference by buying fair trade products.', 'Verbraucher können etwas bewirken, indem sie fair gehandelte Produkte kaufen.'),
             ('As a result of global supply chains, a crisis in one country affects the whole world.', 'Wegen globaler Lieferketten trifft eine Krise in einem Land die ganze Welt.'),
             ('Whereas some countries benefit from free trade, others fall behind.', 'Während manche Länder vom Freihandel profitieren, fallen andere zurück.')],
  scene=dict(intro='Model United Nations in London: Du vertrittst Deutschland im Ausschuss für Welthandel. Die Delegierte aus Kenia spricht dich an.',
             steps=[dict(npc=('Do you think globalisation has been good for countries like mine?', 'Glaubst du, die Globalisierung war gut für Länder wie meins?'),
                         opts=[('Admittedly, it has brought jobs. However, the profits are not shared fairly.', 'Zugegeben, sie hat Arbeit gebracht. Allerdings werden die Gewinne nicht fair verteilt.', 1), ('Yes, it is good. Everybody is rich now.', 'Ja, sie ist gut. Jetzt sind alle reich.', 0)],
                         hint='Abwägen: „Admittedly, … However, …“'),
                    dict(npc=('So what should rich countries do about it?', 'Und was sollten reiche Länder dagegen tun?'),
                         opts=[('They should make companies responsible for working conditions along the whole supply chain.', 'Sie sollten Firmen für die Arbeitsbedingungen in der ganzen Lieferkette verantwortlich machen.', 1), ('They should do nothing, because it is not our problem.', 'Gar nichts, weil es nicht unser Problem ist.', 0)],
                         hint='Konkreter Vorschlag mit „should“.'),
                    dict(npc=("That's exactly what our resolution says. Will Germany support it?", 'Genau das steht in unserer Resolution. Unterstützt Deutschland sie?'),
                         opts=[('We will, provided that small businesses get enough time to adapt.', 'Ja – vorausgesetzt, kleine Firmen bekommen genug Zeit, sich anzupassen.', 1), ('We will support it if it will be good.', 'Wir unterstützen es, wenn es gut sein wird.', 0)],
                         hint='Bedingung: „provided that“ + present (kein will im Nebensatz).')],
             outro='Die Resolution wird mit großer Mehrheit angenommen. Die Delegierte aus Kenia lädt dich zum Abschlussempfang ein.'))

K(id='s11med', grade=11, ico='📱', name='Media and truth', title='Medien und Falschmeldungen',
  can='Ich kann über Medien, Fake News und soziale Netzwerke sprechen und Quellen kritisch prüfen.',
  tip='Quellen prüfen: „According to …“, „The article claims that …“, „There is no evidence that …“. Distanz zeigen: „allegedly“, „it is said that …“',
  fact='Studien zeigen: Falschmeldungen verbreiten sich in sozialen Netzwerken oft schneller als richtige Nachrichten – vor allem, wenn sie starke Gefühle auslösen.',
  words="""fake news | Falschmeldungen
source | Quelle
reliable | zuverlässig
to fact-check | Fakten überprüfen
headline | Schlagzeile
bias | Voreingenommenheit / Einseitigkeit
algorithm | Algorithmus
filter bubble | Filterblase
to go viral | sich rasend schnell verbreiten
influencer | Influencer(in)
freedom of the press | Pressefreiheit
to manipulate | manipulieren
evidence | Beweis(e) / Belege
allegedly | angeblich
to mislead | in die Irre führen
media literacy | Medienkompetenz""",
  sentences=[('According to the article, the photo was taken in 2015, not last week.', 'Laut dem Artikel wurde das Foto 2015 aufgenommen, nicht letzte Woche.'),
             ('Before you share a post, you should check where it comes from.', 'Bevor du einen Beitrag teilst, solltest du prüfen, woher er kommt.'),
             ('Algorithms show us what we already like, so we end up in a filter bubble.', 'Algorithmen zeigen uns, was wir schon mögen – so landen wir in einer Filterblase.'),
             ('The headline is misleading because it leaves out important facts.', 'Die Schlagzeile ist irreführend, weil sie wichtige Fakten weglässt.'),
             ('There is no evidence that the video is real.', 'Es gibt keinen Beleg dafür, dass das Video echt ist.'),
             ('Freedom of the press is essential for a democracy.', 'Pressefreiheit ist für eine Demokratie unverzichtbar.')],
  scene=dict(intro='In der Schülerzeitung eurer Partnerschule in Bristol plant ihr einen Artikel. Redakteur Sam zeigt dir ein Video, das gerade viral geht.',
             steps=[dict(npc=('Look, this video already has two million views. Shall we write about it?', 'Schau, das Video hat schon zwei Millionen Aufrufe. Sollen wir darüber schreiben?'),
                         opts=[("Let's fact-check it first. Who posted it, and is the source reliable?", 'Lass es uns erst prüfen. Wer hat es gepostet, und ist die Quelle zuverlässig?', 1), ("Two million people can't be wrong, so it must be true.", 'Zwei Millionen Menschen können nicht irren, also stimmt es.', 0)],
                         hint='Erst Quelle prüfen – dann schreiben.'),
                    dict(npc=('Hm, a reverse image search shows the same clip from 2019.', 'Hm, die Bildersuche zeigt denselben Clip aus dem Jahr 2019.'),
                         opts=[("So it's misleading. It is said to show last week's protest, but it doesn't.", 'Dann ist es irreführend. Angeblich zeigt es den Protest von letzter Woche, tut es aber nicht.', 1), ("So it's a new video from 2019.", 'Dann ist es ein neues Video von 2019.', 0)],
                         hint='Distanz zeigen: „It is said to …“'),
                    dict(npc=('Great find! What could our article be about instead?', 'Super Fund! Worüber könnte unser Artikel stattdessen gehen?'),
                         opts=[('How to spot fake news – with this video as an example.', 'Wie man Falschmeldungen erkennt – mit diesem Video als Beispiel.', 1), ("Let's just share the video anyway.", 'Lass uns das Video trotzdem teilen.', 0)],
                         hint='Medienkompetenz zeigen.')],
             outro='Euer Artikel „Don’t believe everything you see“ wird der meistgelesene der Ausgabe.'))

K(id='s11env', grade=11, ico='🌱', name='A sustainable future', title='Klima und Nachhaltigkeit',
  can='Ich kann über Klimawandel und Nachhaltigkeit diskutieren und Lösungen vorschlagen.',
  tip='Lösungen vorschlagen: „One way to tackle this would be to …“, „Unless we …, …“, „It is high time we …“ (+ simple past).',
  fact='Großbritannien hat 2024 sein letztes Kohlekraftwerk abgeschaltet – als erstes Land der G7.',
  words="""climate change | Klimawandel
greenhouse gas | Treibhausgas
emissions | Emissionen / Ausstoß
renewable energy | erneuerbare Energie
fossil fuels | fossile Brennstoffe
sustainable | nachhaltig
carbon footprint | CO₂-Fußabdruck
to reduce | verringern
drought | Dürre
flood | Überschwemmung
to tackle | angehen / bekämpfen
biodiversity | Artenvielfalt
consumption | Verbrauch / Konsum
to raise awareness | Bewusstsein schaffen
policy | Politik / Maßnahme
generation | Generation""",
  sentences=[('It is high time we reduced our greenhouse gas emissions.', 'Es ist höchste Zeit, dass wir unseren Ausstoß an Treibhausgasen verringern.'),
             ('Unless we act now, droughts and floods will become more common.', 'Wenn wir nicht jetzt handeln, werden Dürren und Überschwemmungen häufiger.'),
             ('One way to tackle the problem would be to invest in renewable energy.', 'Eine Möglichkeit, das Problem anzugehen, wäre, in erneuerbare Energie zu investieren.'),
             ('Our consumption has a huge impact on our carbon footprint.', 'Unser Konsum hat großen Einfluss auf unseren CO₂-Fußabdruck.'),
             ('Young people have raised awareness of the climate crisis all over the world.', 'Junge Menschen haben auf der ganzen Welt Bewusstsein für die Klimakrise geschaffen.'),
             ('Protecting biodiversity is just as important as cutting emissions.', 'Die Artenvielfalt zu schützen ist genauso wichtig, wie Emissionen zu senken.')],
  scene=dict(intro='Ein Podcast aus Manchester sucht Stimmen junger Europäer. Moderatorin Priya interviewt dich live.',
             steps=[dict(npc=("Many people say one person can't change anything. What do you think?", 'Viele sagen, ein einzelner Mensch kann nichts ändern. Was meinst du?'),
                         opts=[('I disagree. Individual choices add up, and they put pressure on politicians.', 'Das sehe ich anders. Einzelne Entscheidungen summieren sich und setzen Politiker unter Druck.', 1), ('I agree. Nothing matters, so I do what I want.', 'Stimmt. Nichts zählt, also mache ich, was ich will.', 0)],
                         hint='Widersprechen + begründen.'),
                    dict(npc=('What should governments do first?', 'Was sollten Regierungen als Erstes tun?'),
                         opts=[('One way to tackle the problem would be to stop subsidising fossil fuels.', 'Ein Ansatz wäre, fossile Brennstoffe nicht mehr zu subventionieren.', 1), ('They should to stop fossil fuels yesterday.', 'Sie sollten zu stoppen fossile Brennstoffe gestern.', 0)],
                         hint='„One way to … would be to …“ – nach should kein „to“.'),
                    dict(npc=('And your final message to our listeners?', 'Und deine letzte Botschaft an unsere Zuhörer?'),
                         opts=[("It's high time we acted – for our generation and the next.", 'Es ist höchste Zeit, dass wir handeln – für unsere Generation und die nächste.', 1), ("It's high time we act yesterday.", 'Es ist höchste Zeit, dass wir gestern handeln.', 0)],
                         hint='„It’s high time“ + simple past.')],
             outro='Priya bedankt sich: „Brilliant answers!“ Die Folge wird in mehreren Schulen in England im Unterricht gehört.'))

K(id='s12usa', grade=12, ico='🗽', name='The American Dream', title='Der amerikanische Traum',
  can='Ich kann über den American Dream, Einwanderung und gesellschaftliche Spaltung in den USA sprechen.',
  tip='Ideal und Wirklichkeit gegenüberstellen: „In theory …, in practice …“, „Despite …“, „Even though …“. Geschichte: „The Declaration of Independence states that …“',
  fact='Die Unabhängigkeitserklärung von 1776 nennt „Life, Liberty and the pursuit of Happiness“ als Grundrechte – die Grundlage des American Dream.',
  words="""the American Dream | der amerikanische Traum
opportunity | Chance / Gelegenheit
immigrant | Einwanderer / Einwanderin
melting pot | Schmelztiegel
equal opportunities | Chancengleichheit
upward mobility | sozialer Aufstieg
the pursuit of happiness | das Streben nach Glück
self-made | aus eigener Kraft erfolgreich
civil rights | Bürgerrechte
segregation | Rassentrennung
discrimination | Diskriminierung
the middle class | die Mittelschicht
divided | gespalten
to achieve | erreichen
the Constitution | die Verfassung
debt | Schulden""",
  sentences=[('In theory, everyone can succeed in America if they work hard.', 'Theoretisch kann in Amerika jeder Erfolg haben, wenn er hart arbeitet.'),
             ('In practice, your chances often depend on where you were born.', 'In der Praxis hängen deine Chancen oft davon ab, wo du geboren wurdest.'),
             ('Millions of immigrants came to the USA in search of a better life.', 'Millionen Einwanderer kamen auf der Suche nach einem besseren Leben in die USA.'),
             ('The civil rights movement fought against segregation and discrimination.', 'Die Bürgerrechtsbewegung kämpfte gegen Rassentrennung und Diskriminierung.'),
             ('Despite huge student debt, many young Americans still believe in the dream.', 'Trotz hoher Studienschulden glauben viele junge Amerikaner noch an den Traum.'),
             ('Many people feel that the country has never been so divided.', 'Viele Menschen haben das Gefühl, dass das Land noch nie so gespalten war.')],
  scene=dict(intro='Austauschjahr in Ohio: Im Fach „American Government“ fragt dich Ms Rodriguez, wie Europäer auf die USA blicken.',
             steps=[dict(npc=('Do people in Germany still believe in the American Dream?', 'Glauben die Menschen in Deutschland noch an den amerikanischen Traum?'),
                         opts=[('Some do. But many see that, in practice, it is harder to achieve than in theory.', 'Manche schon. Aber viele sehen, dass er in der Praxis schwerer zu erreichen ist als in der Theorie.', 1), ('Germans have no dreams.', 'Deutsche haben keine Träume.', 0)],
                         hint='Ideal und Wirklichkeit: „in theory … in practice …“'),
                    dict(npc=('My grandparents came here from Mexico with nothing. Now my mom is a doctor.', 'Meine Großeltern kamen mit nichts aus Mexiko. Heute ist meine Mutter Ärztin.'),
                         opts=[("That's a great example of upward mobility. Your family must be proud.", 'Ein tolles Beispiel für sozialen Aufstieg. Deine Familie ist sicher stolz.', 1), ("That's a example for upward mobility.", 'Das ist ein Beispiel für Aufstieg (fehlerhaft).', 0)],
                         hint='„an example of“ – vor Vokal an, Präposition of.'),
                    dict(npc=('So is the dream real or a myth?', 'Ist der Traum also echt oder ein Mythos?'),
                         opts=[("Even though it isn't true for everyone, it still gives people hope.", 'Auch wenn er nicht für alle wahr ist, gibt er den Menschen immer noch Hoffnung.', 1), ('Although it is a myth, but it is real.', 'Obwohl es ein Mythos ist, aber es ist echt.', 0)],
                         hint='„Even though / Although“ – ohne zusätzliches „but“.')],
             outro='Ms Rodriguez nickt: „A balanced answer – that’s what I want to see in your essays.“'))

K(id='s12lit', grade=12, ico='🎭', name='Analysing fiction and film', title='Literatur und Film analysieren',
  can='Ich kann Fachbegriffe zur Analyse von Erzähltexten, Dramen und Filmen verwenden.',
  tip='Analyse im simple present: „The author uses … in order to …“, „This creates a sense of …“, „The close-up emphasises …“. Zitate belegen: „(l. 12)“',
  fact='Shakespeare hat der englischen Sprache Hunderte Ausdrücke geschenkt, die man heute noch benutzt – zum Beispiel „break the ice“ oder „wild-goose chase“.',
  words="""narrator | Erzähler(in)
first-person narrator | Ich-Erzähler(in)
point of view | Erzählperspektive
protagonist | Hauptfigur
character | Figur
setting | Schauplatz
plot | Handlung
climax | Höhepunkt
stylistic device | Stilmittel
metaphor | Metapher
irony | Ironie
tone | Ton / Stimmung
to foreshadow | vorausdeuten
stage directions | Regieanweisungen
close-up | Nahaufnahme
camera angle | Kameraperspektive""",
  sentences=[('The story is told by a first-person narrator, so we only know what she thinks.', 'Die Geschichte wird von einer Ich-Erzählerin erzählt, also wissen wir nur, was sie denkt.'),
             ('The author uses a metaphor in order to show how lonely the protagonist feels.', 'Die Autorin benutzt eine Metapher, um zu zeigen, wie einsam sich die Hauptfigur fühlt.'),
             ('The dark setting creates a sense of danger.', 'Der düstere Schauplatz erzeugt ein Gefühl von Gefahr.'),
             ('The close-up emphasises the fear in his eyes.', 'Die Nahaufnahme betont die Angst in seinen Augen.'),
             ('The first scene foreshadows the tragic ending.', 'Die erste Szene deutet das tragische Ende voraus.'),
             ('The tone of the poem changes from hopeful to bitter.', 'Der Ton des Gedichts wechselt von hoffnungsvoll zu bitter.')],
  scene=dict(intro='Filmclub an deiner Austauschschule in Dublin. Nach dem Film fragt Clubleiter Mr Byrne nach deiner Analyse.',
             steps=[dict(npc=('Why do you think the director uses so many close-ups in the last scene?', 'Warum benutzt der Regisseur in der letzten Szene so viele Nahaufnahmen?'),
                         opts=[('The close-ups emphasise her emotions, so the audience feels her despair.', 'Die Nahaufnahmen betonen ihre Gefühle, sodass das Publikum ihre Verzweiflung spürt.', 1), ('Because the camera was close.', 'Weil die Kamera nah war.', 0)],
                         hint='Wirkung erklären: Stilmittel + Funktion.'),
                    dict(npc=('And what about the rain in the opening scene?', 'Und der Regen in der Anfangsszene?'),
                         opts=[('It foreshadows the tragic ending and creates a gloomy atmosphere.', 'Er deutet das tragische Ende an und schafft eine düstere Atmosphäre.', 1), ('It was raining in the opening scene.', 'In der Anfangsszene hat es geregnet.', 0)],
                         hint='Nicht nacherzählen – deuten (foreshadow, create).'),
                    dict(npc=('Good. How would you start an analysis of this film in an exam?', 'Gut. Wie würdest du eine Analyse des Films in einer Klausur beginnen?'),
                         opts=[("In the film's final scene, the director uses camera work in order to show the protagonist's isolation.", 'In der Schlussszene setzt der Regisseur die Kameraführung ein, um die Isolation der Hauptfigur zu zeigen.', 1), ('In the film, she was sad and then the film ended.', 'Im Film war sie traurig und dann war der Film vorbei.', 0)],
                         hint='Einleitung: Was – wie – wozu (in order to).')],
             outro='Mr Byrne: „That’s an A-level answer!“ Er lädt dich ein, nächste Woche den Film auszuwählen.'))

K(id='s12wri', grade=12, ico='🖋️', name='Writing: analysis and comment', title='Abi-Training: Analyse und Kommentar',
  can='Ich kann eine Textaufgabe gliedern und Redemittel für Zusammenfassung, Analyse, Kommentar und Sprachmittlung verwenden.',
  tip='Summary: simple present, keine Zitate, keine Meinung. Analysis: Belege mit Zeilenangabe. Comment: Einleitung – Argumente mit Beispielen – Fazit („All in all …“). Mediation: nur das Gefragte, adressatengerecht.',
  fact='In den meisten Ländern besteht die Abitur-Textaufgabe aus drei Teilen: Comprehension (Zusammenfassen), Analysis (Untersuchen) und Evaluation/Comment (Stellung nehmen) – oft mit Sprachmittlung.',
  words="""to summarise | zusammenfassen
main idea | Hauptgedanke
to point out | darauf hinweisen
to claim | behaupten
to illustrate | veranschaulichen
to emphasise | betonen
quotation | Zitat
line | Zeile
to analyse | analysieren
to evaluate | bewerten / beurteilen
argument | Argument
counter-argument | Gegenargument
furthermore | außerdem / darüber hinaus
nevertheless | trotzdem / dennoch
all in all | alles in allem
target audience | Zielgruppe""",
  sentences=[('The article, published in The Guardian in 2025, deals with the impact of AI on schools.', 'Der Artikel, 2025 im Guardian erschienen, behandelt die Auswirkungen von KI auf Schulen.'),
             ('The author points out that teachers will still be needed.', 'Der Autor weist darauf hin, dass Lehrkräfte weiterhin gebraucht werden.'),
             ('She illustrates her claim with an example from her own class (ll. 12–15).', 'Sie veranschaulicht ihre Behauptung mit einem Beispiel aus ihrer eigenen Klasse (Z. 12–15).'),
             ('Furthermore, the rhetorical question in line 20 makes the reader think.', 'Außerdem bringt die rhetorische Frage in Zeile 20 den Leser zum Nachdenken.'),
             ('Nevertheless, there are strong counter-arguments.', 'Dennoch gibt es starke Gegenargumente.'),
             ('All in all, I agree with the author, as long as AI is used responsibly.', 'Alles in allem stimme ich der Autorin zu – solange KI verantwortungsvoll genutzt wird.')],
  scene=dict(intro='Abi-Vorbereitung: Deine Tutorin Mrs Clarke aus Cambridge gibt dir per Videocall Rückmeldung zu deiner Probe-Klausur.',
             steps=[dict(npc=('Your summary contains your own opinion. What is wrong with that?', 'Deine Zusammenfassung enthält deine eigene Meinung. Was ist daran falsch?'),
                         opts=[('A summary should only present the main ideas of the text, without comments.', 'Eine Zusammenfassung soll nur die Hauptgedanken des Textes wiedergeben, ohne Kommentar.', 1), ('A summary should be as long as possible.', 'Eine Zusammenfassung soll möglichst lang sein.', 0)],
                         hint='Summary: neutral, simple present, nur Hauptgedanken.'),
                    dict(npc=('In your analysis, how do you prove what you say?', 'Wie belegst du in deiner Analyse, was du sagst?'),
                         opts=[('I refer to the text and give the line, for example „(l. 20)“.', 'Ich beziehe mich auf den Text und nenne die Zeile, zum Beispiel „(Z. 20)“.', 1), ('I just say that it is true.', 'Ich sage einfach, dass es stimmt.', 0)],
                         hint='Belege mit Zeilenangabe.'),
                    dict(npc=('Last question: how should your comment end?', 'Letzte Frage: Wie sollte dein Kommentar enden?'),
                         opts=[('With a clear conclusion, for example: „All in all, the advantages outweigh the disadvantages.“', 'Mit einem klaren Fazit, zum Beispiel: „Alles in allem überwiegen die Vorteile.“', 1), ('With a new argument that I forgot before.', 'Mit einem neuen Argument, das ich vorher vergessen habe.', 0)],
                         hint='Fazit, kein neues Argument.')],
             outro='Mrs Clarke: „You’re well prepared. Good luck with your exams!“'))

EMOJI = {
  's11glo': ['🌐', '🔗', '📤', '🌍', '🏢', '🤝', '🏭', '💵', '📈', '⚖️', '🏁', '🛒', '🎎', '⛓️', '📊', '🔄'],
  's11med': ['📰', '🔍', '✅', '🕵️', '🗞️', '↔️', '🤖', '🫧', '🚀', '🤳', '🗽', '🎭', '📎', '❔', '🧭', '🧠'],
  's11env': ['🌡️', '☁️', '🏭', '☀️', '⛽', '♻️', '👣', '⬇️', '🏜️', '🌊', '🛠️', '🦋', '🛍️', '📣', '📜', '👨‍👩‍👧'],
}
