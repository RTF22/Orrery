import { describe, expect, it } from 'vitest';
import { BREITEN, himmelPfad, werteFehler } from './milchstrasse-bauen';
import { MILCHSTRASSE_STUFEN } from '../src/data/milchstrasse';

describe('milchstrasse-bauen', () => {
  it('baut genau die Stufen der Datenliste', () => {
    expect(BREITEN).toEqual(MILCHSTRASSE_STUFEN.map((s) => s.breite));
    for (const s of MILCHSTRASSE_STUFEN) expect(himmelPfad(s.breite)).toBe(s.pfad);
  });

  it('meldet keine Fehler bei Werten im Zielbereich', () => {
    expect(werteFehler({ band_median: 25, band_p995: 65, pol_mittel: 1.2 })).toEqual([]);
  });

  it('lässt den Randfall Polkappen 6 zu, meldet 6,1', () => {
    expect(werteFehler({ band_median: 25, band_p995: 65, pol_mittel: 6 })).toEqual([]);
    expect(werteFehler({ band_median: 25, band_p995: 65, pol_mittel: 6.1 })).toEqual(['Polkappen 6.1 statt höchstens 6']);
  });

  it('meldet jeden Wert außerhalb seines Bereichs', () => {
    expect(werteFehler({ band_median: 31, band_p995: 59, pol_mittel: 6.1 })).toHaveLength(3);
    expect(werteFehler({ band_median: 20, band_p995: 70, pol_mittel: 6 })).toEqual([]);
  });
});
