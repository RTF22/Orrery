# Ceres

Ceres ist der größte Körper des Asteroidenhauptgürtels zwischen den Bahnen von
[Mars](objekt:mars) und [Jupiter](objekt:jupiter) und der einzige Zwergplanet, den eine
Raumsonde aus der Nähe vermessen hat. Giuseppe Piazzi entdeckte ihn am 1. Januar 1801 vom
Observatorium Palermo aus, zunächst für einen Planeten in der von Bode postulierten Lücke
zwischen Mars und Jupiter gehalten; mit der Entdeckung weiterer, kleinerer Körper am
selben Ort wurde Ceres binnen weniger Jahrzehnte zum Asteroiden herabgestuft, bevor die
Internationale Astronomische Union sie 2006 zusammen mit Pluto und dem neu entdeckten Eris
als [Zwergplaneten](thema:zwergplaneten) neu einordnete ([IAU 2006](literatur:iau-2006)) —
dieselbe Definition, die auch [Plutos](objekt:pluto) Einstufung begründet. Von März 2015 bis
zum Treibstoffende im Oktober 2018 umkreiste die NASA-Sonde Dawn Ceres aus zuletzt weniger
als 400 km Höhe und lieferte Schwerefeld, Form, Zusammensetzung und eine globale Kartierung
([Russell et al. 2016](literatur:russell-2016)) — die einzige Nahaufnahme eines
Zwergplaneten des Hauptgürtels, während die transneptunischen Zwergplaneten bislang nur aus
der Ferne bekannt sind. Dieser Text stellt Kenngrößen, Inneres, Oberfläche, die
vorübergehende Exosphäre, Bahn und Entstehung dar und beschreibt zuletzt, was Orrery davon
abbildet; die Szene [Ceres im Asteroidengürtel](szene:ceres-guertel) zeigt den Zwergplaneten
inmitten der Punktwolke des Modellgürtels.

## Kenngrößen und Messung

Radiometrische Bahnverfolgung und optische Landmarkennavigation während der letzten,
niedrigsten Umlaufbahnen ergaben ein Schwerefeld bis Grad 18 und einen Gravitationsparameter
$GM = 62{,}6284\,\mathrm{km^3\,s^{-2}}$ ([Park et al. 2016](literatur:park-2016);
[Konopliv et al. 2018](literatur:konopliv-2018)). Mit $G = 6{,}67430 \cdot
10^{-20}\,\mathrm{km^3\,kg^{-1}\,s^{-2}}$ (CODATA 2018) folgt daraus eine Masse von
$9{,}3835 \cdot 10^{20}\,\mathrm{kg}$; die aus dieser gerundeten Masse zurückgerechnete
Kontrollgröße $G \cdot M = 62{,}62829\,\mathrm{km^3\,s^{-2}}$ trifft den gemessenen Wert auf
rund 1,7 ppm (Herleitung) — der winzige Rest geht allein auf die Rundung der Masse auf fünf
Stellen zurück.

Das aus der Formfigur bestimmte Ellipsoid hat Halbachsen um $a \approx 482\,\mathrm{km}$,
$b \approx 482\,\mathrm{km}$ und $c \approx 446\,\mathrm{km}$ ([Park et al. 2016](literatur:park-2016);
verschiedene Tabellen derselben Arbeit nennen für $a$ und $b$ Werte zwischen 481 und 483 km,
siehe Belegliste). Das geometrische Mittel $(a\cdot b\cdot c)^{1/3} \approx 469{,}75\,\mathrm{km}$
trifft den mittleren Radius von $469{,}7\,\mathrm{km}$ auf rund 0,01 Prozent (Herleitung).
Ceres ist am Äquator praktisch kreisförmig ($a$ und $b$ unterscheiden sich um rund 0,02
Prozent), aber deutlich abgeplattet: Bezogen auf den Mittelwert von $a$ und $b$ beträgt die
polare Abplattung rund 7,5 Prozent (Herleitung) — mehr, als ein Körper im hydrostatischen
Gleichgewicht der heutigen, langsamen Rotation erwarten ließe (siehe Inneres). Mit Masse und
mittlerem Radius ergibt sich über $\bar\rho = 3\,GM/(4\pi G R^3)$ eine mittlere Dichte von
rund $2{,}162\,\mathrm{g\,cm^{-3}}$ (Herleitung) — deutlich über der von Wassereis und
deutlich unter der von Gestein, ein erster Hinweis auf einen geschichteten Körper.

