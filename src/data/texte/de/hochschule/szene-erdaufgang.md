# Szene: Sonnenaufgang über dem Erdrand

Die Kamera kreist dicht über der [Erde](objekt:earth) und blickt stets auf ihren
Mittelpunkt. Der Kommentar im Datensatz nennt die Absicht: Die [Sonne](objekt:sun) soll sich
im Streiflicht über die Kante schieben – das trifft aber nur einen Teil der Ziehungen (siehe
unten).

## Was das Bild zeigt

Ohne Streuung steht die Kamera 2,4 dargestellte Erdradien vom Mittelpunkt entfernt (im
Standardmaßstab „Schaubild" real 764 520 km, siehe Modellgrenze „Sonnenscheibe"), 6° über
der Ekliptik (Elevation gegen die Ekliptikebene, nicht gegen ihre Normale oder den Horizont
eines Beobachters), und dreht ihren Azimut mit 1,2° je Sekunde, in den 40 s der
Szene also um 48°. Ein eigenes Blickziel fehlt (`lookAtId` ist nicht gesetzt); die Kamera
blickt deshalb stets auf den Erdmittelpunkt, unabhängig von Azimut und Elevation – am Code
über 20 000 Ziehungen ohne Ausnahme nachgerechnet.

Je Abspielen streuen Azimut über den vollen Kreis, Elevation zwischen 2° und 16° (Basis 6°
plus −4° bis 10°) und Abstand um den Faktor 0,9 bis 1,3, also zwischen 2,16 und 3,12
Erdradien. Bei 50° senkrechtem Bildwinkel misst die Erde ohne Streuung
$2\arcsin(1/2{,}4) = 49{,}2^\circ$, mit Streuung 37,4° bis 55,2°: Beim nächsten Abstand ragt
die Kugel senkrecht über den Bildrand hinaus (waagerecht reicht das Feld bei 16:9 bis
±39,6°, dort bleibt sie im Bild).

Während der 40 s dreht sich der Globus um 288,8° um die eigene Achse (0,8 Modelltage bei
23,9345 h Rotationsperiode), die Kamera dagegen nur um 48° im Azimut; relativ zur Kamera
sind das 288,8° − 48° = 240,8°, also 0,67 Umläufe. Der Terminator, wo er im Bild steht
(siehe unten), zieht in den 40 s spürbar unter der Kamera hindurch, statt stillzustehen.

Ob die Sonne selbst im Bild erscheint, hängt von Datum, Azimut, Elevation und Abstand ab:
Über 200 000 Zufallsziehungen dieser vier Größen und der Szenenzeit (mitlaufende Uhr,
0,02 Tage je Sekunde) liegt die Sonnenrichtung nur in rund 22 % im Bildfeld (50° senkrecht,
±39,6° waagerecht bei 16:9); ihre Scheibe ist wenigstens teilweise zu sehen in rund 14 %,
ganz frei und im Bild in rund 8 %, am Erdrand angeschnitten – das Streiflicht des
Szenennamens – in rund 6 %. Den Terminator selbst zeigt die Szene dagegen weit häufiger: Er
liegt auf der von der Kamera aus sichtbaren Kappe der Erde in rund drei Vierteln der
Ziehungen (74 bis 78 %, je nachdem, ob die Grenze der Kappe geometrisch exakt oder über eine
Abtastung mit 300 Punkten gezählt wird). Meist zeigt die Szene also den Übergang von Tag zu
Nacht, aber ohne die Sonne selbst im Bild.

## Hintergrund

Sonnenauf- beziehungsweise -untergang gilt als eingetreten, wenn der Mittelpunkt der
Sonnenscheibe auf eine geometrische Zenitdistanz von 90°50′ sinkt – der Überschuss von 50′
über 90° ist die Summe aus mittlerer Horizontrefraktion (34′) und Sonnenhalbmesser (16′).
Bürgerliche, nautische und astronomische Dämmerung setzen dieselbe Zenitdistanz bei 96°,
102° beziehungsweise 108° an, also 6°, 12° und 18° unter dem Horizont
([U.S. Naval Observatory 2026](literatur:usno-2026)). Die 34′ sind ein Nennwert für
Normalbedingungen; die tatsächliche Refraktion hängt von Lufttemperatur und -druck vor Ort
ab – Bennetts Formeln bilden das ausdrücklich über einen weiten Temperatur- und
Druckbereich nach und bleiben dabei mit den Tafeln des Nautical Almanac praktisch
gleichwertig ([Bennett 1982](literatur:bennett-1982)). Weil die Refraktion mit sinkender
Höhe zunimmt, hebt sie den unteren Sonnenrand stärker als den oberen: Nahe dem Horizont
wirkt die Scheibe flach gedrückt, ein optischer Effekt, kein realer.

Am Erdrand selbst mischen sich Rayleigh-Streuung und die schwache Absorption des Ozons im
sichtbaren Chappuis-Band: Nach Modellrechnungen zum Zenithimmel der Dämmerung wäre er ohne
Ozon binnen weniger Grad Sonnentiefe graugrün-blau bei Sonnenuntergang und gelblich in der
Dämmerung, mit Ozon bleibt er blau ([Hulburt 1953](literatur:hulburt-1953)) – dieselbe
Kombination färbt vermutlich auch den schmalen, tagseitigen Streifen über dem Erdrand in
Aufnahmen aus der Umlaufbahn blau bis violett.

Unabhängig vom Zeitraffer der Szene braucht ein Kreisumlauf in 400 km Höhe über einer Kugel
vom mittleren Erdradius, mit $r = R_\oplus + 400\,\mathrm{km}$,

