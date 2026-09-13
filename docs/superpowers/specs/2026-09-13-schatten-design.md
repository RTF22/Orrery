# Phase 3b-2: Schattenwurf — Entwurf

Stand 13.09.2026. Zweiter Entwurf der Phase 3b nach dem Gürtel (3b-1,
`2026-09-13-guertel-design.md`). Gesamtentwurf: `2026-09-11-sonnensystem-design.md`,
Phase 3 verlangt „Schattenwurf: eine Mondfinsternis lässt sich über das
Datumsfeld nachstellen" und Ringschatten in beide Richtungen (3a-Entwurf,
Abschnitt Ringe).

## 1. Zuschnitt

Schatten von Körpern auf Körper innerhalb eines Planetensystems: Mond im
Planetenschatten (Mondfinsternis), Mondschatten auf dem Planeten
(Sonnenfinsternis, Galileische Transite), Mond auf Mond, Planet auf seinen
Ringen, Ringe auf dem Planeten. Dazu die Färbung des Kernschattens durch
eine Atmosphäre (Blutmond), ein Schalter „Schatten" im Anzeigepanel und eine
Kinoszene, die die nächste echte Mondfinsternis zeigt.

Der Gesamtentwurf sah Shadow-Maps mit PCF vor. Dieser Entwurf ersetzt das
durch eine analytische Rechnung im Fragment-Shader (Entscheidung vom
13.09.2026, Begründung in Abschnitt 2). Die Qualitätsstufen-Tabelle des
Gesamtentwurfs verliert damit die Zeile „Schatten aus / einfach / PCF weich":
Schatten sind in jeder Stufe an, gesteuert nur über den Schalter.

## 2. Entscheidungen

- **Analytische Okkluder statt Shadow-Maps.** Drei Gründe. Erstens die
  Maßstäbe: Ein Mondschatten auf der Erde ist rund 100 km breit auf einem
  Planeten von 12 700 km, eine Shadow-Map müsste das mit einer Kamera
  auflösen, die zugleich das ganze Planetensystem fasst. Zweitens die
  logarithmische Tiefe über 30 Größenordnungen, an der ein Tiefenvergleich
  flimmert. Drittens der Halbschatten: Die Sonne ist eine Scheibe mit
  bekanntem Winkelradius, die Überlappung zweier Kreisscheiben ist geschlossen
  lösbar und liefert den Halbschatten exakt, wo PCF nur weichzeichnet. Die
  Rechnung kostet je Fragment wenige Skalarprodukte und braucht keine
  Qualitätsstufe.

- **Sonnenrichtung und Sonnenwinkel aus der echten Geometrie.** Der
  Schatten wird je Körper aus dem echten (unkomprimierten) Einheitsvektor
  Körper → Sonne und dem echten Winkelradius der Sonne α = asin(R☉ / d)
  gerechnet, aus `positionAt` in `sim/orbit.ts`. Okkluder und Fragment
  kommen dagegen aus den dargestellten Positionen. Das geht auf, weil
  `scaledPositionAt` (sim/scale.ts) Radien und Mondabstände beide mit
  `sizeScale` skaliert: Innerhalb eines Planetensystems ist die dargestellte
  Geometrie der echten exakt ähnlich, und Ähnlichkeit erhält Winkel. Der
  Sonnenwinkel als Zahl macht die Rechnung unabhängig davon, wo die
  dargestellte (gedämpfte, komprimiert nahe) Sonne steht. Würde stattdessen
  die dargestellte Sonnenposition benutzt, stünde bei „Schaubild" der Mond
  50-fach weiter von der Erde, die Sonne aber bei 1 AE — die Sonnenrichtung
  am Mond wiche um 7° von der an der Erde ab, und der Erdschatten läge am
  falschen Ort. Bekannte Folge, die dieser Entwurf nicht behebt: Der
  Terminator kommt weiterhin vom Punktlicht am komprimierten Ort und ist bei
  „Schaubild" bis zu 7° gegen die Schattenrichtung versetzt; bei Vollmond
  unsichtbar, bei „Realistisch" null.

- **Kugel-Okkluder.** Für ein Fragment mit Position p, Okkluder mit
  Mittelpunkt c und Radius R (dargestellte Werte): Winkelradius
  β = asin(R / |c − p|), Winkelabstand γ zwischen Sonnenrichtung und
  (c − p) / |c − p|. Der unverdeckte Anteil f ∈ [0, 1] ist die Fläche der
  Sonnenscheibe (Radius α) außerhalb der Okkluderscheibe (Radius β) im
  Abstand γ, geteilt durch die Sonnenfläche — die Kreisschnitt-Formel in
  Kleinwinkelnäherung (α, β < 0,01 rad in jedem Fall, den der Katalog
  kennt). Sonderfälle: γ ≥ α + β → 1; γ ≤ |α − β| und β ≥ α → 0; γ ≤ β − α
  ist nur mit β ≥ α möglich; β < α und γ ≤ α − β → 1 − (β/α)². Okkluder
  hinter dem Fragment (Skalarprodukt mit der Sonnenrichtung negativ) und
  das Fragment selbst (der eigene Körper ist nie Okkluder) zählen nicht.

