# Referenzwerte von JPL Horizons

`horizons.json` enthält 40 heliozentrische Positionsvektoren (8 Planeten ×
5 Stichtage), abgerufen von der JPL-Horizons-API, gegen die `positionAt` aus
`../orbit.ts` in `../horizons.test.ts` geprüft wird. Dieses Dokument beschreibt
das Abrufverfahren wörtlich, damit das Fixture jederzeit reproduzierbar neu
erzeugt werden kann.

## Abrufverfahren

Eine Anfrage je Körper, mit allen fünf Stichtagen in einer einzigen Anfrage
über `TLIST` (funktioniert mit Julianischen Daten, nicht mit Kalenderdaten):

```
https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='<n>'&OBJ_DATA='NO'
  &MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@10'
  &TLIST='2396942.5,2451544.5,2455362.5,2461294.5,2466233.5'
  &VEC_TABLE='2'&REF_PLANE='ECLIPTIC'&OUT_UNITS='KM-S'
```

`COMMAND`: 1 Merkur-, 2 Venus-, 3 Erde-Mond-, 4 Mars-, 5 Jupiter-, 6 Saturn-,
7 Uranus-, 8 Neptun-Baryzentrum (`3` ist bewusst das Erde-Mond-Baryzentrum,
nicht `399` — das entspricht dem `earth`-Datensatz in `src/data/bodies/earth.ts`,
dessen Bahnelemente ebenfalls auf das Baryzentrum bezogen sind).

Die Antwort enthält zwischen `$$SOE` und `$$EOE` je Epoche eine Zeile
`<JDTDB> = A.D. …` und darunter `X = … Y = … Z = …` in km.

**Alternativer Weg, falls `TLIST` nicht funktioniert:** eine Anfrage je Körper
und Stichtag mit `START_TIME`/`STOP_TIME`/`STEP_SIZE='1d'` statt `TLIST` (siehe
Kontrollwert unten) — 40 Anfragen statt 8, aber gleiches Ergebnis.

**Rückfallweg ohne API** — dasselbe über das Webformular auf
<https://ssd.jpl.nasa.gov/horizons/app.html>:

| Einstellung | Wert |
|---|---|
| Ephemeris Type | **Vector Table** |
| Target Body | `Mercury Barycenter [1]` … `Neptune Barycenter [8]` (für die Erde: `Earth-Moon Barycenter [3]`) |
| Coordinate Center | `@sun` (Sonnenmittelpunkt, `500@10`) |
| Reference Plane | **Ecliptic of J2000.0** |
| Table Settings | Type 2 (Position und Geschwindigkeit), Ausgabeeinheiten **km & km/s** |
| Time Specification | die fünf Stichtage unten, jeweils 00:00 TDB |

## Stichtage

Die fünf Kalenderdaten stammen aus dem Implementierungsplan, verteilt über das
Gültigkeitsfenster der Bahnelemente (1800–2050). Das zugehörige Julianische
Datum wird **von Horizons selbst übernommen**, nicht selbst berechnet — damit
ist jede Frage nach einem TDB/UTC-Versatz durch die Quelle beantwortet. Ein
zunächst versuchter JD-Schätzwert für 1850-07-04 traf tatsächlich den
1850-Jan-01 (rund 184 Tage daneben), einer für 2040-03-20 den 2040-Feb-21
(28 Tage daneben) — beide wurden verworfen und stattdessen mit je einer
Einzelabfrage (`START_TIME`/`STOP_TIME`/`STEP_SIZE='1d'` für das exakte
Kalenderdatum) durch das von Horizons gemeldete JD ersetzt. Die Werte unten
sind die für alle acht Körper tatsächlich verwendeten:

| Kalenderdatum (00:00 TDB) | JDTDB (von Horizons gemeldet) |
|---|---|
| 1850-07-04 | 2396942.5 |
| 2000-01-01 | 2451544.5 |
| 2010-06-15 | 2455362.5 |
| 2026-09-11 | 2461294.5 |
| 2040-03-20 | 2466233.5 |

Das ergibt 8 Körper × 5 Zeitpunkte = 40 Referenzpunkte, alle in `horizons.json`
unter `punkte` enthalten.

## Kontrollwert

Vor dem eigentlichen Abruf wurde folgender vorab bekannter Wert nachvollzogen
(Mars-Baryzentrum, JD 2451544.5):

```
X = 2.079950549836587E+08
Y = -3.143009713801308E+06
Z = -5.178781243501138E+06
```

