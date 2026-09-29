import { describe, it, expect } from 'vitest';
import { himmelsansicht, dargestellterMassstab } from './himmelsansicht';
import { DEFAULT_STATE } from './index';
import { SCALE_PRESETS } from '../sim/scale';
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

describe('dargestellterMassstab', () => {
  it('liefert in der Himmelsansicht realistisch und lässt state.scale unberührt', () => {
    const s = zustand({ mode: 'geozentrisch' });
    expect(dargestellterMassstab(s)).toEqual(SCALE_PRESETS.realistisch);
    expect(s.scale.preset).toBe('schaubild');
  });
  it('liefert sonst den eingestellten Maßstab ohne Preset-Namen', () => {
    const s = zustand({ mode: 'attached' });
    expect(dargestellterMassstab(s)).toEqual(SCALE_PRESETS.schaubild);
  });
});
