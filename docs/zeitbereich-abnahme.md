# Abnahme Zeitbereich (Absturz ab dem Jahr 12 563)

## 1. Umfang

Branch `zeitbereich` (von `master` b24fc6a). Plan `docs/superpowers/plans/2026-09-19-zeitbereich.md`
(Commit ccb398c). Umsetzung:

- ccb398c — Plan Zeitbereich: Absturz der Bahnrechnung ab dem Jahr 12 563
- 6566e32 — Zeitbereich: Julianischer Tag 0 bis 31. Dezember 9999
- 65ec67c — Bildschleife hält am Rand des Zeitbereichs an und übersteht Ausnahmen
- 70a02c2 — Hochschultext Entstehung: Zeitbereich statt Absturz im Modell
- 9ebba4f — Kino: Zeitsprung zur Mondfinsternis bleibt im Zeitbereich
- 46c7319 — Datumsfeld: Jahre vor 1 und nach 9999 leer statt ungültig (Fix-Runde 1 zu
  dieser Abnahme, siehe §5)
- 0973441 — Zeitanzeige mit Ära vor Christus, Datumsfeld für die Jahre 1 bis 99 (Nacharbeit
  nach der Schlussprüfung, siehe Schlussabschnitt)
- 7c0586c — Bildschleife meldet einen Fehler nach Erholung erneut; Kommentare zum
  Zeitbereich präzisiert (dito)
- f5cf7cb — Hochschultext Entstehung: Exzentrizitäten der Planeten (dito)

Ursache: Die JPL-Bahnelemente werden in `elementsAt` linear über die Zeit fortgeschrieben;
bei weit entfernten Jahren wird dadurch zum Beispiel Saturns Exzentrizität negativ, `solveKepler`
wirft dann einen Fehler, den die Bildschleife nicht abfängt und dauerhaft stehen bleibt.
Entscheidung (Jens, 19.09.2026): Die Zeit wird auf den Julianischen Tag 0 (4713 v. Chr.) bis
31. Dezember 9999, 0 Uhr UTC (JD 5 373 483,5) begrenzt — der Zeitraffer hält am Rand an, Link
und Sitzung werden auf diesen Bereich geprüft, die Bahnrechnung selbst bleibt unverändert.

## 2. Lint, Tests, Build

- `npm run lint`: `eslint .` ohne Ausgabe, kein Befund (zuletzt nach f5cf7cb).
- `npm test`: Test Files 93 passed (93); Tests 3686 passed (3686).
- `npm run build`: `✓ built in 678ms` (nach f5cf7cb), nur der bekannte Hinweis zu Chunkgrößen
  über 500 kB.

Testzahl-Herleitung: Ausgangsstand 3665 → 3673 nach 6566e32 (+8, Task 1) → 3677 nach 65ec67c
(+4, Task 2) → 3677 nach 70a02c2 (unverändert, Task 3) → 3678 nach 9ebba4f (+1, Fix-Runde 1 zu
Task 1: Testfall für den Kino-Zeitsprung) → 3682 nach 46c7319 (+4, Fix-Runde 1 zu dieser Abnahme:
Testfälle für `jdZuDatumsfeld`) → 3686 nach der Nacharbeit zur Schlussprüfung (+4: zwei
Ära-Testfälle in `format.test.ts`, ein Testfall im Datumsfeld für die Jahre 1 bis 99, ein
Testfall für die erneute Meldung nach Erholung in `loop.test.ts`; 0973441, 7c0586c, unverändert
durch f5cf7cb).

## 3. Sichtprüfung

