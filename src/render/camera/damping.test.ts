import { describe, it, expect } from 'vitest';
import { smoothDamp, smoothDampVec3 } from './damping';

describe('smoothDamp', () => {
  it('nähert sich dem Ziel monoton ohne zu überschwingen', () => {
    const v = { wert: 0 };
    let ist = 0;
    let vorher = -1;
    for (let i = 0; i < 200; i++) {
      ist = smoothDamp(ist, 100, v, 0.3, 1 / 60);
      expect(ist).toBeGreaterThanOrEqual(vorher);
      expect(ist).toBeLessThanOrEqual(100.0001); // kein Überschwingen
      vorher = ist;
    }
    expect(ist).toBeCloseTo(100, 2);
  });

  it('bleibt stehen, wenn Ist und Ziel gleich sind', () => {
    const v = { wert: 0 };
    expect(smoothDamp(42, 42, v, 0.3, 1 / 60)).toBeCloseTo(42, 9);
    expect(v.wert).toBeCloseTo(0, 9);
  });

  it('folgt einem größeren Zeitschritt ohne zu explodieren', () => {
    const v = { wert: 0 };
    const ist = smoothDamp(0, 100, v, 0.3, 2.0); // Tab war lange inaktiv
    expect(Number.isFinite(ist)).toBe(true);
    expect(ist).toBeLessThanOrEqual(100.0001);
    expect(ist).toBeGreaterThan(90);
  });

  it('ist mit kleinerer Zeitkonstante schneller', () => {
    const schnell = { wert: 0 }, langsam = { wert: 0 };
    let a = 0, b = 0;
    for (let i = 0; i < 30; i++) {
      a = smoothDamp(a, 100, schnell, 0.1, 1 / 60);
      b = smoothDamp(b, 100, langsam, 1.0, 1 / 60);
    }
    expect(a).toBeGreaterThan(b);
  });
});

describe('smoothDampVec3', () => {
  it('dämpft alle drei Achsen gemeinsam', () => {
    const v = { x: 0, y: 0, z: 0 };
    let ist = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 300; i++) {
      ist = smoothDampVec3(ist, { x: 10, y: -20, z: 5 }, v, 0.3, 1 / 60);
    }
    expect(ist.x).toBeCloseTo(10, 2);
    expect(ist.y).toBeCloseTo(-20, 2);
    expect(ist.z).toBeCloseTo(5, 2);
  });
});
