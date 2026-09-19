# Bezugssysteme und Zeitskalen

Eine Ortsangabe im Sonnensystem braucht einen Ursprung, drei Achsenrichtungen und eine Zeitskala,
in der ihr Zeitpunkt gilt. Die Astronomie unterscheidet dabei das Bezugssystem, eine Definition,
von seiner Realisierung, einem Rahmen aus gemessenen Koordinaten
([Petit und Luzum 2010](literatur:petit-2010), Kapitel 2). Dieser Text führt vom Quasarrahmen
über Ekliptik, Präzession und Rotationsmodelle zu den Zeitskalen und Ephemeriden und ordnet ein,
was Orrery davon nutzt.

## Das ICRS und seine Realisierungen

Das International Celestial Reference System (ICRS) ist kinematisch definiert: Seine Achsen
sollen gegenüber der fernen Materie des Universums fest stehen. Der Ursprung liegt im Baryzentrum
des Sonnensystems, die Grundebene nahe dem mittleren Äquator von J2000,0 und der Nullpunkt der
Rektaszension nahe dem dynamischen Äquinoktium dieser Epoche. Die IAU nahm das System 1997 an; am
1. Januar 1998 löste es das FK5-System ab ([Petit und Luzum 2010](literatur:petit-2010),
Kapitel 2). Relativistisch gehören dazu zwei Koordinatensysteme: das baryzentrische BCRS mit der
Zeitkoordinate TCB und das geozentrische GCRS mit TCG, dessen räumliche Achsen gegen das BCRS
kinematisch nicht rotieren. Die Resolution B1.3 von 2000 legte die Richtung der BCRS-Achsen nur
bis auf eine feste Drehung fest ([Soffel et al. 2003](literatur:soffel-2003)); seit der
IAU-Resolution B2 von 2006 sind BCRS und GCRS, sofern nicht anders angegeben, nach den Achsen des
ICRS ausgerichtet ([Petit und Luzum 2010](literatur:petit-2010), Abschnitte 5.2.2 und 5.3.1).

Realisiert wird das ICRS durch Radiopositionen kompakter extragalaktischer Quellen, gemessen mit
Very Long Baseline Interferometry (VLBI). Definierende Quellen halten die Achsen fest; die
Positionen hängen weder von Äquator noch von Äquinoktium oder Ekliptik ab
([Petit und Luzum 2010](literatur:petit-2010), Abschnitte 2.1 und 2.2):

| Realisierung | Quellen | davon definierend | Kennwert | Beleg |
|---|---:|---:|---|---|
| ICRF1 (ab 1998) | 608 | 212 | Achsen stabil auf ±0,02 mas | [Petit und Luzum 2010](literatur:petit-2010) |
| ICRF2 (ab 2010) | 3414 | 295 | Rauschboden ≈ 0,04 mas, Achsen stabil auf 0,01 mas | [Petit und Luzum 2010](literatur:petit-2010) |
| ICRF3 (ab 2019) | 4536 bei 8,4 GHz | 303 | Rauschboden 0,03 mas | [Charlot et al. 2020](literatur:charlot-2020) |

ICRF3 beruht auf fast 40 Jahren VLBI bei 8,4 und 2,3 GHz, ergänzt um Messungen der letzten
15 Jahre bei 24 GHz (824 Quellen) und bei 32 GHz (678 Quellen); in jedem Band sind die Positionen
unabhängig bestimmt. Erstmals ist die Beschleunigung des Sonnensystems zum galaktischen Zentrum
modelliert. Sie erzeugt ein dipolförmiges Feld scheinbarer Eigenbewegungen mit 5,8 µas je Jahr,
deshalb gelten die Positionen zur Epoche 2015,0. Den Rahmen bei 8,4 und 2,3 GHz richtet eine
Bedingung ohne Nettorotation an den 295 definierenden Quellen von ICRF2 aus; andere Auswahlen
dieser Quellen drehen ihn um höchstens 6 µas, weniger als die Richtungsstabilität von ICRF2 von
10 µas. Die IAU nahm ICRF3 im August 2018 an, seit dem 1. Januar 2019 ersetzt es ICRF2
([Charlot et al. 2020](literatur:charlot-2020)).

