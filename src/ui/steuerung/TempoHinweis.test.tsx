// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TempoHinweis, HINWEIS_MS } from './TempoHinweis';
import { tempoAendern, tempoZuruecksetzen } from './anwenden';

afterEach(() => {
  vi.useRealTimers();
  tempoZuruecksetzen();
});

describe('TempoHinweis', () => {
  it('bleibt eingehängt (M9): leer vor dem ersten Radereignis, Text danach, wieder leer nach 1,5 s', () => {
    vi.useFakeTimers();
    render(<TempoHinweis />);
    // role="status" muss schon vor der ersten Änderung im Dokument stehen,
    // sonst melden Screenreader die spätere Änderung nicht zuverlässig.
    expect(screen.getByRole('status').textContent).toBe('');
    act(() => { tempoAendern(1.25); });
    expect(screen.getByRole('status').textContent).toBe('Tempo ×1,25');
    act(() => { vi.advanceTimersByTime(HINWEIS_MS - 1); });
    expect(screen.getByRole('status').textContent).toBe('Tempo ×1,25');
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByRole('status').textContent).toBe('');
  });
});
