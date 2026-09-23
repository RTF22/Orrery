# Szene: Ceres im Asteroidengürtel

Die Kamera umkreist [Ceres](objekt:ceres) in geringem Abstand: Bahntyp `orbit`, Zielkörper
`ceres`, Basisabstand 6 Ceres-Radien mit Streufaktor 0,8 bis 1,5, Elevation 5° bis 25° (Basis
15° ± 10°), Azimut über den vollen Kreis gezogen und mit 1°/s driftend, Dauer 30 s, Zeitraffer
0,02 Tage je Sekunde (`src/data/scenes.ts`). Anders als die fernen Rundflüge um Neptun oder das
Uranussystem ist dies ein reiner Nahflug um den größten Körper des Hauptgürtels zwischen
[Mars](objekt:mars) und [Jupiter](objekt:jupiter), umgeben von der synthetischen Punktwolke des
Gürtelmodells.

## Was das Bild zeigt

Der Kameraabstand skaliert mit `scaledRadius`, also mit demselben Faktor `sizeScale` wie Ceres
selbst: Bei „Realistisch" (sizeScale 1) sind es 2255/2818/4227 km, bei „Schaubild" (sizeScale
50, Standardeinstellung) 112 728/140 910/211 365 km, bei „Kompakt" (sizeScale 200)
450 912/563 640/845 460 km, jeweils für Streufaktor 0,8/1/1,5 (Herleitung). Weil Radius und
Abstand mit demselben Faktor wachsen, bleibt Ceres' Winkeldurchmesser
$2\arcsin(1/(6f))$ für jedes Preset gleich: $24{,}05^\circ$ bei $f=0{,}8$, $19{,}19^\circ$ bei
$f=1$ und $12{,}76^\circ$ bei $f=1{,}5$ (Herleitung) — deutlich innerhalb des vertikalen
Sichtfelds von $50^\circ$ (`KAMERA_FOV_GRAD`, `render/renderer.ts`).

In den 30 Sekunden vergehen bei 0,02 Tagen je Sekunde 0,6 simulierte Tage; bei der
Rotationsperiode $9{,}074170\,\mathrm{h}$ ($0{,}378090\,\mathrm{d}$) sind das rund $1{,}587$
Eigenumdrehungen (Herleitung) — eine ruhige, gut auflösbare Drehung ohne die stroboskopischen
Sprünge, die ein größerer Zeitraffer hier erzeugen würde. Die Kamera selbst driftet unabhängig
davon um $30^\circ$ ($1^\circ/\mathrm{s} \times 30\,\mathrm{s}$).

Weil der Basisazimut jeder Ziehung über den vollen Kreis gestreut wird, deckt der Winkel
zwischen Kamera- und Sonnenrichtung praktisch den ganzen möglichen Bereich ab: Am 22. September
2026 steht Ceres bei $2{,}680\,\mathrm{AU}$, die Richtung zur Sonne liegt bei Elevation
$-0{,}32^\circ$ (eigene Nachrechnung aus `positionAt`); zusammen mit der Elevation der Kamera
von $5^\circ$ bis $25^\circ$ ergibt eine Rastersuche über alle Azimutdifferenzen einen
Phasenwinkel zwischen $5{,}32^\circ$ (Kamera nahe der Sonnenrichtung, fast Vollphase) und
$175{,}32^\circ$ (Kamera fast in der Gegenrichtung, Ceres fast unbeleuchtet) — Beleuchtung und
Blickwinkel unterscheiden sich also von Ziehung zu Ziehung deutlich.

Ob Gürtelteilchen im Bild erscheinen, hängt stark von der gezogenen Richtung ab: Weil Ceres
selbst inmitten der dünnen Gürtelscheibe steht, erfasst ein Sichtkegel von $25^\circ$
Halböffnungswinkel (die Hälfte des vertikalen Sichtfelds) je nach Azimut und Elevation der
Ziehung zwischen rund 130 und rund 14 000 der 50 000 Teilchen der Qualitätsstufe „hoch" (eigene
Nachrechnung an `sim/belts.ts` und `render/belts.ts`, Stichprobe über acht Azimute und drei
Elevationen); Blickrichtungen nahe der Gürtelebene (Elevation $5^\circ$) erfassen deutlich mehr
als solche nahe der Streuungsgrenze ($25^\circ$). Fast alle erfassten Teilchen liegen dabei
nicht in Ceres' unmittelbarer Nähe, sondern über nahezu die gesamte Breite des Hauptgürtels
verteilt (in einer Stichprobe von $a = 2{,}107$ bis $3{,}299\,\mathrm{AU}$) — der
Kamera-Ceres-Abstand von wenigen Tausend Kilometern ist gegen die Ausdehnung des Gürtels
vernachlässigbar, sodass sichtbare Teilchen ein verstreutes Staubfeld im Hintergrund bilden,
keine dichte Nachbarschaft um Ceres. Die Kirkwood-Lücken 3:1 und 5:2, zwischen denen Ceres
liegt, bleiben in diesem Nahblick unsichtbar: Weil die Exzentrizität der Population jedes
Teilchen über einen heliozentrischen Bereich verteilt, der breiter ist als die schmalen Lücken
selbst, verschwindet die zugrunde liegende Dichteabsenkung, sobald man nach dem tatsächlichen
Sonnenabstand statt nach der großen Halbachse sortiert ([Kirkwood-Lücken](thema:kirkwood-luecken));
die eigene Stichprobe oben bestätigt das zusätzlich, weil die im Sichtkegel erfassten Teilchen
nahezu den gesamten Halbachsenbereich des Gürtels abdecken, statt sich auf einen schmalen,
einer Lücke entsprechenden Streifen zu beschränken.

