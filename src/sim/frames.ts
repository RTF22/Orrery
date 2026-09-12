import type { Vec3 } from './types';

/**
 * Schiefe der Ekliptik zur Epoche J2000 in Grad (IAU-1976/2000, ε₀ = 23° 26′ 21,448″).
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

/**
 * ICRF-Äquatorpol (Himmelsnordpol) in ekliptikalen Koordinaten J2000 — der
 * Sonderfall poleVector(beliebige Rektaszension, 90°): Bei Deklination 90°
 * ist die Rektaszension bedeutungslos. Ergebnis (0, sin ε, cos ε), siehe der
 * erste poleVector-Test in frames.test.ts.
 */
const ICRF_AEQUATORPOL: Vec3 = poleVector(0, 90);

/** Kreuzprodukt zweier Richtungen, normiert; null bei (annähernd) paralleler Eingabe. */
function knotenrichtung(referenzNormale: Vec3, pole: Vec3): Vec3 | null {
  const kx = referenzNormale.y * pole.z - referenzNormale.z * pole.y;
  const ky = referenzNormale.z * pole.x - referenzNormale.x * pole.z;
  const kz = referenzNormale.x * pole.y - referenzNormale.y * pole.x;
  const kb = Math.sqrt(kx * kx + ky * ky + kz * kz);
  if (kb < PARALLEL_SCHWELLE) return null;
  return { x: kx / kb, y: ky / kb, z: kz / kb };
}

/**
 * Winkel vom Knoten einer Äquatorebene auf der Ekliptik zu ihrem Knoten auf
 * dem ICRF-Äquator, im Rechtssinn um pole gemessen (Grad).
 *
 * Hintergrund: JPLs „Planetary Satellite Mean Elements" (Quelle der
 * Mondbahnelemente, siehe Quellenblock in data/bodies/mars-monde.ts)
 * definieren ihre Spalte „node" wörtlich als „longitude of the ascending
 * node measured from the node of the reference plane on the ICRF equator"
 * (Glossar unter https://ssd.jpl.nasa.gov/sats/elem/). equatorToEcliptic()
 * oben baut seine x-Achse dagegen als Schnittlinie von Äquator- und
 * EKLIPTIKebene — ein anderer Nullpunkt für dieselbe Winkelangabe. Für Mars
 * beträgt der Unterschied rechnerisch −40,858°; das deckt sich mit der in
 * Task 6 gemessenen Positionsabweichung von Phobos/Deimos gegen JPL
 * Horizons auf 0,02° genau (siehe Task-6-Bericht im SDD-Ordner).
 *
 * equatorToEcliptic() selbst bleibt bewusst unverändert: Seine Basiswahl
 * ist in sich mathematisch korrekt (die Schnittlinie zweier Ebenen ist
 * wohldefiniert) und durch den Vollvektor-Test in frames.test.ts von Hand
 * hergeleitet abgesichert. Der Fehler liegt nicht in dieser Basis, sondern
 * darin, dass die JPL-Bahnelemente eine ANDERE Basis referenzieren — die
 * Korrektur gehört deshalb auf die Bahnelemente (node, lp, L in orbit.ts),
 * nicht auf equatorToEcliptic.
 *
 * Fällt pole mit der Ekliptiknormale ODER mit dem ICRF-Pol zusammen, ist
 * einer der beiden Knoten nicht definiert (Kreuzprodukt der Länge null) —
 * dann liefert die Funktion 0, mangels eines bestimmbaren Versatzes.
 */
export function icrfKnotenVersatzDeg(pole: Vec3): number {
  const eklKnoten = knotenrichtung({ x: 0, y: 0, z: 1 }, pole);
  const icrfKnoten = knotenrichtung(ICRF_AEQUATORPOL, pole);
  if (!eklKnoten || !icrfKnoten) return 0;

  const cosDelta =
    eklKnoten.x * icrfKnoten.x + eklKnoten.y * icrfKnoten.y + eklKnoten.z * icrfKnoten.z;
  const kreuz = {
    x: eklKnoten.y * icrfKnoten.z - eklKnoten.z * icrfKnoten.y,
    y: eklKnoten.z * icrfKnoten.x - eklKnoten.x * icrfKnoten.z,
    z: eklKnoten.x * icrfKnoten.y - eklKnoten.y * icrfKnoten.x,
  };
  const polBetrag = Math.sqrt(pole.x ** 2 + pole.y ** 2 + pole.z ** 2);
  const sinDelta = (pole.x * kreuz.x + pole.y * kreuz.y + pole.z * kreuz.z) / polBetrag;

  return (Math.atan2(sinDelta, cosDelta) * 180) / Math.PI;
}
