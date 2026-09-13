import { useStore } from '../store';
import { t } from './i18n';
import type { Sprache } from './i18n';

const SPRACHEN: readonly (readonly [Sprache, string, string])[] = [
  ['de', 'DE', 'language.de'],
  ['en', 'EN', 'language.en'],
];

/**
 * Schmale Leiste über der Panel-Spalte. Heute nur der Sprachschalter; die
 * vier Schaltflächen aus dem Gesamtentwurf (UI aus, Vollbild, Kino, Hilfe)
 * bekommen später hier ihren Platz.
 */
export function Kopfzeile(): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const setUi = useStore((s) => s.setUi);

  return (
    <header className="pointer-events-auto flex items-center justify-end gap-1 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1 text-xs text-slate-100 backdrop-blur-md">
      <div role="group" aria-label={t('language.switch')} className="flex gap-1">
        {SPRACHEN.map(([code, kurz, schluessel]) => {
          const aktiv = code === language;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={aktiv}
              aria-label={t(schluessel)}
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
