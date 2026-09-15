# Klickflächen — Abnahmeprotokoll

## 1. Stand

- **Branch:** `klickflaechen`, HEAD vor diesem Commit `8bab2f3` (Entwurf Klickflächen:
  Nachtrag nach der Schlussprüfung).
- **Testzahl:** `npm test` → 81 Testdateien, 2003 Tests, alle grün.
- **Prüfrechner:** Fenster 2560 × 1440, `devicePixelRatio: 1` (aus den Messberichten
  7a/7b; Desktop mit RTX 4060 laut lokaler Projektanleitung).
- **Datum:** 15.09.2026.

## 2. Vorher-Belege (§9.1)

Gemessen in Task 1 am unveränderten master-Code, vor jedem Fix dieses Plans:

- **a) Fahrt im freien Modus:** Erde aus der Systemansicht bei 365 d/s über den
  Objektbaum angefahren. Abstand Erdmittelpunkt–Bildmitte: 1,5 s → 2259,09 px; 2 s
  und 3 s → `null` (Erde war zu diesem Zeitpunkt schon außerhalb des Bildes). Modus
  `free`.
- **b) Kino mit Objektbaum-Klick:** Kino gestartet, per `pointerdown` angehalten,
  Körper im Objektbaum angeklickt. Ergebnis: Modus bleibt `cinema`, `laeuft: true`
  (der Film lief unbeendet weiter).

Skriptanpassung des Umsetzers, für Teil b nötig, für Teil a nicht: `await warte(50)`
nach dem synthetischen `pointerdown`, bevor `knopf(...).click()` im Objektbaum
gerufen wird. Grund: `pointerdown` beendet die durch Untätigkeit ausgeblendete
Oberfläche (`useIdleHide`); ohne die Wartezeit rendert React die eingeblendete
Schaltfläche noch nicht, bevor der synthetische Klick sie trifft. Dieselbe
Skriptanpassung kommt in Task-7a/7b-Aufbauten für §9.7 wieder zum Einsatz.

## 3. Ergebnisse §9.2–§9.8

Zahlen aus `task7a-report.md` (§9.2, §9.3, §9.5, §9.7) und `task7b-report.md`
(§9.4, §9.6, §9.8), beide auf HEAD `084a958` gemessen (vor der Fixwelle; die
Fehlzuordnung Mars → Deimos aus §9.4 ist seither behoben, siehe Abschnitt 4).

