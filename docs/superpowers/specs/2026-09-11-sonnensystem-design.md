# Design-Dokument: Interaktive 3D-Simulation des Sonnensystems

- **Datum:** 2026-09-11
- **Status:** Entwurf zur Freigabe
- **Grundlage:** `solar_prompt.txt` und das darauf folgende Brainstorming-Interview

---

## 1. Zielsetzung

Eine vollständig clientseitige, browserbasierte 3D-Simulation des Sonnensystems, die
**gleichrangig** zwei Ansprüche erfüllt:

- **Lernwerkzeug** — die dargestellten Zahlen und Bahnen sind echt und überprüfbar,
  nicht dekorativ nachempfunden.
- **Showpiece** — die Szene sieht beeindruckend aus und läuft flüssig, auch als
  Dauerlauf-Dekoration auf einem zweiten Bildschirm.

Wo beide Ansprüche kollidieren, wird der Konflikt nicht durch Kompromiss aufgelöst,
sondern durch Trennung: Die **Simulation rechnet immer physikalisch korrekt**, die
**Darstellung darf überhöhen** — und der Grad der Überhöhung ist eine bedienbare
Einstellung, kein fest verdrahteter Kompromiss.

### Zwei Nutzungsmodi

| Modus | Beschreibung |
|---|---|
| **Explorer** | Umfangreiches, strukturiertes Bedien-UI; der Benutzer stellt alles ein. |
| **Kino** | UI und Mauszeiger ausgeblendet, echtes Vollbild, automatische Kamerafahrten. |

---

## 2. Entscheidungen aus dem Interview

| Thema | Entscheidung | Begründung |
|---|---|---|
| Anspruch | Lernwerkzeug **und** Showpiece gleichrangig | Ausdrückliche Wahl des Auftraggebers; das Umfangsrisiko wird über die Phasen-Roadmap gesteuert, nicht über Weglassen. |
| Bahnmodell | Analytisch/Kepler, datengetrieben | Zustandslos: Position ist eine Funktion der Zeit. Zeitsprung, Rückwärtslauf und extreme Zeitraffung kosten gleich viel. Gegen Referenzwerte unit-testbar. |
| Maßstab | Getrennte Regler (Größe / Abstand) + rastende Presets + Marker-Glyphen | Erlaubt echtes 1:1 als Lernerlebnis **und** ein gut aussehendes Schaubild, ohne zwei Codepfade. |
| Katalog | Kuratierter Kern (~35 Körper) | Deckt praktisch alles Sehenswerte ab; jeder weitere Körper kostet Datenpflege ohne Erkenntnisgewinn. |
| Kino-Modus | Kuratierte Szenen-Playlist + prozedurale Variation + Ambient-Sound (Phase 5) | Kuratiert garantiert gute Bilder; Variation verhindert das Wiederholungsgefühl. Bewusst **ohne** Info-Inserts. |
| Plattform | Desktop-first, Mobile vollwertig bedienbar | Das Hauptszenario ist inhärent Desktop; Mobile bekommt echte Touch-Bedienung und automatisch abgesenkte Qualität. |
| Stack | Three.js (imperativ) + TypeScript + Vite + React + Zustand + Tailwind | Die 3D-Schleife bleibt vom UI-Rendering unberührt; ein serialisierbarer Store deckt Presets, URL-Sharing und Wiederherstellung mit einem Mechanismus ab. Bewusst **nicht** react-three-fiber. |
| Auslieferung | Git lokal, Repository **privat bis zur Fertigstellung**; GitHub Pages erst zum Abschluss | Rein statisch, kein Backend. Während der Entwicklung baut und testet die CI nur — veröffentlicht wird nichts. |
| Reihenfolge | Durchstich → **Kino-Modus** → Katalog → Komfort → Sound/Politur | Auf Wunsch des Auftraggebers wurde der Kino-Modus vorgezogen. Der übliche Nachteil (frühe Szenen zeigen nur Planeten) wird dadurch entschärft, dass Szenen reine Daten sind — der spätere Katalog-Ausbau fügt Szenen hinzu, statt die Engine zu ändern. |

---

## 3. Architektur

### 3.1 Schichtenmodell

Vier Schichten mit **streng einseitiger Abhängigkeit** — jede Schicht kennt nur die
unter ihr liegenden:

```
  ui/      React-Komponenten, DOM, Eingaben
    |  liest/schreibt ausschließlich
    v
  store/   Zustand — einzige Wahrheitsquelle, serialisierbar
    ^
    |  liest
  render/  Three.js-Szenengraph, Kamera, Post-Processing
    |  liest
    v
  sim/     reine Funktionen, kein Three.js, kein DOM
    |  liest
    v
  data/    Himmelskörper und Szenen als reine Datensätze
```

