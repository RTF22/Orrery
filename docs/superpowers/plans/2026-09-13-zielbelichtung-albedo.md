# Zielbelichtung und Albedo: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Kamera belichtet auf den betrachteten Körper, und jeder Körper reflektiert mit seiner belegten geometrischen Albedo — maximale Sichtbarkeit ohne Eingriff in die Physik der Szene.

**Architecture:** Die Belichtung ist eine reine Funktion des Sonnenabstands des Zielkörpers (`render/lighting.ts`) und wird als Faktor auf `brightness` durch `scene.ts` an Punktlicht, Körper und Ringe gereicht; ein kleiner Belichtungsmesser (`render/exposure.ts`) löst das Ziel je Kameramodus auf und dämpft im logarithmischen Raum. Die Albedo wird Katalogdatum (`PhysicalData.albedo`), und `bodies.ts` normiert jede Textur beim Laden über eine reine Pixelfunktion (`render/albedo.ts`) auf diesen Wert. Sonne, Sterne, Bahnlinien und Bloom bleiben unberührt.

**Tech Stack:** TypeScript (strict), Vite, React 19, Zustand, Three.js, Vitest (Umgebung `node`), Python 3.12 mit Pillow für Messskripte.

**Spec:** `docs/superpowers/specs/2026-09-13-zielbelichtung-albedo-design.md`

## Global Constraints

- **Sprache:** Alle sichtbaren Texte ausschließlich über `ui/i18n/de.ts`, niemals als Literal im Code. Deutsch ist Standardsprache. Dieser Plan fügt keine sichtbaren Texte hinzu.
- **Commits:** Ausschließlich Jens Fricke als Autor. **Keine** `Co-Authored-By:`-Zeile, keine `Claude-Session:`-Zeile, keine Erwähnung von Claude oder Anthropic in Commit-Messages oder Dateien.
- **Schrittgröße:** Jeder Task endet in einem eigenen Commit mit grünen Tests und ist für sich abgeschlossen. Sessionlimits sind eine reale Schranke.
- **Veröffentlichung:** Das Repository bleibt privat. Der Pages-Job bleibt `workflow_dispatch`.
- **Schichtengrenze:** `src/sim/**` und `src/data/**` dürfen **nichts** aus `three`, `react` oder dem DOM importieren (von `eslint.config.js` erzwungen). `render/albedo.ts` und `render/exposure.ts` importieren ebenfalls nichts aus `three`, damit sie in der `node`-Testumgebung laufen.
- **Quellenpflicht:** Jeder Albedowert trägt seinen Quellenkommentar mit Blattname, Zeilenbezeichnung und Abrufdatum. Die Zahlen in Task 4 sind **Ausgangswerte, die gegen die genannte Quelle geprüft werden müssen** — weicht die Quelle ab, gilt die Quelle.
- **Kein Screenshot-Vergleich:** Gerenderte Bilder werden nicht automatisiert verglichen. Wo es auf das Bild ankommt, steht eine Sichtprüfung mit Pixelmessung im Task (Playwright-Screenshot, Auswertung mit Python/Pillow; Screenshots vor dem Commit aus dem Projektstamm entfernen, `.playwright-mcp/` löschen, nur gezielt `git add`).
- **Ein Umsetzer gleichzeitig:** Sichtprüfungen teilen sich den Browser; nie zwei Umsetzer parallel.
- **Entwicklungsserver:** Auf Port 5173 läuft meist schon ein Vite-Server dieses Projekts (Basis `/Solarsystem/`); erst mit `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Solarsystem/` prüfen, statt einen zweiten zu starten. Im Entwicklungslauf liegen `window.store`, `window.renderer` und `window.scene` bereit.

---

## Dateistruktur

**Neu:**

| Datei | Verantwortung |
|---|---|
| `src/render/exposure.ts` | Zielkörper der Belichtung je Kameramodus, Sollwert je Frame, gedämpfter Belichtungsmesser. Kein `three`-Import. |
| `src/render/exposure.test.ts` | Tests dazu. |
| `src/render/albedo.ts` | Reine Pixelrechnung: sRGB → linear, breitengradgewichtetes Mittel ohne Datenlücken, Albedofaktor mit Klemme, Faktor aus der Ausweichfarbe. Kein `three`-Import. |
| `src/render/albedo.test.ts` | Tests dazu. |
| `src/render/__fixtures__/textur-mittel.json` | Offline gemessene mittlere Reflexion je Textur — Kontrollwert für die Canvas-Messung und Grundlage des Katalogtests „keine Klemme". |
| `scripts/textur-mittel.py` | Erzeugt die Fixture aus `public/textures` (Pillow). |

**Geändert:**

| Datei | Änderung |
|---|---|
| `src/render/lighting.ts` | `EXPOSURE_REFERENCE`, `targetExposure()`. |
| `src/render/lighting.test.ts` | Block `targetExposure`. |
| `src/render/scene.ts` | Belichtungsmesser anlegen, `belichtet` an Licht, Körper und Ringe reichen. |
| `src/render/scene.test.ts` | Spion für `createBodyViews.update`, zwei Belichtungstests. |
| `src/sim/types.ts` | `PhysicalData.albedo?: number`. |
| `src/data/bodies/*.ts` (16 Dateien außer `sun.ts`) | `albedo` je Körper mit Quellenkommentar. |
| `src/data/index.test.ts` | Invariante und Stichproben für `albedo`. |
| `src/render/bodies.ts` | Albedofaktor je Körper: aus der Ausweichfarbe, nach dem Laden aus der Textur; Anwendung auf Farbe und Emissiv; Ablesbarkeit über `albedoFaktoren`. |
| `src/store/index.ts` | Nur falls Task 7 den Distanzausgleich senkt. |
| `docs/phase3a-abnahme.md` | Nachtrag mit Pixelmessung vorher/nachher. |

---

## Task 1: Zielbelichtung als reine Funktion

**Files:**
- Modify: `src/render/lighting.ts`
- Test: `src/render/lighting.test.ts`

**Interfaces:**
- Consumes: `irradianceFactor`, `bodyLighting`, `LightingSettings` aus `lighting.ts` (vorhanden).
- Produces: `export const EXPOSURE_REFERENCE = 1` und `export function targetExposure(zielSonnenabstandKm: number, s: LightingSettings): number` — der Faktor auf `brightness`, mit dem eine weiße Lambert-Fläche am Zielabstand `EXPOSURE_REFERENCE · brightness` linear erreicht. Task 2 ruft genau diese Funktion.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

An das Ende von `src/render/lighting.test.ts` anfügen und im Import oben `targetExposure, EXPOSURE_REFERENCE` ergänzen:

```ts
import {
  irradianceFactor, bodyLighting, MAX_COLOR_GAIN, MIN_COLOR_GAIN,
  targetExposure, EXPOSURE_REFERENCE,
} from './lighting';
```