| Größe | Wert | Unsicherheit | Verfahren | Beleg |
|---|---|---|---|---|
| $GM$ | $62{,}6284\,\mathrm{km^3\,s^{-2}}$ | – | Radiometrische Bahnverfolgung, Dawn | [Park et al. 2016](literatur:park-2016) |
| Radius (Volumenmittel) | $469{,}7\,\mathrm{km}$ | – | Formfigur aus Stereophotoklinometrie | [Park et al. 2016](literatur:park-2016) |
| mittlere Dichte | $2{,}162\,\mathrm{g\,cm^{-3}}$ | – | Herleitung aus $GM$ und Radius | Herleitung |
| $J_2$ | $0{,}026499$ | $0{,}0000008$ | Schwerefeld, Referenzradius 470 km | [Park et al. 2016](literatur:park-2016) |
| normiertes (polares) Trägheitsmoment | $0{,}37$ | $0{,}01$ | Schwerefeld mit hydrostatischer Näherung | [Park et al. 2016](literatur:park-2016); [Ermakov et al. 2017](literatur:ermakov-2017) |
| Rotationsperiode | $9{,}074170\,\mathrm{h}$ | $0{,}000001\,\mathrm{h}$ | Bahnverfolgung und Formkontrolle | [Konopliv et al. 2018](literatur:konopliv-2018) |
| Pol (Rektaszension/Deklination) | $291{,}427^\circ/66{,}760^\circ$ | – | wie oben | [Konopliv et al. 2018](literatur:konopliv-2018) |
| geometrische Albedo (HST, V-Band) | $0{,}090$ | $0{,}003$ | erdgebundene Photometrie | [Li et al. 2006](literatur:li-2006) |
| geometrische Albedo (Dawn, 0,55 µm) | $0{,}094$ | $0{,}008$ | VIR-Spektrophotometrie | [Ciarniello et al. 2017](literatur:ciarniello-2017) |
| Bond-Albedo | $0{,}034$ | $0{,}001$ | Framing-Camera-Photometrie | [Ciarniello et al. 2017](literatur:ciarniello-2017) |

## Inneres

Aus Schwerefeld und Form leiteten Park et al. einen dichten, teilweise differenzierten
Gesteinskern unter einer leichteren, flüchtigenreichen Hülle ab. Unter der Annahme, dass die
heutige Form dem hydrostatischen Gleichgewicht der gemessenen Rotation entspricht, ergibt
sich ein normiertes polares Trägheitsmoment von $0{,}37 \pm 0{,}01$ — deutlich unter dem Wert
$0{,}4$ einer homogenen Kugel, aber noch weit über dem eines vollständig differenzierten
Körpers mit scharfer Kern-Mantel-Grenze ([Park et al. 2016](literatur:park-2016)). Wie stark
die reale Form vom hydrostatischen Idealfall abweicht, ist Teil dieser Unsicherheit selbst:
Ein rotationssymmetrisches Ellipsoid trifft das gemessene Schwerefeld nur auf einige Prozent
und die gemessene Form nur auf einige Prozent genau; Ceres nähert sich dem hydrostatischen
Gleichgewicht also an, erreicht es aber nicht exakt (siehe Belegliste).

