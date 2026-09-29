// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { attachCameraInput } from './input';
import { useStore, DEFAULT_STATE } from '../../store';
import { bodyIndex } from '../../data';
import { scaledRadius } from '../../sim/scale';
import { MINDESTABSTAND_RADIEN } from './flug';

const DREH = Math.PI / 600;

function zeiger(
  el: HTMLElement, typ: string, x: number, y: number, id = 1, art = 'mouse', button = 0, buttons = 0,
): void {
  const e = new MouseEvent(typ, { clientX: x, clientY: y, button, buttons, bubbles: true });
  Object.defineProperties(e, { pointerId: { value: id }, pointerType: { value: art } });
  el.dispatchEvent(e);
}

function flaeche(): HTMLElement {
  const el = document.createElement('div');
  el.setPointerCapture = vi.fn();
  el.releasePointerCapture = vi.fn();
  el.hasPointerCapture = () => false;
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('attachCameraInput — Tippen und Ziehen', () => {
  it('meldet ein Tippen unter der Schwelle genau einmal und dreht nicht', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 103, 100);
    zeiger(el, 'pointerup', 103, 100);
    expect(onTipp).toHaveBeenCalledTimes(1);
    expect(onTipp).toHaveBeenCalledWith(103, 100, 'maus');
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    stop();
  });

  it('dreht über der Schwelle mit der ganzen Strecke und meldet kein Tippen', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 103, 100);
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    zeiger(el, 'pointermove', 110, 100);
    expect(useStore.getState().camera.azimuth).toBeCloseTo(azimut - 10 * DREH, 12);
    zeiger(el, 'pointermove', 112, 100);
    expect(useStore.getState().camera.azimuth).toBeCloseTo(azimut - 12 * DREH, 12);
    zeiger(el, 'pointerup', 112, 100);
    expect(onTipp).not.toHaveBeenCalled();
    stop();
  });

  it('wertet beim Finger die größere Schwelle', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointermove', 108, 100, 1, 'touch');
    zeiger(el, 'pointerup', 108, 100, 1, 'touch');
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    expect(onTipp).toHaveBeenCalledWith(108, 100, 'finger');
    stop();
  });

  it('meldet kein Tippen, wenn ein zweiter Finger dazukam', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 200, 100, 2, 'touch');
    zeiger(el, 'pointerup', 200, 100, 2, 'touch');
    zeiger(el, 'pointerup', 100, 100, 1, 'touch');
    expect(onTipp).not.toHaveBeenCalled();
    stop();
  });

  it('meldet bei rechter Maustaste und bei pointercancel kein Tippen', () => {
    const el = flaeche();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onTipp });
    zeiger(el, 'pointerdown', 100, 100, 1, 'mouse', 2);
    zeiger(el, 'pointerup', 100, 100, 1, 'mouse', 2);
    zeiger(el, 'pointerdown', 100, 100, 3, 'touch');
    zeiger(el, 'pointercancel', 100, 100, 3, 'touch');
    expect(onTipp).not.toHaveBeenCalled();
    stop();
  });

  it('arbeitet ohne Rückrufe', () => {
    const el = flaeche();
    const stop = attachCameraInput(el);
    expect(() => {
      zeiger(el, 'pointermove', 10, 10);
      zeiger(el, 'pointerdown', 10, 10);
      zeiger(el, 'pointerup', 10, 10);
      zeiger(el, 'pointerleave', 10, 10);
    }).not.toThrow();
    stop();
  });
});

