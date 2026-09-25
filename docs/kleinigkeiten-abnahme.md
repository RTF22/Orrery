# Abnahme Kleinigkeiten

## 1. Umfang

Plan `docs/superpowers/plans/2026-09-25-kleinigkeiten.md` (25.09.2026): liegengebliebene
Kleinigkeiten aus früheren Abnahmen und die offenen Punkte der Info-Karte
(`docs/infokarte-abnahme.md` §7) beheben, dazu vier Verhaltensänderungen:

1. **Taste C und Kino-Knopf:** Ein durch Eingabe angehaltenes Kino gilt als aktiv. C und der
   Knopf im Kino-Panel beenden es wie Escape; der Knopf zeigt dann „Kino beenden“.
2. **Vollbild:** Das Beenden des Kinos verlässt das Vollbild, aber nur, wenn das Kino es selbst
   eingeschaltet hat. Ein vorher mit F gewähltes Vollbild bleibt.
3. **Ansichten:** Das Laden einer Ansicht beendet ein aktives Kino (wie „Zurücksetzen“), und der
   Kameramodus „Kino“ aus einer gespeicherten Ansicht wird als „frei“ übernommen.
4. **Controller am Touchgerät:** Im Reiter „Bedienung“ der Info-Karte erscheint am Touchgerät
   ein Knopf zur Steuerungskarte, sobald ein Controller verbunden ist.

Abschluss als `v0.7.2`. Acht Commits auf dem Branch `kleinigkeiten` (ab `master` `f1e308d`) in
fünf Schritten, dazu dieses Protokoll:

- **Mechanische Kleinigkeiten** (`d249dda`, „Kleinigkeiten: Export-Freigabe, Meldungen,
  Linkstil, Gerätetest, Szenennummer“): Kopfzeile-Test ohne echten 2-s-Timer (Fake-Timer statt
  `waitFor` mit realer Wartezeit); die Objekt-URL des Ansichten-Exports wird erst 1000 ms nach
  dem Klick freigegeben (`EXPORT_FREIGABE_MS`), manche Browser brechen einen sofort freigegebenen
  Download sonst ab; `Meldung.anzahl` nur noch dort im Meldungstyp, wo eine Zahl eingesetzt wird;
  gemeinsame Konstante `LINKSTIL` für `ExternerLink` und den Knopf „Alle Tastenkürzel und
  Controller“ (`decoration-sky-300/50` wie im übrigen Bestand); neue Testdatei
  `src/ui/infokarte/geraet.test.ts` für `laeuftAlsApp()`/`grobJetzt()`; `advanceCinema` in
  `src/app/cinema.ts` schreibt jetzt die normalisierte Szenennummer zurück statt einer
  unnormalisierten (etwa 2,5 oder −3) weiterzuzählen.
- **Reiter-Zugänglichkeit** (`e329c33`, Korrektur `25845fc`, „Reiter: Pos1/Ende, Fokus und
  aria-Verknüpfung“ / „Infopanel-Test: Fokus nach Pos1/Ende“): Die Reiterleisten in
  `src/ui/info/InfoPanel.tsx` (Grundschule/Gymnasium/Hochschule) und
  `src/ui/karte/Kartendialog.tsx` (Info-Karte, Steuerungskarte) setzen den Fokus nach Pfeil,
  Pos1 und Ende jetzt auf den neu aktiven Reiter statt auf den alten mit `tabIndex -1` liegen zu
  lassen; jeder Reiter trägt eine `id`, verknüpft über `aria-controls`/`aria-labelledby` mit
  seinem `tabpanel`. Die Reiterleiste der Karten steht bei geringer Höhe
  (`(max-height: 500px)`, Konstante `KARTE_QUER_ABFRAGE`) senkrecht statt waagerecht und trägt
  dann `aria-orientation="vertical"`. Die Korrektur ergänzte einen echten Fokus-Test für
  Pos1/Ende im Infopanel (der ursprüngliche Test prüfte nur `aria-selected`, nicht
  `document.activeElement`).