| Kriterium | Messwert | erfüllt |
|---|---|---|
| §9.2 Fahrt heftet an: Erdmittelpunkt bei 3 s ≤ 3 px neben Bildmitte, Modus `attached` | Lauf 1: 1,60 px; Lauf 2: 1,78 px; beide `attached` (Zwischenwerte 1,5 s/2 s: 33,6/24,1 px bzw. 571,7/100,0 px, je nach Startwinkel) | erfüllt |
| §9.3 Hover: Differenz nur auf Bahnlinie/Namensrechteck, Kontrolle 0 Pixel | Kontrolle A↔B: 0 Pixel; A↔C (Zeiger auf Mars): 2045 Pixel, davon 0 außerhalb der 12-px-Maske um Bahn und Namensrechteck; Cursor `pointer` über Mars, Standard im Leeren | erfüllt |
| §9.4 Systemansicht: Trefferquote, Fehlzuordnungen benannt, verdeckte Monde getrennt gezählt | 33 Körper im Fenster geprüft: 28 Treffer, 4 verdeckte Monde (Phobos hinter Deimos, Dione hinter Tethys, Miranda hinter Uranus, Charon hinter Pluto — alle von `trefferBei` korrekt vorhergesagt), 1 Fehlzuordnung (Mars → Deimos, Sub-Pixel-Koinzidenz bei extremer Abstandskompression) | erfüllt (Fehlzuordnung als Befund dokumentiert und durch die Fixwelle behoben, Gegenprobe 3 in Abschnitt 4) |
| §9.4 Nahansicht Jupiter (+ Saturn im selben Fenster): Trefferquote, Fehlzuordnungen, verdeckte Monde | 12/12 Treffer (Jupiter + 4 Galileische Monde, Saturn + 6 Saturnmonde), 0 verdeckt, 0 Fehlzuordnung | erfüllt |
| §9.5 Bahnklick: Punkt auf Neptunbahn (≥ 100 px vom Planeten) → `neptune`; 30 px senkrecht daneben → Ziel unverändert | Treffer 1253,6 px von Neptun entfernt → `targetId: 'neptune'` nach 1,6 s; 30-px-Punkt → Kamera unverändert (`targetId: 'sun'`) | erfüllt |
| §9.6 Tippen: echter Tipp trifft, Modus `attached` | Tipp auf Mars → `targetId: 'mars'`, `mode: 'attached'` nach 1,6 s | erfüllt |
| §9.6 Tippen: 6-px-Druck auf einem Körper (bewertet nach dem Ruling in Abschnitt 5) | Azimut bleibt bei 6 px unverändert (unter der Fingerschwelle 10 px, Totzone); der Druck gilt nach Entwurf §5 als Tipp und fährt zu `mars` — Plantext „fährt nicht" bezog sich auf die leere Fläche, nicht auf einen Körper | erfüllt |
| §9.6 Tippen: 6-px-Druck auf leerer Fläche ändert nichts | Azimut, Modus und Ziel unverändert | erfüllt |
| §9.7 Kino: nach 3,5 s `attached` + `running:false`, nach `idleResumeSec+1s` weiterhin `running:false` | Objektbaum-Klick: `attached`/`mars`/`false`, danach weiterhin `false`; Maus-Klick auf sichtbaren Körper im Bild: `attached`/`earth`/`false`, danach weiterhin `false` | erfüllt |
| §9.8 Kosten: mittlerer Bildabstand mit Zeiger höchstens 1 ms schlechter als ohne | Differenz Zeiger auf Bahnfläche (A) − Zeiger über Panel (B): 0,0014 ms, über je zwei 10-s-Läufen | erfüllt |
| §9.8 Kosten: kein Bildabstand über 25 ms | Maximum über alle vier Läufe: 22,90 ms; Vergleichswert Node (`findeTreffer` + Projektion, 34 Bahnen × 513 Punkte + 35 Scheiben): 0,432 / 0,414 / 0,419 ms je Durchlauf | erfüllt |

**Methodikhinweis §9.4 (aus 7b):** Der erste Systemansicht-Durchlauf wurde verworfen.
Die Stabilisierungsprüfung maß die Konvergenz am Anker selbst (Sonne); die Sonne
projiziert im Modus `attached` aber unabhängig vom Zoom immer auf die Bildmitte, weil
sie gleichzeitig Anker und Blickpunkt ist. Die Zoom-Angleichung des Controllers blieb
dadurch unentdeckt, die ersten Klicks nach dem Systemblick trafen noch während des
laufenden Zooms daneben. Der korrigierte Durchlauf prüft stattdessen zwei
ankerfremde Körper (Jupiter, Neptun) auf Konvergenz; zwei besonders eng beieinander
liegende Fälle (Pluto/Charon, Makemake am Bildrand) wurden zusätzlich mit fester
3-s-Wartezeit statt der 0,5-px-Schwelle nachgeprüft. Ein Artefakt der Messmethode,
kein Befund über den Anwendungscode.

## 4. Nacharbeit nach der Schlussprüfung

Die Schlussprüfung (Paket `b1b8132..084a958`, ohne Browser) ergab „With fixes" mit
zwei Important- und mehreren Minor-Befunden sowie den in Task 7b gemessenen Befund
Mars → Deimos. Der Leiter hat Important 1, Important 2, die Fehlzuordnung
Mars → Deimos, Minor 1 und Minor 5 in eine gemeinsame Fixwelle gebündelt (ein
Umsetzer zur Zeit, siehe Ruling in Abschnitt 5).

