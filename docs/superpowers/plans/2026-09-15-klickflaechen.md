# Klickflächen Implementierungsplan

> **Für ausführende Agenten:** Pflicht-Skill superpowers:subagent-driven-development
> (empfohlen) oder superpowers:executing-plans, Task für Task. Schritte mit
> Checkbox (`- [ ]`).

**Ziel:** Klick oder Tipp auf Körper, Namen oder Bahn im 3D-Bild fährt die Kamera
dorthin; jede Kamerafahrt endet im Modus „Geheftet".

**Architektur:** Reine Trefferprüfung in Bildschirmpixeln (`render/treffer.ts`). Das
Overlay liefert Scheiben und Namensrechtecke, die Szene projiziert die Bahnpuffer und
prüft je Bild den Zeiger, die Eingabe unterscheidet Tippen von Ziehen, `app/main.tsx`
verdrahtet Treffer mit `fahreZu`.

**Tech Stack:** TypeScript, Three.js, React, Zustand, Vitest (jsdom je Datei), Vite.

**Entwurf:** `docs/superpowers/specs/2026-09-15-klickflaechen-design.md`

## Globale Vorgaben

- Alles auf Deutsch (Kommentare, Commits, Doku), Umlaute korrekt; Bezeichner bleiben.
- Commits allein von Jens Fricke (`rtf22@jensfricke.com`), keine Trailer.
  Trailer-Prüfung nach der lokalen Projektanleitung nach jedem Commit.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `render/` importiert nie `ui/`
  oder `store/` zur Laufzeit (Typimporte aus `store/types` wie bisher erlaubt);
  `app/` verbindet.
- Branch `klickflaechen`, Abschluss per Fast-Forward nach `master`, Branch löschen.
- Vor jedem Commit: `npm run lint`, `npm test` grün; vor Abschluss zusätzlich
  `npm run build`.
- Fangradius Maus 8 px, Finger 20 px; Tippschwelle Maus 4 px, Finger 10 px;
  Bahndeckkraft 0,45, hervorgehoben 0,9.
- Dämpfung (0,45 s) bleibt unverändert (Jens, 15.09.2026).
- Browser: Port 5173 läuft meist schon (`/Orrery/`), keinen zweiten Server starten.
  Playwright-Dateien vor dem Commit löschen, nur gezielt `git add`.

---

### Task 1: Kamerafahrt heftet an, Kino auch angehalten beenden

**Dateien:**
- Ändern: `src/ui/kamerafahrt.ts` (Import, `fahre`)
- Test: `src/ui/kamerafahrt.test.ts`, `src/ui/panels/BodyTree.test.tsx`

**Schnittstellen:** unverändert (`fahreZu(id, optionen?)`, `fahreZuSystem(optionen?)`);
danach gilt: `camera.mode === 'attached'`, `camera.freezeJd === null`.

- [ ] **Schritt 1: Branch und Vorher-Belege (Entwurf §9.1)**

`git switch -c klickflaechen`. Im Browser (`http://localhost:5173/Orrery/`, nach dem
Laden `window.store.setState({ quality: { tier: 'high' } })`), per
`browser_evaluate`:

```js
async () => {
  const s = window.store.getState();
  const warte = (ms) => new Promise((r) => { const t0 = performance.now(); const f = () => (performance.now() - t0 >= ms ? r() : requestAnimationFrame(f)); f(); });
  const lage = (name) => { const w = [...document.querySelectorAll('.koerper-label')].find((x) => !x.hidden && x.querySelector('.koerper-name')?.textContent === name); const m = /translate\(([-\d.e]+)px, ([-\d.e]+)px\)/.exec(w?.style.transform ?? ''); return m ? { x: +m[1], y: +m[2] } : null; };
  const knopf = (name) => [...document.querySelectorAll('button')].find((b) => b.textContent === name);
  s.setCinema({ running: false, pauseOnInput: false });
  s.setCamera({ mode: 'free', targetId: 'sun', freezeJd: null });
  s.setTime({ paused: false, rateDaysPerSec: 365 });
  await warte(2000);
  knopf('Erde').click();
  const ov = document.querySelector('.label-overlay');
  const mitte = { x: ov.clientWidth / 2, y: ov.clientHeight / 2 };
  const reihe = [];
  for (const ms of [1500, 500, 1000]) { await warte(ms); const p = lage('Erde'); reihe.push(p && Math.hypot(p.x - mitte.x, p.y - mitte.y)); }
  const a = { abstandPx_1_5s_2s_3s: reihe, modus: window.store.getState().camera.mode };
  s.setTime({ paused: true });
  s.setCamera({ mode: 'free', targetId: 'sun', freezeJd: null });
  s.setCinema({ running: true, pauseOnInput: true, idleResumeSec: 2 });
  s.setCamera({ mode: 'cinema' });
  await warte(500);
  window.dispatchEvent(new Event('pointerdown'));
  knopf('Mars').click();
  await warte(3500);
  const b = { modus: window.store.getState().camera.mode, laeuft: window.store.getState().cinema.running };
  window.store.getState().setCinema({ running: false });
  return { a, b };
}
```

Ergebnis ins Ledger (Ende dieses Plans). Erwartet heute: `a.modus` `free`, Abstände
wachsen; `b.modus` `cinema`, `b.laeuft` `true`. `null` bei `lage` heißt: Erde außerhalb
des Bildes (auch ein Beleg). `idleResumeSec` danach nicht zurücksetzen nötig, die Seite
wird in Task 7 neu geladen.

- [ ] **Schritt 2: Tests umstellen und ergänzen (rot)**

In `src/ui/kamerafahrt.test.ts`:

Import ergänzen:
```ts
import { noteUserInput, resumeIfIdle } from './cinemaControl';
```

Zeile 43 `expect(s.camera.freezeJd).toBe(s.time.jd);` ersetzen durch:
```ts
    expect(s.camera.mode).toBe('attached');
    expect(s.camera.freezeJd).toBeNull();
```
Zeile 74 `expect(useStore.getState().camera.mode).toBe('free');` →
`expect(useStore.getState().camera.mode).toBe('attached');`
Zeile 127 `expect(s.camera.freezeJd).toBe(s.time.jd);` ersetzen durch:
```ts
    expect(s.camera.mode).toBe('attached');
    expect(s.camera.freezeJd).toBeNull();
```

Im `describe('fahreZu')` anhängen:
```ts
  it('heftet auch aus der Verfolgung an', () => {
    useStore.getState().setCamera({ mode: 'follow', freezeJd: 2451000 });
    fahreZu('mars', planer().optionen);
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.freezeJd).toBeNull();
  });

  it('beendet ein durch Eingabe angehaltenes Kino, das danach nicht wieder anläuft', () => {
    useStore.getState().setCinema({ running: true, pauseOnInput: true });
    useStore.getState().setCamera({ mode: 'cinema' });
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
    fahreZu('mars', planer().optionen);
    expect(useStore.getState().camera.mode).toBe('attached');
    expect(useStore.getState().camera.targetId).toBe('mars');
    resumeIfIdle(Date.now() + 1e9);
    expect(useStore.getState().cinema.running).toBe(false);
  });
```

In `src/ui/panels/BodyTree.test.tsx` den Test „friert im freien Modus den Bezugspunkt
auf die aktuelle Zeit ein" (Zeilen 98–107) ersetzen durch:
```tsx
  it('heftet beim Klick aus dem freien Modus an', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByText('Saturn'));
    const { camera } = useStore.getState();
    // Jede Kamerafahrt endet geheftet (Entwurf Klickflächen §6): Der Körper
    // bleibt dort, wo die Kamera ankommt.
    expect(camera.mode).toBe('attached');
    expect(camera.freezeJd).toBeNull();
  });
```

- [ ] **Schritt 3: Rot bestätigen**

Run: `npx vitest run src/ui/kamerafahrt.test.ts src/ui/panels/BodyTree.test.tsx`
Expected: FAIL (Modus `free` statt `attached`, Kinofall Modus `cinema`).

- [ ] **Schritt 4: Umsetzen**

