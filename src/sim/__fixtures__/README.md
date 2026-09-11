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
