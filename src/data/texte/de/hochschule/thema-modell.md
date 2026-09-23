# Grenzen des Modells

Orrery trennt zwei Dinge, die eine Bildschirmsimulation sonst gern vermischt: Wo ein Körper
in Wirklichkeit steht, rechnet die Software physikalisch, aus Bahnelementen, Rotationsmodellen
und Massen. Wie groß und wie hell er auf dem Bildschirm erscheint, ist dagegen Darstellung und
darf überhöhen — ein Größenregler vergrößert Körper weit über ihr wahres Verhältnis zum
Bahnabstand hinaus, eine Belichtungsrechnung hebt schwaches Licht in den sichtbaren Bereich,
damit ein Planet in 30 AE Abstand nicht im Schwarz verschwindet. Diese zweite Freiheit ändert
nichts an der ersten: Die Position, die die Bildschleife zeichnet, ist immer dieselbe Zahl, die
auch der Datenblock zeigt. Die gleichnamige Übersicht auf Gymnasialniveau fasst die
wichtigsten dieser Vereinfachungen in einer kurzen Liste; dieser Text ordnet sie ein, nennt
Größenordnungen und Belege, und sammelt, was aus den knapp siebzig Körper-, Themen- und
Szenentexten der Hochschulstufe an einzelnen Modellabweichungen bereits nachgerechnet ist.
Wo eine Zahl schon in einem fachgeprüften Text steht, übernimmt dieser Text sie unverändert und
nennt seine Quelle; eigene Nachrechnungen sind als solche gekennzeichnet.

## Zeit

Orrery zählt julianische Tage im Bereich vom 1. Januar 1, 0 Uhr, bis zum 31. Dezember 9999,
0 Uhr (Code-Konstanten `JD_MIN`/`JD_MAX`); jenseits dieses selbst gewählten Randes hätte eine
ungebremst linear fortgeschriebene Exzentrizität Folgen — Saturns $e$ erreichte im Jahr 12 563
null und würde danach negativ, rückwärts Neptuns $e$ im Jahr −14 828, Werte, die der Keplerlöser
zurückweist ([Entstehung des Sonnensystems](thema:entstehung)). Innerhalb
dieses Bereichs stellt die Uhr das Datum als UTC dar, setzt dieselbe Zahl aber ohne Umrechnung
als TDB in die Bahnrechnung ein. Seit dem 1. Januar 2017 gilt
$\mathrm{TT} - \mathrm{UTC} = 32{,}184\,\mathrm{s} + 37\,\mathrm{s} = 69{,}184\,\mathrm{s}$, und
TDB weicht von TT nur um Millisekunden ab — der [heutige Fehler](thema:bezugssysteme) verschiebt
die Erde deshalb um 2,8″ in ekliptikaler Länge, den Mond um 38″. Für frühere und spätere Zeiten
wächst die Differenz ΔT = TT − UT zwischen der gleichförmigen
Bahnzeit und der aus der Erdrotation gemessenen Weltzeit: Für das Jahr −500 gibt der
Sonnenfinsterniskanon ΔT = 17 190 ± 430 s an
([Espenak und Meeus 2006](literatur:espenak-2006)) — fast fünf Stunden, in denen sich die Erde
um rund 72° weiterdreht. Finsternisberichte und Sternbedeckungen belegen diese Abweichung von
720 v. Chr. bis 2015 ([Stephenson et al. 2016](literatur:stephenson-2016)); für die Zeit davor
und für alle Jahrhunderte nach 2015, erst recht weit vor dem Jahr 1 oder nach 9999, gibt es
keine vergleichbare Beobachtungsreihe. Selbst innerhalb des belegten Zeitraums schwankt die
beobachtete Tageslängenzunahme (+1,78 ± 0,03 ms je Jahrhundert gegenüber +2,3 ± 0,1 ms aus der
Gezeitenreibung allein, [Stephenson et al. 2016](literatur:stephenson-2016)) mit einer Periode
von etwa 14 Jahrhunderten um ihren Mittelwert ([Morrison et al. 2021](literatur:morrison-2021));
eine einfache Fortschreibung über Jahrtausende hinaus wäre deshalb nur eine grobe eigene
Abschätzung, keine belegte Zahl. Orrery rechnet mit keiner dieser Korrekturen; das Programm markiert stattdessen
den Zeitraum, für den seine Bahnelemente überhaupt geprüft sind: Außerhalb von 1800 bis 2050
zeigen sowohl der Datenblock eines Körpers als auch das Zeit-Bedienfeld einen Warnhinweis auf
das eingeschränkte Genauigkeits- beziehungsweise Gültigkeitsfenster — diese Warnung ist also,
anders als man vermuten könnte, kein bloßer Programmtext, sondern an eine geprüfte Schwelle im
Code gebunden. Unabhängig vom Kalenderdatum dreht sich die Erde im Modell gleichförmig mit
23,9345 h, das sind 0,101 s mehr als ein Umlauf des tatsächlichen Erdrotationswinkels; zur
Epoche J2000 steht der Kartennullmeridian deshalb schon um 79,5° gegenüber Greenwich verdreht,
am 17. September 2026 um 75,4° — für die Erde gibt es seit dem IAU-Bericht 2015 überhaupt kein
amtliches Rotationsmodell mehr, die alten Näherungen wurden als ungenau gestrichen
([Archinal et al. 2018](literatur:archinal-2018)); Orrerys gleichförmige Drehung ist insofern
nicht falsch angewandt, sondern ersetzt ein Modell, das es amtlich nicht mehr gibt.

