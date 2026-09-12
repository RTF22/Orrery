import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { createRenderer } from '../render/renderer';
import { buildScene } from '../render/scene';
import { createPostFx } from '../render/postfx';
import { attachCameraInput } from '../render/camera/input';
import { startLoop } from './loop';
import { tickCinema } from './cinema';
import { useStore } from '../store';
import { App as Bedienoberflaeche } from '../ui/App';
import type { QualityTier } from '../store/types';
import { QUALITY_SETTINGS } from './quality';

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
    // Nur zur Messung im Entwicklungslauf: Über window.renderer lassen sich
    // Geometrie- und Texturzahlen im Dauerlauf ablesen. Im Build fällt der
    // Zweig weg, weil import.meta.env.DEV dort konstant false ist.
    if (import.meta.env.DEV) {
      const w = window as unknown as { renderer: unknown; store: unknown; scene: unknown };
      w.renderer = ctx.renderer;
      // Und die Szene selbst: Damit lassen sich Material-Uniforms (etwa
      // uTag eines Rings) im laufenden Bild ablesen, statt sie nachzurechnen.
      w.scene = ctx.scene;
      // Ebenfalls nur zur Messung: Über window.store lässt sich jeder
      // Blickwinkel ohne Klickweg einstellen — etwa die Nachtseite eines
      // Planeten für die Prüfung der Beleuchtung.
      w.store = useStore;
    }
    const szene = buildScene(ctx, overlay);
    const postfx = createPostFx(ctx);
    // Ziehen dreht, Rad und Zwei-Finger-Geste zoomen — geschrieben wird
    // ausschließlich in den Store, gelesen im nächsten Bild vom Controller.
    const stopInput = attachCameraInput(canvas);

    // Der Renderer meldet jede Größen- und Pixeldichteänderung; die
    // Composer-Ziele hängen sich hier an, damit sie nie hinterherhinken.
    ctx.afterResize = () => { postfx.resize(); };

    let bloomAn: boolean | null = null;
    let stufe: QualityTier | null = null;

    const stopLoop = startLoop((jd, dt) => {
      // Vor dem Lesen des Zustands: Szene und Kamera sollen im selben Bild
      // denselben Stand sehen.
      tickCinema(dt);
      const state = useStore.getState();
      szene.update(jd, dt, state);

      if (state.display.bloom !== bloomAn || state.quality.tier !== stufe) {
        bloomAn = state.display.bloom;
        stufe = state.quality.tier;
        postfx.setBloom(bloomAn, stufe);

        // Die Pixeldichte ist der wirksamste Hebel gegen eine zu niedrige
        // Bildrate — sie kostet quadratisch Füllrate. Der Renderer hält den
        // Deckel fortan auch über Monitorwechsel hinweg ein.
        ctx.setPixelRatioCap(
          QUALITY_SETTINGS[stufe === 'auto' ? 'medium' : stufe].pixelRatioCap,
        );
      }
      postfx.render();
    });

    return () => {
      stopLoop();
      stopInput();
      szene.dispose();
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
