import { describe, it, expect } from 'vitest';
import { cinemaTargetFor, systemRadiusKm } from './cinema';
import { plannedSceneAt } from '../../sim/director';
import { SCENES } from '../../data/scenes';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { velocityAt } from '../../sim/orbit';
import { bodyIndex } from '../../data/index';
import { DEFAULT_STATE } from '../../store';
import type { Scene } from '../../data/scenes';

const jd = DEFAULT_STATE.time.jd;
const s = DEFAULT_STATE.scale;

const abstand = (
  a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number },
): number => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

/** Eine Szene mit fester Variation, damit die Erwartungen exakt sind. */
function feste(scene: Scene) {
  return {
    scene, nummer: 0,
    azimuthDeg: scene.params.azimuthDeg,
    elevationDeg: scene.params.elevationDeg,
    distanceFactor: 1,
  };
}

const szene = (id: string): Scene => SCENES.find((x) => x.id === id)!;

describe('systemRadiusKm', () => {
  it('entspricht dem dargestellten Abstand des äußersten Planeten', () => {
    const neptun = scaledPositionAt('neptune', bodyIndex, jd, s);
    expect(systemRadiusKm(jd, s)).toBeCloseTo(Math.hypot(neptun.x, neptun.y, neptun.z), 3);
  });

  it('wächst, wenn die Abstandskompression nachlässt', () => {
    const gestaucht = systemRadiusKm(jd, { ...s, distanceExponent: 0.4 });
    const echt = systemRadiusKm(jd, { ...s, distanceExponent: 1 });
    expect(echt).toBeGreaterThan(gestaucht);
  });
});

describe('cinemaTargetFor', () => {
  it('setzt den Blickpunkt auf den Standortkörper', () => {
    const ziel = cinemaTargetFor(feste(szene('saturn-streiflicht')), 0, jd, s);
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    expect(abstand(ziel.lookAtKm, saturn)).toBeLessThan(1);
  });

  it('blickt bei gesetztem lookAtId auf den anderen Körper', () => {
    // „Von Neptun zur fernen Sonne": Standort Neptun, Blick zur Sonne.
    const ziel = cinemaTargetFor(feste(szene('ferne-sonne')), 0, jd, s);
    expect(abstand(ziel.lookAtKm, { x: 0, y: 0, z: 0 })).toBeLessThan(1);

    const neptun = scaledPositionAt('neptune', bodyIndex, jd, s);
    const radius = scaledRadius(bodyIndex.neptune!, s);
    // Die Kamera steht trotzdem bei Neptun, nicht bei der Sonne.
    expect(abstand(ziel.positionKm, neptun)).toBeLessThan(radius * 30);
  });

  it('hält den vorgegebenen Abstand in Körperradien ein', () => {
    const geplant = feste(szene('saturn-streiflicht'));
    const ziel = cinemaTargetFor(geplant, 0, jd, s);
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    const erwartet = scaledRadius(bodyIndex.saturn!, s) * geplant.scene.params.distanceInRadii;
    expect(abstand(ziel.positionKm, saturn) / erwartet).toBeCloseTo(1, 2);
  });

  it('skaliert den Abstand mit dem Variationsfaktor', () => {
    const basis = feste(szene('saturn-streiflicht'));
    const weiter = { ...basis, distanceFactor: 2 };
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    const nah = abstand(cinemaTargetFor(basis, 0, jd, s).positionKm, saturn);
    const fern = abstand(cinemaTargetFor(weiter, 0, jd, s).positionKm, saturn);
    expect(fern / nah).toBeCloseTo(2, 2);
  });

  it('dreht sich bei orbit mit der vorgegebenen Rate', () => {
    const geplant = feste(szene('saturn-streiflicht'));
    const saturn = scaledPositionAt('saturn', bodyIndex, jd, s);
    const start = cinemaTargetFor(geplant, 0, jd, s).positionKm;
    const spaeter = cinemaTargetFor(geplant, 10, jd, s).positionKm;

    // Zehn Sekunden mal 0,8 Grad je Sekunde sind acht Grad.
    const winkel = (p: { x: number; y: number }): number =>
      Math.atan2(p.y - saturn.y, p.x - saturn.x);
    const differenzGrad = ((winkel(spaeter) - winkel(start)) * 180) / Math.PI;
    expect(differenzGrad).toBeCloseTo(8, 1);
  });

  it('steht bei static still', () => {
    const geplant = feste(szene('ferne-sonne'));
    const a = cinemaTargetFor(geplant, 0, jd, s).positionKm;
    const b = cinemaTargetFor(geplant, 20, jd, s).positionKm;
    expect(abstand(a, b)).toBeLessThan(1);
  });

  it('zieht bei flyby seitlich vorbei und kommt dem Körper in der Mitte am nächsten', () => {
    const geplant = feste(szene('jupiter-vorbeiflug'));
    const jupiter = scaledPositionAt('jupiter', bodyIndex, jd, s);
    const dauer = geplant.scene.durationSec;
    const anfang = abstand(cinemaTargetFor(geplant, 0, jd, s).positionKm, jupiter);
    const mitte = abstand(cinemaTargetFor(geplant, dauer / 2, jd, s).positionKm, jupiter);
    const ende = abstand(cinemaTargetFor(geplant, dauer, jd, s).positionKm, jupiter);

    expect(mitte).toBeLessThan(anfang);
    expect(mitte).toBeLessThan(ende);
    expect(anfang / ende).toBeCloseTo(1, 1); // symmetrisch
  });

  it('steht bei chase hinter dem Körper', () => {
    const geplant = feste(szene('merkurjagd'));
    const ziel = cinemaTargetFor(geplant, 0, jd, s);
    const merkur = scaledPositionAt('mercury', bodyIndex, jd, s);
    const nachKamera = {
      x: ziel.positionKm.x - merkur.x,
      y: ziel.positionKm.y - merkur.y,
      z: ziel.positionKm.z - merkur.z,
    };
    // Die Kamera liegt entgegen der Flugrichtung: Das Skalarprodukt aus
    // Geschwindigkeit und Kameraversatz ist negativ.
    const v = velocityAt('mercury', bodyIndex, jd);
    expect(v.x * nachKamera.x + v.y * nachKamera.y + v.z * nachKamera.z).toBeLessThan(0);
  });

  it('stellt die Systemschau auf die Systemgröße ein, nicht auf den Sonnenradius', () => {
    const geplant = feste(szene('systemblick'));
    const ziel = cinemaTargetFor(geplant, 0, jd, s);
    const erwartet = systemRadiusKm(jd, s) * geplant.scene.params.distanceInRadii;
    expect(abstand(ziel.positionKm, { x: 0, y: 0, z: 0 }) / erwartet).toBeCloseTo(1, 2);
  });

  it('liefert für jede Szene des Katalogs endliche Werte', () => {
    for (const scene of SCENES) {
      for (const t of [0, scene.durationSec / 2, scene.durationSec]) {
        const ziel = cinemaTargetFor(plannedSceneAt(0, [scene], 1, false), t, jd, s);
        for (const wert of [
          ziel.positionKm.x, ziel.positionKm.y, ziel.positionKm.z,
          ziel.lookAtKm.x, ziel.lookAtKm.y, ziel.lookAtKm.z,
        ]) {
          expect(Number.isFinite(wert), `${scene.id} bei ${t}s`).toBe(true);
        }
      }
    }
  });
});
