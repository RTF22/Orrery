import { describe, it, expect } from 'vitest';
import { texNachMathml } from './texUebersetzer';
import type { MathKnoten } from './texUebersetzer';

const mi = (text: string, attribute?: Record<string, string>): MathKnoten =>
  (attribute === undefined ? { tag: 'mi', text } : { tag: 'mi', attribute, text });
const mn = (text: string): MathKnoten => ({ tag: 'mn', text });
const mo = (text: string, attribute?: Record<string, string>): MathKnoten =>
  (attribute === undefined ? { tag: 'mo', text } : { tag: 'mo', attribute, text });
const el = (tag: string, kinder: MathKnoten[], attribute?: Record<string, string>): MathKnoten =>
  (attribute === undefined ? { tag, kinder } : { tag, attribute, kinder });
const NORMAL = { mathvariant: 'normal' };
const STRETCHY = { stretchy: 'true' };

/** Kinder der obersten Zeile; wirft bei einem Übersetzungsfehler. */
function zeile(tex: string, block = false): MathKnoten[] {
  const ergebnis = texNachMathml(tex, block);
  if ('fehler' in ergebnis) throw new Error(`${ergebnis.fehler} (Stelle ${ergebnis.stelle})`);
  const wurzel = ergebnis.baum;
  if ('text' in wurzel) throw new Error('Blatt als Wurzel');
  const mrow = wurzel.kinder[0];
  if (mrow === undefined || 'text' in mrow) throw new Error('keine Zeile');
  return [...mrow.kinder];
}

