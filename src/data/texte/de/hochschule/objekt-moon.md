# Mond

Dieser Text behandelt den Mond als geodätisch und seismisch vermessenen Körper: Kenngrößen aus
Schwerefeld und Laserentfernungen, das Innere, Oberfläche und Probenalter, Exosphäre und
erloschenen Dynamo, die von der Sonne gestörte Bahn samt Cassini-Gesetzen, die Entstehung, die
offenen Streitfragen und das, was Orrery davon abbildet.

## Kenngrößen und Messung

Den Massenparameter liefern Ephemeriden, die Laserentfernungen zum Mond gemeinsam mit
interplanetaren Entfernungsmessungen ausgleichen: Der Erdmittelpunkt läuft um den
Erde-Mond-Schwerpunkt, und diese Bewegung verrät den Bahnen von Raumsonden das Massenverhältnis.
Masse und mittlere Dichte sind dagegen nur so genau wie die Gravitationskonstante $G$
([Williams et al. 2014](literatur:williams-2014)). Die Tabelle nennt die Werte dieser Auswertung;
die Schwerekoeffizienten beziehen sich auf den Referenzradius $R = 1738\,\mathrm{km}$.

| Größe | Wert | Unsicherheit | Verfahren | Beleg |
|---|---|---|---|---|
| $GM$ | $4902{,}80007\,\mathrm{km}^3\,\mathrm{s}^{-2}$ | $0{,}00014\,\mathrm{km}^3\,\mathrm{s}^{-2}$ | Ephemeride DE430: Laserentfernungen und interplanetare Daten | [Williams et al. 2014](literatur:williams-2014) |
| $M$ | $7{,}34630 \cdot 10^{22}\,\mathrm{kg}$ | $0{,}00088 \cdot 10^{22}\,\mathrm{kg}$ | $GM/G$ mit $G$ nach CODATA 2010 | [Williams et al. 2014](literatur:williams-2014) |
| mittlerer Radius | $1737{,}151\,\mathrm{km}$ | unter 1 m | Laserhöhenmessung von LRO | [Williams et al. 2014](literatur:williams-2014) |
| $\bar{\rho}$ | $3345{,}56\,\mathrm{kg}\,\mathrm{m}^{-3}$ | $0{,}40\,\mathrm{kg}\,\mathrm{m}^{-3}$ | aus Masse und Radius | [Williams et al. 2014](literatur:williams-2014) |
| $J_2$ | $203{,}30517 \cdot 10^{-6}$ | $0{,}00070 \cdot 10^{-6}$ | GRAIL, Feld GL0660B, mit bleibender Gezeit | [Williams et al. 2014](literatur:williams-2014) |
| $C_{22}$ | $22{,}42635 \cdot 10^{-6}$ | $0{,}00022 \cdot 10^{-6}$ | wie $J_2$ | [Williams et al. 2014](literatur:williams-2014) |
| $\beta = (C - A)/B$ | $631{,}0213 \cdot 10^{-6}$ | $0{,}0031 \cdot 10^{-6}$ | physische Libration aus Laserentfernungen | [Williams et al. 2014](literatur:williams-2014) |
| $\gamma = (B - A)/C$ | $227{,}7317 \cdot 10^{-6}$ | $0{,}0042 \cdot 10^{-6}$ | wie $\beta$ | [Williams et al. 2014](literatur:williams-2014) |
| $I_\mathrm{s}/(M R^2)$ | $0{,}392728$ | $0{,}000012$ | fester Mond ohne flüssigen Kern; $J_2$, $C_{22}$, $\beta$, $\gamma$ kombiniert | [Williams et al. 2014](literatur:williams-2014) |
| $k_2$ | $0{,}02416$ | $0{,}00022$ | GRAIL, Mittel zweier Auswertungen, Periode 1 Monat | [Williams et al. 2014](literatur:williams-2014) |
| $Q$ | $37{,}5$ | $4$ | Laserentfernungen, Periode 1 Monat | [Williams et al. 2014](literatur:williams-2014) |

Der Kartenradius der IAU, 1737,4 km, dient Kartenmaßstab und Höhenbezug
([Archinal et al. 2018](literatur:archinal-2018), Tabelle 5); er liegt 249 m über dem
gemessenen Mittel.

Das Schwerefeld stammt aus der Primärmission von GRAIL: Zwei Sonden maßen ihre gegenseitige
Geschwindigkeit auf etwa 0,03 µm/s genau, und das Feld GL0660B reicht bis Grad 660; bis Grad 330
ist es zu 98 % kohärent mit der Topographie, die Bahnen der Sonden sind auf 20 cm bestimmt, und
die Unsicherheit von $k_2$ sank auf ein Fünftel ([Konopliv et al. 2013](literatur:konopliv-2013)).
In einem Feld bis Grad 420 gehen zwischen Grad 80 und 300 über 98 % des Signals auf die
Topographie zurück, Zeichen einer stark zerbrochenen Kruste, die das Relief der Krater bewahrt
([Zuber et al. 2013](literatur:zuber-2013)). Über den großen Einschlagsbecken zeigt das Feld ein
Zielscheibenmuster: in der Mitte eine positive Anomalie, die Massenkonzentration (Mascon), umgeben
von einem negativen Ring und einem positiven Außenring. Es entsteht durch Aushub und Einsturz des
Beckens, isostatischen Ausgleich und das Abkühlen und Schrumpfen eines großen Schmelzsees
([Melosh et al. 2013](literatur:melosh-2013)).

