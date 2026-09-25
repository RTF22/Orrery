// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import { useStore, DEFAULT_STATE } from '../store';
import { useBogen } from './bogen';
import { SCHMAL_ABFRAGE } from './info/konstanten';
import { useMusikStand } from './musikStand';
import { useInfoKarte } from './infokarte/zustand';

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
});

describe('App', () => {
  it('setzt die Himmelskörper direkt unter die Kopfzeile', () => {
    const { container } = render(<App />);
    const kopfzeile = container.querySelector('header');
    // Die Kopfzeile sitzt mit dem Einklappknopf in einer eigenen Zeile der Seitenleiste.
    const naechstes = kopfzeile?.parentElement?.parentElement?.nextElementSibling;
    expect(naechstes?.querySelector('button')?.textContent).toContain('Himmelskörper');
  });

  it('nennt in der Kürzelübersicht den Flug', () => {
    useStore.getState().setUi({ panels: { ...DEFAULT_STATE.ui.panels, shortcuts: true } });
    render(<App />);
    expect(screen.getByText('W A S D')).toBeTruthy();
    expect(screen.getByText('Shift + W A S D')).toBeTruthy();
  });

  it('nennt in der Kürzelübersicht den Controller', () => {
    useStore.getState().setUi({ panels: { ...DEFAULT_STATE.ui.panels, shortcuts: true } });
    render(<App />);
    expect(screen.getByText('Controller')).toBeTruthy();
    expect(screen.getByText('Linker Stick')).toBeTruthy();
    expect(screen.getByText('Zum Objekt unter dem Fadenkreuz fahren')).toBeTruthy();
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

  it('blendet bei grobem Zeiger die Kürzelübersicht aus', () => {
    vi.stubGlobal('matchMedia', (abfrage: string) => ({
      matches: abfrage === '(pointer: coarse)', media: abfrage,
      addEventListener: () => {}, removeEventListener: () => {},
    }));
    useStore.getState().setUi({ panels: { ...DEFAULT_STATE.ui.panels, shortcuts: true } });
    render(<App />);
    expect(screen.queryByText('W A S D')).toBeNull();
  });

  it('nennt die Taste M in der Kürzelübersicht nur mit verfügbarer Musik', () => {
    useStore.getState().setUi({ panels: { ...DEFAULT_STATE.ui.panels, shortcuts: true } });
    const { unmount } = render(<App />);
    expect(screen.queryByText('Musik stumm schalten')).toBeNull();
    unmount();
    useMusikStand.setState({ verfuegbar: true });
    render(<App />);
    expect(screen.getByText('Musik stumm schalten')).toBeTruthy();
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
});
