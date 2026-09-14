/** Sprache der Oberfläche und der Texte; strukturgleich mit `Sprache` in ui/i18n. */
export type Sprache = 'de' | 'en';

export type QuellenArt = 'faktenblatt' | 'uebersicht' | 'bildarchiv' | 'werkzeug' | 'fachartikel';
export type Herausgeber = 'NASA' | 'JPL' | 'ESA' | 'IAU' | 'Wikipedia' | 'sonstige';

/**
 * Eine öffentliche Quelle (Entwurf 4c §4.4). Keine wird eingebettet — jede
 * öffnet im neuen Tab (Entscheidung Jens, 14.09.2026; NASA und JPL
 * verbieten das Einbetten ohnehin per X-Frame-Options). `fuer` nennt die
 * Text-Kennungen, zu denen die Quelle unten als Karte erscheint.
 */
export interface Quelle {
  id: string;
  titel: { de: string; en: string };
  herausgeber: Herausgeber;
  url: string;
  /** Sprache der Zielseite. */
  sprache: Sprache;
  art: QuellenArt;
  /** Kennungen wie 'objekt:earth', 'szene:mondfinsternis', 'thema:finsternis'. */
  fuer: string[];
}

/** Reihenfolge der Gruppen im unteren Segment. */
export const QUELLEN_ART_REIHENFOLGE: readonly QuellenArt[] = [
  'faktenblatt', 'uebersicht', 'bildarchiv', 'werkzeug', 'fachartikel',
];

