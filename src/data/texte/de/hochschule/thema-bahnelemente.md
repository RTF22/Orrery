# Bahnelemente

Bahnelemente sind Koordinaten auf der Lösungsmenge des Zweikörperproblems: Sechs Zahlen
ersetzen Ort und Geschwindigkeit. Weil kein Körper im Sonnensystem einer exakten Keplerbahn
folgt, meint derselbe Name je nach Quelle eine Momentaufnahme, einen Mittelwert oder einen
über ein Zeitfenster angepassten Parametersatz. Orrery bewegt jeden Körper ausschließlich über
solche Elemente; dieser Text ordnet ein, was sie leisten und wo sie ihre Gültigkeit verlieren.

## Zweikörperproblem und Erhaltungsgrößen

Für den Relativvektor $\vec{r}$ zweier Punktmassen gilt

$$\ddot{\vec{r}} = -\frac{\mu\,\vec{r}}{r^3}, \quad \mu = G\,(M + m)$$

Erhalten bleiben die spezifische Energie, der spezifische Drehimpuls und der
Exzentrizitätsvektor, bis auf den Faktor $\mu$ der Laplace-Runge-Lenz-Vektor
([Tremaine et al. 2009](literatur:tremaine-2009), dort für ein Testteilchen):

$$\varepsilon = \frac{v^2}{2} - \frac{\mu}{r} = -\frac{\mu}{2a}, \quad \vec{h} = \vec{r} \times \dot{\vec{r}}, \quad \vec{e} = \frac{\dot{\vec{r}} \times \vec{h}}{\mu} - \frac{\vec{r}}{r}$$

Die sieben Komponenten sind über $\vec{e} \cdot \vec{h} = 0$ und
$e^2 = 1 + 2\varepsilon h^2/\mu^2$ verknüpft; fünf unabhängige Integrale legen Größe, Form
und räumliche Lage des Kegelschnitts fest, das sechste Element den Ort auf ihm. Aus dem
Flächensatz mit $h^2 = \mu a\,(1 - e^2)$ und der Ellipsenfläche $\pi a^2 \sqrt{1 - e^2}$ folgt
das dritte Keplersche Gesetz:

$$T^2 = \frac{4\pi^2 a^3}{G\,(M_\odot + m)}$$

Dynamisch bestimmt ist dabei das Produkt $GM$, nicht $G$ und $M$ einzeln: Die Unsicherheit von
$G$ ist fünf Größenordnungen größer als die des solaren Massenparameters, dessen nomineller
Wert nach IAU-Resolution B3 (2015) $1{,}3271244 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$
beträgt ([Prša et al. 2016](literatur:prsa-2016)).

## Klassische Elemente und die Menge des JPL

Klassisch beschreiben große Halbachse $a$ und Exzentrizität $e$ die Bahnform, Inklination $I$
und Länge des aufsteigenden Knotens $\Omega$ die Bahnebene gegen eine Bezugsebene, das
Argument des Perizentrums $\omega$ die Apsidenlinie in der Bahnebene und die mittlere Anomalie
$M = n\,(t - \tau)$ mit $n = 2\pi/T$ den Ort. Die Näherungstafeln des JPL für die Planeten
führen stattdessen die Länge des Perihels $\varpi$ und die mittlere Länge $L$ und rechnen mit
$\omega = \varpi - \Omega$ und $M = L - \varpi$ zurück
([JPL Approximate Positions](quelle:jpl-approx-pos)). Der Grund zeigt sich dort, wo einzelne
Winkel ihre Bedeutung verlieren:

| Element | gemessen von … bis | unbestimmt bei |
|---|---|---|
| $\Omega$ | Bezugsrichtung bis Knoten, in der Bezugsebene | $I \to 0$, $I \to 180^\circ$ |
| $\omega$ | Knoten bis Perizentrum, in der Bahnebene | $I \to 0$, $I \to 180^\circ$, $e \to 0$ |
| $\varpi = \Omega + \omega$ | Summe über beide Ebenen | $e \to 0$, $I \to 180^\circ$ |
| $M$ | Perizentrum bis Körper, gleichförmig in der Zeit | $e \to 0$ |
| $L = \varpi + M$ | Summe über beide Ebenen, gleichförmig in der Zeit | $I \to 180^\circ$ |

