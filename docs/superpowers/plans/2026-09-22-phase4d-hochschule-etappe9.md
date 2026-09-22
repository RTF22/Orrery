# Phase 4d Hochschule, Etappe 9 „Neptun, Pluto" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Neptun, Triton, Pluto und Charon sowie die Szenen `triton-rueckwaerts`, `ferne-sonne` und `pluto-charon` haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung (Entwurf §7, Zeile 4d-9, 14 Dateien); vorab werden die vier Gymnasialbefunde aus der Abnahme 4d-8 §8 nachgeführt. Danach **Halt** für die Freigabe von Etappe 4d-10.

**Architektur:** Ein kleiner Vorab-Task für die Gymnasial- und Grundschultexte (ohne Fachprüfung, wie Titan in 4d-7), vier Körper-Tasks und zwei Szenen-Tasks, **nicht wörtlich im Plan**: Der Umsetzer liest den Code, recherchiert, schreibt und belegt nach Entwurf §6.4; eine Fachprüfung mit frischem Kontext prüft **einmal**, danach folgt **eine** Nacharbeit (Regel von Jens vom 20.09.2026). Kein Code-Task, kein Themen-Task (Entwurf §7 legt in 4d-9 kein Thema fest). Reihenfolge Neptun → Triton → Pluto → Charon → Szenen (Ruling 5): Neptun liefert Systemzahlen und die Sonnenansicht aus 30 AE, Triton die Einfanggeschichte, Pluto die Resonanz mit Neptun und die Architektur des Doppelsystems im Modell, Charon die Gezeitengeschichte; die Szenen übernehmen alles. Alle sieben Kennungen der Text-Tasks haben Gymnasialtexte, deshalb setzt jeder Text-Task seine Verweise selbst. Task 8 ist die Abnahme nach Entwurf §8.2.

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §4.1, §5 (Gestalt der Texte), §6 (Arbeitsweise), §7 Zeile 4d-9, §8.2 (Abnahme). Vorlagen: Plan `docs/superpowers/plans/2026-09-22-phase4d-hochschule-etappe8.md`, Abnahme `docs/phase4d-etappe8-abnahme.md` und die fachgeprüften Hochschultexte unter `src/data/texte/de/hochschule/` samt Beleglisten unter `docs/belege/hochschule/` (Riesenplanet: `objekt-uranus.md`, `objekt-saturn.md`; großer Mond: `objekt-titan.md`, `objekt-ganymede.md`; mittelgroßer Mond: `objekt-rhea.md`, `objekt-titania.md`; Szenen: `szene-uranus-gekippt.md`, `szene-iapetus-schief.md`, `szene-galileisches-schattenspiel.md`). Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und im Literaturkatalog (Originaltitel; beschreibende Zusätze im Feld `erschienen` englisch, Eigennamen von Verlagen und Einrichtungen original).
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei. Protokolle, Berichte und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**. Keine Prozesssprache (Task, Ruling, Brief) in Texten oder Beleglisten.
- Branch `hochschule-9` (von `master` nach dem Plan-Commit), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test) und steht alphabetisch nach Kennung (Test); Vorabdrucke tragen `erschienen: 'arXiv'` (Test); laufend gepflegte Seiten tragen das Zugriffsjahr.
- Keine neue Abhängigkeit in `package.json`. Kein Code außer in etwaigen Zwischen-Tasks für neue TeX-Befehle; Befunde am Simulationscode, die ein Text aufdeckt, beschreibt der Text in „Im Modell" beziehungsweise „Modellgrenzen" und der Bericht meldet sie (Ruling 7).
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben. EN-Formeln mit `.` statt `{,}` als Dezimalzeichen; `\%` gehört nicht zur TeX-Teilmenge (Lehren aus 4d-8).
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Namen beziehungsweise Titel aus `ui/i18n` (Körper `body.<id>.name`: „Neptun"/„Neptune", „Triton", „Pluto", „Charon"; Szenen „Szene: " / „Scene: " vor dem Szenentitel: `scene.tritonRueckwaerts` = „Tritons rückläufige Bahn" / „Triton's retrograde orbit", `scene.ferneSonne` = „Von Neptun zur fernen Sonne" / „From Neptune to the distant Sun", `scene.plutoCharon` = „Pluto und Charon im Doppel" / „Pluto and Charon, a double world", wie in den Gymnasialfassungen); Körper mit den festen `##`-Überschriften aus Entwurf §5.1 in dieser Reihenfolge, Pflichtabschnitte nie weglassen; Szene mit den drei festen `##`-Überschriften; Hochschultexte enden mit `*Stand: September 2026*` / `*As of September 2026*` als eigenem Absatz; `literatur:` nur in Hochschultexten. **Richtwerte dieser Etappe (Ruling 4):** Neptun, Triton und Pluto 1500 bis 3500 Wörter je Fassung (Obergrenze 4667), Charon 1000 bis 2000 (2667), Szenen 300 bis 900 (1200). Richtigkeit geht vor Wortzahl; gestrafft wird vor dem Commit, nie in der Nacharbeit.
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten. Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen); Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste. Nacharbeiten warten, bis kein anderer Umsetzer läuft.
- **Höchstens eine Prüfrunde je Text** (Jens, 20.09.2026): ein Umsetzer, eine Fachprüfung, eine Nacharbeit, dann Schluss. Keine Nachprüfung. Was danach offen bleibt, steht im Abnahmeprotokoll (§7, §8).
- Modelle nach Weisung von Jens: Text-Umsetzer, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell, mechanische Aufträge auf dem kleinsten; das stärkste nur nach zweimaligem Scheitern an derselben Stelle (Ruling ins Ledger). Greift ein Kontingentlimit des mittleren Modells, läuft der Auftrag auf dem kleinsten Modell weiter und die Abnahme vermerkt es in §8.
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe9/progress.md` (git-ignoriert), am Ende gesammelt ins Abnahmeprotokoll.

## Prüfschwerpunkte

Eingaben und Fehlerbilder, die kein Dateitest abdeckt und die einen Leser am ehesten treffen. Jeder Punkt ist einem Task als ausdrückliche Vorgabe und der Fachprüfung als Teil von Prüfpunkt 3 oder 7 zugeordnet:

1. **Pluto–Charon ohne Schwerpunkt:** Das Modell setzt Pluto in den Ursprung seines Systems und lässt Charon um Pluto laufen; in Wirklichkeit liegt der Schwerpunkt außerhalb Plutos. Leser erwarten, dass „Im Modell" (Task 4, Task 5) und „Modellgrenzen" (Task 7) den Versatz beziffern (Schwerpunktabstand von Plutos Mitte in km und in Plutoradien, selbst gerechnet) und dass kein Text behauptet, das Bild zeige Pluto um den Schwerpunkt pendeln.
2. **Vorzeichen- und Polkonventionen bei Triton und Pluto:** Triton hat eine negative Rotationsperiode und eine Bahnneigung über 90° gegen Neptuns Äquator; Pluto trägt nach IAU den positiven Pol (Rechte-Hand-Regel) mit positiver Periode und rund 120° Schiefe. Leser erwarten, dass Datenblockwert, geometrischer Winkel Pol–Bahnnormale und Literaturwert erklärt nebeneinanderstehen (Task 3, Task 4) und mit `thema-achsneigung` (Neptun 28,318°, Pluto 119,614°) übereinstimmen.
3. **Rotationsperiode Neptuns:** Der Datensatz führt 16,11 h (Voyager-Radioperiode); Wolkenmerkmale ergeben andere Perioden. Leser erwarten Messwert, Datensatzwert und die aufgelaufene Abweichung in Umdrehungen (Task 2, übernommen in Task 6), nicht einen stillschweigenden Wechsel.
4. **Beleuchtung und Helligkeit in 30 bis 50 AE:** Die Belichtung setzt jedes Ziel gleich hell (fachgeprüft in `thema-photometrie`); die Sonne erscheint in `ferne-sonne` 1,2° groß statt 64″ (fachgeprüft in `objekt-sun`). Leser erwarten, dass Task 6 und Task 7 diese Überhöhungen nennen und nicht als Eigenschaften des Ortes ausgeben.
5. **Kleine Monde und Ringe fehlen:** Nereid, Proteus und die übrigen Neptunmonde, Neptuns Ringe, Nix, Hydra, Kerberos und Styx sind nicht im Katalog. Leser erwarten, dass die Texte sie als Wirklichkeit beschreiben und in „Im Modell" beziehungsweise „Modellgrenzen" als fehlend kennzeichnen (Task 2 bis 7), und dass kein Verweis auf eine nicht vorhandene Kennung zeigt (Dateitest „enthält nur auflösbare Verweise").

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Gymnasial- und Grundschul-Nachführung (vier Befunde aus 4d-8) | `src/data/texte/<de\|en>/gymnasium/szene-uranus-gekippt.md`, `…/gymnasium/objekt-miranda.md`, `…/grundschule/objekt-miranda.md`, `…/gymnasium/objekt-titania.md`, `…/gymnasium/objekt-oberon.md` (je de und en, 10 Dateien) |
| 2 | Körper `neptune` | 2 Texte, `docs/belege/hochschule/objekt-neptune.md`, `src/data/literatur.ts` |
| 3 | Körper `triton` | 2 Texte, `docs/belege/hochschule/objekt-triton.md`, `src/data/literatur.ts` |
| 4 | Körper `pluto` | 2 Texte, `docs/belege/hochschule/objekt-pluto.md`, `src/data/literatur.ts` |
| 5 | Körper `charon` | 2 Texte, `docs/belege/hochschule/objekt-charon.md`, `src/data/literatur.ts` |
| 6 | Szenen `triton-rueckwaerts` und `ferne-sonne` | 4 Texte, 2 Beleglisten, `src/data/literatur.ts` |
| 7 | Szene `pluto-charon` | 2 Texte, `docs/belege/hochschule/szene-pluto-charon.md`, `src/data/literatur.ts` |
| 8 | Abnahme | `docs/phase4d-etappe9-abnahme.md`, `README.md` |

Hochschultexte liegen unter `src/data/texte/<de|en>/hochschule/<art>-<kennung>.md`. Kennungen: `neptune` (`src/data/bodies/neptune.ts`), `triton` (`src/data/bodies/neptun-monde.ts`), `pluto`, `charon` (`src/data/bodies/pluto-system.ts`), Szenen wie in `src/data/scenes.ts`, am Array gegengeprüft (`grep -n "id: '" src/data/scenes.ts` zählt 0-basiert erdaufgang, saturn-streiflicht, mondtanz, **ferne-sonne** (3), systemblick, merkurjagd, jupiter-vorbeiflug, galileisches-schattenspiel, phobos-tiefflug, **pluto-charon** (9), saturn-ringkante, ringdurchflug, titan-dunst, enceladus-hell, **triton-rueckwaerts** (14), iapetus-schief, uranus-gekippt, ceres-guertel, mondfinsternis).

**Testzahlen:** Ausgangsstand `master` 0a8b584 (Abnahme 4d-8 mit den Entscheidungen zu §8): 4781 Tests, Katalog `src/data/literatur.ts` 628 Einträge, Quellenkarten 83, Hauptchunk 1 415,10 kB, Prüfskript 737 s bei 628 Einträgen (4 bekannte Warnungen: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` und `sanchez-lavega-2011` Konsortial-Byline). Im Dateitest `src/data/texte/dateien.test.ts` erzeugt ein Hochschultext eines Körpers oder einer Szene 11 Fälle. Task 1 ändert nur bestehende Dateien und fügt keinen Fall hinzu. Soll: 4781 + 14 × 11 = **4935**, zuzüglich Tests aus Zwischen-Tasks für neue TeX-Befehle. Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test`. Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

### Task 1: Gymnasial- und Grundschul-Nachführung (vier Befunde aus 4d-8)

**Dateien:**
- Ändern: `src/data/texte/de/gymnasium/szene-uranus-gekippt.md`, `src/data/texte/en/gymnasium/szene-uranus-gekippt.md`, `src/data/texte/de/gymnasium/objekt-miranda.md`, `src/data/texte/en/gymnasium/objekt-miranda.md`, `src/data/texte/de/grundschule/objekt-miranda.md`, `src/data/texte/en/grundschule/objekt-miranda.md`, `src/data/texte/de/gymnasium/objekt-titania.md`, `src/data/texte/en/gymnasium/objekt-titania.md`, `src/data/texte/de/gymnasium/objekt-oberon.md`, `src/data/texte/en/gymnasium/objekt-oberon.md`

**Schnittstellen:**
- Konsumiert: die fachgeprüften Hochschultexte `szene-uranus-gekippt`, `objekt-uranus`, `thema-achsneigung` (Nordsommer-Sonnenwende 11. April 2030), `objekt-miranda` (Verona Rupes 5 bis 10 km nach Thomas 1988), `objekt-titania` und `objekt-oberon` (Zwei-Komponenten-Modell: Titania rund 65 % Gestein nach Masse, rund 64 % Eis nach Volumen; Oberon rund 59 % Gestein nach Masse, rund 69 % Eis nach Volumen) samt Beleglisten unter `docs/belege/hochschule/`.
- Produziert: Gymnasial- und Grundschultexte ohne Widerspruch zu den Hochschultexten; keine neuen Testfälle.

**Hintergrund:** Jens' Entscheidung vom 22.09.2026 (Abnahme 4d-8, „Entscheidungen von Jens"): „Die vier Gymnasialbefunde bleiben vorgemerkt und werden vor oder mit Etappe 4d-9 in einem eigenen Nachführungs-Task behandelt." Die Befunde (Abnahme 4d-8 §8, „Gymnasialbefunde"), ergänzt um den Grundschultext Miranda, der denselben Wert trägt (Ruling 21):

| Datei (de/en) | Stelle heute | Befund |
|---|---|---|
| `gymnasium/szene-uranus-gekippt.md` | DE Z. 14 „2028 zeigt der Nordpol zu ihr", EN Z. 13 „in 2028 the north pole will point at" | Nordsommer-Sonnenwende am 11. April 2030 (fachgeprüft in `objekt-uranus`, `thema-achsneigung`, `szene-uranus-gekippt`) |
| `gymnasium/objekt-miranda.md` | DE Z. 11–13 „rund 20 km hoch, die höchste bekannte Klippe … rund zwölf Minuten", EN Z. 11–12 | Thomas (1988): 5 bis 10 km; der Hochschultext nennt höhere Schätzungen „weniger gesichert"; die Falldauer ändert sich mit der Höhe |
| `grundschule/objekt-miranda.md` | DE Z. 5–6 „rund 20 Kilometer hoch, mehr als doppelt so hoch wie der Mount Everest", EN Z. 5–6 | derselbe Wert; bei 5 bis 10 km ist Verona Rupes etwa so hoch wie der Mount Everest (8,8 km), nicht doppelt so hoch |
| `gymnasium/objekt-titania.md` | DE Z. 5 „spricht für etwa gleiche Anteile Eis und Gestein", EN Z. 5 „roughly equal parts ice and rock" | nach Masse rund zwei Drittel Gestein, nach Volumen rund zwei Drittel Eis |
| `gymnasium/objekt-oberon.md` | DE Z. 17 „auf etwa gleiche Teile Eis und Gestein", EN Z. 16 „roughly equal parts ice and rock" | nach Masse knapp drei Fünftel Gestein, nach Volumen gut zwei Drittel Eis |

- [ ] **Schritt 1:** In den Hochschultexten und Beleglisten die zugehörigen Stellen lesen: `objekt-uranus.md` und `thema-achsneigung.md` (Sonnenwendtermin), `objekt-miranda.md` „Oberfläche" (Verona Rupes, rund Z. 103–105) samt Belegzeile zu Thomas 1988, `objekt-titania.md` und `objekt-oberon.md` „Inneres" (Zwei-Komponenten-Modell) samt Belegzeilen. Die Prozentwerte oben dort gegenprüfen; weichen sie ab, gilt der Hochschultext und der Bericht nennt die Abweichung.
- [ ] **Schritt 2:** Alle zehn Dateien ganz lesen; Ton und Wortschatz des übrigen Texts beachten (Gymnasium: Schülerniveau, keine Formeln, keine Literaturverweise; Grundschule: kurze Sätze, Vergleiche aus dem Alltag).
- [ ] **Schritt 3:** Die betroffenen Sätze in beiden Fassungen umformulieren, jeweils ein bis zwei Sätze, nicht wesentlich länger als der ersetzte Text:
  - Szene: Jahr 2030 statt 2028 (Tagesdatum nicht nötig).
  - Miranda Gymnasium: Höhe „5 bis 10 km" nach Voyager-Bildern; den Superlativ „die höchste bekannte Klippe im Sonnensystem" nur behalten, wenn der Hochschultext oder seine Belegliste ihn stützt, sonst „eine der höchsten bekannten Steilwände"; die Falldauer aus der Höhe selbst nachrechnen (freier Fall ohne Luftwiderstand, Schwerebeschleunigung aus Mirandas Masse und Radius im Datensatz `src/data/bodies/uranus-monde.ts`, Rechnung im Scratchpad) und als gerundete Spanne nennen oder den Satz weglassen.
  - Miranda Grundschule: sinngemäß „mehrere Kilometer hoch, etwa so hoch wie der Mount Everest"; keine Zahl, die dem Hochschultext widerspricht.
  - Titania und Oberon: kein „gleiche Teile"; stattdessen sinngemäß „der Masse nach überwiegt das Gestein, dem Raum nach das Eis" oder eine gleichwertige Aussage mit gerundeten Anteilen, die zum Hochschultext passt.
  - Der übrige Absatz bleibt unverändert, auch der Satz zu Messina Chasma in Titania (Ruling 21). Deutsche und englische Fassung dürfen im Wortlaut, nicht aber im Sinn voneinander abweichen. Keine `literatur:`-Verweise (Gymnasial- und Grundschultexte zitieren keine Literatur).
- [ ] **Schritt 4:** `npx vitest run src/data` → PASS (kein neuer Testfall, bestehende Dateitests bleiben grün); `npm test` → 4781.
- [ ] **Schritt 5: Commit** (Commit-Text per `git commit -F` aus einer Datei im Scratchpad, weil er Anführungszeichen enthält)

```bash
git add src/data/texte/de/gymnasium/szene-uranus-gekippt.md src/data/texte/en/gymnasium/szene-uranus-gekippt.md src/data/texte/de/gymnasium/objekt-miranda.md src/data/texte/en/gymnasium/objekt-miranda.md src/data/texte/de/grundschule/objekt-miranda.md src/data/texte/en/grundschule/objekt-miranda.md src/data/texte/de/gymnasium/objekt-titania.md src/data/texte/en/gymnasium/objekt-titania.md src/data/texte/de/gymnasium/objekt-oberon.md src/data/texte/en/gymnasium/objekt-oberon.md
git commit -F <Scratchpad>/commit-task1.txt
```

Inhalt von `commit-task1.txt`:

```text
Gymnasial- und Grundschultexte an die Hochschultexte des Uranussystems angeglichen

