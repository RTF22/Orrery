import * as THREE from 'three';
import type { Vec3 } from '../../sim/types';
import type { AppState } from '../../store/types';
import type { ScaleSettings } from '../../sim/scale';
import { scaledPositionAt } from '../../sim/scale';
import { velocityAt } from '../../sim/orbit';
import { bodyIndex } from '../../data/index';
import { smoothDampVec3 } from './damping';
import { plannedSceneAt } from '../../sim/director';
import { SCENES } from '../../data/scenes';
import { cinemaTargetFor } from './cinema';
import { kmToUnits, worldToRender } from '../units';
import { blickVektor, laenge, mal, minus, normiert, plus } from './flug';
import type { GezeigtePose } from './flug';

export interface CameraTarget { positionKm: Vec3; lookAtKm: Vec3 }

const normiere = (v: Vec3): Vec3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/**
 * Ziel-Transform je Modus — hier steckt der ganze Modusunterschied. Der Flug
 * (`fly`) hat einen eigenen Zweig in `update`; `targetFor` beschreibt die
 * Umlauf- und Kinomodi.
 */
export function targetFor(state: AppState, jd: number, s: ScaleSettings): CameraTarget {
  const { mode, targetId, distance, azimuth, elevation, freezeJd } = state.camera;
  const anker = scaledPositionAt(targetId, bodyIndex, jd, s);

  if (mode === 'cinema') {
    // Im Kino-Modus gibt der Director das Ziel vor. Szene und Laufzeit
    // stehen im Zustand, die Kamerafahrt entsteht daraus als reine
    // Funktion — und die Dämpfung unten macht aus dem Szenensprung von
    // selbst einen weichen Überflug.
    const geplant = plannedSceneAt(
      state.cinema.nummer, SCENES, state.cinema.seed, state.cinema.shuffle,
    );
    return cinemaTargetFor(geplant, state.cinema.elapsedSec, jd, s);
  }

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
  // Position ein: Gedreht und gezoomt wird um den Punkt, an dem der Körper
  // beim Umschalten auf Frei im Kamera-Panel gerade stand (ebenso beim Beenden
  // eines Kinos ohne gemerkten Zustand, stopCinema), er zieht mit der
  // Zeit daran vorbei. Eine Kamerafahrt (fahreZu/fahreZuSystem) endet immer
  // geheftet und setzt keinen eingefrorenen Zeitpunkt (Entwurf Klickflächen
  // §6). Ohne eingefrorenen Zeitpunkt bleibt es beim Ursprung, solange die
  // Sonne das Ziel ist — der Standardfall „Systemübersicht".
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

/**
 * Dämpfung im Flug: kürzer als die 0,45 s der Umlaufmodi, damit Tasten und
 * Mausblick direkt wirken (Entwurf Flug und Controller §12.2, Punkt 7).
 */
export const FLUG_DAEMPFUNG_S = 0.15;

/**
 * Dämpfung einer Wiederherstellung in den Flug (Nachtrag Flug §13.4): Beginnt
 * der Flug nicht an der gezeigten Lage (Kino beenden mit gemerktem Flug,
 * Ansicht im Flugmodus laden), gleitet die Kamera so ruhig hinüber wie bei
 * einem Moduswechsel der Umlaufmodi, statt in einem Drittel der Zeit.
 */
export const FLUG_UEBERGANG_S = 0.45;
/** Ab diesem Rest gilt ein Übergang als angekommen: Anteil der Lage, Länge der Blickdifferenz. */
export const UEBERGANG_REST = 1e-3;

/** Ist die gedämpfte Fluglage noch nicht bei der Solllage aus dem Store angekommen? */
function nochUnterwegs(lage: Vec3, blick: Vec3, fly: AppState['camera']['fly']): boolean {
  const soll = { x: fly.x, y: fly.y, z: fly.z };
  return laenge(minus(soll, lage)) > UEBERGANG_REST * Math.max(laenge(soll), 1)
    || laenge(minus(blickVektor(fly), blick)) > UEBERGANG_REST;
}

let zuletztGezeigt: GezeigtePose | null = null;
let wiederherstellungGemeldet = false;

/**
 * Meldet, dass eine gespeicherte Fluglage in den Store geschrieben wurde
 * (Ansicht laden). Im laufenden Flug gleitet die Kamera dann wie beim
 * Eintritt mit FLUG_UEBERGANG_S hinüber, sofern die Lage abweicht; ohne
 * Meldung hielte sie den Sprung für einen Flugschritt und nähme die 0,15 s
 * (Abnahme Flug Etappe 2, §7 Frage 4, Entscheidung von Jens 19.09.2026).
 * Der Eintritt in den Flug erkennt Wiederherstellungen selbst; das nächste
 * Bild verbraucht die Meldung in jedem Modus.
 */
export function flugWiederherstellungMelden(): void {
  wiederherstellungGemeldet = true;
}

/**
 * Gezeigte Kameralage des zuletzt gerechneten Bildes samt jd des Bildes
 * (Entwurf Flug und Controller §6.1). Flug, Drehen mit Shift und Kamerafahrt
 * beginnen dort, damit die Kamera beim Moduswechsel nicht springt; null vor
 * dem ersten Bild.
 */
export function letztePose(): GezeigtePose | null {
  return zuletztGezeigt;
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

  // Flug: Lage relativ zum Bezugskörper und Blickvektor, beide gedämpft.
  let imFlug = false;
  let flugRef = '';
  let flugLage: Vec3 = { x: 0, y: 0, z: 0 };
  let flugBlick: Vec3 = { x: 1, y: 0, z: 0 };
  const vLage: Vec3 = { x: 0, y: 0, z: 0 };
  const vBlick: Vec3 = { x: 0, y: 0, z: 0 };
  let pose: GezeigtePose | null = null;
  // Wiederherstellung in den Flug läuft noch (Nachtrag §13.4).
  let uebergang = false;

  const nullen = (v: Vec3): void => { v.x = 0; v.y = 0; v.z = 0; };
  const schluesselVon = (state: AppState): string =>
    `${state.camera.mode}|${state.camera.targetId}|${state.camera.freezeJd ?? 'jetzt'}`;
  const merke = (p: GezeigtePose): void => { pose = p; zuletztGezeigt = p; };

  /** Kamera im Ursprung, Blick entlang `richtung` (Render-Einheiten), Ebenen nach `abstand`. */
  const ausrichten = (richtung: Vec3, abstand: number): void => {
    camera.position.set(0, 0, 0);
    camera.lookAt(richtung.x, richtung.y, richtung.z);
    camera.near = Math.max(abstand * 1e-5, 1e-4);
    camera.far = Math.max(abstand * 1e4, 1e9);
    camera.updateProjectionMatrix();
  };

  /**
   * Flug (Entwurf Flug und Controller §3, §6.1): Anker ist der mitgeführte
   * Bezugskörper. Der Eintritt übernimmt die gezeigte Lage; ein Bezugswechsel
   * rechnet die gedämpfte Lage auf den neuen Körper um. Beides ohne Sprung.
   */
  const fliege = (state: AppState, jd: number, dt: number, s: ScaleSettings): Vec3 => {
    const fly = state.camera.fly;
    const ref = scaledPositionAt(fly.refId, bodyIndex, jd, s);
    if (!imFlug) {
      if (pose === null) {
        // Allererstes Bild (Link im Flugmodus): die Lage aus dem Store.
        flugLage = { x: fly.x, y: fly.y, z: fly.z };
        flugBlick = blickVektor(fly);
      } else {
        // Die Lage relativ zum Bezug im gezeigten Bild übernehmen (dessen
        // jd, nicht das aktuelle) — die Kamera zieht von dort mit dem
        // Körper weiter, statt um dessen Weg im laufenden Bild zu springen.
        flugLage = minus(pose.positionKm, scaledPositionAt(fly.refId, bodyIndex, pose.jd, s));
        flugBlick = pose.blick;
      }
      nullen(vLage);
      nullen(vBlick);
      imFlug = true;
      // Beginnt der Flug nicht an der gezeigten Lage, gleitet die Kamera wie
      // bei den Umlaufmodi hinüber (Nachtrag §13.4). Im allerersten Bild ist
      // die Lage die aus dem Store, dort gibt es keinen Übergang.
      uebergang = nochUnterwegs(flugLage, flugBlick, fly);
    } else {
      if (fly.refId !== flugRef) {
        flugLage = plus(flugLage, minus(scaledPositionAt(flugRef, bodyIndex, jd, s), ref));
      }
      if (wiederherstellungGemeldet && nochUnterwegs(flugLage, flugBlick, fly)) {
        // Wiederherstellung im laufenden Flug: ruhig hinübergleiten wie beim Eintritt.
        nullen(vLage);
        nullen(vBlick);
        uebergang = true;
      }
    }
    wiederherstellungGemeldet = false;
    flugRef = fly.refId;
    const zeitkonstante = uebergang ? FLUG_UEBERGANG_S : FLUG_DAEMPFUNG_S;
    flugLage = smoothDampVec3(flugLage, { x: fly.x, y: fly.y, z: fly.z }, vLage, zeitkonstante, dt);
    flugBlick = normiert(smoothDampVec3(flugBlick, blickVektor(fly), vBlick, zeitkonstante, dt));
    if (uebergang && !nochUnterwegs(flugLage, flugBlick, fly)) uebergang = false;
    const position = plus(ref, flugLage);
    ausrichten(flugBlick, kmToUnits(laenge(flugLage)));
    merke({ positionKm: position, blick: flugBlick, jd });
    return position;
  };

  return {
    update(state, jd, dt, s) {
      if (state.camera.mode === 'fly') return fliege(state, jd, dt, s);
      wiederherstellungGemeldet = false;

      const ziel = targetFor(state, jd, s);
      // In allen drei Modi ist der Blickpunkt zugleich der Anker, an dem die
      // Kamera hängt (Ursprung im freien Modus, sonst der Zielkörper).
      const anker = ziel.lookAtKm;
      const zielOffset: Vec3 = {
        x: ziel.positionKm.x - anker.x,
        y: ziel.positionKm.y - anker.y,
        z: ziel.positionKm.z - anker.z,
      };

      if (imFlug) {
        imFlug = false;
        if (pose !== null) {
          // Ausstieg aus dem Flug: Die Kamera bleibt stehen, der Blickpunkt
          // liegt zuerst auf der alten Blickachse im Abstand des neuen Ankers.
          // Die gezeigte Lage stammt aus einem früheren Bild (pose.jd); erst
          // mit dem Weg des Ankers seither mitgeführt, dann weiterverrechnet
          // — sonst spränge die Kamera um genau diesen Weg. Versatz und
          // Offset klingen gleich schnell ab; beginnt die Umlaufkamera an
          // der gezeigten Lage (heftenUm, fahreZu), bleibt ihre Summe gleich
          // und nur der Blick schwenkt.
          const gezeigt = plus(pose.positionKm, minus(anker, targetFor(state, pose.jd, s).lookAtKm));
          const blickpunkt = plus(gezeigt, mal(pose.blick, laenge(minus(anker, gezeigt))));
          versatz = minus(blickpunkt, anker);
          istOffset = minus(gezeigt, blickpunkt);
          nullen(vOffset);
          nullen(vVersatz);
          letzterAnker = anker;
          letzterSchluessel = schluesselVon(state);
        }
      }

      const schluessel = schluesselVon(state);
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
      // Nahe und ferne Ebene richten sich nach der Zielentfernung.
      const blick = worldToRender(istBlick, istPosition);
      ausrichten(blick, Math.hypot(blick.x, blick.y, blick.z));
      merke({ positionKm: istPosition, blick: normiert(minus(istBlick, istPosition)), jd });
      return istPosition;
    },
  };
}
