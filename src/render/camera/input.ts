import { useStore } from '../../store';
import { TIPP_SCHWELLE_PX, zeigerartVon } from '../treffer';
import type { Zeigerart } from '../treffer';
import { bodyIndex } from '../../data/index';
import { ELEVATION_GRENZE, MAX_DISTANCE_KM, begrenze, blickDrehen, himmelDrehen, himmelZoomen, kleinsterAbstand } from './flug';
import { gesteEntscheiden } from './geste';

/** Bildschirmbreite entspricht etwa einer halben Umdrehung. */
const DREH_PRO_PIXEL = Math.PI / 600;

/** Radstufe des Tempofaktors im Flug (Entwurf Flug und Controller §3.4). */
export const TEMPO_JE_RASTE = 1.25;

/**
 * Zoomt multiplikativ: Ein Rad-Klick verändert den Abstand immer um denselben
 * Faktor. Nur so fühlt sich der Zoom von der Mondoberfläche bis zur
 * Neptunbahn — über acht Größenordnungen — gleich schnell an.
 */
function zoome(faktor: number): void {
  const { camera, scale, setCamera } = useStore.getState();
  if (camera.mode === 'geozentrisch') {
    // Himmelsansicht: Zoom ist der Bildwinkel (Entwurf geozentrische Sicht §4.2).
    setCamera({ geo: himmelZoomen(camera.geo, faktor) });
    return;
  }
  const minimum = kleinsterAbstand(bodyIndex[camera.targetId], scale);
  setCamera({ distance: begrenze(camera.distance * faktor, minimum, MAX_DISTANCE_KM) });
}

/** Zoomfaktor je Radraste; Pinch rechnet damit im Flug in Tempo um. */
const ZOOM_JE_RASTE = 1.1;

function drehe(dx: number, dy: number): void {
  const { camera, setCamera } = useStore.getState();
  if (camera.mode === 'fly') {
    // Im Flug schaut Ziehen um (Entwurf Flug und Controller §4.3). Der Himmel
    // folgt der Hand wie in Stellarium: nach rechts gezogen dreht der Blick
    // nach links, nach oben gezogen senkt er sich.
    setCamera({ fly: { ...camera.fly, ...blickDrehen(camera.fly, dx * DREH_PRO_PIXEL, dy * DREH_PRO_PIXEL) } });
    return;
  }
  if (camera.mode === 'geozentrisch') {
    // Wie im Flug folgt der Himmel der Hand, fein nach Bildwinkel (himmelDrehen).
    setCamera({ geo: himmelDrehen(camera.geo, dx * DREH_PRO_PIXEL, dy * DREH_PRO_PIXEL) });
    return;
  }
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
  /** Rad im Flug: Faktor auf das Flugtempo statt Zoom (Entwurf Flug und Controller §4.3). */
  onTempo?: (faktor: number) => void;
  /**
   * Einbettung Schritt 3: Rad oder Ein-Finger-Ziehen im iframe hätte die
   * Kamera bewegt, bewegt stattdessen die Seite (`gesteEntscheiden`). `art`
   * unterscheidet die beiden Hinweistexte.
   */
  onGestenHinweis?: (art: 'rad' | 'touch') => void;
}

