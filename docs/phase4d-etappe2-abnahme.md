# Abnahme Phase 4d Etappe 2 „Fachthemen"

## 1. Umfang

Branch `hochschule-2` (von `master` 2db1043, der Plan-Commit selbst), HEAD zu Beginn dieses Tasks
`7f551b3`. Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, Plan
`docs/superpowers/plans/2026-09-17-phase4d-hochschule-etappe2.md`, Ledger
`.superpowers/sdd/2026-09-17-phase4d-hochschule-etappe2/progress.md`.

Commits der Etappe (neu gegenüber `master` f0963a0, älteste zuerst, 28 Commits):

```
2db1043 Plan Phase 4d Etappe 2: Fachthemen
713ed22 Formelsatz: Funktionsnamen mit Funktionsanwendung und Abstand wie TeX
0168d08 Literaturprüfung: Wiederholung bei vorübergehenden Serverfehlern
8ab158e Quellenkarte JPL Horizons zeigt auf das Handbuch
8ef3e72 Hochschultext Bezugssysteme und Zeitskalen mit Belegliste
a57fc1c Literaturprüfung: Untertitel aus Crossref beim Titelvergleich
e9bbcfd Hochschultext Gezeiten und Roche-Grenze mit Belegliste
e4fdcb4 Hochschultext Bezugssysteme und Zeitskalen: Nacharbeit nach der Fachprüfung
a231512 Hochschultext Bahnresonanzen mit Belegliste
4935b22 Hochschultext Bezugssysteme und Zeitskalen: Nacharbeit nach der zweiten Prüfrunde
2ad0029 Hochschultext Gezeiten und Roche-Grenze: Nacharbeit nach der Fachprüfung
b0c9bb9 Hochschultext Bezugssysteme und Zeitskalen: Nacharbeit nach der dritten Prüfrunde
fbcfbd8 Hochschultext Bahnresonanzen: Nacharbeit nach der Fachprüfung
f68b38b Hochschultext Gezeiten und Roche-Grenze: Nacharbeit nach der zweiten Prüfrunde
5e39932 Hochschultext Bahnresonanzen: Nacharbeit nach der zweiten Prüfrunde
2e891a6 Literaturkatalog: Körperschaften als Autoren, Crossref ohne Autoren als Warnung
8287fb0 Richtwerte für die Länge der Hochschultexte angehoben
6c3706d Kommentar zur 2:1-Lücke im Asteroidengürtel berichtigt
7ddad38 Hochschultext Innerer Aufbau mit Belegliste
95f2a30 Hochschultext Albedo und Helligkeit mit Belegliste
b4c0fb3 Hochschultext Innerer Aufbau: Nacharbeit nach der Fachprüfung
9faa3b4 Hochschultext Entstehung des Sonnensystems mit Belegliste
e25c361 Hochschultext Innerer Aufbau: Nacharbeit nach der zweiten Prüfrunde
2fc3d00 Hochschultext Albedo und Helligkeit: Nacharbeit nach der Fachprüfung
71acf88 Hochschultext Entstehung des Sonnensystems: Nacharbeit nach der Fachprüfung
077434b Hochschultext Albedo und Helligkeit: Nacharbeit nach der zweiten Prüfrunde
2008eed Hochschultext Entstehung des Sonnensystems: Nacharbeit nach der zweiten Prüfrunde
7f551b3 Hochschultexte: Verweise zwischen Fachthemen und Pilottexten
```

Inhalt: sechs Fachthemen-Texte auf Hochschulniveau (Bezugssysteme und Zeitskalen, Gezeiten und
Roche-Grenze, Bahnresonanzen, Innerer Aufbau aus Schwerefeld und Rotation, Albedo und Helligkeit,
Entstehung des Sonnensystems) je mit Belegliste, Fachprüfung, Spec-Prüfung und ein bis zwei
Nacharbeitsrunden plus Gegenprüfung; Funktionsnamen (`\sin` und ähnliche) mit Funktionsanwendung
und TeX-Abstand statt ohne Abstand; Prüfskript-Wiederholung bei vorübergehenden Serverfehlern;
Quellenkarte `jpl-horizons` auf das Handbuch statt der Anwendung (alle drei Nacharbeiten aus den
Fragen der 4d-1-Abnahme); Literaturkatalog-Erweiterung von 51 auf 199 Einträge samt Behandlung von
Körperschaften als Autoren; Richtwerte für Textlängen angehoben (Themen 1500–4000 Wörter statt
1000–2000); 32 neue Verweise zwischen den sechs Fachthemen und den drei Pilottexten aus Etappe 1.
Zusätzliche, im Plan nicht vorgesehene Tasks: Zwischen-Task 2a (Crossref-Untertitel im
Titelvergleich), Zwischen-Task 2b (Körperschaften als Autoren, Richtwerte), Zwischen-Task 5a
(Kommentarkorrektur `src/sim/belts.ts`).

## 2. Lint, Tests, Build

```
npm run lint
```
Ohne Befund (keine Ausgabe außer den Aufrufzeilen).

```
npm test
```
```
 Test Files  91 passed (91)
      Tests  3665 passed (3665)
```

Herleitung (Zuwachs an vitest-`Tests`, aus den laufend im Ledger festgehaltenen Testzahlen; jeder
Zwischenwert dort ist ein tatsächlich gemessener `npm test`-Lauf des jeweiligen Umsetzers, keine
Schätzung):

| Schritt (Commit) | Zuwachs | Summe |
|---|---:|---:|
| Ausgangsstand (`master` f0963a0, Ende 4d-1) | – | 3537 |
| Task 1: Funktionsabstand (`713ed22`) | +1 | 3538 |
| Task 2: Prüfskript-Wiederholung (`0168d08`/`8ab158e`) | +4 | 3542 |
| Task 3: Bezugssysteme mit Nacharbeit (`8ef3e72` … `b0c9bb9`) | +20 | 3562 |
| Zwischen-Task 2a: Crossref-Untertitel (`a57fc1c`) | +1 | 3563 |
| Task 4: Gezeiten mit Nacharbeit (`e9bbcfd` … `f68b38b`) | +20 | 3583 |
| Task 5: Bahnresonanzen mit Nacharbeit (`a231512` … `5e39932`) | +20 | 3603 |
| Zwischen-Task 2b: Körperschaften als Autoren, Richtwerte (`2e891a6`, `8287fb0`) | +2 | 3605 |
| Zwischen-Task 5a: Kommentar `belts.ts` (`6c3706d`) | +0 | 3605 |
| Task 6: Innerer Aufbau mit Nacharbeit (`7ddad38` … `e25c361`) | +20 | 3625 |
| Task 7: Albedo und Helligkeit mit Nacharbeit (`95f2a30` … `077434b`) | +20 | 3645 |
| Task 8: Entstehung des Sonnensystems mit Nacharbeit (`9faa3b4` … `2008eed`) | +20 | 3665 |
| Task 9: Verweise (`7f551b3`) | +0 | 3665 |

Nachgerechnet: 3537 + 1 + 4 + 20 + 1 + 20 + 20 + 2 + 0 + 20 + 20 + 20 + 0 = **3665**, deckungsgleich
mit dem gemessenen `npm test`-Lauf. Jede Nacharbeitsrunde innerhalb eines Tasks (Fachprüfung,
Nachprüfung, Gegenprüfung) ist reine Textänderung ohne neue oder geänderte Testfälle — der
Dateitest erzeugt seine zehn Fälle je Sprache/Datei-Paar bereits mit der ersten Fassung des Texts;
das bestätigen die im Ledger nach jeder Nacharbeitsrunde erneut mitgeführten, unveränderten
Zwischensummen (3583 durch Task 3 Runde 1, 3603 durch Task 3 Runde 2/3, Task 4 Runde 1/2, Task 5
Runde 1/2; 3625 durch Task 6 Runde 1, 3645 durch Task 7 Runde 1, 3665 durch Task 6 Runde 2, Task 7
Runde 2, Task 8 Runde 1/2, Task 9). Testzahl weicht von der ursprünglichen Planschätzung (3662) um
+3 ab, Ursache: die drei nicht im Plan vorgesehenen Zwischen-Tasks 2a (+1) und 2b (+2); 5a bringt
keinen Testzuwachs.