## Planetenbahnen

Die acht Planeten bewegen sich nach der JPL-Näherungstafel für 1800 bis 2050, mit linearen
Raten gegen die feste Ekliptik J2000 fortgeschrieben ([JPL Approximate
Positions](quelle:jpl-approx-pos)). Innerhalb des Fensters nennt die Tafel selbst nominelle
Fehler in heliozentrischer Länge von 15″ bei Merkur bis 400″ bei Jupiter und 600″ bei Saturn,
für die Erde — im Modell der Erde-Mond-Schwerpunkt — 20″ in Länge, 8″ in Breite und 6000 km im
Abstand. Wie schnell diese Näherung außerhalb des Fensters unbrauchbar wird, zeigt der
Vergleich mit einer zweiten JPL-Tafel für 3000 v. Chr. bis 3000 n. Chr.: Bei Saturn geben beide
Tafeln für dieselbe Apsidenrate $-0{,}419^\circ$ beziehungsweise $+0{,}542^\circ$ je Jahrhundert
an — nicht nur andere Zahlen, sondern entgegengesetztes Vorzeichen, weil jede Tafel nur die im
jeweiligen Fenster wirksame säkulare Drift auffängt, keine echte Mittelung ist
([Bahnelemente](thema:bahnelemente)). Gegenseitige Störungen zwischen den Planeten rechnet
Orrery nicht; jeder Körper läuft für sich allein um die im Ursprung ruhende Sonne. Diese
Vereinfachung trifft die Sonne selbst am stärksten: Mit den tatsächlichen Positionen und Massen
aus Orrerys eigenen Datensätzen lag ihr Mittelpunkt 1800 bis 2050 zwischen 0,06 und 2,11
$R_\odot$ vom Schwerpunkt des Sonnensystems entfernt, im Mittel 1,21 $R_\odot$; Jupiter allein
verschiebt den Schwerpunkt um 1,07 $R_\odot$, den größten Einzelanteil unter den vier
Riesenplaneten (fachgeprüfte Mehrkörper-Nachrechnung, [Sonne](objekt:sun)).
Innerhalb der Bahn wandelt der Newton-gestützte Keplerlöser die mittlere in die exzentrische
Anomalie um; für die größte Exzentrizität im Katalog, $e = 0{,}438$ bei Eris, genügen ihm
höchstens fünf Schritte, bei $e = 0{,}99$ höchstens zehn. Bei $e = 0{,}999$ — deutlich über
jedem im Katalog vorkommenden Wert, aber ein Grenzfall, an dem sich die Robustheit des Lösers
prüfen lässt — verfehlen 943 von 200 001 gleichabständig getesteten Werten der mittleren
Anomalie das Abbruchkriterium; bei 886 davon bleibt ein Restfehler über $10^{-6}$ rad, und die
Iterierten laufen bis in die Größenordnung $10^{16}$ auseinander, ohne dass der Löser das meldet
(Nachrechnung an der Keplergleichung, wie sie `src/sim/kepler.ts` löst). Für die fünf Zwergplaneten, darunter
[Pluto](objekt:pluto), verwendet Orrery stattdessen oskulierende Elemente der JPL Small-Body
Database zu einer eigenen Epoche, mit ausschließlich der mittleren Länge als laufender Rate;
gegen die numerisch integrierte Ephemeride DE441 ([Park et al. 2021](literatur:park-2021))
weicht Plutos Ort dadurch 2000 um 0,05°, 2050 um 0,13°, 1900 um 0,15° und 1800 bereits um 1,4°
ab, vor allem weil die Momentaufnahme nur die Sonnenmasse als Zentralmasse zählt und deshalb
eine um 0,44 % zu langsame mittlere Bewegung trägt.

