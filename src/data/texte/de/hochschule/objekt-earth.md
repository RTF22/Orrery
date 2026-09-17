# Erde

Dieser Text behandelt die Erde als Planeten: Figur und Schwerefeld aus Satellitenbahnen, Aufbau
aus Eigenschwingungen und seismischen Laufzeiten, Rotation und Gezeiten aus historischen
Finsternissen und Laserentfernungen zum Mond, dazu die Streitfragen mit beiden Seiten und das,
was Orrery davon abbildet.

## Kenngrößen und Messung

Die IERS Conventions (2010) fassen die geodätischen Grundgrößen als Zahlenstandards zusammen
([Petit und Luzum 2010](literatur:petit-2010), Tabelle 1.1). Äquatorradius, Abplattung und
$J_2$ gelten im Zero-Tide-System: Die bleibende Verformung durch das permanente
Gezeitenpotential ist nicht herausgerechnet.

| Größe | Wert | Unsicherheit | Bestimmung | Beleg |
|---|---|---|---|---|
| $GM_\oplus$ (TCG) | $3{,}986004418 \cdot 10^{14}\,\mathrm{m}^3\,\mathrm{s}^{-2}$ | $8 \cdot 10^{5}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, nach neueren Studien $4 \cdot 10^{5}$ | Satellitenbahnen, vor allem LAGEOS; mit Atmosphäre | [Petit und Luzum 2010](literatur:petit-2010); [Ries et al. 1992](literatur:ries-1992) |
| $a_\mathrm{E}$ | $6378136{,}6\,\mathrm{m}$ | $0{,}1\,\mathrm{m}$ | Zero Tide | [Petit und Luzum 2010](literatur:petit-2010) |
| $1/f$ | $298{,}25642$ | $0{,}00001$ | Zero Tide | [Petit und Luzum 2010](literatur:petit-2010) |
| $J_2$ | $1{,}0826359 \cdot 10^{-3}$ | $1 \cdot 10^{-10}$ | Schwerefeld, Zero Tide | [Petit und Luzum 2010](literatur:petit-2010) |
| $H$ | $3{,}273795 \cdot 10^{-3}$ | $1 \cdot 10^{-9}$ | passend zum Präzessions-Nutations-Modell IAU 2006/2000 | [Petit und Luzum 2010](literatur:petit-2010) |
| $C$ | $80349{,}0 \cdot 10^{33}\,\mathrm{kg}\,\mathrm{m}^2$ | $9{,}6 \cdot 10^{33}\,\mathrm{kg}\,\mathrm{m}^2$ | Schwerefeldmodelle EGM2008, EIGEN-6C, EIGEN-6C2; begrenzt durch $G$ und $H$ | [Chen et al. 2015](literatur:chen-2015) |
| $\mu$ (Mond/Erde) | $0{,}0123000371$ | $4 \cdot 10^{-10}$ | Zahlenstandard | [Petit und Luzum 2010](literatur:petit-2010) |
| $\omega$ (nominell) | $7{,}292115 \cdot 10^{-5}\,\mathrm{rad}\,\mathrm{s}^{-1}$ | – | Referenzsystem GRS80 | [Petit und Luzum 2010](literatur:petit-2010) |

In den meisten Bestimmungen von $GM_\oplus$ bis 1992 hatten Laserentfernungen zum Satelliten
LAGEOS den größten Einfluss; nach Korrektur eines Fehlers im Schwerpunktversatz ergaben sie
398 600,4415 km³ s⁻² mit 0,0008 km³ s⁻² (1σ), einschließlich der Atmosphäre
([Ries et al. 1992](literatur:ries-1992)). Das ist der TT-kompatible Wert, den die IERS
Conventions aus dem Tabellenwert mit $x_\mathrm{TT} = x_\mathrm{TCG}\,(1 - L_\mathrm{G})$
ableiten. Der Polradius $b = a_\mathrm{E}\,(1 - f) = 6356751{,}9\,\mathrm{m}$ ist 21,4 km
kleiner.

