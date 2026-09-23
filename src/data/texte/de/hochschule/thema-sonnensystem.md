# Das Sonnensystem

Das Sonnensystem ist die Sonne mitsamt allem, was ihre Schwerkraft bindet: acht große Planeten,
fünf anerkannte Zwergplaneten, mindestens 461 bekannte Monde, zwei Gürtel aus Kleinkörpern und,
jenseits davon, eine bislang nur indirekt erschlossene Wolke aus Kometenkernen. Dieser Text
beschreibt seine Architektur auf Fachniveau: wie sich Masse und Bahndrehimpuls auf Sonne und
Planeten verteilen, welche Ebene tatsächlich unbewegt im Raum steht, wie die Körperklassen
entstanden und benannt sind, und wie alt und wie stabil das System ist. Die acht Planeten und
die fünf Zwergplaneten haben eigene Texte, erreichbar über ihre Namen von
[Merkur](objekt:mercury) bis [Neptun](objekt:neptune), dazu [Ceres](objekt:ceres),
[Pluto](objekt:pluto) und die übrigen; vertieft behandeln eigene Fachthemen die Bahnelemente
selbst ([Bahnelemente](thema:bahnelemente)), Bezugssysteme und Zeitskalen
([Bezugssysteme](thema:bezugssysteme)), die Entstehung aus der protoplanetaren Scheibe
([Entstehung des Sonnensystems](thema:entstehung)), Bahnresonanzen
([Bahnresonanzen](thema:resonanzen)), Gezeiten und die Roche-Grenze ([Gezeiten](thema:gezeiten)),
den inneren Aufbau der Körper ([Innerer Aufbau](thema:innerer-aufbau)) sowie Albedo und
Helligkeit ([Photometrie](thema:photometrie)); was Orrery davon zeigt und wo es vereinfacht,
steht gesammelt unter [Grenzen des Modells](thema:modell).

## Architektur: Masse und Bahndrehimpuls

Sonne und acht Planeten vereinen praktisch die gesamte Masse des Systems auf sich; Zwergplaneten,
Monde, Ringe und die beiden Gürtel tragen zusammen weniger als ein Millionstel davon bei. Aus den
Katalogmassen und großen Halbachsen (`src/data/bodies/`) ergibt sich:

| Körper | Masse (kg) | $a$ (AE) | Anteil an der Masse | Anteil am Drehimpuls |
|---|---:|---:|---:|---:|
| Sonne | $1{,}9885 \cdot 10^{30}$ | – | 99,866 % | 0,609 % |
| Merkur | $3{,}3010 \cdot 10^{23}$ | 0,387 | 0,0000166 % | 0,00284 % |
| Venus | $4{,}8673 \cdot 10^{24}$ | 0,723 | 0,000244 % | 0,0585 % |
| Erde | $5{,}9722 \cdot 10^{24}$ | 1,000 | 0,000300 % | 0,0844 % |
| Mars | $6{,}4169 \cdot 10^{23}$ | 1,524 | 0,0000322 % | 0,0112 % |
| Jupiter | $1{,}89813 \cdot 10^{27}$ | 5,203 | 0,0953 % | 61,1 % |
| Saturn | $5{,}6832 \cdot 10^{26}$ | 9,537 | 0,0285 % | 24,8 % |
| Uranus | $8{,}6811 \cdot 10^{25}$ | 19,189 | 0,00436 % | 5,37 % |
| Neptun | $1{,}02409 \cdot 10^{26}$ | 30,070 | 0,00514 % | 7,94 % |

Die Massenanteile beziehen sich auf die Summe aus Sonnenmasse und den acht Planetenmassen: Die
Planeten zusammen bringen es auf 0,134 % dieser Summe, die Sonne auf 99,866 % — nahe am
Rundwert 99,86 %, den schon die Gymnasialstufe nennt. Der Bahndrehimpuls je Planet folgt aus der
Zweikörperformel

$$L = M\,\sqrt{GM_\odot\,a\,\left(1-e^2\right)}$$

mit der Exzentrizität $e$ des Datensatzes zur Epoche J2000 und
$GM_\odot = 1{,}327 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, selbst aus der Sonnenmasse und
$G = 6{,}674 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ gerechnet (Rechenweg
in der Belegliste). Das Ergebnis ist das eigentliche Drehimpulsproblem der
Sonnensystementstehung: Obwohl die Sonne praktisch die gesamte Masse trägt, liegt praktisch ihr
gesamter Bahndrehimpuls bei den Planeten ([Ray 2012](literatur:ray-2012)), mit Jupiter und
Saturn allein für 85,9 % (eigene Rechnung). Die Eigenrotation der Sonne trägt dazu nur
$1{,}92 \cdot 10^{41}\,\mathrm{kg}\,\mathrm{m}^2\,\mathrm{s}^{-1}$ bei, ein aus Helioseismologie
gemessener Wert ([Iorio 2012](literatur:iorio-2012)); eine naive Abschätzung mit einer
gleichmäßigen Vollkugel,

