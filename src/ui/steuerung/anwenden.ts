import { useStore } from '../../store';
import { bodies, bodyIndex } from '../../data';
import { scaledPositionAt } from '../../sim/scale';
import { SCENES } from '../../data/scenes';
import { plannedSceneAt } from '../../sim/director';
import {
  begrenze, blickAus, blickDrehen, flugSchritt, fluggeschwindigkeit, koerperNaechstDerMitte, koerperStaende, kugelUm,
  laenge, mindesthoehe, minus, plus, waehleBezug, ELEVATION_GRENZE, MAX_DISTANCE_KM, MIN_DISTANCE_KM,
} from '../../render/camera/flug';
import type { Absicht, GezeigtePose } from '../../render/camera/flug';
import { cinemaAktiv, noteUserInput, stopCinema } from '../cinemaControl';
import { fahrtAbbrechen } from '../kamerafahrt';
import { blickzielVon } from '../../render/camera/cinema';
import { eingabeMelden } from '../idle';
import { padAuswerten, PAD } from './gamepad';
import type { PadAbsicht, PadBild, PadRoh, Stick } from './gamepad';
import { tastenAbsicht } from './tastatur';
import type { Tastenstand } from './tastatur';
import type { Zeigerart } from '../../render/treffer';
import {
  kreuzAusblenden, kreuzBewegen, kreuzLage, kreuzMitte, kreuzSichtbar, kreuzZeichnen, kreuzZeigen,
} from './kreuz';
import type { Leinwand } from './kreuz';

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

/**
 * Vervielfacht den Tempofaktor in seinen Grenzen und meldet den neuen Wert.
 * NaN und ±Infinity werden verworfen, das Tempo bleibt (Raddeltas sind heute
 * stets endlich, ein künftiger Aufrufer aus dem Controller womöglich nicht).
 */
export function tempoAendern(faktor: number): void {
  if (!Number.isFinite(faktor)) return;
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
  /** Controller dieses Bildes (Leser aus gamepad.ts); ohne ihn gibt es keinen. */
  pad?(): PadRoh | null;
  /** Größe der Canvas in CSS-Pixeln, für das Fadenkreuz; ohne sie ruht es. */
  leinwand?(): Leinwand;
  /** Zeiger für den Hover der Szene (szene.setZeiger). */
  zeiger?(z: { x: number; y: number; art: Zeigerart } | null): void;
}

/** Körper, auf den die geplante Szene des Kinos blickt (Nachtrag §13.2). */
function kinoBlickziel(): string {
  const { cinema } = useStore.getState();
  return blickzielVon(plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle).scene);
}

/**
 * Startet den Flug an einer gezeigten Lage (Entwurf §3.1): Kino und Fahrt
 * enden, Bezug ist der Körper, dem die Lage in eigenen Radien am nächsten ist.
 * Gerechnet wird mit den Körperlagen des gezeigten Bildes (pose.jd); die
 * Kamera zieht danach mit dem Bezug weiter und springt auch bei laufender Uhr
 * nicht. targetId bleibt (Entscheidung 8) — außer beim Wechsel aus dem Kino:
 * Dann wird der Körper Ziel, auf den die Szene blickt (Nachtrag §13.2), sonst
 * zeigte das Infopanel einen Körper, den die Kamera gar nicht ansteuert. Er
 * wird vor stopCinema gelesen, das die Kamera von vor dem Start zurückholt.
 */
export function flugStarten(pose: GezeigtePose): void {
  const kinoZiel = cinemaAktiv() ? kinoBlickziel() : null;
  if (kinoZiel !== null) stopCinema();
  fahrtAbbrechen();
  const { scale, visible, setCamera } = useStore.getState();
  const staende = koerperStaende(bodies, bodyIndex, pose.jd, scale, visible);
  const refId = waehleBezug(pose.positionKm, staende, null) ?? 'sun';
  const ref = scaledPositionAt(refId, bodyIndex, pose.jd, scale);
  setCamera({
    mode: 'fly',
    ...(kinoZiel === null ? {} : { targetId: kinoZiel }),
    fly: { refId, ...minus(pose.positionKm, ref), ...blickAus(pose.blick) },
  });
}

/** Drehen mit Shift (Entwurf §4.2): A/D 60°/s, Q/E 45°/s, W/S Faktor 2 je Sekunde. */
export const DREH_AZIMUT_JE_S = Math.PI / 3;
export const DREH_ELEVATION_JE_S = Math.PI / 4;
export const ZOOM_JE_S = 2;
/** Controller (§5.2): Blick mit dem linken Stick im Flug und Drehen mit LB, je bei vollem Ausschlag. */
export const STICK_BLICK_JE_S = Math.PI / 2;
export const STICK_DREH_JE_S = Math.PI / 2;

