# Szene: Vorbeiflug an Jupiter

Die Kamera zieht in gerader Linie an [Jupiter](objekt:jupiter) vorbei, quer zur eigenen
Blickrichtung und mit über die ganze Szene konstantem Tempo. Sie blickt durchgehend auf Jupiters
Mittelpunkt; ob dabei auch der innerste Galileische Mond [Io](objekt:io) ins Bild gerät, entscheidet
– wie sich zeigt – kaum der Zufall, sondern seine kurze Umlaufzeit.

## Was das Bild zeigt

Der Bahntyp `flyby` verschiebt die Kamera quer zur Sichtlinie linear von $+2$ auf $-2$ Radien
(`render/camera/cinema.ts`); ein Radius ist hier der vierfache dargestellte Jupiterradius
(69 911 km) mal Streufaktor (`distanceInRadii: 4`). Die Querrichtung steht exakt senkrecht auf der
Verbindung Kamera–Jupiter und liegt, unabhängig von Azimut und Elevation, stets in der Ekliptik; ihr
Skalarprodukt mit der Radiusrichtung verschwindet deshalb immer, ohne die Näherung, die andere
Bahntypen des Katalogs brauchen. Nach Pythagoras folgt der Abstand zu Jupiters Mittelpunkt exakt aus
Radius und Querversatz: Der geringste Abstand liegt exakt in der Szenenmitte (17,5 s), bei einem
Radius zwischen 3,2 und 6,0 Jupiterradien (Streufaktor 0,8 bis 1,5); der größte liegt an beiden
Enden, beim $\sqrt5$-Fachen davon, also 7,2 bis 13,4 Radien.

Der Weg ist dabei eine gerade Strecke von vier Radien: Die Kamera legt in den 35 Sekunden zwischen
894 861 km (Faktor 0,8) und 1 677 864 km (Faktor 1,5) zurück, an der Grundeinstellung (Faktor 1)
1 118 576 km – macht 25 567 bis 47 939 km/s, an der Grundeinstellung 31 959 km/s: zwischen 8,5 %
und 16,0 % der Lichtgeschwindigkeit, weit jenseits jeder realen Sonde (siehe Hintergrund). Jupiters
Winkeldurchmesser – mit dem vollen $2\arcsin(R_\mathrm{J}/d)$, nicht klein gerechnet – wächst dabei
von 12,8° an Anfang und Ende auf 29,0° in der Mitte (Grundeinstellung); über die volle Streuung
reicht das von 8,5°/19,2° (Faktor 1,5) bis 16,1°/36,4° (Faktor 0,8) – bei 50° Sichtfeld bleibt
Jupiter also stets deutlich innerhalb des Bildes. Bei 0,3 Tagen je Sekunde vergehen in den
35 Sekunden nominell 10,5 simulierte Tage; Jupiters `rotationPeriodH` von 9,9250 h (Einzelheiten bei
[Jupiter](objekt:jupiter)) ergibt daraus 25,4 Umdrehungen der Textur.

Ob Monde ins Bild geraten, hängt an Ios Bahnradius: 421 800 km entsprechen 6,0 dargestellten
Jupiterradien (Modellradius 69 911 km) – fast genau dem Abstandsbereich der Kamera selbst. Weil
[Io](objekt:io) in den 10,5 simulierten Tagen der Szene knapp sechsmal umläuft (Umlaufzeit
1,769138 d), bringt praktisch jede Ziehung ihn irgendwann nah an die Sichtlinie zur Kamera: Eine
Rasterprüfung über 480 Kombinationen aus Azimut, Elevation und Streufaktor
(Schrittweite 0,5 s) fand in jeder einzelnen Ziehung einen Zeitpunkt, an dem der Winkel zwischen den
Richtungen Kamera→Jupiter und Kamera→Io unter die 25° der halben Bildhöhe fiel, im Median sogar auf
nur 3,5°; im günstigsten geprüften Fall (Azimut 220°, Elevation −3°, Faktor 1,5, kurz nach
Szenenbeginn) betrug der Winkel nur 0,14° – Io stand damit praktisch auf Jupiters eigener, an diesem
Punkt 4,6° großer Bildscheibe. Nach demselben Muster geraten gelegentlich auch die drei übrigen
Monde in Sichtlinien-Nähe, ohne dass das Bild eigens für sie gebaut wäre.

## Hintergrund

