import * as THREE from 'three';
import type { Vec3 } from '../sim/types';

/**
 * Stützpunkte einer Ringscheibe in der lokalen xy-Ebene.
 *
 * Bewusst nicht THREE.RingGeometry: Deren UV-Belegung bildet die Fläche auf
 * ein Quadrat ab. Ringtexturen sind aber radiale Streifen — eine Bildzeile
 * von der Innen- zur Außenkante. Gebraucht wird deshalb u = (r - innen) /
 * (außen - innen), v spielt keine Rolle (hier konstant 0 an der Innenkante,
 * konstant 1 an der Außenkante je Radius, siehe uvs unten).
 *
 * Reine Geometrie ohne Material: Diese Funktion kennt weder Textur noch
 * Szene und ist deshalb ohne DOM vollständig durchrechenbar.
 */
export function ringGeometrieDaten(
  innenUnits: number, aussenUnits: number, segmente: number,
): { positions: Float32Array; uvs: Float32Array; indices: Uint16Array } {
  const punkte = segmente + 1;
  const positions = new Float32Array(punkte * 2 * 3);
  const uvs = new Float32Array(punkte * 2 * 2);
  const indices = new Uint16Array(segmente * 6);

  for (let s = 0; s < punkte; s++) {
    const winkel = (s / segmente) * Math.PI * 2;
    const cos = Math.cos(winkel);
    const sin = Math.sin(winkel);
    const p = s * 6;
    positions[p] = cos * innenUnits;
    positions[p + 1] = sin * innenUnits;
    positions[p + 2] = 0;
    positions[p + 3] = cos * aussenUnits;
    positions[p + 4] = sin * aussenUnits;
    positions[p + 5] = 0;

    const u = s * 4;
    uvs[u] = 0; uvs[u + 1] = 0;
    uvs[u + 2] = 1; uvs[u + 3] = 0;
  }

  for (let s = 0; s < segmente; s++) {
    const i = s * 6;
    const a = s * 2;
    indices[i] = a; indices[i + 1] = a + 1; indices[i + 2] = a + 2;
    indices[i + 3] = a + 1; indices[i + 4] = a + 3; indices[i + 5] = a + 2;
  }

  return { positions, uvs, indices };
}

/** Dreht die lokale Ringnormale (z) auf die Polrichtung des Planeten. */
export function ringAusrichtung(pole: Vec3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(pole.x, pole.y, pole.z).normalize(),
  );
}