```ts
describe('targetExposure — die Kamera belichtet auf das Ziel', () => {
  it('bringt eine weiße Lambert-Fläche am Zielabstand auf die Referenz', () => {
    // Der Renderweg: Das Material bekommt brightness · E · colorGain (= dayLevel),
    // Three gewichtet den direkten Anteil mit 1/π. Die gerenderte Strahldichte
    // der weißen Fläche ist also dayLevel / π — und die muss am Ziel genau
    // EXPOSURE_REFERENCE sein, bei jedem Abstand und jedem Ausgleich.
    for (const au of [0.4, 1, 5.2, 30, 97]) {
      for (const c of [0, 0.85, 1]) {
        const s = { ...STANDARD, brightness: 1, lightCompensation: c };
        const exposure = targetExposure(au * AU_KM, s);
        const l = bodyLighting(au * AU_KM, { ...s, brightness: s.brightness * exposure });
        expect(l.dayLevel / Math.PI, `${au} AE, c=${c}`).toBeCloseTo(EXPOSURE_REFERENCE, 10);
      }
    }
  });

  it('liefert für die Sonne im Ursprung die Referenz 1 AE: Faktor π', () => {
    // irradianceFactor gibt im Ursprung den Bezugswert 1 — die Systemschau
    // (Ziel Sonne) ist damit die Kamera bei 1 AE, ohne Sonderregel.
    expect(targetExposure(0, STANDARD)).toBeCloseTo(Math.PI, 12);
    expect(targetExposure(AU_KM, STANDARD)).toBeCloseTo(Math.PI, 12);
  });

  it('hängt nicht von der Helligkeit ab — die kommt getrennt dazu', () => {
    const eins = targetExposure(9 * AU_KM, { ...STANDARD, brightness: 1 });
    const drei = targetExposure(9 * AU_KM, { ...STANDARD, brightness: 3 });
    expect(drei).toBeCloseTo(eins, 12);
  });

  it('ist bei vollem Distanzausgleich für jeden Abstand gleich', () => {
    const s = { ...STANDARD, lightCompensation: 1 };
    expect(targetExposure(30 * AU_KM, s)).toBeCloseTo(targetExposure(0.4 * AU_KM, s), 12);
  });

  it('steigt mit dem Zielabstand, solange der Ausgleich unvollständig ist', () => {
    expect(targetExposure(30 * AU_KM, STANDARD)).toBeGreaterThan(targetExposure(AU_KM, STANDARD));
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/lighting.test.ts`
Expected: FAIL — `targetExposure` ist kein Export von `./lighting` (TypeScript-/Importfehler oder „is not a function").

- [ ] **Step 3: Implementierung schreiben**

In `src/render/lighting.ts` nach `MIN_COLOR_GAIN` einfügen:

```ts
/**
 * Belichtungsreferenz: der lineare Wert, den eine weiße Lambert-Fläche am
 * Sonnenabstand des Zielkörpers unter senkrechtem Licht erreicht. 1,0 landet
 * nach dem ACES-Tonemapping (renderer.ts) bei 232 von 255 — die Reserve bis
 * 255 bleibt für Eis und Wolken, die heller als eine graue Lambert-Fläche
 * zurückstrahlen (Albedo über 1, siehe PhysicalData.albedo).
 */
export const EXPOSURE_REFERENCE = 1;
```

Und am Ende der Datei:

```ts
/**
 * Die Kamera belichtet auf das Ziel.
 *
 * Wie eine Raumsondenkamera oder das Auge passt sich die Belichtung dem
 * Körper an, der gerade betrachtet wird — eine Aussage über das Messgerät,
 * nicht über die Szene: Der Lichtabfall bleibt so, wie `lightFalloff` und
 * `lightCompensation` ihn setzen, nur der Maßstab der ganzen Beleuchtung
 * verschiebt sich, damit das Ziel richtig belichtet ist.
 *
 * Ergebnis ist der Faktor auf `brightness`. Die Rechnung: Das Material
 * bekommt `brightness · E · colorGain` (= `dayLevel`, aus der geklemmten
 * Verstärkung), Three gewichtet den Lambert-Anteil mit 1/π. Für eine weiße
 * Fläche am Ziel soll `brightness · exposure · dayLevelRel / π` gleich
 * `EXPOSURE_REFERENCE · brightness` sein — also
 * `exposure = EXPOSURE_REFERENCE · π / dayLevelRel`, mit `dayLevelRel` dem
 * Tagniveau des Ziels bei Helligkeit 1. Im Ursprung (Sonne als Ziel) ist
 * `dayLevelRel` = 1, die Belichtung also die einer Kamera bei 1 AE.
 *
 * Eingebaut wird der Faktor auf die Bestrahlungsstärke (scene.ts), nicht auf
 * das Tonemapping: Sonne, Sterne, Bahnlinien und Bloom hängen nicht an
 * `brightness` und bleiben unverändert — eine auf Pluto belichtete Kamera
 * würde die Sonne ohnehin nur ausbrennen.
 */
export function targetExposure(zielSonnenabstandKm: number, s: LightingSettings): number {
  const dayLevelRel = bodyLighting(zielSonnenabstandKm, { ...s, brightness: 1 }).dayLevel;
  return (EXPOSURE_REFERENCE * Math.PI) / dayLevelRel;
}
```

`dayLevelRel` ist nie null: `irradianceFactor` liefert im Ursprung 1 und sonst
einen positiven Wert, die Verstärkung ist nach unten auf `MIN_COLOR_GAIN`
geklemmt.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/render/lighting.test.ts`
Expected: PASS, 20 Tests (15 bestehende plus 5 neue).

Run: `npm run lint && npx tsc --noEmit`
Expected: ohne Befund.

- [ ] **Step 5: Commit**

```bash
git add src/render/lighting.ts src/render/lighting.test.ts
git commit -m "Zielbelichtung als reine Funktion: weiße Fläche am Ziel erreicht die Referenz"
```

---

## Task 2: Belichtungsmesser — Ziel je Kameramodus und Adaption

**Files:**
- Create: `src/render/exposure.ts`
- Test: `src/render/exposure.test.ts`

**Interfaces:**
- Consumes: `targetExposure(distanceKm, s)` aus Task 1; `plannedSceneAt(nummer, szenen, seed, shuffle): PlannedScene` aus `sim/director.ts` (Feld `scene: Scene` mit `targetId` und optionalem `lookAtId`); `scaledPositionAt(id, index, jd, s)` aus `sim/scale.ts`; `smoothDamp(ist, ziel, geschwindigkeit, zeitkonstante, dt)` aus `render/camera/damping.ts`; `AppState` aus `store/types.ts`.
- Produces:
  - `export const EXPOSURE_ZEITKONSTANTE_S = 1`
  - `export function exposureTargetId(state: AppState): string`
  - `export function exposureFor(state: AppState, jd: number): number` — Sollwert, ungedämpft
  - `export interface ExposureMeter { update(state: AppState, jd: number, dt: number): number }`
  - `export function createExposureMeter(): ExposureMeter` — Task 3 legt genau einen an und ruft `update` je Frame.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/exposure.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  exposureTargetId, exposureFor, createExposureMeter, EXPOSURE_ZEITKONSTANTE_S,
} from './exposure';
import { targetExposure } from './lighting';
import { DEFAULT_STATE } from '../store';
import type { AppState } from '../store/types';
import { SCENES } from '../data/scenes';
import { bodyIndex } from '../data/index';
import { scaledPositionAt, SCALE_PRESETS } from '../sim/scale';
import { J2000 } from '../sim/time';

function mitKamera(patch: Partial<AppState['camera']>, scale = DEFAULT_STATE.scale): AppState {
  return { ...DEFAULT_STATE, scale, camera: { ...DEFAULT_STATE.camera, ...patch } };
}

describe('exposureTargetId', () => {
  it('nimmt im freien, gehefteten und folgenden Modus den Kamerazielkörper', () => {
    for (const mode of ['free', 'attached', 'follow'] as const) {
      expect(exposureTargetId(mitKamera({ mode, targetId: 'neptune' }))).toBe('neptune');
    }
  });

  it('nimmt im Kino-Modus den angesehenen Körper der geplanten Szene, sonst den Standort', () => {
    // Ohne Mischen ist Szene Nr. n der Eintrag n des Katalogs (sceneIndexFor).
    for (let n = 0; n < SCENES.length; n++) {
      const szene = SCENES[n]!;
      const state: AppState = {
        ...mitKamera({ mode: 'cinema' }),
        cinema: { ...DEFAULT_STATE.cinema, running: true, shuffle: false, nummer: n },
      };
      expect(exposureTargetId(state), szene.id).toBe(szene.lookAtId ?? szene.targetId);
    }
  });
});

describe('exposureFor', () => {
  it('belichtet bei Ziel Sonne auf die Referenz 1 AE: Faktor π', () => {
    expect(exposureFor(mitKamera({ targetId: 'sun' }), J2000)).toBeCloseTo(Math.PI, 12);
  });

  it('belichtet auf den dargestellten Sonnenabstand des Ziels', () => {
    const s = SCALE_PRESETS.realistisch;
    const state = mitKamera({ mode: 'attached', targetId: 'neptune' }, { ...s, preset: 'realistisch' });
    const p = scaledPositionAt('neptune', bodyIndex, J2000, s);
    const erwartet = targetExposure(Math.hypot(p.x, p.y, p.z), state.display);
    expect(exposureFor(state, J2000)).toBeCloseTo(erwartet, 10);
    expect(erwartet).toBeGreaterThan(Math.PI);
  });
});

describe('createExposureMeter — Adaption', () => {
  const sonne = mitKamera({ targetId: 'sun' });
  const neptun = mitKamera(
    { mode: 'attached', targetId: 'neptune' },
    { ...SCALE_PRESETS.realistisch, preset: 'realistisch' },
  );

  it('startet ohne Anlauf genau auf dem Sollwert des ersten Frames', () => {
    const messer = createExposureMeter();
    expect(messer.update(neptun, J2000, 0.016)).toBeCloseTo(exposureFor(neptun, J2000), 12);
  });

  it('nähert sich einem neuen Ziel monoton und ist nach fünf Zeitkonstanten angekommen', () => {
    const messer = createExposureMeter();
    messer.update(sonne, J2000, 0.016);
    const ziel = exposureFor(neptun, J2000);
    let vorher = Math.PI;
    const schritte = Math.ceil((5 * EXPOSURE_ZEITKONSTANTE_S) / 0.016);
    let wert = vorher;
    for (let i = 0; i < schritte; i++) {
      wert = messer.update(neptun, J2000, 0.016);
      expect(wert).toBeGreaterThanOrEqual(vorher - 1e-12);
      vorher = wert;
    }
    expect(Math.abs(wert / ziel - 1)).toBeLessThan(0.01);
  });

  it('dämpft im logarithmischen Raum: hoch und runter laufen spiegelbildlich', () => {
    // Zwei Messer, beide starten bei π (Ziel Sonne). Einer wechselt auf Neptun
    // (Sollwert über π), der andere auf Merkur (Sollwert unter π). Nach
    // derselben Zeit muss der zurückgelegte Anteil des Weges IM LOG-RAUM gleich
    // sein — sonst rast der eine und kriecht der andere. Der Helligkeitsregler
    // taugt hier nicht als Hebel, weil er nicht in die Belichtung eingeht
    // (siehe Test „hängt nicht von der Helligkeit ab" in lighting.test.ts).
    const hoch = createExposureMeter();
    const runter = createExposureMeter();
    hoch.update(sonne, J2000, 0.016);
    runter.update(sonne, J2000, 0.016);
    const realistisch = { ...SCALE_PRESETS.realistisch, preset: 'realistisch' };
    const zHoch = mitKamera({ mode: 'attached', targetId: 'neptune' }, realistisch);
    const zRunter = mitKamera({ mode: 'attached', targetId: 'mercury' }, realistisch);
    const sollHoch = exposureFor(zHoch, J2000);
    const sollRunter = exposureFor(zRunter, J2000);
    expect(sollHoch).toBeGreaterThan(Math.PI);
    expect(sollRunter).toBeLessThan(Math.PI);
    let wHoch = Math.PI;
    let wRunter = Math.PI;
    for (let i = 0; i < 20; i++) {
      wHoch = hoch.update(zHoch, J2000, 0.016);
      wRunter = runter.update(zRunter, J2000, 0.016);
    }
    const anteilHoch = Math.log(wHoch / Math.PI) / Math.log(sollHoch / Math.PI);
    const anteilRunter = Math.log(wRunter / Math.PI) / Math.log(sollRunter / Math.PI);
    expect(anteilHoch).toBeGreaterThan(0);
    expect(anteilHoch).toBeLessThan(1);
    expect(anteilRunter).toBeCloseTo(anteilHoch, 10);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/exposure.test.ts`
Expected: FAIL — Modul `./exposure` nicht gefunden.

- [ ] **Step 3: Implementierung schreiben**

`src/render/exposure.ts`:

```ts
import type { AppState } from '../store/types';
import { bodyIndex } from '../data/index';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';
import { scaledPositionAt } from '../sim/scale';
import { smoothDamp } from './camera/damping';
import { targetExposure } from './lighting';

/**
 * Zeitkonstante der Belichtungsanpassung in Sekunden — grob die Adaption
 * des Auges. Ein Szenenwechsel im Kino-Modus springt damit nicht in der
 * Helligkeit, sondern zieht innerhalb von rund einer Sekunde nach.
 */
export const EXPOSURE_ZEITKONSTANTE_S = 1;

/**
 * Der Körper, auf den die Kamera belichtet: im Kino-Modus der angesehene
 * Körper der geplanten Szene (`lookAtId`, sonst der Standortkörper), in den
 * Handmodi das Kameraziel. Dieselbe Auflösung wie in camera/controller.ts.
 */
export function exposureTargetId(state: AppState): string {
  if (state.camera.mode === 'cinema') {
    const { scene } = plannedSceneAt(
      state.cinema.nummer, SCENES, state.cinema.seed, state.cinema.shuffle,
    );
    return scene.lookAtId ?? scene.targetId;
  }
  return state.camera.targetId;
}

/**
 * Sollwert der Belichtung für diesen Zustand, ungedämpft. Der Sonnenabstand
 * ist der dargestellte (scaledPositionAt) — wie bei der Beleuchtung der
 * Körper, sonst passte die Belichtung nicht zum Licht, das die Szene zeigt.
 */
export function exposureFor(state: AppState, jd: number): number {
  const p = scaledPositionAt(exposureTargetId(state), bodyIndex, jd, state.scale);
  return targetExposure(Math.hypot(p.x, p.y, p.z), state.display);
}

export interface ExposureMeter {
  /** Gedämpfte Belichtung für diesen Frame — der Faktor auf `brightness`. */
  update(state: AppState, jd: number, dt: number): number;
}

/**
 * Belichtungsmesser mit Adaption. Gedämpft wird `ln(exposure)`, nicht der
 * Faktor selbst: Von 3 auf 300 und von 300 auf 3 soll der Übergang gleich
 * wirken, und im Faktor-Raum würde der erste rasen und der zweite kriechen.
 * Der erste Frame setzt den Wert direkt — die Seite soll nicht aus dem
 * Dunkel hochfahren. Der Zustand lebt hier und nicht im Store: Er ist kein
 * einstellbarer Zustand, sondern ein Nachlauf.
 */
export function createExposureMeter(): ExposureMeter {
  let logIst: number | null = null;
  const geschwindigkeit = { wert: 0 };
  return {
    update(state, jd, dt) {
      const logZiel = Math.log(exposureFor(state, jd));
      if (logIst === null) {
        logIst = logZiel;
      } else {
        logIst = smoothDamp(logIst, logZiel, geschwindigkeit, EXPOSURE_ZEITKONSTANTE_S, dt);
      }
      return Math.exp(logIst);
    },
  };
}
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/render/exposure.test.ts`
Expected: PASS, 7 Tests.

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: ohne Befund; Gesamtzahl 691 + 5 (Task 1) + 7 = 703 Tests.

- [ ] **Step 5: Commit**

```bash
git add src/render/exposure.ts src/render/exposure.test.ts
git commit -m "Belichtungsmesser: Ziel je Kameramodus, Adaption im logarithmischen Raum"
```

---

## Task 3: Einbau in die Szene

**Files:**
- Modify: `src/render/scene.ts` (Importe, `buildScene`, `update`)
- Test: `src/render/scene.test.ts`

**Interfaces:**
- Consumes: `createExposureMeter()` aus Task 2; `LightingSettings` aus `lighting.ts`; die vorhandenen Signaturen `koerper.update(jd, s, cameraKm, visible, licht)`, `ringe.update(jd, s, cameraKm, visible, licht, sonneRender)`.
- Produces: nichts Neues nach außen — `SceneHandle` bleibt unverändert. Das je Frame gebildete Objekt heißt `belichtet` und ersetzt `state.display` an genau drei Stellen: Punktlicht, Körper, Ringe.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

In `src/render/scene.test.ts` den Ersatz für `./bodies` so ändern, dass der `update`-Spion von außen lesbar ist. Die Zeilen

```ts
vi.mock('./bodies', () => ({
  createBodyViews: () => ({ meshes: new Map(), update: vi.fn() }),
}));
```

ersetzen durch

```ts
const koerperUpdateSpion = vi.fn();
vi.mock('./bodies', () => ({
  createBodyViews: () => ({ meshes: new Map(), update: koerperUpdateSpion }),
}));
```

Die Importzeile oben erweitern:

```ts
import type { LightingSettings } from './lighting';
import { exposureFor } from './exposure';
import { SCALE_PRESETS } from '../sim/scale';
```

Nach dem `await import` von `DEFAULT_STATE` zusätzlich:

```ts
const { AU_KM } = await import('../sim/orbit');
const { kmToUnits } = await import('./units');
```

Und einen neuen Block am Ende der Datei:

```ts
describe('buildScene — die Kamera belichtet auf das Ziel', () => {
  /** Die Lichteinstellungen, die der letzte Körper-Update-Aufruf bekommen hat. */
  function letztesLicht(): LightingSettings {
    const aufrufe = koerperUpdateSpion.mock.calls;
    return aufrufe[aufrufe.length - 1]![4] as LightingSettings;
  }

  it('reicht bei Ziel Sonne die Helligkeit mal π an die Körper', () => {
    koerperUpdateSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    // Standardziel ist die Sonne im Ursprung: Referenz 1 AE, Faktor π.
    expect(letztesLicht().brightness).toBeCloseTo(DEFAULT_STATE.display.brightness * Math.PI, 10);
    // Alles andere aus display kommt unverändert durch.
    expect(letztesLicht().nightFill).toBe(DEFAULT_STATE.display.nightFill);
    expect(letztesLicht().lightCompensation).toBe(DEFAULT_STATE.display.lightCompensation);
  });

  it('kalibriert das Punktlicht auf die belichtete Helligkeit', () => {
    const ctx = fakeContext();
    const szene = buildScene(ctx, fakeOverlay);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    const licht = ctx.scene.children.find((o) => o instanceof THREE.PointLight) as THREE.PointLight;
    const auEinheiten = kmToUnits(AU_KM);
    const erwartet = DEFAULT_STATE.display.brightness * Math.PI
      * auEinheiten ** DEFAULT_STATE.display.lightFalloff;
    expect(licht.intensity).toBeCloseTo(erwartet, 6);
  });

  it('belichtet im ersten Frame direkt auf ein fernes Ziel und zieht danach gedämpft nach', () => {
    koerperUpdateSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay);
    const neptun = {
      ...DEFAULT_STATE,
      scale: { ...SCALE_PRESETS.realistisch, preset: 'realistisch' },
      camera: { ...DEFAULT_STATE.camera, mode: 'attached' as const, targetId: 'neptune' },
    };
    szene.update(2451545.0, 0.016, neptun);
    const soll = exposureFor(neptun, 2451545.0);
    expect(letztesLicht().brightness).toBeCloseTo(neptun.display.brightness * soll, 10);

    // Zurück zur Sonne: ein Frame später liegt der Wert zwischen beiden.
    szene.update(2451545.0, 0.016, { ...neptun, camera: { ...neptun.camera, targetId: 'sun' } });
    const dazwischen = letztesLicht().brightness;
    expect(dazwischen).toBeLessThan(neptun.display.brightness * soll);
    expect(dazwischen).toBeGreaterThan(neptun.display.brightness * Math.PI);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/scene.test.ts`
Expected: FAIL in allen drei neuen Tests — die Körper bekommen `brightness` 1 statt π; das Punktlicht steht auf `1 · AU^2`.

- [ ] **Step 3: Implementierung schreiben**

In `src/render/scene.ts` die Importe ergänzen:

```ts
import { createExposureMeter } from './exposure';
import type { LightingSettings } from './lighting';
```

In `buildScene` nach `const kamera = createCameraController(ctx.camera);`:

```ts
  // Die Kamera belichtet auf das Ziel (exposure.ts): Der Faktor geht auf die
  // Bestrahlungsstärke — Punktlicht, Körper, Ringe — und bewusst nicht auf
  // das Tonemapping. Sonne, Sterne, Bahnlinien und Bloom hängen nicht an
  // brightness und bleiben deshalb unverändert.
  const belichtung = createExposureMeter();
```

In `update` direkt nach dem Kamera-Update (vor `bahnen.update`):

```ts
      const exposure = belichtung.update(state, jd, dt);
      const belichtet: LightingSettings = {
        ...state.display, brightness: state.display.brightness * exposure,
      };
```

Dann die drei Verwendungen umstellen:

```ts
      koerper.update(jd, state.scale, cameraKm, state.visible, belichtet);
```

```ts
      ringe.update(
        jd, state.scale, cameraKm, state.visible, belichtet,
        new THREE.Vector3(lichtRender.x, lichtRender.y, lichtRender.z),
      );
```

```ts
      licht.intensity = belichtet.brightness * AU_EINHEITEN ** belichtet.lightFalloff;
      licht.decay = belichtet.lightFalloff;
```

Der Kommentar über der Kalibrierung („Bei 1 AE Abstand vom Licht soll die
Bestrahlungsstärke exakt state.display.brightness betragen") wird zu: „… exakt
die belichtete Helligkeit betragen — `brightness` mal Zielbelichtung, siehe
exposure.ts".

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/render/scene.test.ts`
Expected: PASS, 6 Tests.

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: ohne Befund, 706 Tests.

- [ ] **Step 5: Sichtprüfung — Belichtung wirkt, nichts brennt aus**

Entwicklungsserver prüfen (siehe Global Constraints), Seite mit Playwright
laden (1280 × 800), dann im Browser:

```js
const st = window.store.getState();
st.setDisplay({ orbits: false, labels: false, markers: false });
st.setCinema({ running: false });
st.setCamera({ mode: 'free', targetId: 'earth', distance: 17500000, azimuth: -1.0396, elevation: 0.35, freezeJd: null });
```

Nach 6 s Screenshot `belichtung-erde.png`. Dann Pluto (`setCinema({running:true,
shuffle:false, nummer: 9, pauseOnInput:false}); setCamera({mode:'cinema'})`, 14 s
warten) → `belichtung-pluto.png`. Auswertung mit Python/Pillow: Median und 99.
Perzentil der Scheibe (Maximum der drei Kanäle, Pixel über 12 im Umkreis der
Bildmitte, Bahnlinien und Beschriftung sind aus).

Erwartung (Vergleich mit dem Nachtrag „Tagseite ferner Körper" in
`docs/phase3a-abnahme.md`): Erde Median deutlich über 51 (Ziel: Land um 150,
Ozean um 70), 99. Perzentil unter 250; Pluto Median deutlich über 43.
Werte notieren — sie kommen in Task 7 ins Protokoll. Screenshots in den
Scratchpad verschieben, `.playwright-mcp/` löschen.

- [ ] **Step 6: Commit**

```bash
git add src/render/scene.ts src/render/scene.test.ts
git commit -m "Szene belichtet auf das Kameraziel: Faktor auf Licht, Körper und Ringe"
```

---

## Task 4: Albedo als Katalogdatum

**Files:**
- Modify: `src/sim/types.ts` (`PhysicalData`)
- Modify: `src/data/bodies/mercury.ts`, `venus.ts`, `earth.ts`, `moon.ts`, `mars.ts`, `mars-monde.ts`, `jupiter.ts`, `jupiter-monde.ts`, `saturn.ts`, `saturn-monde.ts`, `uranus.ts`, `uranus-monde.ts`, `neptune.ts`, `neptun-monde.ts`, `pluto-system.ts`, `zwergplaneten.ts`
- Test: `src/data/index.test.ts`

**Interfaces:**
- Produces: `PhysicalData.albedo?: number` — geometrische Albedo (V-Band), für jeden Körper außer der Sonne gesetzt. Task 5 und 6 lesen `body.physical.albedo`.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

In `src/data/index.test.ts` im Block `describe('Katalog-Invarianten', …)` anfügen:

```ts
  it('trägt für jeden beleuchteten Körper eine geometrische Albedo, die Sonne keine', () => {
    for (const body of bodies) {
      if (body.kind === 'star') {
        expect(body.physical.albedo, body.id).toBeUndefined();
        continue;
      }
      // Grenzen aus der Physik: unter 0,02 gibt es im Katalog nichts (die
      // dunkelsten Körper, Kometenkerne, liegen bei 0,04), über 1,5 auch
      // nicht (Enceladus, der hellste, bei 1,4 in manchen Quellen).
      expect(body.physical.albedo, body.id).toBeGreaterThan(0.02);
      expect(body.physical.albedo, body.id).toBeLessThan(1.5);
    }
  });

  it('hält die Fact-Sheet-Albedo der Planeten und der Sternbedeckungswerte der Zwergplaneten', () => {
    // Fängt Zahlendreher beim Übertragen — Ausgangswerte siehe Quellenkommentare.
    const erwartet: Record<string, number> = {
      mercury: 0.142, venus: 0.689, earth: 0.434, mars: 0.170,
      jupiter: 0.538, saturn: 0.499, uranus: 0.488, neptune: 0.442,
      pluto: 0.52, charon: 0.42, moon: 0.12,
      ceres: 0.090, eris: 0.96, haumea: 0.51, makemake: 0.77,
      enceladus: 1.0, iapetus: 0.275, triton: 0.72,
    };
    for (const [id, albedo] of Object.entries(erwartet)) {
      expect(getBody(id).physical.albedo, id).toBeCloseTo(albedo, 3);
    }
  });
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/data/index.test.ts`
Expected: FAIL — `albedo` ist `undefined` bei jedem Körper (Typfehler in
`tsc`, Laufzeitfehlschlag in vitest).

- [ ] **Step 3: Den Typ ändern**

In `src/sim/types.ts` in `PhysicalData` nach `rotationAtEpochDeg` einfügen:

```ts
  /**
   * Geometrische Albedo im V-Band, dimensionslos. Quelle je Datensatz im
   * Kommentar. Sie wird in render/bodies.ts als Normalalbedo der
   * Lambert-Fläche verwendet: Die Albedo-Textur wird beim Laden so
   * skaliert, dass ihre mittlere lineare Reflexion diesem Wert entspricht —
   * die Karten sind kontrastnormierte Mosaike, keine Reflexionskarten. Die
   * geometrische Albedo enthält den Oppositionseffekt und kann über 1
   * liegen; sie wird nicht abgeschnitten (dokumentierte Vereinfachung, siehe
   * docs/superpowers/specs/2026-09-13-zielbelichtung-albedo-design.md,
   * Abschnitt 4.1). Die Sonne trägt das Feld nicht — sie leuchtet selbst.
   */
  albedo?: number;
```

- [ ] **Step 4: Die Werte abrufen und eintragen**

Jeden Wert **gegen die Quelle prüfen** (Abrufdatum in den Kommentar), dann in
`physical` nach `rotationAtEpochDeg` eintragen. Muster (Erde):

```ts
    rotationAtEpochDeg: 0,
    // NSSDC Earth Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.434,
```

Ausgangswerte (Zeile „Geometric albedo" der NSSDC-Einzelblätter unter
`https://nssdc.gsfc.nasa.gov/planetary/factsheet/<name>fact.html`, Stand des
Blattes in Klammern):

| Körper | Datei | Albedo | Quelle |
|---|---|---:|---|
| mercury | `mercury.ts` | 0.142 | `mercuryfact.html` (11.01.2024) |
| venus | `venus.ts` | 0.689 | `venusfact.html` (11.01.2024) |
| earth | `earth.ts` | 0.434 | `earthfact.html` |
| moon | `moon.ts` | 0.12 | `moonfact.html` (11.01.2024) |
| mars | `mars.ts` | 0.170 | `marsfact.html` (19.05.2025) |
| phobos | `mars-monde.ts` | 0.07 | `marsfact.html`, Abschnitt „Satellites of Mars" |
| deimos | `mars-monde.ts` | 0.08 | ebenda |
| jupiter | `jupiter.ts` | 0.538 | `jupiterfact.html` (02.10.2024) |
| saturn | `saturn.ts` | 0.499 | `saturnfact.html` (18.03.2025) |
| uranus | `uranus.ts` | 0.488 | `uranusfact.html` (02.10.2024) |
| neptune | `neptune.ts` | 0.442 | `neptunefact.html` (03.10.2024) |
| pluto | `pluto-system.ts` | 0.52 | `plutofact.html` |
| charon | `pluto-system.ts` | 0.42 | `plutofact.html`, Abschnitt Charon |

Zeile „Visual geometric albedo" der NSSDC-Satellitenblätter:

| Körper | Datei | Albedo | Quelle |
|---|---|---:|---|
| io | `jupiter-monde.ts` | 0.62 | `joviansatfact.html` (06.12.2023) |
| europa | `jupiter-monde.ts` | 0.68 | ebenda |
| ganymede | `jupiter-monde.ts` | 0.44 | ebenda |
| callisto | `jupiter-monde.ts` | 0.19 | ebenda |
| mimas | `saturn-monde.ts` | 0.6 | `saturniansatfact.html` (22.07.2025) |
| enceladus | `saturn-monde.ts` | 1.0 | ebenda |
| tethys | `saturn-monde.ts` | 0.8 | ebenda |
| dione | `saturn-monde.ts` | 0.7 | ebenda |
| rhea | `saturn-monde.ts` | 0.7 | ebenda |
| titan | `saturn-monde.ts` | 0.22 | ebenda |
| iapetus | `saturn-monde.ts` | 0.275 | ebenda: „0.05 / 0.5" für Vorder-/Rückseite; Katalog trägt das Mittel, die Textur die Dichotomie (Kommentar!) |
| miranda | `uranus-monde.ts` | 0.32 | `uraniansatfact.html` (11.03.2023) |
| ariel | `uranus-monde.ts` | 0.39 | ebenda |
| umbriel | `uranus-monde.ts` | 0.21 | ebenda |
| titania | `uranus-monde.ts` | 0.27 | ebenda |
| oberon | `uranus-monde.ts` | 0.23 | ebenda |
| triton | `neptun-monde.ts` | 0.72 | `neptuniansatfact.html` (11.03.2024) |

Zwergplaneten:

| Körper | Datei | Albedo | Quelle |
|---|---|---:|---|
| ceres | `zwergplaneten.ts` | 0.090 | JPL SBDB `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=1&phys-par=1`, Parameter `albedo` 0.090 ± 0.003, Referenz dort: Li et al. (2006) Icarus 182, 143–160, V-Band |
| eris | `zwergplaneten.ts` | 0.96 | Sicardy et al., Nature 478, 493 (2011), doi 10.1038/nature10550: p_V = 0,96 +0,09/−0,04 aus der Sternbedeckung vom 06.11.2010 |
| haumea | `zwergplaneten.ts` | 0.51 | Ortiz et al., Nature 550, 219 (2017), arXiv:2006.03113: p_V = 0,51 ± 0,02 aus der Sternbedeckung vom 21.01.2017; frühere Thermalwerte 0,7–0,8 |
| makemake | `zwergplaneten.ts` | 0.77 | Ortiz et al., Nature 491, 566 (2012), doi 10.1038/nature11597: p_V = 0,77 ± 0,03 aus der Sternbedeckung vom 23.04.2011 |

Für Eris, Haumea und Makemake die Unsicherheit in den Kommentar schreiben;
für Haumea zusätzlich den Hinweis auf die Streuung in der Literatur (Spec,
Abschnitt 7).

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/data/index.test.ts`
Expected: PASS.

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: ohne Befund, 708 Tests.

- [ ] **Step 6: Commit**

```bash
git add src/sim/types.ts src/data/bodies/*.ts src/data/index.test.ts
git commit -m "Geometrische Albedo als Katalogdatum für 34 Körper, belegt aus NSSDC, JPL und Nature"
```

---

## Task 5: Albedofaktor als reine Pixelrechnung, Fixture der Texturmittel

**Files:**
- Create: `src/render/albedo.ts`
- Create: `scripts/textur-mittel.py`
- Create: `src/render/__fixtures__/textur-mittel.json` (vom Skript erzeugt)
- Test: `src/render/albedo.test.ts`

**Interfaces:**
- Consumes: `bodies` aus `data/index.ts` mit `physical.albedo` (Task 4) und `appearance.textures.albedo` (Pfad, leer bei Körpern ohne Textur).
- Produces (alle ohne `three`-Import):
  - `export const LUECKEN_SCHWELLE_LINEAR = 0.005`, `ALBEDO_FAKTOR_MIN = 0.1`, `ALBEDO_FAKTOR_MAX = 30`
  - `export function srgbZuLinear(wert: number): number` — Kanalwert 0–255 → linear 0–1
  - `export function mittlereReflexion(daten: ArrayLike<number>, breite: number, hoehe: number): number | null` — RGBA-Pixel zeilenweise von +90° bis −90° Breite; breitengradgewichtet; Pixel unter der Lückenschwelle zählen nicht; `null`, wenn nichts zählt
  - `export function albedoFaktor(albedo: number | undefined, mittel: number | null): number` — `albedo / mittel`, geklemmt; 1 ohne Albedo oder ohne Mittel
  - `export function farbMittelLinear(hex: string): number` — mittlere lineare Reflexion einer `#rrggbb`-Farbe
  - Fixture-Form: `{ "quelle": string, "erzeugtAm": string, "messgroesse": string, "mittel": Record<Texturpfad, number> }`, Schlüssel wie `appearance.textures.albedo` (etwa `textures/earth/albedo.jpg`)

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/albedo.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  srgbZuLinear, mittlereReflexion, albedoFaktor, farbMittelLinear,
  LUECKEN_SCHWELLE_LINEAR, ALBEDO_FAKTOR_MIN, ALBEDO_FAKTOR_MAX,
} from './albedo';
import { bodies } from '../data/index';
import fixture from './__fixtures__/textur-mittel.json';

/** RGBA-Feld aus Grauwerten (eine Zahl je Pixel), zeilenweise. */
function grauBild(zeilen: number[][]): { daten: number[]; breite: number; hoehe: number } {
  const daten: number[] = [];
  for (const zeile of zeilen) for (const g of zeile) daten.push(g, g, g, 255);
  return { daten, breite: zeilen[0]!.length, hoehe: zeilen.length };
}

describe('srgbZuLinear', () => {
  it('bildet die Enden und das Mittelgrau der sRGB-Kurve ab', () => {
    expect(srgbZuLinear(0)).toBe(0);
    expect(srgbZuLinear(255)).toBeCloseTo(1, 12);
    // 128/255 = 0,502 → ((0,502 + 0,055) / 1,055)^2,4 = 0,2158
    expect(srgbZuLinear(128)).toBeCloseTo(0.2158, 3);
  });
});

describe('mittlereReflexion', () => {
  it('liefert für eine einfarbige Karte die lineare Reflexion dieser Farbe', () => {
    const { daten, breite, hoehe } = grauBild([[128, 128, 128, 128], [128, 128, 128, 128]]);
    expect(mittlereReflexion(daten, breite, hoehe)).toBeCloseTo(srgbZuLinear(128), 12);
  });

  it('gewichtet Polzeilen mit dem Kosinus der Breite', () => {
    // Vier Zeilen = Breiten +67,5°, +22,5°, −22,5°, −67,5°; Gewichte
    // cos = 0,3827, 0,9239, 0,9239, 0,3827. Die helle Zeile liegt am Pol:
    //   (1,0·0,3827 + 0,0513·(0,9239 + 0,9239 + 0,3827)) / 2,6131 = 0,1903,
    // ungewichtet wären es (1,0 + 3·0,0513) / 4 = 0,2885.
    const { daten, breite, hoehe } = grauBild([[255], [64], [64], [64]]);
    const gewichtet = mittlereReflexion(daten, breite, hoehe)!;
    expect(gewichtet).toBeCloseTo(0.1903, 3);
    expect(gewichtet).toBeLessThan((1 + 3 * srgbZuLinear(64)) / 4);
  });

  it('lässt Datenlücken (unbelichtete, schwarze Kartenteile) aus dem Mittel heraus', () => {
    const { daten, breite, hoehe } = grauBild([[255, 0]]);
    expect(mittlereReflexion(daten, breite, hoehe)).toBeCloseTo(1, 12);
  });

  it('liefert null, wenn kein Pixel über der Lückenschwelle liegt', () => {
    const { daten, breite, hoehe } = grauBild([[0, 0], [0, 0]]);
    expect(mittlereReflexion(daten, breite, hoehe)).toBeNull();
    expect(srgbZuLinear(1)).toBeLessThan(LUECKEN_SCHWELLE_LINEAR);
  });
});

describe('albedoFaktor', () => {
  it('normiert das Texturmittel auf die Albedo', () => {
    // Enceladus: Karte 0,178 linear, Albedo 1,0 → Faktor 5,6.
    expect(albedoFaktor(1.0, 0.178)).toBeCloseTo(5.618, 2);
  });

  it('ist 1 ohne Albedo (Sonne) und ohne Messwert (Textur noch nicht geladen)', () => {
    expect(albedoFaktor(undefined, 0.5)).toBe(1);
    expect(albedoFaktor(0.5, null)).toBe(1);
    expect(albedoFaktor(0.5, 0)).toBe(1);
  });

  it('klemmt nach oben und unten — Zahlenwächter, keine Gestaltung', () => {
    expect(albedoFaktor(1.0, 0.01)).toBe(ALBEDO_FAKTOR_MAX);
    expect(albedoFaktor(0.05, 0.9)).toBe(ALBEDO_FAKTOR_MIN);
  });
});

describe('farbMittelLinear', () => {
  it('rechnet die Ausweichfarbe in mittlere lineare Reflexion um', () => {
    expect(farbMittelLinear('#ffffff')).toBeCloseTo(1, 12);
    expect(farbMittelLinear('#000000')).toBe(0);
    expect(farbMittelLinear('#808080')).toBeCloseTo(srgbZuLinear(128), 12);
    // Kanalweise, dann Mittel: (lin(255) + lin(0) + lin(0)) / 3
    expect(farbMittelLinear('#ff0000')).toBeCloseTo(1 / 3, 12);
  });
});

describe('Katalog — kein Körper erreicht die Klemme', () => {
  it('hat für jede belegte Textur einen Messwert in der Fixture', () => {
    for (const body of bodies) {
      const pfad = body.appearance.textures.albedo;
      if (pfad === '' || body.kind === 'star') continue;
      expect(fixture.mittel[pfad as keyof typeof fixture.mittel], pfad).toBeGreaterThan(0);
    }
  });

  it('liegt mit albedo / Texturmittel für jeden Körper strikt innerhalb der Klemme', () => {
    for (const body of bodies) {
      const pfad = body.appearance.textures.albedo;
      if (pfad === '' || body.kind === 'star') continue;
      const mittel = fixture.mittel[pfad as keyof typeof fixture.mittel] as number;
      const roh = body.physical.albedo! / mittel;
      expect(roh, body.id).toBeGreaterThan(ALBEDO_FAKTOR_MIN);
      expect(roh, body.id).toBeLessThan(ALBEDO_FAKTOR_MAX);
    }
  });

  it('liegt mit albedo / Ausweichfarbe für Körper ohne Textur ebenfalls innerhalb der Klemme', () => {
    for (const body of bodies) {
      if (body.appearance.textures.albedo !== '' || body.kind === 'star') continue;
      const roh = body.physical.albedo! / farbMittelLinear(body.appearance.color);
      expect(roh, body.id).toBeGreaterThan(ALBEDO_FAKTOR_MIN);
      expect(roh, body.id).toBeLessThan(ALBEDO_FAKTOR_MAX);
    }
  });
});
```

Für den JSON-Import muss `resolveJsonModule` in `tsconfig.json` aktiv sein —
`sim/monde.fixture.test.ts` importiert bereits ein JSON auf dieselbe Weise,
das ist also schon der Fall.

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/albedo.test.ts`
Expected: FAIL — Modul `./albedo` und die Fixture fehlen.

- [ ] **Step 3: Implementierung schreiben**

`src/render/albedo.ts`:

```ts
/**
 * Albedo-Normierung als reine Pixelrechnung — ohne three, ohne DOM, damit
 * sie in der node-Testumgebung läuft. Die Canvas-Auswertung, die die Pixel
 * liefert, sitzt in bodies.ts.
 *
 * Warum überhaupt: Die Albedo-Texturen sind kontrastnormierte Mosaike, keine
 * Reflexionskarten. Die Enceladus-Karte hat ein Mittel von 0,18 linear, der
 * Körper eine Albedo von 1,0 — ohne Normierung wäre der hellste Körper des
 * Sonnensystems so grau wie der Erdmond.
 */

/**
 * Unter dieser linearen Reflexion zählt ein Pixel als Datenlücke: die
 * unbelichteten Kartenteile von Pluto (rund 30 % der Fläche) und Triton
 * (rund 38 %), siehe ASSETS.md. Die reale Albedo-Dichotomie von Iapetus
 * (dunkle Seite 0,05) liegt zehnmal darüber und zählt mit.
 */
export const LUECKEN_SCHWELLE_LINEAR = 0.005;

/**
 * Klemme des Albedofaktors — Zahlenwächter gegen eine nach dem
 * Lückenausschluss fast leere Textur, keine Gestaltung. albedo.test.ts hält
 * fest, dass kein Körper des Katalogs sie erreicht.
 */
export const ALBEDO_FAKTOR_MIN = 0.1;
export const ALBEDO_FAKTOR_MAX = 30;

/** sRGB-Kanalwert 0–255 → lineare Reflexion 0–1 (IEC 61966-2-1). */
export function srgbZuLinear(wert: number): number {
  const v = wert / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Mittlere lineare Reflexion einer Rektangularkarte.
 *
 * `daten` sind RGBA-Pixel (wie `ImageData.data`), zeilenweise von +90° bis
 * −90° Breite. Jede Zeile wiegt mit dem Kosinus ihrer Breite — auf der
 * Kugel ist eine Polzeile fast nichts, in der Karte so breit wie der
 * Äquator. Pixel unter der Lückenschwelle zählen nicht. `null`, wenn kein
 * Pixel zählt.
 */
export function mittlereReflexion(
  daten: ArrayLike<number>, breite: number, hoehe: number,
): number | null {
  let summe = 0;
  let gewichtSumme = 0;
  for (let zeile = 0; zeile < hoehe; zeile++) {
    const breiteGrad = 90 - ((zeile + 0.5) / hoehe) * 180;
    const gewicht = Math.cos((breiteGrad * Math.PI) / 180);
    for (let spalte = 0; spalte < breite; spalte++) {
      const i = (zeile * breite + spalte) * 4;
      const grau = (
        srgbZuLinear(daten[i]!) + srgbZuLinear(daten[i + 1]!) + srgbZuLinear(daten[i + 2]!)
      ) / 3;
      if (grau < LUECKEN_SCHWELLE_LINEAR) continue;
      summe += grau * gewicht;
      gewichtSumme += gewicht;
    }
  }
  return gewichtSumme > 0 ? summe / gewichtSumme : null;
}

/**
 * Faktor auf Materialfarbe und Nachtseiten-Emissiv, damit die mittlere
 * Reflexion der Textur (oder der Ausweichfarbe) der Katalog-Albedo
 * entspricht. 1 ohne Albedo (die Sonne) und ohne Messwert (Textur noch
 * nicht geladen, Canvas nicht verfügbar).
 */
export function albedoFaktor(albedo: number | undefined, mittel: number | null): number {
  if (albedo === undefined || mittel === null || !(mittel > 0)) return 1;
  return Math.min(Math.max(albedo / mittel, ALBEDO_FAKTOR_MIN), ALBEDO_FAKTOR_MAX);
}

/** Mittlere lineare Reflexion einer Ausweichfarbe `#rrggbb`. */
export function farbMittelLinear(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  return (
    srgbZuLinear((n >> 16) & 255) + srgbZuLinear((n >> 8) & 255) + srgbZuLinear(n & 255)
  ) / 3;
}
```

`scripts/textur-mittel.py` — dieselbe Rechnung wie `mittlereReflexion`, auf
dasselbe Messformat 256 × 128 verkleinert wie die Canvas-Auswertung in
Task 6:

```python
"""Mittlere lineare Reflexion jeder Albedo-Textur, breitengradgewichtet,
ohne Datenluecken — dieselbe Rechnung wie src/render/albedo.ts, hier offline
fuer die Fixture src/render/__fixtures__/textur-mittel.json.

Aufruf aus dem Projektstamm:  python scripts/textur-mittel.py
"""
import datetime
import glob
import json
import os

import numpy as np
from PIL import Image

MESS_BREITE, MESS_HOEHE = 256, 128
LUECKEN_SCHWELLE_LINEAR = 0.005


def srgb_zu_linear(kanal):
    v = kanal / 255.0
    return np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)


