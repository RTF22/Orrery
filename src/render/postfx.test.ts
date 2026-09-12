import { describe, it, expect } from 'vitest';
import { bloomStrengthFor, BLOOM_LAYER } from './postfx';

describe('bloomStrengthFor', () => {
  it('schaltet Bloom auf niedriger Stufe ganz ab', () => {
    expect(bloomStrengthFor('low')).toBe(0);
  });

  it('steigert die Stärke mit der Qualitätsstufe', () => {
    expect(bloomStrengthFor('high')).toBeGreaterThan(bloomStrengthFor('medium'));
    expect(bloomStrengthFor('medium')).toBeGreaterThan(bloomStrengthFor('low'));
  });

  it('behandelt auto wie mittel', () => {
    expect(bloomStrengthFor('auto')).toBe(bloomStrengthFor('medium'));
  });

  it('nutzt eine eigene Ebene für leuchtende Objekte', () => {
    expect(BLOOM_LAYER).toBe(1);
  });
});
