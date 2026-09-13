# Phase 3b-1 — Gürtel: Abnahmeprotokoll

**Datum:** 13.09.2026
**Stand:** Zweig `guertel`, Task 2 (Punktwolke im Renderer, Schalter, Sichtprüfung)
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
sRGB 35 bis 36 von 255.

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
