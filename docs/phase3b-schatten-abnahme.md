# Phase 3b-2 — Schatten: Abnahmeprotokoll

**Datum:** 13.09.2026
**Stand:** Zweig `schatten`, Task 3 (Körper-Shader, Okkluderauswahl je Bild,
erstes sichtbares Ergebnis) und Task 4 (Planetenschatten auf den Ringen,
Ringschatten auf Saturn, Bildrate) und Task 6 (Kinoszene `mondfinsternis`,
Blutmond). Die Rechnung selbst (`render/shadows.ts`) und der Schalter
`display.shadows` stammen aus Task 1 und 2, die Finsternis-Suche
(`sim/finsternis.ts`) aus Task 5.
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

## Sichtprüfung Saturn: Ringschatten und Planetenschatten

Prüfumgebung wie oben; Zeit jd 2451545,0 (J2000) und angehalten, Kinoszene
`saturn-streiflicht` (Szenennummer 1, null-basiert gezählt), `running` aus,
`shuffle` aus, `elapsedSec` 0 s (von 35 s). Zwischen dem Setzen des Zustands
und der ersten Aufnahme 4 s für die Kameradämpfung und 8 s für den
Belichtungsmesser, nach jedem Umlegen des Schalters erneut 8 s.

### Aufbau und Geometrie der Szene

| Größe | Wert |
|---|---:|
| Kameraabstand | 5,36 dargestellte Saturnradien |
| Saturnscheibe im Bild (Mitte / Radius) | (640,0 / 400,0) / **160,0 px** |
| Ring im Bild (innen / außen) | 205,2 px / 375,9 px |
| `uPlanetOkkluder` (Mitte, Radius) | (−15339,0 / −2445,2 / −1514,0), **w = 2911,6** |
| dargestellter Saturnradius `pickRadiusUnits` | 2911,6 Render-Einheiten |
| `uSonnenWinkel` | 5,0701 · 10⁻⁴ rad |
| `uTag` / `uFuellung` | 3,1416 / 0,25 |
| Sonnenhöhe über der Ringebene (subsolare Breite) | **−20,75°** |
| Kamerahöhe über der Ringebene | +14,01° |
| Phasenwinkel (Sonne–Saturn–Kamera) | **142,68°** |

Die Szene heißt nicht umsonst „Streiflicht": Bei 142,68° Phasenwinkel blickt
die Kamera überwiegend auf die **Nachtseite** des Planeten — nur ein schmaler
Saum am linken Rand ist direkt beschienen (Gegenprobe: mit `nightFill` 0 ist
die Scheibe bis auf diese Sichel schwarz, siehe unten). Sonne und Kamera
stehen zudem auf **verschiedenen** Seiten der Ringebene (−20,75° gegen
+14,01°), die Kamera sieht also die unbeschienene Ringseite.

Die Trennung „auf dem Planeten" gegen „auf dem Ring" ist nicht der bloße Kreis
der Scheibe, sondern ein Strahlwurf aus den echten Szenendaten (Kamera im
Ursprung, 50° senkrechter Bildwinkel, Kugel aus `mesh.modelViewMatrix` und
`mesh.scale`, Ringebene aus der gedrehten Ringnormale und Innen-/Außenradius):
sichtbare Planetenfläche = Kugeltreffer ohne Ring davor (60 905 px), sichtbare
Ringfläche = Ringtreffer vor der Kugel oder neben ihr (101 864 px). Ohne diese
Trennung zählt der Ringbogen, der vor der Scheibe vorbeiläuft, als
„Planetenpixel", und die Randsichel des Ringschattens läge zur Hälfte
außerhalb des Kreises.

### (1) Ringschatten auf dem Planeten — in der Szene

| Differenz > | Pixel | größte Komponente | Schwerpunkt | Abstand von der Scheibenmitte |
|---:|---:|---|---:|---:|
| 0 | 776 | 774 (99,7 %) | (541,8 / 277,8) | 0,98 R |
| 10 | 354 | 354 (100 %) | (543,0 / 273,3) | 1,00 R |
| 20 | 143 | 128 (89,5 %) | (543,7 / 270,8) | 1,01 R |
| **30 (Kriterium)** | **47** | 40 (85,1 %) | (539,9 / 272,2) | 1,01 R |

