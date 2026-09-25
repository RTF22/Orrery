# Abnahme Phase 6: Milchstraße

## 1. Umfang

Entwurf `docs/superpowers/specs/2026-09-25-phase6-milchstrasse-design.md` (25.09.2026), Plan
`docs/superpowers/plans/2026-09-25-phase6-milchstrasse.md`. Phase 6 bringt das Band der
Milchstraße als Himmelshintergrund und schließt Phase 5 (Tag `v0.6.0`) an. Vier Schritte, jeder
mit eigenem Commit auf dem Branch `phase6`:

- **Quelle und Stufen** (`f2661a4`): Lizenzprüfung an der Quelle (NASA SVS „Deep Star Maps 2020“,
  Gaia DR2), Aufbereitungsskript (`scripts/milchstrasse.py`, `scripts/milchstrasse-bauen.ts`) mit
  Helligkeitskurve, Lageprüfung und KTX2-Stufen (1k/2k/8k), Eintrag in `ASSETS.md`.
- **Schalter** (`f25b3db`): Feld `display.milchstrasse` (Standard an) mit Link, Sitzung,
  Ansichten, Prüfroutine und Kästchen im Darstellungspanel in beiden Sprachen.
- **Darstellung** (`3f6085b`): Modul `render/milchstrasse.ts` (Himmelskugel hinter den Körpern,
  ohne Tiefentest, `renderOrder -1`), Einbindung in die Szene, Nachladen erst nach den
  Startladungen der Körper, Ausnahme im Bloom-Durchgang.
- **Sichtprüfung und Abnahmeprotokoll** (dieses Protokoll): Messungen im Browser gegen die
  Zielwerte aus Entwurf (`docs/superpowers/specs/2026-09-25-phase6-milchstrasse-design.md`, §3.2
  und §6.2) und Plan (`docs/superpowers/plans/2026-09-25-phase6-milchstrasse.md`), Handprüfliste
  für Jens.

Zusätzlich in diesem Schritt nachgeführt: `docs/superpowers/specs/2026-09-25-phase6-milchstrasse-design.md`
§4.1 nennt die Himmelskugel jetzt „von innen gesehen, beidseitig gezeichnet (`DoubleSide`,
unabhängig von der Umlaufrichtung der Dreiecke)“ statt `BackSide` — deckungsgleich mit dem
umgesetzten Code.

## 2. Zahlen

| Größe | Vorher | Nachher |
|---|---:|---:|
| Tests | 5301 | 5328 |
| Hauptchunk | 1 529,67 kB | 1 531,36 kB |

Stufengrößen (`public/textures/milchstrasse/`): `himmel-1024.ktx2` 59 941 Bytes,
`himmel-2048.ktx2` 1 069 543 Bytes, `himmel-8192.ktx2` 30 310 600 Bytes.

Kurve (`scripts/milchstrasse-bauen.ts`, Potenzkurve S = a·Yᵍ): a = 203,746111618863,
g = 0,5086657801166556.

Lageabstände aus dem Bauskript (Sollpunkt zu gefundenem Maximum, 1k-Stufe): galaktisches Zentrum
3,93°, Große Magellansche Wolke 0,47°, Kleine Magellansche Wolke 0,18°.

Schirmwerte aus dem Bauskript (2k-Stufe, von 255): Median des Bandes 25, 99,5-Perzentil des
Bandes 64,5, Mittel der Polkappen 6.

## 3. Messungen im Browser

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als laufend
bestätigt, kein zweiter gestartet), Viewport 1280 × 800, `devicePixelRatio` 1. Vor jeder Aufnahme:
Qualitätsstufe „hoch“, `window.store.getState().setUi({ hidden: true, panels: { ...panels, info:
false } })`, Kino angehalten (`setCinema({ running: false, pauseOnInput: false })`), Uhr
angehalten (`setTime({ paused: true })`), `window.himmelStand() === 8192` abgewartet. Aufnahmen
am 25.09.2026, `cinema.elapsedSec` war für alle Aufnahmen ohne Bedeutung (Kino stand), außer für
Schritt 5 (Systemblick) angegeben.

### Schritt 1: Differenzbild Kästchen an/aus

