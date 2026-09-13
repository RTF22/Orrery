// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Kopfzeile } from './Kopfzeile';
import { setSprache } from './i18n';
import { useStore, DEFAULT_STATE } from '../store';

describe('Kopfzeile', () => {
  beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
  afterEach(() => { setSprache('de'); });

  it('zeigt die aktive Sprache als gedrückt', () => {
    render(<Kopfzeile />);
    expect(screen.getByRole('button', { name: 'Deutsch (DE)' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'English (EN)' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('setzt die Sprache im Store', () => {
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'English (EN)' }));
    expect(useStore.getState().ui.language).toBe('en');
  });
});
