# Phase 1 — Vertikaler Durchstich: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sonne, acht Planeten und der Erdmond laufen auf echten Kepler-Bahnen durch alle vier Architekturschichten — mit vollständiger Zeitsteuerung, beiden Maßstabsreglern, Bahnlinien, Labels, Sternenhintergrund, Bloom und drei Kameramodi.

**Architecture:** Vier strikt einseitig abhängige Schichten: `data/` (reine Datensätze) → `sim/` (reine Funktionen, kein Three.js, kein DOM) → `render/` (imperatives Three.js) und `ui/` (React). Der Zustand-Store ist die einzige Wahrheitsquelle und wird von `ui/` beschrieben und von `render/` gelesen. Positionen sind zustandslose Funktionen der Zeit, daher sind Zeitsprung, Rückwärtslauf und extreme Zeitraffung Sonderfall-frei.

**Tech Stack:** TypeScript (strict), Vite, React 19, Zustand, Tailwind CSS v4, Three.js, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-11-sonnensystem-design.md`

## Global Constraints

- **Sprache:** Alle sichtbaren Texte ausschließlich über `ui/i18n/de.ts`, niemals als Literal im Code. Deutsch ist Standardsprache.
- **Commits:** Ausschließlich Jens Fricke als Autor. **Keine** `Co-Authored-By:`-Zeile, keine `Claude-Session:`-Zeile, keine Erwähnung von Claude oder Anthropic in Commit-Messages oder Dateien.
- **Veröffentlichung:** Das Repository bleibt privat. Die CI baut und testet nur; der Pages-Job wird als `workflow_dispatch` vorbereitet und **nicht** an einen Push-Trigger gehängt.
- **Schichtengrenze:** `src/sim/**` und `src/data/**` dürfen **nichts** aus `three`, `react` oder dem DOM importieren. Diese Regel wird in Task 1 per ESLint erzwungen.
- **Einheiten:** `sim/` rechnet ausnahmslos in Kilometern, Sekunden und Radiant (Winkel in Datensätzen in Grad, Umrechnung beim Einlesen). Render-Einheit: 1 Three.js-Einheit = 1000 km.
- **Zeit:** Einzige Zeitgröße ist das Julianische Datum. `J2000 = 2451545.0`.
- **Astronomische Konstante:** `AU_KM = 149597870.7`.
- **TypeScript:** `strict: true`, `noUncheckedIndexedAccess: true`. Kein `any` in eingechecktem Code.
- **Gültigkeitsfenster der Bahnelemente:** 1800–2050.

---

## Dateistruktur

| Datei | Verantwortung |
|---|---|
| `src/sim/types.ts` | Typen für Körper, Bahnelemente, Vektoren — die gemeinsame Sprache aller Schichten |
| `src/sim/time.ts` | Julianisches Datum ↔ bürgerliches Datum, Jahrhunderte seit J2000 |
| `src/sim/kepler.ts` | Kepler-Gleichung, Winkelnormalisierung |
| `src/sim/orbit.ts` | Bahnelemente fortschreiben, Position/Geschwindigkeit/Rotation |
| `src/sim/scale.ts` | Maßstabsmodell: Potenzkompression, hierarchische Skalierung |
| `src/data/bodies/*.ts` | Ein Datensatz je Himmelskörper |
| `src/data/index.ts` | Index aller Körper, Nachschlagen per `id` |
| `src/store/types.ts` | `AppState` |
| `src/store/index.ts` | Zustand-Store, Standardwerte |
| `src/store/serialize.ts` | Abweichungen vom Standard ↔ URL-Fragment |
| `src/render/units.ts` | Umrechnung km ↔ Render-Einheiten, kamerarelative Transformation |
| `src/render/renderer.ts` | WebGL-Renderer, logarithmischer Tiefenpuffer, Größenanpassung |
| `src/render/bodies.ts` | Kugel-Meshes, Texturen, Eigenrotation |
| `src/render/orbits.ts` | Bahnlinien als Polylinien |
| `src/render/starfield.ts` | Sternenhintergrund aus Katalogdaten |
| `src/render/postfx.ts` | EffectComposer, selektives Bloom, Tonemapping |
| `src/render/labels.ts` | Projektion auf den Bildschirm, Marker-Glyphen |
| `src/render/camera/damping.ts` | Kritisch gedämpfte Annäherung (reine Funktion) |
| `src/render/camera/controller.ts` | Kameramodi, Ziel-Transform, Eingaben |
| `src/render/scene.ts` | Szenenaufbau und Frame-Aktualisierung |
| `src/app/loop.ts` | requestAnimationFrame-Schleife, Zeitfortschritt |
| `src/app/main.tsx` | Einstiegspunkt, verbindet Renderer und React |
| `src/ui/App.tsx` | UI-Wurzel, Panel-Anordnung |
| `src/ui/panels/Panel.tsx` | Einklappbares Panel (Grundbaustein) |
| `src/ui/panels/TimePanel.tsx` | Transportleiste |
| `src/ui/panels/ScalePanel.tsx` | Maßstabsregler und Presets |
| `src/ui/panels/CameraPanel.tsx` | Kameramodus und Ziel |
| `src/ui/panels/BodyTree.tsx` | Objektbaum, Auswahl, Sichtbarkeit |
| `src/ui/shortcuts/useShortcuts.ts` | Tastenkürzel, Vollbild |
| `src/ui/i18n/de.ts` | Alle deutschen Texte |

---

## Task 1: Projekt-Grundgerüst und Zeitrechnung

Das Grundgerüst ist kein Selbstzweck — es wird sofort durch eine echte, getestete Funktion belegt: die Umrechnung zwischen Julianischem Datum und bürgerlichem Datum.

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `eslint.config.js`, `.github/workflows/ci.yml`, `index.html`, `src/app/main.tsx`, `src/index.css`
- Create: `src/sim/time.ts`
- Test: `src/sim/time.test.ts`

**Interfaces:**
- Produces:
  - `J2000: number` (2451545.0)
  - `dateToJd(date: Date): number`
  - `jdToDate(jd: number): Date`
  - `centuriesSinceJ2000(jd: number): number`

- [ ] **Step 1: Projekt anlegen**

```bash
cd "E:/Claude/RTF/Test/Solarsystem"
npm create vite@latest . -- --template react-ts
npm install
npm install three zustand
npm install -D vitest @types/three tailwindcss @tailwindcss/vite
```

Bei der Rückfrage, ob in ein nicht leeres Verzeichnis installiert werden soll: bestehende Dateien behalten.

- [ ] **Step 2: Konfiguration schreiben**

`.gitignore`:

```
node_modules/
dist/
.DS_Store
*.local
coverage/
.superpowers/
```

`.superpowers/` ist der Arbeitsbereich des Ausführungsprozesses (Protokoll, Briefings,
Review-Pakete) und gehört nicht ins Repository. Die Zeile ist bereits vorhanden —
beim Schreiben der Datei nicht verlieren.

`tsconfig.json` — die beiden Schärfungen ergänzen:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true
  }
}
```

`resolveJsonModule` wird für den Sternkatalog und das Horizons-Fixture gebraucht, die
beide als JSON importiert werden.

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Pages liegt später in einem Unterpfad — gleich zu Beginn setzen,
  // damit die spätere Veröffentlichung keine Pfadüberraschungen bringt.
  base: '/Solarsystem/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

`src/index.css`:

```css
@import "tailwindcss";

html, body, #root { height: 100%; margin: 0; background: #05070d; }
```

`package.json` — Skripte ergänzen:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  }
}
```

- [ ] **Step 3: Schichtengrenze per ESLint erzwingen**

In `eslint.config.js` die Regel ergänzen, die `sim/` und `data/` von Three.js, React und DOM trennt. Ohne diese Regel erodiert die Architektur beim ersten Zeitdruck:

```js
{
  files: ['src/sim/**/*.ts', 'src/data/**/*.ts'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: ['three', 'three/*', 'react', 'react-*', '@react*'],
    }],
  },
}
```

- [ ] **Step 4: CI-Workflow anlegen (bauen und testen, nicht veröffentlichen)**

`.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main, master]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

Es gibt **bewusst keinen** Deploy-Job. Das Repository bleibt privat; die Pages-Veröffentlichung wird erst in Phase 5 als separater `workflow_dispatch`-Workflow ergänzt.

- [ ] **Step 5: Den fehlschlagenden Test schreiben**

`src/sim/time.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { J2000, dateToJd, jdToDate, centuriesSinceJ2000 } from './time';

describe('Julianisches Datum', () => {
  it('bildet die Epoche J2000.0 auf 2451545.0 ab', () => {
    // J2000.0 ist definiert als 2000-01-01 12:00:00 UTC
    const epoche = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    expect(dateToJd(epoche)).toBeCloseTo(J2000, 6);
  });

  it('rechnet ein bekanntes Datum korrekt um', () => {
    // 2026-09-11 00:00 UTC
    const d = new Date(Date.UTC(2026, 8, 11, 0, 0, 0));
    expect(dateToJd(d)).toBeCloseTo(2461294.5, 4);
  });

  it('ist umkehrbar (Round-Trip auf die Millisekunde)', () => {
    const original = new Date(Date.UTC(1969, 6, 20, 20, 17, 40));
    const zurueck = jdToDate(dateToJd(original));
    expect(Math.abs(zurueck.getTime() - original.getTime())).toBeLessThan(2);
  });

  it('behandelt das Schaltjahr 2000 und das Nicht-Schaltjahr 1900', () => {
    const schalttag2000 = new Date(Date.UTC(2000, 1, 29, 0, 0, 0));
    const rueck = jdToDate(dateToJd(schalttag2000));
    expect(rueck.getUTCMonth()).toBe(1);
    expect(rueck.getUTCDate()).toBe(29);

    // 1900 war kein Schaltjahr — der 1. März folgt direkt auf den 28. Februar
    const feb28 = dateToJd(new Date(Date.UTC(1900, 1, 28)));
    const mar01 = dateToJd(new Date(Date.UTC(1900, 2, 1)));
    expect(mar01 - feb28).toBeCloseTo(1, 6);
  });

  it('liefert bei J2000 null Jahrhunderte', () => {
    expect(centuriesSinceJ2000(J2000)).toBeCloseTo(0, 12);
    expect(centuriesSinceJ2000(J2000 + 36525)).toBeCloseTo(1, 12);
  });
});
```

- [ ] **Step 6: Test laufen lassen und Fehlschlag bestätigen**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./time"`

- [ ] **Step 7: Implementierung schreiben**

`src/sim/time.ts`:

```ts
/** Julianisches Datum der Epoche J2000.0 (2000-01-01 12:00 UTC). */
export const J2000 = 2451545.0;

/** Millisekunden pro Tag. */
const MS_PRO_TAG = 86_400_000;

/**
 * Julianisches Datum des Unix-Epochenbeginns (1970-01-01 00:00 UTC).
 * Damit ist die Umrechnung eine reine Verschiebung — die gregorianische
 * Schaltjahresregel steckt bereits in Date.UTC.
 */
const JD_UNIX_EPOCHE = 2440587.5;

export function dateToJd(date: Date): number {
  return date.getTime() / MS_PRO_TAG + JD_UNIX_EPOCHE;
}

export function jdToDate(jd: number): Date {
  return new Date(Math.round((jd - JD_UNIX_EPOCHE) * MS_PRO_TAG));
}

/** Julianische Jahrhunderte seit J2000.0 — das Argument aller Bahnelement-Raten. */
export function centuriesSinceJ2000(jd: number): number {
  return (jd - J2000) / 36525;
}
```

- [ ] **Step 8: Tests und Build prüfen**

Run: `npm test && npm run lint && npm run build`
Expected: alle Tests grün, Lint sauber, Build erzeugt `dist/`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Projektgrundgerüst mit Vite, TypeScript und Vitest; Zeitrechnung implementiert"
```

---

## Task 2: Kepler-Löser

**Files:**
- Create: `src/sim/kepler.ts`
- Test: `src/sim/kepler.test.ts`

**Interfaces:**
- Produces:
  - `normalizeAngle(rad: number): number` — normiert auf `[-π, π]`
  - `solveKepler(meanAnomalyRad: number, e: number): number` — liefert die exzentrische Anomalie `E` in Radiant

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/sim/kepler.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { solveKepler, normalizeAngle } from './kepler';

describe('normalizeAngle', () => {
  it('normiert auf den Bereich -PI bis PI', () => {
    expect(normalizeAngle(0)).toBeCloseTo(0, 12);
    expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(Math.PI, 12);
    expect(normalizeAngle(-3 * Math.PI)).toBeCloseTo(Math.PI, 12);
    expect(normalizeAngle(2 * Math.PI + 0.5)).toBeCloseTo(0.5, 12);
  });
});

