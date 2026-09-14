import type { Body } from '../../sim/types';

// Vier heliozentrische Zwergplaneten (kind: 'dwarf', parent: 'sun',
// frame: 'ecliptic') — dieselbe Methode und Rückverschiebung auf J2000 wie
// bei Pluto in pluto-system.ts, dort ausführlich hergeleitet (insbesondere:
// warum aDot=eDot=iDot=nodeDot=lpDot=0 hier exakt und keine Näherung ist,
// und die Kepler-Gegenprobe P_Jahre=a_AE^1,5). Quelle: JPL Small-Body
// Database, https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=<Name>&phys-par=true
// &full-prec=true, abgerufen am 12.09.2026. Physische Daten (Radius, Masse,
// Rotation) und Pollagen sind je Körper einzeln referenziert, weil die
// Datenlage bei den vier hier gelisteten Körpern sehr unterschiedlich ist:
// Ceres hat einen SPICE-Kernel-Pol und eine Raumsonden-Vermessung (Dawn),
// die drei transneptunischen Zwergplaneten dagegen nicht — deren Pollagen
// unten sind ausdrücklich als Annahme gekennzeichnet, nicht als Messung.
//
// POLLAGEN-ANNAHME FÜR ERIS UND MAKEMAKE: pck00011.tpc führt keine
// Pollagen für diese Körper (nur BODY999 Pluto, BODY901 Charon und
// BODY2000001 Ceres sind im Abschnitt "Selected Comets and Asteroids"
// vertreten). Für Eris und Makemake ist noch nicht einmal aus der
// Satellitenbahn (Dysnomia bzw. MK 2) eine vollständige Pol-RA/Dec bekannt
// — die Literatur nennt für beide nur einen Kippwinkel OHNE Achsrichtung
// (Eris ≈78,3° zur Bahn, Szakáts et al. 2022 — dieselbe Quelle wie unten
// bei Eris' rotationPeriodH; für Makemake ebenso nur eine Spanne
// "46°–78° zur Bahn"). Ohne Achsrichtung lässt sich kein vollständiger
// pole-Vektor bilden. Hier tritt deshalb ausdrücklich die vom Task-Brief
// vorgeschlagene Näherung in Kraft: die Bahnnormale der eigenen
// heliozentrischen Bahn steht anstelle des unbekannten Rotationspols.
//
// Das ist eine BEHELFSANNAHME, keine physikalisch plausible Wahl: Sie wird
// gebraucht, weil überhaupt irgendeine Achsrichtung ins Modell muss — nicht
// weil sie die wahrscheinlichste wäre. Die einzige tatsächlich bekannte
// Größe, der publizierte Kippwinkel, widerspricht ihr sogar direkt: Die
// Bahnnormale selbst ENTSPRICHT einem Kippwinkel von 0° zur Bahn, während
// die Messung bei Eris rund 78,3° und bei Makemake 46°–78° ergibt. Die hier
// dargestellte Achse kann deshalb um bis zu rund 78° falsch stehen. Bekannt
// ist also gerade NICHT, dass die Bahnnormale ungefähr stimmt — bekannt ist
// vor allem, dass sie es sehr wahrscheinlich NICHT tut. Berechnung:
// Bahnnormale (Ekliptik) aus i, node über
// n=(sin i·sin node, −sin i·cos node, cos i), anschließend in äquatoriale
// RA/Dec gedreht (Umkehrung von frames.ts' poleVector()).

