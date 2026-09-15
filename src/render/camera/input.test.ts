// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { attachCameraInput } from './input';
import { useStore, DEFAULT_STATE } from '../../store';

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
