import type { Block, Inline } from './markdownParser';
import { erstautorNachname, jahrMitSuffix, publikationFinden } from '../../data/literatur';
import type { Publikation } from '../../data/literatur';

const PRAEFIX = 'literatur:';

function sammeln(kinder: readonly Inline[], ziel: string[]): void {
  for (const k of kinder) {
    if (k.typ === 'link' && k.ziel.startsWith(PRAEFIX)) ziel.push(k.ziel.slice(PRAEFIX.length));
    if (k.typ === 'fett' || k.typ === 'kursiv' || k.typ === 'link') sammeln(k.kinder, ziel);
  }
}

/** Kennungen aller Zitate in Reihenfolge des ersten Auftretens, ohne Doppelte. */
export function zitierteKennungen(bloecke: readonly Block[]): string[] {
  const ids: string[] = [];
  for (const b of bloecke) {
    switch (b.typ) {
      case 'ueberschrift':
      case 'absatz':
        sammeln(b.kinder, ids);
        break;
      case 'liste':
        for (const punkt of b.punkte) sammeln(punkt, ids);
        break;
      case 'tabelle':
        for (const zeile of [b.kopf, ...b.zeilen]) for (const zelle of zeile) sammeln(zelle, ids);
        break;
      case 'formel':
        break;
    }
  }
  return [...new Set(ids)];
}

/** Alphabetisch nach Erstautor (ohne Rücksicht auf Groß-/Kleinschreibung und Akzente), dann Jahr, dann Suffix. */
export function sortiereArbeiten(arbeiten: readonly Publikation[]): Publikation[] {
  return [...arbeiten].sort((a, b) =>
    erstautorNachname(a).localeCompare(erstautorNachname(b), undefined, { sensitivity: 'base' })
    || a.jahr - b.jahr
    || jahrMitSuffix(a).localeCompare(jahrMitSuffix(b)));
}

/**
 * Die Arbeiten, die ein Text zitiert (Entwurf 4d §4.3). Abgeleitet aus dem
 * Text statt aus einem Feld im Katalog, damit nichts doppelt gepflegt wird.
 * Unbekannte Kennungen fallen weg; der Dateitest verhindert sie.
 */
export function zitierteArbeiten(bloecke: readonly Block[]): Publikation[] {
  return sortiereArbeiten(
    zitierteKennungen(bloecke).flatMap((id) => {
      const p = publikationFinden(id);
      return p === undefined ? [] : [p];
    }),
  );
}
