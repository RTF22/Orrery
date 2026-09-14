# Phase 4c Infopanel, Etappe 1 „Gerüst" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Eine rechte Spalte zeigt zum Kameraziel (oder zur laufenden Kinoszene) einen Erläuterungstext in drei Niveaustufen, darüber einen gestuften Datenblock mit Live-Werten und darunter Quellenkarten; Verweise im Text fahren die Kamera, starten Szenen, wechseln Themen oder heben Quellen hervor. Als Nachweis liegen Texte für Erde, Saturn, die Szene Mondfinsternis und das Thema Modell vor.

**Architektur:** Texte sind Markdown-Dateien unter `src/data/texte/<sprache>/<niveau>/<art>-<kennung>.md`, geladen über `import.meta.glob` ohne `eager`. Ein eigener Parser (`ui/info/markdown.ts`, reine Funktion) versteht Überschriften, Absätze, Listen, fett, kursiv und Links; Link-Ziele löst `data/verweise.ts` gegen Körper, Szenen, Themen und Quellen auf. Der Store bekommt den Zweig `ui.info` (Niveau, Breite, Teilung, Thema) mit Prüfer und Link-Profil. Die Kamerafahrt (`ui/kamerafahrt.ts`) ersetzt den harten Sprung des Objektbaums. Keine neue Abhängigkeit.

**Tech-Stack:** TypeScript (strict, `noUncheckedIndexedAccess`), React 19, Zustand, Vite (`import.meta.glob`), Vitest (node bzw. jsdom mit Testing Library), Tailwind, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md`, maßgeblich §3 (Aufbau), §4 (Daten, Verweise, Zustand), §5 (Datenblock, Live-Werte, Kamerafahrt), §6 (Texte), §7 Punkt 1 (Umfang dieser Etappe), §8 (Tests), §9 (Abnahme). Abweichungen stehen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Tests; Bezeichner dürfen deutsch sein). Umlaute korrekt. Englisch nur in `en.ts`, in `src/data/texte/en/` und in den `en`-Feldern des Quellenkatalogs.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungs-URL, keine Werkzeugnamen. Nach jedem Commit prüfen: `git log --format=%B -1 | grep -ci 'co-authored\|session'` muss 0 ergeben. Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben).
- Branch `infopanel` (von `master`), **kein Worktree**: der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten mit einseitiger Abhängigkeit: `ui/` → `store/` → `render/` → `sim/`; `data/` reine Daten (darf `sim/types` importieren), `app/` Einstieg. `store/` importiert nichts aus `ui/`, `app/`, `render/`; `render/` nichts aus `ui/`; `data/` und `sim/` nichts aus React, Three oder DOM (ESLint-Regel). `ui/` darf `data/` und `sim/` lesen.
- Sichtbarer Text nur in `ui/i18n/de.ts`/`en.ts`. Genehmigte Ausnahmen dieser Etappe (Entwurf §4.1, §4.4): die Markdown-Texte unter `src/data/texte/` und die Feldpaare `titel.de`/`titel.en` im Quellenkatalog. Jeder neue Schlüssel wird in `de.ts` **und** `en.ts` zugleich angelegt (`i18n.test.ts` prüft Gleichheit der Schlüsselmengen und dass Englisch nicht kopiert ist; gleichlautende Werte in `GLEICH_ERLAUBT` eintragen).
- Neue Dateien vor dem ersten Import anlegen, sonst zeigt der laufende Vite-Server ein Fehler-Overlay.
- `import.meta.glob` liefert relative Schlüssel (`./de/gymnasium/objekt-earth.md`); in Tests läuft Vitest über Vite, das Glob funktioniert dort ebenso.
- Vor „fertig" je Task: `npm test`, `npm run lint`, `npx tsc -b` (Test und Lint prüfen keine Typen); am Ende `npm run build`.
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

## Dateistruktur

| Datei | Aufgabe |
|---|---|
| `src/sim/types.ts`, `src/data/bodies/*.ts` (35), `src/sim/rotation.test.ts` | `info.descriptionKey` entfällt (Task 1) |
| `src/sim/orbit.ts` (+ Test) | neu: `umlaufzeitTage` (Kepler III) |
| `src/data/themen.ts` (+ Test) | Niveaus, Themenkatalog `THEMEN` |
| `src/data/quellen.ts` (+ Test) | Quellenkatalog `QUELLEN`, Typ `Quelle` |
| `src/data/verweise.ts` (+ Test) | `verweisAufloesen(ziel)` gegen alle Kataloge |
| `src/data/texte/index.ts` (+ Test) | Textarten, `textVorhanden`, `ladeText`, `ladeMitAusweich`, `alleTextPfade` |
| `src/data/texte/{de,en}/{grundschule,gymnasium}/*.md` | 14 Textdateien dieser Etappe |
| `src/data/texte/dateien.test.ts` | prüft alle Textdateien: Muster, Überschrift, Verweise, Wortzahl, Sprachpaare |
| `src/store/types.ts`, `src/store/index.ts` | Zweig `ui.info`, Aktion `setInfo`, Grenzkonstanten |
| `src/store/pruefer.ts` (+ Test) | Aufzählung Niveau, Bereiche Breite/Teilung, Thema gegen Katalog |
| `src/store/persist.ts` (+ Test) | Link ohne Breite/Teilung/Thema; Zurücksetzen behält Niveau und Größen |
| `src/ui/format.ts` (+ Test) | neu: `formatAbstand`, `formatMasse` |
| `src/ui/kamerafahrt.ts` (+ Test) | `fahreZu`, `fahrtAbbrechen`, `fokusAbstand` |
| `src/ui/panels/BodyTree.tsx` | nutzt `fahreZu` |
| `src/ui/info/markdown.ts` (+ Test) | `parseMarkdown`, `parseInline`, `titelVon` |
| `src/ui/info/Markdown.tsx` (+ Test) | React-Ausgabe mit Verweisen |
| `src/ui/info/verweisAusfuehren.ts` (+ Test) | Wirkung eines Verweises auf Store, Kamera, Kino |
| `src/ui/info/datenblock.ts` (+ Test) | `datenzeilen(body, niveau, jd, index)` |
| `src/ui/info/useLiveJd.ts` | getaktete Zeit (250 ms) |
| `src/ui/info/Datenblock.tsx` | Anzeige der Zeilen samt Warnsatz |
| `src/ui/info/Quellenkarten.tsx` (+ Test) | Karten unten, Gruppierung, Hervorhebung |
| `src/ui/info/aktuellerText.ts` (+ Test) | welche Kennung gerade gilt |
| `src/ui/info/Griff.tsx` (+ Test) | Trenn-/Breitengriff mit Maus und Tastatur |
| `src/ui/info/InfoPanel.tsx` (+ Test) | Spalte: Kopf, Tabs, Segmente, Laden mit Ausweich |
| `src/ui/App.tsx`, `src/index.css` | zweispaltiges Layout, schmale Bildschirme |
| `src/ui/shortcuts/useShortcuts.ts` (+ Test) | Taste `I` |
| `src/ui/i18n/de.ts`, `en.ts`, `i18n.test.ts` | neue Schlüssel `panel.info`, `info.*`, `thema.*`, `quelle.art.*`, `unit.*`, `shortcuts.info` |
| `docs/phase4c-etappe1-abnahme.md` (neu), `README.md` | Protokoll, Stand |

---

### Task 1: `descriptionKey` entfernen

**Dateien:**
- Ändern: `src/sim/types.ts` (Zeile `info: { nameKey: string; descriptionKey: string };`)
- Ändern: alle 35 Körperdateien unter `src/data/bodies/` (Zeile `info: { nameKey: '...', descriptionKey: '...' },`)
- Ändern: `src/sim/rotation.test.ts` (Fixture, Zeile 106)

**Schnittstellen:**
- Produziert: `Body.info` ist `{ nameKey: string }`. Kein späterer Task liest `descriptionKey`.

- [ ] **Schritt 1: Branch anlegen**

```bash
git checkout -b infopanel master
```

- [ ] **Schritt 2: Typ ändern** — in `src/sim/types.ts`:

```ts
  info: { nameKey: string };
```

- [ ] **Schritt 3: Körperdateien bereinigen** — in jeder der 35 Dateien den Teil `, descriptionKey: 'body.<id>.description'` aus der `info`-Zeile streichen. Mit einem Suchlauf geht das in einem Schritt (Muster: Komma, Leerzeichen, `descriptionKey:`, ein Wert in einfachen Anführungszeichen):

```bash
grep -rl descriptionKey src/data/bodies | xargs sed -i -E "s/, descriptionKey: '[^']*'//"
grep -rn descriptionKey src
```

Erwartet nach dem zweiten Befehl: nur noch `src/sim/rotation.test.ts`. Erwartete Form, z. B. in `earth.ts`: `info: { nameKey: 'body.earth.name' },`

- [ ] **Schritt 4: Fixture anpassen** — in `src/sim/rotation.test.ts` Zeile 106:

```ts
      info: { nameKey: 'x' },
```

- [ ] **Schritt 5: Prüfen**

Run: `npx tsc -b && npm test`
Expected: Typprüfung ohne Fehler, alle Tests grün (956).

- [ ] **Schritt 6: Commit**

```bash
git add src/sim/types.ts src/data/bodies src/sim/rotation.test.ts
git commit -m "Körper: ungenutztes Feld descriptionKey entfernt"
```

---

### Task 2: Themenkatalog und Store-Zweig `ui.info`

**Dateien:**
- Erstellen: `src/data/themen.ts`, `src/data/themen.test.ts`
- Ändern: `src/store/types.ts`, `src/store/index.ts`, `src/store/pruefer.ts`, `src/store/persist.ts`
- Test: `src/store/pruefer.test.ts`, `src/store/persist.test.ts` (Fälle anhängen)
- Ändern: `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` (Themen-Titel)

**Schnittstellen:**
- Produziert:
  - `export type Niveau = 'grundschule' | 'gymnasium' | 'hochschule'` und `export const NIVEAUS: readonly Niveau[]` in `src/data/themen.ts` (dort, weil `store/` sie braucht und `data/` die unterste Schicht ist).
  - `export interface Thema { id: string; titleKey: string }`, `export const THEMEN: readonly Thema[]`, `export function istThema(id: string): boolean`.
  - `AppState['ui']['info']` = `{ niveau: Niveau; breiteRem: number; teilung: number; thema: string | null }`.
  - Aktion `setInfo(patch: Partial<AppState['ui']['info']>): void` am Store.
  - Konstanten `INFO_BREITE_MIN_REM = 18`, `INFO_BREITE_MAX_REM = 200`, `INFO_TEILUNG_MIN = 0.2`, `INFO_TEILUNG_MAX = 0.9` in `src/store/types.ts` (Zwillinge der Griffgrenzen; `ui/` liest sie von dort).

- [ ] **Schritt 1: Themenkatalog anlegen** — `src/data/themen.ts`:

```ts
/** Niveaustufen der Erläuterungstexte (Entwurf 4c §2 Punkt 2). */
export type Niveau = 'grundschule' | 'gymnasium' | 'hochschule';
export const NIVEAUS: readonly Niveau[] = ['grundschule', 'gymnasium', 'hochschule'];

/**
 * Ein Thema ist ein Erläuterungstext ohne Körper und ohne Szene (Entwurf
 * §4.5). Der Titel steht als Sprachschlüssel in ui/i18n; der Text selbst
 * liegt unter data/texte als thema-<id>.md.
 */
export interface Thema { id: string; titleKey: string }

export const THEMEN: readonly Thema[] = [
  { id: 'finsternis', titleKey: 'thema.finsternis.title' },
  { id: 'ringe', titleKey: 'thema.ringe.title' },
  { id: 'gebundene-rotation', titleKey: 'thema.gebundene-rotation.title' },
  { id: 'kirkwood-luecken', titleKey: 'thema.kirkwood-luecken.title' },
  { id: 'achsneigung', titleKey: 'thema.achsneigung.title' },
  { id: 'zwergplaneten', titleKey: 'thema.zwergplaneten.title' },
  { id: 'bahnelemente', titleKey: 'thema.bahnelemente.title' },
  { id: 'modell', titleKey: 'thema.modell.title' },
];

export function istThema(id: string): boolean {
  return THEMEN.some((thema) => thema.id === id);
}
```

- [ ] **Schritt 2: Test für den Katalog** — `src/data/themen.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { THEMEN, NIVEAUS, istThema } from './themen';
import { de } from '../ui/i18n/de';

