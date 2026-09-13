# Phase 3b-2 — Schatten: Abnahmeprotokoll

**Datum:** 13.09.2026
**Stand:** Zweig `schatten`, Task 3 (Körper-Shader, Okkluderauswahl je Bild,
erstes sichtbares Ergebnis) und Task 4 (Planetenschatten auf den Ringen,
Ringschatten auf Saturn, Bildrate). Die Rechnung selbst (`render/shadows.ts`)
und der Schalter `display.shadows` stammen aus Task 1 und 2.
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

| Differenz > | Pixel | größte Komponente | Schwerpunkt | Abstand von der Scheibenmitte |
|---:|---:|---|---:|---:|
| 0 | 24 241 | 24 171 (99,7 %) | (798,4 / 567,9) | 1,44 R |
| 10 | 16 494 | 10 256 (62,2 %) | (816,9 / 584,3) | 1,60 R |
| **20** | **9 958** | 8 771 (88,1 %) | (811,4 / 574,5) | 1,53 R |
| **30 (Kriterium)** | **0** | — | — | — |

Größte Differenz **27 von 255**. Der Schattensektor liegt als zusammenhängende
Fläche von rund 24 000 Pixeln auf dem Ring, von der Sonne abgewandt
(Schwerpunkt 1,5 Scheibenradien von der Mitte, in der sonnenabgewandten
Bildhälfte), mit weichem Rand zum beschienenen Ring hin. Helligkeit in den
Pixeln über 20: RGB (108,0 / 98,7 / 93,0) mit Schatten gegen (132,5 / 122,6 /
116,6) ohne — der Ring verliert im Schatten rund ein Fünftel seiner
Bildhelligkeit.

**Das Kriterium „Differenz > 30" ist nicht erfüllt, und das ist eine
rechnerische Folge des Entwurfs, kein Fehler der Umsetzung.** Der
Schattenfaktor sitzt laut Entwurf §2 nur auf `direkt`, nicht auf `uFuellung`
und nicht auf `streu`. Mit den gemessenen Szenenwerten ist

- `direkt` = |N·L| · uTag/π = sin 20,75° · 3,1416/π = **0,3543**
- `uFuellung` · uTag = 0,25 · 3,1416 = **0,7854**

Der Ring behält im vollen Kernschatten also 0,7854 von 1,1397, das sind
**68,9 %** seiner linearen Helligkeit. Nach ACES-Tonemapping und sRGB bleiben
davon bei einem Ringpixel um 130 rund 25 Stufen Unterschied übrig — gemessene
Obergrenze 27. Kein Blickwinkel ändert daran etwas (Gegenprobe (4) unten: auf
der **beschienenen** Ringseite sind es 28). Die Sonne steht bei J2000 nur
20,75° über der Ringebene; erst bei einer weit höheren Sonne (Maximum 2003:
rund 26°) oder einer kleineren Nachtseitenfüllung wächst der Direktanteil über
die Füllung hinaus.

Gegenprobe mit `nightFill` 0 (nur als Diagnose, sonst identischer Aufbau;
Kontrollaufnahme ebenfalls 0 abweichende Pixel):

| Größe | Ring (2) | Planet (1) |
|---|---:|---:|
| Pixel mit Differenz > 30 | **11 390** | 268 |
| größte Komponente | 9 560 (83,9 %) | 206 (76,9 %) |
| größte Differenz | **80 von 255** | 106 von 255 |
| Median der Helligkeit an / aus | 2,7 / 45,7 (**94 % dunkler**) | 7,7 / 51,3 |

Ohne Fülllicht löscht der Schatten den Ring im Kernschatten praktisch
vollständig (94 % dunkler). Die Rechnung im Shader nimmt also das gesamte
Direktlicht weg; das Kriterium scheitert allein an der Nachtseitenfüllung, die
der Entwurf bewusst stehen lässt.

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

### (4) Nahaufnahme der beschienenen Ringseite

Dieselbe Entfernung, Blickrichtung genau entgegengesetzt (Azimut +0,498746
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
in der Szene (27). Das bestätigt die Rechnung oben: Die Obergrenze kommt aus
dem Verhältnis von Direktlicht zu Nachtseitenfüllung, nicht aus dem
Blickwinkel.

### Bildrate

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
  Differenzbildpaar) brachte keine günstigere Stelle in der Szene: Die Kamera
  dreht dort nur 0,8°/s im Azimut, der Phasenwinkel bleibt über 140°. Bei
  `elapsedSec` 0 sind beide Werte am größten (Ring 27, Planet 50), bei 33 s am
  kleinsten (38 bzw. 15).
