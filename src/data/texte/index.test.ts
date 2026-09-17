import { describe, it, expect } from 'vitest';
import {
  alleTextPfade, ausweichKandidaten, ladeMitAusweich, ladeText, textPfad, textSchluessel, textVorhanden,
} from './index';
import type { Sprache } from '../quellen';
import type { Niveau } from '../themen';

const erde = { art: 'objekt', kennung: 'earth' } as const;
const vulcan = { art: 'objekt', kennung: 'vulcan' } as const;

describe('Textlader', () => {
  it('bildet Pfad und Schlüssel', () => {
    expect(textPfad('de', 'gymnasium', erde)).toBe('./de/gymnasium/objekt-earth.md');
    expect(textSchluessel(erde)).toBe('objekt:earth');
  });

  it('kennt vorhandene Dateien synchron und lädt sie asynchron', async () => {
    expect(alleTextPfade().length).toBeGreaterThanOrEqual(14);
    expect(textVorhanden('de', 'gymnasium', erde)).toBe(true);
    expect(textVorhanden('de', 'gymnasium', vulcan)).toBe(false);
    const text = await ladeText('de', 'gymnasium', erde);
    expect(text?.startsWith('# ')).toBe(true);
    expect(await ladeText('de', 'gymnasium', vulcan)).toBeNull();
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
    expect(await ladeMitAusweich('de', 'gymnasium', vulcan)).toBeNull();
  });

  it('ladeMitAusweich nimmt den ersten vorhandenen Kandidaten der Ausweichreihenfolge', async () => {
    // Unabhängig von echten Dateien: Bis Etappe 4d-11 bekommt jeder Körper
    // einen Hochschultext, die Erde schon in 4d-1.
    const vorhanden = new Set(['en/gymnasium', 'de/hochschule']);
    const laden = (s: Sprache, n: Niveau): Promise<string | null> =>
      Promise.resolve(vorhanden.has(`${s}/${n}`) ? `# ${s} ${n}` : null);
    expect(await ladeMitAusweich('en', 'hochschule', erde, laden)).toEqual({ text: '# en gymnasium', niveau: 'gymnasium', sprache: 'en' });
    expect(await ladeMitAusweich('de', 'hochschule', erde, laden)).toEqual({ text: '# de hochschule', niveau: 'hochschule', sprache: 'de' });
    expect(await ladeMitAusweich('de', 'grundschule', erde, laden)).toBeNull();
  });
});
