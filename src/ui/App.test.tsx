// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';
import { useStore, DEFAULT_STATE } from '../store';
import { useBogen } from './bogen';
import { SCHMAL_ABFRAGE } from './info/konstanten';

/** Kompaktmodus an: nur SCHMAL_ABFRAGE trifft zu. */
function kompakt(): void {
  vi.stubGlobal('matchMedia', (abfrage: string) => ({
    matches: abfrage === SCHMAL_ABFRAGE, media: abfrage,
    addEventListener: () => {}, removeEventListener: () => {},
  }));
}

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
afterEach(() => { vi.unstubAllGlobals(); useBogen.getState().setBogen(null); });

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
});
