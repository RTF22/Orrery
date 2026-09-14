import type { Body, BodyIndex, OrbitElements, Vec3 } from './types';
import { J2000, centuriesSinceJ2000 } from './time';
import { solveKepler, normalizeAngle } from './kepler';
import { equatorToEcliptic, poleVector, icrfKnotenVersatzDeg } from './frames';

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

  if (body.parent === null) {
    if (body.orbit.frame === 'parentEquator') {
      throw new Error(
        `Bezugsebene 'parentEquator' ohne Mutterkörper (Körper: ${id}). ` +
        `Die Ebene ist ohne den Pol eines Mutterkörpers nicht definiert.`,
      );
    }
    return positionInParentFrame(body.orbit, jd);
  }

  // 'parentEquator': Die Elemente sind auf die Äquator- bzw. Laplace-Ebene des
  // Mutterkörpers bezogen — so gibt JPL die mittleren Elemente der Monde an.
  // Erst die Drehung in die Ekliptik macht sie mit allem anderen vergleichbar.
  // Der Mutterkörper-Lookup steht deshalb nur in diesem Zweig: Für 'ecliptic'
  // wird der Pol des Mutterkörpers nicht gebraucht, nur seine Position (die
  // gleich über den rekursiven positionAt-Aufruf angefragt wird). Ein fehlender
  // Elternkörper fällt bei 'ecliptic' also durch dessen allgemeinen
  // "Unbekannter Körper"-Check auf statt durch eine eigene, hier ungenutzte
  // Mutterkörper-Prüfung — das hält beide Fehlermeldungen zueinander konsistent
  // (jede Fehlermeldung kommt von der Stelle, die die fehlenden Daten wirklich braucht).
  let orbitFuerBerechnung = body.orbit;
  let pol: Vec3 | null = null;
  if (body.orbit.frame === 'parentEquator') {
    const mutter = index[body.parent];
    if (!mutter) throw new Error(`Unbekannter Mutterkörper: ${body.parent}`);
    pol = poleVector(mutter.physical.pole.raDeg, mutter.physical.pole.decDeg);

    // JPLs Satellitenelemente messen node — und darauf aufbauend lp und L
    // (lp = node + w, L = node + w + M, siehe Quellenblock in
    // mars-monde.ts) — vom Knoten auf dem ICRF-Äquator, nicht vom Knoten
    // auf der Ekliptik, den equatorToEcliptic() unten als Nullpunkt
    // verwendet (Herleitung: icrfKnotenVersatzDeg in frames.ts). Alle drei
    // Winkel bekommen deshalb denselben Versatz, bevor die allgemeine,
    // ekliptikal rechnende Kepler-Formel läuft — numerisch wirkt sich am
    // Ende nur der Versatz auf node aus (er kürzt sich in
    // omega = lp − node und in M = L − lp exakt wieder heraus), aber alle
    // drei mitzuverschieben hält den Zwischenzustand als vollständigen,
    // in sich konsistenten Elementsatz lesbar.
    const versatz = icrfKnotenVersatzDeg(pol);
    orbitFuerBerechnung = {
      ...body.orbit,
      node: body.orbit.node + versatz,
      lp: body.orbit.lp + versatz,
      L: body.orbit.L + versatz,
    };
  }

  const relativ = positionInParentFrame(orbitFuerBerechnung, jd);
  const inEkliptik = pol ? equatorToEcliptic(relativ, pol) : relativ;

  const eltern = positionAt(body.parent, index, jd);
  return {
    x: eltern.x + inEkliptik.x,
    y: eltern.y + inEkliptik.y,
    z: eltern.z + inEkliptik.z,
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

/** Gravitationskonstante in km³ kg⁻¹ s⁻² (CODATA 2018). */
const G_KM3 = 6.674_30e-20;

/**
 * Siderische Umlaufzeit in Tagen aus dem dritten Keplerschen Gesetz mit der
 * großen Halbachse zur Epoche und den Massen von Mutterkörper und Trabant —
 * gerechnet statt tabelliert, damit der Datenblock nichts zeigt, was die
 * Simulation nicht auch so bewegt. null für die Sonne (keine Bahn).
 */
export function umlaufzeitTage(body: Body, index: BodyIndex): number | null {
  if (body.orbit === null || body.parent === null) return null;
  const mutter = index[body.parent];
  if (mutter === undefined) return null;
  const aKm = body.orbit.a * AU_KM;
  const mu = G_KM3 * (mutter.physical.massKg + body.physical.massKg);
  return (2 * Math.PI * Math.sqrt(aKm ** 3 / mu)) / 86400;
}
