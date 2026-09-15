// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { InfoPanel } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';
import { ladeMitAusweich } from '../../data/texte';
import type { GeladenerText } from '../../data/texte';

/**
 * Zwischenzustand beim Sprachwechsel sichtbar machen: Der deutsche Text
 * lädt sofort, der englische erst, wenn der Test die Freigabe auslöst. Bis
 * dahin steht der alte (deutsche) Anzeigestand, die Sprache ist aber schon
 * Englisch. Die übrigen Exporte bleiben die echten.
 */
vi.mock('../../data/texte', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/texte')>();
  return { ...echt, ladeMitAusweich: vi.fn() };
});

const HINWEISE = ['Not translated yet; German text shown.', 'Noch nicht übersetzt, deutscher Text.'];
const keinHinweis = (): void => {
  for (const h of HINWEISE) expect(screen.queryByText(h), h).toBeNull();
};

const freigabe: { englisch: (() => void) | null } = { englisch: null };

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  setSprache('de');
  freigabe.englisch = null;
  vi.mocked(ladeMitAusweich).mockImplementation((sprache, niveau) => {
    if (sprache === 'de') return Promise.resolve({ text: '# Erde\n\nDeutscher Testtext.', niveau, sprache: 'de' });
    return new Promise<GeladenerText | null>((resolve) => {
      freigabe.englisch = () => { resolve({ text: '# Earth\n\nEnglish test text.', niveau, sprache: 'en' }); };
    });
  });
});
afterEach(() => { setSprache('de'); });

describe('InfoPanel beim Sprachwechsel', () => {
  it('zeigt vor dem frischen Laden keinen Hinweis „nicht übersetzt"', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    expect(await screen.findByText('Deutscher Testtext.')).toBeTruthy();

    act(() => {
      useStore.getState().setUi({ language: 'en' });
      setSprache('en');
    });
    // Zwischenzustand: Das englische Laden ist noch offen, der deutsche Text steht.
    expect(freigabe.englisch).not.toBeNull();
    expect(screen.getByText('Deutscher Testtext.')).toBeTruthy();
    keinHinweis();

    await act(async () => { freigabe.englisch?.(); await Promise.resolve(); });
    expect(await screen.findByText('English test text.')).toBeTruthy();
    keinHinweis();
  });
});
