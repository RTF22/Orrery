# Phase 4d Hochschule, Etappe 4 „Innere Planeten" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Merkur, Venus, Mars, Phobos und Deimos sowie die Szenen `merkurjagd` und `phobos-tiefflug` haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung (Entwurf §7, Zeile 4d-4, 14 Dateien). Vorher räumt Task 1 die Formfragen aus §8 der Abnahme 4d-3 ab (Vorabdruck-Einträge, Konjunktion, Kommentarzeile, Katalogmuster für laufend gepflegte Seiten). Danach **Halt** für die Freigabe von Etappe 4d-5.

**Architektur:** Task 1 ist ein kleiner Daten- und Kommentar-Task mit Test. Task 2 bis 7 sind die Texte, **nicht wörtlich im Plan**: Der Umsetzer liest den Code, recherchiert, schreibt und belegt nach Entwurf §6.4; eine Fachprüfung mit frischem Kontext prüft **einmal**, danach folgt **eine** Nacharbeit (Regel von Jens vom 20.09.2026, Ruling 3). Alle Verweisziele der Etappe haben Gymnasialtexte (Ersatz nach Entwurf §5.5 Punkt 6), deshalb setzt jeder Text-Task seine Verweise selbst. Task 8 ist die Abnahme nach Entwurf §8.2.

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §4.1 (Katalog), §5 (Gestalt der Texte: §5.1 Gliederung für Körper und Szenen, §5.2 Stand und Richtwerte), §6 (Arbeitsweise), §7 Zeile 4d-4, §8.2 (Abnahme). Vorlagen: Plan `docs/superpowers/plans/2026-09-19-phase4d-hochschule-etappe3.md` (Text-Tasks, Abnahme), Abnahme `docs/phase4d-etappe3-abnahme.md` (§8 mit den hier entschiedenen Fragen) und die fachgeprüften Hochschultexte unter `src/data/texte/de/hochschule/` samt Beleglisten unter `docs/belege/hochschule/`. Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und in Originaltiteln des Literaturkatalogs.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben). Protokolle, Berichte in versionierten Dateien und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**.
- Branch `hochschule-4` (von `master`), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test in `literatur.test.ts`) und steht alphabetisch nach Kennung (Test).
- Keine neue Abhängigkeit in `package.json`. Kein Code außerhalb von Task 1 und etwaigen Zwischen-Tasks für neue TeX-Befehle; Befunde am Simulationscode, die ein Text aufdeckt, beschreibt der Text in „Im Modell" beziehungsweise „Modellgrenzen" und der Bericht meldet sie (Ruling 7).
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben (`'\\sin E'`).
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Namen beziehungsweise Titel aus `ui/i18n` (Körper `body.<id>.name`, Szenen „Szene: " / „Scene: " vor `scene.<id>` wie in den Gymnasialfassungen); Körper und Szenen mit den festen `##`-Überschriften aus Entwurf §5.1 in dieser Reihenfolge, Pflichtabschnitte nie weglassen; Hochschultexte enden mit `*Stand: September 2026*` beziehungsweise `*As of September 2026*` als eigenem Absatz (Monat und Jahr des Commits, mit dem der Text fertig wird); `literatur:` nur in Hochschultexten. Richtwerte ohne Testgrenze (Entwurf §5.2): große Körper 1500 bis 3500 Wörter je Fassung, kleine Monde 600 bis 1000, Szenen 300 bis 900; Richtigkeit geht vor Wortzahl, aber die Richtwerte steuern die Tiefe: kein Text dieser Etappe soll den oberen Richtwert um mehr als ein Drittel überschreiten (in 4d-3 lagen fünf von sechs Texten darüber, Abnahme 4d-3 §8).
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten. Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen); Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste.
- **Höchstens eine Prüfrunde je Text** (Jens, 20.09.2026): ein Umsetzer, eine Fachprüfung, eine Nacharbeit, dann Schluss. Keine Nachprüfung, keine zweite Nacharbeit. Was danach offen bleibt, steht im Abnahmeprotokoll (§7 Unschärfen, §8 Fragen). Wesentlich sind technische Funktionsfähigkeit (Tests grün, keine Formelfehler, Verweise führen zum Ziel) und der Verweis auf existierende, geöffnete Literatur.
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-20-phase4d-hochschule-etappe4/progress.md` (git-ignoriert), am Ende gesammelt ins Abnahmeprotokoll.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Formnachträge aus §8 der Abnahme 4d-3 | `src/data/literatur.ts`, `src/data/literatur.test.ts`, `scripts/pruefe-literatur.ts`, Entwurf §4.1 (Nachtrag) |
| 2 | Körper `mercury` | 2 Texte, `docs/belege/hochschule/objekt-mercury.md`, `src/data/literatur.ts` |
| 3 | Szene `merkurjagd` | 2 Texte, `docs/belege/hochschule/szene-merkurjagd.md`, `src/data/literatur.ts` |
| 4 | Körper `venus` | 2 Texte, `docs/belege/hochschule/objekt-venus.md`, `src/data/literatur.ts` |
| 5 | Körper `mars` | 2 Texte, `docs/belege/hochschule/objekt-mars.md`, `src/data/literatur.ts` |
| 6 | Körper `phobos` und `deimos` | 4 Texte, `docs/belege/hochschule/objekt-phobos.md`, `docs/belege/hochschule/objekt-deimos.md`, `src/data/literatur.ts` |
| 7 | Szene `phobos-tiefflug` | 2 Texte, `docs/belege/hochschule/szene-phobos-tiefflug.md`, `src/data/literatur.ts` |
| 8 | Abnahme | `docs/phase4d-etappe4-abnahme.md`, `README.md` |

Texte liegen unter `src/data/texte/<de|en>/hochschule/<art>-<kennung>.md`.

**Testzahlen:** Ausgangsstand `master` 512ad5b (Abnahme 4d-3): 3969 Tests. Im Dateitest `src/data/texte/dateien.test.ts` erzeugt ein Hochschultext eines Körpers oder einer Szene 11 Fälle. Soll: 3969 + 1 (Task 1) + 2 × 11 (Merkur) + 2 × 11 (Merkurjagd) + 2 × 11 (Venus) + 2 × 11 (Mars) + 4 × 11 (Phobos, Deimos) + 2 × 11 (Phobos-Tiefflug) = **4124**, zuzüglich Tests aus Zwischen-Tasks für neue TeX-Befehle. Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test`. Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

### Task 1: Formnachträge aus §8 der Abnahme 4d-3