Befunde der Etappe 4d-8 (Abnahme §8): Nordsommer-Sonnenwende des Uranus 2030
statt 2028; Verona Rupes auf Miranda 5 bis 10 km nach Voyager-Bildern statt
20 km (auch im Grundschultext); Titania und Oberon ohne „gleiche Teile Eis und
Gestein", der Masse nach überwiegt das Gestein, dem Raum nach das Eis.
```

Keine Fachprüfung (kein Hochschultext, Entwurf §6.3 gilt nur für Hochschultexte); der Controller liest den Diff vor dem nächsten Task und vermerkt Auffälligkeiten im Ledger. Modell: mittleres.

---

## Gemeinsame Vorgaben für Task 2 bis 7 (Texte)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den fachgeprüften Hochschultexten als Maßstab für Tiefe, Ton und Belegdichte: `objekt-uranus.md` und `objekt-saturn.md` für Neptun, `objekt-titan.md` und `objekt-ganymede.md` für Triton und Pluto, `objekt-rhea.md` und `objekt-titania.md` für Charon, `szene-uranus-gekippt.md`, `szene-iapetus-schief.md` und `szene-galileisches-schattenspiel.md` für die Szenen. Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang. Besonderheit dieser Etappe: Neptun und Triton hat nur **Voyager 2** am 25. August 1989 besucht, Pluto und Charon nur **New Horizons** am 14. Juli 2015; alles Spätere stammt von Erde, Hubble, JWST, Sternbedeckungen oder aus Modellen. Die Texte sagen bei jedem Wert, worauf er beruht, und stellen die Lücken als solche dar.

**Ablauf je Task**

1. **Vorlage lesen:** den passenden fachgeprüften Text in beiden Fassungen und seine Belegliste unter `docs/belege/hochschule/` (Form der Belegliste, Abschnitt „Im Modell"). Dazu den Gymnasialtext derselben Kennung, damit der Hochschultext ihm nicht widerspricht; findet der Umsetzer im Gymnasialtext einen sachlichen Fehler, meldet er ihn im Bericht (nicht ändern).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (nicht versioniert). Node 24 lädt `src/data/literatur.ts` und `src/data/quellen.ts` direkt (`node --input-type=module -e "const { LITERATUR } = await import('./src/data/literatur.ts')"`), Module mit Importen ohne Dateiendung dagegen nicht; deren Formeln werden im Skript nachgebildet. Werte des Datenblocks aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten — insbesondere die Zeile „Achsneigung", die `achsneigungDeg` in `src/sim/orbit.ts` liefert: Winkel zwischen IAU-Pol und der aus Position und Geschwindigkeit zur Epoche J2000 gebildeten Bahnnormale, bei negativer Rotationsperiode um 180° umgeklappt (`drehsinn`). Neptun 28,318° und Pluto 119,614° stehen fachgeprüft in `thema-achsneigung`; für Triton (negative Periode, $i = 156{,}83^\circ$ gegen Neptuns Äquator) und Charon selbst nachrechnen.
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf (steht keine Websuche zur Verfügung, mit WebFetch über Crossref-API `https://api.crossref.org/works/<doi>`, doi.org, arXiv, ADS, Verlagsseiten, PMC; im Bericht vermerken): zuerst nach neueren Übersichtsartikeln, Hubble-, JWST- und Sternbedeckungs-Auswertungen und Missionsstudien suchen (etwa das Buch „The Pluto System After New Horizons" 2021, Neptun- und Triton-Missionsstudien, Decadal Survey 2022), auch wenn der Stoff bekannt scheint. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, Band, Seite und DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren (in 4d-8 waren fünf Ausgangspunkte ungenau). Einträge, die schon im Katalog stehen (`src/data/literatur.ts`, 628 Einträge, darunter mit Neptun- oder Plutobezug `helled-2020`, `nettelmann-2013`, `neuenschwander-2022`, `movshovitz-2022`, `stanley-2004`, `irwin-2022`, `chavez-2023`, `porco-1991`, `mallama-2017`, `mallama-2018`, `szulagyi-2018`, `hussmann-2006`, `schenk-2020`, `malhotra-1993`, `malhotra-1995`, `cohen-1965`, `williams-1971`, `dobrovolskis-1983`, `cheng-2014`, `proudfoot-2026`, `stern-2018a`, `showalter-2015`, `nesvorny-2012`, `nesvorny-2016`, `nesvorny-2018`, `nesvorny-2019`, `mckinnon-2020`, `crompvoets-2022`, `nssdc-newhorizons-2026`, `national-academies-2022`, `archinal-2011`, `archinal-2018`, `murray-2000`), wiederverwenden statt doppelt anlegen; ihr Inhalt wird trotzdem für jede neue Aussage geöffnet. Achtung Namensgleichheit: `stern-2018` ist eine Arbeit über Plattentektonik, nicht über Pluto.
4. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" **leer** (in 4d-8 zweimal vorbefüllt — nicht wiederholen):

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile — auch eigene Herleitungen (Beleg „Herleitung" mit Rechenweg) und Vergleiche; „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" oder „Nachrechnung am Code: <Datei>". Senkrechte Striche in Zellen als `\|` maskieren (jede Zeile hat genau sechs Zellen, Zelle 1 die Nummer). Querverweise zwischen Zeilen nach jeder Neunummerierung prüfen. Ein `quelle:`-Beleg muss die Aussage auf der Seite tatsächlich tragen. Keine internen Kurzverweise auf Aufträge oder Berichte.
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`; Körperschaften als Autor wie bei `cgpm-2022`, Konsortial-Bylines mit dem Menschen zuerst. `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer; Vorabdrucke `erschienen: 'arXiv'`; beschreibende Zusätze englisch, Eigennamen original. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test). Kennungen gleicher Erstautoren und Jahre mit Buchstaben unterscheiden (`stern-2018` und `stern-2018a` existieren; eine weitere Stern-Arbeit von 2018 wäre `stern-2018b`).
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen. Ein einzelner Netzfehler (etwa `TypeError: fetch failed`) ist kein Befund: die Kennung einzeln nachlaufen lassen und das Ergebnis im Bericht nennen (Ruling 22).
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile und Gliederung nach den Globalen Randbedingungen und Entwurf §5.1. Körper: `## Kenngrößen und Messung`, `## Inneres`, `## Oberfläche` (entfällt bei Neptun), `## Atmosphäre und Magnetosphäre`, `## Bahn, Rotation und Dynamik`, `## Entstehung und Entwicklung`, `## Offene Fragen`, `## Im Modell` (englisch `Parameters and measurement`, `Interior`, `Surface`, `Atmosphere and magnetosphere`, `Orbit, rotation and dynamics`, `Formation and evolution`, `Open questions`, `In the model`). Szene: `## Was das Bild zeigt`, `## Hintergrund`, `## Modellgrenzen` (englisch `What the view shows`, `Background`, `Model limitations`).
   - „Im Modell" / „Modellgrenzen": was Orrery zur Kennung rechnet oder bewusst weglässt, mit Verweis `thema:modell`; jede Abweichung des Modells von der Wirklichkeit mit Größenordnung; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung. Stehen dieselben Modellzahlen schon in einem fachgeprüften Text (siehe unten „Modellzahlen aus fachgeprüften Texten"), dieselben Werte verwenden oder die Abweichung im Bericht begründen (Ruling 8).
   - „Offene Fragen": Streitfragen mit Belegen für beide Seiten, nicht entschieden, solange die Fachwelt es nicht getan hat.
   - Schluss `*Stand: September 2026*` / `*As of September 2026*`.
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit allen Nachträgen). Fehlt ein Befehl, ist das ein eigener Zwischen-Task, kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); Zahlenspannen sagen, wofür sie gelten.
   - Kein `$` außerhalb von Formeln; kein `|` am Absatzanfang außer in Tabellen.