Die Koeffizienten zweiten Grades hängen an den Hauptträgheitsmomenten $A < B < C$:

$$J_2 = \frac{C - (A + B)/2}{M R^2}, \quad C_{22} = \frac{B - A}{4 M R^2}$$

Für einen gebunden rotierenden Körper im hydrostatischen Gleichgewicht gilt

$$J_2 = \frac{5}{6}\,k_\mathrm{f}\,q, \quad C_{22} = \frac{1}{4}\,k_\mathrm{f}\,q, \quad q = \frac{n^2 R^3}{GM}$$

mit mittlerer Bewegung $n$ und fluider Love-Zahl $k_\mathrm{f}$, die über Radau-Darwin am
Trägheitsmoment hängt; Rotation und Gezeit zusammen ergeben das Verhältnis $J_2/C_{22} = 10/3$
(Herleitung und Grenzen unter [Innerer Aufbau](thema:innerer-aufbau)). Mit $q = 7{,}59 \cdot 10^{-6}$
und $k_\mathrm{f} = 1{,}43$ aus dem gemessenen Trägheitsmoment wären $J_2 = 9{,}07 \cdot 10^{-6}$ und
$C_{22} = 2{,}72 \cdot 10^{-6}$ zu erwarten; gemessen sind das 22- und das 8-Fache bei einem
Verhältnis von 9,07. Dass die Verformung für die heutige Bahn und Drehung viel zu groß ist, ist seit
Laplace bekannt; man deutet sie als fossile Figur, eingefroren, als der Mond der Erde näher stand.
Die gemessene Figur passt allerdings nur zu einer exzentrischen, nicht synchronen Bahn. Keane und
Matsuyama ziehen die Beiträge der Mascons und Becken ab; übrig bleibt eine gekippte fossile Figur,
die zu einer frühen synchronen Bahn kleiner Exzentrizität passt und zu einer Polwanderung von etwa
15°, ausgelöst durch das Südpol-Aitken-Becken ([Keane und Matsuyama 2014](literatur:keane-2014)).
Garrick-Bethell et al. führen den Großteil der Topographie zweiten Grades auf frühe Gezeitenheizung
beim Krustenaufbau zurück, den Rest auf eine Gezeiten- und Rotationsbeule, die bei etwa 32
Erdradien erstarrte; die Polachse sei danach um $36 \pm 4^\circ$ gewandert
([Garrick-Bethell et al. 2014](literatur:garrick-bethell-2014)).

Das mittlere Trägheitsmoment folgt erst aus der Verbindung zweier Verfahren: GRAIL liefert $J_2$
und $C_{22}$, die Laserentfernungen die Verhältnisse $\beta$ und $\gamma$ aus der Drehung
([Williams et al. 2014](literatur:williams-2014)). Bei der Mond-Laserentfernungsmessung laufen
kurze Laserpulse zu je einem Reflektor und zurück; aus der Laufzeit wurde die Entfernung anfangs auf
einige Dezimeter, bis 2013 auf wenige Millimeter bestimmt, relativ $10^{-9}$ bis $10^{-11}$. Damals
standen fünf Reflektoren zur Verfügung, drei von Apollo und zwei von Lunochod, und das beste Modell
ließ gewichtete Restabweichungen von etwa 18 mm; Venus und Jupiter stören den Erde-Mond-Abstand um
rund 1 km ([Murphy 2013](literatur:murphy-2013)). Aus denselben Daten kommen Abplattung und Reibung des
flüssigen Kerns und die Gezeitenreibung im Mond; $k_2$ und $Q$ ordnet das Thema
[Gezeiten](thema:gezeiten) ein.

## Inneres

Die Hochlandkruste hat nach GRAIL eine Gesamtdichte von nur 2550 kg/m³. Mit Proben- und
Fernerkundungsdaten folgt eine mittlere Porosität von 12 % bis in mindestens einige Kilometer Tiefe,
und die Kruste ist im Mittel 34 bis 43 km dick statt der zuvor angenommenen etwa 50 km
([Wieczorek et al. 2013](literatur:wieczorek-2013)). Im Becken Moscoviense auf der Rückseite ist sie
weniger als 1 km dünn, an den Landestellen von Apollo 12 und 14 30 km dick. Die Dichte schwankt
seitlich um ±250 kg/m³; am dichtesten ist das Südpol-Aitken-Becken, dessen Gestein deutlich
mafischer ist als die Anorthosite der Umgebung.

Tiefe Mondbeben liegen um 900 km Tiefe; was darunter liegt, blieb nach den Apollo-Daten weitgehend
offen. Das Referenzmodell VPREMOON bestimmt den Kernradius aus an ihm reflektierten Scherwellen zu
$380 \pm 40\,\mathrm{km}$ bei einer mittleren Kerndichte von $5200 \pm 1000\,\mathrm{kg}\,\mathrm{m}^{-3}$;
dass nur horizontal polarisierte Scherwellen reflektiert erscheinen, spricht für einen flüssigen
äußeren Kern ([Garcia et al. 2011](literatur:garcia-2011)). Eine Neuauswertung derselben
Seismogramme mit Verfahren der Array-Seismologie fand einen festen inneren und einen flüssigen
äußeren Kern unter einer teilweise geschmolzenen Grenzschicht, dem Volumen nach zu rund 60 %
flüssig und mit weniger als 6 Gewichtsprozent leichter Elemente
([Weber et al. 2011](literatur:weber-2011)).

