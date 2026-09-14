// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
// Vollständige Endung nötig: Im selben Ordner liegt auch datenblock.ts
// (Kleinschreibung); auf einem großschreibungsunempfindlichen Dateisystem
// (NTFS) findet die endungslose Auflösung sonst datenblock.ts zuerst und
// „Datenblock" wäre undefined.
import { Datenblock } from './Datenblock.tsx';
import { useStore, DEFAULT_STATE } from '../../store';
import { bodyIndex } from '../../data';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('Datenblock', () => {
  it('zeigt die Zeilen des Niveaus', () => {
    render(<Datenblock body={bodyIndex.earth!} niveau="grundschule" onModell={() => {}} />);
    expect(screen.getByText('Durchmesser')).toBeTruthy();
    expect(screen.getByText('12.742 km')).toBeTruthy();
    expect(screen.queryByText('Masse')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Grenzen des Modells' })).toBeNull();
  });

  it('warnt außerhalb des Fensters und verlinkt die Modellgrenzen', () => {
    useStore.getState().setTime({ jd: 2_500_000 });
    const onModell = vi.fn();
    render(<Datenblock body={bodyIndex.earth!} niveau="grundschule" onModell={onModell} />);
    expect(screen.getByText('Außerhalb des Genauigkeitsfensters 1800–2050.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Grenzen des Modells' }));
    expect(onModell).toHaveBeenCalledTimes(1);
  });

  it('Hochschule verlinkt die Modellgrenzen immer', () => {
    render(<Datenblock body={bodyIndex.sun!} niveau="hochschule" onModell={() => {}} />);
    expect(screen.getByRole('button', { name: 'Grenzen des Modells' })).toBeTruthy();
  });

  it('zieht die Live-Werte im Takt nach', () => {
    vi.useFakeTimers();
    try {
      render(<Datenblock body={bodyIndex.earth!} niveau="grundschule" onModell={() => {}} />);
      const vorher = screen.getByText(/AE\)$/).textContent;
      act(() => { useStore.getState().setTime({ jd: DEFAULT_STATE.time.jd + 90 }); });
      expect(screen.getByText(/AE\)$/).textContent).toBe(vorher);
      act(() => { vi.advanceTimersByTime(300); });
      expect(screen.getByText(/AE\)$/).textContent).not.toBe(vorher);
    } finally {
      vi.useRealTimers();
    }
  });
});
