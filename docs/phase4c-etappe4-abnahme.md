# Phase 4c — Etappe 4: Abnahmeprotokoll

**Datum:** 16.09.2026
**Stand:** Zweig `szenen`, HEAD zu Beginn der Abnahme `a5bb057` (Tasks 1 bis 8 der
Etappe 4: Szenentexte für alle 19 Kinoszenen in Grundschule und Gymnasium, Deutsch
und Englisch, Thema „Das Sonnensystem" mit vier Quellen, `data-verweis` an allen
aufgelösten Verweisen, Quellenkatalog auf 66, Dateitest „Ziel hat Text im selben
Niveau" für `objekt:`/`thema:`/`szene:`).
**Prüfumgebung:** Windows 11, Desktop mit RTX 4060, Chromium (Playwright),
Vite-Entwicklungsserver auf `http://localhost:5173/Orrery/`, Qualitätsstufe nach
jeder Navigation per `window.store.setState` auf `high` gesetzt,
`setCinema({ pauseOnInput: false })` gesetzt und in jeder Wartephase ein
synthetisches `pointermove` an `window` verteilt (Kino-Leerlaufausblendung nach
3 s). Infopanel per Store offen gehalten. Alle Abfragen liefen per
`browser_run_code_unsafe` gegen `window.store` und das DOM, Wartezeiten über
`performance.now()`-Schleifen im 30/50-ms-Takt; Schritt 5 und die Stichproben aus
Schritt 7 Teil B liefen über echte Klicks (`page.click`/`getByRole(...).click()`
beziehungsweise `browser_click`).

## Entscheidungen während der Umsetzung

1. **Schritt 7 Teil A, Nichtmessungen „sun":** In den Kombinationen `de`/
   `grundschule` und `de`/`gymnasium` war der Körper `sun` beim Start des
   Körper-Rundgangs bereits das Kameraziel (Nachwirkung eines vorigen Messschritts
   dieser Sitzung), wie schon in Etappe 3 Schritt 3 dokumentiert: Ein
   Zielwechsel auf sich selbst ändert den Kopf nicht, die Warteschleife lief in
   die Frist. Beide wurden einzeln mit einem echten Zielwechsel davor
   (`mercury` → `sun`) wiederholt und lieferten sofort ein Ergebnis; die Werte
   gehen in die Zählung unten ein. Für die Kombinationen `en`/`grundschule` und
   `en`/`gymnasium` wurde vorsorglich ein Aufwärmziel (`ceres`) gesetzt, danach
   trat keine Nichtmessung mehr auf.
2. **Schritt 7 Teil B, Test 3 (Gymnasium-Szene `pluto-charon` → „Grenzen des
   Modells"):** Ein erster Versuch verteilte das Setzen der Szene, das Warten
   und den Klick auf mehrere Werkzeugaufrufe; in der dabei verstrichenen echten
   Zeit (Szenendauer 45 s) lief das Kino über die Szene hinaus, der Klickversuch
   traf eine bereits zwei Szenen weiter gesprungene Seite ohne den gesuchten
   Verweis. Die Wiederholung mit Setzen, Warten und Klick in einem einzigen
   Skriptdurchlauf gelang unmittelbar (siehe Schritt 7).
3. **Schritt 7 Teil B, Test 3, zweite Ursache:** Vor dem Szenenstart stand noch
   `ui.info.thema = 'ringe'` aus Test 2. `setCinema`/`setCamera` direkt aus dem
   Messskript aufgerufen verwerfen ein gesetztes Thema anders als der reale
   Klickweg (`fahreZu`/`fahreZuSystem`, Ruling 6 der Umsetzung) nicht von
   selbst — die Szene zeigte deshalb weiter „Ringsysteme". Abhilfe:
   `setInfo({ thema: null })` vor jedem direkten Szenenstart im Messskript.
   Kein Befund am Produktcode: Der reale Klickweg setzt Ziel/Szene und Thema
   laut Ruling 6 in einem einzigen `setState` und ist davon nicht betroffen.

## Schritt 1: Server und Stand

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
`git branch --show-current`: `szenen`. `git status --short`: leer.
`git log --oneline -1`: `a5bb057 Szenentext Phobos-Tiefflug: Mars erscheint rund
42° groß`. `ls src/data/texte/*/*/szene-*.md | wc -l` → `76`.
`ls src/data/texte/*/*/thema-sonnensystem.md | wc -l` → `4`.
`ls src/data/texte/*/*/*.md | wc -l` → `252`.
`grep -c "^    id: '" src/data/quellen.ts` → `66`. Alle sechs Werte wie erwartet.

## Schritt 2: Dateitest

```
$ npx vitest run src/data/texte/dateien.test.ts
 Test Files  1 passed (1)
      Tests  1766 passed (1766)
```

1766 Fälle wie erwartet.

## Schritt 3: Start ohne Link und ohne Sitzung

`localStorage.removeItem('orrery.sitzung.v1')`, dann `browser_navigate` auf
`http://localhost:5173/Orrery/` ohne Fragment, danach Qualitätsstufe `high`.

- `window.store.getState().ui.info.thema` → `'sonnensystem'`,
  `camera.targetId` → `'sun'`. Erfüllt.
- Kopf „Das Sonnensystem", Hinweiszeilen: `[]`. Erfüllt.
- Kartenkennungen `[...document.querySelectorAll('aside.info-panel
  a[data-quelle]')].map((a) => a.dataset.quelle)` →
  `['wikipedia-de-orrery', 'wikipedia-en-orrery', 'nasa-sonnensystem',
  'sciencemuseum-orrery']` — alle vier erwarteten Kennungen enthalten. Erfüllt.
- Klick auf den Verweis „Sammlungsobjekt": Karte `a[data-quelle=
  "sciencemuseum-orrery"]` erhält unmittelbar danach die Klassen
  `border-sky-300/80 bg-sky-400/20` (Hervorhebung ist auf 1500 ms befristet —
  Klick und Prüfung liefen deshalb in einem einzigen Skriptdurchlauf ohne
  Zwischen-Roundtrip). Erfüllt.
- Tab „Grundschule": Kopf „Das Sonnensystem", Prosa enthält wörtlich „Dieses
  Programm heißt Orrery", Hinweiszeilen `[]`. Erfüllt.
- Sprache Englisch: Kopf „The Solar System", Hinweiszeilen `[]`. Zurück auf
  Deutsch, Tab „Gymnasium": Kopf „Das Sonnensystem", `ui.info.niveau` →
  `'gymnasium'`. Erfüllt.

## Schritt 4: Start über einen Link

`linkErzeugen(state, location)` mit `camera.targetId = 'mars'` lieferte
`http://localhost:5173/Orrery/#p=eyJ0aW1lIjp7ImpkIjoyNDUxNjgxLjI0MDU5OTkwM30sImNhbWVyYSI6eyJ0YXJnZXRJZCI6Im1hcnMifX0`.
Nach `browser_navigate` auf diese Adresse und Qualitätsstufe `high`:
`ui.info.thema` → `null`, Kopf „Mars". Erfüllt.

## Schritt 5: Wurzel, Sonne, Zurücksetzen

Ausgangslage Ziel Mars (Kopf „Mars"), echte Klicks, je 2 s Wartezeit danach:

1. Wurzel „Sonnensystem" im Panel Himmelskörper → `ui.info.thema` →
   `'sonnensystem'`, `camera.targetId` → `'sun'`, Kopf „Das Sonnensystem",
   `camera.elevation` → `1.5707963267948966` (= `Math.PI / 2` exakt). Erfüllt.
2. Zeile „Sonne" im Objektbaum → `thema` → `null`, Kopf „Sonne". Erfüllt.
3. Zeile „Jupiter" → Kopf „Jupiter"; danach „Zurücksetzen" in der Kopfzeile →
   `thema` → `'sonnensystem'`, `targetId` → `'sun'`, Kopf „Das Sonnensystem".
   Erfüllt.
4. Themenverweis „Bahnelementen" im Sonnensystem-Text → Kopf „Bahnelemente";
   danach Wurzel „Sonnensystem" → Kopf „Das Sonnensystem". Erfüllt.

## Schritt 6: Rundgang Szenen, beide Niveaus und Sprachen

Für alle 19 Szenen aus `SCENES`, je Sprache (`de`, `en`) und Niveau
(`grundschule`, `gymnasium`): `setCinema({ running: true, shuffle: false,
nummer: i, pauseOnInput: false })`, `setCamera({ mode: 'cinema' })`, Warten mit
`pointermove` je Takt, bis der Kopf zur Szene passt (Frist 4 s je Szene).
**Ergebnis: alle 76 Messungen (19 Szenen × 2 Niveaus × 2 Sprachen) sofort
erfolgreich, 0 Nichtmessungen.** Für jede Szene war `hinweise` durchweg `[]`,
`karten ≥ 1` (Minimum 2 bei `titan-dunst`) und der Szenenkopf mit „Standort"
(Deutsch) beziehungsweise „Location" (Englisch) vorhanden.

Ergebnis Deutsch, Grundschule (Kopf = Szenentitel) und Gymnasium (Kopf =
„Szene: " + Titel, gleiche Kartenzahl):

| id | Titel (Grundschule) | Karten |
|---|---|---|
| erdaufgang | Sonnenaufgang über dem Erdrand | 4 |
| saturn-streiflicht | Saturn im Streiflicht | 3 |
| mondtanz | Der Tanz des Mondes | 3 |
| ferne-sonne | Von Neptun zur fernen Sonne | 3 |
| systemblick | Das System von oben | 4 |
| merkurjagd | Merkur auf der Innenbahn | 3 |
| jupiter-vorbeiflug | Vorbeiflug an Jupiter | 5 |
| galileisches-schattenspiel | Das galileische Schattenspiel | 3 |
| phobos-tiefflug | Tiefflug über Phobos | 3 |
| pluto-charon | Pluto und Charon im Doppel | 3 |
| saturn-ringkante | Saturns Ringe von der Kante | 3 |
| ringdurchflug | Durchflug durch Saturns Ringe | 3 |
| titan-dunst | Titan im Dunst vor Saturn | 2 |
| enceladus-hell | Enceladus im hellen Glanz | 3 |
| triton-rueckwaerts | Tritons rückläufige Bahn | 4 |
| iapetus-schief | Die geneigte Bahn des Iapetus | 3 |
| uranus-gekippt | Der liegende Uranus | 4 |
| ceres-guertel | Ceres im Asteroidengürtel | 3 |
| mondfinsternis | Mondfinsternis | 5 |

Ergebnis Englisch, Grundschule (Kopf = Szenentitel) und Gymnasium (Kopf =
„Scene: " + Titel): Sunrise over the limb of the Earth, Saturn in grazing
light, The dance of the Moon, From Neptune to the distant Sun, The Solar
System from above, Mercury on the inner orbit, Flyby of Jupiter, The Galilean
shadow play, Low pass over Phobos, Pluto and Charon, a double world, Saturn's
rings edge-on, Flying through Saturn's rings, Hazy Titan in front of Saturn,
Enceladus in brilliant light, Triton's retrograde orbit, The tilted orbit of
Iapetus, Uranus lying on its side, Ceres in the asteroid belt, Lunar eclipse —
je Szene dieselbe Kartenzahl wie in der deutschen Tabelle, `hinweise` durchweg
`[]`. 76 von 76 Zeilen erfüllt, keine Wiederholung nötig.

## Schritt 7: Keine Sackgasse

**Teil A, vollständig.** Für jede der vier Kombinationen (`de`/`grundschule`,
`de`/`gymnasium`, `en`/`grundschule`, `en`/`gymnasium`) wurden nacheinander 35
Körper (`setCamera({ targetId })`, Kino aus), 9 Themen (`setInfo({ thema })`)
und 19 Szenen (wie Schritt 6) angezeigt, nach jedem Wechsel bis zu einem
geänderten Kopf oder einer Hinweiszeile gewartet (Frist 4 s), danach alle
`aside.info-panel [role=tabpanel] [data-verweis]` mit einem Wert `objekt:`,
`szene:` oder `thema:` eingesammelt und `textVorhanden(sprache, niveau, {
art, kennung })` geprüft. Ergebnis je Kombination (Nichtmessung „sun" bereits
durch die Einzelwiederholung aus Entscheidung 1 eingerechnet):

| Kombination | objekt: | szene: | thema: | Fehler | Nichtmessungen |
|---|---|---|---|---|---|
| de / grundschule | 131 | 17 | 22 | 0 | 1 (sun, behoben) |
| de / gymnasium | 194 | 25 | 58 | 0 | 1 (sun, behoben) |
| en / grundschule | 131 | 17 | 22 | 0 | 0 |
| en / gymnasium | 194 | 25 | 58 | 0 | 0 |
| **Summe** | **650** | **84** | **160** | **0** | **2 (beide behoben)** |

**Ergebnis: 894 geprüfte Verweise (650 `objekt:`, 84 `szene:`, 160 `thema:`),
0 Sackgassen.** Beide Nichtmessungen betrafen denselben Sonderfall (Entscheidung
1) und sind durch die Einzelmessung mit vorangehendem echten Zielwechsel
aufgelöst; deren Ergebnisse (`objekt:sun` mit je 0 Fehlern) sind in der Summe
enthalten.

**Teil B, Stichprobe mit echten Klicks, Deutsch (sofern nicht anders vermerkt):**

- **Gymnasium Merkur → „Merkur auf der Innenbahn":** Kino läuft
  (`cinema.running` → `true`), Kopf „Szene: Merkur auf der Innenbahn",
  Hinweiszeilen `[]`. Erfüllt.
- **Grundschule Saturn → Verweis auf `thema:ringe`** (Verweistext „Ringen"):
  Kopf „Ringsysteme", Hinweiszeilen `[]`. Erfüllt.
- **Gymnasium Szene `pluto-charon` → „Grenzen des Modells"** (siehe
  Entscheidungen 2 und 3): Kopf „Grenzen des Modells", Listenpunkt „Ruhende
  Mutterkörper: Monde umlaufen hier den Mittelpunkt ihres Planeten oder
  Zwergplaneten, der selbst nicht um den gemeinsamen Schwerpunkt pendelt. …"
  vorhanden. Erfüllt.
- **Englisch, Gymnasium, Szene `systemblick` → „The Solar System":** Kopf vor
  dem Klick „Scene: The Solar System from above", danach „The Solar System",
  Hinweiszeilen in beiden Zuständen `[]`. Erfüllt.
- **Englisch, Grundschule, Szene `jupiter-vorbeiflug` → „Earths":** Kopf vor
  dem Klick „Flyby of Jupiter" (Verweise `Jupiter`→`objekt:jupiter`, `Earths`→
  `objekt:earth`), nach dem Klick endet das Kino (`cinema.running` → `false`),
  Kopf „The Earth", Hinweiszeilen `[]`. Erfüllt.

## Schritt 8: Hochschul-Tab

Szene `titan-dunst` im Kino, Tab „Hochschule": Hinweiszeile „Der Hochschultext
folgt in einer späteren Phase; gezeigt wird der Gymnasialtext."
(`info.hochschuleFolgt`), darunter beginnt die Prosa wörtlich mit „Die Kamera
umkreist Titan in rund sieben …" — wie erwartet. Thema `sonnensystem`, Tab
„Hochschule": dieselbe Hinweiszeile, Prosa beginnt wörtlich mit „Das
Sonnensystem entstand vor rund 4,6 M…" — wie erwartet. Beide erfüllt.

## Schritt 9: Konsole

`browser_console_messages` (Stufe `warning`, über die gesamte Sitzung,
`all: true`):

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

0 Fehler, 0 Warnungen. Erfüllt.

## Schritt 10: Lint, Test, Build

```
$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm test
 Test Files  81 passed (81)
      Tests  2892 passed (2892)
   Start at  23:37:57
   Duration  11.64s

$ npm run build
✓ built in 536ms
(!) Some chunks are larger than 500 kB after minification …
```

2892 Tests wie erwartet. Der Chunkgrößen-Hinweis ist derselbe allgemeine
Vite-Hinweis wie in früheren Etappen, kein Fehler und keine Regression dieser
Aufgabe. `git status --short` vor dem Commit dieses Protokolls weiterhin leer
(bis auf die beiden neuen/geänderten Dateien dieses Tasks).

## Bekannte Unschärfen

1. Szenen streuen Blickrichtung und Abstand je Abspielen; die Texte
   beschreiben den Kameraweg deshalb mit Spannen („zwei bis drei Erdradien")
   oder bedingt („mit etwas Glück zieht Saturn durchs Bild").
2. `galileisches-schattenspiel` zeigt die Mondschatten auf Jupiter höchstens
   einen Bildpunkt groß; die Szene bleibt laut Entscheidung von Jens
   unverändert, der Text sagt es offen.
3. Die Helligkeit von Enceladus in `enceladus-hell` ist gegenüber der
   Rückstrahlung gedämpft (Befund aus Phase 3a); der Text behauptet keine
   Bildhelligkeit.
4. Ob in `ceres-guertel` Gürtelpunkte im Hintergrund zu sehen sind, ist nicht
   gemessen; der Text spricht nur über die Wirklichkeit und die Punktwolke als
   Darstellung.
5. Aussagen zu Missionen und Ereignissen (Juno 2016, Ringebenendurchgang 2025
   und 2038, Uranus-Sonnenwende 2028) geben den Stand September 2026 wieder.
6. Die Seite des Science Museum weist Skripte ohne Browserkennung mit 403 ab;
   im Browser öffnet sie (Schritt 3, Mittelklick-Probe optional — hier nicht
   gesondert nachgemessen).
7. Der Hochschul-Tab zeigt weiterhin Gymnasialtexte mit Hinweis (Phase 4d).
8. Die Zahl „35 Körper, 21 Monde" steht im Sonnensystem-Text fest und muss bei
   einer Katalogänderung nachgezogen werden.

## Kriterium — bewertet

Zitat aus dem Entwurf mit den Nachträgen vom 14.09. und 16.09.2026: **„19
Szenen in beiden Niveaus und Sprachen, Dateitest ‚Ziel hat Text im selben
Niveau', Thema Sonnensystem beim Start und an der Wurzel, Quellenkarten für
alle Szenen"**, zusätzlich: kein `objekt:`-, `szene:`- oder `thema:`-Verweis
führt auf „kein Text".

Bewertung: erfüllt. Alle 19 Szenen zeigen in beiden Niveaus und Sprachen
vollständigen, textlich stimmigen Inhalt mit mindestens einer Quellenkarte
(Schritt 6, 76 von 76 Messungen sofort erfolgreich). Der Dateitest
`dateien.test.ts` bestätigt strukturell 1766 Fälle (Schritt 2), zusammen mit
dem Katalogstand aus Schritt 1 (76 Szenendateien, 4 Sonnensystem-Dateien, 252
Textdateien insgesamt, 66 Quellen). Das Thema Sonnensystem erscheint beim
Start ohne Link und ohne Sitzung sowie an der Wurzel des Objektbaums, mit den
vier erwarteten Quellenkarten und funktionierender Quellen-Hervorhebung
(Schritt 3), bleibt bei einem Link mit Ziel aus (Schritt 4) und lässt sich
über Wurzel, Objektbaum-Zeile, „Zurücksetzen" und Themenverweis konsistent an-
und abwählen (Schritt 5). Der erschöpfende Rundgang aus Schritt 7 Teil A
bestätigt 0 Sackgassen über alle 894 geprüften `objekt:`-, `szene:`- und
`thema:`-Verweise beider Sprachen und Niveaus; die Stichprobe mit echten
Klicks (Teil B) bestätigt dasselbe Bild an fünf unabhängigen Stellen
einschließlich eines Szenenendes durch Objektklick. Der Hochschul-Tab zeigt
wie vorgesehen den Gymnasialtext mit Hinweis (Schritt 8, Phase 4d offen).
Konsole, Lint, Testsuite (2892 Tests) und Build laufen fehlerfrei (Schritt 9,
10). Phase 4c ist damit inhaltlich komplett; die noch offene Hochschulstufe
(4d) steht ausgewiesen im Protokoll statt verschwiegen zu werden.