Ein Zweischichtmodell aus Admittanz (dem Verhältnis von Schwere- zu Topographiesignal) und
Form verfeinert dieses Bild: Eine rund 41 km dicke, leichte Oberschicht mit einer
angepassten Dichte um $1287\,\mathrm{kg\,m^{-3}}$ liegt über einem dichteren Mantel mit rund
$2434\,\mathrm{kg\,m^{-3}}$ ([Ermakov et al. 2017](literatur:ermakov-2017)). Eine unabhängige
Auswertung der Topographie kommt für dieselbe Oberschicht auf mindestens 30 Volumenprozent
leichter, fester Phasen zusätzlich zum Eis — vereinbar mit Salzen oder Gashydraten
(Klathraten), nicht aber mit reinem Wassereis, das unter der beobachteten Last bei Ceres'
Temperaturen bereits merklich fließen würde ([Fu et al. 2017](literatur:fu-2017)). Die
Kruste aus Eis, Salzen, Hydraten und Phyllosilikaten mit rund 40 km Dicke ist damit keine
reine Eisschale, sondern eine feste, salzreiche Mischung, deren mechanische Festigkeit die
beobachtete Topographie über geologische Zeiträume trägt.

Unter dieser Kruste sprechen mehrere Befunde für zumindest zeitweilig mobile, tiefe
Solereservoire statt eines vollständig gefrorenen Körpers: Schweredaten und thermische
Modellrechnungen zusammen legen nahe, dass der Einschlag, der den 92 km durchmessenden
Krater Occator formte, eine tiefe Solekammer an der Kruste-Mantel-Grenze aufriss und über
geologische Zeiträume Sole an die Oberfläche beförderte
([Raymond et al. 2020](literatur:raymond-2020)). Ob dahinter ein einzelnes, ausgedehntes
Reservoir oder mehrere unabhängige, inzwischen weitgehend erstarrte Taschen stehen, ordnet
eine spätere Einschätzung als eine der offenen Fragen der „Ozeanwelt Ceres" ein
([Castillo-Rogez 2020](literatur:castillo-rogez-2020)). Zum Trägheitsmomentfaktor und zur
Kernbildung bei Körpern allgemein siehe
[Innerer Aufbau aus Schwerefeld und Rotation](thema:innerer-aufbau).

## Oberfläche

Ceres' Oberfläche ist dunkel (Albedowerte siehe Kenngrößen) und global von
ammoniumhaltigen Schichtsilikaten (Phyllosilikaten) durchzogen — ein im heutigen Hauptgürtel
ungewöhnlicher Befund, weil Ammoniak bei den dort herrschenden Temperaturen eigentlich nicht
kondensiert ([De Sanctis et al. 2015](literatur:desanctis-2015); Deutung siehe Entstehung und
Entwicklung). Die mit Abstand hellsten Flecken der Oberfläche liegen im 92 km großen Krater
Occator: Spektren der Faculae Cerealia und Vinalia zeigen dort überwiegend Natriumkarbonat
neben etwas Ammoniumkarbonat oder -chlorid, Rückstände auskristallisierter Solen, die nach
dem Einschlag entlang von Bruchsystemen aufstiegen
([De Sanctis et al. 2016](literatur:desanctis-2016)). Hochauflösende Aufnahmen aus der
letzten, niedrigsten Orbitphase zeigen, dass diese Aktivität nicht mit dem rund 22 Millionen
Jahre alten Einschlag selbst endete: Ein Teil der hellen Ablagerungen und begleitender
Fließstrukturen entstand erst Jahrmillionen später, frühestens vor rund 9 Millionen Jahren,
und deutet auf ein langes, bis in geologisch junge Zeit reichendes kryovulkanisches
Nachwirken hin ([Nathues et al. 2020](literatur:nathues-2020)).

