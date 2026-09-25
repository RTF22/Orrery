# Abnahme Info-Karte

## 1. Umfang

Entwurf `docs/superpowers/specs/2026-09-25-infokarte-design.md` (25.09.2026), Plan
`docs/superpowers/plans/2026-09-25-infokarte.md`. Die Info-Karte bringt ein Overlay mit
Kurzanleitung zur Einrichtung als App, zur Bedienung und mit Verweis auf Repository und
Lizenzinfo, dazu (Nachtrag Entwurf § 7) eine eigene Karte „Steuerung“ mit Controllergrafik
und ein Hilfe-Knopf am Handy. Sie schließt Phase 6 (Tag `v0.7.0`) an und endet mit Tag
`v0.7.1`. Commits auf dem Branch `infokarte`, dazu dieses Protokoll:

- **Gerüst** (`285be98`, Korrektur `3734c87`): eigener Store `useInfoKarte` (offen, Reiter),
  Dialog mit drei leeren Reitern („App“, „Bedienung“, „Über“), Knopf ⓘ in der Kopfzeile,
  Schließen über ✕/Escape/Hintergrund, Fokus beim Öffnen auf den aktiven Reiter und
  Fokusrückgabe beim Schließen (auch nach einem Wechsel von `ui.hidden`, an derselben,
  stabilen Stelle im Baum), automatisches Öffnen beim ersten Besuch, Kürzelsperre bei
  offener Karte, Zeichnen unabhängig von `ui.hidden` und der Kino-Ruhe.
- **Inhalte** (`74fc760`): die drei Reiter in Deutsch und Englisch, Erkennung des laufenden
  App-Modus, Installationsknopf (`useInstallation` in `src/ui/infokarte/installation.ts`,
  Abfangen des Browser-Ereignisses mit `prompt()` und `userChoice`), Anzeige der
  Versionsnummer aus `package.json` (jetzt `0.7.1`).
- **Messung und dieses Protokoll**: Messungen im Browser gegen die Zielwerte aus Entwurf §3
  („Kein Scrollen“) und Plan, Handprüfliste für Jens. Dabei wurde der Entwurf §4.3
  nachgeführt: Die Version steht als „Version“ mit der Zahl aus `package.json` (Beispiel
  „Version 0.7.1“), ohne das dort ursprünglich vorgesehene „v“-Präfix — deckungsgleich mit
  dem umgesetzten Code (siehe § 6).
- **Steuerung und Hilfe-Knopf** (`1013fa9`, Korrektur `7a3e727`; Grafik `7a888da`; deckender
  Hintergrund `1590a3f`): Nachtrag zu Entwurf und Plan (§7, Jens 25.09.2026) nach der ersten
  Handprüfung. Die vorherige Korrektur `2458ffa` (Tastenübersicht ins Bild holen, im Panel der
  Seitenleiste) wurde mit dem Wegfall dieses Panels gegenstandslos. Das Panel „Tastenkürzel“ in
  der Seitenleiste entfällt, sein Feld
  `ui.panels.shortcuts` bleibt in alten gespeicherten Sitzungen ohne Wirkung liegen. Der
  Rahmen der Info-Karte (Reiter, Fokus, Fokusfalle, Escape, Hintergrund) wandert in den
  gemeinsamen Baustein `ui/karte/Kartendialog.tsx`; darauf baut die neue Karte „Steuerung“
  mit den Reitern „Tastatur“ (bisherige Liste, `M` nur mit Musik des Betreibers) und
  „Controller“ (selbst gezeichnete SVG-Grafik, Standardbelegung, vierzehn beschriftete
  Knöpfe, dieselbe Belegung zusätzlich als unsichtbare Liste für Screenreader). Öffnen über
  Taste `?` oder den Knopf „Alle Tastenkürzel und Controller“ in der Info-Karte, der dabei
  schließt; höchstens eine Karte ist offen, die Tastenkürzel sind dann gesperrt. Im
  Kompaktmodus öffnet ein runder Hilfe-Knopf „?“ oben rechts (44 × 44 px) die Info-Karte; am
  Schreibtisch bleibt ⓘ in der Kopfzeile. Beide Karten haben seither einen deckenden statt
  durchscheinenden Hintergrund.
