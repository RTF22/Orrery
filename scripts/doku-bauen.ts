/**
 * Wandelt die vier Making-of-Texte aus docs/ (entstehung.{de,en}.md,
 * chronik.{de,en}.md) in statische HTML-Seiten unter dist/doku/making-of/ um:
 *
 *   making-of/de/index.html     making-of/en/index.html
 *   making-of/de/chronik.html   making-of/en/chronik.html
 *   making-of/bilder/…          (nur die tatsächlich verwendeten Bilder)
 *
 * Die reinen Funktionen sind exportiert und in doku-bauen.test.ts geprüft;
 * der Hauptlauf startet nur beim direkten Aufruf der Datei, baut mit der
 * Platzhaltervorlage `seiteEinfach` und prüft anschließend alle Verweise.
 *
 * Aufruf aus dem Projektstamm, nach `tsc -b && vite build`:
 *   node scripts/doku-bauen.ts
 */
import { Marked } from 'marked';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Sprache = 'de' | 'en';
export type Dokument = 'entstehung' | 'chronik';

export interface Eintrag {
  ebene: 2 | 3;
  text: string;
  id: string;
}

export interface Umgewandelt {
  html: string;
  titel: string;
  toc: Eintrag[];
  bilder: string[];
}

export interface SeitenDaten {
  sprache: Sprache;
  dokument: Dokument;
  titel: string;
  beschreibung: string;
  html: string;
  toc: Eintrag[];
}

const GITHUB_STAMM = 'https://github.com/RTF22/Orrery';

/** Wandelt eine Überschrift in eine URL-taugliche Kennung um. */
export function slug(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/\p{Mn}/gu, '') // Kombinationszeichen der zerlegten Umlaute
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Entfernt Inline-Markdown (Fett, Code, Links) und liefert den reinen Text. */
function reinerText(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .trim();
}

interface RoheUeberschrift {
  ebene: number;
  text: string;
  vorigeZeile: string;
}