Für die wenig geneigten Planetenbahnen bleibt $L$ also immer bestimmt und $\varpi$, solange $e$
nicht zu klein wird. Wie empfindlich $\varpi$ bei kleinem $e$ ist, zeigt Venus mit
$e = 0{,}0068$: Die beiden Näherungstafeln des JPL geben für ihre Rate 0,0027° und 0,0568° je
Jahrhundert ([JPL Approximate Positions](quelle:jpl-approx-pos)).

## Keplergleichung

Den Ort zur Zeit liefert die exzentrische Anomalie $E$ aus der transzendenten Gleichung

$$M = E - e \sin E$$

Üblich ist das Newton-Verfahren

$$E_{k+1} = E_k - \frac{E_k - e \sin E_k - M}{1 - e \cos E_k}$$

Es konvergiert quadratisch, sobald der Startwert im Einzugsbereich liegt. Für verbreitete
Startwerte lassen sich Bereiche in $(e, M)$ mit garantierter Konvergenz und
A-priori-Fehlerschranke beweisen, und mit $e \to 0$ wird die Konvergenz immer schneller
([Elipe et al. 2017](literatur:elipe-2017)). Kritisch ist $e \to 1$ bei kleinem Betrag von
$M$, wo die Ableitung $1 - e \cos E$ gegen null geht. Mit dem Startwert $E_0 = M$ zeigt die
Iteration bei sehr großer Exzentrizität chaotisches Verhalten und kann zeitweise zwischen zwei
falschen Werten pendeln; mit $E_0 = \pi$ konvergiert sie stets schnell
([Charles und Tatum 1997](literatur:charles-1997)). Die Anleitung des JPL normiert $M$ auf
±180°, beginnt mit $E_0 = M + e \sin M$ und hält eine Toleranz von $10^{-6}$ Grad für
ausreichend ([JPL Approximate Positions](quelle:jpl-approx-pos)). Aus $E$ folgen die
Koordinaten in der Bahnebene, $\xi$ in Richtung Perizentrum:

$$\xi = a\,(\cos E - e), \quad \eta = a\,\sqrt{1 - e^2}\,\sin E$$

## Übergang in ekliptikale Koordinaten

Drei Drehungen, der Reihe nach um $\omega$ um die Bahnnormale, um $I$ um die Knotenlinie und
um $\Omega$ um den Pol der Bezugsebene, bringen den Vektor in die Ekliptik
([JPL Approximate Positions](quelle:jpl-approx-pos)):

$$\vec{r} = R_z(-\Omega)\,R_x(-I)\,R_z(-\omega)\,\vec{\rho}, \quad \vec{\rho} = (\xi, \eta, 0)$$

Die dritte Komponente ist $z = r \sin I \sin(\omega + \nu)$ mit der wahren Anomalie $\nu$; bei
gegebener Inklination hängt die ekliptikale Breite nur vom Argument der Breite $\omega + \nu$
ab.

## Bezugsrahmen und Zeitskala

Die Tafeln beziehen sich auf die mittlere Ekliptik und das Äquinoktium J2000. Diese Ebene ist
heute eine Konvention: JPL Horizons erzeugt sie, indem es das ICRF um seine x-Achse um den
festen Wert 84 381,448″ (IAU 1976/1980) dreht, und weist darauf hin, dass eine mittlere
Bahnebene wegen der gegenseitigen Bewegung von Erde und Mond bei hoher Genauigkeit mehrdeutig
ist; die Ephemeriden DE440/DE441 gelten dort als auf 0,0002″ mit ICRF3 ausgerichtet
([JPL Horizons](quelle:jpl-horizons)). Die Arbeitsgruppe der IAU zu Präzession und Ekliptik
empfahl, den Ekliptikpol ausdrücklich über den mittleren Bahndrehimpuls des
Erde-Mond-Schwerpunkts im BCRS zu definieren ([Hilton et al. 2006](literatur:hilton-2006)).

