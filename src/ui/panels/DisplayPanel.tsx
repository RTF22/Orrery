import { useId } from 'react';
import { useStore } from '../../store';
import type { AppState } from '../../store/types';
import { t } from '../i18n';
import { formatZahl } from '../format';
import { useSitzungMerken } from '../useSitzungMerken';
import { Panel } from './Panel';

/** Schalter und zugehöriger Sprachschlüssel. */
const SCHALTER: readonly (readonly [keyof AppState['display'], string])[] = [
  ['orbits', 'display.orbits'],
  ['labels', 'display.labels'],
  ['markers', 'display.markers'],
  ['belts', 'display.belts'],
  ['milchstrasse', 'display.milchstrasse'],
  ['shadows', 'display.shadows'],
  ['bloom', 'display.bloom'],
];

export function DisplayPanel(): React.JSX.Element {
  const display = useStore((s) => s.display);
  const setDisplay = useStore((s) => s.setDisplay);
  const helligkeitId = useId();
  const abfallId = useId();
  const nachtId = useId();
  const ausgleichId = useId();
  const [merken, setMerken] = useSitzungMerken();

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
            <span className="font-mono tabular-nums">{formatZahl(display.brightness)}</span>
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
            <span className="font-mono tabular-nums">{formatZahl(display.lightFalloff)}</span>
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
        <label htmlFor={nachtId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('display.nightFill')}</span>
            <span className="font-mono tabular-nums">{formatZahl(display.nightFill)}</span>
          </span>
          {/* 0 ist der physikalisch korrekte Wert — und genau der, bei dem
              die abgewandte Hälfte jedes Körpers absolut schwarz bleibt. */}
          <input
            id={nachtId}
            type="range"
            min={0} max={0.5} step={0.01}
            value={display.nightFill}
            onChange={(e) => { setDisplay({ nightFill: Number(e.target.value) }); }}
          />
        </label>

        <label htmlFor={ausgleichId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('display.lightCompensation')}</span>
            <span className="font-mono tabular-nums">{formatZahl(display.lightCompensation)}</span>
          </span>
          {/* 0 lässt den Abstandsabfall unangetastet (Neptun rund ein Prozent
              des Erdniveaus), 1 macht alle Körper gleich hell. */}
          <input
            id={ausgleichId}
            type="range"
            min={0} max={1} step={0.05}
            value={display.lightCompensation}
            onChange={(e) => { setDisplay({ lightCompensation: Number(e.target.value) }); }}
          />
        </label>

        <label className="mt-1 flex items-center gap-2 border-t border-white/10 pt-2">
          <input
            type="checkbox"
            checked={merken}
            onChange={(e) => { setMerken(e.target.checked); }}
          />
          <span>{t('display.rememberSession')}</span>
        </label>
      </div>
    </Panel>
  );
}
