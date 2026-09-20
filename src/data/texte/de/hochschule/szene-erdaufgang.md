# Szene: Sonnenaufgang über dem Erdrand

Die Kamera kreist dicht über der [Erde](objekt:earth) und blickt stets auf ihren
Mittelpunkt, während irgendwo im Bild die [Sonne](objekt:sun) steht; die Kennung
`erdaufgang` ist historisch, gezeigt wird der Terminator aus der Nähe.

## Was das Bild zeigt

Ohne Streuung steht die Kamera 2,4 Erdradien vom Mittelpunkt entfernt, 6° über der Ekliptik
(Elevation gegen die Ekliptiknormale, nicht gegen den Horizont eines Beobachters), und dreht
ihren Azimut mit 1,2° je Sekunde, in den 40 s der Szene also um 48°. Ein eigenes Blickziel
fehlt (`lookAtId` ist nicht gesetzt); die Kamera blickt deshalb stets auf den
Erdmittelpunkt, unabhängig von Azimut und Elevation – am Code über 20 000 Ziehungen ohne
Ausnahme nachgerechnet.

Je Abspielen streuen Azimut über den vollen Kreis, Elevation zwischen 2° und 16° (Basis 6°
plus −4° bis 10°) und Abstand um den Faktor 0,9 bis 1,3, also zwischen 2,16 und 3,12
Erdradien. Bei 50° senkrechtem Bildwinkel misst die Erde ohne Streuung
$2\arcsin(1/2{,}4) = 49{,}2^\circ$, mit Streuung 37,4° bis 55,2°: Beim nächsten Abstand ragt
die Kugel über den Bildrand hinaus.

Während der 40 s dreht sich der Globus um 288,8° um die eigene Achse (0,8 Modelltage bei
23,9345 h Rotationsperiode), die Kamera dagegen nur um 48° im Azimut – der Globus überholt
sie also fast einmal ganz, und was der Szenenname verspricht, ist eher ein Vorbeiziehen der
Tag-Nacht-Grenze unter der Kamera als ein Verharren an ihr.

Ob die Sonne selbst im Bild erscheint, hängt stark von Datum und gezogenem Azimut ab: In
einem Raster aus 73 Terminen über ein Jahr, allen Azimuten in 5°-Schritten, vier Elevationen
und drei Zeitpunkten der Szene (63 072 Fälle) liegt die Richtung zur Sonne nur in rund 13 %
innerhalb des halben Bildwinkels (25°) um die Blickachse. Meist zeigt die Szene trotz ihres
Namens eine gewöhnliche Tag- oder Nachtseite ohne Streiflicht am Rand.

## Hintergrund

Sonnenauf- beziehungsweise -untergang gilt als eingetreten, wenn der Mittelpunkt der
Sonnenscheibe auf eine geozentrische Zenitdistanz von 90°50′ sinkt – die Summe aus
mittlerer Horizontrefraktion (34′) und Sonnenhalbmesser (16′). Bürgerliche, nautische und
astronomische Dämmerung setzen dieselbe Zenitdistanz bei 96°, 102° beziehungsweise 108° an,
also 6°, 12° und 18° unter dem Horizont
([U.S. Naval Observatory 2026](literatur:usno-2026)). Die 34′ sind ein Mittelwert: Formeln
wie die von Bennett hängen ausdrücklich von Lufttemperatur und -druck ab und sind nur für
den mittleren Zustand den Tafeln des Nautical Almanac gleichwertig
([Bennett 1982](literatur:bennett-1982)) – am wirklichen Horizont schwankt die Refraktion
mit dem Temperaturprofil der untersten Luftschicht. Weil sie mit sinkender Höhe zunimmt,
hebt sie den unteren Sonnenrand stärker als den oberen: Nahe dem Horizont wirkt die Scheibe
flach gedrückt, ein optischer Effekt, kein realer.

Am Erdrand selbst mischen sich Rayleigh-Streuung und die schwache Absorption des Ozons im
sichtbaren Chappuis-Band: Nach Modellrechnungen zur Dämmerung würde der Himmel ohne Ozon
binnen weniger Grad Sonnentiefe ins Grünlich-Gelbe kippen, mit ihm bleibt er blau
([Hulburt 1953](literatur:hulburt-1953)) – dieselbe Kombination färbt vermutlich auch den
schmalen, tagseitigen Streifen über dem Erdrand in Aufnahmen aus der Umlaufbahn blau bis
violett; zusätzlich glimmt die hohe Atmosphäre schwach als Luftleuchten.