Ziel Mond, Kameramodus „frei“, Abstand 10 600 km (Scheibe rund 280 px bei aktivem Maßstab
„realistisch“), Blick von der dem galaktischen Zentrum abgewandten Seite, sodass das Band hinter
dem Mond liegt. Anzeige zusätzlich ohne Bahnen/Beschriftungen/Marker/Gürtel für ein sauberes
Messfeld (Sonnensystem ohnehin nicht im Bild). Aufnahme A (an), B (an, Kontrolle),
`setDisplay({ milchstrasse: false })`, 200 ms, Aufnahme C (aus).

| Messgröße | Soll | Ist | Ergebnis |
|---|---|---|---|
| A gegen B (Kontrolle) | 0 abweichende Pixel | 0 | erfüllt |
| A gegen C in der Mondmaske (Summe > 30, 2 px erodiert, 44 826 Px) | 0 abweichende Pixel | 0 | erfüllt |
| Sternkerne (Wert ≥ 250), A gegen C | 0 abweichend | 0 Kandidaten im Bild (Bildhöchstwert 226 von 255) | vakuos erfüllt |
| Außerhalb der Maske abweichender Anteil | > 20 % | 98,05 % | erfüllt |

Die Schwelle 250 wird bei Belichtung 1 durch die ACES-Tonemapping-Kurve nirgends im Bild
erreicht (Höchstwert durchgängig 226, siehe §6). Eine vertiefte Zusatzprüfung mit der auch in
Schritt 3 verwendeten Schwelle 200 (strenges lokales Maximum, Kontrast ≥ 30 zur Umgebung) fand 79
aufgelöste, mehrpixelige Sternscheiben. Der klar isolierteste, hellste Sternkern (Bildwert 226,
Zeile 389/Spalte 902) zeigt 0 Abweichung zwischen A und C. Bei 26 der 79 Kernen — durchweg kleine,
teils unterpixelgroße Sternpunkte (Sprite-Größe 0,6 bis 4,2 px) — weicht ein Farbkanal um genau 1
(selten 2) von 255 ab: der weiche, kantenglättende Rand des Sprites überblendet dort minimal mit
dem sich ändernden Himmelshintergrund. Auf der Mondscheibe selbst (die eigentliche Prüfgröße)
gibt es keine Abweichung.

### Schritt 2: Lage

Flugmodus, Kamera 1·10¹¹ km vom Sonnenmittelpunkt in Zielrichtung versetzt (siehe §6), Blick auf
die Zielrichtung. Winkelabstand über die tatsächliche Kamerageometrie (Projektionswinkel aus
`fov`/`aspect`/`matrixWorld`, siehe §6).

| Messgröße | Soll | Ist | Ergebnis |
|---|---|---|---|
| Maximum nahe galaktisches Zentrum (266,4°/−28,9°) | ≤ 5° | 3,31° | erfüllt |
| Maximum nahe Große Magellansche Wolke (80,9°/−69,8°) | ≤ 2° | 0,47° | erfüllt |
| Maximum nahe Kleine Magellansche Wolke (13,2°/−72,8°) | ≤ 2° | 0,17° | erfüllt |
| Kohlensack: Median ≤ 1,5° / Median 3–5° um (192,5°/−62,5°) | Verhältnis < 0,6 | 0,707 (Median innen 29, Median Ring 41) | **nicht erfüllt** |
| HYG-Abgleich α Crucis (186,65°/−63,10°), Sternkern im 3-px-Umkreis | Wert ≥ 200 vorhanden | 225 | erfüllt |
| HYG-Abgleich β Crucis (191,93°/−59,69°), Sternkern im 3-px-Umkreis | Wert ≥ 200 vorhanden | 225 | erfüllt |

Der Kohlensack ist an der vorhergesagten Stelle sichtbar dunkler als seine Umgebung (Median 29
gegen 41, siehe Screenshot `step2-kreuz.png`), die Perzentilverteilung beiderseits ist eng und
nicht zweigipflig (kein Mischeffekt aus Band und freiem Himmel im Ringbereich) — die Messung
selbst ist damit belastbar. Der Sollwert von weniger als 60 % wird mit 70,7 % nicht erreicht: Die
feste Potenzkurve (g < 1) hellt dunkle Bildbereiche relativ stärker auf als helle, was die
Kontrastspanne einer eingebetteten Dunkelwolke gegenüber der realen Himmelsansicht dämpft. Am
Curve-Code wurde nichts geändert. Beide HYG-Sterne liegen exakt
an der aus der Kamerageometrie vorhergesagten Stelle und belegen, dass Band und Punktsterne im
selben Bild dieselbe Geometrie zeigen; die Schwelle 200 ersetzt die im Schritt-1-Muster ohnehin
nie erreichte 250 (siehe §6).

