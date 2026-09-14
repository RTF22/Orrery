import { useEffect, useState } from 'react';
import { useStore } from '../../store';

/**
 * Liefert time.jd viermal je Sekunde statt je Bild (Entwurf 4c §5.2): Der
 * Datenblock rechnet Positionen und Geschwindigkeiten, das muss nicht mit
 * 60 Hz laufen. Bei Pause ändert sich der Wert nicht, also auch kein
 * Neuzeichnen. Gelesen wird per getState im Takt, nicht per Abonnement —
 * ein Abonnement feuerte je Bild und müsste selbst wieder drosseln.
 */
export function useLiveJd(taktMs = 250): number {
  const [jd, setJd] = useState(() => useStore.getState().time.jd);
  useEffect(() => {
    const takt = window.setInterval(() => {
      const neu = useStore.getState().time.jd;
      setJd((alt) => (alt === neu ? alt : neu));
    }, taktMs);
    return () => { window.clearInterval(takt); };
  }, [taktMs]);
  return jd;
}
