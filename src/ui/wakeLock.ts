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

/**
 * Hält den Bildschirm wach. Die API fehlt in manchen Browsern und wird auch
 * vom System jederzeit wieder entzogen (etwa beim Tabwechsel) — beides ist
 * kein Fehlerfall, der Film läuft weiter.
 */
export async function requestWakeLock(): Promise<void> {
  if (sperre !== null) return;
  const api = (navigator as NavigatorMitWakeLock).wakeLock;
  if (api === undefined) return;
  try {
    const neu = await api.request('screen');
    sperre = neu;
    neu.addEventListener('release', () => { sperre = null; });
  } catch {
    // Verweigert (etwa im Hintergrund-Tab) — nicht weiter tragisch.
    sperre = null;
  }
}

export async function releaseWakeLock(): Promise<void> {
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