`src/ui/kamerafahrt.ts`, Import:
```ts
import { cinemaAktiv, stopCinema } from './cinemaControl';
```
In `fahre` ersetzen:
```ts
  if (useStore.getState().cinema.running) stopCinema();
```
durch
```ts
  // Auch ein nur angehaltenes Kino: Der Klick hat es mit seinem pointerdown
  // schon angehalten, bevor er hier ankommt.
  if (cinemaAktiv()) stopCinema();
```
und
```ts
  setCamera({
    targetId: id,
    // Im freien Modus wird die Position des Körpers als Bezugspunkt
    // eingefroren (siehe Objektbaum); Geheftet und Verfolgung führen ihn mit.
    freezeJd: camera.mode === 'free' ? time.jd : null,
  });
```
durch
```ts
  // Jede Fahrt endet geheftet: Im freien Modus zielte sie auf die eingefrorene
  // Stelle, von der der Körper bei laufender Uhr schon wegzog (Entwurf
  // Klickflächen §6, Entscheidung Jens 15.09.2026).
  setCamera({ targetId: id, mode: 'attached', freezeJd: null });
```
JSDoc von `fahreZu` um „Die Kamera wechselt in den Modus Geheftet." ergänzen.

- [ ] **Schritt 5: Grün, Lint, Commit**

Run: `npm run lint && npm test` → alles grün.
```bash
git add src/ui/kamerafahrt.ts src/ui/kamerafahrt.test.ts src/ui/panels/BodyTree.test.tsx
git commit -m "Kamerafahrt heftet immer an und beendet auch ein angehaltenes Kino"
```

---

### Task 2: Blickmatrix nach der Kamera erneuern

**Dateien:**
- Ändern: `src/render/scene.ts` (in `update` nach `kamera.update`)
- Test: `src/render/scene.test.ts`

**Schnittstellen:** keine neuen.

- [ ] **Schritt 1: Test (rot)**

In `src/render/scene.test.ts` anhängen:
```ts
describe('buildScene — Blickmatrix', () => {
  it('erneuert die Blickmatrix im selben update, damit Overlay und Treffer das aktuelle Bild sehen', () => {
    const ctx = fakeContext();
    const szene = buildScene(ctx, fakeOverlay, (k) => k);
    const seitlich = { ...DEFAULT_STATE, camera: { ...DEFAULT_STATE.camera, azimuth: 0, elevation: 0 } };
    szene.update(2451545.0, 5, seitlich);
    szene.update(2451545.0, 5, seitlich);
    // Blick zur Seite: Die Drehung ist deutlich, eine veraltete Einheitsmatrix fiele auf.
    expect(Math.abs(ctx.camera.quaternion.w)).toBeLessThan(0.99);
    const erwartet = new THREE.Matrix4().makeRotationFromQuaternion(ctx.camera.quaternion).invert();
    erwartet.elements.forEach((wert, i) => {
      expect(ctx.camera.matrixWorldInverse.elements[i]).toBeCloseTo(wert, 9);
    });
  });
});
```

Run: `npx vitest run src/render/scene.test.ts` → FAIL (Einheitsmatrix).

- [ ] **Schritt 2: Umsetzen**

In `src/render/scene.ts` direkt nach `const cameraKm = new THREE.Vector3(x, y, z);`:
```ts
      // lookAt setzt nur die Quaternion; die Blickmatrix erneuert sonst erst der
      // Renderer. Overlay und Trefferprüfung projizieren aber schon hier.
      ctx.camera.updateMatrixWorld();
```

- [ ] **Schritt 3: Grün, Lint, Commit**

Run: `npm run lint && npm test` → grün.
```bash
git add src/render/scene.ts src/render/scene.test.ts
git commit -m "Szene: Blickmatrix vor dem Projizieren erneuern, Beschriftungen hinken nicht mehr nach"
```

---

### Task 3: Reine Trefferprüfung `render/treffer.ts`

**Dateien:**
- Neu: `src/render/treffer.ts`, `src/render/treffer.test.ts`

**Schnittstellen (Produces):**
```ts
export type Zeigerart = 'maus' | 'finger';
export const FANG_PX: Record<Zeigerart, number>;            // { maus: 8, finger: 20 }
export const TIPP_SCHWELLE_PX: Record<Zeigerart, number>;   // { maus: 4, finger: 10 }
export function zeigerartVon(pointerType: string): Zeigerart;
export interface Punkt { x: number; y: number }
export interface Scheibe { id: string; x: number; y: number; radiusPx: number; tiefe: number; istMond: boolean }
export interface Rechteck { id: string; links: number; oben: number; rechts: number; unten: number }
export interface Bahnzug { id: string; punkte: Float64Array }   // x0,y0,x1,y1,…; NaN = hinter der Kamera
export interface Kandidaten { scheiben: readonly Scheibe[]; namen: readonly Rechteck[]; bahnen: readonly Bahnzug[] }
export function abstandZumSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
export function findeTreffer(zeiger: Punkt, k: Kandidaten, fangPx: number): string | null;
export function projiziereZug(xyz: ArrayLike<number>, anzahl: number, m: Matrix4, breite: number, hoehe: number, ziel: Float64Array): void;
```

- [ ] **Schritt 1: Tests schreiben**