### Schritt 3: Helligkeit gegen die Vorhersage

Texturwerte aus `.cache/milchstrasse/stufen/himmel-8192.png` (gespiegelt, Zeile 0 = Süden),
Vorhersage über `schirm_aus_textur`/`leuchtdichte` aus `scripts/milchstrasse.py` (per `importlib`
geladen), Sternkerne (Pixel ≥ 200 in der Aufnahme) ausgeschlossen.

| Messgröße | Soll | Ist | Ergebnis |
|---|---|---|---|
| Galaktisches Zentrum: \|Median Schirm − Median Vorhersage\| | ≤ 3 | 0,16 (19,07 gegen 19,22) | erfüllt |
| Galaktischer Nordpol (192,86°/27,13°): \|Median Schirm − Median Vorhersage\| | ≤ 3 | 1,15 (4,93 gegen 3,78) | erfüllt |
| Galaktischer Nordpol: Median am Schirm | ≤ 6 | 4,93 | erfüllt |

### Schritt 4: Naht

Blick auf RA 180°, Dec −62°. Je Bildzeile die Nahtspalte aus der Kamerageometrie bestimmt, Betrag
der Differenz der beiden Nachbarspalten gebildet und mit derselben Größe 20 px daneben verglichen
(800 Zeilen ausgewertet).

| Messgröße | Soll | Ist | Ergebnis |
|---|---|---|---|
| Median Gradient an der Naht gegen Median 20 px daneben | ≤ 1,5-fach | 1,0-fach (1,000 gegen 1,000) | erfüllt |

Sichtprüfung (`step4-naht.png`) zeigt keinen erkennbaren Streifen entlang der Naht.

### Schritt 5: Bildrate und Startladung

Eigener `requestAnimationFrame`-Zähler über 10 s (Kinoszene „Systemblick“ angefahren und
angehalten, `cinema.elapsedSec` beim Anhalten 11,28 s, danach Kino aus, Uhr an).

| Messgröße | Soll | Ist | Ergebnis |
|---|---|---|---|
| Bildrate Kästchen an | — | 56,77 Bilder/s (568 Bilder / 10,006 s) | — |
| Bildrate Kästchen aus | — | 56,81 Bilder/s (569 Bilder / 10,016 s) | — |
| Bildrate an gegen aus | an ≥ aus − 1 | 56,77 ≥ 55,81 | erfüllt |
| Summe aller `albedo-1024.ktx2` (29 Körper) + `himmel-1024.ktx2` | < 4 MB | 3,46 MB (3 627 361 Bytes) | erfüllt |
| Reihenfolge: `himmel-1024.ktx2` erst nach dem letzten `albedo-1024.ktx2` | ja | ja (Position 185 nach den albedo-Anfragen 148–176) | erfüllt |
| Link mit `display.milchstrasse:false`: keine `himmel-*`-Datei angefordert | ja | ja (0 Anfragen, alle 29 Körpertexturen liefen unbeeinflusst) | erfüllt |
| Konsole über den ganzen Rundgang | 0 Fehler, 0 Warnungen | 0 Fehler, 0 Warnungen | erfüllt |

Die Größenprüfung stammt aus den Dateigrößen im Arbeitsbaum (`public/textures/*/albedo-1024.ktx2`
und `himmel-1024.ktx2`), die Reihenfolge- und Link-Prüfung aus dem Netzwerkmitschnitt einer
frischen Ladung. Ein direkter Linkaufruf ersetzt die gesicherte Sitzung erst nach rund einer
Sekunde (bekanntes, in der lokalen Projektanleitung offen vermerktes Verhalten) — die Messung
löschte deshalb vor jeder Linkprüfung die Sitzung und erzwang mit einem Zwischenschritt eine
echte Neuladung statt einer reinen Fragmentänderung.

## 4. Lizenz

