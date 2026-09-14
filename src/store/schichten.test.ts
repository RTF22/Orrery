import { describe, it, expect } from 'vitest';

/**
 * store/ darf weder ui/ noch app/ noch render/ kennen (Schichtregel ui →
 * store → render → sim; store/ hängt nur von sim/ und data/ ab). Vites
 * import.meta.glob liest alle Quelldateien unter src/store/ rekursiv als
 * Text — ohne Node-Dateisystem, ohne Abhängigkeit vom Arbeitsverzeichnis;
 * neue Unterordner sind automatisch erfasst.
 */
const quellen = import.meta.glob('./**/*.{ts,tsx}', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

describe('Schichtung', () => {
  it('store/ importiert nichts aus ui/, app/ oder render/', () => {
    const verstoesse = Object.entries(quellen)
      .filter(([pfad]) => !/\.test\.tsx?$/.test(pfad))
      // erfasst `from '../ui/…'`, `import '../render/…'` und `import('../app/…')`.
      .filter(([, text]) => /(?:from\s+|import\s*\(\s*|^\s*import\s+)['"](?:\.\.\/)+(?:ui|app|render)\//m.test(text))
      .map(([pfad]) => pfad);
    expect(verstoesse).toEqual([]);
  });

  it('erfasst mehr als 5 Dateien', () => {
    expect(Object.keys(quellen).length).toBeGreaterThan(5);
  });
});