def mittlere_reflexion(pfad):
    bild = Image.open(pfad).convert("RGB").resize((MESS_BREITE, MESS_HOEHE), Image.BILINEAR)
    lin = srgb_zu_linear(np.asarray(bild).astype(float))
    grau = lin.mean(axis=2)
    breite_grad = 90 - (np.arange(MESS_HOEHE) + 0.5) / MESS_HOEHE * 180
    gewicht = np.cos(np.radians(breite_grad))[:, None] * np.ones_like(grau)
    zaehlt = grau >= LUECKEN_SCHWELLE_LINEAR
    if not zaehlt.any():
        return None
    return float((grau * gewicht)[zaehlt].sum() / gewicht[zaehlt].sum())


def main():
    mittel = {}
    for pfad in sorted(glob.glob(os.path.join("public", "textures", "*", "albedo.*"))):
        schluessel = pfad.replace(os.sep, "/").removeprefix("public/")
        wert = mittlere_reflexion(pfad)
        if wert is not None:
            mittel[schluessel] = round(wert, 4)
    fixture = {
        "quelle": "scripts/textur-mittel.py",
        "erzeugtAm": datetime.date.today().isoformat(),
        "messgroesse": "mittlere lineare Reflexion, 256x128, cos(Breite)-gewichtet, Pixel < 0.005 ausgeschlossen",
        "mittel": mittel,
    }
    ziel = os.path.join("src", "render", "__fixtures__", "textur-mittel.json")
    os.makedirs(os.path.dirname(ziel), exist_ok=True)
    with open(ziel, "w", encoding="utf-8", newline="\n") as f:
        json.dump(fixture, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"{len(mittel)} Texturen -> {ziel}")


