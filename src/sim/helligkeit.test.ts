import { describe, it, expect } from 'vitest';
import { lambertPhase, scheinbareHelligkeit, M_SONNE } from './helligkeit';
import { bodyIndex } from '../data/index';

/** 19.02.2027 12 h UT, Mars-Opposition im Modell (Plan geozentrische Sicht, Messwerte). */
const JD_MARS = 2461456.0;
/** 10.02.2027, Jupiter-Opposition im Modell. */
const JD_JUPITER = 2461447.5;

describe('lambertPhase', () => {
  it('ist 1 bei voller, 1/π bei halber und 0 bei fehlender Beleuchtung', () => {
    expect(lambertPhase(0)).toBeCloseTo(1, 12);
    expect(lambertPhase(Math.PI / 2)).toBeCloseTo(1 / Math.PI, 12);
    expect(lambertPhase(Math.PI)).toBeCloseTo(0, 12);
  });
});

describe('scheinbareHelligkeit', () => {
  it('liefert für Sonne und Erde null', () => {
    expect(scheinbareHelligkeit('sun', bodyIndex, JD_MARS)).toBeNull();
    expect(scheinbareHelligkeit('earth', bodyIndex, JD_MARS)).toBeNull();
    expect(M_SONNE).toBe(-26.74);
  });

  it('trifft Mars und Jupiter an ihrer Opposition auf eine halbe Größenklasse', () => {
    // Überschlag im Plan: Mars rund −1,3, Jupiter rund −2,7 (beobachtet rund −1,2 und −2,6).
    const mars = scheinbareHelligkeit('mars', bodyIndex, JD_MARS)!;
    const jupiter = scheinbareHelligkeit('jupiter', bodyIndex, JD_JUPITER)!;
    expect(mars).toBeGreaterThan(-1.8);
    expect(mars).toBeLessThan(-0.8);
    expect(jupiter).toBeGreaterThan(-3.2);
    expect(jupiter).toBeLessThan(-2.2);
  });

  it('ordnet die Planeten wie am Himmel: Venus vor Jupiter vor Saturn, Neptun am schwächsten', () => {
    const m = (id: string) => scheinbareHelligkeit(id, bodyIndex, JD_MARS)!;
    expect(m('venus')).toBeLessThan(m('jupiter'));
    expect(m('jupiter')).toBeLessThan(m('saturn'));
    for (const id of ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus']) {
      expect(m(id), id).toBeLessThan(m('neptune'));
    }
    expect(m('neptune')).toBeGreaterThan(7);
    expect(m('neptune')).toBeLessThan(8.5);
  });

  it('lässt die galileischen Monde und Titan unter die Mondgrenze fallen, Triton nicht', () => {
    for (const id of ['io', 'europa', 'ganymede', 'callisto']) {
      expect(scheinbareHelligkeit(id, bodyIndex, JD_JUPITER)!, id).toBeLessThan(6.5);
    }
    expect(scheinbareHelligkeit('titan', bodyIndex, JD_MARS)!).toBeLessThan(9);
    expect(scheinbareHelligkeit('triton', bodyIndex, JD_MARS)!).toBeGreaterThan(9);
  });

  it('liefert für jeden Katalogkörper eine Zahl ohne NaN, auch Körper ohne Albedo', () => {
    for (const id of Object.keys(bodyIndex)) {
      const m = scheinbareHelligkeit(id, bodyIndex, JD_MARS);
      if (m === null) continue;
      expect(Number.isNaN(m), id).toBe(false);
    }
  });
});
