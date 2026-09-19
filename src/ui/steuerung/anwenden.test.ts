// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import * as THREE from 'three';
import {
  steuerungTakt, tempoAendern, tempoAbonnieren, tempoFaktor, tempoZuruecksetzen, padZuruecksetzen,
  TEMPO_START, TEMPO_MIN, TEMPO_MAX,
} from './anwenden';
import type { SteuerungUmgebung } from './anwenden';
import type { Flugtaste } from './tastatur';
import { PAD } from './gamepad';
import type { PadRoh } from './gamepad';
import { padAttrappe } from './padAttrappe';
import { useStore, DEFAULT_STATE } from '../../store';
import { bodies, bodyIndex } from '../../data';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import {
  blickVektor, kreuz, laenge, mal, minus, normiert, plus, punkt,
} from '../../render/camera/flug';
import type { GezeigtePose } from '../../render/camera/flug';
import { createCameraController, letztePose as controllerLetztePose } from '../../render/camera/controller';
import type { AppState } from '../../store/types';
import type { Vec3 } from '../../sim/types';
import { startCinema, stopCinema } from '../cinemaControl';
import { fahreZu, fahrtAbbrechen, fahrtLaeuft } from '../kamerafahrt';
import { SCENES } from '../../data/scenes';
import { IDLE_HIDE_SEC, useIdleHide, zeigerAusgeblendet } from '../idle';
import { kreuzAusblenden, kreuzLage, kreuzSichtbar, kreuzZuruecksetzen, zeigerVonMaus } from './kreuz';
import { INFO_PANEL } from '../info/konstanten';

const jd = DEFAULT_STATE.time.jd;
const s = DEFAULT_STATE.scale;
const lage = (id: string) => scaledPositionAt(id, bodyIndex, jd, s);
const radius = (id: string) => scaledRadius(bodyIndex[id]!, s);

function umgebung(tasten: Flugtaste[], pose: GezeigtePose | null, shift = false): SteuerungUmgebung {
  return { tasten: () => ({ gehalten: new Set(tasten), shift }), letztePose: () => pose };
}

/** Gezeigte Lage vier Erdradien neben der Erde (+x), Blick auf sie. */
function vorErde(): GezeigtePose {
  return {
    positionKm: plus(lage('earth'), { x: 4 * radius('earth'), y: 0, z: 0 }),
    blick: { x: -1, y: 0, z: 0 },
    jd,
  };
}

/** Weltlage der Kamera aus der Fluglage im Store. */
const weltlage = () => {
  const { fly } = useStore.getState().camera;
  return plus(lage(fly.refId), fly);
};

/** Gezeigte Lage 2·10⁷ km sonnenseitig vor dem Körper, Blick um `versatzKm` an seiner Mitte vorbei. */
function vorKoerper(id: string, versatzKm = 2e5): GezeigtePose {
  const k = lage(id);
  const aussen = normiert(k);
  const quer = normiert(kreuz(aussen, { x: 0, y: 0, z: 1 }));
  const von = minus(k, mal(aussen, 2e7));
  return { positionKm: von, blick: normiert(minus(plus(k, mal(quer, versatzKm)), von)), jd };
}

beforeEach(() => {
  fahrtAbbrechen();
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  tempoZuruecksetzen();
  padZuruecksetzen();
});

