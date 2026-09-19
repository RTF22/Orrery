# Phase 4d Hochschule, Etappe 3 „Sonne, Erde–Mond" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Sonne und Mond, die Themen `finsternis` und `gebundene-rotation` und die Szenen `mondtanz` und `erdaufgang` haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung (Entwurf §7, Zeile 4d-3, 12 Dateien). Vorher wartet das Prüfskript nach jedem arXiv-Abruf drei Sekunden, damit der Volllauf nicht an der Ratenbegrenzung von arXiv scheitert (Schlussprüfung 4d-2, Befund M5). Danach **Halt** für die Freigabe von Etappe 4d-4.

**Architektur:** Task 1 ist ein kleiner Code-Task mit Test: `literaturVergleich.ts` bekommt die Pausen je Dienst als Konstante, `pruefe-literatur.ts` nutzt sie. Task 2 bis 7 sind die sechs Texte, **nicht wörtlich im Plan**: Der Umsetzer liest den Code, recherchiert, schreibt und belegt nach Entwurf §6.4; eine Fachprüfung mit frischem Kontext prüft (wie in 4d-1 und 4d-2). Alle Verweisziele der Etappe haben schon Gymnasialtexte (Ersatz nach Entwurf §5.5 Punkt 6), deshalb setzt jeder Text-Task seine Verweise selbst; ein eigener Verweis-Task wie in 4d-2 entfällt. Task 8 ist die Abnahme nach Entwurf §8.2.

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §4.5 (Prüfskript), §5 (Gestalt der Texte: §5.1 Gliederung für Körper und Szenen, §5.2 Stand und Richtwerte), §6 (Arbeitsweise), §7 Zeile 4d-3, §8.2 (Abnahme). Vorlagen: Plan `docs/superpowers/plans/2026-09-17-phase4d-hochschule-etappe2.md` (Text-Tasks, Abnahme) und die fachgeprüften Hochschultexte unter `src/data/texte/de/hochschule/` samt Beleglisten unter `docs/belege/hochschule/`. Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und in Originaltiteln des Literaturkatalogs.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben). Protokolle, Berichte in versionierten Dateien und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster**.
- Branch `hochschule-3` (von `master`), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test in `literatur.test.ts`) und steht alphabetisch nach Kennung (Test).
- Keine neue Abhängigkeit in `package.json`. Kein Code außerhalb von Task 1 und etwaigen Zwischen-Tasks für neue TeX-Befehle; Befunde am Simulationscode, die ein Text aufdeckt, beschreibt der Text in „Im Modell" beziehungsweise „Modellgrenzen" und der Bericht meldet sie (Ruling 3).
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben (`'\\sin E'`).
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Namen beziehungsweise Titel aus `ui/i18n` (Körper `body.<id>.name`, Themen `thema.<id>.title`, Szenen „Szene: " / „Scene: " vor `scene.<id>` wie in den Gymnasialfassungen); Körper und Szenen mit den festen `##`-Überschriften aus Entwurf §5.1 in dieser Reihenfolge, Pflichtabschnitte nie weglassen; Hochschultexte enden mit `*Stand: September 2026*` beziehungsweise `*As of September 2026*` als eigenem Absatz (Monat und Jahr des Commits, mit dem der Text fertig wird); `literatur:` nur in Hochschultexten. Richtwerte ohne Testgrenze (Entwurf §5.2): große Körper 1500 bis 3500 Wörter je Fassung, Themen 1500 bis 4000, Szenen 300 bis 900; Richtigkeit geht vor Wortzahl.
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten. Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen); Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste.
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:" ins Ledger `.superpowers/sdd/2026-09-19-phase4d-hochschule-etappe3/progress.md` (git-ignoriert), am Ende gesammelt ins Abnahmeprotokoll.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Prüfskript wartet nach arXiv drei Sekunden | `scripts/literaturVergleich.ts`, `scripts/literaturVergleich.test.ts`, `scripts/pruefe-literatur.ts`, Entwurf §4.5 (Nachtrag) |
| 2 | Körper `sun` | 2 Texte, `docs/belege/hochschule/objekt-sun.md`, `src/data/literatur.ts` |
| 3 | Körper `moon` | 2 Texte, `docs/belege/hochschule/objekt-moon.md`, `src/data/literatur.ts` |
| 4 | Thema `gebundene-rotation` | 2 Texte, `docs/belege/hochschule/thema-gebundene-rotation.md`, `src/data/literatur.ts` |
| 5 | Thema `finsternis` | 2 Texte, `docs/belege/hochschule/thema-finsternis.md`, `src/data/literatur.ts` |
| 6 | Szene `mondtanz` | 2 Texte, `docs/belege/hochschule/szene-mondtanz.md`, `src/data/literatur.ts` |
| 7 | Szene `erdaufgang` | 2 Texte, `docs/belege/hochschule/szene-erdaufgang.md`, `src/data/literatur.ts` |
| 8 | Abnahme | `docs/phase4d-etappe3-abnahme.md`, `README.md` |

Texte liegen unter `src/data/texte/<de|en>/hochschule/<art>-<kennung>.md`.

