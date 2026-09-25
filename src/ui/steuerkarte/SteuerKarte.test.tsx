// @vitest-environment jsdom
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SteuerKarte } from './SteuerKarte';
import { useSteuerKarte } from './zustand';
import { useInfoKarte } from '../infokarte/zustand';
import { useMusikStand } from '../musikStand';
import { handleShortcut } from '../shortcuts/useShortcuts';
import { useStore, DEFAULT_STATE } from '../../store';

describe('SteuerKarte', () => {
  beforeEach(() => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    useSteuerKarte.setState({ offen: false, reiter: 'tastatur' });
    useInfoKarte.setState({ offen: false, reiter: 'bedienung' });
    useMusikStand.setState({ verfuegbar: false });
  });
  afterEach(() => {
    useSteuerKarte.setState({ offen: false });
    useInfoKarte.setState({ offen: false });
    useMusikStand.setState({ verfuegbar: false });
  });

  it('öffnet über ? mit dem Reiter Tastatur', () => {
    render(<SteuerKarte />);
    act(() => { expect(handleShortcut('?')).toBe(true); });
    expect(screen.getByRole('dialog', { name: 'Steuerung' })).toBeTruthy();
    expect(screen.getAllByRole('tab').map((r) => r.textContent)).toEqual(['Tastatur', 'Controller']);
    expect(screen.getByRole('tab', { name: 'Tastatur' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Vollbild')).toBeTruthy();
    expect(screen.getByText('Fliegen: vor, links, zurück, rechts')).toBeTruthy();
  });

  it('öffnet direkt mit dem übergebenen Reiter', () => {
    useSteuerKarte.getState().oeffnen('controller');
    expect(useSteuerKarte.getState().offen).toBe(true);
    expect(useSteuerKarte.getState().reiter).toBe('controller');
  });

  it('zeigt M nur mit Musik des Betreibers', () => {
    useSteuerKarte.getState().oeffnen();
    const { rerender } = render(<SteuerKarte />);
    expect(screen.queryByText('Musik stumm schalten')).toBeNull();
    act(() => { useMusikStand.setState({ verfuegbar: true }); });
    rerender(<SteuerKarte />);
    expect(screen.getByText('Musik stumm schalten')).toBeTruthy();
  });

  it('wechselt auf Controller und schließt mit Escape', () => {
    useSteuerKarte.getState().oeffnen();
    render(<SteuerKarte />);
    fireEvent.click(screen.getByRole('tab', { name: 'Controller' }));
    expect(useSteuerKarte.getState().reiter).toBe('controller');
    expect(screen.getByRole('dialog').textContent).toContain('A: zum Objekt fahren');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(useSteuerKarte.getState().offen).toBe(false);
  });

  it('sperrt die Tastenkürzel, solange sie offen ist', () => {
    useSteuerKarte.getState().oeffnen();
    const hidden = useStore.getState().ui.hidden;
    expect(handleShortcut('h')).toBe(false);
    expect(useStore.getState().ui.hidden).toBe(hidden);
  });

  it('öffnet nicht über ?, solange die Info-Karte offen ist', () => {
    useInfoKarte.setState({ offen: true, reiter: 'bedienung' });
    expect(handleShortcut('?')).toBe(false);
    expect(useSteuerKarte.getState().offen).toBe(false);
  });
});