describe('steuerungTakt: Flug', () => {
  it('startet mit W den Flug an der gezeigten Lage; Bezug Erde, Ziel bleibt', () => {
    const pose = vorErde();
    steuerungTakt(jd, 0, umgebung(['KeyW'], pose));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    expect(camera.fly.refId).toBe('earth');
    expect(camera.targetId).toBe('sun');
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
    expect(camera.fly.yaw).toBeCloseTo(Math.PI, 12);
    expect(camera.fly.pitch).toBeCloseTo(0, 12);
  });

  it('übernimmt bei laufender Uhr die Lage relativ zum Bezug im gezeigten Bild', () => {
    // Gezeigt bei jd, der Takt läuft schon bei jd + 6: Die Kamera zieht mit der Erde weiter.
    const pose = vorErde();
    steuerungTakt(jd + 6, 0, umgebung(['KeyW'], pose));
    const { fly } = useStore.getState().camera;
    expect(fly.refId).toBe('earth');
    expect(laenge(minus(fly, minus(pose.positionKm, lage('earth'))))).toBeLessThan(1e-3);
  });

  it('fliegt mit W in Blickrichtung um Tempo mal Höhe', () => {
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    steuerungTakt(jd, 0.1, umgebung(['KeyW'], vorErde()));
    // Höhe 3 Erdradien, Tempo 0,5: 0,1 s bringen 0,15 Radien näher.
    const abstand = laenge(minus(weltlage(), lage('earth')));
    expect(abstand / radius('earth')).toBeCloseTo(4 - 0.15, 9);
  });

  it('lässt die Fluglage ohne Eingabe unberührt (mitgeführt wird im Controller)', () => {
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    const vorher = useStore.getState().camera.fly;
    steuerungTakt(jd + 1, 1 / 60, umgebung([], null));
    expect(useStore.getState().camera.fly).toBe(vorher);
  });

  it('wechselt beim Übertritt den Bezug und behält die Weltlage', () => {
    const nahMond = plus(lage('moon'), { x: 0, y: 0, z: 1.5 * radius('moon') });
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'earth', ...minus(nahMond, lage('earth')), yaw: 0, pitch: 0 },
    });
    steuerungTakt(jd, 1 / 60, umgebung([], null));
    expect(useStore.getState().camera.fly.refId).toBe('moon');
    expect(laenge(minus(weltlage(), nahMond))).toBeLessThan(1e-3);
  });

  it('schiebt eine Lage im Körper auf die Mindesthöhe hinaus', () => {
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'earth', x: 0.5 * radius('earth'), y: 0, z: 0, yaw: 0, pitch: 0 },
    });
    steuerungTakt(jd, 1 / 60, umgebung([], null));
    const { fly } = useStore.getState().camera;
    expect(fly.refId).toBe('earth');
    expect(laenge(fly) / radius('earth')).toBeCloseTo(1.05, 9);
  });

  it('wählt den Bezug neu, wenn er ausgeblendet wird', () => {
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'earth', x: 4 * radius('earth'), y: 0, z: 0, yaw: 0, pitch: 0 },
    });
    useStore.getState().toggleVisible('earth');
    steuerungTakt(jd, 1 / 60, umgebung([], null));
    expect(useStore.getState().camera.fly.refId).toBe('sun');
  });

  it('hält die Lage innerhalb von 10¹³ km um den Bezugskörper', () => {
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'sun', x: 9.9e12, y: 0, z: 0, yaw: 0, pitch: 0 },
    });
    tempoAendern(100);
    steuerungTakt(jd, 1, umgebung(['KeyW'], null));
    const { fly } = useStore.getState().camera;
    expect(fly.refId).toBe('sun');
    expect(Math.abs(fly.x)).toBeLessThanOrEqual(1e13);
    expect(laenge(fly)).toBeCloseTo(1e13, -4);
  });

  it('startet ohne gezeigte Lage keinen Flug', () => {
    steuerungTakt(jd, 1 / 60, umgebung(['KeyW'], null));
    expect(useStore.getState().camera.mode).toBe('free');
  });

  it('startet mit W und S zugleich den Flug, bewegt aber nicht', () => {
    const pose = vorErde();
    steuerungTakt(jd, 0.1, umgebung(['KeyW', 'KeyS'], pose));
    expect(useStore.getState().camera.mode).toBe('fly');
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
  });

  it('beendet ein Kino samt Wiederherstellung und fliegt ab dem gezeigten Bild', () => {
    useStore.getState().setTime({ rateDaysPerSec: 3 });
    startCinema();
    useStore.getState().setTime({ rateDaysPerSec: 50 });
    const pose = vorErde();
    steuerungTakt(jd, 0, umgebung(['KeyW'], pose));
    const z = useStore.getState();
    expect(z.cinema.running).toBe(false);
    expect(z.camera.mode).toBe('fly');
    expect(z.time.rateDaysPerSec).toBe(3);
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
  });

  it('bricht eine laufende Kamerafahrt ab', () => {
    fahreZu('mars', { jetzt: () => 0, anfordern: () => 1, abbrechen: () => { /* von Hand */ } });
    expect(fahrtLaeuft()).toBe(true);
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    expect(fahrtLaeuft()).toBe(false);
  });

  it('macht beim Flug aus dem Kino den Körper zum Ziel, auf den die Szene blickt (Nachtrag §13.2)', () => {
    useStore.getState().setCinema({ nummer: SCENES.findIndex((sz) => sz.id === 'phobos-tiefflug'), shuffle: false });
    useStore.getState().setCamera({ targetId: 'jupiter' });
    startCinema();
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    expect(camera.targetId).toBe('mars');
  });

  it('nimmt bei einer Sichtlinie den Standortkörper als Ziel', () => {
    useStore.getState().setCinema({ nummer: SCENES.findIndex((sz) => sz.id === 'mondfinsternis'), shuffle: false });
    startCinema();
    steuerungTakt(jd, 0, umgebung(['KeyW'], vorErde()));
    expect(useStore.getState().camera.targetId).toBe('moon');
  });
});