**Testzahlen:** Ausgangsstand `master` 78e6f1d: 3832 Tests. Im Dateitest `src/data/texte/dateien.test.ts` erzeugt ein Hochschultext 10 Fälle (Thema) beziehungsweise 11 Fälle (Körper, Szene: zusätzlich „folgt der Gliederung seiner Art"). Soll: 3832 + 1 (Task 1) + 2 × 11 (Sonne) + 2 × 11 (Mond) + 2 × 10 (gebundene Rotation) + 2 × 10 (Finsternisse) + 2 × 11 (Mondtanz) + 2 × 11 (Erdaufgang) = **3961**, zuzüglich Tests aus Zwischen-Tasks für neue TeX-Befehle. Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test`. Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

### Task 1: Prüfskript wartet nach arXiv drei Sekunden

**Dateien:**
- Ändern: `scripts/literaturVergleich.ts` (neue Konstante nach `WIEDERHOLBARE_STATUS`)
- Ändern: `scripts/literaturVergleich.test.ts` (Import, neuer `describe`-Block am Ende)
- Ändern: `scripts/pruefe-literatur.ts` (Kopfkommentar, `PAUSE_MS` entfällt, drei `warte`-Aufrufe)
- Ändern: `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` (Nachtrag in §4.5)

**Schnittstellen:**
- Konsumiert: `Befund['pruefung']` (`'crossref' | 'arxiv' | 'url'`) aus `literaturVergleich.ts`.
- Produziert: `export const PAUSE_NACH_MS: Readonly<Record<Befund['pruefung'], number>>` in `scripts/literaturVergleich.ts`.

**Hintergrund:** Im Volllauf der Abnahme 4d-2 antwortete arXiv einmal mit HTTP 429, weil das Skript nach jedem Abruf nur 200 ms wartet (Protokoll `docs/phase4d-etappe2-abnahme.md` §3, Befund M5 der Schlussprüfung). Die Nutzungsbedingungen der arXiv-API verlangen höchstens eine Abfrage alle drei Sekunden. Die Regel „429 gilt sofort als Fehler" (Plan 4d-2, Ruling 3) bleibt.

- [ ] **Schritt 1: Regel an der Quelle prüfen**

Die Nutzungsbedingungen der arXiv-API öffnen (Ausgangspunkt `https://info.arxiv.org/help/api/tou.html`) und den Satz zur Abfragerate wörtlich in den Bericht übernehmen. Nennt die Seite einen anderen Abstand als drei Sekunden, gilt der Wert der Seite (Konstante, Test und Kommentar entsprechend, Ruling ins Ledger).

- [ ] **Schritt 2: Test schreiben**

In `scripts/literaturVergleich.test.ts` den Import um `PAUSE_NACH_MS` ergänzen:

```ts
import {
  arxivEintragLesen, auswahl, crossrefJahre, jahrUrteil, mitWiederholung, normalisiere, PAUSE_NACH_MS, pruefeArxiv,
  pruefeCrossref, wortanteil, WIEDERHOLBARE_STATUS,
} from './literaturVergleich.ts';
```

und am Dateiende anfügen:

```ts
describe('PAUSE_NACH_MS', () => {
  it('wartet nach arXiv mindestens drei Sekunden, nach Crossref und Adressen 200 ms (Schlussprüfung 4d-2, Befund M5)', () => {
    expect(PAUSE_NACH_MS.arxiv).toBeGreaterThanOrEqual(3000);
    expect(PAUSE_NACH_MS.crossref).toBe(200);
    expect(PAUSE_NACH_MS.url).toBe(200);
  });
});
```

- [ ] **Schritt 3: Test scheitern sehen**

Run: `npx vitest run scripts/literaturVergleich.test.ts`
Expected: FAIL (`PAUSE_NACH_MS` ist `undefined`, „Cannot read properties of undefined").

- [ ] **Schritt 4: Konstante anlegen**

In `scripts/literaturVergleich.ts` direkt nach `WIEDERHOLBARE_STATUS`:

```ts
/**
 * Pause nach einem Abruf je Dienst. Die arXiv-API erlaubt höchstens eine
 * Abfrage alle drei Sekunden (Nutzungsbedingungen der arXiv-API); mit 200 ms
 * antwortete arXiv im Volllauf der Abnahme 4d-2 mit 429 (Schlussprüfung 4d-2,
 * Befund M5). Ein 429 bleibt ein Fehler und wird nicht wiederholt.
 */
export const PAUSE_NACH_MS: Readonly<Record<Befund['pruefung'], number>> = {
  crossref: 200,
  arxiv: 3000,
  url: 200,
};
```

- [ ] **Schritt 5: Skript umstellen**

In `scripts/pruefe-literatur.ts`:
- Import um `PAUSE_NACH_MS` ergänzen: `import { arxivEintragLesen, auswahl, mitWiederholung, PAUSE_NACH_MS, pruefeArxiv, pruefeCrossref } from './literaturVergleich.ts';`
- Die Zeile `const PAUSE_MS = 200;` löschen.
- Im Crossref-Zweig `await warte(PAUSE_MS);` → `await warte(PAUSE_NACH_MS.crossref);`, im arXiv-Zweig → `await warte(PAUSE_NACH_MS.arxiv);`, im Adress-Zweig → `await warte(PAUSE_NACH_MS.url);`.
- Im Kopfkommentar den Satz „Abfragen nacheinander mit Pause, ohne E-Mail-Adresse im Abruf." ersetzen durch „Abfragen nacheinander mit Pause (nach arXiv drei Sekunden, sonst 200 ms), ohne E-Mail-Adresse im Abruf."

- [ ] **Schritt 6: Tests und Typprüfung**

Run: `npx vitest run scripts/literaturVergleich.test.ts` → PASS. `npx tsc -b` → ohne Ausgabe. `npm run lint` → ohne Befund.

- [ ] **Schritt 7: Wirkung nachweisen**

Alle Katalogeinträge mit `arxiv` prüfen (42 am Ausgangsstand):

```bash
npm run literatur:pruefen -- --nur $(node -e "import('./src/data/literatur.ts').then((m) => console.log(m.LITERATUR.filter((p) => p.arxiv !== undefined).map((p) => p.id).join(',')))")
```

Expected: 0 Fehler, keine Zeile mit `429`; Laufzeit mindestens Zahl der Einträge × 3 s. Schlusszeile und Laufzeit in den Bericht.

- [ ] **Schritt 8: Nachtrag im Entwurf**

In `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` §4.5 nach dem letzten Nachtrag anfügen:

```md
**Nachtrag (4d-3):** Nach einem arXiv-Abruf wartet das Skript drei Sekunden, nach Crossref und
Adressen weiter 200 ms (`PAUSE_NACH_MS` in `scripts/literaturVergleich.ts`). Anlass: Die
Nutzungsbedingungen der arXiv-API erlauben höchstens eine Abfrage alle drei Sekunden, und im
Volllauf der Abnahme 4d-2 antwortete arXiv einmal mit 429. Ein 429 bleibt ein Fehler.
```

- [ ] **Schritt 9: Commit**

```bash
git add scripts/literaturVergleich.ts scripts/literaturVergleich.test.ts scripts/pruefe-literatur.ts docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md
git commit -m "Prüfskript: nach arXiv-Abrufen drei Sekunden Pause"
```

`npm test` → 3833. Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Gemeinsame Vorgaben für Task 2 bis 7 (Texte)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den fachgeprüften Hochschultexten als Maßstab für Tiefe, Ton und Belegdichte: `objekt-earth` für Körper, `szene-mondfinsternis` für Szenen, `thema-bahnelemente` und die sechs Fachthemen für Themen. Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang.

**Ablauf je Task**

1. **Vorlage lesen:** den passenden fachgeprüften Text (siehe oben) in beiden Fassungen und seine Belegliste unter `docs/belege/hochschule/` (Form der Belegliste, Abschnitt „Im Modell" beziehungsweise „Modellgrenzen"). Dazu den Gymnasialtext derselben Kennung, damit der Hochschultext ihm nicht widerspricht; findet der Umsetzer im Gymnasialtext einen sachlichen Fehler, meldet er ihn im Bericht (nicht ändern).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (Vite-SSR aus dem Projektverzeichnis oder Node mit Typentfernung, nicht versioniert). Werte des Datenblocks aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten.
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf: zuerst nach neueren Übersichtsartikeln und Missionsergebnissen suchen, auch wenn der Stoff bekannt scheint; Übersichtsartikel, Missionsauswertungen, IAU-/IERS-/JPL-Berichte. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, Band, Seite und DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren. Einträge, die schon im Katalog stehen (`src/data/literatur.ts`), wiederverwenden statt doppelt anlegen; ihr Inhalt wird trotzdem für jede neue Aussage geöffnet.
4. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" leer:

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile; „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" (folgt aus Definitionen oder genannten Werten) oder „Nachrechnung am Code: <Datei>". Senkrechte Striche in Zellen als `\|` maskieren (jede Zeile hat genau sechs Zellen). Querverweise zwischen Zeilen („siehe Nr. 12") nach jeder Neunummerierung prüfen.
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`; Körperschaften als Autor wie bei `cgpm-2022`. `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test „zitiert jeden Eintrag des Literaturkatalogs mindestens einmal"). Kennungen gleicher Erstautoren und Jahre mit Buchstaben unterscheiden (`nesvorny-2018a`).
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen.
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile und Gliederung nach den Globalen Randbedingungen und Entwurf §5.1. Körper: `## Kenngrößen und Messung`, `## Inneres`, `## Oberfläche`, `## Atmosphäre und Magnetosphäre`, `## Bahn, Rotation und Dynamik`, `## Entstehung und Entwicklung`, `## Offene Fragen`, `## Im Modell` (englisch `Parameters and measurement`, `Interior`, `Surface`, `Atmosphere and magnetosphere`, `Orbit, rotation and dynamics`, `Formation and evolution`, `Open questions`, `In the model`). Szenen: `## Was das Bild zeigt`, `## Hintergrund`, `## Modellgrenzen` (englisch `What the view shows`, `Background`, `Model limitations`). Themen frei gegliedert, als letzter Inhaltsabschnitt `## Im Modell` / `## In the model`, davor `## Offene Fragen` / `## Open questions`.
   - „Im Modell" beziehungsweise „Modellgrenzen": was Orrery zur Kennung rechnet oder bewusst weglässt, mit Verweis `thema:modell`; jede Abweichung des Modells von der Wirklichkeit mit Größenordnung; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung. Nur beschreiben, was der Code zum Zeitpunkt des Tasks tut; Zahlen selbst nachrechnen. Stehen dieselben Modellzahlen schon in einem fachgeprüften Text (etwa `szene-mondfinsternis`, `objekt-earth`), dieselben Werte verwenden oder die Abweichung im Bericht begründen (Ruling 8).
   - „Offene Fragen": Streitfragen mit Belegen für beide Seiten, nicht entschieden, solange die Fachwelt es nicht getan hat.
   - Schluss `*Stand: <Monat> 2026*` / `*As of <Month> 2026*` (Monat des Commits).
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit allen Nachträgen): Argumente von `^`, `_`, `\frac` mit mehr als einem Zeichen in `{}` (`\frac{1}{2}`, nicht `\frac12`); `\text{…}` ohne verschachtelte Klammern und in beiden Fassungen **gleich**; Dezimalkomma in deutschen Formeln als `{,}`, in englischen `.`. Fehlt ein Befehl, ist das ein eigener Zwischen-Task (Test in `texUebersetzer.test.ts`, eigener Commit), kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen „25 770", Englisch Komma „25,770"), vierstellige Zahlen ohne Trennung.
   - Kein `$` außerhalb von Formeln (Dateitest); kein `|` am Absatzanfang außer in Tabellen.
8. **Verweise:** `objekt:`, `szene:`, `thema:` auf Kennungen aus `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts`; Ziele ohne Hochschultext sind erlaubt, wenn sie einen Gymnasialtext haben (Ersatz, Entwurf §5.5 Punkt 6). Die Fachthemen `bezugssysteme`, `gezeiten`, `resonanzen`, `innerer-aufbau`, `photometrie`, `entstehung` haben Hochschultexte und dürfen verlinkt werden. Höchstens ein Verweis je Ziel je `##`-Abschnitt; kein Verweis eines Texts auf sich selbst. Jeder `quelle:`-Verweis braucht eine Karte zur Kennung des Texts (`fuer` in `src/data/quellen.ts`; der Task nennt die vorhandenen Karten, neue Karten nur mit Ruling und Eintrag in `quellen.ts` samt Abdeckungstest).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht.
10. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen (Commit-Text im Task). Vorher `git status --short`: keine Reste aus Skripten im Quellbaum.
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten.
12. **Nacharbeit:** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise (Aussage ungenau oder missverständlich, Beleg stützt nicht wörtlich, Fassungen weichen im Sinn ab, fehlende Belegzeilen) behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger und werden am Ende der Etappe entschieden. In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung (Runde <n>)`; alle anderen Prüfeinträge bleiben. Danach prüft ein Prüfer nur die geänderten Stellen und die markierten Zeilen. Nach der zweiten Nachprüfung gehen verbleibende Hinweise ins Ledger; Fehler werden weiter behoben.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem letzten Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste <art>-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/<datei>` und `src/data/texte/en/hochschule/<datei>` mit der Belegliste `docs/belege/hochschule/<datei>` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder Crossref, arXiv, ADS), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Kommentare im Code sind kein Beleg; rechne Aussagen über das Modell am Code selbst nach (Skripte nur im Scratchpad). Prüfe:
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

