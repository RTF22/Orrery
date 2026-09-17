# Abnahme Phase 4d Etappe 1 „Gerüst und Pilot"

## 1. Umfang

Branch `hochschule-1` (von `master` 6d68b19), HEAD zu Beginn dieses Tasks `1918ee2`. Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, Plan
`.superpowers/sdd/2026-09-17-phase4d-hochschule-etappe1/` (13 Tasks, Ledger `progress.md`).

Commits der Etappe (neu gegenüber `master`, älteste zuerst):

```
73021d9 Markdown-Parser: Formeln im Satz und als Block, Pipe-Tabellen
fea3ab6 Infopanel: Übersetzer einer TeX-Teilmenge in einen MathML-Datenbaum
702f424 Markdown-Parser: maskiertes Dollarzeichen über die Zahl der Backslashes erkennen
cc6ef07 Infopanel: Formeln als MathML und Tabellen ausgeben
9f096d0 Literaturkatalog und Verweis literatur:, Hervorhebung über Schlüssel
06bda46 Infopanel: Literaturkarten zu Hochschultexten
cfe0766 Prüfskript: Literaturkatalog gegen Crossref und arXiv abgleichen
2ee9f04 Infopanel: Parameter der Hervorhebung eindeutig benennen
fd2ab7e Themenkatalog: sechs Fachthemen der Hochschule mit Titeln und Quellenkarten
40f1478 Infopanel: Hinweis „nur Hochschule", Hinweis-Tests unabhängig von echten Hochschultexten
2ad8450 Dateitest: Formeln, Tabellen, Zitate, Stand-Zeile, Gliederung und Sprachzwillinge der Hochschultexte
bc16f3a Prüfskript: Spalten in Entwurfsreihenfolge, XML-Entitäten aus arXiv auflösen
31d1aa5 Hochschultext Bahnelemente mit Belegliste (Pilot)
a21082a Hochschultext Bahnelemente: Nacharbeit nach der Fachprüfung
69b8fd4 Hochschultext Erde mit Belegliste (Pilot)
d0b1722 Hochschultext Szene Mondfinsternis mit Belegliste (Pilot)
dc36107 Hochschultext Bahnelemente: Herkunft der Mondraten und Planetenbegriff berichtigt
4e5d336 Hochschultext Erde: Nacharbeit nach der Fachprüfung
1c4677b Belegliste thema-bahnelemente: Fachprüfung abgeschlossen
7accb28 Hochschultext Szene Mondfinsternis: Nacharbeit nach der Fachprüfung
f85613b Hochschultext Erde: zweite Nacharbeit nach der Fachprüfung
fabffd6 Hochschultext Erde: Zitat zum Nullpunkt der Zeitangaben präzisiert
f45ee17 Hochschultext Szene Mondfinsternis: zweite Nacharbeit nach der Fachprüfung
a047080 Belegliste objekt-earth: Fachprüfung abgeschlossen
1918ee2 Belegliste szene-mondfinsternis: Fachprüfung abgeschlossen
```

25 Commits. Inhalt: Formelsatz (TeX-Teilmenge → MathML, eigener Übersetzer ohne Bibliothek),
Tabellenausgabe, Literaturkatalog mit Verweis `literatur:` und Literaturkarten, Prüfskript
`npm run literatur:pruefen`, sechs Fachthemen-Einträge (noch ohne Text), Hinweis „nur
Hochschule", Dateitests, und drei Pilottexte mit Beleglisten und Fachprüfung (Bahnelemente,
Erde, Szene Mondfinsternis), jeweils mit ein bis drei Nacharbeitsrunden.

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
      Tests  3532 passed (3532)
