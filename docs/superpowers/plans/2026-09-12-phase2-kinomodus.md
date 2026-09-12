# Phase 2 — Kino-Modus: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein Kino-Modus, der aus reinen Szenendaten endlos weiche Kamerafahrten spielt — reproduzierbar bei gesetztem Zufallskeim, stundenlang lauffähig ohne Speicherwachstum, mit echtem Vollbild, ausgeblendetem Mauszeiger und aktivem Wake Lock.

**Architecture:** Szenen sind Daten in `data/`, der Director ist eine **reine Funktion der Szenennummer** in `sim/` (keine wachsende Playlist — das ist die Dauerlauf-Tauglichkeit per Konstruktion), und `render/camera/cinema.ts` macht daraus ein Ziel-Transform. Der Kameramodus `cinema` reiht sich in die bestehende Modus-Fallunterscheidung ein; die kritisch gedämpfte Annäherung aus Phase 1 erzeugt die weichen Übergänge zwischen Szenen, ohne dass ein einziger Übergang eigens programmiert würde.

**Tech Stack:** TypeScript (strict), Vite, React 19, Zustand, Tailwind CSS v4, Three.js, Vitest. Browser-APIs: Fullscreen, Wake Lock, Pointer Events.

**Spec:** `docs/superpowers/specs/2026-09-11-sonnensystem-design.md`, Abschnitte 7, 8, 9.2, 11, 12 und 16 (Phase 2)

## Global Constraints

- **Sprache:** Alle sichtbaren Texte ausschließlich über `ui/i18n/de.ts`, niemals als Literal im Code. Deutsch ist Standardsprache.
- **Commits:** Ausschließlich Jens Fricke als Autor. **Keine** `Co-Authored-By:`-Zeile, keine `Claude-Session:`-Zeile, keine Erwähnung von Claude oder Anthropic in Commit-Messages oder Dateien.
- **Veröffentlichung:** Das Repository bleibt privat. Der Pages-Job bleibt `workflow_dispatch` und wird **nicht** an einen Push-Trigger gehängt.
- **Schichtengrenze:** `src/sim/**` und `src/data/**` dürfen **nichts** aus `three`, `react` oder dem DOM importieren. Die Regel wird von `eslint.config.js` erzwungen und gilt auch für den Director.
- **Zielbild:** Stabile 60 fps; der Kino-Modus darf die Bildrate nicht schlechter machen als die freie Navigation.
- **Kein Screenshot-Vergleich:** Gerenderte Bilder werden nicht automatisiert verglichen (Spec Abschnitt 12). Pro Task steht eine manuelle Sichtprüfung.

## Abweichungen vom Entwurf — begründet

1. **Szenenauswahl.** Der Entwurf nennt als Beispielszenen unter anderem „der Tanz der
   Galileischen Monde", „Blick von Pluto zurück auf die ferne Sonne" und „Marsmonde im
   Nahflug". Diese Körper gibt es erst mit dem Katalog-Ausbau in Phase 3. Der Katalog
   dieses Plans nutzt ausschließlich vorhandene Körper (Sonne, acht Planeten, Erdmond)
   und ersetzt die drei Szenen durch gleichwertige: Erdmond-Tanz statt Galileische
   Monde, Neptun statt Pluto, Merkur-Verfolgung statt Marsmonde. Weil Szenen reine
   Daten sind, kostet das Nachrüsten in Phase 3 nur neue Datensätze.
2. **`lookAtId` im Szenentyp.** Der Entwurfstyp kennt nur `targetId`. „Blick zurück auf
   die ferne Sonne" braucht aber einen Standort beim einen Körper und einen Blick auf
   einen anderen. Der Typ bekommt dafür das optionale Feld `lookAtId` (Standard:
   `targetId`).
3. **`distanceBasis` im Szenentyp.** `distanceInRadii` allein ist für die Systemschau
   unbrauchbar: Ein Vielfaches des Sonnenradius ergibt je nach Maßstabs-Preset einen
   um den Faktor 70 verschiedenen Bildausschnitt (gerechnet: Sonnenradius zu
   dargestellter Neptunbahn ist bei „Schaubild" rund 1:94, bei „Realistisch" rund
   1:6500). Der Typ bekommt deshalb `distanceBasis: 'bodyRadius' | 'systemRadius'`.
4. **Endlosbetrieb ohne Playlist-Objekt.** Der Entwurf spricht von einer Playlist, die
   der Director sequenziell oder gemischt abspielt. Umgesetzt wird sie als reine
   Funktion `plannedSceneAt(nummer, ...)` statt als Liste. Eine Liste, die über Stunden
   wächst, wäre genau das Speicherwachstum, das Abschnitt 8.3 ausschließt.

---

## Dateistruktur

| Datei | Verantwortung |
|---|---|
| `src/data/scenes.ts` | Szenenkatalog als reine Daten; `Scene`-Typ |
| `src/sim/random.ts` | Deterministischer Zufall aus einem Keim; Ziehen aus Bereichen |
| `src/sim/director.ts` | Szenenfolge und Variation als reine Funktion der Szenennummer |
| `src/render/camera/cinema.ts` | Szene + Laufzeit → Ziel-Transform (`CameraTarget`) |
| `src/render/camera/controller.ts` | erweitert um den Modus `cinema` |
| `src/store/types.ts`, `src/store/index.ts` | Zustand `cinema`, Kameramodus `cinema` |
| `src/app/cinema.ts` | Fortschalten der Szenen und Interpolation des Zeitraffers je Bild |
| `src/ui/idle.ts` | Ausblenden von Oberfläche und Mauszeiger nach Inaktivität |
| `src/ui/wakeLock.ts` | Wake Lock anfordern und freigeben |
| `src/ui/panels/CinemaPanel.tsx` | Bedienung: starten, nächste Szene, Keim, Mischen |
| `src/ui/shortcuts/useShortcuts.ts` | Tasten `C` und `N` |
| `docs/phase2-abnahme.md` | Abnahmeprotokoll inklusive Dauerlaufmessung |

---

## Task 1: Deterministischer Zufall

Der Keim ist die Grundlage der Zusicherung „gleicher Keim ergibt identische
Kamerapfade". `Math.random()` ist dafür unbrauchbar, weil es keinen setzbaren Zustand
hat.

**Files:**
- Create: `src/sim/random.ts`
- Test: `src/sim/random.test.ts`

**Interfaces:**
- Produces:
  - `createRng(seed: number): () => number` — gleichverteilt in `[0, 1)`
  - `hashSeed(seed: number, nummer: number): number` — mischt Keim und Szenennummer zu einem neuen Keim
  - `pickInRange(rng: () => number, bereich: readonly [number, number]): number`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/sim/random.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { createRng, hashSeed, pickInRange } from './random';

describe('createRng', () => {
  it('liefert bei gleichem Keim dieselbe Folge', () => {
    const a = createRng(12345);
    const b = createRng(12345);
    const folgeA = Array.from({ length: 20 }, () => a());
    const folgeB = Array.from({ length: 20 }, () => b());
    expect(folgeA).toEqual(folgeB);
  });

  it('liefert bei verschiedenen Keimen verschiedene Folgen', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toBe(b());
  });

  it('bleibt im Bereich null bis eins', () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const w = rng();
      expect(w).toBeGreaterThanOrEqual(0);
      expect(w).toBeLessThan(1);
    }
  });

  it('streut halbwegs gleichmäßig', () => {
    const rng = createRng(99);
    const faecher = [0, 0, 0, 0];
    for (let i = 0; i < 4000; i++) faecher[Math.floor(rng() * 4)]! += 1;
    // Bei Gleichverteilung sind 1000 je Fach zu erwarten; 20 Prozent
    // Spielraum fangen die statistische Schwankung ab, schlagen aber bei
    // einem kaputten Generator (etwa konstante Rückgabe) sofort an.
    for (const anzahl of faecher) {
      expect(anzahl).toBeGreaterThan(800);
      expect(anzahl).toBeLessThan(1200);
    }
  });
});

describe('hashSeed', () => {
  it('ist reproduzierbar', () => {
    expect(hashSeed(42, 7)).toBe(hashSeed(42, 7));
  });

  it('trennt aufeinanderfolgende Nummern deutlich', () => {
    // Ohne Durchmischung lägen benachbarte Keime dicht beieinander und die
    // ersten gezogenen Werte wären fast gleich — die Szenen sähen dann
    // trotz Variation wie Wiederholungen aus.
    const a = createRng(hashSeed(42, 7))();
    const b = createRng(hashSeed(42, 8))();
    expect(Math.abs(a - b)).toBeGreaterThan(0.05);
  });
});