### Task 2: Körper `sun`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-sun.md`, `src/data/texte/en/hochschule/objekt-sun.md`, `docs/belege/hochschule/objekt-sun.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Prüfskript mit arXiv-Pause).
- Produziert: Hochschultext `objekt:sun`; die Links anderer Hochschultexte auf die Sonne führen danach auf ihn statt auf den Gymnasialtext.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Sonne` / `# Sun`. Gliederung Körper mit allen acht Abschnitten; „Oberfläche" behandelt die Photosphäre als sichtbare Oberfläche (Ruling 4). Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: nominelle Sonnenwerte der IAU (Radius, Leuchtkraft, Effektivtemperatur, heliozentrische Gravitationskonstante) und wie sie gemessen werden; warum GM⊙ genauer bekannt ist als M⊙; Abplattung und J₂; Bestrahlungsstärke bei 1 AE und ihre Schwankung im Zyklus; Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren und Beleg. Inneres: Standard-Sonnenmodell, Helioseismologie (Tiefe der Konvektionszone, Heliumhäufigkeit der Hülle, Rotationsprofil und Tachokline), Neutrinos aus pp-Kette und CNO-Zyklus, Häufigkeitsproblem. Oberfläche: Granulation, Randverdunklung, Sonnenflecken. Atmosphäre und Magnetosphäre: Chromosphäre, Übergangsregion, Korona und ihre Heizung, schneller und langsamer Sonnenwind, Messungen der Parker Solar Probe, Heliosphäre und Heliopause (Voyager), Magnetfeld, Zyklus und Hale-Gesetz. Bahn, Rotation und Dynamik: differentielle Rotation, Carrington-Periode, Pol nach IAU, Bewegung der Sonne um das Baryzentrum. Entstehung und Entwicklung: Alter aus den ältesten Meteoritenbestandteilen, Anstieg der Leuchtkraft, Problem der schwachen jungen Sonne, Entwicklung zum Roten Riesen.
- `## Offene Fragen` (Pflicht): etwa Heizung der Korona, Häufigkeitsproblem, Vorhersage der Zyklusstärke.
- `## Im Modell`: Die Sonne ruht im Ursprung statt um das Baryzentrum zu laufen (Größenordnung der Abweichung belegen); starre Drehung mit `rotationPeriodH` 609,12 h (welcher Breite entspricht das?), Nullmeridian `rotationAtEpochDeg` 0 gegen den IAU-Wert W₀; fester Pol; Masse des Datensatzes und G·M⊙ gegenüber dem IAU-Wert (Befund aus 4d-1: 45 ppm, selbst nachrechnen); dargestellter Radius mit `sunDamping` gedämpft (je Maßstabsstufe nennen); Darstellung als leuchtende Textur (Albedokarte als Emissivkarte), Bloom, Randverdunklung ja oder nein; Sonne als Lichtquelle (Art und Abfall des Lichts) und als gleichmäßig helle Scheibe in der Schattenrechnung; Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/sun.ts`, `src/sim/scale.ts` (`scaledRadius`, `SCALE_PRESETS`), `src/sim/orbit.ts` (`rotationAt`, `achsneigungDeg`), `src/render/bodies.ts`, `src/render/lighting.ts`, `src/render/exposure.ts`, `src/render/postfx.ts`, `src/render/shadows.ts` (`sonnenAnteil`), `src/ui/info/datenzeilen.ts`, Gymnasialtext `thema-modell` (Absatz zur Sonne im Ursprung).
- Verweise: `objekt:earth`, `objekt:jupiter`, `thema:entstehung`, `thema:photometrie`, `thema:bezugssysteme`, `thema:innerer-aufbau`, `thema:finsternis`, `szene:ferne-sonne`, `szene:systemblick`, `thema:modell`; Karten zu `objekt:sun`: `quelle:nssdc-sun`, `quelle:nasa-sun`, `quelle:nssdc-factsheets`, `quelle:nasa-eyes`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Prša et al. 2016, nominelle Sonnenwerte (`prsa-2016`); Christensen-Dalsgaard 2021, *Living Reviews in Solar Physics* 18, 2; Basu 2016, *Living Reviews in Solar Physics* 13, 2; Howe 2009, *Living Reviews in Solar Physics* 6, 1; Asplund, Amarsi und Grevesse 2021, *Astronomy & Astrophysics* 653, A141; Magg et al. 2022, *Astronomy & Astrophysics* 661, A140; Borexino Collaboration 2020, CNO-Neutrinos (*Nature* 587, 577); Kopp und Lean 2011, *Geophysical Research Letters* 38, L01706; Hathaway 2015, *Living Reviews in Solar Physics* 12, 4; Kasper et al. 2021, *Physical Review Letters* 127, 255101; Stone et al. 2013, *Science* 341, 150; Archinal et al. 2018 (`archinal-2018`); Petit und Luzum 2010 (`petit-2010`); Connelly et al. 2012 (`connelly-2012`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen (Gemeinsame Vorgaben 1 und 2).
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler (3 bis 6).
- [ ] **Schritt 3:** Deutscher Text, englische Fassung (7 und 8).
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test`; Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-sun.md src/data/texte/en/hochschule/objekt-sun.md docs/belege/hochschule/objekt-sun.md src/data/literatur.ts
git commit -m "Hochschultext Sonne mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit (Gemeinsame Vorgaben 11 bis 13).

