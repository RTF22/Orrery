# Entstehungsgeschichte — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Zwei zweisprachige Dokumente über die Entstehung von Orrery (Überblick und Chronik) mit Screenshots, Tokenbilanz und dem Leitmotiv „deterministische Anwendung mit nicht deterministischem Werkzeug“, verlinkt aus der README.

**Architektur:** Erst Material (Faktenblatt, Fehlerkatalog, Tokenbilanz, Bilder) im git-ignorierten Ledger beziehungsweise unter `docs/bilder/entstehung/`, dann die deutsche Chronik in vier Teilen, daraus der deutsche Überblick, eine Fachprüfung, dann die englischen Fassungen, zuletzt Verlinkung und Abnahme. Jede Zahl in den Texten stammt aus dem Material und trägt dort eine Fundstelle.

**Tech-Stack:** Markdown (GitHub-Darstellung), Git, Python 3.12 mit Pillow und numpy (kein matplotlib installiert), Playwright-MCP am Entwicklungsserver, Node/npm für die Abschlussprüfungen.

**Entwurf:** `docs/superpowers/specs/2026-09-25-entstehung-design.md` (Umsetzer lesen ihn vor jedem Task).

## Globale Randbedingungen

- Alles auf Deutsch außer den `.en.md`-Dateien; Umlaute korrekt, keine Ersatzschreibweisen.
- **Wortregel mit Ausnahme:** Produkt- und Herstellername des KI-Assistenten dürfen **nur** in `docs/entstehung.de.md`, `docs/entstehung.en.md`, `docs/chronik.de.md`, `docs/chronik.en.md` stehen. Nicht in diesem Plan, im Entwurf, im Abnahmeprotokoll, in Bildnamen, Alt-Texten anderer Dateien oder Commit-Texten. Nach jedem Commit die Trailer- und Wortkontrolle aus der lokalen Projektanleitung; die Baumkontrolle schließt ab Task 5 genau die vier Dateien aus. Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei, auch nicht in den vier Texten („die lokale Projektanleitung“).
- **Keine Geldbeträge**, nur Tokens (Jens, 25.09.2026).
- **Datenschutz:** In versionierten Dateien keine E-Mail-Adressen, keine Benutzerpfade (Windows-Benutzerordner, Protokollordner des Assistenten), keine Server- oder Hostnamen des Webspace, keine Zugangsdaten, keine wörtlichen Auszüge aus Sitzungsprotokollen. Erlaubt: die öffentlichen Adressen `https://orrery3d.de`, `https://www.jensfricke.com/Orrery/`, `https://github.com/RTF22/Orrery`.
- **Faktentreue:** Jede Zahl, jedes Datum und jedes Commit-Kürzel in den Texten steht im Faktenblatt, im Fehlerkatalog oder in der Tokenbilanz, jeweils mit Fundstelle. Kommentare im Code sind kein Beleg. Was dort fehlt, kommt nicht in den Text.
- Ledger: `.superpowers/sdd/2026-09-25-entstehung/` (git-ignoriert) mit `progress.md`, `faktenblatt.md`, `fehlerkatalog.md`, `tokenbilanz.md`, `tokenbilanz.py`, `pruefung.md` und dem Prüfskript `pruefe.sh` (liegt vor Task 1 bereit). `bash .superpowers/sdd/2026-09-25-entstehung/pruefe.sh` führt Wortkontrolle mit Ausnahme der vier Dateien, Datenschutzprüfung aller versionierten Dateien und Trailerkontrolle des letzten Commits aus und gibt ohne Befund nur `ok` aus. Die Muster stehen nur dort, nicht in versionierten Dateien. Rulings als Zeile „Ruling: …“ in `progress.md`.
- Branch `entstehung` (existiert, trägt den Entwurf), **kein Worktree**. Entwicklungsserver: erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents`); Umsetzer und Prüfer auf dem mittleren Modell, das stärkste nur nach zweimaligem Scheitern; bei Kontingentlimit das kleinste, im Protokoll §8 vermerken. Höchstens eine Prüfrunde je Text.
- Vor jedem Commit `git status --short`, nur gezielt `git add`; Playwright-Reste (`.playwright-mcp/*.png`, Skripte im Projektstamm) löschen.
- Zahlenformat: Deutsch `1 549,24 kB`, `10,4 Mrd.`; Englisch `1,549.24 kB`, `10.4 billion`. Datumsangaben Deutsch `11.09.2026`, Englisch `11 September 2026`.
- Sprungmarken: Jeder Abschnitt der Chronik beginnt mit einer festen Marke `<a id="…"></a>` (Liste in Task 5), in beiden Sprachen gleich. Der Überblick verlinkt nur auf diese Marken.

## Prüfschwerpunkte

1. **Erfundene Fakten:** Eine Zahl oder ein Ereignis im Text ohne Zeile im Material. Erwartung: Die Fachprüfung (Task 10) gleicht jede Zahl ab; Tasks 5–9 führen je Absatz die Fundstelle im Ledger mit.
2. **Wortregel-Leck:** Produktname in einer anderen versionierten Datei oder im Commit-Text. Erwartung: `pruefe.sh` gibt `ok` aus — nach jedem Commit.
3. **Datenschutz-Leck:** Benutzerpfad, E-Mail, Hostname oder Protokollauszug. Erwartung: `pruefe.sh` gibt `ok` aus — nach jedem Commit ab Task 3.
4. **Kaputte Verweise:** Link auf eine fehlende Datei, eine fehlende Sprungmarke oder die falsche Sprachfassung. Erwartung: Linkprüfung aus Task 13 Schritt 3 ohne „FEHLT“ — ab Task 9 nach jedem Textcommit.
5. **Zahlen DE ≠ EN:** Übersetzung ändert eine Zahl oder rundet anders. Erwartung: Zahlenabgleich in Task 11/12 (Schritt „Zahlen abgleichen“) ohne Abweichung außer dem Format.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Faktenblatt | Ledger `faktenblatt.md` |
| 2 | Fehlerkatalog | Ledger `fehlerkatalog.md` |
| 3 | Tokenbilanz | Ledger `tokenbilanz.py`, `tokenbilanz.md`; `docs/bilder/entstehung/tokens-je-tag.svg` |
| 4 | Screenshots | `docs/bilder/entstehung/*.jpg` |
| 5–8 | Chronik DE | `docs/chronik.de.md` |
| 9 | Überblick DE | `docs/entstehung.de.md` |
| 10 | Fachprüfung und Nacharbeit | Ledger `pruefung.md`; `docs/chronik.de.md`, `docs/entstehung.de.md` |
| 11 | Überblick EN | `docs/entstehung.en.md` |
| 12 | Chronik EN | `docs/chronik.en.md` |
| 13 | Verlinkung, Abnahme | `README.md`, `README.de.md`, `docs/entstehung-abnahme.md`; lokale Projektanleitung (nicht versioniert) |

Ruling (Plan): Das Diagramm wird SVG statt PNG (kein matplotlib; SVG bleibt scharf und wird von GitHub dargestellt). Farben und Achsen nach dem Skill `dataviz`.

---

### Task 1: Faktenblatt

**Dateien:** Ledger `faktenblatt.md` (neu). Kein Commit im Repository (Ledger ist git-ignoriert); Abschluss mit Eintrag in `progress.md`.

**Liefert:** Abschnitte mit genau diesen Überschriften, weil spätere Tasks sie lesen:
`## Zeitleiste`, `## Phasengrenzen`, `## Kennzahlen je Etappe`, `## Entscheidungen`, `## Weg zur Domain`, `## Arbeitsweise`.

- [ ] **Schritt 1: Commits je Tag und Tags**

```bash
git log --format='%ad' --date=short | sort | uniq -c
git tag -l --format='%(refname:short) %(creatordate:iso) %(objectname:short)'
git rev-list --count f3807c7
```

In `## Zeitleiste` eine Tabelle `Datum | Commits | Meilensteine | Fundstelle` für 11.09. bis 25.09.2026; Meilensteine aus Tags, Abnahmeprotokollen (`docs/*-abnahme.md`, Datum des ersten Commits je Datei per `git log --diff-filter=A --format=%ad --date=short -- <datei> | tail -1`) und Commit-Betreffen.

- [ ] **Schritt 2: Phasengrenzen**

Für jede Phase oder Etappe den ersten und letzten Commit mit ISO-Zeitstempel (`git log --format='%h %aI %s'`), Tag falls vorhanden. Reihenfolge nach Datum, auch für eingeschobene Etappen (Klickflächen, Zeitbereich, Flug 1 und 2, Zielbelichtung). Tabelle `Kennung | Titel | Beginn (ISO) | Ende (ISO) | Tag | Protokoll`. Kennungen genau: `idee`, `phase-1`, `phase-2`, `phase-3a`, `phase-3b`, `phase-4a`, `phase-4b`, `klickflaechen`, `phase-4c`, `zeitbereich`, `flug`, `phase-4d`, `nachfuehrung-4d`, `phase-5`, `phase-6`, `infokarte`, `kleinigkeiten`, `domain`. Überlappen sich Zeiträume, beide nennen und „überlappt“ vermerken. Task 3 ordnet Tokens über diese Grenzen zu.

- [ ] **Schritt 3: Kennzahlen je Etappe**

Aus jedem Abnahmeprotokoll (Abschnitt „Zahlen“ oder gleichwertig): Tests, Hauptchunk, Katalog, Quellenkarten, Texte, Texturgrößen. Tabelle `Kennung | Größe | Wert | Fundstelle (Datei §Abschnitt)`. Zusätzlich die heutigen Werte: `npm test 2>&1 | grep -E "Test Files|Tests "` und `npm run build 2>&1 | grep -E "index-.*\.js"`.

- [ ] **Schritt 4: Entscheidungen, Domain, Arbeitsweise**

- `## Entscheidungen`: je Phase die zwei bis vier wichtigsten Entscheidungen von Jens aus den Protokollen („Entscheidungen“, §6, §8) und Entwürfen (§ „Entscheidungen“), mit Fundstelle.
- `## Weg zur Domain`: Repository privat (Commit b9e4283), öffentlich ab 19.09.2026, Deploy-Skript, HTTPS, `orrery3d.de`, relative Pfade (1e08dba, f3807c7) — nur aus Commits und `docs/entwicklung.md`; keine Hostnamen.
- `## Arbeitsweise`: Ablauf (Brainstorming, Entwurf, Plan, Umsetzung, Abnahme), Rolle der Rulings, Pixelmessung, Literaturprüfung; Belege aus `docs/ursprungsprompt.md`, Entwürfen, Plänen und Protokollen (nicht aus der lokalen Projektanleitung zitieren, nur als Hinweis nutzen und am Protokoll bestätigen).

- [ ] **Schritt 5: Selbstprüfung**

Jede Tabellenzeile hat eine nicht leere Fundstelle: `grep -c '| *|$' faktenblatt.md` muss 0 sein. In `progress.md`: „Task 1 fertig“ plus Zeilenzahl je Abschnitt.

### Task 2: Fehlerkatalog

**Dateien:** Ledger `fehlerkatalog.md` (neu).

**Liefert:** Tabelle `Nr. | Kennung (aus Task 1) | Was falsch war | Art | Gefangen durch | Korrektur | Spät/Jens | Fundstelle`. `Art` aus der festen Liste: `Größenordnung`, `Zuschreibung`, `Quelle erfunden oder verwechselt`, `Code-Kommentar als Beleg`, `Typfehler/Bau`, `Sichtprüfung`, `Regeltreue`, `Prozess`, `Sonstiges`. `Gefangen durch` aus: `Test`, `tsc/build`, `Pixelmessung`, `Literaturprüfung`, `Fachprüfung`, `Controller-Prüfung`, `Handprüfung Jens`, `Gesamtabnahme`, `später Task`.

- [ ] **Schritt 1:** In allen `docs/*-abnahme.md` die Abschnitte §6 (Rulings), §7 (Unschärfen, offene Punkte), „Nacharbeit“, „Befund“ lesen; zusätzlich `git log --format='%h %ad %s' --date=short | grep -iE 'berichtig|korrig|fix|nachführ|nacharbeit'`.
- [ ] **Schritt 2:** Mindestens 25 Fälle, davon mindestens 5 mit `Spät/Jens` = ja (erst spät oder von Jens gefunden) und mindestens je 2 für `Größenordnung`, `Zuschreibung`, `Regeltreue`. Die zwei gescheiterten Läufe des kleinsten Modells an Regeltreue (Nachführung nach 4d) und die irrende Gesamtabnahme (Uranus-Sonnenwende, Verona Rupes, Titania/Oberon; `docs/nachfuehrung-4d-abnahme.md`) müssen darin stehen.
- [ ] **Schritt 3:** Unter der Tabelle `## Zählung`: Fälle je `Art` und je `Gefangen durch` (Zahlen, die Task 9 im Kernkapitel nennt).
- [ ] **Schritt 4:** Eintrag in `progress.md`.

### Task 3: Tokenbilanz

**Dateien:** Ledger `tokenbilanz.py`, `tokenbilanz.md`; neu `docs/bilder/entstehung/tokens-je-tag.svg`.

**Nutzt:** `## Phasengrenzen` aus Task 1.
**Liefert:** `tokenbilanz.md` mit den Abschnitten `## Methode`, `## Summe`, `## Je Modell`, `## Hauptsitzung und Subagenten`, `## Je Tag`, `## Je Phase`, `## Sitzungen`, `## Nach dem Stichtag`.

- [ ] **Schritt 1: Skript**

Grundlage (Probe aus dem Entwurf, erweitert um Zeitstempel und Stichtag):

```python
import json, glob, os, collections, sys
root = os.path.normpath(os.environ['PROTOKOLLE'])   # Protokollordner, Pfad steht in progress.md
K = ('input_tokens', 'output_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens')
best, meta = {}, {}
for p in glob.glob(root + '/**/*.jsonl', recursive=True):
    art = 'haupt' if os.path.normpath(os.path.dirname(p)) == root else 'sub'
    with open(p, encoding='utf-8', errors='replace') as f:
        for line in f:
            e = json.loads(line); m = e.get('message')
            if not isinstance(m, dict) or m.get('role') != 'assistant' or not m.get('usage') or not m.get('id'):
                continue
            u = m['usage']; v = tuple(u.get(k, 0) or 0 for k in K)
            if m['id'] in best:
                best[m['id']] = tuple(max(a, b) for a, b in zip(best[m['id']], v))
            else:
                best[m['id']] = v
                meta[m['id']] = (art, m.get('model'), e.get('timestamp'), e.get('sessionId'), p)