describe('Themenkatalog', () => {
  it('hat eindeutige Kennungen aus Kleinbuchstaben, Ziffern und Bindestrich', () => {
    const ids = THEMEN.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('hat für jedes Thema einen Titelschlüssel', () => {
    for (const thema of THEMEN) {
      expect(de, `fehlt: ${thema.titleKey}`).toHaveProperty(thema.titleKey);
    }
  });

  it('kennt drei Niveaus und erkennt Themen', () => {
    expect(NIVEAUS).toEqual(['grundschule', 'gymnasium', 'hochschule']);
    expect(istThema('modell')).toBe(true);
    expect(istThema('gibt-es-nicht')).toBe(false);
  });
});
```

Der Testimport aus `ui/i18n/de` ist erlaubt (Testdateien sind vom Schichtentest ausgenommen; `data/index.test.ts` macht es genauso).

- [ ] **Schritt 3: Sprachschlüssel für Themen** — ans Ende der Tabellen, vor `} as const;`:

`de.ts`:
```ts
  'thema.finsternis.title': 'Finsternisse',
  'thema.ringe.title': 'Ringsysteme',
  'thema.gebundene-rotation.title': 'Gebundene Rotation',
  'thema.kirkwood-luecken.title': 'Kirkwood-Lücken',
  'thema.achsneigung.title': 'Achsneigung',
  'thema.zwergplaneten.title': 'Zwergplaneten',
  'thema.bahnelemente.title': 'Bahnelemente',
  'thema.modell.title': 'Grenzen des Modells',
```

`en.ts`:
```ts
  'thema.finsternis.title': 'Eclipses',
  'thema.ringe.title': 'Ring systems',
  'thema.gebundene-rotation.title': 'Tidal locking',
  'thema.kirkwood-luecken.title': 'Kirkwood gaps',
  'thema.achsneigung.title': 'Axial tilt',
  'thema.zwergplaneten.title': 'Dwarf planets',
  'thema.bahnelemente.title': 'Orbital elements',
  'thema.modell.title': 'Limits of the model',
```

- [ ] **Schritt 4: Test laufen lassen**

Run: `npx vitest run src/data/themen.test.ts`
Expected: PASS (3 Tests).

- [ ] **Schritt 5: Fehlschlagende Tests für Prüfer und Profile anhängen**

Ans Ende von `src/store/pruefer.test.ts`:

```ts
describe('pruefeZustand: ui.info', () => {
  it('nimmt Niveau, Breite, Teilung und ein bekanntes Thema', () => {
    expect(pruefeZustand({
      ui: { info: { niveau: 'hochschule', breiteRem: 30, teilung: 0.5, thema: 'modell' } },
    })).toEqual({ ui: { info: { niveau: 'hochschule', breiteRem: 30, teilung: 0.5, thema: 'modell' } } });
  });

  it('verwirft unbekanntes Niveau, Werte außerhalb der Bereiche und unbekannte Themen feldweise', () => {
    expect(pruefeZustand({
      ui: { info: { niveau: 'kita', breiteRem: 5, teilung: 1.5, thema: 'gibt-es-nicht' } },
    })).toEqual({});
    expect(pruefeZustand({ ui: { info: { thema: null, breiteRem: 18 } } }))
      .toEqual({ ui: { info: { thema: null, breiteRem: 18 } } });
    expect(pruefeZustand({ ui: { info: { thema: 7 } } })).toEqual({});
  });
});
```

Ans Ende von `src/store/persist.test.ts` (Importe `filtereProfil`, `zurueckgesetzt`, `DEFAULT_STATE` sind dort schon vorhanden; sonst ergänzen):

```ts
describe('ui.info in den Profilen', () => {
  it('link behält das Niveau, streicht Breite, Teilung und Thema', () => {
    expect(filtereProfil({
      ui: { info: { niveau: 'grundschule', breiteRem: 30, teilung: 0.4, thema: 'modell' } },
    }, 'link')).toEqual({ ui: { info: { niveau: 'grundschule' } } });
    expect(filtereProfil({ ui: { info: { breiteRem: 30 } } }, 'link')).toEqual({});
  });

  it('zurueckgesetzt behält Niveau, Breite und Teilung, löscht das Thema', () => {
    const aktuell = structuredClone(DEFAULT_STATE);
    aktuell.ui.info = { niveau: 'hochschule', breiteRem: 40, teilung: 0.3, thema: 'modell' };
    aktuell.scale.sizeScale = 3;
    const s = zurueckgesetzt(aktuell);
    expect(s.ui.info).toEqual({ niveau: 'hochschule', breiteRem: 40, teilung: 0.3, thema: null });
    expect(s.scale.sizeScale).toBe(DEFAULT_STATE.scale.sizeScale);
  });
});
```

Run: `npx vitest run src/store`
Expected: FAIL (Typfehler bzw. `ui.info` fällt komplett weg, weil `DEFAULT_STATE.ui` das Feld nicht kennt).

- [ ] **Schritt 6: Typen und Standardwerte** — in `src/store/types.ts` oben importieren und Konstanten ergänzen:

```ts
import type { Niveau } from '../data/themen';

/**
 * Grenzen des Infopanels (Entwurf 4c §3.2, §4.6). Zwillinge der Griffe in
 * ui/info/Griff.tsx und der Bereiche in store/pruefer.ts. Die Obergrenze
 * der Breite ist absichtlich weit; die wirksame Obergrenze (60 % der
 * Fensterbreite) rechnet das Panel selbst aus.
 */
export const INFO_BREITE_MIN_REM = 18;
export const INFO_BREITE_MAX_REM = 200;
export const INFO_TEILUNG_MIN = 0.2;
export const INFO_TEILUNG_MAX = 0.9;
```

und in `AppState.ui`:

```ts
  ui: {
    hidden: boolean;
    panels: Record<string, boolean>;
    /** Muss mit `Sprache` in ui/i18n/index.ts übereinstimmen; i18n.test.ts prüft die Tabellen. */
    language: 'de' | 'en';
    /**
     * Infopanel (Entwurf 4c §4.6): Niveaustufe der Texte, Breite der
     * rechten Spalte in rem, Anteil des oberen Segments (0,2 bis 0,9) und
     * ein per Verweis gewähltes Thema, das bis zum nächsten Ziel- oder
     * Szenenwechsel den Text stellt.
     */
    info: { niveau: Niveau; breiteRem: number; teilung: number; thema: string | null };
  };
```

In `src/store/index.ts` den Standard erweitern (Klappzustand `info` bewusst **nicht** in `panels`: Das Panel liest `panels.info ?? !schmal`, siehe Task 11):

```ts
  ui: {
    hidden: false,
    panels: { time: true, scale: true, camera: true, tree: true },
    language: 'de',
    info: { niveau: 'gymnasium', breiteRem: 24, teilung: 0.65, thema: null },
  },
```

Aktion ergänzen (Interface `Actions` und Implementierung):

```ts
  setInfo(patch: Partial<AppState['ui']['info']>): void;
```
```ts
  setInfo: (p) => set((s) => ({ ui: { ...s.ui, info: { ...s.ui.info, ...p } } })),
```

- [ ] **Schritt 7: Prüfer erweitern** — in `src/store/pruefer.ts`:

Import ergänzen:
```ts
import { istThema, NIVEAUS } from '../data/themen';
import { INFO_BREITE_MAX_REM, INFO_BREITE_MIN_REM, INFO_TEILUNG_MAX, INFO_TEILUNG_MIN } from './types';
```

In `AUFZAEHLUNGEN`:
```ts
  'ui.info.niveau': NIVEAUS,
```

In `NULLBAR`:
```ts
  'ui.info.thema': 'string',
```

In `BEREICHE`:
```ts
  'ui.info.breiteRem': [INFO_BREITE_MIN_REM, INFO_BREITE_MAX_REM],
  'ui.info.teilung': [INFO_TEILUNG_MIN, INFO_TEILUNG_MAX],
```

In `pruefeFeld` direkt nach dem Block für `camera.targetId`:
```ts
  if (pfad === 'ui.info.thema') {
    return typeof wert === 'string' && istThema(wert) ? wert : VERWORFEN;
  }
```

- [ ] **Schritt 8: Profile** — in `src/store/persist.ts`:

```ts
const GESTRICHEN: Readonly<Record<Profil, readonly string[]>> = {
  // Breite und Teilung hängen am Bildschirm, das Thema an der Sitzung
  // (Entwurf 4c §4.6); nur das Niveau reist im Link mit.
  link: ['quality', 'ui.hidden', 'ui.panels', 'ui.info.breiteRem', 'ui.info.teilung', 'ui.info.thema'],
  sitzung: [],
  ansicht: ['time.jd', 'time.paused', 'cinema', 'quality', 'ui'],
};
```

und `zurueckgesetzt`:

```ts
/**
 * Standardzustand, aber Sprache, Qualitätsstufe und die Vorlieben des
 * Infopanels (Niveau, Breite, Teilung) des aktuellen Zustands bleiben; ein
 * gewähltes Thema fällt weg wie jede andere Ansichtseinstellung.
 */
export function zurueckgesetzt(aktuell: AppState): AppState {
  const s = structuredClone(DEFAULT_STATE);
  s.ui.language = aktuell.ui.language;
  s.quality.tier = aktuell.quality.tier;
  s.ui.info = { ...aktuell.ui.info, thema: null };
  return s;
}
```

- [ ] **Schritt 9: Prüfen**

Run: `npx tsc -b && npm test && npm run lint`
Expected: alles grün. Falls ein bestehender Test den kompletten `ui`-Zweig vergleicht (etwa der `zurueckgesetzt`-Test in `persist.test.ts` um Zeile 109), dessen Erwartung um `info` ergänzen — der Standardwert ist `{ niveau: 'gymnasium', breiteRem: 24, teilung: 0.65, thema: null }`.

- [ ] **Schritt 10: Commit**

```bash
git add src/data/themen.ts src/data/themen.test.ts src/store src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Infopanel: Themenkatalog, Store-Zweig ui.info mit Prüfer und Profilen"
```

---

### Task 3: Quellenkatalog

**Dateien:**
- Erstellen: `src/data/quellen.ts`, `src/data/quellen.test.ts`
- Ändern: `src/ui/i18n/de.ts`, `en.ts` (Schlüssel `quelle.art.*`, `quelle.herausgeber.sonstige`)

**Schnittstellen:**
- Konsumiert: `SCENES` aus `data/scenes.ts`, `bodyIndex` aus `data/index.ts`, `istThema` aus `data/themen.ts` (nur im Test).
- Produziert: `export type Sprache = 'de' | 'en'` (in `data/texte/index.ts` erst ab Task 5; hier vorläufig **in `quellen.ts` definiert und exportiert**, Task 5 importiert ihn von dort), `export type QuellenArt`, `export type Herausgeber`, `export interface Quelle`, `export const QUELLEN: readonly Quelle[]`, `export function quelleFinden(id: string): Quelle | undefined`, `export function quellenFuer(kennung: string): Quelle[]` (gefiltert und sortiert, Entwurf §4.4), `export const QUELLEN_ART_REIHENFOLGE`.

- [ ] **Schritt 1: Fehlschlagenden Test schreiben** — `src/data/quellen.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { QUELLEN, quellenFuer, quelleFinden, QUELLEN_ART_REIHENFOLGE } from './quellen';
import { bodyIndex } from './index';
import { SCENES } from './scenes';
import { istThema } from './themen';

describe('Quellenkatalog', () => {
  it('hat eindeutige Kennungen und nur https-Adressen', () => {
    const ids = QUELLEN.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of QUELLEN) {
      expect(q.id).toMatch(/^[a-z0-9-]+$/);
      expect(q.url, q.id).toMatch(/^https:\/\//);
      expect(q.titel.de.length, q.id).toBeGreaterThan(0);
      expect(q.titel.en.length, q.id).toBeGreaterThan(0);
      expect(q.fuer.length, q.id).toBeGreaterThan(0);
    }
  });

  it('verweist nur auf bekannte Körper, Szenen und Themen', () => {
    for (const q of QUELLEN) {
      for (const ziel of q.fuer) {
        const [art, kennung] = ziel.split(':');
        expect(kennung, `${q.id}: ${ziel}`).toBeTruthy();
        const bekannt = art === 'objekt' ? Object.hasOwn(bodyIndex, kennung ?? '')
          : art === 'szene' ? SCENES.some((s) => s.id === kennung)
            : art === 'thema' ? istThema(kennung ?? '')
              : false;
        expect(bekannt, `${q.id}: ${ziel}`).toBe(true);
      }
    }
  });

  it('liefert zu einer Kennung die passenden Quellen, nach Art und dann Sprache sortiert', () => {
    const liste = quellenFuer('objekt:earth');
    expect(liste.length).toBeGreaterThan(2);
    const raenge = liste.map((q) => QUELLEN_ART_REIHENFOLGE.indexOf(q.art));
    expect(raenge).toEqual([...raenge].sort((a, b) => a - b));
    expect(liste.every((q) => q.fuer.includes('objekt:earth'))).toBe(true);
    expect(quellenFuer('objekt:gibt-es-nicht')).toEqual([]);
  });

  it('findet eine Quelle über ihre Kennung', () => {
    expect(quelleFinden('nssdc-earth')?.herausgeber).toBe('NASA');
    expect(quelleFinden('nope')).toBeUndefined();
  });
});
```

Run: `npx vitest run src/data/quellen.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 2: Katalog anlegen** — `src/data/quellen.ts`:

```ts
/** Sprache der Oberfläche und der Texte; strukturgleich mit `Sprache` in ui/i18n. */
export type Sprache = 'de' | 'en';

export type QuellenArt = 'faktenblatt' | 'uebersicht' | 'bildarchiv' | 'werkzeug' | 'fachartikel';
export type Herausgeber = 'NASA' | 'JPL' | 'ESA' | 'IAU' | 'Wikipedia' | 'sonstige';

/**
 * Eine öffentliche Quelle (Entwurf 4c §4.4). Keine wird eingebettet — jede
 * öffnet im neuen Tab (Entscheidung Jens, 14.09.2026; NASA und JPL
 * verbieten das Einbetten ohnehin per X-Frame-Options). `fuer` nennt die
 * Text-Kennungen, zu denen die Quelle unten als Karte erscheint.
 */
export interface Quelle {
  id: string;
  titel: { de: string; en: string };
  herausgeber: Herausgeber;
  url: string;
  /** Sprache der Zielseite. */
  sprache: Sprache;
  art: QuellenArt;
  /** Kennungen wie 'objekt:earth', 'szene:mondfinsternis', 'thema:finsternis'. */
  fuer: string[];
}

/** Reihenfolge der Gruppen im unteren Segment. */
export const QUELLEN_ART_REIHENFOLGE: readonly QuellenArt[] = [
  'faktenblatt', 'uebersicht', 'bildarchiv', 'werkzeug', 'fachartikel',
];

export const QUELLEN: readonly Quelle[] = [
  // --- Faktenblätter ---
  {
    id: 'nssdc-earth',
    titel: { de: 'Erde: Faktenblatt (NSSDC)', en: 'Earth Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
    fuer: ['objekt:earth'],
  },
  {
    id: 'nssdc-moon',
    titel: { de: 'Mond: Faktenblatt (NSSDC)', en: 'Moon Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
    fuer: ['objekt:moon', 'szene:mondfinsternis'],
  },
  {
    id: 'nssdc-saturn',
    titel: { de: 'Saturn: Faktenblatt (NSSDC)', en: 'Saturn Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'nssdc-factsheets',
    titel: { de: 'Faktenblätter aller Planeten (NSSDC)', en: 'Planetary Fact Sheets (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
    fuer: ['thema:modell', 'objekt:sun'],
  },
  // --- Übersichten ---
  {
    id: 'nasa-earth',
    titel: { de: 'Erde bei NASA Science', en: 'Earth at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/earth/',
    fuer: ['objekt:earth'],
  },
  {
    id: 'nasa-saturn',
    titel: { de: 'Saturn bei NASA Science', en: 'Saturn at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/saturn/',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'nasa-moon',
    titel: { de: 'Mond bei NASA Science', en: 'Moon at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/moon/',
    fuer: ['objekt:moon', 'szene:mondfinsternis'],
  },
  {
    id: 'nasa-cassini',
    titel: { de: 'Mission Cassini (NASA)', en: 'Cassini mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/cassini/',
    fuer: ['objekt:saturn', 'objekt:titan', 'objekt:enceladus', 'thema:ringe'],
  },
  {
    id: 'esa-cassini-huygens',
    titel: { de: 'Cassini-Huygens (ESA)', en: 'Cassini-Huygens (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens',
    fuer: ['objekt:saturn', 'objekt:titan'],
  },
  {
    id: 'esa-erdbeobachtung',
    titel: { de: 'Erdbeobachtung (ESA)', en: 'Observing the Earth (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Applications/Observing_the_Earth',
    fuer: ['objekt:earth'],
  },
  {
    id: 'nasa-eclipse',
    titel: { de: 'NASA Eclipse Web Site: Mondfinsternisse', en: 'NASA Eclipse Web Site: Lunar Eclipses' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://eclipse.gsfc.nasa.gov/lunar.html',
    fuer: ['szene:mondfinsternis', 'thema:finsternis'],
  },
  {
    id: 'wikipedia-de-erde',
    titel: { de: 'Erde (Wikipedia)', en: 'Earth (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Erde',
    fuer: ['objekt:earth'],
  },
  {
    id: 'wikipedia-en-earth',
    titel: { de: 'Earth (englische Wikipedia)', en: 'Earth (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Earth',
    fuer: ['objekt:earth'],
  },
  {
    id: 'wikipedia-de-saturn',
    titel: { de: 'Saturn (Wikipedia)', en: 'Saturn (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Saturn_(Planet)',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'wikipedia-en-saturn',
    titel: { de: 'Saturn (englische Wikipedia)', en: 'Saturn (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Saturn',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'wikipedia-de-mondfinsternis',
    titel: { de: 'Mondfinsternis (Wikipedia)', en: 'Lunar eclipse (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Mondfinsternis',
    fuer: ['szene:mondfinsternis', 'thema:finsternis'],
  },
  {
    id: 'wikipedia-en-lunar-eclipse',
    titel: { de: 'Lunar eclipse (englische Wikipedia)', en: 'Lunar eclipse (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Lunar_eclipse',
    fuer: ['szene:mondfinsternis', 'thema:finsternis'],
  },
  // --- Bildarchive ---
  {
    id: 'jpl-photojournal-earth',
    titel: { de: 'Photojournal: Erde (JPL)', en: 'Photojournal: Earth (JPL)' },
    herausgeber: 'JPL', sprache: 'en', art: 'bildarchiv',
    url: 'https://photojournal.jpl.nasa.gov/target/Earth',
    fuer: ['objekt:earth'],
  },
  {
    id: 'jpl-photojournal-saturn',
    titel: { de: 'Photojournal: Saturn (JPL)', en: 'Photojournal: Saturn (JPL)' },
    herausgeber: 'JPL', sprache: 'en', art: 'bildarchiv',
    url: 'https://photojournal.jpl.nasa.gov/target/Saturn',
    fuer: ['objekt:saturn', 'thema:ringe'],
  },
  // --- Werkzeuge ---
  {
    id: 'nasa-eyes',
    titel: { de: 'NASA Eyes on the Solar System', en: 'NASA Eyes on the Solar System' },
    herausgeber: 'NASA', sprache: 'en', art: 'werkzeug',
    url: 'https://eyes.nasa.gov/apps/solar-system/',
    fuer: ['objekt:sun', 'objekt:earth', 'objekt:saturn', 'thema:modell'],
  },
  {
    id: 'jpl-horizons',
    titel: { de: 'JPL Horizons (Ephemeriden)', en: 'JPL Horizons (ephemerides)' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    fuer: ['thema:modell', 'thema:bahnelemente'],
  },
  // --- Fachliches ---
  {
    id: 'jpl-approx-pos',
    titel: { de: 'Näherungsbahnen der Planeten (JPL SSD)', en: 'Approximate Positions of the Planets (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'fachartikel',
    url: 'https://ssd.jpl.nasa.gov/planets/approx_pos.html',
    fuer: ['thema:modell', 'thema:bahnelemente', 'objekt:earth', 'objekt:saturn'],
  },
  {
    id: 'iau-rotation',
    titel: {
      de: 'IAU-Bericht über Rotationselemente (Archinal et al. 2018)',
      en: 'IAU report on rotational elements (Archinal et al. 2018)',
    },
    herausgeber: 'IAU', sprache: 'en', art: 'fachartikel',
    url: 'https://doi.org/10.1007/s10569-017-9805-5',
    fuer: ['thema:modell', 'thema:achsneigung'],
  },
  {
    id: 'pds-rings',
    titel: { de: 'PDS Ring-Moon Systems Node', en: 'PDS Ring-Moon Systems Node' },
    herausgeber: 'sonstige', sprache: 'en', art: 'fachartikel',
    url: 'https://pds-rings.seti.org/',
    fuer: ['objekt:saturn', 'thema:ringe'],
  },
];

export function quelleFinden(id: string): Quelle | undefined {
  return QUELLEN.find((q) => q.id === id);
}

/**
 * Quellen zu einer Text-Kennung, gruppiert nach Art (Reihenfolge oben) und
 * innerhalb der Gruppe zuerst die Seiten in der gewünschten Sprache. Ohne
 * Sprachwunsch bleibt die Katalogreihenfolge.
 */
export function quellenFuer(kennung: string, bevorzugt: Sprache | null = null): Quelle[] {
  return QUELLEN
    .filter((q) => q.fuer.includes(kennung))
    .sort((a, b) => {
      const rang = QUELLEN_ART_REIHENFOLGE.indexOf(a.art) - QUELLEN_ART_REIHENFOLGE.indexOf(b.art);
      if (rang !== 0 || bevorzugt === null) return rang;
      return Number(b.sprache === bevorzugt) - Number(a.sprache === bevorzugt);
    });
}
```

- [ ] **Schritt 3: Sprachschlüssel** — `de.ts`:

```ts
  'quelle.art.faktenblatt': 'Faktenblatt',
  'quelle.art.uebersicht': 'Übersicht',
  'quelle.art.bildarchiv': 'Bildarchiv',
  'quelle.art.werkzeug': 'Werkzeug',
  'quelle.art.fachartikel': 'Fachliches',
  'quelle.herausgeber.sonstige': 'Weitere',
```

`en.ts`:

```ts
  'quelle.art.faktenblatt': 'Fact sheet',
  'quelle.art.uebersicht': 'Overview',
  'quelle.art.bildarchiv': 'Image archive',
  'quelle.art.werkzeug': 'Tool',
  'quelle.art.fachartikel': 'Technical',
  'quelle.herausgeber.sonstige': 'Other',
```

- [ ] **Schritt 4: Prüfen**

Run: `npx vitest run src/data src/ui/i18n && npx tsc -b`
Expected: PASS.

- [ ] **Schritt 5: Commit**

```bash
git add src/data/quellen.ts src/data/quellen.test.ts src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Infopanel: Quellenkatalog mit 24 Einträgen"
```

---

### Task 4: Verweisauflösung

**Dateien:**
- Erstellen: `src/data/verweise.ts`, `src/data/verweise.test.ts`

**Schnittstellen:**
- Konsumiert: `bodyIndex`, `SCENES`, `istThema`, `quelleFinden`.
- Produziert:
  ```ts
  export type Verweis =
    | { art: 'objekt' | 'szene' | 'thema'; kennung: string }
    | { art: 'quelle'; quelle: Quelle }
    | { art: 'extern'; url: string };
  export function verweisAufloesen(ziel: string): Verweis | null;
  export function textKennungGueltig(art: string, kennung: string): boolean;
  ```
  Task 5 (Dateitest), Task 9 (Markdown-Komponente) und Task 10 nutzen sie.

- [ ] **Schritt 1: Fehlschlagenden Test schreiben** — `src/data/verweise.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { verweisAufloesen, textKennungGueltig } from './verweise';

describe('verweisAufloesen', () => {
  it('löst die vier internen Schemata gegen die Kataloge auf', () => {
    expect(verweisAufloesen('objekt:earth')).toEqual({ art: 'objekt', kennung: 'earth' });
    expect(verweisAufloesen('szene:mondfinsternis')).toEqual({ art: 'szene', kennung: 'mondfinsternis' });
    expect(verweisAufloesen('thema:modell')).toEqual({ art: 'thema', kennung: 'modell' });
    const quelle = verweisAufloesen('quelle:nssdc-earth');
    expect(quelle?.art).toBe('quelle');
    if (quelle?.art === 'quelle') expect(quelle.quelle.id).toBe('nssdc-earth');
  });

  it('nimmt https-Adressen als extern, sonst nichts', () => {
    expect(verweisAufloesen('https://example.org/a(b)')).toEqual({ art: 'extern', url: 'https://example.org/a(b)' });
    expect(verweisAufloesen('http://example.org')).toBeNull();
    expect(verweisAufloesen('javascript:alert(1)')).toBeNull();
    expect(verweisAufloesen('mailto:x@y.z')).toBeNull();
  });

  it('liefert null für unbekannte Kennungen und Schemata', () => {
    expect(verweisAufloesen('objekt:vulcan')).toBeNull();
    expect(verweisAufloesen('szene:nope')).toBeNull();
    expect(verweisAufloesen('thema:nope')).toBeNull();
    expect(verweisAufloesen('quelle:nope')).toBeNull();
    expect(verweisAufloesen('planet:earth')).toBeNull();
    expect(verweisAufloesen('objekt:')).toBeNull();
    expect(verweisAufloesen('')).toBeNull();
  });

  it('textKennungGueltig prüft Art und Kennung einer Textdatei', () => {
    expect(textKennungGueltig('objekt', 'saturn')).toBe(true);
    expect(textKennungGueltig('szene', 'erdaufgang')).toBe(true);
    expect(textKennungGueltig('thema', 'ringe')).toBe(true);
    expect(textKennungGueltig('quelle', 'nssdc-earth')).toBe(false);
    expect(textKennungGueltig('objekt', 'nope')).toBe(false);
  });
});
```

Run: `npx vitest run src/data/verweise.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 2: Implementieren** — `src/data/verweise.ts`:

```ts
import { bodyIndex } from './index';
import { SCENES } from './scenes';
import { istThema } from './themen';
import { quelleFinden } from './quellen';
import type { Quelle } from './quellen';

/**
 * Ein aufgelöster Verweis aus einem Erläuterungstext (Entwurf 4c §4.3).
 * Die Auflösung prüft gegen die Kataloge, damit ein Tippfehler in einer
 * Textdatei nie einen toten Knopf erzeugt — unbekannte Ziele werden vom
 * Renderer als schlichter Text gezeigt, und der Dateitest lässt sie
 * durchfallen.
 */
export type Verweis =
  | { art: 'objekt' | 'szene' | 'thema'; kennung: string }
  | { art: 'quelle'; quelle: Quelle }
  | { art: 'extern'; url: string };

export function textKennungGueltig(art: string, kennung: string): boolean {
  if (kennung === '') return false;
  switch (art) {
    case 'objekt': return Object.hasOwn(bodyIndex, kennung);
    case 'szene': return SCENES.some((s) => s.id === kennung);
    case 'thema': return istThema(kennung);
    default: return false;
  }
}

export function verweisAufloesen(ziel: string): Verweis | null {
  if (ziel.startsWith('https://')) return { art: 'extern', url: ziel };
  const trenner = ziel.indexOf(':');
  if (trenner <= 0) return null;
  const art = ziel.slice(0, trenner);
  const kennung = ziel.slice(trenner + 1);
  if (art === 'quelle') {
    const quelle = quelleFinden(kennung);
    return quelle === undefined ? null : { art: 'quelle', quelle };
  }
  if (art !== 'objekt' && art !== 'szene' && art !== 'thema') return null;
  return textKennungGueltig(art, kennung) ? { art, kennung } : null;
}
```

- [ ] **Schritt 3: Prüfen und committen**

Run: `npx vitest run src/data && npx tsc -b && npm run lint`
Expected: PASS.

```bash
git add src/data/verweise.ts src/data/verweise.test.ts
git commit -m "Infopanel: Verweisauflösung gegen Körper, Szenen, Themen und Quellen"
```

---

### Task 5: Textlader und die ersten 14 Texte

**Dateien:**
- Erstellen: `src/data/texte/index.ts`, `src/data/texte/index.test.ts`, `src/data/texte/dateien.test.ts`
- Erstellen: 14 Markdown-Dateien (Liste in Schritt 3)

**Schnittstellen:**
- Konsumiert: `Niveau` aus `data/themen.ts`, `Sprache` aus `data/quellen.ts`, `verweisAufloesen`/`textKennungGueltig` (nur im Test).
- Produziert:
  ```ts
  export type TextArt = 'objekt' | 'szene' | 'thema';
  export interface TextKennung { art: TextArt; kennung: string }
  export function textSchluessel(k: TextKennung): string;            // 'objekt:earth'
  export function textPfad(sprache: Sprache, niveau: Niveau, k: TextKennung): string;
  export function textVorhanden(sprache: Sprache, niveau: Niveau, k: TextKennung): boolean;
  export function alleTextPfade(): readonly string[];
  export function ladeText(sprache: Sprache, niveau: Niveau, k: TextKennung): Promise<string | null>;
  export function ausweichKandidaten(sprache: Sprache, niveau: Niveau): readonly (readonly [Sprache, Niveau])[];
  export interface GeladenerText { text: string; niveau: Niveau; sprache: Sprache }
  export function ladeMitAusweich(sprache: Sprache, niveau: Niveau, k: TextKennung): Promise<GeladenerText | null>;
  ```

- [ ] **Schritt 1: Fehlschlagenden Test für den Lader** — `src/data/texte/index.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  alleTextPfade, ausweichKandidaten, ladeMitAusweich, ladeText, textPfad, textSchluessel, textVorhanden,
} from './index';

const erde = { art: 'objekt', kennung: 'earth' } as const;

describe('Textlader', () => {
  it('bildet Pfad und Schlüssel', () => {
    expect(textPfad('de', 'gymnasium', erde)).toBe('./de/gymnasium/objekt-earth.md');
    expect(textSchluessel(erde)).toBe('objekt:earth');
  });

  it('kennt vorhandene Dateien synchron und lädt sie asynchron', async () => {
    expect(alleTextPfade().length).toBeGreaterThanOrEqual(14);
    expect(textVorhanden('de', 'gymnasium', erde)).toBe(true);
    expect(textVorhanden('de', 'hochschule', erde)).toBe(false);
    const text = await ladeText('de', 'gymnasium', erde);
    expect(text?.startsWith('# ')).toBe(true);
    expect(await ladeText('de', 'hochschule', erde)).toBeNull();
    // Zweiter Aufruf kommt aus dem Speicher und ist dieselbe Zeichenkette.
    expect(await ladeText('de', 'gymnasium', erde)).toBe(text);
  });

  it('weicht in fester Reihenfolge aus', () => {
    expect(ausweichKandidaten('de', 'gymnasium')).toEqual([['de', 'gymnasium']]);
    expect(ausweichKandidaten('de', 'hochschule')).toEqual([['de', 'hochschule'], ['de', 'gymnasium']]);
    expect(ausweichKandidaten('en', 'grundschule')).toEqual([['en', 'grundschule'], ['de', 'grundschule']]);
    expect(ausweichKandidaten('en', 'hochschule')).toEqual([
      ['en', 'hochschule'], ['en', 'gymnasium'], ['de', 'hochschule'], ['de', 'gymnasium'],
    ]);
  });

  it('ladeMitAusweich meldet, welches Niveau und welche Sprache es genommen hat', async () => {
    const direkt = await ladeMitAusweich('en', 'grundschule', erde);
    expect(direkt?.sprache).toBe('en');
    expect(direkt?.niveau).toBe('grundschule');
    const hochschule = await ladeMitAusweich('en', 'hochschule', erde);
    expect(hochschule?.niveau).toBe('gymnasium');
    expect(hochschule?.sprache).toBe('en');
    expect(await ladeMitAusweich('de', 'gymnasium', { art: 'objekt', kennung: 'pluto' })).toBeNull();
  });
});
```

Run: `npx vitest run src/data/texte/index.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 2: Lader anlegen** — `src/data/texte/index.ts`:

