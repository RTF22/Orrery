// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useSitzungMerken } from './useSitzungMerken';
import { useStore, DEFAULT_STATE } from '../store';
import { SCHLUESSEL_MERKEN, SCHLUESSEL_SITZUNG } from '../store/persist';
import { ablageFake } from '../test/ablageFake';

describe('useSitzungMerken: nicht eingebettet (bisheriges Verhalten)', () => {
  it('liest den Anfangszustand aus der Ablage', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_MERKEN, '0');
    const { result } = renderHook(() => useSitzungMerken(ablage, false));
    expect(result.current[0]).toBe(false);
  });

  it('schreibt die Präferenz und löscht die gesicherte Sitzung', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, '{"time":{"paused":true}}');
    const { result } = renderHook(() => useSitzungMerken(ablage, false));
    act(() => { result.current[1](false); });
    expect(ablage.daten.get(SCHLUESSEL_MERKEN)).toBe('0');
    expect(ablage.daten.has(SCHLUESSEL_SITZUNG)).toBe(false);
  });
});

describe('useSitzungMerken: eingebettet (Fix-Runde 1) — schreibt und löscht nichts', () => {
  it('setzen schreibt die Präferenz nicht und löscht die Sitzung nicht', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, '{"time":{"paused":true}}');
    const { result } = renderHook(() => useSitzungMerken(ablage, true));
    act(() => { result.current[1](false); });
    expect(ablage.daten.has(SCHLUESSEL_MERKEN)).toBe(false);
    expect(ablage.daten.get(SCHLUESSEL_SITZUNG)).toBe('{"time":{"paused":true}}');
    // Der React-Zustand selbst folgt der Bedienung weiterhin — nur das
    // Schreiben in die Ablage unterbleibt (DisplayPanel.tsx zeigt den
    // Schalter eingebettet ohnehin gar nicht erst an).
    expect(result.current[0]).toBe(false);
  });

  it('Einschalten löscht ebenfalls nichts und schreibt die Präferenz nicht', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_MERKEN, '0');
    const { result } = renderHook(() => useSitzungMerken(ablage, true));
    act(() => { result.current[1](true); });
    expect(ablage.daten.get(SCHLUESSEL_MERKEN)).toBe('0');
  });

  it('der Standardparameter eingebettet kommt aus dem Store, ohne dass der Aufrufer ihn reichen muss', () => {
    const eingebettetesState = structuredClone(DEFAULT_STATE);
    eingebettetesState.ui.eingebettet = true;
    useStore.getState().replaceAll(eingebettetesState);
    try {
      const ablage = ablageFake();
      const { result } = renderHook(() => useSitzungMerken(ablage));
      act(() => { result.current[1](false); });
      expect(ablage.daten.has(SCHLUESSEL_MERKEN)).toBe(false);
    } finally {
      useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    }
  });
});