/** Sammelt alle ATX-Überschriften außerhalb von Code-Zäunen, mit der vorigen nicht leeren Zeile. */
function roheUeberschriften(md: string): RoheUeberschrift[] {
  const ergebnis: RoheUeberschrift[] = [];
  let inCode = false;
  let vorigeNichtLeere = '';
  for (const zeile of md.split('\n')) {
    if (/^```/.test(zeile.trim())) {
      inCode = !inCode;
    } else if (!inCode) {
      const treffer = /^(#{1,6})\s+(.*)$/.exec(zeile);
      if (treffer) {
        ergebnis.push({ ebene: treffer[1].length, text: reinerText(treffer[2]), vorigeZeile: vorigeNichtLeere });
      }
    }
    if (zeile.trim() !== '') vorigeNichtLeere = zeile;
  }
  return ergebnis;
}

/**
 * Inhaltsverzeichnis aus den Überschriften der Ebenen 2 und 3. Eine feste
 * Marke (`<a id="x"></a>` in der vorigen Zeile) liefert die Kennung, sonst der
 * Slug des Texts; doppelte Kennungen bekommen `-2`, `-3` und so weiter.
 */
export function inhaltsverzeichnis(md: string): Eintrag[] {
  const vergeben = new Map<string, number>();
  const eintraege: Eintrag[] = [];
  for (const roh of roheUeberschriften(md)) {
    if (roh.ebene !== 2 && roh.ebene !== 3) continue;
    const marke = /^<a id="([^"]+)">\s*<\/a>$/.exec(roh.vorigeZeile.trim());
    let id = marke ? marke[1] : slug(roh.text);
    const anzahl = vergeben.get(id) ?? 0;
    vergeben.set(id, anzahl + 1);
    if (anzahl > 0) id = `${id}-${anzahl + 1}`;
    eintraege.push({ ebene: roh.ebene as 2 | 3, text: roh.text, id });
  }
  return eintraege;
}

/** Löst einen Pfad unterhalb von docs/ auf (auch über `../` hinaus zum Repository-Stamm). */
function repoVerweis(pfadTeil: string): { pfad: string; ordner: boolean } {
  const ordner = pfadTeil.endsWith('/');
  const gestapelt: string[] = [];
  for (const teil of ['docs', ...pfadTeil.split('/').filter((t) => t !== '')]) {
    if (teil === '..') gestapelt.pop();
    else if (teil !== '.') gestapelt.push(teil);
  }
  return { pfad: gestapelt.join('/'), ordner };
}

/**
 * Schreibt einen Verweis aus einem der vier Texte (Pfade relativ zu docs/) so
 * um, wie er von einer Seite unter making-of/<sprache>/ aus gültig ist. Bilder
 * werden zusätzlich als Kopierauftrag gemeldet (Pfad relativ zu docs/).
 */
export function verweisUmschreiben(href: string, sprache: Sprache): { href: string; bild?: string } {
  // Absolute Adressen und reine Sprungmarken bleiben unverändert.
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#')) {
    return { href };
  }

  // Bilder liegen gebündelt unter making-of/bilder/…, unabhängig vom Unterordner.
  if (href.startsWith('bilder/')) {
    return { href: `../${href}`, bild: href };
  }

  // Verweise auf einen der vier Texte der Etappe (gleiche oder andere Sprache).
  const eigen = /^(entstehung|chronik)\.(de|en)\.md(#.*)?$/.exec(href);
  if (eigen) {
    const dokument = eigen[1] as Dokument;
    const zielSprache = eigen[2] as Sprache;
    const anker = eigen[3] ?? '';
    const datei = dokument === 'entstehung' ? 'index.html' : 'chronik.html';
    if (zielSprache === sprache) return { href: `${datei}${anker}` };
    return { href: `../${zielSprache}/${datei}${anker}` };
  }

  // Alles andere liegt außerhalb der Etappe: Verweis auf GitHub. Ordnerpfade
  // (Schrägstrich am Ende) laufen über /tree/, Dateien über /blob/; ein
  // führendes „../“ zeigt auf den Repository-Stamm oberhalb von docs/.
  const trennstelle = href.indexOf('#');
  const pfadTeil = trennstelle === -1 ? href : href.slice(0, trennstelle);
  const anker = trennstelle === -1 ? '' : href.slice(trennstelle);
  const { pfad, ordner } = repoVerweis(pfadTeil);
  const art = ordner ? 'tree' : 'blob';
  return { href: `${GITHUB_STAMM}/${art}/master/${pfad}${ordner ? '/' : ''}${anker}` };
}

/** Entfernt die erste `#`-Überschrift (den Titel) und liefert Restdatei plus Titeltext. */
function ersteH1ZeileEntfernen(md: string): { md: string; titel: string } {
  const zeilen = md.split('\n');
  let inCode = false;
  for (let i = 0; i < zeilen.length; i += 1) {
    const zeile = zeilen[i]!;
    if (/^```/.test(zeile.trim())) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const treffer = /^#\s+(.*)$/.exec(zeile);
    if (treffer) {
      const titel = reinerText(treffer[1]);
      zeilen.splice(i, 1);
      return { md: zeilen.join('\n'), titel };
    }
  }
  return { md, titel: '' };
}

/** Entfernt die Sprachzeile (Sprachumschalter), die die Seitenvorlage selbst stellt. */
function sprachzeileEntfernen(md: string): string {
  const zeilen = md.split('\n');
  const i = zeilen.findIndex((z) => /^(\[English\]|\*\*English\*\*)/.test(z));
  if (i === -1) return md;
  zeilen.splice(i, 1);
  return zeilen.join('\n');
}

/** Entfernt die `<a id="…"></a>`-Marken; ihre Kennung steckt bereits im Inhaltsverzeichnis. */
function markenEntfernen(md: string): string {
  return md.replace(/^<a id="[^"]+">\s*<\/a>\s*$/gm, '');
}

/**
 * Wandelt einen der vier Texte in HTML um: Überschriften der Ebenen 2 und 3
 * erhalten ihre Kennung aus dem Inhaltsverzeichnis, Marken-Zeilen, Titel und
 * Sprachzeile entfallen, Verweise und Bildpfade laufen durch verweisUmschreiben.
 */
export function umwandeln(md: string, sprache: Sprache): Umgewandelt {
  const toc = inhaltsverzeichnis(md);

  const { md: ohneTitel, titel } = ersteH1ZeileEntfernen(md);
  const arbeitstext = markenEntfernen(sprachzeileEntfernen(ohneTitel));

  const bilder = new Set<string>();
  let naechsteUeberschrift = 0;

  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const inhalt = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${inhalt}</h${depth}>\n`;
        const eintrag = toc[naechsteUeberschrift];
        naechsteUeberschrift += 1;
        const id = eintrag ? ` id="${eintrag.id}"` : '';
        return `<h${depth}${id}>${inhalt}</h${depth}>\n`;
      },
      link({ href, title, text, tokens, autolink }) {
        const inhalt = autolink ? text : this.parser.parseInline(tokens);
        const { href: neu } = verweisUmschreiben(href, sprache);
        return `<a href="${neu}"${title ? ` title="${title}"` : ''}>${inhalt}</a>`;
      },
      image({ href, title, text, tokens }) {
        const alt = tokens ? this.parser.parseInline(tokens, this.parser.textRenderer) : text;
        const { href: neu, bild } = verweisUmschreiben(href, sprache);
        if (bild) bilder.add(bild);
        return `<img src="${neu}" alt="${alt}"${title ? ` title="${title}"` : ''}>`;
      },
    },
  });

  const html = marked.parse(arbeitstext) as string;
  return { html, titel, toc, bilder: [...bilder] };
}

/** Erster reiner Textabsatz nach Titel und Sprachzeile, ohne Markdown, höchstens 160 Zeichen. */
function ersterAbsatz(md: string): string {
  const { md: ohneTitel } = ersteH1ZeileEntfernen(md);
  const ohneSprachzeile = sprachzeileEntfernen(ohneTitel);
  for (const abschnitt of ohneSprachzeile.split(/\n\s*\n/)) {
    const zeile = abschnitt.trim();
    if (zeile === '') continue;
    if (/^!\[.*\]\(.*\)$/.test(zeile)) continue; // reiner Bild-Absatz
    if (/^<a id="[^"]+">\s*<\/a>$/.test(zeile)) continue; // Marken-Zeile
    if (/^#{1,6}\s/.test(zeile)) continue; // eine Überschrift ist kein Absatz
    const text = reinerText(zeile.replace(/\s+/g, ' '));
    return text.slice(0, 160);
  }
  return '';
}

/** Alle Dateien unter `ordner`, rekursiv, mit absoluten Pfaden. */
function alleDateien(ordner: string): string[] {
  const ergebnis: string[] = [];
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    const voll = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) ergebnis.push(...alleDateien(voll));
    else ergebnis.push(voll);
  }
  return ergebnis;
}

