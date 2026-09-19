import type { AppState } from '../store/types';
import { bodyIndex } from '../data/index';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';
import { scaledPositionAt } from '../sim/scale';
import { smoothDamp } from './camera/damping';
import { targetExposure } from './lighting';

/**
 * Zeitkonstante der Belichtungsanpassung in Sekunden — grob die Adaption
 * des Auges. Ein Szenenwechsel im Kino-Modus springt damit nicht in der
 * Helligkeit, sondern zieht innerhalb von rund einer Sekunde nach.
 */
export const EXPOSURE_ZEITKONSTANTE_S = 1;

/**
 * Der Körper, auf den die Kamera belichtet: im Kino-Modus der angesehene
 * Körper der geplanten Szene (`lookAtId`, sonst der Standortkörper), in den
 * Handmodi das Kameraziel, im Flug der Bezugskörper. Dieselbe Auflösung wie
 * in camera/controller.ts.
 */
export function exposureTargetId(state: AppState): string {
  if (state.camera.mode === 'cinema') {
    const { scene } = plannedSceneAt(
      state.cinema.nummer, SCENES, state.cinema.seed, state.cinema.shuffle,
    );
    return scene.lookAtId ?? scene.targetId;
  }
  // Im Flug der Bezugskörper: Wer zum Saturn fliegt, während das Ziel die
  // Sonne ist, soll den Saturn richtig belichtet sehen (Plan Flug Etappe 1,
  // Ruling 3).
  if (state.camera.mode === 'fly') return state.camera.fly.refId;
  return state.camera.targetId;
}

/**
 * Sollwert der Belichtung für diesen Zustand, ungedämpft. Der Sonnenabstand
 * ist der dargestellte (scaledPositionAt) — wie bei der Beleuchtung der
 * Körper, sonst passte die Belichtung nicht zum Licht, das die Szene zeigt.
 */
export function exposureFor(state: AppState, jd: number): number {
  const p = scaledPositionAt(exposureTargetId(state), bodyIndex, jd, state.scale);
  return targetExposure(Math.hypot(p.x, p.y, p.z), state.display);
}

export interface ExposureMeter {
  /** Gedämpfte Belichtung für diesen Frame — der Faktor auf `brightness`. */
  update(state: AppState, jd: number, dt: number): number;
}

/**
 * Belichtungsmesser mit Adaption. Gedämpft wird `ln(exposure)`, nicht der
 * Faktor selbst: Von 3 auf 300 und von 300 auf 3 soll der Übergang gleich
 * wirken, und im Faktor-Raum würde der erste rasen und der zweite kriechen.
 * Der erste Frame setzt den Wert direkt — die Seite soll nicht aus dem
 * Dunkel hochfahren. Der Zustand lebt hier und nicht im Store: Er ist kein
 * einstellbarer Zustand, sondern ein Nachlauf.
 */
export function createExposureMeter(): ExposureMeter {
  let logIst: number | null = null;
  const geschwindigkeit = { wert: 0 };
  return {
    update(state, jd, dt) {
      const logZiel = Math.log(exposureFor(state, jd));
      if (logIst === null) {
        logIst = logZiel;
      } else {
        logIst = smoothDamp(logIst, logZiel, geschwindigkeit, EXPOSURE_ZEITKONSTANTE_S, dt);
      }
      return Math.exp(logIst);
    },
  };
}
