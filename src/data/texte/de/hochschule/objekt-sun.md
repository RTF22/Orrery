# Sonne

Dieser Text behandelt die Sonne als den Stern, der sich im Einzelnen vermessen lässt: Kenngrößen,
das Innere aus Eigenschwingungen und Neutrinos, die Photosphäre, die Atmosphäre bis zur
Heliopause, Rotation und Bewegung um den Schwerpunkt, Alter und Zukunft, die offenen Streitfragen
und das, was Orrery davon abbildet.

## Kenngrößen und Messung

Die IAU-Resolution B3 von 2015 legt Nennwerte fest, die per Definition exakt sind und nur als
Umrechnungsfaktoren dienen, nicht als wahre Eigenschaften der Sonne:
$R_\odot^{\mathrm{N}} = 695700\,\mathrm{km}$, $S_\odot^{\mathrm{N}} = 1361\,\mathrm{W}\,\mathrm{m}^{-2}$,
$L_\odot^{\mathrm{N}} = 3{,}828 \cdot 10^{26}\,\mathrm{W}$, $T_\mathrm{eff}^{\mathrm{N}} = 5772\,\mathrm{K}$
und $GM_\odot^{\mathrm{N}} = 1{,}3271244 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, dieser
gerundet auf die Stellen, in denen TCB- und TDB-kompatible Werte übereinstimmen
([Prša et al. 2016](literatur:prsa-2016)). Die Tabelle nennt die besten Messwerte, denen die
Nennwerte nahe liegen.

| Größe | Wert | Unsicherheit | Verfahren | Beleg |
|---|---|---|---|---|
| $GM_\odot$ (TDB) | $1{,}32712440041 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$ | $1 \cdot 10^{10}\,\mathrm{m}^3\,\mathrm{s}^{-2}$ | Ephemeride DE421; TCB-Tabellenwert mal $1 - L_\mathrm{B}$ | [Petit und Luzum 2010](literatur:petit-2010) |
| $G$ | $6{,}67430 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ | $0{,}00015 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ | 16 Labormessungen, Unsicherheit um den Faktor 3,9 erweitert | [Mohr et al. 2025](literatur:mohr-2025) |
| $M_\odot = GM_\odot/G$ | $1{,}98841 \cdot 10^{30}\,\mathrm{kg}$ | $4{,}5 \cdot 10^{25}\,\mathrm{kg}$ | Quotient der beiden Zeilen darüber | Herleitung |
| $R_\odot$ | $695658\,\mathrm{km}$ | $140\,\mathrm{km}$ | Wendepunkt des Randprofils, auf $\tau_\mathrm{Ross} = 2/3$ umgerechnet | [Haberreiter et al. 2008](literatur:haberreiter-2008); [Prša et al. 2016](literatur:prsa-2016) |
| $S_\odot$ (Minimum 2008) | $1360{,}8\,\mathrm{W}\,\mathrm{m}^{-2}$ | $0{,}5\,\mathrm{W}\,\mathrm{m}^{-2}$ | Radiometer TIM auf SORCE | [Kopp und Lean 2011](literatur:kopp-2011) |
| $L_\odot$ | $3{,}8275 \cdot 10^{26}\,\mathrm{W}$ | $0{,}0014 \cdot 10^{26}\,\mathrm{W}$ | $4\pi\,(1\,\mathrm{au})^2\,S_\odot$ mit dem Mittel von Zyklus 23 | [Prša et al. 2016](literatur:prsa-2016) |
| $T_\mathrm{eff}$ | $5772{,}0\,\mathrm{K}$ | $0{,}8\,\mathrm{K}$ | Stefan-Boltzmann aus $R_\odot$ und $L_\odot$ | [Prša et al. 2016](literatur:prsa-2016) |
| $J_2$ | $2{,}246 \cdot 10^{-7}$ | $0{,}022 \cdot 10^{-7}$ | Merkurbahn aus Entfernungsmessungen zu MESSENGER | [Genova et al. 2018](literatur:genova-2018) |
| $\Delta r/R$ | $9{,}02 \cdot 10^{-6}$ | $0{,}72 \cdot 10^{-6}$ | Randform aus HMI-Rollmanövern 2010 bis 2023 | [Meftah und Mecheri 2025](literatur:meftah-2025) |
| Pol $\alpha_0$, $\delta_0$ | $286{,}13^\circ$, $63{,}87^\circ$ | etwa $0{,}1^\circ$ | IAU-Ausdruck, nur zum Vergleich | [Archinal et al. 2018](literatur:archinal-2018); [Archinal et al. 2011](literatur:archinal-2011) |

