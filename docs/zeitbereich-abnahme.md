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

Ursache: Die JPL-Bahnelemente werden in `elementsAt` linear über die Zeit fortgeschrieben;
bei weit entfernten Jahren wird dadurch zum Beispiel Saturns Exzentrizität negativ, `solveKepler`
wirft dann einen Fehler, den die Bildschleife nicht abfängt und dauerhaft stehen bleibt.
Entscheidung (Jens, 19.09.2026): Die Zeit wird auf den Julianischen Tag 0 (4713 v. Chr.) bis
31. Dezember 9999, 0 Uhr UTC (JD 5 373 483,5) begrenzt — der Zeitraffer hält am Rand an, Link
und Sitzung werden auf diesen Bereich geprüft, die Bahnrechnung selbst bleibt unverändert.

## 2. Lint, Tests, Build

- `npm run lint`: `eslint .` ohne Ausgabe, kein Befund (nach 9ebba4f und erneut nach 46c7319).
- `npm test`: Test Files 93 passed (93); Tests 3682 passed (3682).
- `npm run build`: `✓ built in 643ms` nach 9ebba4f, `✓ built in 703ms` nach 46c7319 — beide Male
  nur der bekannte Hinweis zu Chunkgrößen über 500 kB.

Testzahl-Herleitung: Ausgangsstand 3665 → 3673 nach 6566e32 (+8, Task 1) → 3677 nach 65ec67c
(+4, Task 2) → 3677 nach 70a02c2 (unverändert, Task 3) → 3678 nach 9ebba4f (+1, Fix-Runde 1 zu
Task 1: Testfall für den Kino-Zeitsprung) → 3682 nach 46c7319 (+4, Fix-Runde 1 zu dieser Abnahme:
Testfälle für `jdZuDatumsfeld`).

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

`window.renderer.info.render.frame` zählt Renderdurchgänge, nicht Bilder — der Composer rendert
mehrere Durchgänge je Bild (in derselben Ladung gemessen: rund 1020 Durchgänge/s gegenüber 60
Bildern/s mit dem `requestAnimationFrame`-Zähler, Faktor rund 17). Maßgeblich für das Kriterium
„über 30" ist die Bildzahl aus dem `requestAnimationFrame`-Zähler.

## 4. Rulings der Umsetzung

- Die während der Reviews von Task 1/Task 2 gefundene Kino-Lücke (`tickCinema` schrieb beim
  Szenenbeginn den Zeitpunkt der nächsten Mondfinsternis ungeklemmt) wurde als eigene Fix-Runde
  zu Task 1 geschlossen statt als neuer Task geführt, weil sie dieselbe Invariante betrifft und
  nicht im ursprünglichen Plan stand.

## 5. Bekannte Unschärfen

- Die Bildschleife fängt nur den Aufruf von `onFrame` ab; ein Wurf aus dem Zustands-Update davor
  würde weiterhin das nächste Bild verhindern (so im Plan vorgesehen). Die Unterdrückung
  wiederholter, gleicher Meldungen gilt für die gesamte Lebensdauer der Schleife, auch nach
  einer Erholung.
- Eigener Befund dieser Abnahme, behoben (Commit 46c7319): Die frühere Umrechnung des
  Datumsfelds schnitt `toISOString()` auf zehn Zeichen zu. Bei negativem Jahr fehlte darin der
  Tag (z. B. „-004713-11" statt eines vollständigen Datums), der Browser verwarf den Wert, das
  Feld blieb leer und protokollierte eine Formatwarnung. Der Fehler bestand unabhängig von
  dieser Etappe, trat aber am unteren Rand des jetzt weiteren Zeitbereichs (4713 v. Chr.) häufiger
  auf. Die Umrechnung ist jetzt die reine Funktion `jdZuDatumsfeld` in `src/ui/format.ts`: Sie
  liefert `''` für Jahre (UTC) außerhalb 1 bis 9999 — `<input type="date">` kann Jahre vor 1
  grundsätzlich nicht darstellen. Nachgeprüft: bei `jd = 0` bleibt das Feld leer, ohne neue
  Konsolenwarnung.

Trailer- und Wortprüfung nach der lokalen Projektanleitung durchgeführt, Ergebnis 0.
