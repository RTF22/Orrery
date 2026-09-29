import type { AppState } from '../../store/types';
import type { Vec3 } from '../../sim/types';
import { SCENES } from '../../data/scenes';
import type { Scene } from '../../data/scenes';
import { plannedSceneAt } from '../../sim/director';
import { geozentrischeRichtung } from '../../sim/geozentrisch';
import { bodyIndex } from '../../data/index';
import { blickVektor } from './flug';

/** Bildwinkel einer Himmelsszene ohne eigenes `himmel.fovDeg`, in Grad. */
export const HIMMEL_KINO_FOV_STANDARD = 30;

export interface HimmelsBlick { richtung: Vec3; fovDeg: number }

/**
 * Sollblick der Himmelsansicht (Entwurf geozentrische Sicht §4.2, §4.5). Im
 * Handmodus aus `camera.geo`; im Kino fest auf die geozentrische Richtung
 * des Zielkörpers zur Szenenmitte, damit die Schleife vor ruhenden Sternen
 * entsteht, statt dass der Blick dem Planeten folgt. Die Szenenmitte wird aus
 * der verbleibenden Szenenzeit und dem Zeitraffer der Szene geschätzt; die
 * Blende der ersten zwei Sekunden verschiebt sie um Bruchteile eines Tages.
 * `szenen` nur für Tests.
 */
export function himmelsBlick(state: AppState, jd: number, szenen: readonly Scene[] = SCENES): HimmelsBlick {
  if (state.camera.mode === 'cinema') {
    const { scene } = plannedSceneAt(state.cinema.nummer, szenen, state.cinema.seed, state.cinema.shuffle);
    if (scene.path === 'himmel') {
      const jdMitte = jd + (scene.durationSec / 2 - state.cinema.elapsedSec) * scene.timeRateDaysPerSec;
      return {
        richtung: geozentrischeRichtung(scene.lookAtId ?? scene.targetId, bodyIndex, jdMitte),
        fovDeg: scene.himmel?.fovDeg ?? HIMMEL_KINO_FOV_STANDARD,
      };
    }
  }
  return { richtung: blickVektor(state.camera.geo), fovDeg: state.camera.geo.fovDeg };
}
