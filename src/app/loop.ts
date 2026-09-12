import { useStore } from '../store';

/**
 * Die Renderschleife. Sie liest den Store direkt (ohne Abonnement), damit
 * React-Rerenders und Bildrate vollständig entkoppelt bleiben.
 */
export function startLoop(onFrame: (jd: number, dtSek: number) => void): () => void {
  let laeuft = true;
  let letzte = performance.now();

  const tick = (jetzt: number): void => {
    if (!laeuft) return;
    const dtSek = Math.min((jetzt - letzte) / 1000, 0.1); // Sprung nach Tab-Wechsel deckeln
    letzte = jetzt;

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
