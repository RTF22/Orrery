// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  fahreZu, fahreZuSystem, fahrtAbbrechen, fahrtLaeuft, fokusAbstand, systemAbstand, FAHRT_MS,
  SYSTEM_RAND, DRAUFSICHT_ELEVATION,
} from './kamerafahrt';
import { useStore, DEFAULT_STATE } from '../store';
import { bodyIndex } from '../data';
import { systemRadiusKm } from '../render/camera/cinema';
import { KAMERA_FOV_GRAD } from '../render/renderer';
import { noteUserInput, resumeIfIdle } from './cinemaControl';
import { scaledPositionAt } from '../sim/scale';
import { plus } from '../render/camera/flug';
import type { GezeigtePose } from '../render/camera/flug';

/** Handgesteuerte Uhr und Bildplanung, damit die Fahrt ohne Timer prüfbar ist. */
function planer(): { optionen: Parameters<typeof fahreZu>[1]; vor(ms: number): void } {
  let ms = 0;
  let naechster: (() => void) | null = null;
  return {
    optionen: {
      jetzt: () => ms,
      anfordern: (schritt) => { naechster = schritt; return 1; },
      abbrechen: () => { naechster = null; },
    },
    vor(delta) {
      ms += delta;
      const s = naechster;
      naechster = null;
      s?.();
    },
  };
}

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('fahreZu', () => {
  it('setzt das Ziel sofort und gleitet den Abstand in 1,5 s logarithmisch ans Ziel', () => {
    const p = planer();
    useStore.getState().setCamera({ distance: 1e9 });
    fahreZu('saturn', p.optionen);
    const s = useStore.getState();
    expect(s.camera.targetId).toBe('saturn');
    expect(s.camera.mode).toBe('attached');
    expect(s.camera.freezeJd).toBeNull();
    expect(fahrtLaeuft()).toBe(true);
    const ziel = fokusAbstand(bodyIndex.saturn!, s.scale);
    const werte: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      p.vor(FAHRT_MS / 5);
      werte.push(useStore.getState().camera.distance);
    }
    for (let i = 1; i < werte.length; i += 1) expect(werte[i]!).toBeLessThanOrEqual(werte[i - 1]!);
    expect(useStore.getState().camera.distance).toBeCloseTo(ziel, 6);
    expect(fahrtLaeuft()).toBe(false);
  });

  it('bricht bei einer Nutzereingabe ab und bleibt stehen', () => {
    const p = planer();
    useStore.getState().setCamera({ distance: 1e9 });
    fahreZu('earth', p.optionen);
    p.vor(FAHRT_MS / 3);
    const mitte = useStore.getState().camera.distance;
    window.dispatchEvent(new Event('wheel'));
    expect(fahrtLaeuft()).toBe(false);
    p.vor(FAHRT_MS);
    expect(useStore.getState().camera.distance).toBe(mitte);
  });

  it('ersetzt eine laufende Fahrt und beendet ein laufendes Kino', () => {
    const p = planer();
    useStore.getState().setCinema({ running: true });
    useStore.getState().setCamera({ mode: 'cinema' });
    fahreZu('earth', p.optionen);
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('attached');
    fahreZu('moon', p.optionen);
    expect(useStore.getState().camera.targetId).toBe('moon');
    p.vor(FAHRT_MS + 1);
    expect(useStore.getState().camera.distance).toBeCloseTo(fokusAbstand(bodyIndex.moon!, useStore.getState().scale), 6);
  });

  it('ignoriert unbekannte Körper', () => {
    const vorher = useStore.getState().camera;
    fahreZu('vulcan', planer().optionen);
    expect(useStore.getState().camera).toEqual(vorher);
    expect(fahrtLaeuft()).toBe(false);
  });

  it('lässt Azimut und Elevation stehen', () => {
    const p = planer();
    useStore.getState().setCamera({ azimuth: 1.1, elevation: 0.3 });
    fahreZu('mars', p.optionen);
    p.vor(FAHRT_MS / 2);
    p.vor(FAHRT_MS);
    expect(useStore.getState().camera.azimuth).toBe(1.1);
    expect(useStore.getState().camera.elevation).toBe(0.3);
  });

  it('heftet auch aus der Verfolgung an', () => {
    useStore.getState().setCamera({ mode: 'follow', freezeJd: 2451000 });
    fahreZu('mars', planer().optionen);
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.freezeJd).toBeNull();
  });

  it('beendet ein durch Eingabe angehaltenes Kino, das danach nicht wieder anläuft', () => {
    useStore.getState().setCinema({ running: true, pauseOnInput: true });
    useStore.getState().setCamera({ mode: 'cinema' });
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
    fahreZu('mars', planer().optionen);
    expect(useStore.getState().camera.mode).toBe('attached');
    expect(useStore.getState().camera.targetId).toBe('mars');
    resumeIfIdle(Date.now() + 1e9);
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('verwirft ein gewähltes Thema, auch wenn das Ziel gleich bleibt', () => {
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    fahreZu('sun', planer().optionen);
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(useStore.getState().ui.info.thema).toBeNull();
  });
});