- **Messung dieses Nachtrags**: Messungen der Steuerungskarte und des Hilfe-Knopfs gegen
  Entwurf §7 (siehe § 3.3), Handprüfliste ergänzt.
- **Kartensperre und Anführungszeichen**: `steuerungTakt` (`src/ui/steuerung/anwenden.ts`)
  fragt wie `handleShortcut` ab, ob die Info- oder die Steuerungskarte offen ist. Bei offener
  Karte bewegt und dreht sich nichts, es wird nicht gezoomt, Pad-Aktionen (A, B, Kürzeltasten)
  bleiben aus und ein sichtbares Fadenkreuz wird ausgeblendet; Pad-B schließt dabei die offene
  Karte wie die übliche Zurück-Taste, ohne im selben oder im folgenden Bild mit weiter
  gehaltenem B zusätzlich `fahreZuSystem` auszulösen. Sechs neue Tests in `anwenden.test.ts`.
  Dazu acht mit geradem Anführungszeichen geschlossene Zitate auf „…“ vereinheitlicht
  (`ui/karte/Kartendialog.tsx`, `ui/steuerkarte/SteuerKarte.tsx`, `ui/steuerkarte/zustand.ts`,
  `ui/HilfeKnopf.tsx`, `ui/App.test.tsx`).
- **ⓘ in der Sprachzeile** (`f8adc75`, Befund aus Jens' Handprüfung am Desktop: „das
  i-Symbol für Info und Hilfe ist am PC viel zu klein“): Die Kopfzeile hat zwei feste Zeilen,
  oben „Link kopieren“, „Zurücksetzen“ und die Statusmeldung, unten links ⓘ und rechts der
  Sprachschalter. Der Knopf teilt die Grundform der Sprachknöpfe (Rahmen, Abstände, fett,
  Deckkraft wie ein nicht gewählter Sprachknopf) und zeigt ein „i“ im Kreis mit 16 px
  Durchmesser statt des Zeichens ⓘ. Gemessen bei 1600 × 900: Knopf 34 × 22 CSS-px, gleiche
  Höhe und Oberkante (y = 43) wie DE und EN, Kopfzeile unverändert 58 px hoch. Ein neuer Test
  prüft Lage und Klassen. Entwurf § 3 nachgeführt.

## 2. Zahlen

| Größe | Vorher (master `78ee0b8`) | Nach Messung (`984699b`) | Nach Steuerung/Hilfe-Knopf (`1590a3f`) | Nach Kartensperre | Nach ⓘ-Umzug (`f8adc75`) |
|---|---:|---:|---:|---:|---:|
| Tests | 5328 | 5354 | 5364 | 5370 | 5371 |
| Hauptchunk | 1 531,36 kB | 1 543,51 kB | 1 548,56 kB | 1 548,89 kB | 1 549,24 kB |

Die Spalte „Nach Steuerung/Hilfe-Knopf“ stammt aus einem frischen Durchlauf von `npm test` und
`npm run build` beim Schreiben dieses Protokolls; dieser Schritt selbst änderte keinen
Quelltext, die Werte sind gegenüber dem Stand nach dem deckenden Hintergrund (`1590a3f`)
unverändert. Die letzte Spalte stammt aus einem ebensolchen Durchlauf nach der Kartensperre und
den Anführungszeichen-Korrekturen (sechs neue Tests in `anwenden.test.ts`, siehe § 1).

## 3. Messungen im Browser

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als laufend
bestätigt, kein zweiter gestartet). Je Fall ein eigener Browser-Kontext
(`page.context().browser().newContext({ viewport, deviceScaleFactor, isMobile, hasTouch })`),
neue Seite sofort `bringToFront()`. Je Kontext: Seite laden, `orrery.infokarte.gesehen.v1` aus
`localStorage` entfernen, neu laden (die Karte öffnet dann von selbst). Reiterwechsel durch
Klick auf `[role="tab"]` **innerhalb** des Dialogs (`[role="dialog"] [role="tab"]`) — ein
zunächst ungebunden auf das ganze Dokument angewandter Selektor hätte auf dem Desktop
zusätzlich die gleichnamigen Reiter des Infopanels (Grundschule/Gymnasium/Hochschule)
getroffen; das wurde während der Messung bemerkt und vor der Auswertung richtiggestellt. Nach
jedem Sprach- oder Reiterwechsel 200 ms gewartet, dann:

```js
const inhalt = document.querySelector('[data-testid="infokarte-inhalt"]');
const karte = document.querySelector('[role="dialog"]').getBoundingClientRect();
({ scroll: inhalt.scrollHeight, sichtbar: inhalt.clientHeight,
   imBild: karte.top >= 0 && karte.left >= 0 && karte.bottom <= innerHeight && karte.right <= innerWidth });
```

### 3.1 Kein Scrollen: 4 Viewports × 2 Sprachen × 3 Reiter

Startreiter je Fall (vor jedem Wechsel notiert): A55 hoch und A55 quer (Touch) „App“, Desktop
klein und Desktop groß (Maus) „Bedienung“ — deckungsgleich mit der Vorhersage (grober Zeiger →
„App“, sonst „Bedienung“).

| Fall | Sprache | Reiter | scroll | sichtbar | imBild | Ergebnis |
|---|---|---|---:|---:|---|---|
| A55 hoch (412×915, dsf 2,625, Touch) | de | App | 217 | 217 | ja | erfüllt |
| A55 hoch | de | Bedienung | 166 | 166 | ja | erfüllt |
| A55 hoch | de | Über | 273 | 273 | ja | erfüllt |
| A55 hoch | en | App | 217 | 217 | ja | erfüllt |
| A55 hoch | en | Bedienung | 166 | 166 | ja | erfüllt |
| A55 hoch | en | Über | 273 | 273 | ja | erfüllt |
| A55 quer (915×412, dsf 2,625, Touch) | de | App | 140 | 140 | ja | erfüllt |
| A55 quer | de | Bedienung | 146 | 146 | ja | erfüllt |
| A55 quer | de | Über | 215 | 215 | ja | erfüllt |
| A55 quer | en | App | 140 | 140 | ja | erfüllt |
| A55 quer | en | Bedienung | 146 | 146 | ja | erfüllt |
| A55 quer | en | Über | 215 | 215 | ja | erfüllt |
| Desktop klein (1280×720, dsf 1) | de | App | 140 | 140 | ja | erfüllt |
| Desktop klein | de | Bedienung | 303 | 303 | ja | erfüllt |
| Desktop klein | de | Über | 234 | 234 | ja | erfüllt |
| Desktop klein | en | App | 140 | 140 | ja | erfüllt |
| Desktop klein | en | Bedienung | 303 | 303 | ja | erfüllt |
| Desktop klein | en | Über | 234 | 234 | ja | erfüllt |
| Desktop groß (2560×1440, dsf 1) | de | App | 140 | 140 | ja | erfüllt |
| Desktop groß | de | Bedienung | 303 | 303 | ja | erfüllt |
| Desktop groß | de | Über | 234 | 234 | ja | erfüllt |
| Desktop groß | en | App | 140 | 140 | ja | erfüllt |
| Desktop groß | en | Bedienung | 303 | 303 | ja | erfüllt |
| Desktop groß | en | Über | 234 | 234 | ja | erfüllt |

Alle 24 Fälle: `scroll ≤ sichtbar` (hier durchweg mit Gleichheit) und `imBild === true`.

Zusätzlich der Reiter „App“ mit sichtbarem Installationsknopf (Attrappe für
`useInstallation.ereignis` über `import('/Orrery/src/ui/infokarte/installation.ts')` gesetzt),
Deutsch:

| Fall | Reiter | scroll | sichtbar | imBild | Ergebnis |
|---|---|---:|---:|---|---|
| A55 hoch | App mit Knopf | 259 | 259 | ja | erfüllt |
| A55 quer | App mit Knopf | 182 | 182 | ja | erfüllt |

### 3.2 Verhalten

