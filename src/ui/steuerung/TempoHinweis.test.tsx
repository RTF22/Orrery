// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TempoHinweis, HINWEIS_MS } from './TempoHinweis';
import { tempoAendern, tempoZuruecksetzen } from './anwenden';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => {
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});
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

  // Fix-Runde 1, I1: Bei ausgeblendeter Oberfläche (ui.hidden) steht an
  // derselben Stelle unten mittig die Minileiste — der Hinweis rückt dann
  // höher, damit sich beide nicht überlappen.
  it('steht bei eingeblendeter Oberfläche tiefer als bei ausgeblendeter (Minileiste)', () => {
    render(<TempoHinweis />);
    expect(screen.getByRole('status').className).toContain('bottom-6');
    expect(screen.getByRole('status').className).not.toContain('bottom-16');

    act(() => { useStore.getState().setUi({ hidden: true }); });
    expect(screen.getByRole('status').className).toContain('bottom-16');
  });
});