---

### Task 3: Körper `moon`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-moon.md`, `src/data/texte/en/hochschule/objekt-moon.md`, `docs/belege/hochschule/objekt-moon.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 und 2.
- Produziert: Hochschultext `objekt:moon`; Task 4 bis 6 verweisen für Modellzahlen des Mondes auf seinen Abschnitt „Im Modell".

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Mond` / `# Moon`. Gliederung Körper mit allen acht Abschnitten. Richtwert 1500 bis 3500 Wörter je Fassung.
- Inhalt mindestens: GM und Radius, Form und Schwerefeld aus GRAIL (Mascons, Grad-2-Koeffizienten und fossile Figur), Trägheitsmomentfaktor und Love-Zahl k₂; Mond-Laserentfernungsmessung als Messverfahren; Tabelle der Kenngrößen mit Wert, Unsicherheit, Verfahren und Beleg. Inneres: Krustendicke und Porosität, Mantel, partiell geschmolzene Schicht, Kern (Neuauswertung der Apollo-Seismik, Dissipation aus der Laserentfernungsmessung), Magmaozean. Oberfläche: Hochland und Maria, Asymmetrie von Vorder- und Rückseite, Procellarum-KREEP-Terran, Südpol-Aitken-Becken, Kraterchronologie mit den Probenaltern von Apollo, Luna und Chang'e, Wassereis in Kältefallen. Atmosphäre und Magnetosphäre: Exosphäre (LADEE), Paläomagnetismus und Dauer des Dynamos, Krustenanomalien, keine eigene Magnetosphäre. Bahn, Rotation und Dynamik: mittlere Elemente, Knotenumlauf 18,6 Jahre, Apsidenumlauf 8,85 Jahre, die großen periodischen Störungen (Evektion, Variation, jährliche Gleichung) mit Amplitude und Periode, Cassini-Gesetze, optische und physikalische Libration, Zunahme des Abstands. Entstehung und Entwicklung: Rieseneinschlag und seine Varianten, Isotopengleichheit mit der Erde, Alter des Mondes.
- `## Offene Fragen` (Pflicht): etwa Entstehungsszenario gegen Isotopengleichheit, Alter des Mondes, Dauer und Stärke des Dynamos, Ursache der Asymmetrie, Zustand des Kerns.
- `## Im Modell` (Ruling 3, nur beschreiben, am Code nachrechnen):
  - Bahn: feste a, e, i gegen die Ekliptik J2000, Winkel linear fortgeschrieben; Knoten- und Perigäumsrate enthalten die allgemeine Präzession (Pilot `szene-mondfinsternis`, Modellgrenzen); keine periodischen Störungen, der Fehler in Länge in der Größenordnung der Evektionsamplitude (belegt); der Mond läuft um den Erdmittelpunkt, der auf dem Erde-Mond-Schwerpunkt sitzt (Pilot `objekt-earth`, Im Modell).
  - Rotation: Rotationsperiode gegen siderische Umlaufzeit des Datensatzes; Nullmeridian `rotationAtEpochDeg` 0 — am Code nachrechnen, um welchen Winkel der Nullmeridian (Mitte der Vorderseite der Textur) von der Richtung zur Erde abweicht, zur Epoche, heute und nach ±100 Jahren; Pol fest in der Lage zur Epoche J2000, der Knoten wandert — Winkel zwischen Pol und Bahnnormale über einen Knotenumlauf nachrechnen (der Cassini-Zustand geht verloren).
  - Maßstab: Mondabstand mit `sizeScale` wie die Radien (`isSatellite`, `scaledPositionAt`).
  - Albedo 0,12 als geometrische Albedo und das Albedo-Modell (Verweis `thema:photometrie`); Datenblockwerte gegen Messwerte.
