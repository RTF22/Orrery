// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('gibt Überschriften, Absätze, Listen, fett und kursiv aus', () => {
    render(<Markdown text={'# Titel\n\nEin **fetter** und *kursiver* Satz.\n\n- eins\n- zwei'} onVerweis={() => {}} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Titel' })).toBeTruthy();
    expect(screen.getByText('fetter').tagName).toBe('STRONG');
    expect(screen.getByText('kursiver').tagName).toBe('EM');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('blendet auf Wunsch die erste Überschrift aus', () => {
    render(<Markdown text={'# Titel\n\nText\n\n# Zweiter'} onVerweis={() => {}} titelAusblenden />);
    expect(screen.queryByRole('heading', { name: 'Titel' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Zweiter' })).toBeTruthy();
  });

  it('interne Verweise sind Knöpfe und melden den aufgelösten Verweis', () => {
    const onVerweis = vi.fn();
    render(<Markdown text="Zur [Erde](objekt:earth) und zum [Thema](thema:modell)." onVerweis={onVerweis} />);
    fireEvent.click(screen.getByRole('button', { name: 'Erde' }));
    expect(onVerweis).toHaveBeenCalledWith({ art: 'objekt', kennung: 'earth' });
    fireEvent.click(screen.getByRole('button', { name: 'Thema' }));
    expect(onVerweis).toHaveBeenLastCalledWith({ art: 'thema', kennung: 'modell' });
  });

  it('Quellenverweise sind Anker mit der Zieladresse; Linksklick meldet, Strg-Klick öffnet den Tab', () => {
    const onVerweis = vi.fn();
    render(<Markdown text="Siehe [Fact Sheet](quelle:nssdc-earth)." onVerweis={onVerweis} />);
    const anker = screen.getByRole('link', { name: 'Fact Sheet' }) as HTMLAnchorElement;
    expect(anker.href).toBe('https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html');
    expect(anker.target).toBe('_blank');
    expect(anker.rel).toContain('noopener');
    const klick = fireEvent.click(anker);
    expect(klick).toBe(false); // preventDefault wurde gerufen
    expect(onVerweis).toHaveBeenCalledTimes(1);
    expect(onVerweis.mock.calls[0]?.[0]).toMatchObject({ art: 'quelle' });
    const strgKlick = fireEvent.click(anker, { ctrlKey: true });
    expect(strgKlick).toBe(true);
    expect(onVerweis).toHaveBeenCalledTimes(1);
  });

  it('trägt das Ziel jedes aufgelösten Verweises als data-verweis, unbekannte Ziele nicht', () => {
    render(
      <Markdown
        text="[Erde](objekt:earth), [Karte](quelle:nssdc-earth), [Seite](https://example.org), [Nichts](objekt:vulcan)."
        onVerweis={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Erde' }).getAttribute('data-verweis')).toBe('objekt:earth');
    expect(screen.getByRole('link', { name: 'Karte' }).getAttribute('data-verweis')).toBe('quelle:nssdc-earth');
    expect(screen.getByRole('link', { name: 'Seite' }).getAttribute('data-verweis')).toBe('https://example.org');
    expect(screen.getByText('Nichts').hasAttribute('data-verweis')).toBe(false);
  });

  it('externe https-Ziele sind Anker im neuen Tab; Unbekanntes bleibt Text', () => {
    render(<Markdown text="[ESA](https://www.esa.int/) und [tot](objekt:vulcan) und [böse](javascript:alert(1))" onVerweis={() => {}} />);
    const esa = screen.getByRole('link', { name: 'ESA' }) as HTMLAnchorElement;
    expect(esa.target).toBe('_blank');
    expect(esa.rel).toContain('noreferrer');
    expect(screen.queryByRole('link', { name: 'tot' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'tot' })).toBeNull();
    expect(screen.getByText('tot')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'böse' })).toBeNull();
  });
});