Die Drehung des Mondes bestätigt den flüssigen Kern: Reibung an seinen Grenzen verschiebt die
Orientierung des Mantels messbar, der Parameter $K/C = (1{,}64 \pm 0{,}17) \cdot 10^{-8}$ je Tag ist
fast zehnfach über seiner Unsicherheit bestimmt, und die Kernabplattung ergibt sich zu
$(2{,}46 \pm 1{,}4) \cdot 10^{-4}$. Modelle, die Dichte, Trägheitsmoment und $k_2$ zugleich treffen,
haben einen flüssigen äußeren Kern von 200 bis 380 km Radius, einen festen inneren Kern von 0 bis
280 km und darüber eine Zone niedriger Scherwellengeschwindigkeit; der ganze Kern trägt höchstens
1,5 % der Masse ([Williams et al. 2014](literatur:williams-2014)). Ein erweitertes dynamisches
Modell der Laserentfernungen fand eine Abplattung der Kern-Mantel-Grenze von
$(2{,}2 \pm 0{,}6) \cdot 10^{-4}$, hydrostatisch für einen Radius von 381 ± 12 km und einen
Kernanteil von 1,59 bis 1,77 % der Masse, also dagegen mehr als diese Obergrenze
([Viswanathan et al. 2019](literatur:viswanathan-2019)).
Ob die Grenzschicht tatsächlich teilweise geschmolzen ist, hängt an der Deutung der
Frequenzabhängigkeit von $Q$: Ein Modell mit Korngrenzengleiten im Mantel erklärt sie ebenso, und
die vorhandenen Daten unterscheiden beide nicht ([Walterová et al. 2023](literatur:walterova-2023)).

Über dem Mantel liegt eine Kruste aus leichten Anorthositen, nach der herkömmlichen Vorstellung als
Schaum auf einem globalen Magmaozean erstarrt. Wegen der schlecht wärmeleitenden Kruste und der
Wärmeabfuhr durch teilweises Aufschmelzen konvektierender Kumulate brauchte dieser Ozean 150 bis 200
Millionen Jahre zum Erstarren ([Maurice et al. 2020](literatur:maurice-2020)). Der ferroane
Anorthosit 60025 kristallisierte vor $4360 \pm 3$ Millionen Jahren; entweder erstarrte der Mond
später als gedacht, oder diese Gesteine sind keine Schwimmkumulate eines Magmaozeans
([Borg et al. 2011](literatur:borg-2011)). Zur Rolle von Schwerefeld und Drehung siehe
[Innerer Aufbau](thema:innerer-aufbau).

## Oberfläche

Die Vorderseite ist tief und eben, von vulkanischen Maria beherrscht; die Rückseite ist gebirgig
und dicht verkratert ([Jutzi und Asphaug 2011](literatur:jutzi-2011)). Nach Fernerkundungsdaten ist
die Kruste nicht einfach geschichtet, sondern besteht aus mindestens drei Provinzen: dem
Procellarum-KREEP-Terran (PKT) im Gebiet Procellarum–Imbrium, das rund 40 % des Thoriums der Kruste
in etwa 10 % ihres Volumens enthält, im Mittel etwa 5 ppm, dem feldspatreichen Hochlandterran mit
einem Kern aus mehreren zehn Kilometern Anorthosit und dem Südpol-Aitken-Terran, einer mafischen Anomalie,
die auch oberen Mantel enthalten kann ([Jolliff et al. 2000](literatur:jolliff-2000)). Das
Südpol-Aitken-Becken misst 2000 km im Durchmesser ([Wieczorek et al. 2013](literatur:wieczorek-2013)).
Norite aus Proben von Chang'e-6, aus einer Einschlagschmelze kristallisiert, datieren zwei
Einschläge: einen vor 4,25 Milliarden Jahren, am ehesten die Bildung des Beckens, und eine
Rückstellung im Becken vor 3,87 Milliarden Jahren ([Su et al. 2025](literatur:su-2025)).

