/**
 * Markdown-Teilmenge für die Erläuterungstexte (Entwurf 4c §4.2):
 * Überschriften # bis ###, Absätze, Listen mit - oder 1., fett, kursiv,
 * Links. Alles andere bleibt Klartext, HTML wird nie durchgereicht — deshalb
 * braucht die Ausgabe keine Bereinigung. Zeichenweise Zerlegung statt
 * regulärer Ausdrücke, damit Klammern in Linktexten und Sternchen in
 * Zahlen (5*10) nicht kippen.
 */
export type Inline =
  | { typ: 'text'; text: string }
  | { typ: 'fett'; kinder: Inline[] }
  | { typ: 'kursiv'; kinder: Inline[] }
  | { typ: 'link'; ziel: string; kinder: Inline[] };

export type Block =
  | { typ: 'ueberschrift'; ebene: 1 | 2 | 3; kinder: Inline[] }
  | { typ: 'absatz'; kinder: Inline[] }
  | { typ: 'liste'; geordnet: boolean; punkte: Inline[][] };

const WORTZEICHEN = /[\p{L}\p{N}]/u;

const istWortzeichen = (zeichen: string | undefined): boolean =>
  zeichen !== undefined && WORTZEICHEN.test(zeichen);

/**
 * Liest ab `start` (eine öffnende eckige Klammer) einen Link der Form
 * [text](ziel). Eckige und runde Klammern dürfen verschachtelt vorkommen;
 * das Ziel darf keinen Leerraum enthalten, der Text nicht leer sein.
 */
function liesLink(text: string, start: number): { linktext: string; ziel: string; ende: number } | null {
  let tiefe = 0;
  let i = start;
  for (; i < text.length; i += 1) {
    const c = text[i];
    if (c === '[') tiefe += 1;
    else if (c === ']') {
      tiefe -= 1;
      if (tiefe === 0) break;
    }
  }
  if (i >= text.length || text[i + 1] !== '(') return null;
  const linktext = text.slice(start + 1, i);
  let klammern = 0;
  let j = i + 1;
  for (; j < text.length; j += 1) {
    const c = text[j];
    if (c === '(') klammern += 1;
    else if (c === ')') {
      klammern -= 1;
      if (klammern === 0) break;
    }
  }
  if (j >= text.length) return null;
  const ziel = text.slice(i + 2, j);
  if (ziel === '' || /\s/.test(ziel) || linktext.trim() === '') return null;
  return { linktext, ziel, ende: j + 1 };
}

/** Benachbarte Textknoten zusammenziehen, rekursiv. */
function verschmelzen(liste: Inline[]): Inline[] {
  const out: Inline[] = [];
  for (const el of liste) {
    const letzter = out[out.length - 1];
    if (el.typ === 'text') {
      if (letzter?.typ === 'text') letzter.text += el.text;
      else out.push({ typ: 'text', text: el.text });
    } else {
      out.push({ ...el, kinder: verschmelzen(el.kinder) });
    }
  }
  return out;
}