| Prüfung | Ist | Ergebnis |
|---|---|---|
| Escape schließt die beim ersten Besuch automatisch geöffnete Karte | Dialog nach Escape verschwunden | erfüllt |
| Merkmal `orrery.infokarte.gesehen.v1` nach dem Schließen | `'1'` | erfüllt |
| Neuladen danach: Karte bleibt zu | kein Dialog nach Neuladen | erfüllt |
| Laufendes Kino (`cinema.running:true`, `camera.mode:'cinema'`), Karte über ⓘ geöffnet, dann Escape: Karte schließt | kein Dialog nach Escape | erfüllt |
| … Kino läuft danach weiter | `cinema.running === true` | erfüllt |
| Link mit Fragment `#p=…` (per `encodeState` erzeugt) bei leerer Ablage: Karte bleibt zu | kein Dialog nach dem Laden | erfüllt |
| Klick auf „Quellcode auf GitHub“ im Reiter „Über“ öffnet eine neue Seite im Kontext | Seitenzahl 1 → 2, Ziel `https://github.com/RTF22/Orrery` | erfüllt |
| … die Orrery-Seite bleibt unverändert | URL weiterhin `http://localhost:5173/Orrery/` | erfüllt |
| Konsole über den ganzen Ablauf (Verhalten und alle vier Geräte-Fälle aus § 3.1) | 0 Fehler, 0 Warnungen | erfüllt |

### 3.3 Steuerung und Hilfe-Knopf (Entwurf § 7)

Gleicher Aufbau wie § 3.1/§ 3.2: je Viewport ein eigener Kontext
(`newContext({ viewport, deviceScaleFactor, isMobile, hasTouch })`), neue Seite sofort
`bringToFront()`. Vor jedem Laden wurde `orrery.infokarte.gesehen.v1` per `addInitScript`
gesetzt, damit die Info-Karte nicht automatisch vor der Steuerungskarte aufgeht. Die Taste
`?` öffnete die Steuerungskarte in allen vier Sprach-/Viewport-Fällen unmittelbar, ohne den
in den Hinweisen vorgesehenen Rückgriff auf `zustand.ts`. Reiterwechsel durch Klick auf den
zweiten `[role="dialog"] [role="tab"]`, nach jedem Wechsel 200 ms gewartet, dann wie in § 3.1
an `[data-testid="steuerkarte-inhalt"]` gemessen.

**Kein Scrollen: 2 Viewports × 2 Sprachen × 3 Reiter-Fälle (12)**

| Viewport | Sprache | Reiter | scroll | sichtbar | imBild | Ergebnis |
|---|---|---|---:|---:|---|---|
| Desktop klein (1280×720, dsf 1) | de | Tastatur ohne Musik | 392 | 392 | ja | erfüllt |
| Desktop klein | de | Tastatur mit Musik | 415 | 415 | ja | erfüllt |
| Desktop klein | de | Controller | 383 | 383 | ja | erfüllt |
| Desktop klein | en | Tastatur ohne Musik | 392 | 392 | ja | erfüllt |
| Desktop klein | en | Tastatur mit Musik | 415 | 415 | ja | erfüllt |
| Desktop klein | en | Controller | 383 | 383 | ja | erfüllt |
| Desktop groß (2560×1440, dsf 1) | de | Tastatur ohne Musik | 392 | 392 | ja | erfüllt |
| Desktop groß | de | Tastatur mit Musik | 415 | 415 | ja | erfüllt |
| Desktop groß | de | Controller | 383 | 383 | ja | erfüllt |
| Desktop groß | en | Tastatur ohne Musik | 392 | 392 | ja | erfüllt |
| Desktop groß | en | Tastatur mit Musik | 415 | 415 | ja | erfüllt |
| Desktop groß | en | Controller | 383 | 383 | ja | erfüllt |

Alle zwölf Fälle: `scroll ≤ sichtbar` (hier durchweg mit Gleichheit) und `imBild === true`. An
beiden Desktop-Viewports lieferte `document.querySelectorAll('.hilfeknopf')` 0 Treffer.

**Beschriftungen der Controllergrafik**

Rechtecke aller `[role="dialog"] svg > text` (`getBoundingClientRect`, inklusive
`tspan`-Zeilen); zwei gelten als überlappend, wenn sich ihre Rechtecke mit positiver Fläche
schneiden (`a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom`);
zusätzlich die Lage innerhalb des `svg`-Rechtecks geprüft.

| Viewport | Sprache | Beschriftungen | außerhalb der Grafik | Überlappungen | Ergebnis |
|---|---|---:|---:|---:|---|
| Desktop klein | de | 14 | 0 | 0 | erfüllt |
| Desktop klein | en | 14 | 0 | 0 | erfüllt |
| Desktop groß | de | 14 | 0 | 0 | erfüllt |
| Desktop groß | en | 14 | 0 | 0 | erfüllt |

