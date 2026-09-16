# Phase 4c — Infopanel: Erläuterungen in drei Niveaustufen, Quellen, Kamerafahrt

Entwurf vom 14.09.2026. Teil von Phase 4 „Komfort" des Gesamtentwurfs
(`2026-09-11-sonnensystem-design.md`, §4.4, §9.1 und §16). Reihenfolge der Phase 4:
4a Englisch und 4b Persistenz sind abgeschlossen, 4c ist der letzte Teil vor dem
Tag `v0.4.0`.

Akzeptanzkriterium aus dem Gesamtentwurf: **Infopanel mit abgeleiteten Live-Werten.**
Jens hat den Umfang am 14.09.2026 erweitert: Aus dem Kennzahlen-Panel wird ein
Lernwerkzeug mit Erläuterungstexten in drei Niveaustufen (Grundschule, Gymnasium,
Hochschule), anklickbaren Verweisen auf Objekte der Simulation und einem
Quellenbereich mit öffentlichen Angeboten von NASA, JPL, ESA und anderen.

## 1. Ausgangslage

- Alle 35 Körper tragen `info.descriptionKey`, aber weder `ui/i18n/de.ts` noch
  `en.ts` enthalten einen Beschreibungstext. Die Namen (`body.<id>.name`) sind
  vollständig.
- Eine Auswahl gibt es bereits: Der Objektbaum setzt beim Fokussieren
  `camera.targetId`, `distance` und im freien Modus `freezeJd`. Die Kamera springt
  dabei hart, eine animierte Fahrt existiert nicht (`ui/tween.ts` kennt nur
  `tweenScale` für den Maßstab).
- Die Simulation liefert alles Nötige: `positionAt`, `velocityAt` (laut Kommentar
  ausdrücklich für die Infopanel-Anzeige vorgesehen), `elementsAt`, `axialTiltDeg`.
  `ui/format.ts` formatiert Zahlen und Daten in der Locale der Sprache.
- Die Oberfläche besteht heute aus einer einzigen linken Spalte (`w-72`) mit
  Kopfzeile, Panels und Objektbaum. Panels klappen über `ui.panels[id]`.
- Persistenzprofile (`store/persist.ts`): Sitzung führt ganz `ui`, der Link nur
  `quality`, `ui.hidden`, `ui.panels`; Ansichten führen `ui` komplett.
- 19 Kinoszenen in `data/scenes.ts` mit `id`, `titleKey`, `targetId`, optional
  `lookAtId`.
- Einbettbarkeit fremder Seiten, geprüft am 14.09.2026 über die Antwortköpfe:
  science.nasa.gov, solarsystem.nasa.gov, ssd.jpl.nasa.gov, nssdc.gsfc.nasa.gov und
  photojournal.jpl.nasa.gov senden `X-Frame-Options: SAMEORIGIN`; www.jpl.nasa.gov
  antwortet Skripten mit 403. esa.int, eyes.nasa.gov und Wikipedia verbieten das
  Einbetten nicht. Ein Browser zeigt bei verbotenen Seiten nur ein leeres Feld, ein
  Fehlerereignis gibt es nicht.

## 2. Entscheidungen (Jens, 14.09.2026)

1. **Keine Einbettung fremder Seiten.** Das untere Segment zeigt kuratierte
   Quellenkarten; jede öffnet im neuen Tab.
2. **Die Tabs sind die Niveaustufen** Grundschule, Gymnasium, Hochschule. Sie
   schalten den Text um, nicht das Objekt.
3. **Inhalt oben:** außerhalb des Kinos der Text zum Kameraziel, im laufenden Kino
   der Text zur laufenden Szene. Besonderheiten (Themen) sind eigene Texte,
   erreichbar über Verweise.
