import type { Body } from '../../sim/types';

// Bahnelemente: JPL Solar System Dynamics, „Planetary Satellite Mean Elements",
// Tabelle des Marssystems, https://ssd.jpl.nasa.gov/sats/elem/
// Abgerufen am 12.09.2026, Epoche 2000-01-01.5 TDB (= J2000), Ephemeride MAR099.
// Die Tabelle gibt a in Kilometern, e, das Periapsisargument w, die mittlere
// Anomalie M, die Inklination i, die Knotenlänge sowie die Umlaufzeit, jeweils
// bezogen auf die lokale Laplace-Ebene, deren Pol sie mitliefert.
//
// Umrechnung auf das hier verwendete Format:
//   a_AE = a_km / 149 597 870,7
//   lp   = node + w          (Länge der Periapsis)
//   L    = node + w + M      (mittlere Länge)
//   LDot = 36525 / P_tage * 360
//
// Knoten-Nullrichtung: Die Tabelle misst node — und darauf aufbauend lp und
// L — laut eigenem Glossar „from the node of the reference plane on the
// ICRF equator", nicht vom Knoten auf der Ekliptik. node, lp und L unten
// stehen deshalb UNVERÄNDERT so, wie die Tabelle sie angibt (ICRF-Äquator-
// Nullpunkt) — sie NICHT von Hand in eine ekliptikale Knotenlänge
// umzurechnen. Die Umrechnung passiert zentral und einmalig in
// sim/orbit.ts (icrfKnotenVersatzDeg aus sim/frames.ts, angewendet im
// parentEquator-Zweig von positionAt), damit sie für jeden Mutterkörper mit
// dessen eigenem Pol richtig ausfällt und nicht in jedem Mond-Datensatz neu
// von Hand nachgerechnet werden muss. Siehe Task-6-Bericht im SDD-Ordner
// für Herleitung und Kontrollwert (Marspol: −40,858°).
//
// Für P wird die sechsstellige siderische Umlaufzeit aus dem NASA/JPL NSSDC
// Mars Fact Sheet genommen (0,31891 d und 1,26244 d), nicht die auf vier
// Stellen gerundete Angabe der Elementtabelle (0,3187 d / 1,2625 d): Deren
// vierte Stelle weicht um rund 0,07 % ab, was sich über Jahrzehnte zu einer
// sichtbaren Phasenverschiebung aufsummieren würde. Die Fact-Sheet-Werte
// decken sich mit der aus a und GM(Mars) nachgerechneten Periode.
//
// Präzessionsraten aus denselben Tabellenspalten („periapsis precession
// period", „node precession period"): Der Knoten läuft rückläufig um, die
// Periapsis rechtläufig. Für Phobos folgt aus 1,1 a bzw. 2,3 a
//   nodeDot = -360 / 2,3 * 100 = -15 652 °/Jh.
//   lpDot   = (+360 / 1,1 - 360 / 2,3) * 100 = +17 075 °/Jh.
// Kontrollrechnung: Bei einem abgeplatteten Zentralkörper und kleiner
// Inklination gilt theoretisch w-Punkt = -2 * Knoten-Punkt; 2,3 / 2 = 1,15
// trifft die angegebenen 1,1 a — die beiden Spalten sind also konsistent und
// im obigen Sinn gelesen.
//
// Für Deimos nennt dieselbe Spalte „node precession period" 56,2 a; daraus
// folgt
//   nodeDot = -360 / 56,2 * 100 = -640,5694 °/Jh.
// Eine Periapsis-Präzessionsperiode führt die Tabelle für Deimos dagegen
// nicht: Dort steht 0,0 a, weil e = 0,000 die Periapsis unbestimmt macht (bei
// einer exakten Kreisbahn hat sie keine Lage, die präzedieren könnte). lpDot
// bleibt deshalb 0, lp läuft mit dem Knoten mit — siehe auch den
// Feldkommentar bei e weiter unten.
//
// Bezugsebene: Die Elemente gelten für die Laplace-Ebene, wir rechnen sie in
// der Marsäquatorebene ('parentEquator', Pol aus mars.ts). Für Phobos ist das
// exakt dasselbe — die Tabelle gibt seinen Laplace-Pol mit 317,7° / 52,9° an,
// also den Marspol, und die Spalte „tilt angle" entsprechend mit 0,0°
// (Abweichung zum hinterlegten Marspol: 0,018°). Für Deimos steht dort
// 316,6° / 53,5° und ein Neigungswinkel von 0,9°; seine Bahnebene ist hier
// also um bis zu 0,9° falsch orientiert. Das ist bewusst in Kauf genommen:
// Eine eigene Bezugsebene je Mond wäre für einen Effekt unterhalb der
// Strichstärke einer Bahnlinie eingeführt.
//
// Physische Daten (Radius, Masse): NASA/JPL NSSDC, Mars Fact Sheet,
// Abschnitt „Martian Moons". Rotationsperioden aus den IAU-Rotationselementen
// (SPICE-Kernel pck00011.tpc, BODY401_PM / BODY402_PM): 1128,84475928 °/d und
// 285,16188899 °/d, also 360°/Rate. Beide Monde rotieren gebunden — die
// Periode stimmt daher mit der Umlaufzeit überein, was als Kontrollrechnung
// dient: 7,65384 h = 0,318910 d und 30,29858 h = 1,262441 d.
//
// Pollagen: IAU-Rotationselemente 2015 (derselbe Kernel), ausgewertet bei
// T = 0, also zur Epoche J2000. Wie beim Erdmond sind die Formeln
// zeitabhängig — hier mit vier bzw. fünf periodischen Gliedern — und der
// hinterlegte Pol steht fest; er nähert die Lage zu genau diesem Zeitpunkt an.
// Nach IAU-Konvention ist der Pol eines gebunden rotierenden Mondes die
// Normale seiner mittleren Bahnebene, weshalb er nahe am Marspol liegt.
//
// Kontrollrechnung der Bahnradien (Umkehrung der Umrechnung oben):
//   Phobos  9375 km, Umlauf 0,31891 d  — schneller als Mars rotiert (24,6229 h
//           = 1,0260 d), er geht von Mars aus gesehen also im Westen auf.
//   Deimos 23 457 km, Umlauf 1,26244 d — knapp außerhalb der synchronen Bahn.
// Das Mars Fact Sheet nennt unabhängig 9378 km und 23 459 km.
//
// Darstellung: Phobos' Bahnradius beträgt nur das 2,766-fache des Marsradius.
// Bei überhöhter Körpergröße (sizeScale 200 im Preset „Kompakt") liegt seine
// Bahn damit INNERHALB der dargestellten Marskugel. Das ist kein Fehler im
// Datensatz, sondern die unvermeidliche Folge der Größenüberhöhung — bitte
// nicht „korrigieren", sondern bei Bedarf am Maßstab drehen.