- Code lesen: `src/data/bodies/moon.ts`, `src/data/bodies/earth.ts`, `src/sim/orbit.ts` (`elementsAt`, `positionAt`, `rotationAt`, `umlaufzeitTage`, `achsneigungDeg`), `src/sim/frames.ts`, `src/sim/scale.ts` (`isSatellite`, `scaledPositionAt`), `src/render/bodies.ts` (Ausrichtung der Textur), `src/render/albedo.ts`, `src/ui/info/datenzeilen.ts`.
- Verweise: `objekt:earth`, `objekt:sun`, `thema:gebundene-rotation`, `thema:finsternis`, `thema:gezeiten`, `thema:innerer-aufbau`, `thema:entstehung`, `thema:bahnelemente`, `thema:bezugssysteme`, `thema:photometrie`, `szene:mondtanz`, `szene:mondfinsternis`, `thema:modell`; Karten zu `objekt:moon`: `quelle:nssdc-moon`, `quelle:nasa-moon`, `quelle:jpl-satelliten`, `quelle:nasa-gebundene-rotation`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Zuber et al. 2013, GRAIL-Schwerefeld (*Science* 339, 668); Wieczorek et al. 2013, Kruste (*Science* 339, 671); Konopliv et al. 2013, *Journal of Geophysical Research: Planets* 118, 1415; Williams et al. 2014 (`williams-2014`); Weber et al. 2011 (`weber-2011`); Garcia et al. 2011, *Physics of the Earth and Planetary Interiors* 188, 96; Williams und Boggs 2016 (`williams-2016`); Canup 2012 (`canup-2012`); Ćuk und Stewart 2012 (`cuk-2012`); Barboni et al. 2017 (`barboni-2017`); Borg et al. 2011, *Nature* 477, 70; Weiss und Tikoo 2014, *Science* 346, 1246753; Colaprete et al. 2010, *Science* 330, 463; Li et al. 2021, Chang'e-5 (*Nature* 600, 54); Benna et al. 2015, LADEE (*Geophysical Research Letters* 42, 3723); Gutzwiller 1998, *Reviews of Modern Physics* 70, 589. Neuere Ergebnisse zu Proben der Rückseite (Chang'e-6) per Websuche.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, die Modellwinkel (Nullmeridian gegen Richtung zur Erde, Pol gegen Bahnnormale) im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-moon.md src/data/texte/en/hochschule/objekt-moon.md docs/belege/hochschule/objekt-moon.md src/data/literatur.ts
git commit -m "Hochschultext Mond mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 4: Thema `gebundene-rotation`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-gebundene-rotation.md`, `src/data/texte/en/hochschule/thema-gebundene-rotation.md`, `docs/belege/hochschule/thema-gebundene-rotation.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 3 (Abschnitt „Im Modell" des Mondtexts für die Modellwinkel des Mondes).
- Produziert: Hochschultext `thema:gebundene-rotation`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Gebundene Rotation` / `# Tidal locking`. Richtwert 1500 bis 4000 Wörter je Fassung.
- Inhalt mindestens: Gezeitendrehmoment und Zeitskala des Abbremsens als Formel mit ihrer Abhängigkeit von Abstand, Massen, k₂/Q und Anfangsdrehung, dazu eine Beispielrechnung; synchroner Endzustand und Spin-Bahn-Resonanzen samt Einfangwahrscheinlichkeit (Merkur 3:2, Rolle der permanenten Deformation (B − A)/C); Cassini-Zustände und die Cassini-Gesetze des Mondes; optische und physikalische Libration mit den Größen beim Mond; Messung der Rotation von Monden (Kontrollpunktnetze, Radar, Schwerefeld); doppelt gebundenes System Pluto–Charon; Venus zwischen Gezeiten des festen Körpers und der Atmosphäre; chaotische Rotation (Hyperion); nicht-synchrone Rotation (Europa, Titan); Tabelle gebundener Körper im Sonnensystem (Auswahl mit Beleg und Verfahren).
- `## Offene Fragen` (Pflicht): etwa Rotationszustand von Titan und Europa, Gleichgewicht der Venusrotation, Einfang Merkurs in 3:2 — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: `rotationAt` dreht linear mit `rotationPeriodH` ab `rotationAtEpochDeg` um einen festen Pol. Am Code nachrechnen und als Tabelle zeigen: für jeden Mond und für Merkur das Verhältnis von Rotationsperiode zu siderischer Umlaufzeit des Datensatzes und, bei 1:1, den Winkel zwischen Nullmeridian und Richtung zum Mutterkörper zur Epoche und nach 100 Jahren; Pluto–Charon. Libration entsteht im Modell nur aus Exzentrizität und Neigung der Bahn gegen den festen Pol; keine physikalische Libration, keine Cassini-Zustände. Zahlen für den Mond wie im Mondtext (Task 3).
- Code lesen: `src/sim/orbit.ts` (`rotationAt`, `umlaufzeitTage`, `elementsAt`), `src/render/bodies.ts` (wie die Drehung auf das Netz wirkt, Lage des Nullmeridians in der Textur), `src/data/bodies/moon.ts`, `mercury.ts`, `venus.ts`, `mars-monde.ts`, `jupiter-monde.ts`, `saturn-monde.ts`, `uranus-monde.ts`, `neptun-monde.ts`, `pluto-system.ts`.
- Verweise: `objekt:moon`, `objekt:mercury`, `objekt:venus`, `objekt:pluto`, `objekt:charon`, `objekt:phobos`, `objekt:europa`, `objekt:titan`, `thema:gezeiten`, `thema:resonanzen`, `thema:innerer-aufbau`, `szene:pluto-charon`, `szene:mondtanz`, `thema:modell`; Karte zu `thema:gebundene-rotation`: `quelle:nasa-gebundene-rotation`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Gladman et al. 1996 (`gladman-1996`); Murray und Dermott, Kap. 5 (`murray-2000`); Goldreich und Peale 1966, *Astronomical Journal* 71, 425; Colombo 1966, *Astronomical Journal* 71, 891; Peale 1969, *Astronomical Journal* 74, 483; Correia und Laskar 2004 (`correia-2004`); Correia und Laskar 2001, *Nature* 411, 767; Wisdom, Peale und Mignard 1984, *Icarus* 58, 137; Thomas et al. 2007, Hyperion (*Nature* 448, 50); Meriggiola et al. 2016, Titanrotation (*Icarus* 275, 183); Efroimsky und Lainey 2007 (`efroimsky-2007`); Williams und Boggs 2016 (`williams-2016`).
- Neue Testfälle: 2 Dateien × 10 = 20.

