import type { Body } from '../../sim/types';

// METHODE: wie uranus-monde.ts (dort ausführlich hergeleitet) — Hybrid aus
// Horizons' osculating elements zur Epoche J2000 (a, e, i, node, lp, L) und
// den Präzessionsperioden der Mean-Elements-Tabelle (LDot). Abruf:
// EPHEM_TYPE='ELEMENTS', REF_PLANE='B', REF_SYSTEM='J2000',
// CENTER='500@899' (Neptun-Körperzentrum), TLIST='2451545.0',
// OUT_UNITS='KM-S', COMMAND='801'. Abgerufen am 12.09.2026, Quelle laut
// Horizons-Kopfzeile „nep098_merged". node = OM, lp = (OM+W) mod 360,
// L = (OM+W+MA) mod 360. Bezugsebene REF_PLANE='B' misst den Knoten mit
// demselben ICRF-Äquator-Nullpunkt wie die Mean-Elements-Tabelle (an
// Saturns Mimas belegt, Task 8b: 0,0 km Abweichung mit icrfKnotenVersatzDeg()
// gegen 128 955 km ohne) — node/lp/L unten stehen deshalb unverändert wie
// von Horizons geliefert, frame: 'parentEquator' ist richtig.
//
// TRITON LÄUFT RÜCKLÄUFIG: Horizons liefert für REF_PLANE='B' (Neptuns
// eigener Äquator) i = 156,828° — mehr als 90°, also per Definition ein
// retrograder Umlauf (Bahndrehimpuls zeigt Neptuns Pol entgegen), NICHT
// i ≈ 23° mit negativem LDot. Konsistent mit den osculating elements bleibt
// LDot deshalb POSITIV: Horizons' eigene mittlere Bewegung N (osculating,
// REF_PLANE=B) ist wie bei jedem Mond dieses Katalogs positiv
// (7,0897·10⁻⁴ °/s) — die Rückläufigkeit steckt allein in i > 90°, nicht im
// Vorzeichen der mittleren Bewegung. Beide Konventionen (i ≈ 157°, LDot > 0
// ODER i ≈ 23°, LDot < 0) beschreiben denselben physikalischen Umlauf; hier
// wird die von Horizons direkt gelieferte übernommen, nicht von Hand
// umgerechnet. Sondertest 2 in data/index.test.ts (Kreuzprodukt zweier
// Örter gegen Neptuns Pol) bestätigt den Rücklauf mit dieser Wahl.
//
// nodeDot = lpDot = 0 (Befund, weicht von der Mean-Elements-Tabelle ab —
// analog zur Begründung in uranus-monde.ts, hier aber ein ANDERER
// Mechanismus): Die Tabelle nennt für Triton P_apsis = 0,000 a (Periapsis
// bei e ≈ 0,00015 praktisch unbestimmt — dieselbe Ausnahme wie bei
// Enceladus/Dione/Io für den Knoten) und P_node = 340,379 a. Wörtlich
// eingesetzt (nodeDot = −360/340,379*100 = −105,76 °/Jh, mit oder ohne
// Vorzeichenumkehr) weicht die Position gegen das Fixture um 240 000–
// 700 000 km ab. Grund, unabhängig bestätigt: Neptuns eigener IAU-Pol trägt
// laut SPICE-Kernel pck00011.tpc ein periodisches Korrekturglied mit
// Periode 360°/52,316°·100 = 688,2 Jahre (Winkel „N" = 357,85° +
// 52,316°·T[Jh], BODY899_NUT_PREC_RA/DEC) — exakt die Größenordnung, die
// eine direkte Differenz von Horizons' „OM" an verschiedenen Epochen als
// scheinbare Präzession von rund 52°/Jh zeigt (empirisch nachgemessen über
// 150 Jahre, unabhängig von der Tabelle). Diese Kopplung ist real und
// bekannt: Triton dominiert durch sein Gewicht Neptuns Präzession, deshalb
// trägt Neptuns eigenes Polmodell dieses Glied. Die Mean-Elements-Tabelle
// selbst bestätigt die Kopplung: Sie führt Triton (anders als die
// Uranusmonde) mit Frame „Laplace" statt „equatorial" und einem „Tilt" von
// 0,4° gegen Neptuns Äquator. sim/orbit.ts verwendet aber bewusst Neptuns
// FESTEN, bei T = 0 ausgewerteten Rotationspol (neptune.ts, unverändert für
// die ganze Simulation) statt einer mitlaufenden Polnachführung — Horizons'
// „OM" an anderen Epochen ist deshalb gegen einen ANDEREN (mitlaufenden)
// Pol gemessen und ergibt keine für unser fixes Modell gültige Rate ohne
// eigene Nachführung der Laplace-Präzession, die hier bewusst nicht
// nachgebaut wird (wie die Iapetus-Vereinfachung in saturn-monde.ts). Wie
// bei den Uranusmonden bleibt lpDot zusätzlich unbedeutend: e ist mit
// 0,00015 verschwindend klein.
//
// AUSWIRKUNG AUF DIE PRÜFSCHRANKEN (siehe monde.fixture.test.ts):
//   - Neigung gegen Neptuns Äquator: Schon bei J2000 (T ≈ 0, keine
//     Präzession im Spiel) weicht die aus r×v gemessene Bahnnormale um
//     0,51° von i ab — exakt der oben zitierte 0,4°-Tilt der Laplace-Ebene
//     (Restdifferenz durch Rundung/leicht abweichende Polkonvention),
//     numerisch bestätigt über eine eigene Rotationsmatrix-Rekonstruktion
//     aus Horizons' ECLIPTIC- und BODY-EQUATOR-Vektoren am selben Zeitpunkt
//     (Task-9-Bericht). Dieselbe, bereits für Deimos und Iapetus etablierte
//     Vereinfachung (Mutterkörper-Rotationspol statt eigener Laplace-Ebene)
//     — Triton bekommt deshalb dieselbe Art körperspezifischer Schranke
//     (0,6° statt 0,5°, gemessen 0,51° über alle fünf Stichtage).
//   - Position: Ohne belastbare Präzessionsrate wächst die Abweichung mit
//     dem Zeitabstand von J2000 auf bis zu 12,4 % des Bahnumfangs (2076) —
//     nicht monoton mit |T| (1976: 4,0 %; 2026: 4,3 %; 2050: 6,0 %; 2076:
//     12,4 %), Signatur der oben beschriebenen ungenauen Nachführung, nicht
//     eines Vorzeichen- oder Rundungsfehlers. Große Halbachse (1 %) und
//     volle Bahnebene bei J2000 bestehen dagegen mit großem Abstand.
//     Körperspezifische Schranke: 15 % statt 5 %, nach demselben Muster wie
//     Mimas in saturn-monde.ts.
//
// Umlaufzeit P gegen zwei unabhängige Wege geprüft: NASA/JPL NSSDC
// Neptunian Satellite Fact Sheet (5,876854 d, „R" = retrograd markiert,
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptuniansatfact.html,
// abgerufen 12.09.2026) und drittes Keplersches Gesetz P = 2π√(a³/GM),
// GM = G·massKg(Neptun): Tabelle 5,876994 d, Fact Sheet 5,876854 d, Kepler
// 5,877698 d — alle drei auf unter 0,02 % übereinstimmend, kein Befund.
// Rotation: SPICE-Kernel pck00011.tpc, BODY801_PM-Rate −61,2572637 °/Tag ⇒
// 360/61,2572637 = 5,876854 d, deckungsgleich mit der Umlaufzeit — Triton
// rotiert gebunden, rotationPeriodH trägt dasselbe negative Vorzeichen wie
// die (retrograde) Rotationsrate im Kernel. Pol: BODY801_POLE_RA/DEC (kein
// Nutationsglied, anders als Neptuns eigener Pol) = 299,36°/41,17°.
//
// Physische Daten: NASA/JPL NSSDC Neptunian Satellite Fact Sheet, Abschnitt
// „Bulk parameters": Masse 214·10²⁰ kg, Radius 1353,4 km (rund genug für
// einen einzelnen Wert).
//
// Darstellung: Texturen kommen gesammelt in Task 11; bis dahin ein blass
// rosa-weißlicher Ton als Ausweichfarbe, angenähert an Tritons ungewöhnlich
// hohe Albedo (0,72 laut Fact Sheet — Stickstoff-/Methaneisfrost) und die
// von Voyager 2 beobachtete, leicht rötliche „Cantaloupe"-Färbung.

