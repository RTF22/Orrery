# Abnahme Phase 4d Etappe 10 „Zwergplaneten"

## 1. Umfang

Branch `hochschule-10` von `master` `a3dc7d1` (Plan-Commit, 23.09.2026 — inhaltlich identisch mit
dem Endstand von Etappe 4d-9, `4e39a04`: 4935 Tests, Katalog 680, Quellenkarten 84, Hauptchunk
1 429,46 kB, Prüfskript 682 s bei 680 Einträgen). Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-23-phase4d-hochschule-etappe10.md` (11 Tasks, 26 Plan-Rulings).
Ledger `.superpowers/sdd/2026-09-23-phase4d-hochschule-etappe10/progress.md` (git-ignoriert).

19 Commits über `a3dc7d1` bis `a709ad5` (`git rev-list --count a3dc7d1..a709ad5`). In
chronologischer Reihenfolge:

| Kurzhash | Titel |
|---|---|
| 63d3144 | Achsneigung: Plutos Schiefe als stabile Schwingung statt „chaotisch" |
| a0ae210 | Szene Von Neptun zur fernen Sonne: Kamera hinter Neptun, Belichtung auf das Blickziel |
| 5f0ce82 | Szene Von Neptun zur fernen Sonne: veralteten Kommentar entfernt |
| f2f2e19 | Szenentexte „Von Neptun zur fernen Sonne" an die neue Kamera angepasst |
| fd8610d | Szenentexte Von Neptun zur fernen Sonne: Nacharbeit nach der Diffprüfung |
| 115ed4b | Hochschultext Ceres mit Belegliste |
| 74ab54a | Hochschultext Eris mit Belegliste |
| c4f6add | Hochschultext Ceres: Nacharbeit nach der Fachprüfung |
| c00143e | Hochschultext Haumea mit Belegliste |
| 922a802 | Hochschultext Eris: Nacharbeit nach der Fachprüfung |
| 815aafa | Hochschultext Makemake mit Belegliste |
| e7e50ba | Hochschultext Haumea: Nacharbeit nach der Fachprüfung |
| 147332e | Hochschultext Thema Kirkwood-Lücken mit Belegliste |
| 4b2aa73 | Hochschultext Makemake: Nacharbeit nach der Fachprüfung |
| 6f27363 | Hochschultext Thema Zwergplaneten mit Belegliste |
| 655a8da | Hochschultext Thema Kirkwood-Lücken: Nacharbeit nach der Fachprüfung |
| 6b29321 | Hochschultext Szene Ceres im Asteroidengürtel mit Belegliste |
| d7c729b | Hochschultext Thema Zwergplaneten: Nacharbeit nach der Fachprüfung |
| a709ad5 | Hochschultext Szene Ceres im Asteroidengürtel: Nacharbeit nach der Fachprüfung |

Zwei Nachführungs-Tasks vorweg (Freigabe aus der Abnahme 4d-9, §8): Task 1 berichtigt die
„chaotische Schiefe" Plutos in `thema-achsneigung.md` (samt Einschub in `objekt-pluto.md`, Ruling
21); Task 2/3 stellen die Szene `ferne-sonne` auf den Bahntyp `sichtlinie` um (Kamera hinter
Neptun, Ruling 22) und führen die Szenentexte aller drei Niveaus nach. Danach sieben neue
Hochschultext-Einheiten (de/en): `objekt-ceres`, `objekt-eris`, `objekt-haumea`,
`objekt-makemake`, `thema-zwergplaneten`, `thema-kirkwood-luecken`, `szene-ceres-guertel` — je
genau eine Fachprüfung und höchstens eine Nacharbeit (Ruling 3, „höchstens eine Prüfrunde je
Text"). Task 11 (dieses Protokoll, README) ist ein reiner Dokumentationstask.

Reihenfolge Task 1 und 3 um Task 2 herum, dann Ceres → Eris → Haumea → Makemake →
`zwergplaneten` → `kirkwood-luecken` → `ceres-guertel` (Ruling 5); tatsächlich lief Task 9
(Kirkwood-Lücken) vor Task 8 (Zwergplaneten), weil Task 9 nur Task 4 braucht und Task 8 die
Makemake-Zahlen nach deren Nacharbeit (Ledger-Ruling, keine inhaltliche Abhängigkeit verletzt).
Fachprüfungen liefen jeweils parallel zum nächsten Umsetzer; Nacharbeiten warteten, bis kein
anderer Umsetzer lief.

## 2. Lint, Tests, Build

Lauf auf `a709ad5` (Arbeitsbaum sauber vor diesem Protokoll):

```
npm notice run orrery@0.0.0 lint
npm notice run eslint .
```
→ kein Befund.

```
npm notice run orrery@0.0.0 test
npm notice run vitest run
 Test Files  101 passed (101)
      Tests  5086 passed (5086)
   Start at  11:57:42
   Duration  13.94s