| Kriterium | Messwert |
|---|---|
| Zeitraffer oben (Start JD_MAX − 3650, 365 250 d/s): `jd` nach Anschlag | 5 373 483,5 |
| Zeitraffer oben: `paused` | true |
| Zeitraffer oben: Bilder/s nach dem Anschlag (eigener `requestAnimationFrame`-Zähler, 1 s) | 60 (> 30) |
| Zeitraffer unten (Start 3650, −365 250 d/s): `jd` nach Anschlag | 0 |
| Zeitraffer unten: `paused` | true |
| Zeitraffer unten: Bilder/s nach dem Anschlag (eigener `requestAnimationFrame`-Zähler, 1 s) | 60 (> 30) |
| Datumsfeld `max` | `9999-12-31` |
| Datumsfeld-Wert bei `jd = 0` (nach Fix-Runde 1, siehe §5) | `''` (leer) |
| Datumsfeld-Wert bei `jd = JD_MAX` | `9999-12-31` |
| Konsolenfehler seit dem Navigieren | 0 |
| Neue Konsolenwarnung bei `jd = 0` (nach Fix-Runde 1) | keine |
| Zeitanzeige bei `jd = 0` (nach der Nacharbeit zur Schlussprüfung) | „24.11.4714 v. Chr., 12:00" |

`window.renderer.info.render.frame` zählt Renderdurchgänge, nicht Bilder — der Composer rendert
mehrere Durchgänge je Bild (in derselben Ladung gemessen: rund 1020 Durchgänge/s gegenüber 60
Bildern/s mit dem `requestAnimationFrame`-Zähler, Faktor rund 17). Maßgeblich für das Kriterium
„über 30" ist die Bildzahl aus dem `requestAnimationFrame`-Zähler.

## 4. Rulings der Umsetzung

- Die während der Reviews von Task 1/Task 2 gefundene Kino-Lücke (`tickCinema` schrieb beim
  Szenenbeginn den Zeitpunkt der nächsten Mondfinsternis ungeklemmt) wurde als eigene Fix-Runde
  zu Task 1 geschlossen statt als neuer Task geführt, weil sie dieselbe Invariante betrifft und
  nicht im ursprünglichen Plan stand.
- Das Datumsfeld zeigt für Jahre außerhalb 1 bis 9999 künftig bewusst leer (reine Funktion
  `jdZuDatumsfeld` mit Tests) statt eines ungültigen Werts mit Konsolenwarnung — `<input
  type="date">` kann Jahre vor 1 grundsätzlich nicht darstellen. Die untere Grenze bleibt JD 0,
  wie von Jens gewählt; die Rückfrage dazu hatte die Untergrenze fälschlich als „wie das
  Datumsfeld" beschrieben (das stimmt nur für die Obergrenze). Falls falsch: Jens möchte die
  Untergrenze auf das Jahr 1 legen, dann ändern sich `JD_MIN` und ein Textsatz.
- Final Ruling (Schlussprüfung): Eine Fix-Welle vor dem Merge für die Befunde I1, I2, I3 (Jahre
  vor 1 mit „v. Chr."/„BC", weil der Zeitraffer jetzt genau dort anhält), M1 (Jahre 1–99 im
  Datumsfeld), M2 (Meldung nach Erholung erneut), die ungenauen Kommentare, §5 Kino am Rand und
  die Prüfspalte der Belegzeilen 108/118 — alles klein und am Rand des neuen Bereichs sichtbar.
  Falls falsch: ein paar Zeilen mehr im Merge.
- Final Ruling (Schlussprüfung): `imZeitbereich(NaN)` bleibt zurückgestellt — kein Schreiber
  liefert `NaN` (das Datumsfeld prüft `Number.isFinite`, die Schleife rechnet mit endlichen
  Werten, der Prüfer verwirft `NaN`). Falls falsch: ein `NaN`-`jd` würde wie bisher durchgereicht.

## 5. Bekannte Unschärfen

