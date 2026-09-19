# Flug Etappe 2: Nachträge aus Etappe 1, Controller und Fadenkreuz

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die fünf Entscheidungen nach der Abnahme von Etappe 1 umsetzen (Bezug nach Systemen, Ziel nach dem Kino, Sperre nach Shift, Dämpfung von Wiederherstellungen, Körper nächst der Bildmitte nach Scheibenrand) und danach mit einem Xbox-Controller fliegen, drehen und über ein bewegliches Fadenkreuz Körper anfahren.

**Architecture:** Die Nachträge ändern `render/camera/flug.ts`, `render/camera/cinema.ts`, `render/camera/controller.ts`, `ui/steuerung/tastatur.ts` und `ui/steuerung/anwenden.ts`. Der Controller wird je Bild in `steuerungTakt` gelesen: `ui/steuerung/gamepad.ts` wertet ein Controllerbild rein aus (Totzonen, Kurven, Flanken) und kapselt `navigator.getGamepads()`; `anwenden.ts` setzt die Absicht wie die Tastatur um, meldet Eingaben an Ruhewächter, Kino und Fahrt und führt die Tasten aus. Das Fadenkreuz ist Modulzustand in `ui/steuerung/kreuz.ts`, `ui/steuerung/Fadenkreuz.tsx` zeigt es, gezeichnet wird je Bild direkt am Element; seine Lage geht als Zeigerart `pad` an die Trefferprüfung der Szene.

**Tech Stack:** TypeScript, three.js, Zustand, React, Vitest (Umgebung `node`, DOM-Tests mit `// @vitest-environment jsdom`), React Testing Library, Playwright-MCP für die Abnahme, Python 3.12 mit Pillow/numpy für Pixelmessungen.

**Spec:** `docs/superpowers/specs/2026-09-19-flug-und-controller-design.md` (§5 bis §10 für den Controller, §13 Nachtrag für die Tasks 1 bis 5). Umsetzer lesen den Entwurf mit.

## Global Constraints

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll), Umlaute korrekt; Englisch nur in `src/ui/i18n/en.ts`.
- Commits allein Jens Fricke, **ohne jede Trailer-Zeile** (keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen). Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei; Protokolle nennen Wort- und Trailerprüfung nur als Verweis, nie mit Suchmuster.
- Branch `flug-2` von `master` (nach dem Commit dieses Plans), **kein Worktree**, kein `git stash`/`reset`/`checkout --`. Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus; erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Immer nur ein Umsetzer gleichzeitig (gemeinsamer Browser); Reviewer dürfen parallel laufen.
- Schichten: `render/` importiert nichts aus `ui/` (`render/schichten.test.ts`), `store/` nichts aus `ui/`, `app/`, `render/` (`store/schichten.test.ts`). `ui/` darf `render/` nutzen.
- Keine neue Abhängigkeit in `package.json`.
- NTFS: Ein reines Modul heißt nie wie eine Komponente im selben Ordner (`kreuz.ts` neben `Fadenkreuz.tsx` ist in Ordnung).
- Zahlen aus dem Entwurf §12.1 und §13: Stick-Totzone 0,15 kreisförmig, danach quadratisch; Trigger-Totzone 0,05, linear; Stick-Blick und Stick-Drehen mit LB 90°/s; Zoom mit LB und Trigger Faktor 2 je s; Fadenkreuz eine Canvas-Höhe je s, etwa 24 px, Fangradius 20 px; Einflussbereich höchstens 0,5 des dargestellten Sonnenabstands; Rückstellbereich 0,8 (Systemgrenze 1/0,8); Übergangsdämpfung 0,45 s bis zum Rest 10⁻³, sonst 0,15 s.
- Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen). Testzahl vorher 3769; die Soll-Zahl nach jedem Task steht im Task.
- Playwright schreibt nur nach `.playwright-mcp/`; direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`. Screenshots und Skripte vor dem Commit löschen, nur gezielt `git add`en.

## Dateiübersicht

| Datei | Task | Verantwortung |
|---|---|---|
| `src/render/camera/flug.ts` | 1, 2 | Einflussbereich, Bezug nach Systemen; Körper nächst der Bildmitte nach Scheibenrand |
| `src/render/camera/cinema.ts` | 3 | `blickzielVon(scene)` |
| `src/ui/steuerung/anwenden.ts` | 3, 7, 8, 9 | Ziel nach dem Kino; Controller-Absicht, Sperre nach LB, Meldungen; Fadenkreuz-Takt; Tasten |
| `src/ui/steuerung/tastatur.ts` | 4 | Sperre gehaltener Tasten nach dem Loslassen von Shift |
| `src/render/camera/controller.ts` | 5 | Übergangsdämpfung bei Wiederherstellungen |
| `src/ui/steuerung/gamepad.ts` (neu) | 6 | Standardbelegung, Totzonen, Kurven, Flanken, Leser |
| `src/ui/idle.ts` | 7 | `eingabeMelden()` |
| `src/render/treffer.ts` | 8 | Zeigerart `pad` |
| `src/ui/steuerung/kreuz.ts` (neu), `src/ui/steuerung/Fadenkreuz.tsx` (neu) | 8 | Fadenkreuz: Zustand, Anzeige, Maus blendet aus |
| `src/app/main.tsx` | 10 | Verdrahtung Leser, Fadenkreuz, Treffer, Zeiger, Mauszeigerform |
| `src/ui/App.tsx`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` | 10 | Kürzelübersicht, Abschnitt „Controller" |
| `docs/flug-etappe2-abnahme.md` (neu) | 11 | Abnahmeprotokoll |

---

### Task 1: Bezug nach Systemen (Nachtrag §13.1)

**Files:**
- Modify: `src/render/camera/flug.ts` (Import, `KoerperStand` Zeile 31, neue Konstante und Funktion nach Zeile 22, `koerperStaende` Zeilen 71–79, `waehleBezug` Zeilen 81–100)
- Modify: `src/render/camera/flug.test.ts` (Importe, neuer `describe`-Block nach dem Block `waehleBezug`)

**Interfaces:**
- Produces: `KoerperStand` mit den optionalen Feldern `mutter?: string | null` und `einfluss?: number`; `EINFLUSS_DECKEL = 0.5`; `einflussbereich(b: Body, index: BodyIndex, pos: Vec3, s: ScaleSettings): number | undefined`; `waehleBezug(p, staende, bisher)` mit unveränderter Signatur und zweistufiger Wahl. Stände ohne `mutter`/`einfluss` (Literale in Tests) wählen wie bisher allein nach q.

- [ ] **Step 1: Failing tests schreiben**

In `src/render/camera/flug.test.ts` die Importe ergänzen: `EINFLUSS_DECKEL` in die Importliste aus `./flug`, die Zeile `import { scaledPositionAt, scaledRadius } from '../../sim/scale';` ersetzen durch `import { scaledPositionAt, scaledRadius, SCALE_PRESETS } from '../../sim/scale';` und `import { AU_KM } from '../../sim/orbit';` hinzufügen. Nach dem `describe('waehleBezug', …)`-Block einfügen:

```ts
describe('waehleBezug nach Systemen (Nachtrag §13.1)', () => {
  const staende = koerperStaende(bodies, bodyIndex, jd, s, {});
  const erdeStand = staende.find((k) => k.id === 'earth')!;

  it('gibt Sonnenumläufern den Einflussbereich: Hill-Radius mal sizeScale, höchstens der halbe Sonnenabstand', () => {
    const e = bodyIndex.earth!;
    const hill = e.orbit!.a * AU_KM * Math.cbrt(e.physical.massKg / (3 * bodyIndex.sun!.physical.massKg));
    const real = koerperStaende([e], bodyIndex, jd, SCALE_PRESETS.realistisch, {})[0]!;
    expect(real.einfluss! / hill).toBeCloseTo(1, 12);
    const kompakt = koerperStaende([e], bodyIndex, jd, SCALE_PRESETS.kompakt, {})[0]!;
    const deckel = EINFLUSS_DECKEL * laenge(scaledPositionAt('earth', bodyIndex, jd, SCALE_PRESETS.kompakt));
    expect(kompakt.einfluss! / deckel).toBeCloseTo(1, 12);
    expect(erdeStand.mutter).toBe('sun');
    const mond = staende.find((k) => k.id === 'moon')!;
    expect(mond.mutter).toBe('earth');
    expect(mond.einfluss).toBeUndefined();
    expect(staende.find((k) => k.id === 'sun')!.einfluss).toBeUndefined();
  });

  it('bleibt zwischen Erde und Mond bei der Erde und nimmt dicht vor dem Mond den Mond', () => {
    const erde = lage('earth');
    const mond = lage('moon');
    const richtung = normiert(minus(mond, erde));
    const d = laenge(minus(mond, erde)) / radius('earth');
    const auf = (erdradien: number) => plus(erde, mal(richtung, erdradien * radius('earth')));
    // Vor dem Nachtrag gewann hier ab rund 15 Erdradien die Sonne.
    expect(waehleBezug(auf(30), staende, null)).toBe('earth');
    expect(waehleBezug(auf(30), staende, 'earth')).toBe('earth');
    // Bisher Erde: Der Mond gewinnt erst unter vier Fünfteln des Erdmaßes, rund 11 Erdradien vor ihm.
    expect(waehleBezug(auf(d - 12), staende, 'earth')).toBe('earth');
    expect(waehleBezug(auf(d - 8), staende, 'earth')).toBe('moon');
  });

  it('verlässt das Erdsystem erst jenseits des Rückstellbereichs und tritt unter 1 ein', () => {
    const aussen = normiert(erdeStand.pos);
    const bei = (t: number) => plus(erdeStand.pos, mal(aussen, t * erdeStand.einfluss!));
    expect(waehleBezug(bei(0.9), staende, 'sun')).toBe('earth');
    expect(waehleBezug(bei(1.1), staende, 'sun')).toBe('sun');
    expect(waehleBezug(bei(1.1), staende, 'earth')).toBe('earth');
    expect(waehleBezug(bei(1.3), staende, 'earth')).toBe('sun');
  });

  it('nimmt bei überlappenden Bereichen das tiefere System, ein bisheriges erst unter vier Fünfteln', () => {
    const zwei: KoerperStand[] = [
      { id: 'stern', pos: { x: 0, y: 0, z: 0 }, radius: 100, mutter: null },
      { id: 'a', pos: { x: 1000, y: 0, z: 0 }, radius: 1, mutter: 'stern', einfluss: 50 },
      { id: 'b', pos: { x: 1060, y: 0, z: 0 }, radius: 1, mutter: 'stern', einfluss: 40 },
      { id: 'am', pos: { x: 1010, y: 0, z: 0 }, radius: 0.5, mutter: 'a' },
    ];
    // x = 1035: Tiefe in a 35/50 = 0,7, in b 25/40 = 0,625.
    expect(waehleBezug({ x: 1035, y: 0, z: 0 }, zwei, null)).toBe('b');
    expect(waehleBezug({ x: 1035, y: 0, z: 0 }, zwei, 'a')).toBe('a');
    // x = 1045: in a 0,9, in b 0,375 < 0,8 · 0,9 — auch vom Mond am aus gewinnt b.
    expect(waehleBezug({ x: 1045, y: 0, z: 0 }, zwei, 'am')).toBe('b');
  });

  it('lässt Monde eines ausgeblendeten Mutterkörpers auf oberster Ebene mitbewerben', () => {
    const ohneErde = koerperStaende(bodies, bodyIndex, jd, s, { earth: false });
    expect(waehleBezug(plus(lage('moon'), { x: 0, y: 0, z: 1.5 * radius('moon') }), ohneErde, null)).toBe('moon');
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/render/camera/flug.test.ts`
Expected: FAIL — `EINFLUSS_DECKEL` fehlt beim Import (Typfehler zählt nicht, Vitest meldet `undefined`), `einfluss` ist `undefined`, bei 30 Erdradien kommt `'sun'`.

- [ ] **Step 3: Umsetzen**

`src/render/camera/flug.ts`, nach der Zeile `import { scaledPositionAt, scaledRadius } from '../../sim/scale';`:

```ts
import { AU_KM } from '../../sim/orbit';
```

Nach `export const MINDESTABSTAND_RADIEN = 1.05;` einfügen:

```ts
/** Obergrenze des Einflussbereichs als Anteil des dargestellten Sonnenabstands (Nachtrag §13.1). */
export const EINFLUSS_DECKEL = 0.5;
```

Die Zeile `export interface KoerperStand { id: string; pos: Vec3; radius: number }` samt Kommentar ersetzen durch:

```ts
/**
 * Dargestellte Lage und dargestellter Radius eines sichtbaren Körpers, dazu
 * sein Mutterkörper und — bei Sonnenumläufern — der dargestellte
 * Einflussbereich (Nachtrag §13.1). Fehlen beide (Literale in Tests), zählt
 * der Stand zur obersten Ebene.
 */
export interface KoerperStand {
  id: string; pos: Vec3; radius: number;
  mutter?: string | null;
  einfluss?: number;
}
```

Den Block `/** Dargestellte Lage und Radius aller sichtbaren Körper zu `jd`. */ … koerperStaende …` ersetzen durch:

```ts
/**
 * Dargestellter Einflussbereich eines Sonnenumläufers (Nachtrag §13.1):
 * Hill-Radius a · (m / 3M)^(1/3) mit der großen Halbachse zur Epoche,
 * vergrößert um sizeScale wie die Mondbahnen (sim/scale.ts), höchstens
 * EINFLUSS_DECKEL mal der dargestellte Sonnenabstand `pos`. Monde und die
 * Sonne haben keinen.
 */
export function einflussbereich(b: Body, index: BodyIndex, pos: Vec3, s: ScaleSettings): number | undefined {
  const sonne = index.sun;
  if (b.parent !== 'sun' || b.orbit === null || sonne === undefined) return undefined;
  const hill = b.orbit.a * AU_KM * Math.cbrt(b.physical.massKg / (3 * sonne.physical.massKg));
  return Math.min(hill * s.sizeScale, EINFLUSS_DECKEL * laenge(pos));
}

/** Dargestellte Lage, Radius, Mutterkörper und Einflussbereich aller sichtbaren Körper zu `jd`. */
export function koerperStaende(
  liste: readonly Body[], index: BodyIndex, jd: number, s: ScaleSettings,
  visible: Record<string, boolean>,
): KoerperStand[] {
  return liste
    .filter((b) => visible[b.id] !== false)
    .map((b) => {
      const pos = scaledPositionAt(b.id, index, jd, s);
      return { id: b.id, pos, radius: scaledRadius(b, s), mutter: b.parent, einfluss: einflussbereich(b, index, pos, s) };
    });
}
```

Den Block von `/** * Bezugskörper (§3.3): …` bis zum Ende von `waehleBezug` ersetzen durch:

