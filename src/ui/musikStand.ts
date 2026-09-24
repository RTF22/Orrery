import { create } from 'zustand';

/** Ein Eintrag aus `musik/stuecke.json` nach der Prüfung (app/musikListe.ts). */
export interface MusikEintrag {
  readonly datei: string;
  readonly titel?: string;
  readonly urheber?: string;
  readonly link?: string;
}

interface MusikStand {
  /** Hat die Liste des Betreibers mindestens einen gültigen Eintrag? Ohne ihn keine Bedienung. */
  verfuegbar: boolean;
  /** Das Stück, das gerade läuft oder beim nächsten Einblenden weiterläuft. */
  aktuell: MusikEintrag | null;
}

/**
 * Nicht gespeicherter Zustand für die Oberfläche (Entwurf Phase 5 §6.2). Die
 * Liste gehört nicht in die Sitzung: Sie liegt beim Betreiber auf dem
 * Webspace und wird bei jedem Start neu geladen (app/musik.ts schreibt hier).
 */
export const useMusikStand = create<MusikStand>(() => ({ verfuegbar: false, aktuell: null }));
