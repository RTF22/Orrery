# Phase 4d Hochschule, Etappe 7 „Mittlere Saturnmonde" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Mimas, Tethys, Dione, Rhea und Iapetus sowie die Szene `iapetus-schief` haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung (Entwurf §7, Zeile 4d-7, 12 Dateien). Vorab führt Task 1 nach Jens' Entscheidung vom 22.09.2026 den Gymnasialtext Titan nach (Abnahme 4d-6 §8). Danach **Halt** für die Freigabe von Etappe 4d-8.

**Architektur:** Ein Vorab-Task (Gymnasialtext, kein Hochschultext, keine Fachprüfung), fünf Körper-Tasks und ein Szenen-Task, **nicht wörtlich im Plan**: Der Umsetzer liest den Code, recherchiert, schreibt und belegt nach Entwurf §6.4; eine Fachprüfung mit frischem Kontext prüft **einmal**, danach folgt **eine** Nacharbeit (Regel von Jens vom 20.09.2026). Kein Code-Task. Anders als in 4d-6 läuft die einzige Szene dieser Etappe **allein** in einem eigenen Task, weil sie erst nach Iapetus' Modellzahlen entstehen kann (Ruling 6). Alle sechs Kennungen dieser Etappe haben Gymnasialtexte, deshalb setzt jeder Text-Task seine Verweise selbst. Task 8 ist die Abnahme nach Entwurf §8.2.

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §4.1, §5 (Gestalt der Texte), §6 (Arbeitsweise), §7 Zeile 4d-7, §8.2 (Abnahme). Vorlagen: Plan `docs/superpowers/plans/2026-09-21-phase4d-hochschule-etappe6.md`, Abnahme `docs/phase4d-etappe6-abnahme.md` und die fachgeprüften Hochschultexte unter `src/data/texte/de/hochschule/` samt Beleglisten unter `docs/belege/hochschule/` (Saturn: `objekt-saturn.md`; Titan/Enceladus: `objekt-titan.md`, `objekt-enceladus.md`; Themen: `thema-gebundene-rotation.md`, `thema-resonanzen.md`, `thema-finsternis.md`, `thema-photometrie.md`, `thema-ringe.md`, `thema-bahnelemente.md`; Szene: `szene-saturn-ringkante.md`). Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und im Literaturkatalog (Originaltitel; beschreibende Zusätze im Feld `erschienen` englisch, Eigennamen von Verlagen und Einrichtungen original).
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei. Protokolle, Berichte und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**. **Ergänzt:** Keine Prozesssprache (Task, Ruling, Brief) in Texten oder Beleglisten — Befund `objekt-venus.md` in 4d-4, behoben in 4d-6 (Abnahme 4d-6 §8); die Fachprüfung prüft das ausdrücklich (Prüfpunkt 8 unten).
- Branch `hochschule-7` (von `master`, Stand 53a1d63 — Abnahme 4d-6 mit den Nachträgen zu §8), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test) und steht alphabetisch nach Kennung (Test); Vorabdrucke tragen `erschienen: 'arXiv'` (Test); laufend gepflegte Seiten tragen das Zugriffsjahr.
- Keine neue Abhängigkeit in `package.json`. Kein Code außer in etwaigen Zwischen-Tasks für neue TeX-Befehle; Befunde am Simulationscode, die ein Text aufdeckt, beschreibt der Text in „Im Modell" und der Bericht meldet sie (Ruling 7).
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben.
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Namen beziehungsweise Titel aus `ui/i18n` (Körper `body.<id>.name`, Szene „Szene: " / „Scene: " vor dem Szenentitel `scene.iapetusSchief` wie in den Gymnasialfassungen); Körper mit den festen `##`-Überschriften aus Entwurf §5.1 in dieser Reihenfolge, Pflichtabschnitte nie weglassen; Szene mit den drei festen `##`-Überschriften; Hochschultexte enden mit `*Stand: September 2026*` / `*As of September 2026*` als eigenem Absatz; `literatur:` nur in Hochschultexten. **Richtwert dieser Etappe (neues Ruling 4, abweichend von Entwurf §5.2):** alle fünf Körper 1000 bis 2000 Wörter je Fassung, Obergrenze 2667 (ein Drittel darüber); Szene wie gehabt 300 bis 900, Obergrenze 1200. Richtigkeit geht vor Wortzahl; gestrafft wird vor dem Commit, nie in der Nacharbeit.
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten. Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen); Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste. Nacharbeiten warten, bis kein anderer Umsetzer läuft.
- **Höchstens eine Prüfrunde je Text** (Jens, 20.09.2026): ein Umsetzer, eine Fachprüfung, eine Nacharbeit, dann Schluss. Keine Nachprüfung. Was danach offen bleibt, steht im Abnahmeprotokoll (§7, §8).
- Modelle nach Weisung von Jens: Text-Umsetzer, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell, mechanische Aufträge auf dem kleinsten; das stärkste nur nach zweimaligem Scheitern an derselben Stelle (Ruling ins Ledger). Greift ein Kontingentlimit des mittleren Modells, läuft der Auftrag auf dem kleinsten Modell weiter und die Abnahme vermerkt es in §8. Task 1 läuft trotz seines kurzen Umfangs auf dem mittleren Modell (sachliche Einordnung eines Streitstands, keine reine Mechanik).
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe7/progress.md` (git-ignoriert), am Ende gesammelt ins Abnahmeprotokoll.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Gymnasialtext `titan` (Ozeanfrage) | 2 Texte |
| 2 | Körper `mimas` | 2 Texte, `docs/belege/hochschule/objekt-mimas.md`, `src/data/literatur.ts` |
| 3 | Körper `tethys` | 2 Texte, `docs/belege/hochschule/objekt-tethys.md`, `src/data/literatur.ts` |
| 4 | Körper `dione` | 2 Texte, `docs/belege/hochschule/objekt-dione.md`, `src/data/literatur.ts` |
| 5 | Körper `rhea` | 2 Texte, `docs/belege/hochschule/objekt-rhea.md`, `src/data/literatur.ts` |
| 6 | Körper `iapetus` | 2 Texte, `docs/belege/hochschule/objekt-iapetus.md`, `src/data/literatur.ts` |
| 7 | Szene `iapetus-schief` | 2 Texte, `docs/belege/hochschule/szene-iapetus-schief.md`, `src/data/literatur.ts` |
| 8 | Abnahme | `docs/phase4d-etappe7-abnahme.md`, `README.md` |

Hochschultexte liegen unter `src/data/texte/<de|en>/hochschule/<art>-<kennung>.md`. Kennungen: `mimas`, `tethys`, `dione`, `rhea`, `iapetus` (Körper, `src/data/bodies/saturn-monde.ts`), Szene `iapetus-schief` wie in `src/data/scenes.ts` (Index 15, am Array gegengeprüft: `grep -n "id: '" src/data/scenes.ts` zählt 0-basiert erdaufgang, saturn-streiflicht, mondtanz, ferne-sonne, systemblick, merkurjagd, jupiter-vorbeiflug, galileisches-schattenspiel, phobos-tiefflug, pluto-charon, saturn-ringkante, ringdurchflug, titan-dunst, enceladus-hell, triton-rueckwaerts, **iapetus-schief** (15), uranus-gekippt, ceres-guertel, mondfinsternis). Task 1 ändert ausschließlich Gymnasialtexte, keine neuen Hochschuldateien.

**Testzahlen:** Ausgangsstand `master` 53a1d63 (Abnahme 4d-6 mit Nachträgen): 4475 Tests, Katalog `src/data/literatur.ts` 531 Einträge, Hauptchunk 1 386,97 kB, Prüfskript 552 s bei 531 Einträgen (4 bekannte Warnungen: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` und `sanchez-lavega-2011` Konsortial-Byline). Im Dateitest `src/data/texte/dateien.test.ts` erzeugt ein Hochschultext eines Körpers oder einer Szene weiterhin 11 Fälle (kein Themen-Text in dieser Etappe). Soll: 4475 + 12 × 11 = **4607**. Task 1 erzeugt keinen neuen Testfall (Gymnasialtexte unterliegen nicht der Gliederungs- oder Zwillingsprüfung aus Entwurf §5.5, die nur für Hochschultexte gilt); die bestehenden Dateitests bleiben grün. Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test`. Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

### Task 1: Gymnasialtext `titan`, Ozeanfrage als offen dargestellt

**Dateien:**
- Ändern: `src/data/texte/de/gymnasium/objekt-titan.md`, `src/data/texte/en/gymnasium/objekt-titan.md`

**Hintergrund:** Jens' Entscheidung vom 22.09.2026 (Abnahme 4d-6 §8: „Der Gymnasialtext `objekt-titan.md` (de/en) wird als kleiner Vorab-Task in Etappe 4d-7 nachgeführt … Ozean-Satz an den offenen Streitstand seit Petricca et al. 2025 anpassen"). Task 3 der Etappe 4d-6 hatte gemeldet, dass der Satz in Zeile 17–19 (DE: „Messungen von Cassini zeigen, wie stark sich Titan unter Saturns Gezeiten verformt; das spricht für einen Ozean aus Wasser tief unter der Eiskruste.") beziehungsweise Zeile 16–19 (EN: „Cassini's measurements show how strongly Titan deforms under Saturn's tides; this points to an ocean of water deep beneath the ice crust.") die Ozeanfrage als entschieden darstellt, obwohl sie seit [Petricca et al. 2025](literatur:petricca-2025) eine offene Streitfrage ist (Fachprüfung 4d-6 bestätigt, Befund H5, `task-3-befunde.md:119–127`). Der fachgeprüfte Hochschultext `src/data/texte/de/hochschule/objekt-titan.md` beschreibt den Streitstand in „Inneres" (rund Zeile 42–80) und im ersten Punkt von „Offene Fragen" (Zeile 232–240): Ein großer Realteil von $k_2$ sprach zunächst für eine dünne, vom Ozean entkoppelte Eisschale (Iess et al. 2012); eine andere Verarbeitung fand einen kleineren $k_2$, weiterhin als dünnerer oder weniger dichter Ozean gedeutet (Goossens et al. 2024); eine neue Auswertung erhält wieder den großen Realteil und misst erstmals einen großen Imaginärteil, was auf eine warme, dissipative Hochdruckeisschicht statt eines globalen Ozeans hindeutet (Petricca et al. 2025); ob Goossens' abweichender Wert an der Datenverarbeitung liegt, ist zwischen den Gruppen selbst strittig (Durante et al. 2026; Goossens et al. 2026).

**Schritte:**

- [ ] **Schritt 1:** `src/data/texte/de/hochschule/objekt-titan.md` Abschnitte „Inneres" und „Offene Fragen" lesen (Streitstand wie oben), dazu `docs/belege/hochschule/objekt-titan.md` für die zugehörigen Fundstellen.
- [ ] **Schritt 2:** `src/data/texte/de/gymnasium/objekt-titan.md` (22 Zeilen) und `src/data/texte/en/gymnasium/objekt-titan.md` (22 Zeilen) ganz lesen; Ton und Wortschatz des übrigen Texts (Schülerniveau, keine Formeln, keine Literaturverweise, kurze Sätze) beachten.
- [ ] **Schritt 3:** Den betroffenen Satz in beiden Fassungen so umformulieren, dass er die Ozeanfrage als offen darstellt (ein bis zwei Sätze, nicht wesentlich länger als der ersetzte Satz). Der Wortlaut leitet sich aus dem Hochschultext ab, ohne ihn zu zitieren und ohne `literatur:`-Verweis (Gymnasialtexte zitieren keine Literatur). Der Rest des Absatzes (Huygens-Landung, Szenen- und Quellenverweis) bleibt unverändert. Deutsche und englische Fassung dürfen im Wortlaut, nicht aber im Sinn voneinander abweichen.
- [ ] **Schritt 4:** `npx vitest run src/data` → PASS (kein neuer Testfall, bestehende Dateitests bleiben grün).
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/gymnasium/objekt-titan.md src/data/texte/en/gymnasium/objekt-titan.md
git commit -m "Gymnasialtext Titan: Ozeanfrage als offen dargestellt"
```