export function parseInline(text: string): Inline[] {
  const wurzel: Inline[] = [];
  const stapel: { typ: 'fett' | 'kursiv'; kinder: Inline[] }[] = [];
  let puffer = '';
  const ziel = (): Inline[] => stapel.length === 0 ? wurzel : stapel[stapel.length - 1]!.kinder;
  const leeren = (): void => {
    if (puffer === '') return;
    ziel().push({ typ: 'text', text: puffer });
    puffer = '';
  };

  let i = 0;
  while (i < text.length) {
    const c = text[i]!;
    if (c === '[') {
      const link = liesLink(text, i);
      if (link !== null) {
        leeren();
        ziel().push({ typ: 'link', ziel: link.ziel, kinder: parseInline(link.linktext) });
        i = link.ende;
        continue;
      }
    }
    if (c === '*') {
      const doppelt = text[i + 1] === '*';
      const typ = doppelt ? 'fett' : 'kursiv';
      const laenge = doppelt ? 2 : 1;
      const oben = stapel[stapel.length - 1];
      // Schließt, wenn dieselbe Art offen ist, kein Leerzeichen davor steht
      // und danach kein Wortzeichen folgt (sonst ist es ein Malzeichen).
      if (oben !== undefined && oben.typ === typ && text[i - 1] !== ' ' && !istWortzeichen(text[i + laenge])) {
        leeren();
        stapel.pop();
        ziel().push({ typ: oben.typ, kinder: oben.kinder });
        i += laenge;
        continue;
      }
      // Öffnet, wenn davor kein Wortzeichen und danach kein Leerzeichen steht
      // und ein passender Marker später noch vorkommt.
      const schliesserSpaeter = text.indexOf(doppelt ? '**' : '*', i + laenge) !== -1;
      const naechstes = text[i + laenge];
      if ((oben === undefined || oben.typ !== typ) && !istWortzeichen(text[i - 1])
        && naechstes !== undefined && naechstes !== ' ' && schliesserSpaeter) {
        leeren();
        stapel.push({ typ, kinder: [] });
        i += laenge;
        continue;
      }
    }
    puffer += c;
    i += 1;
  }
  leeren();
  // Nicht geschlossene Hervorhebungen werden zu Text: Marker und Inhalt
  // wandern in die umgebende Ebene zurück.
  while (stapel.length > 0) {
    const offen = stapel.pop()!;
    ziel().push({ typ: 'text', text: offen.typ === 'fett' ? '**' : '*' }, ...offen.kinder);
  }
  return verschmelzen(wurzel);
}

const UEBERSCHRIFT = /^(#{1,3})\s+(.*\S)\s*$/;
const LISTENPUNKT = /^(-|\d+\.)\s+(.*)$/;

export function parseMarkdown(text: string): Block[] {
  const bloecke: Block[] = [];
  let absatz: string[] = [];
  let liste: { geordnet: boolean; punkte: string[] } | null = null;

  const absatzSchliessen = (): void => {
    if (absatz.length === 0) return;
    bloecke.push({ typ: 'absatz', kinder: parseInline(absatz.join(' ')) });
    absatz = [];
  };
  const listeSchliessen = (): void => {
    if (liste === null) return;
    bloecke.push({ typ: 'liste', geordnet: liste.geordnet, punkte: liste.punkte.map(parseInline) });
    liste = null;
  };

  for (const roh of text.replace(/\r\n?/g, '\n').split('\n')) {
    const zeile = roh.trimEnd();
    if (zeile.trim() === '') {
      absatzSchliessen();
      listeSchliessen();
      continue;
    }
    const kopf = UEBERSCHRIFT.exec(zeile);
    if (kopf !== null) {
      absatzSchliessen();
      listeSchliessen();
      bloecke.push({ typ: 'ueberschrift', ebene: kopf[1]!.length as 1 | 2 | 3, kinder: parseInline(kopf[2]!) });
      continue;
    }
    const punkt = LISTENPUNKT.exec(zeile);
    if (punkt !== null) {
      absatzSchliessen();
      const geordnet = punkt[1] !== '-';
      if (liste !== null && liste.geordnet !== geordnet) listeSchliessen();
      if (liste === null) liste = { geordnet, punkte: [] };
      liste.punkte.push(punkt[2]!);
      continue;
    }
    // Eingerückte Zeile nach einem Listenpunkt gehört zu ihm.
    if (liste !== null && /^\s/.test(roh)) {
      liste.punkte[liste.punkte.length - 1] += ` ${zeile.trim()}`;
      continue;
    }
    listeSchliessen();
    absatz.push(zeile.trim());
  }
  absatzSchliessen();
  listeSchliessen();
  return bloecke;
}

export function inlineText(kinder: Inline[]): string {
  return kinder.map((k) => (k.typ === 'text' ? k.text : inlineText(k.kinder))).join('');
}

export function titelVon(bloecke: Block[]): string | null {
  for (const block of bloecke) {
    if (block.typ === 'ueberschrift' && block.ebene === 1) return inlineText(block.kinder);
  }
  return null;
}
