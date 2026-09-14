// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Kopfzeile } from './Kopfzeile';
import { setSprache } from './i18n';
import { useStore, DEFAULT_STATE } from '../store';
import { decodeState } from '../store/serialize';

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

describe('Kopfzeile: Link kopieren und Zurücksetzen', () => {
  beforeEach(() => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
    setSprache('de');
  });

  const mitZwischenablage = (): ReturnType<typeof vi.fn> => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    return writeText;
  };

  it('kopiert den Link, meldet „Kopiert" und lässt die Adresszeile sauber', async () => {
    const writeText = mitZwischenablage();
    useStore.getState().setScale({ sizeScale: 3 });
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Kopiert'); });
    expect(writeText).toHaveBeenCalledTimes(1);
    const link = writeText.mock.calls[0]?.[0] as string;
    expect(link.startsWith(`${window.location.origin}/#p=`)).toBe(true);
    expect(decodeState(link.slice(link.indexOf('#p=') + 3)).scale.sizeScale).toBe(3);
    expect(window.location.hash).toBe('');
  });

  it('lässt Qualitätsstufe und Bedienzustand nicht in den Link', async () => {
    const writeText = mitZwischenablage();
    useStore.setState({ quality: { tier: 'high' } });
    useStore.getState().setUi({ hidden: true });
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(writeText).toHaveBeenCalledTimes(1); });
    const link = writeText.mock.calls[0]?.[0] as string;
    const zurueck = decodeState(link.slice(link.indexOf('#p=') + 3));
    expect(zurueck.quality.tier).toBe('auto');
    expect(zurueck.ui.hidden).toBe(false);
  });

  it('fällt ohne Zwischenablage auf die Adresszeile zurück', async () => {
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Adresse in der Adresszeile kopieren');
    });
    expect(window.location.hash.startsWith('#p=')).toBe(true);
  });

  it('blendet die Meldung nach zwei Sekunden aus', async () => {
    mitZwischenablage();
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Kopiert'); });
    await waitFor(
      () => { expect(screen.getByRole('status').textContent).toBe(''); },
      { timeout: 3000 },
    );
  });

  it('setzt zurück und behält Sprache und Qualitätsstufe', () => {
    useStore.setState({ quality: { tier: 'high' } });
    useStore.getState().setUi({ language: 'en' });
    useStore.getState().setScale({ sizeScale: 3 });
    useStore.getState().toggleVisible('mars');
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Zurücksetzen' }));
    const s = useStore.getState();
    expect(s.scale.sizeScale).toBe(DEFAULT_STATE.scale.sizeScale);
    expect(s.visible).toEqual({});
    expect(s.ui.language).toBe('en');
    expect(s.quality.tier).toBe('high');
  });
});
