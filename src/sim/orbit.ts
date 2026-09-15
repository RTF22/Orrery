import type { Body, BodyIndex, OrbitElements, Vec3 } from './types';
import { J2000, centuriesSinceJ2000 } from './time';
import { solveKepler, normalizeAngle } from './kepler';
import { equatorToEcliptic, poleVector, icrfKnotenVersatzDeg, axialTiltDeg } from './frames';

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

  // Mittlere Anomalie
  const M = normalizeAngle(el.LRad - el.lpRad);
  const E = solveKepler(M, el.e);

  // Position in der Bahnebene: x zum Perihel, y in Bewegungsrichtung
  const aKm = el.a * AU_KM;
  const xBahn = aKm * (Math.cos(E) - el.e);
  const yBahn = aKm * Math.sqrt(1 - el.e * el.e) * Math.sin(E);

  const { p, q } = bahnBasis(el);
  return {
    x: xBahn * p.x + yBahn * q.x,
    y: xBahn * p.y + yBahn * q.y,
    z: xBahn * p.z + yBahn * q.z,
  };
}

/**
 * Richtung zum Perizentrum (p) und die Richtung 90° weiter in
 * Bewegungsrichtung (q), in der Bezugsebene des Elementsatzes. Jeder
 * Bahnpunkt ist xBahn·p + yBahn·q — für einen Zeitpunkt
 * (positionInParentFrame) wie für die ganze Ellipse (bahnellipseRelativKm).
 */
function bahnBasis(el: ResolvedElements): { p: Vec3; q: Vec3 } {
  // Drehung: Perihelargument, dann Inklination, dann Knotenlänge
  const omega = el.lpRad - el.nodeRad;
  const cosO = Math.cos(omega), sinO = Math.sin(omega);
  const cosI = Math.cos(el.iRad), sinI = Math.sin(el.iRad);
  const cosN = Math.cos(el.nodeRad), sinN = Math.sin(el.nodeRad);
  return {
    p: {
      x: cosN * cosO - sinN * cosI * sinO,
      y: sinN * cosO + cosN * cosI * sinO,
      z: sinI * sinO,
    },
    q: {
      x: -cosN * sinO - sinN * cosI * cosO,
      y: -sinN * sinO + cosN * cosI * cosO,
      z: sinI * cosO,
    },
  };
}

/** Heliozentrische Position in Kilometern, Ekliptik J2000. */
export function positionAt(id: string, index: BodyIndex, jd: number): Vec3 {
  const body: Body | undefined = index[id];
  if (!body) throw new Error(`Unbekannter Körper: ${id}`);
  if (body.orbit === null) return { x: 0, y: 0, z: 0 };

  const { orbit, pol } = bezugsrahmen(body, body.orbit, index);
  const relativ = positionInParentFrame(orbit, jd);
  const inEkliptik = pol ? equatorToEcliptic(relativ, pol) : relativ;
  if (body.parent === null) return inEkliptik;

  const eltern = positionAt(body.parent, index, jd);
  return {
    x: eltern.x + inEkliptik.x,
    y: eltern.y + inEkliptik.y,
    z: eltern.z + inEkliptik.z,
  };
}

/**
 * Elementsatz und Pol, mit denen die Kepler-Formel eines Körpers rechnet;
 * pol = null heißt: Die Elemente beziehen sich bereits auf die Ekliptik.
 */
function bezugsrahmen(
  body: Body, orbit: OrbitElements, index: BodyIndex,
): { orbit: OrbitElements; pol: Vec3 | null } {
  // 'parentEquator': Die Elemente sind auf die Äquator- bzw. Laplace-Ebene des
  // Mutterkörpers bezogen — so gibt JPL die mittleren Elemente der Monde an.
  // Erst die Drehung in die Ekliptik macht sie mit allem anderen vergleichbar.
  // Der Mutterkörper-Lookup steht deshalb nur in diesem Zweig: Für 'ecliptic'
  // wird der Pol des Mutterkörpers nicht gebraucht, nur seine Position (die
  // über den rekursiven positionAt-Aufruf angefragt wird). Ein fehlender
  // Elternkörper fällt bei 'ecliptic' also durch dessen allgemeinen
  // "Unbekannter Körper"-Check auf statt durch eine eigene, hier ungenutzte
  // Mutterkörper-Prüfung — das hält beide Fehlermeldungen zueinander konsistent
  // (jede Fehlermeldung kommt von der Stelle, die die fehlenden Daten wirklich braucht).
  if (orbit.frame !== 'parentEquator') return { orbit, pol: null };

  if (body.parent === null) {
    throw new Error(
      `Bezugsebene 'parentEquator' ohne Mutterkörper (Körper: ${body.id}). ` +
      `Die Ebene ist ohne den Pol eines Mutterkörpers nicht definiert.`,
    );
  }
  const mutter = index[body.parent];
  if (!mutter) throw new Error(`Unbekannter Mutterkörper: ${body.parent}`);
  const pol = poleVector(mutter.physical.pole.raDeg, mutter.physical.pole.decDeg);

  // JPLs Satellitenelemente messen node — und darauf aufbauend lp und L
  // (lp = node + w, L = node + w + M, siehe Quellenblock in
  // mars-monde.ts) — vom Knoten auf dem ICRF-Äquator, nicht vom Knoten
  // auf der Ekliptik, den equatorToEcliptic() als Nullpunkt
  // verwendet (Herleitung: icrfKnotenVersatzDeg in frames.ts). Alle drei
  // Winkel bekommen deshalb denselben Versatz, bevor die allgemeine,
  // ekliptikal rechnende Kepler-Formel läuft — numerisch wirkt sich am
  // Ende nur der Versatz auf node aus (er kürzt sich in
  // omega = lp − node und in M = L − lp exakt wieder heraus), aber alle
  // drei mitzuverschieben hält den Zwischenzustand als vollständigen,
  // in sich konsistenten Elementsatz lesbar.
  const versatz = icrfKnotenVersatzDeg(pol);
  return {
    orbit: { ...orbit, node: orbit.node + versatz, lp: orbit.lp + versatz, L: orbit.L + versatz },
    pol,
  };
}

