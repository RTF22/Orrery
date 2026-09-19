# Flug Etappe 1: Flug mit Tastatur und Maus

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mit WASD/QE frei durch das Sonnensystem fliegen, mit Shift+WASD um den Körper nächst der Bildmitte drehen, im Flug mit der Maus umschauen und mit dem Rad die Geschwindigkeit ändern.

**Architecture:** Neuer Kameramodus `fly` mit dem Feld `camera.fly` (Bezugskörper, Lage relativ zu ihm, Blickrichtung). Die Flugmathematik liegt rein in `render/camera/flug.ts`, der Controller bekommt einen eigenen Flugzweig und die Funktion `letztePose()`. Die Tastatur (`ui/steuerung/tastatur.ts`) merkt sich gehaltene Tasten, `steuerungTakt` (`ui/steuerung/anwenden.ts`) setzt sie je Bild vor dem Kino-Takt in den Store um.

**Tech Stack:** TypeScript, three.js, Zustand, React, Vitest (Umgebung `node`, DOM-Tests mit `// @vitest-environment jsdom`), React Testing Library, Playwright-MCP für die Abnahme, Python 3.12 mit Pillow/numpy für Pixelmessungen.

**Spec:** `docs/superpowers/specs/2026-09-19-flug-und-controller-design.md` (Abschnitte 3, 4 und 6 bis 9; Etappe 1 nach §10). Umsetzer lesen den Entwurf mit.

## Global Constraints

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll), Umlaute korrekt; Englisch nur in `src/ui/i18n/en.ts`.
- Commits allein Jens Fricke, **ohne jede Trailer-Zeile** (keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen). Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei; Protokolle nennen Wort- und Trailerprüfung nur als Verweis, nie mit Suchmuster.
- Branch `flug-1` von `master` (nach dem Commit dieses Plans), **kein Worktree**, kein `git stash`/`reset`/`checkout --`. Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus; erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Immer nur ein Umsetzer gleichzeitig (gemeinsamer Browser); Reviewer dürfen parallel laufen.
- Schichten: `render/` importiert nichts aus `ui/` (`render/schichten.test.ts`), `store/` nichts aus `ui/`, `app/`, `render/` (`store/schichten.test.ts`). `ui/` darf `render/` nutzen.
- Keine neue Abhängigkeit in `package.json`.
- NTFS: Ein reines Modul heißt nie wie eine Komponente im selben Ordner (`anwenden.ts` neben `TempoHinweis.tsx` ist in Ordnung).
- Zahlen aus dem Entwurf §12.1: Tempofaktor Start 0,5, Bereich 0,02 bis 20, Radstufe ×1,25; Tempo-Untergrenze 0,05·R; Mindesthöhe 1,05·R; Rückstellbereich 20 % (Faktor 0,8); Dämpfung im Flug 0,15 s; Shift-Drehen 60°/s (A/D), 45°/s (Q/E), Faktor 2 je s (W/S); Mausblick π/600 je Pixel; Tempo-Hinweis 1,5 s.
- Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen). Testzahl vorher 3692; die Soll-Zahl nach jedem Task steht im Task.
- Playwright schreibt nur nach `.playwright-mcp/`; direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`. Screenshots und Skripte vor dem Commit löschen, nur gezielt `git add`en.

## Dateiübersicht

| Datei | Task | Verantwortung |
|---|---|---|
| `src/store/types.ts`, `src/store/index.ts` | 1 | Modus `fly`, Feld `camera.fly`, Standard = Startansicht |
| `src/store/pruefer.ts` | 1 | `fly` in der Aufzählung, `camera.fly.refId` als Katalogkennung, Bereiche |
| `src/render/camera/flug.ts` (neu) | 2, 3 | reine Flugmathematik, Grenzkonstanten der Kamera |
| `src/render/camera/input.ts` | 2, 8 | Grenzkonstanten aus `flug.ts`; Mausblick und Rad im Flug |
| `src/render/camera/controller.ts` | 4 | Flugzweig, Ein- und Ausstieg ohne Sprung, `letztePose()` |
| `src/render/exposure.ts` | 4 | im Flug Belichtung auf den Bezugskörper |
| `src/ui/steuerung/tastatur.ts` (neu) | 5 | gehaltene Flugtasten nach `e.code`, Absicht |
| `src/ui/shortcuts/useShortcuts.ts` | 5 | `istEingabefeld` exportieren |
| `src/ui/steuerung/anwenden.ts` (neu) | 6, 7 | `steuerungTakt`, `flugStarten`, `heftenUm`, Tempofaktor |
| `src/app/main.tsx` | 6, 8 | Verdrahtung Tastatur, Takt, Rad, Tempo-Hinweis |
| `src/ui/steuerung/TempoHinweis.tsx` (neu) | 8 | Einblendung „Tempo ×…" |
| `src/ui/kamerafahrt.ts` | 9 | Fahrt aus dem Flug ab der gezeigten Lage |
| `src/ui/panels/CameraPanel.tsx`, `src/ui/App.tsx`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` | 8, 9 | Schaltfläche „Flug", Regler im Flug, Kürzelübersicht, Texte |
| `docs/flug-etappe1-abnahme.md` (neu) | 10 | Abnahmeprotokoll |

---

### Task 1: Modus `fly` und Feld `camera.fly` in Store und Prüfer

**Files:**
- Modify: `src/store/types.ts:3` (CameraMode), `src/store/types.ts:39-50` (camera)
- Modify: `src/store/index.ts:27-30` (DEFAULT_STATE.camera)
- Modify: `src/store/pruefer.ts` (AUFZAEHLUNGEN, Kennungsprüfung, BEREICHE samt Kommentar)
- Create: `src/store/flug.test.ts`
- Modify: `src/store/pruefer.test.ts`
- Modify: `src/render/camera/controller.test.ts:33`, `:48`, `:86-89` (vollständige Kamera-Literale)

**Interfaces:**
- Produces: `CameraMode` enthält `'fly'`; `AppState['camera']['fly']: { refId: string; x: number; y: number; z: number; yaw: number; pitch: number }`; `DEFAULT_STATE.camera.fly` = Startansicht. Alle späteren Tasks nutzen diese Namen.

- [ ] **Step 1: Failing tests schreiben**

`src/store/flug.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from './index';

describe('Standard-Fluglage', () => {
  it('entspricht der Startansicht: Lage auf dem Kugelpunkt, Blick zur Sonne', () => {
    const { camera } = DEFAULT_STATE;
    const { fly } = camera;
    expect(fly.refId).toBe('sun');
    expect(Math.hypot(fly.x, fly.y, fly.z)).toBeCloseTo(camera.distance, 0);
    const blick = [
      Math.cos(fly.pitch) * Math.cos(fly.yaw),
      Math.cos(fly.pitch) * Math.sin(fly.yaw),
      Math.sin(fly.pitch),
    ];
    const zurSonne = [-fly.x, -fly.y, -fly.z].map((v) => v / camera.distance);
    blick.forEach((b, i) => { expect(b).toBeCloseTo(zurSonne[i]!, 12); });
  });
});
```

In `src/store/pruefer.test.ts` die Importe um `import { fromShareable } from './serialize';` und `import { DEFAULT_STATE } from './index';` ergänzen (falls noch nicht vorhanden) und anhängen:

```ts
describe('pruefeZustand: Flug', () => {
  it('kennt den Modus fly und die Felder der Fluglage', () => {
    const fly = { refId: 'saturn', x: 1e6, y: -2e6, z: 3e5, yaw: 12, pitch: -1.2 };
    expect(pruefeZustand({ camera: { mode: 'fly', fly } })).toEqual({ camera: { mode: 'fly', fly } });
  });

  it('verwirft unbekannte Bezugskörper und Werte außerhalb der Bereiche feldweise', () => {
    expect(pruefeZustand({
      camera: { fly: { refId: 'vulcan', x: 2e13, y: 5, z: -1e13, pitch: 2, yaw: Infinity } },
    })).toEqual({ camera: { fly: { y: 5, z: -1e13 } } });
  });

  it('lässt einen alten Zustand ohne fly beim Standard', () => {
    const z = fromShareable(pruefeZustand({ camera: { mode: 'attached', targetId: 'mars' } }));
    expect(z.camera.fly).toEqual(DEFAULT_STATE.camera.fly);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/store/flug.test.ts src/store/pruefer.test.ts`
Expected: FAIL (`fly` ist undefiniert, `mode: 'fly'` wird verworfen).

- [ ] **Step 3: Typen und Standard**

`src/store/types.ts`:

```ts
export type CameraMode = 'free' | 'attached' | 'follow' | 'cinema' | 'fly';
```

und im Block `camera` nach `freezeJd: number | null;`:

```ts
    /**
     * Nur für den Modus Flug (Entwurf Flug und Controller §3.2): Bezugskörper,
     * Lage der Kamera relativ zu ihm in dargestellten km und Blickrichtung,
     * gezählt wie azimuth/elevation. targetId bleibt davon unberührt; es
     * bestimmt weiter Infopanel und Objektbaum.
     */
    fly: { refId: string; x: number; y: number; z: number; yaw: number; pitch: number };
```

`src/store/index.ts`, Block `camera` in `DEFAULT_STATE`:

```ts
  camera: {
    mode: 'free', targetId: 'sun', distance: 8e8,
    azimuth: 0.6, elevation: 0.5, freezeJd: null,
    // Ein Flug beginnt immer an der gezeigten Lage. Der Standard entspricht
    // der Startansicht: der Punkt aus distance/azimuth/elevation, Blick zur
    // Sonne (azimuth + π, −elevation).
    fly: {
      refId: 'sun',
      x: 8e8 * Math.cos(0.5) * Math.cos(0.6),
      y: 8e8 * Math.cos(0.5) * Math.sin(0.6),
      z: 8e8 * Math.sin(0.5),
      yaw: 0.6 + Math.PI,
      pitch: -0.5,
    },
  },
```

- [ ] **Step 4: Prüfer**

`src/store/pruefer.ts`:

```ts
  'camera.mode': ['free', 'attached', 'follow', 'cinema', 'fly'],
```

In `pruefeFeld` die Kennungsprüfung erweitern:

```ts
  if (pfad === 'camera.targetId' || pfad === 'camera.fly.refId') {
    return typeof wert === 'string' && Object.hasOwn(bodyIndex, wert) ? wert : VERWORFEN;
  }
```

In `BEREICHE` nach `'camera.freezeJd'`:

```ts
  'camera.fly.x': [-1e13, 1e13],
  'camera.fly.y': [-1e13, 1e13],
  'camera.fly.z': [-1e13, 1e13],
  'camera.fly.pitch': [-Math.PI / 2, Math.PI / 2],
```

Im Kommentar über `BEREICHE` den Satz über `camera.azimuth` ersetzen durch: „`camera.azimuth` und `camera.fly.yaw` (Winkel ohne Grenze, wickeln um) und `cinema.seed` (beliebige ganze Zahl) bleiben bewusst ohne Eintrag hier. Die Lage im Flug reicht wie `camera.distance` bis 10¹³ km." Die Nennung „MIN_/MAX_DISTANCE_KM und ELEVATION_GRENZE in render/camera/input.ts" bleibt in diesem Task; Task 2 zieht sie nach.

- [ ] **Step 5: Kamera-Literale in `controller.test.ts`**

Die drei vollständigen Kamera-Objekte bekommen den Standard vorangestellt, sonst scheitert `tsc -b` am fehlenden `fly`:

```ts
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
```

(Zeilen 33 und 48; azimuth 0,6, elevation 0,5 und freezeJd null sind Standard.) In `freiAufErde` (Zeile 86):

```ts
    camera: {
      ...DEFAULT_STATE.camera,
      mode: 'free', targetId: 'earth', distance,
      azimuth: 0.6, elevation: 0.5, freezeJd: jd,
    },
```

- [ ] **Step 6: Tests und Typprüfung**

Run: `npx vitest run src/store src/render/camera && npx tsc -b`
Expected: PASS, tsc ohne Ausgabe.

Run: `npm test`
Expected: 3696 Tests grün (3692 + 4).

- [ ] **Step 7: Commit**

```bash
git add src/store/types.ts src/store/index.ts src/store/pruefer.ts src/store/flug.test.ts src/store/pruefer.test.ts src/render/camera/controller.test.ts
git commit -m "Kamera: Modus Flug mit Fluglage in Store und Prüfer"
```

---

### Task 2: Flugmathematik I – Achsen, Bezug, Höhe, Geschwindigkeit, Mindesthöhe

**Files:**
- Create: `src/render/camera/flug.ts`
- Create: `src/render/camera/flug.test.ts`
- Modify: `src/render/camera/input.ts:5-8` (Grenzkonstanten nach `flug.ts` verlegen)
- Modify: `src/store/pruefer.ts` (Kommentar: Grenzen jetzt in `render/camera/flug.ts`)

**Interfaces:**
- Produces (alle aus `src/render/camera/flug.ts`):
  - `ELEVATION_GRENZE`, `MIN_DISTANCE_KM`, `MAX_DISTANCE_KM` (bisher privat in `input.ts`)
  - `BEZUG_RUECKSTELLUNG = 0.8`, `TEMPO_UNTERGRENZE_RADIEN = 0.05`, `MINDESTABSTAND_RADIEN = 1.05`
  - `interface Blick { yaw: number; pitch: number }`, `interface Pose { positionKm: Vec3; blick: Vec3 }`, `interface KoerperStand { id: string; pos: Vec3; radius: number }`
  - `plus`, `minus`, `mal(a, k)`, `laenge`, `normiert`, `punkt`, `kreuz`, `begrenze(wert, min, max)`
  - `blickVektor(b: Blick): Vec3`, `rechtsVektor(b: Blick): Vec3`, `obenVektor(b: Blick): Vec3`, `blickAus(v: Vec3): Blick`
  - `koerperStaende(liste: readonly Body[], index: BodyIndex, jd: number, s: ScaleSettings, visible: Record<string, boolean>): KoerperStand[]`
  - `waehleBezug(p: Vec3, staende: readonly KoerperStand[], bisher: string | null): string | null`
  - `hoehe(p, staende): { h: number; radius: number }`, `fluggeschwindigkeit(p, staende, tempo): number`, `mindesthoehe(p, staende): Vec3`

- [ ] **Step 1: Failing tests schreiben**

