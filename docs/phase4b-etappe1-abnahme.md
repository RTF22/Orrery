# Phase 4b — Etappe 1: Abnahmeprotokoll

**Datum:** 14.09.2026
**Stand:** Zweig `persistenz`, Commit `996091a` (Task 1 bis 5 der Etappe 1: feldweiser
Prüfer, Profile `link`/`sitzung`/`ansicht`, Startzustand aus Fragment oder Sitzung mit
gedrosselter Sicherung, Kopfzeile „Link kopieren"/„Zurücksetzen" mit Statusmeldung,
Checkbox „Sitzung merken" im Darstellungspanel).
**Prüfumgebung:** Windows 11, Chromium 152 (Playwright), Vite-Entwicklungsserver auf
`http://localhost:5173/Orrery/`, Browserfenster 1280 × 800 CSS-Pixel (für Schritt 6
kurzzeitig 400 × 800), Qualitätsstufe nach jeder Navigation per `window.store.setState`
auf `high` gesetzt (Ausnahme: Schritt 3, dort bewusst `low` im Ausgangstab, siehe unten).

Geprüft wird Etappe 1 von Phase 4b: Sitzungswiederherstellung nach Neuladen,
URL-Sharing über „Link kopieren" und einen neuen Tab, die Checkbox „Sitzung merken",
„Zurücksetzen", die Kopfzeile bei schmaler Fensterbreite und die Konsole. Alle
Abfragen liefen per `browser_evaluate` gegen `window.store` und das DOM, nicht gegen
Bildschirmfotos. Presets (in der Anwendung „Ansichten" genannt, Etappe 2) sind nicht
Gegenstand dieses Protokolls.

## Schritt 1: Server und Ausgangszustand

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
`git status --short` vor Beginn: leer (sauberer Arbeitsbaum auf `persistenz`).
`git log --oneline -1`: `996091a Darstellungspanel: Checkbox Sitzung merken,
Präferenz außerhalb des Stores`.

## Schritt 2: Sitzungswiederherstellung

Nach `browser_navigate` auf `http://localhost:5173/Orrery/`, sofort
`window.store.setState({ quality: { tier: 'high' } })`, dann per `browser_evaluate`:

```js
localStorage.clear();
const s = window.store.getState();
s.setScale({ sizeScale: 7, preset: null });
s.setUi({ language: 'en' });
s.toggleVisible('mars');
s.setCamera({ targetId: 'saturn', mode: 'attached' });
await new Promise((r) => setTimeout(r, 1500));
localStorage.getItem('orrery.sitzung.v1');
```

Ergebnis (wörtlich):

```
{"time":{"jd":2452528.9467693456},"scale":{"sizeScale":7,"preset":null},"camera":{"mode":"attached","targetId":"saturn"},"visible":{"mars":false},"quality":{"tier":"high"},"ui":{"language":"en"}}
```

Enthält `"sizeScale":7`, `"language":"en"`, `"mars":false`, `"targetId":"saturn"` wie
erwartet. Danach erneut `browser_navigate` auf dieselbe Adresse, `quality.tier` wieder
auf `high` gesetzt, dann:

```js
(({ scale, ui, visible, camera }) => ({ sizeScale: scale.sizeScale, preset: scale.preset, language: ui.language, mars: visible.mars, targetId: camera.targetId, mode: camera.mode, hash: location.hash }))(window.store.getState())
```

Ergebnis (wörtlich):

```
{ sizeScale: 7, preset: null, language: 'en', mars: false, targetId: 'saturn', mode: 'attached', hash: '' }
```

Deckungsgleich mit der Erwartung `{ sizeScale: 7, preset: null, language: 'en', mars:
false, targetId: 'saturn', mode: 'attached', hash: '' }`. Erfüllt.

## Schritt 3: Link kopieren und im neuen Tab öffnen

Im selben Tab `window.store.setState({ quality: { tier: 'low' } })` gesetzt (Ergebnis
der Abfrage: `"low"`). Zwischenablage-Berechtigung per `browser_run_code_unsafe`:
`await context.grantPermissions(['clipboard-read', 'clipboard-write'])` → `"granted"`.

Klick auf „Copy link" (Oberfläche stand zu diesem Zeitpunkt auf Englisch) per
`browser_click`. Die Statusmeldung wird erst gesetzt, nachdem
`navigator.clipboard.writeText` aufgelöst hat (asynchron in `Kopfzeile.tsx`); eine
Abfrage unmittelbar nach dem Klick über den normalen MCP-Werkzeugweg traf zweimal auf
den bereits geleerten Text (die Meldung steht laut `MELDUNG_MS` in `Kopfzeile.tsx` nur
2000 ms), weil der Werkzeug-Umlauf selbst schon so lange dauerte. Mit kurzem Abwarten
innerhalb desselben `browser_run_code_unsafe`-Aufrufs (Klick, dann bis zu 20 × 50 ms
auf nicht-leeren Text gewartet) lautete `document.querySelector('header
[role=status]').textContent` wörtlich:

```
Copied
```

Damit lief der reguläre Weg über die Zwischenablage, nicht der Rückfall über die
Adresszeile. Link geholt mit `await navigator.clipboard.readText()`, wörtlich:

```
http://localhost:5173/Orrery/#p=eyJ0aW1lIjp7ImpkIjoyNDUyNjA3LjA3NzkwMTYwOH0sInNjYWxlIjp7InNpemVTY2FsZSI6NywicHJlc2V0IjpudWxsfSwiY2FtZXJhIjp7Im1vZGUiOiJhdHRhY2hlZCIsInRhcmdldElkIjoic2F0dXJuIn0sInZpc2libGUiOnsibWFycyI6ZmFsc2V9LCJ1aSI6eyJsYW5ndWFnZSI6ImVuIn19
```

Erste 60 Zeichen: `http://localhost:5173/Orrery/#p=eyJ0aW1lIjp7ImpkIjoyNDUyNjA3`.
Randbemerkung: Das decodierte Fragment enthält keinen Schlüssel `quality` — die
Qualitätsstufe des Absender-Tabs (`low`) ist gar nicht Teil des geteilten Zustands,
unabhängig vom folgenden Schritt.

Neuer Tab per `browser_tabs` (`new`), `browser_navigate` auf den Link, danach
`window.store.setState({ quality: { tier: 'high' } })` (Standardregel nach jeder
Navigation), dann dieselbe Abfrage wie in Schritt 2 plus
`tier: window.store.getState().quality.tier`. Ergebnis (wörtlich):

```
{ sizeScale: 7, preset: null, language: 'en', mars: false, targetId: 'saturn', mode: 'attached', hash: '', tier: 'high' }
```

Ansichtswerte wie in Schritt 2, `hash: ''`, `tier` ist `'high'`, also nicht `'low'`.
Erfüllt. (Da die Qualitätsstufe im neuen Tab ohnehin per Standardregel sofort auf
`high` gesetzt wurde, ist der eigentliche Beleg dafür, dass die Qualitätsstufe des
Absenders nicht übernommen wird, die oben genannte Randbemerkung: `quality` fehlt im
Fragment vollständig.)

## Schritt 4: „Sitzung merken" aus

Zurück im ersten Tab: Checkbox „Remember session" per `browser_click` abgehakt.
`localStorage.getItem('orrery.sitzung.v1')` → `null`. Danach
`window.store.getState().setScale({ sizeScale: 9 })`, 1500 ms gewartet, erneut
`localStorage.getItem('orrery.sitzung.v1')` → `null`. Beide wie erwartet.

Neu geladen (`browser_navigate` auf dieselbe Adresse), `quality.tier` auf `high`
gesetzt, dann `{ sizeScale: window.store.getState().scale.sizeScale, language:
window.store.getState().ui.language }` → wörtlich:

```
{ sizeScale: 50, language: 'de' }
```

`sizeScale` ist auf den Standardwert `50` zurückgefallen, `language` auf `'de'`
(Browsersprache des Prüfrechners) — wie erwartet. Checkbox „Sitzung merken" danach im
Snapshot als nicht abgehakt bestätigt und wieder angehakt.

## Schritt 5: Zurücksetzen

```js
const s = window.store.getState();
s.setUi({ language: 'en' });
s.setScale({ sizeScale: 3, preset: null });
window.store.setState({ quality: { tier: 'high' } });
```

Danach Klick auf „Reset". Abfrage:

```js
(({ scale, ui, quality }) => ({ sizeScale: scale.sizeScale, preset: scale.preset, language: ui.language, tier: quality.tier }))(window.store.getState())
```

Ergebnis (wörtlich):

```
{ sizeScale: 50, preset: 'schaubild', language: 'en', tier: 'high' }
```

Deckungsgleich mit der Erwartung. Erfüllt.

## Schritt 6: Kopfzeile bei 400 px

`browser_resize` auf 400 × 800, Screenshot nach
`.playwright-mcp/kopfzeile-400.png` (nicht versioniert). Danach:

```js
[...document.querySelectorAll('header button')].map((b) => { const r = b.getBoundingClientRect(); return { text: b.textContent.trim(), left: Math.round(r.left), right: Math.round(r.right), innerWidth }; })
```

Ergebnis (wörtlich):

```
[
  { "text": "Copy link", "left": 80, "right": 147, "innerWidth": 400 },
  { "text": "Reset", "left": 151, "right": 198, "innerWidth": 400 },
  { "text": "DE", "left": 206, "right": 239, "innerWidth": 400 },
  { "text": "EN", "left": 243, "right": 276, "innerWidth": 400 }
]
```

Vier Einträge, jede Kante `left >= 0` und `right <= 400 (innerWidth)`. Erfüllt.
Anschließend `browser_resize` zurück auf 1280 × 800.

## Schritt 7: Konsole

`browser_console_messages` (Stufe `warning`, schließt `error` ein) nach dem
gesamten Lauf, für beide während der Abnahme offenen Tabs einzeln geprüft:

Erster Tab (der gesamte Lauf von Schritt 2 bis 6):

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

Zweiter Tab (aus Schritt 3, geöffnet über den kopierten Link):

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

Auf Stufe `debug` (schließt `info` ein) sind es in beiden Tabs dieselben drei
Meldungen, wörtlich:

```
[DEBUG] [vite] connecting... @ http://localhost:5173/Orrery/@vite/client:882
[DEBUG] [vite] connected. @ http://localhost:5173/Orrery/@vite/client:995
[INFO] %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold @ http://localhost:5173/Orrery/node_modules/.vite/deps/react-dom_client.js?v=0e3eb6ab:15804
```

Zwei reine Vite-Verbindungsmeldungen und eine React-Entwicklungshinweismeldung —
keine davon `warning` oder `error`. 0 Fehler, 0 Warnungen über den gesamten Prüflauf.
Erfüllt.

## Lint, Test, Build

```
$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm test
npm notice run orrery@0.0.0 test
npm notice run vitest run
 Test Files  58 passed (58)
      Tests  899 passed (899)
   Start at  08:12:44
   Duration  7.79s (environment 43%, setup 29%, tests 17%, transform 5%, import 4%, worker 1%)

$ npm run build
npm notice run orrery@0.0.0 build
npm notice run tsc -b && vite build
✓ 106 modules transformed.
dist/index.html                     0.60 kB │ gzip:   0.38 kB
dist/assets/index-akRwB0D-.css     15.76 kB │ gzip:   3.77 kB
dist/assets/index-BPJuMSKY.js   1,125.99 kB │ gzip: 300.42 kB
✓ built in 438ms
(!) Some chunks are larger than 500 kB after minification …
```

Der Hinweis auf die Chunk-Größe ist ein allgemeiner Vite-Hinweis zur Bündelgröße,
kein Fehler und keine Regression dieser Aufgabe (Code-Splitting ist nicht Gegenstand
von Phase 4b).

## Bekannte Unschärfe

Ein laufender Maßstabs-Übergang (700 ms, gleitende Interpolation im Maßstabspanel)
kann nach „Zurücksetzen" noch nachschreiben, wenn zum Zeitpunkt des Klicks bereits
ein Übergang läuft: Der zuletzt gemessene Wert wäre dann für kurze Zeit nicht der
Zielwert. In Schritt 5 oben war zum Zeitpunkt der Abfrage kein Übergang mehr aktiv,
`sizeScale` stand bereits exakt auf `50` — die Unschärfe trat in diesem Lauf nicht
auf, wird hier aber als grundsätzliche Grenze der Messmethode festgehalten.

## Kriterien aus dem Gesamtentwurf — bewertet

Zitat aus dem Gesamtentwurf (`docs/superpowers/specs/2026-09-11-sonnensystem-
design.md`, Abschnitt „Akzeptanzkriterien"): **„URL-Sharing stellt den Zustand exakt
wieder her (durch Round-Trip-Test abgesichert)."**

Bewertung: erfüllt. Belegt durch den Unit-Test-Pfad (Round-Trip von
`encodeState`/`decodeState` bzw. `toShareable`/`fromShareable`, Teil der 899 grünen
Tests oben) und zusätzlich im Browser durch Schritt 3: Der über „Link kopieren"
erzeugte Link stellt in einem neuen Tab Maßstab, Sprache, Sichtbarkeit und Kamera
exakt wieder her, ohne Fragment in der Adresszeile und ohne die abweichende
Qualitätsstufe des Absender-Tabs zu übernehmen.

Das zweite Kriterium des Gesamtentwurfs, „Presets speichern, laden, exportieren,
importieren" (in der Oberfläche „Ansichten" genannt), ist nicht Gegenstand dieser
Etappe und bleibt für Etappe 2 offen (siehe Entwurfsabschnitt 8, Punkt 6, und
Protokoll `docs/phase4b-etappe2-abnahme.md`, noch nicht erstellt).

## Commit-Prüfung

```
git add docs/phase4b-etappe1-abnahme.md
git commit -m "Abnahme 4b Etappe 1: URL-Sharing, Sitzung, Zurücksetzen"
git log --format=%B -1 | grep -ci 'co-authored\|session'
```

Ergebnis der letzten Zeile: `0`.