describe('attachCameraInput — Hover', () => {
  it('meldet den Zeiger nur ohne Druck und nicht bei Berührung', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointermove', 50, 60);
    expect(onZeiger).toHaveBeenLastCalledWith({ x: 50, y: 60, art: 'maus' });
    onZeiger.mockClear();
    zeiger(el, 'pointermove', 50, 60, 2, 'touch');
    expect(onZeiger).not.toHaveBeenCalled();
    // Maus: Die Hervorhebung bleibt während des Drucks stehen, erst das Ziehen löscht sie.
    zeiger(el, 'pointerdown', 50, 60);
    expect(onZeiger).not.toHaveBeenCalled();
    zeiger(el, 'pointermove', 70, 60);
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    zeiger(el, 'pointerup', 70, 60);
    // Berührung: kein Hover, der Druck meldet null wie bisher.
    onZeiger.mockClear();
    zeiger(el, 'pointerdown', 50, 60, 3, 'touch');
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    stop();
  });

  it('lässt die Hervorhebung bei einem Maus- oder Stiftdruck ohne Bewegung stehen', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointermove', 50, 60);
    onZeiger.mockClear();
    zeiger(el, 'pointerdown', 50, 60);
    zeiger(el, 'pointermove', 53, 60);
    zeiger(el, 'pointerup', 53, 60);
    zeiger(el, 'pointerdown', 50, 60, 4, 'pen');
    zeiger(el, 'pointerup', 50, 60, 4, 'pen');
    expect(onZeiger).not.toHaveBeenCalledWith(null);
    stop();
  });

  it('meldet null, sobald der Druck die Tippschwelle überschreitet', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointerdown', 50, 60);
    zeiger(el, 'pointermove', 54, 60);
    expect(onZeiger).not.toHaveBeenCalled();
    zeiger(el, 'pointermove', 55, 60);
    expect(onZeiger).toHaveBeenCalledTimes(1);
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    stop();
  });

  it('meldet null, wenn ein zweiter Zeiger dazukommt', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointerdown', 50, 60);
    expect(onZeiger).not.toHaveBeenCalled();
    zeiger(el, 'pointerdown', 150, 60, 2, 'pen');
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    stop();
  });

  it('meldet bei pointercancel null', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointerdown', 50, 60);
    onZeiger.mockClear();
    zeiger(el, 'pointercancel', 50, 60);
    expect(onZeiger).toHaveBeenCalledTimes(1);
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    stop();
  });

  it('meldet keinen Hover bei gedrückter Taste, die außerhalb der Fläche gedrückt wurde', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointermove', 50, 60, 1, 'mouse', 0, 1);
    expect(onZeiger).not.toHaveBeenCalled();
    zeiger(el, 'pointermove', 52, 60, 1, 'mouse', 0, 0);
    expect(onZeiger).toHaveBeenLastCalledWith({ x: 52, y: 60, art: 'maus' });
    stop();
  });

  it('meldet beim Verlassen null', () => {
    const el = flaeche();
    const onZeiger = vi.fn();
    const stop = attachCameraInput(el, { onZeiger });
    zeiger(el, 'pointermove', 50, 60);
    zeiger(el, 'pointerleave', 50, 60);
    expect(onZeiger).toHaveBeenLastCalledWith(null);
    stop();
  });
});

describe('attachCameraInput — Koordinaten', () => {
  it('rechnet clientX/Y in Canvas-Koordinaten mit versetztem Rechteck um', () => {
    const el = flaeche();
    el.getBoundingClientRect = () => ({
      left: 30, top: 50, right: 130, bottom: 150,
      width: 100, height: 100, x: 30, y: 50,
      toJSON: () => ({ left: 30, top: 50, right: 130, bottom: 150, width: 100, height: 100, x: 30, y: 50 }),
    } as DOMRect);
    const onZeiger = vi.fn();
    const onTipp = vi.fn();
    const stop = attachCameraInput(el, { onZeiger, onTipp });
    zeiger(el, 'pointermove', 130, 250);
    expect(onZeiger).toHaveBeenLastCalledWith({ x: 100, y: 200, art: 'maus' });
    onZeiger.mockClear();
    zeiger(el, 'pointerdown', 130, 250);
    zeiger(el, 'pointerup', 130, 250);
    expect(onTipp).toHaveBeenCalledWith(100, 200, 'maus');
    stop();
  });
});

