import type { Body } from '../../sim/types';

export const earth: Body = {
  id: 'earth',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    // Achtung: Die Tabelle liefert für „Earth" den Erde-Mond-Schwerpunkt
    // (EM Bary), nicht den Erdmittelpunkt. Die Abweichung liegt unter
    // 4700 km und ist für Phase 1 vernachlässigbar.
    a: 1.00000261,     aDot: 0.00000562,
    e: 0.01671123,     eDot: -0.00004392,
    i: -0.00001531,    iDot: -0.01294668,
    L: 100.46457166,   LDot: 35999.37244981,
    lp: 102.93768193,  lpDot: 0.32327364,
    node: 0.0,         nodeDot: 0.0,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Earth Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie)
    radiusKm: 6371.000,
    massKg: 5.9722e24,
    rotationPeriodH: 23.9345,
    // Pol aus dem IAU-Bericht über Rotationselemente (Archinal et al.).
    // Kontrollrechnung: Winkel zur eigenen Bahnnormale 23,44° — die Erdbahn
    // *ist* die Ekliptik, deshalb ist das zugleich die bekannte Schiefe der
    // Ekliptik (23,44°).
    pole: { raDeg: 0.00, decDeg: 90.00 },
    rotationAtEpochDeg: 0,
    // NSSDC Earth Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.434,
  },
  appearance: {
    textures: { albedo: 'textures/earth/albedo.jpg' },
    color: '#2a6fdb',
    // Kernschattenfarbe (Blutmond): Gestaltungswert nahe einer
    // Farbtemperatur von 2500 K, wie sie das durch die Erdatmosphäre
    // gebrochene Sonnenuntergangslicht hat (Danjon-Skala L2–L3, „dunkelrot
    // bis ziegelrot"). Linear ≈ 1,00 / 0,32 / 0,11 (Entwurf §2, §5).
    umbra: { color: '#ff9a5c' },
  },
  info: { nameKey: 'body.earth.name', descriptionKey: 'body.earth.description' },
};