Echte Sonden fliegen keine Gerade: Jupiters Schwerefeld biegt die Bahn zu einer Hyperbel, deren
Ablenkwinkel $\delta = 2\arcsin(1/e)$ von der Exzentrizität $e = 1 + r_p v_\infty^2/GM_\mathrm{J}$ –
also von Periapsisdistanz $r_p$ und Anfluggeschwindigkeit $v_\infty$ relativ zu Jupiter – abhängt
([Murray und Dermott 2000](literatur:murray-2000)). Im mitbewegten Jupitersystem ändert sich dabei
nur die Richtung, nicht der Betrag von $v_\infty$; da Jupiter selbst mit rund 13 km/s um die Sonne
läuft, kann sich die gedrehte Geschwindigkeit heliozentrisch zur Jupiterbahn addieren oder von ihr
abziehen – der eigentliche Antrieb des Swing-by.

Mehrere Sonden nutzten Jupiter als Wegstation: Pioneer 10 und 11, Voyager 1 und 2, Ulysses und
Cassini flogen zwischen den 1970er- und den 2000er-Jahren vorbei, „auf dem Weg zu anderen Welten"
([Jupiter bei NASA Science](quelle:nasa-jupiter)); Voyager 1 lieferte im März 1979 die ersten
Nahaufnahmen aktiven Vulkanismus auf [Io](objekt:io) ([Smith et al. 1979](literatur:smith-1979)). Am
genauesten dokumentiert ist New Horizons: Am 28. Februar 2007, 05:43:40 UTC, kam die Sonde Jupiter
auf rund 32 Jupiterradien (etwa 2,3 Mio. km) bei 21 km/s am nächsten
([NSSDC 2026](literatur:nssdc-newhorizons-2026)) und war danach rund 14 000 km/h (4 km/s)
schneller – das sparte auf dem Weg zu [Pluto](objekt:pluto) drei Jahre
([Mission New Horizons](quelle:nasa-new-horizons)); derselbe Vorbeiflug fing eine große Eruption des
Io-Vulkans Tvashtar ein ([Spencer et al. 2007](literatur:spencer-2007)).

Näher heranzugehen ist gefährlich: Jupiters Magnetfeld – 15- bis über 50-mal stärker als das der
Erde – hält Gürtel hochenergetischer Teilchen fest, denen Juno seit 2016 mit einer polnahen Bahn
ausweicht, die sich den Wolken nur bis auf rund 3500 km nähert ([Mission Juno](quelle:nasa-juno)) –
näher als jede der oben genannten Sonden, aber immer noch weit jenseits der 3,2 bis 6,0
Jupiterradien, die die Kamera dieser Szene ungestraft durchfliegt.

## Modellgrenzen

- **Kamera ohne Schwerkraft:** gerade Linie statt Hyperbel, konstantes Tempo von 25 567 bis
  47 939 km/s – 8,5 bis 16,0 % der Lichtgeschwindigkeit, weit über jeder realen Sondengeschwindigkeit
  (New Horizons: 21 km/s).
- **Jupiter als Kugel mit System-III-Rotation:** dieselben Werte wie bei [Jupiter](objekt:jupiter),
  Abschnitt „Im Modell" (`rotationPeriodH` 9,9250 h gegen die IAU-Rate 9,924920 h, Achsneigung
  3,1200°, Abplattung nicht dargestellt).
- **Belichtung:** Die Szene setzt kein `lookAtId`; die Kamera belichtet deshalb auf Jupiter selbst
  (`exposureTargetId`, `render/exposure.ts`).
- **Jupiters eigene Bewegung:** Bei rund 13 km/s Bahngeschwindigkeit legt Jupiter in 35 s nur etwa
  460 km zurück, gegenüber mindestens 894 861 km Kameraweg vernachlässigbar; die Bahnelemente sind
  wie bei jedem Planeten linear aus der JPL-Näherungstafel fortgeschrieben
  ([Bahnelemente](thema:bahnelemente)).
- **Schatten der Monde:** Alle vier Galileischen Monde zählen als mögliche Verschatter
  (`MAX_OKKLUDER` 4); von Jupiter aus hat die Sonne nur 0,051° Winkelradius, bei 3,1° Achsneigung
  wirft Io deshalb immer, Kallisto zeitweise gar nicht einen Schatten (9,5° gegen 2,1° zulässige
  Sonnenhöhe, [Finsternisse](thema:finsternis)) – ein solcher Schatten kann im Bild erscheinen, ohne
  dass die Szene eigens darauf angelegt wäre; gezielt zeigt das
  [Galileisches Schattenspiel](szene:galileisches-schattenspiel).
- **Zeitraffer:** Er gleitet beim Szenenbeginn 2 s lang geometrisch auf 0,3 Tage/s
  (`RATE_BLEND_SEC`); je nach vorangehender Szene ergibt das zwischen 10,0 (Vorgänger
  `mondfinsternis`, 0,0035 Tage/s) und 23,0 simulierten Tagen (Vorgänger `systemblick`, 30 Tage/s)
  statt der nominellen 10,5 – entsprechend zwischen rund 24 und 56 Jupiterumdrehungen und zwischen
  5,7 und 13,0 Io-Umläufen. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