/**
 * Regressionstest zu I-1 (Nacharbeit Flug Etappe 2): Jeder Flugstart per
 * Taste, Trigger oder linkem Stick muss mit der schnellen Flugdämpfung
 * 0,15 s laufen, nicht mit der Wiederherstellungsdämpfung 0,45 s. Geprüft
 * wird mit dem echten Controller aus render/camera/controller.ts (wie in
 * dessen eigenen Tests), weil `nochUnterwegs` dort lebt und das Verhalten
 * von anwenden.ts (SteuerungUmgebung.letztePose) und dem Store abhängt.
 */
describe('steuerungTakt: Flugstart-Dämpfung (I-1)', () => {
  const R = 1 / 60;
  const winkel = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number =>
    Math.acos(Math.min(1, punkt(normiert(a), normiert(b))));
  /** AppState aus dem aktuellen Kamerastand des Stores, für den echten Controller. */
  const zustandAusStore = (): AppState => ({ ...structuredClone(DEFAULT_STATE), camera: useStore.getState().camera });

  /** Kamera geheftet an der Erde (2·10⁶ km), 600 Bilder eingeschwungen: gezeigte Lage vor dem Flugstart. */
  function eingeschwungen(): { controller: ReturnType<typeof createCameraController>; gezeigt: GezeigtePose } {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
    camera.up.set(0, 0, 1);
    const controller = createCameraController(camera);
    const geheftet: AppState = {
      ...structuredClone(DEFAULT_STATE),
      camera: { ...DEFAULT_STATE.camera, mode: 'attached', targetId: 'earth', distance: 2e6 },
    };
    for (let i = 0; i < 600; i++) controller.update(geheftet, jd, R, s);
    return { controller, gezeigt: controllerLetztePose()! };
  }

  /**
   * Ein Bild wie im echten Spielloop (app/main.tsx): steuerungTakt schreibt
   * die Absicht in den Store, danach liest der Controller genau diesen
   * Stand — diese Reihenfolge entscheidet bei I-1 über die Übergangsdämpfung
   * (der Controller vergleicht beim Eintritt in den Flug die gezeigte Lage
   * mit dem, was zu diesem Zeitpunkt im Store steht).
   */
  function bild(controller: ReturnType<typeof createCameraController>, u: SteuerungUmgebung, dt: number) {
    steuerungTakt(jd, dt, u);
    return controller.update(zustandAusStore(), jd, dt, s);
  }

  /** Hält die aktuelle Solllage 27 Bilder (0,45 s) fest und liefert die letzte gezeigte Position. */
  function halten(controller: ReturnType<typeof createCameraController>): Vec3 {
    const zustand = zustandAusStore();
    let p = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 27; i++) p = controller.update(zustand, jd, R, s);
    return p;
  }

  it('startet mit W nur mit 0,15 s gedämpft, nicht mit der Wiederherstellung 0,45 s', () => {
    const { controller, gezeigt } = eingeschwungen();
    const u = umgebung(['KeyW'], gezeigt);
    bild(controller, u, R); // Eintritt: Fix I-1, Soll = gezeigte Lage, uebergang bleibt false
    const pNachBewegung = bild(controller, u, R); // Bewegungsschritt
    const erde = scaledPositionAt('earth', bodyIndex, gezeigt.jd, s);
    const soll = useStore.getState().camera.fly;
    const anfang = laenge(minus(minus(pNachBewegung, erde), soll));
    const p = halten(controller);
    expect(laenge(minus(minus(p, erde), soll)) / anfang).toBeLessThan(0.05);
  });

  it('startet mit RT nur mit 0,15 s gedämpft, nicht mit der Wiederherstellung 0,45 s', () => {
    const { controller, gezeigt } = eingeschwungen();
    const u: SteuerungUmgebung = { ...umgebung([], gezeigt), pad: () => padAttrappe({ werte: { [PAD.RT]: 1 } }) };
    // Erstes Auftauchen des Controllers bleibt ohne Wirkung, ohne Modus 'free': kein Controller-Bild dafür,
    // sonst überschriebe dessen eigener Zweig die eingeschwungene Lage.
    steuerungTakt(jd, 0, u);
    bild(controller, u, R); // Eintritt: Fix I-1
    const pNachBewegung = bild(controller, u, R); // Bewegungsschritt
    const erde = scaledPositionAt('earth', bodyIndex, gezeigt.jd, s);
    const soll = useStore.getState().camera.fly;
    const anfang = laenge(minus(minus(pNachBewegung, erde), soll));
    const p = halten(controller);
    expect(laenge(minus(minus(p, erde), soll)) / anfang).toBeLessThan(0.05);
  });

  it('startet mit dem linken Stick nur mit 0,15 s gedämpft, nicht mit der Wiederherstellung 0,45 s', () => {
    const { controller, gezeigt } = eingeschwungen();
    const u: SteuerungUmgebung = { ...umgebung([], gezeigt), pad: () => padAttrappe({ axes: [0.6, 0, 0, 0] }) };
    steuerungTakt(jd, 0, u); // erstes Auftauchen: ohne Wirkung (kein Controller-Bild, siehe oben)
    bild(controller, u, R); // Eintritt: Fix I-1
    bild(controller, u, R); // Bewegungsschritt (reine Blickdrehung, keine Translation)
    const soll = useStore.getState().camera.fly;
    const sollBlick = blickVektor(soll);
    const anfang = winkel(controllerLetztePose()!.blick, sollBlick);
    halten(controller);
    expect(winkel(controllerLetztePose()!.blick, sollBlick) / anfang).toBeLessThan(0.05);
  });
});

