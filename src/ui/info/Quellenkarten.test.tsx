// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Quellenkarten } from './Quellenkarten';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
afterEach(() => { setSprache('de'); });

describe('Quellenkarten', () => {
  it('zeigt die Karten zur Kennung gruppiert nach Art, Faktenblätter zuerst', () => {
    render(<Quellenkarten kennung="objekt:earth" hervorgehoben={null} />);
    const gruppen = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(gruppen[0]).toBe('Faktenblatt');
    expect(gruppen).toContain('Übersicht');
    const karte = screen.getByRole('link', { name: /Erde: Faktenblatt \(NSSDC\)/ }) as HTMLAnchorElement;
    expect(karte.href).toContain('nssdc.gsfc.nasa.gov');
    expect(karte.target).toBe('_blank');
    expect(karte.rel).toContain('noopener');
    expect(karte.textContent).toContain('NASA');
    expect(karte.textContent).toContain('öffnet neuen Tab');
  });

  it('meldet, wenn es keine Quellen gibt', () => {
    render(<Quellenkarten kennung="objekt:vulcan" hervorgehoben={null} />);
    expect(screen.getByText('Keine Quellen zu diesem Text.')).toBeTruthy();
  });

  it('hebt die gewählte Karte hervor', () => {
    render(<Quellenkarten kennung="objekt:earth" hervorgehoben="nasa-earth" />);
    const karte = screen.getByRole('link', { name: /Erde bei NASA Science/ });
    expect(karte.className).toContain('border-sky-300');
    const andere = screen.getByRole('link', { name: /Erde: Faktenblatt/ });
    expect(andere.className).not.toContain('border-sky-300');
  });

  it('zeigt englische Titel und stellt englische Seiten in der Gruppe nach vorn', () => {
    useStore.getState().setUi({ language: 'en' });
    setSprache('en');
    render(<Quellenkarten kennung="objekt:earth" hervorgehoben={null} />);
    expect(screen.getByRole('link', { name: /Earth Fact Sheet \(NSSDC\)/ })).toBeTruthy();
    const uebersichten = screen.getAllByRole('link').map((a) => a.textContent ?? '');
    const ersteWikipedia = uebersichten.find((t) => t.includes('Wikipedia'));
    expect(ersteWikipedia).toContain('Earth (Wikipedia)');
  });
});