Die Zeit zählt ab J2000,0 in julianischen Jahrhunderten der Zeitskala TDB
([JPL Approximate Positions](quelle:jpl-approx-pos)):

$$T = \frac{\mathrm{JD}_\mathrm{TDB} - 2451545{,}0}{36525}, \quad \varpi = \varpi_0 + \dot{\varpi}\,T$$

TT und TDB unterscheiden sich periodisch um höchstens 2 ms. TDB − UTC betrug am 1. Januar 2000
um 12 Uhr UTC 64,18 s und am 17. September 2026 69,18 s ([JPL Horizons](quelle:jpl-horizons)).

Die [Erde](objekt:earth), in den Tafeln der Erde-Mond-Schwerpunkt, zeigt eine Folge des festen
Rahmens: Ihre Bahnebene bewegt sich gegen die Ekliptik J2000. Die Tafel für 1800 bis 2050 hält
den bei $I \approx 0$ unbestimmten Knoten bei $\Omega = 0$ fest und lässt $I$ mit −0,0129° je
Jahrhundert Ende 1999 durch null ins Negative laufen; eine negative Inklination ist
gleichwertig mit einer positiven bei $\Omega + 180^\circ$. Die Tafel für 3000 v. Chr. bis
3000 n. Chr. setzt dagegen $\Omega = -5{,}11^\circ$
([JPL Approximate Positions](quelle:jpl-approx-pos)).

## Oskulierende, mittlere und angepasste Elemente

Oskulierende Elemente beschreiben die Keplerbahn, die Ort und Geschwindigkeit zu einem
Zeitpunkt exakt trifft; sie hängen vom gewählten Zentrum und von $\mu$ ab. Für den
Pluto-Schwerpunkt liefert Horizons (DE441) von 2000 bis 2030 in Jahresschritten
([JPL Horizons](quelle:jpl-horizons)):

| Größe | heliozentrisch | baryzentrisch |
|---|---:|---:|
| $a$ in AE | 39,230 bis 39,860 | 39,487 bis 39,489 |
| $e$ | 0,2445 bis 0,2544 | 0,24898 bis 0,24903 |
| $I$ in Grad | 17,098 bis 17,176 | 17,1406 bis 17,1408 |

Die heliozentrischen Werte schwanken im Takt des Jupiterumlaufs (größtes $a$ 2008 und 2020),
weil die Sonne selbst um den Schwerpunkt des Systems läuft; auf diesen bezogen ist Plutos Bahn
über dreißig Jahre nahezu eine feste Ellipse.

Mittlere Elemente entstehen, wenn kurzperiodische Anteile der Störungen herausgemittelt
werden. Das Problem mit drei und mehr Körpern ist nicht integrabel; mit den säkularen Termen
der Störfunktion allein lässt sich aber eine analytische Näherung für Planeten wie für Monde
gewinnen ([Murray und Dermott 2000](literatur:murray-2000), Kapitel 7). Laplace und Lagrange
zeigten, dass sich die Planeten in erster Ordnung in Massen, Exzentrizitäten und Neigungen
quasiperiodisch bewegen. Eine Säkulartheorie zweiter Ordnung in den Massen und fünfter in
Exzentrizität und Neigung, über 200 Millionen Jahre integriert, ist dagegen chaotisch mit
einem größten Ljapunow-Exponenten von etwa 1/(5 Millionen Jahre); die Bahnen der inneren
Planeten sind über einige zehn Millionen Jahre nicht vorhersagbar
([Laskar 1989](literatur:laskar-1989)).

