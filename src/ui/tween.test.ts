import { describe, it, expect } from 'vitest';
import { easeInOutCubic, lerpScale } from './tween';
import { SCALE_PRESETS } from '../sim/scale';

describe('easeInOutCubic', () => {
  it('beginnt bei 0 und endet bei 1', () => {
    expect(easeInOutCubic(0)).toBeCloseTo(0, 9);
    expect(easeInOutCubic(1)).toBeCloseTo(1, 9);
  });

  it('ist in der Mitte bei 0.5 und symmetrisch', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 9);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1, 9);
  });

  it('steigt monoton', () => {
    let vorher = -1;
    for (let t = 0; t <= 1; t += 0.01) {
      const w = easeInOutCubic(t);
      expect(w).toBeGreaterThanOrEqual(vorher);
      vorher = w;
    }
  });
});

describe('lerpScale', () => {
  it('liefert an den Enden exakt die Ausgangswerte', () => {
    const a = SCALE_PRESETS.realistisch, b = SCALE_PRESETS.kompakt;
    expect(lerpScale(a, b, 0)).toEqual(a);
    expect(lerpScale(a, b, 1)).toEqual(b);
  });

  it('interpoliert sizeScale logarithmisch', () => {
    // Linear wäre die Mitte zwischen 1 und 200 bei 100.5 — optisch ein Sprung.
    // Geometrisch liegt sie bei rund 14, was gleichmaessig wirkt.
    const mitte = lerpScale(
      { sizeScale: 1, distanceExponent: 1, sunDamping: 1 },
      { sizeScale: 200, distanceExponent: 1, sunDamping: 1 },
      0.5,
    );
    expect(mitte.sizeScale).toBeCloseTo(Math.sqrt(200), 3);
  });

  it('interpoliert den Exponenten linear', () => {
    const mitte = lerpScale(
      { sizeScale: 1, distanceExponent: 1.0, sunDamping: 1 },
      { sizeScale: 1, distanceExponent: 0.4, sunDamping: 1 },
      0.5,
    );
    expect(mitte.distanceExponent).toBeCloseTo(0.7, 9);
  });
});