Den Radius bestimmen zwei Verfahren: das Helligkeitsprofil am Rand und die Frequenzen der
f-Moden, deren „seismischer" Radius auf optische Tiefe eins umgerechnet wird. Beide wichen um
rund 0,3 Mm voneinander ab. Haberreiter et al. erklären den Unterschied mit dem Höhenabstand
zwischen optischer Tiefe eins in der Scheibenmitte ($\tau_\mathrm{Ross} = 2/3$) und dem Wendepunkt
des Randprofils, 0,333 ± 0,08 Mm: Wegen der Ausdehnung der Photosphäre und der längeren
tangentialen Sehstrahlen erscheint die Scheibe größer. Der Standardradius sinkt damit auf
695,66 Mm ([Haberreiter et al. 2008](literatur:haberreiter-2008)).

Planetenbahnen messen nur das Produkt $GM_\odot$. Die IERS Conventions führen es auf
$7{,}5 \cdot 10^{-11}$ genau; ihr Tabellenwert ist TCB-kompatibel, der TDB-kompatible folgt mit
$L_\mathrm{B} = 1{,}550519768 \cdot 10^{-8}$ ([Petit und Luzum 2010](literatur:petit-2010),
Tabelle 1.1). DE440 schätzt $GM_\odot = 132712440041{,}279419\,\mathrm{km}^3\,\mathrm{s}^{-2}$
([Park et al. 2021](literatur:park-2021), Tabelle 2), der Nennwert weicht davon um
$3 \cdot 10^{-10}$ ab. Die Gravitationskonstante ist dagegen seit Jahrzehnten die am schlechtesten
bekannte der großen Naturkonstanten: Ihre 16 Labormessungen widersprechen einander, ihre
Unsicherheiten werden um den Faktor 3,9 erweitert, und zwischen den Ausgleichungen von 2018 und
2022 kam keine neue hinzu ([Mohr et al. 2025](literatur:mohr-2025)). $G$ ist damit fünf Größenordnungen unsicherer als
$GM_\odot$, und Massen sollen als $GM/G$ mit genanntem $G$ angegeben werden
([Prša et al. 2016](literatur:prsa-2016)). $GM_\odot$ nimmt ab: Aus sieben Jahren
Entfernungsmessungen zu MESSENGER folgt
$\dot{GM}_\odot/GM_\odot = (-6{,}13 \pm 1{,}47) \cdot 10^{-14}$ je Jahr. Erwartet wird ein
Massenverlust durch die Leuchtkraft von $-0{,}679 \cdot 10^{-13}$ je Jahr und durch den Sonnenwind
von $-0{,}2 \cdot 10^{-13}$ bis $-0{,}69 \cdot 10^{-13}$ je Jahr, über die Mission zusammen
$-0{,}9 \cdot 10^{-13}$ bis $-1{,}1 \cdot 10^{-13}$; die Autoren nennen die gemessene, etwas
kleinere Abnahme damit verträglich und begrenzen daraus $|\dot{G}|/G$ auf unter
$4 \cdot 10^{-14}$ je Jahr ([Genova et al. 2018](literatur:genova-2018)). Der Anteil der
Leuchtkraft ist

$$\dot{M}_\odot = \frac{L_\odot}{c^2} = 4{,}26 \cdot 10^{9}\,\mathrm{kg}\,\mathrm{s}^{-1},$$

wie im Faktenblatt ([NSSDC Sun Fact Sheet](quelle:nssdc-sun)), also $6{,}8 \cdot 10^{-14}$ der
Masse je Jahr.

Die Rotation plattet die Sonne nur wenig ab. Aus 23 Rollmanövern von SDO 2010 bis 2023 ergibt die
Randform $\Delta r/R = (9{,}02 \pm 0{,}72) \cdot 10^{-6}$, also 6,28 ± 0,50 km, gegenläufig zur
Aktivität; aus der helioseismisch bestimmten inneren Rotation folgen
$(8{,}40 \pm 0{,}02) \cdot 10^{-6}$, 5,85 ± 0,01 km, gleichläufig um $0{,}05 \cdot 10^{-6}$
schwankend. Die Autoren nennen den Widerspruch beunruhigend
([Meftah und Mecheri 2025](literatur:meftah-2025)). Kuhn et al. fanden die Abplattung nahezu
unabhängig vom Zyklus und deutlich unter der theoretischen Erwartung, erklärbar durch langsamere
differentielle Rotation in den äußeren Prozent des Radius ([Kuhn et al. 2012](literatur:kuhn-2012)). Das Quadrupolmoment
des Schwerefelds ([Innerer Aufbau aus Schwerefeld und Rotation](thema:innerer-aufbau)) folgt aus
der Merkurbahn zu $J_2 = (2{,}246 \pm 0{,}022) \cdot 10^{-7}$; die von Genova et al. tabellierte
helioseismische Bestimmung ergibt $(2{,}20 \pm 0{,}03) \cdot 10^{-7}$
([Genova et al. 2018](literatur:genova-2018)).

