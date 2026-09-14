import { useCallback, useState } from 'react';
import { ablageHolen, sitzungLoeschen, sitzungMerkenLesen, sitzungMerkenSchreiben } from '../store/persist';
import type { Ablage } from '../store/persist';

/**
 * Die Präferenz „Sitzung merken" lebt bewusst nicht im Store: Sie darf weder
 * im Link noch in der Sitzung selbst mitreisen. app/persistenz.ts liest sie
 * bei jedem Schreibversuch direkt aus der Ablage, darum braucht dieser Hook
 * keine Verbindung dorthin. Ausschalten löscht die gesicherte Sitzung sofort.
 */
export function useSitzungMerken(ablage: Ablage | null = ablageHolen()): [boolean, (an: boolean) => void] {
  const [an, setAn] = useState(() => sitzungMerkenLesen(ablage));
  const setzen = useCallback((neu: boolean) => {
    setAn(neu);
    sitzungMerkenSchreiben(ablage, neu);
    if (!neu) sitzungLoeschen(ablage);
  }, [ablage]);
  return [an, setzen];
}
