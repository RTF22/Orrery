import { describe, expect, it } from 'vitest';
import {
  arxivEintragLesen, auswahl, crossrefJahre, jahrUrteil, mitWiederholung, normalisiere, pruefeArxiv, pruefeCrossref,
  wortanteil, WIEDERHOLBARE_STATUS,
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

  it('entfernt sup-Tags samt folgendem Leerraum und hochgestellte Ziffern wie gewöhnliche (Crossref-Titel Brennecka et al. 2010)', () => {
    const crossref = [
      '<sup>238</sup>\n            U/\n            <sup>235</sup>\n            U Variations',
      ' in Meteorites: Extant\n            <sup>247</sup>\n            Cm and Implications for',
      ' Pb-Pb Dating',
    ].join('');
    const katalog = '²³⁸U/²³⁵U Variations in Meteorites: Extant ²⁴⁷Cm and Implications for Pb-Pb Dating';
    expect(normalisiere(crossref)).toBe(normalisiere(katalog));
    expect(wortanteil(crossref, katalog)).toBe(1);
  });

  it('entfernt auch sub-Tags samt folgendem Leerraum und tiefgestellte Ziffern wie gewöhnliche', () => {
    const crossref = 'H<sub>2</sub>\n            O Content of Chondrites';
    const katalog = 'H₂O Content of Chondrites';
    expect(normalisiere(crossref)).toBe(normalisiere(katalog));
    expect(wortanteil(crossref, katalog)).toBe(1);
  });

  it('wortanteil vergleicht auch die getrennte Lesart, wenn der Leerraum nach </sub> eine echte '
    + 'Worttrennung ist, ohne den Brennecka-Fall zu verlieren (Schlussprüfungsbefund M5)', () => {
    expect(wortanteil('CO<sub>2</sub> ice', 'CO2 ice')).toBe(1);
    const crossref = [
      '<sup>238</sup>\n            U/\n            <sup>235</sup>\n            U Variations',
      ' in Meteorites: Extant\n            <sup>247</sup>\n            Cm and Implications for',
      ' Pb-Pb Dating',
    ].join('');
    const katalog = '²³⁸U/²³⁵U Variations in Meteorites: Extant ²⁴⁷Cm and Implications for Pb-Pb Dating';
    expect(wortanteil(crossref, katalog)).toBe(1);
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

  it('meldet einen Crossref-Datensatz ohne Autoren als Warnung, nicht als Fehler (Ruling Jens, 18.09.2026)', () => {
    const ohneFeld = { ...WERK, author: undefined };
    expect(pruefeCrossref(P, ohneFeld)).toEqual([
      { id: 'mueller-2019', pruefung: 'crossref', urteil: 'warnung', text: 'Crossref führt keine Autoren, Erstautor ungeprüft' },
    ]);
    const leeresArray = { ...WERK, author: [] };
    expect(pruefeCrossref(P, leeresArray)).toEqual([
      { id: 'mueller-2019', pruefung: 'crossref', urteil: 'warnung', text: 'Crossref führt keine Autoren, Erstautor ungeprüft' },
    ]);
  });

  it('vergleicht den Titel auch mit angehängtem Untertitel', () => {
    const werkMitUntertitel = {
      ...WERK,
      title: ['Gaia Early Data Release 3'],
      subtitle: ['The celestial reference frame (Gaia-CRF3)'],
    };
    expect(pruefeCrossref(
      { ...P, titel: 'Gaia Early Data Release 3: The celestial reference frame (Gaia-CRF3)' },
      werkMitUntertitel,
    )).toEqual([
      { id: 'mueller-2019', pruefung: 'crossref', urteil: 'ok', text: 'Erstautor, Jahr und Titel stimmen' },
    ]);
    expect(pruefeCrossref(
      { ...P, titel: 'Gaia Early Data Release 3' },
      werkMitUntertitel,
    )).toEqual([
      { id: 'mueller-2019', pruefung: 'crossref', urteil: 'ok', text: 'Erstautor, Jahr und Titel stimmen' },
    ]);
    const fehler = pruefeCrossref({ ...P, titel: 'Something else entirely' }, werkMitUntertitel);
    expect(fehler.map((b) => b.urteil)).toEqual(['fehler']);
    expect(fehler[0]?.text).toContain('The celestial reference frame');
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

  it('löst XML-Entitäten in Titel und Namen auf', () => {
    const mitEntitaeten = [
      '<feed><entry><id>http://arxiv.org/abs/2002.00002v1</id><published>2020-02-02T00:00:00Z</published>',
      '<title>Tides &amp; resonances</title>',
      '<author><name>Ren&#233; M&#xFC;ller</name></author></entry></feed>',
    ].join('');
    expect(arxivEintragLesen(mitEntitaeten)).toEqual({
      titel: 'Tides & resonances', autoren: ['René Müller'], jahr: 2020,
    });
    const verschachtelt = '<feed><entry><title>A &amp;lt; B</title></entry></feed>';
    expect(arxivEintragLesen(verschachtelt)?.titel).toBe('A &lt; B');
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

  it('wirft bei --nur ohne Kennungen, statt still nichts zu prüfen (Schlussprüfung 4d-1, Befund M6)', () => {
    expect(() => auswahl(['--nur'], [a, b, c])).toThrow('--nur braucht mindestens eine Kennung');
    expect(() => auswahl(['--nur', ''], [a, b, c])).toThrow('--nur braucht mindestens eine Kennung');
    expect(() => auswahl(['--nur', ' , ,'], [a, b, c])).toThrow('--nur braucht mindestens eine Kennung');
  });
});

describe('mitWiederholung', () => {
  /** Liefert der Reihe nach die angegebenen Status oder wirft die angegebenen Fehler. */
  function folge(schritte: readonly (number | Error)[]): { abruf: () => Promise<{ status: number }>; aufrufe: () => number } {
    let n = 0;
    return {
      abruf: () => {
        const s = schritte[Math.min(n, schritte.length - 1)]!;
        n += 1;
        return s instanceof Error ? Promise.reject(s) : Promise.resolve({ status: s });
      },
      aufrufe: () => n,
    };
  }
  const zeitueberschreitung = (): Error => Object.assign(new Error('Zeit abgelaufen'), { name: 'TimeoutError' });

  it('wiederholt bei 502, 503 und 504 mit den angegebenen Pausen und liefert die erste gute Antwort', async () => {
    expect([...WIEDERHOLBARE_STATUS].sort()).toEqual([502, 503, 504]);
    const f = folge([504, 503, 200]);
    const pausen: number[] = [];
    const antwort = await mitWiederholung(f.abruf, async (ms) => { pausen.push(ms); }, [10, 20]);
    expect(antwort.status).toBe(200);
    expect(f.aufrufe()).toBe(3);
    expect(pausen).toEqual([10, 20]);
  });

  it('gibt nach der letzten Wiederholung die letzte Antwort zurück', async () => {
    const f = folge([504]);
    const antwort = await mitWiederholung(f.abruf, async () => {}, [10, 20]);
    expect(antwort.status).toBe(504);
    expect(f.aufrufe()).toBe(3);
  });

  it('wiederholt nicht bei anderen Status', async () => {
    for (const status of [200, 404, 429, 500]) {
      const f = folge([status]);
      expect((await mitWiederholung(f.abruf, async () => {}, [10])).status).toBe(status);
      expect(f.aufrufe()).toBe(1);
    }
  });

  it('wiederholt bei Zeitüberschreitung und wirft zuletzt, andere Fehler sofort', async () => {
    const erholt = folge([zeitueberschreitung(), 200]);
    expect((await mitWiederholung(erholt.abruf, async () => {}, [10])).status).toBe(200);
    expect(erholt.aufrufe()).toBe(2);

    const dauerhaft = folge([zeitueberschreitung()]);
    await expect(mitWiederholung(dauerhaft.abruf, async () => {}, [10])).rejects.toThrow('Zeit abgelaufen');
    expect(dauerhaft.aufrufe()).toBe(2);

    const netz = folge([new TypeError('fetch failed')]);
    await expect(mitWiederholung(netz.abruf, async () => {}, [10])).rejects.toThrow('fetch failed');
    expect(netz.aufrufe()).toBe(1);
  });
});
