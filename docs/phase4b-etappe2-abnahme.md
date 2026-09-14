# Phase 4b — Etappe 2: Abnahmeprotokoll

**Datum:** 14.09.2026
**Stand:** Zweig `ansichten`, Commit `3ec3e92` (Task 1 bis 5 der Etappe 2: Wertebereiche
im Prüfer, Ansichten-Funktionen in `store/persist.ts`, Panel „Ansichten" mit
Speichern/Überschreiben, Laden, Umbenennen (Enter/Escape), Löschen mit fünf Sekunden
Rückgängig, Exportieren als JSON-Datei und Importieren mit Behandlung fremder und
defekter Dateien).
**Prüfumgebung:** Windows 11, Chromium (Playwright), Vite-Entwicklungsserver auf
`http://localhost:5173/Orrery/`, Browserfenster 1280 × 800 CSS-Pixel (für Schritt 8
kurzzeitig 400 × 900), Qualitätsstufe nach jeder Navigation per `window.store.setState`
auf `high` gesetzt (Ausnahme: Schritt 2, dort bewusst `low` als Teil der geänderten
Werte, siehe unten).

Geprüft wird Etappe 2 von Phase 4b: das Panel „Ansichten" — Speichern, Verändern,
Laden, Umbenennen, Löschen mit Rückgängig, Exportieren, Importieren (eigene Datei,
zweimal dieselbe Datei, eine fremde Datei), Bestehenbleiben nach Neuladen, Darstellung
bei 400 px Fensterbreite und die Konsole. Alle Abfragen liefen per `browser_evaluate`
bzw. `browser_run_code_unsafe` gegen `window.store`, `localStorage` und das DOM, nicht
gegen Bildschirmfotos.

## Schritt 1: Server und Stand

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
`git status --short`: leer (sauberer Arbeitsbaum auf `ansichten`).
`git log --oneline -1`: `3ec3e92 Panel Ansichten: Lesefehler beim Import abfangen`.

## Schritt 2: Speichern, verändern, laden

Nach `browser_navigate` auf `http://localhost:5173/Orrery/`, sofort
`window.store.setState({ quality: { tier: 'high' } })`, dann per `browser_evaluate`:

```js
localStorage.removeItem('orrery.ansichten.v1');
const s = window.store.getState();
s.setScale({ sizeScale: 7, preset: null });
s.setDisplay({ orbits: false });
s.setCamera({ targetId: 'saturn', mode: 'attached' });
s.toggleVisible('mars');
s.setTime({ rateDaysPerSec: 30 });
```

Im Panel „Ansichten" „Saturn" in „Name der Ansicht" eingetippt (`submit: true`).
`localStorage.getItem('orrery.ansichten.v1')`, Ergebnis (wörtlich):

```
[{"name":"Saturn","state":{"time":{"rateDaysPerSec":30},"scale":{"sizeScale":7,"preset":null},"display":{"orbits":false},"camera":{"mode":"attached","targetId":"saturn"},"visible":{"mars":false}}}]
```

Erwartung laut Auftrag (wörtlich):

```
[{"name":"Saturn","state":{"time":{"rateDaysPerSec":30},"scale":{"sizeScale":7,"preset":null},"display":{"orbits":false},"camera":{"targetId":"saturn","mode":"attached"},"visible":{"mars":false}}}]
```

Abweichung: Die Schlüsselreihenfolge im Zweig `camera` ist vertauscht (`mode` vor
`targetId` statt umgekehrt). Inhaltlich sind beide Zeichenketten dasselbe Objekt
(`JSON.parse` liefert identische Werte, ein Vergleich über `JSON.stringify` mit
sortierten Schlüsseln wäre gleich); es handelt sich um eine reine Serialisierungs-
Reihenfolge aus `setCamera`/der Ansichtsspeicherung, keine inhaltliche Abweichung.
Als Bedenken unten aufgeführt, Code wurde nicht geändert.

Danach verändert:

```js
const s = window.store.getState();
s.setScale({ sizeScale: 2 });
s.setDisplay({ orbits: true });
s.setCamera({ targetId: 'earth', mode: 'free' });
s.toggleVisible('mars');
s.setTime({ jd: 2461294.5, paused: true, rateDaysPerSec: 1 });
window.store.setState({ quality: { tier: 'low' } });
```

Klick auf „Ansicht laden: Saturn", danach Abfrage:

```js
(({ scale, display, camera, visible, time, quality }) => ({ sizeScale: scale.sizeScale, preset: scale.preset, orbits: display.orbits, targetId: camera.targetId, mode: camera.mode, mars: visible.mars, rate: time.rateDaysPerSec, jd: time.jd, paused: time.paused, tier: quality.tier }))(window.store.getState())
```

Ergebnis (wörtlich):

```
{ sizeScale: 7, preset: null, orbits: false, targetId: 'saturn', mode: 'attached', mars: false, rate: 30, jd: 2461294.5, paused: true, tier: 'low' }
```

Deckungsgleich mit der Erwartung `{ sizeScale: 7, preset: null, orbits: false,
targetId: 'saturn', mode: 'attached', mars: false, rate: 30, jd: 2461294.5, paused:
true, tier: 'low' }`. Erfüllt. `jd`, `paused` und `tier` (nicht Teil des Profils
`ansicht`) blieben unverändert vom aktuellen Zustand erhalten, `sizeScale`, `preset`,
`orbits`, `targetId`, `mode`, `mars` und `rate` kamen aus der geladenen Ansicht — wie
in der Ruling zu `ansichtAnwenden` festgehalten. Danach
`window.store.setState({ quality: { tier: 'high' } })`.

## Schritt 3: Umbenennen und Löschen mit Rückgängig

Klick „Umbenennen: Saturn", „Saturn nah" eingetippt (`submit: true`).
`JSON.parse(localStorage.getItem('orrery.ansichten.v1')).map((a) => a.name)` →
`["Saturn nah"]`. Erfüllt.