```

Ergänzen: Modell `<synthetic>` verwerfen; Zeitstempel (UTC) in Ortszeit Europe/Berlin umrechnen und dem Tag zuordnen; Stichtag = Commit-Zeit von f3807c7 (`git log -1 --format=%aI f3807c7`), spätere Antworten nur in `## Nach dem Stichtag`; Phase über `## Phasengrenzen` (bei Überlappung dem später begonnenen Abschnitt, als Ruling notieren; Antworten zwischen zwei Phasen der vorangehenden). Sitzungen: Zahl der Hauptprotokolle und der Subagentenprotokolle je Tag. Ausgabe als Markdown-Tabellen in `tokenbilanz.md`.

- [ ] **Schritt 2: Plausibilität**

Summe über `## Je Modell` = `## Summe` = Summe über `## Je Tag` + `## Nach dem Stichtag` (im Skript mit `assert` prüfen). Gegen die Probe aus dem Entwurf §4b: Cache-Lesen gesamt rund 10,4 Mrd. (inklusive nach Stichtag); Abweichung über 5 % begründen.

- [ ] **Schritt 3: Diagramm**

Skill `dataviz` laden. SVG von Hand aus Python (ohne Bibliotheken), 800×420, `viewBox` gesetzt, Schrift `system-ui`: oben gestapelte Balken Ausgabetokens je Tag nach Modell, unten Cache-Lesen je Tag als eigene Achse; sprachneutral beschriftet: Tage (`11`–`25`) und in der Legende die Modellnamen ohne Herstellernamen (`Opus 5`, `Opus 5.5`, `Fable 5.1`, `Sonnet 5`, `Haiku 4.5`), weil das Bild nicht unter die Ausnahme der Wortregel fällt; Achsentitel als Einheit (`Mio.`/`M` vermeiden, stattdessen Zahlen mit SI-Präfix `10M`, `1G`). Hintergrund transparent, Farben mit ausreichendem Kontrast auf hellem und dunklem GitHub-Thema (Balken mit dunkler Kontur).

