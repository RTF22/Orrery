// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Panel } from './Panel';
import { useStore, DEFAULT_STATE } from '../../store';
import { UEBERSCHRIFT_STREIFEN, UEBERSCHRIFT_TEXT } from '../ueberschrift';

describe('Panel', () => {
  it('zeigt Titel und Inhalt', () => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    render(<Panel id="time" title="Zeit"><p>Inhalt</p></Panel>);
    expect(screen.getByText('Zeit')).toBeTruthy();
    expect(screen.getByText('Inhalt')).toBeTruthy();
  });

  it('klappt auf Klick ein und speichert das im Store', () => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    render(<Panel id="time" title="Zeit"><p>Inhalt</p></Panel>);
    fireEvent.click(screen.getByRole('button', { name: /Zeit/ }));
    expect(useStore.getState().ui.panels.time).toBe(false);
    expect(screen.queryByText('Inhalt')).toBeNull();
  });

  it('setzt die Überschrift farblich ab (Streifen am Kopf, Titel in der Akzentfarbe)', () => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    render(<Panel id="time" title="Zeit"><p>Inhalt</p></Panel>);
    const kopf = screen.getByRole('button', { name: /Zeit/ });
    for (const klasse of UEBERSCHRIFT_STREIFEN.split(' ')) expect(kopf.classList).toContain(klasse);
    expect(screen.getByText('Zeit').classList).toContain(UEBERSCHRIFT_TEXT);
  });
});
