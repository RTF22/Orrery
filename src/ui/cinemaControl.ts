import { useStore } from '../store';

/**
 * Der Kino-Modus wurde durch eine Nutzereingabe angehalten und darf nach
 * Ablauf der Ruhezeit von selbst wieder anlaufen. Ein Beenden von Hand
 * löscht diese Absicht — sonst startete der Film ungefragt neu.
 */
let pausiertSeitMs: number | null = null;

export function startCinema(): void {
  pausiertSeitMs = null;
  const { setCinema, setCamera } = useStore.getState();
  setCinema({ running: true, elapsedSec: 0 });
  setCamera({ mode: 'cinema' });
  // Vollbild braucht eine Nutzergeste; der Aufruf steht deshalb hier im
  // Tasten- beziehungsweise Klickpfad und nicht in einem Effekt.
  if (typeof document !== 'undefined' && document.fullscreenElement === null) {
    void document.documentElement.requestFullscreen?.().catch(() => { /* verweigert */ });
  }
}

export function stopCinema(): void {
  pausiertSeitMs = null;
  const { setCinema, setCamera, camera, time } = useStore.getState();
  setCinema({ running: false });
  // Zurück in den freien Modus, ohne den zuletzt gewählten Körper zu
  // verlieren; der Bezugspunkt wird dabei auf die aktuelle Zeit gesetzt.
  if (camera.mode === 'cinema') {
    setCamera({ mode: 'free', freezeJd: time.jd });
  }
}

export function toggleCinema(): void {
  if (useStore.getState().cinema.running) stopCinema();
  else startCinema();
}

export function nextScene(): void {
  const { cinema, setCinema } = useStore.getState();
  setCinema({ nummer: cinema.nummer + 1, elapsedSec: 0 });
}

/** Meldet eine Nutzereingabe (Taste, Maus, Berührung). */
export function noteUserInput(): void {
  const { cinema, setCinema } = useStore.getState();
  if (!cinema.running || !cinema.pauseOnInput) return;
  pausiertSeitMs = Date.now();
  setCinema({ running: false });
}

/** Nimmt den Film wieder auf, wenn lange genug nichts passiert ist. */
export function resumeIfIdle(jetztMs: number): void {
  if (pausiertSeitMs === null) return;
  const { cinema, setCinema, setCamera } = useStore.getState();
  if (jetztMs - pausiertSeitMs < cinema.idleResumeSec * 1000) return;
  pausiertSeitMs = null;
  setCinema({ running: true });
  setCamera({ mode: 'cinema' });
}