- [ ] **Schritt 4: Prüfen und committen**

```bash
py -3.12 -c "import xml.dom.minidom as m; m.parse('docs/bilder/entstehung/tokens-je-tag.svg'); print('ok')"
git add docs/bilder/entstehung/tokens-je-tag.svg
git commit -m "Entstehung: Diagramm Tokens je Tag"
```

Danach `bash .superpowers/sdd/2026-09-25-entstehung/pruefe.sh` → `ok`.

### Task 4: Screenshots

**Dateien:** neu `docs/bilder/entstehung/*.jpg` (JPEG, Qualität 86–88, progressiv, je 80–300 kB).

**Liefert:** Bildliste mit Dateiname, Inhalt, Aufnahmeparametern und Pixelprüfung in `progress.md` (Task 5–9 übernehmen Dateinamen und Alt-Texte daraus).

- [ ] **Schritt 1: Vorbereitung**

Server prüfen (siehe Randbedingungen). Playwright 1600×900, nach jedem Navigate:
`window.store.setState({ quality: { ...window.store.getState().quality, tier: 'high' } })`. Szenennummer per `const { SCENES } = await import('/Orrery/src/data/scenes.ts'); SCENES.findIndex(s => s.id === '<id>')`. Szenen: `setCinema({ running: true, shuffle: false, nummer, elapsedSec: 0, pauseOnInput: false })`, `setCamera({ mode: 'cinema' })`, warten, dann `setCinema({ running: false })` und `setTime({ paused: true })`, 2 s warten. Nach allen Aufnahmen Anzeige und UI wie vorgefunden zurücksetzen.

