// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  SCHLUESSEL_INFOKARTE, gesehen, sollBeimStartOeffnen, startReiter, useInfoKarte,
} from './zustand';
import type { Ablage } from '../../store/persist';

const ablage = (werte: Record<string, string> = {}): Ablage => ({
  getItem: (k) => werte[k] ?? null,
  setItem: (k, v) => { werte[k] = v; },
  removeItem: (k) => { delete werte[k]; },
});
const werfend: Ablage = {
  getItem: () => { throw new Error('SecurityError'); },
  setItem: () => { throw new Error('SecurityError'); },
  removeItem: () => { throw new Error('SecurityError'); },
};

describe('Merkmal „gesehen“', () => {
  it('liest den Schlüssel orrery.infokarte.gesehen.v1', () => {
    expect(SCHLUESSEL_INFOKARTE).toBe('orrery.infokarte.gesehen.v1');
    expect(gesehen(ablage())).toBe(false);
    expect(gesehen(ablage({ [SCHLUESSEL_INFOKARTE]: '1' }))).toBe(true);
    expect(gesehen(null)).toBe(false);
    expect(gesehen(werfend)).toBe(false);
  });
});

describe('sollBeimStartOeffnen', () => {
  it('öffnet nur beim ersten Besuch ohne Link und ohne Kino', () => {
    expect(sollBeimStartOeffnen({ ablage: ablage(), mitLink: false, kinoLaeuft: false })).toBe(true);
    expect(sollBeimStartOeffnen({ ablage: ablage({ [SCHLUESSEL_INFOKARTE]: '1' }), mitLink: false, kinoLaeuft: false })).toBe(false);
    expect(sollBeimStartOeffnen({ ablage: ablage(), mitLink: true, kinoLaeuft: false })).toBe(false);
    expect(sollBeimStartOeffnen({ ablage: ablage(), mitLink: false, kinoLaeuft: true })).toBe(false);
  });
  it('öffnet ohne Fehler, wenn die Ablage wirft oder fehlt', () => {
    expect(sollBeimStartOeffnen({ ablage: werfend, mitLink: false, kinoLaeuft: false })).toBe(true);
    expect(sollBeimStartOeffnen({ ablage: null, mitLink: false, kinoLaeuft: false })).toBe(true);
  });
});

describe('startReiter', () => {
  it('zeigt „App“ nur bei Touch außerhalb des App-Modus', () => {
    expect(startReiter(true, false)).toBe('app');
    expect(startReiter(true, true)).toBe('bedienung');
    expect(startReiter(false, false)).toBe('bedienung');
  });
});

describe('useInfoKarte', () => {
  beforeEach(() => { useInfoKarte.setState({ offen: false, reiter: 'bedienung' }); });

  it('öffnet mit Reiter, wechselt ihn und schließt', () => {
    useInfoKarte.getState().oeffnen('ueber');
    expect(useInfoKarte.getState()).toMatchObject({ offen: true, reiter: 'ueber' });
    useInfoKarte.getState().setReiter('app');
    expect(useInfoKarte.getState().reiter).toBe('app');
    useInfoKarte.getState().schliessen();
    expect(useInfoKarte.getState().offen).toBe(false);
  });

  it('merkt sich beim Schließen „gesehen“, auch wenn die Ablage wirft', () => {
    const werte: Record<string, string> = {};
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { werte[k] = v; });
    useInfoKarte.getState().oeffnen('app');
    useInfoKarte.getState().schliessen();
    expect(werte[SCHLUESSEL_INFOKARTE]).toBe('1');
    setItem.mockImplementation(() => { throw new Error('QuotaExceeded'); });
    useInfoKarte.getState().oeffnen('app');
    expect(() => { useInfoKarte.getState().schliessen(); }).not.toThrow();
    setItem.mockRestore();
  });
});