describe('solveKepler', () => {
  it('liefert bei Kreisbahn E = M', () => {
    for (const m of [0, 0.5, 1.5, -2.0]) {
      expect(solveKepler(m, 0)).toBeCloseTo(m, 12);
    }
  });

  it('erfüllt die Kepler-Gleichung selbst', () => {
    // Der stärkste Test: die Lösung in die Ausgangsgleichung einsetzen.
    for (const e of [0, 0.01, 0.1, 0.2, 0.3, 0.45, 0.5]) {
      for (const m of [0, 0.3, 1.0, 2.0, 3.0, -1.2, Math.PI]) {
        const E = solveKepler(m, e);
        const zurueck = E - e * Math.sin(E);
        expect(normalizeAngle(zurueck - m)).toBeCloseTo(0, 10);
      }
    }
  });

  it('behandelt M = 0 und M = PI exakt', () => {
    expect(solveKepler(0, 0.3)).toBeCloseTo(0, 12);
    expect(solveKepler(Math.PI, 0.3)).toBeCloseTo(Math.PI, 10);
  });

  it('weist unzulässige Exzentrizitäten zurück', () => {
    expect(() => solveKepler(1, -0.1)).toThrow();
    expect(() => solveKepler(1, 1.0)).toThrow();
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/kepler.test.ts`
Expected: FAIL — Modul nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/sim/kepler.ts`:

```ts
const ZWEI_PI = 2 * Math.PI;

/** Normiert einen Winkel auf den Bereich [-PI, PI]. */
export function normalizeAngle(rad: number): number {
  let a = rad % ZWEI_PI;
  if (a > Math.PI) a -= ZWEI_PI;
  if (a < -Math.PI) a += ZWEI_PI;
  return a;
}

/**
 * Löst die Kepler-Gleichung M = E - e*sin(E) nach E per Newton-Iteration.
 *
 * Startwert E0 = M + e*sin(M) — er liegt für e < 0.6 so dicht an der Lösung,
 * dass drei bis fünf Iterationen genügen. Die harte Obergrenze verhindert
 * eine Endlosschleife, falls je ein pathologischer Fall auftritt.
 */
export function solveKepler(meanAnomalyRad: number, e: number): number {
  if (!(e >= 0) || e >= 1) {
    throw new RangeError(`Exzentrizität außerhalb [0, 1): ${e}`);
  }

  const M = normalizeAngle(meanAnomalyRad);
  let E = M + e * Math.sin(M);

  for (let i = 0; i < 30; i++) {
    const f = E - e * Math.sin(E) - M;
    const fStrich = 1 - e * Math.cos(E);
    const delta = f / fStrich;
    E -= delta;
    if (Math.abs(delta) < 1e-12) break;
  }

  return E;
}
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/sim/kepler.test.ts`
Expected: PASS, alle vier Testgruppen

- [ ] **Step 5: Commit**

```bash
git add src/sim/kepler.ts src/sim/kepler.test.ts
git commit -m "Kepler-Gleichung per Newton-Iteration gelöst"
```

---

## Task 3: Körpertypen und Datensätze

**Files:**
- Create: `src/sim/types.ts`
- Create: `src/data/bodies/sun.ts`, `mercury.ts`, `venus.ts`, `earth.ts`, `mars.ts`, `jupiter.ts`, `saturn.ts`, `uranus.ts`, `neptune.ts`, `moon.ts`
- Create: `src/data/index.ts`
- Test: `src/data/index.test.ts`

**Interfaces:**
- Consumes: nichts
- Produces:
  - `Vec3 = { x: number; y: number; z: number }`
  - `OrbitElements`, `PhysicalData`, `Appearance`, `Body` (Felder siehe Step 1)
  - `BodyIndex = Record<string, Body>`
  - `bodies: Body[]`, `bodyIndex: BodyIndex`, `getBody(id: string): Body`

- [ ] **Step 1: Typen schreiben**

`src/sim/types.ts`:

```ts
export interface Vec3 { x: number; y: number; z: number }

/** Bahnelemente zur Epoche J2000 samt säkularen Raten (pro julianischem Jahrhundert). */
export interface OrbitElements {
  a: number;    aDot: number;     // große Halbachse [AE]
  e: number;    eDot: number;     // Exzentrizität [-]
  i: number;    iDot: number;     // Inklination [Grad]
  L: number;    LDot: number;     // mittlere Länge [Grad]
  lp: number;   lpDot: number;    // Länge des Perihels [Grad]
  node: number; nodeDot: number;  // Länge des aufsteigenden Knotens [Grad]
  /** Bezugsebene: Ekliptik J2000 oder Äquatorebene des Mutterkörpers. */
  frame: 'ecliptic' | 'parentEquator';
}

export interface PhysicalData {
  radiusKm: number;
  massKg: number;
  /** Siderische Rotationsperiode in Stunden; negativ bei retrograder Rotation. */
  rotationPeriodH: number;
  axialTiltDeg: number;
  /** Rotationsphase zur Epoche J2000 in Grad. */
  rotationAtEpochDeg: number;
}

export interface Appearance {
  textures: { albedo: string; normal?: string; specular?: string; emissive?: string };
  /** Fallback-Farbe sowie Farbe von Marker und Bahnlinie. */
  color: string;
  atmosphere?: { colorInner: string; colorOuter: string; heightKm: number };
  rings?: { innerKm: number; outerKm: number; texture: string };
}

export interface Body {
  id: string;
  parent: string | null;
  kind: 'star' | 'planet' | 'moon' | 'dwarf';
  /** null genau dann, wenn der Körper im Ursprung ruht (die Sonne). */
  orbit: OrbitElements | null;
  physical: PhysicalData;
  appearance: Appearance;
  info: { nameKey: string; descriptionKey: string };
}

export type BodyIndex = Record<string, Body>;
```

- [ ] **Step 2: Bahnelemente aus der Primärquelle übertragen**

**Quelle:** JPL Solar System Dynamics, *Approximate Positions of the Major Planets*,
<https://ssd.jpl.nasa.gov/planets/approx_pos.html>, **Tabelle 1** (Gültigkeit 1800–2050).

Übertrage die Zeilen unverändert; erfinde keine Werte. Beachte, dass die Tabelle für
die Erde den **Erde-Mond-Schwerpunkt** liefert — das ist für Phase 1 gewollt (die
Abweichung zum Erdmittelpunkt liegt unter 4 700 km und ist bei diesen Maßstäben
unsichtbar). Dokumentiere das als Kommentar im Datensatz.

Beispiel für die Struktur, hier Mars (`src/data/bodies/mars.ts`):

```ts
import type { Body } from '../../sim/types';

export const mars: Body = {
  id: 'mars',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    a: 1.52371034,   aDot: 0.00001847,
    e: 0.09339410,   eDot: 0.00007882,
    i: 1.84969142,   iDot: -0.00813131,
    L: -4.55343205,  LDot: 19140.30268499,
    lp: -23.94362959, lpDot: 0.44441088,
    node: 49.55953891, nodeDot: -0.29257343,
    frame: 'ecliptic',
  },
  physical: {
    radiusKm: 3389.5,
    massKg: 6.4171e23,
    rotationPeriodH: 24.6229,
    axialTiltDeg: 25.19,
    rotationAtEpochDeg: 0,
  },
  appearance: {
    textures: { albedo: 'textures/mars/albedo.jpg' },
    color: '#c1502e',
  },
  info: { nameKey: 'body.mars.name', descriptionKey: 'body.mars.description' },
};
```

Die Sonne bekommt `orbit: null`, `parent: null`, `kind: 'star'` und eine
Emissive-Textur. Der Mond bekommt `parent: 'earth'`, `frame: 'parentEquator'` und
Bahnelemente relativ zur Erde (mittlere Werte: `a = 0.00257 AE`, `e = 0.0549`,
`i = 5.145°`, siderische Periode 27.32166 d — daraus `LDot = 36525 / 27.32166 * 360`).

- [ ] **Step 3: Index schreiben**

`src/data/index.ts`:

```ts
import type { Body, BodyIndex } from '../sim/types';
import { sun } from './bodies/sun';
import { mercury } from './bodies/mercury';
import { venus } from './bodies/venus';
import { earth } from './bodies/earth';
import { mars } from './bodies/mars';
import { jupiter } from './bodies/jupiter';
import { saturn } from './bodies/saturn';
import { uranus } from './bodies/uranus';
import { neptune } from './bodies/neptune';
import { moon } from './bodies/moon';

export const bodies: Body[] = [
  sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, moon,
];

export const bodyIndex: BodyIndex = Object.fromEntries(
  bodies.map((b) => [b.id, b]),
);

export function getBody(id: string): Body {
  const b = bodyIndex[id];
  if (!b) throw new Error(`Unbekannter Körper: ${id}`);
  return b;
}
```

- [ ] **Step 4: Integritätstest schreiben — er fängt Übertragungsfehler**

`src/data/index.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { bodies, bodyIndex, getBody } from './index';

describe('Körperkatalog', () => {
  it('enthält Sonne, acht Planeten und den Erdmond', () => {
    expect(bodies).toHaveLength(10);
    expect(bodies.filter((b) => b.kind === 'planet')).toHaveLength(8);
    expect(bodies.filter((b) => b.kind === 'star')).toHaveLength(1);
    expect(bodies.filter((b) => b.kind === 'moon')).toHaveLength(1);
  });

  it('vergibt eindeutige Bezeichner', () => {
    const ids = bodies.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('löst alle Elternverweise auf', () => {
    for (const b of bodies) {
      if (b.parent !== null) expect(bodyIndex[b.parent]).toBeDefined();
    }
  });

  it('gibt nur der Sonne keine Bahn', () => {
    for (const b of bodies) {
      if (b.id === 'sun') expect(b.orbit).toBeNull();
      else expect(b.orbit).not.toBeNull();
    }
  });

  // Dieser Test ist der eigentliche Zweck: er fängt Zahlendreher beim
  // Übertragen der JPL-Tabelle, bevor sie sich als Bahnfehler tarnen.
  it('hält die bekannten großen Halbachsen ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.38710, venus: 0.72333, earth: 1.00000, mars: 1.52371,
      jupiter: 5.20289, saturn: 9.53668, uranus: 19.18916, neptune: 30.06992,
    };
    for (const [id, a] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.a).toBeCloseTo(a, 4);
    }
  });

  it('hält die bekannten Exzentrizitäten ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.20564, venus: 0.00677, earth: 0.01671, mars: 0.09339,
      jupiter: 0.04839, saturn: 0.05386, uranus: 0.04726, neptune: 0.00859,
    };
    for (const [id, e] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.e).toBeCloseTo(e, 4);
    }
  });

  it('liefert plausible physikalische Daten', () => {
    for (const b of bodies) {
      expect(b.physical.radiusKm).toBeGreaterThan(0);
      expect(b.physical.massKg).toBeGreaterThan(0);
      expect(Math.abs(b.physical.rotationPeriodH)).toBeGreaterThan(0);
      expect(Math.abs(b.physical.axialTiltDeg)).toBeLessThanOrEqual(180);
    }
    // Die Sonne ist der größte Körper im Katalog.
    const maxRadius = Math.max(...bodies.map((b) => b.physical.radiusKm));
    expect(getBody('sun').physical.radiusKm).toBe(maxRadius);
  });
});
```

- [ ] **Step 5: Tests laufen lassen**

Run: `npx vitest run src/data/index.test.ts`
Expected: PASS. Schlägt ein Halbachsen- oder Exzentrizitätstest fehl, liegt ein Übertragungsfehler vor — Tabelle erneut vergleichen, **nicht** die Erwartung anpassen.

- [ ] **Step 6: Commit**

```bash
git add src/sim/types.ts src/data
git commit -m "Körperdatensätze für Sonne, acht Planeten und Erdmond angelegt"
```

---

## Task 4: Heliozentrische Position

**Files:**
- Create: `src/sim/orbit.ts`
- Test: `src/sim/orbit.test.ts`

**Interfaces:**
- Consumes: `solveKepler`, `normalizeAngle` (Task 2); `centuriesSinceJ2000`, `J2000` (Task 1); `Body`, `BodyIndex`, `Vec3` (Task 3)
- Produces:
  - `AU_KM: number`
  - `ResolvedElements = { a: number; e: number; iRad: number; LRad: number; lpRad: number; nodeRad: number }`
  - `elementsAt(orbit: OrbitElements, jd: number): ResolvedElements`
  - `positionInParentFrame(orbit: OrbitElements, jd: number): Vec3` — km, Bezugsebene des Elementsatzes
  - `positionAt(id: string, index: BodyIndex, jd: number): Vec3` — km, heliozentrisch, Ekliptik J2000

**Hinweis zur Spec:** Abschnitt 3.3 skizziert `positionAt(body, jd)`. Weil Monde die
Position ihres Mutterkörpers brauchen, nimmt die Funktion stattdessen `id` und den
Index entgegen. Das ist eine bewusste Präzisierung, keine Abweichung im Ergebnis.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/sim/orbit.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { positionAt, AU_KM } from './orbit';
import { bodyIndex, getBody } from '../data/index';
import { J2000 } from './time';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/** Bekannte siderische Umlaufzeiten in Tagen (Lehrbuchwerte). */
const PERIODEN_TAGE: Record<string, number> = {
  mercury: 87.969, venus: 224.701, earth: 365.256, mars: 686.980,
  jupiter: 4332.589, saturn: 10759.22, uranus: 30685.4, neptune: 60189,
};

describe('positionAt', () => {
  it('setzt die Sonne in den Ursprung', () => {
    const p = positionAt('sun', bodyIndex, J2000 + 1234.5);
    expect(betrag(p)).toBeCloseTo(0, 9);
  });

  it('hält die Erde zwischen Perihel und Aphel', () => {
    // Bekannte Werte: 0.98329 AE (Perihel) bis 1.01671 AE (Aphel).
    let min = Infinity;
    let max = -Infinity;
    for (let t = 0; t < 366; t += 1) {
      const r = betrag(positionAt('earth', bodyIndex, J2000 + t)) / AU_KM;
      min = Math.min(min, r);
      max = Math.max(max, r);
    }
    expect(min).toBeCloseTo(0.98329, 3);
    expect(max).toBeCloseTo(1.01671, 3);
  });

  it('kehrt nach einer siderischen Periode an dieselbe Stelle zurück', () => {
    // Prüft, dass LDot im Datensatz zur bekannten Umlaufzeit passt.
    for (const [id, periode] of Object.entries(PERIODEN_TAGE)) {
      const p0 = positionAt(id, bodyIndex, J2000);
      const p1 = positionAt(id, bodyIndex, J2000 + periode);
      const abstand = betrag({ x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z });
      const a = getBody(id).orbit!.a * AU_KM;
      expect(abstand / a).toBeLessThan(0.005);
    }
  });

  it('erfüllt das dritte Keplersche Gesetz', () => {
    // a^3 / T^2 muss für alle Planeten nahe 1 liegen (AE und Jahre).
    for (const id of Object.keys(PERIODEN_TAGE)) {
      const a = getBody(id).orbit!.a;
      const tJahre = PERIODEN_TAGE[id]! / 365.25;
      expect((a ** 3) / (tJahre ** 2)).toBeCloseTo(1, 2);
    }
  });

  it('ordnet die Planeten nach Sonnenabstand', () => {
    const reihenfolge = ['mercury', 'venus', 'earth', 'mars',
                         'jupiter', 'saturn', 'uranus', 'neptune'];
    const abstaende = reihenfolge.map(
      (id) => betrag(positionAt(id, bodyIndex, J2000)) / AU_KM,
    );
    // Merkur und Venus können sich wegen Exzentrizität nicht überholen,
    // die Reihenfolge der Bahnradien ist strikt.
    for (let i = 1; i < abstaende.length; i++) {
      expect(abstaende[i]!).toBeGreaterThan(abstaende[i - 1]!);
    }
  });

  it('hält alle Bahnen nahe der Ekliptik', () => {
    // Keine Planetenbahn ist stärker als 8 Grad geneigt.
    for (const id of Object.keys(PERIODEN_TAGE)) {
      const p = positionAt(id, bodyIndex, J2000 + 500);
      const neigungGrad = Math.abs(Math.atan2(p.z, Math.hypot(p.x, p.y)) * 180 / Math.PI);
      expect(neigungGrad).toBeLessThan(8);
    }
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/orbit.test.ts`
Expected: FAIL — `./orbit` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/sim/orbit.ts`:

```ts
import type { Body, BodyIndex, OrbitElements, Vec3 } from './types';
import { centuriesSinceJ2000 } from './time';
import { solveKepler, normalizeAngle } from './kepler';

export const AU_KM = 149_597_870.7;

const GRAD = Math.PI / 180;

export interface ResolvedElements {
  a: number;      // AE
  e: number;
  iRad: number;
  LRad: number;
  lpRad: number;
  nodeRad: number;
}

/** Schreibt die Bahnelemente linear auf den Zeitpunkt jd fort. */
export function elementsAt(orbit: OrbitElements, jd: number): ResolvedElements {
  const T = centuriesSinceJ2000(jd);
  return {
    a: orbit.a + orbit.aDot * T,
    e: orbit.e + orbit.eDot * T,
    iRad: (orbit.i + orbit.iDot * T) * GRAD,
    LRad: (orbit.L + orbit.LDot * T) * GRAD,
    lpRad: (orbit.lp + orbit.lpDot * T) * GRAD,
    nodeRad: (orbit.node + orbit.nodeDot * T) * GRAD,
  };
}

/**
 * Position relativ zum Mutterkörper, in der Bezugsebene des Elementsatzes,
 * in Kilometern.
 */
export function positionInParentFrame(orbit: OrbitElements, jd: number): Vec3 {
  const el = elementsAt(orbit, jd);

  // Perihelargument und mittlere Anomalie
  const omega = el.lpRad - el.nodeRad;
  const M = normalizeAngle(el.LRad - el.lpRad);
  const E = solveKepler(M, el.e);

  // Position in der Bahnebene: x zum Perihel, y in Bewegungsrichtung
  const aKm = el.a * AU_KM;
  const xBahn = aKm * (Math.cos(E) - el.e);
  const yBahn = aKm * Math.sqrt(1 - el.e * el.e) * Math.sin(E);

  // Drehung: Perihelargument, dann Inklination, dann Knotenlänge
  const cosO = Math.cos(omega), sinO = Math.sin(omega);
  const cosI = Math.cos(el.iRad), sinI = Math.sin(el.iRad);
  const cosN = Math.cos(el.nodeRad), sinN = Math.sin(el.nodeRad);

  const xEbene = cosO * xBahn - sinO * yBahn;
  const yEbene = sinO * xBahn + cosO * yBahn;

  return {
    x: cosN * xEbene - sinN * yEbene * cosI,
    y: sinN * xEbene + cosN * yEbene * cosI,
    z: yEbene * sinI,
  };
}

/** Heliozentrische Position in Kilometern, Ekliptik J2000. */
export function positionAt(id: string, index: BodyIndex, jd: number): Vec3 {
  const body: Body | undefined = index[id];
  if (!body) throw new Error(`Unbekannter Körper: ${id}`);
  if (body.orbit === null) return { x: 0, y: 0, z: 0 };

  const relativ = positionInParentFrame(body.orbit, jd);
  if (body.parent === null) return relativ;

  const eltern = positionAt(body.parent, index, jd);
  return {
    x: eltern.x + relativ.x,
    y: eltern.y + relativ.y,
    z: eltern.z + relativ.z,
  };
}
```

Hinweis: Die Drehung aus der Bezugsebene `parentEquator` in die Ekliptik folgt in Task 6 — solange der Mond mit `frame: 'parentEquator'` noch wie ekliptikal behandelt wird, liegt seine Bahn um wenige Grad falsch, was Task 4 nicht prüft.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/sim/orbit.test.ts`
Expected: PASS, alle sechs Tests

- [ ] **Step 5: Commit**

```bash
git add src/sim/orbit.ts src/sim/orbit.test.ts
git commit -m "Heliozentrische Positionen aus Bahnelementen berechnet"
```

---

## Task 5: Genauigkeitsprüfung gegen JPL Horizons

Die Invariantentests aus Task 4 beweisen innere Stimmigkeit. Dieser Task beweist
**absolute Richtigkeit** — das ist das im Spec ausdrücklich geforderte Kriterium.

**Files:**
- Create: `src/sim/__fixtures__/horizons.json`
- Create: `src/sim/__fixtures__/README.md`
- Test: `src/sim/horizons.test.ts`

**Interfaces:**
- Consumes: `positionAt`, `AU_KM` (Task 4)
- Produces: das Fixture, auf das spätere Phasen ihre Mond- und Zwergplanetenwerte legen

- [ ] **Step 1: Referenzwerte bei JPL Horizons abrufen**

Die Werte werden **nicht** geschätzt, sondern einmalig von der Quelle geholt und
eingecheckt. Verfahren auf <https://ssd.jpl.nasa.gov/horizons/app.html>:

| Einstellung | Wert |
|---|---|
| Ephemeris Type | **Vector Table** |
| Target Body | `Mercury Barycenter [1]` … `Neptune Barycenter [8]` (für die Erde: `Earth-Moon Barycenter [3]`) |
| Coordinate Center | `@sun` (Sonnenmittelpunkt, `500@10`) |
| Reference Plane | **Ecliptic of J2000.0** |
| Table Settings | Type 2 (Position und Geschwindigkeit), Ausgabeeinheiten **km & km/s** |
| Time Specification | die fünf Stichtage unten, jeweils 00:00 TDB |

Stichtage (verteilt über das Gültigkeitsfenster):
`1850-07-04`, `2000-01-01`, `2010-06-15`, `2026-09-11`, `2040-03-20`.

Das ergibt 8 Körper × 5 Zeitpunkte = 40 Referenzpunkte.

- [ ] **Step 2: Fixture schreiben**

`src/sim/__fixtures__/horizons.json` — Struktur (die Zahlen stammen aus Step 1):

```json
{
  "quelle": "JPL Horizons, Vector Table, Zentrum @sun (500@10), Ebene Ekliptik J2000, Einheiten km",
  "abgerufenAm": "2026-09-11",
  "toleranzKm": {
    "mercury": 100000, "venus": 100000, "earth": 100000, "mars": 200000,
    "jupiter": 1000000, "saturn": 2000000, "uranus": 5000000, "neptune": 5000000
  },
  "punkte": [
    { "id": "mercury", "jd": 2451544.5, "x": 0.0, "y": 0.0, "z": 0.0 }
  ]
}
```

Die Toleranzen oben sind bewusst großzügige **Startwerte**. Step 5 misst die
tatsächliche Abweichung; danach werden sie festgezurrt.

`src/sim/__fixtures__/README.md` dokumentiert das Abrufverfahren aus Step 1 wörtlich,
damit das Fixture jederzeit reproduzierbar neu erzeugt werden kann.

- [ ] **Step 3: Test schreiben**

`src/sim/horizons.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fixture from './__fixtures__/horizons.json';
import { positionAt } from './orbit';
import { bodyIndex } from '../data/index';

interface Punkt { id: string; jd: number; x: number; y: number; z: number }

const punkte = fixture.punkte as Punkt[];
const toleranz = fixture.toleranzKm as Record<string, number>;

describe('Bahnberechnung gegen JPL Horizons', () => {
  it('enthält Referenzpunkte für alle acht Planeten', () => {
    const ids = new Set(punkte.map((p) => p.id));
    for (const id of ['mercury', 'venus', 'earth', 'mars',
                      'jupiter', 'saturn', 'uranus', 'neptune']) {
      expect(ids.has(id)).toBe(true);
    }
    expect(punkte.length).toBeGreaterThanOrEqual(40);
  });

  it('trifft jeden Referenzpunkt innerhalb der Toleranz', () => {
    const schlimmste: Record<string, number> = {};

    for (const p of punkte) {
      const berechnet = positionAt(p.id, bodyIndex, p.jd);
      const abweichung = Math.sqrt(
        (berechnet.x - p.x) ** 2 + (berechnet.y - p.y) ** 2 + (berechnet.z - p.z) ** 2,
      );
      schlimmste[p.id] = Math.max(schlimmste[p.id] ?? 0, abweichung);
    }

    // Gemessene Abweichungen ausgeben, damit die Toleranzen danach
    // begruendet festgezurrt werden können statt geraten zu bleiben.
    console.table(
      Object.entries(schlimmste).map(([id, km]) => ({
        'Körper': id,
        'max. Abweichung [km]': Math.round(km),
        'Toleranz [km]': toleranz[id],
        'ausgeschoepft [%]': Math.round((km / toleranz[id]!) * 100),
      })),
    );

    for (const [id, km] of Object.entries(schlimmste)) {
      expect(km, `${id} weicht ${Math.round(km)} km ab`).toBeLessThan(toleranz[id]!);
    }
  });
});
```

- [ ] **Step 4: Test laufen lassen**

Run: `npx vitest run src/sim/horizons.test.ts`
Expected: PASS, mit der Tabelle der gemessenen Abweichungen in der Ausgabe

Schlägt ein Körper deutlich durch (Abweichung in der Größenordnung seiner Halbachse),
ist ein Bahnelement falsch übertragen oder eine Drehung vertauscht — nicht die
Toleranz erhöhen, sondern die Ursache suchen.

- [ ] **Step 5: Toleranzen festzurren**

Setze jede Toleranz auf das **Doppelte der gemessenen Abweichung**, aufgerundet auf
eine glatte Zahl. Damit fängt der Test künftige Regressionen, ohne bei harmlosen
Rundungsunterschieden zu klappern. Trage in `__fixtures__/README.md` eine Zeile je
Körper mit der gemessenen Abweichung und dem Messdatum ein.

- [ ] **Step 6: Test erneut laufen lassen**

Run: `npx vitest run src/sim/horizons.test.ts`
Expected: PASS, Spalte „ausgeschöpft" durchweg nahe 50 %

- [ ] **Step 7: Commit**

```bash
git add src/sim/__fixtures__ src/sim/horizons.test.ts
git commit -m "Bahnberechnung gegen JPL-Horizons-Referenzwerte abgesichert"
```

---

## Task 6: Mondbahn, Geschwindigkeit und Eigenrotation

**Files:**
- Modify: `src/sim/orbit.ts`
- Test: `src/sim/orbit.test.ts` (ergänzen), `src/sim/rotation.test.ts`

**Interfaces:**
- Consumes: alles aus Task 4
- Produces:
  - `velocityAt(id: string, index: BodyIndex, jd: number): Vec3` — km/s
  - `rotationAt(body: Body, jd: number): number` — Rotationsphase in Radiant
  - Drehung `parentEquator` → Ekliptik in `positionAt` integriert

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/sim/rotation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { positionAt, velocityAt, rotationAt, AU_KM } from './orbit';
import { bodyIndex, getBody } from '../data/index';
import { J2000 } from './time';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

describe('Mondbahn', () => {
  it('hält den Mond im bekannten Abstandsbereich zur Erde', () => {
    // Perigäum rund 363 300 km, Apogäum rund 405 500 km.
    let min = Infinity, max = -Infinity;
    for (let t = 0; t < 28; t += 0.25) {
      const mond = positionAt('moon', bodyIndex, J2000 + t);
      const erde = positionAt('earth', bodyIndex, J2000 + t);
      const d = betrag({ x: mond.x - erde.x, y: mond.y - erde.y, z: mond.z - erde.z });
      min = Math.min(min, d); max = Math.max(max, d);
    }
    expect(min).toBeGreaterThan(355_000);
    expect(min).toBeLessThan(372_000);
    expect(max).toBeGreaterThan(398_000);
    expect(max).toBeLessThan(412_000);
  });

  it('lässt den Mond die Erde in rund 27.3 Tagen umrunden', () => {
    const rel = (t: number) => {
      const m = positionAt('moon', bodyIndex, J2000 + t);
      const e = positionAt('earth', bodyIndex, J2000 + t);
      return { x: m.x - e.x, y: m.y - e.y, z: m.z - e.z };
    };
    const p0 = rel(0);
    const p1 = rel(27.32166);
    const d = betrag({ x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z });
    expect(d / 384_400).toBeLessThan(0.05);
  });
});

describe('velocityAt', () => {
  it('liefert für die Erde rund 29.8 km/s', () => {
    const v = betrag(velocityAt('earth', bodyIndex, J2000));
    expect(v).toBeGreaterThan(29.0);
    expect(v).toBeLessThan(30.6);
  });

  it('liefert für Merkur rund 47.9 km/s und für Neptun rund 5.4 km/s', () => {
    expect(betrag(velocityAt('mercury', bodyIndex, J2000))).toBeGreaterThan(38);
    expect(betrag(velocityAt('mercury', bodyIndex, J2000))).toBeLessThan(60);
    expect(betrag(velocityAt('neptune', bodyIndex, J2000))).toBeGreaterThan(5.0);
    expect(betrag(velocityAt('neptune', bodyIndex, J2000))).toBeLessThan(5.8);
  });

  it('steht bei der Erde nahezu senkrecht auf dem Ortsvektor', () => {
    // Bei kleiner Exzentrizität ist der Winkel dicht an 90 Grad.
    const p = positionAt('earth', bodyIndex, J2000);
    const v = velocityAt('earth', bodyIndex, J2000);
    const cos = (p.x * v.x + p.y * v.y + p.z * v.z) / (betrag(p) * betrag(v));
    expect(Math.abs(cos)).toBeLessThan(0.05);
  });

  it('ruht die Sonne', () => {
    expect(betrag(velocityAt('sun', bodyIndex, J2000))).toBeCloseTo(0, 9);
  });
});

describe('rotationAt', () => {
  it('dreht die Erde in 23.934 Stunden einmal ganz herum', () => {
    const erde = getBody('earth');
    const p0 = rotationAt(erde, J2000);
    const p1 = rotationAt(erde, J2000 + erde.physical.rotationPeriodH / 24);
    const differenz = Math.abs(((p1 - p0) % (2 * Math.PI)));
    expect(Math.min(differenz, 2 * Math.PI - differenz)).toBeLessThan(1e-6);
  });

  it('dreht die Venus retrograd', () => {
    const venus = getBody('venus');
    expect(venus.physical.rotationPeriodH).toBeLessThan(0);
    expect(rotationAt(venus, J2000 + 1)).toBeLessThan(rotationAt(venus, J2000));
  });

  it('bindet die Rotation des Mondes an seine Umlaufzeit', () => {
    const mond = getBody('moon');
    expect(Math.abs(mond.physical.rotationPeriodH / 24 - 27.32166)).toBeLessThan(0.01);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/rotation.test.ts`
Expected: FAIL — `velocityAt` und `rotationAt` sind nicht exportiert

- [ ] **Step 3: `positionAt` um die Bezugsebenen-Drehung erweitern**

In `src/sim/orbit.ts` ergänzen und in `positionAt` vor der Addition der Elternposition anwenden:

```ts
/**
 * Dreht einen Vektor aus der Äquatorebene des Mutterkörpers in die Ekliptik.
 * Vereinfachung für Phase 1: reine Kippung um die x-Achse um die Achsneigung.
 */
function parentEquatorToEcliptic(v: Vec3, axialTiltDeg: number): Vec3 {
  const t = axialTiltDeg * GRAD;
  const c = Math.cos(t), s = Math.sin(t);
  return { x: v.x, y: c * v.y - s * v.z, z: s * v.y + c * v.z };
}
```

In `positionAt` zwischen `positionInParentFrame` und der Addition einfügen:

```ts
let relativ = positionInParentFrame(body.orbit, jd);
if (body.orbit.frame === 'parentEquator' && body.parent !== null) {
  relativ = parentEquatorToEcliptic(relativ, index[body.parent]!.physical.axialTiltDeg);
}
```

- [ ] **Step 4: Geschwindigkeit und Rotation implementieren**

```ts
/**
 * Geschwindigkeit in km/s durch zentrale Differenz.
 *
 * Numerisch statt analytisch: der Fehler liegt bei einem Schritt von 60 s
 * weit unter einem Promille, und wir sparen uns eine zweite, unabhängig
 * zu pflegende Ableitung der Bahnformeln. Eingesetzt wird sie für die
 * Verfolgungskamera und die Infopanel-Anzeige.
 */
export function velocityAt(id: string, index: BodyIndex, jd: number): Vec3 {
  const dtSekunden = 60;
  const dtTage = dtSekunden / 86400;
  const vor = positionAt(id, index, jd + dtTage);
  const zurueck = positionAt(id, index, jd - dtTage);
  return {
    x: (vor.x - zurueck.x) / (2 * dtSekunden),
    y: (vor.y - zurueck.y) / (2 * dtSekunden),
    z: (vor.z - zurueck.z) / (2 * dtSekunden),
  };
}

/** Rotationsphase in Radiant; negative Perioden drehen retrograd. */
export function rotationAt(body: Body, jd: number): number {
  const stunden = (jd - J2000) * 24;
  const umdrehungen = stunden / body.physical.rotationPeriodH;
  return (body.physical.rotationAtEpochDeg * GRAD) + umdrehungen * 2 * Math.PI;
}
```

`J2000` dazu aus `./time` importieren.

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/sim/`
Expected: PASS — auch die Tests aus Task 4 und 5 bleiben grün

- [ ] **Step 6: Commit**

```bash
git add src/sim/orbit.ts src/sim/rotation.test.ts
git commit -m "Mondbahn, Bahngeschwindigkeit und Eigenrotation ergänzt"
```

---

## Task 7: Maßstabsmodell

Hier steckt die Feinheit der ganzen Phase. Die Potenzkompression darf **nicht** naiv
auf heliozentrische Vektoren angewandt werden: Bei `k = 0.4` schrumpfte der
Erde-Mond-Abstand auf 40 %, während die Erde um `sizeScale` aufgebläht wird — der Mond
verschwände im Planeten. Die Skalierung ist deshalb **hierarchisch**.

**Files:**
- Create: `src/sim/scale.ts`
- Test: `src/sim/scale.test.ts`

**Interfaces:**
- Consumes: `positionAt`, `AU_KM` (Task 4); `BodyIndex`, `Vec3` (Task 3)
- Produces:
  - `ScaleSettings = { sizeScale: number; distanceExponent: number; sunDamping: number }`
  - `SCALE_PRESETS: Record<'realistisch' | 'schaubild' | 'kompakt', ScaleSettings>`
  - `compressDistance(rKm: number, k: number): number`
  - `scaledRadius(body: Body, s: ScaleSettings): number`
  - `scaledPositionAt(id: string, index: BodyIndex, jd: number, s: ScaleSettings): Vec3`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/sim/scale.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  compressDistance, scaledRadius, scaledPositionAt, SCALE_PRESETS,
} from './scale';
import { positionAt, AU_KM } from './orbit';
import { bodyIndex, getBody } from '../data/index';
import { J2000 } from './time';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

describe('compressDistance', () => {
  it('ist bei k = 1 die Identität', () => {
    for (const r of [0.1, 1, 5, 30].map((au) => au * AU_KM)) {
      expect(compressDistance(r, 1)).toBeCloseTo(r, 3);
    }
  });

  it('hält 1 AE für jedes k fest', () => {
    for (const k of [0.35, 0.5, 0.6, 0.8, 1.0]) {
      expect(compressDistance(AU_KM, k)).toBeCloseTo(AU_KM, 3);
    }
  });

  it('ist streng monoton steigend', () => {
    for (const k of [0.35, 0.6, 1.0]) {
      let vorher = -1;
      for (let au = 0.2; au <= 35; au += 0.2) {
        const r = compressDistance(au * AU_KM, k);
        expect(r).toBeGreaterThan(vorher);
        vorher = r;
      }
    }
  });

  it('staucht außen stark und innen kaum', () => {
    const k = 0.4;
    const innen = compressDistance(0.39 * AU_KM, k) / (0.39 * AU_KM);
    const aussen = compressDistance(30 * AU_KM, k) / (30 * AU_KM);
    expect(aussen).toBeLessThan(innen);
    expect(aussen).toBeLessThan(0.35);
  });

  it('bleibt bei Abstand null definiert', () => {
    expect(compressDistance(0, 0.4)).toBe(0);
  });
});

describe('scaledRadius', () => {
  it('gibt bei sizeScale 1 den echten Radius zurück', () => {
    const s = { sizeScale: 1, distanceExponent: 1, sunDamping: 1 };
    expect(scaledRadius(getBody('earth'), s)).toBeCloseTo(6371, 0);
  });

  it('hält die Größenverhältnisse zwischen Planeten konstant', () => {
    const a = { sizeScale: 1, distanceExponent: 1, sunDamping: 1 };
    const b = { sizeScale: 200, distanceExponent: 1, sunDamping: 1 };
    const verhaeltnisA = scaledRadius(getBody('jupiter'), a) / scaledRadius(getBody('earth'), a);
    const verhaeltnisB = scaledRadius(getBody('jupiter'), b) / scaledRadius(getBody('earth'), b);
    expect(verhaeltnisB).toBeCloseTo(verhaeltnisA, 6);
  });

  it('dämpft nur die Sonne', () => {
    const s = { sizeScale: 50, distanceExponent: 1, sunDamping: 0.2 };
    expect(scaledRadius(getBody('sun'), s)).toBeCloseTo(696340 * 50 * 0.2, 0);
    expect(scaledRadius(getBody('earth'), s)).toBeCloseTo(6371 * 50, 0);
  });
});

describe('scaledPositionAt', () => {
  it('ist bei realistischem Preset die unveränderte Simulation', () => {
    const echt = positionAt('mars', bodyIndex, J2000);
    const skaliert = scaledPositionAt('mars', bodyIndex, J2000, SCALE_PRESETS.realistisch);
    expect(skaliert.x).toBeCloseTo(echt.x, 3);
    expect(skaliert.y).toBeCloseTo(echt.y, 3);
    expect(skaliert.z).toBeCloseTo(echt.z, 3);
  });

  it('behält die Richtung bei und ändert nur den Betrag', () => {
    const echt = positionAt('neptune', bodyIndex, J2000);
    const s = SCALE_PRESETS.kompakt;
    const skaliert = scaledPositionAt('neptune', bodyIndex, J2000, s);
    const cos = (echt.x * skaliert.x + echt.y * skaliert.y + echt.z * skaliert.z)
      / (betrag(echt) * betrag(skaliert));
    expect(cos).toBeCloseTo(1, 9);
    expect(betrag(skaliert)).toBeLessThan(betrag(echt));
  });

  // Der eigentliche Zweck der hierarchischen Regel.
  it('hält den Mond bei jedem Preset sichtbar außerhalb der Erde', () => {
    for (const [name, s] of Object.entries(SCALE_PRESETS)) {
      const mond = scaledPositionAt('moon', bodyIndex, J2000, s);
      const erde = scaledPositionAt('earth', bodyIndex, J2000, s);
      const abstand = betrag({ x: mond.x - erde.x, y: mond.y - erde.y, z: mond.z - erde.z });
      const erdradius = scaledRadius(getBody('earth'), s);
      expect(abstand, `Preset ${name}`).toBeGreaterThan(erdradius * 2);
    }
  });

  it('hält das Verhältnis Erdradius zu Mondbahn konstant', () => {
    // Weil Mondabstände mit sizeScale skalieren, bleibt die lokale
    // Geometrie um die Erde bei jedem Preset dieselbe.
    const verhaeltnis = (s: typeof SCALE_PRESETS.realistisch) => {
      const mond = scaledPositionAt('moon', bodyIndex, J2000, s);
      const erde = scaledPositionAt('earth', bodyIndex, J2000, s);
      const d = betrag({ x: mond.x - erde.x, y: mond.y - erde.y, z: mond.z - erde.z });
      return d / scaledRadius(getBody('earth'), s);
    };
    expect(verhaeltnis(SCALE_PRESETS.kompakt))
      .toBeCloseTo(verhaeltnis(SCALE_PRESETS.realistisch), 3);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/scale.test.ts`
Expected: FAIL — `./scale` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/sim/scale.ts`:

```ts
import type { Body, BodyIndex, Vec3 } from './types';
import { positionAt, AU_KM } from './orbit';

export interface ScaleSettings {
  /** Faktor auf alle Körperradien; 1 = echt. */
  sizeScale: number;
  /** Exponent k der Abstandskompression; 1 = maßstabsgetreu. */
  distanceExponent: number;
  /** Zusätzlicher Faktor nur für die Sonne; 1 = ungedämpft. */
  sunDamping: number;
}

export const SCALE_PRESETS: Record<'realistisch' | 'schaubild' | 'kompakt', ScaleSettings> = {
  realistisch: { sizeScale: 1,   distanceExponent: 1.0,  sunDamping: 1.0 },
  schaubild:   { sizeScale: 50,  distanceExponent: 0.6,  sunDamping: 0.35 },
  kompakt:     { sizeScale: 200, distanceExponent: 0.4,  sunDamping: 0.2 },
};

/**
 * Potenzkompression mit Fixpunkt bei 1 AE:
 *   r' = A * (r / A)^k
 * Bei k = 1 die Identität. Sinkendes k staucht außen stark, innen kaum —
 * die Erde bleibt ortsfest, wodurch der Regler beim Ziehen ruhig wirkt.
 */
export function compressDistance(rKm: number, k: number): number {
  if (rKm <= 0) return 0;
  return AU_KM * Math.pow(rKm / AU_KM, k);
}

/** Dargestellter Radius in km. Nur die Sonne wird zusätzlich gedämpft. */
export function scaledRadius(body: Body, s: ScaleSettings): number {
  const daempfung = body.kind === 'star' ? s.sunDamping : 1;
  return body.physical.radiusKm * s.sizeScale * daempfung;
}

/**
 * Dargestellte Position in km — hierarchisch.
 *
 * Planeten: Richtung bleibt, der heliozentrische Betrag wird komprimiert.
 * Monde:    Position des Mutterkörpers plus der mit sizeScale skalierte
 *           Relativvektor. Wären Mondabstände ebenfalls komprimiert,
 *           zoege k = 0.4 den Mond auf 40 % heran, während die Erde um
 *           sizeScale wächst — der Mond laege im Planeten. Durch die
 *           Kopplung an sizeScale bleibt das Verhältnis Planetenradius
 *           zu Mondbahn bei jedem Preset exakt korrekt.
 */
export function scaledPositionAt(
  id: string, index: BodyIndex, jd: number, s: ScaleSettings,
): Vec3 {
  const body = index[id];
  if (!body) throw new Error(`Unbekannter Körper: ${id}`);
  if (body.orbit === null) return { x: 0, y: 0, z: 0 };

  if (body.kind === 'moon' && body.parent !== null) {
    const eltern = scaledPositionAt(body.parent, index, jd, s);
    const echtEltern = positionAt(body.parent, index, jd);
    const echtSelbst = positionAt(id, index, jd);
    return {
      x: eltern.x + (echtSelbst.x - echtEltern.x) * s.sizeScale,
      y: eltern.y + (echtSelbst.y - echtEltern.y) * s.sizeScale,
      z: eltern.z + (echtSelbst.z - echtEltern.z) * s.sizeScale,
    };
  }

  const echt = positionAt(id, index, jd);
  const r = Math.sqrt(echt.x ** 2 + echt.y ** 2 + echt.z ** 2);
  if (r === 0) return { x: 0, y: 0, z: 0 };
  const faktor = compressDistance(r, s.distanceExponent) / r;
  return { x: echt.x * faktor, y: echt.y * faktor, z: echt.z * faktor };
}
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/sim/scale.test.ts`
Expected: PASS, insbesondere „hält den Mond sichtbar außerhalb der Erde" für alle drei Presets

- [ ] **Step 5: Commit**

```bash
git add src/sim/scale.ts src/sim/scale.test.ts
git commit -m "Maßstabsmodell mit hierarchischer Skalierung implementiert"
```

---

## Task 8: Store und Serialisierung

**Files:**
- Create: `src/store/types.ts`, `src/store/index.ts`, `src/store/serialize.ts`
- Test: `src/store/serialize.test.ts`

**Interfaces:**
- Consumes: `ScaleSettings`, `SCALE_PRESETS` (Task 7); `J2000` (Task 1)
- Produces:
  - `AppState` mit den Zweigen `time`, `scale`, `display`, `camera`, `visible`, `quality`, `ui`
  - `useStore` (Zustand-Hook), `getState()`, `setState()`
  - `DEFAULT_STATE: AppState`
  - `toShareable(state: AppState): Record<string, unknown>` — nur Abweichungen
  - `fromShareable(patch: Record<string, unknown>): AppState`
  - `encodeState(state: AppState): string`, `decodeState(fragment: string): AppState`

- [ ] **Step 1: Zustandstypen und Standardwerte schreiben**

`src/store/types.ts`:

```ts
export type CameraMode = 'free' | 'attached' | 'follow';
export type QualityTier = 'auto' | 'low' | 'medium' | 'high';

export interface AppState {
  time: { jd: number; rateDaysPerSec: number; paused: boolean };
  scale: { sizeScale: number; distanceExponent: number; sunDamping: number; preset: string | null };
  display: {
    orbits: boolean; labels: boolean; markers: boolean;
    bloom: boolean; brightness: number; lightFalloff: number;
  };
  camera: {
    mode: CameraMode; targetId: string;
    distance: number; azimuth: number; elevation: number;
  };
  visible: Record<string, boolean>;
  quality: { tier: QualityTier };
  ui: { hidden: boolean; panels: Record<string, boolean>; language: 'de' };
}
```

`src/store/index.ts`:

```ts
import { create } from 'zustand';
import type { AppState } from './types';
import { SCALE_PRESETS } from '../sim/scale';
import { J2000 } from '../sim/time';

export const DEFAULT_STATE: AppState = {
  time: { jd: J2000, rateDaysPerSec: 1, paused: false },
  scale: { ...SCALE_PRESETS.schaubild, preset: 'schaubild' },
  display: {
    orbits: true, labels: true, markers: true,
    bloom: true, brightness: 1, lightFalloff: 2,
  },
  camera: { mode: 'free', targetId: 'sun', distance: 8e8, azimuth: 0.6, elevation: 0.5 },
  visible: {},
  quality: { tier: 'auto' },
  ui: { hidden: false, panels: { time: true, scale: true, camera: true, tree: true }, language: 'de' },
};

interface Actions {
  setTime(patch: Partial<AppState['time']>): void;
  setScale(patch: Partial<AppState['scale']>): void;
  setDisplay(patch: Partial<AppState['display']>): void;
  setCamera(patch: Partial<AppState['camera']>): void;
  setUi(patch: Partial<AppState['ui']>): void;
  toggleVisible(id: string): void;
  replaceAll(state: AppState): void;
}

export const useStore = create<AppState & Actions>((set) => ({
  ...structuredClone(DEFAULT_STATE),
  setTime: (p) => set((s) => ({ time: { ...s.time, ...p } })),
  setScale: (p) => set((s) => ({ scale: { ...s.scale, ...p } })),
  setDisplay: (p) => set((s) => ({ display: { ...s.display, ...p } })),
  setCamera: (p) => set((s) => ({ camera: { ...s.camera, ...p } })),
  setUi: (p) => set((s) => ({ ui: { ...s.ui, ...p } })),
  toggleVisible: (id) => set((s) => ({ visible: { ...s.visible, [id]: s.visible[id] === false } })),
  replaceAll: (state) => set(structuredClone(state)),
}));
```

Hinweis zur Sichtbarkeit: `visible` enthält **nur Abweichungen** vom Standard
„sichtbar". `visible[id] === false` blendet aus, jeder andere Wert zeigt an. Dadurch
bleibt der geteilte Zustand klein.

- [ ] **Step 2: Den fehlschlagenden Test schreiben**

`src/store/serialize.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from './index';
import { toShareable, fromShareable, encodeState, decodeState } from './serialize';
import type { AppState } from './types';

const abgewandelt = (): AppState => {
  const s = structuredClone(DEFAULT_STATE);
  s.time.jd = 2461294.5;
  s.time.rateDaysPerSec = -30;
  s.scale.distanceExponent = 0.42;
  s.camera.targetId = 'saturn';
  s.camera.mode = 'attached';
  s.visible.mercury = false;
  return s;
};

describe('toShareable', () => {
  it('liefert für den Standardzustand ein leeres Objekt', () => {
    expect(toShareable(structuredClone(DEFAULT_STATE))).toEqual({});
  });

  it('nimmt ausschließlich Abweichungen auf', () => {
    const patch = toShareable(abgewandelt());
    const text = JSON.stringify(patch);
    expect(text).toContain('saturn');
    expect(text).not.toContain('brightness');
    expect(text.length).toBeLessThan(300);
  });
});

describe('Round-Trip', () => {
  it('stellt den Zustand über toShareable und fromShareable exakt wieder her', () => {
    const original = abgewandelt();
    expect(fromShareable(toShareable(original))).toEqual(original);
  });

  it('stellt den Zustand über die URL-Kodierung exakt wieder her', () => {
    const original = abgewandelt();
    expect(decodeState(encodeState(original))).toEqual(original);
  });

  it('kodiert URL-sicher', () => {
    const fragment = encodeState(abgewandelt());
    expect(fragment).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('fällt bei beschaedigtem Fragment auf den Standardzustand zurück', () => {
    expect(decodeState('kein-gueltiges-base64!!')).toEqual(DEFAULT_STATE);
    expect(decodeState('')).toEqual(DEFAULT_STATE);
  });
});
```

- [ ] **Step 3: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/store/serialize.test.ts`
Expected: FAIL — `./serialize` nicht auflösbar

- [ ] **Step 4: Implementierung schreiben**

`src/store/serialize.ts`:

```ts
import type { AppState } from './types';
import { DEFAULT_STATE } from './index';

type Plain = Record<string, unknown>;

/** Rekursiver Differenzbildner: nur Felder, die vom Standard abweichen. */
function diff(ist: Plain, soll: Plain): Plain {
  const out: Plain = {};
  for (const [key, wert] of Object.entries(ist)) {
    const standard = soll[key];
    if (wert !== null && typeof wert === 'object' && !Array.isArray(wert)
        && standard !== null && typeof standard === 'object') {
      const tiefer = diff(wert as Plain, standard as Plain);
      if (Object.keys(tiefer).length > 0) out[key] = tiefer;
    } else if (wert !== standard) {
      out[key] = wert;
    }
  }
  return out;
}

function merge(basis: Plain, patch: Plain): Plain {
  const out: Plain = { ...basis };
  for (const [key, wert] of Object.entries(patch)) {
    const vorhanden = out[key];
    if (wert !== null && typeof wert === 'object' && !Array.isArray(wert)
        && vorhanden !== null && typeof vorhanden === 'object') {
      out[key] = merge(vorhanden as Plain, wert as Plain);
    } else {
      out[key] = wert;
    }
  }
  return out;
}

/** Nur die Abweichungen vom Standard — das hält geteilte Links kurz. */
export function toShareable(state: AppState): Plain {
  return diff(state as unknown as Plain, DEFAULT_STATE as unknown as Plain);
}

export function fromShareable(patch: Plain): AppState {
  return merge(
    structuredClone(DEFAULT_STATE) as unknown as Plain, patch,
  ) as unknown as AppState;
}

/** Base64URL ohne Fuellzeichen — im URL-Fragment ohne Maskierung verwendbar. */
function toBase64Url(text: string): string {
  return btoa(unescape(encodeURIComponent(text)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(fragment: string): string {
  const gefuellt = fragment.replace(/-/g, '+').replace(/_/g, '/')
    + '='.repeat((4 - (fragment.length % 4)) % 4);
  return decodeURIComponent(escape(atob(gefuellt)));
}

export function encodeState(state: AppState): string {
  return toBase64Url(JSON.stringify(toShareable(state)));
}

export function decodeState(fragment: string): AppState {
  if (!fragment) return structuredClone(DEFAULT_STATE);
  try {
    return fromShareable(JSON.parse(fromBase64Url(fragment)) as Plain);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}
```

`btoa`/`atob` existieren in Node 24 global — die Tests laufen daher in der
`node`-Umgebung ohne Zusatz.

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/store/`
Expected: PASS, alle sechs Tests

- [ ] **Step 6: Commit**

```bash
git add src/store
git commit -m "Store mit differenzbasierter Serialisierung und URL-Kodierung"
```

---

## Task 9: Render-Grundgerüst und kamerarelative Darstellung

Ab hier wird gerendert. Der Kern dieses Tasks ist die kamerarelative Transformation —
ohne sie wackeln entfernte Körper sichtbar, weil 32-Bit-Gleitkomma bei 30 AE in
Kilometern nur noch auf rund 500 km genau ist.

**Files:**
- Create: `src/render/units.ts`, `src/render/renderer.ts`, `src/render/scene.ts`, `src/app/loop.ts`
- Modify: `src/app/main.tsx`, `index.html`
- Test: `src/render/units.test.ts`

**Interfaces:**
- Consumes: `Vec3` (Task 3), `scaledPositionAt`, `scaledRadius` (Task 7), `useStore` (Task 8)
- Produces:
  - `RENDER_UNIT_KM = 1000`
  - `kmToUnits(km: number): number`, `unitsToKm(u: number): number`
  - `worldToRender(posKm: Vec3, cameraKm: Vec3): Vec3` — kamerarelativ, in Render-Einheiten
  - `createRenderer(canvas: HTMLCanvasElement): RenderContext` mit `{ renderer, camera, scene, resize, dispose }`
  - `startLoop(onFrame: (jd: number, dtSek: number) => void): () => void` — der Rückgabewert bricht die Schleife ab

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/units.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { RENDER_UNIT_KM, kmToUnits, unitsToKm, worldToRender } from './units';
import { AU_KM } from '../sim/orbit';

describe('Einheitenumrechnung', () => {
  it('bildet 1000 km auf eine Render-Einheit ab', () => {
    expect(RENDER_UNIT_KM).toBe(1000);
    expect(kmToUnits(1000)).toBeCloseTo(1, 12);
    expect(unitsToKm(kmToUnits(12345))).toBeCloseTo(12345, 9);
  });
});

describe('worldToRender', () => {
  it('setzt die Kameraposition in den Ursprung', () => {
    const kamera = { x: 5 * AU_KM, y: -2 * AU_KM, z: 1000 };
    const r = worldToRender(kamera, kamera);
    expect(r.x).toBeCloseTo(0, 12);
    expect(r.y).toBeCloseTo(0, 12);
    expect(r.z).toBeCloseTo(0, 12);
  });

  it('erhält Abstände', () => {
    const kamera = { x: 30 * AU_KM, y: 0, z: 0 };
    const ziel = { x: 30 * AU_KM + 400_000, y: 0, z: 0 };
    expect(worldToRender(ziel, kamera).x).toBeCloseTo(400, 9);
  });

  // Dieser Test begruendet die gesamte Technik.
  it('rettet Kilometergenauigkeit, die absolute Koordinaten in float32 verlieren', () => {
    const fernKm = 30 * AU_KM;
    const kamera = { x: fernKm, y: 0, z: 0 };

    // Absolut: der Wert wird beim Übergang nach float32 grob gerundet.
    const absolutVerlust = Math.abs(
      unitsToKm(Math.fround(kmToUnits(fernKm + 1))) - (fernKm + 1),
    );
    expect(absolutVerlust).toBeGreaterThan(100);

    // Kamerarelativ: derselbe Punkt bleibt auf Bruchteile eines Kilometers genau.
    const relativVerlust = Math.abs(
      unitsToKm(Math.fround(worldToRender({ x: fernKm + 1, y: 0, z: 0 }, kamera).x)) - 1,
    );
    expect(relativVerlust).toBeLessThan(0.01);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/units.test.ts`
Expected: FAIL — `./units` nicht auflösbar

- [ ] **Step 3: Einheitenmodul schreiben (bewusst ohne Three.js-Import)**

`src/render/units.ts`:

```ts
import type { Vec3 } from '../sim/types';

/** Eine Three.js-Einheit entspricht 1000 km. */
export const RENDER_UNIT_KM = 1000;

export const kmToUnits = (km: number): number => km / RENDER_UNIT_KM;
export const unitsToKm = (u: number): number => u * RENDER_UNIT_KM;

/**
 * Rechnet eine Weltposition in kamerarelative Render-Koordinaten um.
 *
 * Die Subtraktion geschieht in JavaScript, also in float64. Erst das
 * Ergebnis — eine kleine Zahl — geht an die GPU. Ohne diesen Schritt
 * würde ein Punkt bei 30 AE in float32 auf rund 500 km genau landen,
 * und die äußeren Planeten würden sichtbar zittern.
 */
export function worldToRender(posKm: Vec3, cameraKm: Vec3): Vec3 {
  return {
    x: kmToUnits(posKm.x - cameraKm.x),
    y: kmToUnits(posKm.y - cameraKm.y),
    z: kmToUnits(posKm.z - cameraKm.z),
  };
}
```

- [ ] **Step 4: Renderer aufsetzen**

`src/render/renderer.ts`:

```ts
import * as THREE from 'three';

export interface RenderContext {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  resize: () => void;
  dispose: () => void;
}

export function createRenderer(canvas: HTMLCanvasElement): RenderContext {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    // Ohne diesen Puffer flimmern Objekte, die Größenordnungen
    // auseinanderliegen, gegeneinander.
    logarithmicDepthBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();

  // Die Kamera sitzt konstruktionsbedingt immer im Ursprung; bewegt wird
  // die Welt um sie herum (siehe worldToRender).
  const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
  camera.position.set(0, 0, 0);
  camera.up.set(0, 0, 1); // Ekliptik-Normale zeigt nach oben

  const resize = () => {
    const b = canvas.getBoundingClientRect();
    renderer.setSize(b.width, b.height, false);
    camera.aspect = b.width / Math.max(b.height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  return {
    renderer, camera, scene, resize,
    dispose: () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
```

- [ ] **Step 5: Szene und Schleife schreiben**

`src/render/scene.ts` — vorerst nur die Sonne als emissive Kugel plus ein Punktlicht,
damit der Durchstich sichtbar wird. Task 10 ersetzt das durch alle Körper:

```ts
import * as THREE from 'three';
import type { RenderContext } from './renderer';
import type { AppState } from '../store/types';

/**
 * Zielsignatur — sie bleibt bis Task 15 unverändert. Die Szene holt sich
 * Maßstab, Sichtbarkeiten und Kameramodus selbst aus dem übergebenen
 * Zustand, statt mit jedem Task einen weiteren Parameter zu bekommen.
 */
export interface SceneHandle {
  update: (jd: number, dt: number, state: AppState) => void;
}

export function buildScene(ctx: RenderContext): SceneHandle {
  const sonne = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 32),
    new THREE.MeshBasicMaterial({ color: 0xffd9a0 }),
  );
  ctx.scene.add(sonne);
  ctx.scene.add(new THREE.PointLight(0xffffff, 1, 0, 2));

  return { update: () => { /* Task 10 fuellt das */ } };
}
```

`src/app/loop.ts`:

```ts
import { useStore } from '../store';

/**
 * Die Renderschleife. Sie liest den Store direkt (ohne Abonnement), damit
 * React-Rerenders und Bildrate vollständig entkoppelt bleiben.
 */
export function startLoop(onFrame: (jd: number, dtSek: number) => void): () => void {
  let laeuft = true;
  let letzte = performance.now();

  const tick = (jetzt: number) => {
    if (!laeuft) return;
    const dtSek = Math.min((jetzt - letzte) / 1000, 0.1); // Sprung nach Tab-Wechsel deckeln
    letzte = jetzt;

    const s = useStore.getState();
    if (!s.time.paused) {
      useStore.setState({ time: { ...s.time, jd: s.time.jd + s.time.rateDaysPerSec * dtSek } });
    }
    onFrame(useStore.getState().time.jd, dtSek);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
  return () => { laeuft = false; };
}
```

- [ ] **Step 6: Einstiegspunkt verdrahten**

`src/app/main.tsx` rendert ein `<canvas>` über die volle Fläche, ruft `createRenderer`,
`buildScene` und `startLoop` auf und rendert pro Frame. React montiert daneben ein
leeres Overlay-`<div>`, das Task 16 füllt.

- [ ] **Step 7: Tests und Sichtprüfung**

Run: `npx vitest run src/render/units.test.ts` → PASS
Run: `npm run dev`

Manuelle Prüfung im Browser: eine helle Kugel in der Bildmitte, das Fenster lässt sich
ohne Verzerrung skalieren, die Konsole bleibt fehlerfrei.

- [ ] **Step 8: Commit**

```bash
git add src/render src/app index.html
git commit -m "Render-Grundgerüst mit kamerarelativer Darstellung"
```

---

## Task 10: Körper-Meshes, Texturen und Eigenrotation

**Files:**
- Create: `src/render/bodies.ts`, `ASSETS.md`
- Create: `public/textures/<koerper>/albedo.jpg` (10 Dateien)
- Modify: `src/render/scene.ts`
- Test: `src/render/bodies.test.ts`

**Interfaces:**
- Consumes: `scaledPositionAt`, `scaledRadius` (Task 7); `rotationAt` (Task 6); `worldToRender` (Task 9)
- Produces:
  - `createBodyViews(scene: THREE.Scene): BodyViews`
  - `BodyViews.update(jd: number, s: ScaleSettings, cameraKm: THREE.Vector3, sichtbar: Record<string, boolean>): void`
  - `BodyViews.meshes: Map<string, THREE.Mesh>`
  - `MIN_RADIUS_UNITS = 1e-4`
  - `pickRadiusUnits(body: Body, s: ScaleSettings): number` (rein, testbar)

- [ ] **Step 1: Texturen beschaffen und dokumentieren**

Beziehe je Körper eine Albedo-Textur in 2k (2048×1024, äquirektangulär):

| Körper | Quelle |
|---|---|
| Sonne, alle acht Planeten, Erdmond | <https://www.solarsystemscope.com/textures/> (CC BY 4.0) |
| Alternative/Ergänzung | NASA/JPL und USGS Astrogeology (gemeinfrei) |

Ablage: `public/textures/<id>/albedo.jpg`. Lege `ASSETS.md` im Wurzelverzeichnis an,
mit je einer Zeile pro Datei: Pfad, Quelle (URL), Urheber, Lizenz, Bearbeitung
(z. B. „auf 2048×1024 skaliert, als JPEG Qualität 85 gespeichert"). Ohne diese Datei
ist die Namensnennungspflicht der CC-BY-Lizenz verletzt.

- [ ] **Step 2: Den fehlschlagenden Test schreiben**

`src/render/bodies.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { pickRadiusUnits, MIN_RADIUS_UNITS } from './bodies';
import { getBody } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { kmToUnits } from './units';

describe('pickRadiusUnits', () => {
  it('rechnet den skalierten Radius in Render-Einheiten um', () => {
    const s = SCALE_PRESETS.realistisch;
    expect(pickRadiusUnits(getBody('earth'), s)).toBeCloseTo(kmToUnits(6371), 6);
  });

  it('wächst mit sizeScale', () => {
    const klein = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.realistisch);
    const gross = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.kompakt);
    expect(gross).toBeGreaterThan(klein);
  });

  it('fällt nie unter die Mindestgröße', () => {
    // Sonst verschwände ein Körper bei winzigem sizeScale voellig aus der Geometrie.
    const winzig = { sizeScale: 1e-6, distanceExponent: 1, sunDamping: 1 };
    expect(pickRadiusUnits(getBody('moon'), winzig)).toBeGreaterThanOrEqual(MIN_RADIUS_UNITS);
  });

  it('hält die Sonne größer als jeden Planeten', () => {
    for (const s of Object.values(SCALE_PRESETS)) {
      expect(pickRadiusUnits(getBody('sun'), s))
        .toBeGreaterThan(pickRadiusUnits(getBody('jupiter'), s));
    }
  });
});
```

- [ ] **Step 3: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/bodies.test.ts`
Expected: FAIL — `./bodies` nicht auflösbar

- [ ] **Step 4: Implementierung schreiben**

`src/render/bodies.ts`:

```ts
import * as THREE from 'three';
import type { Body } from '../sim/types';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt, scaledRadius } from '../sim/scale';
import { rotationAt } from '../sim/orbit';
import { bodies, bodyIndex } from '../data/index';
import { kmToUnits, worldToRender } from './units';

/** Untergrenze, damit Geometrie nie auf null kollabiert. */
export const MIN_RADIUS_UNITS = 1e-4;

export function pickRadiusUnits(body: Body, s: ScaleSettings): number {
  return Math.max(kmToUnits(scaledRadius(body, s)), MIN_RADIUS_UNITS);
}

export interface BodyViews {
  update(jd: number, s: ScaleSettings, cameraKm: THREE.Vector3,
         visible: Record<string, boolean>): void;
  meshes: Map<string, THREE.Mesh>;
}

export function createBodyViews(scene: THREE.Scene): BodyViews {
  const lader = new THREE.TextureLoader();
  const meshes = new Map<string, THREE.Mesh>();

  for (const body of bodies) {
    const textur = lader.load(body.appearance.textures.albedo);
    textur.colorSpace = THREE.SRGBColorSpace;

    // Die Sonne leuchtet selbst, alle anderen werden beleuchtet.
    const material = body.kind === 'star'
      ? new THREE.MeshBasicMaterial({ map: textur })
      : new THREE.MeshStandardMaterial({ map: textur, roughness: 1, metalness: 0 });

    // Einheitskugel; die tatsaechliche Größe kommt über scale.
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material);
    mesh.rotation.x = Math.PI / 2; // Pol auf die z-Achse (Ekliptik-Normale)
    scene.add(mesh);
    meshes.set(body.id, mesh);
  }

  return {
    meshes,
    update(jd, s, cameraKm, sichtbar) {
      for (const body of bodies) {
        const mesh = meshes.get(body.id)!;
        if (sichtbar[body.id] === false) { mesh.visible = false; continue; }
        mesh.visible = true;

        const weltKm = scaledPositionAt(body.id, bodyIndex, jd, s);
        const r = worldToRender(weltKm, cameraKm);
        mesh.position.set(r.x, r.y, r.z);

        const radius = pickRadiusUnits(body, s);
        mesh.scale.setScalar(radius);

        // Achsneigung und Eigenrotation
        mesh.rotation.set(Math.PI / 2, 0, 0);
        mesh.rotateX(body.physical.axialTiltDeg * Math.PI / 180);
        mesh.rotateY(rotationAt(body, jd));
      }
    },
  };
}
```

In `src/render/scene.ts` die Platzhalter-Kugel durch `createBodyViews` ersetzen und in
`update` durchreichen. Das Punktlicht auf die Sonnenposition setzen (im kamerarelativen
System also auf `worldToRender(sonnenposition, cameraKm)`), Intensität aus
`store.display.brightness`, Abfall aus `store.display.lightFalloff`.

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/render/`
Expected: PASS

- [ ] **Step 6: Sichtprüfung**

Run: `npm run dev`

Zu sehen sein muss: texturierte Sonne, davon beleuchtete Planeten mit sichtbarer
Tag-Nacht-Grenze, Erde und Mars erkennbar an ihren Texturen, die Körper drehen sich.
Zeitraffer über `store.time.rateDaysPerSec` testweise auf 10 setzen — die Planeten
müssen sich sichtbar auf ihren Bahnen bewegen.

- [ ] **Step 7: Commit**

```bash
git add src/render/bodies.ts src/render/bodies.test.ts src/render/scene.ts public/textures ASSETS.md
git commit -m "Körper-Meshes mit Texturen, Beleuchtung und Eigenrotation"
```

---

## Task 11: Bahnlinien

**Files:**
- Create: `src/render/orbits.ts`
- Modify: `src/render/scene.ts`
- Test: `src/render/orbits.test.ts`

**Interfaces:**
- Consumes: `scaledPositionAt` (Task 7), `worldToRender` (Task 9), `elementsAt` (Task 4)
- Produces:
  - `ORBIT_SEGMENTS = 512`
  - `orbitPointsKm(id: string, index: BodyIndex, jd: number, s: ScaleSettings): Vec3[]` (rein)
  - `createOrbitLines(scene: THREE.Scene): OrbitLines` mit `update(...)` und `rebuild(...)`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/orbits.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { orbitPointsKm, ORBIT_SEGMENTS } from './orbits';
import { bodyIndex } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { scaledPositionAt } from '../sim/scale';
import { J2000 } from '../sim/time';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

describe('orbitPointsKm', () => {
  const s = SCALE_PRESETS.schaubild;

  it('liefert einen geschlossenen Linienzug', () => {
    const p = orbitPointsKm('mars', bodyIndex, J2000, s);
    expect(p).toHaveLength(ORBIT_SEGMENTS + 1);
    const ersteZuLetzt = betrag({
      x: p[0]!.x - p[ORBIT_SEGMENTS]!.x,
      y: p[0]!.y - p[ORBIT_SEGMENTS]!.y,
      z: p[0]!.z - p[ORBIT_SEGMENTS]!.z,
    });
    expect(ersteZuLetzt / betrag(p[0]!)).toBeLessThan(0.001);
  });

  it('läuft durch die aktuelle Position des Körpers', () => {
    const jetzt = scaledPositionAt('earth', bodyIndex, J2000, s);
    const p = orbitPointsKm('earth', bodyIndex, J2000, s);
    const naechster = Math.min(...p.map((q) => betrag({
      x: q.x - jetzt.x, y: q.y - jetzt.y, z: q.z - jetzt.z,
    })));
    expect(naechster / betrag(jetzt)).toBeLessThan(0.01);
  });

  it('gibt für die Sonne keine Bahn zurück', () => {
    expect(orbitPointsKm('sun', bodyIndex, J2000, s)).toHaveLength(0);
  });

  // Die Mondbahn ist der Härtefall: Über eine Mondumlaufzeit zieht die Erde
  // selbst rund 0,46 AE weiter. Würde die Bahn im Inertialsystem abgetastet,
  // ergäbe sich eine Zykloide quer durchs Sonnensystem statt einer Ellipse.
  it('zeichnet die Mondbahn als geschlossene Schleife um die Erde', () => {
    const mond = orbitPointsKm('moon', bodyIndex, J2000, s);
    const erde = scaledPositionAt('earth', bodyIndex, J2000, s);
    const abstaende = mond.map((q) => betrag({
      x: q.x - erde.x, y: q.y - erde.y, z: q.z - erde.z,
    }));

    // Mondabstände skalieren laut Maßstabsmodell mit sizeScale.
    expect(Math.min(...abstaende)).toBeGreaterThan(300_000 * s.sizeScale);
    expect(Math.max(...abstaende)).toBeLessThan(460_000 * s.sizeScale);

    const zu = betrag({
      x: mond[0]!.x - mond[ORBIT_SEGMENTS]!.x,
      y: mond[0]!.y - mond[ORBIT_SEGMENTS]!.y,
      z: mond[0]!.z - mond[ORBIT_SEGMENTS]!.z,
    });
    expect(zu).toBeLessThan(20_000 * s.sizeScale);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/orbits.test.ts`
Expected: FAIL — `./orbits` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/render/orbits.ts`:

```ts
import * as THREE from 'three';
import type { BodyIndex, Vec3 } from '../sim/types';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt } from '../sim/scale';
import { bodies, bodyIndex } from '../data/index';
import { worldToRender } from './units';

export const ORBIT_SEGMENTS = 512;

/**
 * Stützpunkte einer Bahn, bereits maßstabsskaliert.
 *
 * Abgetastet wird über eine volle Umlaufzeit, die aus LDot folgt. Dadurch
 * gilt derselbe Code für Planeten und Monde — der Mond umrundet automatisch
 * seine Erde, weil scaledPositionAt hierarchisch arbeitet.
 */
export function orbitPointsKm(
  id: string, index: BodyIndex, jd: number, s: ScaleSettings,
): Vec3[] {
  const body = index[id];
  if (!body?.orbit) return [];

  // Umlaufzeit aus der Rate der mittleren Länge: LDot ist Grad pro Jahrhundert.
  const periodeTage = 36525 / (body.orbit.LDot / 360);

  // Bei Monden wird der Mutterkörper auf jd festgehalten und nur der
  // Relativvektor variiert. Ohne das verschmierte die Mondbahn über die
  // Eigenbewegung der Erde — in 27,3 Tagen zieht die Erde rund 0,46 AE
  // weiter — zu einer Zykloide quer durchs Sonnensystem, statt die
  // Ellipse um die Erde zu zeigen.
  const umMutter = body.parent !== null && body.parent !== 'sun';
  const ankerJetzt = umMutter ? scaledPositionAt(body.parent!, index, jd, s) : null;

  const punkte: Vec3[] = [];
  for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
    const t = jd + (i / ORBIT_SEGMENTS) * periodeTage;
    const p = scaledPositionAt(id, index, t, s);
    if (ankerJetzt === null) { punkte.push(p); continue; }
    const ankerDann = scaledPositionAt(body.parent!, index, t, s);
    punkte.push({
      x: ankerJetzt.x + (p.x - ankerDann.x),
      y: ankerJetzt.y + (p.y - ankerDann.y),
      z: ankerJetzt.z + (p.z - ankerDann.z),
    });
  }
  return punkte;
}

export interface OrbitLines {
  rebuild(jd: number, s: ScaleSettings): void;
  update(cameraKm: THREE.Vector3, sichtbar: Record<string, boolean>, an: boolean): void;
}

export function createOrbitLines(scene: THREE.Scene): OrbitLines {
  const linien = new Map<string, THREE.Line>();
  const punkteKm = new Map<string, Vec3[]>();

  for (const body of bodies) {
    if (!body.orbit) continue;
    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array((ORBIT_SEGMENTS + 1) * 3), 3));
    const linie = new THREE.Line(geometrie, new THREE.LineBasicMaterial({
      color: new THREE.Color(body.appearance.color), transparent: true, opacity: 0.45,
    }));
    linie.frustumCulled = false;
    scene.add(linie);
    linien.set(body.id, linie);
  }

  return {
    // Nur bei Maßstabsänderung aufrufen — nicht pro Frame.
    rebuild(jd, s) {
      for (const [id] of linien) punkteKm.set(id, orbitPointsKm(id, bodyIndex, jd, s));
    },
    update(cameraKm, sichtbar, an) {
      for (const [id, linie] of linien) {
        linie.visible = an && sichtbar[id] !== false;
        if (!linie.visible) continue;
        const punkte = punkteKm.get(id) ?? [];
        const attr = linie.geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < punkte.length; i++) {
          const r = worldToRender(punkte[i]!, cameraKm);
          attr.setXYZ(i, r.x, r.y, r.z);
        }
        attr.needsUpdate = true;
      }
    },
  };
}
```

Die Positionen werden pro Frame neu in Kamerakoordinaten gebracht (billig), die
Bahnform selbst aber nur bei Maßstabsänderung neu berechnet (teuer). In `scene.ts`
daher `rebuild` an eine Store-Subskription auf `scale` hängen.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/render/orbits.test.ts`
Expected: PASS, alle vier Tests

- [ ] **Step 5: Sichtprüfung**

Run: `npm run dev` — acht geschlossene Ellipsen in den Körperfarben, jeder Planet sitzt
auf seiner Linie, die Mondbahn ist ein kleiner Kreis um die Erde.

- [ ] **Step 6: Commit**

```bash
git add src/render/orbits.ts src/render/orbits.test.ts src/render/scene.ts
git commit -m "Bahnlinien als vorberechnete Polylinien"
```

---

## Task 12: Sternenhintergrund

**Files:**
- Create: `src/data/stars/hyg.json`, `src/render/starfield.ts`
- Modify: `src/render/scene.ts`
- Test: `src/render/starfield.test.ts`

**Interfaces:**
- Produces:
  - `StarRecord = { ra: number; dec: number; mag: number; ci: number }`
  - `equatorialToEcliptic(raDeg: number, decDeg: number): Vec3` — Einheitsvektor
  - `magnitudeToSize(mag: number): number`, `colorIndexToRgb(ci: number): [number, number, number]`
  - `createStarfield(scene: THREE.Scene): THREE.Points`

- [ ] **Step 1: Katalog beschaffen**

HYG-Datenbank (<https://github.com/astronexus/HYG-Database>, CC BY-SA 4.0). Auf
Magnitude ≤ 6.0 filtern (rund 9 000 Sterne) und auf vier Felder reduzieren: Rektaszension
(Grad), Deklination (Grad), scheinbare Helligkeit, B−V-Farbindex. Als
`src/data/stars/hyg.json` ablegen (rund 200 KB). Quelle und Lizenz in `ASSETS.md`
eintragen.

- [ ] **Step 2: Den fehlschlagenden Test schreiben**

`src/render/starfield.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { equatorialToEcliptic, magnitudeToSize, colorIndexToRgb } from './starfield';
import sterne from '../data/stars/hyg.json';

describe('equatorialToEcliptic', () => {
  it('liefert Einheitsvektoren', () => {
    for (const [ra, dec] of [[0, 0], [90, 45], [180, -30], [270, 80]]) {
      const v = equatorialToEcliptic(ra!, dec!);
      expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1, 9);
    }
  });

  it('lässt den Frühlingspunkt auf der x-Achse liegen', () => {
    // RA 0h, Dec 0 ist der gemeinsame Nullpunkt beider Systeme.
    const v = equatorialToEcliptic(0, 0);
    expect(v.x).toBeCloseTo(1, 6);
    expect(v.y).toBeCloseTo(0, 6);
    expect(v.z).toBeCloseTo(0, 6);
  });

  it('kippt den Himmelsnordpol um die Schiefe der Ekliptik', () => {
    // Der Nordpol des Äquatorsystems liegt 23.44 Grad von der Ekliptiknormalen.
    const v = equatorialToEcliptic(0, 90);
    const winkelGrad = Math.acos(v.z) * 180 / Math.PI;
    expect(winkelGrad).toBeCloseTo(23.44, 1);
  });
});

describe('Darstellungsabbildungen', () => {
  it('macht helle Sterne größer als schwache', () => {
    expect(magnitudeToSize(-1.5)).toBeGreaterThan(magnitudeToSize(2));
    expect(magnitudeToSize(2)).toBeGreaterThan(magnitudeToSize(6));
    expect(magnitudeToSize(6)).toBeGreaterThan(0);
  });

  it('färbt blaue Sterne bläulich und rote rötlich', () => {
    const [rB, , bB] = colorIndexToRgb(-0.3); // heißer Blaustern
    const [rR, , bR] = colorIndexToRgb(1.6);  // kuehler Roter Riese
    expect(bB).toBeGreaterThan(rB);
    expect(rR).toBeGreaterThan(bR);
  });
});

describe('Katalog', () => {
  it('enthält rund 9000 Sterne bis Magnitude 6', () => {
    const liste = sterne as { mag: number }[];
    expect(liste.length).toBeGreaterThan(7000);
    expect(liste.length).toBeLessThan(12000);
    expect(Math.max(...liste.map((s) => s.mag))).toBeLessThanOrEqual(6.01);
  });
});
```

- [ ] **Step 3: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/starfield.test.ts`
Expected: FAIL — `./starfield` nicht auflösbar

- [ ] **Step 4: Implementierung schreiben**

`src/render/starfield.ts`:

```ts
import * as THREE from 'three';
import type { Vec3 } from '../sim/types';
import sterne from '../data/stars/hyg.json';

/** Schiefe der Ekliptik zur Epoche J2000. */
const EPSILON = 23.4392911 * Math.PI / 180;
const GRAD = Math.PI / 180;

export interface StarRecord { ra: number; dec: number; mag: number; ci: number }

/** Dreht einen Himmelspunkt vom Äquator- ins Ekliptiksystem. */
export function equatorialToEcliptic(raDeg: number, decDeg: number): Vec3 {
  const ra = raDeg * GRAD, dec = decDeg * GRAD;
  const x = Math.cos(dec) * Math.cos(ra);
  const yAeq = Math.cos(dec) * Math.sin(ra);
  const zAeq = Math.sin(dec);
  return {
    x,
    y: yAeq * Math.cos(EPSILON) + zAeq * Math.sin(EPSILON),
    z: -yAeq * Math.sin(EPSILON) + zAeq * Math.cos(EPSILON),
  };
}

/** Kleinere Magnitude heißt hellerer Stern — die Skala ist umgekehrt. */
export function magnitudeToSize(mag: number): number {
  return Math.max(0.6, 4.2 - 0.55 * mag);
}

/** Grobe Näherung der Sternfarbe aus dem B-V-Index. */
export function colorIndexToRgb(ci: number): [number, number, number] {
  const t = Math.min(Math.max((ci + 0.4) / 2.4, 0), 1); // 0 = blau, 1 = rot
  return [0.6 + 0.4 * t, 0.75 + 0.1 * t - 0.15 * Math.abs(t - 0.5), 1.0 - 0.45 * t];
}

/**
 * Sterne liegen unendlich weit weg — sie werden deshalb auf eine sehr große
 * Kugel um die Kamera gelegt und nie kamerarelativ verschoben.
 */
export function createStarfield(scene: THREE.Scene): THREE.Points {
  const liste = sterne as StarRecord[];
  const positionen = new Float32Array(liste.length * 3);
  const farben = new Float32Array(liste.length * 3);
  const groessen = new Float32Array(liste.length);
  const RADIUS = 1e9;

  liste.forEach((stern, i) => {
    const v = equatorialToEcliptic(stern.ra, stern.dec);
    positionen.set([v.x * RADIUS, v.y * RADIUS, v.z * RADIUS], i * 3);
    farben.set(colorIndexToRgb(stern.ci), i * 3);
    groessen[i] = magnitudeToSize(stern.mag);
  });

  const geometrie = new THREE.BufferGeometry();
  geometrie.setAttribute('position', new THREE.BufferAttribute(positionen, 3));
  geometrie.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  geometrie.setAttribute('size', new THREE.BufferAttribute(groessen, 1));

  // Bewusst ShaderMaterial statt PointsMaterial: Letzteres ignoriert ein
  // Attribut `size` pro Stern und zeichnete alle gleich groß — die
  // Helligkeitsstaffelung, an der man Sternbilder erkennt, käme nie auf den
  // Schirm. Das Attribut `color` deklariert three.js bei vertexColors selbst.
  const punkte = new THREE.Points(geometrie, new THREE.ShaderMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float size;
      varying vec3 vFarbe;
      void main() {
        vFarbe = color;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size;
      }`,
    fragmentShader: `
      varying vec3 vFarbe;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        gl_FragColor = vec4(vFarbe, smoothstep(0.5, 0.15, d));
      }`,
  }));
  punkte.frustumCulled = false;
  scene.add(punkte);
  return punkte;
}
```

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/render/starfield.test.ts`
Expected: PASS, alle sechs Tests

- [ ] **Step 6: Sichtprüfung**

Run: `npm run dev` — der Hintergrund ist besternt, die Sterne bleiben beim Schwenken
stehen (sie bewegen sich nicht mit den Planeten), und bekannte Sternbilder sind
erkennbar. Prüfe den Großen Wagen: sieben helle Sterne in charakteristischer Form.

- [ ] **Step 7: Commit**

```bash
git add src/data/stars src/render/starfield.ts src/render/starfield.test.ts ASSETS.md
git commit -m "Sternenhintergrund aus HYG-Katalog mit korrekten Sternbildern"
```

---

## Task 13: Post-Processing mit selektivem Bloom

**Files:**
- Create: `src/render/postfx.ts`
- Modify: `src/render/bodies.ts` (Sonne auf die Bloom-Ebene legen), `src/render/scene.ts`, `src/app/main.tsx`
- Test: `src/render/postfx.test.ts`

**Interfaces:**
- Produces:
  - `BLOOM_LAYER = 1`
  - `createPostFx(ctx: RenderContext): { render(): void; setBloom(an: boolean, tier?: QualityTier): void; resize(): void }`
  - `bloomStrengthFor(tier: QualityTier): number` (rein, testbar)

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/postfx.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { bloomStrengthFor, BLOOM_LAYER } from './postfx';

describe('bloomStrengthFor', () => {
  it('schaltet Bloom auf niedriger Stufe ganz ab', () => {
    expect(bloomStrengthFor('low')).toBe(0);
  });

  it('steigert die Stärke mit der Qualitätsstufe', () => {
    expect(bloomStrengthFor('high')).toBeGreaterThan(bloomStrengthFor('medium'));
    expect(bloomStrengthFor('medium')).toBeGreaterThan(bloomStrengthFor('low'));
  });

  it('behandelt auto wie mittel', () => {
    expect(bloomStrengthFor('auto')).toBe(bloomStrengthFor('medium'));
  });

  it('nutzt eine eigene Ebene für leuchtende Objekte', () => {
    expect(BLOOM_LAYER).toBe(1);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/postfx.test.ts`
Expected: FAIL — `./postfx` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/render/postfx.ts`:

```ts
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { RenderContext } from './renderer';
import type { QualityTier } from '../store/types';

/**
 * Nur Objekte auf dieser Ebene strahlen. Ohne die Trennung würde die
 * ganze Szene milchig — genau der Effekt, der billig aussieht.
 */
export const BLOOM_LAYER = 1;

export function bloomStrengthFor(tier: QualityTier): number {
  switch (tier) {
    case 'low': return 0;
    case 'high': return 1.1;
    case 'medium':
    case 'auto':
    default: return 0.7;
  }
}

export function createPostFx(ctx: RenderContext) {
  const groesse = new THREE.Vector2();
  ctx.renderer.getSize(groesse);

  const composer = new EffectComposer(ctx.renderer);
  composer.addPass(new RenderPass(ctx.scene, ctx.camera));

  const bloom = new UnrealBloomPass(groesse, 0.7, 0.5, 0.85);
  composer.addPass(bloom);

  return {
    render: () => composer.render(),
    setBloom: (an: boolean, tier: QualityTier = 'medium') => {
      bloom.strength = an ? bloomStrengthFor(tier) : 0;
      bloom.enabled = an && bloom.strength > 0;
    },
    resize: () => {
      ctx.renderer.getSize(groesse);
      composer.setSize(groesse.x, groesse.y);
    },
  };
}
```

In `bodies.ts` die Sonne zusätzlich auf die Bloom-Ebene legen:
`sonnenMesh.layers.enable(BLOOM_LAYER)`. In `main.tsx` statt `renderer.render(...)`
nun `postfx.render()` aufrufen und `resize` mit anhängen.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/render/postfx.test.ts`
Expected: PASS

- [ ] **Step 5: Sichtprüfung**

Run: `npm run dev` — die Sonne bekommt einen weichen Lichtkranz, die Planeten bleiben
scharf und werden **nicht** milchig. Bloom über den Store abschalten und prüfen, dass
das Bild sofort nüchtern wird.

- [ ] **Step 6: Commit**

```bash
git add src/render/postfx.ts src/render/postfx.test.ts src/render/bodies.ts src/app/main.tsx
git commit -m "Selektives Bloom und ACES-Tonemapping"
```

---

## Task 14: Kamera-Controller mit Dämpfung

Der Entwurfskern: Jeder Modus liefert **nur ein Ziel-Transform**; ein kritisch
gedämpfter Filter nähert die tatsächliche Kamera daran an. Weiche Übergänge zwischen
beliebigen Modi entstehen dadurch von selbst, statt einzeln programmiert zu werden.

**Files:**
- Create: `src/render/camera/damping.ts`, `src/render/camera/controller.ts`
- Modify: `src/render/scene.ts`, `src/app/main.tsx`
- Test: `src/render/camera/damping.test.ts`

**Interfaces:**
- Consumes: `scaledPositionAt` (Task 7), `velocityAt` (Task 6), `useStore` (Task 8)
- Produces:
  - `smoothDamp(ist: number, ziel: number, geschwindigkeit: { wert: number }, zeitkonstante: number, dt: number): number`
  - `smoothDampVec3(ist: Vec3, ziel: Vec3, v: Vec3, zeitkonstante: number, dt: number): Vec3`
  - `CameraTarget = { positionKm: Vec3; lookAtKm: Vec3 }`
  - `targetFor(state: AppState, jd: number, s: ScaleSettings): CameraTarget`
  - `createCameraController(camera: THREE.PerspectiveCamera): { update(state: AppState, jd: number, dt: number, s: ScaleSettings): Vec3 }` — der Rückgabewert ist die Kameraposition in km, die **alle** `worldToRender`-Aufrufe desselben Frames brauchen

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/camera/damping.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { smoothDamp, smoothDampVec3 } from './damping';

describe('smoothDamp', () => {
  it('nähert sich dem Ziel monoton ohne zu überschwingen', () => {
    const v = { wert: 0 };
    let ist = 0;
    let vorher = -1;
    for (let i = 0; i < 200; i++) {
      ist = smoothDamp(ist, 100, v, 0.3, 1 / 60);
      expect(ist).toBeGreaterThanOrEqual(vorher);
      expect(ist).toBeLessThanOrEqual(100.0001); // kein Überschwingen
      vorher = ist;
    }
    expect(ist).toBeCloseTo(100, 2);
  });

  it('bleibt stehen, wenn Ist und Ziel gleich sind', () => {
    const v = { wert: 0 };
    expect(smoothDamp(42, 42, v, 0.3, 1 / 60)).toBeCloseTo(42, 9);
    expect(v.wert).toBeCloseTo(0, 9);
  });

  it('folgt einem größeren Zeitschritt ohne zu explodieren', () => {
    const v = { wert: 0 };
    const ist = smoothDamp(0, 100, v, 0.3, 2.0); // Tab war lange inaktiv
    expect(Number.isFinite(ist)).toBe(true);
    expect(ist).toBeLessThanOrEqual(100.0001);
    expect(ist).toBeGreaterThan(90);
  });

  it('ist mit kleinerer Zeitkonstante schneller', () => {
    const schnell = { wert: 0 }, langsam = { wert: 0 };
    let a = 0, b = 0;
    for (let i = 0; i < 30; i++) {
      a = smoothDamp(a, 100, schnell, 0.1, 1 / 60);
      b = smoothDamp(b, 100, langsam, 1.0, 1 / 60);
    }
    expect(a).toBeGreaterThan(b);
  });
});

describe('smoothDampVec3', () => {
  it('dämpft alle drei Achsen gemeinsam', () => {
    const v = { x: 0, y: 0, z: 0 };
    let ist = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 300; i++) {
      ist = smoothDampVec3(ist, { x: 10, y: -20, z: 5 }, v, 0.3, 1 / 60);
    }
    expect(ist.x).toBeCloseTo(10, 2);
    expect(ist.y).toBeCloseTo(-20, 2);
    expect(ist.z).toBeCloseTo(5, 2);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/camera/damping.test.ts`
Expected: FAIL — `./damping` nicht auflösbar

- [ ] **Step 3: Dämpfung implementieren**

`src/render/camera/damping.ts`:

```ts
import type { Vec3 } from '../../sim/types';

/**
 * Kritisch gedämpfte Annäherung (Feder ohne Überschwingen).
 *
 * Die Zeitkonstante gibt an, wie lange die Annäherung ungefähr dauert.
 * Die geschlossene Form ist framerate-unabhängig und bleibt auch bei
 * großen Zeitschritten stabil — wichtig, wenn der Tab im Hintergrund war.
 */
export function smoothDamp(
  ist: number, ziel: number, geschwindigkeit: { wert: number },
  zeitkonstante: number, dt: number,
): number {
  const omega = 2 / Math.max(zeitkonstante, 1e-4);
  const x = omega * dt;
  const daempfung = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  const abstand = ist - ziel;
  const temp = (geschwindigkeit.wert + omega * abstand) * dt;
  geschwindigkeit.wert = (geschwindigkeit.wert - omega * temp) * daempfung;
  return ziel + (abstand + temp) * daempfung;
}

export function smoothDampVec3(
  ist: Vec3, ziel: Vec3, geschwindigkeit: Vec3, zeitkonstante: number, dt: number,
): Vec3 {
  const vx = { wert: geschwindigkeit.x };
  const vy = { wert: geschwindigkeit.y };
  const vz = { wert: geschwindigkeit.z };
  const out = {
    x: smoothDamp(ist.x, ziel.x, vx, zeitkonstante, dt),
    y: smoothDamp(ist.y, ziel.y, vy, zeitkonstante, dt),
    z: smoothDamp(ist.z, ziel.z, vz, zeitkonstante, dt),
  };
  geschwindigkeit.x = vx.wert;
  geschwindigkeit.y = vy.wert;
  geschwindigkeit.z = vz.wert;
  return out;
}
```

- [ ] **Step 4: Controller implementieren**

`src/render/camera/controller.ts` — die drei Modi liefern jeweils nur ein Ziel:

```ts
import * as THREE from 'three';
import type { Vec3 } from '../../sim/types';
import type { AppState } from '../../store/types';
import type { ScaleSettings } from '../../sim/scale';
import { scaledPositionAt } from '../../sim/scale';
import { velocityAt } from '../../sim/orbit';
import { bodyIndex } from '../../data/index';
import { smoothDampVec3 } from './damping';
import { worldToRender } from '../units';

export interface CameraTarget { positionKm: Vec3; lookAtKm: Vec3 }

const normiere = (v: Vec3): Vec3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/** Ziel-Transform je Modus — hier steckt der ganze Modusunterschied. */
export function targetFor(state: AppState, jd: number, s: ScaleSettings): CameraTarget {
  const { mode, targetId, distance, azimuth, elevation } = state.camera;
  const anker = scaledPositionAt(targetId, bodyIndex, jd, s);

  if (mode === 'follow') {
    // Hinter dem Körper, ausgerichtet an seinem Geschwindigkeitsvektor.
    const v = normiere(velocityAt(targetId, bodyIndex, jd));
    return {
      positionKm: {
        x: anker.x - v.x * distance,
        y: anker.y - v.y * distance,
        z: anker.z - v.z * distance + distance * 0.25,
      },
      lookAtKm: anker,
    };
  }

  // 'free' und 'attached' teilen sich die Kugelkoordinaten; der Unterschied
  // liegt allein im Anker (Ursprung beziehungsweise mitgeführter Körper).
  const basis = mode === 'attached' ? anker : { x: 0, y: 0, z: 0 };
  return {
    positionKm: {
      x: basis.x + distance * Math.cos(elevation) * Math.cos(azimuth),
      y: basis.y + distance * Math.cos(elevation) * Math.sin(azimuth),
      z: basis.z + distance * Math.sin(elevation),
    },
    lookAtKm: basis,
  };
}

export function createCameraController(camera: THREE.PerspectiveCamera) {
  let istPosition: Vec3 = { x: 0, y: 0, z: 3e8 };
  let istBlick: Vec3 = { x: 0, y: 0, z: 0 };
  const vPos: Vec3 = { x: 0, y: 0, z: 0 };
  const vBlick: Vec3 = { x: 0, y: 0, z: 0 };

  return {
    /** Liefert die Kameraposition in km — Grundlage aller worldToRender-Aufrufe. */
    update(state: AppState, jd: number, dt: number, s: ScaleSettings): Vec3 {
      const ziel = targetFor(state, jd, s);
      istPosition = smoothDampVec3(istPosition, ziel.positionKm, vPos, 0.45, dt);
      istBlick = smoothDampVec3(istBlick, ziel.lookAtKm, vBlick, 0.45, dt);

      // Die Kamera bleibt im Ursprung; sie schaut auf den kamerarelativen Blickpunkt.
      const blick = worldToRender(istBlick, istPosition);
      camera.position.set(0, 0, 0);
      camera.lookAt(blick.x, blick.y, blick.z);

      // Nahe und ferne Ebene an die Zielentfernung anpassen.
      const abstand = Math.hypot(blick.x, blick.y, blick.z);
      camera.near = Math.max(abstand * 1e-5, 1e-4);
      camera.far = Math.max(abstand * 1e4, 1e9);
      camera.updateProjectionMatrix();

      return istPosition;
    },
  };
}
```

Eingaben (Maus und Touch) schreiben `azimuth`, `elevation` und `distance` in den Store;
der Controller liest sie im nächsten Frame. Mausrad verändert `distance`
**multiplikativ** (`distance *= 1.1 ** delta`), damit der Zoom über alle
Größenordnungen gleich schnell wirkt.

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/render/camera/`
Expected: PASS, alle fünf Tests

- [ ] **Step 6: Sichtprüfung**

Run: `npm run dev`

Zu prüfen: Ziehen dreht die Ansicht, Mausrad zoomt über alle Größenordnungen
gleichmäßig, ein Wechsel des Zielkörpers lässt die Kamera **weich** hinüberfliegen
statt zu springen. Im Modus „geheftet" bleibt der Planet mittig, während er seine Bahn
zieht; im Modus „Verfolgung" blickt die Kamera von hinten in Flugrichtung.

- [ ] **Step 7: Commit**

```bash
git add src/render/camera src/render/scene.ts src/app/main.tsx
git commit -m "Kamera-Controller mit drei Modi und kritisch gedämpften Übergängen"
```

---

## Task 15: Labels und Marker-Glyphen

Bei realistischem Maßstab sind die meisten Körper kleiner als ein Pixel. Ohne
Ersatzdarstellung wären sie unauffindbar und unklickbar — genau das verhindert dieser
Task.

**Files:**
- Create: `src/render/labels.ts`
- Modify: `src/render/scene.ts`, `src/index.css`
- Test: `src/render/labels.test.ts`

**Interfaces:**
- Consumes: `worldToRender`, `kmToUnits` (Task 9); `pickRadiusUnits` (Task 10)
- Produces:
  - `MARKER_MIN_PIXEL = 3`
  - `projectToScreen(renderPos: Vec3, camera, breite, hoehe): { x, y, tiefe } | null`
  - `apparentRadiusPixels(radiusUnits, abstandUnits, fovGrad, hoehe): number`
  - `needsMarker(radiusPixel: number): boolean`
  - `createLabelOverlay(container: HTMLElement): LabelOverlay`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/labels.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { apparentRadiusPixels, needsMarker, MARKER_MIN_PIXEL } from './labels';

describe('apparentRadiusPixels', () => {
  it('halbiert sich bei doppeltem Abstand', () => {
    const nah = apparentRadiusPixels(1, 100, 50, 1080);
    const fern = apparentRadiusPixels(1, 200, 50, 1080);
    expect(fern).toBeCloseTo(nah / 2, 3);
  });

  it('wächst mit der Fensterhöhe', () => {
    expect(apparentRadiusPixels(1, 100, 50, 2160))
      .toBeGreaterThan(apparentRadiusPixels(1, 100, 50, 1080));
  });

  it('macht einen entfernten Mond unsichtbar klein', () => {
    // Erdmond (1737 km) aus 5 AE Entfernung, in Render-Einheiten
    const radius = 1.737;
    const abstand = 5 * 149_597_870.7 / 1000;
    expect(apparentRadiusPixels(radius, abstand, 50, 1080)).toBeLessThan(1);
  });

  it('bleibt bei Abstand null endlich', () => {
    expect(Number.isFinite(apparentRadiusPixels(1, 0, 50, 1080))).toBe(true);
  });
});

describe('needsMarker', () => {
  it('greift unterhalb der Schwelle', () => {
    expect(needsMarker(MARKER_MIN_PIXEL - 0.1)).toBe(true);
    expect(needsMarker(0)).toBe(true);
  });

  it('greift oberhalb der Schwelle nicht', () => {
    expect(needsMarker(MARKER_MIN_PIXEL + 0.1)).toBe(false);
    expect(needsMarker(500)).toBe(false);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/labels.test.ts`
Expected: FAIL — `./labels` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/render/labels.ts`:

```ts
import * as THREE from 'three';
import type { Vec3 } from '../sim/types';

/** Unterhalb dieser projizierten Größe braucht ein Körper eine Ersatzglyphe. */
export const MARKER_MIN_PIXEL = 3;

/**
 * Scheinbarer Radius in Bildschirmpixeln.
 * Die Bildhöhe entspricht 2 * tan(fov/2) * Abstand in Weltgrößen.
 */
export function apparentRadiusPixels(
  radiusUnits: number, abstandUnits: number, fovGrad: number, hoehePixel: number,
): number {
  const sichtbareHoehe = 2 * Math.tan((fovGrad * Math.PI / 180) / 2) * Math.max(abstandUnits, 1e-9);
  return (radiusUnits / sichtbareHoehe) * hoehePixel;
}

export const needsMarker = (radiusPixel: number): boolean => radiusPixel < MARKER_MIN_PIXEL;

/** Bildschirmkoordinaten; null, wenn der Punkt hinter der Kamera liegt. */
export function projectToScreen(
  renderPos: Vec3, camera: THREE.PerspectiveCamera, breite: number, hoehe: number,
): { x: number; y: number; tiefe: number } | null {
  const v = new THREE.Vector3(renderPos.x, renderPos.y, renderPos.z).project(camera);
  if (v.z > 1) return null;
  return { x: (v.x * 0.5 + 0.5) * breite, y: (-v.y * 0.5 + 0.5) * hoehe, tiefe: v.z };
}
```

Dazu ein HTML-Overlay (`createLabelOverlay`), das je Körper ein absolut positioniertes
`<div>` hält: Punktglyphe in der Körperfarbe plus Beschriftung. Text aus `ui/i18n/de.ts`.
Bei Überlappung gewinnt der Körper mit der kleineren Bildschirmtiefe; der andere wird
per `hidden` ausgeblendet. HTML statt Textur-Text, damit die Schrift bei jedem Zoom
scharf bleibt.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/render/labels.test.ts`
Expected: PASS, alle sechs Tests

- [ ] **Step 5: Sichtprüfung**

Run: `npm run dev` — auf „Schaubild" tragen alle Körper Beschriftungen. Auf
„Realistisch" schrumpfen die Planeten zu Punkten, bleiben aber durch Glyphe und Label
auffindbar. Beim Hineinzoomen verschwinden die Glyphen, sobald die echte Kugel groß
genug ist.

- [ ] **Step 6: Commit**

```bash
git add src/render/labels.ts src/render/labels.test.ts src/render/scene.ts src/index.css
git commit -m "Labels und Marker-Glyphen für zu klein dargestellte Körper"
```

---

## Task 16: UI-Grundgerüst, Sprachressourcen und Tastenkürzel

**Files:**
- Create: `src/ui/i18n/de.ts`, `src/ui/i18n/index.ts`, `src/ui/App.tsx`, `src/ui/panels/Panel.tsx`, `src/ui/shortcuts/useShortcuts.ts`
- Modify: `src/app/main.tsx`, `vite.config.ts`
- Test: `src/ui/i18n/i18n.test.ts`, `src/ui/panels/Panel.test.tsx`

**Interfaces:**
- Consumes: `useStore` (Task 8)
- Produces:
  - `t(key: string): string`, `de: Record<string, string>`
  - `<Panel id title>` — einklappbar, Zustand im Store
  - `useShortcuts()` — H, F, Leertaste, Pfeiltasten, R, Pos1, `?`

- [ ] **Step 1: Testumgebung für React ergänzen**

```bash
npm install -D jsdom @testing-library/react @testing-library/jest-dom
```

In `vite.config.ts` bleibt `environment: 'node'`; Komponententests deklarieren oben im
File `// @vitest-environment jsdom`. Das hält die schnellen `sim/`-Tests frei von
jsdom-Aufwand.

- [ ] **Step 2: Sprachressourcen und Test schreiben**

`src/ui/i18n/de.ts` enthält **alle** sichtbaren Texte, unter anderem:

```ts
export const de = {
  'app.title': 'Sonnensystem',
  'panel.time': 'Zeit',
  'panel.scale': 'Maßstab',
  'panel.camera': 'Kamera',
  'panel.bodies': 'Himmelskörper',
  'time.pause': 'Pause',
  'time.play': 'Fortsetzen',
  'time.reverse': 'Richtung umkehren',
  'time.now': 'Jetzt',
  'time.jumpTo': 'Zu Datum springen',
  'time.rate': 'Geschwindigkeit',
  'scale.size': 'Körpergröße',
  'scale.distance': 'Bahnabstände',
  'scale.sunDamping': 'Sonne dämpfen',
  'scale.preset.realistisch': 'Realistisch',
  'scale.preset.schaubild': 'Schaubild',
  'scale.preset.kompakt': 'Kompakt',
  'camera.mode.free': 'Frei',
  'camera.mode.attached': 'Geheftet',
  'camera.mode.follow': 'Verfolgung',
  'display.orbits': 'Bahnlinien',
  'display.labels': 'Beschriftungen',
  'display.markers': 'Marker',
  'display.bloom': 'Leuchten',
  'shortcuts.title': 'Tastenkürzel',
  'shortcuts.toggleUi': 'Bedienoberfläche ein- und ausblenden',
  'shortcuts.fullscreen': 'Vollbild',
  'ui.hide': 'Oberfläche ausblenden',
  'body.sun.name': 'Sonne',
  'body.mercury.name': 'Merkur',
  'body.venus.name': 'Venus',
  'body.earth.name': 'Erde',
  'body.mars.name': 'Mars',
  'body.jupiter.name': 'Jupiter',
  'body.saturn.name': 'Saturn',
  'body.uranus.name': 'Uranus',
  'body.neptune.name': 'Neptun',
  'body.moon.name': 'Mond',
  'model.limits': 'Modellgrenzen',
  'model.limits.text':
    'Keplerbahnen ohne gegenseitige Störungen. Volle Genauigkeit 1800 bis 2050.',
  'model.outOfRange': 'Außerhalb des Gültigkeitsfensters — Positionen ungenau.',
} as const;
```

`src/ui/i18n/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { de } from './de';
import { t } from './index';
import { bodies } from '../../data/index';

describe('Sprachressourcen', () => {
  it('hat für jeden Körper einen Namensschlüssel', () => {
    for (const body of bodies) {
      expect(de, `fehlt: ${body.info.nameKey}`).toHaveProperty(body.info.nameKey);
    }
  });

  it('liefert zu bekannten Schlüsseln den Text', () => {
    expect(t('body.earth.name')).toBe('Erde');
  });

  it('meldet unbekannte Schlüssel erkennbar, statt leer zu bleiben', () => {
    expect(t('gibt.es.nicht')).toContain('gibt.es.nicht');
  });

  it('enthält keine leeren Texte', () => {
    for (const [key, wert] of Object.entries(de)) {
      expect(wert.length, `leer: ${key}`).toBeGreaterThan(0);
    }
  });
});
```

`src/ui/i18n/index.ts`:

```ts
import { de } from './de';

type Key = keyof typeof de;

/** Unbekannte Schlüssel fallen sichtbar auf, statt still zu verschwinden. */
export function t(key: string): string {
  return (de as Record<string, string>)[key] ?? `[${key}]`;
}

export type { Key };
export { de };
```

- [ ] **Step 3: Panel-Komponente und Test schreiben**

`src/ui/panels/Panel.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Panel } from './Panel';
import { useStore, DEFAULT_STATE } from '../../store';

describe('Panel', () => {
  it('zeigt Titel und Inhalt', () => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    render(<Panel id="time" title="Zeit"><p>Inhalt</p></Panel>);
    expect(screen.getByText('Zeit')).toBeTruthy();
    expect(screen.getByText('Inhalt')).toBeTruthy();
  });

  it('klappt auf Klick ein und speichert das im Store', () => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    render(<Panel id="time" title="Zeit"><p>Inhalt</p></Panel>);
    fireEvent.click(screen.getByRole('button', { name: /Zeit/ }));
    expect(useStore.getState().ui.panels.time).toBe(false);
    expect(screen.queryByText('Inhalt')).toBeNull();
  });
});
```

`src/ui/panels/Panel.tsx` rendert eine Kopfzeile als `<button>` (Tastaturbedienung und
Screenreader gratis) und den Inhalt nur bei `ui.panels[id] !== false`. Gestaltung über
Tailwind: `bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-lg`.

- [ ] **Step 4: Tastenkürzel implementieren**

`src/ui/shortcuts/useShortcuts.ts` registriert einen `keydown`-Listener auf `window`
und ignoriert Ereignisse aus `<input>`/`<textarea>`, damit das Datumsfeld nicht die
Simulation steuert:

| Taste | Wirkung |
|---|---|
| `h` | `ui.hidden` umschalten |
| `f` | `document.documentElement.requestFullscreen()` bzw. `exitFullscreen()` |
| `Leertaste` | `time.paused` umschalten |
| `ArrowLeft` / `ArrowRight` | `rateDaysPerSec` mit 1/1.5 bzw. 1.5 multiplizieren |
| `r` | Vorzeichen von `rateDaysPerSec` umkehren |
| `Home` | Kamera auf Standardwerte zurücksetzen |
| `?` | Kürzel-Übersicht ein-/ausblenden |

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS, alle sechs Tests

- [ ] **Step 6: Sichtprüfung**

Run: `npm run dev` — `H` blendet das UI vollständig aus und wieder ein, `F` schaltet
echtes Vollbild, `?` zeigt die Kürzel-Übersicht, Panels klappen ein und aus und merken
sich ihren Zustand über einen Neuladevorgang hinweg nicht (Persistenz folgt in Phase 4).

- [ ] **Step 7: Commit**

```bash
git add src/ui src/app/main.tsx vite.config.ts package.json
git commit -m "UI-Grundgerüst mit Sprachressourcen, Panels und Tastenkuerzeln"
```

---

## Task 17: Transportleiste für die Zeit

**Files:**
- Create: `src/ui/panels/TimePanel.tsx`, `src/ui/format.ts`
- Modify: `src/ui/App.tsx`
- Test: `src/ui/format.test.ts`, `src/ui/panels/TimePanel.test.tsx`

**Interfaces:**
- Consumes: `dateToJd`, `jdToDate` (Task 1); `useStore` (Task 8); `t` (Task 16)
- Produces:
  - `formatJd(jd: number): string` — „11.09.2026 14:32"
  - `formatRate(tageProSekunde: number): string` — „1 Tag/s", „2,5 Jahre/s", „Rückwärts"
  - `isOutOfRange(jd: number): boolean`
  - `<TimePanel />`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/ui/format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatJd, formatRate, isOutOfRange } from './format';
import { dateToJd } from '../sim/time';

describe('formatJd', () => {
  it('gibt deutsches Datumsformat aus', () => {
    const jd = dateToJd(new Date(Date.UTC(2026, 8, 11, 14, 32)));
    expect(formatJd(jd)).toMatch(/^11\.09\.2026/);
  });
});

describe('formatRate', () => {
  it('nennt Sekunden, Tage und Jahre je nach Größenordnung', () => {
    expect(formatRate(1 / 86400)).toContain('Sekunde');
    expect(formatRate(1)).toContain('Tag');
    expect(formatRate(365.25)).toContain('Jahr');
  });

  it('kennzeichnet Rueckwaertslauf', () => {
    expect(formatRate(-30)).toContain('−');
  });

  it('erkennt Stillstand', () => {
    expect(formatRate(0)).toContain('Pause');
  });

  it('verwendet das deutsche Dezimalkomma', () => {
    expect(formatRate(2.5 * 365.25)).toContain(',');
  });
});

describe('isOutOfRange', () => {
  it('akzeptiert das Fenster 1800 bis 2050', () => {
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(1900, 0, 1))))).toBe(false);
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(2026, 0, 1))))).toBe(false);
  });

  it('warnt außerhalb', () => {
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(1700, 0, 1))))).toBe(true);
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(2200, 0, 1))))).toBe(true);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/format.test.ts`
Expected: FAIL — `./format` nicht auflösbar

- [ ] **Step 3: Formatierung implementieren**

`src/ui/format.ts`:

```ts
import { jdToDate, dateToJd } from '../sim/time';

