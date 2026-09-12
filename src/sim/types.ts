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
}

export interface Appearance {
  textures: { albedo: string; normal?: string; specular?: string; emissive?: string };
  /** Fallback-Farbe sowie Farbe von Marker und Bahnlinie. */
  color: string;
  atmosphere?: { colorInner: string; colorOuter: string; heightKm: number };
  rings?: { innerKm: number; outerKm: number; texture: string };
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