## Monde und Zwergplaneten

20 der 21 Mondbahnen im Katalog beziehen sich auf den Äquator ihres Mutterkörpers, mit dessen zur
Epoche festem Pol als Bezugsebene; eine eigens geführte Laplace-Ebene — die Fläche, auf der die
säkulare Bewegung kreisförmiger Bahnen tatsächlich verschwindet und die nahe am Planeten mit dem
Äquator, weit draußen mit der Bahnebene zusammenfällt — kennt Orrery nicht. Bei den meisten
Monden ist der Unterschied klein; bei Kallisto weicht die JPL-eigene Laplace-Ebene 0,4° vom
Jupiteräquator ab, bei Deimos 0,9° vom Marsäquator, und bei Iapetus liegt die Bahn selbst 7,6°
von der geneigten Laplace-Ebene entfernt, während Orrery sie an Saturns Äquator bindet, statt
den Knoten um den Laplace-Pol statt um Saturns eigenen Pol zu präzedieren
([Bahnelemente](thema:bahnelemente)). Für [Pluto](objekt:pluto) und seinen Mond Charon geht die
Vereinfachung weiter: Der tatsächliche Systemschwerpunkt liegt rund 2126 km — 1,79 Plutoradien —
von Plutos Mitte entfernt, außerhalb von Plutos eigener Oberfläche. Orrery lässt Pluto trotzdem
fest im Ursprung seines Systems stehen und Charon sichtbar um Plutos Mittelpunkt statt um diesen
Schwerpunkt laufen; Plutos eigenes Taumeln mit Charons Umlaufperiode bleibt unsichtbar, bei
einem Sonnenabstand von rund 39,6 AE beträgt sein Betrag ohnehin weniger als 0,00004 % dieses
Abstands. Bei den vier weiteren Zwergplaneten — Ceres, [Haumea](objekt:haumea),
Makemake und Eris — verwendet Orrery wie bei Pluto oskulierende Elemente ohne Präzessionsraten;
ihre eigenen Monde fehlen im Katalog vollständig: Charon steht als einziger Mond eines
Zwergplaneten überhaupt im Datensatz, während Dysnomia (Eris), Hiʻiaka und Namaka (Haumea),
MK 2 (Makemake) sowie Plutos vier kleine Monde Styx, Nix, Kerberos und Hydra fehlen. Ganz
allgemein zeigt Orrerys Mondkatalog nur einen kleinen Ausschnitt: 21 Monde stehen im Datensatz
(Erde 1, Mars 2, Jupiter 4, Saturn 7, Uranus 5, Neptun 1, Pluto 1), gegenüber 460 bei der
JPL Solar System Dynamics-Gruppe geführten Monden der Riesenplaneten, des Mars und Plutos
zusammen — Stand
23. Mai 2023, jüngere Nachmeldungen nicht eingerechnet ([JPL SSD Discovery
Circumstances](quelle:jpl-satelliten-entdeckung)); die fehlenden knapp 440 sind fast
ausschließlich kleine, unregelmäßig gebundene Monde außerhalb der Auflösung, für die eine
Sichtbarkeit im Bild ohnehin fraglich wäre.