4. **Textlänge gestaffelt:** Grundschule 40 bis 80 Wörter, Gymnasium 120 bis 180
   Wörter, Hochschule ohne Obergrenze („gesamte wissenschaftliche Basis"). Die
   Hochschulstufe ist deshalb eine eigene, spätere Phase (Arbeitstitel 4d) mit
   eigenem Entwurf; 4c baut sie technisch ein, füllt sie aber nicht.
5. **Ablage als Markdown-Dateien** mit eigenem Renderer für eine kleine Teilmenge,
   Nachladen bei Bedarf, keine neue Abhängigkeit.

**Nachtrag zu Punkt 4 (14.09.2026, Jens):** Beim Gymnasium ist die Wortzahl kein
Dogma. Maßgeblich ist die korrekte und dem Niveau angepasste Darstellung des
Sachverhalts; 120 bis 180 Wörter bleiben Richtwert. Der Dateitest (§8) prüft für
Gymnasium deshalb keine Obergrenze mehr, nur noch für die Grundschule.

## 3. Aufbau und Bedienung

### 3.1 Rechte Spalte

Neben der bestehenden linken Spalte entsteht eine rechte Spalte, das Infopanel
(`ui/info/InfoPanel.tsx`). Aufbau von oben nach unten:

- **Kopfzeile:** Titel des aktuellen Texts (erste Überschrift der Datei), rechts
  daneben der Klapppfeil wie bei den anderen Panels.
- **Tabs:** „Grundschule | Gymnasium | Hochschule" als `role="tablist"`, Pfeiltasten
  wechseln, der aktive Tab ist farblich abgesetzt.
- **Oberes Segment:** Datenblock (§5) und darunter der gerenderte Text. Scrollt
  unabhängig.
- **Griff** zwischen oben und unten (§3.2).
- **Unteres Segment:** Quellenkarten (§4.4). Scrollt unabhängig.

Die Spalte ist ein Panel mit Kennung `info` in `ui.panels`. Eingeklappt bleibt ein
schmaler senkrechter Reiter mit dem Titel „Info" am rechten Rand; Taste `I` klappt
auf und zu (die Taste ist frei, `ui/shortcuts/useShortcuts.ts`).

### 3.2 Größe

- **Breitengriff** an der linken Kante der Spalte: Ziehen mit der Maus ändert
  `ui.info.breiteRem` zwischen 18 rem und 60 % der Fensterbreite (in rem
  umgerechnet, damit der Wert bildschirmunabhängig bleibt).
- **Teilungsgriff** zwischen oberem und unterem Segment: Ziehen ändert
  `ui.info.teilung` (Anteil des oberen Segments, 0,2 bis 0,9). Das untere Segment
  hat mindestens 6 rem.
- Beide Griffe sind Elemente mit `role="separator"`, `aria-orientation`,
  `aria-valuenow/-min/-max` und `tabIndex=0`; Pfeiltasten ändern den Wert in
  Schritten (1 rem beziehungsweise 0,05), damit die Größenänderung ohne Maus geht.
- Ziehen läuft über Pointer-Ereignisse mit `setPointerCapture`; während des Ziehens
  wird die Textauswahl unterdrückt. Geschrieben wird gedrosselt je Animationsbild.

### 3.3 Was steht drin

- Außerhalb des Kinos: Text der Art `objekt` zum Körper `camera.targetId`.
- Im laufenden Kino (`cinema.running`): Text der Art `szene` zur laufenden Szene.
  Der Store trägt `cinema.nummer`, `seed` und `shuffle`; die Auflösung zur Szene
  übernimmt `sceneIndexFor` aus `sim/director.ts` (die Schicht `ui` darf `sim`
  lesen, wie es der Objektbaum mit `scaledRadius` schon tut).
- Ein Verweis `thema:<kennung>` setzt `ui.info.thema`; solange es gesetzt ist, zeigt
  das Panel diesen Text. Wechselt `camera.targetId`, die Szene oder der Kinozustand,
  wird `thema` auf `null` gesetzt.
- Bei jedem Textwechsel scrollt das obere Segment nach oben. Der Niveau-Tab bleibt.

### 3.4 Kino, Ausblenden, schmale Bildschirme

- Die Spalte gehört zur Oberfläche und folgt deren Regeln: Taste `H` blendet sie
  aus, im Kino verschwindet sie nach Ruhe wie alles andere. Das Nicht-Ziel „keine
  Info-Einblendungen im Kino-Modus" (Gesamtentwurf §17) bleibt damit gewahrt.
- Unter 900 px Fensterbreite wird die Spalte zu einem Bogen von unten mit voller
  Breite und 45 % der Fensterhöhe, standardmäßig eingeklappt; der Breitengriff
  entfällt, der Teilungsgriff bleibt. Eine ausführliche Mobilprüfung gehört nicht
  zu 4c (Gesamtentwurf §9.4 bleibt Phase 5).

### 3.5 Sprache

Texte kommen in der Sprache aus `ui.language`. Fehlt ein Text in der gewählten
Sprache, erscheint der deutsche mit der Hinweiszeile `info.nichtUebersetzt`.
Fehlt er ganz, erscheint der Datenblock und die Zeile `info.keinText`. Fehlt ein
Hochschultext (in 4c immer), zeigt der Tab den Datenblock in Hochschultiefe und den
Gymnasialtext mit der Hinweiszeile `info.hochschuleFolgt`.

## 4. Daten

### 4.1 Textdateien

Ablage unter `src/data/texte/<sprache>/<niveau>/<art>-<kennung>.md`:

- `sprache`: `de`, `en`
- `niveau`: `grundschule`, `gymnasium`, `hochschule`
- `art`: `objekt` (Kennung = Körper-Id), `szene` (Kennung = Szenen-Id),
  `thema` (Kennung aus `data/themen.ts`)

Beispiele: `de/gymnasium/objekt-saturn.md`, `en/grundschule/szene-mondfinsternis.md`,
`de/gymnasium/thema-finsternis.md`.

Die erste Zeile jeder Datei ist eine `#`-Überschrift; sie wird zum Paneltitel.
Der Lader `data/texte/index.ts` nutzt `import.meta.glob('./**/*.md', { query:
'?raw', import: 'default' })` **ohne** `eager`: Ein Text wird erst beim Aufruf
geladen und danach im Speicher behalten (`Map`). Die Funktion
`ladeText(sprache, niveau, art, kennung): Promise<string | null>` liefert `null`,
wenn keine Datei existiert; `textVorhanden(...)` beantwortet dieselbe Frage
synchron aus der Schlüsselmenge des Globs. Damit bleibt der Hauptbundle klein,
und jede Text-Etappe ist eine reine Dateiergänzung ohne Codeänderung.

Der Schichtentest `store/schichten.test.ts` und `render/schichten.test.ts` bleiben
gültig: `data/texte` importiert nichts, `ui/info` importiert `data` und `store`.

### 4.2 Markdown-Teilmenge

Eigener Renderer `ui/info/markdown.ts`: reine Funktion `parseMarkdown(text):
Block[]`, danach eine React-Komponente `Markdown`, die den Baum ausgibt. Verstanden
werden:

- Überschriften `#`, `##`, `###`
- Absätze (durch Leerzeilen getrennt)
- Aufzählungen mit `-`, nummerierte Listen mit `1.`
- Inline: `**fett**`, `*kursiv*`, `[Text](ziel)`

Alles andere bleibt Klartext. HTML wird nicht durchgereicht, eine Bereinigung ist
deshalb nicht nötig. Zeichenweise Zerlegung mit einem kleinen Zustandsautomaten
statt regulärer Ausdrücke für die Inline-Elemente, damit verschachtelte Klammern
in Link-Texten und Sternchen in Zahlen (`5*10`) nicht kippen.

### 4.3 Verweis-Schemata

| Ziel | Wirkung bei Klick | Mittelklick / Strg-Klick |
|---|---|---|
| `objekt:<id>` | Kamerafahrt zum Körper (§5.3), Text wechselt mit; läuft das Kino, wird es zuerst beendet | nichts |
| `szene:<id>` | startet die Szene im Kino (`setCinema({ running: true, shuffle: false, nummer })`, `setCamera({ mode: 'cinema' })`) | nichts |
| `thema:<kennung>` | setzt `ui.info.thema`, Kamera bleibt | nichts |
| `quelle:<kennung>` | scrollt das untere Segment zur Karte und hebt sie 1,5 s hervor | öffnet die URL der Quelle im neuen Tab |
| `https://…` | öffnet im neuen Tab (`target="_blank"`, `rel="noopener noreferrer"`) | Browserstandard |

Unbekannte Kennungen werden als schlichter Text ohne Link gezeigt. Ein Test liest
alle Textdateien (eager Glob im Test) und prüft jeden Verweis gegen Körperindex,
Szenenliste, Themenkatalog und Quellenkatalog; ein toter Verweis lässt den Test
fallen.

### 4.4 Quellenkatalog

`src/data/quellen.ts`, Typ `Quelle`:

```ts
interface Quelle {
  id: string;                       // z. B. 'nssdc-earth'
  titel: { de: string; en: string };
  herausgeber: 'NASA' | 'JPL' | 'ESA' | 'IAU' | 'Wikipedia' | 'Sonstige';
  url: string;                      // https
  sprache: 'de' | 'en';             // Sprache der Zielseite
  art: 'faktenblatt' | 'uebersicht' | 'bildarchiv' | 'fachartikel' | 'werkzeug';
  fuer: string[];                   // Kennungen: 'objekt:earth', 'szene:mondfinsternis', 'thema:finsternis'
}
```

Das untere Segment zeigt zu Beginn alle Karten, deren `fuer` die aktuelle
Text-Kennung enthält, gruppiert nach `art` in der Reihenfolge Faktenblatt,
Übersicht, Bildarchiv, Werkzeug, Fachartikel; innerhalb einer Gruppe zuerst die
Karten in der Oberflächensprache. Jede Karte zeigt Titel, Herausgeber, Sprache der
Seite als Kürzel und den Hinweis `info.neuerTab`. Fehlt eine passende Quelle, steht
dort `info.keineQuellen`. Die Quelle `thema:modell` verweist zusätzlich auf die
Datenquellen des Projekts (JPL Approximate Positions, NSSDC Fact Sheets,
IAU-Rotationselemente), wie sie in den Datensätzen kommentiert sind.

**Nachtrag (4c-3):** Für Körper und Themen schließt der Abdeckungstest in
`data/quellen.test.ts` den Zustand `info.keineQuellen` aus; für Szenen bleibt er
möglich.

**Nachtrag (4c-4):** Mit den Szenentexten bekommt jede Szene Quellenkarten aus dem
vorhandenen Katalog (nur `szene:`-Einträge in `fuer`, keine neuen Adressen); der
Abdeckungstest schließt `info.keineQuellen` jetzt auch für Szenen aus.

### 4.5 Themenkatalog

`src/data/themen.ts`: `{ id: string; titleKey: string }[]`. Anfangsbestand acht
Themen: `finsternis`, `ringe`, `gebundene-rotation`, `kirkwood-luecken`,
`achsneigung`, `zwergplaneten`, `bahnelemente`, `modell`. Das Thema `modell`
dokumentiert die Grenzen aus Gesamtentwurf §4.4 (keine Bahnstörungen, keine
Präzession, Laplace-Ebene der Monde, Genauigkeitsfenster 1800–2050).

**Nachtrag (4c-4, Jens 16.09.2026):** Neuntes Thema `sonnensystem` („Das Sonnensystem"):
Überblick über das System und Erklärung des Namens „Orrery" mit Quellen (Science Museum
Group, Wikipedia). Es erscheint beim Start und an der Wurzel des Objektbaums (§3.3).

### 4.6 Zustand und Persistenz

Neu in `AppState.ui`:

```ts
info: {
  niveau: 'grundschule' | 'gymnasium' | 'hochschule';
  breiteRem: number;   // 18 … 60 % der Fensterbreite in rem, Standard 24
  teilung: number;     // 0,2 … 0,9, Standard 0,65
  thema: string | null;
}
```

Klappzustand in `ui.panels.info` (Standard offen). Standardniveau Gymnasium.

- **Sitzung:** führt ganz `ui` und damit auch `info`, unverändert.
- **Link:** bekommt zusätzlich `ui.info.niveau`, nicht aber `breiteRem`,
  `teilung` und `thema` (bildschirm- beziehungsweise sitzungsgebunden).
- **Ansichten:** führen `ui` komplett und damit `info`; bestehende Exporte ohne
  `info` bleiben gültig, der Prüfer ergänzt die Standardwerte.
- **Prüfer** (`store/pruefer.ts`): `ui.info.niveau` gegen die drei Werte,
  `breiteRem` als Zahl 18 bis 200, `teilung` als Zahl 0,2 bis 0,9, `thema` als
  Zeichenkette bis 40 Zeichen oder `null`. Werte außerhalb fallen weg (Ruling aus
  4b Etappe 2).

## 5. Kennzahlen, Live-Werte, Kamerafahrt

### 5.1 Datenblock

Über der Prosa steht ein Datenblock aus dem Datensatz und der Simulation,
gestuft nach Niveau (jede Stufe ergänzt die vorige):

| Niveau | Zeilen |
|---|---|
| Grundschule | Durchmesser, Umlaufzeit, Abstand zur Sonne jetzt |
| Gymnasium | + Masse, Tageslänge (Rotationsperiode), Achsneigung, Exzentrizität, Abstand zur Erde jetzt, Bahngeschwindigkeit jetzt |
| Hochschule | + Bahnelemente zur Epoche J2000 (a, e, i, Ω, ϖ, L samt Raten je Jahrhundert), Polrichtung (RA, Dec), geometrische Albedo, Bezugsebene der Bahn |

Für die Sonne entfallen Bahnzeilen; für Monde bezieht sich „Abstand zur Sonne"
weiterhin auf die Sonne und „Umlaufzeit" auf den Mutterkörper (Beschriftung
`info.umlaufUm` mit Name). Die Umlaufzeit folgt aus dem dritten Keplerschen Gesetz
mit der Masse des Mutterkörpers (`sim/orbit.ts`, neue Funktion `umlaufzeitTage`),
nicht aus einer Tabelle. Szenen- und Thementexte tragen keinen Datenblock; Szenen
zeigen stattdessen Ziel und Blickpunkt als Objektverweise.