const DATEI_JE_DOKUMENT: Record<Dokument, string> = {
  entstehung: 'index.html',
  chronik: 'chronik.html',
};

/**
 * Liest die vier Texte aus `quelle`, schreibt je Sprache `index.html` und
 * `chronik.html` nach `ziel/making-of/<sprache>/` über `seite(…)` und kopiert
 * die dabei verwendeten Bilder nach `ziel/making-of/bilder/…`. Fehlt einer der
 * vier Texte, bricht der Bau mit einer Meldung ab.
 */
export function baue(quelle: string, ziel: string, seite: (d: SeitenDaten) => string): void {
  const sprachen: Sprache[] = ['de', 'en'];
  const dokumente: Dokument[] = ['entstehung', 'chronik'];

  const inhalte = new Map<string, string>();
  for (const dokument of dokumente) {
    for (const sprache of sprachen) {
      const pfad = join(quelle, `${dokument}.${sprache}.md`);
      if (!existsSync(pfad)) {
        throw new Error(`Quelltext fehlt: ${pfad}`);
      }
      inhalte.set(`${dokument}.${sprache}`, readFileSync(pfad, 'utf8'));
    }
  }

  const makingOf = join(ziel, 'making-of');
  const kopierteBilder = new Set<string>();

  for (const sprache of sprachen) {
    const ordner = join(makingOf, sprache);
    mkdirSync(ordner, { recursive: true });
    for (const dokument of dokumente) {
      const md = inhalte.get(`${dokument}.${sprache}`)!;
      const umgewandelt = umwandeln(md, sprache);
      const daten: SeitenDaten = {
        sprache,
        dokument,
        titel: umgewandelt.titel,
        beschreibung: ersterAbsatz(md),
        html: umgewandelt.html,
        toc: umgewandelt.toc,
      };
      writeFileSync(join(ordner, DATEI_JE_DOKUMENT[dokument]), seite(daten), 'utf8');
      for (const bild of umgewandelt.bilder) kopierteBilder.add(bild);
    }
  }

  for (const bild of kopierteBilder) {
    const teile = bild.split('/');
    const zielDatei = join(makingOf, ...teile);
    mkdirSync(dirname(zielDatei), { recursive: true });
    copyFileSync(join(quelle, ...teile), zielDatei);
  }
}

