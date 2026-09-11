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

**Einordnung der Größenordnung:** Für die inneren Planeten (Merkur bis Mars)
liegen die Abweichungen im Bereich weniger tausend bis niedrig zehntausend km.
Bei den Riesenplaneten (Jupiter bis Neptun) sind die Abweichungen mit einigen
hunderttausend bis wenigen Millionen km absolut größer, relativ zur Bahnhalbachse
aber weiterhin klein (Jupiter ca. 0,15 %, Saturn ca. 0,3 %, Uranus ca. 0,04 %,
Neptun ca. 0,03 % der Bahnhalbachse) — weit entfernt von der Größenordnung
einer gespiegelten oder verdrehten Bahn, bei der die Abweichung in der
Größenordnung der Bahnhalbachse selbst läge (also ~100 %). Die größeren
absoluten Werte bei Jupiter und Saturn passen zu einer bekannten Einschränkung
dieses Elementsatzes: Die "Approximate Positions"-Tabelle von JPL ist ein
reines Zweikörper-Keplermodell mit linear fortgeschriebenen Elementen: Es
enthält keine Korrektur für die gegenseitige Störung von Jupiter und Saturn
(die sogenannte "große Ungleichheit"), deren Periode mit rund 900 Jahren weit
über das hier genutzte 190-Jahre-Fenster hinausreicht und daher nicht als
linearer Term erfasst ist.

Auffällig, aber ebenfalls durch das Zweikörpermodell erklärbar: Die größte
Abweichung tritt nicht durchweg an den Rändern des Gültigkeitsfensters (1850
bzw. 2040) auf, sondern bei Jupiter genau bei J2000 selbst. Das wäre
verdächtig, wenn die Abweichung allein aus der linearen Fortschreibung der
Elemente über die Zeit T seit J2000 stammte (dort wäre sie bei T=0 exakt
null). Sie stammt hier jedoch überwiegend aus dem oben genannten fehlenden
Störungsterm, dessen Beitrag eine periodische (nicht bei T=0 verschwindende)
Funktion der Zeit ist und dessen mehrere Jahrhunderte lange Periode über die
fünf Stichtage hinweg nicht monoton verläuft. Bei den erdnahen Planeten
(Merkur bis Mars) zeigt sich aus demselben Grund kein einheitliches Muster
"schlechtester Wert an den Rändern" — auch dort überwiegen kurzperiodische,
nicht im Modell erfasste Störungen gegenüber dem linearen Fortschreibungsfehler.