`src/render/treffer.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  abstandZumSegment, findeTreffer, projiziereZug, zeigerartVon, FANG_PX,
} from './treffer';
import type { Kandidaten, Scheibe } from './treffer';

const scheibe = (id: string, x: number, y: number, radiusPx: number, tiefe = 0.5, istMond = false): Scheibe =>
  ({ id, x, y, radiusPx, tiefe, istMond });
const zug = (id: string, ...xy: number[]) => ({ id, punkte: Float64Array.from(xy) });
const leer: Kandidaten = { scheiben: [], namen: [], bahnen: [] };

describe('findeTreffer', () => {
  it('liefert ohne Kandidaten null', () => {
    expect(findeTreffer({ x: 0, y: 0 }, leer, 8)).toBeNull();
  });

  it('nimmt auf überlappenden Scheiben die vorderste', () => {
    const k = { ...leer, scheiben: [scheibe('jupiter', 100, 100, 50, 0.9), scheibe('io', 110, 100, 5, 0.8, true)] };
    expect(findeTreffer({ x: 110, y: 100 }, k, 8)).toBe('io');
    expect(findeTreffer({ x: 80, y: 100 }, k, 8)).toBe('jupiter');
  });

  it('zieht die Scheibe dem Namen und den Namen der Bahn vor', () => {
    const k: Kandidaten = {
      scheiben: [scheibe('mars', 50, 50, 10)],
      namen: [{ id: 'earth', links: 40, oben: 40, rechts: 120, unten: 60 }],
      bahnen: [zug('venus', 0, 50, 200, 50)],
    };
    expect(findeTreffer({ x: 50, y: 50 }, k, 8)).toBe('mars');
    expect(findeTreffer({ x: 100, y: 50 }, k, 8)).toBe('earth');
    expect(findeTreffer({ x: 150, y: 50 }, k, 8)).toBe('venus');
  });

  it('zieht den Namen einer nahen Scheibenmitte vor', () => {
    const k: Kandidaten = {
      ...leer,
      scheiben: [scheibe('mars', 100, 50, 2)],
      namen: [{ id: 'earth', links: 104, oben: 40, rechts: 160, unten: 60 }],
    };
    expect(findeTreffer({ x: 105, y: 50 }, k, 8)).toBe('earth');
  });

  it('nimmt im Fangradius die nächste Mitte, bei Gleichstand den Planeten vor dem Mond', () => {
    const k = { ...leer, scheiben: [scheibe('io', 106, 100, 1, 0.1, true), scheibe('jupiter', 94, 100, 1, 0.9), scheibe('europa', 103, 100, 1, 0.5, true)] };
    expect(findeTreffer({ x: 104, y: 100 }, k, 8)).toBe('europa');
    const gleich = { ...leer, scheiben: [scheibe('io', 106, 100, 1, 0.1, true), scheibe('jupiter', 94.2, 100, 1, 0.9)] };
    expect(findeTreffer({ x: 100, y: 100 }, gleich, 8)).toBe('jupiter');
  });

  it('wertet den Fangradius einschließlich der Grenze', () => {
    const k = { ...leer, scheiben: [scheibe('mars', 0, 0, 1)] };
    expect(findeTreffer({ x: 8, y: 0 }, k, FANG_PX.maus)).toBe('mars');
    expect(findeTreffer({ x: 8.01, y: 0 }, k, FANG_PX.maus)).toBeNull();
    expect(findeTreffer({ x: 20, y: 0 }, k, FANG_PX.finger)).toBe('mars');
  });

  it('trifft die nähere Bahn im Fangradius', () => {
    const k = { ...leer, bahnen: [zug('mars', 0, 0, 100, 0), zug('venus', 0, 10, 100, 10)] };
    expect(findeTreffer({ x: 50, y: 3 }, k, 8)).toBe('mars');
    expect(findeTreffer({ x: 50, y: 7 }, k, 8)).toBe('venus');
    expect(findeTreffer({ x: 50, y: 30 }, k, 8)).toBeNull();
  });

  it('überspringt Segmente mit einem Punkt hinter der Kamera', () => {
    const k = { ...leer, bahnen: [zug('mars', 0, 0, Number.NaN, Number.NaN, 100, 0)] };
    expect(findeTreffer({ x: 50, y: 0 }, k, 8)).toBeNull();
  });

  it('lässt die Bahn eines Mondes den Klick auf seinen Planeten nicht stören', () => {
    const k = { ...leer, scheiben: [scheibe('jupiter', 100, 100, 4)], bahnen: [zug('io', 95, 100, 105, 100)] };
    expect(findeTreffer({ x: 101, y: 100 }, k, 8)).toBe('jupiter');
    expect(findeTreffer({ x: 106, y: 100 }, k, 8)).toBe('jupiter');
  });
});

describe('abstandZumSegment', () => {
  it('misst zum Lotfußpunkt innerhalb und zum Endpunkt außerhalb', () => {
    expect(abstandZumSegment(5, 3, 0, 0, 10, 0)).toBe(3);
    expect(abstandZumSegment(13, 4, 0, 0, 10, 0)).toBe(5);
    expect(abstandZumSegment(1, 1, 0, 0, 0, 0)).toBeCloseTo(Math.SQRT2, 12);
  });
});

describe('zeigerartVon', () => {
  it('unterscheidet Finger von Maus und Stift', () => {
    expect(zeigerartVon('touch')).toBe('finger');
    expect(zeigerartVon('mouse')).toBe('maus');
    expect(zeigerartVon('pen')).toBe('maus');
  });
});

describe('projiziereZug', () => {
  it('rechnet wie Vector3.project und markiert Punkte hinter der Kamera', () => {
    const kamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1e6);
    kamera.lookAt(1, 0.3, -2);
    kamera.updateMatrixWorld();
    const m = new THREE.Matrix4().multiplyMatrices(kamera.projectionMatrix, kamera.matrixWorldInverse);
    const punkte = [0.5, 0.2, -3, -1, 0.4, -5, 0, 0, 4];
    const ziel = new Float64Array(6);
    projiziereZug(punkte, 3, m, 1600, 900, ziel);
    for (let i = 0; i < 2; i++) {
      const v = new THREE.Vector3(punkte[i * 3], punkte[i * 3 + 1], punkte[i * 3 + 2]).project(kamera);
      expect(ziel[i * 2]).toBeCloseTo((v.x * 0.5 + 0.5) * 1600, 6);
      expect(ziel[i * 2 + 1]).toBeCloseTo((-v.y * 0.5 + 0.5) * 900, 6);
    }
    expect(Number.isNaN(ziel[4])).toBe(true);
  });
});
```

Run: `npx vitest run src/render/treffer.test.ts` → FAIL (Modul fehlt).

- [ ] **Schritt 2: Umsetzen**

`src/render/treffer.ts`:
```ts
import type { Matrix4 } from 'three';

/**
 * Trefferprüfung für Klickflächen in CSS-Pixeln relativ zur Canvas (Entwurf
 * Klickflächen §4). Rein und ohne DOM: Szene und Overlay liefern die
 * projizierten Kandidaten, hier fällt nur die Entscheidung.
 */

export type Zeigerart = 'maus' | 'finger';

/** Fangradius um den Zeiger. Ein Finger trifft ungenauer als ein Mauszeiger. */
export const FANG_PX: Record<Zeigerart, number> = { maus: 8, finger: 20 };
/** Bewegung, ab der ein Druck als Ziehen gilt statt als Tippen. */
export const TIPP_SCHWELLE_PX: Record<Zeigerart, number> = { maus: 4, finger: 10 };

/** Stift zählt als Maus. */
export const zeigerartVon = (pointerType: string): Zeigerart => (pointerType === 'touch' ? 'finger' : 'maus');

export interface Punkt { x: number; y: number }
/** Projizierte Körperscheibe; `tiefe` ist NDC-z, kleiner heißt weiter vorn. */
export interface Scheibe { id: string; x: number; y: number; radiusPx: number; tiefe: number; istMond: boolean }
export interface Rechteck { id: string; links: number; oben: number; rechts: number; unten: number }
/** Bahn als Punktfolge x0, y0, x1, y1, …; NaN markiert einen Punkt hinter der Kamera. */
export interface Bahnzug { id: string; punkte: Float64Array }
export interface Kandidaten { scheiben: readonly Scheibe[]; namen: readonly Rechteck[]; bahnen: readonly Bahnzug[] }

/** Abstände, die sich um höchstens so viel unterscheiden, gelten als gleich. */
const GLEICHSTAND_PX = 0.5;

export function abstandZumSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const abx = bx - ax;
  const aby = by - ay;
  const laenge2 = abx * abx + aby * aby;
  const t = laenge2 === 0 ? 0 : Math.min(Math.max(((px - ax) * abx + (py - ay) * aby) / laenge2, 0), 1);
  return Math.hypot(px - (ax + t * abx), py - (ay + t * aby));
}

/** Sonne, Planet und Zwergplanet vor Mond, dann der vordere. */
const hatVorrang = (a: Scheibe, b: Scheibe): boolean =>
  (a.istMond !== b.istMond ? !a.istMond : a.tiefe < b.tiefe);

/**
 * Rangfolge (Entwurf §4.2): Zeiger auf einer Scheibe → vorderste; in einem
 * Namen → dieser; Scheibenmitte im Fangradius → nächste; Bahn im Fangradius →
 * nächste. Der erste zutreffende Rang entscheidet.
 */
export function findeTreffer(zeiger: Punkt, k: Kandidaten, fangPx: number): string | null {
  let vorne: Scheibe | null = null;
  for (const s of k.scheiben) {
    if (Math.hypot(zeiger.x - s.x, zeiger.y - s.y) > s.radiusPx) continue;
    if (vorne === null || s.tiefe < vorne.tiefe) vorne = s;
  }
  if (vorne !== null) return vorne.id;

  for (const r of k.namen) {
    if (zeiger.x >= r.links && zeiger.x <= r.rechts && zeiger.y >= r.oben && zeiger.y <= r.unten) return r.id;
  }

  let mitte: Scheibe | null = null;
  let mitteAbstand = Infinity;
  for (const s of k.scheiben) {
    const d = Math.hypot(zeiger.x - s.x, zeiger.y - s.y);
    if (d > fangPx) continue;
    const gleich = Math.abs(d - mitteAbstand) <= GLEICHSTAND_PX;
    if (mitte === null || (!gleich && d < mitteAbstand) || (gleich && hatVorrang(s, mitte))) {
      mitte = s;
      mitteAbstand = d;
    }
  }
  if (mitte !== null) return mitte.id;

  let bahn: string | null = null;
  let bahnAbstand = fangPx;
  for (const z of k.bahnen) {
    const p = z.punkte;
    for (let i = 0; i + 3 < p.length; i += 2) {
      const ax = p[i]!;
      const bx = p[i + 2]!;
      if (Number.isNaN(ax) || Number.isNaN(bx)) continue;
      const d = abstandZumSegment(zeiger.x, zeiger.y, ax, p[i + 1]!, bx, p[i + 3]!);
      if (d <= bahnAbstand) {
        bahnAbstand = d;
        bahn = z.id;
      }
    }
  }
  return bahn;
}

/**
 * Projiziert kamerarelative Punkte (x, y, z hintereinander) in CSS-Pixel.
 * `m` ist projectionMatrix · matrixWorldInverse. Zwilling von Vector3.project
 * mit der Umrechnung aus projectToScreen in labels.ts, aber ohne Objekt je Punkt.
 */
export function projiziereZug(
  xyz: ArrayLike<number>, anzahl: number, m: Matrix4, breite: number, hoehe: number, ziel: Float64Array,
): void {
  const e = m.elements;
  for (let i = 0; i < anzahl; i++) {
    const x = xyz[i * 3]!;
    const y = xyz[i * 3 + 1]!;
    const z = xyz[i * 3 + 2]!;
    const w = e[3]! * x + e[7]! * y + e[11]! * z + e[15]!;
    if (w <= 0) {
      ziel[i * 2] = Number.NaN;
      ziel[i * 2 + 1] = Number.NaN;
      continue;
    }
    const nx = (e[0]! * x + e[4]! * y + e[8]! * z + e[12]!) / w;
    const ny = (e[1]! * x + e[5]! * y + e[9]! * z + e[13]!) / w;
    ziel[i * 2] = (nx * 0.5 + 0.5) * breite;
    ziel[i * 2 + 1] = (-ny * 0.5 + 0.5) * hoehe;
  }
}
```