describe('Tempofaktor', () => {
  it('verwirft NaN und Unendlich, das Tempo bleibt', () => {
    tempoAendern(1.25);
    const vorher = tempoFaktor();
    tempoAendern(NaN);
    expect(tempoFaktor()).toBe(vorher);
    tempoAendern(Infinity);
    expect(tempoFaktor()).toBe(vorher);
    tempoAendern(-Infinity);
    expect(tempoFaktor()).toBe(vorher);
  });

  it('vervielfacht in den Grenzen und meldet jeden neuen Wert', () => {
    const werte: number[] = [];
    const ab = tempoAbonnieren((w) => { werte.push(w); });
    tempoAendern(1.25);
    expect(tempoFaktor()).toBeCloseTo(TEMPO_START * 1.25, 12);
    tempoAendern(1e6);
    expect(tempoFaktor()).toBe(TEMPO_MAX);
    tempoAendern(1e-9);
    expect(tempoFaktor()).toBe(TEMPO_MIN);
    ab();
    tempoAendern(2);
    expect(werte).toEqual([TEMPO_START * 1.25, TEMPO_MAX, TEMPO_MIN]);
  });
});

describe('steuerungTakt: Drehen mit Shift', () => {
  it('heftet aus dem Flug an den Körper nächst der Mitte, ohne die Lage zu ändern', () => {
    // Die Marsmonde stünden sonst womöglich näher an der Achse.
    useStore.getState().toggleVisible('phobos');
    useStore.getState().toggleVisible('deimos');
    useStore.getState().setCamera({ mode: 'fly' });
    const pose = vorKoerper('mars');
    steuerungTakt(jd, 0, umgebung(['KeyA'], pose, true));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.targetId).toBe('mars');
    expect(camera.freezeJd).toBeNull();
    const zurueck = plus(lage('mars'), {
      x: camera.distance * Math.cos(camera.elevation) * Math.cos(camera.azimuth),
      y: camera.distance * Math.cos(camera.elevation) * Math.sin(camera.azimuth),
      z: camera.distance * Math.sin(camera.elevation),
    });
    expect(laenge(minus(zurueck, pose.positionKm))).toBeLessThan(1e-3);
  });

  it('dreht mit Shift+D um 60°/s, fährt mit Shift+W je Sekunde auf die Hälfte, hebt mit Shift+E um 45°/s', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e6, azimuth: 0, elevation: 0 });
    const pose = vorKoerper('earth');
    steuerungTakt(jd, 0.5, umgebung(['KeyD'], pose, true));
    expect(useStore.getState().camera.azimuth).toBeCloseTo(Math.PI / 6, 12);
    steuerungTakt(jd, 1, umgebung(['KeyW'], pose, true));
    expect(useStore.getState().camera.distance).toBeCloseTo(5e5, 6);
    steuerungTakt(jd, 1, umgebung(['KeyE'], pose, true));
    expect(useStore.getState().camera.elevation).toBeCloseTo(Math.PI / 4, 12);
  });

  it('behält in Geheftet das Ziel, auch wenn ein anderer Körper vor der Mitte steht', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth' });
    steuerungTakt(jd, 0, umgebung(['KeyA'], vorKoerper('moon', 0), true));
    expect(useStore.getState().camera.targetId).toBe('earth');
  });

  it('macht aus Folgen Geheftet um dasselbe Ziel, ab der gezeigten Lage', () => {
    useStore.getState().setCamera({ mode: 'follow', targetId: 'jupiter' });
    const pose = vorKoerper('jupiter');
    steuerungTakt(jd, 0, umgebung(['KeyA'], pose, true));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.targetId).toBe('jupiter');
    expect(camera.distance).toBeCloseTo(laenge(minus(pose.positionKm, lage('jupiter'))), 3);
  });

  it('tut ohne Körper vor der Kamera nichts; der Flug bleibt', () => {
    for (const b of bodies) if (b.id !== 'sun') useStore.getState().toggleVisible(b.id);
    useStore.getState().setCamera({ mode: 'fly' });
    const pose: GezeigtePose = { positionKm: { x: 1e9, y: 0, z: 0 }, blick: { x: 1, y: 0, z: 0 }, jd };
    steuerungTakt(jd, 0, umgebung(['KeyA'], pose, true));
    expect(useStore.getState().camera.mode).toBe('fly');
  });

  it('beendet mit Shift+WASD ein Kino und heftet an den Körper nächst der Mitte', () => {
    startCinema();
    steuerungTakt(jd, 0, umgebung(['KeyD'], vorKoerper('saturn'), true));
    const z = useStore.getState();
    expect(z.cinema.running).toBe(false);
    expect(z.camera.mode).toBe('attached');
    expect(z.camera.targetId).toBe('saturn');
  });

  it('fliegt nach dem Drehen beim nächsten Druck ohne Shift wieder', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth' });
    steuerungTakt(jd, 0, umgebung(['KeyA'], vorKoerper('earth'), false));
    expect(useStore.getState().camera.mode).toBe('fly');
  });

  it('wählt im Flug mit Shift auch ohne gefundenen Körper den Bezug neu (M1)', () => {
    // Nur die Sonne sichtbar (wie im Test „tut ohne Körper …“ oben): koerperNaechstDerMitte
    // findet niemanden, der bisherige Bezug Erde ist zusätzlich ausgeblendet.
    for (const b of bodies) if (b.id !== 'sun') useStore.getState().toggleVisible(b.id);
    useStore.getState().setCamera({
      mode: 'fly', fly: { refId: 'earth', x: 4 * radius('earth'), y: 0, z: 0, yaw: 0, pitch: 0 },
    });
    const pose: GezeigtePose = { positionKm: { x: 1e9, y: 0, z: 0 }, blick: { x: 1, y: 0, z: 0 }, jd };
    steuerungTakt(jd, 0, umgebung(['KeyA'], pose, true));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    expect(camera.fly.refId).toBe('sun');
  });
});

