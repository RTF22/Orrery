import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { baue, inhaltsverzeichnis, pruefeVerweise, seiteEinfach, slug, umwandeln, verweisUmschreiben } from './doku-bauen.ts';

describe('slug', () => {
  it('bildet Kennungen aus Überschriften', () => {
    expect(slug('Phase 4d – Hochschule')).toBe('phase-4d-hochschule');
    expect(slug('Größe und Maß')).toBe('grosse-und-mass');
  });
});

describe('inhaltsverzeichnis', () => {
  it('nimmt feste Marken, sonst den Slug, zählt Doppelte hoch und überspringt Code', () => {
    const md = ['# Titel', '', '<a id="phase-1"></a>', '## Phase **1**', '### Ziel', '### Ziel',
      '```', '## Kein Kopf', '```'].join('\n');
    expect(inhaltsverzeichnis(md)).toEqual([
      { ebene: 2, text: 'Phase 1', id: 'phase-1' },
      { ebene: 3, text: 'Ziel', id: 'ziel' },
      { ebene: 3, text: 'Ziel', id: 'ziel-2' },
    ]);
  });
});

describe('verweisUmschreiben', () => {
  it.each([
    ['https://example.org/a', 'https://example.org/a'],
    ['#x', '#x'],
    ['chronik.de.md#phase-1', 'chronik.html#phase-1'],
    ['entstehung.de.md', 'index.html'],
    ['entstehung.en.md', '../en/index.html'],
    ['chronik.en.md#x', '../en/chronik.html#x'],
    ['bilder/entstehung/a.jpg', '../bilder/entstehung/a.jpg'],
    ['../README.md', 'https://github.com/RTF22/Orrery/blob/master/README.md'],
    ['belege/hochschule/', 'https://github.com/RTF22/Orrery/tree/master/docs/belege/hochschule/'],
  ])('%s → %s', (ein, aus) => {
    expect(verweisUmschreiben(ein, 'de').href).toBe(aus);
  });
  it('meldet Bilder zum Kopieren', () => {
    expect(verweisUmschreiben('bilder/entstehung/a.jpg', 'de').bild).toBe('bilder/entstehung/a.jpg');
  });
  it('schreibt weitere Repository-Pfade auf GitHub um', () => {
    expect(verweisUmschreiben('ursprungsprompt.md', 'de').href).toBe(
      'https://github.com/RTF22/Orrery/blob/master/docs/ursprungsprompt.md',
    );
    expect(verweisUmschreiben('phase4d-abnahme.md#x', 'de').href).toBe(
      'https://github.com/RTF22/Orrery/blob/master/docs/phase4d-abnahme.md#x',
    );
  });
});

describe('umwandeln', () => {
  it('setzt Kennungen an Überschriften, entfernt Marken, Titel und Sprachzeile', () => {
    const md = '# Titel\n\n[English](x.en.md) | **Deutsch**\n\nText.\n\n<a id="p1"></a>\n## Eins\n\n| a | b |\n|---|---|\n| 1 | 2 |\n';
    const u = umwandeln(md, 'de');
    expect(u.titel).toBe('Titel');
    expect(u.html).toContain('<h2 id="p1">Eins</h2>');
    expect(u.html).not.toContain('<a id="p1">');
    expect(u.html).not.toContain('<h1');
    expect(u.html).not.toContain('English');
    expect(u.html).toContain('<table>');
  });
});

describe('baue und pruefeVerweise', () => {
  function quelle(): string {
    const q = mkdtempSync(join(tmpdir(), 'doku-'));
    mkdirSync(join(q, 'bilder', 'entstehung'), { recursive: true });
    writeFileSync(join(q, 'bilder', 'entstehung', 'a.jpg'), 'x');
    for (const s of ['de', 'en']) {
      writeFileSync(join(q, `entstehung.${s}.md`),
        `# Ü ${s}\n\nErster Absatz.\n\n![Bild](bilder/entstehung/a.jpg)\n\n[Chronik](chronik.${s}.md#p1)\n`);
      writeFileSync(join(q, `chronik.${s}.md`), `# C ${s}\n\n<a id="p1"></a>\n## Eins\n`);
    }
    return q;
  }
  it('schreibt vier Seiten, kopiert Bilder und findet keine toten Verweise', () => {
    const ziel = mkdtempSync(join(tmpdir(), 'dist-'));
    baue(quelle(), ziel, seiteEinfach);
    for (const p of ['de/index.html', 'de/chronik.html', 'en/index.html', 'en/chronik.html', 'bilder/entstehung/a.jpg'])
      expect(existsSync(join(ziel, 'making-of', p))).toBe(true);
    expect(pruefeVerweise(ziel)).toEqual([]);
  });
  it('meldet tote Verweise und fehlende Marken', () => {
    const ziel = mkdtempSync(join(tmpdir(), 'dist-'));
    baue(quelle(), ziel, seiteEinfach);
    const p = join(ziel, 'making-of', 'de', 'index.html');
    writeFileSync(p, readFileSync(p, 'utf8') + '<a href="fehlt.html">x</a><a href="chronik.html#nichts">y</a>');
    expect(pruefeVerweise(ziel)).toHaveLength(2);
  });
});
