import type { BodyIndex } from './types';
import { positionAt, AU_KM } from './orbit';

/**
 * Scheinbare Helligkeit vom Erdmittelpunkt (Entwurf geozentrische Sicht
 * §11.2) — ein Darstellungsmodell für die Lichtpunkte der Himmelsansicht,
 * keine Photometrie: Lambert-Kugel mit geometrischer Albedo, ohne Ringe,
 * Oppositionseffekt und Farbe. Venus, Jupiter und Mars liegen damit auf
 * wenige Zehntel Größenklassen bei den beobachteten Werten, Saturn ohne
 * Ringe rund eine halbe Klasse zu dunkel.
 */

/** Scheinbare Helligkeit der Sonne im V-Band bei 1 AE. */
export const M_SONNE = -26.74;
/** Geometrische Albedo für Körper ohne Katalogwert (kleine, meist dunkle Monde). */
export const ALBEDO_ERSATZ = 0.1;

/** Phasenfunktion der Lambert-Kugel, normiert auf 1 bei voller Beleuchtung. */
export function lambertPhase(alpha: number): number {
  return (Math.sin(alpha) + (Math.PI - alpha) * Math.cos(alpha)) / Math.PI;
}

export function scheinbareHelligkeit(id: string, index: BodyIndex, jd: number): number | null {
  const body = index[id];
  if (body === undefined || body.kind === 'star' || id === 'earth') return null;
  const k = positionAt(id, index, jd);
  const sonne = positionAt('sun', index, jd);
  const erde = positionAt('earth', index, jd);
  const zurSonne = { x: sonne.x - k.x, y: sonne.y - k.y, z: sonne.z - k.z };
  const zurErde = { x: erde.x - k.x, y: erde.y - k.y, z: erde.z - k.z };
  const r = Math.hypot(zurSonne.x, zurSonne.y, zurSonne.z);
  const delta = Math.hypot(zurErde.x, zurErde.y, zurErde.z);
  const cosAlpha = (zurSonne.x * zurErde.x + zurSonne.y * zurErde.y + zurSonne.z * zurErde.z) / (r * delta);
  const alpha = Math.acos(Math.min(1, Math.max(-1, cosAlpha)));
  const albedo = body.physical.albedo ?? ALBEDO_ERSATZ;
  const fluss = albedo * (body.physical.radiusKm / delta) ** 2 * lambertPhase(alpha) * (AU_KM / r) ** 2;
  return fluss > 0 ? M_SONNE - 2.5 * Math.log10(fluss) : Infinity;
}
