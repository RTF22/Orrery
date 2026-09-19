# Zeitbereich: Absturz der Bahnrechnung ab dem Jahr 12 563 beheben

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Orrery begrenzt die Zeit auf den Julianischen Tag 0 bis zum 31. Dezember 9999, der Zeitraffer hält an den Rändern an, und eine Ausnahme in einem Bild beendet die Bildschleife nicht mehr.

**Architecture:** Der Zeitbereich steht als Konstanten `JD_MIN`/`JD_MAX` mit der Klemmfunktion `imZeitbereich` in `src/sim/time.ts`. Store (`setTime`, Prüfer) und Bildschleife (`src/app/loop.ts`) klemmen damit; die Schleife hält am Rand an und fängt Ausnahmen aus `onFrame` ab. Die Bahnrechnung selbst bleibt unverändert.

**Tech Stack:** TypeScript, Zustand, Vitest (Umgebung `node`, Panels mit `// @vitest-environment jsdom`), React Testing Library.

**Spec:** kein Entwurfsdokument; Grundlage sind die Ursachenanalyse und die Entscheidung von Jens (19.09.2026, Auswahl „Zeit begrenzen"), beide unten wiedergegeben.

## Ursache (systematische Fehlersuche, 19.09.2026)

1. Die Planetenelemente stammen aus der JPL-Tafel für 1800 bis 2050 und werden in `elementsAt` (`src/sim/orbit.ts`) linear fortgeschrieben. Saturns Exzentrizität `0,05386179 − 0,00050991·T` wird bei T = 105,6 Jahrhunderten (Jahr 12 563) null und danach negativ; ebenso Venus (18 500), Jupiter (38 510), Erde (40 049), Uranus (109 477); rückwärts Neptun (−14 828). Saturns |e| erreicht etwa im Jahr 208 700 den Wert 1.
2. `solveKepler` (`src/sim/kepler.ts`) wirft für e außerhalb [0, 1) einen `RangeError` (nachgewiesen: Jahr 12 562 rechnet, 12 564 wirft).
3. `startLoop` (`src/app/loop.ts`) ruft `onFrame` vor `requestAnimationFrame(tick)` ohne Abfangen auf: Eine Ausnahme beendet die Schleife für immer.
4. Erreichbar über den Zeitraffer (1000 Jahre je Sekunde, ohne Grenze in der Schleife, auch rückwärts unter jd 0), das Datumsfeld (bis Jahr 275 760), Link und Sitzung (Prüfer erlaubt `time.jd` bis 2·10⁸). Die Sitzung sichert beim Verlassen der Seite, ein Neuladen stürzt dann erneut ab.

## Entscheidung (Jens, 19.09.2026)

Zeit begrenzen: zulässig ist der Julianische Tag 0 (4713 v. Chr.) bis 31. Dezember 9999, 0 Uhr UTC (JD 5 373 483,5). Der Zeitraffer hält am Rand an; Link und Sitzung werden auf diesen Bereich geprüft; die Bahnrechnung bleibt unverändert. Nachgerechnet: An beiden Rändern liegen alle fortgeschriebenen Exzentrizitäten in [0, 1) (e ist linear in T, die Extremwerte liegen an den Rändern): kleinster Wert Venus 0,00349 im Jahr 9999, größter Merkur 0,20716 im Jahr 9999.

## Global Constraints

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll), Umlaute korrekt; Englisch nur in `src/data/texte/en/` und `src/ui/i18n/en.ts`.
- Commits allein Jens Fricke, **ohne jede Trailer-Zeile** (keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen). Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei; Protokolle nennen die Wort- und Trailerprüfung nur als Verweis, nie mit Suchmuster.
- Branch `zeitbereich` (von `master` b24fc6a), **kein Worktree**, kein `git stash`/`reset`/`checkout --`. Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus; erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `store/` darf `sim/` importieren, `sim/` nichts aus den oberen Schichten (Schichtentests `store/schichten.test.ts`, `render/schichten.test.ts`).
- Keine neue Abhängigkeit in `package.json`.
- Zahlen: `JD_MIN = 0`, `JD_MAX = 5373483.5` (9999-12-31 00:00 UTC).
- Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen). Testzahl vorher 3665.
- Playwright schreibt nur nach `.playwright-mcp/`; direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

---

### Task 1: Zeitbereich in Simulation, Store und Datumsfeld

