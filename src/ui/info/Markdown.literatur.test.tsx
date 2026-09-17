// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Markdown } from './Markdown';

const { ARBEIT } = vi.hoisted(() => ({
  ARBEIT: {
    id: 'muster-2020', autoren: ['Muster, A.'], etAl: false, jahr: 2020,
    titel: 'Erfundene Arbeit für Tests', erschienen: 'Testzeitschrift 1, 1', doi: '10.0000/test.1',
  },
}));

vi.mock('../../data/literatur', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/literatur')>();
  return { ...echt, LITERATUR: [ARBEIT], publikationFinden: (id: string) => (id === ARBEIT.id ? ARBEIT : undefined) };
});

describe('Markdown mit Zitaten', () => {
  it('Zitate sind Anker auf die DOI; Linksklick meldet, Strg-Klick öffnet den Tab', () => {
    const onVerweis = vi.fn();
    render(<Markdown text="Gemessen von [Muster 2020](literatur:muster-2020)." onVerweis={onVerweis} />);
    const anker = screen.getByRole('link', { name: 'Muster 2020' }) as HTMLAnchorElement;
    expect(anker.href).toBe('https://doi.org/10.0000/test.1');
    expect(anker.target).toBe('_blank');
    expect(anker.rel).toContain('noopener');
    expect(anker.getAttribute('data-verweis')).toBe('literatur:muster-2020');
    expect(fireEvent.click(anker)).toBe(false);
    expect(onVerweis).toHaveBeenCalledWith({ art: 'literatur', publikation: ARBEIT });
    expect(fireEvent.click(anker, { ctrlKey: true })).toBe(true);
    expect(onVerweis).toHaveBeenCalledTimes(1);
  });
});