- [ ] **Schritt 3: Grün**

Run: `npx vitest run src/render/treffer.test.ts` → PASS.

- [ ] **Schritt 4: Node-Messung (Entwurf §4.5), nicht committen**

Skript im Scratchpad, Lauf mit `npx tsx <pfad>`:
```ts
import * as THREE from 'three';
import { findeTreffer, projiziereZug } from '<projekt>/src/render/treffer.ts';
const kamera = new THREE.PerspectiveCamera(50, 16 / 9, 1, 1e9);
kamera.lookAt(0, 0, -1); kamera.updateMatrixWorld();
const m = new THREE.Matrix4().multiplyMatrices(kamera.projectionMatrix, kamera.matrixWorldInverse);
const puffer = Array.from({ length: 34 }, (_, j) => Float32Array.from({ length: 513 * 3 }, (_, i) =>
  (i % 3 === 2 ? -1e5 : Math.sin(i + j) * 5e4)));
const ziele = puffer.map(() => new Float64Array(513 * 2));
const t0 = performance.now();
for (let n = 0; n < 1000; n++) {
  puffer.forEach((p, j) => projiziereZug(p, 513, m, 2560, 1295, ziele[j]!));
  findeTreffer({ x: 1280, y: 640 }, { scheiben: [], namen: [], bahnen: ziele.map((punkte, j) => ({ id: String(j), punkte })) }, 8);
}
console.log('ms je Bild', (performance.now() - t0) / 1000);
```
Wert ins Ledger. Kriterium: unter 1 ms.

- [ ] **Schritt 5: Lint, Commit**

Run: `npm run lint && npm test` → grün.
```bash
git add src/render/treffer.ts src/render/treffer.test.ts
git commit -m "Trefferprüfung in Bildschirmpixeln: Scheiben, Namen, Bahnen mit Fangradius"
```

---

### Task 4: Hervorhebung und Kandidaten im Overlay, Hervorhebung der Bahnen

**Dateien:**
- Ändern: `src/render/labels.ts` (Interface `LabelOverlay`, Knotentyp, `update`)
- Ändern: `src/render/orbits.ts` (Konstanten, `update`)
- Ändern: `src/index.css` (Klasse `hervorgehoben`)
- Test: `src/render/labels.test.ts`, `src/render/orbits.test.ts`

**Schnittstellen:**
- Consumes (Task 3): `Rechteck`, `Scheibe` aus `./treffer`.
- Produces:
```ts
// labels.ts
interface LabelOverlay {
  update(eintraege, camera, zeigeLabels, zeigeMarker, sprache, hervorgehoben?: string | null): void;
  /** Namensrechtecke des letzten update, CSS-Pixel relativ zum Overlay. */
  namensRechtecke(): readonly Rechteck[];
  /** Scheiben aller sichtbaren Körper vor der Kamera aus dem letzten update. */
  trefferScheiben(): readonly Scheibe[];
  dispose(): void;
}
// orbits.ts
export const BAHN_DECKKRAFT = 0.45;
export const BAHN_DECKKRAFT_HERVOR = 0.9;
update(cameraKm, sichtbar, an, jd, s, hervorgehoben?: string | null): void;
```

- [ ] **Schritt 1: Tests (rot)**

In `src/render/labels.test.ts` in den `describe`-Block, der `baueOverlay`, `koerper`,
`testKamera`, `wrapperVon`, `BREITE` und `HOEHE` kennt, anhängen. Fehlende Importe
ergänzen: `vi` aus `vitest`, `projectToScreen` und `MARKER_MIN_PIXEL` aus `./labels`.

```ts
  it('zeigt den Namen eines hervorgehobenen Mondes unter der Schwelle, auch ohne Beschriftungen', () => {
    const io = koerper('io', 'body.io.name', true, 1000, 2);
    const { overlay, container } = baueOverlay();
    overlay.update([io], testKamera(), false, false, 'de', 'io');
    const w = wrapperVon(container, 'Io');
    expect(w?.hidden).toBe(false);
    expect(w?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(false);
    expect(w?.classList.contains('hervorgehoben')).toBe(true);
    overlay.update([io], testKamera(), false, false, 'de', null);
    expect(wrapperVon(container, 'Io')?.hidden).toBe(true);
  });

  it('setzt den hervorgehobenen Mond vor den überlappenden Planeten', () => {
    const jupiter = koerper('jupiter', 'body.jupiter.name', false, 1000, 100);
    const io = koerper('io', 'body.io.name', true, 500, 50);
    const { overlay, container } = baueOverlay();
    overlay.update([jupiter, io], testKamera(), true, true, 'de', 'io');
    expect(wrapperVon(container, 'Io')?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(false);
    expect(wrapperVon(container, 'Jupiter')?.hidden ?? true).toBe(true);
  });

  it('liefert Namensrechtecke aus Ankerpunkt und einmal gemessenem Versatz', () => {
    const rechteck = (left: number, top: number, width: number, height: number) =>
      ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;
    const kamera = testKamera();
    const jupiter = koerper('jupiter', 'body.jupiter.name', false, 1000, 100);
    const p0 = projectToScreen(jupiter.renderPos, kamera, BREITE, HOEHE)!;
    const spion = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('koerper-name') ? rechteck(p0.x + 12, p0.y - 8, 40, 14) : rechteck(0, 0, BREITE, HOEHE);
    });
    const { overlay } = baueOverlay();
    overlay.update([jupiter], kamera, true, true, 'de');
    const [r] = overlay.namensRechtecke();
    expect(r!.id).toBe('jupiter');
    expect(r!.links).toBeCloseTo(p0.x + 12, 9);
    expect(r!.oben).toBeCloseTo(p0.y - 8, 9);
    expect(r!.rechts).toBeCloseTo(p0.x + 52, 9);
    expect(r!.unten).toBeCloseTo(p0.y + 6, 9);

    const messungen = spion.mock.calls.length;
    const verschoben = { ...jupiter, renderPos: { x: 100, y: 0, z: -1000 } };
    overlay.update([verschoben], kamera, true, true, 'de');
    const p1 = projectToScreen(verschoben.renderPos, kamera, BREITE, HOEHE)!;
    expect(overlay.namensRechtecke()[0]!.links).toBeCloseTo(p1.x + 12, 9);
    expect(spion.mock.calls.length).toBe(messungen);

    namen['body.jupiter.name'] = 'Jupiter (EN)';
    overlay.update([verschoben], kamera, true, true, 'en');
    expect(spion.mock.calls.length).toBeGreaterThan(messungen);
    spion.mockRestore();
  });

  it('liefert Trefferscheiben sichtbarer Körper, mit Glyphe mindestens MARKER_MIN_PIXEL', () => {
    const io = koerper('io', 'body.io.name', true, 1000, 1);
    const jupiter = { ...koerper('jupiter', 'body.jupiter.name', false, 2000, 60), sichtbar: false };
    const { overlay } = baueOverlay();
    overlay.update([io, jupiter], testKamera(), true, true, 'de');
    const scheiben = overlay.trefferScheiben();
    expect(scheiben.map((s) => s.id)).toEqual(['io']);
    expect(scheiben[0]!.radiusPx).toBe(MARKER_MIN_PIXEL);
    expect(scheiben[0]!.istMond).toBe(true);
  });
```

