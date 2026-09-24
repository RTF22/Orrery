# Abnahme Phase 5 Etappe 2 (Mobile)

## 1. Umfang

Branch `phase5-2` (von `master`, nach dem Plan-Commit `f1015fd`, nicht gepusht). Entwurf
`docs/superpowers/specs/2026-09-23-phase5-design.md` §4 (Etappe 5-2: Kompaktmodus, grober
Zeiger, Prüfung), Plan `docs/superpowers/plans/2026-09-23-phase5-etappe2-mobile.md`.
Umsetzung:

- `faf54a7` — Abfragen für groben Zeiger und Zustand der Bögen (Task 1): `GROB_ABFRAGE`/
  `useGrob` als Zwilling zu `SCHMAL_ABFRAGE`, neuer Store `ui/bogen.ts` für den geöffneten
  Bogen (Bedienung, Info oder keiner)
- `c4f4d6e` — Kompaktmodus mit Bögen für Bedienung und Info (Task 2): `SCHMAL_ABFRAGE`
  erweitert auf Breite unter 900 px oder Höhe unter 500 px, `ui/Bogenreiter.tsx` (zwei
  Reiter unten rechts), Seitenleiste und Infopanel öffnen sich im Kompaktmodus als Bogen
  statt als Spalte
- `654327a` — Große Bedienziele, Qualitätsdeckel und Szenenzustand für Screenreader
  (Task 3): 44-px-Bedienziele und 24-px-Kästchen/-Griffe bei grobem Zeiger, automatische
  Qualitätsstufe beginnt bei „mittel“ statt „hoch“ im Kompaktmodus mit grobem Zeiger,
  Screenreader-Zusatz an der markierten Zeile der Szenenliste

Etappe 5-2 macht die Oberfläche für schmale und kurze Bildschirme nutzbar. Unter 900 px
Breite oder 500 px Höhe ersetzt ein Bogen die beiden Spalten aus Etappe 5-1: im Hochformat
von unten (55 % der Höhe), im Querformat von der Seite (höchstens 24 rem oder 55 % der
Breite, der kleinere Wert). Ein Reiterpaar unten rechts (`Bogenreiter.tsx`) schaltet
zwischen Bedienung und Info um; ein Tipp auf den offenen Reiter schließt den Bogen.
Breitengriffe sind im Kompaktmodus ausgeblendet, die gespeicherten Breiten bleiben
unberührt. Bei grobem Zeiger (`(pointer: coarse)`) wachsen alle Bedienziele auf
mindestens 44 × 44 px, kleine Kästchen und Griffe auf 24 × 24 px, die Kürzelübersicht
entfällt, und die automatische Qualitätsstufe beginnt bei „mittel“ statt „hoch“, wenn
zugleich Kompaktmodus und grober Zeiger gelten. Die Szenenliste bekommt einen nur für
Screenreader hörbaren Zusatz „(läuft)“ bzw. „(nächster Start)“ an der markierten Zeile.

## 2. Lint, Tests, Build

Auf `654327a` (24.09.2026):

- `npm run lint`: `eslint .` ohne Befund.
- `npm test`:

  ```
  Test Files  106 passed (106)
       Tests  5192 passed (5192)
  ```

  Stand vor der Etappe 5174 (Ende Etappe 5-1). Herleitung laut Ledger: 5177 nach Task 1
  (`faf54a7`), 5187 nach Task 2 (`c4f4d6e`, plus 1 `todo`), 5192 nach Task 3 (`654327a`).
  Task 4 (Messung) und diese Abnahme ändern die Testzahl nicht.
- `npm run build` (`tsc -b && vite build`): 534 Module, `✓ built in 1,59s`, Hauptchunk
  `index-BhDzsHXt.js` **1 458,08 kB** (gzip 395,00 kB), nur der bekannte Hinweis zu
  Chunkgrößen über 500 kB (Katalog im Hauptbundle, offener Punkt aus der lokalen
  Projektanleitung, hier nicht behandelt). Stand vor der Etappe 1 456,56 kB (Ende
  Etappe 5-1), Grenze 1 503,78 kB (Entwurf §8.3) — Zuwachs rund 1,52 kB, deutlich unter
  der Grenze.
- Wort- und Trailerprüfung der lokalen Projektanleitung für alle Commits und neuen
  Dateien dieser Etappe: Ergebnis 0.
- Schlussprüfung: ohne kritische oder wichtige Befunde, zwei kleine Punkte als „Bekannte
  Unschärfen“ in §7 ergänzt; Branch bereit zum Fast-Forward.

## 3. Messung in der Emulation und Kontrollen am Schreibtisch

### 3.1 Emulation (Werte aus Task 4)

