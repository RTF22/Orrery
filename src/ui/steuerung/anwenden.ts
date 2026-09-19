import { useStore } from '../../store';
import { bodies, bodyIndex } from '../../data';
import { scaledPositionAt } from '../../sim/scale';
import {
  begrenze, blickAus, flugSchritt, fluggeschwindigkeit, koerperNaechstDerMitte, koerperStaende, kugelUm, laenge,
  mindesthoehe, minus, plus, waehleBezug, ELEVATION_GRENZE, MAX_DISTANCE_KM, MIN_DISTANCE_KM,
} from '../../render/camera/flug';
import type { Absicht, GezeigtePose } from '../../render/camera/flug';
import { cinemaAktiv, stopCinema } from '../cinemaControl';
import { fahrtAbbrechen } from '../kamerafahrt';
import { tastenAbsicht } from './tastatur';
import type { Tastenstand } from './tastatur';

/**
 * Tempofaktor des Flugs (Entwurf Flug und Controller §3.4): flüchtig, nicht in
 * Link, Sitzung oder Ansicht. Geschwindigkeit = Faktor mal Höhe je Sekunde.
 */
export const TEMPO_START = 0.5;
export const TEMPO_MIN = 0.02;
export const TEMPO_MAX = 20;

let tempo = TEMPO_START;
const tempoHoerer = new Set<(wert: number) => void>();

export const tempoFaktor = (): number => tempo;

/** Vervielfacht den Tempofaktor in seinen Grenzen und meldet den neuen Wert. */
export function tempoAendern(faktor: number): void {
  tempo = begrenze(tempo * faktor, TEMPO_MIN, TEMPO_MAX);
  for (const hoerer of tempoHoerer) hoerer(tempo);
}

export function tempoAbonnieren(hoerer: (wert: number) => void): () => void {
  tempoHoerer.add(hoerer);
  return () => { tempoHoerer.delete(hoerer); };
}

/** Für Tests: Tempofaktor zurück auf den Start. */
export function tempoZuruecksetzen(): void {
  tempo = TEMPO_START;
}

export interface SteuerungUmgebung {
  tasten(): Tastenstand;
  /** Gezeigte Kameralage des letzten Bildes samt jd (render/camera/controller.ts). */
  letztePose(): GezeigtePose | null;
}

/**
 * Startet den Flug an einer gezeigten Lage (Entwurf §3.1): Kino und Fahrt
 * enden, Bezug ist der Körper, dem die Lage in eigenen Radien am nächsten ist.
 * Gerechnet wird mit den Körperlagen des gezeigten Bildes (pose.jd); die
 * Kamera zieht danach mit dem Bezug weiter und springt auch bei laufender Uhr
 * nicht. targetId bleibt (Entscheidung 8).
 */
export function flugStarten(pose: GezeigtePose): void {
  if (cinemaAktiv()) stopCinema();
  fahrtAbbrechen();
  const { scale, visible, setCamera } = useStore.getState();
  const staende = koerperStaende(bodies, bodyIndex, pose.jd, scale, visible);
  const refId = waehleBezug(pose.positionKm, staende, null) ?? 'sun';
  const ref = scaledPositionAt(refId, bodyIndex, pose.jd, scale);
  setCamera({ mode: 'fly', fly: { refId, ...minus(pose.positionKm, ref), ...blickAus(pose.blick) } });
}

/** Drehen mit Shift (Entwurf §4.2): A/D 60°/s, Q/E 45°/s, W/S Faktor 2 je Sekunde. */
export const DREH_AZIMUT_JE_S = Math.PI / 3;
export const DREH_ELEVATION_JE_S = Math.PI / 4;
export const ZOOM_JE_S = 2;

/**
 * Heftet die Kamera an einen Körper, mit Abstand und Winkeln der gezeigten
 * Lage relativ zum Körper im gezeigten Bild (pose.jd, §4.2, §4.5): Die Kamera
 * bleibt stehen, nur der Blick schwenkt.
 */
export function heftenUm(id: string, pose: GezeigtePose): void {
  const { scale, setCamera } = useStore.getState();
  setCamera({
    mode: 'attached', targetId: id, freezeJd: null,
    ...kugelUm(pose.positionKm, scaledPositionAt(id, bodyIndex, pose.jd, scale)),
  });
}

/**
 * Ein Bild Drehen mit Shift (§4.2). Aus Flug, Frei und Kino wird der Körper
 * nächst der Bildmitte Ziel; in Geheftet und Folgen bleibt das Ziel, das dort
 * ohnehin in der Mitte steht (ein vorbeiziehender Mond wird so nicht Ziel).
 * Folgen wird Geheftet. Ohne Körper vor der Kamera geschieht nichts.
 */
