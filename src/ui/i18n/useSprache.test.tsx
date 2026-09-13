// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useSprache } from './useSprache';
import { t, setSprache } from './index';
import { useStore, DEFAULT_STATE } from '../../store';

function Probe(): React.JSX.Element {
  useSprache();
  return <p>{t('panel.time')}</p>;
}

describe('useSprache', () => {
  beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
  afterEach(() => { setSprache('de'); });

  it('zeichnet mit der Sprache aus dem Store und setzt lang und title', () => {
    render(<Probe />);
    expect(screen.getByText('Zeit')).toBeTruthy();
    expect(document.documentElement.lang).toBe('de');
    expect(document.title).toBe('Sonnensystem');

    act(() => { useStore.getState().setUi({ language: 'en' }); });
    expect(screen.getByText('Time')).toBeTruthy();
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Orrery');
  });
});
