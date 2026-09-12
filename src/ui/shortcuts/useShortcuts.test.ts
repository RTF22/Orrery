// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { handleShortcut, SHORTCUTS_PANEL } from './useShortcuts';
import { useStore, DEFAULT_STATE } from '../../store';

describe('handleShortcut', () => {
  beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

  it('blendet die Oberfläche aus und wieder ein', () => {
    handleShortcut('h');
    expect(useStore.getState().ui.hidden).toBe(true);
    handleShortcut('h');
    expect(useStore.getState().ui.hidden).toBe(false);
  });

  it('hält die Zeit mit der Leertaste an', () => {
    handleShortcut(' ');
    expect(useStore.getState().time.paused).toBe(true);
  });

  it('ändert die Zeitraffung multiplikativ und umkehrbar', () => {
    const vorher = useStore.getState().time.rateDaysPerSec;
    handleShortcut('ArrowRight');
    const schneller = useStore.getState().time.rateDaysPerSec;
    expect(schneller).toBeGreaterThan(vorher);
    handleShortcut('ArrowLeft');
    expect(useStore.getState().time.rateDaysPerSec).toBeCloseTo(vorher, 12);
  });

  it('kehrt die Laufrichtung um', () => {
    const vorher = useStore.getState().time.rateDaysPerSec;
    handleShortcut('r');
    expect(useStore.getState().time.rateDaysPerSec).toBe(-vorher);
  });

  it('setzt die Kamera auf die Standardwerte zurück', () => {
    useStore.getState().setCamera({ distance: 42, azimuth: 3 });
    handleShortcut('Home');
    expect(useStore.getState().camera).toEqual(DEFAULT_STATE.camera);
  });

  it('schaltet die Kürzel-Übersicht um', () => {
    handleShortcut('?');
    expect(useStore.getState().ui.panels[SHORTCUTS_PANEL]).toBe(true);
    handleShortcut('?');
    expect(useStore.getState().ui.panels[SHORTCUTS_PANEL]).toBe(false);
  });

  it('lässt unbelegte Tasten unangetastet', () => {
    expect(handleShortcut('x')).toBe(false);
  });
});
