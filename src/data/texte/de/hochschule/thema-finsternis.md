# Finsternisse

Eine Finsternis ist der Durchgang eines Körpers durch den Schatten eines anderen. Bei Neumond kann
der Schatten des [Mondes](objekt:moon) die [Erde](objekt:earth) treffen, bei Vollmond tritt der Mond
in den Erdschatten. Dieser Text behandelt die Schattengeometrie, die Bedingungen und Kenngrößen
beider Arten, die Finsternisgrenzen, die Perioden Saros und Inex, das Rechenverfahren der
Besselschen Elemente, die Rolle von ΔT bei alten Finsternissen, Finsternisse als Forschungsmittel und
Finsternisse bei anderen Planeten. Die Vergrößerung des Erdschattens und der Ablauf der Szene stehen
in [Szene: Mondfinsternis](szene:mondfinsternis).

## Kern-, Halb- und Gegenschatten

Hinter einem undurchsichtigen Körper vom Radius $R$ im Abstand $D$ von der [Sonne](objekt:sun) mit
dem Radius $R_\odot$ begrenzen zwei Kegel den Schatten. Der innere läuft in der Entfernung $L$ spitz
zu, der äußere öffnet sich:

$$\sin f_2 = \frac{R_\odot - R}{D}, \quad L = \frac{R}{\tan f_2}, \quad \sin f_1 = \frac{R_\odot + R}{D}$$

Im Abstand $d$ hinter dem Körper haben Kern- und Halbschatten damit die Radien

$$r_\mathrm{u}(d) = R - d\,\tan f_2, \quad r_\mathrm{p}(d) = R + d\,\tan f_1$$

Für $d > L$ wird $r_\mathrm{u}$ negativ. Dort liegt der Gegenschatten: Der verdeckende Körper
erscheint kleiner als die Sonne, ein schmaler Rand bleibt sichtbar, und eine Finsternis in diesem
Bereich ist ringförmig. Im Halbschatten wird die Sonne teilweise verdeckt, im Kernschatten ganz. Die
Grenzen sind nur geometrisch scharf; eine Atmosphäre am verdeckenden Körper verwischt sie.

Bei 1 AE reicht der Erdkernschatten rund 1,38 Millionen km weit, das 3,6-Fache des mittleren
Mondabstands. Der Kernschatten des Mondes endet schon nach rund 374 500 km und damit knapp innerhalb
des mittleren Mondabstands — deshalb sind ringförmige Sonnenfinsternisse häufiger als totale. In
Mondentfernung hat der Erdkernschatten den Radius 4599 km und der Halbschatten 8175 km; der
Kernschatten ist 2,65-mal so breit wie der Mond.

## Sonnenfinsternisse

Vier Arten werden unterschieden: partiell, wenn nur der Halbschatten des Mondes die Erde streift;
ringförmig, wenn der Gegenschatten auftrifft; total, wenn der Kernschatten auftrifft; hybrid, wenn
Kern- und Gegenschatten verschiedene Teile der Erde treffen, die Finsternis also längs ihres Weges
ringförmig und total erscheint ([Espenak und Meeus 2006](literatur:espenak-2006)). Ob ein Beobachter
im Abstand $d$ vom Mondmittelpunkt Totalität sieht, entscheidet der Vergleich der Winkelradien

$$\beta = \arcsin\frac{R_\mathrm{M}}{d}, \quad \alpha = \arcsin\frac{R_\odot}{D}$$

Totalität herrscht für $\beta \ge \alpha$, gleichbedeutend mit $d \le L$; für $\beta < \alpha$ bleibt
ein Ring stehen, und es fehlt der Bruchteil $\beta^2/\alpha^2$ der Sonnenfläche. Der Winkelradius der
Sonne schwankt zwischen 0,262° im Aphel und 0,271° im Perihel, der des Mondes zwischen 0,245° im
mittleren Apogäum und 0,274° im mittleren Perigäum; beide Bereiche überlappen, und genau deshalb
gibt es beide Arten.