## Rotation und Pole

Alle Rotationspole im Katalog stehen als feste Rektaszension und Deklination, ohne Präzession
und ohne die periodischen Glieder, die der IAU-Bericht bei manchen Monden zusätzlich angibt
([Archinal et al. 2011](literatur:archinal-2011)); [Miranda und Triton](thema:achsneigung)
behalten deshalb nur die konstanten Anteile ihrer amtlich komplizierteren Polbahn. Wo überhaupt
keine Messung vorliegt, weicht der Datensatz auf einen Behelf aus: [Eris'](objekt:eris) Pol
steht senkrecht auf ihrer eigenen heliozentrischen Bahn, entspricht also einem angenommenen
Kippwinkel von 0°, während die einzige tatsächliche Messung — aus der Bahn ihres Mondes Dysnomia
— einen Kippwinkel von rund 78,3° ergibt; Makemakes Pol ist mit 46° bis 78° noch schlechter
eingegrenzt. Selbst wo ein Pol gemessen ist, übernimmt Orrery nicht immer den amtlich neuesten:
Der Datensatz führt für Mars ausdrücklich den älteren IAU-Bericht von 2009
(317,68143°/52,88650°) statt des seit 2015 amtlichen Pols (317,269°/54,432°), weil nur der
ältere Wert die häufig zitierte Achsneigung von 25,19° liefert — der neuere ergäbe 23,92°; ein
methodischer Unterschied zwischen den beiden zugrunde liegenden Ephemeriden, den kein einzelner
Text auflösen kann. Bei den beiden äußersten Riesenplaneten schließlich beruht die
Rotationsperiode im Datensatz auf den Radiomessungen der Voyager-2-Vorbeiflüge von 1986 und
1989, obwohl längst genauere Verfahren vorliegen: Für Uranus steht $-17{,}24\,\mathrm{h}$ im
Katalog, während Hubble-Aufnahmen der Aurorae über 2011 bis 2022 tausendfach genauer
$17{,}247864 \pm 0{,}000010\,\mathrm{h}$ ergeben
([Lamy et al. 2025](literatur:lamy-2025)) — ein Unterschied von nur rund 28 s je Umdrehung, der
sich aber, seit J2000 immerhin 26,7 Jahre lang aufsummiert, zu rund sechs vollen Umdrehungen
Unterschied addiert. Für [Neptun](objekt:neptune) trägt der Katalog $16{,}11\,\mathrm{h}$ aus
derselben Voyager-2-Messung; eine photometrische Verfolgung stabiler Südpolmerkmale ergab 2011
$15{,}9663\,\mathrm{h}$, rund 8,6 Minuten kürzer je Umdrehung, was sich seit J2000 zu rund 131
Umdrehungen Unterschied aufsummiert — ob überhaupt eine einzelne Periode die feste Rotation des
ganzen, möglicherweise differentiell rotierenden Körpers beschreibt, ist offen. Diese
Vereinfachung betrifft ausschließlich, welche Rotationsmarkierung im Bild wohin zeigt; die
siderische Umlaufzeit der Monde und damit ihre Bahnbewegung bleibt davon unberührt.

## Form und Oberfläche

Jeder Körper im Katalog ist im Bild eine Kugel mit einem einzigen Radius; `render/bodies.ts`
kennt keine Abplattung. Bei den Riesenplaneten ist der verwendete Radius das NSSDC-Volumenmittel
aus Äquator- und Polradius, nicht der tatsächlich sichtbare Äquatorradius: Saturns Abplattung
von 0,09796 ist die größte im Katalog und lässt die Modellkugel 2036 km unter dem realen Äquator
und 3868 km über den realen Polen liegen; Jupiter folgt mit einer Abplattung von 0,06487, deutlich
vor Uranus (0,02293) und Neptun (0,0171). Bei den kleinen Körpern kann der Fehler größer
ausfallen als bei jedem Planeten: [Haumeas](objekt:haumea) Modellkugel hat 774,1 km Radius,
während ihre gemessenen Halbachsen bei rund 1061, 844 und 514 km liegen — die Kugel
unterschätzt die lange Achse um rund 27 % und überschätzt die kurze um rund 51 %, die stärkste
Formabweichung im gesamten Katalog. Ergänzend zur Form ist auch das Bildmaterial ungleich
verlässlich: Von den rund dreißig hinterlegten Körpertexturen sind vier — Ceres, Eris, Haumea
und Makemake — von ihrer Quelle ausdrücklich als „fictional" gekennzeichnete, an Farbe und
Albedo angenäherte künstlerische Karten, weil für diese Körper keine flächendeckende
Kartierung existiert; Deimos trägt überhaupt keine Textur, sondern nur eine Ausweichfarbe
(Herkunftsnachweis der Bilddateien im Anhang zur Lizenzierung). Saturns Ring folgt derselben
Logik wie die Kugeln: eine einzige flache, nach dem Pol ausgerichtete Scheibe mit einer
Bilddatei für Bänderung und Farbe, ohne D-, F-, G- oder E-Ring, ohne Dicke und ohne
Dichtewellen ([Ringsysteme](thema:ringe)).

## Licht und Bild

Jeder Körper außer der Sonne trägt eine geometrische Albedo, meist aus V-Band-Messungen; nur die
Sonne selbst strahlt eigenes Licht ab, jeder andere Körper streut es. Das Materialmodell
streut lambertsch mal einem Fresnel-Faktor $F$, der am Halbvektor zwischen Licht- und
Blickrichtung gilt und deshalb mit dem Phasenwinkel wächst — 0,04 bei voller Phase, 0,13 bei
135° und 0,41 bei 160° —, dazu kommt ein kleiner ungefärbter Glanz. Eine Kugel der linearen
Reflexion $p$ erreicht dadurch, ohne Glanz und Fülllicht, nur die geometrische Albedo
$0{,}640\,p$: Die Erdkugel zeigt so 0,278 und 0,415 statt der gemessenen 0,434 und 0,293,
Enceladus 0,64 statt der gemessenen 1,24 ([Albedo und Helligkeit](thema:photometrie)).
Die Nachtseite bleibt trotzdem nie ganz schwarz: Ein Fülllicht (`nightFill`), im Standard ein
Viertel des Tagniveaus, hellt sie mit derselben Textur, aber ohne den Streufaktor auf — eine
gestalterische Zugabe ohne physikalisches Vorbild, notwendig, damit die verdeckte Seite eines
Körpers im Bild nicht spurlos verschwindet. Schatten zeichnet Orrery nur zwischen Kugeln, mit
höchstens vier gleichzeitigen Verdeckern (`MAX_OKKLUDER`); wo ein System mehr Kandidaten hat als
diese Grenze erlaubt, entscheidet der größte dargestellte Winkelradius — bei Saturn bleiben so
Titan, Tethys, Dione und Rhea übrig, bei Uranus fällt Oberon als kleinster heraus
([Finsternisse](thema:finsternis)). Ob ein Mond überhaupt einen Schatten auf seinen Planeten
werfen kann, folgt geometrisch aus $\arcsin(R_\mathrm{p}/a)$ mit dem Planetenradius $R_\mathrm{p}$
und dem Bahnradius $a$ des Monds, verglichen mit der Achsneigung des Planeten; für die vier
Galileischen Monde und Jupiters Achsneigung von rund 3,1°
bedeutet das etwa, dass nur Kallisto zeitweise ganz ohne eigenen Schatten bleibt. Insgesamt
findet die Mondfinsternis-Suche gegen den NASA-Katalog 1951 bis 2050 135 von 143
Kernschattenfinsternissen, mit einer maximalen zeitlichen Abweichung von 3,0 h und einem
quadratischen Mittel von 1,8 h — die Ursache ist dieselbe Kepler-Ellipse ohne periodische
Störungen, die auch die Planetenbahnen vereinfacht. Der Sternhintergrund schließlich zeigt
5070 Sterne der HYG-Datenbank als reine Punktgrößen ohne Spektrum jenseits der Farbindex-Färbung
und ohne veränderliche Helligkeit.

## Maßstab

Damit Planet und Bahn gleichzeitig auf dem Bildschirm Platz finden, staucht Orrery Abstände mit
einer Potenzfunktion, die bei 1 AE unverändert bleibt:

$$R = A\,\left(\frac{r}{A}\right)^{k}, \quad A = 1\,\mathrm{AU}$$

`SCALE_PRESETS` in `src/sim/scale.ts` hinterlegt drei feste Einstellungen aus Größenfaktor,
Abstandsexponent $k$ und einer zusätzlichen Dämpfung allein für die Sonnenkugel: „Realistisch"
($1\times$, $k=1{,}0$, ungedämpft — die Identität, echte Größen und Abstände), „Schaubild"
($50\times$, $k=0{,}6$, Sonne auf 35 % gedämpft) und „Kompakt" ($200\times$, $k=0{,}4$, Sonne
auf 20 % gedämpft). Sinkendes $k$ staucht weit außen stark und nahe 1 AE kaum, weshalb die Erde
beim Ziehen des Reglers praktisch ortsfest bleibt. Am weitesten Planeten zeigt sich der Effekt
am deutlichsten: Neptuns tatsächliche große Halbachse von 30,07 AE erscheint „Realistisch"
unverändert, unter „Schaubild" auf rund 7,71 AE gestaucht und unter „Kompakt" auf rund 3,90 AE
(eigene Nachrechnung mit der Formel oben). Größenverhältnisse dagegen wachsen mit dem einfachen
Größenfaktor, ungedämpft für alle Körper außer der Sonne: Das reale Verhältnis von Sonnen- zu
Erdradius, rund 109,2 zu 1, schrumpft durch die zusätzliche Sonnendämpfung auf rund 38,2 zu 1 im
Schaubild-Preset und auf rund 21,8 zu 1 im Kompakt-Preset (eigene Nachrechnung) — ohne diese
gezielte Dämpfung würde die vergrößerte Sonne bei jedem der beiden verkleinerten Maßstäbe die
inneren Planeten optisch verschlucken. Monde folgen einer eigenen Regel: Weil ihr Bahnradius um
den Mutterkörper mit demselben Größenfaktor skaliert wie dessen eigener Radius, nicht mit der
Abstandskompression der Planetenbahnen, bleibt das Verhältnis von Planetenradius zu Mondbahn bei
jedem Preset exakt richtig — nur das gesamte Mondsystem wandert mit seinem Planeten.

