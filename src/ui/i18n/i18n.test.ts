import { describe, it, expect } from 'vitest';
import { de } from './de';
import { t } from './index';
import { bodies } from '../../data/index';

describe('Sprachressourcen', () => {
  it('hat für jeden Körper einen Namensschlüssel', () => {
    for (const body of bodies) {
      expect(de, `fehlt: ${body.info.nameKey}`).toHaveProperty(body.info.nameKey);
    }
  });

  it('liefert zu bekannten Schlüsseln den Text', () => {
    expect(t('body.earth.name')).toBe('Erde');
  });

  it('meldet unbekannte Schlüssel erkennbar, statt leer zu bleiben', () => {
    expect(t('gibt.es.nicht')).toContain('gibt.es.nicht');
  });

  it('enthält keine leeren Texte', () => {
    for (const [key, wert] of Object.entries(de)) {
      expect(wert.length, `leer: ${key}`).toBeGreaterThan(0);
    }
  });
});
