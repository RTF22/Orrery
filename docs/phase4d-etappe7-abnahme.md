# Abnahme Phase 4d Etappe 7 „Mittlere Saturnmonde"

## 1. Umfang

Branch `hochschule-7` (von `master` `e227ac2`, Plan-Commit, 22.09.2026 — der
Ausgangsstand vor dem Plan-Commit, `53a1d63`, führte 531 Katalogeinträge und
4475 Tests, unverändert durch den Plan-Commit). Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe7.md` (8 Tasks,
22 Plan-Rulings). Ledger
`.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe7/progress.md`
(git-ignoriert).

15 Commits über `e227ac2` bis `eb3123f`
(`git rev-list --count master..HEAD`). In Reihenfolge:

| Kurzhash | Titel |
|---|---|
| 99f6ea9 | Gymnasialtext Titan: Ozeanfrage als offen dargestellt |
| f5fa0ea | Hochschultext Mimas mit Belegliste |
| f606a4c | Belegliste Mimas: Methodik zur Kepler-Umlaufzeit berichtigt |
| cb36102 | Hochschultext Tethys mit Belegliste |
| 9367682 | Hochschultext Mimas: Nacharbeit nach der Fachprüfung |
| 5cb27a3 | Belegliste objekt-tethys: Nacharbeit nach der Fachprüfung |
| 516bdea | Hochschultext Dione mit Belegliste |
| 904f924 | Hochschultext Rhea mit Belegliste |
| e8c849c | Hochschultext Dione: Nacharbeit nach der Fachprüfung |
| fe5f458 | Hochschultext Iapetus mit Belegliste |
| d9cb0b1 | Hochschultext Rhea: Nacharbeit nach der Fachprüfung |
| 7426f86 | Hochschultext Szene Die geneigte Bahn des Iapetus mit Belegliste |
| 2ba9ee3 | Belegliste Szene Die geneigte Bahn des Iapetus: Prozesssprache entfernt |
| b15294a | Hochschultext Iapetus: Nacharbeit nach der Fachprüfung |
| eb3123f | Hochschultext Szene Die geneigte Bahn des Iapetus: Nacharbeit nach der Fachprüfung |

Ein Gymnasialtext (Task 1, Vorab-Task ohne Fachprüfung und ohne eigenen
Test- oder Belegliste-Zuwachs, Ruling 22) und sechs neue Hochschultext-Paare
(de/en): `objekt-mimas`, `objekt-tethys`, `objekt-dione`, `objekt-rhea`,
`objekt-iapetus`, `szene-iapetus-schief` — sechs Textpaare, in sechs Tasks
umgesetzt, je genau eine Fachprüfung und eine Nacharbeit (Ruling 3, neue
Regel „höchstens eine Prüfrunde je Text"). Task 8 (dieses Protokoll, README)
ist ein reiner Dokumentationstask.

Reihenfolge Mimas → Tethys → Dione → Rhea → Iapetus → Szene (Ruling 5/6);
Tethys übernahm Mimas' 4:2-Resonanzzahlen, Dione die
Enceladus–Dione-Zahlen aus dem bereits fertigen `objekt-enceladus.md`
(kein eigener Task nötig), Iapetus lieferte die Bahn- und Umlaufzahlen für
die Szene. Fachprüfungen liefen jeweils parallel zum nächsten Umsetzer
(Ledger-Zeilen „… startet parallel"); Nacharbeiten warteten, bis kein
anderer Umsetzer lief, wie von den Randbedingungen verlangt.

## 2. Lint, Tests, Build

Lauf auf `eb3123f` (Arbeitsbaum sauber, `git status --short` leer vor
diesem Protokoll):

- `npm run lint` → kein Befund.
- `npm test` → **4607 Tests, 101 Testdateien, alle grün** (Soll laut Plan
  4607 erreicht).
- `npm run build` → `✓ built in 838ms`; nur die bekannte Warnung zu großen
  Chunks. Hauptchunk `index-*.js` **1 395,66 kB**.

### Testzahlen (Ledger-Zeilen „Umsetzer/Nacharbeit DONE" je Task, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (master `e227ac2`, nach 4d-6) | — | 4475 |
| 1 | Gymnasialtext Titan | +0 | 4475 |
| 2 | Mimas | +22 | 4497 |
| 3 | Tethys | +22 | 4519 |
| 4 | Dione | +22 | 4541 |
| 5 | Rhea | +22 | 4563 |
| 6 | Iapetus | +22 | 4585 |
| 7 | Szene Die geneigte Bahn des Iapetus | +22 | 4607 |

Summe 4475+0+22·6 = 4607, deckt sich mit dem tatsächlichen `npm
test`-Lauf. Task 1 ändert nur zwei bestehende Gymnasialtexte (Ruling 22:
kein eigener Testfall-Zuwachs); keiner der sechs Nacharbeits-Commits fügt
neue Testfälle hinzu (durchgängig `src/data`-Testzahlen im Ledger
vermerkt, aber kein Zuwachs der Gesamtzahl).

### Hauptchunk

Ausgangsstand nach Etappe 4d-6: **1 386,97 kB**. Endstand dieser Etappe
(selbst nachgebaut auf `eb3123f`): **1 395,66 kB**. Zuwachs: **+8,69 kB** —
weit unter der 50-kB-Schwelle aus Plan-Ruling 13; keine Eskalation der
Frage „fauler Import des Katalogs" an Jens nötig.

Zwischenstände aus den Task-Berichten (chronologisch nach Commit): Mimas
initial **1 388,47 kB** → Tethys initial **1 389,73 kB** (gemessen, bevor
die Mimas-Nacharbeit committet war) → Mimas-Nacharbeit **1 389,97 kB** →
Dione initial **1 391,36 kB** → Rhea initial **1 393,21 kB** → Iapetus
initial **1 394,86 kB** → Szene initial **1 395,62 kB** → diese Abnahme
(nach der Szene-Nacharbeit, selbst gebaut) **1 395,66 kB**. Kein
Hauptchunk-Wert im Bericht für Task 1 (Gymnasialtext, lazy geladen, kein
erwartbarer Einfluss auf den Hauptchunk) und für vier der sechs
Nacharbeits-Commits (Dione, Rhea, Iapetus, Szene — nur `## Tests`, keine
erneute `## Build`-Messung); dieselbe Berichtslücke wie in Abnahme 4d-6 §7
bei Task 6, hier gleich viermal. Kein Sachfehler: Der selbst gemessene
Endstand deckt sich mit dem letzten im Bericht genannten Wert plus einer
kleinen, plausiblen Restzunahme durch die vier ungemessenen Nacharbeiten.

