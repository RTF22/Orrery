import { create } from 'zustand';
import { ablageHolen, type Ablage } from '../../store/persist';

/** Reiter der Info-Karte (Entwurf Info-Karte §3). */
export type InfoReiter = 'app' | 'bedienung' | 'ueber';

/** Merkmal „schon gesehen“ in der Ablage des Browsers, Wert '1'. */
export const SCHLUESSEL_INFOKARTE = 'orrery.infokarte.gesehen.v1';

/** Schon der Zugriff kann werfen (gesperrte Websitedaten); dann gilt „nicht gesehen“. */
export function gesehen(ablage: Ablage | null): boolean {
  try {
    return ablage?.getItem(SCHLUESSEL_INFOKARTE) === '1';
  } catch {
    return false;
  }
}

function alsGesehenMerken(ablage: Ablage | null): void {
  try {
    ablage?.setItem(SCHLUESSEL_INFOKARTE, '1');
  } catch {
    // Ohne Ablage öffnet die Karte beim nächsten Start eben wieder.
  }
}

/** Beim Start öffnen: erster Besuch, kein geteilter Link, kein laufendes Kino. */
export function sollBeimStartOeffnen(p: { ablage: Ablage | null; mitLink: boolean; kinoLaeuft: boolean }): boolean {
  return !p.mitLink && !p.kinoLaeuft && !gesehen(p.ablage);
}

/** „App“ zuerst nur auf Touchgeräten, die Orrery noch nicht als App nutzen. */
export function startReiter(grob: boolean, alsApp: boolean): InfoReiter {
  return grob && !alsApp ? 'app' : 'bedienung';
}

interface InfoKarteZustand {
  offen: boolean;
  reiter: InfoReiter;
  oeffnen(reiter: InfoReiter): void;
  /** Schließt und merkt „gesehen“ — erst hier, damit ein sofortiges Neuladen die Karte nicht verschluckt. */
  schliessen(): void;
  setReiter(reiter: InfoReiter): void;
}

/**
 * Bewusst außerhalb des App-Stores wie useBogen (ui/bogen.ts): Die Karte
 * gehört weder in Links noch in Sitzungen oder Ansichten, und „Zurücksetzen“
 * lässt sie unberührt.
 */
export const useInfoKarte = create<InfoKarteZustand>((set) => ({
  offen: false,
  reiter: 'bedienung',
  oeffnen: (reiter) => { set({ offen: true, reiter }); },
  schliessen: () => {
    alsGesehenMerken(ablageHolen());
    set({ offen: false });
  },
  setReiter: (reiter) => { set({ reiter }); },
}));
