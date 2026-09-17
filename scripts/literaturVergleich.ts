/**
 * Reine Vergleichsfunktionen des Literatur-Prüfskripts (Entwurf 4d §4.5).
 * Ohne Netz und ohne Node-APIs, damit sie in npm test laufen; der Abruf
 * steht in pruefe-literatur.ts.
 */
import type { Publikation } from '../src/data/literatur.ts';

export type Urteil = 'ok' | 'warnung' | 'fehler';

export interface Befund {
  id: string;
  pruefung: 'crossref' | 'arxiv' | 'url';
  urteil: Urteil;
  text: string;
}

/** Kleinbuchstaben ohne Auszeichnungen, Diakritika und Satzzeichen, Wörter durch ein Leerzeichen getrennt. */
export function normalisiere(s: string): string {
  return s
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Anteil gemeinsamer Wörter, bezogen auf den Titel mit mehr Wörtern (Minimum beider Anteile). */
export function wortanteil(a: string, b: string): number {
  const wa = new Set(normalisiere(a).split(' ').filter((w) => w !== ''));
  const wb = new Set(normalisiere(b).split(' ').filter((w) => w !== ''));
  if (wa.size === 0 || wb.size === 0) return 0;
  let gemeinsam = 0;
  for (const w of wa) if (wb.has(w)) gemeinsam += 1;
  return Math.min(gemeinsam / wa.size, gemeinsam / wb.size);
}

export function jahrUrteil(jahr: number, jahre: readonly number[]): Urteil {
  if (jahre.length === 0) return 'fehler';
  const abstand = Math.min(...jahre.map((j) => Math.abs(j - jahr)));
  return abstand === 0 ? 'ok' : abstand === 1 ? 'warnung' : 'fehler';
}

export const nachnameVon = (autor: string): string => (autor.split(',')[0] ?? '').trim();

/** Ausschnitt eines Crossref-Datensatzes (message von /works/<doi>). */
export interface CrossrefWerk {
  title?: string[];
  author?: { family?: string; name?: string }[];
  'published-print'?: { 'date-parts'?: number[][] };
  'published-online'?: { 'date-parts'?: number[][] };
  issued?: { 'date-parts'?: number[][] };
}

export function crossrefJahre(w: CrossrefWerk): number[] {
  return [w['published-print'], w['published-online'], w.issued]
    .map((d) => d?.['date-parts']?.[0]?.[0])
    .filter((j): j is number => typeof j === 'number');
}

const MINDESTANTEIL = 0.8;

export function pruefeCrossref(p: Publikation, w: CrossrefWerk): Befund[] {
  const befunde: Befund[] = [];
  const melde = (urteil: Urteil, text: string): void => { befunde.push({ id: p.id, pruefung: 'crossref', urteil, text }); };
  const katalogAutor = p.autoren[0] ?? '';
  const erster = w.author?.[0];
  const family = erster?.family ?? erster?.name ?? '';
  if (normalisiere(family) !== normalisiere(nachnameVon(katalogAutor))) {
    melde('fehler', `Erstautor bei Crossref „${family}", im Katalog „${katalogAutor}"`);
  }
  const jahre = crossrefJahre(w);
  const jahr = jahrUrteil(p.jahr, jahre);
  if (jahr !== 'ok') melde(jahr, `Jahr bei Crossref ${jahre.length > 0 ? jahre.join('/') : 'fehlt'}, im Katalog ${p.jahr}`);
  const titel = w.title?.[0] ?? '';
  const anteil = wortanteil(p.titel, titel);
  if (anteil < MINDESTANTEIL) melde('fehler', `Titel stimmt zu ${Math.round(anteil * 100)} % überein: „${titel}"`);
  if (befunde.length === 0) melde('ok', 'Erstautor, Jahr und Titel stimmen');
  return befunde;
}

export interface ArxivEintrag { titel: string; autoren: string[]; jahr: number | null }

/** Liest den ersten <entry> einer Antwort der arXiv-API (Atom); der Titel des Feeds zählt nicht. */
export function arxivEintragLesen(xml: string): ArxivEintrag | null {
  const eintrag = /<entry>([\s\S]*?)<\/entry>/.exec(xml)?.[1];
  if (eintrag === undefined) return null;
  const titel = /<title>([\s\S]*?)<\/title>/.exec(eintrag)?.[1]?.replace(/\s+/g, ' ').trim();
  if (titel === undefined || titel === 'Error') return null;
  const autoren = [...eintrag.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => (m[1] ?? '').trim());
  const jahr = /<published>(\d{4})/.exec(eintrag)?.[1];
  return { titel, autoren, jahr: jahr === undefined ? null : Number(jahr) };
}

/**
 * Prüft Erstautor und Titel gegen arXiv. Veröffentlichte Fassungen tragen
 * oft einen anderen Titel als der Preprint: Hat der Eintrag eine DOI, ist
 * ein abweichender Titel deshalb nur eine Warnung (die DOI-Prüfung sichert
 * den Titel), ohne DOI ein Fehler.
 */
export function pruefeArxiv(p: Publikation, e: ArxivEintrag | null): Befund[] {
  const melde = (urteil: Urteil, text: string): Befund => ({ id: p.id, pruefung: 'arxiv', urteil, text });
  if (e === null) return [melde('fehler', `arXiv ${p.arxiv ?? ''} nicht gefunden`)];
  const befunde: Befund[] = [];
  const nachname = normalisiere(nachnameVon(p.autoren[0] ?? ''));
  const erster = normalisiere(e.autoren[0] ?? '');
  if (nachname === '' || !(erster === nachname || erster.endsWith(` ${nachname}`))) {
    befunde.push(melde('fehler', `Erstautor bei arXiv „${e.autoren[0] ?? ''}", im Katalog „${p.autoren[0] ?? ''}"`));
  }
  const anteil = wortanteil(p.titel, e.titel);
  if (anteil < MINDESTANTEIL) {
    befunde.push(melde(p.doi === undefined ? 'fehler' : 'warnung', `Titel stimmt zu ${Math.round(anteil * 100)} % überein: „${e.titel}"`));
  }
  if (befunde.length === 0) befunde.push(melde('ok', 'Erstautor und Titel stimmen'));
  return befunde;
}

/** Einträge für den Lauf: ohne --nur alle, sonst die genannten in Katalogreihenfolge. */
export function auswahl(argv: readonly string[], katalog: readonly Publikation[]): Publikation[] {
  const stelle = argv.indexOf('--nur');
  if (stelle < 0) return [...katalog];
  const ids = (argv[stelle + 1] ?? '').split(',').map((s) => s.trim()).filter((s) => s !== '');
  const unbekannt = ids.filter((id) => !katalog.some((p) => p.id === id));
  if (unbekannt.length > 0) throw new Error(`Unbekannte Kennungen: ${unbekannt.join(', ')}`);
  return katalog.filter((p) => ids.includes(p.id));
}
