import { describe, it, expect } from 'vitest';
import { himmelsBlick, HIMMEL_KINO_FOV_STANDARD } from './himmelsblick';
import { DEFAULT_STATE } from '../../store';
import { blickVektor } from './flug';
import { geozentrischeRichtung } from '../../sim/geozentrisch';
import { bodyIndex } from '../../data/index';
import type { Scene } from '../../data/scenes';
import type { AppState } from '../../store/types';

const jd = 2461400.5;
const szene: Scene = {
  id: 'probe-himmel', titleKey: 'scene.probe', targetId: 'mars', path: 'himmel',
  distanceBasis: 'bodyRadius',
  params: { distanceInRadii: 1, elevationDeg: 0, azimuthDeg: 0, azimuthRateDegPerSec: 0 },
  durationSec: 60, timeRateDaysPerSec: 2.7, himmel: { fovDeg: 30 },
  variation: { azimuthDeg: [0, 0], elevationDeg: [0, 0], distanceFactor: [1, 1] },
};

describe('himmelsBlick', () => {
  it('nimmt im Handmodus Blick und Bildwinkel aus camera.geo', () => {
    const state: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'geozentrisch', geo: { yaw: 1, pitch: 0.2, fovDeg: 12, lupe: 1 } },
    };
    const b = himmelsBlick(state, jd);
    expect(b.fovDeg).toBe(12);
    const soll = blickVektor({ yaw: 1, pitch: 0.2 });
    expect(b.richtung.x).toBeCloseTo(soll.x, 12);
    expect(b.richtung.z).toBeCloseTo(soll.z, 12);
  });

  it('blickt im Kino auf den Zielkörper zur Mitte der Szene', () => {
    const state: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'cinema' },
      cinema: { ...DEFAULT_STATE.cinema, running: true, nummer: 0, shuffle: false, elapsedSec: 10 },
    };
    const b = himmelsBlick(state, jd, [szene]);
    // 20 s bis zur Mitte bei 2,7 Tagen je Sekunde.
    const soll = geozentrischeRichtung('mars', bodyIndex, jd + 20 * 2.7);
    expect(b.richtung.x).toBeCloseTo(soll.x, 12);
    expect(b.richtung.y).toBeCloseTo(soll.y, 12);
    expect(b.fovDeg).toBe(30);
    expect(himmelsBlick(state, jd, [{ ...szene, himmel: undefined }]).fovDeg).toBe(HIMMEL_KINO_FOV_STANDARD);
  });
});
