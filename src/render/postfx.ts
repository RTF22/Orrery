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
 * zweite Durchgang ist der Preis für die Selektivität: Der erste rendert
 * ausschließlich die Bloom-Ebene, der zweite die vollständige Szene.
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

export function createPostFx(ctx: RenderContext): PostFx {
  const groesse = new THREE.Vector2();
  ctx.renderer.getSize(groesse);

  // Erster Durchgang: nur die Bloom-Ebene, alles andere bleibt schwarz.
  const bloomComposer = new EffectComposer(ctx.renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(new RenderPass(ctx.scene, ctx.camera));
  // Schwellwert 0: Die Auswahl trifft bereits die Ebenenmaske, nicht die
  // Helligkeit — ein Schwellwert würde hier nur die Sonne selbst beschneiden.
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

  return {
    render: () => {
      if (bloomAktiv()) {
        // Maske umschalten statt Materialien zu tauschen: Die Kamera sieht
        // im ersten Durchgang ausschließlich die Bloom-Ebene.
        ctx.camera.layers.set(BLOOM_LAYER);
        bloomComposer.render();
        ctx.camera.layers.enableAll();
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