$J_2$ und die dynamische Abplattung $H$ enthalten dieselbe Differenz der Hauptträgheitsmomente:

$$J_2 = \frac{C - (A + B)/2}{M a_\mathrm{E}^2}, \quad H = \frac{C - (A + B)/2}{C}$$

Ihr Quotient $C/(M a_\mathrm{E}^2) = J_2/H = 0{,}330698$ hängt nicht von $G$ ab; die
Tabellenwerte ergeben formal $1 \cdot 10^{-7}$ Unsicherheit. Das absolute $C$ braucht dagegen
die Masse und damit $G$, deshalb begrenzen $G$ und $H$ seine Unsicherheit
([Chen et al. 2015](literatur:chen-2015)). Für das mittlere Trägheitsmoment $I = (A + B + C)/3$
gilt

$$\frac{I}{M a_\mathrm{E}^2} = \frac{C}{M a_\mathrm{E}^2} - \frac{2}{3}\,J_2 = 0{,}329976$$

bezogen auf den mittleren Radius von 6371,0 km also $I/(M R^2) = 0{,}33072$, deutlich unter
0,4 für eine homogene Kugel.

Die Rotation zählen die IERS Conventions über den Erdrotationswinkel in UT1
([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.14):

$$\theta_\mathrm{ERA} = 2\pi\,(0{,}7790572732640 + 1{,}00273781191135448\,T_\mathrm{u})$$

mit $T_\mathrm{u}$ als julianischem Datum in UT1 minus 2 451 545,0. Eine Umdrehung gegen den
Himmel dauert danach 86 164,0989 s; Änderungen der Tageslänge (LOD) folgen aus
$\Delta \mathrm{LOD}/\mathrm{LOD} = -\Delta\omega/\omega$.

## Inneres

Das Referenzmodell PREM entstand aus rund 1000 Perioden von Eigenschwingungen,
500 zusammengefassten Laufzeitbeobachtungen, 100 Gütefaktoren, Masse und Trägheitsmoment sowie
1,75 Millionen Laufzeiten von P- und S-Wellen aus ISC-Daten; die äußeren 220 km des Mantels
mussten transversal isotrop angesetzt werden
([Dziewonski und Anderson 1981](literatur:dziewonski-1981)). Randbedingungen waren
$R = 6371\,\mathrm{km}$, $M = 5{,}974 \cdot 10^{24}\,\mathrm{kg}$ und $I/(M R^2) = 0{,}3308$.
In PREM reicht der innere Kern bis 1221,5 km Radius, die Kern-Mantel-Grenze liegt bei 3480,0 km,
also 2891 km tief, und die Übergangszone des Mantels zwischen den Diskontinuitäten in 400 und
670 km Tiefe. Aus den
Dichtepolynomen folgen 13,09 g/cm³ im Mittelpunkt, ein Sprung von 12,17 auf 12,76 g/cm³ am
inneren Kern und von 5,57 auf 9,90 g/cm³ an der Kern-Mantel-Grenze.

Beide Kernteile sind leichter als reines Eisen. Das Defizit wird leichten Elementen wie S, Si,
O, C und H zugeschrieben; ihre Anteile lassen sich nur indirekt bestimmen, durch den Abgleich
von Hochdruckexperimenten und Rechnungen mit seismischen Beobachtungen. Hirose et al. nennen für
den äußeren Kern in Massenanteilen Fe mit 5 % Ni, 1,7 % S, 0 bis 4,0 % Si, 0,8 bis 5,3 % O,
0,2 % C und 0 bis 0,26 % H, für den inneren Kern unter anderem nur 0 bis 0,1 % O
([Hirose et al. 2021](literatur:hirose-2021)).

Wann der innere Kern zu wachsen begann, hängt an der Wärmeleitfähigkeit, und die Messungen
widersprechen sich. Ohta et al. maßen den elektrischen Widerstand von Eisen bis 4500 K in der
Diamantstempelzelle; der niedrige Wert spricht für hohe Wärmeleitfähigkeit, rasche Abkühlung und
einen inneren Kern jünger als 0,7 Milliarden Jahre ([Ohta et al. 2016](literatur:ohta-2016)).
Konôpková et al. schätzen aus Wärmepulsen in festem Eisen 18 bis 44 W m⁻¹ K⁻¹ für den Kern; dann
kann thermische Konvektion den Dynamo über Milliarden Jahre tragen, und der innere Kern kann so
alt sein wie der Dynamo ([Konôpková et al. 2016](literatur:konopkova-2016)). Paläomagnetisch
deuten Biggin et al. eine Zunahme von mittlerer Feldstärke und Streuung vor 1,0 bis 1,5
Milliarden Jahren als Beginn der Kernkristallisation bei mäßiger Leitfähigkeit
([Biggin et al. 2015](literatur:biggin-2015)). Bono et al. fanden in rund 565 Millionen Jahre
alten Gesteinen ein mittleres Dipolmoment von nur etwa
$0{,}7 \cdot 10^{22}\,\mathrm{A}\,\mathrm{m}^2$, verträglich mit hoher Leitfähigkeit und einem
Wachstumsbeginn im Ediacarium ([Bono et al. 2019](literatur:bono-2019)).

## Oberfläche

Die Topographie umfasst 20,4 km; die Hydrosphäre hat mit $1{,}4 \cdot 10^{21}\,\mathrm{kg}$ rund
die 275-fache Masse der Atmosphäre ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)). Die Erde ist
der einzige bekannte Planet mit Plattentektonik; hauptsächliche Antriebskraft ist das Absinken
kalter, dichter Lithosphäre in Subduktionszonen ([Stern 2005](literatur:stern-2005)). Wann die
Plattentektonik einsetzte, ist offen; die Vorschläge reichen vom Hadaikum bis ins
Neoproterozoikum. Palin et al. sehen in metamorphen Gesteinen und geodynamischen Modellen einen
globalen Beginn spätestens vor rund 3 Milliarden Jahren und deuten ältere Subduktionsspuren als
örtlich von Mantelplumes ausgelöste Subduktion ([Palin et al. 2020](literatur:palin-2020)).
Stern leitet aus dem Gesteinsbefund dagegen ab, dass die heutige Episode der Plattentektonik
erst im Neoproterozoikum begann ([Stern 2018](literatur:stern-2018)); früher stützte er das auf
das erste Auftreten von Ophiolithen, Blauschiefern und Ultrahochdruckgesteinen
([Stern 2005](literatur:stern-2005)).