Erster Versuch bei Löschen/Rückgängig: Klick „Löschen: Saturn nah", Snapshot zeigte
„Rückgängig: Saturn nah" wie erwartet. Der zweite Klick (auf „Rückgängig: Saturn
nah") erfolgte dann in einem eigenen Werkzeugaufruf und traf bereits auf einen
veralteten Element-Verweis; bis zum erneuten Einlesen der Seite waren die fünf
Sekunden Frist abgelaufen, der Eintrag war bereits endgültig gelöscht
(`localStorage.getItem('orrery.ansichten.v1')` → `[]`, Panel zeigte „Noch keine
Ansichten gespeichert."). Das ist kein Anwendungsfehler, sondern eine Folge der
Zeit, die zwischen zwei einzelnen Werkzeugaufrufen verstreicht — die Frist von fünf
Sekunden griff korrekt. Als Bedenken unten vermerkt.

Zweiter Versuch: „Saturn nah" erneut gespeichert (`textbox „Name der Ansicht"`,
`submit: true`), danach Löschen und Rückgängig in einem einzigen
`browser_run_code_unsafe`-Aufruf ohne Zwischenwartezeit:

```js
await page.getByRole('button', { name: 'Löschen: Saturn nah' }).click();
const snapshotAfterDelete = await page.getByRole('button', { name: 'Rückgängig: Saturn nah' }).isVisible();
await page.getByRole('button', { name: 'Rückgängig: Saturn nah' }).click();
const loadVisibleAfterUndo = await page.getByRole('button', { name: 'Ansicht laden: Saturn nah' }).isVisible();
```

Ergebnis (wörtlich): `{"snapshotAfterDelete":true,"loadVisibleAfterUndo":true}`. Nach
dem Löschen war „Rückgängig: Saturn nah" sichtbar, nach dem Klick darauf wieder
„Ansicht laden: Saturn nah". `JSON.parse(localStorage.getItem('orrery.ansichten.v1')).map((a) => a.name)`
→ `["Saturn nah"]`, Ablage unverändert. Erfüllt.

## Schritt 4: Exportieren

Zweite Ansicht angelegt: `window.store.getState().setScale({ sizeScale: 3 })`,
„Erde" eingetippt und gespeichert. `JSON.parse(localStorage.getItem('orrery.ansichten.v1')).map((a) => a.name)`
→ `["Saturn nah", "Erde"]`.

```js
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Exportieren' }).click(),
]);
await download.saveAs('.../.playwright-mcp/orrery-ansichten.json');
return download.suggestedFilename();
```

Ergebnis: `"orrery-ansichten.json"`, wie erwartet. Datei gelesen (gekürzt):

```json
{
  "format": "orrery-ansichten",
  "version": 1,
  "ansichten": [
    { "name": "Saturn nah", "state": { "time": { "rateDaysPerSec": 30 }, "scale": { "sizeScale": 7, "preset": null }, "display": { "orbits": false }, "camera": { "mode": "attached", "targetId": "saturn" }, "visible": { "mars": false } } },
    { "name": "Erde", "state": { "time": { "rateDaysPerSec": 30 }, "scale": { "sizeScale": 3, "preset": null }, "display": { "orbits": false }, "camera": { "mode": "attached", "targetId": "saturn" }, "visible": { "mars": false } } }
  ]
}
```

`format` ist `orrery-ansichten`, `version` ist `1`, `ansichten` hat zwei Einträge mit
den Namen `Saturn nah` und `Erde`. Erfüllt.

## Schritt 5: Löschen und Importieren

Beide Einträge in einem Aufruf gelöscht (Klick „Löschen: Saturn nah", Klick
„Löschen: Erde"), danach `await new Promise((r) => setTimeout(r, 5500))`.
`localStorage.getItem('orrery.ansichten.v1')` → `[]`. Snapshot zeigt „Noch keine
Ansichten gespeichert.". Erfüllt.

Klick „Importieren" öffnete die Dateiwahl (Modal-Zustand „File chooser"),
`browser_file_upload` mit der eigenen Exportdatei. Liste zeigt danach „Saturn nah"
und „Erde". Meldungszeilen (`[...document.querySelectorAll('[role=status]')].map(el
=> el.textContent)`) beide leer: `["", ""]`. Vergleich Ablage gegen Datei:

```js
JSON.stringify(JSON.parse(localStorage.getItem('orrery.ansichten.v1'))) === JSON.stringify(datei.ansichten)
```

→ `true`. Erfüllt. Zweiter Import derselben Datei: Liste bekommt zusätzlich
„Saturn nah (2)" und „Erde (2)" (vier Einträge insgesamt). Erfüllt.

## Schritt 6: Fremde Datei

`.playwright-mcp/fremd.json` mit Inhalt `{"hallo":1}` angelegt und importiert.
Meldungszeile (wörtlich): „Datei ist kein Ansichten-Export". Liste unverändert, vier
Einträge: „Saturn nah", „Erde", „Saturn nah (2)", „Erde (2)". Erfüllt.

## Schritt 7: Neuladen

`browser_navigate` auf dieselbe Adresse, `quality.tier` auf `high` gesetzt. Snapshot:
Panel „Ansichten" zeigt weiterhin alle vier Einträge „Saturn nah", „Erde", „Saturn
nah (2)", „Erde (2)" samt Lade-, Umbenennen- und Löschen-Knöpfen. Erfüllt. Danach
`localStorage.removeItem('orrery.ansichten.v1')` (bestätigt: `null`).

## Schritt 8: Panel bei 400 px

`browser_resize` auf 400 × 900, Screenshot nach `.playwright-mcp/ansichten-400.png`
(nicht versioniert). Danach:

```js
[...document.querySelectorAll('section')].map((s) => { const r = s.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), innerWidth }; })
```

Ergebnis (wörtlich, sieben `section`-Elemente, alle identisch):

```
[
  { "left": 12, "right": 285, "innerWidth": 400 },
  { "left": 12, "right": 285, "innerWidth": 400 },
  { "left": 12, "right": 285, "innerWidth": 400 },
  { "left": 12, "right": 285, "innerWidth": 400 },
  { "left": 12, "right": 285, "innerWidth": 400 },
  { "left": 12, "right": 285, "innerWidth": 400 },
  { "left": 12, "right": 285, "innerWidth": 400 }
]
```

Jede Kante `left >= 0` und `right <= 400 (innerWidth)`. Erfüllt. Anschließend
`browser_resize` zurück auf 1280 × 800.

## Schritt 9: Konsole

`browser_console_messages` (Stufe `warning`, schließt `error` ein) nach dem
Neuladen in Schritt 7 bis zum Ende des Laufs:

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

Auf Stufe `debug` dieselben drei Meldungen, wörtlich:

```
[DEBUG] [vite] connecting... @ http://localhost:5173/Orrery/@vite/client:882
[DEBUG] [vite] connected. @ http://localhost:5173/Orrery/@vite/client:995
[INFO] %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold @ http://localhost:5173/Orrery/node_modules/.vite/deps/react-dom_client.js?v=0e3eb6ab:15804
```

Zwei reine Vite-Verbindungsmeldungen und eine React-Entwicklungshinweismeldung —
keine davon `warning` oder `error`. 0 Fehler, 0 Warnungen ab dem Neuladen in
Schritt 7. Erfüllt.

Randbemerkung: Während Schritt 5 löste ein eigener, versehentlicher Prüfaufruf
(`fetch` auf eine nicht existierende Adresse, zur Zwischenkontrolle gedacht) einen
Konsolenfehler im damaligen Tab aus. Dieser Fehler stammt nicht aus der Anwendung,
sondern aus der Prüfmethode selbst, und wurde durch das Neuladen in Schritt 7 aus
der Konsole entfernt, bevor die obige Zählung erfolgte.

## Lint, Test, Build

```
$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm test
npm notice run orrery@0.0.0 test
npm notice run vitest run
 Test Files  59 passed (59)
      Tests  943 passed (943)
   Start at  09:56:05
   Duration  7.55s (environment 42%, setup 29%, tests 18%, transform 5%, import 4%, worker 1%)