function drehen(dt: number, absicht: Absicht, u: SteuerungUmgebung): void {
  const modus = useStore.getState().camera.mode;
  if (modus !== 'attached') {
    const pose = u.letztePose();
    if (pose === null) return;
    const neuWaehlen = modus === 'fly' || modus === 'free' || modus === 'cinema';
    // Das Kino zuerst beenden: stopCinema stellt die Kamera von vor dem Start
    // her, gewählt wird aber im gezeigten Bild.
    if (cinemaAktiv()) stopCinema();
    fahrtAbbrechen();
    const { scale, visible, camera } = useStore.getState();
    const id = neuWaehlen
      ? koerperNaechstDerMitte(pose, koerperStaende(bodies, bodyIndex, pose.jd, scale, visible))
      : camera.targetId;
    if (id === null) return;
    heftenUm(id, pose);
  }
  const { camera, setCamera } = useStore.getState();
  setCamera({
    azimuth: camera.azimuth + absicht.seit * DREH_AZIMUT_JE_S * dt,
    elevation: begrenze(
      camera.elevation + absicht.hoch * DREH_ELEVATION_JE_S * dt, -ELEVATION_GRENZE, ELEVATION_GRENZE,
    ),
    distance: begrenze(camera.distance * ZOOM_JE_S ** (-absicht.vor * dt), MIN_DISTANCE_KM, MAX_DISTANCE_KM),
  });
}

/**
 * Ein Bild im Flug: Schritt aus der Absicht, dann Mindesthöhe und Bezugswahl
 * (§3.3, §3.4). Ohne Bewegung und ohne Bezugswechsel bleibt der Store
 * unberührt, sonst trüge jedes Bild Rundungsreste hinein.
 */
function flugNachfuehren(jd: number, dt: number, absicht: Absicht | null): void {
  const { camera, scale, visible, setCamera } = useStore.getState();
  const fly = camera.fly;
  const staende = koerperStaende(bodies, bodyIndex, jd, scale, visible);
  const ref = scaledPositionAt(fly.refId, bodyIndex, jd, scale);
  const start = plus(ref, fly);
  let welt = start;
  if (absicht !== null) {
    welt = flugSchritt(welt, fly, absicht, fluggeschwindigkeit(welt, staende, tempo), dt);
  }
  welt = mindesthoehe(welt, staende);
  const refId = waehleBezug(welt, staende, fly.refId) ?? fly.refId;
  if (welt === start && refId === fly.refId) return;
  const neuRef = refId === fly.refId ? ref : scaledPositionAt(refId, bodyIndex, jd, scale);
  let lage = minus(welt, neuRef);
  const weite = laenge(lage);
  if (weite > MAX_DISTANCE_KM) {
    // Höchstens 10¹³ km um den Bezug wie camera.distance (§3.4); komponentenweise
    // nachgeklemmt, damit Rundung den Prüferbereich nicht überschreitet.
    const k = MAX_DISTANCE_KM / weite;
    lage = {
      x: begrenze(lage.x * k, -MAX_DISTANCE_KM, MAX_DISTANCE_KM),
      y: begrenze(lage.y * k, -MAX_DISTANCE_KM, MAX_DISTANCE_KM),
      z: begrenze(lage.z * k, -MAX_DISTANCE_KM, MAX_DISTANCE_KM),
    };
  }
  setCamera({ fly: { ...fly, refId, ...lage } });
}

/**
 * Je Bild vor dem Kino-Takt (Entwurf §6.2). Gehaltene Flugtasten ohne Shift
 * starten den Flug an der gezeigten Lage und fliegen; im Flug laufen
 * Mindesthöhe und Bezugswahl auch ohne Eingabe. Mit Shift dreht die Kamera
 * um den Körper nächst der Bildmitte (§4.2).
 */
export function steuerungTakt(jd: number, dt: number, u: SteuerungUmgebung): void {
  const stand = u.tasten();
  const gedrueckt = stand.gehalten.size > 0;
  if (gedrueckt && !stand.shift) {
    if (useStore.getState().camera.mode !== 'fly') {
      const pose = u.letztePose();
      if (pose === null) return;
      flugStarten(pose);
    }
    flugNachfuehren(jd, dt, tastenAbsicht(stand.gehalten));
    return;
  }
  if (gedrueckt) {
    drehen(dt, tastenAbsicht(stand.gehalten), u);
    return;
  }
  if (useStore.getState().camera.mode === 'fly') flugNachfuehren(jd, dt, null);
}
