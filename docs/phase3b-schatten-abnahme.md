# Phase 3b-2 — Schatten: Abnahmeprotokoll

**Datum:** 13.09.2026
**Stand:** Zweig `schatten`, Task 3 (Körper-Shader, Okkluderauswahl je Bild,
erstes sichtbares Ergebnis). Die Rechnung selbst (`render/shadows.ts`) und der
Schalter `display.shadows` stammen aus Task 1 und 2.
**Prüfumgebung:** Windows 11, Desktop mit RTX 4060, Chromium (Playwright),
Vite-Entwicklungsserver auf `localhost`, Fenster 1280 × 800 CSS-Pixel,
`devicePixelRatio` 1, Qualitätsstufe `high`, Maßstabs-Preset „Schaubild"
(`sizeScale` 50, `distanceExponent` 0,6), Zeit angehalten, Bedienoberfläche
ausgeblendet, Bahnlinien/Beschriftungen/Marker aus.

Gemessen wird wie beim Gürtel (docs/phase3b-guertel-abnahme.md) als **Differenz
zweier sonst identischer Bilder**, geschaltet über den echten Schalter
`display.shadows`. Gezählt werden Pixel, deren größte Kanalabweichung über der
angegebenen Schwelle liegt; „Kontrolle" ist jeweils ein Paar Aufnahmen
desselben Zustands.

## Sichtprüfung Mondschatten auf Jupiter

### Zeitpunkt: Suche nach dem ersten Io-Schatten

Gesucht wurde ab J2000 in Schritten von 0,05 d, je Schritt ein Differenzbild
(Schatten an gegen aus) in der unten beschriebenen Nahaufnahme. Zum Vergleich
steht daneben die unabhängig gerechnete Geometrie (`positionAt` aus
`sim/orbit.ts`, ohne den Renderer und ohne `render/shadows.ts`): Abstand des
Schattenstrahls eines Mondes von der Jupitermitte, quer zur Sonnenrichtung.

| jd | Pixel mit Differenz > 30 | größte Differenz | gerechnete Geometrie |
|---|---:|---:|---|
| 2451545,00 | 63 | 77 | Europa wirft Schatten auf Jupiter (0,807 R♃) |
| 2451545,05 | 39 | 109 | Europa wirft Schatten (0,501 R♃); Io steht im Jupiterschatten |
| 2451545,10 | 12 | 109 | Io steht im Jupiterschatten (0,393 R♃) |
| 2451545,15 … 2451545,90 (16 Schritte) | **0** | 0 bis 1 | kein Mond im Schattenstrahl |
| **2451545,95** | **82** | **101** | **Io wirft Schatten auf Jupiter (0,596 R♃)** |

Renderer und Geometrie stimmen an jedem der 20 Gitterpunkte überein: Ein
Unterschied zwischen „Schatten an" und „Schatten aus" tritt genau an den vier
Zeitpunkten auf, an denen die Rechnung einen Schattenwurf oder eine
Mondfinsternis ansagt, und an keinem anderen. Der erste **Io**-Schatten auf
Jupiter liegt bei jd 2451545,95; er ist die Messstelle unten. (Bei jd
2451545,00 und 2451545,05 ist der Fleck Europas Schatten, bei 2451545,10 der
im Jupiterschatten verdunkelte Io selbst.)

### Aufbau

| Größe | Nahaufnahme Jupiter | Kinoszene `galileisches-schattenspiel` |
|---|---|---|
| Kameramodus | `attached`, Ziel Jupiter | `cinema`, Szenennummer 7, `shuffle` aus, `running` aus |
| `camera.azimuth` / `.elevation` | −3,065696 / −0,300572 rad | von der Szene gesetzt |
| `camera.distance` | 2,09733 · 10⁷ km = 6 dargestellte Jupiterradien | von der Szene gesetzt (55 Radien × Streufaktor) |
| `cinema.elapsedSec` | — | 0 s (von 45 s Szenendauer) |
| Zeit | jd 2451545,95, angehalten | jd 2451545,95, angehalten |
| Jupiter im Bild (Mitte / Radius) | (640,0 / 400,0), **143,0 px** | (640,0 / 400,0), **10,7 px** |
| Io im Bild (Mitte / Radius) | (18,7 / 643,3), 3,1 px | (579,8 / 384,5), 0,27 px |
| Kameraabstand in Jupiterradien | 6,0 | 80,2 |

Blickrichtung der Nahaufnahme: Azimut und Elevation sind so gewählt, dass die
Flächennormale im Mittelpunkt des Schattenflecks zur Kamera zeigt — der Fleck
steht damit in der Bildmitte und wird nicht am Rand zur Ellipse gestaucht. Die
Sonne steht 36,61° neben dieser Blickrichtung, der Fleck liegt also mit Abstand
auf der Tagseite und nicht am Terminator.

Die Kinoszene ist mit 80,2 Jupiterradien Kameraabstand aufgebaut, um alle vier
Galileischen Monde zu fassen; Jupiter ist dort 21 px breit. Ein Io-Schatten
misst 2,6 % des Jupiterdurchmessers, in dieser Szene also **0,55 px** — er ist
dort grundsätzlich nicht auflösbar (Messung unten: null abweichende Pixel auf
Jupiter). Die Messung findet deshalb in der Nahaufnahme statt, die dieselbe
Geometrie aus 6 statt 80 Radien zeigt.

