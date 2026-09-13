# Phase 4a — Englisch: Abnahmeprotokoll

**Datum:** 13.09.2026
**Stand:** Zweig `englisch`, Commit `e6f853d` (Task 1 bis 5 der Phase 4a: Startsprache
und `t()`, Kopfzeile mit Sprachschalter und Taste `L`, 3D-Beschriftungen über
Namensauflöser, Schichtentest über `import.meta.glob`; dazu zwei Fix-Commits).
**Prüfumgebung:** Windows 11, Chromium (Playwright), Vite-Entwicklungsserver auf
`http://localhost:5173/Orrery/`, Browserfenster 1282 × 1269 CSS-Pixel,
Qualitätsstufe `high` (per `window.store.setState`), Zeit nicht angehalten
(für dieses Protokoll nicht nötig, da keine Bildvergleiche gemessen werden).
**Nachtrag:** Der zugängliche Name der Sprachschaltflächen lautet seit
Commit A „Deutsch (DE)"/„English (EN)"; die übrigen Werte sind unverändert.

Geprüft wird die Sprachumschaltung selbst: Startsprache aus dem Browser,
Kopfzeile mit den Schaltflächen „DE"/„EN", Taste `L`, Umschalten zur Laufzeit
ohne Neuladen, Konsole. Alle Abfragen liefen per `browser_evaluate` gegen
`window.store` und das DOM, nicht gegen Bildschirmfotos.

## Schritt 1: Server und Ausgangszustand

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`.
`git status --short` vor Beginn: leer (sauberer Arbeitsbaum auf `englisch`,
HEAD `e6f853d`).

## Schritt 2: Deutsch (Startzustand nach Navigation)

Nach `browser_navigate` auf `http://localhost:5173/Orrery/`, sofort
`window.store.setState({ quality: { tier: 'high' } })`, 6 s gewartet
(zweimal 3 s), dann per `browser_evaluate`:

```js
({
  lang: document.documentElement.lang, title: document.title,
  sprache: window.store.getState().ui.language,
  panelTitel: [...document.querySelectorAll('section button')].map(b => b.textContent.trim()),
  label: [...document.querySelectorAll('.koerper-name')].map(e => e.textContent),
  kopfzeile: document.querySelector('header')?.textContent,
})
```

Ergebnis (wörtlich):

- `lang`: `"de"`
- `title`: `"Sonnensystem"`
- `sprache`: `"de"`
- `panelTitel`: `["Zeit▾","Pause","Richtung umkehren","Jetzt","Maßstab▾","Realistisch","Schaubild","Kompakt","Kino-Modus▾","Kino starten","Nächste Szene","Kamera▾","Frei","Geheftet","Verfolgung","Kinofahrt","Draufsicht","Seitenansicht","Von der Sonne","Zur Sonne","Darstellung▾","Himmelskörper▾","▾","Sonne","Merkur","Venus","▸","Erde","▸","Mars","▸","Jupiter","▸","Saturn","▸","Uranus","▸","Neptun","▸","Pluto","Ceres","Eris","Haumea","Makemake"]`
- `label` (3D-Beschriftungen, Reihenfolge wie im DOM, abhängig von der
  Startansicht): `["Pluto","Ceres","Venus","Neptun","Sonne","Erde","Mars","Merkur","Jupiter","Uranus","Saturn","Eris","Charon","Iapetus","Triton","Mond","Kallisto","Io","Europa","Ganymed","Miranda","Dione","Oberon","Rhea","Umbriel","Titania","Titan","Enceladus","Mimas","Haumea","Tethys","Makemake","Ariel"]`
- `kopfzeile`: `"DEEN"` (Textinhalt der beiden Schaltflächen ohne Trenner)

Zeitpanel (aus dem Zugriffsbaum, `browser_snapshot`): Statuszeile
„31.01.2000, 04:44", Geschwindigkeit „1 Tag/s", Datumsfeld (Textbox „Datum")
mit Wert `2000-01-31`. Kopfzeile: Gruppe „Sprache" mit Schaltfläche
„Deutsch (DE)" (gedrückt) und „English (EN)" (Stand nach Fix-Commit A;
zugänglicher Name seither mit Kürzel, siehe Nachtrag im Kopf).

Screenshot: `.playwright-mcp/a-de.png` (nicht versioniert; der Ordner wird
nach der Abnahme geleert).

### Lage der Kopfzeile

Per `getBoundingClientRect()`: Kopfzeile (`<header>`) `top 12 / left 12 /
width 273 / height 32 / bottom 44`; die Panel-Spalte darunter beginnt mit dem
Zeit-Abschnitt bei `top 52`. Viewport `1282 × 1269` CSS-Pixel. Die Kopfzeile
sitzt damit vollständig sichtbar am oberen Rand der Panel-Spalte, 8 px über
dem Zeitpanel, ohne Scrollen erreichbar.

## Schritt 3: Umschalten zur Laufzeit

Klick auf die Schaltfläche „EN" (`browser_click` auf den Snapshot-Verweis der
Kopfzeile), **ohne Neuladen** (die Seite bleibt auf derselben Navigation),
1 s gewartet, dieselbe Abfrage wie in Schritt 2:

- `lang`: `"en"`
- `title`: `"Orrery"`
- `sprache`: `"en"`
- `panelTitel`: `["Time▾","Pause","Reverse direction","Now","Scale▾","Realistic","Diagram","Compact","Cinema mode▾","Start cinema","Next scene","Camera▾","Free","Attached","Follow","Cinema ride","Top view","Side view","From the Sun","Towards the Sun","Display▾","Bodies▾","▾","Sun","Mercury","Venus","▸","Earth","▸","Mars","▸","Jupiter","▸","Saturn","▸","Uranus","▸","Neptune","▸","Pluto","Ceres","Eris","Haumea","Makemake"]`
- `label`: `["Pluto","Ceres","Venus","Neptune","Sun","Earth","Mars","Mercury","Jupiter","Uranus","Saturn","Eris","Charon","Iapetus","Triton","Moon","Callisto","Io","Europa","Ganymede","Miranda","Dione","Oberon","Rhea","Umbriel","Titania","Titan","Enceladus","Mimas","Haumea","Tethys","Makemake","Ariel"]`
- `kopfzeile`: `"DEEN"`

Damit sind Panel-Titel (u. a. „Time", „Scale", „Cinema mode", „Camera",
„Display", „Bodies") und 3D-Labels vollständig englisch, insbesondere „Sun",
„Earth" und „Moon" statt „Sonne", „Erde" und „Mond". Die Kürzel-Übersicht
selbst (Panel „Tastenkürzel"/„Keyboard shortcuts", Taste `?`) ist ein eigenes,
standardmäßig geschlossenes Panel und wird gesondert unten geprüft.

### Datum und Zeitraffer-Text im Zeitpanel (Englisch), wörtlich

Zugriffsbaum-Auszug direkt nach dem Klick:

```
status: 04/04/2000, 15:13
slider "Speed 1 day/s"
textbox "Date": 2000-04-04
```

Da die Zeit weiterläuft, wich der Statuswert von Aufnahme zu Aufnahme leicht
ab; ein zweiter Abgriff kurz danach (per `textContent` des Zeit-Abschnitts)
ergab wörtlich:

```
Time▾23/03/2000, 14:10PauseReverse directionNowSpeed1 day/sDate
```

Trennzeichen im Statustext ist `/` (nicht `.` wie auf Deutsch). Die
Reihenfolge ist Tag/Monat/Jahr (nicht US-amerikanisch Monat/Tag/Jahr): Am
Beispiel „23/03/2000" ist 23 keine gültige Monatszahl, also steht der Tag
zuerst — das entspricht der in den Rulings festgelegten Locale `en-GB`. Der
Zeitraffer-Text lautet „Speed" / „1 day/s" gegen „Geschwindigkeit" / „1 Tag/s"
auf Deutsch. Das native Datumsfeld selbst (`<input type="date">`) liefert in
`.value` unabhängig von der Sprache das ISO-Format `2000-04-04`; das ist das
in HTML festgelegte Verhalten dieses Feldtyps und keine Eigenschaft der
Anwendung.

Screenshot: `.playwright-mcp/a-en.png` (nicht versioniert; der Ordner wird
nach der Abnahme geleert).

### Taste `L`

`browser_press_key('l')` → Abfrage von `lang`/`title`/`sprache`:
`{"lang":"de","title":"Sonnensystem","sprache":"de"}` (zurück auf Deutsch).
Erneut `browser_press_key('l')` → `{"lang":"en","title":"Orrery","sprache":"en"}`
(wieder Englisch). Beide Umschaltungen wirkten sofort, ohne Neuladen.

### Kürzel-Übersicht (Panel „Tastenkürzel"/„Keyboard shortcuts", Taste `?`)

In der ersten Fassung dieses Protokolls war „Kürzel-Übersicht" fälschlich mit
der Himmelskörperliste im Panel „Bodies" gleichgesetzt. Die tatsächliche
Kürzel-Übersicht ist ein eigenes, standardmäßig geschlossenes Panel
(`Kuerzeluebersicht` in `src/ui/App.tsx`, `SHORTCUTS_PANEL`), das erst mit der
Taste `?` erscheint und in der Abnahme oben nie geöffnet wurde. Nachgeholt:
frisches `browser_navigate`, `quality.tier` auf `high`, 3 s gewartet, dann
`browser_press_key('?')`. Per `browser_evaluate` alle `dt`/`dd`-Texte
ausgelesen:

