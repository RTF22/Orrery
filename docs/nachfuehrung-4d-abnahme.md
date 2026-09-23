# Abnahme „Nachführung nach Phase 4d"

## 1. Umfang

Branch `nachfuehrung-4d` von `master` `ce8cf95` (Endstand Phase 4d, Tag `v0.5.0`), Plan-Commit
`218b1f7` (23.09.2026 17:42, „Plan Nachführung nach Phase 4d"). Spec: kein eigener Entwurf,
maßgeblich sind die „Entscheidungen (23.09.2026)" in `docs/phase4d-abnahme.md` (Punkte 2–4). Plan
`docs/superpowers/plans/2026-09-23-nachfuehrung-nach-phase4d.md` (4 Tasks). Ledger im vom
SDD-Werkzeug vergebenen Ordner `.superpowers/sdd/2026-09-23-nachfuehrung-nach-phase4d/`
(git-ignoriert).

5 Commits über `218b1f7` bis `1872c45`:

| Kurzhash | Zeit | Titel |
|---|---|---|
| a323c80 | 17:46 | Nachführung: Driftrate des Großen Roten Flecks und Schwerpunktabstand im Gymnasialtext berichtigt |
| 5c27397 | 17:52 | Beleglisten: interne Kurzverweise durch ihren Inhalt ersetzt (Teil 1) |
| 8989c69 | 17:55 | Beleglisten: restliche Kurzverweise ersetzt (Teil 1) |
| b6558f6 | 18:11 | Beleglisten: Nacharbeit nach der Prüfung (Teil 1) |
| 1872c45 | 18:22 | Beleglisten: interne Kurzverweise ersetzt (Teil 2), Tabellenform und Zeilenverweis berichtigt |

**Task 1** (a323c80, mittleres Modell): Driftrate des Großen Roten Flecks in `objekt-jupiter`
(DE/EN) und Schwerpunktabstand in `thema-modell` (DE/EN) berichtigt, dazu drei bereits erledigte
Gymnasialbefunde aus der Gesamtabnahme bestätigt (§4). Eine Fachprüfung, keine Nacharbeit nötig.

**Task 2** (Bereinigung Teil A, zwölf Beleglisten): erster Commit `5c27397` ließ 37
regelgedeckte Treffer stehen (Enceladus-Überschrift dabei umbenannt) und wurde vor der Prüfung
zur Vervollständigung an den Umsetzer zurückgegeben, dann `8989c69` (0 Treffer). Die
anschließende Fachprüfung fand zwei kritische Befunde (Informationsverlust „gleichlautende
Modellzahlen" in `objekt-ganymede.md`, verlorene Befundnummern in `objekt-jupiter.md`/
`objekt-mars.md`) und zwei wichtige (Tautologien in `objekt-titan.md`, unvollständiger Bericht),
siehe `task-2-befunde.md`. Beide Umsetzungsschritte liefen auf dem kleinsten Modell.

**Nacharbeit Task 2** (b6558f6, mittleres Modell): behebt alle fünf Befunde der Prüfung. Das
kleinste Modell hatte zweimal regelwidrig gearbeitet (unvollständiger erster Commit, dann die
Befunde der Prüfung), deshalb ging die Nacharbeit auf das mittlere Modell (§8).

**Task 3** (Bereinigung Teil B, übrige Beleglisten, drei unmaskierte `|`, Zeilenverweis in
`thema-ringe`, zwei Testkommentare): ein erster Versuch auf dem kleinsten Modell (`d25d58f`,
Hilfsbranch `sicherung-task3-haiku`) wurde verworfen und nicht in `nachfuehrung-4d` übernommen,
weil er „(Runde 1)" in rund 15 unbeteiligten Beleglisten gegen Regel 7 gestrichen und
Hinweisnummern gegen Regel 5 ersatzlos gelöscht hatte; der Branch wurde auf `8989c69`
zurückgesetzt. Task 3 lief danach zusammen mit der Nacharbeit Task 2 in einem Auftrag auf dem
mittleren Modell (`1872c45`). Eine gemeinsame Prüfung für Nacharbeit Task 2 und Task 3 ergab
keine Befunde.

**Task 4** (dieses Protokoll, mittleres Modell): Gesamtprüfung und DOM-Stichprobe.

## 2. Prüfergebnisse

### Lint, Tests, Build (Stand `1872c45`, Arbeitsbaum sauber vor diesem Protokoll)

```
npm notice run orrery@0.0.0 lint
npm notice run eslint .
```
→ kein Befund.

```
npm notice run orrery@0.0.0 test
npm notice run vitest run
 Test Files  101 passed (101)
      Tests  5150 passed (5150)
   Duration  21.86s
```
→ **5150 Tests, 101 Testdateien, alle grün** (Soll laut Randbedingungen 5150 erreicht,
unverändert gegenüber `ce8cf95`).

```
dist/assets/index-Ctn8B19p.js   1,453.78 kB │ gzip: 393.59 kB
✓ built in 1.28s
```
→ nur die bekannte Warnung zu großen Chunks. Hauptchunk **1 453,78 kB** (Ausgangsstand `ce8cf95`
ebenfalls 1 453,78 kB — Task 1 ändert vier Textdateien geringfügig, die Bereinigung der
Beleglisten wirkt sich nicht auf das Bundle aus, da `docs/belege/` nicht gebündelt wird; kein
messbarer Zuwachs).

### Zellenprüfskript

```
PYTHONIOENCODING=utf-8 python <scratchpad>/zellen.py
```
→ keine Ausgabe (Soll nach Task 3 erreicht; vor der Nachführung genau drei Ausgaben in
`objekt-europa.md`, `objekt-io.md`, `szene-jupiter-vorbeiflug.md`, alle drei durch die
Formbefund-Korrekturen in Task 3 behoben).

### Suche nach Prozesssprache

```
P='\bTasks?\b|\btask-[0-9]|\bRulings?\b|\bruling\b|\bBrief(s|e)?\b|laut Auftrag|\bLedger|\bController|Umsetzer|Befunddatei|Nacharbeitsbericht|Prüfauftrag|\bAuftrag\b|Erstumsetzer|\.superpowers'
grep -rnE "$P" docs/belege/ src/data/texte/
```
→ **0 Treffer**, keine begründeten Fehltreffer nötig (Soll erreicht; Ausgangsstand rund 230
Treffer in 40 Dateien).

### Katalogeinträge

```
grep -c "id: '" src/data/literatur.ts
```
→ **761** (Soll erreicht, unverändert gegenüber `ce8cf95`; die Nachführung legt keinen neuen
Katalogeintrag an — `simon-2018` stand bereits im Katalog). Quellenkarten (`src/data/quellen.ts`)
zur Kontrolle mitgezählt: unverändert **91**.

### DOM-Stichprobe

Server lief bereits auf Port 5173 (`curl` → `200`), kein zweiter Server gestartet.
`http://localhost:5173/Orrery/` per Playwright geladen, direkt danach
`window.store.setState({ quality: { tier: 'high' } })`. Auswahl über die Store-Setter
(`setInfo`, `setCamera`, `setUi`) statt über den Objektbaum, weil `window.store.getState()`
diese unmittelbar zeigte.

**Jupiter, Hochschule, Deutsch** (`setInfo({ niveau: 'hochschule', thema: null })`,
`setCamera({ targetId: 'jupiter' })`, auf den Kopfwechsel zu „Jupiter" gepollt):

> „…seine Westwärtsdrift gegenüber System III beschleunigte sich von rund 0,26∘ je Tag in den
> 1980er-Jahren auf heute rund 0,36∘ je Tag, und seit 2014 verändern sich Farbe und innere
> Zirkulation merklich (Simon et al. 2018)."

„0,26" und „0,36" vorhanden, „0,026" im gesamten Panel-Text nicht vorhanden (`includes` false).

**Jupiter, Hochschule, Englisch** (`setUi({ language: 'en' })`, auf „per day" im Panel-Text
gepollt):

> „…its westward drift relative to System III accelerated from about 0.26∘ per day in the 1980s
> to about 0.36∘ per day today, and since 2014 its colour and internal circulation have changed
> noticeably (Simon et al. 2018)."

„0.026" im Panel-Text nicht vorhanden.

**Gymnasium, Thema „Grenzen des Modells", Deutsch** (`setUi({ language: 'de' })`,
`setInfo({ niveau: 'gymnasium', thema: 'modell' })`, auf den Kopfwechsel zu „Grenzen des
Modells" gepollt):

> „Erde als Schwerpunkt: Die Tabelle liefert den Erde-Mond-Schwerpunkt; der Erdmittelpunkt liegt
> je nach Mondabstand rund 4 400 bis 4 900 km daneben."

Satz mit „4 400 bis 4 900 km" vorhanden. Keine Screenshots nötig; Playwright schrieb nur nach
`.playwright-mcp/`, vor dem Commit gelöscht (`git status --short` danach leer).

## 3. Zahlen

- Tests: 5150 vorher (`ce8cf95`) und nachher, unverändert.
- Katalogeinträge: 761 vorher und nachher, unverändert.
- Quellenkarten: 91 vorher und nachher, unverändert.
- Hauptchunk: 1 453,78 kB vorher und nachher, unverändert.
- Wortzahlen der geänderten Texte (`wc -w`, aus `task-1-report.md`, hier gegengerechnet):

| Datei | vorher | nachher |
|---|---|---|
| `src/data/texte/de/hochschule/objekt-jupiter.md` | 2726 | 2729 |
| `src/data/texte/en/hochschule/objekt-jupiter.md` | 2995 | 2997 |
| `src/data/texte/de/gymnasium/thema-modell.md` | 344 | 349 |
| `src/data/texte/en/gymnasium/thema-modell.md` | 387 | 394 |

- Beleglisten: Prozesssprache-Suche 230 Treffer in 40 Dateien → 0 Treffer; Zellenprüfskript
  3 Formfehler → 0; Prüfurteile (`ok`/`Fehler`/`Hinweis`/`neu nach Fachprüfung`) in allen
  bearbeiteten Zeilen laut Task-Berichten inhaltlich unverändert (Regel „Prüfeinträge bleiben
  inhaltlich unverändert").

## 4. Richtigstellung zur Gesamtabnahme

`docs/phase4d-abnahme.md` führt drei Gymnasialbefunde als offen: Uranus-Sonnenwende,
Verona-Rupes-Höhe und Titania/Oberon-Anteile. Alle drei waren bereits seit Commit `44b760c`
(22.09.2026, „Gymnasial- und Grundschultexte an die Hochschultexte des Uranussystems
angeglichen") behoben, bevor die Gesamtabnahme geschrieben wurde — Belege dazu stehen in
`task-1-report.md`, Schritt 9 (Uranus-Sonnenwende: 2030-Aussage in DE/EN bestätigt, kein
Treffer mehr auf „2028"; Miranda-Höhe/-Zeit in DE/EN bestätigt; Titania/Oberon: „Der Masse nach
überwiegt das Gestein, dem Raum nach das Eis" statt „etwa gleiche Anteile" in DE bestätigt).
Task 1 hat diese Stellen nur noch einmal geprüft, nicht erneut geändert. Ruling 9 des Plans legt
fest, dass `docs/phase4d-abnahme.md` selbst als Protokoll des Abschlusses unverändert bleibt;
diese Richtigstellung steht deshalb hier und nicht dort.

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen Projektanleitung
beschrieben (beide Ergebnisse 0 bzw. leer), ohne Suchmuster in dieser Datei.

## 6. Rulings

1. Drei Gymnasialbefunde bereits erledigt (`44b760c`) — Task 1 bestätigt sie nur, die
   Richtigstellung steht in §4, `docs/phase4d-abnahme.md` bleibt unverändert (Ruling 1 des
   Plans, Ruling 9).
2. Fachgeprüfter Hochschultext `objekt-jupiter` wird geändert — ausdrückliche Entscheidung vom
   23.09.2026 (Punkt 2) statt der sonst geltenden Regel „fachgeprüfte Texte werden nicht mehr
   geändert" (Ruling 2 des Plans).
3. „Im selben Zeitraum" entfällt in DE und EN (Ruling 3 des Plans): die Crossref-Quelle
   vergleicht die 1980er-Jahre mit „currently", nicht den Zeitraum 1995–2017 der
   Schrumpfungsraten.
4. Belegliste `objekt-neptune.md` Nr. 57 bleibt unverändert, nicht Teil der Entscheidung
   (Ruling 4 des Plans).
5. Zeilenverweis in `thema-ringe` Nr. 6 wird mitberichtigt, weil Task 3 die Datei ohnehin
   berührt (Ruling 5 des Plans, „bei nächster inhaltlicher Berührung"): „siehe Zeile 60 unten"
   → „siehe Zeile 61 unten".
6. Testkommentare in `dateien.test.ts` gehören zum Sammelbefund und wurden in Task 3 bereinigt
   (Ruling 6 des Plans).
7. Das Suchmuster ist breiter als das der Etappe 4d-7 (auch „Umsetzer", „Controller",
   „Befunddatei", Pfade unter `.superpowers`) und findet deshalb mehr als deren 129 Treffer;
   maßgeblich ist das Ergebnis dieser Suche (Ruling 7 des Plans).
8. Aufteilung der Bereinigung in zwei Tasks nach Trefferzahl, damit jeder auf dem kleinsten
   Modell in einer Sitzung fertig würde (Ruling 8 des Plans) — reichte am Ende nicht: beide
   Umsetzungsversuche auf dem kleinsten Modell mussten nachgearbeitet werden (§8).
9. Keine Gesamtabnahme-Nachträge: `docs/phase4d-abnahme.md` bleibt unverändert (Ruling 9 des
   Plans), siehe §4.
10. Task 2 ging vor der Prüfung einmal zur Vervollständigung an den Umsetzer zurück (37
    regelgedeckte Treffer standengelassen) — zählt nicht als Prüfrunde, weil „0 Treffer"
    offensichtlich unerfüllt war.
11. Nacharbeit Task 2 lief auf dem mittleren statt dem kleinsten Modell, gebündelt mit Task 3
    neu, nachdem der erste Task-3-Versuch auf dem kleinsten Modell verworfen wurde (zwei
    Regelverstöße): Weisung „opus erst nach zweimaligem Scheitern" gilt fürs Hochstufen über das
    mittlere Modell hinaus, nicht für den Schritt vom kleinsten zum mittleren.
12. Zwei geringfügige Nacharbeiten aus Task 3 über den jeweiligen Auftrag hinaus belassen, weil
    sie inhaltsgleiche oder grammatisch saubere Verbesserungen ohne Bedeutungsänderung sind
    (`objekt-europa.md` Nr. 63 „(fachgeprüft(dort fachgeprüft))" → „(fachgeprüft)";
    `szene-jupiter-vorbeiflug.md` Nr. 26 „Ruling 7 korrekt angewendet" → „korrekt übernommen").
13. Die Schlussprüfung des Branchs vor dem Fast-Forward lief auf dem mittleren statt dem
    stärksten Modell (Weisung Jens: möglichst kleine Modelle); der Diff besteht nur aus Texten,
    Beleglisten, zwei Kommentarzeilen und diesem Protokoll. Das Protokoll selbst (Task 4) lief
    plangemäß auf dem mittleren Modell.
14. Das Ledger liegt im vom Werkzeug vergebenen Ordner
    `.superpowers/sdd/2026-09-23-nachfuehrung-nach-phase4d/` statt in dem im Plan genannten
    `.superpowers/sdd/2026-09-23-nachfuehrung-4d/` (git-ignoriert, ohne Folgen).
15. Höchstens eine Prüfrunde je Task statt mehrerer Fix-Runden (Regel von Jens vom
    20.09.2026); Restbefunde stehen in §7.

## 7. Bekannte Unschärfen

- Task 1, zurückgestellt: `objekt-jupiter.md` Nr. 36, Prüfspalte endet „… und bleibt"
  (Planwortlaut, verständlich als „bleibt bestehen") — nicht nachgearbeitet (höchstens eine
  Prüfrunde je Task, Aussage eindeutig).
- Bei der Kontrolle der Prüfurteile nach Task 3 (`git diff --word-diff=plain 8989c69 --
  docs/belege/ | grep -E '\[-[^]]*(ok|Fehler|Hinweis|neu nach|Runde)'`) drei Fehltreffer der
  reinen Wortsuche, keine Änderung an einem tatsächlichen Prüfurteil: `objekt-miranda.md` Nr. 28
  „[-dem Fehlerbefund-]{+Befund F1+} der Fachprüfung" (Teilwort „Fehler" in „Fehlerbefund"),
  `objekt-saturn.md` Nr. 38 „[-(Controller-Hinweis)-]{+(Hinweis bei der Abnahme)+}" (Teilwort
  „Hinweis"), `objekt-tethys.md` Nr. 1 „Siehe [-Befunddatei, Hinweis)-]{+Hinweis der
  Fachprüfung)+}" (Teil der Fußnote innerhalb eines unveränderten „ok"-Urteils).
- `docs/belege/hochschule/szene-saturn-ringkante.md` Nr. 7 nennt „F1 aus Prüfbericht" statt der
  sonst verwendeten Form „Befund F1 der Fachprüfung" — sachlich richtig, nur uneinheitlich;
  zurückgestellt (Schlussprüfung, gering).
- Restbefunde aus früheren Etappen, die diese Nachführung nicht behandelt hat (weiterhin offen,
  Stand Gesamtabnahme, §7 dort): Erdrotation ohne gültiges Modell, Uhr setzt UTC als TDB, Erde im
  Erde-Mond-Schwerpunkt, Pluto im Ursprung statt um den Schwerpunkt, Keplerlöser divergiert bei
  e = 0,999, keine Abplattung der Riesenplaneten, Pole fest ohne periodische Glieder, Uranus/
  Neptun-Rotationsperioden (Voyager), Knotenpräzession um den Mutterpol, fehlende kleine Monde,
  Deimos-Masse, Marspol IAU 2009, Kommentarfehler in `pluto-system.ts`/`uranus-monde.ts`/
  `scenes.ts`, sowie die in der lokalen Projektanleitung unter „Offen und zurückgestellt"
  aufgeführten Kleinigkeiten.

## 8. Fragen an Jens

- **Push:** Der Branch ist fertig und geprüft (5150 Tests, 761 Katalogeinträge, Hauptchunk
  1 453,78 kB, Trailer- und Baumkontrolle beide leer). Fast-Forward nach `master`, Branchlöschung
  und der öffentliche Push stehen noch aus — Push erst nach deinem Ja.
- **Kontingentlimit:** Ist während dieser Nachführung nicht aufgetreten; alle Modellwechsel
  (Ruling 10, 11) waren Qualitätsentscheidungen nach Regelverstößen, keine Kontingentausweichen.
- **Modellwahl für ähnliche mechanische Bereinigungen:** Das kleinste Modell reichte für diese
  Aufgabe nicht — beide Umsetzungsversuche (Task 2 unvollständig, Task 3 verworfen) mussten auf
  das mittlere Modell nachgearbeitet werden. Ob künftige, ähnlich gelagerte mechanische
  Bereinigungen gleich auf dem mittleren Modell starten sollen, liegt bei dir.

## Nacharbeit nach der Schlussprüfung

Die Schlussprüfung des Branchs gab Texte, Beleglisten und Testkommentare frei (Suche nach
Prozesssprache 0 Treffer, Zellenprüfskript ohne Ausgabe, Wort- und Trailerprüfung nach der lokalen
Projektanleitung ohne Befund, Zahlen in §1 und §3 bestätigt) und fand zwei Befunde in diesem
Protokoll: Ruling 13 bezeichnete das Protokoll fälschlich als Schlussprüfung, und das Ruling zum
Ledger-Ordner fehlte. Beides ist in §6 berichtigt (Punkte 13 bis 15); ein geringer Formbefund steht
in §7. Der lokale Hilfsbranch mit dem verworfenen ersten Versuch von Task 3 wird vor dem
Fast-Forward gelöscht.
