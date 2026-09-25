import { useEffect, useState } from 'react';
import { padLeserErstellen } from './gamepad';

/**
 * Wahr, solange ein Controller mit Standardbelegung verbunden ist (Entscheidung 4,
 * Info-Karte am Touchgerät). Anfangswert und jede Neuberechnung laufen über
 * denselben Leser aus `padLeserErstellen`: Ohne sicheren Kontext, ohne
 * getGamepads oder nach einer Ausnahme bleibt er dauerhaft falsch. Verbindungs-
 * und Trennereignisse des Fensters lösen die Neuberechnung aus.
 */
export function usePadVerbunden(): boolean {
  const [leser] = useState(() => padLeserErstellen({ isSecureContext: window.isSecureContext, navigator }));
  const [verbunden, setVerbunden] = useState(() => leser() !== null);

  useEffect(() => {
    const pruefen = (): void => { setVerbunden(leser() !== null); };
    window.addEventListener('gamepadconnected', pruefen);
    window.addEventListener('gamepaddisconnected', pruefen);
    return () => {
      window.removeEventListener('gamepadconnected', pruefen);
      window.removeEventListener('gamepaddisconnected', pruefen);
    };
  }, [leser]);

  return verbunden;
}