if __name__ == "__main__":
    main()
```

Run: `python scripts/textur-mittel.py`
Expected: `30 Texturen -> src/render/__fixtures__/textur-mittel.json`, darin
unter anderem `textures/earth/albedo.jpg` nahe 0,14, `textures/enceladus/albedo.jpg`
nahe 0,18, `textures/callisto/albedo.jpg` nahe 0,03 (Kontrollwerte aus der
Spec, Abschnitt 4.2; Pluto und Triton liegen nach dem Lückenausschluss
**über** den dortigen 0,14 und 0,20). Der Eintrag für `textures/sun/…` darf
mit in der Fixture stehen; die Tests überspringen die Sonne.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/render/albedo.test.ts`
Expected: PASS, 12 Tests.

Fällt „strikt innerhalb der Klemme" bei einem Körper durch, ist das ein
Befund, keine Testschwäche: dann stimmt entweder die Albedo (Task 4 gegen die
Quelle prüfen) oder die Textur ist nach dem Lückenausschluss fast leer
(`ASSETS.md` konsultieren). Nicht die Klemme verschieben.

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: ohne Befund, 720 Tests.

- [ ] **Step 5: Commit**

```bash
git add src/render/albedo.ts src/render/albedo.test.ts scripts/textur-mittel.py src/render/__fixtures__/textur-mittel.json
git commit -m "Albedofaktor als reine Pixelrechnung, Texturmittel als Fixture"
```