- [ ] **Schritt 2: Aufnahmen heutiger Stand**

| Datei | Inhalt | Einstellung |
|---|---|---|
| `systemblick.jpg` | Szene `systemblick` | UI aus, Bahnen an |
| `mondfinsternis.jpg` | Szene `mondfinsternis`, Blutmond | UI aus, Bahnen/Beschriftung aus |
| `guertel.jpg` | Szene `ceres-guertel` | UI aus |
| `ferne-sonne.jpg` | Szene `ferne-sonne` mit Milchstraße | UI aus, `display.milchstrasse` an |
| `explorer.jpg` | Explorer mit Seitenleiste | UI an, alle Panels im Standard |
| `infopanel-hochschule.jpg` | Infopanel, Stufe Hochschule, Thema `bahnelemente`, Formel sichtbar | UI an, Kopfwechsel abwarten, `document.querySelector('math')` nicht null |
| `infokarte.jpg` | Info-Karte offen | UI an |
| `kompakt-handy.jpg` | Kompaktmodus | eigener Kontext 412×915, `deviceScaleFactor` 2.625, `isMobile`, `hasTouch`, Seite sofort `bringToFront()`; Aufnahme mit `scale: 'css'` |

Ruling (Plan): Bilder mit sichtbarer Oberfläche auf **Englisch** (Taste `L` oder Sprachschalter), weil die englische README Standard ist; beide Sprachfassungen nutzen dieselben Bilder.

