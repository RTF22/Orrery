/**
 * Literaturkatalog der Hochschultexte (Entwurf 4d §4.1). Sprachunabhängig,
 * Titel in der Originalsprache der Arbeit. Ein Text zitiert mit
 * `[Iess et al. 2019](literatur:iess-2019)`; die Karten unter dem Text
 * leiten sich aus diesen Verweisen ab (ui/info/zitate.ts).
 *
 * Diese Datei importiert nichts, auch keine Typen: scripts/pruefe-literatur.ts
 * lädt sie direkt mit Node, und Node löst nur Importe mit Dateiendung auf.
 *
 * Jeder Eintrag ist vor dem Commit mit `npm run literatur:pruefen` gegen
 * Crossref beziehungsweise arXiv geprüft und im Text wörtlich belegt
 * (docs/belege/hochschule/).
 */
export interface Publikation {
  /** Erstautor-Jahr[Suffix], ASCII klein, Umlaute umschrieben: 'iess-2019', 'gruen-2020a'. */
  id: string;
  /** Eins bis drei Autoren in der Form „Nachname, I."; weitere über `etAl`. */
  autoren: string[];
  etAl: boolean;
  jahr: number;
  titel: string;
  /** Zeitschrift mit Band und Seite oder Artikelnummer, Buch oder Konferenzband. */
  erschienen: string;
  doi?: string;
  /** Form 'JJMM.NNNNN' (optional mit Version) oder alte Form 'astro-ph/0101001'. */
  arxiv?: string;
  /** ADS-Bibcode, 19 Zeichen. */
  bibcode?: string;
  /** Nur für Berichte und Datensätze ohne DOI. */
  url?: string;
}

export const LITERATUR: readonly Publikation[] = [];

export function publikationFinden(id: string): Publikation | undefined {
  return LITERATUR.find((p) => p.id === id);
}

export const doiAdresse = (doi: string): string => `https://doi.org/${doi}`;
export const arxivAdresse = (arxiv: string): string => `https://arxiv.org/abs/${arxiv}`;
export const adsAdresse = (bibcode: string): string =>
  `https://ui.adsabs.harvard.edu/abs/${encodeURIComponent(bibcode)}/abstract`;

/** Ziel eines Zitats im Text: DOI, sonst arXiv, sonst die URL. */
export function hauptadresse(p: Publikation): string {
  if (p.doi !== undefined) return doiAdresse(p.doi);
  if (p.arxiv !== undefined) return arxivAdresse(p.arxiv);
  return p.url ?? '';
}

/** Ohne DOI, aber mit arXiv-Nummer: nicht (oder noch nicht) begutachtet erschienen. */
export const istPreprint = (p: Publikation): boolean => p.doi === undefined && p.arxiv !== undefined;

export function erstautorNachname(p: Publikation): string {
  return (p.autoren[0] ?? '').split(',')[0]?.trim() ?? '';
}

/** Jahr samt Suffix aus der Kennung ('park-2021a' → '2021a'); so steht es im Linktext. */
export function jahrMitSuffix(p: Publikation): string {
  return /-(\d{4}[a-z]?)$/.exec(p.id)?.[1] ?? String(p.jahr);
}

export function autorenzeile(p: Publikation): string {
  return `${p.autoren.join(', ')}${p.etAl ? ' et al.' : ''}`;
}
