/**
 * Mulberry32 — ein kleiner Generator mit 32-Bit-Zustand.
 *
 * Gewählt, weil er in wenigen Zeilen auskommt, keine Abhängigkeit braucht
 * und einen setzbaren Zustand hat: Genau das macht die Zusicherung
 * „gleicher Keim ergibt identische Kamerapfade" prüfbar. Kryptografisch
 * ist er nicht, und das muss er hier auch nicht sein.
 */
export function createRng(seed: number): () => number {
  let zustand = seed >>> 0;
  return () => {
    zustand = (zustand + 0x6d2b79f5) >>> 0;
    let t = zustand;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mischt Keim und Szenennummer zu einem eigenständigen Keim. Ohne diese
 * Durchmischung ergäben benachbarte Szenennummern fast gleiche erste
 * Zufallswerte, und die Variation sähe wie eine Wiederholung aus.
 */
export function hashSeed(seed: number, nummer: number): number {
  let h = (seed ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (nummer + 0x85ebca6b), 0xc2b2ae35) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  return Math.imul(h, 0x27d4eb2f) >>> 0;
}

/** Zieht einen Wert aus einem geschlossenen Bereich. */
export function pickInRange(rng: () => number, bereich: readonly [number, number]): number {
  const [min, max] = bereich;
  return min + (max - min) * rng();
}