- [ ] **Schritt 3: Pixelprüfung je Bild**

```python
from PIL import Image; import numpy as np
a = np.asarray(Image.open(p).convert('L'), dtype=float)
hell = (a > 20).mean(); print(p, round(hell, 4), round(a.std(), 1))
```

Bedingung: `hell ≥ 0.02` und `std ≥ 8`; für `ferne-sonne.jpg` zusätzlich Differenzbild Milchstraße an/aus in derselben Ladung mit mindestens 1 % abweichenden Pixeln (Schwelle 8 Graustufen). Werte in `progress.md`.

- [ ] **Schritt 4: Frühe Stände (Versuch, höchstens ein Drittel dieses Tasks)**

```bash
S=<scratchpad>/alt; mkdir -p $S/v010 && git archive v0.1.0 | tar -x -C $S/v010
cd $S/v010 && npm ci && npx vite build && npx vite preview --port 5181 --strictPort
```

Bei Erfolg `alt-v0.1.0.jpg` (und bei Zeit `alt-v0.4.0.jpg` auf Port 5182) mit derselben Kameraeinstellung wie `systemblick.jpg`, soweit die alte Version sie kennt; sonst Standardansicht. Preview-Prozesse danach beenden, Ordner im Scratchpad lassen. Scheitert Bau oder Start: Ruling in `progress.md`, Bilder entfallen.

- [ ] **Schritt 5: Commit**

