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
  it('zeigt den Tempofaktor relativ zum Start und blendet nach 1,5 s aus', () => {
    vi.useFakeTimers();
    render(<TempoHinweis />);
    expect(screen.queryByRole('status')).toBeNull();
    act(() => { tempoAendern(1.25); });
    expect(screen.getByRole('status').textContent).toBe('Tempo ×1,25');
    act(() => { vi.advanceTimersByTime(HINWEIS_MS - 1); });
    expect(screen.queryByRole('status')).not.toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByRole('status')).toBeNull();
  });
});
