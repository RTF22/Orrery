import type { Body } from '../../sim/types';

export const jupiter: Body = {
  id: 'jupiter',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    a: 5.20288700,     aDot: -0.00011607,
    e: 0.04838624,     eDot: -0.00013253,
    i: 1.30439695,     iDot: -0.00183714,
    L: 34.39644051,    LDot: 3034.74612775,
    lp: 14.72847983,   lpDot: 0.21252668,
    node: 100.47390909, nodeDot: 0.20469106,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Jupiter Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie).
    // Rotationsperiode in System-III-Koordinaten (an das Magnetfeld gebunden) —
    // Jupiter hat als Gasriese keine feste Oberfläche.
    radiusKm: 69911,
    massKg: 1.89813e27,
    rotationPeriodH: 9.9250,
    axialTiltDeg: 3.13,
    rotationAtEpochDeg: 0,
  },
  appearance: {
    textures: { albedo: 'textures/jupiter/albedo.jpg' },
    color: '#d9b382',
  },
  info: { nameKey: 'body.jupiter.name', descriptionKey: 'body.jupiter.description' },
};