Größte Differenz **50 von 255**. Helligkeit in den Pixeln über 20: RGB
(115,6 / 98,1 / 69,0) mit Schatten gegen (144,2 / 126,3 / 95,3) ohne.

**Das Kriterium „> 500 Pixel" ist hier nicht erfüllt, und zwar aus der
Geometrie der Szene heraus:** Ein Ringschatten kann nur dort messbar sein, wo
überhaupt Direktlicht liegt. Bei 142,68° Phasenwinkel ist das nur die
Randsichel — insgesamt rund 780 Pixel der 60 905 sichtbaren Planetenpixel.
Genau diese 776 Pixel weichen ab. Der Schatten ist also vollständig da, die
beschienene Fläche ist es nicht. Die Messung des Kriteriums steht deshalb in
der Nahaufnahme (3) weiter unten, nach dem Muster von Task 3 (dort war die
Kinoszene zu weit weg, hier steht sie zu weit in der Gegensonne).

### (2) Planetenschatten auf dem Ring — in der Szene

**Zweite Nachmessung vom 13.09.2026, Stand mit Restlicht.** Der Kernschatten
löscht das Direktlicht vollständig, von der Nachtseitenfüllung bleibt der
Anteil `RING_SCHATTEN_RESTLICHT` = 0,3 stehen (Planetenschein, Entwurf §2,
Absatz „Ring-Shader"): `ring.rgb * (direkt * f + uFuellung * uTag *
mix(uRestlicht, 1.0, f) + streu)`. Aufbau, Zeit und Einstellungen sind
unverändert (`nightFill` auf dem Standardwert 0,25, Stufe `high`, Scheibe
(640,0/400,0) r = 160,0 px, `uPlanetOkkluder` w = 2911,6, `uRestlicht` 0,3).

| Differenz > | Pixel | größte Komponente | Schwerpunkt | Abstand von der Scheibenmitte |
|---:|---:|---|---:|---:|
| 0 | 24 289 | 24 219 (99,7 %) | (798,2 / 567,8) | 1,44 R |
| 10 | 21 649 | 21 630 (99,9 %) | (807,1 / 574,6) | 1,51 R |
| 20 | **18 612** | 10 916 (58,7 %) | (815,4 / 580,3) | 1,57 R |
| **30 (Kriterium)** | **16 455** | 10 236 (62,2 %) | (817,0 / 584,3) | 1,60 R |
| 60 | 10 474 | 8 830 (84,3 %) | (812,5 / 576,4) | 1,54 R |

Größte Differenz **101 von 255**. Helligkeit in den Pixeln über 20: RGB
(36,0 / 31,9 / 29,5) mit Schatten gegen (100,8 / 93,4 / 90,3) ohne; Median der
Bildhelligkeit 92,7 → **28,0**, der Ring verliert im Kernschatten also rund
**70 %** seiner Bildhelligkeit und bleibt dabei als Ring sichtbar. Das
Kriterium („> 500 Pixel mit Differenz > 30") ist um den Faktor 33 erfüllt.

Im Bild liest sich der Schatten jetzt als **dunkelgrauer Sektor**, in dem die
Ringstruktur (B-Ring, Cassini-Teilung, A-Ring) weiterhin zu erkennen ist —
nicht als Loch. Hintergrundsterne scheinen nirgends durch. Die größte
zusammenhängende Komponente fasst bei Schwelle 30 nur 62,2 %, weil der Keil
über die Cassini-Teilung und die dünnen Innenringe läuft, wo kaum Licht
wegzunehmen ist; bei Schwelle 10 sind 99,9 % in einem Stück.

**Kontrolle, dass außerhalb des Schattens nichts kippt:** Das ganze
Differenzbild hat 25 065 abweichende Pixel in genau zwei nennenswerten
Zusammenhangskomponenten — dem Schattenkeil auf dem Ring (24 219 px) und der
unveränderten Ringschatten-Sichel auf dem Planeten (774 px, siehe (1)). Die
übrigen 72 Pixel sind 29 winzige Flecken mit einer größten Differenz von 3 von
255 an der Außenkante des A-Rings entlang des Keilrandes (Kantenglättung).
Kontrollaufnahme desselben Zustands: **0 abweichende Pixel**. Browserkonsole
nach dem Neuladen: 0 Fehler, 0 Warnungen.

Der Ringschatten auf dem Planeten (1) bleibt Zahl für Zahl unverändert —
`bodies.ts` ist von der Änderung nicht berührt.

#### Die beiden Stände davor (fürs Protokoll)

| Differenz > | Füllung unbeschattet (erster Stand) | Füllung voll beschattet (Zwischenstand) | **mit Restlicht 0,3 (jetzt)** |
|---:|---:|---:|---:|
| 0 | 24 241 | 24 292 | 24 289 |
| 10 | 16 494 | 22 064 | 21 649 |
| 20 | 9 958 | 19 524 | 18 612 |
| **30 (Kriterium)** | **0** | 16 979 | **16 455** |
| größte Differenz | 27 von 255 | 160 von 255 | 101 von 255 |
| Median an / aus | 107,0 / 132,7 | 1,7 / 90,3 | **28,0 / 92,7** |

- **Erster Stand** (`f` nur auf `direkt`): Der Schattenkeil lag vollständig
  und an der richtigen Stelle, blieb aber unter der Sichtbarkeitsschwelle der
  Abnahme. Ursache war rechnerisch gedeckelt: `direkt` = |N·L| · uTag/π =
  sin 20,75° · 3,1416/π = 0,3543 gegen `uFuellung` · uTag = 0,25 · 3,1416 =
  0,7854 — der Ring behielt 68,9 % seiner linearen Helligkeit, nach ACES und
  sRGB rund 25 von 255. Kein Blickwinkel änderte daran etwas (siehe (4)); eine
  Gegenprobe mit `nightFill` 0 ergab 11 390 Pixel über 30 und 94 %
  Helligkeitsverlust und belegte, dass die Shader-Rechnung das Direktlicht
  bereits vollständig wegnahm.
- **Zwischenstand** (`f` auch auf der Füllung, ohne Rest): Kriterium mit
  16 979 Pixeln erfüllt, aber der Sektor fiel auf einen Median von 1,7 von 255
  und sah wie ein **Loch im Ring** aus — durch die halbdurchsichtigen
  Ringbereiche (Alphakanal der Textur) schienen die Hintergrundsterne.
- **Jetziger Stand**: Restlicht 0,3 der Füllung. Der Schatten ist mit 101 von
  255 größter Differenz klar über dem Kriterium und bleibt im Bild ein Ring
  im Schatten statt einer Lücke. Begründung des Rests: Der verschattete Ring
  steht dicht neben Saturns beleuchteter Tagseite und wird von ihr angestrahlt
  (Planetenschein, wie das aschgraue Mondlicht); die Höhe des Rests ist ein
  Gestaltungswert des Auftraggebers.

### (3) Nahaufnahme der Tagseite — dieselbe Zeit, dieselbe Geometrie

Kamera `attached`, Ziel Saturn, Abstand 1,4558 · 10⁷ km = 5,0 dargestellte
Saturnradien, Azimut −2,642847 rad, Elevation +0,804344 rad. Die Richtung ist
nicht geraten, sondern aus der Szene gerechnet: Einheitsvektor von Saturn zur
Sonne plus 0,8 · Ringpol, normiert — damit steht die Kamera 25,48° **über**
der Ringebene (der Schatten fällt bei subsolarer Breite −20,75° auf die
Nordhalbkugel) und im Phasenwinkel 46,23°, also auf der Tagseite.

| Größe | Wert |
|---|---:|
| Saturnscheibe im Bild (Mitte / Radius) | (640,0 / 400,0) / 171,6 px |
| Pixel mit Differenz > 0 | 36 904 |
| davon > 10 | 32 244 |
| davon > 20 | 28 488 |
| **davon > 30 (Kriterium)** | **22 206** |
| davon > 60 | 10 778 |
| **größte Differenz** | **89 von 255** |
| größte Komponente bei Schwelle 30 | 14 203 (64,0 %) |
| größte Komponente bei Schwelle 60 | 10 321 (95,8 %) |
| Schwerpunkt | (636,0 / 391,7), 0,05 R von der Mitte |
| umschließendes Rechteck | x 476 … 774, y 278 … 464 |
| Median der Helligkeit an / aus | 115,3 / 175,0 (34 % dunkler) |
| Kontrolle: zwei Aufnahmen desselben Zustands | **0 abweichende Pixel** |
| Planetenschatten auf dem Ring in dieser Ansicht | 0 Pixel (er liegt hinter dem Planeten) |

Im Bild ist es das erwartete Bild: ein breites, dunkles Band quer über die
Nordhalbkugel, in Ringebene, mit der **Cassini-Teilung als hellem Streifen
mitten darin** — dort ist der Ring durchsichtig und lässt das Sonnenlicht
durch. Genau dieser helle Streifen ist auch der Grund, warum die größte
zusammenhängende Komponente bei Schwelle 30 nur 64 % der Pixel fasst: Der
Schatten ist echt zweigeteilt, nicht ausgefranst. Bei Schwelle 60 (nur die
beiden dichten Bänder B und A) liegen 95,8 % in einem Stück. Mit dem bloßen
Scheibenkreis statt der Strahlwurf-Maske gerechnet ändern sich die Zahlen
kaum (36 702 / 22 206 Pixel, größte Komponente 64,0 %).

### (4) Nahaufnahme der beschienenen Ringseite (vor der Entwurfsänderung)

Diese Messung stammt vom Stand **vor** der beschatteten Nachtseitenfüllung und
bleibt fürs Protokoll stehen; sie war der Beleg dafür, dass die damalige
Obergrenze von rund 27 Stufen nicht am Blickwinkel lag. Dieselbe Entfernung, Blickrichtung genau entgegengesetzt (Azimut +0,498746
rad, Elevation −0,804344 rad): Kamera 25,48° **unter** der Ringebene, also auf
der von der Sonne beschienenen Ringseite, Phasenwinkel 133,77°.

| Größe | Wert |
|---|---:|
| Pixel mit Differenz > 0 auf dem Ring | 63 935 (größte Komponente 63 460 = 99,3 %) |
| davon > 20 | 29 289 (größte Komponente 24 747 = 84,5 %) |
| **davon > 30** | **0** |
| größte Differenz | **28 von 255** |
| Median der Helligkeit an / aus | 101,0 / 127,0 |
| Ringschatten auf dem Planeten in dieser Ansicht | 0 Pixel (Nachtseite) |
| Kontrolle | **0 abweichende Pixel** |

Auf der beschienenen Ringseite ist der Schattensektor mit 64 000 Pixeln mehr
als doppelt so groß wie in der Szene und im Bild sofort als dunkler Keil zu
sehen — die größte Einzeldifferenz bleibt mit 28 aber praktisch dieselbe wie
in der Szene (27). Das bestätigte die Rechnung in (2): Die damalige Obergrenze
kam aus dem Verhältnis von Direktlicht zu Nachtseitenfüllung, nicht aus dem
Blickwinkel — und war damit nur durch eine Entwurfsänderung zu heben, nicht
durch eine andere Kameraführung.

### Bildrate

**Messzeitpunkt:** Diese Tabelle ist **vor** den beiden Ring-Shader-Änderungen
entstanden (beschattetes Ring-Fülllicht, Restlicht 0,3 — Abschnitt (2)). Sie
wurde danach **bewusst nicht wiederholt**: Beide Änderungen fügen dem
Fragment-Shader zusammen ein einziges `mix` hinzu (`uFuellung * uTag *
mix(uRestlicht, 1.0, f)` statt `uFuellung * uTag`); der Schattenfaktor `f`
wurde ohnehin schon je Fragment gerechnet. Eine messbare Verschiebung wäre bei
einem Bildaufbau, der ohnehin in die Vertikalsynchronisation läuft (siehe
Einschränkung unten), nicht zu erwarten und auch nicht auflösbar.

Szene `saturn-streiflicht`, Aufbau wie oben, Framezeiten aus
`requestAnimationFrame` über je 5 s (300 Bilder), drei Runden im Wechsel,
jeweils 3 s Vorlauf nach dem Umlegen des Schalters:

| Runde | Median an | Median aus | Unterschied |
|---|---:|---:|---:|
| 1 | 16,700 ms | 16,700 ms | **0,000 ms** |
| 2 | 16,700 ms | 16,700 ms | **0,000 ms** |
| 3 | 16,700 ms | 16,700 ms | **0,000 ms** |

Mittelwerte 16,680 / 16,680 / 16,681 ms mit Schatten gegen 16,680 / 16,681 /
16,681 ms ohne; p10 und p90 in allen sechs Messungen zwischen 16,5 und
16,8 ms. Kriterium „Unterschied unter 1 ms" erfüllt.

Einschränkung, damit die Zahl nicht mehr behauptet, als sie zeigt: Der
Bildaufbau läuft in die Vertikalsynchronisation (60 Hz, 16,67 ms) und lastet
die RTX 4060 in dieser Szene nicht aus — gemessen ist damit „der Schatten
kostet nicht so viel, dass 60 Hz fallen", nicht die reine Schattenzeit auf der
GPU.

### Weitere Beobachtungen

- Die Browserkonsole meldet über den ganzen Prüflauf nach dem Neuladen (rund
  40 Zustandswechsel, 12 Aufnahmen, drei Bildratenmessungen) weder Fehler noch
  Warnungen — der Ring-Fragment-Shader mit den eingesetzten
  `SCHATTEN_GLSL_FUNKTIONEN` übersetzt sauber.
- Der Schalter „Schatten" wirkt im nächsten Bild; die Aufnahme nach dem
  Wiedereinschalten stimmt an allen vier Messstellen Pixel für Pixel mit der
  Aufnahme davor überein (Kontrolle je 0 abweichende Pixel). `uPlanetOkkluder.w
  = 0` schaltet den Planetenschatten also ab, ohne das Material neu zu
  übersetzen.
- Beide Schattenwürfe stehen im selben Bild und stören sich nicht: der
  Ringschatten auf der Kugel (aus `bodies.ts`, Task 3) und der Planetenschatten
  auf dem Ring (aus `rings.ts`, Task 4).
- Eine Suche über `elapsedSec` (0 bis 33 s in Schritten von 3 s, je ein
  Differenzbildpaar, noch vor der Entwurfsänderung) brachte keine günstigere
  Stelle in der Szene: Die Kamera dreht dort nur 0,8°/s im Azimut, der
  Phasenwinkel bleibt über 140°. Bei `elapsedSec` 0 war die größte Differenz
  am höchsten (auf der Scheibe 24, außerhalb 50) und fiel bis `elapsedSec`
  33 s auf 15 bzw. 38. Deshalb ist `elapsedSec` 0 die Messstelle.
- Nach den beiden Entwurfsänderungen (beschattete Nachtseitenfüllung mit
  Restlicht 0,3, Abschnitt (2)) erfüllt die Szene selbst das Kriterium für den
  Planetenschatten mit 16 455 Pixeln über 30 und einer größten Differenz von
  101. Für den Ringschatten auf dem Planeten bleibt es bei der Nahaufnahme
  (3): Dort liegt keine Rechenfrage vor, sondern schlicht die Nachtseite im
  Bild.

### Abgrenzung

`RING_SCHATTEN_RESTLICHT` = 0,3 gilt im Shader genauso für die Uranusringe
(derselbe Uniform, keine Fallunterscheidung nach Körper), wurde aber nur an
Saturn gemessen — für Uranus liegt keine eigene Sichtprüfung dieses Werts vor.

## Sichtprüfung Mondfinsternis (Blutmond)

**Stand:** Task 6 (Kinoszene `mondfinsternis`, Bahntyp `sichtlinie`,
Zeitsprung). Prüfumgebung wie oben: Windows 11, Desktop mit RTX 4060, Chromium
(Playwright), Vite-Entwicklungsserver, Fenster 1280 × 800 CSS-Pixel,
`devicePixelRatio` 1, Qualitätsstufe `high`, Preset „Schaubild", Zeit
angehalten, Bedienoberfläche ausgeblendet, Bahnlinien/Beschriftungen/Marker
aus. Zwischen Zustandswechsel und erster Aufnahme 12 s (4 s Kameradämpfung,
8 s Belichtungsmesser), nach jedem Umlegen des Schalters erneut 8 s.
Differenzbild wie immer `display.shadows` an gegen aus.

### Die Finsternis, auf die die Szene springt

Gefunden von `naechsteMondfinsternis(bodyIndex, 2451545)` (J2000), Werte aus
einem `vitest`-Lauf gegen dieselbe Funktion, die auch das Kino ruft:

| Größe | jd | UT |
|---|---:|---|
| Eintritt in den Kernschatten | 2451564,554560101 | 21.01.2000 01:18:34 |
| **Maximum** | **2451564,6260017515** | **21.01.2000 03:01:27** |
| Austritt | 2451564,6973823668 | 21.01.2000 04:44:14 |
| Zielwert des Zeitsprungs (`eintritt − 0,1 · Dauer`) | 2451564,5402778746 | 21.01.2000 00:58:00 |
| Art | `total` | Dauer des Durchgangs 0,142822 d = 3,4277 h |

Das ist die Finsternis vom 21.01.2000 des NASA-Kanons (Maximum dort 04:44 UT);
das Modell liegt rund 1,7 h früher — innerhalb der ±4 h, die `sim/finsternis.ts`
für die fehlenden periodischen Störungen der Mondbahn ansetzt. Dass der vom
Modell gerechnete Austritt auf die Minute mit dem Kanon-Maximum zusammenfällt,
ist Zufall und kein Beleg.

**Rechenweg Kernschattenradius** (zum Maximum, unabhängig vom Renderer aus
`positionAt` nachgerechnet): Erde–Mond |m| = 366 783,3 km, Erde–Sonne |s| =
147 209 486,8 km. Schattenkegel: asin((R☉ − R⊕) / |s|) = asin((695 700 −
6371) / 147 209 487) = 0,00468266 rad. Kernschattenradius in Mondentfernung
r_u = 1,02 · (6371 − 366 783,3 · tan 0,00468266) = 1,02 · (6371 − 1717,6) =
**4746,5 km** (die 2 % sind Chauvenets Atmosphärenzuschlag). Querablage der
Mondmitte θ · |m| = **2082,5 km**. Wegen 2082,5 < 4746,5 − 1737,4 = 3009,1 ist
die Finsternis **total** — die Mondscheibe steht mit 926,6 km Abstand
(Mondrand → Kernschattenrand) vollständig im Kernschatten.

### Aufbau

| Größe | Wert |
|---|---|
| Kameramodus | `cinema`, Szenennummer **18** (`mondfinsternis`, null-basiert), `shuffle` aus, `seed` 1 |
| Weg in die Szene | `nummer` 17 mit `elapsedSec` 31 s (über der 30-s-Dauer von `ceres-guertel`), `running` an, **ein Bild** laufen lassen — `tickCinema` schaltet weiter und springt |
| `time.jd` nach diesem Bild | **2451564,540444255** (Zielwert 2451564,5402778746 plus 1,03 s Szenenzeit im Zeitraffer) |
| danach | `running` aus, `time.paused` an, `time.jd` auf den Messzeitpunkt gesetzt |
| `cinema.elapsedSec` | 1,033 s (von 45 s) |
| Mondscheibe im Bild (Mitte / Radius) | **(640,0 / 400,0) / 173,52 px** |
| Kameraabstand | 429,45 Render-Einheiten = **4,94 dargestellte Mondradien** (4 × Streufaktor 1,235) |
| Erde im Bild | (18,2 / 387,3), 13,3 px Radius — die Kamera steht auf der Linie zum Mond, um Azimut- und Elevationsversatz der Szene gekippt, die Erde liegt dadurch am linken Bildrand |

Der Zeitsprung ist damit **im laufenden Programm** belegt, nicht nur im Test:
`time.jd` steht nach genau einem Bild 19,54 Tage weiter als der Startwert
2451545. Die Mondscheibe im Bild ist aus `mesh.modelViewMatrix` und `mesh.scale`
projiziert (senkrechter Bildwinkel 50°), wie in den Abschnitten oben.

### (1) Zum Maximum — Blutmond

Zeit jd 2451564,6260017515 (21.01.2000 03:01:27 UT), gemessen auf der
Mondscheibe (94 597 Pixel).

| Größe | Schatten an | Schatten aus |
|---|---:|---:|
| Median max(R,G,B) | **24** | **86** |
| Median Luma (Rec. 709) | 9,47 | 83,49 |
| Median Leuchtdichte (linear, sRGB dekodiert) | 0,003266 | 0,08759 |
| Mittel R / G / B auf der Scheibe | **22,07 / 5,59 / 1,15** | 82,85 / 80,49 / 79,79 |

| Kriterium | Wert | Ergebnis |
|---|---:|---|
| Helligkeitsverlust im Median, als max(R,G,B) — Kriterium > 80 % | **72,09 %** | **erfüllt (88,66 % als Luma)** |
| … dasselbe als Luma (Rec. 709) | 88,66 % | erfüllt |
| … dasselbe als lineare Leuchtdichte | 96,27 % | erfüllt |
| Rot dominiert: R > 2 · B im Mittel der Scheibe | **R/B = 19,26** | erfüllt, Faktor 9,6 über der Schranke |
| Pixel mit Differenz > 30 auf der Scheibe | 94 542 von 94 597 (99,94 %) | — |
| größte Differenz | 146 von 255 | — |
| Kontrolle: zwei Aufnahmen desselben Zustands | **0 abweichende Pixel** | erfüllt |

**Befund zum 80-%-Kriterium.** Der Verlust liegt je nach Helligkeitsbegriff bei
72 %, 89 % oder 96 % — der Unterschied ist kein Messfehler, sondern folgt
direkt aus dem Entwurf. §2 „Blutmond" legt fest: Der Kernschatten **ändert
keine Helligkeit, nur die Farbe** des Nachtseiten-Fülllichts (`emissive ·
mix(1, farbe, 1 − f)`). Die Kernschattenfarbe der Erde ist linear (1,00 /
0,32 / 0,11): Der **Rotkanal wird also gar nicht gedämpft**, er behält die
volle Nachtseitenfüllung. `max(R,G,B)` ist auf der verfinsterten Scheibe
durchweg genau dieser ungedämpfte Rotkanal und kann deshalb
konstruktionsbedingt nicht um mehr als den Direktlichtanteil fallen. Sobald die
Messung Grün und Blau mitzählt (Luma) oder in linearem Licht rechnet, liegt der
Verlust klar über der Schranke. Es ist also ein Widerspruch zwischen zwei
Festlegungen desselben Entwurfs (§2 gegen das Messverfahren in §6), nicht ein
zu schwacher Schatten. **Nichts wurde nachgestellt, um die Zahl zu heben** —
weder Nachtseitenfüllung noch Kernschattenfarbe noch eine Schwelle. Helligkeit
wird als Luma gemessen (Spec §6, Entscheidung vom 13.09.2026), weil das
Kanalmaximum dem Blutmond-Entwurf widerspricht.

Im Bild ist es unmissverständlich ein **Blutmond**: eine vollständig
ziegelrote Scheibe, auf der Mare und Krater als dunklere Flecken weiterhin zu
erkennen sind; mit ausgeschaltetem Schalter steht an derselben Stelle ein
heller grauer Vollmond. Der Verlauf über die Scheibe ist glatt, es gibt keine
Kante quer durch sie hindurch.

### (2) Ein Viertel nach dem Eintritt — Halbschattenrand

Zeit jd 2451564,5902656675 = `eintritt + 0,25 · (austritt − eintritt)`
(21.01.2000 02:09:59 UT). Geometrie dort: Querablage 3710,5 km,
Kernschattenradius 4747,0 km, Mondradius 1737,4 km — wegen 3710,5 <
4747,0 + 1737,4, aber > 4747,0 − 1737,4 steht der Mond **teilweise** im
Kernschatten: Ein 701 km breiter Streifen des Randes (40 % des Mondradius)
liegt außerhalb und ist im Bild als hellerer Saum unten rechts zu sehen.

| Größe | Wert |
|---|---:|
| Differenz auf der Scheibe: Median / Maximum / Minimum | 79 / 147 / 28 |
| **größter Sprung benachbarter Pixel längs der Mittelzeile (y = 400) — Kriterium ≤ 40** | **29** |
| größter Sprung benachbarter Pixel über alle Zeilen der Scheibe | 55 |
| davon Paare über 40 | 49 von 94 250 (0,05 %) |
| an genau diesen 49 Stellen der Albedo-Sprung im Bild **ohne** Schatten | Median 46, Mittel 47,7, **Minimum 43** |
| Sprung des reinen Schattenfaktors (Luma-Verhältnis an/aus, texturfrei), in Einheiten von 255 | **max 22,8**, Mittel 1,90 |

Das Kriterium ist erfüllt, und zwar auch dort, wo die rohe Zahl zunächst
darüber liegt: Die 49 Pixelpaare mit einem Sprung über 40 sitzen **nicht** am
Schattenrand, sondern verstreut im Scheibeninneren (22 … 127 px vom
Mittelpunkt) — an jeder dieser Stellen springt schon das Bild **ohne** Schatten
um mindestens 43 Stufen: Es sind Kraterränder und Marekanten der Albedotextur.
Die Differenz zweier Bilder ist proportional zur örtlichen Albedo, eine harte
Texturkante erzeugt also auch bei völlig glattem Schattenverlauf eine harte
Kante im Differenzbild. Der Schatten selbst, texturfrei als Verhältnis der
Luma gemessen, springt nirgends um mehr als 22,8 von 255 — der Halbschatten ist
ein stetiger Übergang.

### (3) Datumsfeld — das Kriterium aus Phase 3

Das Datumsfeld (`ui/panels/TimePanel.tsx`) setzt `dateToJd(Date.UTC(2000, 0,
21))` = **jd 2451564,5**, also 00:00 UT; eine Uhrzeit-Eingabe gibt es nicht,
die Tageszeit stellt der Nutzer über den Zeitregler ein. Beide Schritte
nachgestellt:

| Zeitpunkt | jd | Querablage | r_u | Lage |
|---|---:|---:|---:|---|
| Datumsfeld allein (00:00 UT) | 2451564,5 | 11 031,4 km | 4748,1 km | außerhalb (nicht einmal partiell) |
| Datumsfeld + Zeitregler auf 03:00 UT | **2451564,625** | 2084,2 km | 4746,5 km | **total** (2662,4 km Abstand Mondmitte → Kernschattenrand; Mondrand: 925 km) |

Aufnahme bei jd 2451564,625 (voller Kalendertag plus 3 h, kein Wert aus der
Suche): Median max(R,G,B) **24** mit Schatten gegen **86** ohne (72,09 %),
Mittel R/G/B **22,07 / 5,59 / 1,15**, **R/B = 19,26**, 94 541 von 94 597
Scheibenpixeln mit Differenz über 30, größte Differenz 146. Das Bild zeigt
denselben Blutmond wie zum Maximum — die Finsternis lässt sich also über
Datumsfeld und Zeitregler nachstellen, ohne die Kinoszene zu benutzen.

### Weitere Beobachtungen

- Die Browserkonsole meldet über den ganzen Prüflauf ab dem Seitenaufruf (rund
  20 Zustandswechsel, 7 Aufnahmen) **0 Fehler und 0 Warnungen**.
- Der Schalter wirkt in beide Richtungen: Die Aufnahme nach dem
  Wiedereinschalten stimmt Pixel für Pixel mit der Aufnahme davor überein
  (Kontrolle in (1): 0 abweichende Pixel).
- Der Zeitsprung bleibt nach dem Tick stehen und läuft nur mit dem Zeitraffer
  der Szene weiter (0,0035 d/s) — wie in §4 vorgesehen.
- Die Belichtung kompensiert den Schatten **nicht**: `render/lighting.ts`
  belichtet auf den Kamerazielkörper aus dessen Sonnenabstand, der Schatten ist
  eine reine Shader-Multiplikation und für den Belichtungsmesser unsichtbar
  (`renderer.toneMappingExposure` steht in beiden Zuständen auf 1,0). Der
  gemessene Unterschied ist also der Schatten selbst, nicht eine nachgeführte
  Blende.
