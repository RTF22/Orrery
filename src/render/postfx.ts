import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { RenderContext } from './renderer';
import type { QualityTier } from '../store/types';

/**
 * Nur Objekte auf dieser Ebene strahlen. Ohne die Trennung würde die
 * ganze Szene milchig — genau der Effekt, der billig aussieht.
 */
export const BLOOM_LAYER = 1;

export function bloomStrengthFor(tier: QualityTier): number {
  switch (tier) {
    case 'low': return 0;
    case 'high': return 1.1;
    case 'medium':
    case 'auto':
    default: return 0.7;
  }
}

export interface PostFx {
  render: () => void;
  setBloom: (an: boolean, tier?: QualityTier) => void;
  resize: () => void;
  dispose: () => void;
}

/**
 * Addiert das Streulicht-Bild auf das unbearbeitete Szenenbild. Der
 * zweite Durchgang ist der Preis für die Selektivität: Beide Durchgänge
 * rendern die vollständige Szene, im ersten tragen jedoch alle Objekte
 * außerhalb der Bloom-Ebene ein geschwärztes Ersatzmaterial (siehe
 * verdunkleSzeneAusserBloom unten) — nur die Sonne bleibt darin sichtbar,
 * alles andere liefert lediglich seinen Tiefenwert.
 */
