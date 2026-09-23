// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CinemaPanel } from './CinemaPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { stopCinema } from '../cinemaControl';
import { SCENES } from '../../data/scenes';
import { t } from '../i18n';
import { sceneIndexFor } from '../../sim/director';

beforeEach(() => {
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

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

  const zeilen = (): HTMLElement[] => within(screen.getByTestId('szenenliste')).getAllByRole('button');
  const markiert = (): HTMLElement[] => zeilen().filter((k) => k.getAttribute('aria-current') === 'true');

  it('listet alle Szenen und markiert die laufende mit ●', () => {
    useStore.getState().setCinema({ running: true, nummer: 3, shuffle: false });
    render(<CinemaPanel />);
    expect(zeilen()).toHaveLength(SCENES.length);
    expect(markiert()).toHaveLength(1);
    expect(markiert()[0]!.textContent).toBe(`●${t(SCENES[3]!.titleKey)}`);
    for (const k of zeilen()) expect(k.textContent).not.toContain('['); // kein fehlender Sprachschlüssel
  });

  it('markiert bei stehendem Kino die Szene des nächsten Starts mit ○', () => {
    useStore.getState().setCinema({ running: false, nummer: 25, shuffle: false });
    render(<CinemaPanel />);
    expect(markiert()[0]!.textContent).toBe(`○${t(SCENES[25 % SCENES.length]!.titleKey)}`);
  });

  it('die Markierung folgt einem neuen Keim sofort', () => {
    useStore.getState().setCinema({ running: true, nummer: 4, shuffle: true });
    render(<CinemaPanel />);
    fireEvent.change(screen.getByLabelText(/Zufallskeim/), { target: { value: '4711' } });
    const index = sceneIndexFor(4, SCENES.length, 4711, true);
    expect(markiert()[0]!.textContent).toBe(`●${t(SCENES[index]!.titleKey)}`);
  });

  it('ein Klick startet das Kino ab dieser Szene', () => {
    useStore.getState().setCinema({ nummer: 5, shuffle: false });
    render(<CinemaPanel />);
    fireEvent.click(zeilen()[2]!);
    expect(useStore.getState().cinema).toMatchObject({ running: true, nummer: 2 + SCENES.length, elapsedSec: 0 });
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