| Befund | Ursache | Korrektur | Commit |
|---|---|---|---|
| Important 1: Klick auf einen nur durch Hover sichtbaren Namen trifft nichts oder falsch | `pointerdown` meldete sofort `onZeiger(null)`; ein Bild vor `pointerup` verschwand ein nur durch Hover gezeigter Name (Mond unter der Mondschwelle, `labels: false`) oder das verdrängte Nachbarlabel kehrte zurück | Hervorhebung bleibt bei Maus/Stift während des Drucks stehen; `onZeiger(null)` erst ab Überschreiten der Tippschwelle, zweitem Zeiger, `pointercancel`, `pointerleave`; Berührung meldet weiter beim Druck | `bda469d` |
| Important 2: Hervorhebung unter ruhendem, per `.zeiger-aus` unsichtbarem Zeiger | Der Zeiger blieb in der Szene gesetzt, `findeTreffer` lief je Bild weiter; im Kino mit geparkter Maus blinkten Bahnen und Mondnamen unter dem unsichtbaren Zeiger auf | `app/main.tsx` setzt je Bild vor `szene.update` den Zeiger auf `null`, solange `zeigerAusgeblendet()` (neue Abfrage in `src/ui/idle.ts`, synchron mit dem Ruhewächter) gilt | `bda469d` |
| Mars → Deimos (Systemansicht) | Rang 1 nahm bei zwei Glyphenscheiben unter 3 px Radius die vorderste nach Tiefe statt nach Nähe zur Zeigermitte | `Scheibe` bekommt das Feld `glyphe`; Rang 1 zweistufig: echte Scheiben nach Tiefe, Glyphenscheiben nach nächster Mitte, bei Gleichstand (0,5 px) Planet vor Mond | `6b43f0c` |
| Minor 1: Hover bei gedrückter Taste, die außerhalb der Canvas gedrückt wurde | Hover-Bedingung prüfte nur `aktive.size === 0`, nicht `e.buttons === 0` | `&& e.buttons === 0` ergänzt | `bda469d` |
| Minor 5: Controller-Kommentar unvollständig | Kommentar nannte nur das Kamera-Panel als Einfrierstelle, nicht `stopCinema` ohne gemerkten Zustand | Halbsatz ergänzt | `bda469d` |
| T5-Kommentar entfallen | Beim Ersetzen von `attachCameraInput` ging der Kommentar zu Maus/Stift/Berührung verloren | Kommentar wieder eingesetzt | `bda469d` |

Rot/Grün-Nachweise und die genauen Codestellen stehen in `fix-report.md`. Nach
`bda469d` 2000/2000 Tests, nach `6b43f0c` 2003/2003 Tests, `npx tsc -b` beide Male
ohne Ausgabe.

### Browser-Gegenproben (fix-report.md)

| Gegenprobe | Aufbau | Messwert | Ergebnis |
|---|---|---|---|
| 1. Klick auf Hover-Namen mit Verzögerung | Fall A (Nahansicht Jupiter, Io nur als Glyphe ohne Zeiger) und Fall B (Kollision: Io verdrängt Jupiters Namen) | Druck 162,7 ms bzw. 161,7 ms gehalten, Hervorhebung und Name bleiben stehen; nach 1615 ms/1616 ms `targetId: "io"`, `mode: "attached"` | erfüllt, beide Fälle |
| 2. Ruhender Zeiger im Kino | Kino läuft, Maus auf (1280, 720) geparkt, Kamera hält die Erde dauerhaft unter dem Zeiger | 181 Bilder über 3 s: `hervorgehoben()` in 0 Bildern gesetzt, obwohl `trefferBei` an der Stelle in allen 181 Bildern `earth` liefert; nach 5-px-Weckbewegung und zwei Bildern wieder `hover: "earth"`, `cursor: "pointer"` | erfüllt |
| 3. Mars in der Systemansicht | Sieben echte Klicks nacheinander, Kamera je Mal zurückgesetzt; Mars–Deimos 0,636 px, Mars–Phobos 0,228 px auseinander | Mars zweimal → `mars`; Deimos, Erde, Mond, Jupiter, Io je auf sich selbst; Phobos (0,228 px, unter der Gleichstandsgrenze) bleibt verdeckt hinter Mars | erfüllt |
| 4. Kurzprobe gegen Rückschritte | Maus auf Mars, `mouse.down`, stufenweise Bewegung | +3 px: Hervorhebung bleibt, Azimut unverändert; ab +8 px: Hervorhebung weg, Azimut dreht (−40·π/600 bei +40 px) | erfüllt |

