import type { AppState } from './types';
import { SCALE_PRESETS } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';
import { plannedSceneAt } from '../sim/director';
import { SCENES } from '../data/scenes';
import type { Scene } from '../data/scenes';

/**
 * Himmelsansicht (Entwurf geozentrische Sicht §3, §10 Punkt 1 und 2): der
 * Handmodus geozentrisch oder ein Kino, dessen aktuelle Szene den Bahntyp
 * `himmel` trägt. `szenen` nur für Tests.
 */
export function himmelsansicht(
  state: Pick<AppState, 'camera' | 'cinema'>, szenen: readonly Scene[] = SCENES,
): boolean {
  if (state.camera.mode === 'geozentrisch') return true;
  if (state.camera.mode !== 'cinema') return false;
  const { cinema } = state;
  return plannedSceneAt(cinema.nummer, szenen, cinema.seed, cinema.shuffle).scene.path === 'himmel';
}

/**
 * Größter Faktor auf den Sonnenradius unter der Lupe (Entwurf §11.4): Die
 * Sonne wächst höchstens auf rund 2,1°, sonst deckte sie bei 50× ein Viertel
 * des Himmels ab.
 */
export const SONNE_LUPE_MAX = 4;

/**
 * Maßstab der Himmelsansicht mit Lupe: Abstände bleiben echt, nur die Radien
 * wachsen. Richtungen ändern sich dadurch nicht; Monde rücken nach
 * scaledPositionAt um denselben Faktor von ihrem Planeten ab, der Erdmond
 * behält so Richtung und Winkelgröße.
 */
export function himmelsMassstab(lupe: number): ScaleSettings {
  return { sizeScale: lupe, distanceExponent: 1, sunDamping: Math.min(1, SONNE_LUPE_MAX / lupe) };
}

/**
 * Der Maßstab, mit dem gezeichnet wird. In der Himmelsansicht gilt
 * „realistisch“, damit Richtungen und Winkelgrößen von der Erde aus stimmen,
 * im Handmodus mit der Lupe aus `camera.geo.lupe`;
 * der eingestellte Maßstab bleibt dabei unberührt, jeder Ausstieg zeigt ihn wieder.
 * Alle Leser in render/ gehen über diese Funktion (Test render/massstab.test.ts).
 */
export function dargestellterMassstab(
  state: Pick<AppState, 'camera' | 'cinema' | 'scale'>, szenen: readonly Scene[] = SCENES,
): ScaleSettings {
  if (himmelsansicht(state, szenen)) {
    // Die Lupe gilt nur im Handmodus; Himmelsszenen im Kino zeigen den echten Himmel.
    return state.camera.mode === 'geozentrisch'
      ? himmelsMassstab(state.camera.geo.lupe)
      : SCALE_PRESETS.realistisch;
  }
  const { sizeScale, distanceExponent, sunDamping } = state.scale;
  return { sizeScale, distanceExponent, sunDamping };
}