Im Optischen realisiert Gaia-CRF3 das ICRS; die IAU erklärte 2021 ICRF3 im Radiobereich und
Gaia-CRF3 im Optischen zu Realisierungen des ICRS. Die Orientierung der rund 1,6 Millionen
quasarähnlichen Quellen von Gaia-CRF3 ist über rund 2000 gemeinsame Quellen an ICRF3
angeschlossen; für 3142 optische Gegenstücke von ICRF3-Quellen liegt der Median des Versatzes zum
Radioort bei etwa 0,5 mas ([Gaia Collaboration, Klioner et al. 2022](literatur:gaia-2022)).
Schon gegen den Vorgänger Gaia-CRF2 zeigte ICRF3 keine Verformungen über 0,03 mas; bei 22 % der Quellen liegen optischer Ort und Radioort aber
signifikant auseinander, möglicherweise wegen ausgedehnter Quellstrukturen
([Charlot et al. 2020](literatur:charlot-2020)). Einen Überblick gibt
[International Celestial Reference System](quelle:wikipedia-de-icrs).

## Ekliptik, Äquinoktium und Rahmenversatz

Bahnelemente beziehen sich traditionell auf Ekliptik und Äquinoktium einer Epoche. Beide sind
dynamisch bestimmt und fallen nicht exakt mit den Achsen des ICRS zusammen. Der mittlere Pol von
J2000,0 liegt um

$$\xi_0 = -16{,}617\,\mathrm{mas}, \quad \eta_0 = -6{,}819\,\mathrm{mas}$$