export const marsMonde: readonly Body[] = [
  {
    id: 'phobos',
    parent: 'mars',
    kind: 'moon',
    orbit: {
      // a_AE = 9375 km / 149 597 870,7 km/AE = 0,00006266800 AE.
      // Rückrechnung: 0,00006266800 * 149 597 870,7 = 9374,9994 km, trifft
      // den Tabellenwert 9375 km auf 0,0006 km.
      a: 0.00006266800,   aDot: 0,
      e: 0.015,           eDot: 0,
      i: 1.1,             iDot: 0,
      L: 215.2,           LDot: 41231068.326487,
      lp: 25.5,           lpDot: 17075.0988,
      node: 169.2,        nodeDot: -15652.1739,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 11.1,
      massKg: 1.06e16,
      rotationPeriodH: 7.65384,
      pole: { raDeg: 318.01287, decDeg: 53.94541 },
      // Wie bei allen Körpern dieses Katalogs bleibt die Rotationsphase zur
      // Epoche bei 0. Der IAU-Wert wäre W₀ = 35,18774440°; ihn einzutragen
      // hätte erst Sinn, wenn die Darstellung den IAU-Nullmeridian überhaupt
      // als Bezug nimmt. Solange sie das nicht tut, wäre die Zahl eine
      // Genauigkeit, die es nicht gibt.
      rotationAtEpochDeg: 0,
      // NSSDC Mars Fact Sheet, Abschnitt „Satellites of Mars", Zeile
      // „Geometric albedo", abgerufen 13.09.2026.
      albedo: 0.07,
    },
    appearance: {
      // Textur seit Task 11 gesetzt (Viking-Mosaik, siehe ASSETS.md); die
      // Ausweichfarbe bleibt als Rückfallebene bestehen (dunkles,
      // rötlich-graues Regolith).
      textures: { albedo: 'textures/phobos/albedo.jpg' },
      color: '#6b6259',
    },
    info: { nameKey: 'body.phobos.name', descriptionKey: 'body.phobos.description' },
  },
  {
    id: 'deimos',
    parent: 'mars',
    kind: 'moon',
    orbit: {
      // a_AE = 23 457 km / 149 597 870,7 km/AE = 0,00015680036 AE.
      // Rückrechnung: 0,00015680036 * 149 597 870,7 = 23 457,0000 km, trifft
      // den Tabellenwert 23 457 km auf unter 0,0001 km.
      a: 0.00015680036,   aDot: 0,
      // e = 0,000 steht so in der Tabelle; die Bahn ist auf drei Stellen
      // kreisförmig. Damit ist die Periapsis ohne Bedeutung, weshalb die
      // Tabelle auch w = 0,0 und eine Präzessionsperiode von 0,0 a führt.
      // lp und lpDot bleiben entsprechend beim Knoten bzw. bei null.
      e: 0.000,           eDot: 0,
      i: 1.8,             iDot: 0,
      L: 259.3,           LDot: 10415544.501125,
      lp: 54.3,           lpDot: 0,
      node: 54.3,         nodeDot: -640.5694,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 6.2,
      massKg: 2.4e15,
      rotationPeriodH: 30.29858,
      pole: { raDeg: 319.03714, decDeg: 52.46339 },
      // Siehe Phobos; der IAU-Wert wäre hier W₀ = 79,39932954°.
      rotationAtEpochDeg: 0,
      // NSSDC Mars Fact Sheet, Abschnitt „Satellites of Mars", Zeile
      // „Geometric albedo", abgerufen 13.09.2026.
      albedo: 0.08,
    },
    appearance: {
      // Task 11 fand keine amtliche USGS-/NASA-Globalkarte für Deimos (nur
      // eine nicht-amtliche Fan-Rekonstruktion, siehe ASSETS.md) — die
      // Ausweichfarbe trägt den Körper deshalb dauerhaft (dunkles,
      // rötlich-graues Regolith, wie Phobos).
      textures: { albedo: '' },
      color: '#7a7067',
    },
    info: { nameKey: 'body.deimos.name', descriptionKey: 'body.deimos.description' },
  },
];
