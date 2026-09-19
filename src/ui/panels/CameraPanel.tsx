import { useId } from 'react';
import { useStore } from '../../store';
import type { AppState, CameraMode } from '../../store/types';
import { bodyIndex } from '../../data';
import { scaledPositionAt } from '../../sim/scale';
import { letztePose } from '../../render/camera/controller';
import { laenge, minus } from '../../render/camera/flug';
import { flugStarten, heftenUm } from '../steuerung/anwenden';
import { t } from '../i18n';
import { formatZahl } from '../format';
import { Panel } from './Panel';

// Der letzte Modus ist auswählbar, startet den Director aber nicht — das
// tun das Kino-Panel und die Taste C.
const MODI: readonly CameraMode[] = ['free', 'attached', 'follow', 'fly', 'cinema'];

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
  `${formatZahl(km / 1e6)} ${t('unit.millionKm')}`;

/**
 * Im Flug wirken Modus-Schaltflächen, Abstandsregler und Blickwinkel auf das
 * Ziel: Sie beenden den Flug an der gezeigten Lage, geheftet um targetId
 * (Entwurf Flug und Controller §4.5), und setzen dann ihren Wert.
 */
function setzeUmlauf(patch: Partial<AppState['camera']>): void {
  const { camera, setCamera } = useStore.getState();
  if (camera.mode === 'fly') {
    const pose = letztePose();
    if (pose !== null) heftenUm(camera.targetId, pose);
  }
  setCamera(patch);
}

/** Angezeigter Abstand: im Flug der gezeigten Lage zum Ziel, sonst der Kugelabstand. */
function anzeigeAbstand(camera: AppState['camera']): number {
  const pose = camera.mode === 'fly' ? letztePose() : null;
  if (pose === null) return camera.distance;
  const { scale } = useStore.getState();
  return laenge(minus(pose.positionKm, scaledPositionAt(camera.targetId, bodyIndex, pose.jd, scale)));
}

export function CameraPanel(): React.JSX.Element {
  const camera = useStore((s) => s.camera);
  const abstandId = useId();
  const abstand = anzeigeAbstand(camera);

  return (
    <Panel id="camera" title={t('panel.camera')}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {MODI.map((modus) => (
            <button
              key={modus}
              type="button"
              aria-pressed={camera.mode === modus}
              onClick={() => {
                if (modus === 'fly') {
                  // Der Flug beginnt an der gezeigten Lage, wie mit W (§4.5).
                  const pose = letztePose();
                  if (pose !== null) flugStarten(pose);
                  return;
                }
                // Beim Wechsel in den freien Modus wird der Bezugspunkt auf
                // die aktuelle Position des Ziels festgelegt; die beiden
                // mitführenden Modi brauchen keinen.
                setzeUmlauf({
                  mode: modus,
                  freezeJd: modus === 'free' ? useStore.getState().time.jd : null,
                });
              }}
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
            <span className="font-mono tabular-nums">{abstandText(abstand)}</span>
          </span>
          <input
            id={abstandId}
            type="range"
            min={0} max={1} step={0.001}
            value={abstandZuRegler(abstand)}
            onChange={(e) => { setzeUmlauf({ distance: reglerZuAbstand(Number(e.target.value)) }); }}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {BLICKWINKEL.map(([schluessel, azimuth, elevation]) => (
            <button
              key={schluessel}
              type="button"
              onClick={() => { setzeUmlauf({ azimuth, elevation }); }}
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