```bash
rm -f .playwright-mcp/*.png; git status --short
git add docs/bilder/entstehung/*.jpg
git commit -m "Entstehung: Screenshots"
```

### Task 5: Chronik DE, Teil 1 — Idee bis Phase 3

**Dateien:** neu `docs/chronik.de.md`.
**Nutzt:** Faktenblatt, Fehlerkatalog, Tokenbilanz `## Je Phase`, Bildliste.

- [ ] **Schritt 1: Gerüst**

Kopf: `# Chronik der Entstehung`, Sprachzeile `[English](chronik.en.md) | **Deutsch**`, Satz mit Verweis auf den Überblick `entstehung.de.md`, ein Absatz Lesehilfe (Aufbau je Etappe; die Kürzel sind Commits im Repository). Dann Inhaltsverzeichnis mit allen Sprungmarken. Sprungmarken fest: `idee`, `phase-1`, `phase-2`, `phase-3a`, `phase-3b`, `phase-4a`, `phase-4b`, `klickflaechen`, `phase-4c`, `zeitbereich`, `flug`, `phase-4d`, `nachfuehrung-4d`, `phase-5`, `phase-6`, `infokarte`, `kleinigkeiten`, `domain`, `anhang-tokens` (Reihenfolge nach Faktenblatt). Noch nicht geschriebene Abschnitte erscheinen nur im Inhaltsverzeichnis, nicht als leere Überschrift.

- [ ] **Schritt 2: Abschnitte `idee` bis `phase-3b`**

Je Abschnitt: `<a id="…"></a>` + `## Titel (Datum–Datum, Tag)`, dann die Unterpunkte **Ziel**, **Entscheidungen**, **Ergebnis** (Kennzahlen), **Fehler und Korrekturen** (aus dem Fehlerkatalog, jeweils mit „gefangen durch …“), **Tokens** (eine Zeile aus der Tokenbilanz: Ausgabe, Cache-Lesen, Anteil Subagenten, vorherrschendes Modell), **Commits** (zwei bis fünf Kürzel). Produkt-, Hersteller- und Modellnamen sind in dieser Datei erlaubt und erwünscht (Modellnamen genau wie in `tokenbilanz.md` `## Je Modell`); die Skills heißen Superpowers (Plugin von Jesse Vincent). Ein Bild höchstens, wenn es zur Etappe passt, mit Alt-Text. Umfang Teil 1: 1 200–1 800 Wörter (`wc -w`).

- [ ] **Schritt 3: Fundstellen**

In `progress.md` je Abschnitt die verwendeten Zeilen aus Faktenblatt/Fehlerkatalog/Tokenbilanz (Nummern oder Tabellenzeilen). Keine Zahl ohne Zeile.

- [ ] **Schritt 4: Prüfen und committen**

```bash
wc -w docs/chronik.de.md
git add docs/chronik.de.md
git commit -m "Chronik: Idee bis Phase 3"
```

Nach dem Commit `bash .superpowers/sdd/2026-09-25-entstehung/pruefe.sh` → `ok`.

### Task 6: Chronik DE, Teil 2 — Phasen 4a bis 4c

Wie Task 5 Schritte 2–4 für die Abschnitte `phase-4a`, `phase-4b`, `klickflaechen`, `phase-4c`, `zeitbereich`, `flug` (Reihenfolge nach Faktenblatt; 4d-Etappen, die zeitlich dazwischen liegen, gehören in Task 7). Schwerpunkte: Englisch zur Laufzeit, Links und Ansichten, Infopanel mit drei Stufen, Quellenkarten. Umfang 1 200–1 800 Wörter Zuwachs. Commit „Chronik: Phasen 4a bis 4c“.

### Task 7: Chronik DE, Teil 3 — Phase 4d und Nachführung

Wie Task 5 Schritte 2–4 für `phase-4d` (Unterabschnitte `###` je Etappe 4d-1 bis 4d-11, kurz) und `nachfuehrung-4d`. Schwerpunkte für das Leitmotiv: Literaturprüfung gegen Crossref/arXiv, Belegdateien, „Kommentare im Code sind kein Beleg“, eine Prüfrunde je Text, typische Modellfehler mit Zahlen aus dem Fehlerkatalog, das kleinste Modell und die Regeltreue. Umfang 1 500–2 200 Wörter Zuwachs. Commit „Chronik: Phase 4d und Nachführung“.