```ts
import type { Niveau } from '../themen';
import type { Sprache } from '../quellen';

export type TextArt = 'objekt' | 'szene' | 'thema';
export interface TextKennung { art: TextArt; kennung: string }

/**
 * Alle Erläuterungstexte, faul geladen (Entwurf 4c §4.1): Das Glob ohne
 * `eager` liefert je Datei eine Ladefunktion; erst der Aufruf holt den
 * Text, danach hält ihn der Speicher. So bleibt der Hauptbundle klein,
 * und eine neue Textdatei braucht keine Codeänderung.
 */
const dateien = import.meta.glob('./*/*/*.md', {
  query: '?raw', import: 'default',
}) as Record<string, () => Promise<string>>;

const speicher = new Map<string, string>();

export function textSchluessel(k: TextKennung): string {
  return `${k.art}:${k.kennung}`;
}

export function textPfad(sprache: Sprache, niveau: Niveau, k: TextKennung): string {
  return `./${sprache}/${niveau}/${k.art}-${k.kennung}.md`;
}

export function textVorhanden(sprache: Sprache, niveau: Niveau, k: TextKennung): boolean {
  return Object.hasOwn(dateien, textPfad(sprache, niveau, k));
}

export function alleTextPfade(): readonly string[] {
  return Object.keys(dateien);
}

export async function ladeText(sprache: Sprache, niveau: Niveau, k: TextKennung): Promise<string | null> {
  const pfad = textPfad(sprache, niveau, k);
  const lader = dateien[pfad];
  if (lader === undefined) return null;
  const bekannt = speicher.get(pfad);
  if (bekannt !== undefined) return bekannt;
  const text = await lader();
  speicher.set(pfad, text);
  return text;
}

/**
 * Ausweichreihenfolge (Entwurf §3.5): gewünschte Kombination; fehlt der
 * Hochschultext, der Gymnasialtext derselben Sprache; fehlt die Sprache,
 * Deutsch in derselben Staffelung.
 */
export function ausweichKandidaten(sprache: Sprache, niveau: Niveau): readonly (readonly [Sprache, Niveau])[] {
  const stufen: Niveau[] = niveau === 'hochschule' ? ['hochschule', 'gymnasium'] : [niveau];
  const sprachen: Sprache[] = sprache === 'de' ? ['de'] : [sprache, 'de'];
  return sprachen.flatMap((s) => stufen.map((n) => [s, n] as const));
}

export interface GeladenerText { text: string; niveau: Niveau; sprache: Sprache }

export async function ladeMitAusweich(
  sprache: Sprache, niveau: Niveau, k: TextKennung,
): Promise<GeladenerText | null> {
  for (const [s, n] of ausweichKandidaten(sprache, niveau)) {
    const text = await ladeText(s, n, k);
    if (text !== null) return { text, niveau: n, sprache: s };
  }
  return null;
}
```

- [ ] **Schritt 3: Die 14 Textdateien anlegen** — Ordner `src/data/texte/de/grundschule/`, `de/gymnasium/`, `en/grundschule/`, `en/gymnasium/`. Inhalte wörtlich übernehmen (Zeilenumbrüche innerhalb eines Absatzes sind erlaubt, der Parser fügt sie zu einem Absatz zusammen).

`de/grundschule/objekt-earth.md`:
```markdown
# Die Erde

Die Erde ist unser Zuhause. Sie ist der dritte Planet von der [Sonne](objekt:sun) aus
und der einzige, auf dem wir Meere, Wolken und Leben kennen. Ein Jahr dauert einen
Umlauf um die Sonne, ein Tag eine Drehung um sich selbst. Der [Mond](objekt:moon)
begleitet die Erde und braucht etwa vier Wochen für eine Runde um sie.
```

`en/grundschule/objekt-earth.md`:
```markdown
# The Earth

The Earth is our home. It is the third planet from the [Sun](objekt:sun) and the only
one where we know of oceans, clouds and life. One year is one trip around the Sun, one
day is one spin around itself. The [Moon](objekt:moon) travels with the Earth and
needs about four weeks for one lap around it.
```

`de/gymnasium/objekt-earth.md`:
```markdown
# Erde

Die Erde umkreist die [Sonne](objekt:sun) in einem mittleren Abstand von rund 150
Millionen Kilometern, der Astronomischen Einheit. Ihre Bahn ist fast kreisförmig, die
Exzentrizität liegt bei 0,017. Die Rotationsachse ist um 23,4° gegen die Bahnebene
geneigt; diese [Achsneigung](thema:achsneigung) verursacht die Jahreszeiten, nicht
der wechselnde Sonnenabstand.

Mit 12 742 km Durchmesser ist die Erde der größte der vier Gesteinsplaneten. Sie
besitzt ein globales Magnetfeld, eine Atmosphäre aus Stickstoff und Sauerstoff und
als einziger bekannter Körper flüssiges Wasser in großer Menge an der Oberfläche.

Der [Mond](objekt:moon) ist im Verhältnis zum Planeten ungewöhnlich groß, etwa ein
Viertel des Erddurchmessers. Er stabilisiert die Achsneigung und verursacht zusammen
mit der Sonne die Gezeiten. Zieht er durch den Kernschatten der Erde, kommt es zu
einer [Mondfinsternis](thema:finsternis), im Kino als [Szene](szene:mondfinsternis)
zu sehen.

Kennzahlen: [NSSDC Earth Fact Sheet](quelle:nssdc-earth).
```

`en/gymnasium/objekt-earth.md`:
```markdown
# Earth

The Earth orbits the [Sun](objekt:sun) at a mean distance of about 150 million
kilometres, the astronomical unit. Its orbit is nearly circular, with an eccentricity
of 0.017. The rotation axis is tilted by 23.4° against the orbital plane; this
[axial tilt](thema:achsneigung) causes the seasons, not the changing distance from
the Sun.

With a diameter of 12,742 km the Earth is the largest of the four rocky planets. It
has a global magnetic field, an atmosphere of nitrogen and oxygen and, as the only
known body, large amounts of liquid water on its surface.

The [Moon](objekt:moon) is unusually large for its planet, about a quarter of the
Earth's diameter. It stabilises the axial tilt and, together with the Sun, raises the
tides. When it passes through the Earth's umbra there is a
[lunar eclipse](thema:finsternis), shown in the cinema as a
[scene](szene:mondfinsternis).

Key figures: [NSSDC Earth Fact Sheet](quelle:nssdc-earth).
```

`de/grundschule/objekt-saturn.md`:
```markdown
# Der Saturn

Saturn ist der Planet mit den großen Ringen. Sie bestehen aus unzähligen Brocken aus
Eis, manche so klein wie Staub, andere so groß wie Häuser. Saturn ist ein Gasriese,
fast zehnmal so breit wie die [Erde](objekt:earth), und so leicht, dass er auf einem
riesigen Meer schwimmen würde. Sein größter Mond heißt [Titan](objekt:titan) und hat
eine dichte, orangefarbene Lufthülle.
```

`en/grundschule/objekt-saturn.md`:
```markdown
# Saturn

Saturn is the planet with the big rings. They are made of countless chunks of ice,
some as small as dust, others as big as houses. Saturn is a gas giant, almost ten
times as wide as the [Earth](objekt:earth), and so light that it would float on a
giant sea. Its largest moon is called [Titan](objekt:titan) and has a thick, orange
atmosphere.
```

`de/gymnasium/objekt-saturn.md`:
```markdown
# Saturn

Saturn ist der sechste Planet und nach [Jupiter](objekt:jupiter) der zweitgrößte. Er
umkreist die [Sonne](objekt:sun) in rund 9,5 AE und braucht dafür etwa 29,5 Jahre.
Mit einer mittleren Dichte von 0,69 g/cm³ ist er der einzige Planet, der leichter als
Wasser ist. Seine schnelle Rotation von gut zehn Stunden plattet ihn sichtbar ab:
Der Äquatordurchmesser ist rund 10 % größer als der Poldurchmesser.

Die [Ringe](thema:ringe) reichen von etwa 7 000 bis 80 000 km über den Wolken, sind
aber meist nur einige zehn Meter dick. Sie bestehen überwiegend aus Wassereis und
werden von Monden wie [Mimas](objekt:mimas) durch Resonanzen geformt; die
Cassini-Teilung ist die auffälligste Lücke. Die Achsneigung von 26,7° lässt die
Ringe von der Erde aus im Lauf eines Saturnjahres mal weit geöffnet, mal von der
Kante erscheinen.

Unter den Monden ragen [Titan](objekt:titan) mit seiner dichten Stickstoffatmosphäre
und [Enceladus](objekt:enceladus) mit Wasserfontänen am Südpol heraus. Kennzahlen:
[NSSDC Saturn Fact Sheet](quelle:nssdc-saturn); Mission: [Cassini](quelle:nasa-cassini).
```

`en/gymnasium/objekt-saturn.md`:
```markdown
# Saturn

Saturn is the sixth planet and, after [Jupiter](objekt:jupiter), the second largest.
It orbits the [Sun](objekt:sun) at about 9.5 AU and takes roughly 29.5 years to do
so. With a mean density of 0.69 g/cm³ it is the only planet lighter than water. Its
fast rotation of just over ten hours flattens it visibly: the equatorial diameter is
about 10 % larger than the polar diameter.

The [rings](thema:ringe) extend from about 7,000 to 80,000 km above the clouds but
are mostly only a few tens of metres thick. They consist mainly of water ice and are
shaped by resonances with moons such as [Mimas](objekt:mimas); the Cassini Division
is the most prominent gap. The axial tilt of 26.7° makes the rings appear wide open
at times and edge-on at others, as seen from Earth over one Saturn year.

Among the moons, [Titan](objekt:titan) with its dense nitrogen atmosphere and
[Enceladus](objekt:enceladus) with water plumes at its south pole stand out. Key
figures: [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn); mission:
[Cassini](quelle:nasa-cassini).
```

`de/grundschule/szene-mondfinsternis.md`:
```markdown
# Mondfinsternis

Bei einer Mondfinsternis steht die [Erde](objekt:earth) genau zwischen
[Sonne](objekt:sun) und [Mond](objekt:moon). Der Mond wandert durch den Schatten der
Erde und wird dunkel. Ganz schwarz wird er nicht: Ein wenig Sonnenlicht biegt sich
durch die Luft der Erde und färbt ihn rot, deshalb spricht man vom Blutmond. In dieser
Szene läuft die Zeit schneller, damit du den Schatten wandern siehst.
```

`en/grundschule/szene-mondfinsternis.md`:
```markdown
# Lunar eclipse

During a lunar eclipse the [Earth](objekt:earth) stands exactly between the
[Sun](objekt:sun) and the [Moon](objekt:moon). The Moon moves through the Earth's
shadow and turns dark. It does not go completely black: a little sunlight bends
through the Earth's air and colours it red, which is why people call it a blood
moon. In this scene time runs faster so that you can watch the shadow move.
```

`de/gymnasium/szene-mondfinsternis.md`:
```markdown
# Szene: Mondfinsternis

Eine Mondfinsternis tritt ein, wenn der [Mond](objekt:moon) bei Vollmond durch den
Kernschatten der [Erde](objekt:earth) zieht. Weil die Mondbahn um 5,1° gegen die
Ekliptik geneigt ist, passiert das nicht jeden Monat, sondern nur, wenn der Vollmond
nahe einem der beiden Bahnknoten steht: im Mittel zwei- bis dreimal im Jahr, oft nur
als Halbschattenfinsternis.

Der Kernschatten der Erde ist in Mondentfernung rund 9 000 km breit, mehr als das
Doppelte des Monddurchmessers. Ein Durchgang durch den Kernschatten kann deshalb bis
zu 100 Minuten dauern. Der Mond bleibt dabei sichtbar: Die Erdatmosphäre bricht
Sonnenlicht in den Schatten hinein und streut den blauen Anteil heraus, übrig bleibt
ein kupferrotes Restlicht. Wie dunkel und wie rot es wird, hängt von Staub und Wolken
in der Erdatmosphäre ab (Danjon-Skala).

Die Szene sucht die nächste Finsternis ab der aktuellen Zeit und beschleunigt die
Uhr, damit der Durchgang in wenigen Sekunden sichtbar wird. Mehr zu
[Finsternissen](thema:finsternis); Zeiten und Karten:
[NASA Eclipse Web Site](quelle:nasa-eclipse).
```

`en/gymnasium/szene-mondfinsternis.md`:
```markdown
# Scene: Lunar eclipse

A lunar eclipse occurs when the full [Moon](objekt:moon) passes through the umbra of
the [Earth](objekt:earth). Because the lunar orbit is inclined by 5.1° to the
ecliptic, this does not happen every month but only when the full Moon is close to
one of the two nodes of its orbit: on average two to three times a year, often only
as a penumbral eclipse.

At the Moon's distance the Earth's umbra is about 9,000 km wide, more than twice the
Moon's diameter. A passage through the umbra can therefore last up to 100 minutes.
The Moon stays visible: the Earth's atmosphere refracts sunlight into the shadow and
scatters the blue part away, leaving a coppery red glow. How dark and how red it gets
depends on dust and clouds in the Earth's atmosphere (Danjon scale).

The scene searches for the next eclipse from the current time and speeds up the
clock so that the passage becomes visible within a few seconds. More on
[eclipses](thema:finsternis); times and maps:
[NASA Eclipse Web Site](quelle:nasa-eclipse).
```

`de/gymnasium/thema-modell.md`:
```markdown
# Grenzen des Modells

Die Simulation rechnet die Bahnen nach den Keplerschen Gesetzen: Jeder Körper bewegt
sich auf einer Ellipse um seinen Mutterkörper, beschrieben durch sechs
[Bahnelemente](thema:bahnelemente), die sich langsam mit der Zeit ändern. Diese
Näherung ist bewusst gewählt und hat bekannte Grenzen.

- **Keine Bahnstörungen:** In Wirklichkeit ziehen die Planeten aneinander; hier zieht
  nur die Sonne. Die Elemente enthalten die mittlere Wirkung der Störungen als
  lineare Raten, nicht die kurzperiodischen Schwankungen.
- **Genauigkeitsfenster 1800 bis 2050:** Nur in diesem Zeitraum sind die verwendeten
  Elemente belastbar. Außerhalb wächst der Fehler, der Datenblock warnt dann.
- **Keine Präzession, keine Nutation:** Die Rotationsachsen stehen fest im Raum. Die
  Erdachse wandert in Wirklichkeit in rund 26 000 Jahren einmal um den Ekliptikpol.
- **Monde auf vereinfachter Ebene:** Viele Mondbahnen beziehen sich auf die
  Äquatorebene ihres Planeten (Laplace-Ebene), nicht auf die genaue Bewegung ihrer
  Bahnpole.
- **Erde als Schwerpunkt:** Die Tabelle liefert den Erde-Mond-Schwerpunkt; die
  Abweichung zum Erdmittelpunkt liegt unter 4 700 km.

Quellen: [JPL Approximate Positions](quelle:jpl-approx-pos) für die Bahnelemente,
[NSSDC Fact Sheets](quelle:nssdc-factsheets) für die Kennzahlen,
[IAU-Bericht](quelle:iau-rotation) für die Rotationsachsen.
```

`en/gymnasium/thema-modell.md`:
```markdown
# Limits of the model

The simulation computes the orbits from Kepler's laws: every body moves on an
ellipse around its parent body, described by six [orbital elements](thema:bahnelemente)
that change slowly with time. This approximation is deliberate and has known limits.

- **No perturbations:** In reality the planets pull on each other; here only the Sun
  pulls. The elements contain the mean effect of the perturbations as linear rates,
  not the short-period variations.
- **Accuracy window 1800 to 2050:** Only within this period are the elements
  reliable. Outside it the error grows and the data block shows a warning.
- **No precession, no nutation:** The rotation axes are fixed in space. In reality
  the Earth's axis circles the ecliptic pole once in about 26,000 years.
- **Moons on a simplified plane:** Many lunar orbits refer to the equatorial plane of
  their planet (Laplace plane), not to the exact motion of their orbital poles.
- **Earth as barycentre:** The table gives the Earth-Moon barycentre; the deviation
  from the Earth's centre is below 4,700 km.

Sources: [JPL Approximate Positions](quelle:jpl-approx-pos) for the orbital
elements, [NSSDC Fact Sheets](quelle:nssdc-factsheets) for the key figures,
[IAU report](quelle:iau-rotation) for the rotation axes.
```

- [ ] **Schritt 4: Dateitest anlegen** — `src/data/texte/dateien.test.ts` (prüft jede Datei, auch die künftiger Etappen):

```ts
import { describe, it, expect } from 'vitest';
import { textKennungGueltig, verweisAufloesen } from '../verweise';
import type { Niveau } from '../themen';

const dateien = import.meta.glob('./*/*/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

const MUSTER = /^\.\/(de|en)\/(grundschule|gymnasium|hochschule)\/(objekt|szene|thema)-([a-z0-9-]+)\.md$/;

/** Weiche Obergrenzen zu den Richtwerten 40–80 und 120–180 Wörter (Entwurf §2 Punkt 4, §8). */
const WORTGRENZE: Record<Niveau, number> = { grundschule: 110, gymnasium: 240, hochschule: Infinity };

/** Zählt Wörter ohne die Link-Ziele in Klammern. */
function woerter(text: string): number {
  return text.replace(/\]\([^)]*\)/g, ']').split(/\s+/).filter((w) => w.length > 0).length;
}

function verweisZiele(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1] ?? '');
}

describe('Textdateien', () => {
  const eintraege = Object.entries(dateien);

  it('gibt es', () => {
    expect(eintraege.length).toBeGreaterThanOrEqual(14);
  });

  for (const [pfad, text] of eintraege) {
    describe(pfad, () => {
      const treffer = MUSTER.exec(pfad);

      it('folgt dem Namensmuster und nennt eine bekannte Kennung', () => {
        expect(treffer, 'Muster <sprache>/<niveau>/<art>-<kennung>.md').not.toBeNull();
        const [, , , art, kennung] = treffer ?? [];
        expect(textKennungGueltig(art ?? '', kennung ?? '')).toBe(true);
      });

      it('beginnt mit einer Überschrift der Ebene 1', () => {
        expect(text.split(/\r?\n/)[0]).toMatch(/^# \S/);
      });

      it('enthält nur auflösbare Verweise', () => {
        for (const ziel of verweisZiele(text)) {
          expect(verweisAufloesen(ziel), `Verweis ${ziel}`).not.toBeNull();
        }
      });

      it('enthält kein HTML', () => {
        expect(text).not.toMatch(/<[a-zA-Z!/]/);
      });

      it('hält die Wortgrenze des Niveaus', () => {
        const niveau = (treffer?.[2] ?? 'hochschule') as Niveau;
        expect(woerter(text)).toBeLessThanOrEqual(WORTGRENZE[niveau]);
      });
    });
  }

  it('hat jede Datei in beiden Sprachen', () => {
    const pfade = new Set(Object.keys(dateien));
    for (const pfad of pfade) {
      const partner = pfad.startsWith('./de/') ? pfad.replace('./de/', './en/') : pfad.replace('./en/', './de/');
      expect(pfade.has(partner), `Gegenstück fehlt: ${partner}`).toBe(true);
    }
  });
});
```

- [ ] **Schritt 5: Prüfen**

Run: `npx vitest run src/data && npx tsc -b && npm run lint`
Expected: PASS. Falls der Dateitest bei einer Wortgrenze fällt, den betreffenden Text kürzen, nicht die Grenze heben.

- [ ] **Schritt 6: Commit**

```bash
git add src/data/texte
git commit -m "Infopanel: Textlader mit Ausweichreihenfolge und erste 14 Erläuterungstexte"
```

---

### Task 6: Markdown-Parser

**Dateien:**
- Erstellen: `src/ui/info/markdown.ts`, `src/ui/info/markdown.test.ts`

**Schnittstellen:**
- Produziert:
  ```ts
  export type Inline =
    | { typ: 'text'; text: string }
    | { typ: 'fett'; kinder: Inline[] }
    | { typ: 'kursiv'; kinder: Inline[] }
    | { typ: 'link'; ziel: string; kinder: Inline[] };
  export type Block =
    | { typ: 'ueberschrift'; ebene: 1 | 2 | 3; kinder: Inline[] }
    | { typ: 'absatz'; kinder: Inline[] }
    | { typ: 'liste'; geordnet: boolean; punkte: Inline[][] };
  export function parseInline(text: string): Inline[];
  export function parseMarkdown(text: string): Block[];
  export function inlineText(kinder: Inline[]): string;
  export function titelVon(bloecke: Block[]): string | null;   // erste Überschrift der Ebene 1
  ```
  Task 9 rendert diesen Baum, Task 11 nutzt `titelVon` für den Paneltitel.

- [ ] **Schritt 1: Fehlschlagende Tests** — `src/ui/info/markdown.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseInline, parseMarkdown, titelVon } from './markdown';

const text = (t: string) => ({ typ: 'text' as const, text: t });

describe('parseInline', () => {
  it('lässt reinen Text unverändert', () => {
    expect(parseInline('Die Erde ist rund.')).toEqual([text('Die Erde ist rund.')]);
  });

  it('erkennt fett, kursiv und Verschachtelung', () => {
    expect(parseInline('a **b** c')).toEqual([text('a '), { typ: 'fett', kinder: [text('b')] }, text(' c')]);
    expect(parseInline('(*k*)')).toEqual([text('('), { typ: 'kursiv', kinder: [text('k')] }, text(')')]);
    expect(parseInline('**a *b* c**')).toEqual([
      { typ: 'fett', kinder: [text('a '), { typ: 'kursiv', kinder: [text('b')] }, text(' c')] },
    ]);
  });

  it('nimmt Sternchen in Zahlen und ungeschlossene Marker als Text', () => {
    expect(parseInline('5*10*2 und 3*4')).toEqual([text('5*10*2 und 3*4')]);
    expect(parseInline('**offen bleibt')).toEqual([text('**offen bleibt')]);
    expect(parseInline('a * b')).toEqual([text('a * b')]);
  });

  it('erkennt Links mit Klammern im Text und im Ziel', () => {
    expect(parseInline('siehe [Saturn (Planet)](https://de.wikipedia.org/wiki/Saturn_(Planet)) dort')).toEqual([
      text('siehe '),
      { typ: 'link', ziel: 'https://de.wikipedia.org/wiki/Saturn_(Planet)', kinder: [text('Saturn (Planet)')] },
      text(' dort'),
    ]);
    expect(parseInline('[Erde](objekt:earth)')).toEqual([{ typ: 'link', ziel: 'objekt:earth', kinder: [text('Erde')] }]);
    expect(parseInline('[**fett**](thema:modell)')).toEqual([
      { typ: 'link', ziel: 'thema:modell', kinder: [{ typ: 'fett', kinder: [text('fett')] }] },
    ]);
  });

  it('lässt kaputte Links und Leerraum im Ziel als Text stehen', () => {
    expect(parseInline('[ohne Ziel] und [x](a b)')).toEqual([text('[ohne Ziel] und [x](a b)')]);
    expect(parseInline('[](objekt:earth)')).toEqual([text('[](objekt:earth)')]);
  });

  it('reicht HTML nicht durch', () => {
    expect(parseInline('<b>x</b>')).toEqual([text('<b>x</b>')]);
  });
});

describe('parseMarkdown', () => {
  it('trennt Überschriften, Absätze und Listen; Zeilen eines Absatzes werden verbunden', () => {
    const md = [
      '# Titel',
      '',
      'Erste Zeile',
      'zweite Zeile.',
      '- Punkt eins',
      '- Punkt **zwei**',
      '',
      '1. eins',
      '2. zwei',
      '### Klein',
      'Schluss',
    ].join('\n');
    expect(parseMarkdown(md)).toEqual([
      { typ: 'ueberschrift', ebene: 1, kinder: [text('Titel')] },
      { typ: 'absatz', kinder: [text('Erste Zeile zweite Zeile.')] },
      { typ: 'liste', geordnet: false, punkte: [[text('Punkt eins')], [text('Punkt '), { typ: 'fett', kinder: [text('zwei')] }]] },
      { typ: 'liste', geordnet: true, punkte: [[text('eins')], [text('zwei')]] },
      { typ: 'ueberschrift', ebene: 3, kinder: [text('Klein')] },
      { typ: 'absatz', kinder: [text('Schluss')] },
    ]);
  });

  it('hängt eingerückte Folgezeilen an den Listenpunkt', () => {
    expect(parseMarkdown('- **A:** erste\n  zweite\n- B')).toEqual([
      { typ: 'liste', geordnet: false, punkte: [
        [{ typ: 'fett', kinder: [text('A:')] }, text(' erste zweite')],
        [text('B')],
      ] },
    ]);
  });

  it('kommt mit Windows-Zeilenenden und Leerzeilen am Ende zurecht', () => {
    expect(parseMarkdown('# T\r\n\r\nAbsatz\r\n\r\n')).toEqual([
      { typ: 'ueberschrift', ebene: 1, kinder: [text('T')] },
      { typ: 'absatz', kinder: [text('Absatz')] },
    ]);
  });

  it('titelVon liefert die erste Überschrift der Ebene 1 als Text', () => {
    expect(titelVon(parseMarkdown('# Die *Erde*\n\nx'))).toBe('Die Erde');
    expect(titelVon(parseMarkdown('## nur klein'))).toBeNull();
  });
});
```

