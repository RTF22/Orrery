# Abnahme Phase 4d Etappe 9 „Neptun, Pluto"

## 1. Umfang

Branch `hochschule-9` von `master` `dd111b3` (Plan-Commit, 22.09.2026 — der Ausgangsstand vor
dem Plan-Commit führte 4781 Tests und 628 Katalogeinträge, unverändert durch den Plan-Commit
selbst). Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe9.md` (8 Tasks, 24 Plan-Rulings).
Ledger `.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe9/progress.md` (git-ignoriert).

15 Commits über `dd111b3` bis `738b79e` (`git rev-list --count dd111b3..HEAD` auf dem Branch
vor dem Fast-Forward). In Reihenfolge:

| Kurzhash | Titel |
|---|---|
| 44b760c | Gymnasial- und Grundschultexte an die Hochschultexte des Uranussystems angeglichen |
| f9278dd | Hochschultext Neptun mit Belegliste |
| b18732b | Hochschultext Triton mit Belegliste |
| 407d8ab | Hochschultext Neptun: Nacharbeit nach der Fachprüfung |
| b81c9f8 | Hochschultext Pluto mit Belegliste |
| b0fc68b | Hochschultext Triton: Nacharbeit nach der Fachprüfung |
| 859bae1 | Hochschultext Charon mit Belegliste |
| b3aa24e | Hochschultext Pluto: Nacharbeit nach der Fachprüfung |
| 90ad818 | Belegliste objekt-charon: Fachprüfung abgeschlossen |
| e1f6858 | Beleglisten Pluto und Charon: interne Arbeitsbegriffe neutral formuliert |
| e36fd2c | Hochschultext Szene Tritons rückläufige Bahn mit Belegliste |
| 1238bec | Hochschultext Szene Von Neptun zur fernen Sonne mit Belegliste |
| 8ea6959 | Hochschultext Szene Pluto und Charon im Doppel mit Belegliste |
| 6e6b9af | Hochschultexte Szenen Tritons rückläufige Bahn und Von Neptun zur fernen Sonne: Nacharbeit nach der Fachprüfung |
| 738b79e | Hochschultext Szene Pluto und Charon im Doppel: Nacharbeit nach der Fachprüfung |

Sieben neue Hochschultext-Einheiten (de/en): `objekt-neptune`, `objekt-triton`, `objekt-pluto`,
`objekt-charon`, `szene-triton-rueckwaerts`, `szene-ferne-sonne`, `szene-pluto-charon` — je
genau eine Fachprüfung und höchstens eine Nacharbeit (Ruling 3, „höchstens eine Prüfrunde je
Text"). Task 1 (Gymnasial-/Grundschul-Nachführung, 10 Dateien) ist kein Hochschultext, sondern
gleicht bestehende einfachere Texte an das Uranussystem der Vorphase an; keine Fachprüfung, der
Controller prüfte den Diff gegen die Task-1-Tabelle und die Hochschultexte, ohne Befund (Ruling
21). Task 8 (dieses Protokoll, README) ist ein reiner Dokumentationstask.

Reihenfolge Task 1 (unabhängig) → Neptun → Triton → Pluto → Charon → Szenen
`triton-rueckwaerts`/`ferne-sonne` (gemeinsam, Task 6) → Szene `pluto-charon` (Task 7; Ruling
5/6): Neptun lieferte Systemzahlen (GM, Pol, Rotation, Abplattung, Achsneigung) an Triton und
die Neptun-Szenen; Triton lieferte die Einfanggeschichte, auf die Pluto als verwandter
Kuipergürtelkörper verweist; Pluto lieferte die Architektur des Doppelsystems und den
Schwerpunktversatz an Charon; die Szenen übernahmen alle Vorgängerzahlen gleichlautend (Ruling
8). Fachprüfungen liefen jeweils parallel zum nächsten Umsetzer (Ledger-Zeilen „Fachprüfung …
Nacharbeit wartet auf das Ende von Task N"); Nacharbeiten warteten, bis kein anderer Umsetzer
lief — mit einer dokumentierten Ausnahme: Ein aus Task 3 (Triton) gemeldeter Zusatzbefund am
bereits committeten `objekt-neptune.md` (Triton fälschlich „knapp innerhalb der Roche-Grenze")
wurde in dieselbe, noch ausstehende Neptun-Nacharbeit aufgenommen statt eine zweite Runde
auszulösen (Ledger-Ruling). Zwei rein mechanische Zusatz-Commits liefen auf dem kleinsten
Modell (haiku): die nachträglich gefüllte Charon-Prüfspalte (`90ad818`) und der Formfix gegen
Prozesssprache in den Beleglisten Pluto/Charon (`e1f6858`) — beide kein Nacharbeits-Commit im
Sinne einer zweiten Prüfrunde, da keine Aussage geprüft oder geändert wurde.

## 2. Lint, Tests, Build

Lauf auf `738b79e` (Arbeitsbaum sauber, `git status --short` vor diesem Protokoll leer):

```
npm notice run orrery@0.0.0 lint
npm notice run eslint .
```
→ kein Befund.

```
npm notice run orrery@0.0.0 test
npm notice run vitest run
 Test Files  101 passed (101)
      Tests  4935 passed (4935)
   Start at  00:00:27
   Duration  15.40s
