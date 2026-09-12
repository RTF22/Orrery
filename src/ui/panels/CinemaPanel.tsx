import { useId } from 'react';
import { useStore } from '../../store';
import { t } from '../i18n';
import { Panel } from './Panel';
import { SCENES } from '../../data/scenes';
import { plannedSceneAt } from '../../sim/director';
import { startCinema, stopCinema, nextScene } from '../cinemaControl';

export function CinemaPanel(): React.JSX.Element {
  const cinema = useStore((s) => s.cinema);
  const setCinema = useStore((s) => s.setCinema);
  const keimId = useId();
  const mischenId = useId();
  const pauseId = useId();

  const geplant = plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle);

  return (
    <Panel id="cinema" title={t('panel.cinema')}>
      {/* Die Bedienung des Kino-Modus ist keine Störung: Ereignisse von
          hier halten den Film nicht an (siehe ui/idle.ts). */}
      <div className="flex flex-col gap-2" data-cinema-control="">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            onClick={() => { if (cinema.running) stopCinema(); else startCinema(); }}
          >
            {cinema.running ? t('cinema.stop') : t('cinema.start')}
          </button>
          <button
            type="button"
            className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            onClick={() => { nextScene(); }}
          >
            {t('cinema.next')}
          </button>
        </div>

        <p className="m-0 flex justify-between gap-2">
          <span className="opacity-70">{t('cinema.current')}</span>
          <span data-testid="cinema-titel" className="text-right">
            {t(geplant.scene.titleKey)}
          </span>
        </p>

        <label htmlFor={keimId} className="flex items-center justify-between gap-2">
          <span>{t('cinema.seed')}</span>
          <input
            id={keimId}
            type="number"
            className="w-28 rounded border border-white/15 bg-transparent px-2 py-1"
            value={cinema.seed}
            onChange={(e) => {
              const wert = Number(e.target.value);
              if (Number.isFinite(wert)) setCinema({ seed: Math.trunc(wert) });
            }}
          />
        </label>

        <label htmlFor={mischenId} className="flex items-center gap-2">
          <input
            id={mischenId}
            type="checkbox"
            checked={cinema.shuffle}
            onChange={(e) => { setCinema({ shuffle: e.target.checked }); }}
          />
          <span>{t('cinema.shuffle')}</span>
        </label>

        <label htmlFor={pauseId} className="flex items-center gap-2">
          <input
            id={pauseId}
            type="checkbox"
            checked={cinema.pauseOnInput}
            onChange={(e) => { setCinema({ pauseOnInput: e.target.checked }); }}
          />
          <span>{t('cinema.pauseOnInput')}</span>
        </label>
      </div>
    </Panel>
  );
}
