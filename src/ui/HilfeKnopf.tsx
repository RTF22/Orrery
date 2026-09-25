import { t } from './i18n';
import { useInfoKarte, startReiter } from './infokarte/zustand';
import { grobJetzt, laeuftAlsApp } from './infokarte/geraet';

/**
 * „?“ oben rechts im Kompaktmodus (Entwurf Info-Karte §7): Am Handy liegt ⓘ
 * sonst nur im Bogen „Bedienung“. 44 × 44 px wie alle Bedienziele am Touchgerät.
 */
export function HilfeKnopf(): React.JSX.Element {
  const oeffnen = useInfoKarte((s) => s.oeffnen);
  return (
    <button
      type="button"
      aria-label={t('infokarte.knopf')}
      title={t('infokarte.knopf')}
      onClick={() => { oeffnen(startReiter(grobJetzt(), laeuftAlsApp())); }}
      className="hilfeknopf pointer-events-auto fixed right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-900/70 text-lg font-semibold text-slate-100 backdrop-blur-md"
    >
      ?
    </button>
  );
}
