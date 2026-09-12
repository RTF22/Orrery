import * as THREE from 'three';
import type { Body, Vec3 } from '../sim/types';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt, scaledRadius } from '../sim/scale';
import { rotationAt } from '../sim/orbit';
import { poleVector } from '../sim/frames';
import { bodies, bodyIndex } from '../data/index';
import { kmToUnits, worldToRender } from './units';
import { BLOOM_LAYER } from './postfx';
import { bodyLighting } from './lighting';
import type { LightingSettings } from './lighting';

/** Untergrenze, damit Geometrie nie auf null kollabiert. */
export const MIN_RADIUS_UNITS = 1e-4;

export function pickRadiusUnits(body: Body, s: ScaleSettings): number {
  return Math.max(kmToUnits(scaledRadius(body, s)), MIN_RADIUS_UNITS);
}

/**
 * Quaternion, das die lokale y-Achse der Kugelgeometrie (dort liegen ihre
 * Pole) auf die Polrichtung dreht. Ersetzt die frühere Kippung um die
 * x-Achse, die zwar den Betrag der Achsneigung traf, aber eine willkürliche
 * Richtung wählte — mit Ringen und Monden in derselben Ebene fällt das auf.
 */
export function poleAusrichtung(pole: Vec3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(pole.x, pole.y, pole.z).normalize(),
  );
}

export interface BodyViews {
  update(
    jd: number,
    s: ScaleSettings,
    cameraKm: THREE.Vector3,
    visible: Record<string, boolean>,
    licht: LightingSettings,
  ): void;
  meshes: Map<string, THREE.Mesh>;
}

type KoerperMaterial = THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;

/**
 * Ein Körper mitsamt der Farbe, die seine Beleuchtung skaliert.
 *
 * `basisFarbe` ist die Ausgangsfarbe **vor** der Verstärkung aus
 * lighting.ts: solange keine Textur geladen ist die Ausweichfarbe des
 * Körpers, danach Weiß. Ohne diesen Wechsel würde Three die Albedo-Textur
 * mit der Ausweichfarbe multiplizieren — bei der Erde `#2a6fdb`, linear
 * also (0,02 | 0,16 | 0,71): Der Rotkanal der Textur fiele auf zwei
 * Prozent, und der Planet wäre selbst auf der Tagseite fast schwarz.
 */
interface KoerperEintrag {
  material: KoerperMaterial;
  basisFarbe: THREE.Color;
}

/**
 * Lädt die Albedo-Textur asynchron nach und setzt sie erst bei Erfolg auf
 * das Material. Bis dahin — und bei einem Fehlschlag dauerhaft — bleibt die
 * bereits gesetzte Fallback-Farbe des Körpers sichtbar. Würde man `map`
 * sofort auf das von TextureLoader zurückgegebene (noch leere) Texturobjekt
 * setzen, bliebe die Kugel bis zum Laden schwarz statt in der Fallback-Farbe.
 *
 * Dieselbe Textur dient als `emissiveMap`: Das Fülllicht der Nachtseite
 * zeigt damit die Oberfläche selbst und nicht eine flache Einheitsfarbe.
 */
function ladeAlbedo(lader: THREE.TextureLoader, pfad: string, eintrag: KoerperEintrag): void {
  lader.load(
    pfad,
    (textur) => {
      textur.colorSpace = THREE.SRGBColorSpace;
      const { material } = eintrag;
      material.map = textur;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.emissiveMap = textur;
        material.emissive.setRGB(1, 1, 1);
      }
      eintrag.basisFarbe.setRGB(1, 1, 1);
      material.needsUpdate = true;
    },
    undefined,
    () => { /* Fallback-Farbe bleibt bestehen; kein Log-Spam bei fehlendem Bild. */ },
  );
}

export function createBodyViews(scene: THREE.Scene): BodyViews {
  const lader = new THREE.TextureLoader();
  const meshes = new Map<string, THREE.Mesh>();
  const eintraege = new Map<string, KoerperEintrag>();

  for (const body of bodies) {
    const fallbackFarbe = new THREE.Color(body.appearance.color);

    // Die Sonne leuchtet selbst, alle anderen werden beleuchtet.
    const material: KoerperMaterial = body.kind === 'star'
      ? new THREE.MeshBasicMaterial({ color: fallbackFarbe })
      : new THREE.MeshStandardMaterial({
        color: fallbackFarbe, roughness: 1, metalness: 0,
        // Das Fülllicht der Nachtseite; die Stärke setzt update pro Frame.
        emissive: fallbackFarbe.clone(), emissiveIntensity: 0,
      });
    const eintrag: KoerperEintrag = { material, basisFarbe: fallbackFarbe.clone() };
    eintraege.set(body.id, eintrag);
    ladeAlbedo(lader, body.appearance.textures.albedo, eintrag);

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
    update(jd, s, cameraKm, visible, licht) {
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

        // Beleuchtung pro Körper: Das Punktlicht gilt für alle gemeinsam,
        // der Abstandsausgleich und das Fülllicht der Nachtseite hängen am
        // eigenen Sonnenabstand — siehe lighting.ts. Die Sonne ist
        // selbstleuchtend und bleibt davon unberührt.
        const eintrag = eintraege.get(body.id);
        if (eintrag !== undefined && body.kind !== 'star') {
          const sonnenabstandKm = Math.sqrt(weltKm.x ** 2 + weltKm.y ** 2 + weltKm.z ** 2);
          const l = bodyLighting(sonnenabstandKm, licht);
          eintrag.material.color.copy(eintrag.basisFarbe).multiplyScalar(l.colorGain);
          if (eintrag.material instanceof THREE.MeshStandardMaterial) {
            eintrag.material.emissiveIntensity = l.emissiveIntensity;
          }
        }

        // Ausrichtung: Pol zuerst, dann die Eigenrotation um genau diese Achse.
        const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
        mesh.quaternion.copy(poleAusrichtung(pol));
        mesh.rotateY(rotationAt(body, jd));
      }
    },
  };
}
