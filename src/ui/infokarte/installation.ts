import { create } from 'zustand';

/** Das nicht standardisierte Ereignis von Chrome und Edge (Entwurf Info-Karte §4.1). */
export interface InstallEreignis extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Gemerktes Ereignis, solange der Browser eine Installation anbietet. */
export const useInstallation = create<{ ereignis: InstallEreignis | null }>(() => ({ ereignis: null }));

/**
 * Muss früh laufen (app/main.tsx, vor dem ersten Rendern): Der Browser
 * feuert das Ereignis nur einmal kurz nach dem Laden. preventDefault hält
 * die eigene Mini-Leiste des Browsers zurück; angeboten wird die
 * Installation dann über den Knopf in der Info-Karte.
 */
export function installationAbfangen(ziel: { addEventListener(typ: string, f: (e: Event) => void): void }): void {
  ziel.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    useInstallation.setState({ ereignis: e as InstallEreignis });
  });
  ziel.addEventListener('appinstalled', () => { useInstallation.setState({ ereignis: null }); });
}

/** Öffnet den Installationsdialog des Browsers; ein Ereignis gilt nur einmal. */
export async function installieren(): Promise<void> {
  const ereignis = useInstallation.getState().ereignis;
  if (ereignis === null) return;
  useInstallation.setState({ ereignis: null });
  await ereignis.prompt();
  await ereignis.userChoice;
}
