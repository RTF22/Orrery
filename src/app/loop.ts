import { useStore } from '../store';
import { detectTier, MESSFENSTER } from './quality';

/**
 * Die Renderschleife. Sie liest den Store direkt (ohne Abonnement), damit
 * React-Rerenders und Bildrate vollständig entkoppelt bleiben.
 */
export function startLoop(onFrame: (jd: number, dtSek: number) => void): () => void {
  let laeuft = true;
  let letzte = performance.now();

  // Die ersten Sekunden dienen der Einstufung; danach wird nicht mehr
  // gemessen, damit eine spätere Lastspitze die Stufe nicht nachträglich
  // drückt (und die Auswahl des Betrachters nie überschreibt).
  let messwerte: number[] | null = [];

  const tick = (jetzt: number): void => {
    if (!laeuft) return;
    const dtSek = Math.min((jetzt - letzte) / 1000, 0.1); // Sprung nach Tab-Wechsel deckeln
    letzte = jetzt;

    if (messwerte !== null) {
      messwerte.push(dtSek * 1000);
      if (messwerte.length >= MESSFENSTER * 3) {
        const stufe = detectTier(messwerte);
        messwerte = null;
        if (stufe !== 'auto' && useStore.getState().quality.tier === 'auto') {
          useStore.setState({ quality: { tier: stufe } });
        }
      }
    }

    const s = useStore.getState();
    if (!s.time.paused) {
      useStore.setState({ time: { ...s.time, jd: s.time.jd + s.time.rateDaysPerSec * dtSek } });
    }
    onFrame(useStore.getState().time.jd, dtSek);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
  return () => { laeuft = false; };
}
