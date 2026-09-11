import { create } from 'zustand';
import type { AppState } from './types';
import { SCALE_PRESETS } from '../sim/scale';
import { J2000 } from '../sim/time';

export const DEFAULT_STATE: AppState = {
  time: { jd: J2000, rateDaysPerSec: 1, paused: false },
  scale: { ...SCALE_PRESETS.schaubild, preset: 'schaubild' },
  display: {
    orbits: true, labels: true, markers: true,
    bloom: true, brightness: 1, lightFalloff: 2,
  },
  camera: { mode: 'free', targetId: 'sun', distance: 8e8, azimuth: 0.6, elevation: 0.5 },
  visible: {},
  quality: { tier: 'auto' },
  ui: { hidden: false, panels: { time: true, scale: true, camera: true, tree: true }, language: 'de' },
};

interface Actions {
  setTime(patch: Partial<AppState['time']>): void;
  setScale(patch: Partial<AppState['scale']>): void;
  setDisplay(patch: Partial<AppState['display']>): void;
  setCamera(patch: Partial<AppState['camera']>): void;
  setUi(patch: Partial<AppState['ui']>): void;
  toggleVisible(id: string): void;
  replaceAll(state: AppState): void;
}

/**
 * Der Zustand-Store liest der Renderer über getState() ohne Subscription in
 * seiner Animationsschleife (das hält render/ von React entkoppelt); UI-Panels
 * lesen und schreiben ihn über Hooks.
 */
export const useStore = create<AppState & Actions>((set) => ({
  ...structuredClone(DEFAULT_STATE),
  setTime: (p) => set((s) => ({ time: { ...s.time, ...p } })),
  setScale: (p) => set((s) => ({ scale: { ...s.scale, ...p } })),
  setDisplay: (p) => set((s) => ({ display: { ...s.display, ...p } })),
  setCamera: (p) => set((s) => ({ camera: { ...s.camera, ...p } })),
  setUi: (p) => set((s) => ({ ui: { ...s.ui, ...p } })),
  // Blendet aus, indem der Schlüssel auf `false` gesetzt wird; blendet wieder
  // ein, indem der Schlüssel vollständig entfernt wird. `visible` enthält so
  // stets nur echte Abweichungen vom Standard „sichtbar" (DEFAULT_STATE.visible
  // ist {}) — sonst würde jedes Aus- und wieder Einblenden das geteilte
  // URL-Fragment dauerhaft vergrößern.
  toggleVisible: (id) => set((s) => {
    const visible = { ...s.visible };
    if (visible[id] === false) {
      delete visible[id];
    } else {
      visible[id] = false;
    }
    return { visible };
  }),
  replaceAll: (state) => set(structuredClone(state)),
}));