Die Bestrahlungsstärke bei 1 AE ist für die [Erde](objekt:earth) die bei weitem größte
Energiequelle, fast $10^{4}$-mal größer als die nächste. Das Radiometer TIM maß im Minimum 2008
$1360{,}8 \pm 0{,}5\,\mathrm{W}\,\mathrm{m}^{-2}$ statt der in den 1990er-Jahren festgelegten
$1365{,}4 \pm 1{,}3\,\mathrm{W}\,\mathrm{m}^{-2}$; ältere Radiometer maßen Streulicht mit, weil
ihre Präzisionsblende hinter der Gesichtsfeldblende sitzt. Vom Minimum zum Maximum steigt das
Monatsmittel um etwa $1{,}6\,\mathrm{W}\,\mathrm{m}^{-2}$, 0,12 %; über eine Sonnenrotation von 27
Tagen kann die Bestrahlungsstärke selbst um mehr als 0,3 % schwanken
([Kopp und Lean 2011](literatur:kopp-2011)).

## Inneres

Ein Standard-Sonnenmodell ist heute kugelsymmetrisch, mit einfacher Behandlung von Diffusion und
Absinken schwerer Teilchen, aktueller Zustandsgleichung, Opazität und Kernreaktionsrate und
einer einfachen Beschreibung der Konvektion nahe der Oberfläche; Mischung im Strahlungsinneren
und Rotation fehlen. Kalibriert wird es so, dass es beim Alter der Sonne deren Masse, Radius,
Leuchtkraft und das heutige Verhältnis $Z/X$ an der Oberfläche trifft. Im Referenzmodell S
betragen die Zentraltemperatur 15,67 MK, die Zentraldichte 153,9 g cm⁻³ und der
Wasserstoffanteil im Zentrum 0,338 ([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021),
Tabelle 2). Das Faktenblatt nennt den [Trägheitsmomentfaktor](thema:innerer-aufbau)
$I/(M R^2) = 0{,}070$ ([NSSDC Sun Fact Sheet](quelle:nssdc-sun)), weit unter 0,4 für eine
homogene Kugel.

Die Frequenzen der Eigenschwingungen machen den Aufbau messbar; dank der Helioseismologie ist er
mit bemerkenswerter Genauigkeit bekannt ([Basu 2016](literatur:basu-2016)). Die Unterseite der
Konvektionszone liegt bei $r = (0{,}713 \pm 0{,}001)\,R_\odot$, die Hülle enthält den
Heliumanteil $Y_\mathrm{s} = 0{,}2485 \pm 0{,}0034$. Das ist deutlich weniger als der Anfangswert
0,271, den die Kalibrierung verlangt, und bestätigt das Absinken von Helium; Modell S erreicht
0,245 ([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Unterhalb der Konvektionszone rotiert die Sonne wie ein starrer Körper; im innersten Kern ist die
Rotation kaum eingeschränkt. In der Konvektionszone ist die Rotationsrate bei fester Breite fast
unabhängig von der Tiefe ([Basu 2016](literatur:basu-2016)), das Strahlungsinnere dreht etwas
langsamer als der Äquator an der Oberfläche
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)). Zwei Scherschichten
trennen die Bereiche: eine nahe der Oberfläche, zwischen der am schnellsten drehenden Schicht bei
etwa $0{,}95\,R_\odot$ und der Oberfläche, und die Tachokline an der Unterseite der
Konvektionszone. Ihr Schwerpunkt liegt etwas unter dieser Grenze, ihre Dicke bei etwa
$0{,}05\,R_\odot$. Ob sie von der Breite abhängt, war strittig: Zwei Auswertungen von 1998 und 1999
fanden keine Abhängigkeit, Charbonneau et al. fanden sie bei 60° Breite um
$(0{,}024 \pm 0{,}004)\,R_\odot$ höher als am Äquator, Basu und Antia 2003 in hohen Breiten etwas
höher und dicker. Ihr wird eine wichtige Rolle im Dynamo zugeschrieben
([Howe 2009](literatur:howe-2009)). Antia und Basu bestätigten 2011 die zu den Polen hin gestreckte
Form und fanden zudem eine mit der Breite wachsende Dicke
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Neutrinos aus den Fusionsreaktionen sind die einzige direkte Sonde des tiefen Inneren. Die
pp-Kette liefert rund 99 % der Energie, der CNO-Zyklus etwa 1 %
([The Borexino Collaboration 2020](literatur:borexino-2020)). Seine Rate wächst etwa mit
$T^{20}$; in Modell S trägt er im Zentrum 11 % zur Energieerzeugung bei, zur Leuchtkraft 1,3 %
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)). Borexino maß die
pp-Neutrinos zu
$(6{,}6 \pm 0{,}7) \cdot 10^{10}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$, im Einklang mit den Modellen,
und aus allen wesentlich beitragenden Reaktionen eine nukleare Leuchtkraft von
$(3{,}89_{-0{,}42}^{+0{,}35}) \cdot 10^{26}\,\mathrm{W}$: Die Sonne erzeugt heute innerhalb von
10 % so viel Energie, wie sie abstrahlt
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)). Neutrinos aus dem
CNO-Zyklus wies Borexino 2020 erstmals nach
([The Borexino Collaboration 2020](literatur:borexino-2020)); der vollständige Datensatz schließt
ihr Fehlen mit etwa 7σ aus und ergibt einen Fluss von
$6{,}6_{-0{,}9}^{+2{,}0} \cdot 10^{8}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$
([Appel et al. 2022](literatur:appel-2022)).