Zwei Kenngrößen beschreiben eine Sonnenfinsternis. Die Größe (Magnitude) ist der verdeckte Bruchteil
des Sonnendurchmessers; sie ist kleiner als 1 bei partiellen und ringförmigen, mindestens 1 bei
totalen und hybriden Finsternissen. Gamma ist der kleinste Abstand der Schattenachse vom
Erdmittelpunkt in Einheiten des Erdäquatorradius, positiv nördlich und negativ südlich davon;
zwischen −0,997 und +0,997 ist die Finsternis zentral, und die Abweichung von 1 kommt von der
Abplattung der Erde ([Espenak und Meeus 2006](literatur:espenak-2006)). In den 5000 Jahren von −1999
bis +3000 zählt der Kanon 11 898 Sonnenfinsternisse: 4200 partielle, 3956 ringförmige, 3173 totale
und 569 hybride. Jedes Kalenderjahr bringt zwei bis fünf davon, in 72,5 % der Jahre genau zwei.
Karten und Zeiten stehen auf der [NASA Eclipse Web Site](quelle:nasa-eclipse).

## Mondfinsternisse

Der Mond durchläuft nacheinander Halbschatten und Kernschatten. Die Berührungen heißen P1 und P4
(äußere Berührung mit dem Halbschatten), U1 und U4 (äußere Berührung mit dem Kernschatten) sowie U2
und U3 (innere Berührung mit dem Kernschatten). Eine Finsternis heißt halbschattig, wenn der Mond
nur den Halbschatten durchquert, partiell, wenn er den Kernschatten teilweise erreicht, und total,
wenn er ganz darin steht; liegt bei einer halbschattigen Finsternis die ganze Mondscheibe im
Halbschatten, heißt sie total halbschattig
([Espenak und Meeus 2009](literatur:espenak-2009)). Mit dem kleinsten Abstand $\gamma$ der Mondmitte
von der Schattenachse in Mondentfernung lauten die Bedingungen

$$\gamma < r_\mathrm{p} + R_\mathrm{M}, \quad \gamma < r_\mathrm{u} + R_\mathrm{M}, \quad \gamma < r_\mathrm{u} - R_\mathrm{M}$$

für halbschattig, partiell und total. Die Größe ist auch hier ein Bruchteil des Monddurchmessers,
nun der Eindringtiefe in den jeweiligen Schatten; im Kanon reicht die Halbschattengröße von 0,0004
bis 1,0858, die Kernschattengröße von 0,0001 bis 0,9998 bei partiellen und von 1,0001 bis 1,8821 bei
totalen Finsternissen. Von den 12 064 Mondfinsternissen der fünf Jahrtausende sind 4378
halbschattig — davon nur 141 total halbschattig —, 4207 partiell und 3479 total, von diesen 2074
zentral ([Espenak und Meeus 2009](literatur:espenak-2009)). Im 21. Jahrhundert gibt es 228
Mondfinsternisse, im Mittel 2,28 je Jahr und in jedem Jahr mindestens zwei
([Lunar eclipse, englische Wikipedia](quelle:wikipedia-en-lunar-eclipse)).

Der beobachtete Kernschatten ist größer als der geometrische. Chauvenet vergrößerte beide
Winkelradien um 1/50, Danjon legte eine undurchsichtige Schicht von 75 km auf den Erdradius, und aus
über 20 000 Kraterzeiten folgt eine mittlere wirksame Schichthöhe von 86,9 km
([Herald und Sinnott 2014](literatur:herald-2014)). Was daraus für die Szene folgt, steht dort.

## Finsternisgrenzen und Finsternisjahr

Eine Finsternis setzt voraus, dass Neu- oder Vollmond nahe einem Knoten der Mondbahn steht, also
nahe dem Schnitt von Mondbahn und Ekliptik ([Bahnelemente](thema:bahnelemente)). Für Mondfinsternisse
gilt: Jenseits von etwa 10,6° Knotendistanz bleiben nur Halbschattenfinsternisse, jenseits von etwa
16,7° gibt es gar keine, und oberhalb von 4,7° ist keine totale mehr möglich
([Mondfinsternis](quelle:wikipedia-de-mondfinsternis)).

Weil der Knoten rückläufig wandert, kehrt die Sonne schneller zu ihm zurück als zum Frühlingspunkt.
Dieses Finsternisjahr folgt aus dem drakonitischen Monat $T_\mathrm{d}$ und dem synodischen
$T_\mathrm{s}$:

$$\frac{1}{T_\mathrm{f}} = \frac{1}{T_\mathrm{d}} - \frac{1}{T_\mathrm{s}}$$

