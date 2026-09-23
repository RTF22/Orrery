// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Seitenleiste, LEISTE_PANEL } from './Seitenleiste';
import { useStore, DEFAULT_STATE } from '../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

const leiste = () => render(<Seitenleiste kopf={<p>Kopf</p>}><p>Inhalt</p></Seitenleiste>);

describe('Seitenleiste', () => {
  it('ist ohne gespeicherten Wert offen und 18 rem breit', () => {
    const { container } = leiste();
    expect(screen.getByText('Kopf')).toBeTruthy();
    expect(screen.getByText('Inhalt')).toBeTruthy();
    expect((container.firstElementChild as HTMLElement).style.width).toBe('18rem');
  });

  it('klappt ein, zeigt dann nur den Reiter und öffnet wieder', () => {
    leiste();
    fireEvent.click(screen.getByRole('button', { name: 'Bedienung einklappen' }));
    expect(useStore.getState().ui.panels[LEISTE_PANEL]).toBe(false);
    expect(screen.queryByText('Inhalt')).toBeNull();
    expect(screen.queryByText('Kopf')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Bedienung öffnen' }));
    expect(useStore.getState().ui.panels[LEISTE_PANEL]).toBe(true);
    expect(screen.getByText('Inhalt')).toBeTruthy();
  });

  it('Pfeil rechts am Breitengriff verbreitert die Leiste im Store', () => {
    leiste();
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Breite der Bedienleiste' }), { key: 'ArrowRight' });
    expect(useStore.getState().ui.leiste.breiteRem).toBe(19);
  });

  it('klemmt die Darstellung auf 40 % der Fensterbreite und lässt den Store-Wert stehen', () => {
    useStore.getState().setUi({ leiste: { breiteRem: 32 } });
    const { container } = leiste();
    // jsdom-Fensterbreite 1024: floor(1024 · 0,4 / 16) = 25.
    expect((container.firstElementChild as HTMLElement).style.width).toBe('25rem');
    expect(screen.getByRole('separator').getAttribute('aria-valuemax')).toBe('25');
    expect(useStore.getState().ui.leiste.breiteRem).toBe(32);
  });
});
