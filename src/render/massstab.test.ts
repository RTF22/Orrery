import { describe, it, expect } from 'vitest';

/**
 * In render/ liest niemand den eingestellten Maßstab direkt: In der
 * Himmelsansicht gilt „realistisch“ (store/himmelsansicht.ts,
 * dargestellterMassstab). Ein direkter Zugriff auf `state.scale` zeichnete
 * dort mit dem falschen Maßstab.
 */
const quellen = import.meta.glob('./**/*.{ts,tsx}', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

describe('Maßstab in render/', () => {
  it('liest state.scale nirgends direkt', () => {
    const verstoesse = Object.entries(quellen)
      .filter(([pfad]) => !/\.test\.tsx?$/.test(pfad))
      .filter(([, text]) => /\bstate\.scale\b/.test(text))
      .map(([pfad]) => pfad);
    expect(verstoesse).toEqual([]);
  });
});