**Nachtrag (4c-3):** Die Achsneigung ist die Schiefe gegen die eigene Bahn zur
Epoche J2000, gemessen an der Drehachse (bei rückläufiger Rotation über 90°, etwa
Venus 177,4°, Uranus 97,8°); nur die Sonne ohne Bahn bezieht sich auf die
Ekliptik. Umgesetzt als `achsneigungDeg` in `sim/orbit.ts`. Die erste Fassung
maß gegen die Ekliptik und zeigte etwa Merkur mit 7,0° und die Saturnmonde mit
rund 28°.

Außerhalb des Genauigkeitsfensters (`isOutOfRange`) steht am Ende des Datenblocks
der Warnsatz `info.ausserhalbFenster` mit Verweis `thema:modell`; der
Hochschul-Datenblock trägt diesen Verweis immer.

### 5.2 Live-Werte

Abstände und Bahngeschwindigkeit werden viermal je Sekunde aus `positionAt` und
`velocityAt` gerechnet, nicht je Bild. Hook `useLiveWerte(id)` in `ui/info/`:
liest `time.jd` über `useStore.subscribe` (kein Neuzeichnen je Bild), rechnet in
einem `setInterval` von 250 ms und legt das Ergebnis in `useState`. Bei
`time.paused` frieren die Werte ein; bei Sprachwechsel wird nur neu formatiert.

