# Abnahme Phase 4d Etappe 3 „Sonne, Erde–Mond"

## 1. Umfang

Branch `hochschule-3` (von master `04fe610`, 19.09.2026). Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-19-phase4d-hochschule-etappe3.md` (8 Tasks, 14
Plan-Rulings). Ledger `.superpowers/sdd/2026-09-19-phase4d-hochschule-etappe3/progress.md`
(git-ignoriert).

25 Commits über `04fe610` bis `bcf095d` (`git rev-list --count 04fe610..bcf095d`);
mit diesem Protokoll-Commit 26 (`git rev-list --count 04fe610..HEAD` zählt auf dem
fertigen Branch mit). In Reihenfolge:

| Kurzhash | Titel |
|---|---|
| f40558d | Prüfskript: nach arXiv-Abrufen drei Sekunden Pause |
| 80840a8 | Hochschultext Sonne mit Belegliste |
| 0a0e413 | Hochschultext Sonne: Nacharbeit nach der Fachprüfung |
| e81aea9 | Hochschultext Sonne: Nacharbeit nach der Nachprüfung |
| 2b921c4 | Belegliste objekt-sun: Fachprüfung abgeschlossen |
| 53808b5 | Hochschultext Mond mit Belegliste |
| c3b82e1 | Hochschultext Mond: Nacharbeit nach der Fachprüfung |
| d7d0b81 | Hochschultext Mond: Nacharbeit nach der Nachprüfung |
| ab00877 | Belegliste objekt-moon: Fachprüfung abgeschlossen |
| 1c6354c | Hochschultext Gebundene Rotation mit Belegliste |
| 801ee8f | Hochschultext Gebundene Rotation: Nacharbeit nach der Fachprüfung |
| ebef04b | Hochschultext Gebundene Rotation: Nacharbeit nach der Nachprüfung |
| d8aa43e | Belegliste thema-gebundene-rotation: Fachprüfung abgeschlossen |
| b9e6bb8 | Hochschultext Finsternisse mit Belegliste |
| 4011f19 | Hochschultext Finsternisse: Nacharbeit nach der Fachprüfung |
| cb7dff3 | Hochschultext Finsternisse: Nacharbeit nach der Nachprüfung |
| 688bb17 | Belegliste thema-finsternis: Fachprüfung abgeschlossen |
| 4c38667 | Hochschultext Szene Tanz des Mondes mit Belegliste |
| 1605306 | Hochschultext Szene Tanz des Mondes: Nacharbeit nach der Fachprüfung |
| 1f56593 | Hochschultext Szene Tanz des Mondes: Nacharbeit nach der Nachprüfung |
| dcc460d | Belegliste szene-mondtanz: Fachprüfung abgeschlossen |
| 9347a90 | Hochschultext Szene Sonnenaufgang über dem Erdrand mit Belegliste |
| c7fe725 | Hochschultext Szene Sonnenaufgang über dem Erdrand: Nacharbeit nach der Fachprüfung |
| e23fc8f | Hochschultext Szene Sonnenaufgang über dem Erdrand: Nacharbeit nach der Nachprüfung |
| bcf095d | Hochschultext Szene Sonnenaufgang über dem Erdrand: Nacharbeit nach der dritten Nachprüfung |

Sechs neue Hochschultexte (de/en): `objekt-sun`, `objekt-moon`,
`thema-gebundene-rotation`, `thema-finsternis`, `szene-mondtanz`,
`szene-erdaufgang`. Task 1 (Prüfskript-Pause) und Task 8 (dieses Protokoll,
README) sind reine Werkzeug-/Dokumentationstasks.

## 2. Lint, Tests, Build

Lauf auf `bcf095d` (Arbeitsbaum sauber, `git status --short` leer vor dem
Protokoll):

- `npm run lint` → kein Befund.
- `npm test` → **3968 Tests, 101 Testdateien, alle grün** (Soll 3968 laut Plan
  erreicht).
- `npm run build` → `✓ built in 701ms`; nur die bekannte Warnung zu großen
  Chunks. Hauptchunk `index-8_zsStKx.js` **1 326,01 kB**.

### Testzahlen (Quelle: Ledger-Zeilen „Umsetzer DONE"/„DONE_WITH_CONCERNS" je Task, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (master `04fe610`) | — | 3839 |
| 1 | Prüfskript-Pause | +1 | 3840 |
| 2 | Sonne | +22 | 3862 |
| 3 | Mond | +22 | 3884 |
| 4 | Gebundene Rotation | +20 | 3904 |
| 5 | Finsternisse | +20 | 3924 |
| 6 | Szene Tanz des Mondes | +22 | 3946 |
| 7 | Szene Sonnenaufgang über dem Erdrand | +22 | 3968 |

Summe 3839+1+22+22+20+20+22+22 = 3968, deckt sich mit dem tatsächlichen
`npm test`-Lauf.

### Hauptchunk

Der Brief nennt als Ausgangsstand „1 299,03 kB (nach Flug Etappe 2)". Der
tatsächliche Ausgangsstand dieser Etappe (Build auf master `04fe610`, vor
jeder Änderung dieser Etappe, gemessen in Task 1 auf `f40558d`, das nur
Node-Skripte ändert) ist **1 299,13 kB** — beide Zahlen liegen 0,10 kB
auseinander, weil zwischen der Flug-Etappe-2-Abnahme und `04fe610` weitere
Commits auf master liefen (Zeitbereich, Flug §7, Nachträge), die den Chunk
minimal verschoben haben.

Endstand dieser Etappe: **1 326,01 kB**. Zuwachs gegenüber dem tatsächlichen
Ausgangsstand (1 299,13 kB): **+26,88 kB**. Gegenüber dem Brief-Ausgangsstand
(1 299,03 kB): **+26,98 kB**. Beide Werte bleiben unter der 50-kB-Schwelle aus
Plan-Ruling 13 — keine Eskalation der Frage „fauler Import des Katalogs" an
Jens nötig.

Zwischenstände (aus den Task-Berichten, `npm run build` je Commit):
Task 1 1 299,13 kB → Task 2 1 306,97 kB → Task 3 1 314,31 kB → Task 4
1 319,84 kB → Task 5 1 324,81 kB → Task 6 1 325,02 kB → Task 7 1 326,01 kB
(diese Abnahme, unverändert seit Task 7).

### Katalogeinträge

Ausgangsstand 199 (Plan). Endstand **303** (`grep -c "^    id: '"
src/data/literatur.ts`, selbst nachgezählt). Zuwachs je Task:

| Task | neue Einträge | Katalog danach |
|---|---|---|
| 2 (Sonne) | 30 initial + 1 in Nacharbeit (`gonzalez-2025`) = 31 | 230 |
| 3 (Mond) | 30 initial + 2 in Nacharbeit (`chapront-touze-1988`, `wang-2024b`) = 32 | 262 |
| 4 (Gebundene Rotation) | 21 initial + 2 in Nacharbeit (`leconte-2015`, `baland-2011`) = 23 | 285 |
| 5 (Finsternisse) | 15, keine weiteren in der Nacharbeit | 300 |
| 6 (Szene Tanz des Mondes) | 0 (Ruling: vier bereits vorhandene Kennungen genügen) | 300 |
| 7 (Szene Sonnenaufgang) | 3 (`bennett-1982`, `hulburt-1953`, `usno-2026`) | 303 |

199 + 31 + 32 + 23 + 15 + 0 + 3 = 303, deckt sich mit dem gezählten Katalogstand.

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog), Start-/Endzeitpunkt per
Unix-Zeitstempel vor und nach dem Kommando gemessen:

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 303 von 303 Einträgen
agnew-2024                   crossref  ok       Erstautor, Jahr und Titel stimmen
alexander-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
altwegg-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
amelin-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
andrews-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
andrews-2020                  arxiv     ok       Erstautor und Titel stimmen
appel-2022                    crossref  ok       Erstautor, Jahr und Titel stimmen
appel-2022                    arxiv     ok       Erstautor und Titel stimmen
archinal-2011                 crossref  ok       Erstautor, Jahr und Titel stimmen
archinal-2018                 crossref  ok       Erstautor, Jahr und Titel stimmen
archinal-2019                 crossref  ok       Erstautor, Jahr und Titel stimmen
asplund-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
asplund-2021                  arxiv     ok       Erstautor und Titel stimmen
avdellidou-2024                crossref  ok       Erstautor, Jahr und Titel stimmen
baland-2011                   crossref  ok       Erstautor, Jahr und Titel stimmen
barboni-2017                  crossref  ok       Erstautor, Jahr und Titel stimmen
basu-2016                     crossref  ok       Erstautor, Jahr und Titel stimmen
basu-2016                     arxiv     ok       Erstautor und Titel stimmen
bau-2021                      crossref  ok       Erstautor, Jahr und Titel stimmen
bau-2021                      arxiv     ok       Erstautor und Titel stimmen
beggan-2026                   crossref  ok       Erstautor, Jahr und Titel stimmen
benna-2015                    crossref  ok       Erstautor, Jahr und Titel stimmen
bennett-1982                  crossref  ok       Erstautor, Jahr und Titel stimmen
bi-2025                       crossref  ok       Erstautor, Jahr und Titel stimmen
biggin-2015                   crossref  ok       Erstautor, Jahr und Titel stimmen
bipm-2026                     url       ok       HTTP 200
bizouard-2026                  url       ok       HTTP 200
black-2015                    crossref  ok       Erstautor, Jahr und Titel stimmen
blackburn-2011                crossref  ok       Erstautor, Jahr und Titel stimmen
bobis-2008                    url       ok       HTTP 200
boehnke-2016                  crossref  ok       Erstautor, Jahr und Titel stimmen
bono-2019                     crossref  ok       Erstautor, Jahr und Titel stimmen
borexino-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
borg-2011                     crossref  ok       Erstautor, Jahr und Titel stimmen
borrero-2011                  crossref  ok       Erstautor, Jahr und Titel stimmen
borrero-2011                  arxiv     ok       Erstautor und Titel stimmen
bottke-2012                   crossref  ok       Erstautor, Jahr und Titel stimmen
bouvier-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
brasser-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
briaud-2023                   crossref  ok       Erstautor, Jahr und Titel stimmen
broucke-1972                  crossref  ok       Erstautor, Jahr und Titel stimmen
brozovic-2025                 crossref  ok       Erstautor, Jahr und Titel stimmen
buldgen-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
buldgen-2023                  arxiv     ok       Erstautor und Titel stimmen
buldgen-2025                  crossref  ok       Erstautor, Jahr und Titel stimmen
buldgen-2025                  arxiv     ok       Erstautor und Titel stimmen
buratti-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
burnett-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
burnett-2021                  arxiv     ok       Erstautor und Titel stimmen
cai-2025                      crossref  ok       Erstautor, Jahr und Titel stimmen
cano-2020                     crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2001                    crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2012                    crossref  ok       Erstautor, Jahr und Titel stimmen
carry-2024                    crossref  ok       Erstautor, Jahr und Titel stimmen
carry-2024                    arxiv     ok       Erstautor und Titel stimmen
cgpm-2022                     crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
chapront-touze-1988            url       ok       HTTP 200
charles-1997                  crossref  ok       Erstautor, Jahr und Titel stimmen
charlot-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
charlot-2020                  arxiv     ok       Erstautor und Titel stimmen
chavez-2023                   crossref  ok       Erstautor, Jahr und Titel stimmen
chavez-2023                   arxiv     ok       Erstautor und Titel stimmen
chen-2015                     crossref  ok       Erstautor, Jahr und Titel stimmen
cheng-2014                    crossref  ok       Erstautor, Jahr und Titel stimmen
cheng-2014                    arxiv     ok       Erstautor und Titel stimmen
chiang-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
chiang-2010                   arxiv     ok       Erstautor und Titel stimmen
christensen-dalsgaard-2021     crossref  ok       Erstautor, Jahr und Titel stimmen
christensen-dalsgaard-2021     arxiv     ok       Erstautor und Titel stimmen
clement-2018                  crossref  ok       Erstautor, Jahr und Titel stimmen
clement-2018                  arxiv     ok       Erstautor und Titel stimmen
cohen-1965                    crossref  ok       Erstautor, Jahr und Titel stimmen
colaprete-2010                 crossref  ok       Erstautor, Jahr und Titel stimmen
colombo-1966                  crossref  ok       Erstautor, Jahr und Titel stimmen
connelly-2012                 crossref  ok       Erstautor, Jahr und Titel stimmen
correia-2001                  crossref  ok       Erstautor, Jahr und Titel stimmen
correia-2004                  crossref  ok       Erstautor, Jahr und Titel stimmen
correia-2009                  crossref  ok       Erstautor, Jahr und Titel stimmen
correia-2009                  arxiv     ok       Erstautor und Titel stimmen
cranmer-2019                  crossref  ok       Erstautor, Jahr und Titel stimmen
cranmer-2019                  arxiv     ok       Erstautor und Titel stimmen
crompvoets-2022                crossref  ok       Erstautor, Jahr und Titel stimmen
crompvoets-2022                arxiv     ok       Erstautor und Titel stimmen
cuk-2012                      crossref  ok       Erstautor, Jahr und Titel stimmen
cuk-2024                      crossref  ok       Erstautor, Jahr und Titel stimmen
dauphas-2011                  crossref  ok       Erstautor, Jahr und Titel stimmen
downey-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
durante-2019                  crossref  ok       Erstautor, Jahr und Titel stimmen
durante-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
durante-2026                  crossref  ok       Erstautor, Jahr und Titel stimmen
duriez-1992                   crossref  ok       Erstautor, Jahr und Titel stimmen
dziewonski-1981                crossref  ok       Erstautor, Jahr und Titel stimmen
efroimsky-2007                 crossref  ok       Erstautor, Jahr und Titel stimmen
efroimsky-2007                 arxiv     ok       Erstautor und Titel stimmen
ehrenreich-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
ehrenreich-2012                arxiv     ok       Erstautor und Titel stimmen
elipe-2017                    crossref  ok       Erstautor, Jahr und Titel stimmen
emelyanov-2022                 crossref  ok       Erstautor, Jahr und Titel stimmen
espenak-2006                  url       ok       HTTP 200
espenak-2009                  url       ok       HTTP 200
feulner-2012                  crossref  ok       Erstautor, Jahr und Titel stimmen
feulner-2012                  arxiv     ok       Erstautor und Titel stimmen
finley-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
finley-2025                   arxiv     ok       Erstautor und Titel stimmen
fischer-2024                  crossref  ok       Erstautor, Jahr und Titel stimmen
folkner-1997                  crossref  ok       Erstautor, Jahr und Titel stimmen
fuller-2016                   crossref  ok       Erstautor, Jahr und Titel stimmen
fuller-2016                   arxiv     ok       Erstautor und Titel stimmen
gaia-2022                     crossref  ok       Erstautor, Jahr und Titel stimmen
gaia-2022                     arxiv     ok       Erstautor und Titel stimmen
garcia-2011                   crossref  ok       Erstautor, Jahr und Titel stimmen
garrick-bethell-2014           crossref  ok       Erstautor, Jahr und Titel stimmen
geissler-1998                 crossref  ok       Erstautor, Jahr und Titel stimmen
genova-2018                   crossref  ok       Erstautor, Jahr und Titel stimmen
genova-2019                   crossref  ok       Erstautor, Jahr und Titel stimmen
gilmore-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
gilmore-2022                  arxiv     ok       Erstautor und Titel stimmen
gladman-1996                  crossref  ok       Erstautor, Jahr und Titel stimmen
gladman-1997                  crossref  ok       Erstautor, Jahr und Titel stimmen
goessling-2025                 crossref  ok       Erstautor, Jahr und Titel stimmen
goldberg-2024                  crossref  ok       Erstautor, Jahr und Titel stimmen
goldberg-2024                  arxiv     ok       Erstautor und Titel stimmen
goldreich-1966                 crossref  ok       Erstautor, Jahr und Titel stimmen
gomes-2005                    crossref  ok       Erstautor, Jahr und Titel stimmen
gomez-casajus-2022             crossref  ok       Erstautor, Jahr und Titel stimmen
gonzalez-2025                 crossref  ok       Erstautor, Jahr und Titel stimmen
gonzalez-2025                 arxiv     ok       Erstautor und Titel stimmen
goossens-2024                 crossref  ok       Erstautor, Jahr und Titel stimmen
goossens-2026                 crossref  ok       Erstautor, Jahr und Titel stimmen
guillet-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
gurnett-2013                  crossref  ok       Erstautor, Jahr und Titel stimmen
haberreiter-2008               crossref  ok       Erstautor, Jahr und Titel stimmen
haberreiter-2008               arxiv     ok       Erstautor und Titel stimmen
haisch-2001                   crossref  ok       Erstautor, Jahr und Titel stimmen
hanel-1981                    crossref  ok       Erstautor, Jahr und Titel stimmen
hapke-1993                    crossref  ok       Erstautor, Jahr und Titel stimmen
hapke-2012a                   crossref  ok       Erstautor, Jahr und Titel stimmen
hapke-2012b                   crossref  ok       Erstautor, Jahr und Titel stimmen
hartogh-2011                  crossref  ok       Erstautor, Jahr und Titel stimmen
hathaway-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
hathaway-2015                  arxiv     ok       Erstautor und Titel stimmen
haus-2016                     crossref  ok       Erstautor, Jahr und Titel stimmen
hemingway-2018                 crossref  ok       Erstautor, Jahr und Titel stimmen
herald-2014                   url       ok       HTTP 200
herwartz-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
hilton-2006                   crossref  ok       Erstautor, Jahr und Titel stimmen
hirose-2021                   crossref  ok       Erstautor, Jahr und Titel stimmen
howard-2023                   crossref  ok       Erstautor, Jahr und Titel stimmen
howe-2009                     crossref  ok       Erstautor, Jahr und Titel stimmen
howe-2009                     arxiv     ok       Erstautor und Titel stimmen
howett-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
hulburt-1953                  crossref  ok       Erstautor, Jahr und Titel stimmen
iess-2012                     crossref  ok       Erstautor, Jahr und Titel stimmen
iess-2018                     crossref  ok       Erstautor, Jahr und Titel stimmen
irwin-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
irwin-2025                    arxiv     ok       Erstautor und Titel stimmen
jacobsen-2008                  crossref  ok       Erstautor, Jahr und Titel stimmen
jacobson-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
johansen-2007                  crossref  ok       Erstautor, Jahr und Titel stimmen
johansen-2007                  arxiv     ok       Erstautor und Titel stimmen
johansen-2017                  crossref  ok       Erstautor, Jahr und Titel stimmen
jolliff-2000                   crossref  ok       Erstautor, Jahr und Titel stimmen
jones-2022                    crossref  ok       Erstautor, Jahr und Titel stimmen
jutzi-2011                    crossref  ok       Erstautor, Jahr und Titel stimmen
kasper-2021                   crossref  ok       Erstautor, Jahr und Titel stimmen
keane-2014                    crossref  ok       Erstautor, Jahr und Titel stimmen
keane-2014                    arxiv     ok       Erstautor und Titel stimmen
kennefick-2009                 crossref  ok       Erstautor, Jahr und Titel stimmen
khan-2023                     crossref  ok       Erstautor, Jahr und Titel stimmen
kleine-2009                   crossref  ok       Erstautor, Jahr und Titel stimmen
klimchuk-2006                  crossref  ok       Erstautor, Jahr und Titel stimmen
klimchuk-2006                  arxiv     ok       Erstautor und Titel stimmen
kloss-2026                    crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-1998                   crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-2010                   arxiv     ok       Erstautor und Titel stimmen
konopkova-2016                 crossref  ok       Erstautor, Jahr und Titel stimmen
konopliv-2013                  crossref  ok       Erstautor, Jahr und Titel stimmen
konopliv-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
kopp-2011                     crossref  ok       Erstautor, Jahr und Titel stimmen
krasna-2013                   crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2014                   crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2015                   crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2017                   crossref  ok       Erstautor, Jahr und Titel stimmen
kuhn-2012                     crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2009                   crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2020                   crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2020                   arxiv     ok       Erstautor und Titel stimmen
lainey-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
lainey-2025                   arxiv     ok       Erstautor und Titel stimmen
lambrechts-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
lambrechts-2012                arxiv     ok       Erstautor und Titel stimmen
lambrechts-2014                crossref  ok       Erstautor, Jahr und Titel stimmen
lambrechts-2014                arxiv     ok       Erstautor und Titel stimmen
lari-2024                     crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-1989                   crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-1993                   crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-2004                   crossref  ok       Erstautor, Jahr und Titel stimmen
le-maistre-2023                crossref  ok       Erstautor, Jahr und Titel stimmen
leconte-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
leconte-2015                  arxiv     ok       Erstautor und Titel stimmen
lee-2002                      crossref  ok       Erstautor, Jahr und Titel stimmen
levine-2024                   crossref  ok       Erstautor, Jahr und Titel stimmen
levine-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
li-2014                       crossref  ok       Erstautor, Jahr und Titel stimmen
li-2014                       arxiv     ok       Erstautor und Titel stimmen
li-2018                       crossref  ok       Erstautor, Jahr und Titel stimmen
li-2018a                      crossref  ok       Erstautor, Jahr und Titel stimmen
li-2021                       crossref  ok       Erstautor, Jahr und Titel stimmen
lichtenberg-2021               crossref  ok       Erstautor, Jahr und Titel stimmen
lichtenberg-2021               arxiv     ok       Erstautor und Titel stimmen
lieske-1998                   crossref  ok       Erstautor, Jahr und Titel stimmen
liu-2022                      crossref  ok       Erstautor, Jahr und Titel stimmen
liu-2022                      arxiv     ok       Erstautor und Titel stimmen
lock-2018                     crossref  ok       Erstautor, Jahr und Titel stimmen
longair-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
luan-2017                     crossref  ok       Erstautor, Jahr und Titel stimmen
lunz-2024                     crossref  ok       Erstautor, Jahr und Titel stimmen
magg-2022                     crossref  ok       Erstautor, Jahr und Titel stimmen
magg-2022                     arxiv     ok       Erstautor und Titel stimmen
magnanini-2026                 crossref  ok       Erstautor, Jahr und Titel stimmen
mahlke-2021                   crossref  ok       Erstautor, Jahr und Titel stimmen
mahlke-2021                   arxiv     ok       Erstautor und Titel stimmen
malhotra-1993                  crossref  ok       Erstautor, Jahr und Titel stimmen
malhotra-1995                  crossref  ok       Erstautor, Jahr und Titel stimmen
malhotra-1995                  arxiv     ok       Erstautor und Titel stimmen
mallama-2017                  crossref  ok       Erstautor, Jahr und Titel stimmen
mallama-2017                  arxiv     ok       Erstautor und Titel stimmen
mallama-2018                  crossref  ok       Erstautor, Jahr und Titel stimmen
mallama-2018                  arxiv     ok       Erstautor und Titel stimmen
mallama-2021                  arxiv     ok       Erstautor und Titel stimmen
mankovich-2021                 crossref  ok       Erstautor, Jahr und Titel stimmen
mankovich-2021                 arxiv     ok       Erstautor und Titel stimmen
margot-2007                   crossref  ok       Erstautor, Jahr und Titel stimmen
margot-2012                   crossref  ok       Erstautor, Jahr und Titel stimmen
margot-2021                   crossref  ok       Erstautor, Jahr und Titel stimmen
margot-2021                   arxiv     ok       Erstautor und Titel stimmen
maurice-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
mcintosh-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
mcintosh-2020                  arxiv     ok       Erstautor und Titel stimmen
mckinnon-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
meftah-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
melati-2016                   crossref  ok       Erstautor, Jahr und Titel stimmen
melnikov-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
melnikov-2010                  arxiv     ok       Erstautor und Titel stimmen
melosh-2013                   crossref  ok       Erstautor, Jahr und Titel stimmen
mighani-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
miles-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
militzer-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
militzer-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
militzer-2023                  arxiv     ok       Erstautor und Titel stimmen
mohr-2025                     crossref  ok       Erstautor, Jahr und Titel stimmen
mohr-2025                     arxiv     ok       Erstautor und Titel stimmen
morrison-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
mueller-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
muinonen-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
muinonen-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
murphy-2013                   crossref  ok       Erstautor, Jahr und Titel stimmen
murphy-2013                   arxiv     ok       Erstautor und Titel stimmen
murray-2000                   crossref  ok       Erstautor, Jahr und Titel stimmen
nandy-2021                    crossref  ok       Erstautor, Jahr und Titel stimmen
nandy-2021                    arxiv     ok       Erstautor und Titel stimmen
nesvorny-2012                  crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2012                  arxiv     ok       Erstautor und Titel stimmen
nesvorny-2016                  crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2018                  crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2018                  arxiv     ok       Erstautor und Titel stimmen
nesvorny-2018a                 crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2018a                 arxiv     ok       Erstautor und Titel stimmen
nesvorny-2019                  crossref  ok       Erstautor, Jahr und Titel stimmen
nesvorny-2019                  arxiv     ok       Erstautor und Titel stimmen
nettelmann-2025                crossref  ok       Erstautor, Jahr und Titel stimmen
nimmo-2024                    crossref  ok       Erstautor, Jahr und Titel stimmen
nimmo-2026                    crossref  ok       Erstautor, Jahr und Titel stimmen
nordlund-2009                  crossref  ok       Erstautor, Jahr und Titel stimmen
noyelles-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
noyelles-2014                  arxiv     ok       Erstautor und Titel stimmen
ohta-2016                     crossref  ok       Erstautor, Jahr und Titel stimmen
paita-2018                    crossref  ok       Erstautor, Jahr und Titel stimmen
palin-2020                    crossref  ok       Erstautor, Jahr und Titel stimmen
park-2021                     crossref  ok       Erstautor, Jahr und Titel stimmen
park-2025                     crossref  ok       Erstautor, Jahr und Titel stimmen
pasachoff-2009                 crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1969                    crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1976                    crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1979                    crossref  ok       Erstautor, Jahr und Titel stimmen
peale-2002                    crossref  ok       Erstautor, Jahr und Titel stimmen
perryman-2011                  crossref  ok       Erstautor, Jahr und Titel stimmen
perryman-2011                  arxiv     ok       Erstautor und Titel stimmen
petit-2010                    url       ok       HTTP 200
petit-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
petricca-2025                  crossref  ok       Erstautor, Jahr und Titel stimmen
pettengill-1965                crossref  ok       Erstautor, Jahr und Titel stimmen
piani-2020                    crossref  ok       Erstautor, Jahr und Titel stimmen
pollack-1996                  crossref  ok       Erstautor, Jahr und Titel stimmen
porco-2007                    crossref  ok       Erstautor, Jahr und Titel stimmen
proudfoot-2026                 arxiv     ok       Erstautor und Titel stimmen
prsa-2016                     crossref  ok       Erstautor, Jahr und Titel stimmen
prsa-2016                     arxiv     ok       Erstautor und Titel stimmen
ray-1996                      crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2017                  crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2017                  arxiv     ok       Erstautor und Titel stimmen
raymond-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2022                  arxiv     ok       Erstautor und Titel stimmen
ries-1992                     crossref  ok       Erstautor, Jahr und Titel stimmen
rufu-2017                     crossref  ok       Erstautor, Jahr und Titel stimmen
samuel-2023                   crossref  ok       Erstautor, Jahr und Titel stimmen
saquet-2018                   crossref  ok       Erstautor, Jahr und Titel stimmen
schneider-2005                 crossref  ok       Erstautor, Jahr und Titel stimmen
schneider-2005                 arxiv     ok       Erstautor und Titel stimmen
shevchenko-2019                crossref  ok       Erstautor, Jahr und Titel stimmen
shevchenko-2019                arxiv     ok       Erstautor und Titel stimmen
showalter-2015                 crossref  ok       Erstautor, Jahr und Titel stimmen
silso-2026                    url       ok       HTTP 200
soffel-2003                   crossref  ok       Erstautor, Jahr und Titel stimmen
soffel-2003                   arxiv     ok       Erstautor und Titel stimmen
staehler-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
stark-2015                    crossref  ok       Erstautor, Jahr und Titel stimmen
stephens-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
stephenson-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2005                    crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2018                    crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2018a                   crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2018a                   arxiv     ok       Erstautor und Titel stimmen
stone-2013                    crossref  ok       Erstautor, Jahr und Titel stimmen
stone-2019                    crossref  ok       Erstautor, Jahr und Titel stimmen
su-2025                       crossref  ok       Erstautor, Jahr und Titel stimmen
tajeddine-2014                 crossref  ok       Erstautor, Jahr und Titel stimmen
tamayo-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
tamayo-2025                   arxiv     ok       Erstautor und Titel stimmen
tarduno-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
thomas-2007                   crossref  ok       Erstautor, Jahr und Titel stimmen
thomas-2016                   crossref  ok       Erstautor, Jahr und Titel stimmen
thomas-2016                   arxiv     ok       Erstautor und Titel stimmen
thor-2021                     crossref  ok       Erstautor, Jahr und Titel stimmen
touboul-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                  crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                  arxiv     ok       Erstautor und Titel stimmen
tsiganis-2005                  crossref  ok       Erstautor, Jahr und Titel stimmen
usno-2026                     url       ok       HTTP 200
valley-2014                   crossref  ok       Erstautor, Jahr und Titel stimmen
velikodsky-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
verbiscer-2005                 crossref  ok       Erstautor, Jahr und Titel stimmen
verbiscer-2007                 crossref  ok       Erstautor, Jahr und Titel stimmen
viswanathan-2019               crossref  ok       Erstautor, Jahr und Titel stimmen
viswanathan-2019               arxiv     ok       Erstautor und Titel stimmen
vockenhuber-2004               crossref  ok       Erstautor, Jahr und Titel stimmen
wahl-2017                     crossref  ok       Erstautor, Jahr und Titel stimmen
wahl-2017                     arxiv     ok       Erstautor und Titel stimmen
walsh-2011                    crossref  ok       Erstautor, Jahr und Titel stimmen
walsh-2011                    arxiv     ok       Erstautor und Titel stimmen
walterova-2023                 crossref  ok       Erstautor, Jahr und Titel stimmen
walterova-2023                 arxiv     ok       Erstautor und Titel stimmen
wang-2017                     crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2024                     crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2024a                    crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2024b                    crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2025                     crossref  ok       Erstautor, Jahr und Titel stimmen
ward-1975                     crossref  ok       Erstautor, Jahr und Titel stimmen
warren-2011                   crossref  ok       Erstautor, Jahr und Titel stimmen
weber-2011                    crossref  ok       Erstautor, Jahr und Titel stimmen
weiss-2014                    crossref  ok       Erstautor, Jahr und Titel stimmen
wieczorek-2013                 crossref  ok       Erstautor, Jahr und Titel stimmen
wieser-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
williams-1971                  crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2016                  crossref  ok       Erstautor, Jahr und Titel stimmen
wisdom-1983                   crossref  ok       Erstautor, Jahr und Titel stimmen
wisdom-1984                   crossref  ok       Erstautor, Jahr und Titel stimmen
yang-2023                     crossref  ok       Erstautor, Jahr und Titel stimmen
yao-2025                      crossref  ok       Erstautor, Jahr und Titel stimmen
yoder-1981                    crossref  ok       Erstautor, Jahr und Titel stimmen
youdin-2005                   crossref  ok       Erstautor, Jahr und Titel stimmen
youdin-2005                   arxiv     ok       Erstautor und Titel stimmen
young-2016                    crossref  ok       Erstautor, Jahr und Titel stimmen
yue-2026                      crossref  ok       Erstautor, Jahr und Titel stimmen
zhang-2012                    crossref  ok       Erstautor, Jahr und Titel stimmen
zhang-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
zhang-2025a                   crossref  ok       Erstautor, Jahr und Titel stimmen
zuber-2013                    crossref  ok       Erstautor, Jahr und Titel stimmen

380 ok, 1 Warnungen, 0 Fehler
```