Der entscheidende Schnitt liegt zwischen `sim/` und `render/`: `sim/` hat **keine
einzige** Abhängigkeit auf Three.js oder das DOM. Daraus folgt unmittelbar, dass die
Bahnberechnung in einer reinen Node-Umgebung getestet werden kann — das ist der
Grund für diesen Schnitt, nicht bloß eine angenehme Nebenwirkung.

### 3.2 `data/` — der Katalog

Reine Daten, kein Verhalten. Jeder Himmelskörper ist **ein** Datensatz mit vier Blöcken:

```ts
interface Body {
  id: string;                 // 'mars', 'europa'
  parent: string | null;      // 'sun' | 'jupiter' | null
  kind: 'star' | 'planet' | 'moon' | 'dwarf';

  orbit: {                    // Bahnelemente zur Epoche J2000 + säkulare Raten
    a: number;  aDot: number;      // große Halbachse [AE], Rate [AE/Jh]
    e: number;  eDot: number;      // Exzentrizität
    i: number;  iDot: number;      // Inklination [Grad]
    L: number;  LDot: number;      // mittlere Länge [Grad]
    lp: number; lpDot: number;     // Länge des Perihels [Grad]
    node: number; nodeDot: number; // Länge des aufsteigenden Knotens [Grad]
    frame: 'ecliptic' | 'parentEquator';
  };

  physical: {                 // echte Werte, Quelle der Infopanel-Zahlen
    radiusKm: number; massKg: number;
    rotationPeriodH: number; axialTiltDeg: number;
    rotationAtEpochDeg: number;
  };

  appearance: {               // rein darstellerisch
    textures: { albedo: string; normal?: string; specular?: string; emissive?: string };
    color: string;            // Fallback sowie Marker- und Bahnlinienfarbe
    atmosphere?: { colorInner: string; colorOuter: string; heightKm: number };
    rings?: { innerKm: number; outerKm: number; texture: string };
  };

  info: { nameKey: string; descriptionKey: string; facts: FactRef[] };
}
```

Einen Mond hinzuzufügen heißt: **eine Datei anlegen.** Nirgendwo sonst wird etwas
geändert. Das ist die datengetriebene Konfiguration, die der Prompt fordert.

Ebenfalls in `data/`: die Kinoszenen (Abschnitt 8), der Sternkatalog und die
Verteilungsparameter der Gürtel.

### 3.3 `sim/` — reine Funktionen

Kernschnittstelle:

```ts
positionAt(body: Body, jd: number): Vec3   // heliozentrisch, ekliptikal J2000, in km
velocityAt(body: Body, jd: number): Vec3   // km/s, für Verfolgungskamera und Infopanel
rotationAt(body: Body, jd: number): number // Rotationsphase in rad
```

Alles in Float64. Keine Zwischenspeicherung von Zustand zwischen Frames — der einzige
Eingang ist die Zeit.

### 3.4 `render/` — Three.js, imperativ

Baut den Szenengraph aus `data/` auf und aktualisiert ihn pro Frame aus `sim/` und
`store/`. Enthält Körper-Meshes, Bahnlinien, Ringe, Gürtel, Sternenhintergrund,
Label-Overlay, Kamera-Rig und Post-Processing.

### 3.5 `ui/` — React

Rendert ausschließlich DOM. Läuft in Reacts eigenem Zyklus, **völlig getrennt** von
der `requestAnimationFrame`-Schleife des Renderers. Ein UI-Rerender kann die Bildrate
daher konstruktionsbedingt nicht stören.

### 3.6 `store/` — die einzige Wahrheitsquelle

Ein Zustand-Store hält den **kompletten** einstellbaren Zustand:

```ts
interface AppState {
  time:    { jd: number; rateDaysPerSec: number; paused: boolean };
  scale:   { sizeScale: number; distanceExponent: number; sunDamping: number; preset: string | null };
  display: { orbits, labels, axes, shadows, bloom, atmospheres,
             markers, textureQuality, brightness, lightFalloff };
  camera:  { mode: 'free' | 'attached' | 'follow' | 'cinematic';
             targetId: string; distance: number; azimuth: number; elevation: number };
  visible: Record<string, boolean>;
  cinema:  { playing: boolean; sceneIndex: number; shuffle: boolean; seed: number };
  quality: { tier: 'auto' | 'low' | 'medium' | 'high' };
  ui:      { hidden: boolean; panels: Record<string, boolean>; language: 'de' | 'en' };
}
```