Auch abseits von Occator gibt es Anzeichen für Kryovulkanismus: Ahuna Mons, eine rund 17 km
breite und 4 km hohe, kegelförmige Kuppel ohne Gegenstück anderswo auf Ceres, lässt sich am
besten als Extrusion einer zähen, salzreichen Kryolava erklären, die vor rund 210 Millionen
Jahren erstarrte ([Ruesch et al. 2016](literatur:ruesch-2016)) — jung genug, dass
Ceres trotz ihrer geringen Größe bis in geologisch junge Zeit innere Wärme und mobile
Flüssigkeiten besaß. Am Krater Ernutet fanden sich zudem lokal begrenzte Ablagerungen
aliphatischer organischer Verbindungen; ihre Konzentration und Verteilung lassen einen
äußeren Ursprung (etwa durch einen kohlenstoffreichen Einschlagskörper) unwahrscheinlich
erscheinen, näher liegt eine Entstehung im Inneren Ceres' selbst
([De Sanctis et al. 2017](literatur:desanctis-2017)).

Wasser tritt nicht nur gebunden in Silikaten und Karbonaten auf: Das Gammastrahlen- und
Neutronenspektrometer GRaND wies unter dem obersten Regolith, besonders in höheren Breiten,
ausgedehnte Wassereisvorkommen nach, vereinbar mit einem chemisch veränderten, aber
eisreichen Untergrund ([Prettyman et al. 2017](literatur:prettyman-2017)); im rund 10 km
großen, geologisch sehr jungen Krater Oxo entdeckte das Spektrometer VIR eine lokal
freiliegende H₂O-Fläche — eine der wenigen damals direkt in Reflexion nachgewiesenen
Wassereisflächen auf der sonnenzugewandten Seite eines Hauptgürtelkörpers
([Combe et al. 2016](literatur:combe-2016)).

Die globale Kraterstatistik zeigt eine dicht, aber ungleich verteilte, weder rein eisige noch
rein felsige Kruste, deren Übergangsdurchmesser vom einfachen zum komplexen Krater dazwischen
liegt; ein glattes Gebiet nahe dem Krater Kerwan ergibt je nach angesetztem Chronologiemodell
ein Alter von 550 bis 720 Millionen Jahren
([Hiesinger et al. 2016](literatur:hiesinger-2016)). Auffällig ist zugleich das fast
vollständige Fehlen sehr großer Becken: Kollisionsmodelle des dezimierten Hauptgürtels sagen
für 4,55 Milliarden Jahre Geschichte 10 bis 15 Becken über 400 km Durchmesser voraus, doch
der größte auf Ceres identifizierte Krater bleibt deutlich unter rund 280 km — am ehesten
erklärt durch viskose Relaxation einer tiefen, eisreichen Schicht oder durch nachträgliches
Überfließen mit Kryolava, die alte, große Becken im Lauf der Zeit eingeebnet haben
([Marchi et al. 2016](literatur:marchi-2016)).

## Atmosphäre und Magnetosphäre

Ceres besitzt keine dauerhafte Gashülle, aber eine vorübergehende, extrem dünne
Wasserdampf-Exosphäre: Das Weltraumteleskop Herschel wies 2012/2013 im fernen Infrarot
lokalisierte Quellen nach, aus denen zusammen mindestens rund $10^{26}$ Wassermoleküle je
Sekunde entwichen, konzentriert auf mittlere Breiten und zeitlich veränderlich; als Ursache
kommen sowohl kometenartige Sublimation von oberflächennahem Eis als auch Kryovulkanismus in
Frage, ohne dass die Beobachtung selbst zwischen beiden unterscheiden könnte
([Küppers et al. 2014](literatur:kueppers-2014)). Ob und wie diese Quellen mit der unter
Oberfläche beschriebenen jungen Aktivität in Occator zusammenhängen, ist offen (siehe Offene
Fragen).