In `src/render/orbits.test.ts` Importe um `BAHN_DECKKRAFT`, `BAHN_DECKKRAFT_HERVOR`
erweitern und anhängen:
```ts
describe('createOrbitLines — Hervorhebung', () => {
  it('hebt nur die Bahn des Körpers unter dem Zeiger hervor', () => {
    const linien = createOrbitLines(new THREE.Scene());
    const deckkraft = (id: string): number => (linien.lines.get(id)!.material as THREE.LineBasicMaterial).opacity;
    linien.update(new THREE.Vector3(), {}, true, J2000, SCALE_PRESETS.realistisch, 'mars');
    expect(deckkraft('mars')).toBe(BAHN_DECKKRAFT_HERVOR);
    expect(deckkraft('venus')).toBe(BAHN_DECKKRAFT);
    linien.update(new THREE.Vector3(), {}, true, J2000, SCALE_PRESETS.realistisch, null);
    expect(deckkraft('mars')).toBe(BAHN_DECKKRAFT);
  });
});
```

Run: `npx vitest run src/render/labels.test.ts src/render/orbits.test.ts` → FAIL.

- [ ] **Schritt 2: `orbits.ts` umsetzen**

Nach `ORBIT_SEGMENTS`:
```ts
/** Deckkraft der Bahnlinien; die Bahn unter dem Zeiger wird kräftiger (Entwurf Klickflächen §7). */
export const BAHN_DECKKRAFT = 0.45;
export const BAHN_DECKKRAFT_HERVOR = 0.9;
```
Material: `opacity: 0.45` → `opacity: BAHN_DECKKRAFT`. Interface-Signatur um
`hervorgehoben?: string | null` ergänzen. In
`update(cameraKm, sichtbar, an, jd, s, hervorgehoben = null)` direkt nach
`linie.visible = …`:
```ts
        (linie.material as THREE.LineBasicMaterial).opacity =
          id === hervorgehoben ? BAHN_DECKKRAFT_HERVOR : BAHN_DECKKRAFT;
```

- [ ] **Schritt 3: `labels.ts` umsetzen**

Import: `import type { Rechteck, Scheibe } from './treffer';`