Der erste Abruf traf diesen Wert zeichengenau — die Anfrageparameter sind
damit als korrekt bestätigt.

## Gemessene Abweichungen

Gemessen am 2026-09-11 mit `npx vitest run src/sim/horizons.test.ts`, jeweils
die größte der fünf Abweichungen pro Körper (euklidischer Abstand zwischen
`positionAt(...)` und dem Horizons-Referenzpunkt, in km):

| Körper | max. Abweichung [km] | am Stichtag | Toleranz [km] | ausgeschöpft |
|---|---|---|---|---|
| mercury | 5693 | 2010-06-15 | 12000 | 47 % |
| venus | 10431 | 2010-06-15 | 20000 | 52 % |
| earth | 12381 | 1850-07-04 | 25000 | 50 % |
| mars | 37608 | 2026-09-11 | 80000 | 47 % |
| jupiter | 1150177 | 2000-01-01 | 2500000 | 46 % |
| saturn | 4271544 | 1850-07-04 | 9000000 | 47 % |
| uranus | 1195610 | 2040-03-20 | 2500000 | 48 % |
| neptune | 1229219 | 2040-03-20 | 2500000 | 49 % |

Jede Toleranz in `horizons.json` ist auf rund das Doppelte dieser gemessenen
Abweichung gesetzt, aufgerundet auf eine glatte Zahl.

