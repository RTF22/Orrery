import { describe, it, expect } from 'vitest';
import { inlineText, parseInline, parseMarkdown, tabellenzellen, titelVon } from './markdownParser';

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

const formel = (tex: string) => ({ typ: 'formel' as const, tex });

describe('Formeln (Entwurf 4d §3.1)', () => {
  it('erkennt eine Formel im Satz', () => {
    expect(parseInline('Es gilt $a^2$ hier.')).toEqual([text('Es gilt '), formel('a^2'), text(' hier.')]);
    expect(parseInline('$x$')).toEqual([formel('x')]);
  });

  it('folgt der Regel von Pandoc: Leerraum innen am Rand oder Ziffer danach schließen nicht', () => {
    expect(parseInline('kostet 5 $ und 6 $')).toEqual([text('kostet 5 $ und 6 $')]);
    expect(parseInline('$5 und $6')).toEqual([text('$5 und $6')]);
    expect(parseInline('$a$5')).toEqual([text('$a$5')]);
    expect(parseInline('ein $ allein')).toEqual([text('ein $ allein')]);
  });

  it('maskiert \\$ als Dollarzeichen', () => {
    expect(parseInline('Preis \\$5 und \\$6')).toEqual([text('Preis $5 und $6')]);
  });

  it('schließt nach einer geraden Zahl von Backslashes, nicht nach einer ungeraden', () => {
    expect(parseInline('$a\\\\$')).toEqual([formel('a\\\\')]);
    expect(parseInline('$a\\$b$')).toEqual([formel('a\\$b')]);
    expect(parseInline('$a\\\\\\$b$')).toEqual([formel('a\\\\\\$b')]);
  });

  it('wertet in Formeln kein Markdown aus, außerhalb schon', () => {
    expect(parseInline('$a*b$ und *k*')).toEqual([
      formel('a*b'), text(' und '), { typ: 'kursiv', kinder: [text('k')] },
    ]);
    expect(parseInline('[Wert $x$](objekt:earth)')).toEqual([
      { typ: 'link', ziel: 'objekt:earth', kinder: [text('Wert '), formel('x')] },
    ]);
  });

  it('macht aus einem Absatz mit $$ am Anfang und Ende eine Blockformel', () => {
    expect(parseMarkdown('Vorher\n\n$$\nT^2 = a^3\n$$\n\nNachher')).toEqual([
      { typ: 'absatz', kinder: [text('Vorher')] },
      { typ: 'formel', tex: 'T^2 = a^3' },
      { typ: 'absatz', kinder: [text('Nachher')] },
    ]);
    expect(parseMarkdown('$$x$$')).toEqual([{ typ: 'formel', tex: 'x' }]);
  });

  it('liefert als Klartext einer Formel ihren Quelltext', () => {
    expect(inlineText([text('a '), formel('x^2')])).toBe('a x^2');
  });
});

describe('Tabellen (Entwurf 4d §3.1)', () => {
  it('zerlegt Zeilen an unmaskierten Strichen und löst \\| danach auf', () => {
    expect(tabellenzellen('| a | b |')).toEqual(['a', 'b']);
    expect(tabellenzellen('| $\\|x\\|$ | c \\| d |')).toEqual(['$|x|$', 'c | d']);
    expect(tabellenzellen('| a | b')).toBeNull();
    expect(tabellenzellen('a | b |')).toBeNull();
    expect(tabellenzellen('| a \\|')).toBeNull();
  });

  it('erkennt Kopf, Ausrichtung und Datenzeilen mit Inline-Elementen', () => {
    const md = '| Größe | Wert | Mitte |\n|:---|---:|:---:|\n| $J_2$ | **1** | x |\n| a \\| b | 2 | y |';
    expect(parseMarkdown(md)).toEqual([{
      typ: 'tabelle',
      ausrichtung: ['links', 'rechts', 'mitte'],
      kopf: [[text('Größe')], [text('Wert')], [text('Mitte')]],
      zeilen: [
        [[formel('J_2')], [{ typ: 'fett', kinder: [text('1')] }], [text('x')]],
        [[text('a | b')], [text('2')], [text('y')]],
      ],
    }]);
  });

  it('schließt einen vorangehenden Absatz und endet an einer Zeile ohne Strich', () => {
    expect(parseMarkdown('Vorher\n| a |\n|---|\n| 1 |\nNachher')).toEqual([
      { typ: 'absatz', kinder: [text('Vorher')] },
      { typ: 'tabelle', ausrichtung: ['links'], kopf: [[text('a')]], zeilen: [[[text('1')]]] },
      { typ: 'absatz', kinder: [text('Nachher')] },
    ]);
  });

  it('macht aus Strichzeilen ohne gültige Form einen eigenen Absatz', () => {
    expect(parseMarkdown('| a | b |\n|---|---|\n| 1 |')).toEqual([
      { typ: 'absatz', kinder: [text('| a | b | |---|---| | 1 |')] },
    ]);
    expect(parseMarkdown('| a | b |\nText')).toEqual([
      { typ: 'absatz', kinder: [text('| a | b |')] },
      { typ: 'absatz', kinder: [text('Text')] },
    ]);
    expect(parseMarkdown('| a |\n|--|\n| 1 |')).toEqual([
      { typ: 'absatz', kinder: [text('| a | |--| | 1 |')] },
    ]);
  });
});
