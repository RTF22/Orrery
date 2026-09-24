import type { Body } from '../../sim/types';

// Bahnelemente: JPL Solar System Dynamics, „Planetary Satellite Mean Elements",
// Tabelle des Jupitersystems, https://ssd.jpl.nasa.gov/sats/elem/
// Abgerufen am 12.09.2026, Epoche 2000-01-01.5 TDB (= J2000), Ephemeride JUP365
// (R. A. Jacobson, 2021, „The Orbits of the Regular Jovian Satellites and the
// Orientation of the Pole of Jupiter", personal communication to Horizons/NAIF —
// so die Referenzliste derselben Seite). Die Tabelle gibt a in Kilometern, e,
// das Periapsisargument w, die mittlere Anomalie M, die Inklination i, die
// Knotenlänge sowie die Umlaufzeit, jeweils bezogen auf die lokale
// Laplace-Ebene, deren Pol sie mitliefert.
//
// Umrechnung auf das hier verwendete Format, wie bei den Marsmonden:
//   a_AE = a_km / 149 597 870,7
//   lp   = node + w          (Länge der Periapsis)
//   L    = node + w + M      (mittlere Länge)
//   LDot = 36525 / P_tage * 360
//
// Knoten-Nullrichtung: Wie bei den Marsmonden misst die Tabelle node — und
// darauf aufbauend lp und L — laut eigenem Glossar „from the node of the
// reference plane on the ICRF equator", nicht vom Knoten auf der Ekliptik.
// node, lp und L unten stehen deshalb UNVERÄNDERT so, wie die Tabelle sie
// angibt (ICRF-Äquator-Nullpunkt) — nicht von Hand in eine ekliptikale
// Knotenlänge umrechnen. Die Umrechnung passiert zentral und einmalig in
// sim/orbit.ts (icrfKnotenVersatzDeg aus sim/frames.ts, angewendet im
// parentEquator-Zweig von positionAt), damit sie für jeden Mutterkörper mit
// dessen eigenem Pol richtig ausfällt. Siehe Quellenblock in mars-monde.ts
// für die volle Herleitung und den Task-6-Bericht im SDD-Ordner.
//
// BEFUND — die Spalte P (siderische Umlaufzeit) der Tabelle ist für Io und
// Europa nicht plausibel: Sie nennt 1,762732 d (Io) und 3,525463 d (Europa),
// während drei unabhängige Gegenproben übereinstimmend rund 1,769138 d bzw.
// 3,551181 d ergeben — Abweichungen von 9,3 bzw. 36,5 Minuten (0,36 % / 0,72 %),
// weit außerhalb dessen, was eine auf sechs Nachkommastellen angegebene
// „mean element"-Tabelle an Rundungsfehler haben dürfte. Für Ganymed und
// Kallisto weichen Tabelle und Gegenproben dagegen nur um 0,84 bzw. 0,30
// Minuten voneinander ab — im erwarteten Rahmen. Die drei Gegenproben:
//  (1) Kepler dritten Gesetzes mit dem GM des Jupitersystems (Horizons-Abfrage
//      der oskulierenden Elemente, CENTER='500@599'): 2π√(a³/GM) ergibt für Io
//      1,769907 d, für Europa 3,551988 d — nahe an (1), nicht an der Tabelle.
//  (2) direkte Messung: 20 Tage Io- bzw. 28 Tage Europa-Positionsvektoren von
//      Horizons (CENTER='500@599', Schrittweite 1 h/2 h) im Ausgleich der
//      entfalteten ekliptikalen Länge gegen die Zeit ergibt 1,769104 d bzw.
//      3,550798 d.
//  (3) die gebundene Rotation (siehe unten): Aus dem SPICE-Kernel folgt für
//      Io 1,769138 d, für Europa 3,551181 d — Umlaufzeit und Rotationsperiode
//      MÜSSEN bei gebundener Rotation übereinstimmen, und dieser Wert stimmt
//      mit dem NASA/JPL NSSDC Jovian Satellite Fact Sheet bis auf Bruchteile
//      einer Sekunde überein (siehe unten), nicht mit der Elementtabelle.
// Für LDot wird deshalb für alle vier Monde einheitlich die im Fact Sheet
// angegebene sechsstellige siderische Umlaufzeit verwendet, nicht die
// Tabellenspalte P — anders als bei den Marsmonden (dort war die Tabelle nur
// ungenau, hier ist sie für zwei der vier Monde nachweislich falsch):
//   Io 1,769138 d, Europa 3,551181 d, Ganymed 7,154553 d, Kallisto 16,689017 d
//   (https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html,
//   Abschnitt „Orbital parameters", abgerufen am 12.09.2026).
// a, e, w, M, i, node sowie die Präzessionsperioden stammen weiterhin
// unverändert aus der Elementtabelle — nur ihre P-Spalte bleibt unbenutzt.
//
// Kontrollrechnung der gebundenen Rotation (siehe auch physical unten): Aus
// dem SPICE-Kernel pck00011.tpc folgt die Rotationsrate direkt als
// 360°/Wdot. Für alle vier Monde stimmt das bis auf unter eine Sekunde mit
// der oben verwendeten Fact-Sheet-Umlaufzeit überein — genau das erwartete
// Bild einer gebundenen Rotation, und ein weiterer, vom Fact Sheet
// unabhängiger Beleg für dessen Umlaufzeiten gegenüber der Tabellenspalte P.
//
// Präzessionsraten aus den Tabellenspalten „periapsis precession period"
// (P_apsis) und „node precession period" (P_node), je Mond:
//   Io:       P_apsis = 1,333 a,   P_node = 0,000 a
//   Europa:   P_apsis = 1,394 a,   P_node = 30,202 a
//   Ganymed:  P_apsis = 68,301 a,  P_node = 137,812 a
//   Kallisto: P_apsis = 277,921 a, P_node = 577,264 a
// Daraus (wie bei den Marsmonden): nodeDot = -360 / P_node * 100,
// lpDot = (360 / P_apsis - 360 / P_node) * 100 [°/Jh]. Io ist dabei der
// Sonderfall: Die Tabelle nennt i = 0,0° und node = 0,0° — bei praktisch
// verschwindender Inklination ist der Knoten (die Schnittlinie von Bahn- und
// Bezugsebene) geometrisch nicht bestimmbar, ganz analog zu Deimos' bei e = 0
// unbestimmter Periapsis in mars-monde.ts. Die Tabelle drückt das mit
// P_node = 0,000 a aus (keine sinnvolle Präzessionsperiode für eine
// unbestimmte Richtung); nodeDot wird deshalb, demselben Muster folgend, auf
// 0 gesetzt statt über die Formel (die durch 0 teilen würde). Anders als bei
// Deimos ist das hier sogar folgenlos: Bei i = 0 kürzt sich node in der
// Rechnung von positionInParentFrame (orbit.ts) vollständig heraus — nur die
// Summe node + w = lp bestimmt die Position (siehe Herleitung im
// Task-7-Bericht) —, node und nodeDot sind also unabhängig vom gewählten Wert
// physikalisch wirkungslos für Io.
//
// Bezugsebene: Die Elemente gelten für die Laplace-Ebene, wir rechnen sie in
// der Jupiteräquatorebene ('parentEquator', Pol aus jupiter.ts: 268,057° /
// 64,495°). Die Tabelle gibt für jeden Mond auch seinen eigenen Laplace-Pol
// und den „tilt angle" zur Jupiteräquatorebene an:
//   Io:       268,1° / 64,5°, tilt 0,0° (Abweichung zum hinterlegten
//             Jupiterpol nachgerechnet: 0,019°)
//   Europa:   268,1° / 64,5°, tilt 0,0° (dieselbe Abweichung: 0,019°)
//   Ganymed:  268,2° / 64,6°, tilt 0,1° (nachgerechnet: 0,122°)
//   Kallisto: 268,7° / 64,8°, tilt 0,4° (nachgerechnet: 0,411°) — der in der
//             Aufgabenstellung erwartete „merkliche Wert": Kallistos
//             Bahnebene ist hier um bis zu 0,4° falsch orientiert. Das ist,
//             genau wie bei Deimos, bewusst in Kauf genommen (eigene
//             Bezugsebene je Mond wäre für einen Effekt unterhalb der
//             Strichstärke einer Bahnlinie eingeführt) und schlägt sich in
//             einer eigenen, weiteren Fixture-Schranke für Kallisto nieder
//             (siehe monde.fixture.test.ts).
//
// Physische Daten (Radius, Masse): NASA/JPL NSSDC, Jovian Satellite Fact
// Sheet, Abschnitt „Bulk parameters"
// (https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html,
// abgerufen am 12.09.2026). Rotationsperioden aus den IAU-Rotationselementen
// (SPICE-Kernel pck00011.tpc, BODY501_PM…BODY504_PM): 203,4889538 °/d,
// 101,3747235 °/d, 50,3176081 °/d, 21,5710715 °/d, also 360°/Rate. Alle vier
// Monde rotieren gebunden — siehe die Kontrollrechnung oben.
//
// Pollagen: IAU-Rotationselemente (derselbe Kernel), ausgewertet bei T = 0,
// also zur Epoche J2000 (BODY501_POLE_RA/DEC … BODY504_POLE_RA/DEC). Wie beim
// Erdmond und den Marsmonden ist die Formel zeitabhängig und der hinterlegte
// Pol steht fest; er nähert die Lage zu genau diesem Zeitpunkt an. Die Pole
// liegen nahe am Jupiterpol (s. o.) — nach IAU-Konvention die Normale der
// jeweiligen mittleren Bahnebene bei gebundener Rotation.
//
// Kontrollrechnung der Bahnradien (Umkehrung der Umrechnung oben):
//   Io       421 800 km, Umlauf 1,769138 d
//   Europa   671 100 km, Umlauf 3,551181 d — rund das Doppelte von Io
//            (Laplace-Resonanz, siehe Sondertest in data/index.test.ts).
//   Ganymed 1 070 400 km, Umlauf 7,154553 d — rund das Vierfache von Io;
//            mit 2631,2 km Radius größer als Merkur (2439,7 km).
//   Kallisto 1 882 700 km, Umlauf 16,689017 d — außerhalb der Resonanzkette.
// Das Fact Sheet nennt dieselben a-Werte (421,8 / 671,1 / 1070,4 / 1882,7,
// jeweils ×1000 km) unabhängig noch einmal, exakt übereinstimmend.
//
// Darstellung: Texturen seit Task 11 gesetzt (USGS/NASA-Mosaike, siehe
// ASSETS.md); die Ausweichfarben bleiben als Rückfallebene für die Ladezeit
// und einen möglichen Fehlschlag bestehen, angenähert an die bekannte
// Farbgebung (schwefelgelb bei Io, eisig-blass bei Europa, gräulich-braun
// bei Ganymed und Kallisto, Kallisto am dunkelsten).

