# Abnahme Info-Karte

## 1. Umfang

Entwurf `docs/superpowers/specs/2026-09-25-infokarte-design.md` (25.09.2026), Plan
`docs/superpowers/plans/2026-09-25-infokarte.md`. Die Info-Karte bringt ein Overlay mit
Kurzanleitung zur Einrichtung als App, zur Bedienung und mit Verweis auf Repository und
Lizenzinfo. Sie schließt Phase 6 (Tag `v0.7.0`) an und endet mit Tag `v0.7.1`. Drei Commits
auf dem Branch `infokarte`, dazu dieses Protokoll:

- **Gerüst** (`285be98`, Korrektur `3734c87`): eigener Store `useInfoKarte` (offen, Reiter),
  Dialog mit drei leeren Reitern („App", „Bedienung", „Über"), Knopf ⓘ in der Kopfzeile,
  Schließen über ✕/Escape/Hintergrund, Fokus beim Öffnen auf den aktiven Reiter und
  Fokusrückgabe beim Schließen (auch nach einem Wechsel von `ui.hidden`, an derselben,
  stabilen Stelle im Baum), automatisches Öffnen beim ersten Besuch, Kürzelsperre bei
  offener Karte, Zeichnen unabhängig von `ui.hidden` und der Kino-Ruhe.
- **Inhalte** (`74fc760`): die drei Reiter in Deutsch und Englisch, Erkennung des laufenden
  App-Modus, Installationsknopf (`useInstallation` in `src/ui/infokarte/installation.ts`,
  Abfangen des Browser-Ereignisses mit `prompt()` und `userChoice`), Anzeige der
  Versionsnummer aus `package.json` (jetzt `0.7.1`).
- **Messung und dieses Protokoll**: Messungen im Browser gegen die Zielwerte aus Entwurf §3
  („Kein Scrollen") und Plan, Handprüfliste für Jens. Dabei wurde der Entwurf §4.3
  nachgeführt: Die Version steht als „Version" mit der Zahl aus `package.json` (Beispiel
  „Version 0.7.1"), ohne das dort ursprünglich vorgesehene „v"-Präfix — deckungsgleich mit
  dem umgesetzten Code (siehe § 6).

## 2. Zahlen

| Größe | Vorher (master `78ee0b8`) | Nachher |
|---|---:|---:|
| Tests | 5328 | 5354 |
| Hauptchunk | 1 531,36 kB | 1 543,51 kB |

Die Zahlen stammen aus einem frischen Durchlauf von `npm test` und `npm run build` in diesem
Schritt; dieser Schritt selbst ändert keinen Quelltext, die Werte sind gegenüber dem Stand
nach den Inhalten (`74fc760`) unverändert.

## 3. Messungen im Browser

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als laufend
bestätigt, kein zweiter gestartet). Je Fall ein eigener Browser-Kontext
(`page.context().browser().newContext({ viewport, deviceScaleFactor, isMobile, hasTouch })`),
neue Seite sofort `bringToFront()`. Je Kontext: Seite laden, `orrery.infokarte.gesehen.v1` aus
`localStorage` entfernen, neu laden (die Karte öffnet dann von selbst). Reiterwechsel durch
Klick auf `[role="tab"]` **innerhalb** des Dialogs (`[role="dialog"] [role="tab"]`) — ein
zunächst ungebunden auf das ganze Dokument angewandter Selektor hätte auf dem Desktop
zusätzlich die gleichnamigen Reiter des Infopanels (Grundschule/Gymnasium/Hochschule)
getroffen; das wurde während der Messung bemerkt und vor der Auswertung richtiggestellt (siehe
§ 6). Nach jedem Sprach- oder Reiterwechsel 200 ms gewartet, dann:

```js
const inhalt = document.querySelector('[data-testid="infokarte-inhalt"]');
const karte = document.querySelector('[role="dialog"]').getBoundingClientRect();
({ scroll: inhalt.scrollHeight, sichtbar: inhalt.clientHeight,
   imBild: karte.top >= 0 && karte.left >= 0 && karte.bottom <= innerHeight && karte.right <= innerWidth });
```

### 3.1 Kein Scrollen: 4 Viewports × 2 Sprachen × 3 Reiter

Startreiter je Fall (vor jedem Wechsel notiert): A55 hoch und A55 quer (Touch) „App", Desktop
klein und Desktop groß (Maus) „Bedienung" — deckungsgleich mit der Vorhersage (grober Zeiger →
„App", sonst „Bedienung").

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