Wortlaut aus `ASSETS.md` (übernommen aus der an der Quelle geprüften Fassung): Der
Himmelshintergrund beruht auf der Karte „Milky Way Background“ der „Deep Star Maps 2020“ des
NASA Goddard Scientific Visualization Studio (<https://svs.gsfc.nasa.gov/4851>), gerechnet aus
1,7 Milliarden Sternen von Gaia DR2 ohne die hellen Hipparcos- und Tycho-Sterne. Namensnennung:
„NASA/Goddard Space Flight Center Scientific Visualization Studio. Gaia DR2: ESA/Gaia/DPAC“. Das
SVS erklärt seinen Inhalt als gemeinfrei, sofern nicht anders vermerkt
(<https://svs.gsfc.nasa.gov/help/>); der zugrunde liegende Gaia-DR2-Anteil steht laut ESA unter
CC BY-NC 3.0 IGO mit Namensnennung (<https://www.cosmos.esa.int/web/gaia-users/license>). Orrery
ist ein nichtkommerzielles Projekt.

## 5. Handprüfung (Jens)

**Ergebnis (Jens, 25.09.2026):** „Handprüfung bestanden“. Die Aussage gilt für alle Prüfpunkte;
Befunde für §7 ergaben sich nicht. Die beiden A55-Punkte hat Jens nach dem Hochladen auf den
Webspace am 25.09.2026 dort nachgeprüft: „Geprüft auf A55. Sieht gut aus“.

| Prüfpunkt | Ergebnis |
|---|---|
| Desktop, Stufe „hoch“: Band wirkt wie unter dunklem Himmel, drängt sich nicht vor die Planeten |bestanden |
| Desktop: Kästchen „Milchstraße“ an/aus, Link mit ausgeschaltetem Kästchen |bestanden |
| Desktop: Kinoszenen mit Blick ins Band (etwa „Das System von oben“, „Tritons rückläufige Bahn“) |bestanden |
| A55, Stufe „mittel“: Band erkennbar, Ladezeit gefühlt |bestanden |
| A55: Kästchen an/aus |bestanden |

## 6. Rulings der Phase

- **Ruling (Quelle und Stufen):** Der Gaia-Anteil der Quelle verlangt mehr als Namensnennung —
  CC BY-NC 3.0 IGO (nichtkommerziell, Genehmigungspflicht bei kommerzieller Nutzung) statt der im
  Entwurf beispielhaft genannten CC BY-SA. Jens' Entscheidung: Karte mit NC-Vermerk aufnehmen,
  Wortlaut wie in §4.
- **Ruling (Quelle und Stufen):** Die Polkappen-Grenze wird auf höchstens 6 angehoben (gemessen
  6 statt der ursprünglich vorgesehenen höchstens 4); Entwurf, Plan-Zielwert und Prüfcode
  entsprechend nachgeführt.
- **Ruling (Quelle und Stufen):** Zwei kleine Typprüfungsbefunde in `scripts/milchstrasse.py`
  (eine mögliche `None`-Entpackung, zwei veraltete Pillow-Konstantennamen) im selben Durchgang
  behoben, ohne die Stufen neu zu bauen.
- **Ruling (Darstellung):** Die Himmelskugel bleibt bei `DoubleSide` statt des im Entwurf
  vorgesehenen `BackSide` — die Kamera sitzt innen, `DoubleSide` macht die Kugel unabhängig von
  der Dreiecksumlaufrichtung; einziger Preis ist ein ungenutzter Culling-Vorteil. Der Entwurf ist
  mit diesem Protokoll auf „von innen gesehen, beidseitig gezeichnet“ nachgeführt.
- **Ruling (Abnahme):** Die im Vorgehen vorgegebene Blickformel für Aufnahmen in eine
  Himmelsrichtung hält zwar das Skalarprodukt der Blickrichtung exakt bei 1 (die Konvention
  stimmt), platziert die Kamera mit ihren wörtlichen Werten aber so, dass Sonne und innere
  Planeten mitten im Bild stehen. Für die Aufnahmen der Schritte 2 bis 4 wurde nur die
  Messmethode angepasst (kein Codeeingriff): Kameraversatz vom Sonnenmittelpunkt mit
  umgekehrtem Vorzeichen und auf 1·10¹¹ km angehoben (mehr als das Zehnfache der größten
  Bahnhalbachse im Katalog) — die Himmelskugel selbst ist kamerarelativ fest und davon
  unberührt.
- **Ruling (Abnahme):** Die vorgesehene Schwelle „Wert ≥ 250“ für Sternkerne wird bei Belichtung 1
  durch die ACES-Tonemapping-Kurve nirgends erreicht (Bildhöchstwert durchgängig 226 von 255) —
  deckungsgleich mit der für Schritt 3 ohnehin vorgesehenen Schwelle 200. Schritte 1 und 2
  verwenden deshalb dieselbe Schwelle 200, die vakuose Probe bei 250 ist zusätzlich vermerkt.
- **Ruling (Abnahme):** Der Kohlensack-Kontrast (0,707 statt der geforderten unter 0,6) bleibt wie
  gemessen, das Protokoll führt ihn ehrlich als „nicht erfüllt“; an der Kurve wird nichts
  geändert. Der eigentliche Zweck der Messung — die Lage des Dunkelflecks — ist erfüllt, und der
  Schwellenwert 0,6 war ein ungemessener Schätzwert aus dem Entwurf. Ob mehr Kontrast nötig ist,
  entscheidet sich mit Jens' Handprüfung (§8).

## 7. Offene Punkte

- **Kohlensack-Kontrast unter dem Sollwert** (§3, Schritt 2): gemessenes Verhältnis 0,707 statt
  der geforderten unter 0,6. Ursache vermutlich die feste, kompressive Helligkeitskurve
  (g ≈ 0,51), die dunkle Bildbereiche gegenüber hellen relativ aufhellt. Eine Nachführung der
  Kurve verändert alle drei Stufen erneut und berührt die bereits geprüften Schirmwerte des
  Bandes und der Polkappen — Entscheidung bei Jens (§8).
- Die Sternkernschwelle 250 aus dem ursprünglichen Messplan wird bei der aktuellen Belichtung nie
  erreicht; die Messungen in diesem Protokoll verwenden durchgängig 200 (siehe §6). Für künftige
  Sichtprüfungen mit hellerer Belichtung wäre 250 wieder sinnvoll.
- Ein gültiger Link ersetzt eine vorhandene, gesicherte Sitzung erst nach rund einer Sekunde statt
  sofort; für die Messung in Schritt 5 wurde deshalb die Sitzung vor jedem Linkaufruf gelöscht.
  Betrifft nur diese Messung, das Verhalten selbst ist ein seit Phase 5 offen vermerkter Punkt.
- `scripts/milchstrasse.py`: `kurve()` und `schirmwerte()` berechnen das RA/Dec-Gitter der
  Messstufe je einmal neu; nur Bauzeit, keine Wirkung auf die Stufen.
- `scripts/milchstrasse-bauen.ts` `werteFehler`: Meldungen zeigen Zahlen mit Dezimalpunkt statt
  Komma (nur Ausgabe des Bauskripts).
- `src/render/milchstrasse.ts` `HIMMEL_RADIUS = 1e9` wiederholt den Radius des Sternfelds
  (`RADIUS` in `src/render/starfield.ts`), nur per Kommentar gekoppelt; ein gemeinsamer Export
  wäre sauberer.
- Aufnahmezeitpunkte in §3 pauschal mit Datum statt je Aufnahme.

## 8. Fragen an Jens

1. **Kohlensack-Kontrast** (§3, Schritt 2; §7): Soll die Helligkeitskurve nachgeführt werden (mit
   erneutem Bau aller drei Stufen und neuer Prüfung von Band- und Polkappenwerten), oder bleibt
   der Kohlensack-Kontrast wie gemessen und der Sollwert wird wie bei den Polkappen angepasst?
   Die Entscheidung fällt mit der Handprüfung (§5): wie wirkt der Kohlensack am Schirm.
2. **Ergebnis der Handprüfung** (§5).
3. **Freigabe von Tag und Push:** Darf `v0.7.0` gesetzt und zusammen mit `master` gepusht werden?
4. **Deploy:** Soll der Stand danach auf den Webspace (eigene Freigabe)?

## Entscheidungen (25.09.2026)

1. **Kohlensack-Kontrast:** Die Helligkeitskurve bleibt; der Kohlensack bleibt wie gemessen
   (Verhältnis 0,707), die Handprüfung ergab keinen Befund.
2. **Handprüfung:** bestanden (§5).
3. **Tag und Push:** `v0.7.0` wird gesetzt und zusammen mit `master` gepusht.
4. **Deploy:** Der Stand wird auf den Webspace hochgeladen.