```

Herleitung je Task (Zuwachs an vitest-`Tests`, nicht an Testdateien), aus den Berichten
`task-N-report.md` nachgerechnet, nicht aus den Vorab-Schätzungen der Planung übernommen:

| Task (Commit) | Zuwachs | Quelle |
|---|---:|---|
| Ausgangsstand (master vor 4d-1, Tag `v0.4.0`) | 2905 | Stand-Notiz der Etappe 4c |
| Task 1, erste Fassung (`73021d9`) | +10 | „genau die im Brief angekündigten 10 neuen Fälle" (`task-1-report.md:59`) |
| Task 2 (`fea3ab6`) | +14 | „14 Fälle bestanden beim ersten Durchlauf" (`task-2-report.md:42`) |
| Task 1, Nacharbeit Backslash-Parität (`702f424`) | +1 | `markdownParser.test.ts` 20 → 21 (`task-1-report.md:186,198`) |
| Task 3 (`cc6ef07`) | +2 | „die zwei Testfälle aus dem Brief" in `Markdown.test.tsx`, 6 → 8 (`task-3-report.md:10,23`) |
| Task 4, erste Fassung (`9f096d0`) | +7 | „5 neue Fälle in `literatur.test.ts`, 1 neuer Fall in `verweise.literatur.test.ts`, 1 neuer Fall in `Markdown.literatur.test.tsx`", dazu 2 ersetzte Fälle ohne Zuwachs (`task-4-report.md:52`) |
| Task 5 (`06bda46`) | +9 | nicht als Summenzeile im Bericht genannt; durch Differenz zum nächsten Ankerpunkt bestimmt (siehe unten) |
| Task 6, erste Fassung (`cfe0766`) | +10 | „10 Fälle grün" in `literaturVergleich.test.ts`; die im selben Lauf sichtbaren 9 Fälle aus `deploy.test.ts` sind vorbestehend, nicht neu (`task-6-report.md:44–47,60`) |

**Anker 1:** `npm test` nach Task 6 — 90 Testdateien, **2958** Tests (`task-6-report.md:111`).
2905 + 10 + 14 + 1 + 2 + 7 + 9 + 10 = 2958 — stimmt exakt; Task 5 ist damit über die Differenz
bestimmt (kein Rest).

| Task 4, Nacharbeit Umbenennung (`2ee9f04`) | +0 | reine Parameterumbenennung, „sonst nichts ändern" (`task-4-report.md:92`) |
| Task 7 (`fd2ab7e`) | +0 | bestehender Fall in `themen.test.ts` inhaltlich erweitert statt ergänzt (3 → 3 Fälle); der Quellen-Abdeckungstest deckt die 14 neuen Quellen automatisch mit ab, ohne die Fallzahl zu erhöhen (`task-7-report.md:27–40`) |
| Task 8 (`40f1478`) | +3 | „1 Fall in `index.test.ts`, 3 Fälle in `InfoPanel.hinweise.test.tsx`; 1 Fall … entfernt" (`task-8-report.md:60–61`) |
| Task 9 (`2ad8450`) | +506 | `data/texte/dateien.test.ts`: 1766 → 2272 (252 Dateien × 9 + 4 Sammelfälle) (`task-9-report.md:38–42`) |
| Task 6, Nacharbeit XML-Entitäten (`bc16f3a`) | +1 | „nur der neue Fall scheitert, die zehn bestehenden bleiben grün" in `literaturVergleich.test.ts`, 10 → 11 (`task-6-report.md:198–201`) |
| Task 10, erste Fassung (`31d1aa5`) | +20 | „2 Dateien × 10" (`task-10-brief.md:18`); „davon 20 neue Fälle" (`task-10-report.md:150`) |

**Anker 2:** `npm test` nach Task 10, erste Fassung — **3488** Tests (`task-10-report.md:153`).
2958 + 0 + 0 + 3 + 506 + 1 + 20 = 3488 — stimmt exakt, kein Rest.

| Task 11, erste Fassung (`69b8fd4`) | +22 | „2 Dateien × 11" (`task-11-brief.md:19`); „vorher 2490, neu 22" (`task-11-report.md:187`) |

**Anker 3:** `npm test` nach Task 11, erste Fassung — **3510** Tests (`task-11-report.md:189`).
3488 + 22 = 3510 — stimmt exakt.

| Task 12, erste Fassung (`d0b1722`) | +22 | „2 Dateien × 11" (`task-12-brief.md:18`) |

**Anker 4:** `npm test` nach Task 12, erste Fassung — **3532** Tests (`task-12-report.md:135`).
3510 + 22 = 3532 — stimmt exakt.

| Restliche Nacharbeitsrunden bis HEAD (`dc36107`, `4e5d336`, `f85613b`, `fabffd6`, `7accb28`, `f45ee17`, drei Beleglisten-Commits) | ±0 | reine Text- und Belegliste-Änderungen (`.md`), keine neuen Testdateien oder -fälle |

**Ergebnis:** 2905 + 10 + 14 + 1 + 2 + 7 + 9 + 10 + 0 + 0 + 3 + 506 + 1 + 20 + 22 + 22 + 0 =
**3532**, deckungsgleich mit der gemessenen Endzahl. Kein Posten bleibt unaufgeschlüsselt; die
einzige nicht direkt aus einer Berichtszeile abgelesene, sondern über die Suite-Differenz
bestimmte Zahl ist Task 5 (+9), was mit der Vorab-Schätzung der Planung (§Vorabprüfung,
„3+4+2 Fälle") übereinstimmt, ohne dass der Bericht selbst eine Summe nennt.

```
npm run build
```
```
✓ built in 703ms
(!) Some chunks are larger than 500 kB after minification. Consider: …
```
Nur der bekannte Hinweis zur Chunkgröße (`index-*.js`, 1 243,72 kB / gzip 331,89 kB),
unverändert aus früheren Etappen.

```
npm run literatur:pruefen
```
Siehe Abschnitt 3 — 0 Fehler.

## 3. Prüfskript

Vollständige Ausgabe (ein Lauf, ohne Wiederholung nötig — `herald-2014` antwortete mit HTTP
200):

```
Prüfe 51 von 51 Einträgen
agnew-2024                   crossref  ok       Erstautor, Jahr und Titel stimmen
archinal-2018                crossref  ok       Erstautor, Jahr und Titel stimmen
barboni-2017                 crossref  ok       Erstautor, Jahr und Titel stimmen
bau-2021                     crossref  ok       Erstautor, Jahr und Titel stimmen
bau-2021                     arxiv     ok       Erstautor und Titel stimmen
beggan-2026                  crossref  ok       Erstautor, Jahr und Titel stimmen
biggin-2015                  crossref  ok       Erstautor, Jahr und Titel stimmen
bono-2019                    crossref  ok       Erstautor, Jahr und Titel stimmen
bouvier-2010                 crossref  ok       Erstautor, Jahr und Titel stimmen
broucke-1972                 crossref  ok       Erstautor, Jahr und Titel stimmen
cano-2020                    crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2001                   crossref  ok       Erstautor, Jahr und Titel stimmen
canup-2012                   crossref  ok       Erstautor, Jahr und Titel stimmen
charles-1997                 crossref  ok       Erstautor, Jahr und Titel stimmen
chen-2015                    crossref  ok       Erstautor, Jahr und Titel stimmen
connelly-2012                crossref  ok       Erstautor, Jahr und Titel stimmen
cuk-2012                     crossref  ok       Erstautor, Jahr und Titel stimmen
dziewonski-1981              crossref  ok       Erstautor, Jahr und Titel stimmen
elipe-2017                   crossref  ok       Erstautor, Jahr und Titel stimmen
espenak-2009                 url       ok       HTTP 200
fischer-2024                 crossref  ok       Erstautor, Jahr und Titel stimmen
goessling-2025                crossref  ok       Erstautor, Jahr und Titel stimmen
guillet-2023                 crossref  ok       Erstautor, Jahr und Titel stimmen
herald-2014                  url       ok       HTTP 200
herwartz-2014                crossref  ok       Erstautor, Jahr und Titel stimmen
hilton-2006                  crossref  ok       Erstautor, Jahr und Titel stimmen
hirose-2021                  crossref  ok       Erstautor, Jahr und Titel stimmen
kloss-2026                   crossref  ok       Erstautor, Jahr und Titel stimmen
konopkova-2016               crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-1989                  crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-1993                  crossref  ok       Erstautor, Jahr und Titel stimmen
laskar-2004                  crossref  ok       Erstautor, Jahr und Titel stimmen
li-2014                      crossref  ok       Erstautor, Jahr und Titel stimmen
li-2014                      arxiv     ok       Erstautor und Titel stimmen
maurice-2020                 crossref  ok       Erstautor, Jahr und Titel stimmen
morrison-2021                crossref  ok       Erstautor, Jahr und Titel stimmen
murray-2000                  crossref  ok       Erstautor, Jahr und Titel stimmen
ohta-2016                    crossref  ok       Erstautor, Jahr und Titel stimmen
palin-2020                   crossref  ok       Erstautor, Jahr und Titel stimmen
park-2021                    crossref  ok       Erstautor, Jahr und Titel stimmen
petit-2010                   url       ok       HTTP 200
prsa-2016                    crossref  ok       Erstautor, Jahr und Titel stimmen
prsa-2016                    arxiv     ok       Erstautor und Titel stimmen
ries-1992                    crossref  ok       Erstautor, Jahr und Titel stimmen
stephens-2015                crossref  ok       Erstautor, Jahr und Titel stimmen
stephenson-2016              crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2005                   crossref  ok       Erstautor, Jahr und Titel stimmen
stern-2018                   crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                crossref  ok       Erstautor, Jahr und Titel stimmen
tremaine-2009                arxiv     ok       Erstautor und Titel stimmen
valley-2014                  crossref  ok       Erstautor, Jahr und Titel stimmen
wang-2024                    crossref  ok       Erstautor, Jahr und Titel stimmen
williams-2016                crossref  ok       Erstautor, Jahr und Titel stimmen
yang-2023                    crossref  ok       Erstautor, Jahr und Titel stimmen
young-2016                   crossref  ok       Erstautor, Jahr und Titel stimmen