Die Elemente der JPL-Näherungstafeln sind weder oskulierend noch mittlere Elemente im Sinn der
Störungstheorie: Laut JPL sind sie an ein Zeitfenster angepasst, stellen keine Mittelung dar
und gelten außerhalb des Fensters nicht. Die nominellen Fehler für 1800 bis 2050 betragen in
heliozentrischer Länge 15″ bei Merkur, 400″ bei Jupiter und 600″ bei Saturn; für 3000 v. Chr.
bis 3000 n. Chr. braucht die mittlere Anomalie von Jupiter bis Neptun zusätzlich
$b T^2 + c \cos(f T) + s \sin(f T)$ ([JPL Approximate Positions](quelle:jpl-approx-pos)). Eine
lineare Rate je Jahrhundert fasst also säkulare Drift und den im Fenster wirksamen Teil
langperiodischer Terme zusammen, und angepasste $a$ und $\dot{L}$ müssen das dritte Keplersche
Gesetz nicht exakt erfüllen. Auch die mittleren Mondelemente des JPL sind angepasst: Es sind
die Elemente einer präzedierenden Ellipse, nach kleinsten Quadraten an die numerisch
integrierte Bahn gelegt und ausdrücklich nicht für Ephemeriden gedacht
([Mittlere Bahnelemente der Monde](quelle:jpl-satelliten-bahnen)). Genaue Orte liefern
numerisch integrierte, an Beobachtungen angepasste Ephemeriden wie DE440 für die Jahre 1550 bis
2650 und DE441 für −13 200 bis +17 191 ([Park et al. 2021](literatur:park-2021)).

## Singularitäten und äquinoktiale Elemente

Bei $e \to 0$ verliert das Perizentrum seine Richtung, bei $I \to 0$ der Knoten, bei
$I \to 180^\circ$ ist nur $\Omega - \omega$ bestimmt. Äquinoktiale Elemente ersetzen die
betroffenen Winkel durch

$$h = e \sin\varpi, \quad k = e \cos\varpi, \quad p = \tan\frac{I}{2}\,\sin\Omega, \quad q = \tan\frac{I}{2}\,\cos\Omega$$

zusammen mit $a$ und der mittleren Länge zur Epoche. Die zugehörigen Matrizen, darunter die
partiellen Ableitungen von Ort und Geschwindigkeit nach den Elementen, sind für $e = 0$ sowie
für Inklinationen von 0° und 90° frei von Singularitäten
([Broucke und Cefola 1972](literatur:broucke-1972)). Singulär bleiben retrograde äquatoriale
Bahnen und geradlinige Bewegung; eine Variante verschiebt die Singularität nach $I = 0$
([Baù et al. 2021](literatur:bau-2021)).

Alle drei Fälle kommen in Orrerys Datensätzen vor. [Io](objekt:io) hat in der JPL-Tabelle
$I = 0{,}0^\circ$ ohne Knotenperiode, [Deimos](objekt:deimos) $e = 0{,}000$ ohne
Periapsisperiode ([Mittlere Bahnelemente der Monde](quelle:jpl-satelliten-bahnen)). Die fünf
großen Uranusmonde haben gegen den IAU-Nordpol des Uranus Inklinationen nahe 180°; bei vier
von ihnen, 0,003° bis 0,19° davon entfernt, zeigt der oskulierende Knoten über 40 Jahre keinen
belastbaren linearen Trend. In diesen Fällen setzt der Datensatz die betroffene Rate null.

## Monde und die Laplace-Ebene

Die meisten Monde spüren vor allem den Äquatorwulst ihres Planeten und die Gezeitenwirkung der
Sonne. Die klassische Laplace-Fläche, auf der die säkulare Entwicklung kreisförmiger Bahnen
verschwindet, fällt nahe am Planeten mit dessen Äquator und weit draußen mit dessen Bahnebene
zusammen; der Übergang liegt beim Laplace-Radius
([Tremaine et al. 2009](literatur:tremaine-2009)):

$$r_\mathrm{L}^5 = J_2\,R_\mathrm{p}^2\,a_\mathrm{p}^3\,(1 - e_\mathrm{p}^2)^{3/2}\,\frac{M_\mathrm{p}}{M_\odot}$$

Dabei enthält $J_2$ den Beitrag innerer Monde. JPL definiert die Laplace-Ebene als die Ebene,
in der die Knotenpräzession eines Mondes im Mittel liegt; für typische Monde liegt sie zwischen
Äquator- und Bahnebene des Planeten
([Mittlere Bahnelemente der Monde](quelle:jpl-satelliten-bahnen)). Bei Saturn ist
$r_\mathrm{L} = 48{,}4\,R_\mathrm{p}$, und [Iapetus](objekt:iapetus) läuft bei
$59\,R_\mathrm{p}$ ([Tremaine et al. 2009](literatur:tremaine-2009)). Seine Laplace-Ebene ist
14,8° gegen Saturns Äquator geneigt, seine Bahn 7,6° gegen diese Ebene, bei einer
Knotenperiode von 3130 Jahren. Den Erdmond führt JPL mit Elementen gegen die Ekliptik:
$I = 5{,}16^\circ$, Knotenperiode 18,6 Jahre
([Mittlere Bahnelemente der Monde](quelle:jpl-satelliten-bahnen)).

