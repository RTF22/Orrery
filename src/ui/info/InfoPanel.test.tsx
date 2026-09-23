// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { InfoPanel, INFO_PANEL } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen, fahreZuSystem } from '../kamerafahrt';
import { zurueckgesetzt } from '../../store/persist';
import { themaVerfallStarten } from './themaVerfall';
import { UEBERSCHRIFT_STREIFEN, UEBERSCHRIFT_TEXT } from '../ueberschrift';

// Der Themenverfall ist ein Store-Abonnement (themaVerfall.ts), das
// app/main.tsx einmal startet; ohne es verfiele hier kein Thema.
let abbestellen: (() => void) | null = null;

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  abbestellen = themaVerfallStarten();
  setSprache('de');
});
afterEach(() => {
  abbestellen?.();
  abbestellen = null;
  setSprache('de');
});

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

  it('Wurzel des Objektbaums und Zurücksetzen zeigen das Sonnensystem, obwohl das Ziel wechselt', async () => {
    useStore.getState().setCamera({ targetId: 'mars' });
    render(<InfoPanel />);
    expect(await titel('Mars')).toBeTruthy();
    act(() => { fahreZuSystem(); });
    fahrtAbbrechen();
    expect(useStore.getState().ui.info.thema).toBe('sonnensystem');
    expect(await titel('Das Sonnensystem')).toBeTruthy();
    act(() => { useStore.getState().setCamera({ targetId: 'mars' }); });
    expect(useStore.getState().ui.info.thema).toBeNull();
    expect(await titel('Mars')).toBeTruthy();
    act(() => { useStore.getState().replaceAll(zurueckgesetzt(useStore.getState())); });
    expect(useStore.getState().ui.info.thema).toBe('sonnensystem');
    expect(await titel('Das Sonnensystem')).toBeTruthy();
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

  it('Standort und Blickziel der Szene tragen data-verweis wie die Verweise im Text', async () => {
    // Mondfinsternis: Standort Mond, Blickziel Erde.
    useStore.getState().setCinema({ running: true, shuffle: false, nummer: 18 });
    render(<InfoPanel />);
    await titel('Szene: Mondfinsternis');
    const kopf = screen.getByText('Standort').closest('dl') as HTMLElement;
    const knoepfe = [...kopf.querySelectorAll('button')].map((b) => [b.textContent, b.getAttribute('data-verweis')]);
    expect(knoepfe).toEqual([['Mond', 'objekt:moon'], ['Erde', 'objekt:earth']]);
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

  it('trägt im Kopf denselben Überschriftenstil wie die Panels', async () => {
    render(<InfoPanel />);
    const h2 = await titel('Sonne');
    expect(h2.classList).toContain(UEBERSCHRIFT_TEXT);
    const kopf = h2.closest('header') as HTMLElement;
    for (const klasse of UEBERSCHRIFT_STREIFEN.split(' ')) expect(kopf.classList).toContain(klasse);
  });
});
