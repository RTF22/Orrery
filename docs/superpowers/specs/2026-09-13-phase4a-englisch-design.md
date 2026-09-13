# Phase 4a — Englisch und Sprachumschaltung zur Laufzeit

Entwurf vom 13.09.2026. Teil von Phase 4 „Komfort" des Gesamtentwurfs
(`2026-09-11-sonnensystem-design.md`, §9.3 und §16). Reihenfolge der Phase 4 nach
Entscheidung vom 13.09.2026: 4a Englisch, dann 4b Persistenz (URL-Sharing,
Sitzungswiederherstellung, Presets), dann 4c Infopanel.

Akzeptanzkriterium aus dem Gesamtentwurf: **Englisch vollständig, Sprachumschaltung
zur Laufzeit.**

## 1. Ausgangslage

- Alle sichtbaren Texte laufen über `t(key)` aus `ui/i18n/index.ts`; die einzige
  Tabelle ist `ui/i18n/de.ts` mit 128 Schlüsseln. `t` ist eine reine Funktion ohne
  Anbindung an den Store.
- `AppState.ui.language` ist auf den Literaltyp `'de'` festgelegt.
- `render/labels.ts` importiert `t` aus `ui/i18n` und setzt die Namen der
  3D-Beschriftungen einmalig beim Anlegen. Das verletzt die Schichtung
  `ui → store → render → sim` (render greift auf ui zu) und ließe die
  Beschriftungen beim Umschalten stehen.
- Zahlen und Datum sind an vier Stellen fest auf `de-DE` formatiert (`ui/format.ts`,
  `CameraPanel`, `DisplayPanel`, `ScalePanel`); im Kamerapanel steht das Literal
  „Mio. km" außerhalb der Sprachdatei.
- `index.html` trägt `lang="de"`, der Seitentitel „Orrery" steht im HTML.

## 2. Entscheidungen (Jens, 13.09.2026)

| Frage | Entscheidung |
|---|---|
| Startsprache | Browsersprache automatisch: `navigator.language` beginnt mit `en` → Englisch, sonst Deutsch. Ein geteilter Zustand (URL, später Preset) hat Vorrang. |
| Umschalter | Neue Kopfzeile über der Panel-Spalte mit „DE \| EN"; Tastenkürzel `L`. |
| Englische Locale | `en-GB` (Tag vor Monat, 24-Stunden-Uhr). |
| Mechanik | Eigene kleine Lösung ohne Bibliothek (Ansatz A): `t()` bleibt, Modulvariable plus Store-Subscription, Hook für die React-Neuzeichnung, Namensauflöser für die 3D-Beschriftungen. |

## 3. Sprachdaten

- `ui/i18n/de.ts` bleibt die Referenz. Neu `ui/i18n/en.ts` mit **exakt denselben
  Schlüsseln**. Typ: `Key = keyof typeof de`; `en` ist als `Record<Key, string>`
  deklariert, ein fehlender oder überzähliger Schlüssel scheitert damit schon in
  `tsc`.
- `type Sprache = 'de' | 'en'` in `ui/i18n/index.ts`; `AppState.ui.language: Sprache`.
  `DEFAULT_STATE.ui.language` bleibt `'de'` (siehe §7, Serialisierung).