- [ ] **Schritt 1:** Vorlage und Code lesen, Tabelle der Modellwerte im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-gebundene-rotation.md src/data/texte/en/hochschule/thema-gebundene-rotation.md docs/belege/hochschule/thema-gebundene-rotation.md src/data/literatur.ts
git commit -m "Hochschultext Gebundene Rotation mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 5: Thema `finsternis`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-finsternis.md`, `src/data/texte/en/hochschule/thema-finsternis.md`, `docs/belege/hochschule/thema-finsternis.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 4.
- Produziert: Hochschultext `thema:finsternis`; der Pilot `szene-mondfinsternis` verweist darauf und zeigt danach keinen Ersatz mehr.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Finsternisse` / `# Eclipses`. Richtwert 1500 bis 4000 Wörter je Fassung.
- Inhalt mindestens: Geometrie von Kern-, Halb- und Gegenschatten; Arten der Sonnenfinsternis (total, ringförmig, hybrid, partiell) und der Mondfinsternis (Halbschatten, partiell, total) mit ihren Bedingungen aus Winkelradien und Abständen als Formel; Finsternisgrenzen und Knotennähe, Größe (Magnitude) und Gamma; Periodizitäten: Finsternisjahr, Saros aus synodischem, drakonitischem und anomalistischem Monat (Tabelle), Inex, Saros-Reihen; Besselsche Elemente als Rechenverfahren; Vergrößerung des Erdschattens (Chauvenet gegen Danjon) nur knapp mit Verweis auf `szene:mondfinsternis`; ΔT und alte Finsternisse; Finsternisse als Forschungsmittel (Korona und Helium, Lichtablenkung 1919 und ihre Nachauswertungen, Verfinsterungen von Io und die Lichtgeschwindigkeit, gegenseitige Ereignisse der Galileischen Monde, Pluto–Charon-Ereignisse 1985 bis 1990, Merkur- und Venustransits); Finsternisse bei anderen Planeten (Phobos vor der Sonne vom Mars aus, Schatten der Jupitermonde).
- `## Offene Fragen` (Pflicht): etwa Ursachen der Schattenvergrößerung und ihre Schwankung, Fortschreibung von ΔT, Bewertung der Messungen von 1919 — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: was `src/sim/finsternis.ts` sucht (nur Mondfinsternisse? Verfahren, Schrittweite, `KERNSCHATTEN_VERGROESSERUNG`, `SUCHE_MAX_TAGE`, Einteilung der Arten) und was `src/render/shadows.ts` zeichnet (welche Körper werfen Schatten auf welche, `MAX_OKKLUDER`, Sonnenanteil der als gleichmäßig hell gerechneten Scheibe, Kernschattenfarbe); ob Sonnenfinsternisse als Mondschatten auf der Erde und Schatten von Monden auf ihren Planeten erscheinen; Genauigkeit der Zeitpunkte gegen den NASA-Katalog mit denselben Zahlen wie im Pilot `szene-mondfinsternis` (135 von 143, Präzession in den Raten; Ruling 8). Nur beschreiben, was der Code zeigt.
- Code lesen: `src/sim/finsternis.ts`, `src/render/shadows.ts` (samt GLSL-Zwilling `sonnenAnteil`), `src/render/lighting.ts`, `src/data/bodies/earth.ts` (Kernschattenfarbe), `src/data/bodies/moon.ts`, `src/data/scenes.ts` (Eintrag `mondfinsternis`, `zeitpunkt`), `src/app/cinema.ts` (Sprung auf die nächste Finsternis).
- Verweise: `szene:mondfinsternis`, `objekt:moon`, `objekt:earth`, `objekt:sun`, `objekt:io`, `objekt:jupiter`, `objekt:phobos`, `objekt:charon`, `objekt:mercury`, `objekt:venus`, `thema:bezugssysteme`, `thema:gezeiten`, `thema:bahnelemente`, `thema:modell`; Karten zu `thema:finsternis`: `quelle:nasa-eclipse`, `quelle:wikipedia-de-mondfinsternis`, `quelle:wikipedia-en-lunar-eclipse`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Espenak und Meeus 2009, Kanon der Mondfinsternisse (`espenak-2009`); Espenak und Meeus 2006, Five Millennium Canon of Solar Eclipses (NASA/TP-2006-214141); Stephenson, Morrison und Hohenkerk 2016 (`stephenson-2016`); Morrison et al. 2021 (`morrison-2021`); Herald und Sinnott 2014 (`herald-2014`); Dyson, Eddington und Davidson 1920, *Philosophical Transactions of the Royal Society A* 220, 291; Kennefick 2009, *Physics Today* 62 (3), 37; Pasachoff 2009, *Nature* 459, 789; Buie, Tholen und Horne 1992, *Icarus* 97, 211; Auswertungen der PHEMU-Kampagnen (Arlot et al.) per Websuche.
- Neue Testfälle: 2 Dateien × 10 = 20.

- [ ] **Schritt 1:** Vorlage und Code lesen (einschließlich des Piloten `szene-mondfinsternis` und seiner Belegliste).
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-finsternis.md src/data/texte/en/hochschule/thema-finsternis.md docs/belege/hochschule/thema-finsternis.md src/data/literatur.ts
git commit -m "Hochschultext Finsternisse mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 6: Szene `mondtanz`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-mondtanz.md`, `src/data/texte/en/hochschule/szene-mondtanz.md`, `docs/belege/hochschule/szene-mondtanz.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 5 (Modellzahlen des Mondes aus Task 3).
- Produziert: Hochschultext `szene:mondtanz`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Der Tanz des Mondes` / `# Scene: The dance of the Moon` (wie die Gymnasialfassungen). Gliederung Szene: „Was das Bild zeigt", „Hintergrund", „Modellgrenzen" (Pflicht). Richtwert 300 bis 900 Wörter je Fassung.
- **Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `mondtanz`, Index 2: Bahntyp `orbit` um die Erde, `distanceBasis` `bodyRadius`, `distanceInRadii` 150, `elevationDeg` 55, `azimuthRateDegPerSec` 0,5, `durationSec` 45, `timeRateDaysPerSec` 0,9, Streuung `azimuthDeg` 0 bis 360, `elevationDeg` −25 bis 30, `distanceFactor` 0,8 bis 1,2) und ihrer Auswertung in `src/render/camera/cinema.ts` (bezieht sich der Abstand auf den dargestellten Radius, wie wirkt die Streuung der Höhe?); Zeitspanne einer Szene und Bruchteil eines Mondumlaufs; Winkelgröße von Erde, Mond und Mondbahn vom Blickpunkt bei Sichtfeld 50° (`KAMERA_FOV_GRAD`), nachgerechnet.
- **Hintergrund:** die Monate (siderisch, synodisch, anomalistisch, drakonitisch, tropisch) als Tabelle; die großen periodischen Störungen mit Amplitude und Periode; Schwankung der Perigäums- und Apogäumsabstände; Schwerpunkt des Systems und Taumeln der Erde; Krümmung der Mondbahn um die Sonne.
- **Modellgrenzen:** Kepler-Ellipse ohne periodische Störungen mit Raten nach Meeus (Zahlen wie im Mondtext); die Bahnlinie ist die momentane Ellipse (`bahnellipseRelativKm`); die Erde pendelt nicht um den Schwerpunkt; Mondabstand mit `sizeScale` wie die Radien; Verhalten des Zeitraffers beim Szenenstart, falls der Code ihn gleiten lässt.
- Code lesen: `src/data/scenes.ts`, `src/render/camera/cinema.ts`, `src/sim/director.ts`, `src/app/cinema.ts`, `src/data/bodies/moon.ts`, `src/sim/orbit.ts` (`bahnellipseRelativKm`), `src/sim/scale.ts`, `src/render/orbits.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`).
- Verweise: `objekt:moon`, `objekt:earth`, `thema:gebundene-rotation`, `thema:bahnelemente`, `thema:gezeiten`, `szene:mondfinsternis`, `thema:modell`; Karten zu `szene:mondtanz`: `quelle:nssdc-moon`, `quelle:nasa-moon`, `quelle:nasa-gebundene-rotation`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Gutzwiller 1998 (siehe Task 3); Chapront-Touzé und Chapront 1983, *Astronomy & Astrophysics* 124, 50; Simon et al. 1994, *Astronomy & Astrophysics* 282, 663; Williams und Boggs 2016 (`williams-2016`); Park et al. 2021 (`park-2021`).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Winkelgrößen im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-mondtanz.md src/data/texte/en/hochschule/szene-mondtanz.md docs/belege/hochschule/szene-mondtanz.md src/data/literatur.ts
git commit -m "Hochschultext Szene Tanz des Mondes mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 7: Szene `erdaufgang`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-erdaufgang.md`, `src/data/texte/en/hochschule/szene-erdaufgang.md`, `docs/belege/hochschule/szene-erdaufgang.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 6.
- Produziert: Hochschultext `szene:erdaufgang`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Sonnenaufgang über dem Erdrand` / `# Scene: Sunrise over the limb of the Earth` (wie die Gymnasialfassungen; die Kennung `erdaufgang` ist historisch, die Szene zeigt den Terminator der Erde). Gliederung Szene. Richtwert 300 bis 900 Wörter je Fassung.
- **Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `erdaufgang`, Index 0: Bahntyp `orbit` um die Erde, `distanceBasis` `bodyRadius`, `distanceInRadii` 2,4, `elevationDeg` 6, `azimuthRateDegPerSec` 1,2, `durationSec` 40, `timeRateDaysPerSec` 0,02, Streuung `azimuthDeg` 0 bis 360, `elevationDeg` −4 bis 10, `distanceFactor` 0,9 bis 1,3) und ihrer Auswertung in `src/render/camera/cinema.ts`; Drehwinkel der Erde während einer Szene; Winkelgröße der Erde vom Blickpunkt bei Sichtfeld 50°, nachgerechnet; Lage des Terminators.
- **Hintergrund:** Terminator und Deklination der Sonne; Definition von Auf- und Untergang (Refraktion am Horizont und Sonnenhalbmesser), Dämmerungsstufen; Schwankung der Horizontrefraktion; Aussehen des Erdrands aus der Umlaufbahn (Rayleigh-Streuung, Ozonabsorption im Chappuis-Band, abgeplattete Sonnenscheibe, Luftleuchten); Umlaufzeit und Zahl der Sonnenaufgänge je Tag in 400 km Höhe (nachgerechnet).
- **Modellgrenzen:** keine Atmosphäre und keine Wolken (an Code und Textur prüfen); Terminator aus dem Beleuchtungsmodell (Lambert, Fülllicht der Nachtseite, `lighting.ts`); Drehlage der Erde um rund 75° verdreht, Tag und Nacht über falschen Längen (Zahl wie im Pilot `objekt-earth`, auf das Datum bezogen; Ruling 8); fester Pol; Belichtung und Tonemapping; ob die Sonne im Bild als Scheibe erscheint und wie groß (gedämpfter Radius).
- Code lesen: `src/data/scenes.ts`, `src/render/camera/cinema.ts`, `src/data/bodies/earth.ts`, `src/sim/orbit.ts` (`rotationAt`), `src/sim/scale.ts`, `src/render/bodies.ts`, `src/render/lighting.ts`, `src/render/exposure.ts`, `src/render/renderer.ts` (`KAMERA_FOV_GRAD`).
- Verweise: `objekt:earth`, `objekt:sun`, `thema:achsneigung`, `thema:bezugssysteme`, `thema:photometrie`, `thema:modell`; Karten zu `szene:erdaufgang`: `quelle:nssdc-earth`, `quelle:nasa-earth`, `quelle:esa-erdbeobachtung`, `quelle:jpl-photojournal-earth`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Urban und Seidelmann (Hrsg.) 2013, *Explanatory Supplement to the Astronomical Almanac*, 3. Aufl. (Auf- und Untergang, Refraktion); Bennett 1982, *Journal of Navigation* 35, 255; Young 2004, *Astronomical Journal* 127, 3622; Hulburt 1953, *Journal of the Optical Society of America* 43, 113.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Vorlage und Code lesen, Winkelgrößen und Drehwinkel im Scratchpad nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-erdaufgang.md src/data/texte/en/hochschule/szene-erdaufgang.md docs/belege/hochschule/szene-erdaufgang.md src/data/literatur.ts
git commit -m "Hochschultext Szene Sonnenaufgang über dem Erdrand mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 8: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe3-abnahme.md`
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

