# Nachführung nach Phase 4d — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Die in der Gesamtabnahme der Phase 4d (`docs/phase4d-abnahme.md`, Abschnitt „Entscheidungen (23.09.2026)", Punkte 2 bis 4) beschlossenen Berichtigungen umsetzen: Driftrate des Großen Roten Flecks in `objekt-jupiter` (Hochschule, DE/EN) samt Belegzeile Nr. 36, Abstand Erdmittelpunkt–Erde-Mond-Schwerpunkt im Gymnasialtext `thema-modell` (DE/EN), mechanische Bereinigung der Prozesssprache in den Beleglisten und der drei unmaskierten `|` in Prüfspalten. Danach ein kurzes Abnahmeprotokoll.

**Architektur:** Reine Text- und Dokumentarbeit, kein Simulationscode. Task 1 berichtigt zwei Aussagen an vier Textdateien und einer Belegliste, jede an der Quelle oder am fachgeprüften Text geprüft. Task 2 und 3 bereinigen die Beleglisten mechanisch; ein Zellenprüfskript und eine Suche nach Prozesssprache sichern, dass nur Wortlaut, nicht Aussage oder Tabellenform geändert wird. Task 4 ist das Abnahmeprotokoll.

**Tech-Stack:** Markdown-Texte unter `src/data/texte/`, Beleglisten unter `docs/belege/hochschule/`, Vitest (Dateitest `src/data/texte/dateien.test.ts`), Python 3.12 für das Zellenprüfskript, Playwright-MCP für eine DOM-Stichprobe in Task 4.