describe('attachCameraInput — Einbettung (Gestenregel Schritt 3)', () => {
  const einbetten = (): void => { useStore.getState().setUi({ eingebettet: true }); };

  it('setzt touchAction je nach Einbettung beim Anhängen', () => {
    const elFrei = flaeche();
    const stopFrei = attachCameraInput(elFrei);
    expect(elFrei.style.touchAction).toBe('none');
    stopFrei();

    einbetten();
    const elEingebettet = flaeche();
    const stopEingebettet = attachCameraInput(elEingebettet);
    expect(elEingebettet.style.touchAction).toBe('pan-x pan-y');
    stopEingebettet();
  });

  it('Rad ohne Strg/⌘ eingebettet: Abstand unverändert, kein preventDefault, Hinweis „rad"', () => {
    einbetten();
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    const abstand = useStore.getState().camera.distance;
    const e = new WheelEvent('wheel', { deltaY: 100, cancelable: true });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
    expect(useStore.getState().camera.distance).toBe(abstand);
    expect(onGestenHinweis).toHaveBeenCalledWith('rad');
    stop();
  });

  it('Rad mit Strg eingebettet: Abstand ändert sich, kein Hinweis', () => {
    einbetten();
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    const abstand = useStore.getState().camera.distance;
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true, ctrlKey: true }));
    expect(useStore.getState().camera.distance).not.toBe(abstand);
    expect(onGestenHinweis).not.toHaveBeenCalled();
    stop();
  });

  it('Rad mit ⌘ (metaKey) eingebettet zoomt ebenfalls', () => {
    einbetten();
    const el = flaeche();
    const stop = attachCameraInput(el);
    const abstand = useStore.getState().camera.distance;
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true, metaKey: true }));
    expect(useStore.getState().camera.distance).not.toBe(abstand);
    stop();
  });

  it('Rad nicht eingebettet: wie heute, unabhängig von Strg', () => {
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    const abstand = useStore.getState().camera.distance;
    const e = new WheelEvent('wheel', { deltaY: 100, cancelable: true });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(useStore.getState().camera.distance).not.toBe(abstand);
    expect(onGestenHinweis).not.toHaveBeenCalled();
    stop();
  });

  it('ein Finger zieht eingebettet: dreht nicht, meldet den Hinweis „touch" nur einmal je Geste', () => {
    einbetten();
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointermove', 115, 100, 1, 'touch');
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    expect(onGestenHinweis).toHaveBeenCalledTimes(1);
    expect(onGestenHinweis).toHaveBeenCalledWith('touch');
    // Weiteres Ziehen desselben Fingers: immer noch keine Drehung, kein
    // weiterer Hinweisaufruf (einmal je Geste).
    zeiger(el, 'pointermove', 130, 130, 1, 'touch');
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    expect(onGestenHinweis).toHaveBeenCalledTimes(1);
    zeiger(el, 'pointerup', 130, 130, 1, 'touch');
    stop();
  });

  it('zwei Finger drehen/zoomen eingebettet weiter wie heute, ohne Hinweis', () => {
    einbetten();
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    const abstand = useStore.getState().camera.distance;
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 200, 100, 2, 'touch');
    zeiger(el, 'pointermove', 90, 100, 1, 'touch');
    zeiger(el, 'pointermove', 210, 100, 2, 'touch');
    expect(useStore.getState().camera.distance).not.toBe(abstand);
    expect(onGestenHinweis).not.toHaveBeenCalled();
    zeiger(el, 'pointerup', 90, 100, 1, 'touch');
    zeiger(el, 'pointerup', 210, 100, 2, 'touch');
    stop();
  });

  it('eingebettet: hebt nach Zwei-Finger-Zoom ein Finger ab, dreht der verbleibende nicht mehr, ohne Hinweis', () => {
    einbetten();
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 200, 100, 2, 'touch');
    zeiger(el, 'pointermove', 90, 100, 1, 'touch');
    zeiger(el, 'pointermove', 210, 100, 2, 'touch');
    // Finger 2 hebt ab, Finger 1 zieht als einziger weiter.
    zeiger(el, 'pointerup', 210, 100, 2, 'touch');
    const azimutNachAbheben = useStore.getState().camera.azimuth;
    const abstandNachAbheben = useStore.getState().camera.distance;
    zeiger(el, 'pointermove', 150, 100, 1, 'touch');
    zeiger(el, 'pointermove', 200, 150, 1, 'touch');
    expect(useStore.getState().camera.azimuth).toBe(azimutNachAbheben);
    expect(useStore.getState().camera.distance).toBe(abstandNachAbheben);
    expect(onGestenHinweis).not.toHaveBeenCalled();
    zeiger(el, 'pointerup', 200, 150, 1, 'touch');
    stop();
  });

  it('eingebettet: kommt nach dem Abheben wieder ein zweiter Finger dazu, gilt wieder die Zwei-Finger-Regel', () => {
    einbetten();
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 200, 100, 2, 'touch');
    zeiger(el, 'pointermove', 90, 100, 1, 'touch');
    zeiger(el, 'pointermove', 210, 100, 2, 'touch');
    zeiger(el, 'pointerup', 210, 100, 2, 'touch');
    // Verbleibender Finger ist gesperrt (siehe Test oben).
    zeiger(el, 'pointermove', 150, 100, 1, 'touch');
    const abstandGesperrt = useStore.getState().camera.distance;
    // Ein neuer zweiter Finger kommt dazu: Zwei-Finger-Regel gilt wieder.
    zeiger(el, 'pointerdown', 250, 100, 3, 'touch');
    zeiger(el, 'pointermove', 140, 100, 1, 'touch');
    zeiger(el, 'pointermove', 260, 100, 3, 'touch');
    expect(useStore.getState().camera.distance).not.toBe(abstandGesperrt);
    expect(onGestenHinweis).not.toHaveBeenCalled();
    zeiger(el, 'pointerup', 140, 100, 1, 'touch');
    zeiger(el, 'pointerup', 260, 100, 3, 'touch');
    stop();
  });

  it('nicht eingebettet: hebt nach Zwei-Finger-Geste ein Finger ab, dreht der verbleibende weiter (heutiges Verhalten)', () => {
    const el = flaeche();
    const stop = attachCameraInput(el);
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 200, 100, 2, 'touch');
    zeiger(el, 'pointermove', 90, 100, 1, 'touch');
    zeiger(el, 'pointermove', 210, 100, 2, 'touch');
    zeiger(el, 'pointerup', 210, 100, 2, 'touch');
    const azimutVorWeiterzug = useStore.getState().camera.azimuth;
    zeiger(el, 'pointermove', 150, 100, 1, 'touch');
    expect(useStore.getState().camera.azimuth).not.toBe(azimutVorWeiterzug);
    zeiger(el, 'pointerup', 150, 100, 1, 'touch');
    stop();
  });

  it('Maus- oder Stift-Ziehen dreht eingebettet weiter wie heute, ohne Hinweis', () => {
    einbetten();
    const el = flaeche();
    const onGestenHinweis = vi.fn();
    const stop = attachCameraInput(el, { onGestenHinweis });
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 120, 100);
    expect(useStore.getState().camera.azimuth).not.toBe(azimut);
    expect(onGestenHinweis).not.toHaveBeenCalled();
    zeiger(el, 'pointerup', 120, 100);
    stop();
  });

  it('nicht passiver touchmove-Lauscher verhindert bei zwei Fingern das Scrollen der Seite, nur eingebettet', () => {
    einbetten();
    const el = flaeche();
    const stop = attachCameraInput(el);
    const e = new TouchEvent('touchmove', { touches: [{} as Touch, {} as Touch], cancelable: true });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    stop();
  });
});

