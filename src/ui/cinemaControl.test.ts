import { describe, it, expect, beforeEach } from 'vitest';
import {
  startCinema, stopCinema, toggleCinema, nextScene, noteUserInput, resumeIfIdle,
} from './cinemaControl';
import { useStore, DEFAULT_STATE } from '../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

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
