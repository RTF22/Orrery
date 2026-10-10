# Doku-Seiten: Farbschema und Vorlesen — Umsetzungsplan

> **Für ausführende Agenten:** Pflicht-Skill: superpowers:subagent-driven-development (empfohlen) oder
> superpowers:executing-plans, Task für Task. Schritte mit Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Die Making-of-Seiten folgen der Hell-/Dunkel-Vorgabe des Systems, haben einen Schalter Automatisch → Hell →
Dunkel mit gespeicherter Wahl und lassen sich mit lokalen Browserstimmen vorlesen; danach erhält die Ereignisseite auf
`finsternisse` dasselbe.

**Architektur:** Zwei neue, reine Module liefern HTML-, CSS- und Skript-Bausteine als Zeichenketten:
`scripts/doku-farbschema.ts` (Paletten, Farbvariablen, Kopfskript, Knopf, Knopfskript) und `scripts/doku-vorlesen.ts`
(Satzzerlegung, Knopf, Bedienleiste, Vorleseskript, CSS). `scripts/doku-vorlage.ts` setzt sie nur noch ein — so bleiben
die Konflikte bei der Übernahme nach `finsternisse` klein. Browser-Code ist ES5 wie das vorhandene Navigationsskript und
läuft inline. Verhalten wird in Vitest mit `jsdom` (Paket ist vorhanden) an der vollständig erzeugten Seite geprüft.

**Technik:** TypeScript (Node mit Type-Stripping, daher `import type` für reine Typen, keine `enum`), Vitest, jsdom,
Web Speech API (`speechSynthesis`), CSS-Variablen, `prefers-color-scheme`.

**Entwurf:** `docs/superpowers/specs/2026-10-10-doku-farbschema-vorlesen-design.md` (von Jens freigegeben).

**Ledger:** `.superpowers/sdd/2026-10-10-doku-farbschema/progress.md` (git-ignoriert). Rulings dort als „Ruling:“-Zeile.

## Globale Vorgaben

- Branch `doku-farbschema` (von `master`, Entwurf bereits als 82487b9 committet). Tasks 1–5 dort, danach Fast-Forward
  nach `master` durch den Controller; Task 6 auf `finsternisse`.
- Alles auf Deutsch (Kommentare, Commit-Texte, Protokoll), Umlaute korrekt. Englische Seitentexte in amerikanischer
  Schreibweise („Color“, wie im übrigen Projekt).
- Commits allein unter Jens Fricke, ohne Trailer; Wort- und Trailerprüfung laut lokaler Projektanleitung vor jedem
  Commit. Commit-Texte mit Anführungszeichen per `git commit -F`.
- localStorage-Schlüssel genau `orrery.doku.farbschema.v1`, Werte genau `hell` oder `dunkel`; Automatisch = Schlüssel
  fehlt.
- Helle Palette genau: `--bg #f8fafc`, `--text #0f172a`, `--text-gedaempft #475569`, `--akzent #0369a1`,
  `--akzent-stark #0284c7`, `--rand rgba(15, 23, 42, 0.14)`. Dunkle Palette unverändert.
- Nur Stimmen mit `localService === true` und passendem Sprachpräfix (`de`/`en`); nie Online-Stimmen.
- Tempo-Stufen genau 0,8 / 1 / 1,25; Tempo wird nicht gespeichert.
- Keine Anfragen an fremde Server, keine weiteren Speicher-Schlüssel.
- Kopfzeile bleibt am Desktop höchstens 60 px hoch (`kopfHoehe = 60` im Navigationsskript, `top: 60px` der Navigation).
- Jede Task-Prüfung: `npx vitest run <betroffene Testdateien>`, `npx tsc -b --noEmit`, `npm run lint`; am Ende von
  Task 5 und 6 zusätzlich `npm test` und `npm run build`.
- Kein Deploy, kein Push. Deploy erst, wenn das Domains-Projekt die Datenschutzerklärung nachgezogen hat (Entwurf §2).

## Review-Fokus

Eingaben und Zustände, die der Entwurf nahelegt, aber kein Kernfall abdeckt — je mit Test im zuständigen Task:

1. Ungültiger oder fremder Wert im Speicher (etwa `blau`) oder gesperrter Speicher → wie Automatisch, kein Fehler,
   Schalter funktioniert für die aktuelle Seite (Task 2).
2. Stimmen werden erst nach `voiceschanged` gemeldet oder gar nicht, oder nur als Online-Stimmen → Knopf bleibt
   verborgen bzw. erscheint später; kein Fehler (Task 4).
3. Seite wird verlassen oder in den Zurück-Cache gelegt (`pagehide`) während des Vorlesens → Sprachausgabe abgebrochen,
   Leiste und Markierung weg (Task 4).
4. Escape bei offener Navigationsschublade am Handy → nur die Schublade schließt, Vorlesen läuft weiter (Task 4).
5. Verschachtelte Listen, Absätze nur mit Bild, Tabellen → kein Text doppelt, nichts Leeres, Tabelleninhalt nie
   gesprochen (Task 4).

---

### Task 1: Paletten und Farbschema nach Systemvorgabe

**Dateien:**
- Neu: `scripts/doku-farbschema.ts`, `scripts/doku-farbschema.test.ts`
- Ändern: `scripts/doku-vorlage.ts` (Import, `theme-color`-Zeile im Kopf von `seite()`, Anfang von `DOKU_CSS`,
  Dateikopf- und `DOKU_CSS`-Kommentar), `scripts/doku-vorlage.test.ts`

**Schnittstellen:**
- Liefert: `interface Palette { bg; text; textGedaempft; akzent; akzentStark; rand: string }`,
  `PALETTE_DUNKEL`, `PALETTE_HELL`, `FARBSCHEMA_CSS: string`, `farbschemaKopf(): string`.

- [ ] **Schritt 1: Fehlschlagende Tests schreiben** — `scripts/doku-farbschema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FARBSCHEMA_CSS, PALETTE_DUNKEL, PALETTE_HELL, farbschemaKopf } from './doku-farbschema.ts';

/** Relative Leuchtdichte nach WCAG 2.x für `#rrggbb`. */
function leuchtdichte(hex: string): number {
  const kanal = (i: number): number => {
    const c = parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * kanal(0) + 0.7152 * kanal(1) + 0.0722 * kanal(2);
}
function kontrast(a: string, b: string): number {
  const [hell, dunkel] = [leuchtdichte(a), leuchtdichte(b)].sort((x, y) => y - x);
  return (hell + 0.05) / (dunkel + 0.05);
}
/** Mischt `vorn` mit Anteil `anteil` über `hinten` (wie `color-mix(in srgb, …)`). */
function mischen(vorn: string, hinten: string, anteil: number): string {
  const kanal = (hex: string, i: number): number => parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);
  return (
    '#' +
    [0, 1, 2]
      .map((i) => Math.round(kanal(vorn, i) * anteil + kanal(hinten, i) * (1 - anteil)).toString(16).padStart(2, '0'))
      .join('')
  );
}

