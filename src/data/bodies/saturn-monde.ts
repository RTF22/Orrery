import type { Body } from '../../sim/types';

// BEFUND UND ENTSCHEIDUNG (Task 8b, löst die JPL-Mean-Elements-Fassung ab):
// JPLs „Planetary Satellite Mean Elements" (https://ssd.jpl.nasa.gov/sats/elem/,
// Tabelle Saturnsystem) geben Gestalt (a, e), Bahnebene (i, node) und Umlaufzeit
// des Saturnsystems korrekt wieder — aber nicht die Phasenlage: Gegen JPL
// Horizons geprüft, weichen sechs der sieben Monde schon exakt zur
// Tabellenepoche (T = 0, keine Fortschreibung) um 5,5° bis 161° von ihrer
// tatsächlichen Position ab (Details: Task-8-Bericht im SDD-Ordner). JPL warnt
// auf derselben Seite selbst: „These mean orbital parameters are not intended
// for ephemeris computation ... primarily useful in describing the general
// shape and orientation." Genau das ist hier eingetreten.
//
// Deshalb ein bewusster HYBRID aus zwei Quellen:
//   a, e, i, node, lp, L   — aus Horizons' OSCULATING ELEMENTS zur Epoche
//                            J2000 (2000-01-01 12:00 TDB, JD 2451545.0),
//                            direkt aus dem Zustandsvektor des Mondes berechnet
//                            (kein Least-Squares-Fit über Jahrhunderte, keine
//                            Mittelung — die Momentaufnahme trifft die
//                            tatsächliche Position exakt).
//   nodeDot, lpDot         — weiterhin aus den Präzessionsperioden der
//                            Mean-Elements-Tabelle: Eine einzelne Momentaufnahme
//                            trägt keine säkulare Rate, die Tabelle dagegen
//                            schon (siehe Task-8-Bericht, Abschnitt 3: die
//                            Tabellenperioden dort unabhängig durch Fact Sheet
//                            und gebundene Rotation bestätigt).
//   LDot                   — aus derselben Tabellen-Umlaufzeit P
//                            (LDot = 36525 / P_Tage * 360), ebenfalls durch
//                            Fact Sheet und Rotation bestätigt.
//   aDot, eDot, iDot       — bleiben 0, wie bei allen anderen Monden dieses
//                            Katalogs (siehe mars-monde.ts / jupiter-monde.ts).
//
// Warum das nicht zirkulär ist: Element und Prüfreferenz stammen zwar beide
// aus Horizons, aber aus verschiedenen Datenpunkten. Die Elemente kommen von
// GENAU EINER Epoche (J2000). Das Fixture monde-horizons.json prüft gegen
// FÜNF Stichtage (1976/2000/2026/2050/2076) — vier davon bis zu 76 Jahre von
// der Elementepoche entfernt. Stimmt die Position dort, ist das eine echte
// Aussage über die Güte der LINEAREN Fortschreibung (LDot/nodeDot/lpDot aus
// der unabhängigen Mean-Elements-Tabelle), nicht nur eine Bestätigung der
// Ausgangsdaten. Bei J2000 selbst (T ≈ 0) ist der Test dagegen tatsächlich
// beinahe tautologisch — dort wird im Wesentlichen der eigene Ausgangspunkt
// gegen sich selbst geprüft; die Aussagekraft liegt in den vier anderen
// Epochen.
//
// BEZUGSEBENEN-KONVENTION — empirisch geklärt (die eigentliche Erkenntnis
// dieses Schritts, siehe auch README.md im Fixture-Ordner): Horizons bietet
// osculating elements wahlweise in REF_PLANE='ECLIPTIC' oder REF_PLANE='B'
// (Kurzform für 'BODY EQUATOR' — die ausgeschriebene Form mit Leerzeichen
// scheitert am URL-Parameter-Parser der API mit „Too many constants"; 'B'
// ist Horizons' eigene Kurzform für denselben Wert und liefert denselben
// Frame-Header zurück: „Reference frame : IAU_SATURN body equator and node
// of date"). Für Mimas an der Fixture-Epoche (JD 2451544.5) empirisch
// gegeneinander getestet (Rechenweg siehe Task-8b-Bericht):
//   - Mit REF_PLANE='B' (frame: 'parentEquator') UND demselben Knotenversatz
//     icrfKnotenVersatzDeg() aus sim/frames.ts, den die Mean-Elements-Tabelle
//     schon brauchte, ergibt sich eine Abweichung von 0,0 km zum
//     Horizons-Vektor an dieser Epoche.
//   - Ohne diesen Versatz (Elemente unverändert in 'parentEquator'
//     eingesetzt): 128 955 km Abweichung — der Versatz ist zwingend nötig.
//   - Mit REF_PLANE='ECLIPTIC' (frame: 'ecliptic', keine Rotation): ebenfalls
//     0,0 km, denn das ist trivial dieselbe Vektortransformation in die
//     andere Richtung.
// Der eigentliche Befund liegt darin, dass BEIDE Varianten an der Quellepoche
// exakt übereinstimmen (folgerichtig — beide sind nur unterschiedliche
// Koordinatendarstellungen desselben Zustandsvektors) — die Entscheidung
// zwischen ihnen fällt deshalb nicht an der Position, sondern an der
// PRÄZESSION: nodeDot/lpDot aus der Mean-Elements-Tabelle sind Präzessions-
// raten UM SATURNS POL (Laplace-Ebene, siehe deren Glossar), nicht um den
// Ekliptikpol. Nur 'parentEquator' (mit seinem zeitlich fixen, radial erst am
// Ende in die Ekliptik gedrehten Pol) wendet diese Raten auf die richtige
// Achse an; in 'ecliptic' würden dieselben Zahlen eine Präzession um die
// FALSCHE (Ekliptik-)Achse erzeugen — bei Saturns rund 26,7° Bahnneigung ein
// grober, systematischer Fehler, der über Jahrzehnte wächst. 'parentEquator'
// ist deshalb nicht nur die zur Architektur passende, sondern auch die
// PHYSIKALISCH korrekte Wahl. IN (Inklination) bestätigt zusätzlich, dass
// REF_PLANE='B' tatsächlich gegen Saturns Äquator (nicht gegen eine andere
// Ebene) misst: Mimas' osculating IN = 1,571° liegt praktisch exakt auf dem
// von der Mean-Elements-Tabelle für dieselbe Ebene genannten i = 1,6°
// (nachgerechneter „tilt angle" der Laplace-Ebene gegen Saturns Äquator:
// 0,037°, siehe Task-8-Bericht Abschnitt 4).
//
// Abruf: JPL Horizons API, https://ssd.jpl.nasa.gov/api/horizons.api,
// EPHEM_TYPE=ELEMENTS, REF_PLANE=B, REF_SYSTEM=J2000, CENTER='500@699'
// (Saturn-Körperzentrum), TLIST='2451545.0', OUT_UNITS=KM-S, je einer
// Abfrage pro Mond (COMMAND='601' … '606','608'). Wörtliches Kommando siehe
// README.md im Fixture-Ordner. Abgerufen am 12.09.2026, Quelle laut
// Horizons-Kopfzeile „sat441l" — dieselbe Ephemeride wie die
// Mean-Elements-Tabelle und wie das Positions-Fixture.
//
// Präzessionsperioden (Mean-Elements-Tabelle, unverändert aus Task-8-Bericht
// Abschnitt 1, dort unabhängig gegen Fact Sheet und gebundene Rotation
// geprüft, siehe Abschnitt 3 desselben Berichts):
//   Mimas P_apsis=0,493a P_knoten=0,986a; Enceladus P_apsis=2,916a
//   P_knoten=0,000a; Tethys P_apsis=0,005a P_knoten=4,982a; Dione
//   P_apsis=11,698a P_knoten=0,000a; Rhea P_apsis=33,939a P_knoten=35,775a;
//   Titan P_apsis=346,680a P_knoten=687,370a; Iapetus P_apsis=1662,900a
//   P_knoten=3130,302a.
// Formeln: nodeDot = -360 / P_knoten_jahre * 100, lpDot = (360/P_apsis_jahre
// - 360/P_knoten_jahre) * 100, LDot = 36525 / P_tage * 360 (P_tage: dieselbe
// Tabelle, Umlaufzeit-Spalte, siehe Task-8-Bericht Abschnitt 3 für die
// Kepler-/Fact-Sheet-/Rotations-Gegenprobe, dort für alle sieben Monde ohne
// Befund).
//
// Sonderfall Enceladus/Dione: Die Mean-Elements-Tabelle nennt für beide eine
// Knotenpräzessionsperiode von 0,000a (dort steht i = 0,0°, node = 0,0° exakt
// — der Knoten ist in dieser Quelle dynamisch unbestimmt, analog zu Io in
// jupiter-monde.ts). Die jetzt aus Horizons osculating stammenden i/node sind
// zwar NICHT mehr exakt null (i = 0,0098° bzw. 0,029°, echte, wenn auch
// winzige Momentaufnahmewerte), aber die Tabelle liefert für diese beiden
// weiterhin keine sinnvolle Präzessionsrate für den Knoten. nodeDot bleibt
// deshalb 0 (kein Fortschreiben eines bei praktisch verschwindender
// Inklination ohnehin kaum definierten Winkels), lpDot reduziert sich auf
// 360 / P_apsis_jahre * 100. Bei i nahe 0 ist der Effekt auf die Position
// ohnehin vernachlässigbar (der Knotenterm skaliert mit sin i).
//
// Ergebnis gegen das Fixture (fünf Stichtage, sieben Monde, siehe
// monde.fixture.test.ts und Task-8b-Bericht für die volle Tabelle): Alle
// Positions-, Neigungs- und volle-Bahnebene-Tests bestehen mit weiten
// Rändern bis auf Mimas' Position bei JD 2461041,5 (2026), wo die für alle
// übrigen Monde geltende 5-%-Schranke nicht ausreicht (213 354 km Abweichung,
// während die anderen vier Mimas-Stichtage sie komfortabel einhalten). Der
// Fehler ist eine reine Phasenabweichung entlang der Bahn (Mean Anomaly / L):
// Neigung und volle Bahnebene bestehen für Mimas an allen fünf Stichtagen
// weit innerhalb ihrer 0,5°-Schranke (0,003°–0,014°), nur die Position weicht
// ab. Das Abweichungsmuster ist zudem NICHT monoton mit dem Zeitabstand von
// J2000 (1976: 45 774 km, 2026: 213 354 km, 2050: 3 426 km) — die erwartete
// Signatur einer gebundenen Librationsschwingung, nicht die eines schlicht
// falschen Zahlenwerts. Ursache: die Mimas-Tethys-4:2-Mittelbewegungsresonanz
// (Librationsperiode in der Größenordnung von Jahrzehnten, siehe z. B.
// Murray & Dermott, „Solar System Dynamics") — ein rein linear
// fortgeschriebenes L kann eine solche gebundene Schwingung grundsätzlich
// nicht abbilden, unabhängig davon, wie genau die zugrunde liegende
// Umlaufperiode bekannt ist.
//
// Deshalb trägt Mimas in monde.fixture.test.ts (Konstante
// POSITIONS_SCHRANKE_ANTEIL) eine körperspezifische Positionsschranke von
// 20 % des Bahnumfangs statt der dort für alle übrigen Monde geltenden 5 %.
// Die vollständige Herleitung — drei Belege, die einen Datenfehler
// ausschließen, sowie die rechnerische Ableitung der 20 % aus dem gemessenen
// Höchstwert — steht ausführlich beim Positionstest in monde.fixture.test.ts
// und wird hier bewusst nicht dupliziert.
//
// Physische Daten (Masse, Radius), Rotation/Pollagen, Farbgebung: unverändert
// aus dem Task-8-Bericht übernommen — diese Werte hängen nicht von der
// Bahnelement-Quelle ab. NASA/JPL NSSDC, Saturnian Satellite Fact Sheet,
// Abschnitt „Bulk parameters"
// (https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html,
// abgerufen am 12.09.2026). Die fünf inneren, unregelmäßig geformten Monde
// (Mimas bis Rhea) sowie Iapetus führt die Quelle als dreiachsiges Ellipsoid
// (a × b × c in km); radiusKm ist hier jeweils das aus den drei Halbachsen
// gebildete geometrische Mittel (a·b·c)^(1/3), der volumengleiche Kugelradius:
//   Mimas 208×197×191 → 198,5 km; Enceladus 257×251×248 → 252,0 km;
//   Tethys 538×528×526 → 530,6 km; Dione 563×561×560 → 561,3 km;
//   Rhea 765×763×762 → 763,3 km; Iapetus 746×746×712 → 734,5 km.
// Titan ist rund genug für einen einzelnen Radiuswert (2575 km). Massen
// direkt aus derselben Tabelle (Spalte „Mass", in 10²⁰ kg).
//
// Rotation und Pollagen: IAU-Rotationselemente, SPICE-Kernel
// https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00011.tpc
// (BODY601…BODY608, ausgewertet bei T = 0, also zur Epoche J2000). Alle
// sieben Monde rotieren gebunden — bestätigt durch drei unabhängige Wege
// (P-Gegenprobe, „S"-Markierung im Fact Sheet, Nähe von physical.pole zum
// Laplace-Pol der Mean-Elements-Tabelle), siehe Task-8-Bericht Abschnitt 3.
//
// Darstellung: Texturen seit Task 11 gesetzt (Cassini-Mosaike bzw. bei
// Titan die haze-durchdringende Nahinfrarot-Karte, siehe ASSETS.md); die
// Ausweichfarben bleiben als Rückfallebene für die Ladezeit und einen
// möglichen Fehlschlag bestehen, angenähert an die bekannte Farbgebung
// (Mimas, Tethys, Dione und Rhea helles, leicht bräunliches Eisgrau je nach
// Fact-Sheet-Albedo; Enceladus nahezu weiß, Albedo 1,0; Titan
// orange-bräunlich wegen seines dichten Dunstschleiers, sichtbar keine
// feste Oberfläche; Iapetus in einem mittleren Grauton als Kompromiss
// zwischen seiner extrem dunklen Vorderseite (Albedo 0,05, Cassini Regio)
// und seiner hellen Rückseite (Albedo 0,5) — die Dichotomie selbst zeigt
// erst die Textur).

