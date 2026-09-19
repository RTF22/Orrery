// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  steuerungTakt, tempoAendern, tempoAbonnieren, tempoFaktor, tempoZuruecksetzen,
  TEMPO_START, TEMPO_MIN, TEMPO_MAX,
} from './anwenden';
import type { SteuerungUmgebung } from './anwenden';
import type { Flugtaste } from './tastatur';
import { useStore, DEFAULT_STATE } from '../../store';
import { bodies, bodyIndex } from '../../data';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { kreuz, laenge, mal, minus, normiert, plus } from '../../render/camera/flug';
import type { GezeigtePose } from '../../render/camera/flug';
import { startCinema, stopCinema } from '../cinemaControl';
import { fahreZu, fahrtAbbrechen, fahrtLaeuft } from '../kamerafahrt';

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

beforeEach(() => {
  fahrtAbbrechen();
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  tempoZuruecksetzen();
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
  /** Gezeigte Lage 2·10⁷ km sonnenseitig vor dem Körper, Blick um `versatzKm` an seiner Mitte vorbei. */
  function vorKoerper(id: string, versatzKm = 2e5): GezeigtePose {
    const k = lage(id);
    const aussen = normiert(k);
    const quer = normiert(kreuz(aussen, { x: 0, y: 0, z: 1 }));
    const von = minus(k, mal(aussen, 2e7));
    return { positionKm: von, blick: normiert(minus(plus(k, mal(quer, versatzKm)), von)), jd };
  }

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

  it('kehrt beim Loslassen von Shift mit gehaltener Taste in den Flug zurück', () => {
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