Ob Ceres ein eigenes, von einem inneren Dynamo erzeugtes Magnetfeld besitzt, hat Dawn nicht
direkt geprüft: Aus Kostengründen strich die Mission das ursprünglich vorgesehene
Magnetometer bereits vor dem Start, sodass das Instrumentenpaket aus Kameras, Spektrometer
und Radiowissenschaft ohne In-situ-Feldmessung auskommen musste
([Russell et al. 2016](literatur:russell-2016)). Eine direkte obere Schranke für ein
etwaiges Feld liegt aus dieser Mission also nicht vor; angesichts der geringen Größe, der
wahrscheinlich seit Langem erstarrten Kernregion und des Fehlens jedes indirekten Hinweises
gilt ein aktives Dynamofeld als unwahrscheinlich, ist damit aber nicht ausgeschlossen.

## Bahn, Rotation und Dynamik

Ceres' oskulierende Bahnelemente aus der JPL Small-Body Database lauten
$a = 2{,}7655\,\mathrm{AU}$, $e = 0{,}0797$ und $i = 10{,}59^\circ$ gegen die Ekliptik (Zahlen
wie [Bahnelemente](thema:bahnelemente)); daraus folgt über das dritte Keplersche Gesetz mit
der Sonnenmasse eine Umlaufzeit von $1679{,}8$ Tagen beziehungsweise $4{,}60$ Jahren
(Herleitung) — die einfache Kepler-Gegenprobe (Umlaufzeit in Jahren gleich der großen
Halbachse in Astronomischen Einheiten hoch drei halbe) liefert $4{,}599$ Jahre und bestätigt
den Wert auf rund 0,0004 Prozent.

Diese Bahn liegt im äußeren Hauptgürtel zwischen zwei der markantesten
[Kirkwood-Lücken](thema:kirkwood-luecken): der 3:1-Mittelbewegungsresonanz mit Jupiter bei
$2{,}50\,\mathrm{AU}$ und der 5:2-Resonanz bei $2{,}82\,\mathrm{AU}$ (Zahlen wie
[Bahnresonanzen](thema:resonanzen)). Ceres steht mit rund 0,26 AE Abstand zur inneren und
nur rund 0,06 AE Abstand zur äußeren Lücke deutlich näher an der 5:2-Resonanz (Herleitung),
ohne selbst in einer der beiden gefangen zu sein — anders als etwa die Hilda-Asteroiden in
der stabilen 3:2-Resonanz weiter außen ([Nesvorný 2018](literatur:nesvorny-2018)). Mit einer
Masse von $9{,}3835 \cdot 10^{20}\,\mathrm{kg}$ und einer aus der Bewegung von Planeten und
Raumsonden bestimmten Gesamtmasse des Hauptgürtels von $(4{,}008 \pm 0{,}029) \cdot
10^{-4}$ Erdmassen ([Pitjeva und Pitjev 2018](literatur:pitjeva-2018)) trägt Ceres allein
rund 39 Prozent der gesamten Gürtelmasse (Herleitung) — mehr als jeder andere einzelne
Körper des Hauptgürtels.

Ihre Entdeckung geht auf Giuseppe Piazzi zurück, der Ceres am 1. Januar 1801 zunächst für
einen Planeten in der von Bode postulierten Lücke zwischen Mars und Jupiter hielt; mit der
Entdeckung von Pallas (1802), Juno (1804) und Vesta (1807) am selben Ort setzte sich binnen
weniger Jahrzehnte die Einordnung als eigene Körperklasse „Asteroid" durch. Erst 2006 ordnete
die Internationale Astronomische Union Ceres zusammen mit Pluto und dem neu entdeckten Eris
als [Zwergplaneten](thema:zwergplaneten) ein ([IAU 2006](literatur:iau-2006)) — dieselbe, am
Freiräumen der Bahnumgebung orientierte Definition, die auch Plutos Einstufung begründet, mit
derselben ungelösten Grundsatzfrage, ob eine rein geophysikalische Definition sachgerechter
wäre (siehe [Pluto](objekt:pluto)).

## Entstehung und Entwicklung

