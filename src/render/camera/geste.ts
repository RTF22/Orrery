/**
 * Gestenregel der Einbettung (Feature Einbettung, Schritt 3): Auf
 * orrery3d.de selbst (`ui.eingebettet === false`) ändert sich nichts — Rad
 * und Ziehen bewegen immer die Kamera. Im iframe auf einer fremden Seite darf
 * die App das Scrollen der Seite dagegen nicht kapern (wie eine eingebettete
 * Karte): Nur eine bewusste Geste (Strg/⌘+Rad, Ziehen mit Maus oder Stift,
 * zwei oder mehr Finger) bewegt dort die Kamera; ein einfaches Mausrad oder
 * ein Finger, der zieht, lässt die Seite scrollen und zeigt einmalig einen
 * Hinweis, wie man stattdessen die Kamera bewegt.
 *
 * Reine Entscheidungsfunktion, getrennt von den DOM-Ereignissen in input.ts:
 * leichter als vollständige Tabelle zu testen.
 */

/** Maus und Stift verhalten sich beim Ziehen gleich; Berührung ist der Sonderfall. */
export type GesteZeigerart = 'maus' | 'stift' | 'touch';
export type GesteArt = 'rad' | 'ziehen';
/** `seite`: Seite scrollt/zoomt, kein (weiterer) Hinweis. `seite-mit-hinweis`: dito, plus Hinweis. */
export type GesteErgebnis = 'kamera' | 'seite' | 'seite-mit-hinweis';

export interface GesteEingabe {
  /** Mausrad oder Zeiger-Ziehen. */
  art: GesteArt;
  /** Bei `art: 'rad'` ohne Bedeutung. */
  zeigerart: GesteZeigerart;
  /** Strg (Windows/Linux) oder ⌘ (Mac) gedrückt; nur beim Rad von Bedeutung. */
  strgOderCmd: boolean;
  /** Zahl der gleichzeitig aktiven Berührungen; bei Maus und Stift 1. */
  beruehrungen: number;
  /** `ui.eingebettet` — außerhalb des iframes entscheidet nur dieses Feld. */
  eingebettet: boolean;
  /**
   * Nur bei Berührungs-Ziehen von Bedeutung: Der Hinweis wurde für diese
   * Geste (seit dem letzten Loslassen) schon einmal gemeldet — dann `seite`
   * statt `seite-mit-hinweis` (einmal je Geste, kein Hinweis bei jeder
   * weiteren Bewegung desselben Fingers).
   */
  hinweisSchonGemeldet?: boolean;
}

export function gesteEntscheiden(e: GesteEingabe): GesteErgebnis {
  if (!e.eingebettet) return 'kamera';

  if (e.art === 'rad') {
    return e.strgOderCmd ? 'kamera' : 'seite-mit-hinweis';
  }

  // Ziehen: Maus und Stift bewegen die Kamera wie außerhalb des iframes.
  if (e.zeigerart !== 'touch') return 'kamera';
  // Zwei oder mehr Finger drehen/zoomen wie heute.
  if (e.beruehrungen >= 2) return 'kamera';
  return e.hinweisSchonGemeldet === true ? 'seite' : 'seite-mit-hinweis';
}