/**
 * Prüft jede `.html`-Datei unter `wurzel`: Jeder relative `href`/`src` muss auf
 * eine vorhandene Datei zeigen, jede `#marke` als `id="marke"` in der Zieldatei
 * vorkommen. Liefert eine leere Liste, wenn alles gut ist.
 */
export function pruefeVerweise(wurzel: string): string[] {
  // Absolut auflösen: alleDateien() bleibt sonst relativ, resolve() bei den
  // Verweisen liefert aber immer absolute Pfade — beides muss zusammenpassen.
  const wurzelAbs = resolve(wurzel);
  const dateien = alleDateien(wurzelAbs).filter((p) => p.endsWith('.html'));

  const idsJeDatei = new Map<string, Set<string>>();
  for (const datei of dateien) {
    const ids = new Set<string>();
    for (const treffer of readFileSync(datei, 'utf8').matchAll(/\sid="([^"]+)"/g)) ids.add(treffer[1]!);
    idsJeDatei.set(datei, ids);
  }

  const befunde: string[] = [];
  for (const datei of dateien) {
    const html = readFileSync(datei, 'utf8');
    const ordner = dirname(datei);
    for (const treffer of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const verweis = treffer[1]!;
      if (/^[a-z][a-z0-9+.-]*:/i.test(verweis) || verweis.startsWith('//')) continue;

      const trennstelle = verweis.indexOf('#');
      const pfadTeil = trennstelle === -1 ? verweis : verweis.slice(0, trennstelle);
      const anker = trennstelle === -1 ? undefined : verweis.slice(trennstelle + 1);

      let zielDatei = datei;
      if (pfadTeil !== '') {
        zielDatei = resolve(ordner, pfadTeil);
        if (!existsSync(zielDatei)) {
          befunde.push(`${relative(wurzelAbs, datei).split(sep).join('/')} → ${verweis}`);
          continue;
        }
      }
      if (anker !== undefined && !(idsJeDatei.get(zielDatei)?.has(anker) ?? false)) {
        befunde.push(`${relative(wurzelAbs, datei).split(sep).join('/')} → ${verweis}`);
      }
    }
  }
  return befunde;
}

/**
 * Platzhaltervorlage: ein gültiges Dokument mit Sprache, Titel, Beschreibung
 * und dem Inhaltsverzeichnis als Liste. Die eigentliche Seitenvorlage mit
 * Gestaltung folgt in einem eigenen Schritt und ersetzt diese Funktion.
 */
export function seiteEinfach(d: SeitenDaten): string {
  const eintraege = d.toc
    .map((e) => `<li class="ebene-${e.ebene}"><a href="#${e.id}">${e.text}</a></li>`)
    .join('\n');
  return `<!doctype html>
<html lang="${d.sprache}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${d.titel}</title>
<meta name="description" content="${d.beschreibung}">
</head>
<body>
<main>
<nav>
<ul>
${eintraege}
</ul>
</nav>
${d.html}
</main>
</body>
</html>
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    baue('docs', 'dist/doku', seiteEinfach);
    const befunde = pruefeVerweise('dist/doku');
    if (befunde.length > 0) {
      console.error('Kaputte Verweise:');
      for (const zeile of befunde) console.error(`  ${zeile}`);
      process.exitCode = 1;
    }
  } catch (fehler) {
    console.error(fehler instanceof Error ? fehler.message : fehler);
    process.exitCode = 1;
  }
}
