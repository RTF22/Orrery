import { useStore } from '../../store';

/** Knapp unter dem Pol, damit die Ansicht nicht umklappt. */
const ELEVATION_GRENZE = Math.PI / 2 - 0.01;
const MIN_DISTANCE_KM = 1e2;
const MAX_DISTANCE_KM = 1e13;
/** Bildschirmbreite entspricht etwa einer halben Umdrehung. */
const DREH_PRO_PIXEL = Math.PI / 600;

const begrenze = (wert: number, min: number, max: number): number =>
  Math.min(Math.max(wert, min), max);

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

/**
 * Verbindet Maus- und Berührungseingaben mit dem Store. Der Controller liest
 * die Werte im nächsten Bild — die Eingabe kennt weder Three.js noch die
 * Kamera selbst.
 */
export function attachCameraInput(element: HTMLElement): () => void {
  // Pointer-Ereignisse decken Maus, Stift und Berührung gemeinsam ab.
  const aktive = new Map<number, { x: number; y: number }>();
  let letzterPinchAbstand: number | null = null;

  const pinchAbstand = (): number | null => {
    if (aktive.size < 2) return null;
    const [a, b] = [...aktive.values()];
    if (a === undefined || b === undefined) return null;
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = (e: PointerEvent): void => {
    aktive.set(e.pointerId, { x: e.clientX, y: e.clientY });
    element.setPointerCapture(e.pointerId);
    letzterPinchAbstand = pinchAbstand();
  };

  const onPointerMove = (e: PointerEvent): void => {
    const vorher = aktive.get(e.pointerId);
    if (vorher === undefined) return;
    aktive.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (aktive.size >= 2) {
      const jetzt = pinchAbstand();
      if (jetzt !== null && letzterPinchAbstand !== null && jetzt > 0) {
        zoome(letzterPinchAbstand / jetzt);
      }
      letzterPinchAbstand = jetzt;
      return;
    }
    drehe(e.clientX - vorher.x, e.clientY - vorher.y);
  };

  const onPointerUp = (e: PointerEvent): void => {
    aktive.delete(e.pointerId);
    if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
    letzterPinchAbstand = pinchAbstand();
  };

  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    // deltaMode 1 zählt Zeilen statt Pixel (Firefox) — auf Pixel normieren.
    const schritte = (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / 100;
    zoome(1.1 ** schritte);
  };

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerUp);
  element.addEventListener('wheel', onWheel, { passive: false });
  // Sonst bricht die Browser-Geste (Scrollen, Zoomen) das Ziehen ab.
  element.style.touchAction = 'none';

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointercancel', onPointerUp);
    element.removeEventListener('wheel', onWheel);
  };
}
