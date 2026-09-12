import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, DEFAULT_STATE } from './index';
import { toShareable, fromShareable, encodeState, decodeState } from './serialize';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('Kino-Zustand', () => {
  it('startet ausgeschaltet bei Szene null', () => {
    const { cinema } = useStore.getState();
    expect(cinema.running).toBe(false);
    expect(cinema.nummer).toBe(0);
    expect(cinema.elapsedSec).toBe(0);
  });

  it('lässt sich über setCinema ändern, ohne andere Felder zu verlieren', () => {
    useStore.getState().setCinema({ running: true });
    const { cinema } = useStore.getState();
    expect(cinema.running).toBe(true);
    expect(cinema.seed).toBe(DEFAULT_STATE.cinema.seed);
  });

  it('taucht im geteilten Zustand nur auf, wenn er vom Standard abweicht', () => {
    expect(toShareable(useStore.getState())).not.toHaveProperty('cinema');
    useStore.getState().setCinema({ seed: 4711 });
    expect(toShareable(useStore.getState())).toHaveProperty('cinema');
  });

  it('übersteht den Rundlauf durch die URL-Kodierung', () => {
    useStore.getState().setCinema({ seed: 4711, shuffle: false, nummer: 12 });
    const zustand = useStore.getState();
    const zurueck = decodeState(encodeState(zustand));
    expect(zurueck.cinema).toEqual(zustand.cinema);
  });

  it('stellt fehlende Felder aus dem Standard wieder her', () => {
    const zurueck = fromShareable({ cinema: { seed: 9 } });
    expect(zurueck.cinema.seed).toBe(9);
    expect(zurueck.cinema.shuffle).toBe(DEFAULT_STATE.cinema.shuffle);
  });
});
