# Szene: Merkur auf der Innenbahn

Die Kamera jagt [Merkur](objekt:mercury) auf seiner Bahn um die [Sonne](objekt:sun) hinterher —
den schnellsten Planeten des Katalogs.

## Was das Bild zeigt

Der Bahntyp `chase` hängt die Kamera hinter den Körper, entgegen seinem aktuellen
Geschwindigkeitsvektor, und hebt sie zusätzlich rein senkrecht um `radius · sin(Elevation)` an
(`render/camera/cinema.ts`); anders als bei den `orbit`-Szenen dreht kein `azimuthRateDegPerSec`
von außen mit, die gesamte Schwenkbewegung kommt aus Merkurs eigener Bahnbewegung. Bezugsgröße für
den Abstand ist der dargestellte Merkurradius, Radius mal `sizeScale` — eine zusätzliche Dämpfung
wie bei der Sonne (`sunDamping`) kennt `scaledRadius` für Planeten nicht. Weil der Höhenversatz
rein senkrecht addiert wird, statt mit der Blickrichtung mitzudrehen, liegt der wahre Abstand zum
Mittelpunkt nicht genau bei den nominellen neun Körperradien: An der unteren Grenze der
Elevationsstreuung (5°) sind es das 1,014-fache, an der oberen (30°) das 1,17-fache. Merkurs
geringe Bahnneigung von $i = 7{,}00^\circ$ hält den Unterschied klein, denn ein Vektor in der
Bahnebene zeigt nie mehr als $\sin i = 0{,}122$ seiner Länge aus der Ekliptik heraus.

30 Sekunden bei 2 Tagen je Sekunde sind 60 simulierte Tage, gut zwei Drittel (68,2 %) der
Umlaufzeit des Datensatzes von 87,969 Tagen — derselbe Wert wie im
[Faktenblatt](quelle:nssdc-mercury). Die Blende beim Szenenübergang lässt je nach vorangehender
Szene 56,6 bis 76,9 Tage vergehen (Katalogextreme 0,0035 bis 30 Tage je Sekunde als Vorgängerrate),
also 64 bis 87 % eines Merkurjahres statt der nominellen 68,2 %.

Bei 50° senkrechtem Bildwinkel misst Merkur an den Basiswerten (Elevation 10°, Faktor 1) rund
$12{,}3^\circ$ — in allen drei Maßstabsstufen identisch, weil Radius und Abstand gleich mit
`sizeScale` skalieren; über die volle Streuung (Elevation 5° bis 30°, Faktor 0,8 bis 1,6, ein Jahr
lang abgetastet) reicht das von $6{,}8^\circ$ bis $16{,}1^\circ$. Die Sonne hängt dagegen am
Maßstabs-Preset: In der Voreinstellung „Schaubild" misst sie zu Szenenbeginn $14{,}9^\circ$ und
wächst binnen der 30 Sekunden auf $18{,}3^\circ$, weil Merkurs komprimierter Sonnenabstand in
dieser Bahnphase sinkt; in „Realistisch" sind es nur $1{,}2^\circ$, in „Kompakt" $29{,}5^\circ$.

Die Bahngeschwindigkeit selbst zeigt sich nicht unmittelbar: Die Kamera zentriert Merkur
unabhängig von seinem Tempo, nur die Richtung hinter ihm dreht sich mit dem wahren
Geschwindigkeitsvektor. Sichtbar wird stattdessen, wie schnell Sonne und Hintergrund im Bild
vorbeischwingen — nach dem zweiten Keplerschen Gesetz ist die Winkelgeschwindigkeit
$\dot\theta \propto 1/r^2$, am Perihel also um den Faktor $(r_\mathrm{aph}/r_\mathrm{peri})^2 =
2{,}30$ höher als am Aphel, deutlich mehr als das reine Geschwindigkeitsverhältnis
$v_\mathrm{peri}/v_\mathrm{aph} = (1+e)/(1-e) = 1{,}518$.

## Hintergrund

Aus der Vis-Viva-Gleichung $v(r)^2 = GM_\odot\,(2/r - 1/a)$ folgen mit den Werten aus `mercury.ts`
und `sun.ts` (CODATA-$G$ mal Katalogmasse) bei $a(1-e) = 46{,}00$ und $a(1+e) = 69{,}82$ Millionen
Kilometern die Bahngeschwindigkeiten $v_\mathrm{peri} = 58{,}98$ und
$v_\mathrm{aph} = 38{,}86\,\mathrm{km/s}$ — nahe den im Faktenblatt genannten $58{,}97$ und
$38{,}86\,\mathrm{km/s}$ ([NSSDC Mercury Fact Sheet](quelle:nssdc-mercury)).

