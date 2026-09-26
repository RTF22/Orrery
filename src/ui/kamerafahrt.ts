import { useStore } from '../store';
import { bodyIndex } from '../data';
import { scaledPositionAt, FOKUS_FAKTOR, FOKUS_MIN_KM, fokusAbstand } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';
import { systemRadiusKm } from '../render/camera/cinema';
import { KAMERA_FOV_GRAD } from '../render/renderer';
import { easeInOutCubic } from './tween';
import { cinemaAktiv, stopCinema } from './cinemaControl';
import { SYSTEM_THEMA } from '../data/themen';
import { letztePose } from '../render/camera/controller';
import { kugelUm } from '../render/camera/flug';
import type { GezeigtePose } from '../render/camera/flug';

// FOKUS_FAKTOR, FOKUS_MIN_KM und fokusAbstand stehen in sim/scale.ts (dort
// auch von store/deeplink.ts genutzt); hier nur durchgereicht, damit
// bestehende Importe aus diesem Modul unverändert bleiben.
export { FOKUS_FAKTOR, FOKUS_MIN_KM, fokusAbstand };

/** Dauer der Fahrt (Entwurf 4c §5.3). */
export const FAHRT_MS = 1500;
/** Rand um die Bahn des äußersten Planeten in der Draufsicht aufs ganze System. */
export const SYSTEM_RAND = 1.15;
/** Blick senkrecht von oben, wie „Draufsicht" im Kamera-Panel. */
export const DRAUFSICHT_ELEVATION = Math.PI / 2;

/**
 * Abstand, aus dem die Bahn des äußersten Planeten samt Rand ganz ins Bild
 * passt. Das Sichtfeld ist vertikal; im Hochformat begrenzt die Breite. Der
 * Abstand der Kinoszene `systemblick` (1,6 Systemradien) schnitt Uranus- und
 * Neptunbahn am Bildrand ab.
 */
export function systemAbstand(jd: number, scale: ScaleSettings, seitenverhaeltnis: number): number {
  const halbesSichtfeld = Math.tan((KAMERA_FOV_GRAD * Math.PI) / 360);
  const seiten = Number.isFinite(seitenverhaeltnis) && seitenverhaeltnis > 0 ? seitenverhaeltnis : 1;
  return (systemRadiusKm(jd, scale) * SYSTEM_RAND) / (halbesSichtfeld * Math.min(1, seiten));
}

/** Zeitquelle und Bildplanung sind austauschbar, damit die Fahrt ohne Timer prüfbar ist. */
export interface FahrtOptionen {
  dauerMs?: number;
  jetzt?: () => number;
  anfordern?: (schritt: () => void) => number;
  abbrechen?: (kennung: number) => void;
  /** Gezeigte Lage, an der eine Fahrt aus dem Flug beginnt; Standard letztePose(). */
  pose?: () => GezeigtePose | null;
}

/** Diese Ereignisse beenden eine laufende Fahrt; pointermove bewusst nicht. */
const ABBRUCH_EREIGNISSE = ['pointerdown', 'wheel', 'keydown'] as const;

let laufend: (() => void) | null = null;

export function fahrtLaeuft(): boolean {
  return laufend !== null;
}

export function fahrtAbbrechen(): void {
  laufend?.();
}

/**
 * Fährt die Kamera in FAHRT_MS zum Körper: Das Ziel wird sofort gesetzt
 * (die Bahn führt sonst am Ziel vorbei), der Abstand gleitet logarithmisch
 * mit easeInOutCubic, Azimut und Elevation bleiben. Eine Nutzereingabe
 * bricht ab, ein weiterer Aufruf ersetzt die laufende Fahrt, ein laufendes
 * Kino wird zuerst beendet. Der Objektbaum und die Verweise in den Texten
 * nutzen dieselbe Funktion (Entwurf 4c §5.3). Die Kamera wechselt in den
 * Modus Geheftet. Ein gewähltes Thema verfällt, auch wenn das Ziel gleich
 * bleibt: Der Klick auf die Sonne nach der Systemansicht zeigt den
 * Sonnentext.
 */
export function fahreZu(id: string, optionen: FahrtOptionen = {}): void {
  const body = bodyIndex[id];
  if (body === undefined) return;
  fahre(id, (_jd, scale) => fokusAbstand(body, scale), null, null, optionen);
}

