import { describe, it, expect } from 'vitest';
import {
  alleTextPfade, ausweichKandidaten, ladeMitAusweich, ladeText, textPfad, textSchluessel, textVorhanden,
} from './index';

const erde = { art: 'objekt', kennung: 'earth' } as const;

describe('Textlader', () => {
  it('bildet Pfad und Schlüssel', () => {
    expect(textPfad('de', 'gymnasium', erde)).toBe('./de/gymnasium/objekt-earth.md');
    expect(textSchluessel(erde)).toBe('objekt:earth');
  });

  it('kennt vorhandene Dateien synchron und lädt sie asynchron', async () => {
    expect(alleTextPfade().length).toBeGreaterThanOrEqual(14);
    expect(textVorhanden('de', 'gymnasium', erde)).toBe(true);
    expect(textVorhanden('de', 'hochschule', erde)).toBe(false);
    const text = await ladeText('de', 'gymnasium', erde);
    expect(text?.startsWith('# ')).toBe(true);
    expect(await ladeText('de', 'hochschule', erde)).toBeNull();
    // Zweiter Aufruf kommt aus dem Speicher und ist dieselbe Zeichenkette.
    expect(await ladeText('de', 'gymnasium', erde)).toBe(text);
  });

  it('weicht in fester Reihenfolge aus', () => {
    expect(ausweichKandidaten('de', 'gymnasium')).toEqual([['de', 'gymnasium']]);
    expect(ausweichKandidaten('de', 'hochschule')).toEqual([['de', 'hochschule'], ['de', 'gymnasium']]);
    expect(ausweichKandidaten('en', 'grundschule')).toEqual([['en', 'grundschule'], ['de', 'grundschule']]);
    expect(ausweichKandidaten('en', 'hochschule')).toEqual([
      ['en', 'hochschule'], ['en', 'gymnasium'], ['de', 'hochschule'], ['de', 'gymnasium'],
    ]);
  });

  it('ladeMitAusweich meldet, welches Niveau und welche Sprache es genommen hat', async () => {
    const direkt = await ladeMitAusweich('en', 'grundschule', erde);
    expect(direkt?.sprache).toBe('en');
    expect(direkt?.niveau).toBe('grundschule');
    const hochschule = await ladeMitAusweich('en', 'hochschule', erde);
    expect(hochschule?.niveau).toBe('gymnasium');
    expect(hochschule?.sprache).toBe('en');
    expect(await ladeMitAusweich('de', 'gymnasium', { art: 'objekt', kennung: 'pluto' })).toBeNull();
  });
});
