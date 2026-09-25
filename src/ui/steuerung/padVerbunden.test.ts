// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePadVerbunden } from './padVerbunden';
import { padAttrappe } from './padAttrappe';
import type { PadRoh } from './gamepad';

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'getGamepads');
});

describe('usePadVerbunden', () => {
  it('ist ohne Controller falsch', () => {
    vi.stubGlobal('isSecureContext', true);
    Object.defineProperty(navigator, 'getGamepads', { value: () => [], configurable: true });
    const { result } = renderHook(() => usePadVerbunden());
    expect(result.current).toBe(false);
  });

  it('wird mit einer Standardbelegung und dem Verbindungsereignis wahr', () => {
    vi.stubGlobal('isSecureContext', true);
    let pads: (PadRoh | null)[] = [];
    Object.defineProperty(navigator, 'getGamepads', { value: () => pads, configurable: true });
    const { result } = renderHook(() => usePadVerbunden());
    expect(result.current).toBe(false);

    pads = [padAttrappe()];
    act(() => { window.dispatchEvent(new Event('gamepadconnected')); });
    expect(result.current).toBe(true);
  });

  it('wird beim Trennen wieder falsch', () => {
    vi.stubGlobal('isSecureContext', true);
    let pads: (PadRoh | null)[] = [padAttrappe()];
    Object.defineProperty(navigator, 'getGamepads', { value: () => pads, configurable: true });
    const { result } = renderHook(() => usePadVerbunden());
    expect(result.current).toBe(true);

    pads = [];
    act(() => { window.dispatchEvent(new Event('gamepaddisconnected')); });
    expect(result.current).toBe(false);
  });

  it('bleibt ohne sicheren Kontext falsch', () => {
    vi.stubGlobal('isSecureContext', false);
    Object.defineProperty(navigator, 'getGamepads', { value: () => [padAttrappe()], configurable: true });
    const { result } = renderHook(() => usePadVerbunden());
    expect(result.current).toBe(false);
  });

  it('bleibt bei einer Ausnahme falsch und stürzt nicht ab', () => {
    vi.stubGlobal('isSecureContext', true);
    Object.defineProperty(navigator, 'getGamepads', {
      value: () => { throw new Error('Berechtigungsregel'); },
      configurable: true,
    });
    const { result } = renderHook(() => usePadVerbunden());
    expect(result.current).toBe(false);
  });
});