/** Kosinus und Sinus der Stützwinkel einer Ellipse, siehe ellipsenStuetzen. */
export interface EllipsenStuetzen {
  cos: Float64Array;
  sin: Float64Array;
}

/**
 * n + 1 Stützwinkel der exzentrischen Anomalie von 0 bis 2π in gleichen
 * Schritten; der letzte ist exakt der erste, damit die Ellipse schließt.
 * Einmal berechnen und für jedes Bild wiederverwenden.
 */
export function ellipsenStuetzen(n: number): EllipsenStuetzen {
  const cos = new Float64Array(n + 1);
  const sin = new Float64Array(n + 1);
  for (let i = 0; i <= n; i++) {
    const winkel = ((i % n) / n) * 2 * Math.PI;
    cos[i] = Math.cos(winkel);
    sin[i] = Math.sin(winkel);
  }
  return { cos, sin };
}

/**
 * Schreibt die momentane Bahnellipse zum Zeitpunkt jd als x,y,z-Folge in
 * ziel: relativ zum Mutterkörper, Ekliptik J2000, Kilometer. Liefert false
 * für Körper ohne Bahn.
 *
 * Abgetastet wird die exzentrische Anomalie, nicht die Zeit. Die Ellipse
 * gehört damit zu genau einem Elementsatz und trägt den Körper auch dann,
 * wenn Knoten und Perizentrum schnell wandern (Erdmond, Phobos, Mimas) —
 * eine Abtastung über einen Umlauf hielte dagegen die Bahnlage eines anderen
 * Zeitpunkts fest. Ohne Kepler-Löser und ohne Objekte je Punkt, also für
 * jedes Bild gedacht.
 */
export function bahnellipseRelativKm(
  id: string, index: BodyIndex, jd: number, stuetzen: EllipsenStuetzen, ziel: Float64Array,
): boolean {
  const body = index[id];
  if (!body) throw new Error(`Unbekannter Körper: ${id}`);
  if (body.orbit === null) return false;

  const { orbit, pol } = bezugsrahmen(body, body.orbit, index);
  const el = elementsAt(orbit, jd);
  const basis = bahnBasis(el);
  // Die Drehung in die Ekliptik ist linear: Es genügt, die beiden
  // Basisrichtungen zu drehen statt jeden Punkt.
  const p = pol ? equatorToEcliptic(basis.p, pol) : basis.p;
  const q = pol ? equatorToEcliptic(basis.q, pol) : basis.q;

  const aKm = el.a * AU_KM;
  const bKm = aKm * Math.sqrt(1 - el.e * el.e);
  const n = stuetzen.cos.length;
  for (let i = 0; i < n; i++) {
    const xBahn = aKm * (stuetzen.cos[i]! - el.e);
    const yBahn = bKm * stuetzen.sin[i]!;
    ziel[i * 3] = xBahn * p.x + yBahn * q.x;
    ziel[i * 3 + 1] = xBahn * p.y + yBahn * q.y;
    ziel[i * 3 + 2] = xBahn * p.z + yBahn * q.z;
  }
  return true;
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

const differenz = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

/**
 * Achsneigung gegen die eigene Bahn (Schiefe) in Grad, zur Epoche J2000.
 *
 * Gemessen wird die Drehachse, nicht der Nordpol des Datensatzes: Bei
 * negativer Rotationsperiode zeigt der Drehimpuls dem Pol entgegen
 * (IAU-Nordpol-Konvention, siehe venus.ts und uranus.ts), und die Neigung
 * liegt über 90° — Venus 177,4°, Uranus 97,8°, wie in den NSSDC-
 * Faktenblättern. Die Bahnnormale kommt aus relativer Position und
 * Geschwindigkeit der Simulation, damit Bezugsebene und Knotenversatz der
 * Monde (positionAt) nicht ein zweites Mal nachgebaut werden. Epoche statt
 * Uhrzeit, weil die Pole im Datensatz auf J2000 festliegen, während die
 * Bahnknoten wandern (beim Mond in 18,6 Jahren); zum laufenden Datum
 * gerechnet zeigte der Mond sonst Werte zwischen 3° und 7°. Ohne Bahn (Sonne)
 * gilt der Winkel zur Ekliptiknormale.
 */
export function achsneigungDeg(body: Body, index: BodyIndex): number {
  const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
  if (body.orbit === null || body.parent === null) return axialTiltDeg(pol);
  const r = differenz(positionAt(body.id, index, J2000), positionAt(body.parent, index, J2000));
  const v = differenz(velocityAt(body.id, index, J2000), velocityAt(body.parent, index, J2000));
  const normale = { x: r.y * v.z - r.z * v.y, y: r.z * v.x - r.x * v.z, z: r.x * v.y - r.y * v.x };
  const drehsinn = body.physical.rotationPeriodH < 0 ? -1 : 1;
  const skalar = pol.x * normale.x + pol.y * normale.y + pol.z * normale.z;
  const cos = (drehsinn * skalar) / (Math.hypot(pol.x, pol.y, pol.z) * Math.hypot(normale.x, normale.y, normale.z));
  return Math.acos(Math.min(Math.max(cos, -1), 1)) / GRAD;
}