## Gürtel

Haupt- und Kuipergürtel sind im Bild reine Punktwolken mit festen Bahnelementen; nur die
mittlere Anomalie läuft, eine Störung durch die Planeten fehlt vollständig
([Entstehung des Sonnensystems](thema:entstehung)). Der Hauptgürtel verteilt seine Halbachsen
glockenförmig um 2,7 AE (Streuung 0,35 AE) im Bereich 2,1 bis 3,3 AE und multipliziert diese
Verteilung mit fünf vorgegebenen, gaußförmigen Einbrüchen an den Resonanzen 4:1, 3:1, 5:2, 7:3
und 2:1, deren Restdichte in der Mitte rechnerisch genau 10 % beträgt und deren Halbwertsbreiten
zwischen 0,0167 AE (7:3) und 0,0333 AE (2:1) liegen ([Kirkwood-Lücken](thema:kirkwood-luecken)).
Die Lagen selbst weichen leicht von der übrigen Simulation ab: Der Gürtel-Code legt Jupiters
große Halbachse mit 5,2044 AE fest, während [Bahnresonanzen](thema:resonanzen) mit 5,203 AE
rechnet — die daraus folgende Verschiebung der Lückenlagen liegt zwischen 0,0006 und 0,0009 AE,
weit unter jeder im Bild auflösbaren Distanz. Alle Hauptgürtel-Teilchen tragen einheitlich die
Albedo 0,06, ohne Unterscheidung zwischen helleren S- und dunkleren C-Typ-Asteroiden; der
Kuipergürtel mischt 60 % kalte klassische Objekte (Neigungsstreuung 3°), 25 % heiße (12°) und
15 % Plutinos, ebenfalls ohne physikalische Entwicklung der einzelnen Bahnen über die Zeit.

