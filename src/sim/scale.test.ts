import { describe, it, expect } from 'vitest';
import {
  compressDistance, scaledRadius, scaledPositionAt, isSatellite, SCALE_PRESETS,
} from './scale';
import { positionAt, AU_KM } from './orbit';
import { bodyIndex, getBody } from '../data/index';
import { J2000 } from './time';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

describe('compressDistance', () => {
  it('ist bei k = 1 die Identität', () => {
    for (const r of [0.1, 1, 5, 30].map((au) => au * AU_KM)) {
      expect(compressDistance(r, 1)).toBeCloseTo(r, 3);
    }
  });

  it('hält 1 AE für jedes k fest', () => {
    for (const k of [0.35, 0.5, 0.6, 0.8, 1.0]) {
      expect(compressDistance(AU_KM, k)).toBeCloseTo(AU_KM, 3);
    }
  });

  it('ist streng monoton steigend', () => {
    for (const k of [0.35, 0.6, 1.0]) {
      let vorher = -1;
      for (let au = 0.2; au <= 35; au += 0.2) {
        const r = compressDistance(au * AU_KM, k);
        expect(r).toBeGreaterThan(vorher);
        vorher = r;
      }
    }
  });

  it('staucht außen stark und innen kaum', () => {
    const k = 0.4;
    const innen = compressDistance(0.39 * AU_KM, k) / (0.39 * AU_KM);
    const aussen = compressDistance(30 * AU_KM, k) / (30 * AU_KM);
    expect(aussen).toBeLessThan(innen);
    expect(aussen).toBeLessThan(0.35);
  });

  it('bleibt bei Abstand null definiert', () => {
    expect(compressDistance(0, 0.4)).toBe(0);
  });
});

describe('isSatellite', () => {
  it('gilt für den Mond, der die Erde umkreist', () => {
    expect(isSatellite(getBody('moon'))).toBe(true);
  });

  it('gilt nicht für Planeten, die die Sonne umkreisen', () => {
    expect(isSatellite(getBody('earth'))).toBe(false);
    expect(isSatellite(getBody('neptune'))).toBe(false);
  });

  it('gilt nicht für die Sonne selbst', () => {
    expect(isSatellite(getBody('sun'))).toBe(false);
  });
});

describe('scaledRadius', () => {
  it('gibt bei sizeScale 1 den echten Radius zurück', () => {
    const s = { sizeScale: 1, distanceExponent: 1, sunDamping: 1 };
    expect(scaledRadius(getBody('earth'), s)).toBeCloseTo(6371, 0);
  });

  it('hält die Größenverhältnisse zwischen Planeten konstant', () => {
    const a = { sizeScale: 1, distanceExponent: 1, sunDamping: 1 };
    const b = { sizeScale: 200, distanceExponent: 1, sunDamping: 1 };
    const verhaeltnisA = scaledRadius(getBody('jupiter'), a) / scaledRadius(getBody('earth'), a);
    const verhaeltnisB = scaledRadius(getBody('jupiter'), b) / scaledRadius(getBody('earth'), b);
    expect(verhaeltnisB).toBeCloseTo(verhaeltnisA, 6);
  });

  it('dämpft nur die Sonne', () => {
    const s = { sizeScale: 50, distanceExponent: 1, sunDamping: 0.2 };
    const sonnenradius = getBody('sun').physical.radiusKm;
    const erdradius = getBody('earth').physical.radiusKm;
    expect(scaledRadius(getBody('sun'), s)).toBeCloseTo(sonnenradius * 50 * 0.2, 0);
    expect(scaledRadius(getBody('earth'), s)).toBeCloseTo(erdradius * 50, 0);
  });
});

describe('scaledPositionAt', () => {
  it('ist bei realistischem Preset die unveränderte Simulation', () => {
    const echt = positionAt('mars', bodyIndex, J2000);
    const skaliert = scaledPositionAt('mars', bodyIndex, J2000, SCALE_PRESETS.realistisch);
    expect(skaliert.x).toBeCloseTo(echt.x, 3);
    expect(skaliert.y).toBeCloseTo(echt.y, 3);
    expect(skaliert.z).toBeCloseTo(echt.z, 3);
  });

  it('behält die Richtung bei und ändert nur den Betrag', () => {
    const echt = positionAt('neptune', bodyIndex, J2000);
    const s = SCALE_PRESETS.kompakt;
    const skaliert = scaledPositionAt('neptune', bodyIndex, J2000, s);
    const cos = (echt.x * skaliert.x + echt.y * skaliert.y + echt.z * skaliert.z)
      / (betrag(echt) * betrag(skaliert));
    expect(cos).toBeCloseTo(1, 9);
    expect(betrag(skaliert)).toBeLessThan(betrag(echt));
  });

  // Der eigentliche Zweck der hierarchischen Regel.
  it('hält den Mond bei jedem Preset sichtbar außerhalb der Erde', () => {
    for (const [name, s] of Object.entries(SCALE_PRESETS)) {
      const mond = scaledPositionAt('moon', bodyIndex, J2000, s);
      const erde = scaledPositionAt('earth', bodyIndex, J2000, s);
      const abstand = betrag({ x: mond.x - erde.x, y: mond.y - erde.y, z: mond.z - erde.z });
      const erdradius = scaledRadius(getBody('earth'), s);
      expect(abstand, `Preset ${name}`).toBeGreaterThan(erdradius * 2);
    }
  });

  it('hält das Verhältnis Erdradius zu Mondbahn konstant', () => {
    // Weil Mondabstände mit sizeScale skalieren, bleibt die lokale
    // Geometrie um die Erde bei jedem Preset dieselbe.
    const verhaeltnis = (s: typeof SCALE_PRESETS.realistisch) => {
      const mond = scaledPositionAt('moon', bodyIndex, J2000, s);
      const erde = scaledPositionAt('earth', bodyIndex, J2000, s);
      const d = betrag({ x: mond.x - erde.x, y: mond.y - erde.y, z: mond.z - erde.z });
      return d / scaledRadius(getBody('earth'), s);
    };
    expect(verhaeltnis(SCALE_PRESETS.kompakt))
      .toBeCloseTo(verhaeltnis(SCALE_PRESETS.realistisch), 3);
  });
});
