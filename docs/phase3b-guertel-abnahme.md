# Phase 3b-1 — Gürtel: Abnahmeprotokoll

**Datum:** 13.09.2026
**Stand:** Zweig `guertel`, Task 2 (Punktwolke im Renderer, Schalter,
Sichtprüfung Hauptgürtel) und Task 3 (Sichtprüfung Kuipergürtel); der
Abschnitt „Sichtprüfung Kuipergürtel" wurde nach dem Gesamtreview am
13.09.2026 mit berichtigtem Messverfahren neu aufgenommen (siehe dort).
Nachtrag vom 13.09.2026: Kuipergürtel-Albedo auf 0,12 angehoben und
nachgemessen (Abschnitt „(4) Nachmessung" der Sichtprüfung Kuipergürtel).
**Prüfumgebung:** Windows 11, Desktop mit RTX 4060, Chromium (Playwright),
Vite-Entwicklungsserver auf `localhost`, Fenster 1280 × 800 CSS-Pixel,
`devicePixelRatio` 1, Qualitätsstufe `high` (50 000 Teilchen je Gürtel),
Maßstabs-Preset „Schaubild" (`distanceExponent` 0,6), Zeit angehalten bei
J2000 bzw. bei der angegebenen Kinolaufzeit.

## Sichtprüfung Hauptgürtel

### Aufbau

| Größe | Systemschau | Kinoszene `ceres-guertel` |
|---|---|---|
| Kameramodus | `free`, Ziel Sonne, Azimut 0,6, Elevation 1,5 rad (86°) | `cinema`, Szenennummer 17, `shuffle` aus |
| `camera.distance` | 9,62 · 10⁸ km | von der Szene gesetzt (6 Ceres-Radien) |
| Kameraposition (heliozentrisch, komprimiert) | (0,3754 / 0,2568 / 6,4144) AE | (−1,6139 / 0,6021 / 0,3168) AE |
| Bildfeld in der Ekliptik | rund 6 AE senkrecht (bei 4 AE schneidet der Gürtel den Bildrand: k = 0,6 bildet 2,1 … 3,3 AE auf 1,55 … 2,06 AE ab, der Ring hat also gut 4 AE Durchmesser) | — |
| `cinema.elapsedSec` | — | 3,003 s |
| Zeit | jd 2451545,0 (J2000), angehalten | jd 2451545,1666 (uTage 0,1666), angehalten |
| `uTag` des Hauptgürtels | 1,7311 | 2,4176 |
| Bedienoberfläche | ausgeblendet (`ui.hidden`) | ausgeblendet |
| Bahnlinien / Beschriftungen / Marker | aus (nur für die Messung) | wie in der Szene |

Der unterschiedliche `uTag` ist die Zielbelichtung (render/exposure.ts): In der
Systemschau belichtet die Kamera auf die Sonne, im Kino auf Ceres bei 2,77 AE.

### (1) Helligkeit und Anzahl der Teilchenpixel

Gemessen als Differenz zweier sonst identischer Bilder (`display.belts` an
gegen aus) — so bleiben Sterne, Sonnenschein und Ceres selbst außen vor und
gezählt werden ausschließlich Pixel, die der Gürtel beiträgt.

| Größe | Systemschau | Kinoszene `ceres-guertel` |
|---|---:|---:|
| Pixel, die der Gürtel aufhellt | 30 921 | 4 190 |
| davon > 20 von 255 | 20 230 | 362 |
| davon > 30 | 15 309 | 298 |
| davon > 40 (Kriterium) | 0 | **233** |
| hellstes Gürtelpixel | 36 | **47** |

Das Kriterium „Anzahl heller Pixel (> 40) im Gürtelring ≫ 0" ist in der
Kinoszene `ceres-guertel` erfüllt (233 Pixel, Spitzenwert 47 von 255) — das
ist die Szene, an der der Entwurf die Albedo festmacht. Eine Anhebung der
Albedo über 0,06 hinaus ist damit **nicht** nötig.

In der Systemschau bleibt das hellste Gürtelpixel mit 36 von 255 knapp unter
der Schwelle, weil die Kamera dort auf die Sonne belichtet (`uTag` 1,73 statt
2,42) — sichtbar ist der Gürtel trotzdem zweifelsfrei: gut 30 000 aufgehellte
Pixel bilden im Bild einen geschlossenen Staubring (siehe Radialprofil unten,
Dichte über 20 % der Ringfläche im Kern des Gürtels). Rechenweg des
Spitzenwerts: 0,06 · 1,7311 / π = 0,0331 linear, nach ACES-Tonemapping und
sRGB 34 von 255 auf schwarzem Untergrund, 36 im Höchstfall über einem
schwachen Untergrund (Rechenweg unten).

### Rechenweg vom linearen Wert zum Pixelwert

Alle Herleitungen unten benutzen dieselbe Kette. Sie ist die des Renderers:
der Gürtel-Fragmentshader schreibt den linearen Grauwert
`L = Albedo · uTag / π` (belts.ts, `beltHelligkeit`), die Zwischenziele der
Nachbearbeitung sind linear, und erst der `OutputPass` (postfx.ts) wendet das
Tonemapping des Renderers und die sRGB-Ausgabe an. Das Tonemapping ist
`ACESFilmicToneMapping` von three mit `toneMappingExposure` = 1:

```
c = L · toneMappingExposure / 0,6
y = RRTAndODTFit(c) = (c·(c + 0,0245786) − 0,000090537)
                      / (c·(0,983729·c + 0,432951) + 0,238081)
Pixel = 255 · sRGB(y),  sRGB(y) = 1,055·y^(1/2,4) − 0,055 (y > 0,0031308)
```

Die ACES-Matrizen lassen Grau unverändert (jede Zeilensumme ist eins) und
entfallen deshalb in der Rechnung. Der Vergleichswert der Messung ist der
**Zuwachs** eines Pixels zwischen „Gürtel an" und „Gürtel aus". Auf
schwarzem Untergrund ist er `255·sRGB(RRTAndODTFit(L/0,6))`; über einem
schwach beleuchteten Untergrund `b` ist er
`255·(sRGB(RRT((L+b)/0,6)) − sRGB(RRT(b/0,6)))` und kann dort etwas **größer**
ausfallen, weil die Kette im Fußpunkt konvex ist (die ACES-Zehe schneidet
kleine Werte weg, die sRGB-Kennlinie hebt sie danach steil an). Für
0,06 · 1,7311 / π liegt dieses Maximum bei 36,6 — daher die gemessenen 36.

### (2) Radialprofil — die Kirkwood-Lücken sind im Bild nicht messbar

Jedes Bildpixel wurde als Sehstrahl in die Ekliptik zurückgerechnet (Kamera
in AE, Blick auf den Ursprung, FOV 50° senkrecht) und der dargestellte Radius
mit r = r_dargestellt^(1/0,6) in echte AE zurückgerechnet; gezählt wurden
Ringe von 0,02 AE, normiert auf die Pixelzahl je Ring.

| Lage | Dichte im Ring | Mittel der Nachbarringe (± 3–4 Ringe) | Verhältnis | Kriterium |
|---|---:|---:|---:|---|
| 2,50 AE (3:1) | 21,46 % | 22,16 % | **0,97** | < 0,40 — **nicht erfüllt** |
| 3,28 AE (2:1) | 9,07 % | 8,56 % | **1,06** | < 0,40 — **nicht erfüllt** |

Das Profil selbst ist glatt und glockenförmig: 1,5 % bei 1,80 AE, Anstieg auf
24,0 % bei 2,70 AE, Abfall auf 1,0 % bei 3,76 AE. Kein einziger Einbruch.

**Das ist kein Umsetzungsfehler, sondern der Unterschied zwischen der großen
Halbachse und dem Momentanabstand.** Die Kirkwood-Lücken sind Lücken in *a*
mit einer Halbwertsbreite von 0,017 bis 0,033 AE. Die Exzentrizität der
Teilchen ist Rayleigh-verteilt mit σ = 0,10 (mittleres e ≈ 0,125, Entwurf
Abschnitt 3.1); ein Teilchen mit a = 2,50 AE pendelt damit im Mittel zwischen
2,19 und 2,81 AE. Der Momentanabstand ist also mit einem Kern von rund
± 0,3 AE Breite verschmiert — dem Zehn- bis Zwanzigfachen der Lückenbreite.

Nachgerechnet vor der Messung (Monte-Carlo mit denselben Verteilungen,
200 000 Teilchen, Ringe von 0,02 AE):

| Verteilung | Verhältnis bei 2,50 AE | bei 3,28 AE |
|---|---:|---:|
| große Halbachse a | 0,37 | 0,43 |
| Momentanabstand r | 0,98 | 1,02 |

Die Lücken sind also in den erzeugten Bahnelementen vorhanden — genau das
prüft `sim/belts.test.ts` bereits („zeigt die Kirkwood-Lücke bei 3:1", weniger
als 25 % der Nachbarschaft) — sie können aber in keinem Standbild einer
Momentanverteilung erscheinen, gleich wie sorgfältig gemessen wird. Sichtbar
würden sie nur, wenn der Gürtel mit stark verkleinerter Exzentrizität
gezeichnet würde (physikalisch falsch) oder wenn statt der Teilchen ihre
Bahnen als Linienschar dargestellt würden. Vorschlag zur Entscheidung durch
den Auftraggeber: Das Kriterium auf die Verteilung der großen Halbachse
beziehen (dort erfüllt) und die Bildprüfung auf „geschlossener Ring, weiche
Ränder, Dichtemaximum bei 2,6 bis 2,8 AE" umstellen — alle drei sind gemessen
und erfüllt.

### (3) Bildrate bei 50 000 Teilchen

Median der Framezeit über 3 s, mit `performance.now()` im Browser gemessen
(je 180 Bilder), Systemschau, Stufe `high`, beide Gürtel sichtbar (also
100 000 Teilchen in zwei Draw-Calls):

| Zustand | Median | 90 % | Maximum |
|---|---:|---:|---:|
| Gürtel an | **16,70 ms** | 17,20 ms | 18,30 ms |
| Gürtel aus | 16,70 ms | 17,30 ms | 18,40 ms |

Kriterium (unter 20 ms) erfüllt. Beide Messungen liegen auf der
Bildwiederholrate des Monitors (60 Hz, 16,67 ms) — die Gürtel kosten also
keine messbare Zeit; der Median ist eine obere Schranke, kein Kostenwert.

### Weitere Beobachtungen

- Ein Wechsel der Qualitätsstufe im laufenden Bild baut die Attribute neu auf:
  `medium` → 10 000, `low` → 0 (beide Wolken unsichtbar), `high` → 50 000
  Teilchen je Wolke, ohne Fehler in der Konsole.
- Der Schalter „Gürtel" im Anzeigepanel blendet beide Wolken sofort aus und
  wieder ein.
- Die Browserkonsole meldet über den ganzen Prüflauf weder Fehler noch
  Warnungen (insbesondere keinen Shader-Übersetzungsfehler).
- Der Kuipergürtel wird technisch mit angelegt (`uTag` 0,3289 in der
  Systemschau), ist aber erst in Task 3 Gegenstand der Sichtprüfung.

## Sichtprüfung Kuipergürtel

Aufgenommen am 13.09.2026 in derselben Prüfumgebung (Windows 11, RTX 4060,
Chromium, 1280 × 800 CSS-Pixel, `devicePixelRatio` 1, Stufe `high` mit
50 000 Teilchen je Gürtel).

> **Neu aufgenommen nach dem Gesamtreview (13.09.2026).** Die erste Fassung
> dieses Abschnitts nannte Teilchenwerte (44 bzw. 14 von 255), die über dem
> lagen, was die Tonwertkurve aus dem protokollierten `uTag` hergibt (22 bzw.
> 4). Ursache war das Messverfahren, nicht der Renderer: Um allein die
> Kuiper-Wolke zu zählen, war ihre Sichtbarkeit im laufenden Bild über einen
> `visible`-Getter erzwungen worden. Damit lief aber auch
> `verdunkleSzeneAusserBloom` (postfx.ts) ins Leere, das durchsichtige
> Objekte vor dem Bloom-Durchgang ausblendet — die Wolke geriet in den
> Bloom-Quellframe und bekam ihren eigenen Lichtkranz oben drauf. Die
> Messung unten benutzt stattdessen den echten Schalter `display.belts` und
> legt den Hauptgürtel über `setDrawRange(0, 0)` still; sie greift damit
> nirgends in die Sichtbarkeitslogik ein. Messung und Rechnung stimmen nun
> überein. Die Zahlen der Sichtprüfung Hauptgürtel (Task 2) sind davon nicht
> berührt: Dort wurde von Anfang an nur `display.belts` geschaltet.
>
> Zusätzlich war der Systemschau-`uTag` mit 0,3360 protokolliert worden,
> bevor der Belichtungsmesser (`render/exposure.ts`, Zeitkonstante 1 s)
> eingeschwungen war; der konvergierte Wert ist 0,3289. Für diese Aufnahme
> wurde `uTag` im angehaltenen Zustand so lange mehrfach gelesen, bis er sich
> über mehrere Sekunden nicht mehr änderte, und erst dann ausgelöst.

### Aufbau

| Größe | Kinoszene `pluto-charon` | Systemschau bei `kompakt` |
|---|---|---|
| Kameramodus | `cinema`, Szenennummer 9 (`SCENES.indexOf('pluto-charon')`), `shuffle` aus, `seed` 20260912 | `free`, Ziel Sonne, Azimut 0,6, Elevation 1,5 rad (85,9°) |
| Maßstabs-Preset | „Schaubild" (`distanceExponent` 0,6) | **„kompakt" (`distanceExponent` 0,4)** |
| `camera.distance` | von der Szene gesetzt (55 Plutoradien) | 1,7952 · 10⁹ km = 12,0 AE |
| Kameraposition (heliozentrisch, komprimiert) | (−2,5330 / −7,1237 / 1,5068) AE | (0,7005 / 0,4791 / 11,9697) AE |
| Bildfeld in der Ekliptik | — | 11,2 AE senkrecht (2 · 12 · tan 25°); der Gürtel hat dargestellt 9,45 AE Durchmesser und liegt vollständig im Bild |
| `cinema.elapsedSec` | 8,0065 s (von 45 s Szenendauer) | — |
| Zeit | jd 2451547,40195 (`uTage` 2,40195), angehalten | jd 2451545,0 (J2000, `uTage` 0), angehalten |
| `uTag` des Kuipergürtels | **1,1217** | **0,3289** |
| `uTag` des Hauptgürtels (nachrichtlich) | 5,9037 | 1,7311 |
| Bedienoberfläche | ausgeblendet (`ui.hidden`) | ausgeblendet |
| Bahnlinien / Beschriftungen / Marker | aus (nur für die Messung) | aus |

Der `uTag`-Unterschied ist wieder die Zielbelichtung (render/exposure.ts): Im
Kino belichtet die Kamera auf Pluto bei rund 30,4 AE, in der Systemschau auf
die Sonne. Der Kuipergürtel ist deshalb in der Pluto-Szene rund dreimal
heller als in der Systemschau.

Dargestellte Lage bei `kompakt` (r' = r^0,4): Der klassische Gürtel 39 … 48 AE
liegt bei 4,329 … 4,704 AE, mit den weichen Rändern der Verteilung
(38,5 … 48,5 AE, sim/belts.ts) bei 4,307 … 4,724 AE — Durchmesser 9,45 AE.
Das ausgewertete Band unten ist mit 4,28 … 4,74 AE geringfügig weiter gefasst.
Pluto steht zur Epoche bei 30,09 AE echt (aus der Kameraposition der Szene
zurückgerechnet), also bei 3,90 AE dargestellt — innerhalb des Rings, wie es
seiner Nähe zum Perihel (1989) entspricht.

### (1) Helligkeit und Anzahl der Teilchenpixel

Wieder als Differenz zweier sonst identischer Bilder, geschaltet über
`display.belts`. Damit **nur** der Kuipergürtel gezählt wird, ist die
Hauptgürtel-Wolke über `geometry.setDrawRange(0, 0)` stillgelegt — sie zeichnet
dann in keinem der beiden Durchgänge, ohne dass in die Sichtbarkeitslogik
eingegriffen würde. Kontrollmessung: zwei Aufnahmen desselben Zustands
unterscheiden sich in keinem einzigen Pixel, das Verfahren hat also kein
Rauschen.

| Größe | Kino `pluto-charon` | Systemschau `kompakt` |
|---|---:|---:|
| Pixel, die der Kuipergürtel aufhellt | 1 816 | 22 305 |
| Zuwachs je Teilchenpixel (p50 / p90) | 19 / 22 | 4 / 4 |
| größter Zuwachs = Helligkeit eines freistehenden Teilchens | **22** | 4 |
| davon Zuwachs > 10 | 1 252 | 0 |
| davon Zuwachs > 20 | 792 | 0 |
| Pixel mit Zuwachs > 40 (Kriterium) | **0** | 0 |

Rechenweg des Spitzenwerts nach der Kette oben: 0,06 · 1,1217 / π = 0,021422
linear, nach three-ACES (`c = L/0,6`, `RRTAndODTFit`) und sRGB **22,1** von
255 auf schwarzem Untergrund — gemessen 22. In der Systemschau ergibt
0,06 · 0,3289 / π = 0,006282 linear **3,75**, gemessen 4. Beide Aufbauten
stimmen damit auf einen Zählschritt genau mit der Rechnung überein.

Das Kriterium „Anzahl heller Pixel (> 40) ≫ 0" ist für den Kuipergürtel
**nicht erfüllt** — in keinem der beiden Aufbauten. Bei einer Albedo von 0,06
und `uTag` 1,1217 kann ein Teilchen im Kino gar nicht über 22 von 255 kommen;
die Schwelle 40 verlangt (bei sonst gleicher Kette) einen `uTag` von rund 2,3,
also mehr als das Doppelte der Belichtung, die die Pluto-Szene setzt. Das
Kriterium stammt aus dem Entwurf und ist dort am Hauptgürtel im Ceres-Kino
festgemacht (`uTag` 2,4176, Spitzenwert 47) — auf den Kuipergürtel bei 43 AE
lässt es sich nicht übertragen, ohne die Albedo zu verfälschen. Sie wurde
in diesem Durchgang **nicht** angehoben und die Beleuchtung nicht angefasst;
die Frage ging als Entwurfsentscheidung an den Auftraggeber. Entscheidung und
Nachmessung stehen in Abschnitt (4) unten: Der Kuipergürtel bekommt mit 0,12
die gemessene Albedo seiner eigenen Population, und das Kriterium ist damit
erfüllt.

Sichtbar ist der Gürtel als Fläche gleichwohl zweifelsfrei: in der Systemschau
als geschlossener, gleichmäßiger Staubring aus 22 305 aufgehellten Pixeln mit
einem Dichtemaximum von 26 % der Ringfläche (Radialprofil unten), in der
Pluto-Szene als Staub rings um den Betrachter.

Räumliche Verteilung in der Pluto-Szene (Pixel mit Zuwachs > 0, Raster
8 × 5 über das Bild): 1 816 Pixel, über das ganze Bildfeld gestreut mit
Anstieg zur unteren linken Ecke hin (dort blickt die Kamera in die dichte,
sonnennahe Seite des Gürtels: 134 Pixel je Rasterfeld gegen 0 bis 9 in der
oberen rechten Ecke). Der Gürtel erscheint dort also richtigerweise nicht als
Ring, sondern als Staub rings um den Betrachter, der selbst im Gürtel steht.

### (2) Radialprofil der Systemschau — Lage und Kompression

Jedes Bildpixel als Sehstrahl in die Ekliptik (z = 0) zurückgerechnet (Kamera
in AE, Blick auf den Ursprung, FOV 50° senkrecht), Ringe von 0,05 AE,
gezählt der **dargestellte** Radius, weil genau er die Lage im Bild
beschreibt. Schwelle: jeder Zuwachs > 0 — da der Spitzenwert eines Teilchens
hier nur 4 von 255 beträgt, wäre die in Task 2 benutzte Schwelle 5 blind; die
Kontrollmessung oben (null abweichende Pixel zwischen zwei Aufnahmen
desselben Zustands) zeigt, dass auch ein Zuwachs von 1 kein Rauschen ist.

| Band (dargestellt) | Anteil aufgehellter Pixel | erwartet |
|---|---:|---|
| 0,00 … 4,00 AE | **0,59 %** | nahe null |
| 4,00 … 4,28 AE | 8,48 % | weicher innerer Rand |
| **4,28 … 4,74 AE (Gürtel)** | **22,05 %** | Gürtel |
| 4,74 … 5,00 AE | 6,63 % | weicher äußerer Rand |
| 5,00 … 8,00 AE | **0,09 %** | nahe null |

Der Verlauf ist eine glatte Glocke: 0,0 % bis 2,90 AE, 2,0 % bei 3,70 AE,
4,3 % bei 4,00 AE, Anstieg über 15,9 % bei 4,25 AE auf das Maximum
**26,0 % bei 4,50 AE**, Abfall auf 8,8 % bei 4,80 AE, 1,7 % bei 5,00 AE und
0,0 % ab 5,55 AE. Lage und Kompression stimmen damit: Das Maximum liegt in
der Mitte des erwarteten Bandes 4,28 … 4,74 AE, innen und außen ist das Feld
praktisch leer.

Die schwachen Ausläufer zwischen 3,0 und 4,0 AE und zwischen 5,0 und 5,5 AE
sind kein Materie außerhalb des Gürtels, sondern die Inklination: Der
Sehstrahl wird auf die Ekliptik zurückgerechnet, ein Teilchen 12° über der
Bahnebene erscheint aus 12 AE Höhe deshalb um einige Zehntel AE versetzt.

### (3) Bildrate bei 100 000 Teilchen

Median der Framezeit über 3 s mit `performance.now()` (je 179 Bilder),
Systemschau bei `kompakt`, Stufe `high`, beide Gürtel sichtbar (also
100 000 Teilchen in zwei Draw-Calls):

| Zustand | Median | 90 % | Maximum |
|---|---:|---:|---:|
| Gürtel an | **16,70 ms** | 17,10 ms | 19,60 ms |
| Gürtel aus | 16,70 ms | 17,20 ms | 19,40 ms |

Kriterium (unter 20 ms) erfüllt; wie in Task 2 liegen beide Messungen auf der
Bildwiederholrate des Monitors (60 Hz, 16,67 ms), die Gürtel kosten also auch
im äußeren Blickfeld keine messbare Zeit.

### (4) Nachmessung mit Kuipergürtel-Albedo 0,12

Entscheidung des Auftraggebers vom 13.09.2026 (Entwurf, Abschnitt 2): Der
Kuipergürtel bekommt eine eigene Albedo von 0,12, den über die Zusammensetzung
der Wolke gewichteten Herschel-Messwert klassischer KBOs und Plutinos; der
Hauptgürtel bleibt bei 0,06 (`KUIPERGUERTEL_ALBEDO` und `BELT_ALBEDO` in
render/belts.ts, je Wolke eine eigene Uniform `uAlbedo`). Beleuchtung,
Belichtung und Punktgröße sind unverändert.

Beide Aufbauten aus der Tabelle oben wurden mit demselben Verfahren neu
aufgenommen (Differenz `display.belts` an gegen aus, Hauptgürtel über
`setDrawRange(0, 0)` still, `uTag` vor dem Auslösen über acht Sekunden bis
zur Konvergenz gelesen). Der Aufbau ist exakt reproduziert: Kameraposition
(−2,5330 / −7,1237 / 1,5068) AE bzw. (0,7006 / 0,4793 / 11,9701) AE, `uTag`
des Kuipergürtels 1,1217 bzw. 0,3289, `uTage` 2,40195 bzw. 0. Kontrolle: zwei
Aufnahmen desselben Zustands unterscheiden sich in keinem Pixel.

| Größe | Kino `pluto-charon` | Systemschau `kompakt` |
|---|---:|---:|
| Pixel, die der Kuipergürtel aufhellt | 1 950 (vorher 1 816) | 28 573 (vorher 22 305) |
| Zuwachs je Teilchenpixel (p50 / p90) | 35 / 43 (vorher 19 / 22) | 11 / 13 (vorher 4 / 4) |
| größter Zuwachs = freistehendes Teilchen | **43** (vorher 22) | 15 (vorher 4) |
| davon Zuwachs > 10 | 1 582 | 15 018 |
| davon Zuwachs > 20 | 1 346 | 0 |
| davon Zuwachs > 30 | 1 100 | 0 |
| Pixel mit Zuwachs > 40 (Kriterium) | **814** (vorher 0) | 0 |

Rechenweg wie oben: 0,12 · 1,1217 / π = 0,042844 linear, nach three-ACES und
sRGB **43,5** von 255 — gemessen 43. Systemschau: 0,12 · 0,3289 / π =
0,012564 linear ergibt **11,4**, gemessen p50 11; das Maximum 15 entsteht,
wo sich mehrere Teilchen auf einem Pixel überlagern. Beide Aufbauten stimmen
wieder auf einen Zählschritt mit der Rechnung überein.

Das Kriterium „Anzahl heller Pixel (> 40) ≫ 0" ist für den Kuipergürtel im
Pluto-Kino mit 814 Pixeln jetzt **erfüllt**. Die Zahl der aufgehellten Pixel
steigt nur mäßig (1 816 → 1 950 bzw. 22 305 → 28 573): Neu sichtbar werden
Teilchen, deren Beitrag vorher unter den Rundungsschritt der Tonwertkurve
fiel; die Wolke wird heller, nicht dichter. Die räumliche Verteilung im
Pluto-Kino ist unverändert (Raster 8 × 5: Anstieg zur unteren linken Ecke,
dort 143 Pixel je Rasterfeld gegen 0 bis 10 in der oberen rechten Ecke). In
der Systemschau bleibt der Kuipergürtel mit p50 11 der blassere der beiden
Ringe (Hauptgürtel dort p50 rund 30, hellstes Pixel 36, siehe Sichtprüfung
Hauptgürtel), das Helligkeitsverhältnis der beiden Gürtel im Gesamtbild ist
also erhalten.

### Weitere Beobachtungen

- Der Schalter „Gürtel" blendet auch bei `kompakt` beide Wolken sofort aus und
  wieder ein; der Stufenwechsel baut sie mit 10 000 (`medium`) bzw. 50 000
  (`high`) Teilchen je Wolke neu auf.
- Die Browserkonsole meldet über den ganzen Prüflauf weder Fehler noch
  Warnungen.
- Im Gesamtbild der Systemschau stehen beide Gürtel richtig zueinander: der
  Hauptgürtel als schmaler heller Ring bei 1,35 … 1,61 AE dargestellt
  (2,1 … 3,3 AE echt), der Kuipergürtel als breiter, deutlich blasserer Ring
  weit außen — genau das Bild, das die Abstandskompression bei k = 0,4
  erzeugen soll.
