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
import { t } from '../ui/i18n';
import { App as Bedienoberflaeche } from '../ui/App';
import type { QualityTier } from '../store/types';
import { QUALITY_SETTINGS } from './quality';
import { ablageHolen } from '../store/persist';
import { sicherungStarten, startZustand } from './persistenz';
import { fahreZu } from '../ui/kamerafahrt';
import { zeigerAusgeblendet } from '../ui/idle';
import { themaVerfallStarten } from '../ui/info/themaVerfall';
import { steuerungTakt, tempoAendern } from '../ui/steuerung/anwenden';
import type { SteuerungUmgebung } from '../ui/steuerung/anwenden';
import { padLeserErstellen } from '../ui/steuerung/gamepad';
import { kreuzSichtbar } from '../ui/steuerung/kreuz';
import { Fadenkreuz } from '../ui/steuerung/Fadenkreuz';
import { tastaturAnhaengen } from '../ui/steuerung/tastatur';
import { letztePose } from '../render/camera/controller';
import { TempoHinweis } from '../ui/steuerung/TempoHinweis';

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
    const szene = buildScene(ctx, overlay, (key) => t(key));
    if (import.meta.env.DEV) {
      // Für die Abnahme der Klickflächen: Kamera und Szene ohne Klickweg abfragen.
      Object.assign(window as unknown as Record<string, unknown>, { kamera: ctx.camera, szene, letztePose });
    }
    const postfx = createPostFx(ctx);
    // Ziehen dreht, Rad und Zwei-Finger-Geste zoomen; Tippen fährt zum
    // getroffenen Körper, Hover hebt ihn hervor (Entwurf Klickflächen §3.3).
    const stopInput = attachCameraInput(canvas, {
      onTipp: (x, y, art) => {
        const id = szene.trefferBei(x, y, art);
        if (id !== null) fahreZu(id);
      },
      onZeiger: (zeiger) => { szene.setZeiger(zeiger); },
      // Im Flug regelt das Rad das Tempo (Entwurf Flug und Controller §4.3).
      onTempo: (faktor) => { tempoAendern(faktor); },
    });

    // Flugtasten (Entwurf Flug und Controller §4): gehalten, je Bild ausgewertet.
    const tastatur = tastaturAnhaengen(window);

    // Tastatur, Controller und Fadenkreuz je Bild (Entwurf Flug und Controller
    // §5, §6.2). Ohne sicheren Kontext oder Gamepad-API schaltet sich der Leser
    // still ab. Die Canvas füllt das Fenster; innerWidth/innerHeight erzwingen
    // anders als clientWidth keinen Layoutdurchgang je Bild.
    const steuerung: SteuerungUmgebung = {
      tasten: tastatur.stand,
      letztePose,
      pad: padLeserErstellen({ isSecureContext: window.isSecureContext, navigator }),
      leinwand: () => ({ breite: window.innerWidth, hoehe: window.innerHeight }),
      zeiger: (zeiger) => { szene.setZeiger(zeiger); },
      trefferBei: (x, y) => szene.trefferBei(x, y, 'pad'),
    };

    // Der Renderer meldet jede Größen- und Pixeldichteänderung; die
    // Composer-Ziele hängen sich hier an, damit sie nie hinterherhinken.
    ctx.afterResize = () => { postfx.resize(); };

    let bloomAn: boolean | null = null;
    let stufe: QualityTier | null = null;

    const stopLoop = startLoop((jd, dt) => {
      // Vor dem Kino-Takt: Ein Flug beendet das Kino im selben Bild (Entwurf
      // Flug und Controller §6.2). Die Lage ist die des zuletzt gezeigten Bildes.
      steuerungTakt(jd, dt, steuerung);
      // Vor dem Lesen des Zustands: Szene und Kamera sollen im selben Bild
      // denselben Stand sehen.
      tickCinema(dt);
      const state = useStore.getState();
      // Unter dem ausgeblendeten Mauszeiger ruht der Hover (Entwurf Klickflächen
      // §7): Sonst höben im Kino vorbeiziehende Bahnen und Monde sich hervor. Die
      // nächste Mausbewegung meldet den Zeiger über onZeiger neu.
      if (zeigerAusgeblendet()) szene.setZeiger(null);
      szene.update(jd, dt, state);

      // Hebt das Fadenkreuz etwas hervor, bleibt die Form des Mauszeigers, wie sie ist.
      const zeigerForm = szene.hervorgehoben() === null || kreuzSichtbar() ? '' : 'pointer';
      if (canvas.style.cursor !== zeigerForm) canvas.style.cursor = zeigerForm;

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
      tastatur.loesen();
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
      {/* Außerhalb der Bedienoberfläche: bleibt sichtbar, wenn H sie ausblendet. */}
      <TempoHinweis />
      {/* Über der Bedienoberfläche; bleibt sichtbar, wenn H sie ausblendet. */}
      <Fadenkreuz />
    </>
  );
}

const wurzelElement = document.getElementById('root');
if (wurzelElement === null) {
  throw new Error('Wurzelelement "#root" wurde nicht gefunden.');
}

// Startzustand: Fragment vor gesicherter Sitzung vor Standard, Sprache aus
// dem Zustand oder vom Browser (app/persistenz.ts). Danach läuft die
// gedrosselte Sicherung bis zum Schließen der Seite. Der Themenverfall startet
// erst nach dem Startzustand, damit dessen Thema Sonnensystem stehen bleibt.
const ablage = ablageHolen();
useStore.getState().replaceAll(startZustand({
  hash: window.location.hash,
  fragmentEntfernen: () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  },
  ablage,
  navigatorLanguage: navigator.language,
}));
sicherungStarten(useStore, { ablage, ziel: window });
themaVerfallStarten();

createRoot(wurzelElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