```ts
/**
 * Kleinster Abstand in eigenen Radien (§3.3). Ein anderer als `bisher` gewinnt
 * erst unter BEZUG_RUECKSTELLUNG mal dessen Maß; fehlt `bisher` unter den
 * Kandidaten, gilt der beste sofort.
 */
function naechsterInRadien(p: Vec3, kandidaten: readonly KoerperStand[], bisher: string | null): string | null {
  let bester: KoerperStand | null = null;
  let besterQ = Infinity;
  let bisherQ = Infinity;
  for (const k of kandidaten) {
    const q = laenge(minus(p, k.pos)) / k.radius;
    if (k.id === bisher) bisherQ = q;
    if (q < besterQ) { besterQ = q; bester = k; }
  }
  if (bester === null) return null;
  if (bisher !== null && bisherQ < Infinity && besterQ >= BEZUG_RUECKSTELLUNG * bisherQ) return bisher;
  return bester.id;
}

/**
 * Bezugskörper (§3.3, Nachtrag §13.1), zweistufig. Zuerst das System: der
 * Sonnenumläufer, in dessen Einflussbereich die Lage am tiefsten steht
 * (t = Abstand / Einflussbereich < 1). Ein bisheriges System bleibt bis
 * t ≥ 1 / BEZUG_RUECKSTELLUNG, ein anderes gewinnt vorher erst unter
 * BEZUG_RUECKSTELLUNG · t_bisher. Dann darin der Körper mit dem kleinsten
 * Abstand in eigenen Radien. Außerhalb jedes Systems konkurrieren die Sonne,
 * die Sonnenumläufer und Monde ausgeblendeter Mutterkörper. Ohne das hätte im
 * Schaubild die groß dargestellte Sonne schon wenige Erdradien vor der Erde
 * gewonnen.
 */
export function waehleBezug(
  p: Vec3, staende: readonly KoerperStand[], bisher: string | null,
): string | null {
  const zentren = staende.filter((k) => k.einfluss !== undefined && k.einfluss > 0);
  const tiefe = (z: KoerperStand): number => laenge(minus(p, z.pos)) / (z.einfluss ?? Infinity);
  const systemVon = (k: KoerperStand): KoerperStand | null =>
    zentren.find((z) => z.id === k.id || z.id === k.mutter) ?? null;

  let system: KoerperStand | null = null;
  let systemT = Infinity;
  for (const z of zentren) {
    const t = tiefe(z);
    if (t < 1 && t < systemT) { system = z; systemT = t; }
  }
  const bisherStand = bisher === null ? undefined : staende.find((k) => k.id === bisher);
  const bisherSystem = bisherStand === undefined ? null : systemVon(bisherStand);
  if (bisherSystem !== null) {
    const t = tiefe(bisherSystem);
    const anderesTiefer = system !== null && system !== bisherSystem && systemT < BEZUG_RUECKSTELLUNG * t;
    if (t < 1 / BEZUG_RUECKSTELLUNG && !anderesTiefer) system = bisherSystem;
  }
  const kandidaten = system === null
    ? staende.filter((k) => { const eigenes = systemVon(k); return eigenes === null || eigenes === k; })
    : staende.filter((k) => systemVon(k) === system);
  return naechsterInRadien(p, kandidaten, bisher);
}
```

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/render/camera/flug.test.ts src/ui/steuerung/anwenden.test.ts`
Expected: PASS (die älteren Bezugstests in beiden Dateien bleiben grün: zwischen Erde und Mars zur Epoche die Sonne, dicht am Mond der Mond, ausgeblendete Erde die Sonne).

- [ ] **Step 5: Prüfläufe und Commit**

Run: `npm test` (Soll 3774), `npx tsc -b`, `npm run lint`.

```bash
git add src/render/camera/flug.ts src/render/camera/flug.test.ts
git commit -m "Flug: Bezug nach Systemen mit Einflussbereich"
```

---

### Task 2: Körper nächst der Bildmitte nach Scheibenrand (Nachtrag §13.5)

**Files:**
- Modify: `src/render/camera/flug.ts` (`koerperNaechstDerMitte` samt JSDoc)
- Modify: `src/render/camera/flug.test.ts` (Block `koerperNaechstDerMitte`)

**Interfaces:**
- Produces: `koerperNaechstDerMitte(pose, staende)` mit unveränderter Signatur; ohne Scheibe auf der Achse gewinnt der kleinste Winkel zwischen Achse und Scheibenrand.

- [ ] **Step 1: Failing test schreiben**

In `src/render/camera/flug.test.ts`, Block `describe('koerperNaechstDerMitte', …)`, nach dem Test `'nimmt sonst den kleinsten Winkel'` einfügen:

```ts
  it('misst ohne Scheibe auf der Achse bis zum Scheibenrand, nicht bis zur Mitte (Nachtrag §13.5)', () => {
    // Die Mitte von i liegt näher an der Achse (0,080 rad gegen 0,100 rad), der
    // Rand von j aber näher (0,050 rad gegen 0,079 rad).
    expect(koerperNaechstDerMitte(pose, [k('i', 100, 8, 0.1), k('j', 100, 10, 5)])).toBe('j');
  });
```

- [ ] **Step 2: Test laufen lassen, er scheitert**

Run: `npx vitest run src/render/camera/flug.test.ts -t "Scheibenrand"`
Expected: FAIL (`'i'` statt `'j'`).

- [ ] **Step 3: Umsetzen**

In `src/render/camera/flug.ts` die Funktion `koerperNaechstDerMitte` samt JSDoc ersetzen durch:

```ts
/**
 * Körper nächst der Bildmitte (§4.2, Nachtrag §13.5): Liegt die Blickachse auf
 * einer Scheibe (Winkel kleiner als der Winkelradius), der vorderste solche
 * Körper; sonst der mit dem kleinsten Winkel zwischen Achse und Scheibenrand —
 * sonst gewänne ein kleiner Mond knapp neben der Achse gegen eine große
 * Scheibe, deren Rand ihr näher liegt. Nur Körper vor der Kamera; einer, in
 * dem die Kamera steckt, zählt nicht. Entspricht Rang 1a der Trefferprüfung
 * (render/treffer.ts), braucht aber keine Kandidaten.
 */
export function koerperNaechstDerMitte(pose: Pose, staende: readonly KoerperStand[]): string | null {
  let scheibe: { id: string; abstand: number } | null = null;
  let naechster: { id: string; rand: number } | null = null;
  for (const k of staende) {
    const d = minus(k.pos, pose.positionKm);
    const abstand = laenge(d);
    if (abstand <= k.radius) continue;
    const vorn = punkt(d, pose.blick);
    if (vorn <= 0) continue;
    // atan2 statt acos: auch bei winzigen Winkeln ferner Körper genau.
    const winkel = Math.atan2(laenge(kreuz(d, pose.blick)), vorn);
    const winkelradius = Math.asin(k.radius / abstand);
    if (winkel < winkelradius) {
      if (scheibe === null || abstand < scheibe.abstand) scheibe = { id: k.id, abstand };
    } else if (naechster === null || winkel - winkelradius < naechster.rand) {
      naechster = { id: k.id, rand: winkel - winkelradius };
    }
  }
  return scheibe?.id ?? naechster?.id ?? null;
}
```

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/render/camera/flug.test.ts src/ui/steuerung/anwenden.test.ts`
Expected: PASS.

- [ ] **Step 5: Prüfläufe und Commit**

Run: `npm test` (Soll 3775), `npx tsc -b`, `npm run lint`.

```bash
git add src/render/camera/flug.ts src/render/camera/flug.test.ts
git commit -m "Flug: Körper nächst der Bildmitte nach dem Abstand zum Scheibenrand"
```

---

### Task 3: Ziel nach dem Wechsel vom Kino in den Flug (Nachtrag §13.2)

**Files:**
- Modify: `src/render/camera/cinema.ts` (Import `Scene`, neue Funktion nach `cinemaTargetFor`)
- Modify: `src/render/camera/cinema.test.ts` (Import, neuer `describe`-Block am Ende)
- Modify: `src/ui/steuerung/anwenden.ts` (Importe, `flugStarten`)
- Modify: `src/ui/steuerung/anwenden.test.ts` (Import `SCENES`, zwei Tests im Block `steuerungTakt: Flug`)

**Interfaces:**
- Produces: `blickzielVon(scene: Scene): string` in `render/camera/cinema.ts`. `flugStarten(pose)` setzt aus einem aktiven Kino `targetId` auf `blickzielVon` der geplanten Szene.

- [ ] **Step 1: Failing tests schreiben**

`src/render/camera/cinema.test.ts`: `blickzielVon` in den Import aus `./cinema` aufnehmen und am Dateiende anhängen:

```ts
describe('blickzielVon (Nachtrag Flug §13.2)', () => {
  it('nennt den Körper, auf den die Szene blickt', () => {
    expect(blickzielVon(szene('erdaufgang'))).toBe('earth');
    expect(blickzielVon(szene('phobos-tiefflug'))).toBe('mars');
    // Sichtlinie: lookAtId legt nur die Linie fest, der Blick gilt dem Standortkörper.
    expect(blickzielVon(szene('mondfinsternis'))).toBe('moon');
  });

  it('stimmt für jede Szene mit dem Blickpunkt von cinemaTargetFor überein (Zwilling)', () => {
    for (const sc of SCENES) {
      const ziel = cinemaTargetFor(feste(sc), 0, jd, s);
      expect(abstand(ziel.lookAtKm, scaledPositionAt(blickzielVon(sc), bodyIndex, jd, s))).toBeLessThan(1e-6);
    }
  });
});
```

`src/ui/steuerung/anwenden.test.ts`: `import { SCENES } from '../../data/scenes';` ergänzen und im Block `describe('steuerungTakt: Flug', …)` nach dem Test `'beendet ein Kino samt Wiederherstellung und fliegt ab dem gezeigten Bild'` einfügen:

```ts
  it('macht beim Flug aus dem Kino den Körper zum Ziel, auf den die Szene blickt (Nachtrag §13.2)', () => {
    useStore.getState().setCinema({ nummer: SCENES.findIndex((sz) => sz.id === 'phobos-tiefflug'), shuffle: false });
    useStore.getState().setCamera({ targetId: 'jupiter' });
    startCinema();
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    expect(camera.targetId).toBe('mars');
  });

  it('nimmt bei einer Sichtlinie den Standortkörper als Ziel', () => {
    useStore.getState().setCinema({ nummer: SCENES.findIndex((sz) => sz.id === 'mondfinsternis'), shuffle: false });
    startCinema();
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    expect(useStore.getState().camera.targetId).toBe('moon');
  });
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/render/camera/cinema.test.ts src/ui/steuerung/anwenden.test.ts`
Expected: FAIL (`blickzielVon` ist keine Funktion; Ziel bleibt `'jupiter'` bzw. `'sun'`).

- [ ] **Step 3: Umsetzen**

`src/render/camera/cinema.ts`: nach `import type { CameraTarget } from './controller';` einfügen `import type { Scene } from '../../data/scenes';` und am Dateiende anhängen:

```ts
/**
 * Der Körper, auf den eine Szene blickt (Nachtrag Flug §13.2): bei der
 * Sichtlinie der Standortkörper, sonst `lookAtId`, ohne ihn der
 * Standortkörper. Zwilling der Blickpunktwahl in cinemaTargetFor.
 */
export function blickzielVon(scene: Scene): string {
  return scene.path === 'sichtlinie' ? scene.targetId : (scene.lookAtId ?? scene.targetId);
}
```

`src/ui/steuerung/anwenden.ts`: nach `import { bodies, bodyIndex } from '../../data';` einfügen

```ts
import { SCENES } from '../../data/scenes';
import { plannedSceneAt } from '../../sim/director';
```

und nach `import type { Absicht, GezeigtePose } from '../../render/camera/flug';` einfügen `import { blickzielVon } from '../../render/camera/cinema';`. Dann `flugStarten` samt JSDoc ersetzen durch:

```ts
/** Körper, auf den die geplante Szene des Kinos blickt (Nachtrag §13.2). */
function kinoBlickziel(): string {
  const { cinema } = useStore.getState();
  return blickzielVon(plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle).scene);
}

/**
 * Startet den Flug an einer gezeigten Lage (Entwurf §3.1): Kino und Fahrt
 * enden, Bezug ist der Körper, dem die Lage in eigenen Radien am nächsten ist.
 * Gerechnet wird mit den Körperlagen des gezeigten Bildes (pose.jd); die
 * Kamera zieht danach mit dem Bezug weiter und springt auch bei laufender Uhr
 * nicht. targetId bleibt (Entscheidung 8) — außer beim Wechsel aus dem Kino:
 * Dann wird der Körper Ziel, auf den die Szene blickt (Nachtrag §13.2), sonst
 * zeigte das Infopanel einen Körper, den die Kamera gar nicht ansteuert. Er
 * wird vor stopCinema gelesen, das die Kamera von vor dem Start zurückholt.
 */
export function flugStarten(pose: GezeigtePose): void {
  const kinoZiel = cinemaAktiv() ? kinoBlickziel() : null;
  if (kinoZiel !== null) stopCinema();
  fahrtAbbrechen();
  const { scale, visible, setCamera } = useStore.getState();
  const staende = koerperStaende(bodies, bodyIndex, pose.jd, scale, visible);
  const refId = waehleBezug(pose.positionKm, staende, null) ?? 'sun';
  const ref = scaledPositionAt(refId, bodyIndex, pose.jd, scale);
  setCamera({
    mode: 'fly',
    ...(kinoZiel === null ? {} : { targetId: kinoZiel }),
    fly: { refId, ...minus(pose.positionKm, ref), ...blickAus(pose.blick) },
  });
}
```

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/render/camera/cinema.test.ts src/ui/steuerung/anwenden.test.ts`
Expected: PASS.

- [ ] **Step 5: Prüfläufe und Commit**

Run: `npm test` (Soll 3779), `npx tsc -b`, `npm run lint`.

```bash
git add src/render/camera/cinema.ts src/render/camera/cinema.test.ts src/ui/steuerung/anwenden.ts src/ui/steuerung/anwenden.test.ts
git commit -m "Flug: Aus dem Kino wird der Körper Ziel, auf den die Szene blickt"
```

---

### Task 4: Sperre gehaltener Tasten nach dem Loslassen von Shift (Nachtrag §13.3)

**Files:**
- Modify: `src/ui/steuerung/tastatur.ts` (`tastaturAnhaengen`)
- Modify: `src/ui/steuerung/tastatur.test.ts` (Test `'merkt Shift vom letzten Tastenereignis'`, neuer Test danach)
- Modify: `src/ui/steuerung/anwenden.test.ts` (nur Testname, Zeile 259)

**Interfaces:**
- Produces: `Tastenstand.gehalten` enthält nach dem Loslassen von Shift keine der dabei gehaltenen Tasten, bis sie neu gedrückt werden. Schnittstelle unverändert.

- [ ] **Step 1: Failing tests schreiben**

In `src/ui/steuerung/tastatur.test.ts` den Test `'merkt Shift vom letzten Tastenereignis'` ersetzen durch:

```ts
  it('merkt Shift vom letzten Tastenereignis und sperrt beim Loslassen gehaltene Tasten (Nachtrag §13.3)', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'ShiftLeft', { key: 'Shift', shiftKey: true });
    taste('keydown', 'KeyA', { shiftKey: true });
    expect(tastatur.stand().shift).toBe(true);
    expect(tastatur.stand().gehalten.has('KeyA')).toBe(true);
    taste('keyup', 'ShiftLeft', { key: 'Shift', shiftKey: false });
    expect(tastatur.stand().shift).toBe(false);
    expect(tastatur.stand().gehalten.has('KeyA')).toBe(false);
  });

  it('gibt eine gesperrte Taste erst nach neuem Druck frei; Wiederholungen lösen die Sperre nicht', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'ShiftLeft', { key: 'Shift', shiftKey: true });
    taste('keydown', 'KeyA', { shiftKey: true });
    taste('keydown', 'KeyW', { shiftKey: true });
    taste('keyup', 'ShiftLeft', { key: 'Shift', shiftKey: false });
    taste('keydown', 'KeyA', { repeat: true });
    expect(tastatur.stand().gehalten.size).toBe(0);
    taste('keyup', 'KeyA');
    taste('keydown', 'KeyA');
    expect([...tastatur.stand().gehalten]).toEqual(['KeyA']);
    taste('keyup', 'KeyW');
    taste('keydown', 'KeyW');
    expect([...tastatur.stand().gehalten].sort()).toEqual(['KeyA', 'KeyW']);
  });
```

In `src/ui/steuerung/anwenden.test.ts` nur den Namen des Tests `'kehrt beim Loslassen von Shift mit gehaltener Taste in den Flug zurück'` ändern in `'fliegt nach dem Drehen beim nächsten Druck ohne Shift wieder'` (Rumpf bleibt: Die Tastatur liefert diesen Stand jetzt erst nach einem neuen Druck).

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/steuerung/tastatur.test.ts`
Expected: FAIL (`KeyA` bleibt nach dem Loslassen von Shift gehalten).