**Entwurf:** Kein eigener Entwurf; maßgeblich sind die „Entscheidungen (23.09.2026)" in `docs/phase4d-abnahme.md` (Punkte 2, 3, 4) und die dort in §2.3, §6(b), §6(d) und „Gymnasialtexte" beschriebenen Befunde. Vorlage für das Protokoll: `docs/phase4d-etappe11-abnahme.md`.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei. Protokolle und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**.
- Keine Prozesssprache (Task, Ruling, Brief, Auftrag, Umsetzer, Controller, Ledger, Befunddatei, „laut Auftrag") in Texten, Beleglisten und Prüfeinträgen — auch nicht in den in diesem Plan neu geschriebenen Zellen.
- Branch `nachfuehrung-4d` (von `master` nach dem Plan-Commit), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Kein Code außer den zwei Kommentarzeilen in `src/data/texte/dateien.test.ts` (Task 3). Keine neue Abhängigkeit, kein neuer Katalogeintrag (`simon-2018` steht schon in `src/data/literatur.ts`).
- EN-Formeln mit `.` statt `{,}` als Dezimalzeichen. Tausendertrennung wie im jeweiligen Text: DE schmales Leerzeichen bzw. normales Leerzeichen wie in der Nachbarschaft (`4 700`), EN Komma (`4,700`).
- Vor jedem Commit: `npx vitest run src/data/texte` grün und `git status --short` geprüft; nur gezielt `git add`. Vor „fertig" (Task 4): `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` und in den Projektstamm; Screenshots und Skripte vor dem Commit löschen. Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen). **Höchstens eine Prüfrunde je Task** (Jens, 20.09.2026): ein Umsetzer, eine Prüfung, eine Nacharbeit, dann Schluss; Restbefunde gehen ins Protokoll.
- Modelle nach Weisung von Jens: Task 1 und Task 4 sowie alle Prüfungen auf dem mittleren Modell, Task 2 und 3 (mechanisch) auf dem kleinsten; das stärkste nur nach zweimaligem Scheitern. Greift ein Kontingentlimit, weiter auf dem kleinsten Modell, im Protokoll §8 vermerken.
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-23-nachfuehrung-4d/progress.md` (git-ignoriert), am Ende gesammelt ins Protokoll.

## Prüfschwerpunkte

1. **Faktor 10 an einer zweiten Stelle übersehen:** Die falsche Zahl 0,026 steht in Text DE, Text EN, der Wertzelle und der Fundstellenzelle von Belegzeile Nr. 36 und in der Nacharbeitsnotiz über der Tabelle. Ein Leser der Belegliste erwartet, dass Zitat, Wert und Text übereinstimmen und dass die Notiz die frühere Fehllesung nicht weiter als richtig darstellt (Task 1 Schritt 4).
2. **Neue Zahl im Gymnasialtext widerspricht fachgeprüften Texten:** Die Spanne muss mit `objekt-earth` (Hochschule, „4415 bis 4928 km") und `szene-mondtanz` (Hochschule) übereinstimmen und darf `szene-mondtanz` (Gymnasium, „rund 4 700 km" als typischer Wert) nicht widersprechen (Task 1 Schritt 6).
3. **Mechanische Bereinigung ändert Tabellenform oder Aussage:** Eine Zelle zu viel, eine verlorene Nummer oder ein umformuliertes Prüfurteil („ok" wird „Hinweis") macht eine fachgeprüfte Belegliste falsch. Der Leser erwartet dieselben Zeilen, Nummern, Werte und Urteile wie vorher (Task 2/3: Zellenprüfskript vor und nach, Zeilenzahl je Datei gleich, Diff-Durchsicht der Prüfspalten).
4. **Verweise, die nach der Bereinigung ins Leere zeigen:** Ersetzt man „(Ruling 7)" ersatzlos, verliert der Leser die Information, dass eine Zahl aus einem fachgeprüften Text übernommen wurde. Ersetzungen müssen den Inhalt der alten Kurzverweise ausschreiben (Tabelle in Task 2).
5. **Wörtliche Zitate:** Zitate aus anderen versionierten Dateien (etwa Überschriften aus `ASSETS.md`) oder aus Quellen dürfen nicht verfälscht werden; nur Auslassung mit „…" ist zulässig (Task 2 Regel 6).

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Driftrate GRS; Schwerpunktabstand | `src/data/texte/{de,en}/hochschule/objekt-jupiter.md`, `docs/belege/hochschule/objekt-jupiter.md`, `src/data/texte/{de,en}/gymnasium/thema-modell.md` |
| 2 | Bereinigung Teil A (12 Beleglisten mit den meisten Treffern) | `docs/belege/hochschule/{objekt-enceladus,objekt-titan,objekt-ganymede,objekt-jupiter,thema-achsneigung,szene-titan-dunst,szene-phobos-tiefflug,szene-ringdurchflug,szene-galileisches-schattenspiel,szene-enceladus-hell,objekt-mars,objekt-europa}.md` |
| 3 | Bereinigung Teil B (übrige Beleglisten), drei `\|`, Verweis in `thema-ringe`, Testkommentare | alle übrigen Treffer unter `docs/belege/hochschule/`, `src/data/texte/dateien.test.ts` |
| 4 | Abnahme | `docs/nachfuehrung-4d-abnahme.md` |

**Zahlen:** Ausgangsstand `master` ce8cf95: 5150 Tests, Katalog 761 Einträge, Quellenkarten 91, Hauptchunk 1 453,78 kB (vor Task 1 mit `npm test` bestätigen). Soll nach jedem Task: unverändert 5150 Tests, 761 Katalogeinträge. Der Hauptchunk ändert sich nur um wenige Byte (Textdateien werden gebündelt).

## Gemeinsame Hilfsmittel für Task 2 bis 4

**Zellenprüfskript** (Scratchpad, nicht versionieren), Aufruf aus dem Projektstamm mit `PYTHONIOENCODING=utf-8 python <scratchpad>/zellen.py`. Es gibt jede Tabellenzeile aus, die nicht genau sechs Zellen hat oder deren Zelle 1 keine Nummer ist; Zellen trennt nur ein unmaskiertes `|`:

```python
import re, glob

TRENNER = re.compile(r'(?<!\\)\|')
for f in sorted(glob.glob('docs/belege/hochschule/*.md')):
    for i, l in enumerate(open(f, encoding='utf-8'), 1):
        l = l.rstrip('\n')
        if not l.startswith('|') or re.match(r'^\|[-| ]+\|$', l) or l.startswith('| Nr.'):
            continue
        z = TRENNER.split(l)[1:-1]
        if len(z) != 6 or not re.match(r'^\s*\d+[a-z]?\s*$', z[0]):
            print(f, i, len(z), z[0][:10])
```

Stand vor der Nachführung (ce8cf95) genau drei Ausgaben: `objekt-europa.md` Zeile 89 (Nr. 63, 9 Zellen), `objekt-io.md` Zeile 36 (Nr. 12, 8 Zellen), `szene-jupiter-vorbeiflug.md` Zeile 54 (Nr. 15, 8 Zellen). Soll nach Task 3: keine Ausgabe.

**Suche nach Prozesssprache** (Bash, Projektstamm):

```bash
P='\bTasks?\b|\btask-[0-9]|\bRulings?\b|\bruling\b|\bBrief(s|e)?\b|laut Auftrag|\bLedger|\bController|Umsetzer|Befunddatei|Nacharbeitsbericht|Prüfauftrag|\bAuftrag\b|Erstumsetzer|\.superpowers'
grep -rnE "$P" docs/belege/ src/data/texte/
```

Stand vor der Nachführung: rund 230 Treffer in 40 Dateien (`grep -rcE "$P" docs/belege/ src/data/texte/ | grep -v ':0$'` zählt je Datei). Soll nach Task 3: keine Treffer außer begründeten Fehltreffern, die im Bericht einzeln mit Datei, Zeile und Grund stehen (etwa „Auftrag" im Sinn eines Forschungs- oder Missionsauftrags in einem Quellenzitat).

**Zeilenzahlkontrolle je Datei:** vor dem Bearbeiten `wc -l docs/belege/hochschule/*.md > <scratchpad>/zeilen-vorher.txt`, danach vergleichen. Eine Tabellenzeile bleibt eine Zeile; in Fließtextabsätzen über der Tabelle darf sich der Umbruch ändern, dann nennt der Bericht die Datei.

---

### Task 1: Driftrate des Großen Roten Flecks und Schwerpunktabstand im Gymnasialtext

**Files:**
- Modify: `src/data/texte/de/hochschule/objekt-jupiter.md:116-117`
- Modify: `src/data/texte/en/hochschule/objekt-jupiter.md:112-113`
- Modify: `docs/belege/hochschule/objekt-jupiter.md` (Nacharbeitsnotiz Zeile 28–40, Tabellenzeile Nr. 36 in Dateizeile 80)
- Modify: `src/data/texte/de/gymnasium/thema-modell.md:35-36`
- Modify: `src/data/texte/en/gymnasium/thema-modell.md:32-33`

**Interfaces:** keine; Task 2 bearbeitet danach dieselbe Belegliste `objekt-jupiter.md` (nur Prozesssprache), deshalb Task 1 zuerst.

- [ ] **Step 1: Quelle selbst öffnen.** `curl -s https://api.crossref.org/works/10.3847/1538-3881/aaae01` und in der Zusammenfassung die Stelle „westward drift" lesen. Erwartet wörtlich: „Its westward drift rate (relative to System III W. longitude) has increased from ∼0.°26/day in the 1980s to ∼0.°36/day currently." Die AAS-Schreibweise `0.°26` bedeutet 0,26°. Plausibilität: `System II` läuft gegenüber `System III` um rund 0,27° je Tag zurück. Weicht der abgerufene Wortlaut ab, Arbeit anhalten und im Bericht melden.

- [ ] **Step 2: Text DE berichtigen.** In `src/data/texte/de/hochschule/objekt-jupiter.md` die Zeilen 116–117

```md
Westwärtsdrift gegenüber System III beschleunigte sich im selben Zeitraum von rund
$0{,}026^\circ$ auf rund $0{,}36^\circ$ je Tag, und seit 2014 verändern sich Farbe und innere
```

ersetzen durch (Zeile 118 „Zirkulation merklich …" bleibt):

```md
Westwärtsdrift gegenüber System III beschleunigte sich von rund $0{,}26^\circ$ je Tag in den
1980er-Jahren auf heute rund $0{,}36^\circ$ je Tag, und seit 2014 verändern sich Farbe und innere
```

„Im selben Zeitraum" entfällt, weil die Quelle „in the 1980s" mit „currently" vergleicht, nicht den Zeitraum 1995–2017 der Schrumpfungsraten (Ruling 3).

- [ ] **Step 3: Text EN berichtigen.** In `src/data/texte/en/hochschule/objekt-jupiter.md` die Zeile 113

```md
System III accelerated over the same period from about $0.026^\circ$ to about $0.36^\circ$ per day,
```

ersetzen durch

```md
System III accelerated from about $0.26^\circ$ per day in the 1980s to about $0.36^\circ$ per day today,
```

- [ ] **Step 4: Belegliste nachführen.** In `docs/belege/hochschule/objekt-jupiter.md`:
  - Tabellenzeile Nr. 36: Aussagezelle „Drift 1980er gegen aktuell" bleibt; Wertzelle `Drift $0{,}026°$/d → $0{,}36°$/d` → `Drift $0{,}26°$/d → $0{,}36°$/d`; in der Fundstellenzelle das falsch wiedergegebene Zitat „accelerated from roughly 0.026°/day in the 1980s to approximately 0.36°/day currently" durch den wörtlichen Wortlaut aus Step 1 ersetzen („Its westward drift rate (relative to System III W. longitude) has increased from ∼0.°26/day in the 1980s to ∼0.°36/day currently") mit dem Zusatz „(AAS-Schreibweise, 0.°26 = 0,26°)". Prüfspalte: `Fehler: …` durch `berichtigt (23.09.2026): Crossref-Zusammenfassung erneut geöffnet, wörtlich „∼0.°26/day in the 1980s"; Text DE und EN auf 0,26°/Tag berichtigt; die abgeleitete Zahl rund 130° je Jahr unter „Im Modell" nutzt nur den aktuellen Wert 0,36°/Tag und bleibt` ersetzen. Die Zelle darf kein unmaskiertes `|` enthalten.
  - Nacharbeitsnotiz über der Tabelle (Zeilen 28–40, Absatz „Nacharbeit nach der Fachprüfung (20.09.2026)"): Absatz stehen lassen, direkt danach einen neuen Absatz einfügen:

```md
**Berichtigung (23.09.2026):** Die Begründung im vorigen Absatz beruhte auf einer Fehllesung. Die
Crossref-Zusammenfassung lautet wörtlich „∼0.°26/day in the 1980s to ∼0.°36/day currently"; in der
AAS-Schreibweise steht das Gradzeichen vor den Nachkommastellen, 0.°26 bedeutet 0,26°. Der
Fachprüfer hatte recht. Text DE und EN und Zeile 36 sind auf 0,26°/Tag berichtigt.
```

- [ ] **Step 5: Weitere Fundstellen ausschließen.** `grep -rn "0,026\|0\.026" src/data/texte/ docs/belege/` — erwartet nur fremde Treffer (Mond-Exzentrizität 0,0266, Ceres-$J_2$, Librationsverhältnis 0,0261). Jeder Treffer mit Bezug zum Großen Roten Fleck wird mitberichtigt und im Bericht genannt.

- [ ] **Step 6: Schwerpunktabstand herleiten.** Maßstab sind die fachgeprüften Texte `src/data/texte/de/hochschule/objekt-earth.md` Zeile 250 („mit den Mondelementen des Modells 4415 bis 4928 km") und `src/data/texte/de/hochschule/szene-mondtanz.md` Zeile 93. Gegenprobe im Scratchpad: Abstand = $a(1\mp e)\cdot\mu/(1+\mu)$ mit $a$ und $e$ des Mondes aus `src/sim/moon.ts` (oder dem dort verwendeten Datensatz) und $\mu = M_\text{Mond}/M_\text{Erde}$ = 0,0123000371 (Wert aus dem Code nehmen, falls dort anders). Erwartet rund 4415 und 4928 km. Weicht die Gegenprobe um mehr als 5 km ab, Arbeit anhalten und melden (fachgeprüfte Zahlen werden nicht geändert).

- [ ] **Step 7: Gymnasialtext DE berichtigen.** `src/data/texte/de/gymnasium/thema-modell.md` Zeilen 35–36:

```md
- **Erde als Schwerpunkt:** Die Tabelle liefert den Erde-Mond-Schwerpunkt; der
  Erdmittelpunkt liegt je nach Mondabstand rund 4 400 bis 4 900 km daneben.
```

- [ ] **Step 8: Gymnasialtext EN berichtigen.** `src/data/texte/en/gymnasium/thema-modell.md` Zeilen 32–33:

```md
- **Earth as barycentre:** The table gives the Earth-Moon barycentre; depending on the
  Moon's distance, the Earth's centre lies about 4,400 to 4,900 km away from it.
```

- [ ] **Step 9: Bereits erledigte Gymnasialbefunde bestätigen, nicht ändern.** Die Gesamtabnahme führt drei weitere Gymnasialbefunde als offen; sie sind seit Commit `44b760c` (22.09.2026) behoben. Nur lesen und im Bericht mit Datei und Zeile bestätigen:
  - `src/data/texte/de/gymnasium/szene-uranus-gekippt.md` Z. 14 „2030", EN Z. 13 „2030"; `grep -rn "2028" src/data/texte/*/gymnasium/` ohne Uranus-Treffer.
  - `src/data/texte/{de,en}/gymnasium/objekt-miranda.md` Z. 11–13: „5 bis 10 km", „sechs bis acht Minuten" / „5 to 10 km", „six to eight minutes".
  - `src/data/texte/{de,en}/gymnasium/objekt-titania.md` und `objekt-oberon.md`: „Der Masse nach überwiegt das Gestein, dem Raum nach das Eis" / „rock dominates by mass … ice dominates by volume"; kein „etwa gleiche Anteile" mehr (`grep -rn "gleiche Anteile\|equal parts\|equal proportions" src/data/texte/`).

- [ ] **Step 10: Tests.** `npx vitest run src/data/texte` → grün. Wortzahlen der vier Textdateien vor und nach per `wc -w` in den Bericht.

- [ ] **Step 11: Commit.**

```bash
git add src/data/texte/de/hochschule/objekt-jupiter.md src/data/texte/en/hochschule/objekt-jupiter.md docs/belege/hochschule/objekt-jupiter.md src/data/texte/de/gymnasium/thema-modell.md src/data/texte/en/gymnasium/thema-modell.md
git commit -m "Nachführung: Driftrate des Großen Roten Flecks und Schwerpunktabstand im Gymnasialtext berichtigt"
```

Danach die Trailer-Kontrolle aus der lokalen Projektanleitung (Ergebnis 0).

**Prüfung (eine Runde):** Prüfer öffnet die Crossref-Zusammenfassung selbst, vergleicht Text DE/EN und Zeile Nr. 36 mit dem Wortlaut, rechnet die Spanne 4415–4928 km nach und prüft die Formulierung der beiden Gymnasialsätze auf Niveau und Übereinstimmung mit `szene-mondtanz` (Gymnasium). Er ändert keine Datei; Befunde gehen an die Nacharbeit.

---

### Task 2: Mechanische Bereinigung der Prozesssprache, Teil A

**Files:** Modify: die zwölf Beleglisten aus der Dateistruktur (Teil A). Keine anderen Dateien.

**Interfaces:** Consumes: Task 1 hat `objekt-jupiter.md` Nr. 36 und die Notiz neu geschrieben — diese Stellen enthalten keine Prozesssprache und bleiben unberührt.

**Regeln der Bereinigung** (gelten auch für Task 3):

1. Ersetzt wird nur der Kurzverweis, nie eine Aussage, ein Wert, eine Fundstelle oder ein Prüfurteil. Nummern, Zellenzahl und Reihenfolge der Zeilen bleiben.
2. Kurzverweise auf Rulings werden durch ihren Inhalt ersetzt. Bekannte Bedeutungen in den Beleglisten der Phase 4d:

| Alter Kurzverweis | Ersatz |
|---|---|
| „(Ruling 7)" / „(Ruling 8)" nach „Gleich `<datei>` …" | „(gleichlautend aus dem fachgeprüften Text übernommen)" |
| „Ruling 7, dort fachgeprüft" / „Ruling 8, gleichlautend übernommen" | „dort fachgeprüft, gleichlautend übernommen" |
| „ok (gleichlautend mit fachgeprüftem Text, Ruling 8)" | „ok (gleichlautend mit fachgeprüftem Text)" |
| „Ruling 16, keine Pflicht" (Quellenkarten) | „Quellenkarte ist ein Angebot, keine Pflicht" |
| „Ruling N" mit anderer Bedeutung | Bedeutung aus dem Satzzusammenhang ausschreiben; ist sie nicht erkennbar, die Klammer auf die übrige Aussage kürzen und die Stelle im Bericht nennen |

3. „Task N", „in diesem Task", „Task-Review", „Task-Brief", „Brief", „Briefs", „Auftrag" im Sinn des internen Arbeitsauftrags: durch „bei der Erstellung dieser Liste", „in der Recherche", „Ausgangspunkte der Recherche" oder „in einer früheren Fassung" ersetzen, je nachdem, was der Satz meint. Beispiel: „**Ausgangspunkte des Briefs, vor Verwendung geprüft:**" → „**Ausgangspunkte der Recherche, vor Verwendung geprüft:**"; „seit Task 5a" → „seit der Nacharbeit".
4. „Umsetzer", „Erstumsetzer" → „Erstfassung" bzw. „Verfasser"; „Controller", „wie vom Controller verlangt" → „bei der Abnahme" bzw. „wie verlangt"; „Ledger" und „Ledger-Eintrag" ersatzlos streichen, den Satz grammatisch schließen.
5. Verweise auf git-ignorierte Arbeitsdateien („Befunddatei `task-1-befunde.md`", `.superpowers/sdd/…/task-3-befunde.md`, `task-1-report.md`, „Nacharbeitsbericht") entfallen; der Befund selbst bleibt benannt: „Befund F1 der Fachprüfung", „Hinweis H2 der Fachprüfung".
6. Wörtliche Zitate aus anderen Dateien oder Quellen werden nicht umformuliert. Enthält ein Zitat Prozesssprache (etwa die Überschrift „Textur-Quelle: Solar System Scope (Ringtextur, Task 13)" aus `ASSETS.md`), wird nur der betroffene Teil durch „…" ausgelassen: „Textur-Quelle: Solar System Scope (Ringtextur …)".
7. „Fachprüfung", „Fachprüfer", „Nacharbeit", „Runde 1", „neu nach Fachprüfung" sind **keine** Prozesssprache im Sinn dieser Regel und bleiben.

- [ ] **Step 1: Ausgangsstand festhalten.** Zellenprüfskript laufen lassen (erwartet die drei bekannten Ausgaben), `wc -l` der Beleglisten ins Scratchpad, Suche nach Prozesssprache auf die zwölf Dateien beschränkt, Treffer je Datei notieren.
- [ ] **Step 2: Bereinigen.** Jede der zwölf Dateien nach den Regeln 1–7 bearbeiten, Treffer für Treffer (kein blindes `sed` über alle Dateien; ein `sed` für einen eindeutig gleichförmigen Ausdruck in einer Datei ist erlaubt, danach den Diff dieser Datei lesen).
- [ ] **Step 3: Kontrolle.** Zellenprüfskript: nur noch die Ausgabe `objekt-europa.md` Nr. 63 (Task 3 behebt sie; erscheint eine neue Ausgabe, ist Regel 1 verletzt). `wc -l` gleich dem Ausgangsstand (Abweichungen nur in Fließtextabsätzen, im Bericht nennen). Suche nach Prozesssprache über die zwölf Dateien: 0 Treffer oder begründete Fehltreffer. `git diff --word-diff docs/belege/ | grep -E '\[-(ok|Fehler|Hinweis|neu nach)'` → leer (kein Prüfurteil verändert).
- [ ] **Step 4: Tests.** `npx vitest run src/data/texte` → grün (Beleglisten sind nicht Teil der Tests; der Lauf sichert nur, dass nichts anderes berührt wurde).
- [ ] **Step 5: Commit.**

```bash
git add docs/belege/hochschule/objekt-enceladus.md docs/belege/hochschule/objekt-titan.md docs/belege/hochschule/objekt-ganymede.md docs/belege/hochschule/objekt-jupiter.md docs/belege/hochschule/thema-achsneigung.md docs/belege/hochschule/szene-titan-dunst.md docs/belege/hochschule/szene-phobos-tiefflug.md docs/belege/hochschule/szene-ringdurchflug.md docs/belege/hochschule/szene-galileisches-schattenspiel.md docs/belege/hochschule/szene-enceladus-hell.md docs/belege/hochschule/objekt-mars.md docs/belege/hochschule/objekt-europa.md
git commit -m "Beleglisten: interne Kurzverweise durch ihren Inhalt ersetzt (Teil 1)"
```

Danach die Trailer-Kontrolle (Ergebnis 0).

**Prüfung (eine Runde, mittleres Modell):** Prüfer liest `git diff HEAD~1 -- docs/belege/` vollständig, prüft jede Ersetzung gegen die Regeln, lässt Zellenprüfskript und Suche selbst laufen. Er ändert keine Datei.

---

### Task 3: Mechanische Bereinigung, Teil B, und Formbefunde

**Files:**
- Modify: alle übrigen Beleglisten mit Treffern der Suche nach Prozesssprache (Stand ce8cf95: `thema-finsternis`, `szene-jupiter-vorbeiflug`, `objekt-saturn`, `objekt-io`, `thema-gebundene-rotation`, `objekt-phobos`, `objekt-callisto`, `thema-ringe`, `szene-saturn-streiflicht`, `szene-saturn-ringkante`, `szene-erdaufgang`, `objekt-tethys`, `objekt-deimos`, `thema-innerer-aufbau`, `szene-mondtanz`, `objekt-mimas`, `thema-photometrie`, `thema-gezeiten`, `thema-entstehung`, `thema-bahnelemente`, `szene-merkurjagd`, `objekt-venus`, `objekt-titania`, `objekt-pluto`, `objekt-miranda`, `objekt-mercury`, `objekt-charon`; Liste mit der Suche bestätigen)
- Modify: `docs/belege/hochschule/objekt-europa.md` (Nr. 63), `objekt-io.md` (Nr. 12), `szene-jupiter-vorbeiflug.md` (Nr. 15), `thema-ringe.md` (Nr. 6)
- Modify: `src/data/texte/dateien.test.ts:117` und `:284` (nur Kommentare)

**Interfaces:** Consumes: Regeln 1–7 aus Task 2 (hier wiederholt gültig, dem Umsetzer den Regelblock aus Task 2 wörtlich mitgeben).

- [ ] **Step 1: Ausgangsstand festhalten** wie Task 2 Step 1, über alle Beleglisten.
- [ ] **Step 2: Bereinigen** nach den Regeln 1–7 aus Task 2.
- [ ] **Step 3: Drei unmaskierte `|`.** In den drei Zeilen (Nr. 63 in `objekt-europa.md`, Nr. 12 in `objekt-io.md`, Nr. 15 in `szene-jupiter-vorbeiflug.md`) jedes `|` innerhalb einer Zelle, das kein Zellentrenner ist (Betragsstriche oder Auslassungen in Prosa der Prüfspalte), als `\|` maskieren. Welche `|` Trenner sind, ergibt sich daraus, dass danach genau sechs Zellen bleiben und Zelle 6 das Prüfurteil enthält.
- [ ] **Step 4: Verweis in `thema-ringe`.** Tabellenzeile Nr. 6 (A-Ring, Dateizeile 36): „siehe Zeile 60 unten" → „siehe Zeile 61 unten". Vorher bestätigen: Nr. 61 ist die Zeile „Im Modell: Saturns Ring … 136 780 km", Nr. 60 die Quaoar-Frage.
- [ ] **Step 5: Testkommentare.** `src/data/texte/dateien.test.ts` Zeile 116–117: „(Nachtrag Entwurf §5.5, Plan-Ruling 3)" → „(Nachtrag Entwurf §5.5)"; Zeile 284: „Entwurf §5.5 und Plan-Ruling 3 fordern" → „Entwurf §5.5 fordert" (Verb angleichen, sonst nichts ändern).
- [ ] **Step 6: Kontrolle.** Zellenprüfskript: **keine Ausgabe**. Suche nach Prozesssprache über `docs/belege/` und `src/data/texte/`: 0 Treffer oder begründete Fehltreffer (einzeln im Bericht). `wc -l` wie in Task 2. Prüfurteil-Kontrolle per `git diff --word-diff` wie in Task 2.
- [ ] **Step 7: Tests.** `npx vitest run src/data/texte` → grün; `npm run lint` → ohne Fehler (Kommentare in einer `.ts`-Datei).
- [ ] **Step 8: Commit.** Nur die geänderten Dateien einzeln `git add`en (Liste aus `git status --short`), dann:

```bash
git commit -m "Beleglisten: interne Kurzverweise ersetzt (Teil 2), Tabellenform und Zeilenverweis berichtigt"
```

Danach die Trailer-Kontrolle (Ergebnis 0).

**Prüfung (eine Runde, mittleres Modell):** wie Task 2, zusätzlich die drei maskierten Zeilen und den Zeilenverweis.

---

### Task 4: Abnahme

**Files:** Create: `docs/nachfuehrung-4d-abnahme.md`

- [ ] **Step 1: Gesamtprüfung.** `npm run lint`, `npm test` (Soll 5150), `npm run build` (Hauptchunk notieren). Zellenprüfskript (keine Ausgabe), Suche nach Prozesssprache (Ergebnis wie Task 3), `grep -c "id: '" src/data/literatur.ts` (Soll 761).
- [ ] **Step 2: DOM-Stichprobe.** Vite-Server prüfen (nicht neu starten), `http://localhost:5173/Orrery/` laden, Qualitätsstufe setzen, Niveau Hochschule, Jupiter wählen (`window.store.getState()` zeigt die Setter; Auswahl per Store oder Objektbaum), Infopanel auf den Kopfwechsel pollen, dann per `browser_evaluate` im Panel-Text nach „0,26" und „0,36" im Absatz zum Großen Roten Fleck suchen und das Fehlen von „0,026" bestätigen. Dasselbe für die englische Oberfläche. Danach Gymnasium, Thema „Grenzen des Modells": Satz mit „4 400 bis 4 900 km" vorhanden. Keine Screenshots nötig; die gemessenen Textausschnitte ins Protokoll.
- [ ] **Step 3: Protokoll schreiben** nach der Form von `docs/phase4d-etappe11-abnahme.md`, kurz: §1 Umfang (Commits mit Hash), §2 Prüfergebnisse (Ausgaben aus Step 1 und 2), §3 Zahlen (Tests, Katalog, Hauptchunk, Wortzahlen der geänderten Texte), §4 Richtigstellung zur Gesamtabnahme (drei Gymnasialbefunde waren seit `44b760c` behoben, Belege aus Task 1 Step 9), §6 Rulings, §7 Unschärfen (Restbefunde der Prüfungen, begründete Fehltreffer), §8 Fragen an Jens (Push, Kontingentlimits falls aufgetreten). Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung.
- [ ] **Step 4: Commit.**

```bash
git add docs/nachfuehrung-4d-abnahme.md
git commit -m "Abnahme Nachführung nach Phase 4d"
```

Trailer-Kontrolle und Baumkontrolle aus der lokalen Projektanleitung (beide Ergebnis 0/leer). Danach Fast-Forward nach `master`, Branch löschen. **Push erst nach Jens' Ja.**

---

## Rulings

1. **Drei Gymnasialbefunde bereits erledigt:** Uranus-Sonnenwende, Verona-Rupes-Höhe und Titania/Oberon-Anteile wurden schon mit `44b760c` (22.09.2026) berichtigt; die Gesamtabnahme führt sie irrtümlich als offen. Sie werden in Task 1 nur bestätigt, nicht erneut geändert; die Richtigstellung steht im neuen Protokoll, die Gesamtabnahme selbst bleibt unverändert.
2. **Fachgeprüfter Hochschultext wird geändert:** `objekt-jupiter` ist fachgeprüft. Die Regel „fachgeprüfte Texte werden nicht geändert" gilt für spätere Etappen ohne Entscheidung; hier liegt die ausdrückliche Entscheidung vom 23.09.2026 (Punkt 2) vor.
3. **„Im selben Zeitraum" entfällt** in DE und EN: Die Quelle vergleicht die 1980er-Jahre mit „currently", nicht den Zeitraum 1995–2017 der Schrumpfungsraten.
4. **Belegliste `objekt-neptune.md` Nr. 57** („Fehler" nach Behebung nie auf „ok" gestellt) bleibt unverändert: nicht Teil der Entscheidung, Prüfeinträge bleiben inhaltlich unverändert (Entscheidung Punkt 4).
5. **Zeilenverweis in `thema-ringe` Nr. 6** wird mitberichtigt, weil Task 3 die Datei ohnehin berührt (4d-6: „bei nächster inhaltlicher Berührung").
6. **Testkommentare in `dateien.test.ts`** gehören zum Sammelbefund (2 der 129 Treffer) und werden in Task 3 bereinigt.
7. **Suchmuster breiter als 2026-09-22:** Die Suche umfasst auch „Umsetzer", „Controller", „Befunddatei" und Pfade unter `.superpowers`; sie findet deshalb mehr als die 129 Treffer der Etappe 4d-7. Maßgeblich ist das Ergebnis dieser Suche.
8. **Aufteilung in zwei Bereinigungs-Tasks** nach Trefferzahl, damit jeder auf dem kleinsten Modell in einer Sitzung fertig wird.
9. **Keine Gesamtabnahme-Nachträge:** `docs/phase4d-abnahme.md` bleibt als Protokoll des Abschlusses unverändert.