describe('attachCameraInput — Flug', () => {
  const imFlug = (): void => {
    useStore.getState().setCamera({ mode: 'fly', fly: { ...DEFAULT_STATE.camera.fly, yaw: 0, pitch: 0 } });
  };

  it('schaut im Flug beim Ziehen um; der Himmel folgt der Hand', () => {
    imFlug();
    const el = flaeche();
    const stop = attachCameraInput(el);
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 120, 90);
    const { camera } = useStore.getState();
    // Nach rechts gezogen: Blick nach links (yaw wächst); nach oben: Blick sinkt.
    expect(camera.fly.yaw).toBeCloseTo(20 * DREH, 12);
    expect(camera.fly.pitch).toBeCloseTo(-10 * DREH, 12);
    expect(camera.azimuth).toBe(azimut);
    zeiger(el, 'pointerup', 120, 90);
    stop();
  });

  it('ändert im Flug mit dem Rad das Tempo statt des Abstands', () => {
    imFlug();
    const el = flaeche();
    const onTempo = vi.fn();
    const stop = attachCameraInput(el, { onTempo });
    const abstand = useStore.getState().camera.distance;
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }));
    expect(onTempo.mock.calls[0]![0]).toBeCloseTo(1 / 1.25, 12);
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: -200, cancelable: true }));
    expect(onTempo.mock.calls[1]![0]).toBeCloseTo(1.25 ** 2, 12);
    expect(useStore.getState().camera.distance).toBe(abstand);
    stop();
  });

  it('zoomt außerhalb des Flugs wie bisher', () => {
    const el = flaeche();
    const onTempo = vi.fn();
    const stop = attachCameraInput(el, { onTempo });
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }));
    expect(onTempo).not.toHaveBeenCalled();
    expect(useStore.getState().camera.distance).toBeCloseTo(DEFAULT_STATE.camera.distance * 1.1, 0);
    stop();
  });
});

