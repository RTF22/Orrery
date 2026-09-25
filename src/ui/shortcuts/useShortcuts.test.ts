// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { handleShortcut, useShortcuts } from './useShortcuts';
import { useStore, DEFAULT_STATE } from '../../store';
import { cinemaAktiv, noteUserInput, startCinema, stopCinema } from '../cinemaControl';
import { useBogen } from '../bogen';
import { useMusikStand } from '../musikStand';
import { useInfoKarte } from '../infokarte/zustand';
import { useSteuerKarte } from '../steuerkarte/zustand';

describe('handleShortcut', () => {
  // stopCinema zuerst: löscht den gemerkten Zustand von vor dem Kinostart.
  beforeEach(() => {
    stopCinema();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    useMusikStand.setState({ verfuegbar: false, aktuell: null });
  });

  it('beendet mit Escape das Kino und stellt die Kamera von vorher wieder her', () => {
    useStore.getState().setCamera({ targetId: 'mars', distance: 7e4 });
    const kamera = useStore.getState().camera;
    handleShortcut('c');
    expect(useStore.getState().camera.mode).toBe('cinema');
    expect(handleShortcut('Escape')).toBe(true);
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera).toEqual(kamera);
  });

  it('beendet mit Escape auch ein durch Eingabe angehaltenes Kino', () => {
    const kamera = useStore.getState().camera;
    handleShortcut('c');
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
    expect(handleShortcut('Escape')).toBe(true);
    expect(useStore.getState().camera).toEqual(kamera);
  });

  it('Escape ohne Kino bleibt unbelegt', () => {
    expect(handleShortcut('Escape')).toBe(false);
  });

  it('das Verlassen des Vollbilds beendet ein laufendes Kino', () => {
    const kamera = useStore.getState().camera;
    const hook = renderHook(() => { useShortcuts(); });
    handleShortcut('c');
    // jsdom hat kein Vollbild: fullscreenElement ist null, wie nach ESC im Browser.
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera).toEqual(kamera);
    hook.unmount();
  });

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

  it('öffnet mit ? die Steuerungskarte', () => {
    expect(handleShortcut('?')).toBe(true);
    expect(useSteuerKarte.getState().offen).toBe(true);
    useSteuerKarte.setState({ offen: false });
  });

  it('startet und beendet den Kino-Modus mit C', () => {
    handleShortcut('c');
    expect(useStore.getState().cinema.running).toBe(true);
    handleShortcut('c');
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('springt mit N zur nächsten Szene', () => {
    handleShortcut('c');
    handleShortcut('n');
    expect(useStore.getState().cinema.nummer).toBe(1);
  });

  it('lässt unbelegte Tasten unangetastet', () => {
    expect(handleShortcut('x')).toBe(false);
  });

  it('schaltet die Sprache mit L um', () => {
    handleShortcut('l');
    expect(useStore.getState().ui.language).toBe('en');
    handleShortcut('l');
    expect(useStore.getState().ui.language).toBe('de');
  });

  it('schaltet das Infopanel mit I um', () => {
    expect(handleShortcut('i')).toBe(true);
    expect(useStore.getState().ui.panels.info).toBe(false);
    handleShortcut('i');
    expect(useStore.getState().ui.panels.info).toBe(true);
  });

  it('kippt im Kompaktmodus den Infobogen statt ui.panels.info', () => {
    useBogen.getState().setBogen('bedienung');
    const matchMedia = vi.fn((abfrage: string) => ({ abfrage, matches: true }));
    vi.stubGlobal('matchMedia', matchMedia);
    try {
      expect(handleShortcut('i')).toBe(true);
      expect(useBogen.getState().bogen).toBe('info');
      expect(useStore.getState().ui.panels.info).toBeUndefined();
      expect(handleShortcut('i')).toBe(true);
      expect(useBogen.getState().bogen).toBeNull();
    } finally {
      vi.unstubAllGlobals();
      useBogen.getState().setBogen(null);
    }
  });

  it('lässt die Taste M ohne Musik frei', () => {
    expect(handleShortcut('m')).toBe(false);
    expect(useStore.getState().ton.stumm).toBe(false);
  });

  it('schaltet mit M die Musik stumm und wieder an', () => {
    useMusikStand.setState({ verfuegbar: true });
    expect(handleShortcut('m')).toBe(true);
    expect(useStore.getState().ton.stumm).toBe(true);
    handleShortcut('m');
    expect(useStore.getState().ton.stumm).toBe(false);
  });
});

describe('handleShortcut bei offener Info-Karte', () => {
  it('lässt jede Taste durch, das Kino läuft bei Escape weiter', () => {
    startCinema();
    useInfoKarte.setState({ offen: true, reiter: 'app' });
    const paused = useStore.getState().time.paused;
    expect(handleShortcut(' ')).toBe(false);
    expect(handleShortcut('Escape')).toBe(false);
    expect(useStore.getState().time.paused).toBe(paused);
    expect(cinemaAktiv()).toBe(true);
    useInfoKarte.setState({ offen: false });
    stopCinema();
  });
});