describe('texNachMathml', () => {
  it('baut die Wurzel math mit display und einer Zeile', () => {
    expect(texNachMathml('x', false)).toEqual({
      baum: el('math', [el('mrow', [mi('x')])], { display: 'inline' }),
    });
    expect(texNachMathml('x', true)).toEqual({
      baum: el('math', [el('mrow', [mi('x')])], { display: 'block' }),
    });
  });

  it('übersetzt Buchstaben, Zahlen mit Dezimalkomma oder -punkt und Operatoren', () => {
    expect(zeile('a+2{,}44-b')).toEqual([mi('a'), mo('+'), mn('2,44'), mo('−'), mi('b')]);
    expect(zeile('3.5 = x, y : z')).toEqual([mn('3.5'), mo('='), mi('x'), mo(','), mi('y'), mo(':'), mi('z')]);
    expect(zeile('|x|')).toEqual([mo('|'), mi('x'), mo('|')]);
    expect(zeile('a{,}b')).toEqual([mi('a'), mo(','), mi('b')]);
  });

  it('übersetzt Hoch- und Tiefstellung', () => {
    expect(zeile('x^2')).toEqual([el('msup', [mi('x'), mn('2')])]);
    expect(zeile('M_\\odot')).toEqual([el('msub', [mi('M'), mo('⊙')])]);
    expect(zeile('a_i^{2}')).toEqual([el('msubsup', [mi('a'), mi('i'), mn('2')])]);
    expect(zeile('x^{-1}')).toEqual([el('msup', [mi('x'), el('mrow', [mo('−'), mn('1')])])]);
    expect(zeile('M_\\oplus')).toEqual([el('msub', [mi('M'), mo('⊕')])]);
  });

  it('übersetzt Brüche und Wurzeln', () => {
    expect(zeile('\\frac{a}{b}')).toEqual([el('mfrac', [mi('a'), mi('b')])]);
    expect(zeile('\\sqrt{x}')).toEqual([el('msqrt', [mi('x')])]);
    expect(zeile('\\sqrt[3]{x}')).toEqual([el('mroot', [mi('x'), mn('3')])]);
  });

  it('setzt das dritte Keplersche Gesetz', () => {
    expect(zeile('T^2 = \\frac{4\\pi^2 a^3}{G(M_\\odot + m)}', true)).toEqual([
      el('msup', [mi('T'), mn('2')]),
      mo('='),
      el('mfrac', [
        el('mrow', [mn('4'), el('msup', [mi('π'), mn('2')]), el('msup', [mi('a'), mn('3')])]),
        el('mrow', [mi('G'), mo('('), el('msub', [mi('M'), mo('⊙')]), mo('+'), mi('m'), mo(')')]),
      ]),
    ]);
  });

  it('übersetzt \\left und \\right mit dehnbaren Klammern, der Punkt bleibt leer', () => {
    expect(zeile('\\left( x \\right)')).toEqual([el('mrow', [mo('(', STRETCHY), mi('x'), mo(')', STRETCHY)])]);
    expect(zeile('\\left. x \\right|')).toEqual([el('mrow', [mi('x'), mo('|', STRETCHY)])]);
    expect(zeile('\\left[ x \\right]')).toEqual([el('mrow', [mo('[', STRETCHY), mi('x'), mo(']', STRETCHY)])]);
  });

  it('setzt \\mathrm aufrecht und verbindet Buchstaben, \\text bleibt wörtlich', () => {
    expect(zeile('\\mathrm{d}t')).toEqual([mi('d', NORMAL), mi('t')]);
    expect(zeile('\\mathrm{km}')).toEqual([el('mrow', [mi('km', NORMAL)])]);
    expect(zeile('\\mathrm{s^{-1}}')).toEqual([el('msup', [mi('s', NORMAL), el('mrow', [mo('−'), mn('1')])])]);
    expect(zeile('x\\text{ und }y')).toEqual([mi('x'), { tag: 'mtext', text: ' und ' }, mi('y')]);
  });

  it('übersetzt Akzente', () => {
    expect(zeile('\\dot{a}')).toEqual([el('mover', [mi('a'), mo('˙')], { accent: 'true' })]);
    expect(zeile('\\vec v')).toEqual([el('mover', [mi('v'), mo('→')], { accent: 'true' })]);
    expect(zeile('\\bar{x}\\hat{x}\\tilde{x}\\ddot{x}').map((k) => ('text' in k ? '' : (k.kinder[1] as { text: string }).text)))
      .toEqual(['¯', '^', '~', '¨']);
  });

  it('übersetzt griechische Buchstaben, große aufrecht', () => {
    expect(zeile('\\alpha\\varpi\\varphi\\Omega')).toEqual([mi('α'), mi('ϖ'), mi('φ'), mi('Ω', NORMAL)]);
  });

  it('übersetzt Relationen, Operatoren und Symbole', () => {
    expect(zeile('a \\approx b \\le c \\ll d')).toEqual([mi('a'), mo('≈'), mi('b'), mo('≤'), mi('c'), mo('≪'), mi('d')]);
    expect(zeile('\\pm\\cdot\\times\\sim\\propto\\equiv\\to')).toEqual(
      ['±', '⋅', '×', '∼', '∝', '≡', '→'].map((z) => mo(z)),
    );
    expect(zeile('\\partial\\nabla\\infty')).toEqual([mi('∂'), mi('∇'), mi('∞')]);
    expect(zeile('90^\\circ')).toEqual([el('msup', [mn('90'), mo('∘')])]);
  });

  it('setzt Funktionsnamen aufrecht als ein Zeichen', () => {
    expect(zeile('\\sin E')).toEqual([mi('sin'), mi('E')]);
  });

  it('setzt Summen im Block mit Grenzen darüber und darunter, Integrale immer als Index', () => {
    const summe = mo('∑', { largeop: 'true' });
    expect(zeile('\\sum_{i=1}^{n} x_i', true)).toEqual([
      el('munderover', [summe, el('mrow', [mi('i'), mo('='), mn('1')]), mi('n')]),
      el('msub', [mi('x'), mi('i')]),
    ]);
    expect(zeile('\\sum_{i=1}^{n}')).toEqual([
      el('msubsup', [summe, el('mrow', [mi('i'), mo('='), mn('1')]), mi('n')]),
    ]);
    expect(zeile('\\int_0^1', true)).toEqual([el('msubsup', [mo('∫', { largeop: 'true' }), mn('0'), mn('1')])]);
  });

  it('übersetzt Abstände', () => {
    expect(zeile('a\\,b\\;c\\quad d')).toEqual([
      mi('a'), el('mspace', [], { width: '0.1667em' }), mi('b'), el('mspace', [], { width: '0.2778em' }),
      mi('c'), el('mspace', [], { width: '1em' }), mi('d'),
    ]);
  });

  it('meldet Fehler mit Stelle', () => {
    expect(texNachMathml('\\foo', false)).toEqual({ fehler: 'Unbekannter Befehl \\foo', stelle: 0 });
    expect(texNachMathml('a ! b', false)).toEqual({ fehler: 'Zeichen „!" gehört nicht zur Teilmenge', stelle: 2 });
    expect(texNachMathml('{x', false)).toEqual({ fehler: 'Offene Klammer {', stelle: 0 });
    expect(texNachMathml('x}', false)).toEqual({ fehler: 'Überzählige }', stelle: 1 });
    expect(texNachMathml('^2', false)).toEqual({ fehler: '^ ohne Basis', stelle: 0 });
    expect(texNachMathml('x^', false)).toEqual({ fehler: 'Argument fehlt', stelle: 2 });
    expect(texNachMathml('x^2^3', false)).toEqual({ fehler: 'Doppelte Hochstellung', stelle: 3 });
    expect(texNachMathml('x_1_2', false)).toEqual({ fehler: 'Doppelte Tiefstellung', stelle: 3 });
    expect(texNachMathml('\\right)', false)).toEqual({ fehler: '\\right ohne \\left', stelle: 0 });
    expect(texNachMathml('\\left( x', false)).toEqual({ fehler: '\\left ohne \\right', stelle: 0 });
    expect(texNachMathml('\\left x \\right)', false)).toEqual({ fehler: 'Klammer nach \\left oder \\right erwartet', stelle: 6 });
    expect(texNachMathml('\\sqrt[3{x}', false)).toEqual({ fehler: 'Offene Klammer [', stelle: 5 });
    expect(texNachMathml('\\text{a{b}}', false)).toEqual({ fehler: 'Verschachtelte Klammern in \\text', stelle: 5 });
    expect(texNachMathml('\\text x', false)).toEqual({ fehler: '\\text ohne {', stelle: 0 });
    expect(texNachMathml('x\\', false)).toEqual({ fehler: 'Backslash am Ende', stelle: 1 });
    expect(texNachMathml('  ', false)).toEqual({ fehler: 'Leere Formel', stelle: 0 });
  });
});
