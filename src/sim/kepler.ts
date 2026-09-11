const ZWEI_PI = 2 * Math.PI;

/** Normiert einen Winkel auf den Bereich [-PI, PI]. */
export function normalizeAngle(rad: number): number {
  let a = rad % ZWEI_PI;
  if (a > Math.PI) a -= ZWEI_PI;
  if (a < -Math.PI) a += ZWEI_PI;
  return a;
}

/**
 * Löst die Kepler-Gleichung M = E - e*sin(E) nach E per Newton-Iteration.
 *
 * Startwert E0 = M + e*sin(M) — er liegt für e < 0.6 so dicht an der Lösung,
 * dass drei bis fünf Iterationen genügen. Die harte Obergrenze verhindert
 * eine Endlosschleife, falls je ein pathologischer Fall auftritt.
 */
export function solveKepler(meanAnomalyRad: number, e: number): number {
  if (!(e >= 0) || e >= 1) {
    throw new RangeError(`Exzentrizität außerhalb [0, 1): ${e}`);
  }

  const M = normalizeAngle(meanAnomalyRad);
  let E = M + e * Math.sin(M);

  for (let i = 0; i < 30; i++) {
    const f = E - e * Math.sin(E) - M;
    const fStrich = 1 - e * Math.cos(E);
    const delta = f / fStrich;
    E -= delta;
    if (Math.abs(delta) < 1e-12) break;
  }

  return E;
}
