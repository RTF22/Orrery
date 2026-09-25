# Assets

Diese Datei dokumentiert die Herkunft aller im Repository abgelegten und
ausgelieferten Dateien fremder Urheber (Texturen, Sternkatalog, Basis-Transcoder)
und erfüllt damit die Namensnennungspflicht der CC-BY-Lizenz. Ein Test
(`scripts/assets.test.ts`) prüft, dass jeder Texturordner unter `public/textures/`
hier genannt ist.

## Textur-Quelle: Solar System Scope

Alle zehn Albedo-Texturen stammen von Solar System Scope
(<https://www.solarsystemscope.com/textures/>), Auflösung 2k (2048×1024 Pixel,
äquirektangulär). Urheber: Solar System Scope. Lizenz: Creative Commons
Attribution 4.0 International (CC BY 4.0, <https://creativecommons.org/licenses/by/4.0/>).
Laut Angabe der Quelle basieren die Texturen auf NASA-Höhen- und Bilddaten,
farblich abgestimmt auf Aufnahmen der Sonden Messenger, Viking und Cassini
sowie des Hubble-Weltraumteleskops.

Bearbeitung: keine — die Dateien wurden unverändert in der von der Quelle
gelieferten Auflösung (2048×1024, JPEG) übernommen und nur umbenannt/abgelegt.
Seit Etappe 5-3 (Texturen als KTX2-Stufen) sind diese JPEGs versionierte
Quellen unter `assets-quellen/texturen/<koerper>/albedo.jpg` und werden nicht
mehr ausgeliefert; die ausgelieferten Dateien sind die daraus erzeugten
KTX2-Stufen unter `public/textures/<koerper>/albedo-<breite>.ktx2`, siehe
Abschnitt „Texturstufen (KTX2)" unten.

| Datei | Quelle (URL) | Urheber | Lizenz | Maße | Größe | Bearbeitung |
|---|---|---|---|---|---|---|
| `assets-quellen/texturen/sun/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_sun.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 822 427 Bytes | unverändert übernommen, nur umbenannt |
| `assets-quellen/texturen/mercury/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_mercury.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 872 555 Bytes | unverändert übernommen, nur umbenannt |
| `assets-quellen/texturen/venus/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 885 075 Bytes | unverändert übernommen, nur umbenannt (Oberflächenkarte, nicht die Wolkendecken-Variante) |
| `assets-quellen/texturen/earth/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 463 087 Bytes | unverändert übernommen, nur umbenannt (Tagseiten-Karte, ohne Wolkendecke) |
| `assets-quellen/texturen/mars/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_mars.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 750 547 Bytes | unverändert übernommen, nur umbenannt |
| `assets-quellen/texturen/jupiter/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 498 976 Bytes | unverändert übernommen, nur umbenannt |
| `assets-quellen/texturen/saturn/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_saturn.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 199 916 Bytes | unverändert übernommen, nur umbenannt (ohne Ringtextur) |
| `assets-quellen/texturen/uranus/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_uranus.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 77 751 Bytes | unverändert übernommen, nur umbenannt |
| `assets-quellen/texturen/neptune/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_neptune.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 241 580 Bytes | unverändert übernommen, nur umbenannt |
| `assets-quellen/texturen/moon/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_moon.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 1 053 869 Bytes | unverändert übernommen, nur umbenannt |

Keine der zehn Dateien ist ein Platzhalter — alle wurden erfolgreich von der
oben genannten Quelle heruntergeladen und liegen in der geforderten Auflösung vor.

## Sternkatalog-Quelle: HYG-Datenbank

Der Sternenhintergrund (`src/data/stars/hyg.json`) stammt aus der HYG-Datenbank
(<https://github.com/astronexus/HYG-Database>), einem von Astronexus zusammengestellten
Katalog aus Hipparcos-, Yale-Bright-Star- und Gliese-Katalog. Urheber: Astronexus.
Lizenz: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0,
<https://creativecommons.org/licenses/by-sa/4.0/>).

Verwendete Rohdatei: `hyg/CURRENT/hygdata_v41.csv` (HYG-Version 4.1), Stand des Commits
`3bf37f4b2d5460e1278286320d1d62fab9b493c1` vom 17. August 2024, Originalgröße 33 932 548
Bytes mit 119 626 Einträgen.

Bearbeitung: Aus der Rohdatei wurden nur Sterne mit scheinbarer Helligkeit (Feld `mag`)
≤ 6,0 übernommen (die für das bloße Auge sichtbare Grenzhelligkeit) sowie die Sonne selbst
(Feld `dist` = 0) ausgeschlossen, da sie bereits als eigener, beleuchteter Körper an ihrer
wahren Position gerendert wird (siehe `src/render/bodies.ts`) und nicht zusätzlich als
Fixstern am Himmel erscheinen soll. Von den verbleibenden 5070 Sternen wurden nur vier
Felder behalten: Rektaszension in Grad (Rohfeld `ra` liegt in Stunden vor und wurde mit 15
multipliziert), Deklination in Grad (Rohfeld `dec`), scheinbare Helligkeit (Rohfeld `mag`)
und B−V-Farbindex (Rohfeld `ci`). 23 Sterne ohne bekannten Farbindex erhielten ersatzweise
den neutralen Referenzwert 0,0 (Nullpunkt der Farbindex-Skala, entspricht einem weißen
A0V-Stern) statt `NaN`. Alle vier Felder wurden zur Größenreduktion gerundet (Rektaszension
und Deklination auf drei, Helligkeit und Farbindex auf zwei Nachkommastellen).

| Datei | Quelle (URL) | Urheber | Lizenz | Einträge | Größe | Bearbeitung |
|---|---|---|---|---|---|---|
| `src/data/stars/hyg.json` | <https://github.com/astronexus/HYG-Database/blob/3bf37f4b2d5460e1278286320d1d62fab9b493c1/hyg/CURRENT/hygdata_v41.csv> | Astronexus | CC BY-SA 4.0 | 5070 Sterne | 247 290 Bytes | gefiltert auf mag ≤ 6,0, Sonne ausgeschlossen, auf vier Felder (ra/dec in Grad, mag, ci) reduziert, gerundet — siehe Beschreibung oben |

## Milchstraße: NASA SVS Deep Star Maps 2020

Der Himmelshintergrund (`public/textures/milchstrasse/`) beruht auf der Karte „Milky Way
Background“ der „Deep Star Maps 2020“ des NASA Goddard Scientific Visualization Studio
(<https://svs.gsfc.nasa.gov/4851>): Plate carrée in ICRF/J2000, gerechnet aus 1,7 Milliarden
Sternen von Gaia DR2 ohne die hellen Hipparcos- und Tycho-Sterne. Namensnennung:
„NASA/Goddard Space Flight Center Scientific Visualization Studio. Gaia DR2: ESA/Gaia/DPAC“.
Das SVS erklärt seinen Inhalt als gemeinfrei, sofern nicht anders vermerkt
(<https://svs.gsfc.nasa.gov/help/>); der zugrunde liegende Gaia-DR2-Anteil steht laut ESA
unter CC BY-NC 3.0 IGO mit Namensnennung
(<https://www.cosmos.esa.int/web/gaia-users/license>). Orrery ist ein nichtkommerzielles
Projekt.

Bearbeitung: `scripts/milchstrasse-bauen.ts` und `scripts/milchstrasse.py` bilden die
HDR-Karte über eine Potenzkurve (Median des Bandes und 99,5-Perzentil als Stützpunkte) mit
eingerechneter Umkehrung des ACES-Tonemappings auf 8 bit sRGB ab, spiegeln sie senkrecht
(KTX2 kennt kein flipY) und kodieren sie als KTX2.

| Datei | Quelle | Urheber | Lizenz | Maße | Größe | Bearbeitung |
|---|---|---|---|---|---|---|
| `public/textures/milchstrasse/himmel-1024.ktx2` | <https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004851/milkyway_2020_8k.exr> | NASA/GSFC SVS; Gaia DR2: ESA/Gaia/DPAC | SVS gemeinfrei; Gaia-Anteil CC BY-NC 3.0 IGO (Namensnennung) | 1024×512 | 59 941 Bytes | siehe oben, ETC1S |
| `public/textures/milchstrasse/himmel-2048.ktx2` | wie oben | wie oben | wie oben | 2048×1024 | 1 069 543 Bytes | siehe oben, UASTC |
| `public/textures/milchstrasse/himmel-8192.ktx2` | wie oben | wie oben | wie oben | 8192×4096 | 30 310 600 Bytes | siehe oben, UASTC |

## Textur-Quelle: Solar System Scope (Zwergplaneten, Task 11)

Vier weitere Albedo-Texturen stammen erneut von Solar System Scope
(<https://www.solarsystemscope.com/textures/>), diesmal für vier der fünf
Zwergplaneten: Ceres, Eris, Haumea, Makemake. Urheber: Solar System Scope.
Lizenz: Creative Commons Attribution 4.0 International (CC BY 4.0,
<https://creativecommons.org/licenses/by/4.0/>).

Diese vier Dateien tragen bei der Quelle selbst den Namenszusatz
„_fictional" (z. B. `2k_ceres_fictional.jpg`): Anders als bei den zehn
Phase-1-Körpern liegen für diese Zwergplaneten keine flächendeckenden
fotografischen Oberflächenkarten vor (keine Raumsonde hat sie aus der Nähe
kartiert) — die Texturen sind stilisierte, an bekannte Farbe und Albedo
angenäherte künstlerische Darstellungen der Quelle, keine echten Aufnahmen.
Das ist hier offen benannt, nicht verschwiegen.

Eigener Abschnitt statt einer Zeile in der obigen Tabelle, weil diese vier
Dateien — anders als die zehn Phase-1-Texturen — in 1024×512 statt 2048×1024
abgelegt sind (Monde und Zwergplaneten sind laut Task-11-Vorgabe selten
formatfüllend zu sehen).

Bearbeitung: von der 2k-Ausgangsauflösung (2048×1024, JPEG) auf 1024×512
verkleinert, sonst unverändert.

| Datei | Quelle (URL) | Urheber | Lizenz | Maße | Größe | Bearbeitung |
|---|---|---|---|---|---|---|
| `assets-quellen/texturen/ceres/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_ceres_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 215 184 Bytes | von 2048×1024 auf 1024×512 verkleinert |
| `assets-quellen/texturen/eris/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_eris_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 200 229 Bytes | von 2048×1024 auf 1024×512 verkleinert |
| `assets-quellen/texturen/haumea/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_haumea_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 192 721 Bytes | von 2048×1024 auf 1024×512 verkleinert |
| `assets-quellen/texturen/makemake/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_makemake_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 207 523 Bytes | von 2048×1024 auf 1024×512 verkleinert |

Pluto selbst fehlt hier bewusst: Solar System Scope führt aktuell keine
Pluto-Textur mehr im Angebot (Prüfung am 12.09.2026: die früher genutzte
Downloadadresse `2k_pluto.jpg` liefert 404). Pluto steht stattdessen im
folgenden Abschnitt — mit einer echten New-Horizons-Aufnahme, die der
fiktiven SSS-Variante ohnehin vorzuziehen gewesen wäre.

## Textur-Quelle: USGS Astrogeology / NASA (Monde und Zwergplaneten, gemeinfrei, Task 11)

15 weitere Albedo-Texturen — die großen Monde sowie Pluto und Charon —
stammen aus gemeinfreien Kartenwerken der NASA-Missionen (Voyager, Galileo,
Cassini, New Horizons, Viking) bzw. des USGS Astrogeology Science Center.
Bezogen wurden die Dateien über Wikimedia Commons, das dieselben
gemeinfreien Originaldateien spiegelt und pro Datei Urheber und Lizenz
dokumentiert; Quelle (URL) verweist unten auf die jeweilige
Commons-Dateiseite, auf der sich Urheberangabe und Lizenzbaustein
nachvollziehen lassen.

**Gemeinfreiheitsvermerk statt CC-BY-Zeile:** Alle Dateien dieses Abschnitts
sind als Arbeiten der US-Bundesregierung bzw. der von ihr beauftragten
Missionsteams gemeinfrei (public domain) und unterliegen keiner
Urheberrechtsbeschränkung; eine Namensnennung ist rechtlich nicht
vorgeschrieben, wird hier aber trotzdem geführt. Siehe NASAs
Medienrichtlinie: <https://www.nasa.gov/nasa-brand-center/images-and-media/>
(„NASA content — images, audio, video... — is generally not copyrighted and
may be used for educational or informational purposes").

Bearbeitung (alle Dateien): auf 1024×512 verkleinert; bei Mimas und Iapetus
zusätzlich die Titelzeile, Achsbeschriftung/Randlinien und die
Bildunterschrift mit Maßstabsleiste und Institutslogos herausgeschnitten,
die im jeweiligen NASA-Originalfoto Teil der Bilddatei sind (Einzelheiten
je Zeile).

| Datei | Quelle (URL) | Urheber | Lizenz | Maße | Größe | Bearbeitung |
|---|---|---|---|---|---|---|
| `assets-quellen/texturen/pluto/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Pluto_color_mapmosaic.jpg> | NASA / Johns Hopkins University Applied Physics Laboratory / Southwest Research Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 96 492 Bytes | von 5926×2963 auf 1024×512 verkleinert; New-Horizons-Globalmosaik — die von der Sonde nicht angeflogene Rückseite ist darin unbelichtet und erscheint schwarz (rund 30 % der Fläche), siehe Lücken-Hinweis unten |
| `assets-quellen/texturen/charon/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Cpmap_cyl_PS717_HR_180.jpg> | JPL/NASA (New-Horizons-Missionsteam) | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 65 838 Bytes | von 5000×2500 auf 1024×512 verkleinert; wie bei Pluto ist die unbeleuchtete Rückseite (rund ein Drittel der Fläche) unbelichtet und schwarz |
| `assets-quellen/texturen/io/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Io_for_GeoHacks.jpg> | U.S. Geological Survey Astrogeology Research Program | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 122 466 Bytes | von 1225×613 auf 1024×512 verkleinert (Galileo/Voyager-Mosaik, volle Kugel −90° bis 90°) |
| `assets-quellen/texturen/europa/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Jupiter_II-Europa_map_NASA_JPL_Voyager.jpg> | Caltech/JPL/USGS | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 128 550 Bytes | von 1440×720 auf 1024×512 verkleinert |
| `assets-quellen/texturen/ganymede/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Ganymede_map_NASA_JPL_Voyager.jpg> | Caltech/JPL/USGS | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 170 216 Bytes | von 1440×720 auf 1024×512 verkleinert |
| `assets-quellen/texturen/callisto/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Callisto_USGS_global_small.jpg> | USGS Astrogeology Science Center | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 104 638 Bytes | von 1024×498 auf 1024×512 skaliert (Ausgangsformat lag bereits nahe der Zielauflösung); das streckt die Höhe um 2,8 % (Seitenverhältnis wechselt von 2,057:1 auf 2:1) — bei dieser Simple-Cylindrical-Karte ein leichter Breitenfehler |
| `assets-quellen/texturen/titan/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Titan_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 94 714 Bytes | von 1000×500 auf 1024×512 skaliert; Nahinfrarot-Mosaik (durchdringt den Dunstschleier, echte Fotografie zeigt nur gleichmäßigen orangen Dunst) |
| `assets-quellen/texturen/enceladus/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Enceladus_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 190 782 Bytes | von 1000×500 auf 1024×512 skaliert |
| `assets-quellen/texturen/rhea/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Rhea_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 185 698 Bytes | von 1000×500 auf 1024×512 skaliert |
| `assets-quellen/texturen/dione/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Dione_map_for_GeoHack.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 108 993 Bytes | von 720×360 auf 1024×512 vergrößert |
| `assets-quellen/texturen/tethys/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Tethys_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 223 535 Bytes | von 1000×500 auf 1024×512 skaliert |
| `assets-quellen/texturen/iapetus/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Color_map_of_Iapetus_PIA18436_Nov._2014.jpg> | NASA / JPL-Caltech / Space Science Institute / Lunar and Planetary Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 147 074 Bytes | Bildunterschrift/Logo-Rand der Originalfigur (12261×7821) auf den reinen Kartenausschnitt (11739×5861) zugeschnitten, danach auf 1024×512 verkleinert; die stark unterschiedliche Helligkeit der beiden Hemisphären ist reale Albedo-Dichotomie (Cassini Regio), keine Datenlücke |
| `assets-quellen/texturen/mimas/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Mimas_2017-01_PIA17214.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 199 780 Bytes | Titelzeile, Achsbeschriftung/Randlinien und Maßstabsleiste der Originalfigur (6330×3756) auf den reinen Kartenausschnitt (5827×2947) zugeschnitten, danach auf 1024×512 verkleinert; dabei blieb vom Figurenrahmen ein schmaler schwarzer Streifen stehen (6 Zeilen oben, 5 unten, 5 Spalten links, 6 rechts der 1024×512-Datei, rund 3,4 % der Fläche) — in einem zweiten Bearbeitungsschritt (Fixrunde Task 11) weggeschnitten und erneut exakt auf 1024×512 skaliert; nach dem Schnitt enthalten alle Randzeilen/-spalten Bilddaten, keine schwarzen Streifen mehr |
| `assets-quellen/texturen/triton/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Triton_Map.jpg> | NASA/JPL-Caltech/Lunar & Planetary Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 85 766 Bytes | von 14138×7069 auf 1024×512 verkleinert; Voyager-2-Mosaik — die zur Vorbeiflugzeit unbeleuchtete Nordhalbkugel ist unbelichtet und erscheint schwarz (rund 38,5 % der Fläche), siehe Lücken-Hinweis unten |
| `assets-quellen/texturen/phobos/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Phobos_Viking_Mosaic_DLRcontrol_7200.jpg> | Planetary Data System / Phil Stooke (USGS Astrogeology) | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 164 171 Bytes | von 7200×3600 auf 1024×512 verkleinert |

**Hinweis zu Pluto, Charon und Triton:** Alle drei Karten zeigen einen
schwarzen, unbelichteten Bereich (jeweils eine der beiden Polkappen bzw.
die von der Sonde nicht angeflogene Rückseite) — eine reale, dokumentierte
Grenze der jeweiligen Einzelvorbeiflug-Mission (New Horizons an Pluto/Charon
2015, Voyager 2 an Neptun/Triton 1989), keine fehlerhafte Zuschneidung.
Anders als bei den fünf großen Uranusmonden (siehe Lücken-Abschnitt unten)
überwiegt hier mit rund 61-70 % Flächenanteil die tatsächlich kartierte
Fläche deutlich, weshalb diese drei Karten trotz der Lücke als brauchbar
gewertet wurden.

## Textur-Quelle: Solar System Scope (Ringtextur, Task 13)

Die Saturn-Ringtextur stammt erneut von Solar System Scope
(<https://www.solarsystemscope.com/textures/>). Urheber: Solar System Scope.
Lizenz: Creative Commons Attribution 4.0 International (CC BY 4.0,
<https://creativecommons.org/licenses/by/4.0/>).

Format: PNG mit Alphakanal, 2048×125 Pixel — kein äquirektanguläres Bild wie
die Albedo-Texturen, sondern ein radialer Streifen: Eine Bildspalte
entspricht einem Radius des Rings, die geringe Höhe (125 px) ist die
Streifendicke. Das trifft sich mit der UV-Belegung aus Task 12
(`ringGeometrieDaten` in `src/render/rings.ts`): u läuft von der Innenkante
(u=0) zur Außenkante (u=1) des Rings, v ist konstant und wird beim Sampling
nicht ausgewertet. Der Alphakanal trägt die radiale Bänderung/Dichte der
Ringe; das RGB trägt deren Farbe.

Geprüft (12.09.2026): Die vollständige Download-Liste der Quelle führt unter
„Rings" ausschließlich `2k_saturn_ring_alpha.png` und
`8k_saturn_ring_alpha.png` — kein Uranus-Gegenstück. Verwendet wurde die
2k-Variante, konsistent mit der 2k-Auflösung aller übrigen Phase-1-Texturen
dieses Projekts.

Bearbeitung: keine — unverändert in der gelieferten Auflösung übernommen,
nur nach `public/textures/saturn/ring.png` abgelegt.

| Datei | Quelle (URL) | Urheber | Lizenz | Maße | Größe | Bearbeitung |
|---|---|---|---|---|---|---|
| `public/textures/saturn/ring.png` | <https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png> | Solar System Scope | CC BY 4.0 | 2048×125 | 12 119 Bytes | unverändert übernommen, nur umbenannt |

## Uranus-Ring: gerechnet aus Messdaten statt Bilddatei

`appearance.rings.texture` bleibt bei Uranus leer. Geprüft am 12.09.2026,
ob eine Ringtextur unter einer zum Projekt passenden Lizenz (CC BY,
gemeinfrei) existiert:

| Quelle | Befund |
|---|---|
| Solar System Scope, Download-Liste „Rings" | nur `2k_/8k_saturn_ring_alpha.png`, kein Uranus |
| NASA-3D-Resources (GitHub, „Images and Textures") | Uranusmonde Ariel bis Umbriel, keine Ringtextur |
| NASA Science, „Uranus 3D Model" (glTF/USDZ, VTAD, 09/2023) | eine Kugel mit einem Bild (`Uranus_1_51118.glb`: 1 Netz, 1 Material, 1 Textur), keine Ringe |
| Stellarium `textures/` und `stellarium-addons` (1K-Paket) | `uranus_rings.png` nur im Addon-Paket; `ssystem_major.ini` vermerkt „texture from Celestia", das Paket nennt sich „from Celestia and Space Engine projects" mit leerem Lizenzfeld — unbrauchbar |
| DeviantArt-Texturen („Uranus Rings Texture") | Fan-Arbeiten, teils abgeleitet von Planet Pixel Emporium (nicht frei weitergebbar) |

Frei verfügbar sind dagegen die **Messdaten**: Der PDS Ring-Moon Systems
Node (SETI Institute, NASA Planetary Data System) tabelliert unter „Vital
Statistics for Uranus's Rings" (<https://pds-rings.seti.org/uranus/uranus_rings_table.html>)
für jeden Ring Mittelradius, Breite und normale optische Tiefe. Diese Werte
stehen als `URANUS_RINGPROFIL` in `src/data/bodies/uranus.ts`;
`src/render/ringProfil.ts` rechnet daraus zur Laufzeit einen radialen
2048×1-Streifen mit Alphakanal im Format der Saturn-Ringtextur. Es liegt
also keine Bilddatei im Repository, und es gibt nichts zu attribuieren
außer der Datenquelle.

Bewusst nicht maßstäblich (künstlerische Freiheit, im Modulkommentar von
`ringProfil.ts` begründet): Die schmalen Ringe (1,5 bis 60 km) sind auf
Sockel 260 km plus sechsfache echte Breite verbreitert, weil ein Kilometer
in der Kinoszene ein Achtzigstel Pixel ist; die diffusen Komponenten
(ζ-Ring, Staubschicht, τ ≈ 0,005) sind zwölffach verstärkt und auf
Deckkraft 0,12 gedeckelt. Physikalisch bleibt die Deckkraft der schmalen
Ringe (1 − e^(−τ)) und damit die Rangfolge: ε deckt zu 78 %, δ und 5 zu
39 %, 6, 4, β, γ zu 26 %, λ zu 10 %. Farbe einheitlich helles, warmes Grau
(sRGB 214/202/190) — „slightly red" im Sichtbaren nach Baines et al. 1998.
Pixelmessung nach dem Umbau (12.09.2026, Kinoszene `uranus-gekippt` bei
Sekunde 4, Preset Schaubild, Standardbeleuchtung, Chromium 1249×1269):
ε-Ring 66 von 255, innere Ringe 10 bis 32, ζ-Schleier 8 — gegen 0 an jeder
Ringposition vor der Korrektur.

Fällt `profil` einmal weg, greift weiterhin die mittelgraue 1×1-Ersatztextur
(`ERSATZ_RING_GRAU` = 128 in `render/rings.ts`). Der Grauwert ist ein
Sichtbarkeitswert, kein Albedowert: Ein aus der realen Albedo (rund 0,05)
hergeleiteter Wert (RGB 38) war in der Kinoszene `uranus-gekippt` messbar
schwarz (0 von 255), weil die Szene nirgends physikalisch belichtet ist und
das ACES-Tonemapping alles unter rund 1 % linear auf Schwarz drückt; mit 128
maß der flächige Ring dort 31 von 255.

## Lücken: Körper ohne Textur (Task 11)

Für sechs der 25 in Task 8-10 hinzugekommenen Körper blieb
`appearance.textures.albedo` leer; die Ausweichfarbe (siehe jeweiliger
Quellenblock in `src/data/bodies/`) trägt sie vollständig. Geprüfte Quellen:
Solar System Scope (<https://www.solarsystemscope.com/textures/>), USGS
Astrogeology (<https://astrogeology.usgs.gov/search>) sowie eine gezielte
Suche über die Wikimedia-Commons-API (`commons.wikimedia.org/w/api.php`,
Volltext- und Kategoriensuche) nach amtlichen NASA/USGS-Kartenmosaiken.

- **Miranda, Ariel, Umbriel, Titania, Oberon** (alle fünf großen
  Uranusmonde): Die einzige existierende Nahaufnahme stammt von Voyager 2s
  einmaligem Vorbeiflug 1986. Weil Uranus zu diesem Zeitpunkt fast auf der
  Seite lag, sah die Sonde bei jedem der fünf Monde nur dessen
  sonnenzugewandte Südhalbkugel — die als USGS/JPL-Kartenmosaik verfügbaren
  Dateien (`<Mond>_map_JPL_USGS.jpg`, <https://maps.jpl.nasa.gov/tmaps/uranus.html>,
  gemeinfrei) bestehen deshalb zu 57-62 % der Fläche aus unbelichteter,
  schwarzer Fläche (Pixelauszählung der Vorschaubilder, Schwellwert
  Helligkeit < 12). Das ist deutlich mehr als bei Pluto, Charon oder Triton
  (dort 30-39 %, siehe Hinweis oben) und hätte auf der Kugel wie ein
  Darstellungsfehler statt wie eine dokumentierte Datenlücke gewirkt — die
  Ausweichfarbe ist hier die ehrlichere Darstellung. Erwartet laut
  Task-11-Vorgabe für Miranda und Umbriel; die Prüfung ergab, dass Ariel,
  Titania und Oberon an derselben Grenze scheitern. Mimas dagegen — in der
  Vorgabe ebenfalls als vermuteter Lückenkandidat genannt — hat eine
  vollständige, lückenlose Cassini-Karte (siehe vorige Tabelle) und ist
  texturiert.
- **Deimos**: Keine amtliche USGS/NASA-Globalkarte auffindbar (weder auf
  astrogeology.usgs.gov noch über Wikimedia Commons). Die einzige
  kursierende globale Deimos-Textur (`Deimos_color_map.jpg` auf Wikimedia
  Commons) stammt von einem DeviantArt-Nutzer („Oleg-Pluton") unter
  CC BY-SA 3.0 — eine nicht-amtliche Fan-Rekonstruktion ohne nachvollziehbare
  Quellenkette zu realen Bilddaten, die dem Anspruch dieses Katalogs
  (belegte, amtliche Quellen) nicht genügt. Verworfen statt verwendet.

Nicht erwartet, aber ebenfalls nicht gefunden: eine Solar-System-Scope-Textur
für Pluto (siehe Hinweis im vorigen Abschnitt) — hier griff ersatzweise die
echte New-Horizons-Karte, weshalb Pluto trotzdem texturiert ist.

## Texturstufen (KTX2)

Seit Etappe 5-3 (Phase 5) liegen alle 29 Albedokarten zusätzlich als KTX2-Stufen
vor, abgelegt unter `public/textures/<koerper>/albedo-<breite>.ktx2`. Welche
Stufen ein Körper führt, steht in `src/data/texturen.ts`:

| Körper | Stufen |
|---|---|
| Merkur, Venus, Erde, Mars, Mond | 1024, 2048, 8192 |
| Sonne, Jupiter, Saturn | 1024, 2048, 4096 |
| Uranus, Neptun | 1024, 2048 |
| alle übrigen Körper mit Textur (Monde, Zwergplaneten) | 1024 |

**Bearbeitung:** Die Stufen bis 2048 entstehen aus dem jeweiligen JPEG unter
`assets-quellen/texturen/<koerper>/albedo.jpg` (siehe oben), die Stufen 4096 und
8192 aus eigenen, höher aufgelösten Quellen (Tabelle unten). Jede Stufe wird mit
Lanczos-Filterung (Pillow) auf ihre Breite verkleinert und senkrecht gespiegelt,
weil KTX2 kein `flipY` kennt, dann mit KTX-Software 4.4.2 von Khronos kodiert
(Basis Universal, Farbraum sRGB, mit Mipmaps): die 1k-Stufe als ETC1S (kleine
Startladung), alle breiteren Stufen als UASTC mit Zstandard-Nachkompression
(höhere Bildtreue). Die genauen Schalter stehen in
`scripts/texturen-quellen.json`, erzeugt wird mit `npm run texturen`
(`scripts/texturen-bauen.ts`); Einzelheiten zur Probe, die zu dieser Kodierung
führte, stehen in `docs/phase5-etappe3-abnahme.md` §3.

**Neue Quellen der Höchststufen:** Für die acht Körper mit einer Stufe über 2048
lädt das Bauskript eine höher aufgelöste Ausgangsdatei erneut von Solar System
Scope. Die Quelldateien selbst liegen nicht im Repository, sondern nur
vorübergehend im git-ignorierten Ordner `.cache/texturen/`; der SHA-256 sichert
die Herkunft bei jedem erneuten Bauen.

| Körper | Quelle (URL) | Urheber | Lizenz | Maße | SHA-256 | Bearbeitung |
|---|---|---|---|---|---|---|
| Merkur | <https://www.solarsystemscope.com/textures/download/8k_mercury.jpg> | Solar System Scope | CC BY 4.0 | 8192×4096 | `5c8bd885ae3571c6ba2cd34b3446b9c6d767e314bf0ee8c1d5c147cadd388fc3` | wie oben, Stufe 8192 |
| Venus | <https://www.solarsystemscope.com/textures/download/8k_venus_surface.jpg> | Solar System Scope | CC BY 4.0 | 8192×4096 | `9bc21a50577ed8ac734cda91058724c7a741c19427aa276224ce349351432c5b` | wie oben, Stufe 8192 |
| Erde | <https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg> | Solar System Scope | CC BY 4.0 | 8192×4096 | `88ab060b6e7d241cfc590c69f528fab2b3247b738d40124cb590999a6fe44abc` | wie oben, Stufe 8192 |
| Mars | <https://www.solarsystemscope.com/textures/download/8k_mars.jpg> | Solar System Scope | CC BY 4.0 | 8192×4096 | `4cc52149924abc6ae507d63032f994e1d42a55cb82c09e002d1a567ff66c23ee` | wie oben, Stufe 8192 |
| Mond | <https://www.solarsystemscope.com/textures/download/8k_moon.jpg> | Solar System Scope | CC BY 4.0 | 8192×4096 | `d1875bcec83588ca25e4802e576f6bb9f88b39e1e403cb41ff55867419c54796` | wie oben, Stufe 8192 |
| Sonne | <https://www.solarsystemscope.com/textures/download/8k_sun.jpg> | Solar System Scope | CC BY 4.0 | 4096×2048 | `f22b1cfb306ddce72a7e3b628668a0175b745038ce6268557cb2f7f1bdf98b9d` | wie oben, Stufe 4096 |
| Jupiter | <https://www.solarsystemscope.com/textures/download/8k_jupiter.jpg> | Solar System Scope | CC BY 4.0 | 4096×2048 | `0bd844bf20822c4e3e80882b077859833c0dac44c7e4e1e0cd63d1b1b6d43085` | wie oben, Stufe 4096 |
| Saturn | <https://www.solarsystemscope.com/textures/download/8k_saturn.jpg> | Solar System Scope | CC BY 4.0 | 4096×2048 | `0d39a4a490c87c3edabe00a3881a29bb3418364178c79c534fe0986e97e09853` | wie oben, Stufe 4096 |

Diese acht Dateien sind allesamt echte 8192×4096- bzw. 4096×2048-Photomosaike
derselben Quelle wie die 2k-Karten oben (Solar System Scope, CC BY 4.0), nur in
höherer Auflösung; die Angaben zu Urheberschaft und Lizenz aus dem ersten
Abschnitt gelten unverändert.

## Basis-Transcoder

Der KTX2-Lader (`three/examples/jsm/loaders/KTX2Loader.js`) braucht zur
Laufzeit einen WebAssembly-Transcoder von Basis Universal. Die beiden Dateien
`public/basis/basis_transcoder.js` und `public/basis/basis_transcoder.wasm`
sind unverändert aus three.js 0.186 kopiert
(`node_modules/three/examples/jsm/libs/basis/`); ein Test
(`src/render/basis.test.ts`) vergleicht beide Dateien Byte für Byte mit der
mitgelieferten Fassung, damit ein three-Update sie nicht still veralten lässt.

Die README im three-Ordner nennt keine Lizenz für den Transcoder. Laut der
Datei `LICENSE` des Ursprungsrepositorys
<https://github.com/BinomialLLC/basis_universal> steht der Basis-Universal-Code
— und damit der daraus gebaute Transcoder — unter der Apache License 2.0,
Copyright 2019–2026 Binomial LLC.

## App-Symbol

`public/symbole/orrery-192.png` und `public/symbole/orrery-512.png` sind eigene
Zeichnungen (Sonne mit zwei Bahnen), erzeugt mit `scripts/app-symbol.py`
(Pillow); keine fremden Urheber.

## Musik

Orrery liefert keine Musik aus. Wer die Seite betreibt, kann eigene MP3-Dateien
im Ordner `musik/` der ausgelieferten Seite hinterlegen (Anleitung in der
`README.md`, Abschnitt „Eigene Musik"); lokal liegt der Ordner unter
`public/musik/` und ist git-ignoriert, erscheint also nie im Repository. Für
Lizenz, Namensnennung und Nutzungsrechte dieser Stücke ist allein der Betreiber
verantwortlich. Die Anwendung zeigt beim laufenden Stück Titel, Urheber und Link
aus seiner Liste `musik/stuecke.json` an.
