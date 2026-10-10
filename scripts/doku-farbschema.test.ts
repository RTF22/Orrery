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
