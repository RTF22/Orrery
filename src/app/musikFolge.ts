import type { AppState } from '../store/types';

/** Ein- und Ausblenden bei jedem Wechsel von sollSpielen (Entwurf Phase 5 §6.3). */
export const BLENDE_S = 1.5;
/** Überblendung zum nächsten Stück. */
export const UEBERBLENDUNG_S = 3;

/**
 * Soll Musik zu hören sein? Nie stumm geschaltet oder bei verdeckter Seite;
 * sonst im Modus „immer", oder im Modus „kino" bei laufendem Kino.
 */
export function sollSpielen(ton: AppState['ton'], kinoLaeuft: boolean, sichtbar: boolean): boolean {
  if (ton.stumm || !sichtbar) return false;
  return ton.modus === 'immer' || (ton.modus === 'kino' && kinoLaeuft);
}

/**
 * Eine gemischte Runde der Nummern 0 bis anzahl − 1 (Fisher-Yates mit
 * `zufall()` aus [0, 1)). Sie beginnt nie mit `vorher`, dem letzten Stück der
 * Vorrunde — sonst liefe an der Rundengrenze dasselbe Stück zweimal.
 */
export function mischeRunde(anzahl: number, zufall: () => number, vorher: number | null): number[] {
  const runde = Array.from({ length: anzahl }, (_, i) => i);
  for (let i = anzahl - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [runde[i], runde[j]] = [runde[j]!, runde[i]!];
  }
  if (anzahl > 1 && runde[0] === vorher) [runde[0], runde[1]] = [runde[1]!, runde[0]!];
  return runde;
}

export interface Folge {
  naechstes(): number;
}

/** Endlose Folge aus gemischten Runden; keine Wiederholung, bevor alle gespielt sind. */
export function erzeugeFolge(anzahl: number, zufall: () => number): Folge {
  let runde: number[] = [];
  let vorher: number | null = null;
  return {
    naechstes() {
      if (runde.length === 0) runde = mischeRunde(anzahl, zufall, vorher);
      const stueck = runde.shift()!;
      vorher = stueck;
      return stueck;
    },
  };
}
