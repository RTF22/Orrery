/**
 * Übersetzer einer TeX-Teilmenge nach MathML (Entwurf 4d §3.3). Das Ergebnis
 * ist ein reiner Datenbaum; Formel.tsx gibt ihn mit createElement aus. Was
 * nicht zur Teilmenge gehört, ist ein Fehler mit Stelle — der Dateitest lässt
 * jeden Text mit einem solchen Fehler durchfallen. Neue Befehle kommen nur
 * dazu, wenn ein Text sie braucht, jeweils mit Test.
 */
export type MathKnoten =
  | { tag: string; attribute?: Readonly<Record<string, string>>; kinder: readonly MathKnoten[] }
  | { tag: 'mi' | 'mn' | 'mo' | 'mtext'; attribute?: Readonly<Record<string, string>>; text: string };

export type Uebersetzung = { baum: MathKnoten } | { fehler: string; stelle: number };

class TexFehler extends Error {
  stelle: number;
  constructor(meldung: string, stelle: number) {
    super(meldung);
    this.stelle = stelle;
  }
}

type Token =
  | { art: 'befehl'; name: string; stelle: number }
  | { art: 'zahl'; text: string; stelle: number }
  | { art: 'buchstabe'; text: string; stelle: number }
  | { art: 'rohtext'; text: string; stelle: number }
  | { art: 'zeichen'; text: string; stelle: number };

const LEERRAUM = /\s/;
const ZIFFER = /[0-9]/;
const BUCHSTABE = /[A-Za-z]/;
const EINZELZEICHEN = new Set(['+', '-', '=', '<', '>', '(', ')', '[', ']', '/', ',', ':', '.', '|', '{', '}', '^', '_']);

const GRIECHISCH: Readonly<Record<string, string>> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ϵ', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
  theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π',
  varpi: 'ϖ', rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'ϕ', varphi: 'φ', chi: 'χ', psi: 'ψ',
  omega: 'ω',
};
const GRIECHISCH_GROSS: Readonly<Record<string, string>> = {
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
};
/** \odot und \oplus wie im astronomischen Satz für Sonne und Erde (M_\odot). */
const OPERATOREN: Readonly<Record<string, string>> = {
  approx: '≈', sim: '∼', simeq: '≃', propto: '∝', le: '≤', leq: '≤', ge: '≥', geq: '≥', ll: '≪', gg: '≫',
  ne: '≠', neq: '≠', equiv: '≡', to: '→', pm: '±', cdot: '⋅', times: '×', circ: '∘', ldots: '…',
  odot: '⊙', oplus: '⊕',
};
const SYMBOLE: Readonly<Record<string, string>> = { partial: '∂', nabla: '∇', infty: '∞' };
const FUNKTIONEN = new Set(['sin', 'cos', 'tan', 'arcsin', 'arctan', 'exp', 'ln', 'log', 'max', 'min']);
const GROSSOPERATOREN: Readonly<Record<string, string>> = { sum: '∑', int: '∫' };
const AKZENTE: Readonly<Record<string, string>> = { dot: '˙', ddot: '¨', bar: '¯', hat: '^', vec: '→', tilde: '~' };
const ABSTAENDE: Readonly<Record<string, string>> = { ',': '0.1667em', ';': '0.2778em', quad: '1em' };

/** Nachschlagen ohne Prototyp-Treffer (\constructor ist kein Befehl). */
const aus = (tabelle: Readonly<Record<string, string>>, name: string): string | undefined =>
  (Object.hasOwn(tabelle, name) ? tabelle[name] : undefined);

function zerlegen(tex: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < tex.length) {
    const c = tex[i]!;
    if (LEERRAUM.test(c)) {
      i += 1;
      continue;
    }
    if (c === '\\') {
      const wort = /^[A-Za-z]+/.exec(tex.slice(i + 1));
      if (wort !== null && wort[0] === 'text') {
        let j = i + 5;
        while (LEERRAUM.test(tex[j] ?? '')) j += 1;
        if (tex[j] !== '{') throw new TexFehler('\\text ohne {', i);
        const zu = tex.indexOf('}', j + 1);
        if (zu < 0) throw new TexFehler('Offene Klammer {', j);
        const inhalt = tex.slice(j + 1, zu);
        if (inhalt.includes('{')) throw new TexFehler('Verschachtelte Klammern in \\text', j);
        tokens.push({ art: 'rohtext', text: inhalt, stelle: i });
        i = zu + 1;
        continue;
      }
      if (wort !== null) {
        tokens.push({ art: 'befehl', name: wort[0], stelle: i });
        i += 1 + wort[0].length;
        continue;
      }
      const zeichen = tex[i + 1];
      if (zeichen === undefined) throw new TexFehler('Backslash am Ende', i);
      tokens.push({ art: 'befehl', name: zeichen, stelle: i });
      i += 2;
      continue;
    }
    if (ZIFFER.test(c)) {
      let j = i;
      let text = '';
      while (j < tex.length) {
        const z = tex[j]!;
        if (ZIFFER.test(z)) {
          text += z;
          j += 1;
        } else if (z === '.' && ZIFFER.test(tex[j + 1] ?? '')) {
          text += '.';
          j += 1;
        } else if (tex.startsWith('{,}', j) && ZIFFER.test(tex[j + 3] ?? '')) {
          text += ',';
          j += 3;
        } else {
          break;
        }
      }
      tokens.push({ art: 'zahl', text, stelle: i });
      i = j;
      continue;
    }
    if (BUCHSTABE.test(c)) {
      tokens.push({ art: 'buchstabe', text: c, stelle: i });
      i += 1;
      continue;
    }
    if (EINZELZEICHEN.has(c)) {
      tokens.push({ art: 'zeichen', text: c, stelle: i });
      i += 1;
      continue;
    }
    throw new TexFehler(`Zeichen „${c}" gehört nicht zur Teilmenge`, i);
  }
  return tokens;
}