- **Kino-Verhalten** (`a4f0617`, Korrektur `3e05373`, Baufehler behoben `fca8ebd`;
  „Kino: C beendet auch angehalten, eigenes Vollbild verlassen, Ansicht beendet Kino“ /
  „Kino: Vollbild nachträglich verlassen, wenn das Kino vor der Zusage endet“ / „Kino-Test: Typen
  der zurückgehaltenen Zusage, neutraler Name“): `toggleCinema` fragt jetzt `cinemaAktiv()`
  (läuft oder ist per Eingabe angehalten) statt nur `cinema.running`; der Knopf im Kino-Panel
  liest denselben Zustand und zeigt im angehaltenen Zustand „Kino beenden“. Eine Modulvariable
  merkt, ob das Kino selbst das Vollbild eingeschaltet hat (`startCinema`); nur dann verlässt
  `stopCinema` es wieder, ein vorher mit F gewähltes Vollbild bleibt stehen, kein zweites Wirken
  bei einem zusätzlichen `fullscreenchange`. Die Korrektur deckte einen Randfall ab: Erfüllt
  sich die `requestFullscreen`-Zusage erst nach dem Kinoende, verlässt sie das Vollbild
  nachträglich, sofern es zu diesem späten Zeitpunkt noch vom selben Kino stammt. Ein
  Typfehler aus dieser Korrektur (`cinemaControl.test.ts:267`, TS2349) brach `npm run build`
  (`tsc -b`) ab und wurde zusammen mit einem prozessbezogenen Testnamen sofort behoben
  (siehe § 6). `AnsichtenPanel.tsx` beendet ein aktives Kino jetzt beim Laden einer Ansicht (wie
  „Zurücksetzen“), `ansichtAnwenden` in `src/store/persist.ts` übernimmt den Kameramodus „Kino“
  aus einer Ansicht als „frei“.
- **Controller-Knopf am Touchgerät** (`000a672`, „Info-Karte: Controller-Belegung am
  Touchgerät mit verbundenem Controller“): neuer Hook `usePadVerbunden`
  (`src/ui/steuerung/padVerbunden.ts`), wahr, solange ein Controller mit Standardbelegung
  verbunden ist (Anfangswert und Neuberechnung über `padLeserErstellen`, ausgelöst durch
  `gamepadconnected`/`gamepaddisconnected`). `oeffnen` der Steuerungskarte nimmt jetzt einen
  optionalen Startreiter. Im Reiter „Bedienung“ der Info-Karte steht am Touchgerät bei
  verbundenem Controller ein Knopf „Controller-Belegung“ unter der Gestenliste; er schließt die
  Info-Karte und öffnet die Steuerungskarte im Reiter „Controller“.
- **Messung, Protokoll, Version** (`117e56a`, „Abnahme Kleinigkeiten, Version 0.7.2“):
  Browser-Messungen gegen die Entscheidungen 1–4 und die Prüfschwerpunkte des Plans (§ 3),
  `npm version 0.7.2 --no-git-tag-version`, dieses Protokoll. Dabei fiel auf, dass der Test
  „Über: Links in neuem Tab, Rechte, Version“ in `src/ui/infokarte/inhalte.test.tsx` die
  Versionsnummer fest als `/0\.7\.1/` erwartete (Plan-Warnung „kein Test die alte Nummer
  festschreibt“ zutreffend); er prüft jetzt gegen die echte Konstante `VERSION` aus `./version`
  statt gegen eine feste Ziffernfolge, damit künftige Versionswechsel ihn nicht erneut brechen.

Die Wort- und Trailerprüfung vor jedem Commit erfolgte wie in der lokalen Projektanleitung
beschrieben, Ergebnis 0 bzw. leer.

## 2. Zahlen

| Größe | Vorher (`master` `f1e308d`) | Nachher (`fca8ebd` + Messung/Version/Protokoll) |
|---|---:|---:|
| Tests | 5371 | 5402 |
| Hauptchunk | 1 549,24 kB | 1 550,81 kB |

