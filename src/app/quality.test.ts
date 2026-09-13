import { describe, it, expect } from 'vitest';
import { detectTier, QUALITY_SETTINGS } from './quality';
import { beltCount } from '../sim/belts';

describe('detectTier', () => {
  it('bleibt bei guter Framezeit auf hoher Stufe', () => {
    expect(detectTier(Array(180).fill(14))).toBe('high');
  });

  it('stuft bei langsamen Frames herunter', () => {
    expect(detectTier(Array(180).fill(28))).toBe('medium');
    expect(detectTier(Array(180).fill(60))).toBe('low');
  });

  it('urteilt nicht auf zu wenigen Messwerten', () => {
    // Weniger als drei Sekunden Messung: noch keine Entscheidung.
    expect(detectTier([40, 42])).toBe('auto');
  });

  it('ignoriert einzelne Ausreißer', () => {
    const werte = Array(180).fill(14);
    werte[10] = 500; // Nachladen einer Textur
    expect(detectTier(werte)).toBe('high');
  });
});

describe('QUALITY_SETTINGS', () => {
  it('steigert die Texturgröße mit der Stufe', () => {
    expect(QUALITY_SETTINGS.low.textureSize).toBeLessThan(QUALITY_SETTINGS.medium.textureSize);
    expect(QUALITY_SETTINGS.medium.textureSize).toBeLessThan(QUALITY_SETTINGS.high.textureSize);
  });

  it('schaltet Bloom nur auf niedriger Stufe ab', () => {
    expect(QUALITY_SETTINGS.low.bloom).toBe(false);
    expect(QUALITY_SETTINGS.medium.bloom).toBe(true);
  });

  it('spiegelt die Gürtel-Teilchenzahl aus sim/belts', () => {
    // sim/ darf nichts aus app/ importieren; die Zahlen stehen deshalb in
    // beiden Tabellen und müssen hier gleich bleiben.
    expect(QUALITY_SETTINGS.low.beltParticles).toBe(beltCount('low'));
    expect(QUALITY_SETTINGS.medium.beltParticles).toBe(beltCount('medium'));
    expect(QUALITY_SETTINGS.high.beltParticles).toBe(beltCount('high'));
  });
});
