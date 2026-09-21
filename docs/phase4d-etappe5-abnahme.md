# Abnahme Phase 4d Etappe 5 „Jupitersystem"

## 1. Umfang

Branch `hochschule-5` (von `master` `fcf9845`, Plan-Commit, 20.09.2026). Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-20-phase4d-hochschule-etappe5.md` (Task 1–7,
18 Rulings). Ledger
`.superpowers/sdd/2026-09-20-phase4d-hochschule-etappe5/progress.md`
(git-ignoriert).

14 Commits über `fcf9845` bis `ca44246`
(`git rev-list --count fcf9845..HEAD`). In Reihenfolge:

| Kurzhash | Titel |
|---|---|
| 8490063 | Hochschultext Jupiter mit Belegliste |
| 06f6037 | Hochschultext Szene Vorbeiflug an Jupiter mit Belegliste |
| 31cecde | Hochschultext Jupiter: Nacharbeit nach der Fachprüfung |
| 37870cc | Hochschultext Szene Vorbeiflug an Jupiter: Nacharbeit nach der Fachprüfung |
| 66fcf4c | Hochschultext Io mit Belegliste |
| 28a6b41 | Hochschultext Europa mit Belegliste |
| 1e3f8c1 | Hochschultext Io: Nacharbeit nach der Fachprüfung |
| fdc19c9 | Hochschultext Ganymed mit Belegliste |
| 4c17e30 | Hochschultext Europa: Nacharbeit nach der Fachprüfung |
| a0cec16 | Hochschultext Kallisto mit Belegliste |
| 2a22387 | Hochschultext Ganymed: Nacharbeit nach der Fachprüfung |
| d684a68 | Hochschultext Szene Das galileische Schattenspiel mit Belegliste |
| afcebbf | Belegliste objekt-callisto: Fachprüfung abgeschlossen |
| ca44246 | Belegliste szene-galileisches-schattenspiel: Fachprüfung abgeschlossen |

Sieben neue Hochschultexte (de/en): `objekt-jupiter`, `szene-jupiter-
vorbeiflug`, `objekt-io`, `objekt-europa`, `objekt-ganymede`, `objekt-
callisto`, `szene-galileisches-schattenspiel`. Kallisto (Task 6) und die
Szene Schattenspiel (Task 7) brauchten nach der Fachprüfung keine Nacharbeit
(0 Fehler); ihre ausgefüllte Prüfspalte kam mit einem eigenen Commit ins
Repository (Gemeinsame Vorgaben Punkt 13). Task 8 (dieses Protokoll, README)
ist ein reiner Dokumentationstask.

## 2. Lint, Tests, Build

Lauf auf `ca44246` (Arbeitsbaum sauber, `git status --short` leer vor diesem
Protokoll):

- `npm run lint` → kein Befund.
- `npm test` → **4279 Tests, 101 Testdateien, alle grün** (Soll laut Plan
  4279 erreicht, keine Zwischen-Tasks in dieser Etappe).
- `npm run build` → `✓ built in 748ms`; nur die bekannte Warnung zu großen
  Chunks. Hauptchunk `index-BQjMCg30.js` **1 363,61 kB**.

### Testzahlen (Quelle: Ledger-Zeilen „Umsetzer/Nacharbeit DONE" je Task, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (master `fcf9845`, nach 4d-4) | — | 4125 |
| 1 | Jupiter | +22 | 4147 |
| 2 | Szene Vorbeiflug an Jupiter | +22 | 4169 |
| 3 | Io | +22 | 4191 |
| 4 | Europa | +22 | 4213 |
| 5 | Ganymed | +22 | 4235 |
| 6 | Kallisto | +22 | 4257 |
| 7 | Szene Das galileische Schattenspiel | +22 | 4279 |

Summe 4125+22·7 = 4279, deckt sich mit dem tatsächlichen `npm test`-Lauf.
Die fünf Nacharbeits-Commits (Task 1, 2, 3, 4, 5) und die zwei
Prüfspalten-Commits (Task 6, 7) ändern nur bestehenden Text beziehungsweise
nur die Spalte „Prüfung"; keiner von ihnen fügt neue Testfälle hinzu (an
keiner Stelle im Ledger ist bei einer Nacharbeit ein Testzuwachs vermerkt).

### Hauptchunk

Ausgangsstand nach Etappe 4d-4: **1 344,76 kB**. Endstand dieser Etappe:
**1 363,61 kB**. Zuwachs: **+18,85 kB** — deutlich unter der 50-kB-Schwelle
aus Plan-Ruling 12; keine Eskalation der Frage „fauler Import des Katalogs"
an Jens nötig.

Zwischenstände aus den Task-Berichten: Task 1 **1 347,63 kB** → Task 3 (Io,
Task 2 selbst meldet nur die Chunk-Warnung ohne genaue Zahl) **1 351,71 kB**
→ Task 4 (Europa) **1 355,80 kB** (Nacharbeit **1 360,19 kB**, da Task 5
bereits obenauf committet war) → Task 6 (Kallisto) **1 362,98 kB** → Task 7
(Szene Schattenspiel) **1 363,61 kB** (diese Abnahme, unverändert seit den
beiden Prüfspalten-Commits, die keinen Code ändern).

### Katalogeinträge

Ausgangsstand **372** (Plan, entspricht dem Endstand aus Etappe 4). Endstand
**442** (`grep -c "id: '" src/data/literatur.ts`, selbst nachgezählt).
Zuwachs je Task, aus `git diff <Basis> <Commit> -- src/data/literatur.ts`
selbst nachgezählt (nicht aus den Berichten übernommen, da Task 5 dort
„18 neue Einträge" nennt, der Diff aber 17 zeigt — siehe §7):

| Task | neue Einträge | Katalog danach |
|---|---|---|
| 1 (Jupiter) | 11 | 383 |
| 2 (Szene Vorbeiflug) | 3 | 386 |
| 3 (Io) | 12 | 398 |
| 4 (Europa) | 16 | 414 |
| 5 (Ganymed) | 17 | 431 |
| 6 (Kallisto) | 10 | 441 |
| 7 (Szene Schattenspiel) | 1 | 442 |

372 + 11 + 3 + 12 + 16 + 17 + 10 + 1 = 442, deckt sich mit dem gezählten
Katalogstand. Keiner der fünf Nacharbeits-Commits und keiner der beiden
Prüfspalten-Commits ändert `src/data/literatur.ts` (einzeln per
`git show <Commit> --stat -- src/data/literatur.ts` geprüft, leer in allen
sieben Fällen).

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog), Start-/Endzeitpunkt per
Unix-Zeitstempel vor und nach dem Kommando gemessen (1789972562 →
1789973054):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 442 von 442 Einträgen
[... 526 Zeilen, davon 523 „ok" ...]
cgpm-2022                     crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
greaves-2021                  crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
korablev-2019                 crossref  warnung  Crossref führt die Körperschaft „The ACS and
                                                  NOMAD Science Teams" zuerst, Erstautor
                                                  „Korablev, O." steht unter den weiteren Autoren

523 ok, 3 Warnungen, 0 Fehler
```

