# Phase 4d Hochschule, Etappe 6 „Saturn und Ringe" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Saturn, Titan und Enceladus, das Thema `ringe` sowie die Szenen `saturn-streiflicht`, `saturn-ringkante`, `ringdurchflug`, `titan-dunst` und `enceladus-hell` haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung (Entwurf §7, Zeile 4d-6, 18 Dateien). Danach **Halt** für die Freigabe von Etappe 4d-7.

**Architektur:** Sieben Text-Tasks, **nicht wörtlich im Plan**: Der Umsetzer liest den Code, recherchiert, schreibt und belegt nach Entwurf §6.4; eine Fachprüfung mit frischem Kontext prüft **einmal**, danach folgt **eine** Nacharbeit (Regel von Jens vom 20.09.2026). Kein Code-Task. Die fünf Szenen laufen in drei Tasks (Entwurf §7: „Kurze Szenen dürfen zu zweit oder zu dritt in einem Task laufen", Ruling 6). Alle Verweisziele der Etappe haben Gymnasialtexte (Ersatz nach Entwurf §5.5 Punkt 6), deshalb setzt jeder Text-Task seine Verweise selbst. Task 8 ist die Abnahme nach Entwurf §8.2.

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §4.1 (Katalog, mit den Nachträgen 4d-4), §5 (Gestalt der Texte), §6 (Arbeitsweise), §7 Zeile 4d-6, §8.2 (Abnahme). Vorlagen: Plan `docs/superpowers/plans/2026-09-20-phase4d-hochschule-etappe5.md`, Abnahme `docs/phase4d-etappe5-abnahme.md` und die fachgeprüften Hochschultexte unter `src/data/texte/de/hochschule/` samt Beleglisten unter `docs/belege/hochschule/` (Gasplanet: `objekt-jupiter.md`; große Monde: `objekt-ganymede.md`, `objekt-europa.md`; Thema: `thema-gezeiten.md`, `thema-resonanzen.md`; Szenen: `szene-jupiter-vorbeiflug.md`, `szene-galileisches-schattenspiel.md`, `szene-phobos-tiefflug.md`). Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und im Literaturkatalog (Originaltitel; beschreibende Zusätze im Feld `erschienen` englisch, Eigennamen von Verlagen und Einrichtungen original — Entwurf §4.1, Nachtrag 4d-4).
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben). Protokolle, Berichte in versionierten Dateien und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**.
- Branch `hochschule-6` (von `master`), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test) und steht alphabetisch nach Kennung (Test); Vorabdrucke tragen `erschienen: 'arXiv'` (Test); laufend gepflegte Seiten tragen das Zugriffsjahr.
- Keine neue Abhängigkeit in `package.json`. Kein Code außer in etwaigen Zwischen-Tasks für neue TeX-Befehle; Befunde am Simulationscode, die ein Text aufdeckt, beschreibt der Text in „Im Modell" beziehungsweise „Modellgrenzen" und der Bericht meldet sie (Ruling 7).
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben.
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Namen beziehungsweise Titel aus `ui/i18n` (Körper `body.<id>.name`, Thema `thema.ringe.title`, Szenen „Szene: " / „Scene: " vor dem Szenentitel wie in den Gymnasialfassungen); Körper und Szenen mit den festen `##`-Überschriften aus Entwurf §5.1 in dieser Reihenfolge, Pflichtabschnitte nie weglassen (bei Saturn entfällt „Oberfläche" nach §5.1 als Gasplanet, Ruling 4); das Thema ist frei gegliedert, endet aber wie die sechs Fachthemen mit `## Offene Fragen` und `## Im Modell` (Ruling 18); Hochschultexte enden mit `*Stand: September 2026*` beziehungsweise `*As of September 2026*` als eigenem Absatz (Monat und Jahr des Commits); `literatur:` nur in Hochschultexten. Richtwerte ohne Testgrenze (Entwurf §5.2): große Körper 1500 bis 3500 Wörter je Fassung (Saturn, Titan und — per Ruling 19 — Enceladus), Themen 1500 bis 4000, Szenen 300 bis 900; Richtigkeit geht vor Wortzahl, aber kein Text soll den oberen Richtwert um mehr als ein Drittel überschreiten (4667, 5333 beziehungsweise 1200); gestrafft wird vor dem Commit, nie in der Nacharbeit.
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten (in 4d-5 unterschätzte der Kommentar in `scenes.ts` die Bildüberschreitung der Kallistobahn um das Zehnfache). Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen); Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste. Nacharbeiten warten, bis kein anderer Umsetzer läuft.
- **Höchstens eine Prüfrunde je Text** (Jens, 20.09.2026): ein Umsetzer, eine Fachprüfung, eine Nacharbeit, dann Schluss. Keine Nachprüfung. Was danach offen bleibt, steht im Abnahmeprotokoll (§7, §8).
- Modelle nach Weisung von Jens (20.09.2026): Text-Umsetzer, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell, mechanische Aufträge auf dem kleinsten; das stärkste nur nach zweimaligem Scheitern an derselben Stelle (Ruling ins Ledger). Greift ein Kontingentlimit des mittleren Modells (in 4d-5 am 21.09.2026), läuft der Auftrag auf dem kleinsten Modell weiter und die Abnahme vermerkt es in §8.
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-21-phase4d-hochschule-etappe6/progress.md` (git-ignoriert), am Ende gesammelt ins Abnahmeprotokoll.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Körper `saturn` | 2 Texte, `docs/belege/hochschule/objekt-saturn.md`, `src/data/literatur.ts` |
| 2 | Thema `ringe` | 2 Texte, `docs/belege/hochschule/thema-ringe.md`, `src/data/literatur.ts` |
| 3 | Körper `titan` | 2 Texte, `docs/belege/hochschule/objekt-titan.md`, `src/data/literatur.ts` |
| 4 | Körper `enceladus` | 2 Texte, `docs/belege/hochschule/objekt-enceladus.md`, `src/data/literatur.ts` |
| 5 | Szenen `saturn-streiflicht`, `saturn-ringkante` | 4 Texte, `docs/belege/hochschule/szene-saturn-streiflicht.md`, `docs/belege/hochschule/szene-saturn-ringkante.md`, `src/data/literatur.ts` |
| 6 | Szene `ringdurchflug` | 2 Texte, `docs/belege/hochschule/szene-ringdurchflug.md`, `src/data/literatur.ts` |
| 7 | Szenen `titan-dunst`, `enceladus-hell` | 4 Texte, `docs/belege/hochschule/szene-titan-dunst.md`, `docs/belege/hochschule/szene-enceladus-hell.md`, `src/data/literatur.ts` |
| 8 | Abnahme | `docs/phase4d-etappe6-abnahme.md`, `README.md` |

Texte liegen unter `src/data/texte/<de|en>/hochschule/<art>-<kennung>.md`. Kennungen: `saturn`, `titan`, `enceladus` (Körper, `src/data/bodies/saturn.ts`, `saturn-monde.ts`), `ringe` (Thema, `src/data/themen.ts`), Szenen wie in `src/data/scenes.ts` (Indizes: `saturn-streiflicht` 1, `saturn-ringkante` 10, `ringdurchflug` 11, `titan-dunst` 12, `enceladus-hell` 13 — am Array gegenprüfen).

**Testzahlen:** Ausgangsstand `master` df715ff (Abnahme 4d-5): 4279 Tests. Im Dateitest `src/data/texte/dateien.test.ts` erzeugt ein Hochschultext eines Körpers oder einer Szene 11 Fälle, ein Themen-Text 10 (ohne „folgt der Gliederung seiner Art"). Soll: 4279 + 16 × 11 + 2 × 10 = **4475**, zuzüglich Tests aus Zwischen-Tasks für neue TeX-Befehle. Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test`. Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

## Gemeinsame Vorgaben für Task 1 bis 7 (Texte)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den fachgeprüften Hochschultexten als Maßstab für Tiefe, Ton und Belegdichte: `objekt-jupiter.md` für Saturn, `objekt-ganymede.md` und `objekt-europa.md` für Titan und Enceladus, `thema-gezeiten.md` und `thema-resonanzen.md` für das Thema, `szene-jupiter-vorbeiflug.md`, `szene-galileisches-schattenspiel.md` und `szene-phobos-tiefflug.md` für Szenen. Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang.

**Ablauf je Task**

1. **Vorlage lesen:** den passenden fachgeprüften Text in beiden Fassungen und seine Belegliste unter `docs/belege/hochschule/` (Form der Belegliste, Abschnitt „Im Modell" beziehungsweise „Modellgrenzen"). Dazu den Gymnasialtext derselben Kennung, damit der Hochschultext ihm nicht widerspricht; findet der Umsetzer im Gymnasialtext einen sachlichen Fehler, meldet er ihn im Bericht (nicht ändern).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (Node mit Typentfernung oder Vite-SSR aus dem Projektverzeichnis, nicht versioniert). Werte des Datenblocks aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten.
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf (steht keine Websuche zur Verfügung, mit WebFetch über Crossref-API `https://api.crossref.org/works/<doi>`, doi.org, arXiv, ADS, Verlagsseiten; im Bericht vermerken): zuerst nach neueren Übersichtsartikeln und Missionsergebnissen suchen (Cassini-Abschlussauswertungen bis 2026, JWST-Beobachtungen von Titan und Enceladus, Dragonfly-Vorbereitung), auch wenn der Stoff bekannt scheint. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, Band, Seite und DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren. Einträge, die schon im Katalog stehen (`src/data/literatur.ts`, 442 Einträge, darunter mit Saturnbezug `jacobson-2022`, `mankovich-2021`, `militzer-2023`, `wang-2024a`, `magnanini-2026`, `lainey-2020`, `fuller-2016`, `cuk-2024`, `porco-2007`, `iess-2012`, `durante-2019`, `goossens-2024`, `goossens-2026`, `petricca-2025`, `durante-2026`, `baland-2011`, `downey-2025`, `read-2018`, `hemingway-2018`, `thomas-2016`, `miles-2025`, `verbiscer-2005`, `verbiscer-2007`, `buratti-2022`, `howett-2010`, `blackburn-2011`, `tajeddine-2014`, `duriez-1992`, `peale-1969`, `colombo-1966`, `ward-1975`, `zahnle-2003`, `bobis-2008`, `archinal-2018`, `mallama-2017`, `murray-2000`), wiederverwenden statt doppelt anlegen; ihr Inhalt wird trotzdem für jede neue Aussage geöffnet.
4. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" leer:

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile — auch eigene Herleitungen (Beleg „Herleitung" mit Rechenweg) und Vergleiche („größter Mond", „hellster Körper"); „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" oder „Nachrechnung am Code: <Datei>". Senkrechte Striche in Zellen als `\|` maskieren (jede Zeile hat genau sechs Zellen). Querverweise zwischen Zeilen nach jeder Neunummerierung prüfen. Ein `quelle:`-Beleg muss die Aussage auf der Seite tatsächlich tragen.
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`; Körperschaften als Autor wie bei `cgpm-2022`; Konsortial-Bylines: der Mensch zuerst, wie die Zeitschrift ihn führt (Crossref nennt dann eine Warnung, kein Fehler). `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer; Vorabdrucke `erschienen: 'arXiv'`; beschreibende Zusätze englisch, Eigennamen original. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test). Kennungen gleicher Erstautoren und Jahre mit Buchstaben unterscheiden (Bestand: `durante-2019`, `durante-2026`, `goossens-2024`, `goossens-2026`, `verbiscer-2005`, `verbiscer-2007`, `wang-2024a`).
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen.
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile und Gliederung nach den Globalen Randbedingungen und Entwurf §5.1. Körper: `## Kenngrößen und Messung`, `## Inneres`, `## Oberfläche` (bei Saturn entfällt der Abschnitt), `## Atmosphäre und Magnetosphäre`, `## Bahn, Rotation und Dynamik`, `## Entstehung und Entwicklung`, `## Offene Fragen`, `## Im Modell` (englisch `Parameters and measurement`, `Interior`, `Surface`, `Atmosphere and magnetosphere`, `Orbit, rotation and dynamics`, `Formation and evolution`, `Open questions`, `In the model`). Szenen: `## Was das Bild zeigt`, `## Hintergrund`, `## Modellgrenzen` (englisch `What the view shows`, `Background`, `Model limitations`). Thema: frei, Schluss `## Offene Fragen`, `## Im Modell` (englisch `Open questions`, `In the model`).
   - „Im Modell" beziehungsweise „Modellgrenzen": was Orrery zur Kennung rechnet oder bewusst weglässt, mit Verweis `thema:modell`; jede Abweichung des Modells von der Wirklichkeit mit Größenordnung; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung. Nur beschreiben, was der Code zum Zeitpunkt des Tasks tut; Zahlen selbst nachrechnen. Stehen dieselben Modellzahlen schon in einem fachgeprüften Text (siehe unten „Modellzahlen aus fachgeprüften Texten"), dieselben Werte verwenden oder die Abweichung im Bericht begründen (Ruling 8).
   - „Offene Fragen": Streitfragen mit Belegen für beide Seiten, nicht entschieden, solange die Fachwelt es nicht getan hat.
   - Schluss `*Stand: <Monat> 2026*` / `*As of <Month> 2026*` (Monat des Commits).
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit allen Nachträgen): Argumente von `^`, `_`, `\frac` mit mehr als einem Zeichen in `{}`; `\text{…}` ohne verschachtelte Klammern und in beiden Fassungen gleich; Dezimalkomma in deutschen Formeln als `{,}`, in englischen `.`; Funktionsnamen als Befehl; große Zahlen in Formeln ohne Tausendertrennung (Bestand). Fehlt ein Befehl, ist das ein eigener Zwischen-Task (Test in `texUebersetzer.test.ts`, eigener Commit), kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen „74 658", Englisch Komma „74,658"), vierstellige Zahlen ohne Trennung. Zahlenspannen sagen, wofür sie gelten; stammen zwei Spannen aus zwei Modellen, stehen beide mit ihrem Modell.
   - Kein `$` außerhalb von Formeln (Dateitest); kein `|` am Absatzanfang außer in Tabellen.
