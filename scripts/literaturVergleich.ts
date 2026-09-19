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

/** Tags durch ein Leerzeichen ersetzt, NFKD, Kleinbuchstaben, ohne Diakritika und Satzzeichen. */
function normalisiereKern(s: string): string {
  return s
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/**
 * Kleinbuchstaben ohne Auszeichnungen, Diakritika und Satzzeichen, Wörter durch ein Leerzeichen
 * getrennt. `<sup>`/`<sub>`-Tags (öffnend wie schließend) fallen samt direkt folgendem Leerraum
 * ohne Zwischenraum weg, damit eine hochgestellte Massenzahl wie „238" im Titel bei ihrem Element
 * bleibt (Crossref bricht die Zeile nach solchen Tags um, siehe literaturVergleich.test.ts).
 * Übrige Tags werden weiter durch ein Leerzeichen ersetzt. NFKD statt NFD macht aus hochgestellten
 * und tiefgestellten Ziffern (Katalogschreibweise wie „²³⁸U") gewöhnliche Ziffern.
 *
 * Das Verschmelzen ist nur eine von zwei möglichen Lesarten: Steht nach `</sup>`/`</sub>` statt
 * eines Zeilenumbruchs ein echtes Leerzeichen vor dem nächsten Wort (z. B. „CO<sub>2</sub> ice"),
 * verschmilzt diese Funktion die Ziffer fälschlich mit dem folgenden Wort. `wortanteil` prüft
 * deshalb zusätzlich die getrennte Lesart (`normalisiereGetrennt`) und nimmt das bessere Ergebnis
 * (Schlussprüfungsbefund M5).
 */
export function normalisiere(s: string): string {
  return normalisiereKern(s.replace(/<\/?su[bp]>\s*/g, ''));
}

/**
 * Zweite Lesart für `wortanteil`: `<sup>`/`<sub>`-Tags fallen weg, ohne den umgebenden Leerraum
 * anzutasten — richtig, wenn der Leerraum nach dem Tag eine echte Worttrennung ist statt eines
 * Zeilenumbruchs mitten im Wort.
 */
function normalisiereGetrennt(s: string): string {
  return normalisiereKern(s.replace(/<\/?su[bp]>/g, ''));
}

function wortanteilMit(a: string, b: string, norm: (s: string) => string): number {
  const wa = new Set(norm(a).split(' ').filter((w) => w !== ''));
  const wb = new Set(norm(b).split(' ').filter((w) => w !== ''));
  if (wa.size === 0 || wb.size === 0) return 0;
  let gemeinsam = 0;
  for (const w of wa) if (wb.has(w)) gemeinsam += 1;
  return Math.min(gemeinsam / wa.size, gemeinsam / wb.size);
}

/**
 * Anteil gemeinsamer Wörter, bezogen auf den Titel mit mehr Wörtern (Minimum beider Anteile).
 * Prüft beide Lesarten eines schließenden `<sup>`/`<sub>`-Tags — verschmolzen (`normalisiere`)
 * und getrennt (`normalisiereGetrennt`) — und nimmt das größere Ergebnis, weil beide Fälle bei
 * Verlagen vorkommen (Schlussprüfungsbefund M5).
 */
export function wortanteil(a: string, b: string): number {
  return Math.max(wortanteilMit(a, b, normalisiere), wortanteilMit(a, b, normalisiereGetrennt));
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
  subtitle?: string[];
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
  // Beschlüsse und Berichte von Körperschaften führt Crossref oft ganz ohne
  // Autoren (etwa cgpm-2022); dann bleibt der Erstautor ungeprüft, statt als
  // Fehler zu gelten (Ruling Jens, 18.09.2026).
  if (w.author === undefined || w.author.length === 0) {
    melde('warnung', 'Crossref führt keine Autoren, Erstautor ungeprüft');
  } else {
    const erster = w.author[0];
    const family = erster?.family ?? erster?.name ?? '';
    if (normalisiere(family) !== normalisiere(nachnameVon(katalogAutor))) {
      melde('fehler', `Erstautor bei Crossref „${family}", im Katalog „${katalogAutor}"`);
    }
  }
  const jahre = crossrefJahre(w);
  const jahr = jahrUrteil(p.jahr, jahre);
  if (jahr !== 'ok') melde(jahr, `Jahr bei Crossref ${jahre.length > 0 ? jahre.join('/') : 'fehlt'}, im Katalog ${p.jahr}`);
  // Crossref führt Untertitel mancher Zeitschriften getrennt (subtitle); verglichen wird
  // sowohl mit dem Haupttitel allein als auch mit „Haupttitel: Untertitel", der größere
  // Wortanteil zählt.
  const haupttitel = w.title?.[0] ?? '';
  const untertitel = w.subtitle?.[0];
  const titelMitUntertitel = untertitel !== undefined && untertitel !== '' ? `${haupttitel}: ${untertitel}` : undefined;
  const anteilHaupt = wortanteil(p.titel, haupttitel);
  const anteil = titelMitUntertitel === undefined ? anteilHaupt : Math.max(anteilHaupt, wortanteil(p.titel, titelMitUntertitel));
  if (anteil < MINDESTANTEIL) {
    const titel = titelMitUntertitel ?? haupttitel;
    melde('fehler', `Titel stimmt zu ${Math.round(anteil * 100)} % überein: „${titel}"`);
  }
  if (befunde.length === 0) melde('ok', 'Erstautor, Jahr und Titel stimmen');
  return befunde;
}

export interface ArxivEintrag { titel: string; autoren: string[]; jahr: number | null }

/**
 * Löst die fünf vordefinierten XML-Entitäten und numerische Entitäten
 * (dezimal und hexadezimal) auf. `&amp;` zuletzt, damit ein verschachteltes
 * `&amp;lt;` zu `&lt;` wird und nicht zu `<`.
 */
function entitaetenAufloesen(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dez: string) => String.fromCodePoint(parseInt(dez, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&amp;/g, '&');
}

/** Liest den ersten <entry> einer Antwort der arXiv-API (Atom); der Titel des Feeds zählt nicht. */
export function arxivEintragLesen(xml: string): ArxivEintrag | null {
  const eintrag = /<entry>([\s\S]*?)<\/entry>/.exec(xml)?.[1];
  if (eintrag === undefined) return null;
  const titelRoh = /<title>([\s\S]*?)<\/title>/.exec(eintrag)?.[1]?.replace(/\s+/g, ' ').trim();
  if (titelRoh === undefined || titelRoh === 'Error') return null;
  const titel = entitaetenAufloesen(titelRoh);
  const autoren = [...eintrag.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => entitaetenAufloesen((m[1] ?? '').trim()));
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

/**
 * Einträge für den Lauf: ohne --nur alle, sonst die genannten in
 * Katalogreihenfolge. --nur ohne Kennungen (fehlender oder leerer Wert)
 * ist ein Fehler statt eines stillen Leerlaufs, der wie ein erfolgreicher
 * Lauf aussähe (Schlussprüfung 4d-1, Befund M6).
 */
export function auswahl(argv: readonly string[], katalog: readonly Publikation[]): Publikation[] {
  const stelle = argv.indexOf('--nur');
  if (stelle < 0) return [...katalog];
  const ids = (argv[stelle + 1] ?? '').split(',').map((s) => s.trim()).filter((s) => s !== '');
  if (ids.length === 0) throw new Error('--nur braucht mindestens eine Kennung');
  const unbekannt = ids.filter((id) => !katalog.some((p) => p.id === id));
  if (unbekannt.length > 0) throw new Error(`Unbekannte Kennungen: ${unbekannt.join(', ')}`);
  return katalog.filter((p) => ids.includes(p.id));
}

/** Vorübergehende Serverfehler, bei denen ein zweiter Versuch lohnt (ADS antwortet gelegentlich 504). */
export const WIEDERHOLBARE_STATUS: ReadonlySet<number> = new Set([502, 503, 504]);

const istZeitueberschreitung = (e: unknown): boolean =>
  typeof e === 'object' && e !== null && (e as { name?: unknown }).name === 'TimeoutError';

/**
 * Ruft `abruf` auf und wiederholt nach den Pausen aus `pausenMs` bei einem
 * Status aus WIEDERHOLBARE_STATUS oder einer Zeitüberschreitung
 * (Entscheidung Jens, 17.09.2026). Nach der letzten Pause gilt das letzte
 * Ergebnis. `abruf` muss bei jedem Aufruf ein neues Zeitlimit-Signal
 * erzeugen, weil ein abgelaufenes Signal abgelaufen bleibt.
 */
export async function mitWiederholung<T extends { status: number }>(
  abruf: () => Promise<T>,
  warte: (ms: number) => Promise<void>,
  pausenMs: readonly number[] = [2000, 5000],
): Promise<T> {
  for (let versuch = 0; ; versuch += 1) {
    const pause = pausenMs[versuch];
    try {
      const antwort = await abruf();
      if (pause === undefined || !WIEDERHOLBARE_STATUS.has(antwort.status)) return antwort;
    } catch (e) {
      if (pause === undefined || !istZeitueberschreitung(e)) throw e;
    }
    await warte(pause);
  }
}
