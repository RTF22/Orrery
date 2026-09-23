# Abnahme Phase 5 Etappe 1 (Oberfläche)

## 1. Umfang

Branch `phase5-1` (von `master`, nach dem Commit des Plans `3756195`). Entwurf
`docs/superpowers/specs/2026-09-23-phase5-design.md` §3 (Etappe 5-1: Seitenleiste,
Überschriften, Szenenliste, nebenher Musikrecherche), Plan
`docs/superpowers/plans/2026-09-23-phase5-etappe1-oberflaeche.md`. Umsetzung:

- `74e5ab4` — Seitenleiste: Store-Feld für die Breite, Griff an der rechten Kante (Task 1)
- `e63dafa` — Seitenleiste: linke Spalte einklappbar und in der Breite ziehbar (Task 2)
- `605a03b` — Seitenleiste: Klemmung der Spaltenbreite gemeinsam mit dem Infopanel (Task 2,
  Fixrunde 1)
- `1d30e78` — Überschriften: gemeinsamer farbiger Stil für Panels und Infopanel (Task 3)
- `3cdc64a` — Kino: Szenenliste, ein Klick startet ab der gewählten Szene (Task 4)
- `1d72beb` — Musikauswahl: Vorschläge für Etappe 5-4 (Task 5)
- `65862ce` — Musikauswahl: Urheberangaben an der Quelle belegt (Task 5, Fixrunde 1)

Etappe 5-1 macht die linke Spalte (`ui/Seitenleiste.tsx`) wie das Infopanel einklappbar zu
einem Reiter und in der Breite ziehbar (14 bis 32 rem, wirksam gedeckelt auf 40 % der
Fensterbreite), gibt Panel- und Infopanel-Überschriften einen gemeinsamen farbigen Stil
(`ui/ueberschrift.ts`) und ersetzt die Zeile „Aktuelle Szene“ im Kino-Panel durch eine Liste
aller 19 Szenen, die per Klick das Kino ab der gewählten Szene startet
(`ui/cinemaControl.ts`, `naechsteNummerFuer`/`starteSzene`). Nebenher entstand die
Musikrecherche für Etappe 5-4 (`docs/phase5-musik-auswahl.md`).

## 2. Lint, Tests, Build

Auf `65862ce` (23.09.2026):

- `npm run lint`: `eslint .` ohne Befund.
- `npm test` (Endstand nach der Nacharbeit, §9):

  ```
  Test Files  103 passed (103)
       Tests  5174 passed (5174)
  ```

  Stand vor der Etappe: 5150. Herleitung laut Ledger: 5154 nach Task 1 (`74e5ab4`), 5159 nach
  Task 2 (`e63dafa`), 5163 nach der Fixrunde 1 zu Task 2 (`605a03b`, +4 durch `fenster.test.ts`),
  5165 nach Task 3 (`1d30e78`), 5173 nach Task 4 (`3cdc64a`). Task 5 (Musikrecherche, reines
  Dokument) ändert keine Testzahl; die Nacharbeit nach der Schlussprüfung (§9) ergänzt einen
  Test in `CinemaPanel.test.tsx`, macht 5174.
- `npm run build` (`tsc -b && vite build`): 532 Module, `✓ built in 1,07s`, Hauptchunk
  `index--lBcQu5R.js` **1 456,56 kB** (gzip 394,51 kB), nur der bekannte Hinweis zu Chunkgrößen
  über 500 kB (Katalog im Hauptbundle, offener Punkt aus der lokalen Projektanleitung, hier
  nicht behandelt). Stand vor der Etappe 1 453,78 kB, Grenze 1 503,78 kB (Entwurf §8.3) — Zuwachs
  rund 2,78 kB, deutlich unter der Grenze; die Nacharbeit ändert nur eine Testdatei und damit den
  Hauptchunk nicht.
- Wort- und Trailerprüfung aus der lokalen Projektanleitung für alle Commits und neuen
  Dateien dieser Etappe: Ergebnis 0.