**Dateien:**
- Ändern: `src/data/literatur.ts` (Einträge `mallama-2021`, `proudfoot-2026`, `chapront-touze-1988`)
- Ändern: `src/data/literatur.test.ts` (neuer Testfall im `describe('Literaturkatalog (Entwurf 4d §4.4)')`)
- Ändern: `scripts/pruefe-literatur.ts` (Kopfkommentar Zeile 8 bis 10)
- Ändern: `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` (Nachtrag in §4.1 nach dem Nachtrag „4d-2, Ruling Jens, 18.09.2026" zu Körperschaften)

**Schnittstellen:**
- Konsumiert: `LITERATUR`, `istPreprint` aus `src/data/literatur.ts`; `t('literatur.preprint')` in `src/ui/info/Literaturkarten.tsx:54` hängt bei Vorabdrucken „· Vorabdruck" / „· Preprint" an.
- Produziert: die Regel „Vorabdruck-Einträge tragen `erschienen: 'arXiv'`" als Test; alle Text-Tasks dieser Etappe halten sie ein.

**Hintergrund:** Abnahme 4d-3 §8 („Weitere Fragen aus der Schlussprüfung" und „Katalogform-Frage"), hier per Ruling 6 wie vorgeschlagen entschieden: (a) `mallama-2021` und `proudfoot-2026` tragen im sprachunabhängigen Feld `erschienen` das deutsche „arXiv-Vorabdruck", die englische Karte liest sich „arXiv-Vorabdruck 2112.08966 · Preprint"; (b) `chapront-touze-1988` nutzt als einziger Eintrag „and" als Konjunktion; (c) `scripts/pruefe-literatur.ts:9` ist 117 Zeichen lang; (d) laufend gepflegte Seiten ohne Erscheinungsdatum tragen das Zugriffsjahr (`usno-2026`, `silso-2026`, `bipm-2026`) — als Muster in den Entwurf.

- [ ] **Schritt 1: Test schreiben**

In `src/data/literatur.test.ts` im Block `describe('Literaturkatalog (Entwurf 4d §4.4)')` nach dem Fall „lässt Personennamen und Körperschaften als Autorfeld zu" anfügen:

```ts
  it('nennt bei Vorabdrucken im sprachunabhängigen Feld erschienen nur „arXiv" (Abnahme 4d-3 §8)', () => {
    for (const p of LITERATUR.filter(istPreprint)) {
      expect(p.erschienen, p.id).toBe('arXiv');
    }
  });
```

- [ ] **Schritt 2: Test scheitern sehen**

Run: `npx vitest run src/data/literatur.test.ts`
Expected: FAIL mit `mallama-2021` (erwartet `'arXiv'`, erhalten `'arXiv-Vorabdruck 2112.08966'`).

- [ ] **Schritt 3: Vorabdruck-Einträge prüfen und ändern**

Zuerst für `proudfoot-2026` bei Crossref nachsehen, ob die Arbeit inzwischen erschienen ist (Aufruf `https://api.crossref.org/works?query.bibliographic=Trans-Neptunian+Binary+Mutual+Events+2020s+2030s&rows=3`). Ist sie erschienen: `doi` eintragen, `erschienen` mit Zeitschrift, Band und Artikelnummer, `arxiv` bleibt; der Eintrag ist dann kein Vorabdruck mehr. Sonst wie bei `mallama-2021`:

```ts
    erschienen: 'arXiv',
```

Die arXiv-Nummer steht weiter im Feld `arxiv` und auf der Karte im Link. Der Zusatz „angenommen bei The Astrophysical Journal Letters" entfällt (Ruling 6: das sprachunabhängige Feld trägt keinen deutschen Text; der Status steht auf der verlinkten arXiv-Seite).

In `chapront-touze-1988`:

```ts
    erschienen: 'CDS catalogue VI/79, Strasbourg; Astronomy and Astrophysics 124, 50 (1983) und 190, 342 (1988)',
```

- [ ] **Schritt 4: Test bestehen sehen**

Run: `npx vitest run src/data/literatur.test.ts` → PASS.
Run: `npm run literatur:pruefen -- --nur mallama-2021,proudfoot-2026,chapront-touze-1988` → 0 Fehler (Schlusszeile in den Bericht).

- [ ] **Schritt 5: Kommentarzeile umbrechen**

In `scripts/pruefe-literatur.ts` die Zeilen 8 bis 12 des Kopfkommentars auf rund 78 Zeichen je Zeile umbrechen, ohne den Wortlaut zu ändern:

```ts
 * Braucht Netz, läuft nur von Hand, nicht in npm test. Abfragen nacheinander
 * mit Pause (nach arXiv drei Sekunden, sonst 200 ms), ohne E-Mail-Adresse im
 * Abruf. Vorübergehende Serverfehler (502, 503, 504) und Zeitüberschreitungen
 * wiederholt es bis zu zweimal nach 2 s und 5 s. Exit-Code 1 bei mindestens
 * einem Fehler; Warnungen allein ergeben 0. Die Vergleiche stehen getestet in
 * literaturVergleich.ts.
```

- [ ] **Schritt 6: Nachtrag im Entwurf**

In `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` §4.1 nach dem Nachtrag zu Körperschaften anfügen:

```md
**Nachtrag (4d-4):** Ein Vorabdruck (Eintrag mit `arxiv`, ohne `doi`) trägt im
sprachunabhängigen Feld `erschienen` nur `'arXiv'`; die Karte hängt „Vorabdruck"
beziehungsweise „Preprint" in der Sprache der Oberfläche an, die Nummer steht im Feld `arxiv`
(Test in `literatur.test.ts`). Laufend gepflegte Seiten ohne Erscheinungsdatum (etwa
`usno-2026`, `silso-2026`) tragen als `jahr` das Zugriffsjahr, die Kennung folgt ihm. Beides
entschieden nach Abnahme 4d-3 §8.
```

- [ ] **Schritt 7: Tests, Lint, Typprüfung**

Run: `npx vitest run src/data src/ui/info` → PASS. `npx tsc -b` → ohne Ausgabe. `npm run lint` → ohne Befund. `npm test` → 3970.

- [ ] **Schritt 8: Commit**

```bash
git add src/data/literatur.ts src/data/literatur.test.ts scripts/pruefe-literatur.ts docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md
git commit -m "Literaturkatalog: Vorabdrucke einheitlich als arXiv, Formnachträge aus der Abnahme 4d-3"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Gemeinsame Vorgaben für Task 2 bis 7 (Texte)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den fachgeprüften Hochschultexten als Maßstab für Tiefe, Ton und Belegdichte: `objekt-earth` und `objekt-moon` für Körper (für die kleinen Monde Phobos und Deimos gilt der kürzere Richtwert, Gliederung wie beim Mond), `szene-mondfinsternis` und `szene-mondtanz` für Szenen. Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang.

**Ablauf je Task**

1. **Vorlage lesen:** den passenden fachgeprüften Text (siehe oben) in beiden Fassungen und seine Belegliste unter `docs/belege/hochschule/` (Form der Belegliste, Abschnitt „Im Modell" beziehungsweise „Modellgrenzen"). Dazu den Gymnasialtext derselben Kennung, damit der Hochschultext ihm nicht widerspricht; findet der Umsetzer im Gymnasialtext einen sachlichen Fehler, meldet er ihn im Bericht (nicht ändern).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (Vite-SSR aus dem Projektverzeichnis oder Node mit Typentfernung, nicht versioniert). Werte des Datenblocks aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten.
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf: zuerst nach neueren Übersichtsartikeln und Missionsergebnissen suchen, auch wenn der Stoff bekannt scheint; Übersichtsartikel, Missionsauswertungen, IAU-/JPL-Berichte. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, Band, Seite und DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren. Einträge, die schon im Katalog stehen (`src/data/literatur.ts`), wiederverwenden statt doppelt anlegen; ihr Inhalt wird trotzdem für jede neue Aussage geöffnet.
4. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" leer:

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile; „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" (folgt aus Definitionen oder genannten Werten) oder „Nachrechnung am Code: <Datei>". Senkrechte Striche in Zellen als `\|` maskieren (jede Zeile hat genau sechs Zellen). Querverweise zwischen Zeilen („siehe Nr. 12") nach jeder Neunummerierung prüfen.
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`; Körperschaften als Autor wie bei `cgpm-2022`. `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer; Vorabdrucke `erschienen: 'arXiv'` (Task 1). DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test „zitiert jeden Eintrag des Literaturkatalogs mindestens einmal"). Kennungen gleicher Erstautoren und Jahre mit Buchstaben unterscheiden (`nesvorny-2018a`). Laufend gepflegte Seiten ohne Erscheinungsdatum tragen das Zugriffsjahr.
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen.
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile und Gliederung nach den Globalen Randbedingungen und Entwurf §5.1. Körper: `## Kenngrößen und Messung`, `## Inneres`, `## Oberfläche`, `## Atmosphäre und Magnetosphäre`, `## Bahn, Rotation und Dynamik`, `## Entstehung und Entwicklung`, `## Offene Fragen`, `## Im Modell` (englisch `Parameters and measurement`, `Interior`, `Surface`, `Atmosphere and magnetosphere`, `Orbit, rotation and dynamics`, `Formation and evolution`, `Open questions`, `In the model`). Szenen: `## Was das Bild zeigt`, `## Hintergrund`, `## Modellgrenzen` (englisch `What the view shows`, `Background`, `Model limitations`).
   - „Im Modell" beziehungsweise „Modellgrenzen": was Orrery zur Kennung rechnet oder bewusst weglässt, mit Verweis `thema:modell`; jede Abweichung des Modells von der Wirklichkeit mit Größenordnung; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung. Nur beschreiben, was der Code zum Zeitpunkt des Tasks tut; Zahlen selbst nachrechnen. Stehen dieselben Modellzahlen schon in einem fachgeprüften Text (etwa `thema-gebundene-rotation` für Merkur, `thema-photometrie` für die Albedos, `objekt-earth` für die Bahnelemente-Tafel), dieselben Werte verwenden oder die Abweichung im Bericht begründen (Ruling 8).
   - „Offene Fragen": Streitfragen mit Belegen für beide Seiten, nicht entschieden, solange die Fachwelt es nicht getan hat.
   - Schluss `*Stand: <Monat> 2026*` / `*As of <Month> 2026*` (Monat des Commits).
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit allen Nachträgen): Argumente von `^`, `_`, `\frac` mit mehr als einem Zeichen in `{}` (`\frac{1}{2}`, nicht `\frac12`); `\text{…}` ohne verschachtelte Klammern und in beiden Fassungen **gleich**; Dezimalkomma in deutschen Formeln als `{,}`, in englischen `.`; Funktionsnamen `\sin`, `\cos` … als Befehl. Fehlt ein Befehl, ist das ein eigener Zwischen-Task (Test in `texUebersetzer.test.ts`, eigener Commit), kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen „25 770", Englisch Komma „25,770"), vierstellige Zahlen ohne Trennung. Zahlenspannen sagen, wofür sie gelten (Lehre aus 4d-3).
   - Kein `$` außerhalb von Formeln (Dateitest); kein `|` am Absatzanfang außer in Tabellen.
