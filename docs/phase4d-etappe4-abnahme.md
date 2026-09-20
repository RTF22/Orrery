# Abnahme Phase 4d Etappe 4 „Innere Planeten"

## 1. Umfang

Branch `hochschule-4` (von `master` `7fcea01`, 20.09.2026). Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` (mit
Nachtrag zu Zwischen-Task 5a, Konsortial-Bylines). Plan
`docs/superpowers/plans/2026-09-20-phase4d-hochschule-etappe4.md` (Task 1–7
plus Zwischen-Task 5a, 17 Rulings). Ledger
`.superpowers/sdd/2026-09-20-phase4d-hochschule-etappe4/progress.md`
(git-ignoriert).

15 Commits über `7fcea01` bis `fa2358a`
(`git rev-list --count 7fcea01..fa2358a`). In Reihenfolge:

| Kurzhash | Titel |
|---|---|
| 5d5349f | Literaturkatalog: Vorabdrucke einheitlich als arXiv, Formnachträge aus der Abnahme 4d-3 |
| 1aa4ac4 | Hochschultext Merkur mit Belegliste |
| 4bf921a | Hochschultext Szene Merkur auf der Innenbahn mit Belegliste |
| 0ebcf73 | Hochschultext Merkur: Nacharbeit nach der Fachprüfung |
| 09df385 | Hochschultext Venus mit Belegliste |
| 29bf503 | Belegliste szene-merkurjagd: Fachprüfung abgeschlossen |
| 2bb06a2 | Hochschultext Mars mit Belegliste |
| ec2ad2f | Hochschultext Venus: Nacharbeit nach der Fachprüfung |
| 3a6d4a3 | Hochschultexte Phobos und Deimos mit Beleglisten |
| 6e66cbd | Hochschultext Mars: Nacharbeit nach der Fachprüfung |
| 644b976 | Plan 4d Etappe 4: Zwischen-Task 5a Konsortial-Bylines |
| 13a558c | Hochschultext Szene Tiefflug über Phobos mit Belegliste |
| 8e7f3c0 | Hochschultexte Phobos und Deimos: Nacharbeit nach der Fachprüfung |
| 2460260 | Hochschultext Szene Tiefflug über Phobos: Nacharbeit nach der Fachprüfung |
| fa2358a | Prüfskript: Konsortial-Bylines bei Crossref als Warnung statt Fehler |

Sieben neue Hochschultexte (de/en): `objekt-mercury`, `szene-merkurjagd`,
`objekt-venus`, `objekt-mars`, `objekt-phobos`, `objekt-deimos`,
`szene-phobos-tiefflug`. Task 1 (Formnachträge aus Abnahme 4d-3), Zwischen-
Task 5a (Prüfskript-Lockerung für Konsortial-Bylines, Ruling 17) und Task 8
(dieses Protokoll, README) sind reine Werkzeug-/Dokumentationstasks.
Phobos und Deimos entstanden zusammen in Task 6 mit gemeinsamer Fachprüfung,
aber eigenen Texten und eigenen Beleglisten (Plan-Ruling 4).

## 2. Lint, Tests, Build

Lauf auf `fa2358a` (Arbeitsbaum sauber, `git status --short` leer vor diesem
Protokoll):

- `npm run lint` → kein Befund.
- `npm test` → **4125 Tests, 101 Testdateien, alle grün** (Soll 4125 laut
  Plan/Ledger erreicht).
- `npm run build` → `✓ built in 1.05s`; nur die bekannte Warnung zu großen
  Chunks. Hauptchunk `index-Dp6z5kG4.js` **1 344,77 kB**.

### Testzahlen (Quelle: Ledger-Zeilen „Umsetzer DONE" je Task, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (master `7fcea01`, nach 4d-3) | — | 3969 |
| 1 | Formnachträge aus Abnahme 4d-3 (Prüfskript, Katalog) | +1 | 3970 |
| 2 | Merkur | +22 | 3992 |
| 3 | Szene Merkur auf der Innenbahn | +22 | 4014 |
| 4 | Venus | +22 | 4036 |
| 5 | Mars | +22 | 4058 |
| 6 | Phobos und Deimos (gemeinsam) | +44 | 4102 |
| 7 | Szene Tiefflug über Phobos | +22 | 4124 |
| 5a | Prüfskript: Konsortial-Bylines als Warnung | +1 | 4125 |

Summe 3969+1+22+22+22+22+44+22+1 = 4125, deckt sich mit dem tatsächlichen
`npm test`-Lauf.

### Hauptchunk

Ausgangsstand nach Etappe 3: **1 326,01 kB**. Endstand dieser Etappe:
**1 344,77 kB**. Zuwachs: **+18,76 kB** — deutlich unter der 50-kB-Schwelle
aus Plan-Ruling 13; keine Eskalation der Frage „fauler Import des Katalogs"
an Jens nötig.

Zwischenstände aus den Task-Berichten, soweit dort genannt (Task 2–4 melden
nur die bekannte Chunk-Warnung ohne genaue Zahl): Task 5 (Umsetzung)
**1 338,32 kB** → Task 6 (Phobos/Deimos) **1 343,50 kB** → Task 5
(Nacharbeit, vier neue Katalogeinträge, Basis bereits auf Task 6 aufsetzend)
**1 344,53 kB** → Task 7 (Szene Tiefflug über Phobos) **1 344,77 kB** (diese
Abnahme, unverändert seit Task 7/5a — Zwischen-Task 5a ändert nur
Skriptlogik, keinen gebündelten Text).

### Katalogeinträge

Ausgangsstand **303** (Plan, entspricht dem Endstand aus Etappe 3). Endstand
**372** (`grep -c "^    id: '" src/data/literatur.ts`, selbst nachgezählt).
Zuwachs je Task:

| Task | neue Einträge | Katalog danach |
|---|---|---|
| 1 (Formnachträge) | 0 (drei bestehende Einträge geändert: `mallama-2021`, `chapront-touze-1988`, `proudfoot-2026`) | 303 |
| 2 (Merkur) | 15 | 318 |
| 3 (Szene Merkurjagd) | 1 (`soter-1967`) | 319 |
| 4 (Venus) | 17 | 336 |
| 5 (Mars, Umsetzung) | 13 | 349 |
| 5 (Mars, Nacharbeit) | 4 (`plescia-2004`, `byrne-2009`, `guzewich-2020`, `usgs-gazetteer-2026`) | 353 |
| 6 (Phobos und Deimos, gemeinsam) | 19 | 372 |
| 7 (Szene Tiefflug über Phobos) | 0 (wiederverwendet `brozovic-2025`) | 372 |
| 5a (Prüfskript) | 0 | 372 |

303 + 0 + 15 + 1 + 17 + 13 + 4 + 19 + 0 + 0 = 372, deckt sich mit dem
gezählten Katalogstand. Task 6 führt Phobos und Deimos gemeinsam (Plan-
Ruling 4); die 19 neuen Einträge verteilen sich auf beide Texte, ohne dass
sich diese Zahl sauber aufteilen lässt (mehrere Einträge werden von beiden
Texten zitiert, etwa `thomas-1993`).

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog), Start-/Endzeitpunkt per
Unix-Zeitstempel vor und nach dem Kommando gemessen (1789925045 →
1789925505):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 372 von 372 Einträgen
acuna-1999                   crossref  ok       Erstautor, Jahr und Titel stimmen
agnew-2024                   crossref  ok       Erstautor, Jahr und Titel stimmen
alexander-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
altwegg-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
amelin-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
anderson-2012                 crossref  ok       Erstautor, Jahr und Titel stimmen
andrews-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
andrews-2020                  arxiv     ok       Erstautor und Titel stimmen
andrews-hanna-2008             crossref  ok       Erstautor, Jahr und Titel stimmen
appel-2022                    crossref  ok       Erstautor, Jahr und Titel stimmen
appel-2022                    arxiv     ok       Erstautor und Titel stimmen
archinal-2011                 crossref  ok       Erstautor, Jahr und Titel stimmen
archinal-2018                 crossref  ok       Erstautor, Jahr und Titel stimmen
archinal-2019                 crossref  ok       Erstautor, Jahr und Titel stimmen
asplund-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
asplund-2021                  arxiv     ok       Erstautor und Titel stimmen
avdellidou-2024                crossref  ok       Erstautor, Jahr und Titel stimmen
bagheri-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
baland-2011                   crossref  ok       Erstautor, Jahr und Titel stimmen
barboni-2017                  crossref  ok       Erstautor, Jahr und Titel stimmen
basu-2016                     crossref  ok       Erstautor, Jahr und Titel stimmen
basu-2016                     arxiv     ok       Erstautor und Titel stimmen
bau-2021                      crossref  ok       Erstautor, Jahr und Titel stimmen
bau-2021                      arxiv     ok       Erstautor und Titel stimmen
beggan-2026                   crossref  ok       Erstautor, Jahr und Titel stimmen
bell-2005                     crossref  ok       Erstautor, Jahr und Titel stimmen
benkhoff-2021                 crossref  ok       Erstautor, Jahr und Titel stimmen
benna-2015                    crossref  ok       Erstautor, Jahr und Titel stimmen
bennett-1982                  crossref  ok       Erstautor, Jahr und Titel stimmen
bi-2025                       crossref  ok       Erstautor, Jahr und Titel stimmen
biggin-2015                   crossref  ok       Erstautor, Jahr und Titel stimmen
bipm-2026                     url       ok       HTTP 200
bizouard-2026                  url       ok       HTTP 200
bjonnes-2012                  crossref  ok       Erstautor, Jahr und Titel stimmen
black-2015                    crossref  ok       Erstautor, Jahr und Titel stimmen
blackburn-2011                crossref  ok       Erstautor, Jahr und Titel stimmen
blewett-2011                  crossref  ok       Erstautor, Jahr und Titel stimmen
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
burns-1978                    crossref  ok       Erstautor, Jahr und Titel stimmen
byrne-2009                    crossref  ok       Erstautor, Jahr und Titel stimmen
byrne-2014                    crossref  ok       Erstautor, Jahr und Titel stimmen
byrne-2021                    crossref  ok       Erstautor, Jahr und Titel stimmen
cai-2025                      crossref  ok       Erstautor, Jahr und Titel stimmen
cano-2020                     crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2001                    crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2012                    crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2018                    crossref  ok       Erstautor, Jahr und Titel stimmen
carry-2024                    crossref  ok       Erstautor, Jahr und Titel stimmen
carry-2024                    arxiv     ok       Erstautor und Titel stimmen
cgpm-2022                     crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
chapront-touze-1988            url       ok       HTTP 200
charles-1997                  crossref  ok       Erstautor, Jahr und Titel stimmen
charlot-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
charlot-2020                  arxiv     ok       Erstautor und Titel stimmen
chau-2018                     crossref  ok       Erstautor, Jahr und Titel stimmen
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
ebel-2018                     crossref  ok       Erstautor, Jahr und Titel stimmen
ebel-2018                     arxiv     ok       Erstautor und Titel stimmen
efroimsky-2007                 crossref  ok       Erstautor, Jahr und Titel stimmen
efroimsky-2007                 arxiv     ok       Erstautor und Titel stimmen
ehlmann-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
ehrenreich-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
ehrenreich-2012                arxiv     ok       Erstautor und Titel stimmen
elipe-2017                    crossref  ok       Erstautor, Jahr und Titel stimmen
emelyanov-2022                 crossref  ok       Erstautor, Jahr und Titel stimmen
ernst-2023                    crossref  ok       Erstautor, Jahr und Titel stimmen
espenak-2006                  url       ok       HTTP 200
espenak-2009                  url       ok       HTTP 200
feulner-2012                  crossref  ok       Erstautor, Jahr und Titel stimmen
feulner-2012                  arxiv     ok       Erstautor und Titel stimmen
finley-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
finley-2025                   arxiv     ok       Erstautor und Titel stimmen
fischer-2024                  crossref  ok       Erstautor, Jahr und Titel stimmen
folkner-1997                  crossref  ok       Erstautor, Jahr und Titel stimmen
fraeman-2012                  crossref  ok       Erstautor, Jahr und Titel stimmen
fuller-2016                   crossref  ok       Erstautor, Jahr und Titel stimmen
fuller-2016                   arxiv     ok       Erstautor und Titel stimmen
futaana-2017                  crossref  ok       Erstautor, Jahr und Titel stimmen
futaana-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
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
greaves-2021                  crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
grinspoon-1993                crossref  ok       Erstautor, Jahr und Titel stimmen
guillet-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
gurnett-2013                  crossref  ok       Erstautor, Jahr und Titel stimmen
guzewich-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
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
hauck-2013                    crossref  ok       Erstautor, Jahr und Titel stimmen
haus-2016                     crossref  ok       Erstautor, Jahr und Titel stimmen
hemingway-2018                 crossref  ok       Erstautor, Jahr und Titel stimmen
herald-2014                   url       ok       HTTP 200
herrick-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
herwartz-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
hesselbrock-2017               crossref  ok       Erstautor, Jahr und Titel stimmen
hilton-2006                   crossref  ok       Erstautor, Jahr und Titel stimmen
hirose-2021                   crossref  ok       Erstautor, Jahr und Titel stimmen
horinouchi-2020                crossref  ok       Erstautor, Jahr und Titel stimmen
howard-2023                   crossref  ok       Erstautor, Jahr und Titel stimmen
howe-2009                     crossref  ok       Erstautor, Jahr und Titel stimmen
howe-2009                     arxiv     ok       Erstautor und Titel stimmen
howett-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
hulburt-1953                  crossref  ok       Erstautor, Jahr und Titel stimmen
hurford-2016                  crossref  ok       Erstautor, Jahr und Titel stimmen
hyodo-2022                    crossref  ok       Erstautor, Jahr und Titel stimmen
iess-2012                     crossref  ok       Erstautor, Jahr und Titel stimmen
iess-2018                     crossref  ok       Erstautor, Jahr und Titel stimmen
irwin-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
irwin-2025                    arxiv     ok       Erstautor und Titel stimmen
jacobsen-2008                  crossref  ok       Erstautor, Jahr und Titel stimmen
jacobson-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
jakosky-2018                  crossref  ok       Erstautor, Jahr und Titel stimmen
jaxa-mmx-2026                  url       ok       HTTP 200
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
khan-2021                     crossref  ok       Erstautor, Jahr und Titel stimmen
khan-2023                     crossref  ok       Erstautor, Jahr und Titel stimmen
killen-2007                   crossref  ok       Erstautor, Jahr und Titel stimmen
kleine-2009                   crossref  ok       Erstautor, Jahr und Titel stimmen
klimchuk-2006                  crossref  ok       Erstautor, Jahr und Titel stimmen
klimchuk-2006                  arxiv     ok       Erstautor und Titel stimmen
kloss-2026                    crossref  ok       Erstautor, Jahr und Titel stimmen
knapmeyer-endrun-2021          crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-1998                   crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
kokubo-2010                   arxiv     ok       Erstautor und Titel stimmen
konopkova-2016                 crossref  ok       Erstautor, Jahr und Titel stimmen
konopliv-1999                  crossref  ok       Erstautor, Jahr und Titel stimmen
konopliv-2013                  crossref  ok       Erstautor, Jahr und Titel stimmen
konopliv-2020                  crossref  ok       Erstautor, Jahr und Titel stimmen
kopp-2011                     crossref  ok       Erstautor, Jahr und Titel stimmen
korablev-2019                  crossref  warnung  Crossref führt die Körperschaft „The ACS and NOMAD Science Teams" zuerst, Erstautor „Korablev, O." steht unter den weiteren Autoren
krasna-2013                   crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2014                   crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2015                   crossref  ok       Erstautor, Jahr und Titel stimmen
kruijer-2017                   crossref  ok       Erstautor, Jahr und Titel stimmen
kuchynka-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
kuhn-2012                     crossref  ok       Erstautor, Jahr und Titel stimmen
kuramoto-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
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
laskar-2004a                  crossref  ok       Erstautor, Jahr und Titel stimmen
lawrence-2013                  crossref  ok       Erstautor, Jahr und Titel stimmen
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
marcq-2018                    crossref  ok       Erstautor, Jahr und Titel stimmen
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
nayak-2016                    crossref  ok       Erstautor, Jahr und Titel stimmen
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
oneill-2021                   crossref  ok       Erstautor, Jahr und Titel stimmen
paetzold-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
paita-2018                    crossref  ok       Erstautor, Jahr und Titel stimmen
palin-2020                    crossref  ok       Erstautor, Jahr und Titel stimmen
park-2017                     crossref  ok       Erstautor, Jahr und Titel stimmen
park-2021                     crossref  ok       Erstautor, Jahr und Titel stimmen
park-2025                     crossref  ok       Erstautor, Jahr und Titel stimmen
pasachoff-2009                 crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1969                    crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1976                    crossref  ok       Erstautor, Jahr und Titel stimmen
peale-1979                    crossref  ok       Erstautor, Jahr und Titel stimmen
peale-2002                    crossref  ok       Erstautor, Jahr und Titel stimmen
peplowski-2011                 crossref  ok       Erstautor, Jahr und Titel stimmen
perryman-2011                  crossref  ok       Erstautor, Jahr und Titel stimmen
perryman-2011                  arxiv     ok       Erstautor und Titel stimmen
petit-2010                    url       ok       HTTP 200
petit-2025                    crossref  ok       Erstautor, Jahr und Titel stimmen
petricca-2025                  crossref  ok       Erstautor, Jahr und Titel stimmen
pettengill-1965                crossref  ok       Erstautor, Jahr und Titel stimmen
piani-2020                    crossref  ok       Erstautor, Jahr und Titel stimmen
plescia-2004                  crossref  ok       Erstautor, Jahr und Titel stimmen
pogossian-2022                 crossref  ok       Erstautor, Jahr und Titel stimmen
pogossian-2022                 arxiv     ok       Erstautor und Titel stimmen
pollack-1996                  crossref  ok       Erstautor, Jahr und Titel stimmen
porco-2007                    crossref  ok       Erstautor, Jahr und Titel stimmen
proudfoot-2026                 crossref  ok       Erstautor, Jahr und Titel stimmen
proudfoot-2026                 arxiv     ok       Erstautor und Titel stimmen
prsa-2016                     crossref  ok       Erstautor, Jahr und Titel stimmen
prsa-2016                     arxiv     ok       Erstautor und Titel stimmen
raducan-2026                  crossref  ok       Erstautor, Jahr und Titel stimmen
ray-1996                      crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2017                  crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2017                  arxiv     ok       Erstautor und Titel stimmen
raymond-2022                  crossref  ok       Erstautor, Jahr und Titel stimmen
raymond-2022                  arxiv     ok       Erstautor und Titel stimmen
read-2018                     crossref  ok       Erstautor, Jahr und Titel stimmen
ries-1992                     crossref  ok       Erstautor, Jahr und Titel stimmen
rosenblatt-2011                crossref  ok       Erstautor, Jahr und Titel stimmen
rosenblatt-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
rufu-2017                     crossref  ok       Erstautor, Jahr und Titel stimmen
samuel-2023                   crossref  ok       Erstautor, Jahr und Titel stimmen
saquet-2018                   crossref  ok       Erstautor, Jahr und Titel stimmen
schneider-2005                 crossref  ok       Erstautor, Jahr und Titel stimmen
schneider-2005                 arxiv     ok       Erstautor und Titel stimmen
shevchenko-2019                crossref  ok       Erstautor, Jahr und Titel stimmen
shevchenko-2019                arxiv     ok       Erstautor und Titel stimmen
showalter-2015                 crossref  ok       Erstautor, Jahr und Titel stimmen
silso-2026                    url       ok       HTTP 200
smith-2001                    crossref  ok       Erstautor, Jahr und Titel stimmen
smith-2012                    crossref  ok       Erstautor, Jahr und Titel stimmen
smrekar-2010                  crossref  ok       Erstautor, Jahr und Titel stimmen
soffel-2003                   crossref  ok       Erstautor, Jahr und Titel stimmen
soffel-2003                   arxiv     ok       Erstautor und Titel stimmen
soter-1967                    crossref  ok       Erstautor, Jahr und Titel stimmen
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
strom-1994                    crossref  ok       Erstautor, Jahr und Titel stimmen
su-2025                       crossref  ok       Erstautor, Jahr und Titel stimmen
tajeddine-2014                 crossref  ok       Erstautor, Jahr und Titel stimmen
tamayo-2025                   crossref  ok       Erstautor, Jahr und Titel stimmen
tamayo-2025                   arxiv     ok       Erstautor und Titel stimmen
tarduno-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
thomas-1993                   crossref  ok       Erstautor, Jahr und Titel stimmen
thomas-2007                   crossref  ok       Erstautor, Jahr und Titel stimmen
thomas-2016                   crossref  ok       Erstautor, Jahr und Titel stimmen
thomas-2016                   arxiv     ok       Erstautor und Titel stimmen
thor-2021                     crossref  ok       Erstautor, Jahr und Titel stimmen
touboul-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                  crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                  arxiv     ok       Erstautor und Titel stimmen
tsiganis-2005                  crossref  ok       Erstautor, Jahr und Titel stimmen
turbet-2021                   crossref  ok       Erstautor, Jahr und Titel stimmen
usgs-gazetteer-2026             url       ok       HTTP 200
usno-2026                     url       ok       HTTP 200
valley-2014                   crossref  ok       Erstautor, Jahr und Titel stimmen
velikodsky-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
verbiscer-2005                 crossref  ok       Erstautor, Jahr und Titel stimmen
verbiscer-2007                 crossref  ok       Erstautor, Jahr und Titel stimmen
villanueva-2021                crossref  ok       Erstautor, Jahr und Titel stimmen
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
way-2016                      crossref  ok       Erstautor, Jahr und Titel stimmen
weber-2011                    crossref  ok       Erstautor, Jahr und Titel stimmen
webster-2018                  crossref  ok       Erstautor, Jahr und Titel stimmen
weiss-2014                    crossref  ok       Erstautor, Jahr und Titel stimmen
widemann-2023                  crossref  ok       Erstautor, Jahr und Titel stimmen
wieczorek-2013                 crossref  ok       Erstautor, Jahr und Titel stimmen
wieser-2010                   crossref  ok       Erstautor, Jahr und Titel stimmen
will-2014                     crossref  ok       Erstautor, Jahr und Titel stimmen
will-2014                     arxiv     ok       Erstautor und Titel stimmen
williams-1971                  crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2016                  crossref  ok       Erstautor, Jahr und Titel stimmen
willner-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
winslow-2013                  crossref  ok       Erstautor, Jahr und Titel stimmen
wisdom-1983                   crossref  ok       Erstautor, Jahr und Titel stimmen
wisdom-1984                   crossref  ok       Erstautor, Jahr und Titel stimmen
wordsworth-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
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
zhong-2001                    crossref  ok       Erstautor, Jahr und Titel stimmen
zuber-2013                    crossref  ok       Erstautor, Jahr und Titel stimmen

451 ok, 3 Warnungen, 0 Fehler
```