Prüfstellung (Ledger, Task 4): eigener Kontext (`browser().newContext`), Basis `654327a`,
Pixeldichte 2,625, Touch, Hochformat 412 × 915 und Querformat 915 × 412. Messweg-Befund:
Eine frisch erzeugte Kontextseite steht zunächst nicht im Vordergrund, `requestAnimationFrame`
wird dann gedrosselt und die 180-Bilder-Einstufung reißt den 5-s-Zeitrahmen —
`page.bringToFront()` direkt nach dem Anlegen der Seite behebt das (siehe §7).

| Format | Zustand | Kriterium | Soll | Ist | erfüllt |
|---|---|---|---|---|---|
| Hochformat 412×915 | kein Bogen | Bedienziele ≥ 44 px | alle | 2/2 | ja |
| Hochformat | kein Bogen | Überlauf Fenster | ≤ 412 | 412 | ja |
| Hochformat | kein Bogen | Qualität (`auto`) | medium | medium | ja |
| Hochformat | Bedienbogen | Bedienziele ≥ 44 px | alle | 83/83 | ja |
| Hochformat | Bedienbogen | Kästchen ≥ 24 px | alle | 19/19 | ja |
| Hochformat | Bedienbogen | Griffe sichtbar | 0 | 0 | ja |
| Hochformat | Bedienbogen | Überlappung Bogenreiter/Bogen | 0 | 0 | ja |
| Hochformat | Bedienbogen | Überlauf Fenster/Bogen | ≤ 412 / `scrollWidth≤clientWidth` | erfüllt | ja |
| Hochformat | Bedienbogen | Bogenmaße Breite | 412 | 412 | ja |
| Hochformat | Bedienbogen | Bogenmaße Höhe | 0,55 · 915 = 503,25 | 503,25 | ja |
| Hochformat | Bedienbogen | Qualität | medium | medium | ja |
| Hochformat | Infobogen | Bedienziele ≥ 44 px | alle | 21/21 | ja |
| Hochformat | Infobogen | Griff waagerecht ≥ 24 px (Teilungsgriff) | 1/1 | 1/1 | ja |
| Hochformat | Infobogen | Überlappung | 0 | 0 | ja |
| Hochformat | Infobogen | Überlauf Fenster/Bogen | erfüllt | erfüllt | ja |
| Hochformat | Infobogen | Bogenmaße Breite/Höhe | 412 / 503,25 | 412 / 503,25 | ja |
| Hochformat | Infobogen | Qualität | medium | medium | ja |
| Querformat 915×412 | kein Bogen | Bedienziele ≥ 44 px | alle | 2/2 | ja |
| Querformat | kein Bogen | Überlauf Fenster | ≤ 915 | 915 | ja |
| Querformat | kein Bogen | Qualität | medium | medium | ja |
| Querformat | Bedienbogen | Bedienziele ≥ 44 px | alle | 83/83 | ja |
| Querformat | Bedienbogen | Kästchen ≥ 24 px | alle | 19/19 | ja |
| Querformat | Bedienbogen | Überlappung | 0 | 0 | ja |
| Querformat | Bedienbogen | Überlauf Fenster/Bogen | erfüllt | erfüllt | ja |
| Querformat | Bedienbogen | Bogenmaße Breite | min(384; 0,55·915=503,25) = 384 | 384 | ja |
| Querformat | Bedienbogen | Bogenmaße Höhe | 412 | 412 | ja |
| Querformat | Bedienbogen | Qualität | medium | medium | ja |
| Querformat | Infobogen | Bedienziele ≥ 44 px | alle | 21/21 | ja |
| Querformat | Infobogen | Griff waagerecht ≥ 24 px | 1/1 | 1/1 | ja |
| Querformat | Infobogen | Überlappung | 0 | 0 | ja |
| Querformat | Infobogen | Überlauf Fenster/Bogen | erfüllt | erfüllt | ja |
| Querformat | Infobogen | Bogenmaße Breite/Höhe | 384 / 412 | 384 / 412 | ja |
| Querformat | Infobogen | Qualität | medium | medium | ja |

Ergebnis (Ledger): keine Messung ihr Soll verfehlt, in beiden Formaten und allen drei
Zuständen — keine Korrektur, kein Commit in Task 4.