describe('systemAbstand', () => {
  const halbesSichtfeld = Math.tan((KAMERA_FOV_GRAD * Math.PI) / 360);

  it('passt im Querformat die Bahn des äußersten Planeten mit Rand in die halbe Bildhöhe', () => {
    const { time, scale } = useStore.getState();
    const halbeHoehe = systemAbstand(time.jd, scale, 16 / 9) * halbesSichtfeld;
    expect(halbeHoehe / systemRadiusKm(time.jd, scale)).toBeCloseTo(SYSTEM_RAND, 9);
  });

  it('rückt im Hochformat weiter weg, damit die Breite reicht', () => {
    const { time, scale } = useStore.getState();
    expect(systemAbstand(time.jd, scale, 0.5) / systemAbstand(time.jd, scale, 1)).toBeCloseTo(2, 9);
  });

  it('behandelt ein unbrauchbares Seitenverhältnis wie Querformat', () => {
    const { time, scale } = useStore.getState();
    expect(systemAbstand(time.jd, scale, 0)).toBe(systemAbstand(time.jd, scale, 1));
    expect(systemAbstand(time.jd, scale, Number.NaN)).toBe(systemAbstand(time.jd, scale, 1));
  });
});

describe('fahreZuSystem', () => {
  it('fährt zur Sonne und gleitet in die Draufsicht mit dem Abstand der Systemschau', () => {
    const p = planer();
    useStore.getState().setCamera({ targetId: 'saturn', distance: 1e6, azimuth: 1.1, elevation: 0.3 });
    fahreZuSystem(p.optionen);
    const s = useStore.getState();
    expect(s.camera.targetId).toBe('sun');
    expect(s.camera.mode).toBe('attached');
    expect(s.camera.freezeJd).toBeNull();

    p.vor(FAHRT_MS / 2);
    const mitte = useStore.getState().camera.elevation;
    expect(mitte).toBeGreaterThan(0.3);
    expect(mitte).toBeLessThan(DRAUFSICHT_ELEVATION);

    p.vor(FAHRT_MS);
    const { camera, scale, time } = useStore.getState();
    expect(camera.elevation).toBeCloseTo(DRAUFSICHT_ELEVATION, 9);
    expect(camera.azimuth).toBe(1.1);
    const seiten = window.innerWidth / window.innerHeight;
    expect(camera.distance / systemAbstand(time.jd, scale, seiten)).toBeCloseTo(1, 9);
    expect(fahrtLaeuft()).toBe(false);
  });

  it('beendet ein laufendes Kino', () => {
    useStore.getState().setCinema({ running: true });
    useStore.getState().setCamera({ mode: 'cinema' });
    fahreZuSystem(planer().optionen);
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.targetId).toBe('sun');
  });

  it('setzt das Thema Sonnensystem im selben Zug wie das Ziel', () => {
    useStore.getState().setCamera({ targetId: 'saturn' });
    useStore.getState().setInfo({ thema: 'ringe' });
    const zuege: Array<[string, string | null]> = [];
    const abbestellen = useStore.subscribe((s) => { zuege.push([s.camera.targetId, s.ui.info.thema]); });
    fahreZuSystem(planer().optionen);
    abbestellen();
    expect(useStore.getState().ui.info.thema).toBe('sonnensystem');
    // Kein Zwischenstand, in dem das Ziel schon Sonne ist, das Thema aber noch fehlt.
    expect(zuege.filter(([ziel, thema]) => ziel === 'sun' && thema !== 'sonnensystem')).toEqual([]);
  });
});

describe('Fahrt aus dem Flug', () => {
  it('beginnt an der gezeigten Lage statt beim Kugelabstand von vor dem Flug', () => {
    const p = planer();
    const { time, scale } = useStore.getState();
    const mars = scaledPositionAt('mars', bodyIndex, time.jd, scale);
    const pose: GezeigtePose = { positionKm: plus(mars, { x: 0, y: 3e6, z: 0 }), blick: { x: 0, y: -1, z: 0 }, jd: time.jd };
    useStore.getState().setCamera({ mode: 'fly', distance: 1e9 });
    fahreZu('mars', { ...p.optionen, pose: () => pose });
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.distance).toBeCloseTo(3e6, 3);
    expect(camera.azimuth).toBeCloseTo(Math.PI / 2, 9);
    expect(camera.elevation).toBeCloseTo(0, 9);
    for (let i = 0; i < 6; i += 1) p.vor(FAHRT_MS / 5);
    expect(useStore.getState().camera.distance).toBeCloseTo(fokusAbstand(bodyIndex.mars!, scale), 6);
  });

  it('beginnt auch die Draufsicht aus dem Flug an der gezeigten Lage', () => {
    const p = planer();
    const pose: GezeigtePose = { positionKm: { x: 2e8, y: 0, z: 0 }, blick: { x: -1, y: 0, z: 0 }, jd: useStore.getState().time.jd };
    useStore.getState().setCamera({ mode: 'fly', distance: 1e12 });
    fahreZuSystem({ ...p.optionen, pose: () => pose });
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(useStore.getState().camera.distance).toBeCloseTo(2e8, 0);
  });
});
