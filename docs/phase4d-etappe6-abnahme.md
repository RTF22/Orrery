# Abnahme Phase 4d Etappe 6 „Saturn und Ringe"

## 1. Umfang

Branch `hochschule-6` (von `master` `c74c4b4`, Plan-Commit, 21.09.2026). Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-21-phase4d-hochschule-etappe6.md` (8 Tasks,
22 Plan-Rulings). Ledger
`.superpowers/sdd/2026-09-21-phase4d-hochschule-etappe6/progress.md`
(git-ignoriert).

16 Commits über `c74c4b4` bis `03f9d34`
(`git rev-list --count c74c4b4..HEAD`). In Reihenfolge:

| Kurzhash | Titel |
|---|---|
| 3c80c27 | Hochschultext Saturn mit Belegliste |
| 470bb1a | Hochschultext Ringsysteme mit Belegliste |
| 87e10ee | Hochschultext Saturn: Nacharbeit nach der Fachprüfung |
| 2d8fdcf | Hochschultext Titan mit Belegliste |
| b7e8520 | Hochschultext Ringsysteme: Nacharbeit nach der Fachprüfung |
| 2e98f13 | Hochschultext Enceladus mit Belegliste |
| 04820ae | Hochschultext Titan: Nacharbeit nach der Fachprüfung |
| 6474e75 | Belegliste objekt-enceladus: Fachprüfung abgeschlossen |
| 3ac8ed8 | Hochschultexte Szenen Saturn im Streiflicht und Ringe von der Kante mit Beleglisten |
| c1fe343 | Hochschultext Szene Durchflug durch Saturns Ringe mit Belegliste |
| a83cc85 | Hochschultext Szene Ringdurchflug: Tausendertrennung bei vierstelliger Zahl in der englischen Fassung korrigiert |
| 63251d2 | Hochschultexte Szenen Streiflicht und Ringkante: Nacharbeit nach der Fachprüfung |
| 19e0464 | Hochschultext Szene Ringdurchflug: Nacharbeit nach der Fachprüfung |
| 3e35584 | Hochschultext Venus: Verweis auf einen Arbeitsschritt aus dem Text entfernt |
| 75a1ba7 | Hochschultexte Szenen Titan im Dunst und Enceladus im hellen Glanz mit Beleglisten |
| 03f9d34 | Hochschultexte Szenen Titan im Dunst und Enceladus im hellen Glanz: Nacharbeit nach der Fachprüfung |

Sieben neue Hochschultexte (de/en): `objekt-saturn`, `thema-ringe`,
`objekt-titan`, `objekt-enceladus`, `szene-saturn-streiflicht`,
`szene-saturn-ringkante`, `szene-ringdurchflug`, `szene-titan-dunst`,
`szene-enceladus-hell` — neun Textpaare, in sieben Tasks umgesetzt (Task 5
bündelt Streiflicht/Ringkante, Task 7 bündelt Titan-Dunst/Enceladus-Hell,
je eine Fachprüfung über beide Textpaare). Enceladus (Task 4) brauchte nach
der Gegenprüfung keine Nacharbeit (0 Fehler); die ausgefüllte Prüfspalte kam
mit einem eigenen Commit ins Repository (Gemeinsame Vorgaben Punkt 13). Task 6
(Ringdurchflug) und Task 7 hatten je eine kleine, vom Controller selbst
ausgeführte Nacharbeit (kein Umsetzer-Subagent, da die Befunde mechanisch
klein genug waren). Der Commit `3e35584` behebt einen Nebenbefund aus dieser
Etappe an einem Text der Etappe 4d-4 (`objekt-venus.md`, siehe §7). Task 8
(dieses Protokoll, README) ist ein reiner Dokumentationstask.

Zwei Subagenten gingen durch einen VSCode-Absturz am 21.09.2026 gegen 12:05
Uhr verloren (Fachprüfung Task 3, Nacharbeit Task 2); beide wurden auf
demselben Basis-Commit neu gestartet, ohne Datenverlust außer der noch nicht
begonnenen Prüfung (Ledger-Zeile „21.09.2026 ~12:05").

## 2. Lint, Tests, Build

Lauf auf `03f9d34` (Arbeitsbaum sauber, `git status --short` leer vor diesem
Protokoll):

- `npm run lint` → kein Befund.
- `npm test` → **4475 Tests, 101 Testdateien, alle grün**, ohne Worker-Exit
  (Soll laut Plan 4475 erreicht; die im Ledger vermerkte Umgebungsstörung bei
  Task 3 — ein einmaliger Worker-Absturz, mit `--pool=forks
  --no-file-parallelism` reproduzierbar behoben — trat bei diesem Lauf nicht
  erneut auf).
- `npm run build` → `✓ built in 769ms`; nur die bekannte Warnung zu großen
  Chunks. Hauptchunk `index-*.js` **1 386,97 kB**.

### Testzahlen (Quelle: Ledger-Zeilen „Umsetzer/Nacharbeit DONE" je Task, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (master `df715ff`, nach 4d-5) | — | 4279 |
| 1 | Saturn | +22 | 4301 |
| 2 | Ringsysteme | +20 | 4321 |
| 3 | Titan | +22 | 4343 |
| 4 | Enceladus | +22 | 4365 |
| 5 | Szenen Saturn im Streiflicht / Saturns Ringe von der Kante | +44 | 4409 |
| 6 | Szene Durchflug durch Saturns Ringe | +22 | 4431 |
| 7 | Szenen Titan im Dunst / Enceladus im hellen Glanz | +44 | 4475 |

Summe 4279+22+20+22+22+44+22+44 = 4475, deckt sich mit dem tatsächlichen
`npm test`-Lauf. Alle sechs Nacharbeits-Commits (Task 1, 2, 3 als
Umsetzer-Nacharbeiten; Task 5, 6, 7 mit Nacharbeit) und die beiden
Prüfspalten-only-Commits (Task 4, Zwischenschritte) ändern nur bestehenden
Text beziehungsweise nur die Spalte „Prüfung"; keiner von ihnen fügt neue
Testfälle hinzu (an keiner Stelle im Ledger ist bei einer Nacharbeit ein
Testzuwachs vermerkt, durch den Vergleich der im Ledger genannten
Zwischenstände selbst nachvollzogen).

### Hauptchunk

Ausgangsstand nach Etappe 4d-5: **1 363,61 kB**. Endstand dieser Etappe:
**1 386,97 kB**. Zuwachs: **+23,36 kB** — deutlich unter der 50-kB-Schwelle
aus Plan-Ruling 13; keine Eskalation der Frage „fauler Import des Katalogs"
an Jens nötig.

Zwischenstände aus den Task-Berichten: Task 1 **1 366,75 kB** (Nacharbeit,
nach Task 2 bereits obenauf committet, **1 372,77 kB**) → Task 2 **1 372,21 kB**
(vor der Task-1-Nacharbeit gemessen) → Task 3 **1 377,53 kB** → Task 4
**1 383,43 kB** → Task 5 **1 384,60 kB** → Task 6 (kein Hauptchunk-Wert im
Bericht vermerkt, siehe §7) → Task 7 **1 386,97 kB** (diese Abnahme,
selbst nachgebaut, deckungsgleich mit dem Bericht).

### Katalogeinträge

Ausgangsstand **442** (Plan, entspricht dem Endstand aus Etappe 5). Endstand
**531** (`grep -c "id: '" src/data/literatur.ts`, selbst nachgezählt).
Zuwachs je Task, aus `git show <Commit> -- src/data/literatur.ts` selbst
nachgezählt (nicht aus den Berichten übernommen):

| Task | neue Einträge | Katalog danach |
|---|---|---|
| 1 (Saturn, inkl. Nacharbeit) | 12 + 2 = 14 | 456 |
| 2 (Ringsysteme) | 22 | 478 |
| 3 (Titan) | 20 | 498 |
| 4 (Enceladus) | 23 | 521 |
| 5 (Szenen Streiflicht/Ringkante) | 3 | 524 |
| 6 (Szene Ringdurchflug) | 4 | 528 |
| 7 (Szenen Titan-Dunst/Enceladus-Hell) | 3 | 531 |

442+14+22+20+23+3+4+3 = 531, deckt sich mit dem gezählten Katalogstand und
mit jeder Task-Bericht-Angabe (anders als in 4d-5 nannte hier kein Bericht
eine abweichende Zahl). Geprüft per `git show <Commit> --stat --
src/data/literatur.ts` für alle 16 Commits; die neun reinen Text- beziehungsweise
Prüfspalten-Commits (87e10ee zählt hier als Teil von Task 1, ebenso b7e8520/
04820ae/6474e75/a83cc85/63251d2/19e0464/03f9d34 für ihre Tasks) ändern die
Datei entweder gar nicht oder wie in der Tabelle ausgewiesen.

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog), Start-/Endzeitpunkt per
Unix-Zeitstempel vor und nach dem Kommando gemessen (1789996986 →
1789997538):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 531 von 531 Einträgen
[... 615 Zeilen, davon 611 „ok" ...]
cgpm-2022                     crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
greaves-2021                  crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
korablev-2019                 crossref  warnung  Crossref führt die Körperschaft „The ACS and
                                                  NOMAD Science Teams" zuerst, Erstautor
                                                  „Korablev, O." steht unter den weiteren Autoren
sanchez-lavega-2011           crossref  warnung  Crossref führt die Körperschaft „The
                                                  International Outer Planet Watch (IOPW) Team"
                                                  zuerst, Erstautor „Sánchez-Lavega, A." steht
                                                  unter den weiteren Autoren

611 ok, 4 Warnungen, 0 Fehler
```

