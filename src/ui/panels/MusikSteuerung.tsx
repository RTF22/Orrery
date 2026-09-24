import { useId } from 'react';
import { useStore } from '../../store';
import type { TonModus } from '../../store/types';
import { useMusikStand, type MusikEintrag } from '../musikStand';
import { t } from '../i18n';

const MODI: readonly [TonModus, 'musik.aus' | 'musik.kino' | 'musik.immer'][] = [
  ['aus', 'musik.aus'],
  ['kino', 'musik.kino'],
  ['immer', 'musik.immer'],
];

/** „♪ Titel — Urheber“; ohne Titel steht der Dateiname (Entwurf Phase 5 §6.4). */
function beschriftung(eintrag: MusikEintrag): string {
  const titel = eintrag.titel ?? eintrag.datei;
  return eintrag.urheber === undefined ? titel : `${titel} — ${eintrag.urheber}`;
}

/**
 * Musik aus Dateien des Betreibers (Entwurf Phase 5 §6.4). Ohne gültige
 * Liste (useMusikStand.verfuegbar) erscheint nichts.
 */
export function MusikSteuerung(): React.JSX.Element | null {
  const verfuegbar = useMusikStand((s) => s.verfuegbar);
  const aktuell = useMusikStand((s) => s.aktuell);
  const ton = useStore((s) => s.ton);
  const setTon = useStore((s) => s.setTon);
  const reglerId = useId();
  const stummId = useId();
  if (!verfuegbar) return null;

  return (
    <div data-testid="musik" className="flex flex-col gap-2">
      <h3 className="m-0 text-xs font-semibold opacity-80">{t('musik.titel')}</h3>
      <div className="flex flex-wrap gap-1" role="group" aria-label={t('musik.titel')}>
        {MODI.map(([modus, schluessel]) => (
          <button
            key={modus}
            type="button"
            aria-pressed={ton.modus === modus}
            onClick={() => { setTon({ modus }); }}
            className={`rounded border border-white/15 px-2 py-1 hover:bg-white/10 ${
              ton.modus === modus ? 'bg-white/15 text-sky-300' : ''
            }`}
          >
            {t(schluessel)}
          </button>
        ))}
      </div>
      <label htmlFor={reglerId} className="flex items-center justify-between gap-2">
        <span>{t('musik.lautstaerke')}</span>
        {/* Zwilling der Grenzen 0 bis 1 in store/pruefer.ts (ton.lautstaerke). */}
        <input
          id={reglerId}
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={ton.lautstaerke}
          onChange={(e) => { setTon({ lautstaerke: Number(e.target.value) }); }}
        />
      </label>
      <label htmlFor={stummId} className="flex items-center gap-2">
        <input
          id={stummId}
          type="checkbox"
          checked={ton.stumm}
          onChange={(e) => { setTon({ stumm: e.target.checked }); }}
        />
        <span>{t('musik.stumm')}</span>
      </label>
      {aktuell === null ? null : (
        <p className="m-0 text-xs opacity-80">
          <span aria-hidden="true">♪ </span>
          {aktuell.link === undefined ? beschriftung(aktuell) : (
            <a href={aktuell.link} target="_blank" rel="noopener noreferrer" className="underline">
              {beschriftung(aktuell)}
            </a>
          )}
        </p>
      )}
    </div>
  );
}
