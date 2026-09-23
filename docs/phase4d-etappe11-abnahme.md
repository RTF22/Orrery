# Abnahme Phase 4d Etappe 11 „Abschluss"

## 1. Umfang

Branch `hochschule-11` von `master` `5bed033` (Endstand der Abnahme 4d-10 mit den bestätigten
Entscheidungen von Jens), Plan-Commit `3f0754c` (23.09.2026, „Plan Phase 4d Etappe 11:
Abschluss"). Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-23-phase4d-hochschule-etappe11.md` (5 Tasks, 22 Plan-Rulings).
Ledger `.superpowers/sdd/2026-09-23-phase4d-hochschule-etappe11/progress.md` (git-ignoriert).

7 Commits über `3f0754c` bis `3d2b0a1` (`git rev-list --count 3f0754c..3d2b0a1`). In
chronologischer Reihenfolge:

| Kurzhash | Zeit | Titel |
|---|---|---|
| b6a2e98 | 14:49 | Hochschultext Thema Grenzen des Modells mit Belegliste |
| 2183df8 | 15:21 | Hochschultext Thema Das Sonnensystem mit Belegliste |
| 260f701 | 15:30 | Hochschultext Thema Grenzen des Modells: Nacharbeit nach der Fachprüfung |
| 985c3f6 | 15:51 | Hochschultext Szene Das System von oben mit Belegliste |
| 4aa81a4 | 15:58 | Hochschultext Thema Das Sonnensystem: Nacharbeit nach der Fachprüfung |
| 049167e | 16:10 | Hochschultext Szene Das System von oben: Nacharbeit nach der Fachprüfung |
| 3d2b0a1 | 16:14 | Dateitest: Gymnasialersatz entfällt, Vollständigkeit aller Texte geprüft |

Drei Hochschultext-Einheiten (de/en), die letzten der Phase: `thema-modell` (Task 1),
`thema-sonnensystem` (Task 2), `szene-systemblick` (Task 3) — je genau eine Fachprüfung und
höchstens eine Nacharbeit (Ruling 3, „höchstens eine Prüfrunde je Text"). Task 4 ist ein reiner
Code-Task (Dateitest: Gymnasialersatz entfällt, neuer Vollständigkeitstest über alle 69
Kennungen). Task 5 (dieses Protokoll, README) ist ein reiner Dokumentationstask.

Reihenfolge `modell` → `sonnensystem` → `systemblick` → Code → Abnahme (Ruling 5): `modell`
liefert Maßstab, Systemumfang und die Modellzahlen-Tabelle, `sonnensystem` die Architektur,
beide zusammen die Szene. Fachprüfungen liefen jeweils parallel zum nächsten Umsetzer;
Nacharbeiten warteten, bis kein anderer Umsetzer lief (Task 1 wartete auf Task 2, Task 2 auf
Task 3).

## 2. Lint, Tests, Build

Lauf auf `3d2b0a1` (Arbeitsbaum sauber vor diesem Protokoll):

```
npm notice run orrery@0.0.0 lint
npm notice run eslint .
```
→ kein Befund.

```
npm notice run orrery@0.0.0 test
npm notice run vitest run
 Test Files  101 passed (101)
      Tests  5149 passed (5149)
   Start at  16:19:20
   Duration  15.01s (environment 49%, setup 23%, tests 15%, transform 8%, import 5%, worker 1%)
```
→ **5149 Tests, 101 Testdateien, alle grün** (Soll laut Brief 5149 erreicht).

```
dist/assets/index-BS3G1xcG.js   1,453.74 kB │ gzip: 393.57 kB
✓ built in 918ms
```
→ nur die bekannte Warnung zu großen Chunks. Hauptchunk **1 453,74 kB**.

### Testzahlen (aus den Task-Berichten, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (Plan-Commit `3f0754c`, inhaltlich 4d-10-Endstand) | — | 5086 |
| 1 | Thema Grenzen des Modells (Umsetzung) | +20 | 5106 |
| 2 | Thema Das Sonnensystem (Umsetzung) | +20 | 5126 |
| 1 | Nacharbeit | +0 | 5126 |
| 3 | Szene Das System von oben (Umsetzung) | +22 | 5148 |
| 2 | Nacharbeit | +0 | 5148 |
| 3 | Nacharbeit | +0 | 5148 |
| 4 | Dateitest (ein neuer Test) | +1 | 5149 |

5086+20+20+0+22+0+0+1 = 5149, deckt sich mit dem tatsächlichen `npm test`-Lauf. Jede Nacharbeit
fügt keine neuen Testfälle hinzu (nur Text-/Beleg-Korrekturen), wie in den Vorgänger-Etappen.

### Hauptchunk

Ausgangsstand nach Etappe 4d-10: **1 450,51 kB**. Endstand dieser Etappe (selbst nachgebaut auf
`3d2b0a1`): **1 453,74 kB**. Zuwachs: **+3,23 kB** — weit unter der 50-kB-Schwelle aus
Plan-Ruling 19, keine Eskalation der Frage „fauler Import des Katalogs" an Jens nötig.

Zwischenstände aus den Task-Berichten: Task 1 **1 450,99 kB** (nach Umsetzung), nach dessen
Nacharbeit nicht erneut berichtet; Task 2 **1 453,51 kB** (nach Umsetzung, +2,52 kB gegenüber
Task 1), nach dessen Nacharbeit nicht erneut berichtet; Task 3 **1 453,74 kB** (nach Umsetzung
und nach dessen Nacharbeit unverändert); Task 4 **1 453,74 kB** (unverändert, reiner Test-Task).
Der selbst gemessene Endstand deckt sich exakt mit dem letzten berichteten Zwischenwert.

### Katalogeinträge (`src/data/literatur.ts`)

Ausgangsstand **753** (`git show 3f0754c:src/data/literatur.ts | grep -cE "^\s+id: '"`,
identisch mit dem Endstand aus Etappe 4d-10). Endstand **761** (`grep -cE "^\s+id: '"
src/data/literatur.ts`, selbst nachgezählt). Zuwachs je Commit, für **jeden** der 7 Commits
selbst per `git show <Commit>:src/data/literatur.ts | grep -c` nachgezählt (nicht aus den
Berichten übernommen):

| Kurzhash | Aufgabe | Katalog danach | Zuwachs |
|---|---|---|---|
| b6a2e98 | Task 1 (Umsetzung) | 753 | 0 |
| 2183df8 | Task 2 (Umsetzung) | 761 | +8 |
| 260f701 | Task 1 (Nacharbeit) | 761 | 0 |
| 985c3f6 | Task 3 (Umsetzung) | 761 | 0 |
| 4aa81a4 | Task 2 (Nacharbeit) | 761 | 0 |
| 049167e | Task 3 (Nacharbeit) | 761 | 0 |
| 3d2b0a1 | Task 4 | 761 | 0 |

753+8 = 761, deckt sich mit der eigenen Nachzählung am Endstand. Alle acht neuen Einträge
(`bailey-2016`, `batygin-2016`, `iorio-2012`, `laskar-2009`, `napier-2021`, `ray-2012`,
`souami-2012`, `winn-2015`) stammen aus Task 2, alphabetisch eingefügt (Test bestätigt die
Reihenfolge). Task 1 und Task 3 legten **keine** neuen Katalogeinträge an (alle zitierten
Ausgangspunkte waren bereits im Katalog beziehungsweise Task 3 kam mit einer bereits
katalogisierten Formel aus). **Keine Abweichung zwischen einer Berichtszahl und der eigenen
Nachzählung gefunden.**

### Quellenkarten (`src/data/quellen.ts`)

Ausgangsstand **88**, Endstand **91** (+3, je Commit nachgezählt): `b6a2e98` (Task 1) 88→89
(`jpl-satelliten-entdeckung`, JPL-SSD-Seite „Discovery Circumstances"); `2183df8` (Task 2) 89→91
(`nasa-oortwolke`, `nasa-exoplaneten`); alle übrigen Commits ±0.

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog, 761 Einträge), Zeitpunkt per Start-Kommando und
Dateizeitstempel des Log gemessen (Start 16:19:09, Ende 16:30:24):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 761 von 761 Einträgen
[… 872 Zeilen, davon 865 „ok" …]
cgpm-2022            crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
greaves-2021         crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
herald-2014          url       fehler   nicht erreichbar: TypeError: fetch failed
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

865 ok, 5 Warnungen, 2 Fehler
```

**Laufzeit:** rund 675 Sekunden (11:15 min; Ausgangsstand nach 4d-10 rund 764 s bei 753
Einträgen — plausibel, Katalogumfang um +8 Einträge nahezu unverändert, Laufzeit im selben
Rahmen). Keine Zeile mit `429` (`grep -c 429`: 0 Treffer) — kein Hinweis auf Ratenbegrenzung.

**Ein transienter Netzfehler, nachgeprüft:** `herald-2014` (URL, „TypeError: fetch failed").
Nachlauf `npm run literatur:pruefen -- --nur herald-2014`:

```
Prüfe 1 von 761 Einträgen
herald-2014                  url       ok       HTTP 200

1 ok, 0 Warnungen, 0 Fehler
```

→ transient bestätigt, kein echter Befund.

**Ein bekannter Falsch-Fehler:** `trujillo-2007` — Crossref führt den Titel mit
`<sub>61</sub>`-Markup und geschütztem Bindestrich, der Katalogeintrag die ASCII-Fassung; DOI,
Erstautor, Jahr, Zeitschrift, Band und Seiten sind unabhängig bestätigt (seit Etappe 4d-10 als
Grenze des Titelvergleichs bei `<sub>`-Tags dokumentiert).

**Fünf Warnungen, alle bereits aus früheren Etappen bekannt und dort begründet** (`cgpm-2022`,
`greaves-2021`, `korablev-2019`, `sanchez-lavega-2011`, `mckinnon-2016` — Muster seit Etappe 2,
4 beziehungsweise 4d-6/4d-9 dokumentiert). Keiner der 8 neuen Katalogeinträge dieser Etappe
erzeugt eine neue, bisher unbekannte Warnung oder einen echten Fehler.

## 4. Fachprüfung

Zahlen aus den `task-N-report.md`/`task-N-befunde.md`-Dateien, gegengerechnet gegen die
aktuellen Dateien im Arbeitsbaum (`wc -w` auf `src/data/texte/<sprache>/hochschule/…`,
Zeilenzählung der Beleglisten-Tabellen über `grep -cE '^\|'` minus Kopf- und Trennzeile, je sechs
Zellen je Zeile per Skript gegengeprüft — 0 Fehler, 0 leere Prüfzellen bei allen drei
Beleglisten). Je Text genau eine Fachprüfung, höchstens eine Nacharbeit (Ruling 3).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| `thema-modell` (Grenzen des Modells) | 2894/3163 | 69 | 10 | 0 (+1 Quellenkarte) | 1/1 (Enceladus-Albedo-Vergleichswert 0,64 gegen 1,24 statt 1,0) + Controller-Fund Sonne-Schwerpunkt (Zweikörper-Näherung durch die fachgeprüfte Mehrkörperzahl aus `objekt-sun` ersetzt, siehe unten) | keine offen (2 Hinweise behoben: Archinal-Zitat 2011 statt 2018, UI-Zitatgenauigkeit; 2 fehlende Belegzeilen ergänzt: Haumea-Streitfrage statt unbelegter Pluto-Aussage, Kepler-Löser-Jahre) |
| `thema-sonnensystem` (Das Sonnensystem) | 1916/2166 | 33 | 10 | 8 (+2 Quellenkarten) | 3/3 (GM_Sonne-Kontrollabweichung 0,00004 % statt 0,007 %; Bailey/Batygin/Brown „testable" statt „ausdrücklich ungeprüft"; Wurzelklick-Datei `src/ui/kamerafahrt.ts` ergänzt) | 1 offen: Winn-und-Fabrycky-2015-Wortlaut ohne direkten PDF-Zugriff nicht wörtlich verifizierbar, vom Prüfer selbst als „kein Fehler" eingestuft (zur Kenntnis, §7) |
| `szene-systemblick` (Szene: Das System von oben) | 959/1120 | 29 | 1 | 0 | 2/2 (Winkelsummen-Begründung für Neptuns Bahn korrigiert; „höchstens 30 %" auf „bis 30,3 %" berichtigt) | keine offen (2 Hinweise behoben: Näherungsfehler-Angabe auf bis 5,5 % präzisiert, Fundstelle „Formel und Werte" auf `thema:modell` umgestellt) |
| Task 4 (Dateitest, Mechanik) | — | — | — | 0 | Aufgabenprüfung ✅ Approved | 1 offen, nicht behoben: zwei getrennte Importzeilen aus `../themen` statt einer (vom Brief ausdrücklich erlaubt, kosmetisch) |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und Trennzeile) unter
`docs/belege/hochschule/`, über `grep -cE '^\|'` minus 2 gezählt. Zitate sind die im Browser
gemessenen, eindeutigen Literaturkarten je Kombination (§5), deckungsgleich mit den
`literatur:`-Kennungen in beiden Sprachfassungen (`zitateGleichKarten` in allen 6 Messungen
`true`). Wortzahlen `wc -w` auf den aktuellen Dateien selbst gemessen — **stimmen bei allen drei
Texten exakt mit den zuletzt in den Berichten genannten Zahlen überein**, alle innerhalb der
Richtwerte (Ruling 4) beziehungsweise deren Obergrenze: `modell` 2894/3163 (Richtwert
2000–4000), `sonnensystem` 1916/2166 (Richtwert 1500–4000), Szene 959/1120 (Richtwert 300–900,
Obergrenze 1200 — Deutsch mit 959 Wörtern über dem Richtwert, klar unter der Obergrenze,
sachlich begründet: Berichtigungen aus der Nacharbeit durften nicht kürzen).

**Controller-Fund während Task 2 (Widerspruch zu einem fachgeprüften Text, Prüfschwerpunkt 1):**
`thema-modell` nannte für „Sonne im Ursprung statt am Schwerpunkt" zunächst nur eine eigene
Sonne-Jupiter-Zweikörper-Näherung (1,067 Sonnenradien); der bereits fachgeprüfte Text
`objekt-sun.md` führt dazu eine genauere Mehrkörper-Nachrechnung (0,06 bis 2,11 Sonnenradien,
Mittel 1,21, Jupiter-Anteil allein 1,07 — deckungsgleich mit der Zweikörperzahl). Task 1s
Fachprüfer übersah den Widerspruch zunächst; Task 2 fand ihn beim eigenen Schreiben, der
Controller ordnete die Nacharbeit an (Plan-Ruling 8: fachgeprüfte Zahl geht vor eigener
Näherung). In der Nacharbeit zu `thema-modell` (260f701) behoben: Bereich, Mittelwert und
Jupiter-Anteil aus `objekt-sun` übernommen, mit Verweis `objekt:sun`.

**Eingehende Verweissätze (Prüfschwerpunkt 2), aus Task 1 und Task 3:**

- `thema:modell`: `grep -rn "(thema:modell)"` über alle Hochschultexte findet 134 Treffer in 130
  Dateien (65 DE + 65 EN, deckt sich mit der in den globalen Vorgaben genannten Zahl). Fast alle
  sind der gleichförmige Satz „Weitere Vereinfachungen: [Grenzen des Modells](thema:modell)."
  beziehungsweise seine englische Entsprechung; eine Stichprobe (`objekt-ariel.md`,
  `objekt-earth.md`, `thema-bahnelemente.md`, `szene-pluto-charon.md`) bestätigt die einheitliche
  Form, die der neue Text als vollständige Modellbeschreibung deckt. Zwei nicht-generische Sätze
  gezielt geprüft (`thema-kirkwood-luecken.md:16` über Resonanzlücken, `thema-achsneigung.md:271`
  über feste Pole) — beide gedeckt (Abschnitte „Gürtel" beziehungsweise „Rotation und Pole").
  Kein Verweissatz mit unerfülltem Versprechen gefunden.
- `szene:systemblick`: `grep -rn "(szene:systemblick)"` findet genau zwei Fundstellen (je DE/EN
  dieselbe Aussage): `objekt-sun.md` DE Z. 269 / EN Z. 257 („zeigt die Planeten um die ruhende
  Sonne") — gedeckt durch den Abschnitt „Modellgrenzen"; `thema-sonnensystem.md` DE Z. 212 / EN
  Z. 209 („Eine Draufsicht in Bewegung") — gedeckt (54° Azimutdrehung in 60 s, Zeitraffer 30
  Tage/s). Kein Verweissatz ohne Deckung.
- `thema:sonnensystem` selbst hatte zum Zeitpunkt von Task 2 noch keine eingehenden Verweise
  (die einzige nach Ruling 11 vorgesehene Quelle, `szene:systemblick`, entstand erst in Task 3);
  kein Befund zu prüfen.

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/`
→ 200), kein zweiter gestartet. `window.store.setState({ quality: { tier: 'high' } })` direkt
nach `browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung (Niveau Hochschule,
Panel eingehängt, `breiteRem: 40`). Szenenindex am Array `src/data/scenes.ts` selbst
gegengeprüft (dynamischer Import `/Orrery/src/data/scenes.ts` im Browser): `systemblick` = **4**
(von 19 Szenen) — deckt sich mit dem im Brief genannten Index.

### 5.1 Rundgang

Alle 6 Kombinationen angefahren (`modell`, `sonnensystem`, `systemblick`, je Deutsch und
Englisch): Themen über `setInfo({thema:'<id>'})`, die Szene über
`setCinema({running:true,shuffle:false,nummer:4})` + `setCamera({mode:'cinema'})`, nach 1,5 s
Stabilisierung `setCinema({running:false})`, `setTime({paused:true})`, `setUi({hidden:false})`,
200 ms Wartezeit vor der DOM-Messung. Auf den Kopfwechsel gepollt (zwei aufeinanderfolgende
gleiche Lesungen im Abstand von 50 ms), Hinweise erst nach dem Auflösen des faulen Imports
gewertet. `objekt:`/`thema:`-Verweise sind im DOM `<button>`-Elemente, keine `<a>`-Elemente
(bekannte Messfalle seit 4d-6/4d-10, durchgehend ohne Tag-Einschränkung `[data-verweis="…"]`
verwendet).

**Kernkriterien, alle 6 Kombinationen:** `formelfehler` **0**, keine Hinweiszeile, `zitateGleich-
Karten` **true**.

**6 von 6 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `thema:modell` | Grenzen des Modells | Limits of the model | 33 | 0 | 10 |
| `thema:sonnensystem` | Das Sonnensystem | The Solar System | 20 | 1 | 10 |
| `szene:systemblick` (Nr. 4) | Szene: Das System von oben | Scene: The Solar System from above | 36 | 1 | 1 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (in beiden Läufen gemessen).

**Klicktest je Verweisart:** Anwendbare Arten je Kombination: `thema:modell` hat `objekt`,
`thema`, `quelle`, `literatur` (kein `szene:`-Verweis im Text); `thema:sonnensystem` hat alle
fünf Arten; `szene:systemblick` hat `objekt`, `thema`, `literatur` (kein `quelle:`-, kein
`szene:`-Verweis). Je Kombination wurde von jeder anwendbaren Verweisart das erste Vorkommen
über `[data-verweis^="<art>:"]` ermittelt, per `element.click()` ausgelöst und die Wirkung gegen
die Tabelle im Brief geprüft (`objekt` → `camera.targetId` nach 1,7 s Wartezeit; `thema` →
`ui.info.thema`; `szene` → `cinema.nummer` gegen den erwarteten Index samt
`camera.mode==='cinema'`, danach Kino explizit gestoppt; `quelle` → `[data-quelle="<id>"]`,
`literatur` → `[data-literatur="<id>"]`, jeweils Klasse `border-sky-300`, Klick und Prüfung in
einem `browser_evaluate`); die Kombination wurde vor jedem Einzeltest frisch aufgebaut.

3 Kombinationen × 2 Sprachen × 5 Arten = 30 möglich, davon 6 ohne Vorkommen (1×`szene` bei
`modell`, 2×`quelle`+`szene` bei `systemblick`, je in beiden Sprachen) → **24 anwendbare
Klicktests**.

**Ergebnis: 24 von 24 anwendbaren Klicktests trafen.** `objekt` → `camera.targetId` stimmt in
allen 6 Fällen (`sun`, `mercury`, `sun` je de/en); `thema` → `ui.info.thema` stimmt in allen 6
Fällen; `szene:systemblick` (im Text `thema:sonnensystem`) → `cinema.nummer===4` samt
`camera.mode==='cinema'` in beiden Sprachen; `quelle`/`literatur` → Karte trägt `border-sky-300`
in allen 10 anwendbaren Fällen (4×`literatur` bei `modell`, `quelle`+`literatur` bei
`sonnensystem`, `literatur` bei `systemblick`, je de/en).

**Randbefund (kein Kernkriterium, §7):** In `thema-modell.md` (DE) rendert der Verweis
`quelle:jpl-satelliten-entdeckung` nicht als Link, siehe §7.

### 5.2 Ersatz entfällt

Nach Ruling 14: vier Messungen je Sprache (acht Messungen), Zeilennummern vorher per `grep -n`
bestätigt (`objekt-sun.md` DE Z. 269 / EN Z. 257 für `szene:systemblick`), Wartezeit bis zum
Kopfwechsel (`performance.now()`, Zeit vom Klick bis zum ersten Poll mit passendem Kopf):

| Messung | Kopf vorher | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|---|
| (a) `objekt:earth` → `thema:modell` (de) | Erde | Grenzen des Modells | keine | 47 ms |
| (a) `objekt:earth` → `thema:modell` (en) | Earth | Limits of the model | keine | 46 ms |
| (b) `objekt:sun` → `szene:systemblick` (de) | Sonne | Szene: Das System von oben | keine | 1650 ms |
| (b) `objekt:sun` → `szene:systemblick` (en) | Sun | Scene: The Solar System from above | keine | 1654 ms |
| (c) `szene:systemblick` → `thema:sonnensystem` (de) | Szene: Das System von oben | Das Sonnensystem | keine | 44 ms |
| (c) `szene:systemblick` → `thema:sonnensystem` (en) | Scene: The Solar System from above | The Solar System | keine | 48 ms |
| (d) Zurücksetzen (de, Mars offen) | Mars | Das Sonnensystem | keine | 0 ms |
| (d) Reset (en, Mars offen) | Mars | The Solar System | keine | 0 ms |

Alle acht Messungen ohne Hinweiszeile: Der bislang gezeigte Ersatz-Hinweis für `thema:modell`,
`szene:systemblick` beziehungsweise `thema:sonnensystem` ist entfallen, weil diese Etappe die
entsprechenden Hochschultexte liefert. Bei (b) ist die Wartezeit die Kinostart-Stabilisierung
(1,5 s + Poll). Bei (d) bestätigt `ui.info.niveau === 'hochschule'` in beiden Sprachen nach dem
Klick auf „Zurücksetzen"/„Reset"; die Wartezeit lag bei 0 ms, weil der Kopf beim ersten Poll
bereits umgestellt war.

### 5.3 Konsole

Ein erster durchgehender Rundgang (Navigate → alle 6 Kombinationen → 24 Klicktests → 8
Ersatz-Messungen, in einer langen Sitzung mit mehreren Minuten Pausen zwischen den
Werkzeugaufrufen) zeigte am Ende 1 Fehler
(`ReactDOMClient.createRoot() on a container that has already been passed to createRoot()
before`) und rund 123 WebGL-Warnungen (`GL_INVALID_FRAMEBUFFER_OPERATION: … Attachment has zero
size`). Eine zweite, eng getaktete Kontrollsitzung (frisches `browser_navigate`, danach ohne
Pausen: Zustands-Einrichtung, Objektziel, dreifacher Kino-Start/Stopp-Zyklus, Sprachwechsel,
`Zurücksetzen`-Klick) zeigte durchgehend **0 Fehler, 0 Warnungen** — nicht reproduzierbar.

Einordnung: Der Vite-Entwicklungsserver löst bei längerem Leerlauf der WebSocket-Verbindung
einen HMR-„full-reload" aus, der `createRoot()` ein zweites Mal auf demselben Container aufruft;
das kurze Neu-Einhängen der Three.js-Canvas dabei kann für einen Frame Größe 0 haben, was die
Framebuffer-Warnungen erklärt — ein Artefakt des Dev-Servers bei langen, pausenreichen
Testsitzungen, kein Fehler der Etappe-11-Texte oder des Codes: `npm run build` (Produktionsbau,
kein Vite-HMR) war unabhängig fehlerfrei, und die Kontrollsitzung mit identischer
Interaktionsfolge ohne Leerlauf-Pausen blieb zweimal sauber. Die bekannte Ausnahme „Vollbild
ohne Nutzergeste" trat in keiner der beiden Sitzungen auf, die Gegenprobe dafür entfällt.

Die abschließende, für dieses Protokoll maßgebliche Messung (letzter Rundgang durch alle drei
Kombinationen mit Zitatzahl-Nachmessung) endete mit **0 Fehlern, 0 Warnungen**.

Playwright-Aufnahmen unter `.playwright-mcp/` gelöscht, keine Skripte im Projektstamm angelegt;
`git status --short` vor diesem Commit zeigt ausschließlich die beiden zu ändernden Dateien.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge.

**Vorprüfung (Controller):**

- Aufgabenprüfung der Text-Tasks 1–3 durch die im Plan vorgeschriebene Fachprüfung ersetzt (eine
  Runde) statt der Skill-Vorlage — Projektregel von Jens (20.09.2026) und Praxis 4d-2 bis 4d-10.
  Kosten bei Fehlurteil: eine übersehene Stil-/Formprüfung, die die Schlussprüfung nachholt.
- Task 4 bekam die Aufgabenprüfung der Skill-Vorlage (mittleres Modell) als Code-Task. Kosten:
  keine.
- Task 5 (dieses Protokoll) bekommt keine eigene Aufgabenprüfung; die Schlussprüfung dient als
  Aufgabenprüfung (wie 4d-5 bis 4d-10). Kosten bei Fehlurteil: Protokollfehler fallen erst in der
  Schlussprüfung auf.

**Task 1 (Thema Grenzen des Modells):**

- Sonnen-Schwerpunktversatz aus eigener Zweikörper-Herleitung Sonne–Jupiter (1,067
  Sonnenradien) statt der Meeus-1997-Zahl (Buch ohne DOI/URL, nicht zitierfähig nach Ruling 20) —
  Kosten bei Fehlurteil: gering, unterschätzt die reale Bewegung eher, der Text sagt es so; in
  der Nacharbeit ohnehin durch die fachgeprüfte Mehrkörperzahl aus `objekt-sun` ersetzt
  (Controller-Fund, siehe §4).
- Modellzahlen-Tabelle per gezielter Stichwortsuche statt Volllesen aller 66 fachgeprüften Texte
  — Sitzungsgrenze. Kosten bei Fehlurteil: einzelne Zahl fehlt in der Tabelle.
- Formelvariable `r'` → `R` (Apostroph nicht in der TeX-Teilmenge) — Dateitest verlangte es.
  Kosten: keine.
- `\mathrm{AU}` in Formeln auch im Deutschen (Korpuskonvention, Zwillingstest). Kosten: keine.
- Kein neuer Katalogeintrag, alle Zitate bereits im Katalog — Wiederverwendungsregel. Kosten:
  keine.
- Neue Quellenkarte `jpl-satelliten-entdeckung` (eigener Seiteninhalt, Adresse mit HTTP 200
  geprüft). Kosten: eine Karte mehr.
- Gymnasialtext-Fehler „unter 4700 km" nicht korrigiert, nur gemeldet — Ruling 9 des Plans
  verbietet Änderungen an Gymnasialtexten in dieser Etappe. Kosten: keine, Befund geht an Jens
  (§8).
- „Plutos Masse und Pol" durch die belegte Streitfrage „Haumeas wahre Form und Dichte" ersetzt
  statt gestrichen (Nacharbeit) — hält den Umfang konsistent mit „nicht kürzen" und nutzt bereits
  katalogisierte Literatur. Kosten: gering, die Pluto-Frage selbst fehlt jetzt in den Offenen
  Fragen.

**Controller-Ruling zwischen Task 1 und Task 2:**

- `thema-modell` muss den Schwerpunktversatz der Sonne gleichlautend mit `objekt-sun` nennen
  (1800–2050: 0,06–2,11 R☉, Mittel 1,21 R☉); die Zweikörperzahl 1,067 darf nur als Jupiter-Anteil
  stehen bleiben (Plan-Ruling 8, Prüfschwerpunkt 1) — der Fachprüfer von Task 1 übersah den
  Widerspruch, Task 2 fand ihn beim eigenen Schreiben. Kosten: keine, in der Nacharbeit behoben.

**Task 2 (Thema Das Sonnensystem):**

- Drehimpulsanteil als eine gemeinsame Spalte (Planeten Bahn, Sonne Rotation) statt zwei
  getrennter Spalten — die Sonne hat keinen nennenswerten eigenen Bahndrehimpuls. Kosten: gering.
- Dones et al. 2015 nicht zitiert (auch die Zusammenfassung hinter keiner geprüften freien
  Quelle erreichbar), stattdessen die NASA-Übersichtsseite `nasa-oortwolke` verwendet. Kosten:
  gering, ein späterer Zugriff könnte die Zeile um eine tiefere Quelle ergänzen.
- Massenanteile dezimal statt Zehnerpotenz-Schreibweise (`\%` gehört nicht zur TeX-Teilmenge).
  Kosten: keine, reine Stilfrage.
- „mehr als 6000" Exoplaneten mit neuer Quellenkarte `nasa-exoplaneten` (Stand 3.8.2026). Kosten:
  gering.
- Belegzeile 7 (GM_Sonne-Kontrollabweichung), Belegzeile 30 (Bailey/Batygin/Brown-Zuschreibung),
  Belegzeile 33 (Wurzelklick-Dateiangabe) in der Nacharbeit berichtigt (Fachprüferbefunde). Hinweis
  1 (Ray-2012-Zuschreibung) mit „(eigene Rechnung)"-Zusatz entschärft. Hinweis 2
  (Winn-und-Fabrycky-Wortlaut) unverändert gelassen — der Prüfer selbst stufte ihn als „kein
  Fehler" ein, der Wortlaut war in Task 2 bereits über ar5iv wörtlich extrahiert worden. Kosten:
  keine, verbleibt als zur Kenntnis genommener Punkt (§4/§7).

**Task 3 (Szene Das System von oben):**

- Winkelgröße des Systems über die Projektion des Bahnkreises (nah-/fernseitiger Punkt) statt
  der Kugel-Silhouettenformel — Neptuns Bahn ist eine flache Linie in der Ekliptik, keine Kugel;
  eine Kontrollrechnung bei Elevation 90° deckte den rund 22°-Unterschied zwischen beiden Formeln
  auf. Kosten bei Fehlurteil: hoch gewesen wäre die falsche Formel (zentrale, mehrfach zitierte
  Zahl), durch die eigene Kontrollrechnung vermieden.
- Pixelgrößen der inneren Planeten mit Kamera–Sonne-Abstand als Näherung für den
  Kamera–Planet-Abstand (Fehlerspanne rund 4–12 %, offen genannt) — die Marker-Schwelle (3 px)
  liegt mit deutlichem Abstand über den berechneten Werten, ändert das qualitative Ergebnis
  nicht. Kosten: gering.
- Formel $D=1{,}6\cdot f$ statt $D=1{,}6\cdot\text{Faktor}$ (Variable statt deutschem Wort im
  `\text{}`, Formeltest verlangt identische DE/EN-Formelmengen). Kosten: keine.
- Nacharbeit: Winkelsummen-Begründung für Neptuns Bahn korrigiert (der einzelne Nahpunktwinkel,
  nicht die Summe, ist maßgeblich), „höchstens 30 %" auf „bis 30,3 %" berichtigt (dabei
  versehentlich `\%` in einer Formel verwendet, sofort durch reinen Fließtext ersetzt), zwei
  Hinweise (Näherungsfehler-Angabe, Fundstelle „Formel und Werte") präzisiert. Kosten: keine, alle
  vier Punkte wie vom Prüfer eingeordnet behoben.

**Task 4 (Dateitest):**

- `bodies.length` vom Controller aufgelöst (35, nicht 69): Der neue Test prüft die
  Gesamtnamenzahl (69 = 35 Körper + 19 Szenen + 15 Themen), das ist testintern korrekt. Kosten:
  keine.
- Zwei getrennte Importzeilen aus `../themen` statt einer nicht vereinheitlicht (vom Brief
  ausdrücklich erlaubt) — kosmetischer Minderbefund, nicht behoben. Kosten: keine.

**Task 5 (diese Abnahme):** siehe eigener Bericht
`.superpowers/sdd/2026-09-23-phase4d-hochschule-etappe11/task-5-report.md` §7 (Verweis-Selektoren
ohne Tag-Einschränkung, `data-quelle` statt `data-literatur` für Quellenkarten, DE/EN-Randbefund
nicht behoben, Konsolen-Artefakt eingeordnet).

Die 22 Plan-Rulings selbst stehen vollständig im Plan
`docs/superpowers/plans/2026-09-23-phase4d-hochschule-etappe11.md` Abschnitt „Rulings" und sind
inhaltlich in §1 (Freigabe, Reihenfolge, eine Prüfrunde), §2 (Richtwerte), §4 (Prüfschwerpunkte,
Modellzahlen-Übernahme), §5 (Ersatz entfällt) dieses Protokolls eingearbeitet; als Themenliste in
§8.

## 7. Bekannte Unschärfen

**DE-Randbefund in `thema-modell.md` (§5.1):** Der Verweis `quelle:jpl-satelliten-entdeckung`
(Zeile 113–114) rendert nur in der deutschen Fassung nicht als Link. Ursache: Die Zeile „23. Mai
2023, jüngere Nachmeldungen nicht eingerechnet ([JPL SSD Discovery" beginnt am Zeilenanfang mit
„23.", was der Markdown-Renderer als Start einer nummerierten Liste liest und den
Klammerausdruck des Links dabei mitten entzweireißt (`<li>…Discovery</li></ol><p>Circumstances](
quelle:…)…</p>`). Die englische Fassung ist nicht betroffen, weil dort „23 May 2023" nicht am
Zeilenanfang steht. `grep -nE "^[0-9]+\. "` über alle sechs neuen Textdateien bestätigt: Diese
eine Stelle im gesamten Korpus ist betroffen. Sachlich bleibt die Aussage richtig, nur die
Quellenangabe ist an dieser einen Stelle unklickbar und erscheint als literaler Klammerausdruck.
Nicht behoben (keine Text- oder Codeänderung außer Protokoll/README in diesem Task).

**Eine offene Belegfrage bei `thema-sonnensystem` (§4):** Der Wortlaut des Winn-und-
Fabrycky-2015-Zitats „rund die Hälfte der sonnenähnlichen Sterne, 1–4 Erdradien" ließ sich ohne
direkten PDF-Zugriff nicht wörtlich verifizieren (komprimierte PDF-Textströme blockierten die
automatische Extraktion); die Größenordnung ist durch mehrere Sekundärquellen bestätigt, der
Fachprüfer selbst stufte den Punkt als „kein Fehler" ein.

**Kosmetischer Minderbefund in `dateien.test.ts` (§4):** Zwei getrennte Importzeilen aus
`../themen` statt einer zusammengefassten — vom Brief ausdrücklich als zulässige Variante
genannt, nicht behoben.

**Quellen hinter Verlagssperren (HTTP 403/404/405, Login oder Bot-Sperre), je Text (aus den
Task-Berichten):**

- `thema-modell`: Nature-Artikel zur neuen Uranus-Rotationsperiode (DOI
  10.1038/s41550-025-02492-z) hinter einer Login-Sperre; über unabhängige Presseberichte
  (phys.org, sci.news) geprüft, die denselben, bereits in `objekt-uranus.md` fachgeprüften Wert
  bestätigen.
- `thema-sonnensystem`: Dones, Brasser, Kaib und Rickman 2015 (Space Science Reviews) auch als
  Zusammenfassung nirgends erreichbar, nicht zitiert (siehe §6); Souami und Souchay 2012 (A&A)
  und Laskar und Gastineau 2009 (Nature) nur über Crossref-Metadaten plus frei zugängliche
  Sekundärseiten geprüft.

**Code-/Datensatz-Befunde:** Keine neuen über die in der lokalen Projektanleitung bereits
gesammelten hinaus (Ruling 7, Etappe 4d-11 beschreibt den Ist-Code, behebt ihn nicht). Eine
Klärung aus Task 1: Der Hinweis „außerhalb des Genauigkeitsfensters" erscheint sowohl im
Datenblock (`Datenblock.tsx`, `info.ausserhalbFenster`) als auch im Zeit-Bedienfeld
(`TimePanel.tsx`, `model.outOfRange`) — bestätigt, dass die Gymnasialtext-Aussage „der Datenblock
warnt dann" zutrifft (der einzige Fehler dort ist die Zahl „unter 4700 km", siehe §8).

**Widersprüche zwischen fachgeprüften Texten:** Keiner neu gefunden. Der Sonne-Schwerpunkt-
Widerspruch aus Task 1/2 wurde in der Nacharbeit behoben (§4/§6); die bereits aus 4d-10 bekannte
Doppelnennung der Saturn-Apsidenrate (zwei JPL-Näherungstafeln im selben, bereits fachgeprüften
Text `thema-bahnelemente.md`) ist kein neuer Befund dieser Etappe.

**Konsolen-Artefakt (§5.3):** Ein Dev-Server-HMR-„full-reload" bei langem Leerlauf der
WebSocket-Verbindung führte in der ersten, langen Sichtprüfungs-Sitzung zu einem `createRoot`-
Fehler und einer Serie von WebGL-Framebuffer-Warnungen; in einer eng getakteten Kontrollsitzung
mit identischer Interaktionsfolge nicht reproduzierbar, `npm run build` unabhängig fehlerfrei.

**Nachtrag: Datumsangaben am Zeilenanfang (behoben).** Der Randbefund aus §5.1 (ein
`quelle:`-Verweis in `thema-modell` rendert nicht) hatte eine allgemeine Ursache: Der Parser
wertete jede Zeile „<Zahl>. …" als geordneten Listenpunkt, auch mitten im Absatz. Betroffen
waren 20 Zeilen in 18 Dateien (1 deutscher Gymnasialtext, 15 deutsche und 2 englische Hochschultexte),
fast alle Datumsangaben. Seit dem Commit „Markdown: geordnete Listenpunkte unterbrechen keinen Absatz"
gilt: Ein geordneter Punkt unterbricht keinen Absatz; kein Text musste geändert werden, die Textsammlung
enthält danach keine geordnete Liste mehr.

## 8. Halt: Fragen an Jens

**Gymnasialtext-Fehler „unter 4700 km" in `thema-modell.md` (DE, §4/§7 aus Task 1):** Die
fachgeprüfte Zahl für den Abstand Erde-Mond-Schwerpunkt–Erdmittelpunkt ist 4415 bis 4928 km
(`objekt-earth.md`, eigenständig nachgerechnet: 4417–4931 km); der Gymnasialtext nennt „unter
4700 km" — der Maximalwert liegt rund 228 km (knapp 5 %) über dieser Grenze. Ruling 9 des Plans
verbietet eine Änderung an Gymnasialtexten in dieser Etappe. Vorschlag: als eigenen kleinen
Nachführungs-Task vormerken (Regel für Gymnasialtexte aus der lokalen Projektanleitung:
Korrektheit vor Wortzahl).

**DE-Randbefund `quelle:jpl-satelliten-entdeckung` in `thema-modell.md` (§5.1/§7):** Ein durch
Zeilenumbruch verursachter Markdown-Renderfehler macht diesen einen Quellen-Link in der
deutschen Fassung unklickbar (Einzelheiten §7). Vorschlag: kleinen Formfix vormerken (mechanisch,
kleinstes Modell) — die Zeile „23. Mai 2023 …" so umbrechen, dass sie nicht mit einer Ziffer
gefolgt von Punkt beginnt.

**Winn-und-Fabrycky-2015-Wortlaut ohne direkten PDF-Zugriff (§4/§7):** Größenordnung mehrfach
bestätigt, exakter Wortlaut nicht wörtlich verifizierbar, vom Fachprüfer selbst als unkritisch
eingestuft. Vorschlag: zur Kenntnis nehmen, bei Gelegenheit mit direktem PDF-Zugriff nachholen.

**Fünfte Prüfskript-Warnung `mckinnon-2016` und der Falsch-Fehler `trujillo-2007` (§3):** Beide
bereits in früheren Etappen als unkritisch bestätigtes beziehungsweise dokumentiertes Muster.
Vorschlag: wie bisher akzeptieren.

**Modelle (Plan-Ruling 2/Ledger):** Kein Kontingentlimit in dieser Etappe — Text-Umsetzer und
Fachprüfungen (Task 1–3) sowie diese Abnahme liefen auf dem mittleren Modell (sonnet), Task 4
(Dateitest) wie vorgesehen auf dem kleinsten (haiku). Keine offene Frage, nur zur Kenntnis.

**Phase 4d abgeschlossen:** Mit dieser Etappe hat jeder Körper, jede Szene und jedes Thema einen
Hochschultext in Deutsch und Englisch; der Gymnasialersatz im Dateitest entfällt (Task 4). Die
Gesamtabnahme über alle Etappen der Phase 4d steht als eigenes Protokoll noch aus (Plan-Ruling
17, `docs/phase4d-abnahme.md`); Push und Tag `v0.5.0` brauchen ein eigenes Ja von Jens
(Plan-Ruling 1, Plan-Ruling 16).

**22 Plan-Rulings** (von Jens noch nicht bestätigt, vollständiger Wortlaut in
`docs/superpowers/plans/2026-09-23-phase4d-hochschule-etappe11.md` Abschnitt „Rulings"). Als
Themenliste: Freigabe der Etappe durch „weiter mit 4d-11" (1); Modelle wie 4d-4 bis 4d-10 (2);
höchstens eine Prüfrunde je Hochschultext (3); Richtwerte `modell` 2000–4000, `sonnensystem`
1500–4000, Szene 300–900, Obergrenze je ein Drittel darüber (4); Reihenfolge `modell` →
`sonnensystem` → `systemblick` → Code → Abnahmen (5); Gliederung `thema-modell` ohne „Im Modell",
`thema-sonnensystem` mit (6); Befunde am Simulationscode nicht behoben, nur beschrieben (7);
Modellzahlen gleichlautend aus fachgeprüften Texten übernehmen, Widersprüche an Jens (8);
Gymnasialtexte unverändert, gefundene Fehler an Jens (9); Belegarten „Nachrechnung am Code" oder
„fachgeprüfter Text" (10); nur `szene-systemblick` verlinkt aus Hochschultexten auf
`thema:sonnensystem` (11); `info.hochschuleFolgt` bleibt im Code als Schutz, nur der Ersatz im
Dateitest entfällt (12); Vollständigkeitstest zählt gegen `bodies`/`SCENES`/`THEMEN` und die
Gesamtzahl 390, Fachthemen als Liste im Test (13); „Ersatz entfällt" misst vier Wege je Sprache
(14); Gesamtrundgang über 138 Dateien erst in Task 6/Gesamtabnahme, hier Klicktest je Art in
allen drei neuen Texten (15); Fast-Forward auf `master`, Push und Tag `v0.5.0` erst nach Jens'
Ja, Tag sitzt auf dem Endcommit nach der Schlussprüfung (16); Gesamtabnahme als eigenes Protokoll
`docs/phase4d-abnahme.md` (17); keine Formelsatz-Sichtprüfung ohne neuen TeX-Befehl (18);
Literaturkatalog im Hauptbundle unter der 50-kB-Schwelle (19); Katalogform wie 4d-4 bis 4d-10,
Bücher ohne DOI/arXiv/URL nicht zitierfähig (20); Tausendertrennung ab fünf Stellen,
Zahlenspannen mit Geltungsbereich (21); Beleglisten-Nacharbeit nur mit Zellenkontrolle (22).