**Laufzeit:** 552 Sekunden (9:12 min; Ausgangsstand 492 s bei 442 Einträgen
nach 4d-5 — der Katalog ist um 89 Einträge gewachsen, die Laufzeit liegt
plausibel etwas darüber). Keine Zeile mit `429` (`grep -c 429` auf der
vollständigen Ausgabe: 0 Treffer).

**Vier Warnungen, alle vier begründet:**

- `cgpm-2022` — Crossref führt die 28. Generalkonferenz für Maß und Gewicht
  als Körperschaft, nicht als Person (seit Etappe 2 akzeptiertes Verhalten).
- `greaves-2021` — Crossref führt das Online-Erstjahr (2020), der Katalog
  das Druckjahr der Ausgabe (2021); in Etappe 4 (Venus) so begründet.
- `korablev-2019` — genau der von der Prüfskript-Lockerung aus Etappe 4
  (Zwischen-Task 5a) beabsichtigte Effekt: Crossref führt die
  Kollektivbezeichnung zuerst, die tatsächliche Nature-Kopfzeile Korablev
  als Erstautor.
- `sanchez-lavega-2011` — **neu in dieser Etappe** (Task 1): dasselbe Muster
  wie bei `korablev-2019` — Crossref führt „The International Outer Planet
  Watch (IOPW) Team" zuerst, der Katalog behält Sánchez-Lavega als
  menschlichen Erstautor (Ruling 16 dieser Etappe / Katalogform seit 4d-4).

## 4. Fachprüfung