Schon Le Verrier fand im 19. Jahrhundert die überschüssige Periheldrehung, eine der ersten
Prüfungen der Allgemeinen Relativitätstheorie; die zugehörigen Zahlen führt der verlinkte Text zu
Merkur aus. Aus der 3:2-Kopplung von Rotation und Umlauf folgt der 176 Tage lange Sonnentag — und
weil die Winkelgeschwindigkeit der Bahn am Perihel ($6{,}35^\circ$ je Tag) die Rotationsrate des
Datensatzes ($6{,}14^\circ$ je Tag) knapp übersteigt, während sie am Aphel ($2{,}76^\circ$ je Tag)
weit darunterbleibt, kehrt sich der scheinbare Lauf der Sonne am Merkurhimmel nahe dem Perihel für
einige Tage um. Diesen Effekt beschrieben Soter und Ulrichs als erste
([Soter und Ulrichs 1967](literatur:soter-1967)).

Von der Erde aus bleibt Merkur stets nah bei der Sonne: Mit $a(1-e) = 0{,}307$ und
$a(1+e) = 0{,}467$ Astronomischen Einheiten sowie der Erdbahn bei rund 1 AE liegt die größte
Elongation überschlägig zwischen $\arcsin(0{,}307) = 17{,}9^\circ$ und
$\arcsin(0{,}467) = 27{,}8^\circ$. Nahe der oberen Konjunktion, bei kleiner Phase und größtem
Abstand, erscheint er trotzdem am hellsten ([Photometrie](thema:photometrie)). Transits vor der
Sonnenscheibe sind selten: Sie brauchen eine untere Konjunktion nahe einem der beiden Bahnknoten
und treten deshalb fast nur im Mai oder November auf.

## Modellgrenzen

- **Bahn:** Kepler-Ellipse mit linear fortgeschriebenen Elementen
  ([Bahnelemente](thema:bahnelemente)); die Periheldrehung des Datensatzes, $577{,}716804$
  Bogensekunden je Jahrhundert gegen die feste Ekliptik J2000, enthält die beobachtete
  Gesamtdrehung samt relativistischem Anteil und liegt 2,41 Bogensekunden je Jahrhundert über dem
  gemessenen Gesamtwert $575{,}3100 \pm 0{,}0015$ Bogensekunden je Jahrhundert
  ([Park et al. 2017](literatur:park-2017)).
- **Rotation ohne Libration:** `rotationPeriodH` $1407{,}6\,\mathrm{h} = 58{,}65$ Tage gegen zwei
  Drittel der siderischen Umlaufzeit des Datensatzes ($58{,}6461709$ Tage): Die Drehung bleibt je
  Jahrhundert um $14{,}6^\circ$ hinter der exakten 3:2-Kopplung zurück, gegen die gemessenen
  $58{,}6460768$ Tage ist die Modellperiode 339 s zu lang
  ([Gebundene Rotation](thema:gebundene-rotation); [Stark et al. 2015](literatur:stark-2015)).
- **Belichtung:** Die Kamera belichtet auf das Ziel — hier Merkur selbst, da die Szene kein
  `lookAtId` setzt.
- **Sonne als gedämpfte Scheibe:** `sunDamping` (1,0 / 0,35 / 0,2 in Realistisch, Schaubild,
  Kompakt) und der Abstandsexponent zusammen erklären die oben beschriebenen, sehr
  unterschiedlichen Sonnengrößen je Preset; über ein Jahr mit voller Streuung reicht ihr
  Winkeldurchmesser im Schaubild von $14{,}8^\circ$ bis $19{,}0^\circ$, im Verhältnis $1{,}287$ —
  nahe dem aus dem Kompressionsexponenten $0{,}6$ erwarteten
  $(r_\mathrm{aph}/r_\mathrm{peri})^{0{,}6} = 1{,}284$.
- **Zeitraffer:** Beim Szenenbeginn gleitet er geometrisch über 2 s auf den Sollwert (siehe oben).
- **Kein Schatten durch Merkur:** `waehleOkkluder` wählt nur den Mutterkörper und Geschwistermonde
  als Verschatter; da Merkur ein mondloser Planet ist, wirft er im Modell nie einen Schatten und
  verdunkelt die Sonne für keinen anderen Körper — Merkurtransits und Sonnenfinsternisse durch
  Merkur kommen im Bild nicht vor ([Finsternisse](thema:finsternis)). Weitere Vereinfachungen:
  [Grenzen des Modells](thema:modell).

*Stand: September 2026*