**Einordnung der Größenordnung — Gegenprobe gegen JPLs eigene Genauigkeitstabelle.**
Dieselbe Quelle (`approx_pos.html`, Abschnitt „Accuracy") veröffentlicht für
jeden Körper einen eigenen Nominalfehler in heliozentrischer Länge λ, Breite
φ (beide in Bogensekunden) und Radiusvektor ρ (in 1000 km), getrennt nach den
zwei Gültigkeitsfenstern der beiden Elementtabellen. Für unser Fenster
(1800 AD–2050 AD, Tabelle 1) lauten die dort veröffentlichten Werte:

| Körper | λ [″] | φ [″] | ρ [1000 km] | daraus abgeleiteter Gesamtfehler [km]¹ | gemessen [km] | gemessen/abgeleitet |
|---|---|---|---|---|---|---|
| mercury | 15 | 1 | 1 | 4 337 | 5 693 | 1,31 |
| venus | 20 | 1 | 4 | 11 241 | 10 431 | 0,93 |
| earth (EM Bary) | 20 | 8 | 6 | 16 735 | 12 381 | 0,74 |
| mars | 40 | 2 | 25 | 50 832 | 37 608 | 0,74 |
| jupiter | 400 | 10 | 600 | 1 624 720 | 1 150 177 | 0,71 |
| saturn | 600 | 25 | 1500 | 4 416 156 | 4 271 544 | 0,97 |
| uranus | 50 | 2 | 1000 | 1 218 608 | 1 195 610 | 0,98 |
| **neptune** | **10** | **1** | **200** | **296 712** | **1 229 219** | **4,14** |

¹ eigene Kombination, nicht von JPL so veröffentlicht: Quer- und
Normalanteil aus λ bzw. φ über `a · Winkel[rad]` in km umgerechnet, radialer
Anteil = ρ · 1000 km, alle drei quadratisch addiert (RSS).

Sieben der acht Körper liegen innerhalb des 0,7- bis 1,3-fachen dieses aus
JPLs eigener Tabelle abgeleiteten Nominalfehlers — für Jupiter und Saturn
ist der Nominalfehler selbst schon groß (400″ bzw. 600″ in λ), weil das
zugrunde liegende Zweikörper-Keplermodell mit linear fortgeschriebenen
Elementen keine Korrektur für die gegenseitige Störung von Jupiter und Saturn
enthält (die sogenannte „große Ungleichheit", Periode rund 900 Jahre, weit
über das 190-Jahre-Fenster hinaus) — **JPL benennt diese Einschränkung also
bereits selbst in den eigenen Zahlen**, und unsere Messung bestätigt sie nur.

**Neptun ist die Ausnahme und wurde deswegen gesondert untersucht** (siehe
`task-5-report.md` im SDD-Ordner für die volle Herleitung): Die gemessene
Abweichung übertrifft den aus JPLs eigenen λ/φ/ρ-Werten abgeleiteten
Nominalfehler um das 4,1-fache — und das bereits bei JD 2451544.5 (praktisch
T=0, wo eine reine lineare Fortschreibung der Elemente noch nichts beiträgt).
Drei unabhängige Implementierungen (unser `orbit.ts`, eine komplett neu und
ausschließlich aus dem JPL-Formeltext geschriebene Kontrollrechnung ohne
jede gemeinsame Codebasis, sowie eine externe Prüfung) liefern für Neptun bei
allen fünf Stichtagen dasselbe Ergebnis bis auf Rundungsrauschen
(< 10⁻⁵ km) — ein Implementierungsfehler ist damit praktisch ausgeschlossen.
Ein Scan über elf zusätzliche, über das gesamte Fenster 1800–2050 verteilte
Zeitpunkte zeigt zudem ein **oszillierendes**, nicht monoton mit |T| von
J2000 aus anwachsendes Restfehlerbild (Minima um 1849 und 1949, Maxima um
1799, 1899 und 2000) — das Muster eines echten, im Modell nicht erfassten
periodischen Störeinflusses (am ehesten durch Uranus), nicht das Muster eines
Vorzeichen-, Rotations- oder Übertragungsfehlers. Die Bahnelemente selbst
wurden erneut ziffernweise gegen die Live-Quelle geprüft und stimmen exakt.
**Schlussfolgerung:** kein Fehler in `orbit.ts` oder `neptune.ts` — aber
JPLs eigene veröffentlichte Nominalfehlerangabe für Neptun (10″/1″/200)
erweist sich gegen eine moderne Referenzephemeride (Horizons/DE441) als zu
optimistisch für dieses Element- und Zeitfenster. Die Toleranz in dieser
Fixture beruht ohnehin auf der tatsächlich gemessenen Abweichung, nicht auf
JPLs Nominalangabe, und bleibt davon unberührt.

Für die inneren Planeten (Merkur bis Mars) liegen die absoluten Abweichungen
im Bereich weniger tausend bis niedrig zehntausend km — durchweg im Rahmen
dessen, was JPL selbst für dieses Elementmodell angibt.

## Mondfixtures (`monde-horizons.json`)

`monde-horizons.json` enthält 30 Referenzvektoren (Phobos und Deimos × 5
Stichtage aus Task 6, sowie Io, Europa, Ganymed und Kallisto × 5 Stichtage aus
Task 7), abgerufen von der JPL-Horizons-API, gegen die `positionAt` aus
`../orbit.ts` in `../monde.fixture.test.ts` geprüft wird. Im Unterschied zu
`horizons.json` führt jeder Eintrag zusätzlich den Geschwindigkeitsvektor
(`sollGeschwindigkeit`, km/s): Aus einem einzelnen Ortsvektor lässt sich die
Lage der Bahnebene nicht bestimmen (unendlich viele Ebenen enthalten sowohl
den Vektor als auch den Ursprung) — erst `r × v` liefert die Bahnnormale.
Horizons liefert die Geschwindigkeit mit `VEC_TABLE='2'` ohnehin mit; das
bestehende `horizons.json` verwirft sie nur, weil `horizons.test.ts` sie
nicht braucht.

### Abrufverfahren

Je Mond und Stichtag eine Anfrage mit `START_TIME`/`STOP_TIME`/
`STEP_SIZE='1d'` (der `TLIST`-Weg aus dem Planetenabruf entfällt hier, weil
für diese fünf Kalenderdaten noch keine Julianischen Daten vorlagen — siehe
„Alternativer Weg" oben):

```
https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='<id>'&OBJ_DATA='NO'
  &MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@499'
  &START_TIME='<Kalenderdatum>'&STOP_TIME='<Kalenderdatum + 1 Tag>'&STEP_SIZE='1d'
  &VEC_TABLE='2'&REF_PLANE='ECLIPTIC'&OUT_UNITS='KM-S'
```

`COMMAND`: `401` Phobos, `402` Deimos. `CENTER='500@499'` ist der
**Mars-Körpermittelpunkt** (nicht das Mars-Baryzentrum `500@4`, das für
Mars und Phobos/Deimos wegen der geringen Mondmassen ohnehin praktisch
zusammenfällt, aber begrifflich der falsche Bezug wäre): Die Bahnelemente
in `mars-monde.ts` sind relativ zu Mars selbst angegeben, nicht relativ zum
Baryzentrum des Mars-Systems. Aus der Antwort wird jeweils die erste Zeile
zwischen `$$SOE` und `$$EOE` (00:00 TDB des angefragten Datums) entnommen;
die zweite Zeile (Folgetag, wegen `STEP_SIZE='1d'` immer mitgeliefert) wird
verworfen.

Abgerufen am 2026-09-12.

### Stichtage

Die fünf Kalenderdaten stammen aus dem Implementierungsplan (Task-6-Brief):
1976-01-01, 2000-01-01, 2026-01-01, 2050-01-01, 2076-01-01, jeweils 00:00
TDB. Das Julianische Datum wird auch hier von Horizons selbst übernommen:

| Kalenderdatum (00:00 TDB) | JDTDB (von Horizons gemeldet) |
|---|---|
| 1976-01-01 | 2442778.5 |
| 2000-01-01 | 2451544.5 |
| 2026-01-01 | 2461041.5 |
| 2050-01-01 | 2469807.5 |
| 2076-01-01 | 2479303.5 |

Das ergibt 2 Monde × 5 Zeitpunkte = 10 Referenzpunkte, alle in
`monde-horizons.json` unter `eintraege` enthalten.

### Wichtig: die Knoten-Nullrichtung der Quelltabelle

Die Bahnelemente in `../../data/bodies/mars-monde.ts` stammen aus JPLs
„Planetary Satellite Mean Elements" (<https://ssd.jpl.nasa.gov/sats/elem/>).
Deren Spalte `node` ist **nicht** vom Knoten der Äquatorebene auf der
Ekliptik gemessen, sondern — wörtlich laut eigenem Glossar der Quelle —
„measured from the node of the reference plane on the **ICRF equator**".
`node`, `lp` und `L` bauen alle auf demselben Nullpunkt auf (`lp = node +
w`, `L = node + w + M`) und dürfen deshalb **nicht unverändert** als
ekliptikale Knotenlänge eingesetzt werden — die Umrechnung um den Versatz
zwischen beiden Nullpunkten (`icrfKnotenVersatzDeg` in `../frames.ts`,
angewendet in `../orbit.ts`) ist zwingend, sonst ergibt sich ein fester,
knotengroßer Richtungsfehler in der Bahnposition (siehe nächster Abschnitt
und Task-6-Bericht).

### Befund und Korrektur

Der erste Testlauf mit diesem Fixture schlug für Phobos und Deimos beim
Ebenen- und beim Positionstest fehl (Radiustest bestand sofort). Die
Abweichung lag **nicht** an diesem Fixture (die Anfrage wurde mehrfach
gegen das offizielle Element-Glossar geprüft) und **nicht** an den Zahlen
in `mars-monde.ts` (Rücktransformation `lp = node + w`, `L = node + w + M`
trifft die dort tabellierten Werte exakt), sondern an genau der oben
beschriebenen Knoten-Nullrichtung: `equatorToEcliptic()` in `../frames.ts`
setzt die Knotenrichtung als Schnittlinie von Äquator- und **Ekliptik**ebene,
nicht als Schnittlinie mit dem ICRF-Äquator. Für den Marspol ergibt das
einen festen Winkel von 40,858° zwischen beiden Bezugsrichtungen — die
zunächst gemessene Positionsabweichung lag bei allen zehn Fixture-Punkten
im Bereich 40,9–46° (9,5–12,9 % des Bahnumfangs), fast zeitunabhängig, wie
es ein fester Bezugsrichtungsfehler und keine Perioden-Ungenauigkeit
erwarten lässt.

Die Korrektur (`icrfKnotenVersatzDeg` in `../frames.ts`, angewandt auf
`node`, `lp` und `L` im `parentEquator`-Zweig von `positionAt` in
`../orbit.ts`) senkt die Positionsabweichung auf höchstens 1,96 % des
Bahnumfangs (Schranke 5 %). Einzelheiten, die volle Abweichungstabelle vor
und nach der Korrektur sowie die verbleibende, bewusst auf die Epoche
J2000 beschränkte Ebenenprüfung stehen im Task-6-Bericht im SDD-Ordner.

## Jupitermonde (Io, Europa, Ganymed, Kallisto)

Dieselben 20 zusätzlichen Referenzvektoren (Io, Europa, Ganymed, Kallisto ×
5 Stichtage) stehen ebenfalls in `monde-horizons.json`, unter denselben
`eintraege`, nur mit Zentrum Jupiter statt Mars.

### Abrufverfahren

Wie bei den Marsmonden: je Mond und Stichtag eine Anfrage mit
`START_TIME`/`STOP_TIME`/`STEP_SIZE='1d'`:

```
https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='<id>'&OBJ_DATA='NO'
  &MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@599'
  &START_TIME='<Kalenderdatum>'&STOP_TIME='<Kalenderdatum + 1 Tag>'&STEP_SIZE='1d'
  &VEC_TABLE='2'&REF_PLANE='ECLIPTIC'&OUT_UNITS='KM-S'
```

`COMMAND`: `501` Io, `502` Europa, `503` Ganymed, `504` Kallisto.
`CENTER='500@599'` ist der **Jupiter-Körpermittelpunkt**, aus demselben
Grund wie `CENTER='500@499'` bei den Marsmonden: Die Bahnelemente in
`../../data/bodies/jupiter-monde.ts` sind relativ zu Jupiter selbst
angegeben, nicht relativ zum Baryzentrum des Jupitersystems. Abgerufen am
12.09.2026, dieselben fünf Stichtage/JD wie bei den Marsmonden (die
Kalender→JD-Umrechnung ist zielkörperunabhängig, siehe Tabelle oben).

### Befund: Die Elementtabellen-Spalte P ist für Io und Europa falsch

Vor dem Fixture-Abgleich fiel bei der Datenübernahme aus JPLs
„Planetary Satellite Mean Elements" (Tabelle des Jupitersystems,
Quelle der Bahnelemente in `jupiter-monde.ts`) ein Befund auf, der mit
diesem Fixture unabhängig bestätigt wird: Die Tabellenspalte **P**
(„sidereal period") nennt für Io 1,762732 d und für Europa 3,525463 d —
beides weicht 9,3 bzw. 36,5 Minuten von der tatsächlichen Umlaufzeit ab
(1,769138 d / 3,551181 d), bestätigt durch drei unabhängige Gegenproben
(Kepler drittes Gesetz mit dem System-GM, direkte Positions-Regression über
20/28 Tage Horizons-Ephemeride, sowie die gebundene Rotation aus dem
SPICE-Kernel — Einzelheiten im Quellenblock von `jupiter-monde.ts`). Für
Ganymed und Kallisto stimmt dieselbe Spalte dagegen auf unter zwei Minuten.
`jupiter-monde.ts` verwendet deshalb für alle vier Monde einheitlich die
Umlaufzeit aus dem NASA/JPL NSSDC Jovian Satellite Fact Sheet statt der
Tabellenspalte P — nur zur Berechnung von `LDot`, alle anderen Spalten
(a, e, w, M, i, node, Präzessionsperioden) bleiben unverändert aus der
Elementtabelle.

### Ergebnis gegen dieses Fixture

Mit den oben beschriebenen Umlaufzeiten bestehen 63 der 64 auf die vier
Jupitermonde entfallenden Einzelprüfungen aus `monde.fixture.test.ts`
(4 Monde × [5 Radius + 5 Neigung + 5 Position + 1 volle Ebene bei J2000]).
Eine einzelne Prüfung bleibt rot und wird bewusst NICHT durch eine
aufgeweichte Schranke
grün gerechnet (siehe Anleitung im Task-7-Brief): Europas Bahnradius zur
Epoche 2050-01-01 (JD 2469807,5) weicht 1,42 % vom Horizons-Sollwert ab
(Schranke 1 %; Soll 666 619,10 km, Ist 676 055,38 km). Die anderen vier
Europa-Epochen sowie alle Positions- und Ebenentests (auch zu derselben
Epoche) liegen dagegen deutlich innerhalb ihrer Schranken. Diagnose und
Zahlen im Detail: Task-7-Bericht im SDD-Ordner. Kurzfassung: Europa steht
in der Mitte der stärksten Drei-Körper-Bahnresonanz des Sonnensystems
(Laplace-Resonanz mit Io und Ganymed); ihre Bahn trägt echte periodische
(nicht-säkulare) Störungen, die ein rein linear fortgeschriebenes
Mittelwert-Elemente-Modell (konstante a, e; linear präzedierende node, lp)
nicht abbildet — dieselbe Fehlerklasse wie die in `horizons.json`
dokumentierte „große Ungleichheit" zwischen Jupiter und Saturn, hier
innerhalb des Mondsystems selbst. Bei Europas kleiner absoluter
Exzentrizität (0,009) schlägt ein an sich moderater periodischer Anteil
prozentual besonders stark auf den Bahnradius durch.
