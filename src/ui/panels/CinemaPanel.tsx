import { useId } from 'react';
import { useStore } from '../../store';
import { t } from '../i18n';
import { Panel } from './Panel';
import { SCENES } from '../../data/scenes';
import { sceneIndexFor } from '../../sim/director';
import { startCinema, stopCinema, nextScene, starteSzene } from '../cinemaControl';
import { MusikSteuerung } from './MusikSteuerung';

export function CinemaPanel(): React.JSX.Element {
  const cinema = useStore((s) => s.cinema);
  const setCinema = useStore((s) => s.setCinema);
  const keimId = useId();
  const mischenId = useId();
  const pauseId = useId();

  // Die laufende Szene (Kino läuft) bzw. die des nächsten Starts (Kino steht).
  const markiert = sceneIndexFor(cinema.nummer, SCENES.length, cinema.seed, cinema.shuffle);

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

        <div>
          <h3 className="m-0 mb-1 text-xs font-semibold opacity-80">{t('cinema.szenen')}</h3>
          <ul data-testid="szenenliste" className="m-0 flex list-none flex-col gap-0.5 p-0">
            {SCENES.map((szene, index) => {
              const aktuell = index === markiert;
              return (
                <li key={szene.id}>
                  <button
                    type="button"
                    title={t('cinema.szeneStarten')}
                    aria-current={aktuell ? 'true' : undefined}
                    onClick={() => { starteSzene(index); }}
                    className={`flex w-full items-center gap-2 rounded px-1 py-0.5 text-left hover:bg-white/10 ${
                      aktuell ? 'text-sky-300' : ''
                    }`}
                  >
                    <span aria-hidden="true" className="inline-block w-3 shrink-0 text-center text-xs">
                      {aktuell ? (cinema.running ? '●' : '○') : ''}
                    </span>
                    <span>{t(szene.titleKey)}</span>
                    {aktuell ? (
                      <span className="sr-only">{` (${t(cinema.running ? 'cinema.laeuft' : 'cinema.naechsterStart')})`}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

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

        <MusikSteuerung />
      </div>
    </Panel>
  );
}
