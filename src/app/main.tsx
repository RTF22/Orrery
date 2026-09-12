import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { createRenderer } from '../render/renderer';
import { buildScene } from '../render/scene';
import { startLoop } from './loop';
import { useStore } from '../store';

/**
 * Einstiegspunkt der Anwendung.
 *
 * Montiert eine vollflächige Canvas für Three.js sowie ein leeres
 * Overlay-Div, das erst eine spätere Aufgabe mit der Bedienoberfläche
 * füllt. Renderer, Szene und Schleife werden hier verdrahtet; die
 * eigentliche Darstellung aller Körper folgt in einer späteren Aufgabe —
 * bislang zeigt die Szene nur eine Platzhalterkugel im Ursprung.
 */
function App(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const ctx = createRenderer(canvas);
    const szene = buildScene(ctx);

    // Vorläufige, feste Kameraposition für den Durchstich. Eine spätere
    // Aufgabe ersetzt dies durch die kamerarelative Steuerung aus dem Store.
    ctx.camera.position.set(0, -6, 3);
    ctx.camera.lookAt(0, 0, 0);

    const stopLoop = startLoop((jd, dt) => {
      szene.update(jd, dt, useStore.getState());
      ctx.renderer.render(ctx.scene, ctx.camera);
    });

    return () => {
      stopLoop();
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
