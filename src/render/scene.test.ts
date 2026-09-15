import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import type { LightingSettings } from './lighting';
import { exposureFor } from './exposure';
import { SCALE_PRESETS } from '../sim/scale';

// createBodyViews lädt beim Aufbau Texturen über THREE.TextureLoader, was in
// der Node-Testumgebung (kein document) fehlschlagen würde — hier interessiert
// nur die Bahnlinien-Verdrahtung, daher ein leerer Ersatz.
const koerperUpdateSpion = vi.fn();
vi.mock('./bodies', () => ({
  createBodyViews: () => ({ meshes: new Map(), update: koerperUpdateSpion }),
}));

// Dieselbe Begründung wie bei createBodyViews: createRingViews lädt beim
// Aufbau die Ringtextur über THREE.TextureLoader (siehe rings.ts).
vi.mock('./rings', () => ({
  createRingViews: () => ({ update: vi.fn(), dispose: vi.fn() }),
}));

// Die Gürtel legen beim ersten update() bis zu 50 000 Bahnelemente je Wolke
// an (belts.ts); geprüft wird das dort. Hier zählt nur die Verdrahtung.
vi.mock('./belts', () => ({
  createBeltViews: () => ({ update: vi.fn(), dispose: vi.fn() }),
}));

// Das Label-Overlay legt DOM-Knoten an; in der Node-Testumgebung gibt es
// kein document. Hier interessiert nur die Bahnlinien-Verdrahtung. Der
// Mock nimmt den Namensauflöser (zweiter Parameter von createLabelOverlay)
// und die Sprache (fünfter Parameter von update) entgegen, wertet sie aber
// nicht aus.
vi.mock('./labels', () => ({
  createLabelOverlay: () => ({
    update: vi.fn(),
    dispose: vi.fn(),
  }),
}));

const updateSpion = vi.fn();
vi.mock('./orbits', () => ({
  createOrbitLines: () => ({ update: updateSpion }),
}));

const { buildScene } = await import('./scene');
const { DEFAULT_STATE } = await import('../store');
const { AU_KM } = await import('../sim/orbit');
const { kmToUnits } = await import('./units');

/** buildScene reicht das Overlay nur an das (ersetzte) Label-Modul weiter. */
const fakeOverlay = {} as HTMLElement;

// Der WebGLRenderer selbst braucht einen echten Canvas/GL-Kontext, den es in
// der Node-Testumgebung nicht gibt. buildScene liest davon nur die
// Pixeldichte (für die Punktgröße der Gürtel), daher genügt hier ein
// Platzhalter mit genau dieser Methode statt einer echten Instanz.
function fakeContext(): import('./renderer').RenderContext {
  return {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: { getPixelRatio: () => 1 } as unknown as THREE.WebGLRenderer,
    resize: () => {},
    setPixelRatioCap: () => {},
    afterResize: null,
    dispose: () => {},
  };
}

describe('buildScene — Bahnlinien', () => {
  it('reicht jedem Frame Zeit, Maßstab, Sichtbarkeit und Schalter an die Linien', () => {
    updateSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay, (k) => k);
    for (let i = 0; i < 50; i++) {
      szene.update(2451545.0 + i, 0.016, DEFAULT_STATE);
    }
    // Die Linien rechnen die momentane Bahnellipse je Bild selbst (orbits.ts);
    // einen gesonderten Neuaufbau bei Maßstabsänderung gibt es nicht mehr.
    expect(updateSpion).toHaveBeenCalledTimes(50);
    expect(updateSpion).toHaveBeenLastCalledWith(
      expect.any(THREE.Vector3), DEFAULT_STATE.visible, DEFAULT_STATE.display.orbits,
      2451545.0 + 49, DEFAULT_STATE.scale,
    );
  });
});

describe('buildScene — die Kamera belichtet auf das Ziel', () => {
  /** Die Lichteinstellungen, die der letzte Körper-Update-Aufruf bekommen hat. */
  function letztesLicht(): LightingSettings {
    const aufrufe = koerperUpdateSpion.mock.calls;
    return aufrufe[aufrufe.length - 1]![4] as LightingSettings;
  }

  it('reicht bei Ziel Sonne die Helligkeit mal π an die Körper', () => {
    koerperUpdateSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay, (k) => k);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    // Standardziel ist die Sonne im Ursprung: Referenz 1 AE, Faktor π.
    expect(letztesLicht().brightness).toBeCloseTo(DEFAULT_STATE.display.brightness * Math.PI, 10);
    // Alles andere aus display kommt unverändert durch.
    expect(letztesLicht().nightFill).toBe(DEFAULT_STATE.display.nightFill);
    expect(letztesLicht().lightCompensation).toBe(DEFAULT_STATE.display.lightCompensation);
  });

  it('kalibriert das Punktlicht auf die belichtete Helligkeit', () => {
    const ctx = fakeContext();
    const szene = buildScene(ctx, fakeOverlay, (k) => k);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    const licht = ctx.scene.children.find((o) => o instanceof THREE.PointLight) as THREE.PointLight;
    const auEinheiten = kmToUnits(AU_KM);
    const erwartet = DEFAULT_STATE.display.brightness * Math.PI
      * auEinheiten ** DEFAULT_STATE.display.lightFalloff;
    expect(licht.intensity).toBeCloseTo(erwartet, 6);
  });

  it('belichtet im ersten Frame direkt auf ein fernes Ziel und zieht danach gedämpft nach', () => {
    koerperUpdateSpion.mockClear();
    const szene = buildScene(fakeContext(), fakeOverlay, (k) => k);
    const neptun = {
      ...DEFAULT_STATE,
      scale: { ...SCALE_PRESETS.realistisch, preset: 'realistisch' },
      camera: { ...DEFAULT_STATE.camera, mode: 'attached' as const, targetId: 'neptune' },
    };
    szene.update(2451545.0, 0.016, neptun);
    const soll = exposureFor(neptun, 2451545.0);
    expect(letztesLicht().brightness).toBeCloseTo(neptun.display.brightness * soll, 10);

    // Zurück zur Sonne: ein Frame später liegt der Wert zwischen beiden.
    szene.update(2451545.0, 0.016, { ...neptun, camera: { ...neptun.camera, targetId: 'sun' } });
    const dazwischen = letztesLicht().brightness;
    expect(dazwischen).toBeLessThan(neptun.display.brightness * soll);
    expect(dazwischen).toBeGreaterThan(neptun.display.brightness * Math.PI);
  });
});

describe('buildScene — Blickmatrix', () => {
  it('erneuert die Blickmatrix im selben update, damit Overlay und Treffer das aktuelle Bild sehen', () => {
    const ctx = fakeContext();
    const szene = buildScene(ctx, fakeOverlay, (k) => k);
    const seitlich = { ...DEFAULT_STATE, camera: { ...DEFAULT_STATE.camera, azimuth: 0, elevation: 0 } };
    szene.update(2451545.0, 5, seitlich);
    szene.update(2451545.0, 5, seitlich);
    // Blick zur Seite: Die Drehung ist deutlich, eine veraltete Einheitsmatrix fiele auf.
    expect(Math.abs(ctx.camera.quaternion.w)).toBeLessThan(0.99);
    const erwartet = new THREE.Matrix4().makeRotationFromQuaternion(ctx.camera.quaternion).invert();
    erwartet.elements.forEach((wert, i) => {
      expect(ctx.camera.matrixWorldInverse.elements[i]).toBeCloseTo(wert, 9);
    });
  });
});
