import * as THREE from 'three';

/**
 * Blendschein der Sonne in der Himmelsansicht (Entwurf geozentrische Sicht
 * §11.3): Die Scheibe bleibt in wahrer Größe; der Schein bildet nach, was Auge
 * und Kamera um eine sehr helle Quelle sehen. Er hängt an der dargestellten
 * Sonne, liegt in ihrer Tiefe (der Mond verdeckt ihn bei einer Finsternis mit)
 * und schreibt keine Tiefe.
 */

/** Äußerer Radius des Scheins in Grad. */
export const HALO_RADIUS_GRAD = 6;
/** Farbe des Scheins: warmes Weiß. */
const HALO_FARBE = new THREE.Color(1, 0.95, 0.85);
/** Deckkraft im Kern; der Abfall steckt in der Textur. */
const HALO_DECKKRAFT = 0.7;
/** Kernradius des Profils (Bruchteil des Außenradius). */
const HALO_R0 = 0.08;

/** Radiales Profil 1/(1 + (r/r0)²)^1,5 mit weichem Rand bei r = 1. */
function scheinTextur(): THREE.DataTexture {
  const n = 128;
  const daten = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const r = Math.hypot(x + 0.5 - n / 2, y + 0.5 - n / 2) / (n / 2);
      const kern = (1 + (r / HALO_R0) ** 2) ** -1.5;
      const rand = r >= 1 ? 0 : (1 - r) ** 2;
      const i = (y * n + x) * 4;
      daten[i] = 255; daten[i + 1] = 255; daten[i + 2] = 255;
      daten[i + 3] = Math.round(255 * kern * rand);
    }
  }
  const t = new THREE.DataTexture(daten, n, n);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

export function createSonnenschein(scene: THREE.Scene): {
  update(an: boolean, sonne: THREE.Mesh | undefined): void;
} {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: scheinTextur(), color: HALO_FARBE, opacity: HALO_DECKKRAFT, transparent: true,
    depthTest: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  sprite.name = 'sonnenschein';
  sprite.visible = false;
  sprite.frustumCulled = false;
  scene.add(sprite);
  const tanRadius = Math.tan(HALO_RADIUS_GRAD * Math.PI / 180);
  return {
    update(an, sonne) {
      sprite.visible = an && sonne !== undefined && sonne.visible;
      if (!sprite.visible || sonne === undefined) return;
      sprite.position.copy(sonne.position);
      const breite = 2 * tanRadius * sonne.position.length();
      sprite.scale.set(breite, breite, 1);
    },
  };
}