### Task 8: Chronik DE, Teil 4 — Phase 5 bis Domain, Anhang

Wie Task 5 Schritte 2–4 für `phase-5`, `phase-6`, `infokarte`, `kleinigkeiten`, `domain` und `anhang-tokens`. `anhang-tokens`: Methode (Zählweise, Stichtag, Grenzen wörtlich nach Entwurf §4b), Tabellen `## Je Modell` und `## Je Phase` aus der Tokenbilanz, Diagramm `bilder/entstehung/tokens-je-tag.svg` mit einem Satz zur Lesart, Zeile zu Sitzungen nach dem Stichtag. Umfang 1 200–1 800 Wörter Zuwachs. Inhaltsverzeichnis gegen die vorhandenen Marken prüfen:

```bash
diff <(grep -o 'href="#[^"]*"\|](#[^)]*)' docs/chronik.de.md | sed 's/.*#//;s/[")]//g' | sort -u) \
     <(grep -o '<a id="[^"]*"' docs/chronik.de.md | sed 's/<a id="//;s/"//' | sort -u)   # leer
```

Commit „Chronik: Phase 5 bis zur Domain, Tokenanhang“.

### Task 9: Überblick DE

**Dateien:** neu `docs/entstehung.de.md`.

- [ ] **Schritt 1:** Gliederung genau nach Entwurf §4 (neun Abschnitte), Umfang 2 500–3 200 Wörter. Kopf mit Sprachzeile `[English](entstehung.en.md) | **Deutsch**`, erster Absatz nennt beide Werbeaussagen (Wissenschaftskommunikation; deterministische Anwendung mit nicht deterministischem Werkzeug). Bild `bilder/orrery-saturn.jpg` oben, im Text drei bis fünf Bilder aus Task 4, Diagramm im Kostenabschnitt.
- [ ] **Schritt 2:** Kernkapitel nach Entwurf §4a: sieben Maschen, je ein echter Fall aus dem Fehlerkatalog (Nr. im Ledger), dazu die Zählung aus `## Zählung`; Absatz „Was das Netz nicht fing“. Kosten nach §4b mit Summe, Anteil Cache-Lesen, Verteilung Haupt/Sub und Modelle, Erklärung und Grenzen; keine Geldbeträge.
- [ ] **Schritt 3:** Jede Phase im Abschnitt „Phasen“ endet mit einem Verweis `[Chronik](chronik.de.md#<marke>)`. Linkprüfung (Task 13 Schritt 3) und `pruefe.sh` laufen lassen.
- [ ] **Schritt 4:** Fundstellen in `progress.md`, Commit „Entstehung: Überblick“.

### Task 10: Fachprüfung und Nacharbeit

- [ ] **Schritt 1 (Prüfer, frischer Subagent):** Liest Entwurf, Faktenblatt, Fehlerkatalog, Tokenbilanz, `docs/chronik.de.md`, `docs/entstehung.de.md` und stichprobenartig die zitierten Protokolle und Commits (`git show --stat <kürzel>`). Schreibt `pruefung.md`: Tabelle `Nr. | Datei:Zeile | Befund | Art (falsch/unbelegt/unklar/Stil) | Vorschlag`. Pflichtprüfungen: jede Zahl gegen das Material; jedes Commit-Kürzel existiert (`git cat-file -t`); jede Fehlergeschichte gegen ihre Fundstelle; Wortregel und Datenschutz; keine Geldbeträge; Leitmotiv trägt, ohne zu übertreiben (keine Behauptung, das Netz fange alles).
- [ ] **Schritt 2 (Umsetzer):** Befunde „falsch“ und „unbelegt“ beheben, „unklar“ nach Ermessen, „Stil“ nur wenn billig; Rest in `progress.md` für das Protokoll §7. Kürzen und Berichtigen nicht in derselben Runde.
- [ ] **Schritt 3:** Commit „Entstehung: Fachprüfung eingearbeitet“.

### Task 11: Überblick EN

**Dateien:** neu `docs/entstehung.en.md`.