### Katalogeinträge

Ausgangsstand **531** (`git show e227ac2:src/data/literatur.ts | grep -cE
"^\s+id: '"`, entspricht dem Endstand aus Etappe 4d-6). Endstand **559**
(`grep -cE "^\s+id: '" src/data/literatur.ts`, selbst nachgezählt).
Zuwachs je Task, aus `git show <Commit>:src/data/literatur.ts | grep -c`
für **jeden** der 15 Commits selbst nachgezählt (nicht aus den Berichten
übernommen):

| Task | neue Einträge | Katalog danach |
|---|---|---|
| 1 (Gymnasialtext Titan) | 0 | 531 |
| 2 (Mimas, inkl. Nacharbeit) | 5 + 1 = 6 | 537 |
| 3 (Tethys, Nacharbeit nur Belegliste) | 4 + 0 = 4 | 541 |
| 4 (Dione, Nacharbeit ohne neue Einträge) | 5 + 0 = 5 | 546 |
| 5 (Rhea, Nacharbeit ohne neue Einträge) | 7 + 0 = 7 | 553 |
| 6 (Iapetus, Nacharbeit ohne neue Einträge) | 6 + 0 = 6 | 559 |
| 7 (Szene, inkl. Nacharbeit) | 0 + 0 = 0 | 559 |

531+6+4+5+7+6+0 = 559, deckt sich mit dem gezählten Katalogstand. **Zwei
Berichtszahlen wichen von der eigenen Nachzählung ab** (Ledger-Vermerk vor
Task 8 „541 → 542", „546 → 546" — beide selbst nachgeprüft):

- `task-2-report.md` (Mimas-Nacharbeit) nennt „541 → 542 Einträge (neu:
  `denton-2025`)". Die eigene Nachzählung an den Commits ergibt **540 →
  541**: Der Umsetzer hatte beim Schreiben des Berichts offenbar den
  parallel von Tethys inzwischen auf 540 erhöhten Katalogstand mit dem
  eigenen Vorher-Stand verwechselt; die Mimas-Nacharbeit selbst fügte
  korrekt genau einen Eintrag hinzu (`denton-2025`), nur die beiden
  genannten Zahlen sind je eins zu hoch. Kein Sachfehler am Katalog
  selbst (`denton-2025` ist genau einmal vorhanden), nur eine
  Berichtsungenauigkeit.
