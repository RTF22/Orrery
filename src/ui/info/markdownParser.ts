/**
 * Markdown-Teilmenge für die Erläuterungstexte (Entwurf 4c §4.2, 4d §3.1):
 * Überschriften # bis ###, Absätze, Listen mit - oder 1., fett, kursiv,
 * Links, Formeln ($…$ im Satz, $$…$$ als Absatz) und Pipe-Tabellen. Alles
 * andere bleibt Klartext, HTML wird nie durchgereicht — deshalb braucht
 * die Ausgabe keine Bereinigung. Zeichenweise Zerlegung statt regulärer
 * Ausdrücke, damit Klammern in Linktexten und Sternchen in Zahlen (5*10)
 * nicht kippen. TeX wird hier nicht übersetzt, nur als Quelle gehalten
 * (texUebersetzer.ts).
 */
export type Inline =
  | { typ: 'text'; text: string }
  | { typ: 'formel'; tex: string }
  | { typ: 'fett'; kinder: Inline[] }
  | { typ: 'kursiv'; kinder: Inline[] }
  | { typ: 'link'; ziel: string; kinder: Inline[] };

export type Ausrichtung = 'links' | 'mitte' | 'rechts';

export type Block =
  | { typ: 'ueberschrift'; ebene: 1 | 2 | 3; kinder: Inline[] }
  | { typ: 'absatz'; kinder: Inline[] }
  | { typ: 'liste'; geordnet: boolean; punkte: Inline[][] }
  | { typ: 'formel'; tex: string }
  | { typ: 'tabelle'; ausrichtung: Ausrichtung[]; kopf: Inline[][]; zeilen: Inline[][][] };

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

const LEERRAUM = /\s/;
const ZIFFER = /[0-9]/;

/**
 * Zahl der Backslashes unmittelbar vor `pos`, rückwärts gezählt, aber nicht
 * über `grenze` hinaus (das öffnende `$` einer Formel gehört nicht mehr zur
 * Zählung).
 */
function backslashesDavor(text: string, pos: number, grenze: number): number {
  let n = 0;
  let k = pos - 1;
  while (k >= grenze && text[k] === '\\') {
    n += 1;
    k -= 1;
  }
  return n;
}

/**
 * Liest ab `start` (ein `$`) eine Formel im Satz nach der Regel von Pandoc:
 * Nach dem öffnenden `$` steht kein Leerraum und kein weiteres `$`, vor dem
 * schließenden kein Leerraum, danach keine Ziffer. Maskiert ist ein `$`,
 * wenn unmittelbar davor eine ungerade Zahl von Backslashes steht (die
 * Zählung reicht nicht vor das öffnende `$` zurück); bei gerader Zahl,
 * auch null, darf es schließen. Ohne passendes Ende bleibt das Zeichen
 * Text („kostet 5 $"). Diese Paritätsregel gilt nur für das schließende
 * `$`: Das öffnende `$` selbst wird nicht auf eine vorangehende gerade
 * oder ungerade Zahl von Backslashes geprüft, siehe die Maskierung in
 * `parseInline` (dort zählt nur, ob unmittelbar ein `\` vorangeht).
 */
function liesFormel(text: string, start: number): { tex: string; ende: number } | null {
  const erstes = text[start + 1];
  if (erstes === undefined || erstes === '$' || LEERRAUM.test(erstes)) return null;
  for (let j = start + 2; j < text.length; j += 1) {
    if (text[j] !== '$') continue;
    if (backslashesDavor(text, j, start + 1) % 2 === 1) continue;
    const davor = text[j - 1] ?? '';
    if (LEERRAUM.test(davor)) continue;
    if (ZIFFER.test(text[j + 1] ?? '')) continue;
    return { tex: text.slice(start + 1, j), ende: j + 1 };
  }
  return null;
}

