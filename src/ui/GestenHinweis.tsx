import { useEffect, useState } from 'react';
import { gesteHinweisAbonnieren, istMac } from './gesteMeldung';
import type { GestenHinweisArt } from './gesteMeldung';
import { t } from './i18n';

/** Dauer der Einblendung (Anforderung 3, etwa 1,5 s wie HINWEIS_MS in TempoHinweis). */
export const GESTE_HINWEIS_MS = 1500;

function text(art: GestenHinweisArt): string {
  if (art === 'touch') return t('geste.hinweis.zweiFinger');
  return istMac(navigator) ? t('geste.hinweis.cmdRad') : t('geste.hinweis.ctrlRad');
}

/**
 * Gestenhinweis der Einbettung (Feature Einbettung, Schritt 3): Rad ohne
 * Strg/⌘ oder ein ziehender Finger bewegen im iframe die fremde Seite statt
 * der Kamera (`render/camera/geste.ts`) — dieser Hinweis erklärt, wie man
 * stattdessen die Kamera bewegt. Mittig über dem Bild, damit er die
 * Minileiste und den TempoHinweis unten mittig nicht überdeckt.
 *
 * Bleibt wie TempoHinweis dauerhaft eingehängt und zunächst leer: Eine
 * `aria-live`-Region, die erst nach der ersten Änderung ins Dokument kommt,
 * melden Screenreader nicht zuverlässig.
 */
export function GestenHinweis(): React.JSX.Element {
  const [art, setArt] = useState<GestenHinweisArt | null>(null);

  useEffect(() => {
    let uhr = 0;
    const abbestellen = gesteHinweisAbonnieren((neu) => {
      setArt(neu);
      window.clearTimeout(uhr);
      uhr = window.setTimeout(() => { setArt(null); }, GESTE_HINWEIS_MS);
    });
    return () => {
      abbestellen();
      window.clearTimeout(uhr);
    };
  }, []);

  const sichtbar = art !== null;
  return (
    <div
      aria-live="polite"
      className={
        sichtbar
          ? 'pointer-events-none fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded bg-black/60 px-4 py-2 text-center text-sm text-slate-100'
          : 'pointer-events-none fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2'
      }
    >
      {sichtbar ? text(art) : ''}
    </div>
  );
}
