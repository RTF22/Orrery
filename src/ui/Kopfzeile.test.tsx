// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Kopfzeile } from './Kopfzeile';
import { setSprache } from './i18n';
import { useStore, DEFAULT_STATE } from '../store';
import { fromShareable } from '../store/serialize';
import { fragmentAuswerten } from '../store/deeplink';
import { themaVerfallStarten } from './info/themaVerfall';
import { cinemaAktiv, startCinema, stopCinema } from './cinemaControl';
import { useInfoKarte } from './infokarte/zustand';
import { GROB_ABFRAGE } from './info/konstanten';

/** Ersetzt matchMedia so, dass nur die angegebenen Abfragen zutreffen (wie in ui/infokarte/geraet.test.ts). */
function stubMatchMedia(...zutreffend: string[]): void {
  vi.stubGlobal('matchMedia', (abfrage: string) => ({
    matches: zutreffend.includes(abfrage), media: abfrage,
    addEventListener: () => {}, removeEventListener: () => {},
  }));
}

/** Zustand nach dem Zerlegen eines kopierten oder geteilten Links. */
function zurueckAusLink(link: string): ReturnType<typeof fromShareable> {
  const ergebnis = fragmentAuswerten(link.slice(link.indexOf('#')));
  return fromShareable(ergebnis?.patch ?? {});
}

describe('Kopfzeile', () => {
  beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
  afterEach(() => { setSprache('de'); useInfoKarte.setState({ offen: false }); });

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

  it('öffnet die Info-Karte über ⓘ', () => {
    useInfoKarte.setState({ offen: false, reiter: 'bedienung' });
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Info und Hilfe' }));
    expect(useInfoKarte.getState().offen).toBe(true);
  });

  it('setzt ⓘ links in die Zeile des Sprachschalters, im Stil der Sprachknöpfe', () => {
    render(<Kopfzeile />);
    const info = screen.getByRole('button', { name: 'Info und Hilfe' });
    const sprachen = screen.getByRole('group', { name: 'Sprache' });
    expect(info.parentElement).toBe(sprachen.parentElement);
    expect(info.parentElement?.firstElementChild).toBe(info);
    const en = screen.getByRole('button', { name: 'English (EN)' });
    expect(info.className).toBe(en.className);
  });
});

describe('Kopfzeile: Link kopieren und Zurücksetzen', () => {
  beforeEach(() => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
    Reflect.deleteProperty(navigator, 'share');
    vi.unstubAllGlobals();
    setSprache('de');
  });

  const mitZwischenablage = (): ReturnType<typeof vi.fn> => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    return writeText;
  };

  /** Attrappe für navigator.share; löst auf oder verwirft je nach Ergebnis. */
  const mitShare = (ergebnis: 'erfolg' | 'abbruch' | 'fehler'): ReturnType<typeof vi.fn> => {
    const share = vi.fn(async () => {
      if (ergebnis === 'erfolg') return Promise.resolve();
      if (ergebnis === 'abbruch') return Promise.reject(new DOMException('Abgebrochen', 'AbortError'));
      return Promise.reject(new Error('nicht verfügbar'));
    });
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    return share;
  };

  it('kopiert den Link, meldet „Kopiert" und lässt die Adresszeile sauber', async () => {
    const writeText = mitZwischenablage();
    useStore.getState().setScale({ sizeScale: 3 });
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Kopiert'); });
    expect(writeText).toHaveBeenCalledTimes(1);
    const link = writeText.mock.calls[0]?.[0] as string;
    expect(link.startsWith(`${window.location.origin}/#date=`)).toBe(true);
    expect(zurueckAusLink(link).scale.sizeScale).toBe(3);
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
    const zurueck = zurueckAusLink(link);
    expect(zurueck.quality.tier).toBe('auto');
    expect(zurueck.ui.hidden).toBe(false);
  });

  it('fällt ohne Zwischenablage auf die Adresszeile zurück', async () => {
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Adresse in der Adresszeile kopieren');
    });
    expect(window.location.hash.startsWith('#date=')).toBe(true);
    expect(window.location.hash).toContain('&p=');
  });

  it('teilt an Touchgeräten über navigator.share, ohne die Zwischenablage', async () => {
    stubMatchMedia(GROB_ABFRAGE);
    const writeText = mitZwischenablage();
    const share = mitShare('erfolg');
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(share).toHaveBeenCalledTimes(1); });
    const daten = share.mock.calls[0]?.[0] as { url: string; title: string };
    expect(daten.url.startsWith(`${window.location.origin}/#date=`)).toBe(true);
    expect(daten.title).toBe('Orrery');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('bricht der Nutzer die Freigabe ab, bleibt es still (keine Meldung)', async () => {
    stubMatchMedia(GROB_ABFRAGE);
    const writeText = mitZwischenablage();
    mitShare('abbruch');
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(navigator.share).toHaveBeenCalledTimes(1); });
    // Kein Timer wartet auf eine Meldung, die nie kommt — eine kurze Wartezeit reicht.
    await new Promise((r) => { setTimeout(r, 10); });
    expect(screen.getByRole('status').textContent).toBe('');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('scheitert die Freigabe aus anderem Grund, fällt es auf die Zwischenablage zurück', async () => {
    stubMatchMedia(GROB_ABFRAGE);
    const writeText = mitZwischenablage();
    mitShare('fehler');
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Kopiert'); });
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it('nutzt am Desktop die Zwischenablage, auch wenn der Browser navigator.share anbietet', async () => {
    stubMatchMedia(); // keine Abfrage trifft zu: grober Zeiger aus
    const writeText = mitZwischenablage();
    const share = mitShare('erfolg');
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
    await waitFor(() => { expect(writeText).toHaveBeenCalledTimes(1); });
    expect(share).not.toHaveBeenCalled();
  });

  it('blendet die Meldung nach zwei Sekunden aus', async () => {
    mitZwischenablage();
    vi.useFakeTimers();
    try {
      render(<Kopfzeile />);
      // Die Zwischenablage-Attrappe liefert ein Promise; zwei Mikrotask-
      // Umläufe reichen, bis „Kopiert" gesetzt ist (kein echter Timer nötig).
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Link kopieren' }));
        await Promise.resolve();
        await Promise.resolve();
      });
      expect(screen.getByRole('status').textContent).toBe('Kopiert');
      act(() => { vi.advanceTimersByTime(1999); });
      expect(screen.getByRole('status').textContent).toBe('Kopiert');
      act(() => { vi.advanceTimersByTime(1); });
      expect(screen.getByRole('status').textContent).toBe('');
    } finally {
      vi.useRealTimers();
    }
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

describe('Kopfzeile: Zurücksetzen aus dem Kino', () => {
  let abbestellen: (() => void) | null = null;

  beforeEach(() => {
    stopCinema();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    abbestellen = themaVerfallStarten();
  });
  afterEach(() => {
    abbestellen?.();
    abbestellen = null;
    stopCinema();
    setSprache('de');
  });

  it('beendet ein laufendes Kino und zeigt das Sonnensystem, auch wenn es schon gewählt war', () => {
    startCinema();
    // Etwa über den Verweis im Text der Szene systemblick.
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    render(<Kopfzeile />);
    fireEvent.click(screen.getByRole('button', { name: 'Zurücksetzen' }));
    const s = useStore.getState();
    expect(s.cinema.running).toBe(false);
    expect(cinemaAktiv()).toBe(false);
    expect(s.ui.info.thema).toBe('sonnensystem');
  });
});
