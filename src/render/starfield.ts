import * as THREE from 'three';
import type { Vec3 } from '../sim/types';
import sterne from '../data/stars/hyg.json';

/** Schiefe der Ekliptik zur Epoche J2000. */
const EPSILON = 23.4392911 * Math.PI / 180;
const GRAD = Math.PI / 180;

export interface StarRecord { ra: number; dec: number; mag: number; ci: number }

/** Dreht einen Himmelspunkt vom Äquator- ins Ekliptiksystem. */
export function equatorialToEcliptic(raDeg: number, decDeg: number): Vec3 {
  const ra = raDeg * GRAD, dec = decDeg * GRAD;
  const x = Math.cos(dec) * Math.cos(ra);
  const yAeq = Math.cos(dec) * Math.sin(ra);
  const zAeq = Math.sin(dec);
  return {
    x,
    y: yAeq * Math.cos(EPSILON) + zAeq * Math.sin(EPSILON),
    z: -yAeq * Math.sin(EPSILON) + zAeq * Math.cos(EPSILON),
  };
}

/** Kleinere Magnitude heißt hellerer Stern — die Skala ist umgekehrt. */
export function magnitudeToSize(mag: number): number {
  return Math.max(0.6, 4.2 - 0.55 * mag);
}

/** Grobe Näherung der Sternfarbe aus dem B-V-Index. */
export function colorIndexToRgb(ci: number): [number, number, number] {
  const t = Math.min(Math.max((ci + 0.4) / 2.4, 0), 1); // 0 = blau, 1 = rot
  return [0.6 + 0.4 * t, 0.75 + 0.1 * t - 0.15 * Math.abs(t - 0.5), 1.0 - 0.45 * t];
}

/**
 * Sterne liegen unendlich weit weg — sie werden deshalb auf eine sehr große
 * Kugel um den Ursprung gelegt und nie kamerarelativ verschoben (siehe
 * worldToRender in units.ts, das hier bewusst nicht zum Einsatz kommt): Die
 * Kamera sitzt konstruktionsbedingt immer im Ursprung (renderer.ts), sodass
 * die Sterne beim Schwenken keine Parallaxe zeigen dürfen, während Körper das
 * sehr wohl tun.
 */
export function createStarfield(scene: THREE.Scene): THREE.Points {
  const liste = sterne as StarRecord[];
  const positionen = new Float32Array(liste.length * 3);
  const farben = new Float32Array(liste.length * 3);
  const groessen = new Float32Array(liste.length);
  const RADIUS = 1e9;

  liste.forEach((stern, i) => {
    const v = equatorialToEcliptic(stern.ra, stern.dec);
    positionen.set([v.x * RADIUS, v.y * RADIUS, v.z * RADIUS], i * 3);
    farben.set(colorIndexToRgb(stern.ci), i * 3);
    groessen[i] = magnitudeToSize(stern.mag);
  });

  const geometrie = new THREE.BufferGeometry();
  geometrie.setAttribute('position', new THREE.BufferAttribute(positionen, 3));
  geometrie.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  geometrie.setAttribute('size', new THREE.BufferAttribute(groessen, 1));

  // Bewusst ShaderMaterial statt PointsMaterial: Letzteres ignoriert ein
  // Attribut `size` pro Stern und zeichnete alle gleich groß — die
  // Helligkeitsstaffelung, an der man Sternbilder erkennt, käme nie auf den
  // Schirm. Das Attribut `color` deklariert three.js bei vertexColors selbst,
  // eine eigene Deklaration im Vertex-Shader würde zum Konflikt führen.
  const punkte = new THREE.Points(geometrie, new THREE.ShaderMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float size;
      varying vec3 vFarbe;
      void main() {
        vFarbe = color;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size;
      }`,
    fragmentShader: `
      varying vec3 vFarbe;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        gl_FragColor = vec4(vFarbe, smoothstep(0.5, 0.15, d));
      }`,
  }));
  // Die Sterne liegen auf einer Kugel mit Radius 1e9 — weit jenseits der
  // Größenordnung, für die three.js' automatische Bounding-Sphere-Kullung
  // (auf Basis von Objektursprung und Kamerafrustum) numerisch verlässlich
  // arbeitet. Aus demselben Grund wie bei den Bahnlinien (orbits.ts) wird die
  // Kullung deshalb hier abgeschaltet, statt fälschlich sichtbare Sterne zu
  // verlieren.
  punkte.frustumCulled = false;
  scene.add(punkte);
  return punkte;
}
