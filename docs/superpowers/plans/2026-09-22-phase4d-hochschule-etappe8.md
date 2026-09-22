# Phase 4d Hochschule, Etappe 8 „Uranussystem" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Uranus, Miranda, Ariel, Umbriel, Titania und Oberon, das Thema `achsneigung` und die Szene `uranus-gekippt` haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung (Entwurf §7, Zeile 4d-8, 16 Dateien). Danach **Halt** für die Freigabe von Etappe 4d-9.

**Architektur:** Sechs Körper-Tasks, ein Themen-Task und ein Szenen-Task, **nicht wörtlich im Plan**: Der Umsetzer liest den Code, recherchiert, schreibt und belegt nach Entwurf §6.4; eine Fachprüfung mit frischem Kontext prüft **einmal**, danach folgt **eine** Nacharbeit (Regel von Jens vom 20.09.2026). Kein Code-Task, kein Vorab-Task (Abnahme 4d-7 §8 ließ nichts für diese Etappe offen). Reihenfolge Uranus → Thema → Monde von innen nach außen → Szene (Ruling 5): Uranus liefert die Polkonvention und die Modellzahlen, das Thema die Kippmechanismen, Miranda die Resonanzgeschichte des Mondsystems, die Szene übernimmt alles. Alle acht Kennungen dieser Etappe haben Gymnasialtexte, deshalb setzt jeder Text-Task seine Verweise selbst. Task 9 ist die Abnahme nach Entwurf §8.2.

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §4.1, §5 (Gestalt der Texte), §6 (Arbeitsweise), §7 Zeile 4d-8, §8.2 (Abnahme). Vorlagen: Plan `docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe7.md`, Abnahme `docs/phase4d-etappe7-abnahme.md` und die fachgeprüften Hochschultexte unter `src/data/texte/de/hochschule/` samt Beleglisten unter `docs/belege/hochschule/` (Planet: `objekt-saturn.md`, `objekt-jupiter.md`; Monde: `objekt-mimas.md`, `objekt-iapetus.md`, `objekt-rhea.md`; Themen: `thema-ringe.md`, `thema-gebundene-rotation.md`, `thema-bahnelemente.md`, `thema-photometrie.md`; Szene: `szene-saturn-ringkante.md`, `szene-iapetus-schief.md`). Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und im Literaturkatalog (Originaltitel; beschreibende Zusätze im Feld `erschienen` englisch, Eigennamen von Verlagen und Einrichtungen original).
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei. Protokolle, Berichte und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**. Keine Prozesssprache (Task, Ruling, Brief) in Texten oder Beleglisten (Befund `objekt-venus.md` in 4d-4, seit 4d-6 Prüfpunkt 8 der Fachprüfung).
- Branch `hochschule-8` (von `master`, Stand f3d579b — Abnahme 4d-7 mit den Nachträgen zu §8), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test) und steht alphabetisch nach Kennung (Test); Vorabdrucke tragen `erschienen: 'arXiv'` (Test); laufend gepflegte Seiten tragen das Zugriffsjahr.
- Keine neue Abhängigkeit in `package.json`. Kein Code außer in etwaigen Zwischen-Tasks für neue TeX-Befehle; Befunde am Simulationscode, die ein Text aufdeckt, beschreibt der Text in „Im Modell" und der Bericht meldet sie (Ruling 7).
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben.
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Namen beziehungsweise Titel aus `ui/i18n` (Körper `body.<id>.name`, Thema `thema.achsneigung.title` = „Achsneigung" / „Axial tilt", Szene „Szene: " / „Scene: " vor dem Szenentitel `scene.uranusGekippt` = „Der liegende Uranus" / „Uranus lying on its side", wie in den Gymnasialfassungen); Körper mit den festen `##`-Überschriften aus Entwurf §5.1 in dieser Reihenfolge, Pflichtabschnitte nie weglassen; Thema frei gegliedert mit Schluss `## Offene Fragen`, `## Im Modell` (Ruling 18 aus 4d-6); Szene mit den drei festen `##`-Überschriften; Hochschultexte enden mit `*Stand: September 2026*` / `*As of September 2026*` als eigenem Absatz; `literatur:` nur in Hochschultexten. **Richtwerte dieser Etappe (Ruling 4):** Uranus 1500 bis 3500 Wörter je Fassung (Obergrenze 4667), Thema 1500 bis 4000 (5333), die fünf Monde 800 bis 1800 (2400), Szene 300 bis 900 (1200). Richtigkeit geht vor Wortzahl; gestrafft wird vor dem Commit, nie in der Nacharbeit.
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten. Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen); Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste. Nacharbeiten warten, bis kein anderer Umsetzer läuft.
- **Höchstens eine Prüfrunde je Text** (Jens, 20.09.2026): ein Umsetzer, eine Fachprüfung, eine Nacharbeit, dann Schluss. Keine Nachprüfung. Was danach offen bleibt, steht im Abnahmeprotokoll (§7, §8).
- Modelle nach Weisung von Jens: Text-Umsetzer, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell, mechanische Aufträge auf dem kleinsten; das stärkste nur nach zweimaligem Scheitern an derselben Stelle (Ruling ins Ledger). Greift ein Kontingentlimit des mittleren Modells, läuft der Auftrag auf dem kleinsten Modell weiter und die Abnahme vermerkt es in §8.
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe8/progress.md` (git-ignoriert), am Ende gesammelt ins Abnahmeprotokoll.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Körper `uranus` | 2 Texte, `docs/belege/hochschule/objekt-uranus.md`, `src/data/literatur.ts` |
| 2 | Thema `achsneigung` | 2 Texte, `docs/belege/hochschule/thema-achsneigung.md`, `src/data/literatur.ts` |
| 3 | Körper `miranda` | 2 Texte, `docs/belege/hochschule/objekt-miranda.md`, `src/data/literatur.ts` |
| 4 | Körper `ariel` | 2 Texte, `docs/belege/hochschule/objekt-ariel.md`, `src/data/literatur.ts` |
| 5 | Körper `umbriel` | 2 Texte, `docs/belege/hochschule/objekt-umbriel.md`, `src/data/literatur.ts` |
| 6 | Körper `titania` | 2 Texte, `docs/belege/hochschule/objekt-titania.md`, `src/data/literatur.ts` |
| 7 | Körper `oberon` | 2 Texte, `docs/belege/hochschule/objekt-oberon.md`, `src/data/literatur.ts` |
| 8 | Szene `uranus-gekippt` | 2 Texte, `docs/belege/hochschule/szene-uranus-gekippt.md`, `src/data/literatur.ts` |
| 9 | Abnahme | `docs/phase4d-etappe8-abnahme.md`, `README.md` |

Hochschultexte liegen unter `src/data/texte/<de|en>/hochschule/<art>-<kennung>.md`. Kennungen: `uranus` (`src/data/bodies/uranus.ts`), `miranda`, `ariel`, `umbriel`, `titania`, `oberon` (`src/data/bodies/uranus-monde.ts`), Thema `achsneigung` (`src/data/themen.ts`), Szene `uranus-gekippt` wie in `src/data/scenes.ts` (Index 16, am Array gegengeprüft: `grep -n "id: '" src/data/scenes.ts` zählt 0-basiert erdaufgang, saturn-streiflicht, mondtanz, ferne-sonne, systemblick, merkurjagd, jupiter-vorbeiflug, galileisches-schattenspiel, phobos-tiefflug, pluto-charon, saturn-ringkante, ringdurchflug, titan-dunst, enceladus-hell, triton-rueckwaerts, iapetus-schief, **uranus-gekippt** (16), ceres-guertel, mondfinsternis).

**Testzahlen:** Ausgangsstand `master` f3d579b (Abnahme 4d-7 mit Nachträgen): 4607 Tests, Katalog `src/data/literatur.ts` 559 Einträge, Quellenkarten 82, Hauptchunk 1 395,66 kB, Prüfskript 590 s bei 559 Einträgen (4 bekannte Warnungen: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` und `sanchez-lavega-2011` Konsortial-Byline). Im Dateitest `src/data/texte/dateien.test.ts` erzeugt ein Hochschultext eines Körpers oder einer Szene 11 Fälle, ein Themen-Text 10 (ohne „folgt der Gliederung seiner Art"). Soll: 4607 + 14 × 11 + 2 × 10 = **4781**, zuzüglich Tests aus Zwischen-Tasks für neue TeX-Befehle. Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test`. Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

## Gemeinsame Vorgaben für Task 1 bis 8 (Texte)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den fachgeprüften Hochschultexten als Maßstab für Tiefe, Ton und Belegdichte: `objekt-saturn.md` und `objekt-jupiter.md` für Uranus, `thema-ringe.md` und `thema-gebundene-rotation.md` für das Thema, `objekt-mimas.md`, `objekt-iapetus.md` und `objekt-rhea.md` für die Monde, `szene-saturn-ringkante.md` und `szene-iapetus-schief.md` für die Szene. Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang. Besonderheit dieser Etappe: Das Uranussystem hat nur **eine** Raumsonde gesehen, Voyager 2 am 24. Januar 1986, und nur die damals sonnenzugewandte Südhalbkugel der Monde; alles Spätere stammt von Erde, Hubble und JWST oder aus Modellen. Die Texte sagen bei jedem Wert, worauf er beruht, und stellen die Lücken als solche dar.

**Ablauf je Task**

1. **Vorlage lesen:** den passenden fachgeprüften Text in beiden Fassungen und seine Belegliste unter `docs/belege/hochschule/` (Form der Belegliste, Abschnitt „Im Modell"). Dazu den Gymnasialtext derselben Kennung, damit der Hochschultext ihm nicht widerspricht; findet der Umsetzer im Gymnasialtext einen sachlichen Fehler, meldet er ihn im Bericht (nicht ändern).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (Node mit Typentfernung oder Vite-SSR aus dem Projektverzeichnis, nicht versioniert; Node kann Projektmodule nicht direkt laden, Formeln werden nachgebildet). Werte des Datenblocks aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten — insbesondere die Zeile „Achsneigung", die `achsneigungDeg` in `src/sim/orbit.ts` liefert: Winkel zwischen IAU-Pol und der aus Position und Geschwindigkeit zur Epoche J2000 gebildeten Bahnnormale, bei negativer Rotationsperiode um 180° umgeklappt (`drehsinn`); für Uranus ergibt das 97,77° bei einem geometrischen Winkel Pol–Bahnnormale von 82,23°, für die fünf Monde mit $i \approx 180^\circ$ und negativer Periode dagegen kleine Winkel (selbst nachrechnen).
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf (steht keine Websuche zur Verfügung, mit WebFetch über Crossref-API `https://api.crossref.org/works/<doi>`, doi.org, arXiv, ADS, Verlagsseiten; im Bericht vermerken): zuerst nach neueren Übersichtsartikeln, Hubble- und JWST-Auswertungen und Missionsstudien suchen (Uranus Orbiter and Probe, Decadal Survey 2023), auch wenn der Stoff bekannt scheint. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, Band, Seite und DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren. Einträge, die schon im Katalog stehen (`src/data/literatur.ts`, 559 Einträge, darunter mit Uranus- oder Achsneigungsbezug `elliot-1977`, `showalter-2006`, `irwin-2025`, `wang-2025`, `mallama-2017`, `mallama-2018`, `archinal-2011`, `archinal-2018`, `archinal-2019`, `laskar-1993`, `laskar-2004`, `laskar-2004a`, `correia-2001`, `ward-2004`, `wisdom-2022`, `stark-2015`, `petit-2010`, `murray-2000`, `smith-1981`), wiederverwenden statt doppelt anlegen; ihr Inhalt wird trotzdem für jede neue Aussage geöffnet.
4. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" leer:

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile — auch eigene Herleitungen (Beleg „Herleitung" mit Rechenweg) und Vergleiche; „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" oder „Nachrechnung am Code: <Datei>". Senkrechte Striche in Zellen als `\|` maskieren (jede Zeile hat genau sechs Zellen, Zelle 1 die Nummer). Querverweise zwischen Zeilen nach jeder Neunummerierung prüfen. Ein `quelle:`-Beleg muss die Aussage auf der Seite tatsächlich tragen. Keine internen Kurzverweise auf Aufträge oder Berichte (Sammelbefund der Abnahme 4d-7 §7).
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`; Körperschaften als Autor wie bei `cgpm-2022`, Konsortial-Bylines mit dem Menschen zuerst. `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer; Vorabdrucke `erschienen: 'arXiv'`; beschreibende Zusätze englisch, Eigennamen original. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test). Kennungen gleicher Erstautoren und Jahre mit Buchstaben unterscheiden (`laskar-2004a` existiert).
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen.
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile und Gliederung nach den Globalen Randbedingungen und Entwurf §5.1. Körper: `## Kenngrößen und Messung`, `## Inneres`, `## Oberfläche` (entfällt bei Uranus), `## Atmosphäre und Magnetosphäre`, `## Bahn, Rotation und Dynamik`, `## Entstehung und Entwicklung`, `## Offene Fragen`, `## Im Modell` (englisch `Parameters and measurement`, `Interior`, `Surface`, `Atmosphere and magnetosphere`, `Orbit, rotation and dynamics`, `Formation and evolution`, `Open questions`, `In the model`). Thema: frei, Schluss `## Offene Fragen`, `## Im Modell` (`Open questions`, `In the model`). Szene: `## Was das Bild zeigt`, `## Hintergrund`, `## Modellgrenzen` (englisch `What the view shows`, `Background`, `Model limitations`).
   - „Im Modell" / „Modellgrenzen": was Orrery zur Kennung rechnet oder bewusst weglässt, mit Verweis `thema:modell`; jede Abweichung des Modells von der Wirklichkeit mit Größenordnung; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung. Stehen dieselben Modellzahlen schon in einem fachgeprüften Text (siehe unten „Modellzahlen aus fachgeprüften Texten"), dieselben Werte verwenden oder die Abweichung im Bericht begründen (Ruling 8).
   - „Offene Fragen": Streitfragen mit Belegen für beide Seiten, nicht entschieden, solange die Fachwelt es nicht getan hat.
   - Schluss `*Stand: September 2026*` / `*As of September 2026*`.
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit allen Nachträgen). Fehlt ein Befehl, ist das ein eigener Zwischen-Task, kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); Zahlenspannen sagen, wofür sie gelten.
   - Kein `$` außerhalb von Formeln; kein `|` am Absatzanfang außer in Tabellen.
8. **Verweise:** `objekt:`, `szene:`, `thema:` auf Kennungen aus `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts`. Sinnvolle Ziele dieser Etappe: `objekt:uranus`, die fünf Monde, `objekt:neptune`, `objekt:saturn`, `objekt:earth`, `objekt:venus`, `objekt:mars`, `objekt:mercury`, `objekt:pluto`, `objekt:triton`, `thema:achsneigung`, `thema:ringe`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:finsternis`, `thema:bahnelemente`, `thema:bezugssysteme`, `thema:entstehung`, `thema:modell`, `szene:uranus-gekippt`, `szene:saturn-ringkante`. Verweissätze behaupten nur, was das Ziel tatsächlich enthält (Prüfpunkt 9; Befund aus 4d-7). Höchstens ein Verweis je Ziel je `##`-Abschnitt; kein Verweis eines Texts auf sich selbst. Quellenkarten erscheinen automatisch für alle Kennungen in `fuer` (`src/data/quellen.ts`): `nssdc-uranus`, `nasa-uranus`, `nasa-voyager-2` und `pds-rings` decken `objekt:uranus` und `szene:uranus-gekippt`; `nssdc-uranusmonde`, `nasa-uranusmonde`, `nasa-voyager-2` und `jpl-satelliten` alle fünf Monde; `nssdc-factsheets` und `iau-rotation` das Thema. `jpl-satelliten-bahnen` und `jpl-horizons` decken die Uranusmonde **nicht**. Zitiert ein Text eine weitere Karte, ergänzt der Task ihr `fuer`-Feld in `src/data/quellen.ts` um die eigene Kennung (dann wird `quellen.ts` zur Ändern-Datei des Tasks); ein `quelle:`-Verweis ist keine Pflicht (Ruling 17).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht, vom Controller nachgezählt.
10. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen (Commit-Text per `git commit -F` aus einer Datei, wenn er Anführungszeichen enthält). Vorher `git status --short`: keine Reste aus Skripten im Quellbaum; eine vom Prüfer geänderte fremde Belegliste im Arbeitsbaum bleibt liegen und wird nicht mitcommittet.
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten. **Genau eine** Fachprüfung je Task. Der Auftrag verlangt ausdrücklich, die Spalte „Prüfung" **in die Datei** zu schreiben.
12. **Nacharbeit (genau eine):** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger; in der Nacharbeit wird **nicht gekürzt**. In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung`; alle anderen Prüfeinträge bleiben. Jede geänderte Zeile behält sechs Zellen mit der Nummer in Zelle 1, vor dem Commit per Skript im Scratchpad gegengeprüft (Ruling 18). **Keine Nachprüfung:** Was der Umsetzer nicht beheben kann oder anders sieht als der Prüfer, notiert er mit Begründung im Ledger; die Abnahme führt es in §7 oder §8 auf.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste <art>-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Modellzahlen aus fachgeprüften Texten (gleichlautend übernehmen, Ruling 8):**
- `thema-bahnelemente.md`, „Singularitäten" und „Im Modell": Die großen Uranusmonde laufen gegen den IAU-Nordpol des Uranus mit Inklinationen zwischen 175,6° und 180,0°; in Horizons wandert der oskulierende Knoten von Ariel (im Mittel 0,02° von 180° entfernt) von 1986 bis 2026 so unregelmäßig, dass er im quadratischen Mittel um 40° von der Ausgleichsgeraden abweicht, bei Titania kehrt er nach 25 Jahren um, Umbriel und Oberon zeigen gleichmäßige Knotenraten von 3,7° und 0,7° je Jahr gegen 2,8° und 1,9° aus den Knotenperioden der JPL-Tabelle; der Datensatz hält die Knoten aller fünf Uranusmonde fest, nur die Apsiden präzedieren. Für Uranus ist die Kepler-Umlaufzeit des Datenblocks um 0,05 % länger als $360^\circ/\dot{L}$, mit den Massen der inneren Planeten in der Zentralmasse bleiben −0,016 %. Uranusmonde nutzen oskulierende Horizons-Elemente zu J2000 gegen den Äquator des Mutterkörpers mit dessen IAU-Pol; die Knotenlänge zählt vom Knoten dieser Ebene auf dem ICRF-Äquator.
- `thema-gebundene-rotation.md`, „Im Modell" und Modelltabelle: Rotationsperiode gleich $360^\circ/\dot{L}$ bei allen 21 Monden bis auf Rundungsreste, die Richtung zum Mutterkörper wandert bei Miranda 1,1° je Jahrhundert; Libration in Breite gleich dem Winkel zwischen Pol und Bahnnormale, bei Miranda ±4,3°, im Datensatz fest, weil der Knoten nicht wandert — ein Artefakt, da der IAU-Bericht Mirandas Pol als Reihe $257{,}43^\circ + 4{,}41^\circ \sin U_{11} - \ldots$ und $-15{,}08^\circ + 4{,}25^\circ \cos U_{11} - \ldots$ gibt (Archinal et al. 2011) und der Datensatz nur die konstanten Glieder führt; Tabellenzeilen Miranda 0,118 / 77,6° / 78,6°, Ariel 0,066 / 46,7° / 46,6°, Umbriel 0,020 / 0,8° / 1,2°, Titania 0,019 / 31,9° / 31,6°, Oberon 0,006 / 102,6° / 102,6° (Spaltenbedeutung dort nachlesen); alle fünf haben eine negative Rotationsperiode und eine Bahnneigung über 90° gegen den Äquator des Mutterkörpers, Drehung und Umlauf bleiben gleichsinnig.
- `thema-finsternis.md`, „Gezeichnete Schatten": bis zu vier Kugelschatten je Körper (`MAX_OKKLUDER`); bei Uranus fällt Oberon weg.
- `thema-photometrie.md`, Tabelle und Fließtext: Uranus $p = 0{,}488$ im V-Band (Mallama et al. 2017) gegen 0,079 im I-Band; $A_\mathrm{bol} = 0{,}349 \pm 0{,}016$ als Bahnmittel (Irwin et al. 2025); Uranus erscheint heller, wenn mehr von seinen methanarmen Polregionen zu sehen ist; das Materialmodell erreicht ohne Glanz und Fülllicht nur $0{,}640\,p$ statt der vollen Katalogalbedo $p$ (gilt für jeden Körper gleich).
- `thema-ringe.md`, „Die Ringe der übrigen Riesenplaneten" und „Im Modell": Entdeckung am 10. März 1977 bei einer Sternbedeckung, fünf Ringe α, β, γ, δ, ε (Elliot et al. 1977); Schäfermonde Cordelia und Ophelia am ε-Ring; ν und μ 2003 bis 2005 mit Hubble, μ teilt die Bahn mit Mab (Showalter und Lissauer 2006); im Modell sind Uranus' Ringe eine Rechnung aus Messdaten (`ringProfil.ts`): Darstellungsbreite Sockel 260 km plus dem Sechsfachen der echten Breite, diffuse Komponenten zwölffach verstärkt und auf 0,12 gedeckelt, physikalische Deckkraft der schmalen Ringe $1 - e^{-\tau}$ von 10 % (λ) bis 78 % (ε); der Datenblock zeigt keine Ringwerte.
- `objekt-saturn.md`: Uranus' Schiefe 97,77° (nach der Saturn-Formulierung „nach Uranus und Neptun die drittgrößte"); Saturns Schiefe 26,73°, Ursache nach Ward und Hamilton 2004 (Präzessionsresonanz mit Neptuns Bahn) beziehungsweise Wisdom et al. 2022 (verlorener Mond) nicht abschließend geklärt.
- `objekt-venus.md`: Schiefe gegen die eigene Bahnnormale rund 177°, die Rückläufigkeit drückt sich in der Achsneigung aus; `objekt-mars.md`: mittlere Achsneigung $37{,}62^\circ \pm 13{,}82^\circ$ mit Spitzen bis $82{,}035^\circ$ über 5 Milliarden Jahre (Laskar et al. 2004a); `objekt-earth.md`: Schiefe der Ekliptik 84 381,406″ zur Epoche J2000,0, Abnahme 46,84″ je Jahrhundert, Schwankung heute ±1,3° um 23,3°, chaotische Zone 60° bis 90° ohne Mond (Laskar et al. 1993; Gegenposition dort nachlesen), Pol im Datensatz fest bei Rektaszension 0° und Deklination 90°; `objekt-mercury.md`: Schiefe der Spinachse $2{,}029 \pm 0{,}085$ Bogenminuten (Stark et al. 2015), Cassini-Zustand; `objekt-sun.md`: Sonnenäquator 7,25° gegen die Ekliptik J2000, Modellwinkel 7,252°.
- `thema-bezugssysteme.md`: Negatives $\dot{W}$ bedeutet rückläufige Rotation wie bei Venus und Uranus, der Nordpol liegt dann dem Drehimpuls entgegen; für Zwergplaneten, Kleinkörper und deren Monde gilt der positive Pol nach der Rechte-Hand-Regel (Archinal et al. 2011, 2019).
- `thema-entstehung.md`: Uranus und Neptun im Nizza-Modell, Streuung nach außen, der mögliche fünfte Eisriese; Zahlen dort nachlesen, nicht neu herleiten.

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/<datei>` und `src/data/texte/en/hochschule/<datei>` mit der Belegliste `docs/belege/hochschule/<datei>` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder die Crossref-API, arXiv, ADS), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Kommentare im Code sind kein Beleg; rechne Aussagen über das Modell am Code selbst nach (Skripte nur im Scratchpad). Es gibt nur diese eine Prüfrunde: Konzentriere dich auf Fehler, die die Aussage falsch machen, und auf Belege, die die Aussage nicht stützen; Stil und Umfang nur, wenn sie das Verständnis behindern. Prüfe:
> 1. Stützt die zitierte Arbeit die Aussage im Text?
> 2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle?
> 3. Passen Aussagen über Orrery zum Code (`src/data/`, `src/sim/`, `src/render/`, `src/ui/info/datenzeilen.ts`), und erklärt „Im Modell" beziehungsweise „Modellgrenzen" jede Abweichung, auch gegenüber dem Datenblock?
> 4. Stimmen Dimensionen und Größenordnungen der Formeln?
> 5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?
> 6. Sind Streitfragen als solche dargestellt, mit Belegen für beide Seiten?
> 7. Widerspricht der Text einem fachgeprüften Hochschultext (`src/data/texte/de/hochschule/`) in Zahlen oder Aussagen über das Modell?
> 8. Enthält der Text oder die Belegliste Prozesssprache (Task, Ruling, Brief) oder interne Kurzverweise, die in einem veröffentlichten Text nichts verloren haben?
> 9. Behauptet ein Verweissatz (`objekt:`, `thema:`, `szene:`) etwas, das der Zieltext nicht enthält?
>
> **Trage je Zeile der Belegliste in der Spalte „Prüfung" tatsächlich in die Datei ein** (mit dem Edit-Werkzeug, sobald die Zeile fertig ist): `ok (…)`, `Fehler: …` oder `Hinweis: …`; jede Tabellenzeile behält sechs Zellen mit der Nummer in Zelle 1, senkrechte Striche im Eintrag als `\|` maskieren. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte, keinen Code, keinen anderen Teil der Belegliste; kein Commit, kein Browser, keine Subagenten. Schreibe die Befundliste fortlaufend nach `<Befunddatei>` (Klasse Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich, Widerspruch zu einem fachgeprüften Text, Prozesssprache, Verweissatz ohne Deckung; Hinweis: Ton, Vollständigkeit, besserer Beleg; je Befund Fundstelle Datei:Zeile beider Fassungen und ein konkreter Behebungsvorschlag), am Ende eine Zählung ok/Fehler/Hinweis. Rückgabe höchstens 12 Zeilen: Zählung ok/Fehler/Hinweis, Fehler als Einzeiler, Bestätigung, dass die Prüfspalte in der Datei steht, Pfad der Befunddatei.