describe('Paletten', () => {
  for (const [name, p] of [['dunkel', PALETTE_DUNKEL], ['hell', PALETTE_HELL]] as const) {
    it(`${name}: Text, gedämpfter Text und Akzent erreichen WCAG AA auf dem Grund`, () => {
      expect(kontrast(p.text, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(kontrast(p.textGedaempft, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(kontrast(p.akzent, p.bg)).toBeGreaterThanOrEqual(4.5);
      // nur Fokusrahmen: Nicht-Text-Kontrast 3:1
      expect(kontrast(p.akzentStark, p.bg)).toBeGreaterThanOrEqual(3);
    });
    it(`${name}: Text bleibt auf der Vorlese-Markierung (Akzent zu 12 % über dem Grund) lesbar`, () => {
      const markierung = mischen(p.akzent, p.bg, 0.12);
      for (const farbe of [p.text, p.textGedaempft, p.akzent]) {
        expect(kontrast(farbe, markierung)).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
  it('helle Palette hat die Werte aus dem Entwurf', () => {
    expect(PALETTE_HELL).toEqual({
      bg: '#f8fafc', text: '#0f172a', textGedaempft: '#475569',
      akzent: '#0369a1', akzentStark: '#0284c7', rand: 'rgba(15, 23, 42, 0.14)',
    });
  });
  it('dunkle Palette bleibt unverändert', () => {
    expect(PALETTE_DUNKEL).toEqual({
      bg: '#0f172a', text: '#f1f5f9', textGedaempft: '#cbd5e1',
      akzent: '#7dd3fc', akzentStark: '#38bdf8', rand: 'rgba(255, 255, 255, 0.14)',
    });
  });
});

describe('FARBSCHEMA_CSS', () => {
  it('dunkel als Grundlage, hell nach Systemvorgabe und nach eigener Wahl', () => {
    expect(FARBSCHEMA_CSS).toMatch(/^:root \{[^}]*--bg: #0f172a;[^}]*color-scheme: dark;/);
    expect(FARBSCHEMA_CSS).toMatch(
      /@media \(prefers-color-scheme: light\) \{\s*:root:not\(\[data-theme="dark"\]\) \{[^}]*--bg: #f8fafc;[^}]*color-scheme: light;/,
    );
    expect(FARBSCHEMA_CSS).toMatch(/:root\[data-theme="light"\] \{[^}]*--bg: #f8fafc;[^}]*color-scheme: light;/);
  });
});

describe('farbschemaKopf', () => {
  it('nennt theme-color je Systemschema', () => {
    const kopf = farbschemaKopf();
    expect(kopf).toContain('<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)">');
    expect(kopf).toContain('<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)">');
  });
});
```

In `scripts/doku-vorlage.test.ts` den Import um `DOKU_CSS` erweitern, dazu
`import { FARBSCHEMA_CSS } from './doku-farbschema.ts';`, und im `describe('seite')` ergänzen:

```ts
  it('bindet das Farbschema ein: theme-color je Schema, Farbvariablen am Anfang des Stylesheets', () => {
    expect(h).toContain('media="(prefers-color-scheme: light)"');
    expect(h).not.toContain('<meta name="theme-color" content="#0f172a">');
    expect(DOKU_CSS.startsWith(FARBSCHEMA_CSS)).toBe(true);
  });
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run scripts/doku-farbschema.test.ts scripts/doku-vorlage.test.ts`;
  erwartet: Modul `./doku-farbschema.ts` nicht gefunden.

- [ ] **Schritt 3: Umsetzen** — `scripts/doku-farbschema.ts`:

```ts
/**
 * Farbschema der Doku-Seiten (Entwurf 2026-10-10 §3): beide Paletten, die Farbvariablen
 * am Anfang von `DOKU_CSS` und die `theme-color`-Angaben im Kopf. Dunkel ist die
 * Grundlage (Herkunft der Werte im Dateikopf von doku-vorlage.ts); hell gilt nach
 * Systemvorgabe (`prefers-color-scheme: light`) oder nach eigener Wahl (`data-theme`
 * am `<html>`, gesetzt vom Schalter).
 */

export interface Palette {
  bg: string;
  text: string;
  textGedaempft: string;
  akzent: string;
  akzentStark: string;
  rand: string;
}

export const PALETTE_DUNKEL: Palette = {
  bg: '#0f172a',
  text: '#f1f5f9',
  textGedaempft: '#cbd5e1',
  akzent: '#7dd3fc',
  akzentStark: '#38bdf8',
  rand: 'rgba(255, 255, 255, 0.14)',
};

/** Tailwind-Standardpalette (slate/sky), Kontraste in doku-farbschema.test.ts. */
export const PALETTE_HELL: Palette = {
  bg: '#f8fafc',
  text: '#0f172a',
  textGedaempft: '#475569',
  akzent: '#0369a1',
  akzentStark: '#0284c7',
  rand: 'rgba(15, 23, 42, 0.14)',
};

function variablen(p: Palette, schema: 'dark' | 'light', einzug: string): string {
  return [
    `--bg: ${p.bg};`,
    `--text: ${p.text};`,
    `--text-gedaempft: ${p.textGedaempft};`,
    `--akzent: ${p.akzent};`,
    `--akzent-stark: ${p.akzentStark};`,
    `--rand: ${p.rand};`,
    `color-scheme: ${schema};`,
  ]
    .map((zeile) => einzug + zeile)
    .join('\n');
}

export const FARBSCHEMA_CSS = `:root {
${variablen(PALETTE_DUNKEL, 'dark', '  ')}
}
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
${variablen(PALETTE_HELL, 'light', '    ')}
  }
}
:root[data-theme="light"] {
${variablen(PALETTE_HELL, 'light', '  ')}
}
`;

/** `theme-color` je Systemschema; bei eigener Wahl passt das Schalterskript beide an. */
export function farbschemaKopf(): string {
  return `<meta name="theme-color" content="${PALETTE_DUNKEL.bg}" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="${PALETTE_HELL.bg}" media="(prefers-color-scheme: light)">`;
}
```

In `scripts/doku-vorlage.ts`:
- Import ergänzen: `import { FARBSCHEMA_CSS, farbschemaKopf } from './doku-farbschema.ts';`
- In `seite()` die Zeile `<meta name="theme-color" content="#0f172a">` durch `${farbschemaKopf()}` ersetzen (sie steht
  vor `<link rel="icon" …>` und `<link rel="stylesheet" …>` und bleibt dort).
- `DOKU_CSS` beginnt heute mit dem Block `:root { --bg: #0f172a; … color-scheme: dark; }`. Diesen Block durch
  `${FARBSCHEMA_CSS}` ersetzen; danach geht es mit `* { box-sizing: border-box; }` unverändert weiter.
- Kommentar über `DOKU_CSS` ergänzen: „Farbvariablen und helle Palette in doku-farbschema.ts.“ Im Dateikopf hinter dem
  Absatz „Farben: …“ einen Satz: „Die helle Palette (Entwurf 2026-10-10) steht in doku-farbschema.ts.“

- [ ] **Schritt 4: Tests grün** — `npx vitest run scripts/doku-farbschema.test.ts scripts/doku-vorlage.test.ts
  scripts/doku-bauen.test.ts`, dann `npx tsc -b --noEmit` und `npm run lint`.

- [ ] **Schritt 5: Commit**

```bash
git add scripts/doku-farbschema.ts scripts/doku-farbschema.test.ts scripts/doku-vorlage.ts scripts/doku-vorlage.test.ts
git commit -m "Doku-Seiten: helle Palette nach Systemvorgabe"
```

### Task 2: Schalter Automatisch → Hell → Dunkel

**Dateien:**
- Ändern: `scripts/doku-farbschema.ts`, `scripts/doku-farbschema.test.ts`, `scripts/doku-vorlage.ts` (Kopfzeile,
  Skript vor `</body>`, CSS der Kopfknöpfe), `scripts/doku-vorlage.test.ts`

**Schnittstellen:**
- Verwendet: `PALETTE_DUNKEL`, `PALETTE_HELL`, `farbschemaKopf()` aus Task 1; `Sprache` aus `doku-bauen.ts`
  (`import type`).
- Liefert: `FARBSCHEMA_SCHLUESSEL = 'orrery.doku.farbschema.v1'`, `farbschemaKnopf(sprache: Sprache): string`
  (Knopf mit `id="farbschema-knopf"`, Klassen `kopf-knopf farbschema-knopf`, Attribut `hidden`),
  `FARBSCHEMA_SKRIPT: string` (vollständiges `<script>…</script>`), CSS-Klassen `.kopf-rechts` und `.kopf-knopf` in
  `DOKU_CSS` (Task 4 nutzt beide).

- [ ] **Schritt 1: Fehlschlagende Tests schreiben** — an `scripts/doku-farbschema.test.ts` anhängen; Importe oben
  ergänzen: `import { JSDOM } from 'jsdom';`, `import { seite } from './doku-vorlage.ts';`, aus `./doku-farbschema.ts`
  zusätzlich `FARBSCHEMA_SCHLUESSEL`:

```ts
const DATEN = {
  sprache: 'de' as const, dokument: 'entstehung' as const, titel: 'Titel', beschreibung: 'Kurz',
  html: '<h2 id="a">A</h2><p>Text.</p>', toc: [{ ebene: 2 as const, text: 'A', id: 'a' }],
};

/** Lädt die erzeugte Seite mit Skripten; `gespeichert` belegt den Speicher vorab, 'gesperrt' lässt jeden Zugriff werfen. */
function laden(gespeichert?: string, sprache: 'de' | 'en' = 'de') {
  return new JSDOM(seite({ ...DATEN, sprache }), {
    runScripts: 'dangerously',
    url: `https://orrery3d.de/doku/making-of/${sprache}/`,
    beforeParse(w) {
      if (gespeichert === 'gesperrt') {
        const wirft = (): never => {
          throw new Error('gesperrt');
        };
        Object.assign(w.Storage.prototype, { getItem: wirft, setItem: wirft, removeItem: wirft });
      } else if (gespeichert !== undefined) {
        w.localStorage.setItem(FARBSCHEMA_SCHLUESSEL, gespeichert);
      }
    },
  }).window;
}

describe('Schalter', () => {
  it('ohne Skript verborgen: der Knopf trägt im HTML das Attribut hidden', () => {
    expect(seite(DATEN)).toMatch(/<button[^>]*id="farbschema-knopf"[^>]*\bhidden\b/);
  });
  it('das Kopfskript steht vor dem Stylesheet', () => {
    const h = seite(DATEN);
    expect(h.indexOf(FARBSCHEMA_SCHLUESSEL)).toBeGreaterThan(0);
    expect(h.indexOf(FARBSCHEMA_SCHLUESSEL)).toBeLessThan(h.indexOf('rel="stylesheet"'));
  });
  it('ohne gespeicherte Wahl: automatisch, Knopf sichtbar mit Beschriftung', () => {
    const w = laden();
    const knopf = w.document.getElementById('farbschema-knopf')!;
    expect(w.document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(knopf.hidden).toBe(false);
    expect(knopf.textContent).toBe('◐');
    expect(knopf.getAttribute('aria-label')).toBe('Farbschema: automatisch (wie das System). Klicken für hell.');
  });
  it('gespeichertes „hell“ gilt sofort, theme-color folgt', () => {
    const w = laden('hell');
    expect(w.document.documentElement.getAttribute('data-theme')).toBe('light');
    const metas = [...w.document.querySelectorAll('meta[name="theme-color"]')];
    expect(metas.map((m) => [m.getAttribute('content'), m.hasAttribute('media')])).toEqual([
      ['#f8fafc', false], ['#f8fafc', false],
    ]);
  });
  it('Klick schaltet reihum hell → dunkel → automatisch und speichert', () => {
    const w = laden();
    const knopf = w.document.getElementById('farbschema-knopf')!;
    const wurzel = w.document.documentElement;
    knopf.click();
    expect([wurzel.getAttribute('data-theme'), w.localStorage.getItem(FARBSCHEMA_SCHLUESSEL)]).toEqual(['light', 'hell']);
    expect(knopf.getAttribute('aria-label')).toBe('Farbschema: hell. Klicken für dunkel.');
    knopf.click();
    expect([wurzel.getAttribute('data-theme'), w.localStorage.getItem(FARBSCHEMA_SCHLUESSEL)]).toEqual(['dark', 'dunkel']);
    expect(w.document.querySelector('meta[name="theme-color"]')!.getAttribute('content')).toBe('#0f172a');
    knopf.click();
    expect([wurzel.hasAttribute('data-theme'), w.localStorage.getItem(FARBSCHEMA_SCHLUESSEL)]).toEqual([false, null]);
    const metas = [...w.document.querySelectorAll('meta[name="theme-color"]')];
    expect(metas.map((m) => [m.getAttribute('content'), m.getAttribute('media')])).toEqual([
      ['#0f172a', '(prefers-color-scheme: dark)'], ['#f8fafc', '(prefers-color-scheme: light)'],
    ]);
  });
  it('fremder Wert im Speicher gilt als automatisch', () => {
    const w = laden('blau');
    expect(w.document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(w.document.getElementById('farbschema-knopf')!.textContent).toBe('◐');
  });
  it('gesperrter Speicher: kein Fehler, Wahl gilt für die Seite', () => {
    const w = laden('gesperrt');
    const knopf = w.document.getElementById('farbschema-knopf')!;
    expect(knopf.hidden).toBe(false);
    knopf.click();
    expect(w.document.documentElement.getAttribute('data-theme')).toBe('light');
  });
  it('englische Beschriftung', () => {
    const w = laden(undefined, 'en');
    expect(w.document.getElementById('farbschema-knopf')!.getAttribute('aria-label')).toBe(
      'Color scheme: automatic (follows the system). Click for light.',
    );
  });
});
```

In `scripts/doku-vorlage.test.ts` im `describe('seite')`:

```ts
  it('Farbschalter steht in der Kopfzeile vor der Sprachwahl', () => {
    const kopf = h.slice(h.indexOf('<header'), h.indexOf('</header>'));
    expect(kopf.indexOf('id="farbschema-knopf"')).toBeGreaterThan(0);
    expect(kopf.indexOf('id="farbschema-knopf"')).toBeLessThan(kopf.indexOf('class="sprachwahl"'));
  });
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run scripts/doku-farbschema.test.ts scripts/doku-vorlage.test.ts`.

- [ ] **Schritt 3: Umsetzen** — in `scripts/doku-farbschema.ts` ergänzen:

```ts
import type { Sprache } from './doku-bauen.ts';

export const FARBSCHEMA_SCHLUESSEL = 'orrery.doku.farbschema.v1';

const KNOPF_TEXTE: Record<Sprache, { auto: string; hell: string; dunkel: string }> = {
  de: {
    auto: 'Farbschema: automatisch (wie das System). Klicken für hell.',
    hell: 'Farbschema: hell. Klicken für dunkel.',
    dunkel: 'Farbschema: dunkel. Klicken für automatisch.',
  },
  en: {
    auto: 'Color scheme: automatic (follows the system). Click for light.',
    hell: 'Color scheme: light. Click for dark.',
    dunkel: 'Color scheme: dark. Click for automatic.',
  },
};

/** Knopf für die Kopfzeile; bleibt ohne Skript verborgen (`hidden`), das Schalterskript zeigt ihn. */
export function farbschemaKnopf(sprache: Sprache): string {
  const t = KNOPF_TEXTE[sprache];
  return (
    `<button type="button" class="kopf-knopf farbschema-knopf" id="farbschema-knopf" hidden ` +
    `aria-label="${t.auto}" title="${t.auto}" data-auto="${t.auto}" data-hell="${t.hell}" data-dunkel="${t.dunkel}">` +
    `◐</button>`
  );
}
```

`farbschemaKopf()` erweitern: hinter den beiden `<meta>`-Zeilen folgt das Kopfskript. Der Kopf steht vor dem
Stylesheet, so gilt die Wahl schon beim ersten Zeichnen:

```html
<script>
try {
  var farbschema = localStorage.getItem('${FARBSCHEMA_SCHLUESSEL}');
  if (farbschema === 'hell' || farbschema === 'dunkel') {
    document.documentElement.setAttribute('data-theme', farbschema === 'hell' ? 'light' : 'dark');
  }
} catch (e) {}
</script>
```

Neues Skript (ES5 wie das Navigationsskript in `seite()`; `\\u…` erscheint im erzeugten Skript als `\u…`):

```ts
/** Schalterskript: liest die Wahl, zeigt sie am Knopf und in theme-color, schaltet reihum und speichert. */
export const FARBSCHEMA_SKRIPT = `<script>
(function () {
  var knopf = document.getElementById('farbschema-knopf');
  if (!knopf) return;
  var SCHLUESSEL = '${FARBSCHEMA_SCHLUESSEL}';
  var ZEICHEN = { auto: '\\u25D0', hell: '\\u2600\\uFE0E', dunkel: '\\u263E\\uFE0E' };
  var FARBE = { hell: '${PALETTE_HELL.bg}', dunkel: '${PALETTE_DUNKEL.bg}' };
  var FOLGE = { auto: 'hell', hell: 'dunkel', dunkel: 'auto' };
  var metas = Array.prototype.slice.call(document.querySelectorAll('meta[name="theme-color"]'));
  var urspruenglich = metas.map(function (m) {
    return { content: m.getAttribute('content'), media: m.getAttribute('media') };
  });
  var wahl = 'auto';
  try {
    var gespeichert = localStorage.getItem(SCHLUESSEL);
    if (gespeichert === 'hell' || gespeichert === 'dunkel') wahl = gespeichert;
  } catch (e) {}

  function anwenden() {
    var wurzel = document.documentElement;
    if (wahl === 'auto') wurzel.removeAttribute('data-theme');
    else wurzel.setAttribute('data-theme', wahl === 'hell' ? 'light' : 'dark');
    metas.forEach(function (m, i) {
      if (wahl === 'auto') {
        m.setAttribute('content', urspruenglich[i].content);
        if (urspruenglich[i].media) m.setAttribute('media', urspruenglich[i].media);
      } else {
        m.setAttribute('content', FARBE[wahl]);
        m.removeAttribute('media');
      }
    });
    var text = knopf.getAttribute('data-' + wahl);
    knopf.textContent = ZEICHEN[wahl];
    knopf.setAttribute('aria-label', text);
    knopf.setAttribute('title', text);
  }

  knopf.addEventListener('click', function () {
    wahl = FOLGE[wahl];
    try {
      if (wahl === 'auto') localStorage.removeItem(SCHLUESSEL);
      else localStorage.setItem(SCHLUESSEL, wahl);
    } catch (e) {}
    anwenden();
  });
  anwenden();
  knopf.hidden = false;
})();
</script>`;
```

In `scripts/doku-vorlage.ts`:
- Import erweitern um `FARBSCHEMA_SKRIPT, farbschemaKnopf`.
- Kopfzeile in `seite()`: die Zeile `<nav class="sprachwahl" …>${sprachwahl}</nav>` in einen Behälter setzen:

```html
<div class="kopf-rechts">
${farbschemaKnopf(d.sprache)}
<nav class="sprachwahl" aria-label="${w.sprachLabel}">${sprachwahl}</nav>
</div>
```

- Direkt nach `</footer>` (vor dem vorhandenen `<script>` der Navigation) `${FARBSCHEMA_SKRIPT}` einsetzen.
- In `DOKU_CSS` hinter der Regel `.sprachwahl [aria-current] { … }`:

```css
.kopf-rechts { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.kopf-knopf {
  min-width: 40px;
  min-height: 40px;
  padding: 0 0.6rem;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--rand);
  border-radius: 0.5rem;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}
.kopf-knopf[hidden] { display: none; }
.kopf-knopf[aria-pressed="true"] { color: var(--akzent); border-color: var(--akzent); }
@media (pointer: coarse) { .kopf-knopf { min-width: 44px; min-height: 44px; } }
```

(40 px plus 2 × 0,6 rem Innenabstand der Kopfzeile = 59,2 px; die Kopfzeile bleibt am Desktop bei 60 px.)

- [ ] **Schritt 4: Tests grün** — `npx vitest run scripts/doku-farbschema.test.ts scripts/doku-vorlage.test.ts
  scripts/doku-bauen.test.ts`, `npx tsc -b --noEmit`, `npm run lint`.

- [ ] **Schritt 5: Commit**

```bash
git add scripts/doku-farbschema.ts scripts/doku-farbschema.test.ts scripts/doku-vorlage.ts scripts/doku-vorlage.test.ts
git commit -m "Doku-Seiten: Schalter für das Farbschema mit gespeicherter Wahl"
```

### Task 3: Satzzerlegung

**Dateien:**
- Neu: `scripts/doku-vorlesen.ts`, `scripts/doku-vorlesen.test.ts`

**Schnittstellen:**
- Liefert: `SAETZE_JS: string` — JavaScript-Quelltext (ES5) mit genau einer Funktion `function saetze(text)`, die ein
  `string[]` liefert. Task 4 setzt diesen Text wörtlich in das Vorleseskript ein; die Tests holen sich die Funktion per
  `new Function(SAETZE_JS + '\nreturn saetze;')()`. So prüfen die Tests genau den Code, der im Browser läuft.

- [ ] **Schritt 1: Fehlschlagende Tests schreiben** — `scripts/doku-vorlesen.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { SAETZE_JS } from './doku-vorlesen.ts';

const saetze = new Function(`${SAETZE_JS}\nreturn saetze;`)() as (text: string) => string[];

describe('saetze', () => {
  it('trennt an Punkt, Ausrufe- und Fragezeichen', () => {
    expect(saetze('Erster Satz. Zweiter Satz! Dritter? Ja.')).toEqual(['Erster Satz.', 'Zweiter Satz!', 'Dritter?', 'Ja.']);
  });
  it('nicht nach Abkürzungen aus einzelnen Buchstaben oder der Liste', () => {
    expect(saetze('Das gilt z. B. für Mars, d. h. für alle. Neu.')).toEqual(['Das gilt z. B. für Mars, d. h. für alle.', 'Neu.']);
    expect(saetze('Version 1.5 kam ca. Mitte Mai. Danach Nr. 7 und vgl. Kap. 2.')).toEqual([
      'Version 1.5 kam ca. Mitte Mai.', 'Danach Nr. 7 und vgl. Kap. 2.',
    ]);
    expect(saetze('It works, e.g. on Mars. The end.')).toEqual(['It works, e.g. on Mars.', 'The end.']);
  });
  it('nicht nach Ordnungszahlen bis zwei Stellen, wohl aber nach Datum und Jahr', () => {
    expect(saetze('Am 3. Oktober 2026 begann es. Dann ging es weiter.')).toEqual([
      'Am 3. Oktober 2026 begann es.', 'Dann ging es weiter.',
    ]);
    expect(saetze('Stand 02.10.2026. Danach mehr.')).toEqual(['Stand 02.10.2026.', 'Danach mehr.']);
    // bewusst: „5.“ gilt als Ordnungszahl, der Satz läuft weiter (nur etwas längere Äußerung)
    expect(saetze('Das war Phase 5. Danach kam 6.')).toEqual(['Das war Phase 5. Danach kam 6.']);
  });
  it('nicht, wenn klein weitergeschrieben wird', () => {
    expect(saetze('Er schrieb etwas. und dann mehr.')).toEqual(['Er schrieb etwas. und dann mehr.']);
  });
  it('schließende Anführungszeichen und Auslassungspunkte bleiben am Satz', () => {
    expect(saetze('Er sagte „Fertig.“ Dann ging er.')).toEqual(['Er sagte „Fertig.“', 'Dann ging er.']);
    expect(saetze('She said "Done." Then she left.')).toEqual(['She said "Done."', 'Then she left.']);
    expect(saetze('Und dann... Weiter.')).toEqual(['Und dann...', 'Weiter.']);
  });
  it('fasst Leerraum zusammen; leer ergibt nichts, ohne Satzzeichen einen Satz', () => {
    expect(saetze('  Eins.\n   Zwei.  ')).toEqual(['Eins.', 'Zwei.']);
    expect(saetze('')).toEqual([]);
    expect(saetze('   ')).toEqual([]);
    expect(saetze('Ohne Satzzeichen')).toEqual(['Ohne Satzzeichen']);
  });
});
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run scripts/doku-vorlesen.test.ts`; erwartet: Modul nicht gefunden.

- [ ] **Schritt 3: Umsetzen** — `scripts/doku-vorlesen.ts`:

```ts
/**
 * Vorlesen der Doku-Seiten (Entwurf 2026-10-10 §4) mit den lokalen Stimmen des Browsers
 * (Web Speech API). Reine Bausteine als Zeichenketten; doku-vorlage.ts setzt sie ein.
 */

/**
 * Satzzerlegung als Browser-Quelltext (ES5). Die Sprachausgabe bekommt Satz für Satz,
 * weil Chrome lange Äußerungen nach rund 15 s abbricht. Getrennt wird an `.`, `!`, `?`
 * (samt schließender Anführungszeichen/Klammern) vor einem Leerzeichen, wenn danach ein
 * Großbuchstabe, eine Ziffer oder ein öffnendes Zeichen folgt — nicht nach einzelnen
 * Buchstaben (z. B., d. h., e.g.), Abkürzungen der Liste und ein- bis zweistelligen
 * Zahlen (Ordnungszahlen wie „3. Oktober“). `String.raw`, damit die Backslashes der
 * regulären Ausdrücke unverändert im Browser ankommen.
 */
export const SAETZE_JS = String.raw`function saetze(text) {
  var ABKUERZUNGEN = ['bzw', 'ca', 'vgl', 'Nr', 'Dr', 'Prof', 'St', 'etc', 'usw', 'ggf', 'evtl', 'inkl', 'bspw',
    'sog', 'Abb', 'Kap', 'Jh', 'Mio', 'Mrd', 'Mr', 'Mrs', 'Ms', 'vs', 'approx', 'cf', 'Fig', 'No', 'al'];
  var t = String(text).replace(/\s+/g, ' ').trim();
  var ergebnis = [];
  var anfang = 0;
  var muster = /[.!?]+["'”“»«)\]]*(?= )/g;
  var treffer;
  while ((treffer = muster.exec(t)) !== null) {
    var ende = treffer.index + treffer[0].length;
    if (!/[A-ZÄÖÜ0-9"'„“‚«»(\[]/.test(t.charAt(ende + 1))) continue;
    if (treffer[0].charAt(0) === '.') {
      var wort = t.slice(anfang, treffer.index).split(' ').pop();
      if (/^[A-Za-zÄÖÜäöü]$/.test(wort) || /^\d{1,2}$/.test(wort) || /^[a-z]\.[a-z]$/i.test(wort) ||
        ABKUERZUNGEN.indexOf(wort) >= 0) continue;
    }
    ergebnis.push(t.slice(anfang, ende).trim());
    anfang = ende + 1;
  }
  var rest = t.slice(anfang).trim();
  if (rest) ergebnis.push(rest);
  return ergebnis;
}`;
```

- [ ] **Schritt 4: Tests grün** — `npx vitest run scripts/doku-vorlesen.test.ts`, `npx tsc -b --noEmit`, `npm run lint`.
  Schlägt ein Fall fehl, die Funktion anpassen, nicht den Test (die Fälle stehen für den Entwurf); Ausnahme: ein Fall
  widerspricht einem anderen — dann Ruling ins Ledger.

- [ ] **Schritt 5: Commit**

```bash
git add scripts/doku-vorlesen.ts scripts/doku-vorlesen.test.ts
git commit -m "Doku-Seiten: Satzzerlegung für das Vorlesen"
```

### Task 4: Vorlesen mit Bedienleiste

**Dateien:**
- Ändern: `scripts/doku-vorlesen.ts`, `scripts/doku-vorlesen.test.ts`, `scripts/doku-vorlage.ts` (Kopfzeile, Leiste
  und Skript vor `</body>`, CSS am Ende von `DOKU_CSS`), `scripts/doku-vorlage.test.ts`

**Schnittstellen:**
- Verwendet: `SAETZE_JS` (Task 3); `.kopf-rechts`, `.kopf-knopf` (Task 2); `Sprache` aus `doku-bauen.ts` (`import type`).
- Liefert: `vorlesenKnopf(sprache: Sprache): string` (`id="vorlesen-knopf"`, `hidden`, `aria-pressed="false"`),
  `vorlesenLeiste(sprache: Sprache): string` (`id="vorlesen-leiste"`, `role="region"`, `hidden`, Knöpfe mit
  `data-aktion` = `zurueck | pause | vor | tempo | stopp`), `VORLESEN_SKRIPT: string`, `VORLESEN_CSS: string`.

**Ruling (im Ledger vermerken):** Der Kopfknopf behält seine Beschriftung „Vorlesen“/„Read aloud“ und zeigt den Zustand
nur über `aria-pressed` (gängiges Muster für Umschaltknöpfe: wechselnde Beschriftung plus `aria-pressed` verwirrt
Screenreader). Der Entwurf §4 ist entsprechend angepasst.

- [ ] **Schritt 1: Fehlschlagende Tests schreiben** — an `scripts/doku-vorlesen.test.ts` anhängen; Importe oben ergänzen:
  `import { JSDOM } from 'jsdom';`, `import { seite } from './doku-vorlage.ts';`:

```ts
interface Stimme { name: string; lang: string; localService: boolean; default: boolean }
const DE_LOKAL: Stimme = { name: 'Hedda', lang: 'de-DE', localService: true, default: false };
const DE_ONLINE: Stimme = { name: 'Google Deutsch', lang: 'de-DE', localService: false, default: false };
const EN_LOKAL: Stimme = { name: 'Zira', lang: 'en-US', localService: true, default: false };

/** Ersatz für SpeechSynthesisUtterance: merkt sich Text, Stimme und Tempo. */
class Aeusserung {
  text: string;
  voice: Stimme | null = null;
  lang = '';
  rate = 1;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

const SEITE_DE = seite({
  sprache: 'de', dokument: 'entstehung', titel: 'Titel', beschreibung: 'Kurz',
  html:
    '<h2 id="a">Abschnitt A</h2><p>Satz eins. Satz zwei.</p>' +
    '<table><tr><td>Zelle.</td></tr></table><pre><code>code();</code></pre>' +
    '<p><img src="x.png" alt="Bild"></p>' +
    '<ul><li>Punkt eins<ul><li>Unterpunkt</li></ul></li></ul>' +
    '<h2 id="b">Abschnitt B</h2><p>Letzter Satz.</p>',
  toc: [{ ebene: 2, text: 'Abschnitt A', id: 'a' }, { ebene: 2, text: 'Abschnitt B', id: 'b' }],
});

/** Lädt die Seite mit Ersatz-Sprachausgabe; `stimmen === null` heißt: Browser ohne speechSynthesis. */
function laden(stimmen: Stimme[] | null) {
  const gesprochen: Aeusserung[] = [];
  const hoerer: Array<() => void> = [];
  let abbrueche = 0;
  const synth = {
    getVoices: () => stimmen ?? [],
    speak: (u: Aeusserung) => {
      gesprochen.push(u);
    },
    cancel: () => {
      abbrueche += 1;
    },
    addEventListener: (typ: string, fn: () => void) => {
      if (typ === 'voiceschanged') hoerer.push(fn);
    },
  };
  const fenster = new JSDOM(SEITE_DE, {
    runScripts: 'dangerously',
    url: 'https://orrery3d.de/doku/making-of/de/',
    beforeParse(w) {
      if (stimmen !== null) Object.assign(w, { speechSynthesis: synth, SpeechSynthesisUtterance: Aeusserung });
    },
  }).window;
  const el = (s: string) => fenster.document.querySelector(s) as HTMLElement;
  const letzte = () => gesprochen[gesprochen.length - 1];
  return { fenster, el, gesprochen, hoerer, letzte, abbrueche: () => abbrueche };
}
/** Das Skript setzt nach einem Abbruch per setTimeout(…, 0) neu an. */
const warten = () => new Promise((fertig) => setTimeout(fertig, 5));

describe('Vorlesen: Verfügbarkeit', () => {
  it('ohne Skript verborgen: Knopf und Leiste tragen im HTML hidden', () => {
    expect(SEITE_DE).toMatch(/<button[^>]*id="vorlesen-knopf"[^>]*\bhidden\b/);
    expect(SEITE_DE).toMatch(/<div[^>]*id="vorlesen-leiste"[^>]*role="region"[^>]*aria-label="Vorlesen"[^>]*\bhidden\b/);
  });
  it('Knopf steht in der Kopfzeile zwischen Farbschalter und Sprachwahl', () => {
    const kopf = SEITE_DE.slice(SEITE_DE.indexOf('<header'), SEITE_DE.indexOf('</header>'));
    const lage = ['id="farbschema-knopf"', 'id="vorlesen-knopf"', 'class="sprachwahl"'].map((s) => kopf.indexOf(s));
    expect(lage[0]).toBeGreaterThan(0);
    expect(lage).toEqual([...lage].sort((a, b) => a - b));
  });
  it('ohne speechSynthesis bleibt der Knopf verborgen', () => {
    expect(laden(null).el('#vorlesen-knopf').hidden).toBe(true);
  });
  it('nur Online-Stimmen oder fremde Sprache: verborgen', () => {
    expect(laden([DE_ONLINE, EN_LOKAL]).el('#vorlesen-knopf').hidden).toBe(true);
  });
  it('lokale Stimme der Seitensprache: sichtbar, auch wenn sie erst später gemeldet wird', () => {
    const stimmen: Stimme[] = [];
    const s = laden(stimmen);
    expect(s.el('#vorlesen-knopf').hidden).toBe(true);
    stimmen.push(DE_LOKAL);
    s.hoerer.forEach((fn) => fn());
    expect(s.el('#vorlesen-knopf').hidden).toBe(false);
  });
  it('die Standardstimme hat Vorrang', async () => {
    const standard: Stimme = { ...DE_LOKAL, name: 'Katja', default: true };
    const s = laden([DE_LOKAL, standard]);
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(s.letzte().voice).toBe(standard);
  });
});

describe('Vorlesen: Ablauf', () => {
  it('beginnt beim Titel, markiert ihn und zeigt die Leiste', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(s.letzte().text).toBe('Titel');
    expect(s.letzte().rate).toBe(1);
    expect(s.el('h1').classList.contains('vorlesen-aktiv')).toBe(true);
    expect(s.el('#vorlesen-leiste').hidden).toBe(false);
    expect(s.el('#vorlesen-knopf').getAttribute('aria-pressed')).toBe('true');
    expect(s.fenster.document.body.classList.contains('vorlesen-laeuft')).toBe(true);
  });
  it('liest Satz für Satz; Tabelle, Code, Bild und doppelte Listenpunkte entfallen; am Ende ist Schluss', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    for (let i = 0; i < 20 && !s.el('#vorlesen-leiste').hidden; i += 1) s.letzte().onend!();
    expect(s.gesprochen.map((u) => u.text)).toEqual([
      'Titel', 'Abschnitt A', 'Satz eins.', 'Satz zwei.', 'Punkt eins', 'Unterpunkt', 'Abschnitt B', 'Letzter Satz.',
    ]);
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.fenster.document.querySelector('.vorlesen-aktiv')).toBeNull();
  });
  it('beginnt beim Abschnitt, den das Inhaltsverzeichnis gerade markiert', async () => {
    const s = laden([DE_LOKAL]);
    s.el('.toc a[href="#b"]').setAttribute('aria-current', 'location');
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(s.letzte().text).toBe('Abschnitt B');
  });
  it('Stopp beendet alles; ein spätes onend spricht nicht weiter', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const alt = s.letzte();
    s.el('[data-aktion="stopp"]').click();
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.el('#vorlesen-knopf').getAttribute('aria-pressed')).toBe('false');
    expect(s.fenster.document.querySelector('.vorlesen-aktiv')).toBeNull();
    expect(s.abbrueche()).toBeGreaterThan(0);
    const anzahl = s.gesprochen.length;
    alt.onend!();
    await warten();
    expect(s.gesprochen.length).toBe(anzahl);
  });
  it('der Kopfknopf beendet ein laufendes Vorlesen', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('#vorlesen-knopf').click();
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
  });
  it('Pause hält an, Weiter setzt mit demselben Satz fort', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const pause = s.el('[data-aktion="pause"]');
    pause.click();
    expect(pause.getAttribute('aria-label')).toBe('Weiter');
    const anzahl = s.gesprochen.length;
    s.letzte().onend!();
    await warten();
    expect(s.gesprochen.length).toBe(anzahl);
    pause.click();
    await warten();
    expect(pause.getAttribute('aria-label')).toBe('Pause');
    expect(s.letzte().text).toBe('Titel');
  });
  it('Tempo reihum 1,25 → 0,8 → 1, wirkt sofort', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const tempo = s.el('[data-aktion="tempo"]');
    expect(tempo.textContent).toBe('1×');
    tempo.click();
    await warten();
    expect([s.letzte().rate, tempo.textContent, tempo.getAttribute('aria-label')]).toEqual([1.25, '1,25×', 'Tempo 1,25×']);
    tempo.click();
    await warten();
    expect(s.letzte().rate).toBe(0.8);
    tempo.click();
    await warten();
    expect(s.letzte().rate).toBe(1);
  });
  it('Absatz vor und zurück', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('[data-aktion="vor"]').click();
    await warten();
    expect(s.letzte().text).toBe('Abschnitt A');
    expect(s.el('#a').classList.contains('vorlesen-aktiv')).toBe(true);
    s.el('[data-aktion="zurueck"]').click();
    await warten();
    expect(s.letzte().text).toBe('Titel');
  });
  it('Klick ins Inhaltsverzeichnis setzt beim Ziel an', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('.toc a[href="#b"]').click();
    await warten();
    expect(s.letzte().text).toBe('Abschnitt B');
  });
  it('Escape stoppt; bei offener Navigationsschublade schließt es nur die Schublade', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const escape = () =>
      s.fenster.document.dispatchEvent(new s.fenster.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    s.el('#inhalt-nav').setAttribute('data-offen', 'true');
    escape();
    expect(s.el('#inhalt-nav').getAttribute('data-offen')).toBe('false');
    expect(s.el('#vorlesen-leiste').hidden).toBe(false);
    escape();
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
  });
  it('pagehide bricht ab und räumt auf', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.fenster.dispatchEvent(new s.fenster.Event('pagehide'));
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.fenster.document.querySelector('.vorlesen-aktiv')).toBeNull();
  });
  it('Fehler der Sprachausgabe beendet, Abbruchmeldungen nicht', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.letzte().onerror!({ error: 'interrupted' });
    expect(s.el('#vorlesen-leiste').hidden).toBe(false);
    s.letzte().onerror!({ error: 'synthesis-failed' });
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
  });
  it('englische Seite: englische Beschriftung', () => {
    const en = seite({ sprache: 'en', dokument: 'chronik', titel: 'T', beschreibung: 'B', html: '<p>x</p>', toc: [] });
    expect(en).toMatch(/id="vorlesen-knopf"[^>]*>Read aloud</);
    expect(en).toContain('aria-label="Stop reading"');
  });
});
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run scripts/doku-vorlesen.test.ts`; erwartet: `seite` liefert keinen
  `#vorlesen-knopf`.