### (1) Der Fleck in der Nahaufnahme

| Größe | Wert |
|---|---:|
| Pixel mit Differenz > 0 | 109 |
| davon > 10 | 96 |
| davon > 20 | 88 |
| **davon > 30 (Kriterium)** | **82** |
| davon > 60 | 66 |
| **größte Differenz** | **101 von 255** |
| Schwerpunkt des Flecks | (639,3 / 399,6) px |
| umschließendes Rechteck | x 634 … 644, y 395 … 404 (11 × 10 px) |
| äquivalenter Durchmesser (Schwelle 30) | 10,2 px |
| Kontrolle: zwei Aufnahmen desselben Zustands | **0 abweichende Pixel** |

Der Schwerpunkt liegt 0,8 px neben der projizierten Jupitermitte (640,0 /
400,0) bei einem Scheibenradius von 143,0 px — also mitten auf der
Jupiterscheibe, genau dort, wo die unabhängige Rechnung den Schattenstrahl
auftreffen lässt (die Kamera wurde auf diesen Punkt ausgerichtet, siehe oben).
Die Lage der Kugeln im Bild ist aus `mesh.modelViewMatrix` (three füllt sie
beim Rendern) und dem bekannten Bildwinkel (50° senkrecht) gerechnet.

Helligkeit im Fleck, gemittelt über die 82 gezählten Pixel: RGB (115,7 / 97,4 /
80,0) mit Schatten gegen (200,2 / 183,6 / 165,1) ohne. Das dunkelste Pixel
steht bei (108 / 83 / 62) gegen (207 / 184 / 158) — der Kernschatten nimmt also
rund die Hälfte der Helligkeit weg, nicht alles: Jupiters Nachtseitenfüllung
(`nightFill` 0,25) bleibt stehen, wie es der Entwurf vorsieht (der Kernschatten
löscht nur den Direktanteil, siehe §2 „Blutmond").

**Gegenrechnung der Fleckgröße.** Io steht 365 238 km über dem Auftreffpunkt
(aus `positionAt`), die Sonne hat von Jupiter aus den Winkelradius 0,00093619
rad. Kernschatten = 2 · 1821,6 km − 2 · 0,00093619 · 365 238 km = 2959 km,
Halbschattenrand = 3643 km + 684 km = 4327 km. Bildmaßstab 143,0 px / 69 911 km
= 0,002046 px/km, also 6,1 px Kernschatten und 8,9 px bis zum äußeren
Halbschattenrand; die Kugelfläche steht zur Sonne um 36,61° geneigt, was den
Fleck in einer Achse um 1/cos 36,61° = 1,246 streckt (11,0 × 8,9 px,
äquivalenter Durchmesser 9,9 px). Gemessen: umschließendes Rechteck 11 × 10 px,
äquivalenter Durchmesser 10,2 px bei Schwelle 30 und 11,8 px bei Schwelle 0.
Form, Größe und Ort stimmen damit im Rahmen eines Pixels mit der Geometrie
überein.

Im Bild ist der Fleck ein runder, dunkler Punkt mit weichem Rand auf dem
äquatorialen Wolkenband — der Halbschatten ist als Saum von rund einem Pixel
zu sehen, nicht als weichgezeichneter Rand über die halbe Fleckbreite.

### (2) Dieselbe Zeit in der Kinoszene `galileisches-schattenspiel`

| Größe | Wert |
|---|---:|
| Pixel mit Differenz > 30 im ganzen Bild | 32 |
| davon auf der Jupiterscheibe (Kreis um (640/400), r = 13 px) | **0** |
| davon auf der Saturnscheibe (Kreis um (1132,4/324), r = 10 px) | **32** |
| größte Differenz | 65 von 255 |
| Kontrolle: zwei Aufnahmen desselben Zustands | **0 abweichende Pixel** |

Auf Jupiter ist in dieser Szene kein einziges Pixel betroffen — wie vorgerechnet
(0,55 px Schattendurchmesser). Die 32 gezählten Pixel liegen sämtlich auf
Saturn, der im selben Bild am rechten Rand steht: Es ist der **Ringschatten**
auf der Saturnkugel, der dort als dunkles Band quer über die Scheibe läuft und
beim Ausschalten verschwindet. Die Ringtextur, die der Körper-Shader dafür
abtastet, ist dieselbe, die die Ringscheibe zeichnet (`RingViews.ringTextur`).

### Weitere Beobachtungen

- Die Browserkonsole meldet über den ganzen Prüflauf (Navigation, rund 60
  Zustandswechsel, 50 Aufnahmen) weder Fehler noch Warnungen — insbesondere
  keinen Übersetzungsfehler des in `MeshStandardMaterial` eingenähten
  Schattenbausteins.
- Der Schalter „Schatten" wirkt sofort im nächsten Bild und in beide
  Richtungen; die Aufnahme nach dem Wiedereinschalten stimmt Pixel für Pixel
  mit der Aufnahme davor überein (Kontrolle oben), das Material wird also nicht
  neu übersetzt und nichts anderes verändert.
- Neben dem Schattenwurf auf den Planeten zeigen die Suchschritte die
  Gegenrichtung: Bei jd 2451545,10 verdunkelt sich Io selbst, weil er im
  Kernschatten Jupiters steht.