- `task-4-report.md` (Dione-Nacharbeit) nennt „Unverändert 546 Einträge
  (diese Runde keine neuen)" — das hat sich bei der eigenen Nachzählung
  (Commit `e8c849c`: weiterhin 546 Einträge) als **korrekt** bestätigt;
  der im Ledger vor Task 8 vermerkte Verdacht auf eine zweite
  Abweichung trifft nicht zu.

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog), Start-/Endzeitpunkt per
Unix-Zeitstempel vor und nach dem Kommando gemessen (1790062661 →
1790063251):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 559 von 559 Einträgen
[... 647 Zeilen, davon 641 „ok" ...]
cgpm-2022                     crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
greaves-2021                  crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
korablev-2019                  crossref  warnung  Crossref führt die Körperschaft „The ACS and
                                                   NOMAD Science Teams" zuerst, Erstautor
                                                   „Korablev, O." steht unter den weiteren Autoren
sanchez-lavega-2011            crossref  warnung  Crossref führt die Körperschaft „The
                                                   International Outer Planet Watch (IOPW) Team"
                                                   zuerst, Erstautor „Sánchez-Lavega, A." steht
                                                   unter den weiteren Autoren

641 ok, 4 Warnungen, 0 Fehler
```

**Laufzeit:** 590 Sekunden (9:50 min; Ausgangsstand 552 s bei 531
Einträgen nach 4d-6 — der Katalog ist um 28 Einträge gewachsen, die
Laufzeit liegt plausibel etwas darüber). Keine Zeile mit `429` (`grep -c
429` auf der vollständigen Ausgabe: 0 Treffer).

**Vier Warnungen, alle vier unverändert aus früheren Etappen begründet
(keine neue Warnung durch diese Etappe):**

- `cgpm-2022` — Crossref führt die 28. Generalkonferenz für Maß und
  Gewicht als Körperschaft, nicht als Person (seit Etappe 2 akzeptiertes
  Verhalten).
- `greaves-2021` — Crossref führt das Online-Erstjahr (2020), der
  Katalog das Druckjahr der Ausgabe (2021); in Etappe 4 (Venus) so
  begründet.
- `korablev-2019` — die von der Prüfskript-Lockerung aus Etappe 4
  (Zwischen-Task 5a) beabsichtigte Wirkung: Crossref führt die
  Kollektivbezeichnung zuerst, die tatsächliche Nature-Kopfzeile
  Korablev als Erstautor.
- `sanchez-lavega-2011` — dasselbe Muster, seit Etappe 4d-6 (Saturn,
  Task 1) bekannt und dort begründet (Ruling 16 / Katalogform seit
  4d-4).

Keiner der 28 neuen Katalogeinträge dieser Etappe erzeugt eine Warnung
oder einen Fehler.

## 4. Fachprüfung

Zahlen aus den `task-N-report.md`/`task-N-befunde.md`-Dateien,
gegengerechnet gegen die aktuellen Dateien im Arbeitsbaum (`wc -w` auf
`src/data/texte/<sprache>/hochschule/…`, Zeilenzählung der
Beleglisten-Tabellen über `grep -cE '^\|'` minus Kopf- und Trennzeile,
eindeutige `literatur:`-Verweise je Text per Browsermessung `§5.1`
gegengeprüft). Je Text genau eine Fachprüfung, genau eine Nacharbeit
(Ruling 3); Task 1 (Gymnasialtext) bekam keine Fachprüfung (Ruling 3).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| `objekt-mimas` (Mimas) | 2114 / 2376 | 40 | 12 | 6 | 1/1 (F1: veraltete Denton-und-Rhoden-2022-Exklusivaussage durch die 2025er Folgearbeit überholt; dazu ein in der Belegliste nicht erfasster Zusatzbefund — unbelegte Einordnung „neben allen Saturnmonden" unter Innerer Aufbau — behoben, sowie ein Nebenbefund „sechs" → „sieben" Saturnmonde aus der parallelen Tethys-Prüfung) | keine offen (13 Hinweise: 12 Prozesssprache „(Ruling 8)"/„Brief" in der Belegliste umformuliert; Ćuk-2024-Abschnitte Z. 8/11/22/25 nicht geändert — Werkzeuggrenze des Prüfers, der Umsetzer hatte den arXiv-Volltext bereits vollständig gelesen; Herschel 140 gegen 139 km/11 gegen 10 km, beide „rund"-Angaben derselben Primärquelle, vom Prüfer selbst als unkritisch eingestuft) |
| `objekt-tethys` (Tethys) | 1711 / 1898 | 44 | 7 | 4 | 3/3 (reine Prozesssprache „Brief" in drei Fundstelle-Zellen der Belegliste, keine inhaltlichen Textfehler) | 1 offen: `giese-2007`/`chen-2008` weiterhin nur über Metadaten und Zusammenfassungen, kein eigener Volltextzugriff (kein Fehler — Klasse „mindestens die Zusammenfassung geöffnet" erfüllt, keine widersprüchliche Zweitquelle gefunden) |
| `objekt-dione` (Dione) | 1898 / 2136 | 38 | 9 | 5 | 1/1 (Verweisziel-Behauptung „Kernbildung" bei `thema:innerer-aufbau` trifft nicht zu) | keine offen (H6: Dichte-Uneinheitlichkeit Dione/Tethys jetzt in „Im Modell" mit beiden Werten und Herkunft erklärt; H12: Beuthe 2016 im Volltext nachgeschärft) |
| `objekt-rhea` (Rhea) | 1982 / 2188 | 42 | 10 | 7 | 1/1 (dieselbe Kernbildung-Fehlbehauptung wie Dione bei `thema:innerer-aufbau`) | keine offen (Dichteüberschuss „kaum mehr als reines Wassereis" → „rund 35 % mehr") |
| `objekt-iapetus` (Iapetus) | 2183 / 2424 | 41 | 9 | 6 | 1/1 (Beleg „Gleich `thema-photometrie.md`" trägt die Sonnensystem-Superlativ-Aussage zum Albedokontrast nicht) | keine offen (Al-26/Fe-60-Zitat im Volltext geschärft; Tosi-2010-Lesart um einen Halbsatz ergänzt; NASA/JPL-Quelle statt alleiniger persönlicher Website) |
| `szene-iapetus-schief` | 937 / 1049 | 25 | 3 | 0 | 2/2 (Titan-Bahnradius 20,99 → 20,98 Rp berichtigt; Denk-2010/Spencer-und-Denk-2010-Zitatvertauschung aufgelöst) | 1 offen: einleitender „fünf Monde"-Satz ohne eigene Belegzeile (vom Prüfer selbst ausdrücklich als Ermessensfrage ohne Nacharbeitspflicht eingestuft) |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und
Trennzeile) unter `docs/belege/hochschule/`, über `grep -cE '^\|'` minus 2
gezählt. Zitate sind die im Browser gemessenen, eindeutigen
Literaturkarten je Kombination (§5.1), deckungsgleich mit den
`literatur:`-Kennungen in beiden Sprachfassungen (je Kombination in DE und
EN identisch). Wortzahlen `wc -w` auf den aktuellen Dateien in
`src/data/texte/<sprache>/hochschule/` — **abweichend von den Zahlen, die
zwei Task-Berichte selbst nennen** (siehe §7: Mimas- und Dione-Bericht
nennen nur die Wortzahl vor der jeweiligen Nacharbeit, ohne erneute
Zählung danach).

Modellzahlen aus den bereits fachgeprüften Texten
(`thema-gebundene-rotation`, `thema-resonanzen`, `thema-finsternis`,
`thema-photometrie`, `thema-ringe`, `thema-bahnelemente`, `objekt-saturn`,
`objekt-enceladus`, `szene-saturn-ringkante`, `objekt-titan`) wurden nach
Ruling 8 gleichlautend übernommen (Umlaufzeiten, Schattenfenster,
Laplace-Ebene/-Radius für Iapetus, Librationstabelle); wo die eigene
Nachrechnung geringfügig abwich (z. B. GM-ppm-Differenzen gegen SAT441),
steht die Erklärung im jeweiligen Bericht, nicht im übernommenen Wert des
fachgeprüften Texts.

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}'
http://localhost:5173/Orrery/` → 200), kein zweiter gestartet.
`window.store.setState({ quality: { tier: 'high' } })` direkt nach
`browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung
(Niveau Hochschule, Panel eingehängt, `breiteRem: 40`).

### 5.1 Rundgang

Alle 12 Kombinationen (fünf Körper-Kennungen + eine Szenen-Kennung × de/en)
angefahren: Körper über `setInfo({thema:null})` + `setCamera({targetId,
mode:'free'})`, die Szene `iapetus-schief` über `setCinema({running:true,
shuffle:false, nummer:15})` + `setCamera({mode:'cinema'})`, nach
Stabilisierung `setCinema({running:false})`, `setTime({paused:true})` und
`setUi({hidden:false})`. Szenenindex am Array in `src/data/scenes.ts`
selbst gegengeprüft (0-basierte Position): `iapetus-schief` **15** — exakt
der im Brief genannte Index.

**Eigene Messfalle in dieser Etappe gefunden und behoben (Szenen-Messung):**
Eine erste Messung rief `measure()` unmittelbar nach den drei
synchronen Store-Aufrufen `setCinema({running:false})`,
`setTime({paused:true})`, `setUi({hidden:false})` auf und erhielt
durchgehend `kopf: null` und leere Formel-/Tabellenzahlen — React hatte
den DOM zu diesem Zeitpunkt noch nicht neu gerendert (automatisches
Batching außerhalb eines React-Ereignishandlers). Nach Einfügen einer
kurzen Wartezeit (200 ms) zwischen den letzten Store-Aufrufen und der
Messung lieferte dieselbe Messung korrekt den Szenenkopf samt Formeln.

**Bestätigte Messfalle (wie in Abnahme 4d-6 §5.1 dokumentiert):**
`objekt:`- und `thema:`-Verweise sind im DOM `<button>`-Elemente, keine
`<a>`-Elemente; nur `quelle:`/`literatur:`-Verweise sind Anker. Der Brief
verwendet in Schritt 4 („Ersatz entfällt") den Selektor
`a[data-verweis="objekt:mimas"]` — mit dem `a`-Präfix hätte dieser
Selektor keinen Treffer gefunden; stattdessen durchgehend `[data-verweis]`
ohne Tag-Einschränkung verwendet (wie im Randbedingungen-Dokument
vorgegeben), damit fand jede Messung korrekt statt.

**Kernkriterien, alle 12 Kombinationen:** `formelfehler` **0**, keine
Hinweiszeile (insbesondere keine `info.hochschuleFolgt`/„Der
Hochschultext folgt …"), `zitateGleichKarten` **true**.

**12 von 12 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `objekt:mimas` | Mimas | Mimas | 42 | 1 | 12 |
| `objekt:tethys` | Tethys | Tethys | 40 | 1 | 7 |
| `objekt:dione` | Dione | Dione | 54 | 1 | 9 |
| `objekt:rhea` | Rhea | Rhea | 46 | 1 | 10 |
| `objekt:iapetus` | Iapetus | Iapetus | 42 | 1 | 9 |
| `szene:iapetus-schief` (Nr. 15) | Szene: Die geneigte Bahn des Iapetus | Scene: The tilted orbit of Iapetus | 23 | 0 | 3 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (in beiden Läufen
gemessen) — anders als bei `objekt-enceladus` in Etappe 4d-6 (dort ein
einzelner asymmetrischer Verweis) trat in dieser Etappe keine
DE/EN-Verweisasymmetrie auf.

**Klicktest je Verweisart:** Je Kombination wurde von jeder der fünf
Verweisarten (`objekt`, `thema`, `szene`, `quelle`, `literatur`) ein
Vorkommen einzeln über `[data-verweis^="<art>:"]` ermittelt, per
`element.click()` ausgelöst und die Wirkung gegen die Tabelle im Brief
geprüft (`objekt` → `camera.targetId` nach 1,6 s Wartezeit; `thema` →
`ui.info.thema`; `szene` → `cinema.nummer` gegen den erwarteten Index samt
`camera.mode==='cinema'`; `quelle`/`literatur` → Kartenklasse enthält
`border-sky-300`, Klick und Prüfung in einem `browser_evaluate`); die
Kombination wurde vor jedem Einzeltest frisch aufgebaut. Alle sechs
Kennungen führen in beiden Sprachen alle fünf Verweisarten mindestens
einmal im Textkörper.

**Ergebnis: 60 von 60 Klicktests trafen** (6 Kennungen × 2 Sprachen × 5
Arten). Alle Treffer: `objekt` → `camera.targetId` stimmt; `thema` →
`ui.info.thema` stimmt; `szene` → `cinema.nummer` traf den erwarteten
Index samt `camera.mode==='cinema'`; `quelle`/`literatur` → Karte trug
`border-sky-300`.

### 5.2 Ersatz entfällt

Nach Ruling 20 (Abweichung vom ursprünglich erwogenen Paar
`thema:finsternis` → `objekt:iapetus`, weil Iapetus dort nur im Fließtext
ohne Verweis vorkommt): `thema:resonanzen` → `objekt:mimas`
(Tabellenzelle „Mimas–Tethys") und `thema:photometrie` → `objekt:iapetus`
(erster Fließtextverweis), je Sprache. Vier Messungen, Wartezeit bis zum
Kopfwechsel (`performance.now()`, Zeit vom Klick bis zum ersten
abweichenden Kopf):

| Messung | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|
| `thema:resonanzen` → `objekt:mimas` (de) | Mimas | keine | 64,0 ms |
| `thema:photometrie` → `objekt:iapetus` (de) | Iapetus | keine | 64,6 ms |
| `thema:resonanzen` → `objekt:mimas` (en) | Mimas | keine | 24,1 ms |
| `thema:photometrie` → `objekt:iapetus` (en) | Iapetus | keine | 38,0 ms |

Alle vier Messungen ohne Hinweiszeile: Die vorher an `thema:resonanzen`
beziehungsweise `thema:photometrie` gezeigte Ersatz-Hinweiszeile „Der
Hochschultext folgt …"/„The university-level text will follow …" für
Mimas beziehungsweise Iapetus ist entfallen, weil diese Etappe die
entsprechenden Hochschultexte liefert.

### 5.3 Konsole

`browser_console_messages` (seit dem Navigate, `all: true`, Ebene
`warning`): **0 Fehler, 0 Warnungen** über die gesamte Sitzung (Navigate,
Rundgang, 60 Klicktests, vier Ersatz-Messungen). Anders als in Abnahme
4d-6 §5.3 trat die dort dokumentierte Warnung „Vollbild ohne
Nutzergeste" bei keinem der `szene:`-Klicks in dieser Sitzung auf; da
keine Warnung auftrat, entfällt die im Brief vorgesehene Gegenprobe mit
echtem `browser_click` (sie ist nur für den Fall vorgesehen, dass eine
Warnung gezählt wurde).

Playwright-Aufnahmen (`console-*.log`, `page-*.yml`,
`literatur-pruefen-etappe7.log` unter `.playwright-mcp/`) wurden vor dem
Commit gelöscht, keine Skripte im Projektstamm angelegt.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge.

**Planung (vor Ausführung, 22.09.2026):**

- Gymnasialtext Titan (Ozeanfrage) wird als Task 1 dieser Etappe
  nachgeführt (Jens: „alles bestätigt" zur §8-Frage, Protokoll 4d-6 §8
  „Entscheidungen von Jens") — Kosten bei Fehlurteil: ein kleiner Commit,
  den Jens zurücknimmt.
- Richtwert der fünf Monde 1000–2000 Wörter je Fassung (zwischen kleinen
  Monden und großen Körpern) — Kosten: Wortzahl-Diskussion in §8.

**Vorprüfung (Controller, 22.09.2026):**

- Vorprüfung ohne Konflikt; Task 1 (Titan-Gymnasialtext, sonnet) startet,
  Basis = Plan-Commit — Kosten bei Fehlurteil: ein Commit.

**Nach Task 2 (Fachprüfung, Prozesssprache in der Belegliste):**

- „(Ruling 8)" in der Belegliste Mimas ist Prozesssprache und wird in der
  Nacharbeit durch „gleichlautend aus dem fachgeprüften Text übernommen"
  ersetzt; die bereits fachgeprüfte Belegliste `objekt-enceladus.md`
  (4d-6) bleibt unverändert (eine Prüfrunde je Text) → §7. Kosten bei
  Fehlurteil: eine Zeile.

**Nach Task 4 (Fachprüfung, Dichte-Uneinheitlichkeit Dione/Tethys):**

- Der Tethys-Text (fachgeprüft, Runde verbraucht) bleibt unverändert; die
  Nacharbeit Dione nennt in „Im Modell" beide Dichten mit ihrer Herkunft
  (Katalog 1485 aus `massKg`/`radiusKm`, Messung 1478,1 aus JPL SSD) und
  belegt sie — Kosten bei Fehlurteil: ein Satz.

**Nach Task 4/Task 5 (Katalogfragen):**

- Der Rhea-CO₂-Vergleichssatz im Dione-Text (Belegzeile 20) hat keinen eigenen
  Katalogeintrag — die Details gehören laut Umsetzer-Ruling in den Rhea-Text,
  dort als eigener Katalogeintrag (`teolis-2010`) vorhanden. Kosten bei
  Fehlurteil: eine Belegzeile ohne Katalogverweis.
- Tirawa-/Inktomi-Kraterdaten im Rhea-Text stammen aus der Wikipedia ohne
  eigenen Katalogeintrag — als „eigene Recherche, nicht katalogisiert"
  ausgewiesen und durch die Quellenkarte Wikipedia gedeckt. Kosten bei
  Fehlurteil: eine Belegzeile.

**Zu Task 7 (Quellenkarten):**

- Zwei neue Quellenkarten (`nasa-iapetus`, `nasa-iapetus-vorbeiflug`)
  sind zulässig (reine Daten, Abdeckungstest grün, Karten sind Angebot,
  Ruling 17) — Kosten: zwei Karten, die Jens anders will.

**Vor Task 8 (Abschluss):**

- Die Abnahme wiederholt die Suche nach Prozesssprache über alle Texte
  und Beleglisten der Etappe, zählt Katalogzuwächse am Diff
  (Umsetzerberichte wichen zweimal ab: „541 → 542", „546 → 546" — beide
  in §2 selbst nachgeprüft, ein tatsächlicher Fehler, einer nicht) und
  nimmt die Gymnasialbefunde (Iapetus Wulsthöhe 13 km) in §8 auf.

**Controller-Vorabprüfung vor der Schlussprüfung:**

- Zugangsdaten 3 Werte / 0 Treffer im Branch-Diff, Wortkontrolle Baum 0,
  Prozesssprache in den Dateien der Etappe 0. Altbestand: 27 Beleglisten
  früherer Etappen (4d-1 bis 4d-6) mit 127 Treffern interner
  Kurzverweise, veröffentlichte Texte 0 (nur ein Codekommentar in
  `dateien.test.ts`). Altbestand bleibt unverändert (fachgeprüft, eine
  Prüfrunde je Text), Sammelbefund in §7 als Kandidat für eine mechanische
  Bereinigung in 4d-11 — Kosten bei Fehlurteil: eine Aufräumrunde später
  statt jetzt.

Die 22 Plan-Rulings selbst stehen vollständig in `docs/superpowers/plans/
2026-09-22-phase4d-hochschule-etappe7.md` Abschnitt „Rulings" und sind
inhaltlich in §1 (Reihenfolge, Modelle, eine Prüfrunde), §2 (Richtwert),
§4 (Prüfpunkte, Ruling 8) und §5 (Ersatz entfällt, Ruling 20) dieses
Protokolls eingearbeitet; als Themenliste in §8.

## 7. Bekannte Unschärfen

**Code-Befund, in dieser Etappe selbst gefunden (nicht behoben):**

- **`src/data/scenes.ts` Z. 510–512, Kommentar widerlegt.** Der
  Code-Kommentar am Eintrag `iapetus-schief` behauptet, `distanceInRadii:
  40` zeige „Iapetus' vollständige, klar geneigte Bahnellipse komfortabel
  im Bild". Der eigene Frustumtest der Fachprüfung (Task 7,
  `task-7-befunde.md`) bestätigt in der Grundeinstellung nur 25 von 72
  Stützpunkten der momentanen Bahnellipse im Bild, über acht geprüfte
  Ecklagen zwischen **5/72 und 31/72**; der Rest liegt hinter der Kamera
  oder horizontal außerhalb, weil der Kameraabstand (40 Rp) kleiner ist
  als Iapetus' eigener Bahnradius (61 Rp). Der veröffentlichte Text
  beschreibt deshalb bewusst einen „klar gekrümmten, deutlich geneigten
  Bogen", nicht die „vollständige Ellipse" des Kommentars. `scenes.ts`
  selbst wurde nicht geändert (nur Lesedatei laut Task 7). Kandidat für
  eine spätere Kommentarberichtigung.

**Datensatz-Befunde (Ruling 7, nicht behoben, Texte beschreiben den
Ist-Code):**

- Tethys' `lpDot`-Periode ist auffällig kurz (0,005 a, rund 3,4 % kürzer
  als Tethys' eigener Umlauf); die im Kopfkommentar genannte Ursache
  (extrem kleine freie Exzentrizität) wurde nicht unabhängig geprüft.
- Diones `nodeDot` ist 0 (fester Knoten im Modell).
- Iapetus' Modellalbedo 0,275 ist das arithmetische Mittel der beiden
  Fact-Sheet-Hemisphärenwerte (0,05/0,5), ein einzelner, einfarbiger Wert
  für einen Körper mit der stärksten bekannten Albedo-Dichotomie des
  Sonnensystems.
- Mimas, Enceladus, Tethys und Dione teilen im Datensatz einen
  gemeinsamen Pol.
- `achsneigungDeg` misst bei einer Bahn mit `frame: 'parentEquator'`
  (Mimas, Tethys, Dione, Iapetus) gegen die aus Position und
  Geschwindigkeit gebildete eigene Bahnnormale zur Epoche, nicht gegen
  die Laplace-Ebene oder Saturns Äquator direkt.
- Iapetus' Knotenpräzession läuft im Modell um Saturns Pol statt um den
  Laplace-Pol (Abweichung gegen Horizons 2050 um 0,71°, 2076 um 1,11°,
  aus `thema-bahnelemente.md` übernommen).
- Mimas' 20-%-Positionsschranke im Fixture-Test hängt mit der
  4:2-Libration zusammen (bereits vor dieser Etappe bekannt).

**Quellen hinter Verlagssperren (HTTP 403/404/405), je Text (Zahl der
betroffenen von den insgesamt neuen zentralen Arbeiten):**

- Mimas 4 von 6 (Science/AAAS, Nature, Wiley/AGU, ScienceDirect).
- Tethys 4 von 4 (Wiley/AGU dreifach, ScienceDirect einfach).
- Dione 5 von 5 (Wiley/AGU zweifach, ScienceDirect dreifach).
- Rhea 4 von 7 (Wiley/AGU, ScienceDirect zweifach, Science zweifach);
  `tortora-2016` über eine frei zugängliche LPSC-Konferenzfassung
  derselben Autorengruppe umgangen, `elowitz-2021` über PMC frei.
- Iapetus 5 von 6 (ScienceDirect, Wiley/AGU, Science zweifach, Nature);
  nur `tosi-2010` (arXiv) lag als echter Volltext vor.
- Szene: keine Sperrungsprobleme (drei bereits katalogisierte,
  wiederverwendete Literaturstellen), aber die historische Quelle
  „Van Helden 1984" ließ sich über ADS nicht verifizieren (HTTP 405 /
  Zeitüberschreitung) und wurde durch zwei direkt geöffnete
  NASA-Seiten ersetzt.

In allen Fällen stützen sich die Aussagen auf live geprüfte
Crossref-Metadaten plus mindestens eine unabhängige, selbst abgerufene
Zusammenfassung oder Sekundärquelle mit wörtlichem Zitat.

**Dichte-Uneinheitlichkeit zwischen zwei fachgeprüften Texten
(Dione-Fachprüfung, in Dione behoben, `objekt-tethys.md` bewusst nicht
angefasst):** `objekt-dione.md` nennt die von JPL SSD gemessene Dichte
1478,1 kg/m³ und erklärt in „Im Modell" zusätzlich die Katalog-Herleitung
(1485 kg/m³ aus `massKg`/`radiusKm: 561.3`, +0,5 %); `objekt-tethys.md`
Z. 36 nennt für denselben Körper weiterhin nur „1485 kg/m³" ohne diese
Einordnung — Tethys' Prüfrunde war zu diesem Zeitpunkt bereits verbraucht
(Ruling, siehe §6). Vorschlag für eine künftige Berührung von
`objekt-tethys.md`: den Satz um die Herkunftsangabe ergänzen.

**Beuthe et al. 2016 nennt für Enceladus eigene Zahlen (Ozean 38±4 km,
Schale 23±4 km), die von `objekt-enceladus.md` (Iess 2014, McKinnon
2015, Čadek 2016) abweichen** — bewusst nicht in den Dione-Text
übernommen, um keinen neuen Widerspruch zu erzeugen (Task-4-Nacharbeit).

**Belegliste `docs/belege/hochschule/objekt-enceladus.md` (aus Etappe
4d-6) enthält weiterhin 15 Treffer interner Kurzverweise („Ruling 8" u. Ä.)
als Prozesssprache** — fachgeprüft, eine Prüfrunde je Text, in dieser
Etappe nicht geändert.

**Sammelbefund Prozesssprache in älteren Beleglisten:** Die Suche nach
Prozesssprache über die Dateien der Etappe 4d-7 selbst (`src/data/texte/
de|en/{hochschule,gymnasium}/…-{mimas,tethys,dione,rhea,iapetus}.md`,
`…-titan.md`, `…-iapetus-schief.md` und die sechs zugehörigen
Beleglisten) ergab **0 Treffer**. Dieselbe Suche über den gesamten Baum
(`src/data/texte/`, `docs/belege/`) findet **129 Treffer in 27 Dateien**:
127 davon in Beleglisten früherer Etappen (4d-1 bis 4d-6, u. a.
`objekt-enceladus.md`, `objekt-titan.md`, `objekt-ganymede.md`,
`szene-titan-dunst.md`), fachgeprüft und in dieser Etappe nicht
angefasst (eine Prüfrunde je Text); die restlichen 2 Treffer stehen in
`src/data/texte/dateien.test.ts` Z. 116/261, einem seit Etappe 4d-1
unveränderten Codekommentar (kein veröffentlichter Text). Kandidat für
eine mechanische Bereinigung in Etappe 4d-11.

**Nicht geänderte Hinweise je Text, mit Begründung (aus Ledger und
Berichten, siehe auch §4):**

- Mimas: Ćuk-2024-Abschnitte 4.3/6 (Zeilen 8, 11, 22, 25 der Belegliste)
  ließen sich beim Fachprüfer über WebFetch nicht laden — der Umsetzer
  hatte den arXiv-Volltext (48 Seiten) selbst vollständig gelesen, die
  Zitate stehen bereits wörtlich in den Fundstellen; Werkzeuggrenze des
  Prüfers, keine Lücke der Belegliste. Herschel 140 gegen 139 km/11
  gegen 10 km (zwei „rund"-Angaben derselben Primärquelle) vom Prüfer
  selbst als unkritisch eingestuft.
- Tethys: `giese-2007`/`chen-2008` bleiben ohne eigenen Volltextzugriff
  (Metadaten + Zusammenfassung reichen nach der Randbedingung „mindestens
  die Zusammenfassung öffnen").
- Dione: Rhea-CO₂-Vergleichssatz (Belegzeile 20) ohne eigenen
  Katalogeintrag — Details gehören laut Umsetzer-Ruling in den
  Rhea-Text, dort als eigener Katalogeintrag (`teolis-2010`) vorhanden.
- Rhea: Tirawa-/Inktomi-Kraterdaten (Belegzeilen 15–16) stammen aus der
  Wikipedia ohne eigenen Katalogeintrag — als „eigene Recherche, nicht
  katalogisiert" ausgewiesen, analog zu vergleichbaren Detailfakten in
  `objekt-dione.md`/`objekt-tethys.md`.
- Iapetus: keine Iapetus-spezifische Schwerefeldmessung existiert
  (Abwesenheitsaussage, keine zitierbare Quelle); Al-26-Einordnung war
  ursprünglich als „eigene Einordnung" ausgewiesen, in der Nacharbeit
  durch das im Volltext gefundene wörtliche Zitat gestärkt.
- Szene: einleitender „fünf Monde"-Satz ohne eigene Belegzeile — vom
  Prüfer selbst ausdrücklich als Ermessensfrage ohne Nacharbeitspflicht
  eingestuft (Prüfpunkt „im Text, aber ohne eigene Belegzeile").

**Methodik, für alle sechs Texte gleich:** Node kann die echten
Projektfunktionen (`src/data/index.ts`, `src/sim/orbit.ts`) ohne
`tsx`/`vite-node` nicht direkt ausführen (`ERR_MODULE_NOT_FOUND`); alle
„Nachrechnung am Code"-Zeilen der Beleglisten beruhen auf direkt aus den
Quelldateien gelesenen Formeln und Werten, von Hand oder per Skript im
Scratchpad angewendet, nicht auf einer ausgeführten Projektfunktion.

**Berichtsungenauigkeiten (Wortzahlen, §4/§8):** Die Task-2- und
Task-4-Berichte nennen unter „Wortzahlen" jeweils nur den Stand **vor**
der eigenen Nacharbeit (Mimas EN 2304, Dione EN 2052); beide Nacharbeiten
haben Text ergänzt, ohne die Wortzahl erneut zu zählen. Diese Abnahme hat
`wc -w` auf den aktuellen Dateien selbst ausgeführt (§4): Mimas DE 2114/EN
2376, Dione DE 1898/EN 2136. Rhea, Iapetus und die Szene nennen in ihren
Nacharbeits-Abschnitten bereits die nachgezählte Wortzahl, die sich mit
der eigenen Messung deckt (Rhea DE 1982/EN 2188, Iapetus DE 2183/EN 2424,
Szene DE 937/EN 1049). Kein Sachfehler an den Texten, nur eine Lücke in
zwei der sechs Nacharbeits-Berichte — wie in Abnahme 4d-6 §7 als
wiederkehrende Lehre vermerkt: Berichtszahlen sind nachzurechnen.

**Katalogzahlen-Berichtsungenauigkeit:** siehe §2, eine echte Abweichung
(Mimas-Nacharbeit „541 → 542" statt korrekt 540 → 541), eine beim
Nachrechnen bestätigte Zahl (Dione-Nacharbeit „546 → 546").

## 8. Halt: Fragen an Jens

**Wortzahlen über dem Richtwert (Ruling 4/15, Obergrenze jeweils ein
Drittel über dem Richtwert):** Körper-Richtwert 1000–2000 Wörter,
Obergrenze 2667 — Mimas DE 2114/**EN 2376**, Dione EN **2136** (DE 1898
innerhalb), Rhea EN **2188** (DE 1982 knapp innerhalb), Iapetus **DE
2183/EN 2424** (beide über dem Richtwert). Szene-Richtwert 300–900,
Obergrenze 1200 — **DE 937/EN 1049** (beide über dem Richtwert). Alle
acht über dem Richtwert liegenden Zahlen bleiben deutlich unter der
jeweiligen Obergrenze (aktuell nachgezählt, siehe §4/§7 zu den zwei
veralteten Berichtszahlen). Vorschlag wie in den Etappen 4d-4 und 4d-6
entschieden: annehmen (Richtigkeit vor Wortzahl, keine Straffung in der
Nacharbeit erlaubt gewesen).

**Gymnasialbefund `objekt-iapetus.md` (de/en, nicht geändert, nur
gemeldet):** Die Wulsthöhe steht dort mit „bis zu 13 km", der
Hochschultext (mit Ip 2006 als Quelle, selbst im Volltext geprüft) nennt
„bis zu 20 km" — derselbe Wert, den bereits der Task-Brief für den
Hochschultext vorgab. Frage: Soll der Gymnasialtext in einem eigenen
kleinen Task nachgeführt werden (wie zuvor bei Titan in Task 1 dieser
Etappe), oder vorerst wie in früheren Etappen unverändert bleiben?

**Zwei neue Quellenkarten (Ruling zu Task 7, §6):** `nasa-iapetus` und
`nasa-iapetus-vorbeiflug` in `src/data/quellen.ts`, `fuer` inzwischen um
`objekt:iapetus` ergänzt. Vorschlag: annehmen (reine Daten, Karten sind
Angebot nach Ruling 17, Abdeckungstest grün).

**Modelle (Plan-Ruling 2 / Ledger):** Wie in 4d-6 griff auch in dieser
Etappe **kein** Kontingentlimit — Task 1 sowie alle sechs
Umsetzer-/Nacharbeits-Runden, alle sechs Fachprüfungen und diese Abnahme
liefen durchgehend auf dem mittleren Modell (sonnet). Keine offene Frage,
nur zur Kenntnis.

**Dichte-Uneinheitlichkeit Dione/Tethys (§7):** `objekt-dione.md` erklärt
den 0,5-%-Unterschied zwischen Katalog- und Messdichte, `objekt-tethys.md`
Z. 36 nennt weiterhin nur den unerklärten Katalogwert 1485 kg/m³ — Tethys'
Prüfrunde war zum Zeitpunkt des Dione-Befunds bereits verbraucht. Vorschlag:
bei der nächsten inhaltlichen Berührung von `objekt-tethys.md` mit
beheben (kein eigener Task nötig).

**Sammelbefund Prozesssprache in 27 Beleglisten früherer Etappen (§7,
127 Treffer, dazu 2 in einem Codekommentar):** Vorschlag: als bekannt und
zurückgestellt betrachten, mechanische Bereinigung in einer eigenen
kleinen Aufgabe der Etappe 4d-11 (analog zum bereits erledigten
Venus-Befund aus 4d-4/4d-6).

**22 Plan-Rulings** und die in §6 aufgeführten Umsetzungs-Rulings (von
Jens noch nicht bestätigt, vollständiger Wortlaut in
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe7.md`
Abschnitt „Rulings" und in diesem Protokoll §6). Als Themenliste: Vorab-
Task Titan (1); Modelle/eine Prüfrunde (2/3); Richtwert 1000–2000, Obergrenze
2667 (4); Reihenfolge und Task-Zuschnitt (5/6); Datensatz-Befunde nicht
behoben (7); Modellzahlen aus fachgeprüften Texten gleichlautend
übernehmen (8); kein Verweis-Task (9); Tausendertrennung/Zahlenspannen
(10); Prüfpunkt 8 Prozesssprache (11); keine Formelsatz-Sichtprüfung ohne
neuen TeX-Befehl (12); Katalog im Hauptbundle unter 50-kB-Schwelle (13);
Fast-Forward, Push erst nach Jens' Ja (14); Wortzahl-Obergrenze ein Drittel
über dem Richtwert (15); Katalogform wie 4d-4/4d-6 (16); Quellenkarten als
Angebot (17); Beleglisten-Nacharbeit mit Zellenkontrolle (18); Schlussprüfung
dient als Task-Prüfung der Abnahme (19); Ersatz entfällt über
resonanzen→mimas, photometrie→iapetus (20); `achsneigungDeg` bei
`parentEquator`-Bahnen als Datensatz-Befund (21); Task 1 ohne
Test-/Belegliste-Zuwachs (22).

