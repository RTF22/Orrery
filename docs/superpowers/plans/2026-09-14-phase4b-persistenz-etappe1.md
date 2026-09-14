# Phase 4b Persistenz, Etappe 1 — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Ein geteilter Link stellt die Ansicht exakt wieder her, die Sitzung wird automatisch gesichert und beim Start wiederhergestellt (abschaltbar), die Kopfzeile bekommt „Link kopieren" und „Zurücksetzen", und jeder von außen kommende Zustand läuft durch einen feldweisen Prüfer.

**Architektur:** Der feldweise Prüfer `pruefeZustand` in `store/pruefer.ts` gleicht rohe Objekte gegen `DEFAULT_STATE` ab; `decodeState` benutzt ihn. `store/persist.ts` hält Profile (`link`, `sitzung`, `ansicht`), die Ablagefunktionen mit `Storage` als Parameter, `linkErzeugen` und `zurueckgesetzt`. `app/persistenz.ts` verdrahtet Start (Fragment vor Sitzung vor Standard) und die gedrosselte Sicherung; `main.tsx` ruft beides. Die Präferenz „Sitzung merken" lebt außerhalb des Stores im Hook `useSitzungMerken`.

**Tech-Stack:** TypeScript, React 19, Zustand, Vitest (node bzw. jsdom mit Testing Library), Vite, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-14-phase4b-persistenz-design.md` — der Plan argumentiert aus dem Entwurf, Umsetzer lesen beides. Etappe 2 (Panel „Ansichten") bekommt nach der Abnahme dieser Etappe einen eigenen Plan.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Tests). Umlaute korrekt. Nur die Werte in `en.ts` sind Englisch.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungs-URL, keine Werkzeugnamen. Nach jedem Commit prüfen: `git log --format=%B -1 | grep -ci 'co-authored\|session'` muss 0 ergeben.
- Branch `persistenz` (von `master`), **kein Worktree**: der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten mit einseitiger Abhängigkeit: `ui/` → `store/` → `render/` → `sim/`; `data/` reine Daten, `app/` Einstieg (darf alles kennen, wird von niemandem importiert). **Kein Import aus `app/` in `ui/`**, kein Import aus `ui/` in `render/`.
- Kein Literal mit sichtbarem Text außerhalb von `ui/i18n/de.ts` und `ui/i18n/en.ts`.
- Neue Dateien vor dem ersten Import anlegen, sonst zeigt der laufende Vite-Server ein Fehler-Overlay.
- Alle Speicherzugriffe (`localStorage`) sitzen ausschließlich in `store/persist.ts` hinter `try/catch`.
- Vor „fertig" je Task: `npm test`, `npm run lint`; am Ende `npm run build`.
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

## Dateistruktur

| Datei | Aufgabe |
|---|---|
| `src/store/pruefer.ts` (neu) | `Plain`, `istPlain`, `GEFAEHRLICHE_SCHLUESSEL`, `pruefeZustand` |
| `src/store/serialize.ts` | importiert die drei Helfer aus `pruefer.ts`; neu `encodePatch`, `decodePatch`; `decodeState` prüft; `diff` überspringt Funktionen |
| `src/store/persist.ts` (neu) | Profile, `patchFuer`, `linkErzeugen`, `zurueckgesetzt`, `Ablage`, `ablageHolen`, Sitzungs- und Präferenzfunktionen |
| `src/app/persistenz.ts` (neu) | `fragmentLesen`, `startZustand`, `sicherungStarten` |
| `src/app/main.tsx` | ruft `startZustand` und `sicherungStarten` |
| `src/ui/useSitzungMerken.ts` (neu) | Hook für die Präferenz |
| `src/ui/Kopfzeile.tsx` | zwei Schaltflächen und Statusmeldung |
| `src/ui/panels/DisplayPanel.tsx` | Checkbox „Sitzung merken" |
| `src/ui/i18n/de.ts`, `en.ts` | fünf neue Schlüssel |
| `docs/phase4b-etappe1-abnahme.md` (neu) | Protokoll |

---

### Task 1: Feldweiser Prüfer `pruefeZustand`, `decodeState` prüft

**Dateien:**
- Erstellen: `src/store/pruefer.ts`, `src/store/pruefer.test.ts`
- Ändern: `src/store/serialize.ts`, `src/store/serialize.test.ts`

**Schnittstellen:**
- Konsumiert: `DEFAULT_STATE` aus `store/index.ts`; `SCALE_PRESETS` aus `sim/scale.ts`; `bodyIndex` aus `data/index.ts`.
- Produziert (`store/pruefer.ts`): `type Plain = Record<string, unknown>`; `istPlain(x: unknown): x is Plain`; `GEFAEHRLICHE_SCHLUESSEL: ReadonlySet<string>`; `pruefeZustand(roh: unknown): Plain`. Produziert (`store/serialize.ts`, zusätzlich zu den bestehenden Exporten): `encodePatch(patch: Plain): string`; `decodePatch(fragment: string): Plain`; `export type { Plain }`. Spätere Tasks verlassen sich auf genau diese Namen.

- [ ] **Schritt 1: `src/store/pruefer.ts` anlegen** (vollständiger Inhalt):

```ts
import { DEFAULT_STATE } from './index';
import { SCALE_PRESETS } from '../sim/scale';
import { bodyIndex } from '../data';

export type Plain = Record<string, unknown>;

/**
 * Schlüssel, die eine Zuweisung über eckige Klammern (`out[key] = ...`) auf
 * einem gewöhnlichen Objekt nicht als neue Eigenschaft anlegt, sondern als
 * Zugriff auf den Prototyp bzw. den Konstruktor selbst behandelt. Jeder von
 * außen kommende Zustand (URL-Fragment, Ablage, Import) ist beliebiges JSON;
 * `{"__proto__":{"boese":true}}` würde ohne diesen Filter den Prototyp des
 * zurückgegebenen Zustands verändern. Eine einzige Stelle für Prüfer und
 * Serialisierung, damit die Liste nicht zweimal gepflegt werden muss.
 */
export const GEFAEHRLICHE_SCHLUESSEL: ReadonlySet<string> = new Set(['__proto__', 'constructor', 'prototype']);

