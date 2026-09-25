// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoKarte } from './InfoKarte';
import { useInfoKarte } from './zustand';

describe('InfoKarte', () => {
  beforeEach(() => { useInfoKarte.setState({ offen: false, reiter: 'bedienung' }); });

  it('zeichnet nichts, solange sie zu ist', () => {
    render(<InfoKarte />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('ist ein modaler, beschrifteter Dialog mit drei Reitern', () => {
    useInfoKarte.getState().oeffnen('bedienung');
    render(<InfoKarte />);
    const dialog = screen.getByRole('dialog', { name: 'Orrery' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const reiter = screen.getAllByRole('tab');
    expect(reiter.map((r) => r.textContent)).toEqual(['App', 'Bedienung', 'Über']);
    expect(screen.getByRole('tab', { name: 'Bedienung' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toContain('Bewegen im Sonnensystem');
  });

  it('setzt den Fokus auf den aktiven Reiter', () => {
    useInfoKarte.getState().oeffnen('ueber');
    render(<InfoKarte />);
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Über' }));
  });

  it('wechselt Reiter per Klick und Pfeiltaste', () => {
    useInfoKarte.getState().oeffnen('app');
    render(<InfoKarte />);
    fireEvent.click(screen.getByRole('tab', { name: 'Über' }));
    expect(useInfoKarte.getState().reiter).toBe('ueber');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Über' }), { key: 'ArrowRight' });
    expect(useInfoKarte.getState().reiter).toBe('app');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'App' }), { key: 'ArrowLeft' });
    expect(useInfoKarte.getState().reiter).toBe('ueber');
  });

  it('schließt über ✕, Escape und den Hintergrund, nicht über einen Klick in die Karte', () => {
    useInfoKarte.getState().oeffnen('app');
    const { rerender } = render(<InfoKarte />);
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
    expect(useInfoKarte.getState().offen).toBe(false);

    useInfoKarte.getState().oeffnen('app');
    rerender(<InfoKarte />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(useInfoKarte.getState().offen).toBe(false);

    useInfoKarte.getState().oeffnen('app');
    rerender(<InfoKarte />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(useInfoKarte.getState().offen).toBe(true);
    fireEvent.click(screen.getByTestId('infokarte-hintergrund'));
    expect(useInfoKarte.getState().offen).toBe(false);
  });

  it('gibt den Fokus beim Schließen an das auslösende Element zurück', () => {
    const knopf = document.createElement('button');
    document.body.appendChild(knopf);
    knopf.focus();
    useInfoKarte.getState().oeffnen('app');
    const { rerender } = render(<InfoKarte />);
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
    rerender(<InfoKarte />);
    expect(document.activeElement).toBe(knopf);
    knopf.remove();
  });

  it('wirft beim Schließen nicht und fokussiert nicht mehr, wenn der Auslöser nicht mehr im DOM hängt', () => {
    const knopf = document.createElement('button');
    document.body.appendChild(knopf);
    knopf.focus();
    const fokusSpion = vi.spyOn(knopf, 'focus');
    useInfoKarte.getState().oeffnen('app');
    const { rerender } = render(<InfoKarte />);
    knopf.remove();
    fokusSpion.mockClear();
    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
      rerender(<InfoKarte />);
    }).not.toThrow();
    expect(fokusSpion).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(knopf);
    fokusSpion.mockRestore();
  });

  it('hält Tab in der Karte', () => {
    useInfoKarte.getState().oeffnen('app');
    render(<InfoKarte />);
    // Fokussierbar sind hier nur ✕ und der aktive Reiter (die anderen tragen tabIndex −1).
    const schliessen = screen.getByRole('button', { name: 'Schließen' });
    const letzter = screen.getByRole('tab', { name: 'App' });
    letzter.focus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    expect(document.activeElement).toBe(schliessen);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(letzter);
  });
});
