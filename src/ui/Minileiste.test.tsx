// @vitest-environment jsdom
import {
  describe, it, expect, beforeEach, afterEach, vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Minileiste, KnopfZurueck } from './Minileiste';
import { useStore, DEFAULT_STATE } from '../store';
import { startCinema, stopCinema, noteUserInput } from './cinemaControl';
import { tickCinema } from '../app/cinema';
import { useInfoKarte } from './infokarte/zustand';
import { useSteuerKarte } from './steuerkarte/zustand';

beforeEach(() => {
  // stopCinema zuerst: löscht den von einem vorigen Test gemerkten
  // Zustand (vorKino) im Modul cinemaControl.ts (wie in dessen eigenen Tests).
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});
afterEach(() => {
  stopCinema();
  useInfoKarte.setState({ offen: false });
  useSteuerKarte.setState({ offen: false });
});

describe('Minileiste', () => {
  it('fehlt, solange die Oberfläche eingeblendet ist', () => {
    render(<Minileiste untaetig={false} />);
    expect(screen.queryByRole('button', { name: 'Zeit anhalten' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Vollbild' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Oberfläche einblenden' })).toBeNull();
  });

  it('erscheint bei ausgeblendeter Oberfläche mit drei Knöpfen', () => {
    useStore.getState().setUi({ hidden: true });
    render(<Minileiste untaetig={false} />);
    expect(screen.getByRole('button', { name: 'Zeit anhalten' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Vollbild' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Oberfläche einblenden' })).toBeTruthy();
  });

  it('blendet nach Ruhe aus (untaetig kommt von außen, kein eigener Wächter)', () => {
    useStore.getState().setUi({ hidden: true });
    render(<Minileiste untaetig />);
    expect(screen.queryByRole('button', { name: 'Zeit anhalten' })).toBeNull();
  });

  it('schaltet mit dem Zeit-Knopf time.paused um und wechselt die Beschriftung', () => {
    useStore.getState().setUi({ hidden: true });
    render(<Minileiste untaetig={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Zeit anhalten' }));
    expect(useStore.getState().time.paused).toBe(true);
    expect(screen.getByRole('button', { name: 'Zeit starten' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Zeit starten' }));
    expect(useStore.getState().time.paused).toBe(false);
  });

  it('blendet mit „Oberfläche einblenden" ui.hidden wieder aus', () => {
    useStore.getState().setUi({ hidden: true });
    render(<Minileiste untaetig={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Oberfläche einblenden' }));
    expect(useStore.getState().ui.hidden).toBe(false);
  });

  it('schaltet mit dem Vollbild-Knopf dieselbe Funktion wie Taste F', () => {
    useStore.getState().setUi({ hidden: true });
    // jsdom kennt fullscreenElement zwar (Wert zunächst undefined statt
    // null, siehe useShortcuts.ts), lässt es sich aber wie in
    // cinemaControl.test.ts konfigurierbar überschreiben.
    Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true });
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: requestFullscreen, configurable: true,
    });
    try {
      render(<Minileiste untaetig={false} />);
      fireEvent.click(screen.getByRole('button', { name: 'Vollbild' }));
      expect(requestFullscreen).toHaveBeenCalledTimes(1);
    } finally {
      Reflect.deleteProperty(document.documentElement, 'requestFullscreen');
      Reflect.deleteProperty(document, 'fullscreenElement');
    }
  });

  it('ist bei offener Info-Karte gesperrt wie die übrige Oberfläche (inert)', () => {
    useStore.getState().setUi({ hidden: true });
    render(<Minileiste untaetig={false} />);
    expect(document.querySelector('.minileiste')?.hasAttribute('inert')).toBe(false);
    useInfoKarte.setState({ offen: true });
    render(<Minileiste untaetig={false} />);
    expect(document.querySelector('.minileiste')?.hasAttribute('inert')).toBe(true);
  });

  // Fix-Runde 1, C1: tickCinema (app/cinema.ts) setzt time.paused bei
  // laufendem Kino jedes Bild zurück — ein reines setTime({ paused: true })
  // aus der Leiste wäre dann wirkungslos. Der Knopf muss deshalb bei
  // laufendem oder nur durch Eingabe angehaltenem Kino denselben Weg wie
  // der Start/Stopp-Knopf des Kino-Panels gehen (stopCinema).
  it('beendet bei laufendem Kino den Film, statt nur time.paused zu setzen', () => {
    useStore.getState().setUi({ hidden: true });
    startCinema();
    render(<Minileiste untaetig={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Kino beenden' }));
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).not.toBe('cinema');
    // Anders als ein reines time.paused übersteht das den nächsten Bildtakt:
    // tickCinema tut ohne laufendes Kino nichts mehr.
    tickCinema(1);
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().time.paused).toBe(false);
  });

  it('zeigt „Kino beenden" auch, wenn eine Eingabe das Kino nur angehalten hat (camera.mode noch cinema)', () => {
    useStore.getState().setUi({ hidden: true });
    startCinema();
    noteUserInput(); // Standard pauseOnInput: cinema.running wird false, camera.mode bleibt 'cinema'.
    expect(useStore.getState().cinema.running).toBe(false);
    expect(useStore.getState().camera.mode).toBe('cinema');
    render(<Minileiste untaetig={false} />);
    expect(screen.getByRole('button', { name: 'Kino beenden' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Zeit anhalten' })).toBeNull();
  });

  it('schaltet ohne Kino weiterhin nur time.paused um', () => {
    useStore.getState().setUi({ hidden: true });
    render(<Minileiste untaetig={false} />);
    expect(screen.queryByRole('button', { name: 'Kino beenden' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Zeit anhalten' }));
    expect(useStore.getState().time.paused).toBe(true);
    expect(useStore.getState().cinema.running).toBe(false);
  });
});

describe('KnopfZurueck', () => {
  it('fehlt außerhalb des iframes', () => {
    render(<KnopfZurueck ueberBogenreiter={false} />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('erscheint eingebettet, mit target/rel und lesbarem Ziel ab Fokus', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.ui.eingebettet = true;
    useStore.getState().replaceAll(state);
    render(<KnopfZurueck ueberBogenreiter={false} />);
    const link = screen.getByRole('link', { name: 'Auf orrery3d.de öffnen' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');
    fireEvent.focus(link);
    expect(link.getAttribute('href')).toMatch(/^https:\/\/orrery3d\.de\/#/);
  });

  it('bildet beim Klick den aktuellen Zustand ab', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.ui.eingebettet = true;
    state.camera.mode = 'attached';
    state.camera.targetId = 'mars';
    useStore.getState().replaceAll(state);
    render(<KnopfZurueck ueberBogenreiter={false} />);
    const link = screen.getByRole('link', { name: 'Auf orrery3d.de öffnen' });
    fireEvent.click(link);
    expect(link.getAttribute('href')).toContain('body=mars');
  });

  it('bleibt auch bei eingeblendeter voller Oberfläche und in Ruhe sichtbar', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.ui.eingebettet = true;
    state.ui.hidden = false;
    useStore.getState().replaceAll(state);
    render(<KnopfZurueck ueberBogenreiter={false} />);
    expect(screen.getByRole('link', { name: 'Auf orrery3d.de öffnen' })).toBeTruthy();
  });

  it('ist bei offener Steuerungskarte gesperrt wie die übrige Oberfläche (inert)', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.ui.eingebettet = true;
    useStore.getState().replaceAll(state);
    useSteuerKarte.setState({ offen: true });
    render(<KnopfZurueck ueberBogenreiter={false} />);
    expect(screen.getByRole('link', { name: 'Auf orrery3d.de öffnen' }).hasAttribute('inert')).toBe(true);
  });

  // Fix-Runde 1, C2: Mittelklick (auxclick statt click, kein vorheriger
  // Fokus), Rechtsklick-Kontextmenü und langes Drücken auf Touch lösen
  // weder click noch focus aus — pointerenter, pointerdown und contextmenu
  // müssen den href ebenfalls auf den aktuellen Zustand nachziehen.
  it('zieht den href auch bei pointerenter, pointerdown und contextmenu nach', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.ui.eingebettet = true;
    state.camera.mode = 'attached';
    state.camera.targetId = 'venus';
    useStore.getState().replaceAll(state);
    render(<KnopfZurueck ueberBogenreiter={false} />);
    const link = screen.getByRole('link', { name: 'Auf orrery3d.de öffnen' });
    expect(link.getAttribute('href')).toBe('https://orrery3d.de/');

    fireEvent.pointerEnter(link);
    expect(link.getAttribute('href')).toContain('body=venus');

    useStore.getState().setCamera({ targetId: 'mars' });
    fireEvent.contextMenu(link);
    expect(link.getAttribute('href')).toContain('body=mars');

    useStore.getState().setCamera({ targetId: 'jupiter' });
    fireEvent.pointerDown(link);
    expect(link.getAttribute('href')).toContain('body=jupiter');
  });

  // Fix-Runde 1, C3: Im Kompaktmodus bei eingeblendeter Oberfläche sitzt der
  // Bogenreiter an derselben Ecke unten rechts (.bogenreiter in index.css,
  // App.tsx). Der Knopf zurück rückt dann darüber, statt ihn zu verdecken.
  it('rückt bei ueberBogenreiter höher, sonst unten rechts wie gehabt', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.ui.eingebettet = true;
    useStore.getState().replaceAll(state);
    const { rerender } = render(<KnopfZurueck ueberBogenreiter={false} />);
    expect(screen.getByRole('link').className).toContain('bottom-3');
    expect(screen.getByRole('link').className).not.toContain('bottom-16');
    rerender(<KnopfZurueck ueberBogenreiter />);
    expect(screen.getByRole('link').className).toContain('bottom-16');
  });
});
