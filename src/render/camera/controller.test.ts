import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createCameraController, targetFor } from './controller';
import { DEFAULT_STATE } from '../../store';
import { scaledPositionAt } from '../../sim/scale';
import { bodyIndex } from '../../data/index';
import { worldToRender } from '../units';
import type { AppState } from '../../store/types';

/** Lässt den Controller einschwingen und liefert die Kameraposition in km. */
function einschwingen(camera: THREE.PerspectiveCamera, state: AppState, jd: number) {
  const controller = createCameraController(camera);
  let position = { x: 0, y: 0, z: 0 };
  for (let i = 0; i < 600; i++) position = controller.update(state, jd, 1 / 60, state.scale);
  return position;
}

/** Bildkoordinaten des Körpers: (0,0) ist die Bildmitte, ±1 der Rand. */
function projiziere(camera: THREE.PerspectiveCamera, id: string, jd: number, state: AppState, cameraKm: { x: number; y: number; z: number }) {
  const r = worldToRender(scaledPositionAt(id, bodyIndex, jd, state.scale), cameraKm);
  camera.updateMatrixWorld(true);
  return new THREE.Vector3(r.x, r.y, r.z).project(camera);
}

describe('createCameraController', () => {
  const jd = DEFAULT_STATE.time.jd;

  it('hält den angehefteten Körper in der Bildmitte', () => {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
    camera.up.set(0, 0, 1);
    const state: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { mode: 'attached', targetId: 'earth', distance: 2e6, azimuth: 0.6, elevation: 0.5, freezeJd: null },
    };

    const cameraKm = einschwingen(camera, state, jd);
    const p = projiziere(camera, 'earth', jd, state, cameraKm);

    expect(p.x).toBeCloseTo(0, 3);
    expect(p.y).toBeCloseTo(0, 3);
  });

  it('hält den angehefteten Körper auch bei laufender Zeit mittig', () => {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
    camera.up.set(0, 0, 1);
    const state: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { mode: 'attached', targetId: 'earth', distance: 2e6, azimuth: 0.6, elevation: 0.5, freezeJd: null },
    };

    // Ein Tag je Sekunde: Die Erde legt dabei je Bild rund 40 000 km zurück.
    // Eine gedämpfte Absolutposition bliebe dauerhaft hinterher — gedämpft
    // wird deshalb nur der Versatz zum Anker (siehe controller.ts).
    const controller = createCameraController(camera);
    let jdJetzt = jd;
    let cameraKm = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 600; i++) {
      jdJetzt += 1 / 60;
      cameraKm = controller.update(state, jdJetzt, 1 / 60, state.scale);
    }

    const p = projiziere(camera, 'earth', jdJetzt, state, cameraKm);
    expect(p.x).toBeCloseTo(0, 3);
    expect(p.y).toBeCloseTo(0, 3);
  });

  it('hält den Ursprung im freien Modus in der Bildmitte', () => {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
    camera.up.set(0, 0, 1);
    const state: AppState = structuredClone(DEFAULT_STATE);

    const cameraKm = einschwingen(camera, state, jd);
    const p = projiziere(camera, 'sun', jd, state, cameraKm);

    expect(p.x).toBeCloseTo(0, 3);
    expect(p.y).toBeCloseTo(0, 3);
  });
});

describe('freier Modus mit eingefrorenem Bezugspunkt', () => {
  const jd = DEFAULT_STATE.time.jd;
  const s = DEFAULT_STATE.scale;

  const freiAufErde = (distance: number): AppState => ({
    ...structuredClone(DEFAULT_STATE),
    camera: {
      mode: 'free', targetId: 'earth', distance,
      azimuth: 0.6, elevation: 0.5, freezeJd: jd,
    },
  });

  it('hält den Bezugspunkt ortsfest, während die Zeit weiterläuft', () => {
    const state = freiAufErde(4e7);
    const beiAuswahl = scaledPositionAt('earth', bodyIndex, jd, s);

    // Hundert Tage später zeigt der freie Modus immer noch auf denselben
    // Punkt im Raum — der Unterschied zu „geheftet", wo der Körper mitgeführt
    // wird und mittig bleibt.
    const spaeter = targetFor(state, jd + 100, s).lookAtKm;
    expect(spaeter.x).toBeCloseTo(beiAuswahl.x, 6);
    expect(spaeter.y).toBeCloseTo(beiAuswahl.y, 6);
    expect(spaeter.z).toBeCloseTo(beiAuswahl.z, 6);
  });

  it('halbiert beim Zoomschritt den Abstand zum ausgewählten Körper', () => {
    const abstandZurErde = (distance: number): number => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
      camera.up.set(0, 0, 1);
      const state = freiAufErde(distance);
      const cameraKm = einschwingen(camera, state, jd);
      const erde = scaledPositionAt('earth', bodyIndex, jd, s);
      return Math.hypot(cameraKm.x - erde.x, cameraKm.y - erde.y, cameraKm.z - erde.z);
    };

    // Das ist die eigentliche Zusicherung: Ein Rastschritt am Mausrad wirkt
    // auf den ausgewählten Körper, nicht auf die Systemmitte.
    const weit = abstandZurErde(8e7);
    const nah = abstandZurErde(4e7);
    expect(nah).toBeCloseTo(weit / 2, 0);
  });

  it('lässt die Systemübersicht unverändert, solange die Sonne das Ziel ist', () => {
    // Standard: Ziel Sonne, kein eingefrorener Zeitpunkt — der Anker bleibt
    // der Ursprung, genau wie vor dieser Änderung.
    const ziel = targetFor(structuredClone(DEFAULT_STATE), jd + 100, s);
    expect(ziel.lookAtKm).toEqual({ x: 0, y: 0, z: 0 });
  });
});