const FORMAT = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
});

export const formatJd = (jd: number): string => FORMAT.format(jdToDate(jd));

export function formatRate(tageProSekunde: number): string {
  if (tageProSekunde === 0) return 'Pause';
  const vorzeichen = tageProSekunde < 0 ? '−' : '';
  const betrag = Math.abs(tageProSekunde);
  const zahl = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });

  if (betrag < 1 / 3600) return `${vorzeichen}${zahl(betrag * 86400)} Sekunden/s`;
  if (betrag < 1) return `${vorzeichen}${zahl(betrag * 24)} Stunden/s`;
  if (betrag < 365.25) return `${vorzeichen}${zahl(betrag)} Tage/s`;
  return `${vorzeichen}${zahl(betrag / 365.25)} Jahre/s`;
}

const JD_1800 = dateToJd(new Date(Date.UTC(1800, 0, 1)));
const JD_2050 = dateToJd(new Date(Date.UTC(2050, 0, 1)));

/** Außerhalb dieses Fensters sind die Bahnelemente nicht mehr belastbar. */
export const isOutOfRange = (jd: number): boolean => jd < JD_1800 || jd > JD_2050;
```

- [ ] **Step 4: Komponententest schreiben**

`src/ui/panels/TimePanel.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimePanel } from './TimePanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { dateToJd } from '../../sim/time';