Weil dieser Zustand vollständig und serialisierbar ist, sind **Presets, URL-Sharing und
Sitzungswiederherstellung nicht drei Features, sondern drei Aufrufe derselben
Serialisierungsfunktion.** Das ist der eigentliche Grund für diesen Entwurf.

`time.jd` ist der einzige Wert, der sich pro Frame ändert und trotzdem im Store liegt.
Um 60 React-Rerenders pro Sekunde zu vermeiden, abonnieren Zeitanzeigen ihn gedrosselt
(etwa 5 Hz); der Renderer liest ihn direkt ohne Abonnement.

---

## 4. Simulationsmodell

### 4.1 Zeit

Einzige Zeitgröße im gesamten System ist das **Julianische Datum** (JD). J2000.0
entspricht 2451545.0. Pro Frame gilt `jd += rateDaysPerSec * dt`; ein negativer Wert
ist der Rückwärtslauf, null die Pause. "Sprung zu Datum" und "Jetzt" setzen `jd`
einfach neu.

Es gibt keinen Sonderfall für schnelle Zeitraffung, weil keine Integration
stattfindet — bei 1000 Jahren pro Sekunde wird exakt dieselbe Funktion mit einem
anderen Argument ausgewertet.

Zeitzonen und Kalenderumrechnung (bürgerliches Datum zu JD und zurück) liegen in
`sim/time.ts`, inklusive gregorianischer Schaltjahresregel.

### 4.2 Bahnberechnung

Für jeden Körper zur Zeit `jd`:

1. `T = (jd - 2451545.0) / 36525` — Jahrhunderte seit J2000
2. Elemente linear fortschreiben: `a = a0 + aDot * T` und so weiter
3. Mittlere Anomalie `M = L - lp`, normiert auf den Bereich -180 bis +180 Grad
4. Kepler-Gleichung `M = E - e * sin(E)` per **Newton-Iteration** lösen
   (Startwert `E0 = M + e * sin(M)`, Abbruch bei einer Änderung unter 1e-12 rad,
   harte Grenze 30 Iterationen)
5. Position in der Bahnebene aus `E` berechnen, dann über Perihelargument,
   Inklination und Knotenlänge in die Ekliptik drehen
6. Bei Monden: Ergebnis in die Äquatorebene des Mutterkörpers drehen und dessen
   heliozentrische Position addieren

**Datengrundlage:** der Standish-Elementsatz für die großen Planeten, gültig
1800–2050. Die Genauigkeit liegt im Bereich von Bogenminuten — auf dem Bildschirm
nicht von exakten Ephemeriden unterscheidbar, aber um Größenordnungen besser als
geschätzte Kreisbahnen. Außerhalb des Gültigkeitsfensters zeigt die UI einen
Genauigkeitshinweis; gerechnet wird trotzdem weiter.

### 4.3 Eigenrotation

Die Rotationsphase ergibt sich aus Epochenphase, verstrichener Zeit und
Rotationsperiode, modulo einer vollen Umdrehung. Die Achsneigung ist eine feste
Orientierung pro Körper; Präzession wird bewusst nicht modelliert, weil sie auf der
dargestellten Zeitskala unsichtbar bleibt.

Gebundene Rotation (Erdmond, Galileische Monde) ergibt sich automatisch daraus, dass
Rotationsperiode und Umlaufzeit gleich sind — kein Sonderfall im Code.

### 4.4 Bekannte Grenzen

- Keine Bahnstörungen zwischen Planeten (Kepler ist per Definition ein Zweikörperproblem)
- Keine Präzession der Rotationsachsen, keine Nutation
- Monde auf vereinfachter Laplace-Ebene statt exakter Bahnpolbewegung
- Volles Genauigkeitsfenster nur 1800–2050

Diese Grenzen werden im Infopanel unter "Modell" offen dokumentiert. Für ein
Lernwerkzeug ist die ehrliche Angabe der Grenzen Teil der Qualität.

---

## 5. Maßstabsmodell

Das Kernproblem: Die Sonne hat den 1400-fachen Durchmesser der Erde, Neptun steht
30 AE entfernt. Bei 1:1 sieht man nichts.

**Zwei unabhängige, logarithmische Regler:**

**Körpergröße** — der dargestellte Radius ist der echte Radius mal `sizeScale`. Weil
derselbe Faktor für alle Körper gilt, bleiben die **Größenverhältnisse untereinander
korrekt**, auch wenn alles gemeinsam aufgebläht wird. Die Sonne erhält einen
zusätzlichen Dämpfungsfaktor (`sunDamping`), weil sie sonst bei großem `sizeScale` das
innere System verschluckt; dieser Faktor ist sichtbar und abschaltbar, damit die
Überhöhung nicht heimlich passiert.

