# Phase 4c — Etappe 1: Abnahmeprotokoll

**Datum:** 14.09.2026
**Stand:** Zweig `infopanel`, Basis-Commit `83f7b05` (Task 1 bis 11 der Etappe 1:
Textkatalog und -lader, Namensauflöser, Datenblock mit Live-Werten, Markdown-
Renderer mit Verweisen, Quellenkatalog und -karten, Infopanel-Gerüst mit
Niveau-Tabs, Breiten- und Teilungsgriff, Taste `I`, Ausweichtitel bis zum Laden,
Höchstbreite 60 % der Fensterbreite), ergänzt um eine Fix-Runde (siehe Abschnitt
„Während der Abnahme behoben") im selben Commit wie dieser Protokollstand.
**Prüfumgebung:** Windows 11, Desktop mit RTX 4060, Chromium (Playwright),
Vite-Entwicklungsserver auf `http://localhost:5173/Orrery/`, Browserfenster
1280 × 800 CSS-Pixel (für Schritt 10 kurzzeitig 400 × 900, für die Nachmessung
der Fix-Runde kurzzeitig 2560 × 1440), Qualitätsstufe nach jeder Navigation per
`window.store.setState` auf `high` gesetzt.

Geprüft wird das Infopanel-Gerüst der Etappe 1: Grundzustand, animierte
Kamerafahrt beim Fokuswechsel, Verweise (Themen, Objekte, externe Quellen),
live nachgeführte Datenblock-Werte, Breiten- und Teilungsgriff mit Maus und
Tastatur, Zusammenspiel mit dem Kino-Modus, Link- und Sitzungswiederherstellung,
Darstellung bei 400 px Fensterbreite und die Konsole. Alle Abfragen liefen per
`browser_evaluate` bzw. `browser_run_code_unsafe` gegen `window.store`,
`localStorage`, das DOM und echte Maus-/Tastatureingaben, nicht gegen
Bildschirmfotos allein.

Vorbemerkung zur Methode: Zu Beginn der Prüfung trug `localStorage` noch eine
Sitzung aus einer früheren, ad-hoc durchgeführten Sichtprüfung (Kamera auf
Saturn geheftet, `ui.info.breiteRem: 100`). Ein einfaches
`localStorage.removeItem('orrery.sitzung.v1')` vor dem Neuladen genügte nicht:
Die gedrosselte Sicherung schreibt bei `pagehide` unbedingt den aktuellen
Speicherzustand zurück, solange „Sitzung merken" an ist — und war es zu diesem
Zeitpunkt (Standard). Für einen sauberen Grundzustand wurde deshalb vor dem
ersten Neuladen zusätzlich `localStorage.setItem('orrery.sitzungMerken', '0')`
gesetzt (Präferenz aus, siehe `store/persist.ts`), erst danach die Sitzung
gelöscht und neu geladen. Für Schritt 9 wurde die Präferenz über die Oberfläche
wieder eingeschaltet.

## Schritt 1: Server und Stand

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
`git status --short`: leer. `git log --oneline -1`:
`816a4e6 Infopanel: Höchstbreite 60 % der Fensterbreite wirkt auf die dargestellte Breite und folgt dem Fenster`.

## Schritt 2: Grundzustand

Nach `browser_navigate`, Löschen der Alt-Sitzung wie oben beschrieben und
erneutem Laden, `browser_evaluate`:

```js
() => { window.store.setState({ quality: { tier: 'high' } }); const s = window.store.getState(); return { info: s.ui.info, panels: s.ui.panels, ziel: s.camera.targetId }; }
```

Ergebnis (wörtlich):

```
{ info: { niveau: 'gymnasium', breiteRem: 24, teilung: 0.65, thema: null },
  panels: { time: true, scale: true, camera: true, tree: true },
  ziel: 'sun' }
```

`panels.info` fehlt (kein Eintrag) — das Panel liest `panels.info ?? !schmal` und
öffnet dadurch bei 1280 px von selbst (Ruling 1). Snapshot der rechten Spalte:
Überschrift „Sonne", Tabs „Grundschule/Gymnasium (aktiv)/Hochschule", Datenblock
mit Durchmesser, Masse, Rotationsperiode und Achsneigung, darunter der Hinweis
„Zu diesem Eintrag gibt es noch keinen Text." (die Sonne selbst hat in dieser
Etappe noch keinen Objekttext — nur der Erde liegt ein vollständiger Text bei,
Grundlage für die Verweisprüfung in Schritt 4), Abschnitt „Quellen" mit Karten
„Faktenblätter aller Planeten (NSSDC)" und „NASA Eyes on the Solar System".
Erfüllt.

