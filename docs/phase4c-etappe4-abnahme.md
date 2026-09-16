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
   **Richtigstellung (17.09.2026):** Doch ein Befund am Produktcode — der
   Verfall hing an einem Effekt im eingehängten InfoPanel und blieb aus, wenn
   die Oberfläche beim Wechsel ausgehängt war (etwa im Kino nach Ruhe); er ist
   jetzt ein Store-Abonnement, siehe „Nacharbeit nach der Schlussprüfung",
   Befund A.

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
`pointermove` je Takt, bis der Kopf zur Szene passt (Frist 4 s je Szene), dann
Kopf, Hinweiszeilen, Kartenzahl und Szenenkopf-Vorhandensein im selben
Skriptdurchlauf ausgelesen. Die Tabelle unten stammt aus dem ersten Lauf
dieser Abnahme (16.09.2026, während der Erarbeitung von Commit `f53c89e`, vor
dem eigentlichen Commit; Stand des Codes unverändert `a5bb057`) — keine
Wiederholung nötig, da die Rohwerte aus diesem Lauf vollständig vorlagen.
**Ergebnis: alle 76 Messungen (19 Szenen × 2 Sprachen × 2 Niveaus) sofort
erfolgreich, 0 Nichtmessungen**, `hinweise` durchweg `[]`, `karten ≥ 1`
(Minimum 2 bei `titan-dunst`) und der Szenenkopf mit „Standort" (Deutsch)
beziehungsweise „Location" (Englisch) in jeder Zeile vorhanden.