$$L_{\mathrm{naiv}} = \frac{2}{5}\,M_\odot\,R_\odot^2\,\omega_\odot,$$

mit der Sonnenmasse, dem Sonnenradius und $\omega_\odot$ aus der im Datensatz hinterlegten
Rotationsperiode von 609,12 h bei 16° heliografischer Breite, ergäbe
$1{,}10 \cdot 10^{42}\,\mathrm{kg}\,\mathrm{m}^2\,\mathrm{s}^{-1}$ — das 5,7-Fache des gemessenen
Werts (eigene Nachrechnung). Der Unterschied zeigt, wie stark die Sonnenmasse zur Mitte hin
konzentriert ist: Eine gleichmäßige Kugel hätte den Trägheitsmomentfaktor $I/MR^2 = 2/5$, aus dem
gemessenen Drehimpuls folgt für die Sonne dagegen nur rund 0,07 — deutlich unter dem Wert einer
homogenen Kugel, wie es zu einem nach innen dichter werdenden Stern passt.

## Invariable Ebene und Schwerpunkt

Weder die Ekliptik noch der Sonnenäquator stehen im Raum fest; beide präzedieren gegeneinander.
Fest liegt dagegen die invariable Ebene, senkrecht zum Gesamtdrehimpuls des Systems und durch
dessen Schwerpunkt gelegt: Unter Einschluss der acht Planeten, Plutos, Ceres' sowie der beiden
größten Asteroiden Vesta und Pallas liegt sie um 1,58° gegen die Ekliptik und das Äquinoktium
J2000 geneigt ([Bezugssysteme](thema:bezugssysteme)), mit aufsteigendem Knoten bei ekliptikaler
Länge 107,6° — eine Bestimmung auf unter eine Millibogensekunde genau, bei der die
Zwergplaneten Ceres und Pluto den Autoren zufolge unverzichtbar sind
([Souami und Souchay 2012](literatur:souami-2012)).

Die Sonne selbst ruht nicht in diesem Schwerpunkt, sondern bewegt sich um ihn: Zwischen 1800 und
2050 lag ihr Mittelpunkt 0,06 bis 2,11 Sonnenradien davon entfernt, im Mittel 1,21 Sonnenradien,
bei Geschwindigkeiten von 8,5 bis 16,1 m/s; [Jupiter](objekt:jupiter) allein verschiebt den
Schwerpunkt um 1,07 Sonnenradien, die größten Annäherungen wiederholen sich im Mittel alle
19,86 Jahre, der synodischen Periode von Jupiter und Saturn (fachgeprüfter Text:
[Sonne](objekt:sun), Abschnitt Bahn, Rotation und Dynamik). Orrery rechnet dagegen mit der Sonne
ruhend im Ursprung, ohne diese Bewegung um den Schwerpunkt (Einzelheiten weiter unten).

## Klassen der Körper

Nach Masse, Zusammensetzung und Bahnlage unterscheidet man mehrere Klassen. Die vier inneren,
[Merkur](objekt:mercury), [Venus](objekt:venus), [Erde](objekt:earth) und [Mars](objekt:mars),
sind Gesteinsplaneten mit festem Kern und dünner oder fehlender Gashülle. Jenseits der
Schneelinie folgen die Gasriesen [Jupiter](objekt:jupiter) und [Saturn](objekt:saturn), vor
allem Wasserstoff und Helium, und die Eisriesen [Uranus](objekt:uranus) und
[Neptun](objekt:neptune) mit einem größeren Anteil an Wasser-, Ammoniak- und Methaneis. Fünf
Körper — [Ceres](objekt:ceres), [Pluto](objekt:pluto), [Eris](objekt:eris), Haumea und Makemake
— tragen den Status Zwergplanet: groß genug für hydrostatisches Gleichgewicht, aber ohne
freigeräumte Bahnumgebung; Kriterien, Streitstand und Einzelwerte stehen unter
[Zwergplaneten](thema:zwergplaneten).

Monde begleiten sechs der acht Planeten sowie mehrere Zwergplaneten; mindestens 461 sind bekannt
— Erde 1, Mars 2, Jupiter 115, Saturn 293, Uranus 29, Neptun 16, Pluto 5 —, Stand 23. Mai 2023
([JPL SSD Discovery Circumstances](quelle:jpl-satelliten-entdeckung)); die meisten davon sind
kleine, unregelmäßig gebundene Einfangkörper.