$$T = 2\pi\sqrt{\frac{r^3}{GM_\oplus}}$$

rund 92,4 min ($R_\oplus$ = 6371 km aus dem Datensatz,
[NSSDC Earth Fact Sheet](quelle:nssdc-earth); $GM_\oplus = 3{,}986004418 \cdot
10^{14}\,\mathrm{m^3\,s^{-2}}$ aus der IERS-Tafel,
[Petit und Luzum 2010](literatur:petit-2010); die Simulation rechnet mit
$G_\mathrm{CODATA}$ mal Erdmasse, rund 5 ppm darüber, ohne Folge für diese Minutenzahl). Das
sind rund 15,6 Umläufe und ebenso viele Sonnenauf- und -untergänge je Tag – nahe an den 16
der Schulfassung, die auf 90 Minuten und 16 rundet. Mit dem willkürlichen Kamerapfad der
Szene (1,2° Azimut je Sekunde) hat diese reale Größe nichts zu tun.

Die [Achsneigung](thema:achsneigung) der Erde bestimmt die Lage des Terminators: Er steht
stets senkrecht zur Sonnenrichtung, nicht zur Rotationsachse, und neigt sich deshalb gegen
die Meridiane, während der subsolare Punkt übers Jahr zwischen den Wendekreisen wandert; nur
zu den Tagundnachtgleichen geht er durch die Pole.

## Modellgrenzen

- **Keine Atmosphäre, keine Wolken:** Die einzige Erdtextur ist eine Albedokarte
  (`public/textures/earth/albedo.jpg`); eine Wolken- oder Atmosphärenschicht, einen
  Refraktionsknick am Rand, Dämmerungsfarben, das Chappuis-Band oder Luftleuchten gibt es
  nicht. Der Terminator folgt dem lambertschen Anteil des Materials mal $1-F$ mit dem
  Fresnel-Faktor $F$, der zum Rand hin wächst, plus dem Fülllicht der Nachtseite –
  standardmäßig ein Viertel des Tagniveaus, über die ganze sichtbare Scheibe und damit auch
  auf der Tagseite; die abgeplattete Sonnenscheibe aus dem Hintergrund-Abschnitt fehlt
  ebenso.
- **Feste Rotationslage:** Orrery dreht die Erde gleichförmig mit der siderischen Periode
  23,9345 h ab einem festen Nullpunkt bei Rektaszension 0°
  ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)), ohne Präzession, Nutation oder Polbewegung;
  der Kartennullmeridian ist deshalb gegenüber dem [Erdrotationswinkel](thema:bezugssysteme)
  verdreht – um 75,4° am 17. September 2026, wie im Abschnitt „Im Modell" von `objekt-earth`
  hergeleitet, und am 20. September 2026 unverändert bei 75,4° (Drift rund 0,0004° je Tag).
  Tag und Nacht liegen so über falschen Längen.
- **Sonnenscheibe:** Wie groß die Sonne erscheint, hängt vom Maßstab ab, nicht nur vom
  Abstand: Ihr dargestellter Radius trägt die Dämpfung `sunDamping`, aber vollen `sizeScale`
  obendrauf – ein reiner Radiusfaktor von `50 · 0,35 = 17,5` in „Schaubild" und
  `200 · 0,2 = 40` in „Kompakt", deckungsgleich mit `objekt-sun`. Vom Kamerastandort aus
  (nicht vom Erdmittelpunkt) schwankt der Winkeldurchmesser der Sonne in „Schaubild" mit
  Datum und Azimut zwischen rund 9,2° und 9,4° statt der wirklichen rund 0,53° – etwa das
  17,5-Fache –, in „Kompakt" entsprechend um das 40-Fache; nur „Realistisch" zeigt annähernd
  die wahre Größe.
- **Belichtung und Tonemapping:** Die Kamera belichtet auf die Erde als Ziel
  ([Photometrie](thema:photometrie)): Die Tagseite erreicht dadurch, unabhängig vom
  wirklichen Sonnenabstand, den linearen Bezugswert 1, die Nachtseite nur das Fülllicht, ein
  Viertel davon, und liegt nach der ACES-Tonwertkurve entsprechend dunkler im Bild. Da die
  Szene je nach Streuung mal überwiegend die Tag-, mal überwiegend die Nachtseite zeigt, hält
  diese Zielbelichtung beide unabhängig von Datum und Sonnenabstand vergleichbar hell, ohne
  dass einer der beiden Werte eine physikalische Messgröße wäre. Die selbstleuchtende Sonne
  bleibt davon unberührt; nur ihr Bloom-Schein hängt am dargestellten Radius.
- **Zeitraffer:** Er gleitet beim Szenenbeginn geometrisch über 2 s vom Wert der vorigen
  Szene auf den Sollwert 0,02 Tage je Sekunde, wobei jedes Bild vom zuletzt erreichten Wert
  aus weiterblendet. Weil dieser Sollwert selbst zu den niedrigsten im Katalog zählt, wirkt
  sich die Herkunft besonders stark aus: Je nach Vorgänger – der Katalog reicht von 0,0035
  bis 30 Tagen je Sekunde – vergehen bei 60 Bildern je Sekunde in den 40 s zwischen 0,80 (dem
  Sollwert selbst) und rund 3,49 Tagen, und der Globus dreht sich entsprechend zwischen 0,80-
  und 3,50-mal um die eigene Achse; bei anderen Bildraten weicht der obere Wert zusätzlich ab
  (30 Bilder je Sekunde: 4,62 Tage; 144: 2,54 Tage). Weitere Vereinfachungen:
  [Grenzen des Modells](thema:modell).

*Stand: September 2026*
