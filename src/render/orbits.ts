import * as THREE from 'three';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt, isSatellite, compressDistance } from '../sim/scale';
import { ellipsenStuetzen, bahnellipseRelativKm } from '../sim/orbit';
import { bodies, bodyIndex } from '../data/index';
import { kmToUnits } from './units';

export const ORBIT_SEGMENTS = 512;

/** Stützwinkel der Ellipse — einmal für alle Linien und Bilder. */
const STUETZEN = ellipsenStuetzen(ORBIT_SEGMENTS);

export interface OrbitLines {
  update(
    cameraKm: THREE.Vector3,
    sichtbar: Record<string, boolean>,
    an: boolean,
    jd: number,
    s: ScaleSettings,
  ): void;
  /** Die Linien je Körper-Id — für Tests und spätere Auswertung. */
  lines: Map<string, THREE.Line>;
}

export function createOrbitLines(scene: THREE.Scene): OrbitLines {
  const linien = new Map<string, THREE.Line>();
  // Ein Rechenpuffer für alle Linien: Die Punkte gehen sofort in das
  // Float32-Attribut der jeweiligen Linie, je Bild entstehen keine Objekte.
  const relativKm = new Float64Array((ORBIT_SEGMENTS + 1) * 3);

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
    lines: linien,
    // Läuft jeden Frame: Die Linie ist die momentane Bahnellipse zum
    // Zeitpunkt jd (bahnellipseRelativKm in sim/orbit.ts). Eine einmal über
    // einen Umlauf abgetastete Form blieb bei laufender Uhr und nach
    // Zeitsprüngen auf der Bahnlage ihres Aufbauzeitpunkts stehen — der
    // Erdmond löste sich nach zehn Jahren um 14 % des Bahnradius von ihr.
    update(cameraKm, sichtbar, an, jd, s) {
      for (const [id, linie] of linien) {
        linie.visible = an && sichtbar[id] !== false;
        if (!linie.visible) continue;
        if (!bahnellipseRelativKm(id, bodyIndex, jd, STUETZEN, relativKm)) continue;

        // Dieselbe Regel wie scaledPositionAt, nur für die ganze Ellipse:
        // Satelliten hängen mit sizeScale-skaliertem Relativvektor an ihrem
        // Mutterkörper, alles andere wird um die Sonne im Ursprung komprimiert.
        const body = bodyIndex[id]!;
        const anker = isSatellite(body) && body.parent !== null
          ? scaledPositionAt(body.parent, bodyIndex, jd, s)
          : null;

        const attr = linie.geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
          let x = relativKm[i * 3]!;
          let y = relativKm[i * 3 + 1]!;
          let z = relativKm[i * 3 + 2]!;
          if (anker !== null) {
            x = anker.x + x * s.sizeScale;
            y = anker.y + y * s.sizeScale;
            z = anker.z + z * s.sizeScale;
          } else {
            const r = Math.sqrt(x * x + y * y + z * z);
            const faktor = r === 0 ? 0 : compressDistance(r, s.distanceExponent) / r;
            x *= faktor;
            y *= faktor;
            z *= faktor;
          }
          attr.setXYZ(i, kmToUnits(x - cameraKm.x), kmToUnits(y - cameraKm.y), kmToUnits(z - cameraKm.z));
        }
        attr.needsUpdate = true;
      }
    },
  };
}