- [ ] **Schritt 3: Umsetzen** — in `scripts/doku-vorlesen.ts` ergänzen (oben `import type { Sprache } from
  './doku-bauen.ts';`):

```ts
const WOERTER: Record<Sprache, {
  knopf: string; knopfTitel: string; leiste: string; pause: string; weiter: string;
  zurueck: string; vor: string; stopp: string; tempo: string;
}> = {
  de: {
    knopf: 'Vorlesen', knopfTitel: 'Seite ab dem aktuellen Abschnitt vorlesen', leiste: 'Vorlesen',
    pause: 'Pause', weiter: 'Weiter', zurueck: 'Absatz zurück', vor: 'Absatz vor', stopp: 'Vorlesen beenden',
    tempo: 'Tempo',
  },
  en: {
    knopf: 'Read aloud', knopfTitel: 'Read this page aloud from the current section', leiste: 'Read aloud',
    pause: 'Pause', weiter: 'Resume', zurueck: 'Previous paragraph', vor: 'Next paragraph', stopp: 'Stop reading',
    tempo: 'Speed',
  },
};

/** Kopfknopf; bleibt verborgen, bis das Skript eine lokale Stimme der Seitensprache findet. */
export function vorlesenKnopf(sprache: Sprache): string {
  const w = WOERTER[sprache];
  return (
    `<button type="button" class="kopf-knopf vorlesen-knopf" id="vorlesen-knopf" hidden aria-pressed="false" ` +
    `title="${w.knopfTitel}">${w.knopf}</button>`
  );
}

/** Bedienleiste unten; Zeichen mit Textdarstellung (U+FE0E), Namen über aria-label. */
export function vorlesenLeiste(sprache: Sprache): string {
  const w = WOERTER[sprache];
  const knopf = (aktion: string, zeichen: string, text: string, extra = ''): string =>
    `<button type="button" data-aktion="${aktion}" aria-label="${text}" title="${text}"${extra}>${zeichen}</button>`;
  return `<div class="vorlesen-leiste" id="vorlesen-leiste" role="region" aria-label="${w.leiste}" hidden>
