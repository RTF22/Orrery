import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import type { LightingSettings } from './lighting';
import { exposureFor } from './exposure';
import { SCALE_PRESETS } from '../sim/scale';
import { projiziereZug } from './treffer';

// Die Körper laden nichts mehr selbst (siehe texturen.ts unten); hier
// interessiert nur die Bahnlinien-Verdrahtung, daher ein leerer Ersatz.
const koerperUpdateSpion = vi.fn();
vi.mock('./bodies', () => ({
  createBodyViews: () => ({
    meshes: new Map(), update: koerperUpdateSpion, setzeTextur: vi.fn(), texturBreite: () => 0,
  }),
}));

// Der KTX2-Lader braucht eine echte Grafikkarte und Worker; geprüft wird er
// im Browser. Hier bleibt jede Ladung offen.
const freigabeSpion = vi.fn();
vi.mock('./texturen', async (original) => ({
  ...(await original<typeof import('./texturen')>()),
  erzeugeKtx2Lader: () => ({ lade: () => new Promise(() => {}), freigeben: freigabeSpion }),
}));

// Die Ringe laden ihre Textur weiterhin beim Aufbau über THREE.TextureLoader
// (siehe rings.ts), was in der Node-Testumgebung (kein document) fehlschlagen
// würde — hier interessiert nur die Bahnlinien-Verdrahtung, daher ein leerer
// Ersatz.
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
const labelsUpdateSpion = vi.fn();
let testScheiben: import('./treffer').Scheibe[] = [];
vi.mock('./labels', () => ({
  createLabelOverlay: () => ({
    update: labelsUpdateSpion,
    dispose: vi.fn(),
    namensRechtecke: () => [],
    trefferScheiben: () => testScheiben,
  }),
}));

const updateSpion = vi.fn();
/**
 * Bahnlinien, wie sie die reale orbits.ts in `lines` hielte (Entwurf
 * Klickflächen §4.4: kandidaten() liest Sichtbarkeit und Puffer daraus).
 * Je Test befüllt, sonst leer — der Mock liest testLinien bei jedem
 * buildScene()-Aufruf frisch.
 */
let testLinien = new Map<string, THREE.Line>();
vi.mock('./orbits', () => ({
  createOrbitLines: () => ({ update: updateSpion, lines: testLinien }),
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
    renderer: {
      getPixelRatio: () => 1, capabilities: { maxTextureSize: 16384 },
    } as unknown as THREE.WebGLRenderer,
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
      2451545.0 + 49, DEFAULT_STATE.scale, null,
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
    // Blick zur Seite: Die Drehung ist deutlich, eine veraltete Blickmatrix fiele auf.
    expect(Math.abs(ctx.camera.quaternion.w)).toBeLessThan(0.99);
    const erwartet = new THREE.Matrix4().makeRotationFromQuaternion(ctx.camera.quaternion).invert();
    erwartet.elements.forEach((wert, i) => {
      expect(ctx.camera.matrixWorldInverse.elements[i]).toBeCloseTo(wert, 9);
    });
  });
});