Der weiträumige Nachweis ammoniumhaltiger Tonminerale wirft die Frage nach Ceres'
Entstehungsort auf: Weil Ammoniak im heutigen Hauptgürtel bei den dort herrschenden
Temperaturen nicht kondensiert, deuteten De Sanctis et al. ihn als Hinweis auf eine Herkunft
aus größerer heliozentrischer Entfernung, sei es durch Entstehung weiter außen mit
anschließender Einwanderung oder durch nachträglichen Materialtransport in den Gürtel
([De Sanctis et al. 2015](literatur:desanctis-2015)). Eine Gegenposition erklärt denselben
Befund ohne Wanderung: Die übrige Mineralogie und Geochemie Ceres' ähnelt insgesamt stark den
CI/CM-kohligen Chondriten, und das beobachtete Ammonium ließe sich ebenso durch Metamorphose
organischer Vorläuferstoffe im Inneren Ceres' selbst erzeugen, ohne dass der Körper jemals
weiter außen gelegen haben müsste ([McSween et al. 2018](literatur:mcsween-2018)). Welche der
beiden Erklärungen zutrifft, ist nicht entschieden (siehe Offene Fragen).

Beide Deutungen lassen sich in die größeren Entstehungsszenarien des Hauptgürtels einordnen:
Nach dem Bild eines ursprünglich fast leeren Gürtels wanderten die heutigen Asteroiden erst
nachträglich aus benachbarten Regionen ein
([Raymond und Izidoro 2017](literatur:raymond-2017)); der Grand Tack erklärt die
durchmischte, aus innerem S-Typ- und äußerem C-Typ-Material bestehende Zusammensetzung des
Gürtels durch eine kurzzeitige Einwärts- und Auswärtswanderung Jupiters, die ihn zunächst
ausdünnte und dann teilweise neu befüllte ([Walsh et al. 2011](literatur:walsh-2011)); als
Ceres' Vorläuferpopulation kämen darin sowohl Körper aus dem heutigen Gürtelbereich als auch
von außen herangeführte Objekte in Betracht (Zahlen und Einordnung unter
[Entstehung des Sonnensystems](thema:entstehung)). Unabhängig von der genauen Herkunft zählt
Ceres wegen ihrer Größe, ihrer erhaltenen Flüchtigen und ihrer mutmaßlich frühen, aber
unvollständigen Differenzierung zu den wichtigsten Zeugen dieser Frühphase — ein Grund,
weshalb die Decadal Survey der National Academies eine Ceres-Probenrückführung, gezielt zur
Untersuchung der Solenablagerungen und der Bewohnbarkeit, als mögliches Ziel eines
mittelgroßen New-Frontiers-Vorschlags nennt
([National Academies of Sciences 2022](literatur:national-academies-2022)).

## Offene Fragen

- **Wo entstand Ceres?** Ammoniumhaltige Tonminerale sprechen für eine Herkunft aus größerer
  heliozentrischer Entfernung oder für nachträglich eingewanderten Rohstoff
  ([De Sanctis et al. 2015](literatur:desanctis-2015)); die insgesamt kohlenstoffchondritische
  Zusammensetzung ist ebenso mit einer Entstehung im heutigen Gürtel und innerer
  Ammoniakfreisetzung durch Metamorphose vereinbar ([McSween et al. 2018](literatur:mcsween-2018)).
- **Wie ausgedehnt und wie lange flüssig sind die heutigen Solereservoire?** Schweredaten und
  Thermalmodelle sprechen für eine tiefe, durch den Occator-Einschlag mobilisierte Solekammer
  ([Raymond et al. 2020](literatur:raymond-2020)); ob daraus ein zusammenhängendes, noch heute
  teilweise flüssiges Reservoir oder mehrere längst erstarrte Resttaschen folgen, ist offen
  ([Castillo-Rogez 2020](literatur:castillo-rogez-2020)).