${knopf('zurueck', '&#x23EE;&#xFE0E;', w.zurueck)}
${knopf('pause', '&#x23F8;&#xFE0E;', w.pause, ` data-pause="${w.pause}" data-weiter="${w.weiter}"`)}
${knopf('vor', '&#x23ED;&#xFE0E;', w.vor)}
${knopf('tempo', '1&#xD7;', `${w.tempo} 1×`, ` data-text="${w.tempo}"`)}
${knopf('stopp', '&#x23F9;&#xFE0E;', w.stopp)}
</div>`;
}

/**
 * Vorleseskript (ES5). Nur Stimmen mit `localService` und passender Sprache, sonst bleibt
 * der Knopf verborgen (kein Text an fremde Server). `lauf` zählt jeden Neuansatz; Ereignisse
 * älterer Äußerungen (nach cancel()) laufen ins Leere. Nach cancel() wird per setTimeout neu
 * angesetzt, weil manche Browser ein sofortiges speak() nach cancel() verschlucken.
 */
export const VORLESEN_SKRIPT = String.raw`<script>
(function () {
  var knopf = document.getElementById('vorlesen-knopf');
  var leiste = document.getElementById('vorlesen-leiste');
  var main = document.querySelector('main');
  if (!knopf || !leiste || !main || !window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return;
  var synth = window.speechSynthesis;
  var sprache = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  var TEMPI = [0.8, 1, 1.25];
  var BLOECKE = 'h1, h2, h3, h4, p, li, blockquote';
  var KOPF_HOEHE = 60;
  var pauseKnopf = leiste.querySelector('[data-aktion="pause"]');
  var tempoKnopf = leiste.querySelector('[data-aktion="tempo"]');

  var stimme = null;
  var liste = [];
  var index = 0;
  var saetzeJetzt = [];
  var satz = 0;
  var laeuft = false;
  var pausiert = false;
  var tempo = 1;
  var lauf = 0;

  ${SAETZE_JS}

  function stimmeWaehlen() {
    var passend = synth.getVoices().filter(function (v) {
      return v.localService === true && String(v.lang).toLowerCase().indexOf(sprache) === 0;
    });
    stimme = passend.filter(function (v) { return v.default; })[0] || passend[0] || null;
    knopf.hidden = !stimme;
    if (!stimme && laeuft) beenden();
  }

  /** Text eines Blocks ohne verschachtelte Listen, Tabellen und Code (die liest ihr eigener Block bzw. niemand). */
  function text(el) {
    var kopie = el.cloneNode(true);
    Array.prototype.forEach.call(kopie.querySelectorAll('ul, ol, table, pre'), function (k) {
      k.parentNode.removeChild(k);
    });
    return kopie.textContent.replace(/\s+/g, ' ').trim();
  }

  function bloecke() {
    return Array.prototype.filter.call(main.querySelectorAll(BLOECKE), function (el) {
      if (el.closest('table, pre, nav')) return false;
      if (el.tagName === 'BLOCKQUOTE' && el.querySelector('p, li')) return false;
      if (el.tagName === 'P' && el.closest('li')) return false;
      return text(el) !== '';
    });
  }

  function startIndex() {
    var aktiv = document.querySelector('.toc a[aria-current="location"]');
    var ziel = aktiv ? document.getElementById(aktiv.getAttribute('href').slice(1)) : null;
    var i = ziel ? liste.indexOf(ziel) : -1;
    return i >= 0 ? i : 0;
  }

  function markieren(el) {
    var alt = main.querySelector('.vorlesen-aktiv');
    if (alt) alt.classList.remove('vorlesen-aktiv');
    if (!el) return;
    el.classList.add('vorlesen-aktiv');
    var r = el.getBoundingClientRect();
    if ((r.top < KOPF_HOEHE || r.bottom > window.innerHeight - 80) && el.scrollIntoView) {
      var ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'center', behavior: ruhig ? 'auto' : 'smooth' });
    }
  }

  function zeigen() {
    var t = pauseKnopf.getAttribute(pausiert ? 'data-weiter' : 'data-pause');
    pauseKnopf.innerHTML = pausiert ? '&#x25B6;&#xFE0E;' : '&#x23F8;&#xFE0E;';
    pauseKnopf.setAttribute('aria-label', t);
    pauseKnopf.setAttribute('title', t);
    var wert = String(tempo).replace('.', sprache === 'de' ? ',' : '.') + '×';
    tempoKnopf.textContent = wert;
    tempoKnopf.setAttribute('aria-label', tempoKnopf.getAttribute('data-text') + ' ' + wert);
    tempoKnopf.setAttribute('title', tempoKnopf.getAttribute('data-text') + ' ' + wert);
  }

  function blockLaden() {
    while (index < liste.length) {
      saetzeJetzt = saetze(text(liste[index]));
      if (saetzeJetzt.length) {
        markieren(liste[index]);
        return true;
      }
      index += 1;
    }
    return false;
  }

  function sprechen() {
    if (!laeuft || pausiert) return;
    if (!stimme) { beenden(); return; }
    if (satz >= saetzeJetzt.length) {
      index += 1;
      satz = 0;
      if (!blockLaden()) { beenden(); return; }
    }
    var meinLauf = lauf;
    var u = new SpeechSynthesisUtterance(saetzeJetzt[satz]);
    u.voice = stimme;
    u.lang = stimme.lang;
    u.rate = tempo;
    u.onend = function () {
      if (meinLauf !== lauf) return;
      satz += 1;
      sprechen();
    };
    u.onerror = function (e) {
      if (meinLauf !== lauf) return;
      if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
      beenden();
    };
    synth.speak(u);
  }

  function neuAnsetzen() {
    lauf += 1;
    synth.cancel();
    var l = lauf;
    setTimeout(function () { if (l === lauf) sprechen(); }, 0);
  }

  function springen(neu) {
    index = Math.max(0, Math.min(neu, liste.length - 1));
    satz = 0;
    pausiert = false;
    zeigen();
    if (!blockLaden()) { beenden(); return; }
    neuAnsetzen();
  }

  function starten() {
    liste = bloecke();
    if (!liste.length || !stimme) return;
    laeuft = true;
    knopf.setAttribute('aria-pressed', 'true');
    leiste.hidden = false;
    document.body.classList.add('vorlesen-laeuft');
    springen(startIndex());
  }

  function beenden() {
    lauf += 1;
    laeuft = false;
    pausiert = false;
    synth.cancel();
    markieren(null);
    knopf.setAttribute('aria-pressed', 'false');
    leiste.hidden = true;
    document.body.classList.remove('vorlesen-laeuft');
    zeigen();
  }

  knopf.addEventListener('click', function () {
    if (laeuft) beenden();
    else starten();
  });

  leiste.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button[data-aktion]') : null;
    if (!b || !laeuft) return;
    var aktion = b.getAttribute('data-aktion');
    if (aktion === 'pause') {
      if (pausiert) {
        pausiert = false;
        zeigen();
        neuAnsetzen();
      } else {
        pausiert = true;
        lauf += 1;
        synth.cancel();
        zeigen();
      }
    } else if (aktion === 'zurueck') {
      springen(index - 1);
    } else if (aktion === 'vor') {
      if (index + 1 < liste.length) springen(index + 1);
      else beenden();
    } else if (aktion === 'tempo') {
      tempo = TEMPI[(TEMPI.indexOf(tempo) + 1) % TEMPI.length];
      zeigen();
      if (!pausiert) neuAnsetzen();
    } else if (aktion === 'stopp') {
      beenden();
    }
  });

  document.addEventListener('click', function (ev) {
    if (!laeuft) return;
    var a = ev.target && ev.target.closest ? ev.target.closest('.toc a[href^="#"]') : null;
    if (!a) return;
    var i = liste.indexOf(document.getElementById(a.getAttribute('href').slice(1)));
    if (i >= 0) springen(i);
  });

  // Erfassungsphase: läuft vor dem Escape-Hörer der Navigation, der die Schublade schließt.
  window.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' || !laeuft) return;
    if (document.querySelector('.nav[data-offen="true"]')) return;
    beenden();
  }, true);

  window.addEventListener('pagehide', function () {
    if (laeuft) beenden();
  });

  stimmeWaehlen();
  if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', stimmeWaehlen);
  else synth.onvoiceschanged = stimmeWaehlen;
})();
</script>`;

/** Markierung, Leiste und Platz für den Seitenfuß; Markierungsfarbe wie im Kontrasttest (12 %). */
export const VORLESEN_CSS = `.vorlesen-aktiv {
  background: color-mix(in srgb, var(--akzent) 12%, var(--bg));
  box-shadow: 0 0 0 0.3rem color-mix(in srgb, var(--akzent) 12%, var(--bg));
  border-radius: 0.2rem;
}
.vorlesen-leiste {
  position: fixed;
  z-index: 30;
  left: 50%;
  bottom: 0.75rem;
  transform: translateX(-50%);
  display: flex;
  gap: 0.4rem;
  padding: 0.4rem;
  background: var(--bg);
  border: 1px solid var(--rand);
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.3);
}
.vorlesen-leiste[hidden] { display: none; }
.vorlesen-leiste button {
  min-width: 44px;
  min-height: 44px;
  padding: 0 0.5rem;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--rand);
  border-radius: 0.5rem;
  font: inherit;
  cursor: pointer;
}
body.vorlesen-laeuft .fuss { padding-bottom: 6rem; }
`;
```

