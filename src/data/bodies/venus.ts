import type { Body } from '../../sim/types';

export const venus: Body = {
  id: 'venus',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    a: 0.72333566,     aDot: 0.00000390,
    e: 0.00677672,     eDot: -0.00004107,
    i: 3.39467605,     iDot: -0.00078890,
    L: 181.97909950,   LDot: 58517.81538729,
    lp: 131.60246718,  lpDot: 0.00268329,
    node: 76.67984255, nodeDot: -0.27769418,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Venus Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie).
    // Venus rotiert retrograd, daher negative Rotationsperiode.
    radiusKm: 6051.8,
    massKg: 4.8673e24,
    rotationPeriodH: -5832.6,
    // Pol aus dem IAU-Bericht über Rotationselemente (Archinal et al.).
    // Kontrollrechnung: Der Winkel zwischen diesem Pol und der eigenen
    // Bahnnormale beträgt 2,64° — nicht die vielzitierten 177,36°. Das ist
    // dieselbe Nordpol-Konvention wie bei Uranus (siehe Kommentar dort): Die
    // 177,36° stecken die Rückläufigkeit als 180° − 2,64° in die Zahl, die
    // hier bereits das negative Vorzeichen von rotationPeriodH trägt. Mit
    // dem alten axialTiltDeg: 177.36 zusammen mit der schon negativen
    // Periode wäre die Rückläufigkeit doppelt gezählt gewesen. Mit Pol
    // (< 90° zur Bahnnormale) plus negativer Periode ist es richtig.
    pole: { raDeg: 272.76, decDeg: 67.16 },
    rotationAtEpochDeg: 0,
    // NSSDC Venus Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.689,
  },
  appearance: {
    textures: { albedo: 'textures/venus/albedo.jpg' },
    color: '#e8c39e',
  },
  info: { nameKey: 'body.venus.name', descriptionKey: 'body.venus.description' },
};
