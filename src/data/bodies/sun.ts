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
    // Pol aus dem IAU-Bericht über Rotationselemente (Archinal et al.). Die
    // Sonne hat keine eigene Bahn — Bezug ist deshalb direkt die Ekliptik.
    // Kontrollrechnung: Winkel zur Ekliptiknormale 7,25° — der bekannte Wert.
    pole: { raDeg: 286.13, decDeg: 63.87 },
    rotationAtEpochDeg: 0,
  },
  appearance: {
    // Kein eigener `emissive`-Pfad: ladeAlbedo() in render/bodies.ts setzt die
    // Albedo-Textur ohnehin als emissiveMap ein, eine separate Emissiv-Datei
    // wäre nie geladen worden (Fixrunde Task 11, toter Texturpfad).
    textures: { albedo: 'textures/sun/albedo.jpg' },
    color: '#fdb813',
  },
  info: { nameKey: 'body.sun.name', descriptionKey: 'body.sun.description' },
};
