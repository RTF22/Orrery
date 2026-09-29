import type { BodyIndex, Vec3 } from './types';
import { positionAt } from './orbit';

/**
 * Geozentrische Richtungen für die Himmelsansicht (Entwurf
 * docs/superpowers/specs/2026-09-29-geozentrisch-design.md, §3 und §10).
 * Rein und ohne `three`, wie `finsternis.ts`; der Aufrufer übergibt den
 * `BodyIndex`. Bezugssystem ist das ekliptikale J2000 der ganzen Anwendung.
 *
 * „Erde“ ist hier, wie überall in `positionAt`, der Bahnpunkt des
 * `earth`-Datensatzes (Erde-Mond-Schwerpunkt, siehe sim/__fixtures__/README.md);
 * der Versatz zum Erdmittelpunkt (rund 4 700 km) ist für Planetenrichtungen
 * bedeutungslos.
 */

/** Knapp unter dem Pol, Zwilling von ELEVATION_GRENZE in render/camera/flug.ts (sim/ darf render/ nicht kennen). */
const PITCH_GRENZE = Math.PI / 2 - 0.01;

/** Suchfenster der Opposition in Tagen; die längste synodische Periode (Mars, rund 780 Tage) passt hinein. */
export const OPPOSITION_SUCHE_TAGE = 800;

/** Zielgenauigkeit der Bisektion in Tagen (≈ 9 s), wie in finsternis.ts. */
const GENAUIGKEIT_TAGE = 1e-4;

/** Ein Vorzeichenwechsel zählt nur so nah an 180° als Opposition, nicht beim Sprung über ±180° an der Konjunktion. */
const NAEHE_GRAD = 10;

const GRAD = Math.PI / 180;

export function geozentrischeRichtung(id: string, index: BodyIndex, jd: number): Vec3 {
  const k = positionAt(id, index, jd);
  const e = positionAt('earth', index, jd);
  const v = { x: k.x - e.x, y: k.y - e.y, z: k.z - e.z };
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

export function richtungZuWinkeln(v: Vec3): { yaw: number; pitch: number } {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  const pitch = Math.asin(Math.min(Math.max(v.z / l, -1), 1));
  return { yaw: Math.atan2(v.y, v.x), pitch: Math.min(Math.max(pitch, -PITCH_GRENZE), PITCH_GRENZE) };
}

export function ekliptikaleLaengeGrad(v: Vec3): number {
  const l = Math.atan2(v.y, v.x) / GRAD;
  return l < 0 ? l + 360 : l;
}

/** Längendifferenz Körper minus Gegensonne in (−180°, 180°]; null bei der Längenopposition. */
function abstandZurOpposition(id: string, index: BodyIndex, jd: number): number {
  const koerper = ekliptikaleLaengeGrad(geozentrischeRichtung(id, index, jd));
  const e = positionAt('earth', index, jd);
  // Gegensonne = Richtung Sonne → Erde, also die heliozentrische Erdlage selbst.
  const gegensonne = ekliptikaleLaengeGrad(e);
  let d = koerper - gegensonne;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return d;
}

/**
 * Nächste Längenopposition ab `jdStart`: Tagesschritte über
 * OPPOSITION_SUCHE_TAGE, Vorzeichenwechsel der Längendifferenz zur
 * Gegensonne nahe 0 (nicht der Sprung über ±180° an der Konjunktion), dann
 * Bisektion bis GENAUIGKEIT_TAGE. Innere Planeten erreichen die Gegensonne
 * nie und liefern null.
 */
export function naechsteOpposition(id: string, index: BodyIndex, jdStart: number): number | null {
  let jdA = jdStart;
  let dA = abstandZurOpposition(id, index, jdA);
  for (let t = 1; t <= OPPOSITION_SUCHE_TAGE; t++) {
    const jdB = jdStart + t;
    const dB = abstandZurOpposition(id, index, jdB);
    const wechsel = (dA > 0 && dB <= 0) || (dA < 0 && dB >= 0);
    if (wechsel && Math.abs(dA) < NAEHE_GRAD && Math.abs(dB) < NAEHE_GRAD) {
      let links = jdA;
      let rechts = jdB;
      let dLinks = dA;
      while (rechts - links > GENAUIGKEIT_TAGE) {
        const mitte = (links + rechts) / 2;
        const dMitte = abstandZurOpposition(id, index, mitte);
        if ((dLinks > 0) === (dMitte > 0)) { links = mitte; dLinks = dMitte; } else { rechts = mitte; }
      }
      return (links + rechts) / 2;
    }
    jdA = jdB;
    dA = dB;
  }
  return null;
}