**Bahnabstände** — eine Potenzkompression mit Fixpunkt bei 1 AE:

```
r_dargestellt = A * (r_real / A)^k      mit A = 1 AE,  k zwischen 0.35 und 1.0
```

Bei `k = 1` ist die Darstellung exakt maßstabsgetreu. Sinkendes `k` staucht die
äußeren Bereiche stark und die inneren kaum — die Erde bleibt dabei ortsfest, was den
Regler beim Bedienen ruhig wirken lässt. Ein einfacher Multiplikator könnte das nicht
leisten: Er würde alles gemeinsam skalieren und das Problem nur verschieben.

**Presets** (rastend, Übergang wird über etwa 800 ms animiert):

| Preset | `sizeScale` | `k` | Charakter |
|---|---|---|---|
| Realistisch | 1 | 1.00 | Die ehrliche Leere. Der Lern-Aha-Effekt. |
| Schaubild | ~50 | 0.60 | Standardansicht, alles gut erkennbar. |
| Kompakt | ~200 | 0.40 | Alles gleichzeitig im Bild. |

**Marker-Glyphen:** Unterschreitet ein Körper etwa 3 Pixel projizierten Radius, wird
zusätzlich ein Punkt-Sprite mit Label eingeblendet, damit er auffindbar und anklickbar
bleibt. Abschaltbar für puristische Ansichten.

**Wichtig:** Alle Skalierung ist eine reine Render-Transformation. `sim/` und das
Infopanel arbeiten unverändert mit echten Kilometern.

---

## 6. Rendering

### 6.1 Präzision — zwei nicht verhandelbare Kniffe

Bei 30 AE Entfernung und Kilometer-Einheiten reicht die 32-Bit-Genauigkeit der GPU
nicht annähernd aus. Ohne diese beiden Maßnahmen wackeln entfernte Objekte sichtbar
und Ringe flimmern:

1. **Kamerarelatives Rendering** — Positionen werden in JavaScript mit Float64
   gerechnet, die Kameraposition wird abgezogen, und erst das Ergebnis geht als Float32
   an Three.js. Die Kamera sitzt im Szenenursprung.
2. **Logarithmischer Tiefenpuffer** (`logarithmicDepthBuffer: true`) — erlaubt
   Ringdetails und den Kuipergürtel in derselben Szene ohne Z-Fighting.

Renderer-Einheit: eine Einheit entspricht 1000 km (nach Skalierung). Die Werte `near`
und `far` der Kamera werden dynamisch aus der aktuellen Zielentfernung gesetzt.

### 6.2 Beleuchtung und Materialien

- Physikalisch basierte Materialien (`MeshStandardMaterial`) mit Albedo- und
  Normal-Map, wo sinnvoll zusätzlich Specular-Map (Erdozeane) und Emissive-Map
  (Erdnachtseite)
- Sonne als Punktlicht mit regelbarem quadratischem Abfall; der Regler erlaubt bewusst
  auch physikalisch falsche, dafür besser aussehende Werte für die äußeren Planeten
- Die Sonne selbst: emissives Material plus Glow-Sprite
- **Atmosphärenschimmer:** eine zweite, leicht größere Kugel mit Rückseiten-Rendering
  und Fresnel-Shader — die Opazität steigt zum Rand hin, was den Lichtsaum erzeugt
- Schattenwurf (Mond- und Sonnenfinsternisse, Ringschatten) erst in Phase 3

### 6.3 Post-Processing

`EffectComposer` mit **selektivem Bloom**, damit nur Sonne und Emissiv-Flächen
strahlen und nicht die ganze Szene milchig wird. Dazu dezentes Tonemapping (ACES) und
ein optionaler Filmkorn- und Vignettenanteil im Kino-Modus. Bloom ist die erste
Einstellung, die bei niedriger Qualitätsstufe entfällt.

### 6.4 Bahnlinien, Labels, Gürtel, Sterne

- **Bahnlinien:** vorab berechnete Polylinien (etwa 512 Stützpunkte), Neuaufbau nur bei
  Maßstabsänderung, nicht pro Frame. Die Deckkraft nimmt zum bereits durchlaufenen
  Bahnabschnitt hin ab, was die Bewegungsrichtung sichtbar macht.
- **Labels:** HTML-Overlay statt Textur-Text, damit die Schrift bei jedem Zoom scharf
  bleibt. Eine Kollisionsauflösung blendet überlappende Labels nach Wichtigkeit aus.
