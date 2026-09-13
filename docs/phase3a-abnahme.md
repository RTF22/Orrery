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

## Nachtrag: Tagseite ferner Körper (13.09.2026)

Die Ursache der dunklen Tagseite lag nicht am Distanzausgleich selbst, sondern
an seiner Klemme: `bodyLighting` begrenzte die Farbverstärkung auf 12, rechnete
`dayLevel` aber ungeklemmt weiter. Die Verstärkung `E^-0,85` erreicht 12 schon
bei 4,3 AE; jenseits davon bekam das Material weniger, als die Formel versprach
— bei Pluto (30 AE, „Realistisch") 12 statt 324, also ein 27-fach zu dunkles
Tagniveau, während die Nachtseitenfüllung auf dem ungeklemmten Wert stand und
ferne Körper damit gleichmäßig grau statt beleuchtet erschienen. Der
Beleuchtungstest hatte diese Lücke im Kommentar benannt und ausdrücklich nur die
Rechengröße geprüft.

Behebung in `render/lighting.ts`: `dayLevel` ist jetzt `brightness · E ·
colorGain`, also die Größe, die das Material tatsächlich bekommt; die Klemme
liegt bei 1e5 und greift damit erst weit jenseits des Katalogs (Eris bei
vollem Ausgleich braucht rund 9 500). Ausbrennen ist ausgeschlossen, weil auf
dem Material `E^(1-c)` ankommt, jenseits von 1 AE also höchstens 1. Ein neuer
Test hält fest, dass `dayLevel` bis 97 AE dem Ausgleich `E^(1-c)` folgt; die
bestehenden 30-%- und 5-%-Schranken prüfen seither das gerenderte Niveau.
Testzahl 691.

Pixelmessung (Median der Scheibe, ohne Bahnlinien und Beschriftung, Preset
„Schaubild"):

| Körper | vorher | nachher |
|---|---:|---:|
| Pluto, Szene Nr. 9 | 25 | 43 |
| Charon, Szene Nr. 9 | 15 | 23 |
| Erde, Referenz bei 1 AE (Verstärkung 1, unverändert) | — | 51 |
| Enceladus, Szene Nr. 13 | — | 34 |

Pluto steht damit bei 84 % der Erde, passend zu `E^0,15` = 0,54 im linearen
Raum nach Tonemapping. Die Ringe gehen denselben Weg (`render/rings.ts` rechnet
`uTag` aus derselben geklemmten Verstärkung): In „Uranus gekippt" liegt `uTag`
jetzt bei 0,58 statt 0,33, Planet und Ringe sind im Bild klar getrennt, die
Planetenscheibe erreicht auf der Mittellinie einen Median von 77–81 ohne
Überstrahlung (99. Perzentil des Bildes 95). Was bleibt, ist die Gesamtbelichtung: Auch die Erde
liegt auf der vollen Tagseite nur bei einem Median von 51, weil der
Lambert-Anteil des Materials das Licht mit 1/π gewichtet und die Texturen
selbst mittelgrau sind (Enceladus-Karte: Median 115 von 255). Das betrifft
alle Körper gleichermaßen und ist eine Frage des Standardwerts von
`brightness`, nicht der Abstandsrechnung — siehe „Offene Punkte".

## Nachtrag: Zielbelichtung und Albedo (13.09.2026)

Seit dem vorigen Nachtrag sind drei Tasks abgeschlossen. Die Kamera belichtet
jetzt auf ihr eigenes Ziel statt auf einen festen Bezug (`targetExposure` in
`render/lighting.ts`, Belichtungsmesser mit Dämpfung im logarithmischen Raum
in `render/exposure.ts`). Jeder Körper trägt eine geometrische Albedo als
Katalogdatum (`PhysicalData.albedo`, 34 Körper, belegt aus NSSDC, JPL und
Nature). Beim Laden normiert `render/bodies.ts` jede Textur auf diese Albedo
(`render/albedo.ts`); Sonne, Sterne und die Beleuchtungsrechnung selbst
bleiben unverändert.

**Pixelwerte, Median (99. Perzentil in Klammern):**

| Körper / Größe | vorher | nach Zielbelichtung (Task 3) | nach Albedo (Task 6, korrigiert) |
|---|---:|---:|---:|
| Erde, Median (p99) | 51 | 114,5 (163,0) | 187,0 (242,0) |
| Pluto, Median (p99) | 43 | 92,0 (183,0) | 161,0 (231,0) |
| Charon, Median | 23 | — | — (nicht neu gemessen) |
| Enceladus, Median (p99) | 34 | — | 224,0 (237,0) |
| Uranus, Median Mittellinie (p99) | 77–81 | — | 185–190 (213,0) |
| Ringdurchflug, Anteil > 12 (p99 Bild) | 54,4 % (—) | — | 62,5 % (224,0) |
| Uranusring `uTag` | 0,58 | — | — |

Alle drei Schritte heben die Werte deutlich an, ohne die 250er-Schwelle zu
reißen (höchster Wert: Erde mit 242,0). Charon wurde in diesem Plan nicht neu
gemessen, weil Task 6 zur Kontrolle der Albedo-Normierung nur Erde, Pluto und
Enceladus fotografiert hat.

### Messung des Distanzausgleichs

Offene Frage aus Abschnitt 5 des Entwurfs: Verträgt die Systemschau eine
Senkung des Distanzausgleichs (`display.lightCompensation`, Standardwert
0,85) auf den Kandidatenwert 0,7? Gemessen an der Szene „Systemblick" (Nr. 4)
mit eingefrorener Simulationszeit (`cinema.elapsedSec` 20,12 s,
`time.paused: true`, `cinema.running: false`, damit beide Aufnahmen exakt
denselben Bildinhalt zeigen), Bahnlinien, Beschriftung und Marker aus:

| Körper | Position im Bild | Maximum @0,85 | Median @0,85 | Maximum @0,7 | Median @0,7 |
|---|---|---:|---:|---:|---:|
| Neptun | (625, 42), 1 Bildpunkt | 181 | 181 | 136 | 136 |
| Uranus | (417, 159), 2 Bildpunkte | 148 | 106,0 | 108 | 74,5 |

Beide Körper füllen bei dieser Systemschau nur 1–2 Bildpunkte ohne trennbare
Nachtseite, deshalb genügen Maximum und Median. Die Bildposition wurde über
die Kameraprojektion der tatsächlichen Körperposition bestätigt, nicht nur
optisch geschätzt (die Sonne desselben Bildes projiziert exakt auf die
Bildmitte 640/400).

Das Kriterium aus dem Entwurf (Neptun Maximum über 40, Median über 12) ist
beim Kandidatenwert 0,7 mit großem Abstand erfüllt (Neptun 136/136, Uranus
108/74,5 gegenüber 40 bzw. 12).

Der Distanzausgleich wirkt dabei nur auf das Verhältnis der Körper
zueinander, nicht auf die Helligkeit des Körpers, auf den die Kamera gerade
belichtet: `targetExposure` in `render/lighting.ts` setzt die Belichtung so,
dass am Ziel stets `EXPOSURE_REFERENCE · π` ankommt — der Faktor `E^(1-c)`
aus dem Distanzausgleich kürzt sich gegen seinen eigenen Kehrwert in der
Belichtung heraus. Deshalb ändert `lightCompensation` weder den Median noch
das 99. Perzentil von Erde, Pluto oder Enceladus in ihren eigenen Nahszenen
aus Task 6 (dort ist jeweils der gezeigte Körper selbst das Belichtungsziel);
diese Werte taugen nicht als Argument für eine Senkung. **Empfehlung:** Der
Distanzausgleich lässt sich auf 0,7 senken, allein gestützt auf das
Systemschau-Kriterium oben — Neptun und Uranus bleiben bei diesem Wert
deutlich sichtbar, während der Helligkeitsunterschied zwischen nahen und
fernen Körpern in solchen Weitwinkelblicken etwas physikalischer ausfällt.
Die Wahl bleibt eine Gestaltungsentscheidung über diese Staffelung, keine
durch Ausbrennen erzwungene Korrektur. Die Änderung des Standardwerts selbst
und die Neuherleitung der Schranken in `lighting.test.ts` bleiben ein
eigener, kleiner Folgetask (siehe „Offene Punkte").

Dieser Task ändert keinen Code; der automatische Testlauf bleibt bei 720
Tests.

### Folgetask: Standardwert gesenkt (13.09.2026)

Die Empfehlung ist umgesetzt: `display.lightCompensation` steht jetzt
standardmäßig auf 0,7 (`store/index.ts`). Der Regler bleibt, die
Serialisierung ändert sich nicht. Die Bildwerte der Systemschau bei 0,7
stehen in der Tabelle oben (Neptun 136, Uranus 108 bzw. 74,5); eine neue
Aufnahme war nicht nötig, weil sich am Renderweg nichts geändert hat und die
Messung denselben Wert über den Regler gesetzt hatte.

Die Regressionsschranken in `render/lighting.test.ts` („Standardeinstellung —
kein Körper bleibt schwarz") waren auf 0,85 kalibriert (Tagseite über 30 %,
Nachtseite über 5 % der Helligkeit, Eris ausgenommen) und sind neu
hergeleitet. Seit der Zielbelichtung ist `dayLevel` bei Helligkeit 1 genau
die Strahldichte einer weißen Fläche in der Systemschau, der einzigen
Ansicht, in der der Ausgleich über Sichtbarkeit entscheidet. Das Kriterium
des Entwurfs (40 bzw. 12 von 255) entspricht dort nach ACES und sRGB linear
rund 0,039 bzw. 0,013. Werte bei 0,7, Preset „Realistisch", J2000:

| Körper | Abstand [AE] | Tagseite | Nachtseite |
|---|---:|---:|---:|
| Ceres | 2,55 | 0,5708 | 0,1427 |
| Neptun | 30,12 | 0,1296 | 0,0324 |
| Pluto | 30,20 | 0,1294 | 0,0324 |
| Haumea / Makemake | 51,4 | 0,0941 | 0,0235 |
| Eris | 97,23 | 0,0642 | 0,0160 |

Neue Schranken: Tagseite über 0,06, Nachtseite über 0,015 der Helligkeit,
bei allen drei Maßstabs-Presets. Sie liegen über dem Kriterium des Entwurfs
und 7 % unter Eris; damit prüft der Block jetzt **alle** Körper, die
Ausnahme für Eris entfällt. Ein versehentlich gesenkter Ausgleich fiele auf
(0,65 drückt Eris auf 0,041). Ein weiterer Test hält den Standardwert selbst
mit Verweis auf diese Messung fest. Testlauf: 721 Tests.

## Nachtrag: Geräteprüfung — Wake Lock, Vollbild, Bildrate (13.09.2026)

Prüfgerät: ASUS-Desktop (kein Laptop), NVIDIA GeForce RTX 4060, Monitor
2560×1440 bei 59 Hz, Windows 11 Home, Chrome 152, Produktionsbuild über
`vite preview`. Damit sind die seit Phase 2 offenen Gerätefragen beantwortet,
mit der Einschränkung, dass es ein Desktop mit dedizierter Grafik ist.

**Echtes Vollbild.** Im gewöhnlichen Chrome (eigenes leeres Profil, keine
Automatisierungsflags) startet die Taste `C` den Kino-Modus. Danach misst das
Chrome-Fenster per `GetWindowRect` 0,0 bis 2560,1440, und der Bildschirmabzug
des ganzen Monitors zeigt nur die Szene mit Chromes Esc-Hinweis. Das Vollbild
bleibt auch bestehen, während der Film wegen einer Eingabe pausiert.
Hinweis für künftige Prüfungen: Im Playwright-Chrome meldet
`document.fullscreenElement` zwar das `HTML`-Element, das Fenster bleibt aber
bei der erzwungenen Ansichtsgröße (1280×800) — Vollbild ist nur im
gewöhnlichen Browser belegbar.

**Wake Lock.** `powercfg /requests` (braucht erhöhte Rechte; ein per UAC
bestätigter Helfer hat es alle 3 s protokolliert) listet unter `DISPLAY`
den Eintrag `chrome.exe — Blink Wake Lock`, sobald der Film läuft:

| Zeit | Ereignis | Eintrag in `powercfg /requests` |
|---|---|---|
| 11:09:45 | Taste `C`, Kino startet | — |
| 11:09:47 – 11:09:53 | Film läuft | vorhanden |
| 11:09:56 – 11:10:23 | Film durch Eingabe pausiert (Mausbewegung zählt, `idle.ts`); Bildschirmabzug zeigt die eingeblendete Oberfläche | fehlt |
| 11:10:26 – 11:10:35 | Wiederaufnahme nach 30 s Ruhe | vorhanden |

Das ist genau das vorgesehene Verhalten: `useWakeLock(cinema.running)` hält
die Sperre nur, solange der Film läuft, und fordert sie nach der
Wiederaufnahme neu an. Der Eintrag ist die Display-Anforderung, die den
Bildschirm-Timeout des Systems (hier 120 min am Netz) aussetzt — das System
hält die Sperre also tatsächlich. Firefox wurde nicht geprüft.

**Bildrate.** 20 s Aufzeichnung über `requestAnimationFrame` im laufenden
Kino-Modus, Ansicht und Canvas 2560×1440 (DPR 1):

| Größe | 2560×1440 | 1280×800 |
|---|---:|---:|
| Frames | 1 200 | 1 200 |
| Median-Framezeit | 16,70 ms | 16,70 ms |
| 95. Perzentil | 16,80 ms | 16,80 ms |
| 99. Perzentil | 16,80 ms | 16,80 ms |
| Maximum | 17,10 ms | 16,90 ms |
| Frames über 25 ms | 0 | 0 |

Durchgehend an der Bildsynchronisation (59 Hz), unabhängig von der
Auflösung, deckungsgleich mit der Messung aus Phase 2. Zielgeräte sind laut
Auftraggeber (13.09.2026) Browser mit GPU-Unterstützung; eine gesonderte
Messung auf integrierter Grafik entfällt damit.

## Offene Punkte

- **Sechs Körper ohne Textur** (fünf Uranusmonde, Deimos), begründet in
  `ASSETS.md`; die Ausweichfarbe trägt sie. Bleibt offen, bis eine amtliche
  Karte mit weniger als etwa 40 % Datenlücke auftaucht.
- **Fixture-Epochen** decken 1976 bis 2076 ab (−24 bis +76 Jahre um J2000) statt
  der im Entwurf genannten ±50 Jahre; die Stichtage stammen aus der
  Horizons-Abfrage von Task 6 und wurden für die weiteren Mondsysteme
  beibehalten, damit alle Monde dieselben Epochen teilen.
- **Build-Chunk über 500 kB** — Aufteilung erst mit der Veröffentlichung.