/** Drehraten um den Körper in rad/s: seitlich (Azimut) sowie auf und ab (Elevation). */
interface Drehraten { azimut: number; elevation: number }
const TASTEN_RATEN: Drehraten = { azimut: DREH_AZIMUT_JE_S, elevation: DREH_ELEVATION_JE_S };
const PAD_RATEN: Drehraten = { azimut: STICK_DREH_JE_S, elevation: STICK_DREH_JE_S };

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
 * Ein Bild Drehen mit Shift oder LB (§4.2). Aus Flug, Frei und Kino wird der
 * Körper nächst der Bildmitte Ziel; in Geheftet und Folgen bleibt das Ziel,
 * das dort ohnehin in der Mitte steht (ein vorbeiziehender Mond wird so nicht
 * Ziel). Folgen wird Geheftet. Ohne Körper vor der Kamera bleibt der Modus,
 * wie er war — ein begonnenes Kino endet trotzdem (stopCinema lief schon
 * vorher).
 */
function drehen(dt: number, absicht: Absicht, raten: Drehraten, u: SteuerungUmgebung): void {
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
    azimuth: camera.azimuth + absicht.seit * raten.azimut * dt,
    elevation: begrenze(
      camera.elevation + absicht.hoch * raten.elevation * dt, -ELEVATION_GRENZE, ELEVATION_GRENZE,
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
 * Drehen und danach — falls der Flug bleibt, weil kein Körper gefunden wurde —
 * Bezugswahl und Mindesthöhe, je Bild auch ohne Eingabe (M1, §3.3).
 */
function drehenUndNachfuehren(
  jd: number, dt: number, absicht: Absicht, raten: Drehraten, u: SteuerungUmgebung,
): void {
  drehen(dt, absicht, raten, u);
  if (useStore.getState().camera.mode === 'fly') flugNachfuehren(jd, dt, null);
}

/**
 * Fliegen (§4.1, §5.2): startet den Flug an der gezeigten Lage, lenkt den
 * Blick mit dem linken Stick und macht den Flugschritt.
 */
function fliegen(jd: number, dt: number, absicht: Absicht, blick: Stick | null, u: SteuerungUmgebung): void {
  if (useStore.getState().camera.mode !== 'fly') {
    const pose = u.letztePose();
    if (pose === null) return;
    flugStarten(pose);
  }
  if (blick !== null && (blick.x !== 0 || blick.y !== 0)) {
    const { camera, setCamera } = useStore.getState();
    // Wie in Spielen: rechts = nach rechts schauen (yaw sinkt), oben = nach
    // oben schauen; die y-Achse der API zählt nach unten.
    const neu = blickDrehen(camera.fly, -blick.x * STICK_BLICK_JE_S * dt, -blick.y * STICK_BLICK_JE_S * dt);
    setCamera({ fly: { ...camera.fly, ...neu } });
  }
  flugNachfuehren(jd, dt, absicht);
}

/** Gedrückte Tasten des letzten Controllerbildes; null vor dem ersten Auftauchen. */
let padVorher: boolean[] | null = null;
let lbVorher = false;
/** LB wurde losgelassen, während Stick oder Trigger lenkten (Nachtrag §13.3). */
let padGesperrt = false;

/** Vergisst den Controller: beim Trennen und für Tests. Das nächste Auftauchen gilt wieder als erstes. */
export function padZuruecksetzen(): void {
  padVorher = null;
  lbVorher = false;
  padGesperrt = false;
}

const lenkt = (a: PadAbsicht): boolean => a.links.x !== 0 || a.links.y !== 0 || a.vor !== 0;
const bewegt = (a: PadAbsicht): boolean => lenkt(a) || a.rechts.x !== 0 || a.rechts.y !== 0;

/** Controller eines Bildes: ausgewertetes Bild und ob er in diesem Bild verschwand. */
interface PadTakt { bild: PadBild | null; getrennt: boolean }

/**
 * Liest den Controller, führt Vorzustand und LB-Sperre und meldet Eingaben
 * (§5.5), weil der Controller keine Fensterereignisse auslöst: jede an den
 * Ruhewächter; jede außer Menü/Start und RB hält ein Kino an, wie C und N;
 * jede außer A und B bricht eine Kamerafahrt ab — A und B starten selbst
 * eine. Ohne Controller und beim ersten Auftauchen ist das Bild null;
 * `getrennt` meldet, dass er in diesem Bild verschwand.
 */
function padTakt(u: SteuerungUmgebung): PadTakt {
  const roh = u.pad?.() ?? null;
  if (roh === null) {
    const getrennt = padVorher !== null;
    padZuruecksetzen();
    return { bild: null, getrennt };
  }
  const erstes = padVorher === null;
  const { bild, gedrueckt } = padAuswerten(roh, padVorher);
  padVorher = gedrueckt;
  if (erstes) return { bild: null, getrennt: false };
  const a = bild.absicht;
  if (lbVorher && !a.lb && lenkt(a)) padGesperrt = true;
  if (!lenkt(a)) padGesperrt = false;
  lbVorher = a.lb;
  if (bild.eingabe) {
    eingabeMelden();
    if (bewegt(a) || bild.flanken.some((t) => t !== PAD.MENUE && t !== PAD.RB)) noteUserInput();
    if (bewegt(a) || bild.flanken.some((t) => t !== PAD.A && t !== PAD.B)) fahrtAbbrechen();
  }
  return { bild, getrennt: false };
}

/** Bewegung eines Bildes, die Tastatur vor dem Controller. */
function bewegen(jd: number, dt: number, u: SteuerungUmgebung, bild: PadBild | null): void {
  const stand = u.tasten();
  if (stand.gehalten.size > 0) {
    const absicht = tastenAbsicht(stand.gehalten);
    if (stand.shift) drehenUndNachfuehren(jd, dt, absicht, TASTEN_RATEN, u);
    else fliegen(jd, dt, absicht, null, u);
    return;
  }
  const a = bild?.absicht;
  if (a !== undefined && lenkt(a) && !padGesperrt) {
    // LB wirkt wie Shift (§5.2): Stick rechts = Kamera nach rechts, oben = nach
    // oben (die y-Achse der API zählt nach unten), RT heran, LT weiter weg.
    if (a.lb) drehenUndNachfuehren(jd, dt, { vor: a.vor, seit: a.links.x, hoch: -a.links.y }, PAD_RATEN, u);
    else fliegen(jd, dt, { vor: a.vor, seit: 0, hoch: 0 }, a.links, u);
    return;
  }
  if (useStore.getState().camera.mode === 'fly') flugNachfuehren(jd, dt, null);
}

/** Fadenkreuz bei vollem Ausschlag: eine Canvas-Höhe je Sekunde (Entwurf §5.2). */
export const KREUZ_HOEHEN_JE_S = 1;

/**
 * Fadenkreuz eines Bildes (§5.4): Jede Controller-Eingabe zeigt es, der rechte
 * Stick bewegt es, R3 holt es zur Mitte, Trennen blendet es aus und löscht den
 * Hover. Solange es sichtbar ist, geht seine Lage als Zeiger der Art pad an
 * die Szene. Eine Mausbewegung blendet es aus (Fadenkreuz.tsx); den Hover der
 * Maus löscht es dabei nicht.
 */
function kreuzTakt(dt: number, u: SteuerungUmgebung, pad: PadTakt): void {
  const leinwand = u.leinwand?.();
  if (leinwand === undefined) return;
  const { bild } = pad;
  if (bild !== null) {
    if (bild.eingabe) kreuzZeigen();
    const r = bild.absicht.rechts;
    const weg = leinwand.hoehe * KREUZ_HOEHEN_JE_S * dt;
    if (r.x !== 0 || r.y !== 0) kreuzBewegen(r.x * weg, r.y * weg, leinwand);
    if (bild.flanken.includes(PAD.R3)) kreuzMitte(leinwand);
  }
  if (pad.getrennt) {
    if (kreuzSichtbar()) u.zeiger?.(null);
    kreuzAusblenden();
  }
  if (kreuzSichtbar()) u.zeiger?.({ ...kreuzLage(leinwand), art: 'pad' });
  kreuzZeichnen(leinwand);
}

/**
 * Je Bild vor dem Kino-Takt (Entwurf §6.2). Gehaltene Flugtasten ohne Shift
 * sowie linker Stick oder Trigger ohne LB starten den Flug an der gezeigten
 * Lage und fliegen; im Flug laufen Mindesthöhe und Bezugswahl auch ohne
 * Eingabe. Mit Shift oder LB dreht die Kamera um den Körper nächst der
 * Bildmitte (§4.2, §5.2). Danach bewegt der rechte Stick das Fadenkreuz.
 */
export function steuerungTakt(jd: number, dt: number, u: SteuerungUmgebung): void {
  const pad = padTakt(u);
  bewegen(jd, dt, u, pad.bild);
  kreuzTakt(dt, u, pad);
}
