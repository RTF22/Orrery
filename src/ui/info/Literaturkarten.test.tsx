// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Literaturkarten } from './Literaturkarten';
import type { Publikation } from '../../data/literatur';
import { setSprache } from '../i18n';

afterEach(() => { setSprache('de'); });

/** Erfundene Testdaten. */
const VOLL: Publikation = {
  id: 'muster-2020a', autoren: ['Muster, A.', 'de Beispiel, B.'], etAl: true, jahr: 2020,
  titel: 'Erfundene Arbeit', erschienen: 'Testzeitschrift 1, 1',
  doi: '10.0000/test.1', arxiv: '2001.00001', bibcode: '2020A&A...1....1M',
};
const PREPRINT: Publikation = {
  id: 'beispiel-2021', autoren: ['Beispiel, B.'], etAl: false, jahr: 2021,
  titel: 'Nur als Preprint', erschienen: 'arXiv', arxiv: '2101.00002',
};

describe('Literaturkarten', () => {
  it('zeigt nichts ohne zitierte Arbeiten', () => {
    const { container } = render(<Literaturkarten arbeiten={[]} hervorgehoben={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('zeigt Autoren, Jahr, Titel, Erscheinungsort und getrennte Links im neuen Tab', () => {
    render(<Literaturkarten arbeiten={[VOLL]} hervorgehoben={null} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Literatur' })).toBeTruthy();
    expect(screen.getByText('Muster, A., de Beispiel, B. et al. (2020a)')).toBeTruthy();
    expect(screen.getByText('Erfundene Arbeit')).toBeTruthy();
    expect(screen.getByText('Testzeitschrift 1, 1')).toBeTruthy();
    expect((screen.getByRole('link', { name: 'DOI' }) as HTMLAnchorElement).href).toBe('https://doi.org/10.0000/test.1');
    expect((screen.getByRole('link', { name: 'arXiv (frei)' }) as HTMLAnchorElement).href).toBe('https://arxiv.org/abs/2001.00001');
    const ads = screen.getByRole('link', { name: 'ADS' }) as HTMLAnchorElement;
    expect(ads.href).toBe('https://ui.adsabs.harvard.edu/abs/2020A%26A...1....1M/abstract');
    expect(ads.target).toBe('_blank');
    expect(ads.rel).toContain('noopener');
    expect(screen.queryByText(/Preprint/)).toBeNull();
  });

  it('kennzeichnet Preprints und hebt die gewählte Arbeit hervor', () => {
    const { container } = render(<Literaturkarten arbeiten={[VOLL, PREPRINT]} hervorgehoben="literatur:beispiel-2021" />);
    expect(screen.getByText('arXiv · Preprint')).toBeTruthy();
    expect(container.querySelector('[data-literatur="beispiel-2021"]')?.className).toContain('border-sky-300');
    expect(container.querySelector('[data-literatur="muster-2020a"]')?.className).not.toContain('border-sky-300');
  });

  it('beschriftet auf Englisch', () => {
    setSprache('en');
    render(<Literaturkarten arbeiten={[VOLL]} hervorgehoben={null} />);
    expect(screen.getByRole('heading', { level: 3, name: 'References' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'arXiv (open access)' })).toBeTruthy();
  });
});