beforeEach(() => useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)));

describe('TimePanel', () => {
  it('schaltet die Pause um', () => {
    render(<TimePanel />);
    fireEvent.click(screen.getByRole('button', { name: /Pause/ }));
    expect(useStore.getState().time.paused).toBe(true);
  });

  it('kehrt die Zeitrichtung um', () => {
    render(<TimePanel />);
    const vorher = useStore.getState().time.rateDaysPerSec;
    fireEvent.click(screen.getByRole('button', { name: /umkehren/ }));
    expect(useStore.getState().time.rateDaysPerSec).toBe(-vorher);
  });

  it('springt auf die aktuelle Zeit', () => {
    useStore.getState().setTime({ jd: 2400000 });
    render(<TimePanel />);
    fireEvent.click(screen.getByRole('button', { name: /Jetzt/ }));
    expect(Math.abs(useStore.getState().time.jd - dateToJd(new Date()))).toBeLessThan(0.01);
  });

  it('übernimmt ein eingegebenes Datum', () => {
    render(<TimePanel />);
    const feld = screen.getByLabelText(/Datum/) as HTMLInputElement;
    fireEvent.change(feld, { target: { value: '2030-05-17' } });
    const erwartet = dateToJd(new Date(Date.UTC(2030, 4, 17)));
    expect(Math.abs(useStore.getState().time.jd - erwartet)).toBeLessThan(0.5);
  });

  it('warnt außerhalb des Gueltigkeitsfensters', () => {
    useStore.getState().setTime({ jd: dateToJd(new Date(Date.UTC(2200, 0, 1))) });
    render(<TimePanel />);
    expect(screen.getByText(/ungenau/)).toBeTruthy();
  });
});
```

- [ ] **Step 5: `TimePanel` implementieren**

Enthält: Pause-Schalter, Geschwindigkeitsregler (logarithmisch, von 1 Sekunde/s bis
1000 Jahre/s), Richtungsumkehr, `<input type="date">` mit Beschriftung „Datum", Knopf
„Jetzt", Anzeige von `formatJd` und `formatRate`, und bei `isOutOfRange` einen
Warnhinweis aus `model.outOfRange`.

- [ ] **Step 6: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS

- [ ] **Step 7: Sichtprüfung**

Run: `npm run dev` — Zeitraffer über mehrere Größenordnungen bleibt flüssig, Rückwärtslauf
dreht die Planeten sichtbar zurück, ein Datumssprung auf 2040 versetzt alle Körper sofort,
ohne dass etwas nachrechnen müsste.

- [ ] **Step 8: Commit**

```bash
git add src/ui/format.ts src/ui/format.test.ts src/ui/panels/TimePanel.tsx src/ui/panels/TimePanel.test.tsx src/ui/App.tsx
git commit -m "Transportleiste für Zeitsteuerung mit Datumssprung"
```

---

## Task 18: Maßstabs-Panel mit Presets und animiertem Übergang

**Files:**
- Create: `src/ui/panels/ScalePanel.tsx`, `src/ui/tween.ts`
- Modify: `src/ui/App.tsx`
- Test: `src/ui/tween.test.ts`, `src/ui/panels/ScalePanel.test.tsx`

**Interfaces:**
- Consumes: `SCALE_PRESETS` (Task 7); `useStore` (Task 8)
- Produces:
  - `easeInOutCubic(t: number): number`
  - `tweenScale(von: ScaleSettings, nach: ScaleSettings, dauerMs: number, setzen: (s: ScaleSettings) => void): () => void`
  - `<ScalePanel />`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/ui/tween.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { easeInOutCubic, lerpScale } from './tween';
import { SCALE_PRESETS } from '../sim/scale';

describe('easeInOutCubic', () => {
  it('beginnt bei 0 und endet bei 1', () => {
    expect(easeInOutCubic(0)).toBeCloseTo(0, 9);
    expect(easeInOutCubic(1)).toBeCloseTo(1, 9);
  });

  it('ist in der Mitte bei 0.5 und symmetrisch', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 9);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1, 9);
  });

  it('steigt monoton', () => {
    let vorher = -1;
    for (let t = 0; t <= 1; t += 0.01) {
      const w = easeInOutCubic(t);
      expect(w).toBeGreaterThanOrEqual(vorher);
      vorher = w;
    }
  });
});

describe('lerpScale', () => {
  it('liefert an den Enden exakt die Ausgangswerte', () => {
    const a = SCALE_PRESETS.realistisch, b = SCALE_PRESETS.kompakt;
    expect(lerpScale(a, b, 0)).toEqual(a);
    expect(lerpScale(a, b, 1)).toEqual(b);
  });

  it('interpoliert sizeScale logarithmisch', () => {
    // Linear wäre die Mitte zwischen 1 und 200 bei 100.5 — optisch ein Sprung.
    // Geometrisch liegt sie bei rund 14, was gleichmaessig wirkt.
    const mitte = lerpScale(
      { sizeScale: 1, distanceExponent: 1, sunDamping: 1 },
      { sizeScale: 200, distanceExponent: 1, sunDamping: 1 },
      0.5,
    );
    expect(mitte.sizeScale).toBeCloseTo(Math.sqrt(200), 3);
  });

  it('interpoliert den Exponenten linear', () => {
    const mitte = lerpScale(
      { sizeScale: 1, distanceExponent: 1.0, sunDamping: 1 },
      { sizeScale: 1, distanceExponent: 0.4, sunDamping: 1 },
      0.5,
    );
    expect(mitte.distanceExponent).toBeCloseTo(0.7, 9);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/tween.test.ts`
