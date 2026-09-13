// @vitest-environment jsdom
// createBodyViews legt beim Aufbau Texturen über THREE.TextureLoader an, das
// dafür ein document braucht. In jsdom werden die Bilder nie geladen (kein
// Netzwerk), die Erfolgs-Rückrufe laufen also nie — genau richtig: Geprüft
// werden Material, Shader-Einbau und Uniforms, nicht das Nachladen.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { pickRadiusUnits, MIN_RADIUS_UNITS, poleAusrichtung, createBodyViews } from './bodies';
import { getBody } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { kmToUnits } from './units';
import { poleVector } from '../sim/frames';
import type { LightingSettings } from './lighting';
import { J2000 } from '../sim/time';

describe('pickRadiusUnits', () => {
  it('rechnet den skalierten Radius in Render-Einheiten um', () => {
    const s = SCALE_PRESETS.realistisch;
    expect(pickRadiusUnits(getBody('earth'), s)).toBeCloseTo(kmToUnits(6371), 6);
  });

  it('wächst mit sizeScale', () => {
    const klein = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.realistisch);
    const gross = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.kompakt);
    expect(gross).toBeGreaterThan(klein);
  });

  it('fällt nie unter die Mindestgröße', () => {
    // Sonst verschwände ein Körper bei winzigem sizeScale völlig aus der Geometrie.
    const winzig = { sizeScale: 1e-6, distanceExponent: 1, sunDamping: 1 };
    expect(pickRadiusUnits(getBody('moon'), winzig)).toBeGreaterThanOrEqual(MIN_RADIUS_UNITS);
  });

  it('hält die Sonne größer als jeden Planeten', () => {
    for (const s of Object.values(SCALE_PRESETS)) {
      expect(pickRadiusUnits(getBody('sun'), s))
        .toBeGreaterThan(pickRadiusUnits(getBody('jupiter'), s));
    }
  });
});

describe('poleAusrichtung', () => {
  it('richtet die lokale y-Achse der Kugel auf den Pol aus', () => {
    // Die SphereGeometry von Three hat ihre Pole auf der lokalen y-Achse.
    // Nach der Ausrichtung muss diese Achse in Weltkoordinaten genau in die
    // Polrichtung zeigen — sonst stehen Ringe und Mondbahnen schief zur Kugel.
    const pol = poleVector(40.589, 83.537);
    const q = poleAusrichtung(pol);
    const achse = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(achse.x).toBeCloseTo(pol.x, 10);
    expect(achse.y).toBeCloseTo(pol.y, 10);
    expect(achse.z).toBeCloseTo(pol.z, 10);
  });

  it('stellt die Kugel bei Pol = Ekliptiknormale aufrecht', () => {
    const q = poleAusrichtung({ x: 0, y: 0, z: 1 });
    const achse = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(achse.z).toBeCloseTo(1, 10);
  });
});

/**
 * Der Uniform-Satz, den bodies.ts per onBeforeCompile in das Standardmaterial
 * einhängt. Object.assign kopiert die Uniform-Objekte als Referenz — was hier
 * zurückkommt, sind also genau die Objekte, die update() pro Bild beschreibt.
 */
function schattenEinbau(material: THREE.MeshStandardMaterial): {
  uniforms: Record<string, THREE.IUniform>;
  vertexShader: string;
  fragmentShader: string;
} {
  const shader = {
    uniforms: {} as Record<string, THREE.IUniform>,
    vertexShader: THREE.ShaderLib.standard!.vertexShader,
    fragmentShader: THREE.ShaderLib.standard!.fragmentShader,
  };
  material.onBeforeCompile(
    shader as unknown as THREE.WebGLProgramParametersWithUniforms, {} as THREE.WebGLRenderer,
  );
  return shader;
}

function standardMaterial(views: ReturnType<typeof createBodyViews>, id: string): THREE.MeshStandardMaterial {
  const material = views.meshes.get(id)!.material as THREE.MeshStandardMaterial;
  expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
  return material;
}

const LICHT: LightingSettings = {
  brightness: 1, lightFalloff: 2, nightFill: 0.25, lightCompensation: 0.7,
};

