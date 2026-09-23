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
    fuer: ['objekt:earth', 'szene:erdaufgang'],
  },
  {
    id: 'nssdc-moon',
    titel: { de: 'Mond: Faktenblatt (NSSDC)', en: 'Moon Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
    fuer: ['objekt:moon', 'szene:mondfinsternis', 'szene:mondtanz', 'szene:ferne-sonne'],
  },
  {
    id: 'nssdc-saturn',
    titel: { de: 'Saturn: Faktenblatt (NSSDC)', en: 'Saturn Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html',
    fuer: ['objekt:saturn', 'szene:saturn-streiflicht'],
  },
  {
    id: 'nssdc-factsheets',
    titel: { de: 'Faktenblätter aller Planeten (NSSDC)', en: 'Planetary Fact Sheets (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
    fuer: ['thema:modell', 'objekt:sun', 'thema:achsneigung', 'szene:systemblick'],
  },
  {
    id: 'nssdc-sun',
    titel: { de: 'Sonne: Faktenblatt (NSSDC)', en: 'Sun Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html',
    fuer: ['objekt:sun', 'szene:ferne-sonne'],
  },
  {
    id: 'nssdc-mercury',
    titel: { de: 'Merkur: Faktenblatt (NSSDC)', en: 'Mercury Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html',
    fuer: ['objekt:mercury', 'szene:merkurjagd'],
  },
  {
    id: 'nssdc-venus',
    titel: { de: 'Venus: Faktenblatt (NSSDC)', en: 'Venus Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html',
    fuer: ['objekt:venus'],
  },
  {
    id: 'nssdc-mars',
    titel: { de: 'Mars: Faktenblatt (NSSDC)', en: 'Mars Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
    fuer: ['objekt:mars', 'szene:phobos-tiefflug'],
  },
  {
    id: 'nssdc-jupiter',
    titel: { de: 'Jupiter: Faktenblatt (NSSDC)', en: 'Jupiter Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html',
    fuer: ['objekt:jupiter', 'szene:jupiter-vorbeiflug'],
  },
  {
    id: 'nssdc-uranus',
    titel: { de: 'Uranus: Faktenblatt (NSSDC)', en: 'Uranus Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html',
    fuer: ['objekt:uranus', 'szene:uranus-gekippt'],
  },
  {
    id: 'nssdc-neptune',
    titel: { de: 'Neptun: Faktenblatt (NSSDC)', en: 'Neptune Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html',
    fuer: ['objekt:neptune', 'szene:ferne-sonne', 'szene:triton-rueckwaerts'],
  },
  {
    id: 'nssdc-pluto',
    titel: { de: 'Pluto: Faktenblatt (NSSDC)', en: 'Pluto Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html',
    fuer: ['objekt:pluto', 'szene:pluto-charon'],
  },
  {
    id: 'nssdc-jupitermonde',
    titel: { de: 'Jupitermonde: Faktenblatt (NSSDC)', en: 'Jovian Satellite Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html',
    fuer: ['objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto', 'szene:galileisches-schattenspiel'],
  },
  {
    id: 'nssdc-saturnmonde',
    titel: { de: 'Saturnmonde: Faktenblatt (NSSDC)', en: 'Saturnian Satellite Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html',
    fuer: ['objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus', 'szene:titan-dunst', 'szene:enceladus-hell', 'szene:iapetus-schief'],
  },
  {
    id: 'nssdc-uranusmonde',
    titel: { de: 'Uranusmonde: Faktenblatt (NSSDC)', en: 'Uranian Satellite Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uraniansatfact.html',
    fuer: ['objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon'],
  },
  {
    id: 'jpl-satelliten',
    titel: { de: 'Physikalische Daten der Monde (JPL SSD)', en: 'Planetary Satellite Physical Parameters (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'faktenblatt',
    url: 'https://ssd.jpl.nasa.gov/sats/phys_par/',
    fuer: [
      'objekt:moon', 'objekt:phobos', 'objekt:deimos',
      'objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto',
      'objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus',
      'objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon',
      'objekt:triton', 'objekt:charon',
    ],
  },
  // --- Übersichten ---
  {
    id: 'nasa-earth',
    titel: { de: 'Erde bei NASA Science', en: 'Earth at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/earth/',
    fuer: ['objekt:earth', 'szene:erdaufgang'],
  },
  {
    id: 'nasa-saturn',
    titel: { de: 'Saturn bei NASA Science', en: 'Saturn at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/saturn/',
    fuer: ['objekt:saturn', 'szene:saturn-ringkante'],
  },
  {
    id: 'nasa-moon',
    titel: { de: 'Mond bei NASA Science', en: 'Moon at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/moon/',
    fuer: ['objekt:moon', 'szene:mondfinsternis', 'szene:mondtanz'],
  },
  {
    id: 'nasa-cassini',
    titel: { de: 'Mission Cassini (NASA)', en: 'Cassini mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/cassini/',
    fuer: ['objekt:saturn', 'objekt:titan', 'objekt:enceladus', 'thema:ringe', 'szene:saturn-streiflicht', 'szene:ringdurchflug', 'szene:enceladus-hell'],
  },
  {
    id: 'esa-cassini-huygens',
    titel: { de: 'Cassini-Huygens (ESA)', en: 'Cassini-Huygens (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens',
    fuer: ['objekt:saturn', 'objekt:titan', 'szene:titan-dunst'],
  },
  {
    id: 'esa-erdbeobachtung',
    titel: { de: 'Erdbeobachtung (ESA)', en: 'Observing the Earth (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Applications/Observing_the_Earth',
    fuer: ['objekt:earth', 'szene:erdaufgang'],
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
  {
    id: 'wikipedia-de-orrery',
    titel: { de: 'Orrery (Wikipedia)', en: 'Orrery (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Orrery',
    fuer: ['thema:sonnensystem'],
  },
  {
    id: 'wikipedia-en-orrery',
    titel: { de: 'Orrery (englische Wikipedia)', en: 'Orrery (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Orrery',
    fuer: ['thema:sonnensystem'],
  },
  {
    id: 'nasa-sun',
    titel: { de: 'Sonne bei NASA Science', en: 'Sun at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/sun/',
    fuer: ['objekt:sun'],
  },
  {
    id: 'nasa-mercury',
    titel: { de: 'Merkur bei NASA Science', en: 'Mercury at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mercury/',
    fuer: ['objekt:mercury', 'szene:merkurjagd'],
  },
  {
    id: 'nasa-venus',
    titel: { de: 'Venus bei NASA Science', en: 'Venus at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/venus/',
    fuer: ['objekt:venus'],
  },
  {
    id: 'nasa-mars',
    titel: { de: 'Mars bei NASA Science', en: 'Mars at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mars/',
    fuer: ['objekt:mars'],
  },
  {
    id: 'nasa-jupiter',
    titel: { de: 'Jupiter bei NASA Science', en: 'Jupiter at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/jupiter/',
    fuer: ['objekt:jupiter', 'szene:jupiter-vorbeiflug'],
  },
  {
    id: 'nasa-uranus',
    titel: { de: 'Uranus bei NASA Science', en: 'Uranus at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/uranus/',
    fuer: ['objekt:uranus', 'szene:uranus-gekippt'],
  },
  {
    id: 'nasa-neptune',
    titel: { de: 'Neptun bei NASA Science', en: 'Neptune at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/neptune/',
    fuer: ['objekt:neptune'],
  },
  {
    id: 'nasa-pluto',
    titel: { de: 'Pluto bei NASA Science', en: 'Pluto at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/dwarf-planets/pluto/',
    fuer: ['objekt:pluto', 'objekt:charon', 'thema:zwergplaneten', 'szene:pluto-charon'],
  },
  {
    id: 'nasa-ceres',
    titel: { de: 'Ceres bei NASA Science', en: 'Ceres at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/dwarf-planets/ceres/',
    fuer: ['objekt:ceres', 'thema:zwergplaneten', 'szene:ceres-guertel'],
  },
  {
    id: 'nasa-haumea',
    titel: { de: 'Haumea bei NASA Science', en: 'Haumea at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/dwarf-planets/haumea/',
    fuer: ['objekt:haumea'],
  },
  {
    id: 'nasa-kuiperguertel',
    titel: { de: 'Kuipergürtel bei NASA Science', en: 'Kuiper Belt at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/solar-system/kuiper-belt/',
    fuer: ['objekt:pluto', 'objekt:eris', 'objekt:haumea', 'objekt:makemake', 'thema:zwergplaneten'],
  },
  {
    id: 'nasa-marsmonde',
    titel: { de: 'Marsmonde bei NASA Science', en: 'Mars moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mars/moons/',
    fuer: ['objekt:phobos', 'objekt:deimos', 'szene:phobos-tiefflug'],
  },
  {
    id: 'nasa-jupitermonde',
    titel: { de: 'Jupitermonde bei NASA Science', en: 'Jupiter moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/jupiter/jupiter-moons/',
    fuer: ['objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto', 'szene:galileisches-schattenspiel'],
  },
  {
    id: 'nasa-saturnmonde',
    titel: { de: 'Saturnmonde bei NASA Science', en: 'Saturn moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/saturn/moons/',
    fuer: ['objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus', 'szene:enceladus-hell', 'szene:iapetus-schief'],
  },
  {
    id: 'nasa-uranusmonde',
    titel: { de: 'Uranusmonde bei NASA Science', en: 'Uranus moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/uranus/moons/',
    fuer: ['objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon'],
  },
  {
    id: 'nasa-triton',
    titel: { de: 'Triton bei NASA Science', en: 'Triton at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/neptune/moons/triton/',
    fuer: ['objekt:triton', 'szene:triton-rueckwaerts'],
  },
  {
    id: 'nasa-iapetus',
    titel: { de: 'Iapetus bei NASA Science', en: 'Iapetus at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/saturn/moons/iapetus/',
    fuer: ['objekt:iapetus', 'szene:iapetus-schief'],
  },
  {
    id: 'nasa-iapetus-vorbeiflug',
    titel: {
      de: 'Cassini-Vorbeiflug an Iapetus, 10. September 2007 (NASA)',
      en: 'Cassini flyby of Iapetus, Sept. 10, 2007 (NASA)',
    },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/missions/cassini/iapetus-flyby-sept-10-2007/',
    fuer: ['objekt:iapetus', 'szene:iapetus-schief'],
  },
  {
    id: 'nasa-gebundene-rotation',
    titel: { de: 'Gebundene Rotation bei NASA Science', en: 'Tidal locking at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/moon/tidal-locking/',
    fuer: ['thema:gebundene-rotation', 'objekt:moon', 'szene:mondtanz'],
  },
  {
    id: 'nasa-messenger',
    titel: { de: 'Mission MESSENGER (NASA)', en: 'MESSENGER mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/messenger/',
    fuer: ['objekt:mercury', 'szene:merkurjagd'],
  },
  {
    id: 'esa-mars-express',
    titel: { de: 'Mars Express (ESA)', en: 'Mars Express (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Mars_Express',
    fuer: ['objekt:mars', 'objekt:phobos', 'szene:phobos-tiefflug'],
  },
  {
    id: 'nasa-juno',
    titel: { de: 'Mission Juno (NASA)', en: 'Juno mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/juno/',
    fuer: ['objekt:jupiter', 'szene:jupiter-vorbeiflug'],
  },
  {
    id: 'esa-juice',
    titel: { de: 'Juice (ESA)', en: 'Juice (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Juice',
    fuer: ['objekt:jupiter', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto', 'szene:galileisches-schattenspiel'],
  },
  {
    id: 'nasa-voyager-2',
    titel: { de: 'Voyager 2 (NASA)', en: 'Voyager 2 (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/voyager/voyager-2/',
    fuer: [
      'objekt:uranus', 'objekt:neptune', 'objekt:triton',
      'objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon',
      'szene:ferne-sonne', 'szene:jupiter-vorbeiflug', 'szene:uranus-gekippt', 'szene:triton-rueckwaerts',
    ],
  },
  {
    id: 'nasa-new-horizons',
    titel: { de: 'Mission New Horizons (NASA)', en: 'New Horizons mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/new-horizons/',
    fuer: ['objekt:pluto', 'objekt:charon', 'szene:pluto-charon', 'szene:jupiter-vorbeiflug'],
  },
  {
    id: 'nasa-dawn',
    titel: { de: 'Mission Dawn (NASA)', en: 'Dawn mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/dawn/',
    fuer: ['objekt:ceres', 'szene:ceres-guertel'],
  },
  {
    id: 'nasa-sonnensystem',
    titel: { de: 'Sonnensystem bei NASA Science', en: 'Solar System at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/solar-system/',
    fuer: ['thema:sonnensystem', 'szene:systemblick'],
  },
  // --- Bildarchive ---
  {
    id: 'jpl-photojournal-earth',
    titel: { de: 'Photojournal: Erde (JPL)', en: 'Photojournal: Earth (JPL)' },
    herausgeber: 'JPL', sprache: 'en', art: 'bildarchiv',
    url: 'https://science.nasa.gov/photojournal/galleries/pj-earth/',
    fuer: ['objekt:earth', 'szene:erdaufgang'],
  },
  {
    id: 'jpl-photojournal-saturn',
    titel: { de: 'Photojournal: Saturn (JPL)', en: 'Photojournal: Saturn (JPL)' },
    herausgeber: 'JPL', sprache: 'en', art: 'bildarchiv',
    url: 'https://science.nasa.gov/photojournal/galleries/pj-saturn/',
    fuer: ['objekt:saturn', 'thema:ringe', 'szene:saturn-streiflicht', 'szene:saturn-ringkante', 'szene:ringdurchflug'],
  },
  {
    id: 'nasa-webb-uranus',
    titel: {
      de: 'Webb-Aufnahme des Uranus (NASA)',
      en: "Webb's image of Uranus (NASA)",
    },
    herausgeber: 'NASA', sprache: 'en', art: 'bildarchiv',
    url: 'https://science.nasa.gov/missions/webb/nasas-webb-scores-another-ringed-world-with-new-image-of-uranus',
    fuer: ['szene:uranus-gekippt'],
  },
  {
    id: 'nasa-family-portrait',
    titel: {
      de: 'Das erste Familienporträt des Sonnensystems (1990, NASA)',
      en: 'First-Ever Solar System Family Portrait (1990, NASA)',
    },
    herausgeber: 'NASA', sprache: 'en', art: 'bildarchiv',
    url: 'https://science.nasa.gov/resource/first-ever-solar-system-family-portrait-1990/',
    fuer: ['szene:ferne-sonne'],
  },
  {
    // Sammlungsobjekt 1952-73; die Seite weist Skripte ohne Browserkennung
    // mit 403 ab, im Browser öffnet sie normal (geprüft 16.09.2026).
    id: 'sciencemuseum-orrery',
    titel: {
      de: 'Orrery von John Rowley für den Earl of Orrery (Science Museum Group)',
      en: 'Orrery made by John Rowley for the Earl of Orrery (Science Museum Group)',
    },
    herausgeber: 'sonstige', sprache: 'en', art: 'bildarchiv',
    url: 'https://collection.sciencemuseumgroup.org.uk/objects/co56970/orrery-made-by-john-rowley-for-the-earl-of-orrery',
    fuer: ['thema:sonnensystem'],
  },
  // --- Werkzeuge ---
  {
    id: 'nasa-eyes',
    titel: { de: 'NASA Eyes on the Solar System', en: 'NASA Eyes on the Solar System' },
    herausgeber: 'NASA', sprache: 'en', art: 'werkzeug',
    url: 'https://eyes.nasa.gov/apps/solar-system/',
    fuer: ['objekt:sun', 'objekt:earth', 'objekt:saturn', 'thema:modell', 'szene:systemblick'],
  },
  {
    id: 'jpl-horizons',
    titel: { de: 'JPL Horizons: Handbuch', en: 'JPL Horizons manual' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/horizons/manual.html',
    fuer: ['thema:modell', 'thema:bahnelemente'],
  },
  {
    id: 'jpl-sbdb',
    titel: { de: 'Kleinkörper-Datenbank (JPL SBDB)', en: 'Small-Body Database (JPL SBDB)' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html',
    fuer: ['objekt:ceres', 'objekt:eris', 'objekt:haumea', 'objekt:makemake', 'objekt:pluto'],
  },
  // --- Fachliches ---
  {
    id: 'jpl-approx-pos',
    titel: { de: 'Näherungsbahnen der Planeten (JPL SSD)', en: 'Approximate Positions of the Planets (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'fachartikel',
    url: 'https://ssd.jpl.nasa.gov/planets/approx_pos.html',
    fuer: ['thema:modell', 'thema:bahnelemente', 'objekt:earth', 'objekt:saturn', 'szene:systemblick'],
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
    fuer: ['objekt:saturn', 'objekt:uranus', 'thema:ringe', 'szene:saturn-ringkante', 'szene:ringdurchflug', 'szene:uranus-gekippt'],
  },
  {
    id: 'jpl-satelliten-bahnen',
    titel: { de: 'Mittlere Bahnelemente der Monde (JPL SSD)', en: 'Planetary Satellite Mean Elements (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'fachartikel',
    url: 'https://ssd.jpl.nasa.gov/sats/elem/',
    fuer: ['thema:bahnelemente', 'thema:modell', 'objekt:iapetus', 'szene:triton-rueckwaerts', 'szene:iapetus-schief'],
  },
  {
    id: 'jpl-hauptguertel',
    titel: { de: 'Kirkwood-Lücken im Hauptgürtel (JPL SSD)', en: 'Kirkwood gaps in the main belt (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'fachartikel',
    url: 'https://ssd.jpl.nasa.gov/diagrams/mb_hist.html',
    fuer: ['thema:kirkwood-luecken', 'objekt:ceres', 'szene:ceres-guertel'],
  },
  // Fachthemen der Hochschule (Entwurf 4d §5.3)
  {
    id: 'wikipedia-de-roche-grenze',
    titel: { de: 'Roche-Grenze (Wikipedia)', en: 'Roche limit (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Roche-Grenze',
    fuer: ['thema:gezeiten'],
  },
  {
    id: 'wikipedia-en-roche-limit',
    titel: { de: 'Roche-Grenze (englische Wikipedia)', en: 'Roche limit (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Roche_limit',
    fuer: ['thema:gezeiten'],
  },
  {
    id: 'wikipedia-en-tidal-heating',
    titel: { de: 'Gezeitenheizung (englische Wikipedia)', en: 'Tidal heating (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Tidal_heating',
    fuer: ['thema:gezeiten'],
  },
  {
    id: 'wikipedia-de-bahnresonanz',
    titel: { de: 'Bahnresonanz (Wikipedia)', en: 'Orbital resonance (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Bahnresonanz',
    fuer: ['thema:resonanzen'],
  },
  {
    id: 'wikipedia-en-orbital-resonance',
    titel: { de: 'Bahnresonanz (englische Wikipedia)', en: 'Orbital resonance (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Orbital_resonance',
    fuer: ['thema:resonanzen'],
  },
  {
    id: 'wikipedia-en-kirkwood-gap',
    titel: { de: 'Kirkwood-Lücke (englische Wikipedia)', en: 'Kirkwood gap (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Kirkwood_gap',
    fuer: ['thema:kirkwood-luecken'],
  },
  {
    id: 'wikipedia-en-asteroid-belt',
    titel: { de: 'Asteroidengürtel (englische Wikipedia)', en: 'Asteroid belt (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Asteroid_belt',
    fuer: ['szene:ceres-guertel'],
  },
  {
    id: 'jpl-ephemeriden',
    titel: { de: 'Planetare Ephemeriden (JPL SSD)', en: 'Planetary ephemerides (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/planets/eph_export.html',
    fuer: ['thema:bezugssysteme'],
  },
  {
    id: 'wikipedia-de-icrs',
    titel: { de: 'International Celestial Reference System (Wikipedia)', en: 'International Celestial Reference System (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/International_Celestial_Reference_System',
    fuer: ['thema:bezugssysteme'],
  },
  {
    id: 'wikipedia-en-icrs',
    titel: { de: 'International Celestial Reference System (englische Wikipedia)', en: 'International Celestial Reference System (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/International_Celestial_Reference_System',
    fuer: ['thema:bezugssysteme'],
  },
  {
    id: 'wikipedia-de-love-zahlen',
    titel: { de: 'Love-Zahlen (Wikipedia)', en: 'Love numbers (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Love-Zahlen',
    fuer: ['thema:innerer-aufbau', 'thema:gezeiten'],
  },
  {
    id: 'wikipedia-en-moment-of-inertia-factor',
    titel: { de: 'Trägheitsmomentfaktor (englische Wikipedia)', en: 'Moment of inertia factor (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Moment_of_inertia_factor',
    fuer: ['thema:innerer-aufbau'],
  },
  {
    id: 'wikipedia-de-albedo',
    titel: { de: 'Albedo (Wikipedia)', en: 'Albedo (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Albedo',
    fuer: ['thema:photometrie'],
  },
  {
    id: 'wikipedia-en-geometric-albedo',
    titel: { de: 'Geometrische Albedo (englische Wikipedia)', en: 'Geometric albedo (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Geometric_albedo',
    fuer: ['thema:photometrie'],
  },
  {
    id: 'wikipedia-de-entstehung-sonnensystem',
    titel: { de: 'Entstehung des Sonnensystems (Wikipedia)', en: 'Formation of the Solar System (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Entstehung_des_Sonnensystems',
    fuer: ['thema:entstehung'],
  },
  {
    id: 'wikipedia-en-formation-solar-system',
    titel: { de: 'Entstehung und Entwicklung des Sonnensystems (englische Wikipedia)', en: 'Formation and evolution of the Solar System (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System',
    fuer: ['thema:entstehung'],
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
