import type { ReactNode } from 'react';
import { useStore } from '../store';
import { LEISTE_BREITE_MAX_REM, LEISTE_BREITE_MIN_REM } from '../store/types';
import { t } from './i18n';
import { Griff } from './info/Griff';
import { remPx, spaltenBreite, useFensterbreite, useSchmal } from './fenster';
import { useBogen } from './bogen';

/** Schlüssel in ui.panels; ohne Eintrag gilt die Leiste als offen. */
export const LEISTE_PANEL = 'leiste';
/** Wirksame Höchstbreite als Anteil der Fensterbreite (Plan 5-1, Ruling). */
const BREITE_MAX_ANTEIL = 0.4;

const RAHMEN = 'pointer-events-auto rounded-lg border border-white/10 bg-slate-900/70 text-xs font-semibold text-slate-100 backdrop-blur-md hover:bg-white/10';

/**
 * Linke Spalte (Entwurf Phase 5 §3.1): Kopfzeile und Panels, einklappbar zu
 * einem Reiter wie das Infopanel, Breite am rechten Rand ziehbar. Der
 * Store-Wert der Breite wird nur für die Darstellung geklemmt, nie
 * zurückgeschrieben — dasselbe Vorgehen wie beim Infopanel.
 */
export function Seitenleiste({ kopf, children }: { kopf: ReactNode; children: ReactNode }): React.JSX.Element | null {
  const panels = useStore((s) => s.ui.panels);
  const breiteRem = useStore((s) => s.ui.leiste.breiteRem);
  const setUi = useStore((s) => s.setUi);
  const schmal = useSchmal();
  const fensterbreite = useFensterbreite();
  const bogen = useBogen((s) => s.bogen);
  const offen = panels[LEISTE_PANEL] !== false;
  const setzeOffen = (wert: boolean): void => { setUi({ panels: { ...panels, [LEISTE_PANEL]: wert } }); };

  // Kompaktmodus (Entwurf Phase 5 §4.1): nur als Bogen, ohne Griff und ohne
  // Einklappknopf; ui.panels.leiste und die Breite bleiben unberührt.
  if (schmal) {
    if (bogen !== 'bedienung') return null;
    return (
      <div className="bogen pointer-events-auto flex flex-col gap-2 overflow-y-auto border border-white/10 bg-slate-900/80 p-2 backdrop-blur-md">
        {kopf}
        {children}
      </div>
    );
  }

  if (!offen) {
    return (
      <button
        type="button"
        aria-expanded={false}
        aria-label={t('leiste.oeffnen')}
        onClick={() => { setzeOffen(true); }}
        className={`leiste-reiter self-start px-1 py-2 ${RAHMEN}`}
      >
        {t('panel.leiste')}
      </button>
    );
  }

  // Klemmung: siehe spaltenBreite in ./fenster.
  const { breite, obergrenze } = spaltenBreite(
    breiteRem, LEISTE_BREITE_MIN_REM, LEISTE_BREITE_MAX_REM, BREITE_MAX_ANTEIL, fensterbreite,
  );

  return (
    <div className="relative flex max-h-full max-w-full shrink-0 flex-col" style={{ width: `${breite}rem` }}>
      <div className="flex max-h-full flex-col gap-2 overflow-y-auto">
        <div className="flex items-start gap-1">
          <div className="min-w-0 flex-1">{kopf}</div>
          <button
            type="button"
            aria-expanded
            aria-label={t('leiste.schliessen')}
            onClick={() => { setzeOffen(false); }}
            className={`px-2 py-1 ${RAHMEN}`}
          >
            ◂
          </button>
        </div>
        {children}
      </div>
      <Griff
        richtung="senkrecht"
        kante="rechts"
        wert={breite}
        min={LEISTE_BREITE_MIN_REM}
        max={obergrenze}
        schritt={1}
        label={t('leiste.griff.breite')}
        ausVersatz={(start, dx) => start + dx / remPx()}
        onWert={(neu) => { setUi({ leiste: { breiteRem: neu } }); }}
        className="pointer-events-auto absolute top-0 right-0 z-10 h-full w-2 translate-x-1/2 rounded hover:bg-sky-300/30"
      />
    </div>
  );
}
