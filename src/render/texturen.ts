import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

/**
 * Lädt eine Texturstufe. Eigene Schnittstelle, damit Tests ohne Grafikkarte
 * und ohne Netz einen Ersatz einsetzen können.
 */
export interface TexturLader {
  lade(pfad: string): Promise<THREE.Texture>;
}

/**
 * KTX2 (Basis Universal) wird im Worker umgesetzt und bleibt auf der GPU
 * komprimiert (Entwurf Phase 5 §5.2). Die Karten sind beim Kodieren
 * gespiegelt, weil KTX2 kein flipY kennt (scripts/textur-stufe.py).
 */
export function erzeugeKtx2Lader(renderer: THREE.WebGLRenderer): TexturLader {
  const lader = new KTX2Loader()
    .setTranscoderPath(`${import.meta.env.BASE_URL}basis/`)
    .detectSupport(renderer);
  return {
    async lade(pfad) {
      const textur = await lader.loadAsync(pfad);
      textur.colorSpace = THREE.SRGBColorSpace;
      return textur;
    },
  };
}