Zahlen aus den `task-N-report.md`/`task-N-befunde.md`/`task-N-nacharbeit-
report.md`-Dateien, gegengerechnet gegen die aktuellen Dateien im
Arbeitsbaum (`wc -w`, Zeilenzählung der Beleglisten-Tabellen über die
Gesamtzahl der mit `|` beginnenden Zeilen minus Kopf- und Trennzeile,
eindeutige `literatur:`-Verweise je Text per Browsermessung `§5.1`
gegengeprüft). Je Text genau eine Fachprüfung (Task 5 und 7 prüfen je zwei
Textpaare in einem Auftrag); fünf der neun Texte mit einer Nacharbeit, vier
ohne (Enceladus 0 Fehler nach Gegenprüfung; Streiflicht, Titan-Dunst je
0 Fehler mit nur einem sachlichen Hinweis, der zusammen mit dem
Schwestertext der Nacharbeit lief).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| `objekt-saturn` (Saturn) | 2867 / 3168 | 78 | 22 | 14 | 3 / 3 (F1, ein Befund über drei Belegzeilen: `quelle:nasa-cassini` trug drei Aussagen nicht) | keine offen (H1 GM-Diskrepanz als Rundungsartefakt aufgelöst, kein Textfehler; H2–H4 ergänzt/korrigiert) |
| `thema-ringe` (Ringsysteme) | 3051 / 3377 | 76 | 25 | 22 | 2 / 2 (F1 Huygens-/Laplace-Ringlet vertauscht, F2 g-Moden-Beleg unvollständig) | H3: mehrere Abstracts (Nicholson 1996, Zhang 2017a/b, Colwell 2007, Burns 1999, Canup 2010, Esposito/Cuzzi 2010) verlagsseitig gesperrt, nur Metadaten geprüft (siehe §7) |
| `objekt-titan` (Titan) | 3047 / 3354 | 67 | 34 | 20 | 2 / 2 (F1 $J_2/C_{22}$-Wert widersprach `thema-innerer-aufbau`, F2 falsche NSSDC-Fundstelle) | Zeilen 15/16 (Durante/Goossens 2026 ohne Volltext) und Zeile 20 (HASI-Werte) unverändert — Verifikationsgrad-Hinweise, kein Fehler |
| `objekt-enceladus` (Enceladus) | 2501 / 2833 | 77 | 27 | 23 | 0 / 0 (Gegenprüfung, keine Nacharbeit nötig) | Zeile 29: Howett-2011-Zahl „15,8 GW" nachträglich verifiziert, Text bleibt bewusst bei der Spanne 4–19 GW (kein Fehler); zwei der drei Hinweise (Zeile 3, Zeile 58) hat der Controller selbst mit Commit 6474e75 nachgetragen |
| `szene-saturn-streiflicht` | 756 / 858 | 21 | 1 | 1 | 0 / 0 | keine offen (der eine Hinweis — Kernschatten-Winkelradius arctan statt arcsin — in der Nacharbeit behoben) |
| `szene-saturn-ringkante` | 812 / 894 | 19 | 3 | 2 | 0 / 0 | 2 offen (Beleg 12 Aksnes/Franklin 1978 nur über Titel gestützt; Beleg 13 Monat „August 2009" als plausible Herleitung — beide vom Prüfer selbst als „kein Fehler" eingestuft) |
| `szene-ringdurchflug` | 871 / 983 | 29 | 5 | 4 | 0 / 0 | keine offen (beide Hinweise — Formulierung „mitten im B-Ring", Mitchell-/Hsu-Satzverknüpfung — in der Controller-Nacharbeit 19e0464 behoben) |
| `szene-titan-dunst` | 772 / 860 | 24 | 6 | 3 | 0 / 0 | keine offen (Venus-Vergleich ohne Belegzeile, in der Controller-Nacharbeit 03f9d34 durch Belegzeile 23a ergänzt) |
| `szene-enceladus-hell` | 913 / 1012 | 24 | 4 | 0 | 1 / 1 (Saturns Winkeldurchmesser von Enceladus aus: $28{,}1°$ statt richtig $28{,}3°$) | keine offen (Dione-Resonanz-Halbsatz ohne Belegzeile, in derselben Controller-Nacharbeit durch Belegzeile 23a ergänzt) |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und
Trennzeile) unter `docs/belege/hochschule/`, über die Gesamtzahl der mit `|`
beginnenden Zeilen gezählt (nicht über die in der ersten Zelle stehende
Nummer — siehe §7 zu zwei Zeilen in `szene-ringdurchflug.md`, denen diese
Nummer fehlt). Zitate sind die im Browser gemessenen, eindeutigen
Literaturkarten je Kombination (§5.1), deckungsgleich mit den
`literatur:`-Kennungen in beiden Sprachfassungen. Wortzahlen `wc -w` auf den
aktuellen Dateien in `src/data/texte/<sprache>/hochschule/` — abweichend von
den in den Task-Berichten vor der jeweiligen Nacharbeit genannten Zahlen, wo
eine Nacharbeit Text ergänzt hat (siehe §7 zur einen echten
Berichtsungenauigkeit bei `szene-saturn-ringkante`).

