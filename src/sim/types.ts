export interface Vec3 { x: number; y: number; z: number }

/** Bahnelemente zur Epoche J2000 samt säkularen Raten (pro julianischem Jahrhundert). */
export interface OrbitElements {
  a: number;    aDot: number;     // große Halbachse [AE]
  e: number;    eDot: number;     // Exzentrizität [-]
  i: number;    iDot: number;     // Inklination [Grad]
  L: number;    LDot: number;     // mittlere Länge [Grad]
  lp: number;   lpDot: number;    // Länge des Perihels [Grad]
  node: number; nodeDot: number;  // Länge des aufsteigenden Knotens [Grad]
  /** Bezugsebene: Ekliptik J2000 oder Äquatorebene des Mutterkörpers. */
  frame: 'ecliptic' | 'parentEquator';
}

export interface PhysicalData {
  radiusKm: number;
  massKg: number;
  /** Siderische Rotationsperiode in Stunden; negativ bei retrograder Rotation. */
  rotationPeriodH: number;
  /**
   * Nordpolrichtung in äquatorialen Koordinaten J2000 (IAU-Bericht über
   * Rotationselemente). Aus ihr folgen Achsneigung, Ringebene und die
   * Bezugsebene der Monde — deshalb steht hier der Pol und nicht die
   * Neigung: Die Neigung sagt, wie stark die Achse steht, nicht wohin.
   */
  pole: { raDeg: number; decDeg: number };
  /** Rotationsphase zur Epoche J2000 in Grad. */
  rotationAtEpochDeg: number;
  /**
   * Geometrische Albedo im V-Band, dimensionslos. Quelle je Datensatz im
   * Kommentar. Sie wird in render/bodies.ts als Normalalbedo der
   * Lambert-Fläche verwendet: Die Albedo-Textur wird beim Laden so
   * skaliert, dass ihre mittlere lineare Reflexion diesem Wert entspricht —
   * die Karten sind kontrastnormierte Mosaike, keine Reflexionskarten. Die
   * geometrische Albedo enthält den Oppositionseffekt und kann über 1
   * liegen; sie wird nicht abgeschnitten (dokumentierte Vereinfachung, siehe
   * docs/superpowers/specs/2026-09-13-zielbelichtung-albedo-design.md,
   * Abschnitt 4.1). Die Sonne trägt das Feld nicht — sie leuchtet selbst.
   */
  albedo?: number;
}

export interface Appearance {
  textures: { albedo: string; normal?: string; specular?: string; emissive?: string };
  /** Fallback-Farbe sowie Farbe von Marker und Bahnlinie. */
  color: string;
  atmosphere?: { colorInner: string; colorOuter: string; heightKm: number };
  /**
   * Ringsystem. `texture` ist ein radialer Streifen (u = 0 Innenkante,
   * u = 1 Außenkante) oder leer. `profil` beschreibt die Ringe als Daten,
   * aus denen render/ringProfil.ts den Streifen selbst rechnet — für
   * Systeme ohne freie Bildquelle (Uranus). Ist beides gesetzt, gewinnt die
   * Bilddatei.
   */
  rings?: { innerKm: number; outerKm: number; texture: string; profil?: RingBand[] };
}

/**
 * Ein Ring als Messgröße: Mittelradius, Breite und normale optische Tiefe,
 * wie sie der PDS Ring-Moon Systems Node tabelliert. `art` trennt die
 * schmalen, dichten Ringe (Breite wenige Kilometer, τ um 0,3 bis 2) von den
 * breiten, diffusen Staubkomponenten (Breite Tausende Kilometer, τ um 0,005).
 */
export interface RingBand {
  name: string;
  radiusKm: number;
  widthKm: number;
  opticalDepth: number;
  art: 'schmal' | 'breit';
}

export interface Body {
  id: string;
  parent: string | null;
  kind: 'star' | 'planet' | 'moon' | 'dwarf';
  /** null genau dann, wenn der Körper im Ursprung ruht (die Sonne). */
  orbit: OrbitElements | null;
  physical: PhysicalData;
  appearance: Appearance;
  info: { nameKey: string; descriptionKey: string };
}

export type BodyIndex = Record<string, Body>;