Unabhängig vom Zeitraffer der Szene braucht ein Kreisumlauf in 400 km Höhe über einer Kugel
vom mittleren Erdradius, mit $r = R_\oplus + 400\,\mathrm{km}$,

$$T = 2\pi\sqrt{\frac{r^3}{GM_\oplus}}$$

rund 92,4 min ($GM_\oplus$ und $R_\oplus$ wie im Datenblock:
[Petit und Luzum 2010](literatur:petit-2010); [NSSDC Earth Fact Sheet](quelle:nssdc-earth)).
Das sind rund 15,6 Umläufe und ebenso viele Sonnenauf- und -untergänge je Tag – nahe an den
16 der Schulfassung dieser Szene, die auf 90 Minuten und 16 rundet. Mit dem willkürlichen
Kamerapfad der Szene (1,2° Azimut je Sekunde) hat diese reale Größe nichts zu tun.

Dass der Terminator überhaupt als Streifen und nicht als Halbkreis durch die Pole erscheint,
liegt an der [Achsneigung](thema:achsneigung) der Erde: Er steht senkrecht zur
Sonnenrichtung, nicht zur Rotationsachse, und wandert mit der Deklination der Sonne übers
Jahr zwischen den Wendekreisen hin und her.

## Modellgrenzen

- **Keine Atmosphäre, keine Wolken:** Die einzige Erdtextur ist eine Albedokarte
  (`public/textures/earth/albedo.jpg`); eine Wolken- oder Atmosphärenschicht, einen
  Refraktionsknick am Rand, Dämmerungsfarben, das Chappuis-Band oder Luftleuchten gibt es
  nicht. Der Terminator folgt allein dem Lambert-Anteil des Materials plus dem Fülllicht der
  Nachtseite, standardmäßig ein Viertel des Tagniveaus (`nightFill = 0,25`); die abgeplattete
  Sonnenscheibe aus dem Hintergrund-Abschnitt fehlt ebenso.
- **Feste Rotationslage:** Orrery dreht die Erde gleichförmig mit der siderischen Periode
  23,9345 h ab einem festen Nullpunkt bei Rektaszension 0°
  ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)), ohne Präzession, Nutation oder Polbewegung;
  der Kartennullmeridian ist deshalb gegenüber dem [Erdrotationswinkel](thema:bezugssysteme)
  verdreht – um 75,4° am 17. September 2026, wie im Abschnitt „Im Modell" von `objekt-earth`
  hergeleitet, und am 20. September 2026 unverändert bei 75,4° (Drift rund 0,0004° je Tag).
  Tag und Nacht liegen so über falschen Längen.
- **Sonnenscheibe:** Wie groß die Sonne erscheint, hängt vom Maßstab ab, nicht nur vom
  Abstand: Ihr dargestellter Radius trägt die Dämpfung `sunDamping`, aber vollen `sizeScale`
  obendrauf. Im Standardmaßstab „Schaubild" (`sizeScale` 50, `sunDamping` 0,35) misst die
  Sonne am 20. September 2026 9,31° statt der wirklichen 0,53° – das 17,6-Fache, deckungsgleich
  mit den 9,3° aus `objekt-sun` –, im Maßstab „Kompakt" (200/0,2) sogar 21,40°, das 40,3-Fache;
  nur „Realistisch" zeigt annähernd die wahre Größe. Die selbstleuchtende Sonne trägt kein
  Beleuchtungsmaterial und bleibt von der
  Zielbelichtung ([Photometrie](thema:photometrie)) unberührt, nur ihr Bloom-Schein hängt am
  selben Radius.
- **Zeitraffer:** Er gleitet beim Szenenbeginn geometrisch über 2 s vom Wert der vorigen
  Szene auf den Sollwert 0,02 Tage je Sekunde. Weil dieser Sollwert selbst zu den niedrigsten
  im Katalog zählt, wirkt sich die Herkunft besonders stark aus: Je nach Vorgänger – der
  Katalog reicht von 0,0035 bis 30 Tagen je Sekunde – vergehen in den 40 s zwischen 0,78 und
  9,21 Tagen statt der nominellen 0,8, und der Globus dreht sich entsprechend zwischen
  0,78- und 9,24-mal statt einmal. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
