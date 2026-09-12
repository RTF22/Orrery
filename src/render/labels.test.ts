import { describe, it, expect } from 'vitest';
import { apparentRadiusPixels, needsMarker, MARKER_MIN_PIXEL } from './labels';

describe('apparentRadiusPixels', () => {
  it('halbiert sich bei doppeltem Abstand', () => {
    const nah = apparentRadiusPixels(1, 100, 50, 1080);
    const fern = apparentRadiusPixels(1, 200, 50, 1080);
    expect(fern).toBeCloseTo(nah / 2, 3);
  });

  it('wächst mit der Fensterhöhe', () => {
    expect(apparentRadiusPixels(1, 100, 50, 2160))
      .toBeGreaterThan(apparentRadiusPixels(1, 100, 50, 1080));
  });

  it('macht einen entfernten Mond unsichtbar klein', () => {
    // Erdmond (1737 km) aus 5 AE Entfernung, in Render-Einheiten
    const radius = 1.737;
    const abstand = 5 * 149_597_870.7 / 1000;
    expect(apparentRadiusPixels(radius, abstand, 50, 1080)).toBeLessThan(1);
  });

  it('bleibt bei Abstand null endlich', () => {
    expect(Number.isFinite(apparentRadiusPixels(1, 0, 50, 1080))).toBe(true);
  });
});

describe('needsMarker', () => {
  it('greift unterhalb der Schwelle', () => {
    expect(needsMarker(MARKER_MIN_PIXEL - 0.1)).toBe(true);
    expect(needsMarker(0)).toBe(true);
  });

  it('greift oberhalb der Schwelle nicht', () => {
    expect(needsMarker(MARKER_MIN_PIXEL + 0.1)).toBe(false);
    expect(needsMarker(500)).toBe(false);
  });
});