Keine Fachprüfung (kein Hochschultext, Entwurf §6.3 gilt nur für Hochschultexte); der Controller liest den Diff vor dem nächsten Task und vermerkt Auffälligkeiten im Ledger. Modell: mittleres.

---

## Gemeinsame Vorgaben für Task 2 bis 7 (Texte)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den fachgeprüften Hochschultexten als Maßstab für Tiefe, Ton und Belegdichte: `objekt-enceladus.md` und `objekt-callisto.md` für die mittelgroßen bis großen Monde dieser Etappe, `objekt-phobos.md` für den knappsten Richtwert, `szene-saturn-ringkante.md` und `szene-galileisches-schattenspiel.md` für die Szene. Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang.

**Ablauf je Task**

1. **Vorlage lesen:** den passenden fachgeprüften Text in beiden Fassungen und seine Belegliste unter `docs/belege/hochschule/` (Form der Belegliste, Abschnitt „Im Modell"). Dazu den Gymnasialtext derselben Kennung, damit der Hochschultext ihm nicht widerspricht (bei Titan ist er seit Task 1 bereits nachgeführt — nicht erneut ändern); findet der Umsetzer im Gymnasialtext einen sachlichen Fehler, meldet er ihn im Bericht (nicht ändern).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (Node mit Typentfernung oder Vite-SSR aus dem Projektverzeichnis, nicht versioniert). Werte des Datenblocks aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten.
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf (steht keine Websuche zur Verfügung, mit WebFetch über Crossref-API `https://api.crossref.org/works/<doi>`, doi.org, arXiv, ADS, Verlagsseiten; im Bericht vermerken): zuerst nach neueren Übersichtsartikeln und Cassini-Auswertungen suchen (auch spätere Nachauswertungen bis 2026), auch wenn der Stoff bekannt scheint. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, Band, Seite und DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren. Einträge, die schon im Katalog stehen (`src/data/literatur.ts`, 531 Einträge, darunter mit Saturnmond-Bezug `tajeddine-2014`, `cuk-2024`, `petricca-2025`, `iess-2012`, `durante-2019`, `durante-2026`, `goossens-2024`, `goossens-2026`, `lainey-2020`, `magnanini-2026`, `mankovich-2021`, `jacobson-2022`, `militzer-2023`, `wang-2024a`, `fuller-2016`, `read-2018`, `baland-2011`, `downey-2025`, `hemingway-2018`, `thomas-2016`, `miles-2025`, `mallama-2017`, `blackburn-2011`, `buratti-2022`, `verbiscer-2005`, `verbiscer-2007`, `howett-2010`, `archinal-2018`, `duriez-1992`, `peale-1969`, `porco-2007`, `smith-1981`, `porco-2005`, `nicholson-1996`, `murray-2000`), wiederverwenden statt doppelt anlegen; ihr Inhalt wird trotzdem für jede neue Aussage geöffnet.
4. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" leer:

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile — auch eigene Herleitungen (Beleg „Herleitung" mit Rechenweg) und Vergleiche; „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" oder „Nachrechnung am Code: <Datei>". Senkrechte Striche in Zellen als `\|` maskieren (jede Zeile hat genau sechs Zellen, Zelle 1 die Nummer). Querverweise zwischen Zeilen nach jeder Neunummerierung prüfen. Ein `quelle:`-Beleg muss die Aussage auf der Seite tatsächlich tragen.
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`; Körperschaften als Autor wie bei `cgpm-2022`. `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer; Vorabdrucke `erschienen: 'arXiv'`; beschreibende Zusätze englisch, Eigennamen original. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test). Kennungen gleicher Erstautoren und Jahre mit Buchstaben unterscheiden.
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen.
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile und Gliederung nach den Globalen Randbedingungen und Entwurf §5.1. Körper: `## Kenngrößen und Messung`, `## Inneres`, `## Oberfläche`, `## Atmosphäre und Magnetosphäre`, `## Bahn, Rotation und Dynamik`, `## Entstehung und Entwicklung`, `## Offene Fragen`, `## Im Modell` (englisch `Parameters and measurement`, `Interior`, `Surface`, `Atmosphere and magnetosphere`, `Orbit, rotation and dynamics`, `Formation and evolution`, `Open questions`, `In the model`). Szene: `## Was das Bild zeigt`, `## Hintergrund`, `## Modellgrenzen` (englisch `What the view shows`, `Background`, `Model limitations`).
   - „Im Modell" / „Modellgrenzen": was Orrery zur Kennung rechnet oder bewusst weglässt, mit Verweis `thema:modell`; jede Abweichung des Modells von der Wirklichkeit mit Größenordnung; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung. Stehen dieselben Modellzahlen schon in einem fachgeprüften Text (siehe unten „Modellzahlen aus fachgeprüften Texten"), dieselben Werte verwenden oder die Abweichung im Bericht begründen (Ruling 8).
   - „Offene Fragen": Streitfragen mit Belegen für beide Seiten, nicht entschieden, solange die Fachwelt es nicht getan hat.
   - Schluss `*Stand: September 2026*` / `*As of September 2026*`.
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit allen Nachträgen). Fehlt ein Befehl, ist das ein eigener Zwischen-Task, kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); Zahlenspannen sagen, wofür sie gelten.
   - Kein `$` außerhalb von Formeln; kein `|` am Absatzanfang außer in Tabellen.
