import { useEffect, useState } from 'react';
import { noteUserInput, resumeIfIdle } from './cinemaControl';

/** Nach so vielen Sekunden ohne Eingabe verschwinden UI und Mauszeiger. */
export const IDLE_HIDE_SEC = 3;

/** So oft wird geprüft, ob Ruhe eingetreten ist. */
const TAKT_MS = 500;

interface IdleOptionen {
  onIdle: () => void;
  onActive: () => void;
  onTick: (jetztMs: number) => void;
}

/**
 * Zählt die Zeit seit der letzten Eingabe. Bewusst ohne eigene Zeitquelle:
 * Der Aufrufer übergibt den Zeitstempel, wodurch der Wächter ohne Timer
 * prüfbar ist.
 */
export function createIdleWatcher(optionen: IdleOptionen): {
  handleInput(jetztMs: number): void;
  tick(jetztMs: number): void;
  dispose(): void;
} {
  let letzteEingabeMs = Date.now();
  let untaetig = false;

  return {
    handleInput(jetztMs) {
      letzteEingabeMs = jetztMs;
      if (untaetig) {
        untaetig = false;
        optionen.onActive();
      }
    },
    tick(jetztMs) {
      optionen.onTick(jetztMs);
      if (!untaetig && jetztMs - letzteEingabeMs >= IDLE_HIDE_SEC * 1000) {
        untaetig = true;
        optionen.onIdle();
      }
    },
    dispose() { untaetig = false; },
  };
}

const EINGABE_EREIGNISSE = ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart'];

/**
 * Verbindet den Wächter mit den Ereignissen des Fensters und liefert, ob
 * gerade Ruhe herrscht. Der Mauszeiger wird über eine Klasse am
 * Wurzelelement ausgeblendet, damit CSS und nicht JavaScript die
 * Darstellung bestimmt.
 */
export function useIdleHide(): boolean {
  const [untaetig, setUntaetig] = useState(false);

  useEffect(() => {
    const waechter = createIdleWatcher({
      onIdle: () => { setUntaetig(true); },
      onActive: () => { setUntaetig(false); },
      onTick: (jetztMs) => { resumeIfIdle(jetztMs); },
    });

    const beiEingabe = (e: Event): void => {
      // `c` und `n` steuern den Kino-Modus selbst und gelten nicht als
      // Störung — sonst hielte der Start ihn sofort wieder an.
      const istSteuertaste = e instanceof KeyboardEvent
        && (e.key === 'c' || e.key === 'n');
      waechter.handleInput(Date.now());
      if (!istSteuertaste) noteUserInput();
    };

    const takt = window.setInterval(() => { waechter.tick(Date.now()); }, TAKT_MS);
    for (const name of EINGABE_EREIGNISSE) {
      window.addEventListener(name, beiEingabe, { passive: true });
    }

    return () => {
      window.clearInterval(takt);
      for (const name of EINGABE_EREIGNISSE) {
        window.removeEventListener(name, beiEingabe);
      }
      waechter.dispose();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('zeiger-aus', untaetig);
    return () => { document.documentElement.classList.remove('zeiger-aus'); };
  }, [untaetig]);

  return untaetig;
}