```
→ **4935 Tests, 101 Testdateien, alle grün** (Soll laut Plan 4935 erreicht).

```
✓ built in 851ms
```
→ nur die bekannte Warnung zu großen Chunks. Hauptchunk `index-*.js` **1 429,46 kB**.

### Testzahlen (aus den Task-Berichten, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (master `dd111b3`, Plan-Commit, nach 4d-8) | — | 4781 |
| 1 | Gymnasial-/Grundschul-Nachführung | +0 | 4781 |
| 2 | Neptun (Umsetzung + Nacharbeit) | +22 | 4803 |
| 3 | Triton (Umsetzung + Nacharbeit) | +22 | 4825 |
| 4 | Pluto (Umsetzung + Nacharbeit) | +22 | 4847 |
| 5 | Charon (Umsetzung, Prüfspalte, Formfix) | +22 | 4869 |
| 6 | Szenen Tritons rückwärts + ferne Sonne (2 Umsetzungs-Commits + Nacharbeit) | +44 | 4913 |
| 7 | Szene Pluto-Charon (Umsetzung + Nacharbeit) | +22 | 4935 |

4781+0+22+22+22+22+44+22 = 4935, deckt sich mit dem tatsächlichen `npm test`-Lauf. Task 1 (nur
Textänderungen an bereits getesteten Dateien) und alle sieben Nacharbeits-Commits fügen keine
neuen Testfälle hinzu; jede Zahl stammt aus dem jeweils ersten Erstellungscommit eines Texts (2
Dateien × 11 Tests je neuer Hochschultext-Einheit).

### Hauptchunk

Ausgangsstand nach Etappe 4d-8: **1 415,10 kB**. Endstand dieser Etappe (selbst nachgebaut auf
`738b79e`): **1 429,46 kB**. Zuwachs: **+14,36 kB** — weit unter der 50-kB-Schwelle aus
Plan-Ruling 13; keine Eskalation der Frage „fauler Import des Katalogs" an Jens nötig.

Zwischenstände aus den Task-Berichten (chronologisch): Neptun Erstfassung **1 418,02 kB** →
Triton Erstfassung **1 420,95 kB**, nach Nacharbeit **1 426,19 kB** → Pluto Erstfassung
ebenfalls mit **1 426,19 kB** notiert (derselbe Wert wie Tritons Nacharbeitsstand; die beiden
Builds lagen zeitlich nah beieinander, keine Erklärung der Übereinstimmung in den Berichten,
aber auch kein Widerspruch) → Charon **1 427,81 kB**. Für Task 6 und Task 7 melden die Berichte
keinen exakten Hauptchunk-Wert (Task 6 nur „1,43 MB" als grobe Notiz, Task 7 nur die
vorbestehende Warnung) — dieselbe Berichtslücke wie in den Abnahmen 4d-6 §7, 4d-7 §2 und 4d-8
§2 bereits dokumentiert. Kein Sachfehler: Der selbst gemessene Endstand ist mit den
vorhandenen Zwischenwerten und einer plausiblen kleinen Restzunahme über die beiden
ungemessenen Tasks verträglich.

### Katalogeinträge

Ausgangsstand **628** (`git show dd111b3:src/data/literatur.ts | grep -cE "^\s+id: '"`,
entspricht dem Endstand aus Etappe 4d-8; Task 1 ändert `literatur.ts` nicht, `44b760c` zeigt
denselben Wert). Endstand **680** (`grep -cE "^\s+id: '" src/data/literatur.ts`, selbst
nachgezählt). Zuwachs je Task, aus `git show <Commit>:src/data/literatur.ts | grep -c` für
**jeden** der 15 Commits selbst nachgezählt (nicht aus den Berichten übernommen):

| Task | neue Einträge | Katalog danach |
|---|---|---|
| 1 (Nachführung) | 0 | 628 |
| 2 (Neptun, inkl. Nacharbeit) | 12 + 0 = 12 | 640 |
| 3 (Triton, inkl. Nacharbeit) | 11 + 0 = 11 | 651 |
| 4 (Pluto, inkl. Nacharbeit) | 21 + 1 = 22 | 673 |
| 5 (Charon, inkl. Prüfspalte/Formfix) | 6 + 0 = 6 | 679 |
| 6 (Szenen, inkl. Nacharbeit) | 1 + 0 = 1 | 680 |
| 7 (Szene Pluto-Charon, inkl. Nacharbeit) | 0 | 680 |

628+0+12+11+22+6+1+0 = 680, deckt sich mit dem tatsächlich gezählten Katalogstand. Die Summen
stehen in Task-Nummernreihenfolge, nicht in strikter Commit-Chronologie: Task 4s zusätzlicher
Eintrag `sicardy-2021` (Nacharbeit `b3aa24e`) landete chronologisch tatsächlich nach Task 5s
Umsetzung (`859bae1`), da beide Tasks zeitweise parallel liefen (ein Umsetzer gleichzeitig,
Fachprüfungen parallel). **Keine Abweichung zwischen einer Berichtszahl und der eigenen
Nachzählung gefunden** — anders als in den Abnahmen 4d-7 §2 und 4d-8 §2 dokumentiert, wo
einzelne Berichtszahlen von der Nachzählung abwichen.

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog, 680 Einträge), Start-/Endzeitpunkt per
Unix-Zeitstempel vor und nach dem Kommando gemessen (1790114456 → 1790115138):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 680 von 680 Einträgen
[... 774 Zeilen, davon 769 „ok" ...]
cgpm-2022                    crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
greaves-2021                 crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
korablev-2019                 crossref  warnung  Crossref führt die Körperschaft „The ACS and
                                                  NOMAD Science Teams" zuerst, Erstautor
                                                  „Korablev, O." steht unter den weiteren Autoren
mckinnon-2016                 crossref  warnung  Crossref führt die Körperschaft „the New
                                                  Horizons Geology, Geophysics and Imaging Theme
                                                  Team" zuerst, Erstautor „McKinnon, W. B." steht
                                                  unter den weiteren Autoren
sanchez-lavega-2011            crossref  warnung  Crossref führt die Körperschaft „The
                                                   International Outer Planet Watch (IOPW) Team"
                                                   zuerst, Erstautor „Sánchez-Lavega, A." steht
                                                   unter den weiteren Autoren

769 ok, 5 Warnungen, 0 Fehler
```

**Laufzeit:** 682 Sekunden (11:22 min; Ausgangsstand 737 s bei 628 Einträgen nach 4d-8 — trotz
um 52 gewachsenem Katalog etwas kürzer, plausibel durch Schwankungen der Netzwerklatenz
zwischen den Läufen). Keine Zeile mit `429` (`grep -c 429` auf der vollständigen Ausgabe: 0
Treffer). **Kein Fehler in diesem Lauf** — anders als in Abnahme 4d-8 §3 (dort ein transienter
Netzfehler `bobis-2008`); Ruling 22 (Vorgehen bei einem einzelnen Netzfehler mit `--nur`) kam in
dieser Etappe nicht zur Anwendung, da kein Fehler auftrat.

**Fünf Warnungen, vier davon unverändert aus früheren Etappen begründet, eine neu:**

- `cgpm-2022` — Crossref führt die 28. Generalkonferenz für Maß und Gewicht als Körperschaft,
  nicht als Person (seit Etappe 2 akzeptiertes Verhalten).
- `greaves-2021` — Crossref führt das Online-Erstjahr (2020), der Katalog das Druckjahr der
  Ausgabe (2021); in Etappe 4 (Venus) so begründet.
- `korablev-2019` — Crossref führt die Kollektivbezeichnung zuerst, die tatsächliche
  Nature-Kopfzeile Korablev als Erstautor (Muster seit Etappe 4 bekannt).
