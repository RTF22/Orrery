import { describe, it, expect } from 'vitest';
import { RENDER_UNIT_KM, kmToUnits, unitsToKm, worldToRender } from './units';
import { AU_KM } from '../sim/orbit';

describe('Einheitenumrechnung', () => {
  it('bildet 1000 km auf eine Render-Einheit ab', () => {
    expect(RENDER_UNIT_KM).toBe(1000);
    expect(kmToUnits(1000)).toBeCloseTo(1, 12);
    expect(unitsToKm(kmToUnits(12345))).toBeCloseTo(12345, 9);
  });
});

describe('worldToRender', () => {
  it('setzt die Kameraposition in den Ursprung', () => {
    const kamera = { x: 5 * AU_KM, y: -2 * AU_KM, z: 1000 };
    const r = worldToRender(kamera, kamera);
    expect(r.x).toBeCloseTo(0, 12);
    expect(r.y).toBeCloseTo(0, 12);
    expect(r.z).toBeCloseTo(0, 12);
  });

  it('erhält Abstände', () => {
    const kamera = { x: 30 * AU_KM, y: 0, z: 0 };
    const ziel = { x: 30 * AU_KM + 400_000, y: 0, z: 0 };
    expect(worldToRender(ziel, kamera).x).toBeCloseTo(400, 9);
  });

  // Dieser Test begründet die gesamte Technik.
  it('rettet Kilometergenauigkeit, die absolute Koordinaten in float32 verlieren', () => {
    const fernKm = 30 * AU_KM;
    const kamera = { x: fernKm, y: 0, z: 0 };

    // Absolut: der Wert wird beim Übergang nach float32 grob gerundet.
    const absolutVerlust = Math.abs(
      unitsToKm(Math.fround(kmToUnits(fernKm + 1))) - (fernKm + 1),
    );
    expect(absolutVerlust).toBeGreaterThan(100);

    // Kamerarelativ: derselbe Punkt bleibt auf Bruchteile eines Kilometers genau.
    const relativVerlust = Math.abs(
      unitsToKm(Math.fround(worldToRender({ x: fernKm + 1, y: 0, z: 0 }, kamera).x)) - 1,
    );
    expect(relativVerlust).toBeLessThan(0.01);
  });
});