- [ ] **Schritt 1:** Übersetzung von `docs/entstehung.de.md`, gleiche Gliederung, gleiche Bilder, Links auf `chronik.en.md#<marke>`, Sprachzeile `**English** | [Deutsch](entstehung.de.md)`. Zahlen und Daten im englischen Format; deutsche Fachbegriffe der App (z. B. Szenennamen) mit ihrem englischen Oberflächennamen aus `src/ui/i18n/en.ts`.
- [ ] **Schritt 2: Zahlen abgleichen**

```bash
norm() { grep -oE '[0-9][0-9 .,]*[0-9]|[0-9]' "$1" | tr -d ' .,' | sort; }
diff <(norm docs/entstehung.de.md) <(norm docs/entstehung.en.md)
```

Jede Abweichung erklären (Datumsschreibweise, ausgeschriebene Zahlen) oder beheben; Erklärung in `progress.md`.
- [ ] **Schritt 3:** Linkprüfung, Commit „Entstehung: englischer Überblick“, danach `pruefe.sh` → `ok`.

### Task 12: Chronik EN

Wie Task 11 für `docs/chronik.en.md` (Sprachzeile `**English** | [Deutsch](chronik.de.md)`, gleiche Sprungmarken). Bei mehr als 5 000 Wörtern in zwei Aufträgen (bis `nachfuehrung-4d`, Rest). Commit(s) „Chronik: englische Fassung“.

### Task 13: Verlinkung, Abnahme

**Dateien:** `README.md`, `README.de.md`, neu `docs/entstehung-abnahme.md`; lokale Projektanleitung.

- [ ] **Schritt 1: README**

In beiden READMEs vor dem Abschnitt Lizenz einen kurzen Abschnitt „How it was built“ / „Wie es entstand“ (drei bis vier Sätze): 15 Tage vom Prompt bis zur Domain, mit einem KI-Coding-Assistenten gebaut — **ohne Produktnamen** (README fällt nicht unter die Ausnahme) —, Leitmotiv deterministische Anwendung mit nicht deterministischem Werkzeug, Links auf Überblick und Chronik der jeweiligen Sprache.

- [ ] **Schritt 2: Datenschutz und Wortregel**

```bash
bash .superpowers/sdd/2026-09-25-entstehung/pruefe.sh   # ok
```

- [ ] **Schritt 3: Links**

```bash
for f in README.md README.de.md docs/entstehung.*.md docs/chronik.*.md; do
  grep -oE '\]\([^)#h][^)]*\)' "$f" | sed 's/^](//;s/)$//;s/#.*//' | sort -u | while read p; do
    [ -e "$(dirname "$f")/$p" ] || echo "FEHLT $f -> $p"; done
  grep -oE '\]\([^)]*#[^)]*\)' "$f" | sed 's/^](//;s/)$//' | while read l; do
    d=${l%%#*}; m=${l#*#}; t=$(dirname "$f")/${d:-$(basename "$f")}
    grep -q "<a id=\"$m\"" "$t" || echo "MARKE FEHLT $f -> $l"; done
done
```

Ausgabe leer.

- [ ] **Schritt 4: Abnahmeprotokoll**

`docs/entstehung-abnahme.md` nach Vorlage `docs/kleinigkeiten-abnahme.md`: §1 Umfang, §2 Zahlen (Wörter je Datei per `wc -w`, Bilder mit Größe, Tokenbilanz-Summen), §3 Prüfungen (Befehle und Ergebnisse aus Schritt 2 und 3, Zahlenabgleich), §4 Lizenz (Bilder zeigen Texturen nach `ASSETS.md`), §5 Handprüfung Jens (GitHub-Darstellung beider Sprachen, hell und dunkel), §6 Rulings aus `progress.md`, §7 offene Punkte (Restbefunde der Fachprüfung), §8 Fragen an Jens. Ohne Produktnamen, ohne Suchmuster der Wortkontrolle.

- [ ] **Schritt 5: Abschluss**

```bash
npm run lint && npx tsc -b --noEmit && npm test 2>&1 | grep -E "Test Files|Tests " && npm run build 2>&1 | tail -3
git add README.md README.de.md docs/entstehung-abnahme.md
git commit -m "Entstehung: Verlinkung und Abnahme"
```

Lokale Projektanleitung: Ausnahme der Wortregel für die vier Dateien eintragen und die Baumkontrolle um den Ausschluss ergänzen; Stand nachtragen. Fast-Forward nach `master` erst nach Jens' Handprüfung, Push nur nach Jens' Ja.