```
→ **5086 Tests, 101 Testdateien, alle grün** (Soll laut Plan 5086 erreicht).

```
✓ built in 963ms
dist/assets/index-qk3kKO9o.js   1,450.51 kB │ gzip: 392.81 kB
```
→ nur die bekannte Warnung zu großen Chunks. Hauptchunk **1 450,51 kB**.

### Testzahlen (aus den Task-Berichten, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (Plan-Commit `a3dc7d1`, inhaltlich 4d-9-Endstand) | — | 4935 |
| 1 | Achsneigung/Pluto-Nachführung (nur Text) | +0 | 4935 |
| 2 | Szene ferne-sonne, Code (Test + Fix-Runde) | +1 | 4936 |
| 3 | Szenentexte ferne-sonne (alle Niveaus) | +0 | 4936 |
| 4 | Ceres (Umsetzung + Nacharbeit) | +22 | 4958 |
| 5 | Eris (Umsetzung + Nacharbeit) | +22 | 4980 |
| 6 | Haumea (Umsetzung + Nacharbeit) | +22 | 5002 |
| 7 | Makemake (Umsetzung + Nacharbeit) | +22 | 5024 |
| 9 | Kirkwood-Lücken (Umsetzung + Nacharbeit, vor Task 8 gelaufen) | +20 | 5044 |
| 8 | Zwergplaneten (Umsetzung + Nacharbeit) | +20 | 5064 |
| 10 | Szene Ceres im Asteroidengürtel (Umsetzung + Nacharbeit) | +22 | 5086 |

4935+0+1+0+22+22+22+22+20+20+22 = 5086, deckt sich mit dem tatsächlichen `npm test`-Lauf. Task 1
und Task 3 (reine Textänderungen an bereits getesteten Dateien) fügen keine neuen Testfälle
hinzu; Task 2 fügt genau einen neuen Testfall hinzu (`cinema.test.ts`, Ruling 22-Umstellung).
Jede Nacharbeit fügt keine neuen Testfälle hinzu (nur Text-/Beleg-Korrekturen); Kirkwood-Lücken
und Zwergplaneten liegen mit +20 statt +22 unter dem sonstigen Muster (zwei Testfälle weniger je
Themen-Einheit als bei einer Körper-Einheit — beide Zahlen stammen unverändert aus den jeweils
ersten Erstellungscommits, `npm test` bestätigt die Summe).

### Hauptchunk

Ausgangsstand nach Etappe 4d-9: **1 429,46 kB**. Endstand dieser Etappe (selbst nachgebaut auf
`a709ad5`): **1 450,51 kB**. Zuwachs: **+21,05 kB** — weit unter der 50-kB-Schwelle aus
Plan-Ruling 13; keine Eskalation der Frage „fauler Import des Katalogs" an Jens nötig.

Zwischenstände aus den Task-Berichten (chronologisch, nicht durchgehend vorhanden): Task 1
unverändert 1 429,46 kB (reine Textänderung); Task 2 (Code) 1 429,44 kB vor wie nach der
Fix-Runde (praktisch unverändert); Task 3 1 429,44 kB. **Task 4 (Ceres) und Task 5 (Eris) nennen
in ihren Berichten keinen Hauptchunk-Wert** — dieselbe Berichtslücke wie in den Abnahmen 4d-6 §7,
4d-7 §2, 4d-8 §2 und 4d-9 §2 bereits mehrfach dokumentiert. Ab Task 6 wieder durchgehend
berichtet: Haumea **1 442,63 kB** (+13,17 gegenüber dem Ausgangsstand), Makemake **1 446,17 kB**
(+16,71), Kirkwood-Lücken **1 447,63 kB** (als „vorbestehend" vermerkt), Zwergplaneten
**1 449,74 kB**, nach dessen Nacharbeit sowie nach der Szene Ceres-Gürtel übereinstimmend
**1 450,23 kB** (+0,49 gegenüber 1 449,74 kB — beide Messungen lagen in überlappenden
Etappen-Zwischenständen, kein Widerspruch). Der selbst gemessene Endstand 1 450,51 kB ist mit
diesen Zwischenwerten und einer plausiblen kleinen Restzunahme über die beiden ungemessenen Tasks
verträglich.

### Katalogeinträge (`src/data/literatur.ts`)

Ausgangsstand **680** (`git show a3dc7d1:src/data/literatur.ts | grep -cE "^\s+id: '"`, identisch
mit dem Endstand aus Etappe 4d-9). Endstand **753** (`grep -cE "^\s+id: '" src/data/literatur.ts`,
selbst nachgezählt). Zuwachs je Commit, für **jeden** der 19 Commits selbst per
`git show <Commit>:src/data/literatur.ts | grep -c` nachgezählt (nicht aus den Berichten
übernommen):

| Kurzhash | Aufgabe | Katalog danach | Zuwachs |
|---|---|---|---|
| 63d3144 | Task 1 | 680 | 0 |
| a0ae210 | Task 2 | 680 | 0 |
| 5f0ce82 | Task 2 (Fix) | 680 | 0 |
| f2f2e19 | Task 3 | 680 | 0 |
| fd8610d | Task 3 (Nacharbeit) | 680 | 0 |
| 115ed4b | Task 4 (Ceres) | 701 | +21 |
| 74ab54a | Task 5 (Eris) | 710 | +9 |
| c4f6add | Task 4 (Nacharbeit) | 710 | 0 |
| c00143e | Task 6 (Haumea) | 728 | +18 |
| 922a802 | Task 5 (Nacharbeit, `brown-butler-2018`) | 729 | +1 |
| 815aafa | Task 7 (Makemake) | 741 | +12 |
| e7e50ba | Task 6 (Nacharbeit) | 741 | 0 |
| 147332e | Task 9 (Kirkwood) | 745 | +4 |
| 4b2aa73 | Task 7 (Nacharbeit) | 745 | 0 |
| 6f27363 | Task 8 (Zwergplaneten) | 753 | +8 |
| 655a8da | Task 9 (Nacharbeit) | 753 | 0 |
| 6b29321 | Task 10 (Szene) | 753 | 0 |
| d7c729b | Task 8 (Nacharbeit) | 753 | 0 |
| a709ad5 | Task 10 (Nacharbeit) | 753 | 0 |

Je Task summiert: Task 1–3 = 0, Task 4 = 21, Task 5 = 10 (9+1), Task 6 = 18, Task 7 = 12,
Task 8 = 8, Task 9 = 4, Task 10 = 0. 680+21+10+18+12+8+4+0 = 753, deckt sich mit der eigenen
Nachzählung am Endstand. **Keine Abweichung zwischen einer Berichtszahl und der eigenen
Nachzählung gefunden.**

### Quellenkarten (`src/data/quellen.ts`)

Ausgangsstand **84** (`git show a3dc7d1:src/data/quellen.ts | grep -cE "^\s+id: '"`). Endstand
**88** (`grep -cE "^\s+id: '" src/data/quellen.ts`, selbst nachgezählt). Vier neue Karten (drei
mehr als geplant, je mit eigenem Ruling im Ledger begründet): `nasa-haumea` (Task 6, Haumea hatte
als einziger der vier keine eigene Übersichtskarte), `wikipedia-en-kirkwood-gap` (Task 9),
`wikipedia-en-asteroid-belt` (Task 10) und `jpl-dawn-missionsende` (Task 10, Nacharbeit — Beleg
für das tatsächliche Missionsende, siehe §4).

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog, 753 Einträge), Zeitpunkt vor und nach dem
Kommando per Dateizeitstempel des Log gemessen (Start 11:57:32,92 Uhr, Ende 12:10:17,16 Uhr):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 753 von 753 Einträgen
[… 870 Zeilen, davon 858 „ok" …]
cgpm-2022            crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
greaves-2021         crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
korablev-2019        crossref  warnung  Crossref führt die Körperschaft „The ACS and NOMAD
                                         Science Teams" zuerst, Erstautor „Korablev, O." steht
                                         unter den weiteren Autoren
mckinnon-2016        crossref  warnung  Crossref führt die Körperschaft „the New Horizons
                                         Geology, Geophysics and Imaging Theme Team" zuerst,
                                         Erstautor „McKinnon, W. B." steht unter den weiteren
                                         Autoren
sanchez-lavega-2011   crossref  warnung  Crossref führt die Körperschaft „The International
                                          Outer Planet Watch (IOPW) Team" zuerst, Erstautor
                                          „Sánchez-Lavega, A." steht unter den weiteren Autoren
trujillo-2007        crossref  fehler   Titel stimmt zu 75 % überein: „The Surface of 2003
                                         EL<sub>61</sub>in the Near‐Infrared"

858 ok, 5 Warnungen, 1 Fehler
```

**Laufzeit:** rund 764 Sekunden (12:44 min; Ausgangsstand 682 s bei 680 Einträgen nach 4d-9 —
plausibler Anstieg bei 73 zusätzlichen Einträgen, +12 % Katalog gegen +12 % Laufzeit). Keine
Zeile mit `429` (`grep -c 429` auf der vollständigen Ausgabe: 0 Treffer) — kein transienter
Netzfehler in diesem Lauf, Ruling zum Vorgehen bei `--nur`-Nachprüfung kam nicht zur Anwendung.

**Ein bekannter Falsch-Fehler:** `trujillo-2007` — Crossref führt den Titel mit
`<sub>61</sub>`-Markup und geschütztem Bindestrich, der Katalogeintrag die ASCII-Fassung „The
Surface of 2003 EL61 in the Near-Infrared"; der Titelvergleich des Prüfskripts erreicht dadurch
nur 75 % Übereinstimmung. DOI (10.1086/509861), Erstautor, Jahr, Zeitschrift, Band und Seiten
sind über Crossref unabhängig bestätigt (Task-6-Bericht); dieselbe, bereits im Prüfskript-Befund
der Abnahme 4d-x dokumentierte Grenze des Titelvergleichs bei `<sub>`-Tags.