Screenshots bei 1280×720 je Sprache angesehen: Die Grafik steht mittig, alle vierzehn Linien
enden sichtbar an den zugehörigen Knöpfen (linke Schultertaste/Trigger LT/LB mit Zusatzzeile,
Ansicht-Taste, linker Stick mit Zusatzzeile, Steuerkreuz oben/seitlich/unten; rechte
Schultertaste/Trigger RT/RB, Menü-Taste, Y/B/A, rechter Stick mit Zusatzzeile). X, das
Drücken des linken Sticks und die Mitteltaste bleiben wie im Entwurf vorgesehen
unbeschriftet.

**Hilfe-Knopf am Handy** (A55, `deviceScaleFactor` 2,625, `isMobile`/`hasTouch`)

| Fall | Rechteck | im Bild | Überschneidung ohne Bogen | Überschneidung mit Bogen „Bedienung“ | Tippen öffnet Info-Karte | Ergebnis |
|---|---|---|---|---|---|---|
| A55 hoch (412×915) | 44 × 44 CSS-px, rechts oben | ja | keine (Reiter „Bedienung“/„Info“ ab y = 859) | keine (Bogen beginnt bei y = 411,75) | ja | erfüllt |
| A55 quer (915×412) | 44 × 44 CSS-px, rechts oben | ja | keine (Reiter ab y = 356) | keine (Bogen endet bei x = 384, Hilfe-Knopf ab x = 859) | ja | erfüllt |

Am Desktop (1280×720) bestätigt, dass `.hilfeknopf` nicht existiert (siehe oben).

Konsole über den gesamten Ablauf dieses Abschnitts (alle 12 Scroll-Fälle, 4
Beschriftungsmessungen, beide Handy-Fälle): 0 Fehler, 0 Warnungen.

## 4. Lizenz

Entfällt: keine neuen Fremddateien. Die Lizenzangaben im Reiter „Über“ (Texturen, Sternkatalog,
Himmelskarte, Verweis auf `ASSETS.md`) sind Text aus den Inhalten (`74fc760`), nicht Gegenstand
dieses Schritts.

## 5. Handprüfung (Jens)

| Prüfpunkt | Ergebnis |
|---|---|
| A55: Karte beim ersten Aufruf (privates Fenster oder Websitedaten gelöscht) | ohne Befund (Jens, 25.09.2026: „sieht gut aus auf dem A55“) |
| A55: Installation über Knopf bzw. Menü, Start vom Symbol zeigt „läuft als App“ | ohne Befund (Jens, 25.09.2026: „sieht gut aus auf dem A55“) |
| A55: Links öffnen neuen Tab, Karte ohne Scrollen hoch und quer | ohne Befund (Jens, 25.09.2026: „sieht gut aus auf dem A55“) |
| Desktop: ⓘ, Reiter, Escape | ohne Befund (Jens, 25.09.2026); ⓘ war zu klein, seither in der Sprachzeile (§ 1) |
| Desktop: Taste `?` und Knopf in der Info-Karte öffnen „Steuerung“; Reiter Tastatur/Controller | ohne Befund (Jens, 25.09.2026) |
| Desktop: Controllergrafik verständlich, Beschriftungen passen zu den Knöpfen | ohne Befund (Jens, 25.09.2026) |
| A55: „?“-Knopf oben rechts, öffnet die Info-Karte, stört nicht | ohne Befund (Jens, 25.09.2026: „sieht gut aus auf dem A55“) |

## 6. Rulings

- **Ruling (Gerüst):** Die Rückgabeform von `App.tsx` wechselte bei offener Karte zwischen
  zwei verschiedenen Baumformen, wodurch die Info-Karte bei einem Wechsel von `ui.hidden`
  neu gemountet wurde und die Fokusrückgabe verlorenging. Entschieden wurde, den Befund sofort
  zu beheben statt ihn zurückzustellen: `App` gibt jetzt immer dieselbe Form zurück (ein
  Fragment mit einer bedingten Oberflächenebene und der Info-Karte stets an derselben festen
  Stelle), dazu ein Test für den Live-Übergang (Karte offen, dann `ui.hidden` gesetzt: Dialog
  bleibt dasselbe Element, Fokus kehrt zurück).
