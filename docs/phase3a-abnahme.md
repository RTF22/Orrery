# Phase 3a — Abnahmeprotokoll

**Datum:** 13.09.2026
**Stand:** Zweig `phase-3a-katalog`, Commit `96b020c` (Uranusring aus PDS-Messdaten)
**Prüfumgebung:** Windows 11, Chromium (Playwright, headless), Vite-Entwicklungsserver
auf `localhost`, Fenster 1280 × 800, `devicePixelRatio` 1, Maßstabs-Preset „Schaubild".
Eine Prüfung auf dem Referenz-Laptop unter normalem Desktop-Chrome steht — wie schon
nach Phase 2 — weiterhin aus.

## Automatischer Testlauf

```
npm run lint     → ohne Befund
npx tsc --noEmit → ohne Befund
npm test         → 689 Tests in 44 Dateien, alle grün (Phase 2: 240 in 39)
npm run build    → erfolgreich; ein Chunk von 1 096,84 kB (gzip 290,66 kB)
```

Der Build meldet den Chunk über 500 kB als Hinweis, nicht als Fehler. Die
Aufteilung in mehrere Chunks ist ein Thema für die Veröffentlichung (Phase 5).

## Umfang

| Größe | Phase 2 | Phase 3a |
|---|---:|---:|
| Körper im Katalog | 10 | 35 |
| davon Monde | 1 | 21 (20 neue plus der Erdmond) |
| davon Zwergplaneten | 0 | 5 |
| Ringsysteme | 0 | 2 (Saturn, Uranus) |
| Kinoszenen | 7 | 18 |
| Texturdateien in `public/textures` | — | 30 Dateien, 8 782 272 Bytes (8,4 MiB) |
| Körper ohne Textur | — | 6 (Miranda, Ariel, Umbriel, Titania, Oberon, Deimos) |