Beide Werte aus einem frischen Durchlauf von `npm test` (5402 Tests, alle grün) und
`npm run build` (`tsc -b && vite build`, Hauptchunk `dist/assets/index-*.js`) beim Schreiben
dieses Protokolls.

## 3. Messungen im Browser

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als laufend
bestätigt, kein zweiter gestartet). Je Fall ein eigener Browser-Kontext
(`page.context().browser().newContext({ viewport, deviceScaleFactor, isMobile, hasTouch })`),
neue Seite sofort `bringToFront()`, direkt nach jedem Navigate
`window.store.setState({ quality: { tier: 'high' } })`. Zustände wurden über DOM-Attribute und
über `window.store.getState()` gelesen; ein dynamischer Import der beiden Karten-Stores
(`useInfoKarte`, `useSteuerKarte`) aus einer separaten `evaluate`-Auswertung lieferte dagegen
wiederholt einen von der laufenden Seite abweichenden Stand (vermutlich eine zweite
Modulinstanz) und wurde deshalb für Zustandsprüfungen verworfen; die sichtbaren DOM-Werte
(Reiter-Titel, `aria-selected`, gemessene Rechtecke) blieben davon unberührt und sind
durchgehend verwendet.

### 3.1 Desktop 1280×720 (Maus)

| Prüfung | Ist | Ergebnis |
|---|---|---|
| Taste C startet das Kino | `cinema.running: true`, `camera.mode: 'cinema'` | erfüllt |
| Per `window.store` angehalten (`setCinema({ running: false })`) | `cinema.running: false`, `camera.mode: 'cinema'` (weiter aktiv) | erfüllt |
| Knopf-Beschriftung im Kino-Panel im angehaltenen Zustand | „Kino beenden“ | erfüllt |
| Echte Taste C danach | `cinema.running: false`, `camera.mode: 'free'` | erfüllt |
| Ansicht „Messung Erde“ gespeichert (Kamera `attached`/`earth`), Kino per C gestartet | vor dem Laden: `cinema.running: true`, `camera.mode: 'cinema'` | erfüllt |
| Ansicht laden | `cinema.running: false`, `camera.mode: 'attached'`, `targetId: 'earth'` | erfüllt |
| Fokus auf Reiter „Grundschule“, Taste `End` | aktiver und fokussierter Reiter „Hochschule“ (`aria-selected="true"`) | erfüllt |
| … `aria-controls` des aktiven Reiters | zeigt auf ein vorhandenes `tabpanel`-Element | erfüllt |
| Taste `Home` danach | aktiver und fokussierter Reiter „Grundschule“ | erfüllt |
| Info-Karte öffnet beim ersten Besuch von selbst (Desktop/Maus) | Reiter „Bedienung“, `aria-orientation="horizontal"` an der Reiterleiste | erfüllt |

### 3.2 Info-Karte: aria-orientation nach Kartenhöhe

| Viewport | `deviceScaleFactor` | Touch | Startreiter | `aria-orientation` | Ergebnis |
|---|---:|---|---|---|---|
| 1280×720 | 1 | nein | Bedienung | `horizontal` | erfüllt |
| 915×412 | 2,625 | ja | App | `vertical` | erfüllt |

### 3.3 A55 hoch/quer (Touch, `deviceScaleFactor` 2,625): Controller-Knopf und Steuerungskarte

Controller-Attrappe über `navigator.getGamepads` per `addInitScript` (Standardbelegung, 17
Tasten, ein Pad), zusätzlich `gamepadconnected` auf `window` ausgelöst.

| Prüfung | Ist | Ergebnis |
|---|---|---|
| Reiter „Bedienung“ mit Controller-Attrappe | Knopf „Controller-Belegung“ vorhanden | erfüllt |
| Reiter „Bedienung“ ohne Attrappe (eigener Kontext, kein `getGamepads`-Override) | kein Knopf „Controller-Belegung“ | erfüllt |
| Klick auf „Controller-Belegung“ | Info-Karte-Dialog verschwunden, neuer Dialog „Steuerung“ mit aktivem Reiter „Controller“ | erfüllt |

