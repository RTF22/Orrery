import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { szeneFreigeben } from './freigeben';

describe('szeneFreigeben', () => {
  it('gibt Geometrien, Materialien, Texturen und Lichter frei und leert die Szene', () => {
    const szene = new THREE.Scene();
    const karte = new THREE.Texture();
    const uniformTextur = new THREE.Texture();
    const netz = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial({ map: karte }));
    const punkte = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.ShaderMaterial({ uniforms: { tRing: { value: uniformTextur }, uZahl: { value: 1 } } }),
    );
    const licht = new THREE.PointLight();
    const gruppe = new THREE.Group();
    gruppe.add(punkte);
    szene.add(netz, gruppe, licht);

    const freigegeben = vi.fn();
    type Quelle = { addEventListener(typ: 'dispose', f: () => void): void };
    for (const d of [netz.geometry, netz.material, karte, punkte.geometry, punkte.material, uniformTextur, licht]) {
      (d as unknown as Quelle).addEventListener('dispose', () => freigegeben(d));
    }
    const lichtFrei = vi.spyOn(licht, 'dispose');

    szeneFreigeben(szene);

    expect(freigegeben).toHaveBeenCalledWith(netz.geometry);
    expect(freigegeben).toHaveBeenCalledWith(netz.material);
    expect(freigegeben).toHaveBeenCalledWith(karte);
    expect(freigegeben).toHaveBeenCalledWith(punkte.geometry);
    expect(freigegeben).toHaveBeenCalledWith(punkte.material);
    expect(freigegeben).toHaveBeenCalledWith(uniformTextur);
    expect(lichtFrei).toHaveBeenCalled();
    expect(szene.children).toHaveLength(0);
  });

  it('gibt ein Material, das mehrere Objekte teilen, nur einmal frei', () => {
    const szene = new THREE.Scene();
    const material = new THREE.LineBasicMaterial();
    szene.add(new THREE.Line(new THREE.BufferGeometry(), material), new THREE.Line(new THREE.BufferGeometry(), material));
    const freigegeben = vi.fn();
    material.addEventListener('dispose', freigegeben);
    szeneFreigeben(szene);
    expect(freigegeben).toHaveBeenCalledTimes(1);
  });
});