Konsole nach allen vier Gegenproben: 0 Fehler, 0 Warnungen.

### Entwurfsnachtrag (Commit `8bab2f3`)

`docs/superpowers/specs/2026-09-15-klickflaechen-design.md` wurde an sieben Stellen
sachlich korrigiert, jeweils mit datiertem Hinweis „Nachtrag nach der Schlussprüfung
(15.09.2026)": §3.3 (Hover-Ablauf), §4.2 (Rang 1 zweistufig, Mars/Deimos-Befund),
§4.3 (Feld `glyphe`), §5 (Hover nur ohne gedrückte Taste), §7 (Ruhezustand,
`zeigerAusgeblendet()`), §8 (Testtabelle) und §9.6 (Kriteriumstext an §5
angeglichen). Wortprüfung im Entwurf zum Zeitpunkt der Fixwelle: leer.

Die Nachprüfung der Fixwelle (Paket `084a958..8bab2f3`) hat alle sieben Befunde als
behoben bestätigt, keine neuen Schäden.

## 5. Rulings

Alle Zeilen mit der Kennzeichnung „Ruling:" aus dem Ledger, in der Reihenfolge des
Ledgers. **Jens hat diese Entscheidungen noch nicht bestätigt.**

1. **Task 2, Prüfungsbefund:** Der Critical-Befund „Rot-Beleg im Bericht kann nicht
   so entstanden sein" gilt als erledigt, die falsche Ursachenerklärung im
   unversionierten Umsetzerbericht nur als Minor, keine zweite Fixrunde. —
   Begründung: Der Nachprüfer hat den Rot-Beleg selbst identisch reproduziert; Code,
   Test und der korrigierte Testkommentar sind richtig, die tatsächliche Ursache
   (`camera.lookAt` setzt die Quaternion vor `updateWorldMatrix`, `matrixWorldInverse`
   bleibt ein Bild alt) steht im Ledger. Eine Runde nur zur Berichtskorrektur ändert
   kein Artefakt im Repository. — Kosten, falls falsch: Der Umsetzerbericht zu
   Task 2 bleibt mit falscher Erklärung liegen; er wird mit dem Arbeitsbereich
   gelöscht und hat keinen Einfluss auf Code.
2. **Task 5, Prüfungsbefund:** Ein Test mit versetztem Rechteck (links ≠ oben) für
   Hover und Tippen wird ergänzt, mit Rot-Nachweis gegen eine Umrechnung ohne
   Versatz. — Begründung: Entwurf §4.1 verlangt die Umrechnung `clientX − rect.left`
   ausdrücklich, der Plan-Testcode ließ sie ungeprüft (jsdom liefert sonst immer ein
   Rechteck bei 0). — Kosten, falls falsch: ein Test mehr.
3. **Task 6, Prüfungsbefund:** Ein Szene-Test mit echten `THREE.Line`-Objekten
   (sichtbar/unsichtbar) und projizierter Zielposition wird ergänzt, mit
   Rot-Nachweis ohne den `visible`-Filter. — Begründung: Entwurf §4.4 ist bindend,
   der Plan-Mock ließ die Verdrahtung der Bahnschleife ungeprüft. — Kosten, falls
   falsch: ein Test und ein erweiterter Mock mehr.