describe('steuerungTakt: Controller', () => {
  const ruhe = padAttrappe();
  const mitPad = (p: PadRoh | null, pose: GezeigtePose | null): SteuerungUmgebung =>
    ({ ...umgebung([], pose), pad: () => p });
  /** Erstes Bild mit neutralem Controller: Das Auftauchen bleibt ohne Wirkung (§5.1). */
  const anmelden = (pose: GezeigtePose | null = null): void => { steuerungTakt(jd, 0, mitPad(ruhe, pose)); };

  it('bleibt beim ersten Auftauchen ohne Wirkung, auch mit ausgelenktem Stick', () => {
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), vorErde()));
    expect(useStore.getState().camera.mode).toBe('free');
  });

  it('startet mit dem linken Stick den Flug an der gezeigten Lage und lenkt den Blick mit 90°/s wie in Spielen', () => {
    const pose = vorErde();
    anmelden(pose);
    // Eintritt (I-1): nur flugStarten, ohne Blickdrehung; die folgt erst im nächsten Bild.
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    let { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    // Rechts = nach rechts schauen: yaw sinkt.
    expect(camera.fly.yaw).toBeCloseTo(Math.PI - Math.PI / 4, 12);
    expect(laenge(minus(weltlage(), pose.positionKm))).toBeLessThan(1e-3);
    // Oben (y der API negativ) = nach oben schauen.
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ axes: [0, -1, 0, 0] }), pose));
    ({ camera } = useStore.getState());
    expect(camera.fly.pitch).toBeCloseTo(Math.PI / 4, 12);
  });

  it('fliegt mit RT so schnell wie mit W und mit LT zurück', () => {
    const pose = vorErde();
    // Eintritt (I-1) je einmal ohne Bewegung, dann der bewegte Takt.
    steuerungTakt(jd, 0, umgebung(['KeyW'], pose));
    steuerungTakt(jd, 0.1, umgebung(['KeyW'], pose));
    const mitW = weltlage();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    anmelden(pose);
    steuerungTakt(jd, 0, mitPad(padAttrappe({ werte: { [PAD.RT]: 1 } }), pose));
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ werte: { [PAD.RT]: 1 } }), pose));
    expect(laenge(minus(weltlage(), mitW))).toBeLessThan(1e-3);
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ werte: { [PAD.LT]: 1 } }), pose));
    expect(laenge(minus(weltlage(), lage('earth')))).toBeGreaterThan(laenge(minus(mitW, lage('earth'))));
  });

  it('dreht mit LB und Stick um den Körper nächst der Bildmitte mit 90°/s; LB allein tut nichts', () => {
    useStore.getState().toggleVisible('phobos');
    useStore.getState().toggleVisible('deimos');
    const pose = vorKoerper('mars');
    anmelden(pose);
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ gedrueckt: [PAD.LB] }), pose));
    expect(useStore.getState().camera.mode).toBe('free');
    steuerungTakt(jd, 0, mitPad(padAttrappe({ gedrueckt: [PAD.LB], axes: [1, 0, 0, 0] }), pose));
    const vorher = useStore.getState().camera;
    expect(vorher.mode).toBe('attached');
    expect(vorher.targetId).toBe('mars');
    steuerungTakt(jd, 0.5, mitPad(padAttrappe({ gedrueckt: [PAD.LB], axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.azimuth).toBeCloseTo(vorher.azimuth + Math.PI / 4, 12);
  });

  it('fährt mit LB und RT heran, Faktor 2 je Sekunde', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e6 });
    const pose = vorKoerper('earth');
    anmelden(pose);
    steuerungTakt(jd, 1, mitPad(padAttrappe({ gedrueckt: [PAD.LB], werte: { [PAD.RT]: 1 } }), pose));
    expect(useStore.getState().camera.distance).toBeCloseTo(5e5, 6);
  });

  it('sperrt Stick und Trigger nach dem Loslassen von LB, bis sie in der Totzone waren (Nachtrag §13.3)', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e6 });
    const pose = vorKoerper('earth');
    anmelden(pose);
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ gedrueckt: [PAD.LB], axes: [1, 0, 0, 0] }), pose));
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('attached');
    steuerungTakt(jd, 0.1, mitPad(ruhe, pose));
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('fly');
  });

  it('sperrt auch einen Trigger nach dem Loslassen von LB, bis er in der Totzone war (Nachtrag §13.3)', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e6 });
    const pose = vorKoerper('earth');
    anmelden(pose);
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ gedrueckt: [PAD.LB], werte: { [PAD.RT]: 1 } }), pose));
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ werte: { [PAD.RT]: 1 } }), pose));
    expect(useStore.getState().camera.mode).toBe('attached');
    steuerungTakt(jd, 0.1, mitPad(ruhe, pose));
    steuerungTakt(jd, 0.1, mitPad(padAttrappe({ werte: { [PAD.RT]: 1 } }), pose));
    expect(useStore.getState().camera.mode).toBe('fly');
  });

  it('meldet jede Controller-Eingabe beim Ruhewächter, auch eine Taste ohne Belegung', () => {
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(zeigerAusgeblendet()).toBe(true);
    anmelden();
    act(() => { steuerungTakt(jd, 0, mitPad(padAttrappe({ gedrueckt: [PAD.X] }), null)); });
    expect(zeigerAusgeblendet()).toBe(false);
    hook.unmount();
    vi.useRealTimers();
  });

  it('hält mit dem rechten Stick ein laufendes Kino an', () => {
    useStore.getState().setCinema({ pauseOnInput: true });
    anmelden();
    startCinema();
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [0, 0, 0.5, 0] }), null));
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('cinema');
  });

  it('bricht mit einem Stick eine laufende Kamerafahrt ab', () => {
    anmelden();
    fahreZu('mars', { jetzt: () => 0, anfordern: () => 1, abbrechen: () => { /* von Hand */ } });
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [0, 0, 0.5, 0] }), null));
    expect(fahrtLaeuft()).toBe(false);
  });

  it('beendet mit dem linken Stick ein Kino samt Wiederherstellung und fliegt ab dem gezeigten Bild', () => {
    useStore.getState().setTime({ rateDaysPerSec: 3 });
    const pose = vorErde();
    anmelden(pose);
    startCinema();
    useStore.getState().setTime({ rateDaysPerSec: 50 });
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [0.5, 0, 0, 0] }), pose));
    const z = useStore.getState();
    expect(z.cinema.running).toBe(false);
    expect(z.camera.mode).toBe('fly');
    expect(z.time.rateDaysPerSec).toBe(3);
  });

  it('lässt im selben Bild die Tastatur vor dem Controller wirken', () => {
    const pose = vorErde();
    anmelden(pose);
    steuerungTakt(jd, 0.5, { ...umgebung(['KeyW'], pose), pad: () => padAttrappe({ axes: [1, 0, 0, 0] }) });
    expect(useStore.getState().camera.mode).toBe('fly');
    expect(useStore.getState().camera.fly.yaw).toBeCloseTo(Math.PI, 12);
  });

  it('vergisst beim Trennen den Vorzustand: Nach dem Wiederauftauchen wirkt erst das zweite Bild', () => {
    const pose = vorErde();
    anmelden(pose);
    steuerungTakt(jd, 0, mitPad(null, pose));
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('free');
    steuerungTakt(jd, 0, mitPad(padAttrappe({ axes: [1, 0, 0, 0] }), pose));
    expect(useStore.getState().camera.mode).toBe('fly');
  });
});

