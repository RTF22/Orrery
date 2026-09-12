import type { Vec3 } from './types';

/**
 * Schiefe der Ekliptik zur Epoche J2000 in Grad (IAU 2006, ε₀ = 23° 26′ 21,406″).
 * Die säkulare Änderung (rund 47″ pro Jahrhundert) bleibt außen vor: Sie liegt
 * über den Zeitraum, den diese Anwendung zeigt, weit unter der Genauigkeit der
 * verwendeten mittleren Bahnelemente.
 */
export const EKLIPTIK_SCHIEFE_GRAD = 23.4392911;

const GRAD = Math.PI / 180;
const EPS = EKLIPTIK_SCHIEFE_GRAD * GRAD;

/** Untergrenze, ab der zwei Richtungen als parallel gelten (siehe equatorToEcliptic). */
const PARALLEL_SCHWELLE = 1e-12;

/**
 * Nordpolrichtung eines Körpers als Einheitsvektor in **ekliptikalen**
 * Koordinaten J2000.
 *
 * Der IAU-Bericht gibt Pollagen in äquatorialen Koordinaten (Rektaszension,
 * Deklination) an; der gesamte Rest dieser Anwendung rechnet ekliptikal. Die
 * Umrechnung ist eine Drehung um die x-Achse (Frühlingspunkt) um die Schiefe
 * der Ekliptik.
 */
export function poleVector(raDeg: number, decDeg: number): Vec3 {
  const ra = raDeg * GRAD;
  const dec = decDeg * GRAD;
  const x = Math.cos(dec) * Math.cos(ra);
  const y = Math.cos(dec) * Math.sin(ra);
  const z = Math.sin(dec);
  return {
    x,
    y: y * Math.cos(EPS) + z * Math.sin(EPS),
    z: -y * Math.sin(EPS) + z * Math.cos(EPS),
  };
}

/** Achsneigung in Grad: der Winkel zwischen Pol und Ekliptiknormale. */
export function axialTiltDeg(pole: Vec3): number {
  const betrag = Math.sqrt(pole.x ** 2 + pole.y ** 2 + pole.z ** 2);
  const cos = Math.min(Math.max(pole.z / betrag, -1), 1);
  return Math.acos(cos) / GRAD;
}

/**
 * Dreht einen Vektor aus der Äquatorebene eines Körpers in die Ekliptik.
 *
 * Die lokale Basis: z zeigt zum Pol, x in den aufsteigenden Knoten (die
 * Schnittgerade von Äquator- und Ekliptikebene, als Kreuzprodukt aus
 * Ekliptiknormale und Pol), y vervollständigt das Rechtssystem.
 *
 * Fällt der Pol mit der Ekliptiknormale zusammen, gibt es keinen Knoten und
 * das Kreuzprodukt hat die Länge null. Dann sind beide Ebenen identisch und
 * die Drehung ist die Identität — dieser Zweig ist kein Sonderfall, sondern
 * die korrekte Antwort.
 */
export function equatorToEcliptic(v: Vec3, pole: Vec3): Vec3 {
  const pb = Math.sqrt(pole.x ** 2 + pole.y ** 2 + pole.z ** 2);
  const z = { x: pole.x / pb, y: pole.y / pb, z: pole.z / pb };

  // Kreuzprodukt (0,0,1) × z — die dritte Komponente ist konstruktionsbedingt null.
  const kx = -z.y;
  const ky = z.x;
  const kb = Math.sqrt(kx * kx + ky * ky);
  if (kb < PARALLEL_SCHWELLE) return { ...v };

  const x = { x: kx / kb, y: ky / kb, z: 0 };
  const y = {
    x: z.y * x.z - z.z * x.y,
    y: z.z * x.x - z.x * x.z,
    z: z.x * x.y - z.y * x.x,
  };

  return {
    x: x.x * v.x + y.x * v.y + z.x * v.z,
    y: x.y * v.x + y.y * v.y + z.y * v.z,
    z: x.z * v.x + y.z * v.y + z.z * v.z,
  };
}