Das ergibt 346,62 Tage; der dem Sonnenort gegenüberliegende Punkt entfernt sich also mit 1,0386° je
Tag vom Knoten. Das Fenster von ±16,7° ist damit 32,2 Tage breit und länger als ein synodischer
Monat von 29,53 Tagen: In jede Finsternisperiode fällt mindestens ein Vollmond. Die Perioden folgen
im Abstand eines halben Finsternisjahres, also alle 173,3 Tage, so dass in jedes Kalenderjahr
mindestens zwei fallen — deshalb gibt es jedes Jahr mindestens zwei Mondfinsternisse. Das Fenster
von ±10,6° ist dagegen nur 20,4 Tage breit, weshalb eine Periode ohne Kernschattenfinsternis
vergehen kann.
Weil das Finsternisjahr um gut 18 Tage kürzer ist als das siderische Jahr, rücken die Perioden
jährlich um diesen Betrag vor und wandern in 18,6 Jahren einmal durch den Kalender.

## Saros und Inex

Finsternisse gleicher Bauart wiederholen sich, wenn synodischer, drakonitischer und anomalistischer
Monat zugleich fast ganzzahlig aufgehen. Mit den Werten für das Jahr 2000
([Espenak und Meeus 2009](literatur:espenak-2009)) ergibt sich der Saros:

| Monat | Länge (d) | Anzahl im Saros | Summe (d) |
|---|---|---|---|
| synodisch (Neumond zu Neumond) | 29,530589 | 223 | 6585,3213 |
| drakonitisch (Knoten zu Knoten) | 27,212221 | 242 | 6585,3575 |
| anomalistisch (Perigäum zu Perigäum) | 27,554550 | 239 | 6585,5375 |

Der Saros dauert also rund 18 Jahre, 11 Tage und 8 Stunden. Nach ihm steht der Mond wieder nahe
demselben Knoten, in fast derselben Entfernung und zur selben Jahreszeit. Das überschüssige Drittel
eines Tages verschiebt die Sichtbarkeit um rund 120° nach Westen; erst der dreifache Saros, der
Exeligmos von rund 54 Jahren und 34 Tagen, führt sie an dieselbe Stelle der Erde zurück. Weil
synodischer und drakonitischer Monat um 52 Minuten auseinanderliegen, rückt der Mond je Saros um
etwa 0,48° gegen den Knoten, und jede Reihe endet nach 12 bis 15 Jahrhunderten. Von den 120
vollständigen Mondfinsternisreihen des Kanons enthält fast jede zweite 72 oder 73 Finsternisse; die
Spanne reicht von 69 bis 89. Jede Reihe beginnt und endet mit Halbschattenfinsternissen und trägt in
der Mitte 11 bis 29 totale ([Espenak und Meeus 2009](literatur:espenak-2009)).

Der Inex aus 358 synodischen Monaten (10 571,9509 d, rund 29 Jahre weniger 20 Tage) trifft mit 388,5
drakonitischen Monaten (10 571,9479 d) fast genau zusammen. Die halbe Zahl bedeutet, dass aufeinander
folgende Finsternisse einer Reihe an entgegengesetzten Knoten stattfinden; die Abweichung von gut
vier Minuten entspricht einem Knotenversatz von 0,04°, und eine Inex-Reihe läuft deshalb rund 225
Jahrhunderte mit etwa 780 Finsternissen. Van den Bergh ordnete alle Finsternisse in einem Raster aus
Saros-Spalten und Inex-Zeilen an ([Espenak und Meeus 2009](literatur:espenak-2009)). Die Monatslängen
selbst ändern sich säkular, weil die mittlere Exzentrizität der Mond- und der Erdbahn langsam
wandert: der synodische Monat um +0,2 s, der drakonitische um +0,4 s und der anomalistische um
−0,8 s je Jahrtausend.

## Besselsche Elemente

