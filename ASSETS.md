# Assets

Diese Datei dokumentiert die Herkunft aller im Repository abgelegten Texturdateien
und erfüllt damit die Namensnennungspflicht der CC-BY-Lizenz.

## Textur-Quelle: Solar System Scope

Alle zehn Albedo-Texturen stammen von Solar System Scope
(<https://www.solarsystemscope.com/textures/>), Auflösung 2k (2048×1024 Pixel,
äquirektangulär). Urheber: Solar System Scope. Lizenz: Creative Commons
Attribution 4.0 International (CC BY 4.0, <https://creativecommons.org/licenses/by/4.0/>).
Laut Angabe der Quelle basieren die Texturen auf NASA-Höhen- und Bilddaten,
farblich abgestimmt auf Aufnahmen der Sonden Messenger, Viking und Cassini
sowie des Hubble-Weltraumteleskops.

Bearbeitung: keine — die Dateien wurden unverändert in der von der Quelle
gelieferten Auflösung (2048×1024, JPEG) übernommen und nur umbenannt/abgelegt
unter `public/textures/<koerper>/albedo.jpg`.

| Datei | Quelle (URL) | Urheber | Lizenz | Maße | Größe | Bearbeitung |
|---|---|---|---|---|---|---|
| `public/textures/sun/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_sun.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 822 427 Bytes | unverändert übernommen, nur umbenannt |
| `public/textures/mercury/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_mercury.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 872 555 Bytes | unverändert übernommen, nur umbenannt |
| `public/textures/venus/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 885 075 Bytes | unverändert übernommen, nur umbenannt (Oberflächenkarte, nicht die Wolkendecken-Variante) |
| `public/textures/earth/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 463 087 Bytes | unverändert übernommen, nur umbenannt (Tagseiten-Karte, ohne Wolkendecke) |
| `public/textures/mars/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_mars.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 750 547 Bytes | unverändert übernommen, nur umbenannt |
| `public/textures/jupiter/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 498 976 Bytes | unverändert übernommen, nur umbenannt |
| `public/textures/saturn/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_saturn.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 199 916 Bytes | unverändert übernommen, nur umbenannt (ohne Ringtextur) |
| `public/textures/uranus/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_uranus.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 77 751 Bytes | unverändert übernommen, nur umbenannt |
| `public/textures/neptune/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_neptune.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 241 580 Bytes | unverändert übernommen, nur umbenannt |
| `public/textures/moon/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_moon.jpg> | Solar System Scope | CC BY 4.0 | 2048×1024 | 1 053 869 Bytes | unverändert übernommen, nur umbenannt |

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
| `public/textures/ceres/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_ceres_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 215 184 Bytes | von 2048×1024 auf 1024×512 verkleinert |
| `public/textures/eris/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_eris_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 200 229 Bytes | von 2048×1024 auf 1024×512 verkleinert |
| `public/textures/haumea/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_haumea_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 192 721 Bytes | von 2048×1024 auf 1024×512 verkleinert |
| `public/textures/makemake/albedo.jpg` | <https://www.solarsystemscope.com/textures/download/2k_makemake_fictional.jpg> | Solar System Scope | CC BY 4.0 | 1024×512 | 207 523 Bytes | von 2048×1024 auf 1024×512 verkleinert |

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
| `public/textures/pluto/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Pluto_color_mapmosaic.jpg> | NASA / Johns Hopkins University Applied Physics Laboratory / Southwest Research Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 96 492 Bytes | von 5926×2963 auf 1024×512 verkleinert; New-Horizons-Globalmosaik — die von der Sonde nicht angeflogene Rückseite ist darin unbelichtet und erscheint schwarz (rund 30 % der Fläche), siehe Lücken-Hinweis unten |
| `public/textures/charon/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Cpmap_cyl_PS717_HR_180.jpg> | JPL/NASA (New-Horizons-Missionsteam) | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 65 838 Bytes | von 5000×2500 auf 1024×512 verkleinert; wie bei Pluto ist die unbeleuchtete Rückseite (rund ein Drittel der Fläche) unbelichtet und schwarz |
| `public/textures/io/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Io_for_GeoHacks.jpg> | U.S. Geological Survey Astrogeology Research Program | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 122 466 Bytes | von 1225×613 auf 1024×512 verkleinert (Galileo/Voyager-Mosaik, volle Kugel −90° bis 90°) |
| `public/textures/europa/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Jupiter_II-Europa_map_NASA_JPL_Voyager.jpg> | Caltech/JPL/USGS | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 128 550 Bytes | von 1440×720 auf 1024×512 verkleinert |
| `public/textures/ganymede/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Ganymede_map_NASA_JPL_Voyager.jpg> | Caltech/JPL/USGS | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 170 216 Bytes | von 1440×720 auf 1024×512 verkleinert |
| `public/textures/callisto/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Callisto_USGS_global_small.jpg> | USGS Astrogeology Science Center | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 104 638 Bytes | von 1024×498 auf 1024×512 skaliert (Ausgangsformat lag bereits nahe der Zielauflösung); das streckt die Höhe um 2,8 % (Seitenverhältnis wechselt von 2,057:1 auf 2:1) — bei dieser Simple-Cylindrical-Karte ein leichter Breitenfehler |
| `public/textures/titan/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Titan_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 94 714 Bytes | von 1000×500 auf 1024×512 skaliert; Nahinfrarot-Mosaik (durchdringt den Dunstschleier, echte Fotografie zeigt nur gleichmäßigen orangen Dunst) |
| `public/textures/enceladus/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Enceladus_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 190 782 Bytes | von 1000×500 auf 1024×512 skaliert |
| `public/textures/rhea/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Rhea_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 185 698 Bytes | von 1000×500 auf 1024×512 skaliert |
| `public/textures/dione/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Dione_map_for_GeoHack.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 108 993 Bytes | von 720×360 auf 1024×512 vergrößert |
| `public/textures/tethys/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Tethys_cropped.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 223 535 Bytes | von 1000×500 auf 1024×512 skaliert |
| `public/textures/iapetus/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Color_map_of_Iapetus_PIA18436_Nov._2014.jpg> | NASA / JPL-Caltech / Space Science Institute / Lunar and Planetary Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 147 074 Bytes | Bildunterschrift/Logo-Rand der Originalfigur (12261×7821) auf den reinen Kartenausschnitt (11739×5861) zugeschnitten, danach auf 1024×512 verkleinert; die stark unterschiedliche Helligkeit der beiden Hemisphären ist reale Albedo-Dichotomie (Cassini Regio), keine Datenlücke |
| `public/textures/mimas/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Map_of_Mimas_2017-01_PIA17214.jpg> | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 199 780 Bytes | Titelzeile, Achsbeschriftung/Randlinien und Maßstabsleiste der Originalfigur (6330×3756) auf den reinen Kartenausschnitt (5827×2947) zugeschnitten, danach auf 1024×512 verkleinert; dabei blieb vom Figurenrahmen ein schmaler schwarzer Streifen stehen (6 Zeilen oben, 5 unten, 5 Spalten links, 6 rechts der 1024×512-Datei, rund 3,4 % der Fläche) — in einem zweiten Bearbeitungsschritt (Fixrunde Task 11) weggeschnitten und erneut exakt auf 1024×512 skaliert; nach dem Schnitt enthalten alle Randzeilen/-spalten Bilddaten, keine schwarzen Streifen mehr |
| `public/textures/triton/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Triton_Map.jpg> | NASA/JPL-Caltech/Lunar & Planetary Institute | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 85 766 Bytes | von 14138×7069 auf 1024×512 verkleinert; Voyager-2-Mosaik — die zur Vorbeiflugzeit unbeleuchtete Nordhalbkugel ist unbelichtet und erscheint schwarz (rund 38,5 % der Fläche), siehe Lücken-Hinweis unten |
| `public/textures/phobos/albedo.jpg` | <https://commons.wikimedia.org/wiki/File:Phobos_Viking_Mosaic_DLRcontrol_7200.jpg> | Planetary Data System / Phil Stooke (USGS Astrogeology) | Public Domain (NASA-Medienrichtlinie) | 1024×512 | 164 171 Bytes | von 7200×3600 auf 1024×512 verkleinert |

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

**Lücke Uranus-Ring:** `appearance.rings.texture` bleibt bei Uranus leer
(siehe `src/data/bodies/uranus.ts`). Solar System Scope bietet — anders als
für Saturn — keine Uranus-Ringtextur an, und keine andere im Projekt bereits
belegte Quelle (USGS Astrogeology, Wikimedia-Commons-NASA-Mosaike) führt
eine. Der Ring wird trotzdem gerendert: Ohne Textur greift in
`render/rings.ts` eine mittelgraue, voll deckende 1×1-Ersatztextur (`tRing`,
Grauwert `ERSATZ_RING_GRAU` = 128), sodass Uranus’ Ring als flächiger,
ungebänderter Streifen sichtbar bleibt statt zu verschwinden — dieselbe
Ersatzstrategie wie bei Körpern ohne Albedo-Textur in `render/bodies.ts`.
Der Grauwert ist bewusst kein Albedowert: Ein aus der realen Albedo des
Uranusrings (rund 0,05) hergeleiteter Wert (RGB 38) war in der Kinoszene
`uranus-gekippt` messbar schwarz (0 von 255 an jeder Ringposition), weil die
Szene nirgends physikalisch belichtet ist und das ACES-Tonemapping alles
unter rund 1 % linear auf Schwarz drückt. Mit 128 misst der Ring dort 31 von
255 — dunkel, aber vorhanden. Herleitung und Messwerte stehen bei der
Konstante in `render/rings.ts`.

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
