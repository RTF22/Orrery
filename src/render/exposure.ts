import type { AppState } from '../store/types';
import { dargestellterMassstab, himmelsansicht } from '../store/himmelsansicht';
import { bodyIndex } from '../data/index';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';
import { scaledPositionAt } from '../sim/scale';
import { blickzielVon } from './camera/cinema';
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
 * Körper der geplanten Szene, bei der Sichtlinie also der Standortkörper,
 * siehe `blickzielVon`; in den Handmodi das Kameraziel, im Flug der
 * Bezugskörper. Dieselbe Auflösung wie in camera/controller.ts.
 */
export function exposureTargetId(state: AppState): string {
  if (state.camera.mode === 'cinema') {
    const { scene } = plannedSceneAt(
      state.cinema.nummer, SCENES, state.cinema.seed, state.cinema.shuffle,
    );
    return blickzielVon(scene);
  }
  // Im Flug der Bezugskörper: Wer zum Saturn fliegt, während das Ziel die
  // Sonne ist, soll den Saturn richtig belichtet sehen (Plan Flug Etappe 1,
  // Ruling 3).
  if (state.camera.mode === 'fly') return state.camera.fly.refId;
  return state.camera.targetId;
}

/**
 * Aufhellung der Himmelsansicht (Entwurf §11.3): Der Vollmond soll vor dem
 * Nachthimmel hell wirken, wie das dunkeladaptierte Auge ihn sieht. 3,7 ist
 * per Messung am Vollmond festgelegt (Mittel 172 von 255). Je Ziel nimmt
 * himmelAufhellungFuer den Faktor nach Albedo zurück (gestalteter Exponent 1,5,
 * Bezug 0,12, ein Messpunkt Mars); Ziele ohne Albedo und die Erde (der
 * Beobachter) behalten den vollen Faktor. Sonne, Sterne und Linien hängen nicht
 * an der Belichtung.
 */
export const HIMMEL_AUFHELLUNG = 3.7;

/**
 * Bezugsalbedo der Aufhellung: die des Erdmonds. Hellere Ziele (Mars 0,17,
 * Venus 0,69) bekämen mit dem vollen Faktor ausgebrannte Scheiben; ihr Faktor
 * sinkt deshalb mit (Mondalbedo / Albedo)^1,5, mindestens auf 1.
 */
const HIMMEL_BEZUGSALBEDO = 0.12;

/**
 * Aufhellung für dieses Ziel: HIMMEL_AUFHELLUNG beim Mond, darüber schwächer.
 * Die Erde ist in der Himmelsansicht der Beobachter, ihre Albedo ist ohne
 * Belang: Ziel Erde zeigt den Vollmond so hell wie Ziel Mond.
 */
export function himmelAufhellungFuer(zielId: string): number {
  if (zielId === 'earth') return HIMMEL_AUFHELLUNG;
  const albedo = bodyIndex[zielId]?.physical.albedo ?? HIMMEL_BEZUGSALBEDO;
  if (!(albedo > HIMMEL_BEZUGSALBEDO)) return HIMMEL_AUFHELLUNG;
  return Math.max(1, HIMMEL_AUFHELLUNG * (HIMMEL_BEZUGSALBEDO / albedo) ** 1.5);
}

/**
 * Sollwert der Belichtung für diesen Zustand, ungedämpft. Der Sonnenabstand
 * ist der dargestellte (scaledPositionAt) — wie bei der Beleuchtung der
 * Körper, sonst passte die Belichtung nicht zum Licht, das die Szene zeigt.
 */
export function exposureFor(state: AppState, jd: number): number {
  const zielId = exposureTargetId(state);
  const p = scaledPositionAt(zielId, bodyIndex, jd, dargestellterMassstab(state));
  return targetExposure(Math.hypot(p.x, p.y, p.z), state.display)
    * (himmelsansicht(state) ? himmelAufhellungFuer(zielId) : 1);
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
