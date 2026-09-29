import { describe, it, expect } from 'vitest';
import fixture from './__fixtures__/horizons.json';
import {
  geozentrischeRichtung, richtungZuWinkeln, ekliptikaleLaengeGrad, naechsteOpposition, OPPOSITION_SUCHE_TAGE,
} from './geozentrisch';
import { bodyIndex } from '../data/index';

interface Punkt { id: string; jd: number; x: number; y: number; z: number }
const punkte = fixture.punkte as Punkt[];
const GRAD = Math.PI / 180;

/** Toleranzen in Grad: gemessener Höchstwert der Planung gegen die Horizons-Stichtage mit Reserve. */
const TOLERANZ_GRAD: Record<string, number> = {
  mercury: 0.02, venus: 0.02, mars: 0.02, jupiter: 0.15, saturn: 0.25, uranus: 0.05, neptune: 0.05,
};

describe('geozentrischeRichtung', () => {
  it('trifft die Richtung aus JPL Horizons an allen fünf Stichtagen', () => {
    for (const p of punkte) {
      const toleranz = TOLERANZ_GRAD[p.id];
      if (toleranz === undefined) continue;
      const erde = punkte.find((q) => q.id === 'earth' && q.jd === p.jd)!;
      const ref = { x: p.x - erde.x, y: p.y - erde.y, z: p.z - erde.z };
      const l = Math.hypot(ref.x, ref.y, ref.z);
      const v = geozentrischeRichtung(p.id, bodyIndex, p.jd);
      const cos = (v.x * ref.x + v.y * ref.y + v.z * ref.z) / l;
      const winkel = Math.acos(Math.min(1, cos)) / GRAD;
      expect(winkel, `${p.id} bei JD ${p.jd}`).toBeLessThan(toleranz);
    }
  });

  it('liefert einen Einheitsvektor', () => {
    const v = geozentrischeRichtung('jupiter', bodyIndex, 2461314.5);
    expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1, 12);
  });
});

describe('richtungZuWinkeln und ekliptikaleLaengeGrad', () => {
  it('zählt yaw und pitch wie blickVektor', () => {
    const w = richtungZuWinkeln({ x: 0, y: Math.cos(0.3), z: Math.sin(0.3) });
    expect(w.yaw).toBeCloseTo(Math.PI / 2, 12);
    expect(w.pitch).toBeCloseTo(0.3, 12);
  });

  it('begrenzt pitch knapp unter dem Pol', () => {
    expect(richtungZuWinkeln({ x: 0, y: 0, z: 1 }).pitch).toBeCloseTo(Math.PI / 2 - 0.01, 12);
  });

  it('gibt die Länge zwischen 0 und 360 Grad', () => {
    expect(ekliptikaleLaengeGrad({ x: 0, y: -1, z: 0 })).toBeCloseTo(270, 9);
  });
});

describe('Rückläufigkeit des Mars 2027', () => {
  const laenge = (jd: number) => ekliptikaleLaengeGrad(geozentrischeRichtung('mars', bodyIndex, jd));

  it('läuft vor dem Stillstand rechtläufig, um die Opposition rückläufig', () => {
    expect(laenge(2461456 - 45)).toBeGreaterThan(laenge(2461456 - 80));
    expect(laenge(2461456 - 20)).toBeGreaterThan(laenge(2461456));
    expect(laenge(2461456)).toBeGreaterThan(laenge(2461456 + 20));
    expect(laenge(2461456 + 80)).toBeGreaterThan(laenge(2461456 + 50));
  });
});

describe('naechsteOpposition', () => {
  it('findet die Mars-Opposition vom 19.02.2027 auf einen Tag genau', () => {
    const jd = naechsteOpposition('mars', bodyIndex, 2461314.5);
    expect(jd).not.toBeNull();
    expect(Math.abs(jd! - 2461456.0)).toBeLessThan(1);
  });

  it('findet danach die Opposition 2029', () => {
    const jd = naechsteOpposition('mars', bodyIndex, 2461460);
    expect(Math.abs(jd! - 2462221)).toBeLessThan(2);
  });

  it('findet Jupiter im Februar 2027 und Saturn im Oktober 2026', () => {
    expect(Math.abs(naechsteOpposition('jupiter', bodyIndex, 2461314.5)! - 2461447.5)).toBeLessThan(2);
    expect(Math.abs(naechsteOpposition('saturn', bodyIndex, 2461300)! - 2461318.5)).toBeLessThan(2);
  });

  it('gibt für innere Planeten null zurück', () => {
    expect(naechsteOpposition('venus', bodyIndex, 2461314.5)).toBeNull();
  });

  it('sucht höchstens OPPOSITION_SUCHE_TAGE weit', () => {
    expect(OPPOSITION_SUCHE_TAGE).toBe(800);
  });
});