Hinweis zum Escape-Test: Der vorhandene Escape-Hörer der Navigation hängt an `document` (Blasenphase) und schließt die
Schublade; der Vorlese-Hörer hängt in der Erfassungsphase an `window` und sieht die Schublade deshalb noch offen.

In `scripts/doku-vorlage.ts`:
- Import: `import { VORLESEN_CSS, VORLESEN_SKRIPT, vorlesenKnopf, vorlesenLeiste } from './doku-vorlesen.ts';`
- Kopfzeile: im Behälter `.kopf-rechts` zwischen `${farbschemaKnopf(d.sprache)}` und `<nav class="sprachwahl" …>` die
  Zeile `${vorlesenKnopf(d.sprache)}` einfügen.
- Nach dem vorhandenen Navigationsskript (`})();\n</script>` vor `</body>`): `${vorlesenLeiste(d.sprache)}` und
  `${VORLESEN_SKRIPT}` einsetzen.
- `DOKU_CSS` am Ende (nach `.fuss a { … }`) um `${VORLESEN_CSS}` erweitern.

- [ ] **Schritt 4: Tests grün** — `npx vitest run scripts/doku-vorlesen.test.ts scripts/doku-farbschema.test.ts
  scripts/doku-vorlage.test.ts scripts/doku-bauen.test.ts`, `npx tsc -b --noEmit`, `npm run lint`. Wenn ein Test am
  Ablauf scheitert, zuerst prüfen, ob der Ersatz in `laden()` das Browserverhalten richtig nachbildet; Tests nur
  ändern, wenn sie nachweislich etwas anderes als der Entwurf verlangen (Ruling).

