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
