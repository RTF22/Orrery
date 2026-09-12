import { describe, it, expect } from 'vitest';
import { createRng, hashSeed, pickInRange } from './random';

describe('createRng', () => {
  it('liefert bei gleichem Keim dieselbe Folge', () => {
    const a = createRng(12345);
    const b = createRng(12345);
    const folgeA = Array.from({ length: 20 }, () => a());
    const folgeB = Array.from({ length: 20 }, () => b());
    expect(folgeA).toEqual(folgeB);
  });

  it('liefert bei verschiedenen Keimen verschiedene Folgen', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toBe(b());
  });

  it('bleibt im Bereich null bis eins', () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const w = rng();
      expect(w).toBeGreaterThanOrEqual(0);
      expect(w).toBeLessThan(1);
    }
  });

  it('streut halbwegs gleichmäßig', () => {
    const rng = createRng(99);
    const faecher = [0, 0, 0, 0];
    for (let i = 0; i < 4000; i++) faecher[Math.floor(rng() * 4)]! += 1;
    // Bei Gleichverteilung sind 1000 je Fach zu erwarten; 20 Prozent
    // Spielraum fangen die statistische Schwankung ab, schlagen aber bei
    // einem kaputten Generator (etwa konstante Rückgabe) sofort an.
    for (const anzahl of faecher) {
      expect(anzahl).toBeGreaterThan(800);
      expect(anzahl).toBeLessThan(1200);
    }
  });
});

describe('hashSeed', () => {
  it('ist reproduzierbar', () => {
    expect(hashSeed(42, 7)).toBe(hashSeed(42, 7));
  });

  it('trennt aufeinanderfolgende Nummern deutlich', () => {
    // Ohne Durchmischung lägen benachbarte Keime dicht beieinander und die
    // ersten gezogenen Werte wären fast gleich — die Szenen sähen dann
    // trotz Variation wie Wiederholungen aus.
    const a = createRng(hashSeed(42, 7))();
    const b = createRng(hashSeed(42, 8))();
    expect(Math.abs(a - b)).toBeGreaterThan(0.05);
  });
});

describe('pickInRange', () => {
  it('bleibt in den Grenzen', () => {
    const rng = createRng(3);
    for (let i = 0; i < 500; i++) {
      const w = pickInRange(rng, [-5, 12]);
      expect(w).toBeGreaterThanOrEqual(-5);
      expect(w).toBeLessThanOrEqual(12);
    }
  });

  it('liefert bei leerem Bereich genau den Wert', () => {
    expect(pickInRange(createRng(1), [4, 4])).toBe(4);
  });
});
