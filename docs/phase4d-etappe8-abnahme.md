# Abnahme Phase 4d Etappe 8 „Uranussystem"

## 1. Umfang

Branch `hochschule-8` (von `master` `7dacecb`, Plan-Commit, 22.09.2026 — der
Ausgangsstand vor dem Plan-Commit führte 559 Katalogeinträge und 4607 Tests,
unverändert durch den Plan-Commit selbst). Entwurf
`docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`. Plan
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe8.md` (8 Tasks,
23 Plan-Rulings). Ledger
`.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe8/progress.md`
(git-ignoriert).

18 Commits über `7dacecb` bis `edc0862`
(`git rev-list --count master..HEAD` auf dem Branch vor dem Fast-Forward).
In Reihenfolge:

| Kurzhash | Titel |
|---|---|
| 039f5b8 | Hochschultext Uranus mit Belegliste |
| 38b265f | Hochschultext Achsneigung mit Belegliste |
| e2e0c67 | Hochschultext Uranus: Nacharbeit nach der Fachprüfung |
| a4a3477 | Hochschultext Miranda mit Belegliste |
| 6a51687 | Hochschultext Achsneigung: Nacharbeit nach der Fachprüfung |
| 4dafa38 | Hochschultext Ariel mit Belegliste |
| 9591ac8 | Hochschultext Miranda: Nacharbeit nach der Fachprüfung |
| 1f3d107 | Hochschultext Umbriel mit Belegliste |
| 2f5d71b | Belegliste Umbriel: interne Kurzverweise entfernt |
| fa9efa4 | Hochschultext Ariel: Nacharbeit nach der Fachprüfung |
| 3b187c2 | Hochschultext Titania mit Belegliste |
| 09ff30b | Hochschultext Titania: Radiuserklärung in Im Modell ergänzt, Fassungen gekürzt |
| e7cc39f | Hochschultext Umbriel: Nacharbeit nach der Fachprüfung |
| 45abb73 | Hochschultext Oberon mit Belegliste |
| 9d05b4e | Hochschultext Titania: Nacharbeit nach der Fachprüfung |
| d972605 | Hochschultext Szene Der liegende Uranus mit Belegliste |
| 67b7a9d | Hochschultext Oberon: Nacharbeit nach der Fachprüfung |
| edc0862 | Hochschultext Szene Der liegende Uranus: Nacharbeit nach der Fachprüfung |

Acht neue Hochschultext-Einheiten (de/en): `objekt-uranus`, `thema-achsneigung`,
`objekt-miranda`, `objekt-ariel`, `objekt-umbriel`, `objekt-titania`,
`objekt-oberon`, `szene-uranus-gekippt` — je genau eine Fachprüfung und
höchstens eine Nacharbeit (Ruling 3, „höchstens eine Prüfrunde je Text").
Task 9 (dieses Protokoll, README) ist ein reiner Dokumentationstask.

Reihenfolge Uranus → Thema `achsneigung` → Miranda → Ariel → Umbriel →
Titania → Oberon → Szene (Ruling 5/6): Uranus lieferte Polkonvention,
Modellwinkel (97,77°/82,23°) und Systemzahlen an alle Folgetexte; das Thema
übernahm diese Zahlen und lieferte die Kippmechanismen (Riesenkollision
gegen Spin-Bahn-Resonanz) an die Monde und die Szene; Miranda lieferte die
Resonanzgeschichte (klassisch: Tittemore und Wisdom 1989/1990; revidiert:
Ćuk et al. 2020) an die vier äußeren Monde; die Szene übernahm Ring-, Termin-
und Bahnzahlen aus allen sieben Vorgängertexten. Fachprüfungen liefen
jeweils parallel zum nächsten Umsetzer (Ledger-Zeilen „Fachprüfung … Prüfer
… läuft parallel"); Nacharbeiten warteten, bis kein anderer Umsetzer lief.
Zwei zusätzliche Selbstkorrektur-Commits innerhalb der eigentlichen
Text-Tasks, beide noch vor dem Dispatch der jeweiligen Fachprüfung: `09ff30b`
(Titania, Radiuserklärung in „Im Modell" nachgetragen, Fassungen gekürzt)
und `2f5d71b` (Umbriel, interne Kurzverweise selbst gefunden und entfernt)
— beide vom jeweiligen Umsetzer selbst gefunden und behoben, kein
Nacharbeits-Commit im Sinne von Schritt 12 der Gemeinsamen Vorgaben.

## 2. Lint, Tests, Build

Lauf auf `edc0862` (Arbeitsbaum sauber, `git status --short` zeigte vor
diesem Protokoll nur die spätere README-Änderung):

- `npm run lint` → kein Befund.
- `npm test` → **4781 Tests, 101 Testdateien, alle grün** (Soll laut Plan
  4781 erreicht).
- `npm run build` → `✓ built in 882ms`; nur die bekannte Warnung zu großen
  Chunks. Hauptchunk `index-*.js` **1 415,10 kB**.

### Testzahlen (aus den Task-Berichten, gegengerechnet mit `npm test`)

| Task | Inhalt | Zuwachs | Summe |
|---|---|---|---|
| — | Ausgangsstand (master `7dacecb`, Plan-Commit, nach 4d-7) | — | 4607 |
| 1 | Uranus | +22 | 4629 |
| 2 | Achsneigung (Thema) | +20 | 4649 |
| 3 | Miranda | +22 | 4671 |
| 4 | Ariel | +22 | 4693 |
| 5 | Umbriel | +22 | 4715 |
| 6 | Titania | +22 | 4737 |
| 7 | Oberon | +22 | 4759 |
| 8 | Szene Der liegende Uranus | +22 | 4781 |

Summe 4607+22+20+22·5+22 = 4607+174 = 4781, deckt sich mit dem tatsächlichen
`npm test`-Lauf. Task 2 (Thema statt Körper) bringt zwei Testfälle weniger
als die übrigen sieben Einheiten (+20 statt +22) — plausibel, da die
Kenngrößen-Tabellen-Prüfung der Körpertexte für ein frei gegliedertes Thema
entfällt; keiner der acht Nacharbeits-Commits fügt neue Testfälle hinzu.

### Hauptchunk

Ausgangsstand nach Etappe 4d-7: **1 395,66 kB**. Endstand dieser Etappe
(selbst nachgebaut auf `edc0862`): **1 415,10 kB**. Zuwachs: **+19,44 kB** —
weit unter der 50-kB-Schwelle aus Plan-Ruling 13; keine Eskalation der Frage
„fauler Import des Katalogs" an Jens nötig.

Zwischenstände aus den Task-Berichten (chronologisch nach Commit): Achsneigung
initial **1 404,43 kB** → Titania initial **1 413,83 kB** → Oberon initial
**1 414,05 kB** → Szene initial **1 415,10 kB** (nach der Nacharbeit
unverändert, da nur Text- und Beleglisten-Inhalt geändert wurde, keine neue
Formel/kein neuer Import). Kein Hauptchunk-Wert im Bericht für Task 1 initial,
Task 3, Task 4, Task 5 initial und für sechs der acht Nacharbeits-Commits
(nur Tests erneut gelaufen, kein `npm run build`) — dieselbe Berichtslücke wie
in den Abnahmen 4d-6 §7 und 4d-7 §2 bereits dokumentiert. Kein Sachfehler: Der
selbst gemessene Endstand deckt sich mit den vorhandenen Zwischenwerten und
einer plausiblen, kleinen Restzunahme durch die ungemessenen Zwischenschritte.

### Katalogeinträge

Ausgangsstand **559** (`git show 7dacecb:src/data/literatur.ts | grep -cE
"^\s+id: '"`, entspricht dem Endstand aus Etappe 4d-7). Endstand **628**
(`grep -cE "^\s+id: '" src/data/literatur.ts`, selbst nachgezählt). Zuwachs
je Task, aus `git show <Commit>:src/data/literatur.ts | grep -c` für **jeden**
der 18 Commits selbst nachgezählt (nicht aus den Berichten übernommen):

| Task | neue Einträge | Katalog danach |
|---|---|---|
| 1 (Uranus, inkl. Nacharbeit) | 22 + 1 = 23 | 582 |
| 2 (Achsneigung, inkl. Nacharbeit) | 12 + 0 = 12 | 594 |
| 3 (Miranda, inkl. Nacharbeit) | 15 + 0 = 15 | 609 |
| 4 (Ariel, inkl. Nacharbeit) | 8 + 0 = 8 | 617 |
| 5 (Umbriel, inkl. Nacharbeit) | 5 + 0 = 5 | 622 |
| 6 (Titania, inkl. Nacharbeit) | 4 + 0 = 4 | 626 |
| 7 (Oberon, inkl. Nacharbeit) | 0 + 0 = 0 | 626 |
| 8 (Szene, inkl. Nacharbeit) | 2 + 0 = 2 | 628 |

559+23+12+15+8+5+4+0+2 = 628, deckt sich mit dem tatsächlich gezählten
Katalogstand. Task 1 fügt in der Nacharbeit `millot-2018` hinzu (die
ursprüngliche Zahl „5000 K" wurde von Millot et al. 2019 auf Millot et al.
2018 umgehängt); alle anderen sieben Nacharbeits-Commits ändern den Katalog
nicht.

**Eine Berichtszahl weicht von der eigenen Nachzählung ab:** `task-8-report.md`
nennt „Katalog 628 → 630" und begründet die 628 im Bericht selbst als
„zwischenzeitlich veralteter Wert im Brief" — das ist zutreffend (der Brief
war vor Task 1/7 geschrieben), die daraus gezogene Endzahl 630 aber nicht:
Die eigene Nachzählung an den Commits `d972605`/`edc0862` ergibt durchgehend
**628** Einträge (zwei neue Kennungen `depater-2007`/`depater-2026`, aber
kein dritter oder vierter neuer Eintrag). Bereits im Ledger vor Task 9
vermerkt („Katalog am Diff nachgezählt: 559 → 628 — Umsetzer Task 8 meldete
630 — Berichtszahl falsch, Lehre bestätigt") und hier durch eine zweite,
unabhängige Zählung (`git show` je Commit statt nur Vorher/Nachher am
Arbeitsbaum) bestätigt. Kein Sachfehler am Katalog selbst, nur eine
Berichtsungenauigkeit — dieselbe wiederkehrende Lehre wie in Abnahme 4d-7 §2.

## 3. Prüfskript

Vollständiger Lauf ohne `--nur` (ganzer Katalog, 628 Einträge), Start-/
Endzeitpunkt per Unix-Zeitstempel vor und nach dem Kommando gemessen
(1790098709 → 1790099446):

```
npm notice run orrery@0.0.0 literatur:pruefen
npm notice run node scripts/pruefe-literatur.ts
Prüfe 628 von 628 Einträgen
[... 719 Zeilen, davon 714 „ok" ...]
bobis-2008                    url       fehler   nicht erreichbar: TypeError: fetch failed
cgpm-2022                     crossref  warnung  Crossref führt keine Autoren, Erstautor ungeprüft
greaves-2021                  crossref  warnung  Jahr bei Crossref 2020/2020, im Katalog 2021
korablev-2019                  crossref  warnung  Crossref führt die Körperschaft „The ACS and
                                                   NOMAD Science Teams" zuerst, Erstautor
                                                   „Korablev, O." steht unter den weiteren Autoren
sanchez-lavega-2011            crossref  warnung  Crossref führt die Körperschaft „The
                                                   International Outer Planet Watch (IOPW) Team"
                                                   zuerst, Erstautor „Sánchez-Lavega, A." steht
                                                   unter den weiteren Autoren

714 ok, 4 Warnungen, 1 Fehler
```

**Laufzeit:** 737 Sekunden (12:17 min; Ausgangsstand 590 s bei 559 Einträgen
nach 4d-7 — der Katalog ist um 69 Einträge gewachsen, die Laufzeit liegt
plausibel etwas darüber). Keine Zeile mit `429` (`grep -c 429` auf der
vollständigen Ausgabe: 0 Treffer).

**Der eine Fehler ist ein bestätigter Netzwerk-Ausrutscher, kein
Sachbefund dieser Etappe:** `bobis-2008` ist ein bestehender Katalogeintrag
aus einer früheren Etappe (bereits im Plan-Commit `7dacecb` vorhanden, mit
Cassini/Rømer-Lichtgeschwindigkeit ohne Bezug zum Uranussystem), keiner der
18 Commits dieser Etappe berührt ihn. Direkt nachgeprüft:
`curl -s -o /dev/null -w '%{http_code}' <URL>` → `200`; ein isolierter
erneuter Lauf `npm run literatur:pruefen -- --nur bobis-2008` → **1 ok, 0
Warnungen, 0 Fehler, „HTTP 200"**. Derselbe URL war während des rund
zwölfminütigen Volllaufs einmal nicht erreichbar (`TypeError: fetch failed`,
kein HTTP-Statuscode, von der 502/503/504-Wiederholung des Prüfskripts nicht
abgedeckt) und danach wieder erreichbar — ein bekanntes Muster
(vergleichbar mit den bereits in früheren Etappen dokumentierten
gelegentlichen 504ern bei `pds-rings.seti.org`/`herald-2014`). Für die neuen
Katalogeinträge dieser Etappe (23 Uranus, 12 Achsneigung, 15 Miranda, 8
Ariel, 5 Umbriel, 4 Titania, 0 Oberon, 2 Szene = 69) trat **kein** Fehler
und **keine** neue Warnung auf.

**Vier Warnungen, alle vier unverändert aus früheren Etappen begründet
(keine neue Warnung durch diese Etappe):**

- `cgpm-2022` — Crossref führt die 28. Generalkonferenz für Maß und Gewicht
  als Körperschaft, nicht als Person (seit Etappe 2 akzeptiertes Verhalten).
- `greaves-2021` — Crossref führt das Online-Erstjahr (2020), der Katalog
  das Druckjahr der Ausgabe (2021); in Etappe 4 (Venus) so begründet.
- `korablev-2019` — die von der Prüfskript-Lockerung aus Etappe 4
  (Zwischen-Task 5a) beabsichtigte Wirkung: Crossref führt die
  Kollektivbezeichnung zuerst, die tatsächliche Nature-Kopfzeile Korablev als
  Erstautor.
- `sanchez-lavega-2011` — dasselbe Muster, seit Etappe 4d-6 (Saturn, Task 1)
  bekannt und dort begründet (Ruling 16 / Katalogform seit 4d-4).

Keiner der 69 neuen Katalogeinträge dieser Etappe erzeugt eine Warnung oder
einen Fehler.

## 4. Fachprüfung

Zahlen aus den `task-N-report.md`/`task-N-befunde.md`-Dateien, gegengerechnet
gegen die aktuellen Dateien im Arbeitsbaum (`wc -w` auf `src/data/texte/
<sprache>/hochschule/…`, Zeilenzählung der Beleglisten-Tabellen über
`grep -cE '^\|'` minus Kopf- und Trennzeile, eindeutige Literaturkarten je
Kombination per Browsermessung `§5.1` gegengeprüft). Je Text genau eine
Fachprüfung, höchstens eine Nacharbeit (Ruling 3).

| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
|---|---|---|---|---|---|---|
| `objekt-uranus` (Uranus) | 2911 / 3306 | 72 | 27 | 23 | 3/3 (Lamy-2025-Zeitspanne „40 Jahre" → 2011–2022; Nettelmann-2013-Dichotomie Uranus/Neptun vertauscht; Millot-2019-Temperatur/Leitfähigkeitsvergleich nicht belegt, neuer Katalogeintrag `millot-2018`) | 1 offen: Katalogjahr `national-academies-2023` (2022 laut Fachpresse gegen 2023 laut nap.nationalacademies.org) — Entscheidung bei Jens (§8) |
| `thema-achsneigung` (Thema) | 2783 / 3064 | 54 | 23 | 12 | 3/3 (Pluto-Sonnenabstand „mehr als das Doppelte" → rund das 1,67-Fache; zweimal Prozesssprache „Fachprüfung läuft parallel" in der Belegliste) | keine offen (4 von 7 Hinweisen mit Änderung behoben: zwei fehlende Beleglisten-Zeilen ergänzt, Fundstelle Jahreszeiten-Code präzisiert, Eris/Makemake-Formulierung geschärft, Präzessionsformel-Kapitelangabe ergänzt; 2 ohne Änderungsbedarf belassen — Touma-und-Wisdom-1993- und Dobrovolskis-und-Harris-1983-Zitate nicht unabhängig im Volltext nachprüfbar, aber keine Gegenaussage gefunden, kein Fehler → §8) |
| `objekt-miranda` (Miranda) | 2312 / 2399 | 54 | 18 | 15 | 1/1 (Arden-Corona-Alter „0,1 bis 1 Milliarde Jahre" durch Kirchoff et al. 2022 nicht gedeckt — die Arbeit datiert nur Elsinore/Inverness, nicht Arden) | keine offen (3 Hinweise behoben: Ammoniak-Beleg auf Titania/Oberon statt Miranda präzisiert, engere Q-Spanne aus Tittemore und Wisdom 1990 ergänzt, fehlende Beleglisten-Zeile zu Cartwright et al. 2021 nachgetragen) |
| `objekt-ariel` (Ariel) | 2197 / 2366 | 56 | 18 | 8 | 1/1 (Sonnenabstand „mehr als zwanzigmal" gegen die eigene Quelle „20 times" und den tatsächlichen Wert rund 19,2 AE) | keine offen (Terminologie „bahnzugewandt"/„bahnabgewandt" auf „vorlaufend"/„nachlaufend" vereinheitlicht; Wärmestromdichte-Spanne vom Prüfer als bereits ausreichend gehedged bestätigt) |
| `objekt-umbriel` (Umbriel) | 2052 / 2236 | 47 | 19 | 5 | 3/3 (Fundstelle Ariel-Halbachse mit Exzentrizität verwechselt; Wunda-Ring-Breite „einige Zehnerkilometer" durch die Quelle nur als Untergrenze „mindestens 10 km" gedeckt, auch im Fließtext berichtigt; `ASSETS.md`-Fundstelle „35–45 %" statt korrekt „38–43 %" belichtete Fläche) | keine offen (3 Hinweise vom Prüfer selbst als angemessen vorsichtig bestätigt: Karkoschka 2001 ohne Einzelwert, Abwesenheitsschluss zu tektonischen Strukturen, Denton et al. 2026 nur als offene Fragestellung zitiert) |
| `objekt-titania` (Titania) | 2286 / 2442 | 47 | 18 | 4 | 3/3 (Sternbedeckungs-Sehnenzahl „57 ausgewertete" statt „57 beobachtet, 27 zur Radiusbestimmung verwendet"; Druckvergleich „ein Milliardstel" statt „ein Hundertmillionstel" der Erdatmosphäre; Prozesssprache „Task" im Kopftext der Belegliste) plus 1 fehlende Beleglisten-Zeile ergänzt | keine offen (2 Hinweise behoben: Ariel-Gesteinsanteil-Spanne auf den tatsächlich in `objekt-ariel.md` stehenden Wert „60 %" vereinheitlicht; Magnetopausenabstand mit der korrekten Uranusradius-Konstante neu gerechnet — Titania lag danach auch 1986 innerhalb der Magnetosphäre, nur mit schmalerer Marge) |
| `objekt-oberon` (Oberon) | 2318 / 2430 | 55 | 18 | 0 | 2/2 (Moore et al. 2004 belegte die 11-km-Bergschätzung laut Abstract nicht — per selbst beschafftem Volltext doch bestätigt, Fundstelle mit Lage und Zentralberg-Hypothese präzisiert; Prozesssprache „Brief" im Kopftext der Belegliste) | 1 offen: Abwesenheitsschluss zu einer Oberon-eigenen Graben-/Wärmefluss-Studie (Zeile 22) — vom Prüfer selbst als sachlich unbedenklich eingestuft, keine Änderung vorgenommen |
| `szene-uranus-gekippt` (Szene) | 1135 / 1259 | 40 | 6 | 2 | 7/7 (sechs Fehler reine Prozesssprache in der Belegliste — Kopftext und fünf Fundstellen-Zellen; ein Fehler inhaltlich: „42 Jahre je Pol" widersprach ohne Vorbehalt den im fachgeprüften `objekt-uranus.md` selbst genannten rund 44,5 Jahren zwischen den Sonnenwenden) | keine offen (1 Hinweis behoben: ν-/μ-Ringradien in der Belegliste zusätzlich an der PDS-Ringtabelle statt nur am Codekommentar belegt) |

Belegzeilen sind die Datenzeilen der Beleglisten-Tabelle (ohne Kopf- und
Trennzeile) unter `docs/belege/hochschule/`, über `grep -cE '^\|'` minus 2
gezählt. Zitate sind die im Browser gemessenen, eindeutigen Literaturkarten
je Kombination (§5.1), deckungsgleich mit den `literatur:`-Kennungen in
beiden Sprachfassungen (je Kombination in DE und EN identisch, `karten`-Zahl
und `zitateGleichKarten` in beiden Sprachen geprüft). Wortzahlen `wc -w` auf
den aktuellen Dateien in `src/data/texte/<sprache>/hochschule/` selbst
gemessen — bei Umbriel (2052/2236) je ein Wort höher als die im
Nacharbeits-Bericht zuletzt genannte Zahl (2051/2235); kein Sachfehler, nur
eine geringfügige Differenz derselben Art wie in Abnahme 4d-7 §7 dokumentiert.

Modellzahlen aus den bereits fachgeprüften Texten (`thema-bahnelemente`,
`thema-gebundene-rotation`, `thema-finsternis`, `thema-photometrie`,
`thema-ringe`, `objekt-saturn`, `objekt-venus`, `objekt-mars`, `objekt-earth`,
`objekt-mercury`, `objekt-sun`, `thema-bezugssysteme`, `thema-entstehung`)
wurden nach Ruling 8 gleichlautend übernommen (Achsneigung 97,77°/82,23°,
Rotationsperiode 17,24 h, Ringkonstanten, `MAX_OKKLUDER`-Auswahl, Modellschiefen
der übrigen Planeten). Zwei Stellen, an denen eine solche Übernahme selbst
fehlte, wurden in der Nacharbeit nachgezogen: die Szenen-Aussage zu den 42/44,5
Jahren (Fehler oben) und die Titania-Magnetopausenrechnung (dort keine
Übernahme, sondern eine eigene, in der Nacharbeit korrigierte Herleitung).

## 5. Sichtprüfung

Dev-Server lief bereits (`curl -s -o /dev/null -w '%{http_code}'
http://localhost:5173/Orrery/` → 200), kein zweiter gestartet.
`window.store.setState({ quality: { tier: 'high' } })` direkt nach
`browser_navigate` gesetzt, danach die vorgegebene Zustands-Einrichtung
(Niveau Hochschule, Panel eingehängt, `breiteRem: 40`). Szenenindex
`uranus-gekippt` am Array in `src/data/scenes.ts` selbst gegengeprüft
(dynamischer Import `/Orrery/src/data/scenes.ts` im Browser): **16** von 19
Szenen — exakt der im Brief genannte Index.

### 5.1 Rundgang

Alle 16 Kombinationen (acht Kennungen × de/en) angefahren: Körper über
`setInfo({thema:null})` + `setCamera({targetId, mode:'free'})`, das Thema
über `setInfo({thema:'achsneigung'})`, die Szene über
`setCinema({running:true, shuffle:false, nummer:16})` +
`setCamera({mode:'cinema'})`, nach Stabilisierung `setCinema({running:false})`,
`setTime({paused:true})`, `setUi({hidden:false})`. Auf den Kopfwechsel
gepollt (bis zwei aufeinanderfolgende Messungen im Abstand von 100 ms
denselben Kopf und dieselbe Formelzahl zeigten), Hinweiszeilen erst nach
dem Auflösen des faulen Imports gewertet.

**Eigene Messfalle in dieser Etappe gefunden (Klicktests, nicht der
Rundgang selbst):** Ein `szene:`-Klicktest, gefolgt von einem direkten
`setCamera({mode:'free', targetId})` ohne vorheriges `setCinema({running:
false})`, hinterlässt `cinema.running:true` bei `camera.mode:'free'` — eine
Kombination, die die Anwendung über die Benutzeroberfläche nie erreicht
(Kamerafahrten beenden laut Projektregel ein angehaltenes Kino automatisch,
ein direkter Store-Zugriff aus dem Skript umgeht das). Das Infopanel verlor
danach dauerhaft seinen Tabpanel-Inhalt (`aside.info-panel
[role="tabpanel"]` blieb über mehrere Sekunden `null`), bis die Seite neu
geladen wurde. Für den eigentlichen Rundgang **ohne** Auswirkung, da dort
nach jedem Szenen-Schritt exakt die im Brief vorgegebene Reihenfolge
(`setCinema({running:false})`, `setTime({paused:true})`,
`setUi({hidden:false})`) eingehalten wurde; erst die zusätzlichen
Klicktests aus Schritt 3 (Tabelle unten) benötigten nach jedem
`szene:`-Klicktest ein explizites `setCinema({running:false})` +
`setTime({paused:true})` vor dem nächsten Kombinationsaufbau. Kein
Programmfehler der Etappe, sondern eine Messvorschrift-Lücke des
Playwright-Skripts selbst.

**Bestätigte Messfalle (wie in Abnahme 4d-6/4d-7 §5.1 dokumentiert):**
`objekt:`- und `thema:`-Verweise sind im DOM `<button>`-Elemente, keine
`<a>`-Elemente (per `[data-verweis="objekt:uranus"]` ohne Tag-Einschränkung
im Browser bestätigt); `quelle:`-Verweise sind echte externe `<a href="…">`-
Anker auf die Quellenseite selbst. Durchgehend `[data-verweis^="<art>:"]`
ohne Tag-Einschränkung verwendet, damit fand jede Messung korrekt statt.

**Kernkriterien, alle 16 Kombinationen:** `formelfehler` **0**, keine
Hinweiszeile (insbesondere keine `info.hochschuleFolgt`/„Der Hochschultext
folgt …"), `zitateGleichKarten` **true**.

**16 von 16 Kombinationen ohne Formelfehler und ohne Hinweiszeile.**

| Kombination | Kopf DE | Kopf EN | Formeln | Tabellen | Karten (=Zitate) |
|---|---|---|---|---|---|
| `objekt:uranus` | Uranus | Uranus | 70 | 1 | 27 |
| `thema:achsneigung` | Achsneigung | Axial tilt | 51 | 1 | 23 |
| `objekt:miranda` | Miranda | Miranda | 44 | 1 | 18 |
| `objekt:ariel` | Ariel | Ariel | 46 | 1 | 18 |
| `objekt:umbriel` | Umbriel | Umbriel | 42 | 1 | 19 |
| `objekt:titania` | Titania | Titania | 42 | 1 | 18 |
| `objekt:oberon` | Oberon | Oberon | 47 | 1 | 18 |
| `szene:uranus-gekippt` (Nr. 16) | Szene: Der liegende Uranus | Scene: Uranus lying on its side | 18 | 0 | 6 |

Formeln, Tabellen und Zitatzahl sind je Sprache identisch (in beiden Läufen
gemessen) — keine DE/EN-Verweisasymmetrie in dieser Etappe.

**Klicktest je Verweisart:** Je Kombination wurde von jeder der fünf
Verweisarten (`objekt`, `thema`, `szene`, `quelle`, `literatur`) das erste
Vorkommen über `[data-verweis^="<art>:"]` ermittelt, per `element.click()`
ausgelöst und die Wirkung gegen die Tabelle im Brief geprüft (`objekt` →
`camera.targetId` nach 1,7 s Wartezeit; `thema` → `ui.info.thema`; `szene`
→ `cinema.nummer` gegen den erwarteten Index samt `camera.mode==='cinema'`,
danach Kino explizit gestoppt; `quelle`/`literatur` → Kartenklasse enthält
`border-sky-300`, Klick und Prüfung in einem `browser_evaluate`); die
Kombination wurde vor jedem Einzeltest frisch aufgebaut. Vier der acht
Kennungen (Miranda, Ariel, Umbriel, Titania) enthalten keinen `szene:`-
Verweis im Text (`szene:uranus-gekippt` wird dort bewusst nicht verwendet,
siehe Task-Berichte) — dort zählt „kein Vorkommen" statt eines Treffers,
kein Befund.

**Ergebnis: 72 von 72 anwendbaren Klicktests trafen** (8 Kennungen × 2
Sprachen × 5 Arten = 80 Einzeltests, davon 8 „kein Vorkommen" bei
`szene:` in den vier genannten Mondtexten, macht 72 anwendbare Tests). Alle
72 Treffer: `objekt` → `camera.targetId` stimmt; `thema` → `ui.info.thema`
stimmt; `szene` → `cinema.nummer` traf den erwarteten Index samt
`camera.mode==='cinema'`; `quelle`/`literatur` → Karte trug
`border-sky-300`.

### 5.2 Ersatz entfällt

Nach Ruling 20: drei Paare je Sprache (sechs Messungen), Wartezeit bis zum
Kopfwechsel (`performance.now()`, Zeit vom Klick bis zum ersten
abweichenden Kopf):

| Messung | Kopf vorher | Kopf danach | Hinweiszeile | Wartezeit |
|---|---|---|---|---|
| `thema:photometrie` → `objekt:uranus` (de) | Albedo und Helligkeit | Uranus | keine | 80 ms |
| `objekt:venus` → `thema:achsneigung` (de) | Venus | Achsneigung | keine | 38 ms |
| `thema:ringe` → `szene:uranus-gekippt` (de) | Ringsysteme | Szene: Der liegende Uranus | keine | 27 ms |
| `thema:photometrie` → `objekt:uranus` (en) | Albedo and brightness | Uranus | keine | 72 ms |
| `objekt:venus` → `thema:achsneigung` (en) | Venus | Axial tilt | keine | 30 ms |
| `thema:ringe` → `szene:uranus-gekippt` (en) | Ring systems | Scene: Uranus lying on its side | keine | 0 ms |

`objekt:`/`thema:`-Verweise sind `<button>`-Elemente (siehe §5.1); der
Selektor `[data-verweis="…"]` ohne `a`-Präfix fand in allen sechs Fällen
den richtigen Klickpunkt (Tabellenzelle „Uranus" in „Albedo ausgewählter
Körper" für (a), Fließtext-Verweis in „Bahn, Rotation und Dynamik" für (b),
Fließtext-Verweis in „Die Ringe der übrigen Riesenplaneten" für (c)). Alle
sechs Messungen ohne Hinweiszeile: Die vorher an `thema:photometrie`
beziehungsweise `objekt:venus`/`thema:ringe` gezeigte Ersatz-Hinweiszeile
für Uranus, Achsneigung beziehungsweise die Szene ist entfallen, weil diese
Etappe die entsprechenden Hochschultexte liefert. Bei (c) endete die
0-ms-Messung, weil der Kopf beim ersten Poll nach dem 200-ms-Warten bereits
umgestellt war (die Kinostart-Stabilisierung lag vor dem ersten Messpunkt).

### 5.3 Konsole

`browser_console_messages` (seit dem Navigate, `all: true`, Ebene
`warning`): **0 Fehler, 0 Warnungen** über die gesamte Sitzung (Navigate,
16er-Rundgang, 80 Klicktests, sechs Ersatz-Messungen). Da keine Warnung
auftrat, entfällt die im Brief vorgesehene Gegenprobe mit echtem
`browser_click` (sie ist nur für den Fall vorgesehen, dass eine Warnung
gezählt wurde).

Playwright-Aufnahmen (`console-*.log`, `page-*.yml` unter `.playwright-mcp/`)
wurden vor dem Commit gelöscht, keine Skripte im Projektstamm angelegt.

## 6. Rulings der Umsetzung

Jede Zeile des Ledgers mit „Ruling:", in Ledger-Reihenfolge.

**Vorprüfung (Controller, 22.09.2026):**

- Die Fachprüfung (Auftrag wörtlich aus den Gemeinsamen Vorgaben, 9
  Prüfpunkte) ist zugleich die Task-Prüfung jedes Text-Tasks (Spec-Treue +
  Qualität), wie in 4d-5 bis 4d-7 — sie prüft Texte, Belegliste und
  Katalogeinträge am Diff; ein zweiter Reviewer würde dieselbe Arbeit
  doppeln. Kosten bei Irrtum: ein Formfehler im Katalog bleibt bis zur
  Schlussprüfung unentdeckt.
- Kein Worktree (Vite-Server liefert dieses Verzeichnis aus, lokale
  Projektanleitung); Branch `hochschule-8` direkt im Projektordner.

**Task 1 (Uranus):**

- Der Brief nennt „Desch et al. 1986, Science 233, 102" für die
  Rotationsperiode; an der Quelle geprüft ist das tatsächlich Warwick et al.
  1986 (Desch nur Mitautor). Die eigentliche Rotationsperioden-Quelle ist
  Desch, Connerney und Kaiser 1986, Nature 322, 42–43 (17,24 ± 0,01 h) —
  diese zitiert, nicht die vom Brief genannte Fundstelle.
- Zusätzlich zu Jacobson 2014 wird die im Task selbst gefundene Neuauswertung
  Jacobson und Park 2025 (AJ 169, 65, DOI 10.3847/1538-3881/ad99d1) zitiert
  (neuere Übersicht mit erweitertem Datenbogen 1847–2016); Jacobson 2014
  bleibt die Hauptquelle für die Kenngrößen-Tabelle, da es die im Datensatz
  (NAIF-Kernel) tatsächlich verwendete Grundlage ist.
- Katalogeintrag `national-academies-2023` trägt `url` statt `doi`, weil
  Crossref den Bericht als Komitee-Werk ohne einheitliche Körperschaft an
  erster Stelle führt (vier verschiedene Organisationsnamen, keiner exakt
  „National Academies of Sciences, Engineering, and Medicine"); mit `doi`
  hätte das Prüfskript einen Erstautor-Fehler gemeldet. Jahr 2023 nach dem
  bei nap.nationalacademies.org geführten Bericht; ursprünglich digital
  veröffentlicht 2022.
- Für die Konkurrenz der beiden Mondentstehungs-Modellfamilien
  (Rieseneinschlag gegen Koakkretion) wird von den beiden im Brief
  alternativ genannten Arbeiten Szulágyi et al. 2018 verwendet (eigenständige,
  klar abgegrenzte Aussage zur Koakkretion), nicht Salmon und Canup 2022
  (dort ein Hybridmodell, das die Gegenüberstellung verwässert hätte).
- Jahreszeitentermine (Sonnenwenden/Tagundnachtgleiche) selbst aus den
  Bahnelementen und dem Pol des Datensatzes berechnet (Bisektion über
  1975–2036); Ergebnis deckt sich exakt bzw. auf einen Tag genau mit
  unabhängig veröffentlichten Terminen. Die Nordsommer-Sonnenwende 2030
  weicht vom „2028" im Gymnasialtext der Szene `uranus-gekippt` ab → §8.
- `quellen.ts` unverändert gelassen — die vier im Brief genannten Karten
  (`nssdc-uranus`, `nasa-uranus`, `nasa-voyager-2`, `pds-rings`) haben
  `objekt:uranus` bereits im `fuer`-Feld, ein `quelle:`-Verweis im Text ist
  keine Pflicht.
- Hinweis zu `national-academies-2023` (Katalogjahr 2022 vs. 2023) bleibt
  nach der Nacharbeit offen, liegt außerhalb der einen zulässigen
  Nacharbeitsrunde → §8.

**Task 3 (Miranda), Nacharbeit:**

- Der Umsetzer hat die EN-Fassung nach den Berichtigungen „inhaltlich
  neutral" um 60 Wörter gekürzt, um unter der Obergrenze 2400 zu bleiben —
  Verstoß gegen „nicht kürzen in der Nacharbeit". Ruling: belassen, keine
  weitere Runde (Regel „eine Prüfrunde je Text") → §7.

**Task 4 (Ariel):**

- Zwei Ausgangspunkte des Briefs erwiesen sich an der Quelle geprüft als
  falsch zugeordnet (dritte und vierte solche Angabe dieser Etappe):
  „Weiss et al. 2021, Planetary Science Journal 2, 71" existiert unter
  dieser Bandangabe nicht — die tatsächlich veröffentlichte Fassung ist
  Geophysical Research Letters 48, e2021GL094758 (dieselben Autoren,
  derselbe Titel, Crossref bestätigt); „Cartwright et al. 2023,
  Astrophysical Journal Letters 953, L38" gehört zu Band 953/L38 zu einer
  fachfremden Arbeit — die tatsächliche JWST-Ariel-Arbeit derselben
  Erstautorengruppe erschien 2024 in ApJL 970, L29 (DOI
  10.3847/2041-8213/ad566a). Beide korrigierten Angaben zitiert, beide
  falschen nicht.
- „Peterson et al. 2015" (von Task 3 als Ariel-Arbeit statt Miranda
  identifiziert) und „Beddingfield et al. 2022" (Briefvorgabe) sind zwei
  eigenständige, echte Ariel-Arbeiten zur elastischen Dicke/Wärmestromdichte
  (ältere und neuere Grabenzug-Auswertung) — beide zitiert, nicht eine gegen
  die andere ausgetauscht.
- „Grundy 2003" (Solo-Entdeckungsarbeit, im Brief nicht genannt) zusätzlich
  zum briefgenannten „Grundy et al. 2006" zitiert, da 2003 die
  spezifischere Erstquelle für Ariels CO₂-Asymmetrie selbst ist (2006 deckt
  vier Monde ab und bestätigt/erweitert 2003 nur).
- Erste Version der Belegliste enthielt an mehreren Stellen die Wörter
  „Task N"/„Brief" (Wiederverwendungshinweise, Herkunft der von Task 3
  übernommenen, falsch zugeordneten Ausgangspunkte) — vor dem Bericht
  selbst gefunden und durch neutrale Formulierungen ersetzt (z. B. „siehe
  `objekt-miranda.md`-Belegliste" statt „siehe Task-3-Bericht"), Commit
  lokal amendiert (unreviewt, kein Push).

**Task 5/6 (Umbriel, Titania — Verfahrensbefund Prüfspalte):**

- Task 5: Umsetzer hatte die Prüfspalte beim Erstellungscommit selbst mit
  „ok"-Einträgen befüllt statt sie leer zu lassen. Ruling: Die Spalte gilt
  als vom Prüfer bestätigt (er hat jede Zeile unabhängig geprüft und nur
  drei überschrieben); keine zweite Runde; Folgedispatches verlangen
  ausdrücklich eine leere Prüfspalte → §7.
- Task 6: derselbe Verfahrensbefund (Umsetzer hatte die vorbefüllte Spalte
  vermutlich von der uncommitteten Umbriel-Belegliste als Vorlage
  übernommen). Ruling: Der Prüfer überschreibt jede Zeile mit einem eigenen
  Eintrag (die Vorbefüllung ist nicht die Prüfung); Dispatches für Task 7
  und 8 verlangen ausdrücklich eine leere Prüfspalte — für Task 7 und 8 laut
  den Selbstprüfungs-Abschnitten der jeweiligen Berichte eingehalten.

**Vor Task 9 (Controller):**

- Katalog am Diff nachgezählt: 559 → 628 (Umsetzer Task 8 meldete 630 —
  Berichtszahl falsch, Lehre bestätigt) → §2.

Die 23 Plan-Rulings selbst stehen vollständig im Plan
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe8.md` Abschnitt
„Rulings" und sind inhaltlich in §1 (Reihenfolge, Modelle, eine Prüfrunde),
§2 (Richtwert 800–1800/Obergrenze 2400 für die fünf Monde), §4 (Prüfpunkte,
Ruling 8) und §5 (Ersatz entfällt, Ruling 20) dieses Protokolls eingearbeitet;
als Themenliste in §8.

## 7. Bekannte Unschärfen

**Code-/Datensatz-Befunde, in dieser Etappe selbst gefunden oder bestätigt
(nicht behoben, Texte beschreiben den Ist-Code, Ruling 7):**

- `src/data/bodies/uranus-monde.ts`-Kopfkommentar zu Titanias Kepler-
  Umlaufzeit nennt „8,706483 d (Δ 0,0071 %)" — das ist die vereinfachte
  Formel nur mit Uranus' Masse; die tatsächliche `umlaufzeitTage()`-Funktion
  addiert beide Massen und ergibt 8,706312 d (Δ 0,0051 %). Kein Fehler im
  Verhalten des Codes, nur eine im Kommentar nicht ausgewiesene
  Vereinfachung, in der Titania-Nacharbeit nicht angetastet.
- Modell-Bahnneigung (180° − i) gegen die NSSDC-Faktenblattwerte weicht bei
  allen fünf Uranusmonden unaufgelöst ab, unterschiedlich stark: Titania
  0,02°, Miranda 0,09° (bereits aus früheren Etappen bekannt), Umbriel
  0,07° (neu in dieser Etappe nachgerechnet und dokumentiert), Oberon
  **0,12°** (größte Differenz der fünf, neu in dieser Etappe gefunden:
  Modell 0,188° gegen NSSDC-Rohtext 0,07°). In allen fünf Fällen als offene
  Differenz in „Im Modell" dargestellt, nicht als Fehler behandelt.
- Titanias Bahnradius (436 293 km) liegt nahe am Magnetopausenabstand, den
  Voyager 2 1986 unter dem inzwischen als anomal-komprimiert erkannten
  Sonnenwindzustand maß; die Titania-Nacharbeit korrigierte die eigene
  Rechnung (442 171 km statt „~17 R_U" mit falscher Radienkonstante) und
  fand: Titania lag danach auch 1986 innerhalb der Magnetosphäre, nur mit
  schmalerer Marge. **`docs/belege/hochschule/objekt-umbriel.md` Zeile 66
  trägt dieselbe Magnetopausen-Verwechslung weiterhin unkorrigiert** (vom
  Titania-Fachprüfer gefunden, von der Titania-Nacharbeit bewusst nicht
  angefasst, da fremde, bereits fachgeprüfte Datei) — Kandidat für die
  nächste inhaltliche Berührung von `objekt-umbriel.md`.
- `decolibus-2023` (DeColibus, Chanover, Cartwright 2023,
  „Are NH₃ and CO₂ Ice Present on Miranda?", PSJ 4, 191): Crossref liefert
  den Titel mit eingebetteten Zeilenumbrüchen um die `<sub>`-Tags der
  chemischen Formeln, was den Titel-Ähnlichkeitstest des Prüfskripts
  (`literaturVergleich.ts`, Schwelle 80 %) unter beiden
  Normalisierungslesarten auf rund 60 % drückt — ein dritter, bisher nicht
  abgedeckter Grenzfall (Leerraum auf **beiden** Seiten der Tags) neben dem
  bereits aus 4d-4 bekannten Muster. Die eigentlich einschlägigste
  Miranda-Ammoniak-Quelle bleibt deshalb außerhalb des Katalogs. Kandidat
  für eine Prüfskript-Korrektur.
- Okkluder-Auswahl (`waehleOkkluder`, `render/shadows.ts`) bestätigt für die
  fünf Uranusmonde: Oberon hat trotz größtem physischem Radius (761,4 km)
  wegen der großen Entfernung (583 550 km) den kleinsten dargestellten
  Winkelradius (269,1″) und fällt bei `MAX_OKKLUDER = 4` unabhängig vom
  gewählten Maßstab immer als Schattenwerfer weg (bereits in Task 1 als
  bekanntes Muster angekündigt, in Task 7 erstmals vollständig
  durchgerechnet).

**Beleglisten-Nacharbeit ohne strikte Kürzungsregel eingehalten (Task 3,
§6):** Die Miranda-Nacharbeit hat die englische Fassung nach den
Berichtigungen um 60 Wörter „inhaltlich neutral" gekürzt, um unter der
Obergrenze 2400 zu bleiben — entgegen der Regel „in der Nacharbeit wird
nicht gekürzt". Per Ruling belassen (keine zweite Runde); die gestrichene
Nebenstelle wurde von niemandem mehr geprüft.

**Verfahrensbefund Prüfspalte (Task 5, Task 6, §6):** In beiden Tasks war
die Spalte „Prüfung" beim Erstellungscommit bereits (teilweise)
vorbefüllt, obwohl die Vorgabe sie leer verlangt. In beiden Fällen hat der
Fachprüfer nachweislich jede Zeile unabhängig geprüft (Task 5: drei Zeilen
überschrieben, Rest bestätigt; Task 6: die gesamte Spalte neu geschrieben),
sodass kein Prüfschritt tatsächlich ausgefallen ist — nur ein
Verfahrensfehler der Umsetzer, für Task 7/8 durch einen ausdrücklichen
Dispatch-Hinweis behoben.

**Quellen hinter Verlagssperren (HTTP 403/404/405 oder Bot-Sperre), je
Text (Auswahl der zentralen, nicht direkt öffnbaren Arbeiten, in der
Belegliste jeweils über Sekundärquellen mit wörtlichem Zitat ersetzt):**

- Uranus: 7 von 22 (Science/AAAS, Nature ×2, AGU/JGR vor 1997 ×2, Nature
  Astronomy [später über PMC doch geöffnet]).
- Achsneigung: keine Sperrungsprobleme bei den zwölf neuen Einträgen; zwei
  Aussagen (Touma und Wisdom 1993, Dobrovolskis und Harris 1983) blieben
  ohne unabhängig geprüftes wörtliches Zitat (§8).
- Miranda: 7 von 15 (ScienceDirect ×6, AGU/Wiley ×1).
- Ariel: 4 von 8 (ScienceDirect, AGU/Wiley, IOPscience ×2).
- Umbriel: 2 zentrale Arbeiten (ScienceDirect/ResearchGate/ADS für
  `sori-2017`, AGU/Wiley für `denton-2026`), beide über Sekundärquellen
  belegt.
- Titania: 4 von 4 (ScienceDirect-Weiterleitung ohne Inhalt, Nature-Login
  [über PMC umgangen], IOPscience ×2 nicht versucht); zusätzlich Croft und
  Soderblom 1991 (Buchkapitel) nirgends öffnbar, nicht zitiert.
- Oberon: 6 von 18 (ScienceDirect/Elsevier ×4, IOPscience, Plescia 1987 nur
  Abstract); Croft und Soderblom 1991 wie bei Titania nicht öffnbar; Moore
  und Henbest 1986 (populärwissenschaftlich) nicht auffindbar, nicht
  zitiert.
- Szene: `stone-1986` (bereits aus Task 1 bekannt), `depater-2007`
  (science.org 403), `depater-2026` (AGU/Wiley 403) — beide über ESO- bzw.
  phys.org-Sekundärquellen belegt.

In allen Fällen stützen sich die Aussagen auf live geprüfte
Crossref-Metadaten plus mindestens eine unabhängige, selbst abgerufene
Zusammenfassung oder Sekundärquelle mit wörtlichem Zitat.

**Methodik, für alle acht Texte gleich:** Node kann die echten
Projektfunktionen (`src/data/index.ts`, `src/sim/orbit.ts`) ohne
`tsx`/`vite-node` nicht direkt ausführen; alle „Nachrechnung am Code"-Zeilen
der Beleglisten beruhen auf direkt aus den Quelldateien gelesenen Formeln
und Werten, von Hand oder per Skript im Scratchpad angewendet.

**Katalogzahlen-Berichtsungenauigkeit:** siehe §2, eine Abweichung
(Task-8-Bericht „628 → 630" statt korrekt „626 → 628"), durch eigene
Nachzählung an jedem der 18 Commits widerlegt.

**Wortzahlen-Berichtsungenauigkeit:** siehe §4, Umbriel-Nacharbeitsbericht
nennt DE 2051/EN 2235, die eigene `wc -w`-Messung dieser Abnahme ergibt DE
2052/EN 2236 (je ein Wort mehr) — kein Sachfehler am Text.

## 8. Halt: Fragen an Jens

**Katalogjahr `national-academies-2023` (Task 1, offener Hinweis 6, §6):**
Der Bericht „Origins, Worlds, and Life" wird in der Fachpresse (AIP,
Planetary Society, Spaceflight Now, phys.org) durchgehend als
„2022"-Bericht zitiert (ursprüngliche Veröffentlichung April 2022); die bei
nap.nationalacademies.org geführte Fassung ist mit 2023 datiert (offenbar
eine spätere Ausgabe/Auflage). Aktuell trägt der Katalogeintrag Kennung und
Jahr `national-academies-2023`. Vorschlag: auf `national-academies-2022`
umstellen, sofern keine andere Vorgabe gewünscht ist.

**Wortzahlen über der Obergrenze (Ruling 4/15, Obergrenze jeweils ein
Drittel über dem Richtwert):** Monde-Obergrenze 2400 — **Titania EN 2442**
(42 Wörter darüber, nach der Berichtigung der Sternbedeckungs-Sehnenzahl und
des Druckvergleichs) und **Oberon EN 2430** (30 Wörter darüber, nach der
volltextgestützten Präzisierung der 11-km-Bergschätzung) überschreiten die
Obergrenze; Miranda EN 2399 liegt knapp darunter. Szene-Obergrenze 1200 —
**EN 1259** (59 Wörter darüber, nach Ergänzung des in `objekt-uranus.md`
bereits fachgeprüften 44,5-Jahre-Vorbehalts und der Auflösung mehrerer
Prozesssprache-Stellen) überschreitet die Obergrenze; DE 1135 liegt
darunter. Alle drei Überschreitungen entstanden ausdrücklich in der einen
zulässigen Nacharbeitsrunde durch inhaltliche Berichtigungen, nicht durch
Erweiterung des Umfangs, und sind nach Ruling 15 („Richtigkeit vor Wortzahl,
Straffung nie in der Nacharbeit") ausdrücklich zulässig. Vorschlag wie in
den Etappen 4d-4, 4d-6 und 4d-7 entschieden: annehmen.

**Miranda-Nacharbeit kürzte entgegen der Regel (§6/§7):** Die englische
Fassung wurde nach den Berichtigungen um 60 Wörter „inhaltlich neutral"
gestrafft, um unter der Obergrenze zu bleiben — ein Verstoß gegen „in der
Nacharbeit wird nicht gekürzt". Per Ruling belassen (keine zweite Runde).
Vorschlag: zur Kenntnis nehmen, keine Nachbesserung (würde eine zweite
Prüfrunde erfordern).

**Verfahrensbefund Prüfspalte bei Task 5 und Task 6 (§6/§7):** Beide
Umsetzer hatten die Spalte „Prüfung" beim Erstellungscommit versehentlich
vorbefüllt statt leer zu lassen; in beiden Fällen hat der Fachprüfer
nachweislich unabhängig nachgeprüft (keine übersehenen Fehler zu erwarten).
Für Task 7/8 per Dispatch-Hinweis behoben. Vorschlag: zur Kenntnis nehmen,
keine weitere Maßnahme.

**Gymnasialbefunde (nicht geändert, nur gemeldet):**

- Szene `uranus-gekippt` (de/en): „2028" für die Nordsommer-Sonnenwende
  statt der von Task 1 und Task 8 übereinstimmend nachgerechneten und
  unabhängig bestätigten 11. April 2030 (vermutliche Ursache: eine NASA-
  Webb-Pressetextseite schreibt selbst „will be in 2028", möglicherweise
  eine naive Vierteljahres-Schätzung 2007 + 84/4 = 2028, während der
  tatsächliche Termin wegen der Bahnexzentrizität rund zweieinhalb Jahre
  später liegt).
- `objekt-miranda` (Gymnasium, de/en): Verona Rupes „rund 20 km" Höhe und
  „rund zwölf Minuten" Falldauer — der einzige photogrammetrisch
  hergeleitete Wert (Thomas 1988, im Hochschultext selbst verwendet) nennt
  „5 bis 10 km" (rund 6–8,5 Minuten Fallzeit); die „20 km" scheinen auf eine
  spätere, nicht begutachtete NASA-APOD-Bildunterschrift zurückzugehen.
- `objekt-titania` (Gymnasium, de/en): „Dichte von 1,7 g/cm³ spricht für
  etwa gleiche Anteile Eis und Gestein" — nach dem Zwei-Komponenten-Modell
  des Hochschultexts weder massebezogen (rund 65 % Gestein) noch
  volumenbezogen (rund 64 % Eis) tatsächlich „etwa gleich". Zusätzlich
  stellt der Satz zu Messina Chasmata die Gefrier-Expansions-Erklärung als
  einzige Deutung dar, obwohl neuere Arbeiten (Beddingfield et al. 2023,
  Nathan et al. 2024) eine jüngere, zusätzliche Wärmequelle nicht
  ausschließen (im Hochschultext als offene Frage dargestellt).
- `objekt-oberon` (Gymnasium, de/en): „Dichte von 1,6 g/cm³ … etwa gleiche
  Anteile Eis und Gestein" — dasselbe Muster wie bei Titania (massebezogen
  rund 59 % Gestein, volumenbezogen rund 69 % Eis, in keiner Lesart „etwa
  gleich").

Vorschlag wie in früheren Etappen (Titan/Iapetus in 4d-7): einen kleinen
eigenen Nachführungs-Task vor 4d-9 einschieben, oder vorerst zurückstellen
und in einer der nächsten Etappen mit weiteren Gymnasialbefunden bündeln —
Entscheidung bei Jens.

**Offene fachliche Unsicherheiten ohne unabhängig geprüftes Zitat (Thema
Achsneigung, §7):** Touma und Wisdom 1993 (Divergenzzeitskala „3 bis 4
Millionen Jahre") und Dobrovolskis und Harris 1983 (wörtliches Zitat zur
chaotischen Pluto-Schiefe) — beide Kernaussagen sind in der
Sekundärliteratur breit bestätigt, aber nicht am selbst geöffneten
Originaltext verifiziert (Bezahlschranke). Vorschlag: zur Kenntnis nehmen,
bei einer künftigen Berührung des Themas am Volltext nachprüfen.

**Code-/Datensatz-Befunde, als Kandidaten für eigene Tasks (§7 für
Details):**

- `uranus-monde.ts`-Kopfkommentar zu Titanias Kepler-Umlaufzeit nennt die
  vereinfachte statt der tatsächlichen Formel.
- Modell-Bahnneigung gegen NSSDC bei allen fünf Uranusmonden unaufgelöst
  (Oberon mit 0,12° die größte Differenz).
- `docs/belege/hochschule/objekt-umbriel.md` Zeile 66 trägt weiterhin die
  von der Titania-Fachprüfung gefundene Magnetopausen-Verwechslung.
- Prüfskript-Grenzfall `decolibus-2023` (Crossref-Titel mit Zeilenumbrüchen
  auf beiden Seiten eines `<sub>`-Tags), dritter Fall dieser Art nach 4d-4
  und 4d-7.
- Datensatz-Befunde aus Ruling 7 (nicht behoben, Texte beschreiben den
  Ist-Code): `nodeDot` 0 bei allen fünf Uranusmonden, gemeinsamer Pol von
  Ariel/Umbriel/Titania/Oberon, Mirandas fester Pol trotz
  IAU-Reihenentwicklung, `rotationPeriodH` −17,24 h (Voyager) gegen Lamy et
  al. 2025, Uranus ohne Abplattung im Renderer, fehlende ν-/μ-Ringe und
  kleine Monde, `achsneigungDeg` gegen die eigene Bahnnormale statt die
  Laplace-Ebene, keine Texturen der fünf Monde.

**Modelle (Plan-Ruling 2/Ledger):** Kein Kontingentlimit in dieser Etappe —
alle acht Umsetzer-/Nacharbeits-Runden, alle acht Fachprüfungen und diese
Abnahme liefen durchgehend auf dem mittleren Modell (sonnet). Keine offene
Frage, nur zur Kenntnis.

**23 Plan-Rulings** und die in §6 aufgeführten Umsetzungs-Rulings (von Jens
noch nicht bestätigt, vollständiger Wortlaut in
`docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe8.md` Abschnitt
„Rulings" und in diesem Protokoll §6). Als Themenliste: Freigabe durch die
4d-7-Entscheidung (1); Modelle/eine Prüfrunde (2/3); Richtwert 800–1800 für
die fünf Monde, Obergrenze 2400 (4); Reihenfolge Uranus → Achsneigung →
Miranda → Ariel → Umbriel → Titania → Oberon → Szene (5); Szene allein in
Task 8 (6); Datensatz-Befunde nicht behoben (7); Modellzahlen aus
fachgeprüften Texten gleichlautend übernehmen (8); kein Verweis-Task (9);
Tausendertrennung/Zahlenspannen (10); Prüfpunkt 8 Prozesssprache samt
interner Kurzverweise, Prüfpunkt 9 Verweisdeckung (11); keine
Formelsatz-Sichtprüfung ohne neuen TeX-Befehl (12); Katalog im Hauptbundle
unter 50-kB-Schwelle (13); Fast-Forward, Push erst nach Jens' Ja (14);
Wortzahl-Obergrenze ein Drittel über dem Richtwert (15); Katalogform wie
4d-4/4d-6/4d-7 (16); Quellenkarten als Angebot (17); Beleglisten-Nacharbeit
mit Zellenkontrolle (18); Schlussprüfung dient als Task-Prüfung der Abnahme
(19); Ersatz entfällt über photometrie→uranus, venus→achsneigung,
ringe→uranus-gekippt (20); `thema-achsneigung` mit eigener Nachrechnung
aller Modellschiefen (21); Uranus-Jahreszeitentermine prüfen, Gymnasialtext
nicht ändern (22); Rotationsperiode bleibt −17,24 h, Lamy et al. 2025 als
Messwert genannt (23).

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen
Projektanleitung beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.
