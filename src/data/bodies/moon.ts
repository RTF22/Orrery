import type { Body } from '../../sim/types';

// Der Mond fehlt in JPL SSDs Tabelle 1 (die nur die acht Planeten führt) und
// bekommt daher gemittelte Bahnelemente aus einer eigenen Quelle:
//
// a, e, i sowie die siderische Umlaufzeit sind Mittelwerte aus dem NASA/JPL
// NSSDC Moon Fact Sheet, Stand 2023 (über Webarchiv abgerufen, siehe Kommentar
// in sun.ts zur Herkunft der Archivkopie):
// „Inclination to ecliptic (deg): 5.145", „Orbit eccentricity: 0.0549",
// „Revolution period (days): 27.3217". Aus der Umlaufzeit folgt
// LDot = 36525 / 27.32166 * 360 (julianisches Jahrhundert / siderischer Monat
// in Tagen, mal 360°).
//
// L, lp und node zur Epoche J2000 sowie deren säkulare Raten stammen aus
// Jean Meeus, Astronomical Algorithms, Kapitel 47 („Position of the Moon").
// Diese Koeffizienten sind in der quelloffenen Implementierung PyMeeus
// wörtlich abgedruckt (pymeeus/Moon.py, Funktionen longitude_mean_perigee
// und longitude_mean_ascending_node):
// https://github.com/architest/pymeeus/blob/master/pymeeus/Moon.py
//
// Kontrollrechnungen (unabhängig von der Quelle nachvollziehbar):
//  - a(1-e) ≈ 363 359 km, a(1+e) ≈ 405 574 km — nahe den bekannten mittleren
//    Perigäums-/Apogäumsdistanzen (≈363 300 km / ≈405 500 km).
//  - lpDot ≈ +4069°/Jh. (Apsidendrehung in ≈8,85 Jahren), nodeDot ≈ -1934°/Jh.
//    (rückläufige Knotendrehung in ≈18,6 Jahren) — beide Größenordnungen
//    stimmen mit unabhängigen Quellen überein (z. B. NASA, Eclipses and the
//    Moon's Orbit, https://eclipse.gsfc.nasa.gov/SEhelp/moonorbit.html).
//
// Absolute Mondposition ist für Phase 1 ausdrücklich nicht genauigkeitskritisch
// (vereinfachte Laplace-Ebene, siehe Konzeptdokument) — wichtig sind Geometrie
// und Periodendauern, nicht die exakte Phase.
export const moon: Body = {
  id: 'moon',
  parent: 'earth',
  kind: 'moon',
  orbit: {
    a: 0.00257,          aDot: 0,
    e: 0.0549,            eDot: 0,
    i: 5.145,              iDot: 0,
    L: 218.3164477,        LDot: 481266.511625,
    lp: 83.3532465,        lpDot: 4069.0137287,
    node: 125.0445479,     nodeDot: -1934.1362891,
    // frame: 'ecliptic', nicht 'parentEquator' — die Inklination i = 5.145°
    // dieses Datensatzes ist gegen die Ekliptik gemessen, nicht gegen den
    // Erdäquator. Die Neigung zum Erdäquator ist ohnehin nicht konstant: sie
    // pendelt im 18,6-Jahres-Knotenzyklus zwischen 18,3° und 28,6°
    // (23,44° ± 5,145°). 'parentEquator' ist für die Jupiter- und
    // Saturnmonde in Phase 3 reserviert, deren Elemente tatsächlich auf die
    // Äquator-/Laplace-Ebene ihres Planeten bezogen sind.
    frame: 'ecliptic',
  },
  physical: {
    // NASA/JPL NSSDC, Moon Fact Sheet, Stand 2023 (über Webarchiv abgerufen,
    // siehe Kommentar in sun.ts zur Herkunft der Archivkopie).
    // Die Rotation des Mondes ist gebunden: Rotationsperiode = siderische
    // Umlaufzeit = 27.32166 d.
    radiusKm: 1737.4,
    massKg: 7.346e22,
    rotationPeriodH: 655.71984,
    // Pol: Der Mondpol hat keinen einfachen konstanten RA/Dec-Wert wie die
    // Planeten — der IAU-Rotationsbericht gibt ihn als Formel mit einem
    // linearen Term plus 13 periodischen Korrekturgliedern (abhängig von der
    // Mondknotenphase), weil die Achse selbst im 18,6-Jahres-Knotenzyklus um
    // den Ekliptikpol wandert (Cassinis Gesetze). Der hier hinterlegte Pol
    // ist diese Formel bei T = 0 (Epoche J2000) ausgewertet und steht damit
    // FEST — er nähert nur die Lage zu genau diesem Zeitpunkt an, nicht die
    // tatsächliche, langsam wandernde Achse. Dieselbe bewusste Vereinfachung
    // (mittlere/epochenfeste statt zeitveränderlicher Elemente) ist oben für
    // die Bahnelemente dokumentiert.
    // Kontrollrechnung, zweifach: (1) Winkel zur Ekliptiknormale ≈ 1,57°,
    // nahe der bekannten 1,5424°-Cassini-Konstante (Neigung des Mondäquators
    // gegen die Ekliptik). (2) Winkel zur eigenen Bahnnormale (Bahnelemente
    // oben: i = 5,145°, node = 125,0445479°) ergibt 6,72° — der bekannte Wert
    // für die Neigung gegen die eigene Bahn (6,68°). Beide folgen aus
    // Cassinis drittem Gesetz (Ekliptikpol, Bahnpol und Rotationspol liegen
    // auf einem Großkreis, Bahn- und Rotationspol auf entgegengesetzten
    // Seiten): 5,145° + 1,5424° ≈ 6,68°.
    pole: { raDeg: 266.8577, decDeg: 65.6411 },
    rotationAtEpochDeg: 0,
    // NSSDC Moon Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.12,
  },
  appearance: {
    textures: { albedo: 'textures/moon/albedo.jpg' },
    color: '#9c9c9c',
  },
  info: { nameKey: 'body.moon.name' },
};
