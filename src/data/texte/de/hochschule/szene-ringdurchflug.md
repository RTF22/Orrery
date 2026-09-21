# Szene: Durchflug durch Saturns Ringe

Die Kamera fliegt in gerader Linie an [Saturn](objekt:saturn) vorbei, flach über [den Ringen](thema:ringe)
und rund zwei Saturnradien vom Mittelpunkt entfernt – wie beim [Vorbeiflug an Jupiter](szene:jupiter-vorbeiflug)
verschiebt sie sich dabei linear quer zur Blickrichtung, kreuzt aber tatsächlich einmal die Ringebene.

## Was das Bild zeigt

Der Bahntyp `flyby` hält den Blick durchgehend auf Saturns Mittelpunkt gerichtet und verschiebt die
Kamera linear quer zur Sichtlinie, von +2 auf −2 Radien (`render/camera/cinema.ts`); ein Radius ist
hier der doppelte dargestellte Saturnradius (58 232 km) mal Streufaktor (`distanceInRadii: 2`). Bei
Streufaktor 0,8/1,0/1,5 legt sie in den 30 Sekunden 372 685/465 856/698 784 km zurück – 12 423/15 529/
23 293 km/s, also 4,1 bis 7,8 % der Lichtgeschwindigkeit. Wie bei jedem `flyby` liegt der größte
Abstand an beiden Enden beim $\sqrt5$-Fachen des Radius, der geringste exakt in der Bahnmitte (15 s)
beim Radius selbst: Dort misst Saturns Winkeldurchmesser 60° (Streuung 39° bis 77°, teils über dem
50°-Sichtfeld), an Anfang und Ende nur 26° (17° bis 32°). Azimut 169,53° ist – wie bei
[Saturn im Streiflicht](szene:saturn-streiflicht) – der aus Task 5 übernommene Ringebenenknoten (dort
aus der Pollänge 79,5275° + 90° hergeleitet; hier nur zur Kontrolle an der eigenen Kamerageometrie
bestätigt: 169,5275°). Beim nominellen Abstand (2 Radien, 116 464 km) liegt der Bezugspunkt der Bahn
mitten im B-Ring (91 975–117 570 km, [Ringe](thema:ringe)), nahe dessen Außenrand.

Der Kommentar im Quellcode behauptet, die seitliche Bewegung drifte „zunehmend" aus der um 28,05°
gegen die Ekliptik geneigten Ringebene heraus – eine Nachrechnung zeigt stattdessen eine über die
ganze Fahrt **konstante** Rate von 7303 km/s (das Vierfache des Radius mal Sinus der 28,05°-Neigung,
geteilt durch die 30 Sekunden Szenendauer): Die Kamera startet rund 1,8 Saturnradien unterhalb der
Ringebene, kreuzt sie – je nach gezogener Elevation – zwischen 10,4 s und 14,8 s, stets vor der
Bahnmitte bei 15 s, an einem Punkt 2,0 bis 2,3 Saturnradien vom Zentrum (also mitten im B- oder
A-Ring), und endet rund 2,0 Radien darüber. Nur am unteren Rand der Elevationsstreuung (nahe −3°,
insgesamt rund 1°) steht der Ring dabei genau in der Bahnmitte noch fast auf der Kante
($B\approx\arcsin(\sin(1^\circ)\cos i)\approx0{,}9^\circ$ mit $i=28{,}05^\circ$, dieselbe Formel wie
bei [Saturns Ringe von der Kante](szene:saturn-ringkante)); am oberen Rand (+15°, insgesamt 19°) hat
er sich dort bereits auf 16,7° geöffnet.

Zum Referenzzeitpunkt (21.09.2026) bleibt der Phasenwinkel Sonne–Saturn–Kamera während der ganzen
Szene unter 85°, die [Vorwärtsstreuung](thema:photometrie) (`RING_STREUUNG` 0,85) liefert deshalb
praktisch nichts; weil der Azimut exakt auf dem Ringknoten steht, erreicht derselbe Phasenwinkel nur
an einem einzigen Punkt in Saturns 29,4 Jahre langem Umlauf nahe 180° (rechnerisch um Anfang 2014,
mit gleicher Methode nächste Wiederkehr um Mitte 2043) – dann zeigte genau dieser Vorbeiflug den Ring
im nahen Vollgegenlicht.

