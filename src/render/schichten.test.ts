import { describe, it, expect } from 'vitest';
// @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration;
// das Paket wird bewusst nicht als neue Abhängigkeit ergänzt (siehe
// data/index.test.ts, dortselbst derselbe Kunstgriff). Zur Laufzeit unter
// Vitest/Node funktioniert der Import unverändert.
import { readdirSync, readFileSync } from 'node:fs';

/** render/ darf ui/ nicht kennen (Entwurf 4a, §4.3; CLAUDE-Schichtregel). */
describe('Schichtung', () => {
  it('render/ importiert nichts aus ui/', () => {
    const ordner = 'src/render';
    const verstoesse: string[] = [];
    for (const datei of readdirSync(ordner)) {
      if (!datei.endsWith('.ts') || datei.endsWith('.test.ts')) continue;
      const text = readFileSync(`${ordner}/${datei}`, 'utf8');
      if (/from\s+['"]\.\.\/ui\//.test(text)) verstoesse.push(datei);
    }
    expect(verstoesse).toEqual([]);
  });
});
