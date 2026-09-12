import { describe, it, expect } from 'vitest';
import { pickRadiusUnits, MIN_RADIUS_UNITS } from './bodies';
import { getBody } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { kmToUnits } from './units';

describe('pickRadiusUnits', () => {
  it('rechnet den skalierten Radius in Render-Einheiten um', () => {
    const s = SCALE_PRESETS.realistisch;
    expect(pickRadiusUnits(getBody('earth'), s)).toBeCloseTo(kmToUnits(6371), 6);
  });

  it('wächst mit sizeScale', () => {
    const klein = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.realistisch);
    const gross = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.kompakt);
    expect(gross).toBeGreaterThan(klein);
  });

  it('fällt nie unter die Mindestgröße', () => {
    // Sonst verschwände ein Körper bei winzigem sizeScale voellig aus der Geometrie.
    const winzig = { sizeScale: 1e-6, distanceExponent: 1, sunDamping: 1 };
    expect(pickRadiusUnits(getBody('moon'), winzig)).toBeGreaterThanOrEqual(MIN_RADIUS_UNITS);
  });

  it('hält die Sonne größer als jeden Planeten', () => {
    for (const s of Object.values(SCALE_PRESETS)) {
      expect(pickRadiusUnits(getBody('sun'), s))
        .toBeGreaterThan(pickRadiusUnits(getBody('jupiter'), s));
    }
  });
});