Expected: FAIL — `./tween` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/ui/tween.ts`:

```ts
import type { ScaleSettings } from '../sim/scale';

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * sizeScale und sunDamping werden geometrisch interpoliert, der Exponent
 * linear. Grund: Größenfaktoren wirken multiplikativ — linear interpoliert
 * bliebe die Animation lange am großen Ende kleben und ruckte am Schluss.
 */
export function lerpScale(von: ScaleSettings, nach: ScaleSettings, t: number): ScaleSettings {
  if (t <= 0) return { ...von };
  if (t >= 1) return { ...nach };
  const geo = (a: number, b: number) => a * Math.pow(b / a, t);
  return {
    sizeScale: geo(von.sizeScale, nach.sizeScale),
    sunDamping: geo(von.sunDamping, nach.sunDamping),
    distanceExponent: von.distanceExponent + (nach.distanceExponent - von.distanceExponent) * t,
  };
}

/** Animiert einen Preset-Wechsel; liefert eine Abbruchfunktion. */
export function tweenScale(
  von: ScaleSettings, nach: ScaleSettings, dauerMs: number,
  setzen: (s: ScaleSettings) => void,
): () => void {
  const start = performance.now();
  let id = 0;
  const tick = (jetzt: number) => {
    const t = Math.min((jetzt - start) / dauerMs, 1);
    setzen(lerpScale(von, nach, easeInOutCubic(t)));
    if (t < 1) id = requestAnimationFrame(tick);
  };
  id = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(id);
}
```

- [ ] **Step 4: Komponententest schreiben**

`src/ui/panels/ScalePanel.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScalePanel } from './ScalePanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCALE_PRESETS } from '../../sim/scale';

