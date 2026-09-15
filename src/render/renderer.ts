import * as THREE from 'three';

export interface RenderContext {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  resize: () => void;
  /** Deckel der Qualitätsstufe für die Pixeldichte (siehe app/quality.ts). */
  setPixelRatioCap: (cap: number) => void;
  /**
   * Wird nach jeder Größen- oder Dichteänderung aufgerufen — daran hängen
   * die Ziele des Post-Processings, die dieselbe Auflösung brauchen.
   */
  afterResize: (() => void) | null;
  dispose: () => void;
}

/** Obergrenze, solange keine Qualitätsstufe etwas anderes sagt. */
const STANDARD_DECKEL = 2;

/** Vertikales Sichtfeld der Kamera in Grad (auch für die Draufsicht in ui/kamerafahrt.ts). */
export const KAMERA_FOV_GRAD = 50;

/**
 * Die tatsächlich genutzte Pixeldichte. Sie folgt dem Gerät, bleibt aber
 * unter dem Deckel der Qualitätsstufe: Die Füllrate wächst quadratisch mit
 * diesem Faktor.
 */
export function pixelRatioFor(devicePixelRatio: number, cap: number): number {
  if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) return 1;
  return Math.min(devicePixelRatio, cap);
}

/**
 * Meldet, wenn sich die Pixeldichte ändert — etwa weil das Fenster auf
 * einen anderen Monitor gezogen wurde. Ein `resize`-Ereignis gibt es dabei
 * nicht, wenn das Fenster gleich groß bleibt; nur diese Medienabfrage
 * schlägt an. Sie gilt für genau eine Dichte und wird nach jedem Wechsel
 * neu gestellt.
 */
export function watchPixelRatio(onChange: () => void): () => void {
  let abbestellen: (() => void) | null = null;

  const beobachte = (): void => {
    if (typeof matchMedia !== 'function') return;
    const abfrage = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const beiWechsel = (): void => {
      abbestellen?.();
      beobachte();
      onChange();
    };
    abfrage.addEventListener('change', beiWechsel);
    abbestellen = () => { abfrage.removeEventListener('change', beiWechsel); };
  };

  beobachte();
  return () => { abbestellen?.(); abbestellen = null; };
}

export function createRenderer(canvas: HTMLCanvasElement): RenderContext {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    // Ohne diesen Puffer flimmern Objekte, die Größenordnungen
    // auseinanderliegen, gegeneinander.
    logarithmicDepthBuffer: true,
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();

  // Die Kamera sitzt konstruktionsbedingt immer im Ursprung; bewegt wird
  // die Welt um sie herum (siehe worldToRender).
  const camera = new THREE.PerspectiveCamera(KAMERA_FOV_GRAD, 1, 0.001, 1e12);
  camera.position.set(0, 0, 0);
  camera.up.set(0, 0, 1); // Ekliptik-Normale zeigt nach oben

  let deckel = STANDARD_DECKEL;

  const kontext: RenderContext = {
    renderer, camera, scene,
    afterResize: null,
    resize: () => { /* unten ersetzt */ },
    setPixelRatioCap: () => { /* unten ersetzt */ },
    dispose: () => { /* unten ersetzt */ },
  };

  const resize = (): void => {
    const b = canvas.getBoundingClientRect();
    // Die Pixeldichte wird bei jeder Größenänderung neu gelesen: Wandert
    // das Fenster auf einen Monitor mit anderer Dichte, bliebe der Puffer
    // sonst bei der alten Auflösung — sichtbar unscharf oder unnötig teuer.
    renderer.setPixelRatio(pixelRatioFor(window.devicePixelRatio, deckel));
    renderer.setSize(b.width, b.height, false);
    camera.aspect = b.width / Math.max(b.height, 1);
    camera.updateProjectionMatrix();
    kontext.afterResize?.();
  };

  kontext.resize = resize;
  kontext.setPixelRatioCap = (cap: number) => {
    deckel = cap;
    resize();
  };

  resize();
  window.addEventListener('resize', resize);
  const stopDichte = watchPixelRatio(resize);

  kontext.dispose = () => {
    window.removeEventListener('resize', resize);
    stopDichte();
    kontext.afterResize = null;
    renderer.dispose();
  };

  return kontext;
}
