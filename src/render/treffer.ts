import type { Matrix4 } from 'three';

/**
 * Trefferprüfung für Klickflächen in CSS-Pixeln relativ zur Canvas (Entwurf
 * Klickflächen §4). Rein und ohne DOM: Szene und Overlay liefern die
 * projizierten Kandidaten, hier fällt nur die Entscheidung.
 */

export type Zeigerart = 'maus' | 'finger';

/** Fangradius um den Zeiger. Ein Finger trifft ungenauer als ein Mauszeiger. */
export const FANG_PX: Record<Zeigerart, number> = { maus: 8, finger: 20 };
/** Bewegung, ab der ein Druck als Ziehen gilt statt als Tippen. */
export const TIPP_SCHWELLE_PX: Record<Zeigerart, number> = { maus: 4, finger: 10 };

/** Stift zählt als Maus. */
export const zeigerartVon = (pointerType: string): Zeigerart => (pointerType === 'touch' ? 'finger' : 'maus');

export interface Punkt { x: number; y: number }
/** Projizierte Körperscheibe; `tiefe` ist NDC-z, kleiner heißt weiter vorn. */
export interface Scheibe { id: string; x: number; y: number; radiusPx: number; tiefe: number; istMond: boolean }
export interface Rechteck { id: string; links: number; oben: number; rechts: number; unten: number }
/** Bahn als Punktfolge x0, y0, x1, y1, …; NaN markiert einen Punkt hinter der Kamera. */
export interface Bahnzug { id: string; punkte: Float64Array }
export interface Kandidaten { scheiben: readonly Scheibe[]; namen: readonly Rechteck[]; bahnen: readonly Bahnzug[] }

/** Abstände, die sich um höchstens so viel unterscheiden, gelten als gleich. */
const GLEICHSTAND_PX = 0.5;

export function abstandZumSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const abx = bx - ax;
  const aby = by - ay;
  const laenge2 = abx * abx + aby * aby;
  const t = laenge2 === 0 ? 0 : Math.min(Math.max(((px - ax) * abx + (py - ay) * aby) / laenge2, 0), 1);
  return Math.hypot(px - (ax + t * abx), py - (ay + t * aby));
}

/** Sonne, Planet und Zwergplanet vor Mond, dann der vordere. */
const hatVorrang = (a: Scheibe, b: Scheibe): boolean =>
  (a.istMond !== b.istMond ? !a.istMond : a.tiefe < b.tiefe);

/**
 * Rangfolge (Entwurf §4.2): Zeiger auf einer Scheibe → vorderste; in einem
 * Namen → dieser; Scheibenmitte im Fangradius → nächste; Bahn im Fangradius →
 * nächste. Der erste zutreffende Rang entscheidet.
 */
export function findeTreffer(zeiger: Punkt, k: Kandidaten, fangPx: number): string | null {
  let vorne: Scheibe | null = null;
  for (const s of k.scheiben) {
    if (Math.hypot(zeiger.x - s.x, zeiger.y - s.y) > s.radiusPx) continue;
    if (vorne === null || s.tiefe < vorne.tiefe) vorne = s;
  }
  if (vorne !== null) return vorne.id;

  for (const r of k.namen) {
    if (zeiger.x >= r.links && zeiger.x <= r.rechts && zeiger.y >= r.oben && zeiger.y <= r.unten) return r.id;
  }

  let mitte: Scheibe | null = null;
  let mitteAbstand = Infinity;
  for (const s of k.scheiben) {
    const d = Math.hypot(zeiger.x - s.x, zeiger.y - s.y);
    if (d > fangPx) continue;
    const gleich = Math.abs(d - mitteAbstand) <= GLEICHSTAND_PX;
    if (mitte === null || (!gleich && d < mitteAbstand) || (gleich && hatVorrang(s, mitte))) {
      mitte = s;
      mitteAbstand = d;
    }
  }
  if (mitte !== null) return mitte.id;

  let bahn: string | null = null;
  let bahnAbstand = fangPx;
  for (const z of k.bahnen) {
    const p = z.punkte;
    for (let i = 0; i + 3 < p.length; i += 2) {
      const ax = p[i]!;
      const bx = p[i + 2]!;
      if (Number.isNaN(ax) || Number.isNaN(bx)) continue;
      const d = abstandZumSegment(zeiger.x, zeiger.y, ax, p[i + 1]!, bx, p[i + 3]!);
      if (d <= bahnAbstand) {
        bahnAbstand = d;
        bahn = z.id;
      }
    }
  }
  return bahn;
}

/**
 * Projiziert kamerarelative Punkte (x, y, z hintereinander) in CSS-Pixel.
 * `m` ist projectionMatrix · matrixWorldInverse. Zwilling von Vector3.project
 * mit der Umrechnung aus projectToScreen in labels.ts, aber ohne Objekt je Punkt.
 */
export function projiziereZug(
  xyz: ArrayLike<number>, anzahl: number, m: Matrix4, breite: number, hoehe: number, ziel: Float64Array,
): void {
  const e = m.elements;
  for (let i = 0; i < anzahl; i++) {
    const x = xyz[i * 3]!;
    const y = xyz[i * 3 + 1]!;
    const z = xyz[i * 3 + 2]!;
    const w = e[3]! * x + e[7]! * y + e[11]! * z + e[15]!;
    if (w <= 0) {
      ziel[i * 2] = Number.NaN;
      ziel[i * 2 + 1] = Number.NaN;
      continue;
    }
    const nx = (e[0]! * x + e[4]! * y + e[8]! * z + e[12]!) / w;
    const ny = (e[1]! * x + e[5]! * y + e[9]! * z + e[13]!) / w;
    ziel[i * 2] = (nx * 0.5 + 0.5) * breite;
    ziel[i * 2 + 1] = (-ny * 0.5 + 0.5) * hoehe;
  }
}