- **Wie viel Eis enthält die Kruste tatsächlich?** Admittanzmodelle legen eine rund 41 km
  dicke Schicht mit einer effektiven Dichte um $1287\,\mathrm{kg\,m^{-3}}$ nahe
  ([Ermakov et al. 2017](literatur:ermakov-2017)); eine unabhängige, aus der Topographie
  gewonnene Abschätzung verlangt mindestens 30 Volumenprozent salz- oder klathratreicher
  fester Phasen neben dem Eis, ohne den genauen Eisanteil selbst festzulegen
  ([Fu et al. 2017](literatur:fu-2017)).
- **Woher stammt der beobachtete Wasserdampf?** Kometenartige Sublimation von
  oberflächennahem Eis und Kryovulkanismus sind beide mit den lokalisierten, zeitlich
  veränderlichen Herschel-Quellen vereinbar, ohne dass sich die beiden Erklärungen bislang
  trennen ließen ([Küppers et al. 2014](literatur:kueppers-2014)).
- **Warum fehlen große, alte Einschlagbecken?** Kollisionsmodelle sagen mehrere Becken über
  400 km Durchmesser voraus, die Oberfläche zeigt aber keines über rund 280 km; ob viskose
  Relaxation einer eisreichen Tiefenschicht, Überfließen mit Kryolava oder eine gegenüber den
  Modellannahmen abweichende frühe Einschlagsgeschichte die Ursache ist, bleibt offen
  ([Marchi et al. 2016](literatur:marchi-2016)).

## Im Modell

- **Form:** Der Datensatz führt Ceres als Kugel mit `radiusKm` $469{,}7$ ohne Abplattung; die
  aus den Halbachsen hergeleitete polare Abplattung von rund 7,5 Prozent (siehe Kenngrößen)
  fehlt im Modell vollständig, während die äquatoriale Abweichung von der Kreisform mit rund
  0,02 Prozent ohnehin unter jeder Darstellungsgenauigkeit liegt.
- **Textur:** `textures/ceres/albedo.jpg` ist laut `ASSETS.md` eine „fictional"-Karte von
  Solar System Scope, also eine an bekannte Farbe und Albedo angenäherte künstlerische
  Darstellung, obwohl Dawn tatsächlich globale, photographisch belegte Karten geliefert hat
  ([Russell et al. 2016](literatur:russell-2016)); Occators helle Flecken, Ahuna Mons und die
  übrigen unter Oberfläche beschriebenen Strukturen erscheinen darin nicht in ihrer realen
  Form und Lage.
- **Rotation und Pol:** `rotationPeriodH` $9{,}074170$ und Pol $291{,}418^\circ/66{,}764^\circ$
  treffen die von Konopliv et al. bestimmten Werte $9{,}074170\,\mathrm{h}$ und
  $291{,}427^\circ/66{,}760^\circ$ auf wenige Tausendstel Grad
  ([Konopliv et al. 2018](literatur:konopliv-2018)). `rotationAtEpochDeg` steht dagegen auf
  $0$, während das zugehörige IAU-Rotationsmodell zur Epoche J2000 einen Nullmeridian bei
  $W_0 \approx 170{,}3^\circ$ ansetzt (Konopliv et al. 2018) — Orrerys Textur ist gegenüber dem
  tatsächlichen, an einer Kraterkette verankerten Nullmeridian also um rund 170 Grad verdreht.
  Weil die Textur ohnehin eine „fictional"-Karte ist, hat dieser Versatz keine sichtbare
  Auswirkung auf einzelne Oberflächenformen. Die mit `achsneigungDeg` unabhängig
  nachgerechnete Schiefe trifft $4{,}04^\circ$ — eine kleine, aber von null verschiedene
  Neigung gegen die eigene Bahnnormale, wie sie aus Pol und Bahnelementen folgt.
