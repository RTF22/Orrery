# Kleinigkeiten nach der Info-Karte — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Liegengebliebene Kleinigkeiten aus früheren Abnahmen und die offenen Punkte der Info-Karte (`docs/infokarte-abnahme.md` §7) beheben, dazu vier Verhaltensänderungen, die Jens am 25.09.2026 entschieden hat. Abschluss als `v0.7.2`.

**Architektur:** Kleine, voneinander unabhängige Änderungen in `ui/`, `app/` und `store/`, jede mit Test. Keine neue Abhängigkeit, keine neuen Daten. Reihenfolge: erst die mechanischen Punkte (Task 1), dann Reiter-Zugänglichkeit (Task 2), dann das Kino-Verhalten (Task 3), dann der Controller-Knopf am Touchgerät (Task 4), zuletzt Messung, Protokoll und Version (Task 5).

**Tech-Stack:** React, Zustand, Vitest mit jsdom und Testing Library, Playwright-MCP für die Messungen in Task 5.

**Entwurf:** Kein eigener Entwurf. Maßgeblich sind die Entscheidungen von Jens vom 25.09.2026 (unten) und die Befunde in `docs/infokarte-abnahme.md` §7 sowie die Liste „Kleinigkeiten“ der lokalen Projektanleitung. Vorlage für das Protokoll: `docs/nachfuehrung-4d-abnahme.md` und `docs/infokarte-abnahme.md`.

## Entscheidungen von Jens (25.09.2026)

