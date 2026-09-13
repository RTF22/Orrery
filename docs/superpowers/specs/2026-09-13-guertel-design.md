# Phase 3b-1: Asteroiden- und Kuipergürtel — Entwurf

Stand: 13.09.2026, Branch `guertel`, aufgesetzt auf master (da98f1a).

## 1. Zuschnitt

Phase 3b wird in zwei getrennten Entwürfen umgesetzt (siehe
`docs/superpowers/specs/2026-09-12-phase3a-katalog-design.md`, Abschnitt 1).
Dieser Entwurf behandelt nur die **Gürtel**: den Hauptgürtel zwischen Mars und
Jupiter und den Kuipergürtel jenseits Neptuns, jeweils als eine instanzierte
Punktwolke mit einem Draw-Call. Schattenwurf ist der zweite Entwurf (3b-2) und
bleibt hier unberührt; `render/lighting.ts` und `render/albedo.ts` werden nicht
verändert.

## 2. Entscheidungen

- **Darstellung als `THREE.Points` mit eigenem ShaderMaterial**, nicht als
  `InstancedMesh`: Bei jedem Maßstab ist ein Gürtelkörper kleiner als ein Pixel;
  Geometrie je Instanz brächte nur Kosten. Punktgröße in Pixeln, mit der Nähe
  leicht wachsend, gedeckelt auf wenige Pixel.
- **Bahnrechnung im Vertex-Shader.** Jedes Teilchen trägt seine Bahnelemente als
  Attribute (`a`, `e`, `i`, `Ω`, `ω`, `M0`, `n`). Der Shader löst die
  Keplergleichung (fünf Newton-Schritte genügen bei e ≤ 0,4), dreht in die
  Ekliptik, wendet die Abstandskompression `r' = A·(r/A)^k` an (dieselbe
  Formel wie `compressDistance` in `sim/scale.ts`, Fixpunkt 1 AE) und zieht
  die Kameraposition ab. Die CPU sendet pro Frame nur Uniforms — 50 000
  Keplerlösungen pro Frame in JavaScript wären der teuerste Teil der Szene.
- **Rechnung im Shader in AE**, erst am Ende Umrechnung in Render-Einheiten.
  Float32 in AE hat bei 3 AE eine Auflösung von rund 50 km, bei 40 AE rund
  600 km — für Punkte ohne Ausdehnung unsichtbar. Die Zeit geht als **Tage
  seit J2000** hinein (Größenordnung 10⁴, Auflösung rund eine Minute), nie
  als volles Julianisches Datum (Float32-Auflösung dort: ein Vierteltag).
- **Deterministische Verteilung** aus `sim/random.ts` (Mulberry32) mit festem
  Keim: Gleicher Keim und gleiche Anzahl ergeben identische Attribute; die
  Verteilungsfunktionen sind reine Funktionen ohne `three`-Import und werden
  in der `node`-Umgebung getestet.
- **Beleuchtung** wie die Ringe (`rings.ts`): Ein Uniform `uTag` aus
  `brightness · colorGain · irradianceFactor` am mittleren Gürtelabstand, dazu
  ein Faktor `1/π` wie beim Lambert-Anteil. Kein eigener Abfall je Teilchen —
  der Gürtel ist radial schmal genug, dass ein Wert pro Gürtel reicht.
  Albedo 0,06 (C-Typ-Asteroiden, dunkel); die Sichtbarkeit kommt über die
  Punktgröße, nicht über eine falsche Helligkeit. Die Sichtprüfung misst,
  dass Teilchen im Ceres-Kino nicht unter 40 von 255 fallen; falls doch, wird
  die Albedo im Entwurf begründet angehoben, nicht die Beleuchtung.
- **Qualitätsstufen** wie im Gesamtentwurf: 0 / 10 000 / 50 000 Teilchen für
  niedrig / mittel / hoch; `auto` verhält sich wie `medium`, so wie beim
  Pixeldichte-Deckel in `app/main.tsx`. Ein Stufenwechsel baut die Geometrie
  neu auf; das passiert selten und darf einen Frame kosten.