### 3.2 Kontrollen am Schreibtisch (diese Abnahme)

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als
laufend bestätigt, kein zweiter gestartet), Viewport 1400 × 900 CSS-Pixel, Pixeldichte 1,
feiner Zeiger, Basis `654327a`. Direkt nach dem Navigieren `quality.tier` auf `high`; Uhr
angehalten (`setCinema({ running: false })` und `setTime({ paused: true })`). Bei dieser
Fensterbreite ist `SCHMAL_ABFRAGE` nicht erfüllt (`matchMedia` bestätigt `false`, ebenso
`GROB_ABFRAGE`): Seitenleiste und Infopanel verhalten sich wie nach Etappe 5-1 — geöffnet
je ein Griff (`role="separator"`, „Breite der Bedienleiste“/„Breite des Infopanels“),
eingeklappt je ein Reiter („Bedienung öffnen“/„Infopanel einblenden“), kein Bogenreiter im
DOM.

Differenzbild wie in `docs/phase5-etappe1-abnahme.md` Messung 1 (beide Spalten
eingeklappt, alle Panels zu, in derselben Ladung): A = `setUi({ hidden: false, panels:
{ ...panels, leiste: false, info: false } })` (beide Reiter sichtbar), B = `setUi({
hidden: true })`. Pixelmessung mit Python 3.12 (Pillow, numpy):

- Kontrollaufnahme A gegen A (ohne Zustandsänderung): 0 abweichende Pixel.
- A gegen B: 3354 abweichende Pixel, x-Bereich 12–1387, y-Bereich 12–80 — ausnahmslos
  innerhalb der beiden Reiter-Rechtecke (Bedienung x = 12–46/y = 12–81, Info
  x = 1354–1388/y = 12–44, je 2-px-Rand); außerhalb 0.

Ergebnis deckungsgleich mit der Messung aus Etappe 5-1 (3354/0/0) — die Etappe hat das
Verhalten bei feinem Zeiger und breitem Fenster nicht verändert.

## 4. Barrierefreiheit

- **Bogenreiter** (`ui/Bogenreiter.tsx`): echte `<button>` mit `aria-pressed={bogen ===
  art}`, Beschriftung `panel.leiste`/`panel.info`; ein Tipp auf den offenen Reiter ruft
  `kippen()` und schließt den Bogen, der andere Reiter öffnet ihn neu.
- **Kästchen und Griffe** wachsen bei grobem Zeiger von 8 px auf 24 × 24 px (Ruling,
  WCAG 2.5.8, siehe §6) — bestätigt in der Emulationsmessung (19/19 bzw. 1/1 ≥ 24 px, §3.1).
- **Kürzelübersicht** entfällt bei grobem Zeiger (`App.tsx`, `useGrob()`), eigener Test
  „blendet bei grobem Zeiger die Kürzelübersicht aus“ in `App.test.tsx`.
- **Szenenliste** (`ui/panels/CinemaPanel.tsx`): Die markierte Zeile trägt zusätzlich zum
  `aria-hidden`-Marker ●/○ einen nur für Screenreader hörbaren Zusatz `<span
  className="sr-only">` mit „ (läuft)“ bzw. „ (nächster Start)“, in der Schreibtisch-Kontrolle
  bestätigt (zugänglicher Name „Tiefflug über Phobos (nächster Start)“). Löst Frage 3 aus
  `docs/phase5-etappe1-abnahme.md`.

## 5. Handprüfung auf dem Galaxy A55 (Jens)

1. Laufenden Entwicklungsserver beenden und im Projektordner `npm run dev -- --host`
   starten; die angezeigte Netzwerkadresse (`http://<Rechner-IP>:5173/Orrery/`) auf dem
   A55 im selben WLAN öffnen. Danach den Server wieder wie gewohnt starten.
2. Prüfliste:
   - Reiter „Bedienung“ und „Info“ öffnen und schließen
   - Wechsel zwischen den Bögen
   - Gerät drehen (Bogen wechselt von unten nach links)
   - Körper per Tipp im Objektbaum anfahren
   - Szene aus der Szenenliste starten und per Tipp anhalten
   - Zeit und Maßstab mit den Reglern ändern
   - Qualitätsstufe unter „Darstellung“ ablesen (erwartet „mittel“ bei „auto“)
   - Bildrate grob einschätzen (flüssig / ruckelt)
3. Hinweis: Wake Lock und Controller greifen erst mit HTTPS.

| Prüfpunkt | Ergebnis |
|---|---|
| Reiter öffnen/schließen | in Ordnung |
| Bogenwechsel | in Ordnung |
| Gerät drehen | in Ordnung |
| Objektwahl per Tipp | in Ordnung |
| Szene starten/anhalten | in Ordnung |
| Zeit-/Maßstabsregler | in Ordnung |
| Qualitätsstufe | in Ordnung |
| Bildrate | in Ordnung |

Ergebnis (Jens, 24.09.2026): Handprüfung auf dem A55 ohne Befund.

## 6. Rulings