- [ ] **Schritt 5: Entwurf nachführen** — in `docs/superpowers/specs/2026-10-10-doku-farbschema-vorlesen-design.md` §4
  „Bedienleiste“ den letzten Punkt ersetzen durch: „Der Knopf ‚Vorlesen‘ in der Kopfzeile behält seine Beschriftung und
  zeigt den laufenden Zustand über `aria-pressed`; ein Klick beendet dann das Vorlesen.“ und in §3 „Knopf“ den Punkt
  „Ohne JavaScript ausgeblendet …“ ersetzen durch: „Ohne JavaScript ausgeblendet (Attribut `hidden`, das Skript
  entfernt es).“

- [ ] **Schritt 6: Commit**

```bash
git add scripts/doku-vorlesen.ts scripts/doku-vorlesen.test.ts scripts/doku-vorlage.ts scripts/doku-vorlage.test.ts docs/superpowers/specs/2026-10-10-doku-farbschema-vorlesen-design.md
git commit -m "Doku-Seiten: Vorlesen mit lokalen Stimmen und Bedienleiste"
```

### Task 5: Leseansicht, Gliederung, Sichtprüfung und Abnahmeprotokoll

**Dateien:**
- Ändern: `scripts/doku-vorlage.ts` (`Woerter` um `leseansicht`, Fußzeile), `scripts/doku-vorlage.test.ts`,
  `scripts/doku-bauen.test.ts`
