// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  himmelStarten, himmelVerlassen, himmelUmschalten, himmelAusrichten, himmelSchwenken, HIMMEL_SCHWENK_JE_S,
} from './himmelsmodus';
import { useStore, DEFAULT_STATE } from '../store';
import { geozentrischeRichtung, richtungZuWinkeln } from '../sim/geozentrisch';
import { positionAt } from '../sim/orbit';
import { fokusAbstand, scaledPositionAt } from '../sim/scale';
import { bodyIndex } from '../data';
import { startCinema, stopCinema, cinemaAktiv } from './cinemaControl';
import { createCameraController } from '../render/camera/controller';
import { dargestellterMassstab } from '../store/himmelsansicht';
import { laenge, minus } from '../render/camera/flug';

const jd = DEFAULT_STATE.time.jd;
beforeEach(() => {
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('himmelStarten', () => {
  it('blickt auf das Ziel, wenn es weder Erde noch Sonne ist', () => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'mars' });
    himmelStarten();
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('geozentrisch');
    const soll = richtungZuWinkeln(geozentrischeRichtung('mars', bodyIndex, jd));
    expect(camera.geo.yaw).toBeCloseTo(soll.yaw, 12);
    expect(camera.geo.pitch).toBeCloseTo(soll.pitch, 12);
  });

  it('blickt sonst zur Gegensonne', () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    himmelStarten();
    const soll = richtungZuWinkeln(positionAt('earth', bodyIndex, jd));
    expect(useStore.getState().camera.geo.yaw).toBeCloseTo(soll.yaw, 12);
  });

  it('beendet ein laufendes Kino', () => {
    startCinema();
    himmelStarten();
    expect(cinemaAktiv()).toBe(false);
    expect(useStore.getState().camera.mode).toBe('geozentrisch');
  });
});

describe('himmelVerlassen', () => {
  it('heftet bei Ziel Erde im Fokusabstand des eigenen Maßstabs', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', targetId: 'earth' });
    himmelVerlassen();
    const { camera, scale } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.distance).toBeCloseTo(fokusAbstand(bodyIndex.earth!, scale), 3);
  });

  it('heftet sonst an der gezeigten Lage um das Ziel', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', targetId: 'mars' });
    const state = useStore.getState();
    createCameraController(new THREE.PerspectiveCamera()).update(state, jd, 1 / 60, dargestellterMassstab(state));
    himmelVerlassen();
    const { camera, scale } = useStore.getState();
    expect(camera.mode).toBe('attached');
    const erde = scaledPositionAt('earth', bodyIndex, jd, dargestellterMassstab(state));
    const mars = scaledPositionAt('mars', bodyIndex, jd, scale);
    expect(Math.abs(camera.distance - laenge(minus(erde, mars))) / camera.distance).toBeLessThan(1e-9);
  });

  it('schaltet mit himmelUmschalten hin und zurück', () => {
    himmelUmschalten();
    expect(useStore.getState().camera.mode).toBe('geozentrisch');
    himmelUmschalten();
    expect(useStore.getState().camera.mode).not.toBe('geozentrisch');
  });
});

describe('himmelAusrichten und himmelSchwenken', () => {
  it('richtet den Blick auf einen Körper, setzt das Ziel und löst ein Thema', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch' });
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    himmelAusrichten('jupiter');
    const s = useStore.getState();
    expect(s.camera.targetId).toBe('jupiter');
    expect(s.ui.info.thema).toBeNull();
    expect(s.camera.geo.yaw).toBeCloseTo(richtungZuWinkeln(geozentrischeRichtung('jupiter', bodyIndex, jd)).yaw, 12);
  });

  it('richtet unter der Lupe auf die dargestellte Lage eines Mondes', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { ...DEFAULT_STATE.camera.geo, lupe: 25 } });
    himmelAusrichten('io');
    const s = useStore.getState();
    const dar = (id: string) => scaledPositionAt(id, bodyIndex, jd, dargestellterMassstab(s));
    const io = dar('io'), erde = dar('earth');
    const soll = richtungZuWinkeln({ x: io.x - erde.x, y: io.y - erde.y, z: io.z - erde.z });
    const wahr = richtungZuWinkeln(geozentrischeRichtung('io', bodyIndex, jd));
    expect(s.camera.geo.yaw).toBeCloseTo(soll.yaw, 10);
    expect(s.camera.geo.pitch).toBeCloseTo(soll.pitch, 10);
    expect(Math.abs(s.camera.geo.yaw - wahr.yaw) + Math.abs(s.camera.geo.pitch - wahr.pitch)).toBeGreaterThan(1e-6);
  });

  it('richtet bei Lupe 1 auf die wahre Richtung', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { ...DEFAULT_STATE.camera.geo, lupe: 1 } });
    himmelAusrichten('io');
    const soll = richtungZuWinkeln(geozentrischeRichtung('io', bodyIndex, jd));
    expect(useStore.getState().camera.geo.yaw).toBeCloseTo(soll.yaw, 9);
    expect(useStore.getState().camera.geo.pitch).toBeCloseTo(soll.pitch, 9);
  });

  it('schwenkt mit D nach rechts, skaliert mit dem Bildwinkel', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { yaw: 0, pitch: 0, fovDeg: 50, lupe: 1 } });
    himmelSchwenken(1, { vor: 0, seit: 1, hoch: 0 });
    expect(useStore.getState().camera.geo.yaw).toBeCloseTo(-HIMMEL_SCHWENK_JE_S, 12);
    useStore.getState().setCamera({ geo: { yaw: 0, pitch: 0, fovDeg: 5, lupe: 1 } });
    himmelSchwenken(1, { vor: 0, seit: 1, hoch: 0 });
    expect(useStore.getState().camera.geo.yaw).toBeCloseTo(-HIMMEL_SCHWENK_JE_S / 10, 12);
  });

  it('zoomt mit E hinein und bleibt in den Grenzen', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { yaw: 0, pitch: 0, fovDeg: 2, lupe: 1 } });
    himmelSchwenken(10, { vor: 0, seit: 0, hoch: 1 });
    expect(useStore.getState().camera.geo.fovDeg).toBe(1);
    himmelSchwenken(10, { vor: 0, seit: 0, hoch: -1 });
    expect(useStore.getState().camera.geo.fovDeg).toBe(90);
  });

  it('hält den Blick knapp unter dem Pol', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { yaw: 0, pitch: 1.5, fovDeg: 50, lupe: 1 } });
    himmelSchwenken(10, { vor: 1, seit: 0, hoch: 0 });
    expect(useStore.getState().camera.geo.pitch).toBeCloseTo(Math.PI / 2 - 0.01, 12);
  });
});