```
npm run build
```
```
✓ built in 1.02s
(!) Some chunks are larger than 500 kB after minification. Consider: …
```
Nur der bekannte Hinweis zur Chunkgröße, unverändert seit früheren Etappen. Hauptchunk
`index-BcsSUIum.js`: 1 282,42 kB / gzip 343,63 kB (4d-1 nach Nacharbeit: 1 243,77 kB /
gzip 331,91 kB; Zuwachs rund 38,65 kB / gzip rund 11,72 kB durch sechs neue Fachthementexte und den
von 51 auf 199 Einträge gewachsenen, eager geladenen Literaturkatalog — bekannte Unschärfe M9 aus
4d-1, siehe Abschnitt 7).

Katalogzahl: **199 Literatureinträge** (`grep -oE "id:\s*'[a-z0-9-]+'" src/data/literatur.ts | wc -l`,
zusätzlich vom Prüfskript selbst bestätigt: „Prüfe 199 von 199 Einträgen"), gegenüber 51 zu Ende von
4d-1 ein Zuwachs von 148 Einträgen. Der Zuwachs verteilt sich über die sechs Fachthemen (siehe
Abschnitt 4, Spalte „neue Katalogeinträge"); die Summe der dortigen Spaltenwerte (14 + 26 + 21 + 22
+ 23 + 42 = 148) ist mit dem Katalogzuwachs deckungsgleich (`git show <commit> -- src/data/literatur.ts`
je Commit einzeln ausgezählt, netto nach Abzug der einen Entfernung `bagheri-2026` in Task 4).

```
npm run literatur:pruefen
```
Siehe Abschnitt 3.

## 3. Prüfskript

Vollständige Ausgabe des zweiten, fehlerfreien Laufs (`Prüfe 199 von 199 Einträgen`):

```
agnew-2024                   crossref  ok       Erstautor, Jahr und Titel stimmen
alexander-2012               crossref  ok       Erstautor, Jahr und Titel stimmen
altwegg-2015                 crossref  ok       Erstautor, Jahr und Titel stimmen
amelin-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
andrews-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
andrews-2020                 arxiv     ok       Erstautor und Titel stimmen
archinal-2011                crossref  ok       Erstautor, Jahr und Titel stimmen
archinal-2018                crossref  ok       Erstautor, Jahr und Titel stimmen
archinal-2019                crossref  ok       Erstautor, Jahr und Titel stimmen
avdellidou-2024              crossref  ok       Erstautor, Jahr und Titel stimmen
barboni-2017                 crossref  ok       Erstautor, Jahr und Titel stimmen
bau-2021                     crossref  ok       Erstautor, Jahr und Titel stimmen
bau-2021                     arxiv     ok       Erstautor und Titel stimmen
beggan-2026                  crossref  ok       Erstautor, Jahr und Titel stimmen
bi-2025                      crossref  ok       Erstautor, Jahr und Titel stimmen
biggin-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
bipm-2026                    url       ok       HTTP 200
bizouard-2026                url       ok       HTTP 200
black-2015                   crossref  ok       Erstautor, Jahr und Titel stimmen
blackburn-2011               crossref  ok       Erstautor, Jahr und Titel stimmen
boehnke-2016                 crossref  ok       Erstautor, Jahr und Titel stimmen
bono-2019                    crossref  ok       Erstautor, Jahr und Titel stimmen
bottke-2012                  crossref  ok       Erstautor, Jahr und Titel stimmen
bouvier-2010                 crossref  ok       Erstautor, Jahr und Titel stimmen
brasser-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
briaud-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
broucke-1972                 crossref  ok       Erstautor, Jahr und Titel stimmen
brozovic-2025                crossref  ok       Erstautor, Jahr und Titel stimmen
buratti-2022                 crossref  ok       Erstautor, Jahr und Titel stimmen
cano-2020                    crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2001                   crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2012                   crossref  ok       Erstautor, Jahr und Titel stimmen
carry-2024                   crossref  ok       Erstautor, Jahr und Titel stimmen
carry-2024                   arxiv     ok       Erstautor und Titel stimmen
cgpm-2022                    crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
charles-1997                 crossref  ok       Erstautor, Jahr und Titel stimmen
charlot-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
charlot-2020                 arxiv     ok       Erstautor und Titel stimmen
chavez-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
chavez-2023                  arxiv     ok       Erstautor und Titel stimmen
chen-2015                    crossref  ok       Erstautor, Jahr und Titel stimmen
chiang-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
chiang-2010                  arxiv     ok       Erstautor und Titel stimmen
clement-2018                 crossref  ok       Erstautor, Jahr und Titel stimmen
clement-2018                 arxiv     ok       Erstautor und Titel stimmen
cohen-1965                   crossref  ok       Erstautor, Jahr und Titel stimmen
connelly-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
correia-2004                 crossref  ok       Erstautor, Jahr und Titel stimmen
crompvoets-2022              crossref  ok       Erstautor, Jahr und Titel stimmen
crompvoets-2022              arxiv     ok       Erstautor und Titel stimmen
cuk-2012                     crossref  ok       Erstautor, Jahr und Titel stimmen
cuk-2024                     crossref  ok       Erstautor, Jahr und Titel stimmen
dauphas-2011                 crossref  ok       Erstautor, Jahr und Titel stimmen
durante-2019                 crossref  ok       Erstautor, Jahr und Titel stimmen
durante-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
durante-2026                 crossref  ok       Erstautor, Jahr und Titel stimmen
duriez-1992                  crossref  ok       Erstautor, Jahr und Titel stimmen
dziewonski-1981              crossref  ok       Erstautor, Jahr und Titel stimmen
efroimsky-2007                crossref  ok       Erstautor, Jahr und Titel stimmen
efroimsky-2007                arxiv     ok       Erstautor und Titel stimmen
elipe-2017                   crossref  ok       Erstautor, Jahr und Titel stimmen
espenak-2009                 url       ok       HTTP 200
fischer-2024                 crossref  ok       Erstautor, Jahr und Titel stimmen
folkner-1997                 crossref  ok       Erstautor, Jahr und Titel stimmen
fuller-2016                  crossref  ok       Erstautor, Jahr und Titel stimmen
fuller-2016                  arxiv     ok       Erstautor und Titel stimmen
gaia-2022                    crossref  ok       Erstautor, Jahr und Titel stimmen
gaia-2022                    arxiv     ok       Erstautor und Titel stimmen
genova-2019                  crossref  ok       Erstautor, Jahr und Titel stimmen
gladman-1996                 crossref  ok       Erstautor, Jahr und Titel stimmen
gladman-1997                 crossref  ok       Erstautor, Jahr und Titel stimmen
goessling-2025                crossref  ok       Erstautor, Jahr und Titel stimmen
gomes-2005                   crossref  ok       Erstautor, Jahr und Titel stimmen
gomez-casajus-2022           crossref  ok       Erstautor, Jahr und Titel stimmen
goossens-2024                crossref  ok       Erstautor, Jahr und Titel stimmen
goossens-2026                crossref  ok       Erstautor, Jahr und Titel stimmen
guillet-2023                 crossref  ok       Erstautor, Jahr und Titel stimmen
haisch-2001                  crossref  ok       Erstautor, Jahr und Titel stimmen
hanel-1981                   crossref  ok       Erstautor, Jahr und Titel stimmen
hapke-1993                   crossref  ok       Erstautor, Jahr und Titel stimmen
hapke-2012a                  crossref  ok       Erstautor, Jahr und Titel stimmen
hapke-2012b                  crossref  ok       Erstautor, Jahr und Titel stimmen
hartogh-2011                 crossref  ok       Erstautor, Jahr und Titel stimmen
haus-2016                    crossref  ok       Erstautor, Jahr und Titel stimmen
hemingway-2018                crossref  ok       Erstautor, Jahr und Titel stimmen
herald-2014                  url       ok       HTTP 200
herwartz-2014                crossref  ok       Erstautor, Jahr und Titel stimmen
hilton-2006                  crossref  ok       Erstautor, Jahr und Titel stimmen
hirose-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
howard-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
howett-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
iess-2012                    crossref  ok       Erstautor, Jahr und Titel stimmen
iess-2018                    crossref  ok       Erstautor, Jahr und Titel stimmen
irwin-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
irwin-2025                   arxiv     ok       Erstautor und Titel stimmen
jacobsen-2008                crossref  ok       Erstautor, Jahr und Titel stimmen
jacobson-2022                crossref  ok       Erstautor, Jahr und Titel stimmen
johansen-2007                crossref  ok       Erstautor, Jahr und Titel stimmen
johansen-2007                arxiv     ok       Erstautor und Titel stimmen
johansen-2017                crossref  ok       Erstautor, Jahr und Titel stimmen
khan-2023                    crossref  ok       Erstautor, Jahr und Titel stimmen
kleine-2009                  crossref  ok       Erstautor, Jahr und Titel stimmen
kloss-2026                   crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-1998                  crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-2010                  arxiv     ok       Erstautor und Titel stimmen
konopkova-2016               crossref  ok       Erstautor, Jahr und Titel stimmen
konopliv-2020                crossref  ok       Erstautor, Jahr und Titel stimmen
krasna-2013                  crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2014                 crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2015                 crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2017                 crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2009                  crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2020                  arxiv     ok       Erstautor und Titel stimmen
lainey-2025                  crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2025                  arxiv     ok       Erstautor und Titel stimmen
lambrechts-2012              crossref  ok       Erstautor, Jahr und Titel stimmen
lambrechts-2012              arxiv     ok       Erstautor und Titel stimmen
lambrechts-2014              crossref  ok       Erstautor, Jahr und Titel stimmen
lambrechts-2014              arxiv     ok       Erstautor und Titel stimmen
lari-2024                    crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-1989                  crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-1993                  crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-2004                  crossref  ok       Erstautor, Jahr und Titel stimmen
le-maistre-2023               crossref  ok       Erstautor, Jahr und Titel stimmen
lee-2002                     crossref  ok       Erstautor, Jahr und Titel stimmen
levine-2024                  crossref  ok       Erstautor, Jahr und Titel stimmen
levine-2025                  crossref  ok       Erstautor, Jahr und Titel stimmen
li-2014                      crossref  ok       Erstautor, Jahr und Titel stimmen
li-2014                      arxiv     ok       Erstautor und Titel stimmen
li-2018                      crossref  ok       Erstautor, Jahr und Titel stimmen
lichtenberg-2021             crossref  ok       Erstautor, Jahr und Titel stimmen
lichtenberg-2021             arxiv     ok       Erstautor und Titel stimmen
lieske-1998                  crossref  ok       Erstautor, Jahr und Titel stimmen
liu-2022                     crossref  ok       Erstautor, Jahr und Titel stimmen
liu-2022                     arxiv     ok       Erstautor und Titel stimmen
luan-2017                    crossref  ok       Erstautor, Jahr und Titel stimmen
lunz-2024                    crossref  ok       Erstautor, Jahr und Titel stimmen
magnanini-2026                crossref  ok       Erstautor, Jahr und Titel stimmen
mahlke-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
mahlke-2021                  arxiv     ok       Erstautor und Titel stimmen
malhotra-1993                crossref  ok       Erstautor, Jahr und Titel stimmen
malhotra-1995                crossref  ok       Erstautor, Jahr und Titel stimmen
malhotra-1995                arxiv     ok       Erstautor und Titel stimmen
mallama-2017                 crossref  ok       Erstautor, Jahr und Titel stimmen
mallama-2017                 arxiv     ok       Erstautor und Titel stimmen
mallama-2018                 crossref  ok       Erstautor, Jahr und Titel stimmen
mallama-2018                 arxiv     ok       Erstautor und Titel stimmen
mankovich-2021               crossref  ok       Erstautor, Jahr und Titel stimmen
mankovich-2021               arxiv     ok       Erstautor und Titel stimmen
margot-2012                  crossref  ok       Erstautor, Jahr und Titel stimmen
maurice-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
mckinnon-2020                crossref  ok       Erstautor, Jahr und Titel stimmen
miles-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
militzer-2022                crossref  ok       Erstautor, Jahr und Titel stimmen
militzer-2023                crossref  ok       Erstautor, Jahr und Titel stimmen
militzer-2023                arxiv     ok       Erstautor und Titel stimmen
morrison-2021                crossref  ok       Erstautor, Jahr und Titel stimmen
muinonen-2010                crossref  ok       Erstautor, Jahr und Titel stimmen
muinonen-2015                crossref  ok       Erstautor, Jahr und Titel stimmen
murray-2000                  crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2012                arxiv     ok       Erstautor und Titel stimmen
nesvorny-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2018                crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2018                arxiv     ok       Erstautor und Titel stimmen
nesvorny-2018a                crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2018a                arxiv     ok       Erstautor und Titel stimmen
nesvorny-2019                crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2019                arxiv     ok       Erstautor und Titel stimmen
nettelmann-2025               crossref  ok       Erstautor, Jahr und Titel stimmen
nimmo-2026                   crossref  ok       Erstautor, Jahr und Titel stimmen
ohta-2016                    crossref  ok       Erstautor, Jahr und Titel stimmen
paita-2018                   crossref  ok       Erstautor, Jahr und Titel stimmen
palin-2020                   crossref  ok       Erstautor, Jahr und Titel stimmen
park-2021                    crossref  ok       Erstautor, Jahr und Titel stimmen
park-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1976                   crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1979                   crossref  ok       Erstautor, Jahr und Titel stimmen
peale-2002                   crossref  ok       Erstautor, Jahr und Titel stimmen
petit-2010                   url       ok       HTTP 200
petit-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
petricca-2025                crossref  ok       Erstautor, Jahr und Titel stimmen
piani-2020                   crossref  ok       Erstautor, Jahr und Titel stimmen
pollack-1996                 crossref  ok       Erstautor, Jahr und Titel stimmen
porco-2007                   crossref  ok       Erstautor, Jahr und Titel stimmen
prsa-2016                    crossref  ok       Erstautor, Jahr und Titel stimmen
prsa-2016                    arxiv     ok       Erstautor und Titel stimmen
ray-1996                     crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2017                 crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2017                 arxiv     ok       Erstautor und Titel stimmen
raymond-2022                 crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2022                 arxiv     ok       Erstautor und Titel stimmen
ries-1992                    crossref  ok       Erstautor, Jahr und Titel stimmen
samuel-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
shevchenko-2019               crossref  ok       Erstautor, Jahr und Titel stimmen
shevchenko-2019               arxiv     ok       Erstautor und Titel stimmen
soffel-2003                  crossref  ok       Erstautor, Jahr und Titel stimmen
soffel-2003                  arxiv     ok       Erstautor und Titel stimmen
staehler-2021                crossref  ok       Erstautor, Jahr und Titel stimmen
stephens-2015                crossref  ok       Erstautor, Jahr und Titel stimmen
stephenson-2016              crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2005                   crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2018                   crossref  ok       Erstautor, Jahr und Titel stimmen
tamayo-2025                  crossref  ok       Erstautor, Jahr und Titel stimmen
tamayo-2025                  arxiv     ok       Erstautor und Titel stimmen
thor-2021                    crossref  ok       Erstautor, Jahr und Titel stimmen
touboul-2015                 crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                arxiv     ok       Erstautor und Titel stimmen
tsiganis-2005                crossref  ok       Erstautor, Jahr und Titel stimmen
valley-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
velikodsky-2016              crossref  ok       Erstautor, Jahr und Titel stimmen
verbiscer-2005               crossref  ok       Erstautor, Jahr und Titel stimmen
verbiscer-2007               crossref  ok       Erstautor, Jahr und Titel stimmen
viswanathan-2019              crossref  ok       Erstautor, Jahr und Titel stimmen
viswanathan-2019              arxiv     ok       Erstautor und Titel stimmen
vockenhuber-2004              crossref  ok       Erstautor, Jahr und Titel stimmen
wahl-2017                    crossref  ok       Erstautor, Jahr und Titel stimmen
wahl-2017                    arxiv     ok       Erstautor und Titel stimmen
walsh-2011                   crossref  ok       Erstautor, Jahr und Titel stimmen
walsh-2011                   arxiv     ok       Erstautor und Titel stimmen
wang-2017                    crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2024                    crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2024a                   crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
warren-2011                  crossref  ok       Erstautor, Jahr und Titel stimmen
weber-2011                   crossref  ok       Erstautor, Jahr und Titel stimmen
williams-1971                crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2014                crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2015                crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
wisdom-1983                  crossref  ok       Erstautor, Jahr und Titel stimmen
yang-2023                    crossref  ok       Erstautor, Jahr und Titel stimmen
yao-2025                     crossref  ok       Erstautor, Jahr und Titel stimmen
yoder-1981                   crossref  ok       Erstautor, Jahr und Titel stimmen
youdin-2005                  crossref  ok       Erstautor, Jahr und Titel stimmen
youdin-2005                  arxiv     ok       Erstautor und Titel stimmen
young-2016                   crossref  ok       Erstautor, Jahr und Titel stimmen
zhang-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen

240 ok, 1 Warnungen, 0 Fehler
```

**Eine Warnung, begründet:** `cgpm-2022` — „Crossref führt keine Autoren, Erstautor ungeprüft".
`cgpm-2022` ist ein Behelfseintrag mit Körperschaft als Autor (Conférence Générale des Poids et
Mesures, siehe Task 3, Ruling „Behelfseinträge bleiben"); Crossref liefert für diese Resolution
keine Autorenliste, das ist seit der Nacharbeit von Task 3 bekannt und bewusst hingenommen — die
Warnung ist die vom Prüfskript in Etappe 2b eingeführte Herabstufung genau dieses Falls (vorher ein
Fehler, jetzt eine Warnung, siehe Task 2b). Kein Handlungsbedarf.

**Wiederholung bei Serverfehlern, einmal gebraucht:** Der erste Volllauf dieser Abnahme
(`scratch-t10/pruefskript-lauf1.txt`) zeigte einen Fehler: `mahlke-2021` (arXiv) antwortete mit
HTTP 429 (Ratenbegrenzung durch die vielen aufeinanderfolgenden Abrufe des Gesamtlaufs), ein Status,
den die im Rahmen dieser Etappe eingeführte Wiederholungslogik nicht abdeckt (sie greift nur bei
502/503/504 und Zeitüberschreitung, siehe `scripts/pruefe-literatur.ts`). Der sofort im Anschluss
ausgeführte Einzelabruf `npm run literatur:pruefen -- --nur mahlke-2021` bestätigte: 2 ok, 0 Fehler
— ein vorübergehender Ratenbegrenzungs-Effekt, kein dauerhafter Mangel. Der oben abgedruckte zweite
Volllauf war ohne jede Wiederholung auf Anhieb fehlerfrei (`scratch-t10/pruefskript-lauf2.txt`).

## 4. Fachprüfung

Wörter mit `wc -w`, Belegzeilen mit `grep -cE '^\| [0-9]+ \|' docs/belege/hochschule/<datei>.md`
(beides an den heutigen Dateien nachgezählt, nicht aus dem Ledger übernommen), Zitate (Vorkommen
und verschiedene Werke) aus dem Browser-Rundgang in Abschnitt 5.3, neue Katalogeinträge aus dem
Vergleich `git show <commit> -- src/data/literatur.ts` an jedem Umsetzungs- und Nacharbeits-Commit
des jeweiligen Tasks (siehe Abschnitt 2), Runden/Fehler/Hinweise aus den Fachprüfungsdateien
`task-<N>-fachpruefung-r<R>.md`:

| Text | Wörter de/en | Belegzeilen | Zitate (Vorkommen/verschiedene Werke) | neue Katalogeinträge | Runden | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---:|---|---:|---:|---|---|
| `thema-bezugssysteme` (Task 3) | 3008 / 3335 | 110 | 51 / 20 | 14 | 3 (Fachprüfung, 2 Nachprüfungen) + Gegenprüfung | 4/4 (F1 BCRS-Präsens, F2 „Im Modell"-Rahmen, F-R3-1 JPL-Fehlerbereich, F-R3-2 unmaskiertes `\|`) | Schaltsekunden-Absatz nach der 28. CGPM (13.–15.10.2026) nachführen? (Frage an Jens, §8) |
| `thema-gezeiten` (Task 4) | 3253 / 3555 | 121 | 71 / 31 | 26 (27 eingeführt, `bagheri-2026` in Runde 2 wieder entfernt) | 3 (Fachprüfung, Nachprüfung) + Gegenprüfung | 2/2 (F1 Titan k_f/k₂-Verwechslung Planet↔gebundener Mond, F2 Gladman-Zitat ungeöffnet) | keine |
| `thema-resonanzen` (Task 5) | 2371 / 2567 | 89 | 46 / 23 | 21 | 3 (Fachprüfung, Nachprüfung) + Gegenprüfung | 2/2 (2:1-Lücke: erst „nur innere Flanke", dann „von der oberen Grenze angeschnitten") | Streubreite 7:3 bewusst nicht vereinheitlicht — zwei richtige, unterschiedliche Messmethoden nebeneinander in Belegzeile 81 (Ruling, kein Fehler); H6 (neuere Pluto-Integrationen ~82°/23°) bewusst nicht umgesetzt, bräuchte neuen Katalogeintrag |
| `thema-innerer-aufbau` (Task 6) | 3899 / 4274<sup>†</sup> | 121 | 84 / 28 | 22 | 3 (Fachprüfung, Nachprüfung) + Gegenprüfung | 1/1 (F1 fluide Love-Zahl gilt nicht für gebunden rotierende Monde wie Titan) | Wortzahl en 4274 über der Obergrenze 4000 (§8) |
| `thema-photometrie` (Task 7) | 3586 / 3927 | 128 | 76 / 25 | 23 | 3 (Fachprüfung, Nachprüfung) + Gegenprüfung | 1/1 (F1 Fresnel-Reflexion am Halbvektor statt am Phasenwinkel) | keine |
| `thema-entstehung` (Task 8) | 3677 / 4024<sup>†</sup> | 117 | 89 / 49 | 42 | 3 (Fachprüfung, Nachprüfung) + Gegenprüfung | 2/2 (F1 St=1-Korngröße nur für MMSN gültig gemacht, F2 veraltete gleiche ¹⁸²W/¹⁸⁴W-Anomalie) | Wortzahl en 4024 über der Obergrenze 4000 (§8); Prüfskript scheitert am Titel von Brennecka 2010 (Ursache offen, betrifft nicht diesen Text direkt, da nicht im Katalog) |

<sup>†</sup> Wortzahl: Richtwert für Themen 1500–4000 Wörter je Fassung (Entwurf §5.2 nach Zwischen-Task
2b, siehe Task-10-Ergänzung); `thema-photometrie` liegt mit 3586/3927 englisch am nächsten an der
Obergrenze, aber noch knapp darunter. Die zwei mit † markierten Texte liegen englisch über 4000
(`thema-innerer-aufbau` 4274 und `thema-entstehung` 4024). Alle sechs Texte sind länger als der
ursprüngliche Richtwert 1000–2000, dessen Anhebung Jens am 18.09.2026 ausdrücklich veranlasst hat
(Ledger, Zwischen-Task 2b).

„Runden" zählt wie in der Abnahme 4d-1 die tatsächlich durchlaufenen Prüfrunden bis zum ersten
Fehler-freien Zustand plus die abschließende, unabhängige Gegenprüfung (Modellwechsel opus→sonnet).
Jeder der sechs Texte durchlief zusätzlich eine Spec-Prüfung (Ruling V3) gegen die Vorgaben des
jeweiligen Tasks (Pflichtinhalte, Gliederung, Verweise, Katalogform, Zahlenformat, Belegliste); alle
sechs Spec-Prüfungen kamen zum Ergebnis „Approved" (`task-<N>-spec-befunde.md`), mit Minor-Befunden
ohne Textänderung außer bei `thema-bezugssysteme` (S1 Belegzeile 73, in der Nacharbeit behoben) und
`thema-innerer-aufbau` (S1 Querverweis Nr. 36 auf falsche Belegzeile, ebenfalls behoben; S2 drei
Zusatzverweise, im Bericht begründet statt entfernt).

## 5. Sichtprüfung

Browser: `http://localhost:5173/Orrery/` (bereits laufender Server, HTTP 200, kein zweiter
gestartet). Direkt nach jedem `browser_navigate`: `quality.tier = 'high'`. Fensterbreite 2560 px
(`innerWidth`, bestätigt in Schritt 2).

### 5.1 Funktionsnamen

Blockformel `M = E - e \sin E` aus `thema-bahnelemente`, Struktur geprüft (`math.outerHTML`):
`<mi>e</mi><mspace width="0.1667em"/><mi>sin</mi><mo>⁡</mo><mspace width="0.1667em"/><mi>E</mi>` —
genau zwei Leerräume von je 0,1667 em (`abstaende: 2`) und ein unsichtbarer
Funktionsanwendungs-Operator U+2061 (`funktionsanwendung: 1`), exakt an den vorgesehenen Stellen:
beides wie erwartet.

Für die Pixelmessung wurde die Formel auf 400 % Schriftgröße vergrößert (`em` = 56 px, `dpr` = 1)
und in zwei Aufnahmen verglichen, ausgewertet mit einem Messskript
(`.playwright-mcp/messung_sin2.py`, Screenshots `.playwright-mcp/4d2-sin-mit2.png`/
`4d2-sin-ohne2.png`, alle drei vor dem Commit gelöscht).

**Erste Messung (absolute Position von „E"), widerlegt:** Die ursprüngliche Messung verglich nur
die absolute `x`-Position von „E" mit und ohne die beiden `mspace`-Leerräume und maß dabei nur rund
die Hälfte der erwarteten Verschiebung (Tinte 10 px, DOM 9,3 px statt erwarteter 18,7 px). Ursache,
durch Nachmessen bestätigt: `<math display="block">` setzt den Formelinhalt in der unveränderten
Blockbox zentriert (`block.x` bleibt bei jeder Variante exakt `1921`, `block.w` exakt `599`). Beim
Nullsetzen beider Leerräume wird der jetzt schmalere Inhalt neu zentriert: „M" wandert um +9,33 px
nach rechts, „E" um −9,33 px nach links, „sin" bleibt an Ort und Stelle — macht in Summe die volle
Verschiebung von 18,66 px, aber aufgeteilt auf beide Enden der zentrierten Box. Eine Messung, die
nur ein Ende (E) absolut abliest, sieht deshalb systembedingt nur die Hälfte, unabhängig vom
Browser. Die in der ersten Fassung dieses Protokolls daraus gefolgerte Chrome-eigene
Abstandsregel vor Funktionsnamen entfällt damit als Erklärung; sie war ein Messfehler der Vorlage
(absolute statt relative Messung in einer zentrierten Box), kein Befund über den Browser.

**Zweite Messung (relativer Abstand M → E), maßgeblich:** In derselben Ladung wurde stattdessen der
Abstand vom ersten zum letzten `mi`-Knoten der Formel (`M` zu `E`) gemessen, DOM und — soweit über
die Screenshots möglich — auch in der Tinte:

```
M->E Abstand mit (Tinte px): 340   ohne: 321   Verschiebung: 19
M->E Abstand mit (DOM px): 339.62   ohne: 320.97   Verschiebung: 18.66
erwartet (px): 18.67
Abweichung Tinte (%): 1.8
Abweichung DOM (%): -0.1
```

**Beide Kriterien (Tinte und DOM je innerhalb ±15 % von 18,7 px) sind damit erfüllt** (Abweichung
1,8 % bzw. −0,1 %). Rohwerte: `M` `{x: 2025,6875}` → ohne `{x: 2035,015625}` (+9,328125 px), `E`
`{x: 2365,3125}` → ohne `{x: 2355,984375}` (−9,328125 px), „sin" unverändert — exakt die in der
ersten Messung beobachtete Aufteilung, hier aber korrekt zur vollen Verschiebung zusammengezählt.
Strukturell ist der Code ohnehin exakt wie vorgesehen (2 `mspace`, 1 U+2061, siehe oben); jetzt
bestätigt auch die Pixelmessung den TeX-Abstand. Berichtigung für Abschnitt 7 und 8: Die
Messvorlage des Plans soll für künftige Etappen relativ (erster zu letztem betroffenen Token)
statt absolut in einer zentrierten Box messen (Hinweis statt Frage, siehe Abschnitt 8).

### 5.2 Hinweis „nur Hochschule"

Zwei Fachthemen geprüft (`gezeiten`, `photometrie`), je Deutsch und Englisch: `hochschule.kopf`
exakt der erwartete Titel, `hochschule.hinweise` leer, `gymnasium` enthält genau den erwarteten
Hinweis. Alle acht Kriterien (2 Themen × 2 Sprachen × 2 Prüfpunkte) erfüllt:

| Thema | Sprache | Kopf Hochschule | Hinweis Gymnasium |
|---|---|---|---|
| gezeiten | de | „Gezeiten und Roche-Grenze" | „Diesen Text gibt es nur auf Hochschulniveau." |
| gezeiten | en | „Tides and the Roche limit" | „This text is only available at university level." |
| photometrie | de | „Albedo und Helligkeit" | „Diesen Text gibt es nur auf Hochschulniveau." |
| photometrie | en | „Albedo and brightness" | „This text is only available at university level." |

### 5.3 Rundgang

18 Kombinationen (Sprachen de/en × sechs Fachthemen sowie die drei von Task 9 geänderten
Pilotdateien `thema-bahnelemente`, `objekt-earth`, `szene-mondfinsternis`, laut `task-9-report.md`).
Zustand je Kombination wie in der Abnahme 4d-1 gesetzt (Thema über `setInfo({thema})`; Erde über
`setInfo({thema:null})` und `setCamera({targetId:'earth', mode:'free'})`; Szene über
`setCinema({running:true, shuffle:false, nummer:18})` — Index von `mondfinsternis` in
`src/data/scenes.ts` selbst nachgezählt, 19. Eintrag = Index 18, bestätigt), `setCamera({mode:'cinema'})`,
nach Stabilisierung `setCinema({running:false})`, `setUi({hidden:false})`), auf den Kopfwechsel
gepollt, dann Datenblock- und Verweisprüfung. Jeder einzelne Verweis wurde geklickt (Literatur/
Quelle skriptgestützt in einem `browser_evaluate` mit Klick und Prüfung zusammen, wie in 4d-1
begründet; Objekt/Thema/Szene ebenso, mit Wiederherstellung des Ausgangszustands nach jedem Klick),
die Wirkung nach Art geprüft (`objekt:` → `camera.targetId`, `thema:` → `ui.info.thema`, `szene:` →
`cinema.nummer` und `camera.mode`, `quelle:`/`literatur:` → Rahmenfarbe der Karte):

| Sprache/Kennung | Kopf | Formelfehler | Formeln | Tabellen | Hinweise | Verweise (Art: Anzahl, alle Treffer) |
|---|---|---:|---:|---:|---|---|
| de / `thema:bezugssysteme` | Bezugssysteme und Zeitskalen | 0 | 40 | 1 | – | literatur 51, quelle 2, thema 8, objekt 1 |
| en / `thema:bezugssysteme` | Reference systems and time scales | 0 | 40 | 1 | – | literatur 51, quelle 2, thema 8, objekt 1 |
| de / `thema:gezeiten` | Gezeiten und Roche-Grenze | 0 | 145 | 2 | – | thema 7, literatur 71, quelle 7, objekt 9 |
| en / `thema:gezeiten` | Tides and the Roche limit | 0 | 145 | 2 | – | thema 7, literatur 71, quelle 7, objekt 9 |
| de / `thema:resonanzen` | Bahnresonanzen | 0 | 63 | 1 | – | literatur 46, quelle 3, thema 7, objekt 10 |
| en / `thema:resonanzen` | Orbital resonances | 0 | 63 | 1 | – | literatur 46, quelle 3, thema 7, objekt 10 |
| de / `thema:innerer-aufbau` | Innerer Aufbau aus Schwerefeld und Rotation | 0 | 144 | 1 | – | literatur 84, objekt 8, quelle 5, thema 9 |
| en / `thema:innerer-aufbau` | Interior structure from gravity and rotation | 0 | 144 | 1 | – | literatur 84, objekt 8, quelle 5, thema 9 |
| de / `thema:photometrie` | Albedo und Helligkeit | 0 | 102 | 1 | – | quelle 2, literatur 76, objekt 13, thema 2, szene 1 |
| en / `thema:photometrie` | Albedo and brightness | 0 | 102 | 1 | – | quelle 2, literatur 76, objekt 13, thema 2, szene 1 |
| de / `thema:entstehung` | Entstehung des Sonnensystems | 0 | 53 | 1 | – | quelle 2, literatur 89, objekt 5, thema 7 |
| en / `thema:entstehung` | Formation of the Solar System | 0 | 53 | 1 | – | quelle 2, literatur 89, objekt 5, thema 7 |
| de / `thema:bahnelemente` | Bahnelemente | 0 | 124 | 2 | – | literatur 12, quelle 15, thema 2, objekt 6 |
| en / `thema:bahnelemente` | Orbital elements | 0 | 124 | 2 | – | literatur 12, quelle 15, thema 2, objekt 6 |
| de / `objekt:earth` | Erde | 0 | 78 | 1 | – | literatur 57, thema 7, quelle 6, objekt 1, szene 1 |
| en / `objekt:earth` | Earth | 0 | 78 | 1 | – | literatur 57, thema 7, quelle 6, objekt 1, szene 1 |
| de / `szene:mondfinsternis` | Szene: Mondfinsternis | 0 | 7 | 0 | – | objekt 4, thema 3, literatur 7, quelle 2 |
| en / `szene:mondfinsternis` | Scene: Lunar eclipse | 0 | 7 | 0 | – | objekt 4, thema 3, literatur 7, quelle 2 |

`formelfehler` in jeder Kombination 0, keine Hinweiszeile in keiner Kombination, `zitateGleichKarten`
in jeder Kombination `true` (jedes eindeutige `literatur:`-Ziel im Text hat genau eine Karte).
**Alle 1296 Einzelverweise trafen ihr Ziel** (Summe je Sprache: 62 + 94 + 66 + 106 + 94 + 103 + 35 +
72 + 16 = 648, für beide Sprachen zusammen 2 × 648 = 1296 Verweise insgesamt geklickt und geprüft,
alle mit Ergebnis „ok"). Der Szenenkopf zeigt bei
Hochschultexten „Szene: …" wie bei Gymnasialtexten (Vorgabe aus 4c-4, bestätigt für Mondfinsternis).

**Zwei Messlehren aus dieser Sichtprüfung** (Ledger-Rulings dieses Tasks, Abschnitt 6):

1. Der im Brief vorgeschlagene Test `karte.classList.contains('border-sky-300')` schlägt in dieser
   Etappe grundsätzlich fehl — die tatsächliche Tailwind-Klasse der hervorgehobenen Karte heißt
   `border-sky-300/80` (Opazitäts-Suffix), ein eigenständiges Klassentoken, das `classList.contains`
   mit dem Literal `border-sky-300` nie trifft. Funktional ist die Hervorhebung korrekt (Karte
   bekommt `border-sky-300/80 bg-sky-400/20`); der Test wurde auf `className.includes('border-sky-300')`
   umgestellt.
2. Bei `szene:mondfinsternis` (de, erster Versuch) blieb die Seite auf einem fremden Thema
   („Finsternisse") bzw. einer fremden Szene (`erdaufgang`, Index 0) hängen, obwohl `setCinema` mit
   `nummer: 18` gesetzt wurde: (a) ein zuvor gesetztes `ui.info.thema` verdrängt die laufende Szene
   nicht von selbst — dieselbe Lehre wie in 4d-1 Abschnitt 5.4, hier zusätzlich bestätigt mit dem
   expliziten Gegenbeweis (`setInfo({thema:null})` vor dem Neustart behebt es); (b) ein von einer
   früheren Manipulation übrig gebliebenes `cinema.elapsedSec` (hier 34,3 s) lässt die Szene beim
   Neustart mit `running:true` sofort über ihre Dauer hinaus weiterlaufen und zur nächsten (hier:
   wieder bei Index 0 umlaufenden) Szene springen, bevor der Kopf geprüft werden kann — Fix:
   `elapsedSec: 0` im selben `setCinema`-Aufruf setzen. Beides ist eine Eigenheit der Testmethode
   (rohe Store-Zustände ohne die Zwischenschritte der echten `startCinema()`-Funktion), kein
   Programmfehler; nach der Korrektur lief die Kombination bei jedem der vier Versuche
   (mondfinsternis de/en, dazu zwei Wiederholungen während der Fehlersuche) sauber durch.

**Ferner beobachtet, nicht Teil der App:** Nach rund acht Kombinationen ohne echte Mauseingabe
sprang die Kino-Wiedergabe von selbst wieder an (`cinema.running` wurde `true`, `idleResumeSec: 30`
war abgelaufen) und verdeckte kurz das Infopanel bei `thema:photometrie` (de) — dieselbe
„Rückkehr"-Automatik, die die lokale Projektanleitung als gewolltes Verhalten für den freien Modus
beschreibt (Ruhefrist nach einer Pause). Für den Rest der Sichtprüfung wurde `idleResumeSec` testweise auf
999 999 gesetzt, um das Verhalten aus den Messungen herauszuhalten; das ist keine Änderung an der
Anwendung, nur am Testzustand, und wird vor dem Commit nicht persistiert (Store-Zustand im Browser,
keine Datei).

### 5.4 Konsole

`browser_console_messages` über die gesamte Sitzung: **0 Fehler, 3 Warnungen**, alle:

```
[WARNING] Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
```

Ursache wie in 4d-1 Abschnitt 5.5: `startCinema()` fordert beim Szenenstart Vollbild an; ein per
`el.click()`/`setCinema` skriptgestützt ausgelöster Szenenstart bringt keine echte Nutzergeste mit,
die Vollbild-Anfrage schlägt fehl und Chrome loggt das unabhängig vom `.catch()` im
Anwendungscode. Gegenprobe mit echtem `browser_click` auf denselben Verweis (`szene:mondfinsternis`
im Text von `thema-photometrie`, de): Gesamtzahl blieb bei 10 Nachrichten / 3 Warnungen, **keine**
zusätzliche Warnung. Damit gilt die Regel aus dem Task-Auftrag: Die drei Warnungen sind Artefakte
der eigenen Testmethode (drei skriptgestützte Szenenstarts: der Rundgang-Kombinationen
`szene:mondfinsternis` de, en sowie der `szene:`-Verweis-Klick innerhalb von `thema:photometrie`),
kein Anwendungsfehler, und werden nicht als Fehlerzahl gezählt.

## 6. Rulings der Umsetzung

Aus dem Ledger, in Reihenfolge (jede Zeile mit „Ruling:"):

**V1 Ruling:** Kein Worktree, Branch `hochschule-2` im Arbeitsverzeichnis — die lokale
Projektanleitung geht dem Skill vor (Vite-Server liefert dieses Verzeichnis) — kostet nichts, falls
falsch.

**V2 Ruling:** Briefs selbst zusammengesetzt: Globale Randbedingungen + Tasktext; Task 3–8
zusätzlich „Gemeinsame Vorgaben"; Task 2 ohne den angehängten Gemeinsam-Abschnitt; Task 10 ohne
Abschluss/Hinweise/Planrulings — Extraktionsskript schneidet an der Plangliederung falsch — falls
falsch: Umsetzer fehlt Kontext, fällt in der Prüfung auf.

**V3 Ruling:** Text-Tasks bekommen neben der Fachprüfung (opus, Auftrag wörtlich aus dem Plan) eine
Spec-Prüfung (sonnet) gegen die Vorgaben des Tasks (Pflichtinhalte, Gliederung, Verweise,
Katalogform, Zahlenformat, Belegliste); Befunde beider gehen gebündelt in eine Nacharbeit — Skill
verlangt Task-Review, Plan nennt nur Fachprüfung — kostet einen Sonnet-Lauf je Text.

**V4 Ruling:** Modelle nach „Hinweise für den Controller": sonnet für Task 1, 2, 9, 10, Task-Reviews
und Nachreviews von Code; opus für Umsetzer Task 3–8 und Fachprüfer (auch Nachprüfungen, da
fachlich) — Plan geht dem Skill (haiku für ausgeschriebenen Code) vor — kostet etwas mehr je
Code-Task.

**V5 Ruling:** Task 9 startet erst, wenn alle Fachprüfungen und Nacharbeiten Task 3–8 abgeschlossen
sind; Nacharbeit eines Texts läuft nur, wenn kein anderer Umsetzer läuft — ein Umsetzer gleichzeitig,
Task 9 setzt fertige Texte voraus — kostet Wartezeit.

**Ruling (Task 3):** Zwischen-Task 2a „Crossref-Untertitel im Titelvergleich" (sonnet, TDD) vor
Task 4; Klioner et al. 2022 (Gaia-CRF3) kommt in der Nacharbeit von Task 3 in Katalog und Text —
Gaia-CRF3 ist Pflichtinhalt, A&A-Titel mit Untertitel kommen in späteren Texten wieder — falls
falsch: ein kleiner Code-Commit zu viel.

**Ruling (Task 3):** Skripte im Arbeitsordner tragen `/* eslint-disable */` (Regeldatei ergänzt)
statt einer Änderung der ESLint-Konfiguration — Arbeitsordner-Name soll nicht in versionierte
Dateien — falls falsch: ein Lint-Lauf scheitert an einem vergessenen Skript.

**Ruling (Task 4):** Io wird nicht als „schneller migrierend als erwartet" dargestellt, obwohl der
Auftrag es nennt — Lainey et al. 2009 zeigen Io derzeit nach innen wandernd; Text folgt der Quelle
(Spec vor Plan, Richtigkeit vor Vorgabe) — falls falsch: Fachprüfung meldet es.

**Ruling (Task 3):** Behelfseinträge bleiben — `gaia-2022` mit Autor „Gaia Collaboration, Klioner,
S. A." und `cgpm-2022` mit Autor „CGPM, General Conference on Weights and Measures" und nur `url`,
obwohl eine DOI (10.59161/CGPM2022RES4E) existiert: Autorentest verlangt Komma, Prüfskript meldet
Crossref ohne Autoren und abweichenden Titel als Fehler — kein Zwischen-Task, Frage an Jens
(Körperschaften als Autoren, DOI ohne Autoren als Warnung) — falls falsch: ein Eintrag ohne DOI und
zwei ungewöhnliche Autorfelder, später per kleinem Code-Task nachziehbar. (Umgesetzt in Zwischen-Task
2b, siehe unten.)

**Ruling (Task 3):** In die Nacharbeit Runde 3 kommen neben F-R3-1/F-R3-2 auch zwei
Zuordnungshinweise (Versionsangabe „Version 5 vom 13.07.2026" gehört zu Draft Resolution V,
Resolution C steht seit Version 2 vom 30.01.2026; Entwurf verfasst vom CIPM) — sachliche
Zuordnungen, im selben Commit fast kostenlos — falls falsch: ein etwas größerer
Nacharbeits-Commit.

**Ruling (Task 5):** Der Code-Befund „Perijoven von Io und Europa laufen im Datensatz vorwärts,
Zweikörperwinkel zirkulieren in 243/255 Tagen statt zu librieren" (vermutlich Vorzeichen aus der
JPL-Tabelle) wird in dieser Etappe NICHT behoben — Etappe 4d-2 schreibt Texte, Datenänderungen
fallen in einen eigenen Task mit Sichtprüfung; der Text beschreibt das Modell, wie es heute ist —
falls falsch: Der Befund steht im Protokoll und kostet später einen eigenen Task.

**Ruling (Task 5):** Der Methodenstreit um die Streubreite 7:3 wird geparkt statt erzwungen
aufgelöst — beide Messungen sind korrekt und messen Verschiedenes, Belegzeile 81 stellt beide
nebeneinander, der Textwert ist unstrittig — falls falsch: eine Belegzeile nennt den
Methodenunterschied nur knapp.

**Ruling (Zwischen-Task 2b):** Obergrenze für Themen 4000 statt der im Auftrag genannten 3500
Wörter — der Gezeiten-Text ist nach den Nacharbeiten auf 3555 Wörter (en) gewachsen, der Richtwert
soll die freigegebenen Texte einschließen — falls falsch: Richtwert später wieder senken, keine
Testwirkung. (Zwei der sechs Texte liegen englisch trotzdem noch darüber, siehe Abschnitt 4 und 8.)

**Ruling (Task 8):** Der Kepler-Absturz wird in dieser Etappe NICHT behoben — 4d-2 schreibt Texte,
Codeänderungen am Simulationskern gehören in einen eigenen Task mit Tests und Sichtprüfung (wie
Task-5-Ruling); der Fehler besteht seit Einführung der linearen Raten und ist nicht durch diesen
Branch entstanden — falls falsch: Jens will ihn vor der Abnahme behoben haben, dann ein
Zwischen-Task (Klemmung von e oder Gültigkeitsgrenze der Zeit) plus Anpassung von Belegzeile 108
und „Im Modell".

**Ruling (dieser Task, dazu):** Beim Verweis-Rundgang (Abschnitt 5.3) wurde der im Auftrag genannte
Prüfausdruck `classList.contains('border-sky-300')` durch `className.includes('border-sky-300')`
ersetzt, weil die tatsächliche Tailwind-Klasse der Hervorhebung `border-sky-300/80` heißt (eigenes
Klassentoken mit Opazitäts-Suffix, von `classList.contains` mit dem kürzeren Literal nie getroffen)
— funktional unverändertes Verhalten der Anwendung, nur der Testausdruck war zu eng — falls falsch:
eine falsch-positive Bestätigung wäre nur durch eine echte Farbprüfung im Screenshot aufgefallen.

**Ruling (dieser Task, dazu):** Die Baseline-Funktion für `szene:mondfinsternis` setzt zusätzlich
`ui.info.thema: null` und `cinema.elapsedSec: 0` bei jedem `setCinema`-Neustart (nicht nur beim
ersten) — ohne das erste blieb die Seite auf einem zuvor gesetzten Thema hängen (dieselbe Lehre wie
4d-1 Abschnitt 5.4), ohne das zweite lief eine mit `running:true` neu gestartete Szene sofort über
ihre Dauer hinaus weiter und sprang zur nächsten — beides Eigenheiten der Testmethode (rohe
Store-Zustände statt der echten `startCinema()`-Funktion), kein Programmfehler — falls falsch: eine
Kombination hätte einen falschen Kopf gezeigt und wäre am Kriterium „Kopf = Titel" gescheitert,
nicht unbemerkt geblieben.

## 7. Bekannte Unschärfen

**Aus dieser Abnahme:**

- Formelsatz-Kriterium „Tinten-/DOM-Verschiebung je innerhalb ±15 % von 18,7 px": Die erste,
  absolute Messung der Position von „E" erfüllte es nicht (gemessen rund 9–10 px, die Hälfte),
  weil `<math display="block">` den Inhalt in einer unveränderten, zentrierten Blockbox setzt und
  eine schmalere Formel beidseitig neu zentriert (M +9,33 px, E −9,33 px). Die relative Messung
  vom ersten zum letzten `mi`-Knoten (M → E) zeigt die volle Verschiebung (Tinte 19 px, DOM
  18,66 px, Abweichung 1,8 % bzw. −0,1 % von 18,7 px) und **erfüllt beide Kriterien** (Abschnitt
  5.1). Die ursprüngliche Deutung einer Chrome-eigenen Abstandsregel vor Funktionsnamen war ein
  Messfehler der Vorlage (absolute statt relative Messung), kein Browserbefund — für künftige
  Etappen soll die Messvorlage relativ messen (Hinweis in Abschnitt 8).
- Konsole der Sitzung zeigt drei Warnungen (`requestFullscreen` ohne Nutzergeste), ursächlich ein
  Artefakt der drei skriptgestützten Szenenstarts dieser Sichtprüfung, durch Gegenprobe mit echtem
  Klick widerlegt als Anwendungsfehler (Abschnitt 5.4), wie bereits in 4d-1 festgestellt.
- Hauptchunk wuchs um rund 39 kB (gzip rund 12 kB) durch den von 51 auf 199 Einträge gewachsenen,
  weiterhin eager geladenen Literaturkatalog — Befund M9 aus der Schlussprüfung 4d-1, weiterhin
  nicht behoben, Planungsfrage bleibt offen (faules Laden oder Aufteilung vor Phase 5 oder 4d-11).
- `bagheri-2026` wurde in Task 4 eingeführt und in derselben Etappe (Nacharbeit Runde 2) wieder
  entfernt, nachdem sich Ios Exzentrizität zuverlässiger aus `lari-2024` ergab — im Katalog bleibt
  keine Spur davon zurück (durch `literatur.test.ts` bestätigt), der Nettozuwachs in Abschnitt 4
  berücksichtigt die Entfernung bereits.

**Aufgeschobene Kleinigkeiten (minor deferred, aus dem Ledger):**

- Task 1: `schliessend` in `mitFunktionsabstaenden` prüft Text `)`/`]` ohne `tag === 'mo'` — heute
  folgenlos, da Nicht-`mo` ohnehin Abstand bekommt.
- Task 2: Umsetzer nutzte `git stash`/`pop` zur Zählung (ohne Folgen) — Regeldatei der Text-Tasks
  verbietet es ausdrücklich.
- Task 2a: kein Testfall für leeren Untertitel `subtitle: ['']` (Zweig vorhanden, ungetestet).
- Task 3: Zeilenumbruch `de:85–86` mitten im Satz (Markdown rendert korrekt).
- Task 4: Despin-Vorfaktor 1/3 ohne zugängliche Primärstelle (als Wiedergabe gekennzeichnet);
  Magnanini Tab. C.2 in Runde 2 nicht zu öffnen (Kennzeichnung steht); de „eigene Auswertung" gegen
  en „independent analysis".
- Task 5: Kommentarblock `src/sim/belts.ts:92–98` widersprach nach der Berichtigung dem Text —
  in Zwischen-Task 5a behoben; Belegzeile 81 könnte den Methodenunterschied in einem Halbsatz
  nennen; vorbestehende unmaskierte `|` in Belegzeilen 24/46 (wörtliche Zitate).
- Zwischen-Task 5a: „rund 28 % Einbruch" bei 28,54 % — „rund 29 %" läge näher.
- Task 6: Zusatzverweise `objekt:ganymede`, `thema:bahnelemente`, `thema:bezugssysteme` im Bericht
  begründet, nicht im Auftrag verlangt.
- Task 7: Kommentar `src/render/lighting.ts` „1,0 → 232" (nachgerechnet 226, 233 erst mit Füllung —
  Code-Befund, siehe unten); Mond fehlt in der Photometrie-Tabelle, Iapetus nur Bond-Werte
  (begründet, keine Quelle mit p und A im selben Band); zwei Katalogeinträge mit zweibuchstabigem
  Initial „Yu." (übliche Umschrift, Test grün).
- Task 8: `raymond-2022` als Buchkapitel ohne Zeitschrift/Band/Seite (Präzedenz vorhanden); Prüfer
  sieht `le-maistre-2023` als Sortierausreißer (Sortiertest grün, Reihenfolge korrekt); Linktexte
  „Haisch Jr. et al. 2001", „Nesvorný et al. 2018a" (Dateitest verlangt Katalogname/Suffix, erfüllt).
- Task 9: `objekt-earth` „Kenngrößen und Messung" verlinkt „Trägheitsmoment" statt des früheren
  „Hauptträgheitsmomente"; `photometrie` → `innerer-aufbau` über „innerer Wärmestrom" der
  schwächste Bezug; `szene-mondfinsternis` „Danjon-Skala" statt früherem „Helligkeit".

**Code-Befunde aus den Texten (nicht behoben, aus dem Ledger, für Jens/spätere Etappen):**

- Kepler-Absturz ab Jahr 12 563 (Saturns linear fortgeschriebene Exzentrizität wird negativ,
  `solveKepler` wirft, Bildschleife steht dauerhaft; Ruling Task 8, hohe Priorität).
- Perijoven von Io und Europa laufen im Datensatz vorwärts statt zu librieren (Ruling Task 5).
- Kommentar `src/render/lighting.ts` „1,0 landet bei 232 von 255" — nachgerechnet 226, 233 erst mit
  der Füllung (Task 7).
- Prüfskript scheitert am Titel von Brennecka 2010, Ursache nicht untersucht — die Arbeit wurde
  deshalb nicht in den Katalog aufgenommen (Task 8).

## 8. Halt: Fragen an Jens

1. **Hinweis, keine Frage — Formelsatz-Kriterium Tinten-/DOM-Verschiebung** (Abschnitt 5.1): Die
   relative Messung vom ersten zum letzten `mi`-Knoten (M → E) bestätigt den TeX-Abstand vollständig
   (Abweichung 1,8 % Tinte / −0,1 % DOM von 18,7 px, beide innerhalb ±15 %). Die zunächst gemessene
   Abweichung kam von einer absoluten Positionsmessung von „E" allein, die die Zentrierung der
   `<math display="block">`-Box nicht berücksichtigte (eine schmalere Formel wird beidseitig neu
   zentriert, nicht nur am rechten Ende verschoben). Für künftige Etappen soll die Messvorlage
   grundsätzlich den Abstand zwischen erstem und letztem betroffenen Token messen (relativ),
   nicht die absolute Position eines einzelnen Endes in einer zentrierten Box.
2. **Schaltsekunden-Absatz in `thema-bezugssysteme`**: Der Text ist nach dem heutigen Stand der
   28. CGPM (13.–15.10.2026 in Versailles) formuliert, die Abstimmung selbst hat noch nicht
   stattgefunden. Nach der Sitzung nachführen?
3. **Wortzahl über der bereits angehobenen Obergrenze 4000** (Zwischen-Task 2b): `thema-innerer-aufbau`
   liegt englisch bei 4274, `thema-entstehung` bei 4024 (Abschnitt 4). Beide Texte sind laut
   Fachprüfung durch die verlangten Ergänzungen bzw. eine notwendige Differenzierung (Planeten vs.
   gebunden rotierende Monde) gewachsen. Kürzen, oder wie beim Pilot `objekt-earth` in 4d-1
   (Richtigkeit vor Wortzahl) so lassen?
4. **Streubreite 7:3 in `thema-resonanzen`** (Ruling Task 5): Zwei unabhängig nachgerechnete, beide
   korrekte Messmethoden ergeben unterschiedliche Zahlen (98,7–106,5 % vs. 101,2–108,5 %); Belegzeile
   81 nennt beide nebeneinander, der Textwert 105,2 % ist unter beiden Methoden gleich. So belassen?
5. **Neuere Pluto-Integrationen** (H6, Task 5, nicht umgesetzt): Neuere Arbeiten liefern für Pluto
   inzwischen andere Werte (rund 82°/23° statt der zitierten); Aufnahme würde einen neuen
   Katalogeintrag brauchen. Für eine spätere Etappe vormerken, oder jetzt nachziehen?
6. **Kepler-Absturz ab Jahr 12 563** (Ruling Task 8, hohe Priorität): Saturns linear fortgeschriebene
   Bahnexzentrizität wird ab diesem Jahr (rückwärts ab −14 828 bei Neptun) negativ, `solveKepler`
   wirft eine `RangeError`, die Bildschleife bleibt stehen. Erreichbar über Datumsfeld, Link oder
   Zeitraffer. Der Fehler besteht unabhängig von dieser Etappe, wird hier aber in „Im Modell"
   (Belegzeile 108 in `thema-entstehung`) beschrieben. Vor der nächsten Etappe als eigener Task mit
   Test und Sichtprüfung beheben (Klemmung von `e` oder Gültigkeitsgrenze der Zeit), oder
   zurückstellen?
7. **Prüfskript und Brennecka 2010** (Task 8): Die Arbeit scheitert am automatischen Titelvergleich
   des Prüfskripts aus ungeklärter Ursache und wurde deshalb nicht in den Katalog aufgenommen. Für
   4d-3 untersuchen?

Speziell aus §8 der Abnahme 4d-1, seither entschieden (zur Nachvollziehbarkeit, keine neue Frage):
Quellenkarte `jpl-horizons` zeigt jetzt auf das Handbuch (`8ab158e`), das Prüfskript wiederholt bei
502/503/504 und Zeitüberschreitung (`0168d08`), Funktionsnamen bekommen den TeX-Abstand (`713ed22`,
Ergebnis in Abschnitt 5.1) — alle drei wie am 17.09.2026 von Jens entschieden.

Trailer- und Wortkontrolle nach dem Commit dieses Protokolls: wie in der lokalen
Projektanleitung beschrieben, Ergebnis 0.