## Schritt 3: Kamerafahrt messen

Die im Auftrag vorgeschlagene Knopfsuche
(`b.getAttribute('aria-label')?.includes('Saturn') || b.textContent === 'Saturn'`)
traf zunächst den falschen Knopf: Saturn hat im Objektbaum einen
Auf-/Zuklapp-Knopf mit `aria-label="Saturn aufklappen"` (enthält ebenfalls die
Zeichenkette „Saturn") und steht im DOM vor dem eigentlichen Fokussier-Knopf —
`find()` griff die erste Übereinstimmung, also das Klapp-Dreieck, nicht die
Kamerafahrt. Mit gezielter Rollen-Suche
(`page.getByRole('button', { name: 'Saturn', exact: true })`, trifft nur den
namenlosen Fokussier-Knopf ohne `aria-label`) lief die Messung wie im Auftrag
vorgesehen:

```js
async (page) => {
  await page.evaluate(() => { window.store.getState().setCamera({ targetId: 'sun', mode: 'free', distance: 8e8 }); });
  const knopf = page.getByRole('button', { name: 'Saturn', exact: true });
  await knopf.click();
  // sechsmal im Abstand von 300 ms: performance.now(), camera.distance, camera.targetId
}
```

Ergebnis (wörtlich, `ms`/`distance` in km):

```
{ ms: 314, distance: 685384832.19 }
{ ms: 628, distance: 255466994.55 }
{ ms: 947, distance:  44080582.75 }
{ ms: 1261, distance: 24335285.71 }
{ ms: 1578, distance: 23292800 }
{ ms: 1896, distance: 23292800 }
```

`targetId` war ab dem ersten Messpunkt `'saturn'`. Die Distanz fällt monoton und
ist ab 1578 ms (zwischen „rund 1500 ms" wie im Auftrag beschrieben) konstant.
Endwert `23 292 800` km weicht vom Rechenbeispiel im Auftrag (8 × 60 268 × 50 =
24 107 200 km) ab, weil `src/data/bodies/saturn.ts` den volumetrischen
Mittelradius `radiusKm: 58232` führt, nicht den Äquatorradius 60 268 km aus dem
Beispiel. Mit dem echten Wert stimmt die Formel exakt:
8 × 58 232 × 50 (Preset Schaubild, `sizeScale`) = 23 292 800 km — deckungsgleich
mit dem gemessenen Endwert. Kein Fehler, nur ein anderer Radius als im
Rechenbeispiel des Auftrags.

## Schritt 4: Verweise

Ziel auf Erde gesetzt. Klick auf „Achsneigung" im Fließtext: `ui.info.thema`
→ `'achsneigung'`, Panelkopf „Achsneigung", Text „Zu diesem Eintrag gibt es noch
keinen Text." Erfüllt.

Erneuter Klick auf „Erde" im Objektbaum (dasselbe, bereits aktive Ziel) ließ
`thema` unverändert auf `'achsneigung'` stehen — korrekt nach Entwurf §3.3:
„Wechselt `camera.targetId`, die Szene oder der Kinozustand, wird `thema` auf
`null` gesetzt", ein erneuter Klick auf das bereits aktive Ziel ist kein
Wechsel. Über den Objektbaum („Erde aufklappen" → „Mond") auf den Mond gewechselt
(echter Zielwechsel): `thema` → `null`, `targetId` → `'moon'`. Erfüllt, mit der
Randbemerkung, dass „zurück zur Erde" allein (ohne tatsächlichen Zielwechsel) den
Hinweis im Auftrag nicht auslöst — was dem dokumentierten Verhalten entspricht.

Zurück zu Erde gewechselt, Klick auf „NSSDC Earth Fact Sheet" im Fließtext:
Karte `a[data-quelle="nssdc-earth"]` bekommt die Klassen
`border-sky-300/80 bg-sky-400/20` (Hervorhebung; der Auftrag nennt vereinfachend
„Klasse border-sky-300" — tatsächlich mit Deckkraft-Suffix, wie im Quellcode
`src/ui/info/Quellenkarten.tsx` angelegt), 1500 ms lang gehalten und danach
wieder entfernt (geprüft bei 0/200/400/600 ms — durchgehend hervorgehoben).
`browser_tabs` → 1 Tab, kein neuer Tab geöffnet. Erfüllt.

Mittelklick auf die Quellenkarte „Erde: Faktenblatt (NSSDC)" im unteren
Segment: `browser_tabs` → 2 Tabs (`Orrery`, `Earth Fact Sheet`). Zweiten Tab
geschlossen. Erfüllt.

## Schritt 5: Live-Werte

Uhr lief (`time.paused: false`, `rateDaysPerSec: 1`), Ziel Erde. Zwei Lesungen
von `document.querySelector('[data-testid=datenblock]').textContent` im
Abstand von 1000 ms (`browser_run_code_unsafe`, `page.waitForTimeout(1000)`):
„Abstand zur Sonne" `150,8 Mio. km (1,01 AE)` → `150,7 Mio. km (1,01 AE)`, die
Zeilen unterscheiden sich (`gleich: false`). Nach `setTime({ paused: true })`
zwei weitere Lesungen im selben Abstand: beide `150,5 Mio. km (1,01 AE)`,
identisch (`gleich: true`). Erfüllt.

## Schritt 6: Griffe messen

**Breite.** `aside.info-panel.getBoundingClientRect().width` vor dem Ziehen:
`384` px (24 rem × 16 px). Breitengriff (`role=separator`, „Breite des
Infopanels") per echtem Maus-Drag (`page.mouse.down/move/up`) um 200 px nach
links gezogen: Breite danach `584` px, Differenz exakt `+200` px,
`ui.info.breiteRem` `36,5` = 24 + 200/16 — wie erwartet. Screenshot
`.playwright-mcp/info-breit.png`.

**Teilung.** `[role=tabpanel].getBoundingClientRect().height` vor dem Ziehen:
`16` px, `ui.info.teilung: 0,65`. Teilungsgriff (`role=separator`, „Teilung
zwischen Text und Quellen") um 100 px nach unten gezogen:
`ui.info.teilung` → `0,9` (an der oberen Grenze `INFO_TEILUNG_MAX`, wie bei
einem so großen Ausschlag auf einem kleinen Container zu erwarten), die
gemessene `tabpanel`-Höhe blieb jedoch unverändert bei `16` px. Screenshot
`.playwright-mcp/info-teilung.png`.

Befund dazu: Bei 1280 × 800 px berechnet sich die gesamte rechte Spalte
(`aside.info-panel`) nur auf rund `190` px Höhe (`header` 37 px + Tableiste
rund 26 px + `segmente` 120 px), nicht auf die verfügbare Fensterhöhe. Ursache:
Die Wurzelebene der Oberfläche (`div.pointer-events-none.fixed.inset-0`, siehe
`src/ui/App.tsx`) ist `flex` mit `items-start` (bestätigt per
`getComputedStyle`: `alignItems: 'flex-start'`), richtet ihre Kinder also nicht
über die volle Höhe aus. `aside.info-panel` selbst setzt nur `max-h-full`,
keine eigene Höhe. Dadurch haben die beiden inneren Segmente
(`role="tabpanel"`, `style="flex: teilung 1 0px"`, und das Quellen-`div`,
`style="flex: (1-teilung) 1 0px"` mit `min-h-24`) keinen freien Raum zum
Verteilen: Das Quellen-Segment bleibt bei seiner Mindesthöhe von 96 px stehen,
für das obere Segment (`tabpanel`) bleiben nur die 16 px seines eigenen
Innenabstands (`px-3 py-2`) übrig — unabhängig vom Wert von `teilung`, der
Store selbst reagiert korrekt (0,65 → 0,9), nur die Darstellung hat keinen Raum,
das umzusetzen. Ein bereits vor dieser Prüfung vorhandener Screenshot aus einer
früheren Aufgabe (`.playwright-mcp/info-panel.png`, Zeitstempel 15:57, älter als
diese Sitzung) zeigt exakt dieselbe kleine, rund 190 px hohe Spalte oben rechts
— das Verhalten ist also reproduzierbar und keine Eigenart dieses Prüflaufs.
Unter 900 px Fensterbreite (Schritt 10) bekommt der Bogen dagegen eine explizite
Höhe (45 % des Fensters) und ist davon nicht betroffen. Diese Werte sind der
Stand **vor** dem Fix (siehe „Während der Abnahme behoben" unten für die
Nachmessung nach der Korrektur).

## Schritt 7: Tastatur

**Breitengriff.** Ein einfacher Klick auf den Griff (sowohl über
`browser_click` als auch über `locator.click()`) bewegte den Fokus **nicht**
dorthin (`document.activeElement` blieb ohne das erwartete `aria-label`).
Ursache: `onPointerDown` in `src/ui/info/Griff.tsx` ruft unbedingt
`e.preventDefault()` auf (um Textauswahl beim Ziehen zu unterdrücken), was bei
einem einfachen `<div tabIndex={0}>` auch die Standard-Fokussierung durch den
Klick unterdrückt — ein Browser-Verhalten, keine Store-Frage. Mit
programmatischem `.focus()` (z. B. über Tab-Navigation erreichbar) funktioniert
die Tastatursteuerung wie vorgesehen: `ArrowLeft` erhöhte `breiteRem` von
`36,5` auf `37,5` (Schritt `1`). Diese Werte sind der Stand **vor** dem Fix
(siehe „Während der Abnahme behoben" unten für die Nachmessung).

**Niveau-Tabs.** Klick auf den aktiven Tab („Gymnasium", ein echtes
`<button role="tab">`) fokussierte ihn korrekt
(`document.activeElement.textContent` → `Gymnasium`). `ArrowRight` wechselte
`ui.info.niveau` von `gymnasium` auf `hochschule`. Erfüllt.

## Schritt 8: Kino

Vorbemerkung zur Methode: `setCinema({ running: true, … })` unmittelbar nach
einer längeren Zeit ohne echte Maus-/Tastatureingabe traf auf einen bereits
„untätigen" Zustand (`useIdleHide`, 3 s Schwelle) — die Oberfläche (und damit
`aside.info-panel`) verschwand dann sofort vollständig
(`laeuftKino && untaetig` in `src/ui/App.tsx`). Da eine echte Zeigerbewegung
bei laufendem Kino zugleich den Film anhält (`noteUserInput` pausiert, solange
`cinema.pauseOnInput` an ist — die im Auftrag genannte Warnung), wurde zuerst
`setCinema({ pauseOnInput: false })` gesetzt, dann eine einzelne echte
`page.mouse.move` ausgeführt (setzt die Ruhefrist zurück, pausiert aber nicht
mehr) und erst danach `setCinema`/`setCamera` gesetzt, alles in einem
zusammenhängenden Skriptlauf ohne Wartezeit dazwischen.

Mit `ui.info.niveau` noch auf `hochschule` (Rest aus Schritt 7; Hochschultexte
gibt es in dieser Etappe nicht) zeigte der Panelkopf zunächst nur den
Ausweichtitel „Mondfinsternis" ohne „Szene:"-Vorspann. Nach Rückschalten auf
`gymnasium` (Szenentext dort vorhanden):

```js
s.setCinema({ running: true, shuffle: false, nummer: 18 });
s.setCamera({ mode: 'cinema' });
```

Panelkopf „Szene: Mondfinsternis", Datenzeilen „Standort" → „Mond", „Blickziel"
→ „Erde", darunter der volle Szenentext (Kernschatten, Danjon-Skala,
Zeitraffung). Erfüllt.

`setCinema({ running: false })`: Panelkopf kehrte zu „Erde" zurück
(`camera.targetId`), wie von `aktuellerText()` vorgesehen — `camera.mode` blieb
`'cinema'` (das ist Sache der 3D-Kamera und der eigentlichen Kino-Rückkehr über
`stopCinema`/Escape, nicht des Infopanels). Erfüllt.

## Schritt 9: Link und Sitzung

`ui.info` auf `{ niveau: 'grundschule', breiteRem: 36.5 }` gesetzt, „Link
kopieren" geklickt. Abweichend von der im Auftrag angenommenen Rückfall-Annahme
schrieb `navigator.clipboard.writeText` in dieser Playwright/Chromium-Umgebung
tatsächlich in die Zwischenablage (Statuszeile zeigte „Kopiert", `location.hash`
blieb leer) — kein Rückfall auf die Adresszeile nötig. Der kopierte Link wurde
stattdessen über `navigator.clipboard.readText()` zurückgelesen; das
Fragment (Base64url-JSON) enthielt ausschließlich
`{"ui":{"info":{"niveau":"grundschule"}}}` — kein `breiteRem`, wie es die
Filterliste `GESTRICHEN.link` in `store/persist.ts` vorsieht (Breite gehört
nur zur Sitzung, nicht zum Link).

Beim Neuladen mit diesem Link zeigte sich eine zweite methodische Falle: Ein
`browser_navigate` auf dieselbe Adresse mit nur geändertem `#`-Fragment führt in
Chromium zu einer reinen Dokument-internen Navigation (kein Neuladen der
Anwendung) — `startZustand()` läuft dann kein zweites Mal, alte Werte (Breite
36,5 weiterhin, alter Hash weiterhin sichtbar) blieben stehen. Mit einer echten
Neuladung (Zwischenstopp auf `about:blank`, danach die Ziel-Adresse mit
Fragment) lief die Prüfung wie vorgesehen: `location.hash` danach leer
(`fragmentEntfernen` hat das Fragment entfernt), `ui.info.niveau: 'grundschule'`
(aus dem Link), `ui.info.breiteRem: 24` (Standard, nicht im Link enthalten,
Panelbreite `384` px). Erfüllt.

`localStorage.getItem('orrery.sitzungMerken')` stand noch auf `'0'` (aus der
Vorbereitung von Schritt 2), über die Checkbox „Sitzung merken" wieder
eingeschaltet (Standard). Da `breiteRem` zu diesem Zeitpunkt bereits beim
Standardwert 24 lag, hätte eine sofortige Sicherung dort gar keinen
`breiteRem`-Schlüssel erzeugt (die Sitzung speichert wie der Link nur
Abweichungen vom Standard, `diff()` in `store/serialize.ts`) — zur echten
Prüfung der im Auftrag genannten Erwartung wurde `breiteRem` deshalb auf einen
vom Standard abweichenden Wert (`30`) gesetzt und über eine echte Neuladung
(unbedingtes Schreiben bei `pagehide`) gesichert:
`localStorage.getItem('orrery.sitzung.v1')` enthielt danach
`"ui":{"info":{"niveau":"grundschule","breiteRem":30},"language":"de"}` — die
Sitzung führt `info` inklusive `breiteRem`, wie im Auftrag verlangt, und ein
weiteres Neuladen ohne Fragment stellte beide Werte korrekt wieder her.
Erfüllt.

## Schritt 10: 400 px

`browser_resize(400, 900)` plus echte Neuladung. `ui.panels.info` fehlt weiter
→ `schmal` (400 < 900 px) → Panel eingeklappt. Reiter „Info" gefunden bei
`{ x: 356, y: 854, width: 32, height: 34, right: 388, bottom: 888 }` — unten
rechts, wie erwartet. Klick öffnete den Bogen:
`{ x: 0, y: 495, width: 400, height: 405, bottom: 900 }` bei `innerHeight: 900`
— Höhe 405 px = exakt 45 % von 900 px, volle Breite, am unteren Rand verankert.
Anders als die Desktop-Spalte (Schritt 6) hat der Bogen eine eigene, wirksame
Höhe: Screenshot `.playwright-mcp/info-400.png` zeigt Überschrift „Die Erde",
aktiven Grundschule-Tab mit kindgerechtem, kurzem Fließtext samt anklickbaren
Verweisen („Sonne", „Mond") und darunter beginnende Quellenkarten mit eigenem
Rollbalken. Erfüllt. Danach zurück auf 1280 × 800 gesetzt.

## Schritt 11: Konsole

`browser_console_messages` (Stufe `warning`, schließt `error` ein) seit der
letzten Navigation:

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

Auf Stufe `debug` dieselben drei Meldungen, wörtlich:

```
[DEBUG] [vite] connecting... @ http://localhost:5173/Orrery/@vite/client:882
[DEBUG] [vite] connected. @ http://localhost:5173/Orrery/@vite/client:995
[INFO] %cDownload the React DevTools for a better development experience: … @ …/react-dom_client.js
```

Zwei reine Vite-Verbindungsmeldungen und ein React-Entwicklungshinweis — keine
davon `warning` oder `error`. 0 Fehler, 0 Warnungen. Erfüllt.

## Lint, Test, Build

Drei Läufe insgesamt, alle grün: der Erstlauf vor jeder Fix-Runde (1122
Tests), der Lauf nach der ersten Fix-Runde (1124 Tests, zwei neue Tests für
die Fokus- und Höhen-Korrektur) und der Lauf nach der zweiten Fix-Welle aus
der Abschlussprüfung des gesamten Branches (1126 Tests, zwei weitere neue
Tests für Taste I und den Ladefehler; siehe „Während der Abnahme behoben").
Es folgen die Schlusszeilen nach der zweiten Fix-Welle, dem aktuellen Stand:

```
$ npx vitest run
 Test Files  77 passed (77)
      Tests  1126 passed (1126)
   Start at  17:25:11
   Duration  9.69s (environment 46%, setup 26%, tests 17%, transform 5%, import 4%, worker 1%)

$ npx tsc -b
(Exit-Code 0, keine Ausgabe)

$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm run build
npm notice run orrery@0.0.0 build
npm notice run tsc -b && vite build
✓ 139 modules transformed.
dist/index.html                    0.60 kB │ gzip:   0.38 kB
dist/assets/index-bYYUErPs.css    20.88 kB │ gzip:   4.80 kB
… (Text-/Szenen-Häppchen als eigene Chunks, je unter 2 kB)
dist/assets/index-BZbmnsxO.js  1 168.12 kB │ gzip: 313.27 kB
✓ built in 355ms
(!) Some chunks are larger than 500 kB after minification …
```

Der Hinweis auf die Chunk-Größe ist derselbe allgemeine Vite-Hinweis wie in
früheren Etappen, kein Fehler und keine Regression dieser Aufgabe.
`git status --short` nach allen Läufen weiterhin leer (nach dem jeweiligen
Commit).

## Während der Abnahme behoben

Die beiden folgenden, in Schritt 6 und 7 gefundenen Befunde waren echte
Mängel und wurden noch in dieser Abnahme behoben (Ruling des Controllers),
statt nur als Unschärfe stehen zu bleiben. Die „vor dem Fix"-Werte stehen
weiterhin unverändert in Schritt 6 und 7 oben; hier folgt jeweils die
Nachmessung nach der Korrektur.

1. **Desktop-Spalte ohne wirksame Höhe (Schritt 6).** Ursache: Die
   Wurzelebene der Oberfläche (`src/ui/App.tsx`) verwendet `items-start`
   statt einer Höhenvorgabe für ihre Spalten; `aside.info-panel` selbst
   setzte nur `max-h-full`, keine eigene Höhe, wodurch die inneren
   Flex-Segmente keinen freien Raum zum Verteilen hatten (siehe Befund oben).
   **Fix:** `src/ui/info/InfoPanel.tsx` — die Klasse `h-full` ergänzt
   (zusätzlich zu `max-h-full`); die Wurzelebene bleibt bei `items-start`
   (die linke Spalte soll weiter oben ausgerichtet bleiben), sie hat aber
   über `fixed inset-0` selbst eine feste Höhe, gegen die `h-full` prozentual
   auflöst. Test `src/ui/info/InfoPanel.test.tsx` („füllt die Fensterhöhe
   (Griff-Höhe hängt daran)"): prüft, dass `aside.info-panel` die Klasse
   `h-full` trägt — zuerst RED (Klasse fehlte), nach dem Fix GREEN.

   Nachmessung im Browser bei 2560 × 1440 (Desktop RTX 4060, echte
   Neuladung über `about:blank`, Qualitätsstufe `high`):
   `document.querySelector('aside.info-panel').getBoundingClientRect().height`
   → `1416` px = `1440 − 2 · 12` px (Wurzelpolster `p-3` = 12 px oben und
   unten) — wie erwartet. Bei Standardwerten (`teilung: 0.65`,
   `breiteRem: 24`) passt der Gymnasial- **und** der Hochschultext (dort in
   dieser Etappe identisch mit dem Gymnasialtext samt Hinweis, siehe Bekannte
   Unschärfe 4) der Erde bei dieser großen Fensterhöhe vollständig ins obere
   Segment: `[role=tabpanel].scrollHeight` (`865` px) = `.clientHeight`
   (`865` px), kein Überlauf — nachvollziehbar bei 865 px verfügbarer Höhe
   für wenige Absätze Text. Um den Rollmechanismus selbst zu belegen, wurde
   `teilung` probeweise auf `0,3` verkleinert (kleineres oberes Segment, wie
   es ein Ziehen des Teilungsgriffs nach oben bewirken würde):
   `scrollHeight: 626` px `> clientHeight: 408` px — echter Überlauf, das
   Segment rollt jetzt unabhängig, wie vorgesehen. Vor dem Fix war die
   `tabpanel`-Höhe unabhängig von `teilung` immer bei rund 16 px eingefroren
   (siehe Schritt 6 oben); jetzt reagiert sie auf `teilung` und die
   Fensterhöhe wie im Entwurf beschrieben.

2. **Breiten- und Teilungsgriff per Klick nicht fokussierbar (Schritt 7).**
   Ursache: `onPointerDown` in `src/ui/info/Griff.tsx` rief unbedingt
   `e.preventDefault()` auf, was bei den `<div role="separator"
   tabIndex={0}>`-Griffen auch die Standard-Fokussierung durch einen
   einfachen Mausklick unterdrückte. **Fix:** direkt nach `preventDefault()`
   `e.currentTarget.focus()` aufgerufen (mit Kommentar, warum der Fokus von
   Hand gesetzt werden muss). Test `src/ui/info/Griff.test.tsx` („Anfassen
   setzt den Fokus, damit Pfeiltasten sofort wirken"): nach
   `fireEvent.pointerDown` ist `document.activeElement` der Griff — zuerst
   RED (Fokus blieb auf `<body>`), nach dem Fix GREEN.

   Nachmessung im Browser (Wiederholung von Schritt 7, Breitengriff): Klick
   auf den Griff (`page.mouse.click` auf seine Mitte, kein Ziehen) setzt den
   Fokus jetzt korrekt (`document.activeElement.getAttribute('aria-label')`
   → `Breite des Infopanels`); anschließendes `ArrowLeft` erhöhte
   `ui.info.breiteRem` von `24` auf `25` (Schritt `1`, wie erwartet) — vor
   dem Fix blieb der Fokus beim Klick auf `<body>` und die Pfeiltaste wirkte
   nicht.

Beide Fixes wurden bei 2560 × 1440 auf dem Desktop mit RTX 4060 geprüft, die
Konsole blieb dabei frei von Fehlern und Warnungen (`browser_console_messages`,
Stufe `warning`: 0/0).

3. **Taste `I` auf schmalen Bildschirmen beim ersten Druck wirkungslos.**
   Anders als die beiden Befunde oben stammt dieser nicht aus den Schritten
   dieses Protokolls, sondern aus der Abschlussprüfung des gesamten Branches
   (nach diesem Abnahme-Commit, vor dem Zusammenführen), und wurde in einer
   eigenen Fix-Welle im selben Commit wie dieser Nachtrag behoben. Ursache:
   `src/ui/shortcuts/useShortcuts.ts` und `src/ui/info/InfoPanel.tsx` legten
   für „ist das Panel ohne gespeicherten Wert offen?" zwei unterschiedliche
   Standardwerte fest — die Taste ging immer von „offen" aus, das Panel
   selbst auf schmalen Bildschirmen von „zu"; der erste Druck auf schmalen
   Bildschirmen schloss dadurch ein ohnehin schon zu geltendes Panel, statt
   es zu öffnen. **Fix:** neues, importfreies Modul `src/ui/info/konstanten.ts`
   mit der gemeinsamen Funktion `infoOffen` (und `istSchmal`, `INFO_PANEL`,
   `SCHMAL_ABFRAGE`); `InfoPanel.tsx` importiert und re-exportiert
   `INFO_PANEL`/`SCHMAL_ABFRAGE` von dort, damit bestehende Importstellen
   gültig bleiben, und nutzt `infoOffen` selbst; `useShortcuts.ts` importiert
   nur noch aus diesem Modul, nicht mehr aus der Komponente. Test
   `src/ui/shortcuts/useShortcuts.test.ts` („öffnet das Infopanel auf schmalen
   Bildschirmen beim ersten Druck auf I", `window.matchMedia` gestubbt auf
   „schmal"): zuerst RED (erster Druck schloss statt zu öffnen), nach dem Fix
   GREEN; der bestehende Test ohne Stub (jsdom ohne `matchMedia`) blieb
   unverändert grün.

   In derselben Fix-Welle, mit je einem Satz: Das faule Laden des Infotexts
   (`ladeMitAusweich`) bekam ein `.catch`, das bei einer abgelehnten
   Ladefunktion (fehlender Chunk nach einem Redeploy, Netzabbruch) den Hinweis
   „kein Text" zeigt statt eine unbehandelte Ablehnung zu hinterlassen (Test
   `src/ui/info/InfoPanel.laden.test.tsx` mit `../../data/texte` per
   `vi.mock`/`vi.importActual` teilweise ersetzt, zuerst RED durch Timeout und
   eine von Vitest gemeldete unbehandelte Ablehnung, danach GREEN). Die
   Hinweiszeile „kein Text" prüft jetzt `frisch` statt nur `anzeige !== null`,
   damit sie während eines Wechsels von Kennung, Niveau oder Sprache nicht
   kurz den Stand des vorigen Ziels zeigt (bestehende Tests decken das
   unverändert ab). Das neue Modul trägt außerdem am `SCHMAL_ABFRAGE`-Kommentar
   und `src/index.css` an der `@media (max-width: 899px)`-Regel je einen
   Hinweis, dass die 899-px-Schwelle dort und dort ein Zwilling ist und nur
   gemeinsam geändert wird.

   Nachmessung im Browser (400 × 900, echte Neuladung, `quality.tier` auf
   `high`, ein einzelner Druck auf `I`): `document.querySelector('aside.info-
   panel')` existiert, `window.store.getState().ui.panels.info === true` — der
   erste Druck öffnet das Panel jetzt, statt es (schon zu geltend) erneut zu
   schließen. Konsole (`browser_console_messages`, Stufe `warning`) danach 0
   Fehler, 0 Warnungen.

## Bekannte Unschärfen

1. Themen außer `modell` haben in dieser Etappe keinen Text (kommt in 4c-4).
2. Achsneigung ist der Winkel zur Ekliptiknormale, bei Monden nicht zur eigenen
   Bahn.
3. Hochschul-Tab zeigt den Gymnasialtext mit Hinweis.
4. Mobilprüfung nur als Sichtkontrolle bei 400 px.

## Kriterium aus dem Gesamtentwurf — bewertet

Zitat aus dem Gesamtentwurf (`docs/superpowers/specs/2026-09-11-sonnensystem-
design.md`, Abschnitt „Akzeptanzkriterien" zu Phase 4): **„Infopanel mit
abgeleiteten Live-Werten."**

Bewertung: funktional erfüllt. Das Panel zeigt zum jeweiligen Kameraziel (oder,
im laufenden Kino, zur Szene) einen Datenblock mit abgeleiteten Kennzahlen, die
bei laufender Uhr sichtbar live nachgeführt werden und bei angehaltener Uhr
stabil bleiben (Schritt 5, unmittelbar belegt). Die drei Niveaustufen schalten
den Text um (Schritt 4, 8), Verweise im Text springen zu Objekten, Themen und
Quellenkarten und lösen bei Objekten eine animierte, an der dargestellten
Körpergröße bemessene Kamerafahrt aus (Schritt 3, 4). Breiten- und
Teilungsgriff lassen sich mit Maus und Tastatur bedienen und wirken auf den
Store korrekt (Schritt 6, 7), Link und Sitzung geben Niveau beziehungsweise
Niveau und Breite zuverlässig wieder (Schritt 9), die Darstellung bricht bei
400 px nicht ab (Schritt 10), die Konsole blieb frei von Fehlern und Warnungen
(Schritt 11). Zwei in dieser Prüfung gefundene Layout-/Bedienbarkeits-
Einschränkungen (die Desktop-Spalte nutzte die verfügbare Höhe nicht, die
Griffe waren per Klick nicht fokussierbar) minderten zunächst die
Bedienqualität, ohne die Anzeige und Aktualisierung der Live-Werte selbst zu
verhindern; beide wurden noch in dieser Abnahme behoben (Abschnitt „Während
der Abnahme behoben"). Das Kriterium gilt damit vollständig als erfüllt.

## Abweichungen vom Plan

Während der Umsetzung von den Rulings des Controllers festgehaltene
Abweichungen vom ursprünglichen Plan (zusätzlich zu den oben genannten
Bekannten Unschärfen):

1. `ui/info/datenblock.ts` heißt `datenzeilen.ts`, `ui/info/markdown.ts` heißt
   `markdownParser.ts` — NTFS-Kollisionen mit den gleichnamigen Komponenten
   `Datenblock.tsx`/`Markdown.tsx`.
2. Der Panelkopf zeigt bis zum Laden des Textes den Ausweichtitel der neuen
   Kennung (Name aus den Sprachtabellen), danach die Überschrift der Datei; der
   Plan-Test wartete wettlaufanfällig auf „irgendeine Überschrift" und wartet
   jetzt namensbasiert.
3. Die Höchstbreite 60 % der Fensterbreite wirkt auf die dargestellte Breite
   und folgt dem Fenster per `resize` (im Plan begrenzte sie nur den Griff).
4. `formatMasse` erhöht den Exponenten, wenn die Mantisse auf 10 rundet
   (Plan-Code zeigte „10 · 10ⁿ").
5. Zwei Testgrenzen im Datenzeilen-Test sind inklusiv statt strikt, weil die
   Erde zu J2000 exakt auf die gerundeten Grenzen fällt.

## Commit-Prüfung

Erster Abnahme-Commit (`"Abnahme 4c Etappe 1: Infopanel-Gerüst"`, vom
Controller später mit einem Korrektur-Nachfolgecommit zu `83f7b05`
zusammengefasst), die Fix-Runde dieses Nachtrags
(`"Infopanel: Spalte füllt die Fensterhöhe, Griffe nehmen beim Anfassen den
Fokus; Abnahme nachgezogen"`) und die weitere Fix-Welle aus der
Abschlussprüfung des gesamten Branches
(`"Infopanel: Taste I auch auf schmalen Bildschirmen beim ersten Druck;
Ladefehler zeigen den Hinweis; Konstanten ohne Komponentenimport; Abnahme
nachgezogen"`) wurden jeweils gleich geprüft:

```
git add …
git commit -m "…"
git log --format=%B -1 | grep -ci 'co-authored\|session'
```

Ergebnis der letzten Zeile jeweils: `0`. Zusätzlich gegen die beiden nicht zu
nennenden Namen aus der Vorgabe geprüft (ebenfalls `0` Treffer je Commit)
sowie `git ls-files -z | xargs -0 grep -liE …` gegen dieselben beiden Namen
über das gesamte Repository — leer.
