import { create } from 'zustand';

/** Reiter der Steuerungskarte (Entwurf Info-Karte §7). */
export type SteuerReiter = 'tastatur' | 'controller';

interface SteuerKarteZustand {
  offen: boolean;
  reiter: SteuerReiter;
  /** Öffnet immer mit „Tastatur“. */
  oeffnen(): void;
  schliessen(): void;
  setReiter(reiter: SteuerReiter): void;
}

/** Flüchtig wie useInfoKarte: nicht in Link, Sitzung oder Ansicht. */
export const useSteuerKarte = create<SteuerKarteZustand>((set) => ({
  offen: false,
  reiter: 'tastatur',
  oeffnen: () => { set({ offen: true, reiter: 'tastatur' }); },
  schliessen: () => { set({ offen: false }); },
  setReiter: (reiter) => { set({ reiter }); },
}));