- **Bahn:** Ceres läuft heliozentrisch mit oskulierenden SBDB-Elementen zur eigenen Epoche
  JD 2 461 200,5, alle Raten außer $\dot L$ null (Zahlen wie
  [Bahnelemente](thema:bahnelemente)); $a = 2{,}7655\,\mathrm{AU}$, $e = 0{,}0797$ und
  $i = 10{,}59^\circ$ treffen die im Text genannten Werte. Weil damit die säkulare Drehung von
  Perihel und Knoten fehlt, wächst der Ortsfehler mit der Zeitdistanz zur Fit-Epoche; die für
  Ceres dokumentierte säkulare Apsidendrehung von rund 54 Bogensekunden je Jahr liefert die
  Größenordnung dieses Fehlers (eigene Abschätzung, Größenordnung): über ein Jahrhundert
  einige Zehntel Grad, ähnlich der Größenordnung, die für [Pluto](objekt:pluto) dokumentiert
  ist.
- **Kirkwood-Lücken im Gürtelmodell:** Der dargestellte Hauptgürtel (`sim/belts.ts`) erzeugt
  seine Lücken als eingebaute, gaußförmige Dichteeinbrüche und nicht aus tatsächlicher
  Bahndynamik; er rechnet mit $a_\mathrm{J} = 5{,}2044\,\mathrm{AU}$ statt der in
  [Bahnresonanzen](thema:resonanzen) verwendeten $5{,}203\,\mathrm{AU}$, wodurch die
  3:1-Lücke im Modell bei $2{,}5020\,\mathrm{AU}$ statt $2{,}5013\,\mathrm{AU}$ und die
  5:2-Lücke bei $2{,}8254\,\mathrm{AU}$ statt $2{,}8246\,\mathrm{AU}$ liegt (Herleitung) — eine
  Verschiebung von rund 0,0007 bis 0,0008 AE, weit unter jeder sichtbaren Auflösung. Ceres
  selbst ist als eigener Körper, nicht als Teil dieser Punktwolke, dargestellt; an ihrem Ort
  ergibt die Dichtefunktion praktisch keinen Einbruch mehr, in Übereinstimmung damit, dass
  Ceres zwischen, nicht in einer der beiden Lücken liegt.
- **Hauptgürtel-Albedo:** Die Punktwolke des Hauptgürtels trägt für alle Teilchen einheitlich
  die Albedo $0{,}06$ (Zahlen wie [Entstehung des Sonnensystems](thema:entstehung)), deutlich
  unter Ceres' eigener Albedo von $0{,}090$ — Ceres erscheint im Bild also heller als die sie
  umgebende Punktwolke, was der realen Größenordnung der Albedowerte entspricht, auch wenn das
  Modell keine Typunterscheidung (etwa S- gegen C-Typ) trifft.
- **Was fehlt:** keine Wasserdampf-Exosphäre, kein Magnetfeld-Modell (mangels Messung ohnehin
  nicht bestimmbar), keine Occator-Faculae oder Ahuna Mons als eigene Geometrie außerhalb der
  Textur, keine zeitliche Entwicklung der Kryovulkanik. Als heliozentrischer Zwergplanet
  (`kind: 'dwarf'`, `parent: 'sun'`) skaliert Ceres wie jeder Planet mit der
  Abstandskompression der Darstellung, nicht mit `sizeScale` wie ein Satellit
  (`sim/scale.ts`).
- **Datenblock gegen Messwerte:** Die im Datensatz geführte Masse ergibt
  $GM = 62{,}62829\,\mathrm{km^3\,s^{-2}}$, rund 1,7 ppm unter dem in Kenngrößen genannten
  gemessenen Wert; Rotationsperiode, Pol und Albedo treffen die Literatur wie oben beschrieben
  auf wenige Promille oder besser. Die Umlaufzeit rechnet der Datenblock über
  `umlaufzeitTage` aus $a$ und $G\,(M_\odot+M_\mathrm{Ceres})$; sie trifft die aus
  $\dot L$ tatsächlich bewegte Periode auf rund 0,002 Prozent, praktisch deckungsgleich, weil
  beide Rechnungen auf derselben Halbachse beruhen. Jeder Körper trägt seine Albedo normiert
  auf den Reglerbereich ([Albedo und Helligkeit](thema:photometrie)). Weitere
  Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