Der empfindlichste Punkt ist die Zusammensetzung. Asplund et al. bestätigen niedrige
Häufigkeiten von C, N und O, für Sauerstoff $\log\varepsilon_\mathrm{O} = 8{,}69 \pm 0{,}04$, und
geben für die heutige Photosphäre $X = 0{,}7438 \pm 0{,}0054$, $Y = 0{,}2423 \pm 0{,}0054$,
$Z = 0{,}0139 \pm 0{,}0006$ und $Z/X = 0{,}0187 \pm 0{,}0009$; das Problem der Sonnenmodelle
bleibe damit bestehen und weise auf Mängel der Opazitäten oder der Mischung unter der
Konvektionszone ([Asplund et al. 2021](literatur:asplund-2021)). Ein Modell mit der
Zusammensetzung von 2009 hat eine Konvektionszone von $0{,}276\,R_\odot$ Tiefe statt
$0{,}287\,R_\odot$ und $Y_\mathrm{s} = 0{,}235$ statt 0,2485
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021), Tabelle 6).

## Oberfläche

Als Oberfläche gilt die Photosphäre, die Schicht, aus der die meisten Photonen entweichen. Das
Faktenblatt nennt etwa 500 km Dicke, 6600 K an der Unter- und 4400 K an der Oberseite und
125 mbar Druck bei optischer Tiefe eins ([NSSDC Sun Fact Sheet](quelle:nssdc-sun)).

Das Bild der Photosphäre prägt die Granulation: helle, heiße Aufströme, umgeben von dunklen,
kühleren Abströmen, mit Durchmessern von typisch 1 Mm, angetrieben durch Abkühlung in einer dünnen
Grenzschicht an der sichtbaren Oberfläche. Ein Aufstrom braucht etwa 2 km s⁻¹, um die Abstrahlung
zu decken, und die waagerechten Geschwindigkeiten können die Schallgeschwindigkeit von etwa
7 km s⁻¹ kaum übersteigen; das begrenzt Granulen auf etwa 4 Mm. Bei mittlerer optischer Tiefe
eins sind die Aufströme mit rund 10 000 K fast doppelt so heiß wie die Abströme mit rund 6000 K.
Meso- und Supergranulation mit 5 bis 10 und 20 bis 50 Mm sind eher Ausschnitte eines stetigen
Spektrums als eigene Skalen ([Nordlund et al. 2009](literatur:nordlund-2009)).

Zum Rand hin wird die Scheibe dunkler, weil der schräge Sehstrahl in höheren, kühleren Schichten
optische Tiefe eins erreicht. In der Eddington-Näherung einer grauen Atmosphäre gilt mit
$\mu = \cos\theta$

$$\frac{I(\mu)}{I(1)} = \frac{2 + 3\mu}{5},$$

am Rand also 40 % der Mittenhelligkeit. Dreidimensionale Simulationen der Konvektion geben die
beobachtete Randverdunklung sehr gut wieder
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Sonnenflecken sind magnetische Flussröhren; die beiden von Borrero und Ichimoto ausgewerteten
Flecken zeigen senkrechte Röhren von 30 bis 40 Mm Durchmesser. Im Zentrum ist das Feld am
stärksten und steht senkrecht, nach außen wird es schwächer und flacher; es erreichte etwa
3300 G im großen und 2900 G im kleinen Fleck. Hale
schätzte 1908 aus der Zeeman-Aufspaltung 2600 bis 2900 G, der erste Nachweis eines Magnetfelds
außerhalb der Erde ([Borrero und Ichimoto 2011](literatur:borrero-2011)).

## Atmosphäre und Magnetosphäre

Über der Photosphäre liegt die Chromosphäre, etwa 2500 km dick, an ihrer Oberseite rund 30 000 K
heiß ([NSSDC Sun Fact Sheet](quelle:nssdc-sun)). In stationären Modellen gleichen sich unter
$10^{4}\,\mathrm{K}$ Heizung und Abstrahlung aus; sinkt die Dichte so weit, dass die Abstrahlung
die Heizung nicht mehr ausgleicht, folgt ein rascher Übergang zu koronalen Temperaturen, bei dem
die Wärmeleitung mitwirkt, die Übergangsregion. Heutige Satelliteninstrumente sind vor allem für
das hellere Plasma von 1 bis 3 MK empfindlich
([Cranmer und Winebarger 2019](literatur:cranmer-2019)). Die Korona verliert durch Strahlung und
Wärmeleitung etwa $10^{7}\,\mathrm{erg}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$ in aktiven Regionen und
$3 \cdot 10^{5}\,\mathrm{erg}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$ in der ruhigen Sonne, und die
Energie stammt aus Bewegungen in und unter der Photosphäre
([Klimchuk 2006](literatur:klimchuk-2006)). Das sind $10^{4}$ und $300\,\mathrm{W}\,\mathrm{m}^{-2}$
gegen $6{,}29 \cdot 10^{7}\,\mathrm{W}\,\mathrm{m}^{-2}$, die die Photosphäre abstrahlt. Das
Verschieben der Fußpunkte durch die Granulation mit etwa 1 km s⁻¹ bei einem koronalen Feld von
50 G liefert einen Energiefluss von etwa 20 kW m⁻². Wie er in Wärme umgesetzt wird, teilte die
Fachwelt historisch in zwei Schulen: Dissipation von Wellen gegen Verflechtung der Feldlinien mit
vielen kleinen Energiefreisetzungen; die Übersicht führt zudem Modelle der Turbulenz und der
Taylor-Relaxation ([Cranmer und Winebarger 2019](literatur:cranmer-2019)).

