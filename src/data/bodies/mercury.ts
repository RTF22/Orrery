import type { Body } from '../../sim/types';

export const mercury: Body = {
  id: 'mercury',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    a: 0.38709927,     aDot: 0.00000037,
    e: 0.20563593,     eDot: 0.00001906,
    i: 7.00497902,     iDot: -0.00594749,
    L: 252.25032350,   LDot: 149472.67411175,
    lp: 77.45779628,   lpDot: 0.16047689,
    node: 48.33076593, nodeDot: -0.12534081,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Mercury Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie)
    radiusKm: 2439.7,
    massKg: 3.3010e23,
    rotationPeriodH: 1407.6,
    // Pol aus dem IAU-Bericht über Rotationselemente (Archinal et al.).
    // Kontrollrechnung: Winkel zur eigenen Bahnnormale 0,034° — der bekannte
    // Wert für Merkur (0,034°): Die Rotationsachse steht nahezu senkrecht
    // auf der eigenen (gegen die Ekliptik um 7° geneigten) Bahnebene.
    pole: { raDeg: 281.0103, decDeg: 61.4155 },
    rotationAtEpochDeg: 0,
    // NSSDC Mercury Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.142,
  },
  appearance: {
    textures: { albedo: 'textures/mercury/albedo.jpg' },
    color: '#8c8680',
  },
  info: { nameKey: 'body.mercury.name', descriptionKey: 'body.mercury.description' },
};
