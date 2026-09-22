# Szene: Tritons rückläufige Bahn

Die Kamera kreist in großem Abstand um [Neptun](objekt:neptune) und zeigt die volle Bahn seines
größten Monds [Triton](objekt:triton) als Ellipse – schräg genug, um die stark geneigte,
rückläufige Bahn als solche erkennbar zu machen, statt sie auf eine Linie zusammenfallen zu lassen.

## Was das Bild zeigt

Der Bahntyp `orbit` (`render/camera/cinema.ts`) hält die Kamera auf einer Kugel um Neptun, ohne
`lookAtId` – die Kamera blickt also auf Neptun selbst, nicht auf Triton. Radius: 45 dargestellte
Neptunradien ($R_\mathrm{N}=24\,622\,\mathrm{km}$) mal Streufaktor; bei 0,8/1,0/1,5 sind das
36/45/67,5 Neptunradien, also 886 392/1 107 990/1 661 985 km. Azimut liegt fest bei 123,92° und
läuft mit 1°/s weiter (35 s Dauer, macht 35° Drift bis zum Szenenende), je Ziehung additiv um
±20° verstellt; Elevation ist additiv fest zwischen 30° und 60° (Basis 45° ± 15°).

Tritons Bahnradius im Modell beträgt 354 766 km (Bahnelement `a`, Epoche J2000), also 14,41
Neptunradien. Bei Streufaktor 0,8, der engsten Ziehung, misst die Halbbildbreite am
Neptun-Abstand, $d\tan(25^\circ)$ mit dem halben, vertikalen Sichtfeld aus `KAMERA_FOV_GRAD` 50°,
rund 413 331 km – eine Marge von 16,5 % über Tritons Bahnradius; bei Streufaktor 1,5 wächst sie
auf 118,5 %. Die volle Bahn passt damit in jeder Ziehung ins Bild.

In den 35 s bei 0,4 Tagen je Sekunde vergehen 14 simulierte Tage; Tritons Umlauf dauert im Modell
5,877 Tage (aus der mittleren Bewegung; das dritte Keplersche Gesetz mit den Massen von Neptun und
Triton trifft denselben Wert auf 0,02 % genau) – die Szene zeigt also rund 2,4 volle Umläufe.

Dass die kreisnahe Bahn ($e\approx0{,}00015$) als Ellipse erscheint, statt als Kreis oder als Linie,
ist reine Projektionsgeometrie: Das Achsenverhältnis der scheinbaren Ellipse ist der Betrag des
Kosinus zwischen Blickrichtung und der Flächennormalen von Tritons Bahnebene – 0 bei Blick in der
Bahnebene (Linie), 1 bei Blick senkrecht dazu (Kreis). Aus Tritons Bahnelementen, in die Ekliptik
gedreht, ergibt eine eigene Rechnung für Elevation 30–60° und den gezogenen Azimutbereich ein
Achsenverhältnis zwischen rund 0,05 und 0,35 – nie eine entartete Linie, nie ein Kreis.

Die Rückläufigkeit selbst zeigt sich im Umlaufsinn: Die Kamera dreht mit positivem Azimut, also im
selben Sinn wie Neptuns eigene Drehung und wie alle Planetenbahnen (gegen den Uhrzeigersinn von
Norden gesehen). Tritons Bahnneigung von 156,83° gegen Neptuns Äquator – über 90°, per Definition
retrograd – lässt ihn im Bild dagegen rückwärts laufen, entgegen Neptuns Drehsinn und entgegen dem
langsamen Kameraumlauf.

Die Beleuchtungsrichtung ist nicht zufällig gewählt: Aus Neptuns heliozentrischer Position zur
Epoche J2000 (eigene Rechnung mit `positionAt`: $x=2\,513\,956\,734$, $y=-3\,738\,856\,178$,
$z=19\,059\,249\,\mathrm{km}$) folgt für die Richtung Neptun–Sonne Azimut 123,92° und Elevation
−0,24° – exakt der feste Basisazimut der Szene. Tritons Abstand von Neptun (354 766 km) gegen den
Neptun-Sonne-Abstand (30,12 AE) ergibt eine Parallaxe von
$\arctan(354\,766/4\,505\,484\,129)\approx0{,}0045^\circ$: Dieselbe Sonnenrichtung gilt also auch
für Triton, und der enge Streubereich ±20° hält die beleuchtete Seite im Bild.

