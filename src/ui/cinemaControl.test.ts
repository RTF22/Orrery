import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  startCinema, stopCinema, toggleCinema, nextScene, noteUserInput, resumeIfIdle,
} from './cinemaControl';
import { useStore, DEFAULT_STATE } from '../store';

// stopCinema zuerst: Es löscht den gemerkten Zustand von vor dem Start und
// die Pausenmarke, die als Modulvariablen sonst in den nächsten Test lecken.
beforeEach(() => {
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('Kino-Steuerung: Rückkehr zum Zustand vor dem Start', () => {
  it('stellt Kamera, Zeitrate und Pause wieder her, lässt das Datum stehen', () => {
    const s = useStore.getState();
    s.setCamera({ mode: 'attached', targetId: 'saturn', distance: 5e5, azimuth: 1.2, elevation: -0.3, freezeJd: null });
    s.setTime({ rateDaysPerSec: 3, paused: true, jd: 2460000 });
    const kamera = useStore.getState().camera;
    startCinema();
    useStore.getState().setCinema({ nummer: 4, elapsedSec: 9 });
    useStore.getState().setTime({ jd: 2460100, rateDaysPerSec: 500, paused: false });
    stopCinema();
    const nach = useStore.getState();
    expect(nach.camera).toEqual(kamera);
    expect(nach.time).toEqual({ jd: 2460100, rateDaysPerSec: 3, paused: true });
    expect(nach.cinema.running).toBe(false);
  });

  it('stellt auch nach einer Pause durch Eingabe wieder her', () => {
    useStore.getState().setCamera({ targetId: 'mars', distance: 7e4, freezeJd: 2451000 });
    const kamera = useStore.getState().camera;
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('cinema');
    stopCinema();
    expect(useStore.getState().camera).toEqual(kamera);
  });

  it('merkt sich beim Wiederanlauf nach Ruhe nichts Neues', () => {
    useStore.getState().setCamera({ targetId: 'venus', distance: 3e4 });
    const kamera = useStore.getState().camera;
    startCinema();
    noteUserInput();
    resumeIfIdle(Date.now() + 3600_000);
    expect(useStore.getState().cinema.running).toBe(true);
    stopCinema();
    expect(useStore.getState().camera).toEqual(kamera);
  });

  it('lässt die Kamera in Ruhe, wenn sie während der Pause von Hand umgestellt wurde', () => {
    startCinema();
    noteUserInput();
    useStore.getState().setCamera({ mode: 'follow', targetId: 'moon' });
    stopCinema();
    expect(useStore.getState().camera.mode).toBe('follow');
    expect(useStore.getState().camera.targetId).toBe('moon');
  });

  it('ohne gemerkten Zustand (Seite mit laufendem Kino geladen) bleibt der freie Modus mit dem Kinoziel', () => {
    useStore.getState().setCinema({ running: true });
    useStore.getState().setCamera({ mode: 'cinema', targetId: 'jupiter' });
    stopCinema();
    const s = useStore.getState();
    expect(s.camera.mode).toBe('free');
    expect(s.camera.targetId).toBe('jupiter');
    expect(s.camera.freezeJd).toBe(s.time.jd);
  });

  it('die Ruhefrist zählt ab der letzten Eingabe, nicht ab der ersten', () => {
    vi.useFakeTimers({ now: 1_000_000 });
    try {
      startCinema();
      noteUserInput();
      vi.setSystemTime(1_020_000);
      noteUserInput();
      resumeIfIdle(1_031_000);
      expect(useStore.getState().cinema.running).toBe(false);
      resumeIfIdle(1_051_000);
      expect(useStore.getState().cinema.running).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('Kino-Steuerung', () => {
  it('startet im Kameramodus Kinofahrt bei Szene null', () => {
    startCinema();
    const s = useStore.getState();
    expect(s.cinema.running).toBe(true);
    expect(s.cinema.elapsedSec).toBe(0);
    expect(s.camera.mode).toBe('cinema');
  });

  it('gibt beim Beenden die Kamera wieder frei', () => {
    startCinema();
    stopCinema();
    const s = useStore.getState();
    expect(s.cinema.running).toBe(false);
    expect(s.camera.mode).not.toBe('cinema');
  });

  it('schaltet mit toggleCinema hin und her', () => {
    toggleCinema();
    expect(useStore.getState().cinema.running).toBe(true);
    toggleCinema();
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('springt mit nextScene zur nächsten Szene und setzt die Laufzeit zurück', () => {
    startCinema();
    useStore.getState().setCinema({ elapsedSec: 12 });
    nextScene();
    expect(useStore.getState().cinema.nummer).toBe(1);
    expect(useStore.getState().cinema.elapsedSec).toBe(0);
  });

  it('hält bei einer Nutzereingabe an, wenn das eingestellt ist', () => {
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('läuft bei ausgeschalteter Einstellung durch', () => {
    useStore.getState().setCinema({ pauseOnInput: false });
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(true);
  });

  it('nimmt nach der eingestellten Ruhezeit wieder auf', () => {
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);

    const ruhe = useStore.getState().cinema.idleResumeSec;
    resumeIfIdle(Date.now() + (ruhe - 1) * 1000);
    expect(useStore.getState().cinema.running).toBe(false);

    resumeIfIdle(Date.now() + (ruhe + 1) * 1000);
    expect(useStore.getState().cinema.running).toBe(true);
  });

  it('lässt elapsedSec beim Wiederanlauf nach Ruhe stehen', () => {
    // app/cinema.ts#szenenBeginn wertet elapsedSec 0 als Szenenbeginn und
    // löst dann den Zeitsprung der Finsternis-Szene aus. Setzte der
    // Wiederanlauf den Zähler zurück, spränge die Zeit nach jeder Ruhepause
    // erneut vor die Finsternis.
    useStore.getState().setCinema({ running: true, pauseOnInput: true, idleResumeSec: 30, elapsedSec: 12 });
    noteUserInput();
    resumeIfIdle(Date.now() + 31_000);
    expect(useStore.getState().cinema.running).toBe(true);
    expect(useStore.getState().cinema.elapsedSec).toBe(12);
  });

  it('nimmt nicht wieder auf, wenn der Kino-Modus von Hand beendet wurde', () => {
    startCinema();
    stopCinema();
    resumeIfIdle(Date.now() + 3600_000);
    expect(useStore.getState().cinema.running).toBe(false);
  });
});
