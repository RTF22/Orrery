// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { InfoPanel, INFO_PANEL } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  setSprache('de');
});
afterEach(() => { setSprache('de'); });

const titel = (name: string): Promise<HTMLElement> => screen.findByRole('heading', { level: 2, name });

describe('InfoPanel', () => {
  it('lädt den Text zum Kameraziel, zeigt Titel, Datenblock, Tabs und Quellen', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    expect(await titel('Erde')).toBeTruthy();
    expect(screen.getByTestId('datenblock')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Gymnasium', selected: true })).toBeTruthy();
    expect(await screen.findByText(/Astronomischen Einheit/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Erde: Faktenblatt \(NSSDC\)/ })).toBeTruthy();
    // Die Überschrift der Datei steht nicht noch einmal im Text.
    expect(screen.getAllByRole('heading', { name: 'Erde' })).toHaveLength(1);
  });

  it('Tabs schalten das Niveau, Pfeiltasten wandern', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    await titel('Erde');
    fireEvent.click(screen.getByRole('tab', { name: 'Grundschule' }));
    expect(useStore.getState().ui.info.niveau).toBe('grundschule');
    expect(await titel('Die Erde')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Grundschule' }), { key: 'ArrowRight' });
    expect(useStore.getState().ui.info.niveau).toBe('gymnasium');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Gymnasium' }), { key: 'ArrowLeft' });
    expect(useStore.getState().ui.info.niveau).toBe('grundschule');
  });

  it('Hochschule ohne Text zeigt den Gymnasialtext mit Hinweis', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    useStore.getState().setInfo({ niveau: 'hochschule' });
    render(<InfoPanel />);
    expect(await screen.findByText(/Der Hochschultext folgt/)).toBeTruthy();
    expect(await screen.findByText(/Astronomischen Einheit/)).toBeTruthy();
    expect(screen.getByText('Große Halbachse')).toBeTruthy();
  });

  it('ohne Text: Datenblock, Ausweichtitel und Hinweis', async () => {
    useStore.getState().setCamera({ targetId: 'pluto' });
    render(<InfoPanel />);
    expect(await titel('Pluto')).toBeTruthy();
    expect(await screen.findByText('Zu diesem Eintrag gibt es noch keinen Text.')).toBeTruthy();
    expect(screen.getByText('Keine Quellen zu diesem Text.')).toBeTruthy();
  });

  it('Themenverweis wechselt den Text; ein Zielwechsel löscht das Thema', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    fireEvent.click(await screen.findByRole('button', { name: 'Mondfinsternis' }));
    expect(useStore.getState().ui.info.thema).toBe('finsternis');
    expect(await titel('Finsternisse')).toBeTruthy();
    act(() => { useStore.getState().setCamera({ targetId: 'mars' }); });
    expect(useStore.getState().ui.info.thema).toBeNull();
    expect(await titel('Mars')).toBeTruthy();
  });

  it('Objektverweis fährt die Kamera und wechselt den Text', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    fireEvent.click(await screen.findByRole('button', { name: 'Mond' }));
    expect(useStore.getState().camera.targetId).toBe('moon');
    expect(await titel('Mond')).toBeTruthy();
    fahrtAbbrechen();
  });

  it('Quellenverweis hebt die Karte hervor', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    fireEvent.click(await screen.findByRole('link', { name: 'NSSDC Earth Fact Sheet' }));
    expect(screen.getByRole('link', { name: /Erde: Faktenblatt \(NSSDC\)/ }).className).toContain('border-sky-300');
  });

  it('im laufenden Kino zeigt es die Szene mit Standort und Blickziel', async () => {
    useStore.getState().setCinema({ running: true, shuffle: false, nummer: 18 });
    render(<InfoPanel />);
    expect(await titel('Szene: Mondfinsternis')).toBeTruthy();
    expect(screen.getByText('Standort')).toBeTruthy();
    expect(screen.queryByTestId('datenblock')).toBeNull();
  });

  it('Griffe schreiben Breite und Teilung in den Store', async () => {
    render(<InfoPanel />);
    await titel('Sonne');
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Breite des Infopanels' }), { key: 'ArrowLeft' });
    expect(useStore.getState().ui.info.breiteRem).toBe(25);
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Teilung zwischen Text und Quellen' }), { key: 'ArrowUp' });
    expect(useStore.getState().ui.info.teilung).toBe(0.6);
  });

  it('Breite wird auf 60 % der Fensterbreite gekappt', async () => {
    useStore.getState().setInfo({ breiteRem: 100 });
    render(<InfoPanel />);
    await titel('Sonne');
    const aside = document.querySelector('aside.info-panel') as HTMLElement;
    // jsdom-Fensterbreite 1024: floor(1024 · 0,6 / 16) = 38.
    expect(aside.style.width).toBe('38rem');
    const griff = screen.getByRole('separator', { name: 'Breite des Infopanels' });
    expect(griff.getAttribute('aria-valuenow')).toBe('38');
    expect(griff.getAttribute('aria-valuemax')).toBe('38');
  });

  it('füllt die Fensterhöhe (Griff-Höhe hängt daran)', async () => {
    render(<InfoPanel />);
    await titel('Sonne');
    const aside = document.querySelector('aside.info-panel') as HTMLElement;
    expect(aside.className.split(' ')).toContain('h-full');
  });

  it('Höchstbreite folgt dem Fenster', async () => {
    useStore.getState().setInfo({ breiteRem: 100 });
    render(<InfoPanel />);
    await titel('Sonne');
    const urspruenglich = window.innerWidth;
    try {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 640 });
      act(() => { window.dispatchEvent(new Event('resize')); });
      const aside = document.querySelector('aside.info-panel') as HTMLElement;
      // floor(640 · 0,6 / 16) = 24.
      expect(aside.style.width).toBe('24rem');
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: urspruenglich });
    }
  });

  it('klappt zu und auf', async () => {
    render(<InfoPanel />);
    await titel('Sonne');
    fireEvent.click(screen.getByRole('button', { name: 'Infopanel ausblenden' }));
    expect(useStore.getState().ui.panels[INFO_PANEL]).toBe(false);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Infopanel einblenden' }));
    expect(useStore.getState().ui.panels[INFO_PANEL]).toBe(true);
    expect(await titel('Sonne')).toBeTruthy();
  });

  it('zeigt englische Texte', async () => {
    useStore.getState().setUi({ language: 'en' });
    setSprache('en');
    useStore.getState().setCamera({ targetId: 'saturn' });
    render(<InfoPanel />);
    expect(await screen.findByText(/second largest/)).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Secondary school' })).toBeTruthy();
  });
});