**Code-Befunde, als Kandidaten für eigene Tasks (siehe §7 für Details):**

- `scenes.ts` Z. 510–512: Kommentar zur „vollständigen Bahnellipse"
  widerlegt (Frustumtest 5/72–31/72 sichtbar).
- Tethys' `lpDot`-Periode auffällig kurz; Ursache nicht unabhängig
  geprüft.
- Diones `nodeDot` 0 (fester Knoten).
- Iapetus' Modellalbedo 0,275 als einfarbiger Mittelwert trotz stärkster
  bekannter Albedo-Dichotomie.
- Gemeinsamer Pol von Mimas/Enceladus/Tethys/Dione im Datensatz.
- `achsneigungDeg` bei `parentEquator`-Bahnen (Mimas, Tethys, Dione,
  Iapetus) gegen die eigene Bahnnormale statt gegen die Laplace-Ebene.
- Iapetus' Knotenpräzession um Saturns Pol statt um den Laplace-Pol.
- Mimas' 20-%-Positionsschranke im Fixture-Test (4:2-Libration).

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen
Projektanleitung beschrieben (Ergebnis 0), ohne Suchmuster in dieser
Datei.

## Nacharbeit nach der Schlussprüfung (22.09.2026)

Schlussprüfung „Bereit zum Merge: Ja", Befunde: 0 kritisch, 0 wichtig, 2
klein. Klein 1 (§6 um zwei Rulings zu Katalogfragen Task 4/Task 5 ergänzt)
behoben. Klein 2 (`src/data/literatur.ts:1753`, Titel `gyalay-2023` mit
geradem Apostroph und Unicode-Bindestrich U+2010 — Titel so von Crossref
geliefert, Prüfskript vergleicht Titel) bewusst belassen.