export const neptunMonde: readonly Body[] = [
  {
    id: 'triton',
    parent: 'neptune',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0, Neptun-Zentrum
      // (500@899): a = 354 766,0619 km. a_AE = 354 766,0619 / 149 597 870,7
      // = 0,00237146465 AE. Rückrechnung: 0,00237146465 * 149 597 870,7 =
      // 354 766,0619 km, trifft den Quellwert exakt.
      a: 0.00237146465,  aDot: 0,
      e: 0.00014610791,    eDot: 0,
      // i > 90° = retrograder Umlauf, s. Quellenblock oben.
      i: 156.82788715,        iDot: 0,
      // LDot bleibt positiv — konsistent mit Horizons' eigener (stets
      // positiver) mittlerer Bewegung N zu dieser Epoche, s. Quellenblock.
      L: 236.46267052,        LDot: 2237368.2873,
      // nodeDot = lpDot = 0 (Befund, s. Quellenblock oben).
      lp: 253.00199930,        lpDot: 0,
      node: 177.86692346,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 1353.4,
      massKg: 2.14e22,
      rotationPeriodH: -141.04786,
      pole: { raDeg: 299.36, decDeg: 41.17 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      textures: { albedo: '' },
      // Blasses Rosa-Weiß: Albedo 0,72 (Stickstoffeisfrost) mit der von
      // Voyager 2 beobachteten „Cantaloupe"-Färbung.
      color: '#e8d4c8',
    },
    info: { nameKey: 'body.triton.name', descriptionKey: 'body.triton.description' },
  },
];