Einheiten nach Größenordnung: unter 1 Mio. km in km, sonst in Mio. km, ab 0,1 AE
zusätzlich in AE in Klammern; Geschwindigkeit in km/s mit einer Nachkommastelle.
Formatierung über `formatZahl`. Reine Funktion `formatAbstand(km)` in `ui/format.ts`
mit Tests.

### 5.3 Kamerafahrt

Neuer Baustein `ui/kamerafahrt.ts`, Funktion `fahreZu(id)`:

- Zielstellung wie heute im Objektbaum: `targetId`, `distance = max(scaledRadius ·
  FOKUS_FAKTOR, FOKUS_MIN_KM)`, `freezeJd` im freien Modus.
- Übergang über 1,5 s mit `easeInOutCubic` aus `ui/tween.ts`: `targetId` wird
  sofort gesetzt (die Bahn führt sonst am Ziel vorbei), `distance` interpoliert
  logarithmisch, `azimuth` und `elevation` bleiben.
- Eine Nutzereingabe (Pointer, Rad, Taste) bricht die Fahrt ab; ein weiterer Aufruf
  ersetzt die laufende Fahrt.
- Der Objektbaum ruft dieselbe Funktion, damit beide Wege gleich wirken.
- Läuft das Kino, wird es zuerst beendet (`setCinema({ running: false })`,
  `setCamera({ mode: 'free' })`).

