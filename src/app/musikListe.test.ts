import { describe, expect, it } from 'vitest';
import { pruefeListe } from './musikListe';

describe('pruefeListe', () => {
  it('liefert für alles außer einem Array eine leere Liste', () => {
    for (const roh of [null, undefined, 42, 'x', { datei: 'a.mp3' }]) {
      expect(pruefeListe(roh)).toEqual([]);
    }
  });

  it('übernimmt gültige Einträge mit Pflicht- und freiwilligen Feldern', () => {
    expect(pruefeListe([
      { datei: 'a.mp3' },
      { datei: 'b.mp3', titel: ' Morgen ', urheber: 'Jemand', link: 'https://example.org/b' },
    ])).toEqual([
      { datei: 'a.mp3' },
      { datei: 'b.mp3', titel: 'Morgen', urheber: 'Jemand', link: 'https://example.org/b' },
    ]);
  });

  it('verwirft Einträge ohne gültigen Dateinamen', () => {
    expect(pruefeListe([
      { titel: 'ohne Datei' }, { datei: '' }, { datei: 7 }, { datei: '../index.html' },
      { datei: 'unter/ordner.mp3' }, { datei: 'a\\b.mp3' }, { datei: '.' }, { datei: '..' },
      'a.mp3', null, [], { datei: 'gut.mp3' },
    ])).toEqual([{ datei: 'gut.mp3' }]);
  });

  it('lässt freiwillige Felder weg, die leer oder kein Text sind', () => {
    expect(pruefeListe([{ datei: 'a.mp3', titel: '  ', urheber: 3, link: null }])).toEqual([{ datei: 'a.mp3' }]);
  });

  it('nimmt Links nur mit http oder https', () => {
    expect(pruefeListe([
      { datei: 'a.mp3', link: 'javascript:alert(1)' },
      { datei: 'b.mp3', link: 'ftp://x/b' },
      { datei: 'c.mp3', link: 'http://example.org/c' },
    ])).toEqual([{ datei: 'a.mp3' }, { datei: 'b.mp3' }, { datei: 'c.mp3', link: 'http://example.org/c' }]);
  });
});

describe('Ablage', () => {
  it('hält Musik aus dem Repository und cacht MP3 wie Bilder', async () => {
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration (wie in src/data/index.test.ts).
    const { readFileSync } = await import('node:fs');
    expect((readFileSync('.gitignore', 'utf8') as string).split(/\r?\n/)).toContain('public/musik/');
    expect(readFileSync('public/.htaccess', 'utf8') as string).toMatch(/FilesMatch "\\\.\(jpg\|jpeg\|png\|webp\|ktx2\|mp3\)\$"/);
  });
});
