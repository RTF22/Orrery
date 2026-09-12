import { useId } from 'react';
import { useStore } from '../../store';
import type { AppState } from '../../store/types';
import { t } from '../i18n';
import { Panel } from './Panel';

/** Schalter und zugehöriger Sprachschlüssel. */
const SCHALTER: readonly (readonly [keyof AppState['display'], string])[] = [
  ['orbits', 'display.orbits'],
  ['labels', 'display.labels'],
  ['markers', 'display.markers'],
  ['bloom', 'display.bloom'],
];

const zahl = (n: number): string => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });

export function DisplayPanel(): React.JSX.Element {
  const display = useStore((s) => s.display);
  const setDisplay = useStore((s) => s.setDisplay);
  const helligkeitId = useId();
  const abfallId = useId();

  return (
    <Panel id="display" title={t('panel.display')}>
      <div className="flex flex-col gap-1">
        {SCHALTER.map(([feld, schluessel]) => (
          <label key={feld} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={display[feld] === true}
              onChange={(e) => { setDisplay({ [feld]: e.target.checked }); }}
            />
            <span>{t(schluessel)}</span>
          </label>
        ))}

        <label htmlFor={helligkeitId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('display.brightness')}</span>
            <span className="font-mono tabular-nums">{zahl(display.brightness)}</span>
          </span>
          <input
            id={helligkeitId}
            type="range"
            min={0.1} max={20} step={0.1}
            value={display.brightness}
            onChange={(e) => { setDisplay({ brightness: Number(e.target.value) }); }}
          />
        </label>

        <label htmlFor={abfallId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('display.lightFalloff')}</span>
            <span className="font-mono tabular-nums">{zahl(display.lightFalloff)}</span>
          </span>
          {/* 2 ist der physikalische Wert; kleinere Exponenten heben die
              äußeren Planeten an, ohne die inneren auszubrennen. */}
          <input
            id={abfallId}
            type="range"
            min={0} max={2} step={0.05}
            value={display.lightFalloff}
            onChange={(e) => { setDisplay({ lightFalloff: Number(e.target.value) }); }}
          />
        </label>
      </div>
    </Panel>
  );
}
