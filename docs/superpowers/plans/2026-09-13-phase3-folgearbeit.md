# Phase-3-Folgearbeit — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Die vier bewusst offen gelassenen Punkte aus der Abnahme des Schattenwurfs (Phase 3b-2) abräumen, bevor Phase 4 beginnt.

**Architektur:** Drei Codeänderungen an bestehenden Stellen (`render/shadows.ts`, `app/cinema.ts`) plus ein neuer Vergleichstest, der den GLSL-Zwilling von `sonnenAnteil` mechanisch nach JavaScript übersetzt und gegen die TS-Fassung rechnet. Der vierte Punkt ist eine Messung mit anschließendem Ruling durch Jens, erst danach ggf. eine Datenänderung in `data/scenes.ts`.

**Tech-Stack:** TypeScript, Three.js (GLSL in Template-Literalen), Zustand, Vitest, Playwright-MCP für Screenshots, Python 3.12 mit Pillow/numpy für Pixelmessungen.

**Entwurf:** Kein eigenes Design-Dokument; Grundlage sind `docs/phase3b-schatten-abnahme.md` (Abschnitt „Offene Folgearbeit") und `docs/superpowers/specs/2026-09-13-schatten-design.md` §2 und §4. Diese Datei ist zugleich Entscheidungsledger (Abschnitt „Rulings" am Ende).

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Tests). Umlaute korrekt.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungs-URL, keine Werkzeugnamen. Vor jedem Commit prüfen: `git log --format=%B -1 | grep -ci 'co-authored\|session'` muss 0 ergeben.
- Branch `phase3-folgearbeit` (von `master`), **kein Worktree**: der laufende Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten Server starten.
- GLSL liegt in TS-Template-Literalen: **keine Backticks in Shader-Kommentaren**.
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Skripte und Bilder werden nicht committet.
- Vor „fertig" je Task: `npm test`, `npm run lint`, und am Ende der Arbeit `npm run build` tatsächlich laufen lassen und die Ausgabe zeigen.
- Sichtprüfungen sind Pixelwerte, keine Eindrücke: Differenzbild Schalter an/aus, Kontrollbild mit 0 abweichenden Pixeln. Vor jedem Screenshot Uhr anhalten (`setCinema({running:false})` **und** `setTime({paused:true})`), `setCinema({pauseOnInput:false})` gegen Playwright-`pointermove`, Texturen geladen abwarten.

---

### Task 1: `schattenFaktor` als Skalar im Körper-Shader

**Dateien:**
- Ändern: `src/render/shadows.ts:293-315` (Konstante `SCHATTEN_GLSL_KOERPER_ANWENDUNG`)
- Test: `src/render/shadows.test.ts:271-275`

**Schnittstellen:**
- Konsumiert: nichts Neues.
- Produziert: unveränderte Exportnamen; nur der Typ der lokalen GLSL-Variablen `schattenFaktor` wechselt von `vec3` auf `float`.

Hintergrund: Alle Faktoren, die in `schattenFaktor` einmultipliziert werden, sind Skalare (`f` aus `kugelSchatten`, `1.0 - alpha` der Ringtextur). Ein `vec3` trägt drei gleiche Komponenten, kostet zwei Multiplikationen je Fragment umsonst und suggeriert eine Farbabhängigkeit, die es nicht gibt. `vec3 *= float` ist in GLSL ES gültig, die Anwendungszeilen bleiben wortgleich.

- [ ] **Schritt 1: Fehlschlagenden Test schreiben**

In `src/render/shadows.test.ts` im Block `it('SCHATTEN_GLSL_KOERPER_ANWENDUNG multipliziert Diffus/Spekular und färbt das Emissiv', …)` als erste Zeile ergänzen:

```ts
    // Skalar, nicht vec3: Alle Faktoren sind Skalare, ein Vektor würde nur
    // eine Farbabhängigkeit vortäuschen, die es nicht gibt.
    expect(SCHATTEN_GLSL_KOERPER_ANWENDUNG).toContain('float schattenFaktor = 1.0;');
    expect(SCHATTEN_GLSL_KOERPER_ANWENDUNG).not.toContain('vec3 schattenFaktor');
```

- [ ] **Schritt 2: Test laufen lassen, Fehlschlag prüfen**

