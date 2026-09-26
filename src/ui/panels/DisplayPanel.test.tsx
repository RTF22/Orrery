// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DisplayPanel } from './DisplayPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCHLUESSEL_MERKEN, SCHLUESSEL_SITZUNG } from '../../store/persist';

describe('DisplayPanel: Sitzung merken', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  });

  const kasten = (): HTMLInputElement =>
    screen.getByRole('checkbox', { name: 'Sitzung merken' }) as HTMLInputElement;

  it('ist ohne Eintrag angehakt', () => {
    render(<DisplayPanel />);
    expect(kasten().checked).toBe(true);
  });

  it('Ausschalten schreibt die Präferenz und löscht die gesicherte Sitzung', () => {
    localStorage.setItem(SCHLUESSEL_SITZUNG, '{"time":{"paused":true}}');
    render(<DisplayPanel />);
    fireEvent.click(kasten());
    expect(kasten().checked).toBe(false);
    expect(localStorage.getItem(SCHLUESSEL_MERKEN)).toBe('0');
    expect(localStorage.getItem(SCHLUESSEL_SITZUNG)).toBeNull();
  });

  it('Einschalten entfernt die Präferenz', () => {
    localStorage.setItem(SCHLUESSEL_MERKEN, '0');
    render(<DisplayPanel />);
    expect(kasten().checked).toBe(false);
    fireEvent.click(kasten());
    expect(kasten().checked).toBe(true);
    expect(localStorage.getItem(SCHLUESSEL_MERKEN)).toBeNull();
  });
});

describe('DisplayPanel: Sitzung merken bleibt eingebettet verborgen (Fix-Runde 1)', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  });

  it('zeigt den Schalter nicht, wenn ui.eingebettet gesetzt ist', () => {
    const eingebettetesState = structuredClone(DEFAULT_STATE);
    eingebettetesState.ui.eingebettet = true;
    useStore.getState().replaceAll(eingebettetesState);
    render(<DisplayPanel />);
    expect(screen.queryByRole('checkbox', { name: 'Sitzung merken' })).toBeNull();
  });

  it('zeigt ihn wieder, sobald ui.eingebettet false ist', () => {
    render(<DisplayPanel />);
    expect(screen.getByRole('checkbox', { name: 'Sitzung merken' })).not.toBeNull();
  });
});

describe('DisplayPanel: Milchstraße', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  });

  it('zeigt das Kästchen angehakt und schaltet display.milchstrasse', () => {
    render(<DisplayPanel />);
    const kasten = screen.getByRole('checkbox', { name: 'Milchstraße' }) as HTMLInputElement;
    expect(kasten.checked).toBe(true);
    fireEvent.click(kasten);
    expect(useStore.getState().display.milchstrasse).toBe(false);
  });
});