**Laufzeit:** 460 Sekunden (7:40 min; Zeitstempel vor dem Start 1789925045,
nach Programmende 1789925505, Unix-Sekunden; Ausgangsstand 480 s bei 303
Einträgen — der Katalog ist inzwischen um 69 Einträge gewachsen, die Laufzeit
liegt trotzdem leicht unter dem Ausgangsstand, plausibel durch Netzlatenz-
Schwankungen). Keine Zeile mit `429` (`grep -c 429` auf der vollständigen
Ausgabe: 0 Treffer).

**Drei Warnungen, jede begründet:**

- `cgpm-2022` (crossref, „Crossref führt keine Autoren, Erstautor ungeprüft")
  — der Katalogeintrag führt die 28. Generalkonferenz für Maß und Gewicht als
  Körperschaft, nicht als Person (bekanntes, seit Etappe 2 akzeptiertes
  Verhalten des Prüfskripts, kein neuer Befund dieser Etappe).
- `greaves-2021` (crossref, „Jahr bei Crossref 2020/2020, im Katalog 2021")
  — Crossref führt das Online-Erstjahr der Arbeit (Nature Astronomy, online
  first 2020), der Katalog das Druckjahr der Ausgabe 5(7), 2021; in Task 4
  (Venus) so begründet, kein Fehler.
- `korablev-2019` (crossref, „Crossref führt die Körperschaft „The ACS and
  NOMAD Science Teams" zuerst, Erstautor „Korablev, O." steht unter den
  weiteren Autoren") — genau der von Zwischen-Task 5a beabsichtigte Effekt
  (Ruling 17): Die tatsächliche Nature-Kopfzeile führt Korablev als
  Erstautor, die Kollektivbezeichnung steht dort nachgestellt; Crossrefs
  Metadatenreihenfolge ist hier nachweislich irreführend (in Task 5 an
  mehreren Quellen unabhängig bestätigt: nature.com, ADS, Oxford ORA,
  Bristol-/Aberdeen-Repositorien). Vor Task 5a wäre dies ein Fehler gewesen
  (0 Fehler nach der Lockerung statt vorher 1).

## 4. Fachprüfung

Zahlen aus `task-N-report.md` (Wörter, Belegzeilen, Katalog) und den
`task-N-befunde.md`-Dateien (Fehler/Hinweise), gegengerechnet gegen die
aktuellen Dateien im Arbeitsbaum (`wc -w`, Zeilenzählung der
Beleglisten-Tabellen, eindeutige `literatur:`-Verweise in den Texten). Je
Text genau eine Fachprüfung und eine Nacharbeit (Regel „höchstens eine
Prüfrunde je Text").

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| `objekt-mercury` (Merkur) | 2626 / 2937 | 47 | 22 | 15 | 2 / 2 | keine offen (H1 Belegzeile ergänzt, H2 unbelegter Transit-Satz gestrichen — siehe §8, H3 war ein Missverständnis ohne Änderungsbedarf) |
| `szene-merkurjagd` | 876 / 980 | 27 | 3 | 1 (`soter-1967`) | 0 / 0 | keine (H1 Belegzeile ergänzt, H2 `soter-1967` über Sekundärquelle inhaltlich bestätigt) |
| `objekt-venus` | 3280 / 3625 | 63 | 23 | 17 | 3 / 3 | H2 O'Neill 2021 nur Titel/Fachgebiet geprüft, Volltext nicht erreichbar (kein Handlungsbedarf in dieser Runde); H3 π-/0−-Notation eventuell eher Correia/Laskar/Néron de Surgy 2003 zuzuordnen als der zitierten 2001-Arbeit (unverändert, um Konsistenz zu `thema-gebundene-rotation` zu wahren) |
| `objekt-mars` | 2882 / 3182 | 56 | 31 | 13 initial + 4 Nacharbeit = 17 | 4 / 4 | H1 Samuel et al. 2023 ohne Unsicherheit ±20 km übernommen (Genauigkeitsverlust gegenüber `thema-innerer-aufbau`, kein Widerspruch); H2 „Phobos näher als jeder andere bekannte große Mond" ohne eigene Belegzeile (allgemein bekannt, keine Änderung) |
| `objekt-phobos` | 1333 / 1347 | 38 | 20 | 19 (gemeinsam mit Deimos, Task 6) | 1 / 1 | keine (H1 Porositätsgrundlage präzisiert); EN-Wortzahl 1347 liegt 14 Wörter über der harten Obergrenze 1333 — siehe §8 |
| `objekt-deimos` | 909 / 959 | 22 | 7 | 19 (gemeinsam mit Phobos, Task 6) | 2 / 2 | keine (fehlende Belegzeile „Inneres" ergänzt) |
| `szene-phobos-tiefflug` | 788 / 857 | 25 | 1 | 0 (wiederverwendet `brozovic-2025`) | 1 / 1 | H2 Marslicht-Analogie ohne Primärquelle, bewusst unverändert gelassen (physikalisch unstrittig, Fachprüfung nannte „unverändert lassen" als eine von zwei gleichwertigen Optionen) |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und
Trennzeile), gezählt mit `grep -cE "^\| [0-9]+[a-z]?\s*\|"` je Datei unter
`docs/belege/hochschule/`. Zitate sind die eindeutigen `literatur:`-
Kennungen je Text, deckungsgleich mit den im Browser gemessenen
Literaturkarten (§5.1). Wortzahlen `wc -w` auf den aktuellen Dateien in
`src/data/texte/<sprache>/hochschule/`.

Phobos und Deimos entstanden in einem gemeinsamen Task mit gemeinsamer
Fachprüfung (Plan-Ruling 4); die 19 neuen Katalogeinträge lassen sich nicht
sauber auf beide Texte aufteilen (mehrere Einträge, etwa `thomas-1993`,
werden von beiden Texten zitiert). Fehler/behoben-Zahlen sind je Text
getrennt gezählt (Phobos: F1; Deimos: F2, F3 aus `task-6-befunde.md`).

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}'
http://localhost:5173/Orrery/` → 200), kein zweiter gestartet.
`window.store.setState({ quality: { tier: 'high' } })` direkt nach
`browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung
(Niveau Hochschule, Panel eingehängt, `breiteRem: 40`).

### 5.1 Rundgang

Alle 14 Kombinationen (sieben Kennungen × de/en) angefahren: Körper über
`setInfo({thema:null})` + `setCamera`, Szenen über
`setCinema({running:true, shuffle:false, nummer:…, elapsedSec:0})` +
`setCamera({mode:'cinema'})`, danach `setCinema({running:false})`,
`setTime({paused:true})` und `setUi({hidden:false})`.

**Messfalle gefunden und behoben:** Der erste Versuch, die beiden Szenen zu
laden, scheiterte am Ruhewächter (`ui/idle.ts`): Läuft das Kino ohne
Eingabe, blendet `App.tsx` nach drei Sekunden die gesamte Oberfläche
(einschließlich des Infopanels) komplett aus
(`if (versteckt || (laeuftKino && untaetig)) return null;`), sodass das
Polling auf den Panelkopf bis zum Timeout erfolglos blieb, obwohl der Kopf
nach dem Stoppen des Kinos sofort korrekt dastand. Zusätzlich musste
`elapsedSec: 0` beim erneuten Setzen von `nummer` mitgegeben werden, sonst
sprang das Kino beim zweiten Testlauf sofort mehrere Szenen weiter (der
Ruhezustand von `elapsedSec` aus dem vorherigen Lauf ließ `tickCinema` die
Szene für „fertig" halten). Behoben durch periodische synthetische
`pointermove`-Ereignisse während des Pollens (hält den Ruhewächter zurück,
ohne das Kino zu pausieren — `pauseOnInput:false` bleibt aus Schritt 2
gesetzt) und `elapsedSec: 0` bei jedem Szenenstart. Danach stabilisierten
beide Szenen in rund 200 ms.

**Kernkriterien, alle 14 Kombinationen:** `formelfehler` **0**, keine
Hinweiszeile (insbesondere keine `info.hochschuleFolgt`/„Der Hochschultext
folgt …"), `zitateGleichKarten` **true**.

**14 von 14 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `objekt:mercury` | Merkur | Mercury | 65 | 1 | 22 |
| `objekt:venus` | Venus | Venus | 41 | 1 | 23 |
| `objekt:mars` | Mars | Mars | 73 | 1 | 31 |
| `objekt:phobos` | Phobos | Phobos | 21 | 1 | 20 |
| `objekt:deimos` | Deimos | Deimos | 16 | 0 | 7 |
| `szene:merkurjagd` (Nr. 5) | Szene: Merkur auf der Innenbahn | Scene: Mercury on the inner orbit | 38 | 0 | 3 |
| `szene:phobos-tiefflug` (Nr. 8) | Szene: Tiefflug über Phobos | Scene: Low pass over Phobos | 10 | 0 | 1 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (gemessen in
beiden Läufen). Die Gesamtzahl der Verweise weicht bei zwei Texten minimal
zwischen DE/EN ab (Venus 71↔70, ein `objekt`-Verweis weniger in EN; Phobos
48↔47, ein `thema`-Verweis weniger in EN) — Unterschiede im Fließtext, keine
Formelfehler, ohne Einfluss auf die (identischen) `literatur:`-Zitate.

**Klicktest je Verweisart:** Je Kombination wurde von jeder vorhandenen
Verweisart (`objekt`, `thema`, `szene`, `quelle`, `literatur`) ein Vorkommen
einzeln per `element.click()` ausgelöst — die Kombination wurde vor jedem
Einzeltest frisch aufgebaut, damit ein navigierender Klick (`objekt`,
`thema`, `szene` wechseln Panelinhalt oder Modus) die Prüfung der nächsten
Art nicht verfälscht. Die Wirkung wurde gegen die Tabelle im Brief geprüft
(`objekt` → `camera.targetId`; `thema` → `ui.info.thema`; `szene` →
`cinema.nummer` + `camera.mode`; `quelle`/`literatur` → `border-sky-300` auf
der Karte, Klick und Prüfung in einem `browser_evaluate`), danach der
Ausgangszustand wiederhergestellt. `objekt:venus` und `objekt:deimos` haben
keinen `szene:`-Verweis im eigenen Text (inhaltlich nicht vorgesehen, kein
Fehler) — dort blieben 4 statt 5 Arten testbar.

**Ergebnis: 66 von 66 anwendbaren Klicktests trafen** (5 Kennungen mit allen
fünf Arten × 2 Sprachen + 2 Kennungen mit vier Arten × 2 Sprachen =
5·5·2 + 2·4·2 = 50 + 16 = 66). Alle Treffer: `objekt` → `camera.targetId`
stimmt; `thema` → `ui.info.thema` stimmt; `szene` → `cinema.nummer` traf den
erwarteten Index (`merkurjagd`, `mondtanz`, `mondfinsternis`, `phobos-
tiefflug`, je nach Text) samt `camera.mode==='cinema'`; `quelle`/`literatur`
→ Karte trug `border-sky-300`.

### 5.2 Ersatz entfällt

Vier Messungen, Wartezeit bis zum Kopfwechsel (`performance.now()`):

| Messung | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|
| `thema-gebundene-rotation` → `objekt:mercury` (de) | Merkur | keine | 43,3 ms |
| `thema-finsternis` → `objekt:phobos` (de) | Phobos | keine | 23,7 ms |
| `thema-gebundene-rotation` → `objekt:mercury` (en) | Mercury | keine | 42,5 ms |
| `thema-finsternis` → `objekt:phobos` (en) | Phobos | keine | 24,1 ms |

Alle vier Messungen ohne Hinweiszeile: Die vorher an `objekt:mercury`
beziehungsweise `objekt:phobos` gezeigte Ersatz-Hinweiszeile „Der
Hochschultext folgt …"/„The university-level text will follow …" ist
entfallen, weil diese Etappe die entsprechenden Hochschultexte liefert.

### 5.3 Konsole

`browser_console_messages` (seit dem letzten Navigate): **0 Fehler, 5
Warnungen**, alle „Failed to execute 'requestFullscreen' on 'Element': API
can only be initiated by a user gesture." — Artefakt der `element.click()`-
Aufrufe in `browser_evaluate` beim Auslösen von `szene:`-Verweisen (Abnahme
4d-1 §5.5).

**Gegenprobe (Vorgabe des Briefs) durchgeführt:** Auf `objekt:mercury`
angefahren, echter `browser_click` auf den `szene:merkurjagd`-Verweis im
Text. Ergebnis: Das Kino startete korrekt (`cinema.nummer=5`,
`camera.mode='cinema'`, `document.fullscreenElement===true`), aber **kein
neuer Konsoleneintrag** (weiterhin 0 Fehler/5 Warnungen) — ein echter,
von Playwright ausgeführter Klick zählt für Chromium als Nutzergeste, das
Vollbild wurde erfolgreich gesetzt. Nach Vorgabe des Briefs wird die Warnung
deshalb **nicht mitgezählt**: Sie ist bestätigt ein reines Artefakt des
synthetischen `.click()`-Aufrufs, kein echtes Verhalten. Fullscreen und Kino
danach beendet, Ausgangszustand wiederhergestellt.

Playwright-Aufnahmen (`console-*.log`, `page-*.yml` unter `.playwright-mcp/`)
werden vor dem Commit gelöscht, keine Skripte im Projektstamm angelegt.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge, dazu die fünf
umsetzungsseitigen Rulings aus `task-3-report.md` §„Rulings (für das
Ledger)", die im Ledger selbst nicht wörtlich wiederholt wurden (siehe §7).

**Controller-Rulings:**

- **Ruling:** Vorprüfung ohne Konflikt; Ausführung beginnt mit Task 1 auf
  haiku — mechanisch mit vollständigem Code — Kosten bei Fehlurteil: eine
  Fixrunde.
- **Ruling:** Task 2 (Merkur, sonnet) startet, während die Prüfung von
  Task 1 läuft — Prüfer sind keine Umsetzer, beide Tasks berühren im
  Katalog verschiedene Einträge — Kosten bei Fehlurteil: ein Konflikt in
  `literatur.ts`, in einer Fixrunde zu lösen.
- **Ruling:** Zwischen-Task 5a (haiku, nach Task 7): Der Erstautor-
  Vergleich in `scripts/literaturVergleich.ts` gilt auch als bestanden,
  wenn der Crossref-Erstautor eine Körperschaft ist (kein Komma in der Form
  „Nachname, I." bzw. enthält „Team"/„Collaboration") und der
  Katalog-Erstautor unter den Crossref-Autoren steht — mit Test. Grund:
  Sonst bleibt der Volllauf der Abnahme dauerhaft bei 1 Fehler
  (Plankriterium 0 Fehler), und jede Etappe müsste die Fehlmeldung neu
  begründen — Kosten bei Fehlurteil: eine gelockerte Prüfung für
  Konsortial-Bylines, im Entwurf §4.5 als Nachtrag zu nennen.
- **Ruling:** Abnahme (Task 8, sonnet) startet parallel zur Prüfung von
  Task 5a — die Abnahme braucht Browser und Volllauf des Prüfskripts
  (lange), ein etwaiger Fix an 5a wäre klein und käme als eigener Commit
  nach dem Protokoll (dann Nachtrag in §1) — Kosten bei Fehlurteil: ein
  Nachtrag im Protokoll. (Kein Nachtrag nötig: Task 5a wurde vor Abschluss
  dieses Protokolls sauber freigegeben, Katalog und Prüfskript in §2/§3
  spiegeln bereits den fertigen Stand.)

**Task 1 (Formnachträge):**

- **Ruling:** Bleibt „und" in `chapront-touze-1988` — so in Abnahme 4d-3 §8
  vorgeschlagen und per Plan-Ruling 6 entschieden, das Feld trägt bei
  diesem Eintrag ohnehin Fließtext (CDS-Katalog plus zwei Arbeiten), die
  Projektregel „alles auf Deutsch" wiegt schwerer als die Feldbezeichnung;
  die Abnahme führt den Punkt in §8 als Formfrage (Alternative: Semikolon
  statt Konjunktion) — Kosten bei Fehlurteil: ein Wort in einem Eintrag.

**Task 2 (Merkur):**

- **Ruling:** Die im Brief genannten Quellenkarten (`nasa-mercury`,
  `nasa-messenger`) sind Angebot, keine Pflicht (Plan: „Jeder
  `quelle:`-Verweis braucht eine Karte", nicht umgekehrt) — Kosten bei
  Fehlurteil: zwei fehlende Verweise, nachtragbar. (In der Nacharbeit als
  Missverständnis aufgelöst: Beide Karten erscheinen ohnehin automatisch
  über `fuer`, unabhängig von einem Fließtext-Verweis — das Ruling bleibt
  im Ergebnis richtig.)

**Task 3 (Szene Merkur auf der Innenbahn):**

- **Ruling:** Bogensekunden-Werte wie in `objekt-mercury` als Zahl in
  Mathe plus ausgeschriebenem Wort in Prosa, nicht als `''`-Zeichen in der
  Formel (die TeX-Teilmenge kennt kein `'`).
- **Ruling:** `r_\mathrm{peri}`/`r_\mathrm{aph}`/`v_\mathrm{peri}`/
  `v_\mathrm{aph}` durchgehend kleingeschrieben in beiden Fassungen (der
  Formel-Zwillingstest verlangt Byte-Gleichheit).
- **Ruling:** `soter-1967` ohne Zusammenfassung zitiert (nur geprüfte
  bibliografische Angaben), analog zu `pettengill-1965`, weil weder
  Crossref noch Semantic Scholar eine Zusammenfassung führen und der
  zweiseitige Nature-Text von 1967 hinter einer Anmeldeschranke liegt; die
  beschriebene Aussage selbst aus dem Modell hergeleitet und unabhängig
  über Wikipedia gegengeprüft, nicht nur behauptet.
- **Ruling:** Vis-viva-Geschwindigkeiten mit dem Modell-$GM_\odot$
  (CODATA-$G$ mal `sun.ts`-Masse) gerechnet statt mit dem
  IERS-Tabellenwert, weil die Aussage im Text eine Eigenschaft *dieser
  Simulation* ist; der Vergleich mit dem Faktenblatt zeigt, dass beide
  praktisch gleich sind.
- **Ruling:** Jede der drei genannten Quellenkarten höchstens einmal
  verlinkt, `quelle:nssdc-mercury` zweimal an unterschiedlichen Stellen
  desselben Texts — im Text selbst nur, wo eine neue Zahl aus dem
  Faktenblatt steht; `nasa-mercury`/`nasa-messenger` nicht im Fließtext
  verlinkt (wie schon in Task 2 entschieden).

**Task 6 (Phobos und Deimos, Nacharbeit):**

- **Ruling:** EN-Wortzahl Phobos 1347 (14 Wörter über der harten
  Obergrenze 1333) bleibt stehen — Richtigkeit vor Wortzahl bei einer
  Berichtigung in der Nacharbeit, die englische Fassung brauchte für
  dieselben Korrekturen mehr Wörter als die deutsche, Kürzen ist in der
  Nacharbeit ausdrücklich untersagt (siehe §8).

## 7. Bekannte Unschärfen

**Zur Umsetzung dieser Etappe:**

- **Task-3-Rulings nicht ins Ledger übertragen.** `task-3-report.md` trägt
  einen eigenen Abschnitt „## Rulings (für das Ledger)" mit fünf Punkten;
  `progress.md` hält davon nur die Zusammenfassungszeile „Task 3: complete"
  fest, ohne die fünf Rulings wörtlich zu wiederholen. Anders als der
  „Ledger-Transkriptionsfehler" aus Abnahme 4d-3 (dort wurden Sätze
  abgeschnitten) fehlen hier die Sätze komplett im Ledger — betrifft nur
  die Vollständigkeit des Ledgers als Arbeitsprotokoll, nicht die
  eigentlichen Textentscheidungen (die vollständigen Rulings standen immer
  im Task-Bericht und sind in §6 dieses Protokolls nachgetragen).
- **Task 7, Websuche-Kontingent erschöpft.** Zwei geplante Recherchen
  (Phobos-Marsschatten-Beobachtungen, areostationäre Bahn als Gegenprobe)
  konnten nicht mit frischer Websuche geprüft werden; `WebFetch` blieb
  verfügbar. Die im Task genannten Ausgangspunkte (Jacobson/Lainey 2014,
  Willner et al. 2014, Archinal et al. 2018, Murray/Dermott 2000) wurden
  deshalb nicht frisch geöffnet, stecken aber wortgleich in bereits
  fachgeprüften Nachbartexten und werden dort zitiert, nicht in diesem
  Text direkt.
- Mehrere Texte zitieren Arbeiten ohne bei Crossref/Semantic Scholar
  registrierte Zusammenfassung über Sekundärquellen (WebSearch-Zitate,
  ADS, PubMed, Verlagsseiten) statt über eine direkt geöffnete
  Zusammenfassung: Task 2 (`anderson-2012`, `winslow-2013`, `killen-2007`,
  `correia-2004`); Task 4 (`konopliv-1999`, `smrekar-2010`,
  `correia-2001`, `greaves-2021`, `villanueva-2021`, `oneill-2021`,
  `strom-1994`, `bjonnes-2012`, `grinspoon-1993`, `widemann-2023`,
  `marcq-2018`); Task 5 (`khan-2021`, `knapmeyer-endrun-2021`,
  `kuchynka-2014`, `laskar-2004a`, `jakosky-2018`, `acuna-1999`,
  `ehlmann-2014`, `wordsworth-2016`, `smith-2001`, `dauphas-2011`,
  `warren-2011`, `zhong-2001`, `webster-2018`, `korablev-2019`;
  `andrews-hanna-2008`/`archinal-2011` ganz ohne registrierte
  Zusammenfassung); Task 6 (`rosenblatt-2011` nur über mehrere
  Aggregatoren plus Konferenzfolien als Kontext). In allen Fällen wurde
  jede Angabe selbst geöffnet (mindestens die Zusammenfassung über einen
  Suchdienst), nicht aus dem Gedächtnis zitiert (Entwurf §6.1).
- **Task 5, `plescia-2004`:** Der geöffnete Crossref-Abstract nennt Olympus
  Mons nicht namentlich, nur den Extremwert über alle vermessenen
  Marsvulkane (21,1 km) — die Gleichsetzung mit Olympus Mons ist allgemein
  bekannt, aber nicht wörtlich durch das Abstract selbst belegt (siehe
  §8).
- **Task 5, `korablev-2019`-Autorenkorrektur:** Stützt sich auf den
  Fachprüfer-Befund (nature.com/ADS/Oxford ORA), nicht auf eine erneute
  eigene Volltextprüfung durch den Umsetzer der Nacharbeit — inhaltlich in
  Task 6 des Prüfskripts (Zwischen-Task 5a) bereits produktiv genutzt
  (Warnung statt Fehler im vollen Prüflauf, §3).
- **Task 6, Ernst-2023-Dichte:** Der Umsetzer vermutete den Wert
  1465 ± 51 kg/m³ nur im Ergebnisteil, nicht im Abstract; die Fachprüfung
  hat das über den PMC-Volltext (PMC10290967) geprüft und den Wert
  tatsächlich auch in der Zusammenfassung selbst gefunden — der Beleg ist
  damit besser abgesichert, als der Bericht selbst annahm.

**Befunde am Simulationscode** (die Texte beschreiben sie, wie Plan-Ruling 7
verlangt; nicht behoben, Kandidaten für eigene Tasks):

- **Task 2 (Merkur):** Kein Transit-/Schattenmodell zwischen Planeten:
  `waehleOkkluder` (`render/shadows.ts`) wählt nur den `parent`-Körper oder
  Geschwister mit `kind==='moon'` als Okkluder; für einen mondlosen
  Planeten wie Merkur bleibt die Okkluderliste immer leer — Merkurtransits
  vor der Sonne und Sonnenfinsternisse durch Merkur kommen im Modell
  grundsätzlich nicht vor.
- **Task 3 (Szene Merkurjagd):** `chase`-Kamera addiert den Höhenversatz
  (`radius · sin(elevationDeg)`) rein senkrecht, ohne ihn mit der
  Blickrichtung zu drehen — der wahre Kameraabstand weicht dadurch bei
  Elevation ungleich 0° um bis zu 17 % vom nominellen
  `distanceInRadii`-Wert ab.
- **Task 4 (Venus):** `render/bodies.ts` hat für keinen Körper eine
  Atmosphären-/Wolkenschicht — Venus zeigt ausschließlich die
  Magellan-Radar-Oberflächenkarte, nie eine Wolkendecke. Das vereinfachte
  Streumodell (Lambert-Kugel × Fresnel) kehrt für Venus die reale
  Reihenfolge von Bond- und geometrischer Albedo um (Modell: Bond-Analog
  stets < 1, real Bond 0,76 > geometrisch 0,689).
- **Task 5 (Mars):** Datensatz nutzt bewusst den älteren IAU-2009-Pol
  (317,68143°/52,88650°, Achsneigung 25,19°) statt des seit 2018 amtlichen
  IAU-2015-Pols (317,269°/54,432°, Achsneigung 23,92°) — der Kommentar in
  `mars.ts` ist intern konsistent, vergleicht aber mit einer groben
  JPL-Näherungstafel statt der vom Rotationsmodell selbst verwendeten
  hochgenauen Ephemeride (siehe §8). Keine Bewegung von Polkappen,
  Staubstürmen oder Jahreszeiten in der Textur. `rotationAtEpochDeg: 0`
  weicht vom IAU-$W_0$ (176,049863°) ab (reine Kartenausrichtung, wie bei
  Merkur).
- **Task 6 (Phobos und Deimos):** Deimos' Katalogmasse (2,4·10¹⁵ kg,
  NSSDC-Faktenblatt) liegt rund 67 % über der aktuellen GM-Bestimmung
  (JPL SSD/MAR097, Ernst et al. 2023) — die NSSDC-Tabelle ist zusätzlich in
  sich selbst nicht konsistent (eigene Masse und eigene Halbachsen ergäben
  rechnerisch rund 2368 kg/m³, die Tabelle nennt aber 1750 kg/m³, siehe
  §8). Deimos hat im Datensatz `e=0`, gemessen sind rund 0,0002–0,0003.
  Beide Monde werden als Kugeln dargestellt, tatsächlich sind es
  dreiachsige Ellipsoide (Abweichungen bis +26 %/−18 % je Halbachse).
  Deimos hat keine Textur (`textures.albedo` leer, Ausweichfarbe
  `#7a7067`, Ruling 16, in `ASSETS.md` begründet). Der Datenblock „Abstand
  zur Sonne" zeigt für Monde die heliozentrische Position, nicht den
  Abstand zum Mutterkörper (betrifft alle Monde gleichermaßen, kein
  Kennungs-spezifischer Befund).
- **Task 7 (Szene Tiefflug über Phobos):** Mars zählt für seine beiden
  Monde grundsätzlich als möglicher Okkluder (Klarstellung gegenüber dem
  mondlosen Merkur, kein Fehler). `render/lighting.ts` kennt keine
  körperübergreifende Beleuchtung — kein reflektiertes „Marslicht" auf
  Phobos im Modell (im Text als Modellgrenze benannt).

**Gemeldete Fehler in Gymnasialtexten** (nicht geändert, Ruling:
Gymnasialtexte bleiben unverändert bis eine eigene Entscheidung fällt):

- Task 6 (Phobos): Stickney „ein Drittel der Länge des Mondes" — rechnerisch
  rund 41 % (NASA: „about half"); Bahnabsinken „knapp zwei Meter je
  Jahrhundert" gegen Brozović et al. 2025 (3,8 cm/Jahr = 3,8 m/Jahrhundert,
  fast das Doppelte).
- Task 7 (Szene Tiefflug über Phobos, bestätigt dieselben zwei Befunde
  unabhängig): zusätzlich Zerfallsspanne „30 bis 50 Millionen Jahre" gegen
  die fachgeprüften 20 bis 43 Millionen Jahre aus `objekt-phobos` (zwei
  verschiedene Modelle, Spannen überlappen nur am Rand).

## 8. Halt: Fragen an Jens

**Offene Wortzahl:**

| Text | de / en | Obergrenze | Vorschlag |
|---|---|---|---|
| `objekt-phobos` | 1333 / 1347 | 1333 | So lassen — die Berichtigung in der Nacharbeit (Periapsislängen-Periode „länger" statt „kürzer") brauchte in der englischen Fassung mehr Wörter als in der deutschen; Kürzen ist in der Nacharbeit ausdrücklich untersagt (Ruling des Controllers, §6). |

Alle übrigen sechs Texte liegen innerhalb ihrer Richtwerte/Obergrenzen (siehe
§4), keine weitere Frage.

**Gestrichener Halbsatz Merkur (Task 2, H2):** „… und treten im Mittel etwa
13-mal je Jahrhundert auf, meist im Mai oder November" wurde in der
Nacharbeit ersatzlos gestrichen, weil kein zitierfähiger `literatur:`-Beleg
in der verfügbaren Zeit auffindbar war (die Zahl selbst ist ein gängiger,
unstrittiger astronomischer Richtwert). Vorschlag: gestrichen lassen; sollte
eine spätere Etappe (etwa eine Szene zu Merkurtransits) einen Beleg dafür
ohnehin brauchen, kann der Satz dort mit Zitat zurückkehren.

**Konjunktion in `chapront-touze-1988` (Task 1):** Das Feld `erschienen`
bündelt zwei Arbeiten (A&A 124, 50 von 1983 und A&A 190, 342 von 1988) samt
CDS-Katalog und nutzt dafür weiterhin das englische „and" als Konjunktion,
seit der Nacharbeit dieser Etappe geändert zu „und" (deutsches Wort im
sprachunabhängigen Feld, wie in Abnahme 4d-3 §8 als Formfrage benannt und in
Plan-Ruling 6 vorgeschlagen). Vorschlag: „und" bestätigen, konsequent zur
Sprachregel „alles auf Deutsch".

**Code-Befunde, als Kandidaten für eigene Tasks (siehe §7 für Details):**

- Mars-Pol: Datensatz nutzt bewusst den älteren IAU-2009-Pol
  (Achsneigung 25,19°) statt des seit 2018 amtlichen IAU-2015-Pols
  (23,92°) — Kommentar in `mars.ts` intern konsistent, aber methodischer
  Bruch (Vergleich mit grober Näherungstafel statt hochgenauer
  Ephemeride). Vorschlag aus dem Task-Bericht: Umstellung auf den
  2015er-Pol erst nach Klärung der Ephemeriden-Frage.
- Deimos-Masse im Datensatz 67 % über der aktuellen GM-Bestimmung
  (MAR097/Ernst et al. 2023); NSSDC-Tabelle selbst intern inkonsistent
  (Masse+Halbachsen ≠ genannte Dichte).
- Deimos `e=0` im Datensatz gegen gemessene 0,0002–0,0003.
- Beide Marsmonde werden als Kugeln dargestellt, tatsächlich dreiachsige
  Ellipsoide.
- Nullmeridiane: `rotationAtEpochDeg: 0` bei Merkur und Mars weicht vom
  IAU-$W_0$ ab (reine Kartenausrichtung, kein Bezug zur amtlichen
  Referenzlänge).

**Gemeldete Fehler in Gymnasialtexten** (Liste siehe §7) — Entscheidung, ob
und wann die Gymnasialtexte berichtigt werden, steht aus: Phobos „ein
Drittel"/„knapp zwei Meter je Jahrhundert" (Task 6), Zerfallsspanne „30 bis
50 Millionen Jahre" (Task 7, bestätigt).

**Quellen nur über Sekundärquellen geöffnet** (siehe §7 für die vollständige
Liste je Task) — kein Fehler, aber eine Fachprüfung mit Volltextzugriff
könnte hier genauer nachschärfen: Task 2 (vier Arbeiten), Task 4 (elf
Arbeiten, davon `oneill-2021` mit offenem Hinweis H2), Task 5 (14 Arbeiten,
davon `andrews-hanna-2008`/`archinal-2011` ganz ohne Zusammenfassung), Task 6
(`rosenblatt-2011`).

**`plescia-2004` nennt Olympus Mons nicht namentlich** (Task 5, Nacharbeit
F1): Der als Ersatzbeleg für die Olympus-Mons-Gipfelhöhe (21,1 km)
verwendete Crossref-Abstract spricht nur vom höchsten vermessenen Marsvulkan
allgemein; die Gleichsetzung mit Olympus Mons ist fachlich unstrittig,
aber nicht wörtlich durch das Abstract selbst gedeckt. Vorschlag: so lassen
(die Zuordnung ist in der Fachliteratur eindeutig), bei Gelegenheit einen
zusätzlichen, namentlich auf Olympus Mons bezogenen Beleg ergänzen.

**Restliche Fachprüfungs-Hinweise, bewusst nicht in dieser Runde geändert:**

- `objekt-venus` H2 (O'Neill 2021 nur Titel/Fachgebiet geprüft, Volltext
  hinter Zugangssperre) und H3 (π-/0−-Notation eventuell eher
  Correia/Laskar/Néron de Surgy 2003 zuzuordnen) — Vorschlag: unverändert
  lassen, bei künftigem Volltextzugriff bzw. gemeinsam mit
  `thema-gebundene-rotation` gegenprüfen.
- `objekt-mars` H1 (Samuel et al. 2023 ohne Unsicherheit ±20 km) und H2
  (Phobos-Vergleich unbelegt) — Vorschlag: bei Gelegenheit ergänzen, kein
  Fehler.
- `szene-phobos-tiefflug` H2 (Marslicht-Analogie ohne Primärquelle) —
  Vorschlag: unverändert lassen (physikalisch unstrittig, Lehrbuchwissen)
  oder ersatzlos streichen; beide Optionen hat die Fachprüfung selbst als
  gleichwertig benannt.

**17 Plan-Rulings** (Entscheidungen der Planung vom 20.09.2026, vollständiger
Wortlaut in `docs/superpowers/plans/2026-09-20-phase4d-hochschule-etappe4.md`
Abschnitt „Rulings", von Jens noch nicht bestätigt — hier nur die Themen, in
Plan-Reihenfolge):

1. „weiter im Plan" gilt als Freigabe für Etappe 4d-4 (analog „mach weiter"
   für 4d-3).