- **Ruling (Gerüst):** Die Erweiterung der Ausnahmeliste für gleichlautende Übersetzungen um
  `infokarte.titel` und `infokarte.reiter.app` wurde nachträglich gebilligt — „Orrery“ und
  „App“ sind in beiden Sprachen gleich geschrieben.
- **Ruling (Inhalte):** Die Anzeige „Version 0.7.1“ bleibt ohne „v“-Präfix — „Version v0.7.1“
  wäre doppelt gemoppelt. Der Entwurf wird in diesem Protokoll-Schritt auf die umgesetzte
  Fassung angeglichen (§ 4.3, siehe § 1).
- **Ruling (Inhalte):** Die Erweiterung der Ausnahmeliste für gleichlautende Übersetzungen um
  `infokarte.ueber.version` wurde gebilligt — „Version“ ist in beiden Sprachen gleich
  geschrieben.
- **Ruling (Schlussprüfung):** Beide Important-Befunde der Schlussprüfung — der Hintergrund
  hinter der offenen Karte blieb für Screenreader im Lesemodus erreichbar statt stillgelegt;
  die Fokusrückgabe griff auch auf einen inzwischen entfernten Auslöser zu (erreichbar nur über
  die Kino-Ruhe, da H bei offener Karte gesperrt ist) — wurden in einer Korrekturwelle
  zusammen mit den günstigen Kleinbefunden behoben: Anführungszeichen im Protokoll und in
  `InfoKarte.tsx` vereinheitlicht, `ExternerLink` unterstreicht jetzt dauerhaft, die
  `matchMedia`-Attrappe der Inhalte-Tests wird wiederhergestellt, der ins Leere laufende
  Verweis „siehe § 6“ beim Selektorfehler entfernt. Das fehlende `aria-orientation` der
  Reiterleiste im Querformat und der z-Index des Fadenkreuzes über der Karte bleiben
  zurückgestellt (nur die Sprachausgabe betroffen bzw. kaum erreichbar, ohne Wirkung auf die
  Bedienung).
- **Ruling (Handprüfung, zwischenzeitlich überholt):** Nach dem ersten Handprüfungsbefund —
  der Knopf „Alle Tastenkürzel und Controller“ zeigte keine sichtbare Wirkung, weil die
  Übersicht am Ende der langen Seitenleiste stand — sollte sie sich beim Einblenden zunächst
  ins Bild scrollen und ihre Kopfzeile fokussieren (`2458ffa`). Jens entschied sich
  stattdessen für eine eigene Karte „Steuerung“ mit Controllergrafik und einen Hilfe-Knopf am
  Handy (25.09.2026, Entwurf § 7); die Korrektur `2458ffa` und der dazu zurückgestellte
  Startsprung sind damit gegenstandslos.
- **Ruling (Kartenwechsel):** Der Prüfbefund zum Wechsel von der Info-Karte zur Steuerungskarte
  (fehlender Test für die Fokuskette) und der doppelt vergebene Schließen-Schlüssel wurden
  gemeinsam behoben: ein Szenariotest in `App.test.tsx`, der Schlüssel neutral als
  `karte.schliessen` für beide Karten.
- **Ruling (deckender Hintergrund):** Bei der Sichtprobe der Controllergrafik schien die
  Seitenleiste durch die Karte; der Hintergrund beider Karten wurde daraufhin deckend
  gestellt (`bg-slate-900` statt teiltransparent), eine einzeilige Änderung in
  `Kartendialog.tsx`.
- **Ruling (Wortwahl § 7):** Offene Punkte, die zwischenzeitlich behoben wurden, tragen dort nur
  noch das sachliche Präfix „Behoben:“ statt einer Formulierung wie „in dieser
  Korrekturwelle“ — außerhalb von § 6 bleibt jede Prozesssprache untersagt.