`npx vitest run src/render/shadows.test.ts -t "multipliziert Diffus"` — erwartet: FAIL, weil die Konstante noch `vec3 schattenFaktor = vec3(1.0);` enthält.

- [ ] **Schritt 3: Umsetzung**

In `src/render/shadows.ts` die Zeile `vec3 schattenFaktor = vec3(1.0);` ersetzen durch:

```glsl
float schattenFaktor = 1.0;
```

Sonst nichts ändern. `fuellFarbe` bleibt `vec3`, es ist eine Farbe.

- [ ] **Schritt 4: Tests laufen lassen**

`npx vitest run src/render/shadows.test.ts src/render/bodies.test.ts` — erwartet: alle grün (die Substring-Tests auf `reflectedLight.directDiffuse *= schattenFaktor;` gelten weiter).

- [ ] **Schritt 5: Sichtprüfung als Kontrollbild (0 abweichende Pixel)**

Der Wechsel des Typs darf das Bild nicht verändern. Vorgehen:

1. Server prüfen: `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
2. **Vor** der Änderung (Schritt 3 vorübergehend per `git stash` zurücknehmen, oder die Aufnahme vor Schritt 3 machen) im Browser auf `http://localhost:5173/Orrery/` navigieren und per `browser_evaluate` die Finsternis-Szene stellen:
   ```js
   const s = window.store.getState();
   const nummer = 18; // Index von 'mondfinsternis' in SCENES bei shuffle:false
   s.setCinema({ running: true, shuffle: false, nummer, elapsedSec: 0, pauseOnInput: false });
   s.setCamera({ mode: 'cinema' });
   ```
   Zwei Sekunden warten (Zeitsprung und Texturen), dann anhalten:
   ```js
   const s = window.store.getState();
   s.setCinema({ running: false });
   s.setTime({ paused: true });
   [s.cinema.elapsedSec, s.time.jd]
   ```
   Die beiden Werte notieren. Screenshot als `.playwright-mcp/t1-vorher.png`.
3. **Nach** der Änderung (Vite lädt neu) die Seite neu laden, dieselbe Szene stellen, dann **exakt** dieselbe Zeit setzen: `s.setCinema({ running:false, nummer, elapsedSec: <notiert> }); s.setTime({ paused:true, jd: <notiert> }); s.setCamera({ mode:'cinema' })`. Zwei Sekunden warten, Screenshot `.playwright-mcp/t1-nachher.png`.
4. Messen mit Python (Skript nach `.playwright-mcp/diff.py`):
   ```python
   import numpy as np
   from PIL import Image
   a = np.asarray(Image.open('.playwright-mcp/t1-vorher.png').convert('RGB')).astype(int)
   b = np.asarray(Image.open('.playwright-mcp/t1-nachher.png').convert('RGB')).astype(int)
   d = np.abs(a - b).max(axis=2)
   print('abweichende Pixel:', int((d > 0).sum()), 'max Abweichung:', int(d.max()))
   ```
   Erwartet: `abweichende Pixel: 0`. Ergebnis wörtlich in den Abschlussbericht übernehmen. Weicht etwas ab (Kamera-Dämpfung kann bei ungleicher Wartezeit noch nachlaufen), Wartezeit verlängern und beide Aufnahmen wiederholen; Abweichungen über 0 bei stillstehender Kamera sind ein Befund, kein Rauschen.

- [ ] **Schritt 6: Lint und Commit**

