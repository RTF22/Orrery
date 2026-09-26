import { useCallback, useState } from 'react';
import { useStore } from '../store';
import { ablageHolen, sitzungLoeschen, sitzungMerkenLesen, sitzungMerkenSchreiben } from '../store/persist';
import type { Ablage } from '../store/persist';

/**
 * Die Präferenz „Sitzung merken" lebt bewusst nicht im Store: Sie darf weder
 * im Link noch in der Sitzung selbst mitreisen. app/persistenz.ts liest sie
 * bei jedem Schreibversuch direkt aus der Ablage, darum braucht dieser Hook
 * keine Verbindung dorthin. Ausschalten löscht die gesicherte Sitzung sofort.
 *
 * Eingebettet (Feature Einbettung, Fix-Runde 1) schreibt und löscht `setzen`
 * nichts: DisplayPanel.tsx zeigt den Schalter dort zwar ohnehin nicht an,
 * dieser Schutz gilt zusätzlich im Hook selbst, falls er künftig von anderer
 * Stelle aufgerufen wird. `eingebettet` liest hier wie `ablage` einmal beim
 * ersten Aufruf aus dem Store — die Einbettung ändert sich zur Laufzeit nicht.
 */
export function useSitzungMerken(
  ablage: Ablage | null = ablageHolen(),
  eingebettet: boolean = useStore.getState().ui.eingebettet,
): [boolean, (an: boolean) => void] {
  const [an, setAn] = useState(() => sitzungMerkenLesen(ablage));
  const setzen = useCallback((neu: boolean) => {
    setAn(neu);
    if (eingebettet) return;
    sitzungMerkenSchreiben(ablage, neu);
    if (!neu) sitzungLoeschen(ablage);
  }, [ablage, eingebettet]);
  return [an, setzen];
}
