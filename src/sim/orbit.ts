import type { Body, BodyIndex, OrbitElements, Vec3 } from './types';
import { centuriesSinceJ2000 } from './time';
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

  const relativ = positionInParentFrame(body.orbit, jd);
  if (body.parent === null) return relativ;

  const eltern = positionAt(body.parent, index, jd);
  return {
    x: eltern.x + relativ.x,
    y: eltern.y + relativ.y,
    z: eltern.z + relativ.z,
  };
}
