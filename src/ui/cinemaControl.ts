import { useStore } from '../store';
import type { AppState } from '../store/types';

/**
 * Der Kino-Modus wurde durch eine Nutzereingabe angehalten und darf nach
 * Ablauf der Ruhezeit von selbst wieder anlaufen. Ein Beenden von Hand
 * löscht diese Absicht — sonst startete der Film ungefragt neu.
 */
let pausiertSeitMs: number | null = null;

/**
 * Kamera, Zeitrate und Pause von vor dem Start. Das Beenden fällt darauf
 * zurück, auf jedem Weg (Escape, Taste C, Panel, Vollbild verlassen). Das
 * Datum bleibt bewusst stehen: Die Zeit ist im Kino die des Kinos, ein
 * gefundener Finsternis-Zeitpunkt geht nicht verloren (Entscheidung Jens,
 * 14.09.2026). Wird die Seite mit laufendem Kino geladen, gibt es nichts
 * Gemerktes; dann bleibt der freie Modus mit dem Kinoziel.
 */
interface VorKino { camera: AppState['camera']; rateDaysPerSec: number; paused: boolean }
let vorKino: VorKino | null = null;

export function startCinema(): void {
  pausiertSeitMs = null;
  const { setCinema, setCamera, camera, time } = useStore.getState();
  // Nur ein echter Start merkt sich den Zustand; ein Wiederanlauf aus der
  // Pause (Kamera schon im Kinomodus) überschriebe sonst das Original.
  if (camera.mode !== 'cinema') {
    vorKino = { camera: { ...camera }, rateDaysPerSec: time.rateDaysPerSec, paused: time.paused };
  }
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
  const { setCinema, setCamera, setTime, camera, time } = useStore.getState();
  setCinema({ running: false });
  const gemerkt = vorKino;
  vorKino = null;
  // Steht die Kamera nicht mehr im Kinomodus, hat jemand sie während einer
  // Pause von Hand übernommen — das bleibt so.
  if (camera.mode !== 'cinema') return;
  if (gemerkt !== null) {
    setCamera({ ...gemerkt.camera });
    setTime({ rateDaysPerSec: gemerkt.rateDaysPerSec, paused: gemerkt.paused });
    return;
  }
  // Zurück in den freien Modus, ohne den zuletzt gewählten Körper zu
  // verlieren; der Bezugspunkt wird dabei auf die aktuelle Zeit gesetzt.
  setCamera({ mode: 'free', freezeJd: time.jd });
}

export function toggleCinema(): void {
  if (useStore.getState().cinema.running) stopCinema();
  else startCinema();
}

/** Läuft der Film oder steht er nur durch eine Eingabe still? */
export function cinemaAktiv(): boolean {
  const s = useStore.getState();
  return s.cinema.running || s.camera.mode === 'cinema';
}

export function nextScene(): void {
  const { cinema, setCinema } = useStore.getState();
  setCinema({ nummer: cinema.nummer + 1, elapsedSec: 0 });
}

/** Meldet eine Nutzereingabe (Taste, Maus, Berührung). */
export function noteUserInput(): void {
  // Während der Pause zählt die Ruhefrist ab der letzten Eingabe, nicht ab
  // der ersten — sonst liefe der Film mitten in der Bedienung wieder an.
  if (pausiertSeitMs !== null) {
    pausiertSeitMs = Date.now();
    return;
  }
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
