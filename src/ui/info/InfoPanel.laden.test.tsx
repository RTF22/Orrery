// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoPanel } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';

/**
 * `ladeMitAusweich` lädt faul (dynamischer `import.meta.glob`-Zugriff) und
 * kann ablehnen — der Chunk fehlt nach einem Redeploy, oder das Netz bricht
 * mitten im Laden ab. Die übrigen Exporte (u. a. `textSchluessel`, von
 * `aktuellerText.ts` weitergereicht) bleiben die echten.
 */
vi.mock('../../data/texte', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/texte')>();
  return { ...echt, ladeMitAusweich: vi.fn(() => Promise.reject(new Error('Chunk fehlt'))) };
});

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  setSprache('de');
});
afterEach(() => { setSprache('de'); });

describe('InfoPanel bei fehlschlagendem Laden', () => {
  it('zeigt den Hinweis "kein Text" statt einer unbehandelten Ablehnung', async () => {
    useStore.getState().setCamera({ targetId: 'earth' });
    render(<InfoPanel />);
    expect(await screen.findByText('Zu diesem Eintrag gibt es noch keinen Text.')).toBeTruthy();
    expect(await screen.findByRole('heading', { level: 2, name: 'Erde' })).toBeTruthy();
    expect(screen.getByTestId('datenblock')).toBeTruthy();
  });
});
