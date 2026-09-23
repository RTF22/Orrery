import { useEffect, useState } from 'react';
import { SCHMAL_ABFRAGE, GROB_ABFRAGE } from './info/konstanten';

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

/** Folgt einer Medienabfrage und rendert bei jeder Änderung neu. */
export function useMedienabfrage(abfrage: string): boolean {
  const pruefe = (): boolean =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(abfrage).matches;
  const [trifft, setTrifft] = useState(pruefe);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(abfrage);
    const bei = (): void => { setTrifft(mq.matches); };
    bei();
    mq.addEventListener?.('change', bei);
    return () => { mq.removeEventListener?.('change', bei); };
  }, [abfrage]);
  return trifft;
}

/** Kompaktmodus (SCHMAL_ABFRAGE, Entwurf Phase 5 §4.1). */
export const useSchmal = (): boolean => useMedienabfrage(SCHMAL_ABFRAGE);

/** Grober Zeiger (GROB_ABFRAGE, Entwurf Phase 5 §4.2). */
export const useGrob = (): boolean => useMedienabfrage(GROB_ABFRAGE);

/**
 * Wirksame Breite einer Spalte in rem: Die Obergrenze ist der kleinere Wert
 * aus Höchstbreite und Anteil der Fensterbreite, nie unter der Mindestbreite.
 * Der gespeicherte Wert wird nur für die Darstellung geklemmt, nie
 * zurückgeschrieben (Seitenleiste 40 %, Infopanel 60 %).
 */
export function spaltenBreite(
  gespeichert: number, minRem: number, maxRem: number, anteil: number, fensterbreite: number | null,
): { breite: number; obergrenze: number } {
  const breiteMax = Math.min(
    maxRem,
    fensterbreite === null ? maxRem : Math.floor((fensterbreite * anteil) / remPx()),
  );
  const obergrenze = Math.max(minRem, breiteMax);
  return { breite: Math.min(gespeichert, obergrenze), obergrenze };
}
