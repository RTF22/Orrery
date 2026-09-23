# Achsneigung

Die Achsneigung oder Schiefe $\varepsilon$ eines Körpers ist der Winkel zwischen seiner Spinachse
und der Normale auf seiner eigenen Bahnebene. Sie legt fest, ob und wie stark ein Körper
Jahreszeiten hat, treibt über äußere Drehmomente ihre eigene langsame Wanderung an und ist bei den
Riesenplaneten selbst Gegenstand ungelöster Streitfragen. Dieser Text ordnet die Definition, stellt
Messwerte und Modellwerte aller Planeten, Plutos und der Sonne gegenüber, leitet die
Insolationsformel und die Präzessionsrate her, verfolgt die langfristige Entwicklung der Schiefe von
Erde, Mars, Venus und Merkur und schließt mit den konkurrierenden Erklärungen für die extreme Kippung
des [Uranus](objekt:uranus) – der zugleich das Kernproblem dieser Etappe ist: Wie kippt ein Planet um
fast 98°, ohne dass seine Monde von ihren äquatorialen, prograden Bahnen abweichen?

## Definition der Schiefe

Formal ist die Schiefe der Winkel zwischen dem Drehimpulsvektor eines Körpers (seiner Spinachse im
physikalischen Sinn) und der Normale seiner Bahnebene. In der Praxis der [Bezugssysteme](thema:bezugssysteme)
wird dieser physikalische Winkel jedoch selten direkt angegeben: Die IAU-Arbeitsgruppe für
Rotationselemente definiert stattdessen einen Nordpol, der unabhängig vom tatsächlichen Drehsinn
geometrisch nördlich der invariablen Ebene des Sonnensystems liegt, und beschreibt die Rotation über
den Winkel $W$ des Nullmeridians mit einer Rate $\dot W$. Ist $\dot W$ negativ, dreht der Körper
rückläufig, und der so gemessene Winkel zwischen diesem geometrischen Nordpol und der Bahnnormale
liegt über 90° – er ist dann nicht mehr der physikalische Neigungswinkel der Drehachse, sondern
dessen Ergänzung auf 180°. Venus mit 177° und Uranus mit 98° „stehen" in dieser Zählweise also nicht
kopfüber im Sinn einer Neigung nahe 180° ihrer tatsächlichen Drehachse, sondern ihre physikalische
Drehachse liegt nur wenig von der Bahnnormale entfernt (Venus rund 3°, Uranus rund 82°), nur eben mit
umgekehrtem Drehsinn. Für Zwergplaneten, Kleinkörper und ihre Monde gilt dagegen nicht diese
Nordpol-Konvention großer Körper, sondern schlicht der positive Pol nach der Rechte-Hand-Regel
([Archinal et al. 2011](literatur:archinal-2011); [Archinal et al. 2019](literatur:archinal-2019)).

Ebenso zu unterscheiden ist die Schiefe gegen die eigene Bahn von der Schiefe gegen die Ekliptik: Nur
wenn die Bahnebene selbst mit der Ekliptik zusammenfällt, sind beide Winkel gleich. Uranus' Bahn ist
mit 0,77° gegen die Ekliptik geneigt; sein Pol liegt bei Rektaszension 257,311°, Deklination −15,175°.
Gegen die Ekliptik gemessen (ohne die 180°-Ergänzung der Nordpol-Konvention) beträgt der rohe Winkel
zwischen Pol und Ekliptiknormale 82,278°, mit Ergänzung also 97,722° – gegen die eigene Bahnnormale
sind es dagegen 97,77° (siehe unten). Der Unterschied von nur 0,048° fällt hier klein aus, weil die
Bahnneigung selbst klein ist; bei einem Körper mit stärker geneigter Bahn wäre er größer. Venus zeigt
den Unterschied besonders deutlich: Ihr Pol liegt bei Rektaszension 272,76°, Deklination 67,16° – nur
1,24° vom Ekliptiknordpol entfernt, also praktisch parallel zur Ekliptikachse. Erst die 180°-Ergänzung
wegen der rückläufigen Rotation und die Neigung der Venusbahn von 3,39° gegen die Ekliptik ergeben
zusammen die bekannten 177° gegen die eigene Bahn.

## Messwerte und Modellwerte