8. **Verweise:** `objekt:`, `szene:`, `thema:` auf Kennungen aus `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts`. Sinnvolle Ziele dieser Etappe: `objekt:saturn`, `objekt:titan`, `objekt:enceladus`, die vier anderen Monde der Etappe, `thema:ringe`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:finsternis`, `thema:bahnelemente`, `thema:entstehung`, `thema:modell`, `szene:iapetus-schief`, `szene:saturn-ringkante`, `szene:enceladus-hell`. Höchstens ein Verweis je Ziel je `##`-Abschnitt; kein Verweis eines Texts auf sich selbst. Quellenkarten erscheinen automatisch für alle Kennungen in `fuer` (`src/data/quellen.ts`); `nssdc-saturnmonde`, `nasa-saturnmonde` und `jpl-satelliten` decken alle fünf Körper dieser Etappe bereits ab, `jpl-satelliten-bahnen` zusätzlich die Szene und `thema:bahnelemente`. Zitiert ein Text eine weitere Karte (etwa `pds-rings`, `nasa-cassini`, `esa-cassini-huygens`), ergänzt der Task ihr `fuer`-Feld in `src/data/quellen.ts` um die eigene Kennung (dann wird `quellen.ts` zur Ändern-Datei des Tasks); ein `quelle:`-Verweis ist keine Pflicht (Ruling 17).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht.
10. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen. Vorher `git status --short`: keine Reste aus Skripten im Quellbaum; eine vom Prüfer geänderte fremde Belegliste im Arbeitsbaum bleibt liegen und wird nicht mitcommittet.
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten. **Genau eine** Fachprüfung je Task. Der Auftrag verlangt ausdrücklich, die Spalte „Prüfung" **in die Datei** zu schreiben.
12. **Nacharbeit (genau eine):** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger; in der Nacharbeit wird **nicht gekürzt**. In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung`; alle anderen Prüfeinträge bleiben. Jede geänderte Zeile behält sechs Zellen mit der Nummer in Zelle 1 (Ruling 18 — Befund aus Abnahme 4d-6 §7). **Keine Nachprüfung:** Was der Umsetzer nicht beheben kann oder anders sieht als der Prüfer, notiert er mit Begründung im Ledger; die Abnahme führt es in §7 oder §8 auf.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste <art>-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Modellzahlen aus fachgeprüften Texten (gleichlautend übernehmen, Ruling 8):**
- `thema-gebundene-rotation.md`, Modelltabelle: Mimas 0,088 / 143,6° / 145,7°, Tethys 0,044 / 140,8° / 141,0°, Dione −0,061 / 130,5° / 130,0°, Rhea −0,018 / 5,9° / 5,8°, Iapetus 0,001 / 46,0° / 47,2° (Spaltenbedeutung dort nachlesen); Mimas' Librationsamplitude doppelt so groß wie hydrostatisch erwartet (Tajeddine et al. 2014); Abweichung von $360°/\dot L$ gegenüber der Umlaufzeit bei Mimas 0,54 %, bei Enceladus 0,32 %.
- `thema-resonanzen.md`, „Resonanzen der Saturnmonde" und „Im Modell": Mimas–Tethys 1:2 (4:2), Winkel $4\lambda_\mathrm{Te} - 2\lambda_\mathrm{Mi} - \Omega_\mathrm{Mi} - \Omega_\mathrm{Te}$, um 0°, Amplitude 95°, Periode 70 Jahre (Ćuk et al. 2024); Enceladus–Dione 1:2, Amplitude unter 1°; im Modell steht der Winkel von Mimas und Tethys zur Epoche bei −61,2° und wandert 13,3° je Jahrhundert, statt in 70 Jahren um 95° zu pendeln; Hyperion fehlt im Katalog.
- `thema-finsternis.md`: Schattenfenster von 18,2° bei Mimas bis 2,7° bei Titan; `MAX_OKKLUDER` 4: Saturn behält Titan, Tethys, Dione und Rhea, so dass Mimas, Enceladus und Iapetus dort nie einen Schatten werfen; von Saturn aus hat die Sonne im Mittel 0,028° Winkelradius.
- `thema-photometrie.md`: Iapetus dunkle Vorderseite (Cassini Regio) $A_\mathrm{bol} = 0{,}06 \pm 0{,}01$, helle Rückseite $0{,}25 \pm 0{,}03$ (Blackburn et al. 2011); Modellalbedo Iapetus 0,275, das arithmetische Mittel der Fact-Sheet-Hemisphärenwerte 0,05/0,5; das Materialmodell erreicht ohne Glanz und Fülllicht nur $0{,}640\,p$ statt der vollen Katalogalbedo $p$ — gilt für jeden Körper gleich, keine Enceladus- oder Iapetus-spezifische Ursache (Nacharbeit 4d-6 §7).
- `thema-ringe.md`: Mimas' 2:1-Resonanz fällt mit dem B-Ring-Außenrand und der Cassini-Teilung-Innenkante zusammen, die schärfste Kante im ganzen System (Esposito 2010; Cuzzi et al. 2010); Roche-Grenze für kompaktes Eis rund 129 000 km.
- `thema-bahnelemente.md`, „Übrige Monde" und „Im Modell": Saturnmonde nutzen oskulierende Horizons-Elemente zu J2000 im Bezug `parentEquator`; Knoten und Apsiden präzedieren mit Raten aus der JPL-Tabelle (Enceladus' und Diones Knoten stehen fest); Iapetus' Laplace-Ebene ist 14,8° gegen Saturns Äquator geneigt, seine Bahn 7,6° gegen diese Ebene, Knotenperiode 3130 Jahre, Laplace-Radius $59\,R_\mathrm{p}$ gegen Saturns eigenen $48{,}4\,R_\mathrm{p}$ (Tremaine et al. 2009); im Modell präzediert Iapetus' Knoten um Saturns Pol statt um den Laplace-Pol, Abweichung gegen Horizons 2050 um 0,71°, 2076 um 1,11°.
- `objekt-saturn.md`: Ring 74 658 bis 136 780 km, GM +5 ppm gegen Jacobson 2022, Rotation 10,656 h, Achsneigung 26,73°, Ringschatten-Restlicht 0,3.
- `objekt-enceladus.md`: Mimas' Inneres bleibt unklar — eine der aus Librationsbildern gemessenen Amplituden passt nur zu einem stark nichthydrostatischen Körper oder zu einem eigenen, dünneren Ozean, ohne dass beide Deutungen zu trennen wären (Tajeddine et al. 2014); die Enceladus–Dione-1:2-Resonanz hält Enceladus dauerhaft leicht exzentrisch.
- `szene-saturn-ringkante.md`: Umlaufzeiten Mimas 0,942 d, Enceladus 1,370 d, Tethys 1,888 d, Dione 2,737 d, Rhea 4,518 d; Bahnradien in Saturnradien Dione 6,49, Rhea 9,05.

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/<datei>` und `src/data/texte/en/hochschule/<datei>` mit der Belegliste `docs/belege/hochschule/<datei>` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder die Crossref-API, arXiv, ADS), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Kommentare im Code sind kein Beleg; rechne Aussagen über das Modell am Code selbst nach (Skripte nur im Scratchpad). Es gibt nur diese eine Prüfrunde: Konzentriere dich auf Fehler, die die Aussage falsch machen, und auf Belege, die die Aussage nicht stützen; Stil und Umfang nur, wenn sie das Verständnis behindern. Prüfe:
> 1. Stützt die zitierte Arbeit die Aussage im Text?
> 2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle?
> 3. Passen Aussagen über Orrery zum Code (`src/data/`, `src/sim/`, `src/render/`, `src/ui/info/datenzeilen.ts`), und erklärt „Im Modell" beziehungsweise „Modellgrenzen" jede Abweichung, auch gegenüber dem Datenblock?
> 4. Stimmen Dimensionen und Größenordnungen der Formeln?
> 5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?
> 6. Sind Streitfragen als solche dargestellt, mit Belegen für beide Seiten?
> 7. Widerspricht der Text einem fachgeprüften Hochschultext (`src/data/texte/de/hochschule/`) in Zahlen oder Aussagen über das Modell?
> 8. Enthält der Text oder die Belegliste Prozesssprache (Task, Ruling, Brief), die in einem veröffentlichten Text nichts verloren hat?
>
> **Trage je Zeile der Belegliste in der Spalte „Prüfung" tatsächlich in die Datei ein** (mit dem Edit-Werkzeug, sobald die Zeile fertig ist): `ok (…)`, `Fehler: …` oder `Hinweis: …`; jede Tabellenzeile behält sechs Zellen mit der Nummer in Zelle 1, senkrechte Striche im Eintrag als `\|` maskieren. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte, keinen Code, keinen anderen Teil der Belegliste; kein Commit, kein Browser, keine Subagenten. Schreibe die Befundliste fortlaufend nach `<Befunddatei>` (Klasse Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich, Widerspruch zu einem fachgeprüften Text, Prozesssprache; Hinweis: Ton, Vollständigkeit, besserer Beleg; je Befund Fundstelle Datei:Zeile beider Fassungen und ein konkreter Behebungsvorschlag), am Ende eine Zählung ok/Fehler/Hinweis. Rückgabe höchstens 12 Zeilen: Zählung ok/Fehler/Hinweis, Fehler als Einzeiler, Bestätigung, dass die Prüfspalte in der Datei steht, Pfad der Befunddatei.

---

### Task 2: Körper `mimas`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-mimas.md`, `src/data/texte/en/hochschule/objekt-mimas.md`, `docs/belege/hochschule/objekt-mimas.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts` (`fuer` ergänzen, falls eine weitere Karte zitiert wird)

