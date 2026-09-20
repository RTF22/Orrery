# Szene: Der Tanz des Mondes

Der [Mond](objekt:moon) umläuft die [Erde](objekt:earth) im Zeitraffer, schräg von oben gesehen.

## Was das Bild zeigt

Die Kamera hängt an der Erde, 150 dargestellte Erdradien entfernt und 55° über der Ekliptik, und
blickt auf den Erdmittelpunkt; ihr Azimut wandert rechtläufig mit 0,5° je Sekunde, in den 45 s der
Szene also um 22,5°. Bezugsgröße ist der dargestellte Radius, Radius mal Größenfaktor; weil der
Mondabstand mit demselben Faktor wächst, zeigt die Szene in allen drei Maßstabsstufen dieselbe
Geometrie, und das Verhältnis von großer Halbachse zu Erdradius bleibt 60,35.

Je Abspielen streuen der Azimut über den vollen Kreis, die Höhe zwischen 30° und 85° und der Abstand
um den Faktor 0,8 bis 1,2, also über 120 bis 180 Erdradien. Die Höhe bestimmt die scheinbare Form
der Bahn: Bei 30° erscheint die Ellipse je nach Bahnlage auf 0,44 bis 0,62 ihrer Breite gestaucht,
im Mittel auf 0,54; bei 85° ist sie fast kreisrund.

Bei 50° senkrechtem Bildwinkel misst die Erde $2\arcsin(1/150) = 0{,}76^\circ$, mit Streuung 0,64°
bis 0,95°; der Mond kommt je nach Bahnstelle auf 0,16° bis 0,26°, mit Streuung auf 0,13° bis 0,46°.
Beide bleiben Scheibchen; die Bahnlinie dagegen füllt das Bild. Ihr Winkelradius um die Bildmitte
liegt bei Höhe 55° und Faktor 1 je nach Lage von Knoten- und Apsidenlinie zwischen rund 23° und 25°,
die halbe Bildhöhe bei 25°: Schon ohne Abstandsstreuung tritt sie gelegentlich über den Rand. Beim
Abstandsfaktor 0,8 bleibt sie nur bei flacher Aufsicht ganz im Bild, wo die gestauchte Ellipse in
die Bildhöhe passt: bei 30° Höhe in 68 % der Fälle, bei 40° in 9 %, ab 45° nie. Über alle Ziehungen
bleiben bei 16:9 im Mittel 96 % der Linie im Bild, vollständig in gut zwei Dritteln der Fälle.

45 s zum Sollwert von 0,9 Tagen je Sekunde sind 40,5 Tage, 1,48 siderische Umläufe zu je 30,4 s;
weil die Kamera in derselben Richtung mitwandert, zieht der Mond gegenüber dem Bildausschnitt nur
1,42-mal herum. Die Blende lässt etwas mehr Zeit vergehen (siehe Zeitraffer unten).

## Hintergrund

