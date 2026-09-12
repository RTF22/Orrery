import type { QualityTier } from '../store/types';

export const QUALITY_SETTINGS = {
  low:    { textureSize: 1024, bloom: false, pixelRatioCap: 1.0 },
  medium: { textureSize: 2048, bloom: true,  pixelRatioCap: 1.5 },
  high:   { textureSize: 8192, bloom: true,  pixelRatioCap: 2.0 },
} as const;

/** Mindestens so viele Messwerte, bevor überhaupt eingestuft wird. */
export const MESSFENSTER = 60;

/**
 * Stuft anhand der mittleren Framezeit ein — und zwar nur nach unten.
 * Automatisches Hochstufen ließe die Einstellung zwischen zwei Stufen
 * pendeln, was sichtbar unruhig wirkt.
 */
export function detectTier(frameZeitenMs: number[]): QualityTier {
  if (frameZeitenMs.length < MESSFENSTER) return 'auto'; // noch keine belastbare Messung

  // Median statt Mittelwert: einzelne Ladespitzen sollen nicht entscheiden.
  const sortiert = [...frameZeitenMs].sort((a, b) => a - b);
  const median = sortiert[Math.floor(sortiert.length / 2)] ?? 0;

  if (median > 40) return 'low';
  if (median > 20) return 'medium';
  return 'high';
}