## 3. Sichtprüfung

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als laufend
bestätigt, kein zweiter gestartet), Viewport 1008 × 615 CSS-Pixel, Pixeldichte 1. Direkt nach
jedem Navigieren `window.store.setState({ quality: { tier: 'high' } })`; vor jedem Screenshot
eine 3-s-Warteschleife über `performance.now()` (kein `browser_wait_for`), Uhr angehalten
(`setCinema({ running: false })` **und** `setTime({ paused: true })`), Store-Updates vor der
Messung mindestens 200 ms stehen gelassen. Konsole seit dem Laden: 0 Fehler, 0 Warnungen
(nur der übliche React-DevTools-Hinweis). Pixelmessungen mit Python 3.12 (Pillow, numpy).

| Nr. | Kriterium | Soll | Ist | erfüllt |
|---|---|---|---|---|
| 1 | Eingeklappt/versteckt: abweichende Pixel außerhalb der Reiter-Rechtecke (`getBoundingClientRect()` × dpr, 2 px Rand) | 0 | 0 von 3354 abweichenden Pixeln liegen außerhalb (alle in den beiden Reiter-Rechtecken); Kontrollaufnahme A gegen A: 0 | ja |
| 2a | Griff ziehen (+80 px, echte Maus): Store-Wert / gemessene Breite | 23 rem / 368 px | 23 rem / 368 px | ja |
| 2b | Griff per Tab fokussiert, Pfeil rechts: Breite / `time.rateDaysPerSec` | 24 rem / unverändert | 24 rem / 1 (unverändert, Griff schluckt die Pfeiltaste) | ja |
| 3 | Sitzung: Leiste 24 rem und eingeklappt, neu laden → nur Reiter; nach Öffnen 24 rem | erfüllt | erfüllt (siehe Anmerkung) | ja |
| 4 | Kontrast (vier Werte aus Task 3, ein Wert nachgemessen) | ≥ 4,5 : 1 | 11,56 / 12,01 / 6,91 / 8,07 (Task 3); Nachmessung Panel „Zeit“, Startansicht: 11,56 — exakt reproduziert | ja |
| 5 | Szenenliste: echter Klick startet Szene, `sceneIndexFor` bestätigt, Markierung ● an geklickter Zeile, Infopanel-Kopf mit Szenentitel | erfüllt | `cinema.running` true, `cinema.nummer` 3, `sceneIndexFor(3, 19, seed, shuffle)` = 8 = Index der geklickten Szene „Tiefflug über Phobos“; Marker „●“ und `aria-current="true"` an dieser Zeile; Infopanel-Kopf „Szene: Tiefflug über Phobos“ | ja |

**Zu Messung 1:** Der erste Versuch ließ das Infopanel offen und hielt dessen
halbdurchsichtigen Grund (`bg-slate-900/70`) fälschlich für einen Helligkeitsunterschied im
Himmel selbst — der Plan hatte vergessen, neben der Seitenleiste auch das Infopanel zu
schließen. Wiederholt mit beiden Spalten eingeklappt: A = `setUi({ panels: { ...panels,
leiste: false, info: false } })` (beide Reiter sichtbar, `ui.hidden` false), B =
`setUi({ hidden: true })`, dieselbe Ladung. Kontrollaufnahme (A gegen A ohne
Zustandsänderung): 0 abweichende Pixel. A gegen B: 3354 abweichende Pixel, ausnahmslos
innerhalb der beiden Reiter-Rechtecke (Leiste x=10–48/y=10–83, Infopanel x=960–998/y=10–46,
je 2-px-Rand) — außerhalb 0. Eine Renderer-Ursache gibt es damit nicht.

