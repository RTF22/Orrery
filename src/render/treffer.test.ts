import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  abstandZumSegment, findeTreffer, projiziereZug, zeigerartVon, FANG_PX,
} from './treffer';
import type { Kandidaten, Scheibe } from './treffer';

const scheibe = (
  id: string, x: number, y: number, radiusPx: number, tiefe = 0.5, istMond = false, glyphe = false,
): Scheibe => ({ id, x, y, radiusPx, tiefe, istMond, glyphe });
const zug = (id: string, ...xy: number[]) => ({ id, punkte: Float64Array.from(xy) });
const leer: Kandidaten = { scheiben: [], namen: [], bahnen: [] };

describe('findeTreffer', () => {
  it('liefert ohne Kandidaten null', () => {
    expect(findeTreffer({ x: 0, y: 0 }, leer, 8)).toBeNull();
  });

  it('nimmt auf überlappenden Scheiben die vorderste', () => {
    const k = { ...leer, scheiben: [scheibe('jupiter', 100, 100, 50, 0.9), scheibe('io', 110, 100, 5, 0.8, true)] };
    expect(findeTreffer({ x: 110, y: 100 }, k, 8)).toBe('io');
    expect(findeTreffer({ x: 80, y: 100 }, k, 8)).toBe('jupiter');
  });

  it('entscheidet zwischen Glyphenscheiben nach der nächsten Mitte, nicht nach der Tiefe (Mars und Deimos)', () => {
    const k = {
      ...leer,
      scheiben: [
        scheibe('mars', 100, 100, 3, 0.9, false, true),
        scheibe('deimos', 100.6, 100, 3, 0.8, true, true),
      ],
    };
    expect(findeTreffer({ x: 100, y: 100 }, k, 8)).toBe('mars');
    expect(findeTreffer({ x: 100.6, y: 100 }, k, 8)).toBe('deimos');
  });

  it('nimmt bei Glyphenscheiben mit gleichem Abstand den Planeten vor dem vorderen Mond', () => {
    const k = {
      ...leer,
      scheiben: [
        scheibe('deimos', 100.3, 100, 3, 0.1, true, true),
        scheibe('mars', 100, 100, 3, 0.9, false, true),
      ],
    };
    expect(findeTreffer({ x: 100.15, y: 100 }, k, 8)).toBe('mars');
  });

  it('lässt eine echte Planetenscheibe eine Glyphe davor schlagen', () => {
    const k = {
      ...leer,
      scheiben: [
        scheibe('jupiter', 100, 100, 10, 0.9),
        scheibe('io', 104, 100, 3, 0.5, true, true),
      ],
    };
    expect(findeTreffer({ x: 104, y: 100 }, k, 8)).toBe('jupiter');
    expect(findeTreffer({ x: 111.5, y: 100 }, k, 8)).toBe('io');
  });

  it('zieht die Scheibe dem Namen und den Namen der Bahn vor', () => {
    const k: Kandidaten = {
      scheiben: [scheibe('mars', 50, 50, 10)],
      namen: [{ id: 'earth', links: 40, oben: 40, rechts: 120, unten: 60 }],
      bahnen: [zug('venus', 0, 50, 200, 50)],
    };
    expect(findeTreffer({ x: 50, y: 50 }, k, 8)).toBe('mars');
    expect(findeTreffer({ x: 100, y: 50 }, k, 8)).toBe('earth');
    expect(findeTreffer({ x: 150, y: 50 }, k, 8)).toBe('venus');
  });

  it('zieht den Namen einer nahen Scheibenmitte vor', () => {
    const k: Kandidaten = {
      ...leer,
      scheiben: [scheibe('mars', 100, 50, 2)],
      namen: [{ id: 'earth', links: 104, oben: 40, rechts: 160, unten: 60 }],
    };
    expect(findeTreffer({ x: 105, y: 50 }, k, 8)).toBe('earth');
  });

  it('nimmt im Fangradius die nächste Mitte, bei Gleichstand den Planeten vor dem Mond', () => {
    const k = { ...leer, scheiben: [scheibe('io', 106, 100, 1, 0.1, true), scheibe('jupiter', 94, 100, 1, 0.9), scheibe('europa', 103, 100, 1, 0.5, true)] };
    expect(findeTreffer({ x: 104, y: 100 }, k, 8)).toBe('europa');
    const gleich = { ...leer, scheiben: [scheibe('io', 106, 100, 1, 0.1, true), scheibe('jupiter', 94.2, 100, 1, 0.9)] };
    expect(findeTreffer({ x: 100, y: 100 }, gleich, 8)).toBe('jupiter');
  });

  it('wertet den Fangradius einschließlich der Grenze', () => {
    const k = { ...leer, scheiben: [scheibe('mars', 0, 0, 1)] };
    expect(findeTreffer({ x: 8, y: 0 }, k, FANG_PX.maus)).toBe('mars');
    expect(findeTreffer({ x: 8.01, y: 0 }, k, FANG_PX.maus)).toBeNull();
    expect(findeTreffer({ x: 20, y: 0 }, k, FANG_PX.finger)).toBe('mars');
  });

  it('trifft die nähere Bahn im Fangradius', () => {
    const k = { ...leer, bahnen: [zug('mars', 0, 0, 100, 0), zug('venus', 0, 10, 100, 10)] };
    expect(findeTreffer({ x: 50, y: 3 }, k, 8)).toBe('mars');
    expect(findeTreffer({ x: 50, y: 7 }, k, 8)).toBe('venus');
    expect(findeTreffer({ x: 50, y: 30 }, k, 8)).toBeNull();
  });

  it('überspringt Segmente mit einem Punkt hinter der Kamera', () => {
    const k = { ...leer, bahnen: [zug('mars', 0, 0, Number.NaN, Number.NaN, 100, 0)] };
    expect(findeTreffer({ x: 50, y: 0 }, k, 8)).toBeNull();
  });

  it('lässt die Bahn eines Mondes den Klick auf seinen Planeten nicht stören', () => {
    const k = { ...leer, scheiben: [scheibe('jupiter', 100, 100, 4)], bahnen: [zug('io', 95, 100, 105, 100)] };
    expect(findeTreffer({ x: 101, y: 100 }, k, 8)).toBe('jupiter');
    expect(findeTreffer({ x: 106, y: 100 }, k, 8)).toBe('jupiter');
  });

  it('fängt mit dem Fadenkreuz des Controllers wie mit dem Finger (20 px)', () => {
    const k: Kandidaten = { ...leer, scheiben: [scheibe('mars', 100, 100, 2)] };
    expect(findeTreffer({ x: 115, y: 100 }, k, FANG_PX.pad)).toBe('mars');
    expect(findeTreffer({ x: 115, y: 100 }, k, FANG_PX.maus)).toBeNull();
  });
});

