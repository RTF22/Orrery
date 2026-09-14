import { describe, it, expect } from 'vitest';
import { THEMEN, NIVEAUS, istThema } from './themen';
import { de } from '../ui/i18n/de';

describe('Themenkatalog', () => {
  it('hat eindeutige Kennungen aus Kleinbuchstaben, Ziffern und Bindestrich', () => {
    const ids = THEMEN.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('hat für jedes Thema einen Titelschlüssel', () => {
    for (const thema of THEMEN) {
      expect(de, `fehlt: ${thema.titleKey}`).toHaveProperty(thema.titleKey);
    }
  });

  it('kennt drei Niveaus und erkennt Themen', () => {
    expect(NIVEAUS).toEqual(['grundschule', 'gymnasium', 'hochschule']);
    expect(istThema('modell')).toBe(true);
    expect(istThema('gibt-es-nicht')).toBe(false);
  });
});
