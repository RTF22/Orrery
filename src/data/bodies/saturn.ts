import type { Body } from '../../sim/types';

export const saturn: Body = {
  id: 'saturn',
  parent: 'sun',
  kind: 'planet',
  orbit: {
    // JPL SSD, Approximate Positions of the Major Planets, Tabelle 1 (1800-2050)
    // https://ssd.jpl.nasa.gov/planets/approx_pos.html
    a: 9.53667594,      aDot: -0.00125060,
    e: 0.05386179,      eDot: -0.00050991,
    i: 2.48599187,      iDot: 0.00193609,
    L: 49.95424423,     LDot: 1222.49362201,
    lp: 92.59887831,    lpDot: -0.41897216,
    node: 113.66242448, nodeDot: -0.28867794,
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Saturn Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie).
    // Rotationsperiode in Saturnian-System-III-Koordinaten (an das Magnetfeld
    // gebunden) — Saturn hat als Gasriese keine feste Oberfläche.
    radiusKm: 58232,
    massKg: 5.6832e26,
    rotationPeriodH: 10.656,
    // Pollage aus dem IAU-Bericht über Rotationselemente (Archinal et al.).
    // Kontrollrechnung: Daraus folgt eine Achsneigung von 26,73° gegen die
    // eigene Bahn — der bekannte Wert für Saturn, und zugleich die Neigung
    // der Ringebene.
    pole: { raDeg: 40.589, decDeg: 83.537 },
    rotationAtEpochDeg: 0,
    // NSSDC Saturn Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.499,
  },
  appearance: {
    textures: { albedo: 'textures/saturn/albedo.jpg' },
    color: '#e3c16f',
    // NASA/JPL NSSDC Saturnian Rings Fact Sheet,
    // https://nssdc.gsfc.nasa.gov/planetary/factsheet/satringfact.html,
    // abgerufen am 12.09.2026 (dieselbe Quelle, die schon der Mimas-Test in
    // data/index.test.ts zitiert). innerKm ist die Innenkante des C-Rings
    // (74 658 km — der D-Ring davor ist zu schwach, um ihn eigens
    // darzustellen), outerKm die Außenkante des A-Rings (136 780 km, nicht
    // der weiter außen liegende, deutlich schwächere F-Ring bei 139 826 km).
    // Der Task-12-Brief nennt gerundet 74 500 bis 140 200 km; die zweite
    // Zahl verwechselt A- mit F-Ring-Außenkante (siehe Kommentar zum
    // Mimas-Test) — hier gilt die nachgeprüfte Fact-Sheet-Zahl.
    // texture: Solar-System-Scope-Ringtextur (radialer Streifen mit
    // Alphakanal, siehe ASSETS.md, Abschnitt "Ringtextur"), Task 13.
    rings: { innerKm: 74658, outerKm: 136780, texture: 'textures/saturn/ring.png' },
  },
  info: { nameKey: 'body.saturn.name', descriptionKey: 'body.saturn.description' },
};