8. **Verweise:** `objekt:`, `szene:`, `thema:` auf Kennungen aus `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts`. Sinnvolle Ziele dieser Etappe: `objekt:neptune`, `objekt:triton`, `objekt:pluto`, `objekt:charon`, `objekt:uranus`, `objekt:sun`, `objekt:earth`, `objekt:jupiter`, `objekt:saturn`, `objekt:titan`, `objekt:eris`, `objekt:makemake`, `objekt:haumea`, `objekt:ceres`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:achsneigung`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:finsternis`, `thema:bahnelemente`, `thema:bezugssysteme`, `thema:entstehung`, `thema:ringe`, `thema:zwergplaneten`, `thema:modell`, `szene:triton-rueckwaerts`, `szene:pluto-charon`, `szene:ferne-sonne`. `thema:zwergplaneten`, `thema:modell` und die Zwergplaneten außer Pluto haben bis 4d-10/4d-11 nur Gymnasialersatz; ein Verweissatz dorthin behauptet nur, was der Gymnasialtext enthält. Verweissätze behaupten nur, was das Ziel tatsächlich enthält (Prüfpunkt 9). Höchstens ein Verweis je Ziel je `##`-Abschnitt; kein Verweis eines Texts auf sich selbst. Quellenkarten erscheinen automatisch für alle Kennungen in `fuer` (`src/data/quellen.ts`): `nssdc-neptune`, `nasa-neptune`, `nasa-voyager-2` für Neptun; `jpl-satelliten`, `nasa-triton`, `nasa-voyager-2` für Triton; `nssdc-pluto`, `nasa-pluto`, `nasa-kuiperguertel`, `nasa-new-horizons` für Pluto; `jpl-satelliten`, `nasa-pluto`, `nasa-new-horizons` für Charon; `nssdc-neptune`, `nasa-triton`, `nasa-voyager-2`, `jpl-satelliten-bahnen` für `triton-rueckwaerts`; `nssdc-sun`, `nssdc-neptune`, `nasa-voyager-2` für `ferne-sonne`; `nssdc-pluto`, `nasa-pluto`, `nasa-new-horizons` für `pluto-charon`. Zitiert ein Text eine weitere Karte (etwa `jpl-horizons` oder `nssdc-factsheets`), ergänzt der Task ihr `fuer`-Feld in `src/data/quellen.ts` um die eigene Kennung (dann wird `quellen.ts` zur Ändern-Datei des Tasks); ein `quelle:`-Verweis ist keine Pflicht (Ruling 17).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht, vom Controller nachgezählt.
10. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen (Commit-Text per `git commit -F` aus einer Datei, wenn er Anführungszeichen enthält). Vorher `git status --short`: keine Reste aus Skripten im Quellbaum; eine vom Prüfer geänderte fremde Belegliste im Arbeitsbaum bleibt liegen und wird nicht mitcommittet.
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten. **Genau eine** Fachprüfung je Task. Der Auftrag verlangt ausdrücklich, die Spalte „Prüfung" **in die Datei** zu schreiben.
12. **Nacharbeit (genau eine):** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger; in der Nacharbeit wird **nicht gekürzt**. In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung`; alle anderen Prüfeinträge bleiben. Jede geänderte Zeile behält sechs Zellen mit der Nummer in Zelle 1, vor dem Commit per Skript im Scratchpad gegengeprüft (Ruling 18). **Keine Nachprüfung:** Was der Umsetzer nicht beheben kann oder anders sieht als der Prüfer, notiert er mit Begründung im Ledger; die Abnahme führt es in §7 oder §8 auf.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste <art>-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Modellzahlen aus fachgeprüften Texten (gleichlautend übernehmen, Ruling 8):**
- `thema-achsneigung.md`, Tabelle und „Im Modell": Neptun Messwert 28,3°, Modellwert 28,318°; Pluto 119,5° gegen 119,614° (beide nach NSSDC-Faktenblättern); Neptun hat bei ähnlicher Größe und Zusammensetzung wie Uranus nur 28,3° Schiefe; Plutos Schiefe schwankt über Jahrmillionen chaotisch (Dobrovolskis und Harris 1983); Triton behält im Datensatz einen festen Pol, obwohl der IAU-Bericht ihn als Reihe mit großen periodischen Gliedern angibt; 180°-Klappung bei negativer Rotationsperiode (Triton).
- `thema-gebundene-rotation.md`, „Pluto und Charon: doppelt gebunden", „Im Modell" und Modelltabelle: Pluto und Charon als bekanntestes doppelt gebundenes Paar, Gezeitenentwicklung nach Cheng et al. 2014; beide tragen dieselbe Polrichtung und dieselbe Rotationsperiode 153,29335 h, Charons Umlaufzeit 153,29333 h; Winkel zwischen Kartenmitte und Partnerrichtung 131,1° (Pluto) und 48,9° (Charon), Wanderung 0,3° je Jahrhundert; Tabellenzeilen Triton 0,028 / 19,4° / 12,0°, Pluto 0,144 / 131,1° / 131,4°, Charon 0,144 / 48,9° / 48,6° (Spaltenbedeutung dort nachlesen); Libration in Breite bei Triton ±21,4°, in Länge ±2,1° bei $2e$ von nur 0,02° — ein Artefakt des festen Pols, der IAU-Bericht gibt Tritons Pol als $299{,}36^\circ - 32{,}35^\circ \sin N_7 - \ldots$ und $41{,}17^\circ + 22{,}55^\circ \cos N_7 + \ldots$ (Archinal et al. 2011); Nix und Hydra fehlen im Katalog.
- `thema-gezeiten.md`, „Im Modell": Pluto und Charon drehen sich beide in 153,29335 Stunden, der Umlaufzeit Charons, und zeigen einander dauerhaft dieselbe Seite; keine Gezeitendrehmomente im Modell.
- `thema-resonanzen.md`, „Neptun und Pluto" und „Im Modell": $\varphi_\mathrm{P} = 3\lambda_\mathrm{P} - 2\lambda_\mathrm{N} - \varpi_\mathrm{P}$ libriert um 180° mit etwa 76° Amplitude und etwa 19 670 Jahren Periode, Mindestabstand 18 AE (Cohen und Hubbard 1965); mittlere Periode 19 951 Jahre, Perihelargument libriert mit 24° Amplitude und 3,955 Millionen Jahren um 90° (Williams und Benson 1971); Einfang durch Neptuns Auswanderung um mindestens etwa 5 AE (Malhotra 1993); im Modell $\varphi_\mathrm{P} = 242{,}6^\circ$ zur Epoche, Umlaufzeitverhältnis 1,5116, Abnahme 3,35° je Jahrhundert, Umlauf in 10 752 Jahren, 1892 Pluto bei mittlerer Anomalie 219°, 48,1 AE von der Sonne und 19,4 AE von Neptun, 1800 bis 2050 kein Abstand unter 19,0 AE, zwischen 4700 v. Chr. und 20 000 n. Chr. kleinster Abstand 2,8 AE (Jahr 9734), Perihelargument fest bei 113,7°.
- `thema-bahnelemente.md`, „Oskulierende, mittlere und angepasste Elemente" und „Im Modell": Horizons-Tabelle des Pluto-Schwerpunkts 2000 bis 2030 (heliozentrisch $a$ 39,230 bis 39,860 AE, baryzentrisch 39,487 bis 39,489 AE usw.); Pluto nutzt oskulierende SBDB-Elemente zu JD 2457588,5, Ortsabweichung gegen DE441 2000 um 0,05°, 2050 um 0,13°, 1900 um 0,15°, 1800 um 1,4°, mittlere Bewegung 0,44 % unter der baryzentrischen; Neptun aus der JPL-Tafel 1800–2050, Kepler-Umlaufzeit 0,06 % länger als $360^\circ/\dot{L}$, mit den Massen der inneren Planeten −0,006 %; Neptun- und Plutomonde nutzen oskulierende Horizons-Elemente zu J2000 gegen den Äquator des Mutterkörpers, Triton und Charon präzedieren nicht.
- `thema-bezugssysteme.md`: Die Näherungstafeln der Planeten haben nominelle Fehler in heliozentrischer Länge von 10″ bei Neptun (1800 bis 2050); die Kartenmitte liegt bei Pluto und Charon 173° neben $Q$, $W_0$ geht nicht ein; für Zwergplaneten und deren Monde gilt der positive Pol nach der Rechte-Hand-Regel.
- `thema-photometrie.md`: schwächste mittlere Oppositionshelligkeit der Planeten Neptun mit 7,71 (Mallama und Hilton 2018); Helligkeitsanstieg Neptuns 1980 bis 2000 als offene Frage, bis 2005 gestiegen, bis etwa 2012 gleich, danach abnehmend; Belichtung: jedes Ziel gleich hell, Neptun erhält am 17. September 2026 nur 1/883 der Bestrahlung der Erde und erscheint mit der Erde im Ziel 261-mal zu hell („Schaubild"), 115-mal („Realistisch"); das Materialmodell erreicht ohne Glanz und Fülllicht nur $0{,}640\,p$.
- `objekt-sun.md`, „Im Modell": In „Schaubild" erscheint die Sonne in der Szene „Von Neptun zur fernen Sonne" 1,2° groß statt 64″.
- `thema-finsternis.md`: gegenseitige Bedeckungen und Verfinsterungen von Pluto und Charon 1985 bis 1990 (Proudfoot et al. 2026) mit erster grober Karte, Methan auf Pluto, Wassereis auf Charon, ersten Radien und mittlerer Dichte von rund $2\,\mathrm{g}\,\mathrm{cm}^{-3}$ (Stern et al. 2018a); `MAX_OKKLUDER` 4.
- `thema-ringe.md`: Neptuns Ringe von Voyager 2 1989 bestätigt, Adams-Ring mit Bögen, 42:43-Korotationsresonanz mit Galatea vorgeschlagen, radiale Welle mit rund 30 km Amplitude (Porco 1991), Haltemechanismus seither umstritten; im Modell erscheint Neptun ohne Ringe.
- `thema-entstehung.md`: Neptun anfangs bei etwa 20 bis 25 AE, möglicher fünfter Eisriese, Instabilität bei etwa 27,7 AE (Nesvorný 2018; Nesvorný und Morbidelli 2012); Einfang Plutos in 3:2; Zahlen dort nachlesen, nicht neu herleiten.
- `objekt-uranus.md`: Uranus' Radius übertrifft den Neptuns um rund 3 %, seine Masse bleibt gut 15 % unter dessen Wert; Anteil schwerer Elemente in der Hülle bei Uranus rund 8 %, bei Neptun bis zu 65 %; Farbunterschied durch mehr Dunst über Uranus (Irwin et al. 2022).
- `objekt-saturn.md`: säkulare Spin-Bahn-Resonanz mit der Knotenwanderung von Neptuns Bahn als eine Erklärung für Saturns Schiefe.

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/<datei>` und `src/data/texte/en/hochschule/<datei>` mit der Belegliste `docs/belege/hochschule/<datei>` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder die Crossref-API, arXiv, ADS, PMC), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Kommentare im Code sind kein Beleg; rechne Aussagen über das Modell am Code selbst nach (Skripte nur im Scratchpad). Es gibt nur diese eine Prüfrunde: Konzentriere dich auf Fehler, die die Aussage falsch machen, und auf Belege, die die Aussage nicht stützen; Stil und Umfang nur, wenn sie das Verständnis behindern. Prüfe:
> 1. Stützt die zitierte Arbeit die Aussage im Text?
> 2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle?
> 3. Passen Aussagen über Orrery zum Code (`src/data/`, `src/sim/`, `src/render/`, `src/ui/info/datenzeilen.ts`), und erklärt „Im Modell" beziehungsweise „Modellgrenzen" jede Abweichung, auch gegenüber dem Datenblock?
> 4. Stimmen Dimensionen und Größenordnungen der Formeln?
> 5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?
> 6. Sind Streitfragen als solche dargestellt, mit Belegen für beide Seiten?
> 7. Widerspricht der Text einem fachgeprüften Hochschultext (`src/data/texte/de/hochschule/`) in Zahlen oder Aussagen über das Modell?
> 8. Enthält der Text oder die Belegliste Prozesssprache (Task, Ruling, Brief) oder interne Kurzverweise, die in einem veröffentlichten Text nichts verloren haben?
> 9. Behauptet ein Verweissatz (`objekt:`, `thema:`, `szene:`) etwas, das der Zieltext nicht enthält? Hat das Ziel noch keinen Hochschultext, gilt der Gymnasialtext als Zieltext.
>
> **Trage je Zeile der Belegliste in der Spalte „Prüfung" tatsächlich in die Datei ein** (mit dem Edit-Werkzeug, sobald die Zeile fertig ist): `ok (…)`, `Fehler: …` oder `Hinweis: …`; jede Tabellenzeile behält sechs Zellen mit der Nummer in Zelle 1, senkrechte Striche im Eintrag als `\|` maskieren. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte, keinen Code, keinen anderen Teil der Belegliste; kein Commit, kein Browser, keine Subagenten. Schreibe die Befundliste fortlaufend nach `<Befunddatei>` (Klasse Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich, Widerspruch zu einem fachgeprüften Text, Prozesssprache, Verweissatz ohne Deckung; Hinweis: Ton, Vollständigkeit, besserer Beleg; je Befund Fundstelle Datei:Zeile beider Fassungen und ein konkreter Behebungsvorschlag), am Ende eine Zählung ok/Fehler/Hinweis. Rückgabe höchstens 12 Zeilen: Zählung ok/Fehler/Hinweis, Fehler als Einzeiler, Bestätigung, dass die Prüfspalte in der Datei steht, Pfad der Befunddatei.

---

### Task 2: Körper `neptune`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-neptune.md`, `src/data/texte/en/hochschule/objekt-neptune.md`, `docs/belege/hochschule/objekt-neptune.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts` (`fuer` ergänzen, falls eine weitere Karte zitiert wird)

