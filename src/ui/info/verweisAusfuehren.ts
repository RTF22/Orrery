import type { Verweis } from '../../data/verweise';
import { SCENES } from '../../data/scenes';
import { useStore } from '../../store';
import { fahreZu } from '../kamerafahrt';
import { startCinema } from '../cinemaControl';

export interface VerweisWirkung {
  /** Scrollt das untere Segment zur Karte und hebt sie kurz hervor. */
  hebeHervor: (quelleId: string) => void;
}

/**
 * Wirkung eines angeklickten Verweises (Entwurf 4c §4.3). Externe Ziele
 * öffnet der Browser selbst über das Anker-Element; hier passiert nichts.
 * Eine Szene startet wie mit Taste C, nur ohne Mischung und auf ihrer
 * Nummer — inklusive Vollbild-Anfrage aus startCinema (Ruling 5).
 */
export function verweisAusfuehren(v: Verweis, wirkung: VerweisWirkung): void {
  const s = useStore.getState();
  switch (v.art) {
    case 'objekt':
      s.setInfo({ thema: null });
      fahreZu(v.kennung);
      return;
    case 'szene': {
      const index = SCENES.findIndex((szene) => szene.id === v.kennung);
      if (index < 0) return;
      s.setInfo({ thema: null });
      s.setCinema({ shuffle: false, nummer: index });
      startCinema();
      return;
    }
    case 'thema':
      s.setInfo({ thema: v.kennung });
      return;
    case 'quelle':
      wirkung.hebeHervor(v.quelle.id);
      return;
    case 'extern':
      return;
  }
}
