import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createSonnenschein, HALO_RADIUS_GRAD } from './sonnenschein';

describe('createSonnenschein', () => {
  const sonneBei = (abstand: number) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial());
    m.position.set(0, 0, -abstand);
    m.visible = true;
    return m;
  };

  it('legt einen Schein von HALO_RADIUS_GRAD um die Sonne, mit Tiefentest und ohne Tiefenschreiben', () => {
    const szene = new THREE.Scene();
    const schein = createSonnenschein(szene);
    schein.update(true, sonneBei(149597.87));
    const s = szene.getObjectByName('sonnenschein') as THREE.Sprite;
    expect(s.visible).toBe(true);
    expect(s.position.z).toBeCloseTo(-149597.87, 3);
    const halbeBreiteGrad = Math.atan(s.scale.x / 2 / 149597.87) * 180 / Math.PI;
    expect(halbeBreiteGrad).toBeCloseTo(HALO_RADIUS_GRAD, 3);
    const mat = s.material as THREE.SpriteMaterial;
    expect(mat.depthTest).toBe(true);
    expect(mat.depthWrite).toBe(false);
    expect(mat.blending).toBe(THREE.AdditiveBlending);
  });

  it('ist aus außerhalb des Himmels und bei ausgeblendeter Sonne', () => {
    const szene = new THREE.Scene();
    const schein = createSonnenschein(szene);
    schein.update(false, sonneBei(1e5));
    expect(szene.getObjectByName('sonnenschein')!.visible).toBe(false);
    const aus = sonneBei(1e5);
    aus.visible = false;
    schein.update(true, aus);
    expect(szene.getObjectByName('sonnenschein')!.visible).toBe(false);
    schein.update(true, undefined);
    expect(szene.getObjectByName('sonnenschein')!.visible).toBe(false);
  });
});
