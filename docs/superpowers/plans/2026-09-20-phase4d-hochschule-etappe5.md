# Phase 4d Hochschule, Etappe 5 „Jupitersystem" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Jupiter, Io, Europa, Ganymed und Kallisto sowie die Szenen `jupiter-vorbeiflug` und `galileisches-schattenspiel` haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung (Entwurf §7, Zeile 4d-5, 14 Dateien). Danach **Halt** für die Freigabe von Etappe 4d-6.

**Architektur:** Sieben Text-Tasks, **nicht wörtlich im Plan**: Der Umsetzer liest den Code, recherchiert, schreibt und belegt nach Entwurf §6.4; eine Fachprüfung mit frischem Kontext prüft **einmal**, danach folgt **eine** Nacharbeit (Regel von Jens vom 20.09.2026). Kein Code-Task; die Formfragen aus 4d-4 sind erledigt (Ruling 15, 17). Alle Verweisziele der Etappe haben Gymnasialtexte (Ersatz nach Entwurf §5.5 Punkt 6), deshalb setzt jeder Text-Task seine Verweise selbst. Task 8 ist die Abnahme nach Entwurf §8.2.

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §4.1 (Katalog, mit den Nachträgen 4d-4), §5 (Gestalt der Texte), §6 (Arbeitsweise), §7 Zeile 4d-5, §8.2 (Abnahme). Vorlagen: Plan `docs/superpowers/plans/2026-09-20-phase4d-hochschule-etappe4.md`, Abnahme `docs/phase4d-etappe4-abnahme.md` und die fachgeprüften Hochschultexte unter `src/data/texte/de/hochschule/` samt Beleglisten unter `docs/belege/hochschule/` (Planeten: `objekt-mars.md`, `objekt-venus.md`; große Monde: `objekt-moon.md`; Szenen: `szene-merkurjagd.md`, `szene-phobos-tiefflug.md`, `szene-mondtanz.md`). Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und im Literaturkatalog (Originaltitel; beschreibende Zusätze im Feld `erschienen` englisch, Eigennamen von Verlagen und Einrichtungen original — Entwurf §4.1, Nachtrag 4d-4).
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben). Protokolle, Berichte in versionierten Dateien und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**.
- Branch `hochschule-5` (von `master`), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test) und steht alphabetisch nach Kennung (Test); Vorabdrucke tragen `erschienen: 'arXiv'` (Test); laufend gepflegte Seiten tragen das Zugriffsjahr.
- Keine neue Abhängigkeit in `package.json`. Kein Code außer in etwaigen Zwischen-Tasks für neue TeX-Befehle; Befunde am Simulationscode, die ein Text aufdeckt, beschreibt der Text in „Im Modell" beziehungsweise „Modellgrenzen" und der Bericht meldet sie (Ruling 6).
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben.
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Namen beziehungsweise Titel aus `ui/i18n` (Körper `body.<id>.name`, Szenen „Szene: " / „Scene: " vor `scene.<id>` wie in den Gymnasialfassungen); Körper und Szenen mit den festen `##`-Überschriften aus Entwurf §5.1 in dieser Reihenfolge, Pflichtabschnitte nie weglassen (bei Jupiter entfällt „Oberfläche" nach §5.1 als Gasplanet, Ruling 4); Hochschultexte enden mit `*Stand: September 2026*` beziehungsweise `*As of September 2026*` als eigenem Absatz (Monat und Jahr des Commits); `literatur:` nur in Hochschultexten. Richtwerte ohne Testgrenze (Entwurf §5.2): große Körper 1500 bis 3500 Wörter je Fassung (Jupiter und die vier Galileischen Monde), Szenen 300 bis 900; Richtigkeit geht vor Wortzahl, aber kein Text soll den oberen Richtwert um mehr als ein Drittel überschreiten (4667 beziehungsweise 1200); gestrafft wird vor dem Commit, nie in der Nacharbeit.
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten (in 4d-4 stimmte der Marspol-Kommentar, der Venus-Kommentar nicht so, wie ein Umsetzer ihn las). Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen); Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste. Nacharbeiten warten, bis kein anderer Umsetzer läuft.
- **Höchstens eine Prüfrunde je Text** (Jens, 20.09.2026): ein Umsetzer, eine Fachprüfung, eine Nacharbeit, dann Schluss. Keine Nachprüfung. Was danach offen bleibt, steht im Abnahmeprotokoll (§7, §8).
- Modelle nach Weisung von Jens (20.09.2026): Text-Umsetzer, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell, mechanische Aufträge auf dem kleinsten; das stärkste nur nach zweimaligem Scheitern an derselben Stelle (Ruling ins Ledger).
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-20-phase4d-hochschule-etappe5/progress.md` (git-ignoriert), am Ende gesammelt ins Abnahmeprotokoll.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Körper `jupiter` | 2 Texte, `docs/belege/hochschule/objekt-jupiter.md`, `src/data/literatur.ts` |
| 2 | Szene `jupiter-vorbeiflug` | 2 Texte, `docs/belege/hochschule/szene-jupiter-vorbeiflug.md`, `src/data/literatur.ts` |
| 3 | Körper `io` | 2 Texte, `docs/belege/hochschule/objekt-io.md`, `src/data/literatur.ts` |
| 4 | Körper `europa` | 2 Texte, `docs/belege/hochschule/objekt-europa.md`, `src/data/literatur.ts` |
| 5 | Körper `ganymede` | 2 Texte, `docs/belege/hochschule/objekt-ganymede.md`, `src/data/literatur.ts` |
| 6 | Körper `callisto` | 2 Texte, `docs/belege/hochschule/objekt-callisto.md`, `src/data/literatur.ts` |
| 7 | Szene `galileisches-schattenspiel` | 2 Texte, `docs/belege/hochschule/szene-galileisches-schattenspiel.md`, `src/data/literatur.ts` |
| 8 | Abnahme | `docs/phase4d-etappe5-abnahme.md`, `README.md` |

Texte liegen unter `src/data/texte/<de|en>/hochschule/<art>-<kennung>.md`. Die Kennungen der Monde sind `io`, `europa`, `ganymede`, `callisto` (englisch, wie in `src/data/bodies/jupiter-monde.ts`); die Namen aus `ui/i18n` lauten deutsch Io, Europa, Ganymed, Kallisto.

**Testzahlen:** Ausgangsstand `master` bfedacc (Abnahme 4d-4): 4125 Tests. Im Dateitest `src/data/texte/dateien.test.ts` erzeugt ein Hochschultext eines Körpers oder einer Szene 11 Fälle. Soll: 4125 + 7 × 2 × 11 = **4279**, zuzüglich Tests aus Zwischen-Tasks für neue TeX-Befehle. Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test`. Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

## Gemeinsame Vorgaben für Task 1 bis 7 (Texte)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den fachgeprüften Hochschultexten als Maßstab für Tiefe, Ton und Belegdichte: `objekt-mars.md` und `objekt-venus.md` für Planeten, `objekt-moon.md` für die Galileischen Monde, `szene-merkurjagd.md` und `szene-phobos-tiefflug.md` für Szenen. Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang.

**Ablauf je Task**

