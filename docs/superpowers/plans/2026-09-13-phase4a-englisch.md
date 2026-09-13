# Phase 4a — Englisch und Sprachumschaltung: Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Vollständige englische Oberfläche mit Umschaltung zur Laufzeit (Kopfzeile „DE | EN", Taste `L`), Startsprache aus dem Browser, Locale-abhängige Zahlen- und Datumsformate.

**Architektur:** `t()` bleibt eine synchrone Funktion und liest eine Modulvariable, die `setSprache` setzt. Ein Hook `useSprache` in `App` koppelt sie an `ui.language` im Store und zeichnet den React-Baum neu. Die 3D-Beschriftungen bekommen einen Namensauflöser als Parameter statt eines Imports aus `ui/` und beschriften bei Sprachwechsel neu. `DEFAULT_STATE.ui.language` bleibt `'de'`, damit Englisch im geteilten Zustand eine Abweichung ist.

**Tech-Stack:** TypeScript, React 19, Zustand, Vitest (jsdom, Testing Library), Vite, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-13-phase4a-englisch-design.md` — der Plan argumentiert aus dem Entwurf, Umsetzer lesen beides.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Tests, Bezeichner-Kommentare). Umlaute korrekt. Nur die Werte in `en.ts` sind Englisch.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungs-URL, keine Werkzeugnamen. Nach jedem Commit prüfen: `git log --format=%B -1 | grep -ci 'co-authored\|session'` muss 0 ergeben.
- Branch `englisch` (von `master`), **kein Worktree**: der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten mit einseitiger Abhängigkeit: `ui/` → `store/` → `render/` → `sim/`; `data/` reine Daten, `app/` Einstieg (darf alles kennen). **Kein Import aus `ui/` in `render/`.**
- Kein Literal mit sichtbarem Text außerhalb von `ui/i18n/de.ts` und `ui/i18n/en.ts`.
- `en.ts` hat exakt die Schlüssel von `de.ts` (Typ `Record<Key, string>` erzwingt es beim Typcheck, ein Test zur Laufzeit).
- Locale: Deutsch `de-DE`, Englisch `en-GB`.
- Vor „fertig" je Task: `npm test`, `npm run lint`; am Ende `npm run build`.
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

---

### Task 1: Sprachdaten — `Sprache`, `en.ts`, `setSprache`, `locale`, `startSprache`

**Dateien:**
- Ändern: `src/ui/i18n/index.ts`, `src/ui/i18n/de.ts` (neue Schlüssel), `src/store/types.ts:57`
- Erstellen: `src/ui/i18n/en.ts`
- Test: `src/ui/i18n/i18n.test.ts`

**Schnittstellen:**
- Konsumiert: `de` aus `./de`.
- Produziert (aus `src/ui/i18n/index.ts`): `type Sprache = 'de' | 'en'`; `type Key`; `t(key: string): string`; `setSprache(s: Sprache): void`; `sprache(): Sprache`; `locale(): 'de-DE' | 'en-GB'`; `startSprache(navigatorLanguage: string, ausFragment: Sprache | null): Sprache`; `export { de, en }`. Spätere Tasks verlassen sich auf genau diese Namen.

- [ ] **Schritt 1: Neue Schlüssel in `de.ts` ergänzen** (ans Ende des Objekts):

```ts
  'language.de': 'Deutsch',
  'language.en': 'English',
  'language.switch': 'Sprache',
  'shortcuts.language': 'Sprache umschalten',
  'key.home': 'Pos1',
  'key.space': 'Leertaste',
  'key.arrows': '◀ ▶',
  'unit.millionKm': 'Mio. km',
```

- [ ] **Schritt 2: Fehlschlagende Tests schreiben** — `src/ui/i18n/i18n.test.ts` komplett ersetzen:

```ts
import { describe, it, expect, afterEach } from 'vitest';
import { de } from './de';
import { en } from './en';
import { t, setSprache, sprache, locale, startSprache } from './index';
import { bodies } from '../../data/index';

/** Werte, die auf Englisch bewusst gleich lauten: Eigennamen und Symbole. */
const GLEICH_ERLAUBT = new Set<string>([
  'app.title', 'language.de', 'language.en', 'key.arrows',
  'body.venus.name', 'body.mars.name', 'body.jupiter.name', 'body.saturn.name',
  'body.uranus.name', 'body.phobos.name', 'body.deimos.name', 'body.io.name',
  'body.europa.name', 'body.mimas.name', 'body.enceladus.name', 'body.tethys.name',
  'body.dione.name', 'body.rhea.name', 'body.titan.name', 'body.iapetus.name',
  'body.miranda.name', 'body.ariel.name', 'body.umbriel.name', 'body.titania.name',
  'body.oberon.name', 'body.triton.name', 'body.pluto.name', 'body.charon.name',
  'body.ceres.name', 'body.eris.name', 'body.haumea.name', 'body.makemake.name',
]);