- Die Bildschleife fängt nur den Aufruf von `onFrame` ab; ein Wurf aus dem Zustands-Update davor
  (der Store ruft seine Abonnenten synchron: Sicherung, Themenverfall, React-Abos) würde
  weiterhin das nächste Bild verhindern (so im Plan vorgesehen). Bleibt zurückgestellt (Final
  Ruling der Schlussprüfung, siehe §4): Die Ursache — ungültige Zeit — ist durch die Klemmung
  beseitigt, die Abonnenten sind billig und rechnen keine Bahnen. Wer die Schleife wieder
  anfasst: `requestAnimationFrame(tick)` an den Anfang von `tick` ziehen (nach
  `if (!laeuft) return;`), dann beendet kein Wurf mehr die Schleife. Die Unterdrückung
  wiederholter, gleicher Meldungen nach einer Erholung ist dagegen behoben (Commit 7c0586c,
  Nacharbeit zur Schlussprüfung): `letzteMeldung` wird nach einem erfolgreichen Bild
  zurückgesetzt, ein wiederkehrender Fehler meldet sich nach Erholung erneut.
- Im Kino setzt `tickCinema` `paused` jedes Bild zurück; am Rand des Zeitbereichs steht die Zeit
  (die Bildschleife klemmt sie), der Film läuft mit stehenden Körpern weiter, weil die
  Szenendauer an `dtSek` hängt, nicht an der Zeit. Eine Szene „Mondfinsternis" nahe JD_MAX
  springt deshalb auf JD_MAX, ohne dass die Finsternis zu sehen ist. Kein Hänger.
- `imZeitbereich(NaN)` liefert `NaN` — praktisch nicht erreichbar (die Pfeiltaste rechts
  vervielfacht die Zeitrate ohne Obergrenze, vorbestehend und unabhängig von dieser Etappe; erst
  nach rund 1750 Anschlägen `Infinity`, `Infinity · 0` bei `dtSek = 0` ergäbe `NaN`), Folge wäre
  ein stehendes Bild mit einer Konsolenmeldung, kein Absturz. Zurückgestellt (Final Ruling der
  Schlussprüfung, siehe §4).
- Ob der Text den Kalenderunterschied nennt (1. Januar 4713 v. Chr. julianisch = 24. November
  4714 v. Chr. gregorianisch, seit der Nacharbeit in der Zeitanzeige sichtbar), ist offen und
  bei Jens zu erfragen.