Zwischen Mars und Jupiter liegt der Asteroidengürtel, dessen Halbachsenverteilung um 2,7 AE
gipfelt und sich über etwa 2,1 bis 3,3 AE erstreckt (fachgeprüfter Text:
[Kirkwood-Lücken](thema:kirkwood-luecken), Abschnitt Im Modell); jenseits Neptuns liegt der
Kuipergürtel, dessen Population sich grob in etwa 60 % kalte klassische, 25 % heiße und 15 %
Plutino-Objekte gliedert (fachgeprüfter Text: [Entstehung des Sonnensystems](thema:entstehung),
Abschnitt Im Modell). Noch weiter außen schließt sich die gestreute Scheibe an, deren Objekte durch
nahe Begegnungen mit Neptun auf exzentrische, stark geneigte Bahnen geworfen wurden; ob sich
daran eine kugelförmige Oortsche Wolke aus Kometenkernen anschließt, gilt als wahrscheinliche
Erklärung langperiodischer Kometen, ist aber nicht direkt beobachtet — selbst grobe Zahlen zu
ihrer Ausdehnung und Gesamtmasse fehlen bislang ([Oortsche Wolke](quelle:nasa-oortwolke)).

Die Heliosphäre schließlich ist die vom Sonnenwind aufgeblasene Blase im interstellaren Medium;
Voyager 2 kreuzte ihre äußere Grenze, die Heliopause, am 5. November 2018 bei 119 AE
([Stone et al. 2019](literatur:stone-2019)).

## Alter

Die ältesten datierten Festkörper des Systems, kalzium-aluminiumreiche Einschlüsse in
Meteoriten, entstanden vor $4567{,}30 \pm 0{,}16$ Millionen Jahren
([Connelly et al. 2012](literatur:connelly-2012)); dieses Alter gilt gemeinhin auch als Alter
des Sonnensystems selbst, denn die Bildung der ersten Festkörper markiert den Übergang von der
Sonnenentstehungswolke zum eigentlichen Sonnensystem.

## Stabilität und Langzeitentwicklung

Trotz der einfachen Zweikörperphysik jeder Einzelbahn ist die Dynamik des gesamten Systems
chaotisch, mit einer Vorhersagegrenze von wenigen zehn Millionen Jahren für die genaue Lage der
inneren Planeten. In einer Integration von 2501 leicht unterschiedlichen Anfangsbedingungen über
jeweils 5 Milliarden Jahre endete rund 1 % in einer starken Zunahme von Merkurs
Bahnexzentrizität, die zu einer Kollision mit der Venus oder einem Sturz in die Sonne führen
kann, in selteneren Fällen auch zu einer nachfolgenden Instabilität, die Mars oder die Venus mit
der Erde kollidieren lässt ([Laskar und Gastineau 2009](literatur:laskar-2009)); das
Sonnensystem in seiner heutigen Form ist damit statistisch, nicht deterministisch stabil.

## Einordnung unter Exoplanetensystemen

Mehr als 6000 Planeten um andere Sterne sind inzwischen bekannt
([NASA Exoplanet Catalog](quelle:nasa-exoplaneten)), genug, um die Architektur des eigenen
Systems einzuordnen. Bei den Periodenverhältnissen benachbarter Planeten liegt unser
System im Rahmen des Üblichen: Die häufigsten beobachteten Verhältnisse liegen zwischen 1,5 und
3,0, die der acht Planeten zwischen 1,7 und 2,8
([Winn und Fabrycky 2015](literatur:winn-2015)). Untypisch ist dagegen, was fehlt: Etwa die
Hälfte aller sonnenähnlichen Sterne trägt mindestens einen engen, weniger als ein Jahr
umlaufenden Planeten mit ein bis vier Erdradien — eine ganze, im eigenen System nirgends
vertretene Größenklasse zwischen Gesteinsplanet und Eisriese
([Winn und Fabrycky 2015](literatur:winn-2015)). Ob das eigene System damit insgesamt eher
gewöhnlich oder eher selten ist, bleibt offen (siehe unten).

## Namensgebung „Orrery"

Der Name Orrery geht auf ein mechanisches Modell des Sonnensystems zurück: Der Londoner
Instrumentenbauer John Rowley baute um 1713 ein solches Gerät für Charles Boyle, den vierten Earl
of Orrery, das Sonne, Erde und Mond zeigt und heute im Science Museum in London steht
([Sammlungsobjekt](quelle:sciencemuseum-orrery)); im Deutschen hießen solche Geräte auch
Planetarium, Planetenmaschine oder, wenn sie nur Sonne, Erde und Mond zeigen, Tellurium
([Wikipedia](quelle:wikipedia-de-orrery)). Kein bekanntes Orrery ist maßstabsgetreu — bei echten
Größenverhältnissen blieben die Planetenkugeln unsichtbar klein —, und auch dieses Programm
vergrößert Körper und staucht Abstände; anders als ein Räderwerk berechnet es die Stellungen aber
laufend aus Bahnelementen statt sie über feste Zahnradverhältnisse anzunähern.