In den nominell 1,5 simulierten Tagen dreht sich Saturn 3,4-mal (10,656 h); [Mimas](objekt:mimas)
(0,942 d) läuft dabei 1,6-mal, [Enceladus](objekt:enceladus) (1,370 d) 1,1-mal um. Die Ringtextur löst
den Streifen radial mit 30,3 km je Bildpunkt auf (62 122 km auf 2048 Pixel, `ASSETS.md`).

## Hintergrund

Echte Ringdurchflüge blieben wenigen Sonden vorbehalten, stets außerhalb der dichten Hauptringe:
Pioneer 11 kreuzte die Ebene am 1. September 1979 rund 35 000 km jenseits der A-Ring-Außenkante,
Voyager 2 passierte Saturn 1981 in rund 161 000 km Abstand, nahe der schwachen G-Ringebene.
[Cassinis](quelle:nasa-cassini) Orbiteinschuss führte sie 2004 in rund 158 500 km Abstand durch die
Lücke zwischen F- und G-Ring; am 15. September 2017 endete dieselbe Mission, nachdem sie im Großen
Finale denselben Spalt zwischen D-Ring und Atmosphäre 22-mal durchflogen hatte
([Ye et al. 2018](literatur:ye-2018)), dabei rund 5 kg einfallenden Ringstaub je Sekunde in der oberen
Atmosphäre maß ([Mitchell et al. 2018](literatur:mitchell-2018)) und ihn in situ auffing
([Hsu et al. 2018](literatur:hsu-2018)) – ein Rückblick auf 13 Jahre Cassini-Forschung im
Saturnsystem zieht [Spilker (2019)](literatur:spilker-2019).

Für eine Sonde bei vielen Kilometern je Sekunde ist schon ein Zentimeter-Brocken gefährlich:
Radiobedeckungen der Voyager-Sonden ergaben für die Hauptringe eine breite Teilchengrößenverteilung
von Staubkorngröße bis zu mehreren Metern ([Zebker et al. 1985](literatur:zebker-1985)); innerhalb der
[Roche-Grenze](thema:gezeiten) hält sich daraus ohnehin kein Mond zusammen. Jedes Teilchen umläuft
Saturn auf seiner eigenen, differentiell von der seiner Nachbarn abweichenden Keplerbahn – dieselbe
Scherung, die auch die [Selbstgravitationswellen](thema:ringe) im dichten B- und A-Ring erzeugt, sähe
man aus der Nähe als beständiges, langsames Gegeneinanderrutschen der Teilchen, nicht als das ruhige
Band, das die Simulation zeigt.

## Modellgrenzen

- **Scheibe ohne Dicke und Teilchen:** Aus der Nähe löst sich der Ring nirgends in Brocken auf, keine
  Selbstgravitationswellen, keine Stöße; die Textur löst radial nur 30,3 km je Bildpunkt auf, gröber
  als jede reale Dichtewelle.
- **Vorwärtsstreuung, Belichtung:** dieselben Werte wie bei
  [Saturn im Streiflicht](szene:saturn-streiflicht); ohne `lookAtId` belichtet die Kamera auf Saturn
  selbst (`exposureTargetId`).
- **Kamera ohne Schwerkraft:** gerade Linie statt gebundener oder hyperbolischer Bahn, Tempo 12 423 bis
  23 293 km/s (4,1 bis 7,8 % der Lichtgeschwindigkeit) – weit jenseits jeder realen Sonde.
- **Feste Ringebene ohne Präzession:** `poleVector` ist zeitlich konstant, wie bei den benachbarten
  Ringszenen.
- **Zeitraffer:** Er gleitet beim Szenenbeginn 2 s lang geometrisch auf 0,05 Tage/s; je nach
  vorangehender Szene ergibt das zwischen 1,4 (Vorgänger `mondfinsternis`, 0,0035 Tage/s) und
  11,0 simulierten Tagen (Vorgänger `systemblick`, 30 Tage/s) statt der nominellen 1,5 – entsprechend
  zwischen 3,2 und 24,8 Saturnumdrehungen. Kein Kollisions- oder Nahfeldmodell begrenzt die Kamera
  selbst. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
