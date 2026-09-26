import type { Body, BodyIndex, Vec3 } from './types';
import { positionAt, AU_KM } from './orbit';

export interface ScaleSettings {
  /** Faktor auf alle Körperradien; 1 = echt. */
  sizeScale: number;
  /** Exponent k der Abstandskompression; 1 = maßstabsgetreu. */
  distanceExponent: number;
  /** Zusätzlicher Faktor nur für die Sonne; 1 = ungedämpft. */
  sunDamping: number;
}

export const SCALE_PRESETS: Record<'realistisch' | 'schaubild' | 'kompakt', ScaleSettings> = {
  realistisch: { sizeScale: 1, distanceExponent: 1.0, sunDamping: 1.0 },
  schaubild: { sizeScale: 50, distanceExponent: 0.6, sunDamping: 0.35 },
  kompakt: { sizeScale: 200, distanceExponent: 0.4, sunDamping: 0.2 },
};

/**
 * Potenzkompression mit Fixpunkt bei 1 AE:
 *   r' = A * (r / A)^k
 * Bei k = 1 die Identität. Sinkendes k staucht außen stark, innen kaum —
 * die Erde bleibt ortsfest, wodurch der Regler beim Ziehen ruhig wirkt.
 */
export function compressDistance(rKm: number, k: number): number {
  if (rKm <= 0) return 0;
  return AU_KM * Math.pow(rKm / AU_KM, k);
}

/**
 * Ein Satellit ist ein Körper, der nicht die Sonne umkreist (also z. B. ein
 * Mond). Sein Anzeige-Versatz zum Mutterkörper skaliert deshalb mit
 * sizeScale statt mit der Abstandskompression — siehe scaledPositionAt.
 */
export function isSatellite(body: Body): boolean {
  return body.parent !== null && body.parent !== 'sun';
}

/** Dargestellter Radius in km. Nur die Sonne wird zusätzlich gedämpft. */
export function scaledRadius(body: Body, s: ScaleSettings): number {
  const daempfung = body.kind === 'star' ? s.sunDamping : 1;
  return body.physical.radiusKm * s.sizeScale * daempfung;
}

/** Abstand, aus dem ein Körper formatfüllend, aber vollständig zu sehen ist. */
export const FOKUS_FAKTOR = 8;
export const FOKUS_MIN_KM = 1e4;

/**
 * Kamerafokus auf einen Körper: Abstand nach dargestelltem Radius, mit
 * Mindestabstand für sehr kleine Körper. Hängt nur von Körper- und
 * Maßstabsdaten ab, deshalb hier statt bei den Aufrufern (ui/kamerafahrt.ts,
 * store/deeplink.ts) — beide nutzen dieselbe Formel für denselben Zweck.
 */
export function fokusAbstand(body: Body, s: ScaleSettings): number {
  return Math.max(scaledRadius(body, s) * FOKUS_FAKTOR, FOKUS_MIN_KM);
}

/**
 * Dargestellte Position in km — hierarchisch.
 *
 * Körper um die Sonne: Richtung bleibt, der heliozentrische Betrag wird
 * komprimiert. Satelliten (isSatellite): Position des Mutterkörpers plus
 * der mit sizeScale skalierte Relativvektor. Wäre der Mondabstand ebenfalls
 * komprimiert, zöge k = 0.4 den Mond auf 40 % heran, während die Erde um
 * sizeScale wächst — der Mond läge im Planeten. Durch die Kopplung an
 * sizeScale bleibt das Verhältnis Planetenradius zu Mondbahn bei jedem
 * Preset exakt korrekt.
 */
export function scaledPositionAt(
  id: string, index: BodyIndex, jd: number, s: ScaleSettings,
): Vec3 {
  const body = index[id];
  if (!body) throw new Error(`Unbekannter Körper: ${id}`);
  if (body.orbit === null) return { x: 0, y: 0, z: 0 };

  if (isSatellite(body) && body.parent !== null) {
    const eltern = scaledPositionAt(body.parent, index, jd, s);
    const echtEltern = positionAt(body.parent, index, jd);
    const echtSelbst = positionAt(id, index, jd);
    return {
      x: eltern.x + (echtSelbst.x - echtEltern.x) * s.sizeScale,
      y: eltern.y + (echtSelbst.y - echtEltern.y) * s.sizeScale,
      z: eltern.z + (echtSelbst.z - echtEltern.z) * s.sizeScale,
    };
  }

  const echt = positionAt(id, index, jd);
  const r = Math.sqrt(echt.x ** 2 + echt.y ** 2 + echt.z ** 2);
  if (r === 0) return { x: 0, y: 0, z: 0 };
  const faktor = compressDistance(r, s.distanceExponent) / r;
  return { x: echt.x * faktor, y: echt.y * faktor, z: echt.z * faktor };
}