describe('createBodyViews — Schattenbaustein im Standardmaterial', () => {
  it('hängt Rechnung und Anwendung hinter lights_fragment_end in den Fragment-Shader', () => {
    const shader = schattenEinbau(standardMaterial(createBodyViews(new THREE.Scene()), 'earth'));
    expect(shader.fragmentShader).toContain('float sonnenAnteil(');
    expect(shader.fragmentShader).toContain('reflectedLight.directDiffuse *= schattenFaktor');
    expect(shader.fragmentShader).toContain('totalEmissiveRadiance *= fuellFarbe');
    // Der Baustein rechnet auf reflectedLight und totalEmissiveRadiance, die
    // erst nach dem Lichtblock ihren Endwert tragen — steht er davor, wird er
    // von den Licht-Bausteinen wieder überschrieben.
    expect(shader.fragmentShader.indexOf('reflectedLight.directDiffuse *= schattenFaktor'))
      .toBeGreaterThan(shader.fragmentShader.indexOf('#include <lights_fragment_end>'));
  });

  it('reicht die Weltposition des Fragments aus dem Vertex-Shader durch', () => {
    const shader = schattenEinbau(standardMaterial(createBodyViews(new THREE.Scene()), 'earth'));
    expect(shader.vertexShader).toContain('vSchattenPos = ');
    // `transformed` entsteht erst in den Bausteinen vor project_vertex.
    expect(shader.vertexShader.indexOf('vSchattenPos = '))
      .toBeGreaterThan(shader.vertexShader.indexOf('#include <project_vertex>'));
  });

  it('legt die Schatten-Uniforms an', () => {
    const { uniforms } = schattenEinbau(standardMaterial(createBodyViews(new THREE.Scene()), 'earth'));
    const okkluder = uniforms['uOkkluder']!.value as THREE.Vector4[];
    expect(okkluder).toHaveLength(4);
    for (const eintrag of okkluder) expect(eintrag).toBeInstanceOf(THREE.Vector4);
    expect(uniforms['uOkkluderAnzahl']!.value).toBe(0);
    expect(uniforms['uSonnenRichtung']!.value).toBeInstanceOf(THREE.Vector3);
    expect(uniforms['tRingSchatten']!.value).toBeInstanceOf(THREE.Texture);
  });

  it('lässt die Sonne ohne Schattenbaustein', () => {
    const views = createBodyViews(new THREE.Scene());
    expect(views.meshes.get('sun')!.material).toBeInstanceOf(THREE.MeshBasicMaterial);
  });
});

describe('createBodyViews.update — Okkluder je Bild', () => {
  it('setzt dem Mond die Erde als Okkluder', () => {
    const views = createBodyViews(new THREE.Scene());
    const { uniforms } = schattenEinbau(standardMaterial(views, 'moon'));
    views.update(J2000, SCALE_PRESETS.schaubild, new THREE.Vector3(0, 0, 0), {}, LICHT, true);
    expect(uniforms['uOkkluderAnzahl']!.value).toBeGreaterThanOrEqual(1);
    // w ist der dargestellte Radius des Okkluders in Render-Einheiten.
    expect((uniforms['uOkkluder']!.value as THREE.Vector4[])[0]!.w).toBeGreaterThan(0);
    const richtung = uniforms['uSonnenRichtung']!.value as THREE.Vector3;
    expect(richtung.length()).toBeCloseTo(1, 10);
    expect(uniforms['uSonnenWinkel']!.value).toBeGreaterThan(0);
  });

  it('schaltet bei ausgeschaltetem Schatten alle Okkluder ab', () => {
    const views = createBodyViews(new THREE.Scene());
    const { uniforms } = schattenEinbau(standardMaterial(views, 'moon'));
    views.update(J2000, SCALE_PRESETS.schaubild, new THREE.Vector3(0, 0, 0), {}, LICHT, true);
    views.update(J2000, SCALE_PRESETS.schaubild, new THREE.Vector3(0, 0, 0), {}, LICHT, false);
    expect(uniforms['uOkkluderAnzahl']!.value).toBe(0);
    expect(uniforms['uRingAktiv']!.value).toBe(0);
  });

  it('gibt dem Saturnmond Titan den Ring des Mutterplaneten', () => {
    const views = createBodyViews(new THREE.Scene());
    const { uniforms } = schattenEinbau(standardMaterial(views, 'titan'));
    views.update(J2000, SCALE_PRESETS.schaubild, new THREE.Vector3(0, 0, 0), {}, LICHT, true);
    expect(uniforms['uRingAktiv']!.value).toBe(1);
    // uRingEbeneA: Mitte (xyz) und Innenradius (w), uRingEbeneB: Normale und Außenradius.
    const a = uniforms['uRingEbeneA']!.value as THREE.Vector4;
    const b = uniforms['uRingEbeneB']!.value as THREE.Vector4;
    expect(b.w).toBeGreaterThan(a.w);
    expect(new THREE.Vector3(b.x, b.y, b.z).length()).toBeCloseTo(1, 10);
  });

  it('lässt einen Körper ohne Monde ohne Okkluder', () => {
    const views = createBodyViews(new THREE.Scene());
    const { uniforms } = schattenEinbau(standardMaterial(views, 'venus'));
    views.update(J2000, SCALE_PRESETS.schaubild, new THREE.Vector3(0, 0, 0), {}, LICHT, true);
    expect(uniforms['uOkkluderAnzahl']!.value).toBe(0);
    expect(uniforms['uRingAktiv']!.value).toBe(0);
  });
});
