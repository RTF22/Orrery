// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { fahreZu, fahrtAbbrechen, fahrtLaeuft, fokusAbstand, FAHRT_MS } from './kamerafahrt';
import { useStore, DEFAULT_STATE } from '../store';
import { bodyIndex } from '../data';

/** Handgesteuerte Uhr und Bildplanung, damit die Fahrt ohne Timer prüfbar ist. */
function planer(): { optionen: Parameters<typeof fahreZu>[1]; vor(ms: number): void } {
  let ms = 0;
  let naechster: (() => void) | null = null;
  return {
    optionen: {
      jetzt: () => ms,
      anfordern: (schritt) => { naechster = schritt; return 1; },
      abbrechen: () => { naechster = null; },
    },
    vor(delta) {
      ms += delta;
      const s = naechster;
      naechster = null;
      s?.();
    },
  };
}

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('fahreZu', () => {
  it('setzt das Ziel sofort und gleitet den Abstand in 1,5 s logarithmisch ans Ziel', () => {
    const p = planer();
    useStore.getState().setCamera({ distance: 1e9 });
    fahreZu('saturn', p.optionen);
    const s = useStore.getState();
    expect(s.camera.targetId).toBe('saturn');
    expect(s.camera.freezeJd).toBe(s.time.jd);
    expect(fahrtLaeuft()).toBe(true);
    const ziel = fokusAbstand(bodyIndex.saturn!, s.scale);
    const werte: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      p.vor(FAHRT_MS / 5);
      werte.push(useStore.getState().camera.distance);
    }
    for (let i = 1; i < werte.length; i += 1) expect(werte[i]!).toBeLessThanOrEqual(werte[i - 1]!);
    expect(useStore.getState().camera.distance).toBeCloseTo(ziel, 6);
    expect(fahrtLaeuft()).toBe(false);
  });

  it('bricht bei einer Nutzereingabe ab und bleibt stehen', () => {
    const p = planer();
    useStore.getState().setCamera({ distance: 1e9 });
    fahreZu('earth', p.optionen);
    p.vor(FAHRT_MS / 3);
    const mitte = useStore.getState().camera.distance;
    window.dispatchEvent(new Event('wheel'));
    expect(fahrtLaeuft()).toBe(false);
    p.vor(FAHRT_MS);
    expect(useStore.getState().camera.distance).toBe(mitte);
  });

  it('ersetzt eine laufende Fahrt und beendet ein laufendes Kino', () => {
    const p = planer();
    useStore.getState().setCinema({ running: true });
    useStore.getState().setCamera({ mode: 'cinema' });
    fahreZu('earth', p.optionen);
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('free');
    fahreZu('moon', p.optionen);
    expect(useStore.getState().camera.targetId).toBe('moon');
    p.vor(FAHRT_MS + 1);
    expect(useStore.getState().camera.distance).toBeCloseTo(fokusAbstand(bodyIndex.moon!, useStore.getState().scale), 6);
  });

  it('ignoriert unbekannte Körper', () => {
    const vorher = useStore.getState().camera;
    fahreZu('vulcan', planer().optionen);
    expect(useStore.getState().camera).toEqual(vorher);
    expect(fahrtLaeuft()).toBe(false);
  });
});
