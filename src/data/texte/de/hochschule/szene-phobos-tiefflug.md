# Szene: Tiefflug über Phobos

Die Kamera hängt sich an [Phobos](objekt:phobos), hält seinen Abstand über der gesamten Szene und
blickt dabei nicht auf ihn selbst, sondern auf [Mars](objekt:mars) — von den beiden `chase`-Szenen
des Katalogs die einzige mit einem Blickziel, das vom verfolgten Körper abweicht.

## Was das Bild zeigt

Der Bahntyp `chase` hängt die Kamera hinter den Körper, entgegen seinem Geschwindigkeitsvektor, und
hebt sie zusätzlich rein senkrecht um `radius · sin(Elevation)` an (`render/camera/cinema.ts`);
Bezugsgröße für den Abstand ist der dargestellte Phobosradius (`distanceBasis: 'bodyRadius'`,
`distanceInRadii: 4`), die Elevation streut zwischen 8° und 28°, der Abstandsfaktor zwischen 0,8
und 1,5 (`data/scenes.ts`). Anders als bei den übrigen `chase`-Szenen setzt `lookAtId` das
Blickziel auf Mars statt auf Phobos selbst: Die Kamera zeigt nicht den Mond, dem sie folgt, sondern
fliegt mit ihm mit.

Der Szenenkommentar behauptet, Phobos liege dabei praktisch immer außerhalb des Bildwinkels — das
lässt sich nachrechnen. Über einen vollen Phobos-Umlauf, die volle Streuung von Elevation und
Abstandsfaktor und alle drei Maßstabsstufen bleibt der Winkel zwischen der Blickrichtung zu Mars
und der Richtung zu Phobos zwischen $32{,}7^\circ$ und $147{,}0^\circ$ — durchweg über dem halben
senkrechten Sichtfeld von $25^\circ$ (`KAMERA_FOV_GRAD = 50`, `render/renderer.ts`). Phobos selbst
kommt also nie ins Bild, weil der Bahnrichtungsvektor, dem die Kamera folgt, nahezu quer zur
Blickrichtung auf Mars steht. In allen drei Voreinstellungen sind diese Winkel praktisch identisch
(Unterschiede erst in der zehnten Nachkommastelle), weil `scaledPositionAt` Phobos' Marsabstand
ebenso wie den Kameraversatz einheitlich mit `sizeScale` skaliert (`sim/scale.ts`) — das Bild sieht
in Realistisch, Schaubild und Kompakt also gleich aus.

Mars füllt dafür einen Großteil des Bildes: Sein Winkeldurchmesser liegt über denselben Bahnphasen
und Streuungen zwischen $41{,}8^\circ$ und $43{,}0^\circ$, an den Ausgangswerten der Szene (Elevation
8°, Faktor 1) bei $41{,}9^\circ$ — nahe den 42° des Gymnasialtexts. Von Phobos selbst aus gesehen
sind es zum selben Zeitpunkt ebenfalls $41{,}9^\circ$, weil der Kameraversatz von nur rund 44 km
neben 9375 km Bahnradius kaum ins Gewicht fällt; die Kamera steht damit rund 6087 km über der
Marsoberfläche (Marsradius 3389,5 km, [NSSDC-Faktenblatt](quelle:nssdc-mars)), wenig mehr als
Phobos' eigene rund 5986 km.

Die Szene rafft mit 0,05 Tagen je Sekunde 25 Sekunden lang, macht also 1,25 simulierte Tage: Phobos
umläuft Mars darin rund 3,9-mal (Umlaufzeit 7,65384 h), während sich Mars um 1,22 Umdrehungen
($438{,}6^\circ$) dreht (Rotationsperiode 24,6229 h). Wie bei jedem Szenenwechsel gleitet der
Zeitraffer dabei zunächst zwei Sekunden lang geometrisch auf seinen Sollwert (`RATE_BLEND_SEC`,
`app/cinema.ts`).

## Hintergrund

Phobos umläuft Mars mit 9375 km deutlich innerhalb der synchronen Bahn: Aus Mars' Modell-GM und
Rotationsperiode (siehe [Mars](objekt:mars)) folgt dafür ein Radius von rund 20 428 km;
[Deimos](objekt:deimos) kreist mit 23 457 km knapp jenseits davon und entfernt sich langsam, statt
zu fallen. Weil Phobos schneller umläuft, als Mars sich dreht, geht er von der Oberfläche aus im
Westen auf und im Osten unter, im Mittel alle rund 11,1 Stunden erneut. Seine
[Rotation ist gebunden](thema:gebundene-rotation); über die Gezeiten zieht Mars ihn zugleich
langsam nach innen, die Bahn sinkt um rund 3,8 cm je Jahr
([Brozović et al. 2025](literatur:brozovic-2025); Herleitung unter [Gezeiten](thema:gezeiten)) — in
20 bis 43 Millionen Jahren zerbricht oder stürzt [Phobos](objekt:phobos) deshalb ab.

Von der Marsoberfläche aus zieht Phobos regelmäßig vor der Sonne vorbei, ohne sie je ganz zu
bedecken: Er misst nur $0{,}106^\circ$ im Winkelradius gegen $0{,}175^\circ$ der Sonne und verdeckt
gut ein Drittel ihrer Fläche, für 20 bis 35 Sekunden ([Finsternisse](thema:finsternis)). Nachts
empfängt seine marszugewandte Seite zusätzlich schwaches Marslicht, ähnlich dem Erdlicht auf dem
zunehmenden Mond. Die [Marsmonde](quelle:nasa-marsmonde) im Nahbereich zu vermessen war eine
Kernaufgabe der Sonde [Mars Express](quelle:esa-mars-express), deren Vorbeiflüge Masse und Form von
Phobos festlegten.

## Modellgrenzen

- **Kugelform:** 11,1 km Radius statt der Halbachsen 13,0 / 11,4 / 9,1 km (+17,1 %, +2,7 %,
  −18,0 %), wie bei [Phobos](objekt:phobos) beschrieben; Stickney und die Rillen fehlen.
- **Bahn:** feste Kepler-Ellipse im Bezug `parentEquator` (Marsäquator, siehe [Mars](objekt:mars)),
  ohne den oben beschriebenen Bahnverfall — Phobos bleibt bei 9375 km stehen.
- **Belichtung:** Die Kamera belichtet auf das Blickziel, hier Mars, weil die Szene
  `lookAtId: 'mars'` setzt (`exposureTargetId`, `render/exposure.ts`).
- **Kein Marsschein:** Das Beleuchtungsmodell (`render/lighting.ts`) rechnet für jeden Körper nur
  Sonnenlicht plus einen festen Nachtseitenanteil; Licht von Mars auf Phobos oder umgekehrt fließt
  nicht ein, anders als der oben genannte reale Effekt.
- **Schatten:** Anders als beim mondlosen Merkur zählt Mars für seine Monde immer als möglicher
  Verschatter (`waehleOkkluder`, `render/shadows.ts`); ob die reale Sonnengeometrie im jeweiligen
  Bild tatsächlich einen Kernschatten auf Phobos wirft, wird pro Bildpunkt berechnet und ist in
  dieser Szene nicht eigens abgestimmt.
- **Zeitraffer:** Beim Szenenbeginn gleitet er geometrisch über zwei Sekunden auf den Sollwert
  (siehe oben). Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