- **Ring-Okkluder.** Strahl vom Fragment in Sonnenrichtung gegen die
  Ringebene (Mittelpunkt, Normale = Ringpol, Innen- und Außenradius,
  dargestellte Werte). Trifft der Strahl die Ebene im Ringbereich, ist der
  Durchlass 1 − Alpha der Ringtextur an u = (r − innen) / (außen − innen),
  also dieselbe Textur, die `rings.ts` zeichnet. Keine
  Sonnenscheiben-Verwischung: Die Halbschattenbreite eines Rings auf Saturn
  ist Ringabstand × α ≈ 100 000 km × 0,0005 = 50 km und damit unter einem
  Pixel in jeder Szene. Ringe gibt es bei Saturn (Textur) und Uranus
  (Profilstreifen); der Planet-Shader bekommt die Textur seines eigenen
  Rings, der Mond-Shader die des Mutterplaneten.

- **Blutmond.** Der Kernschatten ändert keine Helligkeit, nur die Farbe des
  Nachtseiten-Fülllichts. Physikalisch ist der verfinsterte Mond rund
  10⁻⁴ der Vollmondhelligkeit — nach der Belichtung des Renderers schwarz.
  Sichtbar ist die Nachtseite nur über das Fülllicht (`nightFill`,
  lighting.ts), ein Gestaltungswert. Deshalb: Im Schatten wird das Emissiv
  mit (1 − f) zur Kernschattenfarbe des Okkluders hin gemischt,
  `emissive · mix(1, farbe, 1 − f)`. Bei Nachtseite 0 bleibt der
  verfinsterte Mond schwarz, wie physikalisch. Die Erde bekommt als einziger
  Körper eine Farbe: lineares RGB (1,00 / 0,30 / 0,10), ein Gestaltungswert
  nahe einer Farbtemperatur von 2500 K, wie sie das durch die Erdatmosphäre
  gebrochene Sonnenuntergangslicht hat (Danjon-Skala L2–L3, „dunkelrot bis
  ziegelrot"). Körper ohne Eintrag färben neutral (1 / 1 / 1). Bei mehreren
  Okkludern multiplizieren sich die Faktoren.

- **Auswahl der Okkluder je Körper und Bild** auf der CPU, höchstens vier
  Kugeln und ein Ring je Körper. Mond: Mutterplanet, dessen Ringe, dazu die
  drei Geschwistermonde mit größtem Winkelradius vom Mond aus gesehen.
  Planet: die vier Monde mit größtem Winkelradius vom Planeten aus, dazu die
  eigenen Ringe. Ringe: nur der Planet. Sonne, Zwergplaneten ohne Monde,
  andere Planeten und die Gürtel: nie Okkluder, nie beschattet. Die Auswahl
  ist eine reine Funktion (Positionen, Radien) → (Liste) und wird unter
  `node` getestet.

- **Einbau in `MeshStandardMaterial`** über `onBeforeCompile`, nicht über
  ein eigenes Material: Die Körper behalten Textur, Lambert-BRDF und das
  Emissiv-Fülllicht aus 3a. Der Baustein wird nach
  `#include <lights_fragment_end>` eingefügt und multipliziert
  `reflectedLight.directDiffuse` und `directSpecular` mit dem Produkt der
  Okkluderfaktoren; das Emissiv wird nach `#include <emissivemap_fragment>`
  gefärbt. Weil die Szene genau ein Licht hat (das Punktlicht in scene.ts),
  ist der Direktanteil insgesamt der Sonnenanteil. Uniforms:
  `uSonnenRichtung` (vec3, Einheitsvektor in Render-Koordinaten),
  `uSonnenWinkel` (float, rad), `uOkkluder[4]` (vec4: Mitte in
  Render-Einheiten kamerarelativ, Radius), `uOkkluderFarbe[4]` (vec3),
  `uOkkluderAnzahl` (int), `uRingEbene` (Mitte, Normale, innen, außen als
  zwei vec4), `uRingAktiv` (float), `tRingSchatten` (sampler2D).

- **Ring-Shader** (`rings.ts`): zwei Uniforms mehr, `uPlanetOkkluder`
  (vec4) und `uSonnenWinkel`; der Term `direkt` wird mit f multipliziert,
  `uFuellung` und `streu` nicht. Die Vorwärtsstreuung im Planetenschatten
  ist physikalisch tatsächlich fort, aber sie ist bereits ein
  Gestaltungswert am Gegenlicht; sie unangetastet zu lassen hält den
  Ringdurchflug (Szene `ringdurchflug`) unverändert.

- **Schalter** `display.shadows` (Standard an) im Anzeigepanel, Text
  `display.shadows: 'Schatten'` in `ui/i18n/de.ts`. Aus setzt
  `uOkkluderAnzahl` 0 und `uRingAktiv` 0, das Material wird nicht neu
  kompiliert. Der Schalter ist zugleich das Messwerkzeug der Sichtprüfung
  (Differenzbild an gegen aus).

## 3. Finsternis-Suche (`sim/finsternis.ts`)

Reine Funktion `naechsteMondfinsternis(jdStart)` → `{ eintrittJd, maximumJd,
austrittJd, art: 'total' | 'partiell' }`, ohne Renderer. Geozentrisch aus
`positionAt`: Mondvektor m, Sonnenvektor s. Winkelabstand θ zwischen m̂ und
−ŝ. Kernschattenradius in Mondentfernung r_u = 1,02 · (R⊕ − |m| ·
tan(asin((R☉ − R⊕) / |s|))), die 2 % nach Chauvenet für die Erdatmosphäre
(so auch Meeus, Astronomical Algorithms, Kapitel 54). Partiell, wenn
θ · |m| < r_u + R☾; total, wenn θ · |m| < r_u − R☾.

Suche: ab jdStart in Schritten von 0,25 d nach lokalen Minima von θ (jedes
Minimum ist ein Vollmond); Verfeinerung des Minimums durch goldenen Schnitt
über ±0,5 d; erfüllt das Minimum die Partiell-Bedingung, folgen Eintritt
und Austritt durch Bisektion auf θ · |m| = r_u + R☾ links und rechts vom
Maximum. Sonst weiter zum nächsten Vollmond. Obere Schranke 3 Jahre (dann
`null`, was in der Praxis nicht vorkommt: Mondfinsternisse folgen im
Abstand von höchstens einem Jahr).

Genauigkeit: Die Mondbahn ist ein mittleres Kepler-Modell mit säkularen
Raten (data/bodies/moon.ts, Meeus-Elemente). Die großen periodischen
Störungen (Evektion ±1,3°, Variation ±0,7°) fehlen; in der Länge entspricht
das bis zu ±4 h Versatz im Zeitpunkt, in der Breite bleibt der Fehler unter
0,3°. Ob eine Finsternis stattfindet, hängt an der Breite bei Vollmond, also
an Knoten und Inklination — beide mit Rate im Modell. Die Tests fordern
deshalb den Zeitpunkt auf ±4 h und die Art (total) exakt.

## 4. Kinoszene `mondfinsternis`

- Neuer Bahntyp `sichtlinie` in `ScenePath` (data/scenes.ts, Kamera in
  render/camera/cinema.ts): Die Kamera steht auf der Linie vom Blickziel
  (`lookAtId`) zum Standortkörper (`targetId`), `distanceInRadii`
  Standortradien vor dem Standortkörper, und blickt auf ihn. `azimuthDeg`
  und `elevationDeg` sind Versätze auf die Kugelkoordinaten dieser Linie, so
  wie bei den anderen Bahntypen additiv; `azimuthRateDegPerSec` läuft
  weiter. Damit sitzt die Kamera zwischen Erde und Mond dicht vor dem Mond
  und sieht die Seite, die der Erde zugewandt ist — bei Vollmond die
  beleuchtete, die der Erdschatten überquert.
- Neues optionales Szenenfeld `zeitpunkt?: 'naechste-mondfinsternis'`.
  `tickCinema` (app/cinema.ts) ruft beim Szenenwechsel auf eine Szene mit
  diesem Feld `naechsteMondfinsternis(time.jd)` und setzt `time.jd` auf
  `eintrittJd − 0,1 · (austrittJd − eintrittJd)`. Der Zeitraffer der Szene
  ist fest so gewählt, dass ein typischer Kernschattendurchgang (rund
  3,5 h) in die Szenendauer passt: 45 s Dauer, 0,0035 d/s. Der Zeitsprung
  bleibt nach der Szene bestehen — das Kino setzt heute schon den
  Zeitraffer und stellt ihn nicht zurück; die Zeit ist im Kino die des
  Kinos. Findet die Suche nichts (`null`), läuft die Szene ohne Sprung.
- Szene: `targetId: 'moon'`, `lookAtId: 'earth'`, `path: 'sichtlinie'`,
  `distanceInRadii: 4`, `elevationDeg: 8`, `azimuthDeg: 0`,
  `azimuthRateDegPerSec: 0,4`, `durationSec: 45`, `timeRateDaysPerSec:
  0,0035`, Variation: Azimut ±20°, Elevation ±6°, Abstand 0,8 … 1,3. Titel
  `scene.mondfinsternis: 'Mondfinsternis'` in de.ts. Der Katalog wächst auf
  19 Szenen; Director und Szenen-Engine bleiben unverändert bis auf den
  neuen Bahntyp.

## 5. Datenkatalog

`Appearance.umbra?: { color: string }` in sim/types.ts, sRGB-Hex wie
`appearance.color`; die Erde bekommt `'#ff9a5c'` (linear ≈ 1,00 / 0,32 /
0,11), mit Quellenkommentar (Danjon-Skala, Farbtemperatur). Keine anderen
Körper in diesem Entwurf: Für Venus, Mars, Titan und die Gasriesen gibt es
keine belastbare Farbangabe des gebrochenen Lichts; ein Eintrag ohne Quelle
widerspräche dem Vorgehen des Katalogs.

## 6. Prüfung

- Unit-Tests (`node`), alle ohne three-Rendering:
  - Kreisüberlappung: γ ≥ α + β → 1; kleiner Okkluder zentral →
    1 − (β/α)²; großer Okkluder zentral → 0; Symmetrie und Monotonie in γ;
    Ergebnis in [0, 1].
  - Okkluderauswahl: Mond bekommt Mutterplanet zuerst; Planet bekommt
    höchstens vier Monde, nach Winkelradius sortiert; Sonne und Gürtel nie;
    der eigene Körper nie.
  - Ringdurchlass: Strahl außerhalb des Ringbereichs → 1; Ringpol
    berücksichtigt (Uranus liegt).
  - Shader-Quelltext: Baustein und Uniforms sind im kompilierten Material
    enthalten (wie bei belts.ts, weil der Shader unter `node` nicht läuft).
  - Finsternis-Suche gegen drei totale Mondfinsternisse aus dem NASA-Kanon
    (Espenak): 21.01.2000 04:44 UT (jd 2451564,70), 16.07.2000 13:55 UT
    (jd 2451742,08), 21.01.2019 05:12 UT (jd 2458504,72). Maximum auf
    ±4 h, Art `total`. Dazu: Die Suche ab dem 01.02.2000 überspringt fünf
    Vollmonde ohne Finsternis und landet am 16.07.2000.
  - Datumsfeld: `dateToJd(2000-01-21)` plus Uhrzeit des Maximums setzt den
    Mond in den Kernschatten (θ · |m| < r_u − R☾) — das Phase-3-Kriterium
    als Test.
- Sichtprüfung mit Pixelwerten (Playwright, Differenzbild `display.shadows`
  an gegen aus, Verfahren wie in `docs/phase3b-guertel-abnahme.md`):
  - Szene `mondfinsternis` zum Maximum: Die Mondscheibe verliert gegenüber
    „Schatten aus" im Median mehr als 80 % ihrer Helligkeit, und im Rest
    dominiert Rot (R > 2 · B im Mittel der Scheibe). Halbwegs im Durchgang
    ist der Halbschattenrand als stetiger Übergang messbar (kein Sprung
    über mehr als 40 von 255 zwischen Nachbarpixeln längs des Randes).
  - Szene `saturn-streiflicht`: ein zusammenhängendes dunkles Band auf dem
    Planeten in Ringebene (Ringschatten) und ein dunkler Sektor des Rings
    hinter dem Planeten (Planetenschatten), beide als Differenz > 30 von 255
    über mehr als 500 Pixel.
  - Szene `galileisches-schattenspiel`: mindestens ein Mondschatten als
    zusammenhängender dunkler Fleck auf Jupiter innerhalb der 45 s
    (Io-Transite alle 1,77 d bei 0,5 d/s Zeitraffer).
  - Bildrate: Median der Framezeit mit Schatten an gegen aus in der
    Saturn-Szene, Unterschied unter 1 ms.
  - Abnahme in `docs/phase3b-schatten-abnahme.md`.

## 7. Abgrenzung

Nicht in diesem Entwurf: Schatten auf oder von Gürtelteilchen, Monde als
Okkluder auf Ringen, eine Sonnenfinsternis-Szene oder -Suche,
Atmosphärenglühen (eigener Punkt der Qualitätsstufen-Tabelle),
Kernschattenfarben für andere Körper als die Erde, Rückstellung der Zeit
nach der Kinoszene, Schatten durch andere Planeten, Korrektur des
Terminator-Versatzes bei komprimierten Presets.