- Neue Schlüssel (beide Sprachen): `language.de` („Deutsch"/„Deutsch"),
  `language.en` („English"/„English"), `language.switch` („Sprache"/„Language",
  `aria-label` der Schaltergruppe), `shortcuts.language` („Sprache umschalten"/
  „Switch language"), `key.home` („Pos1"/„Home"), `key.space` („Leertaste"/„Space"),
  `key.arrows` („◀ ▶"/„◀ ▶"), `unit.millionKm` („Mio. km"/„million km"). Weitere
  Einheiten, die sich beim Umsetzen als sprachabhängig herausstellen, ebenso.
- Feste Terminologie für die Übersetzung: Kino-Modus → Cinema mode, Zeitraffer →
  time-lapse, Bahnlinien → orbit lines, Maßstab → Scale, Schaubild → Diagram,
  Kompakt → Compact, Realistisch → Realistic, Körpergröße → Body size, Bahnabstände →
  Orbit spacing, Sonne dämpfen → Damp the Sun, Nachtseite → Night side,
  Distanzausgleich → Distance compensation, Leuchten → Glow, Lichtabfall →
  Light falloff, Beschriftungen → Labels, Marker → Markers, Gürtel → Belts,
  Schatten → Shadows, Geheftet → Attached, Verfolgung → Follow, Kinofahrt →
  Cinema ride, Zufallskeim → Random seed, Himmelskörper → Bodies.
- Körpernamen: Ganymed → Ganymede, Kallisto → Callisto, Merkur → Mercury,
  Neptun → Neptune, Mond → Moon, Erde → Earth, Sonne → Sun; alle übrigen sind
  Eigennamen und bleiben gleich.
- Szenentitel werden frei übersetzt, sinngemäß, nicht wörtlich.
- **Nicht übersetzt:** `README.md`, Doku, Commit-Texte, Kommentare,
  Konsolenmeldungen und `Error`-Texte (Entwicklerkanal), Beschreibungstexte der
  Körper (existieren noch nicht, kommen mit 4c).

## 4. Kernmechanik

### 4.1 `t()` und die aktuelle Sprache

`ui/i18n/index.ts`:

```ts
let aktuell: Sprache = 'de';
const tabellen: Record<Sprache, Record<Key, string>> = { de, en };
export function setSprache(s: Sprache): void { aktuell = s; }
export function sprache(): Sprache { return aktuell; }
export function t(key: string): string {
  return (tabellen[aktuell] as Record<string, string>)[key] ?? `[${key}]`;
}
export function locale(): 'de-DE' | 'en-GB' { return aktuell === 'en' ? 'en-GB' : 'de-DE'; }
```

`t` bleibt synchron und ohne React aufrufbar (`data/scenes.ts` hält nur Schlüssel,
`ui/format.ts` formatiert). Unbekannte Schlüssel fallen weiter als `[key]` auf.

### 4.2 Reaktivität in React

Hook `useSprache()` in `ui/i18n/useSprache.ts`:

- liest `ui.language` aus dem Store (`useStore((s) => s.ui.language)`),
- ruft **synchron während des Renderns** `setSprache(language)` auf, wenn sich der
  Wert unterscheidet (damit alle Kinder im selben Renderdurchlauf schon die neue
  Tabelle sehen; ein Effekt käme einen Durchlauf zu spät),
- setzt in einem Effekt `document.documentElement.lang = language` und
  `document.title = t('app.title')`,
- gibt die Sprache zurück.

`App.tsx` ruft `useSprache()` als erstes auf. Da alle Panels Kinder von `App` sind,
zeichnet ein Sprachwechsel den gesamten Baum neu. Kein Panel importiert
`setSprache`; sie rufen weiterhin nur `t`.

### 4.3 3D-Beschriftungen ohne `ui`-Import

- `render/labels.ts` verliert `import { t } from '../ui/i18n'`.
- `createLabels(overlay, name: (key: string) => string)` erhält den Namensauflöser
  als Parameter. `render/scene.ts` (`buildScene(ctx, overlay, name)`) reicht ihn
  durch; `app/main.tsx` übergibt `(key) => t(key)`. `app/` darf alle Schichten
  kennen.
- `labels.update(...)` bekommt zusätzlich `state.ui.language`. Der Label-Manager
  merkt sich die zuletzt beschriftete Sprache; weicht sie ab, setzt er
  `textContent` aller vorhandenen Einträge über den Auflöser neu und merkt sich die
  Sprache. Neu angelegte Einträge werden ohnehin über den Auflöser beschriftet.
- Ergebnis: `render/` importiert nichts mehr aus `ui/`. Ein Test in
  `labels.test.ts` prüft den Wechsel per jsdom (`textContent` vor und nach
  `update` mit anderer Sprache).

## 5. Kopfzeile, Umschalter, Tastenkürzel

- Neue Komponente `ui/Kopfzeile.tsx`, in `App.tsx` **über** der Panel-Spalte, gleiche
  Optik wie `Panel` (dunkel, halbtransparent, `backdrop-blur`, feiner Rand), eine
  Zeile hoch, `pointer-events-auto`. Sie verschwindet mit der übrigen Oberfläche
  (`H`, Kino-Ruhe), weil `App` bei `hidden`/`untaetig` `null` liefert.
- Inhalt: rechtsbündig eine Schaltergruppe (`role="group"`,
  `aria-label={t('language.switch')}`) mit zwei `<button>` „DE" und „EN",
  `aria-pressed` je nach aktiver Sprache, aktive Schaltfläche hervorgehoben
  (Akzentfarbe wie bei den aktiven Reglern). Klick: `setUi({ language })`.
- Die Kopfzeile ist bewusst leer bis auf den Sprachschalter. Sie ist die spätere
  Heimat der vier Schaltflächen aus dem Gesamtentwurf (UI aus, Vollbild, Kino,
  Hilfe); das wird hier nicht gebaut.
- Tastenkürzel `L` in `ui/shortcuts/useShortcuts.ts`: wechselt `de ↔ en`. Eintrag in
  der Kürzel-Übersicht in `App.tsx` mit Schlüssel `shortcuts.language`.
- Die Tastenbezeichnungen der Übersicht (`Pos1`, `␣`, `◀ ▶`) werden über
  `key.home`, `key.space`, `key.arrows` aufgelöst; die `KUERZEL`-Liste hält dafür je
  Eintrag entweder ein Literal (Buchstaben wie `H`) oder einen Schlüssel.

## 6. Formatierung und Einheiten

- `ui/format.ts`: `formatJd(jd)` baut den `Intl.DateTimeFormat` je Locale und cacht
  ihn in einer `Map<string, Intl.DateTimeFormat>`; Optionen bleiben (Datum plus
  Uhrzeit, UTC), nur die Locale kommt aus `locale()`. Neue Funktion
  `formatZahl(n, maxStellen = 2)` = `n.toLocaleString(locale(), { maximumFractionDigits })`.
- `CameraPanel`, `DisplayPanel`, `ScalePanel` ersetzen ihre lokalen
  `toLocaleString('de-DE', …)` durch `formatZahl`. „Mio. km" wird
  `t('unit.millionKm')`.
- `formatRate` (Zeitraffer) verwendet bereits Sprachschlüssel; seine lokale
  Zahlformatierung wird auf `formatZahl` umgestellt.

## 7. Startsprache und Serialisierung

- Reine Funktion `startSprache(navigatorLanguage: string, ausFragment: Sprache | null): Sprache`
  in `ui/i18n/index.ts`: liefert `ausFragment`, falls gesetzt; sonst `'en'`, wenn
  `navigatorLanguage.toLowerCase().startsWith('en')`, sonst `'de'`.
- `app/main.tsx` ruft vor dem ersten Rendern
  `useStore.getState().setUi({ language: startSprache(navigator.language, null) })`.
  Der zweite Parameter bleibt `null`, bis 4b das URL-Fragment liest; 4b muss dann
  nur die aus `decodeState` gelesene Sprache einsetzen.
- `DEFAULT_STATE.ui.language` bleibt `'de'`. Dadurch ist Englisch im geteilten
  Zustand eine **Abweichung vom Standard** und wird von `toShareable` mitgeführt:
  Ein aus einem englischen Browser geteilter Link zeigt überall Englisch, wie es das
  Kriterium „stellt den Zustand exakt wieder her" verlangt. Hinge der Standard vom
  Browser ab, verlöre der Link die Sprache.
- Die Sprachwahl überlebt heute keinen Neuladen; das kommt mit der
  Sitzungswiederherstellung in 4b.

## 8. Tests

- `ui/i18n/i18n.test.ts`: `en` hat exakt die Schlüssel von `de` (Mengenvergleich in
  beide Richtungen); kein englischer Wert ist leer; kein englischer Wert ist gleich
  dem deutschen, außer einer benannten Ausnahmeliste (Eigennamen wie „Io",
  „Titan", „Saturn", dazu „◀ ▶", „Deutsch", „English").
  `t()` liefert nach `setSprache('en')` den englischen Wert, nach `'de'` wieder den
  deutschen; `locale()` entsprechend.
- `startSprache`: `en-US`, `en`, `EN-gb` → `en`; `de-DE`, `fr`, `''` → `de`;
  Fragmentsprache hat Vorrang.
- `ui/format.test.ts`: `formatZahl(1234.5)` = „1.234,5" (de) / „1,234.5" (en);
  `formatJd(J2000)` enthält „2000" und die Reihenfolge Tag-Monat in beiden
  Locales (Regex auf „1 Jan" bzw. „1. Jan").
- `ui/Kopfzeile.test.tsx` (Testing Library): Klick auf „EN" setzt
  `ui.language = 'en'`, `aria-pressed` wechselt, Beschriftung des Titels wechselt.
- `ui/shortcuts/useShortcuts.test.ts`: `L` schaltet um.
- `ui/i18n/useSprache.test.tsx`: nach Store-Änderung sind `document.documentElement.lang`
  und `document.title` gesetzt.
- `render/labels.test.ts`: Sprachwechsel beschriftet vorhandene Einträge neu.
- Schichtprüfung: ein Test (oder ESLint-Regel, falls schon vorhanden) stellt sicher,
  dass keine Datei unter `src/render/` aus `../ui/` importiert (einfacher
  Dateiscan im Test).

## 9. Abnahme

Protokoll `docs/phase4a-englisch-abnahme.md`:

- Screenshot derselben Ansicht auf Deutsch und Englisch mit sichtbarer Kopfzeile.
- Umschalten zur Laufzeit ohne Neuladen; danach per DOM-Abfrage (nicht per Bild):
  Panel-Titel, Kürzel-Übersicht, ein Zeitraffer-Text und ein 3D-Label („Moon"
  statt „Mond") sind englisch; `document.documentElement.lang` = `en`,
  `document.title` englisch.
- Start mit `navigator.language = en-US` (Playwright-Kontext mit `locale`) zeigt
  Englisch ohne Klick.
- Browserkonsole ohne Fehler und Warnungen über den Prüflauf.
- `npm run lint`, `npm test`, `npm run build` grün.

## 10. Nicht-Ziele

- Beschreibungstexte der Körper (4c Infopanel).
- Speicherung der Sprachwahl über Sitzungen und Lesen des URL-Fragments (4b).
- Weitere Sprachen; Pluralregeln und Interpolation (heute nicht benötigt).
- Die vier Schaltflächen der Kopfzeile aus dem Gesamtentwurf.