/** Benachbarte Textknoten zusammenziehen, rekursiv. */
function verschmelzen(liste: Inline[]): Inline[] {
  const out: Inline[] = [];
  for (const el of liste) {
    const letzter = out[out.length - 1];
    if (el.typ === 'text') {
      if (letzter?.typ === 'text') letzter.text += el.text;
      else out.push({ typ: 'text', text: el.text });
    } else if (el.typ === 'formel') {
      out.push(el);
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
    // Maskierung beim Öffnen, asymmetrisch zur Paritätsregel von
    // liesFormel() beim Schließen: Hier zählt nur, ob unmittelbar ein
    // einzelner `\` vorangeht, nicht die Parität mehrerer Backslashes.
    // `\\$x$` ergibt deshalb den Text „\$x$" statt Backslash plus Formel;
    // in Fachtexten kommen doppelte Backslashes vor `$` nicht vor.
    if (c === '\\' && text[i + 1] === '$') {
      puffer += '$';
      i += 2;
      continue;
    }
    if (c === '$') {
      const formel = liesFormel(text, i);
      if (formel !== null) {
        leeren();
        ziel().push({ typ: 'formel', tex: formel.tex });
        i = formel.ende;
        continue;
      }
    }
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
const TRENNZELLE = /^:?-{3,}:?$/;

/**
 * Zerlegt eine Tabellenzeile in Zellen (Entwurf 4d §3.1): Die Zeile beginnt
 * und endet mit `|`; zuerst wird an unmaskierten `|` getrennt, danach wird
 * `\|` zu `|`, auch innerhalb von Formeln. Keine Tabellenzeile: null.
 */
export function tabellenzellen(zeile: string): string[] | null {
  const s = zeile.trim();
  if (s.length < 2 || !s.startsWith('|') || !s.endsWith('|') || s.endsWith('\\|')) return null;
  const inhalt = s.slice(1, -1);
  const zellen: string[] = [];
  let aktuell = '';
  for (let i = 0; i < inhalt.length; i += 1) {
    const c = inhalt[i]!;
    if (c === '\\' && inhalt[i + 1] === '|') {
      aktuell += '|';
      i += 1;
      continue;
    }
    if (c === '|') {
      zellen.push(aktuell.trim());
      aktuell = '';
      continue;
    }
    aktuell += c;
  }
  zellen.push(aktuell.trim());
  return zellen;
}

function ausrichtungen(zellen: readonly string[]): Ausrichtung[] | null {
  if (zellen.length === 0 || !zellen.every((z) => TRENNZELLE.test(z))) return null;
  return zellen.map((z) => (z.startsWith(':') && z.endsWith(':') ? 'mitte' : z.endsWith(':') ? 'rechts' : 'links'));
}

/** Tabelle aus zusammenhängenden |-Zeilen, oder null, wenn die Form nicht stimmt. */
function tabelle(zeilen: readonly string[]): Block | null {
  const [kopfZeile, trennZeile, ...rest] = zeilen;
  if (kopfZeile === undefined || trennZeile === undefined) return null;
  const kopf = tabellenzellen(kopfZeile);
  const trenn = tabellenzellen(trennZeile);
  const ausrichtung = trenn === null ? null : ausrichtungen(trenn);
  if (kopf === null || ausrichtung === null || ausrichtung.length !== kopf.length) return null;
  const daten: string[][] = [];
  for (const zeile of rest) {
    const zellen = tabellenzellen(zeile);
    if (zellen === null || zellen.length !== kopf.length) return null;
    daten.push(zellen);
  }
  return {
    typ: 'tabelle',
    ausrichtung,
    kopf: kopf.map((z) => parseInline(z)),
    zeilen: daten.map((zeile) => zeile.map((z) => parseInline(z))),
  };
}

export function parseMarkdown(text: string): Block[] {
  const bloecke: Block[] = [];
  let absatz: string[] = [];
  let liste: { geordnet: boolean; punkte: string[] } | null = null;

  const absatzSchliessen = (): void => {
    if (absatz.length === 0) return;
    const roh = absatz.join(' ');
    // Blockformel (Entwurf 4d §3.1): ein Absatz, der mit $$ beginnt und endet.
    if (roh.length >= 4 && roh.startsWith('$$') && roh.endsWith('$$')) {
      bloecke.push({ typ: 'formel', tex: roh.slice(2, -2).trim() });
    } else {
      bloecke.push({ typ: 'absatz', kinder: parseInline(roh) });
    }
    absatz = [];
  };
  const listeSchliessen = (): void => {
    if (liste === null) return;
    bloecke.push({ typ: 'liste', geordnet: liste.geordnet, punkte: liste.punkte.map(parseInline) });
    liste = null;
  };

  const zeilen = text.replace(/\r\n?/g, '\n').split('\n');
  for (let n = 0; n < zeilen.length; n += 1) {
    const roh = zeilen[n]!;
    const zeile = roh.trimEnd();
    if (zeile.trim() === '') {
      absatzSchliessen();
      listeSchliessen();
      continue;
    }
    if (zeile.trimStart().startsWith('|')) {
      // Zusammenhängende |-Zeilen bilden eine Tabelle. Stimmt die Form nicht,
      // werden sie ein eigener Absatz, den der Dateitest erkennt.
      absatzSchliessen();
      listeSchliessen();
      const strichzeilen: string[] = [];
      while (n < zeilen.length && (zeilen[n] ?? '').trimStart().startsWith('|')) {
        strichzeilen.push((zeilen[n] ?? '').trim());
        n += 1;
      }
      n -= 1;
      bloecke.push(tabelle(strichzeilen) ?? { typ: 'absatz', kinder: parseInline(strichzeilen.join(' ')) });
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
  return kinder.map((k) => (k.typ === 'text' ? k.text : k.typ === 'formel' ? k.tex : inlineText(k.kinder))).join('');
}

export function titelVon(bloecke: Block[]): string | null {
  for (const block of bloecke) {
    if (block.typ === 'ueberschrift' && block.ebene === 1) return inlineText(block.kinder);
  }
  return null;
}
