import { useEffect, useState } from 'react';
import { SCHMAL_ABFRAGE } from './info/konstanten';

/**
 * Fensterhelfer für beide Spalten (Seitenleiste und Infopanel). Früher
 * lokal in InfoPanel.tsx; seit Phase 5 teilen sich beide Spalten dieselbe
 * Messung von rem, Fensterbreite und schmalem Bildschirm.
 */

/** Pixel je rem; ohne Dokument (Tests in node) 16. */
export const remPx = (): number =>
  (typeof document === 'undefined' ? 16 : parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);

/**
 * Fensterbreite als Zustand statt einmalig beim Rendern gelesen: Die
 * Höchstbreiten der Spalten hängen von ihr ab und müssen deshalb einer
 * Größenänderung des Fensters folgen, nicht nur dem ersten Aufruf.
 */
export function useFensterbreite(): number | null {
  const [breite, setBreite] = useState<number | null>(() => (typeof window === 'undefined' ? null : window.innerWidth));
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bei = (): void => { setBreite(window.innerWidth); };
    window.addEventListener('resize', bei);
    return () => { window.removeEventListener('resize', bei); };
  }, []);
  return breite;
}

/** Folgt der Medienabfrage SCHMAL_ABFRAGE (Entwurf 4c §3.4). */
export function useSchmal(): boolean {
  const abfrage = (): boolean =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(SCHMAL_ABFRAGE).matches;
  const [schmal, setSchmal] = useState(abfrage);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(SCHMAL_ABFRAGE);
    const bei = (): void => { setSchmal(mq.matches); };
    mq.addEventListener('change', bei);
    return () => { mq.removeEventListener('change', bei); };
  }, []);
  return schmal;
}
