import type { Body, BodyIndex, OrbitElements, Vec3 } from './types';
import { J2000, centuriesSinceJ2000 } from './time';
import { solveKepler, normalizeAngle } from './kepler';

export const AU_KM = 149_597_870.7;

const GRAD = Math.PI / 180;

export interface ResolvedElements {
  a: number;      // AE
  e: number;
  iRad: number;
  LRad: number;
  lpRad: number;
  nodeRad: number;
}

/** Schreibt die Bahnelemente linear auf den Zeitpunkt jd fort. */
export function elementsAt(orbit: OrbitElements, jd: number): ResolvedElements {
  const T = centuriesSinceJ2000(jd);
  return {
    a: orbit.a + orbit.aDot * T,
    e: orbit.e + orbit.eDot * T,
    iRad: (orbit.i + orbit.iDot * T) * GRAD,
    LRad: (orbit.L + orbit.LDot * T) * GRAD,
    lpRad: (orbit.lp + orbit.lpDot * T) * GRAD,
    nodeRad: (orbit.node + orbit.nodeDot * T) * GRAD,
  };
}

/**
 * Position relativ zum Mutterkörper, in der Bezugsebene des Elementsatzes,
 * in Kilometern.
 */
export function positionInParentFrame(orbit: OrbitElements, jd: number): Vec3 {
  const el = elementsAt(orbit, jd);

  // Perihelargument und mittlere Anomalie
  const omega = el.lpRad - el.nodeRad;
  const M = normalizeAngle(el.LRad - el.lpRad);
  const E = solveKepler(M, el.e);

  // Position in der Bahnebene: x zum Perihel, y in Bewegungsrichtung
  const aKm = el.a * AU_KM;
  const xBahn = aKm * (Math.cos(E) - el.e);
  const yBahn = aKm * Math.sqrt(1 - el.e * el.e) * Math.sin(E);

  // Drehung: Perihelargument, dann Inklination, dann Knotenlänge
  const cosO = Math.cos(omega), sinO = Math.sin(omega);
  const cosI = Math.cos(el.iRad), sinI = Math.sin(el.iRad);
  const cosN = Math.cos(el.nodeRad), sinN = Math.sin(el.nodeRad);

  const xEbene = cosO * xBahn - sinO * yBahn;
  const yEbene = sinO * xBahn + cosO * yBahn;

  return {
    x: cosN * xEbene - sinN * yEbene * cosI,
    y: sinN * xEbene + cosN * yEbene * cosI,
    z: yEbene * sinI,
  };
}

/** Heliozentrische Position in Kilometern, Ekliptik J2000. */
export function positionAt(id: string, index: BodyIndex, jd: number): Vec3 {
  const body: Body | undefined = index[id];
  if (!body) throw new Error(`Unbekannter Körper: ${id}`);
  if (body.orbit === null) return { x: 0, y: 0, z: 0 };

  // 'parentEquator' verlangt eine Drehung von der Äquatorebene des
  // Mutterkörpers in die Ekliptik. Diese Drehung ist in Phase 1 bewusst
  // nicht implementiert — kein Körper der Phase-1-Daten braucht sie (der
  // Erdmond läuft in der Ekliptik, siehe data/bodies/moon.ts), und
  // ungetestet mitgeschleppter Code in dieser Schicht wäre ein Risiko.
  // Die Jupiter- und Saturnmonde in Phase 3 benötigen sie tatsächlich;
  // bis dahin verhindert dieser Schutz, dass ein solcher Datensatz
  // stillschweigend an der falschen Stelle landet.
  if (body.orbit.frame === 'parentEquator') {
    throw new Error(
      `Bezugsebene 'parentEquator' wird noch nicht unterstützt (Körper: ${id}). ` +
      `Die Drehung von der Äquatorebene des Mutterkörpers in die Ekliptik ` +
      `folgt erst in Phase 3 mit den Jupiter- und Saturnmonden.`,
    );
  }

  const relativ = positionInParentFrame(body.orbit, jd);
  if (body.parent === null) return relativ;

  const eltern = positionAt(body.parent, index, jd);
  return {
    x: eltern.x + relativ.x,
    y: eltern.y + relativ.y,
    z: eltern.z + relativ.z,
  };
}

/**
 * Geschwindigkeit in km/s durch zentrale Differenz.
 *
 * Numerisch statt analytisch: der Fehler liegt bei einem Schritt von 60 s
 * weit unter einem Promille, und wir sparen uns eine zweite, unabhängig
 * zu pflegende Ableitung der Bahnformeln. Eingesetzt wird sie für die
 * Verfolgungskamera und die Infopanel-Anzeige.
 */
export function velocityAt(id: string, index: BodyIndex, jd: number): Vec3 {
  const dtSekunden = 60;
  const dtTage = dtSekunden / 86400;
  const vor = positionAt(id, index, jd + dtTage);
  const zurueck = positionAt(id, index, jd - dtTage);
  return {
    x: (vor.x - zurueck.x) / (2 * dtSekunden),
    y: (vor.y - zurueck.y) / (2 * dtSekunden),
    z: (vor.z - zurueck.z) / (2 * dtSekunden),
  };
}

/** Rotationsphase in Radiant; negative Perioden drehen retrograd. */
export function rotationAt(body: Body, jd: number): number {
  const stunden = (jd - J2000) * 24;
  const umdrehungen = stunden / body.physical.rotationPeriodH;
  return (body.physical.rotationAtEpochDeg * GRAD) + umdrehungen * 2 * Math.PI;
}