/**
 * Draufsicht auf das ganze Sonnensystem für die Wurzelzeile des Objektbaums:
 * Ziel Sonne, Abstand nach `systemAbstand`, die Elevation gleitet mit dem
 * Abstand in den Blick von oben. Sonst wie `fahreZu`. Das Infopanel zeigt
 * danach das Thema Sonnensystem (Entwurf 4c §3.3, Nachtrag 4c-4).
 */
export function fahreZuSystem(optionen: FahrtOptionen = {}): void {
  // Die Canvas füllt das Fenster, ihr Seitenverhältnis ist das des Fensters.
  const seiten = typeof window === 'undefined' ? 1 : window.innerWidth / Math.max(window.innerHeight, 1);
  fahre('sun', (jd, scale) => systemAbstand(jd, scale, seiten), DRAUFSICHT_ELEVATION, SYSTEM_THEMA, optionen);
}

function fahre(
  id: string,
  zielAbstand: (jd: number, scale: ScaleSettings) => number,
  zielElevation: number | null,
  thema: string | null,
  optionen: FahrtOptionen,
): void {
  fahrtAbbrechen();

  const dauer = optionen.dauerMs ?? FAHRT_MS;
  const jetzt = optionen.jetzt ?? (() => performance.now());
  // Rückfall auf setTimeout für Umgebungen ohne requestAnimationFrame (jsdom
  // ohne pretendToBeVisual); im Browser läuft immer die Bildplanung.
  const hatRaf = typeof requestAnimationFrame === 'function';
  const anfordern = optionen.anfordern
    ?? ((schritt) => (hatRaf ? requestAnimationFrame(schritt) : Number(setTimeout(schritt, 16))));
  const abbrechen = optionen.abbrechen
    ?? ((kennung) => { if (hatRaf) cancelAnimationFrame(kennung); else clearTimeout(kennung); });

  // Auch ein nur angehaltenes Kino: Der Klick hat es mit seinem pointerdown
  // schon angehalten, bevor er hier ankommt.
  if (cinemaAktiv()) stopCinema();
  const { camera, scale, time } = useStore.getState();
  // Aus dem Flug gelten Abstand und Winkel der gezeigten Lage relativ zum
  // neuen Ziel; camera.distance stammt dort von vor dem Flug (Entwurf Flug und
  // Controller §4.5). Sonst beginnt die Fahrt wie bisher bei den Kugelwerten.
  const pose = camera.mode === 'fly' ? (optionen.pose ?? letztePose)() : null;
  const start = pose === null
    ? { distance: camera.distance, azimuth: camera.azimuth, elevation: camera.elevation }
    : kugelUm(pose.positionKm, scaledPositionAt(id, bodyIndex, pose.jd, scale));
  const von = start.distance;
  const nach = zielAbstand(time.jd, scale);
  const elevationVon = start.elevation;
  // Jede Fahrt endet geheftet: Im freien Modus zielte sie auf die eingefrorene
  // Stelle, von der der Körper bei laufender Uhr schon wegzog (Entwurf
  // Klickflächen §6, Entscheidung Jens 15.09.2026).
  // Ziel und Thema in einem Zug: Der Themenverfall verwirft ein Thema nur, wenn
  // die Grundlage wechselt und das Thema dabei gleich bleibt (ui/info/themaVerfall.ts).
  useStore.setState((s) => ({
    camera: {
      ...s.camera, targetId: id, mode: 'attached', freezeJd: null,
      distance: von, azimuth: start.azimuth, elevation: elevationVon,
    },
    ui: { ...s.ui, info: { ...s.ui.info, thema } },
  }));

  const startZeit = jetzt();
  let kennung = 0;
  let aktiv = true;

  const beenden = (): void => {
    aktiv = false;
    laufend = null;
    abbrechen(kennung);
    if (typeof window !== 'undefined') {
      for (const name of ABBRUCH_EREIGNISSE) window.removeEventListener(name, beenden);
    }
  };

  const schritt = (): void => {
    if (!aktiv) return;
    const t = Math.min((jetzt() - startZeit) / dauer, 1);
    const k = easeInOutCubic(t);
    useStore.getState().setCamera({
      distance: von * Math.pow(nach / von, k),
      ...(zielElevation === null ? {} : { elevation: elevationVon + (zielElevation - elevationVon) * k }),
    });
    if (t < 1) kennung = anfordern(schritt);
    else beenden();
  };

  laufend = beenden;
  if (typeof window !== 'undefined') {
    for (const name of ABBRUCH_EREIGNISSE) window.addEventListener(name, beenden, { passive: true });
  }
  kennung = anfordern(schritt);
}