55 ok, 0 Warnungen, 0 Fehler
```

Keine Warnung zu begründen: Der Lauf war auf Anhieb fehlerfrei, `herald-2014` — laut Ledger
(Ruling Task 12) an dieser Adresse gelegentlich mit HTTP 504 ausgefallen — antwortete diesmal
sofort mit HTTP 200. Der im Task-Auftrag vorgesehene Einzelabruf
`npm run literatur:pruefen -- --nur herald-2014` war deshalb nicht nötig.

## 4. Fachprüfung der Pilottexte

| Text | Wörter de/en | Belege | Zitate | Fehler gefunden | Fehler behoben | Hinweise offen |
|---|---|---|---|---|---|---|
| `thema-bahnelemente` | 2407 / 2631 | 85 | 12 (10 verschiedene Werke) | 3 | 3 | 2 |
| `objekt-earth` | 2742 / 3032 | 115 | 57 (37 verschiedene Werke) | 2 | 2 | 0 (siehe §7: eine Randnotiz zur Belegzeile 67) |
| `szene-mondfinsternis` | 795 → 658 → 695 / 891 → 753 → 795 | 39 | 7 (3 verschiedene Werke) | 3 Belegzeilen (2 Befunde: F1, F2) | 3 Belegzeilen (2 Befunde behoben) | 1 |

Wörter mit `wc -w`, Belegzeilen mit `grep -cE '^\| [0-9]+ \|' docs/belege/hochschule/<datei>.md`,
Zitate aus dem Browser-Rundgang (Abschnitt 5.4, Feld `verweise`, Art `literatur:`).

**`thema-bahnelemente`** (Task 10, Commits `31d1aa5`, `a21082a`, `dc36107`): Die Erstprüfung
(`task-10-fachpruefung.md`) fand einen Fehler (Uranusmonde: „über 40 Jahre keinen belastbaren
linearen Trend" traf so nur für Ariel/Titania zu, nicht Umbriel/Oberon; einziger Beleg war ein
falscher Kommentar in `uranus-monde.ts`) und neun sachliche Hinweise (Nr. 2, 3, 4, 5, 6, 7, 9,
10, 12), alle in `a21082a` behoben, dazu sieben zuvor fehlende Belegzeilen. Zwei Hinweise
blieben für Jens offen: Nr. 8 (Symbole T, M, h doppelt belegt) und Nr. 11 (Quellenkarte
`jpl-horizons` verlinkt die Anwendung statt des Handbuchs, Katalogfrage für 4d-2). Eine zweite,
ledger-geführte Runde (`dc36107`) fand und behob zwei weitere Fehler: die Herkunft der
Mondraten (`L̇` stammt aus der siderischen Umlaufzeit 27,32166 Tage, `L`, `ϖ`, `Ω` samt Raten
aus Meeus — der Text hatte pauschal „JPL" genannt) und eine ungenaue Verwendung von „innere
Planeten" beim Umlaufzeit-Punkt.

**`objekt-earth`** (Task 11, Commits `69b8fd4`, `4e5d336`, `f85613b`, `fabffd6`): Die
Erstprüfung (`task-11-fachpruefung.md`, 108 Prüfzeilen: 93 ok, 2 Fehler, 13 Hinweis) fand zwei
Fehler (Einleitung überzeichnete, was „nur bei der Erde" möglich sei — Schwerefelder aus
Bahnverfolgung und seismische Laufzeiten gibt es auch bei anderen Körpern; „seit 1972 wirkt
zusätzlich der Kern" verwechselte den Beginn des ausgewerteten Zeitraums mit dem Beginn des
Effekts) und dreizehn sachliche Hinweise, alle in `4e5d336` behoben, dazu fehlende
Belegzeilen. Eine anschließende Nachprüfung (`task-11-nachpruefung-2.md`, geprüft nach
`4e5d336`) fand drei weitere Hinweise (IGRF-Koordinatenform: geodätische statt geozentrische
Breite bei 80,85° N/72,76° W; ein fehlendes „deshalb" bei der Formulierung zu G und H; Beleg
für den CAI-Nullpunkt bei Bouvier und Wadhwa bestätigt) — alle drei mit Commit `f85613b`
behoben. Im selben Dokument, Abschnitt „Belegzeilen" (Prüfung der Zeilen Nr. 18, 49, 67 im
Zustand nach `f85613b`), kam ein vierter, eigenständiger Hinweis hinzu: Das Zitat zu Bouvier
und Wadhwa stand im Text direkt hinter „4567,30 Mio. Jahre" und ließ sich so als dessen Beleg
lesen, obwohl die Arbeit „4568,2" stützt — behoben mit Commit `fabffd6` (Runde 3). Die
anschließende Nachprüfung dieser Runde-3-Änderung fand keinen neuen Befund mehr, nur eine
Randnotiz (Belegspalte nennt bei `bouvier-2010` weiterhin nur „(Nullpunkt)", obwohl die Quelle
auch die 4568,2 Mio. Jahre stützt — ohne Folgen für den Text, siehe Abschnitt 7). Im Text und
in der Belegliste sind damit keine Fehler oder Hinweise mehr offen. Vier Punkte blieben
ausdrücklich Jens' Ermessen überlassen (siehe §8): Länge/Kürzung, vom Prüfer vermisste
Fachthemen (bewusst nicht ergänzt, Text liegt schon über dem Richtwert), Präzessionszahl
Nr. 55, und die Code-Befunde (Rotationsphase, UTC als TDB, Erde im Baryzentrum) — nur
beschrieben, nicht behoben.

**`szene-mondfinsternis`** (Task 12, Commits `d0b1722`, `7accb28`, `f45ee17`):
`task-12-fachpruefung.md` nennt in der Kopfzeile der Prüfspalte „43 Zeilen: 29 ok, 3 Fehler, 11
Hinweis" — geklärt: Die drei „Fehler" sind Belegzeilen, nicht eigenständige Befunde. F1 betrifft
zwei Belegzeilen (Nr. 3 und 4: Der Zeitraffer-Satz „3,78 h / 65 von 137" gilt nur ohne die
Blende beim Szenenwechsel), F2 eine Belegzeile (Nr. 11: „Winkel gelten für jede Stufe" stimmt
für die Sonne nicht) — macht 3 Belegzeilen zu 2 Befunden, beide in `7accb28` behoben. Neun
Hinweise (H1–H7, H9, H10) wurden ebenfalls in `7accb28` behoben, dazu eine Kürzung: Die
Erstfassung (Commit `d0b1722`) hatte 795 Wörter Deutsch / 891 Englisch, Runde 1 (`7accb28`)
kürzte auf 658 / 753 (`task-12-report.md`, Abschnitt „Nacharbeit nach der Fachprüfung"). Eine
zweite Nachprüfungsrunde (`task-12-nachpruefung.md`, Commit `f45ee17`) fand sieben weitere
kleine Hinweise (N1–N7, u. a. zwei verschwiegene Halbschattenfinsternisse, ein
missverständlicher Bezug „die Autoren", ein falscher Belegverweis), alle behoben — der Text
wuchs dadurch auf 695 Wörter Deutsch / 795 Englisch (Richtigkeit vor Wortzahl, Regel aus 4c-3;
`task-12-report.md`, Abschnitt „Nacharbeit Runde 2"). Offen für Jens: H8 (Primärbeleg mit 46
Finsternissen, Übernahme aus Guillet ist kenntlich gemacht) und der Modellgrenzen-Punkt
„Zeitraffer", der erst mit einer Codekorrektur außerhalb dieser Etappe entfällt.

## 5. Sichtprüfung

Browser: `http://localhost:5173/Orrery/` (bereits laufender Server, HTTP 200, kein zweiter
gestartet). Direkt nach dem Navigieren `quality.tier = 'high'` gesetzt; Uhr und Kino angehalten
(`setTime({paused:true})`, `setCinema({running:false, pauseOnInput:false})`); Fensterbreite
2560 px.

