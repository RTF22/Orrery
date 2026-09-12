import type { Body } from '../../sim/types';

// PLUTO — heliozentrischer Zwergplanet (kind: 'dwarf', parent: 'sun',
// frame: 'ecliptic'), strukturell wie ein Planet in mars.ts, aber mit
// anderer Quelle: Es gibt für Zwergplaneten keine über 1800-2050 gefittete
// Mean-Elements-Tabelle wie approx_pos.html für die acht Planeten. Die
// Elemente kommen deshalb aus der JPL Small-Body Database (SBDB),
// https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html, API-Endpunkt
// https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=Pluto&phys-par=true&full-prec=true,
// abgerufen am 12.09.2026. SBDB liefert OSCULATING Elemente zu einer
// EIGENEN Epoche (hier JD 2457588.5, 2016-07-31 TDB, orbit_id "1"), nicht
// zu J2000 — anders als die Horizons-Osculating-Abfragen der Mondkataloge,
// die gezielt TLIST='2451545.0' anfordern.
//
// RÜCKVERSCHIEBUNG AUF J2000 — keine Näherung, sondern exakt in diesem
// Modell: sim/orbit.ts betreibt reine ungestörte Zweikörper-Kepler-
// Fortschreibung (elementsAt() addiert nur linear a+aDot·T usw.). Für ein
// echtes Zweikörperproblem SIND a, e, i, node, lp zu jeder Zeit dieselben
// Bahnkonstanten; nur die mittlere Länge L läuft mit der Zeit um. a, e, i,
// node und lp unten sind deshalb UNVERÄNDERT die von SBDB gelieferten
// Epochenwerte (aDot=eDot=iDot=nodeDot=lpDot=0 ist hier keine Vereinfachung,
// sondern die exakte Konsequenz des Modells) — nur L wird über
// L(J2000) = L(Epoche) − LDot·ΔT auf T=0 zurückgerechnet, mit
// LDot = n·36525 aus SBDBs eigener mittlerer Bewegung n (deg/Tag) und
// ΔT = (Epoche − J2000)/36525 in julianischen Jahrhunderten. Das ist
// dieselbe Rückrechnung, die node/lp/L bei den Monden über die Zeit hinweg
// vorwärts trägt, hier nur einmalig rückwärts bis J2000 angewendet.
//
// KEPLER-GEGENPROBE (P_Jahre = a_AE^1,5, siehe Sondertest in
// data/index.test.ts): Für alle fünf hier gelisteten Körper stimmt das mit
// SBDBs eigener Umlaufzeit (Spalte "per") auf −0,0019 % überein — derselbe
// kleine, körperunabhängige Systemversatz bei allen fünf (erwartbar: die
// idealisierte Formel P=a^1,5 gilt exakt nur mit der historischen
// Gauß'schen Gravitationskonstante, SBDBs "per" nutzt dagegen die aktuell
// gemessene GM(Sonne) — kein Befund, sondern ein bekannter Konstantenversatz).
//   Pluto:    a=39,5886 AE → P=249,0897 a (SBDB: 249,0944 a)
//   Ceres:    a=2,7656 AE  → P=4,5991 a   (SBDB: 4,5992 a)
//   Eris:     a=67,9339 AE → P=559,9255 a (SBDB: 559,9361 a)
//   Haumea:   a=43,0603 AE → P=282,5631 a (SBDB: 282,5684 a)
//   Makemake: a=45,5709 AE → P=307,6323 a (SBDB: 307,6381 a)
//
// PLUTOS BESONDERHEIT — 3:2-Resonanz mit Neptun: Pluto und Neptun stehen in
// einer starken Mittelbewegungsresonanz, die Plutos OSKULIERENDE a und e
// über den rund 248 Jahre langen Umlauf messbar librieren lässt (deutlich
// stärker als bei einem "normalen" TNO). Das erklärt, warum SBDBs Epochenwert
// (a=39,589 AE, e=0,25184, i=17,148°) von der oft zitierten gemittelten
// Kontrollgröße (a≈39,48 AE, e≈0,2488, i≈17,16°, z. B. NASA/JPL NSSDC Pluto
// Fact Sheet, Abschnitt "Pluto Mean Orbital Elements (J2000)") um bis zu
// gut 1 % abweicht — kein Übertragungsfehler, sondern derselbe Effekt, den
// auch der Sondertest unten mit Absicht nur locker prüft (>29 AE, nicht auf
// eine bestimmte Nachkommastelle).
//
// PLUTOS POL UND ROTATION — SPICE-Kernel pck00011.tpc,
// https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00011.tpc,
// Abschnitt "Pluto": BODY999_POLE_RA=132,993°, BODY999_POLE_DEC=−6,163°,
// BODY999_PM-Rate=+56,3625225°/Tag (POSITIV). Rotationsperiode daraus:
// 360/56,3625225 = 6,387223 d = 153,29335 h. Das Vorzeichen bleibt hier
// bewusst POSITIV, obwohl Pluto populär als "rückläufiger Rotierer" gilt
// (Obliquität zur eigenen Bahn 119,6°, gegen die Ekliptik 112,8° — beide
// über 90°, s. u.): Diese Rückläufigkeits-Information steckt bereits
// VOLLSTÄNDIG in der Pollage selbst (Kippwinkel > 90°, exakt wie bei
// Venus/Uranus in diesem Katalog dokumentiert — siehe Kommentar in
// uranus.ts). Der Kernel selbst führt die PM-Rate mit positivem Vorzeichen,
// und die hier unabhängig aus SBDBs Bahnelementen berechnete Neigung
// zwischen diesem Pol und Plutos eigener Bahnnormale (119,614°) deckt sich
// mit dem im Fact Sheet tabellierten "Obliquity to orbit" (119,51°) auf
// 0,1° — würde man zusätzlich rotationPeriodH negativ setzen, würde die
// Rückläufigkeit doppelt gezählt (dieselbe Falle, vor der uranus.ts warnt).
// Kontrollrechnung Charon-Orbit: Horizons liefert für Charons Bahn um
// diesen exakten Pol IN=0,084° (nahe 0°, nicht nahe 180°) — Charon läuft
// also PROGRAD um diesen Pol, was zur gebundenen (gleichsinnigen) Rotation
// nur passt, wenn auch Plutos eigene PM-Rate um denselben Pol positiv ist.
// Radius: BODY999_RADII (Kugel) = 1188,3 km, deckungsgleich mit NASA/JPL
// NSSDC Pluto Fact Sheet ("Volumetric mean radius" 1188 km).
// Masse: NASA/JPL NSSDC Pluto Fact Sheet, Abschnitt "Bulk parameters":
// 0,01303·10²⁴ kg = 1,303·10²² kg. Kontrolle über Horizons' eigene
// Keplerian-GM für Charons Bahn (975,427 km³/s² — das ist GM(Pluto+Charon)
// zusammen, weil Horizons die relative Zweikörperbahn löst): Masse(System)
// = 975,427 / 6,67430e-20 = 1,46147·10²² kg, gegen die Fact-Sheet-Summe aus
// Pluto (1,303·10²² kg) + Charon (1,586·10²¹ kg) = 1,4616·10²² kg — auf
// 0,01 % übereinstimmend, kein Befund.
//
// BARYZENTRUM AUSSERHALB PLUTOS — und was die Vereinfachung kostet: Der
// Massenschwerpunkt des Systems liegt bei
// a_Charon · m_Charon/(m_Pluto+m_Charon) = 19 595,76 km · 1,586/14,616
// ≈ 2126 km von Plutos Zentrum entfernt — mehr als Plutos eigener Radius
// (1188,3 km). Pluto und Charon umkreisen also tatsächlich einen
// gemeinsamen Punkt AUSSERHALB von Plutos Oberfläche (der Grund, warum das
// System gelegentlich "Doppel-Zwergplanet" genannt wird). Der hier
// gewählte Datensatz führt Charon vereinfachend um PLUTOS MITTELPUNKT
// (parent: 'pluto', dieselbe Architektur wie jeder andere Mond dieses
// Katalogs) statt um das Baryzentrum. Die RELATIVBAHN Charon−Pluto selbst
// ist davon nicht betroffen (Horizons' Zweikörperlösung mit
// GM=GM_Pluto+GM_Charon liefert exakt diese Relativbahn, unabhängig davon,
// wo der Schwerpunkt liegt). Der Preis: Pluto selbst müsste eigentlich mit
// derselben 6,387-Tage-Periode und rund 2126 km Amplitude um dieses
// Baryzentrum taumeln (und entsprechend würde sich sein heliozentrischer
// Ort periodisch um diesen Betrag verschieben) — dieses Modell hält Pluto
// dagegen exakt auf seiner eigenen (den Systemschwerpunkt näherungsweise
// mittelnden) heliozentrischen SBDB-Bahn fest. Bei einem Sonnenabstand von
// rund 5,9 Milliarden km ist eine 2126-km-Schwankung (< 0,00004 %)
// gegenüber der Darstellungsgenauigkeit dieser Anwendung bedeutungslos —
// dieselbe Größenordnungsabwägung wie bei jeder anderen in diesem Katalog
// bewusst nicht nachgebildeten Mehrkörperstörung.