Danach an `[data-testid="steuerkarte-inhalt"]` und dem Kartenrechteck gemessen (wie
`docs/infokarte-abnahme.md` § 3.3):

| Ausrichtung | Sprache | scroll | sichtbar | imBild | Ergebnis |
|---|---|---:|---:|---|---|
| A55 hoch (412×915) | de | 172 | 172 | ja | erfüllt |
| A55 hoch (412×915) | en | 172 | 172 | ja | erfüllt |
| A55 quer (915×412) | en | 329 | 329 | ja | erfüllt |
| A55 quer (915×412) | de | 329 | 329 | ja | erfüllt |

Alle vier Fälle: `scroll ≤ sichtbar` (hier durchweg mit Gleichheit) und `imBild === true`.

### 3.4 Konsole

Über den gesamten Ablauf (alle Kontexte aus § 3.1–§ 3.3, je Kontext ein eigener
`page.on('console', …)`/`page.on('pageerror', …)`-Mitschnitt): 0 Fehler, 0 Warnungen.

### 3.5 Nicht per Playwright prüfbar

Der Vollbild-Kreislauf (Kino mit C startet Vollbild; Escape oder C verlässt es; ein vorher mit F
gewähltes Vollbild bleibt bestehen) lässt sich mit den verfügbaren Playwright-Werkzeugen nicht
zuverlässig auslösen und messen — echtes Browser-Vollbild verlangt eine Nutzergeste und wird in
der automatisierten Umgebung nicht gewährt. Aufgenommen als Handprüfpunkt in § 5.

## 4. Lizenz

Entfällt: keine neuen Fremddateien, keine geänderten Lizenzangaben.

## 5. Handprüfung (Jens)

| Prüfpunkt | Ergebnis |
|---|---|
| Vollbild-Kreislauf: Kino mit Taste C starten → Vollbild | nicht geprüft (Jens, 25.09.2026: ausgelassen) |
| … Escape oder C beenden das Kino → Vollbild wieder verlassen | nicht geprüft (Jens, 25.09.2026: ausgelassen) |
| … vorher mit F gewähltes Vollbild, danach Kino starten und beenden → Vollbild bleibt bestehen | nicht geprüft (Jens, 25.09.2026: ausgelassen) |
| Controller am Touchgerät (falls ein Gerät mit Controller zur Hand ist): Reiter „Bedienung“ zeigt „Controller-Belegung“, Klick öffnet die Steuerungskarte im Reiter „Controller“ | nicht geprüft (Jens, 25.09.2026: ausgelassen) |

## 6. Rulings

- **Ruling (Task 1, Kopfzeile-Test):** Statt `vi.useFakeTimers({ shouldAdvanceTime: true })`
  liefen reine Fake-Timer mit abgewartetem Mikrotask für die Zwischenablage-Attrappe, weil der
  Grenzwert bei 1999 ms mit `shouldAdvanceTime` an Zeitdrift scheiterte; der zweite,
  gleichgelagerte Export-Test lief aus Konsistenzgründen ebenfalls mit reinen Fake-Timern. Beide
  Formen erfüllen das Planziel „keine echte Wartezeit“ gleichermaßen — kostet, falls falsch: eine
  andere Testform in diesen beiden Tests.
- **Ruling (Task 3, geparkter Randfall):** Erfüllt sich die `requestFullscreen`-Zusage erst nach
  dem Kinoende, kann sie in einem konstruierten Randfall ein im selben Millisekundenfenster per F
  gewährtes Vollbild schließen. Entschieden wurde, den Befund zurückzustellen statt eine zweite
  Prüfrunde für diesen Task zu eröffnen (Regel: höchstens eine Prüfrunde je Task): Ein neu
  gestartetes Kino ist bereits abgedeckt (`cinemaAktiv()` ist dann wahr, der Merker gehört zum
  neuen Kino); übrig bleibt nur F innerhalb der Zusagefrist, und beide Anfragen gelten demselben
  Element, sind also technisch nicht unterscheidbar — kostet, falls falsch: In diesem seltenen
  Randfall schließt sich ein eben erst gewährtes Vollbild.