**Files:**
- Modify: `src/sim/time.ts` (Konstanten und Klemmfunktion)
- Modify: `src/sim/time.test.ts`, `src/sim/orbit.test.ts`
- Modify: `src/store/pruefer.ts:45-70` (Kommentar und `BEREICHE` für `time.jd`, `camera.freezeJd`)
- Modify: `src/store/pruefer.test.ts`
- Modify: `src/store/index.ts:67` (`setTime`)
- Create: `src/store/zeit.test.ts`
- Modify: `src/ui/panels/TimePanel.tsx:87-99` (Datumsfeld `max`), `src/ui/panels/TimePanel.test.tsx`

**Interfaces:**
- Produces: `export const JD_MIN = 0;`, `export const JD_MAX = 5373483.5;`, `export function imZeitbereich(jd: number): number` in `src/sim/time.ts` (Task 2 nutzt `imZeitbereich`, `JD_MIN`, `JD_MAX`).

- [ ] **Step 1: Failing tests schreiben**

In `src/sim/time.test.ts` den Import um `JD_MIN, JD_MAX, imZeitbereich` erweitern (und `jdToDate`, falls noch nicht importiert) und anhängen:

```ts
describe('Zeitbereich', () => {
  it('reicht vom Julianischen Tag 0 bis zum 31. Dezember 9999', () => {
    expect(JD_MIN).toBe(0);
    expect(JD_MAX).toBe(5373483.5);
    expect(jdToDate(JD_MAX).toISOString()).toBe('9999-12-31T00:00:00.000Z');
  });

  it('klemmt auf den Bereich und lässt Werte darin unverändert', () => {
    expect(imZeitbereich(-1)).toBe(JD_MIN);
    expect(imZeitbereich(JD_MAX + 1)).toBe(JD_MAX);
    expect(imZeitbereich(JD_MIN)).toBe(JD_MIN);
    expect(imZeitbereich(JD_MAX)).toBe(JD_MAX);
    expect(imZeitbereich(2461300.5)).toBe(2461300.5);
  });
});
```

In `src/sim/orbit.test.ts` den Import aus `./orbit` um `elementsAt` erweitern, `import { J2000, JD_MIN, JD_MAX } from './time';` statt des bisherigen `J2000`-Imports, und anhängen:

```ts
describe('Zeitbereich', () => {
  // e, a und i sind linear in der Zeit: Liegen sie an beiden Rändern im
  // gültigen Bereich, dann überall dazwischen.
  it('hält jede fortgeschriebene Exzentrizität an beiden Rändern in [0, 1)', () => {
    for (const body of bodies) {
      if (body.orbit === null) continue;
      for (const jd of [JD_MIN, JD_MAX]) {
        const { e } = elementsAt(body.orbit, jd);
        expect(e, `${body.id} bei jd ${jd}`).toBeGreaterThanOrEqual(0);
        expect(e, `${body.id} bei jd ${jd}`).toBeLessThan(1);
      }
    }
  });

  it('rechnet jede Position an beiden Rändern', () => {
    for (const body of bodies) {
      for (const jd of [JD_MIN, JD_MAX]) {
        expect(() => positionAt(body.id, bodyIndex, jd), `${body.id} bei jd ${jd}`).not.toThrow();
      }
    }
  });
});
```

In `src/store/pruefer.test.ts` im ersten `describe('pruefeZustand', …)` nach dem Fall „prüft freezeJd nur, wenn es eine Zahl ist" einfügen:

```ts
  it('begrenzt time.jd und camera.freezeJd auf den Zeitbereich', () => {
    const innen = { time: { jd: 5373483.5 }, camera: { freezeJd: 0 } };
    expect(pruefeZustand(innen)).toEqual(innen);
    expect(pruefeZustand({ time: { jd: 5373484 }, camera: { freezeJd: 6e6 } })).toEqual({});
  });
```

Neue Datei `src/store/zeit.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, DEFAULT_STATE } from './index';
import { JD_MIN, JD_MAX } from '../sim/time';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('setTime und Zeitbereich', () => {
  it('klemmt jd auf den Zeitbereich', () => {
    useStore.getState().setTime({ jd: JD_MAX + 1000 });
    expect(useStore.getState().time.jd).toBe(JD_MAX);
    useStore.getState().setTime({ jd: -1 });
    expect(useStore.getState().time.jd).toBe(JD_MIN);
  });

  it('lässt jd im Bereich und ohne jd im Patch unverändert', () => {
    useStore.getState().setTime({ jd: 2461300.5 });
    expect(useStore.getState().time.jd).toBe(2461300.5);
    useStore.getState().setTime({ paused: true });
    expect(useStore.getState().time.jd).toBe(2461300.5);
    expect(useStore.getState().time.paused).toBe(true);
  });
});
```