## Atmosphäre und Magnetosphäre

Trockene Luft besteht nach Volumen aus 78,08 % N₂, 20,95 % O₂, 9340 ppm Ar und 420 ppm CO₂;
Wasserdampf liegt typisch bei 1 %. Das Faktenblatt nennt 1014 hPa Bodendruck, 288 K mittlere
Temperatur, eine mittlere molare Masse von 28,97 g/mol und 8,5 km Skalenhöhe; die isotherme
Näherung $h_\mathrm{s} = k_\mathrm{B} T/(\bar{m}\,g)$ ergibt 8,4 km. Die Bond-Albedo beträgt
0,294, die geometrische Albedo 0,434 ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)). Nord- und
Südhalbkugel reflektieren bis auf etwa 0,2 W m⁻² gleich viel Sonnenlicht, weil Wolken im Süden
die hellere Landfläche im Norden ausgleichen, und das reflektierte Mittel schwankt von Jahr zu
Jahr nur um rund 0,2 % ([Stephens et al. 2015](literatur:stephens-2015)). 2023 erreichte die
planetare Albedo dennoch einen Tiefstwert, vor allem durch weniger tiefe Wolken in nördlichen
mittleren Breiten und Tropen. Die Autoren sehen darin den Hauptfaktor für die rund 0,2 K, um die
bisherige Schätzungen der bekannten Antriebe den Temperaturanstieg unterschritten
([Goessling et al. 2025](literatur:goessling-2025)).