**Fünf Warnungen, alle bereits aus früheren Etappen bekannt und dort begründet:**

- `cgpm-2022` — Crossref führt die 28. Generalkonferenz für Maß und Gewicht als Körperschaft,
  nicht als Person (seit Etappe 2 akzeptiertes Verhalten).
- `greaves-2021` — Crossref führt das Online-Erstjahr (2020), der Katalog das Druckjahr der
  Ausgabe (2021); in Etappe 4 (Venus) so begründet.
- `korablev-2019` — Crossref führt die Kollektivbezeichnung zuerst, die tatsächliche
  Nature-Kopfzeile Korablev als Erstautor (Muster seit Etappe 4 bekannt).
- `sanchez-lavega-2011` — dasselbe Muster, seit Etappe 4d-6 bekannt.
- `mckinnon-2016` — Crossref führt die New-Horizons-Theme-Team-Körperschaft vor dem Erstautor
  McKinnon; bereits in der Abnahme 4d-9 §3 als unkritisch bestätigt.

Keiner der 73 neuen Katalogeinträge dieser Etappe erzeugt eine neue, bisher unbekannte Warnung
oder einen echten Fehler.

## 4. Fachprüfung

Zahlen aus den `task-N-report.md`/`task-N-fachpruefung.md`-Dateien, gegengerechnet gegen die
aktuellen Dateien im Arbeitsbaum (`wc -w` auf `src/data/texte/<sprache>/hochschule/…`,
Zeilenzählung der Beleglisten-Tabellen über `grep -cE '^\|'` minus Kopf- und Trennzeile, je sechs
Zellen je Zeile per Skript gegengeprüft — 0 Fehler, 0 leere Prüfzellen bei allen sieben neuen
Beleglisten sowie den beiden nachgeführten). Je Text genau eine Fachprüfung, höchstens eine
Nacharbeit (Ruling 3).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| Task 1 (Achsneigung/Pluto, Nachführung) | — | — | — | 0 | keine Fachprüfung (Ruling 3), Controller-Diffprüfung: NTRS-Abstract selbst geöffnet, Zellen ok | keine |
| Task 3 (Szenentexte ferne-sonne, Nachführung) | 902/954 (Hochschule, nach Nacharbeit) | — | — | 0 | keine Fachprüfung (Ruling 3), Controller-Diffprüfung: 2 Befunde (Belichtungsbezug π; Widerspruch Einleitung/Modellgrenzen) → Nacharbeit | keine offen |
| `objekt-ceres` (Ceres) | 2998 / 3300 | 58 | 26 | 21 | 4/4 (Kepler-Gegenprobe 0,003→0,0004 %; Datenblock 0,0004→0,002 %; Ahuna Mons 210±30 Myr statt „unter 1 Mrd. Jahre"; Prozesssprache in der Belegliste) | 2 offen: hydrostatische Abweichung und Apsidendrehung nur über Sekundärquelle belegt, keine Magnetfeld-Obergrenze gefunden — §7/§8 |
| `objekt-eris` (Eris) | 2049 / 2209 | 48 | 12 | 10 | 2/2 (Q/k₂=3200 fälschlich der frequenzabhängigen statt der konstanten Dämpfung zugeschrieben; Dysnomia-Radius 350 km fälschlich Brown und Butler 2023 statt 2018 zugeschrieben) | keine offen (2 Hinweise ohne Änderungsbedarf: Quellen-Uneinheitlichkeit 0,0085/0,0084; `targetExposure`-Faktor nur plausibilisiert) |
| `objekt-haumea` (Haumea) | 2305 / 2504 | 50 | 19 | 18 | 2/2 (Schlichting und Sari 2009 verlangt eine zweite, unabhängige Kollision — Text behauptete das Gegenteil; Verweissatz `thema:zwergplaneten` ohne Deckung im Gymnasialersatz, auf `thema:bahnelemente` umgestellt) | keine offen (2 Hinweise mit Fundstellenkorrektur behoben) |
| `objekt-makemake` (Makemake) | 2361 / 2561 | 50 | 14 | 12 | 1/1 (D/H-Wert 3,98·10⁻⁴ fälschlich der Gasphase statt dem Methaneis zugeschrieben) | keine offen (2 Hinweise umgesetzt: Radiusherleitung, Verweissatz „Achsneigung" auf Methodik statt Zahlen präzisiert; 2 Hinweise ohne Änderungsbedarf) |
| `thema-zwergplaneten` (Zwergplaneten) | 2840 / 3130 | 49 | 13 | 8 | 4/4 (Λ statt λ beim Streuparameter; Bierson und Nimmo 2019 „14 von 17" statt „15 von 18"; Ceres fälschlich in die Albedo-Abweichungs-Aussage einbezogen; Verweissatz `thema:achsneigung` ohne Deckung für Makemakes Kippwinkel) | keine offen (1 Hinweis zur Haumea-Tabellenzeile mit Erläuterung behoben) |
| `thema-kirkwood-luecken` (Kirkwood-Lücken) | 1939 / 2117 | 24 | 7 | 4 | 0/0 | keine offen (3 Hinweise umgesetzt: Fundstelle Hildas/Trojaner präzisiert, 2 fehlende Belegzeilen für Entdeckerzuschreibung und Lückenlagen ergänzt) |
| `szene-ceres-guertel` (Szene) | 902 / 1031 | 27 | 1 | 0 | 2/2 (Dawn-Missionsende „Oktober 2018" mit Russell et al. 2016 unbelegt — Beleg erschien 2,5 Jahre vor dem Datum, neue Karte `jpl-dawn-missionsende`, auch in `objekt-ceres` berichtigt; Begriff „Streuungsfaktor" DE kollidierte mit „Streufaktor" für die Kameradistanz, auf „Kompressionsexponent" geändert) | keine offen (1 Hinweis zur Rundung 130→140 umgesetzt) |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und Trennzeile) unter
`docs/belege/hochschule/`, über `grep -cE '^\|'` minus 2 gezählt und mit den Task-Berichten
deckungsgleich. Zitate sind die im Browser gemessenen, eindeutigen Literaturkarten je Kombination
(§5.1), deckungsgleich mit den `literatur:`-Kennungen in beiden Sprachfassungen
(`zitateGleichKarten` in beiden Sprachen `true`). Wortzahlen `wc -w` auf den aktuellen Dateien in
`src/data/texte/<sprache>/hochschule/` selbst gemessen — **stimmen bei allen sieben Texten exakt
mit den zuletzt in den Berichten genannten Zahlen überein**, alle innerhalb der Richtwerte (Ruling
4) beziehungsweise deren Obergrenze (Ruling 15): Ceres 2998/3300 (Richtwert 1500–3500), Eris/
Haumea/Makemake zwischen 2049 und 2561 (Richtwert 1000–2000, Obergrenze 2667 — alle drei über dem
Richtwert, aber deutlich unter der Obergrenze, mit sachlicher Begründung in den Berichten:
Streitfragen mit eigenem Gewicht), Themen 1939–2840 (Richtwert 1500–4000), Szene 902/1031
(Richtwert 300–900/Obergrenze 1200 — Deutsch mit 902 Wörtern minimal über dem Richtwert, unter
der Obergrenze).

Modellzahlen aus den bereits fachgeprüften Texten (`thema-bahnelemente`, `thema-achsneigung`,
`thema-bezugssysteme`, `thema-ringe`, `thema-resonanzen`, `thema-entstehung`, `objekt-pluto`,
`objekt-charon`) wurden nach Ruling 8 gleichlautend übernommen (Kirkwood-Lückenlagen 2,50/2,82/
2,96/3,28 AE, Pluto-Schwerpunktversatz 2126 km, Achsneigungsformeln). Task 1 und Task 3 sind die
einzigen Stellen, an denen fachgeprüfte Texte in dieser Etappe bewusst geändert wurden (Ruling 3):
Task 1 übernimmt eine in 4d-9 an der Quelle geprüfte Aussage (Dobrovolskis und Harris 1983,
stabile Schwingung 102°–126° über rund 3 Mio. Jahre statt „chaotisch"), Task 3 rechnet die
Kamerazahlen der neuen `sichtlinie`-Geometrie nach (Kameraabstand 14 Neptunradien, Winkelabstand
Sonne–Neptun 10°–21°, Phasenwinkel 159°–170°, Belichtungsfaktoren 24/11 gegenüber π bei 1 AE).

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/`
→ 200), kein zweiter gestartet. `window.store.setState({ quality: { tier: 'high' } })` direkt
nach `browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung (Niveau Hochschule,
Panel eingehängt, `breiteRem: 40`). Szenenindizes am Array `src/data/scenes.ts` selbst
gegengeprüft (dynamischer Import `/Orrery/src/data/scenes.ts` im Browser): `ferne-sonne` = **3**,
`ceres-guertel` = **17** — decken sich mit den im Brief genannten Indizes.

### 5.1 Rundgang

Alle 20 Kombinationen angefahren (die sieben neuen Kennungen `ceres`, `eris`, `haumea`,
`makemake`, `zwergplaneten`, `kirkwood-luecken`, `ceres-guertel` sowie die drei in Task 1/3
geänderten `achsneigung`, `pluto`, `ferne-sonne`, je in Deutsch und Englisch): Körper über
`setInfo({thema:null})` + `setCamera({targetId, mode:'free'})`, Themen über
`setInfo({thema:'<id>'})`, Szenen über `setCinema({running:true, shuffle:false, nummer})` +
`setCamera({mode:'cinema'})`, nach 1,5 s Stabilisierung `setCinema({running:false})`,
`setTime({paused:true})`, `setUi({hidden:false})`, 200 ms Wartezeit vor der DOM-Messung. Auf den
Kopfwechsel gepollt (zwei aufeinanderfolgende gleiche Lesungen im Abstand von 50 ms), Hinweise
erst nach dem Auflösen des faulen Imports gewertet. `objekt:`/`thema:`-Verweise sind im DOM
`<button>`-Elemente, keine `<a>`-Elemente (bekannte Messfalle seit 4d-6, durchgehend ohne
Tag-Einschränkung `[data-verweis="…"]` verwendet).

**Kernkriterien, alle 20 Kombinationen:** `formelfehler` **0**, keine Hinweiszeile (insbesondere
keine `info.hochschuleFolgt`), `zitateGleichKarten` **true**.

**20 von 20 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `objekt:ceres` | Ceres | Ceres | 76 | 1 | 26 |
| `objekt:eris` | Eris | Eris | 72 | 1 | 12 |
| `objekt:haumea` | Haumea | Haumea | 70 | 1 | 19 |
| `objekt:makemake` | Makemake | Makemake | 91 | 1 | 14 |
| `objekt:pluto` | Pluto | Pluto | 55 | 1 | 26 |
| `thema:zwergplaneten` | Zwergplaneten | Dwarf planets | 60 | 2 | 13 |
| `thema:kirkwood-luecken` | Kirkwood-Lücken | Kirkwood gaps | 23 | 1 | 7 |
| `thema:achsneigung` | Achsneigung | Axial tilt | 51 | 1 | 23 |
| `szene:ceres-guertel` (Nr. 17) | Szene: Ceres im Asteroidengürtel | Scene: Ceres in the asteroid belt | 35 | 0 | 1 |
| `szene:ferne-sonne` (Nr. 3) | Szene: Von Neptun zur fernen Sonne | Scene: From Neptune to the distant Sun | 14 | 0 | 2 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (in beiden Läufen gemessen). **Eine
gefundene DE/EN-Asymmetrie außerhalb der Kernkriterien:** `thema-kirkwood-luecken` verlinkt in
der Einleitung nur in der deutschen Fassung „[Jupiters](objekt:jupiter)" als Verweis; die
englische Fassung schreibt an derselben Stelle „Jupiter's“ als reinen Fließtext ohne Verweis
(`grep -n "objekt:jupiter"` bestätigt: nur in der deutschen Datei, Zeile 7). Beide Sätze sagen
inhaltlich dasselbe, nur die Verlinkung fehlt in der englischen Fassung — kleiner Befund für §7,
kein Formel- oder Sachfehler.

**Klicktest je Verweisart:** Je Kombination wurde von jeder der fünf Verweisarten (`objekt`,
`thema`, `szene`, `quelle`, `literatur`) das erste Vorkommen über `[data-verweis^="<art>:"]`
ermittelt, per `element.click()` ausgelöst und die Wirkung gegen die Tabelle im Brief geprüft
(`objekt` → `camera.targetId` nach 1,7 s Wartezeit; `thema` → `ui.info.thema`; `szene` →
`cinema.nummer` gegen den erwarteten Index samt `camera.mode==='cinema'`, danach Kino explizit
gestoppt; `quelle`/`literatur` → Kartenklasse enthält `border-sky-300`, Klick und Prüfung in
einem `browser_evaluate`, mit 300 ms Wartezeit vor der Prüfung); die Kombination wurde vor jedem
Einzeltest frisch aufgebaut.

10 Kennungen × 2 Sprachen × 5 Arten = 100 Einzeltests. 22 davon ohne Vorkommen (kein Befund, per
Verweisliste vorab bestätigt): `objekt` fehlt nur bei `haumea` (2), `szene` fehlt bei `eris`,
`haumea`, `makemake`, `zwergplaneten`, `ceres-guertel`, `ferne-sonne` (12), `quelle` fehlt bei
`eris`, `makemake`, `pluto`, `zwergplaneten` (8) — je in beiden Sprachen gleich.

**Ergebnis: 78 von 78 anwendbaren Klicktests trafen.** `objekt` → `camera.targetId` stimmt in
allen Fällen; `thema` → `ui.info.thema` stimmt in allen 20 Fällen; `szene` → `cinema.nummer` traf
den erwarteten Index samt `camera.mode==='cinema'` in allen 8 anwendbaren Fällen (`ceres`,
`pluto`, `kirkwood-luecken`, `achsneigung`, je de/en); `quelle`/`literatur` → Karte trug
`border-sky-300` in allen anwendbaren Fällen (12 bzw. 20).

### 5.2 Ersatz entfällt

Nach Ruling 20: drei Paare je Sprache (sechs Messungen), Zeilennummern vorher per `grep -n`
bestätigt (DE Z. 225/EN Z. 219 `thema-ringe` → `objekt:haumea`; DE Z. 121/EN Z. 119
`thema-resonanzen` → `thema:kirkwood-luecken`; DE Z. 19/EN Z. 19 `objekt-ceres` →
`szene:ceres-guertel`), Wartezeit bis zum Kopfwechsel (`performance.now()`, Zeit vom Klick bis
zum ersten Poll mit passendem Kopf):

| Messung | Kopf vorher | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|---|
| `thema:ringe` → `objekt:haumea` (de) | Ringe | Haumea | keine | 60 ms |
| `thema:resonanzen` → `thema:kirkwood-luecken` (de) | Bahnresonanzen | Kirkwood-Lücken | keine | 12 ms |
| `objekt:ceres` → `szene:ceres-guertel` (de) | Ceres | Szene: Ceres im Asteroidengürtel | keine | 0 ms |
| `thema:ringe` → `objekt:haumea` (en) | Rings | Haumea | keine | 51 ms |
| `thema:resonanzen` → `thema:kirkwood-luecken` (en) | Orbital resonances | Kirkwood gaps | keine | 11 ms |
| `objekt:ceres` → `szene:ceres-guertel` (en) | Ceres | Scene: Ceres in the asteroid belt | keine | 0 ms |

Alle sechs Messungen ohne Hinweiszeile: Die vorher an `thema:ringe`, `thema:resonanzen` bzw.
`objekt:ceres` gezeigte Ersatz-Hinweiszeile für Haumea, die Kirkwood-Lücken beziehungsweise die
Szene ist entfallen, weil diese Etappe die entsprechenden Hochschultexte liefert. Bei der dritten
Messung (c) lag die Wartezeit bei 0 ms, weil der Kopf beim ersten Poll nach der
Kinostart-Stabilisierung (1,5 s) und dem 200-ms-Warten bereits umgestellt war.

### 5.3 Szene „Von Neptun zur fernen Sonne" (Standard-`pauseOnInput`)

Wiederholung der Pixelmessung aus Task 2 Schritt 7 mit Standardwert `pauseOnInput: true` und
Preset `schaubild`: Kino über den Store gestartet (`setCinema({running:true, shuffle:false,
nummer:3, pauseOnInput:true})`, `setCamera({mode:'cinema'})`), 3 s Ruhe im Browser
(`performance.now()`-Schleife), danach eine echte Taste (`browser_press_key`, Leertaste) zum
Anhalten — `noteUserInput()` (`src/ui/cinemaControl.ts`) setzt daraufhin `cinema.running: false`,
die Kamera bleibt im Kino-Modus stehen (bestätigt: `cinema.running=false`, `camera.mode='cinema'`,
`time.paused=true` direkt nach dem Tastendruck). `setUi({hidden:true})`, 200 ms Wartezeit,
Screenshot bei 2560×1440 (dpr 1, wie in Task 2).

**Erste Aufnahme verworfen:** Zwischen Szenenstart und Tastendruck lagen durch die vorangehende
Analyse mehrere Minuten reale Zeit; in dieser Zeit lief der Kino-Idle-Mechanismus
(`resumeIfIdle`, `idleResumeSec: 30`) mehrfach weiter und hatte auf Szene 9 vorgerückt. Die
Messung wurde mit einer eng getakteten Abfolge (Setup → 3 s Warten → sofortiger Tastendruck →
sofortiger Screenshot, ohne Zwischenschritte) wiederholt; danach bestätigt `cinema.nummer === 3`
zum Zeitpunkt des Screenshots.

Pixelmessung mit Python 3.12 (Pillow, numpy) auf dem Screenshot. Helligkeit als Maximum der drei
Farbkanäle gemessen (`max(R,G,B)`, wie Task 2 selbst anhand der Referenzwerte 153/247
rekonstruierbar — mit dieser Definition stimmen Füllmedian und Maximum exakt mit den in Task 2
gemessenen Werten überein, ein einfacher RGB-Mittelwert ergäbe abweichende, nicht vergleichbare
Zahlen). Neptun-Scheibe über Spalten mit langer zusammenhängender blaudominanter Lauflänge
segmentiert (Orbitlinien kreuzen die Scheibe im Bild als dünne Linien und mussten von der
kreisförmigen Scheibe getrennt werden):

| Größe | Diese Messung (schaubild, Standard-`pauseOnInput`) | Task 2 (schaubild) | Abweichung |
|---|---|---|---|
| Neptunradius (px) | 83,5 | 83,62 | 0,1 % |
| θ (Winkelabstand Sonne–Neptun, aus Pixeln) | 13,24° | 13,10°–13,19° | im Rahmen der Streuung über die Ziehung |
| Füllmedian der Scheibe | 154/255 | 153/255 | 0,7 % |
| Maximum in der Scheibe | 247/255 | 247/255 | 0 % |
| Sichelpixel (> Hintergrund+10, geometrische Kreisfläche) | 21 437/21 903 = 97,87 % | 21 700/21 972 = 98,8 % | 0,94 % (relativ) |

**Kriterium „Sonne vollständig im Bild und nicht von Neptun verdeckt": erfüllt.** Sonnenkern
(Helligkeit > 200) liegt 386,6 px vom Neptun-Zentrum entfernt, deutlich außerhalb der
Neptun-Scheibe (Radius 83,5 px), Sonnenpeak erreicht 255/255, keine Überlappung der beiden
Bereiche, beide Körper vollständig innerhalb der Bildränder (2560×1440).

**Kriterium „Sichelpixel wie in Task 2": erfüllt**, Abweichung 0,94 % relativ (154 statt 153
Füllmedian, 97,87 % statt 98,8 % Sichelanteil) — plausibel durch die andere Ziehung von Azimut/
Elevation/Zeitpunkt bei dieser Messung gegenüber Task 2, keine neue Auffälligkeit. Screenshot und
Skripte wurden nach der Messung gelöscht (`git status --short` danach leer).

### 5.4 Konsole

`browser_console_messages` (seit dem Navigate, `all: true`): **0 Fehler, 0 Warnungen** über die
gesamte Sitzung (Navigate, 20er-Rundgang, 100 Klicktests, sechs Ersatz-Messungen, Szene
`ferne-sonne` zweimal aufgebaut). Nur die üblichen Vite-/React-Entwicklungsmeldungen auf
Debug-/Info-Ebene. Da keine Warnung auftrat, entfällt die im Brief vorgesehene Gegenprobe mit
echtem `browser_click` für die „Vollbild ohne Nutzergeste"-Warnung.

Playwright-Aufnahmen unter `.playwright-mcp/` und die Messskripte im Scratchpad wurden vor dem
Commit gelöscht, keine Skripte im Projektstamm angelegt; `git status --short` vor diesem Commit
zeigt ausschließlich die beiden zu ändernden Dateien.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge.

**Vorprüfung (Controller):**

- Der Task-Review des Skills wird bei Text-Tasks durch die im Plan vorgeschriebene Fachprüfung
  ersetzt (eine Runde), bei Task 1 und 3 durch die Controller-Diffprüfung, bei Task 2 durch einen
  Code-Prüfer — Projektregel geht der Skill-Vorgabe vor. Kosten bei Fehlurteil: ein übersehener
  Fehler, den die Schlussprüfung noch fangen kann.

**Umsetzung Task 2 (Szene „Von Neptun zur fernen Sonne"):**

- Startwerte (azimuthDeg 196, Versätze ±4/±3, distanceInRadii 14) unverändert übernommen — der
  RED→GREEN-Schritt wurde beim ersten Lauf grün, keine Anpassung nötig.
- Die Sonne erreicht bei „realistisch" (geometrischer Radius rund 0,25 px) in keinem Pixel
  Helligkeit ≥ 250 (gemessenes Maximum 247); bei „schaubild"/„kompakt" liegt der gemessene
  Schwerpunkt auf 2–3 px genau an der berechneten Position. Kein Codefehler — Frage an Jens, ob
  die Schwelle für „realistisch" gesenkt wird oder die Nichtmessbarkeit dort hingenommen wird.
- Die Neptun-„Sichel" (Pixel > Hintergrundmedian+10) umfasst in allen drei Presets 98,8–99,8 %
  der Scheibe, nicht eine schmale Sichel. Kein Codefehler dieses Tasks (Szene/Belichtungsziel
  arbeiten wie spezifiziert); Befund an Jens, Modell-/Renderingfrage außerhalb des Tasks.
- Die Szene bleibt mit `nightFill` 0,25; Neptun erscheint als graue Scheibe mit hellerer
  Sonnensichel; die Texte in Task 3 beschreiben genau das. Frage, ob die Szene die Füllung
  abschalten soll, geht an Jens. Kosten bei Fehlurteil: ein Store-/Szenenschalter in einem
  späteren Task.
- Sonne in „realistisch" unter 1 px (Maximum 247 statt ≥ 250) gilt nicht als Fehler — ein Punkt
  unter Pixelgröße erreicht die Schwelle nicht; die Texte nennen sie als Lichtpunkt.
- Re-Review der Fix-Runde 1 (reiner Kommentar-Diff) durch den Controller statt eines weiteren
  Prüfers. Kosten bei Fehlurteil: ein Kommentarfehler, den die Schlussprüfung sieht.

**Umsetzung Task 4 (Ceres), Fachprüfung — Prozesssprache:**

- Nacharbeit wartet, bis Task 5 fertig ist (ein Umsetzer gleichzeitig); Controller-Fund
  Prozesssprache in der Belegliste (Z. 17, 95) in dieselbe Nacharbeit aufgenommen.

**Umsetzung Task 5 (Eris):**

- `mousis-2025` als zusätzliche Gegenposition zur D/H-Deutung bleibt — Streitfragen verlangen
  Belege beider Seiten (Entwurf §6). Kosten bei Fehlurteil: ein Katalogeintrag, den die
  Fachprüfung prüft.

**Umsetzung Task 6 (Haumea):**

- Neue Quellenkarte `nasa-haumea` bleibt, obwohl der Plan nur `fuer`-Ergänzungen vorsah — Haumea
  hatte als einziger der vier keine eigene Übersichtskarte. Kosten bei Fehlurteil: eine Karte
  entfernen.
- `trujillo-2007` bleibt trotz Prüfskript-Fehler (bekannte Grenze des Titelvergleichs bei
  `<sub>`-Tags, DOI/Autoren/Band per Crossref bestätigt); Abnahme §3 weist ihn als bekannten
  Falsch-Fehler aus. Kosten bei Fehlurteil: Titel im Katalog anpassen oder Skript nachbessern.

**Umsetzung Task 7 (Makemake):**

- Plan-Ruling 26 greift nicht (Quelle für Makemakes Masse gefunden: Bamberger 2025, arXiv,
  unbegutachtet); die Masse gilt als belegt durch einen Vorabdruck und wird so gekennzeichnet.
  Kosten bei Fehlurteil: Masse/Dichte ändern sich mit der Begutachtung.

**Reihenfolge Task 8/9:**

- Task 9 (Kirkwood-Lücken) vor Task 8 (Zwergplaneten) — Task 9 braucht nur Task 4, Task 8 braucht
  die Makemake-Zahlen nach deren Nacharbeit; die Pipeline läuft so ohne Wartezeit weiter. Kosten
  bei Fehlurteil: keine, Reihenfolge ohne Abhängigkeit.

**Umsetzung Task 9 (Kirkwood-Lücken):**

- Quellenkarte `wikipedia-en-kirkwood-gap` bleibt — Fachthemen nutzen nach Entwurf-Nachtrag 4d-1
  Wikipedia-Karten als Übersicht für nicht zugängliche Primärarbeiten (Moons/Morbidelli 1995,
  Moons 1997). Kosten bei Fehlurteil: Karte entfernen, Aussage auf Primärliteratur stützen.

**Umsetzung Task 10 (Szene Ceres im Asteroidengürtel):**

- Quellenkarte `wikipedia-en-asteroid-belt` bleibt (wie die Kirkwood-Karte). Kosten bei
  Fehlurteil: Karte entfernen.
- Die Szenen-Nacharbeit berichtigt denselben Belegfehler (Dawn-Missionsende) auch in
  `objekt-ceres` de/en samt Belegzeile — gleiche Etappe, fachgeprüft erst Stunden zuvor, sonst
  widersprächen sich Szene und Körpertext. Kosten bei Fehlurteil: eine Satzänderung in einem
  fachgeprüften Text ohne eigene Prüfung.
- Quellenkarte `jpl-dawn-missionsende` bleibt — die JPL-Pressemitteilung trägt das Enddatum
  tragfähig, die NASA-Missionsseite nennt es nicht. Kosten bei Fehlurteil: Karte entfernen.
- Controller-Befund: JPL-Meldung per WebFetch geöffnet (verpasste Kontakte 31.10./1.11.2018,
  Hydrazin aufgebraucht) — trägt die im Text verwendete Aussage.

Die 26 Plan-Rulings selbst stehen vollständig im Plan
`docs/superpowers/plans/2026-09-23-phase4d-hochschule-etappe10.md` Abschnitt „Rulings" und sind
inhaltlich in §1 (Reihenfolge, Modelle, eine Prüfrunde), §2 (Richtwerte, Obergrenzen), §4
(Prüfpunkte, Ruling 8), §5 (Ersatz entfällt, Ruling 20) dieses Protokolls eingearbeitet; als
Themenliste in §8.

## 7. Bekannte Unschärfen

**DE/EN-Asymmetrie in `thema-kirkwood-luecken` (§5.1):** Die deutsche Einleitung verlinkt
„Jupiters" als `objekt:jupiter`, die englische Fassung schreibt „Jupiter's" ohne Verweis an
derselben Stelle. Beide Sätze sind sachlich identisch; nur die Verlinkung fehlt in Englisch.

**Zwei Aussagen nur über Sekundärquellen belegt (`objekt-ceres`, §4):** Die hydrostatische
Abweichung „einige Prozent" (Park et al. 2016, Originalseite nicht zugänglich) und die
Apsidendrehung „rund 54″/Jahr" (AstDyS-Sekundärquelle, als eigene Größenordnung gekennzeichnet).
Keine tragfähige Quelle für eine Magnetfeld-Obergrenze gefunden; der Text lässt die Frage offen.

**Datensatzkommentar-Fehlzuschreibungen, nicht geändert (`zwergplaneten.ts` ist keine
Ändern-Datei dieser Tasks, Texte stellen richtig):**

- Szakáts et al.: Kommentar nennt „2022, A&A 668, L1", tatsächlich 2023, A&A 669, L3.
- Eris' `massKg`-Kommentar: „abzüglich Dysnomias Anteil" ohne Zahl; rechnerisch fehlen
  8,6·10¹⁹ kg, unter Brown und Butlers (2023) späterer ALMA-Obergrenze.
- Haumeas dritte Halbachse aus Proudfoot et al. 2026 im Kommentar mit 518 statt 514 km
  angegeben (propagiert in `radiusKm` und die Dichte, rund 0,8 % Differenz).
- Makemakes Kippwinkelspanne „46°–78°" im Kommentar fälschlich Hromakina et al. (2019)
  zugeschrieben, tatsächliche Quelle Parker et al. (2016).
- Makemakes `rotationPeriodH`-Kommentar überzeichnet, was Kiss et al. (2024) „bestätigen".

**Code-/Datensatz-Befunde, in dieser Etappe selbst gefunden oder bestätigt (nicht behoben, Texte
beschreiben den Ist-Code, Ruling 7):**

- Haumea ist im Modell eine Kugel ohne Ring, ohne Monde und ohne dunklen Fleck (nur Teil der
  statischen „fictional"-Textur).
- Eris' und Makemakes Pol im Datensatz ist die eigene Bahnnormale, keine Messung
  (`achsneigungDeg` rund 0° bei beiden); Haumeas Pol dagegen ist real gemessen und liegt
  zufällig nahe der eigenen Bahnebene (`achsneigungDeg` rund 90°).
- Fehlende Zwergplanetenmonde im Katalog: Dysnomia (Eris), Hiʻiaka und Namaka (Haumea), MK 2
  (Makemake).
- Zwergplanetenbahnen als SBDB-Momentaufnahme ohne Elementraten (außer L̇).
- `A_JUPITER_AE = 5,2044` (`sim/belts.ts`) gegen 5,203 AE (`thema-resonanzen`) — verschiebt die
  Kirkwood-Lückenlagen um 0,0006–0,0009 AE, quantifiziert für Ceres und die Lücken selbst.
- Ceres: `rotationAtEpochDeg: 0` verfehlt den IAU-Nullmeridian (rund 170,3° nach Konopliv et al.
  2018) — ohne sichtbare Auswirkung wegen der „fictional"-Textur.
- Gürtel mit vorgegebenen, nicht dynamisch entstandenen Lücken; Kirkwood-Lücken sind im
  Sonnenabstand (der die Sichtbarkeit im Bild bestimmt) praktisch nicht von der Umgebung zu
  unterscheiden (rund 100 % Anteil), obwohl das Halbachsen-Dichteprofil, aus dem die Punktwolke
  gezogen wird, 12–34 % Restdichte im Kern zeigt — ein Szenentext darf die Lücken deshalb nicht
  als im Bild sichtbare Struktur beschreiben (in `szene-ceres-guertel` beachtet).
- `scenes.ts`-Kommentar zum Eintrag `ceres-guertel` behauptet ein bei Standardeinstellungen
  unerreichbares `dayLevel` 0,7555 (real höchstens rund 0,571 im Perihel) und eine nur teilweise
  zutreffende Aussage zum Bildinhalt („Titel trägt den Kontext"); beides im Text nicht
  übernommen.
- Makemakes Masse beruht weiterhin auf einem unbegutachteten Vorabdruck (Bamberger 2025); der
  Text kennzeichnet das ausdrücklich.
- Szene `ferne-sonne`: `nightFill` 0,25 hebt Neptuns Nachtseite auf ein gleichmäßiges Niveau von
  rund 153/255 an und verdeckt dadurch die physikalisch schmale Sichel (ohne Fülllicht rund
  1,8–2,0 % beleuchtete Fläche, mit Fülllicht optisch eine fast vollständig helle Scheibe mit
  kleiner dunkler Kappe). Kein Fehler im Code dieses Tasks; Modellfrage, ob `nightFill` für sehr
  ferne, dunkle Körper angepasst werden soll.
- Sonne in „realistisch" (Szene `ferne-sonne`) bleibt unter der Helligkeitsschwelle 250 (Maximum
  247, Punkt unter Pixelgröße).

**Quellen hinter Verlagssperren (HTTP 403/404/405 oder Bot-Sperre), je Text (aus den
Task-Berichten):**

- Ceres: Park et al. 2016 (Nature) selbst nicht zugänglich, über Sekundärquellen/ADS geprüft;
  mehrere Dawn-Arbeiten (Science, Nature) nur über Crossref-Metadaten plus Sekundärquelle.
- Eris: Nimmo und Brown 2023 (Science Advances) über die inhaltsgleiche LPSC-2024-Kurzfassung
  geprüft, Crossref-Metadaten des Hauptartikels unabhängig bestätigt.
- Haumea: mehrere Arbeiten (Ragozzine und Brown 2009, Proudfoot et al. 2024, Ragozzine und Brown
  2007, Schlichting und Sari 2009) nur über Sekundärquellen-Zusammenfassung zugänglich (Zeilen 9,
  28, 30, 38 der Belegliste als „Hinweis" statt „ok" geführt).
- Makemake: Ortiz et al. 2012 (Nature) nur über indexierte Zusammenfassung, kein Volltext.
- Kirkwood-Lücken: Moons und Morbidelli 1995, Moons 1997, Farinella et al. 1994, Vokrouhlický und
  Farinella 2000 bibliografisch bestätigt, aber nicht zugänglich — nicht zitiert, Rolle über
  `gladman-1997`, `bottke-2006` und `quelle:wikipedia-en-kirkwood-gap` abgedeckt.

**Methodik, für alle Texte gleich:** Node kann die echten Projektfunktionen ohne `tsx`/eine
endungslose Ladung nicht direkt ausführen (nur `data/literatur.ts` und `data/quellen.ts` sind
importfrei); alle „Nachrechnung am Code"-Zeilen der Beleglisten beruhen auf direkt aus den
Quelldateien gelesenen Formeln und Werten, von Hand oder per Skript im Scratchpad angewendet —
wie in der lokalen Projektanleitung dokumentiert.

## 8. Halt: Fragen an Jens

**Sichel/Sonnenschwelle der Szene „ferne-sonne" (§6/§7):** Zwei verwandte Fragen aus Task 2, in
§5.3 mit Standard-`pauseOnInput` bestätigt (0,94 % Abweichung zu Task 2, kein neuer Befund):
(1) Soll die Helligkeitsschwelle für die Sonnenmessung im Preset „realistisch" gesenkt werden,
oder bleibt die Nichtmessbarkeit eines subpixelgroßen Punkts hingenommen? (2) Soll `nightFill`
(aktuell 0,25, für die Erde kalibriert) für sehr ferne, dunkle Körper wie Neptun herabgesetzt
werden, damit die im Text beschriebene schmale Sichel auch im Bild als solche erkennbar wird,
statt als fast vollständig helle Scheibe mit kleiner dunkler Kappe? Vorschlag: beides zur
Kenntnis nehmen und offen lassen, bis ein eigener kleiner Task ansteht — keine der beiden Fragen
ist ein Fehler des Codes dieser Etappe.

**Zwei offene Belegfragen bei `objekt-ceres` (§4/§7):** Die hydrostatische Abweichung „einige
Prozent" (Park et al. 2016) und die Apsidendrehung „rund 54″/Jahr" stützen sich nur auf
Sekundärquellen, keine Magnetfeld-Obergrenze gefunden. Vorschlag: zur Kenntnis nehmen, an der
Quelle nachprüfen, sobald sie zugänglich wird.

**Makemakes Masse beruht auf einem unbegutachteten Vorabdruck (§4/§7):** Bamberger (2025,
arXiv:2509.05880) liefert eine tatsächliche, aber noch nicht begutachtete dynamische
Massenbestimmung; der Text kennzeichnet das. Vorschlag: zur Kenntnis nehmen, bei einer
begutachteten Fassung nachführen.

**DE/EN-Asymmetrie in `thema-kirkwood-luecken` (§5.1/§7):** Fehlender Verweis auf `objekt:jupiter`
in der englischen Einleitung (behoben, siehe Nacharbeit nach der Schlussprüfung). Vorschlag: kleinen Formfix vormerken (mechanisch, kleinstes
Modell).

**Fünfte Prüfskript-Warnung `mckinnon-2016` und der Falsch-Fehler `trujillo-2007` (§3):** Beide
bereits in früheren Etappen als unkritisch bestätigtes beziehungsweise dokumentiertes Muster.
Vorschlag: wie bisher akzeptieren.

**Datensatzkommentar-Fehlzuschreibungen, als Kandidaten für einen eigenen kleinen
Nachführungs-Task (§7):** Szakáts-Jahr/Band bei Eris, Makemakes Kippwinkelspanne fälschlich
Hromakina statt Parker zugeschrieben, Haumeas dritte Halbachse 518 statt 514 km, Eris'
`massKg`-Abzugswert unbeziffert. Alle in den jeweiligen Texten bereits richtiggestellt, nur die
Kommentare selbst nicht geändert (keine Ändern-Dateien dieser Tasks).

**Code-/Datensatz-Befunde, als Kandidaten für eigene Tasks (§7 für Details):**

- Haumea ohne Ring/Monde im Renderer (nur „fictional"-Textur); Eris'/Makemakes Pol als
  Bahnnormale statt Messung; fehlende Zwergplanetenmonde (Dysnomia, Hiʻiaka, Namaka, MK 2).
- `A_JUPITER_AE = 5,2044` gegen 5,203 AE (`thema-resonanzen`) — ein Datensatzwechsel wäre ein
  eigener Task.
- Ceres' `rotationAtEpochDeg: 0` verfehlt den IAU-Nullmeridian um rund 170° (ohne sichtbare
  Auswirkung wegen der „fictional"-Textur).
- Gürtel mit vorgegebenen, nicht dynamisch entstandenen Kirkwood-Lücken.
- `scenes.ts`-Kommentar zu `ceres-guertel` mit unerreichbarem `dayLevel`-Wert und einer nur
  teilweise zutreffenden Bildbeschreibung (Details siehe §7) — im Text nicht übernommen.
- Szene `ferne-sonne`: `nightFill` verdeckt die physikalische Sichel im Bild (siehe oben).
- Aus 4d-9 weiterhin offen: Fehlzuschreibung „chaotische Schiefe" in `thema-achsneigung.md` ist
  mit Task 1 dieser Etappe bereits erledigt (Jens' Entscheidung nach 4d-9 umgesetzt).

**Modelle (Plan-Ruling 2/Ledger):** Kein Kontingentlimit in dieser Etappe — alle Umsetzer-/
Nacharbeitsrunden, alle sieben Fachprüfungen, die Code-Prüfung von Task 2 und diese Abnahme
liefen durchgehend auf dem mittleren Modell (sonnet). Keine offene Frage, nur zur Kenntnis.

**26 Plan-Rulings** und die in §6 aufgeführten Umsetzungs-Rulings (von Jens noch nicht bestätigt,
vollständiger Wortlaut in
`docs/superpowers/plans/2026-09-23-phase4d-hochschule-etappe10.md` Abschnitt „Rulings" und in
diesem Protokoll §6). Als Themenliste: Freigabe durch die 4d-9-Entscheidung und „mach weiter"
samt Nachführungs-Tasks 1–3 (1); Modelle/eine Prüfrunde (2/3); Richtwerte Ceres 1500–3500,
Eris/Haumea/Makemake 1000–2000, Themen 1500–4000, Szene 300–900 (4); Reihenfolge Task 1/3 um
Task 2 herum, dann Ceres → Eris → Haumea → Makemake → Zwergplaneten → Kirkwood-Lücken →
Ceres-Gürtel (5); je ein Text-Task je Kennung, Szene braucht Task 4/8/9 (6); Datensatz-Befunde
nicht behoben außer Task 2 (7); Modellzahlen aus fachgeprüften Texten gleichlautend übernehmen
(8); kein eigener Verweis-Task (9); Tausendertrennung/Zahlenspannen (10); neun Prüfpunkte,
Prüfpunkt 9 bei Zielen ohne Hochschultext gegen den Gymnasialtext (11); keine
Formelsatz-Sichtprüfung ohne neuen TeX-Befehl, Sichtprüfung `ferne-sonne` Pflicht (12); Katalog
im Hauptbundle unter der 50-kB-Schwelle (13); Fast-Forward, Push erst nach Jens' Ja (14);
Wortzahl-Obergrenze ein Drittel über dem Richtwert (15); Katalogform wie 4d-4/4d-6 bis 4d-9 (16);
Quellenkarten als Angebot, keine Pflicht (17); Beleglisten-Nacharbeit mit Zellenkontrolle (18);
Schlussprüfung dient als Task-Prüfung der Abnahme (19); Ersatz entfällt über
`ringe`→`haumea`, `resonanzen`→`kirkwood-luecken`, `ceres`→`ceres-guertel` (20); Task-1-Umfang
(Achsneigung plus Einschub in `objekt-pluto`) (21); `ferne-sonne` auf Bahntyp `sichtlinie`
umgestellt, Belichtung folgt `blickzielVon` (22); Testgrenzen für Task 2 (23); erwartete schmale
Sichel von hinten beleuchtet (24); Plutos Einstufung folgt `objekt-pluto` (IAU 2006 mit
geophysikalischer Gegenposition als offene Frage) (25); unbelegte Datensatzwerte werden im Text
gekennzeichnet, nicht erfunden zitiert (26).

## Nacharbeit nach der Schlussprüfung

- Der englische Kirkwood-Text verlinkt nun wie der deutsche auf `objekt:jupiter` in der Einleitung (Befund aus §5.1/§7 behoben).
- Schlusssatz zur Wort- und Trailerprüfung: Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen Projektanleitung beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.

## Entscheidungen von Jens (23.09.2026)

Push von master nach origin freigegeben („ja", ed8b069 gepusht). Zu §6 und §8 („Rulings
bestätigt, §8 zur Kenntnis"): Die 26 Plan-Rulings und die Rulings in §6 gelten als bestätigt;
die Punkte aus §8 sind zur Kenntnis genommen und bleiben ohne eigenen Task. Etappe 4d-11 ist
noch nicht freigegeben.

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen Projektanleitung
beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.
