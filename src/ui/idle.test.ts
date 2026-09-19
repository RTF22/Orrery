// @vitest-environment jsdom
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  createIdleWatcher, eingabeMelden, IDLE_HIDE_SEC, useIdleHide, zeigerAusgeblendet,
} from './idle';

describe('createIdleWatcher', () => {
  it('meldet Untätigkeit erst nach der Wartezeit', () => {
    const onIdle = vi.fn(); const onActive = vi.fn(); const onTick = vi.fn();
    const w = createIdleWatcher({ onIdle, onActive, onTick });

    w.handleInput(0);
    w.tick((IDLE_HIDE_SEC - 0.5) * 1000);
    expect(onIdle).not.toHaveBeenCalled();

    w.tick((IDLE_HIDE_SEC + 0.5) * 1000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('meldet Untätigkeit nur einmal je Ruhephase', () => {
    const onIdle = vi.fn();
    const w = createIdleWatcher({ onIdle, onActive: vi.fn(), onTick: vi.fn() });
    w.handleInput(0);
    w.tick(10_000);
    w.tick(20_000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('meldet die Rückkehr zur Aktivität', () => {
    const onActive = vi.fn();
    const w = createIdleWatcher({ onIdle: vi.fn(), onActive, onTick: vi.fn() });
    w.handleInput(0);
    w.tick(10_000);
    w.handleInput(10_100);
    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it('reicht jeden Tick weiter, damit der Kino-Modus wieder anlaufen kann', () => {
    const onTick = vi.fn();
    const w = createIdleWatcher({ onIdle: vi.fn(), onActive: vi.fn(), onTick });
    w.tick(1000);
    w.tick(2000);
    expect(onTick).toHaveBeenNthCalledWith(1, 1000);
    expect(onTick).toHaveBeenNthCalledWith(2, 2000);
  });
});

describe('zeigerAusgeblendet', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('gilt ab der Ruhezeit und endet schon mit der Weckeingabe, bevor die Klasse fällt', () => {
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    expect(zeigerAusgeblendet()).toBe(false);

    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(zeigerAusgeblendet()).toBe(true);
    expect(document.documentElement.classList.contains('zeiger-aus')).toBe(true);

    // Die Szene fragt je Bild ab; das Bild direkt nach der Weckbewegung darf den
    // frisch gemeldeten Zeiger nicht wieder löschen, auch wenn Reacts Effekt die
    // Klasse erst später entfernt.
    act(() => {
      window.dispatchEvent(new Event('pointermove'));
      expect(zeigerAusgeblendet()).toBe(false);
      expect(document.documentElement.classList.contains('zeiger-aus')).toBe(true);
    });
    expect(document.documentElement.classList.contains('zeiger-aus')).toBe(false);

    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(zeigerAusgeblendet()).toBe(true);
    hook.unmount();
    expect(zeigerAusgeblendet()).toBe(false);
  });

  it('lässt sich ohne Fensterereignis wecken (Controller, eingabeMelden)', () => {
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(zeigerAusgeblendet()).toBe(true);
    act(() => { eingabeMelden(); });
    expect(zeigerAusgeblendet()).toBe(false);
    hook.unmount();
    // Ohne eingehängten Wächter bleibt der Aufruf folgenlos.
    expect(() => { eingabeMelden(); }).not.toThrow();
  });
});