Die Kraterchronologie verknüpft Kraterdichten mit den radiometrischen Altern zurückgebrachter
Proben. Bis 2024 stammten alle Proben von der Vorderseite, und die Alter, die sich bestimmten Flächen
zuordnen lassen, liegen unter 4,0 Milliarden Jahren. Chang'e-6 brachte am 25. Juni 2024 1,935 kg von
der Rückseite zurück: Basalte von $2807 \pm 3$ und Norite von $4247 \pm 5$ Millionen Jahren. Mit
ihnen verfeinert, bleibt die Chronologiefunktion eine Summe aus exponentiellem Abfall und linearem
Glied, und die Einschlagrate nahm früh gleichmäßig ab statt sprunghaft
([Yue et al. 2026](literatur:yue-2026)). Basalt von Chang'e-5 kristallisierte vor
$2030 \pm 4$ Millionen Jahren, das jüngste radiometrische Alter eines Mondbasalts und ein wichtiger
Eichpunkt; der Vulkanismus dauerte damit 800 bis 900 Millionen Jahre länger als bis dahin bekannt
([Li et al. 2021](literatur:li-2021)). Unter rund 3000 Glasperlen aus demselben Regolith sind drei
vulkanischen Ursprungs und nur $123 \pm 15$ Millionen Jahre alt, reich an Seltenen Erden und
Thorium ([Wang et al. 2024b](literatur:wang-2024b)). Auf der Rückseite trat Vulkanismus vor
$4203 \pm 4$ Millionen Jahren aus einer KREEP-reichen Quelle und vor $2807 \pm 3$ Millionen Jahren
aus einer KREEP-armen auf, über 1,4 Milliarden Jahre hinweg; weil das jüngere Alter zur
Kraterzählung passt, gilt die Chronologie der Vorderseite auch für die Rückseite
([Zhang et al. 2025a](literatur:zhang-2025a)).

Am Äquator schwankt die Temperatur im Tageslauf zwischen 95 und 390 K
([NSSDC Moon Fact Sheet](quelle:nssdc-moon)). In ständig beschatteten Kältefallen der Pole kann sich
Wassereis halten. Am 9. Oktober 2009 schlug eine ausgebrannte Centaur-Oberstufe im ständig
beschatteten Krater Cabeus ein; im Blickfeld von LCROSS lagen in der Auswurfwolke bis zu
$155 \pm 12\,\mathrm{kg}$ Wasserdampf und Eis, geschätzt $5{,}6 \pm 2{,}9$ Massenprozent Eis im
Regolith der Einschlagstelle
([Colaprete et al. 2010](literatur:colaprete-2010)). Im Streulicht der Kältefallen zeigen Spektren
von Moon Mineralogy Mapper Wassereis unmittelbar an der Oberfläche, innerhalb von 20° um beide Pole
und meist bei höchstens 110 K; nur etwa 3,5 % der Kältefallen zeigen es, stellenweise mit rund 30
Massenprozent ([Li et al. 2018a](literatur:li-2018a)).

## Atmosphäre und Magnetosphäre

Der Mond hat nur eine Exosphäre: insgesamt etwa 25 000 kg, nachts $3 \cdot 10^{-15}$ bar und
$2 \cdot 10^{5}$ Teilchen je cm³ am Boden, vor allem Helium, Neon, Wasserstoff und Argon; die
Zusammensetzung ist schlecht bekannt und veränderlich ([NSSDC Moon Fact Sheet](quelle:nssdc-moon)).
Das Massenspektrometer von LADEE kartierte erstmals Helium und Argon global und wies Neon nach.
Helium stammt aus den Alphateilchen des Sonnenwinds und aus einer inneren Quelle mit
$1{,}9 \cdot 10^{23}$ Atomen je Sekunde; Neon erreicht nachts ähnliche Dichten wie Helium, und über
den westlichen Maria fand sich eine örtliche Anreicherung von Argon
([Benna et al. 2015](literatur:benna-2015)).

Ein globales Magnetfeld hat der Mond heute nicht, doch Gesteine und Kruste sind magnetisiert.
Nach Labor- und Raumsondenmessungen stammt ein Großteil davon aus einem Kerndynamo, der mindestens
von 4,25 bis 3,56 Milliarden Jahren vor heute bestand, zeitweise so stark wie das heutige Erdfeld,
und bis etwa 3,3 Milliarden Jahre um mindestens eine Größenordnung schwächer wurde
([Weiss und Tikoo 2014](literatur:weiss-2014)). Zwei Brekzien kühlten vor $0{,}44 \pm 0{,}01$ und
$0{,}91 \pm 0{,}11$ Milliarden Jahren in einem Feld unter 0,1 µT ab; zusammen mit früheren
Paläointensitäten endete der Dynamo wahrscheinlich zwischen 1,92 und 0,80 Milliarden Jahren vor
heute, angetrieben zuletzt wohl durch das Erstarren des Kerns
([Mighani et al. 2020](literatur:mighani-2020)). Basalte von Chang'e-6 aus 2,8 Milliarden Jahren
tragen Paläointensitäten von etwa 5 bis 21 µT, ein Wiederanstieg nach dem Einbruch um 3,1
Milliarden Jahre ([Cai et al. 2025](literatur:cai-2025)).

Eine eigene Magnetosphäre fehlt deshalb; es gibt nur örtliche Felder der Kruste. Über einer
starken Anomalie nahe dem Antipoden von Mare Crisium bildete Chandrayaan-1 in rückgestreuten
Wasserstoffatomen eine
Mini-Magnetosphäre ab, eine teilweise Lücke im Sonnenwind von 360 km Durchmesser, umgeben von einem
300 km breiten Saum erhöhten Plasmaflusses ([Wieser et al. 2010](literatur:wieser-2010)).

## Bahn, Rotation und Dynamik