- [ ] **Step 3: Umsetzen**

In `src/ui/steuerung/tastatur.ts` in `tastaturAnhaengen` den Anfang bis einschließlich `const vergessen = …;` ersetzen durch:

```ts
export function tastaturAnhaengen(fenster: Window = window): Tastatur {
  const gehalten = new Set<Flugtaste>();
  // Beim Loslassen von Shift noch gehaltene Tasten (Nachtrag §13.3): Sie zählen
  // erst nach einem neuen Druck. Wer den Griff Shift+A zuerst an Shift löst,
  // flöge sonst seitwärts davon, statt geheftet zu bleiben.
  const gesperrt = new Set<Flugtaste>();
  let shift = false;

  const shiftSetzen = (neu: boolean): void => {
    if (shift && !neu) {
      for (const t of gehalten) gesperrt.add(t);
      gehalten.clear();
    }
    shift = neu;
  };
  const onKeyDown = (e: KeyboardEvent): void => {
    shiftSetzen(e.shiftKey);
    if (!istFlugtaste(e.code)) return;
    if (e.ctrlKey || e.altKey || e.metaKey || istEingabefeld(e.target)) return;
    e.preventDefault();
    if (e.repeat) return;
    gesperrt.delete(e.code);
    gehalten.add(e.code);
  };
  const onKeyUp = (e: KeyboardEvent): void => {
    shiftSetzen(e.shiftKey);
    if (istFlugtaste(e.code)) {
      gehalten.delete(e.code);
      gesperrt.delete(e.code);
    }
  };
  const vergessen = (): void => {
    gehalten.clear();
    gesperrt.clear();
    shift = false;
  };
```

Den JSDoc über `tastaturAnhaengen` um den Satz ergänzen: „Lässt man Shift los, bleiben die dabei gehaltenen Tasten gesperrt, bis sie neu gedrückt werden (Nachtrag §13.3)."

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/ui/steuerung/tastatur.test.ts src/ui/steuerung/anwenden.test.ts`
Expected: PASS.

- [ ] **Step 5: Prüfläufe und Commit**

Run: `npm test` (Soll 3780), `npx tsc -b`, `npm run lint`.

```bash
git add src/ui/steuerung/tastatur.ts src/ui/steuerung/tastatur.test.ts src/ui/steuerung/anwenden.test.ts
git commit -m "Steuerung: Loslassen von Shift sperrt gehaltene Flugtasten bis zum neuen Druck"
```

---

### Task 5: Dämpfung von Wiederherstellungen in den Flug (Nachtrag §13.4)

**Files:**
- Modify: `src/render/camera/controller.ts` (Konstanten nach `FLUG_DAEMPFUNG_S`, neue Hilfsfunktion, Zustand und `fliege` in `createCameraController`)
- Modify: `src/render/camera/controller.test.ts` (zwei Tests am Ende des Blocks `Flug`)

**Interfaces:**
- Produces: `FLUG_UEBERGANG_S = 0.45`, `UEBERGANG_REST = 1e-3` (exportiert). Verhalten: Eintritt mit Solllage ≠ gezeigter Lage dämpft mit 0,45 s bis zum Ankommen, sonst 0,15 s.

- [ ] **Step 1: Failing tests schreiben**

Am Ende des Blocks `describe('Flug', …)` in `src/render/camera/controller.test.ts` einfügen:

```ts
  /** Geheftet an der Erde eingeschwungen, dann Flug mit einer weit entfernten gemerkten Lage. */
  function wiederherstellung() {
    const c = createCameraController(neueKamera());
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
    };
    for (let i = 0; i < 600; i++) c.update(geheftet, jd, 1 / 60, s);
    const gezeigt = letztePose()!;
    const erde = scaledPositionAt('earth', bodyIndex, jd, s);
    const blick = blickAus(gezeigt.blick);
    // Gemerkte Fluglage weit neben der gezeigten, wie nach dem Beenden eines Kinos.
    const gemerkt = { x: 4e7, y: -3e7, z: 1e7 };
    return { c, gezeigt, erde, blick, gemerkt };
  }

  it('gleitet bei einer Wiederherstellung in den Flug mit 0,45 s statt 0,15 s (Nachtrag §13.4)', () => {
    const { c, gezeigt, erde, blick, gemerkt } = wiederherstellung();
    const anfang = laenge(minus(minus(gezeigt.positionKm, erde), gemerkt));
    let p = gezeigt.positionKm;
    for (let i = 0; i < 27; i++) p = c.update(mitFlug('earth', gemerkt, blick), jd, 1 / 60, s);
    const rest = laenge(minus(minus(p, erde), gemerkt)) / anfang;
    // Kritisch gedämpft bleibt nach einer Zeitkonstante (1 + 2)·e⁻² ≈ 0,41; mit 0,15 s wären es 7·e⁻⁶ ≈ 0,02.
    expect(rest).toBeGreaterThan(0.3);
    expect(rest).toBeLessThan(0.5);
  });

  it('dämpft nach dem Ankommen einer Wiederherstellung wieder mit 0,15 s', () => {
    const { c, erde, blick, gemerkt } = wiederherstellung();
    for (let i = 0; i < 600; i++) c.update(mitFlug('earth', gemerkt, blick), jd, 1 / 60, s);
    const weiter = { x: gemerkt.x + 1e5, y: gemerkt.y, z: gemerkt.z };
    let p = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 27; i++) p = c.update(mitFlug('earth', weiter, blick), jd, 1 / 60, s);
    expect(laenge(minus(minus(p, erde), weiter)) / 1e5).toBeLessThan(0.05);
  });
```

Der zweite Test ist schon vor der Umsetzung grün (heute gilt immer 0,15 s); er sichert, dass der Übergang nach dem Ankommen endet.

- [ ] **Step 2: Tests laufen lassen, der erste scheitert**

Run: `npx vitest run src/render/camera/controller.test.ts`
Expected: FAIL im Test „gleitet bei einer Wiederherstellung …" (Rest rund 0,02).

- [ ] **Step 3: Umsetzen**

In `src/render/camera/controller.ts` nach `export const FLUG_DAEMPFUNG_S = 0.15;` einfügen:

```ts
/**
 * Dämpfung einer Wiederherstellung in den Flug (Nachtrag Flug §13.4): Beginnt
 * der Flug nicht an der gezeigten Lage (Kino beenden mit gemerktem Flug,
 * Ansicht im Flugmodus laden), gleitet die Kamera so ruhig hinüber wie bei
 * einem Moduswechsel der Umlaufmodi, statt in einem Drittel der Zeit.
 */
export const FLUG_UEBERGANG_S = 0.45;
/** Ab diesem Rest gilt ein Übergang als angekommen: Anteil der Lage, Länge der Blickdifferenz. */
export const UEBERGANG_REST = 1e-3;

/** Ist die gedämpfte Fluglage noch nicht bei der Solllage aus dem Store angekommen? */
function nochUnterwegs(lage: Vec3, blick: Vec3, fly: AppState['camera']['fly']): boolean {
  const soll = { x: fly.x, y: fly.y, z: fly.z };
  return laenge(minus(soll, lage)) > UEBERGANG_REST * Math.max(laenge(soll), 1)
    || laenge(minus(blickVektor(fly), blick)) > UEBERGANG_REST;
}
```

In `createCameraController` nach `let pose: GezeigtePose | null = null;` einfügen:

```ts
  // Wiederherstellung in den Flug läuft noch (Nachtrag §13.4).
  let uebergang = false;
```

In `fliege` nach der Zeile `imFlug = true;` einfügen:

```ts
      // Beginnt der Flug nicht an der gezeigten Lage, gleitet die Kamera wie
      // bei den Umlaufmodi hinüber (Nachtrag §13.4). Im allerersten Bild ist
      // die Lage die aus dem Store, dort gibt es keinen Übergang.
      uebergang = nochUnterwegs(flugLage, flugBlick, fly);
```

und die beiden Zeilen

```ts
    flugLage = smoothDampVec3(flugLage, { x: fly.x, y: fly.y, z: fly.z }, vLage, FLUG_DAEMPFUNG_S, dt);
    flugBlick = normiert(smoothDampVec3(flugBlick, blickVektor(fly), vBlick, FLUG_DAEMPFUNG_S, dt));
```

ersetzen durch:

```ts
    const zeitkonstante = uebergang ? FLUG_UEBERGANG_S : FLUG_DAEMPFUNG_S;
    flugLage = smoothDampVec3(flugLage, { x: fly.x, y: fly.y, z: fly.z }, vLage, zeitkonstante, dt);
    flugBlick = normiert(smoothDampVec3(flugBlick, blickVektor(fly), vBlick, zeitkonstante, dt));
    if (uebergang && !nochUnterwegs(flugLage, flugBlick, fly)) uebergang = false;
