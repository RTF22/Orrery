# Phase 4c — Etappe 2: Abnahmeprotokoll

**Datum:** 14.09.2026
**Stand:** Zweig `grundschule`, Basis-Commit `6ff0f02` (Tasks 1 bis 7 der Etappe 2:
33 fehlende Grundschul-Körpertexte, Saturn-Nachtrag, Eris-Korrektur und alle acht
Grundschul-Themen, zusammen 82 neue Textdateien Deutsch und Englisch, dazu die
`thema:`-Verweise in rund zehn Körpertexten).
**Prüfumgebung:** Windows 11, Desktop mit RTX 4060, Chromium (Playwright),
Vite-Entwicklungsserver auf `http://localhost:5173/Orrery/`, Browserfenster
2560 × 1305 CSS-Pixel, Qualitätsstufe nach jeder Navigation per
`window.store.setState` auf `high` gesetzt. Für einen sauberen Grundzustand vor
dem Neuladen `localStorage.setItem('orrery.sitzungMerken', '0')` und
`localStorage.removeItem('orrery.sitzung.v1')` vor der Neuladung gesetzt, danach
Infopanel per Store geöffnet (`ui.panels.info: true`) und Niveau auf
`grundschule` gestellt.

Geprüft wird das Kriterium „4c-2 Grundschule komplett": alle 35 Körper und alle
8 Themen mit vollständigem Text in Deutsch und Englisch, keine Sackgasse auf dem
Grundschul-Tab. Alle Abfragen liefen per `browser_run_code_unsafe` gegen
`window.store`, das DOM und (für Schritt 4) echte Playwright-Klicks, nicht gegen
Bildschirmfotos allein.