export const jupiterMonde: readonly Body[] = [
  {
    id: 'io',
    parent: 'jupiter',
    kind: 'moon',
    orbit: {
      // a_AE = 421 800 km / 149 597 870,7 km/AE = 0,0028195588 AE.
      // Rückrechnung: 0,0028195588 * 149 597 870,7 = 421 799,9928 km, trifft
      // den Tabellenwert 421 800 km auf 0,0072 km.
      a: 0.0028195588,    aDot: 0,
      e: 0.004,            eDot: 0,
      // i = 0,0° und node = 0,0° stehen so in der Tabelle — siehe Kommentar
      // oben zum Sonderfall Io: Der Knoten ist bei dieser Inklination nicht
      // bestimmbar, aber im Modell (i = 0) auch wirkungslos.
      i: 0.0,               iDot: 0,
      L: 20.0,               LDot: 7432433.196280,
      lp: 49.1,              lpDot: 27006.7517,
      node: 0.0,             nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 1821.5,
      massKg: 8.932e22,
      rotationPeriodH: 42.45931,
      pole: { raDeg: 268.05, decDeg: 64.50 },
      // Wie bei allen Körpern dieses Katalogs bleibt die Rotationsphase zur
      // Epoche bei 0 (siehe mars-monde.ts für die Begründung).
      rotationAtEpochDeg: 0,
      // NSSDC Jovian Satellite Fact Sheet, Zeile „Visual geometric albedo",
      // abgerufen 13.09.2026.
      albedo: 0.62,
    },
    appearance: {
      color: '#d8c257',
    },
    info: { nameKey: 'body.io.name' },
  },
  {
    id: 'europa',
    parent: 'jupiter',
    kind: 'moon',
    orbit: {
      // a_AE = 671 100 km / 149 597 870,7 km/AE = 0,0044860264 AE.
      // Rückrechnung: 0,0044860264 * 149 597 870,7 = 671 099,9973 km, trifft
      // den Tabellenwert 671 100 km auf 0,0027 km.
      a: 0.0044860264,    aDot: 0,
      e: 0.009,             eDot: 0,
      i: 0.5,                iDot: 0,
      L: 214.4,               LDot: 3702711.858393,
      lp: 229.0,               lpDot: 24632.9901,
      node: 184.0,             nodeDot: -1191.9740,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 1560.8,
      massKg: 4.800e22,
      rotationPeriodH: 85.22835,
      pole: { raDeg: 268.08, decDeg: 64.51 },
      rotationAtEpochDeg: 0,
      // NSSDC Jovian Satellite Fact Sheet, Zeile „Visual geometric albedo",
      // abgerufen 13.09.2026.
      albedo: 0.68,
    },
    appearance: {
      color: '#d9cdb0',
    },
    info: { nameKey: 'body.europa.name' },
  },
  {
    id: 'ganymede',
    parent: 'jupiter',
    kind: 'moon',
    orbit: {
      // a_AE = 1 070 400 km / 149 597 870,7 km/AE = 0,0071551821 AE.
      // Rückrechnung: 0,0071551821 * 149 597 870,7 = 1 070 400,0066 km,
      // trifft den Tabellenwert 1 070 400 km auf 0,0066 km.
      a: 0.0071551821,    aDot: 0,
      e: 0.001,             eDot: 0,
      i: 0.2,                iDot: 0,
      L: 221.6,               LDot: 1837850.666562,
      lp: 256.8,               lpDot: 265.8532,
      node: 58.5,               nodeDot: -261.2254,
      frame: 'parentEquator',
    },
    physical: {
      // 2631,2 km — größer als Merkur (2439,7 km), der größte Mond im
      // Sonnensystem.
      radiusKm: 2631.2,
      massKg: 1.4819e23,
      rotationPeriodH: 171.70927,
      pole: { raDeg: 268.20, decDeg: 64.57 },
      rotationAtEpochDeg: 0,
      // NSSDC Jovian Satellite Fact Sheet, Zeile „Visual geometric albedo",
      // abgerufen 13.09.2026.
      albedo: 0.44,
    },
    appearance: {
      color: '#8a8175',
    },
    info: { nameKey: 'body.ganymede.name' },
  },
  {
    id: 'callisto',
    parent: 'jupiter',
    kind: 'moon',
    orbit: {
      // a_AE = 1 882 700 km / 149 597 870,7 km/AE = 0,0125850722 AE.
      // Rückrechnung: 0,0125850722 * 149 597 870,7 = 1 882 700,0037 km,
      // trifft den Tabellenwert 1 882 700 km auf 0,0037 km.
      a: 0.0125850722,    aDot: 0,
      e: 0.007,             eDot: 0,
      i: 0.3,                iDot: 0,
      L: 80.3,               LDot: 787883.432559,
      lp: 352.9,              lpDot: 67.1701,
      node: 309.1,             nodeDot: -62.3631,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 2410.3,
      massKg: 1.0759e23,
      rotationPeriodH: 400.53643,
      pole: { raDeg: 268.72, decDeg: 64.83 },
      rotationAtEpochDeg: 0,
      // NSSDC Jovian Satellite Fact Sheet, Zeile „Visual geometric albedo",
      // abgerufen 13.09.2026.
      albedo: 0.19,
    },
    appearance: {
      color: '#5f564c',
    },
    info: { nameKey: 'body.callisto.name' },
  },
];