---

## Task 6: Normierung beim Laden in bodies.ts

**Files:**
- Modify: `src/render/bodies.ts` (`KoerperEintrag`, `ladeAlbedo`, `createBodyViews`, `update`)

**Interfaces:**
- Consumes: `albedoFaktor`, `farbMittelLinear`, `mittlereReflexion` aus Task 5; `body.physical.albedo` aus Task 4.
- Produces: `mesh.userData['albedoFaktor']` je Körper-Mesh (Zahl) — Ablesbarkeit für die Sichtprüfung über `window.scene`, keine API-Änderung an `BodyViews`.

Dieser Task hat **keinen vorauslaufenden Unit-Test**: Die neue Logik ist die
Verdrahtung reiner, in Task 5 getesteter Funktionen mit `TextureLoader` und
Canvas, die es in der node-Testumgebung nicht gibt (`scene.test.ts` ersetzt
`createBodyViews` genau aus diesem Grund). Der Nachweis ist die Sichtprüfung
in Step 3 mit Pixelwerten und der Abgleich der im Browser gemessenen Mittel
gegen die Fixture — ein echter Vergleich zweier unabhängiger Messwege.

- [ ] **Step 1: Implementierung schreiben**

Importe in `src/render/bodies.ts` ergänzen:

```ts
import { albedoFaktor, farbMittelLinear, mittlereReflexion } from './albedo';
```