Interface `LabelOverlay`: `update` um den sechsten Parameter
`hervorgehoben?: string | null` (JSDoc: „Körper unter dem Zeiger: wird zuerst gesetzt
und zeigt seinen Namen immer.") und die Methoden `namensRechtecke()`,
`trefferScheiben()` wie oben ergänzen.

Knotentyp in `knoten` um
`versatz: { dx: number; dy: number; breite: number; hoehe: number } | null` und
`messSchluessel: string` erweitern; in `hole` mit `versatz: null, messSchluessel: ''`
anlegen. Neben `beschriftetIn`:
```ts
  let rechtecke: Rechteck[] = [];
  let scheiben: Scheibe[] = [];
```

In `update(eintraege, camera, zeigeLabels, zeigeMarker, sprache, hervorgehoben = null)`:

Sortierung beginnt mit:
```ts
      kandidaten.sort((a, b) => {
        // Der Körper unter dem Zeiger wird zuerst gesetzt (Entwurf Klickflächen §7).
        if (a.eintrag.id === hervorgehoben) return -1;
        if (b.eintrag.id === hervorgehoben) return 1;
```
Nach der Sortierung:
```ts
      scheiben = kandidaten.map(({ eintrag, p, radiusPixel }) => ({
        id: eintrag.id, x: p.x, y: p.y, tiefe: p.tiefe, istMond: eintrag.istMond,
        radiusPx: zeigeMarker && needsMarker(radiusPixel) ? Math.max(radiusPixel, MARKER_MIN_PIXEL) : radiusPixel,
      }));
      rechtecke = [];
```
In der Schleife `zeigtText` ersetzen:
```ts
        const istHervorgehoben = eintrag.id === hervorgehoben;
        const zeigtText = istHervorgehoben || (zeigeLabels && zeigeLabel(radiusPixel, eintrag.istMond));
```
nach `el.text.hidden = !zeigtText;`:
```ts
        el.wrapper.classList.toggle('hervorgehoben', istHervorgehoben);
        if (zeigtText) {
          // Gemessen wird nur bei geändertem Text, Glyphen- oder Hervorhebungszustand;
          // je Bild entsteht das Rechteck aus Ankerpunkt und abgelegtem Versatz.
          const schluessel = `${el.text.textContent ?? ''}|${String(brauchtGlyphe)}|${String(istHervorgehoben)}`;
          if (el.messSchluessel !== schluessel || el.versatz === null) {
            const basis = wurzel.getBoundingClientRect();
            const r = el.text.getBoundingClientRect();
            el.versatz = { dx: r.left - basis.left - p.x, dy: r.top - basis.top - p.y, breite: r.width, hoehe: r.height };
            el.messSchluessel = schluessel;
          }
          const v = el.versatz;
          rechtecke.push({
            id: eintrag.id, links: p.x + v.dx, oben: p.y + v.dy,
            rechts: p.x + v.dx + v.breite, unten: p.y + v.dy + v.hoehe,
          });
        }
```
Im zurückgegebenen Objekt:
```ts
    namensRechtecke: () => rechtecke,
    trefferScheiben: () => scheiben,
```

- [ ] **Schritt 4: CSS**

`src/index.css` nach `.koerper-glyphe { … }`:
```css
/* Körper unter dem Zeiger (Entwurf Klickflächen §7). */
.koerper-label.hervorgehoben .koerper-name {
  font-weight: 700;
  color: #ffffff;
}
```

- [ ] **Schritt 5: Grün, Lint, Commit**

Run: `npm run lint && npm test` → grün.
```bash
git add src/render/labels.ts src/render/labels.test.ts src/render/orbits.ts src/render/orbits.test.ts src/index.css
git commit -m "Overlay liefert Trefferscheiben und Namensrechtecke, Körper und Bahn unter dem Zeiger hervorgehoben"
```

---

### Task 5: Eingabe unterscheidet Tippen, Ziehen und Hover

**Dateien:**
- Ändern: `src/render/camera/input.ts`
- Neu: `src/render/camera/input.test.ts`

**Schnittstellen:**
- Consumes (Task 3): `TIPP_SCHWELLE_PX`, `zeigerartVon`, `Zeigerart`.
- Produces:
```ts
export interface EingabeRueckrufe {
  onTipp?: (x: number, y: number, art: Zeigerart) => void;
  onZeiger?: (zeiger: { x: number; y: number; art: Zeigerart } | null) => void;
}
export function attachCameraInput(element: HTMLElement, rueckrufe?: EingabeRueckrufe): () => void;
```
Koordinaten in CSS-Pixeln relativ zu `element.getBoundingClientRect()`.

- [ ] **Schritt 1: Tests (rot)**

`src/render/camera/input.test.ts`:
```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { attachCameraInput } from './input';
import { useStore, DEFAULT_STATE } from '../../store';

const DREH = Math.PI / 600;

function zeiger(el: HTMLElement, typ: string, x: number, y: number, id = 1, art = 'mouse', button = 0): void {
  const e = new MouseEvent(typ, { clientX: x, clientY: y, button, bubbles: true });
  Object.defineProperties(e, { pointerId: { value: id }, pointerType: { value: art } });
  el.dispatchEvent(e);
}

function flaeche(): HTMLElement {
  const el = document.createElement('div');
  el.setPointerCapture = vi.fn();
  el.releasePointerCapture = vi.fn();
  el.hasPointerCapture = () => false;
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('attachCameraInput — Tippen und Ziehen', () => {
  it('meldet ein Tippen unter der Schwelle genau einmal und dreht nicht', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 103, 100);
    zeiger(el, 'pointerup', 103, 100);
    expect(onTipp).toHaveBeenCalledTimes(1);
    expect(onTipp).toHaveBeenCalledWith(103, 100, 'maus');
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    stop();
  });

  it('dreht über der Schwelle mit der ganzen Strecke und meldet kein Tippen', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 103, 100);
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    zeiger(el, 'pointermove', 110, 100);
    expect(useStore.getState().camera.azimuth).toBeCloseTo(azimut - 10 * DREH, 12);
    zeiger(el, 'pointermove', 112, 100);
    expect(useStore.getState().camera.azimuth).toBeCloseTo(azimut - 12 * DREH, 12);
    zeiger(el, 'pointerup', 112, 100);
    expect(onTipp).not.toHaveBeenCalled();
    stop();
  });

  it('wertet beim Finger die größere Schwelle', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointermove', 108, 100, 1, 'touch');
    zeiger(el, 'pointerup', 108, 100, 1, 'touch');
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    expect(onTipp).toHaveBeenCalledWith(108, 100, 'finger');
    stop();
  });

  it('meldet kein Tippen, wenn ein zweiter Finger dazukam', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 200, 100, 2, 'touch');
    zeiger(el, 'pointerup', 200, 100, 2, 'touch');
    zeiger(el, 'pointerup', 100, 100, 1, 'touch');
    expect(onTipp).not.toHaveBeenCalled();
    stop();
  });

  it('meldet bei rechter Maustaste und bei pointercancel kein Tippen', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    zeiger(el, 'pointerdown', 100, 100, 1, 'mouse', 2);
    zeiger(el, 'pointerup', 100, 100, 1, 'mouse', 2);
    zeiger(el, 'pointerdown', 100, 100, 3, 'touch');
    zeiger(el, 'pointercancel', 100, 100, 3, 'touch');
    expect(onTipp).not.toHaveBeenCalled();
    stop();
  });

  it('arbeitet ohne Rückrufe', () => {
    const el = flaeche();
    const stop = attachCameraInput(el);
    expect(() => {
      zeiger(el, 'pointermove', 10, 10);
      zeiger(el, 'pointerdown', 10, 10);
      zeiger(el, 'pointerup', 10, 10);
      zeiger(el, 'pointerleave', 10, 10);
    }).not.toThrow();
    stop();
  });
});

describe('attachCameraInput — Hover', () => {
  it('meldet den Zeiger nur ohne Druck und nicht bei Berührung', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointermove', 50, 60);
    expect(onZeiger).toHaveBeenLastCalledWith({ x: 50, y: 60, art: 'maus' });
    onZeiger.mockClear();
    zeiger(el, 'pointermove', 50, 60, 2, 'touch');
    expect(onZeiger).not.toHaveBeenCalled();
    zeiger(el, 'pointerdown', 50, 60);
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    zeiger(el, 'pointermove', 70, 60);
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    stop();
  });

  it('meldet beim Verlassen null', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointermove', 50, 60);
    zeiger(el, 'pointerleave', 50, 60);
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    stop();
  });
});
```

Run: `npx vitest run src/render/camera/input.test.ts` → FAIL.

- [ ] **Schritt 2: Umsetzen**

`attachCameraInput` in `src/render/camera/input.ts` ersetzen (Helfer `zoome`, `drehe`
und Konstanten bleiben):
```ts
import { TIPP_SCHWELLE_PX, zeigerartVon } from '../treffer';
import type { Zeigerart } from '../treffer';

export interface EingabeRueckrufe {
  /** Druck ohne Ziehen und ohne zweiten Zeiger, bei der Maus nur Haupttaste. */
  onTipp?: (x: number, y: number, art: Zeigerart) => void;
  /** Hover ohne Druck (nicht bei Berührung); null bei Druck und beim Verlassen. */
  onZeiger?: (zeiger: { x: number; y: number; art: Zeigerart } | null) => void;
}

interface Druck { startX: number; startY: number; x: number; y: number; art: Zeigerart; zieht: boolean; tippbar: boolean }

/**
 * Verbindet Maus- und Berührungseingaben mit dem Store. Der Controller liest
 * die Werte im nächsten Bild — die Eingabe kennt weder Three.js noch die
 * Kamera selbst. Tippen und Hover gehen über Rückrufe hinaus (Entwurf
 * Klickflächen §5): Gedreht wird erst jenseits der Tippschwelle, dann mit der
 * ganzen Strecke seit dem Druck, damit ein Tipp die Kamera nicht bewegt.
 */
export function attachCameraInput(element: HTMLElement, rueckrufe: EingabeRueckrufe = {}): () => void {
  const aktive = new Map<number, Druck>();
  let letzterPinchAbstand: number | null = null;

  const pinchAbstand = (): number | null => {
    if (aktive.size < 2) return null;
    const [a, b] = [...aktive.values()];
    if (a === undefined || b === undefined) return null;
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const lokal = (e: PointerEvent): { x: number; y: number } => {
    const r = element.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: PointerEvent): void => {
    aktive.set(e.pointerId, {
      startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY,
      art: zeigerartVon(e.pointerType), zieht: false, tippbar: e.button === 0,
    });
    // Ein zweiter Zeiger macht aus dem Druck eine Geste: kein Tippen mehr, und
    // der verbleibende Finger dreht danach ohne Totzone weiter.
    if (aktive.size >= 2) {
      for (const d of aktive.values()) { d.tippbar = false; d.zieht = true; }
    }
    element.setPointerCapture(e.pointerId);
    letzterPinchAbstand = pinchAbstand();
    rueckrufe.onZeiger?.(null);
  };

  const onPointerMove = (e: PointerEvent): void => {
    const d = aktive.get(e.pointerId);
    if (d === undefined) {
      if (aktive.size === 0 && e.pointerType !== 'touch') {
        rueckrufe.onZeiger?.({ ...lokal(e), art: zeigerartVon(e.pointerType) });
      }
      return;
    }
    const vorherX = d.x;
    const vorherY = d.y;
    d.x = e.clientX;
    d.y = e.clientY;

    if (aktive.size >= 2) {
      const jetzt = pinchAbstand();
      if (jetzt !== null && letzterPinchAbstand !== null && jetzt > 0) {
        zoome(letzterPinchAbstand / jetzt);
      }
      letzterPinchAbstand = jetzt;
      return;
    }
    if (!d.zieht) {
      if (Math.hypot(d.x - d.startX, d.y - d.startY) <= TIPP_SCHWELLE_PX[d.art]) return;
      d.zieht = true;
      d.tippbar = false;
      drehe(d.x - d.startX, d.y - d.startY);
      return;
    }
    drehe(d.x - vorherX, d.y - vorherY);
  };

  const beende = (e: PointerEvent, tippenErlaubt: boolean): void => {
    const d = aktive.get(e.pointerId);
    aktive.delete(e.pointerId);
    if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
    letzterPinchAbstand = pinchAbstand();
    if (tippenErlaubt && d !== undefined && d.tippbar && !d.zieht && aktive.size === 0) {
      const p = lokal(e);
      rueckrufe.onTipp?.(p.x, p.y, d.art);
    }
  };
  const onPointerUp = (e: PointerEvent): void => { beende(e, true); };
  const onPointerCancel = (e: PointerEvent): void => { beende(e, false); };
  const onPointerLeave = (): void => { rueckrufe.onZeiger?.(null); };

  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    // deltaMode 1 zählt Zeilen statt Pixel (Firefox) — auf Pixel normieren.
    const schritte = (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / 100;
    zoome(1.1 ** schritte);
  };

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerCancel);
  element.addEventListener('pointerleave', onPointerLeave);
  element.addEventListener('wheel', onWheel, { passive: false });
  // Sonst bricht die Browser-Geste (Scrollen, Zoomen) das Ziehen ab.
  element.style.touchAction = 'none';

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointercancel', onPointerCancel);
    element.removeEventListener('pointerleave', onPointerLeave);
    element.removeEventListener('wheel', onWheel);
  };
}
```
Die Tests erzeugen `MouseEvent` mit `pointerId`/`pointerType`; der Handler liest nur
`pointerId`, `pointerType`, `button`, `clientX/Y`. Signaturen deshalb nicht aufweichen.

- [ ] **Schritt 3: Grün, Lint, Commit**

Run: `npm run lint && npm test` → grün.
```bash
git add src/render/camera/input.ts src/render/camera/input.test.ts
git commit -m "Eingabe: Totzone gegen Zucken, Tippen und Hover über Rückrufe"
```

---

### Task 6: Szene prüft den Zeiger, Verdrahtung in `app/main.tsx`

**Dateien:**
- Ändern: `src/render/scene.ts`, `src/app/main.tsx`
- Test: `src/render/scene.test.ts`

**Schnittstellen:**
- Consumes: `findeTreffer`, `projiziereZug`, `FANG_PX`, `Bahnzug`, `Kandidaten`,
  `Zeigerart` (Task 3); `labels.namensRechtecke()`, `labels.trefferScheiben()`,
  sechster Parameter von `labels.update` und `bahnen.update` (Task 4);
  `EingabeRueckrufe` (Task 5); `fahreZu` (Task 1).
- Produces (`SceneHandle`):
```ts
setZeiger: (zeiger: { x: number; y: number; art: Zeigerart } | null) => void;
hervorgehoben: () => string | null;
trefferBei: (x: number, y: number, art: Zeigerart) => string | null;
```

- [ ] **Schritt 1: Tests (rot)**

In `src/render/scene.test.ts` den Label-Mock ersetzen:
```ts
const labelsUpdateSpion = vi.fn();
let testScheiben: import('./treffer').Scheibe[] = [];
vi.mock('./labels', () => ({
  createLabelOverlay: () => ({
    update: labelsUpdateSpion,
    dispose: vi.fn(),
    namensRechtecke: () => [],
    trefferScheiben: () => testScheiben,
  }),
}));
```
Bahn-Mock: `createOrbitLines: () => ({ update: updateSpion, lines: new Map() }),`.
Bestehende Erwartung `toHaveBeenLastCalledWith(…, DEFAULT_STATE.scale,)` um `null` als
sechstes Argument ergänzen.

Anhängen:
```ts
describe('buildScene — Zeiger und Treffer', () => {
  const mars = { id: 'mars', x: 10, y: 10, radiusPx: 5, tiefe: 0.5, istMond: false };

  it('reicht den Körper unter dem Zeiger ab dem nächsten Bild an Overlay und Bahnen', () => {
    testScheiben = [mars];
    const szene = buildScene(fakeContext(), fakeOverlay, (k) => k);
    szene.setZeiger({ x: 11, y: 10, art: 'maus' });
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(szene.hervorgehoben()).toBe('mars');
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(updateSpion.mock.lastCall?.[5]).toBe('mars');
    expect(labelsUpdateSpion.mock.lastCall?.[5]).toBe('mars');
    szene.setZeiger(null);
    expect(szene.hervorgehoben()).toBeNull();
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(labelsUpdateSpion.mock.lastCall?.[5]).toBeNull();
    testScheiben = [];
  });

  it('prüft trefferBei gegen die Kandidaten des letzten Bildes', () => {
    testScheiben = [mars];
    const szene = buildScene(fakeContext(), fakeOverlay, (k) => k);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(szene.trefferBei(11, 10, 'maus')).toBe('mars');
    expect(szene.trefferBei(40, 10, 'maus')).toBeNull();
    expect(szene.trefferBei(30, 10, 'finger')).toBe('mars');
    testScheiben = [];
  });
});
```

Run: `npx vitest run src/render/scene.test.ts` → FAIL.

- [ ] **Schritt 2: `scene.ts` umsetzen**

Importe:
```ts
import { findeTreffer, projiziereZug, FANG_PX } from './treffer';
import type { Bahnzug, Kandidaten, Zeigerart } from './treffer';
```
`SceneHandle` um die drei Methoden (JSDoc nach Entwurf §3.3) erweitern. In
`buildScene` nach `const belichtung = …`:
```ts
  // Hover (Entwurf Klickflächen §3.3): flüchtig, nicht im Store.
  let zeiger: { x: number; y: number; art: Zeigerart } | null = null;
  let hover: string | null = null;
  const blick = new THREE.Matrix4();
  const bahnPuffer = new Map<string, Float64Array>();

  /** Kandidaten des zuletzt berechneten Bildes; Bahnen aus den gezeichneten Puffern. */
  const kandidaten = (): Kandidaten => {
    blick.multiplyMatrices(ctx.camera.projectionMatrix, ctx.camera.matrixWorldInverse);
    const zuege: Bahnzug[] = [];
    for (const [id, linie] of bahnen.lines) {
      if (!linie.visible) continue;
      const attr = linie.geometry.getAttribute('position');
      let ziel = bahnPuffer.get(id);
      if (ziel === undefined) {
        ziel = new Float64Array(attr.count * 2);
        bahnPuffer.set(id, ziel);
      }
      projiziereZug(attr.array, attr.count, blick, overlay.clientWidth, overlay.clientHeight, ziel);
      zuege.push({ id, punkte: ziel });
    }
    return { scheiben: labels.trefferScheiben(), namen: labels.namensRechtecke(), bahnen: zuege };
  };
```
`bahnen.update(…, state.scale)` → `bahnen.update(…, state.scale, hover)`;
`labels.update(…, state.ui.language)` → `labels.update(…, state.ui.language, hover)`.
Direkt nach `labels.update(…)`:
```ts
      // Treffer erst nach dem Projizieren; die Hervorhebung folgt im nächsten
      // Bild — ein Bild Versatz ist nicht zu sehen.
      hover = zeiger === null ? null : findeTreffer(zeiger, kandidaten(), FANG_PX[zeiger.art]);
```
Im zurückgegebenen Objekt:
```ts
    setZeiger(neu) {
      zeiger = neu;
      if (neu === null) hover = null;
    },
    hervorgehoben: () => hover,
    trefferBei: (x, y, art) => findeTreffer({ x, y }, kandidaten(), FANG_PX[art]),
```

- [ ] **Schritt 3: `app/main.tsx` verdrahten**

Import: `import { fahreZu } from '../ui/kamerafahrt';`

Nach `const szene = buildScene(…)`:
```ts
    if (import.meta.env.DEV) {
      // Für die Abnahme der Klickflächen: Kamera und Szene ohne Klickweg abfragen.
      Object.assign(window as unknown as Record<string, unknown>, { kamera: ctx.camera, szene });
    }
```
`const stopInput = attachCameraInput(canvas);` samt Kommentar darüber ersetzen durch:
```ts
    // Ziehen dreht, Rad und Zwei-Finger-Geste zoomen; Tippen fährt zum
    // getroffenen Körper, Hover hebt ihn hervor (Entwurf Klickflächen §3.3).
    const stopInput = attachCameraInput(canvas, {
      onTipp: (x, y, art) => {
        const id = szene.trefferBei(x, y, art);
        if (id !== null) fahreZu(id);
      },
      onZeiger: (zeiger) => { szene.setZeiger(zeiger); },
    });
```
In der Schleife nach `szene.update(jd, dt, state);`:
```ts
      const zeigerForm = szene.hervorgehoben() === null ? '' : 'pointer';
      if (canvas.style.cursor !== zeigerForm) canvas.style.cursor = zeigerForm;
```

- [ ] **Schritt 4: Grün, Lint, Build, Commit**

Run: `npm run lint && npm test && npm run build` → grün.
```bash
git add src/render/scene.ts src/render/scene.test.ts src/app/main.tsx
git commit -m "Klickflächen verdrahtet: Hover je Bild, Tippen fährt zum getroffenen Körper"
```

---

### Task 7: Abnahme und Abschluss

**Dateien:**
- Neu: `docs/klickflaechen-abnahme.md`

- [ ] **Schritt 1: Browser vorbereiten**

Seite neu laden, `window.store.setState({ quality: { tier: 'high' } })`,
`setCinema({ running: false, pauseOnInput: false })`, `setTime({ paused: true })`,
für Differenzbilder `setUi({ hidden: true })`. Bildschirmposition eines Körpers:
Punktlicht in `window.scene` suchen, Kamera km = −Licht.position·1000;
Render-Position = (`scaledPositionAt(id, bodyIndex, jd, scale)` − Kamera km)/1000
(Module per `import('/Orrery/src/sim/scale.ts')` und
`import('/Orrery/src/data/index.ts')`); projizieren mit
`window.kamera.projectionMatrix`·`window.kamera.matrixWorldInverse` wie
`projiziereZug`. Klicks mit echter Maus: `browser_run_code_unsafe` →
`page.mouse.click(x, y)`.

- [ ] **Schritt 2: Messungen nach Entwurf §9.2–§9.8**

1. §9.2: Skript aus Task 1 Schritt 1, Teil a; Abstände bei 1,5/2/3 s, bei 3 s ≤ 3 px, Modus `attached`.
2. §9.3: Screenshot Zeiger über Mars (`page.mouse.move`) gegen Zeiger im Leeren, Differenz mit Pillow/numpy; abweichende Pixel nur in einer Maske von 12 px um die projizierte Marsbahn und das Namensrechteck; Kontrolle zweimal Leere = 0 Pixel; `canvas.style.cursor` je Fall.
3. §9.4: Rundgang über alle sichtbaren Körper in der Systemansicht und in einer Nahansicht Jupiter; je Körper klicken, 1,6 s warten, `camera.targetId` lesen, Ausgangskamera wiederherstellen. Quote und Fehlzuordnungen, verdeckte Monde getrennt.
4. §9.5: Neptunbahnpunkt weit vom Planeten → `neptune`; 30 px senkrecht daneben → Ziel unverändert.
5. §9.6: Neuer Kontext mit `hasTouch: true` (`browser.newContext` in `browser_run_code_unsafe`), `page.touchscreen.tap` auf Mars → `mars`; Druck mit 6 px Verschiebung über CDP `Input.dispatchTouchEvent` (touchStart, touchMove, touchEnd) → Azimut und Ziel unverändert.
6. §9.7: Skript aus Task 1 Schritt 1, Teil b, und derselbe Ablauf mit `page.mouse.click` auf einen Körper im Bild: Modus `attached`, `running` `false` nach 3,5 s.
7. §9.8: Bildabstände über `performance.now()` je 10 s bei 365 d/s, Zeiger ruhend über freier Canvasfläche nahe den Bahnen gegen Zeiger über einem Panel; Mittelwert Δ ≤ 1 ms, Maximum ≤ 25 ms. Dazu der Node-Wert aus Task 3.

- [ ] **Schritt 3: Protokoll schreiben**

`docs/klickflaechen-abnahme.md` mit den Abschnitten: Stand (Commit, Testzahl),
Vorher-Belege, Ergebnisse §9.2–§9.8 als Tabelle (Kriterium, Messwert, erfüllt/nicht
erfüllt), Rulings aus dem Ledger, Bekannte Unschärfen. Playwright-Dateien löschen.

- [ ] **Schritt 4: Abschluss**

Run: `npm run lint && npm test && npm run build`, Ausgabe zeigen.
```bash
git add docs/klickflaechen-abnahme.md
git commit -m "Abnahme Klickflächen: Protokoll"
git switch master && git merge --ff-only klickflaechen && git branch -d klickflaechen
```
Wortprüfung über alle versionierten Dateien nach der lokalen Projektanleitung muss
leer sein.
Stand in der lokalen Projektanleitung nachtragen (nicht versioniert).

---

## Ledger (Rulings und Messwerte während der Umsetzung)

| Task | Eintrag |
|---|---|
| 1 | Commit `0236803`, 1962 Tests grün, Lint/Build grün. Vorher-Belege §9.1 gemessen (a: 2259,09 px bei 1,5 s, danach `null`, Modus `free`; b: Modus `cinema`, `laeuft: true`). Vorab-Ruling 2 umgesetzt: Controller-Kommentar (`controller.ts` Z. 50–55) um das Einfrieren beim Kamera-Panel-Umschalten nachgezogen. Review clean, 1 Minor zurückgestellt (Skriptabweichungen im Vorher-Beleg nur über den Bericht belegt). Details: `docs/klickflaechen-abnahme.md` Abschnitt 2. |
| 2 | Commits `803a12d`, `6c28e41` (Fixrunde 1), 1963 Tests grün vor der Fixrunde (die Fixrunde ändert nur einen Testkommentar). Ruling: Der Critical-Befund der Prüfung gilt als erledigt, die falsche Ursachenerklärung im Umsetzerbericht als Minor; die tatsächliche Ursache der veralteten Blickmatrix (`camera.lookAt` setzt die Quaternion vor `updateWorldMatrix`) steht im Ledger. 1 weiterer Minor zurückgestellt. Details: `docs/klickflaechen-abnahme.md` Abschnitt 5 (Ruling 1) und 7. |
| 3 | Commit `a900a66`, 1975 Tests grün (`treffer.test.ts` 12). Node-Messwert §4.5 (34 Bahnen × 513 Punkte + Projektion): 0,432 / 0,414 / 0,419 ms je Bild, Kriterium < 1 ms erfüllt. Review clean, 1 Minor zurückgestellt (Gleichstand in Rang 3 bei ≥ 3 Scheiben theoretisch reihenfolgeabhängig). |
| 4 | Commit `9bf24d4`, 1982 Tests grün, mit Vorab-Ruling 3 (zwei zusätzliche Prüfungen aus Entwurf §8: Versatz bei Glyphenwechsel, kein Rechteck für nicht gezeigte Namen). Review clean, 1 Minor zurückgestellt (`namensRechtecke()`/`trefferScheiben()` geben interne Arrays zurück). |
| 5 | Commits `f07d3a4`, `91e6b74` (Fixrunde 1), 1990 Tests grün (`input.test.ts` 8, nach der Fixrunde 9). Ruling: Test mit versetztem Rechteck (`clientX − rect.left`) gegen Rot-Nachweis ohne die Umrechnung ergänzt. 2 Minor zurückgestellt (redundanter Wächter in der Tippbedingung; ein entfallener Kommentar, in der Fixwelle nach 7b wieder eingesetzt). Details: `docs/klickflaechen-abnahme.md` Abschnitt 5 (Ruling 2) und 7. |
| 6 | Commits `06b0498`, `084a958` (Fixrunde 1), 1993 Tests grün, nach der Fixrunde 1994 (`scene.test.ts` 8). Ruling: Szene-Test mit echten `THREE.Line`-Objekten und projizierter Zielposition ergänzt, Rot-Nachweis ohne `visible`-Filter (`pluto` statt `neptune`). 2 Minor zurückgestellt (zwei DEV-Blöcke mit unterschiedlichem Typisierungsstil; `bahnPuffer` schrumpft nie); Rauchprobe nur über den Bericht belegt, durch Task 7 im Browser abgedeckt. Details: `docs/klickflaechen-abnahme.md` Abschnitt 5 (Ruling 3) und 7. |
| 7 | Messaufträge 7a/7b (kein eigener Commit): §9.2–§9.8 gemessen, alle Kriterien erfüllt; §9.4 mit dem Befund Mars → Deimos in der Systemansicht. Schlussprüfung „With fixes" (2 Important, 6 Minor). Fixwelle (Commits `bda469d`, `6b43f0c`, `8bab2f3`): alle Befunde behoben, 2003 Tests grün, Lint/Build grün, Nachprüfung bestätigt alle sieben Befunde ohne neue Schäden. 8 Rulings, 4 zurückgestellte Minor-Befunde der Schlussprüfung, 1 Restbefund der Nachprüfung. Vollständiges Protokoll: `docs/klickflaechen-abnahme.md`. |