Die folgende Tabelle vergleicht die veröffentlichten Messwerte mit dem Modellwert, den Orrery über
`achsneigungDeg` aus Pol und Bahnnormale zur Epoche J2000 berechnet (Herleitung siehe „Im Modell").
Für die Sonne gibt es keine Bahn; ihr Wert ist der Winkel zwischen Pol und Ekliptiknormale.

| Körper | Messwert | Modell | Quelle |
|---|---|---|---|
| Merkur | 0,034° | 0,034° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Venus | 177,4° | 177,362° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Erde | 23,4° | 23,439° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Mars | 25,2° | 25,192° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Jupiter | 3,1° | 3,120° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Saturn | 26,7° | 26,730° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Uranus | 97,8° | 97,770° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Neptun | 28,3° | 28,318° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Pluto | 119,5° | 119,614° | [NSSDC-Faktenblätter](quelle:nssdc-factsheets) |
| Sonne | 7,25° | 7,2517° | [Archinal et al. 2011](literatur:archinal-2011) |

Die Übereinstimmung ist eng, aber nicht zufällig exakt: Der Modellwert übernimmt denselben Pol, den
auch die Messungen liefern, rechnet die Bahnnormale aber selbst aus den tabellierten Bahnelementen
zur Epoche statt sie separat nachzuschlagen. Kleine Abweichungen wie bei Pluto (119,5° gegen 119,614°)
oder Uranus (97,8° gegen 97,770°) entstehen durch Rundung des Messwerts auf eine oder zwei
Nachkommastellen.

## Jahreszeiten und Insolation

Die Tagesmitteleinstrahlung an einem Ort der Breite $\varphi$ hängt von der Sonnendeklination $\delta$
ab, die selbst von der Schiefe $\varepsilon$ und der wahren Länge der Sonne auf der Bahn bestimmt wird
($\sin\delta = \sin\varepsilon\,\sin\lambda$, mit $\lambda = 0$ zur Tagundnachtgleiche). Mit dem
Stundenwinkel $H_0$ von Sonnenauf- bis -untergang, $\cos H_0 = -\tan\varphi\,\tan\delta$ (auf
$[0,\pi]$ begrenzt: $H_0 = \pi$ im Polartag, $H_0 = 0$ in der Polarnacht), lautet die
Tagesmitteleinstrahlung

$$Q(\varphi,\delta) = \frac{S_0}{\pi}\left(H_0\,\sin\varphi\,\sin\delta + \cos\varphi\,\cos\delta\,\sin H_0\right)$$

mit der Solarkonstante $S_0$ am jeweiligen Sonnenabstand. Da $H_0$, $\varphi$ und $\delta$ dimensionslos
sind (Radiant), trägt $Q$ dieselbe Einheit wie $S_0$, üblicherweise $\mathrm{W}\,\mathrm{m}^{-2}$ – die
Dimensionsprobe geht auf. Dieselbe Größe liegt den von Laskar et al. tabellierten „insolation
quantities" der [Erde](objekt:earth) zugrunde ([Laskar et al. 2004](literatur:laskar-2004)). Für
$\varepsilon \to 0$ verschwindet der Jahresgang völlig ($\delta \equiv 0$); je größer $\varepsilon$,
desto größer die Fläche, die zeitweise Polartag oder Polarnacht erlebt: Auf der Erde beginnt der
Polarkreis bei $90^\circ - \varepsilon = 66{,}6^\circ$.

Uranus mit seiner extremen Schiefe zeigt den Grenzfall: Bei einer Bahnperiode von 84 Jahren steht die
Sonne rund 42 Jahre lang über jedem Pol und ebenso lange unter dem Horizont, während der Äquator kurze
Tage mit rasch wechselnder Beleuchtung erlebt. Die Südsommer-Sonnenwende – nahe der sonnenzugewandten
Südhalbkugel, die Voyager 2 am 24. Januar 1986 sah – fiel auf den 30. September 1985, die folgende
Tagundnachtgleiche auf den 6./7. Dezember 2007 und die nächste Nordsommer-Sonnenwende auf den
11. April 2030. Auch [Pluto](objekt:pluto) mit seiner Schiefe von rund 120° erlebt wegen der noch
stärkeren Kippung ausgedehnte Polartag- und Polarnachtzonen, die selbst mittlere Breiten erfassen –
verstärkt durch die hohe Bahnexzentrizität, die den Sonnenabstand über einen Umlauf um rund das
1,67-Fache schwanken lässt und damit die eingestrahlte Sonnenenergie um fast das Dreifache (rund das
2,80-Fache).

## Präzession der Spinachse

Ein rotierender, abgeplatteter Körper ist kein starrer Kreisel im Vakuum: Die Anziehung eines äußeren
Störkörpers auf seinen Äquatorwulst erzeugt ein Drehmoment, das über Bahn und Eigendrehung gemittelt
die Spinachse gleichmäßig um die Bahnnormale präzedieren lässt, ohne die Schiefe selbst zu ändern. Für
einen Störkörper der Masse $m$ im Abstand $a$ ist die Präzessionsrate

$$\dot\Psi = \frac{3}{2}\,\frac{Gm}{a^3}\,\frac{J_2}{C/(MR^2)}\,\frac{\cos\varepsilon}{\omega}$$

mit dem Abplattungsmoment $J_2$, dem normierten polaren Trägheitsmoment $C/(MR^2)$ und der
Eigendrehrate $\omega$ des präzedierenden Körpers. Die Dimensionsprobe bestätigt die Form: $Gm/a^3$
hat die Einheit $\mathrm{s}^{-2}$, $J_2$ und $C/(MR^2)$ sind dimensionslos, und die Division durch
$\omega$ ($\mathrm{s}^{-1}$) liefert wieder $\mathrm{s}^{-1}$, die Einheit einer Rate. Für die
[Erde](objekt:earth) mit $C/(MR^2) = 0{,}3307$ und $J_2 = 1{,}0826359 \cdot 10^{-3}$
([Petit und Luzum 2010](literatur:petit-2010)) ergibt die Formel, getrennt für Sonne und
[Mond](objekt:moon) ausgewertet, 15,94″ je Jahr aus der Sonne und 34,73″ je Jahr aus dem Mond, in der
Summe 50,67″ je Jahr; die tatsächliche allgemeine Präzession in Länge beträgt 5029,0966″ je
Jahrhundert, also 50,2910″ je Jahr, mit einem vollen Umlauf in rund 25 770 Jahren
([Petit und Luzum 2010](literatur:petit-2010)). Die einfache Formel trifft den gemessenen Wert auf
rund 0,8 % genau; die Restabweichung geht vor allem auf die hier vernachlässigte Neigung der
Mondbahn gegen die Ekliptik (5,145°) zurück. Seit der Epoche J2000 bis zum 22. September 2026, also
über 26,72 Jahre, hat sich der wahre Himmelspol auf diese Weise bereits um
50,2910″ × 26,72 = 1343,9″ = 22,40′ = 0,3733° verschoben – eine Größe, die Orrery vernachlässigt
(siehe „Im Modell"). Für den [Mars](objekt:mars) liefert dieselbe Formel mit nur der Sonne als Störkörper,
$J_2 = 0{,}0019566$ und $C/(Ma^2) = 0{,}36419$ 7,50″ je Jahr, gegen den aus InSight-Bahnverfolgung
gemessenen Wert von 7598,1 Millibogensekunden je Jahr ([Le Maistre et al. 2023](literatur:le-maistre-2023))
rund 1,2 % zu klein.

## Langfristige Entwicklung

Die Bahnebenen der Planeten selbst wandern langsam gegeneinander (siehe
[Bahnelemente](thema:bahnelemente)); da die Schiefe gegen die eigene, wandernde Bahn gemessen wird,
ändert sich die Schiefe auch ohne jede Präzession der Spinachse. Für die Erde ergibt sich daraus der
bekannte Milanković-Zyklus: Die Schiefe der Ekliptik schwankt in rund 41 000 Jahren zwischen 22,1° und
24,5° ([Laskar et al. 2004](literatur:laskar-2004)). Ohne den Mond wäre die Erde nach den Rechnungen
von Laskar et al. einer viel größeren, chaotischen Zone ausgesetzt, die von fast 0° bis etwa 85°
reichen könnte; der Mond hält die tatsächliche Schwankung auf die schmale, quasiperiodische Zone
zwischen 22,1° und 24,5° zusammen ([Laskar et al. 1993](literatur:laskar-1993)). Eine spätere,
unabhängige numerische Integration einer wirklich mondlosen Erde relativiert dieses Bild allerdings:
Lissauer et al. finden typischerweise nur Schwankungen von rund ±10° über Zeiträume von
Jahrmilliarden, deutlich weniger als der theoretisch erlaubte Bereich – der Mond schützt die Erde also
eher vor einem seltenen großen Ausschlag als vor einer typischen, moderaten Wanderung
([Lissauer et al. 2012](literatur:lissauer-2012)).

[Mars](objekt:mars) hat kein vergleichbares Gegengewicht. Laskar und Robutel zeigten allgemein, dass
erdähnliche Planeten in großen chaotischen Schiefezonen liegen können; für Mars nannten sie damals
eine Zone von 0° bis 60° ([Laskar und Robutel 1993a](literatur:laskar-1993a)), während eine
unabhängige Integration von Touma und Wisdom chaotische Schwankungen zwischen rund 11° und 49° mit
einer Divergenzzeitskala von 3 bis 4 Millionen Jahren fand
([Touma und Wisdom 1993](literatur:touma-1993)). Die aktuellste Langzeitrechnung ergibt für die
letzten 5 Milliarden Jahre eine mittlere Schiefe von $37{,}62^\circ \pm 13{,}82^\circ$ mit Spitzen bis
$82{,}035^\circ$ ([Laskar et al. 2004a](literatur:laskar-2004a)) – die heutige, vergleichsweise
moderate Neigung von rund 25° ist demnach eine Momentaufnahme in einer viel weiteren Verteilung.

[Venus](objekt:venus) erreichte ihre heutige, fast kopfstehende Lage nicht über eine gewöhnliche
Präzession, sondern über einen von vier möglichen Endzuständen der Rotation: Erdähnliche Planeten mit
dichter Atmosphäre können entweder klassisch die Achse umklappen oder – ganz ohne Achsdrehung – eine
rechtläufige Rotation bis zur Umkehr abbremsen, während die Schiefe selbst gegen null geht; welcher
der beiden Wege eingeschlagen wird, hängt vom Wechselspiel aus fester und atmosphärischer
Thermalgezeit ab ([Correia und Laskar 2001](literatur:correia-2001)). [Merkur](objekt:mercury)
dagegen behielt eine sehr kleine Schiefe: Er befindet sich in einem
[Cassini-Zustand](thema:gebundene-rotation), in dem Spinachse, Bahnnormale und die Präzessionsachse
der Bahn in einer Ebene bleiben; gemessen sind $2{,}029 \pm 0{,}085$ Bogenminuten
([Stark et al. 2015](literatur:stark-2015)) – ein Wert, der eng mit dem
[inneren Aufbau](thema:innerer-aufbau) des Planeten zusammenhängt, weil die Größe der Schiefe von der
Kern-Mantel-Kopplung abhängt.

## Kippmechanismen der Riesenplaneten

Bei den Riesenplaneten ist die Ursache der Schiefe selbst umstritten. Saturns 26,73° werden entweder
einer Präzessionsresonanz mit der Knotenwanderung von Neptuns Bahn zugeschrieben, die die
Saturn-Achse mitgezogen haben könnte, oder dem Verlust eines inzwischen zerstörten Mondes; beide
Erklärungen sind nicht abschließend geklärt
([Ward und Hamilton 2004](literatur:ward-2004); [Wisdom et al. 2022](literatur:wisdom-2022)). Selbst
Jupiters kleine Schiefe von 3,1° ist möglicherweise nicht rein primordial: Seine
Spinachsen-Präzessionsperiode liegt nahe der rund $4{,}3 \cdot 10^5$ Jahre langen Laplace-Lagrange-Mode,
mit der Uranus' eigene Bahnebene präzediert – gerät Jupiter mit dieser Bahnmode in Resonanz, wird ein
Teil seiner Schiefe erzwungen statt ererbt, was eine vom Interieurmodell unabhängige Schranke für sein
Trägheitsmoment liefert ([Ward und Canup 2006](literatur:ward-2006)).

Bei [Uranus](objekt:uranus) ist die Kippung um fast 98° selbst die zu erklärende Größe, und mit ihr ein
zweites Rätsel: Alle fünf großen Monde laufen fast exakt in der (gekippten) Äquatorebene des Planeten
und prograd – im Modell liegen ihre Schiefen gegen den Uranus-Äquator zwischen 0,069° (Oberon) und
4,334° (Miranda), praktisch null gegenüber der Kippung des Planeten selbst. Ein einzelner später
Einschlag würde zwar den Planeten kippen, aber vorbestehende Monde auf ihren alten, jetzt gegen den
neuen Äquator schräg liegenden Bahnen zurücklassen. In der Tradition Safronovs zeigten schon Slattery,
Benz und Cameron, dass ein Einschlag auf ein junges Uranus dessen Rotationszustand geprägt haben kann
([Slattery et al. 1992](literatur:slattery-1992)); moderne, hochaufgelöste
Glatte-Teilchen-Simulationen (SPH) von Kegerreis et al. zeigen, dass ein Einschlagkörper von
mindestens zwei Erdmassen die heutige, schnelle Rotation erklären kann, wobei mindestens 90 % der
Atmosphäre gebunden bleiben ([Kegerreis et al. 2018](literatur:kegerreis-2018)) – eine methodische
Nachfolgearbeit zeigt allerdings, dass selbst grobe Ergebnisse wie die Rotationsperiode erst oberhalb
von zehn Millionen SPH-Teilchen konvergieren, was die Robustheit einzelner Simulationsläufe
einschränkt ([Kegerreis et al. 2019](literatur:kegerreis-2019)). Für die Monde selbst zeigten
Morbidelli et al., dass eine zur Kippzeit vorhandene Trümmer- oder Proto-Satellitenscheibe nach dem
Einschlag inkohärent um den neuen, gekippten Äquator präzediert und durch Stoßdämpfung zu einer
dünnen, äquatorialen Scheibe kollabiert, aus der die heutigen Monde entstanden sein könnten – die
prograden Äquatorbahnen wären dann keine Ausnahme, sondern die erwartete Folge
([Morbidelli et al. 2012](literatur:morbidelli-2012)).

Eine ganz andere Familie von Erklärungen verzichtet auf einen Einschlag oder braucht ihn nur als
letzten Schritt. Rogoszinski und Hamilton zeigten, dass eine zirkumplanetare Scheibe von mindestens
dem Dreifachen der heutigen Satellitenmasse den Laplace-Radius so weit nach außen verschiebt, dass die
Spin-Präzession des jungen Uranus in Resonanz mit seiner eigenen Bahnpräzession gerät und die Schiefe
bis auf rund 70° treibt; ein nachfolgender, deutlich kleinerer Einschlag von rund $0{,}5\,M_\oplus$
genügt dann, um von 70° auf die heutigen 98° zu kommen
([Rogoszinski und Hamilton 2020](literatur:rogoszinski-2020)). Eine Folgearbeit vergleicht diesen
Resonanzmechanismus direkt mit reinen Kollisionsszenarien: Ein Resonanzeinfang allein bräuchte rund
100 Millionen Jahre, um 90° zu erreichen, während ein einzelner Einschlag von $1\,M_\oplus$ genügt und
zwei Einschläge von je $0{,}5\,M_\oplus$ sogar noch wahrscheinlicher sind – Kollisionen bleiben nach
dieser Rechnung die plausibelste Erklärung
([Rogoszinski und Hamilton 2021](literatur:rogoszinski-2021)). Saillenfest et al. verfolgen
stattdessen die Wanderung eines längst verschwundenen, hypothetischen Mondes von rund
$4 \cdot 10^{-4}$ Uranusmassen über etwa zehn Uranusradien: Bei einer Wanderrate wie der heutigen
Monddrift geraten Planet und Mond in eine säkulare Spin-Bahn-Resonanz, die Uranus zunächst
kontrolliert, jenseits von 80° dann chaotisch kippt, bis der Mond schließlich auf den Planeten stürzt
und die erreichte Schiefe einfriert – in rund 80 % der Simulationen mit Uranus-ähnlichem Endzustand
([Saillenfest et al. 2022](literatur:saillenfest-2022)). Die Szene
[Der liegende Uranus](szene:uranus-gekippt) zeigt das Ergebnis dieser konkurrierenden Wege, ohne
zwischen ihnen zu entscheiden. Zum Vergleich: [Neptun](objekt:neptune) mit ähnlicher Größe und
Zusammensetzung wie Uranus hat nur 28,3° Schiefe, wurde von keinem der genannten Mechanismen in
gleichem Maß getroffen und blieb nahe seiner ursprünglichen Lage.

Auch der ferne Zwergplanet [Pluto](objekt:pluto) trägt mit rund 120° eine extreme Schiefe. Nach
Dobrovolskis und Harris schwingt sie, getrieben vom Drehmoment der Sonne auf das präzedierende
Pluto-Charon-System, über rund drei Millionen Jahre nahezu sinusförmig und stabil zwischen etwa 102°
und 126° ([Dobrovolskis und Harris 1983](literatur:dobrovolskis-1983)) – anders als die chaotischen
Schiefezonen der erdähnlichen Planeten.

## Offene Fragen

- **Ursache von Uranus' Kippung.** Riesenkollision ([Slattery et al. 1992](literatur:slattery-1992);
  [Kegerreis et al. 2018](literatur:kegerreis-2018)), reine Spin-Bahn-Resonanz mit einer
  zirkumplanetaren Scheibe ([Rogoszinski und Hamilton 2020](literatur:rogoszinski-2020)), Wanderung
  eines verschwundenen Mondes ([Saillenfest et al. 2022](literatur:saillenfest-2022)) oder eine
  Kombination aus Resonanz und einem kleineren Einschlag
  ([Rogoszinski und Hamilton 2021](literatur:rogoszinski-2021)) stehen nebeneinander; jede erklärt die
  prograden Äquatorbahnen der Monde unterschiedlich gut.
- **Ursache von Saturns Schiefe.** Präzessionsresonanz mit Neptun
  ([Ward und Hamilton 2004](literatur:ward-2004)) gegen den Verlust eines Mondes
  ([Wisdom et al. 2022](literatur:wisdom-2022)) – beide Belege stützen sich auf dieselben
  Beobachtungsgrößen, ohne dass eine Rechnung die andere ausschließt.
- **Stabilisiert der Mond die Erdschiefe wirklich?** Laskar et al. sahen eine chaotische Zone von 60°
  bis 90°, die ohne Mond von fast 0° bis 85° reichen würde
  ([Laskar et al. 1993](literatur:laskar-1993)); eine spätere, unabhängige Integration einer wirklich
  mondlosen Erde findet dagegen nur moderate Schwankungen von rund ±10°
  ([Lissauer et al. 2012](literatur:lissauer-2012)). Wie groß der schützende Effekt des Mondes
  tatsächlich ist, bleibt damit eine Frage der Modellannahmen.
- **Venus' Weg in die Rückläufigkeit.** Ob der heutige Zustand über ein klassisches Umklappen der
  Achse oder über eine reine Abbremsung bis zur Drehsinnumkehr erreicht wurde, ist unentschieden
  ([Correia und Laskar 2001](literatur:correia-2001)).

## Im Modell

Orrery hält alle Pole fest im Raum: Es gibt keine Präzession und keine Nutation, jeder Pol steht bei
seinen konstanten Werten aus `physical.pole` – dem IAU-Pol zur Epoche J2000, je nach Datensatz aus
dem IAU-Bericht über Rotationselemente oder dem SPICE-Kernel `pck00011.tpc`. Für die Erde bedeutet das,
die seit J2000 aufgelaufene tatsächliche Präzession von 22,40′ (siehe oben) fehlt vollständig; über die
kurzen, in der Anwendung dargestellten Zeitspannen ist das unauffällig, wird aber bei Zeitsprüngen über
Jahrhunderte sichtbar. Der Datenblock berechnet die Achsneigung mit `achsneigungDeg` als Winkel
zwischen diesem festen Pol und der aus Position und Geschwindigkeit gebildeten Bahnnormale zur
Epoche, mit einer 180°-Klappung bei negativer Rotationsperiode (Venus, Uranus, die fünf großen
Uranusmonde, Triton); für die Sonne, die keine Bahn hat, gilt stattdessen der Winkel gegen die
Ekliptiknormale. Monde mit `frame: 'parentEquator'` messen ihre Schiefe gegen die aus Position und
Geschwindigkeit gebildete Bahnnormale, nicht gegen eine eigens geführte Laplace-Ebene. Miranda und
Triton behalten trotzdem einen im Datensatz festen Pol, obwohl der IAU-Bericht ihre Pole als
Reihenentwicklung mit großen periodischen Gliedern angibt, die die Präzession der Drehachse mit der
wandernden Bahnnormale beschreiben – der Datensatz führt nur die konstanten Glieder
([Archinal et al. 2011](literatur:archinal-2011)). Eris und Makemake tragen im Datensatz einen Pol
senkrecht auf der eigenen Bahn, weil kein vollständiger Pol gemessen ist (für Eris ist immerhin ein
Kippwinkel von rund 78,3° gegen die eigene Bahn aus der Dysnomia-Bahn abgeleitet, aber keine
Rektaszension und Deklination). Jahreszeiten entstehen im Bild allein aus Pol und Sonnenrichtung in der
Beleuchtungsrechnung (Ausrichtung des Körpernetzes in `render/bodies.ts`, Belichtung in
`render/lighting.ts`), ohne eigenen Jahreszeiten-Code – wie
jede Vereinfachung dieser Art gehört auch diese zu den [Grenzen des Modells](thema:modell).

*Stand: September 2026*
