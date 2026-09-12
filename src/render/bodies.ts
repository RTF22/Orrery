import * as THREE from 'three';
import type { Body } from '../sim/types';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt, scaledRadius } from '../sim/scale';
import { rotationAt } from '../sim/orbit';
import { bodies, bodyIndex } from '../data/index';
import { kmToUnits, worldToRender } from './units';
import { BLOOM_LAYER } from './postfx';

/** Untergrenze, damit Geometrie nie auf null kollabiert. */
export const MIN_RADIUS_UNITS = 1e-4;

export function pickRadiusUnits(body: Body, s: ScaleSettings): number {
  return Math.max(kmToUnits(scaledRadius(body, s)), MIN_RADIUS_UNITS);
}

export interface BodyViews {
  update(
    jd: number,
    s: ScaleSettings,
    cameraKm: THREE.Vector3,
    visible: Record<string, boolean>,
  ): void;
  meshes: Map<string, THREE.Mesh>;
}

type KoerperMaterial = THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;

/**
 * Lädt die Albedo-Textur asynchron nach und setzt sie erst bei Erfolg auf
 * das Material. Bis dahin — und bei einem Fehlschlag dauerhaft — bleibt die
 * bereits gesetzte Fallback-Farbe des Körpers sichtbar. Würde man `map`
 * sofort auf das von TextureLoader zurückgegebene (noch leere) Texturobjekt
 * setzen, bliebe die Kugel bis zum Laden schwarz statt in der Fallback-Farbe.
 */
function ladeAlbedo(lader: THREE.TextureLoader, pfad: string, material: KoerperMaterial): void {
  lader.load(
    pfad,
    (textur) => {
      textur.colorSpace = THREE.SRGBColorSpace;
      material.map = textur;
      material.needsUpdate = true;
    },
    undefined,
    () => { /* Fallback-Farbe bleibt bestehen; kein Log-Spam bei fehlendem Bild. */ },
  );
}

export function createBodyViews(scene: THREE.Scene): BodyViews {
  const lader = new THREE.TextureLoader();
  const meshes = new Map<string, THREE.Mesh>();

  for (const body of bodies) {
    const fallbackFarbe = new THREE.Color(body.appearance.color);

    // Die Sonne leuchtet selbst, alle anderen werden beleuchtet.
    const material: KoerperMaterial = body.kind === 'star'
      ? new THREE.MeshBasicMaterial({ color: fallbackFarbe })
      : new THREE.MeshStandardMaterial({ color: fallbackFarbe, roughness: 1, metalness: 0 });
    ladeAlbedo(lader, body.appearance.textures.albedo, material);

    // Einheitskugel; die tatsächliche Größe kommt über scale.
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material);
    // Selbstleuchtende Körper zusätzlich auf die Bloom-Ebene: Nur sie
    // bekommen im Post-Processing einen Lichtkranz (siehe postfx.ts).
    if (body.kind === 'star') mesh.layers.enable(BLOOM_LAYER);
    scene.add(mesh);
    meshes.set(body.id, mesh);
  }

  return {
    meshes,
    update(jd, s, cameraKm, visible) {
      for (const body of bodies) {
        const mesh = meshes.get(body.id);
        if (!mesh) continue;
        if (visible[body.id] === false) { mesh.visible = false; continue; }
        mesh.visible = true;

        // THREE.Vector3 erfüllt strukturell das Vec3-Interface der Sim-Schicht.
        const weltKm = scaledPositionAt(body.id, bodyIndex, jd, s);
        const r = worldToRender(weltKm, cameraKm);
        mesh.position.set(r.x, r.y, r.z);

        const radius = pickRadiusUnits(body, s);
        mesh.scale.setScalar(radius);

        // Achsneigung und Eigenrotation: Pol zunächst auf die Ekliptik-Normale
        // (z-Achse) drehen, dann um die Achsneigung und die Rotationsphase.
        mesh.rotation.set(Math.PI / 2, 0, 0);
        mesh.rotateX((body.physical.axialTiltDeg * Math.PI) / 180);
        mesh.rotateY(rotationAt(body, jd));
      }
    },
  };
}