describe('Sprachressourcen', () => {
  afterEach(() => { setSprache('de'); });

  it('hat für jeden Körper einen Namensschlüssel', () => {
    for (const body of bodies) {
      expect(de, `fehlt: ${body.info.nameKey}`).toHaveProperty(body.info.nameKey);
    }
  });

  it('liefert zu bekannten Schlüsseln den Text', () => {
    expect(t('body.earth.name')).toBe('Erde');
  });

  it('meldet unbekannte Schlüssel erkennbar, statt leer zu bleiben', () => {
    expect(t('gibt.es.nicht')).toContain('gibt.es.nicht');
  });

  it('enthält keine leeren Texte', () => {
    for (const [key, wert] of Object.entries(de)) {
      expect(wert.length, `leer (de): ${key}`).toBeGreaterThan(0);
    }
    for (const [key, wert] of Object.entries(en)) {
      expect(wert.length, `leer (en): ${key}`).toBeGreaterThan(0);
    }
  });

  it('Englisch hat exakt die Schlüssel von Deutsch', () => {
    const deKeys = Object.keys(de).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(deKeys);
  });

  it('Englisch ist übersetzt, nicht kopiert (außer Eigennamen)', () => {
    for (const key of Object.keys(de) as (keyof typeof de)[]) {
      if (GLEICH_ERLAUBT.has(key)) continue;
      expect(en[key], `nicht übersetzt: ${key}`).not.toBe(de[key]);
    }
  });

  it('schaltet die Sprache um', () => {
    setSprache('en');
    expect(sprache()).toBe('en');
    expect(t('body.earth.name')).toBe('Earth');
    expect(t('body.moon.name')).toBe('Moon');
    expect(locale()).toBe('en-GB');
    setSprache('de');
    expect(t('body.earth.name')).toBe('Erde');
    expect(locale()).toBe('de-DE');
  });
});