| Szene | Sprache | Niveau | gemessen | Kopf (wörtlich) | Hinweise | Karten | Szenenkopf |
|---|---|---|---|---|---|---|---|
| erdaufgang | de | grundschule | ja | Sonnenaufgang über dem Erdrand | [] | 4 | ja |
| erdaufgang | de | gymnasium | ja | Szene: Sonnenaufgang über dem Erdrand | [] | 4 | ja |
| erdaufgang | en | grundschule | ja | Sunrise over the limb of the Earth | [] | 4 | ja |
| erdaufgang | en | gymnasium | ja | Scene: Sunrise over the limb of the Earth | [] | 4 | ja |
| saturn-streiflicht | de | grundschule | ja | Saturn im Streiflicht | [] | 3 | ja |
| saturn-streiflicht | de | gymnasium | ja | Szene: Saturn im Streiflicht | [] | 3 | ja |
| saturn-streiflicht | en | grundschule | ja | Saturn in grazing light | [] | 3 | ja |
| saturn-streiflicht | en | gymnasium | ja | Scene: Saturn in grazing light | [] | 3 | ja |
| mondtanz | de | grundschule | ja | Der Tanz des Mondes | [] | 3 | ja |
| mondtanz | de | gymnasium | ja | Szene: Der Tanz des Mondes | [] | 3 | ja |
| mondtanz | en | grundschule | ja | The dance of the Moon | [] | 3 | ja |
| mondtanz | en | gymnasium | ja | Scene: The dance of the Moon | [] | 3 | ja |
| ferne-sonne | de | grundschule | ja | Von Neptun zur fernen Sonne | [] | 3 | ja |
| ferne-sonne | de | gymnasium | ja | Szene: Von Neptun zur fernen Sonne | [] | 3 | ja |
| ferne-sonne | en | grundschule | ja | From Neptune to the distant Sun | [] | 3 | ja |
| ferne-sonne | en | gymnasium | ja | Scene: From Neptune to the distant Sun | [] | 3 | ja |
| systemblick | de | grundschule | ja | Das System von oben | [] | 4 | ja |
| systemblick | de | gymnasium | ja | Szene: Das System von oben | [] | 4 | ja |
| systemblick | en | grundschule | ja | The Solar System from above | [] | 4 | ja |
| systemblick | en | gymnasium | ja | Scene: The Solar System from above | [] | 4 | ja |
| merkurjagd | de | grundschule | ja | Merkur auf der Innenbahn | [] | 3 | ja |
| merkurjagd | de | gymnasium | ja | Szene: Merkur auf der Innenbahn | [] | 3 | ja |
| merkurjagd | en | grundschule | ja | Mercury on the inner orbit | [] | 3 | ja |
| merkurjagd | en | gymnasium | ja | Scene: Mercury on the inner orbit | [] | 3 | ja |
| jupiter-vorbeiflug | de | grundschule | ja | Vorbeiflug an Jupiter | [] | 5 | ja |
| jupiter-vorbeiflug | de | gymnasium | ja | Szene: Vorbeiflug an Jupiter | [] | 5 | ja |
| jupiter-vorbeiflug | en | grundschule | ja | Flyby of Jupiter | [] | 5 | ja |
| jupiter-vorbeiflug | en | gymnasium | ja | Scene: Flyby of Jupiter | [] | 5 | ja |
| galileisches-schattenspiel | de | grundschule | ja | Das galileische Schattenspiel | [] | 3 | ja |
| galileisches-schattenspiel | de | gymnasium | ja | Szene: Das galileische Schattenspiel | [] | 3 | ja |
| galileisches-schattenspiel | en | grundschule | ja | The Galilean shadow play | [] | 3 | ja |
| galileisches-schattenspiel | en | gymnasium | ja | Scene: The Galilean shadow play | [] | 3 | ja |
| phobos-tiefflug | de | grundschule | ja | Tiefflug über Phobos | [] | 3 | ja |
| phobos-tiefflug | de | gymnasium | ja | Szene: Tiefflug über Phobos | [] | 3 | ja |
| phobos-tiefflug | en | grundschule | ja | Low pass over Phobos | [] | 3 | ja |
| phobos-tiefflug | en | gymnasium | ja | Scene: Low pass over Phobos | [] | 3 | ja |
| pluto-charon | de | grundschule | ja | Pluto und Charon im Doppel | [] | 3 | ja |
| pluto-charon | de | gymnasium | ja | Szene: Pluto und Charon im Doppel | [] | 3 | ja |
| pluto-charon | en | grundschule | ja | Pluto and Charon, a double world | [] | 3 | ja |
| pluto-charon | en | gymnasium | ja | Scene: Pluto and Charon, a double world | [] | 3 | ja |
| saturn-ringkante | de | grundschule | ja | Saturns Ringe von der Kante | [] | 3 | ja |
| saturn-ringkante | de | gymnasium | ja | Szene: Saturns Ringe von der Kante | [] | 3 | ja |
| saturn-ringkante | en | grundschule | ja | Saturn's rings edge-on | [] | 3 | ja |
| saturn-ringkante | en | gymnasium | ja | Scene: Saturn's rings edge-on | [] | 3 | ja |
| ringdurchflug | de | grundschule | ja | Durchflug durch Saturns Ringe | [] | 3 | ja |
| ringdurchflug | de | gymnasium | ja | Szene: Durchflug durch Saturns Ringe | [] | 3 | ja |
| ringdurchflug | en | grundschule | ja | Flying through Saturn's rings | [] | 3 | ja |
| ringdurchflug | en | gymnasium | ja | Scene: Flying through Saturn's rings | [] | 3 | ja |
| titan-dunst | de | grundschule | ja | Titan im Dunst vor Saturn | [] | 2 | ja |
| titan-dunst | de | gymnasium | ja | Szene: Titan im Dunst vor Saturn | [] | 2 | ja |
| titan-dunst | en | grundschule | ja | Hazy Titan in front of Saturn | [] | 2 | ja |
| titan-dunst | en | gymnasium | ja | Scene: Hazy Titan in front of Saturn | [] | 2 | ja |
| enceladus-hell | de | grundschule | ja | Enceladus im hellen Glanz | [] | 3 | ja |
| enceladus-hell | de | gymnasium | ja | Szene: Enceladus im hellen Glanz | [] | 3 | ja |
| enceladus-hell | en | grundschule | ja | Enceladus in brilliant light | [] | 3 | ja |
| enceladus-hell | en | gymnasium | ja | Scene: Enceladus in brilliant light | [] | 3 | ja |
| triton-rueckwaerts | de | grundschule | ja | Tritons rückläufige Bahn | [] | 4 | ja |
| triton-rueckwaerts | de | gymnasium | ja | Szene: Tritons rückläufige Bahn | [] | 4 | ja |
| triton-rueckwaerts | en | grundschule | ja | Triton's retrograde orbit | [] | 4 | ja |
| triton-rueckwaerts | en | gymnasium | ja | Scene: Triton's retrograde orbit | [] | 4 | ja |
| iapetus-schief | de | grundschule | ja | Die geneigte Bahn des Iapetus | [] | 3 | ja |
| iapetus-schief | de | gymnasium | ja | Szene: Die geneigte Bahn des Iapetus | [] | 3 | ja |
| iapetus-schief | en | grundschule | ja | The tilted orbit of Iapetus | [] | 3 | ja |
| iapetus-schief | en | gymnasium | ja | Scene: The tilted orbit of Iapetus | [] | 3 | ja |
| uranus-gekippt | de | grundschule | ja | Der liegende Uranus | [] | 4 | ja |
| uranus-gekippt | de | gymnasium | ja | Szene: Der liegende Uranus | [] | 4 | ja |
| uranus-gekippt | en | grundschule | ja | Uranus lying on its side | [] | 4 | ja |
| uranus-gekippt | en | gymnasium | ja | Scene: Uranus lying on its side | [] | 4 | ja |
| ceres-guertel | de | grundschule | ja | Ceres im Asteroidengürtel | [] | 3 | ja |
| ceres-guertel | de | gymnasium | ja | Szene: Ceres im Asteroidengürtel | [] | 3 | ja |
| ceres-guertel | en | grundschule | ja | Ceres in the asteroid belt | [] | 3 | ja |
| ceres-guertel | en | gymnasium | ja | Scene: Ceres in the asteroid belt | [] | 3 | ja |
| mondfinsternis | de | grundschule | ja | Mondfinsternis | [] | 5 | ja |
| mondfinsternis | de | gymnasium | ja | Szene: Mondfinsternis | [] | 5 | ja |
| mondfinsternis | en | grundschule | ja | Lunar eclipse | [] | 5 | ja |
| mondfinsternis | en | gymnasium | ja | Scene: Lunar eclipse | [] | 5 | ja |