describe('pickInRange', () => {
  it('bleibt in den Grenzen', () => {
    const rng = createRng(3);
    for (let i = 0; i < 500; i++) {
      const w = pickInRange(rng, [-5, 12]);
      expect(w).toBeGreaterThanOrEqual(-5);
      expect(w).toBeLessThanOrEqual(12);
    }
  });

  it('liefert bei leerem Bereich genau den Wert', () => {
    expect(pickInRange(createRng(1), [4, 4])).toBe(4);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/random.test.ts`
Expected: FAIL — `./random` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/sim/random.ts`:

```ts
/**
 * Mulberry32 — ein kleiner Generator mit 32-Bit-Zustand.
 *
 * Gewählt, weil er in wenigen Zeilen auskommt, keine Abhängigkeit braucht
 * und einen setzbaren Zustand hat: Genau das macht die Zusicherung
 * „gleicher Keim ergibt identische Kamerapfade" prüfbar. Kryptografisch
 * ist er nicht, und das muss er hier auch nicht sein.
 */
export function createRng(seed: number): () => number {
  let zustand = seed >>> 0;
  return () => {
    zustand = (zustand + 0x6d2b79f5) >>> 0;
    let t = zustand;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mischt Keim und Szenennummer zu einem eigenständigen Keim. Ohne diese
 * Durchmischung ergäben benachbarte Szenennummern fast gleiche erste
 * Zufallswerte, und die Variation sähe wie eine Wiederholung aus.
 */
export function hashSeed(seed: number, nummer: number): number {
  let h = (seed ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (nummer + 0x85ebca6b), 0xc2b2ae35) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  return Math.imul(h, 0x27d4eb2f) >>> 0;
}

/** Zieht einen Wert aus einem geschlossenen Bereich. */
export function pickInRange(rng: () => number, bereich: readonly [number, number]): number {
  const [min, max] = bereich;
  return min + (max - min) * rng();
}
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/sim/random.test.ts`
Expected: PASS, alle acht Tests

- [ ] **Step 5: Commit**

```bash
git add src/sim/random.ts src/sim/random.test.ts
git commit -m "Deterministischer Zufallsgenerator für reproduzierbare Szenen"
```

---

## Task 2: Szenentyp und Szenenkatalog

**Files:**
- Create: `src/data/scenes.ts`
- Test: `src/data/scenes.test.ts`
- Modify: `src/ui/i18n/de.ts` (ein Titelschlüssel je Szene)

**Interfaces:**
- Consumes: `bodyIndex` (Phase 1, `src/data/index.ts`)
- Produces:
  - `ScenePath = 'static' | 'orbit' | 'flyby' | 'chase' | 'system'`
  - `DistanceBasis = 'bodyRadius' | 'systemRadius'`
  - `Scene` (Felder siehe Code)
  - `SCENES: readonly Scene[]`

- [ ] **Step 1: Typ und Katalog schreiben**

`src/data/scenes.ts`:

```ts
/**
 * Wie sich die Kamera während einer Szene bewegt.
 *
 * - `static` — feste Kugelkoordinate relativ zum Standortkörper
 * - `orbit`  — dieselbe Kugelkoordinate, der Azimut läuft mit
 * - `flyby`  — geradliniger Vorbeiflug seitlich am Körper
 * - `chase`  — hinter dem Körper, ausgerichtet an seinem Geschwindigkeitsvektor
 * - `system` — Draufsicht auf das ganze System, Azimut läuft langsam mit
 */
export type ScenePath = 'static' | 'orbit' | 'flyby' | 'chase' | 'system';

/**
 * Bezugsgröße für `distanceInRadii`. `bodyRadius` ist der dargestellte
 * Radius des Standortkörpers, `systemRadius` der dargestellte Abstand des
 * äußersten Planeten. Ohne diese Unterscheidung wäre die Systemschau vom
 * Maßstabs-Preset abhängig: Sonnenradius zu Neptunbahn steht bei
 * „Schaubild" wie 1:94, bei „Realistisch" wie 1:6500.
 */
export type DistanceBasis = 'bodyRadius' | 'systemRadius';

export interface Scene {
  id: string;
  /** Schlüssel in ui/i18n/de.ts — niemals ein fertiger Text. */
  titleKey: string;
  /** Körper, an dem die Kamera hängt. */
  targetId: string;
  /** Körper, den die Kamera ansieht; fehlt er, ist es der Standortkörper. */
  lookAtId?: string;
  path: ScenePath;
  distanceBasis: DistanceBasis;
  params: {
    distanceInRadii: number;
    elevationDeg: number;
    azimuthDeg: number;
    azimuthRateDegPerSec: number;
  };
  durationSec: number;
  timeRateDaysPerSec: number;
  /**
   * Streuung je Abspielen: Azimut und Elevation additiv in Grad, Abstand
   * multiplikativ als Faktor. Ein Bereich `[0, 0]` schaltet die Variation
   * für dieses Feld ab.
   */
  variation: {
    azimuthDeg: readonly [number, number];
    elevationDeg: readonly [number, number];
    distanceFactor: readonly [number, number];
  };
}

/**
 * Der Katalog nutzt ausschließlich Körper, die Phase 1 kennt: Sonne, acht
 * Planeten, Erdmond. Die im Entwurf genannten Szenen mit Galileischen
 * Monden, Marsmonden und Pluto kommen mit dem Katalog-Ausbau in Phase 3
 * als reine Datensätze hinzu — die Szenen-Engine bleibt unangetastet.
 */
export const SCENES: readonly Scene[] = [
  {
    // Tief über dem Erdrand, langsam am Terminator entlang: Die Sonne
    // schiebt sich im Streiflicht über die Kante.
    id: 'erdaufgang',
    titleKey: 'scene.erdaufgang',
    targetId: 'earth',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 2.4, elevationDeg: 6, azimuthDeg: 0, azimuthRateDegPerSec: 1.2 },
    durationSec: 40,
    timeRateDaysPerSec: 0.02,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-4, 10], distanceFactor: [0.9, 1.3],
    },
  },
  {
    // Flacher Einfallswinkel — mit den Ringen aus Phase 3 wird daraus das
    // Streiflicht des Entwurfs; bis dahin trägt die Szene der Planet allein.
    id: 'saturn-streiflicht',
    titleKey: 'scene.saturn',
    targetId: 'saturn',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 5, elevationDeg: 4, azimuthDeg: 40, azimuthRateDegPerSec: 0.8 },
    durationSec: 35,
    timeRateDaysPerSec: 0.1,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-3, 12], distanceFactor: [0.85, 1.4],
    },
  },
  {
    // Draufsicht auf das Erde-Mond-System im Zeitraffer: Der Mond zieht in
    // gut einer halben Minute einmal herum (27,3 Tage bei 0,9 Tagen je Sekunde).
    id: 'mondtanz',
    titleKey: 'scene.mondtanz',
    targetId: 'earth',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 150, elevationDeg: 55, azimuthDeg: 0, azimuthRateDegPerSec: 0.5 },
    durationSec: 45,
    timeRateDaysPerSec: 0.9,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-25, 30], distanceFactor: [0.8, 1.2],
    },
  },
  {
    // Standort Neptun, Blick zurück zur Sonne: Sie ist von dort nur noch
    // ein sehr heller Stern.
    id: 'ferne-sonne',
    titleKey: 'scene.ferneSonne',
    targetId: 'neptune',
    lookAtId: 'sun',
    path: 'static',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 12, elevationDeg: 15, azimuthDeg: 120, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 0.5,
    variation: {
      azimuthDeg: [-40, 40], elevationDeg: [-10, 25], distanceFactor: [0.9, 1.5],
    },
  },
  {
    // Das ganze System von oben über gut ein Jahrzehnt: 30 Tage je Sekunde
    // mal 60 Sekunden sind knapp fünf Jahre; mit der Variation reicht es
    // für einen halben Jupiterumlauf.
    id: 'systemblick',
    titleKey: 'scene.systemblick',
    targetId: 'sun',
    path: 'system',
    distanceBasis: 'systemRadius',
    params: { distanceInRadii: 1.6, elevationDeg: 78, azimuthDeg: 0, azimuthRateDegPerSec: 0.9 },
    durationSec: 60,
    timeRateDaysPerSec: 30,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-25, 10], distanceFactor: [0.85, 1.25],
    },
  },
  {
    // Merkur ist der schnellste Körper im Katalog — die Verfolgung zeigt
    // die Bahnbewegung deutlicher als bei jedem anderen Planeten.
    id: 'merkurjagd',
    titleKey: 'scene.merkurjagd',
    targetId: 'mercury',
    path: 'chase',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 9, elevationDeg: 10, azimuthDeg: 0, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 2,
    variation: {
      azimuthDeg: [0, 0], elevationDeg: [-5, 20], distanceFactor: [0.8, 1.6],
    },
  },
  {
    // Geradliniger Vorbeiflug: Der Körper wächst heran, zieht seitlich
    // vorbei und schrumpft wieder — die einzige Szene mit echter Fahrt
    // statt Drehung.
    id: 'jupiter-vorbeiflug',
    titleKey: 'scene.jupiterVorbeiflug',
    targetId: 'jupiter',
    path: 'flyby',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 4, elevationDeg: 12, azimuthDeg: 200, azimuthRateDegPerSec: 0 },
    durationSec: 35,
    timeRateDaysPerSec: 0.3,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-15, 25], distanceFactor: [0.8, 1.5],
    },
  },
];
```

In `src/ui/i18n/de.ts` ergänzen (im Block vor `'model.limits'`):

```ts
  'panel.cinema': 'Kino-Modus',
  'cinema.start': 'Kino starten',
  'cinema.stop': 'Kino beenden',
  'cinema.next': 'Nächste Szene',
  'cinema.seed': 'Zufallskeim',
  'cinema.shuffle': 'Szenen mischen',
  'cinema.pauseOnInput': 'Bei Eingabe anhalten',
  'cinema.current': 'Aktuelle Szene',
  'camera.mode.cinema': 'Kinofahrt',
  'shortcuts.cinema': 'Kino-Modus starten und beenden',
  'shortcuts.nextScene': 'Nächste Szene',
  'scene.erdaufgang': 'Sonnenaufgang über dem Erdrand',
  'scene.saturn': 'Saturn im Streiflicht',
  'scene.mondtanz': 'Der Tanz des Mondes',
  'scene.ferneSonne': 'Von Neptun zur fernen Sonne',
  'scene.systemblick': 'Das System von oben',
  'scene.merkurjagd': 'Merkur auf der Innenbahn',
  'scene.jupiterVorbeiflug': 'Vorbeiflug an Jupiter',
```

- [ ] **Step 2: Integritätstest schreiben**

`src/data/scenes.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { SCENES } from './scenes';
import { bodyIndex } from './index';
import { de } from '../ui/i18n/de';

describe('Szenenkatalog', () => {
  it('erfüllt die Mindestzahl aus den Akzeptanzkriterien', () => {
    expect(SCENES.length).toBeGreaterThanOrEqual(6);
  });

  it('vergibt jede Kennung genau einmal', () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length);
  });

  it('verweist nur auf Körper, die es im Katalog gibt', () => {
    for (const szene of SCENES) {
      expect(bodyIndex, `${szene.id}: ${szene.targetId}`).toHaveProperty(szene.targetId);
      if (szene.lookAtId !== undefined) {
        expect(bodyIndex, `${szene.id}: ${szene.lookAtId}`).toHaveProperty(szene.lookAtId);
      }
    }
  });

  it('hat für jeden Titel einen Sprachschlüssel', () => {
    for (const szene of SCENES) {
      expect(de, `fehlt: ${szene.titleKey}`).toHaveProperty(szene.titleKey);
    }
  });

  it('setzt brauchbare Dauern und Abstände', () => {
    for (const szene of SCENES) {
      expect(szene.durationSec, szene.id).toBeGreaterThan(5);
      expect(szene.durationSec, szene.id).toBeLessThanOrEqual(120);
      expect(szene.params.distanceInRadii, szene.id).toBeGreaterThan(0);
    }
  });

  it('hält die Variationsbereiche in aufsteigender Reihenfolge', () => {
    for (const szene of SCENES) {
      for (const [name, bereich] of Object.entries(szene.variation)) {
        expect(bereich[0], `${szene.id}.${name}`).toBeLessThanOrEqual(bereich[1]!);
      }
    }
  });

  it('lässt den Abstand nie auf null schrumpfen', () => {
    for (const szene of SCENES) {
      expect(szene.variation.distanceFactor[0], szene.id).toBeGreaterThan(0);
    }
  });

  it('nutzt die Systembasis nur für die Systemschau', () => {
    // Die Bezugsgröße gehört zur Pfadart: Ein Vorbeiflug in Vielfachen der
    // Neptunbahn wäre kein Vorbeiflug mehr.
    for (const szene of SCENES) {
      if (szene.distanceBasis === 'systemRadius') expect(szene.path, szene.id).toBe('system');
    }
  });
});
```

- [ ] **Step 3: Tests laufen lassen**

Run: `npx vitest run src/data/scenes.test.ts src/ui/i18n`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/data/scenes.ts src/data/scenes.test.ts src/ui/i18n/de.ts
git commit -m "Szenenkatalog des Kino-Modus als reine Daten"
```

---

## Task 3: Der Director als reine Funktion

Der Kern der Dauerlauf-Tauglichkeit: Die Szenenfolge ist **keine Liste, die wächst**,
sondern eine Funktion der laufenden Nummer. Über Stunden entsteht dadurch kein einziges
zusätzliches Objekt.

**Files:**
- Create: `src/sim/director.ts`
- Test: `src/sim/director.test.ts`

**Interfaces:**
- Consumes: `createRng`, `hashSeed`, `pickInRange` (Task 1); `SCENES`, `Scene` (Task 2)
- Produces:
  - `PlannedScene = { scene: Scene; nummer: number; azimuthDeg: number; elevationDeg: number; distanceFactor: number }`
  - `sceneIndexFor(nummer: number, anzahl: number, seed: number, shuffle: boolean): number`
  - `plannedSceneAt(nummer: number, szenen: readonly Scene[], seed: number, shuffle: boolean): PlannedScene`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/sim/director.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { plannedSceneAt, sceneIndexFor } from './director';
import { SCENES } from '../data/scenes';

describe('sceneIndexFor', () => {
  it('spielt ohne Mischen der Reihe nach', () => {
    const folge = [0, 1, 2, 3, 4].map((n) => sceneIndexFor(n, 5, 123, false));
    expect(folge).toEqual([0, 1, 2, 3, 4]);
  });

  it('beginnt ohne Mischen nach der letzten Szene wieder vorn', () => {
    expect(sceneIndexFor(5, 5, 123, false)).toBe(0);
    expect(sceneIndexFor(11, 5, 123, false)).toBe(1);
  });

  it('spielt beim Mischen jede Szene einer Runde genau einmal', () => {
    const runde = [0, 1, 2, 3, 4, 5, 6].map((n) => sceneIndexFor(n, 7, 99, true));
    expect([...runde].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('mischt zwei aufeinanderfolgende Runden verschieden', () => {
    const ersteRunde = [0, 1, 2, 3, 4, 5, 6].map((n) => sceneIndexFor(n, 7, 99, true));
    const zweiteRunde = [7, 8, 9, 10, 11, 12, 13].map((n) => sceneIndexFor(n, 7, 99, true));
    expect(zweiteRunde).not.toEqual(ersteRunde);
  });

  it('wiederholt beim Rundenwechsel nicht dieselbe Szene zweimal hintereinander', () => {
    // Der Übergang von der letzten Szene einer Runde zur ersten der nächsten
    // ist die einzige Stelle, an der eine Wiederholung entstehen kann.
    for (let seed = 0; seed < 50; seed++) {
      const letzte = sceneIndexFor(6, 7, seed, true);
      const naechste = sceneIndexFor(7, 7, seed, true);
      expect(naechste, `Keim ${seed}`).not.toBe(letzte);
    }
  });
});

describe('plannedSceneAt', () => {
  it('liefert bei gleichem Keim identische Kamerapfade', () => {
    const a = [0, 1, 2, 3, 4, 5].map((n) => plannedSceneAt(n, SCENES, 4242, true));
    const b = [0, 1, 2, 3, 4, 5].map((n) => plannedSceneAt(n, SCENES, 4242, true));
    expect(a).toEqual(b);
  });

  it('liefert bei verschiedenen Keimen verschiedene Kamerapfade', () => {
    const a = plannedSceneAt(0, SCENES, 1, false);
    const b = plannedSceneAt(0, SCENES, 2, false);
    expect([a.azimuthDeg, a.elevationDeg, a.distanceFactor])
      .not.toEqual([b.azimuthDeg, b.elevationDeg, b.distanceFactor]);
  });

  it('hält die gezogenen Werte in den Bereichen der Szene', () => {
    for (let n = 0; n < 60; n++) {
      const geplant = plannedSceneAt(n, SCENES, 777, true);
      const v = geplant.scene.variation;
      const azimutVersatz = geplant.azimuthDeg - geplant.scene.params.azimuthDeg;
      const elevationVersatz = geplant.elevationDeg - geplant.scene.params.elevationDeg;
      expect(azimutVersatz).toBeGreaterThanOrEqual(v.azimuthDeg[0] - 1e-9);
      expect(azimutVersatz).toBeLessThanOrEqual(v.azimuthDeg[1] + 1e-9);
      expect(elevationVersatz).toBeGreaterThanOrEqual(v.elevationDeg[0] - 1e-9);
      expect(elevationVersatz).toBeLessThanOrEqual(v.elevationDeg[1] + 1e-9);
      expect(geplant.distanceFactor).toBeGreaterThanOrEqual(v.distanceFactor[0] - 1e-9);
      expect(geplant.distanceFactor).toBeLessThanOrEqual(v.distanceFactor[1] + 1e-9);
    }
  });

  it('bleibt in der Elevation unterhalb des Pols', () => {
    // Genau am Pol fiele die Blickrichtung mit dem Up-Vektor zusammen und
    // das Bild kippte unkontrolliert.
    for (let n = 0; n < 200; n++) {
      const geplant = plannedSceneAt(n, SCENES, n * 13 + 1, true);
      expect(Math.abs(geplant.elevationDeg)).toBeLessThan(89.5);
    }
  });

  it('bleibt auch bei sehr großer Nummer rechenbar', () => {
    // Nach einer Nacht Dauerlauf liegt die Nummer im vierstelligen Bereich.
    const geplant = plannedSceneAt(100_000, SCENES, 5, true);
    expect(Number.isFinite(geplant.azimuthDeg)).toBe(true);
    expect(geplant.nummer).toBe(100_000);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/director.test.ts`
Expected: FAIL — `./director` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/sim/director.ts`:

```ts
import type { Scene } from '../data/scenes';
import { createRng, hashSeed, pickInRange } from './random';

export interface PlannedScene {
  scene: Scene;
  /** Laufende Nummer seit dem Start des Kino-Modus. */
  nummer: number;
  azimuthDeg: number;
  elevationDeg: number;
  distanceFactor: number;
}

/** Knapp unter dem Pol — genau am Pol kippt das Bild (siehe Test). */
const MAX_ELEVATION_DEG = 89;

/**
 * Fisher-Yates auf einer Runde. Die Runde wird aus Keim und Rundennummer
 * neu erzeugt, statt fortgeschrieben zu werden: Dadurch ist die Reihenfolge
 * eine reine Funktion der Nummer und der Dauerlauf legt nichts an.
 */
function rundenreihenfolge(anzahl: number, seed: number, runde: number): number[] {
  const rng = createRng(hashSeed(seed, runde * 7919 + 13));
  const folge = Array.from({ length: anzahl }, (_, i) => i);
  for (let i = anzahl - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const merk = folge[i]!;
    folge[i] = folge[j]!;
    folge[j] = merk;
  }
  // Der Rundenwechsel ist die einzige Stelle, an der zwei gleiche Szenen
  // aufeinanderfolgen könnten. Beginnt die neue Runde mit der Szene, die
  // die vorige beendet hat, wird sie mit der zweiten getauscht.
  if (anzahl > 1 && runde > 0) {
    const vorige = rundenreihenfolge(anzahl, seed, runde - 1);
    if (folge[0] === vorige[anzahl - 1]) {
      const merk = folge[0]!;
      folge[0] = folge[1]!;
      folge[1] = merk;
    }
  }
  return folge;
}

export function sceneIndexFor(
  nummer: number, anzahl: number, seed: number, shuffle: boolean,
): number {
  if (anzahl <= 0) return 0;
  if (!shuffle) return nummer % anzahl;
  const runde = Math.floor(nummer / anzahl);
  const platz = nummer % anzahl;
  return rundenreihenfolge(anzahl, seed, runde)[platz] ?? 0;
}

/**
 * Die n-te Szene samt ihrer gezogenen Variation — vollständig aus Nummer
 * und Keim bestimmt. Zwei Läufe mit demselben Keim ergeben deshalb
 * denselben Film, ohne dass irgendetwas gespeichert werden müsste.
 */
export function plannedSceneAt(
  nummer: number, szenen: readonly Scene[], seed: number, shuffle: boolean,
): PlannedScene {
  const index = sceneIndexFor(nummer, szenen.length, seed, shuffle);
  const scene = szenen[index]!;
  const rng = createRng(hashSeed(seed, nummer));

  const elevation = scene.params.elevationDeg + pickInRange(rng, scene.variation.elevationDeg);

  return {
    scene,
    nummer,
    azimuthDeg: scene.params.azimuthDeg + pickInRange(rng, scene.variation.azimuthDeg),
    elevationDeg: Math.min(Math.max(elevation, -MAX_ELEVATION_DEG), MAX_ELEVATION_DEG),
    distanceFactor: pickInRange(rng, scene.variation.distanceFactor),
  };
}
```

Hinweis zur Rekursion in `rundenreihenfolge`: Sie geht genau eine Runde
zurück und endet dort, weil `runde > 0` geprüft wird. Der Aufwand ist damit
konstant, nicht linear in der Laufzeit.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/sim/director.test.ts`
Expected: PASS, alle elf Tests

- [ ] **Step 5: Commit**

```bash
git add src/sim/director.ts src/sim/director.test.ts
git commit -m "Director bestimmt Szenenfolge und Variation als reine Funktion"
```

---

## Task 4: Ziel-Transform der Kinofahrt

**Files:**
- Create: `src/render/camera/cinema.ts`
- Modify: `src/render/camera/controller.ts`, `src/store/types.ts`
- Test: `src/render/camera/cinema.test.ts`

**Interfaces:**
- Consumes: `PlannedScene` (Task 3); `scaledPositionAt`, `scaledRadius` (Phase 1, `sim/scale.ts`); `velocityAt` (Phase 1, `sim/orbit.ts`); `bodyIndex`; `CameraTarget` (Phase 1, `render/camera/controller.ts`)
- Produces:
  - `systemRadiusKm(jd: number, s: ScaleSettings): number`
  - `cinemaTargetFor(geplant: PlannedScene, tSek: number, jd: number, s: ScaleSettings): CameraTarget`
- Erweitert: `CameraMode` um `'cinema'`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/render/camera/cinema.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { cinemaTargetFor, systemRadiusKm } from './cinema';
import { plannedSceneAt } from '../../sim/director';
import { SCENES } from '../../data/scenes';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { bodyIndex } from '../../data/index';
import { DEFAULT_STATE } from '../../store';
import type { Scene } from '../../data/scenes';

const jd = DEFAULT_STATE.time.jd;
const s = DEFAULT_STATE.scale;

const abstand = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

/** Eine Szene mit fester Variation, damit die Erwartungen exakt sind. */
function feste(scene: Scene) {
  return {
    scene, nummer: 0,
    azimuthDeg: scene.params.azimuthDeg,
    elevationDeg: scene.params.elevationDeg,
    distanceFactor: 1,
  };
}

const szene = (id: string): Scene => SCENES.find((x) => x.id === id)!;

describe('systemRadiusKm', () => {
  it('entspricht dem dargestellten Abstand des äußersten Planeten', () => {
    const neptun = scaledPositionAt('neptune', bodyIndex, jd, s);
    expect(systemRadiusKm(jd, s)).toBeCloseTo(Math.hypot(neptun.x, neptun.y, neptun.z), 3);
  });

  it('wächst, wenn die Abstandskompression nachlässt', () => {
    const gestaucht = systemRadiusKm(jd, { ...s, distanceExponent: 0.4 });
    const echt = systemRadiusKm(jd, { ...s, distanceExponent: 1 });
    expect(echt).toBeGreaterThan(gestaucht);
  });
});

describe('cinemaTargetFor', () => {
  it('setzt den Blickpunkt auf den Standortkörper', () => {
    const ziel = cinemaTargetFor(feste(szene('saturn-streiflicht')), 0, jd, s);
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    expect(abstand(ziel.lookAtKm, saturn)).toBeLessThan(1);
  });

  it('blickt bei gesetztem lookAtId auf den anderen Körper', () => {
    // „Von Neptun zur fernen Sonne": Standort Neptun, Blick zur Sonne.
    const ziel = cinemaTargetFor(feste(szene('ferne-sonne')), 0, jd, s);
    expect(abstand(ziel.lookAtKm, { x: 0, y: 0, z: 0 })).toBeLessThan(1);

    const neptun = scaledPositionAt('neptune', bodyIndex, jd, s);
    const radius = scaledRadius(bodyIndex.neptune!, s);
    // Die Kamera steht trotzdem bei Neptun, nicht bei der Sonne.
    expect(abstand(ziel.positionKm, neptun)).toBeLessThan(radius * 30);
  });

  it('hält den vorgegebenen Abstand in Körperradien ein', () => {
    const geplant = feste(szene('saturn-streiflicht'));
    const ziel = cinemaTargetFor(geplant, 0, jd, s);
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    const erwartet = scaledRadius(bodyIndex.saturn!, s) * geplant.scene.params.distanceInRadii;
    expect(abstand(ziel.positionKm, saturn) / erwartet).toBeCloseTo(1, 2);
  });

  it('skaliert den Abstand mit dem Variationsfaktor', () => {
    const basis = feste(szene('saturn-streiflicht'));
    const weiter = { ...basis, distanceFactor: 2 };
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    const nah = abstand(cinemaTargetFor(basis, 0, jd, s).positionKm, saturn);
    const fern = abstand(cinemaTargetFor(weiter, 0, jd, s).positionKm, saturn);
    expect(fern / nah).toBeCloseTo(2, 2);
  });

  it('dreht sich bei orbit mit der vorgegebenen Rate', () => {
    const geplant = feste(szene('saturn-streiflicht'));
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    const start = cinemaTargetFor(geplant, 0, jd, s).positionKm;
    const spaeter = cinemaTargetFor(geplant, 10, jd, s).positionKm;

    // Zehn Sekunden mal 0,8 Grad je Sekunde sind acht Grad.
    const winkel = (p: { x: number; y: number }): number => Math.atan2(p.y - saturn.y, p.x - saturn.x);
    const differenzGrad = ((winkel(spaeter) - winkel(start)) * 180) / Math.PI;
    expect(differenzGrad).toBeCloseTo(8, 1);
  });

  it('steht bei static still', () => {
    const geplant = feste(szene('ferne-sonne'));
    const a = cinemaTargetFor(geplant, 0, jd, s).positionKm;
    const b = cinemaTargetFor(geplant, 20, jd, s).positionKm;
    expect(abstand(a, b)).toBeLessThan(1);
  });

  it('zieht bei flyby seitlich vorbei und kommt dem Körper in der Mitte am nächsten', () => {
    const geplant = feste(szene('jupiter-vorbeiflug'));
    const jupiter = scaledPositionAt('jupiter', bodyIndex, jd, s);
    const dauer = geplant.scene.durationSec;
    const anfang = abstand(cinemaTargetFor(geplant, 0, jd, s).positionKm, jupiter);
    const mitte = abstand(cinemaTargetFor(geplant, dauer / 2, jd, s).positionKm, jupiter);
    const ende = abstand(cinemaTargetFor(geplant, dauer, jd, s).positionKm, jupiter);

    expect(mitte).toBeLessThan(anfang);
    expect(mitte).toBeLessThan(ende);
    expect(anfang / ende).toBeCloseTo(1, 1); // symmetrisch
  });

  it('steht bei chase hinter dem Körper', () => {
    const geplant = feste(szene('merkurjagd'));
    const ziel = cinemaTargetFor(geplant, 0, jd, s);
    const merkur = scaledPositionAt('mercury', bodyIndex, jd, s);
    const nachKamera = {
      x: ziel.positionKm.x - merkur.x,
      y: ziel.positionKm.y - merkur.y,
      z: ziel.positionKm.z - merkur.z,
    };
    // Die Kamera liegt entgegen der Flugrichtung: Das Skalarprodukt aus
    // Geschwindigkeit und Kameraversatz ist negativ.
    const v = velocityAt('mercury', bodyIndex, jd);
    expect(v.x * nachKamera.x + v.y * nachKamera.y + v.z * nachKamera.z).toBeLessThan(0);
  });

  it('stellt die Systemschau auf die Systemgröße ein, nicht auf den Sonnenradius', () => {
    const geplant = feste(szene('systemblick'));
    const ziel = cinemaTargetFor(geplant, 0, jd, s);
    const erwartet = systemRadiusKm(jd, s) * geplant.scene.params.distanceInRadii;
    expect(abstand(ziel.positionKm, { x: 0, y: 0, z: 0 }) / erwartet).toBeCloseTo(1, 2);
  });

  it('liefert für jede Szene des Katalogs endliche Werte', () => {
    for (const scene of SCENES) {
      for (const t of [0, scene.durationSec / 2, scene.durationSec]) {
        const ziel = cinemaTargetFor(plannedSceneAt(0, [scene], 1, false), t, jd, s);
        for (const wert of [
          ziel.positionKm.x, ziel.positionKm.y, ziel.positionKm.z,
          ziel.lookAtKm.x, ziel.lookAtKm.y, ziel.lookAtKm.z,
        ]) {
          expect(Number.isFinite(wert), `${scene.id} bei ${t}s`).toBe(true);
        }
      }
    }
  });
});
```

Der Test braucht zusätzlich `import { velocityAt } from '../../sim/orbit';`.

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/camera/cinema.test.ts`
Expected: FAIL — `./cinema` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/render/camera/cinema.ts`:

```ts
import type { Vec3 } from '../../sim/types';
import type { ScaleSettings } from '../../sim/scale';
import type { PlannedScene } from '../../sim/director';
import type { CameraTarget } from './controller';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { velocityAt } from '../../sim/orbit';
import { bodyIndex } from '../../data/index';

const GRAD = Math.PI / 180;

/** Der äußerste Planet des Katalogs bestimmt, wie groß das System aussieht. */
const AEUSSERSTER_KOERPER = 'neptune';

export function systemRadiusKm(jd: number, s: ScaleSettings): number {
  const p = scaledPositionAt(AEUSSERSTER_KOERPER, bodyIndex, jd, s);
  return Math.hypot(p.x, p.y, p.z);
}

const normiere = (v: Vec3): Vec3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/** Kugelkoordinate um einen Anker, in Kilometern. */
function aufKugel(anker: Vec3, radius: number, azimutGrad: number, elevationGrad: number): Vec3 {
  const az = azimutGrad * GRAD;
  const el = elevationGrad * GRAD;
  return {
    x: anker.x + radius * Math.cos(el) * Math.cos(az),
    y: anker.y + radius * Math.cos(el) * Math.sin(az),
    z: anker.z + radius * Math.sin(el),
  };
}

/**
 * Übersetzt eine geplante Szene und die verstrichene Zeit in dasselbe
 * Ziel-Transform, das auch die drei Handmodi liefern. Die kritisch
 * gedämpfte Annäherung im Controller macht daraus von selbst eine weiche
 * Fahrt — auch über den Szenenwechsel hinweg, der hier nur ein Sprung des
 * Ziels ist.
 */
export function cinemaTargetFor(
  geplant: PlannedScene, tSek: number, jd: number, s: ScaleSettings,
): CameraTarget {
  const { scene, azimuthDeg, elevationDeg, distanceFactor } = geplant;
  const standort = scaledPositionAt(scene.targetId, bodyIndex, jd, s);
  const blickziel = scene.lookAtId === undefined
    ? standort
    : scaledPositionAt(scene.lookAtId, bodyIndex, jd, s);

  const basis = scene.distanceBasis === 'systemRadius'
    ? systemRadiusKm(jd, s)
    : scaledRadius(bodyIndex[scene.targetId]!, s);
  const radius = basis * scene.params.distanceInRadii * distanceFactor;

  const azimutJetzt = azimuthDeg + scene.params.azimuthRateDegPerSec * tSek;

  switch (scene.path) {
    case 'chase': {
      // Hinter dem Körper, entgegen seiner Flugrichtung — dieselbe
      // Konstruktion wie der Handmodus „Verfolgung", nur mit dem Abstand
      // der Szene.
      const v = normiere(velocityAt(scene.targetId, bodyIndex, jd));
      return {
        positionKm: {
          x: standort.x - v.x * radius,
          y: standort.y - v.y * radius,
          z: standort.z - v.z * radius + radius * Math.sin(elevationDeg * GRAD),
        },
        lookAtKm: blickziel,
      };
    }

    case 'flyby': {
      // Geradlinig seitlich vorbei: Der Versatz läuft von +2 auf -2 Radien,
      // der geringste Abstand liegt genau in der Mitte der Szene.
      const anteil = scene.durationSec > 0 ? tSek / scene.durationSec : 0;
      const versatz = (0.5 - anteil) * 4 * radius;
      const nah = aufKugel(standort, radius, azimutJetzt, elevationDeg);
      // Querrichtung: senkrecht zur Verbindung Körper–Kamera, in der Ekliptik.
      const quer = normiere({
        x: -(nah.y - standort.y), y: nah.x - standort.x, z: 0,
      });
      return {
        positionKm: {
          x: nah.x + quer.x * versatz,
          y: nah.y + quer.y * versatz,
          z: nah.z + quer.z * versatz,
        },
        lookAtKm: blickziel,
      };
    }

    case 'static':
    case 'orbit':
    case 'system':
    default:
      return {
        positionKm: aufKugel(standort, radius, azimutJetzt, elevationDeg),
        lookAtKm: blickziel,
      };
  }
}
```

- [ ] **Step 4: Kameramodus erweitern**

In `src/store/types.ts`:

```ts
export type CameraMode = 'free' | 'attached' | 'follow' | 'cinema';
```

In `src/render/camera/controller.ts` importieren und die Modusweiche um den
Kinofall ergänzen — direkt vor dem `follow`-Zweig in `targetFor`:

```ts
  if (mode === 'cinema') {
    // Der Director liefert Szene und Laufzeit über den Zustand; ohne
    // laufende Szene bleibt es bei der Systemübersicht.
    const geplant = plannedSceneAt(
      state.cinema.nummer, SCENES, state.cinema.seed, state.cinema.shuffle,
    );
    return cinemaTargetFor(geplant, state.cinema.elapsedSec, jd, s);
  }
```

Dafür in `controller.ts` ergänzen:

```ts
import { plannedSceneAt } from '../../sim/director';
import { SCENES } from '../../data/scenes';
import { cinemaTargetFor } from './cinema';
```

Der Zustand `state.cinema` entsteht in Task 5; bis dahin lässt sich der
Modus nicht auswählen, und der Zweig bleibt unerreicht.

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/render/camera/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/render/camera/cinema.ts src/render/camera/cinema.test.ts src/render/camera/controller.ts src/store/types.ts
git commit -m "Ziel-Transform der Kinofahrt für alle fünf Pfadarten"
```

---

## Task 5: Zustand des Kino-Modus

**Files:**
- Modify: `src/store/types.ts`, `src/store/index.ts`
- Test: `src/store/cinema.test.ts`

**Interfaces:**
- Produces:
  - `AppState['cinema'] = { running: boolean; nummer: number; elapsedSec: number; seed: number; shuffle: boolean; pauseOnInput: boolean; idleResumeSec: number }`
  - `setCinema(patch: Partial<AppState['cinema']>): void`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/store/cinema.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, DEFAULT_STATE } from './index';
import { toShareable, fromShareable, encodeState, decodeState } from './serialize';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('Kino-Zustand', () => {
  it('startet ausgeschaltet bei Szene null', () => {
    const { cinema } = useStore.getState();
    expect(cinema.running).toBe(false);
    expect(cinema.nummer).toBe(0);
    expect(cinema.elapsedSec).toBe(0);
  });

  it('lässt sich über setCinema ändern, ohne andere Felder zu verlieren', () => {
    useStore.getState().setCinema({ running: true });
    const { cinema } = useStore.getState();
    expect(cinema.running).toBe(true);
    expect(cinema.seed).toBe(DEFAULT_STATE.cinema.seed);
  });

  it('taucht im geteilten Zustand nur auf, wenn er vom Standard abweicht', () => {
    expect(toShareable(useStore.getState())).not.toHaveProperty('cinema');
    useStore.getState().setCinema({ seed: 4711 });
    expect(toShareable(useStore.getState())).toHaveProperty('cinema');
  });

  it('übersteht den Rundlauf durch die URL-Kodierung', () => {
    useStore.getState().setCinema({ seed: 4711, shuffle: false, nummer: 12 });
    const zustand = useStore.getState();
    const zurueck = decodeState(encodeState(zustand));
    expect(zurueck.cinema).toEqual(zustand.cinema);
  });

  it('stellt fehlende Felder aus dem Standard wieder her', () => {
    const zurueck = fromShareable({ cinema: { seed: 9 } });
    expect(zurueck.cinema.seed).toBe(9);
    expect(zurueck.cinema.shuffle).toBe(DEFAULT_STATE.cinema.shuffle);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/store/cinema.test.ts`
Expected: FAIL — `cinema` gibt es im Zustand nicht

- [ ] **Step 3: Zustand ergänzen**

In `src/store/types.ts` innerhalb von `AppState`:

```ts
  /**
   * Der Kino-Modus. `nummer` und `elapsedSec` beschreiben die Stelle im
   * endlosen Film; zusammen mit `seed` und `shuffle` ist der Film dadurch
   * vollständig reproduzierbar, ohne dass eine Playlist gespeichert wird.
   */
  cinema: {
    running: boolean;
    nummer: number;
    elapsedSec: number;
    seed: number;
    shuffle: boolean;
    /** Hält der Kino-Modus bei einer Nutzereingabe an? */
    pauseOnInput: boolean;
    /** Nach so vielen Sekunden ohne Eingabe läuft er wieder an. */
    idleResumeSec: number;
  };
```

In `src/store/index.ts` in `DEFAULT_STATE`:

```ts
  cinema: {
    running: false, nummer: 0, elapsedSec: 0,
    // Fester Standardkeim: Der erste Eindruck ist damit für alle gleich und
    // Fehlerberichte sind nachstellbar. Wer Abwechslung will, würfelt ihn
    // im Panel neu.
    seed: 20260912, shuffle: true, pauseOnInput: true, idleResumeSec: 30,
  },
```

In `interface Actions` und im Store-Rumpf:

```ts
  setCinema(patch: Partial<AppState['cinema']>): void;
```

```ts
  setCinema: (p) => set((s) => ({ cinema: { ...s.cinema, ...p } })),
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/store/`
Expected: PASS — auch die bestehenden Serialisierungstests aus Phase 1

- [ ] **Step 5: Commit**

```bash
git add src/store/types.ts src/store/index.ts src/store/cinema.test.ts
git commit -m "Zustand des Kino-Modus samt Serialisierung"
```

---

## Task 6: Fortschalten der Szenen in der Renderschleife

**Files:**
- Create: `src/app/cinema.ts`
- Modify: `src/app/main.tsx`
- Test: `src/app/cinema.test.ts`

**Interfaces:**
- Consumes: `plannedSceneAt` (Task 3), `SCENES` (Task 2), `AppState['cinema']` (Task 5)
- Produces:
  - `RATE_BLEND_SEC = 2`
  - `advanceCinema(cinema: AppState['cinema'], dtSek: number): AppState['cinema']`
  - `blendedRate(vonRate: number, nachRate: number, elapsedSec: number): number`
  - `tickCinema(dtSek: number): void` — schreibt in den Store

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/app/cinema.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { advanceCinema, blendedRate, RATE_BLEND_SEC } from './cinema';
import { DEFAULT_STATE } from '../store';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';

const basis = { ...DEFAULT_STATE.cinema, running: true };

describe('advanceCinema', () => {
  it('zählt die verstrichene Zeit hoch', () => {
    const nachher = advanceCinema(basis, 0.5);
    expect(nachher.elapsedSec).toBeCloseTo(0.5, 9);
    expect(nachher.nummer).toBe(0);
  });

  it('schaltet nach Ablauf der Szenendauer weiter', () => {
    const dauer = plannedSceneAt(0, SCENES, basis.seed, basis.shuffle).scene.durationSec;
    const nachher = advanceCinema({ ...basis, elapsedSec: dauer - 0.01 }, 0.02);
    expect(nachher.nummer).toBe(1);
    // Der Überhang geht nicht verloren, sonst driftete der Film.
    expect(nachher.elapsedSec).toBeCloseTo(0.01, 6);
  });

  it('überspringt bei einem sehr großen Zeitschritt höchstens eine Szene', () => {
    // Nach einem Tabwechsel kommt ein Riesenschritt an; er darf nicht durch
    // zwanzig Szenen springen.
    const nachher = advanceCinema(basis, 3600);
    expect(nachher.nummer).toBe(1);
  });

  it('rührt nichts an, solange der Kino-Modus aus ist', () => {
    const aus = { ...basis, running: false };
    expect(advanceCinema(aus, 5)).toEqual(aus);
  });
});

describe('blendedRate', () => {
  it('beginnt beim alten und endet beim neuen Zeitraffer', () => {
    expect(blendedRate(1, 30, 0)).toBeCloseTo(1, 6);
    expect(blendedRate(1, 30, RATE_BLEND_SEC)).toBeCloseTo(30, 6);
    expect(blendedRate(1, 30, 60)).toBeCloseTo(30, 6);
  });

  it('blendet geometrisch, nicht linear', () => {
    // Linear läge die Mitte zwischen 1 und 100 bei 50,5 — ein sichtbarer
    // Ruck. Geometrisch liegt sie bei 10.
    expect(blendedRate(1, 100, RATE_BLEND_SEC / 2)).toBeCloseTo(10, 6);
  });

  it('kommt mit einem Vorzeichenwechsel zurecht', () => {
    // Rückwärtslauf vor dem Start des Kino-Modus: Der Betrag wird geblendet,
    // das Vorzeichen des Ziels gilt sofort.
    const wert = blendedRate(-10, 30, RATE_BLEND_SEC / 2);
    expect(wert).toBeGreaterThan(0);
    expect(Number.isFinite(wert)).toBe(true);
  });

  it('kommt mit Stillstand zurecht', () => {
    expect(Number.isFinite(blendedRate(0, 30, 0.5))).toBe(true);
    expect(Number.isFinite(blendedRate(30, 0, 0.5))).toBe(true);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/app/cinema.test.ts`
Expected: FAIL — `./cinema` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/app/cinema.ts`:

```ts
import { useStore } from '../store';
import type { AppState } from '../store/types';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';

/** So lange fährt der Zeitraffer beim Szenenwechsel auf den neuen Wert. */
export const RATE_BLEND_SEC = 2;

/** Untergrenze für die geometrische Blende — 0 hat keinen Logarithmus. */
const RATE_EPS = 1e-4;

/**
 * Schaltet die Szene fort. Höchstens eine Szene je Aufruf: Ein Riesenschritt
 * nach einem Tabwechsel soll den Film nicht durchspulen, sondern nur die
 * aktuelle Szene beenden.
 */
export function advanceCinema(
  cinema: AppState['cinema'], dtSek: number,
): AppState['cinema'] {
  if (!cinema.running) return cinema;

  const geplant = plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle);
  const verstrichen = cinema.elapsedSec + dtSek;
  if (verstrichen < geplant.scene.durationSec) {
    return { ...cinema, elapsedSec: verstrichen };
  }
  return {
    ...cinema,
    nummer: cinema.nummer + 1,
    // Der Überhang wandert in die neue Szene, damit sich über Stunden kein
    // Zeitversatz aufsummiert; er wird gedeckelt, falls er die neue Szene
    // schon wieder überschreiten würde.
    elapsedSec: Math.min(verstrichen - geplant.scene.durationSec, geplant.scene.durationSec),
  };
}

/**
 * Geometrische Blende des Zeitraffers. Geometrisch, weil Zeitraffer
 * multiplikativ wirken: Von 1 auf 100 ist die gefühlte Mitte 10, nicht 50.
 */
export function blendedRate(vonRate: number, nachRate: number, elapsedSec: number): number {
  const t = Math.min(Math.max(elapsedSec / RATE_BLEND_SEC, 0), 1);
  if (t >= 1) return nachRate;
  const vorzeichen = nachRate < 0 ? -1 : 1;
  const von = Math.max(Math.abs(vonRate), RATE_EPS);
  const nach = Math.max(Math.abs(nachRate), RATE_EPS);
  return vorzeichen * von * Math.pow(nach / von, t);
}

/**
 * Ein Bild im Kino-Modus: Szene fortschalten und den Zeitraffer der Szene
 * angleichen. Wird aus der Renderschleife gerufen, nicht aus React.
 */
export function tickCinema(dtSek: number): void {
  const zustand = useStore.getState();
  if (!zustand.cinema.running) return;

  const vorher = zustand.cinema;
  const nachher = advanceCinema(vorher, dtSek);

  const geplant = plannedSceneAt(nachher.nummer, SCENES, nachher.seed, nachher.shuffle);
  // Beim Szenenwechsel ist der Ausgangswert der Zeitraffer der vorigen
  // Szene; innerhalb einer Szene ist er es ohnehin.
  const vonRate = nachher.nummer === vorher.nummer
    ? zustand.time.rateDaysPerSec
    : plannedSceneAt(vorher.nummer, SCENES, vorher.seed, vorher.shuffle)
      .scene.timeRateDaysPerSec;

  useStore.setState({
    cinema: nachher,
    time: {
      ...zustand.time,
      paused: false,
      rateDaysPerSec: blendedRate(
        vonRate, geplant.scene.timeRateDaysPerSec, nachher.elapsedSec,
      ),
    },
  });
}
```

- [ ] **Step 4: In die Renderschleife einhängen**

In `src/app/main.tsx` innerhalb des `startLoop`-Rückrufs, **vor**
`szene.update(...)`, damit Szene und Kamera im selben Bild denselben Stand
sehen:

```ts
    const stopLoop = startLoop((jd, dt) => {
      tickCinema(dt);
      const state = useStore.getState();
      szene.update(jd, dt, state);
      ...
```

Import ergänzen:

```ts
import { tickCinema } from './cinema';
```

- [ ] **Step 5: Tests prüfen**

Run: `npx vitest run src/app/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/cinema.ts src/app/cinema.test.ts src/app/main.tsx
git commit -m "Szenenfortschaltung und weiche Zeitraffer-Blende"
```

---

## Task 7: Tastenkürzel und Pause bei Nutzereingabe

**Files:**
- Modify: `src/ui/shortcuts/useShortcuts.ts`, `src/ui/App.tsx`
- Create: `src/ui/cinemaControl.ts`
- Test: `src/ui/cinemaControl.test.ts`, Erweiterung von `src/ui/shortcuts/useShortcuts.test.ts`

**Interfaces:**
- Produces:
  - `startCinema(): void`, `stopCinema(): void`, `toggleCinema(): void`, `nextScene(): void`
  - `noteUserInput(): void` — meldet eine Nutzereingabe; hält den Kino-Modus an, wenn `pauseOnInput` gilt
  - `resumeIfIdle(jetztMs: number): void` — nimmt nach `idleResumeSec` wieder auf

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/ui/cinemaControl.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  startCinema, stopCinema, toggleCinema, nextScene, noteUserInput, resumeIfIdle,
} from './cinemaControl';
import { useStore, DEFAULT_STATE } from '../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('Kino-Steuerung', () => {
  it('startet im Kameramodus Kinofahrt bei Szene null', () => {
    startCinema();
    const s = useStore.getState();
    expect(s.cinema.running).toBe(true);
    expect(s.cinema.elapsedSec).toBe(0);
    expect(s.camera.mode).toBe('cinema');
  });

  it('gibt beim Beenden die Kamera wieder frei', () => {
    startCinema();
    stopCinema();
    const s = useStore.getState();
    expect(s.cinema.running).toBe(false);
    expect(s.camera.mode).not.toBe('cinema');
  });

  it('schaltet mit toggleCinema hin und her', () => {
    toggleCinema();
    expect(useStore.getState().cinema.running).toBe(true);
    toggleCinema();
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('springt mit nextScene zur nächsten Szene und setzt die Laufzeit zurück', () => {
    startCinema();
    useStore.getState().setCinema({ elapsedSec: 12 });
    nextScene();
    expect(useStore.getState().cinema.nummer).toBe(1);
    expect(useStore.getState().cinema.elapsedSec).toBe(0);
  });

  it('hält bei einer Nutzereingabe an, wenn das eingestellt ist', () => {
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('läuft bei ausgeschalteter Einstellung durch', () => {
    useStore.getState().setCinema({ pauseOnInput: false });
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(true);
  });

  it('nimmt nach der eingestellten Ruhezeit wieder auf', () => {
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);

    const ruhe = useStore.getState().cinema.idleResumeSec;
    resumeIfIdle(Date.now() + (ruhe - 1) * 1000);
    expect(useStore.getState().cinema.running).toBe(false);

    resumeIfIdle(Date.now() + (ruhe + 1) * 1000);
    expect(useStore.getState().cinema.running).toBe(true);
  });

  it('nimmt nicht wieder auf, wenn der Kino-Modus von Hand beendet wurde', () => {
    startCinema();
    stopCinema();
    resumeIfIdle(Date.now() + 3600_000);
    expect(useStore.getState().cinema.running).toBe(false);
  });
});
```

In `src/ui/shortcuts/useShortcuts.test.ts` ergänzen:

```ts
  it('startet und beendet den Kino-Modus mit C', () => {
    handleShortcut('c');
    expect(useStore.getState().cinema.running).toBe(true);
    handleShortcut('c');
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('springt mit N zur nächsten Szene', () => {
    handleShortcut('c');
    handleShortcut('n');
    expect(useStore.getState().cinema.nummer).toBe(1);
  });
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/cinemaControl.test.ts src/ui/shortcuts/`
Expected: FAIL — `./cinemaControl` nicht auflösbar, `c`/`n` unbelegt

- [ ] **Step 3: Implementierung schreiben**

`src/ui/cinemaControl.ts`:

```ts
import { useStore, DEFAULT_STATE } from '../store';

/**
 * Der Kino-Modus wurde durch eine Nutzereingabe angehalten und darf nach
 * Ablauf der Ruhezeit von selbst wieder anlaufen. Ein Beenden von Hand
 * löscht diese Absicht — sonst startete der Film ungefragt neu.
 */
let pausiertSeitMs: number | null = null;

export function startCinema(): void {
  pausiertSeitMs = null;
  const { setCinema, setCamera } = useStore.getState();
  setCinema({ running: true, elapsedSec: 0 });
  setCamera({ mode: 'cinema' });
}

export function stopCinema(): void {
  pausiertSeitMs = null;
  const { setCinema, setCamera, camera } = useStore.getState();
  setCinema({ running: false });
  // Zurück in den freien Modus, ohne den zuletzt gewählten Körper zu
  // verlieren; der Bezugspunkt wird dabei auf die aktuelle Zeit gesetzt.
  if (camera.mode === 'cinema') {
    setCamera({ mode: 'free', freezeJd: useStore.getState().time.jd });
  }
}

export function toggleCinema(): void {
  if (useStore.getState().cinema.running) stopCinema();
  else startCinema();
}

export function nextScene(): void {
  const { cinema, setCinema } = useStore.getState();
  setCinema({ nummer: cinema.nummer + 1, elapsedSec: 0 });
}

/** Meldet eine Nutzereingabe (Taste, Maus, Berührung). */
export function noteUserInput(): void {
  const { cinema, setCinema } = useStore.getState();
  if (!cinema.running || !cinema.pauseOnInput) return;
  pausiertSeitMs = Date.now();
  setCinema({ running: false });
}

/** Nimmt den Film wieder auf, wenn lange genug nichts passiert ist. */
export function resumeIfIdle(jetztMs: number): void {
  if (pausiertSeitMs === null) return;
  const { cinema, setCinema, setCamera } = useStore.getState();
  if (jetztMs - pausiertSeitMs < cinema.idleResumeSec * 1000) return;
  pausiertSeitMs = null;
  setCinema({ running: true });
  setCamera({ mode: 'cinema' });
}

/** Nur für Tests: setzt die Pausenabsicht zurück. */
export function resetCinemaControl(): void {
  pausiertSeitMs = null;
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
}
```

In `src/ui/shortcuts/useShortcuts.ts` die beiden Tasten ergänzen (in
`handleShortcut`, vor `default`):

```ts
    case 'c':
      toggleCinema();
      return true;
    case 'n':
      nextScene();
      return true;
```

mit `import { toggleCinema, nextScene } from '../cinemaControl';`.

**Wichtig:** `handleShortcut` darf `noteUserInput` **nicht** selbst rufen —
sonst hielte `C` den Kino-Modus im selben Tastendruck wieder an. Die Meldung
der Nutzereingabe sitzt in Task 8 im Ereignis-Listener und lässt `c` und `n`
aus.

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/ui/cinemaControl.ts src/ui/cinemaControl.test.ts src/ui/shortcuts/
git commit -m "Kino-Steuerung mit Tasten C und N und Pause bei Eingabe"
```

---

## Task 8: Oberfläche und Mauszeiger ausblenden

**Files:**
- Create: `src/ui/idle.ts`
- Modify: `src/ui/App.tsx`, `src/index.css`
- Test: `src/ui/idle.test.ts`

**Interfaces:**
- Consumes: `noteUserInput`, `resumeIfIdle` (Task 7)
- Produces:
  - `IDLE_HIDE_SEC = 3`
  - `createIdleWatcher(optionen: { onIdle: () => void; onActive: () => void; onTick: (jetztMs: number) => void }): { handleInput(jetztMs: number): void; tick(jetztMs: number): void; dispose(): void }`
  - `useIdleHide(): boolean` — React-Hook, liefert „gerade untätig"

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/ui/idle.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { createIdleWatcher, IDLE_HIDE_SEC } from './idle';

describe('createIdleWatcher', () => {
  it('meldet Untätigkeit erst nach der Wartezeit', () => {
    const onIdle = vi.fn(); const onActive = vi.fn(); const onTick = vi.fn();
    const w = createIdleWatcher({ onIdle, onActive, onTick });

    w.handleInput(0);
    w.tick((IDLE_HIDE_SEC - 0.5) * 1000);
    expect(onIdle).not.toHaveBeenCalled();

    w.tick((IDLE_HIDE_SEC + 0.5) * 1000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('meldet Untätigkeit nur einmal je Ruhephase', () => {
    const onIdle = vi.fn();
    const w = createIdleWatcher({ onIdle, onActive: vi.fn(), onTick: vi.fn() });
    w.handleInput(0);
    w.tick(10_000);
    w.tick(20_000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('meldet die Rückkehr zur Aktivität', () => {
    const onActive = vi.fn();
    const w = createIdleWatcher({ onIdle: vi.fn(), onActive, onTick: vi.fn() });
    w.handleInput(0);
    w.tick(10_000);
    w.handleInput(10_100);
    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it('reicht jeden Tick weiter, damit der Kino-Modus wieder anlaufen kann', () => {
    const onTick = vi.fn();
    const w = createIdleWatcher({ onIdle: vi.fn(), onActive: vi.fn(), onTick });
    w.tick(1000);
    w.tick(2000);
    expect(onTick).toHaveBeenNthCalledWith(1, 1000);
    expect(onTick).toHaveBeenNthCalledWith(2, 2000);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/idle.test.ts`
Expected: FAIL — `./idle` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/ui/idle.ts`:

```ts
import { useEffect, useState } from 'react';
import { noteUserInput, resumeIfIdle } from './cinemaControl';

/** Nach so vielen Sekunden ohne Eingabe verschwinden UI und Mauszeiger. */
export const IDLE_HIDE_SEC = 3;

interface IdleOptionen {
  onIdle: () => void;
  onActive: () => void;
  onTick: (jetztMs: number) => void;
}

/**
 * Zählt die Zeit seit der letzten Eingabe. Bewusst ohne eigenen Timer: Die
 * Renderschleife ruft `tick`, wodurch die Uhr im Dauerlauf keine zweite
 * Zeitquelle bekommt.
 */
export function createIdleWatcher(optionen: IdleOptionen): {
  handleInput(jetztMs: number): void;
  tick(jetztMs: number): void;
  dispose(): void;
} {
  let letzteEingabeMs = Date.now();
  let untaetig = false;

  return {
    handleInput(jetztMs) {
      letzteEingabeMs = jetztMs;
      if (untaetig) {
        untaetig = false;
        optionen.onActive();
      }
    },
    tick(jetztMs) {
      optionen.onTick(jetztMs);
      if (!untaetig && jetztMs - letzteEingabeMs >= IDLE_HIDE_SEC * 1000) {
        untaetig = true;
        optionen.onIdle();
      }
    },
    dispose() { untaetig = false; },
  };
}

/**
 * Verbindet den Wächter mit den Ereignissen des Fensters und liefert, ob
 * gerade Ruhe herrscht. Der Mauszeiger wird über eine Klasse am
 * Wurzelelement ausgeblendet, damit CSS und nicht JavaScript die
 * Darstellung bestimmt.
 */
export function useIdleHide(): boolean {
  const [untaetig, setUntaetig] = useState(false);

  useEffect(() => {
    const wächter = createIdleWatcher({
      onIdle: () => { setUntaetig(true); },
      onActive: () => { setUntaetig(false); },
      onTick: (jetztMs) => { resumeIfIdle(jetztMs); },
    });

    const beiEingabe = (e: Event): void => {
      // `c` und `n` steuern den Kino-Modus selbst und gelten nicht als
      // Störung — sonst hielte der Start ihn sofort wieder an.
      const istSteuertaste = e instanceof KeyboardEvent
        && (e.key === 'c' || e.key === 'n');
      wächter.handleInput(Date.now());
      if (!istSteuertaste) noteUserInput();
    };

    const takt = window.setInterval(() => { wächter.tick(Date.now()); }, 500);
    for (const name of ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart']) {
      window.addEventListener(name, beiEingabe, { passive: true });
    }

    return () => {
      window.clearInterval(takt);
      for (const name of ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart']) {
        window.removeEventListener(name, beiEingabe);
      }
      wächter.dispose();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('zeiger-aus', untaetig);
    return () => { document.documentElement.classList.remove('zeiger-aus'); };
  }, [untaetig]);

  return untaetig;
}
```

In `src/index.css` ergänzen:

```css
/* Im Dauerlauf stört schon der Mauszeiger. Er kommt bei der nächsten
   Bewegung von selbst zurück (siehe ui/idle.ts). */
.zeiger-aus, .zeiger-aus * { cursor: none !important; }
```

In `src/ui/App.tsx` den Hook verwenden und die Oberfläche im Kino-Modus bei
Untätigkeit ausblenden:

```ts
export function App(): React.JSX.Element | null {
  useShortcuts();
  const untaetig = useIdleHide();
  const versteckt = useStore((s) => s.ui.hidden);
  const laeuftKino = useStore((s) => s.cinema.running);
  const zeigeKuerzel = useStore((s) => s.ui.panels[SHORTCUTS_PANEL] === true);

  // Im Kino-Modus verschwindet die Oberfläche nach kurzer Ruhe von selbst;
  // außerhalb bleibt sie stehen, bis H gedrückt wird.
  if (versteckt || (laeuftKino && untaetig)) return null;
  ...
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS

- [ ] **Step 5: Sichtprüfung**

Run: `npm run dev` — `C` drücken, drei Sekunden nichts tun: Panels und
Mauszeiger verschwinden. Maus bewegen: beides ist sofort wieder da, der Film
hält an. Nach 30 Sekunden Ruhe läuft er wieder.

- [ ] **Step 6: Commit**

```bash
git add src/ui/idle.ts src/ui/idle.test.ts src/ui/App.tsx src/index.css
git commit -m "Oberfläche und Mauszeiger blenden bei Untätigkeit aus"
```

---

## Task 9: Wake Lock und Vollbild

**Files:**
- Create: `src/ui/wakeLock.ts`
- Modify: `src/ui/cinemaControl.ts`, `src/ui/App.tsx`
- Test: `src/ui/wakeLock.test.ts`

**Interfaces:**
- Produces:
  - `requestWakeLock(): Promise<void>`, `releaseWakeLock(): Promise<void>`
  - `useWakeLock(aktiv: boolean): void`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/ui/wakeLock.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestWakeLock, releaseWakeLock } from './wakeLock';

const sentinel = { released: false, release: vi.fn(async () => {}), addEventListener: vi.fn() };

beforeEach(() => {
  sentinel.release.mockClear();
  Object.defineProperty(navigator, 'wakeLock', {
    configurable: true,
    value: { request: vi.fn(async () => sentinel) },
  });
});

describe('Wake Lock', () => {
  it('fordert genau eine Sperre an', async () => {
    await requestWakeLock();
    await requestWakeLock();
    expect((navigator as unknown as { wakeLock: { request: ReturnType<typeof vi.fn> } })
      .wakeLock.request).toHaveBeenCalledTimes(1);
    await releaseWakeLock();
  });

  it('gibt die Sperre wieder frei', async () => {
    await requestWakeLock();
    await releaseWakeLock();
    expect(sentinel.release).toHaveBeenCalledTimes(1);
  });

  it('läuft ohne Unterstützung im Browser einfach weiter', async () => {
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: undefined });
    // Kein Werfen: Der Kino-Modus funktioniert auch ohne Wake Lock, der
    // Bildschirm geht dann eben irgendwann aus.
    await expect(requestWakeLock()).resolves.toBeUndefined();
    await expect(releaseWakeLock()).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/wakeLock.test.ts`
Expected: FAIL — `./wakeLock` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/ui/wakeLock.ts`:

```ts
import { useEffect } from 'react';

interface WakeLockSentinelLike {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (typ: string, hoerer: () => void) => void;
}

interface NavigatorMitWakeLock {
  wakeLock?: { request: (typ: 'screen') => Promise<WakeLockSentinelLike> };
}

let sperre: WakeLockSentinelLike | null = null;

/**
 * Hält den Bildschirm wach. Die API fehlt in manchen Browsern und wird auch
 * vom System jederzeit wieder entzogen (etwa beim Tabwechsel) — beides ist
 * kein Fehlerfall, der Film läuft weiter.
 */
export async function requestWakeLock(): Promise<void> {
  if (sperre !== null) return;
  const api = (navigator as NavigatorMitWakeLock).wakeLock;
  if (api === undefined) return;
  try {
    const neu = await api.request('screen');
    sperre = neu;
    neu.addEventListener('release', () => { sperre = null; });
  } catch {
    // Verweigert (etwa im Hintergrund-Tab) — nicht weiter tragisch.
    sperre = null;
  }
}

export async function releaseWakeLock(): Promise<void> {
  const alt = sperre;
  sperre = null;
  if (alt === null) return;
  try { await alt.release(); } catch { /* schon freigegeben */ }
}

/**
 * Fordert die Sperre an, solange `aktiv` gilt, und nach einem Tabwechsel
 * erneut — das System entzieht sie dabei zuverlässig.
 */
export function useWakeLock(aktiv: boolean): void {
  useEffect(() => {
    if (!aktiv) { void releaseWakeLock(); return; }
    void requestWakeLock();

    const beiSichtbarkeit = (): void => {
      if (document.visibilityState === 'visible') void requestWakeLock();
    };
    document.addEventListener('visibilitychange', beiSichtbarkeit);
    return () => {
      document.removeEventListener('visibilitychange', beiSichtbarkeit);
      void releaseWakeLock();
    };
  }, [aktiv]);
}
```

In `src/ui/App.tsx`:

```ts
  const laeuftKino = useStore((s) => s.cinema.running);
  useWakeLock(laeuftKino);
```

In `src/ui/cinemaControl.ts` beim Start zusätzlich echtes Vollbild anfordern:

```ts
export function startCinema(): void {
  pausiertSeitMs = null;
  const { setCinema, setCamera } = useStore.getState();
  setCinema({ running: true, elapsedSec: 0 });
  setCamera({ mode: 'cinema' });
  // Vollbild braucht eine Nutzergeste; der Aufruf steht deshalb hier im
  // Tasten- beziehungsweise Klickpfad und nicht in einem Effekt.
  if (typeof document !== 'undefined' && document.fullscreenElement === null) {
    void document.documentElement.requestFullscreen?.().catch(() => { /* verweigert */ });
  }
}
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS

- [ ] **Step 5: Sichtprüfung**

Run: `npm run dev` — `C` schaltet in echtes Vollbild. In `chrome://media-internals`
oder über `navigator.wakeLock` in der Konsole prüfen, dass eine Sperre besteht;
Bildschirmschoner bleibt aus.

- [ ] **Step 6: Commit**

```bash
git add src/ui/wakeLock.ts src/ui/wakeLock.test.ts src/ui/App.tsx src/ui/cinemaControl.ts
git commit -m "Wake Lock und echtes Vollbild für den Dauerlauf"
```

---

## Task 10: Kino-Panel

**Files:**
- Create: `src/ui/panels/CinemaPanel.tsx`
- Modify: `src/ui/App.tsx`, `src/ui/panels/CameraPanel.tsx`
- Test: `src/ui/panels/CinemaPanel.test.tsx`

**Interfaces:**
- Consumes: `startCinema`, `stopCinema`, `nextScene` (Task 7); `plannedSceneAt` (Task 3); `SCENES` (Task 2)
- Produces: `<CinemaPanel />`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/ui/panels/CinemaPanel.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CinemaPanel } from './CinemaPanel';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('CinemaPanel', () => {
  it('startet und beendet den Kino-Modus', () => {
    render(<CinemaPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Kino starten/ }));
    expect(useStore.getState().cinema.running).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Kino beenden/ }));
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('springt zur nächsten Szene', () => {
    render(<CinemaPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Nächste Szene/ }));
    expect(useStore.getState().cinema.nummer).toBe(1);
  });

  it('zeigt den Titel der laufenden Szene', () => {
    useStore.getState().setCinema({ running: true, nummer: 0 });
    render(<CinemaPanel />);
    const titel = screen.getByTestId('cinema-titel').textContent ?? '';
    expect(titel.length).toBeGreaterThan(3);
    expect(titel).not.toContain('[');  // kein fehlender Sprachschlüssel
  });

  it('übernimmt einen eingegebenen Zufallskeim', () => {
    render(<CinemaPanel />);
    fireEvent.change(screen.getByLabelText(/Zufallskeim/), { target: { value: '4711' } });
    expect(useStore.getState().cinema.seed).toBe(4711);
  });

  it('schaltet das Mischen um', () => {
    render(<CinemaPanel />);
    fireEvent.click(screen.getByLabelText(/Szenen mischen/));
    expect(useStore.getState().cinema.shuffle).toBe(false);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/panels/CinemaPanel.test.tsx`
Expected: FAIL — `./CinemaPanel` nicht auflösbar

- [ ] **Step 3: Implementierung schreiben**

`src/ui/panels/CinemaPanel.tsx`:

```tsx
import { useId } from 'react';
import { useStore } from '../../store';
import { t } from '../i18n';
import { Panel } from './Panel';
import { SCENES } from '../../data/scenes';
import { plannedSceneAt } from '../../sim/director';
import { startCinema, stopCinema, nextScene } from '../cinemaControl';

export function CinemaPanel(): React.JSX.Element {
  const cinema = useStore((s) => s.cinema);
  const setCinema = useStore((s) => s.setCinema);
  const keimId = useId();
  const mischenId = useId();
  const pauseId = useId();

  const geplant = plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle);

  return (
    <Panel id="cinema" title={t('panel.cinema')}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            onClick={() => { if (cinema.running) stopCinema(); else startCinema(); }}
          >
            {cinema.running ? t('cinema.stop') : t('cinema.start')}
          </button>
          <button
            type="button"
            className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            onClick={() => { nextScene(); }}
          >
            {t('cinema.next')}
          </button>
        </div>

        <p className="m-0 flex justify-between gap-2">
          <span className="opacity-70">{t('cinema.current')}</span>
          <span data-testid="cinema-titel" className="text-right">
            {t(geplant.scene.titleKey)}
          </span>
        </p>

        <label htmlFor={keimId} className="flex items-center justify-between gap-2">
          <span>{t('cinema.seed')}</span>
          <input
            id={keimId}
            type="number"
            className="w-28 rounded border border-white/15 bg-transparent px-2 py-1"
            value={cinema.seed}
            onChange={(e) => {
              const wert = Number(e.target.value);
              if (Number.isFinite(wert)) setCinema({ seed: Math.trunc(wert) });
            }}
          />
        </label>

        <label htmlFor={mischenId} className="flex items-center gap-2">
          <input
            id={mischenId}
            type="checkbox"
            checked={cinema.shuffle}
            onChange={(e) => { setCinema({ shuffle: e.target.checked }); }}
          />
          <span>{t('cinema.shuffle')}</span>
        </label>

        <label htmlFor={pauseId} className="flex items-center gap-2">
          <input
            id={pauseId}
            type="checkbox"
            checked={cinema.pauseOnInput}
            onChange={(e) => { setCinema({ pauseOnInput: e.target.checked }); }}
          />
          <span>{t('cinema.pauseOnInput')}</span>
        </label>
      </div>
    </Panel>
  );
}
```

In `src/ui/App.tsx` einhängen (nach `<ScalePanel />`):

```tsx
        <CinemaPanel />
```

In `src/ui/panels/CameraPanel.tsx` die Modusliste erweitern, damit der
vierte Modus sichtbar ist:

```ts
const MODI: readonly CameraMode[] = ['free', 'attached', 'follow', 'cinema'];
```

Der Knopf „Kinofahrt" wählt den Modus, startet aber **nicht** den Director —
gestartet wird über das Kino-Panel oder `C`.

Außerdem in `src/ui/App.tsx` die Kürzelübersicht um die beiden neuen Tasten
ergänzen:

```ts
  ['C', 'shortcuts.cinema'],
  ['N', 'shortcuts.nextScene'],
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/ui/`
Expected: PASS

- [ ] **Step 5: Sichtprüfung**

Run: `npm run dev` — Panel „Kino-Modus" startet den Film, „Nächste Szene"
springt weiter, der Titel wechselt mit. Keim ändern, Film neu starten:
dieselbe Folge wie zuvor bei gleichem Keim.

- [ ] **Step 6: Commit**

```bash
git add src/ui/panels/CinemaPanel.tsx src/ui/panels/CinemaPanel.test.tsx src/ui/panels/CameraPanel.tsx src/ui/App.tsx
git commit -m "Kino-Panel mit Keim, Mischen und Szenenanzeige"
```

---

## Task 11: Dauerlauf-Nachweis und Abnahme

Kein neues Feature — dieser Task weist die vier Akzeptanzkriterien der Phase nach.

**Files:**
- Create: `docs/phase2-abnahme.md`
- Test: `src/sim/director.longrun.test.ts`

**Interfaces:**
- Consumes: alles aus den Tasks 1 bis 10

- [ ] **Step 1: Dauerlauftest der reinen Logik schreiben**

`src/sim/director.longrun.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { plannedSceneAt } from './director';
import { advanceCinema } from '../app/cinema';
import { SCENES } from '../data/scenes';
import { DEFAULT_STATE } from '../store';

describe('Dauerlauf', () => {
  it('spielt eine halbe Stunde durch, ohne dass etwas anwächst', () => {
    let cinema = { ...DEFAULT_STATE.cinema, running: true };
    const schritt = 1 / 60;
    const schritte = 30 * 60 * 60; // 30 Minuten bei 60 Bildern je Sekunde

    for (let i = 0; i < schritte; i++) cinema = advanceCinema(cinema, schritt);

    // Der Zustand hat nach 108 000 Bildern genau dieselben sieben Felder
    // wie am Anfang — es gibt keine mitwachsende Liste, in der eine halbe
    // Stunde Betrieb Spuren hinterlassen könnte.
    expect(Object.keys(cinema).sort()).toEqual(Object.keys(DEFAULT_STATE.cinema).sort());
    expect(cinema.nummer).toBeGreaterThan(20);
    expect(Number.isFinite(cinema.elapsedSec)).toBe(true);
    expect(cinema.elapsedSec).toBeLessThanOrEqual(
      plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle).scene.durationSec,
    );
  });

  it('liefert nach tausend Szenen noch denselben Film wie beim ersten Lauf', () => {
    const ersterLauf = [990, 995, 999].map((n) => plannedSceneAt(n, SCENES, 20260912, true));
    const zweiterLauf = [990, 995, 999].map((n) => plannedSceneAt(n, SCENES, 20260912, true));
    expect(zweiterLauf).toEqual(ersterLauf);
  });
});
```

- [ ] **Step 2: Test laufen lassen**

Run: `npx vitest run src/sim/director.longrun.test.ts`
Expected: PASS

- [ ] **Step 3: Vollständige Prüfung**

Run: `npm run lint && npx tsc --noEmit && npm test && npm run build`
Expected: alles grün

- [ ] **Step 4: Dauerlauf im Browser messen**

Run: `npm run dev`, Kino-Modus starten, 30 Minuten laufen lassen. Alle fünf
Minuten in der Konsole festhalten:

```js
({
  heapMB: +(performance.memory?.usedJSHeapSize / 1048576).toFixed(1),
  geometrien: renderer.info.memory.geometries,
  texturen: renderer.info.memory.textures,
  aufrufe: renderer.info.render.calls,
})
```

Damit `renderer` in der Konsole erreichbar ist, im Entwicklungslauf in
`src/app/main.tsx` nach `createRenderer` ergänzen:

```ts
    // Nur zur Messung im Entwicklungslauf; im Build entfernt der Bundler
    // den Zweig, weil import.meta.env.DEV dort konstant false ist.
    if (import.meta.env.DEV) {
      (window as unknown as { renderer: unknown }).renderer = ctx.renderer;
    }
```

Erwartung: Geometrien und Texturen bleiben über die gesamte Laufzeit
konstant, der Heap schwankt um einen festen Wert, ohne zu steigen.

- [ ] **Step 5: Abnahmeprotokoll schreiben**

`docs/phase2-abnahme.md` mit dieser Tabelle anlegen und mit echten Messwerten
füllen:

| Kriterium aus dem Entwurf | Nachweis | Ergebnis |
|---|---|---|
| Mindestens 6 Szenen; Director spielt endlos ohne sichtbaren Bruch | `scenes.test.ts`, Sichtprüfung über mehrere Szenenwechsel | |
| Prozedurale Variation reproduzierbar bei gesetztem Zufallskeim | `director.test.ts`, `director.longrun.test.ts` | |
| UI und Mauszeiger blenden aus, Wake Lock aktiv, echtes Vollbild | Sichtprüfung, `wakeLock.test.ts` | |
| 30 Minuten Dauerlauf ohne messbares Speicherwachstum | Messreihe aus Step 4 | |

Zusätzlich festhalten: Gerät, Auflösung, Browserversion, Heap- und
Objektzahlen zu Beginn, nach 15 und nach 30 Minuten.

- [ ] **Step 6: Commit**

```bash
git add src/sim/director.longrun.test.ts docs/phase2-abnahme.md src/app/main.tsx
git commit -m "Dauerlaufnachweis und Abnahmeprotokoll für Phase 2"
```

---

## Abgrenzung: Was Phase 2 bewusst nicht enthält

- Monde außer dem Erdmond, Zwergplaneten, Ringe, Gürtel, Schattenwurf (Phase 3) —
  die drei Szenen des Entwurfs, die solche Körper brauchen, sind oben durch
  gleichwertige ersetzt und kommen in Phase 3 als reine Datensätze nach.
- Presets speichern und laden, URL-Sharing in der Oberfläche, Englisch,
  Infopanel (Phase 4). Der Kino-Zustand wird serialisiert und getestet, aber
  wie in Phase 1 nicht an die Adresszeile gehängt.
- Ambient-Sound, Texturkompression, Veröffentlichung (Phase 5).
- Szeneneditor oder Szenen aus der Oberfläche heraus anlegen — Szenen bleiben
  Quelltextdaten.

## Selbstprüfung des Plans

**Abdeckung der Akzeptanzkriterien der Phase 2:** Mindestens sechs Szenen →
Task 2 (sieben Szenen, Test auf die Mindestzahl). Endlos ohne Bruch → Tasks 3
und 6, weiche Übergänge über die Dämpfung aus Phase 1. Reproduzierbarkeit bei
gesetztem Keim → Tasks 1, 3 und 11. UI und Mauszeiger aus, Wake Lock, echtes
Vollbild → Tasks 8 und 9. 30 Minuten ohne Speicherwachstum → Tasks 3, 6 und 11.

**Abdeckung der Entwurfsabschnitte:** 8.1 Szenen als Daten → Task 2 (mit zwei
begründeten Feldergänzungen). 8.2 Director, Playlist, Variation, weiche
Übergänge auch beim Zeitraffer → Tasks 3 und 6. 8.3 Dauerlauf-Tauglichkeit,
Steuerung `C` und `N`, Pause bei Eingabe mit Wiederaufnahme → Tasks 7, 8, 9.
Abschnitt 7, vierter Kameramodus → Task 4. Abschnitt 9.2, Tastenkürzel →
Task 7 und 10. Abschnitt 12, Test „gleicher Keim ergibt identische
Kamerapfade" → Task 3.

**Namensgleichheit über die Tasks:** `plannedSceneAt`, `sceneIndexFor`,
`PlannedScene`, `cinemaTargetFor`, `systemRadiusKm`, `advanceCinema`,
`blendedRate`, `tickCinema`, `startCinema`, `stopCinema`, `toggleCinema`,
`nextScene`, `noteUserInput`, `resumeIfIdle`, `createIdleWatcher`,
`useIdleHide`, `requestWakeLock`, `releaseWakeLock`, `useWakeLock` — jeder
Name wird in genau einem Task definiert und in den späteren unverändert
verwendet.