Das Standardverfahren für Sonnenfinsternisse geht auf Bessel zurück. Es legt eine Fundamentalebene
durch den Erdmittelpunkt, senkrecht zur Achse des Mondschattens. In ihr beschreiben $x$ und $y$ den
Durchstoßpunkt der Achse in Erdradien, $l_1$ und $l_2$ die Radien von Halb- und Kernschattenkegel,
$f_1$ und $f_2$ deren Öffnungswinkel; Deklination $d$ und Stundenwinkel $\mu$ der Achse geben ihre
Richtung ([Melati und Hodijah 2016](literatur:melati-2016)). Aus diesen Größen folgen für jeden Ort
der Weg des Schattens, seine Breite und die Dauer. Nach dem Kernschattenradius $u$ in der
Fundamentalebene ist eine zentrale Finsternis total für $u < 0$ und ringförmig für $u > 0{,}0047$,
dazwischen ringförmig oder hybrid. Die Kanons von Meeus und Mucke sowie von Meeus, Grosjean und
Vanderleen führen genau diese Elemente
([Espenak und Meeus 2009](literatur:espenak-2009)). Bei Mondfinsternissen hängt der Ablauf nicht vom
Ort ab: Die Finsternis läuft für die ganze Nachtseite gleich, und nur Auf- und Untergang des Mondes
begrenzen die Sichtbarkeit. Die Zeiten werden in Terrestrischer Zeit angegeben
([Bezugssysteme](thema:bezugssysteme)).

## ΔT und alte Finsternisse

Wo eine Finsternis zu sehen war, hängt von der Erdrotation ab. Die Ephemeridenrechnung liefert die
Terrestrische Zeit, die Erddrehung die Universalzeit; ihre Differenz ΔT ist nicht vorhersagbar,
sondern muss gemessen werden. Für die Vergangenheit liefern Finsternisberichte diese Messung selbst.
Stephenson, Morrison und Hohenkerk werteten 180 babylonische Finsterniszeiten von −720 bis −9, 111
chinesische Aufzeichnungen von 434 bis 1280 sowie griechische und arabische Beobachtungen aus und
fanden eine beobachtete Zunahme der Tageslänge von +1,78 ± 0,03 ms je Jahrhundert gegenüber +2,3 ±
0,1 ms je Jahrhundert aus der [Gezeitenreibung](thema:gezeiten) allein
([Stephenson et al. 2016](literatur:stephenson-2016)). Die Ergänzung um weitere
Sonnenfinsternisberichte ergab eine beobachtete Verzögerung von
$(-4{,}59 \pm 0{,}08) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$ gegen
$(-6{,}39 \pm 0{,}03) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$ aus der Drehimpulserhaltung im
System Sonne–[Erde](objekt:earth)–Mond, also eine mittlere beschleunigende Komponente von
$(+1{,}8 \pm 0{,}1) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$, dazu eine Schwankung mit einer
Periode von etwa 14 Jahrhunderten ([Morrison et al. 2021](literatur:morrison-2021)). Ohne ΔT landete
eine alte Finsternis um Stunden und damit um Kontinente falsch: Für das Jahr −500 gibt der
Sonnenfinsterniskanon ΔT = 17 190 ± 430 s an
([Espenak und Meeus 2006](literatur:espenak-2006)), fast fünf Stunden, in denen sich die Erde um
rund 72° dreht.

## Finsternisse als Forschungsmittel

Totale Sonnenfinsternisse öffnen den Blick auf die Korona. 1868 sah Janssen in Indien im Spektrum
der Chromosphäre eine gelbe Emissionslinie nahe den Natrium-D-Linien, die zu keiner von ihnen
passte; sie hieß fortan D3 und wurde einem Element „Helium" zugeschrieben, das erst 1895 auf der
Erde isoliert wurde. Janssen erkannte, dass er die Linien mit verbreitertem Spalt auch ohne
Finsternis sehen konnte — dasselbe gelang kurz darauf unabhängig Lockyer. Bei den Finsternissen von
1868 und 1869 wurde die erste Koronalinie entdeckt, die man etwa 25 Jahre später einem Element
„Coronium" zuschrieb. Dass die Korona Millionen Kelvin heiß ist, fast tausendmal heißer als die
[Photosphäre](objekt:sun) mit rund 5800 K, ist ein Ergebnis des 20. Jahrhunderts auf der Grundlage
dieser Beobachtungen des 19.; warum sie so heiß ist, bleibt eine der großen offenen Fragen.
Bodengebundene Finsternisbeobachtungen erreichen bis heute Bereiche in Ort, Zeit und Spektrum, die
vom Weltraum aus nicht zugänglich sind ([Pasachoff 2009](literatur:pasachoff-2009)).