`src/render/camera/flug.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  blickVektor, rechtsVektor, obenVektor, blickAus, koerperStaende, waehleBezug, hoehe,
  fluggeschwindigkeit, mindesthoehe, laenge, plus, mal, punkt, kreuz, ELEVATION_GRENZE,
} from './flug';
import type { KoerperStand } from './flug';
import { DEFAULT_STATE } from '../../store';
import { bodies, bodyIndex } from '../../data/index';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';

const jd = DEFAULT_STATE.time.jd;
const s = DEFAULT_STATE.scale;
const lage = (id: string) => scaledPositionAt(id, bodyIndex, jd, s);
const radius = (id: string) => scaledRadius(bodyIndex[id]!, s);

describe('Kameraachsen', () => {
  it('bilden für beliebige Blickrichtungen ein Rechtssystem aus Einheitsvektoren', () => {
    for (const [yaw, pitch] of [[0, 0], [1.3, 0.4], [-2.8, -1.1], [7, 1.5]] as const) {
      const f = blickVektor({ yaw, pitch });
      const r = rechtsVektor({ yaw, pitch });
      const u = obenVektor({ yaw, pitch });
      for (const v of [f, r, u]) expect(laenge(v)).toBeCloseTo(1, 12);
      expect(punkt(f, r)).toBeCloseTo(0, 12);
      expect(punkt(f, u)).toBeCloseTo(0, 12);
      expect(punkt(r, u)).toBeCloseTo(0, 12);
      const k = kreuz(r, f);
      expect(k.x).toBeCloseTo(u.x, 12);
      expect(k.y).toBeCloseTo(u.y, 12);
      expect(k.z).toBeCloseTo(u.z, 12);
    }
  });

  it('hält rechts waagerecht und oben bei waagerechtem Blick auf Ekliptik-Nord', () => {
    const r = rechtsVektor({ yaw: 0, pitch: 0.7 });
    expect(r.x).toBeCloseTo(0, 12);
    expect(r.y).toBeCloseTo(-1, 12);
    expect(r.z).toBe(0);
    const u = obenVektor({ yaw: 2, pitch: 0 });
    expect(u.x).toBeCloseTo(0, 12);
    expect(u.y).toBeCloseTo(0, 12);
    expect(u.z).toBeCloseTo(1, 12);
  });

  it('rechnet Blickrichtungen hin und zurück und begrenzt pitch', () => {
    const b = blickAus(blickVektor({ yaw: 1.2, pitch: -0.3 }));
    expect(b.yaw).toBeCloseTo(1.2, 12);
    expect(b.pitch).toBeCloseTo(-0.3, 12);
    expect(blickAus({ x: 0, y: 0, z: 5 }).pitch).toBe(ELEVATION_GRENZE);
    expect(blickAus({ x: 0, y: 0, z: -5 }).pitch).toBe(-ELEVATION_GRENZE);
  });
});

describe('koerperStaende', () => {
  it('liefert dargestellte Lage und Radius aller sichtbaren Körper', () => {
    const staende = koerperStaende(bodies, bodyIndex, jd, s, { moon: false });
    expect(staende).toHaveLength(bodies.length - 1);
    expect(staende.some((k) => k.id === 'moon')).toBe(false);
    expect(staende.find((k) => k.id === 'sun')!.radius).toBeCloseTo(radius('sun'), 6);
    expect(staende.find((k) => k.id === 'mars')!.pos).toEqual(lage('mars'));
  });
});

describe('waehleBezug', () => {
  const staende = koerperStaende(bodies, bodyIndex, jd, s, {});

  it('nimmt zwischen den Planeten die Sonne', () => {
    const mitte = mal(plus(lage('earth'), lage('mars')), 0.5);
    expect(waehleBezug(mitte, staende, null)).toBe('sun');
  });

  it('nimmt in Erdnähe die Erde und dicht am Mond den Mond', () => {
    expect(waehleBezug(plus(lage('earth'), { x: 3 * radius('earth'), y: 0, z: 0 }), staende, null)).toBe('earth');
    expect(waehleBezug(plus(lage('moon'), { x: 0, y: 0, z: 1.5 * radius('moon') }), staende, null)).toBe('moon');
  });

  it('wechselt erst unter vier Fünfteln des bisherigen Maßes (Rückstellbereich)', () => {
    const zwei: KoerperStand[] = [
      { id: 'a', pos: { x: 0, y: 0, z: 0 }, radius: 1 },
      { id: 'b', pos: { x: 10, y: 0, z: 0 }, radius: 1 },
    ];
    expect(waehleBezug({ x: 4.9, y: 0, z: 0 }, zwei, null)).toBe('a');
    expect(waehleBezug({ x: 4.9, y: 0, z: 0 }, zwei, 'b')).toBe('b');
    expect(waehleBezug({ x: 4, y: 0, z: 0 }, zwei, 'b')).toBe('a');
  });

  it('wählt ohne Rückstellbereich, wenn der bisherige Bezug fehlt (ausgeblendet)', () => {
    const ohneErde = koerperStaende(bodies, bodyIndex, jd, s, { earth: false });
    const nahErde = plus(lage('earth'), { x: 3 * radius('earth'), y: 0, z: 0 });
    expect(waehleBezug(nahErde, ohneErde, 'earth')).toBe('sun');
  });

  it('liefert ohne Körper null', () => {
    expect(waehleBezug({ x: 0, y: 0, z: 0 }, [], 'sun')).toBeNull();
  });
});

describe('Höhe, Geschwindigkeit, Mindesthöhe', () => {
  const einer: KoerperStand[] = [{ id: 'k', pos: { x: 0, y: 0, z: 0 }, radius: 10 }];

  it('misst die Höhe über der nächsten Oberfläche', () => {
    expect(hoehe({ x: 110, y: 0, z: 0 }, einer)).toEqual({ h: 100, radius: 10 });
  });

  it('fliegt mit Tempo mal Höhe, dicht über der Oberfläche mit der Untergrenze', () => {
    expect(fluggeschwindigkeit({ x: 110, y: 0, z: 0 }, einer, 0.5)).toBeCloseTo(50, 12);
    // Höhe 0,1 liegt unter 0,05 · 10 = 0,5.
    expect(fluggeschwindigkeit({ x: 10.1, y: 0, z: 0 }, einer, 0.5)).toBeCloseTo(0.25, 12);
    expect(fluggeschwindigkeit({ x: 1, y: 0, z: 0 }, [], 0.5)).toBe(0);
  });

  it('schiebt eine Lage im Körper radial auf 1,05 Radien hinaus', () => {
    const q = mindesthoehe({ x: 5, y: 0, z: 0 }, einer);
    expect(q.x).toBeCloseTo(10.5, 12);
    expect(q.y).toBe(0);
    expect(q.z).toBe(0);
    expect(mindesthoehe({ x: 0, y: 0, z: 0 }, einer)).toEqual({ x: 0, y: 0, z: 10.5 });
    const aussen = { x: 20, y: 0, z: 0 };
    expect(mindesthoehe(aussen, einer)).toBe(aussen);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/render/camera/flug.test.ts`
