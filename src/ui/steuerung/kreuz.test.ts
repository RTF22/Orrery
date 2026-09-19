// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  kreuzAusblenden, kreuzBewegen, kreuzElementSetzen, kreuzLage, kreuzMitte, kreuzSichtbar, kreuzZeichnen,
  kreuzZeigen, kreuzZuruecksetzen, KREUZ_PX,
} from './kreuz';
import { eingabeMelden, IDLE_HIDE_SEC, useIdleHide } from '../idle';

const l = { breite: 800, hoehe: 600 };

afterEach(() => {
  kreuzZuruecksetzen();
  vi.useRealTimers();
});

describe('Fadenkreuz-Zustand', () => {
  it('startet in der Mitte und bleibt beim Bewegen in der Leinwand, auch nach dem Verkleinern', () => {
    expect(kreuzLage(l)).toEqual({ x: 400, y: 300 });
    kreuzBewegen(1000, -50, l);
    expect(kreuzLage(l)).toEqual({ x: 800, y: 250 });
    expect(kreuzLage({ breite: 500, hoehe: 200 })).toEqual({ x: 500, y: 200 });
    kreuzMitte(l);
    expect(kreuzLage(l)).toEqual({ x: 400, y: 300 });
  });

  it('ist erst nach einer Controller-Eingabe sichtbar und nicht unter ausgeblendetem Mauszeiger', () => {
    expect(kreuzSichtbar()).toBe(false);
    kreuzZeigen();
    expect(kreuzSichtbar()).toBe(true);
    vi.useFakeTimers();
    const hook = renderHook(() => useIdleHide());
    act(() => { vi.advanceTimersByTime((IDLE_HIDE_SEC + 1) * 1000); });
    expect(kreuzSichtbar()).toBe(false);
    act(() => { eingabeMelden(); });
    expect(kreuzSichtbar()).toBe(true);
    hook.unmount();
    kreuzAusblenden();
    expect(kreuzSichtbar()).toBe(false);
  });

  it('zeichnet Lage und Sichtbarkeit direkt am Element und schreibt nur bei Änderung', () => {
    const el = document.createElement('div');
    kreuzElementSetzen(el);
    kreuzZeichnen(l);
    expect(el.style.display).toBe('none');
    kreuzZeigen();
    kreuzZeichnen(l);
    expect(el.style.display).toBe('block');
    expect(el.style.transform).toBe(`translate(${400 - KREUZ_PX / 2}px, ${300 - KREUZ_PX / 2}px)`);
    el.style.display = '';
    kreuzZeichnen(l);
    expect(el.style.display).toBe('');
  });
});