## Offene Fragen

- **Rotationsperioden von Uranus und Neptun.** Für Uranus fehlt bislang jede zweite, von der
  Radiostrahlung unabhängige Bestimmung, wie sie Saturns Schwerefeld und Ringseismologie
  liefern; ob die aus der Magnetfeldrotation gewonnene Hubble-Periode auch die Drehung des
  ganzen Körpers trifft, bleibt offen ([Lamy et al. 2025](literatur:lamy-2025)). Für Neptun
  weichen Voyagers Radiomessung (16,11 h), eine photometrische Bestimmung aus Südpolmerkmalen
  (15,9663 h) und eine formbasierte Schätzung (rund 17,46 h) um mehr als eine Stunde
  voneinander ab, ohne dass eine der drei als die Rotation des tiefen Inneren gesichert wäre.
- **$\Delta T$ für ferne Jahrhunderte.** Finsternisberichte und Sternbedeckungen belegen die
  Differenz zwischen gleichförmiger Bahnzeit und Erdrotation nur von 720 v. Chr. bis 2015
  ([Stephenson et al. 2016](literatur:stephenson-2016)); für Orrerys vollen Zeitbereich vom
  Jahr 1 bis 9999 gibt es keine vergleichbar belegte Reihe, und ob die beobachtete
  Tageslängenzunahme über solche Zeiträume überhaupt gleichmäßig bliebe, ist unbekannt.
