import * as THREE from 'three';
import type { Vec3 } from '../../sim/types';
import type { AppState } from '../../store/types';
import type { ScaleSettings } from '../../sim/scale';
import { scaledPositionAt } from '../../sim/scale';
import { velocityAt } from '../../sim/orbit';
import { bodyIndex } from '../../data/index';
import { smoothDampVec3 } from './damping';
import { worldToRender } from '../units';

export interface CameraTarget { positionKm: Vec3; lookAtKm: Vec3 }

const normiere = (v: Vec3): Vec3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/** Ziel-Transform je Modus — hier steckt der ganze Modusunterschied. */
export function targetFor(state: AppState, jd: number, s: ScaleSettings): CameraTarget {
  const { mode, targetId, distance, azimuth, elevation, freezeJd } = state.camera;
  const anker = scaledPositionAt(targetId, bodyIndex, jd, s);

  if (mode === 'follow') {
    // Hinter dem Körper, ausgerichtet an seinem Geschwindigkeitsvektor.
    const v = normiere(velocityAt(targetId, bodyIndex, jd));
    return {
      positionKm: {
        x: anker.x - v.x * distance,
        y: anker.y - v.y * distance,
        z: anker.z - v.z * distance + distance * 0.25,
      },
      lookAtKm: anker,
    };
  }

  // 'free' und 'attached' teilen sich die Kugelkoordinaten; der Unterschied
  // liegt allein im Anker. Geheftet führt den Körper mit, frei friert seine
  // Position zum Zeitpunkt der Auswahl ein: Gedreht und gezoomt wird um
  // diesen Punkt, der Körper zieht mit der Zeit daran vorbei. Ohne
  // eingefrorenen Zeitpunkt bleibt es beim Ursprung, solange die Sonne das
  // Ziel ist — der Standardfall „Systemübersicht".
  const basis = mode === 'attached'
    ? anker
    : scaledPositionAt(targetId, bodyIndex, freezeJd ?? jd, s);
  return {
    positionKm: {
      x: basis.x + distance * Math.cos(elevation) * Math.cos(azimuth),
      y: basis.y + distance * Math.cos(elevation) * Math.sin(azimuth),
      z: basis.z + distance * Math.sin(elevation),
    },
    lookAtKm: basis,
  };
}

export interface CameraController {
  /** Liefert die Kameraposition in km — Grundlage aller worldToRender-Aufrufe. */
  update(state: AppState, jd: number, dt: number, s: ScaleSettings): Vec3;
}

export function createCameraController(camera: THREE.PerspectiveCamera): CameraController {
  // Gedämpft wird der Versatz **zum Anker**, nicht die absolute Position:
  // Bei hoher Zeitraffung legt die Erde je Sekunde Millionen Kilometer
  // zurück; eine gedämpfte Absolutposition bliebe dauerhaft hinterher und
  // der angeheftete Körper liefe aus der Bildmitte.
  let istOffset: Vec3 = { x: 0, y: 0, z: 3e8 };
  // Den Sprung beim Wechsel von Ziel oder Modus fängt ein Restversatz auf,
  // der gegen null abklingt — daraus entsteht der weiche Überflug, ohne
  // dass ein einziger Modusübergang eigens programmiert wäre.
  let versatz: Vec3 = { x: 0, y: 0, z: 0 };
  const vOffset: Vec3 = { x: 0, y: 0, z: 0 };
  const vVersatz: Vec3 = { x: 0, y: 0, z: 0 };
  const NULLPUNKT: Vec3 = { x: 0, y: 0, z: 0 };

  let letzterAnker: Vec3 | null = null;
  let letzterSchluessel = '';

  return {
    update(state, jd, dt, s) {
      const ziel = targetFor(state, jd, s);
      // In allen drei Modi ist der Blickpunkt zugleich der Anker, an dem die
      // Kamera hängt (Ursprung im freien Modus, sonst der Zielkörper).
      const anker = ziel.lookAtKm;
      const zielOffset: Vec3 = {
        x: ziel.positionKm.x - anker.x,
        y: ziel.positionKm.y - anker.y,
        z: ziel.positionKm.z - anker.z,
      };

      const schluessel =
        `${state.camera.mode}|${state.camera.targetId}|${state.camera.freezeJd ?? 'jetzt'}`;
      if (letzterAnker !== null && schluessel !== letzterSchluessel) {
        versatz = {
          x: versatz.x + letzterAnker.x - anker.x,
          y: versatz.y + letzterAnker.y - anker.y,
          z: versatz.z + letzterAnker.z - anker.z,
        };
      }
      letzterSchluessel = schluessel;
      letzterAnker = anker;

      istOffset = smoothDampVec3(istOffset, zielOffset, vOffset, 0.45, dt);
      versatz = smoothDampVec3(versatz, NULLPUNKT, vVersatz, 0.45, dt);

      const istBlick: Vec3 = {
        x: anker.x + versatz.x,
        y: anker.y + versatz.y,
        z: anker.z + versatz.z,
      };
      const istPosition: Vec3 = {
        x: istBlick.x + istOffset.x,
        y: istBlick.y + istOffset.y,
        z: istBlick.z + istOffset.z,
      };

      // Die Kamera bleibt im Ursprung; sie schaut auf den kamerarelativen Blickpunkt.
      const blick = worldToRender(istBlick, istPosition);
      camera.position.set(0, 0, 0);
      camera.lookAt(blick.x, blick.y, blick.z);

      // Nahe und ferne Ebene an die Zielentfernung anpassen.
      const abstand = Math.hypot(blick.x, blick.y, blick.z);
      camera.near = Math.max(abstand * 1e-5, 1e-4);
      camera.far = Math.max(abstand * 1e4, 1e9);
      camera.updateProjectionMatrix();

      return istPosition;
    },
  };
}