```bash
npm run lint
git add src/render/shadows.ts src/render/shadows.test.ts
git commit -m "Schatten: schattenFaktor im Körper-Shader als Skalar statt vec3"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 2: Zeitsprung der Finsternis-Szene auch beim Szenenbeginn ohne Nummernwechsel

**Dateien:**
- Ändern: `src/app/cinema.ts:56-100` (`tickCinema`), neue exportierte Funktion `szenenBeginn`
- Test: `src/app/cinema.test.ts:66-121`

**Schnittstellen:**
- Konsumiert: `AppState['cinema']` aus `src/store/types.ts`; `startCinema()` in `src/ui/cinemaControl.ts` setzt beim Start `elapsedSec: 0`, `resumeIfIdle()` lässt `elapsedSec` stehen, `nextScene()` setzt `nummer + 1` und `elapsedSec: 0`.
- Produziert: `export function szenenBeginn(vorher: AppState['cinema'], nachher: AppState['cinema']): boolean`.

Hintergrund: `tickCinema` springt heute nur bei `nachher.nummer !== vorher.nummer`. Wird das Kino gestartet, während die geplante Szene bereits die Finsternis-Szene ist (Playlist-Position 0 bei `shuffle:false`, oder ein Keim, der sie an den Anfang mischt, oder Stopp und Neustart auf ihr), ändert sich die Nummer nicht, und der Sprung bleibt aus. Der Zuschauer sieht dann einen gewöhnlichen Mond statt der Finsternis. Kriterium für „Szenenbeginn" ist deshalb: Nummernwechsel **oder** `elapsedSec` war vor dem Tick 0. Ein Wiederanlauf nach Ruhe (`resumeIfIdle`) lässt `elapsedSec` stehen und springt richtigerweise nicht noch einmal.

- [ ] **Schritt 1: Fehlschlagende Tests schreiben**

In `src/app/cinema.test.ts` den Import ergänzen: `import { advanceCinema, blendedRate, RATE_BLEND_SEC, tickCinema, szenenBeginn } from './cinema';`

Neuen `describe`-Block vor `describe('tickCinema — Zeitsprung …')` einfügen:

```ts
describe('szenenBeginn', () => {
  const basis = { ...DEFAULT_STATE.cinema, running: true, nummer: 3, elapsedSec: 12 };

  it('erkennt den Nummernwechsel', () => {
    expect(szenenBeginn(basis, { ...basis, nummer: 4, elapsedSec: 0.2 })).toBe(true);
  });

  it('erkennt den frischen Start: elapsedSec war 0', () => {
    // startCinema und nextScene setzen elapsedSec auf 0 — auch ohne
    // Nummernwechsel beginnt damit eine Szene.
    expect(szenenBeginn({ ...basis, elapsedSec: 0 }, { ...basis, elapsedSec: 0.016 })).toBe(true);
  });

  it('zählt einen laufenden Tick und den Wiederanlauf nach Ruhe nicht als Beginn', () => {
    // resumeIfIdle lässt elapsedSec stehen: kein zweiter Sprung mitten in der Szene.
    expect(szenenBeginn(basis, { ...basis, elapsedSec: 12.016 })).toBe(false);
  });
});
```

Im Block `describe('tickCinema — Zeitsprung auf die nächste Mondfinsternis', …)` zwei Tests ergänzen:

```ts
  it('springt auch, wenn das Kino direkt auf der Finsternis-Szene startet', () => {
    // Playlist-Position 0 oder Neustart auf der Szene: keine Nummernänderung,
    // aber elapsedSec 0 wie nach startCinema.
    useStore.setState({
      cinema: {
        ...DEFAULT_STATE.cinema,
        running: true, nummer: indexMondfinsternis, elapsedSec: 0, seed: 1, shuffle: false,
      },
      time: { ...DEFAULT_STATE.time, jd: J2000 },
    });
    tickCinema(0.016);

    const f = naechsteMondfinsternis(bodyIndex, J2000)!;
    const erwartet = f.eintrittJd - 0.1 * (f.austrittJd - f.eintrittJd);
    expect(useStore.getState().cinema.nummer).toBe(indexMondfinsternis);
    expect(useStore.getState().time.jd).toBeCloseTo(erwartet, 9);
  });

  it('springt nach dem Start nur einmal', () => {
    useStore.setState({
      cinema: {
        ...DEFAULT_STATE.cinema,
        running: true, nummer: indexMondfinsternis, elapsedSec: 0, seed: 1, shuffle: false,
      },
      time: { ...DEFAULT_STATE.time, jd: J2000 },
    });
    tickCinema(0.016);
    const gesprungen = useStore.getState().time.jd;
    tickCinema(0.016);
    expect(useStore.getState().time.jd).toBe(gesprungen);
  });
```

- [ ] **Schritt 2: Tests laufen lassen, Fehlschlag prüfen**

`npx vitest run src/app/cinema.test.ts` — erwartet: `szenenBeginn`-Block scheitert mit „szenenBeginn is not a function" (Import), der Test „springt auch, wenn …" scheitert, weil `time.jd` bei J2000 stehen bleibt.

- [ ] **Schritt 3: Umsetzung**

In `src/app/cinema.ts` vor `tickCinema` einfügen:

```ts
/**
 * Beginnt mit diesem Tick eine Szene? Beim Wechsel der Nummer offensichtlich.
 * Außerdem, wenn `elapsedSec` vor dem Tick 0 war: startCinema und nextScene
 * (ui/cinemaControl.ts) setzen den Zähler auf 0, damit springt eine Szene
 * mit `zeitpunkt` auch an Playlist-Position 0 und nach einem Neustart auf
 * ihr. Der Wiederanlauf nach Ruhe (resumeIfIdle) lässt den Zähler stehen
 * und zählt deshalb nicht als Beginn — kein zweiter Sprung mitten in der
 * Szene.
 */
