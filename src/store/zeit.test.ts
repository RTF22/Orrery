import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, DEFAULT_STATE } from './index';
import { JD_MIN, JD_MAX } from '../sim/time';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('setTime und Zeitbereich', () => {
  it('klemmt jd auf den Zeitbereich', () => {
    useStore.getState().setTime({ jd: JD_MAX + 1000 });
    expect(useStore.getState().time.jd).toBe(JD_MAX);
    useStore.getState().setTime({ jd: -1 });
    expect(useStore.getState().time.jd).toBe(JD_MIN);
  });

  it('lässt jd im Bereich und ohne jd im Patch unverändert', () => {
    useStore.getState().setTime({ jd: 2461300.5 });
    expect(useStore.getState().time.jd).toBe(2461300.5);
    useStore.getState().setTime({ paused: true });
    expect(useStore.getState().time.jd).toBe(2461300.5);
    expect(useStore.getState().time.paused).toBe(true);
  });
});