- **Haumeas wahre Form und Dichte.** Je nach zugrunde gelegter Formbestimmung ergeben sich rund
  1859 oder rund 2050 kg/m³ mittlere Dichte; ein homogener Körper passt nicht zur gemessenen
  Form ([Ortiz et al. 2017](literatur:ortiz-2017)), ein differenzierter dagegen schon
  ([Dunham et al. 2019](literatur:dunham-2019)), und eine neuere Rechnung sagt für den
  hydrostatischen Fall sogar eine von jedem Ellipsoid abweichende, „eingeschnürte" Form voraus,
  die Orrerys Kugelnäherung noch weiter unterläuft und erst eine künftige Bedeckung entscheiden
  könnte ([Staelen et al. 2026](literatur:staelen-2026)).
- **Die nächste Fassung des IAU-Rotationsberichts.** Der Bericht von 2018 ist selbst schon eine
  Momentaufnahme, die einzelne Werte (etwa für Uranus und Neptun) bewusst auf dem Stand älterer
  Raumsondenmissionen belässt, weil ein förmlicher Beschluss der zuständigen Arbeitsgruppe noch
  aussteht ([Archinal et al. 2018](literatur:archinal-2018)); Orrerys Datensatz kann diesem
  Beschluss frühestens mit seiner Veröffentlichung folgen.

*Stand: September 2026*
