# Belege: thema-bahnelemente (Hochschule)

Abrufe und Nachrechnungen vom 17.09.2026. „Herleitung" heißt: folgt rechnerisch aus den
Definitionen oder aus den Nachbarzeilen, ohne eigene Literaturstelle. Horizons-Abfragen liefen über
`https://ssd.jpl.nasa.gov/api/horizons.api` (Ephemeride laut Kopfzeile DE441); die Parameter stehen
in der Fundstelle.

| Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
|---|---|---|---|---|---|
| 1 | Orrery bewegt jeden Körper allein über Bahnelemente (Kepler-Formel je Körper) | – | Datensatz: src/sim/orbit.ts | positionAt, positionInParentFrame | |
| 2 | Relativbewegung zweier Punktmassen mit μ = G(M + m) | r̈ = −μ r/r³ | literatur:tremaine-2009 | Abschnitt 2.1, Gl. (1)–(2) für ein Testteilchen um M; Übertragung auf die Relativbewegung mit μ = G(M + m) ist Standard (Herleitung) | |
| 3 | Spezifische Energie erhalten, gleich −μ/(2a) | ε = v²/2 − μ/r = −μ/(2a) | literatur:tremaine-2009 | Abschnitt 2.1, Gl. (1) | |
| 4 | Drehimpuls h = r × v erhalten, h² = μa(1 − e²) | – | literatur:tremaine-2009 | Abschnitt 2.1, Gl. (2) und Satz danach („L² = GMa(1 − e²)") | |
| 5 | Exzentrizitätsvektor erhalten, e = (v × h)/μ − r/r, Betrag e | – | literatur:tremaine-2009 | Abschnitt 2.1, Gl. (2), dort als (1/GM) v × (r × v) − r/r | |
| 6 | Exzentrizitätsvektor ist bis auf den Faktor μ der Laplace-Runge-Lenz-Vektor | – | Herleitung | Benennung; Tremaine et al. nennen ihn „eccentricity vector" | |
| 7 | Nebenbedingungen e·h = 0 und e² = 1 + 2εh²/μ², daher fünf unabhängige Integrale, sechstes Element für den Ort | 7 Komponenten, 5 Integrale | Herleitung | aus Nr. 3–5 (e² = 1 − (1 − e²) mit ε = −μ/(2a)) | |
| 8 | Drittes Keplersches Gesetz aus Flächensatz und Ellipsenfläche | T² = 4π²a³/(G(M☉ + m)) | Herleitung | T = 2πab/h mit b = a√(1 − e²); im Code src/sim/orbit.ts, umlaufzeitTage | |
| 9 | Unsicherheit von G fünf Größenordnungen größer als die von GM☉ | fünf Größenordnungen | literatur:prsa-2016 | Abschnitt 1 („Because the uncertainty in G is five orders of magnitude larger …") und Resolutionstext Punkt (3) | |
| 10 | Nomineller solarer Massenparameter nach IAU 2015 B3 | 1,3271244·10²⁰ m³ s⁻² | literatur:prsa-2016 | Tabelle 1 | |
| 11 | JPL-Näherungstafeln führen ϖ und L; ω = ϖ − Ω, M = L − ϖ | – | quelle:jpl-approx-pos | Abschnitt „Formulae for using the Keplerian elements", Schritt 2 | |
| 12 | Tabelle: Ω unbestimmt bei I → 0 und I → 180°, ω zusätzlich bei e → 0, ϖ bei e → 0 und I → 180°, M bei e → 0, L bei I → 180° | – | Herleitung | aus den Definitionen; I = 180° (nur Ω − ω bestimmt) passt zu literatur:bau-2021, Abschnitt 1 | |
| 13 | Venus: e und Rate von ϖ in den beiden JPL-Tafeln | e = 0,0068; 0,0027° und 0,0568° je Jh. | quelle:jpl-approx-pos | Table 1 (e = 0,00677672, ϖ̇ = 0,00268329) und Table 2a (ϖ̇ = 0,05679648) | |
| 14 | Newton-Iteration für die Keplergleichung | E_{k+1} = E_k − (E_k − e sin E_k − M)/(1 − e cos E_k) | quelle:jpl-approx-pos | Abschnitt „Solution of Kepler's Equation" (gleichwertige Form mit ΔM, ΔE) | |
| 15 | Quadratische Konvergenz im Einzugsbereich; beweisbare Bereiche in (e, M) mit Konvergenz und A-priori-Fehlerschranke für verbreitete Startwerte; schneller mit e → 0 | – | literatur:elipe-2017 | Zusammenfassung (q-Konvergenz mit Schranke q^(2ⁿ−1); „convergence rate … tends to zero as e → 0"; „a priori estimates") | |
| 16 | Bei e → 1 und kleinem M wird 1 − e cos E klein | – | Herleitung | cos E ≈ 1 für kleines E, also 1 − e cos E ≈ 1 − e | |
| 17 | Startwert E₀ = M: chaotisches Verhalten bei sehr großer Exzentrizität, zeitweises Pendeln zwischen zwei falschen Werten; E₀ = π konvergiert stets schnell | – | literatur:charles-1997 | Zusammenfassung | |
| 18 | JPL-Anleitung: M auf ±180° normieren, E₀ = M + e sin M, Toleranz 10⁻⁶ Grad | 10⁻⁶ Grad | quelle:jpl-approx-pos | Schritt 3 und Abschnitt „Solution of Kepler's Equation"; gleichlautend Standish und Williams, Explanatory Supplement, Kap. 8.10.2 (Archivkopie des JPL-PDF XSChap8.pdf) | |
| 19 | Koordinaten in der Bahnebene | ξ = a(cos E − e), η = a√(1 − e²) sin E | quelle:jpl-approx-pos | Schritt 4 (dort x′, y′) | |
| 20 | Drei Drehungen in die Ekliptik | r = R_z(−Ω) R_x(−I) R_z(−ω) ρ | quelle:jpl-approx-pos | Schritt 5 | |
| 21 | z-Komponente z = r sin I sin(ω + ν); Breite hängt bei gegebenem I nur vom Argument der Breite ab | – | Herleitung | aus Schritt 5 der JPL-Formeln mit x′ = r cos ν, y′ = r sin ν | |
| 22 | Tafeln beziehen sich auf mittlere Ekliptik und Äquinoktium J2000 | – | quelle:jpl-approx-pos | Überschriften von Table 1 und Table 2a | |
| 23 | Horizons erzeugt die Ekliptik J2000 durch Drehung des ICRF um die x-Achse um den festen IAU-76/80-Wert | 84 381,448″ | quelle:jpl-horizons | Handbuch https://ssd.jpl.nasa.gov/horizons/manual.html, Abschnitte „Ecliptic of Standard Epoch" und Absatz „When transforming between the underlying ICRF reference frame …" | |
| 24 | Mittlere Bahnebene wegen gegenseitiger Bewegung von Erde und Mond bei hoher Genauigkeit mehrdeutig | – | quelle:jpl-horizons | Handbuch, Abschnitt „Ecliptic of Standard Epoch" | |
| 25 | DE440/DE441 mit ICRF3 ausgerichtet | höchstens 0,0002″ | quelle:jpl-horizons | Handbuch, Abschnitt „International Celestial Reference Frame (ICRF)" | |
| 26 | IAU-Arbeitsgruppe empfahl Definition des Ekliptikpols über den mittleren Bahndrehimpuls des Erde-Mond-Schwerpunkts im BCRS | – | literatur:hilton-2006 | Zusammenfassung | |
| 27 | Zeit ab J2000,0 in julianischen Jahrhunderten, Zeitskala TDB | T = (JD_TDB − 2451545,0)/36525 | quelle:jpl-approx-pos | Formelteil („Teph … equivalent to … JDTDB"; „T = (Teph − 2451545.0)/36525") | |
| 28 | TT und TDB unterscheiden sich periodisch um höchstens 2 ms | 2 ms | quelle:jpl-horizons | Handbuch, Abschnitt zu den Zeitskalen („at most, 0.002 seconds") | |
| 29 | TDB − UTC am 1.1.2000, 12 Uhr UTC, und am 17.09.2026 | 64,18 s; 69,18 s | quelle:jpl-horizons | Beobachtertabelle Größe 30 (TDB-UT), COMMAND=10, CENTER=500@399, TLIST 2451545,0 und 2461300,5 (UT): 64,183903 s und 69,182454 s | |
| 30 | Erde in den Tafeln ist der Erde-Mond-Schwerpunkt | – | quelle:jpl-approx-pos | Zeile „EM Bary", Fußnote | |
| 31 | Table 1: Ω = 0 und Ω̇ = 0 fest, I = −0,00001531° mit İ = −0,01294668° je Jh.; Nulldurchgang Ende 1999 | −0,0129° je Jh.; Ende 1999 | quelle:jpl-approx-pos | Table 1, Zeile EM Bary; Nulldurchgang gerechnet bei T = −0,00118 Jh. (19.11.1999) | |
| 32 | Negative Inklination gleichwertig mit positiver bei Ω + 180° | – | Herleitung | Drehung R_x(−I) mit R_z(180°) | |
| 33 | Table 2a (3000 v. Chr. bis 3000 n. Chr.) setzt Ω der Erde auf −5,11° | −5,11° | quelle:jpl-approx-pos | Table 2a, Zeile EM Bary (−5,11260389°) | |
| 34 | Pluto-Schwerpunkt, oskulierende Elemente 2000–2030 jährlich, heliozentrisch gegen baryzentrisch | a 39,230–39,860 gegen 39,487–39,489 AE; e 0,2445–0,2544 gegen 0,24898–0,24903; I 17,098–17,176° gegen 17,1406–17,1408° | quelle:jpl-horizons | ELEMENTS, COMMAND=9, CENTER=500@10 beziehungsweise 500@0, REF_PLANE=ECLIPTIC, 2000-01-01 bis 2030-01-01, Schritt 1 a; Extremwerte a 39,22997/39,86023 und 39,48738/39,48946; e 0,244453/0,254378 und 0,248976/0,249029; I 17,09845/17,17601 und 17,14056/17,14078 | |
| 35 | Größtes heliozentrisches a 2008 und 2020 (Takt des Jupiterumlaufs) | 2008, 2020 | quelle:jpl-horizons | wie Nr. 34: lokale Maxima 39,8078 AE (2008) und 39,8602 AE (2020) | |
| 36 | Schwankung, weil die Sonne um den Schwerpunkt des Systems läuft | – | Herleitung | Deutung von Nr. 34/35 (Unterschied allein im Zentrum Sonne gegen Baryzentrum, Periode rund 12 a); keine eigene Literaturstelle | |
| 37 | Problem mit drei und mehr Körpern nicht integrabel; säkulare Terme der Störfunktion liefern analytische Näherung für Planeten und Monde | – | literatur:murray-2000 | Kapitel 7 „Secular Perturbations", Einleitung (Vorschau auf Cambridge Core) | |
| 38 | Laplace und Lagrange: in erster Ordnung in Massen, Exzentrizitäten, Neigungen quasiperiodisch | – | literatur:laskar-1989 | Zusammenfassung, erster Satz | |
| 39 | Säkulartheorie zweiter Ordnung in den Massen, fünfter in e und I, über 200 Myr integriert, chaotisch; größter Ljapunow-Exponent; innere Planeten über einige zehn Myr nicht vorhersagbar | etwa 1/(5 Myr); 200 Myr | literatur:laskar-1989 | Zusammenfassung | |
| 40 | JPL-Näherungselemente: angepasst, keine Mittelung, außerhalb des Fensters ungültig | – | quelle:jpl-approx-pos | Abschnitt „Introduction"; gleichlautend Standish und Williams, Kap. 8.10 | |
| 41 | Nominelle Fehler 1800–2050 in heliozentrischer Länge | Merkur 15″, Jupiter 400″, Saturn 600″ | quelle:jpl-approx-pos | Abschnitt „Accuracy", Tabelle | |
| 42 | Für 3000 v. Chr. bis 3000 n. Chr. Zusatzglieder in M für Jupiter bis Neptun | b T² + c cos(fT) + s sin(fT) | quelle:jpl-approx-pos | Schritt 2 und Table 2b | |
| 43 | Lineare Rate fasst säkulare Drift und im Fenster wirksamen Teil langperiodischer Terme zusammen; angepasste a und L̇ erfüllen Kepler III nicht exakt | – | Herleitung | Folgerung aus Nr. 40; zahlenmäßig Nr. 60 | |
| 44 | Mittlere Mondelemente des JPL: Elemente einer präzedierenden Ellipse, nach kleinsten Quadraten an die integrierte Bahn angepasst, nicht für Ephemeriden | – | quelle:jpl-satelliten-bahnen | Abschnitt „Warning!" | |
| 45 | DE440 und DE441 numerisch integriert und an Beobachtungen angepasst; Zeitspannen | 1550–2650; −13 200 bis +17 191 | literatur:park-2021 | Zusammenfassung | |
| 46 | Äquinoktiale Elemente h, k, p, q mit tan(I/2), dazu a und mittlere Länge zur Epoche | – | literatur:bau-2021 | Abschnitt 1, Gl. (1) (dort Druckfehler: q mit sin Ω) und Gl. (30)–(31) mit cos Ω; Bezeichnung nach Broucke und Cefola 1972 | |
| 47 | Zugehörige Matrizen (partielle Ableitungen von Ort und Geschwindigkeit nach den Elementen und Umkehrung) frei von Singularitäten für e = 0 und I = 0°, 90° | – | literatur:broucke-1972 | Zusammenfassung | |
| 48 | Singulär bleiben retrograde äquatoriale Bahnen und geradlinige Bewegung; eine Variante (Cefola 1972) verschiebt die Singularität nach I = 0 | – | literatur:bau-2021 | Abschnitt 1, zweiter und dritter Absatz | |
| 49 | Io in der JPL-Tabelle: I = 0,0°, keine Knotenperiode; Datensatz nodeDot = 0 | I = 0,0° | quelle:jpl-satelliten-bahnen | Zeile Io (i 0.0, node 0.0, P node 0.000); Datensatz src/data/bodies/jupiter-monde.ts | |
| 50 | Deimos in der JPL-Tabelle: e = 0,000, keine Periapsisperiode; Datensatz lpDot = 0 | e = 0,000 | quelle:jpl-satelliten-bahnen | Zeile Deimos (e 0.000, P apsis 0.0); Datensatz src/data/bodies/mars-monde.ts | |
| 51 | Fünf große Uranusmonde mit Inklination nahe 180° gegen den IAU-Nordpol; bei vier 0,003° bis 0,19° davon entfernt; oskulierender Knoten über 40 Jahre ohne belastbaren linearen Trend; nodeDot = 0 | 0,003° bis 0,19°; 40 Jahre | Datensatz: src/data/bodies/uranus-monde.ts | Quellenblock, Absätze „URANUS LIEGT" und „BEFUND — nodeDot"; Miranda liegt bei 175,572° | |
| 52 | Bahndynamik der meisten Monde bestimmt durch Quadrupol des Äquatorwulsts und Gezeitenfeld der Sonne | – | literatur:tremaine-2009 | Zusammenfassung, erster Satz | |
| 53 | Klassische Laplace-Fläche (kreisförmige Bahnen): säkulare Entwicklung verschwindet; nahe am Planeten Äquator, weit draußen Bahnebene; Übergang beim Laplace-Radius | – | literatur:tremaine-2009 | Zusammenfassung; Abschnitt 1 | |
| 54 | Laplace-Radius, J₂ einschließlich innerer Monde | r_L⁵ = J₂ R_p² a_p³ (1 − e_p²)^(3/2) M_p/M☉ | literatur:tremaine-2009 | Gl. (24) mit J′₂ nach Gl. (4) | |
| 55 | JPL-Definition der Laplace-Ebene (Ebene der mittleren Knotenpräzession), für typische Monde zwischen Äquator- und Bahnebene | – | quelle:jpl-satelliten-bahnen | Erläuterung „Orbital Reference Frame: Laplace" | |
| 56 | Saturn: Laplace-Radius; Iapetus bei 59 Planetenradien | r_L = 48,4 R_p; a = 59 R_p | literatur:tremaine-2009 | Tabelle 1 (48,40); Abschnitt 6 „Applications" (a = 59 R_p, r_L = 48 R_p) | |
| 57 | Iapetus: Laplace-Ebene gegen Saturns Äquator, Bahn gegen Laplace-Ebene, Knotenperiode | 14,8°; 7,6°; 3130 Jahre | quelle:jpl-satelliten-bahnen | Zeile Iapetus (Tilt 14.8, i 7.6, P node 3130.302) | |
| 58 | Erdmond bei JPL gegen die Ekliptik, I und Knotenperiode | 5,16°; 18,6 Jahre | quelle:jpl-satelliten-bahnen | Zeile Moon (Frame ecliptic, i 5.16, P node 18.600) | |
| 59 | Planeten im Modell: Table 1 (1800–2050), Ekliptik J2000, lineare Raten, Erde als Erde-Mond-Schwerpunkt; Warnung außerhalb des Fensters | – | Datensatz: src/data/bodies/earth.ts (und übrige Planeten) | Quellenkommentare; Warnung src/ui/format.ts (isOutOfRange), src/ui/i18n/de.ts (info.ausserhalbFenster) | |
| 60 | Zwergplaneten: oskulierende heliozentrische SBDB-Elemente zu eigener Epoche, alle Raten außer L̇ null | – | Datensatz: src/data/bodies/zwergplaneten.ts, src/data/bodies/pluto-system.ts | Quellenblöcke und Felder aDot … nodeDot | |
| 61 | Pluto: Epoche JD 2457588,5 = 19. Juli 2016; Elemente gleich der heliozentrischen oskulierenden Bahn des Pluto-Schwerpunkts aus DE441 | 19. Juli 2016 | quelle:jpl-horizons | SBDB-API sstr=Pluto (epoch 2457588.5, a 39,58862938517124) gegen Horizons ELEMENTS COMMAND=9, CENTER=500@10, TLIST=2457588,5 (a 39,58862938520038, e und I in allen Stellen gleich); Hinweis: der Kommentar im Datensatz nennt „2016-07-31", JD 2457588,5 ist aber der 19.07.2016 | |
| 62 | Plutos Modellort gegen DE441 (heliozentrischer Winkelabstand) | 2000: 0,05°; 2050: 0,13°; 1900: 0,15°; 1800: 1,4° | quelle:jpl-horizons | Nachrechnung positionAt (src/sim/orbit.ts) gegen VECTORS COMMAND=9, CENTER=500@10, Ekliptik J2000, TDB: 0,0513° / 0,1348° / 0,1486° / 1,3949° (1850: 0,58°, 1950: 0,15°, 2030: 0,04°) | |
| 63 | Erdmond: mittlere ekliptikale Elemente, lineare Knoten- und Apsidendrehung, keine periodischen Glieder | – | Datensatz: src/data/bodies/moon.ts | Quellenblock (NSSDC, Meeus) | |
| 64 | Übrige Monde gegen den Äquator des Mutterkörpers mit festem IAU-Pol zu J2000; Knotenlänge ab dem Knoten auf dem ICRF-Äquator; Datenblock zeigt diesen Wert | – | Datensatz: src/sim/orbit.ts, src/sim/frames.ts, src/ui/info/datenzeilen.ts | bezugsrahmen, icrfKnotenVersatzDeg; datenzeilen zeigt orbit.node unverändert | |
| 65 | Mars- und Jupitermonde mit mittleren JPL-Elementen, Laplace-Ebene gleich Äquator; Abweichung Kallisto und Deimos | 0,4°; 0,9° | quelle:jpl-satelliten-bahnen | Spalte Tilt (Callisto 0.4, Deimos 0.9); Datensätze src/data/bodies/mars-monde.ts, jupiter-monde.ts | |
| 66 | Saturn-, Uranus-, Neptun-, Plutomonde: oskulierende Horizons-Elemente zu J2000, Präzessionsraten aus der JPL-Tabelle, wo gegen Horizons bewährt, sonst null | – | Datensatz: src/data/bodies/saturn-monde.ts, uranus-monde.ts, neptun-monde.ts, pluto-system.ts | Quellenblöcke (Uranus: nodeDot = 0; Triton und Charon: Raten 0) | |
| 67 | Iapetus: Knoten präzediert im Modell um Saturns Pol; Neigung gegen Saturns Äquator weicht von Horizons ab | 2050: 0,71°; 2076: 1,11° | Datensatz: src/sim/monde.fixture.test.ts | Kommentar vor NEIGUNGS_SCHRANKE_GRAD (0,711° und 1,109°) | |
| 68 | Keplerlöser der Simulation: Newton, E₀ = M + e sin M, M auf [−π, π], Abbruch bei Schritt unter 10⁻¹² rad, höchstens 30 Schritte | 10⁻¹² rad; 30 | Datensatz: src/sim/kepler.ts | solveKepler | |
| 69 | Nachrechnung desselben Verfahrens auf 200 001 gleichabständigen M in [−π, π]: Eris (e = 0,43823853) höchstens 5 Schritte; e = 0,99 höchstens 10; e = 0,999: 943 Werte ohne Abbruchkriterium, alle mit 0,006 ≤ \|M\| ≤ 0,112 rad | 5; 10; 943 | Datensatz: src/sim/kepler.ts | eigener Nachbau mit Schrittzähler (Bericht Task 10); Vergleich E₀ = M: Fehlschläge ab e = 0,99; E₀ = π: höchstens 17 Schritte bis e = 0,9999 | |
| 70 | Größte Exzentrizität im Katalog ist Eris | 0,438 | Datensatz: src/data/bodies/zwergplaneten.ts | Feld e (0,43823853479717); alle übrigen e ≤ 0,252 | |
| 71 | Datenblock rechnet Umlaufzeit nach Kepler III aus a zur Epoche und G(M + m), G nach CODATA 2018 | – | Datensatz: src/sim/orbit.ts | umlaufzeitTage, G_KM3 = 6,67430·10⁻²⁰ km³ kg⁻¹ s⁻² | |
| 72 | G·M☉ im Modell über dem nominellen Massenparameter; Planetenperioden rechnerisch zu kurz | 4,5·10⁻⁵; 0,002 % | literatur:prsa-2016 | Rechnung 6,67430·10⁻¹¹ · 1,9885·10³⁰ (src/data/bodies/sun.ts) = 1,3271846·10²⁰ gegen 1,3271244·10²⁰ (Tabelle 1): +4,53·10⁻⁵, Periodenfaktor −0,0023 % | |
| 73 | Kepler-Umlaufzeit gegen 360°/L̇: Uranus, Neptun länger, Erdmond kürzer | 0,05 %; 0,06 %; 0,11 % | Datensatz: src/data/bodies/uranus.ts, neptune.ts, moon.ts | Nachrechnung umlaufzeitTage gegen 36525·360/LDot: +0,047 %, +0,058 %, −0,110 %; übrige Planeten und Zwergplaneten zwischen −0,006 % und 0,000 % | |
| 74 | Uhr zählt julianische Tage in UTC und setzt sie ohne Umrechnung als TDB ein | – | Datensatz: src/ui/panels/TimePanel.tsx, src/sim/time.ts | dateToJd(new Date()) ohne Zeitskalenumrechnung; keine TDB-Umrechnung im Quellbaum | |
| 75 | 69 s verschieben Merkur in heliozentrischer Länge | 8″ bis 18″ | Herleitung | n = 149 472,674°/Jh. = 4,0923°/d; Faktor (1 ± e)²/(1 − e²)^(3/2) mit e = 0,2056; 69,18 s ergeben 7,9″ (Aphel) bis 18,3″ (Perihel), mittlere Bewegung 11,8″; Vergleich nomineller Fehler 15″ (Nr. 41) | |

Prüfskript `npm run literatur:pruefen -- --nur bau-2021,broucke-1972,charles-1997,elipe-2017,hilton-2006,laskar-1989,murray-2000,park-2021,prsa-2016,tremaine-2009`
am 17.09.2026: 13 ok, 0 Warnungen, 0 Fehler.

Anmerkungen:

- `murray-2000`: Crossref und Cambridge Core nennen als Druckjahr 2000 (Februar 2000); in der
  Literatur wird das Buch häufig als 1999 zitiert (etwa Tremaine et al. 2009, Literaturliste).
  Kennung und Jahr folgen den Verlagsangaben.
- `elipe-2017`: Crossref führt die Autoren in der Reihenfolge Elipe, Montijano, Rández, Calvo;
  die Verlagsseite ebenso.
- Standish und Williams (Explanatory Supplement, Kap. 8) sind nicht im Katalog: Das Kapitel hat
  keine DOI, die frühere JPL-Adresse des PDF ist nicht mehr erreichbar. Die zitierten Angaben
  stehen wortgleich auf der JPL-Seite (`quelle:jpl-approx-pos`), die das Kapitel als Herkunft nennt.