Run: `npx vitest run src/ui/info/markdown.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 2: Parser schreiben** — `src/ui/info/markdown.ts`:

```ts
/**
 * Markdown-Teilmenge für die Erläuterungstexte (Entwurf 4c §4.2):
 * Überschriften # bis ###, Absätze, Listen mit - oder 1., fett, kursiv,
 * Links. Alles andere bleibt Klartext, HTML wird nie durchgereicht — deshalb
 * braucht die Ausgabe keine Bereinigung. Zeichenweise Zerlegung statt
 * regulärer Ausdrücke, damit Klammern in Linktexten und Sternchen in
 * Zahlen (5*10) nicht kippen.
 */
export type Inline =
  | { typ: 'text'; text: string }
  | { typ: 'fett'; kinder: Inline[] }
  | { typ: 'kursiv'; kinder: Inline[] }
  | { typ: 'link'; ziel: string; kinder: Inline[] };

export type Block =
  | { typ: 'ueberschrift'; ebene: 1 | 2 | 3; kinder: Inline[] }
  | { typ: 'absatz'; kinder: Inline[] }
  | { typ: 'liste'; geordnet: boolean; punkte: Inline[][] };

const WORTZEICHEN = /[\p{L}\p{N}]/u;

const istWortzeichen = (zeichen: string | undefined): boolean =>
  zeichen !== undefined && WORTZEICHEN.test(zeichen);

/**
 * Liest ab `start` (eine öffnende eckige Klammer) einen Link der Form
 * [text](ziel). Eckige und runde Klammern dürfen verschachtelt vorkommen;
 * das Ziel darf keinen Leerraum enthalten, der Text nicht leer sein.
 */
function liesLink(text: string, start: number): { linktext: string; ziel: string; ende: number } | null {
  let tiefe = 0;
  let i = start;
  for (; i < text.length; i += 1) {
    const c = text[i];
    if (c === '[') tiefe += 1;
    else if (c === ']') {
      tiefe -= 1;
      if (tiefe === 0) break;
    }
  }
  if (i >= text.length || text[i + 1] !== '(') return null;
  const linktext = text.slice(start + 1, i);
  let klammern = 0;
  let j = i + 1;
  for (; j < text.length; j += 1) {
    const c = text[j];
    if (c === '(') klammern += 1;
    else if (c === ')') {
      klammern -= 1;
      if (klammern === 0) break;
    }
  }
  if (j >= text.length) return null;
  const ziel = text.slice(i + 2, j);
  if (ziel === '' || /\s/.test(ziel) || linktext.trim() === '') return null;
  return { linktext, ziel, ende: j + 1 };
}

/** Benachbarte Textknoten zusammenziehen, rekursiv. */
function verschmelzen(liste: Inline[]): Inline[] {
  const out: Inline[] = [];
  for (const el of liste) {
    const letzter = out[out.length - 1];
    if (el.typ === 'text') {
      if (letzter?.typ === 'text') letzter.text += el.text;
      else out.push({ typ: 'text', text: el.text });
    } else {
      out.push({ ...el, kinder: verschmelzen(el.kinder) });
    }
  }
  return out;
}

export function parseInline(text: string): Inline[] {
  const wurzel: Inline[] = [];
  const stapel: { typ: 'fett' | 'kursiv'; kinder: Inline[] }[] = [];
  let puffer = '';
  const ziel = (): Inline[] => stapel.length === 0 ? wurzel : stapel[stapel.length - 1]!.kinder;
  const leeren = (): void => {
    if (puffer === '') return;
    ziel().push({ typ: 'text', text: puffer });
    puffer = '';
  };

  let i = 0;
  while (i < text.length) {
    const c = text[i]!;
    if (c === '[') {
      const link = liesLink(text, i);
      if (link !== null) {
        leeren();
        ziel().push({ typ: 'link', ziel: link.ziel, kinder: parseInline(link.linktext) });
        i = link.ende;
        continue;
      }
    }
    if (c === '*') {
      const doppelt = text[i + 1] === '*';
      const typ = doppelt ? 'fett' : 'kursiv';
      const laenge = doppelt ? 2 : 1;
      const oben = stapel[stapel.length - 1];
      // Schließt, wenn dieselbe Art offen ist, kein Leerzeichen davor steht
      // und danach kein Wortzeichen folgt (sonst ist es ein Malzeichen).
      if (oben !== undefined && oben.typ === typ && text[i - 1] !== ' ' && !istWortzeichen(text[i + laenge])) {
        leeren();
        stapel.pop();
        ziel().push({ typ: oben.typ, kinder: oben.kinder });
        i += laenge;
        continue;
      }
      // Öffnet, wenn davor kein Wortzeichen und danach kein Leerzeichen steht
      // und ein passender Marker später noch vorkommt.
      const schliesserSpaeter = text.indexOf(doppelt ? '**' : '*', i + laenge) !== -1;
      const naechstes = text[i + laenge];
      if ((oben === undefined || oben.typ !== typ) && !istWortzeichen(text[i - 1])
        && naechstes !== undefined && naechstes !== ' ' && schliesserSpaeter) {
        leeren();
        stapel.push({ typ, kinder: [] });
        i += laenge;
        continue;
      }
    }
    puffer += c;
    i += 1;
  }
  leeren();
  // Nicht geschlossene Hervorhebungen werden zu Text: Marker und Inhalt
  // wandern in die umgebende Ebene zurück.
  while (stapel.length > 0) {
    const offen = stapel.pop()!;
    ziel().push({ typ: 'text', text: offen.typ === 'fett' ? '**' : '*' }, ...offen.kinder);
  }
  return verschmelzen(wurzel);
}

const UEBERSCHRIFT = /^(#{1,3})\s+(.*\S)\s*$/;
const LISTENPUNKT = /^(-|\d+\.)\s+(.*)$/;

export function parseMarkdown(text: string): Block[] {
  const bloecke: Block[] = [];
  let absatz: string[] = [];
  let liste: { geordnet: boolean; punkte: string[] } | null = null;

  const absatzSchliessen = (): void => {
    if (absatz.length === 0) return;
    bloecke.push({ typ: 'absatz', kinder: parseInline(absatz.join(' ')) });
    absatz = [];
  };
  const listeSchliessen = (): void => {
    if (liste === null) return;
    bloecke.push({ typ: 'liste', geordnet: liste.geordnet, punkte: liste.punkte.map(parseInline) });
    liste = null;
  };

  for (const roh of text.replace(/\r\n?/g, '\n').split('\n')) {
    const zeile = roh.trimEnd();
    if (zeile.trim() === '') {
      absatzSchliessen();
      listeSchliessen();
      continue;
    }
    const kopf = UEBERSCHRIFT.exec(zeile);
    if (kopf !== null) {
      absatzSchliessen();
      listeSchliessen();
      bloecke.push({ typ: 'ueberschrift', ebene: kopf[1]!.length as 1 | 2 | 3, kinder: parseInline(kopf[2]!) });
      continue;
    }
    const punkt = LISTENPUNKT.exec(zeile);
    if (punkt !== null) {
      absatzSchliessen();
      const geordnet = punkt[1] !== '-';
      if (liste !== null && liste.geordnet !== geordnet) listeSchliessen();
      if (liste === null) liste = { geordnet, punkte: [] };
      liste.punkte.push(punkt[2]!);
      continue;
    }
    // Eingerückte Zeile nach einem Listenpunkt gehört zu ihm.
    if (liste !== null && /^\s/.test(roh)) {
      liste.punkte[liste.punkte.length - 1] += ` ${zeile.trim()}`;
      continue;
    }
    listeSchliessen();
    absatz.push(zeile.trim());
  }
  absatzSchliessen();
  listeSchliessen();
  return bloecke;
}

export function inlineText(kinder: Inline[]): string {
  return kinder.map((k) => (k.typ === 'text' ? k.text : inlineText(k.kinder))).join('');
}

export function titelVon(bloecke: Block[]): string | null {
  for (const block of bloecke) {
    if (block.typ === 'ueberschrift' && block.ebene === 1) return inlineText(block.kinder);
  }
  return null;
}
```

- [ ] **Schritt 3: Prüfen**

Run: `npx vitest run src/ui/info/markdown.test.ts && npx tsc -b && npm run lint`
Expected: PASS. Fällt ein Fall, den Parser korrigieren, nicht den Test — die Fälle sind die Randfälle aus Entwurf §8.

- [ ] **Schritt 4: Commit**

```bash
git add src/ui/info/markdown.ts src/ui/info/markdown.test.ts
git commit -m "Infopanel: Markdown-Parser für die Erläuterungstexte"
```

---

### Task 7: Kamerafahrt

**Dateien:**
- Erstellen: `src/ui/kamerafahrt.ts`, `src/ui/kamerafahrt.test.ts`
- Ändern: `src/ui/panels/BodyTree.tsx` (Funktion `fokussieren`, Konstanten `FOKUS_FAKTOR`/`FOKUS_MIN_KM` entfallen dort)

**Schnittstellen:**
- Konsumiert: `easeInOutCubic` (`ui/tween.ts`), `scaledRadius` (`sim/scale.ts`), `stopCinema` (`ui/cinemaControl.ts`), `bodyIndex`.
- Produziert:
  ```ts
  export const FAHRT_MS = 1500;
  export const FOKUS_FAKTOR = 8;
  export const FOKUS_MIN_KM = 1e4;
  export function fokusAbstand(body: Body, scale: ScaleSettings): number;
  export interface FahrtOptionen {
    dauerMs?: number;
    jetzt?: () => number;
    anfordern?: (schritt: () => void) => number;
    abbrechen?: (kennung: number) => void;
  }
  export function fahreZu(id: string, optionen?: FahrtOptionen): void;
  export function fahrtAbbrechen(): void;
  export function fahrtLaeuft(): boolean;
  ```

- [ ] **Schritt 1: Fehlschlagende Tests** — `src/ui/kamerafahrt.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { fahreZu, fahrtAbbrechen, fahrtLaeuft, fokusAbstand, FAHRT_MS } from './kamerafahrt';
import { useStore, DEFAULT_STATE } from '../store';
import { bodyIndex } from '../data';

/** Handgesteuerte Uhr und Bildplanung, damit die Fahrt ohne Timer prüfbar ist. */
function planer(): { optionen: Parameters<typeof fahreZu>[1]; vor(ms: number): void } {
  let ms = 0;
  let naechster: (() => void) | null = null;
  return {
    optionen: {
      jetzt: () => ms,
      anfordern: (schritt) => { naechster = schritt; return 1; },
      abbrechen: () => { naechster = null; },
    },
    vor(delta) {
      ms += delta;
      const s = naechster;
      naechster = null;
      s?.();
    },
  };
}

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('fahreZu', () => {
  it('setzt das Ziel sofort und gleitet den Abstand in 1,5 s logarithmisch ans Ziel', () => {
    const p = planer();
    useStore.getState().setCamera({ distance: 1e9 });
    fahreZu('saturn', p.optionen);
    const s = useStore.getState();
    expect(s.camera.targetId).toBe('saturn');
    expect(s.camera.freezeJd).toBe(s.time.jd);
    expect(fahrtLaeuft()).toBe(true);
    const ziel = fokusAbstand(bodyIndex.saturn!, s.scale);
    const werte: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      p.vor(FAHRT_MS / 5);
      werte.push(useStore.getState().camera.distance);
    }
    for (let i = 1; i < werte.length; i += 1) expect(werte[i]!).toBeLessThanOrEqual(werte[i - 1]!);
    expect(useStore.getState().camera.distance).toBeCloseTo(ziel, 6);
    expect(fahrtLaeuft()).toBe(false);
  });

  it('bricht bei einer Nutzereingabe ab und bleibt stehen', () => {
    const p = planer();
    useStore.getState().setCamera({ distance: 1e9 });
    fahreZu('earth', p.optionen);
    p.vor(FAHRT_MS / 3);
    const mitte = useStore.getState().camera.distance;
    window.dispatchEvent(new Event('wheel'));
    expect(fahrtLaeuft()).toBe(false);
    p.vor(FAHRT_MS);
    expect(useStore.getState().camera.distance).toBe(mitte);
  });

  it('ersetzt eine laufende Fahrt und beendet ein laufendes Kino', () => {
    const p = planer();
    useStore.getState().setCinema({ running: true });
    useStore.getState().setCamera({ mode: 'cinema' });
    fahreZu('earth', p.optionen);
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('free');
    fahreZu('moon', p.optionen);
    expect(useStore.getState().camera.targetId).toBe('moon');
    p.vor(FAHRT_MS + 1);
    expect(useStore.getState().camera.distance).toBeCloseTo(fokusAbstand(bodyIndex.moon!, useStore.getState().scale), 6);
  });

  it('ignoriert unbekannte Körper', () => {
    const vorher = useStore.getState().camera;
    fahreZu('vulcan', planer().optionen);
    expect(useStore.getState().camera).toEqual(vorher);
    expect(fahrtLaeuft()).toBe(false);
  });
});
```

Run: `npx vitest run src/ui/kamerafahrt.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 2: Implementieren** — `src/ui/kamerafahrt.ts`:

```ts
import { useStore } from '../store';
import { bodyIndex } from '../data';
import type { Body } from '../sim/types';
import { scaledRadius } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';
import { easeInOutCubic } from './tween';
import { stopCinema } from './cinemaControl';

/** Dauer der Fahrt (Entwurf 4c §5.3). */
export const FAHRT_MS = 1500;
/** Abstand, aus dem ein Körper formatfüllend, aber vollständig zu sehen ist. */
export const FOKUS_FAKTOR = 8;
export const FOKUS_MIN_KM = 1e4;

export function fokusAbstand(body: Body, scale: ScaleSettings): number {
  return Math.max(scaledRadius(body, scale) * FOKUS_FAKTOR, FOKUS_MIN_KM);
}

/** Zeitquelle und Bildplanung sind austauschbar, damit die Fahrt ohne Timer prüfbar ist. */
export interface FahrtOptionen {
  dauerMs?: number;
  jetzt?: () => number;
  anfordern?: (schritt: () => void) => number;
  abbrechen?: (kennung: number) => void;
}

/** Diese Ereignisse beenden eine laufende Fahrt; pointermove bewusst nicht. */
const ABBRUCH_EREIGNISSE = ['pointerdown', 'wheel', 'keydown'] as const;

let laufend: (() => void) | null = null;

export function fahrtLaeuft(): boolean {
  return laufend !== null;
}

export function fahrtAbbrechen(): void {
  laufend?.();
}

/**
 * Fährt die Kamera in FAHRT_MS zum Körper: Das Ziel wird sofort gesetzt
 * (die Bahn führt sonst am Ziel vorbei), der Abstand gleitet logarithmisch
 * mit easeInOutCubic, Azimut und Elevation bleiben. Eine Nutzereingabe
 * bricht ab, ein weiterer Aufruf ersetzt die laufende Fahrt, ein laufendes
 * Kino wird zuerst beendet. Der Objektbaum und die Verweise in den Texten
 * nutzen dieselbe Funktion (Entwurf 4c §5.3).
 */
export function fahreZu(id: string, optionen: FahrtOptionen = {}): void {
  const body = bodyIndex[id];
  if (body === undefined) return;
  fahrtAbbrechen();

  const dauer = optionen.dauerMs ?? FAHRT_MS;
  const jetzt = optionen.jetzt ?? (() => performance.now());
  // Rückfall auf setTimeout für Umgebungen ohne requestAnimationFrame (jsdom
  // ohne pretendToBeVisual); im Browser läuft immer die Bildplanung.
  const hatRaf = typeof requestAnimationFrame === 'function';
  const anfordern = optionen.anfordern
    ?? ((schritt) => (hatRaf ? requestAnimationFrame(schritt) : Number(setTimeout(schritt, 16))));
  const abbrechen = optionen.abbrechen
    ?? ((kennung) => { if (hatRaf) cancelAnimationFrame(kennung); else clearTimeout(kennung); });

  if (useStore.getState().cinema.running) stopCinema();
  const { camera, scale, time, setCamera } = useStore.getState();
  const von = camera.distance;
  const nach = fokusAbstand(body, scale);
  setCamera({
    targetId: id,
    // Im freien Modus wird die Position des Körpers als Bezugspunkt
    // eingefroren (siehe Objektbaum); Geheftet und Verfolgung führen ihn mit.
    freezeJd: camera.mode === 'free' ? time.jd : null,
  });

  const start = jetzt();
  let kennung = 0;
  let aktiv = true;

  const beenden = (): void => {
    aktiv = false;
    laufend = null;
    abbrechen(kennung);
    if (typeof window !== 'undefined') {
      for (const name of ABBRUCH_EREIGNISSE) window.removeEventListener(name, beenden);
    }
  };

  const schritt = (): void => {
    if (!aktiv) return;
    const t = Math.min((jetzt() - start) / dauer, 1);
    useStore.getState().setCamera({ distance: von * Math.pow(nach / von, easeInOutCubic(t)) });
    if (t < 1) kennung = anfordern(schritt);
    else beenden();
  };

  laufend = beenden;
  if (typeof window !== 'undefined') {
    for (const name of ABBRUCH_EREIGNISSE) window.addEventListener(name, beenden, { passive: true });
  }
  kennung = anfordern(schritt);
}
```

- [ ] **Schritt 3: Objektbaum umstellen** — in `src/ui/panels/BodyTree.tsx`:

Import ergänzen und die beiden Konstanten sowie den Import von `scaledRadius` entfernen:
```ts
import { fahreZu } from '../kamerafahrt';
```

`fokussieren` ersetzen:
```ts
  const fokussieren = (): void => { fahreZu(knoten.body.id); };
```

Der Import `bodyIndex` bleibt nur, wenn er anderswo in der Datei gebraucht wird (`noUnusedLocals`); sonst entfernen. Die Variable `setCamera` in `Zeile` ebenso prüfen.

- [ ] **Schritt 4: Prüfen**

Run: `npx vitest run src/ui && npx tsc -b && npm run lint`
Expected: PASS; `BodyTree.test.tsx` weiterhin grün (er prüft `targetId`, nicht den Abstand).

- [ ] **Schritt 5: Sichtkontrolle im Browser** — `curl` auf den Server (200), dann im Browser den Objektbaum: Klick auf „Kamera auf diesen Körper richten" bei Saturn gleitet in etwa 1,5 s heran statt zu springen; Mausrad währenddessen stoppt die Fahrt.

- [ ] **Schritt 6: Commit**

```bash
git add src/ui/kamerafahrt.ts src/ui/kamerafahrt.test.ts src/ui/panels/BodyTree.tsx
git commit -m "Kamerafahrt: Objektbaum gleitet in 1,5 s ans Ziel statt zu springen"
```

---

### Task 8: Kennzahlen und Live-Werte

**Dateien:**
- Ändern: `src/sim/orbit.ts` (neu `umlaufzeitTage`), Test: `src/sim/orbit.test.ts` (Fälle anhängen)
- Ändern: `src/ui/format.ts` (neu `formatAbstand`, `formatMasse`), Test: `src/ui/format.test.ts` (anhängen)
- Erstellen: `src/ui/info/datenblock.ts`, `src/ui/info/datenblock.test.ts`, `src/ui/info/useLiveJd.ts`, `src/ui/info/Datenblock.tsx`, `src/ui/info/Datenblock.test.tsx`
- Ändern: `src/ui/i18n/de.ts`, `en.ts`, `i18n.test.ts` (`GLEICH_ERLAUBT`)

**Schnittstellen:**
- Konsumiert: `positionAt`, `velocityAt`, `elementsAt`, `AU_KM` (`sim/orbit.ts`), `poleVector`, `axialTiltDeg` (`sim/frames.ts`), `isOutOfRange`, `formatZahl` (`ui/format.ts`), `Niveau`.
- Produziert:
  ```ts
  // sim/orbit.ts
  export function umlaufzeitTage(body: Body, index: BodyIndex): number | null;
  // ui/format.ts
  export function formatAbstand(km: number): string;   // '384.400 km' | '5 Mio. km' | '149,6 Mio. km (1 AE)'
  export function formatMasse(kg: number): string;     // '5,97 · 10²⁴ kg'
  // ui/info/datenblock.ts
  export interface Datenzeile { schluessel: string; wert: string; hinweis?: string; live?: boolean }
  export function datenzeilen(body: Body, niveau: Niveau, jd: number, index: BodyIndex): Datenzeile[];
  // ui/info/useLiveJd.ts
  export function useLiveJd(taktMs?: number): number;
  // ui/info/Datenblock.tsx
  export function Datenblock(props: { body: Body; niveau: Niveau; onModell: () => void }): React.JSX.Element;
  ```
  Einheitensymbole `km`, `kg`, `km/s`, `°` bleiben Literale (wie „DE"/„EN"); Wörter (`Tage`, `Jahre`, `Stunden`, `AE`) kommen aus den Sprachtabellen (Ruling 3).

- [ ] **Schritt 1: Fehlschlagende Tests für Umlaufzeit und Formatierer**

Ans Ende von `src/sim/orbit.test.ts` (Importe `umlaufzeitTage` und `bodyIndex` ergänzen; `bodyIndex` kommt aus `../data`):

```ts
describe('umlaufzeitTage (Kepler III)', () => {
  it('liefert das siderische Jahr der Erde und den siderischen Monat', () => {
    expect(umlaufzeitTage(bodyIndex.earth!, bodyIndex)).toBeCloseTo(365.25, 0);
    expect(Math.abs(umlaufzeitTage(bodyIndex.earth!, bodyIndex)! - 365.25)).toBeLessThan(0.3);
    expect(Math.abs(umlaufzeitTage(bodyIndex.moon!, bodyIndex)! - 27.32)).toBeLessThan(0.2);
  });

  it('ist für die Sonne null', () => {
    expect(umlaufzeitTage(bodyIndex.sun!, bodyIndex)).toBeNull();
  });
});
```

