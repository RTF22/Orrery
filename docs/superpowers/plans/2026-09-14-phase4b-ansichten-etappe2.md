# Phase 4b Persistenz, Etappe 2 „Ansichten" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Ein Panel „Ansichten" speichert benannte Einstellungen (Maßstab, Darstellung, Kamera, Sichtbarkeit, Zeitrate), lädt sie ohne den Zeitpunkt zu verändern, benennt um, löscht mit Rückgängig und tauscht die Liste als JSON-Datei aus; jeder gelesene Zustand läuft durch den feldweisen Prüfer, der ab dieser Etappe auch Wertebereiche kennt.

**Architektur:** `store/pruefer.ts` bekommt eine Bereichstabelle je Pfad (fremde Dateien liefern nur Plausibles). `store/persist.ts` bekommt den Typ `Ansicht`, `ansichtErstellen` (Profil `ansicht`), `ansichtAnwenden` (Ansicht über den aktuellen Zustand, Zeitpunkt/Kino/Qualität/Oberfläche bleiben), die Ablagefunktionen `ansichtenLesen`/`ansichtenSchreiben` sowie Export und Import mit Umschlag. Die Komponente `ui/panels/AnsichtenPanel.tsx` hält die Liste als React-Zustand, schreibt bei jeder Änderung in die Ablage und hängt in `ui/App.tsx` unter dem Darstellungspanel. Kein neuer Store-Zweig, keine neue Abhängigkeit.

**Tech-Stack:** TypeScript, React 19, Zustand, Vitest (node bzw. jsdom mit Testing Library), Vite, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-14-phase4b-persistenz-design.md`, maßgeblich §3.1 (Profil `ansicht`), §3.3 (Ablageformat, Export-Umschlag), §3.4 (Speicherfunktionen), §4.5 (Ansicht laden), §5.3 (Panel), §5.4 (Texte), §6 (Fehler), §7 (Tests), §8 Punkt 6 (Abnahme). Etappe 1 ist auf master (Plan `2026-09-14-phase4b-persistenz-etappe1.md`, Abnahme `docs/phase4b-etappe1-abnahme.md`); dieser Plan setzt darauf auf. Abweichungen vom Entwurf stehen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Tests). Umlaute korrekt. Nur die Werte in `en.ts` sind Englisch.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungs-URL, keine Werkzeugnamen. Nach jedem Commit prüfen: `git log --format=%B -1 | grep -ci 'co-authored\|session'` muss 0 ergeben. Auch der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei.
- Branch `ansichten` (von `master`), **kein Worktree**: der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten mit einseitiger Abhängigkeit: `ui/` → `store/` → `render/` → `sim/`; `data/` reine Daten, `app/` Einstieg. **Kein Import aus `app/` oder `ui/` in `store/`**, kein Import aus `ui/` in `render/`. `render/schichten.test.ts` prüft das.
- Kein Literal mit sichtbarem Text außerhalb von `ui/i18n/de.ts` und `ui/i18n/en.ts`. Fehlercodes aus `store/` sind deshalb Kennungen, die erst das Panel übersetzt.
- Neue Dateien vor dem ersten Import anlegen, sonst zeigt der laufende Vite-Server ein Fehler-Overlay.
- Alle Speicherzugriffe (`localStorage`) sitzen ausschließlich in `store/persist.ts` hinter `try/catch` und werfen nie.
- TypeScript läuft mit `strict` und `noUncheckedIndexedAccess`: Indexzugriffe liefern `T | undefined`.
- Vor „fertig" je Task: `npm test`, `npm run lint`; am Ende `npm run build`.
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

## Dateistruktur

| Datei | Aufgabe |
|---|---|
| `src/store/pruefer.ts` | neu: Tabelle `BEREICHE` (min/max je Zahlpfad), Prüfung in `pruefeFeld` |
| `src/store/pruefer.test.ts` | neue Fälle für Bereiche |
| `src/store/serialize.ts` | `merge` wird als `mergePatch` exportiert |
| `src/store/persist.ts` | neu: `Ansicht`, `ImportErgebnis`, Konstanten, `nameBereinigen`, `freierName`, `ansichtErstellen`, `ansichtAnwenden`, `ansichtenLesen`, `ansichtenSchreiben`, `ansichtenExportieren`, `ansichtenImportieren` |
| `src/store/persist.test.ts` | neue Fälle für Ansichten, Export, Import |
| `src/ui/i18n/de.ts`, `en.ts` | 16 neue Schlüssel `panel.views`, `views.*` |
| `src/ui/panels/AnsichtenPanel.tsx` (neu) | Panel mit Namensfeld, Liste, Umbenennen, Löschen/Rückgängig, Export, Import |
| `src/ui/panels/AnsichtenPanel.test.tsx` (neu) | Komponententests (jsdom) |
| `src/ui/App.tsx` | `<AnsichtenPanel />` unter `<DisplayPanel />` |
| `docs/phase4b-etappe2-abnahme.md` (neu) | Protokoll |
| `README.md` | Stand nach Etappe 2 |

---

### Task 1: Wertebereiche im Prüfer

**Dateien:**
- Ändern: `src/store/pruefer.ts` (Tabelle nach `BOOLESCHE_RECORDS`, Prüfung in `pruefeFeld`)
- Test: `src/store/pruefer.test.ts` (Fälle anhängen)

**Schnittstellen:**
- Konsumiert: nichts Neues.
- Produziert: unveränderte Signatur `pruefeZustand(roh: unknown): Plain`; zusätzlich verwirft sie Zahlen außerhalb der Tabelle. Alle späteren Tasks lesen Ansichten durch diese Funktion.

- [ ] **Schritt 1: Fehlschlagende Tests anhängen** — ans Ende von `src/store/pruefer.test.ts`:

```ts
describe('pruefeZustand: Wertebereiche', () => {
  it('verwirft Werte außerhalb des Regler- und Kamerabereichs feldweise', () => {
    expect(pruefeZustand({
      scale: { sizeScale: 5000, distanceExponent: 0.5 },
      display: { brightness: -1, nightFill: 0.4 },
      camera: { distance: 1e20, elevation: 3, azimuth: 1e6 },
      time: { rateDaysPerSec: 1e9, jd: 2461294.5 },
      cinema: { idleResumeSec: 0, seed: -12 },
    })).toEqual({
      scale: { distanceExponent: 0.5 },
      display: { nightFill: 0.4 },
      camera: { azimuth: 1e6 },
      time: { jd: 2461294.5 },
      cinema: { seed: -12 },
    });
  });

  it('lässt die Grenzen selbst zu', () => {
    const roh = { scale: { sizeScale: 1000 }, camera: { distance: 100 }, cinema: { idleResumeSec: 1 } };
    expect(pruefeZustand(roh)).toEqual(roh);
  });

  it('prüft freezeJd nur, wenn es eine Zahl ist', () => {
    expect(pruefeZustand({ camera: { freezeJd: null } })).toEqual({ camera: { freezeJd: null } });
    expect(pruefeZustand({ camera: { freezeJd: -5 } })).toEqual({});
  });
});
```

- [ ] **Schritt 2: Tests laufen lassen** — `npx vitest run src/store/pruefer.test.ts`. Erwartet: die drei neuen Fälle scheitern (Werte kommen unverändert durch), der Rest ist grün.

- [ ] **Schritt 3: Tabelle und Prüfung einbauen** — in `src/store/pruefer.ts` direkt nach `BOOLESCHE_RECORDS`:

```ts
/**
 * Wertebereiche je Zahlpfad. Seit Etappe 2 liest der Import fremde Dateien,
 * „endlich" genügt darum nicht mehr. Die Grenzen sind Zwillinge der Regler
 * und der Kameraeingabe: GROESSE_MIN/MAX in ScalePanel, RATE_MAX in
 * TimePanel, die Reglergrenzen in DisplayPanel und ScalePanel,
 * MIN_/MAX_DISTANCE_KM und ELEVATION_GRENZE in render/camera/input.ts.
 * store/ darf weder ui/ noch render/ importieren, deshalb stehen die Zahlen
 * hier noch einmal; wer dort eine Grenze ändert, zieht sie hier nach. Ein
 * Wert außerhalb fällt weg wie jedes andere ungültige Feld — nicht
 * eingeklemmt, damit ein Eintrag aus einer Datei nie stillschweigend einen
 * anderen Wert bekommt als den, der darin steht. Die Obergrenze der
 * Julianischen Tage deckt das Datumsfeld ab (Jahr 275760 liegt bei rund
 * 1,03e8).
 */
const BEREICHE: Readonly<Record<string, readonly [number, number]>> = {
  'time.jd': [0, 2e8],
  'time.rateDaysPerSec': [-365250, 365250],
  'scale.sizeScale': [1, 1000],
  'scale.distanceExponent': [0.35, 1],
  'scale.sunDamping': [0.1, 1],
  'display.brightness': [0.1, 20],
  'display.lightFalloff': [0, 2],
  'display.nightFill': [0, 0.5],
  'display.lightCompensation': [0, 1],
  'camera.distance': [1e2, 1e13],
  'camera.elevation': [-Math.PI / 2, Math.PI / 2],
  'camera.freezeJd': [0, 2e8],
  'cinema.nummer': [0, 1e6],
  'cinema.elapsedSec': [0, 1e7],
  'cinema.idleResumeSec': [1, 3600],
};
```

und in `pruefeFeld` die beiden letzten Zeilen

```ts
  if (typeof wert === 'number' && !Number.isFinite(wert)) return VERWORFEN;
  return wert;
