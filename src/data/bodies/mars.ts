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
    // Pol: bewusst der ÄLTERE Wert aus dem IAU-Bericht 2009 (317,68143 /
    // 52,88650), nicht der aktuellere aus dem 2015er Bericht (317,269 /
    // 54,432). Kontrollrechnung (Winkel zwischen Pol und Marsbahnnormale):
    //   2009er Pol: 25,19° — deckt sich exakt mit der Achsneigung von Mars
    //     gegen seine eigene Bahn, wie sie in jeder Fachdarstellung und der
    //     Missionsdokumentation steht (unabhängig vielfach belegt).
    //   2015er Pol: 23,92° — weicht davon um 1,27° ab.
    // Wir wissen nicht, dass der 2015er Kernelwert falsch ist — nur, dass er
    // zur überall zitierten Neigung nicht passt, während der ältere Pol sie
    // exakt trifft. Eine Polrevision um 1,5° wäre für einen Körper mit
    // jahrzehntelanger Bahnverfolgung ungewöhnlich; die vielfach belegte
    // Zahl wiegt hier schwerer als ein einzelner Kerneleintrag. Falls sich
    // herausstellt, dass der neuere Pol doch zutrifft, ist diese Entscheidung
    // anhand der beiden Werte oben in einem Satz umkehrbar.
    pole: { raDeg: 317.68143, decDeg: 52.88650 },
    rotationAtEpochDeg: 0,
    // NSSDC Mars Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.170,
  },
  appearance: {
    textures: { albedo: 'textures/mars/albedo.jpg' },
    color: '#c1502e',
  },
  info: { nameKey: 'body.mars.name', descriptionKey: 'body.mars.description' },
};
