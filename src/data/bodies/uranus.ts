import type { Body, RingBand } from '../../sim/types';

/**
 * Die Ringe des Uranus als Messgrößen. Quelle: PDS Ring-Moon Systems Node
 * (SETI Institute / NASA Planetary Data System), "Vital Statistics for
 * Uranus's Rings", https://pds-rings.seti.org/uranus/uranus_rings_table.html,
 * abgerufen am 12.09.2026 — Spalten "Middle Boundary (km)", "Width" und
 * "Optical Depth", Typen "Narrow, dense" bzw. "Broad, diffuse". Für ε gibt
 * die Tabelle 0,5 bis 2,3 an (die Breite schwankt mit der Exzentrizität
 * zwischen 20 und 96 km); genommen ist 1,5, der Mittelwert der
 * Literaturtabelle (de Pater et al. 2013, via Wikipedia "Rings of Uranus").
 * Für λ nennt die Tabelle "~0,1" bei Typ "Narrow, diffuse"; λ ist hier als
 * schmal geführt, weil er im Bild eine Linie und kein Schleier ist.
 *
 * Nicht aufgenommen: die Teilkomponenten ζc, ζcc (innerhalb der
 * Innenkante), α-4, β-α, ηc, δc, λc (Staubbegleiter mit τ ≤ 0,15, in der
 * Darstellungsbreite von ihrem Hauptring verdeckt) sowie ν und μ (außerhalb
 * des Streifens, τ um 10⁻⁵). Die Staubschicht ("dust sheet", 26 840 bis
 * 50 040 km, τ 0,005) ist enthalten und wird am Streifenrand abgeschnitten.
 *
 * Wie aus diesen Zahlen ein Bild wird — und was dabei bewusst nicht
 * maßstäblich ist —, steht in render/ringProfil.ts.
 */
export const URANUS_RINGPROFIL: RingBand[] = [
  { name: 'Staubschicht', radiusKm: 38440, widthKm: 23200, opticalDepth: 0.005, art: 'breit' },
  { name: 'ζ', radiusKm: 39600, widthKm: 3500, opticalDepth: 0.0045, art: 'breit' },
  { name: '6', radiusKm: 41838, widthKm: 1.53, opticalDepth: 0.3, art: 'schmal' },
  { name: '5', radiusKm: 42234, widthKm: 2.28, opticalDepth: 0.5, art: 'schmal' },
  { name: '4', radiusKm: 42571, widthKm: 2.33, opticalDepth: 0.3, art: 'schmal' },
  { name: 'α', radiusKm: 44718, widthKm: 8.46, opticalDepth: 0.4, art: 'schmal' },
  { name: 'β', radiusKm: 45661, widthKm: 9.49, opticalDepth: 0.3, art: 'schmal' },
  { name: 'η', radiusKm: 47176, widthKm: 1.6, opticalDepth: 0.4, art: 'schmal' },
  { name: 'γ', radiusKm: 47627, widthKm: 2.15, opticalDepth: 0.3, art: 'schmal' },
  { name: 'δ', radiusKm: 48300, widthKm: 4.6, opticalDepth: 0.5, art: 'schmal' },
  { name: 'λ', radiusKm: 50024, widthKm: 2.3, opticalDepth: 0.1, art: 'schmal' },
  { name: 'ε', radiusKm: 51149, widthKm: 58.1, opticalDepth: 1.5, art: 'schmal' },
];

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
    // NSSDC Uranus Fact Sheet, Zeile „Geometric albedo", abgerufen 13.09.2026.
    albedo: 0.488,
  },
  appearance: {
    textures: { albedo: 'textures/uranus/albedo.jpg' },
    color: '#9fd9e0',
    // Streifen von der Innenkante des ζ-Rings (37 850 km) bis knapp hinter
    // die Außenkante des ε-Rings (51 178 km), mit Luft für dessen
    // Darstellungsbreite (siehe render/ringProfil.ts): 37 800 bis 51 600 km.
    // Ohne die beiden sehr diffusen äußeren Staubringe ν (67 300 km) und
    // μ (97 700 km), die erst 2003–2005 per Hubble gefunden wurden und mit
    // τ um 10⁻⁵ auch verstärkt unsichtbar blieben.
    // texture: bleibt leer — keine Ringtextur unter einer zum Projekt
    // passenden Lizenz auffindbar (Stand 12.09.2026, Prüfprotokoll in
    // ASSETS.md, Abschnitt "Uranus-Ring"). Stattdessen `profil`: Der
    // Streifen wird aus den Messwerten des PDS Ring-Moon Systems Node
    // gerechnet (siehe URANUS_RINGPROFIL unten).
    rings: { innerKm: 37800, outerKm: 51600, texture: '', profil: URANUS_RINGPROFIL },
  },
  info: { nameKey: 'body.uranus.name' },
};