```

ersetzen durch

```ts
  if (typeof wert === 'number') {
    if (!Number.isFinite(wert)) return VERWORFEN;
    const bereich = BEREICHE[pfad];
    if (bereich !== undefined && (wert < bereich[0] || wert > bereich[1])) return VERWORFEN;
  }
  return wert;
```

- [ ] **Schritt 4: Tests laufen lassen** — `npx vitest run src/store/pruefer.test.ts`. Erwartet: alle grün. Im JSDoc von `pruefeZustand` den Satz „Zahlen endlich sein" um „und innerhalb ihres Bereichs liegen (BEREICHE)" ergänzen.

- [ ] **Schritt 5: Alles prüfen** — `npm test` (alle grün; scheitert ein bestehender Test, weil er einen Wert außerhalb der Tabelle benutzt, den Testwert in den Bereich legen und das im Commit-Text nennen — die Tabelle nicht stillschweigend weiten), `npm run lint`.

- [ ] **Schritt 6: Commit**

```bash
git add src/store/pruefer.ts src/store/pruefer.test.ts
git commit -m "Prüfer: Wertebereiche je Pfad, fremde Dateien liefern nur Plausibles"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 2: Ansichten in `store/persist.ts` — erstellen, anwenden, Ablage, Export, Import

**Dateien:**
- Ändern: `src/store/serialize.ts` (`merge` → `export function mergePatch`), `src/store/persist.ts` (Abschnitt anhängen)
- Test: `src/store/persist.test.ts` (Fälle anhängen)

**Schnittstellen:**
- Konsumiert: `pruefeZustand`, `istPlain`, `Plain` aus `store/pruefer.ts`; `toShareable`, `fromShareable`, `mergePatch` aus `store/serialize.ts`; `filtereProfil`, `patchFuer`, `GESTRICHEN`, `Ablage` aus `store/persist.ts` (Etappe 1).
- Produziert (`store/persist.ts`), genau diese Namen benutzt Task 3 bis 5:

```ts
export interface Ansicht { name: string; state: Plain }
export type ImportFehler = 'umschlag' | 'leer';
export interface ImportErgebnis { liste: Ansicht[]; fehler: ImportFehler | null; verworfen: number }
export const SCHLUESSEL_ANSICHTEN = 'orrery.ansichten.v1';
export const EXPORT_FORMAT = 'orrery-ansichten';
export const EXPORT_VERSION = 1;
export const EXPORT_DATEINAME = 'orrery-ansichten.json';
export const NAME_MAX = 80;
export function nameBereinigen(roh: unknown): string | null
export function freierName(name: string, vergeben: ReadonlySet<string>): string
export function ansichtErstellen(name: string, state: AppState): Ansicht
export function ansichtAnwenden(aktuell: AppState, ansicht: Ansicht): AppState
export function ansichtenLesen(ablage: Ablage | null): Ansicht[]
export function ansichtenSchreiben(ablage: Ablage | null, liste: readonly Ansicht[]): boolean
export function ansichtenExportieren(liste: readonly Ansicht[]): string
export function ansichtenImportieren(text: string, vorhandene: readonly Ansicht[]): ImportErgebnis
```

- [ ] **Schritt 1: `mergePatch` exportieren** — in `src/store/serialize.ts` die Zeile `function merge(basis: Plain, patch: Plain): Plain {` ersetzen durch `export function mergePatch(basis: Plain, patch: Plain): Plain {` und in `fromShareable` den Aufruf `merge(` durch `mergePatch(` ersetzen. JSDoc davor:

```ts
/**
 * Rekursives Übereinanderlegen zweier Patches; das Gegenstück zu diff.
 * Exportiert, weil ansichtAnwenden in persist.ts eine Ansicht über den
 * aktuellen Zustand legt, bevor fromShareable daraus den Zustand baut.
 */
```

`npx vitest run src/store/serialize.test.ts` → grün.

- [ ] **Schritt 2: Fehlschlagende Tests anhängen** — Importzeile in `src/store/persist.test.ts` erweitern:

```ts
import {
  filtereProfil, patchFuer, linkErzeugen, zurueckgesetzt,
  sitzungLesen, sitzungSchreiben, sitzungLoeschen, sitzungMerkenLesen, sitzungMerkenSchreiben,
  SCHLUESSEL_SITZUNG, SCHLUESSEL_MERKEN,
  ansichtErstellen, ansichtAnwenden, ansichtenLesen, ansichtenSchreiben,
  ansichtenExportieren, ansichtenImportieren, freierName, nameBereinigen,
  SCHLUESSEL_ANSICHTEN, EXPORT_FORMAT,
} from './persist';
import type { Ablage, Ansicht } from './persist';
```

und ans Ende der Datei:

```ts
describe('Ansichten: erstellen und anwenden', () => {
  it('ansichtErstellen nimmt nur das Profil ansicht mit', () => {
    expect(ansichtErstellen('Alles', abgewandelt())).toEqual({
      name: 'Alles',
      state: {
        time: { rateDaysPerSec: -30 },
        scale: { sizeScale: 7, preset: null },
        display: { orbits: false },
        camera: { targetId: 'saturn', mode: 'attached' },
        visible: { mercury: false },
      },
    });
  });

  it('ansichtAnwenden ersetzt die Einstellungen und behält Zeitpunkt, Pause, Kino, Qualität und Oberfläche', () => {
    const aktuell = abgewandelt();
    const ansicht: Ansicht = {
      name: 'Erde',
      state: { scale: { sizeScale: 3, preset: null }, display: { labels: false } },
    };
    const s = ansichtAnwenden(aktuell, ansicht);
    // Aus der Ansicht:
    expect(s.scale.sizeScale).toBe(3);
    expect(s.scale.preset).toBeNull();
    expect(s.display.labels).toBe(false);
    // Nicht in der Ansicht, also Standard — eine Ansicht ersetzt die Einstellungen:
    expect(s.display.orbits).toBe(true);
    expect(s.camera.targetId).toBe('sun');
    expect(s.camera.mode).toBe('free');
    expect(s.visible).toEqual({});
    expect(s.time.rateDaysPerSec).toBe(1);
    // Bleibt vom aktuellen Zustand:
    expect(s.time.jd).toBe(aktuell.time.jd);
    expect(s.time.paused).toBe(true);
    expect(s.cinema).toEqual(aktuell.cinema);
    expect(s.quality.tier).toBe('high');
    expect(s.ui).toEqual(aktuell.ui);
  });

  it('ansichtAnwenden mit leerer Ansicht liefert die Standard-Einstellungen zum aktuellen Moment', () => {
    const s = ansichtAnwenden(abgewandelt(), { name: 'Leer', state: {} });
    expect(s.scale).toEqual(DEFAULT_STATE.scale);
    expect(s.time.jd).toBe(2461294.5);
    expect(s.ui.language).toBe('en');
  });
});

describe('Ansichten in der Ablage', () => {
  const mars: Ansicht = { name: 'Mars', state: { camera: { targetId: 'mars' } } };

  it('schreibt und liest die Liste zurück', () => {
    const ablage = ablageFake();
    expect(ansichtenSchreiben(ablage, [mars])).toBe(true);
    expect(JSON.parse(ablage.daten.get(SCHLUESSEL_ANSICHTEN) ?? '')).toEqual([mars]);
    expect(ansichtenLesen(ablage)).toEqual([mars]);
  });

  it('liefert [] ohne Eintrag, ohne Ablage und bei beschädigtem JSON, ohne zu löschen', () => {
    expect(ansichtenLesen(ablageFake())).toEqual([]);
    expect(ansichtenLesen(null)).toEqual([]);
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_ANSICHTEN, '[{');
    expect(ansichtenLesen(ablage)).toEqual([]);
    expect(ablage.daten.get(SCHLUESSEL_ANSICHTEN)).toBe('[{');
  });

  it('prüft Namen und Zustände beim Lesen, streicht Profilfremdes und Dubletten', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_ANSICHTEN, JSON.stringify([
      { name: ' Gut ', state: { scale: { sizeScale: 3 }, time: { jd: 5, rateDaysPerSec: 2 }, ui: { language: 'fr' } } },
      { name: '', state: {} },
      { name: 'OhneZustand' },
      { name: 'Gut', state: {} },
      7,
    ]));
    expect(ansichtenLesen(ablage)).toEqual([
      { name: 'Gut', state: { scale: { sizeScale: 3 }, time: { rateDaysPerSec: 2 } } },
    ]);
  });

  it('wirft bei gesperrter oder voller Ablage nicht', () => {
    expect(ansichtenLesen(werfend)).toEqual([]);
    expect(ansichtenSchreiben(werfend, [mars])).toBe(false);
    expect(ansichtenSchreiben(null, [mars])).toBe(false);
  });
});

describe('Ansichten: Export und Import', () => {
  const mars: Ansicht = { name: 'Mars', state: { camera: { targetId: 'mars' } } };

  it('der Export trägt den Umschlag, der Import liest ihn zurück', () => {
    const text = ansichtenExportieren([mars]);
    expect(JSON.parse(text)).toEqual({ format: EXPORT_FORMAT, version: 1, ansichten: [mars] });
    expect(ansichtenImportieren(text, [])).toEqual({ liste: [mars], fehler: null, verworfen: 0 });
  });

  it('lehnt fremde Dateien ab und lässt Vorhandenes stehen', () => {
    const fremd = [
      'kein json',
      '{}',
      '[]',
      JSON.stringify({ format: 'x', version: 1, ansichten: [] }),
      JSON.stringify({ format: EXPORT_FORMAT, version: 2, ansichten: [] }),
      JSON.stringify({ format: EXPORT_FORMAT, version: 1, ansichten: {} }),
    ];
    for (const text of fremd) {
      expect(ansichtenImportieren(text, [mars]), text).toEqual({ liste: [mars], fehler: 'umschlag', verworfen: 0 });
    }
  });

  it('meldet „leer", wenn kein Eintrag gültig ist', () => {
    const text = JSON.stringify({ format: EXPORT_FORMAT, version: 1, ansichten: [{ name: '', state: {} }, 'x'] });
    expect(ansichtenImportieren(text, [mars])).toEqual({ liste: [mars], fehler: 'leer', verworfen: 2 });
  });

  it('übernimmt Gültiges, zählt Verworfenes und vergibt Suffixe bei Namenskonflikten', () => {
    const text = JSON.stringify({
      format: EXPORT_FORMAT, version: 1,
      ansichten: [
        { name: 'Mars', state: { scale: { sizeScale: 2 } } },
        { name: 'Mars', state: {} },
        { name: 'Erde', state: { time: { jd: 1 } } },
        { name: 5, state: {} },
      ],
    });
    expect(ansichtenImportieren(text, [mars])).toEqual({
      liste: [
        mars,
        { name: 'Mars (2)', state: { scale: { sizeScale: 2 } } },
        { name: 'Mars (3)', state: {} },
        { name: 'Erde', state: {} },
      ],
      fehler: null,
      verworfen: 1,
    });
  });
});

describe('freierName und nameBereinigen', () => {
  it('zählt hoch, bis der Name frei ist', () => {
    expect(freierName('Mars', new Set())).toBe('Mars');
    expect(freierName('Mars', new Set(['Mars', 'Mars (2)']))).toBe('Mars (3)');
  });

  it('trimmt und lehnt leere, fremde und überlange Namen ab', () => {
    expect(nameBereinigen('  Mars ')).toBe('Mars');
    expect(nameBereinigen('   ')).toBeNull();
    expect(nameBereinigen(7)).toBeNull();
    expect(nameBereinigen('x'.repeat(81))).toBeNull();
    expect(nameBereinigen('x'.repeat(80))).toBe('x'.repeat(80));
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen** — `npx vitest run src/store/persist.test.ts`. Erwartet: die neuen Blöcke scheitern mit fehlenden Exporten.

- [ ] **Schritt 4: Abschnitt in `src/store/persist.ts` anhängen** — Importzeile für serialize erweitern zu `import { encodePatch, fromShareable, mergePatch, toShareable } from './serialize';`, dann ans Ende der Datei:

```ts
/* ---------- Ansichten (Entwurf §3.3, §3.4, §4.5) ---------- */

