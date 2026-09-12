import { useId } from 'react';
import { useStore } from '../../store';
import type { CameraMode } from '../../store/types';
import { t } from '../i18n';
import { Panel } from './Panel';

const MODI: readonly CameraMode[] = ['free', 'attached', 'follow'];

const ABSTAND_MIN_KM = 1e3;
const ABSTAND_MAX_KM = 1e10;

/** Der Abstand reicht über sieben Dekaden — linear wäre er unbedienbar. */
const reglerZuAbstand = (v: number): number =>
  ABSTAND_MIN_KM * (ABSTAND_MAX_KM / ABSTAND_MIN_KM) ** v;
const abstandZuRegler = (km: number): number =>
  Math.log(Math.min(Math.max(km, ABSTAND_MIN_KM), ABSTAND_MAX_KM) / ABSTAND_MIN_KM)
  / Math.log(ABSTAND_MAX_KM / ABSTAND_MIN_KM);

/** Vordefinierte Blickwinkel als Kugelkoordinaten (Azimut, Elevation). */
const BLICKWINKEL: readonly (readonly [string, number, number])[] = [
  ['camera.view.top', 0, Math.PI / 2],
  ['camera.view.side', 0, 0],
  ['camera.view.fromSun', Math.PI, 0.15],
  ['camera.view.toSun', 0, 0.15],
];

const abstandText = (km: number): string =>
  `${(km / 1e6).toLocaleString('de-DE', { maximumFractionDigits: 2 })} Mio. km`;

export function CameraPanel(): React.JSX.Element {
  const camera = useStore((s) => s.camera);
  const setCamera = useStore((s) => s.setCamera);
  const abstandId = useId();

  return (
    <Panel id="camera" title={t('panel.camera')}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {MODI.map((modus) => (
            <button
              key={modus}
              type="button"
              aria-pressed={camera.mode === modus}
              onClick={() => { setCamera({ mode: modus }); }}
              className={`rounded border px-2 py-1 ${
                camera.mode === modus
                  ? 'border-sky-300/60 bg-sky-400/20'
                  : 'border-white/15 hover:bg-white/10'
              }`}
            >
              {t(`camera.mode.${modus}`)}
            </button>
          ))}
        </div>

        <label htmlFor={abstandId} className="flex flex-col gap-1">
          <span className="flex justify-between">
            <span>{t('camera.distance')}</span>
            <span className="font-mono tabular-nums">{abstandText(camera.distance)}</span>
          </span>
          <input
            id={abstandId}
            type="range"
            min={0} max={1} step={0.001}
            value={abstandZuRegler(camera.distance)}
            onChange={(e) => { setCamera({ distance: reglerZuAbstand(Number(e.target.value)) }); }}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {BLICKWINKEL.map(([schluessel, azimuth, elevation]) => (
            <button
              key={schluessel}
              type="button"
              onClick={() => { setCamera({ azimuth, elevation }); }}
              className="rounded border border-white/15 px-2 py-1 hover:bg-white/10"
            >
              {t(schluessel)}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
