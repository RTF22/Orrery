import { GROB_ABFRAGE } from '../info/konstanten';

function passt(abfrage: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia(abfrage).matches;
}

/** Läuft Orrery als installierte App (Manifest: display fullscreen; iOS: navigator.standalone)? */
export function laeuftAlsApp(): boolean {
  const ios = typeof navigator !== 'undefined'
    && (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios || passt('(display-mode: fullscreen)') || passt('(display-mode: standalone)');
}

/** Grober Zeiger zum jetzigen Zeitpunkt (dieselbe Abfrage wie useGrob). */
export function grobJetzt(): boolean {
  return passt(GROB_ABFRAGE);
}
