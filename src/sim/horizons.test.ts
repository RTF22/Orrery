import { describe, it, expect } from 'vitest';
import fixture from './__fixtures__/horizons.json';
import { positionAt } from './orbit';
import { bodyIndex } from '../data/index';

interface Punkt { id: string; jd: number; x: number; y: number; z: number }

const punkte = fixture.punkte as Punkt[];
const toleranz = fixture.toleranzKm as Record<string, number>;

describe('Bahnberechnung gegen JPL Horizons', () => {
  it('enthält Referenzpunkte für alle acht Planeten', () => {
    const ids = new Set(punkte.map((p) => p.id));
    for (const id of ['mercury', 'venus', 'earth', 'mars',
                      'jupiter', 'saturn', 'uranus', 'neptune']) {
      expect(ids.has(id)).toBe(true);
    }
    expect(punkte.length).toBeGreaterThanOrEqual(40);
  });

  it('trifft jeden Referenzpunkt innerhalb der Toleranz', () => {
    const schlimmste: Record<string, number> = {};

    for (const p of punkte) {
      const berechnet = positionAt(p.id, bodyIndex, p.jd);
      const abweichung = Math.sqrt(
        (berechnet.x - p.x) ** 2 + (berechnet.y - p.y) ** 2 + (berechnet.z - p.z) ** 2,
      );
      schlimmste[p.id] = Math.max(schlimmste[p.id] ?? 0, abweichung);
    }

    // Gemessene Abweichungen ausgeben, damit die Toleranzen danach
    // begründet festgezurrt werden können statt geraten zu bleiben.
    console.table(
      Object.entries(schlimmste).map(([id, km]) => ({
        'Körper': id,
        'max. Abweichung [km]': Math.round(km),
        'Toleranz [km]': toleranz[id],
        'ausgeschoepft [%]': Math.round((km / toleranz[id]!) * 100),
      })),
    );

    for (const [id, km] of Object.entries(schlimmste)) {
      expect(km, `${id} weicht ${Math.round(km)} km ab`).toBeLessThan(toleranz[id]!);
    }
  });
});