Expected: FAIL („Failed to resolve import ./flug").

- [ ] **Step 3: `flug.ts` anlegen**

```ts
import type { Body, BodyIndex, Vec3 } from '../../sim/types';
import type { ScaleSettings } from '../../sim/scale';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';

/**
 * Reine Flugmathematik (Entwurf Flug und Controller §3, §4, §6.1): ohne DOM
 * und ohne Store. Positionen sind dargestellte km (scaledPositionAt), Radien
 * dargestellte Radien (scaledRadius). Hier stehen auch die Grenzen der
 * Kamera, die Orbit-Eingabe (input.ts) und Flug gemeinsam nutzen.
 */

/** Knapp unter dem Pol, damit die Ansicht nicht umklappt. */
export const ELEVATION_GRENZE = Math.PI / 2 - 0.01;
export const MIN_DISTANCE_KM = 1e2;
export const MAX_DISTANCE_KM = 1e13;

/** Ein anderer Körper wird Bezug erst unter diesem Anteil des bisherigen Maßes (§3.3). */
export const BEZUG_RUECKSTELLUNG = 0.8;
/** Untergrenze der Geschwindigkeit in Radien des nächsten Körpers, mal Tempofaktor (§3.4). */
export const TEMPO_UNTERGRENZE_RADIEN = 0.05;
/** Kleinster Abstand vom Mittelpunkt eines sichtbaren Körpers, in dessen Radien (§3.4). */
export const MINDESTABSTAND_RADIEN = 1.05;

/** Blickrichtung, gezählt wie azimuth/elevation: yaw um Ekliptik-Nord, pitch darüber. */
export interface Blick { yaw: number; pitch: number }
/** Gezeigte Kameralage eines Bildes: Weltlage in km und Blickvektor der Länge 1. */
export interface Pose { positionKm: Vec3; blick: Vec3 }
/** Dargestellte Lage und dargestellter Radius eines sichtbaren Körpers. */
export interface KoerperStand { id: string; pos: Vec3; radius: number }

export const plus = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const minus = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const mal = (a: Vec3, k: number): Vec3 => ({ x: a.x * k, y: a.y * k, z: a.z * k });
export const laenge = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);
export const punkt = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const kreuz = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x,
});
export const normiert = (a: Vec3): Vec3 => {
  const l = laenge(a);
  return l === 0 ? { x: 0, y: 0, z: 0 } : mal(a, 1 / l);
};
export const begrenze = (wert: number, min: number, max: number): number =>
  Math.min(Math.max(wert, min), max);

export function blickVektor(b: Blick): Vec3 {
  const c = Math.cos(b.pitch);
  return { x: c * Math.cos(b.yaw), y: c * Math.sin(b.yaw), z: Math.sin(b.pitch) };
}

/** Rechts der Kamera: Blick × Ekliptik-Nord, ohne Rollen stets waagerecht. */
export function rechtsVektor(b: Blick): Vec3 {
  return { x: Math.sin(b.yaw), y: -Math.cos(b.yaw), z: 0 };
}

/** Oben der Kamera: rechts × Blick. */
export function obenVektor(b: Blick): Vec3 {
  const sp = Math.sin(b.pitch);
  return { x: -sp * Math.cos(b.yaw), y: -sp * Math.sin(b.yaw), z: Math.cos(b.pitch) };
}

/** Blickrichtung eines Vektors; pitch bleibt in ±ELEVATION_GRENZE. */
export function blickAus(v: Vec3): Blick {
  const l = laenge(v) || 1;
  const pitch = Math.asin(begrenze(v.z / l, -1, 1));
  return { yaw: Math.atan2(v.y, v.x), pitch: begrenze(pitch, -ELEVATION_GRENZE, ELEVATION_GRENZE) };
}

/** Dargestellte Lage und Radius aller sichtbaren Körper zu `jd`. */
export function koerperStaende(
  liste: readonly Body[], index: BodyIndex, jd: number, s: ScaleSettings,
  visible: Record<string, boolean>,
): KoerperStand[] {
  return liste
    .filter((b) => visible[b.id] !== false)
    .map((b) => ({ id: b.id, pos: scaledPositionAt(b.id, index, jd, s), radius: scaledRadius(b, s) }));
}

/**
 * Bezugskörper (§3.3): kleinster Abstand in eigenen Radien. Ein anderer als
 * `bisher` gewinnt erst unter BEZUG_RUECKSTELLUNG mal dessen Maß; fehlt
 * `bisher` unter den Ständen (ausgeblendet), gilt der beste sofort.
 */
export function waehleBezug(
  p: Vec3, staende: readonly KoerperStand[], bisher: string | null,
): string | null {
  let bester: KoerperStand | null = null;
  let besterQ = Infinity;
  let bisherQ = Infinity;
  for (const k of staende) {
    const q = laenge(minus(p, k.pos)) / k.radius;
    if (k.id === bisher) bisherQ = q;
    if (q < besterQ) { besterQ = q; bester = k; }
  }
  if (bester === null) return null;
  if (bisher !== null && bisherQ < Infinity && besterQ >= BEZUG_RUECKSTELLUNG * bisherQ) return bisher;
  return bester.id;
}

/** Höhe über der nächsten sichtbaren Oberfläche und Radius dieses Körpers (§3.4). */
export function hoehe(p: Vec3, staende: readonly KoerperStand[]): { h: number; radius: number } {
  let h = Infinity;
  let radius = 0;
  for (const k of staende) {
    const d = laenge(minus(p, k.pos)) - k.radius;
    if (d < h) { h = d; radius = k.radius; }
  }
  return { h, radius };
}

/** km/s: Tempofaktor mal Höhe, nicht unter TEMPO_UNTERGRENZE_RADIEN Radien. */
export function fluggeschwindigkeit(p: Vec3, staende: readonly KoerperStand[], tempo: number): number {
  const { h, radius } = hoehe(p, staende);
  if (!Number.isFinite(h)) return 0;
  return tempo * Math.max(h, TEMPO_UNTERGRENZE_RADIEN * radius);
}

/**
 * Schiebt `p` radial aus jedem Körper auf MINDESTABSTAND_RADIEN hinaus; liegt
 * `p` im Mittelpunkt, nach Ekliptik-Nord. Ohne Änderung kommt `p` selbst zurück.
 */
export function mindesthoehe(p: Vec3, staende: readonly KoerperStand[]): Vec3 {
  let q = p;
  for (const k of staende) {
    const d = minus(q, k.pos);
    const l = laenge(d);
    const min = MINDESTABSTAND_RADIEN * k.radius;
    if (l >= min) continue;
    const richtung = l === 0 ? { x: 0, y: 0, z: 1 } : mal(d, 1 / l);
    q = plus(k.pos, mal(richtung, min));
  }
  return q;
}
```

- [ ] **Step 4: Grenzkonstanten aus `input.ts` beziehen**

In `src/render/camera/input.ts` die Zeilen

```ts
/** Knapp unter dem Pol, damit die Ansicht nicht umklappt. */
const ELEVATION_GRENZE = Math.PI / 2 - 0.01;
const MIN_DISTANCE_KM = 1e2;
const MAX_DISTANCE_KM = 1e13;
```

ersetzen durch

```ts
import { ELEVATION_GRENZE, MIN_DISTANCE_KM, MAX_DISTANCE_KM } from './flug';
```

(den Import zu den übrigen Importen oben stellen). In `src/store/pruefer.ts` im Kommentar über `BEREICHE` „in render/camera/input.ts" durch „in render/camera/flug.ts" ersetzen.

- [ ] **Step 5: Tests**

Run: `npx vitest run src/render/camera`
Expected: PASS.

Run: `npm test`
Expected: 3708 Tests grün (3696 + 12).

- [ ] **Step 6: Commit**

```bash
git add src/render/camera/flug.ts src/render/camera/flug.test.ts src/render/camera/input.ts src/store/pruefer.ts
git commit -m "Flug: Achsen, Bezugswahl, Geschwindigkeit und Mindesthöhe"
```

---

### Task 3: Flugmathematik II – Körper nächst der Mitte, Kugelkoordinaten, Flugschritt

**Files:**
- Modify: `src/render/camera/flug.ts` (anhängen)
- Modify: `src/render/camera/flug.test.ts` (anhängen)

**Interfaces:**
- Consumes: alles aus Task 2.
- Produces (aus `flug.ts`):
  - `interface Absicht { vor: number; seit: number; hoch: number }` (je −1 … 1: W/S, D/A, E/Q)
  - `koerperNaechstDerMitte(pose: Pose, staende: readonly KoerperStand[]): string | null`
  - `kugelUm(p: Vec3, koerper: Vec3): { distance: number; azimuth: number; elevation: number }`
  - `flugSchritt(p: Vec3, blick: Blick, absicht: Absicht, geschwindigkeit: number, dt: number): Vec3`
  - `blickDrehen(b: Blick, dYaw: number, dPitch: number): Blick`

- [ ] **Step 1: Failing tests anhängen**

Import in `flug.test.ts` erweitern um `koerperNaechstDerMitte, kugelUm, flugSchritt, blickDrehen, minus, normiert, MIN_DISTANCE_KM, MAX_DISTANCE_KM` sowie `import type { Pose } from './flug';`, dann anhängen:

```ts
describe('koerperNaechstDerMitte', () => {
  const pose: Pose = { positionKm: { x: 0, y: 0, z: 0 }, blick: { x: 1, y: 0, z: 0 } };
  const k = (id: string, x: number, y: number, r: number): KoerperStand => ({ id, pos: { x, y, z: 0 }, radius: r });

  it('zieht eine Scheibe auf der Blickachse dem kleineren Winkel vor', () => {
    // b steht näher an der Achse als die Mitte von a, aber nur a bedeckt die Bildmitte.
    expect(koerperNaechstDerMitte(pose, [k('a', 100, 8, 10), k('b', 50, 2, 0.5)])).toBe('a');
  });

  it('nimmt von zwei Scheiben auf der Achse die vordere', () => {
    expect(koerperNaechstDerMitte(pose, [k('fern', 100, 0, 10), k('nah', 50, 0, 1)])).toBe('nah');
  });

  it('nimmt sonst den kleinsten Winkel', () => {
    expect(koerperNaechstDerMitte(pose, [k('h', 100, 20, 1), k('g', 100, 10, 1)])).toBe('g');
  });

  it('übergeht Körper hinter der Kamera und den, in dem die Kamera steckt', () => {
    expect(koerperNaechstDerMitte(pose, [k('hinten', -10, 0, 1), k('innen', 0, 0, 5)])).toBeNull();
    expect(koerperNaechstDerMitte(pose, [k('innen', 0, 0, 5), k('f', 100, 50, 1)])).toBe('f');
  });

  it('wählt mit echten Daten den Mars, wenn die Bildmitte auf seiner Scheibe liegt', () => {
    const mars = lage('mars');
    const von = plus(mars, { x: 2e7, y: 0, z: 0 });
    // 1·10⁵ km neben der Mitte, innerhalb des dargestellten Radius (rund 1,7·10⁵ km).
    const blick = normiert(minus(plus(mars, { x: 0, y: 1e5, z: 0 }), von));
    const staende = koerperStaende(bodies, bodyIndex, jd, s, { phobos: false, deimos: false });
    expect(koerperNaechstDerMitte({ positionKm: von, blick }, staende)).toBe('mars');
  });
});

describe('kugelUm', () => {
  it('liefert Abstand, Azimut und Elevation der Lage um einen Körper', () => {
    const koerper = { x: 5e7, y: -3e7, z: 1e6 };
    const d = 2e6;
    const az = 2.5;
    const el = -0.4;
    const p = plus(koerper, {
      x: d * Math.cos(el) * Math.cos(az), y: d * Math.cos(el) * Math.sin(az), z: d * Math.sin(el),
    });
    const kugel = kugelUm(p, koerper);
    expect(kugel.distance).toBeCloseTo(d, 3);
    expect(kugel.azimuth).toBeCloseTo(az, 9);
    expect(kugel.elevation).toBeCloseTo(el, 9);
  });

  it('bleibt in den Grenzen der Orbit-Eingabe', () => {
    const o = { x: 0, y: 0, z: 0 };
    expect(kugelUm({ x: 0, y: 0, z: 1e6 }, o).elevation).toBe(ELEVATION_GRENZE);
    expect(kugelUm({ x: 10, y: 0, z: 0 }, o).distance).toBe(MIN_DISTANCE_KM);
    expect(kugelUm({ x: 1e14, y: 0, z: 0 }, o).distance).toBe(MAX_DISTANCE_KM);
  });
});

describe('flugSchritt', () => {
  const p = { x: 1, y: 2, z: 3 };
  const b = { yaw: 0, pitch: 0 };

  it('fliegt mit W in Blickrichtung, mit D nach rechts, mit E nach oben', () => {
    expect(flugSchritt(p, b, { vor: 1, seit: 0, hoch: 0 }, 10, 0.5)).toEqual({ x: 6, y: 2, z: 3 });
    const rechts = flugSchritt(p, b, { vor: 0, seit: 1, hoch: 0 }, 10, 0.5);
    expect(rechts.x).toBeCloseTo(1, 12);
    expect(rechts.y).toBeCloseTo(-3, 12);
    const oben = flugSchritt(p, b, { vor: 0, seit: 0, hoch: 1 }, 10, 0.5);
    expect(oben.z).toBeCloseTo(8, 12);
  });

  it('fliegt schräg nicht schneller', () => {
    const q = flugSchritt(p, b, { vor: 1, seit: 1, hoch: 0 }, 10, 1);
    expect(laenge(minus(q, p))).toBeCloseTo(10, 12);
  });

  it('bleibt ohne Absicht stehen', () => {
    expect(flugSchritt(p, b, { vor: 0, seit: 0, hoch: 0 }, 10, 1)).toBe(p);
  });
});

describe('blickDrehen', () => {
  it('dreht yaw frei und begrenzt pitch', () => {
    expect(blickDrehen({ yaw: 3, pitch: 1.5 }, 4, 0.2)).toEqual({ yaw: 7, pitch: ELEVATION_GRENZE });
    expect(blickDrehen({ yaw: 0, pitch: 0 }, -1, -0.3)).toEqual({ yaw: -1, pitch: -0.3 });
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/render/camera/flug.test.ts`
Expected: FAIL (Exporte fehlen).

- [ ] **Step 3: An `flug.ts` anhängen**

```ts
/** Steuerabsicht je Achse in −1 … 1: vor (W/S), seit (D/A), hoch (E/Q). */
export interface Absicht { vor: number; seit: number; hoch: number }

/**
 * Körper nächst der Bildmitte (§4.2): Liegt die Blickachse auf einer Scheibe
 * (Winkel kleiner als der Winkelradius), der vorderste solche Körper; sonst
 * der mit dem kleinsten Winkel zur Achse. Nur Körper vor der Kamera; einer,
 * in dem die Kamera steckt, zählt nicht. Entspricht Rang 1a der
 * Trefferprüfung (render/treffer.ts), braucht aber keine Kandidaten.
 */
export function koerperNaechstDerMitte(pose: Pose, staende: readonly KoerperStand[]): string | null {
  let scheibe: { id: string; abstand: number } | null = null;
  let naechster: { id: string; winkel: number } | null = null;
  for (const k of staende) {
    const d = minus(k.pos, pose.positionKm);
    const abstand = laenge(d);
    if (abstand <= k.radius) continue;
    const vorn = punkt(d, pose.blick);
    if (vorn <= 0) continue;
    // atan2 statt acos: auch bei winzigen Winkeln ferner Körper genau.
    const winkel = Math.atan2(laenge(kreuz(d, pose.blick)), vorn);
    if (winkel < Math.asin(k.radius / abstand)) {
      if (scheibe === null || abstand < scheibe.abstand) scheibe = { id: k.id, abstand };
    } else if (naechster === null || winkel < naechster.winkel) {
      naechster = { id: k.id, winkel };
    }
  }
  return scheibe?.id ?? naechster?.id ?? null;
}

/**
 * Kugelkoordinaten der Lage `p` um einen Körper, in den Grenzen der
 * Orbit-Eingabe — damit eine Umlaufkamera dort beginnt, wo die gezeigte
 * Kamera steht (§4.2, §4.5).
 */
export function kugelUm(p: Vec3, koerper: Vec3): { distance: number; azimuth: number; elevation: number } {
  const v = minus(p, koerper);
  const { yaw, pitch } = blickAus(v);
  return { distance: begrenze(laenge(v), MIN_DISTANCE_KM, MAX_DISTANCE_KM), azimuth: yaw, elevation: pitch };
}

/**
 * Ein Flugschritt (§4.1): Richtung aus Absicht und Kameraachsen, ab Länge 1
 * normiert (schräg nicht schneller), Weg = Geschwindigkeit mal dt. Ohne
 * Absicht kommt `p` selbst zurück.
 */
export function flugSchritt(p: Vec3, blick: Blick, absicht: Absicht, geschwindigkeit: number, dt: number): Vec3 {
  let r = plus(
    plus(mal(blickVektor(blick), absicht.vor), mal(rechtsVektor(blick), absicht.seit)),
    mal(obenVektor(blick), absicht.hoch),
  );
  const l = laenge(r);
  if (l === 0) return p;
  if (l > 1) r = mal(r, 1 / l);
  return plus(p, mal(r, geschwindigkeit * dt));
}

/** Dreht den Blick; yaw wickelt nicht, pitch bleibt in ±ELEVATION_GRENZE. */
export function blickDrehen(b: Blick, dYaw: number, dPitch: number): Blick {
  return { yaw: b.yaw + dYaw, pitch: begrenze(b.pitch + dPitch, -ELEVATION_GRENZE, ELEVATION_GRENZE) };
}
```

- [ ] **Step 4: Tests**

Run: `npx vitest run src/render/camera/flug.test.ts`
Expected: PASS.

Run: `npm test`
Expected: 3719 Tests grün (3708 + 11).

- [ ] **Step 5: Commit**

```bash
git add src/render/camera/flug.ts src/render/camera/flug.test.ts
git commit -m "Flug: Körper nächst der Bildmitte, Kugelkoordinaten und Flugschritt"
```

---

### Task 4: Controller – Flugzweig, Ein- und Ausstieg ohne Sprung, `letztePose()`

**Files:**
- Modify: `src/render/camera/controller.ts`
- Modify: `src/render/camera/controller.test.ts`
- Modify: `src/render/exposure.ts:21-29` (`exposureTargetId`)
- Modify: `src/render/exposure.test.ts`

**Interfaces:**
- Consumes: `blickVektor`, `plus`, `minus`, `mal`, `laenge`, `normiert`, `Pose` aus Task 2; `kugelUm`, `blickAus` im Test.
- Produces: `export function letztePose(): Pose | null` und `export const FLUG_DAEMPFUNG_S = 0.15` in `src/render/camera/controller.ts`. Tasks 6, 7, 9 lesen `letztePose()`.

- [ ] **Step 1: Failing tests schreiben**

In `src/render/camera/controller.test.ts` die Importe ergänzen:

```ts
import { createCameraController, targetFor, letztePose } from './controller';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { blickAus, kugelUm, laenge, minus, normiert, plus, punkt } from './flug';
import type { Vec3 } from '../../sim/types';
```

(die bestehenden Importzeilen für `createCameraController, targetFor` und `scaledPositionAt` dabei ersetzen) und anhängen:

```ts
describe('Flug', () => {
  const jd = DEFAULT_STATE.time.jd;
  const s = DEFAULT_STATE.scale;
  const neueKamera = (): THREE.PerspectiveCamera => {
    const c = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
    c.up.set(0, 0, 1);
    return c;
  };
  const mitFlug = (refId: string, lage: Vec3, blick: { yaw: number; pitch: number }): AppState => ({
    ...structuredClone(DEFAULT_STATE),
    camera: { ...DEFAULT_STATE.camera, mode: 'fly', fly: { refId, ...lage, ...blick } },
  });
  const winkel = (a: Vec3, b: Vec3): number =>
    Math.acos(Math.min(1, punkt(normiert(a), normiert(b))));

  it('tritt ohne Sprung in den Flug ein', () => {
    const c = createCameraController(neueKamera());
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
    };
    let vorher = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 600; i++) vorher = c.update(geheftet, jd, 1 / 60, s);
    const gezeigt = letztePose()!;
    // Die Fluglage, wie die Steuerung sie setzt: gezeigte Lage relativ zur Erde.
    const erde = scaledPositionAt('earth', bodyIndex, jd, s);
    const danach = c.update(mitFlug('earth', minus(gezeigt.positionKm, erde), blickAus(gezeigt.blick)), jd, 1 / 60, s);
    expect(laenge(minus(danach, vorher))).toBeLessThan(1e-3);
    expect(winkel(letztePose()!.blick, gezeigt.blick)).toBeLessThan(1e-6);
  });

  it('führt die Kamera mit dem Bezugskörper mit: Saturn bleibt bei laufender Zeit an seinem Platz im Bild', () => {
    const kam = neueKamera();
    const c = createCameraController(kam);
    const r = scaledRadius(bodyIndex.saturn!, s);
    const state = mitFlug('saturn', { x: 6 * r, y: 2 * r, z: r }, { yaw: Math.PI + 0.3, pitch: -0.1 });
    let jdJetzt = jd;
    let cameraKm = c.update(state, jdJetzt, 1 / 60, s);
    const anfang = projiziere(kam, 'saturn', jdJetzt, state, cameraKm);
    // Zehn Tage je Sekunde, zehn Sekunden lang.
    for (let i = 0; i < 600; i++) {
      jdJetzt += 10 / 60;
      cameraKm = c.update(state, jdJetzt, 1 / 60, s);
    }
    const ende = projiziere(kam, 'saturn', jdJetzt, state, cameraKm);
    expect(ende.x).toBeCloseTo(anfang.x, 4);
    expect(ende.y).toBeCloseTo(anfang.y, 4);
  });

  it('wechselt den Bezug ohne Scheinversatz', () => {
    const c = createCameraController(neueKamera());
    const erde = scaledPositionAt('earth', bodyIndex, jd, s);
    const mond = scaledPositionAt('moon', bodyIndex, jd, s);
    const welt = plus(erde, { x: 3e6, y: 0, z: 0 });
    const blick = { yaw: 1, pitch: 0.2 };
    for (let i = 0; i < 120; i++) c.update(mitFlug('earth', minus(welt, erde), blick), jd, 1 / 60, s);
    const vorher = c.update(mitFlug('earth', minus(welt, erde), blick), jd, 1 / 60, s);
    const danach = c.update(mitFlug('moon', minus(welt, mond), blick), jd, 1 / 60, s);
    expect(laenge(minus(danach, vorher))).toBeLessThan(1e-3);
  });

  it('verlässt den Flug ohne Sprung; der Blick schwenkt gedämpft auf das neue Ziel', () => {
    const c = createCameraController(neueKamera());
    for (let i = 0; i < 120; i++) c.update(mitFlug('earth', { x: 3e6, y: 1e6, z: 0 }, { yaw: 2, pitch: 0 }), jd, 1 / 60, s);
    const gezeigt = letztePose()!;
    const mond = scaledPositionAt('moon', bodyIndex, jd, s);
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'moon', ...kugelUm(gezeigt.positionKm, mond) },
    };
    const erstes = c.update(geheftet, jd, 1 / 60, s);
    expect(laenge(minus(erstes, gezeigt.positionKm))).toBeLessThan(1);
    expect(winkel(letztePose()!.blick, gezeigt.blick)).toBeLessThan(0.05);
    for (let i = 0; i < 180; i++) c.update(geheftet, jd, 1 / 60, s);
    const p = letztePose()!;
    expect(winkel(p.blick, minus(mond, p.positionKm))).toBeLessThan(1e-3);
  });

  it('nimmt im allerersten Bild die Fluglage aus dem Store (Link im Flugmodus)', () => {
    const c = createCameraController(neueKamera());
    const p = c.update(mitFlug('mars', { x: 1e6, y: -2e6, z: 5e5 }, { yaw: 0.4, pitch: 0.1 }), jd, 1 / 60, s);
    const erwartet = plus(scaledPositionAt('mars', bodyIndex, jd, s), { x: 1e6, y: -2e6, z: 5e5 });
    expect(laenge(minus(p, erwartet))).toBeLessThan(1e-3);
  });
});
```

In `src/render/exposure.test.ts` im `describe('exposureTargetId', …)` anhängen:

```ts
  it('nimmt im Flug den Bezugskörper', () => {
    expect(exposureTargetId(mitKamera({
      mode: 'fly', targetId: 'sun', fly: { ...DEFAULT_STATE.camera.fly, refId: 'saturn' },
    }))).toBe('saturn');
  });
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/render/camera/controller.test.ts src/render/exposure.test.ts`
Expected: FAIL (`letztePose` fehlt; Belichtung nimmt `sun`).

- [ ] **Step 3: Controller umbauen**

In `src/render/camera/controller.ts` die Importe ergänzen:

```ts
import { kmToUnits, worldToRender } from '../units';
import { blickVektor, laenge, mal, minus, normiert, plus } from './flug';
import type { Pose } from './flug';
```

(die bisherige Zeile `import { worldToRender } from '../units';` ersetzen). Nach `export interface CameraController { … }` einfügen:

```ts
/**
 * Dämpfung im Flug: kürzer als die 0,45 s der Umlaufmodi, damit Tasten und
 * Mausblick direkt wirken (Entwurf Flug und Controller §12.2, Punkt 7).
 */
export const FLUG_DAEMPFUNG_S = 0.15;

let zuletztGezeigt: Pose | null = null;

/**
 * Gezeigte Kameralage des zuletzt gerechneten Bildes (Entwurf Flug und
 * Controller §6.1). Flug, Drehen mit Shift und Kamerafahrt beginnen dort,
 * damit die Kamera beim Moduswechsel nicht springt; null vor dem ersten Bild.
 */
export function letztePose(): Pose | null {
  return zuletztGezeigt;
}
```

`createCameraController` vollständig ersetzen durch:

```ts
export function createCameraController(camera: THREE.PerspectiveCamera): CameraController {
  // Gedämpft wird der Versatz **zum Anker**, nicht die absolute Position:
  // Bei hoher Zeitraffung legt die Erde je Sekunde Millionen Kilometer
  // zurück; eine gedämpfte Absolutposition bliebe dauerhaft hinterher und
  // der angeheftete Körper liefe aus der Bildmitte.
  let istOffset: Vec3 = { x: 0, y: 0, z: 3e8 };
  // Den Sprung beim Wechsel von Ziel oder Modus fängt ein Restversatz auf,
  // der gegen null abklingt — daraus entsteht der weiche Überflug, ohne
  // dass ein einziger Modusübergang eigens programmiert wäre.
  let versatz: Vec3 = { x: 0, y: 0, z: 0 };
  const vOffset: Vec3 = { x: 0, y: 0, z: 0 };
  const vVersatz: Vec3 = { x: 0, y: 0, z: 0 };
  const NULLPUNKT: Vec3 = { x: 0, y: 0, z: 0 };

  let letzterAnker: Vec3 | null = null;
  let letzterSchluessel = '';

  // Flug: Lage relativ zum Bezugskörper und Blickvektor, beide gedämpft.
  let imFlug = false;
  let flugRef = '';
  let flugLage: Vec3 = { x: 0, y: 0, z: 0 };
  let flugBlick: Vec3 = { x: 1, y: 0, z: 0 };
  const vLage: Vec3 = { x: 0, y: 0, z: 0 };
  const vBlick: Vec3 = { x: 0, y: 0, z: 0 };
  let pose: Pose | null = null;

  const nullen = (v: Vec3): void => { v.x = 0; v.y = 0; v.z = 0; };
  const schluesselVon = (state: AppState): string =>
    `${state.camera.mode}|${state.camera.targetId}|${state.camera.freezeJd ?? 'jetzt'}`;
  const merke = (p: Pose): void => { pose = p; zuletztGezeigt = p; };

  /** Kamera im Ursprung, Blick entlang `richtung` (Render-Einheiten), Ebenen nach `abstand`. */
  const ausrichten = (richtung: Vec3, abstand: number): void => {
    camera.position.set(0, 0, 0);
    camera.lookAt(richtung.x, richtung.y, richtung.z);
    camera.near = Math.max(abstand * 1e-5, 1e-4);
    camera.far = Math.max(abstand * 1e4, 1e9);
    camera.updateProjectionMatrix();
  };

  /**
   * Flug (Entwurf Flug und Controller §3, §6.1): Anker ist der mitgeführte
   * Bezugskörper. Der Eintritt übernimmt die gezeigte Lage; ein Bezugswechsel
   * rechnet die gedämpfte Lage auf den neuen Körper um. Beides ohne Sprung.
   */
  const fliege = (state: AppState, jd: number, dt: number, s: ScaleSettings): Vec3 => {
    const fly = state.camera.fly;
    const ref = scaledPositionAt(fly.refId, bodyIndex, jd, s);
    if (!imFlug) {
      if (pose === null) {
        // Allererstes Bild (Link im Flugmodus): die Lage aus dem Store.
        flugLage = { x: fly.x, y: fly.y, z: fly.z };
        flugBlick = blickVektor(fly);
      } else {
        flugLage = minus(pose.positionKm, ref);
        flugBlick = pose.blick;
      }
      nullen(vLage);
      nullen(vBlick);
      imFlug = true;
    } else if (fly.refId !== flugRef) {
      flugLage = plus(flugLage, minus(scaledPositionAt(flugRef, bodyIndex, jd, s), ref));
    }
    flugRef = fly.refId;
    flugLage = smoothDampVec3(flugLage, { x: fly.x, y: fly.y, z: fly.z }, vLage, FLUG_DAEMPFUNG_S, dt);
    flugBlick = normiert(smoothDampVec3(flugBlick, blickVektor(fly), vBlick, FLUG_DAEMPFUNG_S, dt));
    const position = plus(ref, flugLage);
    ausrichten(flugBlick, kmToUnits(laenge(flugLage)));
    merke({ positionKm: position, blick: flugBlick });
    return position;
  };

  return {
    update(state, jd, dt, s) {
      if (state.camera.mode === 'fly') return fliege(state, jd, dt, s);

      const ziel = targetFor(state, jd, s);
      // In allen drei Modi ist der Blickpunkt zugleich der Anker, an dem die
      // Kamera hängt (Ursprung im freien Modus, sonst der Zielkörper).
      const anker = ziel.lookAtKm;
      const zielOffset: Vec3 = {
        x: ziel.positionKm.x - anker.x,
        y: ziel.positionKm.y - anker.y,
        z: ziel.positionKm.z - anker.z,
      };

      if (imFlug) {
        imFlug = false;
        if (pose !== null) {
          // Ausstieg aus dem Flug: Die Kamera bleibt stehen, der Blickpunkt
          // liegt zuerst auf der alten Blickachse im Abstand des neuen Ankers.
          // Versatz und Offset klingen gleich schnell ab; beginnt die
          // Umlaufkamera an der gezeigten Lage (heftenUm, fahreZu), bleibt
          // ihre Summe gleich und nur der Blick schwenkt.
          const blickpunkt = plus(pose.positionKm, mal(pose.blick, laenge(minus(anker, pose.positionKm))));
          versatz = minus(blickpunkt, anker);
          istOffset = minus(pose.positionKm, blickpunkt);
          nullen(vOffset);
          nullen(vVersatz);
          letzterAnker = anker;
          letzterSchluessel = schluesselVon(state);
        }
      }

      const schluessel = schluesselVon(state);
      if (letzterAnker !== null && schluessel !== letzterSchluessel) {
        versatz = {
          x: versatz.x + letzterAnker.x - anker.x,
          y: versatz.y + letzterAnker.y - anker.y,
          z: versatz.z + letzterAnker.z - anker.z,
        };
      }
      letzterSchluessel = schluessel;
      letzterAnker = anker;

      istOffset = smoothDampVec3(istOffset, zielOffset, vOffset, 0.45, dt);
      versatz = smoothDampVec3(versatz, NULLPUNKT, vVersatz, 0.45, dt);

      const istBlick: Vec3 = {
        x: anker.x + versatz.x,
        y: anker.y + versatz.y,
        z: anker.z + versatz.z,
      };
      const istPosition: Vec3 = {
        x: istBlick.x + istOffset.x,
        y: istBlick.y + istOffset.y,
        z: istBlick.z + istOffset.z,
      };

      // Die Kamera bleibt im Ursprung; sie schaut auf den kamerarelativen Blickpunkt.
      // Nahe und ferne Ebene richten sich nach der Zielentfernung.
      const blick = worldToRender(istBlick, istPosition);
      ausrichten(blick, Math.hypot(blick.x, blick.y, blick.z));
      merke({ positionKm: istPosition, blick: normiert(minus(istBlick, istPosition)) });
      return istPosition;
    },
  };
}
```

Den Kommentar über `targetFor` um einen Satz ergänzen: „Der Flug (`fly`) hat einen eigenen Zweig in `update`; `targetFor` beschreibt die Umlauf- und Kinomodi."

- [ ] **Step 4: Belichtung im Flug**

`src/render/exposure.ts`, `exposureTargetId`, vor `return state.camera.targetId;`:

```ts
  // Im Flug der Bezugskörper: Wer zum Saturn fliegt, während das Ziel die Sonne
  // ist, soll den Saturn richtig belichtet sehen (Plan Flug Etappe 1, Ruling 3).
  if (state.camera.mode === 'fly') return state.camera.fly.refId;
```

Den JSDoc-Satz „in den Handmodi das Kameraziel" ergänzen zu „in den Handmodi das Kameraziel, im Flug der Bezugskörper".

- [ ] **Step 5: Tests**

Run: `npx vitest run src/render`
Expected: PASS (auch die bestehenden Controller-Tests).

Run: `npm test`
Expected: 3725 Tests grün (3719 + 6).

- [ ] **Step 6: Commit**

```bash
git add src/render/camera/controller.ts src/render/camera/controller.test.ts src/render/exposure.ts src/render/exposure.test.ts
git commit -m "Kamera: Flugzweig im Controller, Ein- und Ausstieg ohne Sprung"
```

---

### Task 5: Tastatur – gehaltene Flugtasten

**Files:**
- Create: `src/ui/steuerung/tastatur.ts`
- Create: `src/ui/steuerung/tastatur.test.ts`
- Modify: `src/ui/shortcuts/useShortcuts.ts:12` (`istEingabefeld` exportieren)

**Interfaces:**
- Consumes: `Absicht` aus `render/camera/flug.ts` (Task 3).
- Produces (aus `src/ui/steuerung/tastatur.ts`): `FLUGTASTEN`, `type Flugtaste`, `interface Tastenstand { gehalten: ReadonlySet<Flugtaste>; shift: boolean }`, `interface Tastatur { stand(): Tastenstand; loesen(): void }`, `tastaturAnhaengen(fenster?: Window): Tastatur`, `tastenAbsicht(gehalten: ReadonlySet<Flugtaste>): Absicht`.

- [ ] **Step 1: Failing tests schreiben**

`src/ui/steuerung/tastatur.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { tastaturAnhaengen, tastenAbsicht } from './tastatur';
import type { Flugtaste, Tastatur } from './tastatur';

let tastatur: Tastatur | null = null;
afterEach(() => {
  tastatur?.loesen();
  tastatur = null;
  document.body.innerHTML = '';
});

function taste(
  typ: 'keydown' | 'keyup', code: string, extra: KeyboardEventInit = {}, ziel: EventTarget = window,
): KeyboardEvent {
  const e = new KeyboardEvent(typ, { code, bubbles: true, cancelable: true, ...extra });
  ziel.dispatchEvent(e);
  return e;
}

describe('tastaturAnhaengen', () => {
  it('merkt gehaltene Flugtasten nach e.code und vergisst sie beim Loslassen', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { key: 'w' });
    taste('keydown', 'KeyD', { key: 'd' });
    expect([...tastatur.stand().gehalten].sort()).toEqual(['KeyD', 'KeyW']);
    taste('keyup', 'KeyW', { key: 'w' });
    expect([...tastatur.stand().gehalten]).toEqual(['KeyD']);
  });

  it('erkennt die Lage, nicht den Buchstaben (französische Tastatur: Z auf KeyW)', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { key: 'z' });
    taste('keydown', 'KeyZ', { key: 'w' });
    expect([...tastatur.stand().gehalten]).toEqual(['KeyW']);
  });

  it('übergeht Wiederholungen, Strg/Alt/Meta und Eingabefelder', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { repeat: true });
    taste('keydown', 'KeyA', { ctrlKey: true });
    taste('keydown', 'KeyS', { altKey: true });
    taste('keydown', 'KeyD', { metaKey: true });
    const feld = document.createElement('input');
    document.body.appendChild(feld);
    taste('keydown', 'KeyE', {}, feld);
    expect(tastatur.stand().gehalten.size).toBe(0);
  });

  it('verhindert die Standardwirkung nur bei angenommenen Flugtasten', () => {
    tastatur = tastaturAnhaengen(window);
    expect(taste('keydown', 'KeyW').defaultPrevented).toBe(true);
    expect(taste('keydown', 'KeyH').defaultPrevented).toBe(false);
    expect(taste('keydown', 'KeyA', { ctrlKey: true }).defaultPrevented).toBe(false);
  });

  it('merkt Shift vom letzten Tastenereignis', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'ShiftLeft', { key: 'Shift', shiftKey: true });
    taste('keydown', 'KeyA', { shiftKey: true });
    expect(tastatur.stand().shift).toBe(true);
    taste('keyup', 'ShiftLeft', { key: 'Shift', shiftKey: false });
    expect(tastatur.stand().shift).toBe(false);
    expect(tastatur.stand().gehalten.has('KeyA')).toBe(true);
  });

  it('vergisst alles beim Verlassen des Fensters und beim Verbergen der Seite', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { shiftKey: true });
    window.dispatchEvent(new Event('blur'));
    expect(tastatur.stand().gehalten.size).toBe(0);
    expect(tastatur.stand().shift).toBe(false);
    taste('keydown', 'KeyW');
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(tastatur.stand().gehalten.size).toBe(0);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  });

  it('hört nach loesen() nicht mehr zu', () => {
    tastatur = tastaturAnhaengen(window);
    tastatur.loesen();
    taste('keydown', 'KeyW');
    expect(tastatur.stand().gehalten.size).toBe(0);
  });
});

describe('tastenAbsicht', () => {
  const absicht = (...tasten: Flugtaste[]) => tastenAbsicht(new Set(tasten));

  it('bildet vor, seit und hoch aus den gehaltenen Tasten', () => {
    expect(absicht('KeyW', 'KeyD', 'KeyE')).toEqual({ vor: 1, seit: 1, hoch: 1 });
    expect(absicht('KeyS', 'KeyA', 'KeyQ')).toEqual({ vor: -1, seit: -1, hoch: -1 });
  });

  it('lässt gegenläufige Tasten sich aufheben', () => {
    expect(absicht('KeyW', 'KeyS')).toEqual({ vor: 0, seit: 0, hoch: 0 });
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/steuerung/tastatur.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Step 3: Umsetzen**

In `src/ui/shortcuts/useShortcuts.ts` `function istEingabefeld` zu `export function istEingabefeld` machen.

`src/ui/steuerung/tastatur.ts`:

```ts
import type { Absicht } from '../../render/camera/flug';
import { istEingabefeld } from '../shortcuts/useShortcuts';

/** Flugtasten nach ihrer Lage auf der Tastatur (Entwurf Flug und Controller §4.4). */
export const FLUGTASTEN = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE'] as const;
export type Flugtaste = (typeof FLUGTASTEN)[number];

export interface Tastenstand {
  /** Gehaltene Flugtasten. */
  gehalten: ReadonlySet<Flugtaste>;
  /** Shift beim letzten Tastenereignis. */
  shift: boolean;
}

export interface Tastatur {
  stand(): Tastenstand;
  loesen(): void;
}

const istFlugtaste = (code: string): code is Flugtaste =>
  (FLUGTASTEN as readonly string[]).includes(code);

/**
 * Merkt sich die gehaltenen Flugtasten; ausgewertet wird je Bild in
 * steuerungTakt (ui/steuerung/anwenden.ts). Erkannt wird nach e.code, damit
 * die Tasten auch auf einer französischen Tastatur an derselben Stelle liegen.
 * Eingabefelder sowie Strg, Alt und Meta bleiben unberührt, damit die
 * Browserkürzel wirken. Verlässt der Fokus das Fenster oder wird die Seite
 * verborgen, sind alle Tasten vergessen — sonst flöge ein „hängendes W" weiter.
 */
export function tastaturAnhaengen(fenster: Window = window): Tastatur {
  const gehalten = new Set<Flugtaste>();
  let shift = false;

  const onKeyDown = (e: KeyboardEvent): void => {
    shift = e.shiftKey;
    if (!istFlugtaste(e.code)) return;
    if (e.ctrlKey || e.altKey || e.metaKey || istEingabefeld(e.target)) return;
    e.preventDefault();
    if (e.repeat) return;
    gehalten.add(e.code);
  };
  const onKeyUp = (e: KeyboardEvent): void => {
    shift = e.shiftKey;
    if (istFlugtaste(e.code)) gehalten.delete(e.code);
  };
  const vergessen = (): void => {
    gehalten.clear();
    shift = false;
  };
  const onSichtbarkeit = (): void => {
    if (fenster.document.visibilityState === 'hidden') vergessen();
  };

  fenster.addEventListener('keydown', onKeyDown);
  fenster.addEventListener('keyup', onKeyUp);
  fenster.addEventListener('blur', vergessen);
  fenster.document.addEventListener('visibilitychange', onSichtbarkeit);

  return {
    stand: () => ({ gehalten, shift }),
    loesen: () => {
      fenster.removeEventListener('keydown', onKeyDown);
      fenster.removeEventListener('keyup', onKeyUp);
      fenster.removeEventListener('blur', vergessen);
      fenster.document.removeEventListener('visibilitychange', onSichtbarkeit);
      vergessen();
    },
  };
}

/** Absicht aus den gehaltenen Tasten: vor W − S, seit D − A, hoch E − Q. */
export function tastenAbsicht(gehalten: ReadonlySet<Flugtaste>): Absicht {
  const an = (t: Flugtaste): number => (gehalten.has(t) ? 1 : 0);
  return {
    vor: an('KeyW') - an('KeyS'),
    seit: an('KeyD') - an('KeyA'),
    hoch: an('KeyE') - an('KeyQ'),
  };
}
```

- [ ] **Step 4: Tests**

Run: `npx vitest run src/ui/steuerung src/ui/shortcuts`
Expected: PASS.

Run: `npm test`
Expected: 3734 Tests grün (3725 + 9).

- [ ] **Step 5: Commit**

```bash
git add src/ui/steuerung/tastatur.ts src/ui/steuerung/tastatur.test.ts src/ui/shortcuts/useShortcuts.ts
git commit -m "Steuerung: gehaltene Flugtasten nach ihrer Lage"
```

---

### Task 6: Steuerungstakt – Flug starten, fliegen, nachführen; Verdrahtung

**Files:**
- Create: `src/ui/steuerung/anwenden.ts`
- Create: `src/ui/steuerung/anwenden.test.ts`
- Modify: `src/app/main.tsx` (Tastatur anhängen, Takt vor `tickCinema`, DEV-Zugang `letztePose`)

**Interfaces:**
- Consumes: Task 2/3 (`koerperStaende`, `waehleBezug`, `fluggeschwindigkeit`, `flugSchritt`, `mindesthoehe`, `blickAus`, `plus`, `minus`, `begrenze`, `laenge`, `MAX_DISTANCE_KM`, `Absicht`, `Pose`), Task 4 (`letztePose`), Task 5 (`Tastenstand`, `tastenAbsicht`, `tastaturAnhaengen`).
- Produces (aus `src/ui/steuerung/anwenden.ts`): `TEMPO_START`, `TEMPO_MIN`, `TEMPO_MAX`, `tempoFaktor()`, `tempoAendern(faktor)`, `tempoAbonnieren(hoerer): () => void`, `tempoZuruecksetzen()`, `interface SteuerungUmgebung { tasten(): Tastenstand; letztePose(): Pose | null }`, `flugStarten(pose: Pose, jd: number): void`, `steuerungTakt(jd: number, dt: number, u: SteuerungUmgebung): void`.

- [ ] **Step 1: Failing tests schreiben**

`src/ui/steuerung/anwenden.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  steuerungTakt, tempoAendern, tempoAbonnieren, tempoFaktor, tempoZuruecksetzen,
  TEMPO_START, TEMPO_MIN, TEMPO_MAX,
} from './anwenden';
import type { SteuerungUmgebung } from './anwenden';
import type { Flugtaste } from './tastatur';
import { useStore, DEFAULT_STATE } from '../../store';
import { bodyIndex } from '../../data';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { laenge, minus, plus } from '../../render/camera/flug';
import type { Pose } from '../../render/camera/flug';
import { startCinema, stopCinema } from '../cinemaControl';
import { fahreZu, fahrtAbbrechen, fahrtLaeuft } from '../kamerafahrt';

