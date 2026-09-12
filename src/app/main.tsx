import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { createRenderer } from '../render/renderer';
import { buildScene } from '../render/scene';
import { createPostFx } from '../render/postfx';
import { attachCameraInput } from '../render/camera/input';
import { startLoop } from './loop';
import { useStore } from '../store';
import { App as Bedienoberflaeche } from '../ui/App';
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
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (canvas === null || overlay === null) return;

    const ctx = createRenderer(canvas);
    const szene = buildScene(ctx, overlay);
    const postfx = createPostFx(ctx);
    // Ziehen dreht, Rad und Zwei-Finger-Geste zoomen — geschrieben wird
    // ausschließlich in den Store, gelesen im nächsten Bild vom Controller.
    const stopInput = attachCameraInput(canvas);

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
      stopInput();
      szene.dispose();
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
      <div ref={overlayRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />
      <Bedienoberflaeche />
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
