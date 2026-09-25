// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import { useStore, DEFAULT_STATE } from '../store';
import { useBogen } from './bogen';
import { SCHMAL_ABFRAGE } from './info/konstanten';
import { useMusikStand } from './musikStand';
import { useInfoKarte } from './infokarte/zustand';
import { useSteuerKarte } from './steuerkarte/zustand';

/** Kompaktmodus an: nur SCHMAL_ABFRAGE trifft zu. */
function kompakt(): void {
  vi.stubGlobal('matchMedia', (abfrage: string) => ({
    matches: abfrage === SCHMAL_ABFRAGE, media: abfrage,
    addEventListener: () => {}, removeEventListener: () => {},
  }));
}

beforeEach(() => {
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  useMusikStand.setState({ verfuegbar: false, aktuell: null });
});
afterEach(() => {
  vi.unstubAllGlobals();
  useBogen.getState().setBogen(null);
  useInfoKarte.setState({ offen: false });
  useSteuerKarte.setState({ offen: false });
});

describe('App', () => {
  it('setzt die Himmelskörper direkt unter die Kopfzeile', () => {
    const { container } = render(<App />);
    const kopfzeile = container.querySelector('header');
    // Die Kopfzeile sitzt mit dem Einklappknopf in einer eigenen Zeile der Seitenleiste.
    const naechstes = kopfzeile?.parentElement?.parentElement?.nextElementSibling;
    expect(naechstes?.querySelector('button')?.textContent).toContain('Himmelskörper');
  });

  it('zeigt bei eingeklappter Leiste (etwa aus der Sitzung) nur den Reiter', () => {
    useStore.getState().setUi({ panels: { ...DEFAULT_STATE.ui.panels, leiste: false } });
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Link kopieren' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Bedienung öffnen' }));
    expect(screen.getByRole('button', { name: 'Link kopieren' })).toBeTruthy();
  });

  it('zeigt im Kompaktmodus die Bogenreiter, aber keine Spalte', () => {
    kompakt();
    render(<App />);
    expect(screen.getByRole('button', { name: 'Bedienung' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Link kopieren' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Bedienung' }));
    expect(screen.getByRole('button', { name: 'Link kopieren' })).toBeTruthy();
  });

  it('lässt ui.panels beim Wechsel in den Kompaktmodus unberührt', () => {
    const vorher = structuredClone(useStore.getState().ui.panels);
    kompakt();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Info' }));
    expect(useStore.getState().ui.panels).toEqual(vorher);
  });

  it('zeigt eine offene Info-Karte auch bei ausgeblendeter Oberfläche', () => {
    useStore.getState().setUi({ hidden: true });
    useInfoKarte.setState({ offen: true, reiter: 'ueber' });
    render(<App />);
    expect(screen.getByRole('dialog', { name: 'Orrery' })).toBeTruthy();
  });

  it('legt die UI-Ebene bei offener Info-Karte mit inert still', () => {
    render(<App />);
    const ebene = () => document.querySelector('.ui-ebene');
    expect(ebene()?.hasAttribute('inert')).toBe(false);
    act(() => { useInfoKarte.getState().oeffnen('app'); });
    expect(ebene()?.hasAttribute('inert')).toBe(true);
    act(() => { useInfoKarte.getState().schliessen(); });
    expect(ebene()?.hasAttribute('inert')).toBe(false);
  });

  it('legt die UI-Ebene bei offener Steuerungskarte mit inert still', () => {
    render(<App />);
    const ebene = () => document.querySelector('.ui-ebene');
    expect(ebene()?.hasAttribute('inert')).toBe(false);
    act(() => { useSteuerKarte.getState().oeffnen(); });
    expect(ebene()?.hasAttribute('inert')).toBe(true);
    act(() => { useSteuerKarte.getState().schliessen(); });
    expect(ebene()?.hasAttribute('inert')).toBe(false);
  });

  it('behält denselben Dialogknoten über einen Sichtbarkeitswechsel und gibt den Fokus beim Schließen zurück', () => {
    // Ein externer Knopf steht hier für das auslösende Element (etwa ⓘ):
    // Der echte ⓘ-Knopf läge in der ausblendbaren Ebene und verschwände beim
    // Ausblenden selbst — dann verlöre auch der Test das Ziel der Fokusrückgabe.
    const knopf = document.createElement('button');
    document.body.appendChild(knopf);
    knopf.focus();
    render(<App />);
    act(() => { useInfoKarte.getState().oeffnen('app'); });
    const dialog = screen.getByRole('dialog', { name: 'Orrery' });

    // Die Info-Karte steht an fester Stelle im Baum (App.tsx): Ein Wechsel
    // der ausblendbaren Ebene hängt sie nicht neu ein.
    act(() => { useStore.getState().setUi({ hidden: true }); });
    expect(screen.getByRole('dialog', { name: 'Orrery' })).toBe(dialog);

    act(() => { useStore.getState().setUi({ hidden: false }); });
    expect(screen.getByRole('dialog', { name: 'Orrery' })).toBe(dialog);

    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
    expect(document.activeElement).toBe(knopf);
    knopf.remove();
  });

  it('übersetzt eine offene Info-Karte beim Sprachwechsel sofort', () => {
    useInfoKarte.setState({ offen: true, reiter: 'bedienung' });
    render(<App />);
    expect(screen.getByRole('tab', { name: 'Bedienung' })).toBeTruthy();
    act(() => { useStore.getState().setUi({ language: 'en' }); });
    expect(screen.getByRole('tab', { name: 'Controls' })).toBeTruthy();
    act(() => { useStore.getState().setUi({ language: 'de' }); });
    useInfoKarte.setState({ offen: false });
  });

  it('wechselt von der Info-Karte über „Alle Tastenkürzel und Controller" zur Steuerungskarte und zurück', () => {
    render(<App />);
    const infoKnopf = screen.getByRole('button', { name: 'Info und Hilfe' });
    infoKnopf.focus();
    fireEvent.click(infoKnopf);
    expect(useInfoKarte.getState().offen).toBe(true);

    fireEvent.click(screen.getByRole('tab', { name: 'Bedienung' }));
    fireEvent.click(screen.getByRole('button', { name: 'Alle Tastenkürzel und Controller' }));

    expect(useInfoKarte.getState().offen).toBe(false);
    expect(screen.getByRole('dialog', { name: 'Steuerung' })).toBeTruthy();
    const reiterTastatur = screen.getByRole('tab', { name: 'Tastatur' });
    expect(document.activeElement).toBe(reiterTastatur);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(useSteuerKarte.getState().offen).toBe(false);
    expect(document.activeElement).toBe(infoKnopf);
  });

  it('breit: kein Hilfe-Knopf', () => {
    render(<App />);
    expect(document.querySelector('.hilfeknopf')).toBeNull();
  });

  it('schmal: Hilfe-Knopf öffnet die Info-Karte', () => {
    kompakt();
    render(<App />);
    const knopf = document.querySelector('.hilfeknopf');
    expect(knopf).toBeTruthy();
    fireEvent.click(knopf!);
    expect(useInfoKarte.getState().offen).toBe(true);
  });
});