export function istPlain(x: unknown): x is Plain {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

/** Aufzählungen je Pfad; ein Wert außerhalb der Liste wird verworfen. */
const AUFZAEHLUNGEN: Readonly<Record<string, readonly string[]>> = {
  'camera.mode': ['free', 'attached', 'follow', 'cinema'],
  'quality.tier': ['auto', 'low', 'medium', 'high'],
  'ui.language': ['de', 'en'],
  'scale.preset': Object.keys(SCALE_PRESETS),
};

/** Felder, die null sein dürfen, mit dem Typ des Nicht-null-Falls. */
const NULLBAR: Readonly<Record<string, 'number' | 'string'>> = {
  'camera.freezeJd': 'number',
  'scale.preset': 'string',
};

/** Records mit freien Schlüsseln und ausschließlich booleschen Werten. */
const BOOLESCHE_RECORDS: ReadonlySet<string> = new Set(['visible', 'ui.panels']);

/** Markierung für „dieses Feld fällt weg" — undefined wäre als Wert mehrdeutig. */
const VERWORFEN = Symbol('verworfen');

function pruefeRecord(wert: unknown): Plain | typeof VERWORFEN {
  if (!istPlain(wert)) return VERWORFEN;
  const out: Plain = {};
  for (const [k, v] of Object.entries(wert)) {
    if (!GEFAEHRLICHE_SCHLUESSEL.has(k) && typeof v === 'boolean') out[k] = v;
  }
  return out;
}

function pruefeFeld(pfad: string, wert: unknown, standard: unknown): unknown {
  if (BOOLESCHE_RECORDS.has(pfad)) return pruefeRecord(wert);
  if (wert === null) return Object.hasOwn(NULLBAR, pfad) ? null : VERWORFEN;
  if (Object.hasOwn(AUFZAEHLUNGEN, pfad)) {
    return typeof wert === 'string' && AUFZAEHLUNGEN[pfad]?.includes(wert) ? wert : VERWORFEN;
  }
  if (pfad === 'camera.targetId') {
    return typeof wert === 'string' && Object.hasOwn(bodyIndex, wert) ? wert : VERWORFEN;
  }
  if (istPlain(standard)) return istPlain(wert) ? pruefeZweig(pfad, wert, standard) : VERWORFEN;
  const erwartet = NULLBAR[pfad] ?? typeof standard;
  if (typeof wert !== erwartet) return VERWORFEN;
  if (typeof wert === 'number' && !Number.isFinite(wert)) return VERWORFEN;
  return wert;
}

function pruefeZweig(pfad: string, wert: Plain, standard: Plain): Plain {
  const out: Plain = {};
  for (const [key, kind] of Object.entries(wert)) {
    if (GEFAEHRLICHE_SCHLUESSEL.has(key) || !Object.hasOwn(standard, key)) continue;
    const kindPfad = pfad === '' ? key : `${pfad}.${key}`;
    const ergebnis = pruefeFeld(kindPfad, kind, standard[key]);
    if (ergebnis === VERWORFEN) continue;
    // Ein Zweig, aus dem alles herausgefallen ist, ist keine Abweichung mehr.
    if (istPlain(ergebnis) && Object.keys(ergebnis).length === 0) continue;
    out[key] = ergebnis;
  }
  return out;
}

/**
 * Feldweiser Prüfer für Zustände von außen (URL-Fragment, Ablage, Import).
 * Gleicht gegen die Form von DEFAULT_STATE ab: unbekannte Schlüssel fallen
 * weg, Typen müssen zum Standardwert passen, Zahlen endlich sein,
 * Aufzählungen in ihrer Liste liegen, das Kameraziel ein bekannter Körper
 * sein. Ungültig ist immer nur das einzelne Feld, nie der ganze Zustand —
 * ein Link aus einer älteren Version liefert so noch das Gültige. Das
 * Ergebnis ist ein Patch für fromShareable, kein vollständiger Zustand.
 */
export function pruefeZustand(roh: unknown): Plain {
  return istPlain(roh) ? pruefeZweig('', roh, DEFAULT_STATE as unknown as Plain) : {};
}
```

- [ ] **Schritt 2: Fehlschlagende Tests `src/store/pruefer.test.ts`** (vollständiger Inhalt):

```ts
import { describe, it, expect } from 'vitest';
import { pruefeZustand } from './pruefer';

describe('pruefeZustand', () => {
  it('liefert für Nicht-Objekte ein leeres Objekt', () => {
    expect(pruefeZustand(null)).toEqual({});
    expect(pruefeZustand('x')).toEqual({});
    expect(pruefeZustand([1])).toEqual({});
    expect(pruefeZustand(undefined)).toEqual({});
  });

  it('lässt einen gültigen Patch unverändert durch', () => {
    const patch = {
      time: { jd: 2451545.5, paused: true },
      scale: { sizeScale: 3, preset: null },
      ui: { language: 'en' },
    };
    expect(pruefeZustand(patch)).toEqual(patch);
  });

  it('verwirft feldweise: falscher Typ, NaN, Infinity, unbekannter Schlüssel', () => {
    expect(pruefeZustand({
      time: { jd: 'x', rateDaysPerSec: NaN, paused: true },
      display: { brightness: Infinity, orbits: false },
      fremd: 1,
    })).toEqual({ time: { paused: true }, display: { orbits: false } });
  });

  it('prüft Aufzählungen', () => {
    expect(pruefeZustand({
      ui: { language: 'fr' }, camera: { mode: 'orbit' },
      quality: { tier: 'ultra' }, scale: { preset: 'riesig' },
    })).toEqual({});
    const gueltig = {
      ui: { language: 'en' }, camera: { mode: 'follow' },
      quality: { tier: 'low' }, scale: { preset: 'kompakt' },
    };
    expect(pruefeZustand(gueltig)).toEqual(gueltig);
  });

  it('erlaubt null nur bei freezeJd und preset', () => {
    expect(pruefeZustand({
      camera: { freezeJd: null, targetId: null },
      scale: { preset: null, sizeScale: null },
    })).toEqual({ camera: { freezeJd: null }, scale: { preset: null } });
    expect(pruefeZustand({ camera: { freezeJd: 2451545 } })).toEqual({ camera: { freezeJd: 2451545 } });
    expect(pruefeZustand({ camera: { freezeJd: 'gestern' } })).toEqual({});
  });

  it('kennt nur bekannte Körper als Kameraziel', () => {
    expect(pruefeZustand({ camera: { targetId: 'mars' } })).toEqual({ camera: { targetId: 'mars' } });
    expect(pruefeZustand({ camera: { targetId: 'vulcan' } })).toEqual({});
    expect(pruefeZustand({ camera: { targetId: 'toString' } })).toEqual({});
  });

  it('nimmt in visible und ui.panels nur boolesche Werte', () => {
    const roh = JSON.parse(
      '{"visible":{"mars":false,"moon":"nein","__proto__":{"x":1}},"ui":{"panels":{"display":false,"views":1}}}',
    ) as unknown;
    expect(pruefeZustand(roh)).toEqual({ visible: { mars: false }, ui: { panels: { display: false } } });
  });

  it('wehrt __proto__ ab', () => {
    const out = pruefeZustand(JSON.parse('{"__proto__":{"boese":true},"time":{"paused":true}}'));
    expect(out).toEqual({ time: { paused: true } });
    expect((out as { boese?: unknown }).boese).toBeUndefined();
  });

  it('lässt leere Zweige weg', () => {
    expect(pruefeZustand({ time: {}, display: { orbits: 'ja' }, visible: {} })).toEqual({});
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen** — `npx vitest run src/store/pruefer.test.ts`. Erwartet: alle grün (die Datei aus Schritt 1 ist vollständig; scheitert ein Fall, ist Schritt 1 zu korrigieren, nicht der Test).

- [ ] **Schritt 4: `src/store/serialize.ts` umbauen**

Oben ersetzen: den lokalen Typ `Plain` und die Konstante `GEFAEHRLICHE_SCHLUESSEL` samt JSDoc entfernen, stattdessen:

```ts
import type { AppState } from './types';
import { DEFAULT_STATE } from './index';
import { GEFAEHRLICHE_SCHLUESSEL, pruefeZustand } from './pruefer';
import type { Plain } from './pruefer';

export type { Plain };
```

In `diff` die erste Zeile der Schleife ändern (Funktionswerte überspringen — `useStore.getState()` enthält die Aktionen):

```ts
    if (GEFAEHRLICHE_SCHLUESSEL.has(key) || typeof wert === 'function') continue;
```

Den Block `encodeState`/`decodeState` am Ende ersetzen durch:

```ts
export function encodePatch(patch: Plain): string {
  return toBase64Url(JSON.stringify(patch));
}

export function encodeState(state: AppState): string {
  return encodePatch(toShareable(state));
}

/**
 * Geprüfter Patch aus dem Fragment; leer bei fehlendem oder beschädigtem
 * Fragment. Der Prüfer verwirft feldweise, siehe pruefer.ts — ein Fragment
 * mit `ui.language: 'fr'` liefert daher den Rest, die Sprache fällt weg.
 */
export function decodePatch(fragment: string): Plain {
  if (!fragment) return {};
  try {
    return pruefeZustand(JSON.parse(fromBase64Url(fragment)));
  } catch {
    return {};
  }
}

export function decodeState(fragment: string): AppState {
  return fromShareable(decodePatch(fragment));
}
```

- [ ] **Schritt 5: Tests in `src/store/serialize.test.ts` ergänzen** — Import um `encodePatch` erweitern (`import { toShareable, fromShareable, encodeState, decodeState, encodePatch } from './serialize';`) und ans Ende der Datei:

```ts
describe('decodeState — Prüfung (Pflichtpunkt 4b)', () => {
  it('fällt bei unbekannter Sprache auf Deutsch zurück und behält den Rest', () => {
    const s = decodeState(encodePatch({ ui: { language: 'fr' }, time: { paused: true } }));
    expect(s.ui.language).toBe('de');
    expect(s.time.paused).toBe(true);
  });

  it('verwirft ein Feld mit falschem Typ, nicht das Fragment', () => {
    const s = decodeState(encodePatch({ time: { jd: 'x', rateDaysPerSec: 7 } }));
    expect(s.time.jd).toBe(DEFAULT_STATE.time.jd);
    expect(s.time.rateDaysPerSec).toBe(7);
  });

  it('lässt Funktionen im Zustand nicht in den Patch', () => {
    const mitAktion = { ...structuredClone(DEFAULT_STATE), setTime: () => undefined } as unknown as AppState;
    expect(toShareable(mitAktion)).toEqual({});
  });
});
```

- [ ] **Schritt 6: Alles prüfen** — `npm test` (alle grün, Zahl der Tests notieren), `npm run lint`.

- [ ] **Schritt 7: Commit**

```bash
git add src/store/pruefer.ts src/store/pruefer.test.ts src/store/serialize.ts src/store/serialize.test.ts
git commit -m "Persistenz: feldweiser Prüfer für Zustände von außen, decodeState prüft"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 2: Profile und Ablage — `store/persist.ts`

**Dateien:**
- Erstellen: `src/store/persist.ts`, `src/store/persist.test.ts`

**Schnittstellen:**
- Konsumiert: `toShareable`, `encodePatch`, `decodeState` aus `store/serialize.ts`; `istPlain`, `pruefeZustand`, `Plain` aus `store/pruefer.ts`; `DEFAULT_STATE` aus `store/index.ts`.
- Produziert (`store/persist.ts`): `type Profil = 'link' | 'sitzung' | 'ansicht'`; `filtereProfil(patch: Plain, profil: Profil): Plain`; `patchFuer(state: AppState, profil: Profil): Plain`; `FRAGMENT_PRAEFIX = '#p='`; `linkErzeugen(state: AppState, ort: { origin: string; pathname: string }): string`; `zurueckgesetzt(aktuell: AppState): AppState`; `type Ablage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>`; `SCHLUESSEL_SITZUNG`, `SCHLUESSEL_MERKEN`; `ablageHolen(): Ablage | null`; `sitzungLesen(ablage: Ablage | null): Plain | null`; `sitzungSchreiben(ablage: Ablage | null, state: AppState): boolean`; `sitzungLoeschen(ablage: Ablage | null): void`; `sitzungMerkenLesen(ablage: Ablage | null): boolean`; `sitzungMerkenSchreiben(ablage: Ablage | null, an: boolean): void`.

- [ ] **Schritt 1: `src/store/persist.ts` anlegen** (vollständiger Inhalt):

```ts
import type { AppState } from './types';
import { DEFAULT_STATE } from './index';
import { istPlain, pruefeZustand } from './pruefer';
import type { Plain } from './pruefer';
import { encodePatch, toShareable } from './serialize';

/**
 * Drei Verwendungen desselben Diffs (Entwurf §3.1): Der Link lässt
 * Gerätespezifisches und Bedienzustand weg, die Sitzung nimmt alles, eine
 * Ansicht nur die Einstellungen, die man an einen anderen Zeitpunkt
 * mitnehmen will.
 */
export type Profil = 'link' | 'sitzung' | 'ansicht';

const GESTRICHEN: Readonly<Record<Profil, readonly string[]>> = {
  link: ['quality', 'ui.hidden', 'ui.panels'],
  sitzung: [],
  ansicht: ['time.jd', 'time.paused', 'cinema', 'quality', 'ui'],
};

function ohnePfad(obj: Plain, pfad: readonly string[]): Plain {
  const [kopf, ...rest] = pfad;
  if (kopf === undefined || !Object.hasOwn(obj, kopf)) return obj;
  const out: Plain = { ...obj };
  if (rest.length === 0) {
    delete out[kopf];
    return out;
  }
  const kind = out[kopf];
  if (!istPlain(kind)) return out;
  const gekuerzt = ohnePfad(kind, rest);
  // Ein leer gewordener Zweig ist keine Abweichung mehr.
  if (Object.keys(gekuerzt).length === 0) delete out[kopf];
  else out[kopf] = gekuerzt;
  return out;
}

export function filtereProfil(patch: Plain, profil: Profil): Plain {
  return GESTRICHEN[profil].reduce<Plain>((acc, pfad) => ohnePfad(acc, pfad.split('.')), patch);
}

export function patchFuer(state: AppState, profil: Profil): Plain {
  return filtereProfil(toShareable(state), profil);
}

export const FRAGMENT_PRAEFIX = '#p=';

/** Vollständige Adresse zum Teilen; Ursprung und Pfad kommen vom Aufrufer (location). */
export function linkErzeugen(state: AppState, ort: { origin: string; pathname: string }): string {
  return `${ort.origin}${ort.pathname}${FRAGMENT_PRAEFIX}${encodePatch(patchFuer(state, 'link'))}`;
}

/** Standardzustand, aber Sprache und Qualitätsstufe des aktuellen Zustands bleiben. */
export function zurueckgesetzt(aktuell: AppState): AppState {
  const s = structuredClone(DEFAULT_STATE);
  s.ui.language = aktuell.ui.language;
  s.quality.tier = aktuell.quality.tier;
  return s;
}

/* ---------- Ablage (localStorage) ---------- */

/** Nur die drei Methoden, die gebraucht werden — so genügt in Tests ein kleiner Fake. */
export type Ablage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const SCHLUESSEL_SITZUNG = 'orrery.sitzung.v1';
export const SCHLUESSEL_MERKEN = 'orrery.sitzungMerken';

/**
 * Schon der Zugriff auf localStorage kann werfen (SecurityError bei
 * blockierten Cookies); dann gibt es keine Ablage und alle Funktionen unten
 * verhalten sich wie bei leerer Ablage.
 */
export function ablageHolen(): Ablage | null {
  try {
    // Ohne DOM (Tests, Build-Skripte) fehlt die Eigenschaft ganz.
    const g = globalThis as { localStorage?: Ablage };
    return g.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Geprüfter Sitzungs-Patch; null, wenn nichts gespeichert oder der Eintrag beschädigt ist. */
export function sitzungLesen(ablage: Ablage | null): Plain | null {
  try {
    const text = ablage?.getItem(SCHLUESSEL_SITZUNG) ?? null;
    return text === null ? null : pruefeZustand(JSON.parse(text));
  } catch {
    return null;
  }
}

export function sitzungSchreiben(ablage: Ablage | null, state: AppState): boolean {
  try {
    if (ablage === null) return false;
    ablage.setItem(SCHLUESSEL_SITZUNG, JSON.stringify(patchFuer(state, 'sitzung')));
    return true;
  } catch {
    // Voll (QuotaExceededError) oder gesperrt: still, die Anwendung läuft weiter.
    return false;
  }
}

export function sitzungLoeschen(ablage: Ablage | null): void {
  try {
    ablage?.removeItem(SCHLUESSEL_SITZUNG);
  } catch {
    // Gesperrt: nichts zu tun.
  }
}

/** Fehlender Eintrag bedeutet „an" — die Sicherung ist der Normalfall. */
export function sitzungMerkenLesen(ablage: Ablage | null): boolean {
  try {
    return ablage?.getItem(SCHLUESSEL_MERKEN) !== '0';
  } catch {
    return true;
  }
}

export function sitzungMerkenSchreiben(ablage: Ablage | null, an: boolean): void {
  try {
    if (an) ablage?.removeItem(SCHLUESSEL_MERKEN);
    else ablage?.setItem(SCHLUESSEL_MERKEN, '0');
  } catch {
    // Gesperrt: nichts zu tun.
  }
}
```

- [ ] **Schritt 2: Fehlschlagende Tests `src/store/persist.test.ts`** (vollständiger Inhalt):

```ts
import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from './index';
import type { AppState } from './types';
import { decodeState, fromShareable, toShareable } from './serialize';
import {
  filtereProfil, patchFuer, linkErzeugen, zurueckgesetzt,
  sitzungLesen, sitzungSchreiben, sitzungLoeschen, sitzungMerkenLesen, sitzungMerkenSchreiben,
  SCHLUESSEL_SITZUNG, SCHLUESSEL_MERKEN,
} from './persist';
import type { Ablage } from './persist';

/** Ein Zustand, der in jedem Zweig vom Standard abweicht. */
const abgewandelt = (): AppState => {
  const s = structuredClone(DEFAULT_STATE);
  s.time.jd = 2461294.5;
  s.time.rateDaysPerSec = -30;
  s.time.paused = true;
  s.scale.sizeScale = 7;
  s.scale.preset = null;
  s.display.orbits = false;
  s.camera.targetId = 'saturn';
  s.camera.mode = 'attached';
  s.cinema.nummer = 3;
  s.cinema.elapsedSec = 12.5;
  s.visible.mercury = false;
  s.quality.tier = 'high';
  s.ui.hidden = true;
  s.ui.panels.display = false;
  s.ui.language = 'en';
  return s;
};

function ablageFake(): Ablage & { daten: Map<string, string> } {
  const daten = new Map<string, string>();
  return {
    daten,
    getItem: (k) => daten.get(k) ?? null,
    setItem: (k, v) => { daten.set(k, v); },
    removeItem: (k) => { daten.delete(k); },
  };
}

const werfend: Ablage = {
  getItem: () => { throw new Error('gesperrt'); },
  setItem: () => { throw new DOMException('voll', 'QuotaExceededError'); },
  removeItem: () => { throw new Error('gesperrt'); },
};

describe('filtereProfil', () => {
  const patch = toShareable(abgewandelt());

  it('link streicht Qualität und Bedienzustand, behält die Sprache', () => {
    const p = filtereProfil(patch, 'link');
    expect(p.quality).toBeUndefined();
    expect(p.ui).toEqual({ language: 'en' });
    expect(p.time).toEqual(patch.time);
    expect(p.cinema).toEqual(patch.cinema);
  });

  it('link lässt einen leer gewordenen ui-Zweig ganz weg', () => {
    expect(filtereProfil({ ui: { hidden: true, panels: { display: false } } }, 'link')).toEqual({});
  });

  it('sitzung streicht nichts', () => {
    expect(filtereProfil(patch, 'sitzung')).toEqual(patch);
  });

  it('ansicht streicht Zeitpunkt, Pause, Kino, Qualität und Oberfläche, behält die Zeitrate', () => {
    const p = filtereProfil(patch, 'ansicht');
    expect(p.time).toEqual({ rateDaysPerSec: -30 });
    expect(p.cinema).toBeUndefined();
    expect(p.quality).toBeUndefined();
    expect(p.ui).toBeUndefined();
    expect(p.scale).toEqual(patch.scale);
    expect(p.display).toEqual(patch.display);
    expect(p.camera).toEqual(patch.camera);
    expect(p.visible).toEqual(patch.visible);
  });

  it('lässt einen fehlenden Pfad unberührt', () => {
    expect(filtereProfil({ time: { paused: true } }, 'link')).toEqual({ time: { paused: true } });
  });
});

describe('Round-Trip je Profil', () => {
  it('link: alles außer Qualität und Bedienzustand kommt zurück', () => {
    const s = abgewandelt();
    const zurueck = fromShareable(patchFuer(s, 'link'));
    const erwartet = structuredClone(s);
    erwartet.quality = structuredClone(DEFAULT_STATE.quality);
    erwartet.ui.hidden = DEFAULT_STATE.ui.hidden;
    erwartet.ui.panels = structuredClone(DEFAULT_STATE.ui.panels);
    expect(zurueck).toEqual(erwartet);
  });

  it('sitzung: alles kommt zurück', () => {
    const s = abgewandelt();
    expect(fromShareable(patchFuer(s, 'sitzung'))).toEqual(s);
  });
});

describe('linkErzeugen', () => {
  it('baut Ursprung, Pfad und Fragment zusammen; das Fragment stellt die Ansicht wieder her', () => {
    const s = abgewandelt();
    const link = linkErzeugen(s, { origin: 'https://beispiel.test', pathname: '/Orrery/' });
    expect(link.startsWith('https://beispiel.test/Orrery/#p=')).toBe(true);
    const zurueck = decodeState(link.slice(link.indexOf('#p=') + 3));
    expect(zurueck.scale.sizeScale).toBe(7);
    expect(zurueck.ui.language).toBe('en');
    expect(zurueck.quality.tier).toBe('auto');
  });
});

describe('zurueckgesetzt', () => {
  it('liefert den Standard mit Sprache und Qualitätsstufe des aktuellen Zustands', () => {
    const z = zurueckgesetzt(abgewandelt());
    expect(z.ui.language).toBe('en');
    expect(z.quality.tier).toBe('high');
    expect(z.scale).toEqual(DEFAULT_STATE.scale);
    expect(z.ui.hidden).toBe(false);
    expect(z.visible).toEqual({});
  });
});

describe('Sitzung in der Ablage', () => {
  it('schreibt und liest den Patch zurück', () => {
    const a = ablageFake();
    expect(sitzungSchreiben(a, abgewandelt())).toBe(true);
    expect(sitzungLesen(a)).toEqual(toShareable(abgewandelt()));
  });

  it('liefert null ohne Eintrag und ohne Ablage', () => {
    expect(sitzungLesen(ablageFake())).toBeNull();
    expect(sitzungLesen(null)).toBeNull();
    expect(sitzungSchreiben(null, abgewandelt())).toBe(false);
  });

  it('ignoriert beschädigtes JSON, ohne es zu löschen', () => {
    const a = ablageFake();
    a.daten.set(SCHLUESSEL_SITZUNG, '{kaputt');
    expect(sitzungLesen(a)).toBeNull();
    expect(a.daten.get(SCHLUESSEL_SITZUNG)).toBe('{kaputt');
  });

  it('prüft gelesene Felder', () => {
    const a = ablageFake();
    a.daten.set(SCHLUESSEL_SITZUNG, '{"ui":{"language":"fr"},"time":{"paused":true}}');
    expect(sitzungLesen(a)).toEqual({ time: { paused: true } });
  });

  it('löscht den Eintrag', () => {
    const a = ablageFake();
    sitzungSchreiben(a, abgewandelt());
    sitzungLoeschen(a);
    expect(a.daten.has(SCHLUESSEL_SITZUNG)).toBe(false);
  });

  it('wirft bei gesperrter oder voller Ablage nicht', () => {
    expect(sitzungLesen(werfend)).toBeNull();
    expect(sitzungSchreiben(werfend, abgewandelt())).toBe(false);
    expect(() => { sitzungLoeschen(werfend); }).not.toThrow();
    expect(sitzungMerkenLesen(werfend)).toBe(true);
    expect(() => { sitzungMerkenSchreiben(werfend, false); }).not.toThrow();
  });
});

describe('Präferenz „Sitzung merken"', () => {
  it('ist ohne Eintrag und ohne Ablage an', () => {
    expect(sitzungMerkenLesen(ablageFake())).toBe(true);
    expect(sitzungMerkenLesen(null)).toBe(true);
  });

  it('aus schreibt „0", an entfernt den Eintrag', () => {
    const a = ablageFake();
    sitzungMerkenSchreiben(a, false);
    expect(a.daten.get(SCHLUESSEL_MERKEN)).toBe('0');
    expect(sitzungMerkenLesen(a)).toBe(false);
    sitzungMerkenSchreiben(a, true);
    expect(a.daten.has(SCHLUESSEL_MERKEN)).toBe(false);
    expect(sitzungMerkenLesen(a)).toBe(true);
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen** — `npx vitest run src/store/persist.test.ts`. Erwartet: alle grün. Scheitert „ansicht … behält die Zeitrate" oder ein Round-Trip, ist `ohnePfad` zu korrigieren, nicht der Test.

- [ ] **Schritt 4: Alles prüfen** — `npm test`, `npm run lint`.

- [ ] **Schritt 5: Commit**

```bash
git add src/store/persist.ts src/store/persist.test.ts
git commit -m "Persistenz: Profile link/sitzung/ansicht, Ablagefunktionen, Link und Zurücksetzen"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 3: Start und Sicherung — `app/persistenz.ts`, Verdrahtung in `main.tsx`

**Dateien:**
- Erstellen: `src/app/persistenz.ts`, `src/app/persistenz.test.ts`
- Ändern: `src/app/main.tsx` (der Block „Startsprache aus dem Browser" am Dateiende, vor `createRoot`)

**Schnittstellen:**
- Konsumiert: `decodePatch`, `fromShareable` aus `store/serialize.ts`; `istPlain`, `Plain` aus `store/pruefer.ts`; `FRAGMENT_PRAEFIX`, `Ablage`, `ablageHolen`, `sitzungLesen`, `sitzungMerkenLesen`, `sitzungSchreiben` aus `store/persist.ts`; `startSprache`, `Sprache` aus `ui/i18n`; `useStore` aus `store/index.ts` (`getState`, `subscribe`, `replaceAll`).
- Produziert (`app/persistenz.ts`): `interface StartUmgebung { hash: string; fragmentEntfernen: () => void; ablage: Ablage | null; navigatorLanguage: string }`; `fragmentLesen(hash: string): string | null`; `startZustand(u: StartUmgebung): AppState`; `interface EreignisZiel { addEventListener(typ: 'pagehide', h: () => void): void; removeEventListener(typ: 'pagehide', h: () => void): void }`; `interface SicherungUmgebung { ablage: Ablage | null; ziel: EreignisZiel; intervallMs?: number }`; `sicherungStarten(store, u: SicherungUmgebung): () => void`.

- [ ] **Schritt 1: `src/app/persistenz.ts` anlegen** (vollständiger Inhalt):

```ts
import type { useStore } from '../store';
import type { AppState } from '../store/types';
import { istPlain } from '../store/pruefer';
import type { Plain } from '../store/pruefer';
import { decodePatch, fromShareable } from '../store/serialize';
import { FRAGMENT_PRAEFIX, sitzungLesen, sitzungMerkenLesen, sitzungSchreiben } from '../store/persist';
import type { Ablage } from '../store/persist';
import { startSprache } from '../ui/i18n';
import type { Sprache } from '../ui/i18n';

export interface StartUmgebung {
  /** location.hash, mit führendem „#". */
  hash: string;
  /** Entfernt das Fragment aus der Adresszeile (history.replaceState). */
  fragmentEntfernen: () => void;
  ablage: Ablage | null;
  navigatorLanguage: string;
}

export function fragmentLesen(hash: string): string | null {
  return hash.startsWith(FRAGMENT_PRAEFIX) ? hash.slice(FRAGMENT_PRAEFIX.length) : null;
}

/** Nur eine im Patch tatsächlich enthaltene Sprache darf den Browser überstimmen. */
function spracheAus(patch: Plain): Sprache | null {
  const ui = patch.ui;
  if (!istPlain(ui)) return null;
  return ui.language === 'en' || ui.language === 'de' ? ui.language : null;
}

/**
 * Startzustand: Fragment vor Sitzung vor Standard (Entwurf §4.1). Ein
 * Fragment wird sofort aus der Adresse entfernt, damit ein späteres Neuladen
 * die gesicherte Sitzung nimmt und nicht immer wieder den alten Link. Die
 * Sitzung zählt nur, wenn „Sitzung merken" an ist.
 */
export function startZustand(u: StartUmgebung): AppState {
  const fragment = fragmentLesen(u.hash);
  let patch: Plain = {};
  if (fragment !== null) {
    patch = decodePatch(fragment);
    u.fragmentEntfernen();
  } else if (sitzungMerkenLesen(u.ablage)) {
    patch = sitzungLesen(u.ablage) ?? {};
  }
  const state = fromShareable(patch);
  state.ui.language = startSprache(u.navigatorLanguage, spracheAus(patch));
  return state;
}

export interface EreignisZiel {
  addEventListener(typ: 'pagehide', h: () => void): void;
  removeEventListener(typ: 'pagehide', h: () => void): void;
}

export interface SicherungUmgebung {
  ablage: Ablage | null;
  ziel: EreignisZiel;
  /** Mindestabstand zweier Schreibvorgänge; Standard 1000 ms. */
  intervallMs?: number;
}

type Store = Pick<typeof useStore, 'getState' | 'subscribe'>;

/**
 * Gedrosselte Sicherung: Die Schleife schreibt time.jd in jedem Bild in den
 * Store, eine Entprellung „eine Sekunde nach der letzten Änderung" käme bei
 * laufender Uhr also nie zum Zug. Stattdessen startet die erste Änderung
 * einen Timer, dessen Ablauf den dann aktuellen Stand schreibt — höchstens
 * einmal je Intervall. pagehide schreibt sofort. Die Präferenz wird bei
 * jedem Schreibversuch neu gelesen, damit der Hook useSitzungMerken keine
 * Verbindung hierher braucht.
 */
export function sicherungStarten(store: Store, u: SicherungUmgebung): () => void {
  const intervall = u.intervallMs ?? 1000;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const schreiben = (): void => {
    timer = null;
    if (u.ablage === null || !sitzungMerkenLesen(u.ablage)) return;
    sitzungSchreiben(u.ablage, store.getState());
  };
  const sofort = (): void => {
    if (timer !== null) clearTimeout(timer);
    schreiben();
  };

  const abbestellen = store.subscribe(() => {
    if (timer === null) timer = setTimeout(schreiben, intervall);
  });
  u.ziel.addEventListener('pagehide', sofort);

  return () => {
    abbestellen();
    u.ziel.removeEventListener('pagehide', sofort);
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
}
```

- [ ] **Schritt 2: Fehlschlagende Tests `src/app/persistenz.test.ts`** (vollständiger Inhalt; Umgebung node, kein DOM nötig):

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStore, DEFAULT_STATE } from '../store';
import { encodePatch } from '../store/serialize';
import { SCHLUESSEL_SITZUNG, SCHLUESSEL_MERKEN } from '../store/persist';
import type { Ablage } from '../store/persist';
import { fragmentLesen, startZustand, sicherungStarten } from './persistenz';
import type { StartUmgebung, EreignisZiel } from './persistenz';

function ablageFake(): Ablage & { daten: Map<string, string> } {
  const daten = new Map<string, string>();
  return {
    daten,
    getItem: (k) => daten.get(k) ?? null,
    setItem: (k, v) => { daten.set(k, v); },
    removeItem: (k) => { daten.delete(k); },
  };
}

const umgebung = (teil: Partial<StartUmgebung> = {}): StartUmgebung => ({
  hash: '',
  fragmentEntfernen: vi.fn(),
  ablage: ablageFake(),
  navigatorLanguage: 'de-DE',
  ...teil,
});

describe('fragmentLesen', () => {
  it('liest nur das p-Fragment', () => {
    expect(fragmentLesen('#p=abc')).toBe('abc');
    expect(fragmentLesen('#x=1')).toBeNull();
    expect(fragmentLesen('')).toBeNull();
  });
});

describe('startZustand', () => {
  it('liefert den Standard ohne Fragment und ohne Sitzung', () => {
    expect(startZustand(umgebung())).toEqual(DEFAULT_STATE);
  });

  it('nimmt das Fragment vor der Sitzung und entfernt es', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    const u = umgebung({ ablage, hash: '#p=' + encodePatch({ scale: { sizeScale: 3 } }) });
    expect(startZustand(u).scale.sizeScale).toBe(3);
    expect(u.fragmentEntfernen).toHaveBeenCalledTimes(1);
  });

  it('nimmt die Sitzung, wenn kein Fragment da ist', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    const u = umgebung({ ablage });
    expect(startZustand(u).scale.sizeScale).toBe(7);
    expect(u.fragmentEntfernen).not.toHaveBeenCalled();
  });

  it('ignoriert die Sitzung, wenn „merken" aus ist', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    ablage.daten.set(SCHLUESSEL_MERKEN, '0');
    expect(startZustand(umgebung({ ablage })).scale.sizeScale).toBe(DEFAULT_STATE.scale.sizeScale);
  });

  it('Sprache: Fragment vor Browser, sonst Browser', () => {
    const mitSprache = '#p=' + encodePatch({ ui: { language: 'en' } });
    const ohneSprache = '#p=' + encodePatch({ time: { paused: true } });
    expect(startZustand(umgebung({ hash: mitSprache, navigatorLanguage: 'de-DE' })).ui.language).toBe('en');
    expect(startZustand(umgebung({ hash: ohneSprache, navigatorLanguage: 'en-US' })).ui.language).toBe('en');
    expect(startZustand(umgebung({ hash: ohneSprache, navigatorLanguage: 'de-DE' })).ui.language).toBe('de');
  });

  it('Sprache aus der Sitzung schlägt den Browser', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ ui: { language: 'en' } }));
    expect(startZustand(umgebung({ ablage, navigatorLanguage: 'de-DE' })).ui.language).toBe('en');
  });

  it('ungültiges Fragment: Standard, Fragment trotzdem entfernt', () => {
    const u = umgebung({ hash: '#p=!!!nicht-base64!!!' });
    expect(startZustand(u)).toEqual(DEFAULT_STATE);
    expect(u.fragmentEntfernen).toHaveBeenCalledTimes(1);
  });
});

describe('sicherungStarten', () => {
  let ablage: ReturnType<typeof ablageFake>;
  let handler: Partial<Record<'pagehide', () => void>>;
  let ziel: EreignisZiel;
  let stop: (() => void) | null = null;

  const gespeichert = (): unknown => {
    const text = ablage.daten.get(SCHLUESSEL_SITZUNG);
    return text === undefined ? undefined : JSON.parse(text);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    ablage = ablageFake();
    handler = {};
    ziel = {
      addEventListener: (typ, h) => { handler[typ] = h; },
      removeEventListener: (typ) => { delete handler[typ]; },
    };
  });

  afterEach(() => {
    stop?.();
    stop = null;
    vi.useRealTimers();
  });

  it('schreibt höchstens einmal je Intervall, und zwar den letzten Stand', () => {
    stop = sicherungStarten(useStore, { ablage, ziel, intervallMs: 1000 });
    useStore.getState().setScale({ sizeScale: 2 });
    vi.advanceTimersByTime(500);
    useStore.getState().setScale({ sizeScale: 3 });
    expect(gespeichert()).toBeUndefined();
    vi.advanceTimersByTime(500);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 3 } });
    // Nächste Änderung: neuer Timer, wieder ein volles Intervall.
    useStore.getState().setScale({ sizeScale: 4 });
    vi.advanceTimersByTime(999);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 3 } });
    vi.advanceTimersByTime(1);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 4 } });
  });

  it('pagehide schreibt sofort', () => {
    stop = sicherungStarten(useStore, { ablage, ziel });
    useStore.getState().setScale({ sizeScale: 5 });
    handler.pagehide?.();
    expect(gespeichert()).toEqual({ scale: { sizeScale: 5 } });
  });

  it('schreibt nicht, wenn „merken" aus ist', () => {
    ablage.daten.set(SCHLUESSEL_MERKEN, '0');
    stop = sicherungStarten(useStore, { ablage, ziel });
    useStore.getState().setScale({ sizeScale: 6 });
    vi.advanceTimersByTime(2000);
    handler.pagehide?.();
    expect(gespeichert()).toBeUndefined();
  });

  it('schreibt ohne Ablage nicht und wirft nicht', () => {
    stop = sicherungStarten(useStore, { ablage: null, ziel });
    useStore.getState().setScale({ sizeScale: 6 });
    expect(() => { vi.advanceTimersByTime(2000); }).not.toThrow();
  });

  it('hört nach dem Abbestellen auf', () => {
    stop = sicherungStarten(useStore, { ablage, ziel });
    stop();
    stop = null;
    expect(handler.pagehide).toBeUndefined();
    useStore.getState().setScale({ sizeScale: 8 });
    vi.advanceTimersByTime(2000);
    expect(gespeichert()).toBeUndefined();
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen** — `npx vitest run src/app/persistenz.test.ts`. Erwartet: alle grün.

- [ ] **Schritt 4: `src/app/main.tsx` verdrahten** — Imports ergänzen:

```ts
import { ablageHolen } from '../store/persist';
import { sicherungStarten, startZustand } from './persistenz';
```

Den Block am Dateiende

```ts
// Startsprache aus dem Browser; ein geteilter Zustand (URL-Fragment, Phase
// 4b) wird hier später als zweiter Parameter eingesetzt.
useStore.getState().setUi({ language: startSprache(navigator.language, null) });
```

ersetzen durch:

```ts
// Startzustand: Fragment vor gesicherter Sitzung vor Standard, Sprache aus
// dem Zustand oder vom Browser (app/persistenz.ts). Danach läuft die
// gedrosselte Sicherung bis zum Schließen der Seite.
const ablage = ablageHolen();
useStore.getState().replaceAll(startZustand({
  hash: window.location.hash,
  fragmentEntfernen: () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  },
  ablage,
  navigatorLanguage: navigator.language,
}));
sicherungStarten(useStore, { ablage, ziel: window });
```

Den Import `startSprache` aus `'../ui/i18n'` entfernen (`t` bleibt). Der Rückgabewert von `sicherungStarten` wird bewusst nicht aufgehoben: Die Sicherung lebt so lange wie die Seite.

- [ ] **Schritt 5: Sichtkontrolle im Browser** — `curl`-Prüfung, dann `browser_navigate` auf `http://localhost:5173/Orrery/`, `browser_console_messages`: keine Fehler. `browser_evaluate`: `window.store.getState().setScale({ sizeScale: 9 })`, dann `await new Promise(r => setTimeout(r, 1500)); localStorage.getItem('orrery.sitzung.v1')` → enthält `"sizeScale":9`. Neu laden, `window.store.getState().scale.sizeScale` → `9`. Danach `localStorage.removeItem('orrery.sitzung.v1')` und neu laden, damit der nächste Task sauber startet.

- [ ] **Schritt 6: Alles prüfen** — `npm test`, `npm run lint`.

- [ ] **Schritt 7: Commit**

```bash
git add src/app/persistenz.ts src/app/persistenz.test.ts src/app/main.tsx
git commit -m "Persistenz: Startzustand aus Fragment oder Sitzung, gedrosselte Sicherung"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 4: Kopfzeile — „Link kopieren", „Zurücksetzen", Statusmeldung

**Dateien:**
- Ändern: `src/ui/Kopfzeile.tsx`, `src/ui/Kopfzeile.test.tsx`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`

**Schnittstellen:**
- Konsumiert: `linkErzeugen`, `zurueckgesetzt` aus `store/persist.ts`; `useStore` (`getState`, `replaceAll`, `setUi`); `t` aus `ui/i18n`.
- Produziert: vier Sprachschlüssel `header.copyLink`, `header.copied`, `header.copyFallback`, `header.reset`; in der Kopfzeile ein Element mit `role="status"`.

- [ ] **Schritt 1: Sprachschlüssel** — in `de.ts` ans Ende des Objekts (vor `} as const;`):

```ts
  'header.copyLink': 'Link kopieren',
  'header.copied': 'Kopiert',
  'header.copyFallback': 'Adresse in der Adresszeile kopieren',
  'header.reset': 'Zurücksetzen',
```

In `en.ts` an derselben Stelle:

```ts
  'header.copyLink': 'Copy link',
  'header.copied': 'Copied',
  'header.copyFallback': 'Copy the address from the address bar',
  'header.reset': 'Reset',
```

- [ ] **Schritt 2: Fehlschlagende Tests** — `src/ui/Kopfzeile.test.tsx` um Imports und einen zweiten `describe`-Block ergänzen. Imports oben:

```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { decodeState } from '../store/serialize';
```

Neuer Block am Dateiende:

```tsx
describe('Kopfzeile: Link kopieren und Zurücksetzen', () => {
  beforeEach(() => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
    setSprache('de');
  });

  const mitZwischenablage = (): ReturnType<typeof vi.fn> => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    return writeText;
  };

  it('kopiert den Link, meldet „Kopiert" und lässt die Adresszeile sauber', async () => {
    const writeText = mitZwischenablage();
    useStore.getState().setScale({ sizeScale: 3 });
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Kopiert'); });
    expect(writeText).toHaveBeenCalledTimes(1);
    const link = writeText.mock.calls[0]?.[0] as string;
    expect(link.startsWith(`${window.location.origin}/#p=`)).toBe(true);
    expect(decodeState(link.slice(link.indexOf('#p=') + 3)).scale.sizeScale).toBe(3);
    expect(window.location.hash).toBe('');
  });

  it('lässt Qualitätsstufe und Bedienzustand nicht in den Link', async () => {
    const writeText = mitZwischenablage();
    useStore.setState({ quality: { tier: 'high' } });
    useStore.getState().setUi({ hidden: true });
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(writeText).toHaveBeenCalledTimes(1); });
    const link = writeText.mock.calls[0]?.[0] as string;
    const zurueck = decodeState(link.slice(link.indexOf('#p=') + 3));
    expect(zurueck.quality.tier).toBe('auto');
    expect(zurueck.ui.hidden).toBe(false);
  });

  it('fällt ohne Zwischenablage auf die Adresszeile zurück', async () => {
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Adresse in der Adresszeile kopieren');
    });
    expect(window.location.hash.startsWith('#p=')).toBe(true);
  });

  it('blendet die Meldung nach zwei Sekunden aus', async () => {
    mitZwischenablage();
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Kopiert'); });
    await waitFor(
      () => { expect(screen.getByRole('status').textContent).toBe(''); },
      { timeout: 3000 },
    );
  });

  it('setzt zurück und behält Sprache und Qualitätsstufe', () => {
    useStore.setState({ quality: { tier: 'high' } });
    useStore.getState().setUi({ language: 'en' });
    useStore.getState().setScale({ sizeScale: 3 });
    useStore.getState().toggleVisible('mars');
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Zurücksetzen' }));
    const s = useStore.getState();
    expect(s.scale.sizeScale).toBe(DEFAULT_STATE.scale.sizeScale);
    expect(s.visible).toEqual({});
    expect(s.ui.language).toBe('en');
    expect(s.quality.tier).toBe('high');
  });
});
```

Hinweis: `t()` liest die Modulvariable, nicht den Store; ohne `useSprache` bleiben die Beschriftungen in diesem Test deutsch, auch wenn `ui.language` auf `'en'` steht. Das ist gewollt.

- [ ] **Schritt 3: Tests laufen lassen** — `npx vitest run src/ui/Kopfzeile.test.tsx`. Erwartet: die neuen Fälle scheitern („Unable to find role button … Link kopieren"), die beiden alten bleiben grün.

- [ ] **Schritt 4: `src/ui/Kopfzeile.tsx` umbauen** (vollständiger Inhalt):

```tsx
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { linkErzeugen, zurueckgesetzt } from '../store/persist';
import { t } from './i18n';
import type { Sprache } from './i18n';

/**
 * „DE"/„EN" sind Sprachcodes, keine übersetzbaren Texte — sie stehen bewusst
 * als Literale und nicht in den Sprachdateien (Ausnahme von der
 * Literalregel).
 */
const SPRACHEN: readonly (readonly [Sprache, string, string])[] = [
  ['de', 'DE', 'language.de'],
  ['en', 'EN', 'language.en'],
];

/** So lange steht die Rückmeldung nach dem Kopieren. */
const MELDUNG_MS = 2000;

const KNOPF = 'rounded border border-transparent px-2 py-0.5 opacity-70 hover:opacity-100';

/**
 * Schmale Leiste über der Panel-Spalte: „Link kopieren", „Zurücksetzen",
 * eine kurzlebige Statusmeldung und der Sprachschalter. Die weiteren
 * Schaltflächen aus dem Gesamtentwurf (UI aus, Vollbild, Kino, Hilfe)
 * bekommen später hier ihren Platz.
 */
export function Kopfzeile(): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const setUi = useStore((s) => s.setUi);
  const replaceAll = useStore((s) => s.replaceAll);
  const [meldung, setMeldung] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ein laufender Timer darf den Komponentenwechsel nicht überleben.
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  const melde = (schluessel: string): void => {
    setMeldung(schluessel);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMeldung(null);
      timer.current = null;
    }, MELDUNG_MS);
  };

  const linkKopieren = async (): Promise<void> => {
    const link = linkErzeugen(useStore.getState(), window.location);
    try {
      // Ohne sicheren Kontext fehlt navigator.clipboard ganz; der Zugriff
      // wirft dann synchron und landet ebenfalls im Rückfall.
      await navigator.clipboard.writeText(link);
      melde('header.copied');
    } catch {
      // Rückfall: Fragment in die Adresszeile, der nächste Start verbraucht es.
      window.history.replaceState(null, '', link);
      melde('header.copyFallback');
    }
  };

  const zuruecksetzen = (): void => {
    replaceAll(zurueckgesetzt(useStore.getState()));
  };

  return (
    <header className="pointer-events-auto flex flex-wrap items-center justify-end gap-1 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1 text-xs text-slate-100 backdrop-blur-md">
      <button type="button" className={KNOPF} onClick={() => { void linkKopieren(); }}>
        {t('header.copyLink')}
      </button>
      <button type="button" className={KNOPF} onClick={zuruecksetzen}>
        {t('header.reset')}
      </button>
      {/* Immer im Baum, damit die Live-Region beim ersten Text schon existiert. */}
      <span role="status" aria-live="polite" className="text-slate-300">
        {meldung === null ? '' : t(meldung)}
      </span>
      <div role="group" aria-label={t('language.switch')} className="flex gap-1">
        {SPRACHEN.map(([code, kurz, schluessel]) => {
          const aktiv = code === language;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={aktiv}
              aria-label={`${t(schluessel)} (${kurz})`}
              onClick={() => { setUi({ language: code }); }}
              className={`rounded border px-2 py-0.5 font-semibold ${
                aktiv
                  ? 'border-sky-300/60 bg-sky-400/20'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {kurz}
            </button>
          );
        })}
      </div>
    </header>
  );
}
```

- [ ] **Schritt 5: Tests laufen lassen** — `npx vitest run src/ui/Kopfzeile.test.tsx src/ui/i18n`. Erwartet: alle grün (auch der Schlüsselgleichheitstest).

- [ ] **Schritt 6: Sichtkontrolle im Browser** — `browser_navigate`, `window.store.setState({ quality: { tier: 'high' } })`, Snapshot: Kopfzeile zeigt „Link kopieren", „Zurücksetzen", „DE", „EN". Klick auf „Link kopieren": Status zeigt „Kopiert" oder den Rückfalltext; beides ist in Ordnung, das Protokoll (Task 6) hält fest, welcher Weg lief. Klick auf „Zurücksetzen" nach einer Maßstabsänderung: Maßstab wieder Schaubild.

- [ ] **Schritt 7: Alles prüfen** — `npm test`, `npm run lint`.

- [ ] **Schritt 8: Commit**

```bash
git add src/ui/Kopfzeile.tsx src/ui/Kopfzeile.test.tsx src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Kopfzeile: Link kopieren mit Rückfall über die Adresszeile, Zurücksetzen, Statusmeldung"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 5: Checkbox „Sitzung merken" — Hook `useSitzungMerken`, Darstellungspanel

**Dateien:**
- Erstellen: `src/ui/useSitzungMerken.ts`, `src/ui/panels/DisplayPanel.test.tsx`
- Ändern: `src/ui/panels/DisplayPanel.tsx`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`

**Schnittstellen:**
- Konsumiert: `ablageHolen`, `sitzungLoeschen`, `sitzungMerkenLesen`, `sitzungMerkenSchreiben`, `Ablage`, `SCHLUESSEL_MERKEN`, `SCHLUESSEL_SITZUNG` aus `store/persist.ts`.
- Produziert: `useSitzungMerken(ablage?: Ablage | null): [boolean, (an: boolean) => void]`; Sprachschlüssel `display.rememberSession`.

- [ ] **Schritt 1: Sprachschlüssel** — `de.ts`: `'display.rememberSession': 'Sitzung merken',` direkt nach `'display.lightCompensation'`; `en.ts` an derselben Stelle: `'display.rememberSession': 'Remember session',`.

- [ ] **Schritt 2: Fehlschlagende Tests `src/ui/panels/DisplayPanel.test.tsx`** (vollständiger Inhalt):

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DisplayPanel } from './DisplayPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCHLUESSEL_MERKEN, SCHLUESSEL_SITZUNG } from '../../store/persist';

describe('DisplayPanel: Sitzung merken', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  });

  const kasten = (): HTMLInputElement =>
    screen.getByRole('checkbox', { name: 'Sitzung merken' }) as HTMLInputElement;

  it('ist ohne Eintrag angehakt', () => {
    render(<DisplayPanel />);
    expect(kasten().checked).toBe(true);
  });

  it('Ausschalten schreibt die Präferenz und löscht die gesicherte Sitzung', () => {
    localStorage.setItem(SCHLUESSEL_SITZUNG, '{"time":{"paused":true}}');
    render(<DisplayPanel />);
    fireEvent.click(kasten());
    expect(kasten().checked).toBe(false);
    expect(localStorage.getItem(SCHLUESSEL_MERKEN)).toBe('0');
    expect(localStorage.getItem(SCHLUESSEL_SITZUNG)).toBeNull();
  });

  it('Einschalten entfernt die Präferenz', () => {
    localStorage.setItem(SCHLUESSEL_MERKEN, '0');
    render(<DisplayPanel />);
    expect(kasten().checked).toBe(false);
    fireEvent.click(kasten());
    expect(kasten().checked).toBe(true);
    expect(localStorage.getItem(SCHLUESSEL_MERKEN)).toBeNull();
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen** — `npx vitest run src/ui/panels/DisplayPanel.test.tsx`. Erwartet: alle drei scheitern („Unable to find … checkbox … Sitzung merken").

- [ ] **Schritt 4: `src/ui/useSitzungMerken.ts` anlegen** (vollständiger Inhalt):

```ts
import { useCallback, useState } from 'react';
import { ablageHolen, sitzungLoeschen, sitzungMerkenLesen, sitzungMerkenSchreiben } from '../store/persist';
import type { Ablage } from '../store/persist';

/**
 * Die Präferenz „Sitzung merken" lebt bewusst nicht im Store: Sie darf weder
 * im Link noch in der Sitzung selbst mitreisen. app/persistenz.ts liest sie
 * bei jedem Schreibversuch direkt aus der Ablage, darum braucht dieser Hook
 * keine Verbindung dorthin. Ausschalten löscht die gesicherte Sitzung sofort.
 */
export function useSitzungMerken(ablage: Ablage | null = ablageHolen()): [boolean, (an: boolean) => void] {
  const [an, setAn] = useState(() => sitzungMerkenLesen(ablage));
  const setzen = useCallback((neu: boolean) => {
    setAn(neu);
    sitzungMerkenSchreiben(ablage, neu);
    if (!neu) sitzungLoeschen(ablage);
  }, [ablage]);
  return [an, setzen];
}
```

- [ ] **Schritt 5: `src/ui/panels/DisplayPanel.tsx` ergänzen** — Import `import { useSitzungMerken } from '../useSitzungMerken';` und in der Komponente nach den `useId`-Aufrufen `const [merken, setMerken] = useSitzungMerken();`. Als letztes Kind des `flex flex-col gap-1`-Containers, nach dem Distanzausgleich-Regler:

```tsx
        <label className="mt-1 flex items-center gap-2 border-t border-white/10 pt-2">
          <input
            type="checkbox"
            checked={merken}
            onChange={(e) => { setMerken(e.target.checked); }}
          />
          <span>{t('display.rememberSession')}</span>
        </label>
```

- [ ] **Schritt 6: Tests laufen lassen** — `npx vitest run src/ui/panels/DisplayPanel.test.tsx src/ui/i18n`. Erwartet: alle grün.

- [ ] **Schritt 7: Sichtkontrolle im Browser** — `browser_navigate`, `window.store.setState({ quality: { tier: 'high' } })`, Snapshot: Darstellungspanel endet mit der Checkbox „Sitzung merken" (angehakt). Abhaken, `browser_evaluate`: `localStorage.getItem('orrery.sitzungMerken')` → `'0'`, `localStorage.getItem('orrery.sitzung.v1')` → `null`. Wieder anhaken, beides erneut: `null` und (nach 1,5 s) ein JSON-Text.

- [ ] **Schritt 8: Alles prüfen** — `npm test`, `npm run lint`.

- [ ] **Schritt 9: Commit**

```bash
git add src/ui/useSitzungMerken.ts src/ui/panels/DisplayPanel.tsx src/ui/panels/DisplayPanel.test.tsx src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Darstellungspanel: Checkbox Sitzung merken, Präferenz außerhalb des Stores"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 6: Abnahme im Browser und Protokoll

**Dateien:**
- Erstellen: `docs/phase4b-etappe1-abnahme.md`
- Schreiben nur nach `.playwright-mcp/` (Screenshot, nicht committen)

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 5; `window.store` im DEV-Build.
- Produziert: Protokoll mit wörtlichen Abfragewerten und einem Screenshot-Pfad (Bild selbst nicht im Repo).

Warten im Browser immer per `browser_evaluate` mit `await new Promise((r) => setTimeout(r, 1500))`, nicht mit `browser_wait_for`. Nach jedem `browser_navigate` sofort `window.store.setState({ quality: { tier: 'high' } })`.

- [ ] **Schritt 1: Server und Stand** — `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`; `git status --short` leer; `git log --oneline -1` notieren.

- [ ] **Schritt 2: Sitzungswiederherstellung** — `browser_navigate` auf `http://localhost:5173/Orrery/`, dann `browser_evaluate`:

```js
localStorage.clear();
const s = window.store.getState();
s.setScale({ sizeScale: 7, preset: null });
s.setUi({ language: 'en' });
s.toggleVisible('mars');
s.setCamera({ targetId: 'saturn', mode: 'attached' });
await new Promise((r) => setTimeout(r, 1500));
localStorage.getItem('orrery.sitzung.v1');
```

Erwartet: JSON mit `"sizeScale":7`, `"language":"en"`, `"mars":false`, `"targetId":"saturn"`. Dann erneut `browser_navigate` auf dieselbe Adresse und abfragen:

```js
(({ scale, ui, visible, camera }) => ({ sizeScale: scale.sizeScale, preset: scale.preset, language: ui.language, mars: visible.mars, targetId: camera.targetId, mode: camera.mode, hash: location.hash }))(window.store.getState())
```

Erwartet: `{ sizeScale: 7, preset: null, language: 'en', mars: false, targetId: 'saturn', mode: 'attached', hash: '' }`. Werte wörtlich ins Protokoll.

- [ ] **Schritt 3: Link kopieren und im neuen Tab öffnen** — Im selben Tab `window.store.setState({ quality: { tier: 'low' } })`. Zwischenablage-Berechtigung per `browser_run_code_unsafe`: `await context.grantPermissions(['clipboard-read', 'clipboard-write'])`. Klick auf „Copy link" (Oberfläche ist englisch) per `browser_click` aus dem Snapshot. `browser_evaluate`: `document.querySelector('header [role=status]').textContent` → `'Copied'` (oder `'Copy the address from the address bar'`; dann steht der Link in `location.href`, ins Protokoll schreiben, welcher Weg lief). Link holen: `await navigator.clipboard.readText()` bzw. `location.href`. Neuen Tab per `browser_tabs` (`new`), `browser_navigate` auf den Link, Qualität auf `high`, dann dieselbe Abfrage wie in Schritt 2 plus `tier: window.store.getState().quality.tier`. Erwartet: Ansichtswerte wie in Schritt 2, `hash: ''`, `tier` ist **nicht** `'low'`. Der Link selbst (gekürzt auf die ersten 60 Zeichen) ins Protokoll.

- [ ] **Schritt 4: „Sitzung merken" aus** — Im ersten Tab: Checkbox „Remember session" per `browser_click` abhaken, `browser_evaluate`: `localStorage.getItem('orrery.sitzung.v1')` → `null`. Dann `window.store.getState().setScale({ sizeScale: 9 })`, 1,5 s warten, erneut `localStorage.getItem('orrery.sitzung.v1')` → `null`. Neu laden: `sizeScale` → `50`, `language` → `'de'` (Browsersprache des Prüfrechners). Checkbox wieder anhaken.

- [ ] **Schritt 5: Zurücksetzen** — `browser_evaluate`: `const s = window.store.getState(); s.setUi({ language: 'en' }); s.setScale({ sizeScale: 3, preset: null }); window.store.setState({ quality: { tier: 'high' } });`. Klick auf „Reset". Abfrage: `(({ scale, ui, quality }) => ({ sizeScale: scale.sizeScale, preset: scale.preset, language: ui.language, tier: quality.tier }))(window.store.getState())` → `{ sizeScale: 50, preset: 'schaubild', language: 'en', tier: 'high' }`.

- [ ] **Schritt 6: Kopfzeile bei 400 px** — `browser_resize` auf 400 × 800, `browser_take_screenshot` nach `.playwright-mcp/kopfzeile-400.png`. `browser_evaluate`:

```js
[...document.querySelectorAll('header button')].map((b) => { const r = b.getBoundingClientRect(); return { text: b.textContent.trim(), left: Math.round(r.left), right: Math.round(r.right), innerWidth }; })
```

Erwartet: jede Kante `left >= 0` und `right <= innerWidth`, vier Einträge. Danach `browser_resize` zurück auf 1280 × 800.

- [ ] **Schritt 7: Konsole** — `browser_console_messages` nach dem gesamten Lauf: 0 Fehler, 0 Warnungen (Meldungen wörtlich ins Protokoll, falls vorhanden).

- [ ] **Schritt 8: Lint, Test, Build** — `npm run lint`, `npm test`, `npm run build`; jeweils die Schlusszeilen ins Protokoll.

- [ ] **Schritt 9: Protokoll `docs/phase4b-etappe1-abnahme.md`** — Abschnitte: Aufbau (Datum, Commit, Browser, Bildschirm), Ergebnis Schritt 2 bis 7 mit den wörtlichen Abfragewerten, Screenshot-Pfad, Konsole, Lint/Test/Build. Bekannte Unschärfe vermerken: Ein laufender Maßstabs-Übergang (700 ms) kann nach „Zurücksetzen" noch nachschreiben. Das Kriterium des Gesamtentwurfs „URL-Sharing stellt den Zustand exakt wieder her (durch Round-Trip-Test abgesichert)" zitieren und bewerten; das Kriterium zu Presets bleibt für Etappe 2 offen.

- [ ] **Schritt 10: Commit**

```bash
git add docs/phase4b-etappe1-abnahme.md
git commit -m "Abnahme 4b Etappe 1: URL-Sharing, Sitzung, Zurücksetzen"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Abschluss

- [ ] `npm run lint`, `npm test`, `npm run build` auf dem Branch, Ausgabe zeigen.
- [ ] `README.md`, Absatz zum Stand (Zeile 38 ff.): 4b als „Etappe 1 (URL-Sharing, Sitzung) abgeschlossen, Etappe 2 (Ansichten) offen" ergänzen. Die lokale Projektanleitung im Abschnitt „Stand" nachziehen.
- [ ] Fast-Forward nach `master`, Branch `persistenz` löschen, `.playwright-mcp/` leeren. Tag: keiner (Phase 4 wird erst nach 4c getaggt).

## Rulings

- 2026-09-14 — `linkErzeugen` und `zurueckgesetzt` liegen in `store/persist.ts`, nicht in `app/persistenz.ts` wie im Entwurf §4.3/§4.4 skizziert: `ui/` darf nichts aus `app/` importieren. Der Entwurf beschreibt das Verhalten, die Schicht folgt der Regel.
- 2026-09-14 — Die Sicherung drosselt (höchstens ein Schreibvorgang je Sekunde, geschrieben wird der Stand beim Ablauf) statt zu entprellen: `app/loop.ts` schreibt `time.jd` in jedem Bild, eine Entprellung käme bei laufender Uhr nie zum Zug.
- 2026-09-14 — Der Prüfer steht in `store/pruefer.ts` mit eigenem Test (`pruefer.test.ts`), nicht in `persist.ts` wie im Entwurf §7 gelistet: `serialize.ts` braucht ihn, `persist.ts` braucht `serialize.ts`; so gibt es keinen Import-Kreis.
- 2026-09-14 — `toShareable` überspringt Funktionswerte, weil `useStore.getState()` die Aktionen enthält und in Kopfzeile und Sicherung direkt übergeben wird.