Ein Umlauf dauert je nach Bezugsrichtung verschieden lange, und weil Frühlingspunkt, Perigäum,
Knoten und Sonne alle wandern, werden daraus fünf Monate. Die Werte folgen aus den
Fundamentalargumenten der IERS Conventions
([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.43 und 5.44):

| Monat | gezählt gegen | Länge |
|---|---|---|
| siderisch | Fixsternhimmel | 27,32166 d |
| tropisch | Frühlingspunkt des Datums | 27,32158 d |
| anomalistisch | Perigäum | 27,55455 d |
| drakonitisch | aufsteigenden Knoten | 27,21222 d |
| synodisch | Sonne | 29,53059 d |

Der siderische Monat ist zugleich die Rotationsperiode, denn die Rotation ist
[gebunden](thema:gebundene-rotation). Fällt Vollmond nahe an einen Knoten, gibt es eine
[Mondfinsternis](szene:mondfinsternis).

Die Sonne zieht am Mond stärker als die Erde, nach dem NASA-Kanon mehr als doppelt so stark
([Espenak und Meeus 2009](literatur:espenak-2009)); mit den Gravitationsparametern der IERS ist es
je nach Abstand das 1,8- bis 2,5-Fache, im Mittel das 2,2-Fache. Die Beschleunigung zur Sonne
überwiegt also überall, und weil sie fast senkrecht auf der Bahnrichtung steht, ist die Bahn des
Mondes um die Sonne überall zur Sonne hin gekrümmt: weder Schleife noch Spitze. Auch die höchstens
1,10 km/s um die Erde ([Faktenblatt](quelle:nssdc-moon)) heben die rund 29,8 km/s der Erdbahn nie
auf.

In der ekliptikalen Länge erscheinen die Störungen der Sonne als Reihe: Auf die
Mittelpunktsgleichung der Kepler-Ellipse (erstes Glied 22 639,55″, Periode des anomalistischen
Monats) folgen Evektion (4586,43″ = 1,274°, Argument $2D - l$, 31,81 d), Variation
(2369,91″ = 0,658°, $2D$, 14,77 d) und jährliche Gleichung (−666,44″ = −0,185°, $l_\odot$,
365,26 d); das größte solare Glied der Breite ist 623,66″ = 0,173° mit $2D - F$, das des Abstands
−3699 km mit $2D - l$ ([Chapront-Touzé und Chapront 1988](literatur:chapront-touze-1988)).

Die momentane Exzentrizität pendelte dadurch 2008 bis 2010 zwischen 0,0266 und 0,0762, am größten
alle 205,9 Tage, wenn die Apsidenlinie zur Sonne zeigt. Über die fünf Jahrtausende des NASA-Kanons
reicht der Perigäumsabstand von 356 355 bis 370 399 km, der Apogäumsabstand dagegen nur von
404 042 bis 406 725 km, und der anomalistische Monat von 24,629 bis 28,565 Tagen
([Espenak und Meeus 2009](literatur:espenak-2009)); eine eigene Auswertung der Ephemeride DE441
([Park et al. 2021](literatur:park-2021)) für 1990 bis 2030 ergibt 356 509 bis 370 323 km,
404 077 bis 406 707 km und 24,65 bis 28,55 Tage.

Streng genommen umlaufen beide Körper ihren gemeinsamen Schwerpunkt. Mit dem Massenverhältnis
$\mu = 0{,}0123000371$ liegt er um $\mu/(1 + \mu)$, also 1,215 % des Abstands, vom Erdmittelpunkt
entfernt: 4332 bis 4942 km und damit stets im Erdkörper. Von der Sonne aus taumelt der
Erdmittelpunkt deshalb im Monatstakt um bis zu 6,9″.

## Modellgrenzen

- **Kepler-Ellipse:** feste große Halbachse 384 467 km, Exzentrizität 0,0549 und Neigung 5,145°
  gegen die Ekliptik ([Bahnelemente](thema:bahnelemente)); mittlere Länge, Perigäum und Knoten
  laufen linear, die Raten nach Meeus um die allgemeine Präzession vermindert auf +4067,6168° und
  −1935,5333° je Jahrhundert. Kein periodisches Glied ist enthalten: Gegen DE441 weicht die Länge
  1990 bis 2030 um bis zu 2,39° ab (quadratisches Mittel 1,03°), die Breite um 0,34°, der Abstand um
  rund 7010 km. Der Abstand pendelt starr zwischen 363 359 und 405 574 km; die Schwankung von
  Perigäum, Apogäum und Monatslänge fehlt ganz. Der Datenblock zeigt statt der siderischen
  Umlaufzeit die nach Kepler gerechneten 27,2916 Tage, 0,11 % weniger.
- **Bahnlinie:** die momentane Ellipse zur Uhrzeit, über die exzentrische Anomalie abgetastet — der
  Mond sitzt deshalb immer genau auf ihr. Während der Szene dreht sich die Apsidenlinie um 4,5° bis
  4,9°, die Knotenlinie um −2,1° bis −2,4°.
- **Ruhende Erde:** Der Erdmittelpunkt sitzt im Erde-Mond-Schwerpunkt der JPL-Tafel, der Mond hängt
  starr an ihm; das Bild zeigt deshalb keinen Umlauf beider Körper um einen gemeinsamen Punkt. Der
  wahre Erdmittelpunkt läge 4415 bis 4928 km daneben.
- **Maßstab und Licht:** Der Mondabstand wächst mit dem Größenfaktor wie die Radien, der
  Sonnenabstand wird dagegen komprimiert; weil das Punktlicht in der dargestellten Sonne sitzt,
  weicht die Lichtrichtung am Mond innerhalb eines Monats um bis zu 7,6° („Schaubild") oder 32,7°
  („Kompakt") von der wahren ab, die Phasen entsprechend.
- **Zeitraffer:** Beim Szenenbeginn gleitet er geometrisch über 2 s vom Wert der vorigen Szene auf
  0,9 Tage je Sekunde; je nach Vorgänger — der Katalog reicht von 0,0035 bis 30 Tagen je Sekunde —
  vergehen in den 45 s 40,2 bis 44,4 statt 40,5 Tage.
- **Keine Gezeiten:** Die große Halbachse bleibt fest, während die [Gezeitenreibung](thema:gezeiten)
  den Mond um 3,8 cm je Jahr nach außen schiebt. Weitere Vereinfachungen:
  [Grenzen des Modells](thema:modell).

*Stand: September 2026*
