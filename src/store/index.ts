import { create } from 'zustand';
import type { AppState } from './types';
import { SCALE_PRESETS } from '../sim/scale';
import { J2000, imZeitbereich } from '../sim/time';

export const DEFAULT_STATE: AppState = {
  time: { jd: J2000, rateDaysPerSec: 1, paused: false },
  scale: { ...SCALE_PRESETS.schaubild, preset: 'schaubild' },
  display: {
    orbits: true, labels: true, markers: true, belts: true, shadows: true,
    bloom: true, brightness: 1, lightFalloff: 2,
    // Ohne diese beiden Standardwerte bliebe die abgewandte Hälfte jedes
    // Körpers bei absolut null und die äußeren Planeten bei rund einem
    // Prozent des Erdniveaus — im Dauerlauf sichtbar als schwarze Scheiben.
    // Beide Werte sind an Pixelmessungen kalibriert, nicht geschätzt.
    // nightFill 0,25: Die Nachtseite der Erde liegt im Mittel bei 16 statt 4
    // von 255 — Umrisse sind erkennbar, der Terminator bleibt deutlich.
    // lightCompensation 0,7: Seit die Kamera auf ihr Ziel belichtet
    // (render/lighting.ts, targetExposure), bestimmt der Ausgleich nur noch
    // die Staffelung der übrigen Körper im selben Bild, nicht die Helligkeit
    // des betrachteten. In der Systemschau zeigt 0,7 Neptun mit 136 und
    // Uranus mit 108 (Maximum) bzw. 74,5 (Median) von 255, weit über dem
    // Kriterium 40/12 des Entwurfs, bei physikalischerer Abstufung als 0,85
    // (docs/phase3a-abnahme.md, Nachtrag 13.09.2026).
    nightFill: 0.25, lightCompensation: 0.7,
  },
  camera: {
    mode: 'free', targetId: 'sun', distance: 8e8,
    azimuth: 0.6, elevation: 0.5, freezeJd: null,
    // Ein Flug beginnt immer an der gezeigten Lage. Der Standard entspricht
    // der Startansicht: der Punkt aus distance/azimuth/elevation, Blick zur
    // Sonne (azimuth + π, −elevation).
    fly: {
      refId: 'sun',
      x: 8e8 * Math.cos(0.5) * Math.cos(0.6),
      y: 8e8 * Math.cos(0.5) * Math.sin(0.6),
      z: 8e8 * Math.sin(0.5),
      yaw: 0.6 + Math.PI,
      pitch: -0.5,
    },
  },
  cinema: {
    running: false, nummer: 0, elapsedSec: 0,
    // Fester Standardkeim: Der erste Eindruck ist damit für alle gleich und
    // Fehlerberichte sind nachstellbar. Wer Abwechslung will, würfelt ihn
    // im Panel neu.
    seed: 20260912, shuffle: true, pauseOnInput: true, idleResumeSec: 30,
  },
  visible: {},
  quality: { tier: 'auto' },
  ui: {
    hidden: false,
    panels: { time: true, scale: true, camera: true, tree: true },
    language: 'de',
    info: { niveau: 'gymnasium', breiteRem: 24, teilung: 0.65, thema: null },
  },
};

interface Actions {
  setTime(patch: Partial<AppState['time']>): void;
  setScale(patch: Partial<AppState['scale']>): void;
  setDisplay(patch: Partial<AppState['display']>): void;
  setCamera(patch: Partial<AppState['camera']>): void;
  setUi(patch: Partial<AppState['ui']>): void;
  setInfo(patch: Partial<AppState['ui']['info']>): void;
  setCinema(patch: Partial<AppState['cinema']>): void;
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
  // Jede Zeit, die über die Oberfläche hereinkommt (Datumsfeld, „Jetzt"),
  // bleibt im Zeitbereich (sim/time.ts) — Bildschleife und Kino klemmen dort
  // jeweils selbst.
  setTime: (p) => set((s) => ({
    time: { ...s.time, ...p, ...(p.jd === undefined ? {} : { jd: imZeitbereich(p.jd) }) },
  })),
  setScale: (p) => set((s) => ({ scale: { ...s.scale, ...p } })),
  setDisplay: (p) => set((s) => ({ display: { ...s.display, ...p } })),
  setCamera: (p) => set((s) => ({ camera: { ...s.camera, ...p } })),
  setUi: (p) => set((s) => ({ ui: { ...s.ui, ...p } })),
  setInfo: (p) => set((s) => ({ ui: { ...s.ui, info: { ...s.ui.info, ...p } } })),
  setCinema: (p) => set((s) => ({ cinema: { ...s.cinema, ...p } })),
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