In `src/ui/panels/TimePanel.test.tsx` im `describe('TimePanel', …)` anhängen:

```ts
  it('begrenzt das Datumsfeld auf das Jahr 9999', () => {
    render(<TimePanel />);
    const feld = screen.getByLabelText(/Datum/) as HTMLInputElement;
    expect(feld.max).toBe('9999-12-31');
  });
```

- [ ] **Step 2: Tests laufen lassen, Fehlschlag prüfen**

Run: `npx vitest run src/sim/time.test.ts src/sim/orbit.test.ts src/store/pruefer.test.ts src/store/zeit.test.ts src/ui/panels/TimePanel.test.tsx`
Expected: FAIL — `JD_MIN`/`JD_MAX`/`imZeitbereich` nicht exportiert (Zeit- und Bahntests), `time.jd: 5373484` wird noch angenommen (Prüfer), `setTime` klemmt nicht (Store), `feld.max` ist leer (Panel).

- [ ] **Step 3: Implementieren**

`src/sim/time.ts`, nach `J2000` einfügen:

```ts
/**
 * Zeitbereich, in dem Orrery rechnet: vom Julianischen Tag 0 (4713 v. Chr.)
 * bis zum 31. Dezember 9999, 0 Uhr UTC. Die linear fortgeschriebenen
 * Bahnelemente bleiben darin gültig — jenseits davon würde etwa Saturns
 * Exzentrizität im Jahr 12 563 negativ, und der Kepler-Löser wiese sie zurück.
 * Store, Prüfer und Bildschleife klemmen auf diesen Bereich.
 */
export const JD_MIN = 0;
export const JD_MAX = 5373483.5;

/** Klemmt einen Julianischen Tag auf den Zeitbereich [JD_MIN, JD_MAX]. */
export function imZeitbereich(jd: number): number {
  return Math.min(Math.max(jd, JD_MIN), JD_MAX);
}
```

`src/store/pruefer.ts`: `import { JD_MIN, JD_MAX } from '../sim/time';` ergänzen; in `BEREICHE` `'time.jd': [JD_MIN, JD_MAX],` und `'camera.freezeJd': [JD_MIN, JD_MAX],`. Im Kommentar darüber den Satz „Die Obergrenze der Julianischen Tage deckt das Datumsfeld ab (Jahr 275760 liegt bei rund 1,03e8)." ersetzen durch „Julianische Tage begrenzt der Zeitbereich aus sim/time.ts (JD 0 bis 31. Dezember 9999)."

`src/store/index.ts`: `import { J2000, imZeitbereich } from '../sim/time';` (bestehenden Import erweitern) und `setTime` ersetzen durch:

```ts
  // Jede Zeit, die über die Oberfläche hereinkommt (Datumsfeld, „Jetzt",
  // Kino), bleibt im Zeitbereich (sim/time.ts).
  setTime: (p) => set((s) => ({
    time: { ...s.time, ...p, ...(p.jd === undefined ? {} : { jd: imZeitbereich(p.jd) }) },
  })),
```

`src/ui/panels/TimePanel.tsx`: am `<input type="date" …>` das Attribut `max="9999-12-31"` ergänzen (nach `type="date"`).

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/sim src/store src/ui/panels/TimePanel.test.tsx`
Expected: PASS. Danach `npm test` → 3673 Tests (3665 + 8), `npm run lint` ohne Befund.

- [ ] **Step 5: Commit**

```bash
git add src/sim/time.ts src/sim/time.test.ts src/sim/orbit.test.ts src/store/pruefer.ts src/store/pruefer.test.ts src/store/index.ts src/store/zeit.test.ts src/ui/panels/TimePanel.tsx src/ui/panels/TimePanel.test.tsx
git commit -m "Zeitbereich: Julianischer Tag 0 bis 31. Dezember 9999"
```

---

### Task 2: Bildschleife hält am Rand an und übersteht Ausnahmen

**Files:**
- Modify: `src/app/loop.ts`
- Create: `src/app/loop.test.ts`

**Interfaces:**
- Consumes: `imZeitbereich`, `JD_MIN`, `JD_MAX` aus `src/sim/time.ts` (Task 1).
- Produces: unveränderte Signatur `startLoop(onFrame: (jd: number, dtSek: number) => void): () => void`.

- [ ] **Step 1: Failing test schreiben**

Neue Datei `src/app/loop.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { startLoop } from './loop';
import { useStore, DEFAULT_STATE } from '../store';
import { JD_MIN, JD_MAX } from '../sim/time';