describe('buildScene — Zeiger und Treffer', () => {
  const mars = { id: 'mars', x: 10, y: 10, radiusPx: 5, tiefe: 0.5, istMond: false, glyphe: false };

  it('reicht den Körper unter dem Zeiger ab dem nächsten Bild an Overlay und Bahnen', () => {
    testScheiben = [mars];
    const szene = buildScene(fakeContext(), fakeOverlay, (k) => k);
    szene.setZeiger({ x: 11, y: 10, art: 'maus' });
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(szene.hervorgehoben()).toBe('mars');
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(updateSpion.mock.lastCall?.[5]).toBe('mars');
    expect(labelsUpdateSpion.mock.lastCall?.[5]).toBe('mars');
    szene.setZeiger(null);
    expect(szene.hervorgehoben()).toBeNull();
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(labelsUpdateSpion.mock.lastCall?.[5]).toBeNull();
    testScheiben = [];
  });

  it('prüft trefferBei gegen die Kandidaten des letzten Bildes', () => {
    testScheiben = [mars];
    const szene = buildScene(fakeContext(), fakeOverlay, (k) => k);
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(szene.trefferBei(11, 10, 'maus')).toBe('mars');
    expect(szene.trefferBei(40, 10, 'maus')).toBeNull();
    expect(szene.trefferBei(30, 10, 'finger')).toBe('mars');
    testScheiben = [];
  });

  it('behandelt Bahnlinien als Kandidaten: nur sichtbare treffen (Entwurf §4.4)', () => {
    const ctx = fakeContext();
    const echoOverlay = { clientWidth: 800, clientHeight: 600 } as HTMLElement;

    const geoNeptun = new THREE.BufferGeometry();
    geoNeptun.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const neptunLinie = new THREE.Line(geoNeptun);
    const geoPluto = new THREE.BufferGeometry();
    geoPluto.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const plutoLinie = new THREE.Line(geoPluto);
    neptunLinie.visible = true;
    plutoLinie.visible = false;
    testLinien = new Map([['neptune', neptunLinie], ['pluto', plutoLinie]]);

    const szene = buildScene(ctx, echoOverlay, (k) => k);
    // Große Zeitschritte wie im Blickmatrix-Test oben: Die Kamera schwingt
    // auf ihr Ziel ein, damit die folgenden kleinen Schritte sie kaum noch
    // bewegen — die Bildstelle unten bleibt über alle update()-Aufrufe gültig.
    szene.update(2451545.0, 5, DEFAULT_STATE);
    szene.update(2451545.0, 5, DEFAULT_STATE);

    // Zwei Punkte entlang der tatsächlichen Blickrichtung: Sie landen für
    // jede Kameraausrichtung in der Bildmitte — die Kameraausrichtung des
    // Tests spielt damit keine Rolle.
    const richtung = new THREE.Vector3();
    ctx.camera.getWorldDirection(richtung);
    const a = richtung.clone().multiplyScalar(100);
    const b = richtung.clone().multiplyScalar(150);
    for (const geo of [geoNeptun, geoPluto]) {
      const attr = geo.getAttribute('position') as THREE.BufferAttribute;
      attr.setXYZ(0, a.x, a.y, a.z);
      attr.setXYZ(1, b.x, b.y, b.z);
      attr.needsUpdate = true;
    }

    // Bildstelle mit denselben Matrizen und derselben Projektion wie
    // kandidaten() in scene.ts berechnen (Segmentmittelpunkt).
    const blick = new THREE.Matrix4()
      .multiplyMatrices(ctx.camera.projectionMatrix, ctx.camera.matrixWorldInverse);
    const punkte = new Float64Array(4);
    projiziereZug(
      new Float64Array([a.x, a.y, a.z, b.x, b.y, b.z]), 2, blick,
      echoOverlay.clientWidth, echoOverlay.clientHeight, punkte,
    );
    // Kein NaN heißt: vor der Kamera (siehe projiziereZug, w > 0).
    expect(Number.isNaN(punkte[0])).toBe(false);
    expect(Number.isNaN(punkte[1])).toBe(false);
    const x = (punkte[0]! + punkte[2]!) / 2;
    const y = (punkte[1]! + punkte[3]!) / 2;
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(echoOverlay.clientWidth);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(echoOverlay.clientHeight);

    expect(szene.trefferBei(x, y, 'maus')).toBe('neptune');

    neptunLinie.visible = false;
    plutoLinie.visible = true;
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(szene.trefferBei(x, y, 'maus')).toBe('pluto');

    neptunLinie.visible = false;
    plutoLinie.visible = false;
    szene.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(szene.trefferBei(x, y, 'maus')).toBeNull();

    testLinien = new Map();
  });
});

describe('buildScene — Texturstand', () => {
  it('meldet den Texturstand aller Körper mit Stufen, anfangs ohne geladene Stufe', () => {
    const handle = buildScene(fakeContext(), fakeOverlay, (k) => k);
    const stand = handle.texturStand();
    expect(Object.keys(stand)).toHaveLength(29);
    expect(Object.values(stand).every((b) => b === 0)).toBe(true);
  });

  it('gibt beim Abbau den Texturlader frei', () => {
    freigabeSpion.mockClear();
    const handle = buildScene(fakeContext(), fakeOverlay, (k) => k);
    handle.dispose();
    expect(freigabeSpion).toHaveBeenCalledOnce();
  });

  it('legt die Himmelskugel an und meldet anfangs keine geladene Himmelsstufe', () => {
    const ctx = fakeContext();
    const handle = buildScene(ctx, fakeOverlay, (k) => k);
    expect(ctx.scene.getObjectByName('milchstrasse')).toBeDefined();
    handle.update(2451545.0, 0.016, DEFAULT_STATE);
    expect(handle.himmelStand()).toBe(0);
    handle.dispose();
    expect(ctx.scene.getObjectByName('milchstrasse')).toBeUndefined();
  });
});