**Laufzeit:** 480 Sekunden (8:00 min; Zeitstempel vor dem Start 1789897131,
nach Programmende 1789897611, Unix-Sekunden). Keine Zeile mit `429`
(`grep -c 429` auf der vollständigen Ausgabe: 0 Treffer) — die arXiv-Pause aus
Task 1 (drei Sekunden statt 200 ms je arXiv-Abruf) wirkt: **80** Katalogeinträge
tragen ein `arxiv`-Feld. `grep -c "arxiv:" src/data/literatur.ts` liefert 81;
der zusätzliche Treffer ist die Parametertypangabe `(arxiv: string)` in der
Funktion `arxivAdresse` (Zeile 2848), kein Katalogeintrag — ohne diese Zeile
selbst nachgezählt: 80. Das macht allein **240 s** reine Pausenzeit für
arXiv, dazu 200 ms je der übrigen
Crossref-/Adress-Abrufe; die gemessenen 480 s liegen über dieser Summe, wie in
Task 1 erwartet (Netzlatenz kommt hinzu).

**Warnung begründet:** `cgpm-2022` (crossref, „Crossref führt keine Autoren,
Erstautor ungeprüft") — der Katalogeintrag führt die 28. Generalkonferenz für
Maß und Gewicht als Körperschaft, nicht als Person, wie `cgpm-2022` schon in
Etappe 2 (Muster-Ruling „Körperschaften als Autoren"); Crossref listet für
Konferenzberichte keine individuellen Autoren, das Prüfskript kann den
Erstautor deshalb nicht gegenprüfen. Kein neuer Befund, bekanntes und
akzeptiertes Verhalten des Prüfskripts.

## 4. Fachprüfung

Zahlen aus `task-N-report.md` (Wörter, Belegzeilen, Katalog, Runden) und den
`task-N-fachpruefung-rN.md`-Dateien (Fehler/Hinweise), gegengerechnet gegen
die aktuellen Dateien im Arbeitsbaum (`wc -w`, Zeilenzählung der
Beleglisten-Tabellen, `literatur:`-Verweise in den Texten).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Runden | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|---|
| `objekt-sun` (Sonne) | 3967 / 4253 | 149 | 37 | 31 (199→230) | 2 | 1 / 1 | Wortzahl über Richtwert 3500 (1) |
| `objekt-moon` (Mond) | 4312 / 4765 | 139 | 55 | 32 (230→262) | 2 | 1 / 1 | Wortzahl über Richtwert 3500; Stilhinweis N5 „also dagegen"; Stilhinweis N6 Tausendergruppierung in einer Formel (3) |
| `thema-gebundene-rotation` | 4767 / 5286 | 111 | 33 | 23 (262→285) | 2 | 2 / 2 | Wortzahl über Richtwert 4000 (1; per Ruling bewusst belassen, Bestätigung an Jens offen) |
| `thema-finsternis` | 3408 / 3807 | 102 | 19 | 15 (285→300) | 2 | 0 / 0 | keine (Wortzahl im Richtwert 1500–4000) |
| `szene-mondtanz` | 1071 / 1230 | 53 | 4 | 0 (300→300) | 2 | 7 / 7 | Wortzahl über Richtwert 900 (1) |
| `szene-erdaufgang` | 1143 / 1355 | 26 | 4 | 3 (300→303) | 3 | R1: 8/8 + 14 Hinweise; R2: 3/3 (N1–N3) + 7 Hinweise (N4–N10); R3: 10/10 Befunde | drei geparkte Punkte nach Runde 3 (siehe §7/§8): Wortzahl, gemischtes 14-%-Kriterium, Ruling „Durchschnittswert" |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und
Trennzeile), gezählt mit `grep -cE "^\| [0-9]+[a-z]?\s*\|"` je Datei unter
`docs/belege/hochschule/`. Zitate sind die eindeutigen `literatur:`-Kennungen
je Text (`grep -oE "literatur:[a-zA-Z0-9-]+" … | sort -u | wc -l`), deckungsgleich
mit den im Browser gemessenen Literaturkarten (§5.1). Wortzahlen `wc -w` auf
den aktuellen Dateien in `src/data/texte/<sprache>/hochschule/`.

Task 6 (`szene-mondtanz`) und Task 7 (`szene-erdaufgang`) sind Szenen ohne
Literaturkatalog-Wachstum bzw. mit geringem Wachstum, weil sie überwiegend auf
Modellzahlen der bereits fachgeprüften Körpertexte `objekt-moon`/`objekt-earth`
zurückgreifen (Ruling 8 des Plans).

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}'
http://localhost:5173/Orrery/` → 200), kein zweiter gestartet.
`window.store.setState({ quality: { tier: 'high' } })` direkt nach jedem
`browser_navigate` gesetzt.

