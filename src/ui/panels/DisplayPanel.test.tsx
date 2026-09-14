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
