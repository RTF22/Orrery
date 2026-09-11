import type { Body } from '../../sim/types';

// Physikalische Daten: NASA/JPL NSSDC, Sun Fact Sheet, Stand 2023
// (Originalseite https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
// war zum Abrufzeitpunkt wegen Wartungsarbeiten offline; abgerufen über das
// Webarchiv: https://web.archive.org/web/2023id_/https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html)
// Rotationsperiode: adoptierter Wert bei 16° heliografischer Breite —
// die tatsächliche Rotation variiert differenziell mit der Breite.
export const sun: Body = {
  id: 'sun',
  parent: null,
  kind: 'star',
  orbit: null,
  physical: {
    radiusKm: 695700,
    massKg: 1.9885e30,
    rotationPeriodH: 609.12,
    axialTiltDeg: 7.25,
    rotationAtEpochDeg: 0,
  },
  appearance: {
    textures: { albedo: 'textures/sun/albedo.jpg', emissive: 'textures/sun/emissive.jpg' },
    color: '#fdb813',
  },
  info: { nameKey: 'body.sun.name', descriptionKey: 'body.sun.description' },
};