4. **Schlussprüfung:** Important 1, Important 2, Minor 1, Minor 5 und der
   T5-Kommentar laufen in einem gemeinsamen Fixauftrag (ein Umsetzer zur Zeit):
   Die Hervorhebung bleibt bei Maus/Stift während des Drucks bis zur Tippschwelle
   stehen, `null` erst bei Ziehen, zweitem Zeiger, `pointercancel`/`pointerleave`
   und bei Berührung; Hover ruht, solange der Mauszeiger per `.zeiger-aus`
   ausgeblendet ist. — Begründung: Die Entwurfsabsicht (§2.2 Name am Körper
   sichtbar, §2.4 sichtbare Beschriftung ist Klickfläche, §5 keine Hervorhebung
   beim Ziehen) wurde vom wörtlichen „`pointerdown` → `onZeiger(null)`" verfehlt,
   der Fehler ist für Nutzer sichtbar. — Kosten, falls falsch: Falls ein Löschen der
   Hervorhebung schon beim Drücken gewollt war, trifft ein Klick auf einen
   Hover-Namen weiterhin ins Leere.
5. **Schlussprüfung:** Die Fehlzuordnung Mars → Deimos kommt in denselben
   Fixauftrag: Rang 1 wird zweistufig (echte Scheiben nach Tiefe, nur
   glyphenvergrößerte Scheiben nach nächster Mitte mit Planet vor Mond bei
   Gleichstand), neues Feld `glyphe` an `Scheibe`. — Begründung: Entwurf §4.2 „Ein
   Planet schlägt seine Monde, solange der Zeiger auf ihm liegt" wird von der
   reinen Tiefenregel bei 3-px-Glyphenscheiben verfehlt; in der Systemansicht trifft
   ein Klick auf einen Planeten sonst je nach Mondstellung den Mond. — Kosten, falls
   falsch: Ein Glyphenklick verliert gegen echte Scheiben die Tiefe als Kriterium;
   ein Glyphen-Mond auf einer echten Planetenscheibe wäre nur über den Objektbaum
   oder näheres Heranzoomen erreichbar.
6. **Task 7 (dieser Auftrag):** Dieser Auftrag formuliert Plan-Zeile 23 und
   Plan-Zeile 1263 neutral um (Verweis auf die Trailer- bzw. Wortprüfung nach der
   lokalen Projektanleitung, ohne Suchmuster) im selben Commit wie Protokoll und
   Ledger-Tabelle. — Begründung: Der Fehler steht seit `b1b8132` auch auf `master`
   in der Historie; eine frühere Aufräumaufgabe hat alte Pläne ebenso neutral
   umformuliert, ohne die Historie umzuschreiben. — Kosten, falls falsch: Jens will
   die Historie bereinigen (Rebase vor dem Push, destruktiv, nur mit ausdrücklicher
   Freigabe).
7. **Task 7:** Entwurf §9.6 „ein Druck mit 6 px Bewegung ändert den Azimut nicht
   und fährt nicht" widerspricht §5 (unter der Tippschwelle von 10 px gilt der Druck
   als Tippen und fährt zum getroffenen Körper). §5 ist die Verhaltensdefinition;
   §9.6 wird bewertet als: Azimut bleibt bei 6 px unverändert, sowohl auf einem
   Körper als auch auf leerer Fläche; „fährt nicht" gilt nur für die leere Fläche.
   — Begründung: Der Plantext setzt einen Tipp voraus, der nach §5 auf einem Körper
   gar nicht ausbleiben darf. — Kosten, falls falsch: Falls 6 px auf einem Körper
   als Ziehen gelten sollten, wäre die Fingerschwelle zu senken (Entwurfsänderung).