Ohne `lookAtId` belichtet die Kamera auf Ceres selbst (`blickzielVon`, `render/camera/cinema.ts`;
`render/exposure.ts`): Am 22. September 2026 erhält Ceres bei $2{,}680\,\mathrm{AU}$ nur rund
$13{,}9$ Prozent, also $1/7{,}2$ der Erdbestrahlung (Herleitung); das Modell gleicht das
vollständig aus, sodass Ceres unabhängig vom Sonnenabstand stets im Referenzniveau erscheint
(Belichtungsfaktor rund $4{,}48$ im Standardpreset „Schaubild", rund $5{,}68$ bei „Realistisch",
je nach dargestelltem Abstand; eigene Nachrechnung mit `targetExposure`). Schon ohne diese
Zielbelichtung erreicht Ceres unter den Standardeinstellungen zur Epoche J2000 ein Tagniveau von
$0{,}571$ (eigene Nachrechnung, deckungsgleich mit der Regressionsschranke in
`render/lighting.test.ts`) — deutlich über der Schwelle, unter der ein Körper im Bild dunkel
bliebe.

## Hintergrund

Ceres ist der massereichste Körper des Hauptgürtels und trägt rund 39 Prozent seiner
Gesamtmasse ([Ceres](objekt:ceres)); ihre Bahn liegt zwischen den Kirkwood-Lücken 3:1 (bei
$2{,}50\,\mathrm{AU}$) und 5:2 (bei $2{,}82\,\mathrm{AU}$), näher an der äußeren
([Kirkwood-Lücken](thema:kirkwood-luecken)). Anders als die dicht gedrängten Asteroidenfelder
mancher Filme ist der reale Hauptgürtel fast leer: Im Mittel liegen rund $965600\,\mathrm{km}$
zwischen benachbarten Asteroiden, bei geschätzten 700 000 bis 1,7 Millionen Körpern über 1 km
Durchmesser im ganzen Gürtel; Sonden durchqueren ihn seit den Pioneer- und Voyager-Sonden ohne
gezieltes Ausweichen, mit einer geschätzten Kollisionswahrscheinlichkeit von weniger als eins zu
einer Milliarde ([Asteroidengürtel](quelle:wikipedia-en-asteroid-belt)). Die einzige
Nahbeobachtung eines Hauptgürtelkörpers bleibt die NASA-Sonde Dawn, die Ceres von März 2015 bis
zum Treibstoffende im Oktober 2018 umkreiste ([Russell et al. 2016](literatur:russell-2016)).

## Modellgrenzen

Ceres steht im Modell als Kugel ohne ihre reale, aus der Formfigur hergeleitete polare
Abplattung von rund 7,5 Prozent; die Textur ist laut `ASSETS.md` eine „fictional"-Karte, keine
Wiedergabe der realen Dawn-Kartierung (beides [Ceres](objekt:ceres)). Der Gürtel selbst ist eine
synthetische Punktwolke mit festen Bahnelementen — nur die mittlere Anomalie läuft —, mit
eingebauten statt dynamisch entstandenen Kirkwood-Lücken, einheitlicher Albedo 0,06 für alle
Teilchen und einer festen Punktgröße von rund einem Bildschirmpixel, nahe der Kamera bis auf das
Vierfache vergrößert; die Ausdehnung realer Asteroiden, Kollisionen zwischen Teilchen und jede
Bahnresonanzdynamik fehlen vollständig. Ceres selbst trägt keine Exosphäre im Modell. Die
Distanzkompression der Darstellung ändert die absoluten Kilometerwerte des Kameraabstands
zwischen den Presets, aber weder Ceres' Winkeldurchmesser noch die Zahl der im Sichtkegel
erfassten Gürtelteilchen merklich (eigene Nachrechnung: Streuungsfaktor $k=1$ gegen $k=0{,}6$
ergab vergleichbare Teilchenzahlen in derselben Blickrichtung). Weitere Vereinfachungen:
[Grenzen des Modells](thema:modell).

*Stand: September 2026*