Das Hauptfeld beschreibt das IGRF in Kugelfunktionen mit dem Bezugsradius
$a = 6371{,}2\,\mathrm{km}$; die 14. Generation von November 2024 enthält Modelle für 2020,0 und
2025,0 bis Grad 13 und eine Vorhersage der Säkularvariation für 2025 bis 2030
([Beggan et al. 2026](literatur:beggan-2026)). Aus den Gauß-Koeffizienten ersten Grades folgen

$$B_0 = \sqrt{\left( g_1^0 \right)^2 + \left( g_1^1 \right)^2 + \left( h_1^1 \right)^2}, \quad m = \frac{4\pi a^3 B_0}{\mu_0}$$

Für 2025,0 sind das $B_0 = 29733\,\mathrm{nT}$ und
$m = 7{,}69 \cdot 10^{22}\,\mathrm{A}\,\mathrm{m}^2$; die Dipolachse ist rund 9,2° gegen die
Drehachse geneigt, und den geomagnetischen Nordpol führt das Modell bei 80,85° N und 72,76° W.
1900 betrug das Moment $8{,}32 \cdot 10^{22}\,\mathrm{A}\,\mathrm{m}^2$, es sank also in 125
Jahren um 7,6 %, und die vorhergesagte Änderung von $g_1^0$ um +12,6 nT je Jahr setzt die
Abnahme fort. In den Feldänderungen an der Kern-Mantel-Grenze über weniger als ein Jahrzehnt
findet das Modell CHAOS-8 westwärts wandernde Strukturen und vorläufig auch kleinräumige
ostwärts laufende in niedrigen Breiten, mit etwa 200 km je Jahr, gedeutet als Hinweis auf
hydromagnetische Wellen ([Kloss et al. 2026](literatur:kloss-2026)).

## Bahn, Rotation und Dynamik