Ans Ende von `src/ui/format.test.ts` (Importe `formatAbstand`, `formatMasse`, `setSprache` ergänzen; nach jedem Test `setSprache('de')`):

```ts
describe('formatAbstand und formatMasse', () => {
  afterEach(() => { setSprache('de'); });

  it('wählt km, Mio. km und AE nach Größenordnung', () => {
    expect(formatAbstand(384400)).toBe('384.400 km');
    expect(formatAbstand(5e6)).toBe('5 Mio. km');
    expect(formatAbstand(1.234e7)).toBe('12,3 Mio. km');
    expect(formatAbstand(149_597_870.7)).toBe('149,6 Mio. km (1 AE)');
    expect(formatAbstand(1.4e9)).toBe('1.400 Mio. km (9,36 AE)');
  });

  it('formatiert in der englischen Locale', () => {
    setSprache('en');
    expect(formatAbstand(384400)).toBe('384,400 km');
    expect(formatAbstand(149_597_870.7)).toBe('149.6 million km (1 AU)');
  });

  it('schreibt Massen als Mantisse mit hochgestelltem Exponenten', () => {
    expect(formatMasse(5.9722e24)).toBe('5,97 · 10²⁴ kg');
    expect(formatMasse(1.9885e30)).toBe('1,99 · 10³⁰ kg');
    expect(formatMasse(1.0659e16)).toBe('1,07 · 10¹⁶ kg');
  });
});
```

Run: `npx vitest run src/sim/orbit.test.ts src/ui/format.test.ts`
Expected: FAIL (Funktionen fehlen).

- [ ] **Schritt 2: Umlaufzeit** — ans Ende von `src/sim/orbit.ts`:

```ts
/** Gravitationskonstante in km³ kg⁻¹ s⁻² (CODATA 2018). */
const G_KM3 = 6.674_30e-20;

/**
 * Siderische Umlaufzeit in Tagen aus dem dritten Keplerschen Gesetz mit der
 * großen Halbachse zur Epoche und den Massen von Mutterkörper und Trabant —
 * gerechnet statt tabelliert, damit der Datenblock nichts zeigt, was die
 * Simulation nicht auch so bewegt. null für die Sonne (keine Bahn).
 */
export function umlaufzeitTage(body: Body, index: BodyIndex): number | null {
  if (body.orbit === null || body.parent === null) return null;
  const mutter = index[body.parent];
  if (mutter === undefined) return null;
  const aKm = body.orbit.a * AU_KM;
  const mu = G_KM3 * (mutter.physical.massKg + body.physical.massKg);
  return (2 * Math.PI * Math.sqrt(aKm ** 3 / mu)) / 86400;
}
```

- [ ] **Schritt 3: Formatierer** — in `src/ui/format.ts` Import `AU_KM` aus `../sim/orbit` ergänzen und anhängen:

```ts
/**
 * Abstand nach Größenordnung (Entwurf 4c §5.2): unter 1 Mio. km in km, sonst
 * in Mio. km, ab 0,1 AE zusätzlich in AE. Zwei Nachkommastellen unter
 * 10 Mio. km, danach eine.
 */
export function formatAbstand(km: number): string {
  if (km < 1e6) return `${formatZahl(km, 0)} km`;
  const mio = `${formatZahl(km / 1e6, km < 1e7 ? 2 : 1)} ${t('unit.millionKm')}`;
  if (km < 0.1 * AU_KM) return mio;
  return `${mio} (${formatZahl(km / AU_KM, 2)} ${t('unit.au')})`;
}

const HOCHGESTELLT = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** Masse als Mantisse mit zwei Nachkommastellen und hochgestelltem Zehnerexponenten. */
export function formatMasse(kg: number): string {
  const exponent = Math.floor(Math.log10(kg));
  const mantisse = kg / 10 ** exponent;
  const hoch = String(exponent).split('').map((z) => (z === '-' ? '⁻' : HOCHGESTELLT[Number(z)] ?? z)).join('');
  return `${formatZahl(mantisse, 2)} · 10${hoch} kg`;
}
```

Sprachschlüssel (jetzt anlegen, die weiteren dieses Tasks in Schritt 6):

`de.ts`:
```ts
  'unit.au': 'AE',
  'unit.days': 'Tage',
  'unit.years': 'Jahre',
  'unit.hours': 'Stunden',
```
`en.ts`:
```ts
  'unit.au': 'AU',
  'unit.days': 'days',
  'unit.years': 'years',
  'unit.hours': 'hours',
```

Run: `npx vitest run src/sim/orbit.test.ts src/ui/format.test.ts`
Expected: PASS. Sollte `1.400 Mio. km (9,36 AE)` an der Rundung scheitern, den Erwartungswert aus der tatsächlichen Ausgabe übernehmen, sofern er 9,35 bis 9,36 lautet.

- [ ] **Schritt 4: Fehlschlagender Test für die Datenzeilen** — `src/ui/info/datenblock.test.ts`:

```ts
import { describe, it, expect, afterEach } from 'vitest';
import { datenzeilen } from './datenblock';
import { bodyIndex } from '../../data';
import { J2000 } from '../../sim/time';
import { setSprache } from '../i18n';

/** Erste Zahl einer deutschen Ausgabe ('149,6 Mio. km (1 AE)' → 149.6). */
const zahl = (wert: string): number =>
  Number(/-?\d+(?:,\d+)?/.exec(wert.replace(/\./g, ''))?.[0].replace(',', '.'));
const aeWert = (wert: string): number => Number(/\(([\d,]+) AE\)/.exec(wert)?.[1]?.replace(',', '.'));
const zeile = (liste: ReturnType<typeof datenzeilen>, schluessel: string) =>
  liste.find((z) => z.schluessel === schluessel);

afterEach(() => { setSprache('de'); });

describe('datenzeilen', () => {
  it('Grundschule: Durchmesser, Umlaufzeit und Sonnenabstand der Erde', () => {
    const liste = datenzeilen(bodyIndex.earth!, 'grundschule', J2000, bodyIndex);
    expect(liste.map((z) => z.schluessel)).toEqual([
      'info.daten.durchmesser', 'info.daten.umlaufzeit', 'info.daten.abstandSonne',
    ]);
    expect(zeile(liste, 'info.daten.durchmesser')?.wert).toBe('12.742 km');
    expect(Math.abs(zahl(zeile(liste, 'info.daten.umlaufzeit')!.wert) - 365.2)).toBeLessThan(0.3);
    const ae = aeWert(zeile(liste, 'info.daten.abstandSonne')!.wert);
    expect(ae).toBeGreaterThan(0.98);
    expect(ae).toBeLessThan(1.02);
    expect(zeile(liste, 'info.daten.abstandSonne')?.live).toBe(true);
  });

  it('Gymnasium: ergänzt Masse, Rotation, Achsneigung, Exzentrizität, Erdabstand und Geschwindigkeit', () => {
    const liste = datenzeilen(bodyIndex.mars!, 'gymnasium', J2000, bodyIndex);
    const schluessel = liste.map((z) => z.schluessel);
    expect(schluessel).toContain('info.daten.masse');
    expect(schluessel).toContain('info.daten.tageslaenge');
    expect(schluessel).toContain('info.daten.achsneigung');
    expect(schluessel).toContain('info.daten.exzentrizitaet');
    expect(schluessel).toContain('info.daten.abstandErde');
    expect(schluessel).toContain('info.daten.geschwindigkeit');
    expect(schluessel).not.toContain('info.daten.a');
    const v = zahl(zeile(liste, 'info.daten.geschwindigkeit')!.wert);
    expect(v).toBeGreaterThan(21);
    expect(v).toBeLessThan(27);
    // Die Erde selbst bekommt keinen Erdabstand.
    expect(zeile(datenzeilen(bodyIndex.earth!, 'gymnasium', J2000, bodyIndex), 'info.daten.abstandErde')).toBeUndefined();
    const erde = datenzeilen(bodyIndex.earth!, 'gymnasium', J2000, bodyIndex);
    const ve = zahl(zeile(erde, 'info.daten.geschwindigkeit')!.wert);
    expect(ve).toBeGreaterThan(29.3);
    expect(ve).toBeLessThan(30.3);
    expect(zeile(erde, 'info.daten.achsneigung')?.wert).toBe('23,4°');
  });

  it('Monde: Umlauf um den Mutterkörper mit Hinweis, Geschwindigkeit relativ zum Mutterkörper', () => {
    const liste = datenzeilen(bodyIndex.moon!, 'gymnasium', J2000, bodyIndex);
    const umlauf = zeile(liste, 'info.daten.umlaufzeit')!;
    expect(Math.abs(zahl(umlauf.wert) - 27.3)).toBeLessThan(0.2);
    expect(umlauf.hinweis).toBe('um Erde');
    const v = zahl(zeile(liste, 'info.daten.geschwindigkeit')!.wert);
    expect(v).toBeGreaterThan(0.9);
    expect(v).toBeLessThan(1.1);
  });

  it('Hochschule: Bahnelemente, Bezugsebene, Pol und Albedo; retrograde Rotation als Hinweis', () => {
    const liste = datenzeilen(bodyIndex.venus!, 'hochschule', J2000, bodyIndex);
    const schluessel = liste.map((z) => z.schluessel);
    for (const s of ['info.daten.a', 'info.daten.i', 'info.daten.knoten', 'info.daten.perihel', 'info.daten.laenge',
      'info.daten.bezugsebene', 'info.daten.pol', 'info.daten.albedo']) {
      expect(schluessel).toContain(s);
    }
    expect(zeile(liste, 'info.daten.tageslaenge')?.hinweis).toBe('retrograd');
    expect(zeile(liste, 'info.daten.bezugsebene')?.wert).toBe('Ekliptik J2000');
    expect(zeile(liste, 'info.daten.a')?.hinweis).toContain('je Jahrhundert');
  });

  it('Sonne: keine Bahnzeilen, kein Erdabstand', () => {
    const liste = datenzeilen(bodyIndex.sun!, 'hochschule', J2000, bodyIndex);
    const schluessel = liste.map((z) => z.schluessel);
    expect(schluessel).toEqual(['info.daten.durchmesser', 'info.daten.masse', 'info.daten.tageslaenge',
      'info.daten.achsneigung', 'info.daten.pol']);
  });

  it('formatiert in der Sprache der Oberfläche', () => {
    setSprache('en');
    const liste = datenzeilen(bodyIndex.moon!, 'gymnasium', J2000, bodyIndex);
    expect(zeile(liste, 'info.daten.umlaufzeit')?.hinweis).toBe('around Earth');
    expect(zeile(liste, 'info.daten.durchmesser')?.wert).toBe('3,475 km');
  });
});
```

Der Monddurchmesser hängt vom Radius im Datensatz ab (1737,4 km → 3 475 km); falls der Datensatz einen anderen Wert trägt, den Erwartungswert daraus ableiten.

Run: `npx vitest run src/ui/info/datenblock.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 5: Datenzeilen** — `src/ui/info/datenblock.ts`:

```ts
import type { Body, BodyIndex, Vec3 } from '../../sim/types';
import type { Niveau } from '../../data/themen';
import { elementsAt, positionAt, umlaufzeitTage, velocityAt } from '../../sim/orbit';
import { axialTiltDeg, poleVector } from '../../sim/frames';
import { t } from '../i18n';
import { formatAbstand, formatMasse, formatZahl } from '../format';

/** Eine Zeile des Datenblocks; `live` markiert Werte, die mit der Uhr laufen. */
export interface Datenzeile { schluessel: string; wert: string; hinweis?: string; live?: boolean }

const betrag = (v: Vec3): number => Math.hypot(v.x, v.y, v.z);
const abstand = (a: Vec3, b: Vec3): number => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const NULLVEKTOR: Vec3 = { x: 0, y: 0, z: 0 };

/**
 * Gestufter Datenblock (Entwurf 4c §5.1): Grundschule zeigt drei Zeilen,
 * Gymnasium ergänzt sechs, Hochschule die Bahnelemente zur Epoche, Pol,
 * Albedo und Bezugsebene. Alles kommt aus dem Datensatz oder der
 * Simulation; nichts steht doppelt in einem Text.
 */