### 5.1 Rundgang

Alle zwölf Kombinationen (sechs Kennungen × de/en) angefahren wie im Brief
vorgegeben (Körper über `setInfo({thema:null})` + `setCamera`, Themen über
`setInfo({thema:…})`, Szenen über `setCinema`/`setCamera({mode:'cinema'})`,
danach `setCinema({running:false})` und `setUi({hidden:false})`). Auf den
Kopfwechsel *und* auf die vollständige Literaturliste des Zieltexts gepollt
(nicht nur auf den Kopf — siehe Befund unten), Hinweiszeilen erst danach
ausgewertet.

**Kernkriterien, alle zwölf Kombinationen:** `formelfehler` **0**, keine
Hinweiszeile (insbesondere keine `info.hochschuleFolgt`/„Der Hochschultext
folgt …"), `zitateGleichKarten` **true**.

| Kombination | Kopf de | Kopf en | Formeln | Tabellen | Verweise gesamt | davon literatur / quelle / thema / objekt / szene | Karten (=Zitate) |
|---|---|---|---|---|---|---|---|
| `objekt:sun` | Sonne | Sun | 128 | 1 | 92 | 76 / 5 / 7 / 2 / 2 | 37 |
| `objekt:moon` | Mond | Moon | 117 | 1 | 112 | 91 / 4 / 12 / 3 / 2 | 55 |
| `thema:gebundene-rotation` | Gebundene Rotation | Tidal locking | 93 | 2 | 98 | 83 / 1 / 4 / 8 / 2 | 33 |
| `thema:finsternis` | Finsternisse | Eclipses | 36 | 1 | 54 | 32 / 3 / 4 / 13 / 2 | 19 |
| `szene:mondtanz` (Nummer 2) | Szene: Der Tanz des Mondes | Scene: The dance of the Moon | 8 | 1 | 14 | 5 / 1 / 4 / 3 / 1 | 4 |
| `szene:erdaufgang` (Nummer 0) | Szene: Sonnenaufgang über dem Erdrand | Scene: Sunrise over the limb of the Earth | 6 | 0 | 13 | 4 / 2 / 4 / 3 / 0 | 4 |

Formeln, Tabellen und Verweiszahlen sind je Sprache identisch (gemessen in
beiden Läufen, de und en), wie bei zwillingsgleichen Fassungen zu erwarten.

**Klicktest je Verweisart:** Je Kombination wurde von jeder in der Tabelle
oben vorhandenen Verweisart *ein* Vorkommen einzeln per `element.click()`
ausgelöst und die Wirkung gegen die Tabelle im Brief geprüft (objekt →
`camera.targetId`; thema → `ui.info.thema`; szene → `cinema.nummer` +
`camera.mode`; quelle/literatur → `border-sky-300` auf der Karte, Klick und
Prüfung in einem `browser_evaluate`), danach der Ausgangszustand
wiederhergestellt. Eine erschöpfende Prüfung jedes einzelnen Vorkommens (bis
zu 91 `literatur:`-Vorkommen allein auf `objekt:moon`) war in vertretbarer
Zeit nicht sinnvoll messbar, da der Klickmechanismus niveau-unabhängig ist
(`src/ui/info/Markdown.tsx`, `verweisAusfuehren.ts`) und bereits durch die
automatisierten Tests sowie frühere Abnahmen (4c-3 Klickflächen, 4d-1, 4d-2)
in der Breite geprüft wurde; die Stichprobe deckt hier jede Verweisart
mindestens einmal je Kombination ab.

**Ergebnis: 60 von 60 getesteten Klicks trafen** (5 Verweisarten × 6
Kombinationen × 2 Sprachen; `szene:erdaufgang` hat keinen `szene:`-Verweis im
eigenen Text, dort blieben 4 Arten je Sprache = 4+4 statt 5+5, macht
tatsächlich **58 von 58 anwendbaren Tests**, korrigiert gegenüber der
schematischen 60er-Zahl). Alle Treffer: `objekt` → `camera.targetId` stimmt
nach der Kamerafahrt; `thema` → `ui.info.thema` stimmt; `szene` →
`cinema.nummer` traf den erwarteten Index (`erdaufgang=0`, `mondtanz=2`,
`ferne-sonne=3`, `systemblick=4`, `mondfinsternis=18`, je nach Text) samt
`camera.mode==='cinema'`; `quelle`/`literatur` → Karte trug `border-sky-300`.

**Messfalle gefunden und behoben:** Ein erster Messdurchlauf pollte nur auf
Stabilität des DOM-Inhalts (zwei gleiche Bilder in Folge), nicht auf
inhaltliche Übereinstimmung mit dem neuen Ziel. Da der Panelkopf sofort auf
den neuen Titel wechselt, der Textkörper aber bis zum Laden den *alten* Inhalt
zeigt („kein Flackern", `frisch`-Gate in `InfoPanel.tsx`), lieferte dieser
erste Durchlauf für `objekt:moon` fälschlich die 37 Literaturkennungen der
zuvor gezeigten Sonne statt der 55 des Mondes — ein Bild, das äußerlich
„stabil" aussah, aber der Stand *vor* dem Wechsel war. Behoben durch Polling
auf die exakte erwartete Zitatmenge (aus den Quelldateien vorab berechnet)
statt auf bloße Stabilität; alle in der Tabelle oben gezeigten Zahlen stammen
aus dem korrigierten Messweg. Dies ist die im Brief angemahnte Falle „Hinweise
erst nach dem Auflösen des faulen Imports werten" — hier zusätzlich relevant,
weil auch der *restliche* Textinhalt (nicht nur die Hinweiszeile) bis zum
Laden stehen bleibt.

### 5.2 Ersatz entfällt

Vier Messungen, Wartezeit bis zur exakten Ziel-Literaturliste (Polling per
`performance.now()`):

| Messung | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|
| `objekt-earth` → `objekt:moon` (de) | Mond | keine | 93 ms |
| `objekt-earth` → `objekt:moon` (en) | Moon | keine | 52 ms |
| `thema-gezeiten` → `thema:gebundene-rotation` (de) | Gebundene Rotation | keine | 111 ms |
| `thema-gezeiten` → `thema:gebundene-rotation` (en) | Tidal locking | keine | 52 ms |

Alle vier Messungen ohne Hinweiszeile: Der Ersatz-Hinweis „Der Hochschultext
folgt …" bzw. „The university-level text will follow …", der vor dieser
Etappe an diesen beiden Verweiszielen erschien, ist tatsächlich entfallen.
Anmerkung: Die Selektoren im Brief (`a[data-verweis="objekt:moon"]`,
`a[data-verweis="thema:gebundene-rotation"]`) passen nicht exakt — `objekt:`-
und `thema:`-Verweise rendert `Markdown.tsx` als `<button>`, nicht als `<a>`
(nur `quelle:`/`literatur:`/externe Ziele sind Anker); mit dem attributgleichen,
tag-offenen Selektor `[data-verweis="…"]` fanden sich beide Verweise sofort.

### 5.3 Konsole

`browser_console_messages` (Level „warning", seit dem letzten Navigate):
**0 Fehler, 0 Warnungen** (3 Meldungen insgesamt, alle unterhalb der
Warnstufe). Kein Auftreten von „Vollbild ohne Nutzergeste" trotz mehrerer
synthetischer `szene:`-Klicks — keine Gegenprobe mit `browser_click`
notwendig, da der Fall (0 Warnungen) gar nicht erst eintrat.

Playwright-Aufnahmen (`console-*.log`, `page-*.yml` unter `.playwright-mcp/`)
wurden nach der Messung gelöscht, keine Skripte im Projektstamm angelegt.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge. Rulings des
Controllers zuerst (eigener Abschnitt im Ledger), danach die der Umsetzer je
Task. Bei drei Blöcken (Task 4, Task 5) hatte das Ledger die aus den
Task-Berichten zitierten Ruling-Sätze mitten im Wort abgeschnitten (eigener
Befund, siehe §7); dort steht hier der vollständige Wortlaut aus
`task-4-report.md` §12 bzw. `task-5-report.md` §13, mit Fundstelle vermerkt.

**Controller-Rulings (vor Beginn der Tasks):**

- **Ruling A:** Text-Tasks laufen streng nacheinander (Umsetzer → Task-Review
  und Fachprüfung parallel → Nacharbeit → Nachprüfung → nächster Task), statt
  die Fachprüfung parallel zum nächsten Umsetzer laufen zu lassen, wie der
  Plan erlaubt — Task 4–6 übernehmen Modellzahlen aus Task 3, und ein linearer
  Ablauf hält Ledger und gezieltes `git add` einfach — kostet Wanduhrzeit
  (etwa ein Drittel länger).
- **Ruling B:** Für Text-Tasks gibt es neben der Fachprüfung (Inhalt, opus)
  einen Task-Review nach SDD (Form: Gliederung, Verweise, Katalogform,
  Belegliste, Randbedingungen; sonnet), beide parallel; die Nacharbeit bündelt
  die Befunde beider — die SDD-Regel „nie ohne Task-Review" und die
  Plan-Fachprüfung decken verschiedene Dinge ab — kostet je Task einen
  zusätzlichen mittleren Prüflauf.

**Task 2 (Sonne):**

- **Ruling:** Nacharbeit umfasst F1 und H1–H11 (alle sachlich: fehlende
  Belegzeile, einseitige Streitfrage, zu starke Aussagen, ungenauer Wortlaut)
  sowie die Begründung archinal-2011/2018; H12 nur Ledger — Plan-Regel 12
  zählt ungenaue/missverständliche Aussagen und fehlende Belegzeilen zu den
  sachlichen Hinweisen — wenn falsch: etwas mehr Nacharbeit als nötig.
- **Ruling** (Umsetzer, aus task-2-report.md §12): Schröder und Smith 2008
  nicht im Katalog, weil Crossref den Erstautor verstümmelt führt
  („SchrÃ¶der") und das Prüfskript nach seiner Normalisierung einen
  Erstautor-Fehler melden würde (abgeleitet, nicht ausgeführt); ihre Aussage
  steht mit Christensen-Dalsgaard 2021 als Beleg, der sie zusammenfasst.
- **Ruling:** borexino-2020 mit Autor „The Borexino Collaboration"
  (Crossref-Form, mit „The"), ohne arXiv-Feld; der Linktext lautet deshalb
  „The Borexino Collaboration 2020".
- **Ruling:** Maximum von Zyklus 25 aus der SILSO-Datendatei
  (Katalogeintrag silso-2026 nur mit `url`, Jahr = Abrufjahr), nicht aus der
  SIDC-Nachricht ohne Autor und Datum.
- **Ruling:** Gegenprüfung des Schwerpunkts mit JPL Horizons (DE441) nur in
  der Belegliste; im Text steht die Nachrechnung mit Orrerys Datensätzen, weil
  die Karte jpl-horizons nicht für `objekt:sun` gilt und neue Karten nicht zum
  Auftrag gehören.
- **Ruling:** Offene Fragen „Abplattung" und „schwache junge Sonne" in einem
  Punkt zusammengefasst (Kürzung).
- **Ruling:** Datenblock-Bezeichnung „Rotationsperiode"/„Rotation period"
  (ui/i18n) statt „Tageslänge"; Regler „Sonne dämpfen"/„Damp the Sun",
  Schalter „Leuchten"/„Glow", Stufen „Schaubild"/„Diagram" wie in der
  Oberfläche.

**Task 3 (Mond):**

- **Ruling:** Nacharbeit umfasst F1, H1–H9 (alle sachlich: Beleg,
  ungenaue/falsche Aussage, H9 faktisch falsch „erst 2037 wieder") und I1/I2
  des Task-Reviews; Umsetzer darf reine Stil-/Themenhinweise begründet stehen
  lassen — wenn falsch: etwas mehr Nacharbeit.
- **Ruling** (Umsetzer, aus task-3-report.md §13 und Nacharbeit): Amplituden
  von Evektion, Variation und jährlicher Gleichung aus einer eigenen
  Zerlegung DE441 minus Kepler-Ellipse (Beleg park-2021 für DE441, Perioden
  aus petit-2010 Gl. 5.43), im Text als eigene Zerlegung gekennzeichnet;
  Gutzwiller 1998 und ELP 2000-82 waren nicht lesbar.
- **Ruling:** Hydrostatische Beziehungen J₂ = (5/6) k_f q, C₂₂ = (1/4) k_f q
  als Herleitung (in der Belegliste ausgeschrieben) mit Verweis auf
  `thema-innerer-aufbau`; hemingway-2018 nicht zitiert, weil in diesem Task
  nicht zu öffnen.
- **Ruling:** Kennung zhang-2025a, weil zhang-2025 (Gaia-Rahmen, anderer
  Erstautor) schon besteht; Linktext „Zhang et al. 2025a". Ebenso li-2018a
  neben li-2018.
- **Ruling:** Jahr 2025 für zhang-2025a und cai-2025 (Band 643, Druck 2025;
  online 2024).
- **Ruling:** „±100 Jahre" im Text um die Epoche (1900, 2100), im Bericht
  zusätzlich um heute (1926, 2126).
- **Ruling:** Abweichung der Lichtrichtung in „Schaubild"/„Kompakt" als
  Modellgrenze in den Text aufgenommen (Code-Befund, §7).
- **Ruling:** Q = 37,5 ± 4 nach williams-2014 statt 38 ± 4 nach williams-2015
  (gleiche Arbeitsgruppe, im Text zitierte Arbeit).
- **Ruling:** Quellenkarten nasa-moon, jpl-satelliten, nasa-gebundene-rotation
  nicht zitiert; keine neue Karte.
- **Ruling:** Wortzahl über dem Richtwert belassen (siehe §4/§8).
- **Ruling:** ELP 2000-82B als Datensatz (CDS VI/79) mit Jahr 1988 nach der
  Katalogüberschrift „(Chapront-Touze+, 1988)" zitiert; die
  Hauptproblemreihen stammen aus der Arbeit von 1983, beide Arbeiten stehen im
  Feld `erschienen`.
- **Ruling:** N1–N4 in Nacharbeit Runde 2 (sachlich: Breitenanteil,
  Fachbegriff „Hauptproblem", Deutung als Tatsache, deutsches
  erschienen-Feld auf englischer Karte); N5 („also dagegen", Stil) und N6
  (Tausendergruppierung in einer Formel, Regel gilt für Fließtext) nur Ledger
  — wenn falsch: zwei kosmetische Stellen bleiben bis zur Entscheidung am
  Etappenende.

**Task 4 (Gebundene Rotation):**

- **Ruling:** Nacharbeit umfasst F1, F2 und die sachlichen Hinweise H1–H15;
  Umsetzer darf reine Ton-/Umfangshinweise begründet stehen lassen (gehen ins
  Ledger) — wie in Task 2 und 3.
- **Ruling** (Umsetzer, aus task-4-report.md §12, im Ledger abgeschnitten
  — hier vollständig): Meriggiola et al. 2016 (Titanrotation) und Harbison et
  al. 2011 (Hyperion) werden nicht zitiert — zu beiden war in diesem Task
  keine Zusammenfassung frei erreichbar (Crossref und OpenAlex führen keine,
  ScienceDirect 403, Springer Anmeldeweiche); Entwurf §6.1 verbietet das
  Zitieren ungeöffneter Arbeiten. Ersatz: `downey-2025` für Titans
  Rotationszustand, `wisdom-1984`, `thomas-2007` und `goldberg-2024` für
  Hyperion.
- **Ruling:** `thomas-2007` („Hyperion's sponge-like appearance") wird nur
  für „einziger Mond mit beobachteter chaotischer Rotation", Dichte und
  Porosität zitiert; die Arbeit behandelt die Oberfläche, nicht die
  Rotationsdynamik.
- **Ruling** (im Ledger abgeschnitten — hier vollständig): Der Text spricht
  durchgehend von der „Kartenmitte" und führt den Begriff „Nullmeridian" nur
  einmal als Gleichsetzung ein („bei einer Plattkarte mit dem Nullmeridian in
  der Bildmitte"), weil das Modell keinen IAU-Nullmeridian kennt und die
  Projektion der einzelnen Texturen nicht je Körper belegt ist; der
  fachgeprüfte `thema-bezugssysteme` nutzt denselben Begriff.
- **Ruling:** Die Modelltabelle führt auch für Merkur die beiden Winkel,
  obwohl er in 3:2 läuft; der Text kennzeichnet sie ausdrücklich als
  Momentaufnahmen.
- **Ruling:** Die Angabe „optische Libration in Länge rund ±8° nach DE441"
  wird ohne eigene Horizons-Rechnung aus dem fachgeprüften `objekt-moon`
  übernommen; Belegzeile 41 sagt das ausdrücklich.
- **Ruling:** Die Jahreszahl 1693 zu den Cassinischen Gesetzen ist gestrichen,
  weil sie in keiner im Task geöffneten Quelle steht.
- **Ruling:** „bis zu vier Cassini-Zustände" ist ersetzt durch „mehrere … vor
  allem die Zustände 1 und 2", weil nur die Zustände 1 und 2 aus geöffneten
  Zusammenfassungen belegbar sind (`ward-1975`).
- **Ruling:** „Pluto und Charon sind das einzige bekannte Beispiel" ist zu
  „das bekannteste Beispiel im Sonnensystem" abgeschwächt; neuere Arbeiten
  führen auch Eris und Dysnomia als doppelt gebunden, in diesem Task nicht
  geprüft.
- **Ruling:** Titan steht in der Tabelle als „Cassini-Zustand" ohne Nummer;
  die Nummer 1 ließ sich aus den geöffneten Zusammenfassungen nicht belegen,
  `gladman-1996` stützt sie nur als Regel und steht deshalb als zweiter Beleg
  in der Zeile.
- **Ruling** (im Ledger abgeschnitten — hier vollständig): Der Befund B1
  (weggelassene periodische Glieder in Tritons und Mirandas Pol) wird nach
  Ruling 3 des Plans nicht behoben, sondern in „Im Modell" beschrieben; dafür
  wurde der Commit einmal ergänzt statt ein zweiter Commit angelegt, damit der
  Task wie im Brief bei einem Commit mit dem vorgegebenen Text bleibt.
- **Ruling:** Die Wortzahl über dem Richtwert (de 4403, en 4883 — Stand bei
  Abgabe des Tasks, vor der Nacharbeit; §4 und §8 nennen 4767/5286, den Stand
  nach der Nacharbeit) bleibt
  stehen; der Brief verlangt elf Pflichtinhalte und zwei Tabellen, und
  Entwurf §5.2 stellt sachliche Vollständigkeit vor die Wortzahl. Die
  Tabellen machen rund 530 Wörter aus.
- **Ruling:** Der Befund B2 (Tethys) steht nur in diesem Bericht, nicht im
  Text — er betrifft einen einzelnen Mond und passt besser in dessen
  Körpertext (Etappe 4d-7).

**Task 5 (Finsternisse):**

- **Ruling** (Umsetzer, aus task-5-report.md §13, im Ledger abgeschnitten
  — hier vollständig): Der Text zitiert Dyson, Eddington und Davidson (1920)
  nicht, weil die Arbeit in diesem Task nicht zugänglich war; die Messwerte
  von 1919 stehen mit Gilmore und Tausch-Pebody 2022 und Longair 2015 als
  Beleg.
- **Ruling:** Die Kritik von Earman und Glymour (1980) wird nur in der
  Wiedergabe durch Gilmore und Tausch-Pebody genannt, ohne eigenen
  Katalogeintrag; im Text steht deshalb „einem Teil der Literatur gilt … seit
  1980" statt einer namentlichen Zuschreibung.
- **Ruling:** Für die Pluto-Charon-Ereignisse tritt Proudfoot et al. 2026 an
  die Stelle des im Brief genannten Ausgangspunkts Buie et al. 1992, dessen
  Zusammenfassung der Verlag zurückhält. Für die Phobos-Durchgänge nennt der
  Brief keinen Ausgangspunkt; gewählt wurde Mueller et al. 2021, nachdem
  Bills et al. 2005 (eigener Fund) beim Verlag nicht zugänglich war.
  (Berichtigt in der Nacharbeit Runde 1: Der Brief nennt Bills et al. 2005
  nicht.)
- **Ruling:** Die PHEMU-Auswertungen werden Saquet et al. 2018 und
  Emelyanov et al. 2022 zugeschrieben, nicht „Arlot et al." — Arlot ist in
  beiden Arbeiten Mitautor, nicht Erstautor.
- **Ruling:** Besselsche Elemente werden mit Melati und Hodijah 2016 belegt
  (offen zugänglich, begutachteter Konferenzband); eine bessere frei
  zugängliche Definition war nicht auffindbar. Der Text nutzt die Arbeit nur
  für die Definitionen und das Typkriterium.
- **Ruling:** Mallama 2021 wird als Vorabdruck zitiert und im Text als solcher
  gekennzeichnet, weil die Arbeit die einzige gefundene physikalische
  Erklärung der Schattenvergrößerung liefert.
- **Ruling:** `thema:gezeiten` steht im Abschnitt „ΔT und alte Finsternisse"
  (Gezeitenreibung) statt bei den säkularen Monatsänderungen — der Kanon
  führt diese auf die wandernde Bahnexzentrizität zurück, nicht auf Gezeiten.
- **Ruling:** Die Quellenkarten stehen in beiden Fassungen an denselben
  Stellen; die deutsche Wikipedia-Karte trägt im englischen Text den Zusatz
  „German Wikipedia" (Muster aus `thema-resonanzen`).
- **Ruling:** Längenangaben der Schattenkegel im Text auf drei Stellen
  gerundet („rund 1,38 Millionen km", „rund 374 500 km"), weil der
  Sonnenabstand um ±1,7 % schwankt; die genauen Werte stehen in der
  Belegliste.
- **Ruling:** Die Winkelradien von Sonne und Mond werden mit „im mittleren
  Apogäum/Perigäum" bezeichnet, weil sie aus $a(1 \pm e)$ folgen und die
  wahren Extremwerte weiter auseinanderliegen.

**Task 6 (Szene Tanz des Mondes):**

- **Ruling:** Der Brief listet `src/data/literatur.ts` unter „Ändern", der
  Commit lässt sie unverändert — das ist kein Mangel: alle vier zitierten
  Kennungen (chapront-touze-1988, espenak-2009, park-2021, petit-2010)
  stehen schon im Katalog, und die Dateiliste des Briefs nennt die Datei nur
  für den Fall neuer Einträge; ein Eintrag ohne neue Zitatstelle würde am
  Test „zitiert jeden Eintrag mindestens einmal" scheitern — wenn falsch: der
  Katalog wächst in dieser Etappe um 0 statt um einige Einträge.
- **Ruling:** Nacharbeit umfasst F1–F5, H1–H3 und H5–H9 (alle sachlich:
  falsche oder zu enge Zahlenspannen, nicht reproduzierbare Belegzeilen,
  unbelegte Annahme, fehlende Modellgrenze) sowie I1 des Task-Reviews und die
  Berichtsberichtigung zu nssdc-moon; H4 ist eine Bestätigung ohne
  Handlungsbedarf und geht nur ins Ledger — wie in Task 2 bis 5 — wenn
  falsch: etwas mehr Nacharbeit als nötig.
- **Ruling:** Nacharbeit Runde 2 umfasst N1–N5 — alle fünf sind sachlich
  (zwei Fehler, drei falsche oder unstimmige Zahlen in Belegzeilen
  beziehungsweise im Text), anders als die reinen Stilhinweise N5/N6 aus
  Task 3, die nur ins Ledger gingen — wenn falsch: eine Runde mehr als nötig.

**Task 7 (Szene Sonnenaufgang über dem Erdrand):**

- **Ruling:** Umsetzer auf sonnet statt opus, wie im
  Sitzungsende-Hinweis vom 20.09. vorgesehen — das Limit ist eine reale
  Schranke, und Fachprüfung plus Nachprüfungen fangen inhaltliche Schwächen
  ab (in Task 6 fanden sie jeden Fehler) — wenn falsch: mehr
  Nacharbeitsrunden als bei opus, im schlimmsten Fall ein flacherer Text, den
  die Abnahme zurückweist.
- **Ruling:** I1 wird szenenbezogen behoben (was die Zielbelichtung für ein
  Bild bedeutet, das zur Hälfte Nachtseite ist, samt Fülllicht und
  ACES-Kurve), mit Verweis auf `thema:photometrie` statt einer Wiederholung
  von dessen Inhalt — der Brief verlangt den Punkt in den Modellgrenzen
  dieser Szene, und Doppelung wäre gegen die Regel „höchstens ein Verweis je
  Ziel je Abschnitt" ohnehin unwirtschaftlich — wenn falsch: der Absatz fällt
  knapper aus als von der Abnahme gewünscht.
- **Ruling:** Nacharbeit umfasst F1–F8, H1–H13 und I1 des Task-Reviews; H14
  (Wortzahl) geht nur ins Ledger — alle H1–H13 sind sachlich (falsche oder zu
  genaue Zahlen, Belege, fehlende Belegzeilen), wie in Task 2 bis 6 — wenn
  falsch: etwas mehr Nacharbeit als nötig.
- **Ruling:** Nacharbeit Runde 1 bleibt beim sonnet-Umsetzer, weil sein
  Kontext steht und die SDD-Regel die Runden 1 bis 3 dem ursprünglichen
  Umsetzer zuweist; konvergiert Runde 2 nicht, eskaliere ich auf opus — wenn
  falsch: eine Runde mehr, bevor der Wechsel kommt.
- **Ruling:** Die elf Kürzungsstellen der Nachprüfung (rund 340 Wörter, als
  substanzfrei geprüft) werden in dieser Nacharbeitsrunde mitgenommen, statt
  sie nach Plan-Regel 12 ans Etappenende zu verschieben — der Text steht mit
  1239/1429 Wörtern 38 beziehungsweise 59 Prozent über dem Richtwert, die
  Stellen sind bereits benannt, und eine Kürzung nach der Abnahme bräuchte
  eine erneute Fachprüfung des ganzen Texts, während die dritte Prüfung
  dieser Runde die Kürzungen ohnehin mitprüft — wenn falsch: der Umsetzer
  setzt beim Umformulieren neue Fehler ein, wie schon bei N1 bis N3 geschehen,
  und es braucht eine Runde mehr. **(Dieses Ruling hat sich als zu riskant
  erwiesen, siehe §7.)**
- **Ruling:** Nacharbeit Runde 2 bleibt beim sonnet-Umsetzer statt auf opus
  zu eskalieren — er hat alle 22 Befunde behoben und dem Prüfer in beiden
  Zahlfragen zu Recht widersprochen, sein Kontext trägt also; erst wenn
  Runde 3 wieder neue Fehler zeigt, wechsle ich — wenn falsch: eine Runde mehr
  als nötig.
- **Ruling:** Dritte Prüfung auf opus statt wie in Task 6 auf sonnet — der
  Umsetzer hat in jeder Runde beim Umformulieren neue Fehler eingesetzt (drei
  in Runde 1), und die Kürzung bewegt 340 Wörter, das ist die teuerste Stelle
  zum Sparen — wenn falsch: eine teurere Prüfung als nötig.
- **Ruling:** R4 wird behoben, nicht bestätigt — die Dämmerungsstufen sind
  ausdrücklicher Pflichtinhalt des Briefs (Hintergrund), die Kürzungsliste
  der Nachprüfung hatte hier über ihre Befugnis hinausgegriffen; sie kommen
  knapp und mit ihrer Quelle (Belegzeile 8) zurück — wenn falsch: rund
  30 Wörter mehr als der Richtwert erlaubt.
- **Ruling:** Nacharbeit Runde 3 geht an einen frischen Umsetzer auf opus
  statt wieder an den sonnet-Umsetzer — das Muster „behebt das Genannte,
  setzt beim Umformulieren Neues ein" hat sich dreimal wiederholt (drei
  Fehler in Runde 1, N4 plus drei Kürzungsfehler in Runde 2); die
  verbleibenden Punkte sind exakt benannt und brauchen keinen gewachsenen
  Kontext, sondern Sorgfalt im Formulieren (SDD sieht den Wechsel ab Runde 4
  vor, der Controller zieht ihn eine Runde vor) — wenn falsch: der frische
  Umsetzer liest sich länger ein und die Runde dauert länger.
- **Ruling** (nach Weisung Jens' „beende langsam mal die Testschleifen"):
  Nach der laufenden Nacharbeit Runde 3 folgt KEINE vierte Fachprüfungsrunde;
  der Controller macht die Schlusskontrolle selbst (Tests, Wortzahl,
  Zahlengleichheit de/en, Belegtabelle, Trailer) und schließt Task 7 ab.
  Verbleibende Hinweise werden im Abnahmeprotokoll geparkt statt weiter
  beprüft — wenn falsch: ein Resthinweis bleibt im Text, den eine vierte
  Runde gefunden hätte.
- **Ruling** (Runde 3): Die 14 % bleiben im Text, jetzt dem
  Scheiben-Kriterium zugeordnet, mit Methodenklammer „Mitte im Bildfeld,
  Scheibe nicht ganz hinter der Erde"; NICHT auf das strengere „Scheibe
  schneidet das Bildfeld" (eigener Messwert 16,3–16,5 %) umgestellt — wenn
  falsch: der Text unterschätzt die Sichtbarkeit um rund 2,5 Prozentpunkte.
- **Ruling** (Runde 3): Die Dämmerungsstufen teilen sich den vorhandenen
  usno-2026-Verweis im selben Satz, statt einen zweiten Verweis auf dasselbe
  Ziel im selben Abschnitt zu setzen (Regel: höchstens ein Verweis je Ziel je
  Abschnitt).
- **Ruling** (Runde 3): Dämmerungsstufen mit „beginnen morgens und enden
  abends" wiedergegeben statt nur „enden", weil die Quelle beide Grenzen an
  denselben Winkel bindet (vier Wörter je Fassung mehr).
- **Ruling** (Runde 3): „Die 34' sind ein Nennwert für Normalbedingungen" zu
  „ein Durchschnittswert" geändert — kein Befund der Runde 3, sondern ein in
  Belegzeile 8 festgehaltener Hinweis der Runde 2; die Quelle sagt „the
  average amount of atmospheric refraction at the horizon" und nennt keine
  Normalbedingungen. Der Satz wurde für R7 ohnehin angefasst — wenn falsch:
  eine Änderung außerhalb der Befundliste.
- **Ruling** (Runde 3): In Belegzeile 13 bleiben Rechnung und Fundstelle samt
  ppm-Vergleich stehen, obwohl die Zahl nicht mehr im Text steht; berichtigt
  sind nur Aussage- und Wert-Spalte, wie die Befundliste verlangt.
- **Ruling** (Runde 3): Keine weitere Kürzung. Wortzahl DE 1071 → 1143,
  EN 1261 → 1355; der Zuwachs geht auf die Rückkehr der Dämmerungsstufen, das
  vollständige Bennett-Zitat und die drei Bedingungen des Bezugswerts.

## 7. Bekannte Unschärfen

**Zur Umsetzung dieser Etappe:**

- **Task 7 lief anders als die übrigen sechs Text-Tasks.** Der vorgesehene
  opus-Umsetzer fiel vor Beginn in ein Nutzungslimit (Ledger, 20.09. gegen
  3 Uhr); der Text entstand auf sonnet. Die erste Fachprüfung fand dort
  8 Fehler und 14 Hinweise, gegen 5 Fehler/9 Hinweise in Task 6 (opus) und
  0 Fehler/7 Hinweise in Task 5 (opus) — deutlich mehr als bei jedem anderen
  Text der Etappe. Es brauchte drei Nacharbeitsrunden statt der sonst
  üblichen zwei; die dritte übernahm ein frischer Umsetzer auf opus, weil das
  Muster „behebt das Genannte, setzt beim Umformulieren Neues ein" sich
  zweimal wiederholt hatte. Befund zur Modellwahl (Ledger, wörtlich
  festgehalten): „die Ersparnis am Umsetzer zahlt sich in Prüf- und
  Nacharbeitsrunden zurück" — für künftige Etappen bei Nutzungslimits zu
  bedenken.
- **Zwei Zahl-Differenzen wurden in Runde 2 gegen die erste Fachprüfung
  entschieden**, beide zugunsten des Umsetzers: Terminator-Sichtbarkeit
  77,5 % (Umsetzer, geschlossene Form und Monte Carlo) statt 74,9 % (erste
  Fachprüfung, die nur bei festgehaltenem Abstandsfaktor 1,0 rechnete — ein
  Mangel, den die erste Runde selbst als eigenen Hinweis (H8) notiert hatte);
  GM⊕-Abweichung +5,275 ppm statt 0,5 ppm (die 0,5 ppm der ersten Runde waren
  durch Vorrundung und ein Vorzeichen falsch). Die zweite, unabhängige
  Rechnung (Nachprüfung, ebenfalls opus) bestätigte beide Male den Umsetzer.
  Lehre: Auch eine Fachprüfung kann sich verrechnen; Widerspruch des
  Umsetzers mit eigener Nachrechnung ist kein automatischer Fehler.
- **Eine Kürzung in Runde 2 hat Tragendes mitgenommen.** Die Nachprüfung
  listete elf „substanzfreie" Kürzungsstellen; der Controller nahm sie
  bewusst zusammen mit den 22 Fehler-/Hinweis-Befunden in dieselbe
  Nacharbeitsrunde (eigenes Ruling, siehe §6). Die dritte, unabhängige
  Prüfung fand danach: eine Prozentzahl falsch zugeordnet (die „14 %" landeten
  beim falschen Kriterium), einen gestrichenen Pflichtinhalt (die
  Dämmerungsstufen, ausdrücklich im Brief verlangt), und eine Belegzeile ohne
  Aussage (Zahl aus dem Text entfernt, Belegzeile dazu stehen gelassen). Alle
  drei wurden in Runde 3 zurückgenommen bzw. berichtigt. Lehre (wörtlich aus
  dem Ledger): „Kürzen und Berichtigen gehören nicht in dieselbe Runde" —
  bei einem Umsetzer, der beim Umformulieren schon zweimal neue Fehler gesetzt
  hatte, potenziert eine gleichzeitige Kürzung das Risiko.
- **Ledger-Transkriptionsfehler (eigener Befund dieser Abnahme):** Beim
  Kopieren der Umsetzer-Rulings aus `task-4-report.md` (3 Zeilen) und
  `task-5-report.md` (10 Zeilen) in `progress.md` wurden die jeweils ersten
  Zeilen des mehrzeiligen Fließtexts übernommen, die Fortsetzungszeilen aber
  nicht — die betroffenen Ledger-Zeilen brechen mitten im Wort bzw. mitten im
  Satz ab (z. B. Zeile 104: „…verbietet das Zitieren unge", Zeile 133: „…weil
  die Arbeit in diesem Task"). In Abschnitt 6 dieses Protokolls stehen die
  vollständigen Sätze aus den Original-Berichten, mit Fundstellenhinweis.
  Betrifft nur die Lesbarkeit des Ledgers, keine der eigentlichen
  Textentscheidungen (die vollständigen Rulings standen immer in den
  Task-Berichten).
- Ledger-Hinweis (Task 4, für spätere Etappe, nicht behoben): `thema-gezeiten`
  Zeile 320 nennt eine abweichende Periode (kein Widerspruch); Stark et al.
  2015 C/MR² ±0,011 gegen Margot ±0,014 wie in `thema-innerer-aufbau` — beide
  Zahlen stehen in unterschiedlichen, jeweils fachgeprüften Texten
  nebeneinander.
- Task 5, Unsicherheiten (aus task-5-report.md §14, nicht in die Fachprüfung
  eskaliert): Melati und Hodijah 2016 ist ein Konferenzbeitrag mit
  sprachlichen Schwächen, die vier daraus belegten Aussagen stehen wörtlich
  darin, eine stärkere Quelle wäre willkommen; Morrison et al. 2021 wurde nur
  über die Zusammenfassung geöffnet (Verlagsseite blockiert); die Aussage
  „Kallisto wirft zeitweise gar keinen Schatten auf Jupiter" folgt aus dem
  Vergleich von Achsneigung (3,12°) und Fenster (2,13°), ohne eigene
  Nachrechnung der Sonnenhöhe über der Jupiter-Äquatorebene über die volle
  Bahn.

**Befunde am Simulationscode** (die Texte beschreiben sie, wie Plan-Ruling 3
verlangt; nicht behoben, Kandidaten für eigene Tasks):

- **Task 2 (Sonne):** Sonnentextur wird mit der Ausweichfarbe `#fdb813`
  multipliziert (`bodies.ts` setzt `material.color` nur für beleuchtete
  Körper), die Scheibe wirkt orange; ein Kommentar in `sun.ts` behauptet eine
  `emissiveMap`, die es nicht gibt (reiner Kommentarfehler, der Text ist
  korrekt). Nullmeridian der Sonne im Code 106,0° hinter dem
  IAU-Carrington-Wert (W0 84,176°).
- **Task 3 (Mond):** Lichtrichtung am dargestellten Mond weicht in der
  Reglerstufe „Schaubild" bis 7,6°, in „Kompakt" bis 32,7° vom Modellwert ab
  (Mondabstand skaliert mit `sizeScale`, die Sonne nicht — die dargestellte
  Phase stimmt dann nicht mit der wirklichen Phase überein).
- **Task 4 (Gebundene Rotation):** B1 — IAU-Pole von Triton und Miranda ohne
  periodische Glieder im Code (Abweichung bis 32,35°/22,55° in Länge bzw.
  4,41°/4,25° in Breite gegenüber der vollen IAU-Formel), dadurch
  Achsneigung im Modell 21,4° (Triton) bzw. 4,3° (Miranda) und entsprechend
  große Scheinlibration in Breite. B2 — Tethys' Librationsperiode im Modell
  57,8 Tage statt der erwarteten 1,89 Tage, weil `lpDot > LDot`; steht nur im
  Bericht, nicht im Text (Kandidat für den Tethys-Körpertext, Etappe 4d-7).
  B3 — Deimos hat im Modell `e = 0` bei größter Periodendrift.
- **Task 5 (Finsternisse):** `MAX_OKKLUDER` streicht Mimas, Enceladus und
  Iapetus als Saturn-Okkludierende sowie Oberon bei Uranus; keine Suche und
  keine Szene für Sonnenfinsternisse; kein Halbschatten, Gamma oder Magnitude
  in der Finsternissuche; gleichmäßig helle Sonnenscheibe im Bild (Modell
  15,1 % statt physikalisch 10,5 % Restlicht in der Korona-Randzone);
  Kernschattenfarbe nur bei der Erde umgesetzt; Mondabstand im Modell ohne
  periodische Störungen (reine Kepler-Ellipse).
- **Task 6 (Szene Tanz des Mondes):** Die Zeitraffer-Blende der Szene lässt je
  nach Vorgängerszene 40,2–44,4 statt der nominellen 40,5 Tage vergehen; bei
  Abstandsfaktor 0,8 ist nur in 76–87 % der Ziehungen die ganze Mondbahn im
  Bild (in 2,4 % der Ziehungen liegt der Mond außerhalb); Höhenstreuung der
  Kamera bis 85° (fast Draufsicht); Erde im Modell ohne
  Erde-Mond-Schwerpunktbewegung; keine periodischen Bahnstörungen.
- **Task 7 (Szene Sonnenaufgang):** Keine gesonderten neuen Code-Befunde über
  die bereits in Task 2/3/5 genannten hinaus; die Modellgrenzen des Texts
  (Zielbelichtung, ACES-Tonwertkurve, Ekliptik- statt Erdäquatorbezug der
  Elevation) beschreiben vorhandenes, in `thema-photometrie` bereits
  dokumentiertes Verhalten.

**Gemeldete Fehler in Gymnasialtexten** (nicht geändert, Ruling: Gymnasialtexte
bleiben unverändert bis eine eigene Entscheidung fällt):

- Task 4: „Monde innerhalb der synchronen Umlaufbahn … werden abgebremst" ist
  im Rotationskontext missverständlich (de/en).
- Task 5: „Rømer schloss erstmals" ist nach Bobis und Lequeux 2008 strittig
  (die erste Ableitung wird historisch eher Cassini am 22.08.1676
  zugeschrieben).

## 8. Halt: Fragen an Jens

**Offene Wortzahlen (Entscheidung am Etappenende, wie in Etappe 2):**

| Text | de / en | Richtwert | Vorschlag |
|---|---|---|---|
| `objekt-sun` | 3967 / 4253 | 1500–3500 | So lassen — acht Pflichtabschnitte plus acht Inhaltskatalog-Punkte des Briefs füllen den Raum, `wc` zählt Tabellen/Formeln mit. |
| `objekt-moon` | 4312 / 4765 | 1500–3500 | So lassen — gleiche Begründung, vergleichbar mit `objekt-sun`. |
| `thema-gebundene-rotation` | 4767 / 5286 | 1500–4000 | So lassen (Ruling des Umsetzers: elf Pflichtinhalte plus zwei Tabellen, rund 530 Wörter allein die Tabellen; Entwurf §5.2 stellt Vollständigkeit vor Wortzahl). |
| `szene-mondtanz` | 1071 / 1230 | 300–900 | So lassen — 15 Pflichtinhalte plus sieben Verweise füllen den Rahmen; rund 28 der gezählten „Wörter" sind Tabellen-/Listenzeichen. |
| `szene-erdaufgang` | 1143 / 1355 | 300–900 | So lassen — Zuwachs in Runde 3 geht auf zurückgeholten Pflichtinhalt (Dämmerungsstufen), vollständiges Zitat und drei Bedingungen eines Bezugswerts, nicht auf Aufblähung. |

`thema-finsternis` (3408/3807, Richtwert 1500–4000) liegt im Rahmen, keine
Frage.

**Stilhinweise, die ins Ledger gingen statt in eine weitere Nacharbeitsrunde
(Task 3):**

- N5: „also dagegen" (DE Zeile 111) — Vorschlag: unverändert lassen, reine
  Stilfrage ohne sachlichen Fehler.
- N6: Tausendergruppierung 363 359/405 574 km innerhalb einer Formel statt
  im Fließtext — Vorschlag: unverändert lassen; die Randbedingungs-Regel zur
  Tausendertrennung gilt ausdrücklich für Fließtext, nicht für Formelinhalte.

**Drei nach Weisung „Testschleifen beenden" geparkte Punkte aus Task 7 Runde 3
(keine vierte Fachprüfung mehr, siehe §6/§7):**

- Wortzahl DE 1143/EN 1355 gegen Richtwert 900 (siehe Tabelle oben).
- Das gemischte Sichtbarkeits-Kriterium hinter den „14 %" (Mitte im Bildfeld,
  Scheibe nicht ganz hinter der Erde) — strenger gerechnet („Scheibe
  schneidet das Bildfeld") ergäben sich 16,3–16,5 %; der Text nennt die
  strengere Zahl in Klammern. Vorschlag: so lassen, beide Zahlen mit
  Methode stehen zu lassen ist transparenter als eine Entscheidung ohne
  vierte Prüfrunde.
- Das Umsetzer-Ruling „34 Bogenminuten sind ein Durchschnittswert" statt
  „ein Nennwert für Normalbedingungen" (USNO-FAQ-Wortlaut „the average
  amount of atmospheric refraction at the horizon", keine Normalbedingungen
  genannt) — Vorschlag: bestätigen, der Quellwortlaut stützt „Durchschnitt"
  direkter als „Nennwert".

**Unsicherheiten der Umsetzer** (siehe auch §7): Task 2 (Howe 2009 siderisch
vs. synodisch, Kandidat für eine Belegzeilen-Ergänzung), Task 3 (Faktenblatt
p=0,12/A=0,11 vs. Phasenintegral 0,48 ohne Auflösung im Text, möglicher Punkt
für eine künftige Prüfung), Task 5 (Melati/Hodijah als schwächste Quelle der
Etappe, Morrison 2021 nur über die Zusammenfassung, Kallisto-Schattenaussage
ohne volle Nachrechnung), Task 6 (Ledger `progress.md:165`: Die Krümmung der
Mondbahn um die Sonne steht als eigene Herleitung ohne Literaturstelle —
Gutzwiller 1998, Brannen 2001 und Rovšek 2024 waren im Task nicht über die
Zusammenfassung hinaus zu öffnen; Kandidat für eine spätere Beleg-Ergänzung,
falls eine der drei Arbeiten zugänglich wird), Task 7 (Ledger `progress.md:191`:
Young 2004 und Urban/Seidelmann 2013 waren ebenfalls nicht über die
Zusammenfassung hinaus zu öffnen und werden deshalb nicht zitiert, Ersatzbeleg
usno-2026; Luftleuchten und die Übertragung von Hulburts
Dämmerungsmechanismus — für die Erdatmosphäre von unten hergeleitet — auf die
Ansicht aus dem Orbit stehen im Text als Vermutung gekennzeichnet, Rulings C
und D des Umsetzers; Vorschlag: unverändert lassen, bis eine der beiden
Arbeiten zugänglich wird oder eine eigene Herleitung möglich ist).

**Katalogform-Frage (Task 7, Ledger `progress.md:196`):** `usno-2026` trägt
im Feld `jahr` das Zugriffsjahr 2026 statt eines Erscheinungsjahrs, weil die
Seite laufend gepflegt wird und kein eigenes Erscheinungsdatum nennt — wie
bereits `silso-2026` und, mit zusätzlichem Dokumentdatum, `bipm-2026`.
Vorschlag: als Muster für laufend gepflegte Seiten ohne Erscheinungsdatum
bestätigen, damit spätere Etappen nicht erneut entscheiden müssen.

**Weitere Fragen aus der Schlussprüfung** (geringe Klasse, betreffen die Form
künftiger Etappen, nicht in dieser Etappe geändert):

- `mallama-2021` und `proudfoot-2026` (erste Vorabdruck-Einträge des
  Katalogs) tragen im sprachunabhängigen Feld `erschienen` das deutsche Wort
  „arXiv-Vorabdruck"; `Literaturkarten.tsx:54` hängt bei Vorabdrucken
  zusätzlich „· Vorabdruck"/„· Preprint" an, die englische Karte liest sich
  dadurch „arXiv-Vorabdruck 2112.08966 · Preprint" — Wort doppelt und in der
  falschen Sprache. Die Testvorlage in `literatur.test.ts` nutzt für denselben
  Fall schlicht `erschienen: 'arXiv'`. Vorschlag: künftige und diese beiden
  Vorabdruck-Einträge auf `erschienen: 'arXiv'` vereinheitlichen, die Nummer
  bleibt im Feld `arxiv` und auf der Karte im Link.
- `chapront-touze-1988` bündelt zwei Arbeiten (A&A 124, 50 von 1983 und
  A&A 190, 342 von 1988) samt CDS-Katalog in einem `erschienen`-Feld und
  nutzt dafür als einziger Eintrag des Katalogs das englische „and" als
  Konjunktion (sonst nur in Zeitschriftennamen). Die Bündelung selbst steht
  als Ruling bereits in §6; Vorschlag: nur die Konjunktion zu „und" ändern,
  konsequent zur Sprachregel.
- `scripts/pruefe-literatur.ts:9`: Die in Task 1 geänderte Kommentarzeile ist
  117 Zeichen lang und sprengt den Umbruch des übrigen Blocks (rund
  78 Zeichen je Zeile); kein Lint-Verstoß, da die Konfiguration keine
  Zeilenlängenregel kennt. Vorschlag: bei nächster Gelegenheit auf die
  übliche Breite umbrechen, keine Eile.
- Testlücke `scripts/literaturVergleich.test.ts`: Die Tests zu `PAUSE_NACH_MS`
  und zum Vorgabewert von `mitWiederholung` (seit der Nacharbeit dieser
  Schlussprüfung) prüfen nur `literaturVergleich.ts`, nicht die Verdrahtung
  in `pruefe-literatur.ts` — ein Aufruf mit einem eigenen, zu kleinen
  `pausenMs` bliebe dort grün, das Skript ist bewusst ungetestet
  („Die Vergleiche stehen getestet in literaturVergleich.ts"). Vorschlag: so
  belassen, solange kein Netzmock lohnt; sonst die Testüberschriften
  präziser fassen, was sie
  tatsächlich prüfen.

**Gemeldete Fehler in Gymnasialtexten** (Liste siehe §7) — Entscheidung, ob
und wann die Gymnasialtexte berichtigt werden, steht aus.

**14 Plan-Rulings** (Entscheidungen der Planung vom 19.09.2026, vollständiger
Wortlaut in `docs/superpowers/plans/2026-09-19-phase4d-hochschule-etappe3.md`
bzw. `task-8-brief.md`, von Jens noch nicht bestätigt — hier nur die Themen,
in Plan-Reihenfolge):

1. arXiv-Pause drei Sekunden statt Wiederholung bei 429.
2. Kein eigener Verweis-Task; Ersatz nach Entwurf §5.5 Punkt 6 über
   Gymnasialtexte, bis die Hochschultexte fertig sind.
3. Befunde am Simulationscode werden in 4d-3 nicht behoben (Ausnahme:
   Mondraten, bereits vor dieser Etappe entschieden und umgesetzt).
4. Sonnentext behandelt die Photosphäre im Abschnitt „Oberfläche" (Abweichung
   von Entwurf §5.1, das „Oberfläche" nur bei Gasplaneten entfallen lässt).
5. Reihenfolge Sonne → Mond → Gebundene Rotation → Finsternisse → Tanz des
   Mondes → Sonnenaufgang, wegen der Modellzahlen-Abhängigkeiten.
6. Beide Themen (`thema-gebundene-rotation`, `thema-finsternis`) mit
   Pflichtabschnitt „Offene Fragen".
7. Jede Szene ein eigener Task (nicht zu zweit wie in Entwurf §7 erlaubt).
8. Modellzahlen aus bereits fachgeprüften Texten gleichlautend übernehmen;
   eigene Abweichungen gehen an Jens statt den fachgeprüften Text zu ändern.
9. Nacharbeit deckt Fehler und sachliche Hinweise ab; Stil-/Umfangs-/
   Themenwahl-Hinweise gehen ins Ledger.
10. Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma)
    wie Plan 4d-2.
11. Siebter Fachprüfungspunkt „Widerspruch zu einem fachgeprüften
    Hochschultext".
12. Sichtprüfung des Formelsatzes entfällt ohne neuen TeX-Befehl (keiner kam
    in dieser Etappe hinzu).
13. Literaturkatalog bleibt im Hauptbundle; 50-kB-Schwelle gegenüber
    1 299,03 kB (siehe §2 — eingehalten, kein Anlass für eine Frage).
14. Fast-Forward nach Abnahme und Schlussprüfung, kein Push; 4d-4 erst nach
    Freigabe durch Jens.

Zusätzlich weiterhin unbestätigt: die 13 Plan-Rulings aus Etappe 2 (siehe
Stand-Abschnitt der lokalen Projektanleitung vom 19.09.2026) — nicht
Gegenstand dieser Abnahme, nur zur Vollständigkeit erwähnt.

## Nacharbeit nach der Schlussprüfung

Die Schlussprüfung (20.09.2026, Paket `04fe610..2df3430` ohne die
fachgeprüften Texte und Beleglisten) sah keinen kritischen Befund; Code,
Literaturkatalog und README waren ohne Befund. Behoben in diesem Commit:

- **§8 ergänzt (Befund W1):** Zwei fehlende Beleglage-Hinweise der
  Umsetzer aus Task 6 und Task 7 nachgetragen (Krümmungsherleitung ohne
  Literaturstelle; Young 2004/Urban & Seidelmann 2013 nicht zu öffnen,
  Luftleuchten und Hulburts Dämmerungsmechanismus als Vermutung), dazu die
  Katalogform-Frage zu `usno-2026` (Zugriffsjahr statt Erscheinungsjahr).
- **Vier Zahlen berichtigt:** §3 nennt jetzt 80 statt 81 Katalogeinträge mit
  `arxiv`-Feld und 240 s statt 243 s reine arXiv-Pausenzeit (der `grep`-Zähler
  traf zusätzlich die Parametertypangabe `arxiv: string` in `arxivAdresse`,
  kein Katalogeintrag); §1 nennt jetzt 25 Commits bis `bcf095d` und 26 mit
  diesem Protokoll-Commit statt einer einzigen, mit dem eigenen Commit nicht
  mehr stimmenden Zahl; §6 stellt beim Task-4-Ruling klar, dass 4403/4883 der
  Stand bei Abgabe des Tasks war und §4/§8 mit 4767/5286 den Stand nach der
  Nacharbeit nennen — kein Widerspruch.
- **Vier Formfragen als neue Punkte in §8 aufgenommen** (nicht behoben,
  Entscheidung an Jens): deutsches „arXiv-Vorabdruck" im sprachunabhängigen
  Feld von `mallama-2021`/`proudfoot-2026`, die zwei in
  `chapront-touze-1988` gebündelten Arbeiten, die 117 Zeichen lange
  Kommentarzeile in `scripts/pruefe-literatur.ts:9`, die Testlücke
  „prüft nur die Konstanten, nicht die Verdrahtung".
- **Code behoben:** `scripts/literaturVergleich.ts` — `mitWiederholung`
  wiederholte einen Abruf mit der generischen Vorgabe `[2000, 5000]` schon
  nach 2 s; da `pruefe-literatur.ts` die Funktion für alle drei Dienste ohne
  eigenes `pausenMs` aufruft, unterschritt das beim arXiv-Abruf den in
  `PAUSE_NACH_MS.arxiv` begründeten Mindestabstand von 3 s (Befund G1; 429
  wird weiterhin korrekt nicht wiederholt). Die Vorgabe beginnt jetzt bei
  `PAUSE_NACH_MS.arxiv` statt einer eigenen, kleineren Zahl (zweite Pause
  unverändert bei 5 s), ohne `pruefe-literatur.ts` zu ändern; abgesichert mit
  einem neuen Test in `scripts/literaturVergleich.test.ts`, der fehlschlägt,
  sobald eine der Vorgabepausen den Mindestabstand wieder unterschreitet.