1. **Vorlage lesen:** den passenden fachgeprüften Text in beiden Fassungen und seine Belegliste unter `docs/belege/hochschule/` (Form der Belegliste, Abschnitt „Im Modell" beziehungsweise „Modellgrenzen"). Dazu den Gymnasialtext derselben Kennung, damit der Hochschultext ihm nicht widerspricht; findet der Umsetzer im Gymnasialtext einen sachlichen Fehler, meldet er ihn im Bericht (nicht ändern).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (Vite-SSR aus dem Projektverzeichnis oder Node mit Typentfernung, nicht versioniert). Werte des Datenblocks aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten.
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf: zuerst nach neueren Übersichtsartikeln und Missionsergebnissen suchen (Juno bis 2026, JUICE unterwegs, Europa Clipper unterwegs), auch wenn der Stoff bekannt scheint. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, Band, Seite und DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren. Einträge, die schon im Katalog stehen (`src/data/literatur.ts`, 372 Einträge, darunter `iess-2018`, `wahl-2017`, `durante-2020`, `militzer-2022`, `gomez-casajus-2022`, `lainey-2009`, `peale-1979`, `peale-2002`, `yoder-1981`, `goldreich-1966`, `fuller-2016`, `canup-2001`, `archinal-2018`, `mallama-2017`, `murray-2000`), wiederverwenden statt doppelt anlegen; ihr Inhalt wird trotzdem für jede neue Aussage geöffnet.
4. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" leer:

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile — auch eigene Herleitungen (Beleg „Herleitung" mit Rechenweg) und Vergleiche („größter Mond", „schnellster") ; „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" oder „Nachrechnung am Code: <Datei>". Senkrechte Striche in Zellen als `\|` maskieren (jede Zeile hat genau sechs Zellen). Querverweise zwischen Zeilen nach jeder Neunummerierung prüfen. Ein `quelle:`-Beleg muss die Aussage auf der Seite tatsächlich tragen (4d-4: zwei NASA-Karten stützten die Zahlen nicht).
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`; Körperschaften als Autor wie bei `cgpm-2022`; Konsortial-Bylines: der Mensch zuerst, wie die Zeitschrift ihn führt (Crossref nennt dann eine Warnung, kein Fehler). `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer; Vorabdrucke `erschienen: 'arXiv'`; beschreibende Zusätze englisch, Eigennamen original. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test). Kennungen gleicher Erstautoren und Jahre mit Buchstaben unterscheiden.
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen.
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile und Gliederung nach den Globalen Randbedingungen und Entwurf §5.1. Körper: `## Kenngrößen und Messung`, `## Inneres`, `## Oberfläche` (bei Jupiter entfällt der Abschnitt), `## Atmosphäre und Magnetosphäre`, `## Bahn, Rotation und Dynamik`, `## Entstehung und Entwicklung`, `## Offene Fragen`, `## Im Modell` (englisch `Parameters and measurement`, `Interior`, `Surface`, `Atmosphere and magnetosphere`, `Orbit, rotation and dynamics`, `Formation and evolution`, `Open questions`, `In the model`). Szenen: `## Was das Bild zeigt`, `## Hintergrund`, `## Modellgrenzen` (englisch `What the view shows`, `Background`, `Model limitations`).
   - „Im Modell" beziehungsweise „Modellgrenzen": was Orrery zur Kennung rechnet oder bewusst weglässt, mit Verweis `thema:modell`; jede Abweichung des Modells von der Wirklichkeit mit Größenordnung; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung. Nur beschreiben, was der Code zum Zeitpunkt des Tasks tut; Zahlen selbst nachrechnen. Stehen dieselben Modellzahlen schon in einem fachgeprüften Text (siehe unten „Modellzahlen aus fachgeprüften Texten"), dieselben Werte verwenden oder die Abweichung im Bericht begründen (Ruling 7).
   - „Offene Fragen": Streitfragen mit Belegen für beide Seiten, nicht entschieden, solange die Fachwelt es nicht getan hat.
   - Schluss `*Stand: <Monat> 2026*` / `*As of <Month> 2026*` (Monat des Commits).
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit allen Nachträgen): Argumente von `^`, `_`, `\frac` mit mehr als einem Zeichen in `{}`; `\text{…}` ohne verschachtelte Klammern und in beiden Fassungen gleich; Dezimalkomma in deutschen Formeln als `{,}`, in englischen `.`; Funktionsnamen als Befehl. Fehlt ein Befehl, ist das ein eigener Zwischen-Task (Test in `texUebersetzer.test.ts`, eigener Commit), kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen „25 770", Englisch Komma „25,770"), vierstellige Zahlen ohne Trennung. Zahlenspannen sagen, wofür sie gelten; stammen zwei Spannen aus zwei Modellen, stehen beide mit ihrem Modell (4d-4, Phobos-Tiefflug).
   - Kein `$` außerhalb von Formeln (Dateitest); kein `|` am Absatzanfang außer in Tabellen.