**Zu Messung 3:** Der erste Versuch scheiterte, weil die Einstellung „Sitzung merken“
(`localStorage`-Schlüssel `orrery.sitzungMerken`) auf diesem Arbeitsrechner von einer
früheren Sitzung aus noch ausgeschaltet war — kein Befund am Code, sondern eine Eigenheit
des Prüfrechners. Nach dem Zurücksetzen dieser einen Einstellung wurde die Messung wiederholt
und bestand: Nach dem Setzen von 24 rem und Einklappen (mit mindestens 1,3 s Wartezeit für die
gedrosselte Sicherung) zeigt ein echtes Neuladen zunächst nur den Reiter; nach dem Öffnen ist
die Leiste 24 rem (384 px) breit.

## 4. Barrierefreiheit und Tastatur

- **Griff** (`ui/info/Griff.tsx`, von der Seitenleiste mit `kante="rechts"` verwendet):
  `role="separator"`, `aria-orientation="vertical"`, `aria-valuenow`/`aria-valuemin`/
  `aria-valuemax`, `aria-label="Breite der Bedienleiste"`. Pfeil rechts vergrößert (Kante
  rechts), Pfeil links verkleinert, Pos1/Ende springen auf `min`/`max`; jeder Tastendruck ruft
  `preventDefault()` auf, bevor die globalen Kürzel greifen — in Messung 2b blieb
  `time.rateDaysPerSec` deshalb unverändert, obwohl Pfeiltasten sonst die Zeitraffung ändern.
- **Reiter** der eingeklappten Leiste: echter `<button>` mit `aria-expanded={false}` und
  `aria-label="Bedienung öffnen"`; die Schließen-Schaltfläche der geöffneten Leiste trägt
  `aria-expanded` (true) und `aria-label="Bedienung einklappen"` — dasselbe Muster wie beim
  Infopanel.
- **Szenenliste**: Die markierte Zeile trägt `aria-current="true"` (in Messung 5 bestätigt);
  der Marker ●/○ selbst steht in einem `aria-hidden`-Element und ist damit für Screenreader
  nicht zu hören — sie erfahren über `aria-current` nur, dass eine Zeile markiert ist, nicht
  ob das Kino läuft oder beim nächsten Start dort einsetzt. Das ist ein planvorgegebener,
  bereits im Ledger vermerkter Befund (siehe §7) und Gegenstand von Frage 3 in §8.
- Alle Panel-Kopfzeilen (`ui/panels/Panel.tsx`) sind echte `<button>` mit `aria-expanded`,
  Tastaturbedienung also ohne Zusatz-Markup.

## 5. Musikauswahl

`docs/phase5-musik-auswahl.md` enthält vier Vorschläge (Entwurf §2.5 erlaubte vier bis
sechs), alle von Chris Zabriskie, alle CC BY 4.0, jede Lizenz an der Quelle (Wikimedia
Commons, zusätzlich `chriszabriskie.com`/Bandcamp für die Urheberangabe) geprüft. Die Wahl
steht noch aus — Jens hört die vier Stücke und wählt vor Beginn von Etappe 5-4, siehe §8,
Frage 1.

## 6. Rulings

- **Ruling:** Umsetzer und Prüfer laufen auf sonnet (lokale Projektanleitung: möglichst
  kleine Modelle; haiku war in einer früheren Etappe an Regeltreue gescheitert) — kostet
  mehr als haiku, falls haiku für diese Etappe gereicht hätte.
- **Ruling:** Die wirksame Höchstbreite der Seitenleiste ist 40 % der Fensterbreite (aus dem
  Plan übernommen, wie beim Infopanel mit 60 %), damit beide Spalten bei schmalem Fenster
  nebeneinander Platz haben; sollte sich das als zu eng erweisen, ist es ein einzelner Wert
  in `Seitenleiste.tsx`.
- **Ruling** (Fixrunde 1 zu Task 2): Die Klemmformel der Breite wurde aus `Seitenleiste.tsx`
  und `InfoPanel.tsx` in eine gemeinsame Funktion `spaltenBreite()` in `ui/fenster.ts`
  gezogen. Der Plan hatte die Duplikation vorgeschrieben; drei Zeilen mit zwei Konstanten
  liefen sonst auseinander. Kostet einen kleinen Umbau im schon fachgeprüften
  Infopanel-Code, falls sich das als falsch erweist.
