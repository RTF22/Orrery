import type { Vec3 } from '../sim/types';

/** Eine Three.js-Einheit entspricht 1000 km. */
export const RENDER_UNIT_KM = 1000;

export const kmToUnits = (km: number): number => km / RENDER_UNIT_KM;
export const unitsToKm = (u: number): number => u * RENDER_UNIT_KM;

/**
 * Rechnet eine Weltposition in kamerarelative Render-Koordinaten um.
 *
 * Die Subtraktion geschieht in JavaScript, also in float64. Erst das
 * Ergebnis — eine kleine Zahl — geht an die GPU. Ohne diesen Schritt
 * würde ein Punkt bei 30 AE in float32 auf rund 500 km genau landen,
 * und die äußeren Planeten würden sichtbar zittern.
 */
export function worldToRender(posKm: Vec3, cameraKm: Vec3): Vec3 {
  return {
    x: kmToUnits(posKm.x - cameraKm.x),
    y: kmToUnits(posKm.y - cameraKm.y),
    z: kmToUnits(posKm.z - cameraKm.z),
  };
}
