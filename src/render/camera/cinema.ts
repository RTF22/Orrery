import type { Vec3 } from '../../sim/types';
import type { ScaleSettings } from '../../sim/scale';
import type { PlannedScene } from '../../sim/director';
import type { CameraTarget } from './controller';
import type { Scene } from '../../data/scenes';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { velocityAt } from '../../sim/orbit';
import { bodyIndex } from '../../data/index';

const GRAD = Math.PI / 180;

/**
 * Der äußerste Planet des Katalogs bestimmt, wie groß das System aussieht.
 * Bewusst der äußerste PLANET, nicht der äußerste Körper: Zwergplaneten
 * (kind: 'dwarf', z. B. Eris im Aphel bei rund 98 AE, weiter draußen als
 * Neptun) zählen hier ausdrücklich nicht mit — ihre teils stark exzentrischen
 * Bahnen würden den Systemradius und damit jede Kameraszene, die sich an ihm
 * orientiert, unverhältnismäßig aufblähen.
 */
const AEUSSERSTER_PLANET = 'neptune';

export function systemRadiusKm(jd: number, s: ScaleSettings): number {
  const p = scaledPositionAt(AEUSSERSTER_PLANET, bodyIndex, jd, s);
  return Math.hypot(p.x, p.y, p.z);
}

const normiere = (v: Vec3): Vec3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/** Kugelkoordinate um einen Anker, in Kilometern. */
function aufKugel(anker: Vec3, radius: number, azimutGrad: number, elevationGrad: number): Vec3 {
  const az = azimutGrad * GRAD;
  const el = elevationGrad * GRAD;
  return {
    x: anker.x + radius * Math.cos(el) * Math.cos(az),
    y: anker.y + radius * Math.cos(el) * Math.sin(az),
    z: anker.z + radius * Math.sin(el),
  };
}

/**
 * Übersetzt eine geplante Szene und die verstrichene Zeit in dasselbe
 * Ziel-Transform, das auch die drei Handmodi liefern. Die kritisch
 * gedämpfte Annäherung im Controller macht daraus von selbst eine weiche
 * Fahrt — auch über den Szenenwechsel hinweg, der hier nur ein Sprung des
 * Ziels ist.
 */
export function cinemaTargetFor(
  geplant: PlannedScene, tSek: number, jd: number, s: ScaleSettings,
): CameraTarget {
  const { scene, azimuthDeg, elevationDeg, distanceFactor } = geplant;
  const standort = scaledPositionAt(scene.targetId, bodyIndex, jd, s);
  const blickziel = scene.lookAtId === undefined
    ? standort
    : scaledPositionAt(scene.lookAtId, bodyIndex, jd, s);

  const basis = scene.distanceBasis === 'systemRadius'
    ? systemRadiusKm(jd, s)
    : scaledRadius(bodyIndex[scene.targetId]!, s);
  const radius = basis * scene.params.distanceInRadii * distanceFactor;

  const azimutJetzt = azimuthDeg + scene.params.azimuthRateDegPerSec * tSek;

  switch (scene.path) {
    case 'chase': {
      // Hinter dem Körper, entgegen seiner Flugrichtung — dieselbe
      // Konstruktion wie der Handmodus „Verfolgung", nur mit dem Abstand
      // der Szene.
      const v = normiere(velocityAt(scene.targetId, bodyIndex, jd));
      return {
        positionKm: {
          x: standort.x - v.x * radius,
          y: standort.y - v.y * radius,
          z: standort.z - v.z * radius + radius * Math.sin(elevationDeg * GRAD),
        },
        lookAtKm: blickziel,
      };
    }

    case 'flyby': {
      // Geradlinig seitlich vorbei: Der Versatz läuft von +2 auf -2 Radien,
      // der geringste Abstand liegt genau in der Mitte der Szene.
      const anteil = scene.durationSec > 0 ? tSek / scene.durationSec : 0;
      const versatz = (0.5 - anteil) * 4 * radius;
      const nah = aufKugel(standort, radius, azimutJetzt, elevationDeg);
      // Querrichtung: senkrecht zur Verbindung Körper–Kamera, in der Ekliptik.
      const quer = normiere({
        x: -(nah.y - standort.y), y: nah.x - standort.x, z: 0,
      });
      return {
        positionKm: {
          x: nah.x + quer.x * versatz,
          y: nah.y + quer.y * versatz,
          z: nah.z + quer.z * versatz,
        },
        lookAtKm: blickziel,
      };
    }

    case 'sichtlinie': {
      // Auf der Linie Blickziel → Standortkörper, davor stehend, Blick auf
      // den STANDORTKÖRPER: `lookAtId` bestimmt hier nur die Linie, nicht
      // das Blickziel (Entwurf §4). Azimut und Elevation der Szene wirken
      // als Versatz auf die Kugelkoordinaten dieser Linie, wie bei den
      // übrigen Bahntypen additiv.
      const richtung = normiere({
        x: blickziel.x - standort.x, y: blickziel.y - standort.y, z: blickziel.z - standort.z,
      });
      const az0 = Math.atan2(richtung.y, richtung.x) / GRAD;
      const el0 = Math.asin(richtung.z) / GRAD;
      return {
        positionKm: aufKugel(standort, radius, az0 + azimutJetzt, el0 + elevationDeg),
        lookAtKm: standort,
      };
    }

    case 'static':
    case 'orbit':
    case 'system':
    default:
      return {
        positionKm: aufKugel(standort, radius, azimutJetzt, elevationDeg),
        lookAtKm: blickziel,
      };
  }
}

/**
 * Der Körper, auf den eine Szene blickt (Nachtrag Flug §13.2): bei der
 * Sichtlinie der Standortkörper, sonst `lookAtId`, ohne ihn der
 * Standortkörper. Zwilling der Blickpunktwahl in cinemaTargetFor.
 */
export function blickzielVon(scene: Scene): string {
  return scene.path === 'sichtlinie' ? scene.targetId : (scene.lookAtId ?? scene.targetId);
}
