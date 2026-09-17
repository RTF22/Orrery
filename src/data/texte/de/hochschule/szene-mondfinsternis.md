# Szene: Mondfinsternis

Die Szene zeigt, wie der Schatten der [Erde](objekt:earth) über den vollen [Mond](objekt:moon)
zieht; zur Einordnung siehe [Finsternisse](thema:finsternis).

## Was das Bild zeigt

Zu Beginn sucht Orrery ab der eingestellten Zeit den nächsten Vollmond, bei dem der Mond den
Kernschatten berührt; Halbschattenfinsternisse überspringt die Suche. Die Uhr springt um ein
Zehntel der Dauer vom ersten zum letzten Kernschattenkontakt (U1 bis U4) vor U1 und läuft mit
0,0035 Tagen je Sekunde, sodass die 45 s der Szene 3,78 h umfassen. Dauert U1 bis U4 länger als
206 min, liegt U4 nach dem Ende der Szene; das trifft 65 der 137 Finsternisse, die das Modell von
1951 bis 2050 findet.

Die Kamera steht vier Mondradien vor dem Mondmittelpunkt in Richtung Erde, um 8° in ekliptikaler
Breite versetzt und mit 0,4° je Sekunde in Länge wandernd, und blickt auf die beleuchtete
Vollmondseite. Je Abspielen streuen Abstand (Faktor 0,8 bis 1,3), Breite (±6°) und Länge (±20°).
Der Mond erscheint unter $2 \arcsin(1/4) = 29{,}0^\circ$ (22,2° bis 36,4°) bei 50° senkrechtem
Bildwinkel. Die Erde, von der Kamera aus unter 1,8° bis 2,1° zu sehen, steht mehr als 138° von
der Blickrichtung entfernt außerhalb des Bildes; die Sonne misst vom Mond aus 0,52° bis 0,54°. Weil
die Maßstabsstufen Körperradien und Mondabstände gleich vergrößern, gelten die Winkel für jede
Stufe.

## Hintergrund

Für eine kugelförmige Erde ohne Atmosphäre haben Kern- und Halbschatten im Mondabstand $d$ bei
Sonnenabstand $D$ näherungsweise die Radien

$$r_\mathrm{u} = R_\oplus - d\,\frac{R_\odot - R_\oplus}{D}, \quad r_\mathrm{p} = R_\oplus + d\,\frac{R_\odot + R_\oplus}{D}$$

für die mittlere Mondbahn des Modells und 1 AE also 4599 km und 8175 km; der Kernschatten ist
2,65 Monddurchmesser breit.

Beobachtet ist er größer. Chauvenet vergrößerte die Winkelradien beider Schatten um 1/50; Danjon
setzte eine undurchsichtige Schicht von 75 km auf den Erdradius (rund 1/85), und so rechnet auch
der NASA-Kanon ([Espenak und Meeus 2009](literatur:espenak-2009)). Eine Schicht der Höhe $h$
vergrößert $r_\mathrm{u}$ um $h\,(1 + d/D) \approx h$, bei jedem Mondabstand um fast dieselbe
Strecke. Aus mehr als 20 000 Kraterzeiten von 94 Finsternissen der Jahre 1842 bis 2011 folgt
eine wirksame Höhe von 86,9 ± 0,2 km ohne Gang mit dem Mondabstand, während die prozentuale
Vergrößerung (Mittel 1,88 %) etwas von ihm abhängt; auch bei der sehr dunklen Finsternis
vom 30. Dezember 1963 war die Höhe mit 87,1 ± 1,4 km gewöhnlich
([Herald und Sinnott 2014](literatur:herald-2014)).

Licht erreicht den Kernschatten durch Brechung in der Atmosphäre. Tiefere, dichtere Schichten
lenken stärker ab und erhellen die inneren Teile, weshalb die Helligkeit meist zum Rand hin
zunimmt ([Espenak und Meeus 2009](literatur:espenak-2009)). Rayleigh-Streuung schwächt kurze
Wellenlängen stärker: Bei ungestörter Stratosphäre erscheint der Mond meist kupfer- bis tiefrot,
bei trüber dunkler ([Guillet et al. 2023](literatur:guillet-2023)). Die Danjon-Skala für totale
Finsternisse reicht von L = 0, Mond fast unsichtbar, bis L = 4, sehr hell kupferrot oder orange
([Espenak und Meeus 2009](literatur:espenak-2009)). Aus den Helligkeiten von 21 Finsternissen
1960 bis 1982 folgen global gemittelte optische Dicken des Aerosols, nach El Chichón 1982 ähnlich
wie nach Agung 1963 ([Keen 1983](literatur:keen-1983)). Unter 46 gut beobachteten Finsternissen
trat L = 0 nur bei einer optischen Dicke des stratosphärischen Aerosols über etwa 0,1 auf; darauf
stützen Guillet et al. unter anderem ihre Datierung von Ausbrüchen des Hochmittelalters
([Guillet et al. 2023](literatur:guillet-2023)).

## Modellgrenzen

- **Schatten:** Erde und Sonne sind Kugeln. Jeder Oberflächenpunkt erhält direktes Licht im
  Verhältnis des sichtbaren Teils der gleichmäßig hellen Sonnenscheibe; beide Schatten sind rein
  geometrisch, ohne Abplattung, Atmosphäre und Vergrößerung. Nur die Suche vergrößert den
  Kernschatten um 2 %; der Kontakt mit dem gezeichneten Kernschatten folgt deshalb im Median
  1,8 min nach U1.
- **Farbe:** Im Kernschatten bleibt nur das Fülllicht der Nachtseite (Standard: ein Viertel des
  Tagniveaus), getönt mit dem festen Farbwert #ff9a5c, im Halbschatten anteilig zum verdeckten
  Teil der Sonnenscheibe. Die lineare Leuchtdichte der Scheibenmitte sinkt so um rund 2,6
  Größenklassen, bei jeder Finsternis gleich. 1963 erreichte der Mond nur +4,1 mag
  ([Herald und Sinnott 2014](literatur:herald-2014)), knapp 17 Größenklassen unter dem
  [mittleren Vollmond](quelle:nssdc-moon) von −12,74 mag.
- **Zeitpunkt:** Die Mondbahn ist eine Kepler-Ellipse mit linear fortgeschriebenen Winkeln ohne
  periodische Störungen. Gegen den Katalog der [NASA](quelle:nasa-eclipse) findet das Modell von
  1951 bis 2050 135 der 143 Kernschattenfinsternisse, das Maximum bis 3,0 h daneben
  (quadratisches Mittel 1,8 h); acht partielle mit Kernschattengröße bis 0,10 fehlen, zwei
  Halbschattenfinsternisse werden partiell, bei elf weicht die Art ab. Von September 2026 aus
  übergeht die Suche die Finsternis vom 12. Januar 2028 und zeigt die vom 6. Juli 2028, Maximum
  16:16 statt 18:21 Uhr dynamischer Zeit. Dass die Uhr UTC als TDB zählt, macht nur 69 s aus.
- **Zeitraffer:** Nach dem Sprung gleitet er vom bisherigen Wert auf 0,0035 Tage je
  Sekunde; nach 0,9 Tagen je Sekunde vergehen dabei in der ersten Sekunde 2,1 h (60 Bilder je
  Sekunde), und die Finsternis läuft ganz oder teilweise ungesehen ab.

*Stand: September 2026*