- **Ruling:** Umsetzer, Prüfer und Schlussprüfer laufen auf sonnet (lokale
  Projektanleitung: möglichst kleine Modelle) — kostet ggf. übersehene Feinheiten in der
  Schlussprüfung.
- **Ruling:** Beim Kompaktmodus mit Bögen lehnte `npm run build` (`tsc -b`) den
  literalen Import `readFileSync` aus `node:fs` in `konstanten.test.ts` ab (TS2591) —
  `@types/node` fehlt bewusst und `tsconfig.json` schränkt `types` auf `vite/client` ein.
  Fix: eine minimale Ambient-Deklaration nur für die gebrauchte Signatur, der Testcode
  blieb wörtlich wie vorgesehen.
- **Ruling:** Bei den großen Bedienzielen wurde diese Ambient-Deklaration wieder entfernt;
  `konstanten.test.ts` liest `index.css` stattdessen per `import css from
  '../../index.css?raw'` (Muster wie `render/schichten.test.ts`) — kein globaler Shim eines
  Node-Moduls. Kostet eine Zeile, falls `?raw` im Test anders aufgelöst wird.
- **Ruling:** `vite.config.ts` behält dafür `test.css.include: [/index\.css/]` — nötig
  für den `?raw`-Import (Vitest leert CSS sonst), wirkt nur auf `konstanten.test.ts`, nicht
  auf den Build. Kostet nichts außer diesem einen Konfigurationseintrag, falls Vitest das
  Verhalten ändert.
- **Ruling** (Plan): Kästchen bei grobem Zeiger 24 × 24 px (WCAG 2.5.8), Breiten- und
  Teilungsgriffe 24 px statt 8 px.
- **Ruling** (Plan): Szenenliste bekommt nur einen für Screenreader sichtbaren Zusatz
  „(läuft)“ bzw. „(nächster Start)“ an der markierten Zeile statt einer sichtbaren
  Textänderung — löst Frage 3 aus `docs/phase5-etappe1-abnahme.md`.

## 7. Bekannte Unschärfen

Aus dem Ledger (zurückgestellt, kein Merge-Hindernis):

- Task 1: Kommentar zu `GROB_ABFRAGE` nennt den CSS-Zwilling, der erst in Task 3 entsteht
  (planvorgegeben).
- Task 1: `istGrob`/`useGrob` ohne direkten Test (Nutzung und Test folgen erst in Task 3).
  Schlussprüfung: `useGrob` ist seither indirekt über `App.test.tsx` geprüft
  („blendet bei grobem Zeiger die Kürzelübersicht aus“); die Verdrahtung in
  `src/app/loop.ts` Z. 31 (`deckeStufe(detectTier(messwerte), istGrob() && istSchmal())`)
  hat weiterhin keinen eigenen Test — `deckeStufe` selbst ist getestet, die
  Emulationsmessung (§3.1) bestätigt „mittel“ als Ergebnis der Verdrahtung.
- Task 1: `useMedienabfrage` ruft `bei()` im Effekt zusätzlich auf — ein überflüssiges
  Rendern nach dem Einhängen (planvorgegeben).
- Task 4, Messweg (kein Code-Befund): Eine frisch erzeugte Playwright-Kontextseite steht
  zunächst nicht im Vordergrund; ohne `page.bringToFront()` drosselt der Browser
  `requestAnimationFrame`, wodurch die 180-Bilder-Einstufung (`app/loop.ts`) den
  5-s-Zeitrahmen reißt und `quality.tier` bei „auto“ hängen bleibt. Kontrollmessung ohne
  `bringToFront()`: Hochformat blieb bei „auto“, Querformat sprang schon auf „medium“ —
  reine Zufälligkeit der Reihenfolge, kein Fehler der Anwendung.
- Schlussprüfung: `infoOffen(panels, schmal)` (`src/ui/info/konstanten.ts` Z. 47) — beide
  Aufrufer (`src/ui/shortcuts/useShortcuts.ts` Z. 74, `src/ui/info/InfoPanel.tsx` Z. 90)
  übergeben für `schmal` inzwischen stets `false`, weil der Kompaktmodus über den
  Bogenzustand entscheidet; der `schmal`-Zweig ist toter Pfad, kein Fehlverhalten.
  Aufräumen (Parameter entfernen) bei Gelegenheit.

## 8. Fragen an Jens

Keine neuen Fragen aus dieser Etappe. Offen bleiben die drei Fragen aus
`docs/phase5-etappe1-abnahme.md` (Musikauswahl, Debussy-Wortprüfung — dort inzwischen
Frage 3 zur Szenenliste durch §4/§6 dieser Abnahme erledigt) sowie die §8-Frage aus der
Nachführung nach Phase 4d (mechanische Bereinigungen gleich auf sonnet).