**Nachtrag nach Abschlussprüfung (14.09.2026):** Nach dieser Abnahme wurden in
einer Fix-Welle 15 Grundschultexte wörtlich auf den Planstand gebracht (Commit
„Grundschultexte: Phobos-Umlauf, Dione, Makemake, Ringbreite, Verweise Haumea,
Makemake, Rhea; Saturn neu umbrochen; Plan nachgezogen"): `objekt-phobos`
(de/en, Umlauf statt Aufgangszahl: „umrundet ihn dreimal am Tag und geht dabei
im Westen auf" statt „erscheint dreimal am Tag am Himmel"), `objekt-saturn`
(de/en, neu umbrochen), `objekt-mimas` (en, „films" statt „movies"),
`objekt-dione` (de/en, „Seite, die beim Umlauf hinten liegt"/„trailing side"
statt Rückseite/far side), `objekt-rhea` (de/en, Verweis auf
`objekt:iapetus`), `objekt-haumea` und `objekt-makemake` (de/en, Verweis auf
`thema:zwergplaneten`; Makemake „gut halb so groß" statt „zwei Drittel"),
`thema-ringe` (de/en, Ringbreite als Durchmesser: „von einem Rand zum anderen
… über 250 000 Kilometer" statt „200 000 Kilometer breit"). Kein Programmcode
geändert; `npx vitest run src/data/texte` blieb mit unveränderter Fallzahl
(486) grün, eine neue Sichtprüfung war dafür nicht nötig. Schritt 5 dieses
Protokolls (Maschineller Rundgang) und der Abschnitt „Kriterium — bewertet"
wurden anschließend neu gemessen und unten neu gefasst; die Schritte 1 bis 4
und 6 bis 8 sind unverändert der Stand vor der Fix-Welle.

## Schritt 1: Server und Stand

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
`git status --short`: leer. `git log --oneline -1`: `6ff0f02 Grundschultexte:
acht Themen`. `ls src/data/texte/*/grundschule | grep -c objekt-` → `70` (35 je
Sprache). `ls src/data/texte/*/grundschule | grep -c thema-` → `16` (8 je
Sprache). Alle vier Werte wie erwartet.

## Schritt 2: Dateitest gezielt

```
$ npx vitest run src/data/texte/dateien.test.ts
 Test Files  1 passed (1)
      Tests  482 passed (482)
```

482 Fälle wie erwartet (96 Dateien × 5 + 2). Das Skript aus Task 7 Schritt 3
(Themenziele je Sprache, prüft, dass jeder `thema:`-Verweis aus einer
Grundschuldatei auf eine vorhandene Grundschuldatei derselben Sprache zeigt):

```bash
for sp in de en; do
  grep -oh 'thema:[a-z-]*' src/data/texte/$sp/grundschule/*.md | sort -u | sed 's/thema://' \
    | while read id; do test -f src/data/texte/$sp/grundschule/thema-$id.md || echo "FEHLT $sp $id"; done
done
```

Keine Ausgabe, wie erwartet.

## Schritt 3: Rundgang im Browser

Nach `browser_navigate`, Löschen der Alt-Sitzung, erneutem Laden,
`quality.tier: 'high'`, Infopanel geöffnet und Niveau auf `grundschule`
gestellt: der im Auftrag angegebene Rundgangscode über alle 35 Körper lief
unverändert. Ergebnis für alle 35 Körper (Deutsch): `hinweis: false` und
`knoepfe ≥ 1` durchweg, Köpfe wie erwartet, unter anderem `sun` → „Die Sonne",
`mercury` → „Der Merkur", `moon` → „Der Mond" (4 Knöpfe, die meisten: Erde,
gebundene Rotation, Mondfinsternis, Finsternisse), `jupiter` → „Der Jupiter"
(6 Knöpfe), `pluto` → „Der Pluto" (5 Knöpfe), `ceres` → „Ceres" (6 Knöpfe),
`mimas`/`tethys`/`miranda`/`umbriel`/`oberon`/`charon`/`haumea` je 1 Knopf
(kein zweiter Objekt- oder Themenverweis in diesen kurzen Texten, aber
mindestens der geforderte eine). Vollständige Tabelle (id, kopf, hinweis,
knoepfe), wörtlich aus dem Lauf:

```
sun/Die Sonne/false/2  mercury/Der Merkur/false/2  venus/Die Venus/false/2
earth/Die Erde/false/2  moon/Der Mond/false/4  mars/Der Mars/false/3
phobos/Phobos/false/2  deimos/Deimos/false/2  jupiter/Der Jupiter/false/6
io/Io/false/2  europa/Europa/false/3  ganymede/Ganymed/false/3
callisto/Kallisto/false/2  saturn/Der Saturn/false/3  mimas/Mimas/false/1
enceladus/Enceladus/false/2  tethys/Tethys/false/1  dione/Dione/false/2
rhea/Rhea/false/2  titan/Titan/false/3  iapetus/Iapetus/false/2
uranus/Der Uranus/false/4  miranda/Miranda/false/1  ariel/Ariel/false/2
umbriel/Umbriel/false/1  titania/Titania/false/2  oberon/Oberon/false/1
neptune/Der Neptun/false/2  triton/Triton/false/2  pluto/Der Pluto/false/5
charon/Charon/false/1  ceres/Ceres/false/6  eris/Eris/false/2
haumea/Haumea/false/1  makemake/Makemake/false/2
```

Nach `setUi({ language: 'en' })` und Wiederholung derselben Abfrage über alle
35 Körper: durchweg `hinweis: false`, keine Zeile „Not translated yet", Köpfe
gleich der jeweiligen englischen Überschrift. Vollständige Tabelle (id, kopf,
hinweis, knoepfe), wörtlich aus dem Lauf:

```
sun/The Sun/false/2  mercury/Mercury/false/2  venus/Venus/false/2
earth/The Earth/false/2  moon/The Moon/false/4  mars/Mars/false/3
phobos/Phobos/false/2  deimos/Deimos/false/2  jupiter/Jupiter/false/6
io/Io/false/2  europa/Europa/false/3  ganymede/Ganymede/false/3
callisto/Callisto/false/2  saturn/Saturn/false/3  mimas/Mimas/false/1
enceladus/Enceladus/false/2  tethys/Tethys/false/1  dione/Dione/false/2
rhea/Rhea/false/2  titan/Titan/false/3  iapetus/Iapetus/false/2
uranus/Uranus/false/4  miranda/Miranda/false/1  ariel/Ariel/false/2
umbriel/Umbriel/false/1  titania/Titania/false/2  oberon/Oberon/false/1
neptune/Neptune/false/2  triton/Triton/false/2  pluto/Pluto/false/5
charon/Charon/false/1  ceres/Ceres/false/6  eris/Eris/false/2
haumea/Haumea/false/1  makemake/Makemake/false/2
```

`knoepfe` je Körper identisch zur deutschen Tabelle oben (dieselben Verweise,
nur übersetzter Linktext). Erfüllt.

Die acht Themen (Deutsch, `setInfo({ niveau: 'grundschule' })` vor jeder
Kennung, dann `setInfo({ thema: id })`): `finsternis` → „Finsternisse",
`ringe` → „Ringsysteme", `gebundene-rotation` → „Gebundene Rotation",
`kirkwood-luecken` → „Kirkwood-Lücken", `achsneigung` → „Achsneigung",
`zwergplaneten` → „Zwergplaneten", `bahnelemente` → „Bahnelemente", `modell` →
„Grenzen des Modells" — durchweg `hinweis: false`. Auf Englisch: `finsternis` →
„Eclipses", `ringe` → „Ring systems", `gebundene-rotation` → „Tidal locking",
`kirkwood-luecken` → „Kirkwood gaps", `achsneigung` → „Axial tilt",
`zwergplaneten` → „Dwarf planets", `bahnelemente` → „Orbital elements",
`modell` → „Limits of the model" — durchweg `hinweis: false`. Alle Titel
stimmen mit `thema.<id>.title` aus `ui/i18n` überein (Ruling 6). Erfüllt.

## Schritt 4: Verweise stichprobenartig

**Phobos → „Tiefflug".** Knopf geklickt: `cinema.running: true`,
`cinema.nummer: 8` (Index von `phobos-tiefflug` in `SCENES`, wie erwartet).
`Escape` gedrückt: `cinema.running: false`. Erfüllt.

**Enceladus → „Cassini".** Abweichend von der Annahme im Auftrag ist der
Verweis auf `quelle:nasa-cassini` kein `<button>`, sondern ein `<a>` mit echter
Adresse (`Markdown.tsx`, Zweig `art === 'quelle'`) — die Zählung „Knöpfe" aus
Schritt 3 erfasst solche Quellenverweise deshalb bewusst nicht mit. Mit dem
richtigen Selektor (`aside.info-panel [role=tabpanel] a`, Text „Cassini")
per echtem Playwright-Klick (`page.locator(...).click()`): die Karte
`a[data-quelle="nasa-cassini"]` bekommt unmittelbar danach die Klassen
`border-sky-300/80 bg-sky-400/20` (Hervorhebung; der Auftrag nennt vereinfachend
„Klasse border-sky-300" — tatsächlich mit Deckkraft-Suffix, wie schon in der
Etappe-1-Abnahme festgehalten). „Tabs unverändert 1" bezieht sich, wie mit
`page.context().pages().length` nachgemessen (vor und nach dem Klick, mit
1200 ms Wartezeit und geprüften Seiten-URLs), auf echte Browser-Tabs, nicht auf
die drei Niveau-Tabs im DOM: `vorTabs: 1`, `nachTabs: 1` — kein neuer Tab,
`href`/`target` des Ankers (`https://science.nasa.gov/mission/cassini/`,
`_blank`) bestätigt, dass `e.preventDefault()` im Linksklick-Zweig wirkt.
Methodische Anmerkung: Ein erster Versuch mit einem inzwischen veralteten
Snapshot-Verweis (`ref`) schlug fehl und traf zwischen Fehlschlag und erneutem
Snapshot zweimal zufällig eine andere, echte Quellenkarte (zuerst „Erde bei
NASA Science", dann die Cassini-Quelle selbst über eine verzögerte
Tab-Erkennung), wodurch kurzzeitig zusätzliche Browser-Tabs offen standen;
beide wurden sofort geschlossen (`browser_tabs`, `action: close`). Das ist ein
Artefakt der Messmethode (veralteter `ref` nach einer Zustandsänderung), kein
Befund am Programm — die saubere Wiederholung mit frischem Snapshot bzw.
`page.locator()` lieferte durchgehend das erwartete, deterministische Ergebnis.
Erfüllt.

**Jupiter → „Europa".** Knopf geklickt: `camera.targetId: 'europa'`, Panelkopf
„Europa". Erfüllt.

## Schritt 5: Keine Sackgasse auf dem Grundschul-Tab

**Mond → „dieselbe Seite".** Klick: `ui.info.thema: 'gebundene-rotation'`,
Panelkopf „Gebundene Rotation", kein Hinweis „kein Text". Erfüllt.

**Ceres → „Kirkwood-Lücken".** Klick: Panelkopf „Kirkwood-Lücken", kein
Hinweis. Erfüllt.

**„Grenzen des Modells" außerhalb des Genauigkeitsfensters.** Uhr auf
`jd: 2341973` gesetzt (Anfang 1700), Ziel Mars, Knopf „Grenzen des Modells" im
Datenblock geklickt: Panelkopf „Grenzen des Modells", kein Hinweis „kein Text".
Uhr danach zurück auf `jd: 2451545` (J2000) gesetzt.

**Maschineller Rundgang (präzisiert nach der Abschlussprüfung, Plan Ruling
12).** Die ursprüngliche Fassung dieses Absatzes maß nur `szene:`- und
`thema:`-Knöpfe (28 je Sprache, 56 insgesamt; `objekt:`-Knöpfe blieben
außen vor) und meldete „Sackgassen 0". Das war eine Nichtmessung, keine
Bestätigung: Der Hinweis `info.keinText` hängt in `InfoPanel.tsx` an der
Variablen `frisch`, die erst wahr wird, nachdem das faule
`import.meta.glob`-Versprechen aufgelöst hat; unmittelbar nach einem Klick
stand der Absatz „kein Text" noch nicht im DOM, und die damalige Prüfung
bewertete diesen Moment statt des eingeschwungenen Zustands. Von den 56
Knöpfen jenes Laufs waren zudem 34 `szene:`-Knöpfe, davon 30 auf Szenen ohne
Grundschultext — mit richtigem Abwarten zeigen genau diese 30 den Hinweis,
wie die Messung unten bestätigt.

Zweite, korrigierte Messung: Für jeden der 43 Grundschul-Einträge (35 Körper,
8 Themen) je Sprache wurde jeder Verweisknopf im `[role=tabpanel]` einzeln
angeklickt (`quelle:`- und externe Verweise sind `<a>`, keine `<button>`,
bleiben also strukturell außen vor, siehe Schritt 4). Vor jedem Klick wurde
der Ausgangseintrag frisch gesetzt (`setInfo({ niveau: 'grundschule', thema
})` beziehungsweise `setCamera({ targetId })`), nach jedem Szenen-Klick das
Kino über einen synthetischen `KeyboardEvent('keydown', { key: 'Escape' })`
beendet (ruft denselben `stopCinema()`-Pfad wie die echte Taste) und
`document.documentElement.requestFullscreen` für die Laufzeit durch eine
ablehnende Funktion ersetzt, damit ein tatsächlicher Vollbildwechsel die
Messung nicht stört. Bewertet wurde erst, nachdem Panelkopf oder Textinhalt
sich änderten oder der Absatz von `info.keinText` erschien (Pollen alle
30 ms, bis zu 3 s), zusätzlich mit einer Stabilisierungswartezeit vor jedem
Reset und nach jedem erkannten Wechsel.

Getrennt gezählt (beide Sprachen zusammen):

**(a) `objekt:`- und `thema:`-Knöpfe: 194 geklickt (je 97 in Deutsch und
Englisch), 0 Sackgassen.** Ein erster Durchlauf ohne Stabilisierungswartezeit
zeigte kurzzeitig zwei falsche Treffer (`thema:gebundene-rotation` → Mond,
`thema:achsneigung` → Venus, jeweils Deutsch), beide unmittelbar nach einem
Szenen-Klick im selben Abschnitt; eine sofortige manuelle Einzelprüfung
beider Ziele zeigte sofort den korrekten Text ohne jeden Hinweis, danach
lieferte der Lauf mit Stabilisierungswartezeit für denselben Abschnitt 0
Sackgassen. Ebenso zeigte ein Klick auf `szene:ceres-guertel` (aus
`objekt-ceres`, Deutsch) im ersten Durchlauf fälschlich „kein Wechsel"
erkannt und wurde als „hat Text" gezählt; eine manuelle Einzelprüfung
bestätigte den korrekten Hinweis „kein Text", die Wiederholung mit der
robusteren Fassung ordnete den Fall korrekt ein. Beide Artefakte sind ein
Messproblem des Testaufbaus (siehe oben), kein Befund am Programm.

**(b) `szene:`-Knöpfe: 34 geklickt (je 17 in Deutsch und Englisch), 30 zeigen
„kein Text", 4 zeigen Text.** Die vier Treffer mit Text sind je zweimal
`mondfinsternis`, verlinkt aus `objekt-moon.md` und `thema-finsternis.md`
(beide Sprachen). Das ist bis 4c-4 so vorgesehen (Ruling 2, Entwurfs-Nachtrag
§7) und zählt nicht als Sackgasse des Kriteriums dieser Etappe. Die 13
distinkten Szenen-Kennungen ohne Grundschultext: `systemblick`,
`merkurjagd`, `phobos-tiefflug`, `jupiter-vorbeiflug`, `enceladus-hell`,
`titan-dunst`, `iapetus-schief`, `uranus-gekippt`, `ferne-sonne`,
`triton-rueckwaerts`, `pluto-charon`, `ceres-guertel`, `ringdurchflug`.

Erfüllt im Sinn des präzisierten Kriteriums: Kein `objekt:`- oder `thema:`-
Verweis auf dem Grundschul-Tab führt auf „kein Text"; die 30 `szene:`-Treffer
sind offen ausgewiesen und bis 4c-4 erwartet, nicht Teil des Kriteriums
dieser Etappe.

## Schritt 6: Gymnasium-Tab bei Körpern ohne Text

Tab „Gymnasium", Ziel Mars: Hinweis „Zu diesem Eintrag gibt es noch keinen
Text." erscheint, Datenblock bleibt sichtbar (Text folgt in 4c-3). Ziel Erde:
Text vorhanden, kein Hinweis. Erfüllt, wie erwartet — Gymnasium ist nicht
Gegenstand dieser Etappe.

## Schritt 7: Konsole

`browser_console_messages` (Stufe `warning`, schließt `error` ein), über die
gesamte Sitzung (`all: true`):

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

Auf Stufe `info` dieselben drei Meldungen, zweimal derselbe React-Hinweis
(„Download the React DevTools …"), keine davon `warning` oder `error`. 0
Fehler, 0 Warnungen. Erfüllt.

## Lint, Test, Build

```
$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm test
 Test Files  77 passed (77)
      Tests  1536 passed (1536)
   Start at  18:42:35
   Duration  11.28s (environment 47%, setup 27%, tests 16%, transform 6%, import 4%, worker 1%)

$ npm run build
npm notice run orrery@0.0.0 build
npm notice run tsc -b && vite build
✓ built in 601ms
(!) Some chunks are larger than 500 kB after minification …
```

1536 Tests wie erwartet (1126 aus dem Stand vor dieser Etappe + 410 = 82 neue
Dateien × 5 Fälle). Der Chunkgrößen-Hinweis ist derselbe allgemeine
Vite-Hinweis wie in früheren Etappen, kein Fehler und keine Regression dieser
Aufgabe. `git status --short` vor dem Commit dieses Protokolls weiterhin leer
(bis auf die beiden neuen/geänderten Dateien dieses Tasks).

## Bekannte Unschärfen

1. Gymnasium- und Hochschul-Tab zeigen bei 33 Körpern und 7 Themen noch den
   Hinweis „kein Text" (4c-3, 4c-4); insbesondere führt der Verweis
   „Bahnelemente" im Gymnasiumtext `thema-modell` bis 4c-4 auf „kein Text".
2. 13 auf dem Grundschul-Tab verlinkte Szenen-Kennungen haben außer
   `mondfinsternis` noch keinen Text (4c-4): `systemblick`, `merkurjagd`,
   `phobos-tiefflug`, `jupiter-vorbeiflug`, `enceladus-hell`, `titan-dunst`,
   `iapetus-schief`, `uranus-gekippt`, `ferne-sonne`, `triton-rueckwaerts`,
   `pluto-charon`, `ceres-guertel`, `ringdurchflug` (34 Verweisstellen über
   beide Sprachen, siehe Schritt 5).
3. Zahlen in den Texten sind gerundete Richtwerte, die Kennzahlen stehen im
   Datenblock.
4. Der Dateitest prüft Themenziele nur auf Existenz im Katalog, nicht auf
   einen Text im selben Niveau (Ruling 7, Test folgt in 4c-4).

## Kriterium — bewertet

Zitat aus dem Entwurf (`docs/superpowers/specs/2026-09-14-phase4c-infopanel-
design.md`, Abschnitt 7, Nachtrag, Fassung nach der Abschlussprüfung): **„4c-2
Grundschule komplett: 33 fehlende Körper und alle 8 Themen (auch `modell`) in
Deutsch und Englisch, 82 Dateien … Abnahme: Auf dem Grundschul-Tab führt kein
`objekt:`- oder `thema:`-Verweis auf „kein Text"; `szene:`-Verweise sind bis
4c-4 ausgenommen und werden im Protokoll getrennt gezählt."** Der
ursprüngliche Wortlaut „kein Verweis führt auf ‚kein Text'" war in dieser
Etappe wörtlich unerfüllbar, weil 13 verlinkte Szenen laut Nachtrag erst in
4c-4 einen Text bekommen, obwohl Ruling 2 die Szenenverweise schon jetzt
verlangt; die „0 Sackgassen" des ersten Protokollstands (siehe die alte
Fassung des Maschinellen Rundgangs in Schritt 5) waren deshalb eine
Nichtmessung statt einer Bestätigung (Plan Ruling 12).

Bewertung: erfüllt im Sinn des präzisierten Kriteriums. Alle 35 Körper und
alle 8 Themen zeigen in beiden Sprachen vollständigen, textlich stimmigen
Inhalt (Schritt 3), Stichproben auf Objekt-, Szenen- und Quellenverweise
funktionieren wie vorgesehen (Schritt 4). Der erschöpfende maschinelle
Rundgang (Schritt 5, zweite Messung) bestätigt 0 Sackgassen über alle 194
`objekt:`- und `thema:`-Knöpfe beider Sprachen; die 34 `szene:`-Knöpfe sind
getrennt ausgewiesen (30 zeigen „kein Text" — bis 4c-4 so vorgesehen, kein
Kriteriumsverstoß —, 4 zeigen den vorhandenen Text zu `mondfinsternis`). Das
präzisierte Kriterium „4c-2 Grundschule komplett" gilt damit als erfüllt; die
noch offene Reichweite bis 4c-4 (Szenentexte) steht ausgewiesen im Protokoll,
statt verschwiegen zu werden. Das bereits seit 4c-1 erfüllte Kriterium
„Infopanel mit abgeleiteten Live-Werten" bleibt unverändert erfüllt (nicht
Gegenstand dieser Etappe).

## Commit-Prüfung

```
git add docs/phase4c-etappe2-abnahme.md README.md
git commit -m "Abnahme 4c Etappe 2: Grundschule komplett"
git log --format=%B -1 | grep -ci 'co-authored\|session\|…'
```

Ergebnis der letzten Zeile: `0` (die Zeichenkette prüft zusätzlich gegen die
beiden nicht zu nennenden Namen aus der Vorgabe). Zusätzlich
`git ls-files -z | xargs -0 grep -liE …` gegen dieselben beiden Namen über das
gesamte Repository geprüft: leer.
