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

export const LITERATUR: readonly Publikation[] = [
  {
    id: 'bau-2021',
    autoren: ['Baù, G.', 'Hernando-Ayuso, J.', 'Bombardelli, C.'],
    etAl: false,
    jahr: 2021,
    titel: 'A generalization of the equinoctial orbital elements',
    erschienen: 'Celestial Mechanics and Dynamical Astronomy 133, 50',
    doi: '10.1007/s10569-021-10049-1',
    arxiv: '2105.04424',
  },
  {
    id: 'broucke-1972',
    autoren: ['Broucke, R. A.', 'Cefola, P. J.'],
    etAl: false,
    jahr: 1972,
    titel: 'On the equinoctial orbit elements',
    erschienen: 'Celestial Mechanics 5, 303–310',
    doi: '10.1007/BF01228432',
  },
  {
    id: 'charles-1997',
    autoren: ['Charles, E. D.', 'Tatum, J. B.'],
    etAl: false,
    jahr: 1997,
    titel: 'The Convergence of Newton–Raphson Iteration with Kepler’s Equation',
    erschienen: 'Celestial Mechanics and Dynamical Astronomy 69, 357–372',
    doi: '10.1023/A:1008200607490',
  },
  {
    id: 'elipe-2017',
    autoren: ['Elipe, A.', 'Montijano, J. I.', 'Rández, L.'],
    etAl: true,
    jahr: 2017,
    titel: 'An analysis of the convergence of Newton iterations for solving elliptic Kepler’s equation',
    erschienen: 'Celestial Mechanics and Dynamical Astronomy 129, 415–432',
    doi: '10.1007/s10569-017-9785-5',
  },
  {
    id: 'hilton-2006',
    autoren: ['Hilton, J. L.', 'Capitaine, N.', 'Chapront, J.'],
    etAl: true,
    jahr: 2006,
    titel: 'Report of the International Astronomical Union Division I Working Group on Precession and the Ecliptic',
    erschienen: 'Celestial Mechanics and Dynamical Astronomy 94, 351–367',
    doi: '10.1007/s10569-006-0001-2',
  },
  {
    id: 'laskar-1989',
    autoren: ['Laskar, J.'],
    etAl: false,
    jahr: 1989,
    titel: 'A numerical experiment on the chaotic behaviour of the Solar System',
    erschienen: 'Nature 338, 237–238',
    doi: '10.1038/338237a0',
  },
  {
    id: 'murray-2000',
    autoren: ['Murray, C. D.', 'Dermott, S. F.'],
    etAl: false,
    jahr: 2000,
    titel: 'Solar System Dynamics',
    erschienen: 'Cambridge University Press',
    doi: '10.1017/CBO9781139174817',
  },
  {
    id: 'park-2021',
    autoren: ['Park, R. S.', 'Folkner, W. M.', 'Williams, J. G.'],
    etAl: true,
    jahr: 2021,
    titel: 'The JPL Planetary and Lunar Ephemerides DE440 and DE441',
    erschienen: 'The Astronomical Journal 161, 105',
    doi: '10.3847/1538-3881/abd414',
  },
  {
    id: 'prsa-2016',
    autoren: ['Prša, A.', 'Harmanec, P.', 'Torres, G.'],
    etAl: true,
    jahr: 2016,
    titel: 'Nominal Values for Selected Solar and Planetary Quantities: IAU 2015 Resolution B3',
    erschienen: 'The Astronomical Journal 152, 41',
    doi: '10.3847/0004-6256/152/2/41',
    arxiv: '1605.09788',
  },
  {
    id: 'tremaine-2009',
    autoren: ['Tremaine, S.', 'Touma, J.', 'Namouni, F.'],
    etAl: false,
    jahr: 2009,
    titel: 'Satellite Dynamics on the Laplace Surface',
    erschienen: 'The Astronomical Journal 137, 3706–3717',
    doi: '10.1088/0004-6256/137/3/3706',
    arxiv: '0809.0237',
  },
];

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