describe('abstandZumSegment', () => {
  it('misst zum Lotfußpunkt innerhalb und zum Endpunkt außerhalb', () => {
    expect(abstandZumSegment(5, 3, 0, 0, 10, 0)).toBe(3);
    expect(abstandZumSegment(13, 4, 0, 0, 10, 0)).toBe(5);
    expect(abstandZumSegment(1, 1, 0, 0, 0, 0)).toBeCloseTo(Math.SQRT2, 12);
  });
});

describe('zeigerartVon', () => {
  it('unterscheidet Finger von Maus und Stift', () => {
    expect(zeigerartVon('touch')).toBe('finger');
    expect(zeigerartVon('mouse')).toBe('maus');
    expect(zeigerartVon('pen')).toBe('maus');
  });
});

describe('projiziereZug', () => {
  it('rechnet wie Vector3.project und markiert Punkte hinter der Kamera', () => {
    const kamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1e6);
    kamera.lookAt(1, 0.3, -2);
    kamera.updateMatrixWorld();
    const m = new THREE.Matrix4().multiplyMatrices(kamera.projectionMatrix, kamera.matrixWorldInverse);
    const punkte = [0.5, 0.2, -3, -1, 0.4, -5, 0, 0, 4];
    const ziel = new Float64Array(6);
    projiziereZug(punkte, 3, m, 1600, 900, ziel);
    for (let i = 0; i < 2; i++) {
      const v = new THREE.Vector3(punkte[i * 3], punkte[i * 3 + 1], punkte[i * 3 + 2]).project(kamera);
      expect(ziel[i * 2]).toBeCloseTo((v.x * 0.5 + 0.5) * 1600, 6);
      expect(ziel[i * 2 + 1]).toBeCloseTo((-v.y * 0.5 + 0.5) * 900, 6);
    }
    expect(Number.isNaN(ziel[4])).toBe(true);
  });
});
