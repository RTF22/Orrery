import { useId } from 'react';
import { useStore } from '../../store';
import { t } from '../i18n';
import { Panel } from './Panel';
import {
  formatJd, formatRate, isOutOfRange, jdZuDatumsfeld,
} from '../format';
import { dateToJd } from '../../sim/time';

/** Reglerbereich: eine Sekunde bis tausend Jahre je Sekunde. */
const RATE_MIN = 1 / 86400;
const RATE_MAX = 1000 * 365.25;

/**
 * Der Regler arbeitet logarithmisch — sonst läge der gesamte nutzbare
 * Bereich unterhalb des ersten Prozents des Schiebewegs.
 */
const reglerZuRate = (v: number): number => RATE_MIN * (RATE_MAX / RATE_MIN) ** v;
const rateZuRegler = (rate: number): number =>
  Math.log(Math.min(Math.max(Math.abs(rate), RATE_MIN), RATE_MAX) / RATE_MIN)
  / Math.log(RATE_MAX / RATE_MIN);

export function TimePanel(): React.JSX.Element {
  const zeit = useStore((s) => s.time);
  const setTime = useStore((s) => s.setTime);
  const datumId = useId();
  const rateId = useId();

  const ausserhalb = isOutOfRange(zeit.jd);

  return (
    <Panel id="time" title={t('panel.time')}>
      <div className="flex flex-col gap-2">
        <output className="font-mono text-base tabular-nums">{formatJd(zeit.jd)}</output>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            onClick={() => { setTime({ paused: !zeit.paused }); }}
          >
            {zeit.paused ? t('time.play') : t('time.pause')}
          </button>
          <button
            type="button"
            className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            onClick={() => { setTime({ rateDaysPerSec: -zeit.rateDaysPerSec }); }}
          >
            {t('time.reverse')}
          </button>
          <button
            type="button"
            className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            onClick={() => { setTime({ jd: dateToJd(new Date()) }); }}
          >
            {t('time.now')}
          </button>
        </div>

        <label htmlFor={rateId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('time.rate')}</span>
            <span className="font-mono tabular-nums">
              {formatRate(zeit.paused ? 0 : zeit.rateDaysPerSec)}
            </span>
          </span>
          <input
            id={rateId}
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={rateZuRegler(zeit.rateDaysPerSec)}
            onChange={(e) => {
              const betrag = reglerZuRate(Number(e.target.value));
              setTime({ rateDaysPerSec: zeit.rateDaysPerSec < 0 ? -betrag : betrag });
            }}
          />
        </label>

        <label htmlFor={datumId} className="flex items-center justify-between gap-2">
          <span>{t('time.date')}</span>
          <input
            id={datumId}
            type="date"
            max="9999-12-31"
            className="rounded border border-white/15 bg-transparent px-2 py-1"
            value={jdZuDatumsfeld(zeit.jd)}
            onChange={(e) => {
              const teile = e.target.value.split('-').map(Number);
              const [jahr, monat, tag] = teile;
              if (jahr === undefined || monat === undefined || tag === undefined) return;
              if (!Number.isFinite(jahr * monat * tag)) return;
              setTime({ jd: dateToJd(new Date(Date.UTC(jahr, monat - 1, tag))) });
            }}
          />
        </label>

        {ausserhalb ? (
          <p role="alert" className="m-0 rounded bg-amber-500/15 px-2 py-1 text-amber-200">
            {t('model.outOfRange')}
          </p>
        ) : null}
      </div>
    </Panel>
  );
}