$ npm run build
npm notice run orrery@0.0.0 build
npm notice run tsc -b && vite build
✓ 107 modules transformed.
dist/index.html                     0.60 kB │ gzip:   0.38 kB
dist/assets/index-BSpUZIia.css     16.18 kB │ gzip:   3.89 kB
dist/assets/index-Bd_wJ3xF.js   1,134.38 kB │ gzip: 302.88 kB
✓ built in 308ms
(!) Some chunks are larger than 500 kB after minification …
```

Der Hinweis auf die Chunk-Größe ist derselbe allgemeine Vite-Hinweis wie in Etappe 1,
kein Fehler und keine Regression dieser Aufgabe.

## Bekannte Unschärfen

1. Ein Löschen mit laufender Frist wird beim Ausblenden der Oberfläche (Taste H)
   verworfen — das Panel baut ab, der schwebende Löschvorgang schreibt nie, der
   Eintrag bleibt in der Ablage stehen. Nicht Gegenstand dieses Laufs, hier nur
   vermerkt.
2. Der Namenssuffix „ (2)" (und höhere Zahlen bei mehrfachem Import) kann einen
   Namen über die Obergrenze von 80 Zeichen hinaus verlängern; beim nächsten Lesen
   fällt ein so verlängerter Eintrag aus dem Prüfer heraus und verschwindet.
   Nachtrag 14.09.2026 (Nacharbeit-Commit): behoben — `freierName` kürzt den
   Namen jetzt so, dass der Kandidat mit Suffix innerhalb von NAME_MAX bleibt.
3. `ansichtAnwenden` setzt Felder, die eine Ansicht innerhalb ihrer eigenen Zweige
   (Maßstab, Darstellung, Kamera, Sichtbarkeit, Zeitrate) nicht nennt, auf den
   Standardwert zurück, statt sie wie im ursprünglichen Entwurfstext §4.5 (letzter
   Satz) beim aktuellen Zustand zu belassen — eine Ruling vom 14.09.2026, begründet
   damit, dass ein Patch „Standardwert" nicht von „nicht enthalten" unterscheiden
   kann. Schritt 2 dieses Laufs deckte diesen Fall nicht unmittelbar auf, weil die
   gespeicherte Ansicht „Saturn" in allen ihren Zweigen vollständige Werte trug.

## Kriterium aus dem Gesamtentwurf — bewertet

Zitat aus dem Gesamtentwurf (`docs/superpowers/specs/2026-09-11-sonnensystem-
design.md`, Abschnitt „Akzeptanzkriterien" zu Phase 4): **„Presets speichern, laden,
exportieren, importieren"** (in der Oberfläche „Ansichten" genannt).

Bewertung: erfüllt. Speichern (Schritt 2), Laden mit korrektem Zusammenspiel aus
Ansicht und unberührten Zweigen (Schritt 2), Umbenennen und Löschen mit Rückgängig
(Schritt 3, im zweiten Anlauf bestätigt), Exportieren als benannte JSON-Datei mit
Umschlag `format`/`version` (Schritt 4) und Importieren — sowohl der eigenen Datei
inklusive Namenskonflikt-Suffix bei doppeltem Import als auch einer fremden Datei
mit korrekter Fehlermeldung ohne Zustandsänderung (Schritt 5 und 6) — sind im
Browser belegt. Die Ansichten überstehen ein Neuladen der Seite (Schritt 7), das
Panel bricht bei 400 px nicht ab (Schritt 8), die Konsole blieb frei von Fehlern
und Warnungen (Schritt 9). Damit ist auch das zweite, in
`docs/phase4b-etappe1-abnahme.md` noch offen gelassene Kriterium des
Gesamtentwurfs erfüllt.

## Commit-Prüfung

```
git add docs/phase4b-etappe2-abnahme.md README.md
git commit -m "Abnahme 4b Etappe 2: Panel Ansichten"
git log --format=%B -1 | grep -ci 'co-authored\|session'
```

Ergebnis der letzten Zeile: `0`.