neben dem Pol des GCRS, zusammen 18 mas, und das mittlere Äquinoktium von J2000,0 hat im GCRS die
Rektaszension $\mathrm{d}\alpha_0 = -14{,}60\,\mathrm{mas}$
([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.21 und 5.33). Gemeint ist das inertiale
Äquinoktium: Die Ekliptik steht senkrecht auf dem Bahndrehimpuls des Erde-Mond-Schwerpunkts,
gerechnet mit der Geschwindigkeit gegen ein Inertialsystem und nicht gegen die sich drehende
Bahnebene ([Petit und Luzum 2010](literatur:petit-2010), Abschnitt 5.5.4).

Die mittlere Schiefe der Ekliptik zu J2000,0 beträgt nach IAU 2006 84 381,406″ mit 0,001″
Unsicherheit; das Modell IAU 2000 verwendete noch 84 381,448″
([Petit und Luzum 2010](literatur:petit-2010), Tabelle 1.1 und Abschnitt 5.6.2). Mit einer
Schiefe $\varepsilon_0$ gehen äquatoriale Koordinaten $\vec{r}_\alpha$ und ekliptikale
Koordinaten $\vec{r}_\lambda$ derselben Epoche durch eine Drehung des Achsenkreuzes um die x-Achse
zum Frühlingspunkt ineinander über:

$$\vec{r}_\lambda = R_x(\varepsilon_0)\,\vec{r}_\alpha$$

Genau so, mit 84 381,448″ und ohne Rahmenversatz, entsteht die feste Ekliptik J2000 von JPL
Horizons ([Bahnelemente](thema:bahnelemente)). Die Näherungstafeln der Planeten beziehen sich auf
die mittlere Ekliptik und das Äquinoktium J2000 und geben für die Umrechnung ins ICRF die Schiefe
23,43928° an, also 84 381,408″ — im Rahmen ihrer Genauigkeit dieselbe Ebene, denn ihre nominellen
Fehler in heliozentrischer Länge reichen im Zeitraum 1800 bis 2050 von 10″ bei Neptun bis 600″ bei
Saturn. Gegen die Ekliptik J2000 nach IAU 2006 ist die Ebene von Horizons um 0,04″ geneigt, und ihr
Schnitt mit dem ICRF-Äquator liegt
0,05″ verschoben ([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.40 zur Epoche).

## Präzession, Nutation und das Äquinoktium des Datums

Drehmomente von außen bewegen die Rotationsachse der Erde im Raum. Präzession heißt der säkulare
Teil dieser Bewegung zusammen mit dem Term von rund 26 000 Jahren Periode, Nutation der übrige
Teil ([Petit und Luzum 2010](literatur:petit-2010), Glossar). Zugleich neigt sich die Bahnebene
des Erde-Mond-Schwerpunkts gegen die feste Ekliptik von J2000,0
([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.38). Koordinaten „des Datums" beziehen sich
deshalb auf den mittleren Äquator und das mittlere Äquinoktium eines Zeitpunkts, „wahre"
Koordinaten zusätzlich auf die Nutation.

In der Präzession IAU 2006 wächst der Winkel $\psi_A$ um 5038,48″ je julianischem Jahrhundert
(Gl. 5.39). Die allgemeine Präzession in Länge $p_A$, wie sie die Conventions als Argument der
Planetennutation führen, wächst um 0,02438175 rad je Jahrhundert (Gl. 5.44); ein Umlauf dauert
danach rund 25 770 Jahre ([Petit und Luzum 2010](literatur:petit-2010)). Bis zum 17. September 2026 ist das mittlere
Äquinoktium damit um 0,37° längs der Ekliptik gewandert. Der Himmelspol hat sich nach dem
polynomialen Teil der Reihen für die Koordinaten des CIP um rund 0,15° vom Pol des GCRS entfernt
([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.16).

Der größte Nutationsterm hat als Argument die mittlere Länge des aufsteigenden Mondknotens
$\Omega$, deren Periode 18,6 Jahre beträgt; seine Amplituden sind 17,206″ in Länge und 9,205″ in
Schiefe. IAU 2000A umfasst 678 lunisolare und 687 planetare Terme. Weil die freie Kernnutation
nicht vorhersagbar ist, legt das Modell die Richtung des Himmelspols im GCRS nur auf etwa 0,3 mas
fest ([Petit und Luzum 2010](literatur:petit-2010), Abschnitt 5.6.1 und Gl. 5.43).

Seit IAU 2000 ist die Erdrotation von Präzession und Nutation getrennt. Der Erdrotationswinkel
$\theta$ zählt auf dem Äquator des Celestial Intermediate Pole (CIP) vom nicht rotierenden Ursprung
CIO zum TIO und ist linear mit UT1 verknüpft:

$$\theta = 2\pi\,(0{,}7790572732640 + 1{,}00273781191135448\,T_\mathrm{u})$$

mit $T_\mathrm{u}$ als julianischem Datum in UT1 minus 2 451 545,0. Die Sternzeit folgt als
$\mathrm{GST} = \theta - \mathrm{EO}$; die Gleichung der Ursprünge EO enthält die seit J2000,0
aufgelaufene Präzession und Nutation in Rektaszension
([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.14 und 5.30).

## Laplace-Ebene der Monde

Für Monde ist weder die Ekliptik noch der Äquator des Planeten von vornherein die natürliche
Bezugsebene. Die Bahnen der meisten Monde bestimmen der Quadrupol des Äquatorwulsts und das
[Gezeitenfeld der Sonne](thema:gezeiten). Auf der klassischen Laplace-Fläche, definiert für kreisförmige Bahnen,
verschwindet die langfristige Entwicklung durch beide Kräfte, Lage und Form der Bahn bleiben fest;
nahe am Planeten fällt die Fläche mit dessen Äquator zusammen, weit draußen mit dessen Bahnebene.
Eine dissipative Scheibe um den Planeten sollte sich in ihr einstellen, und aus ihr entstandene
Monde laufen wahrscheinlich in ihr oder nahe bei ihr. Übersteigt die Schiefe des Planeten
68,875°, ist die klassische Laplace-Fläche in einem Bereich von Halbachsen instabil
([Tremaine et al. 2009](literatur:tremaine-2009)). Wie das JPL mittlere Mondelemente gegen die
Laplace-Ebene angibt und wo der Übergang zwischen Äquator und Bahnebene liegt, beschreibt
[Bahnelemente](thema:bahnelemente).

## Rotationsmodelle der IAU

Die Arbeitsgruppe der IAU für kartographische Koordinaten und Rotationselemente beschreibt die
Orientierung eines Planeten oder Mondes im ICRF durch drei Winkel. Rektaszension $\alpha_0$ und
Deklination $\delta_0$ geben den Nordpol an, den Pol auf der Nordseite der invariablen Ebene des
Sonnensystems. Körperäquator und ICRF-Äquator schneiden sich bei $\alpha_0 \pm 90^\circ$; der
Punkt bei $\alpha_0 + 90^\circ$ ist der Knoten $Q$. Der Winkel $W$ zählt von $Q$ ostwärts längs des
Körperäquators bis zum Nullmeridian. Die Zeit läuft ab der Standardepoche JD 2 451 545,0, dem
1. Januar 2000 um 12 Uhr TDB, in Tagen $d$ und julianischen Jahrhunderten $T$
([Archinal et al. 2011](literatur:archinal-2011)):

$$\alpha_0 = \alpha_{00} + \dot{\alpha}_0\,T, \quad \delta_0 = \delta_{00} + \dot{\delta}_0\,T, \quad W = W_0 + \dot{W}\,d$$

Hinzu kommen je nach Körper periodische Glieder, bei Phobos auch ein quadratischer Term in $W$.
Der Bericht von 2015 behält diese Festlegungen; in seinen Abbildungen stand für die Rektaszension
von $Q$ irrtümlich ein negatives Vorzeichen ([Archinal et al. 2019](literatur:archinal-2019),
Abb. 1 und Tabelle 2). Negatives $\dot{W}$ bedeutet rückläufige Rotation wie bei Venus und Uranus;
der Nordpol liegt dann dem Drehimpuls entgegen. Für Zwergplaneten, Kleinkörper, deren Monde und
Kometen gilt stattdessen der positive Pol nach der Rechte-Hand-Regel
([Archinal et al. 2011](literatur:archinal-2011);
[Archinal et al. 2019](literatur:archinal-2019)). Für den Mond empfahl der Bericht von 2009 das
System aus mittlerer Erdrichtung und Polachse ([Archinal et al. 2011](literatur:archinal-2011)).

Für die [Erde](objekt:earth) enthielt der Bericht von 2009 noch Näherungen, darunter
$W = 190{,}147^\circ + 360{,}9856235^\circ\,d$ ([Archinal et al. 2011](literatur:archinal-2011)).
Der Bericht von 2015 strich diese Ausdrücke: Sie waren ungenau, versagten nahe J2000,0 und wurden
dennoch mitunter als Empfehlung benutzt; für die Erdrotation verweist er auf den IERS. Ebenso entfiel die
Reihe niedriger Genauigkeit für die Orientierung des Mondes
([Archinal et al. 2018](literatur:archinal-2018)). DE440 und DE441 führen die Orientierung des
Mondmantels als Librationswinkel gegen ICRF3, bezogen auf seine [Hauptträgheitsachsen](thema:innerer-aufbau) aus Daten der
Mission GRAIL ([Park et al. 2021](literatur:park-2021)).

## Zeitskalen

Die Internationale Atomzeit TAI realisiert die Terrestrische Zeit bis auf einen festen Versatz:

$$\mathrm{TT} = \mathrm{TAI} + 32{,}184\,\mathrm{s}$$

([Petit und Luzum 2010](literatur:petit-2010), Abschnitt 10.1). UTC läuft im Takt der TAI, ist
aber um eine ganze Zahl von Sekunden verschoben, so dass $|\mathrm{UT1} - \mathrm{UTC}| < 0{,}9\,\mathrm{s}$
bleibt ([Petit und Luzum 2010](literatur:petit-2010), Glossar). Schaltsekunden sind Ende Juni oder
Ende Dezember möglich; seit dem 1. Januar 2017 gilt TAI − UTC = 37 s, und Ende Dezember 2026 kommt
keine hinzu ([Bizouard 2026](literatur:bizouard-2026)). TT − UTC beträgt damit 69,184 s. UT1 ist
keine gleichförmige Zeit, sondern über den Erdrotationswinkel ein Maß der Erdrotation. Die
Differenz $\Delta T = \mathrm{TT} - \mathrm{UT}$ vergleicht die gleichförmige Zeit der Bahntheorien
mit der Zeit aus der Erdrotation; Finsternisberichte und Sternbedeckungen liefern sie von
720 v. Chr. bis 2015 ([Stephenson et al. 2016](literatur:stephenson-2016)).

Die Zeitkoordinaten der Relativitätstheorie sind TCB im BCRS und TCG im GCRS
([Soffel et al. 2003](literatur:soffel-2003)). TT unterscheidet sich von TCG um eine definierte
Rate, TDB von TCB durch eine lineare Transformation nach IAU-Resolution B3 von 2006:

$$\frac{\mathrm{d}\,\mathrm{TT}}{\mathrm{d}\,\mathrm{TCG}} = 1 - L_\mathrm{G}, \quad \mathrm{TDB} = \mathrm{TCB} - L_\mathrm{B}\,(\mathrm{JD}_\mathrm{TCB} - T_0) \cdot 86400\,\mathrm{s} + \mathrm{TDB}_0$$

mit $L_\mathrm{G} = 6{,}969290134 \cdot 10^{-10}$, $L_\mathrm{B} = 1{,}550519768 \cdot 10^{-8}$,
$T_0 = 2443144{,}5003725$ und $\mathrm{TDB}_0 = -6{,}55 \cdot 10^{-5}\,\mathrm{s}$
([Petit und Luzum 2010](literatur:petit-2010), Abschnitt 10.1 und Gl. 10.3). $L_\mathrm{G}$ ist so
gewählt, dass die Einheit von TT der SI-Sekunde auf dem Geoid entspricht. TCG läuft TT damit um
22 ms je Jahr voraus, TCB der TDB um 0,49 s je Jahr. Zwischen TT und TDB bleibt ein periodischer
Unterschied; sein größter Term hat 1,7 ms Amplitude und folgt dem Sinus der mittleren Anomalie der
Sonne, schwankt also jährlich ([Petit und Luzum 2010](literatur:petit-2010), Abschnitt 5.6.4).

## Ephemeriden und mittlere Elemente

Genaue Orte liefern numerisch integrierte Ephemeriden. DE440 und DE441 entstanden durch Anpassung
integrierter Bahnen an Beobachtungen vom Boden und aus dem All. Ihr Zeitargument ist TDB;
Messungen mit UTC-Zeitstempel werden über TAI und TT umgerechnet. Der Inertialrahmen ist an das
ICRS angeschlossen: Die Bahnen der inneren Planeten sind über VLBI-Messungen an Marssonden im
Mittel auf etwa 0,2 mas an ICRF3 ausgerichtet, Jupiter und Saturn über Messungen an Juno und
Cassini. DE441 verzichtet auf die Dämpfung zwischen flüssigem Mondkern und Mantel, ist deshalb in
diesem Jahrhundert ungenauer als DE440, deckt aber die Jahre −13 200 bis +17 191 statt 1550 bis
2650 ab ([Park et al. 2021](literatur:park-2021)). Asteroidenbahnen im dynamischen Modell von
DE440, bestimmt ohne Gaia-Daten, zeigen gegen die Gaia-Beobachtungen von 1001 Asteroiden einen
Orientierungsversatz von etwa 10 mas, weit mehr als die gemeldeten Abweichungen zwischen DE440 und
ICRF3, bei Drehraten unter 0,5 mas je Jahr. Die Autoren halten systematische Fehler älterer
Asteroidenastrometrie für die wahrscheinliche Ursache; mit Gaia-Daten in der Bahnbestimmung sinkt
der Versatz auf etwa 0,2 mas ([Yao et al. 2025](literatur:yao-2025)). Hinweise zur Nutzung der Dateien gibt
[Planetare Ephemeriden des JPL](quelle:jpl-ephemeriden).

Mittlere oder an ein Zeitfenster angepasste Elemente sind dagegen Näherungen mit begrenzter
Gültigkeit; wie sie sich von oskulierenden Elementen unterscheiden, erklärt
[Bahnelemente](thema:bahnelemente).

## Offene Fragen

- **Heller Gaia-Rahmen:** Der Sternrahmen von Gaia kann vor allem bei hellen Sternen deutlich
  größere systematische Fehler haben als der Quasarrahmen Gaia-CRF3
  ([Gaia Collaboration, Klioner et al. 2022](literatur:gaia-2022)); zwischen hellem und schwachem
  Teil besteht eine systematische Drehung, die künftige Datenfreigaben korrigieren sollen. Die
  Vergleiche mit Radiosternen, deren Orte VLBI im ICRF3 misst, weisen in verschiedene Richtungen.
  Zhang et al. finden die Drehrate im Einklang mit Gaias interner Schätzung und Hinweise, dass auch
  der Orientierungsfehler von der Helligkeit abhängt ([Zhang et al. 2025](literatur:zhang-2025)).
  Lunz et al. finden für den hellen Rahmen bis G = 13 mag keinen signifikanten Orientierungsversatz,
  aber eine Drehrate um die y-Achse von 0,072 ± 0,025 mas je Jahr, und der unkorrigierte helle
  Rahmen passt bei ihnen besser zu ICRF3 als der korrigierte ([Lunz et al. 2024](literatur:lunz-2024)).
- **Zukunft der Schaltsekunde:** Beschlossen ist, dass der zulässige Betrag von UT1 − UTC
  spätestens 2035 größer wird; ein neuer Höchstwert, der UTC für mindestens ein Jahrhundert stetig
  hält, und ein Plan zur Umsetzung sollen der Generalkonferenz 2026 vorgelegt werden
  ([CGPM 2022](literatur:cgpm-2022)). Der Entwurf der Resolution C, den das CIPM dafür vorgelegt
  hat, geht weiter: UTC soll ab dem 20. Mai 2027 stetig laufen und der Höchstwert des Betrags von
  UT1 − UTC 3600 s betragen, was UTC über mehrere Jahrhunderte stetig hielte. Beschlossen ist das nicht; die 28. Generalkonferenz tagt vom 13. bis
  15. Oktober 2026 ([BIPM 2026](literatur:bipm-2026)). Umstritten ist das Verfahren. Levine schlägt
  eine algorithmische Ratenanpassung ohne Zeitsprünge vor ([Levine 2024](literatur:levine-2024)).
  Petit und Tagliaferro halten seine Beschreibung für mehrdeutig und seine Zahlenbeispiele für
  irreführend: Statt der von ihm genannten Toleranz von einer Minute müssten Abweichungen von
  UT1 − UTC über mehrere Minuten zugelassen werden
  ([Petit und Tagliaferro 2025](literatur:petit-2025)). Levine hält in seiner Erwiderung die
  Vorteile des Verfahrens für überwiegend ([Levine 2025](literatur:levine-2025)). Zur Eile mahnt
  der Entwurf der Resolution C unter Verweis auf einen Workshop von CCTF und IERS vom März 2025,
  nach dessen Schätzung die Wahrscheinlichkeit einer negativen Schaltsekunde rasch steigt und bis 2035 30 %
  erreicht ([BIPM 2026](literatur:bipm-2026)). Nach Agnew bräuchte UTC in heutiger Form schon bis
  2029 erstmals eine negative Schaltsekunde ([Agnew 2024](literatur:agnew-2024)).

## Im Modell

- **Zeit:** Die Uhr führt julianische Tage, zeigt sie als Datum in UTC an und rechnet mit derselben
  Zahl als TDB in den Bahnelementen und als Zeitargument der Rotation. Ohne Link und gemerkte
  Sitzung beginnt sie bei JD 2 451 545,0, angezeigt als 1. Januar 2000, 12 Uhr UTC; J2000,0 ist
  aber 12 Uhr TT ([Petit und Luzum 2010](literatur:petit-2010), Abschnitt 5.3.1). Den Bahnen
  fehlen so heute TT − UTC = 69,184 s, und TDB weicht von TT nur um Millisekunden ab: Die Erde
  bleibt 2,8″ in Länge zurück, der Mond 38″. Für die Drehung der Erde wäre UT1 das richtige
  Argument, das höchstens 0,9 s von UTC abweicht.
- **Rahmen:** Alle Bahnen und Pole rechnen in der festen Ekliptik J2000 von JPL, dem um
  84 381,448″ gedrehten ICRF ohne Rahmenversatz. Aus JPL-Quellen stammen die Elemente der Planeten,
  der Zwergplaneten und aller Monde außer dem Erdmond ([Bahnelemente](thema:bahnelemente)); Orrery
  dreht die äquatorialen Pole mit demselben Winkel und bleibt so im Rahmen seiner Daten. Präzession
  und Nutation fehlen. Für Bahnen im festen Rahmen ist das richtig; der Erdpol aber steht dadurch
  still (siehe Erde), und die Mondraten nach Meeus sind um die Präzession vermindert (siehe
  Mondknoten).
- **Bezugsebenen:** Die Planeten, der Erdmond und fünf Zwergplaneten einschließlich Pluto haben
  Elemente gegen die Ekliptik J2000, die übrigen 20 Monde gegen den Äquator ihres Mutterkörpers
  mit dessen festem Pol; eine eigene Laplace-Ebene gibt es nicht (Einzelheiten unter
  [Bahnelemente](thema:bahnelemente)).
- **Mondknoten:** Meeus zählt Knoten und Perigäum des Erdmonds vom mittleren Äquinoktium des
  Datums. Seine Knotenrate von −1934,1363° je Jahrhundert stimmt bis auf $3 \cdot 10^{-5}$ Grad je
  Jahrhundert mit dem Ausdruck überein, den DE440 im Modell der Erdorientierung für das Argument des
  18,6-Jahres-Glieds der Nutation verwendet, gezählt vom mittleren Äquinoktium des Datums
  ([Park et al. 2021](literatur:park-2021)). Orrery vermindert Knoten- und Perigäumsrate um die
  allgemeine Präzession von 1,3969713° je Jahrhundert, den linearen Term von $p_A$ oben
  ([Petit und Luzum 2010](literatur:petit-2010)), auf −1935,5333° und +4067,6168° je Jahrhundert.
  Gegen die feste Ekliptik J2000 ergeben die oskulierenden Elemente aus DE441 von 1900 bis 2100
  Raten von −1935,53° und +4067,63° je Jahrhundert. Die mittlere Länge wächst mit der Rate aus dem
  siderischen Monat und damit ebenfalls im festen Rahmen.
- **Pole und Rotation:** Pole stehen als feste Rektaszension und Deklination ohne Raten und
  periodische Glieder im Datensatz. Die Rotationsphase ist bei allen 35 Körpern zur Epoche null
  und wächst mit fester Periode. Sie zählt nicht von $Q$, sondern von der Richtung, in die die
  kürzeste Drehung der Kugel auf den Körperpol die Kartenmitte bringt; diese liegt, die Erde
  ausgenommen, je nach Pol zwischen 2° (Kallisto) und 173° (Pluto und Charon) neben $Q$. $W_0$ aus
  dem IAU-Modell geht nicht ein: Die Kartenmitte des Mondes zeigt von 2026 bis 2036 zwischen 31°
  und 44° neben die Richtung zur Erde.
- **Erde:** Orrery dreht die Erde gleichförmig mit 23,9345 h, 0,101 s länger als ein Umlauf des
  Erdrotationswinkels, um den festen ICRF-Pol; der Himmelspol hat sich bis heute rund 0,15° davon
  entfernt (siehe Präzession). Bei JD 2 451 545,0 zeigt Greenwich zur Rektaszension 0° statt
  280,46°: Der Globus ist um 79,5° nach Osten verdreht, am 17. September 2026 um 75,4°. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
