import { useStore } from '../store';
import { detectTier, MESSFENSTER } from './quality';
import { imZeitbereich } from '../sim/time';

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

  // Meldung einer Ausnahme aus onFrame, um wiederholt gleiche Meldungen
  // nicht bei jedem Bild erneut in die Konsole zu schreiben.
  let letzteMeldung = '';

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
      const roh = s.time.jd + s.time.rateDaysPerSec * dtSek;
      const jd = imZeitbereich(roh);
      // Am Rand des Zeitbereichs (sim/time.ts) hält die Uhr an, statt in
      // Zeiten zu laufen, in denen die Bahnelemente ungültig werden.
      useStore.setState({ time: { ...s.time, jd, paused: jd !== roh } });
    }
    // Eine Ausnahme in einem Bild darf die Schleife nicht beenden: Das nächste
    // Bild wird trotzdem angefordert, gleiche Meldungen erscheinen nur einmal.
    try {
      onFrame(useStore.getState().time.jd, dtSek);
      letzteMeldung = ''; // ein Fehler, der sich erholt, wird bei Wiederkehr erneut gemeldet
    } catch (fehler) {
      const meldung = fehler instanceof Error ? fehler.message : String(fehler);
      if (meldung !== letzteMeldung) {
        letzteMeldung = meldung;
        console.error('Bild übersprungen:', fehler);
      }
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
  return () => { laeuft = false; };
}
