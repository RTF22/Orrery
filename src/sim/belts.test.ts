import { describe, it, expect } from 'vitest';
import {
  generateBelt,
  beltCount,
  kirkwoodDensity,
  HAUPTGUERTEL,
  KUIPERGUERTEL,
  GM_SONNE_AE3_TAG2,
} from './belts';

const GRAD = Math.PI / 180;
const ZWEI_PI = 2 * Math.PI;

function mittelwert(werte: Float32Array): number {
  let summe = 0;
  for (const w of werte) summe += w;
  return summe / werte.length;
}

function anzahlIm(werte: Float32Array, min: number, max: number): number {
  let n = 0;
  for (const w of werte) if (w >= min && w < max) n += 1;
  return n;
}

describe('generateBelt: Determinismus', () => {
  it('liefert bei gleichem Keim und gleicher Anzahl identische Arrays', () => {
    const a = generateBelt(HAUPTGUERTEL, 500, 42);
    const b = generateBelt(HAUPTGUERTEL, 500, 42);
    expect(a.count).toBe(500);
    expect(a.a).toEqual(b.a);
    expect(a.e).toEqual(b.e);
    expect(a.inc).toEqual(b.inc);
    expect(a.node).toEqual(b.node);
    expect(a.peri).toEqual(b.peri);
    expect(a.m0).toEqual(b.m0);
    expect(a.n).toEqual(b.n);
  });

  it('liefert bei anderem Keim andere Werte', () => {
    const a = generateBelt(HAUPTGUERTEL, 500, 42);
    const b = generateBelt(HAUPTGUERTEL, 500, 43);
    expect(a.a).not.toEqual(b.a);
  });

  it('liefert Float32Arrays in der verlangten Länge', () => {
    const g = generateBelt(HAUPTGUERTEL, 123, 1);
    for (const feld of [g.a, g.e, g.inc, g.node, g.peri, g.m0, g.n]) {
      expect(feld).toBeInstanceOf(Float32Array);
      expect(feld.length).toBe(123);
    }
  });

  it('kommt mit null Teilchen aus', () => {
    const g = generateBelt(HAUPTGUERTEL, 0, 1);
    expect(g.count).toBe(0);
    expect(g.a.length).toBe(0);
  });
});

describe('generateBelt: Hauptgürtel', () => {
  const g = generateBelt(HAUPTGUERTEL, 5000, 7);

  it('hält alle Elemente in ihren Bereichen', () => {
    for (let k = 0; k < g.count; k++) {
      expect(g.a[k]).toBeGreaterThanOrEqual(2.1);
      expect(g.a[k]).toBeLessThanOrEqual(3.3);
      expect(g.e[k]).toBeGreaterThanOrEqual(0);
      expect(g.e[k]).toBeLessThanOrEqual(0.35);
      expect(g.inc[k]).toBeGreaterThanOrEqual(0);
      expect(g.inc[k]).toBeLessThanOrEqual(30 * GRAD);
      for (const winkel of [g.node[k]!, g.peri[k]!, g.m0[k]!]) {
        expect(winkel).toBeGreaterThanOrEqual(0);
        expect(winkel).toBeLessThan(ZWEI_PI);
      }
    }
  });

  it('setzt n nach dem dritten Keplerschen Gesetz', () => {
    // Gaußsche Gravitationskonstante k = 0,01720209895; GM = k²
    expect(GM_SONNE_AE3_TAG2).toBeCloseTo(2.9591220828e-4, 12);
    for (let k = 0; k < g.count; k++) {
      const a = g.a[k]!;
      const erwartet = Math.sqrt(GM_SONNE_AE3_TAG2 / (a * a * a));
      // Float32-Rundung: relative Abweichung deutlich unter 1e-6
      expect(Math.abs(g.n[k]! - erwartet) / erwartet).toBeLessThan(1e-6);
    }
  });

  it('trifft die mittlere Exzentrizität und Inklination', () => {
    expect(mittelwert(g.e)).toBeGreaterThanOrEqual(0.10);
    expect(mittelwert(g.e)).toBeLessThanOrEqual(0.17);
    const iGrad = mittelwert(g.inc) / GRAD;
    expect(iGrad).toBeGreaterThanOrEqual(5);
    expect(iGrad).toBeLessThanOrEqual(10);
  });

  it('zeigt die Kirkwood-Lücke bei 3:1 (2,502 AE)', () => {
    const gross = generateBelt(HAUPTGUERTEL, 20_000, 11);
    const inLuecke = anzahlIm(gross.a, 2.492, 2.512);
    const links = anzahlIm(gross.a, 2.45, 2.47);
    const rechts = anzahlIm(gross.a, 2.54, 2.56);
    const nachbarn = (links + rechts) / 2;
    expect(nachbarn).toBeGreaterThan(100); // sonst wäre der Vergleich wertlos
    expect(inLuecke).toBeLessThan(0.25 * nachbarn);
  });
});

describe('kirkwoodDensity', () => {
  it('bricht an den Resonanzen auf 10 Prozent ein', () => {
    for (const aRes of [2.0656, 2.5019, 2.8254, 2.9587, 3.2787]) {
      expect(kirkwoodDensity(aRes)).toBeLessThan(0.11);
    }
  });

  it('ist zwischen den Resonanzen nahezu eins', () => {
    for (const a of [2.3, 2.65, 2.9, 3.1]) {
      expect(kirkwoodDensity(a)).toBeGreaterThan(0.99);
    }
  });
});

describe('generateBelt: Kuipergürtel', () => {
  const g = generateBelt(KUIPERGUERTEL, 5000, 3);

  it('hält die Halbachse zwischen 38 und 49 AE', () => {
    for (let k = 0; k < g.count; k++) {
      expect(g.a[k]).toBeGreaterThanOrEqual(38);
      expect(g.a[k]).toBeLessThanOrEqual(49);
    }
  });

  it('deckelt Exzentrizität und Inklination', () => {
    for (let k = 0; k < g.count; k++) {
      expect(g.e[k]).toBeLessThanOrEqual(0.35);
      expect(g.inc[k]).toBeLessThanOrEqual(35 * GRAD);
    }
  });

  it('enthält Plutinos als Häufung bei 39,4 AE', () => {
    // Fenster von ±0,3 AE um die 3:2-Resonanz gegen ein gleich breites
    // Fenster im klassischen Gürtel: Die Häufung muss deutlich hervortreten.
    const plutinos = anzahlIm(g.a, 39.1, 39.7);
    const klassisch = anzahlIm(g.a, 43.0, 43.6);
    expect(plutinos).toBeGreaterThan(1.5 * klassisch);
  });
});

describe('beltCount', () => {
  it('liefert die Teilchenzahl je Qualitätsstufe', () => {
    expect(beltCount('low')).toBe(0);
    expect(beltCount('medium')).toBe(10_000);
    expect(beltCount('high')).toBe(50_000);
    expect(beltCount('auto')).toBe(10_000);
  });
});