76 von 76 Zeilen erfüllt, 0 Nichtmessungen, keine Wiederholung nötig.

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

## Nacharbeit nach der Schlussprüfung

**Datum:** 17.09.2026
**Ausgangsstand:** Zweig `szenen`, HEAD `8cfee63`; Code und Tests der Nacharbeit
in `118fe74`.

### Befunde

- **A (Themenverfall hing am eingehängten Panel):** Der Effekt in
  `ui/info/InfoPanel.tsx` verwarf ein Thema nur, solange das Panel eingehängt
  war. `ui/App.tsx` hängt die Oberfläche bei `ui.hidden` und im Kino nach Ruhe
  aus. Nach 4 s ohne Eingabe startete Taste C das Kino, bevor `useIdleHide` die
  Untätigkeit zurücksetzte; das Panel hängte sich mit schon neuer Grundlage
  wieder ein, das Thema `sonnensystem` blieb stehen. Ein späterer Klick auf die
  Wurzel oder „Zurücksetzen" verwarf es dann fälschlich (Kopf „Sonne").
- **B (Zurücksetzen aus dem Kino):** Mit schon gewähltem `sonnensystem` (etwa
  über den Verweis in `systemblick`) wechselt „Zurücksetzen" die Grundlage bei
  gleichem Themenwert; das neue Abonnement hätte das Thema verworfen.
