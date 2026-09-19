# Abnahme Flug Etappe 2 (Nachträge, Controller und Fadenkreuz)

## 1. Umfang

Branch `flug-2` (von `master` f5d8680 „Plan Flug Etappe 2 und Nachtrag §13 zum Entwurf"). Plan
`docs/superpowers/plans/2026-09-19-flug-etappe2.md`, Entwurf
`docs/superpowers/specs/2026-09-19-flug-und-controller-design.md` (Abnahme nach §9 Punkte 5 bis 7
und dem Nachtrag §13, Messungen N1 bis N5). Umsetzung:

- 3af1dae — Flug: Bezug nach Systemen mit Einflussbereich (Task 1, §13.1)
- 688d6fa — Flug: Körper nächst der Bildmitte nach dem Abstand zum Scheibenrand (Task 2, §13.5)
- 67b76c9 — Flug: Aus dem Kino wird der Körper Ziel, auf den die Szene blickt (Task 3, §13.2)
- 9af7feb — Steuerung: Loslassen von Shift sperrt gehaltene Flugtasten bis zum neuen Druck (Task 4,
  §13.3)
- 67f96ca — Flug: Wiederherstellungen gleiten mit 0,45 s hinüber (Task 5, §13.4)
- 0c9466d — Controller: Standardbelegung, Totzonen, Flanken und Leser (Task 6)
- 42df3ea — Controller: Flug mit Stick und Triggern, Drehen mit LB, Meldungen an Ruhe, Kino und
  Fahrt (Task 7)
- d654159 — Steuerung: Shift aus Eingabefeldern und mit Strg/Alt/Meta sperrt keine Flugtasten
  (Task 4, Fixrunde 1)
- 069b0a7 — Controller: Fadenkreuz mit dem rechten Stick, Zeigerart pad (Task 8)
- 047b4cb — Controller: A fährt zum Objekt unter dem Kreuz, B in die Draufsicht, Tastenzeilen wie
  die Kürzel (Task 9)
- f6ed4f2 — Steuerung: Loslassen von Shift gilt auch im Eingabefeld (Task 4, Fixrunde 2)
- 7b9b03e — Controller: Verdrahtung, Fadenkreuz im Bild, Kürzelübersicht mit Controller (Task 10)

Etappe 2 setzt zuerst die fünf Antworten auf die Fragen der Abnahme von Etappe 1 um: Bezug nach
Systemen mit Einflussbereich, Körper nächst der Bildmitte nach dem Abstand zum Scheibenrand, Ziel
aus dem Kino, Sperre nach dem Loslassen von Shift und 0,45 s Dämpfung für Wiederherstellungen.
Danach steuert ein Xbox-Controller nach der Standardbelegung die Kamera (linker Stick Blick,
Trigger Flug, LB Drehen um den Körper nächst der Bildmitte) und bedient über seine Tasten Zeit, Kino,
Oberfläche und Infopanel wie die Tastenkürzel. Ein Fadenkreuz am rechten Stick hebt wie die Maus
hervor, A fährt zum Objekt darunter, B in die Draufsicht; die Kürzelübersicht nennt die
Controller-Tasten auf Deutsch und Englisch.

## 2. Lint, Tests, Build

Auf 7b9b03e (19.09.2026):

- `npm run lint`: `eslint .` ohne Befund.
- `npm test`: Test Files 101 passed (101); Tests 3824 passed (3824).
- `npm run build` (`tsc -b && vite build`): 409 Module, `✓ built in 625ms`, Hauptchunk
  `index-CJUU48gD.js` 1 298,93 kB (gzip 349,81 kB), nur der bekannte Hinweis zu Chunkgrößen über
  500 kB.

Testzahl-Herleitung: Ausgangsstand 3769 (f5d8680) → 3774 nach 3af1dae (+5, Task 1) → 3775 nach
688d6fa (+1, Task 2) → 3779 nach 67b76c9 (+4, Task 3) → 3780 nach 9af7feb (+1, Task 4: ein Test
ersetzt, einer neu) → 3782 nach 67f96ca (+2, Task 5) → 3794 nach 0c9466d (+12, Task 6) → 3807 nach
42df3ea (+13, Task 7) → 3808 nach d654159 (+1, Task 4 Fixrunde 1) → 3817 nach 069b0a7 (+9, Task 8)
→ 3822 nach 047b4cb (+5, Task 9) → 3823 nach f6ed4f2 (+1, Task 4 Fixrunde 2) → 3824 nach 7b9b03e
(+1, Task 10). Das Plan-Soll 3822 liegt um die zwei Tests der Fixrunden zu Task 4 darunter. Task 11
(diese Abnahme) ändert keinen Code.

## 3. Sichtprüfung

Alle Messungen in einer Seitenladung: Chrome 153 über Playwright am Prüfrechner (2560×1440-Monitor,
59,95 Hz), Viewport 2560×1351 CSS-px (neuer Tab; Etappe 1: 2560×1295), Pixeldichte 1,
`isSecureContext` true, direkt nach dem Laden `quality.tier = 'high'`, Maßstab Schaubild (Körper
×50, Abstände k = 0,6, Sonne 0,35). Vor dem Laden ersetzte ein Init-Skript (`addInitScript`)
`navigator.getGamepads` durch eine steuerbare Attrappe mit Standardbelegung (Achsen und Tasten in
der Seite gesetzt, Tastendruck über `__padDruecken`). Wartezeiten per `requestAnimationFrame`-Schleife
gegen `performance.now()` in der Seite; vor jeder Aufnahme mindestens 3 s Ruhe, bis
`renderer.info.memory.textures` gleich blieb. Tasten der Tastatur über `page.keyboard.down/up`. Pixel
mit Python 3.12 (Pillow, numpy): Helligkeit = Luma, Scheibe = zusammenhängende Pixel mit
Helligkeit > 8 ab der hellsten Stelle nahe der erwarteten Lage. Konsole seit dem Laden: 0 Fehler,
0 Warnungen.

| Nr. | Kriterium | Messwert | erfüllt |
|---|---|---|---|
| N1 | Erde–Mond, 1 d/s, 5 s: `refId` durchgehend `'earth'`; Abstand 30 ± 0,1 R_E; Erdscheibe verschiebt sich höchstens 3 px | 299 Bilder in 4987 ms, jd +4,97 d: `refId` stets `'earth'`, `mode` stets `'fly'`; Abstand 30,000 R_E in jedem Bild; Schwerpunkt (1279,511 \| 674,995) → (1279,505 \| 675,004): 0,011 px (Etappe 1: 30 → 43,5 R_E unter Sonnenbezug) | ja |
| N2 | Kino (`phobos-tiefflug`) → W: `mode 'fly'`, `targetId 'mars'`, Kopf des Infopanels „Mars" | echte Taste `c` nach Ruhe, 5 s, W 303,9 ms: `fly` / `mars` (vorher `jupiter`), `refId 'mars'`; `browser_snapshot`: `complementary "Info"` → `heading "Mars" [level=2]` | ja |
| N3 | Shift+A, Shift nach 500 ms los, A 1000 ms weiter: `mode` nie `'fly'`; Azimut ändert sich nur in den ersten 500 ms (rund 30°), danach bis auf 10⁻⁹ rad nicht | 135 Bilder: `mode` stets `'attached'`, Ziel `earth`; Azimut 0,5 → −0,0412964 (−31,01°) in 513 ms ab A; in den 92 Bildern nach Shift ↑ größte Abweichung 0 rad | ja |
| N4 | Wiederherstellung in den Flug nach `c` und Escape: 90 % des Weges frühestens nach 0,7 s; `mode 'fly'` | Weg 727 158 083 km; 50 % nach 378,4 ms, 90 % nach 879,5 ms (rechnerisch 0,87 s bei 0,45 s); `fly` in allen Bildern ab 22,6 ms nach Escape; Endlage 1378 km neben der Solllage | ja |
| N5 | Varianten von Etappe 1, Messung 4 (Io, Europa, Titan oder Saturn), Shift+A 150 ms: `targetId 'jupiter'` in jeder Variante ohne Mond in der Bildmitte | 29 rekonstruierte Varianten, keine mit Scheibe in der Bildmitte (Ruling in §4). 18 → `jupiter`: alle, in denen Jupiters Rand der Achse am nächsten liegt. 11 → Europa 5×, Io 4×, Saturn 2×: deren Rand liegt 0,018 bis 0,048 rad neben der Achse, Jupiters 0,049/0,050 rad. Alle 29 gleich der Regel aus §13.5, Wiederholung der 11 identisch | wörtlich nein (18/29); für den Fall aus §13.5 ja (18/18) |
| 5a | Differenzbild Kreuz an/aus: nur im 32-px-Quadrat um das Kreuz, mindestens 50 Pixel | Kontrolle aus/aus 0 Pixel; aus/an 156 Pixel, alle im Quadrat um (1306,78 \| 675,5), Rahmen 20×21 px | ja |
| 5b | Kreuz auf einer Bahnlinie: `hervorgehoben()` = Körper der Bahn, Deckkraft 0,9 | Marsbahn, Stützpunkt 381,6 px vom Planeten, Kreuz 0,98 px daneben: `hervorgehoben()` `'mars'`, Deckkraft 0,9, übrige 33 Linien 0,45 | ja |
| 5c | Kreuz auf Mars, A: `targetId 'mars'`; 3 s nach dem Druck Marsscheibe höchstens 2 px neben der Bildmitte | ein Bild nach A `attached` / `mars`; nach 3003,5 ms Schwerpunkt (1279,362 \| 674,969): 0,14 px von der Pixelmitte (1279,5 \| 675,0), 0,83 px von (1280 \| 675,5) (Klickflächen 1,6 px) | ja |
| 5d | zwei Mausbewegungen: `[data-fadenkreuz]` `display: none` | vorher `block`; danach sofort und nach 100 ms `none` (auch berechnet) | ja |
| 6a | Kino, `pauseOnInput:false`, Stick 0,3 für 5 s: Kopfzeile im DOM, kein `zeiger-aus`; Gegenprobe ohne Eingabe: nach 4 s Oberfläche fort | nach 5004 ms Kopfzeile da, kein `zeiger-aus`, Kino läuft; ohne Eingabe fort nach 3584 ms, nach 4085 ms keine Kopfzeile, `zeiger-aus` gesetzt | ja |
| 6b | `pauseOnInput:true`, Stick 200 ms: `running` false, `mode 'cinema'` | 201,3 ms: `false` / `cinema` | ja |
| 6c | RB: `nummer` + 1, `running` bleibt; Menü/Start: `running` false, Kamera wie vor dem Kino | RB: 0 → 1, `true`; Menü/Start: `false`, Kamera JSON-gleich mit dem Stand vor dem Kino, Rate und Pause wie vorher | ja |
| 6d | Kino, linker Stick 0,5 für 300 ms: `mode 'fly'`, `targetId` = Blickziel der Szene; größter Schritt in den fünf Bildern um den Wechsel ≤ größter Flugschritt danach | `saturn-streiflicht`: `fly` / `saturn` (vorher `earth`); Schritte um den Wechsel 4075,0 / 4075,1 / 598,9 / 5989,2 / 5989,2 km, danach höchstens 6097,0 km; relativ zu Saturn 3600,2 / 3600,1 / 0 / 0 / 0 km | ja |
| 7 | Kosten: Mittel (b) höchstens 0,5 ms über (a), kein Bildabstand über 25 ms | (a) neutral, Kreuz aus: 299 Abstände, Mittel 16,680 ms, größter 19,4 ms; (b) linker Stick 0,5 und rechter 0,3: 299 Abstände, Mittel 16,641 ms, größter 19,7 ms; Differenz −0,038 ms | ja |

Einzelheiten je Messung:

- **N1:** Uhr zuerst angehalten, jd 2 451 613,8721; R_E = 318 550 km, Mond 58,11 R_E von der Erde.
  Fluglage 30 R_E in Richtung Mond, Blick auf die Erde, `refId 'earth'`; nach 3,5 s Ruhe 30,0016 R_E
  (Rest der Wiederherstellung), dann `setTime({ paused: false, rateDaysPerSec: 1 })`. Aufnahmen bei
  0,8 → 99,8 ms (jd 2 451 613,8721 → ,9721) und 5006,4 → 5095,6 ms (jd 2 451 618,8764 → ,9595);
  ganze Scheibe über der Schwelle (7317/7320 px, Äquivalentdurchmesser 96,52/96,54 px). Bahnlinien,
  Namen und Marker aus (Ruling in §4).
- **N2:** Oberfläche sichtbar, `setCinema({ shuffle: false, nummer: 8, pauseOnInput: true })`
  (Index von `phobos-tiefflug`), `setCamera({ targetId: 'jupiter' })`, Uhr angehalten; 3,5 s Ruhe,
  echte Taste `c`, 5015 ms später W. Im Objektbaum ist danach „Mars" gedrückt, das Infopanel zeigt
  Datenblock und Gymnasialtext.
- **N3:** jd 2 451 671,0012, Uhr angehalten, `setCamera({ mode: 'attached', targetId: 'earth',
  distance: 10·R_E, azimuth: 0,5, elevation: 0,1 })`. Shift ↓, A ↓ 3,6 ms später, Shift ↑ 513,4 ms
  nach A, A weitere 1018,9 ms. Erste Änderung des Azimuts 10 ms nach A, letzte 2,5 ms vor Shift ↑.
- **N4:** Uhr angehalten (jd 2 451 684,5289), Flug wörtlich nach Plan (R = 2 911 600 km),
  `setCinema({ running: false, pauseOnInput: true, shuffle: false, nummer: 0 })`. Nach 3,5 s Ruhe
  echte Taste `c` (Szene Erdaufgang, Vollbild gewährt), rund 5,1 s später echte Taste Escape. 194 Bilder
  nach Escape; Zeit des Escape über einen `keydown`-Hörer in der Einfangphase. Danach `fly` mit der
  gemerkten Lage, Uhr angehalten, Rate 1 d/s wie vor dem Kino, jd bleibt das Kinodatum 2 451 684,7389.
- **N5:** jd 2 451 671,0012 wie in Etappe 1, R_J = 3 495 550 km, alle Körper sichtbar. Aufbau je
  Variante: Flug 20 R_J um Jupiter, Blick 0,1 rad an ihm vorbei, 2,5 s eingeschwungen, echte Tasten
  Shift+A 150,5 bis 166,7 ms. Die 18 Jupiter-Fälle wählten mit der alten Regel 12× Europa, 5× Io,
  1× Titan; deren Rand lag 0,054 bis 0,097 rad neben der Achse. Alle 29 Varianten als Azimut relativ
  zur Sonnenrichtung / Elevation / Gier / Nick des Blickversatzes (rad): alte Wahl → gemessenes Ziel:
  −0,9/−0,15/+0,1/0 Europa → Jupiter; −0,9/0/+0,1/0 Europa → Jupiter; −0,9/0,15/+0,1/0 Europa →
  Jupiter; −0,6/−0,15/+0,1/0 Europa → Europa; −0,6/−0,15/0/−0,1 Europa → Jupiter; −0,6/0/+0,1/0
  Europa → Europa; −0,6/0,15/+0,1/0 Europa → Jupiter; −0,6/0,15/0/+0,1 Europa → Jupiter;
  −0,3/−0,15/−0,1/0 Europa → Jupiter; −0,3/−0,15/0/−0,1 Europa → Jupiter; −0,3/0/−0,1/0 Europa →
  Jupiter; −0,3/0/0/+0,1 Europa → Jupiter; −0,3/0,15/−0,1/0 Europa → Jupiter; −0,3/0,15/0/+0,1
  Europa → Europa; 0/−0,15/+0,1/0 Io → Jupiter; 0/−0,15/−0,1/0 Europa → Europa; 0/0/−0,1/0 Europa →
  Europa; 0/0,15/+0,1/0 Saturn → Saturn; 0/0,15/−0,1/0 Europa → Jupiter; 0,3/−0,15/+0,1/0 Io → Io;
  0,3/0,15/+0,1/0 Io → Io; 0,3/0,15/−0,1/0 Saturn → Saturn; 0,6/−0,15/+0,1/0 Io → Io; 0,6/0/+0,1/0
  Io → Io; 0,6/0,15/+0,1/0 Io → Jupiter; 0,6/0,15/−0,1/0 Titan → Jupiter; 0,9/−0,15/0/−0,1 Io →
  Jupiter; 0,9/0/0/+0,1 Io → Jupiter; 0,9/0,15/0/+0,1 Io → Jupiter.
- **5a:** jd 2 451 671,0012, Standarddarstellung, Oberfläche aus. Flug 10 R_E seitlich der Erde,
  Blick 1,05 rad über die Ekliptik; `trefferBei(…, 'pad')` im Raster ±100 px um die Mitte überall
  null. Rechter Stick `axes[2] = 0,5` für 116,9 ms, danach 3052 ms Wartezeit (Ruling zu X in §4);
  Kreuz bei `translate(1294.78px, 663.5px)`, 26,78 px rechts der Mitte.
- **5b:** Systemansicht wie beim Start (`free`, Sonne, 8·10⁸ km, Azimut 0,6, Elevation 0,5). Linien
  aus `window.scene` (34 `Line` mit 513 Punkten in der Reihenfolge der Körper mit Bahn, Mars über die
  Farbe #c1502e bestätigt), projiziert mit `kamera.projectionMatrix · matrixWorldInverse`. Mars bei
  (1537,2 | 829,9), Ziel Stützpunkt 340 bei (1299,23 | 531,62); `trefferBei` dort und 15 px
  darüber und darunter `mars`. Kreuz allein mit dem rechten Stick geführt: 35 Bilder, 569,7 ms.
- **5c:** Bahnen, Namen und Marker aus. Flug 60 R_M (R_M = 169 475 km) vor Mars, 0,3 rad neben der
  Sonnenrichtung, Blick 0,2 rad Gier und 0,05 rad Nick an Mars vorbei; Mars bei (1572,49 | 750,94).
  Kreuz in 44 Bildern (730,2 ms) auf 0,99 px herangeführt, `hervorgehoben()` `mars`; A ein Bild
  (17,4 ms) lang. Nach 3 s `distance` 1 355 800 km (8 R_M), ganze Scheibe über der Schwelle
  (103 725 px, 363,4 px Äquivalentdurchmesser). Das Kreuz stand noch sichtbar an der alten Stelle
  (1571,7 | 750,3) über leerem Himmel; ausmaskiert und ohne Maske gleiches Ergebnis.
- **5d:** Kreuz vorher per X (ein Bild) gezeigt; `page.mouse.move(100, 100)` und
  `page.mouse.move(120, 110)`.
- **6a bis 6d:** Oberfläche sichtbar, Uhr 1 d/s, Ausgangslage geheftet an der Erde (10 R_E). Das Kino
  startet jeweils über Menü/Start der Attrappe; nach 6b lief es per Menü/Start aus der Pause wieder an
  (die gemerkte Kamera bleibt dabei). 6d: Szene 1 `saturn-streiflicht` (0,1 d/s), Blickziel laut
  `blickzielVon` `saturn`; Wechsel 30,4 ms nach dem Stick, danach Rate 1 d/s wie vor dem Kino.
- **7:** Oberfläche sichtbar, Standarddarstellung, Uhr 1 d/s, Maus ruhig bei (120 | 110), Ausgangslage
  geheftet an Mars. In (b) wanderte das Kreuz mit 42,1 px/s (Soll 0,0311 · 1351 = 42,0 px/s) und die
  Szene prüfte je Bild den Hover. Beide Fälle laufen an der Bildwiederholrate; ein Mehraufwand liegt
  unter der Auflösung dieser Messung.

## 4. Rulings

Plan-Rulings (beim Schreiben des Plans, von Jens noch nicht bestätigt):

1. Ruling: Der Einflussbereich nimmt die große Halbachse zur Epoche, nicht den momentanen
   Sonnenabstand: zeitunabhängig, der Unterschied liegt unter der Exzentrizität.
2. Ruling: Deckel 0,5 des dargestellten Sonnenabstands. Ohne ihn reichte im Maßstab Kompakt der
   Bereich der Erde über die Sonne hinaus (3·10⁸ km bei 1,5·10⁸ km Abstand). Im Schaubild greift er
   knapp für die Erde und deutlich für die Riesenplaneten (Jupiter 2·10⁸ km statt 2,6·10⁹ km);
   zwischen Mars- und Jupiterbahn kann deshalb Jupiter Bezug sein.
3. Ruling: Im Maßstab Kompakt liegt die dargestellte Mondbahn (7,7·10⁷ km) jenseits des gedeckelten
   Erdbereichs (7,4·10⁷ km); dort entscheidet die oberste Ebene nach q (dicht am Mond der Mond, sonst
   oft die Sonne). Bekannte Grenze ohne eigenen Fall.
4. Ruling: Systemgrenze mit eigenem Rückstellbereich: Eintritt bei t < 1, Austritt bei t ≥ 1,25; ein
   anderes System gewinnt vorher nur bei t < 0,8 · t_bisher.
5. Ruling: Monde eines ausgeblendeten Mutterkörpers konkurrieren auf der obersten Ebene; Stände ohne
   `mutter`/`einfluss` (Testliterale) wählen wie in Etappe 1 allein nach q.
6. Ruling: `blickzielVon` folgt dem Blickpunkt der Kamera statt „`lookAtId ?? targetId`" aus der
   Schlussprüfung: Bei der Sichtlinie blickt die Kamera auf den Standortkörper. `exposureTargetId`
   bleibt unverändert (belichtet bei der Sichtlinie auf `lookAtId`, bekannter Befund aus 4d-1).
7. Ruling: Gesperrte Tasten gibt nur ein neuer Druck derselben Taste frei, auch ein erneutes Drücken
   von Shift nicht.
8. Ruling: Eine Wiederherstellung wird am Abstand der Solllage zur gezeigten Lage beim Eintritt
   erkannt (Rest > 10⁻³) und endet beim Ankommen, nicht nach fester Zeit; Eingaben während des
   Übergangs laufen mit 0,45 s weiter.
9. Ruling: Beim ersten Auftauchen des Controllers bleibt das ganze Bild ohne Wirkung, auch Sticks und
   Trigger (Entwurf §5.1 nennt nur den Tastendruck).
10. Ruling: Das Trennen wird am fehlenden Eintrag erkannt; `gamepaddisconnected` wird nicht gehört,
    es führt im nächsten Bild ebenfalls zum fehlenden Eintrag.
11. Ruling: Im selben Bild wirkt die Tastatur vor dem Controller; solange Flugtasten gehalten sind,
    ruht die Controller-Bewegung (Fadenkreuz und Tasten wirken weiter).
12. Ruling: LB mit Stick dreht in beiden Achsen mit 90°/s, RT/LT zoomen mit Faktor 2 je Sekunde; die
    Richtungen folgen Shift (Stick rechts = Azimut steigt wie Shift+D).
13. Ruling: Jede Controller-Eingabe zeigt das Fadenkreuz, nicht nur der rechte Stick (Entwurf §5.4
    „ab der ersten Controller-Eingabe").
14. Ruling: Eine Mausbewegung blendet das Kreuz aus, löscht aber den Hover nicht (die Maus meldet im
    selben Ereignis ihren eigenen Zeiger); nur das Trennen löscht ihn.
15. Ruling: Die Leinwand ist das Fenster (`innerWidth`/`innerHeight`), weil die Canvas es füllt;
    `clientWidth` erzwänge je Bild einen Layoutdurchgang.
16. Ruling: Solange das Fadenkreuz sichtbar ist, bleibt die Form des Mauszeigers unverändert, auch
    wenn das Kreuz einen Körper hervorhebt.
17. Ruling: Tasten wirken nach Bewegung und Fadenkreuz desselben Bildes; A sucht an der Lage des
    Kreuzes, auch wenn es in diesem Bild erst sichtbar wird.
18. Ruling: `padAttrappe.ts` liegt als kleines Modul neben `gamepad.ts`, statt in zwei Testdateien
    kopiert zu werden.
19. Ruling: Die Kürzelübersicht nennt die Controller-Tasten mit den Xbox-Namen; „Menu" und „View"
    erscheinen auf Deutsch als „Menü" und „Ansicht".
20. Ruling: Das Fadenkreuz trägt `data-fadenkreuz` für die Abnahme, wie die Verweise `data-verweis`.

Rulings der Umsetzung (Tasks 1, 4, 8 und 10):

- Ruling: (Task 1) Kein Fixlauf für den Review-Befund, `waehleBezug` lege je Bild ein
  `zentren`-Array, zwei Closures und Filterarrays an: `koerperStaende` legt je Bild ohnehin rund 30
  Stände samt Vektoren an, die neuen Arrays sind dagegen klein (rund 15 Einträge); Messung 7 prüft
  es. Kosten bei Irrtum: kleiner Umbau mit Zwischenspeicher je Bild. Ergebnis der Messung 7: kein
  Mehraufwand messbar (−0,038 ms).
- Ruling: (Task 4, Review) Beheben: Der Shift-Zustand wird nur aus Ereignissen außerhalb von
  Eingabefeldern und ohne Strg/Alt/Meta übernommen (Entwurf §4.4 geht dem Plancode vor), mit einem
  Test; Fixrunde erst nach dem Ende von Task 7 (nur ein Umsetzer im Arbeitsbaum), Soll-Testzahlen ab
  dann +1 (d654159).
- Ruling: (Task 4, Fixrunde 2) „Shift aus" wird aus jedem Ereignis übernommen, „Shift an" nur
  außerhalb von Eingabefeldern und ohne Strg/Alt/Meta. So bleibt der Zustand nie hängen (Shift außen
  gedrückt und im Eingabefeld losgelassen), und Tippen im Feld sperrt nichts, weil Shift dort nie an
  war; Runde erst nach dem Ende von Task 9, ein Test (f6ed4f2).
- Ruling: (Task 8) Kein Fixlauf für den Review-Befund, `kreuzTakt` rufe `zeiger()` bei sichtbarem
  Kreuz in jedem Bild mit einem neuen Objekt auf: ein kleines Objekt je Bild, die Szene rechnet den
  Hover ohnehin je Bild neu; Messung 7 prüft es. Kosten bei Irrtum: zwei Zeilen Zwischenspeicher.
  Ergebnis der Messung 7: kein Mehraufwand messbar.
- Ruling: (Task 10) Die Anpassung von `i18n.test.ts` (`shortcuts.padTitle` in `GLEICH_ERLAUBT`,
  „Controller" in beiden Sprachen) ist angenommen, obwohl sie nicht im Brief stand: Der Test verlangt
  sonst verschiedene Texte, das Wort ist in beiden Sprachen gleich.

Rulings dieser Abnahme:

- Ruling: Für die Scheibenmessungen (N1, 5c) Bahnlinien, Namen und Marker aus (`setDisplay`), wie in
  Etappe 1; sonst hinge die Bahnlinie mit der Scheibe zusammen. 5a, 5b, 6 und 7 mit
  Standarddarstellung.
- Ruling: N5 rekonstruiert die Varianten von Etappe 1, deren Protokoll sie nicht einzeln festhält
  (nur „andere Varianten wählten Io, Europa, Titan oder Saturn"). Der gewählte Aufbau von Etappe 1
  lag bei Azimut Sonnenrichtung − 0,3 rad, Elevation 0,15, Blick +0,1 rad Gier. Raster: Azimut
  Sonnenrichtung + {−0,9; −0,6; −0,3; 0; 0,3; 0,6; 0,9} rad, Elevation {−0,15; 0; 0,15}, Blick 0,1 rad
  neben Jupiter in vier Richtungen (Gier ±0,1, Nick ±0,1), 84 Varianten. Die alte Regel (kleinster
  Winkel zur Achse), in der Seite nachgerechnet, wählte in 29 davon Io, Europa, Titan oder Saturn;
  diese 29 sind die Messvarianten. Bewertet ist das Kriterium in beiden Lesarten (§3, §7 Frage 1).
- Ruling: In 5a wurde während der 3 s Wartezeit nach 1,5 s und 2,5 s je ein Bild lang X (Taste 2,
  frei) gedrückt. Sonst blendet die Ruhe (3 s, `zeigerAusgeblendet`) das Kreuz genau zur Aufnahme
  aus. X blieb wirkungslos: Kamerazustand vor und nach gleich, `hervorgehoben()` null.
- Ruling: In 5b und 5c führt eine Regelschleife in der Seite das Kreuz allein über den rechten Stick
  (Auslenkung je Bild aus Restweg, Totzone und Kurve), bis es weniger als 1 px vom Ziel entfernt
  steht.
- Ruling: Offene Aufbauwerte gewählt: N3 Azimut 0,5 und Elevation 0,1; 5a Flug seitlich der Erde mit
  Blick aus der Ekliptik (kein Körper und keine Bahn im Fangradius); 5b Systemansicht mit Stützpunkt
  340 der Marsbahn; 5c Flug 60 R_M vor Mars; N4 Szene 0; Messung 6 aus „geheftet an der Erde,
  1 d/s", Kinostart über Menü/Start; Messung 7 mit sichtbarer Oberfläche, Standarddarstellung und
  1 d/s wie in Etappe 1.
- Ruling: Bildmitte = (1279,5 | 675,0) in Pixelindizes bei 2560×1351; der Abstand in 5c steht
  zusätzlich gegen (1280 | 675,5) in der Tabelle.
- Ruling: Das Vollbild aus N4, N2 und Messung 6 wurde jeweils danach per `document.exitFullscreen()`
  beendet; das synthetische Escape von Playwright erreicht die Vollbildsteuerung des Browsers nicht.
- Ruling: 6d misst die Schritte wie vorgegeben in Weltkoordinaten und zusätzlich relativ zum
  Blickziel Saturn zum `jd` der gezeigten Lage (die Uhr lief).

## 5. Bekannte Unschärfen

Aus den Messungen:

- **N5:** Die Regel aus §13.5 wählt einen Mond oder Saturn, sobald dessen Rand näher an der
  Blickachse liegt als der Jupiters, auch wenn der Körper nur wenige Pixel groß ist. Mit dem Blick
  0,1 rad neben Jupiter (Winkelradius 0,05 rad) liegt Jupiters Rand 0,05 rad neben der Achse; ein
  Galileischer Mond oder — am 6. Mai 2000, bei der Konjunktion — Saturn innerhalb davon gewinnt
  (11 von 29 Varianten). Das Planziel „Jupiter in jeder Variante ohne Mond in der Bildmitte" setzt
  voraus, dass alle Varianten von Etappe 1 den Fall aus §13.5 zeigten; das lässt sich nicht mehr
  prüfen. Frage in §7.
- **6d:** Der linke Stick dreht nur den Blick; relativ zum Bezug steht die Kamera nach dem Wechsel
  still. Die „Flugschritte danach" in Weltkoordinaten sind allein Saturns Bahnbewegung bei 1 d/s. Das
  Kriterium ist damit schwächer als in Etappe 1 (W mit echter Verschiebung); relativ zu Saturn gibt
  es keinen Sprung (Wechselbild 0 km).
- **Vollbild über den Controller:** Menü/Start ruft wie C `startCinema`, das Vollbild anfordert.
  Controller-Tasten sind keine Nutzeraktivierung im Sinne des Browsers; ob Chrome das Vollbild dann
  verweigert (Kino läuft im Fenster), ist ungeprüft. In Playwright wurde es gewährt, weil
  `evaluate` als Nutzergeste gilt. Prüfung von Hand (§6).
- Das Vollbild bleibt nach `stopCinema` bestehen (bekannt seit 4c-4), hier nach W (N2) und nach
  Menü/Start (6c).
- Nach A bleibt das Kreuz an seiner Stelle stehen (5c: 3 s später noch sichtbar über leerem Himmel,
  ohne Hover); erst die Ruhe blendet es aus. So im Entwurf vorgesehen.
- Messung 7 liegt an der Bildwiederholrate: Solange ein Bild in 16,7 ms passt, zeigt der rAF-Zähler
  keinen Mehraufwand; die Rechenzeit je Bild ist nicht gemessen.
- Der Ring des Fadenkreuzes deckt im Bild 20×21 px (Differenzbild 5a), nicht die 24 px von
  `KREUZ_PX` (siehe Review-Befund Task 8 unten).

Aus den Reviews der Tasks (zurückgestellt):

- Task 3: Die zwei neuen Tests stehen am Ende des Blocks Flug statt nach „beendet ein Kino …" (nur
  Reihenfolge).
- Task 6: Die Klemmung von `triggerWert` über 1 ist ungetestet; der Leser prüft `getGamepads`
  zweimal (Aus-Merker und Typzusicherung).
- Task 7: Die LB-Sperre ist nur mit dem Stick getestet, nicht mit einem Trigger.
- Task 8: Der Frühausstieg ohne `leinwand` in `kreuzTakt` ist ungetestet. `KREUZ_PX` heißt
  „Durchmesser samt Kontur" (24), der Ring misst außen rund 21 px (r 9, Kontur 3); der Radius ist fest
  verdrahtet.
- Task 9: Kein Test prüft, dass X, L3 und die Xbox-Taste wirkungslos bleiben. Die Abnahme drückte X
  dreimal ohne Wirkung; L3 und die Xbox-Taste sind nicht geprüft.

## 6. Prüfung von Hand (Jens, Xbox-Controller)

Chrome zeigt einen Controller erst nach einem Tastendruck am Controller (dieser erste Druck löst
nichts aus, Ruling 9) und nur im sicheren Kontext: `http://localhost:5173/Orrery/` geht, der Webspace
braucht HTTPS (Let's Encrypt). Die Xbox-Taste belegen Windows, Steam und die Xbox Game Bar.

- **Tempo:** RT vorwärts, LT rückwärts, stufenlos; Geschwindigkeit = Tempofaktor · Höhe über der
  nächsten Oberfläche mal Triggerwert (Rad ändert den Faktor wie bisher). Anfahren und Abbremsen
  nahe einem Körper angenehm?
- **Totzonen:** Sticks 0,15 kreisförmig mit quadratischer Kurve, Trigger 0,05 linear. Driftet die
  Kamera oder das Kreuz in Ruhe? Sind kleine Ausschläge fein genug?
- **Drehraten:** linker Stick im Flug 90°/s (rechts = nach rechts schauen, oben = nach oben); LB mit
  linkem Stick 90°/s um den Körper nächst der Bildmitte, RT/LT dabei heran und weg mit Faktor 2 je
  Sekunde. LB loslassen bei ausgelenktem Stick: Die Kamera bleibt geheftet, bis der Stick einmal in
  der Totzone war (§13.3).
- **Kreuzgeschwindigkeit:** rechter Stick, bei vollem Ausschlag eine Canvas-Höhe je Sekunde;
  R3 holt das Kreuz zur Mitte. Hervorhebung von Körpern, Namen und Bahnen wie mit der Maus; eine
  Mausbewegung blendet das Kreuz aus.
- **A/B:** A fährt zum Objekt unter dem Kreuz (ohne Treffer nichts), B in die Draufsicht auf das
  Sonnensystem.
- **Steuerkreuz:** ◀ ▶ Zeitraffung langsamer/schneller, ▲ Pause, ▼ Zeit rückwärts, auch im Kino.
- **Menü/RB:** Menü/Start Kino ein und aus (dabei Vollbild ja oder nein, §5), RB nächste Szene; beide
  halten das Kino nicht an, ein Stick schon.
- **Ansicht/Y:** Ansicht blendet die Oberfläche aus und ein, Y das Infopanel.
- X, L3 und die Xbox-Taste bleiben ohne Wirkung.

Die Startwerte lassen sich danach per Ruling ändern (Entwurf §9, §12.1).

## 7. Fragen an Jens

1. **Körper nächst der Bildmitte (N5):** Die Regel aus §13.5 (Winkel minus Winkelradius) wählt einen
   kleinen Körper, wenn dessen Rand näher an der Achse liegt als der Rand einer großen Scheibe (11 von
   29 Varianten: Europa, Io, Saturn statt Jupiter). In allen 18 Varianten, in denen Jupiters Rand am
   nächsten lag, wurde Jupiter Ziel. Soll es so bleiben (dann war das Plankriterium zu weit gefasst),
   oder sollen große Scheiben weiter bevorzugt werden, etwa durch ein Maß relativ zum Winkelradius
   oder einen Zuschlag für die dargestellte Größe?
2. **Vollbild beim Kinostart über den Controller (§5):** Wenn Chrome es ohne Nutzeraktivierung
   verweigert, läuft ein mit Menü/Start begonnenes Kino im Fenster. Ist das so in Ordnung, oder soll
   der Controller das Vollbild gar nicht erst anfordern?
3. Bestätigung der 20 Plan-Rulings, der fünf Rulings der Umsetzung (Tasks 1, 4 zweimal, 8, 10) und
   der acht Rulings dieser Abnahme (§4).
4. Prüfung von Hand nach §6; danach Schlussprüfung der Etappe, Fast-Forward nach `master` und weiter
   mit 4d-3.
