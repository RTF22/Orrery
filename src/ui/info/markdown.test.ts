import { describe, it, expect } from 'vitest';
import { parseInline, parseMarkdown, titelVon } from './markdown';

const text = (t: string) => ({ typ: 'text' as const, text: t });

describe('parseInline', () => {
  it('lässt reinen Text unverändert', () => {
    expect(parseInline('Die Erde ist rund.')).toEqual([text('Die Erde ist rund.')]);
  });

  it('erkennt fett, kursiv und Verschachtelung', () => {
    expect(parseInline('a **b** c')).toEqual([text('a '), { typ: 'fett', kinder: [text('b')] }, text(' c')]);
    expect(parseInline('(*k*)')).toEqual([text('('), { typ: 'kursiv', kinder: [text('k')] }, text(')')]);
    expect(parseInline('**a *b* c**')).toEqual([
      { typ: 'fett', kinder: [text('a '), { typ: 'kursiv', kinder: [text('b')] }, text(' c')] },
    ]);
  });

  it('nimmt Sternchen in Zahlen und ungeschlossene Marker als Text', () => {
    expect(parseInline('5*10*2 und 3*4')).toEqual([text('5*10*2 und 3*4')]);
    expect(parseInline('**offen bleibt')).toEqual([text('**offen bleibt')]);
    expect(parseInline('a * b')).toEqual([text('a * b')]);
  });

  it('erkennt Links mit Klammern im Text und im Ziel', () => {
    expect(parseInline('siehe [Saturn (Planet)](https://de.wikipedia.org/wiki/Saturn_(Planet)) dort')).toEqual([
      text('siehe '),
      { typ: 'link', ziel: 'https://de.wikipedia.org/wiki/Saturn_(Planet)', kinder: [text('Saturn (Planet)')] },
      text(' dort'),
    ]);
    expect(parseInline('[Erde](objekt:earth)')).toEqual([{ typ: 'link', ziel: 'objekt:earth', kinder: [text('Erde')] }]);
    expect(parseInline('[**fett**](thema:modell)')).toEqual([
      { typ: 'link', ziel: 'thema:modell', kinder: [{ typ: 'fett', kinder: [text('fett')] }] },
    ]);
  });

  it('lässt kaputte Links und Leerraum im Ziel als Text stehen', () => {
    expect(parseInline('[ohne Ziel] und [x](a b)')).toEqual([text('[ohne Ziel] und [x](a b)')]);
    expect(parseInline('[](objekt:earth)')).toEqual([text('[](objekt:earth)')]);
  });

  it('reicht HTML nicht durch', () => {
    expect(parseInline('<b>x</b>')).toEqual([text('<b>x</b>')]);
  });
});

describe('parseMarkdown', () => {
  it('trennt Überschriften, Absätze und Listen; Zeilen eines Absatzes werden verbunden', () => {
    const md = [
      '# Titel',
      '',
      'Erste Zeile',
      'zweite Zeile.',
      '- Punkt eins',
      '- Punkt **zwei**',
      '',
      '1. eins',
      '2. zwei',
      '### Klein',
      'Schluss',
    ].join('\n');
    expect(parseMarkdown(md)).toEqual([
      { typ: 'ueberschrift', ebene: 1, kinder: [text('Titel')] },
      { typ: 'absatz', kinder: [text('Erste Zeile zweite Zeile.')] },
      { typ: 'liste', geordnet: false, punkte: [[text('Punkt eins')], [text('Punkt '), { typ: 'fett', kinder: [text('zwei')] }]] },
      { typ: 'liste', geordnet: true, punkte: [[text('eins')], [text('zwei')]] },
      { typ: 'ueberschrift', ebene: 3, kinder: [text('Klein')] },
      { typ: 'absatz', kinder: [text('Schluss')] },
    ]);
  });

  it('hängt eingerückte Folgezeilen an den Listenpunkt', () => {
    expect(parseMarkdown('- **A:** erste\n  zweite\n- B')).toEqual([
      { typ: 'liste', geordnet: false, punkte: [
        [{ typ: 'fett', kinder: [text('A:')] }, text(' erste zweite')],
        [text('B')],
      ] },
    ]);
  });

  it('kommt mit Windows-Zeilenenden und Leerzeilen am Ende zurecht', () => {
    expect(parseMarkdown('# T\r\n\r\nAbsatz\r\n\r\n')).toEqual([
      { typ: 'ueberschrift', ebene: 1, kinder: [text('T')] },
      { typ: 'absatz', kinder: [text('Absatz')] },
    ]);
  });

  it('titelVon liefert die erste Überschrift der Ebene 1 als Text', () => {
    expect(titelVon(parseMarkdown('# Die *Erde*\n\nx'))).toBe('Die Erde');
    expect(titelVon(parseMarkdown('## nur klein'))).toBeNull();
  });
});