describe('steuerungTakt: Fadenkreuz', () => {
  const l = { breite: 800, hoehe: 600 };
  const mitKreuz = (p: PadRoh | null, zeiger: unknown[]): SteuerungUmgebung =>
    ({ ...umgebung([], null), pad: () => p, leinwand: () => l, zeiger: (z) => { zeiger.push(z); } });

  beforeEach(() => { kreuzZuruecksetzen(); });

  it('zeigt das Kreuz ab der ersten Eingabe, bewegt es eine Leinwandhöhe je Sekunde und meldet es als Zeiger pad', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    expect(kreuzSichtbar()).toBe(false);
    expect(zeiger).toEqual([]);
    steuerungTakt(jd, 0.25, mitKreuz(padAttrappe({ axes: [0, 0, 1, 0] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);
    expect(kreuzLage(l)).toEqual({ x: 550, y: 300 });
    expect(zeiger.at(-1)).toEqual({ x: 550, y: 300, art: 'pad' });
  });

  it('holt das Kreuz mit R3 zur Mitte', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    steuerungTakt(jd, 0.25, mitKreuz(padAttrappe({ axes: [0, 0, 0, 1] }), zeiger));
    expect(kreuzLage(l).y).toBeCloseTo(450, 9);
    steuerungTakt(jd, 0, mitKreuz(padAttrappe({ gedrueckt: [PAD.R3] }), zeiger));
    expect(kreuzLage(l)).toEqual({ x: 400, y: 300 });
  });

  it('blendet das Kreuz beim Trennen aus und löscht den Zeiger genau einmal', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    steuerungTakt(jd, 0, mitKreuz(padAttrappe({ gedrueckt: [PAD.X] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);
    steuerungTakt(jd, 0, mitKreuz(null, zeiger));
    expect(kreuzSichtbar()).toBe(false);
    expect(zeiger.at(-1)).toBeNull();
    const anzahl = zeiger.length;
    steuerungTakt(jd, 0, mitKreuz(null, zeiger));
    expect(zeiger.length).toBe(anzahl);
  });

  it('löscht den Zeiger, wenn die Maus das Kreuz über einem Panel ausblendet (M-1)', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    steuerungTakt(jd, 0.25, mitKreuz(padAttrappe({ axes: [0, 0, 1, 0] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);
    kreuzAusblenden(); // wie das pointermove-Ausblenden über einem Panel (Fadenkreuz.tsx)
    const vorher = zeiger.length;
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    expect(zeiger.length).toBe(vorher + 1);
    expect(zeiger.at(-1)).toBeNull();
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    expect(zeiger.length).toBe(vorher + 1);
  });

  it('meldet keinen Zeiger, wenn die Maus vorher schon ihren eigenen gemeldet hat (M-1)', () => {
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    steuerungTakt(jd, 0.25, mitKreuz(padAttrappe({ axes: [0, 0, 1, 0] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);
    zeigerVonMaus(); // main.tsx: onZeiger meldet den Mauszeiger, löscht den Merker
    kreuzAusblenden();
    const vorher = zeiger.length;
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    expect(zeiger.length).toBe(vorher);
  });

  it('zeigt das Kreuz nach der Ruhe nur bei einer Controller-Eingabe wieder, nicht bei Tastatur oder Mausrad (M-2)', () => {
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    const zeiger: unknown[] = [];
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));
    steuerungTakt(jd, 0.25, mitKreuz(padAttrappe({ axes: [0, 0, 1, 0] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);

    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(zeigerAusgeblendet()).toBe(true);
    // Ein Controller-Bild ohne neue Eingabe während der Ruhe: löscht den Merker „an“.
    steuerungTakt(jd, 0, mitKreuz(padAttrappe(), zeiger));

    act(() => { window.dispatchEvent(new Event('keydown')); });
    expect(zeigerAusgeblendet()).toBe(false);
    expect(kreuzSichtbar()).toBe(false);

    steuerungTakt(jd, 0, mitKreuz(padAttrappe({ axes: [0, 0, 1, 0] }), zeiger));
    expect(kreuzSichtbar()).toBe(true);

    hook.unmount();
    vi.useRealTimers();
  });
});

describe('steuerungTakt: Tasten des Controllers', () => {
  const l = { breite: 800, hoehe: 600 };
  type Treffer = (x: number, y: number) => string | null;
  const mitTasten = (p: PadRoh, trefferBei: Treffer): SteuerungUmgebung =>
    ({ ...umgebung([], null), pad: () => p, leinwand: () => l, trefferBei });
  /** Ein Bild losgelassen, dann gedrückt: genau eine Flanke. */
  const druecke = (taste: number, trefferBei: Treffer = () => null): void => {
    steuerungTakt(jd, 0, mitTasten(padAttrappe(), trefferBei));
    steuerungTakt(jd, 0, mitTasten(padAttrappe({ gedrueckt: [taste] }), trefferBei));
  };

  beforeEach(() => { kreuzZuruecksetzen(); });

  it('fährt mit A zum Körper unter dem Kreuz', () => {
    const gefragt: [number, number][] = [];
    druecke(PAD.A, (x, y) => { gefragt.push([x, y]); return 'mars'; });
    expect(gefragt).toEqual([[400, 300]]);
    expect(useStore.getState().camera.targetId).toBe('mars');
    expect(fahrtLaeuft()).toBe(true);
  });

  it('tut mit A ohne Treffer nichts', () => {
    druecke(PAD.A);
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(fahrtLaeuft()).toBe(false);
  });

  it('fährt mit B in die Draufsicht auf das Sonnensystem', () => {
    useStore.getState().setCamera({ targetId: 'mars' });
    druecke(PAD.B);
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(fahrtLaeuft()).toBe(true);
  });

  it('ruft für Steuerkreuz, Ansicht und Y das Kürzel der Tastatur', () => {
    const z = () => useStore.getState();
    druecke(PAD.RECHTS);
    expect(z().time.rateDaysPerSec).toBeCloseTo(1.5, 12);
    druecke(PAD.LINKS);
    expect(z().time.rateDaysPerSec).toBeCloseTo(1, 12);
    druecke(PAD.RUNTER);
    expect(z().time.rateDaysPerSec).toBeCloseTo(-1, 12);
    druecke(PAD.HOCH);
    expect(z().time.paused).toBe(true);
    druecke(PAD.VIEW);
    expect(z().ui.hidden).toBe(true);
    const infoVorher = z().ui.panels[INFO_PANEL];
    druecke(PAD.Y);
    expect(z().ui.panels[INFO_PANEL]).toBeDefined();
    expect(z().ui.panels[INFO_PANEL]).not.toBe(infoVorher);
  });

  it('startet und beendet das Kino mit Menü/Start; RB und Menü halten es nicht an', () => {
    useStore.getState().setCinema({ pauseOnInput: true });
    druecke(PAD.MENUE);
    expect(useStore.getState().cinema.running).toBe(true);
    druecke(PAD.RB);
    expect(useStore.getState().cinema.running).toBe(true);
    expect(useStore.getState().cinema.nummer).toBe(1);
    druecke(PAD.MENUE);
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('lässt X, L3 und die Xbox-Taste ohne Wirkung auf Zeit, Oberfläche, Kino und Ziel', () => {
    const vorher = useStore.getState();
    druecke(PAD.X);
    druecke(PAD.L3);
    druecke(16); // Xbox-Taste: kein Kürzel, weder A noch B
    const z = useStore.getState();
    expect(z.time.rateDaysPerSec).toBe(vorher.time.rateDaysPerSec);
    expect(z.time.paused).toBe(vorher.time.paused);
    expect(z.ui.hidden).toBe(vorher.ui.hidden);
    expect(z.cinema.running).toBe(vorher.cinema.running);
    expect(z.camera.targetId).toBe(vorher.camera.targetId);
    expect(fahrtLaeuft()).toBe(false);
  });
});