**Schnittstellen:**
- Konsumiert: fachgeprüfte Texte `objekt-saturn` (Ringgeometrie, Okkluderwahl, Achsneigung), `thema-ringe` (Mimas' Resonanz am B-Ring-Außenrand), `thema-resonanzen` (Mimas–Tethys 4:2), `thema-gebundene-rotation` (Librationsbefund Tajeddine 2014), `thema-finsternis` (Mimas nie Okkluder), `thema-bahnelemente` (`parentEquator`, Fixture-Befund 20 %), `objekt-enceladus` (Zeile 58–61, Verweis auf Mimas' unklares Inneres).
- Produziert: Hochschultext `objekt:mimas`; Task 3 (Tethys) übernimmt die 4:2-Resonanzzahlen.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Mimas` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1000 bis 2000 Wörter je Fassung.
- Inhalt mindestens: GM (aus `quelle:jpl-satelliten`, gegen $G \times$ Katalogmasse mit ppm-Abweichung wie bei den übrigen Körpern nachrechnen), Radius 198,5 km (volumengleicher Kugelradius aus 208×197×191 km), Dichte rund 1,15 g cm⁻³ (selbst aus `radiusKm` und `massKg` nachrechnen), Masse 3,79·10¹⁹ kg; Herschel-Krater (rund 139 km Durchmesser, etwa ein Drittel von Mimas' eigenem Durchmesser, die „Todesstern"-Erscheinung) als dominierendes Oberflächenmerkmal, Frage nach dem Überleben des Mondes bei diesem Einschlag; Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren, Beleg. Inneres: die aus Cassini-Bildern gemessene Libration ist doppelt so groß wie für einen hydrostatischen, homogenen Körper erwartet — entweder ein stark längliches, nichthydrostatisches Gesteins-Eis-Inneres oder ein eigener, unter einer dünnen Eisschale verborgener Ozean (Tajeddine et al. 2014, Zahlen wie `thema-gebundene-rotation`); neuere Bahnentwicklungsdaten als möglicher weiterer Hinweis auf innere Wärme (Lainey et al. 2024). Oberfläche: Herschel-Krater und seine Zentralstrukturen, alte, dicht übersäte Kraterlandschaft, Temperaturanomalie (v-förmiges „Pac-Man"-Muster) durch unterschiedliche Bestrahlung der Vorder- und Rückseite. Atmosphäre und Magnetosphäre: keine eigene Atmosphäre, Lage innerhalb von Saturns Magnetosphäre und E-Ring, nur kurze Wechselwirkung mit geladenen Teilchen. Bahn, Rotation und Dynamik: Bahnelemente, gebundene Rotation, 4:2-Mittelbewegungsresonanz mit Tethys (Verweis `thema:resonanzen`, Zahlen von dort), Rolle als Resonanzquelle für den B-Ring-Außenrand und die Cassini-Teilung (Verweis `thema:ringe`, Zahlen von dort). Entstehung und Entwicklung: Bildung in der Saturn-Scheibe, Frage nach Herschels Alter und der Überlebenswahrscheinlichkeit des Mondes, Diskussion um ein jüngeres statt ursprüngliches Saturnsystem (Verweis `thema:entstehung`).
- `## Offene Fragen` (Pflicht): Ozean oder stark nichthydrostatisches Inneres (Tajeddine et al. selbst lassen beide Deutungen offen); wie der Herschel-Einschlag den Mond nicht zerlegt hat; Ursache und Alter der Temperaturanomalie.
- `## Im Modell`: Bahnelemente aus `saturn-monde.ts` (oskulierende Horizons-Elemente J2000, `frame: 'parentEquator'`, `lpDot` 36 511,1562, `nodeDot` −36 511,1562 — Einheit und Periode selbst nachrechnen; Zahlen wie `thema-bahnelemente`); Umlaufzeit aus `LDot` gegen 0,942 d (aus `szene-saturn-ringkante` übernehmen, Übernahme im Bericht nennen); Fixture-Befund: `monde.fixture.test.ts` erlaubt Mimas 20 % statt 5 % Positionsabweichung wegen der 4:2-Librationsschwingung (Kopfkommentar in `saturn-monde.ts`, Zeilen 116–141 — als Beispiel dafür beschreiben, dass ein linear fortgeschriebenes Element keine gebundene Schwingung abbilden kann, nicht als Fehler); Pol `raDeg` 40,66 / `decDeg` 83,52 — identisch mit Enceladus, Tethys und Dione im Datensatz (SPICE-Kernel, keine individuelle Präzessionsrechnung je Mond — als Modellvereinfachung nennen); Albedo 0,6 als geometrische Albedo; Mimas ist nie Okkluder Saturns (Zahlen wie `thema-finsternis`, `objekt-saturn`); Maßstab (`isSatellite`); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/saturn-monde.ts` (Kopfkommentar vollständig, Eintrag `mimas`), `src/data/bodies/saturn.ts`, `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts` (`waehleOkkluder`, `MAX_OKKLUDER`), `src/render/rings.ts` (Mimas als Resonanzquelle), `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Mimas-Textur), `src/data/index.test.ts`, `monde.fixture.test.ts` (`POSITIONS_SCHRANKE_ANTEIL`), Hochschultexte `objekt-saturn`, `thema-ringe`, `thema-resonanzen`, `thema-gebundene-rotation`, `thema-finsternis`, `thema-bahnelemente`.
- Verweise: `objekt:saturn`, `objekt:tethys`, `objekt:enceladus`, `thema:ringe`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:finsternis`, `thema:bahnelemente`, `thema:entstehung`, `thema:modell`; Karten zu `objekt:mimas`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Tajeddine et al. 2014 (`tajeddine-2014`, bereits im Katalog: *Science* 346, 322–324); Lainey et al. 2024, Bahnentwicklung und Ozeanhypothese (*Nature* 626, 280, Fundstelle prüfen); Ćuk et al. 2024 (`cuk-2024`), Mimas–Tethys-Resonanz; Esposito 2010 und Cuzzi et al. 2010 (siehe `thema-ringe`), Mimas-Resonanz am B-Ring; Smith et al. 1981 (`smith-1981`) oder Schenk 2010, Voyager-/Cassini-Imaging des Herschel-Kraters (Fundstelle prüfen); Thomas 2010, Form aus Cassini-Bildern (*Icarus* 208, 395, Fundstelle prüfen); Howett et al. 2011 oder Buratti et al. 2019, Temperaturanomalie/„Pac-Man"-Muster (Fundstelle prüfen); Archinal et al. 2018 (`archinal-2018`), Pol.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit, Präzessionsperioden und Fixture-Befund im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test`; Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-mimas.md src/data/texte/en/hochschule/objekt-mimas.md docs/belege/hochschule/objekt-mimas.md src/data/literatur.ts
git commit -m "Hochschultext Mimas mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 3: Körper `tethys`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-tethys.md`, `src/data/texte/en/hochschule/objekt-tethys.md`, `docs/belege/hochschule/objekt-tethys.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 2 (Mimas' 4:2-Resonanzzahlen); fachgeprüfte Texte `objekt-saturn`, `thema-resonanzen`, `thema-finsternis` (Tethys ist Okkluder), `thema-bahnelemente`.
- Produziert: Hochschultext `objekt:tethys`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Tethys` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1000 bis 2000 Wörter je Fassung.
- Inhalt mindestens: GM, Radius 530,6 km (volumengleich aus 538×528×526 km), Dichte rund 0,98 g cm⁻³ (selbst nachrechnen) — nahe reinem Wassereis, einer der am wenigsten dichten großen Monde des Sonnensystems; Masse 6,18·10²⁰ kg. Odysseus-Krater (rund 450 km Durchmesser, fast halb so groß wie Tethys selbst) und Ithaca Chasma (ein rund 2000 km langes, bis 100 km breites Grabensystem über fast drei Viertel des Umfangs) als markanteste Oberflächenformen; Streitfrage, ob Ithaca Chasma mit Odysseus zusammenhängt oder aus dem Gefrieren eines frühen Ozeans stammt. Lagrange-Monde Telesto (L4) und Kalypso (L5) auf Tethys' eigener Bahn (nicht im Katalog dargestellt — nennen). Inneres: die geringe Dichte spricht gegen einen großen Gesteinsanteil; kein gesichertes Schwerefeldmodell (kein naher Cassini-Vorbeiflug mit Doppler-Verfolgung wie bei Enceladus oder Rhea); Vergleich zu Mimas' und Diones dichterem Inneren. Atmosphäre und Magnetosphäre: keine, Lage in Saturns Magnetosphäre nahe dem äußeren E-Ring. Bahn, Rotation und Dynamik: Bahnelemente, gebundene Rotation, 4:2-Resonanz mit Mimas über die Neigungen (Verweis `thema:resonanzen`), auffällig kurze Apsidendrift-Periode im Datensatz (`lpDot` 7 192 773,9864 — Folge der extrem kleinen freien Exzentrizität, Kopfkommentar in `saturn-monde.ts` Zeilen 266–269, selbst nachrechnen statt den Kommentar zu übernehmen). Entstehung und Entwicklung: Bildung in der Saturn-Scheibe, Alter von Odysseus und Ithaca Chasma, mögliche spätere Wiedererwärmung.
- `## Offene Fragen` (Pflicht): Ursache von Ithaca Chasma (globale Ausdehnung durch Gefrieren gegen Odysseus-Folge); fehlendes Schwerefeldmodell — wie dicht ist der Kern wirklich?
- `## Im Modell`: Bahnelemente (`saturn-monde.ts`, `frame: 'parentEquator'`); `lpDot`/`nodeDot` und ihre Perioden selbst nachrechnen (Zahlen wie `thema-bahnelemente`); Umlaufzeit aus `LDot` gegen 1,888 d (aus `szene-saturn-ringkante` übernehmen, Übernahme nennen); Pol identisch mit Mimas, Enceladus und Dione; Albedo 0,8; Tethys ist einer der vier Okkluder Saturns (Zahlen wie `thema-finsternis`, `objekt-saturn`); keine Ringrelevanz im Renderer, obwohl Tethys' Bahn real nahe am äußeren Rand des E-Rings liegt; Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/saturn-monde.ts` (Eintrag `tethys`, Kommentar `lpDot`), `src/data/bodies/saturn.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/rings.ts` (Ringbezug), `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md`, `src/data/index.test.ts`, Hochschultexte `objekt-mimas` (Task 2), `objekt-saturn`, `thema-resonanzen`, `thema-finsternis`, `thema-bahnelemente`.
- Verweise: `objekt:saturn`, `objekt:mimas`, `objekt:dione`, `thema:resonanzen`, `thema:finsternis`, `thema:bahnelemente`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:modell`; Karten zu `objekt:tethys`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Ćuk et al. 2024 (`cuk-2024`), Resonanz; Giese et al. 2007, Ithaca Chasma und Topografie (Fundstelle prüfen); Moore et al. 2004, Geologie von Tethys (Fundstelle prüfen, vermutlich *Icarus*); Thomas 2010, Form (*Icarus* 208, 395, Fundstelle prüfen); Smith et al. 1981 (`smith-1981`), Voyager-Imaging.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit, Präzessionsperioden und Dichte im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-tethys.md src/data/texte/en/hochschule/objekt-tethys.md docs/belege/hochschule/objekt-tethys.md src/data/literatur.ts
git commit -m "Hochschultext Tethys mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 4: Körper `dione`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-dione.md`, `src/data/texte/en/hochschule/objekt-dione.md`, `docs/belege/hochschule/objekt-dione.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 2, 3 (Mimas–Tethys-Resonanz als Vergleich); fachgeprüfte Texte `objekt-saturn`, `objekt-enceladus` (Enceladus–Dione-1:2-Resonanz bereits dort beschrieben), `thema-resonanzen`, `thema-finsternis` (Dione ist Okkluder), `thema-bahnelemente` (`nodeDot` 0).
- Produziert: Hochschultext `objekt:dione`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Dione` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1000 bis 2000 Wörter je Fassung.
- Inhalt mindestens: GM, Radius 561,3 km (563×561×560 km), Dichte rund 1,48 g cm⁻³ (selbst nachrechnen) — deutlich dichter als Tethys, moderater Gesteinsanteil; Masse 1,10·10²¹ kg. „Wispy terrain": auf der der Bahnbewegung entgegengesetzten Hemisphäre helle, netzartige Streifen, die Voyager als Frostablagerungen deutete, Cassini aber als helle Eisklippen tektonischer Bruchzonen zeigte; alte, dicht bekraterte Führungsseite im Gegensatz dazu. Lagrange-Monde Helene (L4) und Polydeuces (L5), nicht im Katalog dargestellt. Ozeanhypothese aus Form- und Librationsdaten, schwächer belegt als bei Enceladus (Beuthe et al. 2016). Inneres: moderate Dichte, mögliche frühere oder gegenwärtige Restozeanschicht als Streitfrage, kein direktes Schwerefeldmodell aus nahem Doppler-Vorbeiflug wie bei Enceladus. Atmosphäre und Magnetosphäre: keine, sehr dünne Sauerstoff-Exosphäre nur indirekt vermutet (kein direkter Nachweis wie bei Rhea — knapp nennen, Details bei Rhea). Bahn, Rotation und Dynamik: Bahnelemente, gebundene Rotation, 1:2-Resonanz mit Enceladus (Verweis `thema:resonanzen`, Zahlen von dort — die Resonanz erhält Enceladus' Exzentrizität und damit seine Gezeitenheizung), `nodeDot` 0 im Datensatz (i = 0,029°, dieselbe Tabellenausnahme wie bei Enceladus, Kopfkommentar `saturn-monde.ts` Zeilen 104–114 — selbst erklären, nicht nur zitieren). Entstehung und Entwicklung: Bildung in der Saturn-Scheibe, Alter des „wispy terrain" gegenüber Enceladus' junger Oberfläche als Vergleich unterschiedlich starker Gezeitenheizung.
- `## Offene Fragen` (Pflicht): Restozean oder vollständig gefrorenes Inneres; Alter und Entstehungsmechanismus der Eisklippen; warum Dione trotz derselben Resonanzfamilie so viel weniger geologisch aktiv ist als Enceladus.
- `## Im Modell`: Bahnelemente (`saturn-monde.ts`, `frame: 'parentEquator'`), `nodeDot` 0 begründen (Tabellensonderfall, siehe oben; Zahlen wie `thema-bahnelemente`); Umlaufzeit aus `LDot` gegen 2,737 d (aus `szene-saturn-ringkante` übernehmen, Übernahme nennen); Pol identisch mit Mimas, Tethys und Enceladus; Albedo 0,7; Dione ist einer der vier Okkluder Saturns (Zahlen wie `thema-finsternis`, `objekt-saturn`); Helene und Polydeuces fehlen im Katalog vollständig; Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/saturn-monde.ts` (Eintrag `dione`, Kopfkommentar zum Sonderfall Enceladus/Dione), `src/data/bodies/saturn.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md`, `src/data/index.test.ts`, Hochschultexte `objekt-enceladus`, `objekt-saturn`, `thema-resonanzen`, `thema-finsternis`, `thema-bahnelemente`.
- Verweise: `objekt:saturn`, `objekt:enceladus`, `objekt:tethys`, `thema:resonanzen`, `thema:finsternis`, `thema:bahnelemente`, `thema:innerer-aufbau`, `thema:gezeiten`, `thema:entstehung`, `thema:modell`; Karten zu `objekt:dione`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Beuthe et al. 2016, Ozeanhypothese aus Form (*Geophysical Research Letters* 43, 10088); Ćuk et al. 2024 (`cuk-2024`), Resonanz; Stephan et al. 2010 oder Wagner et al. 2009, „wispy terrain"/Eisklippen (Fundstelle prüfen); Jaumann et al. 2009, Geologie von Dione (Fundstelle prüfen); Smith et al. 1981 (`smith-1981`), Voyager-Imaging.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit, `nodeDot`-Sonderfall und Dichte im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-dione.md src/data/texte/en/hochschule/objekt-dione.md docs/belege/hochschule/objekt-dione.md src/data/literatur.ts
git commit -m "Hochschultext Dione mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 5: Körper `rhea`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-rhea.md`, `src/data/texte/en/hochschule/objekt-rhea.md`, `docs/belege/hochschule/objekt-rhea.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 4 (Vergleich zu Dione); fachgeprüfte Texte `objekt-saturn`, `thema-finsternis` (Rhea ist Okkluder), `thema-bahnelemente`, `thema-ringe` (widerlegte Ringhypothese als Gegenbeispiel).
- Produziert: Hochschultext `objekt:rhea`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Rhea` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1000 bis 2000 Wörter je Fassung.
- Inhalt mindestens: GM, Radius 763,3 km (765×763×762 km), Dichte rund 1,24 g cm⁻³ (selbst nachrechnen), Masse 2,31·10²¹ kg — der zweitgrößte Saturnmond, aber deutlich kleiner als Titan. Schwerefeld- und Trägheitsmomentmessungen aus nahen Cassini-Vorbeiflügen sprechen für ein vergleichsweise homogenes Gemisch aus Eis und Gestein statt einer starken Differenzierung, anders als bei großen, differenzierten Eismonden erwartet (Iess et al. 2007; Anderson und Schubert 2007). Tabelle der Kenngrößen. Inneres: die geringe Differenzierung als Befund, Streitfrage zu ihrer Ursache (unvollständige Akkretionswärme, spätere Vermischung). Oberfläche: alte, dicht bekraterte Landschaft, große Einschlagbecken (etwa Tirawa), schwächeres „wispy terrain" als bei Dione auf der Trailing-Hemisphäre. Atmosphäre und Magnetosphäre: dünne Sauerstoff-Kohlendioxid-Exosphäre, von Cassinis Massenspektrometer INMS direkt nachgewiesen — der erste direkte Nachweis einer oxidierenden Exosphäre an einem Eismond außerhalb Europas (Teolis et al. 2010), vermutlich aus Radiolyse von Oberflächeneis oder CO₂-Ausgasung. Bahn, Rotation und Dynamik: Bahnelemente, gebundene Rotation, Lage im äußeren System zwischen Titan und den inneren Monden. Entstehung und Entwicklung: die geringe Differenzierung als Randbedingung für Akkretionsmodelle; einst aus Plasmamessungen vermutetes, aber durch gezielte Cassini-Bildsuchen widerlegtes eigenes Ringsystem (Jones et al. 2008; Tiscareno et al. 2010) als Beispiel dafür, wie eine indirekte Messung falsch gedeutet werden kann.
- `## Offene Fragen` (Pflicht): Ursache der geringen Differenzierung; Quelle und Erhaltungsmechanismus der O₂/CO₂-Exosphäre.
- `## Im Modell`: Bahnelemente (`saturn-monde.ts`, `frame: 'parentEquator'`); Umlaufzeit aus `LDot` gegen 4,518 d (aus `szene-saturn-ringkante` übernehmen, Übernahme nennen); Pol `raDeg` 40,38 / `decDeg` 83,55 — eigener, leicht von den vier inneren Monden abweichender Wert im Datensatz (anders als bei Mimas/Tethys/Dione/Enceladus keine geteilte Zahl); Albedo 0,7; Rhea ist einer der vier Okkluder Saturns (Zahlen wie `thema-finsternis`, `objekt-saturn`); kein Ringsystem und keine Exosphäre im Renderer — im Fall des Rings zufällig deckungsgleich mit dem realen (widerlegten) Befund, kein Modellfehler; Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/saturn-monde.ts` (Eintrag `rhea`), `src/data/bodies/saturn.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md`, `src/data/index.test.ts`, Hochschultexte `objekt-dione`, `objekt-saturn`, `thema-finsternis`, `thema-bahnelemente`, `thema-ringe`.
- Verweise: `objekt:saturn`, `objekt:dione`, `objekt:titan`, `thema:innerer-aufbau`, `thema:finsternis`, `thema:bahnelemente`, `thema:ringe`, `thema:entstehung`, `thema:modell`; Karten zu `objekt:rhea`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Iess et al. 2007, Schwerefeld und Trägheitsmoment (*Icarus* 190, 585, Fundstelle prüfen); Anderson und Schubert 2007, homogenes Inneres (Fundstelle prüfen, vermutlich *Science* oder *Geophysical Research Letters*); Teolis et al. 2010, O₂/CO₂-Exosphäre (*Science* 330, 1813); Jones et al. 2008, vermutetes Ringsystem (*Science* 319, 1380); Tiscareno et al. 2010, Bildsuche ohne Ringbefund (Fundstelle prüfen, vermutlich *Geophysical Research Letters*); Smith et al. 1981 (`smith-1981`), Voyager-Imaging.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit und Dichte im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-rhea.md src/data/texte/en/hochschule/objekt-rhea.md docs/belege/hochschule/objekt-rhea.md src/data/literatur.ts
git commit -m "Hochschultext Rhea mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 6: Körper `iapetus`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-iapetus.md`, `src/data/texte/en/hochschule/objekt-iapetus.md`, `docs/belege/hochschule/objekt-iapetus.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 5 (Rhea, Vergleich Okkluderrolle); fachgeprüfte Texte `objekt-saturn`, `thema-photometrie` (Albedo-Dichotomie), `thema-bahnelemente` (Laplace-Ebene, Knotenpräzession), `thema-gebundene-rotation` (79,3-Tage-Kopplung), `thema-finsternis` (Iapetus nie Okkluder).
- Produziert: Hochschultext `objekt:iapetus`; Task 7 (Szene) übernimmt Iapetus' Bahn- und Umlaufzahlen.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Iapetus` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1000 bis 2000 Wörter je Fassung.
- Inhalt mindestens: GM, Radius 734,5 km (dreiachsig 746×746×712 km — die Abplattung ist ein Relikt eines früheren, schnelleren Spins), Dichte rund 1,09 g cm⁻³ (selbst nachrechnen), Masse 1,81·10²¹ kg. Zweifarbigkeit: dunkle Führungshemisphäre (Cassini Regio, $A_\mathrm{bol} \approx 0{,}06$) gegen helle folgende Hemisphäre ($A_\mathrm{bol} \approx 0{,}25$) — der extremste Albedokontrast eines einzelnen Körpers im Sonnensystem (Zahlen wie `thema-photometrie`); thermische Segregation als Erklärungsmodell: exogener Staub (vermutlich aus dem retrograden Phoebe-Ring, Verbiscer et al. 2009) dunkelt zunächst die Führungsseite, wärmere Bereiche verlieren Eis an kältere, hellere Bereiche, ein sich selbst verstärkender Rückkopplungsprozess (Spencer und Denk 2010). Äquatorwulst: ein bis zu rund 20 km hoher Gebirgszug über etwa 110° Länge fast exakt auf dem Äquator, einzigartig im Sonnensystem; Streitfrage zwischen Relikt eines früheren, schnelleren Spins beim Abbremsen (Castillo-Rogez et al. 2007) und kollabiertem Ringmaterial. Tabelle der Kenngrößen. Inneres: geringe Differenzierung, frühe radiogene Wärme als mögliche Erklärung für die trotz der großen Bahnentfernung gebundene Rotation. Bahn, Rotation und Dynamik: mit 79,3 Tagen Umlaufzeit gebundene Rotation trotz der großen Entfernung von Saturn — nur durch eine sehr lange frühe Abbremsphase erklärbar (Verweis `thema:gebundene-rotation`); Bahnneigung 15,47° gegen Saturns Äquator, die stärkste der klassischen Saturnmonde, als Folge der großen Bahnentfernung, bei der die Laplace-Ebene von Saturns Äquator zur Ekliptik überwechselt (Verweis `thema:bahnelemente`, Zahlen von dort). Entstehung und Entwicklung: Bildung weit draußen im Saturnsystem, Alter des Äquatorwulsts als offene Frage, Phoebe-Ring als fernste, retrograde Staubquelle.
- `## Offene Fragen` (Pflicht): Anteil primordialer gegen thermisch verstärkter Verdunkelung; genauer Entstehungsmechanismus des Äquatorwulsts (in-situ-Kollaps eines früheren Rings gegen Relikt-Wulst); ob das Material des Wulsts endogen oder eingefallen ist.
- `## Im Modell`: Bahnelemente aus `saturn-monde.ts` (oskulierende Horizons-Elemente, $i = 15{,}47013984°$ direkt gegen Saturns Äquator — die tatsächlich einzusetzende Größe laut Kopfkommentar, kein Umweg über den Laplace-Pol mehr nötig, Zeilen 405–410); Knotenpräzession um Saturns Pol statt um den Laplace-Pol, Abweichung gegen Horizons 2050 um 0,71°, 2076 um 1,11° (Zahlen wie `thema-bahnelemente`); Umlaufzeit aus `LDot` gegen 79,33 Tage (Rückrechnung; wird von Task 7 als Ausgangspunkt übernommen, im Bericht so vermerken); `rotationPeriodH` 1903,94405 h = 79,33 d — exakt gleich der Umlaufzeit, das Modell stellt die gebundene Rotation korrekt dar; Pol `raDeg` 318,16 / `decDeg` 75,03 — anders als bei den vier inneren Monden ein eigener, individuell gemessener Wert; Albedo 0,275 als einzelner Skalar, das arithmetische Mittel der Fact-Sheet-Hemisphärenwerte 0,05/0,5 (Zahlen wie `thema-photometrie`) — die reale Zweiteilung zeigt seit Task 11 (Phase 4c) nur die Textur, nicht dieser Wert; Iapetus ist nie Okkluder Saturns (Zahlen wie `thema-finsternis`, `objekt-saturn`); Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/saturn-monde.ts` (Eintrag `iapetus`, Kommentar Zeilen 405–436), `src/data/bodies/saturn.ts`, `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`), `src/sim/frames.ts` (`poleVector`), `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Iapetus-Textur, Dichotomie), `src/data/index.test.ts`, Hochschultexte `objekt-rhea`, `objekt-saturn`, `thema-photometrie`, `thema-bahnelemente`, `thema-gebundene-rotation`, `thema-finsternis`.
- Verweise: `objekt:saturn`, `objekt:titan`, `objekt:rhea`, `thema:bahnelemente`, `thema:gebundene-rotation`, `thema:photometrie`, `thema:finsternis`, `thema:entstehung`, `thema:modell`, `szene:iapetus-schief`; Karten zu `objekt:iapetus`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:jpl-satelliten`, `quelle:jpl-satelliten-bahnen`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Spencer und Denk 2010, thermische Segregation (*Science* 327, 432); Castillo-Rogez et al. 2007, Äquatorwulst und Frühgeschichte (*Icarus* 190, 179); Verbiscer et al. 2009, Phoebe-Ring als Staubquelle (im Katalog noch nicht vorhanden, Titel und Zeitschrift an der Quelle prüfen — vermutlich *Nature*, Fundstelle prüfen); Blackburn et al. 2011 (`blackburn-2011`, bereits im Katalog), Albedowerte; Tremaine et al. 2009 (siehe `thema-bahnelemente`), Laplace-Radius; Denk et al. 2010, Cassini-Vorbeiflug September 2007 und Bildkampagne (Fundstelle prüfen); Thomas 2010, Form (*Icarus* 208, 395, Fundstelle prüfen).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit, Knotenpräzessionsabweichung, Rotation-Umlauf-Gleichheit und Dichte im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-iapetus.md src/data/texte/en/hochschule/objekt-iapetus.md docs/belege/hochschule/objekt-iapetus.md src/data/literatur.ts
git commit -m "Hochschultext Iapetus mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 7: Szene `iapetus-schief`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-iapetus-schief.md`, `src/data/texte/en/hochschule/szene-iapetus-schief.md`, `docs/belege/hochschule/szene-iapetus-schief.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 6 (Iapetus' Bahnneigung 15,47°, Laplace-Ebene, Umlaufzeit 79,33 d, Knotenpräzessionsabweichung), fachgeprüfte Texte `objekt-saturn` (Ringgeometrie 74 658–136 780 km, Achsneigung 26,73°), `thema-bahnelemente` (Laplace-Radius-Argument).
- Produziert: Hochschultext `szene:iapetus-schief`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Die geneigte Bahn des Iapetus` / `# Scene: The tilted orbit of Iapetus` (Titel aus `ui/i18n`, `scene.iapetusSchief`, wie die Gymnasialfassung). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung, Obergrenze 1200.
- **Was das Bild zeigt:** Eintrag `iapetus-schief`, Index 15: Bahntyp `orbit`, `targetId` `saturn` (kein `lookAtId` — die Kamera zielt auf Saturn selbst, nicht auf Iapetus), `distanceBasis` `bodyRadius`, `distanceInRadii` 40, `elevationDeg` 45 additiv [−15, 15] → absoluter Bereich 30–60°, `azimuthDeg` 225,58 additiv [−20, 20], `azimuthRateDegPerSec` 1, `durationSec` 30, `timeRateDaysPerSec` 3, `distanceFactor` [0,8, 1,5] — nachrechnen: Kameraabstand in km bei Faktor 0,8/1/1,5 (Basis 40 Saturnradien × 58 232 km = 2 329 280 km), Winkeldurchmesser Saturns und seines Rings bei diesen Abständen, warum Iapetus bei dieser Kameraentfernung kein Label mehr trägt (8-Pixel-Schwelle, Kommentar in `scenes.ts` Zeilen 476–485 selbst nachrechnen statt zu übernehmen), wie 90 simulierte Tage (30 s × 3 d/s) gegen Iapetus' Umlaufzeit 79,33 Tage rund 1,13 Umläufe ergeben (Kommentarwert in `scenes.ts` Zeilen 517–520 gegenprüfen), wie die um 15,47° gegen Saturns Äquator geneigte Bahnellipse bei 30–60° Elevation als Ellipse statt als Linie erscheint (Projektionsrechnung), welche weiteren Monde und der Ring bei 40 Radien Abstand mit im Bild stehen.
- **Hintergrund:** Iapetus' ungewöhnlich weite und geneigte Bahn als natürlicher Übergang zwischen Monden, die Saturns Äquatorebene folgen, und solchen, die eher der Ekliptik folgen — Laplace-Radius-Argument aus `thema-bahnelemente` (Iapetus bei $59\,R_\mathrm{p}$ gegen Saturns eigenen Laplace-Radius $48{,}4\,R_\mathrm{p}$); die historische Entdeckung 1671 (Cassini) und die frühe „Iapetus-Anomalie" — der Mond war nur auf einer Bahnseite mit den damaligen Fernrohren sichtbar, bis seine Zweifarbigkeit die Ursache erklärte; Cassini-Nahvorbeiflug im September 2007 (rund 1227 km) und seine Bilder der geneigten Bahn und des Äquatorwulsts.
- **Modellgrenzen:** Kugel ohne die reale, aus einem früheren schnelleren Spin stammende Abplattung (`radiusKm` als einzelner Skalar); feste Knotenpräzession um Saturns Pol statt um den Laplace-Pol (Abweichung wie Task 6); Ring als Scheibe ohne Dicke; keine Textur-Zweifarbigkeit im Belichtungswert (Albedo 0,275 einfarbig, nur die Textur zeigt die reale Dichotomie); Zeitraffer beim Szenenstart (`src/app/cinema.ts`); Sonnenrichtung mit derselben Herleitung wie `enceladus-hell` (Azimut 225,58°, Elevation 2,31°), fest aus J2000 statt aus der Szenenzeit — Abweichung in Grad je Jahr selbst nachrechnen (Saturn wandert rund 12° je Jahr).
- Code lesen: `src/data/scenes.ts` (Eintrag mit allen Kommentaren, Zeilen rund 475–542), `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/saturn.ts`, `src/data/bodies/saturn-monde.ts`, `src/sim/orbit.ts` (`positionAt`, `achsneigungDeg`), `src/sim/frames.ts` (`poleVector`), `src/sim/scale.ts`, `src/render/rings.ts`, `src/render/exposure.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`).
- Verweise: `objekt:iapetus`, `objekt:saturn`, `thema:bahnelemente`, `thema:ringe`, `thema:modell`, `szene:saturn-ringkante` (Vergleich Ringgeometrie), `szene:enceladus-hell` (dieselbe Sonnenrichtungsherleitung).
- Karten zu `szene:iapetus-schief`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:jpl-satelliten-bahnen`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Tremaine et al. 2009 (siehe `thema-bahnelemente`), Laplace-Radius; Denk et al. 2010 oder Porco et al. 2005, Cassini-Vorbeiflug September 2007 (Fundstelle prüfen, vermutlich *Science* oder *Space Science Reviews*); ein historischer Übersichtsartikel zur Entdeckung 1671 und zur „Iapetus-Anomalie" (Fundstelle prüfen, etwa Van Helden 1985 oder ein Cassini-Missionsrückblick).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Kameraabstand, Umlaufverhältnis, Projektionsgeometrie der Bahnellipse und Sonnenrichtungsabweichung im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4607); Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-iapetus-schief.md src/data/texte/en/hochschule/szene-iapetus-schief.md docs/belege/hochschule/szene-iapetus-schief.md src/data/literatur.ts
git commit -m "Hochschultext Szene Die geneigte Bahn des Iapetus mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 8: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe7-abnahme.md`
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