- Neu: `docs/doku-farbschema-abnahme.md`

**Schnittstellen:**
- Verwendet: alles aus Task 1–4 (Knopf-IDs `farbschema-knopf`, `vorlesen-knopf`, `vorlesen-leiste`, Klasse
  `vorlesen-aktiv`, Schlüssel `orrery.doku.farbschema.v1`).

- [ ] **Schritt 1: Tests schreiben** — in `scripts/doku-vorlage.test.ts` im `describe('seite')`:

```ts
  it('Fußzeile nennt die Leseansicht des Browsers in der Seitensprache', () => {
    expect(h.slice(h.indexOf('<footer'))).toContain('<p class="fuss-hinweis">Tipp: Die Leseansicht des Browsers kann diese Seite ebenfalls vorlesen.</p>');
    const en = seite({ ...d, sprache: 'en' });
    expect(en.slice(en.indexOf('<footer'))).toContain("<p class=\"fuss-hinweis\">Tip: Your browser's reader view can also read this page aloud.</p>");
  });
```

In `scripts/doku-bauen.test.ts` (Importe `readFileSync` aus `node:fs` und `umwandeln` ergänzen, falls nicht vorhanden) —
ein Wächtertest, der heute schon grün ist und künftige Texte bewacht (Leseansicht und Vorlesen setzen eine saubere
Gliederung voraus):

```ts
describe('Gliederung der Making-of-Texte', () => {
  for (const dokument of ['entstehung', 'chronik'] as const) {
    for (const sprache of ['de', 'en'] as const) {
      it(`${dokument}.${sprache}: kein h1 im Inhalt, Überschriften ohne Sprung`, () => {
        const { html } = umwandeln(readFileSync(`docs/${dokument}.${sprache}.md`, 'utf8'), sprache);
        const ebenen = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
        expect(ebenen).not.toContain(1);
        let vorher = 1;
        for (const ebene of ebenen) {
          expect(ebene).toBeLessThanOrEqual(vorher + 1);
          vorher = ebene;
        }
      });
    }
  }
});
```

- [ ] **Schritt 2: Fehlschlag prüfen** — `npx vitest run scripts/doku-vorlage.test.ts scripts/doku-bauen.test.ts`;
  erwartet: nur der Fußzeilentest scheitert.

- [ ] **Schritt 3: Umsetzen** — in `scripts/doku-vorlage.ts`: `interface Woerter` um `leseansicht: string` erweitern;
  in `WOERTER.de` `leseansicht: 'Tipp: Die Leseansicht des Browsers kann diese Seite ebenfalls vorlesen.'`, in
  `WOERTER.en` `leseansicht: "Tip: Your browser's reader view can also read this page aloud."`; die Fußzeile in
  `seite()` wird zu:

```html
<footer class="fuss">
<p>${w.fuss}</p>
<p class="fuss-hinweis">${w.leseansicht}</p>
</footer>
```

- [ ] **Schritt 4: Tests grün** — `npx vitest run scripts/doku-vorlage.test.ts scripts/doku-bauen.test.ts`; Commit:

```bash
git add scripts/doku-vorlage.ts scripts/doku-vorlage.test.ts scripts/doku-bauen.test.ts
git commit -m "Doku-Seiten: Hinweis auf die Leseansicht, Gliederung bewacht"
```

- [ ] **Schritt 5: Bauen und Vorschau starten** — `npm run build`; dann im Hintergrund
  `npx vite preview --port 4173 --strictPort`; prüfen:
  `curl -s -o /dev/null -w '%{http_code}' http://localhost:4173/Orrery/doku/making-of/de/` → `200`. Basis der
  Vorschau ist `/Orrery/`.

- [ ] **Schritt 6: Sichtprüfung mit Messwerten** (Playwright, je eigener Kontext über
  `page.context().browser().newContext({...})`, neue Seite sofort `bringToFront()`). Jede Zeile ergibt einen Messwert
  für §4 des Protokolls; Pixel per Screenshot und Python 3.12 (Pillow) am Punkt (5, 200) — linker Rand unterhalb der
  Kopfzeile, Seitengrund — oder per `getComputedStyle`, wo angegeben.

  | Nr. | Aufbau | Erwartung |
  |---|---|---|
  | 1 | 1400×900, `colorScheme: 'dark'`, DE | Grund (15, 23, 42); Kopfzeile `getBoundingClientRect().height` ≤ 60 |
  | 2 | wie 1, `colorScheme: 'light'` | Grund (248, 250, 252); Kopfzeile ≤ 60 |
  | 3 | wie 1, EN | wie 1, Knopf-`aria-label` englisch |
  | 4 | `colorScheme: 'dark'`, vorab per `addInitScript` `localStorage.setItem('orrery.doku.farbschema.v1','hell')`; per `addInitScript` beim `DOMContentLoaded` `getComputedStyle(document.body).backgroundColor` in `window.__grund` merken | `__grund` = `rgb(248, 250, 252)` (kein Aufblitzen) |
  | 5 | wie 2 (System hell, Automatisch), Schalter dreimal klicken, nach jedem Klick Grund messen | Klick 1 hell (248, 250, 252), Klick 2 dunkel (15, 23, 42), Klick 3 automatisch (248, 250, 252) |
  | 6 | wie 5, Seite neu laden nach Klick auf „dunkel“, dann zur Chronik wechseln | Grund bleibt (15, 23, 42) auf beiden Seiten |
  | 7 | `javaScriptEnabled: false`, `colorScheme: 'light'` | Grund hell; `#farbschema-knopf` und `#vorlesen-knopf` nicht sichtbar (`isVisible()` false) |
  | 8 | 390×844, `isMobile`, `hasTouch`, `deviceScaleFactor: 2`, beide Schemata | Kopfknöpfe ≥ 44×44 px; `document.documentElement.scrollWidth` ≤ 390 |
  | 9 | 1400×900, Ersatz-Sprachausgabe per `addInitScript` (eine Stimme `{name:'Test', lang:'de-DE', localService:true, default:true}`, `speak` merkt Texte, `cancel` leer), Knopf klicken | Leiste sichtbar und vollständig im Bild; Markierung am `h1`: Pixel im Markierungsrand neben dem Titel hell (219, 233, 241) ± 3, dunkel (28, 46, 67) ± 3 |
  | 10 | wie 9 bei 390×844 | Leiste vollständig im Bild, verdeckt den Navigationsknopf nicht |
  | 11 | echte Stimmen im Prüf-Chromium: `speechSynthesis.getVoices()` nach `voiceschanged` | Liste mit `localService` ins Protokoll; Knopf sichtbar genau dann, wenn eine lokale `de`-Stimme dabei ist |
  | 12 | Leseansicht: Firefox steht für Playwright nicht bereit | nur von Hand (§5) |


  Der Ersatz für Zeile 9/10 (als `addInitScript`):

```js
() => {
  const stimme = { name: 'Test', lang: 'de-DE', localService: true, default: true };
  window.__gesprochen = [];
  window.speechSynthesis = {
    getVoices: () => [stimme],
    speak: (u) => window.__gesprochen.push(u.text),
    cancel: () => {},
    addEventListener: () => {},
  };
  window.SpeechSynthesisUtterance = function (text) { this.text = text; };
}
```

  Weicht ein Messwert ab: Ursache suchen (systematic-debugging), beheben, Test ergänzen, neu messen. Nach der Messung
  Vorschauserver beenden und den Port 4173 per `Get-NetTCPConnection -LocalPort 4173` prüfen (unter Windows bleibt sonst
  der Vite-Kindprozess). Screenshots und Skripte löschen; `git status` muss außer dem Protokoll sauber sein.