Modellzahlen aus den bereits fachgeprüften Texten (`thema-gezeiten`,
`thema-innerer-aufbau`, `thema-photometrie`, `thema-resonanzen`,
`thema-finsternis`, `thema-gebundene-rotation`, `thema-bahnelemente`,
`thema-entstehung`) wurden nach Ruling 8 gleichlautend übernommen; wo die
eigene Nachrechnung abwich (Saturn-GM +10 statt +5 ppm, als
Rundungsartefakt aufgelöst; Kernschatten-Winkelradius der Streiflicht-Szene,
in der Nacharbeit korrigiert), steht die Auflösung im Bericht beziehungsweise
in der Nacharbeit, nicht im übernommenen Wert des fachgeprüften Texts.

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}'
http://localhost:5173/Orrery/` → 200), kein zweiter gestartet.
`window.store.setState({ quality: { tier: 'high' } })` direkt nach
`browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung
(Niveau Hochschule, Panel eingehängt, `breiteRem: 40`).

### 5.1 Rundgang

Alle 18 Kombinationen (neun Kennungen × de/en) angefahren: Körper über
`setInfo({thema:null})` + `setCamera({targetId, mode:'free'})`, das Thema
`ringe` über `setInfo({thema:'ringe'})` (nach vorherigem `setInfo({thema:
null})`), Szenen über `setCinema({running:true, shuffle:false, nummer,
elapsedSec:0, pauseOnInput:false})` + `setCamera({mode:'cinema'})`, danach
`setCinema({running:false})`, `setTime({paused:true})` und
`setUi({hidden:false})`. Szenenindizes am Array in `src/data/scenes.ts`
selbst gegengeprüft (0-basierte Position): `saturn-streiflicht` **1**,
`saturn-ringkante` **10**, `ringdurchflug` **11**, `titan-dunst` **12**,
`enceladus-hell` **13** — exakt die im Brief genannten Indizes.

**Messfalle bestätigt (wie in Abnahme 4d-5 dokumentiert):** Beim Wechsel von
einer Szene oder einem Thema zurück zu einem Körper wurde `setInfo({thema:
null})` vor jedem Einzeltest gesetzt; ohne das blieb ein zuvor gewähltes
Fachthema aktiv und das Panel zeigte den Thementext statt der erwarteten
Kombination.

**Eigene Messfalle in dieser Etappe gefunden und behoben (Klicktests):**
`objekt:`- und `thema:`-Verweise sind im DOM `<button>`-Elemente, keine
`<a>`-Elemente (nur `quelle:`/`literatur:`-Verweise sind Anker mit externem
`href`); ein Selektor, der Klicktests auf `a[data-verweis^="…"]`
beschränkte, fand deshalb `objekt:`/`thema:`-Verweise nicht. Nach der
Korrektur auf `[data-verweis^="…"]` (ohne Tag-Einschränkung) liefen alle
Klicktests korrekt.

**Kernkriterien, alle 18 Kombinationen:** `formelfehler` **0**, keine
Hinweiszeile (insbesondere keine `info.hochschuleFolgt`/„Der Hochschultext
folgt …"), `zitateGleichKarten` **true**.

**18 von 18 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `objekt:saturn` | Saturn | Saturn | 76 | 1 | 22 |
| `objekt:titan` | Titan | Titan | 85 | 1 | 34 |
| `objekt:enceladus` | Enceladus | Enceladus | 49 | 1 | 27 |
| `thema:ringe` | Ringsysteme | Ring systems | 27 | 1 | 25 |
| `szene:saturn-streiflicht` (Nr. 1) | Szene: Saturn im Streiflicht | Scene: Saturn in grazing light | 6 | 0 | 1 |
| `szene:saturn-ringkante` (Nr. 10) | Szene: Saturns Ringe von der Kante | Scene: Saturn's rings edge-on | 5 | 0 | 3 |
| `szene:ringdurchflug` (Nr. 11) | Szene: Durchflug durch Saturns Ringe | Scene: Flying through Saturn's rings | 3 | 0 | 5 |
| `szene:titan-dunst` (Nr. 12) | Szene: Titan im Dunst vor Saturn | Scene: Hazy Titan in front of Saturn | 4 | 0 | 6 |
| `szene:enceladus-hell` (Nr. 13) | Szene: Enceladus im hellen Glanz | Scene: Enceladus in brilliant light | 10 | 0 | 4 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (gemessen in
beiden Läufen), bis auf eine kleine Ausnahme bei `objekt:enceladus`: die
Verweiszahl im Text unterscheidet sich (DE 67, EN 66) — ein einzelner
`[Saturns](objekt:saturn)`-Verweis in „Im Modell" (DE Zeile 202) hat in der
englischen Fassung keine Entsprechung (dort unverlinktes „Saturn's
equatorial plane"). Keine der Kernkriterien betroffen (Formelfehler,
Hinweiszeile, `zitateGleichKarten` sind in beiden Sprachen gleich, da es
sich um einen `objekt:`-, nicht um einen `literatur:`-Verweis handelt);
gemeldet in §7 als kleiner Befund dieser Abnahme.

**Klicktest je Verweisart:** Je Kombination wurde von jeder vorhandenen
Verweisart (`objekt`, `thema`, `szene`, `quelle`, `literatur`) ein Vorkommen
einzeln durch Auslesen des `data-verweis`-Attributs und `element.click()`
ausgelöst — die Kombination wurde vor jedem Einzeltest frisch aufgebaut,
damit ein navigierender Klick die Prüfung der nächsten Art nicht
verfälscht. Die Wirkung wurde gegen die Tabelle im Brief geprüft (`objekt`
→ `camera.targetId` nach 1,7 s Wartezeit; `thema` → `ui.info.thema`;
`szene` → `cinema.nummer` + `camera.mode==='cinema'`; `quelle`/`literatur`
→ Kartenklasse enthält `border-sky-300`, Klick und Prüfung in einem
`browser_evaluate`), danach der Ausgangszustand wiederhergestellt.
`objekt:saturn` hat keine eigene `szene:`-Verweisart (kein Abschnitt
„Oberfläche", kein direkter Szenenverweis im Text — vier statt fünf Arten
testbar, wie schon Jupiter in 4d-5); `szene:saturn-ringkante`,
`szene:titan-dunst` und `szene:enceladus-hell` haben keine `quelle:`-Verweise
im Fließtext (vier statt fünf Arten testbar).

**Ergebnis: 82 von 82 anwendbaren Klicktests trafen** (`saturn`,
`ringkante`, `titan-dunst`, `enceladus-hell` mit je vier Arten × 2 Sprachen
= 4·4·2 = 32; `titan`, `enceladus`, `ringe`, `streiflicht`, `ringdurchflug`
mit je fünf Arten × 2 Sprachen = 5·5·2 = 50; 32+50 = 82). Alle Treffer:
`objekt` → `camera.targetId` stimmt; `thema` → `ui.info.thema` stimmt;
`szene` → `cinema.nummer` traf den erwarteten Index samt
`camera.mode==='cinema'`; `quelle`/`literatur` → Karte trug
`border-sky-300`.

### 5.2 Ersatz entfällt

Vier Messungen, Wartezeit bis zum Kopfwechsel (`performance.now()`, Zeit von
Vorher-Kopf bis zum ersten abweichenden Kopf):

| Messung | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|
| `thema-gezeiten` → `objekt:titan` (de) | Titan | keine | 63,6 ms |
| `thema-innerer-aufbau` → `thema:ringe` (de) | Ringsysteme | keine | 66,7 ms |
| `thema-gezeiten` → `objekt:titan` (en) | Titan | keine | 38,8 ms |
| `thema-innerer-aufbau` → `thema:ringe` (en) | Ring systems | keine | 48,4 ms |

Alle vier Messungen ohne Hinweiszeile: Die vorher an `objekt:titan`
beziehungsweise `thema:ringe` gezeigte Ersatz-Hinweiszeile „Der
Hochschultext folgt …"/„The university-level text will follow …" ist
entfallen, weil diese Etappe die entsprechenden Hochschultexte liefert.

### 5.3 Konsole

`browser_console_messages` (seit dem Navigate, `all: true`, Ebene
`warning`): **0 Fehler, 2 Warnungen** über die gesamte Sitzung — beide
lauten „Failed to execute 'requestFullscreen' on 'Element': API can only be
initiated by a user gesture" und traten nach synthetischen `.click()`-Aufrufen
auf `szene:`-Verweise während des Rundgangs auf.

**Gegenprobe (Vorgabe des Briefs) durchgeführt:** Auf `objekt:titan`
angefahren, echter `browser_click` (Playwright-Rollen-Klick, kein
`element.click()` in `browser_evaluate`) auf den Verweis-Button „Titan im
Dunst vor Saturn" (`szene:titan-dunst`) im Text. Ergebnis: Das Kino startete
korrekt (`cinema.nummer=12`, `camera.mode='cinema'`,
`document.fullscreenElement===true`), **kein neuer Konsoleneintrag**
(weiterhin 0 Fehler/2 Warnungen, unverändert gegenüber vor der Gegenprobe).
Da die Gegenprobe die Warnung **nicht** reproduziert, zählen die zwei
Warnungen nach der Vorgabe des Briefs als Klick-Artefakt der synthetischen
Skript-Klicks, nicht als echter Befund — wie in Abnahme 4d-1 §5.5
dokumentiert. Fullscreen und Kino danach beendet, Ausgangszustand
wiederhergestellt.

Playwright-Aufnahmen (`console-*.log`, `page-*.yml` unter `.playwright-mcp/`)
wurden vor dem Commit gelöscht, keine Skripte im Projektstamm angelegt.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge.

**Planung (vor Ausführung, 21.09.2026):**

1. „Push und weiter" (Jens, 21.09.2026) gilt als Freigabe für Etappe 4d-6;
   die Fragen aus §8 der Abnahme 4d-5 werden nicht abgewartet.
2. Modelle wie in 4d-4 und 4d-5: mittleres Modell für Texte, Prüfer,
   Abnahme und Schlussprüfung, kleinstes für Mechanik; bei Kontingentlimit
   kleinstes mit Vermerk in §8 (in dieser Etappe nicht eingetreten, siehe
   §8 unten).
3. Höchstens eine Prüfrunde je Text; keine Nachprüfung; in der Nacharbeit
   wird nicht gekürzt.
4. Saturn ohne Abschnitt „Oberfläche" (Gasplaneten-Ausnahme).
5. Reihenfolge Saturn → Ringe → Titan → Enceladus → Szenen.
6. Fünf Szenen in drei Tasks (5: Streiflicht+Ringkante; 6: Ringdurchflug
   allein; 7: Titan-Dunst+Enceladus-Hell) nach Entwurf §7.
7. Befunde am Simulationscode werden in 4d-6 nicht behoben, nur beschrieben.
8. Modellzahlen aus fachgeprüften Texten gleichlautend übernehmen;
   Abweichungen der eigenen Nachrechnung gehen an Jens.
9. Kein eigener Verweis-Task, da alle neun Kennungen Gymnasialtexte haben.
10. Tausendertrennung ab fünf Stellen; Zahlenspannen nennen, wofür sie
    gelten.
11. Fachprüfung behält die sieben Prüfpunkte und den Hinweis auf die eine
    Runde; schreibt die Prüfspalte ausdrücklich in die Datei.
12. Sichtprüfung des Formelsatzes entfällt ohne neuen TeX-Befehl.
13. Literaturkatalog bleibt im Hauptbundle; 50-kB-Schwelle gegenüber dem
    Ausgangsstand (siehe §2 — eingehalten, kein Anlass für eine Frage).
14. Fast-Forward nach Abnahme und Schlussprüfung, Push erst nach Jens' Ja.
15. Wortzahl-Obergrenze ein Drittel über dem Richtwert.
16. Katalogform wie nach der Schlussprüfung 4d-4.
17. Quellenkarten aus dem Brief sind Angebot, keine Pflicht.
18. Thema `ringe` frei gegliedert, endet mit „Offene Fragen"/„Im Modell";
    behandelt alle vier Ringsysteme plus Ringe kleiner Körper, Schwerpunkt
    Saturn.
19. Enceladus bekommt den Richtwert großer Körper (1500–3500 Wörter) statt
    kleiner Monde.
20. Sonnenrichtung `enceladus-hell` und Ringknoten `saturn-ringkante`/
    `ringdurchflug` sind Szenendaten, keine Belege; Texte rechnen sie nach,
    `scenes.ts` bleibt unverändert.
21. Der Task-Prüfung der Abnahme (Task 8) dient die Schlussprüfung.
22. Der zurückgestellte Minor aus 4d-4 (`literaturVergleich.ts`) bleibt
    zurückgestellt.

**Vorprüfung (Controller, 21.09.2026):**

- Vorprüfung ohne Konflikt; Ausführung beginnt mit Task 1 (Saturn) auf
  sonnet — Kosten bei Fehlurteil: eine Fixrunde.

**Nach Task 1 (Fachprüfung, F1–F3):**

- Für F1–F3 gilt Vorrang der Literatur — die drei Aussagen mit
  `literatur:`-Einträgen belegen (Gurnett 2005 wiederverwenden, für
  Enceladus-Plasma und Polarlichter passende, selbst geöffnete Arbeiten neu
  anlegen); reicht das nicht, darf die Nacharbeit eine neue Quellenkarte
  anlegen. Kosten bei Fehlurteil: ein Karteneintrag, den Jens anders will.
  (Umgesetzt ohne neue Quellenkarte, siehe Task-1-Nacharbeit.)

**Nach Task 4 (Fachprüfung, Hinweise):**

- Die zwei mechanischen Hinweise (Belegzeile 3 um Postberg 2009 ergänzen,
  `nimmo-2018`-Seiten) erledigt der Controller selbst mit dem Commit
  „Belegliste objekt-enceladus: Fachprüfung abgeschlossen", sobald die
  Nacharbeit Titan (`literatur.ts`) committet hat. Kosten bei Fehlurteil:
  zwei Zeilen. (Umgesetzt als Commit `6474e75`.)

**Nach Task 5 (Fachprüfung, Kernschatten-Winkelradius):**

- Die Zahlenabweichung beim Kernschatten-Winkelradius ist sachlich → eine
  kleine Nacharbeit (Streiflicht de/en und Beleg 9 neu rechnen,
  Ringkante-Prüfspalte nur committen) nach dem Ende von Task 6. Kosten bei
  Fehlurteil: ein Commit. (Umgesetzt als Commit `63251d2`.)

**Zu Task 6 (Nacharbeit, Prozesssprache):**

- Lehre aus dem Ledger: Prüfaufträge sollten um „keine Prozesssprache
  (Task, Ruling, Brief) im veröffentlichten Text" ergänzt werden — ein
  eigener Befund des Controllers fand die Formulierung „aus Task 5
  übernommen" im Text von `szene-ringdurchflug`, behoben in derselben
  Nacharbeit (Commit `19e0464`).

**Nebenbefund Venus (nach Task 6):**

- `objekt-venus.md` (aus Etappe 4d-4, bereits auf `master`) enthielt
  „(Ruling: gleichlautend übernommen)"/„(ruling: reused verbatim)" im
  veröffentlichten Text; auf diesem Branch entfernt (Commit `3e35584`).
  Für §7 dieser Abnahme vermerkt; die Abnahme wiederholt die Suche nach
  Prozesssprache über alle Texte (siehe §5, Ergebnis leer).

**Vor Task 8 (Abschluss):**

- Die Abnahme wiederholt die Suche nach Prozesssprache über alle Texte und
  nimmt den Nebenbefund Venus (`3e35584`) in §7 auf. (Umgesetzt: `grep -rn
  "\bTask\b\|Ruling\|ruling" src/data/texte/ --include=*.md` liefert keinen
  Treffer über den gesamten Textbaum, siehe §5.)

## 7. Bekannte Unschärfen

**Zur Umsetzung dieser Etappe:**

- **`szene-ringdurchflug.md`, Belegliste — ein Darstellungsfehler in
  Belegzeile 3 (Formel mit unmaskierten senkrechten Strichen).** Die Zelle
  „Beleg" der Zeile 3 enthält den Ausdruck `` `|nah−standort|=radius` ``
  (Betragsstriche) mit zwei nicht als `\|` maskierten Strichen — entgegen
  der ausdrücklichen Vorgabe „Senkrechte Striche in Zellen als `\|`
  maskieren (jede Zeile hat genau sechs Zellen)". Beim Rendern als
  Markdown-Tabelle zerfällt diese eine Zeile dadurch in acht statt sechs
  Zellen. Kein automatischer Test prüft die Zellenstruktur von
  `docs/belege/`, kein Einfluss auf `npm test`; ein reiner
  Beleglisten-Formatierungsfehler, seit dem Ursprungscommit `c1fe343`
  unverändert. Selbst nachgezählt (Node-Skript, das maskierte `\|` vor der
  Zählung entfernt): alle übrigen 28 Zeilen dieser Belegliste sowie alle
  Zeilen der acht übrigen Beleglisten dieser Etappe sind sauber (genau
  sechs Zellen je Zeile).
- **`szene-ringdurchflug.md`, Belegliste — zwei Zeilen ohne Zeilennummer.**
  Die beiden von der Controller-Nacharbeit (`19e0464`) geänderten Zeilen
  (inhaltlich Nr. 6 „im äußeren Teil des B-Rings …" und Nr. 21 „Cassini
  fing im Großen Finale größere Staubkörner …") beginnen jetzt direkt mit
  dem Aussage-Text statt mit „| 6 |" beziehungsweise „| 21 |" — die
  Zeilennummer fehlt in der ersten Zelle. Die Zellenzahl bleibt bei sechs
  (kein Strukturfehler wie bei Zeile 3), nur die Nummerierung ist an diesen
  beiden Stellen lückenhaft. §4 dieses Protokolls zählt die Belegzeilen
  deshalb über die Gesamtzahl der Tabellenzeilen (29), nicht über die in
  der ersten Zelle stehende höchste Nummer.
- **`thema-ringe.md`, Zeile 36 — Querverweis auf die falsche Zeile.** Die
  Zelle zu A-Ring-Außenkante verweist mit „siehe Zeile 60 unten" auf die
  Ringseismologie-Aussage (f-/g-Moden, Hedman und Nicholson 2013 /
  Mankovich und Fuller 2021); die gemeinte Aussage steht tatsächlich in
  Zeile 61 (selbst nachgezählt), seit dem Ursprungscommit `470bb1a`
  unverändert. Reiner Beleglisten-Verweisfehler ohne Testabdeckung; die
  Belegliste bleibt fachgeprüfter Text (eine Prüfrunde je Text) und wird
  hier nicht angefasst, sondern bei der nächsten inhaltlichen Berührung der
  Datei mitkorrigiert.
- **`szene-saturn-ringkante`, Wortzahl im Bericht ungenau.** `task-5-
  report.md` nennt „DE 781, EN 861"; die aktuellen, seit dem
  Ursprungscommit `3ac8ed8` unveränderten Dateien (kein weiterer Commit
  berührt diesen Text, siehe `git log` auf die Datei) zählen tatsächlich
  DE 812, EN 894 — eine Differenz von 31 beziehungsweise 33 Wörtern, ohne
  erkennbaren Grund in der Versionsgeschichte (keine nachträgliche
  Textänderung). Reine Berichtsangabe, kein Sachfehler (Text, Tests und
  Katalog sind korrekt; §4 dieses Protokolls nennt die nachgerechnete
  Zahl).
- **`objekt-enceladus`, ein DE/EN-Verweis asymmetrisch.** Siehe §5.1: Ein
  `[Saturns](objekt:saturn)`-Verweis in „Im Modell" (DE) hat keine
  Entsprechung in der englischen Fassung. Sachlich unerheblich (derselbe
  Inhalt, nur ohne Verlinkung), aber im Rundgang aufgefallen und hier
  vermerkt.
- **Task 6, kein Hauptchunk-Wert im Bericht.** `task-6-report.md` führt
  unter „Tests, Lint" keinen `npm run build`/Hauptchunk-Wert (anders als
  alle anderen sechs Tasks); `task-7-report.md` bezieht sich mit „vorher
  1 384,60 kB laut Task-6-Bericht" tatsächlich auf die in `task-5-
  report.md` genannte Zahl. Kein Sachfehler (der in dieser Abnahme selbst
  nachgebaute Endstand 1 386,97 kB stimmt exakt mit Task 7), nur eine Lücke
  in der Berichtskette.
- **Mehrere Texte zitieren Arbeiten ohne bei Crossref/Semantic Scholar
  registrierte Zusammenfassung** über Titel, Metadaten oder eine bereits
  fachgeprüfte Nachbarquelle statt über eine direkt geöffnete
  Zusammenfassung: Task 1 (Dougherty 2018, Fletcher 2018, Hsu 2018,
  Sánchez-Lavega 2011); Task 2 (Nicholson 1996, Zhang 2017a/b, Colwell
  2007, Burns 1999, Canup 2010, Esposito 2010, Cuzzi 2010); Task 3 (Durante
  2026, Goossens 2026); Task 4 (Iess 2014, Waite 2006/2017, Hurford 2007,
  Postberg 2009/2018, Hsu 2015, Choblet 2017, Howett 2011, Kirchoff und
  Schenk 2009, Hemingway und Mittal 2019); Task 5 (Aksnes und Franklin
  1978, Mitchell et al. 2006). In allen Fällen wurde jede Angabe selbst
  geöffnet (mindestens Titel/Metadaten über Crossref), nicht aus dem
  Gedächtnis zitiert.
- **Task 1, GM-ppm-Diskrepanz als Rundungsartefakt aufgelöst.** Eigene
  Nachrechnung ergab +10 ppm gegen den gedruckten NSSDC-Faktenblattwert,
  der bereits fachgeprüfte `thema-innerer-aufbau.md` nennt „+5 ppm" gegen
  Jacobson 2022; die Fachprüfung hat die Diskrepanz als Rundungsfolge der
  nur fünfstellig gedruckten NSSDC-Zahl erklärt (H1), keine der beiden
  Zahlen wurde geändert.
- **Task 3, Wert $3{,}2\pm0{,}6$ ersatzlos gestrichen statt umgesetzt.** Die
  Nacharbeit konnte den zuvor fälschlich genannten Wert keiner
  eigenständigen, älteren Veröffentlichung zuordnen (Iess 2010/2012 ohne
  Volltextzugriff nicht mit eigenem $J_2/C_{22}$-Wert auffindbar) und hat
  ihn deshalb gestrichen statt als „ältere Messung" stehen zu lassen.
- **Task 3, Zeilen 15/16 (Durante/Goossens 2026) und Zeile 20 (HASI-Werte)
  unverändert** — Verifikationsgrad-Hinweise ohne Sachfehler, nach der
  Regel „höchstens eine Prüfrunde" nicht weiter nachrecherchiert.
- **Task 4, Howett-2011-Zahl „15,8 GW" ist real, wird aber bewusst nicht
  verwendet.** Die Gegenprüfung verifizierte die vom Umsetzer nicht
  auffindbare Zahl per WebSearch; der Text bleibt bei der bereits
  fachgeprüften Gesamtspanne 4–19 GW (`thema-gezeiten.md`) statt der
  einzelnen, präziseren Zahl — bewusst vorsichtiger als nötig, kein Fehler.
- **Task 5, `render/rings.ts` kennt für die Ringscheibe nur den Planeten
  als Schattenwerfer, nie einen Mond** (`waehleOkkluder` wird für die
  Ringscheibe nicht aufgerufen) — eigener Befund des Umsetzers, für
  spätere Ringtexte vorgemerkt.
- **`src/data/texte/dateien.test.ts:116,261`, Wort „Plan-Ruling" in
  Codekommentaren.** Seit Etappe 4d-1 (`23d55d5c`), unverändert in dieser
  Etappe (nicht im Diff `c74c4b4..449cada`) — kein veröffentlichter Text,
  nennt nur eine reale Plandatei im Kommentar einer TS-Testdatei. Kandidat
  für eine spätere Umformulierung, keine Aktion in dieser Etappe nötig.

**Befunde am Simulationscode** (die Texte beschreiben sie, wie Plan-Ruling 7
verlangt; nicht behoben, Kandidaten für eigene Tasks):

- **Ruling 7 selbst (übergreifend):** keine Abplattung Saturns, Rotation
  10,656 h gegen die Ringseismologie (rund 157°/Jahr Drift eines
  Wolkenmerkmals), Ringe ohne Dicke/Teilchen/D-/F-/G-/E-Ring und ohne
  Oppositionseffekt, Vorwärtsstreuung als Gestaltungswert,
  `rotationAtEpochDeg` 0 gegen $W_0$, Titan ohne Atmosphäre/Dunstmodul,
  Enceladus ohne Fontänen und nie Okkluder (`MAX_OKKLUDER`-Rang), Sonnen-
  richtung der Szene `enceladus-hell` fest aus J2000.
- **Task 1 (Saturn), A-Ring-Außenkante uneins zwischen zwei Tabellenwerken:**
  PDS-Ring-Moon-Systems-Node nennt 136 770 km, `saturn.ts`/NSSDC-
  Saturnian-Rings-Fact-Sheet 136 780 km — 10 km Differenz zwischen zwei
  gängigen Referenzen derselben Kante, im Text vermerkt, nicht aufgelöst.
- **Task 4 (Enceladus), `lpDot: 12345.6790` ist kein Bug:** die auffällig
  wirkende Zifferncode-Ziffernfolge erwies sich bei Gegenprüfung als
  korrekte Rückrechnung aus JPLs runder Tafelperiode 2,916 Jahre.
- **Task 4 (Enceladus), „gedämpfte Helligkeit" (`scenes.ts`) betrifft jeden
  Körper gleich, nicht Enceladus speziell:** Das Materialmodell erreicht
  wegen der Streuformel nur $0{,}640\,p$ statt der vollen Katalogalbedo
  $p$ — bei Enceladus ($p=1{,}0$) am auffälligsten, aber keine
  körperspezifische Ursache.
- **Task 5/6 (Ringszenen), Achsneigung 26,73° gegen 28,05° sind
  verschiedene Bezugssysteme, kein Widerspruch:** 26,73° misst gegen
  Saturns eigene Bahn (aus `objekt-saturn`), 28,05° gegen die
  Ekliptiknormale (für die Kamerageometrie maßgeblich, da Saturns Bahn
  selbst 2,49° gegen die Ekliptik geneigt ist).
- **Task 6 (Ringdurchflug), Code-Kommentar zur Ringebenen-Kreuzung
  ungenau, nicht falsch:** `scenes.ts` behauptet eine „zunehmende" Drift
  aus der Ringebene; die Rate ist über die gesamte Fahrt tatsächlich
  konstant (linear in $t$, algebraisch bestätigt), nur die absolute Höhe
  wächst mit der Zeit seit der Kreuzung — die praktische Aussage des
  Kommentars (Kamera ist nur zur Bahnmitte nah an den Ringen) bleibt
  richtig, die Begründung nicht.
- **Task 7 (Enceladus-Hell), neuer Befund: Enceladus quert in jeder
  Ziehung Saturns vollen Kernschatten** (rund 1,8 s Echtzeit,
  `waehleOkkluder` setzt Saturn für seine Monde immer als Okkluder) — vom
  Renderer korrekt simuliert, aber weder im Code-Kommentar noch in einer
  früheren Etappe erwähnt; jetzt im Text aufgenommen.
- **Task 7 (Titan-Dunst), „Saturn im Bild" quantitativ ernüchternder als
  der Szenenkommentar suggeriert:** 9,1 % der Szenenzeit im Mittel, nur
  41,3 % der Ziehungen überhaupt einmal — die im Code-Kommentar
  suggerierte „gute Chance" trifft es nicht ganz (Kreis-Näherung ans
  50°-Sichtfeld als zusätzliche Unschärfe der eigenen Rechnung).

**Gemeldeter Fehler in Gymnasialtexten** (nicht geändert, Auftrag: melden,
nicht ändern): Task 3 (Titan) meldete zum Gymnasialtext
`objekt-titan.md` (de/en) einen Befund zur Aktualität, von der Fachprüfung
unabhängig bestätigt (H5) — der Satz „Messungen von Cassini zeigen, wie
stark sich Titan unter Saturns Gezeiten verformt; das spricht für einen
Ozean aus Wasser tief unter der Eiskruste" stellt die Ozeanfrage als
entschieden dar, obwohl sie seit Petricca et al. 2025 („these new
measurements preclude the existence of a subsurface ocean on Titan",
Original abgerufen) eine offene Streitfrage ist (`task-3-report.md:17–22`,
`task-3-befunde.md:119–127`). Die übrigen acht Gymnasialtexte dieser Etappe
ohne gemeldeten Fehler.

## 8. Halt: Fragen an Jens

**Modelle (Plan-Ruling 2 / Ledger):** Anders als in 4d-4 und 4d-5 griff in
dieser Etappe **kein** Kontingentlimit — alle Umsetzer, Fachprüfer, die
Nacharbeiten sowie diese Abnahme liefen durchgehend auf dem mittleren
Modell (sonnet), ohne Ausweichen auf das kleinste. WebSearch war für die
meisten Agenten verfügbar (nach ToolSearch), mit den im Ledger vermerkten
Einzelausfällen bei einzelnen Zeitschriftenseiten (Verlagssperren), nicht
beim Werkzeug selbst. Keine offene Frage, nur zur Kenntnis (§8-Format der
Vorgängerprotokolle folgend).

**Nebenbefund Venus (aus 4d-4, in dieser Etappe behoben):** `objekt-
venus.md` enthielt Prozesssprache „(Ruling: …)"/„(ruling: …)" im
veröffentlichten Text, entfernt in `3e35584`. Vorschlag: als erledigt
betrachten, keine weitere Prüfung nötig (die Suche nach Prozesssprache über
den gesamten Textbaum ist jetzt leer, siehe §5).

**Voyager-2-Ringebenenabstand (Ledger Task 6, erledigt):** Der im Web
widersprüchlich angegebene Abstand bei der größten Annäherung 1981 ist
gelöst — `szene-ringdurchflug.md`, Belegzeile 16 nennt 161 000 km mit
vorsichtiger Formulierung „nahe" der G-Ringebene, per eigenem WebFetch-Abruf
geprüft „ok"; keine weitere Aktion nötig.

**Zwei Beleglisten-Formatierungsfehler in `szene-ringdurchflug.md` (§7):**
eine Zeile mit unmaskierten `|`-Zeichen (Zeile 3, seit dem
Ursprungscommit), zwei Zeilen ohne Zeilennummer (Zeilen inhaltlich 6 und
21, seit der Controller-Nacharbeit `19e0464`). Vorschlag: kein eigener
Task nötig — bei der nächsten inhaltlichen Berührung dieser Belegliste
(zum Beispiel einer späteren Etappe mit Verweis auf diese Szene) mit
beheben, da es sich um reine Markdown-Formatierung ohne Testabdeckung
handelt und keine der bisherigen Prüfregeln (Dateitest, Prüfskript) sie
erfasst.

**Berichtsungenauigkeit `szene-saturn-ringkante` (§7):** Wortzahl im
Task-5-Bericht (781/861) weicht von der tatsächlichen, seit dem
Ursprungscommit unveränderten Datei (812/894) ab, ohne erkennbaren Anlass
in der Versionsgeschichte — vermutlich ein Zähl- oder Kopierfehler beim
Verfassen des Berichts selbst (ähnlich der in 4d-5 §7 dokumentierten
Katalogzahl-Ungenauigkeit). Kein Sachfehler; als weiterer Beleg dafür
vermerkt, dass Berichtszahlen nachzurechnen sind.

**Wortzahlen über dem Richtwert 900 (Szenen, Plan-Ruling 15):**
`szene-ringdurchflug` EN 983 Wörter (DE 871 innerhalb des Richtwerts),
`szene-enceladus-hell` DE 913 / EN 1012 Wörter (`wc -w` auf den aktuellen
Dateien nachgezählt, deckungsgleich mit der Tabelle in §4) — alle drei
Zahlen liegen unter der Obergrenze 1200 (ein Drittel über dem Richtwert,
Plan-Ruling 15), keine Regelverletzung. Vorschlag wie in 4d-4 entschieden:
annehmen (Richtigkeit vor Wortzahl), nicht kürzen.

**Code-Befunde, als Kandidaten für eigene Tasks (siehe §7 für Details):**

- Saturn ohne Abplattung; Rotation 10,656 h (Voyager-Ära) statt einer
  neueren, schnelleren Bestimmung (Ringseismologie/Schwerefeld).
- A-Ring-Außenkante 136 770 km (PDS) gegen 136 780 km (NSSDC/Code) —
  10 km Differenz zwischen zwei Referenzen.
- Ringscheibe (`render/rings.ts`) kennt nie einen Mond als Schattenwerfer,
  nur den Planeten selbst.
- Enceladus quert in der Szene `enceladus-hell` in jeder Ziehung Saturns
  vollen Kernschatten (rund 1,8 s) — bisher nicht dokumentiert, jetzt im
  Text beschrieben.
- „Gedämpfte Helligkeit" (`scenes.ts`) ist eine allgemeine Modellgrenze
  des Streuungsterms ($0{,}640\,p$ statt $p$), keine Enceladus-spezifische
  Ursache.

**Gemeldeter Fehler in Gymnasialtexten** (siehe §7) — Frage: Soll der
Gymnasialtext `objekt-titan.md` (de/en) in einem eigenen kleinen Task
nachgeführt werden (Ozean-Satz an den seit Petricca et al. 2025 offenen
Streitstand anpassen), oder vorerst wie in Etappe 4d-4 unverändert bleiben?

**22 Plan-Rulings** und die in §6 aufgeführten Umsetzungs-Rulings (von Jens
noch nicht bestätigt, vollständiger Wortlaut in `docs/superpowers/plans/
2026-09-21-phase4d-hochschule-etappe6.md` Abschnitt „Rulings" und in diesem
Protokoll §6).

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen
Projektanleitung beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.

## Nacharbeit nach der Abnahme (21.09.2026)

Drei Befunde aus §7 wurden direkt nach dem Abnahme-Commit behoben (Commit
„Beleglisten Ringdurchflug und Enceladus-Hell: Zellen berichtigt; Verweis im
englischen Enceladus-Text"): die unmaskierten senkrechten Striche in Belegzeile 3
von `szene-ringdurchflug.md`, die zwei Zeilen ohne Zeilennummer (Nr. 6 und 21,
dort waren bei der Nacharbeit die Zellen verrutscht; dieselbe Verschiebung betraf
Zeile 7 von `szene-enceladus-hell.md`, jetzt ebenfalls berichtigt), und der
fehlende Verweis `objekt:saturn` im Abschnitt „In the model" der englischen
Fassung von `objekt-enceladus.md`. Alle neun Beleglisten der Etappe haben danach
sechs Zellen je Zeile und eine Nummer in der ersten Zelle (Skript im
Scratchpad). Die Berichtsungenauigkeiten (Wortzahl Ringkante, fehlender
Hauptchunk-Wert Task 6) bleiben als Vermerk in §7. Schlussprüfung und
Fast-Forward stehen noch aus.

## Nacharbeit nach der Schlussprüfung (21.09.2026)

Fünf Befunde der Schlussprüfung (`schlusspruefung-bericht.md`, drei
„Wichtig", zwei „Klein") wurden am Protokoll selbst nachgearbeitet, ohne
Code- oder Textänderung. §7 und §8 nennen jetzt den von Task 3 gemeldeten
und von der Fachprüfung bestätigten Gymnasialtext-Befund Titan (Ozean-Satz
seit Petricca et al. 2025 überholt) samt Frage an Jens. §8 nennt die beiden
bisher fehlenden Wortzahl-Bedenken über dem Richtwert 900
(`szene-ringdurchflug` EN 983, `szene-enceladus-hell` DE 913/EN 1012) samt
Frage an Jens. §7 nennt den Querverweisfehler in `thema-ringe.md` Zeile 36
(„Zeile 60" statt richtig Zeile 61); die Belegliste selbst bleibt
unverändert (fachgeprüfter Text, eine Prüfrunde je Text). §7 vermerkt das
Wort „Plan-Ruling" in Codekommentaren von `dateien.test.ts` als
unkritischen, unveränderten Altbefund aus 4d-1. §8 vermerkt den
Voyager-2-Ringebenenabstand aus dem Ledger als bereits in der Belegliste
gelöst.