`KoerperEintrag` erweitern (Kommentar über dem Interface ergänzen):

```ts
/**
 * … (bestehender Kommentar zu basisFarbe) …
 *
 * `albedoFaktor` normiert die Reflexion auf die Katalog-Albedo
 * (physical.albedo): vor dem Laden aus der Ausweichfarbe, danach aus dem
 * gemessenen Mittel der Textur — siehe albedo.ts. Er geht auf die
 * Materialfarbe und auf das Nachtseiten-Emissiv, damit die Nachtseite
 * derselbe Bruchteil der Tagseite bleibt.
 */
interface KoerperEintrag {
  material: KoerperMaterial;
  basisFarbe: THREE.Color;
  albedoFaktor: number;
}
```

Messung über Canvas, vor `ladeAlbedo`:

```ts
/** Messformat der Texturauswertung — dasselbe wie in scripts/textur-mittel.py. */
const MESS_BREITE = 256;
const MESS_HOEHE = 128;

/**
 * Mittlere lineare Reflexion der geladenen Textur, über ein verkleinertes
 * Canvas. `null`, wenn kein 2D-Kontext zu haben ist — dann bleibt der
 * Faktor aus der Ausweichfarbe stehen.
 */
function texturMittelLinear(bild: CanvasImageSource): number | null {
  const canvas = document.createElement('canvas');
  canvas.width = MESS_BREITE;
  canvas.height = MESS_HOEHE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (ctx === null) return null;
  ctx.drawImage(bild, 0, 0, MESS_BREITE, MESS_HOEHE);
  const { data } = ctx.getImageData(0, 0, MESS_BREITE, MESS_HOEHE);
  return mittlereReflexion(data, MESS_BREITE, MESS_HOEHE);
}
```