- **Gürtel:** je ein instanziertes Objekt mit 10 000 bis 50 000 Instanzen
  (qualitätsabhängig), verteilt aus einem gesetzten Zufallskeim nach realistischen
  Verteilungen von Halbachse, Exzentrizität und Inklination — inklusive
  **Kirkwood-Lücken** als Dichtemodulation. Ein Draw-Call, sichtbar korrekte Struktur.
- **Sternenhintergrund:** echter Katalog (HYG, rund 5000 Sterne bis Magnitude 6,0 — die oft zitierten
  9000 gelten für Magnitude 6,5, also den Yale Bright Star Catalog),
  Punktgröße nach scheinbarer Helligkeit, Farbe aus dem B-V-Index — die Sternbilder
  stimmen also. Dahinter eine Milchstraßen-Skybox.

---

## 7. Kamera

Ein einziger `CameraController` mit vier Modi:

| Modus | Verhalten |
|---|---|
| **Frei** | Orbit um einen Ankerpunkt; Zoom logarithmisch (Mausrad), Verschieben mit rechter Maustaste |
| **Geheftet** | Ankerpunkt ist ein Körper; die Kamera wird mitgeführt und behält ihre relative Ausrichtung |
| **Verfolgung** | Kamera liegt hinter dem Körper, ausgerichtet an dessen Geschwindigkeitsvektor |
| **Kinofahrt** | Der Director (Abschnitt 8) gibt das Ziel-Transform vor |

Der Kernentwurf: **Jeder Modus liefert nur ein Ziel-Transform** (Position, Blickpunkt,
Up-Vektor). Ein kritisch gedämpfter Feder-Dämpfer nähert die tatsächliche Kamera daran
an. Weiche Übergänge zwischen beliebigen Modi und Zielen fallen dadurch von selbst an,
statt für jeden Übergang einzeln programmiert zu werden. Dieselbe Dämpfung erzeugt auch
die im Prompt geforderten weichen Kamerabewegungen.

Vordefinierte Blickwinkel: Draufsicht auf die Ekliptik, Seitenansicht (zeigt die
Bahnneigungen), Blick von der Sonne, Blick zur Sonne.

Touch: ein Finger dreht, zwei Finger zoomen und verschieben.

---

## 8. Kino-Modus

### 8.1 Szenen als Daten

```ts
interface Scene {
  id: string; titleKey: string;
  targetId: string;                    // 'saturn', 'earth'
  path: 'orbit' | 'flyby' | 'static' | 'chase' | 'system';
  params: {
    distanceInRadii: number; elevationDeg: number;
    azimuthDeg: number; azimuthRateDegPerSec: number;
  };
  durationSec: number;
  timeRateDaysPerSec: number;
  variation: {
    azimuth: [number, number]; elevation: [number, number]; distance: [number, number];
  };
}
```

Erste Szenen: Sonnenaufgang über dem Erdrand, Saturnringe im Streiflicht, der Tanz der
Galileischen Monde im Zeitraffer, Blick von Pluto zurück auf die ferne Sonne,
Draufsicht auf das ganze System über ein Jahrzehnt, Marsmonde im Nahflug.

Weil Szenen reine Daten sind, kostet der Katalog-Ausbau in Phase 3 nur **neue
Szenen-Datensätze** — die Szenen-Engine selbst wird nicht angefasst. Genau das
entschärft den Nachteil, den Kino-Modus vor den Katalog gezogen zu haben.

### 8.2 Director

Spielt die Playlist sequenziell oder gemischt. Die Variationsbereiche werden aus einem
gesetzten Zufallskeim gezogen — reproduzierbar, wenn man einen Keim festlegt, und nie
exakt gleich, wenn nicht. Zwischen Szenen fliegt die Kamera weich (die Dämpfung aus
Abschnitt 7 übernimmt das); auch der Zeitraffer wird interpoliert statt gesprungen.

### 8.3 Dauerlauf-Tauglichkeit

Weil dies ausdrücklich als Bildschirm-Dekoration gedacht ist:

- Echtes Vollbild über die Fullscreen API
- UI und **Mauszeiger** blenden nach etwa 3 Sekunden Inaktivität aus
- **Wake Lock API** verhindert Bildschirmschoner und Ruhezustand
- Kein Speicherwachstum über Stunden — Szenenwechsel legen keine neuen Objekte an,
  sondern verwenden vorhandene wieder (wird in Phase 2 explizit geprüft)
- Steuerung: `C` startet und stoppt, `N` springt zur nächsten Szene; eine Nutzereingabe
  pausiert den Kino-Modus, der nach Inaktivität wieder aufnimmt (Verhalten einstellbar)