```

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/render/camera/controller.test.ts`
Expected: PASS (auch „tritt ohne Sprung in den Flug ein": Solllage und gezeigte Lage sind gleich, kein Übergang).

- [ ] **Step 5: Prüfläufe und Commit**

Run: `npm test` (Soll 3782), `npx tsc -b`, `npm run lint`.

```bash
git add src/render/camera/controller.ts src/render/camera/controller.test.ts
git commit -m "Flug: Wiederherstellungen gleiten mit 0,45 s hinüber"
```

---

### Task 6: Controller auswerten und lesen (`gamepad.ts`)

**Files:**
- Create: `src/ui/steuerung/gamepad.ts`
- Create: `src/ui/steuerung/padAttrappe.ts` (nachgebauter Controller, nur von Tests genutzt)
- Create: `src/ui/steuerung/gamepad.test.ts`

**Interfaces:**
- Produces:
  - `PAD` (Tastenindizes: `A 0, B 1, X 2, Y 3, LB 4, RB 5, LT 6, RT 7, VIEW 8, MENUE 9, L3 10, R3 11, HOCH 12, RUNTER 13, LINKS 14, RECHTS 15`), `STICK_TOTZONE = 0.15`, `TRIGGER_TOTZONE = 0.05`
  - `interface PadRoh { mapping: string; axes: readonly number[]; buttons: readonly { pressed: boolean; value: number }[] }`
  - `interface Stick { x: number; y: number }` (y wie in der API nach unten positiv)
  - `interface PadAbsicht { links: Stick; rechts: Stick; vor: number; lb: boolean }` (`vor` = RT − LT)
  - `interface PadBild { absicht: PadAbsicht; flanken: readonly number[]; eingabe: boolean }`
  - `stickKurve(x: number | undefined, y: number | undefined): Stick`, `triggerWert(v: number | undefined): number`
  - `padAuswerten(roh: PadRoh, vorher: readonly boolean[] | null): { bild: PadBild; gedrueckt: boolean[] }`
  - `interface PadUmgebung { isSecureContext?: boolean; navigator?: { getGamepads?: () => readonly (PadRoh | null)[] } }`, `padLeserErstellen(u: PadUmgebung): () => PadRoh | null`
  - `padAttrappe(teil?: { axes?: number[]; gedrueckt?: readonly number[]; werte?: Readonly<Record<number, number>>; mapping?: string }): PadRoh`

- [ ] **Step 1: Attrappe und failing tests schreiben**

`src/ui/steuerung/padAttrappe.ts`:

```ts
import type { PadRoh } from './gamepad';

/**
 * Nachgebauter Controller für Tests (Entwurf Flug und Controller §8): 17 Tasten
 * der Standardbelegung, gedrückte mit dem Wert 1. Trigger bekommen über
 * `werte` einen eigenen Wert; über 0,5 gilt eine Taste als gedrückt.
 */
export function padAttrappe(teil: {
  axes?: number[];
  gedrueckt?: readonly number[];
  werte?: Readonly<Record<number, number>>;
  mapping?: string;
} = {}): PadRoh {
  const buttons = Array.from({ length: 17 }, (_, i) => {
    const an = teil.gedrueckt?.includes(i) ?? false;
    const value = teil.werte?.[i] ?? (an ? 1 : 0);
    return { pressed: an || value > 0.5, value };
  });
  return { mapping: teil.mapping ?? 'standard', axes: teil.axes ?? [0, 0, 0, 0], buttons };
}
```

`src/ui/steuerung/gamepad.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { padAuswerten, padLeserErstellen, stickKurve, triggerWert, PAD, STICK_TOTZONE } from './gamepad';
import { padAttrappe } from './padAttrappe';

describe('stickKurve', () => {
  it('hält die kreisförmige Totzone bei null und erreicht bei vollem Ausschlag 1', () => {
    // Betrag 0,141 liegt unter 0,15, obwohl beide Achsen darüber liegen könnten.
    expect(stickKurve(0.1, 0.1)).toEqual({ x: 0, y: 0 });
    const voll = stickKurve(0, -1);
    expect(voll.x).toBe(0);
    expect(voll.y).toBeCloseTo(-1, 12);
  });

  it('skaliert hinter der Totzone neu und quadriert: der halbe Weg ergibt ein Viertel, die Richtung bleibt', () => {
    const b = STICK_TOTZONE + 0.5 * (1 - STICK_TOTZONE);
    const k = stickKurve(b * 0.6, b * 0.8);
    expect(Math.hypot(k.x, k.y)).toBeCloseTo(0.25, 12);
    expect(k.x / k.y).toBeCloseTo(0.75, 12);
  });

  it('zählt NaN und fehlende Achsen als 0 und klemmt Werte außerhalb von ±1', () => {
    expect(stickKurve(NaN, undefined)).toEqual({ x: 0, y: 0 });
    const k = stickKurve(3, NaN);
    expect(k.x).toBeCloseTo(1, 12);
    expect(k.y).toBe(0);
  });
});

describe('triggerWert', () => {
  it('hat eine Totzone von 0,05 und läuft danach linear bis 1', () => {
    expect(triggerWert(0.05)).toBe(0);
    expect(triggerWert(0.525)).toBeCloseTo(0.5, 12);
    expect(triggerWert(1)).toBe(1);
    expect(triggerWert(NaN)).toBe(0);
    expect(triggerWert(-0.3)).toBe(0);
  });
});

describe('padAuswerten', () => {
  it('bleibt beim ersten Auftauchen ohne Wirkung und nimmt den Tastenstand als Vorzustand', () => {
    const { bild, gedrueckt } = padAuswerten(padAttrappe({ gedrueckt: [PAD.A], axes: [1, 0, 0, 0] }), null);
    expect(bild.flanken).toEqual([]);
    expect(bild.eingabe).toBe(false);
    expect(bild.absicht.links).toEqual({ x: 0, y: 0 });
    expect(gedrueckt[PAD.A]).toBe(true);
    // Die gehaltene Freigabetaste löst auch im nächsten Bild nichts aus.
    expect(padAuswerten(padAttrappe({ gedrueckt: [PAD.A] }), gedrueckt).bild.flanken).toEqual([]);
  });

  it('meldet Tasten beim Drücken, nicht beim Halten', () => {
    const leer = padAuswerten(padAttrappe(), null).gedrueckt;
    const erst = padAuswerten(padAttrappe({ gedrueckt: [PAD.B, PAD.MENUE] }), leer);
    expect(erst.bild.flanken).toEqual([PAD.B, PAD.MENUE]);
    expect(erst.bild.eingabe).toBe(true);
    expect(padAuswerten(padAttrappe({ gedrueckt: [PAD.B, PAD.MENUE] }), erst.gedrueckt).bild.flanken).toEqual([]);
  });

  it('bildet die Absicht aus Sticks, Triggern und LB', () => {
    const leer = padAuswerten(padAttrappe(), null).gedrueckt;
    const { bild } = padAuswerten(
      padAttrappe({ axes: [0.8, 0, 0, -1], werte: { [PAD.RT]: 1, [PAD.LT]: 0.3 }, gedrueckt: [PAD.LB] }), leer,
    );
    expect(bild.absicht.links.x).toBeCloseTo(((0.8 - 0.15) / 0.85) ** 2, 12);
    expect(bild.absicht.links.y).toBe(0);
    expect(bild.absicht.rechts.y).toBeCloseTo(-1, 12);
    expect(bild.absicht.vor).toBeCloseTo(1 - (0.3 - 0.05) / 0.95, 12);
    expect(bild.absicht.lb).toBe(true);
    expect(bild.eingabe).toBe(true);
  });

  it('meldet keine Eingabe, solange alles in den Totzonen bleibt und keine Taste neu gedrückt wird', () => {
    const vorher = padAuswerten(padAttrappe({ gedrueckt: [PAD.LB] }), null).gedrueckt;
    const { bild } = padAuswerten(
      padAttrappe({ axes: [0.1, 0, 0, 0.1], werte: { [PAD.RT]: 0.04 }, gedrueckt: [PAD.LB] }), vorher,
    );
    expect(bild.eingabe).toBe(false);
  });
});

describe('padLeserErstellen', () => {
  it('liefert den ersten Controller mit Standardbelegung und übergeht fremde und leere Einträge', () => {
    const fremd = padAttrappe({ mapping: '' });
    const echt = padAttrappe();
    const lesen = padLeserErstellen({ isSecureContext: true, navigator: { getGamepads: () => [null, fremd, echt] } });
    expect(lesen()).toBe(echt);
  });

  it('bleibt ohne sicheren Kontext still und fragt den Browser gar nicht', () => {
    let aufrufe = 0;
    const lesen = padLeserErstellen({
      isSecureContext: false,
      navigator: { getGamepads: () => { aufrufe += 1; return [padAttrappe()]; } },
    });
    expect(lesen()).toBeNull();
    expect(aufrufe).toBe(0);
  });

  it('bleibt ohne Gamepad-API still', () => {
    expect(padLeserErstellen({ isSecureContext: true, navigator: {} })()).toBeNull();
    expect(padLeserErstellen({ isSecureContext: true })()).toBeNull();
  });

  it('schaltet sich einmalig ab, wenn getGamepads wirft', () => {
    let aufrufe = 0;
    const lesen = padLeserErstellen({
      isSecureContext: true,
      navigator: { getGamepads: () => { aufrufe += 1; throw new Error('Berechtigungsregel'); } },
    });
    expect(lesen()).toBeNull();
    expect(lesen()).toBeNull();
    expect(aufrufe).toBe(1);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/steuerung/gamepad.test.ts`
Expected: FAIL (Modul `./gamepad` fehlt).

- [ ] **Step 3: Umsetzen**

`src/ui/steuerung/gamepad.ts`:

```ts
/**
 * Controller nach der Standardbelegung (Entwurf Flug und Controller §5): reine
 * Auswertung eines Controllerbildes gegen den Vorzustand, dazu ein dünner
 * Leser um navigator.getGamepads(). Die Gamepad-API kennt für Achsen und
 * Tasten keine Ereignisse, nur die Abfrage je Bild (§1, Punkt 4).
 */

/** Tastenindizes der Standardbelegung (W3C Gamepad, mapping „standard"). */
export const PAD = {
  A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, VIEW: 8, MENUE: 9, L3: 10, R3: 11,
  HOCH: 12, RUNTER: 13, LINKS: 14, RECHTS: 15,
} as const;

/** Kreisförmige Totzone der Sticks und Totzone der Trigger (§5.2, §12.1). */
export const STICK_TOTZONE = 0.15;
export const TRIGGER_TOTZONE = 0.05;

/** Was die Auswertung von einem Controller liest; echte Gamepad-Objekte passen darauf. */
export interface PadRoh {
  mapping: string;
  axes: readonly number[];
  buttons: readonly { pressed: boolean; value: number }[];
}

/** Stickausschlag nach Totzone und Kurve; y zählt wie in der API nach unten. */
export interface Stick { x: number; y: number }

export interface PadAbsicht {
  links: Stick;
  rechts: Stick;
  /** RT − LT, jeweils nach der Totzone, in −1 … 1. */
  vor: number;
  lb: boolean;
}

export interface PadBild {
  absicht: PadAbsicht;
  /** Tasten, die in diesem Bild gedrückt wurden (Flanke). */
  flanken: readonly number[];
  /** Stick oder Trigger über der Totzone oder eine Flanke (§5.5). */
  eingabe: boolean;
}

const RUHE: PadAbsicht = { links: { x: 0, y: 0 }, rechts: { x: 0, y: 0 }, vor: 0, lb: false };

/** NaN und fehlende Werte zählen als 0, alles andere wird in min … 1 geklemmt (§7). */
const achse = (v: number | undefined, min: number): number =>
  (v === undefined || Number.isNaN(v) ? 0 : Math.min(Math.max(v, min), 1));

/** Kreisförmige Totzone, danach auf 0 … 1 neu skaliert und quadriert: feine kleine Ausschläge. */
export function stickKurve(xRoh: number | undefined, yRoh: number | undefined): Stick {
  const x = achse(xRoh, -1);
  const y = achse(yRoh, -1);
  const betrag = Math.hypot(x, y);
  if (betrag <= STICK_TOTZONE) return { x: 0, y: 0 };
  const neu = Math.min((betrag - STICK_TOTZONE) / (1 - STICK_TOTZONE), 1);
  const k = (neu * neu) / betrag;
  return { x: x * k, y: y * k };
}

/** Trigger: Totzone, danach linear auf 0 … 1. */
export function triggerWert(roh: number | undefined): number {
  const v = achse(roh, 0);
  return v <= TRIGGER_TOTZONE ? 0 : (v - TRIGGER_TOTZONE) / (1 - TRIGGER_TOTZONE);
}

/**
 * Wertet ein Controllerbild aus. `vorher` sind die gedrückten Tasten des
 * letzten Bildes, null beim ersten Auftauchen: Dann gilt der aktuelle Stand
 * als Vorzustand und das Bild bleibt ohne Wirkung — der Druck, mit dem der
 * Browser den Controller freigibt, löst nichts aus (§5.1).
 */
export function padAuswerten(
  roh: PadRoh, vorher: readonly boolean[] | null,
): { bild: PadBild; gedrueckt: boolean[] } {
  const gedrueckt = roh.buttons.map((b) => b.pressed);
  if (vorher === null) return { bild: { absicht: RUHE, flanken: [], eingabe: false }, gedrueckt };
  const flanken: number[] = [];
  gedrueckt.forEach((an, i) => { if (an && vorher[i] !== true) flanken.push(i); });
  const links = stickKurve(roh.axes[0], roh.axes[1]);
  const rechts = stickKurve(roh.axes[2], roh.axes[3]);
  const rt = triggerWert(roh.buttons[PAD.RT]?.value);
  const lt = triggerWert(roh.buttons[PAD.LT]?.value);
  const bewegt = links.x !== 0 || links.y !== 0 || rechts.x !== 0 || rechts.y !== 0 || rt !== 0 || lt !== 0;
  return {
    bild: {
      absicht: { links, rechts, vor: rt - lt, lb: gedrueckt[PAD.LB] === true },
      flanken,
      eingabe: bewegt || flanken.length > 0,
    },
    gedrueckt,
  };
}

/** Was der Leser aus der Umgebung braucht; im Browser window.isSecureContext und navigator. */
export interface PadUmgebung {
  isSecureContext?: boolean;
  navigator?: { getGamepads?: () => readonly (PadRoh | null)[] };
}

/**
 * Leser des ersten Controllers mit Standardbelegung (§5.1); andere werden
 * übergangen. Ohne sicheren Kontext, ohne getGamepads oder wenn der Aufruf
 * wirft (etwa wegen einer Berechtigungsregel der einbettenden Seite), schaltet
 * er sich einmalig und still ab und liefert fortan null; Tastatur und Maus
 * bleiben. Aufgerufen wird getGamepads als Methode von navigator — Chrome
 * verlangt das.
 */
export function padLeserErstellen(u: PadUmgebung): () => PadRoh | null {
  const nav = u.navigator;
  let aus = u.isSecureContext !== true || typeof nav?.getGamepads !== 'function';
  return () => {
    if (aus || nav?.getGamepads === undefined) return null;
    try {
      for (const p of nav.getGamepads()) if (p !== null && p.mapping === 'standard') return p;
      return null;
    } catch {
      aus = true;
      return null;
    }
  };
}
```

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/ui/steuerung/gamepad.test.ts`
Expected: PASS (12 Tests).

- [ ] **Step 5: Prüfläufe und Commit**

Run: `npm test` (Soll 3794), `npx tsc -b`, `npm run lint`.

```bash
git add src/ui/steuerung/gamepad.ts src/ui/steuerung/padAttrappe.ts src/ui/steuerung/gamepad.test.ts
git commit -m "Controller: Standardbelegung, Totzonen, Flanken und Leser"
```

---

### Task 7: Controller fliegt und dreht (`steuerungTakt`, `eingabeMelden`)

**Files:**
- Modify: `src/ui/idle.ts` (neue Funktion `eingabeMelden`, Anbindung in `useIdleHide`)
- Modify: `src/ui/idle.test.ts` (ein Test im Block `zeigerAusgeblendet`)
- Modify: `src/ui/steuerung/anwenden.ts` (Importe, `SteuerungUmgebung`, Drehraten, `drehen`, neuer Controller-Teil, `steuerungTakt`)
- Modify: `src/ui/steuerung/anwenden.test.ts` (Importe, `vorKoerper` auf Dateiebene, `beforeEach`, neuer Block `steuerungTakt: Controller`)

**Interfaces:**
- Consumes: `padAuswerten`, `PAD`, `PadRoh`, `PadBild`, `PadAbsicht`, `Stick` (Task 6); `padAttrappe` (Task 6, nur Tests).
- Produces: `eingabeMelden(): void` in `ui/idle.ts`; in `anwenden.ts`: `SteuerungUmgebung.pad?(): PadRoh | null`, `STICK_BLICK_JE_S = Math.PI / 2`, `STICK_DREH_JE_S = Math.PI / 2`, `padZuruecksetzen(): void`, interne Funktionen `padTakt(u): PadBild | null`, `bewegen(jd, dt, u, bild)`, `fliegen(jd, dt, absicht, blick, u)`, `drehenUndNachfuehren(jd, dt, absicht, raten, u)`, `drehen(dt, absicht, raten, u)`.

- [ ] **Step 1: Failing tests schreiben**

`src/ui/idle.test.ts`: `eingabeMelden` in den Import aus `./idle` aufnehmen und im Block `describe('zeigerAusgeblendet', …)` anhängen:

```ts
  it('lässt sich ohne Fensterereignis wecken (Controller, eingabeMelden)', () => {
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(zeigerAusgeblendet()).toBe(true);
    act(() => { eingabeMelden(); });
    expect(zeigerAusgeblendet()).toBe(false);
    hook.unmount();
    // Ohne eingehängten Wächter bleibt der Aufruf folgenlos.
    expect(() => { eingabeMelden(); }).not.toThrow();
  });
```

`src/ui/steuerung/anwenden.test.ts`:

1. Importe: die erste Zeile `import { describe, it, expect, beforeEach } from 'vitest';` ersetzen durch `import { describe, it, expect, beforeEach, vi } from 'vitest';`; ergänzen:

```ts
import { act, renderHook } from '@testing-library/react';
import { padZuruecksetzen } from './anwenden';
import { PAD } from './gamepad';
import type { PadRoh } from './gamepad';
import { padAttrappe } from './padAttrappe';
import { IDLE_HIDE_SEC, useIdleHide, zeigerAusgeblendet } from '../idle';
```

(`padZuruecksetzen` darf auch in den vorhandenen Import aus `./anwenden` wandern.)

2. Die Hilfsfunktion `vorKoerper` samt JSDoc aus dem Block `describe('steuerungTakt: Drehen mit Shift', …)` unverändert auf Dateiebene verschieben, direkt unter `vorErde`.

3. Im vorhandenen `beforeEach` nach `tempoZuruecksetzen();` ergänzen: `padZuruecksetzen();`.

4. Am Dateiende anhängen:

```ts
describe('steuerungTakt: Controller', () => {
  const ruhe = padAttrappe();
  const mitPad = (p: PadRoh | null, pose: GezeigtePose | null): SteuerungUmgebung =>
    ({ ...umgebung([], pose), pad: () => p });
  /** Erstes Bild mit neutralem Controller: Das Auftauchen bleibt ohne Wirkung (§5.1). */
  const anmelden = (pose: GezeigtePose | null = null): void => { steuerungTakt(jd, 0, mitPad(ruhe, pose)); };

  it('bleibt beim ersten Auftauchen ohne Wirkung, auch mit ausgelenktem Stick', () => {
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), vorErde()));
    expect(useStore.getState().camera.mode).toBe('free');
  });

  it('startet mit dem linken Stick den Flug an der gezeigten Lage und lenkt den Blick mit 90°/s wie in Spielen', () => {
    const pose = vorErde();
    anmelden(pose);
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    let { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    // Rechts = nach rechts schauen: yaw sinkt.
    expect(camera.fly.yaw).toBeCloseTo(Math.PI - Math.PI / 4, 12);
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
    // Oben (y der API negativ) = nach oben schauen.
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ axes: [0, -1, 0, 0] }), pose));
    ({ camera } = useStore.getState());
    expect(camera.fly.pitch).toBeCloseTo(Math.PI / 4, 12);
  });

  it('fliegt mit RT so schnell wie mit W und mit LT zurück', () => {
    const pose = vorErde();
    steuerungTakt(jd, 0.1, umgebung(['KeyW'], pose));
    const mitW = weltlage();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    anmelden(pose);
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ werte: { [PAD.RT]: 1 } }), pose));
    expect(laenge(minus(weltlage(), mitW))).toBeLessThan(1e-3);
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ werte: { [PAD.LT]: 1 } }), pose));
    expect(laenge(minus(weltlage(), lage('earth')))).toBeGreaterThan(laenge(minus(mitW, lage('earth'))));
  });

  it('dreht mit LB und Stick um den Körper nächst der Bildmitte mit 90°/s; LB allein tut nichts', () => {
    useStore.getState().toggleVisible('phobos');
    useStore.getState().toggleVisible('deimos');
    const pose = vorKoerper('mars');
    anmelden(pose);
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ gedrueckt: [PAD.LB] }), pose));
    expect(useStore.getState().camera.mode).toBe('free');
    steuerungTakt(jd, 0, mitPad(padAttrappe({ gedrueckt: [PAD.LB], axes: [1, 0, 0, 0] }), pose));
    const vorher = useStore.getState().camera;
    expect(vorher.mode).toBe('attached');
    expect(vorher.targetId).toBe('mars');
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ gedrueckt: [PAD.LB], axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.azimuth).toBeCloseTo(vorher.azimuth + Math.PI / 4, 12);
  });

  it('fährt mit LB und RT heran, Faktor 2 je Sekunde', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e6 });
    const pose = vorKoerper('earth');
    anmelden(pose);
    steuerungTakt(jd, 1, mitPad(padAttrappe({ gedrueckt: [PAD.LB], werte: { [PAD.RT]: 1 } }), pose));
    expect(useStore.getState().camera.distance).toBeCloseTo(5e5, 6);
  });

  it('sperrt Stick und Trigger nach dem Loslassen von LB, bis sie in der Totzone waren (Nachtrag §13.3)', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e6 });
    const pose = vorKoerper('earth');
    anmelden(pose);
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ gedrueckt: [PAD.LB], axes: [1, 0, 0, 0] }), pose));
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('attached');
    steuerungTakt(jd, 0.1, mitPad(ruhe, pose));
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('fly');
  });

  it('meldet jede Controller-Eingabe beim Ruhewächter, auch eine Taste ohne Belegung', () => {
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(zeigerAusgeblendet()).toBe(true);
    anmelden();
    act(() => { steuerungTakt(jd, 0, mitPad(padAttrappe({ gedrueckt: [PAD.X] }), null)); });
    expect(zeigerAusgeblendet()).toBe(false);
    hook.unmount();
    vi.useRealTimers();
  });

  it('hält mit dem rechten Stick ein laufendes Kino an', () => {
    useStore.getState().setCinema({ pauseOnInput: true });
    anmelden();
    startCinema();
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [0, 0, 0.5, 0] }), null));
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('cinema');
  });

  it('bricht mit einem Stick eine laufende Kamerafahrt ab', () => {
    anmelden();
    fahreZu('mars', { jetzt: () => 0, anfordern: () => 1, abbrechen: () => { /* von Hand */ } });
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [0, 0, 0.5, 0] }), null));
    expect(fahrtLaeuft()).toBe(false);
  });

  it('beendet mit dem linken Stick ein Kino samt Wiederherstellung und fliegt ab dem gezeigten Bild', () => {
    useStore.getState().setTime({ rateDaysPerSec: 3 });
    const pose = vorErde();
    anmelden(pose);
    startCinema();
    useStore.getState().setTime({ rateDaysPerSec: 50 });
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [0.5, 0, 0, 0] }), pose));
    const z = useStore.getState();
    expect(z.cinema.running).toBe(false);
    expect(z.camera.mode).toBe('fly');
    expect(z.time.rateDaysPerSec).toBe(3);
  });

  it('lässt im selben Bild die Tastatur vor dem Controller wirken', () => {
    const pose = vorErde();
    anmelden(pose);
    steuerungTakt(jd, 0.5, { ...umgebung(['KeyW'], pose), pad: () => padAttrappe({ axes: [1, 0, 0, 0] }) });
    expect(useStore.getState().camera.mode).toBe('fly');
    expect(useStore.getState().camera.fly.yaw).toBeCloseTo(Math.PI, 12);
  });

  it('vergisst beim Trennen den Vorzustand: Nach dem Wiederauftauchen wirkt erst das zweite Bild', () => {
    const pose = vorErde();
    anmelden(pose);
    steuerungTakt(jd, 0, mitPad(null, pose));
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('free');
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('fly');
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/idle.test.ts src/ui/steuerung/anwenden.test.ts`
Expected: FAIL (`eingabeMelden` und `padZuruecksetzen` fehlen; der Controller bewegt nichts).

- [ ] **Step 3: `eingabeMelden` in `src/ui/idle.ts`**

Nach `export const zeigerAusgeblendet = (): boolean => zeigerAus;` einfügen:

```ts
/** Weckt den eingehängten Wächter; null, solange useIdleHide nicht läuft. */
let melden: ((jetztMs: number) => void) | null = null;

/**
 * Meldet eine Eingabe ohne Fensterereignis an den Ruhewächter (Entwurf Flug und
 * Controller §5.5): Controller-Eingaben halten Oberfläche, Mauszeiger und
 * Fadenkreuz sichtbar. Ohne eingehängten Wächter geschieht nichts.
 */
export function eingabeMelden(): void {
  melden?.(Date.now());
}
```

In `useIdleHide`, im ersten Effekt nach dem Anlegen von `waechter`:

```ts
    melden = (jetztMs) => { waechter.handleInput(jetztMs); };
```

und in dessen Aufräumfunktion vor `waechter.dispose();`:

```ts
      melden = null;
```

- [ ] **Step 4: Controller in `src/ui/steuerung/anwenden.ts`**

Importe ergänzen bzw. ändern:

```ts
import {
  begrenze, blickAus, blickDrehen, flugSchritt, fluggeschwindigkeit, koerperNaechstDerMitte, koerperStaende, kugelUm,
  laenge, mindesthoehe, minus, plus, waehleBezug, ELEVATION_GRENZE, MAX_DISTANCE_KM, MIN_DISTANCE_KM,
} from '../../render/camera/flug';
import { cinemaAktiv, noteUserInput, stopCinema } from '../cinemaControl';
import { eingabeMelden } from '../idle';
import { padAuswerten, PAD } from './gamepad';
import type { PadAbsicht, PadBild, PadRoh, Stick } from './gamepad';
```

(`blickDrehen` kommt in die vorhandene Importliste aus `flug`, `noteUserInput` in die aus `cinemaControl`; die übrigen Importe bleiben.)

`SteuerungUmgebung` ersetzen durch:

```ts
export interface SteuerungUmgebung {
  tasten(): Tastenstand;
  /** Gezeigte Kameralage des letzten Bildes samt jd (render/camera/controller.ts). */
  letztePose(): GezeigtePose | null;
  /** Controller dieses Bildes (Leser aus gamepad.ts); ohne ihn gibt es keinen. */
  pad?(): PadRoh | null;
}
```

Den Block ab `/** Drehen mit Shift (Entwurf §4.2): A/D 60°/s, …` bis einschließlich der Konstante `ZOOM_JE_S` ersetzen durch:

```ts
/** Drehen mit Shift (Entwurf §4.2): A/D 60°/s, Q/E 45°/s, W/S Faktor 2 je Sekunde. */
export const DREH_AZIMUT_JE_S = Math.PI / 3;
export const DREH_ELEVATION_JE_S = Math.PI / 4;
export const ZOOM_JE_S = 2;
/** Controller (§5.2): Blick mit dem linken Stick im Flug und Drehen mit LB, je bei vollem Ausschlag. */
export const STICK_BLICK_JE_S = Math.PI / 2;
export const STICK_DREH_JE_S = Math.PI / 2;

/** Drehraten um den Körper in rad/s: seitlich (Azimut) sowie auf und ab (Elevation). */
interface Drehraten { azimut: number; elevation: number }
const TASTEN_RATEN: Drehraten = { azimut: DREH_AZIMUT_JE_S, elevation: DREH_ELEVATION_JE_S };
const PAD_RATEN: Drehraten = { azimut: STICK_DREH_JE_S, elevation: STICK_DREH_JE_S };
```

In `drehen` die Signatur ändern in `function drehen(dt: number, absicht: Absicht, raten: Drehraten, u: SteuerungUmgebung): void`, im JSDoc „Drehen mit Shift" durch „Drehen mit Shift oder LB" ersetzen und im abschließenden `setCamera` `DREH_AZIMUT_JE_S` durch `raten.azimut` sowie `DREH_ELEVATION_JE_S` durch `raten.elevation` ersetzen.

Die Funktion `steuerungTakt` samt JSDoc ersetzen durch:

```ts
/**
 * Drehen und danach — falls der Flug bleibt, weil kein Körper gefunden wurde —
 * Bezugswahl und Mindesthöhe, je Bild auch ohne Eingabe (M1, §3.3).
 */
function drehenUndNachfuehren(
  jd: number, dt: number, absicht: Absicht, raten: Drehraten, u: SteuerungUmgebung,
): void {
  drehen(dt, absicht, raten, u);
  if (useStore.getState().camera.mode === 'fly') flugNachfuehren(jd, dt, null);
}

/**
 * Fliegen (§4.1, §5.2): startet den Flug an der gezeigten Lage, lenkt den
 * Blick mit dem linken Stick und macht den Flugschritt.
 */
function fliegen(jd: number, dt: number, absicht: Absicht, blick: Stick | null, u: SteuerungUmgebung): void {
  if (useStore.getState().camera.mode !== 'fly') {
    const pose = u.letztePose();
    if (pose === null) return;
    flugStarten(pose);
  }
  if (blick !== null && (blick.x !== 0 || blick.y !== 0)) {
    const { camera, setCamera } = useStore.getState();
    // Wie in Spielen: rechts = nach rechts schauen (yaw sinkt), oben = nach
    // oben schauen; die y-Achse der API zählt nach unten.
    const neu = blickDrehen(camera.fly, -blick.x * STICK_BLICK_JE_S * dt, -blick.y * STICK_BLICK_JE_S * dt);
    setCamera({ fly: { ...camera.fly, ...neu } });
  }
  flugNachfuehren(jd, dt, absicht);
}

/** Gedrückte Tasten des letzten Controllerbildes; null vor dem ersten Auftauchen. */
let padVorher: boolean[] | null = null;
let lbVorher = false;
/** LB wurde losgelassen, während Stick oder Trigger lenkten (Nachtrag §13.3). */
let padGesperrt = false;

/** Vergisst den Controller: beim Trennen und für Tests. Das nächste Auftauchen gilt wieder als erstes. */
export function padZuruecksetzen(): void {
  padVorher = null;
  lbVorher = false;
  padGesperrt = false;
}

const lenkt = (a: PadAbsicht): boolean => a.links.x !== 0 || a.links.y !== 0 || a.vor !== 0;
const bewegt = (a: PadAbsicht): boolean => lenkt(a) || a.rechts.x !== 0 || a.rechts.y !== 0;

/**
 * Liest den Controller, führt Vorzustand und LB-Sperre und meldet Eingaben
 * (§5.5), weil der Controller keine Fensterereignisse auslöst: jede an den
 * Ruhewächter; jede außer Menü/Start und RB hält ein Kino an, wie C und N;
 * jede außer A und B bricht eine Kamerafahrt ab — A und B starten selbst
 * eine. Liefert null ohne Controller und beim ersten Auftauchen.
 */
function padTakt(u: SteuerungUmgebung): PadBild | null {
  const roh = u.pad?.() ?? null;
  if (roh === null) {
    padZuruecksetzen();
    return null;
  }
  const erstes = padVorher === null;
  const { bild, gedrueckt } = padAuswerten(roh, padVorher);
  padVorher = gedrueckt;
  if (erstes) return null;
  const a = bild.absicht;
  if (lbVorher && !a.lb && lenkt(a)) padGesperrt = true;
  if (!lenkt(a)) padGesperrt = false;
  lbVorher = a.lb;
  if (bild.eingabe) {
    eingabeMelden();
    if (bewegt(a) || bild.flanken.some((t) => t !== PAD.MENUE && t !== PAD.RB)) noteUserInput();
    if (bewegt(a) || bild.flanken.some((t) => t !== PAD.A && t !== PAD.B)) fahrtAbbrechen();
  }
  return bild;
}

/** Bewegung eines Bildes, die Tastatur vor dem Controller. */
function bewegen(jd: number, dt: number, u: SteuerungUmgebung, bild: PadBild | null): void {
  const stand = u.tasten();
  if (stand.gehalten.size > 0) {
    const absicht = tastenAbsicht(stand.gehalten);
    if (stand.shift) drehenUndNachfuehren(jd, dt, absicht, TASTEN_RATEN, u);
    else fliegen(jd, dt, absicht, null, u);
    return;
  }
  const a = bild?.absicht;
  if (a !== undefined && lenkt(a) && !padGesperrt) {
    // LB wirkt wie Shift (§5.2): Stick rechts = Kamera nach rechts, oben = nach
    // oben (die y-Achse der API zählt nach unten), RT heran, LT weiter weg.
    if (a.lb) drehenUndNachfuehren(jd, dt, { vor: a.vor, seit: a.links.x, hoch: -a.links.y }, PAD_RATEN, u);
    else fliegen(jd, dt, { vor: a.vor, seit: 0, hoch: 0 }, a.links, u);
    return;
  }
  if (useStore.getState().camera.mode === 'fly') flugNachfuehren(jd, dt, null);
}

/**
 * Je Bild vor dem Kino-Takt (Entwurf §6.2). Gehaltene Flugtasten ohne Shift
 * sowie linker Stick oder Trigger ohne LB starten den Flug an der gezeigten
 * Lage und fliegen; im Flug laufen Mindesthöhe und Bezugswahl auch ohne
 * Eingabe. Mit Shift oder LB dreht die Kamera um den Körper nächst der
 * Bildmitte (§4.2, §5.2).
 */
export function steuerungTakt(jd: number, dt: number, u: SteuerungUmgebung): void {
  bewegen(jd, dt, u, padTakt(u));
}
```

- [ ] **Step 5: Tests laufen lassen**

Run: `npx vitest run src/ui/idle.test.ts src/ui/steuerung/anwenden.test.ts src/ui/steuerung/gamepad.test.ts`
Expected: PASS.

- [ ] **Step 6: Prüfläufe und Commit**

Run: `npm test` (Soll 3807), `npx tsc -b`, `npm run lint`.

```bash
git add src/ui/idle.ts src/ui/idle.test.ts src/ui/steuerung/anwenden.ts src/ui/steuerung/anwenden.test.ts
git commit -m "Controller: Flug mit Stick und Triggern, Drehen mit LB, Meldungen an Ruhe, Kino und Fahrt"
```

---

### Task 8: Fadenkreuz

**Files:**
- Modify: `src/render/treffer.ts` (Zeigerart `pad`, Zeilen 9–14)
- Modify: `src/render/treffer.test.ts` (ein Test)
- Create: `src/ui/steuerung/kreuz.ts`, `src/ui/steuerung/kreuz.test.ts`
- Create: `src/ui/steuerung/Fadenkreuz.tsx`, `src/ui/steuerung/Fadenkreuz.test.tsx`
- Modify: `src/ui/steuerung/anwenden.ts` (Importe, `SteuerungUmgebung`, `padTakt` liefert zusätzlich „getrennt", neuer `kreuzTakt`, `steuerungTakt`)
- Modify: `src/ui/steuerung/anwenden.test.ts` (Import, neuer Block `steuerungTakt: Fadenkreuz`)

**Interfaces:**
- Consumes: `PadBild`, `PAD` (Task 6), `padTakt` (Task 7), `zeigerAusgeblendet`, `eingabeMelden` (`ui/idle.ts`).
- Produces:
  - `Zeigerart = 'maus' | 'finger' | 'pad'`, `FANG_PX.pad = 20`, `TIPP_SCHWELLE_PX.pad = 10`
  - `kreuz.ts`: `KREUZ_PX = 24`, `interface Leinwand { breite: number; hoehe: number }`, `kreuzLage(l): { x: number; y: number }`, `kreuzBewegen(dx, dy, l)`, `kreuzMitte(l)`, `kreuzZeigen()`, `kreuzAusblenden()`, `kreuzSichtbar(): boolean`, `kreuzElementSetzen(el: HTMLElement | null)`, `kreuzZeichnen(l)`, `kreuzZuruecksetzen()`
  - `Fadenkreuz(): React.JSX.Element`
  - `SteuerungUmgebung.leinwand?(): Leinwand`, `SteuerungUmgebung.zeiger?(z: { x: number; y: number; art: Zeigerart } | null): void`, `KREUZ_HOEHEN_JE_S = 1`, interne Struktur `PadTakt { bild: PadBild | null; getrennt: boolean }`

- [ ] **Step 1: Failing tests schreiben**

`src/render/treffer.test.ts`, im Block zu `findeTreffer` anhängen:

```ts
  it('fängt mit dem Fadenkreuz des Controllers wie mit dem Finger (20 px)', () => {
    const k: Kandidaten = { ...leer, scheiben: [scheibe('mars', 100, 100, 2)] };
    expect(findeTreffer({ x: 115, y: 100 }, k, FANG_PX.pad)).toBe('mars');
    expect(findeTreffer({ x: 115, y: 100 }, k, FANG_PX.maus)).toBeNull();
  });
```

`src/ui/steuerung/kreuz.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  kreuzAusblenden, kreuzBewegen, kreuzElementSetzen, kreuzLage, kreuzMitte, kreuzSichtbar, kreuzZeichnen,
  kreuzZeigen, kreuzZuruecksetzen, KREUZ_PX,
} from './kreuz';
import { eingabeMelden, IDLE_HIDE_SEC, useIdleHide } from '../idle';

const l = { breite: 800, hoehe: 600 };

afterEach(() => {
  kreuzZuruecksetzen();
  vi.useRealTimers();
});

describe('Fadenkreuz-Zustand', () => {
  it('startet in der Mitte und bleibt beim Bewegen in der Leinwand, auch nach dem Verkleinern', () => {
    expect(kreuzLage(l)).toEqual({ x: 400, y: 300 });
    kreuzBewegen(1000, -50, l);
    expect(kreuzLage(l)).toEqual({ x: 800, y: 250 });
    expect(kreuzLage({ breite: 500, hoehe: 200 })).toEqual({ x: 500, y: 200 });
    kreuzMitte(l);
    expect(kreuzLage(l)).toEqual({ x: 400, y: 300 });
  });

  it('ist erst nach einer Controller-Eingabe sichtbar und nicht unter ausgeblendetem Mauszeiger', () => {
    expect(kreuzSichtbar()).toBe(false);
    kreuzZeigen();
    expect(kreuzSichtbar()).toBe(true);
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(kreuzSichtbar()).toBe(false);
    act(() => { eingabeMelden(); });
    expect(kreuzSichtbar()).toBe(true);
    hook.unmount();
    kreuzAusblenden();
    expect(kreuzSichtbar()).toBe(false);
  });

  it('zeichnet Lage und Sichtbarkeit direkt am Element und schreibt nur bei Änderung', () => {
    const el = document.createElement('div');
    kreuzElementSetzen(el);
    kreuzZeichnen(l);
    expect(el.style.display).toBe('none');
    kreuzZeigen();
    kreuzZeichnen(l);
    expect(el.style.display).toBe('block');
    expect(el.style.transform).toBe(`translate(${400 - KREUZ_PX / 2}px, ${300 - KREUZ_PX / 2}px)`);
    el.style.display = '';
    kreuzZeichnen(l);
    expect(el.style.display).toBe('');
  });
});
```

`src/ui/steuerung/Fadenkreuz.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Fadenkreuz } from './Fadenkreuz';
import { kreuzSichtbar, kreuzZeichnen, kreuzZeigen, kreuzZuruecksetzen } from './kreuz';

