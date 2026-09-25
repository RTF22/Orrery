import * as THREE from 'three';
import { equatorialToEcliptic } from './starfield';
import type { TexturLader } from './texturen';
import type { HimmelStufe } from '../data/milchstrasse';

/**
 * Radius der Himmelskugel: dieselbe Größenordnung wie das Sternfeld
 * (starfield.ts), weit hinter jedem Körper und vor der fernen Ebene der
 * Kamera (1e12, renderer.ts).
 */
export const HIMMEL_RADIUS = 1e9;
/** 256 × 128 Zellen (1,4° je Zelle): die Verzerrung der flachen Dreiecke bleibt unter einem Pixel. */
export const GITTER_SPALTEN = 256;
export const GITTER_ZEILEN = 128;

/**
 * Texturkoordinaten eines Himmelspunkts in der SVS-Karte (Entwurf Phase 6
 * §3.4): RA 0h in der Bildmitte, RA wächst nach links; die KTX2-Stufen sind
 * gespiegelt gespeichert (Zeile 0 = Südrand), v = 0 ist deshalb Dec −90°.
 * Die Naht der Karte liegt bei RA 180° (u = 0 bzw. 1).
 */
export function raDecZuUv(raGrad: number, decGrad: number): { u: number; v: number } {
  const u = ((((180 - raGrad) % 360) + 360) % 360) / 360;
  return { u, v: (decGrad + 90) / 180 };
}

export interface HimmelsGitter {
  positionen: Float32Array;
  uvs: Float32Array;
  indizes: Uint32Array;
}

/**
 * Kugel auf RA/Dec-Linien, Ecken mit derselben Drehung ins Ekliptiksystem wie
 * das Sternfeld (equatorialToEcliptic). Spalte 0 und Spalte `spalten` liegen
 * beide auf RA 180°, mit u = 0 und u = 1: So läuft keine Dreieckskante über
 * die Naht der Karte, und die Mipmaps zeigen dort keinen Strich.
 */
export function himmelsGitter(spalten: number, zeilen: number, radius: number): HimmelsGitter {
  const n = (spalten + 1) * (zeilen + 1);
  const positionen = new Float32Array(n * 3);
  const uvs = new Float32Array(n * 2);
  for (let j = 0; j <= zeilen; j++) {
    const v = j / zeilen;
    const dec = v * 180 - 90;
    for (let i = 0; i <= spalten; i++) {
      const u = i / spalten;
      const p = equatorialToEcliptic(180 - u * 360, dec);
      const k = j * (spalten + 1) + i;
      positionen.set([p.x * radius, p.y * radius, p.z * radius], k * 3);
      uvs.set([u, v], k * 2);
    }
  }
  const indizes = new Uint32Array(spalten * zeilen * 6);
  let m = 0;
  for (let j = 0; j < zeilen; j++) {
    for (let i = 0; i < spalten; i++) {
      const a = j * (spalten + 1) + i;
      const c = a + spalten + 1;
      indizes.set([a, c, a + 1, a + 1, c, c + 1], m);
      m += 6;
    }
  }
  return { positionen, uvs, indizes };
}

/**
 * Nächste anzufordernde Breite oder null: zuerst die kleinste, danach gleich
 * die breiteste bis zur Obergrenze (Entwurf §4.3). Nie herunter — `angefordert`
 * zählt auch gescheiterte Stufen, damit keine Ladeschleife entsteht.
 */
export function naechsteHimmelStufe(
  breiten: readonly number[], angefordert: number, obergrenze: number,
): number | null {
  const kleinste = breiten[0]!;
  if (angefordert === 0) return kleinste;
  const ziel = [...breiten].reverse().find((b) => b <= obergrenze) ?? kleinste;
  return ziel > angefordert ? ziel : null;
}

export interface Milchstrasse {
  /** Je Bild: Kästchen, Obergrenze der Qualitätsstufe, ob die Körpertexturen ruhen. */
  update(an: boolean, obergrenze: number, koerperRuhig: boolean): void;
  /** Geladene Breite, 0 = noch keine (window.himmelStand im DEV-Build). */
  stand(): number;
  dispose(): void;
}

/**
 * Himmelshintergrund (Entwurf Phase 6 §4): deckend und mit renderOrder −1
 * zuerst gezeichnet — three.js zeichnet durchsichtige Objekte wie das
 * Sternfeld nach den deckenden, die Sterne liegen also obenauf. Ohne
 * Tiefentest und ohne Schreiben in den Tiefenpuffer verdeckt die Kugel nichts.
 * Im Bloom-Durchgang schwärzt verdunkleSzeneAusserBloom sie wie jedes deckende
 * Objekt; sie strahlt nicht. Die Helligkeit hängt nicht an Regler und
 * Belichtung; das Tonemapping ist in der Aufbereitung eingerechnet
 * (scripts/milchstrasse.py).
 */
export function createMilchstrasse(
  scene: THREE.Scene, lader: TexturLader, stufen: readonly HimmelStufe[],
): Milchstrasse {
  const g = himmelsGitter(GITTER_SPALTEN, GITTER_ZEILEN, HIMMEL_RADIUS);
  const geometrie = new THREE.BufferGeometry();
  geometrie.setAttribute('position', new THREE.BufferAttribute(g.positionen, 3));
  geometrie.setAttribute('uv', new THREE.BufferAttribute(g.uvs, 2));
  geometrie.setIndex(new THREE.BufferAttribute(g.indizes, 1));
  // DoubleSide: Die Kamera sitzt innen; so hängt nichts an der Umlaufrichtung.
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide, depthTest: false, depthWrite: false,
  });
  const kugel = new THREE.Mesh(geometrie, material);
  kugel.name = 'milchstrasse';
  kugel.renderOrder = -1;
  // Aus demselben Grund wie beim Sternfeld (starfield.ts): Radius 1e9.
  kugel.frustumCulled = false;
  kugel.visible = false;
  scene.add(kugel);

  const breiten = stufen.map((s) => s.breite);
  let geladen = 0;
  let angefordert = 0;
  let laeuft = false;
  let beendet = false;

  return {
    update(an, obergrenze, koerperRuhig) {
      kugel.visible = an && geladen > 0;
      if (!an || beendet || laeuft || !koerperRuhig) return;
      const breite = naechsteHimmelStufe(breiten, angefordert, obergrenze);
      if (breite === null) return;
      const stufe = stufen.find((s) => s.breite === breite)!;
      angefordert = breite;
      laeuft = true;
      lader.lade(stufe.pfad).then(
        (textur) => {
          if (beendet) { textur.dispose(); return; }
          material.map?.dispose();
          material.map = textur;
          material.needsUpdate = true;
          geladen = breite;
        },
        () => { /* wie bei den Körpern: bisherige Stufe bleibt, kein zweiter Versuch */ },
      ).finally(() => { laeuft = false; });
    },
    stand: () => geladen,
    dispose() {
      beendet = true;
      scene.remove(kugel);
      material.map?.dispose();
      material.dispose();
      geometrie.dispose();
    },
  };
}