const jd = DEFAULT_STATE.time.jd;
const s = DEFAULT_STATE.scale;
const lage = (id: string) => scaledPositionAt(id, bodyIndex, jd, s);
const radius = (id: string) => scaledRadius(bodyIndex[id]!, s);

function umgebung(tasten: Flugtaste[], pose: Pose | null, shift = false): SteuerungUmgebung {
  return { tasten: () => ({ gehalten: new Set(tasten), shift }), letztePose: () => pose };
}

/** Gezeigte Lage vier Erdradien neben der Erde (+x), Blick auf sie. */
function vorErde(): Pose {
  return {
    positionKm: plus(lage('earth'), { x: 4 * radius('earth'), y: 0, z: 0 }),
    blick: { x: -1, y: 0, z: 0 },
  };
}

/** Weltlage der Kamera aus der Fluglage im Store. */
const weltlage = () => {
  const { fly } = useStore.getState().camera;
  return plus(lage(fly.refId), fly);
};

beforeEach(() => {
  fahrtAbbrechen();
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  tempoZuruecksetzen();
});

describe('steuerungTakt: Flug', () => {
  it('startet mit W den Flug an der gezeigten Lage; Bezug Erde, Ziel bleibt', () => {
    const pose = vorErde();
    steuerungTakt(jd, 0, umgebung(['KeyW'], pose));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    expect(camera.fly.refId).toBe('earth');
    expect(camera.targetId).toBe('sun');
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
    expect(camera.fly.yaw).toBeCloseTo(Math.PI, 12);
    expect(camera.fly.pitch).toBeCloseTo(0, 12);
  });

  it('fliegt mit W in Blickrichtung um Tempo mal Höhe', () => {
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    steuerungTakt(jd, 0.1, umgebung(['KeyW'], vorErde()));
    // Höhe 3 Erdradien, Tempo 0,5: 0,1 s bringen 0,15 Radien näher.
    const abstand = laenge(minus(weltlage(), lage('earth')));
    expect(abstand / radius('earth')).toBeCloseTo(4 - 0.15, 9);
  });

  it('lässt die Fluglage ohne Eingabe unberührt (mitgeführt wird im Controller)', () => {
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    const vorher = useStore.getState().camera.fly;
    steuerungTakt(jd + 1, 1 / 60, umgebung([], null));
    expect(useStore.getState().camera.fly).toBe(vorher);
  });

  it('wechselt beim Übertritt den Bezug und behält die Weltlage', () => {
    const nahMond = plus(lage('moon'), { x: 0, y: 0, z: 1.5 * radius('moon') });
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'earth', ...minus(nahMond, lage('earth')), yaw: 0, pitch: 0 },
    });
    steuerungTakt(jd, 1 / 60, umgebung([], null));
    expect(useStore.getState().camera.fly.refId).toBe('moon');
    expect(laenge(minus(weltlage(), nahMond))).toBeLessThan(1e-3);
  });

  it('schiebt eine Lage im Körper auf die Mindesthöhe hinaus', () => {
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'earth', x: 0.5 * radius('earth'), y: 0, z: 0, yaw: 0, pitch: 0 },
    });
    steuerungTakt(jd, 1 / 60, umgebung([], null));
    const { fly } = useStore.getState().camera;
    expect(fly.refId).toBe('earth');
    expect(laenge(fly) / radius('earth')).toBeCloseTo(1.05, 9);
  });

  it('wählt den Bezug neu, wenn er ausgeblendet wird', () => {
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'earth', x: 4 * radius('earth'), y: 0, z: 0, yaw: 0, pitch: 0 },
    });
    useStore.getState().toggleVisible('earth');
    steuerungTakt(jd, 1 / 60, umgebung([], null));
    expect(useStore.getState().camera.fly.refId).toBe('sun');
  });

  it('hält die Lage innerhalb von 10¹³ km um den Bezugskörper', () => {
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'sun', x: 9.9e12, y: 0, z: 0, yaw: 0, pitch: 0 },
    });
    tempoAendern(100);
    steuerungTakt(jd, 1, umgebung(['KeyW'], null));
    const { fly } = useStore.getState().camera;
    expect(fly.refId).toBe('sun');
    expect(Math.abs(fly.x)).toBeLessThanOrEqual(1e13);
    expect(laenge(fly)).toBeCloseTo(1e13, -4);
  });

  it('startet ohne gezeigte Lage keinen Flug', () => {
    steuerungTakt(jd, 1 / 60, umgebung(['KeyW'], null));
    expect(useStore.getState().camera.mode).toBe('free');
  });

  it('startet mit W und S zugleich den Flug, bewegt aber nicht', () => {
    const pose = vorErde();
    steuerungTakt(jd, 0.1, umgebung(['KeyW', 'KeyS'], pose));
    expect(useStore.getState().camera.mode).toBe('fly');
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
  });

  it('beendet ein Kino samt Wiederherstellung und fliegt ab dem gezeigten Bild', () => {
    useStore.getState().setTime({ rateDaysPerSec: 3 });
    startCinema();
    useStore.getState().setTime({ rateDaysPerSec: 50 });
    const pose = vorErde();
    steuerungTakt(jd, 0, umgebung(['KeyW'], pose));
    const z = useStore.getState();
    expect(z.cinema.running).toBe(false);
    expect(z.camera.mode).toBe('fly');
    expect(z.time.rateDaysPerSec).toBe(3);
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
  });

  it('bricht eine laufende Kamerafahrt ab', () => {
    fahreZu('mars', { jetzt: () => 0, anfordern: () => 1, abbrechen: () => { /* von Hand */ } });
    expect(fahrtLaeuft()).toBe(true);
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    expect(fahrtLaeuft()).toBe(false);
  });
});