export const plutoSystem: readonly Body[] = [
  {
    id: 'pluto',
    parent: 'sun',
    kind: 'dwarf',
    orbit: {
      // JPL SBDB, sstr=Pluto, orbit_id "1", Epoche JD 2457588.5 (2016-07-31
      // TDB). a/e/i sind SBDBs Epochenwerte unverändert (s. Quellenblock
      // oben zur Rückverschiebung); L auf J2000 zurückgerechnet.
      a: 39.58862938517124,   aDot: 0,
      e: 0.25183787785769,    eDot: 0,
      i: 17.14771140999114,   iDot: 0,
      L: 238.77189282,        LDot: 144.52354285,
      lp: 224.00138557,       lpDot: 0,
      node: 110.29238405,     nodeDot: 0,
      frame: 'ecliptic',
    },
    physical: {
      radiusKm: 1188.3,
      massKg: 1.303e22,
      // Positiv — s. ausführlicher Quellenblock oben (Kernel-PM-Rate positiv,
      // Rückläufigkeit steckt in der Pollage, nicht im Vorzeichen).
      rotationPeriodH: 153.29335,
      // SPICE-Kernel pck00011.tpc, BODY999_POLE_RA/DEC — deckungsgleich mit
      // NASA/JPL NSSDC Pluto Fact Sheet (132,99°/−6,16°).
      pole: { raDeg: 132.993, decDeg: -6.163 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      // Ausweichfarbe für die Ladezeit der Textur (unten) und für den
      // seltenen Fehlschlagsfall: blasses, bräunliches Tan, angenähert an
      // die von New Horizons gezeigte, tholingefärbte Oberfläche (u. a. das
      // helle Stickstoffeisfeld Tombaugh Regio, umgeben von dunkleren,
      // rötlich-braunen Regionen wie Cthulhu Macula).
      textures: { albedo: 'textures/pluto/albedo.jpg' },
      color: '#d3b58f',
    },
    info: { nameKey: 'body.pluto.name', descriptionKey: 'body.pluto.description' },
  },
  {
    id: 'charon',
    parent: 'pluto',
    kind: 'moon',
    orbit: {
      // MONDMETHODE (wie saturn-monde.ts/neptun-monde.ts): a, e, i, node,
      // lp, L aus Horizons' osculating elements zur Epoche J2000.
      // Abruf: EPHEM_TYPE='ELEMENTS', REF_PLANE='B' (Plutos Körperäquator),
      // REF_SYSTEM='J2000', CENTER='500@999' (Pluto-Körperzentrum),
      // TLIST='2451545.0', OUT_UNITS='KM-S', COMMAND='901'. Abgerufen am
      // 12.09.2026, Quelle laut Horizons-Kopfzeile "plu060_merged".
      // A = 19 595,76204124312 km. a_AE = 19 595,76204124312/149 597 870,7
      // = 0,00013098958 AE. Rückrechnung: 0,00013098958 * 149 597 870,7 =
      // 19 595,76225 km, trifft den Quellwert auf unter 0,001 km.
      a: 0.00013098958,   aDot: 0,
      e: 0.00016106728,   eDot: 0,
      // i gegen Plutos Äquator (REF_PLANE=B) nahe 0° — Charon läuft praktisch
      // exakt in Plutos Äquatorebene, wie es die gegenseitig gebundene
      // Rotation physikalisch erzwingt.
      i: 0.08413790,       iDot: 0,
      L: 304.12087281,        LDot: 2058641.45633,
      lp: 155.45573832,        lpDot: 0,
      node: 9.44246298,       nodeDot: 0,
      frame: 'parentEquator',
    },
    physical: {
      radiusKm: 606,
      massKg: 1.586e21,
      // DREIFACHE KONTROLLRECHNUNG (Task-Vorgabe): Plutos Rotationsperiode,
      // Charons Rotationsperiode und Charons Umlaufzeit sind dieselbe Zahl —
      // exakt das, was gegenseitig gebundene Rotation bedeutet (beide Körper
      // zeigen einander stets dieselbe Seite).
      //   1) Plutos Rotationsperiode (Kernel-PM-Rate BODY999):
      //      360/56,3625225°/Tag = 6,387223 d = 153,29335 h.
      //   2) Charons eigene Rotationsperiode (Kernel-PM-Rate BODY901,
      //      IDENTISCH zu Plutos: 132,993°/−6,163°/56,3625225°/Tag):
      //      ebenfalls 6,387223 d = 153,29335 h.
      //   3) Charons Umlaufzeit um Pluto, aus der JPL-Mean-Elements-Tabelle
      //      (https://ssd.jpl.nasa.gov/sats/elem/, Plutosystem, Zeile
      //      "Charon"): P = 6,387222 d = 153,29333 h — auf 0,00002 h mit den
      //      beiden Rotationsperioden übereinstimmend. Zur Kontrolle auch
      //      aus Horizons' eigener osculating mittlerer Bewegung N
      //      (6,523442541628198e-4°/s = 56,362544°/Tag ⇒ 6,387221 d):
      //      dieselbe Größenordnung, bestätigt unabhängig von der Tabelle.
      // LDot unten verwendet die Tabellenperiode (6,387222 d), demselben
      // Muster wie bei allen übrigen Monden dieses Katalogs folgend.
      rotationPeriodH: 153.29335,
      // Kernel pck00011.tpc, BODY901_POLE_RA/DEC — IDENTISCH zu Plutos
      // eigenem Pol (132,993°/−6,163°): Erwartungsgemäß, weil beide Körper
      // um dieselbe, gemeinsame Rotationsachse gebunden rotieren.
      pole: { raDeg: 132.993, decDeg: -6.163 },
      rotationAtEpochDeg: 0,
    },
    appearance: {
      textures: { albedo: 'textures/charon/albedo.jpg' },
      // Grau mit rötlicher Polkappe (Mordor Macula, Tholin-Ablagerung aus
      // entwichenem Methan von Pluto); hier ein neutrales Grau als
      // Ausweichfarbe, da eine einzelne Polkappe erst eine Textur zeigen kann.
      color: '#a89e94',
    },
    info: { nameKey: 'body.charon.name', descriptionKey: 'body.charon.description' },
  },
];
