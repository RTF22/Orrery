import { bodyIndex } from './index';
import { SCENES } from './scenes';
import { istThema } from './themen';
import { quelleFinden } from './quellen';
import type { Quelle } from './quellen';
import { publikationFinden } from './literatur';
import type { Publikation } from './literatur';

/**
 * Ein aufgelöster Verweis aus einem Erläuterungstext (Entwurf 4c §4.3).
 * Die Auflösung prüft gegen die Kataloge, damit ein Tippfehler in einer
 * Textdatei nie einen toten Knopf erzeugt — unbekannte Ziele werden vom
 * Renderer als schlichter Text gezeigt, und der Dateitest lässt sie
 * durchfallen.
 */
export type Verweis =
  | { art: 'objekt' | 'szene' | 'thema'; kennung: string }
  | { art: 'quelle'; quelle: Quelle }
  | { art: 'literatur'; publikation: Publikation }
  | { art: 'extern'; url: string };

export function textKennungGueltig(art: string, kennung: string): boolean {
  if (kennung === '') return false;
  switch (art) {
    case 'objekt': return Object.hasOwn(bodyIndex, kennung);
    case 'szene': return SCENES.some((s) => s.id === kennung);
    case 'thema': return istThema(kennung);
    default: return false;
  }
}

export function verweisAufloesen(ziel: string): Verweis | null {
  if (ziel.startsWith('https://')) return { art: 'extern', url: ziel };
  const trenner = ziel.indexOf(':');
  if (trenner <= 0) return null;
  const art = ziel.slice(0, trenner);
  const kennung = ziel.slice(trenner + 1);
  if (art === 'quelle') {
    const quelle = quelleFinden(kennung);
    return quelle === undefined ? null : { art: 'quelle', quelle };
  }
  if (art === 'literatur') {
    const publikation = publikationFinden(kennung);
    return publikation === undefined ? null : { art: 'literatur', publikation };
  }
  if (art !== 'objekt' && art !== 'szene' && art !== 'thema') return null;
  return textKennungGueltig(art, kennung) ? { art, kennung } : null;
}