// Die Schleife fordert jedes Bild über requestAnimationFrame an. Der Test
// sammelt die Rückrufe und führt sie von Hand aus, mit selbst gesetzter Zeit.
let rueckrufe: Array<(t: number) => void> = [];
let jetzt = 0;

beforeEach(() => {
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  rueckrufe = [];
  jetzt = 1000;
  vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => {
    rueckrufe.push(cb);
    return rueckrufe.length;
  });
  vi.spyOn(performance, 'now').mockImplementation(() => jetzt);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Führt das nächste angeforderte Bild aus, `ms` Millisekunden nach dem vorigen. */
function bild(ms: number): void {
  const cb = rueckrufe.shift();
  if (!cb) throw new Error('kein Bild angefordert');
  jetzt += ms;
  cb(jetzt);
}

describe('startLoop', () => {
  it('schreibt die Zeit im Bereich fort, ohne anzuhalten', () => {
    useStore.getState().setTime({ jd: 2461300.5, rateDaysPerSec: 10, paused: false });
    const stop = startLoop(() => {});
    bild(100);
    expect(useStore.getState().time.jd).toBeCloseTo(2461301.5, 9);
    expect(useStore.getState().time.paused).toBe(false);
    stop();
  });

  it('hält am oberen Rand des Zeitbereichs an und läuft weiter', () => {
    useStore.getState().setTime({ jd: JD_MAX - 1, rateDaysPerSec: 365, paused: false });
    const stop = startLoop(() => {});
    bild(100);
    expect(useStore.getState().time.jd).toBe(JD_MAX);
    expect(useStore.getState().time.paused).toBe(true);
    expect(rueckrufe).toHaveLength(1);
    stop();
  });

  it('hält am unteren Rand des Zeitbereichs an', () => {
    useStore.getState().setTime({ jd: JD_MIN + 1, rateDaysPerSec: -365, paused: false });
    const stop = startLoop(() => {});
    bild(100);
    expect(useStore.getState().time.jd).toBe(JD_MIN);
    expect(useStore.getState().time.paused).toBe(true);
    stop();
  });

  it('fordert nach einer Ausnahme in onFrame das nächste Bild an und meldet sie einmal', () => {
    const fehler = vi.spyOn(console, 'error').mockImplementation(() => {});
    let aufrufe = 0;
    const stop = startLoop(() => { aufrufe += 1; throw new Error('kaputt'); });
    bild(16);
    bild(16);
    expect(aufrufe).toBe(2);
    expect(rueckrufe).toHaveLength(1);
    expect(fehler).toHaveBeenCalledTimes(1);
    stop();
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag prüfen**

Run: `npx vitest run src/app/loop.test.ts`
Expected: FAIL — Rand wird überschritten und `paused` bleibt `false`; die Ausnahme verlässt `tick` (Test „Ausnahme" scheitert mit „kaputt").

- [ ] **Step 3: Implementieren**

In `src/app/loop.ts` `import { imZeitbereich } from '../sim/time';` ergänzen, vor `const tick` die Variable `let letzteMeldung = '';` anlegen und den Teil ab `const s = useStore.getState();` bis `requestAnimationFrame(tick);` ersetzen durch:

```ts
    const s = useStore.getState();
    if (!s.time.paused) {
      const roh = s.time.jd + s.time.rateDaysPerSec * dtSek;
      const jd = imZeitbereich(roh);
      // Am Rand des Zeitbereichs (sim/time.ts) hält die Uhr an, statt in
      // Zeiten zu laufen, in denen die Bahnelemente ungültig werden.
      useStore.setState({ time: { ...s.time, jd, paused: jd !== roh } });
    }
    // Eine Ausnahme in einem Bild darf die Schleife nicht beenden: Das nächste
    // Bild wird trotzdem angefordert, gleiche Meldungen erscheinen nur einmal.
    try {
      onFrame(useStore.getState().time.jd, dtSek);
    } catch (fehler) {
      const meldung = fehler instanceof Error ? fehler.message : String(fehler);
      if (meldung !== letzteMeldung) {
        letzteMeldung = meldung;
        console.error('Bild übersprungen:', fehler);
      }
    }
    requestAnimationFrame(tick);
```

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/app`
Expected: PASS. Danach `npm test` → 3677 Tests, `npm run lint` ohne Befund.

- [ ] **Step 5: Commit**

```bash
git add src/app/loop.ts src/app/loop.test.ts
git commit -m "Bildschleife hält am Rand des Zeitbereichs an und übersteht Ausnahmen"
```

---

### Task 3: Hochschultext Entstehung: „Im Modell" nachführen

**Files:**
- Modify: `src/data/texte/de/hochschule/thema-entstehung.md:341-343`, `src/data/texte/en/hochschule/thema-entstehung.md:326-329` (Abschnitt „Im Modell", Punkt „Gültigkeit der Raten")
- Modify: `docs/belege/hochschule/thema-entstehung.md` (Zeile Nr. 108, neue Zeile am Tabellenende)

**Interfaces:**
- Consumes: Verhalten aus Task 1 und 2 (am Code prüfen, Kommentare sind kein Beleg).

- [ ] **Step 1: Deutschen Text ändern**

Im Punkt „**Gültigkeit der Raten:**" die Sätze ab „Linear fortgeschrieben wird die" bis „…fordert danach kein neues Bild an." ersetzen durch:

```md
Linear fortgeschrieben würde die Exzentrizität Saturns im Jahr 12 563 null und danach negativ,
rückwärts die Neptuns im Jahr −14 828; solche Werte weist der Keplerlöser zurück. Orrery begrenzt
die Zeit deshalb auf den Julianischen Tag 0 (4713 v. Chr.) bis zum 31. Dezember 9999, der Zeitraffer
hält an diesen Rändern an. Darin bleiben alle fortgeschriebenen Exzentrizitäten zwischen 0 und 1; am
kleinsten wird die der Venus mit 0,0035 im Jahr 9999.
```

Einrückung wie die übrigen Zeilen des Aufzählungspunkts (zwei Leerzeichen), Zeilen höchstens 100 Zeichen; der folgende Satz „Über 4,5 Milliarden Jahre zurückgeschrieben …" bleibt.

- [ ] **Step 2: Englische Fassung ändern**

Im Punkt „**Validity of the rates:**" die Sätze ab „Propagated linearly, Saturn's eccentricity" bis „…requests no further frame." ersetzen durch:

```md
Propagated linearly, Saturn's eccentricity would become zero in the year 12,563 and negative
thereafter, and going backwards Neptune's in the year −14,828; the Kepler solver rejects such values.
Orrery therefore limits time to Julian day 0 (4713 BC) through 31 December 9999, and the time-lapse
stops at these limits. Within this range all propagated eccentricities stay between 0 and 1; the
smallest is Venus's, 0.0035 in the year 9999.
```

- [ ] **Step 3: Belegliste**

In `docs/belege/hochschule/thema-entstehung.md` die Zeile Nr. 108 ersetzen durch:

```md
| 108 | Keplerlöser weist solche Werte zurück; Orrery begrenzt die Zeit auf JD 0 bis 31. Dezember 9999, der Zeitraffer hält an den Rändern an | JD 0; 31.12.9999 | Nachrechnung am Code: src/sim/time.ts, src/sim/kepler.ts, src/app/loop.ts, src/store/index.ts, src/store/pruefer.ts | JD_MIN = 0, JD_MAX = 5 373 483,5 (9999-12-31 0 Uhr UTC); setTime und startLoop klemmen mit imZeitbereich, startLoop setzt am Rand paused; pruefeZustand verwirft time.jd außerhalb; solveKepler wirft für e außerhalb [0, 1) | neu mit der Zeitbegrenzung (September 2026) |
```

und nach der letzten nummerierten Zeile der Tabelle eine Zeile mit der nächsten freien Nummer anfügen:

```md
| <nächste Nr.> | Im Zeitbereich bleiben alle fortgeschriebenen Exzentrizitäten zwischen 0 und 1; am kleinsten Venus im Jahr 9999 | 0,0035; 9999 | Nachrechnung am Code: src/data/bodies/*.ts, src/sim/orbit.ts | e + ė·T an JD 0 und JD 5 373 483,5 für die acht Planeten (e linear in T, Extremwerte an den Rändern): kleinster Wert Venus 0,00349 (9999), an JD 0 Neptun 0,00516, größter Merkur 0,20716 (9999); Test „Zeitbereich" in src/sim/orbit.test.ts | neu mit der Zeitbegrenzung (September 2026) |
```

Die Werte vor dem Eintragen mit einem Skript am Code nachrechnen (Vite-SSR, Skript außerhalb des Projektbaums oder im git-ignorierten Arbeitsordner mit `/* eslint-disable */`), Querverweise auf Nr. 108 in anderen Zeilen prüfen.

- [ ] **Step 4: Tests**

Run: `npx vitest run src/data src/ui/info`
Expected: PASS (Dateitest der Texte). Wortzahl beider Fassungen mit `wc -w` notieren.

- [ ] **Step 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-entstehung.md src/data/texte/en/hochschule/thema-entstehung.md docs/belege/hochschule/thema-entstehung.md
git commit -m "Hochschultext Entstehung: Zeitbereich statt Absturz im Modell"
```

---

### Task 4: Abnahme

**Files:**
- Create: `docs/zeitbereich-abnahme.md`
- Nur lokal, nicht committen: Dateien unter `.playwright-mcp/`

- [ ] **Step 1: Prüfläufe**

```bash
npm run lint
npm test
npm run build
```

Expected: Lint ohne Befund; 3677 Tests grün; Build erfolgreich (nur der bekannte Chunkgrößen-Hinweis).

- [ ] **Step 2: Browser — Zeitraffer an den Rändern**

Server prüfen (200), `browser_navigate` auf `http://localhost:5173/Orrery/`, `window.store.setState({ quality: { tier: 'high' } })`. Dann in `browser_evaluate`:

```js
async () => {
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const s = window.store.getState();
  s.setCinema({ running: false, pauseOnInput: false });
  const ergebnis = {};
  for (const [name, start, rate] of [['oben', 5373483.5 - 3650, 365250], ['unten', 3650, -365250]]) {
    s.setTime({ jd: start, rateDaysPerSec: rate, paused: false });
    const t0 = performance.now();
    while (performance.now() - t0 < 5000 && !window.store.getState().time.paused) await warte(20);
    const bilder0 = window.renderer.info.render.frame;
    const t1 = performance.now();
    await warte(1000);
    ergebnis[name] = {
      jd: window.store.getState().time.jd,
      paused: window.store.getState().time.paused,
      bilderJeSekunde: Math.round((window.renderer.info.render.frame - bilder0) / ((performance.now() - t1) / 1000)),
    };
  }
  return ergebnis;
}
```

Kriterien: `oben.jd` = 5373483.5 und `unten.jd` = 0, beide `paused` true, `bilderJeSekunde` je über 30 (Schleife läuft weiter). Falls `window.renderer.info.render.frame` nicht hochzählt, die Bildzahl stattdessen über einen eigenen `requestAnimationFrame`-Zähler in derselben Auswertung messen und das im Protokoll nennen.

- [ ] **Step 3: Browser — Datumsfeld und Konsole**

Datumsfeld: `document.querySelector('input[type="date"]').max` = `9999-12-31`. `browser_console_messages`: keine Fehler seit dem Navigieren.

- [ ] **Step 4: Protokoll `docs/zeitbereich-abnahme.md`**

```md
# Abnahme Zeitbereich (Absturz ab dem Jahr 12 563)

## 1. Umfang
(Commits mit Kurzhash und Titel, Branch, Plan, Ursache und Entscheidung in zwei Sätzen)

## 2. Lint, Tests, Build
(Schlusszeilen; Testzahl 3665 → 3673 → 3677 mit Herleitung)

## 3. Sichtprüfung
(Ergebnis von Schritt 2 und 3 als Tabelle mit Kriterium und Messwert)

## 4. Rulings der Umsetzung

## 5. Bekannte Unschärfen
```

Screenshots und Skripte unter `.playwright-mcp/` löschen; `git status --short` zeigt nur das Protokoll.

- [ ] **Step 5: Commit**

```bash
git add docs/zeitbereich-abnahme.md
git commit -m "Abnahme Zeitbereich"
```

---

## Hinweise für den Controller

- Modelle: Task 1 und 2 sind vollständig ausgeschrieben (Umsetzer sonnet), Task 3 Text am Code prüfen (sonnet), Task 4 Browser und Protokoll (sonnet). Reviews sonnet; Schlussprüfung opus.
- Task 3 erst nach Task 1 und 2 (der Text beschreibt deren Verhalten).
