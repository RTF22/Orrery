// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CinemaPanel } from './CinemaPanel';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('CinemaPanel', () => {
  it('startet und beendet den Kino-Modus', () => {
    render(<CinemaPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Kino starten/ }));
    expect(useStore.getState().cinema.running).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Kino beenden/ }));
    expect(useStore.getState().cinema.running).toBe(false);
  });

  it('springt zur nächsten Szene', () => {
    render(<CinemaPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Nächste Szene/ }));
    expect(useStore.getState().cinema.nummer).toBe(1);
  });

  it('zeigt den Titel der laufenden Szene', () => {
    useStore.getState().setCinema({ running: true, nummer: 0 });
    render(<CinemaPanel />);
    const titel = screen.getByTestId('cinema-titel').textContent ?? '';
    expect(titel.length).toBeGreaterThan(3);
    expect(titel).not.toContain('['); // kein fehlender Sprachschlüssel
  });

  it('übernimmt einen eingegebenen Zufallskeim', () => {
    render(<CinemaPanel />);
    fireEvent.change(screen.getByLabelText(/Zufallskeim/), { target: { value: '4711' } });
    expect(useStore.getState().cinema.seed).toBe(4711);
  });

  it('schaltet das Mischen um', () => {
    render(<CinemaPanel />);
    fireEvent.click(screen.getByLabelText(/Szenen mischen/));
    expect(useStore.getState().cinema.shuffle).toBe(false);
  });
});
