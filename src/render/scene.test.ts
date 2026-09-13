import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';

// createBodyViews lädt beim Aufbau Texturen über THREE.TextureLoader, was in
// der Node-Testumgebung (kein document) fehlschlagen würde — hier interessiert
// nur die Bahnlinien-Verdrahtung, daher ein leerer Ersatz.
vi.mock('./bodies', () => ({
  createBodyViews: () => ({ meshes: new Map(), update: vi.fn() }),
}));

// Dieselbe Begründung wie bei createBodyViews: createRingViews lädt beim
// Aufbau die Ringtextur über THREE.TextureLoader (siehe rings.ts).
vi.mock('./rings', () => ({
  createRingViews: () => ({ update: vi.fn(), dispose: vi.fn() }),
}));

// Das Label-Overlay legt DOM-Knoten an; in der Node-Testumgebung gibt es
// kein document. Hier interessiert nur die Bahnlinien-Verdrahtung.
vi.mock('./labels', () => ({
  createLabelOverlay: () => ({ update: vi.fn(), dispose: vi.fn() }),
}));

const rebuildSpion = vi.fn();
const updateSpion = vi.fn();
vi.mock('./orbits', () => ({
  createOrbitLines: () => ({ rebuild: rebuildSpion, update: updateSpion }),
}));

const { buildScene } = await import('./scene');
const { DEFAULT_STATE } = await import('../store');

/** buildScene reicht das Overlay nur an das (ersetzte) Label-Modul weiter. */
const fakeOverlay = {} as HTMLElement;

// Der WebGLRenderer selbst braucht einen echten Canvas/GL-Kontext, den es in
// der Node-Testumgebung nicht gibt. buildScene liest ctx.renderer nirgends,
// daher genügt hier ein Platzhalter statt einer echten Instanz.
function fakeContext(): import('./renderer').RenderContext {
  return {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: {} as unknown as THREE.WebGLRenderer,
    resize: () => {},
    setPixelRatioCap: () => {},
    afterResize: null,
    dispose: () => {},
  };
}

describe('buildScene — Bahnlinien-Rebuild-Disziplin', () => {
  it('baut die Bahnform beim ersten Frame auf', () => {
    rebuildSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(rebuildSpion).toHaveBeenCalledTimes(1);
  });

  it('ruft rebuild NICHT erneut auf, solange sich die Maßstabsreferenz nicht ändert', () => {
    rebuildSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay);
    for (let i = 0; i < 50; i++) {
      szene.update(2451545.0 + i, 0.016, DEFAULT_STATE);
    }
    // 50 Frames mit identischem state.scale-Objekt — genau ein rebuild (beim
    // ersten Frame), keines danach. Das ist die Performance-Zusicherung
    // dieser Aufgabe: die teure Bahnform wird nicht pro Frame neu berechnet.
    expect(rebuildSpion).toHaveBeenCalledTimes(1);
    expect(updateSpion).toHaveBeenCalledTimes(50);
  });

  it('ruft rebuild erneut auf, sobald sich die Maßstabseinstellungen ändern', () => {
    rebuildSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    const geaendert = { ...DEFAULT_STATE, scale: { ...DEFAULT_STATE.scale, sizeScale: 99 } };
    szene.update(2451546.0, 0.016, geaendert);
    expect(rebuildSpion).toHaveBeenCalledTimes(2);
  });
});