describe('Tempofaktor', () => {
  it('vervielfacht in den Grenzen und meldet jeden neuen Wert', () => {
    const werte: number[] = [];
    const ab = tempoAbonnieren((w) => { werte.push(w); });
    tempoAendern(1.25);
    expect(tempoFaktor()).toBeCloseTo(TEMPO_START * 1.25, 12);
    tempoAendern(1e6);
    expect(tempoFaktor()).toBe(TEMPO_MAX);
    tempoAendern(1e-9);
    expect(tempoFaktor()).toBe(TEMPO_MIN);
    ab();
    tempoAendern(2);
    expect(werte).toEqual([TEMPO_START * 1.25, TEMPO_MAX, TEMPO_MIN]);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/steuerung/anwenden.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Step 3: `anwenden.ts` anlegen**

```ts
import { useStore } from '../../store';
import { bodies, bodyIndex } from '../../data';
import { scaledPositionAt } from '../../sim/scale';
import {
  begrenze, blickAus, flugSchritt, fluggeschwindigkeit, koerperStaende, laenge, mindesthoehe, minus, plus,
  waehleBezug, MAX_DISTANCE_KM,
} from '../../render/camera/flug';
import type { Absicht, Pose } from '../../render/camera/flug';
import { cinemaAktiv, stopCinema } from '../cinemaControl';
import { fahrtAbbrechen } from '../kamerafahrt';
import { tastenAbsicht } from './tastatur';
import type { Tastenstand } from './tastatur';

/**
 * Tempofaktor des Flugs (Entwurf Flug und Controller §3.4): flüchtig, nicht in
 * Link, Sitzung oder Ansicht. Geschwindigkeit = Faktor mal Höhe je Sekunde.
 */
export const TEMPO_START = 0.5;
export const TEMPO_MIN = 0.02;
export const TEMPO_MAX = 20;

let tempo = TEMPO_START;
const tempoHoerer = new Set<(wert: number) => void>();

export const tempoFaktor = (): number => tempo;

/** Vervielfacht den Tempofaktor in seinen Grenzen und meldet den neuen Wert. */
export function tempoAendern(faktor: number): void {
  tempo = begrenze(tempo * faktor, TEMPO_MIN, TEMPO_MAX);
  for (const hoerer of tempoHoerer) hoerer(tempo);
}

export function tempoAbonnieren(hoerer: (wert: number) => void): () => void {
  tempoHoerer.add(hoerer);
  return () => { tempoHoerer.delete(hoerer); };
}

/** Für Tests: Tempofaktor zurück auf den Start. */
export function tempoZuruecksetzen(): void {
  tempo = TEMPO_START;
}

export interface SteuerungUmgebung {
  tasten(): Tastenstand;
  /** Gezeigte Kameralage des letzten Bildes (render/camera/controller.ts). */
  letztePose(): Pose | null;
}

/**
 * Startet den Flug an einer gezeigten Lage (Entwurf §3.1): Kino und Fahrt
 * enden, Bezug ist der Körper, dem die Lage in eigenen Radien am nächsten ist.
 * targetId bleibt (Entscheidung 8).
 */
export function flugStarten(pose: Pose, jd: number): void {
  if (cinemaAktiv()) stopCinema();
  fahrtAbbrechen();
  const { scale, visible, setCamera } = useStore.getState();
  const staende = koerperStaende(bodies, bodyIndex, jd, scale, visible);
  const refId = waehleBezug(pose.positionKm, staende, null) ?? 'sun';
  const ref = scaledPositionAt(refId, bodyIndex, jd, scale);
  setCamera({ mode: 'fly', fly: { refId, ...minus(pose.positionKm, ref), ...blickAus(pose.blick) } });
}

/**
 * Ein Bild im Flug: Schritt aus der Absicht, dann Mindesthöhe und Bezugswahl
 * (§3.3, §3.4). Ohne Bewegung und ohne Bezugswechsel bleibt der Store
 * unberührt, sonst trüge jedes Bild Rundungsreste hinein.
 */
function flugNachfuehren(jd: number, dt: number, absicht: Absicht | null): void {
  const { camera, scale, visible, setCamera } = useStore.getState();
  const fly = camera.fly;
  const staende = koerperStaende(bodies, bodyIndex, jd, scale, visible);
  const ref = scaledPositionAt(fly.refId, bodyIndex, jd, scale);
  const start = plus(ref, fly);
  let welt = start;
  if (absicht !== null) {
    welt = flugSchritt(welt, fly, absicht, fluggeschwindigkeit(welt, staende, tempo), dt);
  }
  welt = mindesthoehe(welt, staende);
  const refId = waehleBezug(welt, staende, fly.refId) ?? fly.refId;
  if (welt === start && refId === fly.refId) return;
  const neuRef = refId === fly.refId ? ref : scaledPositionAt(refId, bodyIndex, jd, scale);
  let lage = minus(welt, neuRef);
  const weite = laenge(lage);
  if (weite > MAX_DISTANCE_KM) {
    // Höchstens 10¹³ km um den Bezug wie camera.distance (§3.4); komponentenweise
    // nachgeklemmt, damit Rundung den Prüferbereich nicht überschreitet.
    const k = MAX_DISTANCE_KM / weite;
    lage = {
      x: begrenze(lage.x * k, -MAX_DISTANCE_KM, MAX_DISTANCE_KM),
      y: begrenze(lage.y * k, -MAX_DISTANCE_KM, MAX_DISTANCE_KM),
      z: begrenze(lage.z * k, -MAX_DISTANCE_KM, MAX_DISTANCE_KM),
    };
  }
  setCamera({ fly: { ...fly, refId, ...lage } });
}

/**
 * Je Bild vor dem Kino-Takt (Entwurf §6.2). Gehaltene Flugtasten ohne Shift
 * starten den Flug an der gezeigten Lage und fliegen; im Flug laufen
 * Mindesthöhe und Bezugswahl auch ohne Eingabe.
 */
export function steuerungTakt(jd: number, dt: number, u: SteuerungUmgebung): void {
  const stand = u.tasten();
  const gedrueckt = stand.gehalten.size > 0;
  if (gedrueckt && !stand.shift) {
    if (useStore.getState().camera.mode !== 'fly') {
      const pose = u.letztePose();
      if (pose === null) return;
      flugStarten(pose, jd);
    }
    flugNachfuehren(jd, dt, tastenAbsicht(stand.gehalten));
    return;
  }
  if (useStore.getState().camera.mode === 'fly') flugNachfuehren(jd, dt, null);
}
```

- [ ] **Step 4: Verdrahtung in `src/app/main.tsx`**

Importe ergänzen:

```ts
import { steuerungTakt } from '../ui/steuerung/anwenden';
import { tastaturAnhaengen } from '../ui/steuerung/tastatur';
import { letztePose } from '../render/camera/controller';
```

Den DEV-Zugang erweitern:

```ts
      Object.assign(window as unknown as Record<string, unknown>, { kamera: ctx.camera, szene, letztePose });
```

Nach `const stopInput = attachCameraInput(…);`:

```ts
    // Flugtasten (Entwurf Flug und Controller §4): gehalten, je Bild ausgewertet.
    const tastatur = tastaturAnhaengen(window);
```

In der Bildschleife vor `tickCinema(dt);`:

```ts
      // Vor dem Kino-Takt: Ein Flug beendet das Kino im selben Bild (Entwurf
      // Flug und Controller §6.2). Die Lage ist die des zuletzt gezeigten Bildes.
      steuerungTakt(jd, dt, { tasten: tastatur.stand, letztePose });
```

Im Aufräumen nach `stopInput();`: `tastatur.loesen();`.

- [ ] **Step 5: Tests und Sichtprobe**

Run: `npx vitest run src/ui/steuerung && npx tsc -b`
Expected: PASS, tsc ohne Ausgabe.

Run: `npm test`
Expected: 3746 Tests grün (3734 + 12).

Sichtprobe im Browser (Server prüfen, navigieren, `quality.tier` hoch): Canvas anklicken, `KeyW` 1 s halten (`browser_press_key` genügt nicht; `browser_run_code_unsafe` mit `page.keyboard.down('KeyW')`, 1000 ms warten, `page.keyboard.up('KeyW')`), dann `window.store.getState().camera.mode` = `'fly'` und `window.letztePose()` näher an der Sonne als vorher. Nur prüfen, nichts committen.

- [ ] **Step 6: Commit**

```bash
git add src/ui/steuerung/anwenden.ts src/ui/steuerung/anwenden.test.ts src/app/main.tsx
git commit -m "Steuerung: Flug mit WASD und QE, Bezugswahl und Mindesthöhe je Bild"
```

---

### Task 7: Drehen mit Shift um den Körper nächst der Bildmitte

**Files:**
- Modify: `src/ui/steuerung/anwenden.ts`
- Modify: `src/ui/steuerung/anwenden.test.ts`

**Interfaces:**
- Consumes: `koerperNaechstDerMitte`, `kugelUm`, `ELEVATION_GRENZE`, `MIN_DISTANCE_KM`, `MAX_DISTANCE_KM` (Task 2/3); `steuerungTakt` (Task 6).
- Produces: `export function heftenUm(id: string, pose: Pose, jd: number): void` (Task 9 nutzt sie im Kamera-Panel); `DREH_AZIMUT_JE_S`, `DREH_ELEVATION_JE_S`, `ZOOM_JE_S`.

- [ ] **Step 1: Failing tests anhängen**

In `anwenden.test.ts` die Importe erweitern: `import { bodies, bodyIndex } from '../../data';` (statt nur `bodyIndex`) und aus `'../../render/camera/flug'` zusätzlich `kreuz, mal, normiert`. Dann anhängen:

```ts
describe('steuerungTakt: Drehen mit Shift', () => {
  /** Gezeigte Lage 2·10⁷ km sonnenseitig vor dem Körper, Blick um `versatzKm` an seiner Mitte vorbei. */
  function vorKoerper(id: string, versatzKm = 2e5): Pose {
    const k = lage(id);
    const aussen = normiert(k);
    const quer = normiert(kreuz(aussen, { x: 0, y: 0, z: 1 }));
    const von = minus(k, mal(aussen, 2e7));
    return { positionKm: von, blick: normiert(minus(plus(k, mal(quer, versatzKm)), von)) };
  }

  it('heftet aus dem Flug an den Körper nächst der Mitte, ohne die Lage zu ändern', () => {
    // Die Marsmonde stünden sonst womöglich näher an der Achse.
    useStore.getState().toggleVisible('phobos');
    useStore.getState().toggleVisible('deimos');
    useStore.getState().setCamera({ mode: 'fly' });
    const pose = vorKoerper('mars');
    steuerungTakt(jd, 0, umgebung(['KeyA'], pose, true));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.targetId).toBe('mars');
    expect(camera.freezeJd).toBeNull();
    const zurueck = plus(lage('mars'), {
      x: camera.distance * Math.cos(camera.elevation) * Math.cos(camera.azimuth),
      y: camera.distance * Math.cos(camera.elevation) * Math.sin(camera.azimuth),
      z: camera.distance * Math.sin(camera.elevation),
    });
    expect(laenge(minus(zurueck, pose.positionKm))).toBeLessThan(1e-3);
  });

  it('dreht mit Shift+D um 60°/s, fährt mit Shift+W je Sekunde auf die Hälfte, hebt mit Shift+E um 45°/s', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e6, azimuth: 0, elevation: 0 });
    const pose = vorKoerper('earth');
    steuerungTakt(jd, 0.5, umgebung(['KeyD'], pose, true));
    expect(useStore.getState().camera.azimuth).toBeCloseTo(Math.PI / 6, 12);
    steuerungTakt(jd, 1, umgebung(['KeyW'], pose, true));
    expect(useStore.getState().camera.distance).toBeCloseTo(5e5, 6);
    steuerungTakt(jd, 1, umgebung(['KeyE'], pose, true));
    expect(useStore.getState().camera.elevation).toBeCloseTo(Math.PI / 4, 12);
  });

  it('behält in Geheftet das Ziel, auch wenn ein anderer Körper vor der Mitte steht', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth' });
    steuerungTakt(jd, 0, umgebung(['KeyA'], vorKoerper('moon', 0), true));
    expect(useStore.getState().camera.targetId).toBe('earth');
  });

  it('macht aus Folgen Geheftet um dasselbe Ziel, ab der gezeigten Lage', () => {
    useStore.getState().setCamera({ mode: 'follow', targetId: 'jupiter' });
    const pose = vorKoerper('jupiter');
    steuerungTakt(jd, 0, umgebung(['KeyA'], pose, true));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.targetId).toBe('jupiter');
    expect(camera.distance).toBeCloseTo(laenge(minus(pose.positionKm, lage('jupiter'))), 3);
  });

  it('tut ohne Körper vor der Kamera nichts; der Flug bleibt', () => {
    for (const b of bodies) if (b.id !== 'sun') useStore.getState().toggleVisible(b.id);
    useStore.getState().setCamera({ mode: 'fly' });
    const pose: Pose = { positionKm: { x: 1e9, y: 0, z: 0 }, blick: { x: 1, y: 0, z: 0 } };
    steuerungTakt(jd, 0, umgebung(['KeyA'], pose, true));
    expect(useStore.getState().camera.mode).toBe('fly');
  });

  it('beendet mit Shift+WASD ein Kino und heftet an den Körper nächst der Mitte', () => {
    startCinema();
    steuerungTakt(jd, 0, umgebung(['KeyD'], vorKoerper('saturn'), true));
    const z = useStore.getState();
    expect(z.cinema.running).toBe(false);
    expect(z.camera.mode).toBe('attached');
    expect(z.camera.targetId).toBe('saturn');
  });

  it('kehrt beim Loslassen von Shift mit gehaltener Taste in den Flug zurück', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth' });
    steuerungTakt(jd, 0, umgebung(['KeyA'], vorKoerper('earth'), false));
    expect(useStore.getState().camera.mode).toBe('fly');
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/steuerung/anwenden.test.ts`
Expected: FAIL (mit Shift passiert noch nichts; Ausnahme: „kehrt beim Loslassen …" besteht schon).

- [ ] **Step 3: Umsetzen**

In `anwenden.ts` den Import aus `'../../render/camera/flug'` um `koerperNaechstDerMitte, kugelUm, ELEVATION_GRENZE, MIN_DISTANCE_KM` erweitern (`MAX_DISTANCE_KM` ist seit Task 6 importiert) und nach `flugStarten` einfügen:

```ts
/** Drehen mit Shift (Entwurf §4.2): A/D 60°/s, Q/E 45°/s, W/S Faktor 2 je Sekunde. */
export const DREH_AZIMUT_JE_S = Math.PI / 3;
export const DREH_ELEVATION_JE_S = Math.PI / 4;
export const ZOOM_JE_S = 2;

/**
 * Heftet die Kamera an einen Körper, mit Abstand und Winkeln der gezeigten
 * Lage (§4.2, §4.5): Die Kamera bleibt stehen, nur der Blick schwenkt.
 */
export function heftenUm(id: string, pose: Pose, jd: number): void {
  const { scale, setCamera } = useStore.getState();
  setCamera({
    mode: 'attached', targetId: id, freezeJd: null,
    ...kugelUm(pose.positionKm, scaledPositionAt(id, bodyIndex, jd, scale)),
  });
}

/**
 * Ein Bild Drehen mit Shift (§4.2). Aus Flug, Frei und Kino wird der Körper
 * nächst der Bildmitte Ziel; in Geheftet und Folgen bleibt das Ziel, das dort
 * ohnehin in der Mitte steht (ein vorbeiziehender Mond wird so nicht Ziel).
 * Folgen wird Geheftet. Ohne Körper vor der Kamera geschieht nichts.
 */
function drehen(jd: number, dt: number, absicht: Absicht, u: SteuerungUmgebung): void {
  const modus = useStore.getState().camera.mode;
  if (modus !== 'attached') {
    const pose = u.letztePose();
    if (pose === null) return;
    const neuWaehlen = modus === 'fly' || modus === 'free' || modus === 'cinema';
    // Das Kino zuerst beenden: stopCinema stellt die Kamera von vor dem Start
    // her, gewählt wird aber im gezeigten Bild.
    if (cinemaAktiv()) stopCinema();
    fahrtAbbrechen();
    const { scale, visible, camera } = useStore.getState();
    const id = neuWaehlen
      ? koerperNaechstDerMitte(pose, koerperStaende(bodies, bodyIndex, jd, scale, visible))
      : camera.targetId;
    if (id === null) return;
    heftenUm(id, pose, jd);
  }
  const { camera, setCamera } = useStore.getState();
  setCamera({
    azimuth: camera.azimuth + absicht.seit * DREH_AZIMUT_JE_S * dt,
    elevation: begrenze(
      camera.elevation + absicht.hoch * DREH_ELEVATION_JE_S * dt, -ELEVATION_GRENZE, ELEVATION_GRENZE,
    ),
    distance: begrenze(camera.distance * ZOOM_JE_S ** (-absicht.vor * dt), MIN_DISTANCE_KM, MAX_DISTANCE_KM),
  });
}
```

In `steuerungTakt` nach dem Block `if (gedrueckt && !stand.shift) { … }` einfügen:

```ts
  if (gedrueckt) {
    drehen(jd, dt, tastenAbsicht(stand.gehalten), u);
    return;
  }
```

und den JSDoc von `steuerungTakt` ergänzen: „Mit Shift dreht die Kamera um den Körper nächst der Bildmitte (§4.2)."

- [ ] **Step 4: Tests**

Run: `npx vitest run src/ui/steuerung`
Expected: PASS.

Run: `npm test`
Expected: 3753 Tests grün (3746 + 7).

- [ ] **Step 5: Commit**

```bash
git add src/ui/steuerung/anwenden.ts src/ui/steuerung/anwenden.test.ts
git commit -m "Steuerung: Shift+WASD dreht um den Körper nächst der Bildmitte"
```

---

### Task 8: Maus im Flug und Tempo-Hinweis

**Files:**
- Modify: `src/render/camera/input.ts` (Ziehen und Rad im Flug, Rückruf `onTempo`)
- Modify: `src/render/camera/input.test.ts`
- Create: `src/ui/steuerung/TempoHinweis.tsx`
- Create: `src/ui/steuerung/TempoHinweis.test.tsx`
- Modify: `src/app/main.tsx` (`onTempo`, `<TempoHinweis />`)
- Modify: `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` (`fly.tempo`)

**Interfaces:**
- Consumes: `blickDrehen` (Task 3), `tempoAendern`, `tempoAbonnieren`, `TEMPO_START` (Task 6).
- Produces: `EingabeRueckrufe.onTempo?: (faktor: number) => void`; `export const TEMPO_JE_RASTE = 1.25` in `input.ts`; `TempoHinweis`, `HINWEIS_MS = 1500`.

- [ ] **Step 1: Failing tests schreiben**

In `src/render/camera/input.test.ts` anhängen:

```ts
describe('attachCameraInput — Flug', () => {
  const imFlug = (): void => {
    useStore.getState().setCamera({ mode: 'fly', fly: { ...DEFAULT_STATE.camera.fly, yaw: 0, pitch: 0 } });
  };

  it('schaut im Flug beim Ziehen um; der Himmel folgt der Hand', () => {
    imFlug();
    const el = flaeche();
    const stop = attachCameraInput(el);
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 120, 90);
    const { camera } = useStore.getState();
    // Nach rechts gezogen: Blick nach links (yaw wächst); nach oben: Blick sinkt.
    expect(camera.fly.yaw).toBeCloseTo(20 * DREH, 12);
    expect(camera.fly.pitch).toBeCloseTo(-10 * DREH, 12);
    expect(camera.azimuth).toBe(azimut);
    zeiger(el, 'pointerup', 120, 90);
    stop();
  });

  it('ändert im Flug mit dem Rad das Tempo statt des Abstands', () => {
    imFlug();
    const el = flaeche();
    const onTempo = vi.fn();
    const stop = attachCameraInput(el, { onTempo });
    const abstand = useStore.getState().camera.distance;
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }));
    expect(onTempo.mock.calls[0]![0]).toBeCloseTo(1 / 1.25, 12);
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: -200, cancelable: true }));
    expect(onTempo.mock.calls[1]![0]).toBeCloseTo(1.25 ** 2, 12);
    expect(useStore.getState().camera.distance).toBe(abstand);
    stop();
  });

  it('zoomt außerhalb des Flugs wie bisher', () => {
    const el = flaeche();
    const onTempo = vi.fn();
    const stop = attachCameraInput(el, { onTempo });
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }));
    expect(onTempo).not.toHaveBeenCalled();
    expect(useStore.getState().camera.distance).toBeCloseTo(DEFAULT_STATE.camera.distance * 1.1, 0);
    stop();
  });
});
```

`src/ui/steuerung/TempoHinweis.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TempoHinweis, HINWEIS_MS } from './TempoHinweis';
import { tempoAendern, tempoZuruecksetzen } from './anwenden';

afterEach(() => {
  vi.useRealTimers();
  tempoZuruecksetzen();
});

describe('TempoHinweis', () => {
  it('zeigt den Tempofaktor relativ zum Start und blendet nach 1,5 s aus', () => {
    vi.useFakeTimers();
    render(<TempoHinweis />);
    expect(screen.queryByRole('status')).toBeNull();
    act(() => { tempoAendern(1.25); });
    expect(screen.getByRole('status').textContent).toBe('Tempo ×1,25');
    act(() => { vi.advanceTimersByTime(HINWEIS_MS - 1); });
    expect(screen.queryByRole('status')).not.toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByRole('status')).toBeNull();
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/render/camera/input.test.ts src/ui/steuerung/TempoHinweis.test.tsx`
Expected: FAIL.

- [ ] **Step 3: `input.ts`**

Import auf `import { ELEVATION_GRENZE, MIN_DISTANCE_KM, MAX_DISTANCE_KM, blickDrehen } from './flug';` erweitern; nach `DREH_PRO_PIXEL`:

```ts
/** Radstufe des Tempofaktors im Flug (Entwurf Flug und Controller §3.4). */
export const TEMPO_JE_RASTE = 1.25;
```

`drehe` beginnt mit:

```ts
  const { camera, setCamera } = useStore.getState();
  if (camera.mode === 'fly') {
    // Im Flug schaut Ziehen um (Entwurf Flug und Controller §4.3). Der Himmel
    // folgt der Hand wie in Stellarium: nach rechts gezogen dreht der Blick
    // nach links, nach oben gezogen senkt er sich.
    setCamera({ fly: { ...camera.fly, ...blickDrehen(camera.fly, dx * DREH_PRO_PIXEL, dy * DREH_PRO_PIXEL) } });
    return;
  }
```

(die bisherige erste Zeile `const { camera, setCamera } = useStore.getState();` entfällt dafür). In `EingabeRueckrufe`:

```ts
  /** Rad im Flug: Faktor auf das Flugtempo statt Zoom (Entwurf Flug und Controller §4.3). */
  onTempo?: (faktor: number) => void;
```

`onWheel`:

```ts
  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    // deltaMode 1 zählt Zeilen statt Pixel (Firefox) — auf Pixel normieren.
    const schritte = (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / 100;
    if (useStore.getState().camera.mode === 'fly') {
      // Eine Raste nach unten (beim Zoom „weiter weg") verlangsamt.
      rueckrufe.onTempo?.(TEMPO_JE_RASTE ** -schritte);
      return;
    }
    zoome(1.1 ** schritte);
  };
```

- [ ] **Step 4: `TempoHinweis.tsx` und Texte**

`src/ui/steuerung/TempoHinweis.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { tempoAbonnieren, TEMPO_START } from './anwenden';
import { t } from '../i18n';
import { formatZahl } from '../format';

/** Dauer der Einblendung (Entwurf Flug und Controller §4.3). */
export const HINWEIS_MS = 1500;

/**
 * Kurze Einblendung des Flugtempos nach einer Radbewegung, unten in der Mitte.
 * Angezeigt wird der Faktor relativ zum Start (×1 = Startwert), damit die Zahl
 * ohne Kenntnis des Geschwindigkeitsgesetzes lesbar ist.
 */
export function TempoHinweis(): React.JSX.Element | null {
  const [wert, setWert] = useState<number | null>(null);

  useEffect(() => {
    let uhr = 0;
    const abbestellen = tempoAbonnieren((neu) => {
      setWert(neu);
      window.clearTimeout(uhr);
      uhr = window.setTimeout(() => { setWert(null); }, HINWEIS_MS);
    });
    return () => {
      abbestellen();
      window.clearTimeout(uhr);
    };
  }, []);

  if (wert === null) return null;
  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded bg-black/60 px-3 py-1 text-sm text-slate-100"
    >
      {t('fly.tempo')} ×{formatZahl(wert / TEMPO_START)}
    </div>
  );
}
```

`src/ui/i18n/de.ts`, vor `} as const;`: `'fly.tempo': 'Tempo',`
`src/ui/i18n/en.ts`, vor `};`: `'fly.tempo': 'Speed',`

- [ ] **Step 5: Verdrahtung in `src/app/main.tsx`**

Importe: `import { steuerungTakt, tempoAendern } from '../ui/steuerung/anwenden';` (bestehende Zeile erweitern) und `import { TempoHinweis } from '../ui/steuerung/TempoHinweis';`. In `attachCameraInput(canvas, { … })` ergänzen:

```ts
      // Im Flug regelt das Rad das Tempo (Entwurf Flug und Controller §4.3).
      onTempo: (faktor) => { tempoAendern(faktor); },
```

Im JSX nach `<Bedienoberflaeche />`:

```tsx
      {/* Außerhalb der Bedienoberfläche: bleibt sichtbar, wenn H sie ausblendet. */}
      <TempoHinweis />
```

- [ ] **Step 6: Tests**

Run: `npx vitest run src/render/camera src/ui/steuerung src/ui/i18n && npx tsc -b`
Expected: PASS, tsc ohne Ausgabe.

Run: `npm test`
Expected: 3757 Tests grün (3753 + 4).

- [ ] **Step 7: Commit**

```bash
git add src/render/camera/input.ts src/render/camera/input.test.ts src/ui/steuerung/TempoHinweis.tsx src/ui/steuerung/TempoHinweis.test.tsx src/app/main.tsx src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Flug: Umschauen mit der Maus, Tempo mit dem Rad samt Einblendung"
```

---

### Task 9: Kamerafahrt aus dem Flug, Kamera-Panel, Kürzelübersicht

**Files:**
- Modify: `src/ui/kamerafahrt.ts` (`FahrtOptionen.pose`, Start an der gezeigten Lage)
- Modify: `src/ui/kamerafahrt.test.ts`
- Modify: `src/ui/panels/CameraPanel.tsx`
- Modify: `src/ui/panels/CameraPanel.test.tsx`
- Modify: `src/ui/App.tsx` (`KUERZEL`)
- Modify: `src/ui/App.test.tsx`
- Modify: `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`

**Interfaces:**
- Consumes: `letztePose` (Task 4), `kugelUm`, `laenge`, `minus`, `Pose` (Task 2/3), `flugStarten` (Task 6), `heftenUm` (Task 7).
- Produces: `FahrtOptionen.pose?: () => Pose | null`.

- [ ] **Step 1: Failing tests schreiben**

`src/ui/kamerafahrt.test.ts`: Importe um `import { scaledPositionAt } from '../sim/scale';`, `import { plus } from '../render/camera/flug';` und `import type { Pose } from '../render/camera/flug';` ergänzen, anhängen:

```ts
describe('Fahrt aus dem Flug', () => {
  it('beginnt an der gezeigten Lage statt beim Kugelabstand von vor dem Flug', () => {
    const p = planer();
    const { time, scale } = useStore.getState();
    const mars = scaledPositionAt('mars', bodyIndex, time.jd, scale);
    const pose: Pose = { positionKm: plus(mars, { x: 0, y: 3e6, z: 0 }), blick: { x: 0, y: -1, z: 0 } };
    useStore.getState().setCamera({ mode: 'fly', distance: 1e9 });
    fahreZu('mars', { ...p.optionen, pose: () => pose });
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.distance).toBeCloseTo(3e6, 3);
    expect(camera.azimuth).toBeCloseTo(Math.PI / 2, 9);
    expect(camera.elevation).toBeCloseTo(0, 9);
    for (let i = 0; i < 6; i += 1) p.vor(FAHRT_MS / 5);
    expect(useStore.getState().camera.distance).toBeCloseTo(fokusAbstand(bodyIndex.mars!, scale), 6);
  });

  it('beginnt auch die Draufsicht aus dem Flug an der gezeigten Lage', () => {
    const p = planer();
    const pose: Pose = { positionKm: { x: 2e8, y: 0, z: 0 }, blick: { x: -1, y: 0, z: 0 } };
    useStore.getState().setCamera({ mode: 'fly', distance: 1e12 });
    fahreZuSystem({ ...p.optionen, pose: () => pose });
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(useStore.getState().camera.distance).toBeCloseTo(2e8, 0);
  });
});
```

`src/ui/panels/CameraPanel.test.tsx`: Importe ergänzen

```tsx
import * as THREE from 'three';
import { createCameraController, letztePose } from '../../render/camera/controller';
import { laenge } from '../../render/camera/flug';
import { formatZahl } from '../format';
import { t } from '../i18n';

/** Ein gerechnetes Bild, damit letztePose() eine gezeigte Lage kennt. */
function einBild(): void {
  const c = createCameraController(new THREE.PerspectiveCamera(50, 1, 0.001, 1e12));
  const s = useStore.getState();
  c.update(s, s.time.jd, 1 / 60, s.scale);
}
```

und im `describe('CameraPanel', …)` anhängen:

```tsx
  it('bietet den Flug an und startet ihn an der gezeigten Lage', () => {
    einBild();
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Flug' }));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    expect(camera.fly.refId).toBe('sun');
  });

  it('beendet den Flug über die Blickwinkel in Geheftet um das Ziel', () => {
    einBild();
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Flug' }));
    fireEvent.click(screen.getByRole('button', { name: /Draufsicht/ }));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.targetId).toBe('sun');
    expect(camera.elevation).toBeCloseTo(Math.PI / 2, 3);
  });

  it('zeigt im Flug den Abstand der gezeigten Lage zum Ziel', () => {
    einBild();
    const pose = letztePose()!;
    useStore.getState().setCamera({ distance: 5e9 });
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Flug' }));
    // Ziel ist die Sonne im Ursprung.
    expect(screen.getByText(`${formatZahl(laenge(pose.positionKm) / 1e6)} ${t('unit.millionKm')}`)).toBeTruthy();
  });
```

`src/ui/App.test.tsx`: `screen` zum Import aus `@testing-library/react` nehmen und anhängen:

```tsx
  it('nennt in der Kürzelübersicht den Flug', () => {
    useStore.getState().setUi({ panels: { ...DEFAULT_STATE.ui.panels, shortcuts: true } });
    render(<App />);
    expect(screen.getByText('W A S D')).toBeTruthy();
    expect(screen.getByText('Shift + W A S D')).toBeTruthy();
  });
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/kamerafahrt.test.ts src/ui/panels/CameraPanel.test.tsx src/ui/App.test.tsx`
Expected: FAIL.

- [ ] **Step 3: `kamerafahrt.ts`**

Importe ergänzen:

```ts
import { scaledPositionAt } from '../sim/scale';
import { letztePose } from '../render/camera/controller';
import { kugelUm } from '../render/camera/flug';
import type { Pose } from '../render/camera/flug';
```

In `FahrtOptionen`:

```ts
  /** Gezeigte Lage, an der eine Fahrt aus dem Flug beginnt; Standard letztePose(). */
  pose?: () => Pose | null;
```

In `fahre` den Block ab `const { camera, scale, time } = useStore.getState();` bis einschließlich `useStore.setState(…)` ersetzen durch:

```ts
  const { camera, scale, time } = useStore.getState();
  // Aus dem Flug gelten Abstand und Winkel der gezeigten Lage relativ zum
  // neuen Ziel; camera.distance stammt dort von vor dem Flug (Entwurf Flug und
  // Controller §4.5). Sonst beginnt die Fahrt wie bisher bei den Kugelwerten.
  const pose = camera.mode === 'fly' ? (optionen.pose ?? letztePose)() : null;
  const start = pose === null
    ? { distance: camera.distance, azimuth: camera.azimuth, elevation: camera.elevation }
    : kugelUm(pose.positionKm, scaledPositionAt(id, bodyIndex, time.jd, scale));
  const von = start.distance;
  const nach = zielAbstand(time.jd, scale);
  const elevationVon = start.elevation;
  // Jede Fahrt endet geheftet: Im freien Modus zielte sie auf die eingefrorene
  // Stelle, von der der Körper bei laufender Uhr schon wegzog (Entwurf
  // Klickflächen §6, Entscheidung Jens 15.09.2026).
  // Ziel und Thema in einem Zug: Der Themenverfall verwirft ein Thema nur, wenn
  // die Grundlage wechselt und das Thema dabei gleich bleibt (ui/info/themaVerfall.ts).
  useStore.setState((s) => ({
    camera: {
      ...s.camera, targetId: id, mode: 'attached', freezeJd: null,
      distance: von, azimuth: start.azimuth, elevation: elevationVon,
    },
    ui: { ...s.ui, info: { ...s.ui.info, thema } },
  }));
```

- [ ] **Step 4: `CameraPanel.tsx`**

Importe ergänzen:

```tsx
import type { AppState } from '../../store/types';
import { bodyIndex } from '../../data';
import { scaledPositionAt } from '../../sim/scale';
import { letztePose } from '../../render/camera/controller';
import { laenge, minus } from '../../render/camera/flug';
import { flugStarten, heftenUm } from '../steuerung/anwenden';
```

`MODI` um `'fly'` erweitern:

```tsx
const MODI: readonly CameraMode[] = ['free', 'attached', 'follow', 'fly', 'cinema'];
```

Vor `export function CameraPanel`:

```tsx
/**
 * Im Flug wirken Modus-Schaltflächen, Abstandsregler und Blickwinkel auf das
 * Ziel: Sie beenden den Flug an der gezeigten Lage, geheftet um targetId
 * (Entwurf Flug und Controller §4.5), und setzen dann ihren Wert.
 */
function setzeUmlauf(patch: Partial<AppState['camera']>): void {
  const { camera, time, setCamera } = useStore.getState();
  if (camera.mode === 'fly') {
    const pose = letztePose();
    if (pose !== null) heftenUm(camera.targetId, pose, time.jd);
  }
  setCamera(patch);
}

/** Angezeigter Abstand: im Flug der gezeigten Lage zum Ziel, sonst der Kugelabstand. */
function anzeigeAbstand(camera: AppState['camera']): number {
  const pose = camera.mode === 'fly' ? letztePose() : null;
  if (pose === null) return camera.distance;
  const { time, scale } = useStore.getState();
  return laenge(minus(pose.positionKm, scaledPositionAt(camera.targetId, bodyIndex, time.jd, scale)));
}
```

In `CameraPanel` nach `const abstandId = useId();`: `const abstand = anzeigeAbstand(camera);`. Den `onClick` der Modus-Schaltflächen ersetzen durch:

```tsx
              onClick={() => {
                if (modus === 'fly') {
                  // Der Flug beginnt an der gezeigten Lage, wie mit W (§4.5).
                  const pose = letztePose();
                  if (pose !== null) flugStarten(pose, useStore.getState().time.jd);
                  return;
                }
                // Beim Wechsel in den freien Modus wird der Bezugspunkt auf
                // die aktuelle Position des Ziels festgelegt; die beiden
                // mitführenden Modi brauchen keinen.
                setzeUmlauf({
                  mode: modus,
                  freezeJd: modus === 'free' ? useStore.getState().time.jd : null,
                });
              }}
```

Anzeige und Regler: `abstandText(camera.distance)` → `abstandText(abstand)`, `value={abstandZuRegler(camera.distance)}` → `value={abstandZuRegler(abstand)}`, `onChange={(e) => { setCamera({ distance: … }); }}` → `onChange={(e) => { setzeUmlauf({ distance: reglerZuAbstand(Number(e.target.value)) }); }}`. Blickwinkel: `onClick={() => { setzeUmlauf({ azimuth, elevation }); }}`. Wird `setCamera` im Panel danach nicht mehr gebraucht, die Zeile `const setCamera = useStore((s) => s.setCamera);` entfernen (sonst meldet tsc `noUnusedLocals`).

- [ ] **Step 5: Kürzelübersicht und Texte**

`src/ui/App.tsx`, `KUERZEL` nach der Zeile `[{ key: 'key.home' }, 'shortcuts.resetCamera'],`:

```ts
  ['W A S D', 'shortcuts.fly'],
  ['Q E', 'shortcuts.flyUpDown'],
  ['Shift + W A S D', 'shortcuts.orbit'],
  [{ key: 'key.drag' }, 'shortcuts.flyLook'],
  [{ key: 'key.wheel' }, 'shortcuts.flySpeed'],
```

`src/ui/i18n/de.ts`, vor `} as const;`:

```ts
  'camera.mode.fly': 'Flug',
  'shortcuts.fly': 'Fliegen: vor, links, zurück, rechts',
  'shortcuts.flyUpDown': 'Im Flug sinken und steigen',
  'shortcuts.orbit': 'Um den Körper in der Bildmitte drehen; mit Q und E senken und heben',
  'shortcuts.flyLook': 'Im Flug umschauen',
  'shortcuts.flySpeed': 'Im Flug die Geschwindigkeit ändern',
  'key.drag': 'Ziehen',
  'key.wheel': 'Mausrad',
```

`src/ui/i18n/en.ts`, vor `};`:

```ts
  'camera.mode.fly': 'Fly',
  'shortcuts.fly': 'Fly: forward, left, back, right',
  'shortcuts.flyUpDown': 'Descend and climb while flying',
  'shortcuts.orbit': 'Orbit the body nearest the centre; Q and E lower and raise',
  'shortcuts.flyLook': 'Look around while flying',
  'shortcuts.flySpeed': 'Change the flight speed',
  'key.drag': 'Drag',
  'key.wheel': 'Mouse wheel',
```

- [ ] **Step 6: Tests**

Run: `npx vitest run src/ui && npx tsc -b`
Expected: PASS (auch `i18n.test.ts`: gleiche Schlüssel, übersetzt), tsc ohne Ausgabe.

Run: `npm test`
Expected: 3763 Tests grün (3757 + 6).

- [ ] **Step 7: Commit**

```bash
git add src/ui/kamerafahrt.ts src/ui/kamerafahrt.test.ts src/ui/panels/CameraPanel.tsx src/ui/panels/CameraPanel.test.tsx src/ui/App.tsx src/ui/App.test.tsx src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Flug: Kamerafahrt und Kamera-Panel beginnen an der gezeigten Lage, Kürzelübersicht"
```

---

### Task 10: Abnahme

**Files:**
- Create: `docs/flug-etappe1-abnahme.md`
- Nur lokal, nicht committen: Screenshots und Skripte unter `.playwright-mcp/`

- [ ] **Step 1: Prüfläufe**

```bash
npm run lint
npm test
npm run build
```

Expected: Lint ohne Befund; 3763 Tests grün; Build erfolgreich (nur der bekannte Chunkgrößen-Hinweis).

- [ ] **Step 2: Vorbereitung im Browser**

Server prüfen (200), `browser_navigate` auf `http://localhost:5173/Orrery/`, sofort `window.store.setState({ quality: { tier: 'high' } })`. Fenster wie bei früheren Abnahmen (2560×1440-Monitor, Viewport notieren). Für die Messungen 1, 3, 4: `setUi({ hidden: true })`, `setCinema({ running: false, pauseOnInput: false })`, `setTime({ paused: true })`. Vor jedem Screenshot 3 s warten (per `performance.now()` in der Seite) und prüfen, dass `window.renderer.info.memory.textures` sich nicht mehr ändert. Tasten mit `browser_run_code_unsafe` über `page.keyboard.down('KeyW')` / `page.keyboard.up('KeyW')` halten; Zeiten in der Seite mit `performance.now()` messen. Pixel mit Python 3.12 (Pillow, numpy) auswerten: Scheibe = zusammenhängende Pixel mit Helligkeit > 8 um die jeweils hellste Stelle nahe der erwarteten Lage.

- [ ] **Step 3: Messung 1 – Flug mit W**

`setCamera({ mode: 'attached', targetId: 'earth', distance: 10 * R })` mit R = dargestellter Erdradius (`import('/Orrery/src/sim/scale.ts')` und `import('/Orrery/src/data/index.ts')` in `browser_evaluate`). Einschwingen lassen, Screenshot A, Abstand dA = |`letztePose().positionKm` − Erde|. `KeyW` 1000 ms halten, loslassen, 3 s warten, Screenshot B, dB. Kriterium: Scheibendurchmesser B/A liegt innerhalb ±10 % von asin(R/dB)/asin(R/dA); `camera.mode` = `'fly'`, `fly.refId` = `'earth'`, `targetId` = `'earth'`.

- [ ] **Step 4: Messung 2 – Mitführung bei laufender Uhr**

Saturnradius R wie oben. `setCamera({ mode: 'fly', fly: { refId: 'saturn', x: 8 * R, y: 0, z: 2 * R, yaw: Math.PI, pitch: -Math.asin(2 / Math.hypot(8, 2)) } })`, `setTime({ paused: false, rateDaysPerSec: 10 })`. Screenshot bei t0 und t0 + 5 s (gemessen). Kriterium: Schwerpunkt der Saturnscheibe verschiebt sich um höchstens 3 px. Gegenprobe: `setCamera({ mode: 'free', targetId: 'saturn', distance: Math.hypot(8, 2) * R, freezeJd: <aktuelles jd> })`, dieselbe Messung: Saturn wandert um ein Vielfaches (Wert notieren). Danach `setTime({ paused: true })`.

- [ ] **Step 5: Messung 3 – Bezugswechsel ohne Sprung**

Fluglage bei der Erde mit Blick auf den Mond (Blickvektor aus den dargestellten Lagen von Erde und Mond, 5 Erdradien von der Erde entfernt Richtung Mond). In der Seite eine `requestAnimationFrame`-Schleife starten, die je Bild `letztePose().positionKm` und `store.getState().camera.fly.refId` aufzeichnet. `KeyW` halten, bis `refId` = `'moon'` (höchstens 20 s), loslassen, Schleife beenden. Schrittweiten je Bild berechnen; Kriterium: Der Schritt im Wechselbild ist höchstens 1,5-mal so groß wie der größte der drei Schritte davor und danach.

- [ ] **Step 6: Messung 4 – Shift+A**

`setCamera({ mode: 'fly', fly: … })` so, dass Jupiter rund 150 px neben der Bildmitte steht (Blick 0,1 rad an Jupiter vorbei, Abstand 20 Jupiterradien). `Shift` und `KeyA` 150 ms halten, loslassen. Nach 3 s Screenshot: Schwerpunkt der Jupiterscheibe höchstens 2 px von der Bildmitte; `targetId` = `'jupiter'`, `mode` = `'attached'`. Dann `setUi({ hidden: false })` und per `browser_snapshot` prüfen, dass der Kopf des Infopanels „Jupiter" zeigt. (Entwurf §9 Punkt 4 nennt 1 s; bei 0,45 s Dämpfung bleiben nach 1 s noch rund 6 % des Anfangsversatzes, deshalb 3 s wie bei den Klickflächen.)

- [ ] **Step 7: Messung 5 – Kino und Maus**

Mit Standard-`pauseOnInput` (vorher `setCinema({ pauseOnInput: true })`, Oberfläche sichtbar, Uhr laufend): nach 3 s Ruhe echte Taste `c` (Kino startet), 5 s warten, `letztePose`-Aufzeichnung starten, `KeyW` 300 ms. Kriterium: `cinema.running` = false, `camera.mode` = `'fly'`, `time.rateDaysPerSec` wieder wie vor dem Kino, größter Schritt der gezeigten Lage in den fünf Bildern um den Wechsel nicht größer als der größte Flugschritt danach. Danach im Flug mit `page.mouse` auf freier Fläche 100 px nach rechts ziehen: `camera.fly.yaw` wächst um 100·π/600 (±1 %). Rad eine Raste nach oben: Element mit `role="status"` zeigt „Tempo ×1,25".

- [ ] **Step 8: Messung 6 – Kosten**

Eigener `requestAnimationFrame`-Zähler je 5 s: (a) Geheftet an der Erde ohne Eingabe, (b) Flug mit gehaltenem `KeyW`. Mittlerer und größter Bildabstand je Fall. Kriterium: Mittelwert (b) höchstens 0,5 ms über (a), kein Bildabstand über 25 ms.

- [ ] **Step 9: Protokoll `docs/flug-etappe1-abnahme.md`**

```md
# Abnahme Flug Etappe 1 (Flug mit Tastatur und Maus)

## 1. Umfang
(Commits mit Kurzhash und Titel, Branch, Plan, Entwurf; was Etappe 1 liefert, in drei Sätzen)

## 2. Lint, Tests, Build
(Schlusszeilen; Testzahl 3692 → 3763 mit Herleitung je Task)

## 3. Sichtprüfung
(Messungen 1 bis 6 als Tabelle: Kriterium, Messwert, erfüllt; Viewport, Stufe, jd)

## 4. Rulings
(Plan-Rulings unten übernehmen, dazu die der Umsetzung, jeweils „Ruling:" am Anfang)

## 5. Bekannte Unschärfen

## 6. Fragen an Jens
```

Screenshots und Skripte unter `.playwright-mcp/` löschen; `git status --short` zeigt nur das Protokoll.

- [ ] **Step 10: Commit**

```bash
git add docs/flug-etappe1-abnahme.md
git commit -m "Abnahme Flug Etappe 1"
```

---

## Plan-Rulings

Entscheidungen beim Schreiben dieses Plans, von Jens noch nicht bestätigt:

1. Ruling: `letztePose()` ist eine Modulfunktion des Controllers statt eines Rückrufs aus `app/main.tsx` (Entwurf §6.1 „über Rückrufe"): `fahreZu` hat viele Aufrufer (Objektbaum, Verweise, Klick). `steuerungTakt` bekommt sie trotzdem als Parameter, damit die Tests eine Lage vorgeben können.
2. Ruling: `ELEVATION_GRENZE`, `MIN_DISTANCE_KM` und `MAX_DISTANCE_KM` ziehen von `input.ts` nach `flug.ts`; sonst importierten sich `input.ts` und `flug.ts` gegenseitig.
3. Ruling: Im Flug belichtet die Kamera auf den Bezugskörper statt auf das Ziel (`exposureTargetId`); sonst wäre ein Flug zum Saturn mit dem Ziel Sonne falsch belichtet. Der Entwurf sagt dazu nichts.
4. Ruling: `targetFor` bleibt bei den Umlauf- und Kinomodi; der Flug hat einen eigenen Zweig in `update`.
5. Ruling: Der Tempo-Hinweis zeigt den Faktor relativ zum Start (×1 = 0,5), nicht f selbst.
6. Ruling: Der Tempo-Hinweis hängt in `app/main.tsx` neben der Bedienoberfläche und bleibt sichtbar, wenn H sie ausblendet.
7. Ruling: Eine gehaltene Flugtaste startet den Flug auch dann, wenn sich W und S aufheben; bewegt wird dann nicht.
8. Ruling: Das Kamera-Panel zeigt im Flug den Abstand der gezeigten Lage zum Ziel. Auch die Modus-Schaltflächen (nicht nur Regler und Blickwinkel, Entwurf §4.5) beginnen aus dem Flug an der gezeigten Lage.
9. Ruling: Der Eintritt in den Flug lässt `freezeJd` unverändert (es wirkt nur im Modus Frei).
10. Ruling: Die Tastenbeschriftungen „W A S D", „Q E" und „Shift + W A S D" stehen als Literale in beiden Sprachen.
11. Ruling: Eine Radraste nach unten (`deltaY` > 0, beim Zoom „weiter weg") verlangsamt.
12. Ruling: `flugNachfuehren` schreibt den Store nur bei Bewegung, Mindesthöhe oder Bezugswechsel, damit keine Rundungsreste je Bild in den Store wandern.
13. Ruling: Shift ohne Körper vor der Kamera tut nichts, der Flug bleibt.
14. Ruling: Der Flugzweig des Controllers nimmt im allerersten Bild (noch keine gezeigte Lage) die Lage aus dem Store, damit ein Link im Flugmodus dort beginnt.
15. Ruling: Abnahme Punkt 4 misst nach 3 s statt 1 s (Entwurf §9): Bei 0,45 s Dämpfung stehen nach 1 s noch rund 6 % des Anfangsversatzes aus.
16. Ruling: `fahre` setzt Abstand, Azimut und Elevation schon beim Start in den Store (bisher erst im ersten Schritt); ohne Flug sind das die bisherigen Werte.

## Hinweise für die Umsetzung

- Reihenfolge strikt 1 → 10; Task 7 baut auf Task 6 auf, Task 9 auf 4, 6 und 7.
- Modelle: Tasks 1 bis 9 sind vollständig ausgeschrieben (Umsetzer sonnet), Task 10 Browser und Protokoll (sonnet). Reviews sonnet; Schlussprüfung der Etappe opus.
- Soll-Testzahlen: 3696, 3708, 3719, 3725, 3734, 3746, 3753, 3757, 3763, 3763.
- Etappe 2 (Controller und Fadenkreuz) bekommt einen eigenen Plan erst nach der Abnahme dieser Etappe.