/** Eine benannte Einstellung; `state` ist ein Patch im Profil `ansicht`. */
export interface Ansicht { name: string; state: Plain }

export type ImportFehler = 'umschlag' | 'leer';

export interface ImportErgebnis {
  liste: Ansicht[];
  /** Kennung statt Text: store/ kennt keine Sprachtabelle, das Panel übersetzt. */
  fehler: ImportFehler | null;
  /** Einträge, die wegen fehlendem Namen oder unbrauchbarem Zustand wegfielen. */
  verworfen: number;
}

export const SCHLUESSEL_ANSICHTEN = 'orrery.ansichten.v1';
export const EXPORT_FORMAT = 'orrery-ansichten';
export const EXPORT_VERSION = 1;
export const EXPORT_DATEINAME = 'orrery-ansichten.json';
/** Längster erlaubter Name; längere Einträge aus Ablage oder Datei fallen weg. */
export const NAME_MAX = 80;

/** Gültiger Name: nichtleerer String nach dem Trimmen, höchstens NAME_MAX Zeichen. */
export function nameBereinigen(roh: unknown): string | null {
  if (typeof roh !== 'string') return null;
  const name = roh.trim();
  return name.length > 0 && name.length <= NAME_MAX ? name : null;
}

/** Erster freier Name: „Mars", sonst „Mars (2)", „Mars (3)" … */
export function freierName(name: string, vergeben: ReadonlySet<string>): string {
  if (!vergeben.has(name)) return name;
  for (let n = 2; ; n += 1) {
    const kandidat = `${name} (${n})`;
    if (!vergeben.has(kandidat)) return kandidat;
  }
}

export function ansichtErstellen(name: string, state: AppState): Ansicht {
  return { name, state: patchFuer(state, 'ansicht') };
}

function holePfad(obj: Plain, pfad: readonly string[]): unknown {
  let aktuell: unknown = obj;
  for (const teil of pfad) {
    if (!istPlain(aktuell) || !Object.hasOwn(aktuell, teil)) return undefined;
    aktuell = aktuell[teil];
  }
  return aktuell;
}

function setzePfad(obj: Plain, pfad: readonly string[], wert: unknown): void {
  const [kopf, ...rest] = pfad;
  if (kopf === undefined) return;
  if (rest.length === 0) { obj[kopf] = wert; return; }
  const kind = obj[kopf];
  const ziel = istPlain(kind) ? kind : {};
  obj[kopf] = ziel;
  setzePfad(ziel, rest, wert);
}

/** Gegenstück zu ohnePfad: Nur die genannten Pfade bleiben. */
function nurPfade(patch: Plain, pfade: readonly string[]): Plain {
  const out: Plain = {};
  for (const pfad of pfade) {
    const teile = pfad.split('.');
    const wert = holePfad(patch, teile);
    if (wert !== undefined) setzePfad(out, teile, wert);
  }
  return out;
}

/**
 * Ansicht laden: Die Einstellungen (Maßstab, Darstellung, Kamera,
 * Sichtbarkeit, Zeitrate) kommen vollständig aus der Ansicht — was sie
 * nicht nennt, steht auf dem Standard. Vom aktuellen Zustand bleiben genau
 * die Zweige, die das Profil `ansicht` streicht: Zeitpunkt, Pause, Kino,
 * Qualität, Oberfläche. Ein Patch kennt keinen Unterschied zwischen
 * „Standardwert" und „nicht enthalten"; würde man die Ansicht nur über den
 * aktuellen Zustand legen, hielte eine Ansicht mit Bahnlinien (Standard)
 * ausgeschaltete Bahnlinien nicht wieder an — siehe Ruling im Plan.
 */
export function ansichtAnwenden(aktuell: AppState, ansicht: Ansicht): AppState {
  const bleibt = nurPfade(toShareable(aktuell), GESTRICHEN.ansicht);
  return fromShareable(mergePatch(bleibt, ansicht.state));
}

/** Einzelner Eintrag aus Ablage oder Datei; null, wenn Name oder Zustand unbrauchbar. */
function ansichtPruefen(roh: unknown): Ansicht | null {
  if (!istPlain(roh)) return null;
  const name = nameBereinigen(roh.name);
  if (name === null || !istPlain(roh.state)) return null;
  return { name, state: filtereProfil(pruefeZustand(roh.state), 'ansicht') };
}

function listePruefen(roh: unknown): { liste: Ansicht[]; verworfen: number } {
  if (!Array.isArray(roh)) return { liste: [], verworfen: 0 };
  const liste: Ansicht[] = [];
  let verworfen = 0;
  for (const eintrag of roh) {
    const ansicht = ansichtPruefen(eintrag);
    if (ansicht === null) verworfen += 1;
    else liste.push(ansicht);
  }
  return { liste, verworfen };
}

/** Geprüfte Liste; Namen sind eindeutig, bei Dubletten zählt der erste Eintrag. */
export function ansichtenLesen(ablage: Ablage | null): Ansicht[] {
  try {
    const text = ablage?.getItem(SCHLUESSEL_ANSICHTEN) ?? null;
    if (text === null) return [];
    const gesehen = new Set<string>();
    const out: Ansicht[] = [];
    for (const ansicht of listePruefen(JSON.parse(text)).liste) {
      if (gesehen.has(ansicht.name)) continue;
      gesehen.add(ansicht.name);
      out.push(ansicht);
    }
    return out;
  } catch {
    return [];
  }
}

export function ansichtenSchreiben(ablage: Ablage | null, liste: readonly Ansicht[]): boolean {
  try {
    if (ablage === null) return false;
    ablage.setItem(SCHLUESSEL_ANSICHTEN, JSON.stringify(liste));
    return true;
  } catch {
    // Voll oder gesperrt: still, die Liste lebt im Panel weiter.
    return false;
  }
}

