import type { Body } from '../../sim/types';

// METHODE (wie saturn-monde.ts, dort ausführlich hergeleitet — Task 8b):
// JPLs „Planetary Satellite Mean Elements" (https://ssd.jpl.nasa.gov/sats/elem/)
// geben die Phasenlage der Monde nicht zuverlässig wieder. Deshalb ein
// HYBRID aus zwei Quellen:
//   a, e, i, node, lp, L — aus Horizons' OSCULATING ELEMENTS zur Epoche
//     J2000 (JD 2451545.0, 2000-01-01 12:00 TDB), EPHEM_TYPE='ELEMENTS',
//     REF_PLANE='B' (Kurzform für BODY EQUATOR — die ausgeschriebene Form
//     scheitert am URL-Parser), REF_SYSTEM='J2000', CENTER='500@799'
//     (Uranus-Körperzentrum), OUT_UNITS='KM-S', COMMAND='701'…'705'.
//     Abgerufen am 12.09.2026, Quelle laut Horizons-Kopfzeile „ura184_merged".
//     node = OM, lp = (OM + W) mod 360, L = (OM + W + MA) mod 360.
//   nodeDot, lpDot — s. u. (eigener Befund, weicht vom Saturn-Vorgehen ab).
//   LDot — 36525 / P_Tage * 360, P aus der Mean-Elements-Tabelle, gegen das
//     NSSDC Uranian Satellite Fact Sheet UND Kepler drittem Gesetz geprüft
//     (s. u.) — bei allen fünf Monden ohne Befund (< 0,04 % Abweichung).
//   aDot, eDot, iDot — bleiben 0.
//
// Warum nicht zirkulär: Elemente stammen von GENAU EINER Epoche (J2000),
// das Fixture prüft gegen VIER weitere, bis zu 76 Jahre entfernte Stichtage
// (1976/2026/2050/2076) — siehe monde.fixture.test.ts.
//
// BEZUGSEBENE: REF_PLANE='B' misst den Knoten mit demselben ICRF-Äquator-
// Nullpunkt wie die Mean-Elements-Tabelle (an Saturns Mimas empirisch
// belegt, Task 8b: 0,0 km Abweichung MIT icrfKnotenVersatzDeg() gegen
// 128 955 km ohne) — der Versatz-Apparat in sim/orbit.ts gilt unverändert,
// node/lp/L unten stehen deshalb UNVERÄNDERT wie von Horizons geliefert.
//
// URANUS LIEGT: Sein Pol (physical.pole unten identisch mit uranus.ts,
// 257,311°/−15,175°) ist derselbe, den Horizons für REF_PLANE='B' nutzt.
// Die Uranusmonde laufen fast exakt in seiner Äquatorebene UND prograd mit
// seiner (nach IAU-Konvention retrograden) Rotation — deshalb liefert
// Horizons für alle fünf i ≈ 180° (179,81°…180,00°) statt i ≈ 0°: Die
// Bahndrehimpulse zeigen der offiziellen Polrichtung entgegen, exakt wie
// Uranus' eigene (negative) Rotationsperiode es für seine Rotationsachse
// bereits ausdrückt. Das ist kein Fehler, sondern dieselbe Konvention
// konsequent auf die Monde angewendet — und der Fall, für den poleVector()/
// icrfKnotenVersatzDeg() gebaut wurden (erster Praxistest mit realen Daten
// abseits kleiner i). Sondertest in data/index.test.ts weist das nach.
//
// BEFUND — nodeDot NICHT aus der Mean-Elements-Tabelle: Wörtlich nach
// Vorgabe eingesetzt (nodeDot = −360/P_Knoten*100, lpDot = Differenzformel)
// weicht die Position gegen das Fixture (monde-horizons.json) für vier der
// fünf Monde um 90 000–1 165 000 km ab (weit über der 5-%-Schranke,
// Umbriel/Titania/Oberon sogar mit falschem Vorzeichen der Abweichung je
// nach Zeitrichtung — kein Rundungsfehler, sondern eine falsche Rate).
// Ursache: Bei i ≈ 180° ist der Knoten (Schnittlinie zur Äquatorebene)
// numerisch entartet — dieselbe Situation wie Io/Enceladus/Dione bei i ≈ 0°
// (siehe jupiter-monde.ts, saturn-monde.ts), hier nur am ANDEREN Pol der
// Kugel. Horizons' „OM" ist für alle fünf Monde bei i so nah an 180°
// (0,003°–0,19° Abstand) numerisch instabil — eine 40-Jahres-Zeitreihe der
// osculating elements zeigt für Ariel/Umbriel/Titania/Oberon keinen
// glatten, sondern einen chaotisch wirkenden OM-Verlauf ohne belastbaren
// linearen Trend. Gegenprobe gegen das Fixture (fünf Horizons-
// Vektor-Stichtage, s. u.): nodeDot = 0 (Knoten eingefroren, wie bei Io/
// Enceladus/Dione) schlägt JEDE getestete Variante der Tabellenformel
// (beide Vorzeichen, mehrere Präzessionsperioden) deutlich — größte
// Abweichung damit nur noch 15 359 km (Miranda) statt >100 000 km. lpDot
// bleibt aus der Tabelle (unverändert, Standardformel): Bei den hier
// vorliegenden kleinen Exzentrizitäten (0,0006–0,0042) kürzt sich lp in der
// Positionsformel weitgehend heraus (omega + M = L − node bei e → 0), sein
// Beitrag zur Positionsabweichung liegt für alle fünf Monde unter 3 000 km,
// unabhängig vom genauen lpDot-Wert. Miranda bekam wegen seiner deutlich
// geneigten Bahn (s. u.) besondere Aufmerksamkeit — auch dort bestätigt
// sich nodeDot = 0 als klar beste, unter allen getesteten Alternativen
// robuste Wahl. Volle Zahlen: Task-9-Bericht im SDD-Ordner.
//
// Präzessionsperioden (Mean-Elements-Tabelle, für lpDot; nodeDot s. o.):
//   Miranda P_apsis=8,939a; Ariel P_apsis=28,901a; Umbriel P_apsis=64,126a;
//   Titania P_apsis=579,928a; Oberon P_apsis=158,604a. lpDot = 360/P_apsis*100
//   (der Knotenterm entfällt, da nodeDot = 0 gesetzt ist).
//
// Umlaufzeiten P gegen zwei unabhängige Wege geprüft, bevor sie für LDot
// verwendet wurden: NASA/JPL NSSDC Uranian Satellite Fact Sheet
// (https://nssdc.gsfc.nasa.gov/planetary/factsheet/uraniansatfact.html,
// abgerufen 12.09.2026) UND drittes Keplersches Gesetz P = 2π√(a³/GM),
// GM = G·massKg(Uranus), G = 6,67430e-11 m³kg⁻¹s⁻²:
//   Miranda: Tabelle 1,413479 d, Fact Sheet 1,413479 d, Kepler 1,413995 d
//            (Δ 0,0365 %).
//   Ariel:   Tabelle 2,520379 d, Fact Sheet 2,520379 d, Kepler 2,520727 d
//            (Δ 0,0138 %).
//   Umbriel: Tabelle 4,144177 d, Fact Sheet 4,144176 d, Kepler 4,145035 d
//            (Δ 0,0207 %).
//   Titania: Tabelle 8,705869 d, Fact Sheet 8,705867 d, Kepler 8,706483 d
//            (Δ 0,0071 %).
//   Oberon:  Tabelle 13,463237 d, Fact Sheet 13,463234 d, Kepler 13,467684 d
//            (Δ 0,0330 %).
// Alle drei Wege stimmen auf unter 0,04 % überein — anders als bei Io/Europa
// (jupiter-monde.ts) hier KEIN Befund; die Tabellenspalte P ist brauchbar.
// Rotation und Pollagen: IAU-Rotationselemente, SPICE-Kernel
// https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00011.tpc,
// BODY701…BODY705 (Pol konstant, keine Nutationsglieder). Alle fünf Monde
// rotieren gebunden: Aus BODY70x_PM (Rate in °/Tag) folgt 360°/Rate exakt
// die oben genannte Umlaufzeit (z. B. Ariel: 360/142,8356681 = 2,520378 d).
// rotationPeriodH führt deshalb dasselbe negative Vorzeichen wie Uranus'
// eigene Rotation (BODY70x_PM-Rate ist für alle fünf negativ, konsistent
// mit prograder Rotation relativ zu Uranus' Spin, aber „rückläufig" nach
// der hier durchgehend verwendeten Polkonvention).
//
// Physische Daten (Radius, Masse): NASA/JPL NSSDC Uranian Satellite Fact
// Sheet, Abschnitt „Bulk parameters", abgerufen 12.09.2026. Miranda und
// Ariel führt die Quelle als dreiachsiges Ellipsoid; radiusKm ist das
// geometrische Mittel (a·b·c)^(1/3), der volumengleiche Kugelradius:
//   Miranda 240×234,2×232,9 → 235,68 km; Ariel 581,1×577,9×577,7 → 578,90 km.
// Umbriel (584,7 km), Titania (788,9 km) und Oberon (761,4 km) sind rund
// genug für einen einzelnen Wert. Massen direkt aus derselben Tabelle
// (Spalte „Mass", in 10²⁰ kg).
//
// Darstellung: Texturen kommen gesammelt in Task 11; bis dahin tragen
// Ausweichfarben die Körper, angenähert an die bekannte Farbgebung nach
// Fact-Sheet-Albedo (Miranda 0,32 mittelhelles Eisgrau mit auffälliger,
// stark zerklüfteter Oberfläche; Ariel 0,39 hellstes Eisgrau der fünf;
// Umbriel 0,21 dunkelstes; Titania 0,27 und Oberon 0,23 mittleres, bei
// Oberon leicht rötlich getöntes Grau nach seiner rötlicheren Oberfläche).