export const zwergplaneten: readonly Body[] = [
  {
    id: 'ceres',
    parent: 'sun',
    kind: 'dwarf',
    orbit: {
      // JPL SBDB, sstr=Ceres (bzw. Kleinplanetennummer 1), orbit_id "48",
      // Epoche JD 2461200.5 (2026-06-19 TDB).
      a: 2.76555259503409,    aDot: 0,
      e: 0.07969229514817,    eDot: 0,
      i: 10.58802780183462,   iDot: 0,
      L: 158.74556449,        LDot: 7827.47006,
      lp: 153.54284135,       lpDot: 0,
      node: 80.24862682,      nodeDot: 0,
      frame: 'ecliptic',
    },
    physical: {
      // JPL SBDB phys_par, letztlich Park et al. (2016), Nature 537,
      // 515-517 ("A partially differentiated interior for (1) Ceres
      // deduced from its gravity field and shape", Dawn-Raumsonde):
      // effektiver Durchmesser 939,4 km ⇒ Radius 469,7 km. Kontrolle über
      // die dort ebenfalls gegebenen drei Achsen (964,4 × 964,2 × 891,8 km,
      // Vollachsen): geometrisches Mittel der Halbachsen
      // (482,2 × 482,1 × 445,9)^(1/3) = 469,75 km — deckungsgleich mit dem
      // separat angegebenen effektiven Durchmesser. pck00011.tpc nennt für
      // BODY2000001_RADII stattdessen 487,3 × 487,3 × 446 km (geometrisches
      // Mittel 473,1 km, rund 0,7 % größer) — ältere, vor der Dawn-Mission
      // liegende Bestimmung; hier wird die genauere Dawn-Messung übernommen.
      radiusKm: 469.7,
      // Aus SBDBs GM (62,6284 km³/s², dieselbe Dawn-Quelle) über
      // Masse = GM/G, G = 6,67430e-20 km³ kg⁻¹ s⁻² (CODATA 2018):
      // 62,6284 / 6,67430e-20 = 9,3835e20 kg.
      massKg: 9.3835e20,
      // JPL SBDB rot_per, aus derselben Dawn-Quelle (952,1532°/Tag PM-Rate,
      // siehe auch pck00011.tpc BODY2000001_PM).
      rotationPeriodH: 9.074170,
      // pck00011.tpc, BODY2000001_POLE_RA/DEC ("Current values", Dawn-Ära) —
      // deckungsgleich mit SBDBs eigenem phys_par-Eintrag (291,421°/66,758°).
      pole: { raDeg: 291.418, decDeg: 66.764 },
      rotationAtEpochDeg: 0,
      // JPL SBDB, sstr=1, phys-par=1, Parameter „albedo" = 0,090 ± 0,003,
      // Referenz dort: Li et al. (2006), Icarus 182, 143-160, V-Band,
      // abgerufen 13.09.2026.
      albedo: 0.090,
    },
    appearance: {
      // Ausweichfarbe für die Ladezeit der Textur (unten) und für den
      // seltenen Fehlschlagsfall: dunkles Grau (Albedo 0,09 laut SBDB —
      // einer der dunkelsten großen Körper des inneren Sonnensystems,
      // kohlenstoffreiche Oberfläche).
      textures: { albedo: 'textures/ceres/albedo.jpg' },
      color: '#6e6a63',
    },
    info: { nameKey: 'body.ceres.name' },
  },
  {
    id: 'eris',
    parent: 'sun',
    kind: 'dwarf',
    orbit: {
      // JPL SBDB, sstr=Eris, orbit_id "103", Epoche JD 2461200.5
      // (2026-06-19 TDB).
      a: 67.93394687853566,   aDot: 0,
      e: 0.43823853479717,    eDot: 0,
      i: 43.92582794717910,   iDot: 0,
      L: 21.57805595,         LDot: 64.29305,
      lp: 186.79969403,       lpDot: 0,
      node: 36.00477044,      nodeDot: 0,
      frame: 'ecliptic',
    },
    physical: {
      // Sicardy et al. (2011), Nature 478, 493-496 ("A Pluto-like radius
      // and a high albedo for the dwarf planet Eris from an occultation"),
      // Sternbedeckung: mittlerer Radius 1163 km.
      radiusKm: 1163,
      // Holler et al. (2021), Icarus 355, 114130 ("The Eris/Dysnomia
      // system I: The orbit of Dysnomia"), aus Dysnomias Bahnbewegung:
      // Masse Eris allein 1,638e22 kg (Systemmasse Eris+Dysnomia
      // 1,6466e22 kg abzüglich Dysnomias eigenem, viel kleinerem Anteil).
      massKg: 1.638e22,
      // Szakáts et al. (2022), A&A 668, L1 ("Tidally locked rotation of
      // the dwarf planet (136199) Eris ..."): Eris rotiert gebunden mit
      // Dysnomias Umlaufzeit, 15,786 d = 378,864 h — löst den älteren,
      // von SBDB selbst als unsicher gekennzeichneten Lichtkurvenwert
      // (25,9 h, "may be wrong by 30 percent or so") ab. Wie bei
      // Pluto/Charon eine dritte, unabhängige Kontrollrechnung: Dysnomias
      // Umlaufzeit selbst (15,7859 d laut Holler et al. 2021) trifft
      // denselben Wert.
      rotationPeriodH: 378.864,
      // ANNAHME, keine Messung — s. Quellenblock am Dateianfang: Eris' Pol
      // ist nicht mit Rektaszension/Deklination bestimmt, nur ein
      // Kippwinkel zur eigenen Bahn (≈78,3°, angenommen gleich Dysnomias
      // Bahnpol) ist publiziert. Hier ersatzweise die eigene Bahnnormale.
      pole: { raDeg: 296.9706, decDeg: 25.9491 },
      rotationAtEpochDeg: 0,
      // Sicardy et al. (2011), Nature 478, 493, doi 10.1038/nature10550:
      // p_V = 0,96 (+0,09/−0,04) aus der Sternbedeckung vom 06.11.2010 —
      // die höchste Albedo im gesamten Katalog. Abgerufen/bestätigt 13.09.2026.
      albedo: 0.96,
    },
    appearance: {
      // Ausweichfarbe für die Ladezeit der Textur (unten) und für den
      // seltenen Fehlschlagsfall: sehr helles, nahezu weißes Grau (Albedo
      // 0,96 laut Sicardy et al. 2011 — die höchste im gesamten Katalog,
      // gefrorener Stickstoff auf der Oberfläche, ähnlich Plutos Tombaugh
      // Regio).
      textures: { albedo: 'textures/eris/albedo.jpg' },
      color: '#f1efe9',
    },
    info: { nameKey: 'body.eris.name' },
  },
  {
    id: 'haumea',
    parent: 'sun',
    kind: 'dwarf',
    orbit: {
      // JPL SBDB, sstr=Haumea, orbit_id "132", Epoche JD 2461200.5
      // (2026-06-19 TDB).
      a: 43.06029023650952,   aDot: 0,
      e: 0.19444301488988,    eDot: 0,
      i: 28.20847393040364,   iDot: 0,
      L: 192.00768762,        LDot: 127.40277,
      lp: 2.47660338,         lpDot: 0,
      node: 121.78605613,     nodeDot: 0,
      frame: 'ecliptic',
    },
    physical: {
      // Haumea ist stark elongiert (schnellste Rotation aller großen
      // Körper des Sonnensystems, siehe rotationPeriodH). Wie bei den
      // dreiachsigen Saturnmonden (saturn-monde.ts) wird radiusKm als
      // geometrisches Mittel der drei Halbachsen gebildet, hier aus
      // Proudfoot, Grundy, Rommel, Fernández-Valenzuela, Ragozzine (2026),
      // "Triaxial shapes and densities of G!kún|'hòmdímà, Haumea, and Varda
      // from stellar occultations", The Planetary Science Journal,
      // arXiv:2605.28636 — Vollachsen 2122 × 1688 × 1036 km, also
      // Halbachsen a=1061 km, b=844 km, c=518 km:
      // (1061 × 844 × 518)^(1/3) = 774,1 km. Das revidiert die ältere,
      // aus einer einzelnen Sternbedeckung gewonnene Bestimmung von Ortiz
      // et al. (2017), Nature 550, 219-223 (Halbachsen 1161 × 852 × 513 km,
      // geometrisches Mittel 797,6 km, rund 3 % größer) — kein
      // Übertragungsfehler, sondern eine echte Revision durch mehr
      // Bedeckungsdaten.
      radiusKm: 774.1,
      // Proudfoot, Ragozzine, Giforos, Grundy, MacDonald u. a. (2024),
      // aus der Bahnbewegung der beiden Monde Hi'iaka und Namaka.
      massKg: 3.952e21,
      // Santos-Sanz et al. (2017)/SBDB: 3,915341 h — mit Abstand die
      // schnellste Rotation aller Körper dieses Katalogs.
      rotationPeriodH: 3.915341,
      // ANNAHME (Lichtkurven-Inversion, kein direkt gemessener Pol):
      // Kondratyev & Kornoukhov (2018), zwei spiegelsymmetrische Lösungen
      // (282,6°/−13,0° oder 282,6°/−11,8°) — hier die erste übernommen,
      // beide liegen nur 1,2° auseinander.
      pole: { raDeg: 282.6, decDeg: -13.0 },
      rotationAtEpochDeg: 0,
      // Ortiz et al. (2017), Nature 550, 219, arXiv:2006.03113: p_V = 0,51 ±
      // 0,02 aus der Sternbedeckung vom 21.01.2017 — bestätigt 13.09.2026.
      // Frühere, thermale Bestimmungen streuen deutlich höher (0,7-0,8, s.
      // Spec, Abschnitt 7); der Okkultationswert gilt als der genauere.
      albedo: 0.51,
    },
    appearance: {
      // Ausweichfarbe für die Ladezeit der Textur (unten) und für den
      // seltenen Fehlschlagsfall: sehr helles Grauweiß (kristallines
      // Wassereis an der Oberfläche, hohe Albedo).
      textures: { albedo: 'textures/haumea/albedo.jpg' },
      color: '#e6e2da',
    },
    info: { nameKey: 'body.haumea.name' },
  },
  {
    id: 'makemake',
    parent: 'sun',
    kind: 'dwarf',
    orbit: {
      // JPL SBDB, sstr=Makemake, orbit_id "130", Epoche JD 2461200.5
      // (2026-06-19 TDB).
      a: 45.57093317300052,   aDot: 0,
      e: 0.15888899539925,    eDot: 0,
      i: 29.02785603743067,   iDot: 0,
      L: 155.39032853,        LDot: 117.02063,
      lp: 16.38710716,        lpDot: 0,
      node: 79.29483382,      nodeDot: 0,
      frame: 'ecliptic',
    },
    physical: {
      // Brown (2013), "The Absolute Magnitudes of Kuiper Belt Objects" /
      // Sternbedeckung 2011: mittlerer Radius 715 km (Vollachsen rund
      // 1434 × 1420 km, nur leicht abgeplattet — anders als Haumea nahe
      // genug an einer Kugel, um keinen eigenen Dreiachsen-Mittelwert zu
      // brauchen).
      radiusKm: 715,
      // Bamberger (2025), aus der Bahn des 2016 entdeckten Mondes
      // S/2015 (136472) 1 ("MK 2").
      massKg: 2.69e21,
      // Die Rotationsperiode ist in der Literatur mit Stand 2025 nicht
      // eindeutig geklärt: Die Lichtkurve zeigt entweder ein oder zwei
      // Maxima je Umdrehung, was 11,4 h oder 22,8266 h ergibt (Hromakina
      // et al. 2019; Kiss et al. 2024 bestätigen die Mehrdeutigkeit).
      // JPL SBDB (LCDB) führt den doppelten Wert 22,8266 h — hier
      // übernommen, mit derselben ausdrücklichen Unsicherheit.
      rotationPeriodH: 22.8266,
      // ANNAHME, keine Messung — s. Quellenblock am Dateianfang: Für
      // Makemake ist nur ein Kippwinkelbereich zur eigenen Bahn publiziert
      // (46°-78°, angenommen gleich dem Bahnpol des Mondes MK 2), keine
      // vollständige Achsrichtung. Hier ersatzweise die eigene
      // Bahnnormale.
      pole: { raDeg: 317.9202, decDeg: 50.0297 },
      rotationAtEpochDeg: 0,
      // Ortiz et al. (2012), Nature 491, 566, doi 10.1038/nature11597:
      // p_V = 0,77 ± 0,03 aus der Sternbedeckung vom 23.04.2011. Bestätigt
      // 13.09.2026.
      albedo: 0.77,
    },
    appearance: {
      // Ausweichfarbe für die Ladezeit der Textur (unten) und für den
      // seltenen Fehlschlagsfall: helles, rötlich-oranges Tan (Albedo 0,82
      // laut Hromakina et al. 2019 — hell wie Eris, aber mit Methaneis und
      // Tholinen ähnlich Pluto gefärbt).
      textures: { albedo: 'textures/makemake/albedo.jpg' },
      color: '#d9a679',
    },
    info: { nameKey: 'body.makemake.name' },
  },
];