Am 29. Mai 1919 maßen zwei britische Expeditionen die Ablenkung des Sternlichts am Sonnenrand.
Einstein sagte 1,75″ voraus, die newtonsche Rechnung 0,87″. Der Vierzöller in Sobral ergab 1,98 ±
0,12″, der Astrograf auf Principe 1,61 ± 0,30″, beides wahrscheinliche Fehler; die Astrografenplatten
von Sobral lieferten je nach Annahme 0,93″ oder 1,52″ und wurden wegen unbestimmter systematischer
Fehler verworfen ([Gilmore und Tausch-Pebody 2022](literatur:gilmore-2022)). Eine Nachmessung der
Platten von 1979 ergab 1,90 ± 0,11″ für den Vierzöller und 1,55 ± 0,34″ für den Astrografen
([Longair 2015](literatur:longair-2015)).

Die Verfinsterungen des Jupitermondes [Io](objekt:io) zeigten als erste, dass Licht Zeit braucht. Im
Protokoll der Pariser Akademie vom 22. August 1676 führt Cassini die beobachtete Ungleichheit
darauf zurück, dass das Licht „zehn oder elf Minuten" für eine Strecke gleich dem halben Durchmesser
der Erdbahn benötige; Rømer trug seine Deutung am 21. November 1676 vor und veröffentlichte sie am
7. Dezember, während Cassini den Gedanken bald wieder verwarf
([Bobis und Lequeux 2008](literatur:bobis-2008)). Der heutige Wert der Lichtzeit für eine
Astronomische Einheit beträgt 8,32 Minuten. Nahe den Tagundnachtgleichen des
[Jupiter](objekt:jupiter) verfinstern und bedecken sich die Galileischen Monde gegenseitig; aus 609
Lichtkurven der Kampagne von 2014/15 folgten Relativpositionen mit einer Streuung von ±24 mas, das
sind 75 km bei Jupiter, bei einer mittleren Abweichung von den Ephemeriden von ±50 mas oder 150 km
([Saquet et al. 2018](literatur:saquet-2018)). Die Kampagne von 2021 fügte 84 Lichtkurven mit
Abweichungen von 49 mas in Rektaszension und 48 mas in Deklination hinzu
([Emelyanov et al. 2022](literatur:emelyanov-2022)).

Von 1985 bis 1990 verdeckten und verfinsterten sich Pluto und [Charon](objekt:charon) gegenseitig
([Proudfoot et al. 2026](literatur:proudfoot-2026)). Aus dieser Serie stammen die erste grobe Karte
der Charon zugewandten Pluto-Hälfte, der Nachweis, dass das Methan des gemeinsamen Spektrums auf
Pluto liegt, die Entdeckung des Wassereises auf Charon, die ersten brauchbaren Radien und die
überraschend hohe mittlere Dichte von rund $2\,\mathrm{g}\,\mathrm{cm}^{-3}$
([Stern et al. 2018a](literatur:stern-2018a)). Auch die Transite von [Merkur](objekt:mercury) und
[Venus](objekt:venus) vor der Sonne gehören hierher: Im 20. Jahrhundert gab es 15 Merkurtransite, im
21. sind es 14, und der „schwarze Tropfen", der die historischen Parallaxenmessungen störte, ließ
sich aus Aufnahmen des Merkurtransits von 1999 in Randverdunklung und instrumentelle
Punktbildfunktion zerlegen ([Schneider et al. 2005](literatur:schneider-2005)). Der Venustransit von
2012 diente als Probe für die Untersuchung erdgroßer Exoplaneten: Kohlendioxid erzeugt im
Ultraviolett ein Signal von rund 20 ppm, die Schwefelsäuretröpfchen des oberen Dunstes eine
Mie-Streuung von etwa 5 ppm bei 0,8 µm ([Ehrenreich et al. 2012](literatur:ehrenreich-2012)).

## Finsternisse bei anderen Planeten

Auf dem Mars zieht [Phobos](objekt:phobos) regelmäßig vor der Sonne vorbei, deckt sie aber nie ganz
ab: Von der Oberfläche aus misst er 0,106° im Winkelradius gegen 0,175° der Sonne und verdeckt damit
gut ein Drittel der Sonnenfläche, Deimos nur ein Hundertstel. Der Lander InSight maß die
Bodentemperatur während solcher Durchgänge. Sie dauern nur 20 bis 35 s, so dass allein die obersten
0,3 bis 0,8 mm merklich abkühlen; für die oberste Schicht von 0,2 bis 4 mm folgte daraus eine
thermische Trägheit von 103 gegen 200 aus dem Tagesgang, jeweils in
$\mathrm{J}\,\mathrm{m}^{-2}\,\mathrm{K}^{-1}\,\mathrm{s}^{-1/2}$
([Mueller et al. 2021](literatur:mueller-2021)).