2. Modelle: Text-Umsetzer, Fachprüfer, Abnahme und Schlussprüfung auf dem
   mittleren Modell, mechanische Tasks auf dem kleinsten.
3. Höchstens eine Prüfrunde je Text (ersetzt Ruling 9 des Plans 4d-3).
4. Phobos und Deimos in einem Task mit gemeinsamer Fachprüfung, aber
   eigenen Texten und Beleglisten.
5. Reihenfolge Merkur → Merkurjagd → Venus → Mars → Phobos und Deimos →
   Phobos-Tiefflug.
6. Die Fragen aus §8 der Abnahme 4d-3 wie dort vorgeschlagen entschieden.
7. Befunde am Simulationscode werden in 4d-4 nicht behoben, nur beschrieben
   und gemeldet.
8. Modellzahlen aus bereits fachgeprüften Texten gleichlautend übernehmen;
   eigene Abweichungen gehen an Jens statt den fachgeprüften Text zu
   ändern.
9. Kein eigener Verweis-Task, da alle sieben Kennungen Gymnasialtexte
   haben.
10. Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch
    Komma); Zahlenspannen nennen, wofür sie gelten.
11. Fachprüfung behält den siebten Prüfpunkt „Widerspruch zu einem
    fachgeprüften Hochschultext", mit dem Hinweis, dass es nur eine Runde
    gibt.