---

### Task 1: Körper `uranus`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-uranus.md`, `src/data/texte/en/hochschule/objekt-uranus.md`, `docs/belege/hochschule/objekt-uranus.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts` (`fuer` ergänzen, falls eine weitere Karte zitiert wird)

**Schnittstellen:**
- Konsumiert: fachgeprüfte Texte `objekt-saturn` (Aufbau eines Planetentexts, Schiefe 97,77°), `thema-ringe` (Uranusringe, `ringProfil.ts`), `thema-photometrie` (Albedo), `thema-bahnelemente` (JPL-Tafel, Kepler-Umlaufzeit +0,05 %), `thema-finsternis` (Oberon fällt weg), `thema-bezugssysteme` (Polkonvention), `thema-entstehung` (Nizza-Modell).
- Produziert: Hochschultext `objekt:uranus`; Task 2 übernimmt Polkonvention und Modellwinkel (97,77° gegen 82,23°), Task 3 bis 7 die Systemzahlen (GM, $J_2$, Pol, Rotationsperiode, Magnetfeld), Task 8 die Ring- und Jahreszeitenzahlen.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Uranus` in beiden Fassungen. Gliederung Körper; `## Oberfläche` entfällt (Gasplanet), die übrigen sieben Abschnitte in der festen Reihenfolge. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** als Tabelle mit Wert, Unsicherheit, Verfahren, Beleg: $GM$ des Systems und des Planeten (Jacobson 2014 aus Voyager-Tracking und Mondbahnen; gegen $G \times$ Katalogmasse 8,6811·10²⁵ kg mit ppm-Abweichung nachrechnen), Äquator- und Polradius bei 1 bar (rund 25 559 und 24 973 km, Abplattung rund 0,023) gegen den Katalogwert 25 362 km (volumengleicher Kugelradius laut NSSDC — Herkunft prüfen), $J_2$ und $J_4$ (Jacobson 2014), Rotationsperiode: Voyager-Radioperiode 17,24 h (Desch et al. 1986) gegen die neue Bestimmung aus Hubble-Aurorabeobachtungen 2011–2022 (Lamy et al. 2025, *Nature Astronomy*, rund 17,2479 h — Titel, Zahl und Unsicherheit an der Quelle prüfen), Pol (Archinal et al. 2018; Präzession des Uranuspols vernachlässigbar), geometrische und Bond-Albedo (Zahlen wie `thema-photometrie`), Wärmefluss und Energiebilanz (Pearl et al. 1990: innere Wärme nahe null; Wang et al. 2025, `wang-2025`, und Irwin et al. 2025, `irwin-2025`: Neubewertung — Zahlen an der Quelle). **Inneres:** Eisriese, Drei-Schicht-Modelle gegen Modelle mit Übergängen, Trägheitsmomentfaktor, superionisches Wasser (Millot et al. 2019), Dynamo in dünner leitender Schale als Erklärung des nichtdipolaren, gekippten Felds (Stanley und Bloxham 2004), Übersichten Helled et al. 2020 und Nettelmann et al. 2013, empirische Dichteprofile (Movshovitz und Fortney 2022). **Atmosphäre und Magnetosphäre:** Zusammensetzung (H₂, He, CH₄ rund 2,3 % — Lindal et al. 1987 Radio-Okkultation; Sromovsky et al. oder Karkoschka und Tomasko 2009 zur Methanverteilung), Temperaturprofil und Stratosphäre, Farbe und Farbunterschied zu Neptun (Irwin et al. 2022), jahreszeitliche Helligkeits- und Wolkenänderungen, Magnetfeld nach Voyager 2: Dipol um 59° gegen die Drehachse gekippt und um rund 0,3 Radien aus dem Zentrum versetzt (Ness et al. 1986; Connerney et al. 1987), Magnetosphäre und ihr anomaler Zustand während des Vorbeiflugs (Jasinski et al. 2024). **Bahn, Rotation und Dynamik:** Elemente der JPL-Tafel, Umlaufzeit 84,0 Jahre, rückläufige Rotation, Schiefe 97,77° und ihre Definition (Verweis `thema:achsneigung`, Mechanismen dort, hier nur die Folge: 42 Jahre Polnacht), Jahreszeiten mit Terminen (Südsommer-Sonnenwende um 1985/86, Tagundnachtgleiche Dezember 2007, Nordsommer-Sonnenwende um 2030 — Termine an der Quelle prüfen; der Gymnasialtext der Szene nennt „2028", bei Abweichung im Bericht melden, nicht ändern), Ringe (Verweis `thema:ringe`, Zahlen von dort), Mondsystem als Überblick (fünf große Monde in der Äquatorebene, prograd zur Rotation; Verweise auf die fünf Monde). **Entstehung und Entwicklung:** Nizza-Modell (Verweis `thema:entstehung`), Kippung durch Riesenkollision oder Spin-Bahn-Resonanz nur als Verweis auf `thema:achsneigung`, Entstehung der Monde aus einer Kollisionsscheibe (Ida et al. 2020) oder Ko-Akkretion (Szulágyi et al. 2018 oder Salmon und Canup 2022 — Fundstellen prüfen), Uranus Orbiter and Probe als Empfehlung des Decadal Survey 2023 (National Academies 2022/2023, als Körperschaft zitieren, Fundstelle prüfen).
- `## Offene Fragen` (Pflicht): Wärmefluss und Energiebilanz (nahe null nach Voyager gegen Neubewertungen); innerer Aufbau (Schichten gegen Übergänge, Anteil von Gestein und Eis); Ursache der Kippung (Kollision gegen Resonanz — beide mit Beleg, Entscheidung in `thema:achsneigung`); Rotationsperiode (17,24 h gegen Lamy et al. 2025); ob der Voyager-Vorbeiflug einen untypischen Magnetosphärenzustand traf.
- `## Im Modell`: `radiusKm` 25 362 als volumengleicher Kugelradius, keine Abplattung (Äquatorradius rund 0,8 % größer — selbst rechnen); `rotationPeriodH` −17,24 (Voyager-Wert, Vorzeichen als Rückläufigkeit; Abweichung gegen Lamy et al. 2025 in Sekunden je Umdrehung und in Umdrehungen seit J2000 selbst rechnen); Pol 257,311° / −15,175° (Archinal et al. 2018) fest im Raum; Datenblock-Achsneigung 97,77° aus `achsneigungDeg` (Winkel Pol–Bahnnormale 82,23°, um 180° geklappt wegen negativer Periode — selbst nachrechnen, nicht aus dem Kommentar in `uranus.ts`); Albedo 0,488 (geometrisch, V-Band); Elemente aus der JPL-Tafel 1800–2050 mit linearen Raten, Kepler-Umlaufzeit gegen $360^\circ/\dot{L}$ (Zahlen wie `thema-bahnelemente`); Ringe als gerechneter Streifen 37 800 bis 51 600 km (Zahlen wie `thema-ringe`, Texturfrage in `ASSETS.md`); Oberon nie Okkluder (Zahlen wie `thema-finsternis`); keine Atmosphäre, kein Magnetfeld, keine Jahreszeiten-Wolken im Renderer, Textur Solar System Scope (CC BY 4.0, `ASSETS.md`); Maßstab (`sizeScale`); Datenblockwerte gegen Messwerte (Umlaufzeit, Rotation, Achsneigung, Albedo, Masse, Radius).
- Code lesen: `src/data/bodies/uranus.ts` (vollständig, `URANUS_RINGPROFIL`), `src/data/bodies/uranus-monde.ts` (Kopfkommentar), `src/sim/orbit.ts` (`achsneigungDeg`, `rotationAt`, `umlaufzeitTage`), `src/sim/frames.ts` (`poleVector`), `src/sim/scale.ts`, `src/render/ringProfil.ts`, `src/render/rings.ts` (Ringbezug), `src/render/shadows.ts` (`waehleOkkluder`, `MAX_OKKLUDER`), `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Uranus-Textur, Abschnitt „Uranus-Ring"), `src/data/index.test.ts` (Uranus-Sondertests), Hochschultexte `objekt-saturn`, `thema-ringe`, `thema-photometrie`, `thema-bahnelemente`, `thema-finsternis`, `thema-bezugssysteme`, `thema-entstehung`.
- Verweise: `objekt:neptune`, `objekt:saturn`, `objekt:miranda`, `objekt:ariel`, `objekt:umbriel`, `objekt:titania`, `objekt:oberon`, `thema:achsneigung`, `thema:ringe`, `thema:photometrie`, `thema:innerer-aufbau`, `thema:bahnelemente`, `thema:bezugssysteme`, `thema:entstehung`, `thema:finsternis`, `thema:modell`, `szene:uranus-gekippt`; Karten zu `objekt:uranus`: `quelle:nssdc-uranus`, `quelle:nasa-uranus`, `quelle:nasa-voyager-2`, `quelle:pds-rings`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Jacobson 2014, Bahnen der Uranusmonde und Schwerefeld (*Astronomical Journal* 148, 76); Helled et al. 2020, Uranus und Neptun: Ursprung, Entwicklung, innerer Aufbau (*Space Science Reviews* 216, 38); Nettelmann et al. 2013, Innere Modelle (*Planetary and Space Science* 77, 143); Movshovitz und Fortney 2022, empirische Dichteprofile (*Planetary Science Journal* 3, 88); Millot et al. 2019, superionisches Wasser (*Nature* 569, 251); Stanley und Bloxham 2004, Dynamo (*Nature* 428, 151); Ness et al. 1986, Magnetfeld (*Science* 233, 85); Connerney et al. 1987 (*Journal of Geophysical Research* 92, 15329); Jasinski et al. 2024, anomale Magnetosphäre (*Nature Astronomy* 8, 1602); Lindal et al. 1987, Atmosphäre aus Radio-Okkultation (*Journal of Geophysical Research* 92, 14987); Karkoschka und Tomasko 2009, Methan (*Icarus* 202, 287); Irwin et al. 2022, Farbe von Uranus und Neptun (*Journal of Geophysical Research: Planets* 127, e2022JE007189); Desch et al. 1986, Rotationsperiode (*Science* 233, 102); Lamy et al. 2025, neue Rotationsperiode (*Nature Astronomy*); Pearl et al. 1990, Energiebilanz (*Icarus* 84, 12); Wang et al. 2025 (`wang-2025`) und Irwin et al. 2025 (`irwin-2025`), bereits im Katalog; Mallama et al. 2017 (`mallama-2017`); Smith et al. 1986, Voyager-Bildergebnisse (*Science* 233, 43); Stone und Miner 1986, Übersicht des Vorbeiflugs (*Science* 233, 39); Ida et al. 2020, Mondentstehung aus einer Kollisionsscheibe (*Nature Astronomy* 4, 880); Fletcher et al. 2020, Eisriesen-Missionen (*Space Science Reviews* 216, 21); National Academies 2022, Decadal Survey „Origins, Worlds, and Life" (Körperschaft, DOI prüfen); Archinal et al. 2018 (`archinal-2018`), Pol.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; GM-Abweichung, Abplattung, Rotationsabweichung gegen Lamy et al. 2025, Modellwinkel 97,77°/82,23° und Kepler-Umlaufzeit im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test`; Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-uranus.md src/data/texte/en/hochschule/objekt-uranus.md docs/belege/hochschule/objekt-uranus.md src/data/literatur.ts
git commit -m "Hochschultext Uranus mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 2: Thema `achsneigung`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-achsneigung.md`, `src/data/texte/en/hochschule/thema-achsneigung.md`, `docs/belege/hochschule/thema-achsneigung.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Uranus' Polkonvention, 97,77°/82,23°, Rotationsperiode, Jahreszeitentermine); fachgeprüfte Texte `objekt-earth` (Schiefe der Ekliptik, Stabilisierung durch den Mond), `objekt-mars` (chaotische Schiefe), `objekt-venus` (177°), `objekt-mercury` (Cassini-Zustand, 2,03′), `objekt-saturn` (Ward und Hamilton 2004; Wisdom et al. 2022), `objekt-sun` (7,25°), `thema-bezugssysteme` (IAU-Polkonvention), `thema-gebundene-rotation` (Cassini-Zustände der Monde), `thema-bahnelemente` (Präzession der Bahnebenen).
- Produziert: Hochschultext `thema:achsneigung`; Task 3 bis 7 übernehmen die Aussagen zur Kippung des Mondsystems (prograde Äquatorbahnen als Randbedingung), Task 8 die Jahreszeitengeometrie.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Achsneigung` / `# Axial tilt` (Titel aus `ui/i18n`, wie die Gymnasialfassungen). Frei gegliedert, Schluss `## Offene Fragen`, `## Im Modell`. Richtwert 1500 bis 4000 Wörter je Fassung. Der Gymnasialtext behandelt Erde, Venus, Uranus, Merkur, Mars, Präzession und die feste Achse im Modell — der Hochschultext deckt dieselben Körper tiefer und ergänzt die Mechanismen.
- Inhalt mindestens: **Definition** — Schiefe $\varepsilon$ als Winkel zwischen Spinachse und Bahnnormale; IAU-Nordpol (nördlich der invariablen Ebene) gegen den Drehimpulspol nach der Rechte-Hand-Regel, Werte über 90° als rückläufige Rotation, Konvention für Zwergplaneten und Kleinkörper (Zahlen und Belege wie `thema-bezugssysteme`); Schiefe gegen die Ekliptik gegen Schiefe gegen die eigene Bahn (bei Uranus 97,77° gegen die Bahn, gegen die Ekliptik anders — selbst rechnen). **Tabelle** der Schiefen aller Planeten, Plutos und der Sonne mit Messwert (NSSDC oder IAU-Bericht) und Modellwert aus `achsneigungDeg` (alle mit einem Skript im Scratchpad aus den Datensätzen nachgerechnet, die drei Spalten Messwert / Modell / Quelle). **Jahreszeiten und Insolation** — Tagesbogen, Polartag, Insolationsformel als Funktion von Schiefe und Breite (eine Formel, Dimensionsprobe), extreme Fälle Uranus (Verweis `objekt:uranus`, Termine wie Task 1) und Pluto. **Präzession der Spinachse** — Drehmoment von Sonne und Mond auf den Äquatorwulst, Präzessionsrate proportional zu $J_2 \cos\varepsilon / (C/MR^2)$ mal dem Bahnfaktor (Formel mit Beleg, etwa Murray und Dermott Kap. 4 oder ein Lehrbuch — Fundstelle prüfen), Erde 50,29″ je Jahr und Zyklus rund 25 700 Jahre (Zahlen wie `objekt-earth` beziehungsweise IERS-Konventionen `petit-2010`), Mars rund 7,6″ je Jahr (Fundstelle prüfen). **Langfristige Entwicklung** — Milanković-Zyklen der Erde (Schiefe 22,1° bis 24,5° in rund 41 000 Jahren; Laskar et al. 2004a), Stabilisierung durch den Mond und die Gegenposition (Laskar et al. 1993, `laskar-1993`; Lissauer et al. 2012), Mars chaotisch (Laskar und Robutel 1993; Touma und Wisdom 1993; Laskar et al. 2004a — Zahlen wie `objekt-mars`), Venus' Weg in die Rückläufigkeit (Correia und Laskar 2001: vier Endzustände, thermische Gezeiten der Atmosphäre), Merkur im Cassini-Zustand 1 (Zahlen wie `objekt-mercury`, Verweis `thema:innerer-aufbau`), Cassini-Zustände allgemein (Verweis `thema:gebundene-rotation`). **Kippmechanismen der Riesenplaneten** — Saturn: Spin-Bahn-Resonanz mit Neptuns Knotenpräzession (Ward und Hamilton 2004, `ward-2004`) gegen den Verlust eines Mondes (Wisdom et al. 2022, `wisdom-2022`), Zahlen wie `objekt-saturn`; Jupiter (Ward und Canup 2006, Fundstelle prüfen); **Uranus** als Kern: Riesenkollision (Safronov-Tradition, Slattery et al. 1992; Kegerreis et al. 2018 mit SPH-Simulationen; Kegerreis et al. 2019) und das Problem der prograden Äquatorbahnen der Monde (Morbidelli et al. 2012: Kollision während der Scheibenphase oder zwei Stöße), Spin-Bahn-Resonanz mit Wanderung (Rogoszinski und Hamilton 2020, 2021), Wanderung eines früheren Mondes (Saillenfest et al. 2022), Neptuns 28,3° als Vergleich (Verweis `objekt:neptune`), Pluto 119,6° (Zahlen wie `pluto-system.ts`, selbst nachrechnen; Dobrovolskis und Harris 1983 oder ein neuerer Beleg). Nicht: Exoplaneten, Erdklima im Detail (nur Verweis `objekt:earth`).
- `## Offene Fragen` (Pflicht): Ursache von Uranus' Kippung (Kollision gegen Resonanz gegen Mond, je mit Beleg); Ursache von Saturns Schiefe (Zahlen wie `objekt-saturn`); ob der Mond die Erdschiefe wirklich stabilisiert (Laskar 1993 gegen Lissauer 2012); Venus' Weg (Kippung oder Umkehr des Drehsinns).
- `## Im Modell`: Alle Pole stehen fest im Raum (keine Präzession, keine Nutation; Größe der Vernachlässigung bei der Erde: Präzession seit J2000 in Bogenminuten selbst rechnen), der Pol ist der IAU-Pol zur Epoche J2000 aus `physical.pole` (Herkunft je Datensatz: IAU-Bericht, SPICE-Kernel `pck00011.tpc`); der Datenblock rechnet die Achsneigung mit `achsneigungDeg` gegen die eigene Bahnnormale zur Epoche, mit 180°-Klappung bei negativer Rotationsperiode (Uranus, Venus, die Uranusmonde, Triton), für die Sonne gegen die Ekliptik; die Monde mit `frame: 'parentEquator'` messen gegen die aus Position und Geschwindigkeit gebildete Bahnnormale, nicht gegen die Laplace-Ebene (Befund aus Abnahme 4d-7 §7); Miranda und Triton mit festem Pol trotz Reihenentwicklung im IAU-Bericht (Zahlen wie `thema-gebundene-rotation`); Eris und Makemake mit Pol senkrecht auf der Bahn (Gymnasialtext `thema-modell`, am Datensatz `zwergplaneten.ts` prüfen); Jahreszeiten entstehen im Bild von selbst aus Pol und Sonnenrichtung (Belichtung `src/render/lighting.ts`, kein eigener Jahreszeiten-Code); Verweis `thema:modell`.
- Code lesen: `src/sim/orbit.ts` (`achsneigungDeg`, `axialTiltDeg`, `rotationAt`), `src/sim/frames.ts` (`poleVector`), `src/data/bodies/*.ts` (alle `pole`- und `rotationPeriodH`-Einträge, Kommentare in `uranus.ts` und `pluto-system.ts` zur Polkonvention — als Hinweis, nicht als Beleg), `src/ui/info/datenzeilen.ts`, `src/render/lighting.ts` (Sonnenrichtung), `src/data/texte/de/gymnasium/thema-modell.md` („Keine Präzession", „Nicht gemessene Achsen"), Hochschultexte `objekt-earth`, `objekt-mars`, `objekt-venus`, `objekt-mercury`, `objekt-saturn`, `objekt-sun`, `objekt-uranus` (Task 1), `thema-bezugssysteme`, `thema-gebundene-rotation`, `thema-bahnelemente`.
- Verweise: `objekt:uranus`, `objekt:earth`, `objekt:mars`, `objekt:venus`, `objekt:mercury`, `objekt:saturn`, `objekt:neptune`, `objekt:pluto`, `objekt:sun`, `objekt:moon`, `thema:bezugssysteme`, `thema:gebundene-rotation`, `thema:innerer-aufbau`, `thema:bahnelemente`, `thema:entstehung`, `thema:modell`, `szene:uranus-gekippt`; Karten zu `thema:achsneigung`: `quelle:nssdc-factsheets`, `quelle:iau-rotation`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Laskar et al. 1993 (`laskar-1993`); Laskar et al. 2004a (`laskar-2004a`, Mars) und Laskar et al. 2004, Insolationsgrößen der Erde (`laskar-2004`, bereits im Katalog: *Astronomy & Astrophysics* 428, 261); Lissauer et al. 2012, Schiefe der Erde ohne Mond (*Icarus* 217, 77); Laskar und Robutel 1993 (*Nature* 361, 608); Touma und Wisdom 1993 (*Science* 259, 1294); Correia und Laskar 2001, Venus (`correia-2001`, bereits im Katalog: *Nature* 411, 767); Ward und Hamilton 2004 (`ward-2004`); Hamilton und Ward 2004, Teil II (*Astronomical Journal* 128, 2510); Wisdom et al. 2022 (`wisdom-2022`); Ward und Canup 2006, Jupiter (*Astrophysical Journal* 640, L91); Slattery et al. 1992, Riesenkollision (*Icarus* 99, 167); Kegerreis et al. 2018 (*Astrophysical Journal* 861, 52) und 2019 (*Monthly Notices of the Royal Astronomical Society* 487, 5029); Morbidelli et al. 2012 (*Icarus* 219, 737); Rogoszinski und Hamilton 2020 (*Astrophysical Journal* 888, 60) und 2021 (*Planetary Science Journal* 2, 78); Saillenfest et al. 2022 (*Astronomy & Astrophysics* 668, A108); Dobrovolskis und Harris 1983, Pluto (*Icarus* 55, 231); Archinal et al. 2011, 2018, 2019 (im Katalog); Petit und Luzum 2010 (`petit-2010`); Murray und Dermott (`murray-2000`).
- Neue Testfälle: 2 Dateien × 10 = 20.