8. **Verweise:** `objekt:`, `szene:`, `thema:` auf Kennungen aus `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts`; Ziele ohne Hochschultext sind erlaubt, wenn sie einen Gymnasialtext haben. Hochschultexte gibt es für `sun`, `earth`, `moon`, `mercury`, `venus`, `mars`, `phobos`, `deimos`, `jupiter`, `io`, `europa`, `ganymede`, `callisto`, die Themen `bahnelemente`, `bezugssysteme`, `entstehung`, `finsternis`, `gebundene-rotation`, `gezeiten`, `innerer-aufbau`, `photometrie`, `resonanzen` und die Szenen `erdaufgang`, `mondfinsternis`, `mondtanz`, `merkurjagd`, `phobos-tiefflug`, `jupiter-vorbeiflug`, `galileisches-schattenspiel`; dazu die in dieser Etappe vorher fertigen Texte. Höchstens ein Verweis je Ziel je `##`-Abschnitt; kein Verweis eines Texts auf sich selbst. Quellenkarten erscheinen automatisch für alle Kennungen in `fuer` (`src/data/quellen.ts`); ein `quelle:`-Verweis im Text braucht eine Karte zur Kennung des Texts, ist aber keine Pflicht (Ruling 17).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht.
10. **Commit** von Texten, Belegliste(n) und Katalogeinträgen zusammen (Commit-Text im Task). Vorher `git status --short`: keine Reste aus Skripten im Quellbaum; eine vom Prüfer geänderte fremde Belegliste im Arbeitsbaum bleibt liegen und wird nicht mitcommittet.
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten. **Genau eine** Fachprüfung je Task (bei Task 5 und 7 prüft sie beide Textpaare in einem Auftrag). Der Auftrag verlangt ausdrücklich, die Spalte „Prüfung" **in die Datei** zu schreiben (in 4d-5 blieb sie bei einem Prüfer leer).
12. **Nacharbeit (genau eine):** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise (Aussage ungenau oder missverständlich, Beleg stützt nicht wörtlich, Fassungen weichen im Sinn ab, fehlende Belegzeilen) behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger; in der Nacharbeit wird **nicht gekürzt**. In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung`; alle anderen Prüfeinträge bleiben. **Keine Nachprüfung:** Was der Umsetzer nicht beheben kann oder anders sieht als der Prüfer, notiert er mit Begründung im Ledger; die Abnahme führt es in §7 oder §8 auf.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste <art>-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Modellzahlen aus fachgeprüften Texten (gleichlautend übernehmen, Ruling 8):**
- `thema-gezeiten.md`: Titan $k_2$ 0,608 ± 0,048 (Realteil) und Imaginärteil 0,135 ± 0,035, $Q$ 4,5 ± 1,1 (Petricca et al. 2025); Saturn $k_2$ 0,382 ± 0,017, $Q$ 75 (+176/−31, 3σ) aus Titans Frequenz (Magnanini et al. 2026), $k_2/Q$ 2012 (2,3 ± 0,7)·10⁻⁴; Roche-Grenze für 900 kg m⁻³ rund 129 000 km, A-Ring-Außenkante 136 780 km; Enceladus 4 bis 19 GW über die Südpolregion; „Im Modell": Ringe sind eine flache Scheibe von 74 658 bis 136 780 km ohne Einzelteilchen, Gezeitenheizung und Fontänen fehlen.
- `thema-innerer-aufbau.md`: Saturn $C/(Ma^2)$ 0,2258 ± 0,0025 bei $a$ = 60 330 km (Jacobson 2022), Modell 0,2181 ± 0,0002 bei 60 268 km (Militzer und Hubbard 2023); Ringseismologie im C-Ring (f- und g-Moden, verdünnter Kern); Titan $C/(MR^2)$ 0,343 ± 0,001, $J_2/C_{22}$ 3,186 ± 0,077 (Petricca et al. 2025); Abplattung Saturns im Modell nicht dargestellt (60 268 gegen 54 364 km); GM Saturn +5 ppm, Titan +238 ppm gegen die Referenz.
- `thema-photometrie.md`: geometrische Albedo Saturn 0,499, Bond-Albedo 0,41 ± 0,02 (Mallama et al. 2017; Wang et al. 2024a); Enceladus 1,24 ± 0,01 und 0,89 ± 0,02 (Buratti et al. 2022), im Modell 1,0 als Katalogalbedo, die Texturkarte von Enceladus wird mit dem Faktor 5,80 auf dieses Mittel gebracht (Abschnitt „Karte und Faktor" dort nachlesen); Ringe erhalten einen gestalteten Aufhellungsterm nur im Gegenlicht, keine Rückstreuspitze; die mittelgroßen Saturnmonde liegen bei 0,55 µm um oder über 1 (E-Ring-Eis).
- `thema-resonanzen.md`, „Resonanzen der Saturnmonde" und „Im Modell": Enceladus–Dione 1:2 (Winkel $2\lambda_\mathrm{Di} - \lambda_\mathrm{En} - \varpi_\mathrm{En}$, Amplitude unter 1°, Ćuk et al. 2024), Titan–Hyperion 3:4 (Amplitude 36,5°, Periode etwa 640 Tage, Duriez 1992), Mimas–Tethys −61,2° zur Epoche mit 13,3° je Jahr; Hyperion fehlt im Katalog.
- `thema-finsternis.md`: Saturn 26,7° Achsneigung, Schattenfenster von 18,2° bei Mimas bis 2,7° bei Titan; `MAX_OKKLUDER` 4: Saturn behält Titan, Tethys, Dione und Rhea, so dass Mimas, Enceladus und Iapetus dort nie einen Schatten werfen; Schatten von Jupiter oder Saturn ohne Kernschattenfarbe.
- `thema-gebundene-rotation.md`, Modelltabelle: Enceladus −0,061 / 136,2° / 135,8°, Titan −0,005 / 37,7° / 40,0° (Bedeutung der Spalten dort nachlesen); Enceladus Libration 0,120° ± 0,014° (Thomas et al. 2016), Titan Schiefe 0,32 ± 0,02° (Cassini-Zustand); Abweichung der Umlaufzeit aus $360°/\dot{L}$ bei Enceladus 0,32 %.
- `thema-bahnelemente.md`, „Im Modell": Saturnmonde nutzen oskulierende Horizons-Elemente zu J2000 im Bezug `parentEquator`, Knoten und Apsiden präzedieren mit Raten aus der JPL-Tabelle, die Knoten von Enceladus und Dione stehen fest; Saturns JPL-Tafel 1800–2050 mit 600″ nomineller Längenunsicherheit.
- `thema-entstehung.md`: Grand Tack (Jupiter bis 1,5 AE, Umkehr mit Saturn), Nizza-Modell mit der 1:2-Resonanz Jupiter–Saturn; Exzentrizität Saturns wird im Modell im Jahr 12 563 null (Zeitbereich endet 9999).

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen; bei zwei Textpaaren beide Dateipaare und beide Beleglisten nennen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/<datei>` und `src/data/texte/en/hochschule/<datei>` mit der Belegliste `docs/belege/hochschule/<datei>` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder die Crossref-API, arXiv, ADS), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Kommentare im Code sind kein Beleg; rechne Aussagen über das Modell am Code selbst nach (Skripte nur im Scratchpad). Es gibt nur diese eine Prüfrunde: Konzentriere dich auf Fehler, die die Aussage falsch machen, und auf Belege, die die Aussage nicht stützen; Stil und Umfang nur, wenn sie das Verständnis behindern. Prüfe:
> 1. Stützt die zitierte Arbeit die Aussage im Text?
> 2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle?
> 3. Passen Aussagen über Orrery zum Code (`src/data/`, `src/sim/`, `src/render/`, `src/ui/info/datenzeilen.ts`), und erklärt „Im Modell" beziehungsweise „Modellgrenzen" jede Abweichung, auch gegenüber dem Datenblock?
> 4. Stimmen Dimensionen und Größenordnungen der Formeln?
> 5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?
> 6. Sind Streitfragen als solche dargestellt, mit Belegen für beide Seiten?
> 7. Widerspricht der Text einem fachgeprüften Hochschultext (`src/data/texte/de/hochschule/`) in Zahlen oder Aussagen über das Modell?
>
> **Trage je Zeile der Belegliste in der Spalte „Prüfung" tatsächlich in die Datei ein** (mit dem Edit-Werkzeug, sobald die Zeile fertig ist): `ok (…)`, `Fehler: …` oder `Hinweis: …`; jede Tabellenzeile behält sechs Zellen, senkrechte Striche im Eintrag als `\|` maskieren. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte, keinen Code, keinen anderen Teil der Belegliste; kein Commit, kein Browser, keine Subagenten. Schreibe die Befundliste fortlaufend nach `<Befunddatei>` (Klasse Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich, Widerspruch zu einem fachgeprüften Text; Hinweis: Ton, Vollständigkeit, besserer Beleg; je Befund Fundstelle Datei:Zeile beider Fassungen und ein konkreter Behebungsvorschlag), am Ende eine Zählung ok/Fehler/Hinweis. Rückgabe höchstens 12 Zeilen: Zählung ok/Fehler/Hinweis, Fehler als Einzeiler, Bestätigung, dass die Prüfspalte in der Datei steht, Pfad der Befunddatei.

---