## Im Modell

- **Planeten:** Tafel 1 der JPL-Näherungsbahnen (1800 bis 2050) gegen die Ekliptik J2000 mit
  linearen Raten, für die Erde der Erde-Mond-Schwerpunkt. Außerhalb des Fensters warnt der
  Datenblock.
- **Zwergplaneten:** oskulierende heliozentrische Elemente der JPL Small-Body Database zu einer
  eigenen Epoche, alle Raten außer $\dot{L}$ null. Für [Pluto](objekt:pluto) (JD 2457588,5,
  19. Juli 2016) stimmen sie mit der heliozentrischen oskulierenden Bahn des Pluto-Schwerpunkts
  aus DE441 überein; gegen DE441 weicht sein Ort 2000 um 0,05°, 2050 um 0,13°, 1900 um 0,15°
  und 1800 um 1,4° ab.
- **Erdmond:** mittlere Elemente gegen die Ekliptik mit linearer Knoten- und Apsidendrehung,
  ohne periodische Glieder.
- **Übrige Monde:** Elemente gegen den Äquator des Mutterkörpers mit dessen IAU-Pol zur Epoche
  J2000; die Knotenlänge zählt wie bei JPL vom Knoten dieser Ebene auf dem ICRF-Äquator, so
  zeigt sie auch der Datenblock. Mars- und Jupitermonde nutzen die mittleren JPL-Elemente und
  setzen die Laplace-Ebene dem Äquator gleich, obwohl sie bei Kallisto 0,4° und bei Deimos
  0,9° davon abweicht. Saturn-, Uranus-, Neptun- und Plutomonde nutzen oskulierende
  Horizons-Elemente zu J2000, mit
  Präzessionsraten aus der JPL-Tabelle, wo diese sich gegen Horizons bewähren, sonst ohne. Bei
  Iapetus präzediert der Knoten so um Saturns Pol statt um den Laplace-Pol; seine Neigung gegen
  Saturns Äquator weicht von Horizons 2050 um 0,71° und 2076 um 1,11° ab.
- **Keplergleichung:** Newton-Verfahren ab $E_0 = M + e \sin M$, Abbruch bei einem Schritt unter
  $10^{-12}$ rad, höchstens 30 Schritte. Nachgerechnet auf 200 001 gleichabständigen Werten von
  $M$ genügen für die größte Exzentrizität im Katalog ([Eris](objekt:eris), 0,438) höchstens
  5 Schritte, bei $e = 0{,}99$ höchstens 10; bei $e = 0{,}999$ verfehlen 943 Werte mit kleinem
  Betrag von $M$ das Abbruchkriterium.
- **Umlaufzeit:** Der Datenblock rechnet sie nach der Formel oben aus $a$ zur Epoche und
  $G\,(M + m)$ mit $G$ nach CODATA 2018. Dieses Produkt liegt für die Sonne um
  $4{,}5 \cdot 10^{-5}$ über dem nominellen Massenparameter, die Umlaufzeiten der Planeten
  rechnerisch um 0,002 % zu kurz. Bewegt werden die Körper dagegen mit $\dot{L}$: Für Uranus und
  Neptun ist die Kepler-Umlaufzeit um 0,05 % beziehungsweise 0,06 % länger als
  $360^\circ/\dot{L}$, für den Erdmond um 0,11 % kürzer.
- **Zeit:** Die Uhr zählt julianische Tage in UTC und setzt sie ohne Umrechnung als TDB ein. Die
  69 s verschieben Merkur um 8″ bis 18″ in heliozentrischer Länge, in der Größenordnung des
  nominellen Fehlers der Tafel. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