12. Sichtprüfung des Formelsatzes entfällt ohne neuen TeX-Befehl.
13. Literaturkatalog bleibt im Hauptbundle; 50-kB-Schwelle gegenüber dem
    Ausgangsstand (siehe §2 — eingehalten, kein Anlass für eine Frage).
14. Fast-Forward nach Abnahme und Schlussprüfung, Push erst nach Prüfung
    des Diffs auf Zugangsdaten; 4d-5 erst nach Freigabe durch Jens.
15. Wortzahl-Obergrenze als weiche Schranke (höchstens ein Drittel über dem
    Richtwert); Straffung vor dem Commit, nicht in der Nacharbeit.
16. Deimos ohne Textur bleibt so, im Text unter „Im Modell" beschrieben;
    keine neue Textur in dieser Etappe.
17. Zwischen-Task 5a lockert den Erstautor-Vergleich des Prüfskripts für
    Konsortial-Bylines (Warnung statt Fehler), Anlass `korablev-2019`.

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen
Projektanleitung beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.

## Nacharbeit nach der Schlussprüfung

**Befund:** Beschreibende Zusätze im sprachunabhängigen Katalogfeld `erschienen`
(Herausgeber, Zugriffs- und Online-Datum, Art einer Seite) standen in sechs
Einträgen auf Deutsch: `ebel-2018` („Hrsg."), `jaxa-mmx-2026` („Missionsseite",
„Stand"), `raducan-2026` („seit"), `usgs-gazetteer-2026` („im Auftrag",
„Online-Datenbank", „abgerufen"), `usno-2026` („Online-FAQ", „abgerufen"),
`chapront-touze-1988` („und").

**Ruling:** Alle beschreibenden Zusätze in `erschienen` stehen einheitlich auf
Englisch wie die Zeitschriftennamen, ohne Ausnahme. Eigennamen von Verlagen und
Einrichtungen bleiben in der Originalsprache (Schlussprüfung 4d-4).
Vornahme und Katalogstand:

| Kennung | Alt | Neu |
|---|---|---|
| `ebel-2018` | `(Hrsg.)` | `(eds.)` |
| `jaxa-mmx-2026` | `JAXA-Missionsseite, Stand September 2026` | `JAXA mission page, as of September 2026` |
| `raducan-2026` | `Nature Astronomy (online seit 18. August 2026)` | `Nature Astronomy, published online 18 August 2026` |
| `usgs-gazetteer-2026` | `U.S. Geological Survey, im Auftrag der IAU Working Group for Planetary System Nomenclature, Online-Datenbank, abgerufen 20. September 2026` | `U.S. Geological Survey for the IAU Working Group for Planetary System Nomenclature, online database, accessed 20 September 2026` |
| `usno-2026` | `Astronomical Applications Department, U.S. Naval Observatory, Washington, DC, Online-FAQ, abgerufen 20. September 2026` | `Astronomical Applications Department, U.S. Naval Observatory, Washington, DC, online FAQ, accessed 20 September 2026` |
| `chapront-touze-1988` | `… (1983) und 190, 342 (1988)` | `… (1983) and 190, 342 (1988)` |

Das Ruling hebt das Task-1-Ruling zur „und"-Schreibweise in `chapront-touze-1988`
auf und weicht von dem in Abnahme 4d-3 §8 gesammelten Vorschlag ab (damals Frage:
„Deutsch oder Englisch in diesem Feld"). Der nach der Schlussprüfung ermittelte
Katalogstand ist **372 Einträge** (von 303 aus 4d-3).

**Zurückgestellt:** Ein Minor in `scripts/literaturVergleich.ts` (Behandlung von
Körperschaften ohne Familienname bei Crossref) — praxisfern, keine neuen Fälle
seit 4d-2.

Commit: `Nacharbeit nach der Schlussprüfung 4d Etappe 4`.