### 5.1 Formelsatz

Kopf „Bahnelemente" und die Kepler-Blockformel (mit `mfrac` und `⊙`) waren sofort vorhanden
(0 ms Wartezeit, Schriften bereits geladen). Die Kepler-Formel wurde ins Bild gescrollt und der
Panelhintergrund für die Messung deckend gemacht (`rgb(15, 23, 42)`, `backdrop-filter: none`) —
ohne das hätte die Szene dahinter durch den halbtransparenten Hintergrund mitgezählt.

Gemessene Rechtecke (`dpr = 1`): `mfrac` 83,48 × 36,95 px, Zähler 36,39 px breit, Zeichen `⊙`
10,17 × 8,00 px.

```
Bruchstrich (px): 84   Zählerbreite (px): 36.4
Ring-Sektoren (von 36): 28   Punktpixel: 1   Lückenpixel: 0   Radius (px): 4.6
```

| Kriterium | Sollwert | Messwert | Ergebnis |
|---|---|---|---|
| Bruchstrich ≥ 0,9 × Zählerbreite | ≥ 32,8 px | 84 px | erfüllt |
| Ring-Sektoren | ≥ 32 von 36 | 28 | **nicht erfüllt** |
| Punktpixel | ≥ 1 | 1 | erfüllt |
| Lückenpixel | = 0 | 0 | erfüllt |

Screenshot `.playwright-mcp/4d1-formel.png` (vor dem Commit gelöscht). Das ⊙-Zeichen ist auf
dem Bild als echtes Symbol neben „M" in „G(M⊙+m)" zu erkennen (Kreis mit Punkt), kein
rechteckiges Ersatzkästchen — dazu passt, dass Punktpixel und Lückenpixel beide im Sollbereich
liegen (ein Ersatzkästchen hätte keinen isolierten Mittelpunkt und keine saubere Lücke davor,
sondern gleichmäßig helle oder gleichmäßig dunkle Flächen). Das Sektorenkriterium bleibt bei
Originalgröße wie gemessen **nicht erfüllt**.

**Zusatzmessung bei vierfacher Größe (Ruling des Controllers):** In derselben Seitenladung
wurde die Schriftgröße des Blockformel-Elements (`style.fontSize`) auf das Vierfache gesetzt
(14 px → 56 px), erneut auf `document.fonts.ready` gewartet, frische Rechtecke gelesen und ein
zweiter Screenshot (`.playwright-mcp/4d1-formel-4x.png`, vor dem Commit gelöscht) mit demselben
Messskript ausgewertet (`dpr = 1`; Zeichen `⊙` jetzt 40,69 × 35,00 px statt 10,17 × 8,00 px):

```
Bruchstrich (px): 212   Zählerbreite (px): 145.3
Ring-Sektoren (von 36): 36   Punktpixel: 23   Lückenpixel: 0   Radius (px): 17.8
```

| Kriterium | Sollwert | Messwert (4×) | Ergebnis |
|---|---|---|---|
| Bruchstrich ≥ 0,9 × Zählerbreite | ≥ 130,8 px | 212 px | erfüllt |
| Ring-Sektoren | ≥ 32 von 36 | 36 | erfüllt |
| Punktpixel | ≥ 1 | 23 | erfüllt |
| Lückenpixel | = 0 | 0 | erfüllt |