- **C (Szenentext im angehaltenen Kino):** `laufendeSzene` wertete nur
  `cinema.running` aus. Mit `pauseOnInput: true` hält die erste Eingabe den Film
  an, die Oberfläche erscheint erst danach, und das Panel zeigte das Kameraziel
  von vor dem Kino (gemessen: Kopf „Sonne").
- **D (Testlücken):** Kein Test deckte den Verfall ohne eingehängtes Panel,
  Wurzel und Zurücksetzen aus dem Kino oder das angehaltene Kino ab.
- **E (Kleinigkeiten):** veraltete Kommentare über `zurueckgesetzt`
  (`store/persist.ts`) und `grundlage` (`ui/info/aktuellerText.ts`), drei
  überzählige Leerzeilen am Ende von `data/quellen.ts`, Standort und Blickziel
  im Szenenkopf ohne `data-verweis`.

### Rulings

1. **Ruling: Verfall als Store-Abonnement statt React-Effekt.**
   `ui/info/themaVerfall.ts` (`themaVerfallStarten`) prüft jeden Store-Übergang:
   Thema gesetzt, gegenüber vorher unverändert, Grundlage gewechselt → `null`.
   „Im selben Zug" heißt „im selben `setState`". `app/main.tsx` startet das
   Abonnement nach `replaceAll(startZustand(…))`. Keine Regel über die Identität
   von `ui.info`, weil `ansichtAnwenden` `ui` ebenfalls neu schreibt.
2. **Ruling: Der Szenentext gilt im laufenden und im angehaltenen Kino**
   (`cinema.running || camera.mode === 'cinema'`, wie `cinemaAktiv()`). Die
   Bedingung ist in `aktuellerText.ts` gespiegelt und als Zwilling kommentiert,
   statt `cinemaAktiv()` zu importieren: Jene liest den globalen Store,
   `laufendeSzene` arbeitet auf dem übergebenen Zustand.
3. **Ruling: „Zurücksetzen" beendet ein aktives Kino zuerst**
   (`if (cinemaAktiv()) stopCinema();` vor `replaceAll` in `ui/Kopfzeile.tsx`).
4. **Ruling: Kommentar in `ui/kamerafahrt.ts`** über dem gemeinsamen `setState`
   von Ziel und Thema nachgezogen; er verwies auf den entfernten Effekt in
   `InfoPanel.tsx`.

Entwurf §3.3 trägt den zweiten Nachtrag „Nachtrag (4c-4, Schlussprüfung)".
Neue Tests: `ui/info/themaVerfall.test.ts` (10 Fälle, darunter Kinostart ohne
Panel, Wurzel aus laufendem und angehaltenem Kino, die vier Übergangsregeln und
das Abbestellen), `ui/Kopfzeile.test.tsx` (Zurücksetzen aus laufendem Kino),
`ui/info/aktuellerText.test.ts` (angehaltenes und beendetes Kino),
`ui/info/InfoPanel.test.tsx` (`data-verweis` im Szenenkopf; das Abonnement läuft
dort je Test). Testzahl 2892 → 2905.

### Nachmessung mit Standardeinstellungen

Bedingungen: `localStorage.removeItem('orrery.sitzung.v1')`, dann
`browser_navigate` auf `http://localhost:5173/Orrery/` ohne Fragment,
Qualitätsstufe `high`. `cinema.pauseOnInput` → `true` (Standard, nicht
verändert), kein synthetisches `pointermove`, Infopanel nicht per Store
geöffnet. Tasten echt per `browser_press_key`, Mausbewegungen per
`browser_hover` auf die Canvas, Klicks per `browser_click`, Wartezeiten per
`performance.now()`-Schleife im 50-ms-Takt. Fenster 1024 × 623 px (Chromium
über Playwright), Niveau Gymnasium, Sprache Deutsch. Alle Werte wörtlich.

- **Ausgangslage:** Kopf „Das Sonnensystem", `ui.info.thema` → `'sonnensystem'`,
  `camera.targetId` → `'sun'`, `cinema.running` → `false`.
- **a) Taste C nach Ruhe:** 4014 ms ohne Eingabe gewartet (Kopf danach weiter
  „Das Sonnensystem"). Echte Taste `c`, unmittelbar danach: `cinema.running` →
  `true`, `camera.mode` → `'cinema'`, `ui.info.thema` → `null`,
  `aside.info-panel` vorhanden → `false` (Oberfläche ausgehängt, der Weg aus
  Befund A ist damit getroffen). Nach `browser_hover` auf die Canvas: Kopf
  „Szene: Tritons rückläufige Bahn" (Wartezeit 0 ms), `ui.info.thema` → `null`,
  `cinema.nummer` → `0`, Szene `triton-rueckwaerts`. Erfüllt.
- **b) Angehaltenes Kino:** im selben Zustand `cinema.running` → `false`,
  `camera.mode` → `'cinema'`, Kopf „Szene: Tritons rückläufige Bahn". Erfüllt.