interface Druck {
  startX: number; startY: number; x: number; y: number; art: Zeigerart; zieht: boolean; tippbar: boolean;
  /** Einbettung Schritt 3: Diese Geste bewegt die Seite statt der Kamera (ein Finger, kein Pinch). */
  gesperrt: boolean;
}

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
      art: zeigerartVon(e.pointerType), zieht: false, tippbar: e.button === 0, gesperrt: false,
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
      // Begannen beide Finger an derselben Stelle, gäbe der erste Schritt den
      // Faktor 0 und spränge auf den kleinsten Abstand.
      if (jetzt !== null && letzterPinchAbstand !== null && jetzt > 0 && letzterPinchAbstand > 0) {
        const faktor = letzterPinchAbstand / jetzt;
        if (useStore.getState().camera.mode === 'fly') {
          // Wie das Rad im Flug: Auseinanderziehen (Zoom nach vorn) beschleunigt.
          rueckrufe.onTempo?.(TEMPO_JE_RASTE ** (-Math.log(faktor) / Math.log(ZOOM_JE_RASTE)));
        } else {
          zoome(faktor);
        }
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
      // Einbettung Schritt 3: Erst hier (Überschreiten der Tippschwelle) steht
      // fest, dass daraus eine Ziehgeste wird — entscheidet einmal für die
      // ganze Geste, ob sie die Kamera oder (ein Finger, im iframe) die Seite
      // bewegt. Maus und Stift sind für die Regel gleich („nicht touch").
      const entscheidung = gesteEntscheiden({
        art: 'ziehen',
        zeigerart: d.art === 'finger' ? 'touch' : 'maus',
        strgOderCmd: false,
        beruehrungen: aktive.size,
        eingebettet: useStore.getState().ui.eingebettet,
      });
      if (entscheidung !== 'kamera') {
        d.gesperrt = true;
        if (entscheidung === 'seite-mit-hinweis') rueckrufe.onGestenHinweis?.('touch');
        return;
      }
      drehe(d.x - d.startX, d.y - d.startY);
      return;
    }
    // Gesperrt (Einbettung Schritt 3): Die Seite scrollt selbst, hier ist für
    // den Rest dieser Geste nichts mehr zu tun.
    if (d.gesperrt) return;
    drehe(d.x - vorherX, d.y - vorherY);
  };

  const beende = (e: PointerEvent, tippenErlaubt: boolean): void => {
    const d = aktive.get(e.pointerId);
    aktive.delete(e.pointerId);
    if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
    letzterPinchAbstand = pinchAbstand();
    // Einbettung Schritt 3: Sinkt eine Mehrfinger-Geste (Pinch/Drehen) auf einen
    // Finger, entscheidet dieser neu — sonst würde er eingebettet weiterdrehen,
    // obwohl ein einzelner Finger dort die Seite scrollen soll (z. B. „mit zwei
    // Fingern zoomen, einen Finger anheben, mit dem verbleibenden weiterziehen").
    // `hinweisSchonGemeldet` unterdrückt dabei einen zweiten Hinweis.
    if (aktive.size === 1) {
      const [rest] = [...aktive.values()];
      if (rest !== undefined && rest.art === 'finger' && rest.zieht) {
        const entscheidung = gesteEntscheiden({
          art: 'ziehen',
          zeigerart: 'touch',
          strgOderCmd: false,
          beruehrungen: 1,
          eingebettet: useStore.getState().ui.eingebettet,
          hinweisSchonGemeldet: true,
        });
        rest.gesperrt = entscheidung !== 'kamera';
      }
    }
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
    // Einbettung Schritt 3: Ein einfaches Rad (ohne Strg/⌘) soll im iframe die
    // fremde Seite scrollen lassen — dafür darf hier kein preventDefault
    // stehen, sonst bräche der Seitenscroll ab.
    const entscheidung = gesteEntscheiden({
      art: 'rad',
      zeigerart: 'maus',
      strgOderCmd: e.ctrlKey || e.metaKey,
      beruehrungen: 1,
      eingebettet: useStore.getState().ui.eingebettet,
    });
    if (entscheidung !== 'kamera') {
      rueckrufe.onGestenHinweis?.('rad');
      return;
    }
    e.preventDefault();
    // deltaMode 1 zählt Zeilen statt Pixel (Firefox) — auf Pixel normieren.
    const schritte = (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / 100;
    if (useStore.getState().camera.mode === 'fly') {
      // Eine Raste nach unten (beim Zoom „weiter weg") verlangsamt.
      rueckrufe.onTempo?.(TEMPO_JE_RASTE ** -schritte);
      return;
    }
    zoome(ZOOM_JE_RASTE ** schritte);
  };

  // Einbettung Schritt 3: `ui.eingebettet` ändert sich nach dem Start nicht
  // (anders als bei Rad und Ziehen oben deshalb hier einmal beim Anhängen
  // gelesen statt bei jedem Ereignis).
  const eingebettetBeimStart = useStore.getState().ui.eingebettet;

  // Nicht passiv: Bei zwei oder mehr Fingern (Drehen/Zoomen der Kamera) soll
  // die Seite selbst nicht mitscrollen — touchAction allein (unten) erlaubt
  // dafür pan-x/pan-y auch bei mehreren Fingern.
  const onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length >= 2) e.preventDefault();
  };

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerCancel);
  element.addEventListener('pointerleave', onPointerLeave);
  element.addEventListener('wheel', onWheel, { passive: false });
  if (eingebettetBeimStart) element.addEventListener('touchmove', onTouchMove, { passive: false });
  // Sonst bricht die Browser-Geste (Scrollen, Zoomen) das Ziehen ab. Im
  // iframe (Einbettung Schritt 3) lässt pan-x pan-y die Seite unter einem
  // ziehenden Finger scrollen; die Kamera bewegt sich dort stattdessen über
  // Rad+Strg/⌘, Ziehen mit Maus/Stift oder zwei Finger.
  element.style.touchAction = eingebettetBeimStart ? 'pan-x pan-y' : 'none';

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointercancel', onPointerCancel);
    element.removeEventListener('pointerleave', onPointerLeave);
    element.removeEventListener('wheel', onWheel);
    if (eingebettetBeimStart) element.removeEventListener('touchmove', onTouchMove);
  };
}
