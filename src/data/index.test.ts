import { describe, it, expect } from 'vitest';
import { bodies, bodyIndex, getBody } from './index';
import { poleVector, axialTiltDeg } from '../sim/frames';

describe('Körperkatalog', () => {
  it('enthält Sonne, acht Planeten und den Erdmond', () => {
    expect(bodies).toHaveLength(10);
    expect(bodies.filter((b) => b.kind === 'planet')).toHaveLength(8);
    expect(bodies.filter((b) => b.kind === 'star')).toHaveLength(1);
    expect(bodies.filter((b) => b.kind === 'moon')).toHaveLength(1);
  });

  it('vergibt eindeutige Bezeichner', () => {
    const ids = bodies.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('löst alle Elternverweise auf', () => {
    for (const b of bodies) {
      if (b.parent !== null) expect(bodyIndex[b.parent]).toBeDefined();
    }
  });

  it('gibt nur der Sonne keine Bahn', () => {
    for (const b of bodies) {
      if (b.id === 'sun') expect(b.orbit).toBeNull();
      else expect(b.orbit).not.toBeNull();
    }
  });

  // Dieser Test ist der eigentliche Zweck: er fängt Zahlendreher beim
  // Übertragen der JPL-Tabelle, bevor sie sich als Bahnfehler tarnen.
  it('hält die bekannten großen Halbachsen ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.38710, venus: 0.72333, earth: 1.00000, mars: 1.52371,
      jupiter: 5.20289, saturn: 9.53668, uranus: 19.18916, neptune: 30.06992,
    };
    for (const [id, a] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.a).toBeCloseTo(a, 4);
    }
  });

  it('hält die bekannten Exzentrizitäten ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.20564, venus: 0.00677, earth: 0.01671, mars: 0.09339,
      jupiter: 0.04839, saturn: 0.05386, uranus: 0.04726, neptune: 0.00859,
    };
    for (const [id, e] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.e).toBeCloseTo(e, 4);
    }
  });

  it('liefert plausible physikalische Daten', () => {
    for (const b of bodies) {
      expect(b.physical.radiusKm).toBeGreaterThan(0);
      expect(b.physical.massKg).toBeGreaterThan(0);
      expect(Math.abs(b.physical.rotationPeriodH)).toBeGreaterThan(0);
      // Die aus dem Pol abgeleitete Achsneigung ist ein Winkel und liegt
      // damit immer zwischen 0° und 180°; die eigentliche Prüfung der
      // Pollagen — gegen die bekannte, veröffentlichte Neigung — leistet
      // frames.test.ts.
      const neigung = axialTiltDeg(poleVector(b.physical.pole.raDeg, b.physical.pole.decDeg));
      expect(neigung).toBeGreaterThanOrEqual(0);
      expect(neigung).toBeLessThanOrEqual(180);
    }
    // Die Sonne ist der größte Körper im Katalog.
    const maxRadius = Math.max(...bodies.map((b) => b.physical.radiusKm));
    expect(getBody('sun').physical.radiusKm).toBe(maxRadius);
  });
});