export const QUELLEN: readonly Quelle[] = [
  // --- Faktenblätter ---
  {
    id: 'nssdc-earth',
    titel: { de: 'Erde: Faktenblatt (NSSDC)', en: 'Earth Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
    fuer: ['objekt:earth'],
  },
  {
    id: 'nssdc-moon',
    titel: { de: 'Mond: Faktenblatt (NSSDC)', en: 'Moon Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
    fuer: ['objekt:moon', 'szene:mondfinsternis'],
  },
  {
    id: 'nssdc-saturn',
    titel: { de: 'Saturn: Faktenblatt (NSSDC)', en: 'Saturn Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'nssdc-factsheets',
    titel: { de: 'Faktenblätter aller Planeten (NSSDC)', en: 'Planetary Fact Sheets (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
    fuer: ['thema:modell', 'objekt:sun'],
  },
  // --- Übersichten ---
  {
    id: 'nasa-earth',
    titel: { de: 'Erde bei NASA Science', en: 'Earth at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/earth/',
    fuer: ['objekt:earth'],
  },
  {
    id: 'nasa-saturn',
    titel: { de: 'Saturn bei NASA Science', en: 'Saturn at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/saturn/',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'nasa-moon',
    titel: { de: 'Mond bei NASA Science', en: 'Moon at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/moon/',
    fuer: ['objekt:moon', 'szene:mondfinsternis'],
  },
  {
    id: 'nasa-cassini',
    titel: { de: 'Mission Cassini (NASA)', en: 'Cassini mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/cassini/',
    fuer: ['objekt:saturn', 'objekt:titan', 'objekt:enceladus', 'thema:ringe'],
  },
  {
    id: 'esa-cassini-huygens',
    titel: { de: 'Cassini-Huygens (ESA)', en: 'Cassini-Huygens (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens',
    fuer: ['objekt:saturn', 'objekt:titan'],
  },
  {
    id: 'esa-erdbeobachtung',
    titel: { de: 'Erdbeobachtung (ESA)', en: 'Observing the Earth (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Applications/Observing_the_Earth',
    fuer: ['objekt:earth'],
  },
  {
    id: 'nasa-eclipse',
    titel: { de: 'NASA Eclipse Web Site: Mondfinsternisse', en: 'NASA Eclipse Web Site: Lunar Eclipses' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://eclipse.gsfc.nasa.gov/lunar.html',
    fuer: ['szene:mondfinsternis', 'thema:finsternis'],
  },
  {
    id: 'wikipedia-de-erde',
    titel: { de: 'Erde (Wikipedia)', en: 'Earth (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Erde',
    fuer: ['objekt:earth'],
  },
  {
    id: 'wikipedia-en-earth',
    titel: { de: 'Earth (englische Wikipedia)', en: 'Earth (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Earth',
    fuer: ['objekt:earth'],
  },
  {
    id: 'wikipedia-de-saturn',
    titel: { de: 'Saturn (Wikipedia)', en: 'Saturn (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Saturn_(Planet)',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'wikipedia-en-saturn',
    titel: { de: 'Saturn (englische Wikipedia)', en: 'Saturn (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Saturn',
    fuer: ['objekt:saturn'],
  },
  {
    id: 'wikipedia-de-mondfinsternis',
    titel: { de: 'Mondfinsternis (Wikipedia)', en: 'Lunar eclipse (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Mondfinsternis',
    fuer: ['szene:mondfinsternis', 'thema:finsternis'],
  },
  {
    id: 'wikipedia-en-lunar-eclipse',
    titel: { de: 'Lunar eclipse (englische Wikipedia)', en: 'Lunar eclipse (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Lunar_eclipse',
    fuer: ['szene:mondfinsternis', 'thema:finsternis'],
  },
  // --- Bildarchive ---
  {
    id: 'jpl-photojournal-earth',
    titel: { de: 'Photojournal: Erde (JPL)', en: 'Photojournal: Earth (JPL)' },
    herausgeber: 'JPL', sprache: 'en', art: 'bildarchiv',
    url: 'https://photojournal.jpl.nasa.gov/target/Earth',
    fuer: ['objekt:earth'],
  },
  {
    id: 'jpl-photojournal-saturn',
    titel: { de: 'Photojournal: Saturn (JPL)', en: 'Photojournal: Saturn (JPL)' },
    herausgeber: 'JPL', sprache: 'en', art: 'bildarchiv',
    url: 'https://photojournal.jpl.nasa.gov/target/Saturn',
    fuer: ['objekt:saturn', 'thema:ringe'],
  },
  // --- Werkzeuge ---
  {
    id: 'nasa-eyes',
    titel: { de: 'NASA Eyes on the Solar System', en: 'NASA Eyes on the Solar System' },
    herausgeber: 'NASA', sprache: 'en', art: 'werkzeug',
    url: 'https://eyes.nasa.gov/apps/solar-system/',
    fuer: ['objekt:sun', 'objekt:earth', 'objekt:saturn', 'thema:modell'],
  },
  {
    id: 'jpl-horizons',
    titel: { de: 'JPL Horizons (Ephemeriden)', en: 'JPL Horizons (ephemerides)' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    fuer: ['thema:modell', 'thema:bahnelemente'],
  },
  // --- Fachliches ---
  {
    id: 'jpl-approx-pos',
    titel: { de: 'Näherungsbahnen der Planeten (JPL SSD)', en: 'Approximate Positions of the Planets (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'fachartikel',
    url: 'https://ssd.jpl.nasa.gov/planets/approx_pos.html',
    fuer: ['thema:modell', 'thema:bahnelemente', 'objekt:earth', 'objekt:saturn'],
  },
  {
    id: 'iau-rotation',
    titel: {
      de: 'IAU-Bericht über Rotationselemente (Archinal et al. 2018)',
      en: 'IAU report on rotational elements (Archinal et al. 2018)',
    },
    herausgeber: 'IAU', sprache: 'en', art: 'fachartikel',
    url: 'https://doi.org/10.1007/s10569-017-9805-5',
    fuer: ['thema:modell', 'thema:achsneigung'],
  },
  {
    id: 'pds-rings',
    titel: { de: 'PDS Ring-Moon Systems Node', en: 'PDS Ring-Moon Systems Node' },
    herausgeber: 'sonstige', sprache: 'en', art: 'fachartikel',
    url: 'https://pds-rings.seti.org/',
    fuer: ['objekt:saturn', 'thema:ringe'],
  },
];

export function quelleFinden(id: string): Quelle | undefined {
  return QUELLEN.find((q) => q.id === id);
}

/**
 * Quellen zu einer Text-Kennung, gruppiert nach Art (Reihenfolge oben) und
 * innerhalb der Gruppe zuerst die Seiten in der gewünschten Sprache. Ohne
 * Sprachwunsch bleibt die Katalogreihenfolge.
 */
export function quellenFuer(kennung: string, bevorzugt: Sprache | null = null): Quelle[] {
  return QUELLEN
    .filter((q) => q.fuer.includes(kennung))
    .sort((a, b) => {
      const rang = QUELLEN_ART_REIHENFOLGE.indexOf(a.art) - QUELLEN_ART_REIHENFOLGE.indexOf(b.art);
      if (rang !== 0 || bevorzugt === null) return rang;
      return Number(b.sprache === bevorzugt) - Number(a.sprache === bevorzugt);
    });
}