Expected: Lint ohne Befund; alle Tests grün (Soll 3961 nach „Testzahlen" oben, zuzüglich Tests aus Zwischen-Tasks); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, Ausgangsstand 1 299,03 kB nach Flug Etappe 2); Prüfskript über den ganzen Katalog mit 0 Fehlern und ohne 429, Laufzeit notieren. Schlusszeilen, die Katalogzahl (Ausgangsstand 199) und die vollständige Ausgabe des Prüfskripts ins Protokoll; jede Warnung begründen.

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

Kombinationen: Sprachen `de`, `en` × die sechs Kennungen. Zustand setzen wie in der Abnahme 4d-2: Körper über `setInfo({ thema: null })` und `setCamera({ targetId: 'sun', mode: 'free' })` beziehungsweise `targetId: 'moon'`; Themen über `setInfo({ thema: 'gebundene-rotation' })` beziehungsweise `thema: 'finsternis'`; Szenen über `setCinema({ running: true, shuffle: false, nummer: 2 })` (`mondtanz`) beziehungsweise `nummer: 0` (`erdaufgang`), `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setUi({ hidden: false })`. Auf den Kopfwechsel pollen (Titel wie in der ersten Zeile des Texts), Hinweise erst nach dem Auflösen des faulen Imports werten, dann auswerten:

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

Je Sprache: Pilot `objekt-earth` öffnen (`setInfo({ thema: null })`, `setCamera({ targetId: 'earth', mode: 'free' })`), den ersten Verweis `a[data-verweis="objekt:moon"]` klicken, auf den Kopf „Mond" / „Moon" pollen, dann: keine Hinweiszeile im Textbereich. Ebenso Fachthema `gezeiten` öffnen (`setInfo({ thema: 'gezeiten' })`), `a[data-verweis="thema:gebundene-rotation"]` klicken, Kopf „Gebundene Rotation" / „Tidal locking", keine Hinweiszeile. Vier Messungen, Ergebnis mit Wartezeit in ms ins Protokoll.

- [ ] **Schritt 5: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 6: Protokoll `docs/phase4d-etappe3-abnahme.md`**

Gliederung:

```md
# Abnahme Phase 4d Etappe 3 „Sonne, Erde–Mond"

## 1. Umfang
(Commits der Etappe mit Kurzhash und Titel, Branch, Plan, Entwurf)

## 2. Lint, Tests, Build
(Schlusszeilen; Testzahl als eine durchgehende Tabelle Task → Zuwachs → Summe mit Quelle; Größe des Hauptchunks gegenüber dem Ausgangsstand und Zahl der Katalogeinträge)

## 3. Prüfskript
(vollständige Ausgabe, Laufzeit, Begründung jeder Warnung; Wirkung der arXiv-Pause aus Task 1)

## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Runden | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |

## 5. Sichtprüfung
### 5.1 Rundgang
### 5.2 Ersatz entfällt
### 5.3 Konsole

## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:")

## 7. Bekannte Unschärfen
(einschließlich der Befunde am Simulationscode, die die Texte beschreiben, als Kandidaten für eigene Tasks)

## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer; gemeldete Fehler in Gymnasialtexten)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, nicht geschätzt; jede Summe nachrechnen. Die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung nennen, ohne Suchmuster.

- [ ] **Schritt 7: README**

In `README.md` im Absatz zu Phase 4d den Satzteil

```md
Pilottexte (Bahnelemente, Erde, Mondfinsternis); Etappe 2 die sechs
Fachthemen (Bezugssysteme und Zeitskalen, Gezeiten, Bahnresonanzen, innerer
Aufbau, Albedo und Helligkeit, Entstehung des Sonnensystems). Offen sind die
übrigen Hochschultexte (Etappen 4d-3 bis 4d-11) und Phase 5 (Ambient-Sound,
```

ersetzen durch:

```md
Pilottexte (Bahnelemente, Erde, Mondfinsternis); Etappe 2 die sechs
Fachthemen (Bezugssysteme und Zeitskalen, Gezeiten, Bahnresonanzen, innerer
Aufbau, Albedo und Helligkeit, Entstehung des Sonnensystems); Etappe 3 Sonne,
Mond, Finsternisse, gebundene Rotation und die Szenen „Der Tanz des Mondes"
und „Sonnenaufgang über dem Erdrand". Offen sind die übrigen Hochschultexte
(Etappen 4d-4 bis 4d-11) und Phase 5 (Ambient-Sound,
```

Danach die Zeilenumbrüche des Absatzes glätten (Zeilen bis rund 80 Zeichen), ohne den Wortlaut zu ändern.

- [ ] **Schritt 8: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe3-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm (Aufnahmen, Skripte löschen).

```bash
git add docs/phase4d-etappe3-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 3: Sonne, Erde–Mond"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe; Paket ohne die fachgeprüften Texte und Beleglisten, mit Task 1, Katalogeinträgen und Protokoll); Befunde gebündelt nacharbeiten, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-3` nach `master`, Branch löschen, **nicht pushen**.
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Befunde am Simulationscode als Kandidaten. Etappe 4d-4 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- Umsetzer der Text-Tasks (2 bis 7) und Fachprüfer auf dem stärksten Modell; Task 1, Abnahme und Nachreviews auf dem mittleren. In 4d-1 und 4d-2 fand die Fachprüfung in fast jedem Text echte Fehler; auch Nachprüfungen fanden noch Hinweise.
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace `.superpowers/sdd/2026-09-19-phase4d-hochschule-etappe3/` (Ausgabelimits brachen in 4d-1 Agenten ab).
- Fachprüfer laufen parallel zum nächsten Umsetzer; Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`.
- Jeder Umsetzer bekommt die Gemeinsamen Vorgaben, seinen Task und die Globalen Randbedingungen wörtlich; die Modellzahlen des Mondes aus Task 3 (Nullmeridian, Pol, Präzession) gibt der Controller an Task 4 bis 6 weiter.

## Rulings

Entscheidungen der Planung (19.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** Das Prüfskript wartet nach jedem arXiv-Abruf drei Sekunden (Task 1), statt bei 429 zu wiederholen: Die Nutzungsbedingungen der arXiv-API nennen den Abstand ausdrücklich, und eine Wiederholung bei 429 widerspräche Ruling 3 des Plans 4d-2 („429 gilt sofort"). Der Volllauf wird dadurch um rund zwei Minuten länger.
2. **Ruling:** Kein eigener Verweis-Task: Alle sechs Kennungen haben Gymnasialtexte, deshalb dürfen die Text-Tasks einander schon vor der Fertigstellung verlinken (Ersatz nach Entwurf §5.5 Punkt 6). Die fachgeprüften Texte aus 4d-1 und 4d-2 bleiben unverändert; ihre vorhandenen Verweise (`objekt-earth` → `objekt:moon`, `szene:erdaufgang`; `szene-mondfinsternis` → `objekt:moon`, `thema:finsternis`; `thema-gezeiten` → `thema:gebundene-rotation`; weitere auf `objekt:moon`) führen danach auf die Hochschultexte. Neue Verweise aus alten Texten auf `objekt:sun` oder `szene:mondtanz` kommen erst mit einer inhaltlichen Änderung dieser Texte.
3. **Ruling:** Befunde am Simulationscode (Mondraten mit Präzession, Erde im Erde-Mond-Schwerpunkt, Drehlage der Erde, fester Mondpol, Nullmeridian der Sonne und andere, die die Texte aufdecken) werden in 4d-3 nicht behoben. Die Texte beschreiben den Code zum Zeitpunkt des Tasks; neue Befunde gehen ins Ledger und als Kandidaten für eigene Tasks ins Protokoll (§7). Entscheidet Jens, einen davon vorher zu beheben, passt der Code-Task die betroffenen Abschnitte aller Hochschultexte an, auch der fachgeprüften.
4. **Ruling:** Im Sonnentext behandelt der Abschnitt „Oberfläche" die Photosphäre als sichtbare Oberfläche. Entwurf §5.1 lässt „Oberfläche" nur bei Gasplaneten entfallen und weist Chromosphäre, Korona und Heliosphäre dem Abschnitt „Atmosphäre und Magnetosphäre" zu; für Granulation, Randverdunklung und Flecken bliebe sonst kein Ort.
5. **Ruling:** Reihenfolge Sonne, Mond, gebundene Rotation, Finsternisse, Tanz des Mondes, Sonnenaufgang: Die Themen und die Mondszene übernehmen Modellzahlen aus dem Mondtext, die Finsternisse brauchen Sonne und Mond, die Szenen verweisen für Einzelheiten auf die Körpertexte.
6. **Ruling:** Beide Themen haben `## Offene Fragen` als Pflichtabschnitt (wie fünf der sechs Fachthemen in 4d-2, Plan 4d-2 Ruling 5).
7. **Ruling:** Jede Szene ist ein eigener Task, obwohl Entwurf §7 kurze Szenen zu zweit erlaubt: Die beiden Szenen haben verschiedene Gegenstände (Mondbahn gegen Terminator der Erde), und je Task bleibt die Fachprüfung auf einen Text beschränkt.
8. **Ruling:** Modellzahlen, die schon in einem fachgeprüften Text stehen (etwa Pilot `szene-mondfinsternis`: 135 von 143 Kernschattenfinsternissen, Präzession 1,4° je Jahrhundert; Pilot `objekt-earth`: Globus um 75,4° verdreht am 17. September 2026), übernehmen die neuen Texte gleichlautend. Ergibt die eigene Nachrechnung einen anderen Wert, meldet der Umsetzer das im Bericht und im Ledger; der fachgeprüfte Text wird nicht in dieser Etappe geändert, die Frage geht an Jens (§8).
9. **Ruling:** Die Nacharbeit nach der Fachprüfung umfasst Fehler und sachliche Hinweise; Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger. Nach der zweiten Nachprüfung gehen verbleibende Hinweise ins Ledger (wie Plan 4d-2, Ruling 7).
10. **Ruling:** Tausendertrennung in neuen Texten ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma), wie Plan 4d-2 Ruling 8.
11. **Ruling:** Die Fachprüfung bekommt einen siebten Prüfpunkt „Widerspruch zu einem fachgeprüften Hochschultext": Mit 15 Hochschultexten wächst die Gefahr, dass neue Texte älteren in Modellzahlen widersprechen (4d-2: Erdalbedo im Pilot gegen `thema-photometrie`, Schlussprüfung M1).
12. **Ruling:** Eine Sichtprüfung des Formelsatzes entfällt, solange kein neuer TeX-Befehl dazukommt; kommt einer dazu, misst der Zwischen-Task ihn wie in 4d-2 als Differenzbild in derselben Ladung, Abstände relativ zum Formelanfang (bestätigte Messvorlage, Abnahme 4d-2 §8 Frage 1).
13. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle. Die Abnahme notiert Größe des Hauptchunks und Zahl der Einträge; wächst der Chunk gegenüber dem Ausgangsstand (1 299,03 kB) um mehr als 50 kB, geht die Frage des faulen Ladens an Jens (wie Plan 4d-2 Ruling 11).
14. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master` und wird nicht gepusht; Jens gibt danach 4d-4 frei. Änderungswünsche an den Texten kommen als eigene Commits.
