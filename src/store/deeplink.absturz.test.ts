import { describe, it, expect, vi } from 'vitest';

// Eigene Datei, weil vi.mock das ganze Modul ersetzt: Ein Fehler irgendwo in
// der Auswertung (hier nachgestellt im Fokusabstand) darf den Start nie
// verhindern, der Link gilt dann wie einer ohne gültigen Schlüssel.
vi.mock('../sim/scale', async (original) => ({
  ...(await original<typeof import('../sim/scale')>()),
  fokusAbstand: () => {
    throw new TypeError('nachgestellter Fehler');
  },
}));

const { fragmentAuswerten } = await import('./deeplink');

describe('fragmentAuswerten: Fehler in der Auswertung', () => {
  it('liefert ein gültig-leeres Ergebnis statt zu werfen', () => {
    expect(fragmentAuswerten('#body=mars')).toEqual({ patch: null, szeneId: null });
  });
});
