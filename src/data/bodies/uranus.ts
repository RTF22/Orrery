import type { Body } from '../../sim/types';

export const uranus: Body = {
  id: 'uranus',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    a: 19.18916464,    aDot: -0.00196176,
    e: 0.04725744,     eDot: -0.00004397,
    i: 0.77263783,     iDot: -0.00242939,
    L: 313.23810451,   LDot: 428.48202785,
    lp: 170.95427630,  lpDot: 0.40805281,
    node: 74.01692503, nodeDot: 0.04240589,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Uranus Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie).
    // Uranus liegt fast auf der Seite (Achsneigung > 90°) und rotiert nach
    // IAU-Konvention retrograd, daher negative Rotationsperiode.
    radiusKm: 25362,
    massKg: 8.6811e25,
    rotationPeriodH: -17.24,
    axialTiltDeg: 97.77,
    rotationAtEpochDeg: 0,
  },
  appearance: {
    textures: { albedo: 'textures/uranus/albedo.jpg' },
    color: '#9fd9e0',
  },
  info: { nameKey: 'body.uranus.name', descriptionKey: 'body.uranus.description' },
};
