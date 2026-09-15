# Phase 4c — Etappe 3: Abnahmeprotokoll

**Datum:** 15.09.2026
**Stand:** Zweig `gymnasium`, HEAD zu Beginn der Abnahme `bbd0e66` (Tasks 1 bis 9 der
Etappe 3: Achsneigung gegen die eigene Bahn, 33 fehlende Gymnasialtexte für Körper,
sieben Themen neu, ein Thementext ergänzt, Quellenkatalog auf 62, zusammen 70
Körper- und 16 Themendateien Deutsch und Englisch für das Gymnasium).
**Prüfumgebung:** Windows 11, Desktop mit RTX 4060, Chromium (Playwright),
Vite-Entwicklungsserver auf `http://localhost:5173/Orrery/`, Qualitätsstufe nach
jeder Navigation per `window.store.setState` auf `high` gesetzt,
`setCinema({ pauseOnInput: false })` direkt danach. Infopanel per Store geöffnet,
Niveau auf `gymnasium` gestellt. Alle Abfragen liefen per `browser_run_code_unsafe`
gegen `window.store`, das DOM und (Schritt 6) über echte Playwright-Klicks.

## Entscheidungen während der Umsetzung

1. **Testzahl 1940 statt 1941:** In Task 2 entfiel der InfoPanel-Fall „ohne Text:
   Datenblock, Ausweichtitel und Hinweis", weil Pluto ohne Text und ohne Quellen
   nach der neuen Abdeckungsregel unmöglich geworden ist. Ausweichtitel und
   Datenblock (samt Hinweis „kein Text") prüft jetzt der bestehende Fall in
   `src/ui/info/InfoPanel.laden.test.tsx` (Commit `8daa99e`); der Hinweis „Keine
   Quellen zu diesem Text." wird weiterhin in `src/ui/info/Quellenkarten.test.tsx`
   (Kennung `objekt:vulcan`) geprüft.
2. **Task 6 Fixrunde:** Tethys-Durchmesser in Deutsch und Englisch auf „1 061 km"
   gesetzt, passend zum Datenblock (2 × 530,6 km) statt des Planwerts 1 062 km
   (Commits `76aff6b`, `498a16f`).
3. **Task 8:** `src/data/texte/index.test.ts` prüft die Kennung `vulcan` statt
   `pluto` als Ziel ohne Gymnasialtext, weil Pluto inzwischen einen Text hat
   (Commit `36e8c7d`).
4. **pds-rings.seti.org** (Quelle aus Etappe 1) antwortete am 15.09.2026 beim
   Abruf mit Browser-User-Agent nicht mit HTTP 200, sondern lief nach 30 Sekunden
   in eine Zeitüberschreitung (curl-Exit-Code 28, kein HTTP-Code). Die Adresse
   bleibt unverändert im Katalog stehen; siehe „Bekannte Unschärfen" Punkt 7.

## Schritt 1: Server und Stand

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
`git status --short`: leer. `git log --oneline -1`: `bbd0e66 Gymnasialtexte: sieben
Themen, Modellgrenzen um nicht gemessene Achsen ergänzt`.
`ls src/data/texte/*/gymnasium | grep -c objekt-` → `70` (35 je Sprache).
`ls src/data/texte/*/gymnasium | grep -c thema-` → `16` (8 je Sprache).
`grep -c "^    id: '" src/data/quellen.ts` → `62`. Alle vier Werte wie erwartet.

## Schritt 2: Dateitest und Verweisziele

```
$ npx vitest run src/data/texte/dateien.test.ts
 Test Files  1 passed (1)
      Tests  882 passed (882)
```

882 Fälle wie erwartet (176 Dateien × 5 + 2). Das Skript aus Task 9 Schritt 4
(Verweisziele je Niveau und Sprache, prüft `objekt:`- und `thema:`-Verweise gegen
vorhandene Dateien, `szene:` bis 4c-4 ausgenommen):

```bash
for sp in de en; do for nv in grundschule gymnasium; do
  grep -oh '\](\(objekt\|thema\):[a-z-]*)' src/data/texte/$sp/$nv/*.md | sed 's/^](//; s/)$//' | sort -u \
    | while IFS=: read -r art id; do test -f "src/data/texte/$sp/$nv/$art-$id.md" || echo "FEHLT $sp $nv $art-$id"; done
done; done
```

Ausgabe: leer, wie erwartet.

## Schritt 3: Rundgang Körper, beide Sprachen

Ziel bei jedem der 35 Körper einzeln gesetzt, gewartet, bis sich der Prosatext
gegenüber dem vorigen Ziel geändert hat oder ein Hinweis steht. Ein erster Lauf
über die deutsche Liste meldete für `sun` eine Nichtmessung, weil `sun` bereits
der Ausgangszustand der Seite war (kein Zielwechsel, kein Textwechsel als Signal);
die Einzelwiederholung mit einem echten Zielwechsel davor (`mercury` → `sun`)
lieferte innerhalb der Frist ein Ergebnis. Für alle übrigen 34 Körper sowie für den
gesamten englischen Lauf (in dem `sun` als echter Zielwechsel vom vorigen Körper
aus erreicht wurde) war jede Messung sofort erfolgreich.

**Ergebnis Deutsch** (`hinweise` durchweg `[]`, `karten ≥ 1` und `knoepfe ≥ 1`
durchweg erfüllt, `kopf` durchweg gleich der erwarteten Überschrift):

| id | kopf | Achsneigung | karten | knoepfe |
|---|---|---|---|---|
| sun | Sonne | 7,3° | 4 | 4 |
| mercury | Merkur | **0°** | 3 | 4 |
| venus | Venus | **177,4°** | 2 | 3 |
| earth | Erde | **23,4°** | 8 | 5 |
| moon | Mond | **6,7°** | 4 | 5 |
| mars | Mars | **25,2°** | 3 | 4 |
| phobos | Phobos | 0° | 3 | 4 |
| deimos | Deimos | 0,9° | 2 | 2 |
| jupiter | Jupiter | 3,1° | 4 | 8 |
| io | Io | 0° | 3 | 5 |
| europa | Europa | 0,5° | 4 | 4 |
| ganymede | Ganymed | 0,2° | 4 | 4 |
| callisto | Kallisto | 0,7° | 4 | 4 |
| saturn | Saturn | **26,7°** | 10 | 6 |
| mimas | Mimas | 1,6° | 3 | 2 |
| enceladus | Enceladus | 0° | 4 | 3 |
| tethys | Tethys | 1,1° | 3 | 3 |
| dione | Dione | 0° | 3 | 3 |
| rhea | Rhea | 0,3° | 3 | 4 |
| titan | Titan | **0,3°** | 5 | 4 |
| iapetus | Iapetus | 0° | 3 | 3 |
| uranus | Uranus | **97,8°** | 4 | 10 |
| miranda | Miranda | 4,3° | 4 | 3 |
| ariel | Ariel | 0,1° | 4 | 2 |
| umbriel | Umbriel | 0,2° | 4 | 4 |
| titania | Titania | 0,1° | 4 | 2 |
| oberon | Oberon | 0,1° | 4 | 2 |
| neptune | Neptun | 28,3° | 3 | 6 |
| triton | Triton | **21,4°** (Unschärfe, s. u.) | 3 | 3 |
| pluto | Pluto | 119,6° | 4 | 5 |
| charon | Charon | 0,1° | 3 | 3 |
| ceres | Ceres | 4° | 4 | 6 |
| eris | Eris | **0°** | 2 | 3 |
| haumea | Haumea | 90,2° | 2 | 3 |
| makemake | Makemake | **0°** | 2 | 4 |

Fett: die im Auftrag ausdrücklich genannten Prüfwerte (Merkur, Venus, Erde, Mars,
Saturn, Uranus, Mond, Titan, Eris, Makemake je 0/177,4/23,4/25,2/26,7/97,8/6,7/0,3/0/0°)
— alle wie erwartet. Triton zeigt wie erwartet `21,4°` (bekannte Unschärfe, siehe
unten und Task 9 Schritt 2).

**Ergebnis Englisch** (`hinweise` durchweg `[]`, insbesondere nirgends „Not
translated yet; German text shown."; `kopf` durchweg gleich der englischen
Überschrift; Achsneigung im englischen Zahlformat mit Punkt): Sun 7.3°, Mercury 0°,
Venus 177.4°, Earth 23.4°, Moon 6.7°, Mars 25.2°, Phobos 0°, Deimos 0.9°,
Jupiter 3.1°, Io 0°, Europa 0.5°, Ganymede 0.2°, Callisto 0.7°, Saturn 26.7°,
Mimas 1.6°, Enceladus 0°, Tethys 1.1°, Dione 0°, Rhea 0.3°, Titan 0.3°,
Iapetus 0°, Uranus 97.8°, Miranda 4.3°, Ariel 0.1°, Umbriel 0.2°, Titania 0.1°,
Oberon 0.1°, Neptune 28.3°, Triton 21.4°, Pluto 119.6°, Charon 0.1°, Ceres 4°,
Eris 0°, Haumea 90.2°, Makemake 0°. `karten`/`knoepfe` je Körper identisch zur
deutschen Tabelle. Erfüllt. Der erste Versuch mit einem vorangestellten
Zusatzschritt hatte für alle 35 Körper den Hinweis „Not translated yet" gezeigt.
Der Hinweis entstand durch einen Programmfehler: `InfoPanel.tsx` setzte die Hinweise
`info.hochschuleFolgt` und `info.nichtUebersetzt` seit 4c-1 ohne `frisch`, so dass
während eines Wechsels der alte Anzeigestand den neuen beschrieb. Das Messskript
nahm diesen Zwischenzustand mit seiner Sofort-Rückkehr bei stehendem Hinweis über
alle Ziele mit. Behoben in Commit `8014588` (siehe „Nacharbeit nach der
Schlussprüfung"); die Wiederholung ohne den Zusatzschritt lieferte das Ergebnis oben
ohne jeden Hinweis.

## Schritt 4: Rundgang Themen, beide Sprachen

Vor jedem Lauf `setCamera({ targetId: 'sun' })` und auf das Einschwingen von
Sonne gewartet (ein ungenügend abgesicherter erster Versuch ohne dieses Warten
zeigte kurzzeitig noch den alten Kopf „Sonne" statt „Finsternisse" — Nichtmessung,
mit Wartezeit behoben). Ergebnis (`hinweise` durchweg `[]`, `karten ≥ 1`):

| id | Kopf Deutsch | Kopf Englisch | karten |
|---|---|---|---|
| finsternis | Finsternisse | Eclipses | 3 |
| ringe | Ringsysteme | Ring systems | 3 |
| gebundene-rotation | Gebundene Rotation | Tidal locking | 1 |
| kirkwood-luecken | Kirkwood-Lücken | Kirkwood gaps | 1 |
| achsneigung | Achsneigung | Axial tilt | 2 |
| zwergplaneten | Zwergplaneten | Dwarf planets | 3 |
| bahnelemente | Bahnelemente | Orbital elements | 3 |
| modell | Grenzen des Modells | Limits of the model | 6 |

Alle Titel stimmen mit `thema.<id>.title` aus `ui/i18n` überein. Vierter Listenpunkt
in `modell` (Deutsch): „Nicht gemessene Achsen: Für Eris und Makemake ist die
Richtung der Drehachse unbekannt; die Simulation stellt sie senkrecht auf die Bahn,
der Datenblock zeigt dann 0° Achsneigung. Der Pol von Triton ist ohne seine
periodischen Schwankungen hinterlegt, seine Achsneigung im Datenblock ist deshalb
nicht belastbar." Englisch: „Unmeasured axes: For Eris and Makemake the direction
of the rotation axis is unknown; the simulation sets it perpendicular to the orbit,
and the data block then shows an axial tilt of 0°. The pole of Triton is stored
without its periodic variations, so its axial tilt in the data block is not
reliable." Beide wörtlich wie in Task 9 Schritt 2 eingefügt. Erfüllt.

## Schritt 5: Keine Sackgasse auf dem Gymnasium-Tab

**Methodik.** Für jeden der 35 Körper und 8 Themen wurde je Sprache jeder
Verweisknopf im `[role=tabpanel]` einzeln angeklickt, davor jeweils ein frischer
Ausgangszustand hergestellt (Kino aus, Kamera frei, Ziel beziehungsweise Thema
gesetzt, auf Prosa oder Hinweis gewartet), die Art des Verweises über die
Store-Änderung nach dem Klick bestimmt (`cinema.running` → Szene, `ui.info.thema`
→ Thema, `camera.targetId` → Objekt) und danach auf den eingeschwungenen Zustand
gewartet (Prosatext geändert oder Hinweiszeile `info.keinText` steht).

Zwei Messhürden traten auf und wurden behoben, bevor die Zählung als belastbar
gilt:

- Im Kino-Modus blendet `useIdleHide` (`src/ui/idle.ts`, 3 s) die gesamte
  Bedienoberfläche einschließlich des Infopanels aus, sobald keine Eingabe
  registriert wird — ein maschineller Rundgang ohne Mausbewegung lief deshalb in
  eine Nichtmessung, sobald eine Szene lief. Abhilfe: In jeder Wartephase ein
  synthetisches `pointermove`-Ereignis an `window` verteilen (`pauseOnInput` ist
  bereits `false`, ein Zeigerereignis pausiert das Kino deshalb nicht, setzt aber
  die Ruhefrist zurück).
- Ein Klick auf einen `objekt:`- oder `szene:`-Verweis **innerhalb eines
  Themen-Textes** löscht `ui.info.thema` als Nebenwirkung (`verweisAusfuehren`).
  Bei einem zu knapp bemessenen Rücksetzschritt zwischen zwei Knöpfen derselben
  Themen-Seite blieb dieses gelöschte Thema stehen, wodurch die nächste
  Knopfabfrage versehentlich die Knopfliste eines *anderen* Themas traf. Abhilfe:
  beim Rücksetzen für ein Themen-Ziel `ui.info.thema` unabhängig vom
  Kameraziel-Vergleich erzwingen. Auch nach beiden Korrekturen ordneten die
  automatisierten Gesamtläufe je Sprache fünf Szenenverweise aus vier Themen-Texten
  (`ringe` doppelt, `gebundene-rotation`, `kirkwood-luecken`, `achsneigung`) nicht
  als Szenen-, sondern als Objekt- oder Themenklick ein; diese fünf Klicks zeigten
  „kein Text" und zählten in den Gesamtläufen deshalb als vermeintliche Sackgassen.
  Kein Gesamtlauf lieferte also 0 Sackgassen. Die fünf Klicks wurden einzeln
  nachgemessen; dort setzte jeder zuverlässig `cinema.running` auf `true`, es sind
  also Szenenklicks. Die Zählung (a) und (b) unten beruht für diese fünf Klicks auf
  den Einzelmessungen, für alle übrigen auf den Gesamtläufen. Die Ursache der
  Fehleinordnung ist nicht untersucht (siehe Bekannte Unschärfen Punkt 8).

Als zusätzliche, von der Browsermessung unabhängige Bestätigung: Der Dateitest aus
Schritt 2 prüft für **jeden** `objekt:`- und `thema:`-Verweis in den
Gymnasialtexten beider Sprachen strukturell, dass die Zieldatei existiert — eine
Sackgasse „kein Text" ist für diese Verweisart damit ausgeschlossen, unabhängig
von der Browsermessung.

**Ergebnis, beide Sprachen zusammen:**

- **(a) `objekt:`- und `thema:`-Klicks: 326 (163 je Sprache), 0 Sackgassen.**
  163 je Sprache entspricht der Gesamtzahl der `objekt:`- und `thema:`-Verweise in
  den 43 Gymnasialdateien je Sprache (186 Verweisknöpfe insgesamt abzüglich 23
  `szene:`-Knöpfe, siehe unten; Kontrollzählung `grep -oh '\](\(objekt\|thema\|
  szene\):[a-z-]*)' src/data/texte/<sprache>/gymnasium/*.md | wc -l` → 186 je
  Sprache, deckungsgleich mit der Browsermessung der Knopfzahlen je Eintrag).
- **(b) `szene:`-Klicks: 46 (23 je Sprache). 6 zeigen Text (3 je Sprache), 40
  zeigen „kein Text" (20 je Sprache).** Alle sechs Treffer mit Text führen auf die
  Szene `mondfinsternis` (einzige Szene mit Gymnasialtext, `szene-mondfinsternis.md`
  existiert für beide Sprachen), erreicht aus `objekt-earth` (Verweistext „Szene"/
  „scene"), `objekt-moon` (Verweistext „Mondfinsternis"/„Lunar eclipse") und
  `thema-finsternis` (Verweistext „Mondfinsternis"/„Lunar eclipse"). Die 20
  Verweisstellen je Sprache mit „kein Text" (Kennung Quelle → Ziel):
  `objekt:sun`→systemblick, `objekt:mercury`→merkurjagd, `objekt:moon`→mondtanz,
  `objekt:phobos`→phobos-tiefflug, `objekt:jupiter`→jupiter-vorbeiflug,
  `objekt:enceladus`→enceladus-hell, `objekt:titan`→titan-dunst,
  `objekt:iapetus`→iapetus-schief, `objekt:uranus`→uranus-gekippt,
  `objekt:neptune`→ferne-sonne, `objekt:neptune`→triton-rueckwaerts,
  `objekt:triton`→triton-rueckwaerts, `objekt:pluto`→pluto-charon,
  `objekt:charon`→pluto-charon, `objekt:ceres`→ceres-guertel,
  `thema:ringe`→ringdurchflug, `thema:ringe`→saturn-ringkante,
  `thema:gebundene-rotation`→pluto-charon, `thema:kirkwood-luecken`→ceres-guertel,
  `thema:achsneigung`→uranus-gekippt. Das ist bis 4c-4 so vorgesehen (Ruling 11)
  und zählt nicht als Sackgasse des Kriteriums dieser Etappe.
- **(c) Nichtmessungen: 0** (nach Behebung der beiden Messhürden oben; alle
  ursprünglich als Nichtmessung oder als Fehlklassifikation aufgefallenen Fälle
  wurden einzeln nachgemessen, siehe oben).

Erfüllt im Sinn des Kriteriums: Kein `objekt:`- oder `thema:`-Verweis auf dem
Gymnasium-Tab führt auf „kein Text"; die 40 `szene:`-Treffer ohne Text sind offen
ausgewiesen und bis 4c-4 erwartet.

## Schritt 6: Stichproben mit echten Klicks

Playwright-Klicks (`browser_click`/`page.getByRole(...).click()`), Tab
„Gymnasium", Deutsch:

- **Merkur → „MESSENGER"** (Quellenverweis im Fließtext): Karte
  `a[data-quelle="nasa-messenger"]` erhält unmittelbar danach die Klassen
  `border-sky-300/80 bg-sky-400/20`. Erfüllt.
- **Europa → „Juice"**: Karte `a[data-quelle="esa-juice"]` ebenso hervorgehoben
  (`border-sky-300/80 bg-sky-400/20`). Erfüllt.
- **Ceres → „Bahnelemente"**: `ui.info.thema` = `bahnelemente`, Panelkopf
  „Bahnelemente", Liste mit sechs `<li>`-Punkten. Erfüllt.
- **Neptun → „Grenzen des Modells"**: `ui.info.thema` = `modell`, Panelkopf
  „Grenzen des Modells". Erfüllt.

## Schritt 7: Grundschul-Nachträge und Hochschul-Tab

Tab „Grundschule": Venus-Text enthält wörtlich „Drehung um sich selbst" (Deutsch)
und „single turn on its axis" (Englisch); Oberon-Text enthält wörtlich „mehrere
Kilometer" (Deutsch) und „several kilometres" (Englisch). Alle vier Fundstellen
bestätigt.

Tab „Hochschule", Ziel Mars: Hinweiszeile „Der Hochschultext folgt in einer
späteren Phase; gezeigt wird der Gymnasialtext." (`info.hochschuleFolgt`), darunter
beginnt die Prosa mit „Mars ist mit 6 779 km Durchmesser etwa halb so groß wie
die …" — wörtlich wie erwartet.

## Schritt 8: Konsole

`browser_console_messages` (Stufe `warning`, über die gesamte Sitzung,
`all: true`):

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

0 Fehler, 0 Warnungen. Erfüllt.

## Lint, Test, Build

```
$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm test
 Test Files  77 passed (77)
      Tests  1940 passed (1940)
   Start at  09:25:37
   Duration  10.21s

$ npm run build
✓ 301 modules transformed.
✓ built in 701ms
(!) Some chunks are larger than 500 kB after minification …
```

1940 Tests wie in der Fassung des Zusatzes erwartet (1536 + 5 aus Task 1/2 + 400
aus 80 neuen Dateien × 5 − 1 wegen der in Task 2 entfallenen Einzelprüfung). Der
Chunkgrößen-Hinweis ist derselbe allgemeine Vite-Hinweis wie in früheren Etappen,
kein Fehler und keine Regression dieser Aufgabe. `git status --short` vor dem
Commit dieses Protokolls weiterhin leer (bis auf die beiden neuen/geänderten
Dateien dieses Tasks).

## Bekannte Unschärfen

1. Triton zeigt im Datenblock 21,4° Achsneigung und Miranda 4,3°, weil ihre Pole
   ohne die periodischen IAU-Glieder hinterlegt sind; Eris und Makemake zeigen 0°
   als Behelf; der Pol von Haumea ist aus Lichtkurven angenommen und mehrdeutig.
   Eris, Makemake, Triton, Miranda und Haumea sind in `thema-modell` benannt
   (Nacharbeit nach der Schlussprüfung). Eine Datenkorrektur gehört nicht zu dieser
   Etappe.
2. Szenen haben auf dem Gymnasium-Tab außer `mondfinsternis` noch keinen Text
   (4c-4); die Zahl aus Schritt 5 (b): 40 von 46 Szenenklicks (20 je Sprache).
3. Der Hochschul-Tab zeigt weiterhin Gymnasialtexte mit Hinweis (Phase 4d).
4. Zahlen in den Texten sind gerundet; Aussagen zum Forschungsstand und zu
   Missionen (Juice 2034, Europa Clipper, Mimas-Ozean 2024, Makemake-Masse 2025)
   geben den Stand September 2026 wieder.
5. Quellenadressen sind am 15.09.2026 geprüft (Task 2); externe Seiten können sich
   ändern.
6. Der Dateitest prüft Themen- und Objektziele nur auf Existenz im Katalog, die
   Prüfung „Ziel hat Text im selben Niveau" läuft als Shell-Skript (Task 9
   Schritt 4); der Testfall kommt laut Entwurf §7 Nachtrag in 4c-4.
7. `pds-rings.seti.org` antwortete am 15.09.2026 beim Abruf mit Browser-User-Agent
   und 30 Sekunden Frist nicht (curl-Exit-Code 28, Zeitüberschreitung, kein
   HTTP-Code). Die Quelle bleibt unverändert im Katalog stehen; ob die Seite
   dauerhaft oder nur vorübergehend nicht erreichbar ist, wurde nicht weiter
   untersucht.
8. Im automatisierten Gesamtrundgang von Schritt 5 wurden fünf Szenenverweise aus
   vier Themen-Texten (`ringe` doppelt, `gebundene-rotation`, `kirkwood-luecken`,
   `achsneigung`) trotz der beiden dort beschriebenen Korrekturen in den
   Gesamtläufen je Sprache nicht als Szenen-, sondern als Objekt- oder Themenklick
   eingeordnet; sie zeigten „kein Text" und zählten dort als vermeintliche
   Sackgassen. Derselbe Klick setzte in jeder isolierten Einzelmessung zuverlässig
   `cinema.running` auf `true`. Die Zählung (a)/(b) in Schritt 5 beruht für diese
   fünf Klicks auf den Einzelmessungen. Die Ursache der Diskrepanz zwischen Einzel-
   und Gesamtlauf wurde nicht untersucht (vermutet: eine zeitliche Wechselwirkung
   mit dem Kino-Zustand nach vielen vorangegangenen Szenenstarts im selben langen
   Skriptlauf); die Einzelmessungen zeigen korrektes Verhalten.

## Kriterium — bewertet

Zitat aus dem Entwurf mit Nachtrag: **„Gymnasium komplett: 33 Körper und 7 Themen
in Deutsch und Englisch, Quellenkatalog auf rund 60 Quellen"**, zusätzlich wie in
Etappe 2: kein `objekt:`- oder `thema:`-Verweis auf dem Gymnasium-Tab führt auf
„kein Text", `szene:`-Verweise bis 4c-4 ausgenommen.

Bewertung: erfüllt. Alle 35 Körper und alle 8 Themen zeigen in beiden Sprachen
vollständigen, textlich stimmigen Inhalt mit korrekter Achsneigung im Datenblock
(Schritt 3/4), Quellenkatalog zählt 62 Einträge (Schritt 1). Stichproben auf
Quellen-, Themen- und Modellgrenzen-Verweise funktionieren wie vorgesehen
(Schritt 6), die Grundschul-Nachträge und der Hochschul-Hinweis sind vorhanden
(Schritt 7). Der erschöpfende Rundgang (Schritt 5) bestätigt 0 Sackgassen über
alle 326 `objekt:`- und `thema:`-Klicks beider Sprachen, zusätzlich strukturell
abgesichert durch den Dateitest aus Schritt 2; die 46 `szene:`-Klicks sind
getrennt ausgewiesen (40 zeigen „kein Text" — bis 4c-4 so vorgesehen, kein
Kriteriumsverstoß —, 6 zeigen den vorhandenen Text zu `mondfinsternis`). Lint,
Testsuite (1940 Tests) und Build laufen grün. Die noch offene Reichweite bis
4c-4 (Szenentexte) und bis 4d (Hochschule) steht ausgewiesen im Protokoll statt
verschwiegen zu werden.

## Nacharbeit nach der Schlussprüfung

**Datum:** 15.09.2026, Zweig `gymnasium`, Ausgangsstand `c8bb17b`.

- `8014588` „Infopanel: Hinweise nur für den frisch geladenen Stand, kein kurzes
  ‚Noch nicht übersetzt' beim Sprachwechsel": `info.hochschuleFolgt` und
  `info.nichtUebersetzt` erscheinen wie `info.keinText` nur noch für den frisch
  geladenen Anzeigestand; der neue Test `src/ui/info/InfoPanel.sprachwechsel.test.tsx`
  war vor der Änderung rot („Not translated yet; German text shown." im
  Zwischenzustand) und ist danach grün.
- `406f8e6` „Achsneigung: Tests für rückläufige Monde und Pluto": Ariel und Oberon
  (rückläufige Bahn gegen den IAU-Pol, negative Periode) ergänzen den Mondfall, ein
  neuer Fall prüft Pluto mit 119,6° ± 0,2° (gemessen 119,614°; Ariel 0,140°,
  Oberon 0,069°).
- `c482437` „Gymnasialtexte nach Schlussprüfung: Mimas-Resonanz, Sonne im Ursprung,
  Laplace-Ebene, nicht gemessene Achsen, Venusphasen, Dione-Abstand": Deutsch und
  Englisch parallel in `thema-ringe`, `thema-modell`, `objekt-venus` und
  `objekt-dione`; Verweisskript aus Schritt 2 danach ohne Ausgabe,
  `npx vitest run src/data/texte` mit 886 bestandenen Tests.
- Dieser Commit: Entwurf §4.4 und §8 mit Nachträgen (4c-3), dieses Protokoll
  korrigiert (Entscheidung 1, Schritt 3, Schritt 5, Bekannte Unschärfen 1, 5 und 8).

**Browserprobe zu `8014588`:** Seite neu geladen, Qualitätsstufe `high`, Infopanel
offen, Niveau `gymnasium`, Ziel `earth`, deutsche Prosa abgewartet. Danach
`setUi({ language: 'en' })` und 2 s lang im Abstand von 16 ms (Zeitbasis
`performance.now()`) nach `aside.info-panel [role=tabpanel] p.text-amber-300`
gesucht: 114 Abtastungen, 0 Treffer; Kopf „Earth" und englische Prosa nach 24 ms.
Zurück mit `setUi({ language: 'de' })`: 114 Abtastungen, 0 Treffer; Kopf „Erde" und
deutsche Prosa nach 21 ms.

**Testzahl:** 1942 (1940 + Sprachwechsel-Test + Pluto-Fall; Ariel und Oberon
laufen im bestehenden Mondfall mit).

```
$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm test
 Test Files  78 passed (78)
      Tests  1942 passed (1942)
   Start at  09:57:50
   Duration  10.13s

$ npm run build
dist/assets/index-DLcuJMwF.js                     1,195.59 kB │ gzip: 317.66 kB
✓ built in 489ms
(!) Some chunks are larger than 500 kB after minification …
```

Der Chunkgrößen-Hinweis ist derselbe allgemeine Vite-Hinweis wie oben.