---

## 9. UI/UX

### 9.1 Aufbau

- **Links:** Objektbaum (Sonne, Planeten, Monde) mit Auswahl und Sichtbarkeitsschaltern
- **Rechts:** Einstellungen in Gruppen — Zeit, Maßstab, Darstellung, Kamera, Qualität
- **Unten:** Transportleiste — Pause, Tempo, Rückwärts, Datumsfeld, "Jetzt"
- **Oben rechts:** vier kleine Schaltflächen — UI aus, Vollbild, Kino, Hilfe
- **Infopanel:** Kennzahlen des gewählten Objekts aus dem Datensatz plus abgeleitete
  Live-Werte (aktuelle Entfernung zu Sonne und Erde, Bahngeschwindigkeit, Phase)

Alle Panels sind einklappbar; ihr Zustand liegt im Store und wird mitgespeichert.

Gestaltung: dunkel, halbtransparent mit `backdrop-filter`-Weichzeichnung, feine Ränder,
zurückhaltende Akzentfarbe. Das UI soll über der Szene schweben, nicht sie zudecken.

### 9.2 Tastenkürzel

| Taste | Funktion |
|---|---|
| `H` | UI ein/aus |
| `F` | Vollbild |
| `C` | Kino-Modus |
| `N` | nächste Szene |
| `Leertaste` | Pause |
| `Pfeil links` / `Pfeil rechts` | Zeitraffer verringern / erhöhen |
| `R` | Zeitrichtung umkehren |
| `Pos1` | Ansicht zurücksetzen |
| `?` | Kürzel-Übersicht |

### 9.3 Mehrsprachigkeit

Deutsch ist Standardsprache. **Alle** sichtbaren Texte liegen von Anfang an in
Ressourcendateien (`ui/i18n/de.ts`), niemals als Literal im Code — das ist der
eigentliche Aufwand der Mehrsprachigkeit, und er entsteht nur einmal, wenn man ihn von
Beginn an trägt. Englisch kommt in Phase 4 hinzu.

### 9.4 Mobile

Ab schmalen Bildschirmen werden die Seitenpanels zu einklappbaren Bottom-Sheets,
Trefferflächen wachsen, die Qualitätsstufe sinkt automatisch. Kein eigenes
Bedienkonzept, aber vollwertige Bedienbarkeit.

---

## 10. Persistenz

Ein Mechanismus, drei Anwendungen — alle bauen auf der Serialisierung des Stores auf:

- **URL-Sharing:** Es werden **nur die Abweichungen vom Standardzustand** serialisiert,
  als kompaktes JSON, Base64URL-kodiert im Fragment (`#p=...`). Dadurch bleiben
  typische geteilte Links kurz, statt den gesamten Zustandsbaum mitzuschleppen.
- **Presets:** benannte Einträge in `localStorage`, zusätzlich als Datei exportier- und
  importierbar.
- **Sitzungswiederherstellung:** der letzte Zustand wird automatisch gesichert und beim
  Start wiederhergestellt (abschaltbar).

---

## 11. Performance

Ziel: **stabile 60 fps auf einem aktuellen Mittelklasse-Laptop.**

Vier Qualitätsstufen steuern gemeinsam mehrere Parameter:

| Parameter | Niedrig | Mittel | Hoch |
|---|---|---|---|
| Texturauflösung (Erde) | 1k | 2k | 8k |
| Bloom | aus | an | an, selektiv |
| Schatten | aus | einfach | PCF weich |
| Gürtel-Partikel | 0 | 10 000 | 50 000 |
| `devicePixelRatio`-Deckel | 1.0 | 1.5 | 2.0 |
| Atmosphären | aus | an | an |

**Auto** misst die mittlere Framezeit über 3 Sekunden und stuft **nur herunter**, wenn
sie 20 ms überschreitet. Nie automatisch hoch — sonst pendelt die Einstellung sichtbar
zwischen zwei Stufen.

Weitere Maßnahmen: Texturen progressiv laden (erst 1k anzeigen, dann die Zielauflösung
nachladen und tauschen), Bahnlinien nur bei Maßstabsänderung neu aufbauen, Gürtel als
einen Draw-Call, KTX2/Basis-Texturkompression in Phase 5.

---

## 12. Testing

**Vitest**, für `sim/` in reiner Node-Umgebung — möglich, weil diese Schicht keine
Three.js- und DOM-Abhängigkeiten hat.