8. **Verweise:** `objekt:`, `szene:`, `thema:` auf Kennungen aus `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts`; Ziele ohne Hochschultext sind erlaubt, wenn sie einen Gymnasialtext haben. Hochschultexte gibt es für `sun`, `earth`, `moon`, `mercury`, `venus`, `mars`, `phobos`, `deimos`, die Themen `bahnelemente`, `bezugssysteme`, `entstehung`, `finsternis`, `gebundene-rotation`, `gezeiten`, `innerer-aufbau`, `photometrie`, `resonanzen` und die Szenen `erdaufgang`, `mondfinsternis`, `mondtanz`, `merkurjagd`, `phobos-tiefflug`; dazu die in dieser Etappe vorher fertigen Texte. Höchstens ein Verweis je Ziel je `##`-Abschnitt; kein Verweis eines Texts auf sich selbst. Quellenkarten erscheinen automatisch für alle Kennungen in `fuer` (`src/data/quellen.ts`); ein `quelle:`-Verweis im Text braucht eine Karte zur Kennung des Texts, ist aber keine Pflicht (Ruling 16).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht.
10. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen (Commit-Text im Task). Vorher `git status --short`: keine Reste aus Skripten im Quellbaum; eine vom Prüfer geänderte fremde Belegliste im Arbeitsbaum bleibt liegen und wird nicht mitcommittet.
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten. **Genau eine** Fachprüfung je Text.
12. **Nacharbeit (genau eine):** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise (Aussage ungenau oder missverständlich, Beleg stützt nicht wörtlich, Fassungen weichen im Sinn ab, fehlende Belegzeilen) behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger; in der Nacharbeit wird **nicht gekürzt**. In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung`; alle anderen Prüfeinträge bleiben. **Keine Nachprüfung:** Was der Umsetzer nicht beheben kann oder anders sieht als der Prüfer, notiert er mit Begründung im Ledger; die Abnahme führt es in §7 oder §8 auf.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste <art>-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Modellzahlen aus fachgeprüften Texten (gleichlautend übernehmen, Ruling 7):**
- `thema-resonanzen.md`, „Im Modell": Laplace-Winkel zur Epoche J2000 genau 180,0°, Drift −1,05° je Jahrhundert (17. September 2026: 179,72°); Perijoven von Io und Europa laufen im Datensatz mit 1,33 und 1,46 Jahren **vorwärts** statt rückwärts mit −(n₁ − 2n₂), die Zweikörperwinkel laufen in 243 beziehungsweise 255 Tagen um (Code-Befund seit 4d-2, nicht behoben, Ruling 6).
- `thema-gebundene-rotation.md`, Modelltabelle: Io −0,047 / 162,8° / 163,1°, Europa 0,070 / 31,5° / 31,2°, Ganymed −0,012 / 39,0° / 39,1°, Kallisto 0,055 / 101,2° / 102,5° (Bedeutung der Spalten dort nachlesen).
- `thema-finsternis.md`: Von Jupiter aus hat die Sonne 0,051° Winkelradius; bei 3,1° Achsneigung wirft Io immer, Kallisto zeitweise gar nicht Schatten (9,5° gegen 2,1°); `MAX_OKKLUDER` 4; Schatten von Jupiter und Saturn ohne Kernschattenfarbe.
- `thema-gezeiten.md`, `thema-innerer-aufbau.md`, `thema-photometrie.md`, `thema-entstehung.md`, `thema-bezugssysteme.md`: Zahlen zu Io-Gezeitenheizung, Juno-Schwerefeld und verdünntem Kern, Albedos (Io 0,62, Europa 0,68, Ganymed 0,44, Kallisto 0,19; Jupiter 0,538), Jupiterentstehung und Laplace-Ebene dort nachlesen und gleichlautend verwenden.

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
> Trage je Zeile der Belegliste in „Prüfung" ein: `ok (…)`, `Fehler: …` oder `Hinweis: …`, jeweils sobald die Zeile fertig ist. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte, keinen Code, keinen anderen Teil der Belegliste; kein Commit, kein Browser, keine Subagenten. Schreibe die Befundliste fortlaufend nach `<Befunddatei>` (Klasse Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich, Widerspruch zu einem fachgeprüften Text; Hinweis: Ton, Vollständigkeit, besserer Beleg; je Befund Fundstelle Datei:Zeile beider Fassungen und ein konkreter Behebungsvorschlag). Rückgabe höchstens 12 Zeilen: Zählung ok/Fehler/Hinweis, Fehler als Einzeiler, Pfad der Befunddatei.

---

### Task 1: Körper `jupiter`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-jupiter.md`, `src/data/texte/en/hochschule/objekt-jupiter.md`, `docs/belege/hochschule/objekt-jupiter.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: fachgeprüfte Texte `thema-innerer-aufbau` (Juno, J₂, verdünnter Kern), `thema-entstehung` (Kernakkretion, Grand Tack), `thema-photometrie`, `thema-finsternis` (Schatten der Monde), `thema-bezugssysteme` (Laplace-Ebene).
- Produziert: Hochschultext `objekt:jupiter`; Task 2 bis 7 übernehmen seine Modellzahlen (Radius und Abplattung, Rotation System III, Pol, W₀, Achsneigung 3,12°, GM gegen NSSDC, Okkluderwahl).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Jupiter` in beiden Fassungen. Gliederung Körper **ohne** „Oberfläche" (Gasplanet, Entwurf §5.1, Ruling 4): sieben Abschnitte. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radien (äquatorial 71 492 km, polar, mittlerer), Abplattung, Masse; Schwerefeld aus Juno (J₂, J₄, J₆, ungerade Momente und Tiefe der Windströme), Trägheitsmoment; Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren und Beleg. Inneres: verdünnter Kern, metallischer Wasserstoff, Helium-Regen, Wärmefluss und Entstehungswärme, Zustandsgleichung als Streitfrage; Verweis `thema:innerer-aufbau` statt Wiederholung. Atmosphäre und Magnetosphäre: Zusammensetzung (Wasserhäufigkeit aus Juno-Mikrowellen), Bänder und Zonen, Großer Roter Fleck und seine Schrumpfung, Polarzyklone, Blitze; Magnetfeld (JRM33, Großer Blauer Fleck), Magnetosphäre, Io-Plasmatorus, Polarlichter, Strahlungsgürtel. Bahn, Rotation und Dynamik: Bahnelemente, Rotationssysteme I/II/III und die Definition der Periode über das Magnetfeld, Achsneigung 3,13°, Präzession, Laplace-Ebene der Monde, Trojaner nur als Verweis (`thema:resonanzen`). Entstehung und Entwicklung: Kernakkretion gegen Scheibeninstabilität, Alter des Kerns aus Meteoritenisotopen (Kruijer et al. 2017), Wanderung (Grand Tack, Verweis `thema:entstehung`), Abkühlung und Kontraktion.
- `## Offene Fragen` (Pflicht): etwa Beschaffenheit und Ausdehnung des verdünnten Kerns, Wasserhäufigkeit und Verteilung, Tiefe der Winde, Ursache der Schrumpfung des Roten Flecks — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente der JPL-Tafel linear fortgeschrieben; Kugel mit `radiusKm` 69 911 (welcher Radius ist das? NSSDC-Mittel gegen äquatorial 71 492 km — am Code und an `render/bodies.ts` prüfen, ob eine Abplattung dargestellt wird; falls nein, Größenordnung des Fehlers am Äquator und Pol); Rotation `rotationPeriodH` 9,9250 h = System III (am Code prüfen: starr, kein Zonenwind, Textur dreht als Ganzes; wie weit läuft der Rote Fleck in einem Jahr gegen System III falsch?); Pol aus dem Datensatz gegen den IAU-Wert (Archinal et al. 2018) und Achsneigung nach `achsneigungDeg` (Kommentar behauptet 3,12°); `rotationAtEpochDeg` 0 gegen W₀; Albedo 0,538 als geometrische Albedo (Zahlen wie `thema-photometrie`); kein Ring (an `jupiter.ts` und `render/` prüfen); Schatten: `waehleOkkluder` in `render/shadows.ts` wählt für Jupiter seine Monde (Winkelradius absteigend, höchstens `MAX_OKKLUDER` 4) — welche vier, und werfen Monde Schatten auf Jupiter beziehungsweise Jupiter auf Monde? (Zahlen wie `thema-finsternis`); Datenblockwerte gegen Messwerte; Maßstab (`sizeScale`, `sunDamping` betrifft nur die Sonne).
- Code lesen: `src/data/bodies/jupiter.ts`, `src/data/bodies/jupiter-monde.ts` (Kopfkommentar zur Laplace-Ebene und `parentEquator`), `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/bodies.ts`, `src/render/shadows.ts` (`waehleOkkluder`, `MAX_OKKLUDER`), `src/render/albedo.ts`, `ASSETS.md` (Jupiter-Textur), `src/ui/info/datenzeilen.ts`, Hochschultexte `thema-innerer-aufbau`, `thema-entstehung`, `thema-photometrie`, `thema-finsternis`, `thema-bezugssysteme`.
- Verweise: `objekt:io`, `objekt:europa`, `objekt:ganymede`, `objekt:callisto`, `objekt:saturn`, `objekt:sun`, `objekt:earth`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:resonanzen`, `thema:gezeiten`, `thema:finsternis`, `thema:photometrie`, `thema:bezugssysteme`, `thema:bahnelemente`, `szene:jupiter-vorbeiflug`, `szene:galileisches-schattenspiel`, `thema:modell`; Karten zu `objekt:jupiter`: `quelle:nssdc-jupiter`, `quelle:nasa-jupiter`, `quelle:nasa-juno`, `quelle:esa-juice`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Iess et al. 2018 (`iess-2018`); Wahl et al. 2017 (`wahl-2017`); Durante et al. 2020 (`durante-2020`); Militzer et al. 2022 (`militzer-2022`); Helled et al. 2022, Übersicht Entstehung und Inneres (*Icarus* 378, 114937); Bolton et al. 2017, erste Juno-Ergebnisse (*Science* 356, 821); Kaspi et al. 2018, Tiefe der Winde (*Nature* 555, 223); Guillot et al. 2018, starre Rotation des Inneren (*Nature* 555, 227); Connerney et al. 2022, JRM33 (*Journal of Geophysical Research: Planets* 127, e2021JE007055); Bagenal et al. 2017, Magnetosphäre (*Space Science Reviews* 213, 219); Adriani et al. 2018, Polarzyklone (*Nature* 555, 216); Li et al. 2020, Wasserhäufigkeit (*Nature Astronomy* 4, 609); Fletcher et al. 2020, Atmosphäre (*Space Science Reviews* 216, 30); Simon et al. 2018, Roter Fleck (*Astronomical Journal* 155, 151); Higgins et al. 1997, System-III-Periode (*Journal of Geophysical Research* 102, 22033); Kruijer et al. 2017, Alter aus Meteoriten (*Proceedings of the National Academy of Sciences* 114, 6712); Pollack et al. 1996, Kernakkretion (*Icarus* 124, 62); Archinal et al. 2018 (`archinal-2018`); Mallama et al. 2017 (`mallama-2017`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Achsneigung, Abplattungsfehler, Okkluderwahl und Fleckdrift im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test`; Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-jupiter.md src/data/texte/en/hochschule/objekt-jupiter.md docs/belege/hochschule/objekt-jupiter.md src/data/literatur.ts
git commit -m "Hochschultext Jupiter mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit (Gemeinsame Vorgaben 11 bis 13).

