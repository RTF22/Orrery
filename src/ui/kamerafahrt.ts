import { useStore } from '../store';
import { bodyIndex } from '../data';
import type { Body } from '../sim/types';
import { scaledRadius } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';
import { easeInOutCubic } from './tween';
import { stopCinema } from './cinemaControl';

/** Dauer der Fahrt (Entwurf 4c §5.3). */
export const FAHRT_MS = 1500;
/** Abstand, aus dem ein Körper formatfüllend, aber vollständig zu sehen ist. */
export const FOKUS_FAKTOR = 8;
export const FOKUS_MIN_KM = 1e4;

export function fokusAbstand(body: Body, scale: ScaleSettings): number {
  return Math.max(scaledRadius(body, scale) * FOKUS_FAKTOR, FOKUS_MIN_KM);
}

/** Zeitquelle und Bildplanung sind austauschbar, damit die Fahrt ohne Timer prüfbar ist. */
export interface FahrtOptionen {
  dauerMs?: number;
  jetzt?: () => number;
  anfordern?: (schritt: () => void) => number;
  abbrechen?: (kennung: number) => void;
}

/** Diese Ereignisse beenden eine laufende Fahrt; pointermove bewusst nicht. */
const ABBRUCH_EREIGNISSE = ['pointerdown', 'wheel', 'keydown'] as const;

let laufend: (() => void) | null = null;

export function fahrtLaeuft(): boolean {
  return laufend !== null;
}

export function fahrtAbbrechen(): void {
  laufend?.();
}

/**
 * Fährt die Kamera in FAHRT_MS zum Körper: Das Ziel wird sofort gesetzt
 * (die Bahn führt sonst am Ziel vorbei), der Abstand gleitet logarithmisch
 * mit easeInOutCubic, Azimut und Elevation bleiben. Eine Nutzereingabe
 * bricht ab, ein weiterer Aufruf ersetzt die laufende Fahrt, ein laufendes
 * Kino wird zuerst beendet. Der Objektbaum und die Verweise in den Texten
 * nutzen dieselbe Funktion (Entwurf 4c §5.3).
 */
export function fahreZu(id: string, optionen: FahrtOptionen = {}): void {
  const body = bodyIndex[id];
  if (body === undefined) return;
  fahrtAbbrechen();

  const dauer = optionen.dauerMs ?? FAHRT_MS;
  const jetzt = optionen.jetzt ?? (() => performance.now());
  // Rückfall auf setTimeout für Umgebungen ohne requestAnimationFrame (jsdom
  // ohne pretendToBeVisual); im Browser läuft immer die Bildplanung.
  const hatRaf = typeof requestAnimationFrame === 'function';
  const anfordern = optionen.anfordern
    ?? ((schritt) => (hatRaf ? requestAnimationFrame(schritt) : Number(setTimeout(schritt, 16))));
  const abbrechen = optionen.abbrechen
    ?? ((kennung) => { if (hatRaf) cancelAnimationFrame(kennung); else clearTimeout(kennung); });

  if (useStore.getState().cinema.running) stopCinema();
  const { camera, scale, time, setCamera } = useStore.getState();
  const von = camera.distance;
  const nach = fokusAbstand(body, scale);
  setCamera({
    targetId: id,
    // Im freien Modus wird die Position des Körpers als Bezugspunkt
    // eingefroren (siehe Objektbaum); Geheftet und Verfolgung führen ihn mit.
    freezeJd: camera.mode === 'free' ? time.jd : null,
  });

  const start = jetzt();
  let kennung = 0;
  let aktiv = true;

  const beenden = (): void => {
    aktiv = false;
    laufend = null;
    abbrechen(kennung);
    if (typeof window !== 'undefined') {
      for (const name of ABBRUCH_EREIGNISSE) window.removeEventListener(name, beenden);
    }
  };

  const schritt = (): void => {
    if (!aktiv) return;
    const t = Math.min((jetzt() - start) / dauer, 1);
    useStore.getState().setCamera({ distance: von * Math.pow(nach / von, easeInOutCubic(t)) });
    if (t < 1) kennung = anfordern(schritt);
    else beenden();
  };

  laufend = beenden;
  if (typeof window !== 'undefined') {
    for (const name of ABBRUCH_EREIGNISSE) window.addEventListener(name, beenden, { passive: true });
  }
  kennung = anfordern(schritt);
}