Zusätzlich der Reiter „App" mit sichtbarem Installationsknopf (Attrappe für
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
| Klick auf „Quellcode auf GitHub" im Reiter „Über" öffnet eine neue Seite im Kontext | Seitenzahl 1 → 2, Ziel `https://github.com/RTF22/Orrery` | erfüllt |
| … die Orrery-Seite bleibt unverändert | URL weiterhin `http://localhost:5173/Orrery/` | erfüllt |
| Konsole über den ganzen Ablauf (Verhalten und alle vier Geräte-Fälle aus § 3.1) | 0 Fehler, 0 Warnungen | erfüllt |

## 4. Lizenz

Entfällt: keine neuen Fremddateien. Die Lizenzangaben im Reiter „Über" (Texturen, Sternkatalog,
Himmelskarte, Verweis auf `ASSETS.md`) sind Text aus den Inhalten (`74fc760`), nicht Gegenstand
dieses Schritts.

## 5. Handprüfung (Jens)

| Prüfpunkt | Ergebnis |
|---|---|
| A55: Karte beim ersten Aufruf (privates Fenster oder Websitedaten gelöscht) | |
| A55: Installation über Knopf bzw. Menü, Start vom Symbol zeigt „läuft als App" | |
| A55: Links öffnen neuen Tab, Karte ohne Scrollen hoch und quer | |
| Desktop: ⓘ, Reiter, Escape, „Alle Tastenkürzel und Controller" | |

## 6. Rulings

- **Ruling (Gerüst):** Die Rückgabeform von `App.tsx` wechselte bei offener Karte zwischen
  zwei verschiedenen Baumformen, wodurch die Info-Karte bei einem Wechsel von `ui.hidden`
  neu gemountet wurde und die Fokusrückgabe verlorenging. Entschieden wurde, den Befund sofort
  zu beheben statt ihn zurückzustellen: `App` gibt jetzt immer dieselbe Form zurück (ein
  Fragment mit einer bedingten Oberflächenebene und der Info-Karte stets an derselben festen
  Stelle), dazu ein Test für den Live-Übergang (Karte offen, dann `ui.hidden` gesetzt: Dialog
  bleibt dasselbe Element, Fokus kehrt zurück).
- **Ruling (Gerüst):** Die Erweiterung der Ausnahmeliste für gleichlautende Übersetzungen um
  `infokarte.titel` und `infokarte.reiter.app` wurde nachträglich gebilligt — „Orrery" und
  „App" sind in beiden Sprachen gleich geschrieben.
- **Ruling (Inhalte):** Die Anzeige „Version 0.7.1" bleibt ohne „v"-Präfix — „Version v0.7.1"
  wäre doppelt gemoppelt. Der Entwurf wird in diesem Protokoll-Schritt auf die umgesetzte
  Fassung angeglichen (§ 4.3, siehe § 1).
- **Ruling (Inhalte):** Die Erweiterung der Ausnahmeliste für gleichlautende Übersetzungen um
  `infokarte.ueber.version` wurde gebilligt — „Version" ist in beiden Sprachen gleich
  geschrieben.

## 7. Offene Punkte

- `geraet.ts` hat keinen eigenen Test; die Fallunterscheidungen (App-Modus, grober Zeiger)
  werden bislang nur mittelbar über die Reiter-Tests der Inhalte mitgeprüft.
- Das Zeichen „✕" für den Schließen-Knopf steht als Symbolliteral im Code und ist nicht in der
  dafür vorgesehenen Ausnahmeliste genannt; sein zugänglicher Name kommt aus der
  Übersetzungsdatei.
- `ExternerLink` unterstreicht den Linktext nur beim Überfahren mit der Maus; der übrige
  Bestand (Datenblock, Literaturkarten) unterstreicht Linktext dauerhaft — uneinheitliches
  Bild.
- Die `matchMedia`-Attrappe in den Inhalte-Tests wird nach dem jeweiligen Test nicht
  zurückgesetzt (das dafür vorgesehene Wiederherstellen greift dort nicht).

## 8. Fragen an Jens

1. **Handprüfung** (§ 5): Ergebnis der Prüfpunkte auf A55 und Desktop?
2. **Freigabe von Tag und Push:** Darf `v0.7.1` gesetzt und zusammen mit `master` gepusht
   werden?
3. **Deploy:** Soll der Stand danach auf den Webspace (eigene Freigabe)?