Die Näherungstafel des JPL für 1800 bis 2050 führt den Erde-Mond-Schwerpunkt mit
$a = 1{,}00000261$ AE, $e = 0{,}01671123$ mit −0,0000439 je Jahrhundert und der Länge
des Perihels 102,94° mit +0,323° je Jahrhundert gegen die Ekliptik J2000
([JPL Approximate Positions](quelle:jpl-approx-pos)); zur Bedeutung solcher Elemente siehe
[Bahnelemente](thema:bahnelemente). Die Schiefe der Ekliptik nimmt von 84 381,406″ zur Epoche
J2000,0 um 46,84″ je Jahrhundert ab; die allgemeine Präzession in Länge von 0,02438175 rad je
Jahrhundert ergibt einen Umlauf in rund 25 770 Jahren
([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.40 und 5.44).

Die Schiefe schwankt heute nur um ±1,3° um 23,3°. Laskar et al. fanden eine chaotische Zone von
60° bis 90° Schiefe, die ohne Mond von fast 0° bis etwa 85° reichen würde; der Mond wirke so als
möglicher Klimaregler ([Laskar et al. 1993](literatur:laskar-1993)). Li und Batygin schätzen
dagegen, dass sich die Schiefe auch ohne Mond chaotisch so langsam änderte, dass langfristige
Bewohnbarkeit nicht ausgeschlossen wäre ([Li und Batygin 2014](literatur:li-2014)). Die
Bahnlösung La2004 eignet sich zur Kalibrierung paläoklimatischer Daten über 40 bis
50 Millionen Jahre; darüber hinaus verhindert das Chaos genaue Werte, und die Autoren empfehlen
für das Mesozoikum den Exzentrizitätsterm größter Amplitude mit 405 000 Jahren Periode
([Laskar et al. 2004](literatur:laskar-2004)).

Gezeitenreibung überträgt Drehimpuls von der Erdrotation auf die Mondbahn. Laserentfernungen
zum Mond, ergänzt um geophysikalische Gezeitenmodelle, ergeben
$\mathrm{d}a/\mathrm{d}t = 38{,}30 \pm 0{,}08\,\mathrm{mm}$ je Jahr; das geophysikalische Modell
sagt eine gezeitenbedingte Zunahme der Tageslänge um 2,395 ms je Jahrhundert voraus
([Williams und Boggs 2016](literatur:williams-2016)). Finsternisberichte ab 720 v. Chr. und
Sternbedeckungen bis 2015 zeigen dagegen im Mittel nur +1,8 ms je Jahrhundert und Schwankungen
über Jahrzehnte bis Jahrhunderte; zur Erklärung werden nacheiszeitliche Landhebung und
Kern-Mantel-Kopplung herangezogen ([Stephenson et al. 2016](literatur:stephenson-2016)). Die
erweiterte Auswertung gibt $(-4{,}59 \pm 0{,}08) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$
beobachtet gegen $(-6{,}39 \pm 0{,}03) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$ aus der
Gezeitenrechnung ([Morrison et al. 2021](literatur:morrison-2021)). Mit

$$\dot{\mathrm{LOD}} = -\frac{\mathrm{LOD}^2}{2\pi}\,\dot{\omega}$$

entspricht der Gezeitenwert 2,40 ms je Jahrhundert, im Einklang mit den 2,395 ms des
geophysikalischen Modells. Für die Zeit seit 1972 fand Agnew: Nach Abzug der über
Satellitengravimetrie gemessenen Eisschmelze in Grönland und der Antarktis nimmt die
Winkelgeschwindigkeit des flüssigen Kerns gleichmäßig ab und erhöht die des übrigen Erdkörpers;
UTC bräuchte danach bis 2029 eine negative Schaltsekunde, ohne die beschleunigte Eisschmelze
drei Jahre früher ([Agnew 2024](literatur:agnew-2024)).

## Entstehung und Entwicklung

Kalzium-Aluminium-reiche Einschlüsse in Meteoriten, die ersten Festkörper des Sonnensystems,
entstanden vor $4567{,}30 \pm 0{,}16$ Millionen Jahren
([Connelly et al. 2012](literatur:connelly-2012)); ihr Alter dient als Nullpunkt für Zeitangaben
nach Entstehung des Sonnensystems. Der [Mond](objekt:moon) gilt als Ergebnis eines
Rieseneinschlags. Canup und Asphaug fanden Stöße mit einem kleineren Körper als zuvor für
möglich gehalten, die gegen Ende des Erdwachstums einen eisenarmen Mond und den heutigen
Drehimpuls ergeben ([Canup und Asphaug 2001](literatur:canup-2001)). In solchen Rechnungen
stammt der Großteil des Mondmaterials vom Einschlagkörper, Erde und Mond sind isotopisch aber
nahezu gleich. Zwei Varianten beginnen mit mehr Drehimpuls, der später über eine Resonanz mit
der Sonne abgebaut wird: ein Einschlag auf eine schnell rotierende Proto-Erde, dessen Scheibe
überwiegend aus Erdmantel besteht ([Ćuk und Stewart 2012](literatur:cuk-2012)), oder ein
deutlich größerer Einschlagkörper, dessen Scheibe dieselbe Zusammensetzung wie der Mantel erhält
([Canup 2012](literatur:canup-2012)).

Wie gleich die Sauerstoffisotope sind, ist umstritten. Herwartz et al. maßen einen Unterschied
in Δ¹⁷O von 12 ± 3 ppm als Spur des Einschlagkörpers Theia, alternativ einer späten Zufuhr
kohliger Chondrite ([Herwartz et al. 2014](literatur:herwartz-2014)). Young et al. fanden in der
logarithmisch definierten Größe Δ′¹⁷O −1 ± 5 ppm (2 Standardfehler) und folgern kräftige
Durchmischung bei einem energiereichen Stoß ([Young et al. 2016](literatur:young-2016)). Nach
Cano et al. korrelieren die Werte mit der Gesteinsart, und Proben aus dem tiefen Mondmantel sind
schwerer als die Erde ([Cano et al. 2020](literatur:cano-2020)). Fischer et al. finden keinen
Unterschied auf dem Niveau unter einem ppm ([Fischer et al. 2024](literatur:fischer-2024)).

Auch das Alter des Mondes ist strittig. Zirkone aus Apollo-14-Proben zeigen eine spätestens vor
4,51 Milliarden Jahren differenzierte Mondkruste, also Mondbildung in den ersten rund 60
Millionen Jahren nach Entstehung des Sonnensystems
([Barboni et al. 2017](literatur:barboni-2017)). Ein Magmaozean, der 150 bis 200 Millionen Jahre
zum Erstarren braucht, führt mit den Probenaltern dagegen auf $4{,}425 \pm 0{,}025$ Milliarden
Jahre, gleich dem Uran-Blei-Alter der Erde, das demnach die letzte Kernbildung datiert
([Maurice et al. 2020](literatur:maurice-2020)). Ein Zirkon, dessen Alter von 4,4 Milliarden
Jahren die Atomsondentomographie bestätigt, verlangt, dass jede Durchmischung der silikatischen
Erde früher lag ([Valley et al. 2014](literatur:valley-2014)).

## Offene Fragen

- **Alter des inneren Kerns:** Je nach Wärmeleitfähigkeit reichen die Schätzungen von rund 0,5
  bis über 2,5 Milliarden Jahre ([Bono et al. 2019](literatur:bono-2019)), und das Paläofeld
  wird verschieden gedeutet ([Biggin et al. 2015](literatur:biggin-2015);
  [Bono et al. 2019](literatur:bono-2019)).
- **Leichte Elemente:** Die Bereiche würden enger mit genaueren Grenzen für die Kerntemperatur
  und einer besseren Verknüpfung der Zusammensetzungen von festem und flüssigem Kern
  ([Hirose et al. 2021](literatur:hirose-2021)).
- **Rotation des inneren Kerns:** Nach wiederholten Erdbebenwellen pausierte die differentielle
  Rotation im letzten Jahrzehnt, als allmähliche Umkehr in einer Schwingung von rund sieben
  Jahrzehnten gedeutet ([Yang und Song 2023](literatur:yang-2023)). Wang et al. zeichnen die
  Umkehr genauer nach: Vorauseilen 2003 bis 2008, danach zwei- bis dreimal langsameres
  Zurückdrehen bis 2023; neue Kopplungsmodelle seien nötig
  ([Wang et al. 2024](literatur:wang-2024)).
- **Beginn der Plattentektonik:** spätestens vor 3 Milliarden Jahren oder im heutigen Stil
  erst im Neoproterozoikum (siehe Oberfläche).
- **Mondbildung:** ob die Sauerstoffisotope gleich sind und ob der Mond vor 4,51 oder vor
  4,425 Milliarden Jahren entstand (siehe Entstehung).
- **Albedo:** wie viel vom Rückgang tiefer Wolken innere Variabilität, weniger Aerosole oder
  eine einsetzende Rückkopplung ist ([Goessling et al. 2025](literatur:goessling-2025)).

## Im Modell

- **Bahn:** Elemente der JPL-Tafel 1 (1800 bis 2050) gegen die Ekliptik J2000 mit linearen
  Raten, gültig für den Erde-Mond-Schwerpunkt, mit nominellen Fehlern von 20″ in Länge, 8″ in
  Breite und 6000 km im Abstand ([JPL Approximate Positions](quelle:jpl-approx-pos)). Orrery
  setzt den Erdmittelpunkt auf diesen Schwerpunkt und den Mond mit festen $a$, $e$, $I$ und
  linear fortgeschriebenen Winkeln relativ dazu. Der wahre Erdmittelpunkt liegt um
  $\mu/(1 + \mu)$ des Mondabstands daneben, mit den Mondelementen des Modells 4415 bis 4928 km,
  von der Sonne aus bis zu 6,9″; der Vektor von der Erde zum Mond ist davon nicht betroffen.
- **Zeit:** Die Uhr zählt julianische Tage in UTC und setzt sie ohne Umrechnung als TDB ein.
  Seit 2017 gilt
  $\mathrm{TT} - \mathrm{UTC} = 32{,}184\,\mathrm{s} + 37\,\mathrm{s} = 69{,}184\,\mathrm{s}$,
  und TDB weicht von TT nur um Millisekunden ab; die Erde bleibt dadurch 2,8″ in Länge zurück.
- **Datenblock:** Der Durchmesser 12 742 km ist der doppelte mittlere Radius, nicht der
  Äquatordurchmesser; die Kugel ist nicht abgeplattet. Die Umlaufzeit 365,2 Tage rechnet der
  Datenblock nach Kepler aus $a$ zur Epoche und $G\,(M_\odot + M_\oplus)$: 365,2495 Tage, rund
  zehn Minuten weniger als die $360^\circ/\dot{L} = 365{,}2564$ Tage der Bewegung. Das liegt vor
  allem an CODATA-$G$ mal Sonnenmasse des Datensatzes, 45 ppm über der heliozentrischen
  Gravitationskonstante ([Petit und Luzum 2010](literatur:petit-2010)); mit dieser wären es
  365,2578 Tage. Die Exzentrizität 0,017 ist der Tafelwert zur Uhrzeit.
- **Rotation:** Für die Erde gibt es kein IAU-Rotationsmodell mehr; die früheren Näherungen
  waren ungenau, versagten nahe J2000,0 und wurden zugunsten der IERS-Modelle gestrichen
  ([Archinal et al. 2018](literatur:archinal-2018)). Orrery dreht die Erde gleichförmig mit der
  siderischen Periode 23,9345 h ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)), 0,101 s länger
  als eine Umdrehung nach dem Erdrotationswinkel. Bei JD 2 451 545,0 zeigt der Nullmeridian der
  Karte zur Rektaszension 0°, der Erdrotationswinkel betrug aber 280,46°. Der Globus ist deshalb
  um 79,5° verdreht, am 17. September 2026 um 75,4°; Tag und Nacht liegen über falschen Längen.
