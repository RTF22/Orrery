import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { baue, inhaltsverzeichnis, pruefeVerweise, seiteEinfach, slug, umwandeln, verweisUmschreiben } from './doku-bauen.ts';

/** Eigene Beispieltexte: zwei Sprachen, je Dokument ein Bild und ein Querverweis mit Marke. */
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

describe('Setext-Überschriften', () => {
  // marked erkennt neben `##`/`###` auch Setext-Überschriften (Textzeile + Unterstreichung
  // aus `-` oder `=`, ohne Leerzeile dazwischen). inhaltsverzeichnis muss dieselben
  // Überschriften in derselben Reihenfolge zählen wie marked selbst, sonst verschiebt
  // sich still die Zuordnung der Kennungen an alle nachfolgenden Überschriften.
  const md = ['# Titel', '', 'Erste Überschrift', '---', '', '<a id="zweite"></a>', '## Zweite Überschrift', ''].join(
    '\n',
  );

  it('zählt eine Setext-Überschrift (Tiefe 2) wie eine ATX-Überschrift derselben Tiefe', () => {
    expect(inhaltsverzeichnis(md)).toEqual([
      { ebene: 2, text: 'Erste Überschrift', id: 'erste-uberschrift' },
      { ebene: 2, text: 'Zweite Überschrift', id: 'zweite' },
    ]);
  });

  it('setzt in umwandeln die richtigen Kennungen in der richtigen Reihenfolge, auch über eine Setext-Überschrift hinweg', () => {
    const u = umwandeln(md, 'de');
    expect(u.html).toContain('<h2 id="erste-uberschrift">Erste Überschrift</h2>');
    expect(u.html).toContain('<h2 id="zweite">Zweite Überschrift</h2>');
  });
});

describe('Trennstrich nach Liste, Tabelle oder Zitat ist keine Setext-Überschrift', () => {
  // marked selbst entscheidet, ob eine Zeile aus nur `-` eine Setext-Überschrift
  // ist oder ein Trennstrich: Nach einer Liste, einer Tabellenzeile oder einem
  // Zitat schließt der vorige Block bereits ab, `---` wird zu <hr>. Eine eigene,
  // handgeschriebene Erkennung (wie vor diesem Umbau) kann das nicht zuverlässig
  // unterscheiden und hält die letzte Listen-/Tabellen-/Zitatzeile fälschlich für
  // eine Überschrift — die wirkliche Überschrift danach bekäme dann die falsche
  // Kennung zugewiesen (verschoben um einen Eintrag).
  it('Liste, dann --- (kein Trennstrich als Überschrift): die echte Überschrift danach bekommt die richtige Kennung', () => {
    const md = ['# Titel', '', '- Punkt A', '- Punkt B', '---', '', '<a id="echte"></a>', '## Echte Überschrift'].join(
      '\n',
    );
    expect(inhaltsverzeichnis(md)).toEqual([{ ebene: 2, text: 'Echte Überschrift', id: 'echte' }]);
  });

  it('Tabellenzeile, dann ---: die echte Überschrift danach bekommt die richtige Kennung', () => {
    const md = [
      '# Titel',
      '',
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
      '---',
      '',
      '<a id="echte"></a>',
      '## Echte Überschrift',
    ].join('\n');
    expect(inhaltsverzeichnis(md)).toEqual([{ ebene: 2, text: 'Echte Überschrift', id: 'echte' }]);
  });

  it('Blockquote, dann ---: die echte Überschrift danach bekommt die richtige Kennung', () => {
    const md = ['# Titel', '', '> Ein Zitat', '---', '', '<a id="echte"></a>', '## Echte Überschrift'].join('\n');
    expect(inhaltsverzeichnis(md)).toEqual([{ ebene: 2, text: 'Echte Überschrift', id: 'echte' }]);
  });

  it('ATX-Überschrift mit Marke bleibt richtig zugeordnet, auch neben den Trennstrich-Fällen oben', () => {
    const md = ['# Titel', '', 'Text.', '', '<a id="marke"></a>', '## Mit Marke'].join('\n');
    expect(inhaltsverzeichnis(md)).toEqual([{ ebene: 2, text: 'Mit Marke', id: 'marke' }]);
  });
});

describe('Zeilenenden CRLF', () => {
  // `marked` normalisiert `\r\n`/`\r` intern selbst vor dem Lexen; die Zeilen- und
  // Offset-Rechnung in inhaltsverzeichnis lief vor diesem Fix am unnormalisierten
  // Text vorbei und verlor dadurch die Zuordnung der Marke — still, ohne
  // Fehlermeldung, mit CRLF-Eingabe (Windows-Checkouts liefern oft CRLF).
  const lf = ['# Titel', '', 'Text.', '', '<a id="marke"></a>', '## Mit Marke', ''].join('\n');
  const crlf = lf.replace(/\n/g, '\r\n');

  it('inhaltsverzeichnis findet die Marke auch bei CRLF-Zeilenenden', () => {
    expect(inhaltsverzeichnis(crlf)).toEqual([{ ebene: 2, text: 'Mit Marke', id: 'marke' }]);
  });

  it('umwandeln setzt dieselbe Kennung im HTML auch bei CRLF-Zeilenenden', () => {
    const u = umwandeln(crlf, 'de');
    expect(u.html).toContain('<h2 id="marke">Mit Marke</h2>');
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
  it('findet auch bei relativer Wurzel keine toten Verweise (Regressionstest: alleDateien() lieferte relative, resolve() aber absolute Pfade)', () => {
    // Muss unterhalb des Arbeitsverzeichnisses liegen, damit relative() unten
    // tatsächlich einen relativen (nicht laufwerksübergreifenden) Pfad liefert.
    const ziel = mkdtempSync(join(process.cwd(), 'doku-rel-'));
    try {
      baue(quelle(), ziel, seiteEinfach);
      const zielRelativ = relative(process.cwd(), ziel);
      expect(pruefeVerweise(zielRelativ)).toEqual([]);
    } finally {
      rmSync(ziel, { recursive: true, force: true });
    }
  });
});

describe('pruefeVerweise mit stamm (die Seitenvorlage verlinkt bewusst aus dist/doku/ hinaus)', () => {
  it('prüft Verweise, die aus wurzel hinausführen, gegen stamm statt gegen wurzel, und meldet auch, was zufällig außerhalb von stamm existiert', () => {
    const basis = mkdtempSync(join(tmpdir(), 'stamm-'));
    // Datei außerhalb des Stamms, die es zufällig gibt — ein Verweis dorthin
    // bleibt trotzdem ein Befund, weil er über den Stamm hinausführt.
    writeFileSync(join(basis, 'index.html'), '<html></html>');

    const stamm = join(basis, 'dist');
    mkdirSync(stamm, { recursive: true });
    // Die echte Zieldatei im Stamm, außerhalb von wurzel, aber innerhalb von stamm.
    writeFileSync(join(stamm, 'index.html'), '<html></html>');

    const wurzel = join(stamm, 'doku');
    mkdirSync(wurzel, { recursive: true });
    writeFileSync(
      join(wurzel, 'seite.html'),
      '<a href="../index.html">im Stamm, vorhanden</a>' +
        '<a href="../fehlt.html">im Stamm, fehlt</a>' +
        '<a href="../../index.html">außerhalb des Stamms, obwohl dort eine Datei liegt</a>',
    );

    expect(pruefeVerweise(wurzel, stamm)).toEqual([
      'seite.html → ../fehlt.html',
      'seite.html → ../../index.html',
    ]);
  });
});