`ladeAlbedo` bekommt die Albedo als Parameter und setzt den Faktor nach dem
Laden:

```ts
function ladeAlbedo(
  lader: THREE.TextureLoader, pfad: string, eintrag: KoerperEintrag, albedo: number | undefined,
): void {
  if (pfad === '') return;
  lader.load(
    pfad,
    (textur) => {
      textur.colorSpace = THREE.SRGBColorSpace;
      const { material } = eintrag;
      material.map = textur;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.emissiveMap = textur;
        material.emissive.setRGB(1, 1, 1);
      }
      eintrag.basisFarbe.setRGB(1, 1, 1);
      // Die Karte ist ein kontrastnormiertes Mosaik — erst der Faktor macht
      // aus ihrem Mittel die Albedo des Körpers (siehe albedo.ts).
      eintrag.albedoFaktor = albedoFaktor(
        albedo, texturMittelLinear(textur.image as CanvasImageSource),
      );
      material.needsUpdate = true;
    },
    undefined,
    () => { /* Fallback-Farbe bleibt bestehen; kein Log-Spam bei fehlendem Bild. */ },
  );
}
```

In `createBodyViews` den Eintrag mit dem Faktor aus der Ausweichfarbe
anlegen und den Aufruf erweitern:

```ts
    const eintrag: KoerperEintrag = {
      material,
      basisFarbe: fallbackFarbe.clone(),
      // Bis die Textur steht (und dauerhaft bei Körpern ohne Textur): die
      // Ausweichfarbe so skalieren, dass ihr Mittel der Albedo entspricht.
      albedoFaktor: albedoFaktor(body.physical.albedo, farbMittelLinear(body.appearance.color)),
    };
    eintraege.set(body.id, eintrag);
    ladeAlbedo(lader, body.appearance.textures.albedo, eintrag, body.physical.albedo);
```