- **Pol und Achsneigung:** Der Pol steht fest bei Rektaszension 0° und Deklination 90°, ohne
  Präzession, Nutation und Polbewegung; nach $\delta_0 = 90{,}00^\circ - 0{,}557^\circ\,T$
  ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)) wäre er bis 2026 um rund 0,15° gewandert. Die
  Umrechnung von Polrichtungen in die Ekliptik nutzt die Schiefe 84 381,448″ von IAU 2000 statt
  84 381,406″ ([Petit und Luzum 2010](literatur:petit-2010)). Die Achsneigung 23,4° im
  Datenblock ist der Winkel zur Bahnnormale zur Epoche, 23,43928°; am 17. September 2026 beträgt
  die mittlere Schiefe 23,4358°.
- **Albedo:** Ein Faktor von rund 3,2 hebt die mittlere lineare Reflexion der wolkenlosen
  Tageskarte, rund 0,13, auf die geometrische Albedo 0,434; die Helligkeit der Wolken liegt so
  auf Land und Meer. Das Material streut im Wesentlichen lambertsch, und eine solche Kugel hat
  $p = 2A/3 = 0{,}29$ und die Bond-Albedo $A = 0{,}434$, trifft also keinen der Messwerte 0,434
  und 0,294. Wolken und Atmosphäre fehlen, nur der Kernschatten ist für Mondfinsternisse
  gefärbt.
- Die Tag-Nacht-Grenze aus der Nähe zeigt [Sonnenaufgang über dem Erdrand](szene:erdaufgang);
  weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