**Schnittstellen:**
- Konsumiert: fachgeprüfte Texte `objekt-uranus` (Aufbau eines Eisriesentexts, Vergleichszahlen Uranus–Neptun), `thema-achsneigung` (28,318°), `thema-resonanzen` (Pluto in 3:2), `thema-ringe` (Neptunringe, Galatea), `thema-photometrie` (7,71 mag, Helligkeitsanstieg, Belichtung), `thema-bahnelemente` (Kepler-Umlaufzeit +0,06 %), `thema-bezugssysteme` (10″), `thema-entstehung` (Auswanderung), `objekt-sun` (1,2° statt 64″).
- Produziert: Hochschultext `objekt:neptune`; Task 3 übernimmt $GM$, $J_2$, Pol und Rotationsperiode Neptuns, Task 6 die Rotations-, Pol- und Beleuchtungszahlen und die Sonnenansicht aus Neptuns Abstand.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Neptun` / `# Neptune`. Gliederung Körper; `## Oberfläche` entfällt (Gasplanet), die übrigen sieben Abschnitte in der festen Reihenfolge. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** als Tabelle mit Wert, Unsicherheit, Verfahren, Beleg: $GM$ des Systems und des Planeten (Jacobson 2009 aus Voyager-Tracking und Tritons Bahn; gegen $G \times$ Katalogmasse $1{,}02409 \cdot 10^{26}$ kg mit ppm-Abweichung nachrechnen), Äquator- und Polradius bei 1 bar (rund 24 764 und 24 341 km, Abplattung rund 0,017 — an der Quelle prüfen) gegen den Katalogwert 24 622 km (volumengleicher Kugelradius laut NSSDC — Herkunft prüfen), $J_2$ und $J_4$ (Jacobson 2009), Rotationsperiode: Voyager-Radioperiode 16,11 h (Warwick et al. 1989) gegen Wolkenmerkmale und die Periode aus dem Südpolmerkmal (Karkoschka 2011, rund 15,9663 h — Zahl und Unsicherheit an der Quelle prüfen) und die Periode aus der Form (Helled et al. 2010), Pol (Archinal et al. 2018), geometrische und Bond-Albedo, Energiebilanz (Pearl und Conrath 1991: Abstrahlung rund 2,6-mal die aufgenommene Sonnenleistung — an der Quelle prüfen). **Inneres:** Eisriese, Vergleich mit Uranus (Zahlen wie `objekt-uranus`), Modelle mit Schichten gegen Übergänge (Nettelmann et al. 2013, Helled et al. 2020, Neuenschwander und Helled 2022, Movshovitz und Fortney 2022), innere Wärme als Unterschied zu Uranus, Dynamo in dünner Schale (Stanley und Bloxham 2004). **Atmosphäre und Magnetosphäre:** Zusammensetzung (H₂, He, CH₄ — Lindal 1992 oder Nachfolger), Temperaturprofil, stärkste gemessene Winde im Sonnensystem (bis rund 400 m/s gegenläufig am Äquator; Sromovsky et al. 1993 oder Nachfolger), Großer Dunkler Fleck 1989 und seine Nachfolger (Hubble; Wong et al. 2018 oder Simon et al. 2019 — prüfen), Farbunterschied zu Uranus (Irwin et al. 2022, Zahlen wie `objekt-uranus`), Wolkenschwund 2019 bis 2023 und Zusammenhang mit dem Sonnenzyklus (Chavez et al. 2023, `chavez-2023`), Magnetfeld nach Voyager 2: Dipol um rund 47° gegen die Drehachse gekippt und um rund 0,55 Radien versetzt (Ness et al. 1989 — Zahlen an der Quelle prüfen), Polarlichter (JWST-Nachweis 2025 nur mit belastbarer Quelle). **Bahn, Rotation und Dynamik:** Elemente der JPL-Tafel, Umlaufzeit 164,8 Jahre, Entdeckung 1846 aus Bahnstörungen des Uranus (Le Verrier, Galle; ein belastbarer historischer Beleg oder weglassen), erster voller Umlauf seit der Entdeckung 2011, Schiefe 28,3° und Jahreszeiten (Südsommer-Sonnenwende 2005 wie `thema-photometrie`), Pluto und die Plutinos in 3:2 (Verweis `thema:resonanzen`, Zahlen von dort), Ringe als Kurzfassung (Verweis `thema:ringe`), Mondsystem als Überblick (Triton rückläufig, Nereid stark exzentrisch, Proteus; Verweise `objekt:triton`, `szene:triton-rueckwaerts`). **Entstehung und Entwicklung:** Auswanderung im Nizza-Modell (Verweis `thema:entstehung`, Zahlen von dort), Einfang Tritons und seine Folgen für das ursprüngliche Mondsystem (Agnor und Hamilton 2006; Details in Task 3, hier kurz), Missionsstudien (Decadal Survey 2022 priorisiert Uranus; Neptun-Odyssey oder Trident nur mit belastbarer Quelle).
- `## Offene Fragen` (Pflicht): Rotationsperiode des Inneren (16,11 h gegen 15,97 h und Formbestimmung); warum Neptun viel mehr innere Wärme abgibt als Uranus; innerer Aufbau (Schichten gegen Übergänge, Gesteins- und Eisanteil); Ursache der Wolkenschwankungen (Sonnenzyklus gegen Jahreszeiten); Stabilität der Ringbögen (Verweis `thema:ringe`).
- `## Im Modell`: `radiusKm` 24 622 als volumengleicher Kugelradius, keine Abplattung (Äquatorradius um rund 0,6 % größer — selbst rechnen); `rotationPeriodH` 16,11 (Voyager-Radioperiode; Abweichung gegen Karkoschka 2011 in Minuten je Umdrehung und in Umdrehungen seit J2000 selbst rechnen); Pol 299,3337° / 42,9504° mit dem periodischen Glied des IAU-Berichts bei T = 0 ausgewertet und dann fest (selbst prüfen, was der rohe konstante Wert 299,36° / 43,46° für die Achsneigung ergäbe); Datenblock-Achsneigung 28,318° (wie `thema-achsneigung`); Albedo 0,442 (geometrisch, NSSDC); Elemente aus der JPL-Tafel 1800–2050 mit linearen Raten, Kepler-Umlaufzeit gegen $360^\circ/\dot{L}$ (Zahlen wie `thema-bahnelemente`); keine Ringe, keine Atmosphäre, kein Magnetfeld, keine Wolken im Renderer; von den bekannten Neptunmonden (Zahl an der Quelle prüfen) nur Triton im Katalog; Belichtung (Zahlen wie `thema-photometrie`); Textur (Herkunft und Lizenz aus `ASSETS.md`); Maßstab (`sizeScale`); Datenblockwerte gegen Messwerte (Umlaufzeit, Rotation, Achsneigung, Albedo, Masse, Radius).
- Code lesen: `src/data/bodies/neptune.ts` (vollständig), `src/data/bodies/neptun-monde.ts` (Kopfkommentar), `src/sim/orbit.ts` (`achsneigungDeg`, `rotationAt`, `umlaufzeitTage`), `src/sim/frames.ts` (`poleVector`), `src/sim/scale.ts`, `src/render/exposure.ts`, `src/render/albedo.ts`, `src/render/shadows.ts` (`waehleOkkluder`, `MAX_OKKLUDER`), `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Neptun-Textur), Hochschultexte `objekt-uranus`, `thema-achsneigung`, `thema-resonanzen`, `thema-ringe`, `thema-photometrie`, `thema-bahnelemente`, `thema-entstehung`, `objekt-sun`.
- Verweise: `objekt:uranus`, `objekt:triton`, `objekt:pluto`, `objekt:sun`, `thema:achsneigung`, `thema:resonanzen`, `thema:ringe`, `thema:photometrie`, `thema:innerer-aufbau`, `thema:bahnelemente`, `thema:bezugssysteme`, `thema:entstehung`, `thema:modell`, `szene:triton-rueckwaerts`, `szene:ferne-sonne`; Karten zu `objekt:neptune`: `quelle:nssdc-neptune`, `quelle:nasa-neptune`, `quelle:nasa-voyager-2`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Jacobson 2009, Bahnen der Neptunmonde und Schwerefeld (*Astronomical Journal* 137, 4322); Stone und Miner 1989, Voyager 2 bei Neptun (*Science* 246, 1417); Smith et al. 1989, Bildergebnisse (*Science* 246, 1422); Warwick et al. 1989, Radioastronomie und Rotationsperiode (*Science* 246, 1498); Ness et al. 1989, Magnetfeld (*Science* 246, 1473); Lindal 1992, Atmosphäre aus Radio-Okkultation (*Astronomical Journal* 103, 967); Pearl und Conrath 1991, Energiebilanz (*Journal of Geophysical Research* 96, 18921); Sromovsky et al. 1993, Winde (*Icarus* 105, 140); Karkoschka 2011, Rotationsperiode aus Südpolmerkmalen (*Icarus* 215, 439); Helled, Anderson und Schubert 2010, Rotationsperioden aus Formen (*Icarus* 210, 446); Wong et al. 2018, dunkler Fleck (*Astronomical Journal* 155, 117); Chavez et al. 2023 (`chavez-2023`); Irwin et al. 2022 (`irwin-2022`); Helled et al. 2020 (`helled-2020`); Nettelmann et al. 2013 (`nettelmann-2013`); Neuenschwander und Helled 2022 (`neuenschwander-2022`); Movshovitz und Fortney 2022 (`movshovitz-2022`); Stanley und Bloxham 2004 (`stanley-2004`); Mallama und Hilton 2018 (`mallama-2018`); Porco 1991 (`porco-1991`); Agnor und Hamilton 2006 (*Nature* 441, 192); Archinal et al. 2018 (`archinal-2018`); National Academies 2022 (`national-academies-2022`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; GM-Abweichung, Abplattung, Rotationsabweichung gegen Karkoschka 2011, Achsneigung mit rohem und korrigiertem Pol und Kepler-Umlaufzeit im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4803); Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-neptune.md src/data/texte/en/hochschule/objekt-neptune.md docs/belege/hochschule/objekt-neptune.md src/data/literatur.ts
git commit -m "Hochschultext Neptun mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 3: Körper `triton`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-triton.md`, `src/data/texte/en/hochschule/objekt-triton.md`, `docs/belege/hochschule/objekt-triton.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 2 ($GM$, $J_2$, Pol und Rotationsperiode Neptuns); fachgeprüfte Texte `thema-gebundene-rotation` (Triton-Tabellenzeile, Libration ±21,4°/±2,1°, IAU-Polreihe), `thema-achsneigung` (fester Pol trotz Reihe), `thema-bahnelemente` (Triton präzediert nicht), `thema-gezeiten` (Gezeitenentwicklung, Roche-Grenze), `objekt-titan` und `objekt-ganymede` (Aufbau eines Texts über einen großen Eismond).
- Produziert: Hochschultext `objekt:triton`; Task 6 übernimmt Bahnneigung, Umlaufzeit, Bahnradius in Neptunradien, Einfangszenario und Zerfallszeit.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Triton` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** als Tabelle: Radius (1353,4 km; Herkunft aus Voyager-Bildern prüfen), Masse beziehungsweise $GM$ (Jacobson 2009) und mittlere Dichte (rund 2,06 g/cm³ — selbst rechnen), geometrische Albedo (0,72 NSSDC gegen Literaturwerte), Oberflächentemperatur (rund 38 K) und Bodendruck mit Zeitreihe (Voyager 1989 rund 14 µbar, Sternbedeckungen bis 2022 — etwa Oliver et al. 2022 oder Sicardy et al. 2024, prüfen). **Inneres:** differenzierter Körper mit hohem Gesteinsanteil, möglicher Ozean durch Gezeitenwärme aus Schiefe (Nimmo und Spencer 2015) und radiogene Wärme (Hussmann et al. 2006, `hussmann-2006`), Stand als offene Frage. **Oberfläche:** Stickstoff-, Methan-, CO- und CO₂-Eis (Cruikshank et al. 1993 oder Quirico et al. 1999 — prüfen), „Cantaloupe"-Gelände, junge Oberfläche mit wenigen Kratern und Altersschätzungen (Schenk und Zahnle 2007 — prüfen), Geysire der Südpolkappe (Soderblom et al. 1990) mit solarer gegen endogene Deutung, Kryovulkanismus. **Atmosphäre und Magnetosphäre:** dünne N₂-Atmosphäre mit Dunst, Druckanstieg seit 1989 und jahreszeitliche Deutung, Ionosphäre (Tyler et al. 1989), Lage in Neptuns Magnetosphäre, induziertes Feld als Ozean-Test (Missionsstudien, nur mit Quelle). **Bahn, Rotation und Dynamik:** rückläufige, fast kreisförmige Bahn, $i = 156{,}83^\circ$ gegen Neptuns Äquator im Datensatz (Horizons zu J2000; Literaturwert rund 157° gegen die Laplace-Ebene — Bezugsebene nennen), Umlaufzeit 5,877 Tage, gebundene Rotation (Verweis `thema:gebundene-rotation`, Zahlen von dort), Knotenpräzession um Neptuns Pol mit rund 688 Jahren (an der Quelle prüfen) und ihre Folge für die Jahreszeiten, Gezeitenzerfall nach innen bis zur Roche-Grenze in rund 3,6 Milliarden Jahren (Chyba et al. 1989 — prüfen; Verweis `thema:gezeiten`). **Entstehung und Entwicklung:** Einfang eines Kuipergürtelobjekts, insbesondere durch Austausch in einem Doppelsystem (Agnor und Hamilton 2006), Zirkularisierung durch Gezeiten und Aufheizung (Goldreich et al. 1989 oder Correia 2009 — prüfen), Folgen für die ursprünglichen Neptunmonde und Nereid (Ćuk und Gladman 2005 oder Rufu und Canup 2017 — prüfen), Verwandtschaft mit Pluto (Verweis `objekt:pluto`).
- `## Offene Fragen` (Pflicht): Ozean ja oder nein und wie dick; Antrieb der Geysire (solar oder endogen); Alter der Oberfläche; Einfangmechanismus (Doppelsystem gegen Gaswiderstand oder Kollision); Ursache des Druckanstiegs seit 1989 und ob er inzwischen umkehrt.
- `## Im Modell`: Bahn aus oskulierenden Horizons-Elementen zu J2000 gegen Neptuns Äquator, keine Präzession (Zahlen wie `thema-bahnelemente`); `rotationPeriodH` −141,04786 (negativ, Herkunft aus dem Datensatz-Kommentar nur als Hinweis, Wert selbst gegen die Umlaufzeit prüfen); Pol 299,36° / 41,17° fest, nur die konstanten Glieder der IAU-Reihe (Zahlen und Libration wie `thema-gebundene-rotation`); Datenblock-Achsneigung selbst mit `achsneigungDeg` nachrechnen (negative Periode, 180°-Klappung) und gegen den geometrischen Winkel Pol–Bahnnormale stellen; Albedo 0,72; keine Atmosphäre, keine Geysire, Textur (Herkunft und Lizenz aus `ASSETS.md`); Triton als Schattenwerfer auf Neptun (`waehleOkkluder`, `MAX_OKKLUDER` 4 — nachrechnen, ob Triton im Neptunsystem immer ausgewählt ist); Maßstab (`sizeScale`, Mondabstände skalieren mit); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/neptun-monde.ts` (vollständig mit Quellenblock), `src/data/bodies/neptune.ts`, `src/sim/orbit.ts` (`positionAt`, `achsneigungDeg`, `rotationAt`, `umlaufzeitTage`), `src/sim/frames.ts` (`poleVector`, Bezug `parentEquator`), `src/sim/scale.ts`, `src/render/shadows.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Triton-Textur), `src/data/scenes.ts` (Eintrag `triton-rueckwaerts` mit Kommentaren), Hochschultexte `thema-gebundene-rotation`, `thema-achsneigung`, `thema-bahnelemente`, `thema-gezeiten`, `objekt-titan`, `objekt-ganymede`.
- Verweise: `objekt:neptune`, `objekt:pluto`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:achsneigung`, `thema:bahnelemente`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:modell`, `szene:triton-rueckwaerts`; Karten zu `objekt:triton`: `quelle:jpl-satelliten`, `quelle:nasa-triton`, `quelle:nasa-voyager-2`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Agnor und Hamilton 2006, Einfang durch Austausch in einem Doppelsystem (*Nature* 441, 192); Jacobson 2009 (siehe Task 2); Smith et al. 1989 (siehe Task 2); Soderblom et al. 1990, Geysire (*Science* 250, 410); Tyler et al. 1989, Radiowissenschaft (*Science* 246, 1466); Chyba, Jankowski und Nicholson 1989, Gezeitenentwicklung (*Astronomy and Astrophysics* 219, L23); Goldreich et al. 1989, Einfang und Aufheizung (*Science* 245, 500); Correia 2009, säkulare Entwicklung eines rückläufigen Mondes (*Astrophysical Journal Letters* 704, L1); Nimmo und Spencer 2015, Gezeitenwärme aus Schiefe (*Icarus* 246, 2); Hussmann et al. 2006 (`hussmann-2006`); Schenk und Zahnle 2007, Kraterzählung und Alter (*Icarus* 192, 135); Cruikshank et al. 1993, Eise (*Science* 261, 742); Ćuk und Gladman 2005 oder Rufu und Canup 2017, Folgen des Einfangs für das Mondsystem (*Astrophysical Journal Letters* 626, L113; *Astronomical Journal* 154, 208); Oliver et al. 2022 oder Sicardy et al. 2024, Atmosphärendruck aus Sternbedeckungen (prüfen); Schenk et al. 2021, Topographie (*Remote Sensing* 13, 3476); Archinal et al. 2011 (`archinal-2011`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Achsneigung im Datenblock, Winkel Pol–Bahnnormale, Umlaufzeit, Bahnradius in Neptunradien und Okkluder-Auswahl im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4825); Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-triton.md src/data/texte/en/hochschule/objekt-triton.md docs/belege/hochschule/objekt-triton.md src/data/literatur.ts
git commit -m "Hochschultext Triton mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 4: Körper `pluto`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-pluto.md`, `src/data/texte/en/hochschule/objekt-pluto.md`, `docs/belege/hochschule/objekt-pluto.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 3 (Triton als verwandter Körper aus dem Kuipergürtel, Stickstoffeis); fachgeprüfte Texte `thema-resonanzen` (3:2 mit Neptun samt Modellzahlen), `thema-bahnelemente` (SBDB-Elemente, Horizons-Tabelle), `thema-achsneigung` (119,614°, chaotische Schiefe), `thema-gebundene-rotation` und `thema-gezeiten` (doppelt gebunden, 153,29335 h), `thema-finsternis` (gegenseitige Ereignisse 1985–1990), `thema-bezugssysteme` (Polkonvention der Zwergplaneten, 173°), `thema-entstehung` (Einfang in 3:2).
- Produziert: Hochschultext `objekt:pluto`; Task 5 übernimmt Masse, Radius, Schwerpunktlage und Einschlagszenario, Task 7 die Beleuchtungsrichtung, Schwerpunktlage und Jahreszeiten.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Pluto` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: **Kenngrößen** als Tabelle: Radius 1188,3 ± 1,6 km aus New-Horizons-Bildern (Nimmo et al. 2017), $GM$ von Pluto und Charon aus Bahnbestimmung (Brozović et al. 2015 oder Nachfolger — prüfen), mittlere Dichte (rund 1,85 g/cm³ — selbst rechnen), geometrische Albedo und ihre Spannweite über die Oberfläche (Buratti et al. 2017 — prüfen), Oberflächentemperatur, Bodendruck mit Zeitreihe (rund 10 µbar zur Zeit des Vorbeiflugs; Sternbedeckungen 1988 bis in die 2020er, etwa Sicardy et al. 2024 oder Young et al. — prüfen). **Inneres:** differenziert, Gestein-Eis-Verhältnis aus der Dichte, möglicher Ozean mit Belegen aus Sputnik Planitias Lage und Ausdehnungstektonik (Nimmo et al. 2016; Hamilton et al. 2016; Keane et al. 2016), Clathratschicht als Isolator (Kamata et al. 2019), Gegenposition ohne Ozean oder mit anderer Deutung (beide Seiten belegen). **Oberfläche:** Sputnik Planitia als stickstoffgefülltes Becken mit Konvektionszellen (McKinnon et al. 2016), Gletscher, Wassereis-Berge, Methan-Schneekappen, Cthulhu Macula als dunkles Tholin-Gebiet, Kryovulkanismus bei Wright Mons (Singer et al. 2022 — prüfen), Oberflächenalter aus Kraterzählungen (Moore et al. 2016; Singer et al. 2019 zum Mangel kleiner Krater — prüfen). **Atmosphäre und Magnetosphäre:** N₂ mit CH₄ und CO, Dunstschichten (Gladstone et al. 2016), Atmosphärenentweichen niedriger als vorhergesagt, jahreszeitliche Druckänderungen und die Frage des Kollapses, keine Magnetosphäre, Wechselwirkung mit dem Sonnenwind (McComas et al. 2016 — prüfen). **Bahn, Rotation und Dynamik:** Bahn mit $e \approx 0{,}25$ und $i \approx 17^\circ$ (Horizons-Tabelle wie `thema-bahnelemente`), Perihel 1989, 3:2-Resonanz mit Neptun und Libration des Perihelarguments (Verweis `thema:resonanzen`, Zahlen von dort), Schiefe rund 120° und ihre Jahreszeiten (Verweis `thema:achsneigung`), doppelt gebundene Rotation mit Charon (Verweis `thema:gebundene-rotation`), Schwerpunkt außerhalb Plutos (selbst rechnen: Abstand von Plutos Mitte in km und in Plutoradien aus Charons Bahnradius und dem Massenverhältnis des Datensatzes), die vier kleinen Monde Nix, Hydra, Kerberos, Styx und ihre chaotische Rotation (Showalter und Hamilton 2015, `showalter-2015`), Entdeckung 1930 und Neueinstufung als Zwergplanet 2006 (IAU-Resolutionen B5/B6, als Körperschaft zitieren; die Debatte um geophysikalische Planetendefinitionen nur als Streitfrage mit Beleg).
- **Entstehung und Entwicklung:** Entstehung im Kuipergürtel, Einfang in 3:2 durch Neptuns Auswanderung (Verweis `thema:entstehung`, Malhotra 1993, `malhotra-1993`), Entstehung von Charon durch einen Einschlag (Canup 2005) oder „kiss and capture" (Denton et al. 2025 — prüfen), Folgen für Wärmehaushalt und Ozean, Vergleich mit Triton (Verweis `objekt:triton`).
- `## Offene Fragen` (Pflicht): Ozean heute ja oder nein; Ursprung von Sputnik Planitia (Einschlag gegen Auflast) und Neuorientierung des Körpers; Kryovulkanismus und Alter von Wright Mons; Atmosphärenkollaps im Plutowinter; Entstehungsszenario für Charon; Einstufung als Planet oder Zwergplanet, sofern Fachliteratur tatsächlich streitet.
- `## Im Modell`: Pluto als heliozentrischer Zwergplanet (`kind: 'dwarf'`) mit oskulierenden SBDB-Elementen zu JD 2457588,5, alle Raten außer $\dot{L}$ null (Zahlen wie `thema-bahnelemente`); **Pluto im Ursprung seines Systems, Charon läuft um Pluto statt beide um den gemeinsamen Schwerpunkt** — Versatz selbst beziffern (Prüfschwerpunkt 1) und sagen, dass die heliozentrische Bahn im Datensatz die des Schwerpunkts ist, Pluto also um diesen Versatz falsch steht; `rotationPeriodH` +153,29335 bei Pol 132,993° / −6,163° (positiver Pol nach Rechte-Hand-Regel, Rückläufigkeit in der Pollage; Zahlen wie `thema-bezugssysteme`); Datenblock-Achsneigung 119,614° (wie `thema-achsneigung`); Winkel Kartenmitte–Charon 131,1° (wie `thema-gebundene-rotation`); Resonanzwinkel und Mindestabstände zu Neptun im Modell (Zahlen wie `thema-resonanzen`); Nix, Hydra, Kerberos und Styx fehlen; keine Atmosphäre, keine jahreszeitlichen Änderungen, Textur (Herkunft und Lizenz aus `ASSETS.md`); Albedo 0,52 (NSSDC) gegen die Spannweite der Oberfläche; Maßstab; Datenblockwerte gegen Messwerte. Kommentare in `pluto-system.ts` enthielten schon in 4d-1 Fehler: Werte nur aus Code und Rechnung übernehmen.
- Code lesen: `src/data/bodies/pluto-system.ts` (vollständig mit Quellenblöcken), `src/data/bodies/neptune.ts`, `src/sim/orbit.ts` (`positionAt`, `achsneigungDeg`, `rotationAt`, `umlaufzeitTage`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/exposure.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Pluto-Textur), `src/data/scenes.ts` (Eintrag `pluto-charon` mit Kommentaren), Hochschultexte `thema-resonanzen`, `thema-bahnelemente`, `thema-achsneigung`, `thema-gebundene-rotation`, `thema-gezeiten`, `thema-finsternis`, `thema-bezugssysteme`, `thema-entstehung`, `objekt-titan`.
- Verweise: `objekt:charon`, `objekt:neptune`, `objekt:triton`, `objekt:eris`, `thema:resonanzen`, `thema:achsneigung`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:finsternis`, `thema:bahnelemente`, `thema:bezugssysteme`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:zwergplaneten`, `thema:modell`, `szene:pluto-charon`; Karten zu `objekt:pluto`: `quelle:nssdc-pluto`, `quelle:nasa-pluto`, `quelle:nasa-kuiperguertel`, `quelle:nasa-new-horizons`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Stern et al. 2015, erste New-Horizons-Ergebnisse (*Science* 350, aad1815); Stern et al. 2018a (`stern-2018a`), Übersicht nach New Horizons; Nimmo et al. 2017, Radius (*Icarus* 287, 12); Brozović et al. 2015, Bahnen und Massen der Plutomonde (*Icarus* 246, 317); Nimmo et al. 2016, Neuorientierung und Ozean (*Nature* 540, 94); Keane et al. 2016 (*Nature* 540, 90); Hamilton et al. 2016 (*Nature* 540, 97); McKinnon et al. 2016, Konvektion in Sputnik Planitia (*Nature* 534, 82); Moore et al. 2016, Geologie (*Science* 351, 1284); Gladstone et al. 2016, Atmosphäre (*Science* 351, aad8866); Kamata et al. 2019, Clathrate (*Nature Geoscience* 12, 407); Bierson, Nimmo und Stern 2020, heiße Entstehung (*Nature Geoscience* 13, 468); Singer et al. 2022, Kryovulkanismus (*Nature Communications* 13, 1542); Singer et al. 2019, kleine Krater (*Science* 363, 955); Buratti et al. 2017, Albedo (*Icarus* 287, 207); McComas et al. 2016, Sonnenwind (*Journal of Geophysical Research: Space Physics* 121, 4232); Canup 2005, Einschlagsentstehung Charons (*Science* 307, 546); Denton et al. 2025, „kiss and capture" (*Nature Geoscience*, prüfen); Sicardy et al. 2024 oder Young et al. 2021, Druckzeitreihe (prüfen); Malhotra 1993 (`malhotra-1993`); Showalter und Hamilton 2015 (`showalter-2015`); Dobrovolskis und Harris 1983 (`dobrovolskis-1983`); Cheng et al. 2014 (`cheng-2014`); Proudfoot et al. 2026 (`proudfoot-2026`); IAU 2006, Resolutionen B5 und B6 (Körperschaft); Metzger et al. 2022, Planetendefinition (*Icarus* 374, 114768 — prüfen).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Schwerpunktabstand, Achsneigung, Winkel Kartenmitte–Charon und Resonanzwinkel zur Epoche im Scratchpad nachrechnen (die letzten drei gegen die fachgeprüften Werte).
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4847); Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-pluto.md src/data/texte/en/hochschule/objekt-pluto.md docs/belege/hochschule/objekt-pluto.md src/data/literatur.ts
git commit -m "Hochschultext Pluto mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 5: Körper `charon`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-charon.md`, `src/data/texte/en/hochschule/objekt-charon.md`, `docs/belege/hochschule/objekt-charon.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 4 (Masse, Radius und Dichte Plutos, Schwerpunktlage, Entstehungsszenarien, Modellarchitektur); fachgeprüfte Texte `thema-gebundene-rotation` (Charon-Tabellenzeile, 48,9°, Cheng et al. 2014), `thema-gezeiten`, `thema-finsternis` (Wassereis auf Charon aus den gegenseitigen Ereignissen), `objekt-rhea` und `objekt-titania` (Aufbau eines Texts über einen mittelgroßen Eismond).
- Produziert: Hochschultext `objekt:charon`; Task 7 übernimmt Bahnradius, Umlaufzeit, Größenverhältnis und die rote Polkappe.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Charon` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1000 bis 2000 Wörter je Fassung (Obergrenze 2667).
- Inhalt mindestens: **Kenngrößen** als Tabelle: Radius 606 km aus New-Horizons-Bildern (Nimmo et al. 2017, Wert und Unsicherheit prüfen), Masse beziehungsweise $GM$ (Brozović et al. 2015), Dichte (rund 1,70 g/cm³ — selbst rechnen), Massenverhältnis zu Pluto (rund 0,12 — selbst rechnen) als größtes Verhältnis von Mond zu Hauptkörper unter Planeten und Zwergplaneten (an der Quelle prüfen), Albedo. **Inneres:** differenziert, einstiger Ozean und sein Gefrieren als Ursache der Ausdehnungstektonik (Beyer et al. 2017; Desch und Neveu 2017 — prüfen), heute kein flüssiges Wasser erwartet. **Oberfläche:** Wassereis mit Ammoniakhydraten (Cook et al. 2007 oder Dalle Ore et al. 2018 — prüfen), Serenity Chasma und das Gürtelsystem der Nordhalbkugel gegen die glatteren Ebenen von Vulcan Planitia, Kryovulkanismus in Vulcan Planitia, Kraterzählungen, rote Nordpolkappe Mordor Macula aus Methan, das von Plutos Atmosphäre entweicht, im Polarwinter gefriert und photolysiert wird (Grundy et al. 2016). **Atmosphäre und Magnetosphäre:** keine nachweisbare Atmosphäre (Obergrenze aus Sternbedeckung oder New-Horizons-UV — prüfen), keine Magnetosphäre, Lage im Sonnenwind. **Bahn, Rotation und Dynamik:** Bahnradius rund 19 596 km (Datensatz) gegen Literaturwert, Umlaufzeit 6,387 Tage, nahezu kreisförmig, doppelt gebunden (Verweis `thema:gebundene-rotation`, Zahlen von dort), Bahnebene gleich Plutos Äquator, Schwerpunkt außerhalb Plutos (Zahl aus Task 4), gegenseitige Ereignisse 1985–1990 (Verweis `thema:finsternis`, Zahlen von dort) und künftige Ereignisse (Proudfoot et al. 2026, `proudfoot-2026`). **Entstehung und Entwicklung:** Einschlag mit teilweise intaktem Mond (Canup 2005 oder Canup 2011 — prüfen) gegen „kiss and capture" (Denton et al. 2025 — prüfen), Gezeitenentwicklung bis zur doppelten Bindung (Cheng et al. 2014, `cheng-2014`), Verbindung zu den kleinen Monden.
- `## Offene Fragen` (Pflicht): Entstehungsszenario (Einschlag gegen „kiss and capture"); wann der Ozean gefror und ob Reste bleiben; Herkunft der Ammoniakhydrate und Alter von Vulcan Planitia; Dauer und Weg der Gezeitenentwicklung (Abhängigkeit vom Gezeitenmodell wie in `thema-gebundene-rotation`).
- `## Im Modell`: Charon als Mond mit `parent: 'pluto'` und oskulierenden Horizons-Elementen zu J2000 gegen Plutos Äquator, keine Präzession (Zahlen wie `thema-bahnelemente`); Pluto im Ursprung, Charon um Pluto (Schwerpunkt fehlt, Versatz wie Task 4); dieselbe Polrichtung und Rotationsperiode wie Pluto (Zahlen wie `thema-gebundene-rotation`); Datenblock-Achsneigung selbst mit `achsneigungDeg` nachrechnen und erklären; Winkel Kartenmitte–Pluto 48,9°; Umlaufzeit im Datenblock (Kepler aus $a$ und $G(M+m)$) gegen $360^\circ/\dot{L}$ und die Rotationsperiode; Albedo 0,42; Polkappe nur über die Textur (Herkunft aus `ASSETS.md` prüfen); Charon als Schattenwerfer auf Pluto und umgekehrt (`waehleOkkluder` — nachrechnen); Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/pluto-system.ts` (vollständig), `src/sim/orbit.ts` (`positionAt`, `achsneigungDeg`, `rotationAt`, `umlaufzeitTage`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/ui/info/datenzeilen.ts`, `ASSETS.md` (Charon-Textur), Hochschultexte `objekt-pluto` (aus Task 4), `thema-gebundene-rotation`, `thema-gezeiten`, `thema-finsternis`, `objekt-rhea`, `objekt-titania`.
- Verweise: `objekt:pluto`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:finsternis`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:modell`, `szene:pluto-charon`; Karten zu `objekt:charon`: `quelle:jpl-satelliten`, `quelle:nasa-pluto`, `quelle:nasa-new-horizons`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Stern et al. 2015 (siehe Task 4); Nimmo et al. 2017 (siehe Task 4); Brozović et al. 2015 (siehe Task 4); Grundy et al. 2016, rote Polkappe (*Nature* 539, 65); Beyer et al. 2017, Tektonik (*Icarus* 287, 161); Desch und Neveu 2017, Ozean und Kryovulkanismus (*Icarus* 287, 175); Moore et al. 2016 (siehe Task 4); Cook et al. 2007, Ammoniakhydrate (*Astrophysical Journal* 663, 1406); Dalle Ore et al. 2018, Ammoniak (*Icarus* 300, 21); Spencer et al. 2021, Buchkapitel über Charon in „The Pluto System After New Horizons" (University of Arizona Press, DOI prüfen); Canup 2005 (siehe Task 4); Canup 2011, Einschlag mit intaktem Mond (*Astronomical Journal* 141, 35); Denton et al. 2025 (siehe Task 4); Cheng et al. 2014 (`cheng-2014`); Proudfoot et al. 2026 (`proudfoot-2026`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Dichte, Massenverhältnis, Bahnradius in Plutoradien, Achsneigung im Datenblock, Umlaufzeit gegen Rotationsperiode und Okkluder-Auswahl im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4869); Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-charon.md src/data/texte/en/hochschule/objekt-charon.md docs/belege/hochschule/objekt-charon.md src/data/literatur.ts
git commit -m "Hochschultext Charon mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 6: Szenen `triton-rueckwaerts` und `ferne-sonne`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-triton-rueckwaerts.md`, `src/data/texte/en/hochschule/szene-triton-rueckwaerts.md`, `docs/belege/hochschule/szene-triton-rueckwaerts.md`, `src/data/texte/de/hochschule/szene-ferne-sonne.md`, `src/data/texte/en/hochschule/szene-ferne-sonne.md`, `docs/belege/hochschule/szene-ferne-sonne.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 2 (Neptuns Rotationsperiode, Pol, Albedo, Abstand zur Sonne), Task 3 (Tritons Bahnneigung, Umlaufzeit, Bahnradius, Einfang, Zerfallszeit); fachgeprüfte Texte `objekt-sun` (Sonne in `ferne-sonne` 1,2° statt 64″), `thema-photometrie` (Belichtung, Bestrahlung 1/883), `szene-uranus-gekippt`, `szene-iapetus-schief` (Aufbau eines Szenentexts mit Kamerageometrie).
- Produziert: Hochschultexte `szene:triton-rueckwaerts` und `szene:ferne-sonne`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Tritons rückläufige Bahn` / `# Scene: Triton's retrograde orbit` und `# Szene: Von Neptun zur fernen Sonne` / `# Scene: From Neptune to the distant Sun` (Titel aus `ui/i18n`, wie die Gymnasialfassungen). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung, Obergrenze 1200.
- Beide Szenen in **einem** Task mit **zwei** Beleglisten und **zwei** Fachprüfungen (je Szene eine, parallel zulässig) und **einer** gemeinsamen Nacharbeit (Ruling 6). Zwei Commits beim Erstellen (je Szene einer), ein gemeinsamer Nacharbeits-Commit.
- **`triton-rueckwaerts`, Was das Bild zeigt:** Eintrag Index 14: Bahntyp `orbit`, `targetId` `neptune`, `distanceBasis` `bodyRadius`, `distanceInRadii` 45, `elevationDeg` 45 mit Versatz [−15, 15] → 30–60°, `azimuthDeg` 123,92 mit Versatz [−20, 20], `azimuthRateDegPerSec` 1, `durationSec` 35, `timeRateDaysPerSec` 0,4, `distanceFactor` [0,8, 1,5] — nachrechnen (Addition der Versätze in `src/sim/director.ts` selbst prüfen): Kameraabstand in km und in Neptunradien bei Faktor 0,8/1/1,5, Tritons Bahnradius in Neptunradien (Datensatz) und sein Winkeldurchmesser gegen das Sichtfeld (`KAMERA_FOV_GRAD` 50° in `render/renderer.ts`), wie viele Umläufe Triton in 35 s × 0,4 d/s = 14 Tagen zurücklegt, warum die Bahn als Ellipse erscheint (Neigung der Bahnebene gegen die Blickrichtung bei Elevation 30–60°), wie man die rückläufige Richtung im Bild erkennt (Umlaufsinn gegen Neptuns Drehsinn und gegen den Kameraumlauf mit 1°/s), Beleuchtung aus der Herleitung des Azimuts 123,92° im `scenes.ts`-Kommentar (selbst nachrechnen, nicht übernehmen), Mondbahnen skalieren mit `sizeScale`.
- **`triton-rueckwaerts`, Hintergrund:** rückläufige Bahn und was sie über die Herkunft sagt (Verweis `objekt:triton`, Zahlen von dort), Gezeitenzerfall nach innen (Zahlen aus Task 3), Knotenpräzession, Vergleich mit anderen rückläufigen Monden (äußere unregelmäßige Monde der Riesenplaneten — nur mit Beleg), Voyager 2 1989 als einzige Nahbeobachtung.
- **`triton-rueckwaerts`, Modellgrenzen:** Bahn fest ohne Knotenpräzession, fester Pol, Kugel ohne Abplattung, keine Ringe und keine anderen Neptunmonde, Belichtung auf Neptun (`src/render/exposure.ts`), Maßstab; Verweis `thema:modell`.
- **`ferne-sonne`, Was das Bild zeigt:** Eintrag Index 3: Bahntyp `static`, `targetId` `neptune`, `lookAtId` `sun`, `distanceBasis` `bodyRadius`, `distanceInRadii` 12, `elevationDeg` 15, `azimuthDeg` 120, `azimuthRateDegPerSec` 0, `durationSec` 30, `timeRateDaysPerSec` 0,5, Variation `azimuthDeg` [−40, 40], `elevationDeg` [−10, 25], `distanceFactor` [0,9, 1,5] — nachrechnen (Addition der Versätze selbst prüfen): Kameraabstand in km, wo Neptun im Bild steht, wenn die Kamera auf die Sonne blickt (Winkel zwischen Blickrichtung und Richtung zu Neptun gegen das halbe Sichtfeld), scheinbarer Sonnendurchmesser wirklich (rund 64″ bei 30 AE) und dargestellt (1,2° in „Schaubild", wie `objekt-sun`; für „Realistisch" und „Kompakt" selbst rechnen), Beleuchtungsstärke in 30 AE (rund 1/900 der Erde; Wert zum Datum wie `thema-photometrie`), scheinbare Helligkeit der Sonne von Neptun aus (rund −19 mag, selbst rechnen) gegen den Vollmond von der Erde aus, Rotationen Neptuns in 30 s × 0,5 d/s = 15 Tagen, wie weit Neptun in 15 Tagen auf seiner Bahn wandert.
- **`ferne-sonne`, Hintergrund:** Energie- und Lichtbilanz in 30 AE (Zahlen aus Task 2), Tag auf Neptun gegen Sonnenlicht, Voyager-Blick zurück („Family Portrait" 1990 von Voyager 1 — nur mit Beleg), Heliosphäre und Termination Shock jenseits von Neptun (Stone et al. 2013 oder 2019, `stone-2019` — prüfen, ob die Aussage passt).
- **`ferne-sonne`, Modellgrenzen:** Sonne vergrößert (Zahlen wie `objekt-sun`), Belichtung auf Neptun statt realistisch dunkel (Zahlen wie `thema-photometrie`), keine Streuung und kein Blendeffekt jenseits von `render/postfx.ts` (Bloom — selbst prüfen), Sternhintergrund ohne echte Helligkeiten (selbst prüfen), Maßstab und gestauchter Abstand (`sim/scale.ts`); Verweis `thema:modell`.
- Code lesen: `src/data/scenes.ts` (beide Einträge mit allen Kommentaren), `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/neptune.ts`, `src/data/bodies/neptun-monde.ts`, `src/data/bodies/sun.ts`, `src/sim/orbit.ts` (`positionAt`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/exposure.ts`, `src/render/postfx.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`), Hochschultexte `objekt-neptune`, `objekt-triton` (aus Task 2 und 3), `objekt-sun`, `thema-photometrie`, `szene-uranus-gekippt`, `szene-iapetus-schief`.
- Verweise `triton-rueckwaerts`: `objekt:triton`, `objekt:neptune`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:bahnelemente`, `thema:modell`, `szene:ferne-sonne`. Verweise `ferne-sonne`: `objekt:neptune`, `objekt:sun`, `thema:photometrie`, `thema:modell`, `szene:triton-rueckwaerts`.
- Karten: `triton-rueckwaerts`: `quelle:nssdc-neptune`, `quelle:nasa-triton`, `quelle:nasa-voyager-2`, `quelle:jpl-satelliten-bahnen`; `ferne-sonne`: `quelle:nssdc-sun`, `quelle:nssdc-neptune`, `quelle:nasa-voyager-2`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Agnor und Hamilton 2006 und Jacobson 2009 (aus Task 2 und 3, dann bereits im Katalog); Stone und Miner 1989 (aus Task 2); Stone et al. 2019 (`stone-2019`); Mallama und Hilton 2018 (`mallama-2018`) für die scheinbare Helligkeit; Kopp und Lean 2011, Sonnenkonstante (*Geophysical Research Letters* 38, L01706) für die Bestrahlung in 1 AE.
- Neue Testfälle: 4 Dateien × 11 = 44.

- [ ] **Schritt 1:** Vorlage und Code lesen; für beide Szenen Kameraabstände, Winkelgrößen gegen das Sichtfeld, Umläufe und Rotationen im Zeitfenster, Beleuchtungsrichtung, Sonnengröße und -helligkeit im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, zwei Beleglisten, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutsche Texte, englische Fassungen.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4913); Wortzahlen.
- [ ] **Schritt 5: Commits**

```bash
git add src/data/texte/de/hochschule/szene-triton-rueckwaerts.md src/data/texte/en/hochschule/szene-triton-rueckwaerts.md docs/belege/hochschule/szene-triton-rueckwaerts.md src/data/literatur.ts
git commit -m "Hochschultext Szene Tritons rückläufige Bahn mit Belegliste"
git add src/data/texte/de/hochschule/szene-ferne-sonne.md src/data/texte/en/hochschule/szene-ferne-sonne.md docs/belege/hochschule/szene-ferne-sonne.md src/data/literatur.ts
git commit -m "Hochschultext Szene Von Neptun zur fernen Sonne mit Belegliste"
```

- [ ] **Schritt 6:** Zwei Fachprüfungen und eine gemeinsame Nacharbeit.

---

### Task 7: Szene `pluto-charon`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-pluto-charon.md`, `src/data/texte/en/hochschule/szene-pluto-charon.md`, `docs/belege/hochschule/szene-pluto-charon.md`
- Ändern: `src/data/literatur.ts`; ggf. `src/data/quellen.ts`

**Schnittstellen:**
- Konsumiert: Task 4 (Schwerpunktlage, Pol, Schiefe, Jahreszeiten, Entstehung), Task 5 (Bahnradius, Umlaufzeit, Größenverhältnis, rote Polkappe); fachgeprüfte Texte `thema-gebundene-rotation` (doppelt gebunden, 131,1°/48,9°), `thema-finsternis` (gegenseitige Ereignisse), `szene-galileisches-schattenspiel` (Aufbau eines Szenentexts mit Mondbahnen und Schatten).
- Produziert: Hochschultext `szene:pluto-charon`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Pluto und Charon im Doppel` / `# Scene: Pluto and Charon, a double world`. Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung, Obergrenze 1200.
- **Was das Bild zeigt:** Eintrag Index 9: Bahntyp `orbit`, `targetId` `pluto`, `distanceBasis` `bodyRadius`, `distanceInRadii` 55, `elevationDeg` 20 mit Versatz [−10, 10] → 10–30°, `azimuthDeg` 70,5 mit Versatz [−20, 20], `azimuthRateDegPerSec` 1,5, `durationSec` 45, `timeRateDaysPerSec` 0,3, `distanceFactor` [0,8, 1,5] — nachrechnen: Kameraabstand in km bei Faktor 0,8/1/1,5, Charons Bahnradius in Plutoradien (Datensatz) und sein Winkeldurchmesser gegen das Sichtfeld, Umläufe Charons in 45 s × 0,3 d/s = 13,5 Tagen, Kameradrift 67,5° in 45 s, dass sich beide Körper gleich schnell drehen und einander dieselbe Seite zeigen (im Bild an den Texturen erkennbar), Beleuchtung aus der Herleitung des Azimuts 70,5° im `scenes.ts`-Kommentar (Sonnenelevation −11,17°, Phasenwinkel selbst nachrechnen), mögliche Schatten von Charon auf Pluto und umgekehrt zum Datum (`waehleOkkluder`; Jahreszeiten der gegenseitigen Ereignisse aus Task 5).
- **Hintergrund:** doppelt gebundenes System (Verweis `thema:gebundene-rotation`), Schwerpunkt außerhalb Plutos (Zahl aus Task 4), Entstehung durch Einschlag oder „kiss and capture" (Zahlen und Belege aus Task 4 und 5), Charons rote Polkappe aus Plutos Methan (aus Task 5), gegenseitige Ereignisse 1985–1990 (Verweis `thema:finsternis`), New Horizons 2015 als einzige Nahbeobachtung.
- **Modellgrenzen:** Pluto im Ursprung statt um den Schwerpunkt pendelnd (Versatz in km und als Winkel bei Kameraabstand 55 Plutoradien selbst rechnen, damit klar wird, ob man ihn im Bild sähe; Prüfschwerpunkt 1), die vier kleinen Monde fehlen, keine Atmosphäre und kein Dunst, Belichtung auf Pluto (`src/render/exposure.ts`; wirkliche Bestrahlung in rund 34 AE zum Datum selbst rechnen), feste Pole, keine Gezeitenentwicklung, Maßstab; Verweis `thema:modell`.
- Code lesen: `src/data/scenes.ts` (Eintrag mit allen Kommentaren, rund Z. 250–302), `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/pluto-system.ts`, `src/sim/orbit.ts` (`positionAt`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/exposure.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`), Hochschultexte `objekt-pluto`, `objekt-charon` (aus Task 4 und 5), `thema-gebundene-rotation`, `thema-finsternis`, `szene-galileisches-schattenspiel`.
- Verweise: `objekt:pluto`, `objekt:charon`, `thema:gebundene-rotation`, `thema:gezeiten`, `thema:finsternis`, `thema:modell`.
- Karten zu `szene:pluto-charon`: `quelle:nssdc-pluto`, `quelle:nasa-pluto`, `quelle:nasa-new-horizons`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Stern et al. 2015 und Brozović et al. 2015 (aus Task 4, dann im Katalog); Cheng et al. 2014 (`cheng-2014`); Proudfoot et al. 2026 (`proudfoot-2026`); Grundy et al. 2016 (aus Task 5).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen; Kameraabstand, Winkelgrößen gegen das Sichtfeld, Umläufe im Zeitfenster, Beleuchtung und Phasenwinkel, Schwerpunktversatz als Winkel und Okkluder-Auswahl im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test` (Soll 4935); Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-pluto-charon.md src/data/texte/en/hochschule/szene-pluto-charon.md docs/belege/hochschule/szene-pluto-charon.md src/data/literatur.ts
git commit -m "Hochschultext Szene Pluto und Charon im Doppel mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 8: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe9-abnahme.md`
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

Expected: Lint ohne Befund; alle Tests grün (Soll 4935 nach „Testzahlen" oben, zuzüglich Tests aus Zwischen-Tasks); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, Ausgangsstand 1 415,10 kB nach 4d-8); Prüfskript über den ganzen Katalog mit 0 Fehlern und ohne 429, Laufzeit notieren (Ausgangsstand 737 s bei 628 Einträgen). Ein transienter Netzfehler wird mit `--nur <kennung>` nachgeprüft und so ins Protokoll geschrieben (Ruling 22). Schlusszeilen, die Katalogzahl (Ausgangsstand 628) und die Ausgabe des Prüfskripts ins Protokoll wie in der Abnahme 4d-8 §3; jede Warnung begründen (bekannt: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` und `sanchez-lavega-2011` Konsortial-Byline).

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

Kombinationen: Sprachen `de`, `en` × die sieben Kennungen (`neptune`, `triton`, `pluto`, `charon`, `triton-rueckwaerts`, `ferne-sonne`, `pluto-charon`). Zustand setzen wie in der Abnahme 4d-8: Körper über `setInfo({ thema: null })` und `setCamera({ targetId: '<id>', mode: 'free' })`; die Szenen über `setCinema({ running: true, shuffle: false, nummer: <14|3|9> })`, `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setTime({ paused: true })`, `setUi({ hidden: false })`. Beim Wechsel von einer Szene zurück zu einem Körper zuerst `setInfo({ thema: null })` setzen; Store-Updates nach einem Kino-Stopp brauchen 200 ms vor der DOM-Messung. Auf den Kopfwechsel pollen (Titel wie in der ersten Zeile des Texts), Hinweise erst nach dem Auflösen des faulen Imports werten:

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

Je Sprache drei Messungen (Ruling 20): (a) Fachthema `resonanzen` öffnen (`setInfo({ thema: 'resonanzen' })`), den Verweis `a[data-verweis="objekt:pluto"]` im Abschnitt „Neptun und Pluto" / „Neptune and Pluto" klicken (DE Z. 91, EN Z. 89), auf den Kopf „Pluto" pollen, dann: keine Hinweiszeile im Textbereich. (b) Fachthema `finsternis` öffnen, den Verweis `a[data-verweis="objekt:charon"]` klicken (DE Z. 221, EN Z. 214), auf den Kopf „Charon" pollen, keine Hinweiszeile. (c) Hochschultext `objekt:sun` öffnen (`setInfo({ thema: null })`, `setCamera({ targetId: 'sun', mode: 'free' })`), den Verweis `a[data-verweis="szene:ferne-sonne"]` klicken (Abschnitt „Im Modell", DE Z. 372, EN Z. 357), nach dem Kinostart stabilisieren (200 ms nach dem Store-Update), Kino anhalten, auf den Kopf „Szene: Von Neptun zur fernen Sonne" / „Scene: From Neptune to the distant Sun" pollen, keine Hinweiszeile. Sechs Messungen, Ergebnis mit Wartezeit in ms ins Protokoll. Zeilennummern vor der Messung mit `grep -n` bestätigen.

- [ ] **Schritt 5: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 6: Protokoll `docs/phase4d-etappe9-abnahme.md`**

Gliederung wie `docs/phase4d-etappe8-abnahme.md`:

```md
# Abnahme Phase 4d Etappe 9 „Neptun, Pluto"

## 1. Umfang
## 2. Lint, Tests, Build
(Testzahl als durchgehende Tabelle Task → Zuwachs → Summe; Hauptchunk gegen 1 415,10 kB; Katalog gegen 628, je Task aus `git diff` nachgezählt, nicht aus den Berichten übernommen)
## 3. Prüfskript
## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
(dazu eine Zeile für Task 1: geänderte Stellen, keine Fachprüfung)
## 5. Sichtprüfung
### 5.1 Rundgang
### 5.2 Ersatz entfällt
### 5.3 Konsole
## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:", einschließlich der Rulings, die der Controller nach Task 8 setzt)
## 7. Bekannte Unschärfen
(Befunde am Simulationscode als Kandidaten für eigene Tasks; Restbefunde der Fachprüfungen; Quellen hinter Verlagssperren je Text)
## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer; gemeldete Fehler in Gymnasialtexten; Modelle und Kontingente; die Plan-Rulings als Themenliste)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, jede Summe nachgerechnet, Katalogzuwächse am `git diff` gezählt, Wortzahlen per `wc -w` nachgezählt. Die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung nennen, ohne Suchmuster.

- [ ] **Schritt 7: README**

In `README.md` im Absatz zu Phase 4d den Satzteil

```md
Etappe 8
Uranus, Miranda, Ariel, Umbriel, Titania, Oberon, das Thema „Achsneigung" und
die Szene „Der liegende Uranus". Offen sind die übrigen Hochschultexte
(Etappen 4d-9 bis 4d-11) und Phase 5
```

ersetzen durch:

```md
Etappe 8
Uranus, Miranda, Ariel, Umbriel, Titania, Oberon, das Thema „Achsneigung" und
die Szene „Der liegende Uranus"; Etappe 9 Neptun, Triton, Pluto, Charon und die
Szenen „Tritons rückläufige Bahn", „Von Neptun zur fernen Sonne" und „Pluto und
Charon im Doppel". Offen sind die übrigen Hochschultexte (Etappen 4d-10 und
4d-11) und Phase 5
```

Danach die Zeilenumbrüche des Absatzes glätten (Zeilen bis rund 80 Zeichen), ohne den Wortlaut zu ändern.

- [ ] **Schritt 8: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe9-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm.

```bash
git add docs/phase4d-etappe9-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 9: Neptun und Pluto"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe; Paket ohne die fachgeprüften Texte und Beleglisten, mit dem Diff von Task 1, Katalogeinträgen, etwaigen `quellen.ts`-Änderungen und Protokoll; sie ist zugleich die Task-Prüfung der Abnahme); Befunde gebündelt in **einer** Nacharbeit, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-9` nach `master`, Branch löschen; Diff auf Zugangsdaten prüfen; **Push erst nach dem Ja von Jens** (Ruling 14).
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Befunde am Simulationscode als Kandidaten. Etappe 4d-10 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- Modelle nach Weisung von Jens: Umsetzer der Text-Tasks, Task 1, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell (sonnet); rein mechanische Aufträge (README, Formfixes, Katalogfelder, Nacharbeit nach der Schlussprüfung) auf dem kleinsten (haiku). Das stärkste Modell nur nach zweimaligem Scheitern an derselben Stelle. Bei einem Kontingentlimit auf haiku ausweichen und in §8 vermerken.
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace `.superpowers/sdd/2026-09-22-phase4d-hochschule-etappe9/`.
- Fachprüfer laufen parallel zum nächsten Umsetzer; Nacharbeiten und Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`. Ein Umsetzer bekommt den Hinweis, welche fremde Belegliste gerade im Arbeitsbaum geändert sein kann, und die ausdrückliche Anweisung, die Prüfspalte der eigenen Belegliste leer zu lassen.
- Jeder Umsetzer bekommt die Gemeinsamen Vorgaben, seinen Task und die Globalen Randbedingungen wörtlich (als Dateien); die Modellzahlen aus Task 2 (Neptun: $GM$, Pol, Rotation, Albedo, Bestrahlung), Task 3 (Triton: Bahnneigung, Umlaufzeit, Bahnradius, Einfang, Zerfallszeit), Task 4 (Pluto: Schwerpunktversatz, Dichte, Druckzeitreihe, Entstehungsszenarien) und Task 5 (Charon: Bahnradius, Massenverhältnis, Polkappe) gibt der Controller aus den Berichten an die Folgetasks weiter, insbesondere an Task 6 und Task 7.
- Eine Prüfrunde je Hochschultext: Nach der Nacharbeit keine weitere Prüfung beauftragen; Zweifel gehen ins Protokoll §8. Prüfaufträge verlangen ausdrücklich das Schreiben der Prüfspalte in die Datei und enthalten alle neun Prüfpunkte.
- Beleglisten-Nacharbeit nur mit Zellenkontrolle (Zelle 1 die Nummer, Zelle 2 die Aussage, sechs Zellen je Zeile) — Ruling 18; vor jedem Nacharbeits-Commit an einer Belegliste ein Skript im Scratchpad gegenprüfen lassen.
- Websuche-Kontingent: Recherche notfalls per WebFetch (Crossref-API, doi.org, arXiv, ADS, PMC). Ein Umsetzer, der nicht mehr suchen kann, meldet das im Bericht, zitiert nur Geöffnetes und nennt die Stellen, die die Fachprüfung an der Quelle nachholen soll. Viele Neptun- und Pluto-Arbeiten liegen hinter Verlagssperren (Science, Nature, Icarus); die Zusammenfassung genügt, das Protokoll zählt sie in §7.
- Zahlen in Berichten nachrechnen (frühere Etappen zeigten Zähl- und Kopierfehler bei Katalogzuwachs und Wortzahlen); Wortzahlen per `wc -w` selbst zählen, Katalogzuwachs je Commit am Diff.
- Commit-Texte mit Anführungszeichen per `git commit -F` aus einer Datei (Lehre aus 4d-7).
- Task 1 ändert fachgeprüfte Aussagen nicht, nur Gymnasial- und Grundschultexte; der Controller prüft den Diff gegen die Tabelle in Task 1 und gegen die Hochschultexte, bevor Task 2 startet.

## Rulings

Entscheidungen der Planung (22.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** Jens' Entscheidungen zur Abnahme 4d-8 („push und Vorschläge freigegeben", 22.09.2026; die vier Gymnasialbefunde „vor oder mit Etappe 4d-9") und sein „mach weiter" vom 22.09.2026 gelten als Freigabe für Etappe 4d-9 samt dem Nachführungs-Task 1.
2. **Ruling:** Modelle wie in 4d-4 bis 4d-8 (Weisung von Jens): mittleres Modell für Texte, Task 1, Prüfer, Abnahme und Schlussprüfung, kleinstes für Mechanik; bei Kontingentlimit kleinstes mit Vermerk in §8.
3. **Ruling:** Höchstens eine Prüfrunde je Hochschultext (Regel von Jens): Fachprüfung, eine Nacharbeit, Schluss; keine Nachprüfung; in der Nacharbeit wird nicht gekürzt.
4. **Ruling:** Richtwerte dieser Etappe: Neptun und Pluto als große Körper 1500 bis 3500 Wörter (Entwurf §5.2); **Triton ebenfalls 1500 bis 3500**, weil er mit Geysiren, Einfanggeschichte, Ozeanfrage und Atmosphärenzeitreihe mehr Fachstoff trägt als ein kleiner Mond (wie Enceladus in 4d-6, Ruling 19); **Charon 1000 bis 2000** (Obergrenze 2667) wie die mittleren Saturnmonde in 4d-7, weil New Horizons Tektonik, Polkappe und Entstehungsfrage liefert, aber kein Schwerefeld je Körper und nur eine Halbkugel in hoher Auflösung; Szenen 300 bis 900. Kosten bei Fehlurteil: ein Text, den Jens kürzen oder erweitern lässt.
5. **Ruling:** Reihenfolge Task 1 (Nachführung, unabhängig und klein) → Neptun → Triton → Pluto → Charon → Szenen `triton-rueckwaerts` und `ferne-sonne` → Szene `pluto-charon`: Neptun liefert Systemzahlen an Triton und die Neptun-Szenen; Triton liefert die Einfanggeschichte, auf die Pluto als verwandter Kuipergürtelkörper verweist; Pluto liefert die Architektur des Doppelsystems und den Schwerpunktversatz an Charon; die Szenen übernehmen alles.
6. **Ruling:** Die beiden auf Neptun zielenden Szenen laufen gemeinsam in Task 6 (dieselben Code-Grundlagen, beide kurz), mit zwei Beleglisten, zwei Fachprüfungen und einer gemeinsamen Nacharbeit (wie die Szenenpaare in 4d-6); `pluto-charon` läuft allein in Task 7, weil sie Task 4 und 5 braucht.
7. **Ruling:** Datensatz-Befunde werden in 4d-9 nicht behoben (wie 4d-3 bis 4d-8): Pluto im Ursprung seines Systems statt um den Schwerpunkt, Charon um Pluto; Plutos Bahn als SBDB-Momentaufnahme ohne Raten; Triton und Charon ohne Präzession; Tritons fester Pol trotz IAU-Reihe; Neptuns Pol mit bei T = 0 ausgewertetem periodischem Glied und dann fest; `rotationPeriodH` 16,11 h (Voyager) gegen Wolken- und Formbestimmungen; Neptun ohne Abplattung und Ringe; fehlende kleine Monde (Nereid, Proteus und weitere, Nix, Hydra, Kerberos, Styx); Kommentarfehler in `pluto-system.ts` (Befund aus 4d-1). Die Texte beschreiben den Ist-Code; neue Befunde gehen ins Ledger und ins Protokoll §7.
8. **Ruling:** Modellzahlen aus fachgeprüften Texten (`thema-achsneigung`, `thema-gebundene-rotation`, `thema-gezeiten`, `thema-resonanzen`, `thema-bahnelemente`, `thema-bezugssysteme`, `thema-photometrie`, `thema-finsternis`, `thema-ringe`, `thema-entstehung`, `objekt-sun`, `objekt-uranus`, `objekt-saturn`) übernehmen die neuen Texte gleichlautend; Abweichungen der eigenen Nachrechnung gehen an Jens (§8), der fachgeprüfte Text wird nicht geändert.
9. **Ruling:** Kein eigener Verweis-Task: Alle sieben Kennungen der Text-Tasks haben Gymnasialtexte. Bestehende Verweise fachgeprüfter Texte auf `objekt:neptune` (in `objekt-uranus`, `objekt-saturn`, `thema-achsneigung`, `thema-resonanzen`, `thema-ringe`), `objekt:pluto` (in `thema-achsneigung`, `thema-bahnelemente`, `thema-gebundene-rotation`, `thema-gezeiten`, `thema-resonanzen`, `szene-jupiter-vorbeiflug`), `objekt:charon` (in `thema-finsternis`, `thema-gebundene-rotation`, `thema-gezeiten`), `szene:pluto-charon` (in `thema-gebundene-rotation`) und `szene:ferne-sonne` (in `objekt-sun`) führen danach auf die neuen Hochschultexte und werden nicht nachträglich geändert. `objekt:triton` und `szene:triton-rueckwaerts` haben noch keinen eingehenden Verweis aus einem Hochschultext; ältere fachgeprüfte Texte werden nicht rückwirkend verlinkt.
10. **Ruling:** Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); große Zahlen in Formeln ohne Trennzeichen; Zahlenspannen nennen, wofür sie gelten.
11. **Ruling:** Die Fachprüfung behält die neun Prüfpunkte aus 4d-8; Prüfpunkt 9 gilt bei Zielen ohne Hochschultext (`thema:zwergplaneten`, `thema:modell`, `objekt:eris` und die übrigen Zwergplaneten) gegen den Gymnasialtext.
12. **Ruling:** Eine Sichtprüfung des Formelsatzes entfällt, solange kein neuer TeX-Befehl dazukommt.
13. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle; wächst der Chunk gegenüber 1 415,10 kB um mehr als 50 kB, geht die Frage des faulen Ladens an Jens.
14. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master`; der Push folgt erst nach dem Ja von Jens. Jens gibt danach 4d-10 frei.
15. **Ruling:** Wortzahl-Obergrenze ein Drittel über dem Richtwert (Neptun, Triton und Pluto 4667, Charon 2667, Szenen 1200); Straffung vor dem Commit, nie in der Nacharbeit; Richtigkeit vor Wortzahl, wenn eine Berichtigung die Grenze überschreitet.
16. **Ruling:** Katalogform wie nach der Schlussprüfung 4d-4, bestätigt in 4d-6 bis 4d-8: beschreibende Zusätze in `erschienen` englisch, Eigennamen original, Vorabdrucke `'arXiv'`, laufend gepflegte Seiten mit Zugriffsjahr, Konsortial-Bylines mit dem Menschen zuerst, Körperschaften (etwa die IAU für die Resolutionen von 2006) als Autor wie `cgpm-2022`.
17. **Ruling:** Quellenkarten aus dem Task sind Angebot, keine Pflicht; ein `quelle:`-Beleg muss die Aussage auf der Seite tragen. Die Karten je Kennung stehen in den Gemeinsamen Vorgaben, Punkt 8; zitiert ein Text eine weitere Karte, ergänzt der Task ihr `fuer`-Feld in `src/data/quellen.ts` um die eigene Kennung.
18. **Ruling:** Beleglisten-Nacharbeit nur mit Zellenkontrolle (Zelle 1 die Nummer, Zelle 2 die Aussage, sechs Zellen je Zeile); vor jedem Nacharbeits-Commit an einer Belegliste ein Skript im Scratchpad gegenprüfen lassen.
19. **Ruling:** Der Task-Prüfung der Abnahme (Task 8) dient die Schlussprüfung; ihr Paket enthält Protokoll, README und den Diff von Task 1 vollständig, ohne die fachgeprüften Texte und Beleglisten (wie in 4d-5 bis 4d-8).
20. **Ruling:** „Ersatz entfällt" (Abnahme Schritt 4) nutzt drei Paare je Sprache: `thema:resonanzen` → `objekt:pluto` (Fließtext, DE Z. 91 / EN Z. 89), `thema:finsternis` → `objekt:charon` (Fließtext, DE Z. 221 / EN Z. 214) und `objekt:sun` → `szene:ferne-sonne` (Liste in „Im Modell", DE Z. 372 / EN Z. 357) — per grep geprüft; damit sind beide Textarten der Etappe (Körper, Szene) als Verweisziel gemessen. Triton und `triton-rueckwaerts` deckt der Rundgang.
21. **Ruling:** Task 1 umfasst die vier Befunde der Abnahme 4d-8 §8 und zusätzlich den Grundschultext Miranda, der denselben Wert „20 Kilometer" samt Mount-Everest-Vergleich trägt (bei der Planung per grep gefunden); der Satz zu Messina Chasma in Titania bleibt, weil „wohl" die Deutung bereits als wahrscheinlich, nicht als sicher kennzeichnet. Keine Fachprüfung für Task 1, der Controller prüft den Diff.
22. **Ruling:** Die Prüfskript-Befunde der Abnahme 4d-8 §7 (`mitWiederholung` fängt keinen `TypeError` eines Netzfehlers, Titelvergleich bei Zeilenumbrüchen um `<sub>`-Tags) werden in dieser Etappe nicht behoben; ein einzelner Netzfehler wird mit `--nur <kennung>` nachgeprüft und so protokolliert. Trifft der Titel-Grenzfall eine Quelle dieser Etappe, wird sie nicht zitiert oder der Fall als Warnung begründet.
23. **Ruling:** Die Rotationsperiode Neptuns bleibt im Datensatz bei 16,11 h (Voyager-Radioperiode); die Texte nennen Wolken- und Formbestimmungen (Karkoschka 2011, Helled et al. 2010) als Messwerte und die Abweichung als Modellgrenze. Ein Datensatzwechsel wäre ein eigener Task nach Jens' Entscheidung (§8).
24. **Ruling:** Plutos Einstufung: Der Text folgt der IAU-Resolution von 2006 (Zwergplanet) und stellt die geophysikalische Gegenposition nur dann als offene Frage dar, wenn sie in begutachteter Fachliteratur vertreten ist; die Einstufung ist keine Messfrage und bekommt keinen eigenen Abschnitt.