/** Ein Element der Zeile samt Hoch- und Tiefstellung, die erst am Ende gebaut wird. */
interface Atom { basis: MathKnoten; grenzen: boolean; unten: MathKnoten | null; oben: MathKnoten | null }

const einfach = (basis: MathKnoten): Atom => ({ basis, grenzen: false, unten: null, oben: null });
const zeileAus = (kinder: MathKnoten[]): MathKnoten => (kinder.length === 1 ? kinder[0]! : { tag: 'mrow', kinder });

/** \mathrm: alle mi aufrecht, benachbarte Buchstaben in einer Zeile zu einem mi. */
function aufrecht(k: MathKnoten): MathKnoten {
  if ('text' in k) return k.tag === 'mi' ? { tag: 'mi', attribute: { mathvariant: 'normal' }, text: k.text } : k;
  const kinder = k.kinder.map(aufrecht);
  if (k.tag !== 'mrow') return { ...k, kinder };
  const verbunden: MathKnoten[] = [];
  for (const kind of kinder) {
    const letztes = verbunden[verbunden.length - 1];
    if (letztes !== undefined && 'text' in letztes && letztes.tag === 'mi' && 'text' in kind && kind.tag === 'mi') {
      verbunden[verbunden.length - 1] = { tag: 'mi', attribute: { mathvariant: 'normal' }, text: letztes.text + kind.text };
    } else {
      verbunden.push(kind);
    }
  }
  return { ...k, kinder: verbunden };
}