- `sanchez-lavega-2011` — dasselbe Muster, seit Etappe 4d-6 (Saturn, Task 1) bekannt.
- **`mckinnon-2016` (neu durch diese Etappe, Task 4):** Crossref führt die New-Horizons-Theme-
  Team-Körperschaft vor dem Erstautor McKinnon — bereits im Task-4-Bericht als erwartete,
  unkritische Warnung dokumentiert und von der Fachprüfung ausdrücklich als unkritisch bestätigt
  (`task-4-befunde.md`: „unkritisch, in der Belegliste bereits begründet"); Katalogeintrag
  korrekt.

Keiner der 52 neuen Katalogeinträge dieser Etappe erzeugt einen Fehler; nur einer davon
(`mckinnon-2016`) erzeugt eine Warnung, dieselbe Art wie die bereits vier bekannten.

## 4. Fachprüfung

Zahlen aus den `task-N-report.md`/`task-N-befunde.md`-Dateien, gegengerechnet gegen die
aktuellen Dateien im Arbeitsbaum (`wc -w` auf `src/data/texte/<sprache>/hochschule/…`,
Zeilenzählung der Beleglisten-Tabellen über `grep -cE '^\|'` minus Kopf- und Trennzeile,
eindeutige Literaturkarten je Kombination per Browsermessung `§5.1` gegengeprüft). Je Text
genau eine Fachprüfung, höchstens eine Nacharbeit (Ruling 3).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| Task 1 (Nachführung, kein Hochschultext) | — | — | — | 0 | keine Fachprüfung, Controller-Diffprüfung ohne Befund | keine |
| `objekt-neptune` (Neptun) | 2874 / 3192 | 60 | 24 | 12 | 2/2 (Verweissatz ohne Deckung `thema:innerer-aufbau` → `objekt:uranus`; EN „Schaubild" → „Diagram") plus 1 Zusatzbefund (Triton fälschlich „knapp innerhalb der Roche-Grenze", vom Triton-Umsetzer gemeldet, in derselben Runde behoben) | keine offen |
| `objekt-triton` (Triton) | 2903 / 3275 | 49 | 17 | 11 | 5/5 (Bodendruck 2022 falsche Quelle; Dichtevergleich Triton/Titan/Pluto sachlich falsch; Verweissatz „Innerer Aufbau" ohne Deckung; Prozesssprache in der Belegliste; unbelegter 157°-Literaturwert) | keine offen (2 Hinweise mit Änderung behoben: Ćuk-und-Gladman-Zeitskala „binnen rund 1000 Jahren" statt „wenige Jahrhunderte"; Fundstellen nach der Neptun-Nacharbeit nachgezogen) |
| `objekt-pluto` (Pluto) | 3219 / 3506 | 53 | 26 | 22 | 1/1 (fälschlich Dobrovolskis und Harris 1983 zugeschriebene „chaotische" Schiefe → stabile Oszillation, Zitat auf die Zahlenwerte selbst bleibt) | 1 offen: derselbe Zuordnungsfehler steht unverändert im fachgeprüften `thema-achsneigung.md` (Ruling 8 verbietet die Änderung fachgeprüfter Texte in dieser Etappe) — Entscheidung bei Jens, §8 (3 Hinweise behoben: Sputnik-Planitia-Fläche 870 000 km²; Druckplateau nach 2015 mit `sicardy-2021` neu belegt; Periheldatum mit `quelle:jpl-sbdb` belegt) |
| `objekt-charon` (Charon) | 2364 / 2616 | 50 | 16 | 6 | 0/0 | 1 offen: Buratti 2017 nennt die Spanne 0,4–0,6 „normal reflectance", nicht geometrische Albedo (Prüfer hält die Formulierung für fachlich vertretbar, kein Änderungsvorschlag) — §7/§8 |
| `szene-triton-rueckwaerts` (Szene) | 873 / 967 | 22 | 2 | 1 | 2/2 (Achsenverhältnis kann fast auf eine Linie entarten, statt der behaupteten unteren Schranke 0,05; „volle Bahn passt in jeder Ziehung ins Bild" gilt nur bei Querformat) | keine offen (1 an Fehler 2 gekoppelter Hinweis mit behoben) |
| `szene-ferne-sonne` (Szene) | 734 / 805 | 16 | 2 | 0 | 3/3 (Elevation „Basis 15° ± 10°" widersprach den eigenen Grenzen −10°/+25°; Winkelmaximum rund 175° statt 173°; Belichtungsanteil Neptuns rund 13 % statt 41 %, widersprach `thema-photometrie`) | keine offen (1 Hinweis behoben: Energiebilanzsatz ohne Beleg zurückgenommen statt neu belegt) |
| `szene-pluto-charon` (Szene) | 852 / 975 | 29 | 6 | 0 | 2/2 (DE ließ gegenüber EN und `objekt-pluto` je einen Teilsatz zur Charon-Entstehung weg: „wasserreich"/„wandert aus" bei Canup 2005, „bevor sie vollständig verschmelzen" bei Denton et al. 2025a) | keine offen |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und Trennzeile) unter
`docs/belege/hochschule/`, über `grep -cE '^\|'` minus 2 gezählt und mit den Task-Berichten
deckungsgleich. Zitate sind die im Browser gemessenen, eindeutigen Literaturkarten je
Kombination (§5.1), deckungsgleich mit den `literatur:`-Kennungen in beiden Sprachfassungen (je
Kombination in DE und EN identisch, `zitateGleichKarten` in beiden Sprachen geprüft).
Wortzahlen `wc -w` auf den aktuellen Dateien in `src/data/texte/<sprache>/hochschule/` selbst
gemessen — **stimmen bei allen sieben Texten exakt mit den zuletzt in den Berichten genannten
Zahlen überein**, keine Differenz wie in früheren Etappen (4d-7 §7, 4d-8 §4).

Modellzahlen aus den bereits fachgeprüften Texten (`thema-achsneigung`, `thema-bahnelemente`,
`thema-gebundene-rotation`, `thema-gezeiten`, `thema-resonanzen`, `thema-photometrie`,
`thema-finsternis`, `thema-entstehung`, `thema-bezugssysteme`, `thema-innerer-aufbau`,
`objekt-sun`, `objekt-uranus`) wurden nach Ruling 8 gleichlautend übernommen (Achsneigung
Neptun 28,318°, Rotationsperiode 16,11 h, Belichtungsformel `thema-photometrie`, Sonnenwert
$m_\odot=-26{,}75$, Pluto-Schwerpunktversatz 2126 km, Kartenmitten-Winkel Charon 131,1°/48,9°).
Die einzige Stelle, an der ein Text bewusst von einem fachgeprüften Text abweicht, ist die
Pluto-Nacharbeit (Zuordnungsfehler in `thema-achsneigung.md` bewusst nicht mitgeändert, siehe
Tabelle und §8).

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/`
→ 200), kein zweiter gestartet. `window.store.setState({ quality: { tier: 'high' } })` direkt
nach `browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung (Niveau
Hochschule, Panel eingehängt, `breiteRem: 40`). Szenenindizes am Array in `src/data/scenes.ts`
selbst gegengeprüft (dynamischer Import `/Orrery/src/data/scenes.ts` im Browser):
`triton-rueckwaerts` = **14**, `ferne-sonne` = **3**, `pluto-charon` = **9** — decken sich mit
den im Brief genannten Indizes.

### 5.1 Rundgang

Alle 14 Kombinationen (sieben Kennungen × de/en) angefahren: Körper über
`setInfo({thema:null})` + `setCamera({targetId, mode:'free'})`, Szenen über
`setCinema({running:true, shuffle:false, nummer})` + `setCamera({mode:'cinema'})`, nach
Stabilisierung `setCinema({running:false})`, `setTime({paused:true})`, `setUi({hidden:false})`.
Auf den Kopfwechsel gepollt (Vergleich aufeinanderfolgender Lesungen im Abstand von 50 ms bis
zur Stabilität), Hinweiszeilen erst nach dem Auflösen des faulen Imports gewertet.

**Eigene Messfalle in dieser Etappe gefunden (im Klicktest-Skript selbst, nicht im
Rundgang):** Das erste Klicktest-Skript baute Szenen-Kombinationen auf, ohne vorher
`ui.info.thema` zurückzusetzen. Da der vorangegangene Einzeltest (`thema`-Verweisart) das
Thema gesetzt hatte, zeigte das Infopanel trotz bereits korrekt umgeschaltetem Kopftext
(„Szene: …") kurzzeitig noch Inhalt der vorherigen Thema-Seite samt eines dortigen, zu einer
fachfremden Szene (`mondfinsternis`, `mondtanz`) führenden `szene:`-Verweises — mit einem
gezielten Gegentest (Inhalt bis zur Stabilität abgewartet, direkt nach frischem Szenenaufbau
ohne vorherigen Thema-Besuch) bestätigt: Ohne die stehengebliebene Thema-Auswahl liefert
`querySelector('[data-verweis^="szene:"]')` korrekt `null` — die drei betroffenen Szenentexte
(`triton-rueckwaerts`, `ferne-sonne`, `pluto-charon`) enthalten tatsächlich **keinen**
`szene:`-Verweis (per `grep` auf die Rohtexte bestätigt). Nach Ergänzen von
`setInfo({thema:null})` vor **jedem** Kombinationsaufbau (nicht nur bei Körpern) verschwanden
alle scheinbaren Fehltreffer; für den eigentlichen Rundgang selbst (der stets die im Brief
vorgegebene Reihenfolge einhält und zwischen Körpern immer `thema:null` setzt) ohne Auswirkung.
Kein Programmfehler der Etappe, sondern eine Messvorschrift-Lücke des eigenen Klicktest-Skripts.

**Bestätigte Messfalle (wie in Abnahme 4d-6/4d-7/4d-8 §5.1 dokumentiert):** `objekt:`- und
`thema:`-Verweise sind im DOM `<button>`-Elemente, keine `<a>`-Elemente — ein erster Versuch mit
`a[data-verweis="objekt:charon"]` schlug fehl (`null`), erst `[data-verweis="objekt:charon"]`
ohne Tag-Einschränkung fand das Element. Durchgehend ohne Tag-Einschränkung verwendet.

**Kernkriterien, alle 14 Kombinationen:** `formelfehler` **0**, keine Hinweiszeile (insbesondere
keine `info.hochschuleFolgt`), `zitateGleichKarten` **true**.

**14 von 14 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `objekt:neptune` | Neptun | Neptune | 74 | 1 | 24 |
| `objekt:triton` | Triton | Triton | 38 | 1 | 17 |
| `objekt:pluto` | Pluto | Pluto | 55 | 1 | 26 |
| `objekt:charon` | Charon | Charon | 53 | 1 | 16 |
| `szene:triton-rueckwaerts` (Nr. 14) | Szene: Tritons rückläufige Bahn | Scene: Triton's retrograde orbit | 7 | 0 | 2 |
| `szene:ferne-sonne` (Nr. 3) | Szene: Von Neptun zur fernen Sonne | Scene: From Neptune to the distant Sun | 9 | 0 | 2 |
| `szene:pluto-charon` (Nr. 9) | Szene: Pluto und Charon im Doppel | Scene: Pluto and Charon, a double world | 35 | 0 | 6 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (in beiden Läufen gemessen) — keine
DE/EN-Verweisasymmetrie in dieser Etappe.

**Klicktest je Verweisart:** Je Kombination wurde von jeder der fünf Verweisarten (`objekt`,
`thema`, `szene`, `quelle`, `literatur`) das erste Vorkommen über `[data-verweis^="<art>:"]`
ermittelt, per `element.click()` ausgelöst und die Wirkung gegen die Tabelle im Brief geprüft
(`objekt` → `camera.targetId` nach 1,7 s Wartezeit; `thema` → `ui.info.thema`; `szene` →
`cinema.nummer` gegen den erwarteten Index samt `camera.mode==='cinema'`, danach Kino explizit
gestoppt; `quelle`/`literatur` → Kartenklasse enthält `border-sky-300`, Klick und Prüfung in
einem `browser_evaluate`); die Kombination wurde vor jedem Einzeltest frisch aufgebaut
(einschließlich `setInfo({thema:null})`, siehe Messfalle oben).

7 Kennungen × 2 Sprachen × 5 Arten = 70 Einzeltests. Zwölf davon ohne Vorkommen (kein Befund):
`objekt:pluto` und `objekt:charon` enthalten keinen `quelle:`-Verweis (je 2), die drei
Szenentexte enthalten keinen `szene:`-Verweis (je 2) — macht 6 Kombinationen × 2 Sprachen = 12
„kein Vorkommen", per `grep` auf die Rohtexte vorab bestätigt.

**Ergebnis: 58 von 58 anwendbaren Klicktests trafen.** `objekt` → `camera.targetId` stimmt in
allen Fällen; `thema` → `ui.info.thema` stimmt; `szene` → `cinema.nummer` traf den erwarteten
Index samt `camera.mode==='cinema'` (getestet an `objekt:neptune`→`szene:triton-rueckwaerts`,
`objekt:triton`→`szene:triton-rueckwaerts`, `objekt:pluto`/`objekt:charon`→`szene:pluto-charon`);
`quelle`/`literatur` → Karte trug `border-sky-300` in allen Fällen.

### 5.2 Ersatz entfällt

Nach Ruling 20: drei Paare je Sprache (sechs Messungen), Zeilennummern vorher per `grep -n`
bestätigt (DE Z. 91/EN Z. 89 `thema-resonanzen`→`objekt:pluto`; DE Z. 221/EN Z. 214
`thema-finsternis`→`objekt:charon`; DE Z. 372/EN Z. 357 `objekt-sun`→`szene:ferne-sonne`),
Wartezeit bis zum Kopfwechsel (`performance.now()`, Zeit vom Klick bis zum ersten Poll mit
passendem Kopf):

| Messung | Kopf vorher | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|---|
| `thema:resonanzen` → `objekt:pluto` (de) | Bahnresonanzen | Pluto | keine | 65 ms |
| `thema:finsternis` → `objekt:charon` (de) | Finsternisse | Charon | keine | 25 ms |
| `objekt:sun` → `szene:ferne-sonne` (de) | Sonne | Szene: Von Neptun zur fernen Sonne | keine | 0 ms |
| `thema:resonanzen` → `objekt:pluto` (en) | Orbital resonances | Pluto | keine | 53 ms |
| `thema:finsternis` → `objekt:charon` (en) | Eclipses | Charon | keine | 55 ms |
| `objekt:sun` → `szene:ferne-sonne` (en) | Sun | Scene: From Neptune to the distant Sun | keine | 0 ms |

`objekt:`/`thema:`-Verweise sind `<button>`-Elemente (siehe §5.1); der Selektor
`[data-verweis="…"]` ohne `a`-Präfix fand in allen sechs Fällen den richtigen Klickpunkt. Alle
sechs Messungen ohne Hinweiszeile: Die vorher an `thema:resonanzen` bzw. `thema:finsternis`/
`objekt:sun` gezeigte Ersatz-Hinweiszeile für Pluto, Charon bzw. die Szene ist entfallen, weil
diese Etappe die entsprechenden Hochschultexte liefert. Bei der dritten Messung (c) lag die
Wartezeit bei 0 ms, weil der Kopf beim ersten Poll nach der Kinostart-Stabilisierung (1,5 s) und
dem 200-ms-Warten bereits umgestellt war.

### 5.3 Konsole

`browser_console_messages` (seit dem Navigate, `all: true`, Ebene `warning`): **0 Fehler, 0
Warnungen** über die gesamte Sitzung (Navigate, 14er-Rundgang, 70 Klicktests, sechs
Ersatz-Messungen). Da keine Warnung auftrat, entfällt die im Brief vorgesehene Gegenprobe mit
echtem `browser_click`.

Playwright-Aufnahmen unter `.playwright-mcp/` werden vor dem Commit gelöscht, keine Skripte im
Projektstamm angelegt.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge.

**Vorprüfung (Controller, 22.09.2026):**

- Der Task-Review des Skills wird bei Text-Tasks durch die im Plan vorgeschriebene Fachprüfung
  ersetzt, höchstens eine Runde (Regel von Jens 20.09.2026); Task 1 prüft der Controller am
  Diff, Task 8 die Schlussprüfung — Projektregel geht der Skill-Vorgabe vor. Kosten bei
  Fehlurteil: ein Fehler, den erst die Schlussprüfung oder Jens findet.

**Nach Task 3 (Triton), Zusatzbefund am bereits committeten Neptun-Text:**

- Der Zusatzbefund (Triton fälschlich „knapp innerhalb der Roche-Grenze" in `objekt-neptune.md`)
  geht in die eine Neptun-Nacharbeit, obwohl er nicht aus der Neptun-Fachprüfung stammt — ein
  erkannter Sachfehler bleibt nicht stehen, und es ist dieselbe Nacharbeitsrunde, keine zweite.
  Kosten bei Fehlurteil: keine, die Stelle ist rechnerisch eindeutig falsch.

**Nach Task 4 (Pluto), Fachprüfung — Zuordnungsfehler auch in `thema-achsneigung.md`:**

- Derselbe Zuordnungsfehler („chaotische" Schiefe fälschlich Dobrovolskis und Harris 1983
  zugeschrieben) steht im fachgeprüften `thema-achsneigung.md` (DE Z. 220–225); nach
  Plan-Ruling 8 wird der fachgeprüfte Text in dieser Etappe nicht geändert, der Befund geht in
  Protokoll §8 mit dem Vorschlag einer Nachführung. Kosten bei Fehlurteil: ein bekannter
  Zuordnungsfehler bleibt bis zu Jens' Entscheidung im Thema stehen.

**Nach Task 5 (Charon), Fachprüfung — Buratti-Hinweis:**

- Der Charon-Hinweis (Buratti 2017 „normal reflectance" statt geometrische Albedo) geht ins
  Protokoll §7 statt in eine Nacharbeit — der Prüfer hält die Formulierung für fachlich
  vertretbar und schlägt keine Änderung vor. Kosten bei Fehlurteil: ein unscharfer Begriff in
  einem Satz.

**Nach dem Controller-Befund zu Prozesssprache in den Beleglisten Pluto/Charon:**

- Die Prozesssprache wird in einem rein sprachlichen Formfix (kleinstes Modell) entfernt, ohne
  Inhalt, Zahlen oder Prüfurteile zu ändern; das zählt nicht als zweite Prüfrunde, weil keine
  Aussage geprüft oder geändert wird. Kosten bei Fehlurteil: ein zusätzlicher Commit, den Jens
  als Formfix erkennt.

**Nach dem Controller-Befund zur vorbefüllten Prüfspalte (Task 6, beide Beleglisten):**

- Die Fachprüfer überschreiben jede Prüfzelle beider Listen mit ihrem eigenen Urteil; kein
  eigener Leerungs-Commit — die Prüfer müssen jede Zeile ohnehin selbst beurteilen, und die
  Nacharbeit committet das Ergebnis. Kosten bei Fehlurteil: ein Prüfer übernimmt eine
  Vorbefüllung ungeprüft; Gegenmaßnahme: Controller prüft nach der Prüfung, dass keine Zelle
  mehr aus der Umsetzung übernommen ist.

**Umsetzung Task 6 (Szene „Von Neptun zur fernen Sonne"):**

- Stone et al. 2019 beschreibt die Heliopause-Überschreitung Voyager 2s (5.11.2018, 119 AE),
  nicht den Termination Shock, wie der Ausgangspunkt der Recherche nahelegte; der Text nennt
  korrekt die Heliopause. Kosten bei Fehlurteil: eine falsch benannte Grenze im Text.
- Die Szene belichtet entgegen der ursprünglichen Annahme nicht auf Neptun, sondern über
  `lookAtId` auf die Sonne; Neptun liegt in jeder Ziehung außerhalb des Bildfelds. Beide
  Befunde stehen in „Was das Bild zeigt" und „Modellgrenzen" statt der ursprünglich
  angenommenen Beschreibung. Kosten bei Fehlurteil: eine Szene, deren Text die eigentliche
  Kameraszene nicht trifft.

**Kontrollbefunde ohne Ruling-Charakter (zur Einordnung in §7/§8, kein eigenes Ruling):**

- Beleglisten `objekt-pluto` (Z. 12, 44, 50, 88, 91, 102–105) und `objekt-charon` (Z. 21)
  enthielten Prozesssprache, von beiden Fachprüfern übersehen — Anlass des Formfix-Rulings oben.
- Prüfspalte beider Beleglisten von Task 6 war vom Umsetzer vorbefüllt — Anlass des
  Prüfspalten-Rulings oben.
- Szene `ferne-sonne` zeigt Neptun in keiner Ziehung (Winkel 123°–175° gegen Halbfeld 25°) und
  belichtet auf die Sonne statt auf Neptun; der Text beschreibt den Ist-Code korrekt — Kandidat
  für einen eigenen Szenen-Task, §7/§8.

Die 24 Plan-Rulings selbst stehen vollständig im Plan
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe9.md` Abschnitt „Rulings" und sind
inhaltlich in §1 (Reihenfolge, Modelle, eine Prüfrunde), §2 (Richtwerte, Obergrenzen), §4
(Prüfpunkte, Ruling 8), §5 (Ersatz entfällt, Ruling 20) dieses Protokolls eingearbeitet; als
Themenliste in §8.

## 7. Bekannte Unschärfen

**Fehlzuschreibung „chaotische Schiefe" (Task 4, §6):** Dobrovolskis und Harris 1983
beschreiben laut eigener Zusammenfassung eine stabile, nahezu sinusförmige Oszillation
(102°–126° über rund 3 Mio. Jahre), keine chaotische Schwankung. Der Pluto-Text wurde in der
Nacharbeit korrigiert; derselbe Fehler steht unverändert im bereits fachgeprüften
`thema-achsneigung.md` (Ruling 8 verbietet die Änderung in dieser Etappe) — Kandidat für eine
Nachführung, §8.

**Plan-Ausgangspunkte ungenau (mehrere Fälle dieser Etappe, wie in früheren Etappen wiederkehrend
dokumentiert):**

- Proudfoot et al. 2026 sagt **keine** neue Pluto-Charon-Ereignisserie voraus, sondern Ereignisse
  für fünf andere transneptunische Doppelsysteme (Task 5, an der Quelle geprüft).
- Charon/Pluto (Massenverhältnis rund 0,12) ist nicht mehr uneingeschränkt „das größte Verhältnis
  unter Planeten und Zwergplaneten": Orcus–Vanth erreicht laut Brown und Butler 2023 rund 0,16.
  Charon bleibt das größte Verhältnis nur unter den fünf von der IAU anerkannten Zwergplaneten
  (Task 5, neuer Katalogeintrag `brown-butler-2023`).
- Für Plutos Druckzeitreihe war weder „Sicardy et al. 2024" (behandelt Triton) noch ein
  passendes „Young"-Werk einschlägig; verwendet wurde die tatsächlich passende, im Plan nicht
  genannte Arbeit Meza et al. 2019 (Task 4).
- `stone-2019` beschreibt die Heliopause-Überschreitung Voyager 2s (2018, 119 AE), nicht den
  Termination Shock, wie der Plan-Ausgangspunkt für `ferne-sonne` nahelegte (Task 6).
- Plutos Sonnenabstand zum Datum (22.09.2026) beträgt selbst nachgerechnet 35,6 AE, nicht die
  Plan-Angabe „rund 34 AE" (Task 7).

Alle fünf Punkte wurden in den jeweiligen Texten selbst richtiggestellt, keine Textfehler mehr
offen; vorgemerkt als wiederkehrendes Muster ungenauer Plan-Ausgangspunkte (wie mehrfach in
Etappe 4d-4 dokumentiert).

**Verfahrensbefund Prüfspalte (Task 6, §6):** Beide Beleglisten (`szene-triton-rueckwaerts`,
`szene-ferne-sonne`) waren beim Erstellungscommit vom Umsetzer bereits (teilweise) vorbefüllt.
Beide Fachprüfer haben nachweislich jede Zeile unabhängig geprüft und die gesamte Spalte mit
eigenem Urteil überschrieben — kein Prüfschritt tatsächlich ausgefallen, nur ein
Verfahrensfehler des Umsetzers.

**Prozesssprache in den Beleglisten Pluto/Charon (§6):** Von beiden Fachprüfern übersehen, per
Formfix `e1f6858` behoben (grep-Kontrolle 0 Treffer nach dem Fix).

**Szene `ferne-sonne` zeigt Neptun nie im Bild (Controller-Befund, §6):** Eigene Rastersuche des
Task-6-Umsetzers (36×36 Stützpunkte über den gesamten gezogenen Bereich) zeigt: Der Winkel
zwischen Blickrichtung (Kamera→Sonne) und Richtung Kamera→Neptun liegt in jeder Ziehung zwischen
123° und rund 175° — weit über dem horizontalen Halbfeld von 39,7°. Die Belichtung folgt über
`lookAtId` der Sonne, nicht Neptun. Der Text beschreibt das jetzt korrekt als Modellgrenze;
Kandidat für einen eigenen Szenen-Task (Kamera hinter Neptun oder Blick auf beide Körper), §8.

**Code-/Datensatz-Befunde, in dieser Etappe selbst gefunden oder bestätigt (nicht behoben,
Texte beschreiben den Ist-Code, Ruling 7):**

- `render/bodies.ts` skaliert jede Kugel nur mit einem Faktor: Neptuns Abplattung (0,0171,
  Äquatorradius rund 0,6 % über `radiusKm`) ist im Renderer nicht sichtbar.
- Drei veröffentlichte Rotationsperioden Neptuns weichen um mehr als eine Stunde voneinander ab
  (16,11 h Voyager-Radio, 15,9663 h Karkoschka-Südpolmerkmale, rund 17,46 h formbasiert); der
  Datensatz führt die älteste, am wenigsten genaue der drei (Ruling 23: bleibt so).
- Katalog führt von mindestens 16 bekannten Neptunmonden nur Triton; Nereid, Proteus und alle
  kleinen, unregelmäßigen Monde fehlen, ebenso Neptuns Ringe, Atmosphäre, Magnetfeld und
  Wolken-/Sturmsysteme im Renderer.
- Tritons fester Pol trotz IAU-Reihe mit großen periodischen Gliedern; der Datenblockwert
  „Achsneigung" (21,4°) ist damit ein Artefakt des festen Pols, nicht Tritons physikalische
  Schiefe (rund 0,7° nach Nimmo und Spencer 2015).
- Renderer kennt keine Atmosphären, keinen Dunst und keine Geysire; Triton erscheint als scharf
  begrenzte Kugel; die unbeleuchtete Nordhalbkugel der Voyager-2-Mosaik (rund 38,5 % der
  Fläche) erscheint schwarz.
- `nodeDot = lpDot = 0` im Datensatz (keine Knotenpräzession) für Triton; Okkluder-Auswahl für
  Neptun trivial, da `neptunMonde` nur Triton enthält.
- Pluto im Ursprung seines Systems statt um den tatsächlichen Schwerpunkt (2126 km/1,79
  Plutoradien Versatz) — Kernbefund von Task 4, ausführlich im Text unter „Im Modell"
  dargestellt.
- Styx, Nix, Kerberos und Hydra fehlen im Katalog; `waehleOkkluder` wählt für Pluto trivial immer
  nur Charon und umgekehrt (`MAX_OKKLUDER = 4` bleibt in beiden Richtungen ungenutzt).
- Keine Atmosphäre, kein Dunst, keine Jahreszeiten für Pluto/Charon im Renderer.
- Katalogalbedo Pluto/Charon (NSSDC-Vollkugelmittel, 0,52/0,42) weicht von der photometrisch
  gemessenen Albedo (Buratti 2017: 0,62/0,41) deutlich ab; GM-Katalogwerte weichen um
  +416/−2300 ppm von Brozović 2015 ab (beide innerhalb der Darstellungsgenauigkeit).

**Quellen hinter Verlagssperren (HTTP 403/404/405 oder Bot-Sperre), je Text (aus den
Task-Berichten, keine durchgehende Auszählung wie in Abnahme 4d-8 §7, da die Berichte dieser
Etappe keine einheitliche Zahlenangabe je Text führen):**

- Neptun: mehrere Arbeiten vor 1997 (Science, Icarus) nur über Abstract/Sekundärquelle
  zugänglich, per WebSearch ergänzt.
- Triton: Chyba et al. 1989 nur als ADS-PDF-Scan ohne DOI erreichbar; mehrere Elsevier-Arbeiten
  (Icarus/Science vor 2000) ohne Open Access, über Sekundärquellen belegt.
- Pluto/Charon: laut Fachprüfer „Volltexte großteils paywallgeschützt", primär über unabhängige
  Sekundärquellen und Abstract-Wiedergaben geprüft, Kernwerte gegen den Quellcode nachgerechnet;
  der Charon-Fachprüfer öffnete dagegen mehrere Volltexte direkt über Verlags-/Autorenseiten
  (Buratti 2017, Desch und Neveu 2017).
- Szenen: keine gesonderten Sperrungsprobleme über die bereits bei den Objekttexten
  dokumentierten hinaus.

In allen Fällen stützen sich die Aussagen auf live geprüfte Crossref-Metadaten plus mindestens
eine unabhängige, selbst abgerufene Zusammenfassung oder Sekundärquelle.

**Methodik, für alle sieben Texte gleich:** Node kann die echten Projektfunktionen
(`src/data/index.ts`, `src/sim/orbit.ts` u. a.) ohne `tsx`/`vite-node` nicht direkt ausführen;
alle „Nachrechnung am Code"-Zeilen der Beleglisten beruhen auf direkt aus den Quelldateien
gelesenen Formeln und Werten, von Hand oder per Skript im Scratchpad angewendet — wie in der
lokalen Projektanleitung dokumentiert.

## 8. Halt: Fragen an Jens

**Fehlzuschreibung „chaotische Schiefe" auch in `thema-achsneigung.md` (§6/§7):** Der
Pluto-Text wurde selbst korrigiert (stabile Oszillation statt „chaotisch", Zitat auf die
Zahlenwerte bleibt bei Dobrovolskis und Harris 1983), weicht damit aber bewusst vom
fachgeprüften `thema-achsneigung.md` (DE Z. 220–225) ab, das denselben Fehler noch trägt.
Vorschlag: kleinen Nachführungs-Task für `thema-achsneigung.md` vormerken (dieselbe
Berichtigung wie im Pluto-Text).

**Charon-Hinweis Buratti 2017 „normal reflectance" (§4/§7):** Der Prüfer hält die aktuelle
Formulierung für fachlich vertretbar, da das Paper selbst bei lunar-ähnlicher Streuung
(wie Charon) beide Größen gleichsetzt. Vorschlag: zur Kenntnis nehmen, keine Änderung.

**Plan-Ausgangspunkte ungenau, fünf Fälle dieser Etappe (§7):** Proudfoot 2026 (keine neue
Pluto-Charon-Serie), Orcus–Vanth-Massenverhältnis 0,16 über Charon/Pluto 0,12, Sicardy 2024
betrifft Triton statt Pluto, `stone-2019` betrifft die Heliopause statt den Termination Shock,
Plutos Sonnenabstand 35,6 statt „rund 34 AE". Alle in den Texten selbst richtiggestellt.
Vorschlag: zur Kenntnis nehmen (wiederkehrendes Muster, wie mehrfach in 4d-4 dokumentiert).

**Szene `ferne-sonne` zeigt Neptun in keiner Ziehung (§6/§7):** Die Kamera blickt von Neptuns
Standort zur Sonne; Neptun bleibt bei jeder Ziehung außerhalb des Bildfelds (Winkel 123°–175°
gegen ein Halbfeld von 39,7°), die Belichtung folgt der Sonne, nicht Neptun. Der Text beschreibt
das jetzt korrekt. Vorschlag: einen kleinen eigenen Szenen-Task vormerken (Kamera hinter Neptun
platzieren oder Blick auf beide Körper), Entscheidung bei Jens — nicht Teil dieser Etappe.

**Verfahrensbefund Prüfspalte bei Task 6 (§6/§7):** Beide Beleglisten waren beim
Erstellungscommit vorbefüllt; beide Fachprüfer haben nachweislich unabhängig nachgeprüft (kein
übersehener Prüfschritt zu erwarten). Vorschlag: zur Kenntnis nehmen, keine weitere Maßnahme
(wie bei demselben Befundtyp in Etappe 4d-8 entschieden).

**Prozesssprache in den Beleglisten Pluto/Charon (§6/§7):** Von beiden Fachprüfern übersehen,
per Formfix `e1f6858` behoben. Vorschlag: zur Kenntnis nehmen.

**Fünfte Prüfskript-Warnung `mckinnon-2016` (§3):** Crossref führt die New-Horizons-Theme-Team-
Körperschaft vor dem Erstautor — dasselbe, seit Etappe 4 bekannte Muster wie bei
`korablev-2019`/`sanchez-lavega-2011`, bereits im Task-4-Bericht begründet. Vorschlag: wie die
anderen vier Warnungen akzeptieren.

**Code-/Datensatz-Befunde, als Kandidaten für eigene Tasks (§7 für Details):**

- Neptun ohne Abplattung im Renderer; drei widersprüchliche Rotationsperioden, Datensatz führt
  die ungenaueste (Ruling 23: vorerst so belassen, ein Datensatzwechsel wäre ein eigener Task).
- Fehlende Neptunmonde (Nereid, Proteus u. a.), Ringe, Atmosphäre, Magnetfeld, Wolkensysteme.
- Tritons fester Pol trotz IAU-Reihe; Datenblock-„Achsneigung" (21,4°) ist ein Artefakt.
- Renderer ohne Atmosphären/Dunst/Geysire (Triton, generisch für alle Körper mit Atmosphäre).
- Pluto im Ursprung statt um den Schwerpunkt (2126 km) — Kernbefund, bereits mehrfach vorgemerkt
  (siehe auch die lokale Projektanleitung, Abschnitt „Offen und zurückgestellt").
- Fehlende kleine Monde Styx/Nix/Kerberos/Hydra; `waehleOkkluder` trivial für Pluto/Charon.
- Katalogalbedo Pluto/Charon weicht von Buratti 2017 ab; GM-Katalogwerte weichen von Brozović
  2015 ab (beide innerhalb der Darstellungsgenauigkeit, kein dringender Handlungsbedarf).
- Szene `ferne-sonne` (siehe oben).

**Modelle (Plan-Ruling 2/Ledger):** Kein Kontingentlimit in dieser Etappe — alle
Umsetzer-/Nacharbeitsrunden für die sieben Hochschultexte, alle sieben Fachprüfungen und diese
Abnahme liefen durchgehend auf dem mittleren Modell (sonnet); der Formfix (`e1f6858`) und die
nachträglich gefüllte Charon-Prüfspalte (`90ad818`) liefen wie vom Plan vorgesehen auf dem
kleinsten Modell (haiku). Keine offene Frage, nur zur Kenntnis.

**24 Plan-Rulings** und die in §6 aufgeführten Umsetzungs-Rulings (von Jens noch nicht
bestätigt, vollständiger Wortlaut in
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe9.md` Abschnitt „Rulings" und in
diesem Protokoll §6). Als Themenliste: Freigabe durch die 4d-8-Entscheidung und „mach weiter"
(1); Modelle/eine Prüfrunde (2/3); Richtwerte 1500–3500 Neptun/Triton/Pluto, 1000–2000 Charon,
300–900 Szenen (4); Reihenfolge Task 1 → Neptun → Triton → Pluto → Charon → Szenenpaar → Szene
Pluto-Charon (5); Szenenpaar gemeinsam in Task 6, Pluto-Charon allein in Task 7 (6);
Datensatz-Befunde nicht behoben (7); Modellzahlen aus fachgeprüften Texten gleichlautend
übernehmen (8); kein eigener Verweis-Task (9); Tausendertrennung/Zahlenspannen (10); neun
Prüfpunkte, Prüfpunkt 9 bei Zielen ohne Hochschultext gegen den Gymnasialtext (11); keine
Formelsatz-Sichtprüfung ohne neuen TeX-Befehl (12); Katalog im Hauptbundle unter der
50-kB-Schwelle (13); Fast-Forward, Push erst nach Jens' Ja (14); Wortzahl-Obergrenze ein Drittel
über dem Richtwert (15); Katalogform wie 4d-4/4d-6 bis 4d-8 (16); Quellenkarten als Angebot,
keine Pflicht (17); Beleglisten-Nacharbeit mit Zellenkontrolle (18); Schlussprüfung dient als
Task-Prüfung der Abnahme (19); Ersatz entfällt über `resonanzen`→`pluto`, `finsternis`→`charon`,
`sun`→`ferne-sonne` (20); Task-1-Umfang (vier 4d-8-Befunde plus Miranda-Grundschule, Messina-
Chasma-Satz bleibt) (21); Prüfskript-Befunde der Abnahme 4d-8 §7 nicht behoben, Netzfehler-
Nachprüfung mit `--nur` (22); Neptun-Rotationsperiode bleibt bei 16,11 h (23); Plutos
Einstufung folgt der IAU-Resolution von 2006, keine eigene geophysikalische Debatte (24).

## Nacharbeit nach der Schlussprüfung (23.09.2026)

Schlussprüfung „Bereit zum Fast-Forward: Ja", Befunde: 0 kritisch, 0 wichtig,
0 klein. Die Prüfung ging den Diff der Nachführung (Task 1), alle 52 neuen
Katalogeinträge (628 → 680 je Commit, drei DOIs per Crossref nachgeschlagen),
die neue Quellenkarte `nasa-family-portrait`, die erweiterten `fuer`-Felder,
die README-Änderung, das Protokoll und alle Commit-Texte durch. Nachgetragen
wurden danach in §6 die zwei Rulings aus der Umsetzung der Szene „Von Neptun
zur fernen Sonne" (`stone-2019`, Belichtung und Bildausschnitt), die dort
fehlten; inhaltlich standen beide bereits in §7 und §8.

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen Projektanleitung
beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.