8. **Task 7:** Task 7 läuft in drei Aufträgen nacheinander — 7a (Messungen §9.2,
   §9.3, §9.5, §9.7), 7b (Messungen §9.4, §9.6, §9.8), 7c (dieses Protokoll, die
   Ledger-Tabelle im Plan und dieser Commit). Fast-Forward nach `master`, Löschen
   des Branches und die Nachträge in der lokalen Projektanleitung erfolgen erst nach
   der Schlussprüfung des ganzen Branches. — Begründung: Browser-Rundgänge
   verbrauchen viel Kontext, ein einzelner Auftrag riskiert den Abbruch mitten in
   der Messreihe. — Kosten, falls falsch: zwei zusätzliche Übergaben, der Merge
   folgt ein paar Minuten später.

## 6. Offene Frage an Jens

Aus der Schlussprüfung, kein Code betroffen: Ein Klick auf das aktuelle Kameraziel
fährt erneut an und setzt den Abstand zurück (Entwurf §6) — nah an einem
bildfüllenden Planeten wirkt dadurch jeder Klick ohne Ziehen wie ein Zoom-Reset. In
der Systemansicht trifft ein Klick „ins Leere" wegen der vielen dicht liegenden
Bahnen (34 Bahnen, je 8 px Fangradius) oft eine Bahn statt ins Leere zu gehen. Beides
ist gewolltes Verhalten nach dem aktuellen Entwurf — soll es dabei bleiben?

## 7. Bekannte Unschärfen

- Der Hinweis „Skriptabweichungen im Vorher-Beleg" (`warte(50)`, später
  Branchwechsel) ist nur über den Bericht von Task 1 belegt, nicht durch einen
  eigenen Test.
- Ein Test in Task 2 ruft `update` zweimal ohne Kommentar, warum.
- Der Umsetzerbericht zu Task 2 nennt eine falsche Ursache der veralteten
  Blickmatrix; die richtige Ursache steht im Ledger (`camera.lookAt` setzt die
  Quaternion vor `updateWorldMatrix`).
- Rang 3 (Mitte im Fangradius) vergleicht bei Gleichstand gegen die laufend
  gewählte Mitte; bei drei oder mehr Scheiben mit nicht transitiver
  0,5-px-Gleichheit hängt das Ergebnis von der Prüfreihenfolge ab (praktisch nicht
  erreichbar).
- `namensRechtecke()` und `trefferScheiben()` geben ihre internen Arrays zurück,
  `readonly` gilt nur im Typ, nicht zur Laufzeit.
- Die Tippbedingung in `input.ts` (`d.tippbar && !d.zieht && aktive.size === 0`)
  enthält einen redundanten Wächter (Plancode aus Task 5).
- Zwei getrennte DEV-Blöcke in `main.tsx` verwenden einen unterschiedlichen
  Typisierungsstil (Plancode aus Task 6).
- `bahnPuffer` schrumpft nie; bei konstanter Körperzahl ohne Wirkung.
- Schlussprüfung Minor 2: Ein Layoutdurchgang über `clientWidth` läuft nach
  `labels.update`; §9.8 zeigt dafür keine messbaren Kosten, deshalb zurückgestellt.
- Schlussprüfung Minor 3: Allokationen entstehen auch ohne Zeiger über der Canvas.
- Schlussprüfung Minor 4: Eine Glyphenscheibe liegt rund 2,6 px neben ihrer Glyphe.
- Schlussprüfung Minor 6: Testlücken aus der Schlussprüfung, im Einzelnen nicht
  weiter ausgeführt.
- Restbefund der Nachprüfung der Fixwelle: Die Lösung für den ruhenden Zeiger stützt
  sich auf einen synchron gesetzten Zustand in `src/ui/idle.ts`, weil der
  React-Effekt die Klasse `zeiger-aus` erst später entfernt. Die zugrunde liegende
  Ereignisreihenfolge in Chrome ist nicht einzeln gemessen; das Verhalten ist durch
  den Unit-Test und die Browser-Gegenprobe 2 belegt.
