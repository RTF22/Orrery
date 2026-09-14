import { describe, it, expect } from 'vitest';
import { positionAt, AU_KM, umlaufzeitTage } from './orbit';
import { bodyIndex, getBody } from '../data/index';
import { J2000 } from './time';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/** Bekannte siderische Umlaufzeiten in Tagen (Lehrbuchwerte). */
const PERIODEN_TAGE: Record<string, number> = {
  mercury: 87.969, venus: 224.701, earth: 365.256, mars: 686.980,
  jupiter: 4332.589, saturn: 10759.22, uranus: 30685.4, neptune: 60189,
};

describe('positionAt', () => {
  it('setzt die Sonne in den Ursprung', () => {
    const p = positionAt('sun', bodyIndex, J2000 + 1234.5);
    expect(betrag(p)).toBeCloseTo(0, 9);
  });

  it('hält die Erde zwischen Perihel und Aphel', () => {
    // Bekannte Werte: 0.98329 AE (Perihel) bis 1.01671 AE (Aphel).
    let min = Infinity;
    let max = -Infinity;
    for (let t = 0; t < 366; t += 1) {
      const r = betrag(positionAt('earth', bodyIndex, J2000 + t)) / AU_KM;
      min = Math.min(min, r);
      max = Math.max(max, r);
    }
    expect(min).toBeCloseTo(0.98329, 3);
    expect(max).toBeCloseTo(1.01671, 3);
  });

  it('kehrt nach einer siderischen Periode an dieselbe Stelle zurück', () => {
    // Prüft, dass LDot im Datensatz zur bekannten Umlaufzeit passt.
    for (const [id, periode] of Object.entries(PERIODEN_TAGE)) {
      const p0 = positionAt(id, bodyIndex, J2000);
      const p1 = positionAt(id, bodyIndex, J2000 + periode);
      const abstand = betrag({ x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z });
      const a = getBody(id).orbit!.a * AU_KM;
      expect(abstand / a).toBeLessThan(0.005);
    }
  });

  it('erfüllt das dritte Keplersche Gesetz', () => {
    // a^3 / T^2 muss für alle Planeten nahe 1 liegen (AE und Jahre).
    for (const id of Object.keys(PERIODEN_TAGE)) {
      const a = getBody(id).orbit!.a;
      const tJahre = PERIODEN_TAGE[id]! / 365.25;
      expect((a ** 3) / (tJahre ** 2)).toBeCloseTo(1, 2);
    }
  });

  it('ordnet die Planeten nach Sonnenabstand', () => {
    const reihenfolge = ['mercury', 'venus', 'earth', 'mars',
                         'jupiter', 'saturn', 'uranus', 'neptune'];
    const abstaende = reihenfolge.map(
      (id) => betrag(positionAt(id, bodyIndex, J2000)) / AU_KM,
    );
    // Merkur und Venus können sich wegen Exzentrizität nicht überholen,
    // die Reihenfolge der Bahnradien ist strikt.
    for (let i = 1; i < abstaende.length; i++) {
      expect(abstaende[i]!).toBeGreaterThan(abstaende[i - 1]!);
    }
  });

  it('hält alle Bahnen nahe der Ekliptik', () => {
    // Keine Planetenbahn ist stärker als 8 Grad geneigt.
    for (const id of Object.keys(PERIODEN_TAGE)) {
      const p = positionAt(id, bodyIndex, J2000 + 500);
      const neigungGrad = Math.abs(Math.atan2(p.z, Math.hypot(p.x, p.y)) * 180 / Math.PI);
      expect(neigungGrad).toBeLessThan(8);
    }
  });
});

describe('umlaufzeitTage (Kepler III)', () => {
  it('liefert das siderische Jahr der Erde und den siderischen Monat', () => {
    expect(umlaufzeitTage(bodyIndex.earth!, bodyIndex)).toBeCloseTo(365.25, 0);
    expect(Math.abs(umlaufzeitTage(bodyIndex.earth!, bodyIndex)! - 365.25)).toBeLessThan(0.3);
    expect(Math.abs(umlaufzeitTage(bodyIndex.moon!, bodyIndex)! - 27.32)).toBeLessThan(0.2);
  });

  it('ist für die Sonne null', () => {
    expect(umlaufzeitTage(bodyIndex.sun!, bodyIndex)).toBeNull();
  });
});