**Kerntest (vom Prompt ausdrücklich gefordert):** Die Bahnberechnung wird gegen
Referenzwerte aus **JPL Horizons** geprüft. Das Fixture
`sim/__fixtures__/horizons.json` enthält pro Körper etwa fünf Datum/Position-Paare
(heliozentrisch, ekliptikal J2000, in km), verteilt über das Gültigkeitsfenster. Die
Toleranz wird pro Körper im Fixture dokumentiert und nach der ersten Messung
festgezurrt, statt vorab geraten zu werden.

Weitere Tests:

- Kepler-Löser: Konvergenz für Exzentrizitäten von 0 bis 0.5, Vergleich gegen
  Referenzwerte
- Zeitumrechnung zwischen JD und bürgerlichem Datum, inklusive Schaltjahren und
  Jahrhundertregel
- Maßstabsfunktion: Monotonie, Fixpunkt bei exakt 1 AE, `k = 1` ergibt die Identität
- Store-Serialisierung: Round-Trip ergibt identischen Zustand; URL-Kodierung ebenso
- Szenen-Variation: gleicher Zufallskeim ergibt identische Kamerapfade

**Bewusst nicht getestet:** gerenderte Bilder per Screenshot-Vergleich. Solche Tests
sind bei GPU- und Treiberunterschieden zu spröde und erzeugen mehr Fehlalarme als
Erkenntnis. Stattdessen erfolgt pro Phase eine manuelle Sichtprüfung anhand der
Akzeptanzkriterien.

---

## 13. Assets und Lizenzen

| Material | Quelle | Lizenz |
|---|---|---|
| Planeten- und Mondtexturen | NASA / JPL, USGS Astrogeology | gemeinfrei |
| Aufbereitete Texturen, Ringe | Solar System Scope | CC BY 4.0 |
| Sternkatalog | HYG-Datenbank | CC BY-SA 4.0 |
| Milchstraßen-Panorama | ESO | CC BY 4.0 |
| Ambient-Sound (Phase 5) | noch zu wählen, frei lizenziert | wird dokumentiert |

Eine **`ASSETS.md` im Projektwurzelverzeichnis** führt pro Datei Quelle, Lizenz,
Urheber und Bearbeitungsvermerk (Skalierung, Format, Zuschnitt). Damit ist die
Namensnennungspflicht der CC-BY-Lizenzen erfüllt und jederzeit nachvollziehbar.

---

## 14. Projektstruktur

```
Solarsystem/
  docs/superpowers/specs/       Design-Dokument und Implementierungsplan
  public/textures/              Texturen, nach Körper gruppiert
  src/
    data/
      bodies/                   ein Datensatz je Himmelskörper
      scenes/                   Kinoszenen
      stars/                    Sternkatalog, Gürtelparameter
    sim/                        time, kepler, orbit, frames (+ __tests__)
    render/
      camera/                   CameraController, Modi, Dämpfung
      bodies, orbits, rings, belts, starfield, postfx
      scene.ts                  Aufbau und Frame-Aktualisierung
    ui/
      panels, controls, info, shortcuts
      i18n/                     de.ts, später en.ts
    store/                      index, presets, urlState
    app/                        main.tsx, loop.ts, quality.ts
  ASSETS.md
  vite.config.ts
```

---

## 15. Build und Auslieferung

**Das Repository ist privat und bleibt es bis zur Fertigstellung.** Während der
gesamten Entwicklung wird nichts veröffentlicht.

Das hat eine Konsequenz, die man kennen muss: Eine GitHub-Pages-Seite ist öffentlich
erreichbar, **auch wenn das Repository privat ist** — Zugriffsschutz für Pages gibt es
nur in Enterprise-Tarifen, und Pages aus einem privaten Repository heraus setzt
ohnehin einen kostenpflichtigen Plan voraus. „Privates Repo" und „veröffentlichte
Seite" sind also zwei verschiedene Dinge. Deshalb:

- **Während der Entwicklung:** CI baut und testet ausschließlich. Kein Deployment.
  Ansehen lokal über `npm run dev` beziehungsweise `npm run preview`.
- **Der Pages-Workflow wird vorbereitet, aber nicht scharf geschaltet** — als
  `workflow_dispatch` statt als Push-Trigger. Damit ist die Veröffentlichung ein
  bewusster Knopfdruck und kann nicht versehentlich durch einen Push ausgelöst werden.
- **Zur Fertigstellung** und nur nach ausdrücklicher Freigabe: Trigger umstellen und
  veröffentlichen.

Weiteres zum Build:

- **Vite** mit TypeScript im `strict`-Modus, dazu ESLint und Prettier
- **GitHub Actions** bei Push auf `main`: `npm ci`, `npm test`, `npm run build`. Der
  Durchlauf ist nur grün, wenn die Tests bestehen.
