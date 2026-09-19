import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createCameraController, targetFor, letztePose } from './controller';
import { DEFAULT_STATE } from '../../store';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { blickAus, kugelUm, laenge, minus, normiert, plus, punkt } from './flug';
import { bodyIndex } from '../../data/index';
import { worldToRender } from '../units';
import type { AppState } from '../../store/types';
import type { Vec3 } from '../../sim/types';

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
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
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
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
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
      ...DEFAULT_STATE.camera,
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

describe('Flug', () => {
  const jd = DEFAULT_STATE.time.jd;
  const s = DEFAULT_STATE.scale;
  const neueKamera = (): THREE.PerspectiveCamera => {
    const c = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
    c.up.set(0, 0, 1);
    return c;
  };
  const mitFlug = (refId: string, lage: Vec3, blick: { yaw: number; pitch: number }): AppState => ({
    ...structuredClone(DEFAULT_STATE),
    camera: { ...DEFAULT_STATE.camera, mode: 'fly', fly: { refId, ...lage, ...blick } },
  });
  const winkel = (a: Vec3, b: Vec3): number =>
    Math.acos(Math.min(1, punkt(normiert(a), normiert(b))));

  it('tritt ohne Sprung in den Flug ein', () => {
    const c = createCameraController(neueKamera());
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
    };
    let vorher = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 600; i++) vorher = c.update(geheftet, jd, 1 / 60, s);
    const gezeigt = letztePose()!;
    // Die Fluglage, wie die Steuerung sie setzt: gezeigte Lage relativ zur Erde.
    const erde = scaledPositionAt('earth', bodyIndex, jd, s);
    const danach = c.update(mitFlug('earth', minus(gezeigt.positionKm, erde), blickAus(gezeigt.blick)), jd, 1 / 60, s);
    expect(laenge(minus(danach, vorher))).toBeLessThan(1e-3);
    expect(winkel(letztePose()!.blick, gezeigt.blick)).toBeLessThan(1e-6);
  });

  it('führt die Kamera mit dem Bezugskörper mit: Saturn bleibt bei laufender Zeit an seinem Platz im Bild', () => {
    const kam = neueKamera();
    const c = createCameraController(kam);
    const r = scaledRadius(bodyIndex.saturn!, s);
    const state = mitFlug('saturn', { x: 6 * r, y: 2 * r, z: r }, { yaw: Math.PI + 0.3, pitch: -0.1 });
    let jdJetzt = jd;
    let cameraKm = c.update(state, jdJetzt, 1 / 60, s);
    const anfang = projiziere(kam, 'saturn', jdJetzt, state, cameraKm);
    // Zehn Tage je Sekunde, zehn Sekunden lang.
    for (let i = 0; i < 600; i++) {
      jdJetzt += 10 / 60;
      cameraKm = c.update(state, jdJetzt, 1 / 60, s);
    }
    const ende = projiziere(kam, 'saturn', jdJetzt, state, cameraKm);
    expect(ende.x).toBeCloseTo(anfang.x, 4);
    expect(ende.y).toBeCloseTo(anfang.y, 4);
  });

  it('wechselt den Bezug ohne Scheinversatz', () => {
    const c = createCameraController(neueKamera());
    const erde = scaledPositionAt('earth', bodyIndex, jd, s);
    const mond = scaledPositionAt('moon', bodyIndex, jd, s);
    const welt = plus(erde, { x: 3e6, y: 0, z: 0 });
    const blick = { yaw: 1, pitch: 0.2 };
    for (let i = 0; i < 120; i++) c.update(mitFlug('earth', minus(welt, erde), blick), jd, 1 / 60, s);
    const vorher = c.update(mitFlug('earth', minus(welt, erde), blick), jd, 1 / 60, s);
    const danach = c.update(mitFlug('moon', minus(welt, mond), blick), jd, 1 / 60, s);
    expect(laenge(minus(danach, vorher))).toBeLessThan(1e-3);
  });

  it('verlässt den Flug ohne Sprung; der Blick schwenkt gedämpft auf das neue Ziel', () => {
    const c = createCameraController(neueKamera());
    for (let i = 0; i < 120; i++) c.update(mitFlug('earth', { x: 3e6, y: 1e6, z: 0 }, { yaw: 2, pitch: 0 }), jd, 1 / 60, s);
    const gezeigt = letztePose()!;
    const mond = scaledPositionAt('moon', bodyIndex, jd, s);
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'moon', ...kugelUm(gezeigt.positionKm, mond) },
    };
    const erstes = c.update(geheftet, jd, 1 / 60, s);
    expect(laenge(minus(erstes, gezeigt.positionKm))).toBeLessThan(1);
    expect(winkel(letztePose()!.blick, gezeigt.blick)).toBeLessThan(0.05);
    for (let i = 0; i < 180; i++) c.update(geheftet, jd, 1 / 60, s);
    const p = letztePose()!;
    expect(winkel(p.blick, minus(mond, p.positionKm))).toBeLessThan(1e-3);
  });

  it('nimmt im allerersten Bild die Fluglage aus dem Store (Link im Flugmodus)', () => {
    const c = createCameraController(neueKamera());
    const p = c.update(mitFlug('mars', { x: 1e6, y: -2e6, z: 5e5 }, { yaw: 0.4, pitch: 0.1 }), jd, 1 / 60, s);
    const erwartet = plus(scaledPositionAt('mars', bodyIndex, jd, s), { x: 1e6, y: -2e6, z: 5e5 });
    expect(laenge(minus(p, erwartet))).toBeLessThan(1e-3);
  });

  it('tritt auch bei laufender Uhr ohne Sprung relativ zum Körper in den Flug ein', () => {
    const c = createCameraController(neueKamera());
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
    };
    const schritt = 365 / 60;
    let jdJetzt = jd;
    for (let i = 0; i < 600; i++) { jdJetzt += schritt; c.update(geheftet, jdJetzt, 1 / 60, s); }
    const gezeigt = letztePose()!;
    const erdeVorher = scaledPositionAt('earth', bodyIndex, gezeigt.jd, s);
    const relativVorher = minus(gezeigt.positionKm, erdeVorher);
    jdJetzt += schritt;
    const danach = c.update(mitFlug('earth', relativVorher, blickAus(gezeigt.blick)), jdJetzt, 1 / 60, s);
    const relativDanach = minus(danach, scaledPositionAt('earth', bodyIndex, jdJetzt, s));
    expect(laenge(minus(relativDanach, relativVorher))).toBeLessThan(1e-3);
  });

  it('verlässt den Flug auch bei laufender Uhr ohne Sprung relativ zum neuen Ziel', () => {
    const c = createCameraController(neueKamera());
    const schritt = 365 / 60;
    let jdJetzt = jd;
    for (let i = 0; i < 120; i++) {
      jdJetzt += schritt;
      c.update(mitFlug('earth', { x: 3e6, y: 1e6, z: 0 }, { yaw: 2, pitch: 0 }), jdJetzt, 1 / 60, s);
    }
    const gezeigt = letztePose()!;
    const mondVorher = scaledPositionAt('moon', bodyIndex, gezeigt.jd, s);
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'moon', ...kugelUm(gezeigt.positionKm, mondVorher) },
    };
    jdJetzt += schritt;
    const erstes = c.update(geheftet, jdJetzt, 1 / 60, s);
    const relativDanach = minus(erstes, scaledPositionAt('moon', bodyIndex, jdJetzt, s));
    expect(laenge(minus(relativDanach, minus(gezeigt.positionKm, mondVorher)))).toBeLessThan(1);
  });
});
