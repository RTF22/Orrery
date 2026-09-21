# Szene: Das galileische Schattenspiel

Die Kamera kreist in steiler Aufsicht um [Jupiter](objekt:jupiter) und zeigt bei starkem
Zeitraffer die Bahnen der vier Monde, die Galileo Galilei im Januar 1610 zuerst beobachtete:
[Io](objekt:io), [Europa](objekt:europa), [Ganymed](objekt:ganymede) und
[Kallisto](objekt:callisto). Drei von ihnen – Io, Europa und Ganymed – stehen in der
Laplace-Resonanz und durchlaufen dabei ein wiederkehrendes Bewegungsmuster im Verhältnis 4:2:1;
Kallisto läuft außerhalb dieser Kette mit.

## Was das Bild zeigt

Der Bahntyp `orbit` hält die Kamera auf einer Kugel um Jupiters Mittelpunkt
(`render/camera/cinema.ts`): Radius 55 dargestellte Jupiterradien (69 911 km) mal Streufaktor,
Azimut wandert mit 1°/s um 45° weiter, die Elevation bleibt je Ziehung fest zwischen 45° und 65°;
ein `lookAtId` fehlt, die Kamera blickt also stets auf Jupiter selbst. Beim Streufaktor
0,8/1,0/1,5 liegt sie 3 076 084/3 845 105/5 767 658 km entfernt; Jupiters Winkeldurchmesser
$2\arcsin(R_\mathrm{J}/d)$ schrumpft dabei von 2,6° auf 1,4° – gegen das Sichtfeld von 50° bleibt
Jupiter selbst winzig. Anders als beim
[Vorbeiflug an Jupiter](szene:jupiter-vorbeiflug), der nah heranzieht, zeigt diese Szene das
System aus der Distanz.

Auf ihr liegen die vier Mondbahnen: Ios große Halbachse von 421 800 km entspricht 6,0
dargestellten Jupiterradien, Europas 671 100 km 9,6, Ganymeds 1 070 400 km 15,3 und Kallistos
1 882 700 km 26,9 (NSSDC-Faktenblatt, [Jupitermonde](quelle:nssdc-jupitermonde)); da
`scaledPositionAt` Mondversatz und Planetenradius gleich mit `sizeScale` skaliert, gilt dieses
Verhältnis bei jeder Maßstabsstufe unverändert. Verglichen mit der Halbbildbreite (25°) bleiben
Ios, Europas und Ganymeds Bahnen über die ganze Streuung sicher im Bild – selbst bei Faktor 0,8
bleibt der größte Winkelabstand von der Bildmitte (Ganymed) unter 21°. Kallistos Bahn dagegen
reicht schon beim Grundwert (Faktor 1: 29,5° statt 25°) über den Bildrand hinaus und passt erst
ab Faktor rund 1,17 vollständig hinein; bei gleichverteiltem Streufaktor betrifft das gut die
Hälfte aller Ziehungen.

Bei 0,5 simulierten Tagen je Sekunde vergehen in 45 Sekunden nominell 22,5 Tage; nach der
zweisekündigen Zeitraffer-Einblendung (`RATE_BLEND_SEC`) reicht die Spanne je nach Vorgängerszene
von 21,7 (nach `mondfinsternis`, 0,0035 Tage/s) bis 36,2 Tagen (nach `systemblick`, 30 Tage/s).
Nominell umläuft Io Jupiter in dieser Zeit 12,7-mal (Umlaufzeit 1,769138 d), Europa 6,3-mal
(3,551181 d), Ganymed 3,1-mal (7,154553 d) und Kallisto 1,3-mal (16,689017 d) – Io, Europa und
Ganymed also im nahen Verhältnis 4:2:1; Jupiter selbst dreht sich dabei 54,4-mal um seine eigene
Achse (`rotationPeriodH` 9,9250 h).

Die Konjunktionen von Io und Europa – von Jupiter aus in derselben Richtung – wiederholen sich
durch die Resonanz nahe derselben Stelle relativ zu Ios Perijovum (Formel und
Herleitung: [Bahnresonanzen](thema:resonanzen)); bei einer synodischen Periode von 3,53 Tagen
fallen rund 6,4 solcher Begegnungen in die Szene, sichtbar als wiederkehrender Überholrhythmus
stets nahe derselben Himmelsrichtung (zur Drift dieser Richtung im Modell: Modellgrenzen).

Ob überhaupt ein Mondschatten auf Jupiter fällt, hängt von der Sonnenhöhe über seiner
Äquatorebene ab: $\arcsin(R_\mathrm{J}/a)$ ergibt 9,5° für Io, 6,0° für Europa, 3,7° für Ganymed
und 2,1° für Kallisto (Herleitung, gleiche Formel wie bei den [Finsternissen](thema:finsternis));
bei 3,1° Achsneigung werfen Io, Europa und Ganymed deshalb immer einen Schatten, Kallisto nur
zeitweise – über die kurze Szenendauer praktisch unveränderlich, ein Durchlauf zeigt also immer
oder nie einen Kallisto-Schatten. Weil das Modell auch die Monde gegenseitig
als Schattenwerfer führt (siehe Modellgrenzen), können zusätzlich echte gegenseitige
Mondverfinsterungen erscheinen (Hintergrund) – aus dieser Entfernung aber höchstens einen
Bildpunkt groß, auf Jupiters nur 1,4° bis 2,6° großer Scheibe.