- **Ruling:** Die Testzahl-Mindestwerte der Folgetasks wurden um die vier neuen Tests aus
  `fenster.test.ts` (Fixrunde 1) verschoben — Task 3 mindestens 5165, Task 4 mindestens 5173;
  rein rechnerisch, ohne inhaltliche Wirkung.

Rulings dieser Abnahme:

- **Ruling:** Vor der Sitzungsmessung (3) wurde die lokale Einstellung „Sitzung merken“
  zurückgesetzt, weil sie von einer früheren Sitzung auf diesem Arbeitsrechner noch
  ausgeschaltet war; ohne diesen Schritt hätte die Messung fälschlich als nicht bestanden
  gegolten, obwohl der Code korrekt speichert.
- **Ruling:** Die Kontrast-Nachmessung (4) verwendet probeweise wieder 18 rem Leistenbreite
  (Standardbreite aus Task 3), damit das Messrechteck exakt mit dem Ledger-Wert
  deckungsgleich bleibt und die beiden Zahlen unmittelbar vergleichbar sind.
- **Ruling:** Messung 1 mit geschlossenem Infopanel wiederholt — der Plan hatte es
  vergessen. Der erste Versuch schloss nur die Seitenleiste; der scheinbare
  Helligkeitsunterschied war der halbdurchsichtige Grund des offen gebliebenen Infopanels,
  keine Eigenschaft des Renderers.

## 7. Bekannte Unschärfen

Aus dem Ledger (zurückgestellt, kein Merge-Hindernis):

- Task 1: `pruefer.test.ts` — der Test für `ui.leiste` sitzt im `describe`-Block `ui.info`
  (planvorgegeben).
- Task 2: Kein Test deckt „schmaler Bildschirm → kein Griff“ ab.
- Task 4: Marker ●/○ der Szenenliste ist `aria-hidden`; der Zustand „läuft“ gegenüber
  „nächster Start“ ist für Screenreader nur über `aria-current` zu erschließen, ohne
  Unterscheidung (planvorgegeben, siehe §4 und §8 Frage 3).
- Task 5: Alle vier Commons-Seiten der Musikvorschläge tragen die Kategorie „License review
  needed (audio)“ (Bot-Import aus dem Free Music Archive); die Lizenz ist zusätzlich an der
  Seite des Künstlers bzw. bei Bandcamp bestätigt (siehe §8 Frage 1).
- Task 5: Die Formatspalte zu Stück 1 nennt keine OGG-Bitrate des Originals bei Wikimedia
  Commons (dort ohnehin nur die verlustbehaftete Fassung).

## 8. Fragen an Jens

1. **Musikauswahl:** Alle vier Vorschläge stammen vom selben Urheber (Chris Zabriskie, CC BY
   4.0); kein CC0-Stück ist dabei, obwohl der Entwurf es bevorzugt. Stück 1 liegt bei
   Wikimedia Commons nur als 170-kbit/s-MP3 vor (Original Ogg Vorbis 150 kbit/s, 4,73 MB,
   laut der Wikimedia-Commons-Dateiseite von Stück 1, gelesen bei der Quellenprüfung der
   Musikauswahl am 23.09.2026) — das Kriterium verlangte verlustfrei oder MP3 ab 192 kbit/s. Anfang und Ende der Stücke wurden
   nicht abgehört (kein Wiedergabewerkzeug in der Recherche verfügbar). Alle vier
   Commons-Seiten tragen die Kategorie „License review needed (audio)“ aus dem automatischen
   Import vom Free Music Archive; die Lizenz ist aber zusätzlich an der Seite des Künstlers
   bzw. bei Bandcamp bestätigt. Bitte hör dir die vier Stücke in `docs/phase5-musik-auswahl.md`
   an und wähle, oder beauftrage eine weitere Suche.
