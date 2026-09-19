import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { startLoop } from './loop';
import { useStore, DEFAULT_STATE } from '../store';
import { JD_MIN, JD_MAX } from '../sim/time';

// Die Schleife fordert jedes Bild über requestAnimationFrame an. Der Test
// sammelt die Rückrufe und führt sie von Hand aus, mit selbst gesetzter Zeit.
let rueckrufe: Array<(t: number) => void> = [];
let jetzt = 0;

beforeEach(() => {
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  rueckrufe = [];
  jetzt = 1000;
  vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => {
    rueckrufe.push(cb);
    return rueckrufe.length;
  });
  vi.spyOn(performance, 'now').mockImplementation(() => jetzt);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Führt das nächste angeforderte Bild aus, `ms` Millisekunden nach dem vorigen. */
function bild(ms: number): void {
  const cb = rueckrufe.shift();
  if (!cb) throw new Error('kein Bild angefordert');
  jetzt += ms;
  cb(jetzt);
}

describe('startLoop', () => {
  it('schreibt die Zeit im Bereich fort, ohne anzuhalten', () => {
    useStore.getState().setTime({ jd: 2461300.5, rateDaysPerSec: 10, paused: false });
    const stop = startLoop(() => {});
    bild(100);
    expect(useStore.getState().time.jd).toBeCloseTo(2461301.5, 9);
    expect(useStore.getState().time.paused).toBe(false);
    stop();
  });

  it('hält am oberen Rand des Zeitbereichs an und läuft weiter', () => {
    useStore.getState().setTime({ jd: JD_MAX - 1, rateDaysPerSec: 365, paused: false });
    const stop = startLoop(() => {});
    bild(100);
    expect(useStore.getState().time.jd).toBe(JD_MAX);
    expect(useStore.getState().time.paused).toBe(true);
    expect(rueckrufe).toHaveLength(1);
    stop();
  });

  it('hält am unteren Rand des Zeitbereichs an', () => {
    useStore.getState().setTime({ jd: JD_MIN + 1, rateDaysPerSec: -365, paused: false });
    const stop = startLoop(() => {});
    bild(100);
    expect(useStore.getState().time.jd).toBe(JD_MIN);
    expect(useStore.getState().time.paused).toBe(true);
    stop();
  });

  it('fordert nach einer Ausnahme in onFrame das nächste Bild an und meldet sie einmal', () => {
    const fehler = vi.spyOn(console, 'error').mockImplementation(() => {});
    let aufrufe = 0;
    const stop = startLoop(() => { aufrufe += 1; throw new Error('kaputt'); });
    bild(16);
    bild(16);
    expect(aufrufe).toBe(2);
    expect(rueckrufe).toHaveLength(1);
    expect(fehler).toHaveBeenCalledTimes(1);
    stop();
  });
});