## Hintergrund

Galileo Galilei beobachtete die vier hellen Punkte neben Jupiter erstmals am 7. Januar 1610 und
erkannte binnen weniger Nächte, dass sie ihn umkreisen – ein Gegenbeweis zum geozentrischen
Weltbild. Der deutsche Astronom Simon Marius beobachtete unabhängig zur gleichen Zeit,
veröffentlichte aber später; seine 1614 von Johannes Kepler angeregten Namen setzten sich
trotzdem durch ([Jupitermonde bei NASA Science](quelle:nasa-jupitermonde)). Galilei schlug
außerdem vor, die Verfinsterungen als himmlische Uhr zur Längengradbestimmung zu nutzen; daraus
entstanden am Pariser Observatorium die Beobachtungsreihen, in denen Ole Rømer 1676 erkannte,
dass unregelmäßig verspätete Io-Verfinsterungen von der endlichen Lichtgeschwindigkeit herrühren
([Bobis und Lequeux 2008](literatur:bobis-2008); Schattengeometrie und Lichtlaufzeit:
[Finsternisse](thema:finsternis)).

Io, Europa und Ganymed erfüllen dabei im zeitlichen Mittel die Laplace-Beziehung
$\varphi_\mathrm{L} = \lambda_1 - 3\lambda_2 + 2\lambda_3 \approx 180^\circ$ mit den mittleren
Längen λ; sie hält die drei Bahnen in stabiler Kopplung, verhindert eine gleichzeitige
Konjunktion aller drei Monde und erzwingt die kleine, für Ios Gezeitenheizung entscheidende
Bahnexzentrizität (Herleitung und Zweikörperwinkel: [Bahnresonanzen](thema:resonanzen)).

Weil ihre Bahnen fast in einer Ebene liegen, bedecken und verfinstern sich die vier Monde nahe
den Jupiter-Tagundnachtgleichen auch gegenseitig. Solche gegenseitigen Ereignisse (PHEMU) liefern
aus bloßer Lichtkurven-Photometrie Relativpositionen im Millibogensekundenbereich, die in die
Ephemeriden der Monde einfließen; eine erste große Kampagne fand 2009 statt
([Arlot et al. 2014](literatur:arlot-2014)), weitere folgten 2014/15 und 2021. Die Sonde Juice
soll im Juli 2031 in eine Jupiterumlaufbahn einschwenken; sie ist auf die drei Eismonde Ganymed,
Kallisto und Europa ausgelegt ([Juice bei ESA](quelle:esa-juice)) – Io gehört nicht dazu.

## Modellgrenzen

- **Kepler-Bahnen ohne Störungen:** Wie jeder Körper im Katalog bewegen sich die vier Monde auf
  Ellipsen mit linear fortgeschriebenen Elementen aus der JPL-Tafel für das Jupitersystem
  ([Bahnelemente](thema:bahnelemente)); Libration, Resonanzeinfang und die reale, langsame
  Auswanderung aus der exakten Resonanz fehlen.
- **Laplace-Winkel und Perijoven:** $\varphi_\mathrm{L}$ steht zur Epoche J2000 exakt bei 180,0°
  und driftet um −1,05°/Jh – über die 22,5 Tage der Szene weniger als 0,001° und damit
  unmerklich. Die Perijoven von Io und Europa laufen im Datensatz dagegen mit 1,33
  beziehungsweise 1,46 Jahren Periode vorwärts statt, wie die Theorie verlangt, ebenso schnell
  rückwärts (Zahlen wie [Bahnresonanzen](thema:resonanzen)) – in den 22,5 Tagen der Szene ein
  Vorlauf von rund 17° beziehungsweise 15°, in die falsche Richtung.
- **Schatten:** `waehleOkkluder` (`render/shadows.ts`) setzt für jeden Mond neben Jupiter auch
  dessen drei Geschwister als Schattenwerfer an; bei `MAX_OKKLUDER` 4 reicht das ohne Kürzung –
  anders als bei Saturns sieben großen Monden –, echte gegenseitige Mondverfinsterungen sind also
  im Modell angelegt. Die Rechnung ist stufenlos (echter Halbschatten aus den vollen
  Winkelgrößen von Sonne und Okkluder) und farbneutral, da keiner der fünf Körper eine eigene
  Kernschattenfarbe trägt.
- **Belichtung:** Ohne `lookAtId` belichtet die Kamera auf Jupiter selbst (`exposureTargetId`,
  `render/exposure.ts`) – wie beim Vorbeiflug an Jupiter.
- **Zeitraffer:** Er gleitet beim Szenenbeginn 2 s lang geometrisch auf 0,5 Tage/s
  (`RATE_BLEND_SEC`); je nach Vorgängerszene ergibt das zwischen 21,7 und 36,2 simulierten Tagen
  statt der nominellen 22,5 – entsprechend zwischen 52,5 und 87,4 Jupiterumdrehungen. Weitere
  Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