beforeEach(() => useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)));

describe('ScalePanel', () => {
  it('bietet alle drei Presets an', () => {
    render(<ScalePanel />);
    for (const name of ['Realistisch', 'Schaubild', 'Kompakt']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('merkt sich das gewählte Preset', () => {
    render(<ScalePanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Kompakt' }));
    expect(useStore.getState().scale.preset).toBe('kompakt');
  });

  it('setzt bei realistischem Preset den Exponenten auf 1', async () => {
    render(<ScalePanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Realistisch' }));
    await new Promise((r) => setTimeout(r, 1000)); // Animation abwarten
    expect(useStore.getState().scale.distanceExponent)
      .toBeCloseTo(SCALE_PRESETS.realistisch.distanceExponent, 2);
  });

  it('löst das Preset, sobald ein Regler von Hand bewegt wird', () => {
    render(<ScalePanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Kompakt' }));
    fireEvent.change(screen.getByLabelText(/Körpergröße/), { target: { value: '2' } });
    expect(useStore.getState().scale.preset).toBeNull();
  });
});
```

- [ ] **Step 5: `ScalePanel` implementieren**

Zwei logarithmische Schieberegler („Körpergröße" von 1 bis 1000, „Bahnabstände" als
Exponent von 0.35 bis 1.0, als „realistisch ↔ kompakt" beschriftet), ein Regler
„Sonne dämpfen", drei Preset-Knöpfe und die Anzeige der aktuellen Werte. Jede
Handbewegung setzt `preset` auf `null` — sonst würde die Beschriftung lügen.

- [ ] **Step 6: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS

- [ ] **Step 7: Sichtprüfung**

Run: `npm run dev` — der Wechsel „Schaubild" → „Realistisch" fährt die Szene weich
auseinander statt zu springen. Bei „Realistisch" bleibt die Erde ortsfest, während die
äußeren Planeten nach außen wandern (Fixpunkt bei 1 AE). Der Mond steht bei **jedem**
Preset sichtbar außerhalb der Erde.

- [ ] **Step 8: Commit**

```bash
git add src/ui/tween.ts src/ui/tween.test.ts src/ui/panels/ScalePanel.tsx src/ui/panels/ScalePanel.test.tsx src/ui/App.tsx
git commit -m "Maßstabs-Panel mit Presets und animiertem Übergang"
```

---

## Task 19: Objektbaum, Auswahl und Kamera-Panel

**Files:**
- Create: `src/ui/panels/BodyTree.tsx`, `src/ui/panels/CameraPanel.tsx`, `src/ui/panels/DisplayPanel.tsx`
- Modify: `src/ui/App.tsx` (die drei Panels einhängen)
- Test: `src/ui/panels/BodyTree.test.tsx`, `src/ui/panels/CameraPanel.test.tsx`

**Interfaces:**
- Consumes: `bodies`, `bodyIndex` (Task 3); `useStore` (Task 8); `t` (Task 16)
- Produces:
  - `buildTree(bodies: Body[]): TreeNode[]` mit `TreeNode = { body: Body; children: TreeNode[] }`
  - `<BodyTree />`, `<CameraPanel />`, `<DisplayPanel />`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/ui/panels/BodyTree.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BodyTree, buildTree } from './BodyTree';
import { bodies } from '../../data/index';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)));

describe('buildTree', () => {
  it('setzt die Sonne an die Wurzel', () => {
    const baum = buildTree(bodies);
    expect(baum).toHaveLength(1);
    expect(baum[0]!.body.id).toBe('sun');
  });

  it('hängt die acht Planeten unter die Sonne', () => {
    expect(buildTree(bodies)[0]!.children).toHaveLength(8);
  });

  it('hängt den Mond unter die Erde', () => {
    const erde = buildTree(bodies)[0]!.children.find((k) => k.body.id === 'earth')!;
    expect(erde.children.map((k) => k.body.id)).toEqual(['moon']);
  });
});

describe('BodyTree', () => {
  it('zeigt die deutschen Namen', () => {
    render(<BodyTree />);
    expect(screen.getByText('Merkur')).toBeTruthy();
    expect(screen.getByText('Neptun')).toBeTruthy();
  });

  it('setzt bei Klick das Kameraziel', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByText('Saturn'));
    expect(useStore.getState().camera.targetId).toBe('saturn');
  });

  it('blendet einen Körper über das Kaestchen aus', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByLabelText(/Neptun anzeigen/));
    expect(useStore.getState().visible.neptune).toBe(false);
  });
});
```

`src/ui/panels/CameraPanel.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CameraPanel } from './CameraPanel';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)));

describe('CameraPanel', () => {
  it('bietet die drei Modi an', () => {
    render(<CameraPanel />);
    for (const name of ['Frei', 'Geheftet', 'Verfolgung']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('wechselt den Modus', () => {
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Verfolgung' }));
    expect(useStore.getState().camera.mode).toBe('follow');
  });

  it('setzt die Draufsicht auf die Ekliptik', () => {
    useStore.getState().setCamera({ elevation: 0 });
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Draufsicht/ }));
    expect(useStore.getState().camera.elevation).toBeCloseTo(Math.PI / 2, 3);
  });
});
```

- [ ] **Step 2: Tests laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/panels/`
Expected: FAIL — `./BodyTree` und `./CameraPanel` nicht auflösbar

- [ ] **Step 3: `buildTree` und die drei Panels implementieren**

```ts
export interface TreeNode { body: Body; children: TreeNode[] }

export function buildTree(liste: Body[]): TreeNode[] {
  const knoten = new Map<string, TreeNode>(
    liste.map((body) => [body.id, { body, children: [] }]),
  );
  const wurzeln: TreeNode[] = [];
  for (const body of liste) {
    const k = knoten.get(body.id)!;
    if (body.parent === null) wurzeln.push(k);
    else knoten.get(body.parent)?.children.push(k);
  }
  return wurzeln;
}
```

`BodyTree` rendert den Baum eingerückt; jede Zeile trägt den Namen als Knopf (setzt
`camera.targetId`) und ein Kästchen mit der zugänglichen Beschriftung
„&lt;Name&gt; anzeigen". `CameraPanel` bietet die drei Modi, einen Abstandsregler und
vier vordefinierte Blickwinkel (Draufsicht, Seitenansicht, von der Sonne, zur Sonne).
`DisplayPanel` schaltet Bahnlinien, Beschriftungen, Marker und Leuchten.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS, alle neun Tests

- [ ] **Step 5: Sichtprüfung**

Run: `npm run dev` — ein Klick auf „Saturn" lässt die Kamera weich hinüberfliegen,
„Geheftet" hält ihn mittig, das Ausblenden von Neptun entfernt Kugel, Bahnlinie und
Label gemeinsam.

- [ ] **Step 6: Commit**

```bash
git add src/ui/panels src/ui/App.tsx
git commit -m "Objektbaum, Kamera- und Darstellungspanel"
```

---

## Task 20: Abnahme gegen die Akzeptanzkriterien

Kein neues Feature — dieser Task weist nach, dass Phase 1 die im Spec genannten
Kriterien erfüllt, und behebt, was dabei auffällt.

**Files:**
- Create: `src/app/quality.ts`, `docs/phase1-abnahme.md`
- Test: `src/app/quality.test.ts`

**Interfaces:**
- Produces:
  - `QUALITY_SETTINGS: Record<Exclude<QualityTier,'auto'>, { textureSize, bloom, pixelRatioCap }>`
  - `detectTier(frameZeitenMs: number[]): QualityTier` — stuft **nur herunter**

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/app/quality.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { detectTier, QUALITY_SETTINGS } from './quality';

describe('detectTier', () => {
  it('bleibt bei guter Framezeit auf hoher Stufe', () => {
    expect(detectTier(Array(180).fill(14))).toBe('high');
  });

  it('stuft bei langsamen Frames herunter', () => {
    expect(detectTier(Array(180).fill(28))).toBe('medium');
    expect(detectTier(Array(180).fill(60))).toBe('low');
  });

  it('urteilt nicht auf zu wenigen Messwerten', () => {
    // Weniger als drei Sekunden Messung: noch keine Entscheidung.
    expect(detectTier([40, 42])).toBe('auto');
  });

  it('ignoriert einzelne Ausreißer', () => {
    const werte = Array(180).fill(14);
    werte[10] = 500; // Nachladen einer Textur
    expect(detectTier(werte)).toBe('high');
  });
});

describe('QUALITY_SETTINGS', () => {
  it('steigert die Texturgröße mit der Stufe', () => {
    expect(QUALITY_SETTINGS.low.textureSize).toBeLessThan(QUALITY_SETTINGS.medium.textureSize);
    expect(QUALITY_SETTINGS.medium.textureSize).toBeLessThan(QUALITY_SETTINGS.high.textureSize);
  });

  it('schaltet Bloom nur auf niedriger Stufe ab', () => {
    expect(QUALITY_SETTINGS.low.bloom).toBe(false);
    expect(QUALITY_SETTINGS.medium.bloom).toBe(true);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/app/quality.test.ts`
Expected: FAIL — `./quality` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/app/quality.ts`:

```ts
import type { QualityTier } from '../store/types';

export const QUALITY_SETTINGS = {
  low:    { textureSize: 1024, bloom: false, pixelRatioCap: 1.0 },
  medium: { textureSize: 2048, bloom: true,  pixelRatioCap: 1.5 },
  high:   { textureSize: 8192, bloom: true,  pixelRatioCap: 2.0 },
} as const;

/**
 * Stuft anhand der mittleren Framezeit ein — und zwar nur nach unten.
 * Automatisches Hochstufen liesse die Einstellung zwischen zwei Stufen
 * pendeln, was sichtbar unruhig wirkt.
 */
export function detectTier(frameZeitenMs: number[]): QualityTier {
  if (frameZeitenMs.length < 60) return 'auto'; // noch keine belastbare Messung

  // Median statt Mittelwert: einzelne Ladespitzen sollen nicht entscheiden.
  const sortiert = [...frameZeitenMs].sort((a, b) => a - b);
  const median = sortiert[Math.floor(sortiert.length / 2)]!;

  if (median > 40) return 'low';
  if (median > 20) return 'medium';
  return 'high';
}
```

Die Messung sammelt in `loop.ts` die Framezeiten der ersten drei Sekunden und ruft
danach einmalig `detectTier` auf.

- [ ] **Step 4: Vollständigen Testlauf und Build ausführen**

Run: `npm run lint && npm test && npm run build`
Expected: alles grün. Die Ausgabe der Horizons-Tabelle aus Task 5 protokollieren.

- [ ] **Step 5: Akzeptanzkriterien durchgehen und protokollieren**

`docs/phase1-abnahme.md` anlegen und jede Zeile mit Ergebnis und Datum füllen:

| Kriterium aus dem Spec | Nachweis |
|---|---|
| Positionen aller 8 Planeten bestehen den Horizons-Test | `npm test`, Tabelle der Abweichungen einfügen |
| Zeitsteuerung: Pause, Tempo, Rückwärts, Sprung zu Datum, „Jetzt" | manuell, je Funktion einmal |
| Beide Maßstabsregler und drei Presets mit animiertem Übergang | manuell, Übergang muss weich sein |
| Bahnlinien, Labels, Marker-Glyphen, Sternenhintergrund, Bloom | manuell, je einmal an- und ausschalten |
| Kameramodi frei, geheftet, verfolgend mit weichen Übergängen | manuell, Zielwechsel darf nicht springen |
| UI-Gerüst mit einklappbaren Panels; `H` und `F` | manuell |
| Stabile 60 fps auf dem Referenz-Laptop | Messung siehe Step 6 |

- [ ] **Step 6: Bildrate messen**

Im Browser-Profiler (F12 → Performance) 30 Sekunden aufzeichnen, dabei einmal quer
durchs System fliegen und die Presets durchschalten. Festhalten: mittlere Framezeit,
95. Perzentil, Gerät und Auflösung. Zielwert: Median unter 16,7 ms.

Bleibt die Bildrate zurück, in dieser Reihenfolge prüfen — nach absteigender
Erfahrungswahrscheinlichkeit: Texturauflösung, Bloom-Auflösung, Anzahl der
Bahnlinien-Stützpunkte, `devicePixelRatio`.

- [ ] **Step 7: Commit**

```bash
git add src/app/quality.ts src/app/quality.test.ts docs/phase1-abnahme.md
git commit -m "Qualitätsstufen und Abnahmeprotokoll für Phase 1"
```

---

## Abgrenzung: Was Phase 1 bewusst nicht enthält

Damit beim Umsetzen keine Grenzüberschreitung aus Versehen passiert — diese Punkte
gehören zu späteren Phasen und werden hier **nicht** gebaut:

- Kino-Modus, Szenen, Director, Wake Lock (Phase 2)
- Monde außer dem Erdmond, Zwergplaneten, Ringe, Gürtel, Schattenwurf (Phase 3)
- Presets speichern und laden, URL-Sharing in der UI, Englisch, Infopanel mit
  Live-Werten (Phase 4) — die Serialisierung aus Task 8 wird gebaut und getestet,
  aber noch nicht an die Adresszeile angeschlossen
- Ambient-Sound, Texturkompression, Veröffentlichung (Phase 5)
- Atmosphärenschimmer: im Spec unter Rendering beschrieben, aber kein
  Akzeptanzkriterium für Phase 1 — kommt mit dem Katalog-Ausbau in Phase 3

---

## Selbstprüfung des Plans

**Abdeckung der Phase-1-Kriterien:** Positionen gegen Horizons → Task 5. Zeitsteuerung
→ Task 17. Maßstabsregler und Presets → Tasks 7 und 18. Bahnlinien → Task 11. Labels
und Marker → Task 15. Sternenhintergrund → Task 12. Bloom → Task 13. Kameramodi mit
weichen Übergängen → Task 14. UI-Gerüst mit `H` und `F` → Task 16. 60 fps → Task 20.
Alle zehn Kriterien haben einen Task.

**Zwei Präzisierungen gegenüber dem Spec**, beide bewusst und an Ort und Stelle
begründet:

1. `positionAt` nimmt `(id, index, jd)` statt `(body, jd)` entgegen — Monde brauchen die
   Position ihres Mutterkörpers (Task 4).
2. Die Maßstabsskalierung ist hierarchisch: Mondabstände skalieren mit `sizeScale`
   statt mit der Abstandskompression. Ohne diese Regel zöge `k = 0.4` den Mond auf 40 %
   heran, während die Erde um `sizeScale` wächst — der Mond läge im Planeten (Task 7).
   Der Spec beschreibt die Kompression nur für Bahnabstände; diese Regel ergänzt ihn,
   ohne ihm zu widersprechen.

**Datenherkunft:** Die Bahnelemente (Task 3) und die Horizons-Referenzwerte (Task 5)
werden **nicht** im Plan vorgegeben, sondern nach dokumentiertem Verfahren aus der
Primärquelle übertragen. Gegen Übertragungsfehler sichern zwei unabhängige Netze:
die Halbachsen- und Exzentrizitätstests in Task 3 und die Invariantentests in Task 4
(Perihel/Aphel, Umlaufzeit, drittes Keplersches Gesetz) — beide arbeiten mit
Lehrbuchwerten und schlagen bei einem Zahlendreher sofort an.

---

## Nächster Schritt

Nach Abnahme von Phase 1: Implementierungsplan für Phase 2 (Kino-Modus) über die
`writing-plans`-Fähigkeit.
