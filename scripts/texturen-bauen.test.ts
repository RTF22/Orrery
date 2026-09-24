import { describe, expect, it } from 'vitest';
import { datenlisteText, kodierungFuer, mittelFehler, quelleFuer, stufenPfad } from './texturen-bauen.ts';

describe('stufenPfad', () => {
  it('legt jede Stufe unter public/textures/<koerper>/ ab', () => {
    expect(stufenPfad('earth', 1024)).toBe('textures/earth/albedo-1024.ktx2');
    expect(stufenPfad('sun', 4096)).toBe('textures/sun/albedo-4096.ktx2');
  });
});

describe('kodierungFuer', () => {
  it('kodiert die 1k-Stufe als ETC1S und alle breiteren als UASTC', () => {
    const kodierung = { etc1s: ['--encode', 'basis-lz'], uastc: ['--encode', 'uastc'] };
    expect(kodierungFuer(1024, kodierung)).toEqual(['--encode', 'basis-lz']);
    expect(kodierungFuer(2048, kodierung)).toEqual(['--encode', 'uastc']);
    expect(kodierungFuer(8192, kodierung)).toEqual(['--encode', 'uastc']);
  });
});

describe('quelleFuer', () => {
  const erde = { id: 'earth', stufen: [1024, 2048, 8192], hoch: { url: 'https://x/8k.jpg', sha256: 'ab' } };
  const io = { id: 'io', stufen: [1024] };

  it('nimmt für 1k und 2k das versionierte JPEG', () => {
    expect(quelleFuer(erde, 1024)).toEqual({ art: 'jpeg', pfad: 'assets-quellen/texturen/earth/albedo.jpg' });
    expect(quelleFuer(erde, 2048)).toEqual({ art: 'jpeg', pfad: 'assets-quellen/texturen/earth/albedo.jpg' });
    expect(quelleFuer(io, 1024)).toEqual({ art: 'jpeg', pfad: 'assets-quellen/texturen/io/albedo.jpg' });
  });

  it('nimmt für Stufen über 2048 die geladene Quelle', () => {
    expect(quelleFuer(erde, 8192)).toEqual({ art: 'hoch', url: 'https://x/8k.jpg', sha256: 'ab' });
  });

  it('meldet eine Stufe über 2048 ohne Quelle als Fehler', () => {
    expect(() => quelleFuer({ id: 'uranus', stufen: [1024, 4096] }, 4096)).toThrow(/uranus/);
  });
});

describe('mittelFehler', () => {
  const fixture = { 'textures/earth/albedo.jpg': 0.1339 };

  it('lässt Abweichungen bis 0,005 durch', () => {
    expect(mittelFehler('earth', 2048, 0.1389, fixture)).toBeNull();
    expect(mittelFehler('earth', 2048, 0.1289, fixture)).toBeNull();
  });

  it('meldet größere Abweichungen und fehlende Sollwerte', () => {
    expect(mittelFehler('earth', 8192, 0.1400, fixture)).toMatch(/earth.*8192/);
    expect(mittelFehler('vulcan', 1024, 0.2, fixture)).toMatch(/vulcan/);
  });
});

describe('datenlisteText', () => {
  it('schreibt die Stufen sortiert nach Körper und Breite', () => {
    const text = datenlisteText([
      { id: 'io', stufen: [{ breite: 1024, pfad: 'textures/io/albedo-1024.ktx2', mittel: 0.2394 }] },
      { id: 'earth', stufen: [
        { breite: 2048, pfad: 'textures/earth/albedo-2048.ktx2', mittel: 0.134 },
        { breite: 1024, pfad: 'textures/earth/albedo-1024.ktx2', mittel: 0.1339 },
      ] },
    ]);
    expect(text).toContain('Erzeugt von scripts/texturen-bauen.ts');
    expect(text.indexOf('earth:')).toBeLessThan(text.indexOf('io:'));
    expect(text.indexOf('albedo-1024')).toBeLessThan(text.indexOf('albedo-2048'));
    expect(text).toContain("{ breite: 1024, pfad: 'textures/earth/albedo-1024.ktx2', mittel: 0.1339 },");
    expect(text.endsWith('};\n')).toBe(true);
  });
});