- Eigener Befund dieser Abnahme, behoben (Commit 46c7319): Die frühere Umrechnung des
  Datumsfelds schnitt `toISOString()` auf zehn Zeichen zu. Bei negativem Jahr fehlte darin der
  Tag (z. B. „-004713-11" statt eines vollständigen Datums), der Browser verwarf den Wert, das
  Feld blieb leer und protokollierte eine Formatwarnung. Der Fehler bestand unabhängig von
  dieser Etappe, trat aber am unteren Rand des jetzt weiteren Zeitbereichs (4713 v. Chr.) häufiger
  auf. Die Umrechnung ist jetzt die reine Funktion `jdZuDatumsfeld` in `src/ui/format.ts`: Sie
  liefert `''` für Jahre (UTC) außerhalb 1 bis 9999 — `<input type="date">` kann Jahre vor 1
  grundsätzlich nicht darstellen. Nachgeprüft: bei `jd = 0` bleibt das Feld leer, ohne neue
  Konsolenwarnung.

## Nacharbeit nach der Schlussprüfung

Eine unabhängige Schlussprüfung des ganzen Branches (b24fc6a..2be99da) fand 0 Critical, 3
Important (I1–I3) und 8 Minor (M1–M8); die Absturzbehebung selbst wurde als vollständig und
korrekt bewertet. Jens' Final Ruling: eine Fix-Welle vor dem Merge für I1–I3, M1, M2, die
ungenauen Kommentare, §5 Kino am Rand und die Prüfspalte der Belegzeilen 108/118 (§4);
`imZeitbereich(NaN)` (M5) und der Ausnahmeschutz nur um `onFrame` (M3) bleiben zurückgestellt
(§5).

Befunde und Fixes:

- **I3** — Am unteren Rand zeigte die Zeitanzeige „24.11.4714, 12:00" ohne Ära; JD 0 ist
  proleptisch gregorianisch der 24. November 4714 v. Chr., der Zeitraffer hält jetzt genau dort
  an. `formatJd` (`src/ui/format.ts`) verwendet für Jahre (UTC) unter 1 einen zweiten,
  gecachten Formatierer mit `era: 'short'`. Zeigt jetzt „24.11.4714 v. Chr., 12:00" (de) bzw.
  „24/11/4714 BC, 12:00" (en), im Browser nachgeprüft (§3). Tests in `format.test.ts` für beide
  Sprachen, dazu ein Test, dass ein Datum ab Jahr 1 unverändert ohne Ära bleibt.
- **M1** — Das Datumsfeld bildete die Jahre 0–99 über `Date.UTC` auf 1900–1999 ab
  (`Date.UTC(50, 2, 1)` → 1950-03-01). `TimePanel.tsx` setzt das Jahr jetzt über
  `setUTCFullYear`, das die Jahre 1–99 wörtlich nimmt. Test mit Eingabe `0050-03-01`.
- **M2** — `letzteMeldung` in der Bildschleife blieb nach einer Erholung stehen; ein
  wiederkehrender Fehler wurde nie wieder gemeldet. `loop.ts` setzt `letzteMeldung = ''` nach
  einem erfolgreichen Bild. Test: werfen, gelingen, werfen → zwei Meldungen.
- **Kommentare** — `store/index.ts:67` nannte das Kino fälschlich als Weg über `setTime` (es
  schreibt `jd` selbst über `useStore.setState` und klemmt dort); `sim/time.ts:7-9` behauptete,
  die Bahnelemente blieben im Zeitbereich „gültig" (tatsächlich nur „rechenbar", e in [0, 1));
  außerdem klemmt der Prüfer nicht, er verwirft. Beide Kommentare präzisiert.
- **I1** — Der Hochschultext nannte „alle fortgeschriebenen Exzentrizitäten"; das gilt nur für
  die acht Planeten (mehrere Monde liegen mit e darunter, die englische Fassung war wörtlich
  falsch). Text de/en auf „die Exzentrizitäten der Planeten" eingeschränkt, sonst unverändert;
  Belegzeile 118 ebenso. Belegzeilen 108 und 118 zusätzlich mit dem Prüfergebnis der Umsetzung
  versehen.
- **I2** — Diese Abnahme (§4) führte bisher nur das Kino-Ruling, nicht das zweite Ruling zum
  Datumsfeld samt dem Hinweis auf die ungenaue Rückfrage; jetzt beide sowie beide Final-Ruling-
  Zeilen ergänzt.
- **M6** — §5 nannte das Kino am Rand nicht: Die Zeit steht (die Bildschleife klemmt), der Film
  läuft mit stehenden Körpern weiter. Ergänzt.

Kein Critical, kein Absturz gefunden; die Invariante „`time.jd` in [JD_MIN, JD_MAX]" gilt laut
Schlussprüfung für alle realen Schreiber.

Commits dieser Nacharbeit:

- 0973441 — Zeitanzeige mit Ära vor Christus, Datumsfeld für die Jahre 1 bis 99 (I3, M1)
- 7c0586c — Bildschleife meldet einen Fehler nach Erholung erneut; Kommentare zum Zeitbereich
  präzisiert (M2, Kommentare)
- f5cf7cb — Hochschultext Entstehung: Exzentrizitäten der Planeten (I1, Belegzeilen 108/118)

Prüfläufe danach: `npm run lint` ohne Befund, `npm test` 3686 Tests grün (93 Dateien),
`npm run build` erfolgreich (nur der bekannte Chunkgrößen-Hinweis, siehe §2).

Trailer- und Wortprüfung nach der lokalen Projektanleitung durchgeführt, Ergebnis 0.
