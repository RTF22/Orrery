import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { linkErzeugen, zurueckgesetzt } from '../store/persist';
import { t } from './i18n';
import type { Sprache } from './i18n';

/**
 * „DE"/„EN" sind Sprachcodes, keine übersetzbaren Texte — sie stehen bewusst
 * als Literale und nicht in den Sprachdateien (Ausnahme von der
 * Literalregel).
 */
const SPRACHEN: readonly (readonly [Sprache, string, string])[] = [
  ['de', 'DE', 'language.de'],
  ['en', 'EN', 'language.en'],
];

/** So lange steht die Rückmeldung nach dem Kopieren. */
const MELDUNG_MS = 2000;

const KNOPF = 'rounded border border-transparent px-2 py-0.5 opacity-70 hover:opacity-100';

/**
 * Schmale Leiste über der Panel-Spalte: „Link kopieren", „Zurücksetzen",
 * eine kurzlebige Statusmeldung und der Sprachschalter. Die weiteren
 * Schaltflächen aus dem Gesamtentwurf (UI aus, Vollbild, Kino, Hilfe)
 * bekommen später hier ihren Platz.
 */
export function Kopfzeile(): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const setUi = useStore((s) => s.setUi);
  const replaceAll = useStore((s) => s.replaceAll);
  const [meldung, setMeldung] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ein laufender Timer darf den Komponentenwechsel nicht überleben.
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  const melde = (schluessel: string): void => {
    setMeldung(schluessel);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMeldung(null);
      timer.current = null;
    }, MELDUNG_MS);
  };

  const linkKopieren = async (): Promise<void> => {
    const link = linkErzeugen(useStore.getState(), window.location);
    try {
      // Ohne sicheren Kontext fehlt navigator.clipboard ganz; der Zugriff
      // wirft dann synchron und landet ebenfalls im Rückfall.
      await navigator.clipboard.writeText(link);
      melde('header.copied');
    } catch {
      // Rückfall: Fragment in die Adresszeile, der nächste Start verbraucht es.
      window.history.replaceState(null, '', link);
      melde('header.copyFallback');
    }
  };

  const zuruecksetzen = (): void => {
    replaceAll(zurueckgesetzt(useStore.getState()));
  };

  return (
    <header className="pointer-events-auto flex flex-wrap items-center justify-end gap-1 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1 text-xs text-slate-100 backdrop-blur-md">
      <button type="button" className={KNOPF} onClick={() => { void linkKopieren(); }}>
        {t('header.copyLink')}
      </button>
      <button type="button" className={KNOPF} onClick={zuruecksetzen}>
        {t('header.reset')}
      </button>
      {/* Immer im Baum, damit die Live-Region beim ersten Text schon existiert. */}
      <span role="status" aria-live="polite" className="text-slate-300">
        {meldung === null ? '' : t(meldung)}
      </span>
      <div role="group" aria-label={t('language.switch')} className="flex gap-1">
        {SPRACHEN.map(([code, kurz, schluessel]) => {
          const aktiv = code === language;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={aktiv}
              aria-label={`${t(schluessel)} (${kurz})`}
              onClick={() => { setUi({ language: code }); }}
              className={`rounded border px-2 py-0.5 font-semibold ${
                aktiv
                  ? 'border-sky-300/60 bg-sky-400/20'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {kurz}
            </button>
          );
        })}
      </div>
    </header>
  );
}
