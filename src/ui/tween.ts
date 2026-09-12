import type { ScaleSettings } from '../sim/scale';

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * sizeScale und sunDamping werden geometrisch interpoliert, der Exponent
 * linear. Grund: Größenfaktoren wirken multiplikativ — linear interpoliert
 * bliebe die Animation lange am großen Ende kleben und ruckte am Schluss.
 */
export function lerpScale(von: ScaleSettings, nach: ScaleSettings, t: number): ScaleSettings {
  if (t <= 0) return { ...von };
  if (t >= 1) return { ...nach };
  const geo = (a: number, b: number): number => a * Math.pow(b / a, t);
  return {
    sizeScale: geo(von.sizeScale, nach.sizeScale),
    sunDamping: geo(von.sunDamping, nach.sunDamping),
    distanceExponent: von.distanceExponent + (nach.distanceExponent - von.distanceExponent) * t,
  };
}

/** Animiert einen Preset-Wechsel; liefert eine Abbruchfunktion. */
export function tweenScale(
  von: ScaleSettings, nach: ScaleSettings, dauerMs: number,
  setzen: (s: ScaleSettings) => void,
): () => void {
  const start = performance.now();
  let id = 0;
  // Der Fortschritt kommt aus der Uhr, nicht aus dem Zeitstempel des Frames:
  // Bei niedriger Bildrate bliebe der Übergang sonst spürbar länger stehen,
  // als er soll.
  const tick = (): void => {
    const t = Math.min((performance.now() - start) / dauerMs, 1);
    setzen(lerpScale(von, nach, easeInOutCubic(t)));
    if (t < 1) id = requestAnimationFrame(tick);
  };
  id = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(id); };
}
