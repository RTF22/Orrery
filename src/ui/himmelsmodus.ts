import { useStore } from '../store';
import { bodyIndex } from '../data';
import { geozentrischeRichtung, richtungZuWinkeln } from '../sim/geozentrisch';
import { positionAt } from '../sim/orbit';
import { fokusAbstand, scaledPositionAt } from '../sim/scale';
import { himmelDrehen, himmelZoomen, kugelUm } from '../render/camera/flug';
import type { Absicht } from '../render/camera/flug';
import { letztePose } from '../render/camera/controller';
import { cinemaAktiv, stopCinema } from './cinemaControl';

/**
 * Bedienung der Himmelsansicht (Entwurf geozentrische Sicht §4, §10 Punkt 5
 * und 7). Importiert bewusst weder ui/kamerafahrt.ts noch
 * ui/steuerung/anwenden.ts — beide rufen umgekehrt hierher.
 */

/** Schwenken mit Tasten oder Stick bei 50° Bildwinkel, rad/s. */
export const HIMMEL_SCHWENK_JE_S = Math.PI / 4;
/** Zoomen mit Q/E oder RT/LT: Faktor je Sekunde auf den Bildwinkel. */
export const HIMMEL_ZOOM_JE_S = 2;

/** Startblick: auf das Ziel, wenn es weder Erde noch Sonne ist, sonst zur Gegensonne. */
function startBlick(targetId: string, jd: number): { yaw: number; pitch: number } {
  if (targetId !== 'earth' && targetId !== 'sun' && Object.hasOwn(bodyIndex, targetId)) {
    return richtungZuWinkeln(geozentrischeRichtung(targetId, bodyIndex, jd));
  }
  // Gegensonne: die Richtung Sonne → Erde, also die heliozentrische Erdlage.
  return richtungZuWinkeln(positionAt('earth', bodyIndex, jd));
}

export function himmelStarten(): void {
  // Das Kino zuerst: stopCinema stellt die Kamera von vor dem Start her.
  if (cinemaAktiv()) stopCinema();
  const { camera, time, setCamera } = useStore.getState();
  if (camera.mode === 'geozentrisch') return;
  setCamera({ mode: 'geozentrisch', geo: { ...camera.geo, ...startBlick(camera.targetId, time.jd) } });
}

/**
 * Verlassen: Ziel Erde (oder noch kein gezeigtes Bild) → geheftet im
 * Fokusabstand; sonst geheftet um das Ziel an der gezeigten Lage wie
 * heftenUm (ui/steuerung/anwenden.ts) — die Kamera bleibt im Erdmittelpunkt,
 * nur der eigene Maßstab kehrt zurück.
 */
export function himmelVerlassen(): void {
  const { camera, scale, setCamera } = useStore.getState();
  if (camera.mode !== 'geozentrisch') return;
  const ziel = bodyIndex[camera.targetId] ?? bodyIndex.earth!;
  const pose = letztePose();
  if (ziel.id === 'earth' || pose === null) {
    setCamera({ mode: 'attached', targetId: ziel.id, freezeJd: null, distance: fokusAbstand(ziel, scale) });
    return;
  }
  setCamera({
    mode: 'attached', targetId: ziel.id, freezeJd: null,
    ...kugelUm(pose.positionKm, scaledPositionAt(ziel.id, bodyIndex, pose.jd, scale)),
  });
}

export function himmelUmschalten(): void {
  if (useStore.getState().camera.mode === 'geozentrisch') himmelVerlassen();
  else himmelStarten();
}

/** Klick, Objektbaum, Textverweis und Pad-A im Himmelsmodus: Blick auf den Körper statt Fahrt. */
export function himmelAusrichten(id: string): void {
  // Ziel und Thema in einem Zug wie fahreZu (ui/info/themaVerfall.ts).
  useStore.setState((s) => ({
    camera: {
      ...s.camera, targetId: id,
      geo: { ...s.camera.geo, ...richtungZuWinkeln(geozentrischeRichtung(id, bodyIndex, s.time.jd)) },
    },
    ui: { ...s.ui, info: { ...s.ui.info, thema: null } },
  }));
}

/**
 * Ein Bild Tasten oder Stick (Entwurf §10 Punkt 5): `seit` schwenkt (rechts
 * senkt yaw wie rechtsVektor in flug.ts), `vor` hebt den Blick, `hoch` zoomt
 * hinein.
 */
export function himmelSchwenken(dt: number, absicht: Absicht): void {
  const { camera, setCamera } = useStore.getState();
  const gedreht = himmelDrehen(
    camera.geo, -absicht.seit * HIMMEL_SCHWENK_JE_S * dt, absicht.vor * HIMMEL_SCHWENK_JE_S * dt,
  );
  setCamera({ geo: himmelZoomen(gedreht, HIMMEL_ZOOM_JE_S ** (-absicht.hoch * dt)) });
}