---

### Task 2: Szene `jupiter-vorbeiflug`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-jupiter-vorbeiflug.md`, `src/data/texte/en/hochschule/szene-jupiter-vorbeiflug.md`, `docs/belege/hochschule/szene-jupiter-vorbeiflug.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Modellzahlen Jupiters; der Controller gibt sie weiter).
- Produziert: Hochschultext `szene:jupiter-vorbeiflug`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Vorbeiflug an Jupiter` / `# Scene: Flyby of Jupiter` (wie die Gymnasialfassungen). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung.
- **Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `jupiter-vorbeiflug`, Index 6: Bahntyp `flyby`, `distanceBasis` `bodyRadius`, `distanceInRadii` 4, `elevationDeg` 12, `azimuthDeg` 200, `durationSec` 35, `timeRateDaysPerSec` 0,3, Streuung `azimuthDeg` 0 bis 360, `elevationDeg` −15 bis 25, `distanceFactor` 0,8 bis 1,5) und ihrer Auswertung in `src/render/camera/cinema.ts` (Fall `flyby`: geradlinig seitlich vorbei, Versatz von +2 auf −2 Radien, geringster Abstand genau in der Mitte der Szene; Querrichtung senkrecht zur Verbindung Körper–Kamera in der Ekliptik) — nachrechnen: Bahnlänge und Geschwindigkeit der Kamera in km/s bei 35 s, Winkelgröße Jupiters am Anfang, in der Mitte und am Ende bei Sichtfeld 50°, Drehung Jupiters in 10,5 simulierten Tagen (System III), ob Monde ins Bild kommen (Io bei 5,9 Radien, an mehreren Bahnphasen prüfen).
- **Hintergrund:** echte Vorbeiflüge (Pioneer 10/11, Voyager 1/2, Ulysses, Cassini, New Horizons 2007 mit 32 Jupiterradien Abstand, Juno-Perijoven bei rund 4000 km über den Wolken) mit Abstand, Geschwindigkeit und Zweck (Schwerkraftumlenkung als Formel: Ablenkwinkel aus Hyperbel, Geschwindigkeitsgewinn), Strahlungsgürtel als Randbedingung, Winkelgröße Jupiters aus diesen Abständen.
- **Modellgrenzen:** Kamera ohne Schwerkraft auf gerader Linie, konstante Geschwindigkeit, kein Hyperbelbogen; Jupiter als Kugel mit System-III-Rotation (Zahlen wie Task 1); Belichtung auf das Ziel (`render/exposure.ts`); ob der Zeitraffer beim Szenenstart gleitet (`src/app/cinema.ts`, `src/sim/director.ts`); Schatten der Monde auf Jupiter im Bild (Okkluder wie Task 1).
- Code lesen: `src/data/scenes.ts`, `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/jupiter.ts`, `src/data/bodies/jupiter-monde.ts`, `src/sim/scale.ts`, `src/render/exposure.ts`, `src/render/shadows.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`).
- Verweise: `objekt:jupiter`, `objekt:io`, `objekt:pluto` (New Horizons), `thema:bahnelemente`, `thema:finsternis`, `szene:galileisches-schattenspiel`, `thema:modell`; Karten zu `szene:jupiter-vorbeiflug`: `quelle:nssdc-jupiter`, `quelle:nasa-jupiter`, `quelle:nasa-juno`, `quelle:nasa-new-horizons`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Bolton et al. 2017 (siehe Task 1); Spencer et al. 2007, New Horizons an Jupiter (*Science* 318, 240); Smith et al. 1979, Voyager 1 (*Science* 204, 951); Murray und Dermott (`murray-2000`, Hyperbelbahn); Flandro 1966, Schwerkraftumlenkung (*Astronautica Acta* 12, 329); Bagenal et al. 2017 (siehe Task 1).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Winkelgrößen, Kameratempo und Mondsichtbarkeit im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-jupiter-vorbeiflug.md src/data/texte/en/hochschule/szene-jupiter-vorbeiflug.md docs/belege/hochschule/szene-jupiter-vorbeiflug.md src/data/literatur.ts
git commit -m "Hochschultext Szene Vorbeiflug an Jupiter mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 3: Körper `io`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-io.md`, `src/data/texte/en/hochschule/objekt-io.md`, `docs/belege/hochschule/objekt-io.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Jupiter-Modellzahlen); fachgeprüfte Texte `thema-gezeiten` (Io-Heizung), `thema-resonanzen` (Laplace, Perijoven), `thema-gebundene-rotation` (Modelltabelle), `thema-finsternis` (Io-Schatten, Rømer).
- Produziert: Hochschultext `objekt:io`; Task 7 übernimmt seine Modellzahlen (Umlaufzeit des Datensatzes, Bahnbezug, Rotation).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Io` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radius, Dichte, Trägheitsmomentfaktor und Love-Zahl k₂ (Galileo, Juno-Vorbeiflüge 2023/2024), Wärmefluss aus Vulkanismus; Tabelle der Kenngrößen. Inneres: Kern, Mantel, Frage des Magmaozeans (Induktion nach Khurana 2011 gegen Juno-Gezeitenmessung, Park et al. 2025), Gezeitenheizung und ihre Verteilung (Verweis `thema:gezeiten`, nicht wiederholen). Oberfläche: Vulkane (Loki, Pele, Tvashtar), Schwefel und Silikate, Berge, fehlende Krater und Erneuerungsrate, Plumes. Atmosphäre und Magnetosphäre: SO₂-Atmosphäre und ihr Kollaps in der Finsternis, Plasmatorus, Io-Fußpunkt der Polarlichter, Wechselwirkung mit dem Magnetfeld. Bahn, Rotation und Dynamik: Laplace-Resonanz (Verweis `thema:resonanzen`), erzwungene Exzentrizität, säkulare Beschleunigung und Bahnentwicklung (Lainey 2009, Lainey 2020 oder neuer), gebundene Rotation. Entstehung und Entwicklung: Bildung in der Jupiter-Scheibe, Wasserverlust, Entwicklung der Resonanz.
- `## Offene Fragen` (Pflicht): etwa Magmaozean, Ort der Gezeitendissipation (Mantel gegen Asthenosphäre), Richtung der Bahnentwicklung — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente aus `jupiter-monde.ts` im Bezug `parentEquator` (Kopfkommentar: Tafel für die Laplace-Ebene, ins Äquatorsystem gerechnet — am Code prüfen, was tatsächlich geschieht); Io mit `i` 0, `node` 0, `nodeDot` 0 (was folgt daraus?); `e` 0,004 fest; `lpDot` 27 006,75°/Jh → Perijovum läuft in 1,33 Jahren vorwärts (Zahlen wie `thema-resonanzen`, Code-Befund seit 4d-2); Umlaufzeit des Datensatzes aus `LDot` gegen 1,769138 d und die Rotation `rotationPeriodH` 42,45931 h (Verhältnis und Winkel wie `thema-gebundene-rotation`); der BEFUND-Kommentar zur Spalte P in `jupiter-monde.ts` (selbst nachrechnen, nicht übernehmen); Pol fest; Albedo 0,62 als geometrische Albedo; Schatten auf und von Jupiter (Okkluder wie Task 1, Zahlen wie `thema-finsternis`); Textur (Galileo/Voyager-Mosaik laut `ASSETS.md`), keine Vulkanfahnen; Maßstab (`isSatellite`, `scaledPositionAt`); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/jupiter-monde.ts` (Kopf- und Blockkommentare), `src/data/bodies/jupiter.ts`, `src/sim/orbit.ts` (`elementsAt`, `rotationAt`, `umlaufzeitTage`), `src/sim/frames.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/albedo.ts`, `ASSETS.md`, `src/ui/info/datenzeilen.ts`, `src/data/index.test.ts` (Sondertest Laplace-Resonanz), Hochschultexte `thema-gezeiten`, `thema-resonanzen`, `thema-gebundene-rotation`, `thema-finsternis`.
- Verweise: `objekt:jupiter`, `objekt:europa`, `objekt:ganymede`, `objekt:moon`, `thema:gezeiten`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:finsternis`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:entstehung`, `szene:galileisches-schattenspiel`, `thema:modell`; Karten zu `objekt:io`: `quelle:nssdc-jupitermonde`, `quelle:nasa-jupitermonde`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Peale, Cassen und Reynolds 1979 (`peale-1979`); Lainey et al. 2009 (`lainey-2009`); Khurana et al. 2011, Magmaozean (*Science* 332, 1186); Park et al. 2025, Juno-Gezeiten gegen flachen Magmaozean (*Nature* 638, 69; Kennung prüfen, ob als `park-2025` schon im Katalog); Anderson et al. 2001, Schwerefeld aus Galileo (*Journal of Geophysical Research* 106, 32963); de Kleer et al. 2019, Wärmefluss (*Astronomical Journal* 158, 29); Veeder et al. 1994, Wärmefluss (*Journal of Geophysical Research* 99, 17095); McEwen et al. 1998, Hochtemperaturvulkanismus (*Science* 281, 87); Spencer et al. 2007 (siehe Task 2, Tvashtar); Tsang et al. 2016, Atmosphärenkollaps in der Finsternis (*Journal of Geophysical Research: Planets* 121, 1400); Bagenal und Dols 2020, Plasmatorus (*Journal of Geophysical Research: Space Physics* 125, e2019JA027485); Tyler, Henning und Hamilton 2015, Verteilung der Heizung (*Astrophysical Journal Supplement* 218, 22); Yoder und Peale 1981 (`yoder-1981`); Archinal et al. 2018.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umlaufzeit, Perijovumsperiode, Rotationsverhältnis und Bahnbezug im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-io.md src/data/texte/en/hochschule/objekt-io.md docs/belege/hochschule/objekt-io.md src/data/literatur.ts
git commit -m "Hochschultext Io mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 4: Körper `europa`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-europa.md`, `src/data/texte/en/hochschule/objekt-europa.md`, `docs/belege/hochschule/objekt-europa.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 und 3 (Modellzahlen; Perijovum Europas 1,46 a vorwärts wie `thema-resonanzen`).
- Produziert: Hochschultext `objekt:europa`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Europa` in beiden Fassungen. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radius, Dichte, Trägheitsmomentfaktor (Galileo), Eisschale und Ozean: Nachweis über das induzierte Magnetfeld (Kivelson 2000), Dicke der Eisschale als Streitfrage (Werte und Verfahren), Tabelle der Kenngrößen. Inneres: Kern, Mantel, Ozean, Gezeitenheizung und thermisch-orbitale Kopplung (Verweis `thema:gezeiten`). Oberfläche: Lineae, Chaosgebiete, Zyklen aus Diurnalgezeiten, Kraterarmut und Alter (Zahnle 2003), Salze und Nicht-Eis-Stoffe (Trumbo 2019, JWST-CO₂ 2023), mögliche Plumes (Roth 2014, Jia 2018) als Streitfrage. Atmosphäre und Magnetosphäre: dünne O₂-Atmosphäre, Strahlung, induziertes Feld ohne eigenen Dynamo. Bahn, Rotation und Dynamik: Laplace-Resonanz und erzwungene Exzentrizität 0,0094, nichtsynchrone Rotation als Streitfrage (wie `thema-gebundene-rotation`), Bahnentwicklung. Entstehung und Entwicklung: Bildung, Differentiation, Ozeandauer; Missionen Europa Clipper (Ankunft 2030) und JUICE mit Stand.
- `## Offene Fragen` (Pflicht): etwa Dicke der Eisschale (dünn gegen dick), Plumes, nichtsynchrone Rotation, Bewohnbarkeit — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente im Bezug `parentEquator` mit `i` 0,5°, `e` 0,009 fest, `nodeDot` −1191,97°/Jh (Knotenperiode nachrechnen und mit der Literatur vergleichen), `lpDot` 24 632,99°/Jh (1,46 a vorwärts, Zahlen wie `thema-resonanzen`); Umlaufzeit des Datensatzes gegen 3,551181 d, Rotation `rotationPeriodH` 85,22835 h (Verhältnis und Winkel wie `thema-gebundene-rotation`); Pol fest; Albedo 0,68; Schatten (Okkluder); Textur laut `ASSETS.md`; Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: wie Task 3, dazu `src/render/bodies.ts`.
- Verweise: `objekt:jupiter`, `objekt:io`, `objekt:ganymede`, `objekt:enceladus`, `thema:gezeiten`, `thema:resonanzen`, `thema:gebundene-rotation`, `thema:innerer-aufbau`, `thema:photometrie`, `thema:entstehung`, `szene:galileisches-schattenspiel`, `thema:modell`; Karten zu `objekt:europa`: `quelle:nssdc-jupitermonde`, `quelle:nasa-jupitermonde`, `quelle:esa-juice`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Anderson et al. 1998, Schwerefeld und Eisschale (*Science* 281, 2019); Kivelson et al. 2000, Ozean aus Induktion (*Science* 289, 1340); Pappalardo et al. 1999, Übersicht (*Journal of Geophysical Research* 104, 24015); Hussmann und Spohn 2004, thermisch-orbitale Entwicklung (*Icarus* 171, 391); Roth et al. 2014, Plumes (*Science* 343, 171); Jia et al. 2018, Galileo-Plume (*Nature Astronomy* 2, 459); Trumbo, Brown und Hand 2019, NaCl (*Science Advances* 5, eaaw7123); Villanueva et al. 2023, CO₂ mit JWST (*Science* 381, 1305); Zahnle et al. 2003, Kraterraten (*Icarus* 163, 263); Howell 2021, Eisschalendicke (*Planetary Science Journal* 2, 129); Pappalardo et al. 2024, Europa Clipper (*Space Science Reviews* 220, 40); Grasset et al. 2013, JUICE (*Planetary and Space Science* 78, 1); Geissler et al. 1998 (`geissler-1998`, Katalog prüfen); Archinal et al. 2018.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Knoten- und Perijovumsperiode, Rotationsverhältnis im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-europa.md src/data/texte/en/hochschule/objekt-europa.md docs/belege/hochschule/objekt-europa.md src/data/literatur.ts
git commit -m "Hochschultext Europa mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 5: Körper `ganymede`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-ganymede.md`, `src/data/texte/en/hochschule/objekt-ganymede.md`, `docs/belege/hochschule/objekt-ganymede.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1, 3, 4 (Modellzahlen).
- Produziert: Hochschultext `objekt:ganymede`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Ganymed` / `# Ganymede`. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radius (größter Mond, größer als Merkur — mit Beleg), Dichte, Trägheitsmomentfaktor (Galileo, Juno 2021: Gomez Casajus 2022), Tabelle der Kenngrößen. Inneres: differenziert mit Eisenkern, eigener Dynamo (Kivelson 1996), Ozean zwischen Eisschichten (Induktion Kivelson 2002, Aurora-Schwankung Saur 2015), Hochdruckeis. Oberfläche: dunkle gefurchte und helle gerillte Gebiete, Tektonik, Alter, Polkappen aus Frost, JWST/Juno-Ergebnisse. Atmosphäre und Magnetosphäre: O₂-Atmosphäre, Wasserdampf (Roth 2021), Mini-Magnetosphäre im Jupiterfeld, Polarlichtovale. Bahn, Rotation und Dynamik: Laplace-Resonanz (letztes Glied), Rolle bei der Entstehung der Resonanz (Showman und Malhotra 1997), gebundene Rotation. Entstehung und Entwicklung: Differentiation gegen Kallisto (Streitfrage: langsame Akkretion, Resonanzheizung, Späte Schwere Bombardierung), JUICE (Ganymed-Orbit ab 2034) mit Stand.
- `## Offene Fragen` (Pflicht): etwa Ganymed–Kallisto-Dichotomie, Entstehung der hellen Gebiete, Dynamo-Antrieb, Ozeantiefe — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente im Bezug `parentEquator` (`i` 0,2°, `e` 0,001, `nodeDot` −261,23°/Jh, `lpDot` 265,85°/Jh — Perioden nachrechnen); Umlaufzeit gegen 7,154553 d, Rotation 171,70927 h (wie `thema-gebundene-rotation`); Pol fest; Albedo 0,44; Schatten (Okkluder; Zahlen wie `thema-finsternis`); Textur; Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: wie Task 3.
- Verweise: `objekt:jupiter`, `objekt:io`, `objekt:europa`, `objekt:callisto`, `objekt:mercury`, `objekt:titan`, `thema:innerer-aufbau`, `thema:resonanzen`, `thema:gezeiten`, `thema:gebundene-rotation`, `thema:photometrie`, `thema:entstehung`, `szene:galileisches-schattenspiel`, `thema:modell`; Karten zu `objekt:ganymede`: `quelle:nssdc-jupitermonde`, `quelle:nasa-jupitermonde`, `quelle:esa-juice`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Anderson et al. 1996, Differentiation (*Nature* 384, 541); Kivelson et al. 1996, eigenes Magnetfeld (*Nature* 384, 537); Kivelson, Khurana und Volwerk 2002, Ozean (*Icarus* 157, 507); Saur et al. 2015, Aurora und Ozean (*Journal of Geophysical Research: Space Physics* 120, 1715); Gomez Casajus et al. 2022 (`gomez-casajus-2022`); Showman und Malhotra 1997, Resonanz und Ganymed (*Icarus* 127, 93); Bland, Showman und Tobie 2009, Bahnentwicklung und Aufheizung (*Icarus* 200, 207); Roth et al. 2021, Wasserdampf (*Nature Astronomy* 5, 1043); Patterson et al. 2010, geologische Karte (*Icarus* 207, 845); Grasset et al. 2013 (siehe Task 4); Hussmann, Sohl und Spohn 2006, Ozeane in Eismonden (*Icarus* 185, 258); Archinal et al. 2018.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Perioden und Rotationsverhältnis im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-ganymede.md src/data/texte/en/hochschule/objekt-ganymede.md docs/belege/hochschule/objekt-ganymede.md src/data/literatur.ts
git commit -m "Hochschultext Ganymed mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 6: Körper `callisto`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-callisto.md`, `src/data/texte/en/hochschule/objekt-callisto.md`, `docs/belege/hochschule/objekt-callisto.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1, 3 bis 5 (Modellzahlen; Ganymed-Dichotomie aus Task 5 gleichlautend).
- Produziert: Hochschultext `objekt:callisto`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Kallisto` / `# Callisto`. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM, Radius, Dichte, Trägheitsmomentfaktor 0,355 (Galileo) und die Frage der hydrostatischen Annahme, Tabelle der Kenngrößen. Inneres: nur teilweise differenziert, induziertes Feld und Ozean (Khurana 1998, Zimmer 2000), langsame Differentiation (Nagel 2004). Oberfläche: ältester und am dichtesten verkraterter Körper, Valhalla, Sublimationsabbau, CO₂- und organische Spuren. Atmosphäre und Magnetosphäre: CO₂-Atmosphäre (Carlson 1999), O₂ (Cunningham 2015), kein eigenes Feld, außerhalb der Hauptstrahlung. Bahn, Rotation und Dynamik: außerhalb der Laplace-Kette (16,69 d), Bahnentwicklung, gebundene Rotation, Kallisto als Ziel bemannter Vorschläge nur knapp. Entstehung und Entwicklung: Dichotomie zu Ganymed (Streitfrage wie Task 5, gleichlautend), Akkretionsdauer, JUICE-Vorbeiflüge mit Stand.
- `## Offene Fragen` (Pflicht): etwa Grad der Differentiation, Existenz und Tiefe des Ozeans, Ursache der Dichotomie — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Bahnelemente im Bezug `parentEquator` (`i` 0,3°, `e` 0,007, `nodeDot` −62,36°/Jh, `lpDot` 67,17°/Jh — Perioden nachrechnen); Umlaufzeit gegen 16,689017 d, Rotation 400,53643 h (wie `thema-gebundene-rotation`); Pol fest; Albedo 0,19; Schatten: Kallisto wirft nur zeitweise Schatten (Zahlen wie `thema-finsternis`), ist sie unter den vier Okkludern Jupiters?; Textur; Maßstab; Datenblockwerte gegen Messwerte.
- Code lesen: wie Task 3.
- Verweise: `objekt:jupiter`, `objekt:ganymede`, `objekt:io`, `objekt:europa`, `objekt:titan`, `thema:innerer-aufbau`, `thema:gezeiten`, `thema:gebundene-rotation`, `thema:finsternis`, `thema:photometrie`, `thema:entstehung`, `szene:galileisches-schattenspiel`, `thema:modell`; Karten zu `objekt:callisto`: `quelle:nssdc-jupitermonde`, `quelle:nasa-jupitermonde`, `quelle:esa-juice`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Anderson et al. 2001, Schwerefeld und teilweise Differentiation (*Icarus* 153, 157); Khurana et al. 1998, induziertes Feld (*Nature* 395, 777); Zimmer, Khurana und Kivelson 2000, Ozeane in Europa und Kallisto (*Icarus* 147, 329); Nagel, Breuer und Spohn 2004, langsame Differentiation (*Icarus* 169, 402); Carlson 1999, CO₂-Atmosphäre (*Science* 283, 820); Cunningham et al. 2015, O₂ (*Icarus* 254, 178); Moore et al. 2004, Kallisto-Kapitel in *Jupiter: The Planet, Satellites and Magnetosphere* (Cambridge University Press); Barr und Canup 2010, Dichotomie durch späte Bombardierung (*Nature Geoscience* 3, 164); Grasset et al. 2013 (siehe Task 4); Archinal et al. 2018.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Perioden, Rotationsverhältnis und Okkluderwahl im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-callisto.md src/data/texte/en/hochschule/objekt-callisto.md docs/belege/hochschule/objekt-callisto.md src/data/literatur.ts
git commit -m "Hochschultext Kallisto mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 7: Szene `galileisches-schattenspiel`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-galileisches-schattenspiel.md`, `src/data/texte/en/hochschule/szene-galileisches-schattenspiel.md`, `docs/belege/hochschule/szene-galileisches-schattenspiel.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1, 3 bis 6 (Modellzahlen; Laplace-Zahlen aus `thema-resonanzen`).
- Produziert: Hochschultext `szene:galileisches-schattenspiel`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Das galileische Schattenspiel` / `# Scene: The Galilean shadow play` (wie die Gymnasialfassungen). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung.
- **Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `galileisches-schattenspiel`, Index 7: Bahntyp `orbit`, `distanceBasis` `bodyRadius`, `distanceInRadii` 55, `elevationDeg` 55, `azimuthRateDegPerSec` 1, `durationSec` 45, `timeRateDaysPerSec` 0,5, Streuung `azimuthDeg` 0 bis 360, `elevationDeg` −10 bis 10 additiv, `distanceFactor` 0,8 bis 1,5) und ihrer Auswertung in `src/render/camera/cinema.ts`; 22,5 simulierte Tage = 12,7 Io-, 6,3 Europa-, 3,1 Ganymed- und 1,35 Kallisto-Umläufe (nachrechnen aus den Datensätzen); welche Bahnen bei Sichtfeld 50° und Abstandsfaktor 0,8 / 1,0 / 1,5 ins Bild passen (Kommentar: Ganymed 15,3 Radien sicher, Kallisto 26,9 am unteren Rand nicht — selbst nachrechnen, mit `sizeScale` je Maßstabsstufe); Winkelgröße Jupiters; wie das 4:2:1-Muster der Konjunktionen im Bild erscheint (Konjunktionen Io–Europa treten immer auf derselben Seite auf, wenn die Laplace-Beziehung gilt); welche Schatten sichtbar sind (Okkluder, Sonnenrichtung zur Szenenzeit).
- **Hintergrund:** Laplace-Resonanz (Verweis `thema:resonanzen`, hier nur die Kernaussage und die Laplace-Beziehung φ = λ₁ − 3λ₂ + 2λ₃ ≈ 180°), Galileis Entdeckung 1610 und die Längengradbestimmung, Rømer 1676 (Verweis `thema:finsternis`), gegenseitige Ereignisse (PHEMU) und ihre Nutzung für Ephemeriden, Schattendurchgänge als Beobachtungsobjekt.
- **Modellgrenzen:** Kepler-Bahnen ohne gegenseitige Störungen, Laplace-Winkel 180,0° zur Epoche mit −1,05°/Jh Drift, Perijoven vorwärts (Zahlen wie `thema-resonanzen`); Bahnen im Äquatorbezug statt Laplace-Ebene; Schatten nach `render/shadows.ts` (nur bis vier Okkluder, Kernschatten ohne Halbschatten? — am Code prüfen), keine gegenseitigen Verfinsterungen zwischen Monden (prüfen: Geschwistermonde als Okkluder?); Belichtung; Zeitraffer beim Szenenstart.
- Code lesen: `src/data/scenes.ts`, `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/jupiter-monde.ts`, `src/data/bodies/jupiter.ts`, `src/sim/scale.ts`, `src/render/shadows.ts`, `src/render/exposure.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`), `src/data/index.test.ts` (Sondertest Laplace-Resonanz).
- Verweise: `objekt:jupiter`, `objekt:io`, `objekt:europa`, `objekt:ganymede`, `objekt:callisto`, `thema:resonanzen`, `thema:finsternis`, `thema:bahnelemente`, `szene:jupiter-vorbeiflug`, `thema:modell`; Karten zu `szene:galileisches-schattenspiel`: `quelle:nssdc-jupitermonde`, `quelle:nasa-jupitermonde`, `quelle:esa-juice`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Peale und Lee 2002 (`peale-2002`); Yoder und Peale 1981 (`yoder-1981`); Lainey et al. 2009 (`lainey-2009`); Arlot et al. 2014, PHEMU 2009 (*Astronomy & Astrophysics* 572, A120); Galilei 1610, *Sidereus Nuncius* (nur als historischer Beleg, falls eine zitierfähige Ausgabe mit DOI oder URL geöffnet werden kann, sonst Sekundärliteratur); Murray und Dermott (`murray-2000`, Kap. 8); Archinal et al. 2018.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Umläufe je Szene, Bildpassung der Bahnen je Maßstab und Schatten im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-galileisches-schattenspiel.md src/data/texte/en/hochschule/szene-galileisches-schattenspiel.md docs/belege/hochschule/szene-galileisches-schattenspiel.md src/data/literatur.ts
git commit -m "Hochschultext Szene Das galileische Schattenspiel mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und eine Nacharbeit.