8. **Verweise:** `objekt:`, `szene:`, `thema:` auf Kennungen aus `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts`; Ziele ohne Hochschultext sind erlaubt, wenn sie einen Gymnasialtext haben (Ersatz, Entwurf §5.5 Punkt 6). Hochschultexte gibt es für `earth`, `moon`, `sun`, die Themen `bahnelemente`, `bezugssysteme`, `entstehung`, `finsternis`, `gebundene-rotation`, `gezeiten`, `innerer-aufbau`, `photometrie`, `resonanzen` und die Szenen `erdaufgang`, `mondfinsternis`, `mondtanz`; dazu die in dieser Etappe vorher fertigen Texte. Höchstens ein Verweis je Ziel je `##`-Abschnitt; kein Verweis eines Texts auf sich selbst. Jeder `quelle:`-Verweis braucht eine Karte zur Kennung des Texts (`fuer` in `src/data/quellen.ts`; der Task nennt die vorhandenen Karten, neue Karten nur mit Ruling und Eintrag in `quellen.ts` samt Abdeckungstest).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht.
10. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen (Commit-Text im Task). Vorher `git status --short`: keine Reste aus Skripten im Quellbaum.
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten. **Genau eine** Fachprüfung je Text.
12. **Nacharbeit (genau eine):** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise (Aussage ungenau oder missverständlich, Beleg stützt nicht wörtlich, Fassungen weichen im Sinn ab, fehlende Belegzeilen) behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger; in der Nacharbeit wird **nicht gekürzt** (Kürzen und Berichtigen gehören nicht in dieselbe Runde, Lehre aus 4d-3 Task 7). In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung`; alle anderen Prüfeinträge bleiben. **Keine Nachprüfung:** Was der Umsetzer in der Nacharbeit nicht beheben kann oder anders sieht als der Prüfer, notiert er mit Begründung im Ledger; die Abnahme führt es in §7 oder §8 auf.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste <art>-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/<datei>` und `src/data/texte/en/hochschule/<datei>` mit der Belegliste `docs/belege/hochschule/<datei>` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder Crossref, arXiv, ADS), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Kommentare im Code sind kein Beleg; rechne Aussagen über das Modell am Code selbst nach (Skripte nur im Scratchpad). Es gibt nur diese eine Prüfrunde: Konzentriere dich auf Fehler, die die Aussage falsch machen, und auf Belege, die die Aussage nicht stützen; Stil und Umfang nur, wenn sie das Verständnis behindern. Prüfe:
> 1. Stützt die zitierte Arbeit die Aussage im Text?
> 2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle?
> 3. Passen Aussagen über Orrery zum Code (`src/data/`, `src/sim/`, `src/render/`, `src/ui/info/datenzeilen.ts`), und erklärt „Im Modell" beziehungsweise „Modellgrenzen" jede Abweichung, auch gegenüber dem Datenblock?
> 4. Stimmen Dimensionen und Größenordnungen der Formeln?
> 5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?
> 6. Sind Streitfragen als solche dargestellt, mit Belegen für beide Seiten?
> 7. Widerspricht der Text einem fachgeprüften Hochschultext (`src/data/texte/de/hochschule/`) in Zahlen oder Aussagen über das Modell?
>
> Trage je Zeile der Belegliste in „Prüfung" ein: `ok (…)`, `Fehler: …` oder `Hinweis: …`, jeweils sobald die Zeile fertig ist. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte, keinen Code, keinen anderen Teil der Belegliste; kein Commit, kein Browser, keine Subagenten. Schreibe die Befundliste fortlaufend nach `<Befunddatei>` (Klasse Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich, Widerspruch zu einem fachgeprüften Text; Hinweis: Ton, Vollständigkeit, besserer Beleg; je Befund Fundstelle Datei:Zeile beider Fassungen). Rückgabe höchstens 12 Zeilen: Zählung ok/Fehler/Hinweis, Fehler als Einzeiler, Pfad der Befunddatei.

---