Expected: Lint ohne Befund; alle Tests grün (Soll 4607 nach „Testzahlen" oben, zuzüglich Tests aus Zwischen-Tasks); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, Ausgangsstand 1 386,97 kB nach 4d-6); Prüfskript über den ganzen Katalog mit 0 Fehlern und ohne 429, Laufzeit notieren (Ausgangsstand 552 s bei 531 Einträgen). Schlusszeilen, die Katalogzahl (Ausgangsstand 531) und die Ausgabe des Prüfskripts ins Protokoll wie in der Abnahme 4d-6 §3; jede Warnung begründen (bekannt: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` und `sanchez-lavega-2011` Konsortial-Byline).

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

Kombinationen: Sprachen `de`, `en` × die sechs Kennungen (`mimas`, `tethys`, `dione`, `rhea`, `iapetus`, `iapetus-schief`). Zustand setzen wie in der Abnahme 4d-6: Körper über `setInfo({ thema: null })` und `setCamera({ targetId: '<id>', mode: 'free' })`; die Szene über `setCinema({ running: true, shuffle: false, nummer: 15 })`, `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setTime({ paused: true })`, `setUi({ hidden: false })`. Beim Wechsel von der Szene zurück zu einem Körper zuerst `setInfo({ thema: null })` setzen (Messfalle aus 4d-5). Auf den Kopfwechsel pollen (Titel wie in der ersten Zeile des Texts), Hinweise erst nach dem Auflösen des faulen Imports werten:

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

Kriterien: `formelfehler` 0; keine Hinweiszeile (insbesondere nicht `info.hochschuleFolgt`); `zitateGleichKarten` true. Danach jeden Verweis einzeln per `element.click()` in `browser_evaluate` auslösen, die Wirkung prüfen und den Ausgangszustand wiederherstellen:

| Verweisart | erwartete Wirkung |
|---|---|
| `objekt:<id>` | `camera.targetId === '<id>'` nach Ende der Kamerafahrt (1,5 s) |
| `thema:<id>` | `ui.info.thema === '<id>'` |
| `szene:<id>` | `cinema.nummer` gleich dem Index der Szene, `camera.mode === 'cinema'` |
| `quelle:<id>` | `[data-quelle="<id>"]` hat `border-sky-300` |
| `literatur:<id>` | `[data-literatur="<id>"]` hat `border-sky-300` (Klick und Prüfung in **einem** `browser_evaluate`) |

Ergebnis je Kombination als Tabelle ins Protokoll (Verweise je Art, Treffer, Formeln, Tabellen, Karten).

- [ ] **Schritt 4: Ersatz entfällt**

Je Sprache: Fachthema `resonanzen` öffnen (`setInfo({ thema: 'resonanzen' })`), den ersten Verweis `a[data-verweis="objekt:mimas"]` klicken (Tabellenzelle „Mimas–Tethys"), auf den Kopf „Mimas" pollen, dann: keine Hinweiszeile im Textbereich. Ebenso Fachthema `photometrie` öffnen (`setInfo({ thema: 'photometrie' })`), `a[data-verweis="objekt:iapetus"]` klicken (erster Fließtextverweis, „… Hemisphäre von Iapetus …"), Kopf „Iapetus", keine Hinweiszeile. **Abweichung vom ursprünglich erwogenen Paar** (Ruling 20): `thema:finsternis` → `objekt:iapetus` entfällt, weil Iapetus dort nur im Fließtext ohne Verweis vorkommt (per grep geprüft, `thema-finsternis.md` Zeilen 250/256/312f.; ebenso Saturn und Titan dort — ältere fachgeprüfte Texte werden nicht rückwirkend verlinkt). Vier Messungen, Ergebnis mit Wartezeit in ms ins Protokoll.

- [ ] **Schritt 5: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 6: Protokoll `docs/phase4d-etappe7-abnahme.md`**

Gliederung wie `docs/phase4d-etappe6-abnahme.md`:

```md
# Abnahme Phase 4d Etappe 7 „Mittlere Saturnmonde"

## 1. Umfang
## 2. Lint, Tests, Build
(Testzahl als durchgehende Tabelle Task → Zuwachs → Summe; Hauptchunk gegen 1 386,97 kB; Katalog gegen 531, je Task aus `git diff` nachgezählt, nicht aus den Berichten übernommen)
## 3. Prüfskript
## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
## 5. Sichtprüfung
### 5.1 Rundgang
### 5.2 Ersatz entfällt
### 5.3 Konsole
## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:", einschließlich der Rulings, die der Controller nach Task 8 setzt)
## 7. Bekannte Unschärfen
(Befunde am Simulationscode als Kandidaten für eigene Tasks; Restbefunde der Fachprüfungen)
## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer; gemeldete Fehler in Gymnasialtexten; die Plan-Rulings als Themenliste)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, jede Summe nachgerechnet, Katalogzuwächse am `git diff` gezählt. Die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung nennen, ohne Suchmuster.

- [ ] **Schritt 7: README**

In `README.md` im Absatz zu Phase 4d den Satzteil

```md
Etappe 6 Saturn, Titan,
Enceladus, das Thema „Ringsysteme" und die Szenen „Saturn im Streiflicht",
„Saturns Ringe von der Kante", „Durchflug durch Saturns Ringe", „Titan im
Dunst vor Saturn" und „Enceladus im hellen Glanz". Offen sind die übrigen
Hochschultexte (Etappen 4d-7 bis 4d-11) und Phase 5
```

ersetzen durch:

```md
Etappe 6 Saturn, Titan,
Enceladus, das Thema „Ringsysteme" und die Szenen „Saturn im Streiflicht",
„Saturns Ringe von der Kante", „Durchflug durch Saturns Ringe", „Titan im
Dunst vor Saturn" und „Enceladus im hellen Glanz"; Etappe 7 Mimas, Tethys,
Dione, Rhea, Iapetus und die Szene „Die geneigte Bahn des Iapetus". Offen
sind die übrigen Hochschultexte (Etappen 4d-8 bis 4d-11) und Phase 5
```

Danach die Zeilenumbrüche des Absatzes glätten (Zeilen bis rund 80 Zeichen), ohne den Wortlaut zu ändern.

- [ ] **Schritt 8: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe7-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm.

```bash
git add docs/phase4d-etappe7-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 7: Mittlere Saturnmonde"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe; Paket ohne die fachgeprüften Texte und Beleglisten, mit Katalogeinträgen und Protokoll; sie ist zugleich die Task-Prüfung der Abnahme); Befunde gebündelt in **einer** Nacharbeit, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-7` nach `master`, Branch löschen; Diff auf Zugangsdaten prüfen; **Push erst nach dem Ja von Jens** (Ruling 14).
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Befunde am Simulationscode als Kandidaten. Etappe 4d-8 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- Modelle nach Weisung von Jens: Umsetzer der Text-Tasks (einschließlich Task 1), Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell (sonnet); rein mechanische Aufträge (README, Formfixes, Katalogfelder, Nacharbeit nach der Schlussprüfung) auf dem kleinsten (haiku). Das stärkste Modell nur nach zweimaligem Scheitern an derselben Stelle. Bei einem Kontingentlimit auf haiku ausweichen und in §8 vermerken.
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace `.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe7/`.
- Fachprüfer laufen parallel zum nächsten Umsetzer; Nacharbeiten und Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`. Ein Umsetzer bekommt den Hinweis, welche fremde Belegliste gerade im Arbeitsbaum geändert sein kann.
- Jeder Umsetzer bekommt die Gemeinsamen Vorgaben, seinen Task und die Globalen Randbedingungen wörtlich (als Dateien); die Modellzahlen aus Task 2 (Mimas), 3 (Tethys), 4 (Dione), 5 (Rhea) und 6 (Iapetus) gibt der Controller aus den Berichten an die Folgetasks weiter, insbesondere Iapetus' Bahn- und Umlaufzahlen an Task 7.
- Eine Prüfrunde je Hochschultext: Nach der Nacharbeit keine weitere Prüfung beauftragen; Zweifel gehen ins Protokoll §8. Prüfaufträge verlangen ausdrücklich das Schreiben der Prüfspalte in die Datei. Task 1 bekommt keine Fachprüfung.
- Beleglisten-Nacharbeit nur mit Zellenkontrolle (Zelle 1 die Nummer, Zelle 2 die Aussage, sechs Zellen je Zeile) — Befund aus Abnahme 4d-6 §7 (Ruling 18).
- Websuche-Kontingent: Recherche notfalls per WebFetch (Crossref-API, doi.org, arXiv, ADS). Ein Umsetzer, der nicht mehr suchen kann, meldet das im Bericht, zitiert nur Geöffnetes und nennt die Stellen, die die Fachprüfung an der Quelle nachholen soll.
- Zahlen in Berichten nachrechnen (frühere Etappen zeigten Zähl- und Kopierfehler bei Katalogzuwachs und Wortzahlen).

## Rulings

Entscheidungen der Planung (22.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** „Push und alles bestätigt" (Jens, 22.09.2026, Abnahme 4d-6 §8) gilt als Freigabe für Etappe 4d-7; ebenso Jens' dortige Entscheidung, den Gymnasialtext Titan als Vorab-Task nachzuführen.
2. **Ruling:** Modelle wie in 4d-4 bis 4d-6 (Weisung von Jens): mittleres Modell für Texte, Prüfer, Abnahme und Schlussprüfung, kleinstes für Mechanik; bei Kontingentlimit kleinstes mit Vermerk in §8. Task 1 läuft trotz seines kurzen Umfangs auf dem mittleren Modell (sachliche Einordnung eines Streitstands, keine reine Mechanik).
3. **Ruling:** Höchstens eine Prüfrunde je Hochschultext (Regel von Jens): Fachprüfung, eine Nacharbeit, Schluss; keine Nachprüfung; in der Nacharbeit wird nicht gekürzt. Der Gymnasialtext aus Task 1 bekommt keine Fachprüfung (Entwurf §6.3 gilt nur für Hochschultexte).
4. **Ruling:** Neuer Richtwert nur für diese Etappe: alle fünf Körper 1000 bis 2000 Wörter je Fassung (Obergrenze 2667) statt des Entwurf-Richtwerts „kleine Monde" (600–1000) oder „große Körper" (1500–3500) — Mimas (Ozeanfrage/Libration), Rhea (Exosphäre, widerlegte Ringe) und Iapetus (Zweifarbigkeit, Äquatorwulst, geneigte Bahn) haben mehr Fachstoff als Phobos/Deimos (Richtwert 600–1000, real 1333/1347 Wörter), aber die Cassini-Datenlage ist dünner als bei Titan/Enceladus (1500–3500). Szene bleibt bei 300–900 (1200). Kosten bei Fehlurteil: ein Text, den Jens kürzen oder erweitern lässt.
5. **Ruling:** Reihenfolge Mimas → Tethys → Dione → Rhea → Iapetus → Szene: Tethys übernimmt Mimas' 4:2-Resonanzzahlen, Dione die Enceladus–Dione-Zahlen aus dem bereits fertigen `objekt-enceladus.md` (kein neuer Task nötig), Rhea steht für sich, Iapetus liefert die Bahn- und Umlaufzahlen, die die Szene direkt übernimmt.
6. **Ruling:** Die einzige Szene der Etappe läuft **allein** in Task 7, anders als die gebündelten Szenen-Tasks in 4d-6 (Entwurf §7 „zu zweit oder zu dritt" ist eine Erlaubnis, keine Pflicht): Es gibt nur eine Szene in dieser Etappe, ein Bündeln entfiele ohnehin; Task 7 folgt zudem erst nach Task 6, weil er dessen Modellzahlen (Umlaufzeit, Bahnneigung, Knotenpräzessionsabweichung) braucht.
7. **Ruling:** Datensatz-Befunde werden in 4d-7 nicht behoben (wie 4d-3 bis 4d-6): Tethys' auffällig kurze `lpDot`-Periode, Diones `nodeDot` 0, Iapetus' Modellalbedo 0,275 als einfarbiger Mittelwert, gemeinsamer Pol von Mimas/Enceladus/Tethys/Dione im Datensatz, `achsneigungDeg` bei einer Bahn mit `frame: 'parentEquator'` (misst gegen die eigene, aus Position und Geschwindigkeit gebildete Bahnnormale, nicht gegen die Laplace-Ebene), Iapetus' Knotenpräzession um Saturns Pol statt um den Laplace-Pol, Mimas' 20-%-Positionsschranke im Fixture-Test wegen der 4:2-Libration. Die Texte beschreiben den Ist-Code; neue Befunde gehen ins Ledger und ins Protokoll §7.
8. **Ruling:** Modellzahlen aus fachgeprüften Texten (`thema-gebundene-rotation`, `thema-resonanzen`, `thema-finsternis`, `thema-photometrie`, `thema-ringe`, `thema-bahnelemente`, `objekt-saturn`, `objekt-enceladus`, `szene-saturn-ringkante`, `objekt-titan`) übernehmen die neuen Texte gleichlautend; Abweichungen der eigenen Nachrechnung gehen an Jens (§8), der fachgeprüfte Text wird nicht geändert.
9. **Ruling:** Kein eigener Verweis-Task: Alle sechs Kennungen dieser Etappe haben Gymnasialtexte. Bestehende Verweise fachgeprüfter Texte auf `objekt:mimas` (in `thema-resonanzen`, `objekt-enceladus`), `objekt:tethys` und `objekt:dione` (in `thema-resonanzen`), `objekt:iapetus` (in `thema-bahnelemente`, `thema-photometrie`) führen danach auf die neuen Hochschultexte und werden nicht nachträglich geändert.
10. **Ruling:** Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); große Zahlen in Formeln ohne Trennzeichen; Zahlenspannen nennen, wofür sie gelten.
11. **Ruling:** Die Fachprüfung behält die sieben Prüfpunkte aus 4d-6 und bekommt einen achten: Prozesssprache (Task, Ruling, Brief) darf im veröffentlichten Text nicht vorkommen (Befund `objekt-venus.md` aus 4d-4); sie schreibt die Prüfspalte ausdrücklich in die Datei.
12. **Ruling:** Eine Sichtprüfung des Formelsatzes entfällt, solange kein neuer TeX-Befehl dazukommt.
13. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle; wächst der Chunk gegenüber 1 386,97 kB um mehr als 50 kB, geht die Frage des faulen Ladens an Jens.
14. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master`; der Push folgt erst nach dem Ja von Jens. Jens gibt danach 4d-8 frei.
15. **Ruling:** Wortzahl-Obergrenze ein Drittel über dem Richtwert dieser Etappe (Körper 2667, Szene 1200); Straffung vor dem Commit, nie in der Nacharbeit; Richtigkeit vor Wortzahl, wenn eine Berichtigung die Grenze überschreitet.
16. **Ruling:** Katalogform wie nach der Schlussprüfung 4d-4, bestätigt in 4d-6: beschreibende Zusätze in `erschienen` englisch, Eigennamen original, Vorabdrucke `'arXiv'`, laufend gepflegte Seiten mit Zugriffsjahr, Konsortial-Bylines mit dem Menschen zuerst.
17. **Ruling:** Quellenkarten aus dem Task sind Angebot, keine Pflicht; ein `quelle:`-Beleg muss die Aussage auf der Seite tragen. `nssdc-saturnmonde`, `nasa-saturnmonde` und `jpl-satelliten` decken alle fünf Körper dieser Etappe bereits ab, `jpl-satelliten-bahnen` zusätzlich die Szene; zitiert ein Text eine weitere Karte, ergänzt der Task ihr `fuer`-Feld in `src/data/quellen.ts` um die eigene Kennung.
18. **Ruling:** Beleglisten-Nacharbeit nur mit Zellenkontrolle (Zelle 1 die Nummer, Zelle 2 die Aussage, sechs Zellen je Zeile) — Befund aus Abnahme 4d-6 §7 (zwei Zeilen verloren dort bei einer Nacharbeit ihre Nummer); vor jedem Nacharbeits-Commit an einer Belegliste ein Skript im Scratchpad gegenprüfen lassen.
19. **Ruling:** Der Task-Prüfung der Abnahme (Task 8) dient die Schlussprüfung; ihr Paket enthält Protokoll und README vollständig, ohne die fachgeprüften Texte und Beleglisten (wie in 4d-5/4d-6 per Ruling entschieden).
20. **Ruling:** „Ersatz entfällt" (Abnahme Schritt 4) nutzt `thema:resonanzen` → `objekt:mimas` (Tabellenzelle, DE/EN vorhanden) und `thema:photometrie` → `objekt:iapetus` (Fließtext, DE/EN vorhanden) statt des ursprünglich erwogenen Paars `thema:finsternis` → `objekt:iapetus`: Iapetus kommt in `thema-finsternis.md` nur im Fließtext ohne Verweis vor (per grep geprüft, Zeilen 250/256/312f.), ebenso Saturn und Titan dort — ältere fachgeprüfte Texte werden nicht rückwirkend verlinkt.
21. **Ruling:** `achsneigungDeg` bei einer Bahn mit `frame: 'parentEquator'` (Mimas, Tethys, Dione, Iapetus) misst gegen die aus Position und Geschwindigkeit gebildete eigene Bahnnormale zur Epoche, nicht gegen die Laplace-Ebene oder gegen Saturns Äquator direkt — ein Datensatz-Befund (Ruling 7), keine Änderung an `sim/orbit.ts` in dieser Etappe.
22. **Ruling:** Task 1 (Gymnasialtext Titan) bekommt keinen eigenen Testfall-Zuwachs und keine Belegliste; der Commit steht für sich, vor den sechs Text-Tasks.
