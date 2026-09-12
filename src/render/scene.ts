import * as THREE from 'three';
import type { RenderContext } from './renderer';
import type { AppState } from '../store/types';
import { createBodyViews } from './bodies';
import { createOrbitLines } from './orbits';
import { createStarfield } from './starfield';
import { createCameraController } from './camera/controller';
import { scaledPositionAt } from '../sim/scale';
import { bodyIndex } from '../data/index';
import { AU_KM } from '../sim/orbit';
import { kmToUnits, worldToRender } from './units';

/**
 * Abstand der Erde von der Sonne in Render-Einheiten — der Fixpunkt der
 * Abstandskompression (siehe compressDistance in sim/scale.ts), also bei
 * jedem Maßstabs-Preset identisch.
 */
const AU_EINHEITEN = kmToUnits(AU_KM);

/**
 * Zielsignatur — sie bleibt bis Task 15 unverändert. Die Szene holt sich
 * Maßstab, Sichtbarkeiten und Kameramodus selbst aus dem übergebenen
 * Zustand, statt mit jedem Task einen weiteren Parameter zu bekommen.
 */
export interface SceneHandle {
  update: (jd: number, dt: number, state: AppState) => void;
}

/**
 * Baut die Szene auf: die Körper-Meshes (Task 10) sowie ein Punktlicht an
 * der Sonnenposition, das die Planeten beleuchtet.
 */
export function buildScene(ctx: RenderContext): SceneHandle {
  const koerper = createBodyViews(ctx.scene);
  const bahnen = createOrbitLines(ctx.scene);
  // Einmalig aufgebaut: Sterne stehen fest auf einer sehr großen Kugel um den
  // Ursprung und werden — anders als Körper und Bahnen — nie pro Frame neu
  // positioniert (siehe Kommentar in starfield.ts).
  createStarfield(ctx.scene);

  const licht = new THREE.PointLight(0xffffff, 1, 0, 2);
  ctx.scene.add(licht);

  // Die Bahnform (512 Kepler-Lösungen pro Körper) wird nur neu berechnet,
  // wenn sich die Maßstabseinstellungen tatsächlich ändern. setScale im
  // Store liefert bei jeder Änderung ein frisches Objekt (Spread), daher
  // genügt ein Referenzvergleich — ohne diese Schranke liefe rebuild bei
  // jedem Frame mit, was den teuersten Teil dieser Aufgabe wäre.
  let letzterScale: AppState['scale'] | null = null;

  // Kameramodi, Dämpfung und Blickrichtung liegen vollständig im Controller;
  // die Szene braucht davon nur die Position (siehe camera/controller.ts).
  const kamera = createCameraController(ctx.camera);

  return {
    update(jd, dt, state) {
      // Die Kamera selbst bleibt konstruktionsbedingt im Ursprung (siehe
      // renderer.ts) — bewegt wird die Welt relativ zu dieser gedachten
      // Kameraposition in Kilometern.
      const { x, y, z } = kamera.update(state, jd, dt, state.scale);
      const cameraKm = new THREE.Vector3(x, y, z);

      if (state.scale !== letzterScale) {
        bahnen.rebuild(jd, state.scale);
        letzterScale = state.scale;
      }
      // Reprojektion der bereits berechneten Stützpunkte — billig, läuft
      // jeden Frame.
      bahnen.update(cameraKm, state.visible, state.display.orbits);

      koerper.update(jd, state.scale, cameraKm, state.visible);

      // Das Licht sitzt an der (kamerarelativen) Sonnenposition.
      const sonnenpositionKm = scaledPositionAt('sun', bodyIndex, jd, state.scale);
      const lichtRender = worldToRender(sonnenpositionKm, cameraKm);
      licht.position.set(lichtRender.x, lichtRender.y, lichtRender.z);

      // Kalibrierung: Bei 1 AE Abstand vom Licht soll die Bestrahlungsstärke
      // exakt state.display.brightness betragen — unabhängig vom gewählten
      // Abfallexponenten. Ohne diesen Faktor wäre „Helligkeit 1" von der
      // Render-Einheit (1 Einheit = 1000 km) abhängig: bei physikalisch
      // korrektem quadratischem Abfall und Planetenabständen in der
      // Größenordnung 10^5 Render-Einheiten bliebe jeder Körper mit
      // Helligkeit 1 vollständig unbeleuchtet.
      licht.intensity = state.display.brightness * AU_EINHEITEN ** state.display.lightFalloff;
      licht.decay = state.display.lightFalloff;
    },
  };
}