- **Ruling (Kartensperre auch für Controller und Flugtasten, B schließt die Karte):**
  `handleShortcut` sperrte die Tastenkürzel bei offener Info- oder Steuerungskarte, aber
  `steuerungTakt` fragte die Karten nicht ab: Stick und WASD flogen weiter, LB drehte, RT/LT
  zoomten, Pad-A fuhr per `fahreZu`, Pad-B rief `fahreZuSystem`, und das Fadenkreuz erschien
  über der Karte. Entschieden wurde, die Sperre auf `steuerungTakt` auszuweiten: Bei offener
  Karte bewegt und dreht sich nichts, es wird nicht gezoomt, Pad-Aktionen bleiben aus und ein
  sichtbares Fadenkreuz wird ausgeblendet. Ausnahme: Pad-B schließt die offene Karte wie die
  übliche Zurück-Taste, sonst bliebe ein Controller-Nutzer darin gefangen; die schließende
  B-Flanke selbst löst dabei nie zusätzlich `fahreZuSystem` aus, auch nicht im folgenden Bild
  mit weiter gehaltenem B.
- **Ruling (Steuerungskarte ohne Tastatur):** Ein Touch-Gerät mit gekoppeltem Controller, aber
  ohne Tastatur, erreicht die Steuerungskarte nicht — es gibt dort kein `?`, und der Reiter
  „Bedienung“ der Info-Karte zeigt in diesem Fall nur die Gesten. Ein eigener Weg dorthin ist
  nicht Teil dieser Korrektur; der Befund bleibt offen (§ 7).

## 7. Offene Punkte

- `geraet.ts` hat keinen eigenen Test; die Fallunterscheidungen (App-Modus, grober Zeiger)
  werden bislang nur mittelbar über die Reiter-Tests der Inhalte mitgeprüft.
- Das Zeichen „✕“ für den Schließen-Knopf steht als Symbolliteral im Code und ist nicht in der
  dafür vorgesehenen Ausnahmeliste genannt; sein zugänglicher Name kommt aus der
  Übersetzungsdatei.
- Die Reiterleiste trägt im Querformat mit geringer Höhe (dort stehen die Reiter seitlich statt
  oben) kein `aria-orientation="vertical"`; nur die Sprachausgabe betroffen.
- Behoben: Das Fadenkreuz konnte bei gleichem z-Index über der Karte liegen; `steuerungTakt`
  blendet ein sichtbares Fadenkreuz jetzt aus, sobald die Info- oder die Steuerungskarte offen
  ist (Kartensperre, § 6).
- Blendet die Kino-Ruhe die Oberfläche samt Kopfzeile aus, während die Karte über ⓘ offen ist,
  kehrt der Fokus beim Schließen nicht mehr zum ⓘ-Knopf zurück — der Knopf ist dann nicht mehr
  im DOM; der Fokus bleibt stattdessen beim Dokument.
- Behoben: `ExternerLink` unterstrich den Linktext nur beim Überfahren mit der Maus statt
  dauerhaft wie der übrige Bestand; die `matchMedia`-Attrappe in den Inhalte-Tests wurde nach
  dem jeweiligen Test nicht zurückgesetzt.
- Die Unterstreichung von `ExternerLink` nutzt keine `decoration-sky-300/50`; die Deckkraft
  weicht optisch vom übrigen Bestand ab.
- Ein Touch-Gerät mit gekoppeltem Controller, aber ohne Tastatur, erreicht die Steuerungskarte
  nicht (kein `?`, und der Reiter „Bedienung“ zeigt dort nur Gesten).
- Bei offener Karte bleiben die Merker `lbVorher` und `padGesperrt` in `steuerungTakt`
  eingefroren: Wird LB bei offener Karte losgelassen und der Stick dabei ausgelenkt gehalten,
  bleiben Stick und Trigger nach dem Schließen wirkungslos, bis der Stick einmal in der Mitte
  war. Keine Fehlbewegung, seltener Randfall.

## 8. Fragen an Jens

1. **Handprüfung** (§ 5): Ergebnis der Prüfpunkte auf A55 und Desktop?
2. **Freigabe von Tag und Push:** Darf `v0.7.1` gesetzt und zusammen mit `master` gepusht
   werden?
3. **Deploy:** Soll der Stand danach auf den Webspace (eigene Freigabe)?

## Entscheidungen (25.09.2026)

1. **Handprüfung:** Desktop ohne Befund; das zu kleine ⓘ steht seither links in der Sprachzeile
   (§ 1). A55 ohne Befund, geprüft am Stand `f8adc75` auf dem Webspace.
2. **Tag und Push:** freigegeben, `v0.7.1` auf `master`.
3. **Deploy:** freigegeben; der Webspace trägt den Stand `f8adc75`, der Abschluss ändert nur
   Dokumente.
