import * as THREE from 'three';

export interface RenderContext {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  resize: () => void;
  dispose: () => void;
}

export function createRenderer(canvas: HTMLCanvasElement): RenderContext {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    // Ohne diesen Puffer flimmern Objekte, die Größenordnungen
    // auseinanderliegen, gegeneinander.
    logarithmicDepthBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();

  // Die Kamera sitzt konstruktionsbedingt immer im Ursprung; bewegt wird
  // die Welt um sie herum (siehe worldToRender).
  const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1e12);
  camera.position.set(0, 0, 0);
  camera.up.set(0, 0, 1); // Ekliptik-Normale zeigt nach oben

  const resize = (): void => {
    const b = canvas.getBoundingClientRect();
    renderer.setSize(b.width, b.height, false);
    camera.aspect = b.width / Math.max(b.height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  return {
    renderer, camera, scene, resize,
    dispose: () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
