import { describe, expect, it } from 'vitest';
import {
  arxivEintragLesen, auswahl, crossrefJahre, jahrUrteil, normalisiere, pruefeArxiv, pruefeCrossref, wortanteil,
} from './literaturVergleich.ts';
import type { Publikation } from '../src/data/literatur.ts';

/** Erfundene Testdaten. */
const P: Publikation = {
  id: 'mueller-2019', autoren: ['Müller, A.'], etAl: true, jahr: 2019,
  titel: 'Measurement and implications of a gravity field', erschienen: 'Test 1, 1', doi: '10.0000/x',
};
const WERK = {
  title: ['Measurement and implications of a <i>gravity</i> field'],
  author: [{ family: 'Müller' }, { family: 'Beispiel' }],
  'published-print': { 'date-parts': [[2019, 6, 14]] },
  issued: { 'date-parts': [[2019]] },
};

describe('normalisiere und wortanteil', () => {
  it('entfernt Auszeichnungen, Diakritika, Satzzeichen und Großschreibung', () => {
    expect(normalisiere('Saturn’s <i>Gravity</i> Field: Müller')).toBe('saturn s gravity field muller');
  });

  it('misst den Anteil gemeinsamer Wörter bezogen auf beide Titel', () => {
    expect(wortanteil('Measurement of Saturn', 'measurement of saturn')).toBe(1);
    expect(wortanteil('A B C D', 'a b c')).toBe(0.75);
    expect(wortanteil('', 'x')).toBe(0);
  });
});

describe('Jahre', () => {
  it('liest Druck-, Online- und Ausgabejahr aus Crossref', () => {
    expect(crossrefJahre(WERK)).toEqual([2019, 2019]);
    expect(crossrefJahre({})).toEqual([]);
  });

  it('urteilt gleich ok, um eins Warnung, sonst Fehler', () => {
    expect(jahrUrteil(2019, [2019, 2020])).toBe('ok');
    expect(jahrUrteil(2019, [2020])).toBe('warnung');
    expect(jahrUrteil(2019, [2021, 2017])).toBe('fehler');
    expect(jahrUrteil(2019, [])).toBe('fehler');
  });
});

describe('pruefeCrossref', () => {
  it('bestätigt Erstautor, Jahr und Titel', () => {
    expect(pruefeCrossref(P, WERK)).toEqual([
      { id: 'mueller-2019', pruefung: 'crossref', urteil: 'ok', text: 'Erstautor, Jahr und Titel stimmen' },
    ]);
  });

  it('meldet abweichenden Erstautor und Titel als Fehler, Jahr um eins als Warnung', () => {
    const befunde = pruefeCrossref(P, {
      ...WERK, author: [{ family: 'Mayer' }], title: ['Something else entirely'], 'published-print': { 'date-parts': [[2020]] }, issued: { 'date-parts': [[2020]] },
    });
    expect(befunde.map((b) => b.urteil)).toEqual(['fehler', 'warnung', 'fehler']);
    expect(befunde[0]?.text).toContain('Mayer');
  });
});

describe('arXiv', () => {
  const XML = [
    '<feed><title>arXiv Query: id_list=2001.00001</title>',
    '<entry><id>http://arxiv.org/abs/2001.00001v1</id><published>2020-01-02T00:00:00Z</published>',
    '<title>Measurement and implications\n  of a gravity field</title>',
    '<author><name>Anna Müller</name></author><author><name>B. Beispiel</name></author></entry></feed>',
  ].join('');

  it('liest Titel, Autoren und Jahr des ersten Eintrags, nicht den Titel des Feeds', () => {
    expect(arxivEintragLesen(XML)).toEqual({
      titel: 'Measurement and implications of a gravity field', autoren: ['Anna Müller', 'B. Beispiel'], jahr: 2020,
    });
    expect(arxivEintragLesen('<feed><title>leer</title></feed>')).toBeNull();
    expect(arxivEintragLesen('<feed><entry><title>Error</title></entry></feed>')).toBeNull();
  });

  it('prüft Erstautor und Titel; abweichender Titel ist bei Einträgen mit DOI nur eine Warnung', () => {
    const eintrag = arxivEintragLesen(XML);
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, eintrag).map((b) => b.urteil)).toEqual(['ok']);
    const anders = { titel: 'A different preprint title here', autoren: ['Anna Müller'], jahr: 2020 };
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, anders).map((b) => b.urteil)).toEqual(['warnung']);
    const preprint: Publikation = { ...P, arxiv: '2001.00001', doi: undefined };
    expect(pruefeArxiv(preprint, anders).map((b) => b.urteil)).toEqual(['fehler']);
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, { ...anders, titel: P.titel, autoren: ['Hans Mayer'] }).map((b) => b.urteil)).toEqual(['fehler']);
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, null)).toEqual([
      { id: 'mueller-2019', pruefung: 'arxiv', urteil: 'fehler', text: 'arXiv 2001.00001 nicht gefunden' },
    ]);
  });
});

describe('auswahl', () => {
  const a = { ...P, id: 'a-2019' };
  const b = { ...P, id: 'b-2020', jahr: 2020 };
  const c = { ...P, id: 'c-2021', jahr: 2021 };

  it('nimmt ohne --nur den ganzen Katalog, sonst die genannten Einträge in Katalogreihenfolge', () => {
    expect(auswahl([], [a, b, c])).toEqual([a, b, c]);
    expect(auswahl(['--nur', 'c-2021, a-2019'], [a, b, c])).toEqual([a, c]);
  });

  it('wirft bei unbekannten Kennungen', () => {
    expect(() => auswahl(['--nur', 'x-1999'], [a, b, c])).toThrow('Unbekannte Kennungen: x-1999');
  });
});