Bei den Riesenplaneten ist es umgekehrt. Von [Jupiter](objekt:jupiter) aus hat die Sonne nur 0,051°
Winkelradius, die Galileischen Monde dagegen 0,076° bis 0,297°; ihre Schatten tragen daher einen
echten Kernschatten und wandern als scharfe schwarze Flecken über die Wolken. Von Saturn aus misst
die Sonne 0,028°; alle großen Monde übertreffen das, nur Iapetus bleibt mit 0,012° darunter und
wirft lediglich einen Gegenschatten. Ob ein Schatten den Planeten überhaupt trifft, hängt von der
Sonnenhöhe über der Äquatorebene ab, in der die Monde laufen: Ein Mond im Abstand $r$ vom
Planetenmittelpunkt wirft seinen Schatten nur dann auf die Kugel vom Radius $R$, wenn diese Höhe
unter $\arcsin(R/r)$ bleibt. Bei Jupiter mit 3,1° Achsneigung sind das für Io 9,5° und für Kallisto
nur 2,1°: Io wirft immer, Kallisto zeitweise gar nicht. Bei Saturn mit 26,7° Achsneigung reicht das
Fenster von 18,2° bei Mimas bis 2,7° bei Titan, weshalb sich die Schattendurchgänge dort um die
Tagundnachtgleichen häufen.

## Offene Fragen

- **Ursache und Schwankung der Schattenvergrößerung.** Empirisch liegt sie fest: 86,9 ± 0,2 km
  wirksame Schichthöhe im Mittel über 94 Finsternisse, entsprechend 1,88 %, wobei der Prozentsatz
  etwas vom Mondabstand abhängt, die Höhe aber nicht; einzelne Finsternisse weichen deutlich ab, etwa
  90,7 ± 1,2 km am 6. Juli 1982 gegen 82,2 ± 1,0 km am 17. August 1989
  ([Herald und Sinnott 2014](literatur:herald-2014)). Der NASA-Kanon rechnet nach Danjon mit 75 km,
  führt aber Kraterzeiten an, die eher Chauvenets 2 % stützen
  ([Espenak und Meeus 2009](literatur:espenak-2009)). Physikalisch ist die früher angenommene
  absorbierende Schicht nie gemessen worden; ein Modell aus Brechung, Absorption und Fokussierung
  ergibt stattdessen 211 km, verringert durch Ozonabsorption, Wolken und hohes Gelände am Erdrand,
  und möglicherweise setzen Beobachter die Schattengrenze nicht dorthin, wo der Helligkeitsgradient
  am steilsten ist ([Mallama 2021](literatur:mallama-2021)). Diese Arbeit ist ein Vorabdruck; ob der
  Unterschied zwischen 211 km und 87 km an der Atmosphäre oder an der Wahrnehmung liegt, ist offen.
- **Fortschreibung von ΔT.** Der mittlere Gang ist gut bestimmt, die Abweichung von der reinen
  Gezeitenreibung ebenfalls; darüber liegt aber eine Schwankung mit etwa 14 Jahrhunderten Periode
  ([Morrison et al. 2021](literatur:morrison-2021)), und schon die Zerlegung in Gezeiten- und
  Nichtgezeitenanteil hängt an der angenommenen säkularen Beschleunigung des Mondes, die der Kanon
  ausdrücklich als sehr schlecht bekannt und möglicherweise nicht konstant bezeichnet
  ([Espenak und Meeus 2006](literatur:espenak-2006)). Eine Fortschreibung über wenige Jahrhunderte
  hinaus trägt deshalb eine Unsicherheit, die für alte Finsternisse als Längenversatz auf der Karte
  erscheint.
- **Bewertung der Messungen von 1919.** Einem Teil der Literatur gilt die Auswahl der Platten seit
  1980 als voreingenommen; Kennefick hält dagegen, dass nicht Eddington, sondern Dyson die
  Astrografenplatten verwarf, und zwar mit nachvollziehbarer Begründung aus unquantifizierbaren
  systematischen Fehlern ([Kennefick 2009](literatur:kennefick-2009)). Eine Neuauswertung beider
  Analysen kommt zu dem Schluss, die Rechnung von 1919 sei statistisch belastbar, die Kritik von 1980
  dagegen methodisch nicht haltbar; zugleich zeigt sie, dass diese Kritik bis heute von einem Teil
  der Fachliteratur übernommen und von einem anderen zurückgewiesen wird
  ([Gilmore und Tausch-Pebody 2022](literatur:gilmore-2022)). Für die Physik ist die Frage ohne
  Folgen: Die Lichtablenkung wird längst mit anderen Verfahren genauer gemessen
  ([Pasachoff 2009](literatur:pasachoff-2009)).