- **c) Wurzel „Sonnensystem":** echter Klick, danach `cinema.running` →
  `false`, `camera.mode` → `'attached'`, `camera.targetId` → `'sun'`,
  `ui.info.thema` → `'sonnensystem'`, Kopf „Das Sonnensystem" (Wartezeit
  0 ms). Erfüllt.
- **d) Zurücksetzen aus dem angehaltenen Kino,** in zwei Fassungen, weil die
  Szene nach Taste C (`triton-rueckwaerts`, Gymnasium) keinen `thema:`-Verweis
  trägt. Zum Wechsel der Szene diente die echte Taste `n`.
  - **d1:** Taste `c` (`running` → `true`, `thema` → `null`, `nummer` → `0`),
    Taste `n`, `browser_hover` auf die Canvas: Kopf „Szene: Durchflug durch
    Saturns Ringe", `running` → `false`, `camera.mode` → `'cinema'`,
    `nummer` → `1`. Klick auf „Ringen" (`thema:ringe`): Kopf „Ringsysteme",
    `thema` → `'ringe'`, `camera.mode` → `'cinema'`. Klick auf „Zurücksetzen":
    `running` → `false`, `camera.mode` → `'free'`, `camera.targetId` → `'sun'`,
    `thema` → `'sonnensystem'`, Kopf „Das Sonnensystem" (Wartezeit 0 ms).
    Erfüllt.
  - **d2 (Restfall B, Thema schon `sonnensystem`):** Taste `c`, `browser_hover`
    auf die Canvas (`running` → `false`, `camera.mode` → `'cinema'`, `nummer`
    → `0`, `thema` → `null`), achtmal Taste `n` in einem
    `browser_run_code_unsafe`-Durchlauf (`page.keyboard.press('n')`, derselbe
    Aufruf wie `browser_press_key`): Kopf „Szene: Das System von oben",
    `nummer` → `8`, `running` → `false`, `thema:`-Verweise „Das Sonnensystem"
    und „Bahnelemente". Klick auf „Das Sonnensystem" (`thema:sonnensystem`):
    Kopf „Das Sonnensystem", `thema` → `'sonnensystem'`, `camera.mode` →
    `'cinema'`. Klick auf „Zurücksetzen", danach bewusst 2008 ms gewartet:
    `running` → `false`, `camera.mode` → `'free'`, `camera.targetId` → `'sun'`,
    `thema` → `'sonnensystem'`, `cinema.nummer` → `0`, Kopf „Das Sonnensystem".
    Erfüllt.
- **e) Konsole:** `browser_console_messages` (Stufe `warning`, seit der
  Navigation): `Total messages: 3 (Errors: 0, Warnings: 0)`. Erfüllt.

Keine Nichtmessungen. Nebenbeobachtung ohne Änderung: Nach Taste C stand die
Seite im Vollbild (`document.fullscreenElement` gesetzt) und blieb es auch nach
„Zurücksetzen"; das Beenden des Kinos verlässt das Vollbild wie bisher nicht.

### Lint, Test, Build

```
$ npx vitest run
 Test Files  82 passed (82)
      Tests  2905 passed (2905)

$ npm run lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm run build
✓ built in 589ms
(!) Some chunks are larger than 500 kB after minification …
```