export function szenenBeginn(
  vorher: AppState['cinema'], nachher: AppState['cinema'],
): boolean {
  return nachher.nummer !== vorher.nummer || vorher.elapsedSec === 0;
}
```

In `tickCinema` die Sprungbedingung ändern. Vorher:

```ts
  if (nachher.nummer !== vorher.nummer && geplant.scene.zeitpunkt === 'naechste-mondfinsternis') {
```

Nachher:

```ts
  if (szenenBeginn(vorher, nachher) && geplant.scene.zeitpunkt === 'naechste-mondfinsternis') {
```

Den Kommentar darüber („Zeitsprung beim Wechsel AUF eine Szene mit `zeitpunkt` …") in der ersten Zeile anpassen zu: „Zeitsprung beim Beginn einer Szene mit `zeitpunkt` (Entwurf §4; Beginn siehe szenenBeginn):". Die JSDoc-Zeile am Feld `zeitpunkt` in `src/data/scenes.ts:45` („Verlangt beim Wechsel AUF diese Szene …") ebenso auf „Verlangt beim Beginn dieser Szene (Wechsel oder Kinostart auf ihr) …" ändern.

- [ ] **Schritt 4: Tests laufen lassen**

`npx vitest run src/app/cinema.test.ts src/data/scenes.test.ts` — erwartet: alle grün, auch die drei bestehenden Zeitsprung-Tests (der Wechsel-Fall bleibt ein Szenenbeginn).

- [ ] **Schritt 5: Lint und Commit**

```bash
npm run lint
git add src/app/cinema.ts src/app/cinema.test.ts src/data/scenes.ts
git commit -m "Kino: Zeitsprung der Finsternis-Szene auch beim Start auf ihr (Playlist-Position 0, Neustart)"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 3: Vergleichstest TS/GLSL für `sonnenAnteil`

**Dateien:**
- Erstellen: `src/render/shadows.glsl-zwilling.test.ts`
- Lesen: `src/render/shadows.ts:73-91` (TS-Fassung), `src/render/shadows.ts:259-269` (GLSL-Fassung in `SCHATTEN_GLSL_FUNKTIONEN`)

**Schnittstellen:**
- Konsumiert: `sonnenAnteil(alpha, beta, gamma): number` und `SCHATTEN_GLSL_FUNKTIONEN: string` aus `./shadows`.
- Produziert: nur den Test. Kein Produktionscode wird geändert.

Hintergrund: Die beiden Fassungen sind heute nur per Kommentar als Zwillinge markiert. Der Test schneidet den Rumpf der GLSL-Funktion aus der Konstante, übersetzt ihn mechanisch nach JavaScript (`float ` → `let `, `acos`/`sqrt`/`max`/`min` → `Math.*`, `PI` → `Math.PI`, `clamp` als Parameter) und wertet ihn per `new Function` aus. Wer künftig eine Seite ändert, ohne die andere nachzuziehen, sieht den Test fallen. Die Übersetzung ist absichtlich dumm: Sie kennt nur genau die Konstrukte, die heute vorkommen, und der Test prüft zusätzlich, dass der übersetzte Rumpf keine unbekannten GLSL-Reste (`vec`, `float`, `dot(`) mehr enthält.

- [ ] **Schritt 1: Test schreiben**

Datei `src/render/shadows.glsl-zwilling.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sonnenAnteil, SCHATTEN_GLSL_FUNKTIONEN } from './shadows';

type Anteil = (alpha: number, beta: number, gamma: number) => number;

const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi);

/**
 * Schneidet den Rumpf von `float sonnenAnteil(...) { ... }` aus dem
 * GLSL-Text und übersetzt ihn mechanisch nach JavaScript. Bewusst nur die
 * Konstrukte, die dort heute vorkommen — jede Erweiterung des Shaders, die
 * hier nicht abgebildet ist, lässt den Restprüfungs-Test unten fallen und
 * verlangt eine bewusste Ergänzung.
 */
function glslSonnenAnteilNachJs(quelle: string): { fn: Anteil; rumpf: string } {
  const kopf = 'float sonnenAnteil(float alpha, float beta, float gamma) {';
  const start = quelle.indexOf(kopf);
  expect(start).toBeGreaterThanOrEqual(0);
  const rumpfStart = start + kopf.length;
  const rumpfEnde = quelle.indexOf('\n}', rumpfStart);
  expect(rumpfEnde).toBeGreaterThan(rumpfStart);

  const rumpf = quelle.slice(rumpfStart, rumpfEnde)
    .replace(/\bfloat\s+/g, 'let ')
    .replace(/\b(acos|sqrt|max|min)\(/g, 'Math.$1(')
    .replace(/\bPI\b/g, 'Math.PI');

  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const roh = new Function('alpha', 'beta', 'gamma', 'clamp', rumpf) as
    (a: number, b: number, g: number, c: typeof clamp) => number;
  return { fn: (a, b, g) => roh(a, b, g, clamp), rumpf };
}

describe('sonnenAnteil — TS- und GLSL-Fassung rechnen gleich', () => {
  const { fn: glsl, rumpf } = glslSonnenAnteilNachJs(SCHATTEN_GLSL_FUNKTIONEN);

  it('die Übersetzung lässt keine GLSL-Reste zurück', () => {
    // Taucht hier etwas auf, wurde der Shader um ein Konstrukt erweitert,
    // das der Übersetzer nicht kennt — dann den Übersetzer erweitern.
    expect(rumpf).not.toMatch(/\b(vec[234]|float|int|dot|length|asin|normalize)\b/);
  });

  it('stimmt auf einem Raster aus Sonnenradius, Okkluderradius und Abstand überein', () => {
    // alpha: Winkelradius der Sonne (Merkur bis Neptun, Entwurf §2: < 0,012 rad).
    // beta: Okkluder von winzig bis Phobos-vor-Mars (0,37 rad).
    const alphas = [0.0002, 0.001, 0.0047, 0.012];
    const betas = [0.0001, 0.0005, 0.003, 0.01, 0.05, 0.37];
    let geprueft = 0;
    for (const alpha of alphas) {
      for (const beta of betas) {
        const bisGamma = alpha + beta + 0.01;
        for (let k = 0; k <= 60; k++) {
          const gamma = (bisGamma * k) / 60;
          const ts = sonnenAnteil(alpha, beta, gamma);
          const gl = glsl(alpha, beta, gamma);
          expect(gl, `alpha=${alpha} beta=${beta} gamma=${gamma}`).toBeCloseTo(ts, 9);
          geprueft++;
        }
      }
    }
    expect(geprueft).toBe(alphas.length * betas.length * 61);
  });

  it('stimmt exakt an den Fallgrenzen der Formel überein', () => {
    // Die drei Frühausgänge (voll, verdeckt, Ringkappe) und der Übergang in
    // die Linsenformel liegen genau auf alpha+beta, |beta−alpha| und 0.
    const faelle: [number, number, number][] = [
      [0.005, 0.01, 0.015], [0.005, 0.01, 0.005], [0.01, 0.005, 0.005],
      [0.01, 0.005, 0], [0.005, 0.005, 0.005], [0.005, 0.005, 0.01],
    ];
    for (const [alpha, beta, gamma] of faelle) {
      expect(glsl(alpha, beta, gamma)).toBeCloseTo(sonnenAnteil(alpha, beta, gamma), 12);
    }
  });
});
```

- [ ] **Schritt 2: Test laufen lassen**

`npx vitest run src/render/shadows.glsl-zwilling.test.ts` — erwartet: PASS (die Fassungen stimmen heute überein; der Test sichert das ab). Fällt er, ist das ein Befund: **nicht** die Toleranz lockern, sondern die Abweichung melden. Zur Kontrolle, dass der Test überhaupt greift, einmal vorübergehend in `SCHATTEN_GLSL_FUNKTIONEN` die Zeile `return clamp(1.0 - linse / (PI * a2), 0.0, 1.0);` auf `… / (PI * a2 * 1.001) …` ändern, den Test laufen lassen (erwartet: FAIL im Rastertest), dann die Änderung rückgängig machen (`git checkout src/render/shadows.ts`) und `git diff --stat` leer bestätigen.

- [ ] **Schritt 3: Lint prüfen**

`npm run lint`. Beanstandet ESLint eine der beiden Regeln im `eslint-disable`-Kommentar nicht (Meldung „Unused eslint-disable directive"), den nicht benötigten Regelnamen aus dem Kommentar entfernen. Beanstandet ESLint eine andere Regel für `new Function`, deren Namen ergänzen. Ergebnis muss sein: 0 Fehler, 0 Warnungen.

- [ ] **Schritt 4: Kommentar am TS-Zwilling ergänzen und committen**

In `src/render/shadows.ts` im JSDoc von `sonnenAnteil` nach dem Satz „TS-Zwilling von SCHATTEN_GLSL_FUNKTIONEN weiter unten …" den Satz ergänzen: „Gleichheit sichert shadows.glsl-zwilling.test.ts durch mechanische Übersetzung des GLSL-Rumpfs ab."

```bash
git add src/render/shadows.glsl-zwilling.test.ts src/render/shadows.ts
git commit -m "Schatten: Vergleichstest TS/GLSL für sonnenAnteil über mechanische Übersetzung des Shader-Rumpfs"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 4: Messung — Schattensichtbarkeit in `galileisches-schattenspiel` und `saturn-streiflicht` bei kürzeren Abständen

**Dateien:**
- Vorübergehend ändern und **wieder zurücksetzen**: `src/data/scenes.ts:96-101` (`saturn-streiflicht`, `distanceInRadii: 5`), `src/data/scenes.ts:197-202` (`galileisches-schattenspiel`, `distanceInRadii: 55`)
- Schreiben nur nach `.playwright-mcp/` (Skripte, Bilder, Messprotokoll `.playwright-mcp/t4-messung.md`)

**Schnittstellen:**
- Konsumiert: `window.store` (Zustand-Store) im DEV-Build; `display.shadows` als Schalter; `SCENES`-Indizes: `saturn-streiflicht` = 1, `galileisches-schattenspiel` = 7 (bei `shuffle:false`).
- Produziert: Messtabelle und Bilder für das Ruling; **keinen Commit**. Der Commit folgt in Task 5 nach Jens' Entscheidung.

Hintergrund (Abnahme 3b-2): In `galileisches-schattenspiel` (55 Radien) ist der Io-Schatten auf Jupiter rechnerisch 0,55 px groß, in `saturn-streiflicht` (5 Radien, Phasenwinkel 143°) liegt der Ringschatten fast ganz auf der Nachtseite. Gemessen werden je Szene drei Abstände; das Kriterium ist die Zahl der Pixel, die sich beim Umlegen von `display.shadows` ändern, und daneben die Bildkomposition (der Zielkörper darf nicht aus dem Bild laufen, Monde sollen sichtbar bleiben).

- [ ] **Schritt 1: Server und Ausgangszustand prüfen**

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`. `git status --short` muss leer sein (Tasks 1 bis 3 sind committet).

- [ ] **Schritt 2: Messskript anlegen**

`.playwright-mcp/diff.py`:

```python
import sys
import numpy as np
from PIL import Image
a = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)
b = np.asarray(Image.open(sys.argv[2]).convert('RGB')).astype(int)
d = np.abs(a - b).max(axis=2)
maske = d > 8   # Schwelle gegen Bloom-Rauschen, wie in der Abnahme 3b-2
ys, xs = np.nonzero(maske)
print('abweichende Pixel (>8):', int(maske.sum()), 'max Abweichung:', int(d.max()))
if len(xs):
    print('Bereich x', int(xs.min()), int(xs.max()), 'y', int(ys.min()), int(ys.max()))
```

- [ ] **Schritt 3: Je Szene und Abstand zwei Aufnahmen (Schatten an/aus)**

Abstände: `saturn-streiflicht` mit 5 (Ist), 3,5 und 2,5 Radien; `galileisches-schattenspiel` mit 55 (Ist), 30 und 15 Radien. Für jeden Abstand:

1. `distanceInRadii` in `src/data/scenes.ts` auf den Wert setzen (nur dieses eine Feld), Seite neu laden (`browser_navigate` auf `http://localhost:5173/Orrery/`), Texturen laden lassen (3 s).
2. Szene stellen und anhalten (`browser_evaluate`):
   ```js
   const s = window.store.getState();
   s.setCinema({ running: true, shuffle: false, nummer: <1 oder 7>, elapsedSec: 0, pauseOnInput: false });
   s.setCamera({ mode: 'cinema' });
   ```
   dann nach 3 s:
   ```js
   const s = window.store.getState();
   s.setCinema({ running: false }); s.setTime({ paused: true });
   s.setDisplay({ shadows: true });
   [s.cinema.elapsedSec, s.time.jd]
   ```
   Werte notieren, 1 s warten, Screenshot `.playwright-mcp/t4-<szene>-<abstand>-an.png`.
3. `window.store.getState().setDisplay({ shadows: false })`, 1 s warten, Screenshot `.playwright-mcp/t4-<szene>-<abstand>-aus.png`.
4. `python .playwright-mcp/diff.py <an> <aus>` — Ausgabe notieren.

Wichtig: Zwischen den beiden Aufnahmen darf sich nichts außer dem Schalter ändern (Uhr steht, Kamera steht, Maus ruht). Ein Differenzbild von 0 Pixeln bei einem Abstand, bei dem Schatten erwartet wird, ist ein Befund und wird gemeldet, nicht wiederholt, bis etwas erscheint.

- [ ] **Schritt 4: Datei zurücksetzen und Protokoll schreiben**

`git checkout src/data/scenes.ts` und `git status --short` leer bestätigen. Protokoll `.playwright-mcp/t4-messung.md` mit einer Tabelle je Szene: Abstand, abweichende Pixel, max. Abweichung, Bereich, Bemerkung zur Komposition (Ziel im Bild? Monde sichtbar? Ringe angeschnitten?). Dazu die Dateinamen der `an`-Bilder. **Kein Commit.**

---

### Task 5: Ruling umsetzen (nur, wenn Jens neue Abstände wählt)

**Dateien:**
- Ändern: `src/data/scenes.ts:101` und/oder `src/data/scenes.ts:202` (`distanceInRadii`)
- Test: `src/data/scenes.test.ts` (bestehende Invarianten müssen grün bleiben)

**Schnittstellen:**
- Konsumiert: die gewählten Werte aus dem Abschnitt „Rulings" unten.
- Produziert: neue Szenenparameter; keine Schnittstellenänderung.

- [ ] **Schritt 1: Werte eintragen und Kommentar ergänzen**

Für jede geänderte Szene den Wert setzen und im Kommentar über der Szene eine Zeile ergänzen, warum: „Abstand von <alt> auf <neu> Radien (Folgearbeit 3b-2, 13.09.2026): bei <alt> Radien <n> Schattenpixel, bei <neu> <m>."

- [ ] **Schritt 2: Tests, Lint, Build**

`npm test`, `npm run lint`, `npm run build` — alle grün; Ausgabe zeigen.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/scenes.ts
git commit -m "Kino: Szenen galileisches-schattenspiel und saturn-streiflicht näher am Ziel, Schatten sichtbar (Messung 13.09.2026)"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

Wählt Jens „bleibt wie es ist", entfällt Task 5; der Befund wird in `docs/phase3b-schatten-abnahme.md` unter „Offene Folgearbeit" als erledigt mit Verweis auf die Messwerte vermerkt (eigener kleiner Commit „Abnahme 3b-2: Szenenabstände geprüft, unverändert belassen").

---

### Abschluss

- [ ] `npm run lint`, `npm test`, `npm run build` auf dem Branch, Ausgabe zeigen.
- [ ] `docs/phase3b-schatten-abnahme.md`: Abschnitt „Offene Folgearbeit" um den Stand ergänzen (drei Punkte erledigt mit Commit-Kürzel, Szenen laut Ruling). die lokale Projektanleitung (nicht versioniert) im Abschnitt „Stand" nachziehen.
- [ ] Fast-Forward nach `master` (`git checkout master && git merge --ff-only phase3-folgearbeit`), Branch löschen, `.playwright-mcp/` leeren.

## Rulings

(Entscheidungen während der Umsetzung, gesammelt für Jens.)

- 2026-09-13 — Aufteilung Phase 4: Reihenfolge Phase-3-Folgearbeit → 4a Englisch → Persistenz → Infopanel (Jens). Hildas/Trojaner entfallen (Jens).