Die Korona geht in den Sonnenwind über: langsamer, dichter Wind mit 250 bis 450 km s⁻¹ und
schneller, dünner mit 500 bis 800 km s⁻¹; Ströme aus großen koronalen Löchern erreichen bei 1 AE
700 bis 900 km s⁻¹; der langsame Wind hat mehrere Quellen, etwa aktive Regionen und die Ränder
koronaler Löcher ([Cranmer und Winebarger 2019](literatur:cranmer-2019)). Am 28. April 2021 um 09:33 UT tauchte
Parker Solar Probe 13 Millionen km über der Photosphäre für fünf Stunden unter die Alfvén-Fläche
in Plasma, in dem der magnetische Druck den Druck von Ionen und Elektronen übertraf; die
Alfvén-Machzahl betrug 0,79 ([Kasper et al. 2021](literatur:kasper-2021)). Aus den
Messungen der Sonde wuchs der über die Länge gemittelte Alfvén-Radius mit der Aktivität von 11
auf 16 $R_\odot$ und das bremsende Drehmoment des Winds von $1{,}4 \cdot 10^{23}$ auf
$3 \cdot 10^{23}\,\mathrm{N}\,\mathrm{m}$; die Fläche ist stark strukturiert und 30 % größer als in
Simulationen mit gleichem Massenverlust und offenem Fluss
([Finley 2025](literatur:finley-2025)).

Der Wind bläst die Heliosphäre auf. Am 25. August 2012 bei 122 AE verschwanden an Voyager 1 die
Ionen aus der Heliosphäre, und die galaktische kosmische Strahlung stieg sprunghaft, doch das
Magnetfeld deutete noch auf die Heliosphäre ([Stone et al. 2013](literatur:stone-2013)). Den
Übertritt belegten erst Plasmaschwingungen bei 2,6 kHz ab dem 9. April 2013, entsprechend etwa
0,08 Elektronen je cm³ wie im interstellaren Medium erwartet, gegen etwa 0,002 in der äußeren
Heliosphäre ([Gurnett et al. 2013](literatur:gurnett-2013)). Voyager 2 kreuzte die Heliopause am
5. November 2018 bei 119 AE ([Stone et al. 2019](literatur:stone-2019)).

Das Magnetfeld ordnet den Zyklus. Nach Hales Polaritätsgesetzen haben vorangehender und
folgender Fleck einer Gruppe entgegengesetzte Polarität, die Gruppen beider Halbkugeln ebenfalls,
und mit jedem Zyklus kehrt sich die Polarität um. Nach dem Gesetz von Joy liegt der folgende Fleck
weiter vom Äquator entfernt; sein Fluss wandert polwärts und kehrt die Polfelder um das Maximum
herum um, sodass ein magnetischer Zyklus zwei Fleckenzyklen umfasst. Zu Beginn eines Zyklus
liegt der Schwerpunkt der Fleckenfläche bei etwa 28° Breite; er wandert zum Äquator und kommt bei
etwa 7° zum Stehen. Die Zyklen 1 bis 22 dauerten im Mittel 131,7 Monate, fast genau elf Jahre
([Hathaway 2015](literatur:hathaway-2015)). Das 13-monatige gleitende Mittel
der Fleckenzahl erreichte in Zyklus 24 im April 2014 116,4 und in Zyklus 25 im Oktober 2024 160,9
([SILSO World Data Center 2026](literatur:silso-2026)).

## Bahn, Rotation und Dynamik

Die Oberfläche rotiert differentiell. Das Faktenblatt gibt die siderische Rate mit der
heliographischen Breite $B$ als

$$\omega = \left(14{,}37 - 2{,}33\,\sin^2 B - 1{,}56\,\sin^4 B\right)^\circ\,\mathrm{d}^{-1}$$