- **Sichtbarkeit** über `display.belts` (Standard an) im Anzeigepanel, Text
  `display.belts: 'Gürtel'` in `ui/i18n/de.ts`. Bahnlinien-Deckkraft und
  Beschriftungen bleiben unbeeinflusst.

## 3. Verteilungen

### 3.1 Hauptgürtel

| Größe | Verteilung | Quelle/Begründung |
|---|---|---|
| Halbachse a | 2,1 bis 3,3 AE, Dichte ∝ Glockenkurve um 2,7 AE (σ 0,35 AE), moduliert mit Kirkwood-Lücken | Verteilung der nummerierten Asteroiden (MPC), Näherung |
| Kirkwood-Lücken | Gauß-Einbrüche auf 10 % Restdichte bei 2,065 (4:1), 2,502 (3:1), 2,825 (5:2), 2,958 (7:3), 3,279 AE (2:1); Halbwertsbreite 0,02–0,03 AE | Resonanzen mit Jupiter, a = a_J·(p/q)^(2/3) mit a_J = 5,2044 AE |
| Exzentrizität e | Rayleigh, σ 0,10, gedeckelt bei 0,35 | mittlere e ≈ 0,14 |
| Inklination i | Rayleigh, σ 6°, gedeckelt bei 30° | mittlere i ≈ 8° |
| Ω, ω, M0 | gleichverteilt 0–2π | keine Bevorzugung |
| n | √(GM_☉ / a³), rad/Tag | Kepler-3 |

Hildas (3:2, 3,97 AE) und Jupiter-Trojaner (L4/L5) sind ein eigener,
späterer Task — sie brauchen eine Kopplung an Jupiters Position.

### 3.2 Kuipergürtel

| Größe | Verteilung |
|---|---|
| a | 39 bis 48 AE (klassischer Gürtel), Dichte gleichmäßig mit weichem Rand; dazu 15 % Plutinos in 3:2 bei 39,4 AE (σ 0,3 AE) |
| e | Rayleigh σ 0,05 (klassisch), Plutinos σ 0,15, Deckel 0,35 |
| i | Rayleigh σ 3° (kalt) für 60 %, σ 12° (heiß) für 40 %, Deckel 35° |
| Winkel, n | wie oben |

Die Zusammensetzung gilt als Näherung an die beobachtete Population und ist
im Code je Wert kommentiert.

## 4. Abstandskompression

Der Gürtel muss bei jedem Preset dort liegen, wo Ceres und Pluto liegen:
Beide Körper werden über `scaledPositionAt` komprimiert, also gilt für
jedes Teilchen dieselbe Formel auf dem heliozentrischen Vektor. Prüfung: Bei
`kompakt` (k = 0,4) liegt der Hauptgürtel bei 2,1^0,4 … 3,3^0,4 = 1,35 … 1,61 AE
dargestellt; Ceres (2,77 AE) bei 1,50 AE — mitten im Gürtel.

## 5. Prüfung

- Unit-Tests (`node`): Determinismus, Wertebereiche, Kirkwood-Einbruch
  (Dichte bei 2,502 ± 0,01 AE unter 25 % der Nachbarschaft), mittlere e und i
  im erwarteten Bereich, Anzahl je Qualitätsstufe.
- Sichtprüfung mit Pixelmessung im Ceres-Kino (`ceres-guertel`) und aus der
  Systemschau: Teilchen sichtbar, Lücken bei 2,5 AE und 3,28 AE als dunkle
  Ringe erkennbar (Radialprofil aus dem Screenshot über Pillow); Framezeit
  bei 50 000 Teilchen im Median unter 20 ms.

## 6. Abgrenzung

Nicht in diesem Entwurf: Schattenwurf, Hildas und Trojaner (Folgetask nach
dem ersten sichtbaren Ergebnis), Streuscheibe und Oortsche Wolke, klickbare
oder benannte Einzelasteroiden, Beschriftung der Gürtel.
