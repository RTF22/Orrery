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
 * Der Maßstab, mit dem gezeichnet wird. In der Himmelsansicht gilt
 * „realistisch“, damit Richtungen und Winkelgrößen von der Erde aus stimmen;
 * `state.scale` bleibt dabei unberührt, jeder Ausstieg zeigt ihn wieder.
 * Alle Leser in render/ gehen über diese Funktion (Test render/massstab.test.ts).
 */
export function dargestellterMassstab(
  state: Pick<AppState, 'camera' | 'cinema' | 'scale'>, szenen: readonly Scene[] = SCENES,
): ScaleSettings {
  if (himmelsansicht(state, szenen)) return SCALE_PRESETS.realistisch;
  const { sizeScale, distanceExponent, sunDamping } = state.scale;
  return { sizeScale, distanceExponent, sunDamping };
}