## 6. Oberfläche und Texte

Neue Schlüssel in `de.ts`/`en.ts` (Auswahl): `info.title` („Info"), `info.tab.
grundschule/gymnasium/hochschule`, `info.neuerTab`, `info.keineQuellen`,
`info.nichtUebersetzt`, `info.keinText`, `info.hochschuleFolgt`,
`info.ausserhalbFenster`, `info.umlaufUm`, Beschriftungen der Datenblockzeilen
(`info.daten.durchmesser` …), `info.griff.breite`, `info.griff.teilung`,
`shortcuts.info`, Titel der Themen (`thema.<id>.title`). Die Tabelle `en.ts`
bekommt jeden Schlüssel gleichzeitig; `i18n.test.ts` prüft die Gleichheit der
Schlüsselmengen wie bisher.

Die vorhandenen `info.descriptionKey`-Felder der Körper bleiben ungenutzt und
werden in 4c-1 entfernt, damit kein toter Pfad bleibt (`Body.info` behält
`nameKey`).

## 7. Etappen

Jede Etappe hat einen eigenen Plan (`docs/superpowers/plans/`), eigene Commits und
ein eigenes Abnahmeprotokoll.

1. **4c-1 Gerüst:** Spalte, Griffe, Tabs, Zustand, Prüfer und Persistenz,
   Renderer, Lader, Verweisbehandlung, Quellenkarten, Datenblock, Live-Werte,
   Kamerafahrt, Taste `I`, Themenkatalog, Entfernen von `descriptionKey`. Als
   Nachweis je ein Text für Erde, Saturn und die Szene `mondfinsternis` in
   Grundschule und Gymnasium, beide Sprachen (zwölf Dateien), dazu das Thema
   `modell` in Gymnasium (zwei Dateien) und ein Katalog mit rund 20 Quellen.
2. **4c-2 Grundschule Körper:** 35 Texte Deutsch und Englisch.
3. **4c-3 Gymnasium Körper:** 35 Texte Deutsch und Englisch, Katalog auf rund 60
   Quellen.
4. **4c-4 Szenen und Themen:** 19 Szenen und 7 restliche Themen in beiden Niveaus
   und Sprachen, dazu das Thema `modell` in Grundschule.
5. Danach Tag `v0.4.0`. Die **Hochschulstufe** folgt als eigene Phase (Arbeitstitel
   4d) mit eigenem Entwurf, weil ihr Umfang offen ist.

Text-Etappen dürfen in Teilcommits laufen (etwa je Planetensystem), jeder Commit
mit grünem Verweis-Test.

**Nachtrag (14.09.2026, Jens):** Die Text-Etappen werden nach Niveau geschnitten,
nicht nach Art, damit jeder Tab ohne Sackgasse fertig wird (Befund der
Abschlussprüfung 4c-1: ein Verweis auf ein Thema ohne Text endet im Hinweis „kein
Text"). Punkt 2 bis 4 lauten seitdem:

2. **4c-2 Grundschule komplett:** 33 fehlende Körper und alle 8 Themen (auch
   `modell`) in Deutsch und Englisch, 82 Dateien; dazu `thema:`-Verweise in rund
   zehn Körpertexten (Mond, Saturn, Uranus, Venus, Pluto, Ceres, Eris). Abnahme:
   Auf dem Grundschul-Tab führt kein `objekt:`- oder `thema:`-Verweis auf „kein
   Text"; `szene:`-Verweise sind bis 4c-4 ausgenommen und werden im Protokoll
   getrennt gezählt (Präzisierung nach der Abschlussprüfung 4c-2, Plan Ruling 12).
3. **4c-3 Gymnasium komplett:** 33 Körper und 7 Themen in Deutsch und Englisch,
   Quellenkatalog auf rund 60 Quellen.
4. **4c-4 Szenen:** 19 Szenen in beiden Niveaus und Sprachen (`mondfinsternis`
   liegt seit 4c-1 vor), dazu der Dateitest „Themenziel hat Text im selben Niveau".

## 8. Tests

- `ui/info/markdown.test.ts`: Baumvergleich für jedes Element, Randfälle
  (Sternchen in Zahlen, Klammern im Linktext, fehlende Leerzeile vor Liste, HTML
  bleibt Text).
- `data/texte/verweise.test.ts`: alle Dateien, alle Verweise gegen die Kataloge;
  zusätzlich: erste Zeile ist eine `#`-Überschrift, Dateiname passt zum Muster,
  Wortzahl Grundschule ≤ 110 (weiche Obergrenze zum Richtwert 40 bis 80 Wörter),
  Gymnasium ohne Obergrenze. **Nachtrag (4c-3):** Die ursprünglichen Grenzen
  (Grundschule ≤ 100, Gymnasium ≤ 220) gelten nicht mehr; die Gymnasialgrenze
  entfällt mit dem Nachtrag zu §2 Punkt 4. Die Prüfung steht in
  `data/texte/dateien.test.ts`.
- `data/quellen.test.ts`: Kennungen eindeutig, URLs `https`, jedes `fuer`-Ziel
  existiert. **Nachtrag (4c-3):** Jeder Körper und jedes Thema hat mindestens eine
  Quelle (Abdeckungstest).
- `ui/info/datenblock.test.ts`: Erde bei J2000 rund 0,983 bis 1,017 AE zur Sonne,
  Bahngeschwindigkeit 29,3 bis 30,3 km/s, Umlaufzeit 365,2 ± 0,3 Tage; Mond
  Umlauf um die Erde 27,3 ± 0,2 Tage; Sonne ohne Bahnzeilen.
- `ui/format.test.ts`: `formatAbstand` an den Einheitengrenzen, beide Locales.
- `ui/info/InfoPanel.test.tsx`: Tabs per Pfeiltaste, Griffe per Tastatur ändern
  den Store innerhalb der Grenzen, Themenverweis setzt und Zielwechsel löscht
  `thema`, Hinweiszeilen bei fehlendem Text.
- `ui/kamerafahrt.test.ts`: Endzustand nach 1,5 s (gefälschte Zeit), Abbruch bei
  Eingabe, Kino wird beendet.
- `store/pruefer.test.ts`, `store/persist.test.ts`: neue Felder, Link führt nur
  `niveau`, Import einer Ansicht ohne `info` liefert Standardwerte.
- Schichtentests bleiben grün.

## 9. Abnahme (Sichtprüfung)

- Breitengriff: Screenshot vor und nach Ziehen um 200 px, gemessene Spaltenbreite
  in Pixeln; Teilungsgriff ebenso.
- Kamerafahrt: `performance.now()` und `camera.distance` in fünf Stützstellen über
  1,5 s protokollieren, monoton und am Ende gleich dem Objektbaum-Sprung.
- Verweise: Klick auf `objekt:`, `thema:` und `quelle:` mit Store-Abfragen
  danach; Mittelklick auf eine Quellenkarte öffnet einen zweiten Tab
  (`browser_tabs`).
- Live-Werte: zwei Abfragen im Abstand von 1 s bei laufender Uhr unterscheiden
  sich, bei Pause nicht.
- 400 px: Bogen von unten, eingeklappt; Konsole ohne Fehler und Warnungen.
- Lint, Test, Build mit Schlusszeilen.

## 10. Nicht-Ziele

- Keine Einbettung fremder Seiten (iframe).
- Keine Volltextsuche über die Texte.
- Keine Bilder in Texten (Lizenzpflege in `ASSETS.md` wäre ein eigener Aufwand).
- Kein Bearbeiten der Texte in der Oberfläche.
- Keine Hochschultexte in 4c; keine Formeln oder Tabellen im Renderer, bis die
  Hochschulphase den Bedarf zeigt.
- Keine dynamischen Tabs je sichtbarem Körper.