2. **Debussy „Clair de lune“:** Eine passende Klavieraufnahme (CC BY 3.0, Wikimedia Commons,
   inhaltlich alle Kriterien erfüllt) wurde nicht in die Musikliste aufgenommen, weil der
   volle Vorname des Komponisten in der Wortprüfung der lokalen Projektanleitung dieselbe
   Zeichenfolge trifft wie der Name des hier verwendeten Werkzeugs — deshalb steht in diesem
   Protokoll und in der Recherche nur „Debussy“. Soll die Wortprüfung für solche Eigennamen
   eine Ausnahme bekommen, damit das Stück regulär aufgenommen werden kann?
3. **Barrierefreiheit der Szenenliste:** Der Marker ●/○ ist `aria-hidden`; Screenreader
   unterscheiden „läuft“ und „nächster Start“ nicht, nur `aria-current` markiert überhaupt
   eine Zeile. Jetzt nachbessern (eigener kleiner Task) oder in Etappe 5-2 mitnehmen, die
   sich ohnehin mit Bedienzielen und Zugänglichkeit befasst?

## 9. Nacharbeit nach der Schlussprüfung

Schlussprüfung: Branch bereit zum Zusammenführen, drei kleine Punkte.

1. **Test (Important):** `src/ui/panels/CinemaPanel.test.tsx` deckte vom Review-Punkt „Keim
   oder Mischen geändert → Markierung folgt sofort“ nur die Keim-Hälfte ab; der Mischen-Fall
   fehlte. Ergänzt direkt danach: `running: true, nummer: 4, shuffle: true`, Klick auf
   „Szenen mischen“, danach `cinema.shuffle` false und die Markierung weiterhin auf dem
   Katalogeintrag 4 (ohne Mischen ist Nummer 4 der Katalogeintrag 4). Lauf `npx vitest run
   src/ui/panels/CinemaPanel.test.tsx`: 9 Tests bestanden (vorher 8). Ergebnis: behoben,
   Testzahl insgesamt 5174 (§2).
2. **Protokoll (Important):** §2 nannte bislang nicht, dass die Wort- und Trailerprüfung aus
   der lokalen Projektanleitung für alle Commits und neuen Dateien dieser Etappe gelaufen ist.
   Ergänzt als eigener Satz in §2, Ergebnis 0.
3. **Protokoll (Quelle):** §8 Frage 1 nannte für Stück 1 „Original Ogg Vorbis 150 kbit/s“ ohne
   Quelle. Die Zahl war richtig; ergänzt wurde die Quelle (Wikimedia-Commons-Dateiseite von
   Stück 1, Ogg Vorbis, 150 kbit/s, 4,73 MB, gelesen bei der Quellenprüfung der Musikauswahl
   am 23.09.2026).

Als geparkt aus der Schlussprüfung (Minor, kein Merge-Hindernis):

- Die Szenenknöpfe tragen `title` statt `aria-label`; unschädlich, weil der sichtbare Text
  der Zeile ohnehin den Namen liefert (Screenreader lesen den Textinhalt des Buttons).
- Die Kästchen im Plan (`docs/superpowers/plans/2026-09-23-phase5-etappe1-oberflaeche.md`)
  sind nicht abgehakt; maßgeblich für den Stand der Etappe ist das Ledger
  (`.superpowers/sdd/2026-09-23-phase5-etappe1-oberflaeche/progress.md`), nicht die
  Kästchen im Plan.

Prüfläufe nach der Nacharbeit: `npm run lint` ohne Befund, `npm test` 5174 bestanden,
`npm run build` unverändert 1 456,56 kB (eine Testdatei ändert den Hauptchunk nicht). Beide
Prüfungen (Trailer der Commit-Nachricht, Wortprüfung der geänderten Dateien) ergaben 0.
