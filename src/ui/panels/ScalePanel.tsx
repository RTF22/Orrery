import { useEffect, useId, useRef } from 'react';
import { useStore } from '../../store';
import { SCALE_PRESETS } from '../../sim/scale';
import type { ScaleSettings } from '../../sim/scale';
import { t } from '../i18n';
import { formatZahl } from '../format';
import { Panel } from './Panel';
import { tweenScale } from '../tween';

const PRESET_NAMEN = ['realistisch', 'schaubild', 'kompakt'] as const;
type PresetName = typeof PRESET_NAMEN[number];

/** Dauer des Preset-Übergangs; kurz genug zum Vergleichen, lang genug zum Folgen. */
const UEBERGANG_MS = 700;

const GROESSE_MIN = 1;
const GROESSE_MAX = 1000;

/** Der Größenregler ist logarithmisch — zwischen 1 und 1000 liegen drei Dekaden. */
const reglerZuGroesse = (v: number): number =>
  GROESSE_MIN * (GROESSE_MAX / GROESSE_MIN) ** v;
const groesseZuRegler = (g: number): number =>
  Math.log(Math.min(Math.max(g, GROESSE_MIN), GROESSE_MAX) / GROESSE_MIN)
  / Math.log(GROESSE_MAX / GROESSE_MIN);

export function ScalePanel(): React.JSX.Element {
  const scale = useStore((s) => s.scale);
  const setScale = useStore((s) => s.setScale);
  const abbrechen = useRef<(() => void) | null>(null);
  const groesseId = useId();
  const abstandId = useId();
  const sonneId = useId();

  // Ein laufender Übergang darf den Komponentenwechsel nicht überleben.
  useEffect(() => () => { abbrechen.current?.(); }, []);

  const waehlePreset = (name: PresetName): void => {
    abbrechen.current?.();
    const von: ScaleSettings = {
      sizeScale: scale.sizeScale,
      distanceExponent: scale.distanceExponent,
      sunDamping: scale.sunDamping,
    };
    // Der Name steht sofort, die Werte fahren weich nach — sonst wirkte der
    // Knopf erst nach dem Übergang gedrückt.
    setScale({ preset: name });
    abbrechen.current = tweenScale(von, SCALE_PRESETS[name], UEBERGANG_MS, (s) => {
      setScale({ ...s, preset: name });
    });
  };

  /** Jede Handbewegung löst das Preset — sonst würde die Beschriftung lügen. */
  const vonHand = (patch: Partial<ScaleSettings>): void => {
    abbrechen.current?.();
    setScale({ ...patch, preset: null });
  };

  return (
    <Panel id="scale" title={t('panel.scale')}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {PRESET_NAMEN.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={scale.preset === name}
              onClick={() => { waehlePreset(name); }}
              className={`rounded border px-2 py-1 ${
                scale.preset === name
                  ? 'border-sky-300/60 bg-sky-400/20'
                  : 'border-white/15 hover:bg-white/10'
              }`}
            >
              {t(`scale.preset.${name}`)}
            </button>
          ))}
        </div>

        <label htmlFor={groesseId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('scale.size')}</span>
            <span className="font-mono tabular-nums">{formatZahl(scale.sizeScale, 1)}×</span>
          </span>
          <input
            id={groesseId}
            type="range"
            min={0} max={1} step={0.001}
            value={groesseZuRegler(scale.sizeScale)}
            onChange={(e) => { vonHand({ sizeScale: reglerZuGroesse(Number(e.target.value)) }); }}
          />
        </label>

        <label htmlFor={abstandId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('scale.distance')}</span>
            <span className="font-mono tabular-nums">{formatZahl(scale.distanceExponent)}</span>
          </span>
          <input
            id={abstandId}
            type="range"
            min={0.35} max={1} step={0.005}
            value={scale.distanceExponent}
            onChange={(e) => { vonHand({ distanceExponent: Number(e.target.value) }); }}
          />
        </label>

        <label htmlFor={sonneId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('scale.sunDamping')}</span>
            <span className="font-mono tabular-nums">{formatZahl(scale.sunDamping)}</span>
          </span>
          <input
            id={sonneId}
            type="range"
            min={0.1} max={1} step={0.01}
            value={scale.sunDamping}
            onChange={(e) => { vonHand({ sunDamping: Number(e.target.value) }); }}
          />
        </label>
      </div>
    </Panel>
  );
}
