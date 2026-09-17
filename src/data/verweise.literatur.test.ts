import { describe, it, expect, vi } from 'vitest';
import { verweisAufloesen } from './verweise';

const { ARBEIT } = vi.hoisted(() => ({
  ARBEIT: {
    id: 'muster-2020', autoren: ['Muster, A.'], etAl: false, jahr: 2020,
    titel: 'Erfundene Arbeit für Tests', erschienen: 'Testzeitschrift 1, 1', doi: '10.0000/test.1',
  },
}));

vi.mock('./literatur', async (importOriginal) => {
  const echt = await importOriginal<typeof import('./literatur')>();
  return { ...echt, LITERATUR: [ARBEIT], publikationFinden: (id: string) => (id === ARBEIT.id ? ARBEIT : undefined) };
});

describe('verweisAufloesen mit Literatur', () => {
  it('löst literatur:<id> gegen den Katalog auf', () => {
    expect(verweisAufloesen('literatur:muster-2020')).toEqual({ art: 'literatur', publikation: ARBEIT });
    expect(verweisAufloesen('literatur:muster-2021')).toBeNull();
  });
});