- `base` in `vite.config.ts` auf den Repository-Namen setzen, da Pages später in einem
  Unterpfad liegt — gleich zu Beginn konfigurieren, damit die spätere
  Veröffentlichung keine Pfadüberraschungen bringt
- Kein Backend, keine Laufzeitabhängigkeit von einem Server

---

## 16. Roadmap

Jede Phase ist für sich lauffähig und vorzeigbar.

### Phase 1 — Vertikaler Durchstich

**Inhalt:** Sonne, 8 Planeten, Erdmond. Alle vier Schichten einmal vollständig.

**Akzeptanzkriterien**

- Positionen aller 8 Planeten bestehen den Horizons-Fixture-Test
- Zeitsteuerung vollständig: Pause, Tempo, Rückwärts, Sprung zu Datum, "Jetzt"
- Beide Maßstabsregler und drei Presets mit animiertem Übergang
- Bahnlinien, Labels, Marker-Glyphen, Sternenhintergrund, Bloom
- Kameramodi frei, geheftet und verfolgend, mit weichen Übergängen zwischen allen
  dreien (der Modus Kinofahrt folgt in Phase 2)
- UI-Gerüst mit einklappbaren Panels; `H` und `F` funktionieren
- Stabile 60 fps auf dem Referenz-Laptop

### Phase 2 — Kino-Modus

**Akzeptanzkriterien**

- Mindestens 6 Szenen; der Director spielt endlos ohne sichtbaren Bruch
- Prozedurale Variation reproduzierbar bei gesetztem Zufallskeim
- UI und Mauszeiger blenden aus, Wake Lock aktiv, echtes Vollbild
- 30 Minuten Dauerlauf ohne messbares Speicherwachstum

### Phase 3 — Katalog-Ausbau

**Akzeptanzkriterien**

- Etwa 20 Monde, 5 Zwergplaneten, Saturn- und Uranusringe
- Asteroiden- und Kuipergürtel als instanzierte Wolken inklusive Kirkwood-Lücken
- Mondbahnen ebenfalls gegen Fixture geprüft
- Schattenwurf: eine Mondfinsternis lässt sich über das Datumsfeld nachstellen
- Neue Kinoszenen nutzen Ringe und Monde

### Phase 4 — Komfort

**Akzeptanzkriterien**

- Presets speichern, laden, exportieren, importieren
- URL-Sharing stellt den Zustand exakt wieder her (durch Round-Trip-Test abgesichert)
- Englisch vollständig, Sprachumschaltung zur Laufzeit
- Infopanel mit abgeleiteten Live-Werten

### Phase 5 — Ambient-Sound und Schlusspolitur

**Akzeptanzkriterien**

- Ambient-Sound mit Lautstärkeregler, standardmäßig aus, startet erst nach einer
  Nutzergeste (Autoplay-Sperre korrekt behandelt)
- Qualitätsstufen inklusive automatischer Erkennung
- Texturkompression (KTX2), Ladezeit gemessen und dokumentiert
- `ASSETS.md` vollständig
- Erst danach und nur auf ausdrückliche Freigabe: Pages-Veröffentlichung scharf
  schalten (siehe Abschnitt 15)

---

## 17. Nicht-Ziele

Bewusst ausgeschlossen, um die Politur zu schützen:

- Kein Backend, kein Login, keine Benutzerkonten
- Keine echte N-Body-Simulation (siehe Abschnitt 18)
- Keine Raumsonden-Trajektorien
- Kein VR/WebXR
- Keine Info-Einblendungen im Kino-Modus (im Interview abgewählt)
- Keine Screenshot-basierten Rendering-Tests

---

## 18. Spätere Optionen

Notiert, nicht eingeplant — jede wäre ein eigener Brainstorming-Durchlauf:

- **N-Body-Sandkasten:** ein abgetrennter Was-wäre-wenn-Modus mit echter Gravitation
  (Masse ändern, Körper einfügen, Bahn stören). Im Interview als reizvoll, aber als
  eigenes Subsystem erkannt.
- **Echte Kleinkörper-Daten** aus dem Minor Planet Center statt statistischer Wolken
- **Kometen mit Schweif** (Halley, Hale-Bopp, 67P)
- **PWA/Offline-Betrieb** mit Service Worker
- **Info-Einblendungen im Kino-Modus** im Dokumentarfilm-Stil

---

## 19. Nächster Schritt

Nach Freigabe dieses Dokuments: Implementierungsplan für **Phase 1** über die
`writing-plans`-Fähigkeit, in kleinen, testbaren Schritten.