1. **Taste C und Kino-Knopf:** Ein durch Eingabe angehaltenes Kino gilt als aktiv. C und der Knopf im Kino-Panel beenden es wie Escape; der Knopf zeigt dann „Kino beenden“.
2. **Vollbild:** Das Beenden des Kinos verlässt das Vollbild, aber nur, wenn das Kino es selbst eingeschaltet hat. Ein vorher mit F gewähltes Vollbild bleibt.
3. **Ansichten:** Das Laden einer Ansicht beendet ein aktives Kino (wie „Zurücksetzen“), und der Kameramodus „Kino“ aus einer gespeicherten Ansicht wird als „frei“ übernommen.
4. **Controller am Touchgerät:** Im Reiter „Bedienung“ der Info-Karte erscheint am Touchgerät ein Knopf zur Steuerungskarte, sobald ein Controller verbunden ist.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll), Umlaute korrekt. Oberflächentexte nur in `src/ui/i18n/de.ts` und `en.ts`, keine Literale in Komponenten (Ausnahmen wie im Bestand: Tastennamen, Sprachcodes, „↗“, „ⓘ“, „✕“).
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer- und Wortkontrolle aus der lokalen Projektanleitung (Ergebnis 0 bzw. leer). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei; Protokolle nennen die Kontrollen nur als Verweis, **nie mit Suchmuster**.
- Keine Prozesssprache (Task, Ruling, Brief, Auftrag, Umsetzer, Controller im Sinne von Steuerinstanz, Ledger) in Code-Kommentaren; im Protokoll nur in § 6.
- Branch `kleinigkeiten` (von `master` nach dem Plan-Commit), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `store/` importiert nichts aus `ui/` (Schichtentest).
- Vor jedem Commit: betroffene Tests grün, `npm run lint` ohne Befund, `git status --short` geprüft; nur gezielt `git add`. Vor „fertig“ (Task 5): `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Tests mit Zeitablauf über `vi.useFakeTimers()`, nie mit echter Wartezeit.
- Ein Umsetzer gleichzeitig (vor jedem Auftrag `ListAgents` prüfen). Höchstens eine Prüfrunde je Task: ein Umsetzer, eine Prüfung, eine Nacharbeit; Restbefunde gehen ins Protokoll.
- Modelle: Umsetzer und Prüfer auf dem mittleren Modell; das stärkste nur nach zweimaligem Scheitern. Greift ein Kontingentlimit, weiter auf dem kleinsten, im Protokoll § 8 vermerken.
- Rulings statt Rückfragen; jede Entscheidung als Zeile mit „Ruling:“ ins Ledger `.superpowers/sdd/2026-09-25-kleinigkeiten/progress.md` (git-ignoriert), am Ende gesammelt ins Protokoll.

## Prüfschwerpunkte

1. **Kino-Zustände:** „läuft“ (`cinema.running`), „angehalten“ (`running` falsch, `camera.mode === 'cinema'`) und „aus“. Jede neue Verzweigung muss alle drei abdecken; `cinemaAktiv()` in `ui/cinemaControl.ts` ist die eine Abfrage für „läuft oder angehalten“.
2. **Vollbild-Kreislauf:** Das Verlassen des Vollbilds löst `fullscreenchange` aus, und `useShortcuts` beendet daraufhin ein aktives Kino. `stopCinema` darf dabei nicht zweimal wirken und kein fremdes Vollbild schließen.
3. **Fokus in Reiterleisten:** Nach Pfeil, Pos1 oder Ende muss der Fokus auf dem neuen aktiven Reiter liegen, nicht auf dem alten mit `tabIndex -1`.
4. **Controller-Erkennung:** Kein unsicherer Kontext, kein `getGamepads`, keine Ausnahme bricht die Info-Karte; ohne Controller bleibt der Reiter „Bedienung“ am Touchgerät unverändert.

## Nicht aufgenommen (mit Grund, fürs Protokoll § 7)

- `melde()`-Timer nach Unmount: bereits behoben, `Kopfzeile` räumt den Timer im Aufräumeffekt ab.
- „✕ nicht in der Ausnahmeliste“: Die Liste ist eine Planregel, kein Code; in diesem Plan ergänzt (siehe oben).
- Merker `lbVorher`/`padGesperrt` bei offener Karte: Nach dem Schließen entsteht dieselbe LB-Sperre wie ohne Karte (LB losgelassen bei ausgelenktem Stick sperrt, bis der Stick in der Mitte war); kein abweichendes Verhalten.
- Fokus nach Kino-Ruhe bei offener Karte (Auslöser nicht mehr im DOM): bleibt wie beschrieben.
- Annahme von Wurzel und Zurücksetzen über `thema:sonnensystem`: kein Fehler, nur eine dokumentierte Annahme.
- Katalog im Hauptbundle: Frage an Jens erst ab +50 kB.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Mechanische Kleinigkeiten | `src/ui/Kopfzeile.test.tsx`, `src/ui/panels/AnsichtenPanel.tsx` (+Test), `src/ui/infokarte/inhalte.tsx`, `src/ui/infokarte/geraet.test.ts` (neu), `src/app/cinema.ts` (+Test) |
| 2 | Reiter-Zugänglichkeit | `src/ui/info/InfoPanel.tsx` (+Test), `src/ui/karte/Kartendialog.tsx`, `src/ui/infokarte/InfoKarte.test.tsx` oder `src/ui/steuerkarte/SteuerKarte.test.tsx` |
| 3 | Kino-Verhalten | `src/ui/cinemaControl.ts` (+Test), `src/ui/panels/CinemaPanel.tsx`, `src/ui/panels/AnsichtenPanel.tsx`, `src/store/persist.ts` (+Test), `src/ui/i18n/{de,en}.ts` falls neuer Schlüssel |
| 4 | Controller-Knopf am Touchgerät | `src/ui/steuerung/padVerbunden.ts` (neu, +Test), `src/ui/steuerkarte/zustand.ts`, `src/ui/infokarte/inhalte.tsx` (+Test), `src/ui/i18n/{de,en}.ts` |
| 5 | Messung, Protokoll, Version | `docs/kleinigkeiten-abnahme.md` (neu), `package.json`/`package-lock.json` (Version 0.7.2) |

**Zahlen:** Ausgangsstand `master` nach dem Plan-Commit: 5371 Tests, Hauptchunk 1 549,24 kB (vor Task 1 mit `npm test` und `npm run build` bestätigen). Tests wachsen je Task; der Hauptchunk um höchstens wenige kB.

---

### Task 1: Mechanische Kleinigkeiten

**Modell:** mittleres.

- [ ] **Step 1: Kopfzeile-Test ohne echte Wartezeit.** In `src/ui/Kopfzeile.test.tsx` läuft „blendet die Meldung nach zwei Sekunden aus“ mit echtem 2-s-Timer (`waitFor` mit `timeout: 3000`). Auf `vi.useFakeTimers({ shouldAdvanceTime: true })` umstellen (die Zwischenablage-Attrappe ist ein Promise), nach der Meldung „Kopiert“ `vi.advanceTimersByTime(2000)` in `act`, dann leere Statuszeile prüfen; `vi.useRealTimers()` im `finally` oder `afterEach`. Zusätzlich prüfen: Bei 1999 ms steht die Meldung noch.
- [ ] **Step 2: Export-URL nicht sofort freigeben.** `exportieren` in `src/ui/panels/AnsichtenPanel.tsx` ruft `URL.revokeObjectURL(url)` direkt nach `a.click()`; manche Browser brechen den Download dann ab. Freigabe per `setTimeout(() => { URL.revokeObjectURL(url); }, EXPORT_FREIGABE_MS)` mit Konstante `EXPORT_FREIGABE_MS = 1000` und Kommentar (warum). Test in `AnsichtenPanel.test.tsx` anpassen: mit Fake-Timern nach dem Klick noch nicht freigegeben, nach 1000 ms genau einmal mit `'blob:orrery'`.
- [ ] **Step 3: `Meldung.anzahl` nur wo gebraucht.** `interface Meldung { schluessel: Key; anzahl?: number }`; die beiden Fehlermeldungen ohne `anzahl`; die Anzeige ersetzt `{n}` nur, wenn `anzahl` gesetzt ist. Bestehende Tests bleiben grün.
- [ ] **Step 4: Unterstreichung wie im Bestand.** In `src/ui/infokarte/inhalte.tsx` tragen `ExternerLink` und der Knopf „Alle Tastenkürzel und Controller“ zusätzlich `decoration-sky-300/50` (wie `LINK` in `ui/info/Literaturkarten.tsx`). Eine gemeinsame Konstante `LINKSTIL` in `inhalte.tsx` statt zweier gleicher Zeichenketten.
- [ ] **Step 5: Test für `geraet.ts`.** Neue Datei `src/ui/infokarte/geraet.test.ts` (jsdom): `laeuftAlsApp()` wahr bei `navigator.standalone === true`, bei `(display-mode: fullscreen)`, bei `(display-mode: standalone)`, sonst falsch; ohne `window.matchMedia` falsch. `grobJetzt()` folgt `GROB_ABFRAGE`, ohne `matchMedia` falsch. `matchMedia` und `navigator.standalone` nach jedem Test wiederherstellen.
- [ ] **Step 6: Normalisierte Szenennummer zurückschreiben.** `advanceCinema` in `src/app/cinema.ts` setzt heute `nummer: cinema.nummer + 1`; eine unnormalisierte Nummer (etwa 2,5 oder −3 aus einem alten Zustand) läuft so weiter. Stattdessen `nummer: geplant.nummer + 1` (`plannedSceneAt` liefert die normalisierte Nummer). Tests in `src/app/cinema.test.ts`: aus 2,5 wird beim Szenenwechsel 3, aus −3 wird 1.
- [ ] **Step 7:** `npx vitest run src/ui src/app`, `npm run lint`, `git status --short`, gezielt `git add`, Commit „Kleinigkeiten: Export-Freigabe, Meldungen, Linkstil, Gerätetest, Szenennummer“.

### Task 2: Reiter-Zugänglichkeit

**Modell:** mittleres.

- [ ] **Step 1: Infopanel-Reiter.** In `src/ui/info/InfoPanel.tsx` (Reiterleiste Grundschule/Gymnasium/Hochschule, `tabTasten`):
  - Jeder Reiter bekommt eine `id` (aus `useId()`), `aria-controls` auf das obere `tabpanel`; das `tabpanel` bekommt eine `id` und `aria-labelledby` auf den aktiven Reiter.
  - `Home` wählt den ersten, `End` den letzten Reiter (mit `preventDefault`).
  - Nach Pfeil, `Home`, `End` liegt der Fokus auf dem neuen aktiven Reiter (heute bleibt er auf dem alten, der dann `tabIndex -1` trägt).
  - Tests: aria-Verknüpfung, Pos1/Ende, Fokus nach Pfeil rechts.
- [ ] **Step 2: Kartendialog.** In `src/ui/karte/Kartendialog.tsx` (`tasteAufReiter`): `Home`/`End` wie oben. Die Reiterleiste steht bei `(max-height: 500px)` senkrecht; dann `aria-orientation="vertical"`, sonst `"horizontal"`. Die Abfrage als Konstante (etwa `KARTE_QUER_ABFRAGE = '(max-height: 500px)'`) neben den Tailwind-Klassen, gelesen mit `useMedienabfrage` aus `ui/fenster.ts`. Tests in `InfoKarte.test.tsx` oder `SteuerKarte.test.tsx`: Pos1/Ende mit Fokus; `aria-orientation` mit und ohne passende `matchMedia`-Attrappe.
- [ ] **Step 3:** betroffene Tests, `npm run lint`, `git status --short`, Commit „Reiter: Pos1/Ende, Fokus und aria-Verknüpfung“.

### Task 3: Kino-Verhalten (Entscheidungen 1 bis 3)

**Modell:** mittleres.

- [ ] **Step 1: C beendet auch das angehaltene Kino.** `toggleCinema` in `src/ui/cinemaControl.ts` fragt `cinemaAktiv()` statt `cinema.running`. Der Knopf in `src/ui/panels/CinemaPanel.tsx` liest denselben Zustand (Selektor `s.cinema.running || s.camera.mode === 'cinema'`), zeigt dann „Kino beenden“ (`cinema.stop`) und ruft `stopCinema`. Die Markierung der Szenenliste (●/○) bleibt an `cinema.running`. Tests in `cinemaControl.test.ts`: angehalten (`noteUserInput` bei laufendem Kino) → `toggleCinema` → aus, Kamera zurück; läuft → aus; aus → läuft. Panel-Test: im angehaltenen Zustand zeigt der Knopf „Kino beenden“ und beendet. Die Controller-Taste Menü ist in `ui/steuerung/anwenden.ts` auf `c` gelegt und läuft über `handleShortcut`, wird also mit richtig; Tests, die das alte Verhalten festschreiben, anpassen.
- [ ] **Step 2: Kino verlässt sein eigenes Vollbild.** Modulvariable `vollbildVomKino` in `cinemaControl.ts`: `startCinema` setzt sie nur, wenn es `requestFullscreen` selbst aufruft und das Promise erfüllt wird. `stopCinema` ruft `document.exitFullscreen()` nur, wenn `vollbildVomKino` gesetzt ist **und** `document.fullscreenElement` nicht null ist, und setzt die Variable in jedem Fall zurück. Kein zweites Wirken, wenn `fullscreenchange` danach erneut `stopCinema` auslösen will (`cinemaAktiv()` ist dann falsch). Ein vor dem Start bestehendes Vollbild (F) bleibt. Tests mit Attrappen für `document.fullscreenElement`, `requestFullscreen`, `exitFullscreen`: (a) Kino schaltet Vollbild ein, Beenden verlässt es; (b) Vollbild vorher per F, Beenden lässt es stehen; (c) Anfrage verweigert, Beenden ruft kein `exitFullscreen`; (d) Nutzer verlässt das Vollbild selbst, danach kein weiteres `exitFullscreen`. Kommentar an `stopCinema` und die Liste der Wege im Kommentar über `VorKino` nachführen.
- [ ] **Step 3: Ansicht laden beendet das Kino.** In `src/ui/panels/AnsichtenPanel.tsx` ruft `laden` vor `replaceAll` `if (cinemaAktiv()) stopCinema();` (Muster und Begründung wie `zuruecksetzen` in `ui/Kopfzeile.tsx`). In `src/store/persist.ts` übernimmt `ansichtAnwenden` den Kameramodus `'cinema'` als `'free'`; Test in `src/store/persist.test.ts` (Ansicht mit `camera.mode: 'cinema'` → `'free'`, andere Modi unverändert). Panel-Test: laufendes Kino, Ansicht laden → `cinema.running` falsch, Kamera aus der Ansicht.
- [ ] **Step 4:** betroffene Tests, `npm run lint`, `git status --short`, Commit „Kino: C beendet auch angehalten, eigenes Vollbild verlassen, Ansicht beendet Kino“.

### Task 4: Controller-Knopf am Touchgerät (Entscheidung 4)

**Modell:** mittleres.

- [ ] **Step 1: Hook `usePadVerbunden`.** Neue Datei `src/ui/steuerung/padVerbunden.ts`: Hook, der wahr liefert, solange ein Controller mit Standardbelegung verbunden ist. Anfangswert und Neuberechnung über `padLeserErstellen({ isSecureContext: window.isSecureContext, navigator })` aus `./gamepad` (liefert ohne sicheren Kontext, ohne `getGamepads` oder bei Ausnahme `null`); neu berechnet bei `gamepadconnected` und `gamepaddisconnected` auf `window`, Abmeldung im Aufräumen. Tests: ohne Controller falsch; Attrappe mit Standard-Pad plus Ereignis → wahr; Trennen → falsch; unsicherer Kontext → falsch; `getGamepads` wirft → falsch, kein Absturz. Die Attrappe `./padAttrappe.ts` nutzen, falls sie passt.
- [ ] **Step 2: Steuerungskarte mit Startreiter.** `oeffnen` in `src/ui/steuerkarte/zustand.ts` nimmt einen optionalen Reiter (`oeffnen(reiter: SteuerReiter = 'tastatur')`); Kommentar nachführen. Bestehende Aufrufer (`?`, Knopf in der Info-Karte) bleiben bei „Tastatur“. Test in `zustand.test.ts` oder `SteuerKarte.test.tsx`.
- [ ] **Step 3: Knopf im Reiter „Bedienung“ am Touchgerät.** In `ReiterBedienung` (`src/ui/infokarte/inhalte.tsx`), Zweig `grob`: Ist `usePadVerbunden()` wahr, steht unter der Gestenliste ein Knopf im Linkstil (`LINKSTIL` aus Task 1) mit neuem Schlüssel `infokarte.bedienung.controllerKarte` („Controller-Belegung“ / „Controller layout“). Er schließt die Info-Karte und öffnet die Steuerungskarte mit Reiter „Controller“. Ohne Controller bleibt der Zweig unverändert. Tests in `inhalte.test.tsx`: grob ohne Pad → kein Knopf; grob mit Pad → Knopf, Klick öffnet Steuerungskarte mit `reiter === 'controller'` und schließt die Info-Karte; fein → wie bisher. Die Schlüsselvollständigkeit DE/EN prüft der vorhandene i18n-Test.
- [ ] **Step 4:** betroffene Tests, `npm run lint`, `git status --short`, Commit „Info-Karte: Controller-Belegung am Touchgerät mit verbundenem Controller“.

### Task 5: Messung, Protokoll, Version

**Modell:** mittleres.

- [ ] **Step 1: Messungen im Browser** (Playwright, Vite-Server wie oben; nach jedem Navigate `window.store.setState({ quality: { tier: 'high' } })`; Ergebnisse als Werte, keine Eindrücke):
  - Desktop 1280×720: Kino per C starten, per `window.store` anhalten (`setCinema({ running: false })` bei `camera.mode === 'cinema'`), Knopf im Kino-Panel lautet „Kino beenden“; echte Taste C → `cinema.running` falsch und `camera.mode !== 'cinema'`.
  - Ansicht speichern, Kino starten, Ansicht laden → Kino aus, Kamera aus der Ansicht.
  - Infopanel-Reiter: Fokus auf „Grundschule“, `End` → aktiv und fokussiert „Hochschule“; `Home` zurück; `aria-controls` zeigt auf ein vorhandenes `tabpanel`.
  - Info-Karte bei 915×412 (Touch, `deviceScaleFactor` 2,625): `aria-orientation="vertical"` an der Reiterleiste; bei 1280×720 `"horizontal"`.
  - A55 hoch (412×915, Touch): Controller-Attrappe über `navigator.getGamepads` per `addInitScript` (Standardbelegung, ein Pad) und `gamepadconnected` auslösen; Reiter „Bedienung“ zeigt „Controller-Belegung“; Klick öffnet die Steuerungskarte im Reiter „Controller“; dort wie in `docs/infokarte-abnahme.md` §3.3 `scroll ≤ sichtbar` und `imBild` für hoch und quer messen, beide Sprachen. Ohne Attrappe kein Knopf.
  - Vollbild ist per Playwright nur eingeschränkt prüfbar; in § 5 als Handprüfpunkt für Jens aufnehmen (Kino mit C starten → Vollbild; Escape oder C → Vollbild verlassen; F-Vollbild vorher → bleibt).
  - Konsole über den ganzen Ablauf: 0 Fehler, 0 Warnungen.
- [ ] **Step 2: Version.** `npm version 0.7.2 --no-git-tag-version` (ändert `package.json` und `package-lock.json`); prüfen, dass die Info-Karte „Version 0.7.2“ zeigt und kein Test die alte Nummer festschreibt.
- [ ] **Step 3: Protokoll** `docs/kleinigkeiten-abnahme.md` nach Vorlage `docs/infokarte-abnahme.md`: § 1 Umfang (je Task Commit und Inhalt, dazu die Entscheidungen von Jens), § 2 Zahlen (Tests, Hauptchunk vorher/nachher), § 3 Messungen, § 5 Handprüfung (Vollbild-Kreislauf; Controller am Touchgerät, falls ein Gerät mit Controller zur Hand ist), § 6 Rulings aus dem Ledger, § 7 offene Punkte inklusive „Nicht aufgenommen“, § 8 Fragen an Jens (Handprüfung, Tag `v0.7.2`, Push, Deploy).
- [ ] **Step 4:** `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen), Wort- und Trailerkontrolle, Screenshots und Skripte löschen, `git status --short`, Commit „Abnahme Kleinigkeiten, Version 0.7.2“.

Fast-Forward nach `master`, Tag `v0.7.2`, Push und Deploy nur nach Jens' Handprüfung und Freigabe; danach Branch `kleinigkeiten` löschen.