- **Ruling (Task 3/4, Baufehler):** Ein Typfehler aus der Nacharbeit von Task 3
  (`cinemaControl.test.ts:267`, TS2349) ließ `npm run build` (`tsc -b`) abbrechen. Entschieden
  wurde, ihn sofort durch den Umsetzer von Task 3 beheben zu lassen und mit der ohnehin
  zurückgestellten Umbenennung eines prozessbezogenen Testnamens zu bündeln, statt ihn liegen zu
  lassen — dies zählt nicht als zweite Prüfrunde, weil der Stand sonst gar nicht baut. Der Diff
  wurde durchgesehen: nur Testtypen und ein Testname, keine Laufzeitänderung — kostet, falls
  falsch: eine zusätzliche kurze Nacharbeit.

## 7. Offene Punkte

- `cinema.test.ts:41`/`:46` tragen im Kommentar den Anglizismus „Fix“.
- `AnsichtenPanel.tsx:161`: Der Export-Freigabe-Timer wird beim Unmount nicht aufgeräumt
  (unschädlich — die Objekt-URL bleibt dann bis zur nächsten Verwendung des Exports gültig —,
  weicht aber vom Aufräum-Stil der übrigen Datei ab).
- `InfoKarte.test.tsx`: Der `aria-orientation`-Test räumt die `matchMedia`-Attrappe am
  Testende statt in `afterEach` ab.
- In `cinemaControl.ts`/`CinemaPanel.tsx` steht die Bedingung „läuft oder angehalten“ doppelt
  (einmal als `cinemaAktiv()`, einmal als eigener Selektor im Panel) — begründet, weil der
  Panel-Selektor ohne den Store-Import von `cinemaAktiv()` auskommt, aber redundant.
- Verspätete `requestFullscreen`-Zusage nach Kinoende kann in einem konstruierten Randfall ein im
  selben Millisekundenfenster per F gewährtes Vollbild schließen (siehe § 6).
- `gamepadconnected` kommt in Chrome erst nach einem Tastendruck — plattformbedingt, keine
  Handlung nötig.
- Aus dem Plan „Nicht aufgenommen“ (§ 7 des Plans, unverändert offen):
  - `melde()`-Timer nach Unmount: bereits vor diesem Plan behoben, `Kopfzeile` räumt den Timer im
    Aufräumeffekt ab.
  - „✕ nicht in der Ausnahmeliste“: Die Liste ist eine Planregel, kein Code.
  - Merker `lbVorher`/`padGesperrt` bei offener Karte: Nach dem Schließen entsteht dieselbe
    LB-Sperre wie ohne Karte (LB losgelassen bei ausgelenktem Stick sperrt, bis der Stick in der
    Mitte war); kein abweichendes Verhalten.
  - Fokus nach Kino-Ruhe bei offener Karte (Auslöser nicht mehr im DOM): bleibt wie in
    `docs/infokarte-abnahme.md` § 7 beschrieben.
  - Annahme von Wurzel und Zurücksetzen über `thema:sonnensystem`: kein Fehler, nur eine
    dokumentierte Annahme.
  - Katalog im Hauptbundle: Frage an Jens erst ab +50 kB Hauptchunk.

## 8. Fragen an Jens

1. **Handprüfung** (§ 5): Ergebnis des Vollbild-Kreislaufs und — falls ein Gerät mit Controller
   zur Hand ist — der Controller-Erkennung am Touchgerät?
2. **Freigabe von Tag und Push:** Darf `v0.7.2` gesetzt und zusammen mit `master` gepusht werden?
3. **Deploy:** Soll der Stand danach auf den Webspace (eigene Freigabe)?

## Entscheidungen (25.09.2026)

1. **Handprüfung:** von Jens ausgelassen; der Vollbild-Kreislauf ist nur über die Attrappentests
   belegt, der Controller-Knopf am Touchgerät über Tests und die Messung mit nachgebildetem
   Controller (§ 3).
2. **Tag und Push:** freigegeben, `v0.7.2` auf `master`.
3. **Deploy:** freigegeben; das Hochladen startet Jens selbst.
