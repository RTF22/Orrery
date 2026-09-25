import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  startCinema, stopCinema, toggleCinema, nextScene, noteUserInput, resumeIfIdle,
  naechsteNummerFuer, starteSzene,
} from './cinemaControl';
import { useStore, DEFAULT_STATE } from '../store';
import { SCENES } from '../data/scenes';
import { sceneIndexFor } from '../sim/director';

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

  it('beendet mit toggleCinema auch ein durch Eingabe angehaltenes Kino', () => {
    useStore.getState().setCamera({ targetId: 'mars', distance: 7e4 });
    const kamera = useStore.getState().camera;
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('cinema');
    toggleCinema();
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera).toEqual(kamera);
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

describe('Kino-Steuerung: eigenes Vollbild', () => {
  // Attrappe statt jsdom: Diese Datei läuft in der Node-Umgebung, in der es
  // kein `document` gibt; startCinema/stopCinema prüfen typeof document.
  const attrappe = (fullscreenElement: unknown = null) => ({
    fullscreenElement,
    documentElement: { requestFullscreen: vi.fn<() => Promise<void>>(() => Promise.resolve()) },
    exitFullscreen: vi.fn<() => Promise<void>>(() => Promise.resolve()),
  });

  it('(a) schaltet beim Start Vollbild ein und verlässt es beim Beenden', async () => {
    const doc = attrappe(null);
    vi.stubGlobal('document', doc);
    try {
      startCinema();
      expect(doc.documentElement.requestFullscreen).toHaveBeenCalledTimes(1);
      await Promise.resolve(); // wartet auf die Erfüllung des Versprechens
      doc.fullscreenElement = {}; // der Browser wäre jetzt im Vollbild
      stopCinema();
      expect(doc.exitFullscreen).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('(b) lässt ein vorher von Hand gewähltes Vollbild beim Beenden stehen', () => {
    const doc = attrappe({}); // schon im Vollbild vor dem Start
    vi.stubGlobal('document', doc);
    try {
      startCinema();
      expect(doc.documentElement.requestFullscreen).not.toHaveBeenCalled();
      stopCinema();
      expect(doc.exitFullscreen).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('(c) ruft kein exitFullscreen, wenn die Anfrage verweigert wurde', async () => {
    const doc = attrappe(null);
    doc.documentElement.requestFullscreen = vi.fn<() => Promise<void>>(() => Promise.reject(new Error('verweigert')));
    vi.stubGlobal('document', doc);
    try {
      startCinema();
      await Promise.resolve();
      await Promise.resolve();
      doc.fullscreenElement = {};
      stopCinema();
      expect(doc.exitFullscreen).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('(d) ruft kein exitFullscreen, wenn der Nutzer das Vollbild schon selbst verlassen hat', async () => {
    const doc = attrappe(null);
    vi.stubGlobal('document', doc);
    try {
      startCinema();
      await Promise.resolve();
      doc.fullscreenElement = {};
      // Der Nutzer verlässt das Vollbild selbst (etwa mit Escape im Browser),
      // bevor das Kino beendet wird.
      doc.fullscreenElement = null;
      stopCinema();
      expect(doc.exitFullscreen).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('verlässt das Vollbild nachträglich, wenn das Kino vor der Zusage schon endet (Nacharbeit Runde 1)', async () => {
    // Zurückgehaltene Zusage: startCinema löst sie nicht sofort ein, ein
    // schnelles doppeltes C oder Escape kurz nach dem Start endet das Kino,
    // bevor requestFullscreen sich erfüllt.
    let erfuellen: (() => void) | null = null;
    const zusage = new Promise<void>((resolve) => { erfuellen = resolve; });
    const doc = attrappe(null);
    doc.documentElement.requestFullscreen = vi.fn<() => Promise<void>>(() => zusage);
    vi.stubGlobal('document', doc);
    try {
      startCinema();
      stopCinema();
      expect(doc.exitFullscreen).not.toHaveBeenCalled();
      // Die Zusage erfüllt sich jetzt nachträglich; der Browser ist inzwischen
      // im Vollbild.
      doc.fullscreenElement = {};
      erfuellen?.();
      await Promise.resolve();
      await Promise.resolve();
      expect(doc.exitFullscreen).toHaveBeenCalledTimes(1);
      // Ein weiteres Beenden löst kein zweites exitFullscreen aus.
      stopCinema();
      expect(doc.exitFullscreen).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('naechsteNummerFuer (Entwurf Phase 5 §3.3)', () => {
  it('ohne Mischen: die nächste Nummer mit n mod anzahl = index, ab der aktuellen', () => {
    expect(naechsteNummerFuer(3, 0, 19, 1, false)).toBe(3);
    expect(naechsteNummerFuer(3, 5, 19, 1, false)).toBe(22);
    expect(naechsteNummerFuer(5, 5, 19, 1, false)).toBe(5);
  });

  it('gemischt: findet jede Szene ab jeder Startnummer als kleinste Nummer innerhalb von zwei Runden', () => {
    const anzahl = SCENES.length;
    const keim = DEFAULT_STATE.cinema.seed;
    for (const ab of [0, 7, anzahl - 1, anzahl, 2 * anzahl + 3, 999]) {
      for (let index = 0; index < anzahl; index++) {
        const n = naechsteNummerFuer(index, ab, anzahl, keim, true);
        expect(sceneIndexFor(n, anzahl, keim, true)).toBe(index);
        expect(n).toBeGreaterThanOrEqual(ab);
        expect(n).toBeLessThan(ab + 2 * anzahl);
        for (let m = ab; m < n; m++) expect(sceneIndexFor(m, anzahl, keim, true)).not.toBe(index);
      }
    }
  });

  it('bleibt bei einem Index ohne Szene bei der Startnummer', () => {
    expect(naechsteNummerFuer(99, 4, 19, 1, true)).toBe(4);
  });
});

describe('starteSzene', () => {
  it('setzt die Nummer, beginnt die Szene von vorn und startet das Kino', () => {
    useStore.getState().setCinema({ nummer: 5, elapsedSec: 12, shuffle: false });
    starteSzene(2);
    const { cinema, camera } = useStore.getState();
    expect(cinema).toMatchObject({ nummer: 2 + SCENES.length, elapsedSec: 0, running: true });
    expect(camera.mode).toBe('cinema');
  });

  it('läuft nach einer Pause durch Eingabe sofort und bleibt laufen, wenn die Ruhefrist abläuft', () => {
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
    starteSzene(4);
    const { nummer } = useStore.getState().cinema;
    expect(useStore.getState().cinema.running).toBe(true);
    expect(sceneIndexFor(nummer, SCENES.length, DEFAULT_STATE.cinema.seed, true)).toBe(4);
    // startCinema löscht die Pausenmarke; die abgelaufene Ruhefrist ändert nichts mehr.
    resumeIfIdle(Date.now() + 10 * 3600 * 1000);
    expect(useStore.getState().cinema).toMatchObject({ running: true, nummer });
  });
});