- [ ] **Schritt 1:** Vorlage und Code lesen; Modellschiefen aller Planeten, Plutos, der Sonne und der Uranusmonde mit einem Skript im Scratchpad aus den Datensätzen rechnen (Tabelle Messwert/Modell), Erdpräzession seit J2000 nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-achsneigung.md src/data/texte/en/hochschule/thema-achsneigung.md docs/belege/hochschule/thema-achsneigung.md src/data/literatur.ts
git commit -m "Hochschultext Achsneigung mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 3: Körper `miranda`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-miranda.md`, `src/data/texte/en/hochschule/objekt-miranda.md`, `docs/belege/hochschule/objekt-miranda.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Systemzahlen, GM, Pol), Task 2 (prograde Äquatorbahnen als Randbedingung der Kippung); fachgeprüfte Texte `thema-gebundene-rotation` (Miranda ±4,3°, Polreihe Archinal 2011), `thema-bahnelemente` (Knoten fest, 175,6°), `thema-resonanzen` (Aufbau eines Resonanzabschnitts), `thema-gezeiten` (Gezeitenheizung), `objekt-mimas` (Aufbau eines Textes über einen kleinen Mond).
- Produziert: Hochschultext `objekt:miranda`; Task 4 bis 7 übernehmen die Resonanzgeschichte des Systems (Tittemore und Wisdom; Ćuk et al. 2020) und die Datenlage (Voyager-Südhalbkugel).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Miranda` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 800 bis 1800 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** — Ellipsoid 240 × 234,2 × 232,9 km (Thomas 1988; Katalog geometrisches Mittel 235,68 km, selbst nachrechnen), Masse und GM (Jacobson 2014; Katalog 6,6·10¹⁹ kg), Dichte rund 1,2 g cm⁻³ (selbst aus Katalogwerten rechnen), geometrische Albedo 0,32 (Fact Sheet) gegen Karkoschka 2001, Voyager-Abdeckung nur der Südhalbkugel; Tabelle mit Wert, Unsicherheit, Verfahren, Beleg. **Inneres:** Mischung aus Eis und Gestein nahe der Hälfte, Frage der Differenzierung, Wärmequelle für die Oberflächenerneuerung (Gezeitenheizung in früherer Resonanz — Tittemore und Wisdom 1990; Peterson et al. 2015), Konvektion als Ursache der Coronae (Hammond und Barr 2014), möglicher früherer oder heutiger Ozean (Castillo-Rogez et al. 2023; Bierson und Nimmo 2022 als skeptische Gegenposition). **Oberfläche:** die drei Coronae Arden, Elsinore, Inverness mit ihrer Tektonik (Beddingfield et al. 2015; Beddingfield und Cartwright 2020), Verona Rupes (Steilstufe von mehreren Kilometern — Höhe an der Quelle), Kraterzählungen und Alter (Kirchoff et al. 2022), Zusammensetzung (Wassereis; Cartwright et al. 2020 zu Ammoniak; nur belegte Befunde). **Atmosphäre und Magnetosphäre:** keine Atmosphäre, Lage tief in Uranus' Magnetosphäre, Strahlungsverwitterung. **Bahn, Rotation und Dynamik:** Bahnneigung 4,34° gegen Uranus' Äquator als einzige nennenswerte Neigung der fünf, erklärt durch eine frühere 3:1-Resonanz mit Umbriel (Tittemore und Wisdom 1989; Dermott et al. 1988 zu chaotischem Verhalten), heutige Nichtresonanz, gebundene Rotation, Libration (Zahlen wie `thema-gebundene-rotation`). **Entstehung und Entwicklung:** Kollisionsscheibe oder Ko-Akkretion (Verweis `objekt:uranus`, Zahlen von dort), Resonanzdurchgänge als Motor der Entwicklung (Ćuk et al. 2020), Diskussion um ein jüngeres Mondsystem.
- `## Offene Fragen` (Pflicht): Ursache und Alter der Coronae (Konvektion, Diapire, Wiederzusammensetzung nach Zerstörung — mit Belegen); ob Miranda heute einen Ozean hat; Nordhalbkugel unbekannt.
- `## Im Modell`: Bahnelemente aus `uranus-monde.ts` (oskulierende Horizons-Elemente J2000, `frame: 'parentEquator'`, $i = 175{,}57^\circ$ gegen den IAU-Pol = 4,43° Neigung im üblichen Sinn, selbst nachrechnen und den Unterschied zum Fact-Sheet-Wert 4,34° nennen), `nodeDot` 0 als empirische Wahl (Restfehler des Datensatzes gegen Horizons rund 15 400 km oder 1,9 % des Bahnumfangs — am Fixture `monde-horizons.json` selbst nachrechnen, nicht aus dem Kommentar), `lpDot` 2003,3460 (Einheit und Periode selbst rechnen, aus $P_\mathrm{apsis}$ 8,939 a und $P_\mathrm{Knoten}$ 17,787 a der JPL-Tabelle); Umlaufzeit aus `LDot` (1,4135 d) gegen den Datenblock (Kepler-Umlaufzeit); `rotationPeriodH` −33,92350 h gleich der Umlaufzeit, negatives Vorzeichen (Zahlen wie `thema-gebundene-rotation`); Pol 257,43° / −15,08° fest, obwohl der IAU-Bericht periodische Glieder von 4,41° und 4,25° gibt (Zahlen wie `thema-gebundene-rotation`); Datenblock-Achsneigung aus `achsneigungDeg` (selbst rechnen); Albedo 0,32; keine Textur, Ausweichfarbe (`ASSETS.md`, Lücken-Abschnitt: Voyager sah nur die Südhalbkugel); Miranda ist Okkluder Uranus' (Zahlen wie `thema-finsternis`); Maßstab (`isSatellite`); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/uranus-monde.ts` (Kopfkommentar vollständig, Eintrag `miranda`), `src/data/bodies/uranus.ts`, `src/sim/__fixtures__/monde-horizons.json` (fünf Horizons-Stichtage), `src/sim/monde.fixture.test.ts` (`POSITIONS_SCHRANKE_ANTEIL`), `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`, `icrfKnotenVersatzDeg`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Uranusmonde), `src/data/index.test.ts` (Miranda-Sondertest), Hochschultexte `objekt-uranus` (Task 1), `thema-achsneigung` (Task 2), `thema-gebundene-rotation`, `thema-bahnelemente`, `thema-resonanzen`, `thema-gezeiten`, `thema-finsternis`.
- Verweise: `objekt:uranus`, `objekt:ariel`, `objekt:umbriel`, `thema:gebundene-rotation`, `thema:resonanzen`, `thema:gezeiten`, `thema:bahnelemente`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:modell`, `szene:uranus-gekippt`; Karten zu `objekt:miranda`: `quelle:nssdc-uranusmonde`, `quelle:nasa-uranusmonde`, `quelle:nasa-voyager-2`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Smith et al. 1986 (siehe Task 1); Thomas 1988, Radien (*Icarus* 73, 427); Jacobson 2014 (siehe Task 1); Karkoschka 2001, Photometrie (*Icarus* 151, 51); Tittemore und Wisdom 1989 (*Icarus* 78, 63) und 1990 (*Icarus* 85, 394); Dermott et al. 1988 (*Icarus* 76, 295); Ćuk et al. 2020, Dynamische Geschichte (*Planetary Science Journal* 1, 22); Hammond und Barr 2014, Konvektion (*Geology* 42, 931); Peterson et al. 2015, Gezeitenheizung (*Icarus* 250, 116); Beddingfield et al. 2015 (*Icarus* 247, 35); Beddingfield und Cartwright 2020, Elsinore (*Icarus* 343, 113687); Kirchoff et al. 2022, Kraterzählungen (*Planetary Science Journal* 3, 42); Cartwright et al. 2020, Ammoniak (*Astrophysical Journal Letters* 898, L35); Cartwright et al. 2021, Science Case (*Planetary Science Journal* 2, 120); Castillo-Rogez et al. 2023, Innere Strukturen (*Journal of Geophysical Research: Planets* 128, e2022JE007432); Bierson und Nimmo 2022 (*Icarus* 373, 114776); Schenk und Moore 2020, Topografie (*Philosophical Transactions of the Royal Society A* 378, 20200102); Archinal et al. 2011 (`archinal-2011`), Polreihe.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Umlaufzeit, Apsidenperiode, Neigung 4,43°, Fixture-Restfehler und Datenblock-Achsneigung im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-miranda.md src/data/texte/en/hochschule/objekt-miranda.md docs/belege/hochschule/objekt-miranda.md src/data/literatur.ts
git commit -m "Hochschultext Miranda mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 4: Körper `ariel`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-ariel.md`, `src/data/texte/en/hochschule/objekt-ariel.md`, `docs/belege/hochschule/objekt-ariel.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Systemzahlen), Task 3 (Resonanzgeschichte, Datenlage); fachgeprüfte Texte `thema-gezeiten`, `thema-innerer-aufbau`, `thema-gebundene-rotation`, `thema-bahnelemente` (Ariel-Knoten 40° quadratisches Mittel), `objekt-enceladus` (Aufbau eines Textes über einen geologisch jungen Eismond).
- Produziert: Hochschultext `objekt:ariel`; Task 5 übernimmt den Vergleich der CO₂-Verteilung (Ariel hell und jung gegen Umbriel dunkel und alt).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Ariel` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 800 bis 1800 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** — Ellipsoid 581,1 × 577,9 × 577,7 km (Thomas 1988; Katalog 578,90 km), Masse (Jacobson 2014; Katalog 1,29·10²¹ kg), Dichte rund 1,6 g cm⁻³ (selbst rechnen), Albedo 0,39 als hellster der fünf (Fact Sheet; Karkoschka 2001), Tabelle. **Inneres:** Gesteinsanteil aus der Dichte, Frage nach Differenzierung und Ozean (Castillo-Rogez et al. 2023; Bierson und Nimmo 2022; Weiss et al. 2021 zur magnetischen Induktion als Nachweisweg), elastische Dicke und Wärmefluss aus Grabenflanken (Beddingfield et al. 2022). **Oberfläche:** jüngste Oberfläche der fünf mit Chasmata (Grabenbrüche) und glatten Talböden, Hinweise auf Kryovulkanismus oder viskose Extrusion, Kraterzählungen (Kirchoff et al. 2022), CO₂-Eis konzentriert auf der bahnabgewandten Halbkugel (Grundy et al. 2006; Cartwright et al. 2015), JWST-Befunde zu CO, CO₂ und möglichen Karbonaten (Cartwright et al. 2023 — Fundstelle prüfen), Ammoniak (Cartwright et al. 2020). **Atmosphäre und Magnetosphäre:** keine Atmosphäre, Wechselwirkung mit Uranus' Magnetosphäre als mögliche Quelle der CO₂-Asymmetrie (Strahlungschemie gegen Ausgasung — beide Positionen). **Bahn, Rotation und Dynamik:** Bahn praktisch exakt in Uranus' Äquatorebene, gebundene Rotation, frühere Resonanzen (5:3 mit Umbriel, 2:1 mit Umbriel — Tittemore und Wisdom 1990; Ćuk et al. 2020, Zahlen wie Task 3), Gezeitenheizung als Motor der Erneuerung (Verweis `thema:gezeiten`). **Entstehung und Entwicklung:** wie Task 3, Verweis `objekt:uranus`.
- `## Offene Fragen` (Pflicht): Ozean oder gefrorener Körper; Quelle des CO₂ (Strahlungschemie aus Wassereis und Kohlenstoff gegen Ausgasung aus dem Inneren); Alter der Erneuerung; Nordhalbkugel unbekannt.
- `## Im Modell`: Bahnelemente aus `uranus-monde.ts` ($i = 179{,}997^\circ$, 0,003° von 180°), `nodeDot` 0 (JPL-Tabelle führt die Knotenperiode selbst als undefiniert; Horizons-Knoten unregelmäßig — Zahlen wie `thema-bahnelemente`), `lpDot` 1245,6316 (aus $P_\mathrm{apsis}$ 28,901 a, selbst rechnen), Umlaufzeit aus `LDot` (2,5204 d) gegen Datenblock, `rotationPeriodH` −60,48910 h, Pol 257,43° / −15,10° (gemeinsam mit Umbriel, Titania, Oberon im Datensatz — als Vereinfachung nennen), Datenblock-Achsneigung, Albedo 0,39, keine Textur (`ASSETS.md`), Okkluder (Zahlen wie `thema-finsternis`), Maßstab, Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/uranus-monde.ts` (Eintrag `ariel`), `src/data/bodies/uranus.ts`, `src/sim/monde.fixture.test.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md`, Hochschultexte `objekt-uranus`, `objekt-miranda`, `thema-gezeiten`, `thema-innerer-aufbau`, `thema-gebundene-rotation`, `thema-bahnelemente`, `thema-finsternis`.
- Verweise: `objekt:uranus`, `objekt:miranda`, `objekt:umbriel`, `thema:gezeiten`, `thema:innerer-aufbau`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:bahnelemente`, `thema:photometrie`, `thema:entstehung`, `thema:modell`; Karten zu `objekt:ariel`: `quelle:nssdc-uranusmonde`, `quelle:nasa-uranusmonde`, `quelle:nasa-voyager-2`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Smith et al. 1986; Thomas 1988; Jacobson 2014; Karkoschka 2001; Grundy et al. 2006, H₂O- und CO₂-Eis (*Icarus* 184, 543); Cartwright et al. 2015, CO₂ (*Icarus* 257, 428); Cartwright et al. 2018, rotes Material (*Icarus* 314, 210); Cartwright et al. 2020 (siehe Task 3); Cartwright et al. 2023, JWST (*Astrophysical Journal Letters* 953, L38 — prüfen); Beddingfield et al. 2022, elastische Dicke (*Planetary Science Journal* 3, 106); Kirchoff et al. 2022; Castillo-Rogez et al. 2023; Bierson und Nimmo 2022; Weiss et al. 2021, magnetische Induktion (*Planetary Science Journal* 2, 71 — prüfen); Tittemore und Wisdom 1990; Ćuk et al. 2020; Schenk und Moore 2020; Peterson et al. 2015.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Umlaufzeit, Apsidenperiode und Datenblock-Achsneigung im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-ariel.md src/data/texte/en/hochschule/objekt-ariel.md docs/belege/hochschule/objekt-ariel.md src/data/literatur.ts
git commit -m "Hochschultext Ariel mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 5: Körper `umbriel`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-umbriel.md`, `src/data/texte/en/hochschule/objekt-umbriel.md`, `docs/belege/hochschule/objekt-umbriel.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Systemzahlen), Task 3 (Resonanzgeschichte: 3:1 mit Miranda), Task 4 (CO₂-Vergleich, Ariel als Gegenstück); fachgeprüfte Texte `thema-photometrie` (Albedo, Oppositionseffekt), `thema-bahnelemente` (Umbriel-Knotenrate 3,7° je Jahr gegen 2,8°), `thema-gebundene-rotation`, `objekt-callisto` oder `objekt-iapetus` (Aufbau eines Textes über einen dunklen, alten Mond).
- Produziert: Hochschultext `objekt:umbriel`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Umbriel` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 800 bis 1800 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** — Radius 584,7 km (Thomas 1988; Katalog), Masse (Jacobson 2014; Katalog 1,22·10²¹ kg), Dichte rund 1,4 bis 1,5 g cm⁻³ (selbst rechnen), Albedo 0,21 als dunkelster der fünf (Fact Sheet; Karkoschka 2001), Tabelle. **Inneres:** Gesteinsanteil aus der Dichte, kaum Hinweise auf innere Aktivität, Modellrechnungen zu Differenzierung und möglichem Ozean (Castillo-Rogez et al. 2023; Bierson und Nimmo 2022). **Oberfläche:** alte, dicht bekraterte und dunkle Oberfläche ohne erkennbare Erneuerung; Wunda mit hellem Ring am Kraterboden als CO₂-Eis-Vorkommen (Sori et al. 2017), CO₂ auf der bahnabgewandten Halbkugel (Grundy et al. 2006; Cartwright et al. 2015), Kraterzählungen (Kirchoff et al. 2022), Ursache der Dunkelheit (Strahlungsverwitterung, kohlenstoffhaltiges Material — belegte Positionen). **Atmosphäre und Magnetosphäre:** keine; Lage in der Magnetosphäre, Ladungsteilchenbeschuss als Faktor der Dunkelheit (belegen, sonst weglassen). **Bahn, Rotation und Dynamik:** Bahn 0,06° von der Äquatorebene (Fact Sheet — Wert prüfen), gebundene Rotation, frühere 3:1-Resonanz mit Miranda (Zahlen wie Task 3), heutige Nichtresonanz, Verweis `thema:resonanzen`. **Entstehung und Entwicklung:** wie Task 3, Verweis `objekt:uranus`; Kontrast zu Ariel als offenes Problem (gleiche Größe, andere Geschichte).
- `## Offene Fragen` (Pflicht): warum Umbriel dunkel und unerneuert ist, Ariel aber hell und jung; Ursprung des CO₂ in Wunda; Ozeanfrage; Nordhalbkugel unbekannt.
- `## Im Modell`: Bahnelemente aus `uranus-monde.ts` ($i = 179{,}944^\circ$), `nodeDot` 0 gegen die Horizons-Knotenrate 3,7° je Jahr und die Tabellenrate 2,8° je Jahr (Zahlen wie `thema-bahnelemente`; Positionsfolge in km und Prozent des Bahnumfangs am Fixture selbst rechnen), `lpDot` 283,9274 (aus $P_\mathrm{apsis}$ 64,126 a und $P_\mathrm{Knoten}$ 129,745 a, selbst rechnen), Umlaufzeit aus `LDot` (4,1442 d) gegen Datenblock, `rotationPeriodH` −99,46025 h, gemeinsamer Pol 257,43° / −15,10°, Datenblock-Achsneigung, Albedo 0,21, keine Textur, Okkluder (Zahlen wie `thema-finsternis`), Maßstab, Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/uranus-monde.ts` (Eintrag `umbriel`), `src/data/bodies/uranus.ts`, `src/sim/monde.fixture.test.ts`, `src/sim/__fixtures__/monde-horizons.json`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md`, Hochschultexte `objekt-uranus`, `objekt-miranda`, `objekt-ariel`, `thema-photometrie`, `thema-bahnelemente`, `thema-gebundene-rotation`, `thema-finsternis`.
- Verweise: `objekt:uranus`, `objekt:miranda`, `objekt:ariel`, `objekt:titania`, `thema:resonanzen`, `thema:photometrie`, `thema:gebundene-rotation`, `thema:bahnelemente`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:modell`; Karten zu `objekt:umbriel`: `quelle:nssdc-uranusmonde`, `quelle:nasa-uranusmonde`, `quelle:nasa-voyager-2`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Smith et al. 1986; Thomas 1988; Jacobson 2014; Karkoschka 2001; Sori et al. 2017, Wunda (*Icarus* 290, 1); Grundy et al. 2006; Cartwright et al. 2015, 2018, 2020; Kirchoff et al. 2022; Castillo-Rogez et al. 2023; Bierson und Nimmo 2022; Tittemore und Wisdom 1989, 1990; Ćuk et al. 2020; Schenk und Moore 2020; Buratti und Mosher 1991, Hemisphären-Photometrie (*Icarus* 90, 1); Plescia 1987, Geologie (*Journal of Geophysical Research* 92, 14918 — Fundstelle prüfen).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Umlaufzeit, Apsidenperiode, Knotenfolge am Fixture und Datenblock-Achsneigung im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-umbriel.md src/data/texte/en/hochschule/objekt-umbriel.md docs/belege/hochschule/objekt-umbriel.md src/data/literatur.ts
git commit -m "Hochschultext Umbriel mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 6: Körper `titania`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-titania.md`, `src/data/texte/en/hochschule/objekt-titania.md`, `docs/belege/hochschule/objekt-titania.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Systemzahlen), Task 3 (Resonanzgeschichte, Datenlage), Task 4 (Grabenbrüche als Vergleich); fachgeprüfte Texte `thema-innerer-aufbau`, `thema-gezeiten`, `thema-bahnelemente` (Titania-Knoten kehrt nach 25 Jahren um), `thema-gebundene-rotation`, `objekt-rhea` (Aufbau eines Textes über einen großen, mäßig aktiven Eismond).
- Produziert: Hochschultext `objekt:titania`; Task 7 übernimmt den Vergleich mit Oberon (Größe, Dichte, Sternbedeckungsradius).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Titania` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 800 bis 1800 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** — Radius 788,9 km (Thomas 1988; Katalog) gegen den Sternbedeckungsradius 788,4 km (Widemann et al. 2009 — Wert und Unsicherheit prüfen), Masse (Jacobson 2014; Katalog 3,42·10²¹ kg), Dichte rund 1,7 g cm⁻³ (selbst rechnen), Albedo 0,27 (Fact Sheet; Karkoschka 2001), größter Uranusmond, Tabelle. **Inneres:** Gesteinsanteil, Differenzierung, Ozeanmodelle (Castillo-Rogez et al. 2023 — Titania und Oberon als aussichtsreichste Kandidaten wegen Größe; Bierson und Nimmo 2022 skeptisch; Weiss et al. 2021 zur Nachweisbarkeit). **Oberfläche:** Kraterlandschaft mit großen Grabensystemen (Messina Chasmata) und Steilstufen, Zeichen früher globaler Ausdehnung durch Gefrieren eines Ozeans, Kraterzählungen (Kirchoff et al. 2022), CO₂-Eis auf der bahnabgewandten Seite (Grundy et al. 2006), keine Atmosphäre nachgewiesen (Sternbedeckung 2001 — obere Grenze, Widemann et al. 2009). **Atmosphäre und Magnetosphäre:** Obergrenze des Oberflächendrucks aus der Sternbedeckung; Titania läuft nahe dem Rand von Uranus' Magnetosphäre (Bahnradius gegen Magnetopausenabstand — belegen). **Bahn, Rotation und Dynamik:** Bahn 0,1° von der Äquatorebene, gebundene Rotation, keine heutige Resonanz, frühere Resonanzen (Ćuk et al. 2020), Verweis `thema:resonanzen`. **Entstehung und Entwicklung:** wie Task 3, Verweis `objekt:uranus`.
- `## Offene Fragen` (Pflicht): Ozean heute oder gefroren; Alter der Grabenbrüche; Nordhalbkugel unbekannt; Nachweisbarkeit eines Ozeans durch eine Orbitermission.
- `## Im Modell`: Bahnelemente aus `uranus-monde.ts` ($i = 179{,}899^\circ$), `nodeDot` 0 (Horizons-Knoten kehrt nach 25 Jahren um — Zahlen wie `thema-bahnelemente`), `lpDot` 40,1875 (aus $P_\mathrm{apsis}$ 579,928 a und $P_\mathrm{Knoten}$ 1644,649 a, selbst rechnen), Umlaufzeit aus `LDot` (8,7059 d) gegen Datenblock, `rotationPeriodH` −208,94086 h, gemeinsamer Pol, Datenblock-Achsneigung, Albedo 0,27, keine Textur, Okkluder (Zahlen wie `thema-finsternis`), Maßstab, Datenblockwerte gegen Messwerte (Radius 788,9 gegen 788,4 km erklären).
- Code lesen: `src/data/bodies/uranus-monde.ts` (Eintrag `titania`), `src/data/bodies/uranus.ts`, `src/sim/monde.fixture.test.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md`, Hochschultexte `objekt-uranus`, `objekt-miranda`, `objekt-ariel`, `thema-innerer-aufbau`, `thema-gezeiten`, `thema-bahnelemente`, `thema-gebundene-rotation`, `thema-finsternis`.
- Verweise: `objekt:uranus`, `objekt:oberon`, `objekt:ariel`, `objekt:umbriel`, `thema:innerer-aufbau`, `thema:gezeiten`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:bahnelemente`, `thema:entstehung`, `thema:modell`; Karten zu `objekt:titania`: `quelle:nssdc-uranusmonde`, `quelle:nasa-uranusmonde`, `quelle:nasa-voyager-2`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Smith et al. 1986; Thomas 1988; Jacobson 2014; Karkoschka 2001; Widemann et al. 2009, Sternbedeckung 2001 (*Icarus* 199, 458); Grundy et al. 2006; Cartwright et al. 2015, 2018, 2020; Kirchoff et al. 2022; Castillo-Rogez et al. 2023; Bierson und Nimmo 2022; Weiss et al. 2021; Ćuk et al. 2020; Schenk und Moore 2020; Plescia 1987; Croft und Soderblom 1991, Geologie der Uranusmonde (in *Uranus*, University of Arizona Press — Fundstelle prüfen, als Buchkapitel zitieren).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Umlaufzeit, Apsidenperiode und Datenblock-Achsneigung im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-titania.md src/data/texte/en/hochschule/objekt-titania.md docs/belege/hochschule/objekt-titania.md src/data/literatur.ts
git commit -m "Hochschultext Titania mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 7: Körper `oberon`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-oberon.md`, `src/data/texte/en/hochschule/objekt-oberon.md`, `docs/belege/hochschule/objekt-oberon.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Systemzahlen; Oberon fällt als Okkluder weg), Task 3 (Resonanzgeschichte, Datenlage), Task 6 (Vergleich Titania); fachgeprüfte Texte `thema-finsternis` (Oberon nie Okkluder), `thema-photometrie`, `thema-bahnelemente` (Oberon-Knotenrate 0,7° gegen 1,9° je Jahr), `thema-gebundene-rotation`, `objekt-iapetus` (Aufbau eines Textes über einen äußeren, dunklen Mond).
- Produziert: Hochschultext `objekt:oberon`; Task 8 übernimmt Oberons Bahnradius für die Bildfeldfrage.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Oberon` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 800 bis 1800 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** — Radius 761,4 km (Thomas 1988; Katalog), Masse (Jacobson 2014; Katalog 2,88·10²¹ kg), Dichte rund 1,6 g cm⁻³ (selbst rechnen), Albedo 0,23 (Fact Sheet; Karkoschka 2001), äußerster der fünf, rötlichste Oberfläche (Buratti und Mosher 1991; Cartwright et al. 2018 zum roten Material), Tabelle. **Inneres:** Gesteinsanteil, Ozeanmodelle (Castillo-Rogez et al. 2023; Bierson und Nimmo 2022). **Oberfläche:** alte, dicht bekraterte Oberfläche, Krater mit dunklen Böden (Hamlet), ein rund 6 km hoher Berg am Rand der Voyager-Scheibe (Höhe an der Quelle prüfen — der Gymnasialtext nennt „6 km" am unteren Rand, siehe Abnahme 4c-2), Chasmata (Mommur Chasma), Kraterzählungen (Kirchoff et al. 2022), CO₂ (Grundy et al. 2006), rotes Material aus dem Staub der äußeren irregulären Monde als Hypothese (Cartwright et al. 2018 — als Hypothese mit Beleg). **Atmosphäre und Magnetosphäre:** keine; Oberon läuft zeitweise außerhalb der Magnetosphäre (Bahnradius 583 550 km gegen den Magnetopausenabstand — belegen, sonst als Größenordnung mit Beleg aus Ness et al. 1986). **Bahn, Rotation und Dynamik:** Bahn 0,2° von der Äquatorebene (Fact Sheet), gebundene Rotation (längste Periode der fünf, 13,46 d), Knotenrate in Horizons gegen JPL-Tabelle (Zahlen wie `thema-bahnelemente`), keine Resonanz, Verweis `thema:resonanzen`. **Entstehung und Entwicklung:** wie Task 3, Verweis `objekt:uranus`.
- `## Offene Fragen` (Pflicht): Ozean; Herkunft des roten Materials und der dunklen Kraterböden; Nordhalbkugel unbekannt.
- `## Im Modell`: Bahnelemente aus `uranus-monde.ts` ($i = 179{,}812^\circ$), `nodeDot` 0 (Zahlen wie `thema-bahnelemente`), `lpDot` 40,2565 (aus $P_\mathrm{apsis}$ 158,604 a und $P_\mathrm{Knoten}$ 192,798 a, selbst rechnen), Umlaufzeit aus `LDot` (13,4632 d) gegen Datenblock, `rotationPeriodH` −323,11769 h, gemeinsamer Pol, Datenblock-Achsneigung, Albedo 0,23, keine Textur, **Oberon ist nie Okkluder Uranus'** (`MAX_OKKLUDER` 4, Zahlen wie `thema-finsternis`; selbst am Code nachvollziehen, warum gerade Oberon wegfällt — Sortierung nach Winkelradius in `waehleOkkluder`), Maßstab, Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/uranus-monde.ts` (Eintrag `oberon`), `src/data/bodies/uranus.ts`, `src/sim/monde.fixture.test.ts`, `src/sim/orbit.ts`, `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts` (`waehleOkkluder` vollständig), `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md`, Hochschultexte `objekt-uranus`, `objekt-miranda`, `objekt-titania`, `thema-finsternis`, `thema-photometrie`, `thema-bahnelemente`, `thema-gebundene-rotation`.
- Verweise: `objekt:uranus`, `objekt:titania`, `objekt:umbriel`, `thema:finsternis`, `thema:photometrie`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:bahnelemente`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:modell`, `szene:uranus-gekippt`; Karten zu `objekt:oberon`: `quelle:nssdc-uranusmonde`, `quelle:nasa-uranusmonde`, `quelle:nasa-voyager-2`, `quelle:jpl-satelliten`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Smith et al. 1986; Thomas 1988; Jacobson 2014; Karkoschka 2001; Buratti und Mosher 1991; Cartwright et al. 2018; Grundy et al. 2006; Kirchoff et al. 2022; Castillo-Rogez et al. 2023; Bierson und Nimmo 2022; Ćuk et al. 2020; Schenk und Moore 2020; Plescia 1987; Croft und Soderblom 1991; Ness et al. 1986 (siehe Task 1), Magnetosphärengröße.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Umlaufzeit, Apsidenperiode, Okkluderwahl und Datenblock-Achsneigung im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-oberon.md src/data/texte/en/hochschule/objekt-oberon.md docs/belege/hochschule/objekt-oberon.md src/data/literatur.ts
git commit -m "Hochschultext Oberon mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 8: Szene `uranus-gekippt`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-uranus-gekippt.md`, `src/data/texte/en/hochschule/szene-uranus-gekippt.md`, `docs/belege/hochschule/szene-uranus-gekippt.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Pol, Rotationsperiode, Jahreszeitentermine, Ringzahlen), Task 2 (Definition der Schiefe, Kippmechanismen), Task 3 bis 7 (Bahnradien der Monde), fachgeprüfte Texte `thema-ringe` (Ringprofil), `szene-saturn-ringkante` (Kantenherleitung), `szene-iapetus-schief` (Aufbau eines Szenentexts mit Kamerageometrie).
- Produziert: Hochschultext `szene:uranus-gekippt`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Der liegende Uranus` / `# Scene: Uranus lying on its side` (Titel aus `ui/i18n`, `scene.uranusGekippt`, wie die Gymnasialfassung). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung, Obergrenze 1200.
- **Was das Bild zeigt:** Eintrag `uranus-gekippt`, Index 16: Bahntyp `orbit`, `targetId` `uranus`, `distanceBasis` `bodyRadius`, `distanceInRadii` 7, `elevationDeg` 10 additiv [−10, 10] → absoluter Bereich 0–20°, `azimuthDeg` 167,65 additiv [−10, 10], `azimuthRateDegPerSec` 1,2, `durationSec` 35, `timeRateDaysPerSec` 0,3, `distanceFactor` [0,8, 1,5] — nachrechnen: Kameraabstand in km bei Faktor 0,8/1/1,5 (Basis 7 × 25 362 km = 177 534 km), Winkeldurchmesser von Uranus und der Ringaußenkante (51 600 km) bei diesen Abständen gegen das Sichtfeld (`KAMERA_FOV_GRAD` 50° in `render/renderer.ts`), warum die Ringebene zu Beginn nahe der Kante steht (Uranus' Pol ekliptikal bei Länge 257,65° und Breite 7,72° aus `poleVector`, Knoten der Ringebene mit der Ekliptik bei Länge ± 90° → 167,65° und 347,65°; Projektionsrechnung selbst durchführen, den Kommentar in `scenes.ts` nur als Hinweis nehmen), wie sich der Ring bei 1,2°/s über 35 s (42° Drift) öffnet (scheinbare Abplattung |Kamerarichtung · Pol| am Anfang und am Ende), wie viele Rotationen Uranus in 35 s × 0,3 d/s = 10,5 Tagen bei 17,24 h ausführt (rund 14,6 — der Gymnasialtext sagt „rund 15-mal"), welche Monde bei 7 Radien Abstand mit im Bild stehen (Miranda 5,12 R innerhalb des Kameraabstands, Ariel 7,53 R nahe dem Kameraabstand, Umbriel 10,5 R, Titania 17,2 R, Oberon 23,0 R — Bahnradien in Uranusradien selbst aus den Datensätzen rechnen und gegen das Sichtfeld prüfen), Beleuchtung: Die Szene legt keine Sonnenrichtung fest, sie folgt dem Datum nach dem Zeitsprung beim Szenenstart (`src/app/cinema.ts`); je nach Jahreszeit erscheint der beleuchtete Pol oder die Äquatorregion (Termine aus Task 1).
- **Hintergrund:** Uranus' Schiefe 97,77° und ihre Definition (Verweis `thema:achsneigung`, Mechanismen nur als Verweis), Jahreszeiten mit 42 Jahren Polnacht und den Terminen (Südsommer-Sonnenwende um 1985/86 zum Voyager-Vorbeiflug, Tagundnachtgleiche Dezember 2007, Nordsommer-Sonnenwende um 2030 — an der Quelle prüfen; Gymnasialtext nennt „2028", bei Abweichung melden), Ringe in der Äquatorebene und deshalb fast senkrecht zur Bahn, Ringentdeckung 1977 (Zahlen wie `thema-ringe`), Voyager 2 als einzige Sonde (Stone und Miner 1986), was Hubble und JWST seither an Ring- und Jahreszeitenbildern lieferten (Belege prüfen, etwa de Pater et al. 2007 zu Ringebenendurchgang 2007, JWST-Aufnahme 2023 nur mit belastbarer Quelle).
- **Modellgrenzen:** Kugel ohne Abplattung (2,3 %), Ringe als gerechneter Streifen mit Darstellungsbreiten (Zahlen wie `thema-ringe`), keine Ringdicke, keine ν- und μ-Ringe, keine kleinen Monde (Cordelia, Ophelia, Puck fehlen im Katalog), Pol fest, Rotationsperiode 17,24 h (Abweichung gegen Lamy et al. 2025 wie Task 1), Beleuchtung ohne Atmosphäre und ohne jahreszeitliche Wolken, Belichtung auf Uranus (`src/render/exposure.ts`), Monde als Ausweichfarben ohne Textur, Zeitraffer beim Szenenstart; Verweis `thema:modell`.
- Code lesen: `src/data/scenes.ts` (Eintrag mit allen Kommentaren, Zeilen rund 540–582), `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/uranus.ts`, `src/data/bodies/uranus-monde.ts`, `src/sim/orbit.ts` (`positionAt`, `achsneigungDeg`), `src/sim/frames.ts` (`poleVector`), `src/sim/scale.ts`, `src/render/ringProfil.ts`, `src/render/rings.ts`, `src/render/exposure.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`), Hochschultexte `objekt-uranus`, `thema-achsneigung`, `thema-ringe`, `szene-saturn-ringkante`, `szene-iapetus-schief`.
- Verweise: `objekt:uranus`, `objekt:miranda`, `objekt:ariel`, `objekt:oberon`, `thema:achsneigung`, `thema:ringe`, `thema:modell`, `szene:saturn-ringkante` (Vergleich der Kantenherleitung).
- Karten zu `szene:uranus-gekippt`: `quelle:nssdc-uranus`, `quelle:nasa-uranus`, `quelle:nasa-voyager-2`, `quelle:pds-rings`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Stone und Miner 1986 (siehe Task 1); Elliot et al. 1977 (`elliot-1977`); Showalter und Lissauer 2006 (`showalter-2006`); de Pater et al. 2007, Ringebenendurchgang 2007 (*Science* 317, 1888 — prüfen); Lamy et al. 2025 (siehe Task 1); Archinal et al. 2018 (`archinal-2018`); ein Beleg für die Jahreszeitentermine (etwa Sromovsky et al. 2015 oder ein NSSDC-Faktenblatt als `quelle:nssdc-uranus`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Kameraabstand, Sichtfeld, Kantengeometrie, Ringöffnung, Rotationszahl und Mondbahnen im Bildfeld im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4781); Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-uranus-gekippt.md src/data/texte/en/hochschule/szene-uranus-gekippt.md docs/belege/hochschule/szene-uranus-gekippt.md src/data/literatur.ts
git commit -m "Hochschultext Szene Der liegende Uranus mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 9: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe8-abnahme.md`
- Ändern: `README.md`
- Nur lokal, nicht committen: Skripte und Aufnahmen unter `.playwright-mcp/`

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 8; DOM-Attribute `[data-formelfehler]`, `[data-verweis]`, `[data-literatur]`, `[data-quelle]`, `[data-tabelle]`; `aside.info-panel`, `[role="tabpanel"]`, Hinweiszeilen `p.text-amber-300`.
- Produziert: das Abnahmeprotokoll; den Halt für Jens.

- [ ] **Schritt 1: Prüfläufe**

```bash
npm run lint
npm test
npm run build
npm run literatur:pruefen
```

Expected: Lint ohne Befund; alle Tests grün (Soll 4781 nach „Testzahlen" oben, zuzüglich Tests aus Zwischen-Tasks); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, Ausgangsstand 1 395,66 kB nach 4d-7); Prüfskript über den ganzen Katalog mit 0 Fehlern und ohne 429, Laufzeit notieren (Ausgangsstand 590 s bei 559 Einträgen). Schlusszeilen, die Katalogzahl (Ausgangsstand 559) und die Ausgabe des Prüfskripts ins Protokoll wie in der Abnahme 4d-7 §3; jede Warnung begründen (bekannt: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` und `sanchez-lavega-2011` Konsortial-Byline).

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

Kombinationen: Sprachen `de`, `en` × die acht Kennungen (`uranus`, `achsneigung`, `miranda`, `ariel`, `umbriel`, `titania`, `oberon`, `uranus-gekippt`). Zustand setzen wie in der Abnahme 4d-7: Körper über `setInfo({ thema: null })` und `setCamera({ targetId: '<id>', mode: 'free' })`; das Thema über `setInfo({ thema: 'achsneigung' })`; die Szene über `setCinema({ running: true, shuffle: false, nummer: 16 })`, `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setTime({ paused: true })`, `setUi({ hidden: false })`. Beim Wechsel von der Szene zurück zu einem Körper zuerst `setInfo({ thema: null })` setzen (Messfalle aus 4d-5); Store-Updates nach einem Kino-Stopp brauchen 200 ms vor der DOM-Messung (Lehre aus 4d-7). Auf den Kopfwechsel pollen (Titel wie in der ersten Zeile des Texts), Hinweise erst nach dem Auflösen des faulen Imports werten:

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

Je Sprache drei Messungen (Ruling 20): (a) Fachthema `photometrie` öffnen (`setInfo({ thema: 'photometrie' })`), den Verweis `a[data-verweis="objekt:uranus"]` klicken (Tabellenzelle „Uranus" in „Albedo ausgewählter Körper"), auf den Kopf „Uranus" pollen, dann: keine Hinweiszeile im Textbereich. (b) Hochschultext `objekt:venus` öffnen (`setCamera({ targetId: 'venus', mode: 'free' })`), den Verweis `a[data-verweis="thema:achsneigung"]` klicken (Fließtext in „Bahn, Rotation und Dynamik"), auf den Kopf „Achsneigung" / „Axial tilt" pollen, keine Hinweiszeile. (c) Fachthema `ringe` öffnen, den Verweis `a[data-verweis="szene:uranus-gekippt"]` klicken (Fließtext „Die Ringe der übrigen Riesenplaneten"), nach dem Kinostart stabilisieren (200 ms nach dem Store-Update), Kino anhalten, auf den Kopf „Szene: Der liegende Uranus" / „Scene: Uranus lying on its side" pollen, keine Hinweiszeile. Sechs Messungen, Ergebnis mit Wartezeit in ms ins Protokoll.

- [ ] **Schritt 5: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 6: Protokoll `docs/phase4d-etappe8-abnahme.md`**

Gliederung wie `docs/phase4d-etappe7-abnahme.md`:

```md
# Abnahme Phase 4d Etappe 8 „Uranussystem"

## 1. Umfang
## 2. Lint, Tests, Build
(Testzahl als durchgehende Tabelle Task → Zuwachs → Summe; Hauptchunk gegen 1 395,66 kB; Katalog gegen 559, je Task aus `git diff` nachgezählt, nicht aus den Berichten übernommen)
## 3. Prüfskript
## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
## 5. Sichtprüfung
### 5.1 Rundgang
### 5.2 Ersatz entfällt
### 5.3 Konsole
## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:", einschließlich der Rulings, die der Controller nach Task 9 setzt)
## 7. Bekannte Unschärfen
(Befunde am Simulationscode als Kandidaten für eigene Tasks; Restbefunde der Fachprüfungen; Quellen hinter Verlagssperren je Text)
## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer; gemeldete Fehler in Gymnasialtexten; Modelle und Kontingente; die Plan-Rulings als Themenliste)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, jede Summe nachgerechnet, Katalogzuwächse am `git diff` gezählt, Wortzahlen per `wc -w` nachgezählt. Die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung nennen, ohne Suchmuster.

- [ ] **Schritt 7: README**

In `README.md` im Absatz zu Phase 4d den Satzteil

```md
Etappe 7 Mimas, Tethys,
Dione, Rhea, Iapetus und die Szene „Die geneigte Bahn des Iapetus". Offen
sind die übrigen Hochschultexte (Etappen 4d-8 bis 4d-11) und Phase 5
```

ersetzen durch:

```md
Etappe 7 Mimas, Tethys,
Dione, Rhea, Iapetus und die Szene „Die geneigte Bahn des Iapetus"; Etappe 8
Uranus, Miranda, Ariel, Umbriel, Titania, Oberon, das Thema „Achsneigung" und
die Szene „Der liegende Uranus". Offen sind die übrigen Hochschultexte
(Etappen 4d-9 bis 4d-11) und Phase 5
```

Danach die Zeilenumbrüche des Absatzes glätten (Zeilen bis rund 80 Zeichen), ohne den Wortlaut zu ändern.

- [ ] **Schritt 8: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe8-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm.

```bash
git add docs/phase4d-etappe8-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 8: Uranussystem"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe; Paket ohne die fachgeprüften Texte und Beleglisten, mit Katalogeinträgen, etwaigen `quellen.ts`-Änderungen und Protokoll; sie ist zugleich die Task-Prüfung der Abnahme); Befunde gebündelt in **einer** Nacharbeit, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-8` nach `master`, Branch löschen; Diff auf Zugangsdaten prüfen; **Push erst nach dem Ja von Jens** (Ruling 14).
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Befunde am Simulationscode als Kandidaten. Etappe 4d-9 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- Modelle nach Weisung von Jens: Umsetzer der Text-Tasks, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell (sonnet); rein mechanische Aufträge (README, Formfixes, Katalogfelder, Nacharbeit nach der Schlussprüfung) auf dem kleinsten (haiku). Das stärkste Modell nur nach zweimaligem Scheitern an derselben Stelle. Bei einem Kontingentlimit auf haiku ausweichen und in §8 vermerken.
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace `.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe8/`.
- Fachprüfer laufen parallel zum nächsten Umsetzer; Nacharbeiten und Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`. Ein Umsetzer bekommt den Hinweis, welche fremde Belegliste gerade im Arbeitsbaum geändert sein kann.
- Jeder Umsetzer bekommt die Gemeinsamen Vorgaben, seinen Task und die Globalen Randbedingungen wörtlich (als Dateien); die Modellzahlen aus Task 1 (Uranus: GM, Pol, 97,77°/82,23°, Rotation, Jahreszeitentermine, Ringzahlen), Task 2 (Kippmechanismen, Modellschiefen) und Task 3 (Resonanzgeschichte, Fixture-Restfehler) gibt der Controller aus den Berichten an die Folgetasks weiter, insbesondere an Task 8.
- Eine Prüfrunde je Hochschultext: Nach der Nacharbeit keine weitere Prüfung beauftragen; Zweifel gehen ins Protokoll §8. Prüfaufträge verlangen ausdrücklich das Schreiben der Prüfspalte in die Datei und enthalten alle neun Prüfpunkte.
- Beleglisten-Nacharbeit nur mit Zellenkontrolle (Zelle 1 die Nummer, Zelle 2 die Aussage, sechs Zellen je Zeile) — Ruling 18; vor jedem Nacharbeits-Commit an einer Belegliste ein Skript im Scratchpad gegenprüfen lassen.
- Websuche-Kontingent: Recherche notfalls per WebFetch (Crossref-API, doi.org, arXiv, ADS). Ein Umsetzer, der nicht mehr suchen kann, meldet das im Bericht, zitiert nur Geöffnetes und nennt die Stellen, die die Fachprüfung an der Quelle nachholen soll. Viele Uranus-Arbeiten liegen hinter Verlagssperren (Science, Nature, Icarus); die Zusammenfassung genügt, das Protokoll zählt sie in §7.
- Zahlen in Berichten nachrechnen (frühere Etappen zeigten Zähl- und Kopierfehler bei Katalogzuwachs und Wortzahlen); Wortzahlen per `wc -w` selbst zählen.
- Commit-Texte mit Anführungszeichen per `git commit -F` aus einer Datei (Lehre aus 4d-7).

## Rulings

Entscheidungen der Planung (22.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** „push nach github, Gymnasialtext nachführen, wortzahlen sind ok, Rest bestätigt" (Jens, 22.09.2026, Abnahme 4d-7 §8) samt der Anweisung „weiter mit Plan" gilt als Freigabe für Etappe 4d-8.
2. **Ruling:** Modelle wie in 4d-4 bis 4d-7 (Weisung von Jens): mittleres Modell für Texte, Prüfer, Abnahme und Schlussprüfung, kleinstes für Mechanik; bei Kontingentlimit kleinstes mit Vermerk in §8.
3. **Ruling:** Höchstens eine Prüfrunde je Hochschultext (Regel von Jens): Fachprüfung, eine Nacharbeit, Schluss; keine Nachprüfung; in der Nacharbeit wird nicht gekürzt.
4. **Ruling:** Richtwerte dieser Etappe: Uranus als großer Körper 1500 bis 3500 Wörter (Entwurf §5.2), Thema 1500 bis 4000, Szene 300 bis 900; die fünf Monde **800 bis 1800** je Fassung (Obergrenze 2400) — enger als die 1000 bis 2000 der mittleren Saturnmonde (4d-7), weil die Datenlage nach einem einzigen Vorbeiflug dünner ist (nur die Südhalbkugel, kein Schwerefeld je Mond, keine Nahaufnahmen seit 1986), aber weiter als der Entwurf-Richtwert „kleine Monde" 600 bis 1000, weil Miranda (Coronae, Resonanzgeschichte) und Ariel (Erneuerung, CO₂, Ozeanfrage) mehr Fachstoff tragen. Kosten bei Fehlurteil: ein Text, den Jens kürzen oder erweitern lässt.
5. **Ruling:** Reihenfolge Uranus → Thema `achsneigung` → Miranda → Ariel → Umbriel → Titania → Oberon → Szene: Uranus liefert Polkonvention, Modellwinkel und Systemzahlen an alle; das Thema braucht Uranus' Zahlen und liefert die Kippmechanismen, auf die die Monde (prograde Äquatorbahnen als Randbedingung) und die Szene verweisen; Miranda liefert die Resonanzgeschichte des Systems an die vier äußeren Monde; die Szene übernimmt alles. Das Thema liegt in dieser Etappe, weil Uranus es am stärksten braucht (Entwurf §7: „Themen bei dem System, das sie am stärksten braucht").
6. **Ruling:** Die einzige Szene der Etappe läuft allein in Task 8, nach allen Körpern (wie 4d-7, Ruling 6).
7. **Ruling:** Datensatz-Befunde werden in 4d-8 nicht behoben (wie 4d-3 bis 4d-7): `nodeDot` 0 bei allen fünf Uranusmonden (bei Miranda empirische Wahl mit Restfehler rund 1,9 % des Bahnumfangs), gemeinsamer Pol von Ariel, Umbriel, Titania und Oberon, Mirandas fester Pol trotz Reihenentwicklung im IAU-Bericht, `rotationPeriodH` −17,24 h (Voyager) gegen Lamy et al. 2025, Uranus ohne Abplattung, fehlende ν- und μ-Ringe und kleine Monde, `achsneigungDeg` gegen die eigene Bahnnormale, keine Texturen der fünf Monde. Die Texte beschreiben den Ist-Code; neue Befunde gehen ins Ledger und ins Protokoll §7.
8. **Ruling:** Modellzahlen aus fachgeprüften Texten (`thema-bahnelemente`, `thema-gebundene-rotation`, `thema-finsternis`, `thema-photometrie`, `thema-ringe`, `thema-bezugssysteme`, `thema-entstehung`, `objekt-saturn`, `objekt-earth`, `objekt-mars`, `objekt-venus`, `objekt-mercury`, `objekt-sun`) übernehmen die neuen Texte gleichlautend; Abweichungen der eigenen Nachrechnung gehen an Jens (§8), der fachgeprüfte Text wird nicht geändert.
9. **Ruling:** Kein eigener Verweis-Task: Alle acht Kennungen dieser Etappe haben Gymnasialtexte. Bestehende Verweise fachgeprüfter Texte auf `objekt:uranus` (in `thema-ringe`, `thema-photometrie`), `szene:uranus-gekippt` (in `thema-ringe`) und `thema:achsneigung` (in `objekt-venus`, `objekt-mars`, `szene-erdaufgang`) führen danach auf die neuen Hochschultexte und werden nicht nachträglich geändert.
10. **Ruling:** Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); große Zahlen in Formeln ohne Trennzeichen; Zahlenspannen nennen, wofür sie gelten.
11. **Ruling:** Die Fachprüfung behält die acht Prüfpunkte aus 4d-7 und bekommt einen neunten: Verweissätze dürfen nur behaupten, was der Zieltext enthält (Befund aus 4d-7, dort zweimal „Kernbildung"); Prüfpunkt 8 umfasst auch interne Kurzverweise in Beleglisten (Sammelbefund 4d-7 §7).
12. **Ruling:** Eine Sichtprüfung des Formelsatzes entfällt, solange kein neuer TeX-Befehl dazukommt.
13. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle; wächst der Chunk gegenüber 1 395,66 kB um mehr als 50 kB, geht die Frage des faulen Ladens an Jens.
14. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master`; der Push folgt erst nach dem Ja von Jens. Jens gibt danach 4d-9 frei.
15. **Ruling:** Wortzahl-Obergrenze ein Drittel über dem Richtwert (Uranus 4667, Thema 5333, Monde 2400, Szene 1200); Straffung vor dem Commit, nie in der Nacharbeit; Richtigkeit vor Wortzahl, wenn eine Berichtigung die Grenze überschreitet.
16. **Ruling:** Katalogform wie nach der Schlussprüfung 4d-4, bestätigt in 4d-6 und 4d-7: beschreibende Zusätze in `erschienen` englisch, Eigennamen original, Vorabdrucke `'arXiv'`, laufend gepflegte Seiten mit Zugriffsjahr, Konsortial-Bylines mit dem Menschen zuerst, Körperschaften (etwa die National Academies) als Autor wie `cgpm-2022`.
17. **Ruling:** Quellenkarten aus dem Task sind Angebot, keine Pflicht; ein `quelle:`-Beleg muss die Aussage auf der Seite tragen. `nssdc-uranus`, `nasa-uranus`, `nasa-voyager-2` und `pds-rings` decken Uranus und die Szene, `nssdc-uranusmonde`, `nasa-uranusmonde`, `nasa-voyager-2` und `jpl-satelliten` die fünf Monde, `nssdc-factsheets` und `iau-rotation` das Thema; zitiert ein Text eine weitere Karte (etwa `jpl-satelliten-bahnen` oder `jpl-horizons` für die Mondbahnen), ergänzt der Task ihr `fuer`-Feld in `src/data/quellen.ts` um die eigene Kennung.
18. **Ruling:** Beleglisten-Nacharbeit nur mit Zellenkontrolle (Zelle 1 die Nummer, Zelle 2 die Aussage, sechs Zellen je Zeile); vor jedem Nacharbeits-Commit an einer Belegliste ein Skript im Scratchpad gegenprüfen lassen.
19. **Ruling:** Der Task-Prüfung der Abnahme (Task 9) dient die Schlussprüfung; ihr Paket enthält Protokoll und README vollständig, ohne die fachgeprüften Texte und Beleglisten (wie in 4d-5 bis 4d-7 per Ruling entschieden).
20. **Ruling:** „Ersatz entfällt" (Abnahme Schritt 4) nutzt drei Paare je Sprache: `thema:photometrie` → `objekt:uranus` (Tabellenzelle, DE/EN vorhanden), `objekt:venus` → `thema:achsneigung` (Fließtext, DE Z. 180 / EN Z. 175) und `thema:ringe` → `szene:uranus-gekippt` (Fließtext, DE Z. 195 / EN Z. 189) — per grep geprüft; damit sind alle drei Textarten der Etappe (Körper, Thema, Szene) als Verweisziel gemessen. Ältere fachgeprüfte Texte werden nicht rückwirkend verlinkt.
21. **Ruling:** Der Hochschultext `thema-achsneigung` führt die Modellschiefen aller Planeten, Plutos und der Sonne als Tabelle aus einer eigenen Nachrechnung mit `achsneigungDeg` (Skript im Scratchpad); die Werte fachgeprüfter Körpertexte (Erde, Mars, Venus, Merkur, Saturn, Sonne) haben Vorrang, Abweichungen gehen an Jens (§8). Exoplaneten und Klimadetails der Erde bleiben außerhalb des Themas (Verweis `objekt:earth`).
22. **Ruling:** Die Termine der Uranus-Jahreszeiten (Sonnenwenden, Tagundnachtgleiche) prüft Task 1 an der Quelle und gibt sie an Task 8 weiter; der Gymnasialtext der Szene nennt „2028" für die Nordsommer-Sonnenwende und wird bei Abweichung im Bericht gemeldet, nicht geändert (Vorab-Task in einer späteren Etappe, wie Titan in 4d-7 und Iapetus danach).
23. **Ruling:** Die Rotationsperiode des Uranus bleibt im Datensatz bei −17,24 h (Voyager-Radioperiode); die Texte nennen die neue Bestimmung aus Hubble-Aurorabeobachtungen (Lamy et al. 2025) als Messwert und die Abweichung als Modellgrenze. Ein Datensatzwechsel wäre ein eigener Task nach Jens' Entscheidung (§8).
