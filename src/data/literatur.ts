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
    id: 'agnew-2024',
    autoren: ['Agnew, D. C.'],
    etAl: false,
    jahr: 2024,
    titel: 'A global timekeeping problem postponed by global warming',
    erschienen: 'Nature 628, 333–336',
    doi: '10.1038/s41586-024-07170-0',
  },
  {
    id: 'archinal-2018',
    autoren: ['Archinal, B. A.', 'Acton, C. H.', 'A’Hearn, M. F.'],
    etAl: true,
    jahr: 2018,
    titel: 'Report of the IAU Working Group on Cartographic Coordinates and Rotational Elements: 2015',
    erschienen: 'Celestial Mechanics and Dynamical Astronomy 130, 22',
    doi: '10.1007/s10569-017-9805-5',
  },
  {
    id: 'barboni-2017',
    autoren: ['Barboni, M.', 'Boehnke, P.', 'Keller, B.'],
    etAl: true,
    jahr: 2017,
    titel: 'Early formation of the Moon 4.51 billion years ago',
    erschienen: 'Science Advances 3, e1602365',
    doi: '10.1126/sciadv.1602365',
  },
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
    id: 'beggan-2026',
    autoren: ['Beggan, C. D.', 'Kloss, C.', 'Grayver, A.'],
    etAl: true,
    jahr: 2026,
    titel: 'Evaluation of candidate models for the 14th generation International Geomagnetic Reference Field',
    erschienen: 'Earth, Planets and Space 78, 126',
    doi: '10.1186/s40623-026-02382-2',
  },
  {
    id: 'biggin-2015',
    autoren: ['Biggin, A. J.', 'Piispa, E. J.', 'Pesonen, L. J.'],
    etAl: true,
    jahr: 2015,
    titel: 'Palaeomagnetic field intensity variations suggest Mesoproterozoic inner-core nucleation',
    erschienen: 'Nature 526, 245–248',
    doi: '10.1038/nature15523',
  },
  {
    id: 'bono-2019',
    autoren: ['Bono, R. K.', 'Tarduno, J. A.', 'Nimmo, F.'],
    etAl: true,
    jahr: 2019,
    titel: 'Young inner core inferred from Ediacaran ultra-low geomagnetic field intensity',
    erschienen: 'Nature Geoscience 12, 143–147',
    doi: '10.1038/s41561-018-0288-0',
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
    id: 'cano-2020',
    autoren: ['Cano, E. J.', 'Sharp, Z. D.', 'Shearer, C. K.'],
    etAl: false,
    jahr: 2020,
    titel: 'Distinct oxygen isotope compositions of the Earth and Moon',
    erschienen: 'Nature Geoscience 13, 270–274',
    doi: '10.1038/s41561-020-0550-0',
  },
  {
    id: 'canup-2001',
    autoren: ['Canup, R. M.', 'Asphaug, E.'],
    etAl: false,
    jahr: 2001,
    titel: 'Origin of the Moon in a giant impact near the end of the Earth’s formation',
    erschienen: 'Nature 412, 708–712',
    doi: '10.1038/35089010',
  },
  {
    id: 'canup-2012',
    autoren: ['Canup, R. M.'],
    etAl: false,
    jahr: 2012,
    titel: 'Forming a Moon with an Earth-like Composition via a Giant Impact',
    erschienen: 'Science 338, 1052–1055',
    doi: '10.1126/science.1226073',
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
    id: 'chen-2015',
    autoren: ['Chen, W.', 'Li, J. C.', 'Ray, J.'],
    etAl: true,
    jahr: 2015,
    titel: 'Consistent estimates of the dynamic figure parameters of the earth',
    erschienen: 'Journal of Geodesy 89, 179–188',
    doi: '10.1007/s00190-014-0768-y',
  },
  {
    id: 'connelly-2012',
    autoren: ['Connelly, J. N.', 'Bizzarro, M.', 'Krot, A. N.'],
    etAl: true,
    jahr: 2012,
    titel: 'The Absolute Chronology and Thermal Processing of Solids in the Solar Protoplanetary Disk',
    erschienen: 'Science 338, 651–655',
    doi: '10.1126/science.1226919',
  },
  {
    id: 'cuk-2012',
    autoren: ['Ćuk, M.', 'Stewart, S. T.'],
    etAl: false,
    jahr: 2012,
    titel: 'Making the Moon from a Fast-Spinning Earth: A Giant Impact Followed by Resonant Despinning',
    erschienen: 'Science 338, 1047–1052',
    doi: '10.1126/science.1225542',
  },
  {
    id: 'dziewonski-1981',
    autoren: ['Dziewonski, A. M.', 'Anderson, D. L.'],
    etAl: false,
    jahr: 1981,
    titel: 'Preliminary reference Earth model',
    erschienen: 'Physics of the Earth and Planetary Interiors 25, 297–356',
    doi: '10.1016/0031-9201(81)90046-7',
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
    id: 'espenak-2009',
    autoren: ['Espenak, F.', 'Meeus, J.'],
    etAl: false,
    jahr: 2009,
    titel: 'Five Millennium Canon of Lunar Eclipses: -1999 to +3000 (2000 BCE to 3000 CE)',
    erschienen: 'NASA Technical Publication NASA/TP-2009-214172, Goddard Space Flight Center, Greenbelt, Maryland',
    url: 'https://eclipse.gsfc.nasa.gov/5MCLE/5MCLE-Text10.pdf',
  },
  {
    id: 'fischer-2024',
    autoren: ['Fischer, M.', 'Peters, S. T. M.', 'Herwartz, D.'],
    etAl: true,
    jahr: 2024,
    titel: 'Oxygen isotope identity of the Earth and Moon with implications for the formation of the Moon and source of volatiles',
    erschienen: 'Proceedings of the National Academy of Sciences 121, e2321070121',
    doi: '10.1073/pnas.2321070121',
  },
  {
    id: 'goessling-2025',
    autoren: ['Goessling, H. F.', 'Rackow, T.', 'Jung, T.'],
    etAl: false,
    jahr: 2025,
    titel: 'Recent global temperature surge intensified by record-low planetary albedo',
    erschienen: 'Science 387, 68–73',
    doi: '10.1126/science.adq7280',
  },
  {
    id: 'guillet-2023',
    autoren: ['Guillet, S.', 'Corona, C.', 'Oppenheimer, C.'],
    etAl: true,
    jahr: 2023,
    titel: 'Lunar eclipses illuminate timing and climate impact of medieval volcanism',
    erschienen: 'Nature 616, 90–95',
    doi: '10.1038/s41586-023-05751-z',
  },
  {
    id: 'herald-2014',
    autoren: ['Herald, D.', 'Sinnott, R. W.'],
    etAl: false,
    jahr: 2014,
    titel: 'Analysis of lunar crater timings, 1842–2011',
    erschienen: 'Journal of the British Astronomical Association 124, 247–253',
    bibcode: '2014JBAA..124..247H',
    url: 'https://adsabs.harvard.edu/pdf/2014JBAA..124..247H',
  },
  {
    id: 'herwartz-2014',
    autoren: ['Herwartz, D.', 'Pack, A.', 'Friedrichs, B.'],
    etAl: true,
    jahr: 2014,
    titel: 'Identification of the giant impactor Theia in lunar rocks',
    erschienen: 'Science 344, 1146–1150',
    doi: '10.1126/science.1251117',
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
    id: 'hirose-2021',
    autoren: ['Hirose, K.', 'Wood, B.', 'Vočadlo, L.'],
    etAl: false,
    jahr: 2021,
    titel: 'Light elements in the Earth’s core',
    erschienen: 'Nature Reviews Earth & Environment 2, 645–658',
    doi: '10.1038/s43017-021-00203-6',
  },
  {
    id: 'keen-1983',
    autoren: ['Keen, R. A.'],
    etAl: false,
    jahr: 1983,
    titel: 'Volcanic Aerosols and Lunar Eclipses',
    erschienen: 'Science 222, 1011–1013',
    doi: '10.1126/science.222.4627.1011',
  },
  {
    id: 'kloss-2026',
    autoren: ['Kloss, C.', 'Finlay, C. C.', 'Olsen, N.'],
    etAl: true,
    jahr: 2026,
    titel: 'The CHAOS-8 geomagnetic field model',
    erschienen: 'Earth, Planets and Space 78, 21',
    doi: '10.1186/s40623-025-02352-0',
  },
  {
    id: 'konopkova-2016',
    autoren: ['Konôpková, Z.', 'McWilliams, R. S.', 'Gómez-Pérez, N.'],
    etAl: true,
    jahr: 2016,
    titel: 'Direct measurement of thermal conductivity in solid iron at planetary core conditions',
    erschienen: 'Nature 534, 99–101',
    doi: '10.1038/nature18009',
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
    id: 'laskar-1993',
    autoren: ['Laskar, J.', 'Joutel, F.', 'Robutel, P.'],
    etAl: false,
    jahr: 1993,
    titel: 'Stabilization of the Earth’s obliquity by the Moon',
    erschienen: 'Nature 361, 615–617',
    doi: '10.1038/361615a0',
  },
  {
    id: 'laskar-2004',
    autoren: ['Laskar, J.', 'Robutel, P.', 'Joutel, F.'],
    etAl: true,
    jahr: 2004,
    titel: 'A long-term numerical solution for the insolation quantities of the Earth',
    erschienen: 'Astronomy & Astrophysics 428, 261–285',
    doi: '10.1051/0004-6361:20041335',
  },
  {
    id: 'li-2014',
    autoren: ['Li, G.', 'Batygin, K.'],
    etAl: false,
    jahr: 2014,
    titel: 'On the Spin-axis Dynamics of a Moonless Earth',
    erschienen: 'The Astrophysical Journal 790, 69',
    doi: '10.1088/0004-637X/790/1/69',
    arxiv: '1404.7505',
  },
  {
    id: 'maurice-2020',
    autoren: ['Maurice, M.', 'Tosi, N.', 'Schwinger, S.'],
    etAl: true,
    jahr: 2020,
    titel: 'A long-lived magma ocean on a young Moon',
    erschienen: 'Science Advances 6, eaba8949',
    doi: '10.1126/sciadv.aba8949',
  },
  {
    id: 'morrison-2021',
    autoren: ['Morrison, L. V.', 'Stephenson, F. R.', 'Hohenkerk, C. Y.'],
    etAl: true,
    jahr: 2021,
    titel: 'Addendum 2020 to ‘Measurement of the Earth’s rotation: 720 BC to AD 2015’',
    erschienen: 'Proceedings of the Royal Society A 477, 20200776',
    doi: '10.1098/rspa.2020.0776',
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
    id: 'ohta-2016',
    autoren: ['Ohta, K.', 'Kuwayama, Y.', 'Hirose, K.'],
    etAl: true,
    jahr: 2016,
    titel: 'Experimental determination of the electrical resistivity of iron at Earth’s core conditions',
    erschienen: 'Nature 534, 95–98',
    doi: '10.1038/nature17957',
  },
  {
    id: 'palin-2020',
    autoren: ['Palin, R. M.', 'Santosh, M.', 'Cao, W.'],
    etAl: true,
    jahr: 2020,
    titel: 'Secular change and the onset of plate tectonics on Earth',
    erschienen: 'Earth-Science Reviews 207, 103172',
    doi: '10.1016/j.earscirev.2020.103172',
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
    id: 'petit-2010',
    autoren: ['Petit, G.', 'Luzum, B.'],
    etAl: false,
    jahr: 2010,
    titel: 'IERS Conventions (2010)',
    erschienen: 'IERS Technical Note 36, Verlag des Bundesamts für Kartographie und Geodäsie, Frankfurt am Main',
    url: 'https://iers-conventions.obspm.fr/content/tn36.pdf',
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
    id: 'ries-1992',
    autoren: ['Ries, J. C.', 'Eanes, R. J.', 'Shum, C. K.'],
    etAl: true,
    jahr: 1992,
    titel: 'Progress in the determination of the gravitational coefficient of the Earth',
    erschienen: 'Geophysical Research Letters 19, 529–531',
    doi: '10.1029/92GL00259',
  },
  {
    id: 'stephens-2015',
    autoren: ['Stephens, G. L.', 'O’Brien, D.', 'Webster, P. J.'],
    etAl: true,
    jahr: 2015,
    titel: 'The albedo of Earth',
    erschienen: 'Reviews of Geophysics 53, 141–163',
    doi: '10.1002/2014RG000449',
  },
  {
    id: 'stephenson-2016',
    autoren: ['Stephenson, F. R.', 'Morrison, L. V.', 'Hohenkerk, C. Y.'],
    etAl: false,
    jahr: 2016,
    titel: 'Measurement of the Earth’s rotation: 720 BC to AD 2015',
    erschienen: 'Proceedings of the Royal Society A 472, 20160404',
    doi: '10.1098/rspa.2016.0404',
  },
  {
    id: 'stern-2005',
    autoren: ['Stern, R. J.'],
    etAl: false,
    jahr: 2005,
    titel: 'Evidence from ophiolites, blueschists, and ultrahigh-pressure metamorphic terranes that the modern episode of subduction tectonics began in Neoproterozoic time',
    erschienen: 'Geology 33, 557–560',
    doi: '10.1130/G21365.1',
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
  {
    id: 'valley-2014',
    autoren: ['Valley, J. W.', 'Cavosie, A. J.', 'Ushikubo, T.'],
    etAl: true,
    jahr: 2014,
    titel: 'Hadean age for a post-magma-ocean zircon confirmed by atom-probe tomography',
    erschienen: 'Nature Geoscience 7, 219–223',
    doi: '10.1038/ngeo2075',
  },
  {
    id: 'wang-2024',
    autoren: ['Wang, W.', 'Vidale, J. E.', 'Pang, G.'],
    etAl: true,
    jahr: 2024,
    titel: 'Inner core backtracking by seismic waveform change reversals',
    erschienen: 'Nature 631, 340–343',
    doi: '10.1038/s41586-024-07536-4',
  },
  {
    id: 'williams-2016',
    autoren: ['Williams, J. G.', 'Boggs, D. H.'],
    etAl: false,
    jahr: 2016,
    titel: 'Secular tidal changes in lunar orbit and Earth rotation',
    erschienen: 'Celestial Mechanics and Dynamical Astronomy 126, 89–129',
    doi: '10.1007/s10569-016-9702-3',
  },
  {
    id: 'yang-2023',
    autoren: ['Yang, Y.', 'Song, X.'],
    etAl: false,
    jahr: 2023,
    titel: 'Multidecadal variation of the Earth’s inner-core rotation',
    erschienen: 'Nature Geoscience 16, 182–187',
    doi: '10.1038/s41561-022-01112-z',
  },
  {
    id: 'young-2016',
    autoren: ['Young, E. D.', 'Kohl, I. E.', 'Warren, P. H.'],
    etAl: true,
    jahr: 2016,
    titel: 'Oxygen isotopic evidence for vigorous mixing during the Moon-forming giant impact',
    erschienen: 'Science 351, 493–496',
    doi: '10.1126/science.aad0525',
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