an ([NSSDC Sun Fact Sheet](quelle:nssdc-sun)); am Äquator dauert eine Umdrehung 25,05 Tage, bei
60° Breite 30,65 und an den Polen 34,35 Tage. Magnetische Strukturen drehen schneller als das
Plasma: Nach den Messungen von Snodgrass gilt für sie
$462 - 74\,\sin^2 B - 53\,\sin^4 B$ nHz, für die Doppler-Messung des Plasmas
$452 - 49\,\sin^2 B - 84\,\sin^4 B$ nHz; als Erklärung gilt, dass die Strukturen tiefer verankert
sind, wo die Rotation schneller ist ([Howe 2009](literatur:howe-2009)).

Das [IAU-Rotationsmodell](thema:bezugssysteme) gibt für die Sonne
$W = 84{,}176^\circ + 14{,}1844000^\circ\,d$, für die Lichtlaufzeit korrigiert und seit dem
Bericht von 2009 unverändert ([Archinal et al. 2018](literatur:archinal-2018), Tabelle 1); die
Ausdrücke für Sonne und Erde sind nur zum Vergleich gedacht
([Archinal et al. 2011](literatur:archinal-2011)). Die Rate ergibt 25,380 Tage oder 609,12 Stunden
siderisch, die herkömmliche siderische Periode des Systems von Carrington
([Gonzalez 2025](literatur:gonzalez-2025)), und von der bewegten Erde aus 27,275 Tage synodisch. Nach dem
Gesetz des Faktenblatts dreht die Oberfläche bei 16,0° Breite mit dieser Rate, nach dem Gesetz für
magnetische Strukturen bei 16,1°; das Plasma dreht nach der Doppler-Messung selbst am Äquator mit
14,06° je Tag langsamer. Der Pol bei $\alpha_0 = 286{,}13^\circ$, $\delta_0 = 63{,}87^\circ$ hat
keine Raten; gegen die Ekliptik J2000 ist der Sonnenäquator um 7,25° geneigt, sein aufsteigender
Knoten liegt bei 75,77° ekliptikaler Länge.

Die Sonne ruht nicht. Mit den Positionen und Massen aus Orrerys Datensätzen lag ihr Mittelpunkt
1800 bis 2050 zwischen 0,06 und 2,11 $R_\odot$ vom Schwerpunkt des Sonnensystems entfernt, im
Mittel 1,21 $R_\odot$, und bewegte sich ihm gegenüber mit 8,5 bis 16,1 m s⁻¹.
[Jupiter](objekt:jupiter) allein verschiebt den Schwerpunkt um 1,07 $R_\odot$. Die größten
Annäherungen an den Schwerpunkt folgen im Mittel alle 19,86 Jahre, der synodischen Periode von
Jupiter und Saturn; einen vermuteten Zusammenhang dieser Bewegung mit der Aktivität nennen
Perryman und Schulze-Hartung unbewiesen
([Perryman und Schulze-Hartung 2011](literatur:perryman-2011)). Die Draufsicht
[Das System von oben](szene:systemblick) zeigt die Planeten um die ruhende Sonne.

## Entstehung und Entwicklung

