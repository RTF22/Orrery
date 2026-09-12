import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { createRenderer } from '../render/renderer';
import { buildScene } from '../render/scene';
import { createPostFx } from '../render/postfx';
import { startLoop } from './loop';
import { useStore } from '../store';
import type { QualityTier } from '../store/types';

/**
 * Einstiegspunkt der Anwendung.
 *
 * Montiert eine vollflächige Canvas für Three.js sowie ein leeres
 * Overlay-Div, das erst eine spätere Aufgabe mit der Bedienoberfläche
 * füllt. Renderer, Szene und Schleife werden hier verdrahtet. Die Kamera
 * bleibt am Ursprung (siehe renderer.ts) — ihre Blickrichtung setzt die
 * Szene pro Frame aus dem Store, siehe render/scene.ts und render/camera.ts.
 */
function App(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const ctx = createRenderer(canvas);
    const szene = buildScene(ctx);
    const postfx = createPostFx(ctx);

    // Der Renderer hängt selbst am resize-Ereignis und wurde zuerst
    // registriert; die Composer-Ziele folgen daher mit der bereits neuen
    // Canvas-Größe.
    const onResize = (): void => { postfx.resize(); };
    window.addEventListener('resize', onResize);

    let bloomAn: boolean | null = null;
    let stufe: QualityTier | null = null;

    const stopLoop = startLoop((jd, dt) => {
      const state = useStore.getState();
      szene.update(jd, dt, state);

      if (state.display.bloom !== bloomAn || state.quality.tier !== stufe) {
        bloomAn = state.display.bloom;
        stufe = state.quality.tier;
        postfx.setBloom(bloomAn, stufe);
      }
      postfx.render();
    });

    return () => {
      stopLoop();
      window.removeEventListener('resize', onResize);
      postfx.dispose();
      ctx.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />
    </>
  );
}

const wurzelElement = document.getElementById('root');
if (wurzelElement === null) {
  throw new Error('Wurzelelement "#root" wurde nicht gefunden.');
}

createRoot(wurzelElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