afterEach(() => { kreuzZuruecksetzen(); });

function zeigerBewegung(art: string): void {
  const e = new MouseEvent('pointermove', { bubbles: true });
  Object.defineProperty(e, 'pointerType', { value: art });
  window.dispatchEvent(e);
}

describe('Fadenkreuz', () => {
  it('hängt ein unsichtbares Element ohne Zeigereingaben ein, das die Steuerung zeichnet', () => {
    const { container } = render(<Fadenkreuz />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.display).toBe('none');
    expect(el.className).toContain('pointer-events-none');
    kreuzZeigen();
    kreuzZeichnen({ breite: 800, hoehe: 600 });
    expect(el.style.display).toBe('block');
  });

  it('blendet bei einer Mausbewegung aus, bei einer Berührung nicht', () => {
    render(<Fadenkreuz />);
    kreuzZeigen();
    zeigerBewegung('touch');
    expect(kreuzSichtbar()).toBe(true);
    zeigerBewegung('mouse');
    expect(kreuzSichtbar()).toBe(false);
  });
});
```

`src/ui/steuerung/anwenden.test.ts`: Import ergänzen

```ts
import { kreuzLage, kreuzSichtbar, kreuzZuruecksetzen } from './kreuz';
```

und am Dateiende anhängen:

```ts
describe('steuerungTakt: Fadenkreuz', () => {
  const l = { breite: 800, hoehe: 600 };
  const mitKreuz = (p: PadRoh | null, zeiger: unknown[]): SteuerungUmgebung =>
    ({ ...umgebung([], null), pad: () => p, leinwand: () => l, zeiger: (z) => { zeiger.push(z); } });

  beforeEach(() => { kreuzZuruecksetzen(); });

  it('zeigt das Kreuz ab der ersten Eingabe, bewegt es eine Leinwandhöhe je Sekunde und meldet es als Zeiger pad', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    expect(kreuzSichtbar()).toBe(false);
    expect(zeiger).toEqual([]);
    steuerungTakt(jd, 0.25, mitKreuz(padAttrappe({ axes: [0, 0, 1, 0] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);
    expect(kreuzLage(l)).toEqual({ x: 550, y: 300 });
    expect(zeiger.at(-1)).toEqual({ x: 550, y: 300, art: 'pad' });
  });

  it('holt das Kreuz mit R3 zur Mitte', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    steuerungTakt(jd, 0.25, mitKreuz(padAttrappe({ axes: [0, 0, 0, 1] }), zeiger));
    expect(kreuzLage(l).y).toBeCloseTo(450, 9);
    steuerungTakt(jd, 0, mitKreuz(padAttrappe({ gedrueckt: [PAD.R3] }), zeiger));
    expect(kreuzLage(l)).toEqual({ x: 400, y: 300 });
  });

  it('blendet das Kreuz beim Trennen aus und löscht den Zeiger genau einmal', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    steuerungTakt(jd, 0, mitKreuz(padAttrappe({ gedrueckt: [PAD.X] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);
    steuerungTakt(jd, 0, mitKreuz(null, zeiger));
    expect(kreuzSichtbar()).toBe(false);
    expect(zeiger.at(-1)).toBeNull();
    const anzahl = zeiger.length;
    steuerungTakt(jd, 0, mitKreuz(null, zeiger));
    expect(zeiger.length).toBe(anzahl);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/render/treffer.test.ts src/ui/steuerung/kreuz.test.ts src/ui/steuerung/Fadenkreuz.test.tsx src/ui/steuerung/anwenden.test.ts`
Expected: FAIL (`FANG_PX.pad` undefiniert, Module `./kreuz` und `./Fadenkreuz` fehlen).

- [ ] **Step 3: Zeigerart `pad` in `src/render/treffer.ts`**

Die Zeilen 9 bis 14 ersetzen durch:

```ts
export type Zeigerart = 'maus' | 'finger' | 'pad';

/**
 * Fangradius um den Zeiger. Finger und Fadenkreuz des Controllers (Entwurf Flug
 * und Controller §5.4) treffen ungenauer als ein Mauszeiger.
 */
export const FANG_PX: Record<Zeigerart, number> = { maus: 8, finger: 20, pad: 20 };
/**
 * Bewegung, ab der ein Druck als Ziehen gilt statt als Tippen. Das Fadenkreuz
 * zieht nicht; sein Wert steht nur der Vollständigkeit halber wie beim Finger.
 */
export const TIPP_SCHWELLE_PX: Record<Zeigerart, number> = { maus: 4, finger: 10, pad: 10 };
```

- [ ] **Step 4: Zustand `src/ui/steuerung/kreuz.ts`**

```ts
import { zeigerAusgeblendet } from '../idle';

/**
 * Fadenkreuz des Controllers (Entwurf Flug und Controller §5.4): Lage in
 * CSS-Pixeln relativ zur Canvas und Sichtbarkeit als flüchtiger Modulzustand.
 * Die Steuerung bewegt es je Bild und zeichnet es direkt am Element, ohne
 * React-Rendern.
 */

/** Durchmesser des Rings samt Kontur. */
export const KREUZ_PX = 24;

export interface Leinwand { breite: number; hoehe: number }

/** Null, solange das Kreuz nie bewegt wurde: dann steht es in der Mitte. */
let lage: { x: number; y: number } | null = null;
let an = false;
let element: HTMLElement | null = null;
/** Zuletzt geschriebener Stand; geschrieben wird nur bei Änderung. */
let gezeichnet: string | null = null;

const klemme = (wert: number, max: number): number => Math.min(Math.max(wert, 0), Math.max(max, 0));

/** Lage in der Leinwand; nach einer Verkleinerung an den Rand geklemmt. */
export function kreuzLage(l: Leinwand): { x: number; y: number } {
  if (lage === null) return { x: l.breite / 2, y: l.hoehe / 2 };
  return { x: klemme(lage.x, l.breite), y: klemme(lage.y, l.hoehe) };
}

export function kreuzBewegen(dx: number, dy: number, l: Leinwand): void {
  const p = kreuzLage(l);
  lage = { x: klemme(p.x + dx, l.breite), y: klemme(p.y + dy, l.hoehe) };
}

export function kreuzMitte(l: Leinwand): void {
  lage = { x: l.breite / 2, y: l.hoehe / 2 };
}

export function kreuzZeigen(): void { an = true; }
export function kreuzAusblenden(): void { an = false; }

/** Sichtbar ab einer Controller-Eingabe, nicht aber unter ausgeblendetem Mauszeiger (3 s Ruhe). */
export function kreuzSichtbar(): boolean {
  return an && !zeigerAusgeblendet();
}

export function kreuzElementSetzen(el: HTMLElement | null): void {
  element = el;
  gezeichnet = null;
}

/** Setzt Sichtbarkeit und Lage am Element; ohne Änderung bleibt das DOM unberührt. */
export function kreuzZeichnen(l: Leinwand): void {
  if (element === null) return;
  const p = kreuzLage(l);
  const neu = kreuzSichtbar() ? `translate(${p.x - KREUZ_PX / 2}px, ${p.y - KREUZ_PX / 2}px)` : '';
  if (neu === gezeichnet) return;
  gezeichnet = neu;
  element.style.display = neu === '' ? 'none' : 'block';
  if (neu !== '') element.style.transform = neu;
}

/** Für Tests: Lage, Sichtbarkeit und Element vergessen. */
export function kreuzZuruecksetzen(): void {
  lage = null;
  an = false;
  element = null;
  gezeichnet = null;
}
```

- [ ] **Step 5: Anzeige `src/ui/steuerung/Fadenkreuz.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { KREUZ_PX, kreuzAusblenden, kreuzElementSetzen } from './kreuz';

/**
 * Fadenkreuz des Controllers (Entwurf Flug und Controller §5.4): Ring mit
 * Mittelpunkt, weiß mit dunkler Kontur, ohne Zeigereingaben. Lage und
 * Sichtbarkeit setzt die Steuerung je Bild direkt am Element (kreuz.ts);
 * React rendert es nur beim Einhängen. Eine Bewegung der Maus blendet es aus,
 * die Maus übernimmt dann den Hover.
 */
export function Fadenkreuz(): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    kreuzElementSetzen(ref.current);
    const beiZeiger = (e: PointerEvent): void => {
      if (e.pointerType !== 'touch') kreuzAusblenden();
    };
    window.addEventListener('pointermove', beiZeiger, { passive: true });
    return () => {
      window.removeEventListener('pointermove', beiZeiger);
      kreuzElementSetzen(null);
    };
  }, []);

  const mitte = KREUZ_PX / 2;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-fadenkreuz=""
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{ display: 'none', width: KREUZ_PX, height: KREUZ_PX }}
    >
      <svg width={KREUZ_PX} height={KREUZ_PX} viewBox={`0 0 ${KREUZ_PX} ${KREUZ_PX}`}>
        <circle cx={mitte} cy={mitte} r={9} fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={3} />
        <circle cx={mitte} cy={mitte} r={9} fill="none" stroke="white" strokeWidth={1.5} />
        <circle cx={mitte} cy={mitte} r={1.5} fill="white" stroke="rgba(0,0,0,0.7)" strokeWidth={1} />
      </svg>
    </div>
  );
}
```

- [ ] **Step 6: Fadenkreuz im Takt, `src/ui/steuerung/anwenden.ts`**

Importe ergänzen:

```ts
import type { Zeigerart } from '../../render/treffer';
import {
  kreuzAusblenden, kreuzBewegen, kreuzLage, kreuzMitte, kreuzSichtbar, kreuzZeichnen, kreuzZeigen,
} from './kreuz';
import type { Leinwand } from './kreuz';
```

In `SteuerungUmgebung` nach `pad?(): PadRoh | null;` einfügen:

```ts
  /** Größe der Canvas in CSS-Pixeln, für das Fadenkreuz; ohne sie ruht es. */
  leinwand?(): Leinwand;
  /** Zeiger für den Hover der Szene (szene.setZeiger). */
  zeiger?(z: { x: number; y: number; art: Zeigerart } | null): void;
```

Vor `function padTakt` einfügen:

```ts
/** Controller eines Bildes: ausgewertetes Bild und ob er in diesem Bild verschwand. */
interface PadTakt { bild: PadBild | null; getrennt: boolean }
```

`padTakt` ändern: Rückgabetyp `PadTakt`; der Zweig ohne Controller wird

```ts
  if (roh === null) {
    const getrennt = padVorher !== null;
    padZuruecksetzen();
    return { bild: null, getrennt };
  }
```

`if (erstes) return null;` wird `if (erstes) return { bild: null, getrennt: false };`, das abschließende `return bild;` wird `return { bild, getrennt: false };`. Im JSDoc den letzten Satz ersetzen durch „Ohne Controller und beim ersten Auftauchen ist das Bild null; `getrennt` meldet, dass er in diesem Bild verschwand."

Vor `steuerungTakt` einfügen:

```ts
/** Fadenkreuz bei vollem Ausschlag: eine Canvas-Höhe je Sekunde (Entwurf §5.2). */
export const KREUZ_HOEHEN_JE_S = 1;

/**
 * Fadenkreuz eines Bildes (§5.4): Jede Controller-Eingabe zeigt es, der rechte
 * Stick bewegt es, R3 holt es zur Mitte, Trennen blendet es aus und löscht den
 * Hover. Solange es sichtbar ist, geht seine Lage als Zeiger der Art pad an
 * die Szene. Eine Mausbewegung blendet es aus (Fadenkreuz.tsx); den Hover der
 * Maus löscht es dabei nicht.
 */
function kreuzTakt(dt: number, u: SteuerungUmgebung, pad: PadTakt): void {
  const leinwand = u.leinwand?.();
  if (leinwand === undefined) return;
  const { bild } = pad;
  if (bild !== null) {
    if (bild.eingabe) kreuzZeigen();
    const r = bild.absicht.rechts;
    const weg = leinwand.hoehe * KREUZ_HOEHEN_JE_S * dt;
    if (r.x !== 0 || r.y !== 0) kreuzBewegen(r.x * weg, r.y * weg, leinwand);
    if (bild.flanken.includes(PAD.R3)) kreuzMitte(leinwand);
  }
  if (pad.getrennt) {
    if (kreuzSichtbar()) u.zeiger?.(null);
    kreuzAusblenden();
  }
  if (kreuzSichtbar()) u.zeiger?.({ ...kreuzLage(leinwand), art: 'pad' });
  kreuzZeichnen(leinwand);
}
```

`steuerungTakt` im Rumpf ändern in:

```ts
  const pad = padTakt(u);
  bewegen(jd, dt, u, pad.bild);
  kreuzTakt(dt, u, pad);
```

und im JSDoc anhängen: „Danach bewegt der rechte Stick das Fadenkreuz."

- [ ] **Step 7: Tests laufen lassen**

Run: `npx vitest run src/render/treffer.test.ts src/ui/steuerung/kreuz.test.ts src/ui/steuerung/Fadenkreuz.test.tsx src/ui/steuerung/anwenden.test.ts src/render/camera/input.test.ts`
Expected: PASS.

- [ ] **Step 8: Prüfläufe und Commit**

Run: `npm test` (Soll 3816), `npx tsc -b`, `npm run lint`.

```bash
git add src/render/treffer.ts src/render/treffer.test.ts src/ui/steuerung/kreuz.ts src/ui/steuerung/kreuz.test.ts src/ui/steuerung/Fadenkreuz.tsx src/ui/steuerung/Fadenkreuz.test.tsx src/ui/steuerung/anwenden.ts src/ui/steuerung/anwenden.test.ts
git commit -m "Controller: Fadenkreuz mit dem rechten Stick, Zeigerart pad"
```

---

### Task 9: Tasten des Controllers

**Files:**
- Modify: `src/ui/steuerung/anwenden.ts` (Importe, `SteuerungUmgebung`, neue Tabelle und Funktion `padTasten`, `steuerungTakt`)
- Modify: `src/ui/steuerung/anwenden.test.ts` (Import, neuer Block `steuerungTakt: Tasten des Controllers`)

**Interfaces:**
- Consumes: `PAD`, `PadBild` (Task 6); `padTakt`, `kreuzTakt` (Tasks 7, 8); `kreuzLage` (Task 8); `handleShortcut` (`ui/shortcuts/useShortcuts.ts`); `fahreZu`, `fahreZuSystem` (`ui/kamerafahrt.ts`).
- Produces: `SteuerungUmgebung.trefferBei?(x: number, y: number): string | null`; Tastenzeilen nach Entwurf §5.3.

- [ ] **Step 1: Failing tests schreiben**

`src/ui/steuerung/anwenden.test.ts`: Import ergänzen `import { INFO_PANEL } from '../info/konstanten';` und am Dateiende anhängen:

```ts
describe('steuerungTakt: Tasten des Controllers', () => {
  const l = { breite: 800, hoehe: 600 };
  type Treffer = (x: number, y: number) => string | null;
  const mitTasten = (p: PadRoh, trefferBei: Treffer): SteuerungUmgebung =>
    ({ ...umgebung([], null), pad: () => p, leinwand: () => l, trefferBei });
  /** Ein Bild losgelassen, dann gedrückt: genau eine Flanke. */
  const druecke = (taste: number, trefferBei: Treffer = () => null): void => {
    steuerungTakt(jd, 0, mitTasten(padAttrappe(), trefferBei));
    steuerungTakt(jd, 0, mitTasten(padAttrappe({ gedrueckt: [taste] }), trefferBei));
  };

  beforeEach(() => { kreuzZuruecksetzen(); });

  it('fährt mit A zum Körper unter dem Kreuz', () => {
    const gefragt: [number, number][] = [];
    druecke(PAD.A, (x, y) => { gefragt.push([x, y]); return 'mars'; });
    expect(gefragt).toEqual([[400, 300]]);
    expect(useStore.getState().camera.targetId).toBe('mars');
    expect(fahrtLaeuft()).toBe(true);
  });

  it('tut mit A ohne Treffer nichts', () => {
    druecke(PAD.A);
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(fahrtLaeuft()).toBe(false);
  });

  it('fährt mit B in die Draufsicht auf das Sonnensystem', () => {
    useStore.getState().setCamera({ targetId: 'mars' });
    druecke(PAD.B);
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(fahrtLaeuft()).toBe(true);
  });

  it('ruft für Steuerkreuz, Ansicht und Y das Kürzel der Tastatur', () => {
    const z = () => useStore.getState();
    druecke(PAD.RECHTS);
    expect(z().time.rateDaysPerSec).toBeCloseTo(1.5, 12);
    druecke(PAD.LINKS);
    expect(z().time.rateDaysPerSec).toBeCloseTo(1, 12);
    druecke(PAD.RUNTER);
    expect(z().time.rateDaysPerSec).toBeCloseTo(-1, 12);
    druecke(PAD.HOCH);
    expect(z().time.paused).toBe(true);
    druecke(PAD.VIEW);
    expect(z().ui.hidden).toBe(true);
    const infoVorher = z().ui.panels[INFO_PANEL];
    druecke(PAD.Y);
    expect(z().ui.panels[INFO_PANEL]).toBeDefined();
    expect(z().ui.panels[INFO_PANEL]).not.toBe(infoVorher);
  });

  it('startet und beendet das Kino mit Menü/Start; RB und Menü halten es nicht an', () => {
    useStore.getState().setCinema({ pauseOnInput: true });
    druecke(PAD.MENUE);
    expect(useStore.getState().cinema.running).toBe(true);
    druecke(PAD.RB);
    expect(useStore.getState().cinema.running).toBe(true);
    expect(useStore.getState().cinema.nummer).toBe(1);
    druecke(PAD.MENUE);
    expect(useStore.getState().cinema.running).toBe(false);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/steuerung/anwenden.test.ts`
Expected: FAIL (keine Taste wirkt).

- [ ] **Step 3: Umsetzen**

`src/ui/steuerung/anwenden.ts`: den Import aus `'../kamerafahrt'` ersetzen durch `import { fahreZu, fahreZuSystem, fahrtAbbrechen } from '../kamerafahrt';` und ergänzen `import { handleShortcut } from '../shortcuts/useShortcuts';`.

In `SteuerungUmgebung` nach `zeiger?(…): void;` einfügen:

```ts
  /** Körper unter dem Fadenkreuz aus dem zuletzt berechneten Bild (szene.trefferBei mit Zeigerart pad). */
  trefferBei?(x: number, y: number): string | null;
```

Vor `steuerungTakt` einfügen:

```ts
/**
 * Tasten, die wie ihr Tastenkürzel wirken (Entwurf §5.3): Tastatur und
 * Controller verhalten sich dadurch gleich, auch im Kino.
 */
const KUERZEL_TASTEN: Readonly<Partial<Record<number, string>>> = {
  [PAD.LINKS]: 'ArrowLeft',
  [PAD.RECHTS]: 'ArrowRight',
  [PAD.HOCH]: ' ',
  [PAD.RUNTER]: 'r',
  [PAD.MENUE]: 'c',
  [PAD.RB]: 'n',
  [PAD.VIEW]: 'h',
  [PAD.Y]: 'i',
};

/**
 * Tasten eines Bildes, nach Bewegung und Fadenkreuz (§5.3): A fährt zum
 * Körper unter dem Kreuz (ohne Treffer nichts), B in die Draufsicht auf das
 * System, die übrigen belegten Tasten rufen ihr Tastenkürzel. R3 wirkt im
 * Fadenkreuz-Takt; X, L3 und die Xbox-Taste bleiben frei.
 */
function padTasten(bild: PadBild, u: SteuerungUmgebung): void {
  for (const t of bild.flanken) {
    if (t === PAD.A) {
      const leinwand = u.leinwand?.();
      if (leinwand === undefined) continue;
      const { x, y } = kreuzLage(leinwand);
      const id = u.trefferBei?.(x, y) ?? null;
      if (id !== null) fahreZu(id);
    } else if (t === PAD.B) {
      fahreZuSystem();
    } else {
      const taste = KUERZEL_TASTEN[t];
      if (taste !== undefined) handleShortcut(taste);
    }
  }
}
```

`steuerungTakt` im Rumpf um die Zeile `if (pad.bild !== null) padTasten(pad.bild, u);` nach `kreuzTakt(dt, u, pad);` ergänzen und im JSDoc anhängen: „Zuletzt wirken die Tasten des Controllers."

- [ ] **Step 4: Tests laufen lassen**

Run: `npx vitest run src/ui/steuerung/anwenden.test.ts src/ui/shortcuts`
Expected: PASS.

- [ ] **Step 5: Prüfläufe und Commit**

Run: `npm test` (Soll 3821), `npx tsc -b`, `npm run lint`.

```bash
git add src/ui/steuerung/anwenden.ts src/ui/steuerung/anwenden.test.ts
git commit -m "Controller: A fährt zum Objekt unter dem Kreuz, B in die Draufsicht, Tastenzeilen wie die Kürzel"
```

---

### Task 10: Verdrahtung und Kürzelübersicht

**Files:**
- Modify: `src/app/main.tsx` (Importe, Steuerungsumgebung, Mauszeigerform, `<Fadenkreuz />`)
- Modify: `src/ui/App.tsx` (Kürzelübersicht mit Abschnitt „Controller")
- Modify: `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` (neue Schlüssel vor dem Tabellenende)
- Modify: `src/ui/App.test.tsx` (ein Test)

**Interfaces:**
- Consumes: `padLeserErstellen` (Task 6), `SteuerungUmgebung` samt `pad`, `leinwand`, `zeiger`, `trefferBei` (Tasks 7 bis 9), `kreuzSichtbar`, `Fadenkreuz` (Task 8).

- [ ] **Step 1: Failing test schreiben**

`src/ui/App.test.tsx`, im Block `App` anhängen:

```tsx
  it('nennt in der Kürzelübersicht den Controller', () => {
    useStore.getState().setUi({ panels: { ...DEFAULT_STATE.ui.panels, shortcuts: true } });
    render(<App />);
    expect(screen.getByText('Controller')).toBeTruthy();
    expect(screen.getByText('Linker Stick')).toBeTruthy();
    expect(screen.getByText('Zum Objekt unter dem Fadenkreuz fahren')).toBeTruthy();
  });
```

- [ ] **Step 2: Test laufen lassen, er scheitert**

Run: `npx vitest run src/ui/App.test.tsx`
Expected: FAIL (kein Text „Controller").

- [ ] **Step 3: Texte**

`src/ui/i18n/de.ts`, vor `} as const;`:

```ts
  'shortcuts.padTitle': 'Controller',
  'shortcuts.padLook': 'Umschauen; startet den Flug',
  'shortcuts.padFly': 'Vorwärts und rückwärts fliegen',
  'shortcuts.padOrbit': 'Um den Körper in der Bildmitte drehen; RT/LT näher und weiter',
  'shortcuts.padCrosshair': 'Fadenkreuz bewegen',
  'shortcuts.padGoTo': 'Zum Objekt unter dem Fadenkreuz fahren',
  'shortcuts.padSystem': 'Draufsicht auf das Sonnensystem',
  'shortcuts.padCenter': 'Fadenkreuz zur Bildmitte',
  'padKey.leftStick': 'Linker Stick',
  'padKey.lbStick': 'LB + linker Stick',
  'padKey.rightStick': 'Rechter Stick',
  'padKey.dpadSides': 'Steuerkreuz ◀ ▶',
  'padKey.dpadUp': 'Steuerkreuz ▲',
  'padKey.dpadDown': 'Steuerkreuz ▼',
  'padKey.menu': 'Menü',
  'padKey.view': 'Ansicht',
```

`src/ui/i18n/en.ts`, vor der schließenden `};`:

```ts
  'shortcuts.padTitle': 'Controller',
  'shortcuts.padLook': 'Look around; starts flying',
  'shortcuts.padFly': 'Fly forward and back',
  'shortcuts.padOrbit': 'Orbit the body nearest the centre; RT/LT nearer and farther',
  'shortcuts.padCrosshair': 'Move the crosshair',
  'shortcuts.padGoTo': 'Go to the object under the crosshair',
  'shortcuts.padSystem': 'Top view of the solar system',
  'shortcuts.padCenter': 'Crosshair to the centre',
  'padKey.leftStick': 'Left stick',
  'padKey.lbStick': 'LB + left stick',
  'padKey.rightStick': 'Right stick',
  'padKey.dpadSides': 'D-pad ◀ ▶',
  'padKey.dpadUp': 'D-pad ▲',
  'padKey.dpadDown': 'D-pad ▼',
  'padKey.menu': 'Menu',
  'padKey.view': 'View',
```

- [ ] **Step 4: Kürzelübersicht in `src/ui/App.tsx`**

Die Konstante `KUERZEL` bekommt den Typ `Kuerzel`; davor:

```ts
/** Zeilen der Kürzelübersicht: Taste (Literal oder Textschlüssel) und Textschlüssel der Wirkung. */
type Kuerzel = readonly (readonly [string | { key: string }, string])[];
```

und `const KUERZEL: readonly (readonly [string | { key: string }, string])[] = [` wird `const KUERZEL: Kuerzel = [`. Nach `KUERZEL` einfügen:

```ts
/** Controller nach der Standardbelegung (Entwurf Flug und Controller §5.2, §5.3). */
const PAD_KUERZEL: Kuerzel = [
  [{ key: 'padKey.leftStick' }, 'shortcuts.padLook'],
  ['RT / LT', 'shortcuts.padFly'],
  [{ key: 'padKey.lbStick' }, 'shortcuts.padOrbit'],
  [{ key: 'padKey.rightStick' }, 'shortcuts.padCrosshair'],
  ['A', 'shortcuts.padGoTo'],
  ['B', 'shortcuts.padSystem'],
  ['R3', 'shortcuts.padCenter'],
  [{ key: 'padKey.dpadSides' }, 'shortcuts.rate'],
  [{ key: 'padKey.dpadUp' }, 'shortcuts.pause'],
  [{ key: 'padKey.dpadDown' }, 'shortcuts.reverse'],
  [{ key: 'padKey.menu' }, 'shortcuts.cinema'],
  ['RB', 'shortcuts.nextScene'],
  [{ key: 'padKey.view' }, 'shortcuts.toggleUi'],
  ['Y', 'shortcuts.info'],
];

function Kuerzelliste({ eintraege }: { eintraege: Kuerzel }): React.JSX.Element {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
      {eintraege.map(([taste, schluessel]) => {
        const label = typeof taste === 'string' ? taste : t(taste.key);
        return (
          <div key={schluessel} className="contents">
            <dt className="font-mono text-xs opacity-80">{label}</dt>
            <dd className="m-0">{t(schluessel)}</dd>
          </div>
        );
      })}
    </dl>
  );
}
```

`Kuerzeluebersicht` ersetzen durch:

```tsx
function Kuerzeluebersicht(): React.JSX.Element {
  return (
    <Panel id={SHORTCUTS_PANEL} title={t('shortcuts.title')}>
      <Kuerzelliste eintraege={KUERZEL} />
      <h3 className="mb-1 mt-3 text-xs font-semibold opacity-80">{t('shortcuts.padTitle')}</h3>
      <Kuerzelliste eintraege={PAD_KUERZEL} />
    </Panel>
  );
}
```

- [ ] **Step 5: Verdrahtung in `src/app/main.tsx`**

Importe: die Zeile `import { steuerungTakt, tempoAendern } from '../ui/steuerung/anwenden';` ergänzen um

```ts
import type { SteuerungUmgebung } from '../ui/steuerung/anwenden';
import { padLeserErstellen } from '../ui/steuerung/gamepad';
import { kreuzSichtbar } from '../ui/steuerung/kreuz';
import { Fadenkreuz } from '../ui/steuerung/Fadenkreuz';
```

Nach `const tastatur = tastaturAnhaengen(window);` einfügen:

```ts
    // Tastatur, Controller und Fadenkreuz je Bild (Entwurf Flug und Controller
    // §5, §6.2). Ohne sicheren Kontext oder Gamepad-API schaltet sich der Leser
    // still ab. Die Canvas füllt das Fenster; innerWidth/innerHeight erzwingen
    // anders als clientWidth keinen Layoutdurchgang je Bild.
    const steuerung: SteuerungUmgebung = {
      tasten: tastatur.stand,
      letztePose,
      pad: padLeserErstellen({ isSecureContext: window.isSecureContext, navigator }),
      leinwand: () => ({ breite: window.innerWidth, hoehe: window.innerHeight }),
      zeiger: (zeiger) => { szene.setZeiger(zeiger); },
      trefferBei: (x, y) => szene.trefferBei(x, y, 'pad'),
    };
```

In der Bildschleife `steuerungTakt(jd, dt, { tasten: tastatur.stand, letztePose });` ersetzen durch `steuerungTakt(jd, dt, steuerung);`. Die Zeile

```ts
      const zeigerForm = szene.hervorgehoben() === null ? '' : 'pointer';
```

ersetzen durch:

```ts
      // Hebt das Fadenkreuz etwas hervor, bleibt die Form des Mauszeigers, wie sie ist.
      const zeigerForm = szene.hervorgehoben() === null || kreuzSichtbar() ? '' : 'pointer';
```

Im JSX nach `<TempoHinweis />` einfügen:

```tsx
      {/* Über der Bedienoberfläche; bleibt sichtbar, wenn H sie ausblendet. */}
      <Fadenkreuz />
```

- [ ] **Step 6: Tests laufen lassen**

Run: `npx vitest run src/ui/App.test.tsx src/ui/i18n`
Expected: PASS.

- [ ] **Step 7: Sichtprobe im Browser (nicht committen)**

Server prüfen (200). Mit `browser_run_code_unsafe`:

```js
await page.addInitScript(() => {
  const knoepfe = Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 }));
  const pad = { id: 'Attrappe', index: 0, connected: true, mapping: 'standard', timestamp: 0, axes: [0, 0, 0, 0], buttons: knoepfe };
  window.__pad = pad;
  Object.defineProperty(navigator, 'getGamepads', { value: () => [pad], configurable: true });
});
await page.goto('http://localhost:5173/Orrery/');
```

Danach `window.store.setState({ quality: { tier: 'high' } })`. In der Seite: 0,5 s warten (per `performance.now()`), `window.__pad.axes[2] = 1` für 300 ms, dann 0. Prüfen und in den Bericht schreiben: `[data-fadenkreuz]` hat `display: block`, `transform` nach rechts verschoben (x rund Mitte + 0,3 · Fensterhöhe). Dann `page.mouse.move(100, 100)` und `page.mouse.move(120, 110)`: `display: none`. Konsole ohne Fehler. Dateien unter `.playwright-mcp/` löschen.

- [ ] **Step 8: Prüfläufe und Commit**

Run: `npm test` (Soll 3822), `npx tsc -b`, `npm run lint`, `npm run build`.

```bash
git add src/app/main.tsx src/ui/App.tsx src/ui/App.test.tsx src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Controller: Verdrahtung, Fadenkreuz im Bild, Kürzelübersicht mit Controller"
```

---

### Task 11: Abnahme

**Files:**
- Create: `docs/flug-etappe2-abnahme.md`
- Nur lokal, nicht committen: Screenshots und Skripte unter `.playwright-mcp/`

- [ ] **Step 1: Prüfläufe**

```bash
npm run lint
npm test
npm run build
```

Expected: Lint ohne Befund; 3822 Tests grün; Build erfolgreich (nur der bekannte Chunkgrößen-Hinweis).

- [ ] **Step 2: Vorbereitung im Browser**

Server prüfen (200). Vor dem Laden die Controller-Attrappe per `page.addInitScript` einhängen (Skript wie Task 10 Step 7; zusätzlich `window.__padDruecken = (i, an) => { knoepfe[i].pressed = an; knoepfe[i].value = an ? 1 : 0; };`), dann `page.goto('http://localhost:5173/Orrery/')`, sofort `window.store.setState({ quality: { tier: 'high' } })`. Fenster wie bei früheren Abnahmen, Viewport notieren. Für Pixelmessungen `setUi({ hidden: true })`, `setCinema({ running: false, pauseOnInput: false })`, `setTime({ paused: true })`, alles in einer Seitenladung. Vor jedem Screenshot 3 s warten (per `performance.now()` in der Seite) und prüfen, dass `window.renderer.info.memory.textures` sich nicht mehr ändert. Tasten mit `page.keyboard.down/up`, Zeiten mit `performance.now()`; Bildrate nur mit eigenem rAF-Zähler. Körperlagen: `import('/Orrery/src/sim/scale.ts')`, `import('/Orrery/src/data/index.ts')`, gezeigte Lage `window.letztePose()`. Pixel mit Python 3.12 (Pillow, numpy): Scheibe = zusammenhängende Pixel mit Helligkeit > 8 um die hellste Stelle nahe der erwarteten Lage. Jede Messung sofort nach dem Messen mit Werten in die Berichtsdatei schreiben.

- [ ] **Step 3: Messung N1 – Bezug zwischen Erde und Mond bei laufender Uhr (Nachtrag §13.1)**

Fluglage 30 dargestellte Erdradien von der Erde in Richtung Mond (Richtung aus den dargestellten Lagen zum aktuellen `jd`), Blick auf die Erde, Bezug `earth`. `setTime({ paused: false, rateDaysPerSec: 1 })`, 5 s (gemessen) ohne Eingabe, dabei je Bild `camera.fly.refId` und |`letztePose().positionKm` − Erde| / R_E aufzeichnen. Screenshot bei t0 und t0 + 5 s. Kriterium: `refId` durchgehend `'earth'`; Abstand 30 ± 0,1 R_E; Schwerpunkt der Erdscheibe verschiebt sich höchstens 3 px. Vergleich Etappe 1: 30 → 43,5 R_E unter Sonnenbezug. Danach `setTime({ paused: true })`.

- [ ] **Step 4: Messung N2 – Ziel nach dem Wechsel vom Kino in den Flug (Nachtrag §13.2)**

`setCinema({ shuffle: false, nummer: <Index von 'phobos-tiefflug' in SCENES>, pauseOnInput: true })`, Oberfläche sichtbar, `setCamera({ targetId: 'jupiter' })`. Nach 3 s Ruhe echte Taste `c`, 5 s warten, `KeyW` 300 ms halten. Kriterium: `camera.mode` = `'fly'`, `camera.targetId` = `'mars'`, `browser_snapshot` zeigt im Kopf des Infopanels „Mars".

- [ ] **Step 5: Messung N3 – Shift loslassen (Nachtrag §13.3)**

`setCamera({ mode: 'attached', targetId: 'earth', distance: 10 * R_E })`, einschwingen. rAF-Aufzeichnung von `camera.mode` und `camera.azimuth` starten. `Shift` und `KeyA` drücken, nach 500 ms `Shift` loslassen, `KeyA` weitere 1000 ms halten, loslassen. Kriterium: `mode` nie `'fly'`; der Azimut wächst nur in den ersten 500 ms (rund 30°) und bleibt danach bis auf 10⁻⁹ rad stehen.

- [ ] **Step 6: Messung N4 – Wiederherstellung in den Flug (Nachtrag §13.4)**

Uhr angehalten. Flug nahe Saturn setzen (`setCamera({ mode: 'fly', fly: { refId: 'saturn', x: 8 * R, y: 0, z: 2 * R, yaw: Math.PI, pitch: -Math.asin(2 / Math.hypot(8, 2)) } })`), 3 s einschwingen. Nach 3 s Ruhe echte Taste `c` (Kino startet, Flug ist gemerkt), 5 s warten, `Escape`. Ab dem Escape je Bild `letztePose().positionKm` aufzeichnen (3 s). Kriterium: Zeit, bis 90 % des Weges von der Lage beim Escape zur Endlage zurückgelegt sind, mindestens 0,7 s (Dämpfung 0,45 s ergibt rechnerisch 0,87 s, 0,15 s ergäbe 0,29 s); `camera.mode` = `'fly'`.

- [ ] **Step 7: Messung N5 – Körper nächst der Bildmitte (Nachtrag §13.5)**

Aufbau wie Etappe 1, Messung 4 (Flug 20 Jupiterradien vor Jupiter, Blick 0,1 rad an ihm vorbei), aber mit den Varianten, die dort Io, Europa, Titan oder Saturn wählten (`docs/flug-etappe1-abnahme.md`, §4 Ruling zu Messung 4), alle Monde sichtbar. Je Variante `Shift` und `KeyA` 150 ms. Kriterium: `targetId` = `'jupiter'` in jeder Variante, in der kein Mond die Bildmitte bedeckt.

- [ ] **Step 8: Messung 5 – Fadenkreuz (Entwurf §9 Punkt 5)**

(a) Differenzbild in derselben Ladung: Kreuz aus (Ausgangszustand) gegen Kreuz an (rechter Stick 100 ms auf 0,5, dann 0, 3 s warten): Kriterium: abweichende Pixel nur in einem Quadrat von 32 px um die Lage des Kreuzes (aus `transform` von `[data-fadenkreuz]`), mindestens 50 Pixel. (b) Kreuz per rechtem Stick auf eine Bahnlinie führen (Zielpunkt aus der Projektion eines Bahnpunkts, Vorgehen wie `docs/klickflaechen-abnahme.md`): Kriterium: `window.szene.hervorgehoben()` nennt den Körper der Bahn, die Bahnlinie hat die Deckkraft 0,9. (c) Kreuz auf die Marsscheibe, `A` drücken (`__padDruecken(0, true)`, ein Bild später `false`): Kriterium: `targetId` = `'mars'`, 3 s nach dem Druck Schwerpunkt der Marsscheibe höchstens 2 px neben der Bildmitte (Vergleich Klickflächen 1,6 px). (d) `page.mouse.move` zweimal: `[data-fadenkreuz]` hat `display: none`.

- [ ] **Step 9: Messung 6 – Ruhe und Kino (Entwurf §9 Punkt 6)**

(a) Kino läuft, `pauseOnInput: false`, Oberfläche sichtbar: rechter Stick 5 s lang langsam ausgelenkt (0,3): Kriterium: nach 5 s steht die Kopfzeile der Oberfläche im DOM, `html` trägt nicht die Klasse `zeiger-aus`; Gegenprobe ohne Eingabe: nach 4 s ist die Oberfläche fort. (b) `pauseOnInput: true`, Kino läuft: rechter Stick 200 ms: `cinema.running` = false, `camera.mode` = `'cinema'`. (c) Kino läuft: RB drücken: `cinema.nummer` + 1, `running` bleibt true; Menü/Start drücken: `running` = false, Kamera wie vor dem Kino. (d) Kino läuft: linker Stick 300 ms auf 0,5: `camera.mode` = `'fly'`, `targetId` = Blickziel der Szene, größter Schritt der gezeigten Lage in den fünf Bildern um den Wechsel nicht größer als der größte Flugschritt danach.

- [ ] **Step 10: Messung 7 – Kosten (Entwurf §9 Punkt 7)**

Eigener rAF-Zähler je 5 s: (a) Controller verbunden, neutral, Kreuz aus; (b) linker Stick auf 0,5 (Flug) und rechter Stick auf 0,3 (Kreuz sichtbar, wandert). Mittlerer und größter Bildabstand je Fall. Kriterium: Mittelwert (b) höchstens 0,5 ms über (a), kein Bildabstand über 25 ms.

- [ ] **Step 11: Protokoll `docs/flug-etappe2-abnahme.md`**

```md
# Abnahme Flug Etappe 2 (Nachträge, Controller und Fadenkreuz)

## 1. Umfang
(Commits mit Kurzhash und Titel, Branch, Plan, Entwurf samt Nachtrag §13; was Etappe 2 liefert, in drei Sätzen)

## 2. Lint, Tests, Build
(Schlusszeilen; Testzahl 3769 → 3822 mit Herleitung je Task)

## 3. Sichtprüfung
(Messungen N1 bis N5 und 5 bis 7 als Tabelle: Kriterium, Messwert, erfüllt; Viewport, Stufe, jd)

## 4. Rulings
(Plan-Rulings unten übernehmen, dazu die der Umsetzung, jeweils „Ruling:" am Anfang)

## 5. Bekannte Unschärfen

## 6. Prüfung von Hand (Jens, Xbox-Controller)
(Was zu prüfen ist: Tempo, Totzonen, Drehraten, Kreuzgeschwindigkeit, A/B, Steuerkreuz, Menü/RB, Ansicht/Y; Hinweis, dass Chrome den Controller erst nach einem Tastendruck zeigt und nur in sicherem Kontext)

## 7. Fragen an Jens
```

Screenshots und Skripte unter `.playwright-mcp/` löschen; `git status --short` zeigt nur das Protokoll.

- [ ] **Step 12: Commit**

```bash
git add docs/flug-etappe2-abnahme.md
git commit -m "Abnahme Flug Etappe 2"
```

---

## Plan-Rulings

Entscheidungen beim Schreiben dieses Plans, von Jens noch nicht bestätigt:

1. Ruling: Der Einflussbereich nimmt die große Halbachse zur Epoche, nicht den momentanen Sonnenabstand: zeitunabhängig, der Unterschied liegt unter der Exzentrizität.
2. Ruling: Deckel 0,5 des dargestellten Sonnenabstands. Ohne ihn reichte im Maßstab Kompakt der Bereich der Erde über die Sonne hinaus (3·10⁸ km bei 1,5·10⁸ km Abstand). Im Schaubild greift er knapp für die Erde und deutlich für die Riesenplaneten (Jupiter 2·10⁸ km statt 2,6·10⁹ km); zwischen Mars- und Jupiterbahn kann deshalb Jupiter Bezug sein.
3. Ruling: Im Maßstab Kompakt liegt die dargestellte Mondbahn (7,7·10⁷ km) jenseits des gedeckelten Erdbereichs (7,4·10⁷ km); dort entscheidet die oberste Ebene nach q (dicht am Mond der Mond, sonst oft die Sonne). Bekannte Grenze ohne eigenen Fall.
4. Ruling: Systemgrenze mit eigenem Rückstellbereich: Eintritt bei t < 1, Austritt bei t ≥ 1,25; ein anderes System gewinnt vorher nur bei t < 0,8 · t_bisher.
5. Ruling: Monde eines ausgeblendeten Mutterkörpers konkurrieren auf der obersten Ebene; Stände ohne `mutter`/`einfluss` (Testliterale) wählen wie in Etappe 1 allein nach q.
6. Ruling: `blickzielVon` folgt dem Blickpunkt der Kamera statt „`lookAtId ?? targetId`" aus der Schlussprüfung: Bei der Sichtlinie blickt die Kamera auf den Standortkörper. `exposureTargetId` bleibt unverändert (belichtet bei der Sichtlinie auf `lookAtId`, bekannter Befund aus 4d-1).
7. Ruling: Gesperrte Tasten gibt nur ein neuer Druck derselben Taste frei, auch ein erneutes Drücken von Shift nicht.
8. Ruling: Eine Wiederherstellung wird am Abstand der Solllage zur gezeigten Lage beim Eintritt erkannt (Rest > 10⁻³) und endet beim Ankommen, nicht nach fester Zeit; Eingaben während des Übergangs laufen mit 0,45 s weiter.
9. Ruling: Beim ersten Auftauchen des Controllers bleibt das ganze Bild ohne Wirkung, auch Sticks und Trigger (Entwurf §5.1 nennt nur den Tastendruck).
10. Ruling: Das Trennen wird am fehlenden Eintrag erkannt; `gamepaddisconnected` wird nicht gehört, es führt im nächsten Bild ebenfalls zum fehlenden Eintrag.
11. Ruling: Im selben Bild wirkt die Tastatur vor dem Controller; solange Flugtasten gehalten sind, ruht die Controller-Bewegung (Fadenkreuz und Tasten wirken weiter).
12. Ruling: LB mit Stick dreht in beiden Achsen mit 90°/s, RT/LT zoomen mit Faktor 2 je Sekunde; die Richtungen folgen Shift (Stick rechts = Azimut steigt wie Shift+D).
13. Ruling: Jede Controller-Eingabe zeigt das Fadenkreuz, nicht nur der rechte Stick (Entwurf §5.4 „ab der ersten Controller-Eingabe").
14. Ruling: Eine Mausbewegung blendet das Kreuz aus, löscht aber den Hover nicht (die Maus meldet im selben Ereignis ihren eigenen Zeiger); nur das Trennen löscht ihn.
15. Ruling: Die Leinwand ist das Fenster (`innerWidth`/`innerHeight`), weil die Canvas es füllt; `clientWidth` erzwänge je Bild einen Layoutdurchgang.
16. Ruling: Solange das Fadenkreuz sichtbar ist, bleibt die Form des Mauszeigers unverändert, auch wenn das Kreuz einen Körper hervorhebt.
17. Ruling: Tasten wirken nach Bewegung und Fadenkreuz desselben Bildes; A sucht an der Lage des Kreuzes, auch wenn es in diesem Bild erst sichtbar wird.
18. Ruling: `padAttrappe.ts` liegt als kleines Modul neben `gamepad.ts`, statt in zwei Testdateien kopiert zu werden.
19. Ruling: Die Kürzelübersicht nennt die Controller-Tasten mit den Xbox-Namen; „Menu" und „View" erscheinen auf Deutsch als „Menü" und „Ansicht".
20. Ruling: Das Fadenkreuz trägt `data-fadenkreuz` für die Abnahme, wie die Verweise `data-verweis`.

## Hinweise für die Umsetzung

- Reihenfolge strikt 1 → 11; Task 7 baut auf 3 und 6 auf, Task 8 auf 7, Task 9 auf 8, Task 10 auf 6 bis 9.
- Modelle: Tasks 1 bis 10 sind vollständig ausgeschrieben (Umsetzer sonnet), Task 11 Browser und Protokoll (opus, Zwischenstände je Messung sofort in den Bericht). Reviews sonnet; Schlussprüfung der Etappe opus.
- Soll-Testzahlen: 3774, 3775, 3779, 3780, 3782, 3794, 3807, 3816, 3821, 3822, 3822.
- Die Prüfung von Hand mit dem Xbox-Controller macht Jens nach der Abnahme; Startwerte lassen sich danach per Ruling ändern (Entwurf §9).
