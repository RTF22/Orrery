// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { useStore, DEFAULT_STATE } from '../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('App', () => {
  it('setzt die Himmelskörper direkt unter die Kopfzeile', () => {
    const { container } = render(<App />);
    const kopfzeile = container.querySelector('header');
    const naechstes = kopfzeile?.nextElementSibling;
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
});