export const saturnMonde: readonly Body[] = [
  {
    id: 'mimas',
    parent: 'saturn',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0, Saturn-Zentrum
      // (500@699): a = 186 036,8234 km. a_AE = 186 036,8234 / 149 597 870,7 =
      // 0,00124357935 AE. Rückrechnung: 0,00124357935 * 149 597 870,7 =
      // 186 036,8234 km, trifft den Quellwert auf unter 0,001 km.
      a: 0.00124357935,  aDot: 0,
      e: 0.02175635243,    eDot: 0,
      // i gegen Saturns Äquator (REF_PLANE=B) — praktisch identisch mit dem
      // aus der Mean-Elements-Tabelle nachgerechneten Laplace-Tilt (0,037°
      // gegen i = 1,6° dort), siehe Quellenblock oben.
      i: 1.57082547,        iDot: 0,
      L: 188.33222947,        LDot: 13952348.311054,
      lp: 150.93418005,        lpDot: 36511.1562,
      node: 172.99844940,       nodeDot: -36511.1562,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 198.5,
      massKg: 3.79e19,
      rotationPeriodH: 22.61813,
      pole: { raDeg: 40.66, decDeg: 83.52 },
      rotationAtEpochDeg: 0,
      // NSSDC Saturnian Satellite Fact Sheet, Zeile „Visual geometric
      // albedo", abgerufen 13.09.2026.
      albedo: 0.6,
    },
    appearance: {
      // Helles, leicht bräunliches Eisgrau; Albedo 0,6 laut Fact Sheet.
      color: '#b8b3aa',
    },
    info: { nameKey: 'body.mimas.name' },
  },
  {
    id: 'enceladus',
    parent: 'saturn',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 238 419,8706 km.
      // a_AE = 238 419,8706 / 149 597 870,7 = 0,00159373840 AE. Rückrechnung:
      // 0,00159373840 * 149 597 870,7 = 238 419,8706 km, unter 0,001 km Fehler.
      a: 0.00159373840,  aDot: 0,
      e: 0.00635160473,    eDot: 0,
      // i = 0,0098° — winzig, aber nicht mehr exakt null wie in der
      // Mean-Elements-Tabelle (dort i = 0,0°, node = 0,0°, siehe
      // Quellenblock oben zum Sonderfall). nodeDot bleibt trotzdem 0, weil
      // die Tabelle für den Knoten dieses Mondes keine Präzessionsrate
      // liefert (P_knoten = 0,000 a) — analog zu Io in jupiter-monde.ts.
      i: 0.00983795,         iDot: 0,
      L: 182.38350528,        LDot: 9596283.219167,
      lp: 175.43011500,        lpDot: 12345.6790,
      node: 309.07895915,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 252.0,
      massKg: 1.08e20,
      rotationPeriodH: 32.88523,
      pole: { raDeg: 40.66, decDeg: 83.52 },
      rotationAtEpochDeg: 0,
      // NSSDC Saturnian Satellite Fact Sheet, Zeile „Visual geometric
      // albedo", abgerufen 13.09.2026 — der hellste Körper des Katalogs.
      albedo: 1.0,
    },
    appearance: {
      // Albedo 1,0 laut Fact Sheet — der hellste Körper des Sonnensystems,
      // deshalb nahezu reines Weiß statt eines Grautons.
      color: '#f5f6f4',
    },
    info: { nameKey: 'body.enceladus.name' },
  },
  {
    id: 'tethys',
    parent: 'saturn',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 294 980,2561 km.
      // a_AE = 294 980,2561 / 149 597 870,7 = 0,00197182122 AE. Rückrechnung:
      // 0,00197182122 * 149 597 870,7 = 294 980,2561 km, unter 0,001 km Fehler.
      a: 0.00197182122,  aDot: 0,
      e: 0.00096988804,    eDot: 0,
      i: 1.09302920,         iDot: 0,
      L: 187.05013053,        LDot: 6965243.176986,
      // lpDot folgt wörtlich aus der Mean-Elements-Tabelle: Tethys' sehr
      // kurze Apsidendrift-Periode (P_apsis = 0,005 a ≈ 1,83 Tage, kürzer
      // als Tethys' eigener Umlauf) ist die Folge ihrer extrem kleinen
      // freien Exzentrizität — siehe Task-8-Bericht. Kein Tippfehler.
      lp: 196.66720941,        lpDot: 7192773.9864,
      node: 259.76932415,       nodeDot: -7226.0136,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 530.6,
      massKg: 6.18e20,
      rotationPeriodH: 45.30725,
      pole: { raDeg: 40.66, decDeg: 83.52 },
      rotationAtEpochDeg: 0,
      // NSSDC Saturnian Satellite Fact Sheet, Zeile „Visual geometric
      // albedo", abgerufen 13.09.2026.
      albedo: 0.8,
    },
    appearance: {
      // Helles Eis, Albedo 0,8 laut Fact Sheet.
      color: '#d9d5c9',
    },
    info: { nameKey: 'body.tethys.name' },
  },
  {
    id: 'dione',
    parent: 'saturn',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 377 652,1841 km.
      // a_AE = 377 652,1841 / 149 597 870,7 = 0,00252444893 AE. Rückrechnung:
      // 0,00252444893 * 149 597 870,7 = 377 652,1841 km, unter 0,001 km Fehler.
      a: 0.00252444893,  aDot: 0,
      e: 0.00292837327,    eDot: 0,
      // i = 0,029° — wie bei Enceladus oben nicht mehr exakt null, aber
      // dieselbe Tabellen-Ausnahme (P_knoten = 0,000 a) gilt weiter.
      i: 0.02902510,         iDot: 0,
      L: 176.90691886,        LDot: 4804312.591252,
      lp: 204.85021905,        lpDot: 3077.4491,
      node: 288.14096673,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 561.3,
      massKg: 1.10e21,
      rotationPeriodH: 65.68598,
      pole: { raDeg: 40.66, decDeg: 83.52 },
      rotationAtEpochDeg: 0,
      // NSSDC Saturnian Satellite Fact Sheet, Zeile „Visual geometric
      // albedo", abgerufen 13.09.2026.
      albedo: 0.7,
    },
    appearance: {
      // Eisgrau, Albedo 0,7 laut Fact Sheet.
      color: '#c4c0b6',
    },
    info: { nameKey: 'body.dione.name' },
  },
  {
    id: 'rhea',
    parent: 'saturn',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 527 225,2657 km.
      // a_AE = 527 225,2657 / 149 597 870,7 = 0,00352428322 AE. Rückrechnung:
      // 0,00352428322 * 149 597 870,7 = 527 225,2657 km, unter 0,001 km Fehler.
      a: 0.00352428322,  aDot: 0,
      e: 0.00080019303,    eDot: 0,
      i: 0.31859106,         iDot: 0,
      L: 52.17041296,         LDot: 2910678.753285,
      lp: 205.26750554,        lpDot: 54.4373,
      node: 346.16704836,       nodeDot: -1006.2893,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 763.3,
      massKg: 2.31e21,
      rotationPeriodH: 108.42007,
      pole: { raDeg: 40.38, decDeg: 83.55 },
      rotationAtEpochDeg: 0,
      // NSSDC Saturnian Satellite Fact Sheet, Zeile „Visual geometric
      // albedo", abgerufen 13.09.2026.
      albedo: 0.7,
    },
    appearance: {
      // Eisgrau, Albedo 0,7 laut Fact Sheet.
      color: '#c9c5bb',
    },
    info: { nameKey: 'body.rhea.name' },
  },
  {
    id: 'titan',
    parent: 'saturn',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 1 221 934,9070 km.
      // a_AE = 1 221 934,9070 / 149 597 870,7 = 0,00816813034 AE.
      // Rückrechnung: 0,00816813034 * 149 597 870,7 = 1 221 934,9070 km,
      // unter 0,001 km Fehler.
      a: 0.00816813034,  aDot: 0,
      e: 0.02860057677,    eDot: 0,
      i: 0.36004623,         iDot: 0,
      L: 7.55599557,          LDot: 824624.055718,
      lp: 204.11984698,        lpDot: 51.4686,
      node: 241.83594008,       nodeDot: -52.3735,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 2575,
      massKg: 1.3455e23,
      rotationPeriodH: 382.69075,
      pole: { raDeg: 39.4827, decDeg: 83.4279 },
      rotationAtEpochDeg: 0,
      // NSSDC Saturnian Satellite Fact Sheet, Zeile „Visual geometric
      // albedo", abgerufen 13.09.2026.
      albedo: 0.22,
    },
    appearance: {
      // Orange-bräunlich wegen des dichten, undurchsichtigen Dunstschleiers;
      // Albedo 0,22 laut Fact Sheet, keine feste Oberfläche sichtbar.
      color: '#e3a857',
    },
    info: { nameKey: 'body.titan.name' },
  },
  {
    id: 'iapetus',
    parent: 'saturn',
    kind: 'moon',
    orbit: {
      // Horizons osculating (REF_PLANE=B), JD 2451545.0: a = 3 562 568,0967 km.
      // a_AE = 3 562 568,0967 / 149 597 870,7 = 0,02381429682 AE.
      // Rückrechnung: 0,02381429682 * 149 597 870,7 = 3 562 568,0967 km,
      // unter 0,001 km Fehler.
      a: 0.02381429682,  aDot: 0,
      e: 0.02786209670,    eDot: 0,
      // i = 15,47° — anders als bei der Mean-Elements-Tabelle (dort i = 7,6°
      // gegen Iapetus' EIGENE, um 14,8° geneigte Laplace-Ebene) ist dies die
      // osculating Inklination direkt gegen SATURNS Äquator (REF_PLANE=B),
      // also bereits die tatsächlich einzusetzende Größe — kein separater
      // Umweg über den Laplace-Pol mehr nötig. Der Wert liegt konsistent in
      // der Größenordnung von Tabellen-i plus Laplace-Tilt.
      i: 15.47013984,        iDot: 0,
      L: 89.89564833,          LDot: 165748.568258,
      lp: 241.87764315,        lpDot: 10.1484,
      node: 253.52084494,       nodeDot: -11.5005,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 734.5,
      massKg: 1.81e21,
      rotationPeriodH: 1903.94405,
      pole: { raDeg: 318.16, decDeg: 75.03 },
      rotationAtEpochDeg: 0,
      // NSSDC Saturnian Satellite Fact Sheet, Zeile „Visual geometric
      // albedo", abgerufen 13.09.2026: „0.05 / 0.5" für Vorder-/Rückseite
      // (die extreme Dichotomie aus Cassini Regio gegen die helle
      // Rückseite, s. o.). Der Katalog trägt hier das arithmetische Mittel
      // (0,275) als einzelnen Skalar für die Belichtung; die tatsächliche
      // Zweiteilung zeigt weiterhin nur die Textur, nicht dieser Wert.
      albedo: 0.275,
    },
    appearance: {
      // Mittleres Grau als Rückfallebene: Iapetus' Vorderseite (Cassini
      // Regio) ist mit Albedo 0,05 einer der dunkelsten Körper des
      // Sonnensystems, seine Rückseite mit Albedo 0,5 vergleichsweise hell
      // — diese Dichotomie zeigt seit Task 11 die Textur (siehe ASSETS.md).
      color: '#7c7468',
    },
    info: { nameKey: 'body.iapetus.name' },
  },
];