const KOMBINIER_SHADER = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    tBloom: { value: null as THREE.Texture | null },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tBloom;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(tDiffuse, vUv) + texture2D(tBloom, vUv);
    }
  `,
};

/**
 * Ebenenmaske für den Bloom-Durchgang: Ein Objekt gilt als „strahlend" (und
 * bleibt beim Schwärzen unangetastet), wenn mindestens eines seiner Bits mit
 * dieser Maske überlappt — siehe BLOOM_LAYER und mesh.layers.enable() in
 * bodies.ts.
 */
const bloomEbenenMaske = new THREE.Layers();
bloomEbenenMaske.set(BLOOM_LAYER);

/**
 * Gemeinsames Ersatzmaterial für alle undurchsichtigen Nicht-Bloom-Objekte.
 * Undurchsichtig deckt vollständig — genau das braucht ein Planet, der die
 * Sonne im Tiefenpuffer korrekt verdecken soll (siehe verdunkleSzeneAusserBloom).
 */
const schwarzMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

export type MaterialSicherung = Map<THREE.Object3D, THREE.Material | THREE.Material[]>;

/**
 * Ersetzt vor dem Bloom-Durchgang jedes Material außerhalb der Bloom-Ebene
 * durch Schwarz und merkt sich das Original in `ersetzteMaterialien`, damit
 * stelleSzeneWieder() es exakt zurücktauschen kann — eine Map statt einer
 * gepflegten Liste bekannter Körper, damit ein neues Szenenobjekt (Ring,
 * Bahnlinie, künftiger Zusatz) nie vergessen wird.
 *
 * Durchsichtige Objekte (Ringe mit ihrem Alphakanal aus der Ringtextur,
 * Bahnlinien mit fester Deckkraft 0,45, das Sternenfeld mit weichen
 * Punktkreisen) werden bewusst NICHT geschwärzt, sondern für den Durchgang
 * ausgeblendet: Ein deckend schwarzes Ersatzmaterial hätte eine feste
 * Deckkraft und würde ihre echte — bei den Ringen sogar pixelgenau aus der
 * Textur stammende — Teildurchlässigkeit durch eine harte Kante ersetzen und
 * die Sonne dort vollständig verdecken, wo in Wirklichkeit nur ein Teil ihres
 * Lichts zurückgehalten wird. Sie würden zudem, ließe man ihr echtes Material
 * stehen, mit eigener Farbe in den Bloom-Quellframe geraten und selbst einen
 * Lichtkranz bekommen — genau der „milchige" Effekt, vor dem der Kommentar an
 * BLOOM_LAYER warnt. Ausblenden vermeidet beides und entspricht exakt dem
 * bisherigen Verhalten: Der Bloom-Durchgang hat sie schon vor dieser
 * Korrektur nie gezeigt, weil die Kamera zuvor ausschließlich die Bloom-Ebene
 * sah — keine Verschlechterung, nur (noch) keine anteilige Verdunkelung der
 * Sonne durch einen davorstehenden Ring.
 */
export function verdunkleSzeneAusserBloom(
  szene: THREE.Scene,
  ersetzteMaterialien: MaterialSicherung,
  ausgeblendeteObjekte: THREE.Object3D[],
): void {
  szene.traverse((obj) => {
    if (obj.layers.test(bloomEbenenMaske)) return; // strahlt selbst — unangetastet lassen

    const material = (obj as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (material === undefined) return; // Gruppen, Lichter, Kamera: kein Material zu tauschen

    const transparent = Array.isArray(material)
      ? material.some((m) => m.transparent)
      : material.transparent;
    if (transparent) {
      // Nur merken, was WIR sichtbar vorgefunden haben — ein Körper, den
      // state.visible bereits ausgeblendet hat, muss danach ausgeblendet
      // bleiben statt fälschlich wieder aufzutauchen.
      if (obj.visible) { ausgeblendeteObjekte.push(obj); obj.visible = false; }
      return;
    }

    ersetzteMaterialien.set(obj, material);
    (obj as THREE.Mesh).material = schwarzMaterial;
  });
}

/** Kehrt verdunkleSzeneAusserBloom() vollständig um — Kern der Fehlerklasse „ein Objekt bleibt nach einem Frame schwarz", siehe postfx.test.ts. */
export function stelleSzeneWieder(
  ersetzteMaterialien: MaterialSicherung,
  ausgeblendeteObjekte: THREE.Object3D[],
): void {
  for (const [obj, material] of ersetzteMaterialien) {
    (obj as THREE.Mesh).material = material;
  }
  ersetzteMaterialien.clear();
  for (const obj of ausgeblendeteObjekte) obj.visible = true;
  ausgeblendeteObjekte.length = 0;
}

export function createPostFx(ctx: RenderContext): PostFx {
  const groesse = new THREE.Vector2();
  ctx.renderer.getSize(groesse);

  // Beide Durchgänge sehen die vollständige Szene (siehe
  // verdunkleSzeneAusserBloom) — die camera.layers-Maske filtert hier nichts
  // mehr; sie bleibt auf ihrer Standardmaske (Ebene 0), auf der ohnehin jedes
  // Objekt liegt, die Sonne zusätzlich auf Ebene 1 (siehe BLOOM_LAYER).
  const bloomComposer = new EffectComposer(ctx.renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(new RenderPass(ctx.scene, ctx.camera));
  // Schwellwert 0: Die Auswahl trifft bereits die Schwärzung in
  // verdunkleSzeneAusserBloom, nicht die Helligkeit — ein Schwellwert würde
  // hier nur die Sonne selbst beschneiden.
  const bloom = new UnrealBloomPass(groesse.clone(), bloomStrengthFor('medium'), 0.6, 0);
  bloomComposer.addPass(bloom);

  // Zweiter Durchgang: die vollständige Szene plus das Streulicht von oben.
  const kombinieren = new ShaderPass(KOMBINIER_SHADER, 'tDiffuse');
  // ShaderPass klont die Uniform-Definition, deshalb wird die Referenz erst
  // nach dem Bau geholt — und einmal geprüft statt bei jedem Zugriff.
  const tBloom = kombinieren.uniforms['tBloom'] as { value: THREE.Texture | null } | undefined;
  if (tBloom === undefined) throw new Error('Uniform "tBloom" fehlt im Kombinier-Shader.');
  tBloom.value = bloomComposer.renderTarget2.texture;

  const finalComposer = new EffectComposer(ctx.renderer);
  finalComposer.addPass(new RenderPass(ctx.scene, ctx.camera));
  finalComposer.addPass(kombinieren);
  // Zwischenziele sind linear; Tonemapping und sRGB-Ausgabe gehören deshalb
  // ans Ende der Kette und nicht in den Renderer-Durchgang.
  finalComposer.addPass(new OutputPass());

  let an = true;
  let stufe: QualityTier = 'medium';

  const bloomAktiv = (): boolean => an && bloomStrengthFor(stufe) > 0;

  // Über die Frames hinweg wiederverwendet statt pro Bild neu angelegt —
  // Map.clear()/Array.length = 0 unten halten sie leer, ohne dass jedes Bild
  // eine neue Map bzw. ein neues Array zuteilen muss.
  const ersetzteMaterialien: MaterialSicherung = new Map();
  const ausgeblendeteObjekte: THREE.Object3D[] = [];

  return {
    render: () => {
      if (bloomAktiv()) {
        // Volle Szene statt nur der Bloom-Ebene: Ohne die Schwärzung wären
        // Planeten in diesem Durchgang unsichtbar und könnten die Sonne im
        // Tiefenpuffer nicht verdecken — das war der ursprüngliche Fehler
        // (die Sonne schien durch jeden davorstehenden Körper hindurch).
        verdunkleSzeneAusserBloom(ctx.scene, ersetzteMaterialien, ausgeblendeteObjekte);
        bloomComposer.render();
        stelleSzeneWieder(ersetzteMaterialien, ausgeblendeteObjekte);
      }
      tBloom.value = bloomAktiv() ? bloomComposer.renderTarget2.texture : null;
      finalComposer.render();
    },
    setBloom: (neuAn: boolean, tier: QualityTier = 'medium') => {
      an = neuAn;
      stufe = tier;
      bloom.strength = bloomStrengthFor(tier);
      bloom.enabled = bloomAktiv();
    },
    resize: () => {
      ctx.renderer.getSize(groesse);
      bloomComposer.setSize(groesse.x, groesse.y);
      finalComposer.setSize(groesse.x, groesse.y);
      tBloom.value = bloomComposer.renderTarget2.texture;
    },
    dispose: () => {
      bloomComposer.dispose();
      finalComposer.dispose();
    },
  };
}