export function datenzeilen(body: Body, niveau: Niveau, jd: number, index: BodyIndex): Datenzeile[] {
  const zeilen: Datenzeile[] = [];
  const mutter = body.parent === null ? null : index[body.parent] ?? null;
  const umMutter = mutter !== null && mutter.id !== 'sun';

  zeilen.push({ schluessel: 'info.daten.durchmesser', wert: `${formatZahl(2 * body.physical.radiusKm, 0)} km` });

  const umlauf = umlaufzeitTage(body, index);
  if (umlauf !== null) {
    const wert = umlauf < 1000
      ? `${formatZahl(umlauf, 1)} ${t('unit.days')}`
      : `${formatZahl(umlauf / 365.25, 1)} ${t('unit.years')}`;
    zeilen.push(umMutter
      ? { schluessel: 'info.daten.umlaufzeit', wert, hinweis: t('info.umlaufUm').replace('{name}', t(mutter.info.nameKey)) }
      : { schluessel: 'info.daten.umlaufzeit', wert });
  }
  if (body.orbit !== null) {
    zeilen.push({ schluessel: 'info.daten.abstandSonne', wert: formatAbstand(betrag(positionAt(body.id, index, jd))), live: true });
  }
  if (niveau === 'grundschule') return zeilen;

  zeilen.push({ schluessel: 'info.daten.masse', wert: formatMasse(body.physical.massKg) });
  const stunden = Math.abs(body.physical.rotationPeriodH);
  const rotation: Datenzeile = {
    schluessel: 'info.daten.tageslaenge',
    wert: stunden < 48 ? `${formatZahl(stunden, 1)} ${t('unit.hours')}` : `${formatZahl(stunden / 24, 1)} ${t('unit.days')}`,
  };
  if (body.physical.rotationPeriodH < 0) rotation.hinweis = t('info.daten.retrograd');
  zeilen.push(rotation);
  const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
  zeilen.push({ schluessel: 'info.daten.achsneigung', wert: `${formatZahl(axialTiltDeg(pol), 1)}°` });

  if (body.orbit !== null) {
    zeilen.push({ schluessel: 'info.daten.exzentrizitaet', wert: formatZahl(elementsAt(body.orbit, jd).e, 3) });
    if (body.id !== 'earth' && Object.hasOwn(index, 'earth')) {
      const hier = positionAt(body.id, index, jd);
      const erde = positionAt('earth', index, jd);
      zeilen.push({ schluessel: 'info.daten.abstandErde', wert: formatAbstand(abstand(hier, erde)), live: true });
    }
    const v = velocityAt(body.id, index, jd);
    const vMutter = umMutter ? velocityAt(mutter.id, index, jd) : NULLVEKTOR;
    zeilen.push({ schluessel: 'info.daten.geschwindigkeit', wert: `${formatZahl(abstand(v, vMutter), 1)} km/s`, live: true });
  }
  if (niveau === 'gymnasium') return zeilen;

  if (body.orbit !== null) {
    const o = body.orbit;
    const jh = t('info.daten.proJh');
    zeilen.push({ schluessel: 'info.daten.a', wert: `${formatZahl(o.a, 5)} ${t('unit.au')}`, hinweis: `${formatZahl(o.aDot, 6)} ${jh}` });
    zeilen.push({ schluessel: 'info.daten.i', wert: `${formatZahl(o.i, 3)}°`, hinweis: `${formatZahl(o.iDot, 4)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.knoten', wert: `${formatZahl(o.node, 3)}°`, hinweis: `${formatZahl(o.nodeDot, 4)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.perihel', wert: `${formatZahl(o.lp, 3)}°`, hinweis: `${formatZahl(o.lpDot, 4)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.laenge', wert: `${formatZahl(o.L, 3)}°`, hinweis: `${formatZahl(o.LDot, 2)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.bezugsebene', wert: t(`info.ebene.${o.frame}`) });
  }
  zeilen.push({
    schluessel: 'info.daten.pol',
    wert: `${formatZahl(body.physical.pole.raDeg, 2)}°, ${formatZahl(body.physical.pole.decDeg, 2)}°`,
  });
  if (body.physical.albedo !== undefined) {
    zeilen.push({ schluessel: 'info.daten.albedo', wert: formatZahl(body.physical.albedo, 3) });
  }
  return zeilen;
}
```

- [ ] **Schritt 6: Sprachschlüssel des Datenblocks**

`de.ts`:
```ts
  'info.daten.durchmesser': 'Durchmesser',
  'info.daten.umlaufzeit': 'Umlaufzeit',
  'info.daten.abstandSonne': 'Abstand zur Sonne',
  'info.daten.masse': 'Masse',
  'info.daten.tageslaenge': 'Rotationsperiode',
  'info.daten.achsneigung': 'Achsneigung',
  'info.daten.exzentrizitaet': 'Exzentrizität',
  'info.daten.abstandErde': 'Abstand zur Erde',
  'info.daten.geschwindigkeit': 'Bahngeschwindigkeit',
  'info.daten.a': 'Große Halbachse',
  'info.daten.i': 'Bahnneigung',
  'info.daten.knoten': 'Länge des aufsteigenden Knotens',
  'info.daten.perihel': 'Länge des Perihels',
  'info.daten.laenge': 'Mittlere Länge (J2000)',
  'info.daten.bezugsebene': 'Bezugsebene',
  'info.daten.pol': 'Nordpol (RA, Dec)',
  'info.daten.albedo': 'Geometrische Albedo',
  'info.daten.retrograd': 'retrograd',
  'info.daten.proJh': 'je Jahrhundert',
  'info.ebene.ecliptic': 'Ekliptik J2000',
  'info.ebene.parentEquator': 'Äquator des Mutterkörpers',
  'info.umlaufUm': 'um {name}',
  'info.ausserhalbFenster': 'Außerhalb des Genauigkeitsfensters 1800–2050.',
  'info.modellgrenzen': 'Grenzen des Modells',
```

`en.ts`:
```ts
  'info.daten.durchmesser': 'Diameter',
  'info.daten.umlaufzeit': 'Orbital period',
  'info.daten.abstandSonne': 'Distance from the Sun',
  'info.daten.masse': 'Mass',
  'info.daten.tageslaenge': 'Rotation period',
  'info.daten.achsneigung': 'Axial tilt',
  'info.daten.exzentrizitaet': 'Eccentricity',
  'info.daten.abstandErde': 'Distance from Earth',
  'info.daten.geschwindigkeit': 'Orbital speed',
  'info.daten.a': 'Semi-major axis',
  'info.daten.i': 'Inclination',
  'info.daten.knoten': 'Longitude of ascending node',
  'info.daten.perihel': 'Longitude of perihelion',
  'info.daten.laenge': 'Mean longitude (J2000)',
  'info.daten.bezugsebene': 'Reference plane',
  'info.daten.pol': 'North pole (RA, Dec)',
  'info.daten.albedo': 'Geometric albedo',
  'info.daten.retrograd': 'retrograde',
  'info.daten.proJh': 'per century',
  'info.ebene.ecliptic': 'Ecliptic J2000',
  'info.ebene.parentEquator': 'Equator of the parent body',
  'info.umlaufUm': 'around {name}',
  'info.ausserhalbFenster': 'Outside the accuracy window 1800–2050.',
  'info.modellgrenzen': 'Limits of the model',
```

Run: `npx vitest run src/ui/info/datenblock.test.ts src/ui/i18n`
Expected: PASS.

- [ ] **Schritt 7: Getaktete Zeit und Komponente**

`src/ui/info/useLiveJd.ts`:
```ts
import { useEffect, useState } from 'react';
import { useStore } from '../../store';

/**
 * Liefert time.jd viermal je Sekunde statt je Bild (Entwurf 4c §5.2): Der
 * Datenblock rechnet Positionen und Geschwindigkeiten, das muss nicht mit
 * 60 Hz laufen. Bei Pause ändert sich der Wert nicht, also auch kein
 * Neuzeichnen. Gelesen wird per getState im Takt, nicht per Abonnement —
 * ein Abonnement feuerte je Bild und müsste selbst wieder drosseln.
 */
export function useLiveJd(taktMs = 250): number {
  const [jd, setJd] = useState(() => useStore.getState().time.jd);
  useEffect(() => {
    const takt = window.setInterval(() => {
      const neu = useStore.getState().time.jd;
      setJd((alt) => (alt === neu ? alt : neu));
    }, taktMs);
    return () => { window.clearInterval(takt); };
  }, [taktMs]);
  return jd;
}
```

`src/ui/info/Datenblock.tsx`:
```tsx
import { useMemo } from 'react';
import type { Body } from '../../sim/types';
import type { Niveau } from '../../data/themen';
import { bodyIndex } from '../../data';
import { useStore } from '../../store';
import { t } from '../i18n';
import { isOutOfRange } from '../format';
import { datenzeilen } from './datenblock';
import { useLiveJd } from './useLiveJd';

export const VERWEIS_KNOPF = 'cursor-pointer text-sky-300 underline decoration-sky-300/50 underline-offset-2 hover:text-sky-200';

interface Props {
  body: Body;
  niveau: Niveau;
  /** Klick auf „Grenzen des Modells". */
  onModell: () => void;
}

/** Kennzahlen über dem Text; Live-Werte laufen im Takt von useLiveJd. */
export function Datenblock({ body, niveau, onModell }: Props): React.JSX.Element {
  const jd = useLiveJd();
  const language = useStore((s) => s.ui.language);
  // language steht in den Abhängigkeiten, weil t() und die Locale davon abhängen.
  const zeilen = useMemo(() => datenzeilen(body, niveau, jd, bodyIndex), [body, niveau, jd, language]);
  const ausserhalb = isOutOfRange(jd);

  return (
    <dl data-testid="datenblock" className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
      {zeilen.map((z) => (
        <div key={z.schluessel} className="contents">
          <dt className="opacity-70">{t(z.schluessel)}</dt>
          <dd className="m-0 font-mono tabular-nums">
            {z.wert}
            {z.hinweis !== undefined ? <span className="ml-1 font-sans opacity-70">{z.hinweis}</span> : null}
          </dd>
        </div>
      ))}
      {ausserhalb || niveau === 'hochschule' ? (
        <div className="col-span-2 mt-1">
          {ausserhalb ? <span className="mr-1 text-amber-300">{t('info.ausserhalbFenster')}</span> : null}
          <button type="button" className={VERWEIS_KNOPF} onClick={onModell}>{t('info.modellgrenzen')}</button>
        </div>
      ) : null}
    </dl>
  );
}
```

`src/ui/info/Datenblock.test.tsx`:
```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Datenblock } from './Datenblock';
import { useStore, DEFAULT_STATE } from '../../store';
import { bodyIndex } from '../../data';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('Datenblock', () => {
  it('zeigt die Zeilen des Niveaus', () => {
    render(<Datenblock body={bodyIndex.earth!} niveau="grundschule" onModell={() => {}} />);
    expect(screen.getByText('Durchmesser')).toBeTruthy();
    expect(screen.getByText('12.742 km')).toBeTruthy();
    expect(screen.queryByText('Masse')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Grenzen des Modells' })).toBeNull();
  });

  it('warnt außerhalb des Fensters und verlinkt die Modellgrenzen', () => {
    useStore.getState().setTime({ jd: 2_500_000 });
    const onModell = vi.fn();
    render(<Datenblock body={bodyIndex.earth!} niveau="grundschule" onModell={onModell} />);
    expect(screen.getByText('Außerhalb des Genauigkeitsfensters 1800–2050.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Grenzen des Modells' }));
    expect(onModell).toHaveBeenCalledTimes(1);
  });

  it('Hochschule verlinkt die Modellgrenzen immer', () => {
    render(<Datenblock body={bodyIndex.sun!} niveau="hochschule" onModell={() => {}} />);
    expect(screen.getByRole('button', { name: 'Grenzen des Modells' })).toBeTruthy();
  });

  it('zieht die Live-Werte im Takt nach', () => {
    vi.useFakeTimers();
    try {
      render(<Datenblock body={bodyIndex.earth!} niveau="grundschule" onModell={() => {}} />);
      const vorher = screen.getByText(/AE\)$/).textContent;
      act(() => { useStore.getState().setTime({ jd: DEFAULT_STATE.time.jd + 90 }); });
      expect(screen.getByText(/AE\)$/).textContent).toBe(vorher);
      act(() => { vi.advanceTimersByTime(300); });
      expect(screen.getByText(/AE\)$/).textContent).not.toBe(vorher);
    } finally {
      vi.useRealTimers();
    }
  });
});
```

- [ ] **Schritt 8: Prüfen**

Run: `npx vitest run src/ui src/sim && npx tsc -b && npm run lint`
Expected: PASS.

- [ ] **Schritt 9: Commit**

```bash
git add src/sim/orbit.ts src/sim/orbit.test.ts src/ui/format.ts src/ui/format.test.ts src/ui/info src/ui/i18n
git commit -m "Infopanel: gestufter Datenblock mit Umlaufzeit nach Kepler und Live-Werten im 250-ms-Takt"
```

---

### Task 9: Markdown-Ausgabe, Verweiswirkung, Quellenkarten

**Dateien:**
- Erstellen: `src/ui/info/verweisAusfuehren.ts`, `src/ui/info/verweisAusfuehren.test.ts`
- Erstellen: `src/ui/info/Markdown.tsx`, `src/ui/info/Markdown.test.tsx`
- Erstellen: `src/ui/info/Quellenkarten.tsx`, `src/ui/info/Quellenkarten.test.tsx`
- Ändern: `src/ui/i18n/de.ts`, `en.ts` (`info.neuerTab`, `info.keineQuellen`)

**Schnittstellen:**
- Konsumiert: `Verweis`, `verweisAufloesen` (`data/verweise.ts`), `quellenFuer`, `QUELLEN_ART_REIHENFOLGE`, `Quelle` (`data/quellen.ts`), `SCENES`, `fahreZu`, `startCinema`, `parseMarkdown`, `VERWEIS_KNOPF` (`ui/info/Datenblock.tsx`).
- Produziert:
  ```ts
  export interface VerweisWirkung { hebeHervor: (quelleId: string) => void }
  export function verweisAusfuehren(v: Verweis, wirkung: VerweisWirkung): void;
  export function Markdown(props: { text: string; onVerweis: (v: Verweis) => void; titelAusblenden?: boolean }): React.JSX.Element;
  export function Quellenkarten(props: { kennung: string; hervorgehoben: string | null }): React.JSX.Element;
  ```

- [ ] **Schritt 1: Fehlschlagende Tests für die Verweiswirkung** — `src/ui/info/verweisAusfuehren.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { verweisAusfuehren } from './verweisAusfuehren';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCENES } from '../../data/scenes';
import { quelleFinden } from '../../data/quellen';
import { fahrtAbbrechen } from '../kamerafahrt';

const keineWirkung = { hebeHervor: () => {} };

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('verweisAusfuehren', () => {
  it('objekt: fährt die Kamera und löscht ein gewähltes Thema', () => {
    useStore.getState().setInfo({ thema: 'modell' });
    verweisAusfuehren({ art: 'objekt', kennung: 'saturn' }, keineWirkung);
    expect(useStore.getState().camera.targetId).toBe('saturn');
    expect(useStore.getState().ui.info.thema).toBeNull();
    fahrtAbbrechen();
  });

  it('szene: startet die Szene ohne Mischung im Kino', () => {
    const index = SCENES.findIndex((s) => s.id === 'mondfinsternis');
    expect(index).toBeGreaterThanOrEqual(0);
    verweisAusfuehren({ art: 'szene', kennung: 'mondfinsternis' }, keineWirkung);
    const s = useStore.getState();
    expect(s.cinema).toMatchObject({ running: true, shuffle: false, nummer: index, elapsedSec: 0 });
    expect(s.camera.mode).toBe('cinema');
  });

  it('thema: setzt nur das Thema', () => {
    const kamera = useStore.getState().camera;
    verweisAusfuehren({ art: 'thema', kennung: 'ringe' }, keineWirkung);
    expect(useStore.getState().ui.info.thema).toBe('ringe');
    expect(useStore.getState().camera).toEqual(kamera);
  });

  it('quelle: meldet die Kennung zur Hervorhebung; extern tut nichts', () => {
    const hebeHervor = vi.fn();
    verweisAusfuehren({ art: 'quelle', quelle: quelleFinden('nssdc-earth')! }, { hebeHervor });
    expect(hebeHervor).toHaveBeenCalledWith('nssdc-earth');
    const vorher = useStore.getState();
    verweisAusfuehren({ art: 'extern', url: 'https://example.org' }, { hebeHervor });
    expect(useStore.getState()).toBe(vorher);
    expect(hebeHervor).toHaveBeenCalledTimes(1);
  });
});
```

Run: `npx vitest run src/ui/info/verweisAusfuehren.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 2: Verweiswirkung** — `src/ui/info/verweisAusfuehren.ts`:

```ts
import type { Verweis } from '../../data/verweise';
import { SCENES } from '../../data/scenes';
import { useStore } from '../../store';
import { fahreZu } from '../kamerafahrt';
import { startCinema } from '../cinemaControl';

export interface VerweisWirkung {
  /** Scrollt das untere Segment zur Karte und hebt sie kurz hervor. */
  hebeHervor: (quelleId: string) => void;
}

/**
 * Wirkung eines angeklickten Verweises (Entwurf 4c §4.3). Externe Ziele
 * öffnet der Browser selbst über das Anker-Element; hier passiert nichts.
 * Eine Szene startet wie mit Taste C, nur ohne Mischung und auf ihrer
 * Nummer — inklusive Vollbild-Anfrage aus startCinema (Ruling 5).
 */
export function verweisAusfuehren(v: Verweis, wirkung: VerweisWirkung): void {
  const s = useStore.getState();
  switch (v.art) {
    case 'objekt':
      s.setInfo({ thema: null });
      fahreZu(v.kennung);
      return;
    case 'szene': {
      const index = SCENES.findIndex((szene) => szene.id === v.kennung);
      if (index < 0) return;
      s.setInfo({ thema: null });
      s.setCinema({ shuffle: false, nummer: index });
      startCinema();
      return;
    }
    case 'thema':
      s.setInfo({ thema: v.kennung });
      return;
    case 'quelle':
      wirkung.hebeHervor(v.quelle.id);
      return;
    case 'extern':
      return;
  }
}
```

Run: `npx vitest run src/ui/info/verweisAusfuehren.test.ts`
Expected: PASS.

- [ ] **Schritt 3: Fehlschlagende Tests für die Markdown-Ausgabe** — `src/ui/info/Markdown.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('gibt Überschriften, Absätze, Listen, fett und kursiv aus', () => {
    render(<Markdown text={'# Titel\n\nEin **fetter** und *kursiver* Satz.\n\n- eins\n- zwei'} onVerweis={() => {}} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Titel' })).toBeTruthy();
    expect(screen.getByText('fetter').tagName).toBe('STRONG');
    expect(screen.getByText('kursiver').tagName).toBe('EM');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('blendet auf Wunsch die erste Überschrift aus', () => {
    render(<Markdown text={'# Titel\n\nText\n\n# Zweiter'} onVerweis={() => {}} titelAusblenden />);
    expect(screen.queryByRole('heading', { name: 'Titel' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Zweiter' })).toBeTruthy();
  });

  it('interne Verweise sind Knöpfe und melden den aufgelösten Verweis', () => {
    const onVerweis = vi.fn();
    render(<Markdown text="Zur [Erde](objekt:earth) und zum [Thema](thema:modell)." onVerweis={onVerweis} />);
    fireEvent.click(screen.getByRole('button', { name: 'Erde' }));
    expect(onVerweis).toHaveBeenCalledWith({ art: 'objekt', kennung: 'earth' });
    fireEvent.click(screen.getByRole('button', { name: 'Thema' }));
    expect(onVerweis).toHaveBeenLastCalledWith({ art: 'thema', kennung: 'modell' });
  });

  it('Quellenverweise sind Anker mit der Zieladresse; Linksklick meldet, Strg-Klick öffnet den Tab', () => {
    const onVerweis = vi.fn();
    render(<Markdown text="Siehe [Fact Sheet](quelle:nssdc-earth)." onVerweis={onVerweis} />);
    const anker = screen.getByRole('link', { name: 'Fact Sheet' }) as HTMLAnchorElement;
    expect(anker.href).toBe('https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html');
    expect(anker.target).toBe('_blank');
    expect(anker.rel).toContain('noopener');
    const klick = fireEvent.click(anker);
    expect(klick).toBe(false); // preventDefault wurde gerufen
    expect(onVerweis).toHaveBeenCalledTimes(1);
    expect(onVerweis.mock.calls[0]?.[0]).toMatchObject({ art: 'quelle' });
    const strgKlick = fireEvent.click(anker, { ctrlKey: true });
    expect(strgKlick).toBe(true);
    expect(onVerweis).toHaveBeenCalledTimes(1);
  });

  it('externe https-Ziele sind Anker im neuen Tab; Unbekanntes bleibt Text', () => {
    render(<Markdown text="[ESA](https://www.esa.int/) und [tot](objekt:vulcan) und [böse](javascript:alert(1))" onVerweis={() => {}} />);
    const esa = screen.getByRole('link', { name: 'ESA' }) as HTMLAnchorElement;
    expect(esa.target).toBe('_blank');
    expect(esa.rel).toContain('noreferrer');
    expect(screen.queryByRole('link', { name: 'tot' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'tot' })).toBeNull();
    expect(screen.getByText('tot')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'böse' })).toBeNull();
  });
});
```

Run: `npx vitest run src/ui/info/Markdown.test.tsx`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 4: Markdown-Komponente** — `src/ui/info/Markdown.tsx`:

```tsx
import { Fragment, useMemo } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { parseMarkdown } from './markdown';
import type { Block, Inline } from './markdown';
import { verweisAufloesen } from '../../data/verweise';
import type { Verweis } from '../../data/verweise';
import { VERWEIS_KNOPF } from './Datenblock';

interface Props {
  text: string;
  onVerweis: (v: Verweis) => void;
  /** Die erste Überschrift der Ebene 1 steht schon im Panelkopf. */
  titelAusblenden?: boolean;
}

/** Mittelklick, Strg-, Cmd- oder Umschalt-Klick: der Browser öffnet den Tab, wir greifen nicht ein. */
const willNeuenTab = (e: MouseEvent): boolean => e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey;

function Verweisknoten({ ziel, onVerweis, children }: { ziel: string; onVerweis: (v: Verweis) => void; children: ReactNode }): React.JSX.Element {
  const v = verweisAufloesen(ziel);
  if (v === null) return <span>{children}</span>;
  if (v.art === 'extern') {
    return <a href={v.url} target="_blank" rel="noopener noreferrer" className={VERWEIS_KNOPF}>{children}</a>;
  }
  if (v.art === 'quelle') {
    // Anker mit echter Adresse: Mittelklick öffnet den Tab, Linksklick hebt
    // die Karte hervor (Entwurf 4c §4.3).
    return (
      <a
        href={v.quelle.url}
        target="_blank"
        rel="noopener noreferrer"
        className={VERWEIS_KNOPF}
        onClick={(e) => {
          if (willNeuenTab(e)) return;
          e.preventDefault();
          onVerweis(v);
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={VERWEIS_KNOPF} onClick={() => { onVerweis(v); }}>
      {children}
    </button>
  );
}

function Inlines({ kinder, onVerweis }: { kinder: Inline[]; onVerweis: (v: Verweis) => void }): React.JSX.Element {
  return (
    <>
      {kinder.map((k, i) => {
        switch (k.typ) {
          case 'text': return <Fragment key={i}>{k.text}</Fragment>;
          case 'fett': return <strong key={i}><Inlines kinder={k.kinder} onVerweis={onVerweis} /></strong>;
          case 'kursiv': return <em key={i}><Inlines kinder={k.kinder} onVerweis={onVerweis} /></em>;
          case 'link':
            return (
              <Verweisknoten key={i} ziel={k.ziel} onVerweis={onVerweis}>
                <Inlines kinder={k.kinder} onVerweis={onVerweis} />
              </Verweisknoten>
            );
        }
      })}
    </>
  );
}

const UEBERSCHRIFT_KLASSE = {
  1: 'text-base font-semibold',
  2: 'mt-1 text-sm font-semibold',
  3: 'mt-1 text-sm font-medium opacity-90',
} as const;

function Blockknoten({ block, onVerweis }: { block: Block; onVerweis: (v: Verweis) => void }): React.JSX.Element {
  switch (block.typ) {
    case 'ueberschrift': {
      // Ebene 1 der Datei wird zu h2: h1 gehört dem Dokument, nicht dem Panel.
      const Tag = (`h${block.ebene + 1}`) as 'h2' | 'h3' | 'h4';
      return <Tag className={UEBERSCHRIFT_KLASSE[block.ebene]}><Inlines kinder={block.kinder} onVerweis={onVerweis} /></Tag>;
    }
    case 'absatz':
      return <p className="m-0"><Inlines kinder={block.kinder} onVerweis={onVerweis} /></p>;
    case 'liste': {
      const Tag = block.geordnet ? 'ol' : 'ul';
      return (
        <Tag className={`m-0 flex flex-col gap-1 pl-5 ${block.geordnet ? 'list-decimal' : 'list-disc'}`}>
          {block.punkte.map((punkt, i) => <li key={i}><Inlines kinder={punkt} onVerweis={onVerweis} /></li>)}
        </Tag>
      );
    }
  }
}

/** Gibt einen Erläuterungstext aus; der Baum kommt aus parseMarkdown. */
export function Markdown({ text, onVerweis, titelAusblenden = false }: Props): React.JSX.Element {
  const bloecke = useMemo(() => {
    const alle = parseMarkdown(text);
    if (!titelAusblenden) return alle;
    const erster = alle.findIndex((b) => b.typ === 'ueberschrift' && b.ebene === 1);
    return erster < 0 ? alle : alle.filter((_, i) => i !== erster);
  }, [text, titelAusblenden]);

  return (
    <div className="flex flex-col gap-2 text-sm leading-relaxed">
      {bloecke.map((block, i) => <Blockknoten key={i} block={block} onVerweis={onVerweis} />)}
    </div>
  );
}
```

Run: `npx vitest run src/ui/info/Markdown.test.tsx`
Expected: PASS.

- [ ] **Schritt 5: Fehlschlagende Tests für die Quellenkarten** — `src/ui/info/Quellenkarten.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Quellenkarten } from './Quellenkarten';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
afterEach(() => { setSprache('de'); });

describe('Quellenkarten', () => {
  it('zeigt die Karten zur Kennung gruppiert nach Art, Faktenblätter zuerst', () => {
    render(<Quellenkarten kennung="objekt:earth" hervorgehoben={null} />);
    const gruppen = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(gruppen[0]).toBe('Faktenblatt');
    expect(gruppen).toContain('Übersicht');
    const karte = screen.getByRole('link', { name: /Erde: Faktenblatt \(NSSDC\)/ }) as HTMLAnchorElement;
    expect(karte.href).toContain('nssdc.gsfc.nasa.gov');
    expect(karte.target).toBe('_blank');
    expect(karte.rel).toContain('noopener');
    expect(karte.textContent).toContain('NASA');
    expect(karte.textContent).toContain('öffnet neuen Tab');
  });

  it('meldet, wenn es keine Quellen gibt', () => {
    render(<Quellenkarten kennung="objekt:vulcan" hervorgehoben={null} />);
    expect(screen.getByText('Keine Quellen zu diesem Text.')).toBeTruthy();
  });

  it('hebt die gewählte Karte hervor', () => {
    render(<Quellenkarten kennung="objekt:earth" hervorgehoben="nasa-earth" />);
    const karte = screen.getByRole('link', { name: /Erde bei NASA Science/ });
    expect(karte.className).toContain('border-sky-300');
    const andere = screen.getByRole('link', { name: /Erde: Faktenblatt/ });
    expect(andere.className).not.toContain('border-sky-300');
  });

  it('zeigt englische Titel und stellt englische Seiten in der Gruppe nach vorn', () => {
    useStore.getState().setUi({ language: 'en' });
    setSprache('en');
    render(<Quellenkarten kennung="objekt:earth" hervorgehoben={null} />);
    expect(screen.getByRole('link', { name: /Earth Fact Sheet \(NSSDC\)/ })).toBeTruthy();
    const uebersichten = screen.getAllByRole('link').map((a) => a.textContent ?? '');
    const ersteWikipedia = uebersichten.find((t) => t.includes('Wikipedia'));
    expect(ersteWikipedia).toContain('Earth (Wikipedia)');
  });
});
```

Run: `npx vitest run src/ui/info/Quellenkarten.test.tsx`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 6: Quellenkarten** — `src/ui/info/Quellenkarten.tsx`:

```tsx
import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../store';
import { quellenFuer, QUELLEN_ART_REIHENFOLGE } from '../../data/quellen';
import type { Quelle } from '../../data/quellen';
import { t } from '../i18n';

interface Props {
  /** Text-Kennung wie 'objekt:earth'. */
  kennung: string;
  /** Kennung einer Quelle, die gerade hervorgehoben ist (Verweis im Text). */
  hervorgehoben: string | null;
}

const herausgeberName = (q: Quelle): string =>
  (q.herausgeber === 'sonstige' ? t('quelle.herausgeber.sonstige') : q.herausgeber);

/**
 * Unteres Segment (Entwurf 4c §4.4): Karten zu den passenden Quellen, nach
 * Art gruppiert, in der Gruppe zuerst die Seiten in der Oberflächensprache.
 * Jede Karte ist ein Anker im neuen Tab — nichts wird eingebettet.
 */
export function Quellenkarten({ kennung, hervorgehoben }: Props): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const liste = useMemo(() => quellenFuer(kennung, language), [kennung, language]);
  const karten = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    if (hervorgehoben === null) return;
    // jsdom kennt scrollIntoView nicht; im Browser ist es immer da.
    karten.current.get(hervorgehoben)?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [hervorgehoben]);

  if (liste.length === 0) {
    return <p className="m-0 text-xs opacity-70">{t('info.keineQuellen')}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {QUELLEN_ART_REIHENFOLGE.filter((art) => liste.some((q) => q.art === art)).map((art) => (
        <section key={art}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">{t(`quelle.art.${art}`)}</h3>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {liste.filter((q) => q.art === art).map((q) => (
              <li key={q.id}>
                <a
                  ref={(el) => {
                    if (el === null) karten.current.delete(q.id);
                    else karten.current.set(q.id, el);
                  }}
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-quelle={q.id}
                  className={`block rounded border px-2 py-1 text-xs transition-colors hover:bg-white/10 ${
                    hervorgehoben === q.id ? 'border-sky-300/80 bg-sky-400/20' : 'border-white/15'
                  }`}
                >
                  <span className="font-medium">{q.titel[language]}</span>
                  <span className="mt-0.5 block opacity-70">
                    {herausgeberName(q)} · {q.sprache.toUpperCase()} · {t('info.neuerTab')}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

Sprachschlüssel — `de.ts`:
```ts
  'info.neuerTab': 'öffnet neuen Tab',
  'info.keineQuellen': 'Keine Quellen zu diesem Text.',
```
`en.ts`:
```ts
  'info.neuerTab': 'opens in a new tab',
  'info.keineQuellen': 'No sources for this text.',
```

- [ ] **Schritt 7: Prüfen**

Run: `npx vitest run src/ui && npx tsc -b && npm run lint`
Expected: PASS.

- [ ] **Schritt 8: Commit**

```bash
git add src/ui/info src/ui/i18n
git commit -m "Infopanel: Markdown-Ausgabe mit Verweisen, Verweiswirkung und Quellenkarten"
```

---

### Task 10: Textauswahl und Griffe

**Dateien:**
- Erstellen: `src/ui/info/aktuellerText.ts`, `src/ui/info/aktuellerText.test.ts`
- Erstellen: `src/ui/info/Griff.tsx`, `src/ui/info/Griff.test.tsx`
- Ändern: `src/ui/i18n/de.ts`, `en.ts` (`info.griff.breite`, `info.griff.teilung`)

**Schnittstellen:**
- Konsumiert: `sceneIndexFor` (`sim/director.ts`), `SCENES`, `THEMEN`, `bodyIndex`, `textSchluessel` (`data/texte`).
- Produziert:
  ```ts
  // aktuellerText.ts
  export type Auswahlzustand = Pick<AppState, 'camera' | 'cinema' | 'ui'>;
  export function aktuellerText(s: Auswahlzustand): TextKennung;       // Thema > laufende Szene > Kameraziel
  export function grundlage(s: Auswahlzustand): string;                 // 'szene:<id>' oder 'objekt:<id>', ohne Thema
  export function ausweichTitel(k: TextKennung): string;                // Name aus den Sprachtabellen
  // Griff.tsx
  export function Griff(props: {
    richtung: 'senkrecht' | 'waagerecht';
    wert: number; min: number; max: number; schritt: number;
    label: string;
    ausVersatz: (startwert: number, deltaPx: number) => number;
    onWert: (wert: number) => void;
    className?: string;
  }): React.JSX.Element;
  ```

- [ ] **Schritt 1: Fehlschlagende Tests** — `src/ui/info/aktuellerText.test.ts`:

```ts
import { describe, it, expect, afterEach } from 'vitest';
import { aktuellerText, ausweichTitel, grundlage } from './aktuellerText';
import { DEFAULT_STATE } from '../../store';
import { SCENES } from '../../data/scenes';
import { sceneIndexFor } from '../../sim/director';
import { setSprache } from '../i18n';

const zustand = (aenderung: (s: typeof DEFAULT_STATE) => void) => {
  const s = structuredClone(DEFAULT_STATE);
  aenderung(s);
  return s;
};

afterEach(() => { setSprache('de'); });

describe('aktuellerText', () => {
  it('nimmt das Kameraziel, wenn kein Kino läuft', () => {
    const s = zustand((z) => { z.camera.targetId = 'saturn'; });
    expect(aktuellerText(s)).toEqual({ art: 'objekt', kennung: 'saturn' });
    expect(grundlage(s)).toBe('objekt:saturn');
  });

  it('nimmt die laufende Szene, auch bei Mischung', () => {
    const s = zustand((z) => { z.cinema.running = true; z.cinema.nummer = 7; z.cinema.shuffle = true; });
    const erwartet = SCENES[sceneIndexFor(7, SCENES.length, s.cinema.seed, true)]!.id;
    expect(aktuellerText(s)).toEqual({ art: 'szene', kennung: erwartet });
    expect(grundlage(s)).toBe(`szene:${erwartet}`);
  });

  it('ein gewähltes Thema geht vor, ändert aber die Grundlage nicht', () => {
    const s = zustand((z) => { z.ui.info.thema = 'modell'; z.camera.targetId = 'mars'; });
    expect(aktuellerText(s)).toEqual({ art: 'thema', kennung: 'modell' });
    expect(grundlage(s)).toBe('objekt:mars');
  });

  it('ausweichTitel nennt Körper, Szene und Thema in der Sprache der Oberfläche', () => {
    expect(ausweichTitel({ art: 'objekt', kennung: 'earth' })).toBe('Erde');
    expect(ausweichTitel({ art: 'thema', kennung: 'modell' })).toBe('Grenzen des Modells');
    expect(ausweichTitel({ art: 'szene', kennung: 'mondfinsternis' })).not.toMatch(/^\[/);
    setSprache('en');
    expect(ausweichTitel({ art: 'objekt', kennung: 'earth' })).toBe('Earth');
    expect(ausweichTitel({ art: 'objekt', kennung: 'vulcan' })).toBe('vulcan');
  });
});
```

`src/ui/info/Griff.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Griff } from './Griff';

const breite = (onWert: (w: number) => void, wert = 24) => (
  <Griff
    richtung="senkrecht" wert={wert} min={18} max={60} schritt={1} label="Breite"
    ausVersatz={(start, dx) => start - dx / 16} onWert={onWert}
  />
);

describe('Griff', () => {
  it('ist ein Trenner mit Wert, Grenzen und Ausrichtung', () => {
    render(breite(() => {}));
    const griff = screen.getByRole('separator', { name: 'Breite' });
    expect(griff.getAttribute('aria-orientation')).toBe('vertical');
    expect(griff.getAttribute('aria-valuenow')).toBe('24');
    expect(griff.getAttribute('aria-valuemin')).toBe('18');
    expect(griff.getAttribute('aria-valuemax')).toBe('60');
    expect(griff.tabIndex).toBe(0);
  });

  it('Pfeiltasten ändern den Wert schrittweise innerhalb der Grenzen und schlucken das Ereignis', () => {
    const onWert = vi.fn();
    render(breite(onWert, 59));
    const griff = screen.getByRole('separator');
    const links = fireEvent.keyDown(griff, { key: 'ArrowLeft' });
    expect(links).toBe(false);
    expect(onWert).toHaveBeenLastCalledWith(60);
    fireEvent.keyDown(griff, { key: 'ArrowLeft' });
    expect(onWert).toHaveBeenLastCalledWith(60);
    fireEvent.keyDown(griff, { key: 'ArrowRight' });
    expect(onWert).toHaveBeenLastCalledWith(58);
    fireEvent.keyDown(griff, { key: 'Home' });
    expect(onWert).toHaveBeenLastCalledWith(18);
    fireEvent.keyDown(griff, { key: 'End' });
    expect(onWert).toHaveBeenLastCalledWith(60);
    const fremd = fireEvent.keyDown(griff, { key: 'a' });
    expect(fremd).toBe(true);
  });

  it('Ziehen rechnet den Versatz über ausVersatz um und klemmt an den Grenzen', () => {
    const onWert = vi.fn();
    render(breite(onWert));
    const griff = screen.getByRole('separator');
    fireEvent.pointerDown(griff, { clientX: 400, pointerId: 1, button: 0 });
    fireEvent.pointerMove(griff, { clientX: 368, pointerId: 1 });
    expect(onWert).toHaveBeenLastCalledWith(26);
    fireEvent.pointerMove(griff, { clientX: 2000, pointerId: 1 });
    expect(onWert).toHaveBeenLastCalledWith(18);
    fireEvent.pointerUp(griff, { pointerId: 1 });
    fireEvent.pointerMove(griff, { clientX: 100, pointerId: 1 });
    expect(onWert).toHaveBeenCalledTimes(2);
  });

  it('waagerecht: Pfeil hoch verkleinert, Pfeil runter vergrößert', () => {
    const onWert = vi.fn();
    render(
      <Griff richtung="waagerecht" wert={0.5} min={0.2} max={0.9} schritt={0.05} label="Teilung"
        ausVersatz={(start, dy) => start + dy / 400} onWert={onWert} />,
    );
    const griff = screen.getByRole('separator', { name: 'Teilung' });
    expect(griff.getAttribute('aria-orientation')).toBe('horizontal');
    fireEvent.keyDown(griff, { key: 'ArrowUp' });
    expect(onWert).toHaveBeenLastCalledWith(0.45);
    fireEvent.keyDown(griff, { key: 'ArrowDown' });
    expect(onWert).toHaveBeenLastCalledWith(0.55);
    fireEvent.pointerDown(griff, { clientY: 300, pointerId: 2, button: 0 });
    fireEvent.pointerMove(griff, { clientY: 340, pointerId: 2 });
    expect(onWert).toHaveBeenLastCalledWith(0.6);
  });
});
```

Run: `npx vitest run src/ui/info/aktuellerText.test.ts src/ui/info/Griff.test.tsx`
Expected: FAIL (Module fehlen).

- [ ] **Schritt 2: Textauswahl** — `src/ui/info/aktuellerText.ts`:

```ts
import type { AppState } from '../../store/types';
import type { TextKennung } from '../../data/texte';
import { textSchluessel } from '../../data/texte';
import { SCENES } from '../../data/scenes';
import { THEMEN } from '../../data/themen';
import { bodyIndex } from '../../data';
import { sceneIndexFor } from '../../sim/director';
import { t } from '../i18n';

export type Auswahlzustand = Pick<AppState, 'camera' | 'cinema' | 'ui'>;

function laufendeSzene(s: Auswahlzustand): string | null {
  if (!s.cinema.running) return null;
  const index = sceneIndexFor(s.cinema.nummer, SCENES.length, s.cinema.seed, s.cinema.shuffle);
  return SCENES[index]?.id ?? SCENES[0]?.id ?? null;
}

/**
 * Welche Kennung das Panel gerade zeigt (Entwurf 4c §3.3): ein per Verweis
 * gewähltes Thema, sonst die laufende Kinoszene, sonst das Kameraziel.
 */
export function aktuellerText(s: Auswahlzustand): TextKennung {
  if (s.ui.info.thema !== null) return { art: 'thema', kennung: s.ui.info.thema };
  const szene = laufendeSzene(s);
  if (szene !== null) return { art: 'szene', kennung: szene };
  return { art: 'objekt', kennung: s.camera.targetId };
}

/**
 * Dieselbe Auswahl ohne das Thema: Wechselt sie, verfällt ein gewähltes
 * Thema. Als Zeichenkette, damit ein Store-Selektor sie ohne neues Objekt
 * je Aufruf zurückgeben kann.
 */
export function grundlage(s: Auswahlzustand): string {
  const szene = laufendeSzene(s);
  return szene !== null ? `szene:${szene}` : `objekt:${s.camera.targetId}`;
}

/** Titel, wenn kein Text da ist oder der Text keine Überschrift trägt. */
export function ausweichTitel(k: TextKennung): string {
  switch (k.art) {
    case 'objekt': {
      const body = bodyIndex[k.kennung];
      return body === undefined ? k.kennung : t(body.info.nameKey);
    }
    case 'szene': {
      const szene = SCENES.find((s) => s.id === k.kennung);
      return szene === undefined ? k.kennung : t(szene.titleKey);
    }
    case 'thema': {
      const thema = THEMEN.find((th) => th.id === k.kennung);
      return thema === undefined ? k.kennung : t(thema.titleKey);
    }
  }
}

export { textSchluessel };
```

- [ ] **Schritt 3: Griff** — `src/ui/info/Griff.tsx`:

```tsx
import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

interface Props {
  /** senkrecht: stehender Balken (Breite, dx); waagerecht: liegender Balken (Teilung, dy). */
  richtung: 'senkrecht' | 'waagerecht';
  wert: number;
  min: number;
  max: number;
  schritt: number;
  label: string;
  /** Neuer Wert aus dem Wert beim Anfassen und dem Zeigerversatz in Pixeln. */
  ausVersatz: (startwert: number, deltaPx: number) => number;
  onWert: (wert: number) => void;
  className?: string;
}

/**
 * Trenn- und Breitengriff (Entwurf 4c §3.2): role="separator" mit Wert und
 * Grenzen, Ziehen per Pointer-Capture, Pfeiltasten in Schritten, Pos1/Ende
 * an die Grenzen. Beim Breitengriff vergrößert Pfeil links (die Kante
 * wandert nach links), beim Teilungsgriff vergrößert Pfeil runter.
 * Pointer-Ereignisse kommen im Browser ohnehin höchstens einmal je Bild,
 * deshalb keine eigene Drosselung (Ruling 6).
 */
export function Griff(p: Props): React.JSX.Element {
  const start = useRef<{ pos: number; wert: number } | null>(null);
  const senkrecht = p.richtung === 'senkrecht';
  const begrenze = (w: number): number => Math.min(Math.max(w, p.min), p.max);
  const runde = (w: number): number => Number(w.toFixed(4));
  const position = (e: PointerEvent): number => (senkrecht ? e.clientX : e.clientY);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0) return;
    // jsdom kennt kein Pointer-Capture; im Browser hält es den Griff auch
    // dann, wenn der Zeiger über die Canvas wandert.
    e.currentTarget.setPointerCapture?.(e.pointerId);
    start.current = { pos: position(e), wert: p.wert };
    e.preventDefault();
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>): void => {
    if (start.current === null) return;
    p.onWert(runde(begrenze(p.ausVersatz(start.current.wert, position(e) - start.current.pos))));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>): void => {
    if (start.current === null) return;
    start.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    const groesser = senkrecht ? 'ArrowLeft' : 'ArrowDown';
    const kleiner = senkrecht ? 'ArrowRight' : 'ArrowUp';
    let neu: number | null = null;
    if (e.key === groesser) neu = p.wert + p.schritt;
    else if (e.key === kleiner) neu = p.wert - p.schritt;
    else if (e.key === 'Home') neu = p.min;
    else if (e.key === 'End') neu = p.max;
    if (neu === null) return;
    // Vor den globalen Kürzeln (Pfeile ändern sonst die Zeitraffung).
    e.preventDefault();
    p.onWert(runde(begrenze(neu)));
  };

  return (
    <div
      role="separator"
      aria-orientation={senkrecht ? 'vertical' : 'horizontal'}
      aria-valuenow={p.wert}
      aria-valuemin={p.min}
      aria-valuemax={p.max}
      aria-label={p.label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={`touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 ${
        senkrecht ? 'cursor-col-resize' : 'cursor-row-resize'
      } ${p.className ?? ''}`}
    />
  );
}
```

Sprachschlüssel — `de.ts`:
```ts
  'info.griff.breite': 'Breite des Infopanels',
  'info.griff.teilung': 'Teilung zwischen Text und Quellen',
```
`en.ts`:
```ts
  'info.griff.breite': 'Width of the info panel',
  'info.griff.teilung': 'Split between text and sources',
```

- [ ] **Schritt 4: Prüfen und committen**

Run: `npx vitest run src/ui/info && npx tsc -b && npm run lint`
Expected: PASS. Sollte `aria-valuenow` als Zeichenkette mit Nachkommastellen scheitern (`'0.5'`), ist das Verhalten richtig; die Erwartung im ersten Test betrifft nur ganze Zahlen.

```bash
git add src/ui/info src/ui/i18n
git commit -m "Infopanel: Textauswahl aus Ziel, Szene und Thema; Griff mit Maus und Tastatur"
```

---

### Task 11: Infopanel, Layout, Taste I

**Dateien:**
- Erstellen: `src/ui/info/InfoPanel.tsx`, `src/ui/info/InfoPanel.test.tsx`
- Ändern: `src/ui/App.tsx`, `src/index.css`, `src/ui/shortcuts/useShortcuts.ts`, `src/ui/shortcuts/useShortcuts.test.ts`
- Ändern: `src/ui/i18n/de.ts`, `en.ts`, `i18n.test.ts`

**Schnittstellen:**
- Konsumiert: alles aus den Tasks 2 bis 10.
- Produziert: `export function InfoPanel(): React.JSX.Element`, `export const INFO_PANEL = 'info'` (Schlüssel in `ui.panels`), `export const SCHMAL_ABFRAGE = '(max-width: 899px)'`.

- [ ] **Schritt 1: Sprachschlüssel** — `de.ts`:

```ts
  'panel.info': 'Info',
  'info.niveau': 'Niveau',
  'info.tab.grundschule': 'Grundschule',
  'info.tab.gymnasium': 'Gymnasium',
  'info.tab.hochschule': 'Hochschule',
  'info.quellen': 'Quellen',
  'info.oeffnen': 'Infopanel einblenden',
  'info.schliessen': 'Infopanel ausblenden',
  'info.nichtUebersetzt': 'Noch nicht übersetzt, deutscher Text.',
  'info.keinText': 'Zu diesem Eintrag gibt es noch keinen Text.',
  'info.hochschuleFolgt': 'Der Hochschultext folgt in einer späteren Phase; gezeigt wird der Gymnasialtext.',
  'info.szene.ziel': 'Standort',
  'info.szene.blick': 'Blickziel',
  'shortcuts.info': 'Infopanel ein- und ausblenden',
```

`en.ts`:

```ts
  'panel.info': 'Info',
  'info.niveau': 'Level',
  'info.tab.grundschule': 'Primary school',
  'info.tab.gymnasium': 'Secondary school',
  'info.tab.hochschule': 'University',
  'info.quellen': 'Sources',
  'info.oeffnen': 'Show info panel',
  'info.schliessen': 'Hide info panel',
  'info.nichtUebersetzt': 'Not translated yet; German text shown.',
  'info.keinText': 'There is no text for this entry yet.',
  'info.hochschuleFolgt': 'The university-level text will follow in a later phase; the secondary-school text is shown.',
  'info.szene.ziel': 'Location',
  'info.szene.blick': 'Looking at',
  'shortcuts.info': 'Show and hide the info panel',
```

In `src/ui/i18n/i18n.test.ts` `'panel.info'` in `GLEICH_ERLAUBT` aufnehmen.

- [ ] **Schritt 2: Fehlschlagende Tests** — `src/ui/info/InfoPanel.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { InfoPanel, INFO_PANEL } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  setSprache('de');
});
afterEach(() => { setSprache('de'); });

const titel = (): Promise<HTMLElement> => screen.findByRole('heading', { level: 2 });

describe('InfoPanel', () => {
  it('lädt den Text zum Kameraziel, zeigt Titel, Datenblock, Tabs und Quellen', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    expect((await titel()).textContent).toBe('Erde');
    expect(screen.getByTestId('datenblock')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Gymnasium', selected: true })).toBeTruthy();
    expect(await screen.findByText(/Astronomischen Einheit/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Erde: Faktenblatt \(NSSDC\)/ })).toBeTruthy();
    // Die Überschrift der Datei steht nicht noch einmal im Text.
    expect(screen.getAllByRole('heading', { name: 'Erde' })).toHaveLength(1);
  });

  it('Tabs schalten das Niveau, Pfeiltasten wandern', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    await titel();
    fireEvent.click(screen.getByRole('tab', { name: 'Grundschule' }));
    expect(useStore.getState().ui.info.niveau).toBe('grundschule');
    expect((await titel()).textContent).toBe('Die Erde');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Grundschule' }), { key: 'ArrowRight' });
    expect(useStore.getState().ui.info.niveau).toBe('gymnasium');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Gymnasium' }), { key: 'ArrowLeft' });
    expect(useStore.getState().ui.info.niveau).toBe('grundschule');
  });

  it('Hochschule ohne Text zeigt den Gymnasialtext mit Hinweis', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    useStore.getState().setInfo({ niveau: 'hochschule' });
    render(<InfoPanel />);
    expect(await screen.findByText(/Der Hochschultext folgt/)).toBeTruthy();
    expect(await screen.findByText(/Astronomischen Einheit/)).toBeTruthy();
    expect(screen.getByText('Große Halbachse')).toBeTruthy();
  });

  it('ohne Text: Datenblock, Ausweichtitel und Hinweis', async () => {
    useStore.getState().setCamera({ targetId: 'pluto' });
    render(<InfoPanel />);
    expect((await titel()).textContent).toBe('Pluto');
    expect(await screen.findByText('Zu diesem Eintrag gibt es noch keinen Text.')).toBeTruthy();
    expect(screen.getByText('Keine Quellen zu diesem Text.')).toBeTruthy();
  });

  it('Themenverweis wechselt den Text; ein Zielwechsel löscht das Thema', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    fireEvent.click(await screen.findByRole('button', { name: 'Mondfinsternis' }));
    expect(useStore.getState().ui.info.thema).toBe('finsternis');
    expect((await titel()).textContent).toBe('Finsternisse');
    act(() => { useStore.getState().setCamera({ targetId: 'mars' }); });
    expect(useStore.getState().ui.info.thema).toBeNull();
    expect((await titel()).textContent).toBe('Mars');
  });

  it('Objektverweis fährt die Kamera und wechselt den Text', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    fireEvent.click(await screen.findByRole('button', { name: 'Mond' }));
    expect(useStore.getState().camera.targetId).toBe('moon');
    expect((await titel()).textContent).toBe('Mond');
    fahrtAbbrechen();
  });

  it('Quellenverweis hebt die Karte hervor', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    fireEvent.click(await screen.findByRole('link', { name: 'NSSDC Earth Fact Sheet' }));
    expect(screen.getByRole('link', { name: /Erde: Faktenblatt \(NSSDC\)/ }).className).toContain('border-sky-300');
  });

  it('im laufenden Kino zeigt es die Szene mit Standort und Blickziel', async () => {
    useStore.getState().setCinema({ running: true, shuffle: false, nummer: 18 });
    render(<InfoPanel />);
    expect((await titel()).textContent).toBe('Szene: Mondfinsternis');
    expect(screen.getByText('Standort')).toBeTruthy();
    expect(screen.queryByTestId('datenblock')).toBeNull();
  });

  it('Griffe schreiben Breite und Teilung in den Store', async () => {
    render(<InfoPanel />);
    await titel();
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Breite des Infopanels' }), { key: 'ArrowLeft' });
    expect(useStore.getState().ui.info.breiteRem).toBe(25);
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Teilung zwischen Text und Quellen' }), { key: 'ArrowUp' });
    expect(useStore.getState().ui.info.teilung).toBe(0.6);
  });

  it('klappt zu und auf', async () => {
    render(<InfoPanel />);
    await titel();
    fireEvent.click(screen.getByRole('button', { name: 'Infopanel ausblenden' }));
    expect(useStore.getState().ui.panels[INFO_PANEL]).toBe(false);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Infopanel einblenden' }));
    expect(useStore.getState().ui.panels[INFO_PANEL]).toBe(true);
    expect(await titel()).toBeTruthy();
  });

  it('zeigt englische Texte', async () => {
    useStore.getState().setUi({ language: 'en' });
    setSprache('en');
    useStore.getState().setCamera({ targetId: 'saturn' });
    render(<InfoPanel />);
    expect(await screen.findByText(/second largest/)).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Secondary school' })).toBeTruthy();
  });
});
```

Die Szenennummer 18 im Kino-Test setzt voraus, dass `mondfinsternis` an Position 18 in `SCENES` steht (letzter Eintrag von 19); sonst den Index mit `SCENES.findIndex` bestimmen.

Ans Ende von `src/ui/shortcuts/useShortcuts.test.ts`:

```ts
  it('schaltet das Infopanel mit I um', () => {
    expect(handleShortcut('i')).toBe(true);
    expect(useStore.getState().ui.panels.info).toBe(false);
    handleShortcut('i');
    expect(useStore.getState().ui.panels.info).toBe(true);
  });
```

Run: `npx vitest run src/ui/info/InfoPanel.test.tsx src/ui/shortcuts`
Expected: FAIL (Modul fehlt, Taste unbelegt).

- [ ] **Schritt 3: Panel** — `src/ui/info/InfoPanel.tsx`:

```tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useStore } from '../../store';
import {
  INFO_BREITE_MAX_REM, INFO_BREITE_MIN_REM, INFO_TEILUNG_MAX, INFO_TEILUNG_MIN,
} from '../../store/types';
import { bodyIndex } from '../../data';
import { SCENES } from '../../data/scenes';
import { NIVEAUS } from '../../data/themen';
import type { Niveau } from '../../data/themen';
import { ladeMitAusweich } from '../../data/texte';
import type { GeladenerText, TextKennung } from '../../data/texte';
import type { Verweis } from '../../data/verweise';
import { t } from '../i18n';
import { aktuellerText, ausweichTitel, grundlage, textSchluessel } from './aktuellerText';
import { parseMarkdown, titelVon } from './markdown';
import { Markdown } from './Markdown';
import { Datenblock, VERWEIS_KNOPF } from './Datenblock';
import { Quellenkarten } from './Quellenkarten';
import { Griff } from './Griff';
import { verweisAusfuehren } from './verweisAusfuehren';

/** Schlüssel in ui.panels; anders als die anderen Panels ohne Standardeintrag (siehe useSchmal). */
export const INFO_PANEL = 'info';
/** Unterhalb wird die Spalte zum Bogen von unten (Entwurf 4c §3.4). */
export const SCHMAL_ABFRAGE = '(max-width: 899px)';
/** So lange bleibt eine Quellenkarte nach einem Verweis hervorgehoben. */
const HERVORHEBUNG_MS = 1500;
/** Höchstbreite als Anteil der Fensterbreite. */
const BREITE_MAX_ANTEIL = 0.6;

const remPx = (): number =>
  (typeof document === 'undefined' ? 16 : parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);

function useSchmal(): boolean {
  const abfrage = (): boolean =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(SCHMAL_ABFRAGE).matches;
  const [schmal, setSchmal] = useState(abfrage);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(SCHMAL_ABFRAGE);
    const bei = (): void => { setSchmal(mq.matches); };
    mq.addEventListener('change', bei);
    return () => { mq.removeEventListener('change', bei); };
  }, []);
  return schmal;
}

interface Anzeige { schluessel: string; niveau: Niveau; sprache: 'de' | 'en'; geladen: GeladenerText | null }

/** Standort und Blickziel einer Szene als Objektverweise (Entwurf 4c §5.1). */
function Szenenkopf({ kennung, onVerweis }: { kennung: string; onVerweis: (v: Verweis) => void }): React.JSX.Element | null {
  const szene = SCENES.find((s) => s.id === kennung);
  if (szene === undefined) return null;
  const knopf = (id: string): React.JSX.Element | null => {
    const body = bodyIndex[id];
    if (body === undefined) return null;
    return (
      <button type="button" className={VERWEIS_KNOPF} onClick={() => { onVerweis({ art: 'objekt', kennung: id }); }}>
        {t(body.info.nameKey)}
      </button>
    );
  };
  return (
    <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
      <dt className="opacity-70">{t('info.szene.ziel')}</dt>
      <dd className="m-0">{knopf(szene.targetId)}</dd>
      {szene.lookAtId !== undefined ? (
        <>
          <dt className="opacity-70">{t('info.szene.blick')}</dt>
          <dd className="m-0">{knopf(szene.lookAtId)}</dd>
        </>
      ) : null}
    </dl>
  );
}

const TAB = 'rounded-t border-b-2 px-2 py-1 text-xs';
const TAB_AKTIV = `${TAB} border-sky-300 font-semibold`;
const TAB_RUHIG = `${TAB} border-transparent opacity-70 hover:opacity-100`;

/**
 * Rechte Spalte (Entwurf 4c §3): Kopf mit Titel, drei Niveau-Tabs, oben
 * Datenblock und Text, unten Quellenkarten; Breiten- und Teilungsgriff.
 * Der Text wird beim Wechsel von Kennung, Niveau oder Sprache faul geladen;
 * bis dahin bleibt der vorige stehen, damit nichts flackert.
 */
export function InfoPanel(): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const info = useStore((s) => s.ui.info);
  const setInfo = useStore((s) => s.setInfo);
  const setUi = useStore((s) => s.setUi);
  const panels = useStore((s) => s.ui.panels);
  const schmal = useSchmal();
  const offen = panels[INFO_PANEL] ?? !schmal;
  const schluessel = useStore((s) => textSchluessel(aktuellerText(s)));
  const basis = useStore(grundlage);
  const kennung = useMemo<TextKennung>(() => {
    const [art, rest] = schluessel.split(/:(.*)/s);
    return { art: art as TextKennung['art'], kennung: rest ?? '' };
  }, [schluessel]);

  // Ein gewähltes Thema verfällt, sobald Ziel oder Szene wechseln (§3.3).
  const vorigeBasis = useRef(basis);
  useEffect(() => {
    if (vorigeBasis.current === basis) return;
    vorigeBasis.current = basis;
    if (useStore.getState().ui.info.thema !== null) setInfo({ thema: null });
  }, [basis, setInfo]);

  const [anzeige, setAnzeige] = useState<Anzeige | null>(null);
  useEffect(() => {
    let aktuell = true;
    void ladeMitAusweich(language, info.niveau, kennung).then((geladen) => {
      if (aktuell) setAnzeige({ schluessel, niveau: info.niveau, sprache: language, geladen });
    });
    return () => { aktuell = false; };
  }, [schluessel, kennung, info.niveau, language]);

  const oben = useRef<HTMLDivElement | null>(null);
  const segmente = useRef<HTMLDivElement | null>(null);
  useEffect(() => { oben.current?.scrollTo?.(0, 0); }, [schluessel]);

  const [hervorgehoben, setHervorgehoben] = useState<string | null>(null);
  const hervorhebung = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (hervorhebung.current !== null) clearTimeout(hervorhebung.current); }, []);
  const hebeHervor = (id: string): void => {
    setHervorgehoben(id);
    if (hervorhebung.current !== null) clearTimeout(hervorhebung.current);
    hervorhebung.current = setTimeout(() => { setHervorgehoben(null); hervorhebung.current = null; }, HERVORHEBUNG_MS);
  };
  const onVerweis = (v: Verweis): void => { verweisAusfuehren(v, { hebeHervor }); };

  const geladen = anzeige?.geladen ?? null;
  const text = geladen?.text ?? null;
  const titel = useMemo(
    () => (text === null ? null : titelVon(parseMarkdown(text))) ?? ausweichTitel(kennung),
    [text, kennung, language],
  );
  const body = kennung.art === 'objekt' ? bodyIndex[kennung.kennung] : undefined;
  const hinweise: string[] = [];
  if (anzeige !== null && geladen === null) hinweise.push('info.keinText');
  if (geladen !== null && info.niveau === 'hochschule' && geladen.niveau !== 'hochschule') hinweise.push('info.hochschuleFolgt');
  if (geladen !== null && geladen.sprache !== language) hinweise.push('info.nichtUebersetzt');

  const tabTasten = (e: KeyboardEvent<HTMLDivElement>): void => {
    const i = NIVEAUS.indexOf(info.niveau);
    const richtung = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (richtung === 0) return;
    e.preventDefault();
    const neu = NIVEAUS[(i + richtung + NIVEAUS.length) % NIVEAUS.length];
    if (neu !== undefined) setInfo({ niveau: neu });
  };

  const breiteMax = Math.min(
    INFO_BREITE_MAX_REM,
    typeof window === 'undefined' ? INFO_BREITE_MAX_REM : Math.floor((window.innerWidth * BREITE_MAX_ANTEIL) / remPx()),
  );

  if (!offen) {
    return (
      <button
        type="button"
        aria-expanded={false}
        aria-label={t('info.oeffnen')}
        onClick={() => { setUi({ panels: { ...panels, [INFO_PANEL]: true } }); }}
        className="info-reiter pointer-events-auto self-start rounded-lg border border-white/10 bg-slate-900/70 px-1 py-2 text-xs font-semibold text-slate-100 backdrop-blur-md hover:bg-white/10"
      >
        {t('panel.info')}
      </button>
    );
  }

  return (
    <aside
      aria-label={t('panel.info')}
      className="info-panel pointer-events-auto relative flex max-h-full flex-col rounded-lg border border-white/10 bg-slate-900/70 text-slate-100 backdrop-blur-md"
      style={{ width: `${info.breiteRem}rem` }}
    >
      {schmal ? null : (
        <Griff
          richtung="senkrecht"
          wert={info.breiteRem}
          min={INFO_BREITE_MIN_REM}
          max={Math.max(INFO_BREITE_MIN_REM, breiteMax)}
          schritt={1}
          label={t('info.griff.breite')}
          ausVersatz={(start, dx) => start - dx / remPx()}
          onWert={(breiteRem) => { setInfo({ breiteRem }); }}
          className="absolute top-0 left-0 z-10 h-full w-2 -translate-x-1/2 rounded hover:bg-sky-300/30"
        />
      )}
      <header className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <h2 className="m-0 truncate text-sm font-semibold">{titel}</h2>
        <button
          type="button"
          aria-expanded
          aria-label={t('info.schliessen')}
          onClick={() => { setUi({ panels: { ...panels, [INFO_PANEL]: false } }); }}
          className="text-xs opacity-70 hover:opacity-100"
        >
          ▾
        </button>
      </header>
      <div role="tablist" aria-label={t('info.niveau')} onKeyDown={tabTasten} className="flex gap-1 border-b border-white/10 px-3 pt-1">
        {NIVEAUS.map((n) => (
          <button
            key={n}
            type="button"
            role="tab"
            aria-selected={n === info.niveau}
            tabIndex={n === info.niveau ? 0 : -1}
            onClick={() => { setInfo({ niveau: n }); }}
            className={n === info.niveau ? TAB_AKTIV : TAB_RUHIG}
          >
            {t(`info.tab.${n}`)}
          </button>
        ))}
      </div>
      <div ref={segmente} className="flex min-h-0 flex-1 flex-col">
        <div ref={oben} role="tabpanel" className="min-h-0 overflow-y-auto px-3 py-2" style={{ flex: `${info.teilung} 1 0px` }}>
          {hinweise.map((h) => <p key={h} className="m-0 mb-2 text-xs text-amber-300">{t(h)}</p>)}
          {body !== undefined ? (
            <Datenblock body={body} niveau={info.niveau} onModell={() => { setInfo({ thema: 'modell' }); }} />
          ) : null}
          {kennung.art === 'szene' ? <Szenenkopf kennung={kennung.kennung} onVerweis={onVerweis} /> : null}
          {text !== null ? <Markdown text={text} onVerweis={onVerweis} titelAusblenden /> : null}
        </div>
        <Griff
          richtung="waagerecht"
          wert={info.teilung}
          min={INFO_TEILUNG_MIN}
          max={INFO_TEILUNG_MAX}
          schritt={0.05}
          label={t('info.griff.teilung')}
          ausVersatz={(start, dy) => start + dy / Math.max(segmente.current?.clientHeight ?? 600, 1)}
          onWert={(teilung) => { setInfo({ teilung }); }}
          className="h-2 shrink-0 border-y border-white/10 hover:bg-sky-300/30"
        />
        <div className="min-h-24 overflow-y-auto px-3 py-2" style={{ flex: `${1 - info.teilung} 1 0px` }}>
          <h3 className="m-0 mb-1 text-xs font-semibold opacity-70">{t('info.quellen')}</h3>
          <Quellenkarten kennung={schluessel} hervorgehoben={hervorgehoben} />
        </div>
      </div>
    </aside>
  );
}
```

Hinweis zur Kopplung an `t()`: `App` ruft `useSprache()` vor allem anderen; in Tests setzen die Fälle `setSprache` selbst. `language` steht deshalb in den `useMemo`-Abhängigkeiten des Titels.

- [ ] **Schritt 4: Layout, Stylesheet, Taste I**

`src/ui/App.tsx`: Import `import { InfoPanel } from './info/InfoPanel';`, in `KUERZEL` nach `['L', 'shortcuts.language']` die Zeile `['I', 'shortcuts.info'],`, und das Gerüst der Rückgabe:

```tsx
  return (
    <div className="pointer-events-none fixed inset-0 flex items-start justify-between gap-2 p-3 text-slate-100">
      <div className="flex max-h-full w-72 max-w-full flex-col gap-2 overflow-y-auto">
        <Kopfzeile />
        <TimePanel />
        <ScalePanel />
        <CinemaPanel />
        <CameraPanel />
        <DisplayPanel />
        <AnsichtenPanel />
        <BodyTree />
        {zeigeKuerzel ? <Kuerzeluebersicht /> : null}
      </div>
      <InfoPanel />
    </div>
  );
```

`src/index.css` anhängen:

```css
/* Infopanel: rechte Spalte; unter 900 px ein Bogen von unten mit voller
   Breite (Entwurf 4c §3.4). Die Breite kommt sonst aus dem Store. */
.info-reiter { writing-mode: vertical-rl; }
@media (max-width: 899px) {
  .info-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto !important;
    height: 45vh;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  .info-reiter {
    position: fixed;
    right: 0.75rem;
    bottom: 0.75rem;
    writing-mode: horizontal-tb;
  }
}
```

`src/ui/shortcuts/useShortcuts.ts`: Import `import { INFO_PANEL } from '../info/InfoPanel';` und vor `default:`:

```ts
    case 'i':
      // Ohne Eintrag gilt das Panel als offen (auf schmalen Bildschirmen als
      // zu, siehe useSchmal); die Taste kippt den gespeicherten Wert.
      s.setUi({ panels: { ...s.ui.panels, [INFO_PANEL]: !(s.ui.panels[INFO_PANEL] ?? true) } });
      return true;
```

- [ ] **Schritt 5: Prüfen**

Run: `npx vitest run && npx tsc -b && npm run lint && npm run build`
Expected: alles grün. Bei einem Fehlschlag in `InfoPanel.test.tsx` zuerst prüfen, ob `ladeMitAusweich` im jsdom-Lauf die Datei findet (Vite-Glob); dann Abhängigkeiten der Effekte.

- [ ] **Schritt 6: Sichtkontrolle** — Server prüfen (200), Seite laden, `window.store.setState({ quality: { tier: 'high' } })`. Erwartet: rechte Spalte mit „Sonne", drei Tabs, Datenblock (Durchmesser, Masse, Rotationsperiode, Achsneigung), Hinweis „Zu diesem Eintrag gibt es noch keinen Text.", unten Karten NSSDC-Faktenblätter und NASA Eyes. Klick im Objektbaum auf Erde: Kamerafahrt, Titel „Erde", Text mit Verweisen; Klick auf „Mond" im Text fährt zum Mond. Taste `I` klappt zu und auf. Fenster auf 400 px: Bogen unten.

- [ ] **Schritt 7: Commit**

```bash
git add src/ui src/index.css
git commit -m "Infopanel: rechte Spalte mit Niveau-Tabs, Datenblock, Text, Quellen und Griffen; Taste I"
```

---

### Task 12: Abnahme, README, Abschluss

**Dateien:**
- Erstellen: `docs/phase4c-etappe1-abnahme.md`
- Ändern: `README.md`

- [ ] **Schritt 1: Server und Stand** — `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`; `git status --short` leer; `git log --oneline -1` notieren.

- [ ] **Schritt 2: Grundzustand** — `browser_navigate` auf `http://localhost:5173/Orrery/`, `browser_evaluate`:
```js
() => { window.store.setState({ quality: { tier: 'high' } }); const s = window.store.getState(); return { info: s.ui.info, panels: s.ui.panels, ziel: s.camera.targetId }; }
```
Snapshot: Spalte rechts mit Überschrift „Sonne", Tabs, Karten. Werte ins Protokoll.

- [ ] **Schritt 3: Kamerafahrt messen** — `browser_run_code_unsafe`:
```js
async () => {
  const s = window.store.getState();
  s.setCamera({ targetId: 'sun', distance: 8e8 });
  const knopf = [...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label')?.includes('Saturn') || b.textContent === 'Saturn');
  const werte = [];
  const t0 = performance.now();
  knopf.click();
  for (let i = 0; i < 6; i++) {
    await new Promise((r) => setTimeout(r, 300));
    werte.push({ ms: Math.round(performance.now() - t0), distance: window.store.getState().camera.distance });
  }
  return werte;
}
```
Falls der Knopf über `aria-label` nicht zu treffen ist, den Verweis „Saturn" im Text von Erde oder den Objektbaum-Knopf per Snapshot-Referenz klicken. Erwartet: `distance` fällt monoton, ab rund 1 500 ms konstant; Endwert gleich `fokusAbstand` (8 × dargestellter Radius, im Preset Schaubild 8 × 60 268 × 50 = 24 107 200 km).

- [ ] **Schritt 4: Verweise** — Erde fokussieren, Gymnasium: Klick auf „Achsneigung" im Text → `ui.info.thema` = `'achsneigung'`, Titel „Achsneigung", Hinweis „Zu diesem Eintrag gibt es noch keinen Text." (Thema kommt in 4c-4). Klick auf „Mond" (Objektbaum oder zurück zur Erde) → Thema `null`. Klick auf „NSSDC Earth Fact Sheet" im Erde-Text → Karte hervorgehoben (Klasse `border-sky-300`), kein neuer Tab (`browser_tabs` list: 1 Tab). Mittelklick auf eine Karte: `browser_click` mit `button: 'middle'` → `browser_tabs` list zeigt 2 Tabs; zweiten Tab schließen.

- [ ] **Schritt 5: Live-Werte** — Uhr läuft (`time.paused` false, Rate 1 Tag/s): Text der Zeile „Abstand zur Sonne" zweimal im Abstand von 1 s lesen (`browser_evaluate` mit `document.querySelector('[data-testid=datenblock]').textContent`), Werte unterscheiden sich. `setTime({ paused: true })`, erneut zweimal lesen, gleich.

- [ ] **Schritt 6: Griffe messen** — Breite: `getBoundingClientRect().width` der `aside.info-panel` vor und nach `browser_drag` des Breitengriffs um 200 px nach links (Referenz per Snapshot, Rolle separator „Breite des Infopanels"). Erwartet: Breite +200 px (±2), `ui.info.breiteRem` = 24 + 200/16 = 36,5. Teilung: Höhe des `[role=tabpanel]` vor und nach Ziehen des Teilungsgriffs um 100 px nach unten; `ui.info.teilung` steigt entsprechend. Screenshots `.playwright-mcp/info-breit.png`, `.playwright-mcp/info-teilung.png`.

- [ ] **Schritt 7: Tastatur** — Fokus auf den Breitengriff (`browser_click` auf den Griff, dann `browser_press_key` `ArrowLeft`): `breiteRem` +1. Tabs: Fokus auf aktiven Tab, `ArrowRight` → Niveau wechselt.

- [ ] **Schritt 8: Kino** — `setCinema({ running: true, shuffle: false, nummer: <Index von mondfinsternis> }); setCamera({ mode: 'cinema' })`. Titel „Szene: Mondfinsternis", Zeilen „Standort"/„Blickziel". `setCinema({ running: false })` → zurück zum Kameraziel.

- [ ] **Schritt 9: Link und Sitzung** — Niveau auf Grundschule, Breite 36,5: „Link kopieren" (Rückfall schreibt das Fragment in die Adresszeile); `decodePatch` über `window.store` nicht erreichbar, deshalb `location.hash` lesen und per `browser_navigate` auf dieselbe Adresse mit dem Fragment neu laden: Niveau Grundschule, Breite wieder 24 (nicht im Link). Danach `localStorage.getItem('orrery.sitzung.v1')` enthält `"info"` mit `breiteRem`.

- [ ] **Schritt 10: 400 px** — `browser_resize` 400 × 900, neu laden: Panel eingeklappt, Reiter „Info" unten rechts; Klick öffnet den Bogen (Höhe 45 % des Fensters, `getBoundingClientRect`). Screenshot `.playwright-mcp/info-400.png`.

- [ ] **Schritt 11: Konsole** — `browser_console_messages`: 0 Fehler, 0 Warnungen (sonst wörtlich ins Protokoll).

- [ ] **Schritt 12: Lint, Test, Build** — `npm run lint`, `npm test`, `npm run build`; Schlusszeilen und Testzahl ins Protokoll.

- [ ] **Schritt 13: Protokoll `docs/phase4c-etappe1-abnahme.md`** — Aufbau wie `docs/phase4b-etappe2-abnahme.md`: Kopf (Datum, Branch, Commit, Prüfumgebung), je Schritt die wörtlichen Werte, Konsole, Lint/Test/Build. Das Kriterium „Infopanel mit abgeleiteten Live-Werten" zitieren und bewerten. Bekannte Unschärfen: (1) Themen außer `modell` haben in dieser Etappe keinen Text (kommt in 4c-4); (2) Achsneigung ist der Winkel zur Ekliptiknormale, bei Monden nicht zur eigenen Bahn; (3) Taste `I` kippt auf schmalen Bildschirmen beim ersten Druck von „zu" auf „zu", weil der Standard dort nicht gespeichert ist; (4) Hochschul-Tab zeigt den Gymnasialtext mit Hinweis; (5) Mobilprüfung nur als Sichtkontrolle bei 400 px.

- [ ] **Schritt 14: README** — im Absatz „Stand": 4c Etappe 1 (Infopanel-Gerüst: Niveaustufen, Datenblock mit Live-Werten, Quellenkarten, Kamerafahrt) abgeschlossen; Texte für alle Körper, Szenen und Themen folgen in 4c-2 bis 4c-4. Feature-Liste: Punkt „Infopanel mit Erläuterungstexten in drei Niveaustufen, Kennzahlen und Live-Werten, Verweisen in die Simulation und Quellenkarten (NASA, JPL, ESA, Wikipedia)".

- [ ] **Schritt 15: Commit**

```bash
git add docs/phase4c-etappe1-abnahme.md README.md
git commit -m "Abnahme 4c Etappe 1: Infopanel-Gerüst"
```

## Abschluss

- [ ] `npm run lint`, `npm test`, `npm run build` auf dem Branch, Ausgabe zeigen.
- [ ] Die lokale Projektanleitung im Abschnitt „Stand" nachziehen (4c-1 auf master, Testzahl, nächster Schritt 4c-2 Grundschule-Texte; Rulings unten).
- [ ] Fast-Forward nach `master`, Branch `infopanel` löschen, `.playwright-mcp/` leeren. Tag: keiner (Phase 4 wird erst nach 4c-4 getaggt).
- [ ] Rulings gesammelt an Jens melden.

## Rulings

Entscheidungen während der Planung, die vom Entwurf abweichen oder ihn präzisieren; Jens bestätigt oder kippt sie:

1. **Klappzustand ohne Standardeintrag:** `ui.panels.info` bleibt im Standard leer; das Panel liest `panels.info ?? !schmal`, damit es auf breiten Bildschirmen offen und auf schmalen zu startet (Entwurf §3.4), ohne dass der Store den Bildschirm kennen müsste.
2. **Zurücksetzen behält Niveau, Breite und Teilung** (Vorlieben wie Sprache und Qualität), löscht nur das Thema. Der Entwurf sagt dazu nichts.
3. **Einheitensymbole `km`, `kg`, `km/s`, `°` bleiben Literale**, Einheitenwörter (`Tage`, `Jahre`, `Stunden`, `AE`) kommen aus den Sprachtabellen — dieselbe Ausnahme wie „DE"/„EN".
4. **Live-Werte per `setInterval` mit `getState`** statt `useStore.subscribe` (Entwurf §5.2): gleiches Ergebnis, weniger Code, kein Abonnement, das je Bild feuert.
5. **Szenenverweis verhält sich wie Taste C** (`startCinema`, inklusive Vollbild-Anfrage), nur mit `shuffle: false` und der Nummer der Szene.
6. **Griffe ohne eigene Drosselung je Animationsbild** (Entwurf §3.2): Browser liefern `pointermove` ohnehin höchstens einmal je Bild.
7. **Thema-Prüfung gegen den Katalog** statt „Zeichenkette bis 40 Zeichen" (Entwurf §4.6): ein unbekanntes Thema aus einem alten Link fällt weg, statt einen leeren Text zu zeigen.
8. **`Sprache`-Typ in `data/quellen.ts`**, weil `data/` nicht aus `ui/i18n` importieren darf; strukturgleich mit dem Typ dort.
9. **Erste Überschrift wird im Text ausgeblendet** (`titelAusblenden`), weil sie schon im Panelkopf steht; der Entwurf nennt nur den Kopf.
10. **Szenen-Titel in der Datei** heißen „Szene: …", damit der Panelkopf den Kontext trägt; die Grundschulfassung nennt nur das Ereignis.
11. **Wortgrenzen im Dateitest weich** (110 / 240 statt 80 / 180), gezählt inklusive Überschrift und Linktext, ohne Link-Ziele.