Deutsch (Panel-Titel „Tastenkürzel▾"), wörtlich:

```
dt: ["H","F","Leertaste","◀ ▶","R","Pos1","C","N","L","?"]
dd: ["Bedienoberfläche ein- und ausblenden","Vollbild","Zeit anhalten und fortsetzen","Zeitraffung verringern und erhöhen","Laufrichtung umkehren","Kamera zurücksetzen","Kino-Modus starten und beenden","Nächste Szene","Sprache umschalten","Diese Übersicht ein- und ausblenden"]
```

Danach Taste `L` (Umschalten zur Laufzeit, ohne Neuladen). Englisch
(Panel-Titel „Keyboard shortcuts▾"), wörtlich:

```
dt: ["H","F","Space","◀ ▶","R","Home","C","N","L","?"]
dd: ["Show or hide the interface","Fullscreen","Pause and resume time","Slow down and speed up time","Reverse direction","Reset camera","Start and stop cinema mode","Next scene","Switch language","Show or hide this overview"]
```

Damit sind Panel-Titel und Einträge der Kürzel-Übersicht vollständig englisch,
insbesondere „Pos1" → „Home", „Leertaste" → „Space" und „Sprache umschalten"
→ „Switch language", wie im Entwurf gefordert.

## Schritt 4: Startsprache aus dem Browser

Der Playwright-MCP erlaubt keine Browser-Locale je Navigation, und ein per
`browser_evaluate` überschriebenes `navigator.language` überlebt keinen
Reload — die Verdrahtung „Browsersprache → Startsprache" lässt sich im
Browser deshalb nur auf dem tatsächlich eingestellten Deutsch des
Prüfrechners zeigen, nicht mit `en-US` erzwingen. Die Fallunterscheidung
selbst ist durch den Unit-Test `startSprache` in `src/ui/i18n/i18n.test.ts`
nachgewiesen (`startSprache('en-US', null)` → `'en'`, `startSprache('de-DE',
null)` → `'de'`, `startSprache('fr', null)` → `'de'`, u. a.; Teil der 848
grünen Tests unten).

Im Browser geprüft wurde nur die Verdrahtung: Nach frischem `browser_navigate`
lieferte `browser_evaluate` mit
`() => [navigator.language, window.store.getState().ui.language]` wörtlich:

```
["de-DE", "de"]
```

— auf dem deutsch eingestellten Prüfrechner startet die Anwendung also mit
Deutsch, wie es `startSprache('de-DE', null) === 'de'` vorhersagt.

## Schritt 5: Konsole

Nach dem vollständigen, ununterbrochenen Lauf von Schritt 2 und 3 in einer
Navigation (Qualität setzen, Deutsch-Abfrage, Klick auf „EN", zweimal Taste
`L`) lieferte `browser_console_messages` auf Stufe `warning` (schließt
`error` ein), bezogen auf die laufende Navigation:

```
Total messages: 3 (Errors: 0, Warnings: 0)
Returning 0 messages for level "warning"
```

Die Kopfzeile „Total messages: 3" zählt alle Meldungen unabhängig von der
Stufe; aufgeschlüsselt per Abfrage auf Stufe `debug` (schließt `info`,
`warning` und `error` ein) sind es genau drei, wörtlich:

```
[DEBUG] [vite] connecting... @ http://localhost:5173/Orrery/@vite/client:882
[DEBUG] [vite] connected. @ http://localhost:5173/Orrery/@vite/client:995
[INFO] %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold @ http://localhost:5173/Orrery/node_modules/.vite/deps/react-dom_client.js?v=0e3eb6ab:15804
```

Zwei reine Vite-Verbindungsmeldungen auf Stufe `debug` und eine
React-Entwicklungshinweismeldung auf Stufe `info` — keine davon `warning`
oder `error`. Dieses Ergebnis (0 Fehler, 0 Warnungen) wurde für jeden
Einzelschritt (Navigation, Qualität setzen, Klick, je Taste `L`, sowie bei
der Nachprüfung der Kürzel-Übersicht mit Taste `?`) einzeln bestätigt — an
keiner Stelle trat ein Fehler oder eine Warnung auf.

**Randbemerkung zu einer älteren, historischen Konsolen-Datei.** Eine
Abfrage mit dem Zusatz „gesamte Sitzung" (statt nur die laufende Navigation)
zog zusätzlich rund 30 weitere Meldungen aus einer bereits **vor Beginn
dieser Abnahme** bestehenden Browser-Sitzung heran, erkennbar an einem
eigenen Mitschnitt mit Zeitstempel 17:52 Uhr (rund eine Stunde vor dem ersten
`browser_navigate` dieser Abnahme um 18:50 Uhr) und an Modul-Zeitstempeln in
den Dateipfaden, die zu wiederholtem Neuladen einzelner Quelldateien während
einer laufenden Bearbeitung passen (u. a. `ReferenceError: zahl is not
defined` in `DisplayPanel.tsx`/`ScalePanel.tsx`, danach `ReferenceError: t is
not defined` und `TypeError: name is not a function` in `render/labels.ts`,
dazwischen wiederholt „Failed to reload … This could be due to syntax
errors"-Meldungen von Vite). Diese Meldungen gehören zu einem älteren
Bearbeitungsstand vor den beiden in dieser Abnahme geprüften Fix-Commits,
nicht zum geprüften Commit `e6f853d`: Jede frische Navigation auf den
aktuellen Stand (drei eigene Mitschnitte während dieser Abnahme, je nur die
React-Hinweismeldung) blieb durchgehend fehler- und warnungsfrei. Für das
Kriterium „Browserkonsole ohne Fehler und Warnungen über den Prüflauf" zählt
deshalb der Prüflauf auf dem aktuellen Commit, und der ist sauber.

## Lint, Test, Build

```
$ npm run lint
npm notice run orrery@0.0.0 lint
npm notice run eslint .
(Exit-Code 0, keine Ausgabe von eslint)

$ npm test
npm notice run orrery@0.0.0 test
npm notice run vitest run
 Test Files  54 passed (54)
      Tests  848 passed (848)
   Start at  20:56:27
   Duration  7.62s

$ npm run build
npm notice run orrery@0.0.0 build
npm notice run tsc -b && vite build
✓ 101 modules transformed.
dist/index.html                     0.60 kB │ gzip:   0.38 kB
dist/assets/index-HFi0vWjX.css     15.59 kB │ gzip:   3.73 kB
dist/assets/index-BmBT10DC.js   1,120.22 kB │ gzip: 298.40 kB
✓ built in 320ms
(!) Some chunks are larger than 500 kB after minification …
```

Der Hinweis auf die Chunk-Größe ist ein allgemeiner Vite-Hinweis zur
Bündelgröße, kein Fehler und keine Regression dieser Aufgabe (Code-Splitting
ist nicht Gegenstand von Phase 4a).

## Kriterien aus dem Entwurf (Abschnitt 9) — bewertet

| Kriterium | Nachweis | Ergebnis |
|---|---|---|
| Screenshot derselben Ansicht auf Deutsch und Englisch mit sichtbarer Kopfzeile | `a-de.png`, `a-en.png`, Kopfzeile in beiden bei `top 12–44`, Viewport `1282 × 1269` | erfüllt |
| Umschalten zur Laufzeit ohne Neuladen; danach per DOM-Abfrage: Panel-Titel, Kürzel-Übersicht, ein Zeitraffer-Text und ein 3D-Label („Moon" statt „Mond") englisch; `document.documentElement.lang` = `en`, `document.title` englisch | Schritt 3 oben (Panel-Titel, Zeitraffer-Text, 3D-Label, `lang`/`title`) und Abschnitt „Kürzel-Übersicht" (Panel „Tastenkürzel"/„Keyboard shortcuts"), jeweils ohne `browser_navigate` zwischen den Zuständen | erfüllt |
| Start mit `navigator.language = en-US` (Playwright-Kontext mit `locale`) zeigt Englisch ohne Klick | Playwright-MCP erlaubt keine Locale je Navigation (Werkzeuggrenze, siehe Schritt 4); ersatzweise Unit-Test `startSprache` (u. a. `startSprache('en-US', null) === 'en'`) plus Verdrahtungsnachweis im Browser mit der tatsächlichen Systemsprache (`de-DE` → `de`) | erfüllt, mit Einschränkung beim Nachweisweg (Werkzeuggrenze, kein Befund an der Anwendung) |
| Browserkonsole ohne Fehler und Warnungen über den Prüflauf | Schritt 5 oben | erfüllt |
| `npm run lint`, `npm test`, `npm run build` grün | Abschnitt „Lint, Test, Build" | erfüllt |

## Commit-Prüfung

```
git add docs/phase4a-englisch-abnahme.md
git commit -m "Abnahme Phase 4a: Englisch und Sprachumschaltung zur Laufzeit"
git log --format=%B -1 | grep -ci 'co-authored\|session'
```

Ergebnis der letzten Zeile: `0`.

## `git status --short` (nach dem Commit)

```
(leer)
```

Nur `docs/phase4a-englisch-abnahme.md` wurde committet; die Screenshots
`a-de.png`/`a-en.png` liegen unter `.playwright-mcp/` (git-ignoriert) und
sind nicht Teil des Commits.
