# Szene: Mondfinsternis

Der Schatten der [Erde](objekt:earth) zieht über den vollen [Mond](objekt:moon); siehe auch
[Finsternisse](thema:finsternis).

## Was das Bild zeigt

Zu Beginn springt Orrery zur nächsten Kernschattenfinsternis nach der eingestellten Zeit;
Halbschattenfinsternisse übergeht die Suche. Die Uhr steht dann ein Zehntel der Dauer vom ersten
zum letzten Kernschattenkontakt (U1 bis U4) vor U1. Der Sollwert des Zeitraffers, 0,0035 Tage je
Sekunde, ergäbe in den 45 s 3,78 h (siehe Zeitraffer unten).

Die Kamera steht vier Mondradien vor dem Mondmittelpunkt in Richtung Erde, um 8° in ekliptikaler
Breite versetzt und mit 0,4° je Sekunde in Länge wandernd, und blickt auf die beleuchtete
Vollmondseite. Je Abspielen streuen Abstand (Faktor 0,8 bis 1,3), Breite (±6°) und Länge (±20°).
Ohne Streuung erscheint der Mond unter $2 \arcsin(1/4) = 29{,}0^\circ$ bei 50° senkrechtem
Bildwinkel. Die Erde misst von der Kamera aus 1,8° bis 2,1° und steht nach dem Einschwenken mehr
als 138° von der Blickrichtung entfernt, außerhalb des Bildes.

## Hintergrund

Für eine kugelförmige Erde ohne Atmosphäre haben Kern- und Halbschatten im Mondabstand $d$ bei
Sonnenabstand $D$ näherungsweise die Radien

$$r_\mathrm{u} = R_\oplus - d\,\frac{R_\odot - R_\oplus}{D}, \quad r_\mathrm{p} = R_\oplus + d\,\frac{R_\odot + R_\oplus}{D}$$

mit der mittleren Mondbahn des Modells und 1 AE also 4599 km und 8175 km; der Kernschatten ist
2,65-mal so breit wie der Mond.

Beobachtet ist er größer. Chauvenet vergrößerte die Winkelradien beider Schatten um 1/50, Danjon
setzte eine undurchsichtige Schicht von 75 km auf den Erdradius (rund 1/85). Der NASA-Kanon folgt
Danjon, führt aber Kraterzeiten von 1972 bis 1982 an, die etwa 2 % stützen
([Espenak und Meeus 2009](literatur:espenak-2009)). Eine Schicht der Höhe $h$ vergrößert
$r_\mathrm{u}$ um $h\,(1 + d/D) \approx h$. Über 20 000 Kraterzeiten von 94 Finsternissen der
Jahre 1842 bis 2011 ergeben im Mittel 86,9 km Schichthöhe (Unsicherheit des Mittelwerts 0,2 km)
ohne Gang mit dem Mondabstand, die prozentuale Vergrößerung (Mittel 1,88 %) hängt dagegen etwas
von ihm ab. Herald und Sinnott empfehlen für Kontaktzeiten einen Ansatz nach Danjon mit 87 km
Schichthöhe über der abgeplatteten Erde; der Astronomical Almanac rechnete 2014 noch mit 1,02
([Herald und Sinnott 2014](literatur:herald-2014)).

Die Atmosphäre bricht Licht in den Kernschatten; tiefere, dichtere Schichten schwächen es stärker
und lenken es weiter nach innen, weshalb die Helligkeit meist zum Rand hin zunimmt
([Espenak und Meeus 2009](literatur:espenak-2009)). Rayleigh-Streuung schwächt kurze
Wellenlängen stärker: Bei wenig gestörter Stratosphäre erscheint der Mond meist kupfer- bis
tiefrot, bei trüber dunkler ([Guillet et al. 2023](literatur:guillet-2023)). Die [Danjon-Skala](thema:photometrie) für
totale Finsternisse reicht von L = 0, Mond fast unsichtbar, bis L = 4, sehr hell kupferrot oder
orange ([Espenak und Meeus 2009](literatur:espenak-2009)). Unter 46 von Guillet et al.
herangezogenen Finsternissen trat L = 0 nur bei einer optischen Dicke des stratosphärischen
Aerosols über etwa 0,1 auf ([Guillet et al. 2023](literatur:guillet-2023)).

## Modellgrenzen

- **Schatten:** Jeder Oberflächenpunkt erhält direktes Licht nach dem sichtbaren Teil der
  gleichmäßig hellen Sonnenscheibe hinter der Erdkugel, ohne Abplattung, Atmosphäre und
  Vergrößerung. Diese Verschattung wirkt nur bei eingeschaltetem Schalter „Schatten" und
  eingeblendeter Erde. Nur die Suche vergrößert den Kernschatten um 2 %.
- **Farbe:** Im Kernschatten bleibt nur das Fülllicht der Nachtseite (Standard: ein Viertel des
  Tagniveaus), getönt mit dem festen Farbwert #ff9a5c, im Halbschatten anteilig zum verdeckten
  Teil der Sonnenscheibe. Die lineare Leuchtdichte der Scheibenmitte sinkt so je nach
  Einfallswinkel um 2,4 bis 2,6 Größenklassen, unabhängig von Finsternistiefe und Mondabstand.
  Am 30. Dezember 1963 erreichte der total verfinsterte Mond nur +4,1 mag
  ([Herald und Sinnott 2014](literatur:herald-2014)), knapp 17 Größenklassen unter dem
  [mittleren Vollmond](quelle:nssdc-moon).
- **Zeitpunkt:** Die Mondbahn ist eine Kepler-Ellipse ohne periodische Störungen. Knoten- und
  Perigäumsrate nach Meeus sind um die [Präzession](thema:bezugssysteme) von 1,4° je Jahrhundert
  vermindert und zählen so wie mittlere Länge und Erdbahn gegen die feste Ekliptik J2000. Gegen den
  [NASA-Katalog](quelle:nasa-eclipse) findet das Modell 1951 bis 2050 135 der 143
  Kernschattenfinsternisse, das Maximum bis 3,0 h daneben (quadratisches Mittel 1,8 h); acht kleine
  partielle fehlen, und bei drei totalen meldet die Suche eine partielle. Keine
  Halbschattenfinsternis gilt als Kernschattenfinsternis.
- **Zeitraffer:** Nach dem Sprung gleitet er vom bisherigen Wert auf den Sollwert; nach 0,9 Tagen
  je Sekunde vergehen so in der ersten Sekunde rund 2 h (60 Bilder/s), und die Finsternis läuft
  ganz oder teilweise ungesehen ab.

*Stand: September 2026*
