# Abnahme Phase 5 Etappe 4 (Musik aus Dateien des Betreibers)

## 1. Umfang

Branch `phase5-4` (von `master`, nach dem Plan-Commit `f9a51c5`, nicht gepusht). Entwurf
`docs/superpowers/specs/2026-09-23-phase5-design.md` §6 (Fassung vom 24.09.2026: keine
mitgelieferte Musik, der Betreiber legt eigene MP3-Dateien und eine Liste ab), Plan
`docs/superpowers/plans/2026-09-24-phase5-etappe4-musik.md`. Umsetzung:

- `fa26226` — Liste des Betreibers prüfen, Ablage und Anleitung (Task 1): `src/ui/musikStand.ts`
  (Ladezustand für die Oberfläche, nicht Teil der Sitzung), `src/app/musikListe.ts` (Laden und
  Prüfen von `musik/stuecke.json`), Ignore-Eintrag für `public/musik/`, Cache-Eintrag für `.mp3`
  in `public/.htaccess`, README-Abschnitt „Eigene Musik" (§6.1).
- `7b36a0b` — Store-Feld `ton` mit Modus, Lautstärke und Stummschaltung (Task 2):
  `ton: { modus, lautstaerke, stumm }` in `src/store/types.ts`/`index.ts`, Grenzen in
  `store/pruefer.ts`, reist mit der Sitzung (nicht im Link, nicht in Ansichten) (§6.2).
- `aa68161` — wann gespielt wird und in welcher Folge (Task 3): `src/app/musikFolge.ts` mit
  `sollSpielen`, `erzeugeFolge`/Mischfolge ohne unmittelbare Wiederholung, Blend- und
  Überblendkonstanten `BLENDE_S`/`UEBERBLENDUNG_S` (§6.3).
- `6c5a07b` — Spieler mit Blenden und Start aus der Liste des Betreibers (Task 4):
  `src/app/musik.ts` (zwei `HTMLAudioElement`s über je einen `GainNode`, `AudioContext`,
  Autoplay-Fortsetzung bei `pointerdown`/`keydown`), Einbindung in `src/app/main.tsx` außerhalb
  von React, analog `sicherungStarten` (§6.3, Plan-Ruling).