### Task 2: Körper `mercury`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-mercury.md`, `src/data/texte/en/hochschule/objekt-mercury.md`, `docs/belege/hochschule/objekt-mercury.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Regel für Vorabdrucke); fachgeprüfter Text `thema-gebundene-rotation` (Abschnitt „Im Modell" mit der Modelltabelle: Merkur, Verhältnis Rotation zu Umlauf, die beiden Winkel als Momentaufnahmen; Ruling 8).
- Produziert: Hochschultext `objekt:mercury`; Task 3 übernimmt seine Modellzahlen (Umlaufzeit des Datensatzes, Periheldrehung, Rotation).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Merkur` / `# Mercury`. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radius und Masse aus MESSENGER-Bahnverfolgung; Schwerefeld (C₂₀, C₂₂), Trägheitsmomentfaktor, Libration in Länge und Schiefe aus Radar und Laserhöhenmessung; Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren und Beleg. Inneres: großer, teilweise flüssiger Kern mit festem innerem Kern, dünner Mantel, Kruste; Dichte und Eisenanteil. Oberfläche: Krater, Ebenen, Lobenkämme und globale Kontraktion, Hohlformen (hollows), Eis in Polkratern (Radar und Neutronen), Zusammensetzung (K/Th, Schwefel). Atmosphäre und Magnetosphäre: Exosphäre (Natrium, Kalium, Kalzium), Magnetfeld mit nördlichem Versatz des Dipols, kleine Magnetosphäre im Sonnenwind. Bahn, Rotation und Dynamik: Exzentrizität und Neigung, Periheldrehung samt relativistischem Anteil, 3:2-Spin-Bahn-Resonanz mit Verweis auf `thema:gebundene-rotation` (dort die Einfang-Dynamik; hier nicht wiederholen), Sonnentag von 176 Tagen, Cassini-Zustand und Schiefe, Transits vor der Sonne. Entstehung und Entwicklung: Erklärungen des hohen Eisenanteils (Riesenstoß, Verdampfung, Kondensationsfront) mit Belegen, thermische Entwicklung und Kontraktion, BepiColombo als laufende Mission.
- `## Offene Fragen` (Pflicht): etwa Ursache des Eisenanteils, Herkunft des Polareises, Größe des festen inneren Kerns, Alter der Hohlformen — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: mittlere Bahnelemente der JPL-Tafel 1800–2050, linear fortgeschrieben (Datensatz `src/data/bodies/mercury.ts`; `lpDot` 0,16047689°/Jh — am Code nachrechnen, welche Periheldrehung in Bogensekunden je Jahrhundert das gegen die feste Ekliptik J2000 ergibt, und was davon Planetenstörungen und was der relativistische Anteil ist; beschreiben, dass der Datensatz die beobachtete Gesamtdrehung enthält, nicht nur die Newtonsche); Rotationsperiode `rotationPeriodH` 1407,6 h gegen die Umlaufzeit des Datensatzes (Verhältnis wie in `thema-gebundene-rotation`), Pol aus dem Datensatz gegen den IAU-Wert (Archinal et al. 2018), `rotationAtEpochDeg` 0 gegen W₀; keine Libration in Länge; Albedo 0,142 als geometrische Albedo und Albedo-Modell (Verweis `thema:photometrie`; Zahlen wie dort); Datenblockwerte gegen Messwerte; Maßstab (`sizeScale`, `scaledRadius`).
- Code lesen: `src/data/bodies/mercury.ts`, `src/sim/orbit.ts` (`elementsAt`, `positionAt`, `rotationAt`, `umlaufzeitTage`, `achsneigungDeg`), `src/sim/scale.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, Hochschultext `thema-gebundene-rotation` (Abschnitt „Im Modell"), Hochschultext `thema-photometrie` (Merkur-Zeilen).
- Verweise: `objekt:sun`, `objekt:venus`, `objekt:earth`, `objekt:moon`, `thema:gebundene-rotation`, `thema:resonanzen`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:bezugssysteme`, `thema:bahnelemente`, `thema:finsternis`, `thema:entstehung`, `szene:merkurjagd`, `thema:modell`; Karten zu `objekt:mercury`: `quelle:nssdc-mercury`, `quelle:nasa-mercury`, `quelle:nasa-messenger` (vollständige Liste über `fuer` in `src/data/quellen.ts` prüfen).
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Genova et al. 2019 (`genova-2019`, fester innerer Kern); Margot et al. 2007 (`margot-2007`) und 2012 (`margot-2012`); Stark et al. 2015 (`stark-2015`); Archinal et al. 2018 (`archinal-2018`); Smith et al. 2012, Schwerefeld aus MESSENGER (*Science* 336, 214); Hauck et al. 2013, innerer Aufbau (*Journal of Geophysical Research: Planets* 118, 1204); Anderson et al. 2012, Magnetfeld (*Science* 336, 213); Byrne et al. 2014, Kontraktion (*Nature Geoscience* 7, 301); Lawrence et al. 2013, Polareis (*Science* 339, 292); Blewett et al. 2011, Hohlformen (*Science* 333, 1856); Peplowski et al. 2011, K/Th (*Science* 333, 1850); Park et al. 2017, Periheldrehung aus MESSENGER-Entfernungen (*Astronomical Journal* 153, 121); Will 2014, *Living Reviews in Relativity* 17, 4; Correia und Laskar 2004 (`correia-2004`); Benkhoff et al. 2021, BepiColombo (*Space Science Reviews* 217, 90); Kapitel aus *Mercury: The View after MESSENGER* (Cambridge University Press 2018); Mallama et al. 2017 (`mallama-2017`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Periheldrehung und Rotationsverhältnis im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test`; Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-mercury.md src/data/texte/en/hochschule/objekt-mercury.md docs/belege/hochschule/objekt-mercury.md src/data/literatur.ts
git commit -m "Hochschultext Merkur mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit (Gemeinsame Vorgaben 11 bis 13).

---

### Task 3: Szene `merkurjagd`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-merkurjagd.md`, `src/data/texte/en/hochschule/szene-merkurjagd.md`, `docs/belege/hochschule/szene-merkurjagd.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 2 (Modellzahlen Merkurs: Umlaufzeit des Datensatzes, Periheldrehung, Rotation; der Controller gibt sie aus dem Bericht weiter).
- Produziert: Hochschultext `szene:merkurjagd`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Merkur auf der Innenbahn` / `# Scene: Mercury on the inner orbit` (wie die Gymnasialfassungen). Gliederung Szene: „Was das Bild zeigt", „Hintergrund", „Modellgrenzen" (Pflicht). Richtwert 300 bis 900 Wörter je Fassung.
- **Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `merkurjagd`, Index 5: Bahntyp `chase`, `distanceBasis` `bodyRadius`, `distanceInRadii` 9, `elevationDeg` 10, `azimuthRateDegPerSec` 0, `durationSec` 30, `timeRateDaysPerSec` 2, Streuung `elevationDeg` −5 bis 20, `distanceFactor` 0,8 bis 1,6) und ihrer Auswertung in `src/render/camera/cinema.ts` (Fall `chase`: Kamera hinter dem Körper entgegen seinem Geschwindigkeitsvektor, angehoben um `radius · sin(elevation)`; bezieht sich der Abstand auf den dargestellten, mit `sizeScale` gedämpften Radius?); Zeitspanne einer Szene (60 Tage) als Bruchteil der Umlaufzeit des Datensatzes; Winkelgröße Merkurs und der Sonne vom Blickpunkt bei Sichtfeld 50° (`KAMERA_FOV_GRAD`), nachgerechnet; wie sich die Bahngeschwindigkeit zwischen Perihel und Aphel im Bild zeigt (Verhältnis der Geschwindigkeiten aus e).
- **Hintergrund:** Bahngeschwindigkeit als Funktion von r (vis-viva), Perihel- und Apheldistanz, Periheldrehung samt relativistischem Anteil (Zahl wie in Task 2), Sonnentag von 176 Tagen und die scheinbare Umkehr der Sonne am Merkurhimmel nahe dem Perihel, Sichtbarkeit von der Erde (Elongation, Transits, Phasen).
- **Modellgrenzen:** Kepler-Ellipse mit linear fortgeschriebenen Elementen (Zahlen wie in Task 2); Rotation ohne Libration; Belichtung auf das Ziel (`render/exposure.ts`); Sonne als gedämpfte Scheibe (`sunDamping`); ob der Zeitraffer beim Szenenstart gleitet (`src/app/cinema.ts`, `src/sim/director.ts`); ob Merkurs Schatten oder Sonnenfinsternisse durch Merkur im Modell vorkommen (Verweis `thema:finsternis`).
- Code lesen: `src/data/scenes.ts`, `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/mercury.ts`, `src/sim/orbit.ts` (`velocityAt`, `bahnellipseRelativKm`), `src/sim/scale.ts`, `src/render/exposure.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`).
- Verweise: `objekt:mercury`, `objekt:sun`, `thema:bahnelemente`, `thema:gebundene-rotation`, `thema:finsternis`, `thema:photometrie`, `thema:modell`; Karten zu `szene:merkurjagd`: `quelle:nssdc-mercury`, `quelle:nasa-mercury`, `quelle:nasa-messenger`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Park et al. 2017 (siehe Task 2); Will 2014 (siehe Task 2); Soter und Ulrichs 1967, Umkehr der Sonne über Merkur (*Nature* 214, 1315); Mallama et al. 2017 (`mallama-2017`, Phasen und Helligkeit); Murray und Dermott (`murray-2000`, vis-viva); Archinal et al. 2018 (`archinal-2018`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Winkelgrößen und Bruchteil der Umlaufzeit im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-merkurjagd.md src/data/texte/en/hochschule/szene-merkurjagd.md docs/belege/hochschule/szene-merkurjagd.md src/data/literatur.ts
git commit -m "Hochschultext Szene Merkur auf der Innenbahn mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 4: Körper `venus`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-venus.md`, `src/data/texte/en/hochschule/objekt-venus.md`, `docs/belege/hochschule/objekt-venus.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1; fachgeprüfte Texte `thema-gebundene-rotation` (Venus zwischen Gezeiten des festen Körpers und der Atmosphäre; Modelltabelle) und `thema-photometrie` (Albedo der Venus).
- Produziert: Hochschultext `objekt:venus`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Venus` / `# Venus`. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radius, Masse (Magellan, Venus Express), Schwerefeld und Topographie (Magellan), Trägheitsmomentfaktor und Präzessionsrate aus Radar (Margot et al. 2021), Rotationsperiode und ihre Schwankung, Schiefe; Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren und Beleg. Inneres: Kern (flüssig oder fest, Argumente), Mantel, Kruste, fehlende Plattentektonik und Alternativen (episodische Erneuerung, Deckelregime), Hinweise auf heutigen Vulkanismus. Oberfläche: Kraterstatistik und Oberflächenalter, Tesserae, Coronae, Vulkanismus, Bedingungen (Druck, Temperatur). Atmosphäre und Magnetosphäre: Zusammensetzung, Treibhaus, Wolken aus Schwefelsäure, Superrotation und ihre Antriebe (thermische Gezeiten), Phosphin-Debatte als Streitfrage, induzierte Magnetosphäre ohne eigenes Feld, Wasserverlust (D/H). Bahn, Rotation und Dynamik: fast kreisförmige Bahn, rückläufige Rotation, Sonnentag von 117 Tagen, Rotationsgleichgewicht zwischen Gezeiten des festen Körpers und atmosphärischen Gezeiten (Verweis `thema:gebundene-rotation`, nicht wiederholen), Transits, Phasen. Entstehung und Entwicklung: frühes Klima (Ozeanhypothese gegen trockene Entwicklung), Geschichte der Rotation, kommende Missionen (VERITAS, DAVINCI, EnVision) mit Stand.
- `## Offene Fragen` (Pflicht): etwa Zustand des Kerns, heutiger Vulkanismus, Phosphin, früher Ozean, Ursache der Superrotation — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente der JPL-Tafel linear fortgeschrieben; **negative** Rotationsperiode `rotationPeriodH` −5832,6 h (am Code nachrechnen, wie `rotationAt` das Vorzeichen verarbeitet) und der Pol des Datensatzes (272,76°/67,16°) gegen den IAU-Wert; Achsneigung im Modell (`achsneigungDeg`: rückläufig über 90°? Wert nachrechnen und mit dem Datenblock vergleichen); `rotationAtEpochDeg` 0 gegen W₀; Textur als Wolkendecke oder Oberfläche (an `ASSETS.md` und der Texturdatei prüfen) — keine Atmosphäre, kein Streulicht, kein Treibhaus in der Darstellung; Albedo 0,689 als geometrische Albedo (Zahlen wie `thema-photometrie`); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/venus.ts`, `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`), `src/sim/scale.ts`, `src/render/albedo.ts`, `src/render/bodies.ts`, `ASSETS.md` (Venus-Textur), `src/ui/info/datenzeilen.ts`, Hochschultexte `thema-gebundene-rotation` (Venus-Absätze) und `thema-photometrie`.
- Verweise: `objekt:earth`, `objekt:mercury`, `objekt:sun`, `thema:gebundene-rotation`, `thema:achsneigung`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:entstehung`, `thema:bezugssysteme`, `thema:finsternis`, `thema:modell`; Karten zu `objekt:venus`: `quelle:nssdc-venus`, `quelle:nasa-venus` (vollständige Liste über `fuer` prüfen).
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Margot et al. 2021 (`margot-2021`); Konopliv et al. 1999, Schwerefeld aus Magellan (*Icarus* 139, 3); Archinal et al. 2018 (`archinal-2018`); Smrekar et al. 2010, junge Vulkane (*Science* 328, 605); Herrick und Hensley 2023, Oberflächenänderung in Magellan-Bildern (*Science* 379, 1205); Byrne et al. 2021, Tektonik (*Proceedings of the National Academy of Sciences* 118, e2025919118); Read und Lebonnois 2018, Superrotation (*Annual Review of Earth and Planetary Sciences* 46, 175); Horinouchi et al. 2020, thermische Gezeiten (*Science* 368, 405); Marcq et al. 2018, Zusammensetzung der Atmosphäre (*Space Science Reviews* 214, 10); Greaves et al. 2021, Phosphin (*Nature Astronomy* 5, 655) und Villanueva et al. 2021, Widerspruch (*Nature Astronomy* 5, 631); Way et al. 2016, früher Ozean (*Geophysical Research Letters* 43, 8376) und Turbet et al. 2021, trockene Entwicklung (*Nature* 598, 276); Correia und Laskar 2001, Rotationsgleichgewicht (`correia-2001`); Widemann et al. 2023, Missionen (*Space Science Reviews* 219, 56); Mallama et al. 2017 (`mallama-2017`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Achsneigung und Rotationsvorzeichen im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-venus.md src/data/texte/en/hochschule/objekt-venus.md docs/belege/hochschule/objekt-venus.md src/data/literatur.ts
git commit -m "Hochschultext Venus mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 5: Körper `mars`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-mars.md`, `src/data/texte/en/hochschule/objekt-mars.md`, `docs/belege/hochschule/objekt-mars.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1; fachgeprüfte Texte `thema-innerer-aufbau` (Mars aus InSight, falls dort behandelt), `thema-photometrie`, `thema-bezugssysteme` (IAU-Rotationsmodell).
- Produziert: Hochschultext `objekt:mars`; Task 6 und 7 übernehmen seine Modellzahlen (Pol, Rotation, Bahnelemente) und verweisen für Einzelheiten auf ihn.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Mars` / `# Mars`. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radien (äquatorial, polar, mittlerer), Masse, Schwerefeld (J₂, Jahreszeitenschwankung durch die Polkappen), Trägheitsmomentfaktor und Präzessionsrate aus Landerverfolgung (Pathfinder, InSight RISE), Chandler-Wackeln; Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren und Beleg. Inneres: Kernradius und Dichte aus InSight-Seismik und RISE, Mantel, Kruste (Dicke, Dichotomie), Schicht geschmolzenen Silikats über dem Kern (2023) als Streitfrage. Oberfläche: Dichotomie, Tharsis, Valles Marineris, Kraterchronologie, Hinweise auf Wasser (Täler, Tone, Sulfate), Polkappen, Staubstürme. Atmosphäre und Magnetosphäre: Zusammensetzung, Druck und seine Jahreszeitenschwankung, Verlust ins All (MAVEN), Krustenmagnetisierung ohne globales Feld, früherer Dynamo. Bahn, Rotation und Dynamik: Exzentrizität, Rotationsperiode und Sol, Achsneigung und ihre chaotische Langzeitentwicklung (Laskar), Jahreszeiten, Präzession, Monde nur als Verweis. Entstehung und Entwicklung: schnelle Akkretion (Hf/W), frühes Klima (warm und nass gegen kalt und eisig), Verlust der Atmosphäre.
- `## Offene Fragen` (Pflicht): etwa frühes Klima, Ursache der Dichotomie, Zustand des Kerns und der Basalschicht, Methan — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente der JPL-Tafel linear fortgeschrieben; Rotationsperiode `rotationPeriodH` 24,6229 h gegen den IAU-Wert; **Pol des Datensatzes** (317,68143°/52,88650°) — der Kommentar in `mars.ts` nennt ihn als IAU-2009-Wert und begründet die Wahl gegen einen „2015er Pol" 317,269°/54,432° mit dem Winkel zur Bahnnormale (25,19° gegen 23,92°); **beide Angaben an Archinal et al. 2018 (Tabelle der Planeten) selbst prüfen** und die Achsneigung des Modells (`achsneigungDeg`) nachrechnen: stimmt der Kommentar, steht die Wahl mit Beleg im Text; stimmt er nicht, beschreibt der Text den Ist-Zustand und der Bericht meldet den Befund (Ruling 7, nicht beheben); `rotationAtEpochDeg` 0 gegen W₀; fester Pol ohne Präzession; Albedo 0,170 als geometrische Albedo (Zahlen wie `thema-photometrie`); keine Atmosphäre, keine Polkappen-Jahreszeiten in der Darstellung (Textur prüfen); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/mars.ts`, `src/data/bodies/mars-monde.ts` (nur `frame: 'parentEquator'` für den Bezug der Mondbahnen auf den Marspol), `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/albedo.ts`, `ASSETS.md` (Mars-Textur), `src/ui/info/datenzeilen.ts`, Hochschultexte `thema-innerer-aufbau`, `thema-photometrie`, `thema-bezugssysteme`.
- Verweise: `objekt:phobos`, `objekt:deimos`, `objekt:earth`, `objekt:sun`, `thema:innerer-aufbau`, `thema:achsneigung`, `thema:photometrie`, `thema:entstehung`, `thema:bezugssysteme`, `thema:bahnelemente`, `szene:phobos-tiefflug`, `thema:modell`; Karten zu `objekt:mars`: `quelle:nssdc-mars`, `quelle:nasa-mars`, `quelle:esa-mars-express` (vollständige Liste über `fuer` prüfen).
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Folkner et al. 1997 (`folkner-1997`); Konopliv et al. 2020 (`konopliv-2020`); Konopliv et al. 2016, Schwerefeld und Rotation (*Icarus* 274, 253); Genova et al. 2016, Schwerefeld aus MRO (*Icarus* 272, 228); Le Maistre et al. 2023, Kern aus RISE (*Nature* 619, 733); Stähler et al. 2021, Kern aus Seismik (*Science* 373, 443); Khan et al. 2021, Mantel (*Science* 373, 434); Knapmeyer-Endrun et al. 2021, Kruste (*Science* 373, 438); Khan et al. 2023 (*Nature* 622, 718) und Samuel et al. 2023 (*Nature* 622, 712), Basalschicht; Archinal et al. 2018 (`archinal-2018`); Kuchynka et al. 2014, Rotationsmodell (*Icarus* 229, 340); Laskar et al. 2004, Achsneigung (*Icarus* 170, 343); Jakosky et al. 2018, Atmosphärenverlust (*Icarus* 315, 146); Acuña et al. 1999, Krustenmagnetisierung (*Science* 284, 790); Ehlmann und Edwards 2014, Mineralogie (*Annual Review of Earth and Planetary Sciences* 42, 291); Wordsworth 2016, frühes Klima (*Annual Review of Earth and Planetary Sciences* 44, 381); Dauphas und Pourmand 2011, Hf/W-Alter (*Nature* 473, 489); Smith et al. 2001, MOLA (*Journal of Geophysical Research* 106, 23689); Mallama et al. 2017 (`mallama-2017`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Achsneigung für beide Polwerte im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-mars.md src/data/texte/en/hochschule/objekt-mars.md docs/belege/hochschule/objekt-mars.md src/data/literatur.ts
git commit -m "Hochschultext Mars mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 5a: Prüfskript erkennt Konsortial-Bylines (Zwischen-Task, Ruling 17)

**Dateien:** Ändern `scripts/literaturVergleich.ts` (`pruefeCrossref`, Erstautor-Vergleich), `scripts/literaturVergleich.test.ts` (neuer Fall), Entwurf §4.5 (Nachtrag), `docs/belege/hochschule/objekt-mars.md` (Zeile zu `korablev-2019`).

**Anlass:** Nach der Nacharbeit zu Task 5 führt `korablev-2019` (Nature 568, 517) den echten Erstautor „Korablev, O."; Crossref führt die Körperschaft „The ACS and NOMAD Science Teams" (Feld `name`, kein `family`) zuerst. Das Skript meldete einen Fehler, obwohl der Katalog richtig ist; der Volllauf der Abnahme bliebe sonst dauerhaft bei 1 Fehler.

**Regel:** Weicht der Crossref-Erstautor ab, ist aber eine Körperschaft (`family` fehlt, `name` vorhanden) und steht der Katalog-Erstautor unter den weiteren Crossref-Autoren (`family` normalisiert gleich dem Nachnamen), meldet `pruefeCrossref` eine **Warnung** („Crossref führt die Körperschaft „…" zuerst, Erstautor „…" steht unter den weiteren Autoren"); sonst bleibt es ein Fehler. Test (TDD): Crossref-Autoren `[{ name: 'The ACS and NOMAD Science Teams' }, { family: 'Korablev' }, { family: 'Vandaele' }]` mit Katalog-Erstautor „Korablev, O." → genau `['warnung']`; mit Katalog-Erstautor „Vago, J." → Fehler. `npm run literatur:pruefen -- --nur korablev-2019` → 0 Fehler, 1 Warnung. Commit: `Prüfskript: Konsortial-Bylines bei Crossref als Warnung statt Fehler`. Soll-Testzahl der Etappe damit **4125**.

---

### Task 6: Körper `phobos` und `deimos`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-phobos.md`, `src/data/texte/en/hochschule/objekt-phobos.md`, `src/data/texte/de/hochschule/objekt-deimos.md`, `src/data/texte/en/hochschule/objekt-deimos.md`, `docs/belege/hochschule/objekt-phobos.md`, `docs/belege/hochschule/objekt-deimos.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 5 (Modellzahlen des Mars: Pol, Rotation; der Controller gibt sie weiter); fachgeprüfte Texte `thema-gebundene-rotation` (Modelltabelle mit Phobos und Deimos, Winkel als Momentaufnahmen), `thema-gezeiten` (Bahnentwicklung von Phobos, falls dort behandelt), `thema-finsternis` (Phobos-Durchgänge vor der Sonne).
- Produziert: Hochschultexte `objekt:phobos` und `objekt:deimos`; Task 7 übernimmt die Modellzahlen von Phobos.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Ein Task für beide Monde (Ruling 4): gemeinsame Recherche zur Entstehung, **je Mond eigene Texte und eigene Belegliste**, eine Fachprüfung über alle vier Dateien. Überschriften `# Phobos` / `# Phobos` und `# Deimos` / `# Deimos`. Gliederung Körper mit allen acht Abschnitten; „Atmosphäre und Magnetosphäre" behandelt das Fehlen beider und die Wechselwirkung mit dem Sonnenwind knapp. Richtwert 600 bis 1000 Wörter je Fassung und Mond. Die Entstehung (Einfang gegen Riesenstoß, Ring-Mond-Zyklus) steht ausführlich bei Phobos; Deimos verweist mit `objekt:phobos` darauf und behandelt nur, was ihn unterscheidet.
- Inhalt Phobos mindestens: Masse und Dichte aus Vorbeiflügen (Mars Express), Abmessungen (dreiachsig) und mittlerer Radius, Porosität, Stickney und die Rillen (Deutungen), Oberflächenzusammensetzung (D-Typ-ähnlich, Rot- und Blau-Einheit), säkulare Beschleunigung und Absinken der Bahn, Gezeitenzerlegung in 30 bis 50 Millionen Jahren als Vorhersage mit Unsicherheit, Durchgänge vor der Sonne von der Marsoberfläche, MMX als kommende Mission mit Stand. Inhalt Deimos mindestens: Masse und Dichte (Unsicherheit deutlich größer), Abmessungen, glatte Oberfläche und Regolith, Bahn außerhalb der synchronen Bahn (steigend, langsam), Abgrenzung zu Phobos.
- `## Offene Fragen` (Pflicht) je Mond: Entstehung (Einfang gegen Stoß), innerer Aufbau (Porosität gegen Eis), Ursprung der Rillen bei Phobos, Herkunft des glatten Regoliths bei Deimos — jeweils mit Belegen für beide Seiten.
- `## Im Modell` je Mond: Bahnelemente aus `mars-monde.ts` im Bezug `parentEquator` (Marsäquator, Pol aus Task 5); Phobos e 0,015, Deimos **e 0** (Befund B3 der Abnahme 4d-3, im Text nennen: gemessen ist e ≈ 0,0002 bis 0,0003, Wert an der Quelle prüfen); große `lpDot`/`nodeDot`-Raten — am Code nachrechnen, welche Apsiden- und Knotenperiode das ergibt und ob sie zur Literatur passt; Rotation 1:1 mit fester Periode (`rotationPeriodH` 7,65384 h beziehungsweise 30,29858 h) gegen die Umlaufzeit des Datensatzes (Verhältnis und Winkel wie `thema-gebundene-rotation`); **Kugelform** mit mittlerem Radius (11,1 km beziehungsweise 6,2 km) statt der dreiachsigen Gestalt — Abweichung in Prozent je Achse; keine säkulare Beschleunigung; Phobos mit Albedokarte, **Deimos ohne Textur** mit Ausweichfarbe `#7a7067` (Ruling 16; Grund laut `ASSETS.md`); Albedo 0,07 beziehungsweise 0,08 als geometrische Albedo; Maßstab (Mondabstand mit `sizeScale` wie die Radien, `isSatellite`); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/mars-monde.ts`, `src/data/bodies/mars.ts`, `src/sim/orbit.ts` (`elementsAt`, `rotationAt`, `umlaufzeitTage`), `src/sim/frames.ts` (`parentEquator`), `src/sim/scale.ts` (`isSatellite`, `scaledPositionAt`), `src/render/bodies.ts` (Kugelnetz), `src/render/albedo.ts`, `ASSETS.md` (Phobos-Textur, fehlende Deimos-Karte), `src/ui/info/datenzeilen.ts`, Hochschultexte `thema-gebundene-rotation`, `thema-gezeiten`, `thema-finsternis`.
- Verweise (Phobos): `objekt:mars`, `objekt:deimos`, `thema:gezeiten`, `thema:gebundene-rotation`, `thema:entstehung`, `thema:finsternis`, `thema:photometrie`, `thema:innerer-aufbau`, `szene:phobos-tiefflug`, `thema:modell`; (Deimos): `objekt:mars`, `objekt:phobos`, `thema:gezeiten`, `thema:gebundene-rotation`, `thema:entstehung`, `thema:photometrie`, `thema:modell`. Karten: zu `objekt:phobos` `quelle:nasa-marsmonde`, `quelle:esa-mars-express`; zu `objekt:deimos` `quelle:nasa-marsmonde` (vollständige Liste über `fuer` prüfen).
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Rosenblatt 2011, Übersicht zur Entstehung (*Astronomy and Astrophysics Review* 19, 44); Rosenblatt et al. 2016, Riesenstoß (*Nature Geoscience* 9, 581); Canup und Salmon 2018 (*Science Advances* 4, eaar6887); Hesselbrock und Minton 2017, Ring-Mond-Zyklus (*Nature Geoscience* 10, 266); Bagheri et al. 2021, gemeinsamer Vorläufer (*Nature Astronomy* 5, 539) und die Erwiderung Hyodo et al. 2022 (*Nature Astronomy* 6, 402, prüfen); Pätzold et al. 2014, Masse von Phobos (*Icarus* 229, 92); Willner et al. 2014, Gestalt und Volumen (*Planetary and Space Science* 102, 51); Jacobson und Lainey 2014, Bahnen (*Planetary and Space Science* 102, 35); Lainey et al. 2007, Gezeitendissipation (*Astronomy & Astrophysics* 465, 1075); Black und Mittal 2015, Zerlegung (*Nature Geoscience* 8, 913); Hurford et al. 2016, Rillen als Gezeitenrisse (*Journal of Geophysical Research: Planets* 121, 1054); Fraeman et al. 2012, Spektren (*Journal of Geophysical Research* 117, E00J15); Thomas et al. 1996 oder 2011 zu Deimos (Kennung prüfen); Bell et al. 2005, Durchgänge (*Nature* 436, 55); Kuramoto et al. 2022, MMX (*Earth, Planets and Space* 74, 12); Archinal et al. 2018 (`archinal-2018`); Burns 1978 (*Vistas in Astronomy* 22, 193).
- Neue Testfälle: 4 Dateien × 11 = 44.

- [ ] **Schritt 1:** Vorlage und Code lesen, Apsiden- und Knotenperioden, Rotationsverhältnisse und Achsabweichungen der Kugelform im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, zwei Beleglisten, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text Phobos, englische Fassung; deutscher Text Deimos, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen aller vier Dateien.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-phobos.md src/data/texte/en/hochschule/objekt-phobos.md src/data/texte/de/hochschule/objekt-deimos.md src/data/texte/en/hochschule/objekt-deimos.md docs/belege/hochschule/objekt-phobos.md docs/belege/hochschule/objekt-deimos.md src/data/literatur.ts
git commit -m "Hochschultexte Phobos und Deimos mit Beleglisten"
```

- [ ] **Schritt 6:** Eine Fachprüfung über beide Monde (Auftrag mit beiden Dateipaaren und beiden Beleglisten), eine Nacharbeit.

---

### Task 7: Szene `phobos-tiefflug`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-phobos-tiefflug.md`, `src/data/texte/en/hochschule/szene-phobos-tiefflug.md`, `docs/belege/hochschule/szene-phobos-tiefflug.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 5 und 6 (Modellzahlen von Mars und Phobos; der Controller gibt sie weiter).
- Produziert: Hochschultext `szene:phobos-tiefflug`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Tiefflug über Phobos` / `# Scene: Low pass over Phobos` (wie die Gymnasialfassungen). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung.
- **Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `phobos-tiefflug`, Index 8: `targetId` `phobos`, **`lookAtId` `mars`**, Bahntyp `chase`, `distanceBasis` `bodyRadius`, `distanceInRadii` 4, `elevationDeg` 8, `durationSec` 25, `timeRateDaysPerSec` 0,05, Streuung `elevationDeg` 0 bis 20, `distanceFactor` 0,8 bis 1,5) und ihrer Auswertung in `src/render/camera/cinema.ts`: Die Kamera steht vier Phobosradien hinter Phobos entgegen seiner Bahnrichtung und blickt auf Mars; der Kommentar im Szeneneintrag behauptet, Phobos liege dabei praktisch immer **außerhalb** des Bildwinkels, die Szene sei ein Blick *mit* Phobos auf Mars — **am Code nachrechnen** (Winkel zwischen Blickrichtung zu Mars und Richtung zu Phobos gegen das halbe Sichtfeld 50°, bei mehreren Bahnphasen) und im Text so beschreiben, wie es das Bild tatsächlich zeigt; Zeitspanne einer Szene (1,25 Tage) in Phobos-Umläufen; Winkelgröße des Mars vom Blickpunkt (Gymnasialtext nennt 42° von Phobos aus, Ruling 4c-4 — nachrechnen, ob der Wert für den Kameraabstand gilt); Drehung des Mars während der Szene.
- **Hintergrund:** Bahn von Phobos innerhalb der synchronen Bahn, Aufgang im Westen und Umlaufdauer vom Marsboden aus, Winkelgröße von Mars vom Phobos aus und von Phobos vom Marsboden, Gezeitenabsinken (Zahl wie Task 6), Durchgänge vor der Sonne, Beleuchtung durch Marsschein.
- **Modellgrenzen:** Kugelform von Phobos (Abweichung wie Task 6); Bahn im Marsäquator-Bezug mit festen Elementen (Zahlen wie Task 6); kein Marsschein und keine Atmosphäre (Beleuchtungsmodell `lighting.ts`: Lambert, Fülllicht); Belichtung auf das Ziel Phobos oder das Blickziel Mars (`render/exposure.ts` prüfen); Maßstab (`sizeScale`: Mondabstand und Radien); Marsschatten auf Phobos (`render/shadows.ts`: wirft Mars im Modell Schatten auf seine Monde?); ob der Zeitraffer beim Szenenstart gleitet.
- Code lesen: `src/data/scenes.ts`, `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/mars-monde.ts`, `src/data/bodies/mars.ts`, `src/sim/orbit.ts` (`velocityAt`), `src/sim/scale.ts`, `src/render/lighting.ts`, `src/render/exposure.ts`, `src/render/shadows.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`).
- Verweise: `objekt:phobos`, `objekt:mars`, `objekt:deimos`, `thema:gezeiten`, `thema:gebundene-rotation`, `thema:finsternis`, `thema:modell`; Karten zu `szene:phobos-tiefflug`: `quelle:nssdc-mars`, `quelle:nasa-marsmonde`, `quelle:esa-mars-express`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Jacobson und Lainey 2014 (siehe Task 6); Bell et al. 2005 (siehe Task 6); Black und Mittal 2015 (siehe Task 6); Willner et al. 2014 (siehe Task 6); Archinal et al. 2018 (`archinal-2018`); Murray und Dermott (`murray-2000`, synchrone Bahn).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Sichtbarkeit von Phobos im Bild und Winkelgrößen im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-phobos-tiefflug.md src/data/texte/en/hochschule/szene-phobos-tiefflug.md docs/belege/hochschule/szene-phobos-tiefflug.md src/data/literatur.ts
git commit -m "Hochschultext Szene Tiefflug über Phobos mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 8: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe4-abnahme.md`
- Ändern: `README.md`
- Nur lokal, nicht committen: Skripte und Aufnahmen unter `.playwright-mcp/`

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 7; DOM-Attribute `[data-formelfehler]`, `[data-verweis]`, `[data-literatur]`, `[data-quelle]`, `[data-tabelle]`; `aside.info-panel`, `[role="tabpanel"]`, Hinweiszeilen `p.text-amber-300`.
- Produziert: das Abnahmeprotokoll; den Halt für Jens.

- [ ] **Schritt 1: Prüfläufe**

```bash
npm run lint
npm test
npm run build
npm run literatur:pruefen
```

Expected: Lint ohne Befund; alle Tests grün (Soll 4124 nach „Testzahlen" oben, zuzüglich Tests aus Zwischen-Tasks); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, Ausgangsstand 1 326,01 kB nach 4d-3); Prüfskript über den ganzen Katalog mit 0 Fehlern und ohne 429, Laufzeit notieren (Ausgangsstand 480 s bei 303 Einträgen). Schlusszeilen, die Katalogzahl (Ausgangsstand 303) und die vollständige Ausgabe des Prüfskripts ins Protokoll; jede Warnung begründen.

- [ ] **Schritt 2: Browser vorbereiten**

Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` (200 erwartet, keinen zweiten Server starten). `browser_navigate` auf `http://localhost:5173/Orrery/`, dann `browser_evaluate`:

```js
() => {
  window.store.setState({ quality: { tier: 'high' } });
  const s = window.store.getState();
  s.setCinema({ running: false, pauseOnInput: false });
  s.setTime({ paused: true });
  s.setUi({ hidden: false, language: 'de', panels: { ...s.ui.panels, info: true } });
  s.setInfo({ niveau: 'hochschule', breiteRem: 40, thema: null });
  return window.innerWidth;
}
```

- [ ] **Schritt 3: Rundgang**

Kombinationen: Sprachen `de`, `en` × die sieben Kennungen (`mercury`, `venus`, `mars`, `phobos`, `deimos`, `merkurjagd`, `phobos-tiefflug`). Zustand setzen wie in der Abnahme 4d-3: Körper über `setInfo({ thema: null })` und `setCamera({ targetId: '<id>', mode: 'free' })`; Szenen über `setCinema({ running: true, shuffle: false, nummer: 5 })` (`merkurjagd`) beziehungsweise `nummer: 8` (`phobos-tiefflug`), `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setUi({ hidden: false })`. Auf den Kopfwechsel pollen (Titel wie in der ersten Zeile des Texts), Hinweise erst nach dem Auflösen des faulen Imports werten, dann auswerten:

```js
() => {
  const text = document.querySelector('aside.info-panel [role="tabpanel"]');
  const ids = [...new Set([...text.querySelectorAll('a[data-verweis^="literatur:"]')].map((a) => a.getAttribute('data-verweis').slice('literatur:'.length)))].sort();
  const karten = [...document.querySelectorAll('[data-literatur]')].map((k) => k.getAttribute('data-literatur')).sort();
  return {
    kopf: document.querySelector('aside.info-panel header h2')?.textContent,
    formelfehler: document.querySelectorAll('[data-formelfehler]').length,
    formeln: text.querySelectorAll('math').length,
    tabellen: text.querySelectorAll('[data-tabelle]').length,
    hinweise: [...text.querySelectorAll('p.text-amber-300')].map((p) => p.textContent),
    verweise: [...text.querySelectorAll('[data-verweis]')].map((v) => v.getAttribute('data-verweis')),
    zitateGleichKarten: JSON.stringify(ids) === JSON.stringify(karten),
  };
}
```

Kriterien: `formelfehler` 0; keine Hinweiszeile (insbesondere nicht `info.hochschuleFolgt`, „Der Hochschultext folgt …" / „The university-level text will follow …"); `zitateGleichKarten` true. Danach jeden Verweis einzeln per `element.click()` in `browser_evaluate` auslösen (externe `https://`-Ziele nur zählen), die Wirkung prüfen und den Ausgangszustand wiederherstellen:

| Verweisart | erwartete Wirkung |
|---|---|
| `objekt:<id>` | `camera.targetId === '<id>'` nach Ende der Kamerafahrt (1,5 s) |
| `thema:<id>` | `ui.info.thema === '<id>'` |
| `szene:<id>` | `cinema.nummer` gleich dem Index der Szene, `camera.mode === 'cinema'` |
| `quelle:<id>` | `[data-quelle="<id>"]` hat `border-sky-300` |
| `literatur:<id>` | `[data-literatur="<id>"]` hat `border-sky-300` (Klick und Prüfung in **einem** `browser_evaluate`, sonst läuft die Hervorhebung ab) |

Ergebnis je Kombination als Tabelle ins Protokoll (Verweise je Art, Treffer, Formeln, Tabellen, Karten).

- [ ] **Schritt 4: Ersatz entfällt**

Je Sprache: Fachthema `gebundene-rotation` öffnen (`setInfo({ thema: 'gebundene-rotation' })`), den ersten Verweis `a[data-verweis="objekt:mercury"]` klicken, auf den Kopf „Merkur" / „Mercury" pollen, dann: keine Hinweiszeile im Textbereich. Ebenso Fachthema `finsternis` öffnen (`setInfo({ thema: 'finsternis' })`), `a[data-verweis="objekt:phobos"]` klicken, Kopf „Phobos", keine Hinweiszeile. Vier Messungen, Ergebnis mit Wartezeit in ms ins Protokoll.

- [ ] **Schritt 5: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 6: Protokoll `docs/phase4d-etappe4-abnahme.md`**

Gliederung:

```md
# Abnahme Phase 4d Etappe 4 „Innere Planeten"

## 1. Umfang
(Commits der Etappe mit Kurzhash und Titel, Branch, Plan, Entwurf)

## 2. Lint, Tests, Build
(Schlusszeilen; Testzahl als eine durchgehende Tabelle Task → Zuwachs → Summe mit Quelle; Größe des Hauptchunks gegenüber dem Ausgangsstand und Zahl der Katalogeinträge)

## 3. Prüfskript
(vollständige Ausgabe, Laufzeit, Begründung jeder Warnung)

## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
(eine Prüfrunde je Text; was nach der Nacharbeit offen blieb, mit Begründung des Umsetzers)

## 5. Sichtprüfung
### 5.1 Rundgang
### 5.2 Ersatz entfällt
### 5.3 Konsole

## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:")

## 7. Bekannte Unschärfen
(einschließlich der Befunde am Simulationscode, die die Texte beschreiben, als Kandidaten für eigene Tasks; Restbefunde der Fachprüfungen)

## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer; gemeldete Fehler in Gymnasialtexten; die 16 Plan-Rulings als Liste)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, nicht geschätzt; jede Summe nachrechnen. Die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung nennen, ohne Suchmuster.

- [ ] **Schritt 7: README**

In `README.md` im Absatz zu Phase 4d den Satzteil

```md
Mond, Finsternisse, gebundene Rotation und die Szenen „Der Tanz des Mondes"
und „Sonnenaufgang über dem Erdrand". Offen sind die übrigen Hochschultexte
(Etappen 4d-4 bis 4d-11) und Phase 5 (Ambient-Sound, Qualitätsstufen,
```

ersetzen durch:

```md
Mond, Finsternisse, gebundene Rotation und die Szenen „Der Tanz des Mondes"
und „Sonnenaufgang über dem Erdrand"; Etappe 4 Merkur, Venus, Mars, Phobos,
Deimos und die Szenen „Merkur auf der Innenbahn" und „Tiefflug über Phobos".
Offen sind die übrigen Hochschultexte (Etappen 4d-5 bis 4d-11) und Phase 5
(Ambient-Sound, Qualitätsstufen,
```

Danach die Zeilenumbrüche des Absatzes glätten (Zeilen bis rund 80 Zeichen), ohne den Wortlaut zu ändern.

- [ ] **Schritt 8: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe4-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm (Aufnahmen, Skripte löschen).

```bash
git add docs/phase4d-etappe4-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 4: Innere Planeten"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe; Paket ohne die fachgeprüften Texte und Beleglisten, mit Task 1, Katalogeinträgen und Protokoll); Befunde gebündelt in **einer** Nacharbeit, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-4` nach `master`, Branch löschen; Push erst nach der Prüfung des Diffs auf Zugangsdaten (Ruling 14).
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Befunde am Simulationscode als Kandidaten. Etappe 4d-5 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- **Modelle (Weisung Jens, 20.09.2026: „subagents mit möglichst kleinen Modellen", Ruling 2):** Task 1, README-Änderung und rein mechanische Aufträge auf dem kleinsten Modell (haiku); Umsetzer der Text-Tasks (2 bis 7), Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren (sonnet). Das stärkste Modell nur, wenn ein Umsetzer an derselben Stelle zweimal scheitert (Ruling ins Ledger).
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace `.superpowers/sdd/2026-09-20-phase4d-hochschule-etappe4/` (Ausgabelimits brachen in 4d-1 Agenten ab).
- Fachprüfer laufen parallel zum nächsten Umsetzer; Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`.
- Jeder Umsetzer bekommt die Gemeinsamen Vorgaben, seinen Task und die Globalen Randbedingungen wörtlich; die Modellzahlen aus Task 2 (Merkur), Task 5 (Mars) und Task 6 (Phobos) gibt der Controller aus den Berichten an die Folgetasks weiter.
- Eine Prüfrunde je Text: Nach der Nacharbeit keine weitere Prüfung beauftragen, auch wenn der Umsetzer Zweifel meldet; Zweifel gehen ins Protokoll §8.

## Rulings

Entscheidungen der Planung (20.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** „weiter im Plan" (Jens, 20.09.2026) gilt als Freigabe für Etappe 4d-4, wie zuvor „mach weiter" für 4d-3 und den Tag `v0.4.0`. Die offenen Fragen aus §8 der Abnahme 4d-3 werden nicht abgewartet, sondern per Ruling 6 wie dort vorgeschlagen entschieden.
2. **Ruling:** Modelle nach Weisung von Jens („subagents mit möglichst kleinen Modellen"): Text-Umsetzer, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell, mechanische Tasks auf dem kleinsten; Abweichung vom Hinweis des Plans 4d-3 („stärkstes Modell für Texte"). Bekanntes Risiko: In 4d-3 Task 7 brauchte ein Text vom mittleren Modell drei Nacharbeitsrunden; das fängt jetzt die Regel „eine Prüfrunde" ab, Restbefunde gehen ins Protokoll.
3. **Ruling:** Höchstens eine Prüfrunde je Text (Regel von Jens, 20.09.2026): Fachprüfung, eine Nacharbeit, Schluss. Keine Nachprüfung; in der Nacharbeit wird nicht gekürzt. Ersetzt Ruling 9 des Plans 4d-3 (zweite Nachprüfung).
4. **Ruling:** Phobos und Deimos entstehen in einem Task mit einer gemeinsamen Fachprüfung, weil sie dieselbe Entstehungsliteratur teilen und zusammen unter dem Richtwert eines Planetentexts bleiben; je Mond eigene Texte und eigene Belegliste. Abweichung vom Schnitt „ein Task ist ein Körper" in Entwurf §7.
5. **Ruling:** Reihenfolge Merkur → Merkurjagd → Venus → Mars → Phobos und Deimos → Phobos-Tiefflug: Jede Szene folgt direkt ihrem Zielkörper und übernimmt dessen Modellzahlen; Venus hängt von nichts ab und steht zwischen den beiden Blöcken. Szenen bleiben eigene Tasks (wie Plan 4d-3 Ruling 7).
6. **Ruling:** Die Fragen aus §8 der Abnahme 4d-3 werden wie dort vorgeschlagen entschieden: Wortzahlen der fünf Texte über dem Richtwert bleiben; N5 („also dagegen") und N6 (Tausendergruppierung in Formeln) unverändert; die drei geparkten Punkte aus Task 7 (Wortzahl, gemischtes Sichtbarkeitskriterium mit beiden Zahlen, „Durchschnittswert" für 34 Bogenminuten) bleiben so; Vorabdruck-Einträge tragen `erschienen: 'arXiv'` (Task 1); `chapront-touze-1988` mit „und"; Kommentarzeile umgebrochen; Testlücke „Konstanten statt Verdrahtung" belassen; Zugriffsjahr für laufend gepflegte Seiten als Muster in den Entwurf (Task 1). Die gemeldeten Fehler in Gymnasialtexten bleiben geparkt, bis Jens entscheidet.
7. **Ruling:** Befunde am Simulationscode, die die Texte aufdecken (Marspol 2009 gegen 2015, Deimos e = 0, Kugelform der Marsmonde, Nullmeridiane 0 gegen W₀, feste Pole, Venus und Mars ohne Atmosphäre in der Darstellung, Deimos ohne Textur), werden in 4d-4 nicht behoben. Die Texte beschreiben den Code zum Zeitpunkt des Tasks; neue Befunde gehen ins Ledger und als Kandidaten ins Protokoll (§7). Wie Plan 4d-3 Ruling 3.
8. **Ruling:** Modellzahlen, die schon in einem fachgeprüften Text stehen (Merkur, Phobos, Deimos in `thema-gebundene-rotation`; Albedos in `thema-photometrie`; Bahnelemente-Tafel in `objekt-earth` und `thema-bahnelemente`), übernehmen die neuen Texte gleichlautend. Ergibt die eigene Nachrechnung einen anderen Wert, meldet der Umsetzer das im Bericht und im Ledger; der fachgeprüfte Text wird nicht in dieser Etappe geändert, die Frage geht an Jens (§8). Wie Plan 4d-3 Ruling 8.
9. **Ruling:** Kein eigener Verweis-Task: Alle sieben Kennungen haben Gymnasialtexte (Ersatz nach Entwurf §5.5 Punkt 6). Die fachgeprüften Texte aus 4d-1 bis 4d-3 bleiben unverändert; ihre vorhandenen Verweise auf `objekt:mercury`, `objekt:venus`, `objekt:mars`, `objekt:phobos`, `objekt:deimos` führen danach auf die Hochschultexte.
10. **Ruling:** Tausendertrennung in neuen Texten ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma), wie Plan 4d-2 Ruling 8; Zahlenspannen nennen, wofür sie gelten (Lehre 4d-3).
11. **Ruling:** Die Fachprüfung behält den siebten Prüfpunkt „Widerspruch zu einem fachgeprüften Hochschultext" und bekommt den Hinweis, dass es nur eine Runde gibt (Schwerpunkt auf Fehlern, die die Aussage falsch machen).
12. **Ruling:** Eine Sichtprüfung des Formelsatzes entfällt, solange kein neuer TeX-Befehl dazukommt; kommt einer dazu, misst der Zwischen-Task ihn wie in 4d-2 als Differenzbild in derselben Ladung, Abstände relativ zum Formelanfang.
13. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle. Die Abnahme notiert Größe des Hauptchunks und Zahl der Einträge; wächst der Chunk gegenüber dem Ausgangsstand (1 326,01 kB) um mehr als 50 kB, geht die Frage des faulen Ladens an Jens (wie Plan 4d-3 Ruling 13).
14. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master` und wird nach der Prüfung des Diffs auf Zugangsdaten gepusht (wie 4d-2 und 4d-3; das Repository ist öffentlich). Jens gibt danach 4d-5 frei. Änderungswünsche an den Texten kommen als eigene Commits.
15. **Ruling:** Wortzahl-Obergrenze als weiche Schranke: Kein Text soll den oberen Richtwert um mehr als ein Drittel überschreiten (Körper 4667, kleine Monde 1333, Szenen 1200 Wörter); der Umsetzer straffte vor dem Commit, nicht in der Nacharbeit. Anlass: fünf von sechs Texten in 4d-3 lagen über dem Richtwert (Abnahme 4d-3 §8).
16. **Ruling:** Deimos hat keine Textur (`textures.albedo` leer, Ausweichfarbe `#7a7067`, Begründung in `ASSETS.md`); der Hochschultext beschreibt das im Abschnitt „Im Modell" und der Gymnasialtext bleibt unverändert. Keine neue Textur in dieser Etappe (kein Code, keine Assets).
17. **Ruling (Umsetzung, 20.09.2026):** Zwischen-Task 5a lockert den Erstautor-Vergleich des Prüfskripts für Konsortial-Bylines (Körperschaft mit `name` zuerst bei Crossref, Katalog-Erstautor unter den weiteren Autoren → Warnung statt Fehler). Anlass `korablev-2019` nach der Fachprüfung Mars (F3). Kosten bei Fehlurteil: eine gelockerte Prüfung für genau diesen Fall; sonst bliebe jeder Volllauf bei 1 Fehler.
