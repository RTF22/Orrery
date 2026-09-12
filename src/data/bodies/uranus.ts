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
    // Uranus liegt fast auf der Seite und rotiert nach IAU-Konvention
    // retrograd, daher negative Rotationsperiode.
    radiusKm: 25362,
    massKg: 8.6811e25,
    rotationPeriodH: -17.24,
    // Pol aus dem IAU-Bericht über Rotationselemente (Archinal et al.).
    // Kontrollrechnung: Der Winkel zwischen diesem Pol und der eigenen
    // Bahnnormale beträgt 82,23° — nicht die vielzitierten 97,77°. Das ist
    // kein Widerspruch: Die IAU legt den Nordpol unabhängig vom Rotations-
    // sinn als den Pol fest, der geometrisch nördlich der Ekliptik liegt,
    // und die 97,77° stecken zusätzlich die Information "rückläufig" in die
    // Zahl (180° − 82,23°). Diese Information trägt hier bereits das
    // negative Vorzeichen von rotationPeriodH — zusammen mit dem alten
    // axialTiltDeg: 97.77 (> 90°, ebenfalls "rückläufig") wäre die
    // Rückläufigkeit doppelt gezählt gewesen: Kugel auf dem Kopf UND
    // rückwärts drehend, im Bild also wieder vorwärts. Mit Pol (< 90° zur
    // Bahnnormale) plus negativer Periode ist es einfach und richtig.
    pole: { raDeg: 257.311, decDeg: -15.175 },
    rotationAtEpochDeg: 0,
  },
  appearance: {
    textures: { albedo: 'textures/uranus/albedo.jpg' },
    color: '#9fd9e0',
    // Innen- und Außenkante der klassischen 9+1 schmalen Ringe (ζ bis ε;
    // ohne die beiden sehr diffusen äußeren Staubringe ν und μ, die erst
    // 2003–2005 per Hubble gefunden wurden und mit bloßem Auge praktisch
    // unsichtbar sind). Quelle: PDS Rings Node, "Vital Statistics for
    // Uranus's Rings", https://pds-rings.seti.org/uranus/uranus_rings_table.html
    // (deckungsgleich mit der USGS-Ringnomenklatur, planetarynames.wr.usgs.gov/Page/Rings),
    // abgerufen am 12.09.2026. ζ-Ring: Mittelradius 39 600 km, Breite
    // 3500 km, Innenkante 39 600 − 3500/2 = 37 850 km. ε-Ring: Mittelradius
    // 51 149 km, Breite 58 km, Außenkante 51 149 + 58/2 ≈ 51 178 km. Auf
    // glatte Werte gerundet: 38 000 bis 51 000 km — deckt sich mit den
    // "rund 38 000 bis 51 000 km" aus dem Task-12-Brief.
    // texture: noch keine Ringtextur im Repo (siehe ASSETS.md) — bleibt bis
    // zum Material-Task leer, wie bei Körpern ohne Albedo-Textur üblich.
    rings: { innerKm: 38000, outerKm: 51000, texture: '' },
  },
  info: { nameKey: 'body.uranus.name', descriptionKey: 'body.uranus.description' },
};
