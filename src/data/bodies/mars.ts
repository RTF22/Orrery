import type { Body } from '../../sim/types';

export const mars: Body = {
  id: 'mars',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    a: 1.52371034,     aDot: 0.00001847,
    e: 0.09339410,     eDot: 0.00007882,
    i: 1.84969142,     iDot: -0.00813131,
    L: -4.55343205,    LDot: 19140.30268499,
    lp: -23.94362959,  lpDot: 0.44441088,
    node: 49.55953891, nodeDot: -0.29257343,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Mars Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie)
    radiusKm: 3389.5,
    massKg: 6.4169e23,
    rotationPeriodH: 24.6229,
    axialTiltDeg: 25.19,
    rotationAtEpochDeg: 0,
  },
  appearance: {
    textures: { albedo: 'textures/mars/albedo.jpg' },
    color: '#c1502e',
  },
  info: { nameKey: 'body.mars.name', descriptionKey: 'body.mars.description' },
};
