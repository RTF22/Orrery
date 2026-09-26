// @vitest-environment jsdom
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReiterApp, ReiterBedienung, ReiterUeber } from './inhalte';
import { useInstallation } from './installation';
import { VERSION } from './version';
import { useInfoKarte } from './zustand';
import { useSteuerKarte } from '../steuerkarte/zustand';
import { padAttrappe } from '../steuerung/padAttrappe';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';

function zeiger(grob: boolean, app = false): void {
  window.matchMedia = ((abfrage: string) => ({
    matches: abfrage.includes('display-mode') ? app : abfrage.includes('coarse') ? grob : false,
    media: abfrage, addEventListener: () => {}, removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

const urspruenglicheMatchMedia = window.matchMedia;

describe('Reiter der Info-Karte', () => {
  beforeEach(() => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    useInstallation.setState({ ereignis: null });
    useInfoKarte.setState({ offen: true, reiter: 'app' });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    window.matchMedia = urspruenglicheMatchMedia;
    vi.unstubAllGlobals();
    Reflect.deleteProperty(navigator, 'getGamepads');
    setSprache('de');
  });

  it('App: drei Anleitungen, ohne Ereignis kein Installationsknopf', () => {
    zeiger(true);
    render(<ReiterApp />);
    expect(screen.getByText(/Android/)).toBeTruthy();
    expect(screen.getByText(/iPhone/)).toBeTruthy();
    expect(screen.getByText(/Computer/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Jetzt installieren' })).toBeNull();
  });

  it('App: mit Ereignis Knopf, Klick ruft prompt und blendet ihn aus', async () => {
    zeiger(true);
    const prompt = vi.fn(() => Promise.resolve());
    useInstallation.setState({
      ereignis: Object.assign(new Event('beforeinstallprompt'), {
        prompt, userChoice: Promise.resolve({ outcome: 'accepted' as const }),
      }),
    });
    render(<ReiterApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Jetzt installieren' }));
    expect(prompt).toHaveBeenCalledOnce();
    expect(await screen.findByText(/Android/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Jetzt installieren' })).toBeNull();
  });

  it('App: im App-Modus nur der Hinweis', () => {
    zeiger(true, true);
    render(<ReiterApp />);
    expect(screen.getByText('Orrery läuft als App.')).toBeTruthy();
    expect(screen.queryByText(/Android/)).toBeNull();
  });

  it('Bedienung: Touch zeigt Gesten, keine Tasten und ohne Controller keinen Knopf', () => {
    zeiger(true);
    vi.stubGlobal('isSecureContext', true);
    Object.defineProperty(navigator, 'getGamepads', { value: () => [], configurable: true });
    render(<ReiterBedienung />);
    expect(screen.getByText(/einem Finger/)).toBeTruthy();
    expect(screen.queryByText('Leertaste')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Alle Tastenkürzel und Controller' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Controller-Belegung' })).toBeNull();
  });

  it('Bedienung: Touch mit verbundenem Controller öffnet die Steuerungskarte mit Controller', () => {
    zeiger(true);
    vi.stubGlobal('isSecureContext', true);
    Object.defineProperty(navigator, 'getGamepads', { value: () => [padAttrappe()], configurable: true });
    render(<ReiterBedienung />);
    fireEvent.click(screen.getByRole('button', { name: 'Controller-Belegung' }));
    expect(useInfoKarte.getState().offen).toBe(false);
    expect(useSteuerKarte.getState().offen).toBe(true);
    expect(useSteuerKarte.getState().reiter).toBe('controller');
    useSteuerKarte.setState({ offen: false });
  });

  it('Bedienung: Maus zeigt Tasten und öffnet die vollständige Übersicht', () => {
    zeiger(false);
    render(<ReiterBedienung />);
    expect(screen.getByText('Leertaste')).toBeTruthy();
    expect(screen.queryByText(/einem Finger/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Alle Tastenkürzel und Controller' }));
    expect(useInfoKarte.getState().offen).toBe(false);
    expect(useSteuerKarte.getState().offen).toBe(true);
    useSteuerKarte.setState({ offen: false });
  });

  it('Über: Links in neuem Tab, Rechte, Version', () => {
    render(<ReiterUeber />);
    const links = screen.getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      'https://github.com/RTF22/Orrery',
      `${import.meta.env.BASE_URL}doku/making-of/de/`,
      'https://github.com/RTF22/Orrery/blob/master/ASSETS.md',
    ]);
    for (const a of links) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
      expect(a.textContent).toContain('(öffnet in neuem Tab)');
    }
    expect(screen.getByText(/alle Rechte vorbehalten/)).toBeTruthy();
    expect(screen.getByText(/CC BY-NC 3.0 IGO/)).toBeTruthy();
    expect(screen.getByText(/Version/).textContent).toContain(VERSION);
  });

  it('Über: Making-of-Link folgt der App-Sprache Deutsch', () => {
    useStore.getState().setUi({ language: 'de' });
    setSprache('de');
    render(<ReiterUeber />);
    const link = screen.getByRole('link', { name: /Wie Orrery entstand/ });
    expect(link.getAttribute('href')).toBe(`${import.meta.env.BASE_URL}doku/making-of/de/`);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('Über: Making-of-Link folgt der App-Sprache Englisch', () => {
    useStore.getState().setUi({ language: 'en' });
    setSprache('en');
    render(<ReiterUeber />);
    const link = screen.getByRole('link', { name: /How Orrery was built/ });
    expect(link.getAttribute('href')).toBe(`${import.meta.env.BASE_URL}doku/making-of/en/`);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });
});