/** Datei mit Umschlag; eingerückt, damit sie von Hand lesbar bleibt. */
export function ansichtenExportieren(liste: readonly Ansicht[]): string {
  return JSON.stringify({ format: EXPORT_FORMAT, version: EXPORT_VERSION, ansichten: liste }, null, 2);
}

/**
 * Import: Umschlag prüfen, jeden Eintrag prüfen, Namenskonflikte mit
 * Vorhandenem und untereinander per Suffix auflösen. Bei „umschlag" oder
 * „leer" bleibt die vorhandene Liste unverändert.
 */
export function ansichtenImportieren(text: string, vorhandene: readonly Ansicht[]): ImportErgebnis {
  let roh: unknown = null;
  try {
    roh = JSON.parse(text);
  } catch {
    roh = null;
  }
  if (!istPlain(roh) || roh.format !== EXPORT_FORMAT || roh.version !== EXPORT_VERSION
      || !Array.isArray(roh.ansichten)) {
    return { liste: [...vorhandene], fehler: 'umschlag', verworfen: 0 };
  }
  const { liste: neue, verworfen } = listePruefen(roh.ansichten);
  if (neue.length === 0) return { liste: [...vorhandene], fehler: 'leer', verworfen };
  const vergeben = new Set(vorhandene.map((a) => a.name));
  const liste = [...vorhandene];
  for (const ansicht of neue) {
    const name = freierName(ansicht.name, vergeben);
    vergeben.add(name);
    liste.push({ name, state: ansicht.state });
  }
  return { liste, fehler: null, verworfen };
}
```

- [ ] **Schritt 5: Tests laufen lassen** — `npx vitest run src/store/persist.test.ts src/store/serialize.test.ts`. Erwartet: alle grün. Scheitert „prüft Namen und Zustände beim Lesen": `time.jd: 5` muss durch den Prüfer (Bereich ab 0) und dann durch das Profil fallen; `ui.language: 'fr'` fällt schon im Prüfer.

- [ ] **Schritt 6: Alles prüfen** — `npm test`, `npm run lint`.

- [ ] **Schritt 7: Commit**

```bash
git add src/store/serialize.ts src/store/persist.ts src/store/persist.test.ts
git commit -m "Ansichten: erstellen, anwenden, Ablage, Export und Import in store/persist"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 3: Panel „Ansichten" — Texte, Speichern, Überschreiben, Laden, Leerzustand

**Dateien:**
- Ändern: `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` (Schlüssel anhängen), `src/ui/App.tsx`
- Erstellen: `src/ui/panels/AnsichtenPanel.tsx`, `src/ui/panels/AnsichtenPanel.test.tsx`

**Schnittstellen:**
- Konsumiert: aus Task 2 `Ansicht`, `Ablage`, `ablageHolen`, `ansichtErstellen`, `ansichtAnwenden`, `ansichtenLesen`, `ansichtenSchreiben`, `nameBereinigen`, `NAME_MAX`; `useStore` (`replaceAll`, `getState`); `Panel` mit `id="views"`; `t()`.
- Produziert: `export function AnsichtenPanel({ ablage }: { ablage?: Ablage | null }): React.JSX.Element` — die Ablage ist ein Parameter mit Standard `ablageHolen()`, damit Tests einen Fake übergeben. Task 4 und 5 erweitern genau diese Datei an benannten Stellen.

- [ ] **Schritt 1: Sprachschlüssel** — ans Ende von `de` in `src/ui/i18n/de.ts` (vor `} as const;`):

```ts
  'panel.views': 'Ansichten',
  'views.name': 'Name der Ansicht',
  'views.save': 'Speichern',
  'views.overwrite': 'Überschreiben',
  'views.load': 'Ansicht laden',
  'views.rename': 'Umbenennen',
  'views.newName': 'Neuer Name',
  'views.delete': 'Löschen',
  'views.undo': 'Rückgängig',
  'views.export': 'Exportieren',
  'views.import': 'Importieren',
  'views.empty': 'Noch keine Ansichten gespeichert.',
  'views.nameTaken': 'Name bereits vergeben',
  'views.importInvalid': 'Datei ist kein Ansichten-Export',
  'views.importEmpty': 'Datei enthält keine gültige Ansicht',
  'views.importSkipped': 'Verworfene Einträge: {n}',
```

und ans Ende von `en` in `src/ui/i18n/en.ts` (vor `};`):

```ts
  'panel.views': 'Views',
  'views.name': 'View name',
  'views.save': 'Save',
  'views.overwrite': 'Overwrite',
  'views.load': 'Load view',
  'views.rename': 'Rename',
  'views.newName': 'New name',
  'views.delete': 'Delete',
  'views.undo': 'Undo',
  'views.export': 'Export',
  'views.import': 'Import',
  'views.empty': 'No views saved yet.',
  'views.nameTaken': 'Name already in use',
  'views.importInvalid': 'File is not a views export',
  'views.importEmpty': 'File contains no valid view',
  'views.importSkipped': 'Discarded entries: {n}',
```

`npx vitest run src/ui/i18n` → grün (Schlüsselgleichheit, „übersetzt, nicht kopiert").

- [ ] **Schritt 2: Fehlschlagende Tests `src/ui/panels/AnsichtenPanel.test.tsx`** (vollständiger Inhalt für diesen Task; Task 4 und 5 hängen weitere `describe`-Blöcke an):

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnsichtenPanel } from './AnsichtenPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCHLUESSEL_ANSICHTEN } from '../../store/persist';
import type { Ansicht } from '../../store/persist';
import { setSprache } from '../i18n';
import { ablageFake } from '../../test/ablageFake';

const gespeichert = (ablage: ReturnType<typeof ablageFake>): Ansicht[] =>
  JSON.parse(ablage.daten.get(SCHLUESSEL_ANSICHTEN) ?? '[]') as Ansicht[];

const mitAnsichten = (liste: Ansicht[]): ReturnType<typeof ablageFake> => {
  const ablage = ablageFake();
  ablage.daten.set(SCHLUESSEL_ANSICHTEN, JSON.stringify(liste));
  return ablage;
};

const namensfeld = (): HTMLInputElement =>
  screen.getByRole('textbox', { name: 'Name der Ansicht' }) as HTMLInputElement;

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
afterEach(() => { setSprache('de'); });