- `933d59e` — Bedienung im Kino-Abschnitt und Taste M (Task 5): `src/ui/panels/MusikSteuerung.tsx`
  (Umschalter, Regler, Kästchen „Stumm (M)", Zeile zum laufenden Stück), Taste **M** in
  `useShortcuts.ts`, Kürzelübersicht nennt sie nur mit verfügbarer Musik (§6.4).

Dieser Task (Messung und Abnahme) ändert am Code nichts; alle Ist-Werte in §3 entsprechen dem
Stand `933d59e`.

## 2. Lint, Tests, Build

Auf `933d59e` (24.09.2026, eigener Lauf für diese Abnahme):

- `npm run lint`: `eslint .` ohne Befund.
- `npm test`:

  ```
  Test Files  115 passed (115)
       Tests  5275 passed (5275)
  ```

  Stand vor der Etappe 5235 (Ende Etappe 5-3); die Etappe brachte 40 zusätzliche Tests über die
  fünf Umsetzer-Tasks, dieser Task ändert daran nichts.
- `npm run build` (`tsc -b && vite build`): Hauptchunk `index-B7WVnS-w.js` **1 529,67 kB** (gzip
  423,91 kB), nur der bekannte Hinweis zu Chunkgrößen über 500 kB. Stand vor der Etappe
  **1 523,15 kB** (Ende Etappe 5-3), Grenze **1 571,79 kB** (Entscheidung von Jens in Etappe 5-3);
  die Etappe wuchs um 6,52 kB, rund 42,12 kB unter der Grenze — keine Frage an Jens nötig.
- Wort- und Trailerprüfung der lokalen Projektanleitung für alle Commits und neuen Dateien dieser
  Etappe (siehe dort): Ergebnis 0 bzw. leer.

## 3. Messung im Browser

Aufbau: Fenster zunächst 1008 × 615, für den Bedienungs-Screenshot auf 1400 × 1300 CSS-Pixel
vergrößert (damit der Musikabschnitt vollständig sichtbar ist, ohne zu scrollen),
`devicePixelRatio` 1, `quality.tier` auf `high` direkt nach jedem Navigieren. Die Testtöne waren
**Stille**, nicht Sinustöne wie ursprünglich im Auftrag vorgesehen: ein früherer Messlauf musste
abgebrochen werden, weil die Sinustöne über die Lautsprecher des Arbeitsplatzes zu hören waren.
Beide Dateien entstanden per `anullsrc` (`ffmpeg -f lavfi -i "anullsrc=r=44100:cl=stereo" -t 20
-b:a 128k`), vor der ersten Wiedergabe per `volumedetect` als still bestätigt (`max_volume: -91.0
dB` bei beiden Dateien, unter der Grenze −90 dB). Die Gain-Werte (Blende, Kanäle, Lautstärke)
sind davon unabhängig, da sie den Verstärker steuern, nicht das Signal messen. Beide Dateien und
die Liste `musik/stuecke.json` (`test-a.mp3` mit Titel „Test A" und Urheber „Sinus", `test-b.mp3`
nur mit Link) lagen ausschließlich im git-ignorierten `public/musik/` und wurden nach der
Messung wieder gelöscht (§7 unten, Selbstprüfung).

Eine erste Messung zeigte verunreinigte Startwerte durch persistierten Zustand aus dem
abgebrochenen ersten Lauf (`ton.modus` und `cinema` in `localStorage`); vor der eigentlichen
Messung wurde `localStorage` geleert und neu geladen, danach lieferten alle Punkte einen sauberen
Ausgangszustand.

| # | Messpunkt | Soll | Ist | erfüllt |
|---|---|---|---|---|
| 1 | Einblenden: `blende` 0 → 1 | 1,5 s ± 0,15 s | ≈ 1,49–1,54 s (0,9938 bei 1,487 s, 1,0 bei 1,538 s) | ja |
| 1 | Lautstärke während des Einblendens | konstant 0,5 | konstant 0,5 | ja |
| 1 | Genau ein Element spielt | ein Element aktiv, eines pausiert | durchgehend `pausiert` `[true, false]` bzw. `[false, true]` | ja |
| 1 | `zeit` des aktiven Elements | wächst | 8,826 s → 11,279 s über 2,5 s Messfenster (Δ 2,45 s) | ja |
| 2 | Ausblenden: `blende` 1 → 0 | 1,5 s ± 0,15 s | ≈ 1,48–1,50 s (0,0329 bei 1,451 s, 0 bei 1,501 s) | ja |
| 2 | Danach beide Elemente pausiert | ja | `pausiert` `[true, true]`, `zeit` eingefroren bei 12,826127 s | ja |
| 2 | Fortsetzen (kein Neustart) | `zeit` läuft ab dem eingefrorenen Wert weiter | nach 0,3 s Wartezeit `zeit` 13,140 s (Δ 0,313 s ≈ Wartezeit) statt 0 | ja |
| 3 | Überblendung: `kanaele` kreuzen 1/0 → 0/1 | 3 s ± 0,3 s | Beginn zwischen 1,17 s und 1,22 s, Ende zwischen 4,18 s und 4,23 s ⇒ rund 3,0 s | ja |
| 3 | Danach altes Element pausiert | ja | `pausiert` wechselt auf `[false, true]` (bzw. spiegelbildlich) | ja |
| 3 | `stueck` wechselt | ja | 0 → 1 | ja |
| 4 | Taste M (1. Druck) | `spielt` → false, `blende` → 0 | `stumm` true, `spielt` false, `blende` 0 (Endzustand; siehe Anmerkung unten) | ja |
| 4 | Taste M (2. Druck) | `spielt` → true | `stumm` false, `spielt` true, `blende` bereits wieder 1 | ja |
| 5 | Verdeckter Tab: `blende` fällt auf 0, danach wieder 1 | ja, bei `visibilitychange` | kein `visibilitychange` ausgelöst, `document.visibilityState` durchgehend `visible`, `blende` blieb 1 | nicht beobachtbar (§7) |
| 6 | Umschalter/Regler/Kästchen/Zeile im Kino-Abschnitt | sichtbar und beschriftet | Screenshot bestätigt: Gruppe „Aus/Nur Kino/Immer" (⁠`Immer` gedrückt), Regler „Lautstärke" (0,5), Kästchen „Stumm (M)", Zeile „♪ Test A — Sinus" und (in der Zugriffsstruktur) „♪ test-b.mp3" mit Link | ja |
| 6 | Kürzelübersicht nennt „M" | ja | Eintrag „M — Musik stumm schalten" vorhanden | ja |
| 7 | Ohne Liste: Anfragen an die Liste | genau 1 | genau 1 (`GET /Orrery/musik/stuecke.json`, Status 200 mit `index.html`, siehe Ruling in §6) | ja |
| 7 | Ohne Liste: `.mp3`-Anfragen | keine | keine | ja |
| 7 | Ohne Liste: `window.musik` | nicht vorhanden | `typeof window.musik === 'undefined'` | ja |
| 7 | Ohne Liste: Musikbedienung im Kino-Abschnitt | nicht vorhanden | kein „Musik"-Abschnitt in der Zugriffsstruktur | ja |
| 7 | Ohne Liste: Kürzelübersicht ohne „M" | ja | kein „M"-Eintrag mehr | ja |
| 7 | Ohne Liste: Taste `m` ohne Wirkung | ja | `ton.stumm` blieb `false` | ja |
| 7 | Ohne Liste: Konsole | keine Meldungen | 0 Fehler, 0 Warnungen | ja |

Anmerkung zu Punkt 4: Die Taste wurde als echter Tastendruck ausgelöst (eigener Aufruf,
getrennt von der Zeitreihenmessung); durch die reale Zeit zwischen Tastendruck- und
Ablesevorgang war die Blendkurve selbst nicht laufend zu erfassen, nur der Endzustand (Soll
laut Auftrag: `spielt` wird `false`/wieder `true`, `blende` fällt auf 0 — beides bestätigt).

## 4. Betreiberanleitung

README-Abschnitt „Eigene Musik" (unverändert seit `fa26226`, siehe §1): Dateien in
`public/musik/` ablegen (auf dem Webspace neben `index.html`), daneben `musik/stuecke.json` mit
mindestens dem Pflichtfeld `datei` je Eintrag (`titel`, `urheber`, `link` freiwillig). Ohne
Liste oder mit leerer Liste bleibt Orrery still und zeigt keine Bedienung; mit Liste erscheint im
Kino-Abschnitt der Umschalter „Aus / Nur Kino / Immer", ein Lautstärkeregler und „Stumm (M)".
Rechte, Lizenz und Namensnennung der hinterlegten Stücke liegen allein beim Betreiber; Orrery
gleicht Lautheit und Format nicht an. Ordner und Liste sind git-ignoriert und werden nur mit
`npm run deploy` mitgeladen, niemals versioniert.

## 5. Bedienung und Barrierefreiheit

Quellprüfung `src/ui/panels/MusikSteuerung.tsx` (Stand `933d59e`):

- Der Umschalter ist eine `role="group"` mit `aria-label`; jede Schaltfläche trägt
  `aria-pressed={ton.modus === modus}`.
- Regler und Kästchen sind über `<label htmlFor>` mit `useId()`-Kennungen an ihre Eingabefelder
  gebunden (kein bloßer Text daneben).
- Der Link zum laufenden Stück trägt `target="_blank"` und `rel="noopener noreferrer"`.
- Taste **M** prüft in `useShortcuts.ts` zuerst `useMusikStand.getState().verfuegbar`; ohne
  gültige Liste hat sie keine Wirkung (§3, Punkt 7) und fehlt in der Kürzelübersicht.

## 6. Rulings

Rulings des Plans (`constraints.md`, Global Constraints):

- `zurueckgesetzt` (Kopfzeile „Zurücksetzen") behält `ton` wie Sprache und Qualitätsstufe, weil es
  eine Vorliebe ist und kein Blickzustand.
- Die Bedienung bekommt zusätzlich zu Umschalter und Regler ein Kästchen „Stumm (M)", damit der
  Zustand der Taste M sichtbar ist; der Entwurf nennt nur die Taste.
- Ein Link aus der Liste zählt nur mit `http://` oder `https://`; ein Dateiname mit `/`, `\` oder
  gleich `.`/`..` wird verworfen, gültige Namen werden per `encodeURIComponent` gesetzt.
- Der Musikstart läuft wie `sicherungStarten` außerhalb von React (`app/main.tsx`), damit der
  StrictMode-Doppelaufbau ihn nicht verdoppelt.

Ruling aus dem Ledger (Task 4, gilt auch für diesen Task, Messpunkt 7):

- Im Entwicklungsserver gilt „200 mit `index.html`" für die fehlende Liste als gleichwertig zu
  404 — die Anwendung bleibt in beiden Fällen still, und Apache auf dem Webspace hat keinen
  Rewrite-Fallback (`.htaccess` ohne `RewriteRule`/`ErrorDocument`). Kostet, falls falsch: eine
  Nachmessung am Build (`vite preview`). Durch Messpunkt 7 (§3) bestätigt: genau eine Anfrage,
  keine `.mp3`-Anfrage, keine Bedienung.

Für diesen Task war keine Korrektur nötig: alle Messwerte lagen innerhalb der Sollbereiche, es
gibt keine neue Ruling-Zeile.

## 7. Bekannte Unschärfen

Aus dem Ledger (zurückgestellt, kein Merge-Hindernis):

- Task 1: `link()` akzeptiert `HTTPS://` in Großschreibung (Flag `/i`), dafür kein eigener
  Testfall.
- Task 2: Grenzwerte `ton.lautstaerke` 0/1 und die Modi `aus`/`kino` sind nicht einzeln getestet.
- Task 3: Der Tausch an der Rundengrenze der Mischfolge bevorzugt immer Position 1 (leichte
  Verzerrung, die Anforderung „nicht zweimal hintereinander" ist trotzdem erfüllt).
- Task 3: `erzeugeFolge`/`mischeRunde` sind ohne Schutz für `anzahl ≤ 0`; der Aufrufer
  `musikStarten` fängt eine leere Liste vorher ab.
- Task 4: Die Element-Listener werden in `beenden()` nicht abgemeldet, `beiZeit`/`beiFehler`/
  `ended` prüfen `beendet` nicht (die Funktion `beenden()` ist heute ungenutzt).
- Task 5: Kein Test für die Beschriftung ohne Urheber.
- Task 5: Der Gruppenname „Musik" wiederholt die Abschnittsüberschrift; „Musikmodus" wäre
  spezifischer.

Aus diesem Task (Messung, §3):

- Messpunkt 5 (verdeckter Tab): Der über die Zugriffswerkzeuge geöffnete zweite Tab hat im
  ersten Tab kein `visibilitychange`-Ereignis ausgelöst, `document.visibilityState` blieb
  durchgehend `visible`. Ob das Ein- und Ausblenden bei echtem Tabwechsel funktioniert, ist mit
  diesem Werkzeug nicht zu belegen; laut Quelltext hängt die Wiedergabe an genau diesem Ereignis
  (§6.3 des Entwurfs), eine Prüfung mit echtem Tabwechsel (etwa von Hand) steht aus.

## 8. Fragen an Jens

1. **Hörprüfung mit eigenen Stücken** auf Desktop und auf dem A55 — diese Messung konnte nur mit
   stillen Testdateien und über Zustandswerte erfolgen (siehe oben); ob die Wiedergabe tatsächlich
   wie erwartet klingt und wie laut sie ist, lässt sich nur von Hand mit echten Dateien prüfen.
   Wird in der Gesamtabnahme 5-5 gesammelt geprüft.
2. **Messpunkt 5 (verdeckter Tab, §7)**: Soll die Prüfung mit echtem Tabwechsel von Hand
   nachgeholt werden (etwa zusammen mit Frage 1 in 5-5), oder genügt die Prüfung am Quelltext?