Bei vierfacher Zeichenfläche (rund 16-mal so viele Pixel) bestehen alle vier Kriterien,
einschließlich der zuvor knapp verfehlten Ring-Sektoren (28 → 36 von 36). Die Deutung
„Messauflösung" aus der ersten Messung ist damit durch Zahlen gestützt: Bei rund 9 × 9 px
Zeichenfläche und `dpr = 1` fallen einzelne der 36 zehn-Grad-Sektoren am Rand des Rings unter
die Helligkeitsschwelle 128 (Antialiasing-Kante); bei rund 40 × 35 px verschwindet dieser
Effekt vollständig. Das gestalterische Kriterium aus Entwurf §8.1 („geschlossener Ring mit
gesetztem Mittelpunkt, kein Ersatzkästchen") ist damit sowohl nach Augenschein als auch durch
die Zusatzmessung erfüllt; das Sektorenkriterium bei Originalgröße bleibt wie gemessen **nicht
erfüllt** und wird nicht rückwirkend als „erfüllt" umgedeutet — Messweg nicht verbogen, beide
Ergebnisse stehen nebeneinander im Protokoll. Frage an Jens in Abschnitt 8.

### 5.2 Tabelle bei 18 rem

```
remPx: 16   vorher: 288   nachher: 288   scrollWidth: 1146   clientWidth: 247
```

`vorher = nachher = 288 = 18 × 16` (erfüllt); `scrollWidth (1146) > clientWidth (247)`
(erfüllt). Die Tabelle des Erde-Textes war deutlich breiter als die Spalte, der in Schritt 4
vorgesehene Ausweichtest im 900×900-Fenster war nicht nötig.

### 5.3 Literaturverweise und Karten

Auf dem Erde-Text (Hochschule, Deutsch): 37 verschiedene `literatur:`-Ziele im Text, 37
Literaturkarten, Mehrfachmenge gleich (`gleich: true`).

Klick auf den ersten Zitatlink (`agnew-2024`): Ein per `browser_click` ausgelöster echter
Mausklick zeigte in der anschließenden Prüfung keine Hervorhebung mehr — Ursache: Der separate
Tool-Rundlauf (inklusive der von `browser_click` automatisch erzeugten Seiten-Momentaufnahme)
überschritt bei dieser Seite die 1500-ms-Hervorhebungsfrist (`HERVORHEBUNG_MS` in
`InfoPanel.tsx`), bevor die Folgeabfrage lief. Mit Klick und Prüfung in **einem**
`browser_evaluate`-Aufruf (derselbe echte DOM-Klick auf denselben `<a>`, keine Sonderbehandlung)
war das Ergebnis:

```
hervorgehoben: true   sichtbar: true
```

Beide Kriterien erfüllt (Ruling, siehe Abschnitt 6). Mittelklick auf denselben Verweis öffnete
einen zweiten Tab `https://www.nature.com/articles/s41586-024-07170-0` (Ziel der Hauptadresse
`doi.org/10.1038/s41586-024-07170-0`) — erfüllt; Tab geschlossen.

### 5.4 Rundgang

Sechs Kombinationen (Sprache × Kennung), Kopf per Polling abgewartet, danach Datenblock-Prüfung
und Verweisrundgang (jeder einzelne Verweis im Text geklickt, Wirkung nach Art geprüft,
Ausgangszustand wiederhergestellt):

| Sprache/Kennung | Kopf | Formelfehler | Formeln | Tabellen | Hinweise | Verweise (Art: Anzahl/Treffer) |
|---|---|---|---|---|---|---|
| de / `thema:bahnelemente` | Bahnelemente | 0 | 124 | 2 | – | literatur 12/12, quelle 15/15, objekt 6/6, thema 1/1 |
| de / `objekt:earth` | Erde | 0 | 78 | 1 | – | literatur 57/57, quelle 6/6, thema 2/2, objekt 1/1, szene 1/1 |
| de / `szene:mondfinsternis` | Szene: Mondfinsternis | 0 | 7 | 0 | – | quelle 2/2, literatur 7/7, objekt 4/4, thema 1/1 |
| en / `thema:bahnelemente` | Orbital elements | 0 | 124 | 2 | – | literatur 12/12, quelle 15/15, objekt 6/6, thema 1/1 |
| en / `objekt:earth` | Earth | 0 | 78 | 1 | – | literatur 57/57, quelle 6/6, thema 2/2, objekt 1/1, szene 1/1 |
| en / `szene:mondfinsternis` | Scene: Lunar eclipse | 0 | 7 | 0 | – | quelle 2/2, literatur 7/7, objekt 4/4, thema 1/1 |

Alle 230 Einzelverweise trafen ihr Ziel (100 %): je 115 auf Deutsch und auf Englisch
(34 + 67 + 14 je Sprache, in beiden Sprachen gleich groß). Der Szenenkopf zeigt bei
Hochschul- wie bei Gymnasialtexten „Szene: …" (bestätigt für Mondfinsternis). Kein
`data-formelfehler`, keine Hinweiszeile in keiner der sechs Kombinationen.

Eigene Methodenkorrektur während der Prüfung: Nach einem `thema:`-Verweis (Navigation zu einem
anderen Thema) reicht `setInfo({thema:'<ausgangsthema>'})` allein zur Wiederherstellung nicht —
`window.store` behält das zuletzt gesetzte Thema unabhängig vom Kino-/Kamerastand bei, ein
laufendes bzw. angehaltenes Kino verdrängt es nicht von selbst. Der erste Durchlauf für
`szene:mondfinsternis` (Deutsch) blieb deshalb nach dem Test des `thema:finsternis`-Verweises
auf dem Finsternis-Thema hängen (Kopf „Finsternisse", der Ausweichtitel des noch textlosen
Fachthemas); mit `setInfo({thema:null})` vor dem Neustart des Kinos war der Zustand
wiederherstellbar und der Verweis danach erneut geprüft (`ok: true`). Kein Programmfehler,
sondern eine Lücke in der eigenen Restore-Reihenfolge.

Für Szenen-Verweise wurde ab der zweiten Kombination mit einem szenenhaltigen Verweis
(`szene:erdaufgang` in `objekt-earth`) ein echter Mausklick (`browser_click`) statt eines
skriptgestützten `element.click()` verwendet — Begründung in Abschnitt 5.5.

### 5.5 Konsole

`browser_console_messages` über die gesamte Sitzung (seit dem einzigen Navigieren): **0
Fehler, 1 Warnung**:

```
[WARNING] Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
```

Ursache untersucht: Diese Warnung entstand genau einmal, beim ersten Test eines
`szene:`-Verweises (`szene:erdaufgang` in der Kombination de/`objekt:earth`), ausgelöst über
`element.click()` innerhalb eines `browser_evaluate`-Skripts statt über einen echten
Mausklick. `startCinema()` fordert beim Szenenstart den Vollbildmodus an
(`document.documentElement.requestFullscreen()`); die Vollbild-API verlangt eine echte
Nutzergeste, die ein synthetischer Skript-Klick nicht mitbringt — die Anfrage schlägt fehl und
Chrome loggt das als Konsolwarnung, unabhängig vom `.catch()` im Anwendungscode. Gegenprobe: Ein
echter `browser_click` auf denselben `szene:erdaufgang`-Verweis (später, im englischen
Erde-Text) erzeugte **keine** neue Warnung (Gesamtzahl blieb bei 4 Nachrichten / 1 Warnung).
Damit ist belegt, dass echte Nutzung (Mausklick) keine Warnung erzeugt; die eine protokollierte
Warnung ist ein Artefakt der eigenen Testmethode (Skript-Klick ohne Nutzergeste), kein
Anwendungsfehler. Das Kriterium „keine Fehler und Warnungen" ist damit für die Sitzung als
Ganzes streng genommen nicht erfüllt (1 Warnung vorhanden); der Befund wird unverbogen
protokolliert und unter „Bekannte Unschärfen" eingeordnet.

## 6. Rulings der Umsetzung

Aus dem Ledger-Auszug, in Reihenfolge:

**Ruling (Task 1):** Backslash-Regel beim schließenden `$` bleibt, aber als Paritätsprüfung
(ungerade Zahl direkt vorausgehender Backslashes = maskiert), plus Testfälle.

**Ruling (Task 4):** Parameter von `hebeHervor` in `kartenSchluessel` umbenennen.

**Ruling (Task 6):** Ausgabezeile in Entwurfsreihenfolge Kennung, Prüfung, Ergebnis, Abweichung
umstellen.

**Ruling (Task 6):** XML-Entitäten (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;` und numerische)
in `arxivEintragLesen` auflösen, mit Testfall.

**Ruling (Task 10):** Nacharbeit umfasst Fehler 1 und die sachlichen Hinweise 2–7, 9, 10, 12,
dazu die sieben fehlenden Belegzeilen.

**Ruling (Task 10):** Hinweis 8 (Symbole T, M, h doppelt belegt) bleibt für Jens' Durchsicht
offen.

**Ruling (Task 10):** Hinweis 11 (Quellenkarte `jpl-horizons` verlinkt Anwendung statt
Handbuch) wird nicht im Pilot geändert, sondern für den Katalog in 4d-2 notiert.

**Ruling (Task 11):** Nacharbeit umfasst beide Fehler, die sachlichen Hinweise (Nr. 26, 39, 44,
49, 65, 73, 76, 79, 80, 87, 92, 105, Albedo/Bodendruck-Satz, Kernrotation, CAI-Einordnung,
TN36-GM-Unsicherheit) und die fehlenden Belegzeilen.

**Ruling (Task 11):** Keine inhaltlichen Ergänzungen (Polbewegung, Chandler, Hf-W usw.) und
keine Kürzung — Umfang entscheidet Jens bei der Pilotdurchsicht.

**Ruling (Task 12):** Nacharbeit umfasst F1, F2, Hinweise H1–H7, H9, H10, fehlende Belege und
Kürzung auf höchstens ~650 Wörter (de); `keen-1983` entfällt mit dem gestrichenen Satz.

**Ruling (Task 12):** H8 (Primärbeleg 46 Finsternisse) und der Modellgrenzen-Punkt Zeitraffer
bleiben — Übernahme kenntlich, Programmfehler ist Code-Frage für Jens.

**Ruling (Task 11):** Die drei kleinen Hinweise der Nachprüfung werden in Runde 2 mit
umgesetzt, zusammen mit dem Commit der Prüfspalte.

**Ruling (Task 11):** Hinweis Nr. 67 wird in Runde 3 behoben (Konvention als „Entstehung der
CAI markiert den Nullpunkt" fassen, Halbsatz zu 4568,2 Mio. a bei Bouvier und Wadhwa) und mit
der Prüfspalte committet.

**Ruling (Task 12):** N1–N7 werden in Runde 2 behoben und mit der Prüfspalte committet, auch
wenn der Text dadurch über 650 Wörter wächst — Richtigkeit vor Wortzahl.

**Ruling (Task 12):** ADS-Adresse von `herald-2014` bleibt, solange sie in der Runde
antwortet; fällt sie erneut aus, auf die zuverlässig erreichbare Volltextadresse umstellen.

**Ruling (Task 12):** `herald-2014` behält die Volltextadresse; das Prüfskript bekommt in
dieser Etappe keine Wiederholung bei 504 (Code außerhalb des Plans) — fällt die Adresse im
Gesamtlauf von Task 13 aus, wird der Einzelabruf wiederholt und beides im Protokoll
festgehalten (dieser Lauf brauchte das nicht, siehe Abschnitt 3).

**Plan-Ruling 1:** Die Pilottexte stehen nicht wörtlich im Plan; sie entstehen im Task nach
Recherche mit Belegliste und Fachprüfung (Entwurf §6.4).

**Plan-Ruling 2:** Die Prüfungen „übersetzbare Formeln und gültige Tabellen" und „Zitate nur
aus dem Katalog, nur auf Hochschulniveau" laufen für alle Textdateien, nicht nur für
Hochschultexte.

**Plan-Ruling 3:** Der Zwillingsvergleich normiert in Formeln außer `{,}` auch den Leerraum.

**Plan-Ruling 4:** Tabellenzellen brechen nicht um (`whitespace-nowrap`); breite Tabellen
scrollen im Rahmen.

**Plan-Ruling 5:** Ein abweichender arXiv-Titel ist bei Einträgen mit DOI nur eine Warnung,
ohne DOI ein Fehler. Das Jahr wird gegen arXiv nicht geprüft.

**Plan-Ruling 6:** Quellenkarten der Fachthemen kommen aus Wikipedia (deutsch und englisch)
und den JPL-Ephemeriden; die IERS-Seiten antworteten am 17.09.2026 mit 404.

**Plan-Ruling 7:** Der Hinweis „nur Hochschule" ist in 4d-1 nur per Komponententest geprüft;
die Sichtprüfung folgt in 4d-2.

**Plan-Ruling 8:** `ladeMitAusweich` bekommt einen einspritzbaren Lader, die Hinweis-Tests des
Panels laufen mit gemocktem Lader.

**Plan-Ruling 9:** Die TeX-Teilmenge enthält zusätzlich `\leq`, `\geq`, `\neq` sowie `.` und
`:` als Operatoren; `\text` erlaubt keine verschachtelten Klammern; `\mathrm` verbindet
benachbarte Buchstaben nur innerhalb einer Zeile; eine Ziffernfolge bleibt ein einziges
Argument.

**Plan-Ruling 10:** Pflichtinhalte der Pilottexte (Kepler-Blockformel mit `M_\odot`,
Erde-Tabelle mit mindestens vier Spalten) folgen aus der Messbarkeit der Abnahme §8.1.

**Plan-Ruling 11:** Keiner der drei Pilottexte verweist auf die Fachthemen; 4d-2 ergänzt die
Verweise, wo sie passen.

**Plan-Ruling 12:** Literaturkarten erscheinen ohne die Bedingung `frisch`; die Hinweiszeilen
behalten `frisch`.

**Plan-Ruling 13:** Einträge in `LITERATUR` stehen alphabetisch nach Kennung.

**Plan-Ruling 14:** Die Etappe geht nach der Abnahme per Fast-Forward auf `master`, bevor Jens
die Pilottexte gelesen hat; Änderungen aus seiner Durchsicht kommen als eigene Commits.

**Ruling (dieser Task):** Beim Rundgang (Schritt 6) wurden Literatur- und Quellenverweise
sowie Objekt- und Thema-Verweise per skriptgestütztem `element.click()` in einem gebündelten
`browser_evaluate`-Aufruf ausgelöst (statt über den separaten Werkzeugaufruf `browser_click`),
weil Letzterer durch die automatische Seiten-Momentaufnahme das 1500-ms-Hervorhebungsfenster
riss (Abschnitt 5.3) und weil jeder Klick auf einen `objekt:`/`thema:`/`szene:`-Verweis den
Panelinhalt samt der übrigen Verweise ersetzt — ein Skript kann Klick, Prüfung und
Wiederherstellung ohne Zwischenrundlauf hintereinander ausführen. Funktional identisch mit
einem echten Klick (derselbe `onClick`, derselbe Linksklick ohne Zusatztasten). Einzige
Ausnahme: `szene:`-Verweise wurden ab der zweiten Fundstelle über echten `browser_click`
ausgelöst, um die in Abschnitt 5.5 beschriebene Fullscreen-Warnung nicht zu wiederholen.

**Ruling (dieser Task):** Bei den Verweis-Rundgängen wurde jedes einzelne Vorkommen eines
Verweises im Text geklickt (nicht nur je Ziel einmal), weil `quelle:`- und `literatur:`-Klicks
keine Navigation auslösen und damit ohne Zusatzkosten alle Vorkommen testbar sind; bei
`objekt:`/`thema:`/`szene:`-Verweisen ergaben sich in den drei Pilottexten ohnehin nur
Einzelvorkommen je Ziel (kein Bedarf für eine Stichprobenregel).

## 7. Bekannte Unschärfen

**Aus dieser Abnahme:**

- Formelsatz-Kriterium „Ring-Sektoren ≥ 32 von 36" bei Originalgröße nicht erfüllt (28
  gemessen); die Zusatzmessung bei vierfacher Zeichenfläche bestand alle vier Kriterien
  (36 von 36 Sektoren), was die Deutung „Grenze der Pixelmessung bei rund 9 × 9 px und
  `devicePixelRatio 1`" mit Zahlen stützt, statt sie nur zu vermuten (Abschnitt 5.1). Der
  Originalbefund bleibt trotzdem wie gemessen im Protokoll stehen. Frage an Jens in Abschnitt 8.
- Konsole der Sitzung zeigt eine Warnung (`requestFullscreen` ohne Nutzergeste), ursächlich ein
  Artefakt des eigenen Testskripts (`element.click()` statt echtem Mausklick), durch Gegenprobe
  mit echtem Klick widerlegt als Anwendungsfehler (Abschnitt 5.5).
- `objekt-earth`, Belegzeile Nr. 67: Die Belegspalte nennt bei `bouvier-2010` nur „(Nullpunkt)",
  obwohl die Quelle auch die 4568,2 Mio. Jahre stützt (Randnotiz aus der Nachprüfung von
  Runde 3, `task-11-nachpruefung-2.md`) — ohne Folgen für den Text, nicht geändert.
- Test-Gesamtzahl (3532) ist Task für Task aus den Berichten hergeleitet (Abschnitt 2); einzige
  nicht direkt als Summenzeile belegte Zahl ist Task 5 (+9), über die Differenz zweier
  gemessener `npm test`-Ankerpunkte bestimmt.

**Aufgeschobene Kleinigkeiten (minor deferred, aus dem Ledger):**

- Task 1/2: kein Testfall für Prototyp-Namen (`\constructor`); leere Gruppe `{}` ergibt leeres
  `mrow` statt Fehler, ungetestet; `texUebersetzer.ts:351` unerreichbarer Ternary-Zweig;
  `markdownParser.ts` Ausrichtungs-Wächter `zellen.length === 0` praktisch unerreichbar.
- Task 3: Tabellenrahmen `border-white/15` statt der Panel-Trennlinienfarbe `border-white/10`;
  `Formel.tsx` `title` enthält zusätzlich „(Stelle n)"; kein Test für leere Tabellenzelle /
  Ausrichtungs-Fallback; `Formel.tsx` Ausgabe verlässt sich auf Map-Index als `key`.
- Task 4/5: `erstautorNachname` ohne Test für Autor ohne Komma; JSDoc in `literatur.ts` nennt
  Skript und Belegordner, die erst mit Task 6/10 entstehen; Hervorhebungs-Scroll-Logik in
  `Literaturkarten.tsx` dupliziert `Quellenkarten.tsx`; `InfoPanel` parst `geladen.text`
  dreifach; gleichlautende Linktexte DOI/arXiv/ADS je Karte ohne unterscheidenden
  zugänglichen Namen.
- Task 6: kaputtes JSON bei erreichbarem Dienst meldet „nicht erreichbar";
  `author[0].name`-Fallback ohne Testfall; `scripts/` nicht im tsc-Typcheck (vorbestehend);
  `entitaetenAufloesen` wirft `RangeError` bei ungültigen Codepunkten (abgefangen).
- Task 8/9: `InfoPanel.tsx` `nurHochschule`-Bedingung prüft bei `language: 'de'` denselben Fall
  zweimal (vom Plan vorgegeben); `parseMarkdown` je Datei bis zu dreimal; HTML-Prüfung entfernt
  Formeltext per einfachem `replace`, theoretisch falsche Stelle.
- Task 11: englischer Text uneinheitlich bei Tausendertrennzeichen; Belegzeile 67 nennt bei
  `bouvier-2010` nur „(Nullpunkt)", obwohl die Quelle auch 4568,2 Mio. a stützt.

**Befunde außerhalb der Etappe (Code, für Jens/spätere Etappen, aus dem Ledger — nur
beschrieben, nicht geändert):**

- Uhr setzt UTC als TDB ein (Merkur 8–18″ daneben); Kommentarfehler in `pluto-system.ts`,
  `time.ts`, `uranus-monde.ts`.
- Miranda-Knotenrate im Datensatz 0 statt Horizons +20,24°/a; Kommentar „Optimum bei
  `nodeDot = 0`" falsch.
- Keplerlöser divergiert bei e = 0,999 (Orrery-Körper haben e < 0,5, praktisch folgenlos).
- Erdrotation ohne gültiges IAU-Rotationsmodell (Phase 79,5°/75,4° daneben); Kommentar in
  `earth.ts` nennt eine Quelle, die dafür keine Ausdrücke mehr enthält.
- Erdmittelpunkt sitzt im Modell im Erde-Mond-Schwerpunkt (~4670 km daneben), im Text
  offengelegt.
- Tethys `lpDot` 7 192 774°/Jh. (auffälliger Wert, bei kleinem e folgenlos).
- Albedo-Modell setzt Kartenmittel als geometrische Albedo (Lambert-Kugel hätte p = 2A/3).
- Umlaufzeit Erde im Datenblock rund 10 min daneben (G·(M⊙+M⊕) 45 ppm über dem heliozentrischen
  Wert).
- Mondfinsternis-Szene: Blende nach dem Zeitsprung lässt die nächste Modellfinsternis
  weitgehend ungesehen vorbeilaufen (Programmfehler); Belichtung auf Erde statt Mond;
  Kernschatten nur Fülllicht ohne Atmosphäre.
- Mondraten (`moon.ts`) enthalten offenbar die Präzession (~1,4°/Jh. in `ϖ̇`, `Ω̇`); ohne sie
  sänke der Gamma-Fehler gegen den NASA-Katalog von rms 0,043 auf 0,023 Erdradien, 11 statt 3
  falsch eingeordnete Finsternisse 1951–2050.

## 8. Halt: Fragen an Jens zu den Pilottexten

Allgemein — Tiefe, Ton, Gliederung, Länge, Zitierdichte:

1. **Länge `objekt-earth`** (2742/3032 Wörter, deutlich über dem für Körpertexte
   üblichen Rahmen, 115 Belegzeilen): Kürzen, so lassen, oder ist das für Hochschulniveau die
   richtige Tiefe? Die Fachprüfung nennt zusätzliche, bewusst nicht ergänzte Themen
   (Polbewegung/Chandler-Periode, neuere seismische Referenzmodelle, Hf-W-Chronologie) — sollen
   die noch hinein, oder ist der Text eher zu kürzen?
2. **Symbolkollisionen `thema-bahnelemente`:** T steht sowohl für julianische Jahrhunderte (JPL-
   Konvention) als auch für die Umlaufzeit in der vorgegebenen Pflichtformel; ebenso M, h.
   Umbenennen (Stilentscheidung) oder so lassen?
3. **Quellenkarte `jpl-horizons`** verlinkt die Web-Anwendung statt des Handbuchs — für den
   ganzen Katalog ändern (betrifft auch Gymnasialtexte)?
4. **`szene-mondfinsternis`:** Bleibt der Umfang 695/795 Wörter (bewusst über dem Richtwert
   300–600, Ruling aus dem Plan) so bestätigt, auch nachdem Runde 2 den Text durch
   Richtigkeits-Korrekturen wieder verlängert hat?
5. **Nullpunkt der Zeitangaben (`objekt-earth`):** Die Formulierung „ihre Entstehung markiert
   den Nullpunkt" mit Halbsatz zu 4568,2 Mio. a bei Bouvier und Wadhwa — passt die Auflösung des
   ursprünglich missverständlichen Zitats (Nr. 67) inhaltlich, oder wird hier zu vorsichtig
   formuliert?
6. **Umlaufzeit-Herleitung `thema-bahnelemente` und Umlaufzeit-Punkt `objekt-earth`:** Beide
   Texte beschreiben inzwischen offen, dass Modell und Realität um kleine Beträge auseinander-
   laufen (Physik bei Uranus/Neptun, ~10 min bei der Erde) — ist dieser Grad an Offenlegung von
   Modellgrenzen im Fließtext gewünscht, oder gehört so etwas ausschließlich unter „Im Modell"?

Speziell offen aus den Fachprüfungen (je eine Zeile, Einzelheiten in Abschnitt 4 und in den
genannten Dateien):

7. `thema-bahnelemente` Hinweis 8: T/M/h-Doppelbelegung (siehe Frage 2, hier nur als
   Fachprüfungs-Fundstelle vermerkt: `task-10-fachpruefung.md`).
8. `thema-bahnelemente` Hinweis 11: `jpl-horizons`-Quellenkarte (siehe Frage 3).
9. `objekt-earth`: Präzessionszahl Nr. 55 „rund 25 770 Jahre" bleibt unverändert stehen, weil
   sie zu beiden geprüften Werten passt — in Ordnung?
10. `objekt-earth`: Murray-und-Dermott-Jahresangabe 2000 (Crossref-Druckdatum) bleibt so stehen
    — Jens entscheidet laut Fachprüfung ausdrücklich.
11. `szene-mondfinsternis` H8: Primärbeleg mit 46 Finsternissen ist als Übernahme aus Guillet
    kenntlich gemacht — reicht das, oder soll ein eigener Nachweis her?

(Die „3 vs. 2 Fehler"-Frage der Vorfassung ist geklärt und entfällt: `task-12-fachpruefung.md`
zählt in der Kopfzeile Belegzeilen, nicht Befunde — F1 deckt zwei Zeilen ab (Nr. 3 und 4), F2
eine (Nr. 11), macht 3 Zeilen zu 2 Befunden, siehe Abschnitt 4.)

Aus dieser Abnahme selbst:

12. **Formelsatz-Kriterium Ring-Sektoren** (Abschnitt 5.1): Die Zusatzmessung bei vierfacher
    Größe bestand alle vier Kriterien und stützt die Deutung „Grenze der Pixelmessung" mit
    Zahlen. Reicht das als Abnahme des Originalbefunds, oder soll das Messverfahren für 4d-2
    dauerhaft mit größerer effektiver Auflösung laufen (z. B. `scale: 'device'` bei höherem
    `devicePixelRatio`, oder serienmäßig ein vergrößerter Ausschnitt wie in dieser Nacharbeit)?
13. **Prüfskript bei HTTP 504 von `herald-2014`** (Ruling Task 12, Zeile 206 im Ledger): Dieser
    Lauf war fehlerfrei (HTTP 200), die Frage bleibt für künftige Läufe offen — Wiederholung im
    Skript einbauen, oder die Adresse aus dem ADS-System durch eine andere ersetzen?

Code-Befunde außerhalb dieser Etappe (nur je eine Zeile, Einzelheiten in Abschnitt 7 und im
Ledger): Erdrotationsmodell, UTC/TDB-Verwechslung, Erde im Baryzentrum, Albedo-Modell,
Mondraten-Präzession, Mondfinsternis-Szene (Blende/Belichtung/Kernschatten), Miranda-Knotenrate,
Tethys-`lpDot`, Keplerlöser-Divergenz bei e = 0,999 — alle nur beschrieben, keine Codeänderung
in dieser Etappe.