export function texNachMathml(tex: string, block: boolean): Uebersetzung {
  try {
    const tokens = zerlegen(tex);
    let pos = 0;
    const blick = (): Token | undefined => tokens[pos];
    const istZeichen = (t: Token | undefined, z: string): boolean => t?.art === 'zeichen' && t.text === z;
    const istBefehl = (t: Token | undefined, name: string): boolean => t?.art === 'befehl' && t.name === name;
    const naechstes = (): Token => {
      const t = tokens[pos];
      if (t === undefined) throw new TexFehler('Argument fehlt', tex.length);
      pos += 1;
      return t;
    };

    const bauen = (a: Atom): MathKnoten => {
      const darueber = a.grenzen && block;
      if (a.unten !== null && a.oben !== null) {
        return { tag: darueber ? 'munderover' : 'msubsup', kinder: [a.basis, a.unten, a.oben] };
      }
      if (a.unten !== null) return { tag: darueber ? 'munder' : 'msub', kinder: [a.basis, a.unten] };
      if (a.oben !== null) return { tag: darueber ? 'mover' : 'msup', kinder: [a.basis, a.oben] };
      return a.basis;
    };

    /** Liest bis }, \right, ] (nur wenn `bisEckig`) oder zum Ende; verbraucht das Ende nicht. */
    const liste = (bisEckig: boolean): MathKnoten[] => {
      const atome: Atom[] = [];
      for (;;) {
        const t = blick();
        if (t === undefined || istZeichen(t, '}') || istBefehl(t, 'right') || (bisEckig && istZeichen(t, ']'))) break;
        if (istZeichen(t, '^') || istZeichen(t, '_')) {
          pos += 1;
          const basis = atome[atome.length - 1];
          if (basis === undefined) throw new TexFehler(`${t.art === 'zeichen' ? t.text : ''} ohne Basis`, t.stelle);
          const arg = argument();
          if (istZeichen(t, '^')) {
            if (basis.oben !== null) throw new TexFehler('Doppelte Hochstellung', t.stelle);
            basis.oben = arg;
          } else {
            if (basis.unten !== null) throw new TexFehler('Doppelte Tiefstellung', t.stelle);
            basis.unten = arg;
          }
          continue;
        }
        atome.push(atom());
      }
      return atome.map(bauen);
    };

    const gruppe = (): MathKnoten => {
      const auf = naechstes();
      const kinder = liste(false);
      if (!istZeichen(blick(), '}')) throw new TexFehler('Offene Klammer {', auf.stelle);
      pos += 1;
      return zeileAus(kinder);
    };

    const argument = (): MathKnoten => {
      const t = blick();
      if (t === undefined) throw new TexFehler('Argument fehlt', tex.length);
      if (istZeichen(t, '{')) return gruppe();
      if (istZeichen(t, '}') || istZeichen(t, '^') || istZeichen(t, '_')) throw new TexFehler('Argument fehlt', t.stelle);
      return bauen(atom());
    };

    const klammer = (): MathKnoten[] => {
      const t = blick();
      if (t?.art !== 'zeichen' || !['(', ')', '[', ']', '|', '.'].includes(t.text)) {
        throw new TexFehler('Klammer nach \\left oder \\right erwartet', t?.stelle ?? tex.length);
      }
      pos += 1;
      return t.text === '.' ? [] : [{ tag: 'mo', attribute: { stretchy: 'true' }, text: t.text }];
    };

    const befehl = (t: Token & { art: 'befehl' }): Atom => {
      const n = t.name;
      const klein = aus(GRIECHISCH, n);
      if (klein !== undefined) return einfach({ tag: 'mi', text: klein });
      const gross = aus(GRIECHISCH_GROSS, n);
      if (gross !== undefined) return einfach({ tag: 'mi', attribute: { mathvariant: 'normal' }, text: gross });
      const operator = aus(OPERATOREN, n);
      if (operator !== undefined) return einfach({ tag: 'mo', text: operator });
      const symbol = aus(SYMBOLE, n);
      if (symbol !== undefined) return einfach({ tag: 'mi', text: symbol });
      if (FUNKTIONEN.has(n)) return einfach({ tag: 'mi', text: n });
      const grossoperator = aus(GROSSOPERATOREN, n);
      if (grossoperator !== undefined) {
        return { basis: { tag: 'mo', attribute: { largeop: 'true' }, text: grossoperator }, grenzen: n === 'sum', unten: null, oben: null };
      }
      const abstand = aus(ABSTAENDE, n);
      if (abstand !== undefined) return einfach({ tag: 'mspace', attribute: { width: abstand }, kinder: [] });
      const akzent = aus(AKZENTE, n);
      if (akzent !== undefined) {
        return einfach({ tag: 'mover', attribute: { accent: 'true' }, kinder: [argument(), { tag: 'mo', text: akzent }] });
      }
      switch (n) {
        case 'frac': {
          const zaehler = argument();
          const nenner = argument();
          return einfach({ tag: 'mfrac', kinder: [zaehler, nenner] });
        }
        case 'sqrt': {
          if (istZeichen(blick(), '[')) {
            const auf = naechstes();
            const index = liste(true);
            if (!istZeichen(blick(), ']')) throw new TexFehler('Offene Klammer [', auf.stelle);
            pos += 1;
            return einfach({ tag: 'mroot', kinder: [argument(), zeileAus(index)] });
          }
          return einfach({ tag: 'msqrt', kinder: [argument()] });
        }
        case 'left': {
          const links = klammer();
          const kinder = liste(false);
          if (!istBefehl(blick(), 'right')) throw new TexFehler('\\left ohne \\right', t.stelle);
          pos += 1;
          const rechts = klammer();
          return einfach({ tag: 'mrow', kinder: [...links, ...kinder, ...rechts] });
        }
        case 'right':
          throw new TexFehler('\\right ohne \\left', t.stelle);
        case 'mathrm':
          return einfach(aufrecht(argument()));
        default:
          throw new TexFehler(`Unbekannter Befehl \\${n}`, t.stelle);
      }
    };

    const atom = (): Atom => {
      const t = naechstes();
      switch (t.art) {
        case 'zahl': return einfach({ tag: 'mn', text: t.text });
        case 'buchstabe': return einfach({ tag: 'mi', text: t.text });
        case 'rohtext': return einfach({ tag: 'mtext', text: t.text });
        case 'befehl': return befehl(t);
        case 'zeichen':
          if (t.text === '{') {
            pos -= 1;
            return einfach(gruppe());
          }
          if (t.text === '}') throw new TexFehler('Überzählige }', t.stelle);
          return einfach({ tag: 'mo', text: t.text === '-' ? '−' : t.text });
      }
    };

    const kinder = liste(false);
    const rest = blick();
    if (rest !== undefined) {
      throw new TexFehler(istZeichen(rest, '}') ? 'Überzählige }' : '\\right ohne \\left', rest.stelle);
    }
    if (kinder.length === 0) throw new TexFehler('Leere Formel', 0);
    return { baum: { tag: 'math', attribute: { display: block ? 'block' : 'inline' }, kinder: [{ tag: 'mrow', kinder }] } };
  } catch (fehler) {
    if (fehler instanceof TexFehler) return { fehler: fehler.message, stelle: fehler.stelle };
    throw fehler;
  }
}