## Im Modell

- **Suche:** Orrery sucht ausschließlich Mondfinsternisse, rein geozentrisch aus den Bahnen. Die
  Suche tastet vom Startzeitpunkt in Schritten von 0,25 Tagen den Winkel zwischen Mondrichtung und
  Schattenachse ab, verfeinert jedes lokale Minimum — das ist jeweils ein Vollmond — mit dem goldenen
  Schnitt in einem festen Fenster von ±0,5 Tagen auf 10⁻⁴ Tage, also rund 9 s, und sucht Ein- und
  Austritt durch Bisektion. Der Kernschattenradius trägt dabei den Faktor 1,02 nach Chauvenet; der
  Halbschatten kommt nicht vor. Nach drei Jahren ohne Treffer bricht die Suche ab. Sie kennt nur
  „partiell" und „total" und liefert weder Größe noch Gamma noch eine Saros-Nummer; eine reine
  Halbschattenfinsternis meldet sie nie.
- **Genauigkeit:** Gegen den NASA-Katalog findet das Modell 1951 bis 2050 135 der 143
  Kernschattenfinsternisse, das Maximum bis 3,0 h daneben (quadratisches Mittel 1,8 h); acht kleine
  partielle fehlen, und bei drei totalen meldet die Suche eine partielle
  ([Szene: Mondfinsternis](szene:mondfinsternis)). Ursache ist die Kepler-Ellipse ohne periodische
  Störungen: Der Datensatz des [Mondes](objekt:moon) trifft die mittleren Perigäums- und
  Apogäumsabstände (363 359 km und 405 574 km gegen 363 396 km und 405 504 km im Kanon), nicht die
  Extremwerte einzelner Monate.
- **Gezeichnete Schatten:** Die Darstellung wählt für jeden Körper bis zu vier Kugelschatten, für
  einen Planeten seine eigenen Monde, für einen Mond den Mutterkörper und die Geschwister. Die Sonne
  bekommt nie Schattenwerfer, Merkur- und Venustransite erscheinen deshalb nicht. Wo es mehr als vier
  Bewerber gibt, greift die Grenze: Saturn behält Titan, Tethys, Dione und Rhea, so dass Mimas,
  Enceladus und Iapetus dort nie einen Schatten werfen; bei Uranus fällt Oberon weg.
- **Sonnenfinsternisse:** Sie werden nicht gesucht und haben keine Szene, entstehen im Bild aber von
  selbst, weil der Mond Schattenwerfer der Erde ist. Zum Modellmaximum der Finsternis vom 2. August
  2027 sinkt der sichtbare Sonnenanteil auf der Erdoberfläche auf null; der Kernschatten hat dort
  101 km Radius, der Halbschatten 3381 km. Der Zeitpunkt lag in vier geprüften Fällen 0,0 bis 2,1 h
  neben dem NASA-Katalog.
- **Helligkeit im Schatten:** Der Schattenfaktor ist der unverdeckte Flächenanteil zweier gleichmäßig
  hell gerechneter Scheiben; der Gegenschatten ist als eigener Fall enthalten. Eine Randverdunklung
  fehlt: Nach Eddington hielte ein kleiner Körper vor der Scheibenmitte 25 % mehr Licht zurück als
  seine Fläche, am Rand nur die Hälfte. Bei zentraler ringförmiger Bedeckung im mittleren Apogäum
  lässt das Modell 15,1 % des Lichts übrig, mit Eddington-Randverdunklung wären es 10,5 %.
- **Farbe:** Nur die Erde trägt eine Kernschattenfarbe. Der Schatten von Jupiter oder Saturn auf
  einem Mond bleibt deshalb farbneutral und dunkelt nur ab. Der Schattenfaktor wirkt auf das direkte
  Licht, nicht auf das Fülllicht der Nachtseite. All das gilt nur bei eingeschaltetem Schalter
  „Schatten" und eingeblendetem Schattenwerfer. Weitere Vereinfachungen:
  [Grenzen des Modells](thema:modell).

*Stand: September 2026*
