import { t } from './i18n';
import { useBogen } from './bogen';

const REITER = 'pointer-events-auto rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-100 backdrop-blur-md';

/**
 * Zwei Reiter unten rechts im Kompaktmodus (Entwurf Phase 5 §4.1): Ein Tipp
 * öffnet den Bogen, ein zweiter auf denselben Reiter schließt ihn, der
 * andere Reiter ersetzt ihn. Die Lage regelt `.bogenreiter` in index.css.
 */
export function Bogenreiter(): React.JSX.Element {
  const bogen = useBogen((s) => s.bogen);
  const kippen = useBogen((s) => s.kippen);
  const reiter = (art: 'bedienung' | 'info', schluessel: string): React.JSX.Element => (
    <button
      type="button"
      aria-pressed={bogen === art}
      onClick={() => { kippen(art); }}
      className={`${REITER} ${bogen === art ? 'bg-sky-400/30' : 'bg-slate-900/70 hover:bg-white/10'}`}
    >
      {t(schluessel)}
    </button>
  );
  return (
    <div className="bogenreiter" data-offen={bogen !== null ? 'true' : 'false'}>
      {reiter('bedienung', 'panel.leiste')}
      {reiter('info', 'panel.info')}
    </div>
  );
}
