import { create } from 'zustand';

/**
 * Welcher Bogen ist im Kompaktmodus offen (Entwurf Phase 5 §4.1)? Höchstens
 * einer: Bedienung oder Info. Bewusst ein eigener kleiner Zustand statt
 * eines Feldes im App-Store: Er wird weder gespeichert noch geteilt, und die
 * Panel-Zustände des Schreibtischs (`ui.panels`) bleiben unberührt, sodass
 * beide Spalten nach dem Vergrößern des Fensters wieder wie vorher stehen.
 */
export type Bogen = 'bedienung' | 'info' | null;

interface BogenZustand {
  bogen: Bogen;
  setBogen(b: Bogen): void;
  /** Öffnet `b`, schließt ihn, falls er schon offen ist, und ersetzt einen anderen. */
  kippen(b: 'bedienung' | 'info'): void;
}

export const useBogen = create<BogenZustand>((set) => ({
  bogen: null,
  setBogen: (bogen) => { set({ bogen }); },
  kippen: (b) => { set((s) => ({ bogen: s.bogen === b ? null : b })); },
}));