export const uranusMonde: readonly Body[] = [
  {
    id: 'miranda',
    parent: 'uranus',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0, Uranus-Zentrum
      // (500@799): a = 129 871,7551 km. a_AE = 129 871,7551 / 149 597 870,7
      // = 0,00086813906 AE. Rückrechnung: 0,00086813906 * 149 597 870,7 =
      // 129 871,7551 km, trifft den Quellwert exakt.
      a: 0.00086813906,  aDot: 0,
      e: 0.00150979857,    eDot: 0,
      // i = 175,572° — mit rund 4,43° Abstand von 180° die mit Abstand am
      // stärksten geneigte Bahn der fünf großen Uranusmonde (Fact Sheet:
      // 4,34° gegen Uranus' Äquator — der bekannte, „stark geneigte" Fall,
      // den der Task-9-Sondertest 1 in data/index.test.ts gesondert prüft).
      i: 175.57223392,        iDot: 0,
      L: 305.90618881,        LDot: 9302578.9559,
      // nodeDot = 0 (Befund, s. Quellenblock oben — NICHT aus der Tabelle).
      lp: 243.84429762,        lpDot: 2003.3460,
      node: 259.17128712,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 235.68,
      massKg: 6.6e19,
      rotationPeriodH: -33.92350,
      pole: { raDeg: 257.43, decDeg: -15.08 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      textures: { albedo: '' },
      // Mittelhelles Eisgrau, Albedo 0,32 laut Fact Sheet.
      color: '#a8a5a0',
    },
    info: { nameKey: 'body.miranda.name', descriptionKey: 'body.miranda.description' },
  },
  {
    id: 'ariel',
    parent: 'uranus',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 190 941,3470 km.
      // a_AE = 190 941,3470 / 149 597 870,7 = 0,00127636407 AE. Rückrechnung:
      // 0,00127636407 * 149 597 870,7 = 190 941,3470 km, exakt.
      a: 0.00127636407,  aDot: 0,
      e: 0.00152081233,    eDot: 0,
      // i = 179,997° — nur 0,003° von 180° entfernt: praktisch exakt in
      // Uranus' Äquatorebene, s. Quellenblock oben.
      i: 179.99727931,        iDot: 0,
      L: 324.45273405,        LDot: 5217072.5117,
      lp: 171.65836580,        lpDot: 1245.6316,
      node: 150.62142797,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 578.90,
      massKg: 1.29e21,
      rotationPeriodH: -60.48910,
      pole: { raDeg: 257.43, decDeg: -15.10 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      textures: { albedo: '' },
      // Hellstes Eisgrau der fünf großen Uranusmonde, Albedo 0,39.
      color: '#c7c3ba',
    },
    info: { nameKey: 'body.ariel.name', descriptionKey: 'body.ariel.description' },
  },
  {
    id: 'umbriel',
    parent: 'uranus',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 266 012,1887 km.
      // a_AE = 266 012,1887 / 149 597 870,7 = 0,00177818165 AE. Rückrechnung:
      // 0,00177818165 * 149 597 870,7 = 266 012,1887 km, exakt.
      a: 0.00177818165,  aDot: 0,
      e: 0.00417016515,    eDot: 0,
      i: 179.94363618,        iDot: 0,
      L: 43.93221034,          LDot: 3172885.7141,
      lp: 132.70883139,        lpDot: 283.9274,
      node: 166.34870446,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 584.7,
      massKg: 1.22e21,
      rotationPeriodH: -99.46025,
      pole: { raDeg: 257.43, decDeg: -15.10 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      textures: { albedo: '' },
      // Dunkelstes der fünf großen Uranusmonde, Albedo nur 0,21.
      color: '#6b6560',
    },
    info: { nameKey: 'body.umbriel.name', descriptionKey: 'body.umbriel.description' },
  },
  {
    id: 'titania',
    parent: 'uranus',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 436 292,6756 km.
      // a_AE = 436 292,6756 / 149 597 870,7 = 0,00291643640 AE. Rückrechnung:
      // 0,00291643640 * 149 597 870,7 = 436 292,6756 km, exakt.
      a: 0.00291643640,  aDot: 0,
      e: 0.00247900032,    eDot: 0,
      i: 179.89928411,        iDot: 0,
      L: 124.46886372,        LDot: 1510360.4247,
      lp: 50.05208818,        lpDot: 40.1875,
      node: 11.43639861,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 788.9,
      massKg: 3.42e21,
      rotationPeriodH: -208.94086,
      pole: { raDeg: 257.43, decDeg: -15.10 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      textures: { albedo: '' },
      // Mittleres Eisgrau, Albedo 0,27 — größter Uranusmond.
      color: '#948e84',
    },
    info: { nameKey: 'body.titania.name', descriptionKey: 'body.titania.description' },
  },
  {
    id: 'oberon',
    parent: 'uranus',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 583 549,9441 km.
      // a_AE = 583 549,9441 / 149 597 870,7 = 0,00390079044 AE. Rückrechnung:
      // 0,00390079044 * 149 597 870,7 = 583 549,9441 km, exakt.
      a: 0.00390079044,  aDot: 0,
      e: 0.00055232448,    eDot: 0,
      i: 179.81195125,        iDot: 0,
      L: 92.45917538,          LDot: 976659.6250,
      lp: 358.96288443,        lpDot: 40.2565,
      node: 319.95615645,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 761.4,
      massKg: 2.88e21,
      rotationPeriodH: -323.11769,
      pole: { raDeg: 257.43, decDeg: -15.10 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      textures: { albedo: '' },
      // Mittleres, leicht rötlich getöntes Grau, Albedo 0,23 — äußerster
      // der fünf großen Uranusmonde.
      color: '#8a7f74',
    },
    info: { nameKey: 'body.oberon.name', descriptionKey: 'body.oberon.description' },
  },
];
