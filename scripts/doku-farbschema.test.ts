import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { seite } from './doku-vorlage.ts';
import {
  FARBSCHEMA_CSS, FARBSCHEMA_SCHLUESSEL, PALETTE_DUNKEL, PALETTE_HELL, farbschemaKopf,
} from './doku-farbschema.ts';

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