describe('attachCameraInput — Mindestabstand und Pinch', () => {
  const erdnah = (): void => {
    useStore.getState().setCamera({ mode: 'attached', targetId: 'earth', distance: 1e5 });
  };
  const erdGrenze = (): number =>
    MINDESTABSTAND_RADIEN * scaledRadius(bodyIndex['earth']!, useStore.getState().scale);

  it('zoomt mit dem Rad nicht in den Zielkörper hinein', () => {
    erdnah();
    const el = flaeche();
    const stop = attachCameraInput(el);
    for (let i = 0; i < 200; i++) el.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, cancelable: true }));
    expect(useStore.getState().camera.distance).toBeCloseTo(erdGrenze(), 3);
    stop();
  });

  it('zoomt mit zwei Fingern nicht in den Zielkörper hinein', () => {
    erdnah();
    const el = flaeche();
    const stop = attachCameraInput(el);
    zeiger(el, 'pointerdown', 190, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 210, 100, 2, 'touch');
    zeiger(el, 'pointermove', 0, 100, 1, 'touch');
    zeiger(el, 'pointermove', 4000, 100, 2, 'touch');
    expect(useStore.getState().camera.distance).toBeCloseTo(erdGrenze(), 3);
    stop();
  });

  it('ändert im Flug mit zwei Fingern das Tempo statt des Abstands', () => {
    useStore.getState().setCamera({ mode: 'fly' });
    const el = flaeche();
    const onTempo = vi.fn();
    const stop = attachCameraInput(el, { onTempo });
    const abstand = useStore.getState().camera.distance;
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 200, 100, 2, 'touch');
    // Auseinander: wie das Rad nach vorn, also schneller.
    zeiger(el, 'pointermove', 50, 100, 1, 'touch');
    expect(onTempo).toHaveBeenCalledTimes(1);
    expect(onTempo.mock.calls[0]![0]).toBeGreaterThan(1);
    expect(useStore.getState().camera.distance).toBe(abstand);
    stop();
  });

  it('zoomt nicht, wenn beide Finger auf derselben Stelle begonnen haben', () => {
    const el = flaeche();
    const stop = attachCameraInput(el);
    const abstand = useStore.getState().camera.distance;
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointerdown', 100, 100, 2, 'touch');
    zeiger(el, 'pointermove', 120, 100, 2, 'touch');
    expect(useStore.getState().camera.distance).toBe(abstand);
    stop();
  });
});

describe('attachCameraInput — Himmelsmodus', () => {
  it('dreht beim Ziehen den Blick, nicht die Umlaufkamera, skaliert mit dem Bildwinkel', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { yaw: 0, pitch: 0, fovDeg: 25 } });
    const el = flaeche();
    const stop = attachCameraInput(el);
    const azimut = useStore.getState().camera.azimuth;
    zeiger(el, 'pointerdown', 100, 100);
    zeiger(el, 'pointermove', 120, 100);
    expect(useStore.getState().camera.geo.yaw).toBeCloseTo(20 * DREH * (25 / 50), 12);
    expect(useStore.getState().camera.azimuth).toBe(azimut);
    zeiger(el, 'pointerup', 120, 100);
    stop();
  });

  it('ändert mit dem Rad den Bildwinkel', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { yaw: 0, pitch: 0, fovDeg: 40 } });
    const el = flaeche();
    const stop = attachCameraInput(el);
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true }));
    expect(useStore.getState().camera.geo.fovDeg).toBeCloseTo(44, 9);
    stop();
  });

  it('lässt eingebettet ein Ein-Finger-Ziehen die Seite scrollen', () => {
    useStore.getState().setUi({ eingebettet: true });
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { yaw: 0, pitch: 0, fovDeg: 40 } });
    const el = flaeche();
    const stop = attachCameraInput(el);
    zeiger(el, 'pointerdown', 100, 100, 1, 'touch');
    zeiger(el, 'pointermove', 160, 100, 1, 'touch');
    expect(useStore.getState().camera.geo.yaw).toBe(0);
    stop();
  });
});