In `update` die beiden Materialzuweisungen umstellen und den Faktor zur
Ablesung ins Mesh schreiben:

```ts
          const l = bodyLighting(sonnenabstandKm, licht);
          eintrag.material.color.copy(eintrag.basisFarbe)
            .multiplyScalar(l.colorGain * eintrag.albedoFaktor);
          if (eintrag.material instanceof THREE.MeshStandardMaterial) {
            eintrag.material.emissiveIntensity = l.emissiveIntensity * eintrag.albedoFaktor;
          }
          mesh.userData['albedoFaktor'] = eintrag.albedoFaktor;
```

- [ ] **Step 2: Prüfung**

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: ohne Befund, 720 Tests (unverändert — dieser Task fügt keine hinzu).

- [ ] **Step 3: Sichtprüfung — Faktoren gegen die Fixture, Pixelwerte**

Seite neu laden (Playwright, 1280 × 800), 4 s warten, dann im Browser die
Faktoren ablesen:

```js
(() => { const aus = {}; window.scene.traverse((o) => { if (o.isMesh && o.userData.albedoFaktor !== undefined) aus[o.uuid.slice(0, 4)] = o.userData.albedoFaktor; }); return aus; })()
```

Besser mit Namen: `bodies` ist im Browser nicht global — deshalb die
Faktoren mit der Fixture vergleichen: Für jeden Körper mit Textur muss
`albedo / fixture.mittel[pfad]` bis auf 3 % dem abgelesenen Faktor
entsprechen (Canvas skaliert anders als Pillow, daher die Toleranz). Dazu die
Faktoren gemeinsam mit der Meshgröße ausgeben und über die Reihenfolge von
`bodies` (data/index.ts: Sonne, Planeten, Monde, Zwergplaneten) zuordnen:

```js
(() => { const liste = []; window.scene.traverse((o) => { if (o.isMesh && o.userData.albedoFaktor !== undefined) liste.push(+o.userData.albedoFaktor.toFixed(3)); }); return liste; })()
```

Die Reihenfolge der Meshes ist die Reihenfolge von `bodies`, weil
`createBodyViews` sie in dieser Reihenfolge anlegt.

Dann die Pixelmessung aus Task 3, Step 5 wiederholen (Erde, Pluto) und um
Enceladus-hell (Nr. 13), Uranus gekippt (Nr. 16), Ringdurchflug (Nr. 11) und
Systemblick (Nr. 4) ergänzen — jeweils Median und 99. Perzentil der Scheibe
beziehungsweise, bei Ringdurchflug und Systemblick, Anteil der Pixel über 12
und 99. Perzentil des Bildes. Erwartung: Enceladus Median über 150, kein
99. Perzentil über 250; Erde wie in Task 3 (der Faktor der Erde ist
0,434 / 0,137 = 3,2 — ihre Werte steigen also gegenüber Task 3 weiter).
Screenshots in den Scratchpad, `.playwright-mcp/` löschen.

- [ ] **Step 4: Commit**

```bash
git add src/render/bodies.ts
git commit -m "Texturen beim Laden auf die Katalog-Albedo normiert"
```

---

## Task 7: Messung des Distanzausgleichs und Abnahme-Nachtrag

**Files:**
- Modify: `docs/phase3a-abnahme.md` (Nachtrag, „Offene Punkte")

Dieser Task ändert **keinen Code**. Er beantwortet die in der Spec
(Abschnitt 5) offen gelassene Frage mit einer Messung und hält alle Vorher-/
Nachher-Werte im Abnahmeprotokoll fest. Sollte die Messung eine Senkung des
Distanzausgleichs nahelegen, wird das als Empfehlung notiert — die Änderung
des Standardwerts samt Neuherleitung der Schranken in `lighting.test.ts` ist
ein eigener, kleiner Folgetask.

- [ ] **Step 1: Systemschau bei zwei Ausgleichswerten messen**

Seite laden, dann:

```js
const st = window.store.getState();
st.setDisplay({ orbits: false, labels: false, markers: false });
st.setCinema({ running: true, shuffle: false, nummer: 4, elapsedSec: 0, pauseOnInput: false });
st.setCamera({ mode: 'cinema' });
```

Nach 12 s Screenshot `systemblick-c085.png`. Dann
`st.setDisplay({ lightCompensation: 0.7 })`, 3 s warten (Adaption), Screenshot
`systemblick-c070.png`; zurück auf 0,85.

Auswertung mit Pillow: Position von Neptun und Uranus aus dem Bild (hellste
Flecken außerhalb der Bildmitte; die Bahnlinien sind aus), je Fleck Maximum
und Median. Kriterium aus der Spec: Neptun Maximum über 40, sein Median (die
Nachtseite ist bei der Größe nicht trennbar, deshalb nur diese zwei Zahlen)
über 12. Ergebnis für beide Werte notieren.

- [ ] **Step 2: Vorher-/Nachher-Tabelle zusammenstellen**

Aus den Messungen der Tasks 3 und 6 und dem Nachtrag „Tagseite ferner
Körper" (die Vorher-Werte: Erde 51, Pluto 43, Charon 23, Enceladus 34,
Uranusring `uTag` 0,58):

| Körper | vorher | nach Zielbelichtung (Task 3) | nach Albedo (Task 6) |
|---|---:|---:|---:|
| Erde, Median | 51 | … | … |
| Pluto, Median | 43 | … | … |
| Enceladus, Median | 34 | — | … |
| Uranus, Median Mittellinie | 77–81 | — | … |
| Ringdurchflug, Anteil > 12 | 54,4 % | — | … |

Alle Punkte (…) durch Messwerte ersetzen; 99. Perzentile daneben.

- [ ] **Step 3: Nachtrag schreiben**

In `docs/phase3a-abnahme.md` vor „Offene Punkte" einen Abschnitt
„Nachtrag: Zielbelichtung und Albedo (Datum)" mit: Prinzip in drei Sätzen
(Kamera belichtet auf das Ziel, Albedo als Katalogdatum, Sonne und Sterne
unverändert), der Tabelle aus Step 2, dem Ergebnis von Step 1 mit Empfehlung
zum Distanzausgleich, der Testzahl. Unter „Offene Punkte" den Eintrag
„Gesamtbelichtung" entfernen und, falls Step 1 eine Senkung nahelegt, den
Folgetask als offenen Punkt eintragen.

- [ ] **Step 4: Vollständige Prüfung**

Run: `npm run lint && npx tsc --noEmit && npm test && npm run build`
Expected: ohne Befund, 720 Tests, Build erfolgreich. Projektstamm ohne
Screenshots, ohne `.playwright-mcp/`.

- [ ] **Step 5: Commit**

```bash
git add docs/phase3a-abnahme.md
git commit -m "Abnahme-Nachtrag: Zielbelichtung und Albedo gemessen"
```

---

## Selbstprüfung des Plans

**Abdeckung der Spec.** Abschnitt 3.1 (Rechnung) → Task 1; 3.2 (Einbau) und
3.4 (Dämpfung) → Tasks 2–3; 3.3 (Ziel je Modus) → Task 2; 4.1 (Feld,
Quellen) → Task 4; 4.2 (Normierung, Lücken, Gewichtung) → Tasks 5–6; 4.3
(Klemme, Katalogtest) → Task 5; 5 (Regler, Messung des Ausgleichs) → Task 7;
6 (Prüfung) → je Task plus Task 7; 7 (Risiken: Überstrahlung, Quellen) →
Task 6 misst das 99. Perzentil, Task 4 trägt die Unsicherheiten ein.

**Namensabgleich.** `targetExposure`, `EXPOSURE_REFERENCE` (Task 1) werden in
Task 2 und 3 unter genau diesen Namen genutzt; `createExposureMeter`,
`exposureFor`, `exposureTargetId` (Task 2) in Task 3; `albedoFaktor`,
`farbMittelLinear`, `mittlereReflexion` (Task 5) in Task 6;
`PhysicalData.albedo` (Task 4) in Tasks 5–6. Das je Frame gebildete Objekt
heißt in Task 3 durchgehend `belichtet`.

**Testzahlen.** Ausgangsstand 691; Task 1 +5 = 696; Task 2 +7 = 703; Task 3
+3 = 706; Task 4 +2 = 708; Task 5 +12 = 720; Tasks 6–7 unverändert.

**Bekannte Lücke.** Task 6 verdrahtet DOM-gebundene Funktionen ohne
vorauslaufenden Unit-Test; das ist im Task begründet, der Nachweis läuft über
den Fixture-Abgleich im Browser und die Pixelmessung.
