import { useEffect } from 'react';

interface WakeLockSentinelLike {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (typ: string, hoerer: () => void) => void;
}

interface NavigatorMitWakeLock {
  wakeLock?: { request: (typ: 'screen') => Promise<WakeLockSentinelLike> };
}

let sperre: WakeLockSentinelLike | null = null;
/** Laufende Anfrage; die Sperre kommt erst an, wenn sie aufgelöst ist. */
let anfrage: Promise<void> | null = null;
/** Letzter Wunsch des Aufrufers — entscheidet, ob eine ankommende Sperre bleibt. */
let gewuenscht = false;

/**
 * Hält den Bildschirm wach. Die API fehlt in manchen Browsern und wird auch
 * vom System jederzeit wieder entzogen (etwa beim Tabwechsel) — beides ist
 * kein Fehlerfall, der Film läuft weiter. Läuft schon eine Anfrage, kommt
 * keine zweite hinzu.
 */
export async function requestWakeLock(): Promise<void> {
  gewuenscht = true;
  if (sperre !== null) return;
  if (anfrage !== null) return anfrage;
  const api = (navigator as NavigatorMitWakeLock).wakeLock;
  if (api === undefined) return;
  const laufend = (async () => {
    try {
      const neu = await api.request('screen');
      if (!gewuenscht) {
        // Inzwischen freigegeben (Kino an und gleich wieder aus): sonst bliebe
        // die Sperre bis zum nächsten Tabwechsel liegen.
        try { await neu.release(); } catch { /* schon freigegeben */ }
        return;
      }
      sperre = neu;
      neu.addEventListener('release', () => { if (sperre === neu) sperre = null; });
    } catch {
      // Verweigert (etwa im Hintergrund-Tab) — nicht weiter tragisch.
    }
  })();
  // Erst nach der Zuweisung zurücksetzen: Endet die Anfrage sofort, bliebe
  // sie sonst für immer als laufend stehen.
  anfrage = laufend;
  void laufend.finally(() => { if (anfrage === laufend) anfrage = null; });
  return laufend;
}

export async function releaseWakeLock(): Promise<void> {
  gewuenscht = false;
  const alt = sperre;
  sperre = null;
  if (alt === null) return;
  try { await alt.release(); } catch { /* schon freigegeben */ }
}

/**
 * Fordert die Sperre an, solange `aktiv` gilt, und nach einem Tabwechsel
 * erneut — das System entzieht sie dabei zuverlässig.
 */
export function useWakeLock(aktiv: boolean): void {
  useEffect(() => {
    if (!aktiv) {
      void releaseWakeLock();
      return;
    }
    void requestWakeLock();

    const beiSichtbarkeit = (): void => {
      if (document.visibilityState === 'visible') void requestWakeLock();
    };
    document.addEventListener('visibilitychange', beiSichtbarkeit);
    return () => {
      document.removeEventListener('visibilitychange', beiSichtbarkeit);
      void releaseWakeLock();
    };
  }, [aktiv]);
}