- [ ] **Schritt 7: Abnahmeprotokoll** — `docs/doku-farbschema-abnahme.md` nach dem Muster der letzten Protokolle (etwa
  `docs/kleinigkeiten-abnahme.md`), ohne Suchmuster der Wort- und Trailerprüfung:
  - §1 Umfang (Entwurf, Plan, Branch), §2 Commits, §3 Tests (Anzahl vorher/nachher, Hauptchunk unverändert),
  - §4 Sichtprüfung: Tabelle mit allen Messwerten aus Schritt 6,
  - §5 Handprüfung (offen, für Jens): Firefox mit NoScript (Seite ohne Skript: Farbe nach System, keine Knöpfe) und mit
    erlaubtem Skript; Chrome und Edge unter Windows (Edge: nur lokale Stimmen, keine „Natural“-Stimmen); A55 mit Chrome;
    jeweils: Wahl bleibt nach Seiten- und Sprachwechsel und nach Neustart; Vorlesen hörbar, Markierung folgt, Pause,
    Tempo, Absatz vor/zurück, Escape, Sprachwechsel bricht ab; Leseansicht in Firefox und „Laut vorlesen“ in Edge,
  - §6 Rulings (aus dem Ledger, mindestens das zum Kopfknopf), §7 Unschärfen (etwa: Ordnungszahl „Phase 5.“ trennt
    keinen Satz; Stimmenqualität hängt vom Gerät ab), §8 Fragen an Jens — mindestens: Vor dem Deploy zieht das
    Domains-Projekt die Datenschutzerklärung nach (neuer Schlüssel `orrery.doku.farbschema.v1`, Sprachausgabe nur mit
    lokalen Stimmen, kein Text an fremde Server); Freigabe für Fast-Forward nach `master` und Übernahme nach
    `finsternisse`.

- [ ] **Schritt 8: Gesamtprüfung** — `npm run lint`, `npx tsc -b --noEmit`, `npm test`, `npm run build`; Ausgaben ins
  Protokoll §3. Wort- und Baumprüfung laut lokaler Projektanleitung.

- [ ] **Schritt 9: Commit**

```bash
git add docs/doku-farbschema-abnahme.md
git commit -m "Abnahme: Farbschema und Vorlesen der Doku-Seiten"
```

### Task 6: Übernahme nach `finsternisse` samt Ereignisseite

Erst nach Jens' Ja zu §8 des Protokolls (Fast-Forward und Übernahme).

**Dateien:**
- Ändern (Konfliktlösung): `scripts/doku-vorlage.ts`, `scripts/doku-vorlage.test.ts`
- Ändern: `scripts/ereignisse-bauen.ts`, `scripts/ereignisse-bauen.test.ts`, `docs/doku-farbschema-abnahme.md`

**Schnittstellen:**
- Verwendet: `farbschemaKopf`, `farbschemaKnopf`, `FARBSCHEMA_SKRIPT`, `FARBSCHEMA_CSS` (doku-farbschema.ts);
  `vorlesenKnopf`, `vorlesenLeiste`, `VORLESEN_SKRIPT`, `VORLESEN_CSS` (doku-vorlesen.ts). Auf `finsternisse` gibt es
  zusätzlich `seitenKopf(k: KopfDaten)`, `fussZeile(sprache)`, `sprachwahlLinks(sprache, datei)`, `sprachLabel(sprache)`
  und `ereignisSeite(sprache)` mit `EREIGNISSE_CSS = \`${DOKU_CSS}…\``.

**Ruling (im Ledger):** Übernahme per `git merge master` in `finsternisse` statt Cherry-Pick — so bleibt `master`
Vorfahre von `finsternisse`, und der spätere Abschluss der Finsternisse ist wieder ein Fast-Forward.

- [ ] **Schritt 1 (Controller): Fast-Forward** — `git switch master && git merge --ff-only doku-farbschema &&
  git branch -d doku-farbschema`. Kein Push.

- [ ] **Schritt 2: Zusammenführen** — `git switch finsternisse`, dann `git merge master --no-commit`. Erwartete Konflikte
  in `scripts/doku-vorlage.ts` (und evtl. dem Test). Auflösung:
  - `seitenKopf()`: deren Zeile `<meta name="theme-color" content="#0f172a">` durch `${farbschemaKopf()}` ersetzen —
    gilt so für Making-of und Ereignisseite, Kopfskript steht vor dem Stylesheet.
  - `seite()`: Fassung von `finsternisse` (mit `seitenKopf`, `sprachwahlLinks`, `fussZeile`) behalten und darin den
    Behälter `.kopf-rechts` mit `${farbschemaKnopf(d.sprache)}`, `${vorlesenKnopf(d.sprache)}` und der Sprachwahl,
    `${FARBSCHEMA_SKRIPT}` nach der Fußzeile sowie `${vorlesenLeiste(d.sprache)}${VORLESEN_SKRIPT}` nach dem
    Navigationsskript einsetzen.
  - `fussZeile(sprache)`: den Hinweis `<p class="fuss-hinweis">…</p>` aus Task 5 dort ergänzen (gilt dann auch für die
    Ereignisseite); `leseansicht` in deren Wörterbuch.
  - `NOSCRIPT_STIL` wie auf `finsternisse` (enthält den Navigations-Fix schon).
  - `DOKU_CSS`: `${FARBSCHEMA_CSS}` am Anfang, Kopfknopf-CSS hinter `.sprachwahl [aria-current]`, `${VORLESEN_CSS}` am
    Ende.
  - Tests: beide Seiten behalten.
  Danach `npx vitest run scripts/doku-vorlage.test.ts scripts/doku-farbschema.test.ts scripts/doku-vorlesen.test.ts
  scripts/doku-bauen.test.ts scripts/ereignisse-bauen.test.ts` grün, dann Merge-Commit mit Text aus Datei
  (`git commit -F`): „master übernehmen: Farbschema und Vorlesen der Doku-Seiten“.

- [ ] **Schritt 3: Fehlschlagender Test für die Ereignisseite** — in `scripts/ereignisse-bauen.test.ts` (Importe
  `JSDOM` aus `jsdom` ergänzen):

```ts
describe('Farbschema und Vorlesen auf der Ereignisseite', () => {
  it('Kopfzeile mit beiden Knöpfen, Leiste und Kopfskript in beiden Sprachen', () => {
    for (const sprache of ['de', 'en'] as const) {
      const h = ereignisSeite(sprache);
      const kopf = h.slice(h.indexOf('<header'), h.indexOf('</header>'));
      expect(kopf).toContain('id="farbschema-knopf"');
      expect(kopf).toContain('id="vorlesen-knopf"');
      expect(h).toContain('id="vorlesen-leiste"');
      expect(h.indexOf('orrery.doku.farbschema.v1')).toBeLessThan(h.indexOf('rel="stylesheet"'));
      expect(h).toContain('<p class="fuss-hinweis">');
    }
  });
  it('Vorlesen beginnt beim Titel der Seite', async () => {
    const gesprochen: string[] = [];
    const stimme = { name: 'Test', lang: 'de-DE', localService: true, default: true };
    const w = new JSDOM(ereignisSeite('de'), {
      runScripts: 'dangerously',
      url: 'https://orrery3d.de/ereignisse/de/',
      beforeParse(f) {
        Object.assign(f, {
          speechSynthesis: {
            getVoices: () => [stimme],
            speak: (u: { text: string }) => gesprochen.push(u.text),
            cancel: () => {},
            addEventListener: () => {},
          },
          SpeechSynthesisUtterance: function (this: { text: string }, text: string) {
            this.text = text;
          },
        });
      },
    }).window;
    (w.document.getElementById('vorlesen-knopf') as HTMLElement).click();
    await new Promise((fertig) => setTimeout(fertig, 5));
    expect(gesprochen[0]).toBe(w.document.querySelector('h1')!.textContent);
  });
});
```

- [ ] **Schritt 4: Umsetzen** — in `ereignisSeite()` die Zeile mit `<nav class="sprachwahl" …>` in
  `<div class="kopf-rechts">${farbschemaKnopf(sprache)}\n${vorlesenKnopf(sprache)}\n<nav …>…</nav></div>` setzen und vor
  `</body>` `${FARBSCHEMA_SKRIPT}\n${vorlesenLeiste(sprache)}\n${VORLESEN_SKRIPT}` einfügen; Importe aus
  `./doku-farbschema.ts` und `./doku-vorlesen.ts`. `EREIGNISSE_CSS` erbt alles über `DOKU_CSS`; Farben dort nutzen
  bereits die Variablen.

- [ ] **Schritt 5: Prüfen** — Tests aus Schritt 2 und 3 grün; `npm run lint`, `npx tsc -b --noEmit`, `npm test`,
  `npm run build`. Kurze Sichtprüfung der Ereignisseite (`http://localhost:4173/Orrery/ereignisse/de/` in der Vorschau):
  Grund (15, 23, 42) bei System dunkel, (248, 250, 252) bei System hell; Kopfzeile ≤ 60 px; Schalter dreimal wie in
  Task 5 Zeile 5. Vorschau beenden, Port prüfen, Reste löschen.

- [ ] **Schritt 6: Protokoll nachtragen und Commit** — in `docs/doku-farbschema-abnahme.md` §2 den Merge und diesen
  Commit, §4 die Messwerte der Ereignisseite, §7: auf der Ereignisseite liest das Vorlesen je Eintrag auch den Linktext
  zum Ansehen in Orrery mit.

```bash
git add scripts/ereignisse-bauen.ts scripts/ereignisse-bauen.test.ts docs/doku-farbschema-abnahme.md
git commit -m "Ereignisseite: Farbschema und Vorlesen"
```

Danach bleibt `finsternisse` unverändert ungepusht und ungemergt (Jens: „noch nicht nach master!“).