## Offene Fragen

- **Ein neunter, ferner Planet?** Eine Häufung in Perihelrichtung und Bahnebene mehrerer
  extremer transneptunischer Objekte passt zu einem ungesehenen Planeten von mehr als etwa 10
  Erdmassen auf einer stark exzentrischen Bahn Hunderte AE von der Sonne entfernt, mit einer
  Zufallswahrscheinlichkeit von nur 0,007 %
  ([Batygin und Brown 2016](literatur:batygin-2016)). Eine spätere Auswertung der
  Beobachtungsauswahl mehrerer Himmelsdurchmusterungen fand dagegen keinen Beleg für eine
  Häufung, die nicht schon durch die ungleichmäßige Beobachtungsabdeckung selbst erklärt wäre
  ([Napier et al. 2021](literatur:napier-2021)); die Frage ist damit offen.
- **Wie typisch ist das Sonnensystem?** Periodenverhältnisse passen zum Üblichen, die fehlende
  Größenklasse enger Supererden dagegen nicht
  ([Winn und Fabrycky 2015](literatur:winn-2015)); eine zusammenfassende Einordnung als
  „typisch" oder „selten" trifft die Fachwelt nicht.
- **Masse und Gestalt der Oortschen Wolke.** Ihre Existenz gilt als wahrscheinliche Erklärung
  langperiodischer Kometen, doch mangels direkter Beobachtung fehlen selbst grobe, allgemein
  akzeptierte Zahlen zu Ausdehnung, Population und Gesamtmasse
  ([Oortsche Wolke](quelle:nasa-oortwolke)).
- **Ursprung der Neigung der Sonnenachse.** Der Sonnenäquator steht um rund 6° gegen die
  invariable Ebene geneigt; als mögliche, von den Autoren selbst als prüfbar bezeichnete
  Erklärung nennen Bailey, Batygin und Brown dieselbe hypothetische ferne Planetenbahn, die auch
  die Häufung der transneptunischen Objekte erklären soll
  ([Bailey et al. 2016](literatur:bailey-2016)).

## Im Modell

Orrery führt 35 Körper: die Sonne, die acht Planeten, 21 Monde und die fünf anerkannten
Zwergplaneten (gezählt in `src/data/index.ts`). Es fehlen praktisch alle übrigen der mindestens
461 bekannten Monde, jeder Komet, die Jupiter-Trojaner, die gestreute Scheibe und die Oortsche
Wolke sowie die Heliosphäre als eigene Struktur — deckt sich mit dem, was
[Entstehung des Sonnensystems](thema:entstehung) im eigenen Abschnitt „Im Modell" schon für die
beiden Gürtel beschreibt. Die Sonne steht fest im Ursprung, nicht im tatsächlichen, wandernden
Schwerpunkt (oben); jeder Körper läuft für sich allein, ohne gegenseitige Störungen.

Kameraszenen, die sich an der Ausdehnung des Systems orientieren, beziehen ihren Radius
ausdrücklich auf den äußersten *Planeten* — Neptun, `AEUSSERSTER_PLANET` in
`src/render/camera/cinema.ts` — und lassen die Zwergplaneten bewusst außen vor: Eris' Bahn reicht
im Aphel bis etwa 98 AE, weiter als Neptun, und würde jede solche Szene unverhältnismäßig
aufblähen. Für die Darstellung selbst staucht ein einstellbarer Maßstab Abstände und vergrößert
Körper: In der Voreinstellung „Schaubild" schrumpft Neptuns reale große Halbachse von 30,07 AE
auf rund 7,71 AE, in „Kompakt" auf rund 3,90 AE, während das reale Größenverhältnis von Sonnen-
zu Erdradius (rund 109,2 zu 1) durch eine zusätzliche, nur auf die Sonne wirkende Dämpfung auf
rund 38,2 zu 1 beziehungsweise 21,8 zu 1 sinkt (eigene Nachrechnung mit der Formel aus
`src/sim/scale.ts`; Einzelheiten unter [Grenzen des Modells](thema:modell)).

Dieser Text ist zugleich der Starttext des Hochschul-Tabs: Ohne einen Link und ohne eine
gemerkte Sitzung, nach einem Klick auf „Zurücksetzen" und nach einem Klick auf die Wurzel des
Objektbaums setzt der Code das Thema ausdrücklich auf `sonnensystem` (`SYSTEM_THEMA` in
`src/data/themen.ts`, verwendet für Start und Zurücksetzen in `src/app/persistenz.ts` und
`src/store/persist.ts`, für den Wurzelklick in `src/ui/kamerafahrt.ts`) — wer das Programm
öffnet, ohne ein bestimmtes Ziel mitzubringen, liest zuerst diesen Text. Eine Draufsicht
in Bewegung zeigt [Das System von oben](szene:systemblick).

*Stand: September 2026*