Die mittleren Bahnelemente sind 384 400 km große Halbachse, Exzentrizität 0,0549 und 5,145°
Neigung gegen die Ekliptik, bei 27,3217 Tagen siderischer und 29,53 Tagen synodischer Umlaufzeit;
weil sich die Bahn im Lauf des Jahres ändert, reicht der Abstand von rund 357 000 bis 407 000 km
([NSSDC Moon Fact Sheet](quelle:nssdc-moon); zu den Größen siehe
[Bahnelemente](thema:bahnelemente)). Die Knoten wandern gegen die Sterne in 18,6 Jahren (6793,48
Tagen) rückläufig, die Apsidenlinie in 8,85 Jahren rechtläufig um
([Espenak und Meeus 2009](literatur:espenak-2009)). Die Fundamentalargumente der IERS Conventions
ergeben 27,5545 Tage für den anomalistischen, 27,2122 Tage für den drakonitischen und 29,5306 Tage
für den synodischen Monat ([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.43).

Die [Sonne](objekt:sun) verformt die Bahn ständig. 2008 bis 2010 schwankte die momentane
Exzentrizität zwischen 0,0266 und 0,0762, am größten, wenn die Apsidenlinie zur Sonne zeigt, im
Mittel alle 205,9 Tage, und die Neigung zwischen 5,00° und 5,30°, am größten, wenn die Sonne in der
Knotenlinie steht, zu [Finsternissen](thema:finsternis) also stets nahe dem Höchstwert
([Espenak und Meeus 2009](literatur:espenak-2009)). In der ekliptikalen Länge erscheint das als
Reihe:

$$\lambda = L + 2e\sin l + \frac{5}{4}e^2\sin 2l + 1{,}274^\circ \sin(2D - l) + 0{,}658^\circ \sin 2D - 0{,}185^\circ \sin l_\odot + \ldots$$

mit mittlerer Länge $L$, mittlerer Anomalie $l$ des Mondes, $l_\odot$ der Sonne und mittlerer
Elongation $D$. Die ersten beiden Glieder sind die Mittelpunktsgleichung der Kepler-Ellipse,
$2e = 6{,}29^\circ$. Es folgen die Evektion mit 31,81 Tagen Periode, die Variation mit 14,77 Tagen
und die jährliche Gleichung mit 365,26 Tagen; die Perioden folgen aus den Raten der
Fundamentalargumente ([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.43). Die Punkte stehen
für kleinere Glieder und die Reduktion der Bahnlänge auf die Ekliptik. Die Amplituden sind die der
Hauptlösung ELP 2000-82B, 4586,43″, 2369,91″ und −666,44″, dazu 22 639,55″ oder 6,2888° für das
erste Glied der Mittelpunktsgleichung
([Chapront-Touzé und Chapront 1988](literatur:chapront-touze-1988)). Eine eigene Gegenprobe ergibt
dieselben Werte: Die Differenz zwischen der geozentrischen Länge des Mondes in der Ephemeride DE441
([Park et al. 2021](literatur:park-2021)) und einer Kepler-Ellipse mit mittleren Elementen, 1990
bis 2030 alle sechs Stunden, erklären diese drei und fünf kleinere Glieder von 0,04° bis 0,06° bis
auf 0,044° im quadratischen Mittel.

Die Rotation ist [gebunden](thema:gebundene-rotation), und die Drehachse folgt den Cassini-Gesetzen:
Der Mondäquator präzediert mit dem Bahnknoten in 18,6 Jahren rückläufig längs der Ekliptik und ist
gegen sie nur um 1,543° geneigt, und zwar entgegengesetzt zur Bahnneigung
([Williams et al. 2014](literatur:williams-2014)). Drehachse, Bahnnormale und die Achse, um die die
Bahn präzediert, beim Mond nahezu der Ekliptikpol, liegen so in einer Ebene. Peale zeigte, dass die
stabilen gleichebenen Lagen Extremwerte der Orientierungsenergie sind
([Peale 1969](literatur:peale-1969)); der Mond steht im Cassini-Zustand 2, weil es für ihn den
Zustand 1 nicht gibt ([Gladman et al. 1996](literatur:gladman-1996)). Die Drehachse steht damit
$1{,}543^\circ + 5{,}145^\circ = 6{,}688^\circ$ gegen die Bahnnormale; das Faktenblatt nennt 6,68°.
Die Reibung im Mond und an der Kerngrenze verschiebt
den Pol um 0,27″ und den Knoten um −10,0″ aus dieser Lage
([Williams et al. 2014](literatur:williams-2014)).

Weil der Mond gleichförmig rotiert, aber ungleichförmig läuft, und weil seine Achse gegen die
Bahnnormale geneigt ist, sieht man ihn im Monatslauf schwanken, die optische Libration: um den
Unterschied zwischen wahrer und mittlerer Länge, nach DE441 von 1990 bis 2030 bis zu rund ±8°, und
um rund ±6,7° in Breite; die Reflektorfelder kippen dadurch um bis zu 10° gegen die Sichtlinie
([Murphy 2013](literatur:murphy-2013)). Die physische Libration, die wirkliche Drehschwankung unter
den äußeren Schweredrehmomenten, hängt an $\beta$ und $\gamma$
([Williams et al. 2014](literatur:williams-2014)). Beim besten Modell brauchten die Librationswinkel
2013 nur noch Korrekturen von 5 bis 7 Nanoradiant im gewichteten quadratischen Mittel, damit die
Reflektoren übereinstimmen; dazu kommt eine Taumelbewegung von 75 Jahren Periode und 70 m Amplitude
([Murphy 2013](literatur:murphy-2013)).

[Gezeitenreibung](thema:gezeiten) treibt den Mond nach außen. Aus Laserentfernungen und
Gezeitenmodellen folgen $\mathrm{d}a/\mathrm{d}t = 38{,}30 \pm 0{,}08\,\mathrm{mm}$ je Jahr und
eine Abnahme der mittleren Bewegung um 25,97 ± 0,05″ je Jahrhundert²; eine Lösung mit drei
Zeitverzögerungen der Gezeiten ergibt für die Exzentrizität eine Zunahme um
$(1{,}50 \pm 0{,}10) \cdot 10^{-11}$ je Jahr. Die Dissipation in der Erde bewirkt den größten Teil
der Änderung von $n$ und $a$, die im Mond verringert die Zunahme der Exzentrizität
([Williams und Boggs 2016](literatur:williams-2016)). Die Szene
[Der Tanz des Mondes](szene:mondtanz) zeigt die elliptische Bahn um die Erde.

## Entstehung und Entwicklung

Nach der Hypothese des Rieseneinschlags entstand der Mond aus Trümmern eines außermittigen
Zusammenstoßes mit der jungen [Erde](objekt:earth). Canup und Asphaug fanden Stöße eines kleineren Körpers als
zuvor für nötig gehalten, die gegen Ende des Erdwachstums einen eisenarmen Mond und den heutigen
Drehimpuls ergeben ([Canup und Asphaug 2001](literatur:canup-2001)). In solchen Rechnungen stammen
aber über 40 % der Scheibe vom Einschlagkörper, während das Isotopenverhältnis ⁵⁰Ti/⁴⁷Ti von Mond und
Erde auf etwa 4 ppm gleich ist, einem Hundertfünfzigstel der Spanne unter den Meteoriten
([Zhang et al. 2012](literatur:zhang-2012)). Auch die Sauerstoffisotope unterscheiden sich in
Δ′¹⁷O nur um −1 ± 5 ppm (2 Standardfehler), was eine kräftige Durchmischung bei einem
energiereichen Stoß mit viel Drehimpuls nahelegt ([Young et al. 2016](literatur:young-2016)). Beim
Wolfram zeigt der Mond einen Überschuss an ¹⁸²W von $20{,}6 \pm 5{,}1$ ppm
([Touboul et al. 2015](literatur:touboul-2015)) beziehungsweise $27 \pm 4$ ppm
([Kruijer et al. 2015](literatur:kruijer-2015)) gegenüber dem heutigen Erdmantel; beide Gruppen
führen ihn auf ungleich verteilte späte Akkretion zurück, vor der die Werte gleich waren.

Mehrere Varianten sollen die Gleichheit erklären. Ein Einschlag auf eine schnell rotierende
Proto-Erde erzeugt eine Scheibe vorwiegend aus Erdmantel ([Ćuk und Stewart 2012](literatur:cuk-2012)),
ein deutlich größerer Einschlagkörper eine Scheibe von der Zusammensetzung des Mantels
([Canup 2012](literatur:canup-2012)); beide brauchen danach eine Resonanz mit der Sonne, die
Drehimpuls abführt. Nach Lock et al. hinterlassen energiereiche Stöße mit viel Drehimpuls eine
Synestia, eine Struktur jenseits der Korotationsgrenze, in deren Dampf von der Zusammensetzung der
silikatischen Erde der Mond kondensiert ([Lock et al. 2018](literatur:lock-2018)). Nach Rufu et al.
kann der Mond auch aus mehreren kleineren Stößen hervorgehen, deren Trümmerscheiben je einen Mondling
bilden, der nach außen wandert und mit den anderen verschmilzt
([Rufu et al. 2017](literatur:rufu-2017)). Einordnung in die Planetenentstehung:
[Entstehung des Sonnensystems](thema:entstehung).

Das Alter ist strittig. Zirkone aus Apollo-14-Proben verlangen eine differenzierte Kruste vor
4,51 Milliarden Jahren und damit einen Mond in den ersten etwa 60 Millionen Jahren des
Sonnensystems ([Barboni et al. 2017](literatur:barboni-2017)). Ein Magmaozean, der 150 bis 200
Millionen Jahre zum Erstarren braucht, führt mit den Probenaltern dagegen auf
$4{,}425 \pm 0{,}025$ Milliarden Jahre ([Maurice et al. 2020](literatur:maurice-2020)). Nimmo et al.
deuten die häufigen Alter um 4,35 Milliarden Jahre als Wiederaufschmelzen durch Gezeitenheizung,
als der Mond beim Auswandern den Übergang der Laplace-Ebene durchlief; der Mond könnte danach
innerhalb weniger zehn Millionen Jahre nach Entstehung des Sonnensystems entstanden sein, und das
erklärt auch, warum es weniger große Becken gibt als erwartet
([Nimmo et al. 2024](literatur:nimmo-2024)).

## Offene Fragen

- **Einschlag und Isotope:** Herwartz et al. maßen in Δ¹⁷O 12 ± 3 ppm Unterschied als Spur des
  Einschlagkörpers Theia, alternativ einer späten Zufuhr kohliger Chondrite
  ([Herwartz et al. 2014](literatur:herwartz-2014)), Cano et al. eine
  Abhängigkeit von der Gesteinsart, mit schwereren Werten im tiefen Mondmantel
  ([Cano et al. 2020](literatur:cano-2020)); Young et al. und Fischer et al. finden keinen
  Unterschied, Fischer et al. auch nicht unterhalb eines ppm
  ([Young et al. 2016](literatur:young-2016); [Fischer et al. 2024](literatur:fischer-2024)).
  Welches Szenario zutrifft, ist offen.
- **Alter:** früh, spätestens vor 4,51 Milliarden Jahren ([Barboni et al. 2017](literatur:barboni-2017))
  beziehungsweise innerhalb weniger zehn Millionen Jahre nach Entstehung des Sonnensystems
  ([Nimmo et al. 2024](literatur:nimmo-2024)), oder später, vor $4{,}425 \pm 0{,}025$ Milliarden
  Jahren ([Maurice et al. 2020](literatur:maurice-2020)); das Anorthositalter von 4,36 Milliarden
  Jahren verlangt entweder einen spät erstarrten Mond oder eine andere Herkunft der Anorthosite
  ([Borg et al. 2011](literatur:borg-2011)).
- **Dauer und Stärke des Dynamos:** Tarduno et al. zeigen, dass ein junges Einschlagglas eine starke,
  erdähnliche Magnetisierung trägt, während Kristalle aus 3,9 bis 3,2 Milliarden Jahren, die ein
  starkes Feld aufzeichnen könnten, keines zeigen; der Mond habe keinen langlebigen Dynamo gehabt
  ([Tarduno et al. 2021](literatur:tarduno-2021)). Dem stehen ein Dynamo, der erst vor 1,92 bis 0,80
  Milliarden Jahren endete ([Mighani et al. 2020](literatur:mighani-2020)), und die Feldstärken von
  Chang'e-6 entgegen ([Cai et al. 2025](literatur:cai-2025)).
- **Ursache der Asymmetrie:** Vorgeschlagen sind innere Ursachen und äußere wie ein zweiter Mond von
  rund 1200 km Durchmesser, der langsam auf die Rückseite prallte
  ([Jutzi und Asphaug 2011](literatur:jutzi-2011)), oder die Erwärmung des Mantels durch den
  Südpol-Aitken-Einschlag, die Thorium- und Titan-reiche Kumulate auf die Vorderseite verlagert
  ([Jones et al. 2022](literatur:jones-2022)).
- **Zustand des Kerns:** Die Seismik deutet auf einen festen inneren Kern
  ([Weber et al. 2011](literatur:weber-2011)), ebenso ein Abgleich mit thermodynamischen Modellen, der
  $258 \pm 40\,\mathrm{km}$ ergibt ([Briaud et al. 2023](literatur:briaud-2023)); die geodätischen
  Daten lassen 0 bis 280 km zu ([Williams et al. 2014](literatur:williams-2014)). Ob eine teilweise
  geschmolzene Schicht den Kern umgibt, ist ebenfalls offen
  ([Walterová et al. 2023](literatur:walterova-2023)).
- **Fossile Figur:** frühe Gezeitenheizung und eine bei 32 Erdradien eingefrorene Beule
  ([Garrick-Bethell et al. 2014](literatur:garrick-bethell-2014)) oder eine Figur, die erst nach
  Abzug der Becken zu einer synchronen Bahn passt ([Keane und Matsuyama 2014](literatur:keane-2014)).

## Im Modell

- **Bahn:** Orrery rechnet den Mond als Kepler-Ellipse mit festen $a = 0{,}00257$ AE (384 467 km,
  das gerundete Faktenblattmittel 384 400 km), $e = 0{,}0549$ und $I = 5{,}145^\circ$ gegen die
  Ekliptik J2000 ([Bahnelemente](thema:bahnelemente)); mittlere Länge, Perigäum und Knoten laufen
  linear. Die Raten von Knoten und Perigäum nach Meeus sind um die allgemeine Präzession von
  1,3969713° je Jahrhundert vermindert, auf −1935,5333° und +4067,6168° je Jahrhundert
  ([Bezugssysteme](thema:bezugssysteme)); der Knoten läuft so in 18,600 Jahren, das Perigäum in
  8,850 Jahren um. Der Abstand, den der Datenblock zeigt, bleibt so zwischen
  $a\,(1 - e) = 363359\,\mathrm{km}$ und $a\,(1 + e) = 405574\,\mathrm{km}$. Periodische
  Störungen fehlen: Gegen DE441 weicht die Länge 1990 bis 2030 um bis zu 2,39° ab, im quadratischen
  Mittel um 1,03°, die Breite um bis zu 0,34° und der Abstand um bis zu 7010 km. In der Länge sind
  das fast ganz Evektion, Variation und jährliche Gleichung, im Abstand Evektion und Variation
  (siehe Bahn); in der Breite ist es die Schwankung von Neigung und Knoten, Hauptglied
  $0{,}173^\circ \sin(2D - F)$ mit dem mittleren Argument der Breite $F$
  ([Chapront-Touzé und Chapront 1988](literatur:chapront-touze-1988)). Die mittlere Länge driftet von
  1800 bis 2100 nicht. Die [Mondfinsternis](szene:mondfinsternis) trifft
  so bis zu 3 h daneben. Der Erdmittelpunkt sitzt im Erde-Mond-Schwerpunkt
  ([Erde](objekt:earth)); der Vektor von der Erde zum Mond ist davon nicht betroffen.
- **Rotation:** Die Rotationsperiode 655,71984 h ist genau die siderische Umlaufzeit $360^\circ/\dot{L}$
  des Datensatzes, 27,32166 Tage; die Karte driftet deshalb nicht gegen die Erdrichtung. Die Phase
  ist zur Epoche null. Der Pol ist der Ausdruck des IAU-Berichts von 2009 zur Epoche samt
  periodischer Glieder, 266,8577° und 65,6411° ([Archinal et al. 2011](literatur:archinal-2011)),
  1,570° vom Ekliptikpol statt der mittleren 1,543°. Die Kartenmitte, die Mitte der Vorderseite,
  steht zur Epoche 4,18° östlich des Knotens $Q$, der IAU-Nullmeridian nach demselben Ausdruck bei
  41,20°. Die Erde steht deshalb im Mittel über 37,0° östlicher Länge der Karte statt über 0°, und
  das Jahresmittel ändert sich von 1800 bis 2126 nur zwischen 36,8° und 37,2°. Der Winkel zwischen
  Kartenmitte und Erdrichtung beträgt zur Epoche 41,7° (Erde über 41,3° Ost, 6,7° Süd), am
  19. September 2026 37,5° (37,4° Ost, 3,5° Nord), 1900 31,2° (31,2° Ost, 1,5° Süd) und 2100 34,1°
  (34,1° Ost, 1,6° Süd). Im Monatslauf pendelt die Länge zwischen 30,5° und 43,5°; die Beiträge der
  Evektion und Variation fehlen in dieser Libration.
- **Pol und Cassini-Zustand:** Der Pol steht fest, während der Bahnknoten wandert. Zur Epoche liegen
  Pol und Bahnnormale 6,72° auseinander, fast in Cassini-Lage; nach einem halben Knotenumlauf
  (2. Mai 2009, wieder am 8. Dezember 2027) sind es nur 3,57°, am 19. September 2026 3,76°; 6,72°
  werden im Takt des Knotenumlaufs wieder erreicht, am 20. August 2018 und am 27. März 2037. Die
  Libration in Breite schwankt so zwischen etwa ±3,6° und ±6,7°.
  Die Achsneigung des Datenblocks, 6,7°, ist der Wert zur Epoche.
- **Maßstab:** Der Mondabstand wächst mit dem Größenfaktor wie die Radien: in „Schaubild" 50-fach
  auf 19,2 Millionen km, in „Kompakt" 200-fach auf 76,9 Millionen km; das Verhältnis von Abstand und
  Erdradius bleibt 60,3. Das Punktlicht sitzt in der dargestellten Sonne. Vom 19. September 2026 an
  weicht die Lichtrichtung am dargestellten Mond innerhalb eines Monats um bis zu 7,6° in
  „Schaubild" und 32,7° in „Kompakt" von der wahren ab, die Phase entsprechend; die Schatten für
  Finsternisse rechnen mit der wahren Richtung.
- **Albedo:** Der Datensatz führt die geometrische Albedo 0,12 des Faktenblatts; die Mondkarte wird
  mit 0,384 skaliert. Das Material ergibt eine geometrische Albedo von $0{,}640\,p = 0{,}077$ und eine
  Bond-Albedo von $0{,}955\,p = 0{,}115$; das Faktenblatt nennt 0,12 und 0,11
  ([NSSDC Moon Fact Sheet](quelle:nssdc-moon)). Das Phasenintegral des Modells ist 1,49, das aus
  gemessenen Phasenkurven des Mondes bestimmte $0{,}48 \pm 0{,}02$
  ([Shevchenko et al. 2019](literatur:shevchenko-2019)). Die beiden Werte des Faktenblatts ergäben
  zusammen ein Phasenintegral von 0,92 und passen damit nicht zu diesem Messwert. Oppositionseffekt
  und die steile Phasenkurve des Regoliths fehlen ([Albedo und Helligkeit](thema:photometrie)).
- **Datenblock:** Der Durchmesser 3475 km ist der doppelte Kartenradius 1737,4 km, nach der
  Laserhöhenmessung wären es 3474,3 km. Die Masse, 7,35 · 10²² kg (im Datensatz
  $7{,}346 \cdot 10^{22}\,\mathrm{kg}$), ergibt mal $G$ nach CODATA 2018 ein $GM$ 29 ppm über dem Wert
  der Ephemeride. Die Umlaufzeit 27,3 Tage rechnet der Datenblock nach Kepler aus $a$ und
  $G\,(M_\oplus + M)$: 27,2916 Tage, 0,11 % unter der siderischen Umlaufzeit, mit der sich der Mond im
  Modell bewegt. Rotationsperiode 27,3 Tage und Exzentrizität 0,055 stehen fest, Knoten und Perigäum
  mit den verminderten Raten. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