Ohne `lookAtId` belichtet die Kamera auf Neptun selbst (`exposureTargetId`); Triton, bei fast
demselben Sonnenabstand, erscheint dadurch ähnlich hell. Als Satellit (`isSatellite`) skaliert
Tritons Bahn im Bild mit `sizeScale`, nicht mit der Abstandskompression der Planetenbahnen
([Grenzen des Modells](thema:modell)).

## Hintergrund

Eine derart hohe, rückläufige Bahnneigung ist für einen Mond, der mit seinem Planeten aus
derselben Scheibe entstanden wäre, ausgeschlossen – reguläre Monde übernehmen den Drehsinn ihres
Planeten. [Triton](objekt:triton) muss deshalb eingefangen worden sein, vermutlich als
Überlebender eines aufgebrochenen Doppelkörpers aus dem Kuipergürtel; Einzelheiten, Zeitskala und
Zahlen dazu nennt dieser Text. Die Rückläufigkeit hat eine ungewöhnliche Folge: Gezeiten entziehen
einem retrograden Mond Bahnenergie, statt sie ihm zuzuführen – Triton nähert sich Neptun deshalb
langsam an, statt sich wie die meisten Monde zu entfernen ([Gezeiten](thema:gezeiten)).

Die vier Riesenplaneten tragen zusammen rund hundert bekannte unregelmäßige Monde: aus
ursprünglich heliozentrischen Bahnen eingefangen, mit großen, oft stark geneigten oder
rückläufigen Bahnen, anders als die nahezu kreisförmigen, wenig geneigten Bahnen der aus der
Akkretionsscheibe entstandenen regulären Monde ([Jewitt und Haghighipour 2007](literatur:jewitt-2007)).
Dieselbe Arbeit ordnet Triton wegen seiner rückläufigen Bahn ausdrücklich den unregelmäßigen
Monden zu, hebt aber ebenso ausdrücklich hervor, dass seine große Größe und sein kleiner
Bahnradius ihn von allen übrigen unterscheiden – ein Einzelfall, der den ungewöhnlichen,
kräftigeren Einfangmechanismus erklärt, den Triton selbst beschreibt. Aus der Nähe hat nur
[Voyager 2](quelle:nasa-voyager-2) das Neptunsystem gesehen, am 25. August 1989
([Stone und Miner 1989](literatur:stone-1989)); alles Spätere stammt von der Erde, von Hubble oder
vom JWST.

## Modellgrenzen

- **Bahn fest ohne Knotenpräzession:** `nodeDot` und `lpDot` stehen für Triton auf 0; real
  präzediert die Bahnebene um Neptuns Laplace-Pol, wie [Bahnelemente](thema:bahnelemente)
  beschreibt.
- **Fester Pol** ohne die großen periodischen Zusatzglieder des IAU-Berichts, wie
  [Achsneigung](thema:achsneigung) für Neptun und Triton beschreibt.
- **Kugel ohne Abplattung.**
- **Keine Neptunringe und keine der übrigen Neptunmonde** (Nereid, Proteus und weitere) im
  Katalog.
- **Belichtung auf Neptun** (`render/exposure.ts`): Neptun erscheint mit dem Referenz-Tagniveau,
  real erhält er nur rund 1/907 der Bestrahlung der Erde (eigene Rechnung zur Epoche J2000; für
  den 17. September 2026 nennt [Albedo und Helligkeit](thema:photometrie) 1/883) – derselbe
  Ausgleich wie bei jedem Kameraziel.
- **Maßstab:** Weitere Vereinfachungen in [Grenzen des Modells](thema:modell).

*Stand: September 2026*
