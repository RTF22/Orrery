import * as THREE from 'three';
import type { RenderContext } from './renderer';
import type { AppState } from '../store/types';
import { createBodyViews } from './bodies';
import { deriveCameraKm } from './camera';
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

const URSPRUNG_KM = new THREE.Vector3(0, 0, 0);

/**
 * Baut die Szene auf: die Körper-Meshes (Task 10) sowie ein Punktlicht an
 * der Sonnenposition, das die Planeten beleuchtet.
 */
export function buildScene(ctx: RenderContext): SceneHandle {
  const koerper = createBodyViews(ctx.scene);

  const licht = new THREE.PointLight(0xffffff, 1, 0, 2);
  ctx.scene.add(licht);

  return {
    update(jd, _dt, state) {
      // Die Kamera selbst bleibt konstruktionsbedingt im Ursprung (siehe
      // renderer.ts) — bewegt wird die Welt relativ zu dieser gedachten
      // Kameraposition in Kilometern.
      const { x, y, z } = deriveCameraKm(state.camera);
      const cameraKm = new THREE.Vector3(x, y, z);

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

      // Blick zurück zum Ursprung, um den die Kamera provisorisch kreist.
      const blickzielRender = worldToRender(URSPRUNG_KM, cameraKm);
      ctx.camera.lookAt(blickzielRender.x, blickzielRender.y, blickzielRender.z);
    },
  };
}