describe('AnsichtenPanel: speichern und laden', () => {
  it('zeigt den Leerzustand und einen deaktivierten Speichern-Knopf', () => {
    render(<AnsichtenPanel ablage={ablageFake()} />);
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Speichern' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('bleibt bei Leerraum als Namen deaktiviert', () => {
    render(<AnsichtenPanel ablage={ablageFake()} />);
    fireEvent.change(namensfeld(), { target: { value: '   ' } });
    expect((screen.getByRole('button', { name: 'Speichern' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('speichert die Einstellungen ohne Zeitpunkt, Kino, Qualität und Oberfläche und leert das Feld', () => {
    const ablage = ablageFake();
    const s = useStore.getState();
    s.setScale({ sizeScale: 7, preset: null });
    s.setTime({ jd: 2461294.5, paused: true });
    useStore.setState({ quality: { tier: 'high' } });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(namensfeld(), { target: { value: ' Saturn ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(gespeichert(ablage)).toEqual([{ name: 'Saturn', state: { scale: { sizeScale: 7, preset: null } } }]);
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
    expect(namensfeld().value).toBe('');
    expect(screen.queryByText('Noch keine Ansichten gespeichert.')).toBeNull();
  });

  it('bietet „Überschreiben" an, wenn der Name vergeben ist, und ersetzt den Eintrag', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: { scale: { sizeScale: 7 } } }]);
    useStore.getState().setDisplay({ orbits: false });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(namensfeld(), { target: { value: 'Saturn' } });
    expect(screen.queryByRole('button', { name: 'Speichern' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Überschreiben' }));
    expect(gespeichert(ablage)).toEqual([{ name: 'Saturn', state: { display: { orbits: false } } }]);
    expect(screen.getAllByRole('button', { name: /^Ansicht laden: / })).toHaveLength(1);
  });

  it('lädt eine Ansicht und lässt Zeitpunkt, Pause, Kino, Qualität und Oberfläche unberührt', () => {
    const ablage = mitAnsichten([
      { name: 'Saturn', state: { scale: { sizeScale: 7, preset: null }, camera: { targetId: 'saturn', mode: 'attached' } } },
    ]);
    const s = useStore.getState();
    s.setTime({ jd: 2461294.5, paused: true });
    s.setDisplay({ orbits: false });
    s.setUi({ language: 'en' });
    useStore.setState({ quality: { tier: 'high' } });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ansicht laden: Saturn' }));
    const z = useStore.getState();
    expect(z.scale.sizeScale).toBe(7);
    expect(z.camera.targetId).toBe('saturn');
    expect(z.camera.mode).toBe('attached');
    expect(z.display.orbits).toBe(true);
    expect(z.time.jd).toBe(2461294.5);
    expect(z.time.paused).toBe(true);
    expect(z.quality.tier).toBe('high');
    expect(z.ui.language).toBe('en');
  });

  it('liest eine beschädigte Ablage als leer', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_ANSICHTEN, '[{');
    render(<AnsichtenPanel ablage={ablage} />);
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen** — `npx vitest run src/ui/panels/AnsichtenPanel.test.tsx`. Erwartet: scheitert, weil das Modul fehlt.

- [ ] **Schritt 4: `src/ui/panels/AnsichtenPanel.tsx` anlegen** (vollständiger Inhalt für diesen Task):

```tsx
import { useState } from 'react';
import { useStore } from '../../store';
import {
  ablageHolen, ansichtAnwenden, ansichtErstellen, ansichtenLesen, ansichtenSchreiben,
  nameBereinigen, NAME_MAX,
} from '../../store/persist';
import type { Ablage, Ansicht } from '../../store/persist';
import { t } from '../i18n';
import { Panel } from './Panel';

const KNOPF = 'rounded border border-white/15 px-2 py-1 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent';
const FELD = 'min-w-0 flex-1 rounded border border-white/15 bg-transparent px-2 py-1';

interface Props {
  /** Standard ist die echte Ablage; Tests übergeben einen Fake. */
  ablage?: Ablage | null;
}

/**
 * Panel „Ansichten" (Entwurf §5.3): benannte Einstellungen speichern und
 * laden. Die Liste lebt als React-Zustand hier und wird bei jeder Änderung
 * in die Ablage geschrieben; sie geht nicht durch den Store, weil sie weder
 * im Link noch in der Sitzung mitreisen darf.
 */
export function AnsichtenPanel({ ablage = ablageHolen() }: Props): React.JSX.Element {
  const replaceAll = useStore((s) => s.replaceAll);
  const [liste, setListe] = useState<Ansicht[]>(() => ansichtenLesen(ablage));
  const [name, setName] = useState('');

  const aktualisiere = (neu: Ansicht[]): void => {
    setListe(neu);
    ansichtenSchreiben(ablage, neu);
  };

  const bereinigt = nameBereinigen(name) ?? '';
  const vorhanden = liste.some((a) => a.name === bereinigt);

  const speichern = (): void => {
    if (bereinigt === '') return;
    const ansicht = ansichtErstellen(bereinigt, useStore.getState());
    aktualisiere(vorhanden ? liste.map((a) => (a.name === bereinigt ? ansicht : a)) : [...liste, ansicht]);
    setName('');
  };

  const laden = (ansicht: Ansicht): void => {
    replaceAll(ansichtAnwenden(useStore.getState(), ansicht));
  };

  /** Eine Zeile der Liste; Task 4 ergänzt Umbenennen und Löschen. */
  const zeile = (ansicht: Ansicht): React.JSX.Element => {
    const n = ansicht.name;
    return (
      <button
        type="button"
        aria-label={`${t('views.load')}: ${n}`}
        onClick={() => { laden(ansicht); }}
        className="min-w-0 flex-1 truncate rounded px-1 text-left hover:bg-white/10"
      >
        {n}
      </button>
    );
  };

  return (
    <Panel id="views" title={t('panel.views')}>
      <div className="flex flex-col gap-2">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); speichern(); }}>
          <input
            type="text"
            aria-label={t('views.name')}
            placeholder={t('views.name')}
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => { setName(e.target.value); }}
            className={FELD}
          />
          <button type="submit" className={KNOPF} disabled={bereinigt === ''}>
            {t(vorhanden ? 'views.overwrite' : 'views.save')}
          </button>
        </form>

        {liste.length === 0 ? (
          <p className="m-0 opacity-70">{t('views.empty')}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {liste.map((ansicht) => (
              <li key={ansicht.name} className="flex flex-wrap items-center gap-1">
                {zeile(ansicht)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
```

- [ ] **Schritt 5: Tests laufen lassen** — `npx vitest run src/ui/panels/AnsichtenPanel.test.tsx`. Erwartet: alle sechs grün.

- [ ] **Schritt 6: In `src/ui/App.tsx` einhängen** — Import `import { AnsichtenPanel } from './panels/AnsichtenPanel';` nach dem `DisplayPanel`-Import, und im JSX `<AnsichtenPanel />` direkt nach `<DisplayPanel />` (vor `<BodyTree />`).

- [ ] **Schritt 7: Sichtkontrolle im Browser** — `curl`-Prüfung des Servers, `browser_navigate` auf `http://localhost:5173/Orrery/`, `window.store.setState({ quality: { tier: 'high' } })`, Snapshot: zwischen „Darstellung" und „Himmelskörper" steht ein Panel „Ansichten" mit Namensfeld, deaktiviertem „Speichern" und dem Text „Noch keine Ansichten gespeichert.". Name „Test" eintippen (`browser_type`), Speichern klicken, `browser_evaluate`: `localStorage.getItem('orrery.ansichten.v1')` → `[{"name":"Test","state":{}}]`. Konsole: 0 Fehler. Danach `localStorage.removeItem('orrery.ansichten.v1')`.

- [ ] **Schritt 8: Alles prüfen** — `npm test`, `npm run lint` (auch `render/schichten.test.ts` bleibt grün).

- [ ] **Schritt 9: Commit**

```bash
git add src/ui/i18n/de.ts src/ui/i18n/en.ts src/ui/panels/AnsichtenPanel.tsx src/ui/panels/AnsichtenPanel.test.tsx src/ui/App.tsx
git commit -m "Panel Ansichten: speichern, überschreiben, laden"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 4: Panel „Ansichten" — Umbenennen, Löschen mit Rückgängig

**Dateien:**
- Ändern: `src/ui/panels/AnsichtenPanel.tsx`, `src/ui/panels/AnsichtenPanel.test.tsx`

**Schnittstellen:**
- Konsumiert: die Datei aus Task 3 an den unten benannten Stellen; `nameBereinigen`, `NAME_MAX` aus `store/persist.ts`.
- Produziert: keine neuen Exporte. Beschriftungen (für Task 6): Knöpfe `Umbenennen: <Name>`, `Löschen: <Name>`, `Rückgängig: <Name>` (aria-label), Textfeld `Neuer Name`.

- [ ] **Schritt 1: Fehlschlagende Tests anhängen** — Importzeilen am Kopf von `src/ui/panels/AnsichtenPanel.test.tsx` ersetzen durch

```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
```

und ans Ende der Datei:

```tsx
describe('AnsichtenPanel: umbenennen', () => {
  const zwei = (): ReturnType<typeof mitAnsichten> => mitAnsichten([
    { name: 'Saturn', state: {} },
    { name: 'Erde', state: { display: { orbits: false } } },
  ]);

  it('benennt mit Enter um und schreibt die Ablage', () => {
    const ablage = zwei();
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Umbenennen: Saturn' }));
    const feld = screen.getByRole('textbox', { name: 'Neuer Name' }) as HTMLInputElement;
    expect(feld.value).toBe('Saturn');
    fireEvent.change(feld, { target: { value: 'Saturn nah' } });
    fireEvent.keyDown(feld, { key: 'Enter' });
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn nah' })).toBeTruthy();
    expect(screen.queryByRole('textbox', { name: 'Neuer Name' })).toBeNull();
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn nah', 'Erde']);
  });

  it('lehnt einen vergebenen Namen ab und markiert das Feld', () => {
    const ablage = zwei();
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Umbenennen: Saturn' }));
    const feld = screen.getByRole('textbox', { name: 'Neuer Name' });
    fireEvent.change(feld, { target: { value: ' Erde ' } });
    fireEvent.keyDown(feld, { key: 'Enter' });
    expect(feld.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Name bereits vergeben')).toBeTruthy();
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn', 'Erde']);
  });

  it('bricht mit Escape ab', () => {
    const ablage = zwei();
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Umbenennen: Saturn' }));
    const feld = screen.getByRole('textbox', { name: 'Neuer Name' });
    fireEvent.change(feld, { target: { value: 'Anders' } });
    fireEvent.keyDown(feld, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn', 'Erde']);
  });
});

describe('AnsichtenPanel: löschen mit Rückgängig', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('zeigt fünf Sekunden „Rückgängig", dann ist der Eintrag fort', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Löschen: Saturn' }));
    expect(screen.getByRole('button', { name: 'Rückgängig: Saturn' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Ansicht laden: Saturn' })).toBeNull();
    expect(gespeichert(ablage)).toHaveLength(1);
    act(() => { vi.advanceTimersByTime(4999); });
    expect(gespeichert(ablage)).toHaveLength(1);
    act(() => { vi.advanceTimersByTime(1); });
    expect(gespeichert(ablage)).toEqual([]);
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
  });

  it('Rückgängig stellt die Zeile wieder her', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Löschen: Saturn' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rückgängig: Saturn' }));
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
    act(() => { vi.advanceTimersByTime(6000); });
    expect(gespeichert(ablage)).toHaveLength(1);
  });

  it('Speichern unter dem Namen eines schwebenden Eintrags hebt das Löschen auf', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    useStore.getState().setDisplay({ orbits: false });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Löschen: Saturn' }));
    fireEvent.change(namensfeld(), { target: { value: 'Saturn' } });
    fireEvent.click(screen.getByRole('button', { name: 'Überschreiben' }));
    act(() => { vi.advanceTimersByTime(6000); });
    expect(gespeichert(ablage)).toEqual([{ name: 'Saturn', state: { display: { orbits: false } } }]);
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
  });
});
```

- [ ] **Schritt 2: Tests laufen lassen** — `npx vitest run src/ui/panels/AnsichtenPanel.test.tsx`. Erwartet: die sechs neuen Fälle scheitern (Knöpfe fehlen), die sechs aus Task 3 bleiben grün.

- [ ] **Schritt 3: Komponente erweitern** — in `src/ui/panels/AnsichtenPanel.tsx`:

(a) Erste Zeile ersetzen durch `import { useEffect, useRef, useState } from 'react';`.

(b) Vor `const KNOPF = …` einfügen:

```tsx
/** So lange lässt sich ein Löschen zurücknehmen (Entwurf §5.3). */
const RUECKGAENGIG_MS = 5000;
```

und nach der `KNOPF`-Zeile:

```tsx
const KLEIN = 'rounded border border-transparent px-1 opacity-70 hover:opacity-100';
```

(c) Nach dem `Props`-Interface:

```tsx
/** Laufendes Umbenennen einer Zeile; `doppelt` markiert einen abgelehnten Namen. */
interface Umbenennung { alt: string; neu: string; doppelt: boolean }
```

(d) Den JSDoc der Komponente ersetzen durch:

```tsx
/**
 * Panel „Ansichten" (Entwurf §5.3): benannte Einstellungen speichern, laden,
 * umbenennen und löschen (fünf Sekunden Rückgängig). Die Liste lebt als
 * React-Zustand hier und wird bei jeder Änderung in die Ablage geschrieben;
 * sie geht nicht durch den Store, weil sie weder im Link noch in der Sitzung
 * mitreisen darf. Ein Löschen schreibt erst beim Ablauf der Frist — bis
 * dahin steht der Eintrag noch in der Ablage.
 */
```

(e) Nach `const [name, setName] = useState('');` einfügen:

```tsx
  const [umbenennung, setUmbenennung] = useState<Umbenennung | null>(null);
  /** Namen mit laufender Rückgängig-Frist. */
  const [schwebend, setSchwebend] = useState<ReadonlySet<string>>(() => new Set());
  const fristen = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  // Der Fristablauf sieht die Liste zum Zeitpunkt des Ablaufs, nicht die beim Klick.
  const listeRef = useRef(liste);
  listeRef.current = liste;

  // Laufende Fristen überleben das Panel nicht (etwa beim Ausblenden der
  // Oberfläche mit H); der Eintrag bleibt dann in der Ablage.
  useEffect(() => {
    const laufend = fristen.current;
    return () => {
      for (const id of laufend.values()) clearTimeout(id);
      laufend.clear();
    };
  }, []);
```

(f) Vor `const speichern = …` einfügen:

```tsx
  const fristAbbrechen = (n: string): void => {
    const id = fristen.current.get(n);
    if (id !== undefined) {
      clearTimeout(id);
      fristen.current.delete(n);
    }
    setSchwebend((s) => {
      if (!s.has(n)) return s;
      const kopie = new Set(s);
      kopie.delete(n);
      return kopie;
    });
  };
```

und in `speichern` nach `if (bereinigt === '') return;` die Zeile `fristAbbrechen(bereinigt);` (Überschreiben eines schwebenden Eintrags hebt sein Löschen auf).

(g) Nach `laden` einfügen:

```tsx
  const loeschen = (n: string): void => {
    setSchwebend((s) => new Set(s).add(n));
    fristen.current.set(n, setTimeout(() => {
      fristen.current.delete(n);
      setSchwebend((s) => {
        const kopie = new Set(s);
        kopie.delete(n);
        return kopie;
      });
      aktualisiere(listeRef.current.filter((a) => a.name !== n));
    }, RUECKGAENGIG_MS));
  };

  const umbenennungBestaetigen = (): void => {
    if (umbenennung === null) return;
    const neu = nameBereinigen(umbenennung.neu);
    // Leerer Name: das Feld bleibt offen, bis Escape oder ein gültiger Name kommt.
    if (neu === null) return;
    if (neu === umbenennung.alt) {
      setUmbenennung(null);
      return;
    }
    if (liste.some((a) => a.name === neu)) {
      setUmbenennung({ ...umbenennung, doppelt: true });
      return;
    }
    aktualisiere(liste.map((a) => (a.name === umbenennung.alt ? { ...a, name: neu } : a)));
    setUmbenennung(null);
  };
```

(h) Die gesamte Funktion `zeile` (samt JSDoc) ersetzen durch:

```tsx
  /** Eine Zeile: gewöhnlich, im Umbenennen oder mit laufender Rückgängig-Frist. */
  const zeile = (ansicht: Ansicht): React.JSX.Element => {
    const n = ansicht.name;
    if (schwebend.has(n)) {
      return (
        <>
          <span className="min-w-0 flex-1 truncate line-through opacity-60">{n}</span>
          <button
            type="button"
            className={KLEIN}
            aria-label={`${t('views.undo')}: ${n}`}
            onClick={() => { fristAbbrechen(n); }}
          >
            {t('views.undo')}
          </button>
        </>
      );
    }
    if (umbenennung !== null && umbenennung.alt === n) {
      return (
        <>
          <input
            type="text"
            autoFocus
            aria-label={t('views.newName')}
            aria-invalid={umbenennung.doppelt}
            value={umbenennung.neu}
            maxLength={NAME_MAX}
            onChange={(e) => { setUmbenennung({ ...umbenennung, neu: e.target.value, doppelt: false }); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                umbenennungBestaetigen();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setUmbenennung(null);
              }
            }}
            className={`${FELD} ${umbenennung.doppelt ? 'border-red-400' : ''}`}
          />
          {umbenennung.doppelt ? <span className="basis-full text-amber-200">{t('views.nameTaken')}</span> : null}
        </>
      );
    }
    return (
      <>
        <button
          type="button"
          aria-label={`${t('views.load')}: ${n}`}
          onClick={() => { laden(ansicht); }}
          className="min-w-0 flex-1 truncate rounded px-1 text-left hover:bg-white/10"
        >
          {n}
        </button>
        <button
          type="button"
          className={KLEIN}
          aria-label={`${t('views.rename')}: ${n}`}
          onClick={() => { setUmbenennung({ alt: n, neu: n, doppelt: false }); }}
        >
          {t('views.rename')}
        </button>
        <button
          type="button"
          className={KLEIN}
          aria-label={`${t('views.delete')}: ${n}`}
          onClick={() => { loeschen(n); }}
        >
          {t('views.delete')}
        </button>
      </>
    );
  };
```

- [ ] **Schritt 4: Tests laufen lassen** — `npx vitest run src/ui/panels/AnsichtenPanel.test.tsx`. Erwartet: alle zwölf grün.

- [ ] **Schritt 5: Sichtkontrolle im Browser** — `browser_navigate`, Qualität `high`, Ansicht „Test" speichern, „Umbenennen: Test" klicken, `browser_type` „Test 2" mit `submit: true`, Snapshot zeigt „Test 2"; „Löschen: Test 2" klicken, Snapshot zeigt „Rückgängig"; `browser_evaluate` mit `await new Promise((r) => setTimeout(r, 5500)); localStorage.getItem('orrery.ansichten.v1')` → `[]`. Konsole: 0 Fehler.

- [ ] **Schritt 6: Alles prüfen** — `npm test`, `npm run lint`.

- [ ] **Schritt 7: Commit**

```bash
git add src/ui/panels/AnsichtenPanel.tsx src/ui/panels/AnsichtenPanel.test.tsx
git commit -m "Panel Ansichten: umbenennen, löschen mit Rückgängig"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 5: Panel „Ansichten" — Exportieren und Importieren

**Dateien:**
- Ändern: `src/ui/panels/AnsichtenPanel.tsx`, `src/ui/panels/AnsichtenPanel.test.tsx`

**Schnittstellen:**
- Konsumiert: `ansichtenExportieren`, `ansichtenImportieren`, `EXPORT_DATEINAME`, `EXPORT_FORMAT` aus `store/persist.ts`; die Datei aus Task 4.
- Produziert: keine neuen Exporte. Beschriftungen (für Task 6): Knöpfe „Exportieren", „Importieren"; Meldungszeile `role="status"` unter den Knöpfen; verstecktes `input[type=file]` mit `accept=".json,application/json"`.

- [ ] **Schritt 1: Fehlschlagende Tests anhängen** — Importzeilen am Kopf der Testdatei ersetzen durch

```tsx
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { AnsichtenPanel } from './AnsichtenPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCHLUESSEL_ANSICHTEN, EXPORT_FORMAT } from '../../store/persist';
```

(die übrigen Importe bleiben) und ans Ende der Datei:

```tsx
describe('AnsichtenPanel: exportieren und importieren', () => {
  const dateiFeld = (container: HTMLElement): HTMLInputElement =>
    container.querySelector('input[type="file"]') as HTMLInputElement;

  const exportDatei = (ansichten: unknown): File =>
    new File([JSON.stringify({ format: EXPORT_FORMAT, version: 1, ansichten })], 'a.json', { type: 'application/json' });

  afterEach(() => {
    vi.restoreAllMocks();
    // jsdom kennt keine Blob-URLs; die Stubs aus dem Export-Test wieder entfernen.
    Reflect.deleteProperty(URL, 'createObjectURL');
    Reflect.deleteProperty(URL, 'revokeObjectURL');
  });

  it('Exportieren ist ohne Ansichten deaktiviert', () => {
    render(<AnsichtenPanel ablage={ablageFake()} />);
    expect((screen.getByRole('button', { name: 'Exportieren' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('exportiert die Liste als JSON-Datei mit Umschlag über einen Download-Link', async () => {
    const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:orrery');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true });
    let dateiname = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      dateiname = this.download;
    });
    render(<AnsichtenPanel ablage={mitAnsichten([{ name: 'Saturn', state: { scale: { sizeScale: 7 } } }])} />);
    fireEvent.click(screen.getByRole('button', { name: 'Exportieren' }));
    expect(dateiname).toBe('orrery-ansichten.json');
    const blob = createObjectURL.mock.calls[0]?.[0] as Blob;
    expect(JSON.parse(await blob.text())).toEqual({
      format: EXPORT_FORMAT, version: 1, ansichten: [{ name: 'Saturn', state: { scale: { sizeScale: 7 } } }],
    });
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:orrery');
  });

  it('importiert eine gültige Datei, hängt sie an und löst Namenskonflikte', async () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    const { container } = render(<AnsichtenPanel ablage={ablage} />);
    const datei = exportDatei([{ name: 'Saturn', state: {} }, { name: 'Erde', state: { display: { orbits: false } } }]);
    fireEvent.change(dateiFeld(container), { target: { files: [datei] } });
    await waitFor(() => { expect(screen.getByRole('button', { name: 'Ansicht laden: Erde' })).toBeTruthy(); });
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn', 'Saturn (2)', 'Erde']);
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('meldet eine fremde Datei und übernimmt nichts', async () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    const { container } = render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(dateiFeld(container), { target: { files: [new File(['kein json'], 'x.json')] } });
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Datei ist kein Ansichten-Export'); });
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn']);
  });

  it('meldet eine Datei ohne gültigen Eintrag', async () => {
    const { container } = render(<AnsichtenPanel ablage={ablageFake()} />);
    fireEvent.change(dateiFeld(container), { target: { files: [exportDatei([{ name: '', state: {} }])] } });
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Datei enthält keine gültige Ansicht'); });
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
  });

  it('nennt die Zahl der verworfenen Einträge; die Meldung geht beim nächsten Erfolg', async () => {
    const ablage = ablageFake();
    const { container } = render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(dateiFeld(container), { target: { files: [exportDatei([{ name: 'Erde', state: {} }, { name: '', state: {} }, 7])] } });
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Verworfene Einträge: 2'); });
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Erde']);
    fireEvent.change(namensfeld(), { target: { value: 'Mars' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(screen.getByRole('status').textContent).toBe('');
  });
});
```

- [ ] **Schritt 2: Tests laufen lassen** — `npx vitest run src/ui/panels/AnsichtenPanel.test.tsx`. Erwartet: die sechs neuen Fälle scheitern, zwölf bleiben grün.

- [ ] **Schritt 3: Komponente erweitern** — in `src/ui/panels/AnsichtenPanel.tsx`:

(a) Den Import aus `store/persist` ersetzen durch

```tsx
import {
  ablageHolen, ansichtAnwenden, ansichtErstellen, ansichtenExportieren, ansichtenImportieren,
  ansichtenLesen, ansichtenSchreiben, nameBereinigen, EXPORT_DATEINAME, NAME_MAX,
} from '../../store/persist';
```

(b) Nach dem `Umbenennung`-Interface:

```tsx
/** Meldung unter den Knöpfen; Schlüssel statt Text, damit ein Sprachwechsel sie mitnimmt. */
interface Meldung { schluessel: string; anzahl: number }
```

(c) Im JSDoc der Komponente den ersten Satz erweitern zu „… umbenennen und löschen (fünf Sekunden Rückgängig), als JSON-Datei exportieren und importieren."

(d) Nach `listeRef.current = liste;` einfügen:

```tsx
  const [meldung, setMeldung] = useState<Meldung | null>(null);
  const dateiFeld = useRef<HTMLInputElement | null>(null);
```

(e) Erfolgreiche Vorgänge räumen die Meldung weg (Entwurf §5.3): `setMeldung(null);` als erste Anweisung nach dem Guard in `speichern` (nach `fristAbbrechen(bereinigt);`), als erste Anweisung in `laden` und in `loeschen`, und in `umbenennungBestaetigen` direkt vor `aktualisiere(…)`.

(f) Nach `umbenennungBestaetigen` einfügen:

```tsx
  const exportieren = (): void => {
    setMeldung(null);
    const url = URL.createObjectURL(new Blob([ansichtenExportieren(liste)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = EXPORT_DATEINAME;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importieren = async (datei: File): Promise<void> => {
    const ergebnis = ansichtenImportieren(await datei.text(), listeRef.current);
    if (ergebnis.fehler !== null) {
      setMeldung({
        schluessel: ergebnis.fehler === 'umschlag' ? 'views.importInvalid' : 'views.importEmpty',
        anzahl: 0,
      });
      return;
    }
    aktualisiere(ergebnis.liste);
    setMeldung(ergebnis.verworfen > 0 ? { schluessel: 'views.importSkipped', anzahl: ergebnis.verworfen } : null);
  };
```

(g) Im JSX nach dem Block `{liste.length === 0 ? … : …}` und vor dem schließenden `</div>`:

```tsx
        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-2">
          <button type="button" className={KNOPF} onClick={exportieren} disabled={liste.length === 0}>
            {t('views.export')}
          </button>
          <button type="button" className={KNOPF} onClick={() => { dateiFeld.current?.click(); }}>
            {t('views.import')}
          </button>
          <input
            ref={dateiFeld}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const datei = e.target.files?.[0];
              // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann.
              e.target.value = '';
              if (datei !== undefined) void importieren(datei);
            }}
          />
        </div>
        {/* Immer im Baum, damit die Live-Region beim ersten Text schon existiert. */}
        <p role="status" className="m-0 text-amber-200">
          {meldung === null ? '' : t(meldung.schluessel).replace('{n}', String(meldung.anzahl))}
        </p>
```

- [ ] **Schritt 4: Tests laufen lassen** — `npx vitest run src/ui/panels/AnsichtenPanel.test.tsx`. Erwartet: alle achtzehn grün.

- [ ] **Schritt 5: Alles prüfen** — `npm test`, `npm run lint`, `npm run build`. Die Sichtkontrolle von Export und Import übernimmt Task 6 (Download und Dateiwahl brauchen Playwright-Ereignisse).

- [ ] **Schritt 6: Commit**

```bash
git add src/ui/panels/AnsichtenPanel.tsx src/ui/panels/AnsichtenPanel.test.tsx
git commit -m "Panel Ansichten: exportieren und importieren"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 6: Abnahme im Browser und Protokoll

**Dateien:**
- Erstellen: `docs/phase4b-etappe2-abnahme.md`
- Ändern: `README.md` (Absatz zum Stand)
- Schreiben nur nach `.playwright-mcp/` (Export-Datei, Screenshot; nicht committen)

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 5; `window.store` im DEV-Build; Oberfläche auf Deutsch (Browsersprache des Prüfrechners).
- Produziert: Protokoll mit wörtlichen Abfragewerten.

Warten im Browser immer per `browser_evaluate` mit `await new Promise((r) => setTimeout(r, ms))`, nicht mit `browser_wait_for`. Nach jedem `browser_navigate` sofort `window.store.setState({ quality: { tier: 'high' } })`. Ein Platzhalter `<Projektstamm>` steht für das Projektverzeichnis, es erscheint nicht im Protokoll.

- [ ] **Schritt 1: Server und Stand** — `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`; `git status --short` leer; `git log --oneline -1` notieren.

- [ ] **Schritt 2: Speichern, verändern, laden** — `browser_navigate` auf `http://localhost:5173/Orrery/`, dann `browser_evaluate`:

```js
localStorage.removeItem('orrery.ansichten.v1');
const s = window.store.getState();
s.setScale({ sizeScale: 7, preset: null });
s.setDisplay({ orbits: false });
s.setCamera({ targetId: 'saturn', mode: 'attached' });
s.toggleVisible('mars');
s.setTime({ rateDaysPerSec: 30 });
```

Im Panel „Ansichten" per `browser_type` „Saturn" in „Name der Ansicht" (mit `submit: true`), dann `localStorage.getItem('orrery.ansichten.v1')`. Erwartet: `[{"name":"Saturn","state":{"time":{"rateDaysPerSec":30},"scale":{"sizeScale":7,"preset":null},"display":{"orbits":false},"camera":{"targetId":"saturn","mode":"attached"},"visible":{"mars":false}}}]`. Dann verändern:

```js
const s = window.store.getState();
s.setScale({ sizeScale: 2 });
s.setDisplay({ orbits: true });
s.setCamera({ targetId: 'earth', mode: 'free' });
s.toggleVisible('mars');
s.setTime({ jd: 2461294.5, paused: true, rateDaysPerSec: 1 });
window.store.setState({ quality: { tier: 'low' } });
```

Klick auf „Ansicht laden: Saturn" (`browser_click`, Element aus dem Snapshot), Abfrage:

```js
(({ scale, display, camera, visible, time, quality }) => ({ sizeScale: scale.sizeScale, preset: scale.preset, orbits: display.orbits, targetId: camera.targetId, mode: camera.mode, mars: visible.mars, rate: time.rateDaysPerSec, jd: time.jd, paused: time.paused, tier: quality.tier }))(window.store.getState())
```

Erwartet: `{ sizeScale: 7, preset: null, orbits: false, targetId: 'saturn', mode: 'attached', mars: false, rate: 30, jd: 2461294.5, paused: true, tier: 'low' }`. Werte wörtlich ins Protokoll. Danach `window.store.setState({ quality: { tier: 'high' } })`.

- [ ] **Schritt 3: Umbenennen und Löschen mit Rückgängig** — Klick „Umbenennen: Saturn", `browser_type` „Saturn nah" mit `submit: true`; `JSON.parse(localStorage.getItem('orrery.ansichten.v1')).map((a) => a.name)` → `['Saturn nah']`. Klick „Löschen: Saturn nah", Snapshot zeigt „Rückgängig", Klick „Rückgängig: Saturn nah", Snapshot zeigt „Saturn nah" wieder als Ladeknopf; Ablage unverändert.

- [ ] **Schritt 4: Exportieren** — zweite Ansicht anlegen: `window.store.getState().setScale({ sizeScale: 3 })`, „Erde" eintippen und speichern. `browser_run_code_unsafe`:

```js
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Exportieren' }).click(),
]);
await download.saveAs('<Projektstamm>/.playwright-mcp/orrery-ansichten.json');
return download.suggestedFilename();
```

Erwartet: `orrery-ansichten.json`. Datei lesen (Read): `format` ist `orrery-ansichten`, `version` 1, `ansichten` hat zwei Einträge mit den Namen `Saturn nah` und `Erde`. Inhalt gekürzt ins Protokoll.

- [ ] **Schritt 5: Löschen und Importieren** — beide Einträge löschen und 5,5 s warten (`await new Promise((r) => setTimeout(r, 5500))`), `localStorage.getItem('orrery.ansichten.v1')` → `[]`, Snapshot zeigt „Noch keine Ansichten gespeichert.". Klick „Importieren" öffnet die Dateiwahl; `browser_file_upload` mit `<Projektstamm>/.playwright-mcp/orrery-ansichten.json`. Erwartet: Liste zeigt „Saturn nah" und „Erde", Meldungszeile leer, Ablage gleich dem Feld `ansichten` der Datei (`JSON.stringify(JSON.parse(localStorage.getItem('orrery.ansichten.v1'))) === JSON.stringify(<Dateiinhalt>.ansichten)` → `true`). Zweiter Import derselben Datei: Liste bekommt „Saturn nah (2)" und „Erde (2)".

- [ ] **Schritt 6: Fremde Datei** — `.playwright-mcp/fremd.json` mit Inhalt `{"hallo":1}` anlegen, importieren. Erwartet: Meldungszeile „Datei ist kein Ansichten-Export", Liste unverändert (vier Einträge).

- [ ] **Schritt 7: Neuladen** — `browser_navigate` auf dieselbe Adresse, Qualität `high`; Snapshot: Panel „Ansichten" zeigt die vier Einträge. Dann `localStorage.removeItem('orrery.ansichten.v1')`.

- [ ] **Schritt 8: Panel bei 400 px** — `browser_resize` auf 400 × 900, Screenshot nach `.playwright-mcp/ansichten-400.png`, `browser_evaluate`:

```js
[...document.querySelectorAll('section')].map((s) => { const r = s.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), innerWidth }; })
```

Erwartet: jede Kante `left >= 0` und `right <= innerWidth`. Zurück auf 1280 × 800.

- [ ] **Schritt 9: Konsole** — `browser_console_messages`: 0 Fehler, 0 Warnungen (sonst wörtlich ins Protokoll).

- [ ] **Schritt 10: Lint, Test, Build** — `npm run lint`, `npm test`, `npm run build`; Schlusszeilen ins Protokoll.

- [ ] **Schritt 11: Protokoll `docs/phase4b-etappe2-abnahme.md`** — Aufbau wie `docs/phase4b-etappe1-abnahme.md`: Kopf (Datum, Branch, Commit, Prüfumgebung), je Schritt die wörtlichen Abfragewerte, Konsole, Lint/Test/Build. Das Kriterium des Gesamtentwurfs „Presets speichern, laden, exportieren, importieren" zitieren und bewerten. Bekannte Unschärfen vermerken: (1) ein Löschen mit laufender Frist wird beim Ausblenden der Oberfläche (Taste H) verworfen, der Eintrag bleibt; (2) der Namenssuffix „ (2)" kann einen Namen über 80 Zeichen hinaus verlängern, beim nächsten Lesen fällt so ein Eintrag weg; (3) `ansichtAnwenden` setzt nicht genannte Einstellungen auf den Standard (Ruling), nicht wie in Entwurf §4.5 formuliert.

- [ ] **Schritt 12: README** — Absatz zum Stand: 4b vollständig (Etappe 1 URL-Sharing und Sitzung, Etappe 2 Ansichten), 4c Infopanel offen.

- [ ] **Schritt 13: Commit**

```bash
git add docs/phase4b-etappe2-abnahme.md README.md
git commit -m "Abnahme 4b Etappe 2: Panel Ansichten"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Abschluss

- [ ] `npm run lint`, `npm test`, `npm run build` auf dem Branch, Ausgabe zeigen.
- [ ] Die lokale Projektanleitung im Abschnitt „Stand" nachziehen (Etappe 2 auf master, Testzahl, nächster Schritt 4c nur nach Freigabe; offene Frage Link vs. Sitzung bleibt).
- [ ] Fast-Forward nach `master`, Branch `ansichten` löschen, `.playwright-mcp/` leeren. Tag: keiner (Phase 4 wird erst nach 4c getaggt).
- [ ] Rulings gesammelt an Jens melden.

## Rulings

- 2026-09-14 — **`ansichtAnwenden` ersetzt die Einstellungen** statt sie nur über den aktuellen Zustand zu legen (Entwurf §4.5 letzter Satz): Ein Patch enthält nur Abweichungen vom Standard und kann „Standardwert" nicht von „nicht enthalten" unterscheiden. Mit reinem Überlagern hielte eine Ansicht mit eingeschalteten Bahnlinien (Standard) ausgeschaltete Bahnlinien nicht wieder an, und ein ausgeblendeter Mars bliebe ausgeblendet. Vom aktuellen Zustand bleiben genau die Zweige, die das Profil `ansicht` streicht (Zeitpunkt, Pause, Kino, Qualität, Oberfläche); das entspricht dem Satz davor im Entwurf: „Maßstab, Darstellung, Kamera, Sichtbarkeit und Zeitrate kommen aus der Ansicht."
- 2026-09-14 — **Importfehler als Kennung**, nicht als Text (`fehler: 'umschlag' | 'leer'`, dazu `verworfen: number`), abweichend von der Signatur in §3.4: `store/` kennt keine Sprachtabelle, sichtbarer Text gehört nur nach `ui/i18n`. Das Panel übersetzt.
- 2026-09-14 — **Wertebereiche im Prüfer** als Tabelle `BEREICHE` in `store/pruefer.ts`; die Zahlen sind Zwillinge der Regler- und Kameragrenzen, weil `store/` weder `ui/` noch `render/` importieren darf. Werte außerhalb fallen weg, werden nicht eingeklemmt.
- 2026-09-14 — **Namen**: getrimmt, nichtleer, höchstens 80 Zeichen (`NAME_MAX`); längere Einträge aus Ablage oder Datei fallen weg. Der Ladeknopf trägt `aria-label` „Ansicht laden: <Name>", damit Screenreader den Zweck des Knopfes ansagen.
- 2026-09-14 — **Umbenennen** bestätigt nur mit Enter, bricht nur mit Escape ab; ein Verlassen des Feldes lässt es offen, ein leerer Name ebenfalls. Der unveränderte Name schließt das Feld ohne Schreibvorgang.
- 2026-09-14 — **Löschen** schreibt erst beim Ablauf der fünf Sekunden; wird das Panel vorher abgebaut (Oberfläche ausgeblendet), bleibt der Eintrag in der Ablage. Speichern unter dem Namen eines schwebenden Eintrags hebt dessen Löschen auf.
- 2026-09-14 — **Exportieren** ist bei leerer Liste deaktiviert. **Meldungen** unter den Knöpfen verschwinden bei jedem erfolgreichen Vorgang (Speichern, Laden, Umbenennen, Löschen, Export, Import).
- 2026-09-14 — **Wortlaut** der Teilerfolgsmeldung: „Verworfene Einträge: {n}" / „Discarded entries: {n}", weil `t()` keine Pluralformen kennt und „1 Einträge" falsch wäre.