[Kalzium-Aluminium-reiche Einschlüsse](thema:entstehung) in Meteoriten entstanden vor
$4567{,}30 \pm 0{,}16$ Millionen Jahren ([Connelly et al. 2012](literatur:connelly-2012)).
Christensen-Dalsgaard setzt das Alter der Meteoriten vereinfachend mit der Ankunft der Sonne auf
der Hauptreihe gleich, weil die Planetenbildung wahrscheinlich nicht länger dauerte als die
Kontraktion des Sterns. Die Helioseismologie liefert ein unabhängiges Alter, das an der
Zusammensetzung hängt: Mit der älteren, metallreichen passt das beste Modell mit 4,57 Milliarden
Jahren zum Meteoritenalter, mit der von 2009 ergibt sich 4,77 Milliarden, deutlich im Widerspruch
dazu ([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Weil Wasserstoff im Kern zu Helium wird, steigt die mittlere Teilchenmasse, und die Leuchtkraft
wächst. Bei der Ankunft auf der Hauptreihe vor 4,57 Milliarden Jahren lag sie nach
Standardmodellen etwa 30 % unter dem heutigen Wert; außer für die ersten 0,2 Milliarden Jahre gilt
näherungsweise

$$\frac{L(t)}{L_\odot} = \frac{1}{1 + \frac{2}{5}\left(1 - \frac{t}{t_\odot}\right)}$$

mit dem heutigen Alter $t_\odot$ ([Feulner 2012](literatur:feulner-2012)). Eine Änderung um 30 %
des heutigen Werts verschiebt nach der Strahlungsbilanz die Oberflächentemperatur der Erde um rund
20 K ([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)). Für die frühe Erde sagen
Sternmodelle eine um etwa 25 % geringere Einstrahlung voraus; ohne Ausgleich wäre sie in den
ersten zwei Milliarden Jahren gefroren, doch im Archaikum gab es flüssiges Wasser und Leben. Die
meisten Lösungen setzen auf mehr Treibhausgase, alle haben erhebliche Schwierigkeiten, und das
Problem der schwachen jungen Sonne gilt als ungelöst ([Feulner 2012](literatur:feulner-2012)).
Andere Vorschläge sind weniger Wolken, ein stärkerer junger Sonnenwind, der kosmische Strahlung
und damit Wolkenbildung dämpfte, oder eine anfangs massereichere Sonne
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Nach dem Ende des Wasserstoffbrennens im Kern steigt die Sonne als Roter Riese auf über 2000
Sonnenleuchtkräfte. Bei etwa 80 MK zündet Helium im entarteten Kern in einem Heliumblitz. Ihre
Hülle stößt sie nach diesen Modellen mit etwa 12,4 Milliarden Jahren ab, 7,8 Milliarden Jahre
nach heute; zurück bleibt ein heißer, kompakter Kern aus Kohlenstoff und Sauerstoff, der als
Weißer Zwerg abkühlt. Rechnungen von Schröder und Smith mit Massenverlust, Gezeitenwirkung und
Reibung in der Sonnenatmosphäre ergeben, dass Planeten mit heutigem Abstand unter etwa 1,15 AE an
der Spitze des Riesenasts verschluckt werden, die Erde also wahrscheinlich auch
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

## Offene Fragen

- **Heizung der Korona:** Die Fe-XIX-Linie, die sich bei 8,9 MK bildet, ist in einer aktiven
  Region überall schwach vorhanden; das spricht für seltene Heizereignisse, etwa kleine
  Rekonnexionen (Nanoflares). Koronaler Regen dagegen verlangt nahezu stetige Heizung an den
  Fußpunkten, wie sie Wellenmodelle erwarten; die Prozesse, die Korona und Wind heizen und
  beschleunigen, sind nicht eindeutig bestimmt
  ([Cranmer und Winebarger 2019](literatur:cranmer-2019)). Ein gemessener Fluss von Alfvén-Wellen
  reicht für aktive Regionen nur, wenn er fast vollständig in die Korona gelangt
  ([Klimchuk 2006](literatur:klimchuk-2006)).
- **Häufigkeitsproblem:** Magg et al. bestimmen $Z/X = 0{,}0225$ und finden, dass Modelle damit
  die Helioseismologie wieder treffen ([Magg et al. 2022](literatur:magg-2022)); Asplund et al.
  bleiben bei 0,0187 ([Asplund et al. 2021](literatur:asplund-2021)). Buldgen et al. zeigen, dass
  metallreiche Modelle, die zugleich die Verarmung an Lithium wiedergeben, mit Seismologie und
  Neutrinos in Spannung geraten ([Buldgen et al. 2023](literatur:buldgen-2023)), und leiten aus
  der Seismologie eine um etwa 10 % höhere Opazität bei rund 2 MK ab, als die Modelle verwenden
  ([Buldgen et al. 2025](literatur:buldgen-2025)). Die CNO-Neutrinos stehen mit etwa 2σ gegen
  die metallarme Zusammensetzung; zusammen mit ⁷Be und ⁸B benachteiligen sie das metallarme
  Standardmodell mit 3,1σ ([Appel et al. 2022](literatur:appel-2022)).
- **Stärke des Zyklus:** Die physikalischen Vorhersagen für Zyklus 25 liefen auf
  110,5 ± 13,5 zusammen ([Nandy 2021](literatur:nandy-2021)); McIntosh et al. erwarteten aus den
  Abständen der „Terminator"-Ereignisse einen Zyklus unter den stärksten seit Beginn der
  Aufzeichnungen ([McIntosh et al. 2020](literatur:mcintosh-2020)). Mit 160,9
  ([SILSO World Data Center 2026](literatur:silso-2026)) lag er dazwischen. Die Polfelder im
  Minimum dienen als Vorzeichen; Tobias et al. halten den Dynamo dagegen für deterministisch
  chaotisch und damit grundsätzlich unvorhersagbar ([Hathaway 2015](literatur:hathaway-2015)).
- **Abplattung und junge Sonne:** Randform und seismische Rechnung widersprechen sich im Betrag
  und im Gang mit der Aktivität ([Meftah und Mecheri 2025](literatur:meftah-2025)); für die
  schwache junge Sonne gilt keine Lösung als gesichert ([Feulner 2012](literatur:feulner-2012)).

## Im Modell

- **Ort:** Orrery setzt die Sonne fest in den Ursprung und rechnet alle Bahnen heliozentrisch,
  passend zu den heliozentrischen Elementen; die Lage der Körper zur Sonne stimmt damit im Rahmen
  der Tafeln. Der Schwerpunkt, um den die Sonne bis zu 2,1 $R_\odot$ oder 1,47 Millionen km
  pendelt, kommt nicht vor.
- **Rotation:** Die Sonne dreht starr mit der Periode des Datensatzes, 609,12 h, der
  Carrington-Rate bis auf $3 \cdot 10^{-6}$ Grad je Tag, also wie die Oberfläche bei 16° Breite;
  Äquator und Pole drehen nicht verschieden. Die Phase ist zur Epoche null und zählt von der
  Richtung, in die die Ausrichtung der Kugel die Kartenmitte bringt, 21,8° westlich des Knotens
  $Q$. Der Nullmeridian liegt damit 106,0° hinter dem IAU-Nullmeridian mit
  $W_0 = 84{,}176^\circ$. Weil die Karte keine echten Strukturen zeigt, ist das nicht zu sehen,
  heliographische Längen im Modell weichen aber um diesen Winkel ab.
- **Pol:** Er steht fest bei den IAU-Werten, die für die Sonne keine Raten haben; die Umrechnung
  in die Ekliptik nutzt die Schiefe 84 381,448″.
- **Masse und GM:** Der Datensatz führt $1{,}9885 \cdot 10^{30}\,\mathrm{kg}$; mal $G$ nach CODATA
  2018 ergibt das $1{,}327185 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, 45 ppm über dem
  Nennwert und DE440. Mit den $1{,}9884 \cdot 10^{30}\,\mathrm{kg}$ des heutigen Faktenblatts wären
  es 5 ppm darunter. Die Kepler-Umlaufzeiten im Datenblock werden dadurch um rund 23 ppm zu kurz.
- **Datenblock:** Der Durchmesser 1 391 400 km ist der doppelte Nennradius, den auch der Bericht
  der IAU-Arbeitsgruppe von 2015 als Sonnenradius führt
  ([Archinal et al. 2018](literatur:archinal-2018), Tabelle 4); der gemessene Radius ergäbe
  1 391 316 ± 280 km. Die Rotationsperiode 25,4 Tage ist die siderische Carrington-Periode,
  weder die synodische von 27,3 Tagen noch die am Äquator. Die Achsneigung 7,3° ist der gerundete
  Winkel von 7,252° zwischen Pol und Ekliptiknormale. Masse (1,99 · 10³⁰ kg) und Pol (286,13°,
  63,87°) stehen wie im Datensatz.
- **Größe:** Der dargestellte Radius ist $R_\odot$ mal Größenfaktor mal dem Wert des Reglers
  „Sonne dämpfen" (0,1 bis 1): in „Realistisch" 1-fach, in „Schaubild" $50 \cdot 0{,}35 = 17{,}5$-fach
  (0,081 AE), in „Kompakt" $200 \cdot 0{,}2 = 40$-fach (0,186 AE), gegenüber den Planeten also
  2,9- beziehungsweise 5-mal verkleinert. Ungedämpft reichte sie in „Kompakt" bis 0,93 AE, über die
  am 19. September 2026 dargestellten Orte von Merkur (0,73 AE) und Venus (0,88 AE) hinaus. In
  „Schaubild" erscheint sie von der Erde aus 9,3° groß statt 0,53° und in der Szene
  [Von Neptun zur fernen Sonne](szene:ferne-sonne) 1,2° statt 64″.
- **Aussehen:** Die Sonne ist ein unbeleuchtetes Material mit der Karte als Farbtextur. Weil der
  Wechsel der Grundfarbe auf Weiß nur für beleuchtete Körper läuft, bleibt die Ausweichfarbe
  #fdb813 als Faktor stehen: Das lineare Kartenmittel (0,874, 0,246, 0,034) wird zu (0,859,
  0,118, 0,0002), nach Tonwertkurve und sRGB rund (237, 112, 21) von 255 vor dem Lichtkranz; die
  Scheibe erscheint kräftig orange, Blau fehlt fast ganz. Die künstlerische Karte hat am Äquator
  2134 km je Pixel, zeigt also weder Granulation noch Flecken; Randverdunklung fehlt.
  Helligkeitsregler und Belichtung wirken nicht auf die Sonne. Nur sie bekommt den Lichtkranz
  (Schalter „Leuchten"), je nach Qualitätsstufe mit der Stärke 0,7 oder 1,1, in der niedrigsten
  gar nicht.
- **Licht:** Ein weißes Punktlicht sitzt im dargestellten Sonnenmittelpunkt und fällt im
  Standard mit dem Quadrat des dargestellten Abstands ab (Regler „Lichtabfall"); bei 1 AE ist die
  Bestrahlung auf Helligkeit mal Belichtung geeicht. Belichtung und Distanzausgleich beschreibt
  [Albedo und Helligkeit](thema:photometrie).
- **Schatten:** Die Schattenrechnung nimmt die Sonne als gleichmäßig helle Scheibe mit dem echten
  Winkelradius aus echtem Radius und Abstand und zählt den verdeckten Flächenanteil. Mit der
  Randverdunklung nach Eddington hielte ein kleiner Körper vor der Scheibenmitte 25 % mehr Licht
  zurück, als seine Fläche ausmacht, am Rand nur die Hälfte
  ([Finsternisse](thema:finsternis)).
- Die Bestrahlungsstärke in W m⁻² und ihre Schwankung, Zyklus, Flecken, Korona, Wind und
  Heliosphäre rechnet Orrery nicht; die Beleuchtung nutzt nur die Bestrahlung relativ zu 1 AE.
  Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
