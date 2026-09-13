import { describe, it, expect } from 'vitest';

/**
 * render/ darf ui/ nicht kennen (Entwurf 4a, §4.3; Schichtregel ui → store →
 * render → sim). Vites import.meta.glob liest alle Quelldateien unter
 * src/render/ rekursiv als Text — ohne Node-Dateisystem, ohne Abhängigkeit
 * vom Arbeitsverzeichnis; neue Unterordner sind automatisch erfasst.
 */
const quellen = import.meta.glob('./**/*.{ts,tsx}', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

describe('Schichtung', () => {
  it('render/ importiert nichts aus ui/', () => {
    const verstoesse = Object.entries(quellen)
      .filter(([pfad]) => !/\.test\.tsx?$/.test(pfad))
      // erfasst `from '../ui/…'`, `import '../ui/…'` und `import('../ui/…')`.
      .filter(([, text]) => /(?:from\s+|import\s*\(\s*|^\s*import\s+)['"](?:\.\.\/)+ui\//m.test(text))
      .map(([pfad]) => pfad);
    expect(verstoesse).toEqual([]);
  });

  it('erfasst auch Unterordner', () => {
    // Gegenprobe gegen einen leeren oder flachen Scan: camera/ existiert.
    expect(Object.keys(quellen).some((p) => p.startsWith('./camera/'))).toBe(true);
    expect(Object.keys(quellen).length).toBeGreaterThan(10);
  });
});
