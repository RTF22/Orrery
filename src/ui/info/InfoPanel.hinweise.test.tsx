// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoPanel } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';
import { ladeMitAusweich, textVorhanden } from '../../data/texte';

/**
 * Hinweiszeilen unabhängig von echten Textdateien (Entwurf 4d §5.4): Lader
 * und Vorhandensein sind gemockt, damit die Fälle gültig bleiben, während
 * die Etappen 4d-1 bis 4d-11 Hochschultexte ergänzen.
 */
vi.mock('../../data/texte', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/texte')>();
  return { ...echt, ladeMitAusweich: vi.fn(), textVorhanden: vi.fn(() => false) };
});

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  setSprache('de');
  vi.mocked(textVorhanden).mockImplementation(() => false);
});

describe('InfoPanel, Hinweiszeilen', () => {
  it('Hochschule ohne Hochschultext zeigt den Gymnasialtext mit Hinweis und den vollen Datenblock', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue({ text: '# Erde\n\nGymnasialtext zur Erde.', niveau: 'gymnasium', sprache: 'de' });
    useStore.getState().setCamera({ targetId: 'earth' });
    useStore.getState().setInfo({ niveau: 'hochschule' });
    render(<InfoPanel />);
    expect(await screen.findByText(/Der Hochschultext folgt/)).toBeTruthy();
    expect(screen.getByText('Gymnasialtext zur Erde.')).toBeTruthy();
    expect(screen.getByText('Große Halbachse')).toBeTruthy();
  });

  it('ein Thema, das es nur auf Hochschulniveau gibt, zeigt auf dem Gymnasial-Tab „nur Hochschule"', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue(null);
    vi.mocked(textVorhanden).mockImplementation((_s, niveau) => niveau === 'hochschule');
    useStore.getState().setInfo({ thema: 'gezeiten', niveau: 'gymnasium' });
    render(<InfoPanel />);
    expect(await screen.findByText('Diesen Text gibt es nur auf Hochschulniveau.')).toBeTruthy();
    expect(screen.queryByText('Zu diesem Eintrag gibt es noch keinen Text.')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Gezeiten und Roche-Grenze' })).toBeTruthy();
  });

  it('ohne jeden Text bleibt es bei „kein Text"', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue(null);
    useStore.getState().setInfo({ thema: 'gezeiten', niveau: 'grundschule' });
    render(<InfoPanel />);
    expect(await screen.findByText('Zu diesem Eintrag gibt es noch keinen Text.')).toBeTruthy();
    expect(screen.queryByText('Diesen Text gibt es nur auf Hochschulniveau.')).toBeNull();
  });
});