---

### Task 8: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe5-abnahme.md`
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

Expected: Lint ohne Befund; alle Tests grün (Soll 4279 nach „Testzahlen" oben, zuzüglich Tests aus Zwischen-Tasks); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, Ausgangsstand 1 344,76 kB nach 4d-4); Prüfskript über den ganzen Katalog mit 0 Fehlern und ohne 429, Laufzeit notieren (Ausgangsstand 460 s bei 372 Einträgen). Schlusszeilen, die Katalogzahl (Ausgangsstand 372) und die Ausgabe des Prüfskripts ins Protokoll wie in der Abnahme 4d-4 §3; jede Warnung begründen (bekannt: `cgpm-2022` ohne Autoren, `greaves-2021` Online-Jahr, `korablev-2019` Körperschaft zuerst).

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

Kombinationen: Sprachen `de`, `en` × die sieben Kennungen (`jupiter`, `io`, `europa`, `ganymede`, `callisto`, `jupiter-vorbeiflug`, `galileisches-schattenspiel`). Zustand setzen wie in der Abnahme 4d-4: Körper über `setInfo({ thema: null })` und `setCamera({ targetId: '<id>', mode: 'free' })`; Szenen über `setCinema({ running: true, shuffle: false, nummer: 6 })` (`jupiter-vorbeiflug`) beziehungsweise `nummer: 7` (`galileisches-schattenspiel`), `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setTime({ paused: true })`, `setUi({ hidden: false })`. Auf den Kopfwechsel pollen (Titel wie in der ersten Zeile des Texts), Hinweise erst nach dem Auflösen des faulen Imports werten, dann auswerten:

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

Je Sprache: Fachthema `resonanzen` öffnen (`setInfo({ thema: 'resonanzen' })`), den ersten Verweis `a[data-verweis="objekt:io"]` klicken, auf den Kopf „Io" pollen, dann: keine Hinweiszeile im Textbereich. Ebenso Fachthema `finsternis` öffnen (`setInfo({ thema: 'finsternis' })`), `a[data-verweis="objekt:jupiter"]` klicken, Kopf „Jupiter", keine Hinweiszeile. Vier Messungen, Ergebnis mit Wartezeit in ms ins Protokoll.

- [ ] **Schritt 5: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 6: Protokoll `docs/phase4d-etappe5-abnahme.md`**

Gliederung wie `docs/phase4d-etappe4-abnahme.md`:

```md
# Abnahme Phase 4d Etappe 5 „Jupitersystem"

## 1. Umfang
## 2. Lint, Tests, Build
(Testzahl als durchgehende Tabelle Task → Zuwachs → Summe; Hauptchunk gegen 1 344,76 kB; Katalog gegen 372)
## 3. Prüfskript
## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |
## 5. Sichtprüfung
### 5.1 Rundgang
### 5.2 Ersatz entfällt
### 5.3 Konsole
## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:")
## 7. Bekannte Unschärfen
(Befunde am Simulationscode als Kandidaten für eigene Tasks; Restbefunde der Fachprüfungen)
## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer; gemeldete Fehler in Gymnasialtexten; die Plan-Rulings als Themenliste)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, nicht geschätzt; jede Summe nachrechnen. Die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung nennen, ohne Suchmuster.

- [ ] **Schritt 7: README**

In `README.md` im Absatz zu Phase 4d den Satzteil

```md
Deimos und die Szenen „Merkur auf der Innenbahn" und „Tiefflug über Phobos".
Offen sind die übrigen Hochschultexte (Etappen 4d-5 bis 4d-11) und Phase 5
```

ersetzen durch:

```md
Deimos und die Szenen „Merkur auf der Innenbahn" und „Tiefflug über Phobos";
Etappe 5 Jupiter, Io, Europa, Ganymed, Kallisto und die Szenen „Vorbeiflug an
Jupiter" und „Das galileische Schattenspiel". Offen sind die übrigen
Hochschultexte (Etappen 4d-6 bis 4d-11) und Phase 5
```

Danach die Zeilenumbrüche des Absatzes glätten (Zeilen bis rund 80 Zeichen), ohne den Wortlaut zu ändern.

- [ ] **Schritt 8: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe5-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm (Aufnahmen, Skripte löschen).

```bash
git add docs/phase4d-etappe5-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 5: Jupitersystem"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe; Paket ohne die fachgeprüften Texte und Beleglisten, mit Katalogeinträgen und Protokoll); Befunde gebündelt in **einer** Nacharbeit, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-5` nach `master`, Branch löschen; Push nach der Prüfung des Diffs auf Zugangsdaten (Ruling 13).
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Befunde am Simulationscode als Kandidaten. Etappe 4d-6 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- Modelle nach Weisung von Jens: Umsetzer der Text-Tasks, Fachprüfer, Abnahme und Schlussprüfung auf dem mittleren Modell (sonnet); rein mechanische Aufträge (README, Formfixes, Katalogfelder) auf dem kleinsten (haiku); in 4d-4 reichte das ohne Eskalation. Das stärkste Modell nur nach zweimaligem Scheitern an derselben Stelle.
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace `.superpowers/sdd/2026-09-20-phase4d-hochschule-etappe5/`.
- Fachprüfer laufen parallel zum nächsten Umsetzer; Nacharbeiten und Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`. Ein Umsetzer bekommt den Hinweis, welche fremde Belegliste gerade im Arbeitsbaum geändert sein kann.
- Jeder Umsetzer bekommt die Gemeinsamen Vorgaben, seinen Task und die Globalen Randbedingungen wörtlich (als Dateien); die Modellzahlen aus Task 1 (Jupiter) und Task 3 bis 6 (Monde) gibt der Controller aus den Berichten an die Folgetasks weiter.
- Eine Prüfrunde je Text: Nach der Nacharbeit keine weitere Prüfung beauftragen; Zweifel gehen ins Protokoll §8.
- Websuche-Kontingent: In 4d-4 war es bei einem Umsetzer erschöpft; ein Umsetzer, der nicht mehr suchen kann, meldet das im Bericht, zitiert nur Geöffnetes und nennt die Stellen, die die Fachprüfung an der Quelle nachholen soll.

## Rulings

Entscheidungen der Planung (20.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** „push, dann 4d-5" (Jens, 20.09.2026) gilt als Freigabe für Etappe 4d-5; die Fragen aus §8 der Abnahme 4d-4 werden nicht abgewartet.
2. **Ruling:** Modelle wie in 4d-4 (Weisung von Jens): mittleres Modell für Texte, Prüfer, Abnahme und Schlussprüfung, kleinstes für Mechanik.
3. **Ruling:** Höchstens eine Prüfrunde je Text (Regel von Jens): Fachprüfung, eine Nacharbeit, Schluss; keine Nachprüfung; in der Nacharbeit wird nicht gekürzt.
4. **Ruling:** Jupiter ohne Abschnitt „Oberfläche" (Entwurf §5.1 lässt ihn bei Gasplaneten entfallen); Wolkendecke, Bänder und Roter Fleck stehen unter „Atmosphäre und Magnetosphäre". Der Dateitest „folgt der Gliederung seiner Art" muss diesen Fall zulassen — vor Task 1 am Test `src/data/texte/dateien.test.ts` prüfen; lässt er ihn nicht zu, ist das ein Zwischen-Task (Test anpassen, Entwurf §5.1 nennt die Ausnahme bereits).
5. **Ruling:** Reihenfolge Jupiter → Vorbeiflug → Io → Europa → Ganymed → Kallisto → Schattenspiel: Die Szene am Ende braucht die Modellzahlen aller vier Monde, der Vorbeiflug nur Jupiter; jeder Körper ein eigener Task (alle vier Monde sind große Körper nach §5.2).
6. **Ruling:** Befunde am Simulationscode werden in 4d-5 nicht behoben (wie 4d-3 Ruling 3, 4d-4 Ruling 7): Perijoven von Io und Europa vorwärts statt rückwärts (seit 4d-2 bekannt), Mondbahnen im Äquatorbezug statt Laplace-Ebene, Io mit i = 0, Jupiter als Kugel ohne Abplattung und ohne Ring, feste Pole, Nullmeridiane 0 gegen W₀, System-III-Rotation der Wolkentextur. Die Texte beschreiben den Ist-Code; neue Befunde gehen ins Ledger und ins Protokoll §7.
7. **Ruling:** Modellzahlen aus fachgeprüften Texten (`thema-resonanzen`, `thema-gezeiten`, `thema-gebundene-rotation`, `thema-finsternis`, `thema-innerer-aufbau`, `thema-photometrie`, `thema-entstehung`, `thema-bezugssysteme`) übernehmen die neuen Texte gleichlautend; Abweichungen der eigenen Nachrechnung gehen an Jens (§8), der fachgeprüfte Text wird nicht geändert.
8. **Ruling:** Kein eigener Verweis-Task: Alle sieben Kennungen haben Gymnasialtexte; die vorhandenen Verweise älterer Hochschultexte auf `objekt:jupiter`, `objekt:io`, `objekt:europa`, `objekt:ganymede`, `objekt:callisto` führen danach auf die Hochschultexte.
9. **Ruling:** Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); Zahlenspannen nennen, wofür sie gelten, zwei Modelle mit zwei Spannen.
10. **Ruling:** Die Fachprüfung behält die sieben Prüfpunkte und den Hinweis auf die eine Runde.
11. **Ruling:** Eine Sichtprüfung des Formelsatzes entfällt, solange kein neuer TeX-Befehl dazukommt.
12. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle; wächst der Chunk gegenüber 1 344,76 kB um mehr als 50 kB, geht die Frage des faulen Ladens an Jens.
13. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master` und wird nach der Prüfung des Diffs auf Zugangsdaten gepusht (Jens ließ 4d-3 und 4d-4 so pushen). Jens gibt danach 4d-6 frei.
14. **Ruling:** Wortzahl-Obergrenze ein Drittel über dem Richtwert (4667 beziehungsweise 1200); Straffung vor dem Commit, nie in der Nacharbeit; Richtigkeit vor Wortzahl, wenn eine Berichtigung die Grenze überschreitet.
15. **Ruling:** Katalogform wie nach der Schlussprüfung 4d-4: beschreibende Zusätze in `erschienen` englisch, Eigennamen original, Vorabdrucke `'arXiv'`, laufend gepflegte Seiten mit Zugriffsjahr, Konsortial-Bylines mit dem Menschen zuerst.
16. **Ruling:** Quellenkarten aus dem Brief sind Angebot, keine Pflicht; ein `quelle:`-Beleg muss die Aussage auf der Seite tragen.
17. **Ruling:** Die Szene `galileisches-schattenspiel` bekommt ihren Hochschultext, obwohl Jens sie am 13.09.2026 „nicht weiterverfolgt" hat: Sie ist im Katalog, hat seit 4c-4 Grundschul- und Gymnasialtexte und steht in Entwurf §7. Kosten bei Fehlurteil: ein Textpaar, das Jens streichen lässt.
18. **Ruling:** Der zurückgestellte Minor aus 4d-4 (`scripts/literaturVergleich.ts`: `name: ''` ohne `family` gälte als Körperschaft) bleibt zurückgestellt; kein Code-Task in dieser Etappe.
