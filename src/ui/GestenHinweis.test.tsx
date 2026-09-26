// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { GestenHinweis, GESTE_HINWEIS_MS } from './GestenHinweis';
import { gesteHinweisMelden } from './gesteMeldung';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('GestenHinweis', () => {
  it('bleibt eingehängt: leer vor der ersten Geste, Text danach, wieder leer nach 1,5 s', () => {
    vi.useFakeTimers();
    render(<GestenHinweis />);
    expect(screen.getByText('', { selector: '[aria-live="polite"]' }).textContent).toBe('');
    act(() => { gesteHinweisMelden('touch'); });
    expect(screen.getByText('Zwei Finger zum Bewegen')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(GESTE_HINWEIS_MS - 1); });
    expect(screen.getByText('Zwei Finger zum Bewegen')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByText('Zwei Finger zum Bewegen')).toBeNull();
  });

  it('verlängert die Anzeige bei erneutem Auslösen, statt sie zu unterbrechen', () => {
    vi.useFakeTimers();
    render(<GestenHinweis />);
    act(() => { gesteHinweisMelden('touch'); });
    act(() => { vi.advanceTimersByTime(GESTE_HINWEIS_MS - 1); });
    act(() => { gesteHinweisMelden('touch'); });
    act(() => { vi.advanceTimersByTime(GESTE_HINWEIS_MS - 1); });
    expect(screen.getByText('Zwei Finger zum Bewegen')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByText('Zwei Finger zum Bewegen')).toBeNull();
  });

  it('zeigt den Strg-Text ohne Mac und den ⌘-Text auf dem Mac', () => {
    vi.stubGlobal('navigator', { ...navigator, platform: 'Win32', userAgentData: undefined });
    const { unmount } = render(<GestenHinweis />);
    act(() => { gesteHinweisMelden('rad'); });
    expect(screen.getByText('Strg + Mausrad zum Zoomen')).toBeTruthy();
    unmount();

    vi.stubGlobal('navigator', { ...navigator, platform: 'MacIntel', userAgentData: undefined });
    render(<GestenHinweis />);
    act(() => { gesteHinweisMelden('rad'); });
    expect(screen.getByText('⌘ + Mausrad zum Zoomen')).toBeTruthy();
  });
});
