import { useStore } from '../../store';
import { TIPP_SCHWELLE_PX, zeigerartVon } from '../treffer';
import type { Zeigerart } from '../treffer';
import { ELEVATION_GRENZE, MIN_DISTANCE_KM, MAX_DISTANCE_KM, begrenze } from './flug';

/** Bildschirmbreite entspricht etwa einer halben Umdrehung. */
const DREH_PRO_PIXEL = Math.PI / 600;

/**
 * Zoomt multiplikativ: Ein Rad-Klick verändert den Abstand immer um denselben
 * Faktor. Nur so fühlt sich der Zoom von der Mondoberfläche bis zur
 * Neptunbahn — über acht Größenordnungen — gleich schnell an.
 */
function zoome(faktor: number): void {
  const { camera, setCamera } = useStore.getState();
  setCamera({ distance: begrenze(camera.distance * faktor, MIN_DISTANCE_KM, MAX_DISTANCE_KM) });
}

function drehe(dx: number, dy: number): void {
  const { camera, setCamera } = useStore.getState();
  setCamera({
    azimuth: camera.azimuth - dx * DREH_PRO_PIXEL,
    elevation: begrenze(
      camera.elevation + dy * DREH_PRO_PIXEL,
      -ELEVATION_GRENZE,
      ELEVATION_GRENZE,
    ),
  });
}

export interface EingabeRueckrufe {
  /** Druck ohne Ziehen und ohne zweiten Zeiger, bei der Maus nur Haupttaste. */
  onTipp?: (x: number, y: number, art: Zeigerart) => void;
  /**
   * Hover ohne gedrückte Taste (nicht bei Berührung). null, sobald ein Druck zum
   * Ziehen wird, ein zweiter Zeiger dazukommt, bei pointercancel, beim Verlassen
   * und beim Druck eines Fingers; ein Maus- oder Stiftdruck allein lässt ihn stehen.
   */
  onZeiger?: (zeiger: { x: number; y: number; art: Zeigerart } | null) => void;
}

interface Druck { startX: number; startY: number; x: number; y: number; art: Zeigerart; zieht: boolean; tippbar: boolean }

/**
 * Verbindet Maus- und Berührungseingaben mit dem Store. Der Controller liest
 * die Werte im nächsten Bild — die Eingabe kennt weder Three.js noch die
 * Kamera selbst. Tippen und Hover gehen über Rückrufe hinaus (Entwurf
 * Klickflächen §5): Gedreht wird erst jenseits der Tippschwelle, dann mit der
 * ganzen Strecke seit dem Druck, damit ein Tipp die Kamera nicht bewegt.
 */
export function attachCameraInput(element: HTMLElement, rueckrufe: EingabeRueckrufe = {}): () => void {
  // Pointer-Ereignisse decken Maus, Stift und Berührung gemeinsam ab.
  const aktive = new Map<number, Druck>();
  let letzterPinchAbstand: number | null = null;

  const pinchAbstand = (): number | null => {
    if (aktive.size < 2) return null;
    const [a, b] = [...aktive.values()];
    if (a === undefined || b === undefined) return null;
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const lokal = (e: PointerEvent): { x: number; y: number } => {
    const r = element.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: PointerEvent): void => {
    aktive.set(e.pointerId, {
      startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY,
      art: zeigerartVon(e.pointerType), zieht: false, tippbar: e.button === 0,
    });
    // Ein zweiter Zeiger macht aus dem Druck eine Geste: kein Tippen mehr, und
    // der verbleibende Finger dreht danach ohne Totzone weiter.
    if (aktive.size >= 2) {
      for (const d of aktive.values()) { d.tippbar = false; d.zieht = true; }
    }
    element.setPointerCapture(e.pointerId);
    letzterPinchAbstand = pinchAbstand();
    // Maus und Stift behalten die Hervorhebung während des Drucks: Ein nur durch
    // Hover gezeigter Name bleibt so bis zum pointerup sichtbar und treffbar.
    // Erst das Ziehen (onPointerMove), eine Geste, ein Abbruch oder das Verlassen
    // löschen sie. Berührung kennt keinen Hover.
    if (aktive.size >= 2 || e.pointerType === 'touch') rueckrufe.onZeiger?.(null);
  };

  const onPointerMove = (e: PointerEvent): void => {
    const d = aktive.get(e.pointerId);
    if (d === undefined) {
      // buttons: Eine außerhalb gedrückte Taste (Regler, Textauswahl) zählt als Druck.
      if (aktive.size === 0 && e.pointerType !== 'touch' && e.buttons === 0) {
        rueckrufe.onZeiger?.({ ...lokal(e), art: zeigerartVon(e.pointerType) });
      }
      return;
    }
    const vorherX = d.x;
    const vorherY = d.y;
    d.x = e.clientX;
    d.y = e.clientY;

    if (aktive.size >= 2) {
      const jetzt = pinchAbstand();
      if (jetzt !== null && letzterPinchAbstand !== null && jetzt > 0) {
        zoome(letzterPinchAbstand / jetzt);
      }
      letzterPinchAbstand = jetzt;
      return;
    }
    if (!d.zieht) {
      if (Math.hypot(d.x - d.startX, d.y - d.startY) <= TIPP_SCHWELLE_PX[d.art]) return;
      d.zieht = true;
      d.tippbar = false;
      // Während des Ziehens gibt es keine Hervorhebung (Entwurf Klickflächen §5).
      rueckrufe.onZeiger?.(null);
      drehe(d.x - d.startX, d.y - d.startY);
      return;
    }
    drehe(d.x - vorherX, d.y - vorherY);
  };

  const beende = (e: PointerEvent, tippenErlaubt: boolean): void => {
    const d = aktive.get(e.pointerId);
    aktive.delete(e.pointerId);
    if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
    letzterPinchAbstand = pinchAbstand();
    if (tippenErlaubt && d !== undefined && d.tippbar && !d.zieht && aktive.size === 0) {
      const p = lokal(e);
      rueckrufe.onTipp?.(p.x, p.y, d.art);
    }
  };
  const onPointerUp = (e: PointerEvent): void => { beende(e, true); };
  const onPointerCancel = (e: PointerEvent): void => {
    beende(e, false);
    rueckrufe.onZeiger?.(null);
  };
  const onPointerLeave = (): void => { rueckrufe.onZeiger?.(null); };

  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    // deltaMode 1 zählt Zeilen statt Pixel (Firefox) — auf Pixel normieren.
    const schritte = (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / 100;
    zoome(1.1 ** schritte);
  };

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerCancel);
  element.addEventListener('pointerleave', onPointerLeave);
  element.addEventListener('wheel', onWheel, { passive: false });
  // Sonst bricht die Browser-Geste (Scrollen, Zoomen) das Ziehen ab.
  element.style.touchAction = 'none';

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointercancel', onPointerCancel);
    element.removeEventListener('pointerleave', onPointerLeave);
    element.removeEventListener('wheel', onWheel);
  };
}
