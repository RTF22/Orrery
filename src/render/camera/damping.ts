import type { Vec3 } from '../../sim/types';

/**
 * Kritisch gedämpfte Annäherung (Feder ohne Überschwingen).
 *
 * Die Zeitkonstante gibt an, wie lange die Annäherung ungefähr dauert.
 * Die geschlossene Form ist framerate-unabhängig und bleibt auch bei
 * großen Zeitschritten stabil — wichtig, wenn der Tab im Hintergrund war.
 */
export function smoothDamp(
  ist: number, ziel: number, geschwindigkeit: { wert: number },
  zeitkonstante: number, dt: number,
): number {
  const omega = 2 / Math.max(zeitkonstante, 1e-4);
  const x = omega * dt;
  const daempfung = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  const abstand = ist - ziel;
  const temp = (geschwindigkeit.wert + omega * abstand) * dt;
  geschwindigkeit.wert = (geschwindigkeit.wert - omega * temp) * daempfung;
  return ziel + (abstand + temp) * daempfung;
}

export function smoothDampVec3(
  ist: Vec3, ziel: Vec3, geschwindigkeit: Vec3, zeitkonstante: number, dt: number,
): Vec3 {
  const vx = { wert: geschwindigkeit.x };
  const vy = { wert: geschwindigkeit.y };
  const vz = { wert: geschwindigkeit.z };
  const out = {
    x: smoothDamp(ist.x, ziel.x, vx, zeitkonstante, dt),
    y: smoothDamp(ist.y, ziel.y, vy, zeitkonstante, dt),
    z: smoothDamp(ist.z, ziel.z, vz, zeitkonstante, dt),
  };
  geschwindigkeit.x = vx.wert;
  geschwindigkeit.y = vy.wert;
  geschwindigkeit.z = vz.wert;
  return out;
}
