// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoPanel } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';
import { ladeMitAusweich } from '../../data/texte';

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
vi.mock('../../data/texte', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/texte')>();
  return { ...echt, ladeMitAusweich: vi.fn() };
});

const TEXT = '# Erde\n\nGemessen von [Muster 2020](literatur:muster-2020).';

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  useStore.getState().setCamera({ targetId: 'earth' });
  useStore.getState().setInfo({ niveau: 'hochschule' });
  setSprache('de');
});

describe('InfoPanel mit Literatur', () => {
  it('zeigt zu einem Hochschultext die zitierten Arbeiten und hebt sie beim Klick hervor', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue({ text: TEXT, niveau: 'hochschule', sprache: 'de' });
    const { container } = render(<InfoPanel />);
    const zitat = await screen.findByRole('link', { name: 'Muster 2020' });
    expect(screen.getByRole('heading', { level: 3, name: 'Literatur' })).toBeTruthy();
    fireEvent.click(zitat);
    expect(container.querySelector('[data-literatur="muster-2020"]')?.className).toContain('border-sky-300');
  });

  it('zeigt zum Gymnasialtext als Ersatz keine Literaturkarten', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue({ text: TEXT, niveau: 'gymnasium', sprache: 'de' });
    render(<InfoPanel />);
    expect(await screen.findByText(/Der Hochschultext folgt/)).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 3, name: 'Literatur' })).toBeNull();
  });
});