describe('startSprache', () => {
  it('nimmt Englisch für englische Browser', () => {
    expect(startSprache('en-US', null)).toBe('en');
    expect(startSprache('en', null)).toBe('en');
    expect(startSprache('EN-gb', null)).toBe('en');
  });

  it('nimmt sonst Deutsch', () => {
    expect(startSprache('de-DE', null)).toBe('de');
    expect(startSprache('fr', null)).toBe('de');
    expect(startSprache('', null)).toBe('de');
  });

  it('lässt einen geteilten Zustand gewinnen', () => {
    expect(startSprache('en-US', 'de')).toBe('de');
    expect(startSprache('de-DE', 'en')).toBe('en');
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen, Fehlschlag prüfen**

`npx vitest run src/ui/i18n/i18n.test.ts` — erwartet: FAIL (Modul `./en` fehlt, `setSprache` nicht exportiert).

- [ ] **Schritt 4: `src/ui/i18n/index.ts` ersetzen**

```ts
import { de } from './de';
import { en } from './en';

export type Key = keyof typeof de;
export type Sprache = 'de' | 'en';

const tabellen: Record<Sprache, Record<Key, string>> = { de, en };

/**
 * Die aktuelle Sprache lebt als Modulvariable, nicht im React-Baum: So
 * bleibt t() synchron und überall aufrufbar (Formatierung, Overlay-Labels
 * über einen Auflöser aus app/). Wer die Sprache ändert, ist der Store
 * (ui.language); der Hook useSprache spiegelt sie hierher.
 */
let aktuell: Sprache = 'de';

export function setSprache(s: Sprache): void { aktuell = s; }
export function sprache(): Sprache { return aktuell; }

/** Locale für Intl: Deutsch de-DE, Englisch en-GB (Tag vor Monat, 24 h). */
export function locale(): 'de-DE' | 'en-GB' {
  return aktuell === 'en' ? 'en-GB' : 'de-DE';
}

/** Unbekannte Schlüssel fallen sichtbar auf, statt still zu verschwinden. */
export function t(key: string): string {
  return (tabellen[aktuell] as Record<string, string>)[key] ?? `[${key}]`;
}

/**
 * Startsprache: Ein geteilter Zustand (URL-Fragment, ab Phase 4b) gewinnt;
 * sonst entscheidet der Browser. DEFAULT_STATE bleibt 'de', damit Englisch
 * im geteilten Zustand eine Abweichung vom Standard ist und mitreist.
 */
export function startSprache(navigatorLanguage: string, ausFragment: Sprache | null): Sprache {
  if (ausFragment !== null) return ausFragment;
  return navigatorLanguage.toLowerCase().startsWith('en') ? 'en' : 'de';
}

export { de, en };
```

- [ ] **Schritt 5: `src/ui/i18n/en.ts` anlegen**

```ts
import type { Key } from './index';

/**
 * Englische Texte. Exakt die Schlüssel von de.ts — der Typ erzwingt es beim
 * Typcheck, i18n.test.ts zur Laufzeit. Eigennamen bleiben unverändert.
 */
export const en: Record<Key, string> = {
  'app.title': 'Orrery',
  // …
};
```

Alle Schlüssel aus `de.ts` übersetzen, **in derselben Reihenfolge** wie dort, mit dieser festen Terminologie:

| Deutsch | Englisch |
|---|---|
| Kino-Modus / Kino starten / Kino beenden | Cinema mode / Start cinema / Stop cinema |
| Kinofahrt | Cinema ride |
| Zeit / Pause / Fortsetzen / Richtung umkehren / Jetzt / Zu Datum springen | Time / Pause / Resume / Reverse direction / Now / Jump to date |
| Geschwindigkeit / Datum | Speed / Date |
| Sekunde/s, Sekunden/s, Stunde/s, Stunden/s, Tag/s, Tage/s, Jahr/s, Jahre/s | second/s, seconds/s, hour/s, hours/s, day/s, days/s, year/s, years/s |
| Maßstab / Körpergröße / Bahnabstände / Sonne dämpfen | Scale / Body size / Orbit spacing / Damp the Sun |
| Realistisch / Schaubild / Kompakt | Realistic / Diagram / Compact |
| Kamera / Frei / Geheftet / Verfolgung / Abstand | Camera / Free / Attached / Follow / Distance |
| Draufsicht / Seitenansicht / Von der Sonne / Zur Sonne | Top view / Side view / From the Sun / Towards the Sun |
| Darstellung / Bahnlinien / Beschriftungen / Marker / Gürtel / Schatten / Leuchten / Helligkeit / Lichtabfall / Nachtseite / Distanzausgleich | Display / Orbit lines / Labels / Markers / Belts / Shadows / Glow / Brightness / Light falloff / Night side / Distance compensation |
| Himmelskörper / anzeigen / Kamera auf diesen Körper richten / aufklappen / einklappen | Bodies / show / Point camera at this body / expand / collapse |
| Tastenkürzel / Bedienoberfläche ein- und ausblenden / Vollbild / Zeit anhalten und fortsetzen / Zeitraffung verringern und erhöhen / Laufrichtung umkehren / Kamera zurücksetzen / Diese Übersicht ein- und ausblenden / Kino-Modus starten und beenden / Nächste Szene / Sprache umschalten | Keyboard shortcuts / Show or hide the interface / Fullscreen / Pause and resume time / Slow down and speed up time / Reverse direction / Reset camera / Show or hide this overview / Start and stop cinema mode / Next scene / Switch language |
| Oberfläche ausblenden | Hide interface |
| Zufallskeim / Szenen mischen / Bei Eingabe anhalten / Aktuelle Szene | Random seed / Shuffle scenes / Pause on input / Current scene |
| Sprache / Pos1 / Leertaste / Mio. km | Language / Home / Space / million km |
| Sonne, Merkur, Erde, Mond, Neptun, Ganymed, Kallisto | Sun, Mercury, Earth, Moon, Neptune, Ganymede, Callisto |

Szenentitel (`scene.*`) sinngemäß übersetzen, z. B. „Sonnenaufgang über dem Erdrand" → „Sunrise over the limb of the Earth", „Der Tanz des Mondes" → „The dance of the Moon", „Das galileische Schattenspiel" → „The Galilean shadow play", „Saturns Ringe von der Kante" → „Saturn's rings edge-on", „Tritons rückläufige Bahn" → „Triton's retrograde orbit". Alle übrigen Schlüssel (`body.*.name` für Eigennamen, `language.*`) laut Tabelle bzw. unverändert.

- [ ] **Schritt 6: Store-Typ**

`src/store/types.ts` Zeile 57: `language: 'de'` → `language: 'de' | 'en'` als Literal-Union direkt in `types.ts`, **kein** Import aus `ui/` (Schichtregel: `store/` kennt `ui/` nicht). JSDoc am Feld: „Muss mit `Sprache` in ui/i18n/index.ts übereinstimmen; i18n.test.ts prüft die Tabellen."

- [ ] **Schritt 7: Tests laufen lassen**

`npx vitest run src/ui/i18n/i18n.test.ts src/data/scenes.test.ts` — erwartet: alle grün. Dann `npx tsc -b` (Schlüsselgleichheit), `npm test`, `npm run lint`.

- [ ] **Schritt 8: Commit**

```bash
git add src/ui/i18n/index.ts src/ui/i18n/de.ts src/ui/i18n/en.ts src/ui/i18n/i18n.test.ts src/store/types.ts
git commit -m "Englisch: Sprachtabelle en.ts, setSprache/locale/startSprache, Sprache im Store-Typ"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 2: Formatierung — `formatZahl`, Locale-abhängiges `formatJd`, Einheit „Mio. km"

**Dateien:**
- Ändern: `src/ui/format.ts`, `src/ui/panels/CameraPanel.tsx:29-30`, `src/ui/panels/DisplayPanel.tsx:17`, `src/ui/panels/ScalePanel.tsx:25-26`
- Test: `src/ui/format.test.ts`

**Schnittstellen:**
- Konsumiert: `locale()`, `setSprache()`, `t()` aus `../i18n` (Task 1); Schlüssel `unit.millionKm`.
- Produziert: `formatZahl(n: number, maxStellen = 2): string` aus `src/ui/format.ts`.

- [ ] **Schritt 1: Fehlschlagende Tests** — in `src/ui/format.test.ts` ergänzen (bestehende Tests bleiben):

```ts
import { setSprache } from './i18n';
import { formatZahl } from './format';
import { J2000 } from '../sim/time';

describe('Formatierung je Sprache', () => {
  afterEach(() => { setSprache('de'); });

  it('formatiert Zahlen mit der Locale der Sprache', () => {
    expect(formatZahl(1234.5)).toBe('1.234,5');
    setSprache('en');
    expect(formatZahl(1234.5)).toBe('1,234.5');
    expect(formatZahl(0.123456, 3)).toBe('0.123');
  });

  it('formatiert das Datum mit Tag vor Monat in beiden Sprachen', () => {
    // J2000 = 1. Januar 2000, 12:00 UTC
    expect(formatJd(J2000)).toMatch(/^01\.01\.2000, 12:00$/);
    setSprache('en');
    expect(formatJd(J2000)).toMatch(/^01\/01\/2000, 12:00$/);
  });

  it('übersetzt die Zeitraffer-Einheit', () => {
    setSprache('en');
    expect(formatRate(2.5)).toBe('2.5 days/s');
    expect(formatRate(1)).toBe('1 day/s');
  });
});
```

(`afterEach`, `describe`, `it`, `expect`, `formatJd`, `formatRate` sind in der Datei bereits importiert bzw. aus `vitest` nachzuimportieren.)

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run src/ui/format.test.ts` → FAIL (`formatZahl` fehlt).

- [ ] **Schritt 3: `src/ui/format.ts` umbauen**

```ts
import { jdToDate, dateToJd } from '../sim/time';
import { t, locale } from './i18n';

/** Ein Formatierer je Locale, beim ersten Gebrauch gebaut. */
const datumsformate = new Map<string, Intl.DateTimeFormat>();

function datumsformat(): Intl.DateTimeFormat {
  const l = locale();
  let f = datumsformate.get(l);
  if (f === undefined) {
    f = new Intl.DateTimeFormat(l, {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    });
    datumsformate.set(l, f);
  }
  return f;
}

export const formatJd = (jd: number): string => datumsformat().format(jdToDate(jd));

/** Zahl in der Locale der aktuellen Sprache, gerundet auf maxStellen. */
export const formatZahl = (n: number, maxStellen = 2): string =>
  n.toLocaleString(locale(), { maximumFractionDigits: maxStellen });
```

In `formatRate` die lokale `zahl`-Funktion entfernen und `formatZahl(wert)` verwenden. Rest unverändert.

- [ ] **Schritt 4: Panels**

- `CameraPanel.tsx`: `abstandText` → `` `${formatZahl(km / 1e6)} ${t('unit.millionKm')}` `` (Import `formatZahl` aus `../format`).
- `DisplayPanel.tsx`: lokale `zahl` löschen, Aufrufe durch `formatZahl` ersetzen.
- `ScalePanel.tsx`: lokale `zahl` löschen, Aufrufe durch `formatZahl(n, stellen)` ersetzen.
- Danach: `grep -rn "de-DE" src --include=*.ts --include=*.tsx | grep -v test` muss nur noch `src/ui/i18n/index.ts` treffen.

- [ ] **Schritt 5: Tests, Lint, Commit**

`npx vitest run src/ui` → grün; `npm test`; `npm run lint`.

```bash
git add src/ui/format.ts src/ui/format.test.ts src/ui/panels/CameraPanel.tsx src/ui/panels/DisplayPanel.tsx src/ui/panels/ScalePanel.tsx
git commit -m "Englisch: Zahlen und Datum je Locale (formatZahl, formatJd), Einheit Mio. km als Sprachschlüssel"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 3: Reaktivität — `useSprache`, `App`, Startsprache in `main.tsx`

**Dateien:**
- Erstellen: `src/ui/i18n/useSprache.ts`, `src/ui/i18n/useSprache.test.tsx`
- Ändern: `src/ui/App.tsx`, `src/app/main.tsx`

**Schnittstellen:**
- Konsumiert: `setSprache`, `sprache`, `t`, `startSprache` (Task 1); `useStore`.
- Produziert: `useSprache(): Sprache` aus `src/ui/i18n/useSprache.ts`.

- [ ] **Schritt 1: Fehlschlagender Test** — `src/ui/i18n/useSprache.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useSprache } from './useSprache';
import { t, setSprache } from './index';
import { useStore, DEFAULT_STATE } from '../../store';

function Probe(): React.JSX.Element {
  useSprache();
  return <p>{t('panel.time')}</p>;
}

describe('useSprache', () => {
  beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
  afterEach(() => { setSprache('de'); });

  it('zeichnet mit der Sprache aus dem Store und setzt lang und title', () => {
    render(<Probe />);
    expect(screen.getByText('Zeit')).toBeTruthy();
    expect(document.documentElement.lang).toBe('de');

    act(() => { useStore.getState().setUi({ language: 'en' }); });
    expect(screen.getByText('Time')).toBeTruthy();
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe(t('app.title'));
  });
});
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run src/ui/i18n/useSprache.test.tsx` → FAIL (Modul fehlt).

- [ ] **Schritt 3: `src/ui/i18n/useSprache.ts`**

```ts
import { useEffect } from 'react';
import { useStore } from '../../store';
import { setSprache, sprache, t } from './index';
import type { Sprache } from './index';

/**
 * Koppelt die Modulvariable von t() an ui.language. setSprache läuft
 * synchron während des Renderns: Ein Effekt käme einen Durchlauf zu spät,
 * und alle Kinder von App lesen t() im selben Durchlauf. Weil App der
 * einzige Aufrufer ist und alle Panels seine Kinder sind, zeichnet ein
 * Sprachwechsel den gesamten Baum neu.
 */
export function useSprache(): Sprache {
  const language = useStore((s) => s.ui.language);
  if (sprache() !== language) setSprache(language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('app.title');
  }, [language]);

  return language;
}
```

- [ ] **Schritt 4: `App.tsx`** — `useSprache()` als **ersten** Hook in `App` aufrufen (vor `useShortcuts()`), Import aus `./i18n/useSprache`. Der Rückgabewert wird nicht gebraucht; Kommentar: „Muss vor allem anderen stehen, damit t() in diesem Durchlauf schon die neue Tabelle sieht."

- [ ] **Schritt 5: `main.tsx`** — vor `createRoot(...)`:

```ts
// Startsprache aus dem Browser; ein geteilter Zustand (URL-Fragment, Phase
// 4b) wird hier später als zweiter Parameter eingesetzt.
useStore.getState().setUi({ language: startSprache(navigator.language, null) });
```

mit `import { startSprache } from '../ui/i18n';`.

- [ ] **Schritt 6: Tests, Lint, Commit**

`npx vitest run src/ui` → grün; `npm test`; `npm run lint`.

```bash
git add src/ui/i18n/useSprache.ts src/ui/i18n/useSprache.test.tsx src/ui/App.tsx src/app/main.tsx
git commit -m "Englisch: useSprache koppelt t() an den Store, Startsprache aus dem Browser"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 4: 3D-Beschriftungen — Namensauflöser statt `ui`-Import, Neubeschriftung bei Sprachwechsel

**Dateien:**
- Ändern: `src/render/labels.ts` (Import Zeile 3, `createLabelOverlay`, `LabelOverlay.update`), `src/render/scene.ts:40,54,149`, `src/app/main.tsx:48`
- Test: `src/render/labels.test.ts`, neu `src/render/schichten.test.ts`

**Schnittstellen:**
- Konsumiert: `t` nur noch in `app/main.tsx`.
- Produziert: `createLabelOverlay(container: HTMLElement, name: (key: string) => string): LabelOverlay`; `LabelOverlay.update(eintraege, camera, zeigeLabels, zeigeMarker, sprache: string)`; `buildScene(ctx, overlay, name: (key: string) => string)`.

- [ ] **Schritt 1: Fehlschlagende Tests**

In `src/render/labels.test.ts` die Hilfsfunktion `baueOverlay` auf die neue Signatur bringen: `createLabelOverlay(container, (key) => namen[key] ?? key)` mit einer Testtabelle `let namen: Record<string, string>` im `describe`; alle bestehenden `overlay.update(..., zeigeLabels, zeigeMarker)`-Aufrufe erhalten als fünften Parameter `'de'`. Neuer Test im selben `describe`:

```ts
  it('beschriftet vorhandene Einträge neu, wenn sich die Sprache ändert', () => {
    namen = { 'body.moon.name': 'Mond' };
    const { overlay, container } = baueOverlay();
    const kamera = testKamera();
    const eintraege = [koerper('moon', 'body.moon.name', false, 10, 20)];
    overlay.update(eintraege, kamera, true, true, 'de');
    expect(wrapperVon(container, 'Mond')).toBeDefined();

    namen = { 'body.moon.name': 'Moon' };
    // Gleiche Sprache: kein Neubeschriften, der Auflöser wird nicht befragt.
    overlay.update(eintraege, kamera, true, true, 'de');
    expect(wrapperVon(container, 'Mond')).toBeDefined();

    overlay.update(eintraege, kamera, true, true, 'en');
    expect(wrapperVon(container, 'Moon')).toBeDefined();
    expect(wrapperVon(container, 'Mond')).toBeUndefined();
  });
```

Neue Datei `src/render/schichten.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** render/ darf ui/ nicht kennen (Entwurf 4a, §4.3; Schichtregel der Projektanleitung). */
describe('Schichtung', () => {
  it('render/ importiert nichts aus ui/', () => {
    const ordner = join(__dirname);
    const verstoesse: string[] = [];
    for (const datei of readdirSync(ordner)) {
      if (!datei.endsWith('.ts') || datei.endsWith('.test.ts')) continue;
      const text = readFileSync(join(ordner, datei), 'utf8');
      if (/from\s+['"]\.\.\/ui\//.test(text)) verstoesse.push(datei);
    }
    expect(verstoesse).toEqual([]);
  });
});
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run src/render/labels.test.ts src/render/schichten.test.ts` → FAIL (Signatur, Verstoß `labels.ts`).

- [ ] **Schritt 3: `labels.ts`**

- Zeile 3 (`import { t } from '../ui/i18n';`) löschen.
- `LabelOverlay.update` bekommt den fünften Parameter `sprache: string` (JSDoc: „Kennung der Sprache, in der die Namen gerade gelten; ändert sie sich, werden alle vorhandenen Einträge über den Auflöser neu beschriftet").
- `createLabelOverlay(container, name)`: `text.textContent = name(eintrag.nameKey);` statt `t(...)`. Im Knoten zusätzlich `nameKey` merken (`knoten` wird `Map<string, { wrapper; glyphe; text; nameKey: string }>`). Am Anfang von `update`:

```ts
      if (sprache !== beschriftetIn) {
        beschriftetIn = sprache;
        for (const k of knoten.values()) k.text.textContent = name(k.nameKey);
      }
```

mit `let beschriftetIn: string | null = null;` neben `knoten`. Erster Aufruf beschriftet nichts um (Knoten sind leer oder bereits richtig), weil `hole` neue Einträge ohnehin über `name` beschriftet.

- [ ] **Schritt 4: `scene.ts` und `main.tsx`**

- `buildScene(ctx, overlay, name: (key: string) => string)`; `createLabelOverlay(overlay, name)`; `labels.update(eintraege, ctx.camera, state.display.labels, state.display.markers, state.ui.language)`.
- `main.tsx`: `buildScene(ctx, overlay, (key) => t(key))` mit `import { t, startSprache } from '../ui/i18n';`.
- Prüfen, ob `scene.test.ts` `buildScene` aufruft; wenn ja, dritten Parameter `(k) => k` ergänzen.

- [ ] **Schritt 5: Tests, Lint, Commit**

`npx vitest run src/render` → grün; `npm test`; `npm run lint`.

```bash
git add src/render/labels.ts src/render/labels.test.ts src/render/schichten.test.ts src/render/scene.ts src/app/main.tsx
git commit -m "Englisch: 3D-Beschriftungen über Namensauflöser, Neubeschriftung bei Sprachwechsel, render ohne ui-Import"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 5: Kopfzeile „DE | EN", Taste `L`, Tastennamen als Sprachschlüssel

**Dateien:**
- Erstellen: `src/ui/Kopfzeile.tsx`, `src/ui/Kopfzeile.test.tsx`
- Ändern: `src/ui/App.tsx` (Kopfzeile einhängen, `KUERZEL`), `src/ui/shortcuts/useShortcuts.ts` (`case 'l'`), `src/ui/shortcuts/useShortcuts.test.ts`

**Schnittstellen:**
- Konsumiert: `t`, `useStore`, Schlüssel `language.*`, `shortcuts.language`, `key.*` (Task 1).
- Produziert: `Kopfzeile(): React.JSX.Element`.

- [ ] **Schritt 1: Fehlschlagende Tests**

`src/ui/Kopfzeile.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Kopfzeile } from './Kopfzeile';
import { setSprache } from './i18n';
import { useStore, DEFAULT_STATE } from '../store';

describe('Kopfzeile', () => {
  beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
  afterEach(() => { setSprache('de'); });

  it('zeigt die aktive Sprache als gedrückt', () => {
    render(<Kopfzeile />);
    expect(screen.getByRole('button', { name: 'Deutsch' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'English' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('setzt die Sprache im Store', () => {
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(useStore.getState().ui.language).toBe('en');
  });
});
```

In `useShortcuts.test.ts` ergänzen:

```ts
  it('schaltet die Sprache mit L um', () => {
    handleShortcut('l');
    expect(useStore.getState().ui.language).toBe('en');
    handleShortcut('l');
    expect(useStore.getState().ui.language).toBe('de');
  });
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run src/ui/Kopfzeile.test.tsx src/ui/shortcuts/useShortcuts.test.ts` → FAIL.

- [ ] **Schritt 3: `src/ui/Kopfzeile.tsx`**

```tsx
import { useStore } from '../store';
import { t } from './i18n';
import type { Sprache } from './i18n';

const SPRACHEN: readonly (readonly [Sprache, string, string])[] = [
  ['de', 'DE', 'language.de'],
  ['en', 'EN', 'language.en'],
];

/**
 * Schmale Leiste über der Panel-Spalte. Heute nur der Sprachschalter; die
 * vier Schaltflächen aus dem Gesamtentwurf (UI aus, Vollbild, Kino, Hilfe)
 * bekommen später hier ihren Platz.
 */
export function Kopfzeile(): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const setUi = useStore((s) => s.setUi);

  return (
    <header className="pointer-events-auto flex items-center justify-end gap-1 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1 text-xs text-slate-100 backdrop-blur-md">
      <div role="group" aria-label={t('language.switch')} className="flex gap-1">
        {SPRACHEN.map(([code, kurz, schluessel]) => {
          const aktiv = code === language;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={aktiv}
              aria-label={t(schluessel)}
              onClick={() => { setUi({ language: code }); }}
              className={`rounded px-2 py-0.5 font-semibold ${aktiv ? 'bg-sky-500/40 text-white' : 'opacity-70 hover:opacity-100'}`}
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

(Die Akzentklasse an die vorhandene Akzentfarbe der Panels angleichen: in `TimePanel.tsx`/`ScalePanel.tsx` nachsehen, welche `bg-…`-Klasse aktive Schaltflächen tragen, und dieselbe verwenden.)

- [ ] **Schritt 4: `App.tsx`**

- `<Kopfzeile />` als erstes Kind der Spalte (`<div className="flex w-72 …">`), vor `<TimePanel />`.
- `KUERZEL`: Einträge werden `readonly [taste: string | { key: string }, wirkung: string]`; `['H', …]` bleibt Literal, `['␣', 'shortcuts.pause']` → `[{ key: 'key.space' }, 'shortcuts.pause']`, `['◀ ▶', …]` → `[{ key: 'key.arrows' }, …]`, `['Pos1', …]` → `[{ key: 'key.home' }, …]`, neu `['L', 'shortcuts.language']` vor `['?', …]`. In `Kuerzeluebersicht`: `const label = typeof taste === 'string' ? taste : t(taste.key);`, `key={schluessel}` statt `key={taste}`.

- [ ] **Schritt 5: `useShortcuts.ts`**

```ts
    case 'l':
      s.setUi({ language: s.ui.language === 'de' ? 'en' : 'de' });
      return true;
```

- [ ] **Schritt 6: Tests, Lint, Commit**

`npx vitest run src/ui` → grün; `npm test`; `npm run lint`.

```bash
git add src/ui/Kopfzeile.tsx src/ui/Kopfzeile.test.tsx src/ui/App.tsx src/ui/shortcuts/useShortcuts.ts src/ui/shortcuts/useShortcuts.test.ts
git commit -m "Englisch: Kopfzeile mit Sprachschalter DE | EN, Taste L, Tastennamen als Sprachschlüssel"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Task 6: Abnahme im Browser und Protokoll

**Dateien:**
- Erstellen: `docs/phase4a-englisch-abnahme.md`
- Schreiben nur nach `.playwright-mcp/` (Screenshots, nicht committen)

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 5; `window.store` im DEV-Build.
- Produziert: Protokoll mit DOM-Nachweisen und zwei Screenshots (Pfade im Protokoll, Bilder selbst nicht im Repo).

- [ ] **Schritt 1: Server prüfen** — `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`; `git status --short` leer.

- [ ] **Schritt 2: Deutsch** — `browser_navigate` auf `http://localhost:5173/Orrery/`, sofort `window.store.setState({ quality: { tier: 'high' } })`, 3 s warten. Per `browser_evaluate` festhalten:

```js
({
  lang: document.documentElement.lang, title: document.title,
  sprache: window.store.getState().ui.language,
  panelTitel: [...document.querySelectorAll('section button')].map(b => b.textContent.trim()),
  label: [...document.querySelectorAll('.koerper-name')].map(e => e.textContent),
  kopfzeile: document.querySelector('header')?.textContent,
})
```

Screenshot `.playwright-mcp/a-de.png`.

- [ ] **Schritt 3: Umschalten zur Laufzeit** — Klick auf die Schaltfläche „EN" per `browser_click` (aus dem Snapshot), **ohne Neuladen**, 1 s warten, dieselbe Abfrage wie in Schritt 2. Erwartet: `lang` = `en`, `sprache` = `en`, Panel-Titel englisch („Time", „Scale", „Cinema mode", „Camera", „Display", „Bodies"), 3D-Labels englisch (u. a. „Sun", „Earth", „Moon" statt „Sonne", „Erde", „Mond"; welche Labels sichtbar sind, hängt von der Ansicht ab, mindestens „Sun" und „Earth"). Zusätzlich das Datum im Zeitpanel ablesen (`input`- oder Textwert) und prüfen: Trennzeichen `/`. Screenshot `.playwright-mcp/a-en.png`. Dann Taste `L` per `browser_press_key` → zurück auf Deutsch (Abfrage), erneut `L` → Englisch.

- [ ] **Schritt 4: Startsprache aus dem Browser** — Der Playwright-MCP erlaubt keine Browser-Locale je Navigation, und ein per `browser_evaluate` überschriebenes `navigator.language` überlebt keinen Reload. Die Logik ist deshalb durch den Unit-Test `startSprache` aus Task 1 nachgewiesen. Im Browser wird nur die Verdrahtung geprüft: Nach einem frischen `browser_navigate` liefert `browser_evaluate` mit `[navigator.language, window.store.getState().ui.language]` auf dem deutsch eingestellten Prüfrechner `['de-DE', 'de']` (oder eine andere `de-…`-Kennung mit `'de'`). Beides ins Protokoll.

- [ ] **Schritt 5: Konsole** — `browser_console_messages` nach dem gesamten Lauf: 0 Fehler, 0 Warnungen (Meldungen wörtlich ins Protokoll, falls vorhanden).

- [ ] **Schritt 6: Protokoll `docs/phase4a-englisch-abnahme.md`** — Abschnitte: Aufbau (Datum, Commit, Browser), Ergebnis Schritt 2 bis 5 mit den wörtlichen Abfragewerten, Screenshot-Pfade, Konsole, Lint/Test/Build-Ausgabe (`npm run lint`, `npm test`, `npm run build` — jeweils die Schlusszeilen). Kriterium des Gesamtentwurfs zitieren und als erfüllt/nicht erfüllt bewerten.

- [ ] **Schritt 7: Commit**

```bash
git add docs/phase4a-englisch-abnahme.md
git commit -m "Abnahme Phase 4a: Englisch und Sprachumschaltung zur Laufzeit"
git log --format=%B -1 | grep -ci 'co-authored\|session'   # muss 0 sein
```

---

### Abschluss

- [ ] `npm run lint`, `npm test`, `npm run build` auf dem Branch, Ausgabe zeigen.
- [ ] `README.md`: im Abschnitt zum Stand „Phase 4 (Komfort: Presets, URL-Sharing, Englisch, Infopanel)" → Englisch als erledigt markieren (ein Halbsatz). die lokale Projektanleitung im Abschnitt „Stand" nachziehen.
- [ ] Fast-Forward nach `master`, Branch `englisch` löschen, `.playwright-mcp/` leeren. Tag: keiner (Phase 4 wird erst nach 4c getaggt).

## Rulings

- 2026-09-13 — Bedienung und Locale: Browsersprache automatisch, Kopfzeile „DE | EN" mit Taste `L`, `en-GB`, Ansatz A (Jens).
- 2026-09-13 — `Sprache` im Store-Typ als Literal-Union statt Typimport aus `ui/` (Schichtregel, siehe Task 1 Schritt 6).