**Laufzeit:** 492 Sekunden (8:12 min; Ausgangsstand 460 s bei 372 Einträgen
nach 4d-4 — der Katalog ist um 70 Einträge gewachsen, die Laufzeit liegt
plausibel etwas darüber). Keine Zeile mit `429` (`grep -c 429` auf der
vollständigen Ausgabe: 0 Treffer).

**Drei Warnungen, alle drei bereits aus früheren Etappen bekannt und dort
begründet (keine davon durch einen der 70 neuen Katalogeinträge dieser
Etappe verursacht):**

- `cgpm-2022` — Crossref führt die 28. Generalkonferenz für Maß und Gewicht
  als Körperschaft, nicht als Person (seit Etappe 2 akzeptiertes Verhalten).
- `greaves-2021` — Crossref führt das Online-Erstjahr (2020), der Katalog
  das Druckjahr der Ausgabe (2021); in Etappe 4 (Venus) so begründet.
- `korablev-2019` — genau der von der Prüfskript-Lockerung aus Etappe 4
  (Zwischen-Task 5a) beabsichtigte Effekt: Crossref führt die
  Kollektivbezeichnung zuerst, die tatsächliche Nature-Kopfzeile Korablev
  als Erstautor.

## 4. Fachprüfung

Zahlen aus den `task-N-report.md`/`task-N-befunde.md`-Dateien, gegengerechnet
gegen die aktuellen Dateien im Arbeitsbaum (`wc -w`, Zeilenzählung der
Beleglisten-Tabellen mit `grep -cE "^\| [0-9]+[a-z]?\s*\|"`, eindeutige
`literatur:`-Verweise je Text per `grep -oE`). Je Text genau eine
Fachprüfung; sechs von sieben Texten mit genau einer Nacharbeit, zwei
(Kallisto, Szene Schattenspiel) ohne Nacharbeit (0 Fehler).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| `objekt-jupiter` (Jupiter) | 2726 / 2995 | 72 | 27 | 11 | 3 / 2 (F1 Westdrift-Zahl bestritten, siehe §8) | Zeile 68 „im Mittel" ergänzt (behoben); Zeile 7/41/43 bereinigt (behoben) |
| `szene-jupiter-vorbeiflug` | 994 / 1109 | 30 | 4 | 3 | 1 / 1 (F1 Uhrzeit ohne Beleg gestrichen) | Nr. 13 (grobe Mond-Stichprobe) und die nicht verlinkte Karte `nssdc-jupiter` bewusst unverändert (unschädlich) |
| `objekt-io` | 2451 / 2703 | 72 | 17 | 12 | 0 / 0 | H1 Trägheitsmomentfaktor 0,377 hergeleitet (behoben), H3 Belegzeile Juno-Termine ergänzt (behoben); H2 Beobachtungszeitraum 1891–2007 unverändert (siehe §7) |
| `objekt-europa` | 2624 / 2885 | 71 | 20 | 16 | 1 / 1 (F1 „tilt 0,019° wie bei Io" verwechselte zwei Größen) | H1 Exzentrizität 0,009 mit Quelle ergänzt (behoben), H4 beide Achsneigungswerte genannt (behoben); H2 Knotenperiode ohne Zweitquelle, H3 Pappalardo-1999-Zahl ungeprüft unverändert (siehe §7) |
| `objekt-ganymede` | 2615 / 2900 | 71 | 20 | 17 | 2 / 2 (F1 „äußerster" statt drittinnerster, F2 Europas Exzentrizität falschem Thema zugeordnet) | H1 Rangvergleich ohne Beleg entschärft (behoben); H2–H5 (Beleglage, JUICE-Jahr, Fundstellen-Ungenauigkeit) unverändert (siehe §7) |
| `objekt-callisto` | 2747 / 3017 | 65 | 16 | 10 | 0 / 0 (keine Nacharbeit nötig) | 13 Hinweise, alle von der Fachprüfung ausdrücklich als „keine Änderung erforderlich" bewertet (siehe §7/§8) |
| `szene-galileisches-schattenspiel` | 1021 / 1159 | 37 | 2 | 1 | 0 / 0 (keine Nacharbeit nötig) | keine (0 Hinweise; siehe §8 zur Auffälligkeit dieses Ergebnisses) |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und
Trennzeile) unter `docs/belege/hochschule/`. Zitate sind die eindeutigen
`literatur:`-Kennungen je Text (`grep -oE '\(literatur:[a-z0-9-]+\)'` auf der
deutschen Fassung, mit der englischen abgeglichen — beide Fassungen zählen
identisch), deckungsgleich mit den im Browser gemessenen Literaturkarten
(§5.1). Wortzahlen `wc -w` auf den aktuellen Dateien in
`src/data/texte/<sprache>/hochschule/`.

Modellzahlen aus den bereits fachgeprüften Texten (`thema-resonanzen`,
`thema-gezeiten`, `thema-gebundene-rotation`, `thema-finsternis`,
`thema-innerer-aufbau`, `thema-photometrie`, `thema-entstehung`) wurden nach
Ruling 7 gleichlautend übernommen; wo die eigene Nachrechnung abwich (Jupiter
Sonnenwinkelradius, Kallisto-Poldeviation-Nachrechnung), steht die Abweichung
im Bericht, nicht im Text (siehe §7/§8).

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}'
http://localhost:5173/Orrery/` → 200), kein zweiter gestartet.
`window.store.setState({ quality: { tier: 'high' } })` direkt nach
`browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung
(Niveau Hochschule, Panel eingehängt, `breiteRem: 40`).

### 5.1 Rundgang

Alle 14 Kombinationen (sieben Kennungen × de/en) angefahren: Körper über
`setInfo({thema:null})` + `setCamera({targetId, mode:'free'})`, Szenen über
`setCinema({running:true, shuffle:false, nummer, elapsedSec:0,
pauseOnInput:false})` + `setCamera({mode:'cinema'})`, danach
`setCinema({running:false})`, `setTime({paused:true})` und
`setUi({hidden:false})`.

**Messfalle bestätigt (wie in Abnahme 4d-4 dokumentiert):** Beim Kino-Polling
hält `ui/idle.ts` nach drei Sekunden ohne Eingabe die gesamte Oberfläche
verdeckt; behoben durch periodische synthetische `pointermove`-Ereignisse
während des Pollens (`pauseOnInput:false` bleibt gesetzt) und `elapsedSec:0`
bei jedem Szenenstart. Beide Szenen stabilisierten sich danach innerhalb von
rund 200 ms.

**Eigene Messfalle in dieser Etappe gefunden und behoben:** Beim
Klicktest der Verweisart `szene:` innerhalb einer bereits laufenden Szene
(Schritt 3, siehe unten) muss die Wiederherstellungsfunktion zwischen den
Einzeltests auch `setInfo({thema:null})` setzen — ohne das blieb nach einem
`thema:`-Klick das zuvor gewählte Fachthema aktiv, und das Infopanel zeigte
beim nächsten Testschritt das Fachthema statt der erwarteten Szene (Panel
zeigt bei gesetztem `ui.info.thema` vorrangig den Thementext, unabhängig vom
Kino-Zustand). Nach der Korrektur liefen alle Einzeltests sauber.

**Kernkriterien, alle 14 Kombinationen:** `formelfehler` **0**, keine
Hinweiszeile (insbesondere keine `info.hochschuleFolgt`/„Der Hochschultext
folgt …"), `zitateGleichKarten` **true**.

**14 von 14 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `objekt:jupiter` | Jupiter | Jupiter | 70 | 1 | 27 |
| `objekt:io` | Io | Io | 54 | 1 | 17 |
| `objekt:europa` | Europa | Europa | 39 | 1 | 20 |
| `objekt:ganymede` | Ganymed | Ganymede | 53 | 1 | 20 |
| `objekt:callisto` | Kallisto | Callisto | 44 | 1 | 16 |
| `szene:jupiter-vorbeiflug` (Nr. 6) | Szene: Vorbeiflug an Jupiter | Scene: Flyby of Jupiter | 9 | 0 | 4 |
| `szene:galileisches-schattenspiel` (Nr. 7) | Szene: Das galileische Schattenspiel | Scene: The Galilean shadow play | 4 | 0 | 2 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (gemessen in
beiden Läufen).

**Klicktest je Verweisart:** Je Kombination wurde von jeder vorhandenen
Verweisart (`objekt`, `thema`, `szene`, `quelle`, `literatur`) ein Vorkommen
einzeln durch Auslesen des `data-verweis`-Attributs und `element.click()`
ausgelöst — die Kombination wurde vor jedem Einzeltest frisch aufgebaut
(inklusive `setInfo({thema:null})`, siehe Messfalle oben), damit ein
navigierender Klick die Prüfung der nächsten Art nicht verfälscht. Die
Wirkung wurde gegen die Tabelle im Brief geprüft (`objekt` →
`camera.targetId`; `thema` → `ui.info.thema`; `szene` → `cinema.nummer` +
`camera.mode==='cinema'`; `quelle`/`literatur` → Kartenklasse enthält
`border-sky-300`, Klick und Prüfung in einem `browser_evaluate`), danach der
Ausgangszustand wiederhergestellt. `objekt:jupiter` hat keinen eigenen
`szene:`-Verweis im Text (Jupiter ohne Abschnitt „Oberfläche" verweist auch
sonst nicht auf eine Szene, kein Fehler) — dort blieben 4 statt 5 Arten
testbar.

**Ergebnis: 68 von 68 anwendbaren Klicktests trafen** (6 Kennungen mit allen
fünf Arten × 2 Sprachen + 1 Kennung mit vier Arten × 2 Sprachen =
6·5·2 + 1·4·2 = 60 + 8 = 68). Alle Treffer: `objekt` → `camera.targetId`
stimmt (Kamerafahrt nach 1,5–1,7 s abgewartet); `thema` → `ui.info.thema`
stimmt; `szene` → `cinema.nummer` traf den erwarteten Index (6 für
`jupiter-vorbeiflug`, 7 für `galileisches-schattenspiel`) samt
`camera.mode==='cinema'`; `quelle`/`literatur` → Karte trug `border-sky-300`.

### 5.2 Ersatz entfällt

Vier Messungen, Wartezeit bis zum Kopfwechsel (`performance.now()`):

| Messung | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|
| `thema-resonanzen` → `objekt:io` (de) | Io | keine | 56,3 ms |
| `thema-finsternis` → `objekt:jupiter` (de) | Jupiter | keine | 62,2 ms |
| `thema-resonanzen` → `objekt:io` (en) | Io | keine | 48,1 ms |
| `thema-finsternis` → `objekt:jupiter` (en) | Jupiter | keine | 58,4 ms |

Alle vier Messungen ohne Hinweiszeile: Die vorher an `objekt:io`
beziehungsweise `objekt:jupiter` gezeigte Ersatz-Hinweiszeile „Der
Hochschultext folgt …"/„The university-level text will follow …" ist
entfallen, weil diese Etappe die entsprechenden Hochschultexte liefert.

### 5.3 Konsole

`browser_console_messages` (seit dem Navigate, `all: true`, Ebene `debug`):
**0 Fehler, 0 Warnungen** über die gesamte Sitzung — nur zwei Vite-
Verbindungsmeldungen und der React-DevTools-Hinweis (beides Standard-
Entwicklungsmeldungen, keine neuen Einträge durch diese Etappe).

**Gegenprobe (Vorgabe des Briefs) durchgeführt:** Auf `objekt:io`
angefahren, echter `browser_click` auf den `szene:galileisches-
schattenspiel`-Verweis im Text. Ergebnis: Das Kino startete korrekt
(`cinema.nummer=7`, `camera.mode='cinema'`, `document.fullscreenElement===
true`), **kein neuer Konsoleneintrag** (weiterhin 0 Fehler/0 Warnungen).
Anders als in Abnahme 4d-4 §5.3 trat die dort als Klick-Artefakt
beschriebene Warnung „Vollbild ohne Nutzergeste" in dieser Etappe **an
keiner Stelle** auf — weder bei den synthetischen `.click()`-Aufrufen des
Klicktests noch bei der echten Gegenprobe. Da beide Fälle gleich (sauber)
ausfielen, war keine Sonderbehandlung nötig. Fullscreen und Kino danach
beendet, Ausgangszustand wiederhergestellt.

Playwright-Aufnahmen (`console-*.log`, `page-*.yml` unter `.playwright-mcp/`)
wurden vor dem Commit gelöscht, keine Skripte im Projektstamm angelegt.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge.

**Controller-Ruling:**

- **Ruling:** Vorprüfung ohne Konflikt; Ausführung beginnt mit Task 1
  (Jupiter) auf sonnet — Kosten bei Fehlurteil: eine Fixrunde.

**Task 1 (Jupiter):**

- **Ruling:** Das WebSearch-Kontingent der Sitzung war zu Beginn der
  Recherche bereits erschöpft (0 von 200, vermutlich durch vorherige
  Sitzungen desselben Kontos verbraucht); die gesamte Literaturrecherche
  lief stattdessen über WebFetch (Crossref-API, Semantic-Scholar-API, arXiv,
  Verlagsseiten, NAIF-SPICE-Kernel `pck00011.tpc`, NSSDC/NASA/ESA-Seiten) —
  später im Ledger noch einmal ausdrücklich für die ganze Etappe bestätigt
  (siehe unten).
- **Ruling:** Bagenal et al. 2017 „Magnetosphärische Wissenschaftsziele"
  (Brief: Space Science Reviews 213, 219) war weder über Crossref-
  Autorensuche noch über gezielte Bibliografiesuche auffindbar (die einzige
  gefundene Bagenal-Arbeit von 2017 in Space Science Reviews 213 ist „The
  Juno Mission", anderer Titel und andere Seitenzahl); nicht zitiert.
  Magnetosphären-Absatz stattdessen auf Connerney et al. 2022 (JRM33) und
  NASA-Quellen gestützt.
- **Ruling:** Für Adriani et al. 2018 (Polarzyklone) hielt der Verlag die
  Zusammenfassung bei jedem Abrufversuch zurück; die im Brief erwartete
  Südpol-Zyklonzahl wurde deshalb nicht übernommen, da sie in keiner selbst
  geöffneten Quelle bestätigt werden konnte. Der Text nennt nur die über die
  NASA-Juno-Seite direkt bestätigte Nordpol-Zahl.
- **Ruling:** Der Sonnenwinkelradius „0,051°" aus dem fachgeprüften
  `thema-finsternis.md` wurde gleichlautend übernommen (Ruling 7 der
  gemeinsamen Vorgaben), obwohl die eigene Nachrechnung mit der exakten
  heliozentrischen J2000-Position 0,0536° ergibt (die Vorlage rechnet mit
  der mittleren Entfernung); im Belegeintrag Nr. 68 vermerkt, Text nicht
  geändert.
- **Ruling:** `iess-2018`, `wahl-2017`, `durante-2020`, `militzer-2022`,
  `militzer-2023`, `archinal-2018`, `mallama-2017` wiederverwendet;
  `gomez-casajus-2022`, `peale-1979`, `peale-2002`, `yoder-1981`,
  `fuller-2016`, `lainey-2009`, `canup-2001` dagegen nicht zitiert — ihr
  Inhalt gehört zu den Cross-Referenzen `thema:gezeiten`/`thema:resonanzen`,
  nicht zu einer eigenen Aussage über Jupiter selbst.
- **Ruling:** Große Zahlen innerhalb von Formeln (`$…$`) ohne
  Tausendertrennzeichen geschrieben, weil das bestehende Korpus
  (`objekt-earth.md`, `objekt-mars.md`) das durchgängig so hält; die
  Tausendertrennung nach den gemeinsamen Vorgaben gilt nur für Zahlen im
  Fließtext.

**Nacharbeit Task 1:**

- **Ruling:** F1 (angebliche Westwärtsdrift 0,26°/Tag statt 0,026°/Tag in
  den 1980ern) **nicht** übernommen. Eigene Prüfung der rohen
  Crossref-JATS-Abstract-XML (Simon et al. 2018) ergibt wörtlich
  „∼0.°026/day in the 1980s to ∼0.°36/day currently" — die AAS-Konvention
  setzt das Gradzeichen mitten in die Ziffernfolge; liest man die Ziffern
  ohne das Gradzeichen, ergeben sich konsistent 0,026 und 0,36. Eine zweite,
  unabhängig abgerufene Zusammenfassung nennt ebenfalls „0.026°/day". Die
  Verlagsseite selbst blieb blockiert. Zeile 36 der Belegliste bleibt
  unverändert (Prüfung des Fachprüfers erhalten, keine Nachprüfung nach der
  Regel); die abgeleitete Zahl „rund 130°/Jahr" in „Im Modell" ist davon
  unberührt (nutzt nur den unstrittigen Wert 0,36°/Tag). Diese Entscheidung
  ist im Ledger doppelt vermerkt: einmal ausführlich in der Nacharbeit-
  Zusammenfassung, einmal knapp in der Statuszeile „Ruling des Umsetzers,
  vom Controller bestätigt".

**Nach Task 2:**

- **Ruling:** Das WebSearch-Kontingent der Sitzung ist erschöpft; Umsetzer
  und Prüfer arbeiten für den Rest der Etappe mit WebFetch (Crossref,
  doi.org, arXiv, ADS, Verlagsseiten). Nicht auffindbare Werke werden nicht
  zitiert; die Abnahme nennt in §8, welche Ausgangspunkte deshalb fehlen —
  Kosten bei Fehlurteil: dünnere Beleglage, im Protokoll sichtbar.

**Nach Task 5 (Monatslimit):**

- **Ruling:** Nacharbeit Task 5 und Fachprüfung Task 6 brachen am
  21.09.2026 am Monatslimit ab (HTTP 429, Wochenlimit für sonnet bis
  25.09. 20 Uhr), ohne Änderungen im Arbeitsbaum. Nach „weiter" (Jens):
  beide Aufträge auf haiku neu gestartet (Nacharbeit mit frischem Umsetzer,
  der Bericht als Gedächtnis) — Kosten bei Fehlurteil: schwächere Prüfung,
  im Protokoll §8 vermerkt.

**Vor Task 7 (Fachprüfung):**

- **Ruling:** Fachprüfung Task 7 lief ebenfalls auf haiku statt sonnet
  (Monatslimit weiterhin bis 25.09.) — Kosten bei Fehlurteil: flachere
  Prüfung, für §8 vermerkt.

**Abschluss (Task 8 und Schlussprüfung):**

- **Ruling:** Die Task-Prüfung zu Task 8 wird in die Schlussprüfung
  eingefaltet: Das Paket der Schlussprüfung enthält Protokoll und README
  vollständig, eine getrennte Prüfung desselben Diffs wäre ein Duplikat —
  Kosten bei Fehlurteil: ein Befund am Protokoll erst in der Nacharbeit
  nach der Schlussprüfung.
- **Ruling:** Die Modellnamen „sonnet" und „haiku" bleiben im Protokoll:
  Dieselbe Schreibweise steht seit 4d-2 in den Protokollen 4d-2 bis 4d-4,
  in den Plänen der Flug-Etappen und im Plan dieser Etappe auf `master`;
  eine Umbenennung nur hier wäre inkonsistent, die lokale Projektanleitung
  verbietet allein die Anbieternamen — Kosten bei Fehlurteil: eine
  Ersetzungsrunde über mehrere Protokolle, falls Jens die Namen nicht will.

## 7. Bekannte Unschärfen

**Zur Umsetzung dieser Etappe:**

- **Task 5, Katalogzahl im Bericht ungenau.** `task-5-report.md` nennt „18
  neue Einträge" und einen Katalogsprung „von 426 auf 431"; beide Angaben
  sind in sich nicht konsistent (ein Sprung um 5 bei angeblich 18 neuen
  Einträgen) und weichen vom nachgerechneten `git diff`-Befund (17 neue
  Einträge, 414 → 431) ab. Betrifft nur die Berichtsangabe, nicht den
  tatsächlichen Katalog oder die Tests (§2 dieses Protokolls nennt die
  nachgerechnete Zahl).
- **Task 2, Prüfspalte zunächst leer im Arbeitsbaum.** Wie schon in Etappe
  4d-4 vermerkt: Der Fachprüfer kündigte die ausgefüllte Spalte „Prüfung"
  an, der Arbeitsbaum zeigte sie zu Beginn der Nacharbeit aber leer; der
  Umsetzer trug die 29 unveränderten Verdikte aus `task-2-befunde.md`
  nachträglich ein. Kein Aussagefehler, aber ein wiederholter Prozess-
  Schwachpunkt trotz der in 4d-4 gezogenen Lehre.
- **Mehrere Texte zitieren Arbeiten ohne bei Crossref/Semantic Scholar
  registrierte Zusammenfassung** über Titel, Metadaten oder eine bereits
  fachgeprüfte Nachbarquelle statt über eine direkt geöffnete Zusammen-
  fassung: Task 1 (`adriani-2018`, `bolton-2017`, `boss-1997`, `brown-2018`,
  `guillot-2018`, `helled-2022`, `higgins-1997`, `kaspi-2018`); Task 3
  (`anderson-2001`, `tyler-2015`); Task 4 (`anderson-1998`, `zahnle-2003`,
  `hussmann-2004`, `geissler-1998`, `jia-2018`, `hall-1995`); Task 5
  (`anderson-1996`, `kivelson-1996`, `kivelson-2002`, `christensen-2015`,
  `hussmann-2006`, `patterson-2010`, `schenk-2001`, `showman-1997`,
  `bland-2009`, `barr-2010`); Task 6 (`anderson-2001a`, `khurana-1998`,
  `zimmer-2000`, `nagel-2004`, `cunningham-2015`). In allen Fällen wurde
  jede Angabe selbst geöffnet (mindestens Titel/Metadaten über Crossref),
  nicht aus dem Gedächtnis zitiert (Entwurf §6.1).
- **Task 2, G. A. Flandro 1966 nicht zitierbar:** ADS antwortete mit HTTP
  405, Semantic Scholar mit HTTP 429; die Hyperbelherleitung stützt sich
  ersatzweise auf das bereits im Katalog stehende Lehrbuch Murray und
  Dermott 2000, dessen einschlägiges Kapitel nicht online einsehbar war —
  die Fachprüfung hat die Formelphysik selbst unabhängig nachgerechnet und
  für korrekt befunden.
- **Task 3, Beobachtungszeitraum „1891 bis 2007" (Lainey et al. 2009) ohne
  wörtliche Bestätigung** (Hinweis H2 der Fachprüfung, nach der Nacharbeit
  bewusst unverändert, da nach der Regel „höchstens eine Prüfrunde" keine
  weitere Rechercherunde nur für dieses Detail vorgesehen ist).
- **Task 4, Knotenperiode Europas (30,202 Jahre) ohne unabhängige
  Zweitquelle** (Hinweis H2, `www.aanda.org`/ADS beide blockiert, auch in
  der Fachprüfung erneut versucht und erneut blockiert) und **Pappalardo
  1999 als mögliche zweite Quelle für ein globales Oberflächenalter**
  (Hinweis H3, nur über eine KI-Zusammenfassung gefunden, nicht am Volltext
  gegengelesen) — beide unverändert, keine Pflicht zur Änderung.
- **Task 5, vier strukturelle Hinweise unverändert** (H2 Knotenperiode ohne
  Zweitquelle, H3 Pappalardo-1999-Oberflächenalter ungeprüft — beide wie in
  Task 4 bereits offen; H3/H4/H5 der Fachprüfung zu Fundstellen-
  Ungenauigkeiten und zehn Arbeiten ohne zugängliches Abstract): laut
  Auftrag des Controllers nur F1, F2 und H1 in der Nacharbeit behoben.
- **Task 6, fünf Arbeiten mit blockiertem Volltext** (`anderson-2001a`,
  `khurana-1998`, `zimmer-2000`, `nagel-2004`, `cunningham-2015`); die
  Zahlenwerte aus `anderson-2001a` (Trägheitsmomentfaktor 0,3549 ± 0,0042,
  Kernobergrenze 600 km, Kerndichte 3,1–3,6 g/cm³) stützen sich auf eine mit
  Fußnote auf diese Arbeit versehene Wikipedia-Stelle, da der Volltext
  nirgends frei zugänglich war — von der Fachprüfung ausdrücklich als
  „nicht ideal, aber unter Zugänglichkeitsbedingungen angemessen" bewertet.
- **Task 6, Moore et al. 2004 (Kallisto-Kapitel) nicht auffindbar:** trotz
  mehrerer Anläufe (Crossref, Semantic Scholar, ADS, Google Books, Cambridge
  Core, NTRS) keine verlässliche Seitenzahl gefunden; die Valhalla-
  Beschreibung stützt sich stattdessen auf die USGS-Gazetteer (3000 km) und
  `quelle:nasa-jupitermonde`.
- **Task 7, Bobis und Lequeux 2008 nicht selbst im Volltext gelesen:** der
  einzige online gefundene Scan trägt keine Textebene (`pdftoppm` auf dem
  Rechner nicht installiert); die Aussage zu Rømer/Längengrad stützt sich
  auf dieselbe, bereits fachgeprüfte Kurzfassung wie in `objekt-io.md`/
  `thema-finsternis.md`.
- **Task 7, Arlot et al. 2014 ohne Zusammenfassung zitiert** (Crossref führt
  keine, kein Vorabdruck auffindbar) — Aussage im Text bewusst nur auf
  Titel und bibliografische Angaben gestützt.

**Befunde am Simulationscode** (die Texte beschreiben sie, wie Plan-Ruling 6
verlangt; nicht behoben, Kandidaten für eigene Tasks):

- **Ruling 6 selbst (übergreifend, alle Texte):** Perijoven von Io und
  Europa laufen im Datensatz vorwärts statt rückwärts (seit 4d-2 bekannt);
  Mondbahnen im Äquatorbezug statt in der eigenen Laplace-Ebene; Io mit
  `i = 0` (Knoten dadurch wirkungslos, analytisch in Task 3 selbst
  hergeleitet); Jupiter als Kugel ohne Abplattung und ohne Ring; feste Pole;
  Nullmeridiane 0 gegen den amtlichen $W_0$; System-III-Rotation der
  Wolkentextur ohne den separat driftenden Großen Roten Fleck.
- **Task 1 (Jupiter):** `jupiter.ts` führt kein `appearance.rings`, obwohl
  Jupiter real ein (schwaches) Ringsystem hat (NSSDC bestätigt „Planetary
  ring system: Yes") — in keinem früheren Protokoll erwähnt.
- **Task 3/4 (Io, Europa):** Die Bahnelementtafel-Spalte P in
  `jupiter-monde.ts` ist für Io (0,36 % Abweichung) und Europa (0,72 %)
  fehlerhaft — durch zwei unabhängige Kepler-Gegenrechnungen je Mond
  bestätigt (Umlaufzeit aus `LDot` gegen `umlaufzeitTage()`). Für Ganymed
  (0,0046 %) und Kallisto (0,0067 %) ist die Spalte dagegen unauffällig —
  der Kopfkommentar markiert nur Io/Europa als fehlerhaft, was beide
  Gegenproben bestätigen.
- **Task 4 (Europa):** Europas Katalogmasse (vier signifikante Stellen)
  erzeugt über $G$ eine um 297 ppm zu hohe abgeleitete $GM$ — deutlich mehr
  als bei Io (0,026 %) oder dem Mond, eine reine Rundungsfolge der
  Faktenblatt-Massenangabe, kein Programmfehler.
- **Task 4 (Europa), Gymnasialtext-Diskrepanz (kein Fehler, aber
  vermerkt):** Die Gymnasium-Eisschalenspanne „15 bis 25 km" liegt deutlich
  unter dem im Hochschultext zitierten Howell-2021-Bereich (23 bis 47 km,
  wahrscheinlichster Wert 24,3 km) — beide Zahlen sind für sich aus
  zitierbaren Quellen plausibel (ältere geologische Schätzung gegen neueres
  Wärmegleichgewichtsmodell), passen aber nicht bruchlos zusammen. Der
  Gymnasialtext bleibt unverändert (Auftrag: melden, nicht ändern).
- **Task 5 (Ganymed):** Schattenschwelle 3,745° liegt nur 0,63° über
  Jupiters nachgerechneter Achsneigung (3,1200°) — ein schmalerer
  Sicherheitsabstand als bei Io (6,4°) oder Europa (2,9°); numerisch
  unproblematisch (Ganymed wirft im Modell immer einen Schatten), aber
  knapper als die reine 9,5°/2,1°-Gegenüberstellung von Io/Kallisto in
  `thema-finsternis` vermuten lässt.
- **Task 6 (Kallisto), Gymnasialtext-Beobachtung (kein Fehler):** Valhalla
  „rund 3800 km" (Gymnasium) gegen die USGS-Gazetteer-Ausdehnung des
  offiziell benannten Features (3000 km) — beide Zahlen sind mit der
  Fachliteratur vereinbar (Bildaufnahmen zeigen regelmäßig schwächere, weiter
  außen liegende Ringe über die kartierte Grenze hinaus), daher zwei
  plausible Maße derselben Struktur statt eines Fehlers.
- **Task 7 (Szene Schattenspiel), Code-Kommentar unrichtig:** Der Kommentar
  in `scenes.ts` zur Szene `galileisches-schattenspiel` behauptet, Kallistos
  Bahn reiche „am unteren Rand der Abstands-Variation gelegentlich über den
  Bildrand hinaus". Die vollständige geometrische Nachrechnung (nicht die
  einfache Linearnäherung) zeigt: Kallistos Bahn überschreitet die
  Bildhälfte bereits beim Grundwert (Streufaktor 1,0) mit 29,5° statt der
  verfügbaren 25° und passt erst ab Faktor ≈ 1,1667 vollständig ins Bild —
  bei gleichverteiltem Streufaktor betrifft das Überschreiten **52,4 %**
  aller Ziehungen, nicht nur „gelegentlich". Der Text folgt der eigenen
  Nachrechnung; der Kommentar in `scenes.ts` bleibt unverändert (kein Code
  in dieser Etappe geändert, Randbedingungen).

**Keine gemeldeten Fehler in Gymnasialtexten in dieser Etappe** (anders als
in 4d-3/4d-4): Alle sieben Umsetzer prüften den jeweiligen Gymnasialtext
gegen die eigene Recherche und fanden keinen sachlichen Fehler; die beiden
oben genannten Diskrepanzen (Europa-Eisschale, Kallisto-Valhalla) wurden von
den Umsetzern selbst ausdrücklich **nicht** als Fehler, sondern als zwei
gleichermaßen plausible Zahlen bewertet.

## 8. Halt: Fragen an Jens

**Strittige Zahl, Großer Roter Fleck (Task 1, F1):** Der Umsetzer der
Nacharbeit widerspricht der Fachprüfung zur Westwärtsdrift des Großen Roten
Flecks in den 1980er-Jahren: Text/Belegliste nennen weiterhin „0,026°/Tag",
die Fachprüfung hatte „0,26°/Tag" (Faktor 10) verlangt. Grundlage des
Widerspruchs ist die AAS/IOP-Typografiekonvention, bei der ein Gradzeichen
mit dem `\fdg`-Makro mitten in die Ziffernfolge gesetzt wird (`0.°026`
bedeutet „0,026°", nicht „0,26°" mit verschobenem Punkt). Zwei unabhängig
abgerufene Crossref-Zusammenfassungen derselben Arbeit (Simon et al. 2018)
lesen sich übereinstimmend als „0.026°/day in the 1980s"; die Verlagsseite
selbst (IOP/PSJ) ließ sich weder beim Umsetzer noch in der Nacharbeit direkt
öffnen (Bot-Sperre), ein visueller Vergleich mit dem tatsächlich gesetzten
Zeichen war deshalb nicht möglich. Vorschlag: Zahl „0,026°/Tag" so lassen
(zwei unabhängige Rohtextabrufe plus die Konsistenzprobe am unstrittigen
Wert 0,36°/Tag sprechen dafür); sollte jemand mit sichtbarem Zugriff auf die
IOP-Seite das Gegenteil bestätigen, ist nur Belegzeile 36 und die Zahl in
beiden Textfassungen (DE Z. 116, EN Z. 112) zu ändern.

**Modelle unter Zeitdruck (Task 5/6/7):** Wegen des Monatslimits für sonnet
(erreicht am 21.09.2026, Reset 25.09. 20 Uhr) liefen die Nacharbeit von
Task 5 (Ganymed) und die Fachprüfungen von Task 6 (Kallisto) und Task 7
(Szene Schattenspiel) auf dem kleinsten Modell (haiku) statt wie geplant auf
sonnet:

- Fachprüfung Kallisto (haiku): 52 ok / 0 Fehler / 13 Hinweise — deutlich
  mehr Hinweise als jede sonnet-Fachprüfung dieser Etappe (Task 1–5 lagen
  zwischen 1 und 5 Hinweisen bei 0–3 Fehlern), aber inhaltlich wirkt der
  Bericht selbst eher wie eine breite, wohlwollende Bestätigung bestehender
  Unsicherheiten als eine kritische Prüfung mit eigenständigen neuen Funden
  (er ist zudem im Ton auffällig anders formuliert als die sonnet-Berichte,
  mit zusammenfassenden Bewertungssätzen statt reiner Zeile-für-Zeile-Prüfung).
- Fachprüfung Szene Schattenspiel (haiku): 37 ok / 0 Fehler / 0 Hinweise —
  das einzige 0/0-Ergebnis der ganzen Etappe, auffällig glatt gegenüber den
  sonnet-Prüfungen (die alle mindestens einen Hinweis fanden).

Frage: Sollen diese drei haiku-Ergebnisse (Nacharbeit Ganymed, Fachprüfungen
Kallisto und Schattenspiel) als ausreichend gelten, oder soll nach dem
25.09. eine der beiden Fachprüfungen mit sonnet wiederholt werden? Die
Regel „höchstens eine Prüfrunde je Text" spricht gegen eine Wiederholung;
die Auffälligkeit der Ergebnisse (0/0 bei Kallisto/Schattenspiel gegenüber
1–3 Fehlern bei jeder sonnet-Prüfung) spricht dafür, das hier ausdrücklich
zu vermerken statt stillschweigend zu übernehmen.

**Katalogzahl-Ungenauigkeit im Bericht (Task 5, siehe §7):** `task-5-
report.md` nennt „18 neue Einträge", der nachgerechnete `git diff` zeigt 17.
Kein Sachfehler (Katalog und Tests sind korrekt, siehe §2), nur eine
fehlerhafte Angabe im Bericht selbst — als Beleg dafür vermerkt, dass auch
Berichtszahlen nachzurechnen sind (wie im Auftrag dieser Abnahme verlangt).

**Code-Befunde, als Kandidaten für eigene Tasks (siehe §7 für Details):**

- Jupiter ohne Abplattung, ohne Ring, `rotationAtEpochDeg: 0` gegen
  $W_0 = 284{,}95°$.
- Bahnelementtafel-Spalte P für Io und Europa fehlerhaft (durch zwei
  unabhängige Gegenrechnungen je Mond bestätigt), für Ganymed und Kallisto
  dagegen unauffällig.
- Kallistos Bahn ragt in der Szene `galileisches-schattenspiel` in 52,4 %
  aller Ziehungen über den Bildrand — der `scenes.ts`-Kommentar
  („gelegentlich") unterschätzt das deutlich.
- Ganymeds Schattenschwelle (3,745°) liegt nur 0,63° über Jupiters
  Achsneigung — knapperer Sicherheitsabstand als bei den übrigen drei
  Monden.
- Europas Katalogmasse erzeugt eine um 297 ppm zu hohe abgeleitete $GM$
  (Rundungsfolge, kein Programmfehler).

**Gymnasialtext-Beobachtungen ohne gemeldeten Fehler** (siehe §7) — zur
Kenntnis, keine Entscheidung nötig: Europa-Eisschale 15–25 km (Gymnasium)
gegen 23–47 km (Howell 2021, Hochschule); Kallisto-Valhalla „rund 3800 km"
(Gymnasium) gegen 3000 km (USGS-Gazetteer-Feature, Hochschule) — beide von
den jeweiligen Umsetzern ausdrücklich als zwei plausible Zahlen statt als
Fehler eingeordnet.

**18 Plan-Rulings** (Entscheidungen der Planung vom 20.09.2026, vollständiger
Wortlaut in `docs/superpowers/plans/2026-09-20-phase4d-hochschule-etappe5.md`
Abschnitt „Rulings", von Jens noch nicht bestätigt — hier nur die Themen, in
Plan-Reihenfolge):

1. „push, dann 4d-5" gilt als Freigabe für Etappe 4d-5; die Fragen aus §8
   der Abnahme 4d-4 werden nicht abgewartet.
2. Modelle wie in 4d-4: mittleres Modell für Texte, Prüfer, Abnahme und
   Schlussprüfung, kleinstes für Mechanik.
3. Höchstens eine Prüfrunde je Text; in der Nacharbeit wird nicht gekürzt.
4. Jupiter ohne Abschnitt „Oberfläche" (Gasplaneten-Ausnahme aus Entwurf
   §5.1).
5. Reihenfolge Jupiter → Vorbeiflug → Io → Europa → Ganymed → Kallisto →
   Schattenspiel.
6. Befunde am Simulationscode werden in 4d-5 nicht behoben, nur beschrieben.
7. Modellzahlen aus fachgeprüften Texten gleichlautend übernehmen;
   Abweichungen der eigenen Nachrechnung gehen an Jens, der fachgeprüfte
   Text wird nicht geändert.
8. Kein eigener Verweis-Task, da alle sieben Kennungen Gymnasialtexte haben.
9. Tausendertrennung ab fünf Stellen; Zahlenspannen nennen, wofür sie
   gelten.
10. Fachprüfung behält die sieben Prüfpunkte und den Hinweis auf die eine
    Runde.
11. Sichtprüfung des Formelsatzes entfällt ohne neuen TeX-Befehl.
12. Literaturkatalog bleibt im Hauptbundle; 50-kB-Schwelle gegenüber dem
    Ausgangsstand (siehe §2 — eingehalten, kein Anlass für eine Frage).
13. Fast-Forward nach Abnahme und Schlussprüfung, Push erst nach Prüfung des
    Diffs auf Zugangsdaten; 4d-6 erst nach Freigabe durch Jens.
14. Wortzahl-Obergrenze ein Drittel über dem Richtwert; Straffung vor dem
    Commit, nicht in der Nacharbeit.
15. Katalogform wie nach der Schlussprüfung 4d-4 (beschreibende Zusätze
    englisch, Eigennamen original, Vorabdrucke `'arXiv'`).
16. Quellenkarten aus dem Brief sind Angebot, keine Pflicht.
17. Die Szene `galileisches-schattenspiel` bekommt ihren Hochschultext
    trotz des früheren „nicht weiterverfolgt" (13.09.2026) — Kosten bei
    Fehlurteil: ein Textpaar, das Jens streichen lässt.
18. Der zurückgestellte Minor aus 4d-4 (`scripts/literaturVergleich.ts`)
    bleibt zurückgestellt.

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen
Projektanleitung beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.

## Nacharbeit nach der Schlussprüfung

Die Schlussprüfung (mittleres Modell, Paket über alle Commits der Etappe
ohne Hochschultexte und Beleglisten; Katalog, Protokoll und README) ergab
„bereit zum Merge mit Korrektionen": ein Critical, zwei Important, keine
Minor. Katalog (70 neue Einträge, 372 → 442) ohne Befund: keine Dubletten,
alphabetisch, alle Kennungen zitiert; alle Zahlen des Protokolls unabhängig
nachgerechnet.

- **Critical, behoben:** Das Ledger-Ruling zur Einfaltung der Task-8-Prüfung
  in die Schlussprüfung fehlte in §6 (es entstand nach dem Abnahme-Commit).
  Nachgetragen, zusammen mit dem Ruling zu den Modellnamen.
- **Important, behoben:** §3 nannte „elf" neue Katalogeinträge der Etappe;
  richtig sind 70 (elf war die Zahl von Task 1). Berichtigt.
- **Important, per Ruling belassen:** Modellnamen „sonnet"/„haiku" statt
  „mittleres/kleinstes Modell" — siehe Ruling in §6 (Hauspraxis seit 4d-2).

Commit: `Abnahme 4d Etappe 5: Nacharbeit nach der Schlussprüfung`.
