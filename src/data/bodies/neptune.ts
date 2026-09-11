import type { Body } from '../../sim/types';

export const neptune: Body = {
  id: 'neptune',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    a: 30.06992276,     aDot: 0.00026291,
    e: 0.00859048,      eDot: 0.00005105,
    i: 1.77004347,      iDot: 0.00035372,
    L: -55.12002969,    LDot: 218.45945325,
    lp: 44.96476227,    lpDot: -0.32241464,
    node: 131.78422574, nodeDot: -0.00508664,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Neptune Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie).
    // Rotationsperiode in magnetischen Koordinaten (Voyager-2-Funkmessung) —
    // Neptun hat als Gasriese keine feste Oberfläche.
    radiusKm: 24622,
    massKg: 1.02409e26,
    rotationPeriodH: 16.11,
    axialTiltDeg: 28.32,
    rotationAtEpochDeg: 0,
  },
  appearance: {
    textures: { albedo: 'textures/neptune/albedo.jpg' },
    color: '#3b5bdb',
  },
  info: { nameKey: 'body.neptune.name', descriptionKey: 'body.neptune.description' },
};
