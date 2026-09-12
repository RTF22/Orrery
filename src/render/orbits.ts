import * as THREE from 'three';
import type { BodyIndex, Vec3 } from '../sim/types';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt, isSatellite } from '../sim/scale';
import { bodies, bodyIndex } from '../data/index';
import { worldToRender } from './units';

export const ORBIT_SEGMENTS = 512;

/**
 * Stützpunkte einer Bahn, bereits maßstabsskaliert.
 *
 * Abgetastet wird über eine volle Umlaufzeit, die aus LDot folgt. Dadurch
 * gilt derselbe Code für Planeten und Monde — der Mond umrundet automatisch
 * seine Erde, weil scaledPositionAt hierarchisch arbeitet.
 */
export function orbitPointsKm(
  id: string, index: BodyIndex, jd: number, s: ScaleSettings,
): Vec3[] {
  const body = index[id];
  if (!body?.orbit) return [];

  // Umlaufzeit aus der Rate der mittleren Länge: LDot ist Grad pro Jahrhundert.
  const periodeTage = 36525 / (body.orbit.LDot / 360);

  // Bei Satelliten (siehe isSatellite in sim/scale.ts) wird der Mutterkörper
  // auf jd festgehalten und nur der Relativvektor variiert. Ohne das
  // verschmierte die Mondbahn über die Eigenbewegung der Erde — in 27,3
  // Tagen zieht die Erde rund 0,46 AE weiter — zu einer Zykloide quer durchs
  // Sonnensystem, statt die Ellipse um die Erde zu zeigen.
  const umMutter = isSatellite(body);
  const ankerJetzt = umMutter ? scaledPositionAt(body.parent!, index, jd, s) : null;

  const punkte: Vec3[] = [];
  for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
    const t = jd + (i / ORBIT_SEGMENTS) * periodeTage;
    const p = scaledPositionAt(id, index, t, s);
    if (ankerJetzt === null) { punkte.push(p); continue; }
    const ankerDann = scaledPositionAt(body.parent!, index, t, s);
    punkte.push({
      x: ankerJetzt.x + (p.x - ankerDann.x),
      y: ankerJetzt.y + (p.y - ankerDann.y),
      z: ankerJetzt.z + (p.z - ankerDann.z),
    });
  }
  return punkte;
}

export interface OrbitLines {
  rebuild(jd: number, s: ScaleSettings): void;
  update(cameraKm: THREE.Vector3, sichtbar: Record<string, boolean>, an: boolean): void;
}

export function createOrbitLines(scene: THREE.Scene): OrbitLines {
  const linien = new Map<string, THREE.Line>();
  const punkteKm = new Map<string, Vec3[]>();

  for (const body of bodies) {
    if (!body.orbit) continue;
    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array((ORBIT_SEGMENTS + 1) * 3), 3));
    const linie = new THREE.Line(geometrie, new THREE.LineBasicMaterial({
      color: new THREE.Color(body.appearance.color), transparent: true, opacity: 0.45,
    }));
    // Die Positionen sind kamerarelativ und ändern sich unabhängig vom
    // Objektursprung — Three.js' eigene Bounding-Sphere-Kullung träfe hier
    // eine falsche Annahme und würde Linien fälschlich ausblenden.
    linie.frustumCulled = false;
    scene.add(linie);
    linien.set(body.id, linie);
  }

  return {
    // Teuer (512 Kepler-Löser pro Körper) — nur bei Maßstabsänderung
    // aufrufen, niemals aus dem Pro-Frame-Pfad.
    rebuild(jd, s) {
      for (const [id] of linien) punkteKm.set(id, orbitPointsKm(id, bodyIndex, jd, s));
    },
    // Billig — reprojiziert nur die bereits berechneten Stützpunkte relativ
    // zur aktuellen Kameraposition. Läuft jeden Frame.
    update(cameraKm, sichtbar, an) {
      for (const [id, linie] of linien) {
        linie.visible = an && sichtbar[id] !== false;
        if (!linie.visible) continue;
        const punkte = punkteKm.get(id) ?? [];
        const attr = linie.geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < punkte.length; i++) {
          const r = worldToRender(punkte[i]!, cameraKm);
          attr.setXYZ(i, r.x, r.y, r.z);
        }
        attr.needsUpdate = true;
      }
    },
  };
}
