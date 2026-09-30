import { describe, it, expect } from 'vitest';
import { himmelsansicht, dargestellterMassstab, himmelsMassstab, SONNE_LUPE_MAX } from './himmelsansicht';
import { DEFAULT_STATE } from './index';
import { SCALE_PRESETS, scaledRadius, scaledPositionAt } from '../sim/scale';
import { bodyIndex } from '../data/index';
import { AU_KM } from '../sim/orbit';
import type { Scene } from '../data/scenes';
import type { AppState } from './types';

const himmelSzene: Scene = {
  id: 'probe-himmel', titleKey: 'scene.probe', targetId: 'mars', path: 'himmel',
  distanceBasis: 'bodyRadius',
  params: { distanceInRadii: 1, elevationDeg: 0, azimuthDeg: 0, azimuthRateDegPerSec: 0 },
  durationSec: 60, timeRateDaysPerSec: 2.7, himmel: { fovDeg: 30 },
  variation: { azimuthDeg: [0, 0], elevationDeg: [0, 0], distanceFactor: [1, 1] },
};
const zustand = (patch: Partial<AppState['camera']>, cinema: Partial<AppState['cinema']> = {}): AppState => ({
  ...structuredClone(DEFAULT_STATE),
  camera: { ...DEFAULT_STATE.camera, ...patch },
  cinema: { ...DEFAULT_STATE.cinema, ...cinema },
});

describe('himmelsansicht', () => {
  it('gilt im Modus geozentrisch', () => {
    expect(himmelsansicht(zustand({ mode: 'geozentrisch' }))).toBe(true);
  });
  it('gilt nicht in den übrigen Handmodi', () => {
    for (const mode of ['free', 'attached', 'follow', 'fly'] as const) {
      expect(himmelsansicht(zustand({ mode }))).toBe(false);
    }
  });
  it('gilt im Kino genau dann, wenn die aktuelle Szene den Bahntyp himmel trägt', () => {
    const kino = zustand({ mode: 'cinema' }, { nummer: 0, shuffle: false });
    expect(himmelsansicht(kino, [himmelSzene])).toBe(true);
    expect(himmelsansicht(kino, [{ ...himmelSzene, path: 'orbit' }])).toBe(false);
  });
});

describe('dargestellterMassstab mit Lupe', () => {
  it('liefert im Modus geozentrisch mit Lupe 1 genau realistisch und lässt state.scale unberührt', () => {
    const s = zustand({ mode: 'geozentrisch' });
    expect(s.camera.geo.lupe).toBe(1);
    expect(dargestellterMassstab(s)).toEqual(SCALE_PRESETS.realistisch);
    expect(s.scale.preset).toBe('schaubild');
  });
  it('vergrößert mit der Lupe nur die Körper, nie die Abstände', () => {
    const s = zustand({ mode: 'geozentrisch', geo: { ...DEFAULT_STATE.camera.geo, lupe: 20 } });
    expect(dargestellterMassstab(s)).toEqual({ sizeScale: 20, distanceExponent: 1, sunDamping: SONNE_LUPE_MAX / 20 });
  });
  it('hält die Sonne bei Lupe 50 unter 2,2 Grad', () => {
    const m = himmelsMassstab(50);
    const sonne = scaledRadius(bodyIndex['sun']!, m);
    const winkelGrad = 2 * Math.atan(sonne / AU_KM) * 180 / Math.PI;
    expect(winkelGrad).toBeLessThan(2.2);
    expect(himmelsMassstab(2).sunDamping).toBe(1);
  });
  it('lässt den Erdmond unter der Lupe in Richtung und Winkelgröße unverändert', () => {
    const jd = 2461456.0;
    const blick = (lupe: number) => {
      const m = himmelsMassstab(lupe);
      const erde = scaledPositionAt('earth', bodyIndex, jd, m);
      const mond = scaledPositionAt('moon', bodyIndex, jd, m);
      const d = { x: mond.x - erde.x, y: mond.y - erde.y, z: mond.z - erde.z };
      const l = Math.hypot(d.x, d.y, d.z);
      return { x: d.x / l, y: d.y / l, z: d.z / l, winkel: scaledRadius(bodyIndex['moon']!, m) / l };
    };
    const echt = blick(1);
    const lupe = blick(50);
    expect(lupe.x).toBeCloseTo(echt.x, 12);
    expect(lupe.y).toBeCloseTo(echt.y, 12);
    expect(lupe.z).toBeCloseTo(echt.z, 12);
    expect(lupe.winkel).toBeCloseTo(echt.winkel, 12);
  });
  it('zeichnet eine Himmelsszene im Kino immer mit 1×, auch wenn die Lupe steht', () => {
    const kino = zustand({ mode: 'cinema', geo: { ...DEFAULT_STATE.camera.geo, lupe: 30 } }, { nummer: 0, shuffle: false });
    expect(dargestellterMassstab(kino, [himmelSzene])).toEqual(SCALE_PRESETS.realistisch);
  });
  it('lässt außerhalb des Himmels die Lupe wirkungslos', () => {
    const s = zustand({ mode: 'attached', geo: { ...DEFAULT_STATE.camera.geo, lupe: 30 } });
    expect(dargestellterMassstab(s)).toEqual(SCALE_PRESETS.schaubild);
  });
});