Die sechs Lücken sind in `ASSETS.md` (Abschnitt „Lücken") mit den geprüften
Quellen begründet: Für die Uranusmonde bestehen die einzigen verfügbaren Karten zu
57–62 % aus unbelichteter Fläche, für Deimos gibt es keine amtliche Globalkarte.
Der Uranusring hat keine Bildtextur; sein Helligkeitsprofil ist aus den
PDS-Ringdaten gerechnet (`src/render/ringProfil.ts`).

## Ladezeit

Alle Werte aus `performance.getEntries()` beim Laden gegen den lokalen
Entwicklungsserver — ohne Netz, also Untergrenzen für den späteren Betrieb.

| Größe | Wert |
|---|---:|
| `DOMContentLoaded` | 130 ms |
| Erstes Bild (`first-contentful-paint`) | 232 ms |
| Letzte Texturantwort eingetroffen | 306 ms |
| Alle 30 Texturen ohne Cache (`fetch`, `cache: 'reload'`) | 56 ms für 8 782 272 Bytes |

Die Texturen werden nicht abgewartet: Die Kugeln stehen mit ihrer Ausweichfarbe,
sobald die Szene aufgebaut ist, und bekommen die Albedo nachgereicht
(`src/render/bodies.ts`, `ladeAlbedo`). Das erste Bild hängt deshalb nicht an der
Texturgröße.

## Dauerlaufmessung

Zehn Minuten Kino-Modus, Standardkeim 20260912 mit Mischen, 14 Messpunkte über
`window.renderer.info` und `performance.memory`.

| Minute | JS-Heap | Geometrien | Texturen | Shader-Programme | Szene Nr. |
|---:|---:|---:|---:|---:|---:|
| 0,0 (nach dem Laden) | 36,9 MB | 53 | 31 | 16 | — |
| 1,3 | 37,4 MB | 71 | 44 | 17 | 2 |
| 2,3 | 45,0 MB | 71 | 44 | 17 | 3 |
| 3,1 | 40,3 MB | 71 | 44 | 17 | 4 |
| 3,8 | 38,9 MB | 73 | 46 | 17 | 6 |
| 4,6 | 36,5 MB | 73 | 46 | 17 | 7 |
| 5,4 | 40,8 MB | 73 | 46 | 17 | 8 |
| 6,0 | 45,4 MB | 73 | 46 | 17 | 10 |
| 6,7 | 38,8 MB | 73 | 46 | 17 | 11 |
| 7,3 | 44,5 MB | 73 | 46 | 17 | 12 |
| 7,9 | 35,5 MB | 73 | 46 | 17 | 13 |
| 8,5 | 40,4 MB | 73 | 46 | 17 | 14 |
| 9,4 | 40,3 MB | 73 | 46 | 17 | 15 |
| 10,1 | 37,4 MB | 73 | 46 | 17 | 16 |

**Heap.** Der Heap pendelt zwischen 35,5 und 45,4 MB; der letzte Wert (37,4 MB)
liegt 0,5 MB über dem ersten — der Sägezahn der Speicherbereinigung, kein Trend.
Gegenüber Phase 2 (31,5–37,9 MB) liegt das Band rund 5 MB höher, der Preis für 25
zusätzliche Körper samt Bahnlinien und Beschriftungen.

**Geometrien und Texturen.** Beide Zähler steigen in den ersten vier Minuten in
zwei Stufen (53 → 71 → 73 und 31 → 44 → 46) und bleiben dann bis Minute 10 exakt
konstant. Die Stufen sind kein Wachstum, sondern das nachträgliche Hochladen auf
die Grafikkarte: `renderer.info.memory` zählt erst, was einmal gezeichnet wurde.
Gegenprobe zur Minute 5,4: Die Szene enthält 74 Objekte mit 72 verschiedenen
Geometrien und 31 Material-Texturen; die 73 beziehungsweise 46 des Renderers sind
diese Bestände plus die Bildschirm-Quads und Render-Ziele des Bloom-Composers.
Sobald jedes Objekt einmal im Bild war, gibt es nichts mehr hochzuladen. Die
Shader-Programme steigen einmalig von 16 auf 17: das Ringmaterial.

**Ein Pausenereignis.** Bei Minute 8,5 stand der Kino-Modus auf `running: false`,
bei Minute 9,2 lief er wieder (`elapsedSec` 31,7 nach der Wiederaufnahme). Das
ist die Pause bei Nutzereingabe: Das Prüfwerkzeug hat ein Zeigerereignis
ausgelöst — `pointermove` gehört zu den überwachten Ereignissen in
`src/ui/idle.ts` —, die Anwendung selbst erzeugt keine. Die Wiederaufnahme nach 30
Sekunden Ruhe hat wie vorgesehen gegriffen, und die Zähler haben sich durch
Pause und Wiederaufnahme nicht bewegt. Für die Sichtprüfung unten wurde
`pauseOnInput` deshalb ausgeschaltet.

**Oberfläche.** Nach zehn Minuten trug das Wurzelelement die Klasse `zeiger-aus`,
und kein Panel war im DOM — das Verhalten aus Phase 2 gilt mit 35 Körpern
unverändert.

### Bildrate

20 Sekunden Aufzeichnung über `requestAnimationFrame` bei laufendem Kino-Modus,
dieselbe Messung wie im Phase-2-Protokoll:

| Größe | Phase 2 | Phase 3a |
|---|---:|---:|
| Frames | 1 200 | 1 199 |
| Median-Framezeit | 16,70 ms | 16,70 ms |
| 95. Perzentil | 16,80 ms | 16,80 ms |
| Maximum | 17,20 ms | 17,00 ms |
| Frames über 33 ms | — | 0 |

Durchgehend an der Bildsynchronisation. 35 statt 10 Körper drücken die Bildrate
nicht messbar — genau die Erwartung aus Abschnitt 9 des Entwurfs (25 Kugeln zu je
rund 2000 Dreiecken sind belanglos).

## Sichtprüfung

Vier Szenen aus Abschnitt 8 des Entwurfs, je über `setCinema({shuffle: false,
nummer})` fest angesteuert, Screenshot nach dem Einschwingen der Kamera, danach
mit Python/PIL gemessen. „Helligkeit" ist das Maximum der drei Kanäle, 0–255.

**Ringe im Gegenlicht — „Ringdurchflug" (Nr. 11).** Die Sonne steht hinter
Saturn, die Kamera auf der Nachtseite. Die Ringe sind über die gesamte
Bildbreite als helles, gestuftes Band zu sehen, hinter dem Planeten heller als
davor — die Vorwärtsstreuung. 54,4 % aller Pixel liegen über 12; im unteren
Bilddrittel (Ringvordergrund) liegt das 95. Perzentil bei 65, im mittleren bei
73, im oberen (Ringhintergrund nahe der Sonne) bei 105. Saturns Nachtseite bleibt
als dunkle Scheibe vor dem hellen Ring erkennbar; das Bloom der Sonne sitzt am
Planetenrand, ohne den Ring zu überstrahlen.

**Jupitersystem — „Galileisches Schattenspiel" (Nr. 7).** Jupiter mit den vier
Mondbahnen als konzentrische Ellipsen. Drei der vier Monde sind als eigenständige
Scheiben von 36–39 Pixeln Fläche messbar, der vierte
stand zum Aufnahmezeitpunkt vor Jupiter beziehungsweise auf der Bahnlinie und
ließ sich nicht getrennt auszählen. Mondbeschriftungen bleiben bei dieser
Scheibengröße wie beabsichtigt aus (Schwelle aus Task 15).

**Systemschau — „Systemblick" (Nr. 4).** Alle 34 Bahnlinien und alle 37 Kugeln
(35 Körper plus zwei Ringscheiben) sind laut Szenendurchlauf sichtbar; im Bild
erscheinen die Mondsysteme von Jupiter, Saturn, Uranus, Neptun und Pluto als
Bahnbündel um ihre Planeten. Beschriftet sind Sonne, Planeten, Pluto und Eris
(Venus zum Aufnahmezeitpunkt von der Sonnenbeschriftung verdrängt); die Monde
bleiben unter der Beschriftungsschwelle. 2,3 % der Pixel
über 12, ohne Überstrahlung (99. Perzentil 166).

**Pluto–Charon (Nr. 9) — Befund.** Die Szene zeigt das Paar, aber beide Körper
sind nahezu unbeleuchtet. Gemessen ohne Bahnlinien und Beschriftung:

| Variation | Pluto | Charon |
|---|---|---|
| Nr. 9 (erste Runde) | Sichel 19 × 26 px, Maximum 30, Median 16 | 7 × 11 px, Maximum 44 |
| Nr. 27 (zweite Runde, gleiche Szene) | keine zusammenhängende Fläche ≥ 15 px über 8 messbar | dito |

In der zweiten Variation steht die Sonne selbst im Bild und Pluto davor als
schwarze Scheibe. Ursache: Der Azimut wird ekliptikal gezogen (Variation
0–360°), unabhängig von der Sonnenrichtung, und bei 39 AE ist auch die Tagseite
trotz Distanzausgleich nur schwach. Andere Szenen des Katalogs sind in Task 16
bereits auf die berechnete Sonnenrichtung gestellt worden („Enceladus-hell",
„Triton-rückwärts", `scenes.test.ts`); Pluto–Charon fehlt in dieser Liste. Siehe
„Offene Punkte".

## Akzeptanzkriterien

Gegen Abschnitt 8 des Phase-3a-Entwurfs und Abschnitt 16 (Phase 3) des
Hauptentwurfs.

| Kriterium | Nachweis | Ergebnis |
|---|---|---|
| Etwa 20 Monde, 5 Zwergplaneten, Saturn- und Uranusringe | 20 neue Monde, 5 Zwergplaneten, zwei Ringsysteme (Tabelle „Umfang"); `data/index.test.ts` prüft Zugehörigkeit, Bezugsebene und Bahnradien je Mondsystem | erfüllt |
| Katalogdaten: eindeutige IDs, existierender Mutterkörper, Pol wo `parentEquator`, Texturpfad vorhanden oder bewusst leer | `data/index.test.ts`, Block „Katalog-Invarianten" (fünf Tests, darunter der Dateitest für jeden Texturpfad) | erfüllt |
| `parentEquator` gegen von Hand gerechnete Vektoren | `sim/frames.test.ts` (Identität bei Ekliptiknormale, Drehung um ε beim Erdpol, entartete Fälle), `sim/orbit.test.ts` | erfüllt |
| Mondbahnen gegen Fixture aus JPL Horizons, mehrere Epochen | `sim/monde.fixture.test.ts`: 20 Monde × 5 Epochen (1976, 2000, 2026, 2050, 2076), je Eintrag große Halbachse 1 %, Neigung 0,5°, Position 5 % des Umfangs; bei J2000 zusätzlich die volle Bahnebene 0,5° | erfüllt, mit begründeten Ausnahmen (unten) |
| Ringe: Geometriebauer und Phasenterm als reine Funktionen | `render/rings.test.ts`, `render/ringProfil.test.ts` | erfüllt |
| Szenen: Invarianten über alle 18, Rechennachweis für Stichproben | `data/scenes.test.ts`: fünf Invarianten, zwölf Stichproben (Ringkante, Ringdurchflug, Uranus, Sonnenrichtungen, Phobos, Io-Umlauf) | erfüllt |
| Beleuchtungsschranken gelten auch für die neuen Körper | `render/lighting.test.ts` läuft über alle Körper außer Sonne und Eris (Eris unterschreitet bei 98 AE die Tagseiten-Schranke von 30 % real; im Test begründet) | erfüllt |
| Sichtprüfung: Ringe im Gegenlicht, Jupitersystem, Pluto–Charon, Systemschau | Abschnitt „Sichtprüfung" | drei von vier erfüllt; Pluto–Charon mit Befund |
| Neue Kinoszenen nutzen Ringe und Monde | 11 neue Szenen, davon 3 Ringszenen und 7 Mondszenen | erfüllt |
| Texturzahl und Ladezeit gemessen, nicht geschätzt | Abschnitte „Umfang" und „Ladezeit" | erfüllt |
| Asteroiden- und Kuipergürtel; Schattenwurf, Mondfinsternis | Laut Abschnitt 10 des Phase-3a-Entwurfs bewusst Phase 3b | nicht Teil von 3a |

**Ausnahmen im Fixture-Test**, jede mit Herleitung im Testkommentar:

- Position auf der Bahn: Mimas 20 % statt 5 % (Libration in der 4:2-Resonanz
  mit Tethys; die Bahnebene selbst stimmt bei J2000 auf 0,003°), Triton 15 %.
- Neigung: Deimos 1,0°, Iapetus 1,2° (Laplace-Ebene 14,8° gegen Saturns
  Äquator; lineare Fortschreibung driftet bis 2076 auf 1,109°), Triton 0,6°
  (Differenz zwischen nutationskorrigiertem und konstantem IAU-Pol, 0,51°).
- Charon: Die Soll-Halbachse wird mit GM(Pluto) + GM(Charon) gerechnet, weil
  Charons Massenanteil (10,85 %) sonst eine scheinbare Abweichung von 12,16 %
  erzeugt — eine Korrektur der Kontrollrechnung, keine Aufweichung der
  1-%-Schranke.

## Nachtrag: Pluto–Charon auf Sonnenrichtung (13.09.2026)

Der Befund aus der Sichtprüfung ist behoben: Die Szene steht jetzt wie
„Enceladus-hell" und „Triton-rückwärts" auf der berechneten Sonnenrichtung —
Azimut 70,5° (Richtung Pluto→Sonne zur Epoche J2000 aus Plutos Bahnelementen,
Elevation der Sonne −11,17°) mit Streuung ±20° statt 0–360°.
`scenes.test.ts` rechnet den Azimut aus denselben Bahnelementen nach, statt die
Zahl zu wiederholen; Testzahl damit 690.

Dieselbe Messung wie oben, ohne Bahnlinien und Beschriftung, nach dem Neuladen
der Seite:

| Variation | Pluto | Charon |
|---|---|---|
| Nr. 9 (erste Runde) | volle Scheibe 27 × 27 px, Maximum 217, Median 25 | 13 × 12 px, Maximum 36 |
| Nr. 27 (zweite Runde) | volle Scheibe 23 × 22 px, Maximum 36, Median 21 | 14 × 12 px, Maximum 42 |

Beide Ziehungen zeigen das Paar als volle, sonnenzugewandte Scheiben; die
Scheibengrößen passen zu 55 Plutoradien mal Abstandsfaktor 1,2 beziehungsweise
1,45. Das Maximum von 217 in der ersten Ziehung stammt von den hellen
Eisflächen der New-Horizons-Karte, die zweite Ziehung zeigt (0,3 Tage/s
Zeitraffer, 6,4 Tage Rotation) eine andere Hemisphäre — darunter den
unbelichteten Kartenteil, siehe `ASSETS.md`. Der Median der Tagseite bleibt in
beiden Fällen bei 21–25 von 255, nur knapp über der Nachtseite der Erde (16).
Das ist kein Szenenfehler mehr, sondern die Beleuchtungsrechnung bei 30 AE —
derselbe Befund wie bei den Saturnmonden im Kommentar zu „Enceladus-hell", und
bleibt als offener Punkt stehen.

## Offene Punkte

- **Tagseite ferner Körper zu dunkel.** Pluto erreicht bei 30 AE trotz
  Distanzausgleich nur einen Median von 21–25 von 255 (Nachtrag oben), die
  Saturnmonde zeigen dieselbe Dämpfung. Zu prüfen in `render/lighting.ts`, ob
  Distanzausgleich oder Helligkeit für die äußeren Körper nachgeführt werden.
- **Sechs Körper ohne Textur** (fünf Uranusmonde, Deimos), begründet in
  `ASSETS.md`; die Ausweichfarbe trägt sie. Bleibt offen, bis eine amtliche
  Karte mit weniger als etwa 40 % Datenlücke auftaucht.
- **Fixture-Epochen** decken 1976 bis 2076 ab (−24 bis +76 Jahre um J2000) statt
  der im Entwurf genannten ±50 Jahre; die Stichtage stammen aus der
  Horizons-Abfrage von Task 6 und wurden für die weiteren Mondsysteme
  beibehalten, damit alle Monde dieselben Epochen teilen.
- **Build-Chunk über 500 kB** — Aufteilung erst mit der Veröffentlichung.
- Wie nach Phase 2: Wake Lock, Vollbild und Bildrate am Referenz-Laptop im
  normalen Browser prüfen.