### Task 1: Körper `saturn`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-saturn.md`, `src/data/texte/en/hochschule/objekt-saturn.md`, `docs/belege/hochschule/objekt-saturn.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: fachgeprüfte Texte `thema-innerer-aufbau` (Trägheitsmoment, Ringseismologie, verdünnter Kern), `thema-gezeiten` (Saturns $k_2$ und $Q$, Resonanzverriegelung), `thema-photometrie` (Albedos, Ringaufhellung), `thema-finsternis` (Okkluderwahl der Saturnmonde), `thema-bahnelemente`, `thema-entstehung`, `objekt-jupiter` (Form und Ton).
- Produziert: Hochschultext `objekt:saturn`; Task 2 bis 7 übernehmen seine Modellzahlen (Radius 58 232 km und fehlende Abplattung, Rotation 10,656 h und die Rotationsfrage, Pol, W₀, Achsneigung, GM gegen NSSDC, Ringgeometrie 74 658 bis 136 780 km, Okkluderwahl).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Saturn` in beiden Fassungen. Gliederung Körper **ohne** „Oberfläche" (Gasplanet, Entwurf §5.1, Ruling 4): sieben Abschnitte. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radien (äquatorial 60 268 km, polar 54 364 km, mittlerer), Abplattung 0,098 als stärkste unter den Planeten, Masse, Dichte unter der von Wasser; Schwerefeld aus dem Cassini Grand Finale (J₂ bis J₁₂, ungerade Momente und Tiefe der Winde), Trägheitsmoment aus Polpräzession (Zahlen wie `thema-innerer-aufbau`); Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren und Beleg. Inneres: verdünnter Kern aus der Ringseismologie (Mankovich und Fuller 2021), Helium-Regen und Wärmeüberschuss (Energiebilanz nach Wang et al. 2024a), Zustandsgleichung als Streitfrage; Verweis `thema:innerer-aufbau` statt Wiederholung. Atmosphäre und Magnetosphäre: Zusammensetzung, Bänder und Winde (äquatorialer Jet), Polarhexagon, Große Weiße Flecken (2010/11), Ringregen und die Kopplung Ringe–Ionosphäre (Grand Finale); Magnetfeld (achsensymmetrisch bis unter 0,01° Neigung, Dougherty et al. 2018), Magnetosphäre mit Enceladus-Plasma als Quelle, Polarlichter, Saturn-Kilometerstrahlung. Bahn, Rotation und Dynamik: Bahnelemente, **Rotationsperiode als Messproblem** (Voyager-SKR 10 h 39 min 24 s, Cassini-SKR-Variabilität, Ringseismologie 10 h 33 min 38 s nach Mankovich et al. 2019, Schwerefeld-Werte), Achsneigung 26,73° und ihre Ursache (säkulare Spin-Bahn-Resonanz mit Neptun, Ward und Hamilton 2004; Chrysalis-Hypothese Wisdom et al. 2022 als Streitfrage), Laplace-Ebene und Präzession, Ringebene = Äquatorebene, Jahreszeiten (Ringöffnung, Kantenstellung 2025). Entstehung und Entwicklung: Kernakkretion, Grand Tack und Nizza-Modell (Verweis `thema:entstehung`), Helium-Entmischung als Wärmequelle, Alter der Ringe nur als Verweis (`thema:ringe`).
- `## Offene Fragen` (Pflicht): etwa die wahre Rotationsperiode, Ausdehnung und Beschaffenheit des verdünnten Kerns, Ursache der Achsneigung (Neptun-Resonanz gegen Chrysalis), Ursache der Achsensymmetrie des Magnetfelds — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente der JPL-Tafel 1800–2050 linear fortgeschrieben (`saturn.ts`, `frame: 'ecliptic'`); Kugel mit `radiusKm` 58 232 (welcher Radius ist das? NSSDC-Volumenmittel gegen äquatorial 60 268 km — am Code prüfen, dass keine Abplattung dargestellt wird; Größenordnung des Fehlers am Äquator und Pol wie `thema-innerer-aufbau`); Rotation `rotationPeriodH` 10,656 h (welchem Messwert entspricht das, und wie weit läuft ein Wolkenmerkmal in einem Jahr gegen die Ringseismologie-Periode falsch?); Pol aus dem Datensatz gegen Archinal et al. 2018 und Achsneigung nach `achsneigungDeg` in `sim/orbit.ts` (Kommentar behauptet 26,73° — selbst nachrechnen); `rotationAtEpochDeg` 0 gegen W₀; Albedo 0,499 als geometrische Albedo (Zahlen wie `thema-photometrie`); Ringe als flache Scheibe `appearance.rings` 74 658 bis 136 780 km mit Texturstreifen (Alphakanal als Deckkraft, C-Ring-Innenkante bis A-Ring-Außenkante; D-, F-, G-, E-Ring fehlen; keine Dicke, keine Teilchen — Einzelheiten gehören ins Thema `ringe`, hier nur die Geometrie und der Verweis); Schatten: `waehleOkkluder` in `render/shadows.ts` wählt für Saturn seine Monde nach Winkelradius (Zahlen wie `thema-finsternis`: Titan, Tethys, Dione, Rhea) und den Ring als eigenen Okkluder (`RingOkkluder`, Deckkraft aus dem Alphakanal — welcher Schatten fällt auf Saturn, welcher auf den Ring, mit `RING_SCHATTEN_RESTLICHT` 0,3 in `render/rings.ts`); Datenblockwerte gegen Messwerte; Maßstab (`sizeScale` skaliert Planet und Ring gemeinsam, `sim/scale.ts`).
- Code lesen: `src/data/bodies/saturn.ts`, `src/data/bodies/saturn-monde.ts` (Kopfkommentar zu Horizons-Elementen und `parentEquator`), `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/bodies.ts`, `src/render/rings.ts` (`ringAusrichtung`, `ringHelligkeit`, `RING_SCHATTEN_RESTLICHT`), `src/render/shadows.ts` (`waehleOkkluder`, `ringTreffer`, `MAX_OKKLUDER`), `src/render/albedo.ts`, `ASSETS.md` (Saturn- und Ringtextur), `src/ui/info/datenzeilen.ts`, Hochschultexte `thema-innerer-aufbau`, `thema-gezeiten`, `thema-photometrie`, `thema-finsternis`, `thema-bahnelemente`, `thema-entstehung`, `objekt-jupiter`.
- Verweise: `objekt:jupiter`, `objekt:titan`, `objekt:enceladus`, `objekt:mimas`, `objekt:neptune`, `objekt:sun`, `thema:ringe`, `thema:innerer-aufbau`, `thema:gezeiten`, `thema:resonanzen`, `thema:finsternis`, `thema:photometrie`, `thema:bezugssysteme`, `thema:bahnelemente`, `thema:entstehung`, `szene:saturn-streiflicht`, `szene:saturn-ringkante`, `szene:ringdurchflug`, `thema:modell`; Karten zu `objekt:saturn`: `quelle:nssdc-saturn`, `quelle:nasa-saturn`, `quelle:nasa-cassini`, `quelle:esa-cassini-huygens`, `quelle:wikipedia-de-saturn`, `quelle:wikipedia-en-saturn`, `quelle:jpl-photojournal-saturn`, `quelle:pds-rings`, `quelle:nasa-eyes`, `quelle:jpl-approx-pos`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Iess et al. 2019, Schwerefeld und Ringmasse aus dem Grand Finale (*Science* 364, eaat2965); Mankovich et al. 2019, Rotationsperiode aus Ringseismologie (*Astrophysical Journal* 871, 1); Mankovich und Fuller 2021 (`mankovich-2021`); Militzer und Hubbard 2023 (`militzer-2023`); Jacobson 2022 (`jacobson-2022`); Wang et al. 2024a (`wang-2024a`); Dougherty et al. 2018, Magnetfeld im Grand Finale (*Science* 362, eaat5434); Cao et al. 2020, Magnetfeld (*Icarus* 344, 113541); Fletcher et al. 2018, Polarhexagon (*Nature Communications* 9, 3564); Sánchez-Lavega et al. 2011, Großer Weißer Fleck 2010 (*Nature* 475, 71); Hsu et al. 2018, Ringregen (*Science* 362, eaat3185); Ward und Hamilton 2004, Achsneigung durch Neptun (*Astronomical Journal* 128, 2501); Wisdom et al. 2022, Chrysalis (*Science* 377, 1285); Fletcher et al. 2020, Saturn-Atmosphäre (Übersicht in *Saturn in the 21st Century*, Cambridge University Press, oder *Space Science Reviews*); Helled et al. 2020, Inneres (Übersicht); Gurnett et al. 2005, SKR-Periode (*Science* 307, 1255); Desch und Kaiser 1981, Voyager-SKR-Periode (*Geophysical Research Letters* 8, 253); Archinal et al. 2018 (`archinal-2018`); Mallama et al. 2017 (`mallama-2017`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Achsneigung, Abplattungsfehler, Okkluderwahl, Ringschattengeometrie und Rotationsdrift im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test`; Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-saturn.md src/data/texte/en/hochschule/objekt-saturn.md docs/belege/hochschule/objekt-saturn.md src/data/literatur.ts
git commit -m "Hochschultext Saturn mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit (Gemeinsame Vorgaben 11 bis 13).

---

### Task 2: Thema `ringe`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-ringe.md`, `src/data/texte/en/hochschule/thema-ringe.md`, `docs/belege/hochschule/thema-ringe.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Saturn-Modellzahlen, Ringgeometrie); fachgeprüfte Texte `thema-gezeiten` (Roche-Grenze, Ringmonde), `thema-innerer-aufbau` (Ringseismologie), `thema-photometrie` (Ringaufhellung), `thema-resonanzen` (Mimas 2:1, Lücken), `thema-finsternis` (Ringschatten).
- Produziert: Hochschultext `thema:ringe`; Task 5 und 6 übernehmen seine Modellzahlen (Texturstreifen, Vorwärtsstreuung `RING_STREUUNG` 0,85 und `RING_SCHAERFE` 6, Restlicht 0,3, Deckkraft aus dem Alphakanal, fehlende Ringe und Dicke).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Ringsysteme` / `# Ring systems` (Titel aus `ui/i18n`, wie die Gymnasialfassungen). Frei gegliedert (Entwurf §5.1), Schluss `## Offene Fragen`, `## Im Modell` (Ruling 18). Richtwert 1500 bis 4000 Wörter je Fassung. Schwerpunkt Saturn; die Ringe von Jupiter, Uranus und Neptun sowie die Ringe kleiner Körper (Chariklo, Haumea, Quaoar) je mit eigenem Abschnitt oder Unterabschnitt, weil der Gymnasialtext sie nennt.
- Inhalt mindestens: Aufbau des Saturnsystems (D, C, B, Cassini-Teilung, A, Encke- und Keeler-Lücke, F, G, E) mit Radien und optischen Tiefen; Teilchengrößen und Zusammensetzung (über 95 % Wassereis, Verunreinigung im C-Ring); Dicke und Selbstgravitationswellen (Wakes); Dynamik: Keplersche Scherung, Viskosität, Dichte- und Biegewellen an Resonanzen mit Monden (Mimas 2:1 am B-Ring-Außenrand, Verweis `thema:resonanzen`), Schäfermonde und Propeller, Roche-Grenze und Ringmonde (Verweis `thema:gezeiten`, Zahlen von dort); Ringseismologie als Sonde des Inneren (Verweis `thema:innerer-aufbau`); Masse der Ringe aus dem Grand Finale (Iess et al. 2019) und die Altersfrage (Kempf et al. 2023 Staubeinfall, Crida et al. 2019 Gegenposition, Dubinski 2019 oder neuere Modelle); Ursprung (zerrissener Mond, Kometeneinfang, Chrysalis-Hypothese); Photometrie der Ringe (Oppositionseffekt, Vorwärtsstreuung im Gegenlicht, Cassini-Aufnahme „In Saturn's Shadow"; Verweis `thema:photometrie`); Ringebenendurchgänge von der Erde aus (1995, 2009, März 2025) und was sie zeigen; die anderen Systeme: Uranus (Entdeckung 1977 durch Sternbedeckung, schmale Ringe ε bis 6, Schäfermonde Cordelia/Ophelia), Neptun (Bögen im Adams-Ring, Galatea), Jupiter (Staubringe aus Metis, Adrastea, Amalthea, Thebe), Chariklo 2014, Haumea 2017, Quaoar 2023 jenseits der Roche-Grenze.
- `## Offene Fragen` (Pflicht): etwa Alter und Ursprung der Saturnringe (jung gegen alt), Ursache der Bögen Neptuns, Stabilität der Quaoar-Ringe außerhalb der Roche-Grenze — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Saturns Ringe als Scheibe 74 658 bis 136 780 km (`saturn.ts`, `appearance.rings`), Geometrie `ringGeometrieDaten` (128 Segmente, u radial), Ausrichtung nach dem Pol (`ringAusrichtung`), Texturstreifen aus `ASSETS.md` (Herkunft, Alphakanal als Deckkraft, RGB als Farbe, mittlere Helligkeit rund 0,15 linear gegen Ringalbedo 0,5 bis 0,6 laut Kommentar — nachprüfen, ob der Kommentar das Mittel der tatsächlichen Datei trifft, etwa mit einem Skript über die PNG-Datei), Helligkeit `ringHelligkeit` = Albedo · (|N·L|·uTag/π + Füllung·uTag + Streuung·uTag/π) mit `vorwaertsstreuung` (Stärke 0,85, Schärfe 6) und ihre Bedeutung im Gegenlicht; Schatten des Planeten auf dem Ring mit Restlicht 0,3 (`RING_SCHATTEN_RESTLICHT`), Schatten des Rings auf Planet und Monden über `ringTreffer` mit der Deckkraft des Texturstreifens; Uranusringe aus Messdaten (`ringProfil.ts`: PDS-Tabellen, Darstellungsbreite mit Sockel 260 km und Faktor 6, Deckkraft 1 − e^(−τ), diffuse Komponenten verstärkt — Zahlen aus dem Code, nicht aus dem Kommentar); Neptun und Jupiter ohne Ringe; keine Dicke, keine Teilchen, keine Lücken außer denen des Texturstreifens, keine Dichtewellen, kein Oppositionseffekt (wie `thema-photometrie`); Datenblock zeigt keine Ringwerte (prüfen in `datenzeilen.ts`).
- Code lesen: `src/data/bodies/saturn.ts`, `src/data/bodies/uranus.ts` (Ringbänder), `src/sim/types.ts` (`RingBand`, `Appearance.rings`), `src/render/rings.ts` (vollständig, einschließlich Shader-Kommentare), `src/render/ringProfil.ts`, `src/render/shadows.ts` (`ringTreffer`, `RingOkkluder`, GLSL-Ringblock), `src/render/lighting.ts` (`uTag`, Füllung), `ASSETS.md` (Ringtextur), `src/data/index.test.ts` (Test „hält Mimas außerhalb des Ringsystems"), `src/ui/info/datenzeilen.ts`, Hochschultexte `thema-gezeiten`, `thema-innerer-aufbau`, `thema-photometrie`, `thema-resonanzen`, `thema-finsternis`.
- Verweise: `objekt:saturn`, `objekt:uranus`, `objekt:neptune`, `objekt:jupiter`, `objekt:mimas`, `objekt:enceladus`, `objekt:haumea`, `thema:gezeiten`, `thema:resonanzen`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:finsternis`, `szene:saturn-ringkante`, `szene:ringdurchflug`, `szene:saturn-streiflicht`, `szene:uranus-gekippt`, `thema:modell`; Karten zu `thema:ringe`: `quelle:nasa-cassini`, `quelle:jpl-photojournal-saturn`, `quelle:pds-rings`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Esposito 2010, Übersicht (*Annual Review of Earth and Planetary Sciences* 38, 383); Cuzzi et al. 2010, Übersicht (*Science* 327, 1470); Cuzzi et al. 2018, Ringwissenschaft im Grand Finale (*Science* 362, eaat2236); Tiscareno 2013, Planetary Rings (in *Planets, Stars and Stellar Systems*, Band 3, Springer, DOI prüfen); Iess et al. 2019 (siehe Task 1); Kempf et al. 2023, Staubeinfall und Alter (*Science Advances* 9, eadf8537); Crida et al. 2019, Masse und Alter kritisch (*Nature Astronomy* 3, 967); Zhang et al. 2017, Verunreinigung des C-Rings (*Icarus* 294, 14); Hedman und Nicholson 2013, Ringseismologie (*Astronomical Journal* 146, 12); Colwell et al. 2007, Selbstgravitationswellen (*Icarus* 190, 127); Porco et al. 2007 (`porco-2007`); Charnoz et al. 2018, Ursprung (in *Planetary Ring Systems*, Cambridge University Press); Canup 2010, Ursprung aus einem differenzierten Mond (*Nature* 468, 943); Hyodo et al. 2017, Einfang eines Kuipergürtelobjekts (*Icarus* 282, 195); Wisdom et al. 2022 (siehe Task 1); Elliot, Dunham und Mink 1977, Uranusringe (*Nature* 267, 328); de Pater et al. 2005 oder Showalter und Lissauer 2006, Uranus (*Science* 311, 973); Porco 1991, Neptunbögen (*Science* 253, 995); Braga-Ribas et al. 2014, Chariklo (*Nature* 508, 72); Ortiz et al. 2017, Haumea (*Nature* 550, 219); Morgado et al. 2023, Quaoar (*Nature* 614, 239); French et al. 2017 oder Nicholson et al. 1996, Ringebenendurchgänge 1995 (*Science* 272, 509); Murray und Dermott (`murray-2000`, Kap. 10).
- Neue Testfälle: 2 Dateien × 10 = 20.

- [ ] **Schritt 1:** Vorlage und Code lesen, Texturmittel, Vorwärtsstreuung, Ringschattenbreite und Uranus-Deckkräfte im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-ringe.md src/data/texte/en/hochschule/thema-ringe.md docs/belege/hochschule/thema-ringe.md src/data/literatur.ts
git commit -m "Hochschultext Ringsysteme mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 3: Körper `titan`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-titan.md`, `src/data/texte/en/hochschule/objekt-titan.md`, `docs/belege/hochschule/objekt-titan.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Saturn-Modellzahlen); fachgeprüfte Texte `thema-gezeiten` (Titans $k_2$, Auswanderung, Resonanzverriegelung), `thema-innerer-aufbau` (Trägheitsmoment, Hydrostatik), `thema-gebundene-rotation` (Cassini-Zustand, Schiefe), `thema-resonanzen` (Titan–Hyperion), `thema-bahnelemente`.
- Produziert: Hochschultext `objekt:titan`; Task 7 übernimmt seine Modellzahlen (Umlaufzeit aus `LDot`, Rotation, fehlende Atmosphäre, Textur).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Titan` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radius 2575 km (Form nach Zebker et al. 2009), Dichte, Trägheitsmomentfaktor und Love-Zahl $k_2$ mit der aktuellen Kontroverse (Ozean nach Iess 2012 und Goossens 2024 gegen Petricca 2025 „kein Ozean", Durante 2026 und Goossens 2026 als Erwiderungen — Zahlen wie `thema-gezeiten` und `thema-innerer-aufbau`); Tabelle der Kenngrößen. Inneres: Schichtung, Ozean als Streitfrage, Clathrat-Kruste, Wärmefluss. Oberfläche: Huygens-Landung 2005 (Bilder, Kieselsteine aus Eis), Dünen aus organischem Material, Seen und Meere aus Methan und Ethan (Kraken, Ligeia, Punga Mare), Flüsse und Kanäle, Kraterarmut und Alter, Kryovulkanismus als Streitfrage. Atmosphäre und Magnetosphäre: 1,5 bar Stickstoff mit Methan, Photochemie und Tholine, Dunstschichten (Haupt- und abgesetzte Schicht), Methankreislauf mit Regen und Jahreszeiten, Superrotation (Verweis auf `read-2018`), Isotopenverhältnisse und Atmosphärenverlust, Wechselwirkung mit Saturns Magnetosphäre (kein eigenes Feld, induziert). Bahn, Rotation und Dynamik: Bahnelemente, Auswanderung 11 cm/a (Lainey 2020, Magnanini 2026; Verweis `thema:gezeiten`), Cassini-Zustand und Schiefe 0,32° (Verweis `thema:gebundene-rotation`), 3:4-Resonanz mit Hyperion (Verweis `thema:resonanzen`), Exzentrizität 0,0288 und ihre Erhaltung. Entstehung und Entwicklung: Bildung in der Saturn-Scheibe, Herkunft des Stickstoffs (Ammoniak), Methanquelle und -lebensdauer, Dragonfly (Start 2028, Ankunft 2034) mit Stand.
- `## Offene Fragen` (Pflicht): etwa Ozean oder kein Ozean, Methannachschub, Ursache der Auswanderungsrate (Resonanzverriegelung), Kryovulkanismus — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente aus `saturn-monde.ts` (oskulierende Horizons-Elemente J2000 im Bezug `parentEquator`, Raten `lpDot` 51,4686 und `nodeDot` −52,3735 — Einheit am Code prüfen, Perioden daraus herleiten; Zahlen wie `thema-bahnelemente`); Umlaufzeit aus `LDot` gegen 15,945 d; Rotation `rotationPeriodH` 382,69075 h (Verhältnis und Winkel wie `thema-gebundene-rotation`); Pol fest aus dem Datensatz gegen Archinal et al. 2018; Albedo 0,22 als geometrische Albedo; **keine Atmosphäre und kein Dunst im Renderer** (`render/` kennt keine Atmosphärenschicht — prüfen), Textur ist eine Radar/IR-Oberflächenkarte (`ASSETS.md`), die man real nie im sichtbaren Licht sieht; Titan ist einer der vier Okkluder Saturns (Zahlen wie `thema-finsternis`), sein Schatten auf Saturn und Saturns sowie der Ringe Schatten auf ihm; Maßstab (`isSatellite`); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/saturn-monde.ts` (Kopf- und Blockkommentare, Eintrag `titan`), `src/data/bodies/saturn.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/bodies.ts`, `src/render/albedo.ts`, `ASSETS.md`, `src/ui/info/datenzeilen.ts`, `src/data/index.test.ts` (Saturnmond-Tests), Hochschultexte `thema-gezeiten`, `thema-innerer-aufbau`, `thema-gebundene-rotation`, `thema-resonanzen`, `thema-bahnelemente`, `objekt-ganymede`.
- Verweise: `objekt:saturn`, `objekt:ganymede`, `objekt:earth`, `objekt:enceladus`, `objekt:venus`, `thema:gezeiten`, `thema:innerer-aufbau`, `thema:gebundene-rotation`, `thema:resonanzen`, `thema:bahnelemente`, `thema:photometrie`, `thema:entstehung`, `szene:titan-dunst`, `thema:modell`; Karten zu `objekt:titan`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:nasa-cassini`, `quelle:esa-cassini-huygens`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Iess et al. 2012 (`iess-2012`); Durante et al. 2019 (`durante-2019`); Goossens et al. 2024 (`goossens-2024`); Petricca et al. 2025 (`petricca-2025`); Durante et al. 2026 (`durante-2026`); Goossens et al. 2026 (`goossens-2026`); Baland et al. 2011 (`baland-2011`); Downey und Nimmo 2025 (`downey-2025`); Lainey et al. 2020 (`lainey-2020`); Magnanini et al. 2026 (`magnanini-2026`); Zebker et al. 2009, Form (*Science* 324, 921); Niemann et al. 2005, Huygens-GCMS (*Nature* 438, 779); Fulchignoni et al. 2005, Huygens-HASI (*Nature* 438, 785); Tomasko et al. 2005, Huygens-DISR (*Nature* 438, 765); Lebreton et al. 2005, Huygens-Abstieg (*Nature* 438, 758); Stofan et al. 2007, Seen (*Nature* 445, 61); Hayes 2016, Seen und Meere (*Annual Review of Earth and Planetary Sciences* 44, 57); Lorenz et al. 2006, Dünen (*Science* 312, 724); Hörst 2017, Atmosphäre und Klima (*Journal of Geophysical Research: Planets* 122, 432); Nixon 2024, Übersicht Titan-Chemie (*ACS Earth and Space Chemistry* oder *Chemical Society Reviews*, prüfen); Turtle et al. 2011, Regen (*Science* 331, 1414); Read und Lebonnois 2018 (`read-2018`); Mandt et al. 2014, Stickstoffisotope (*Astrophysical Journal Letters* 788, L24); Barnes et al. 2021, Dragonfly (*Planetary Science Journal* 2, 130); Neish et al. 2018, Kraterzählung (*Astrobiology* 18, 571); Archinal et al. 2018.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit, Präzessionsperioden, Rotationsverhältnis und Schattenschwelle im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-titan.md src/data/texte/en/hochschule/objekt-titan.md docs/belege/hochschule/objekt-titan.md src/data/literatur.ts
git commit -m "Hochschultext Titan mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 4: Körper `enceladus`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-enceladus.md`, `src/data/texte/en/hochschule/objekt-enceladus.md`, `docs/belege/hochschule/objekt-enceladus.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 und 2 (Saturn- und Ringzahlen, E-Ring); fachgeprüfte Texte `thema-gezeiten` (Enceladus-Wärme 4 bis 19 GW, Resonanz mit Dione), `thema-gebundene-rotation` (Libration 0,120°), `thema-photometrie` (Albedo 1,24/0,89, Modell 1,0 mit Faktor 5,80), `thema-resonanzen` (Enceladus–Dione 1:2), `thema-finsternis` (Enceladus nie Okkluder).
- Produziert: Hochschultext `objekt:enceladus`; Task 7 übernimmt seine Modellzahlen (Albedo und Kartenfaktor, Exzentrizität des Datensatzes, fehlende Fontänen, Schattenlage).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Enceladus` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung (Ruling 19).
- Inhalt mindestens: GM, Radius 252 km, Dichte 1,61 g cm⁻³, Schwerefeld und Trägheitsmoment (Iess et al. 2014), Libration und globaler Ozean (Thomas et al. 2016, Zahlen wie `thema-gebundene-rotation`), Eisschalendicke regional (Čadek et al. 2016, Hemingway und Mittal 2019); Tabelle der Kenngrößen. Inneres: poröser Gesteinskern mit hydrothermaler Zirkulation (Choblet et al. 2017), Ozean, Wärmehaushalt (Verweis `thema:gezeiten`, Zahlen von dort), Silikat-Nanoteilchen (Hsu et al. 2015). Oberfläche: Tigerstreifen am Südpol, Kraterregionen und junge Ebenen, Wärmeausstrahlung 4,7 bis 15,8 GW je Auswertung, Nordpolwärme (Miles et al. 2025). Atmosphäre und Magnetosphäre: Fontänen (Porco 2006, Hansen 2006, Waite 2006), ihre Gezeitensteuerung (Hurford 2007, Hedman 2013), Zusammensetzung (Salze Postberg 2009, Organik Postberg 2018, Phosphate Postberg 2023, H₂ Waite 2017), E-Ring als Produkt (Spahn 2006; Verweis `thema:ringe`), Plasmaquelle der Magnetosphäre. Bahn, Rotation und Dynamik: 1:2-Resonanz mit Dione (Verweis `thema:resonanzen`), erzwungene Exzentrizität 0,0047 gegen freien Anteil, gebundene Rotation mit Libration, Bahnentwicklung und Resonanzverriegelung (Lainey 2020, Fuller 2016). Entstehung und Entwicklung: Alter des Mondes als Streitfrage (Ćuk et al. 2016 jung gegen alt), Ozeandauer, Bewohnbarkeit und Missionskonzepte (Enceladus Orbilander) nur mit Beleg.
- `## Offene Fragen` (Pflicht): etwa Alter des Mondes und des Ozeans, Gleichgewicht von Heizung und Wärmeverlust, Ursprung der Tigerstreifen, Bewohnbarkeit — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente aus `saturn-monde.ts` (oskulierende Horizons-Elemente, `e` 0,00635 als Momentwert gegen die erzwungene Exzentrizität 0,0047 — Unterschied erklären, `nodeDot` 0 weil die JPL-Tabelle keine Knotenrate liefert, `lpDot` 12 345,679 — Periode herleiten; Zahlen wie `thema-bahnelemente`); Umlaufzeit aus `LDot` gegen 1,370 d (Abweichung 0,32 % wie `thema-gebundene-rotation`); Rotation `rotationPeriodH` 32,88523 h; Pol fest; Albedo 1,0 als geometrische Albedo gegen 1,24 gemessen, Kartenfaktor 5,80 (Zahlen wie `thema-photometrie`); keine Fontänen, kein E-Ring, keine Wärmekarte; Schatten: Enceladus ist nie Okkluder Saturns (Zahlen wie `thema-finsternis`), wird aber von Saturn und vom Ring beschattet (`ringTreffer`); der Kommentar in `scenes.ts` zu `enceladus-hell` meldet eine „insgesamt gedämpfte Helligkeit" der Saturnmonde — am Code (`lighting.ts`, `albedo.ts`) prüfen, ob das noch gilt, und die Ursache nennen, wenn sie sich zeigt; Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/saturn-monde.ts` (Eintrag `enceladus` mit Sonderfall-Kommentar), `src/data/bodies/saturn.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/lighting.ts`, `src/render/albedo.ts`, `ASSETS.md`, `src/ui/info/datenzeilen.ts`, `src/data/scenes.ts` (Kommentar zu `enceladus-hell`), Hochschultexte `thema-gezeiten`, `thema-gebundene-rotation`, `thema-photometrie`, `thema-resonanzen`, `thema-finsternis`, `objekt-europa`.
- Verweise: `objekt:saturn`, `objekt:dione`, `objekt:mimas`, `objekt:europa`, `objekt:titan`, `thema:gezeiten`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:photometrie`, `thema:ringe`, `thema:innerer-aufbau`, `thema:finsternis`, `szene:enceladus-hell`, `thema:modell`; Karten zu `objekt:enceladus`: `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:nasa-cassini`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Porco et al. 2006, Fontänen (*Science* 311, 1393); Hansen et al. 2006, UVIS (*Science* 311, 1422); Waite et al. 2006, INMS (*Science* 311, 1419); Spencer et al. 2006, Südpolwärme (*Science* 311, 1401); Spahn et al. 2006, E-Ring-Quelle (*Science* 311, 1416); Hurford et al. 2007, Gezeitensteuerung (*Nature* 447, 292); Hedman et al. 2013, Fontänenhelligkeit und Bahnphase (*Nature* 500, 182); Postberg et al. 2009, Salze (*Nature* 459, 1098); Postberg et al. 2018, Makromoleküle (*Nature* 558, 564); Postberg et al. 2023, Phosphate (*Nature* 618, 489); Waite et al. 2017, H₂ (*Science* 356, 155); Hsu et al. 2015, Nanosilikate (*Nature* 519, 207); Iess et al. 2014, Schwerefeld (*Science* 344, 78); Thomas et al. 2016 (`thomas-2016`); Čadek et al. 2016, Eisschale (*Geophysical Research Letters* 43, 5653); Hemingway und Mittal 2019, Schalendicke (*Icarus* 332, 111); Hemingway et al. 2018 (`hemingway-2018`); Choblet et al. 2017, hydrothermaler Kern (*Nature Astronomy* 1, 841); Howett et al. 2011, 15,8 GW (*Journal of Geophysical Research* 116, E03003); Miles et al. 2025 (`miles-2025`); Ćuk, Dones und Nesvorný 2016, junge Monde (*Astrophysical Journal* 820, 97); Ćuk et al. 2024 (`cuk-2024`); Lainey et al. 2020 (`lainey-2020`); Fuller et al. 2016 (`fuller-2016`); Nimmo et al. 2018, thermisch-orbitale Entwicklung (in *Enceladus and the Icy Moons of Saturn*, University of Arizona Press); Buratti et al. 2022 (`buratti-2022`); Verbiscer et al. 2007 (`verbiscer-2007`); MacKenzie et al. 2021, Orbilander (*Planetary Science Journal* 2, 77).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit, Apsidenperiode, erzwungene gegen oskulierende Exzentrizität, Schattenlage und Helligkeitsbefund im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-enceladus.md src/data/texte/en/hochschule/objekt-enceladus.md docs/belege/hochschule/objekt-enceladus.md src/data/literatur.ts
git commit -m "Hochschultext Enceladus mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 5: Szenen `saturn-streiflicht` und `saturn-ringkante`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-saturn-streiflicht.md`, `src/data/texte/en/hochschule/szene-saturn-streiflicht.md`, `docs/belege/hochschule/szene-saturn-streiflicht.md`, `src/data/texte/de/hochschule/szene-saturn-ringkante.md`, `src/data/texte/en/hochschule/szene-saturn-ringkante.md`, `docs/belege/hochschule/szene-saturn-ringkante.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Saturn-Modellzahlen), Task 2 (Ringmodellzahlen: Texturstreifen, Vorwärtsstreuung, Restlicht, Ringschatten).
- Produziert: Hochschultexte `szene:saturn-streiflicht`, `szene:saturn-ringkante`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Saturn im Streiflicht` / `# Scene: Saturn in grazing light` und `# Szene: Saturns Ringe von der Kante` / `# Scene: Saturn's rings edge-on` (wie die Gymnasialfassungen). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung und Szene. Zwei getrennte Beleglisten; ein Commit.
- **Streiflicht, Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `saturn-streiflicht`, Index 1: Bahntyp `orbit`, `distanceBasis` `bodyRadius`, `distanceInRadii` 5, `elevationDeg` 4, `azimuthDeg` 40, `azimuthRateDegPerSec` 0,8, `durationSec` 35, `timeRateDaysPerSec` 0,1, Streuung `azimuthDeg` 0 bis 360, `elevationDeg` −3 bis 12 additiv, `distanceFactor` 0,85 bis 1,4) und ihrer Auswertung in `src/render/camera/cinema.ts` (`aufKugel`) — nachrechnen: Kameraabstand in km und Winkeldurchmesser Saturns bei Faktor 0,85/1,0/1,4 (Sichtfeld 50°), welcher Teil des Ringsystems (Innen- und Außenkante in Saturnradien 1,28 und 2,35) ins Bild passt, Blickwinkel auf die Ringebene aus Elevation und Achsneigung, Phasenwinkel Sonne–Saturn–Kamera je Azimut (wann liegt die Kamera im Gegenlicht und die Vorwärtsstreuung leuchtet auf), Ringschatten auf der Kugel und Kugelschatten auf dem Ring zur Szenenzeit (Sonnenhöhe über der Ringebene aus der Saturnposition, Jahreszeit), Drehung Saturns in 3,5 simulierten Tagen (7,9 Umdrehungen bei 10,656 h).
- **Streiflicht, Hintergrund:** Ringschatten als Jahreszeitenuhr (Ringöffnungswinkel ±26,7°, Sonnenhöhe über der Ringebene, Schattenbreite auf dem Planeten), Cassini-Aufnahmen im Streiflicht und Gegenlicht („In Saturn's Shadow" 2006, PIA08329 — Nummer prüfen), Phasenfunktion der Ringe (Verweis `thema:photometrie`), Vorwärtsstreuung durch Mikrometeoroidenstaub und die Speichen des B-Rings.
- **Streiflicht, Modellgrenzen:** Kugel ohne Abplattung mit System-III-Rotation (Zahlen wie Task 1); Ring als Scheibe mit Texturstreifen, Vorwärtsstreuung 0,85/6, Restlicht 0,3 im Kugelschatten, Ringschatten mit der Deckkraft des Alphakanals (Zahlen wie Task 2); Belichtung auf Saturn (`render/exposure.ts`); Zeitraffer beim Szenenstart (`src/app/cinema.ts`); keine Speichen, keine Dicke, kein Oppositionseffekt.
- **Ringkante, Was das Bild zeigt:** Eintrag `saturn-ringkante`, Index 10: Bahntyp `static`, `distanceInRadii` 8, `elevationDeg` 0, `azimuthDeg` 169,53 fest (Streuung `azimuthDeg` 0 bis 0), `elevationDeg` −1,5 bis 1,5 additiv, `distanceFactor` 0,8 bis 1,5, `durationSec` 30, `timeRateDaysPerSec` 0,2 — den Kommentar im Eintrag (Azimut = Knoten der Ringebene, Außenkante innerhalb der Bildhälfte bei Faktor 0,8) **selbst nachrechnen**: Knotenlinie der Ringebene aus dem Saturnpol (`poleVector`, `ringAusrichtung`) in Ekliptikkoordinaten, scheinbare Ringdicke in Bildpunkten bei Elevation ±1,5° (Winkel × Ringdurchmesser), ob die Ringe bei exakt 0° verschwinden (Scheibe ohne Dicke) und ab welcher Elevation der Streifen ein Pixel breit wird (Bildhöhe 1440 px als Annahme nennen), Winkeldurchmesser Saturns, Sonnenhöhe über der Ringebene zur Szenenzeit; welche Monde bei 6 Simulationstagen durchs Bild ziehen (Mimas bis Rhea, Umlaufzeiten aus `saturn-monde.ts`).
- **Ringkante, Hintergrund:** Ringebenendurchgänge der Erde (1995/96 dreifach, 2009, 23. März 2025) und der Sonne (Tagundnachtgleiche 2009 mit Cassini, Schattenwurf senkrechter Strukturen am B-Ring-Rand), Bestimmung der Ringdicke (10 bis 100 m aus Kantenhelligkeit und Bedeckungen), Entdeckungen an der Kante (neue Monde 1966/1980, E-Ring).
- **Ringkante, Modellgrenzen:** Scheibe ohne Dicke (verschwindet bei 0°, real 10 bis 100 m und bei Kantenstellung durch den F-Ring und die Wellen am Rand noch sichtbar), fehlender E- und F-Ring, Vorwärtsstreuung, Belichtung, feste Ausrichtung ohne Nachführung der Präzession (Pol fest).
- Code lesen: `src/data/scenes.ts` (beide Einträge mit Kommentaren), `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/saturn.ts`, `src/data/bodies/saturn-monde.ts`, `src/sim/frames.ts` (`poleVector`), `src/sim/scale.ts`, `src/render/rings.ts`, `src/render/shadows.ts`, `src/render/exposure.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`).
- Verweise (je Szene mindestens): `objekt:saturn`, `thema:ringe`, `thema:photometrie`, `thema:finsternis`, `thema:modell`; Streiflicht zusätzlich `szene:saturn-ringkante`, `szene:ringdurchflug`; Ringkante zusätzlich `objekt:earth`, `objekt:mimas`, `szene:saturn-streiflicht`, `thema:bezugssysteme`; Karten: `szene:saturn-streiflicht` → `quelle:nssdc-saturn`, `quelle:nasa-cassini`, `quelle:jpl-photojournal-saturn`; `szene:saturn-ringkante` → `quelle:nasa-saturn`, `quelle:jpl-photojournal-saturn`, `quelle:pds-rings`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Nicholson et al. 1996, Ringebenendurchgänge 1995 (*Science* 272, 509); Spilker 2019, Cassini-Bilanz (*Science* 364, 1046); Mitchell et al. 2006, Speichen (*Science* 311, 1587); Spitale und Porco 2010, Wellen am B-Ring-Rand (*Astronomical Journal* 140, 1747); Hedman et al. 2009, Speichen und Jahreszeit (*Icarus* 202, 260); Cuzzi et al. 2018 (siehe Task 2); Salo und Karjalainen 2003 oder Colwell et al. 2007, Ringdicke aus Selbstgravitationswellen (*Icarus* 190, 127); Verbiscer et al. 2009, E-Ring bei Kantenstellung (*Nature* 461, 1098); NASA/JPL Photojournal für die genannten Aufnahmen (`quelle:jpl-photojournal-saturn`, Seite öffnen).
- Neue Testfälle: 4 Dateien × 11 = 44.

- [ ] **Schritt 1:** Vorlage und Code lesen, Kamerageometrie, Ringknoten, Phasenwinkel, Sonnenhöhe über der Ringebene und Ringdicke in Pixeln im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, zwei Beleglisten, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutsche Texte, englische Fassungen.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen aller vier Dateien.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-saturn-streiflicht.md src/data/texte/en/hochschule/szene-saturn-streiflicht.md docs/belege/hochschule/szene-saturn-streiflicht.md src/data/texte/de/hochschule/szene-saturn-ringkante.md src/data/texte/en/hochschule/szene-saturn-ringkante.md docs/belege/hochschule/szene-saturn-ringkante.md src/data/literatur.ts
git commit -m "Hochschultexte Szenen Saturn im Streiflicht und Ringe von der Kante mit Beleglisten"
```

- [ ] **Schritt 6:** Eine Fachprüfung über beide Textpaare, eine Nacharbeit.

---

### Task 6: Szene `ringdurchflug`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-ringdurchflug.md`, `src/data/texte/en/hochschule/szene-ringdurchflug.md`, `docs/belege/hochschule/szene-ringdurchflug.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1, 2 und 5 (Modellzahlen; Ringknoten 169,53° aus Task 5 übernehmen, nicht neu bestimmen, aber die Übernahme im Bericht nennen).
- Produziert: Hochschultext `szene:ringdurchflug`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Durchflug durch Saturns Ringe` / `# Scene: Flying through Saturn's rings` (wie die Gymnasialfassungen). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung.
- **Was das Bild zeigt:** Eintrag `ringdurchflug`, Index 11: Bahntyp `flyby`, `distanceInRadii` 2, `elevationDeg` 4, `azimuthDeg` 169,53 fest, Streuung `elevationDeg` −3 bis 15 additiv, `distanceFactor` 0,8 bis 1,5, `durationSec` 30, `timeRateDaysPerSec` 0,05; Auswertung in `cinema.ts` (Fall `flyby`: geradlinig seitlich vorbei, Versatz von +2 auf −2 Radien in der Ekliptik, geringster Abstand in der Szenenmitte) — nachrechnen: Kameraweg in km und Tempo in km/s, Radius 2 Saturnradien (116 464 km) im Ringband (C-Ring/B-Ring — welcher Ring liegt dort?), Höhe der Kamera über der Ringebene entlang des Wegs (der Kommentar behauptet, die ekliptikale Querbewegung drifte aus der um rund 27° geneigten Ringebene heraus — Verlauf in km je Sekunde berechnen; kreuzt die Kamera die Ringebene tatsächlich und wenn ja, wann), bei welcher Elevation der Streuung der Ring nur noch als Linie erscheint, Phasenwinkel und Gegenlichtanteil (Vorwärtsstreuung) je Streuung, Winkeldurchmesser Saturns aus 2 Radien, 1,5 simulierte Tage (Drehung Saturns, Bewegung von Mimas und Enceladus).
- **Hintergrund:** echte Ringdurchflüge: Pioneer 11 1979 (außerhalb des A-Rings), Voyager 2 1981 (G-Ring-Ebene), Cassini beim Orbiteinschuss 2004 (Durchgang durch die Lücke zwischen F- und G-Ring) und die 22 Grand-Finale-Bahnen 2017 zwischen D-Ring und Wolken (Ringregen, Staubmessungen, Ende 15. September 2017); Teilchendichte und Kollisionsrisiko, Ringdicke und Selbstgravitationswellen als das, was man aus der Nähe sähe (Größenverteilung, Verweis `thema:ringe`); Keplersche Scherung als Relativbewegung.
- **Modellgrenzen:** Scheibe ohne Dicke und ohne Teilchen (aus der Nähe kein Auflösen in Brocken, keine Wakes), Textur mit begrenzter Radialauflösung (Pixel je km aus der Streifenbreite in `ASSETS.md` — nachrechnen), Vorwärtsstreuung 0,85/6 als Gestaltungswert, Restlicht, Kamera ohne Schwerkraft auf gerader Linie, Ringebene fest zum Pol, Belichtung auf Saturn, Zeitraffer beim Start; kein Kollisions- oder Nahfeld.
- Code lesen: `src/data/scenes.ts` (Eintrag mit Korrekturkommentar), `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/saturn.ts`, `src/data/bodies/saturn-monde.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/rings.ts`, `src/render/exposure.ts`, `src/render/renderer.ts`, `ASSETS.md` (Ringtextur, Streifenmaße).
- Verweise: `objekt:saturn`, `objekt:mimas`, `objekt:enceladus`, `thema:ringe`, `thema:gezeiten`, `thema:photometrie`, `szene:saturn-ringkante`, `szene:saturn-streiflicht`, `szene:jupiter-vorbeiflug`, `thema:modell`; Karten zu `szene:ringdurchflug`: `quelle:nasa-cassini`, `quelle:jpl-photojournal-saturn`, `quelle:pds-rings`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Spilker 2019 (siehe Task 5); Hsu et al. 2018 (siehe Task 1); Mitchell et al. 2018, Ringmaterial in der Ionosphäre (*Science* 362, eaat2236 — Nummer gegen Cuzzi 2018 prüfen, beide im selben Heft); Ye et al. 2018, Staub im Grand Finale (*Geophysical Research Letters* 45, 10101); Colwell et al. 2007 (siehe Task 5); Zebker, Marouf und Tyler 1985, Teilchengrößen aus Voyager-Radiobedeckung (*Icarus* 64, 531); Cuzzi et al. 2009, Übersicht Ringteilchen (in *Saturn from Cassini-Huygens*, Springer); Smith et al. 1981, Voyager 1 an Saturn (*Science* 212, 163); Porco et al. 2005, Cassini-Bilder nach dem Orbiteinschuss (*Science* 307, 1226).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Kameraweg, Höhe über der Ringebene, Gegenlichtanteil und Texturauflösung im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-ringdurchflug.md src/data/texte/en/hochschule/szene-ringdurchflug.md docs/belege/hochschule/szene-ringdurchflug.md src/data/literatur.ts
git commit -m "Hochschultext Szene Durchflug durch Saturns Ringe mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 7: Szenen `titan-dunst` und `enceladus-hell`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-titan-dunst.md`, `src/data/texte/en/hochschule/szene-titan-dunst.md`, `docs/belege/hochschule/szene-titan-dunst.md`, `src/data/texte/de/hochschule/szene-enceladus-hell.md`, `src/data/texte/en/hochschule/szene-enceladus-hell.md`, `docs/belege/hochschule/szene-enceladus-hell.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1, 3 und 4 (Modellzahlen Saturn, Titan, Enceladus; Albedo und Kartenfaktor, fehlende Atmosphäre, Helligkeitsbefund).
- Produziert: Hochschultexte `szene:titan-dunst`, `szene:enceladus-hell`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Titan im Dunst vor Saturn` / `# Scene: Hazy Titan in front of Saturn` und `# Szene: Enceladus im hellen Glanz` / `# Scene: Enceladus in brilliant light` (wie die Gymnasialfassungen). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung und Szene. Zwei getrennte Beleglisten; ein Commit.
- **Titan, Was das Bild zeigt:** Eintrag `titan-dunst`, Index 12: Bahntyp `orbit`, `targetId` `titan` ohne `lookAtId`, `distanceInRadii` 7, `elevationDeg` 15, `azimuthDeg` 0, `azimuthRateDegPerSec` 11, `durationSec` 35, `timeRateDaysPerSec` 0,3, Streuung `azimuthDeg` 0 bis 360, `elevationDeg` −10 bis 10 additiv, `distanceFactor` 0,8 bis 1,5 — nachrechnen: Kameraabstand und Winkeldurchmesser Titans, Umlauf der Kamera (385° in 35 s), ob und wann Saturn durchs Bild zieht (Winkeldurchmesser Saturns von Titan aus rund 5,5° — nachrechnen; Blickrichtung Kamera→Titan gegen Richtung Titan→Saturn je Azimut; der Kommentar sagt „garantiert ist das nicht" — Anteil der Szenenzeit mit Saturn im Bild bei mehreren Bahnphasen berechnen), 10,5 simulierte Tage (0,66 Titanumläufe, Drehung Titans), Phasenwinkel und Terminator, Ringe von Titan aus (Öffnung, Kantenstellung nahe der Bahnebene: Titans Bahn liegt 0,36° gegen Saturns Äquator, die Ringe erscheinen von Titan aus fast von der Kante — nachrechnen).
- **Titan, Hintergrund:** der Dunst als das, was man real sähe (Titan im sichtbaren Licht strukturlos orange, Oberfläche nur im nahen Infrarot und Radar; Voyager 1 1980 sah nur Dunst), Aufbau der Dunstschichten (Hauptschicht, abgesetzte Schicht bei 500 km, jahreszeitliche Änderungen), Photochemie und Tholine, Vorwärtsstreuung des Dunstes im Gegenlicht (Cassini-Aufnahmen mit leuchtendem Rand), Saturn von Titan aus (Winkeldurchmesser, Ringe von der Kante), Huygens-Bilder aus dem Abstieg.
- **Titan, Modellgrenzen:** **keine Atmosphäre im Renderer** — Titan zeigt eine Oberflächenkarte (Cassini-ISS/VIMS-Mosaik laut `ASSETS.md`), die real unter dem Dunst verborgen ist; kein Randleuchten, keine Vorwärtsstreuung an Titan (nur Ringe haben den Term); Albedo 0,22 (geometrische Albedo des Dunstes) auf einer Karte angewandt, die nicht der Dunst ist; Belichtung auf Titan (`exposureTargetId`); Saturn ohne Abplattung, Ringe als Scheibe; Zeitraffer beim Start; Saturns Erscheinen nicht garantiert (Zahl aus der eigenen Rechnung).
- **Enceladus, Was das Bild zeigt:** Eintrag `enceladus-hell`, Index 13: Bahntyp `orbit`, `targetId` `enceladus`, `distanceInRadii` 5, `elevationDeg` 10, `azimuthDeg` 225,58, `azimuthRateDegPerSec` 1,5, `durationSec` 30, `timeRateDaysPerSec` 0,05, Streuung `azimuthDeg` −20 bis 20, `elevationDeg` −8 bis 8 additiv, `distanceFactor` 0,8 bis 1,5 — den Kommentar (Azimut 225,58° = Sonnenrichtung von Saturn aus zur Epoche, Elevation 2,31°) **selbst nachrechnen** aus Saturns Position zu J2000 (`positionAt` in `sim/orbit.ts`), und prüfen, ob die Sonnenrichtung zur tatsächlichen Szenenzeit (die Uhr läuft weiter; Saturn wandert 12° je Jahr) noch passt: Phasenwinkel je Simulationsdatum 2026 und Abweichung gegen J2000; Winkeldurchmesser des Mondes, 1,5 simulierte Tage (1,1 Umläufe um Saturn, Enceladus zeigt Saturn stets dieselbe Seite — welche Hemisphäre sieht die Kamera), Saturn im Hintergrund (Winkeldurchmesser von Enceladus aus rund 28° — nachrechnen), Schatten von Saturn und Ring auf Enceladus (ob die Szene in Saturns Schatten geraten kann: Bahnradius 238 420 km gegen Schattenlänge und Sonnenhöhe über der Äquatorebene zur Szenenzeit).
- **Enceladus, Hintergrund:** die höchste geometrische Albedo im Sonnensystem (1,24 bei 0,55 µm nach Buratti et al. 2022, Zahlen wie `thema-photometrie`), warum sie über 1 liegt (Oppositionseffekt, kohärente Rückstreuung, frischer E-Ring-Frost), der E-Ring als Quelle der Politur (Verbiscer 2007), Fontänen im Gegenlicht (Porco 2006; nur bei hohem Phasenwinkel sichtbar), Tigerstreifen am Südpol und die Frage, was die Kamera davon sieht (Südpol bei Elevation 2 bis 18° kaum).
- **Enceladus, Modellgrenzen:** Albedo 1,0 mit Kartenfaktor 5,80 statt Phasenfunktion (Zahlen wie `thema-photometrie`, keine Rückstreuspitze, Lambert), keine Fontänen, kein E-Ring; der Kommentar in `scenes.ts` meldet eine „gedämpfte Helligkeit" — Befund am Code prüfen (`lighting.ts`: `uTag`, Distanzausgleich, Fülllicht) und mit der Rechnung linear = Albedo·uTag/π, dann ACES, dann sRGB (Regel der lokalen Projektanleitung) einen erwarteten Pixelwert der Enceladus-Scheibe nennen; Belichtung auf Enceladus; Saturn und Ringe wie Task 1 und 2; Zeitraffer beim Start; Sonnenrichtung fest aus J2000 statt aus der Szenenzeit (Abweichung in Grad je Jahr).
- Code lesen: `src/data/scenes.ts` (beide Einträge mit Kommentaren), `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/saturn.ts`, `src/data/bodies/saturn-monde.ts`, `src/sim/orbit.ts` (`positionAt`), `src/sim/scale.ts`, `src/render/lighting.ts`, `src/render/albedo.ts`, `src/render/exposure.ts`, `src/render/shadows.ts`, `src/render/renderer.ts`, `ASSETS.md` (Titan- und Enceladus-Texturen).
- Verweise (je Szene mindestens): Titan: `objekt:titan`, `objekt:saturn`, `objekt:venus` (Dunst als Vergleich), `thema:photometrie`, `thema:gebundene-rotation`, `szene:enceladus-hell`, `thema:modell`; Enceladus: `objekt:enceladus`, `objekt:saturn`, `objekt:dione`, `thema:photometrie`, `thema:ringe`, `thema:gezeiten`, `thema:finsternis`, `szene:titan-dunst`, `thema:modell`; Karten: `szene:titan-dunst` → `quelle:nssdc-saturnmonde`, `quelle:esa-cassini-huygens`; `szene:enceladus-hell` → `quelle:nssdc-saturnmonde`, `quelle:nasa-saturnmonde`, `quelle:nasa-cassini`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Tomasko et al. 2005 (siehe Task 3); West et al. 2011, abgesetzte Dunstschicht (*Geophysical Research Letters* 38, L06204); Hörst 2017 (siehe Task 3); Smith et al. 1981, Voyager 1 (siehe Task 6); Porco et al. 2005, Cassini-Bilder von Titan (*Nature* 434, 159); Buratti et al. 2022 (`buratti-2022`); Verbiscer et al. 2005 (`verbiscer-2005`); Verbiscer et al. 2007 (`verbiscer-2007`); Porco et al. 2006 (siehe Task 4); Howett et al. 2010 (`howett-2010`); Hedman et al. 2013 (siehe Task 4); Mallama et al. 2017 (`mallama-2017`).
- Neue Testfälle: 4 Dateien × 11 = 44.

- [ ] **Schritt 1:** Vorlage und Code lesen, Saturn-Sichtbarkeit von Titan aus, Sonnenrichtung zur Szenenzeit, Schattenlage von Enceladus und den erwarteten Pixelwert im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, zwei Beleglisten, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutsche Texte, englische Fassungen.
- [ ] **Schritt 4:** Tests, Gesamtzahl (Soll 4475), Wortzahlen aller vier Dateien.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-titan-dunst.md src/data/texte/en/hochschule/szene-titan-dunst.md docs/belege/hochschule/szene-titan-dunst.md src/data/texte/de/hochschule/szene-enceladus-hell.md src/data/texte/en/hochschule/szene-enceladus-hell.md docs/belege/hochschule/szene-enceladus-hell.md src/data/literatur.ts
git commit -m "Hochschultexte Szenen Titan im Dunst und Enceladus im hellen Glanz mit Beleglisten"
```

- [ ] **Schritt 6:** Eine Fachprüfung über beide Textpaare, eine Nacharbeit.

---

### Task 8: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe6-abnahme.md`
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

Expected: Lint ohne Befund; alle Tests grün (Soll 4475 nach „Testzahlen" oben, zuzüglich Tests aus Zwischen-Tasks); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, Ausgangsstand 1 363,61 kB nach 4d-5); Prüfskript über den ganzen Katalog mit 0 Fehlern und ohne 429, Laufzeit notieren (Ausgangsstand 492 s bei 442 Einträgen). Schlusszeilen, die Katalogzahl (Ausgangsstand 442) und die Ausgabe des Prüfskripts ins Protokoll wie in der Abnahme 4d-5 §3; jede Warnung begründen (bekannt: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` Körperschaft zuerst).

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

Kombinationen: Sprachen `de`, `en` × die neun Kennungen (`saturn`, `titan`, `enceladus`, `ringe`, `saturn-streiflicht`, `saturn-ringkante`, `ringdurchflug`, `titan-dunst`, `enceladus-hell`). Zustand setzen wie in der Abnahme 4d-5: Körper über `setInfo({ thema: null })` und `setCamera({ targetId: '<id>', mode: 'free' })`; das Thema über `setInfo({ thema: 'ringe' })`; Szenen über `setCinema({ running: true, shuffle: false, nummer: <Index> })` mit den Indizes 1, 10, 11, 12, 13 (am Array in `src/data/scenes.ts` gegenprüfen), `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setTime({ paused: true })`, `setUi({ hidden: false })`. Beim Wechsel von einer Szene oder einem Thema zurück zu einem Körper zuerst `setInfo({ thema: null })` setzen (Messfalle aus 4d-5). Auf den Kopfwechsel pollen (Titel wie in der ersten Zeile des Texts), Hinweise erst nach dem Auflösen des faulen Imports werten, dann auswerten:

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

Je Sprache: Fachthema `gezeiten` öffnen (`setInfo({ thema: 'gezeiten' })`), den ersten Verweis `a[data-verweis="objekt:titan"]` klicken, auf den Kopf „Titan" pollen, dann: keine Hinweiszeile im Textbereich. Ebenso Fachthema `innerer-aufbau` öffnen (`setInfo({ thema: 'innerer-aufbau' })`), `a[data-verweis="thema:ringe"]` klicken, Kopf „Ringsysteme" / „Ring systems", keine Hinweiszeile. Vier Messungen, Ergebnis mit Wartezeit in ms ins Protokoll.

- [ ] **Schritt 5: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 6: Protokoll `docs/phase4d-etappe6-abnahme.md`**

Gliederung wie `docs/phase4d-etappe5-abnahme.md`:

```md
# Abnahme Phase 4d Etappe 6 „Saturn und Ringe"

## 1. Umfang
## 2. Lint, Tests, Build
(Testzahl als durchgehende Tabelle Task → Zuwachs → Summe; Hauptchunk gegen 1 363,61 kB; Katalog gegen 442, je Task aus `git diff` nachgezählt, nicht aus den Berichten übernommen)
## 3. Prüfskript
## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
## 5. Sichtprüfung
### 5.1 Rundgang
### 5.2 Ersatz entfällt
### 5.3 Konsole
## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:", einschließlich der Rulings, die der Controller nach Task 8 setzt — der Controller nennt sie im Auftrag oder trägt sie in der Nacharbeit nach der Schlussprüfung nach)
## 7. Bekannte Unschärfen
(Befunde am Simulationscode als Kandidaten für eigene Tasks; Restbefunde der Fachprüfungen)
## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer; gemeldete Fehler in Gymnasialtexten; die Plan-Rulings als Themenliste)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, jede Summe nachgerechnet, Katalogzuwächse am `git diff` gezählt (in 4d-5 nannte ein Bericht 18 statt 17). Die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung nennen, ohne Suchmuster.

- [ ] **Schritt 7: README**

In `README.md` im Absatz zu Phase 4d den Satzteil

```md
Etappe 5 Jupiter, Io, Europa, Ganymed, Kallisto und die Szenen „Vorbeiflug an
Jupiter" und „Das galileische Schattenspiel". Offen sind die übrigen
Hochschultexte (Etappen 4d-6 bis 4d-11) und Phase 5
```

ersetzen durch:

```md
Etappe 5 Jupiter, Io, Europa, Ganymed, Kallisto und die Szenen „Vorbeiflug an
Jupiter" und „Das galileische Schattenspiel"; Etappe 6 Saturn, Titan,
Enceladus, das Thema „Ringsysteme" und die Szenen „Saturn im Streiflicht",
„Saturns Ringe von der Kante", „Durchflug durch Saturns Ringe", „Titan im
Dunst vor Saturn" und „Enceladus im hellen Glanz". Offen sind die übrigen
Hochschultexte (Etappen 4d-7 bis 4d-11) und Phase 5
```

Danach die Zeilenumbrüche des Absatzes glätten (Zeilen bis rund 80 Zeichen), ohne den Wortlaut zu ändern.

- [ ] **Schritt 8: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe6-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm (Aufnahmen, Skripte löschen).

```bash
git add docs/phase4d-etappe6-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 6: Saturn und Ringe"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe; Paket ohne die fachgeprüften Texte und Beleglisten, mit Katalogeinträgen und Protokoll; sie ist zugleich die Task-Prüfung der Abnahme); Befunde gebündelt in **einer** Nacharbeit, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-6` nach `master`, Branch löschen; Diff auf Zugangsdaten prüfen; **Push erst nach dem Ja von Jens** (Ruling 14).
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Befunde am Simulationscode als Kandidaten. Etappe 4d-7 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- Modelle nach Weisung von Jens: Umsetzer der Text-Tasks, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell (sonnet); rein mechanische Aufträge (README, Formfixes, Katalogfelder, Nacharbeit nach der Schlussprüfung) auf dem kleinsten (haiku). Das stärkste Modell nur nach zweimaligem Scheitern an derselben Stelle. Bei einem Kontingentlimit (4d-5: HTTP 429 auf sonnet) auf haiku ausweichen und in §8 vermerken.
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace `.superpowers/sdd/2026-09-21-phase4d-hochschule-etappe6/`.
- Fachprüfer laufen parallel zum nächsten Umsetzer; Nacharbeiten und Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`. Ein Umsetzer bekommt den Hinweis, welche fremde Belegliste gerade im Arbeitsbaum geändert sein kann.
- Jeder Umsetzer bekommt die Gemeinsamen Vorgaben, seinen Task und die Globalen Randbedingungen wörtlich (als Dateien); die Modellzahlen aus Task 1 (Saturn), 2 (Ringe), 3 (Titan) und 4 (Enceladus) gibt der Controller aus den Berichten an die Folgetasks weiter.
- Eine Prüfrunde je Text: Nach der Nacharbeit keine weitere Prüfung beauftragen; Zweifel gehen ins Protokoll §8. Prüfaufträge verlangen ausdrücklich das Schreiben der Prüfspalte in die Datei.
- Websuche-Kontingent: In 4d-5 war es die ganze Etappe erschöpft; Recherche per WebFetch (Crossref-API, doi.org, arXiv, ADS) hat funktioniert. Ein Umsetzer, der nicht mehr suchen kann, meldet das im Bericht, zitiert nur Geöffnetes und nennt die Stellen, die die Fachprüfung an der Quelle nachholen soll.
- Zahlen in Berichten nachrechnen (4d-5: Katalogzuwachs 18 statt 17 in einem Bericht).

## Rulings

Entscheidungen der Planung (21.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** „Push und weiter" (Jens, 21.09.2026) gilt als Freigabe für Etappe 4d-6; die Fragen aus §8 der Abnahme 4d-5 werden nicht abgewartet.
2. **Ruling:** Modelle wie in 4d-4 und 4d-5 (Weisung von Jens): mittleres Modell für Texte, Prüfer, Abnahme und Schlussprüfung, kleinstes für Mechanik; bei Kontingentlimit kleinstes mit Vermerk in §8.
3. **Ruling:** Höchstens eine Prüfrunde je Text (Regel von Jens): Fachprüfung, eine Nacharbeit, Schluss; keine Nachprüfung; in der Nacharbeit wird nicht gekürzt.
4. **Ruling:** Saturn ohne Abschnitt „Oberfläche" (Entwurf §5.1 lässt ihn bei Gasplaneten entfallen, wie Jupiter in 4d-5); Wolkendecke, Bänder, Hexagon und Stürme stehen unter „Atmosphäre und Magnetosphäre".
5. **Ruling:** Reihenfolge Saturn → Ringe → Titan → Enceladus → Szenen: Das Thema kommt früh, weil die drei Ringszenen seine Modellzahlen übernehmen; Enceladus nach Titan, weil sein Text den E-Ring aus dem Thema braucht.
6. **Ruling:** Die fünf Szenen laufen in drei Tasks (5: Streiflicht und Ringkante — beide zeigen den Ring vom Planeten aus; 6: Ringdurchflug allein — eigene Vorbeifluggeometrie und Gegenlichtrechnung; 7: Titan-Dunst und Enceladus-Hell — beide Mondszenen mit Saturn im Hintergrund), nach Entwurf §7 („zu zweit oder zu dritt"). Eine Fachprüfung je Task prüft beide Textpaare, eine Nacharbeit bündelt beide. Kosten bei Fehlurteil: längere Aufträge, mehr Befunde je Prüfung.
7. **Ruling:** Befunde am Simulationscode werden in 4d-6 nicht behoben (wie 4d-3 bis 4d-5): keine Abplattung Saturns, Rotation 10,656 h gegen die Ringseismologie, Ringe ohne Dicke, Teilchen, D-, F-, G-, E-Ring und ohne Oppositionseffekt, Vorwärtsstreuung als Gestaltungswert, Titan ohne Atmosphäre, Enceladus ohne Fontänen und nie Okkluder, „gedämpfte Helligkeit" der Saturnmonde laut `scenes.ts`, Sonnenrichtung der Szene `enceladus-hell` fest aus J2000, feste Pole, Nullmeridiane 0 gegen W₀. Die Texte beschreiben den Ist-Code; neue Befunde gehen ins Ledger und ins Protokoll §7.
8. **Ruling:** Modellzahlen aus fachgeprüften Texten (`thema-gezeiten`, `thema-innerer-aufbau`, `thema-photometrie`, `thema-resonanzen`, `thema-finsternis`, `thema-gebundene-rotation`, `thema-bahnelemente`, `thema-entstehung`, dazu die 4d-5-Texte) übernehmen die neuen Texte gleichlautend; Abweichungen der eigenen Nachrechnung gehen an Jens (§8), der fachgeprüfte Text wird nicht geändert.
9. **Ruling:** Kein eigener Verweis-Task: Alle neun Kennungen haben Gymnasialtexte; die vorhandenen Verweise älterer Hochschultexte auf `objekt:saturn` (5), `objekt:titan` (5), `objekt:enceladus` (6) und `thema:ringe` (2) führen danach auf die Hochschultexte.
10. **Ruling:** Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); große Zahlen in Formeln ohne Trennzeichen; Zahlenspannen nennen, wofür sie gelten.
11. **Ruling:** Die Fachprüfung behält die sieben Prüfpunkte und den Hinweis auf die eine Runde; sie schreibt die Prüfspalte ausdrücklich in die Datei.
12. **Ruling:** Eine Sichtprüfung des Formelsatzes entfällt, solange kein neuer TeX-Befehl dazukommt.
13. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle; wächst der Chunk gegenüber 1 363,61 kB um mehr als 50 kB, geht die Frage des faulen Ladens an Jens.
14. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master`; der Push folgt erst nach dem Ja von Jens (bei 4d-4 und 4d-5 hat er ihn jeweils ausdrücklich freigegeben). Jens gibt danach 4d-7 frei.
15. **Ruling:** Wortzahl-Obergrenze ein Drittel über dem Richtwert (Körper 4667, Thema 5333, Szenen 1200); Straffung vor dem Commit, nie in der Nacharbeit; Richtigkeit vor Wortzahl, wenn eine Berichtigung die Grenze überschreitet.
16. **Ruling:** Katalogform wie nach der Schlussprüfung 4d-4: beschreibende Zusätze in `erschienen` englisch, Eigennamen original, Vorabdrucke `'arXiv'`, laufend gepflegte Seiten mit Zugriffsjahr, Konsortial-Bylines mit dem Menschen zuerst.
17. **Ruling:** Quellenkarten aus dem Brief sind Angebot, keine Pflicht; ein `quelle:`-Beleg muss die Aussage auf der Seite tragen.
18. **Ruling:** Das Thema `ringe` ist nach Entwurf §5.1 frei gegliedert, endet aber wie die sechs Fachthemen aus 4d-2 mit `## Offene Fragen` und `## Im Modell` (der Dateitest prüft bei Themen keine Gliederung; die beiden Abschnitte sind Vorgabe der lokalen Projektanleitung). Der Text behandelt alle vier Ringsysteme und die Ringe kleiner Körper, weil der Gymnasialtext sie nennt und ein Hochschultext ihm nicht widersprechen darf; Schwerpunkt bleibt Saturn.
19. **Ruling:** Enceladus bekommt den Richtwert großer Körper (1500 bis 3500 Wörter) statt den kleiner Monde (600 bis 1000): Alle acht Abschnitte haben Cassini-Stoff (Schwerefeld, Ozean, Fontänen, Chemie, Resonanz, Altersfrage), und `objekt-europa` als Vorlage liegt bei 2579/2835 Wörtern. Kosten bei Fehlurteil: ein Text, den Jens kürzen lässt.
20. **Ruling:** Die Sonnenrichtung der Szene `enceladus-hell` (Azimut 225,58°) und der Ringknoten der Szenen `saturn-ringkante`/`ringdurchflug` (169,53°) sind Szenendaten, keine Belege: Die Texte rechnen sie nach, beschreiben die Abweichung zur Szenenzeit als Modellgrenze und ändern `scenes.ts` nicht.
21. **Ruling:** Der Task-Prüfung der Abnahme (Task 8) dient die Schlussprüfung; ihr Paket enthält Protokoll und README vollständig (wie in 4d-5 per Ruling entschieden).
22. **Ruling:** Der zurückgestellte Minor aus 4d-4 (`scripts/literaturVergleich.ts`: `name: ''` ohne `family` gälte als Körperschaft) bleibt zurückgestellt; kein Code-Task in dieser Etappe.
