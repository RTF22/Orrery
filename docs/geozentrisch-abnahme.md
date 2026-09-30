# Abnahme geozentrische Sicht

## 1. Umfang

Entwurf `docs/superpowers/specs/2026-09-29-geozentrisch-design.md` (29.09.2026, mit Nachtrag §10),
Plan `docs/superpowers/plans/2026-09-29-geozentrisch.md`. Die Etappe bringt eine Himmelsansicht aus
dem Erdmittelpunkt: den Kameramodus „Von der Erde“ (Taste G, Knopf im Kamera-Panel), Planetenspuren
über 365 Tage, Ekliptik, Himmelsäquator und Frühlingspunkt, den Bildwinkel als Zoom, den Deep Link
`view=geo`, die Suche der nächsten Opposition und die zwanzigste Kinoszene „Marsschleife“ mit Texten in drei
Stufen und Belegliste. Commits auf dem Branch `geozentrisch` (ab `master` `55e4d00`), dazu dieses
Protokoll:

- **Entwurf und Plan** (`3cd22bc`, `231d740`).
- **Geozentrische Richtung und Oppositionssuche** (`044f9bf`): `sim/geozentrisch.ts`, Richtung Erde → Körper
  als Winkel, Opposition nach ekliptikaler Länge (Ruling 10).
- **Zustand** (`7f217b6`): Kameramodus `geozentrisch`, `camera.geo` (Blickwinkel, Bildwinkel),
  Schalter `display.spuren`, `ekliptik`, `aequator`, der überlagerte Maßstab
  (`store/himmelsansicht.ts`), Persistenz und Ansichten.
- **Kamera** (`6891eb2`): Kamera im Erdmittelpunkt, Bildwinkel 1° bis 90° (`render/camera/himmelsblick.ts`),
  realistischer Maßstab nur in der Himmelsansicht; die Erde wird dort ausgeblendet, ihr Schatten
  (Mondfinsternis) bleibt.
- **Spuren und Bezugslinien** (`d1954b0`): `render/himmelslinien.ts`, eine Spur je Planet (367 Punkte),
  Ekliptik, Himmelsäquator, Frühlingspunkt.
- **Bedienung** (`a2dc845`): Ziehen, Rad und Pinch als Zoom, Tasten, Controller, Klick und Objektbaum
  richten den Blick aus, Taste G schaltet um, Esc verlässt (`ui/himmelsmodus.ts`).
- **Oberfläche** (`f99c55a`): Modusknopf, Bildwinkelregler, gesperrter Maßstab, Himmelsschalter im
  Darstellungspanel, Steuerkarte mit zwei neuen Tastaturzeilen.
- **Deep Link** (`6a0ed7e`): `view=geo` mit optionalem `body`; der Teilen-Knopf schreibt
  `view=geo&body=<Ziel>` (Ruling 6).
- **Kino: Zeitsprung** (`a6e3712`): Szenenanfang „nächste Opposition“ (`zeitpunkt: 'naechste-opposition'`).
- **Szene Marsschleife** (`1be6ad6`, Nacharbeit `903d3ad`): Hochschul-, Gymnasial- und Grundschultext in
  Deutsch und Englisch, 42 Belegzeilen, Fachprüfung und Nacharbeit (§4).

Zwölf Commits, alle von Jens Fricke; keine Änderung an Abhängigkeiten.

## 2. Zahlen

| Größe | Vorher (`master`) | Nachher (`903d3ad` plus Protokoll und README) |
|---|---:|---:|
| Tests | 5667 | 5804 (146 Dateien) |
| Hauptchunk | 1 569,20 kB | 1 579,86 kB (+10,66 kB) |
| Nachtrag Himmelsbild (30.09.2026), Stand `52b2bf5` | 5804 Tests, 1 579,98 kB | 5840 Tests (150 Dateien, +36), 1 592,27 kB (+12,29 kB, gzip 440,16 kB) |

Beide Werte aus frischen Durchläufen auf dem Branch: `npm run lint` ohne Meldung,
`npx tsc -b --noEmit` Ausgang 0, `npm test` (146 Dateien, 5804 Tests, alle grün),
`npm run build` (`tsc -b && vite build`, Hauptchunk `dist/assets/index-*.js`, gzip 436,95 kB). Der
Wert für `master` stammt aus dem Stand vor der Etappe (Aufgabenstellung). Die Frageschwelle für den
Hauptchunk (ab 1 571,79 kB, Abnahme Phase 5) ist damit überschritten; der Zuwachs von 10,66 kB ist
der Code der Himmelsansicht samt Szenentexten (Katalog im Hauptbundle). Siehe §8 Frage 4. Die 1 579,86 kB sind der Stand vor, die 1 579,98 kB (Nachtragszeile, Spalte „Vorher“) der Stand nach
dem letzten Commit der Etappe (`130671e`); die Spalte „Vorher“ der Nachtragszeile meint durchgehend den Stand vor dem Nachtrag.
Nach dem Nachtrag Himmelsbild (§5.10) liegt der Hauptchunk bei 1 592,27 kB, gemessen mit `npm run build` auf
`52b2bf5`; gegenüber `master` sind das +23,07 kB. `npm test` läuft mit 150 Dateien und 5840 Tests grün. Mit Aufhellung für Ziel Erde und Ausrichten auf die dargestellte Lage (§6 Nr. 32, 33)
sind es 5843 Tests und 1 592,42 kB.

## 3. Wort- und Trailerkontrolle

Nach der lokalen Projektanleitung geprüft (Baumkontrolle und Trailerprüfung des letzten Commits),
Ergebnis 0 bzw. leer.

## 4. Fachprüfung der Szenentexte

Geprüft wurde `szene:marsschleife` in allen drei Stufen und beiden Sprachen; Zahlen wurden am Code neu
gerechnet, Horizons (Zentrum 500@399, Mars, Sonne, Jupiter, 6-Stunden-Raster 1.11.2026 bis 1.6.2027)
neu abgerufen und die Übersicht der Stanford Encyclopedia of Philosophy geöffnet. Alle 42 Belegzeilen
tragen einen Prüfeintrag.

Zählung: 3 wesentliche Fehler, 4 kleine Befunde (davon 3 Hinweise, 1 zurückgestellt), Rest ohne Befund.

**Wesentliche Fehler (alle behoben):**

1. Hochschule, Abschnitt „Richtung“: Text nannte die Opposition „+0,74 h“ gegen Horizons (19. Februar
   14:59). Neu gerechnet: Horizons 19.02.2027 15:44:20, Modell 15:44:15, Abweichung 5 s; die
   Stillstände (+0,80 h, −0,94 h) stimmten. Text DE/EN und Belegzeile 34 korrigiert.
2. Hochschule DE: „Orte von Mars und Erde aus DE441“ bei der Formel für die Winkelgeschwindigkeit; das
   Modell rechnet mit der JPL-Näherungstafel. DE auf den Wortlaut der englischen Fassung gebracht.
3. Erde-Mond-Schwerpunkt: 4669 km falsch (Beleg mit falscher Mondmasse); mit den Werten des Datensatzes
   4671,6 km, Text jetzt „4672 km“ (DE/EN, Belegzeile 36); 9,5″ bleiben.

**Kleine Befunde:**

4. Jupiterlänge „137° bis 146°“ → „137° bis 147°“ (behoben).
5. Widerspruch zwischen dem Fenster „81 Tage vor bis 81 Tage nach der Opposition“ und dem wirklichen Ende
   76 bis 98 Tage nach ihr → „im nominellen Fenster“ ergänzt (behoben).
6. „blickt fest“ verschwieg die Blickwanderung in den ersten 2 s der Blende (bis 6,3°) → Halbsatz und
   Satz ergänzt; Kommentar in `render/camera/himmelsblick.ts` nennt jetzt bis rund 17 Tage (behoben).
7. Die Spur ist in Tagesschritten gezeichnet, nur die 0,25-Tage-Schritte der Rechnung sind auf Selbstschnitt
   geprüft (0 Schnitte); unkritisch, Text nennt das Zickzack ohne Schnitt (zurückgestellt, §7).

Ohne Befund bestätigt: Sprung 81 Tage vor die Opposition, Oppositionen 2022 bis 2029, Stillstände und
Rückläufigkeit (81,0 Tage, 19,5°), Perioden, Abstände, Blendenrechnung (30,7/23,6/31,7 s), Aberration und
Parallaxe (höchstens 9,2″), Bildwinkel und Pixelmaße, SEP-Zitate wörtlich, Verweise auf `thema:bezugssysteme`
und `thema:modell`, Gymnasium und Grundschule ohne sachlichen Fehler, keine Prozesssprache, jede
Belegzeile mit sechs Zellen. Wortzahlen Hochschule nach der Nacharbeit: DE 998, EN 1090. Nach der Nacharbeit
der Prüfung: `npm test` 5800 grün.

## 5. Sichtprüfung und Handprüfung

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als laufend bestätigt,
kein zweiter gestartet), Fenster 2560×1440, `devicePixelRatio` 1. Nach jedem Navigate
`window.store.setState({ quality: { tier: 'high' } })` und `setUi({ hidden: true })`, Uhr angehalten
(`setTime({ paused: true })`), Texturen geladen (3 s Wartezeit). Projektionen über `window.kamera` auf
Bildschirmpixel, Pixelwerte aus Screenshots mit Python (Pillow, numpy).

### 5.1 Spurende auf dem Planeten

Himmelsmodus, Ziel Mars, Bildwinkel 20°, 19.02.2027 12:00 UTC. `spur-mars` hat 367 Punkte,
`drawRange` voll, Material mit Vertexfarben. Letzter Spurpunkt projiziert auf (1279,99996; 720,00001),
Mars-Mesh auf (1280,00000; 720,00000): Abstand 0,00004 px (Forderung ≤ 1 px). Erster Spurpunkt bei
(1968; 960), die Spur läuft also vom Bildrand in den Planeten. Im Screenshot im Fenster ±2 px um den Punkt:
3 Pixel exakt in der Spurfarbe (193, 80, 46; das ist die Vertexfarbe linear 0,533/0,080/0,027 nach
Tonwertabbildung und sRGB), 4 weitere Randpixel mit Mischwerten (Rot ≥ 142), Hintergrund (5, 5, 4).
Erfüllt.

### 5.2 Erde unsichtbar, Mondfinsternis sichtbar

Nächste totale Mondfinsternis ab dem 19.02.2027 (`naechsteMondfinsternis`): Eintritt JD 2 462 137,2427,
Maximum JD 2 462 137,3163, Austritt 2 462 137,3898 (die erste gefundene war partiell, die zweite total).
Zeit auf das Maximum, `himmelAusrichten('moon')`, Bildwinkel 2°. Mond auf (1280,0; 720,0),
`earth.visible === false`. Mittelwert der Mondscheibe (Kreis r = 100 px um die Bildmitte), gleiche Ladung:

| `display.shadows` | Mittelwert RGB | Mittel |
|---|---|---:|
| an | (18,95; 5,55; 2,02) | 8,84 |
| aus | (85,17; 83,97; 82,84) | 83,99 |
| wieder an (Kontrollbild) | (18,95; 5,55; 2,02) | 8,84, 0 abweichende Pixel gegen „an“ |

Verhältnis aus/an 9,5; die Scheibe ist mit Schatten rotbraun und deutlich dunkler. Erfüllt. Das
Ruling zur Belichtung (Ziel statt Erde, §6) trägt: Mond und Planeten sind in den Vergrößerungen weder
überstrahlt noch schwarz.

### 5.3 Schleife in der Kino-Szene

Szene 19 (Index von `marsschleife` in `SCENES`, 20 Szenen), `setCinema({ running: true, shuffle: false,
nummer: 19, elapsedSec: 0, pauseOnInput: false })`, `setCamera({ mode: 'cinema' })`; bei
`elapsedSec` 59,002 angehalten (JD 2 462 298,650), Bildwinkel 30°. Die letzten 163 Spurpunkte
(162 Tage) projiziert: x von 865,3 bis 1763,9 px (Bildbreite 2560), y von 711,1 bis 855,7 px (Höhe 1440),
0 Punkte hinter der Kamera, alle im Bild. Die x-Koordinate kehrt zweimal um: bei Punkt 45 (x = 865,3) und bei
Punkt 125 (x = 1763,9), die beiden Stillstände; Abstand 80 Punkte, das entspricht den 81 Tagen der
Rückläufigkeit. Mars steht am Ende bei (1429,5; 855,7), der letzte Spurpunkt fällt darauf (Abstand
< 0,001 px). Screenshot betrachtet: Spur als flaches Zickzack mit zwei Wendepunkten, der Planet am
rechten unteren Ende; danach gelöscht. Erfüllt.

### 5.4 Fernrohr

Bildwinkel 1° auf Jupiter (JD 2 462 298,65, Abstand 734 755 Einheiten zu 1000 km ≈ 4,9 AE). Erwartung
15,7 px (39,25″ bei 2,5″ je Pixel), gemessen 15 px waagerecht (x 1272 bis 1286) und 16 px senkrecht
(y 712 bis 727). Die Erwartung „um 18 px“ aus der Planung gilt für einen kleineren Abstand;
für dieses Datum stimmt die Rechnung. Io steht +7,6 px rechts und +2,1 px unterhalb der Mitte und ist
als heller Punkt sichtbar (Pixel 1288/722, Wert 231/236/246). Europa (−74,6 px), Ganymed (−78,4 px) und
Kallisto (−33,3 px) stehen an ihren projizierten Orten, sind aber kleiner als 1 px und haben keine
Markierung: ihre Beschriftungen sind ausgeblendet (`display: none`), weil `LABEL_MIN_PIXEL_MOND` = 8
gilt. Teilweise erfüllt: Scheibe ja, Monde als Markierungen nein (siehe §7 und §8).

### 5.5 Bildrate

Eigener rAF-Zähler, 10 s, gleiche Ladung, Uhr mit 1 Tag/s laufend, Spuren, Ekliptik und Äquator an,
Bildwinkel 50°, Tab im Vordergrund:

| Modus | Bilder | Sekunden | Bildrate |
|---|---:|---:|---:|
| Himmelsmodus mit Spuren | 568 | 10,004 | 56,8 |
| Geheftet (Erde) | 568 | 10,014 | 56,7 |

Kein messbarer Unterschied; beide liegen an der Bildwiederholrate des Prüfrechners (59 Hz, Playwright
liefert etwas darunter). Erfüllt.

### 5.6 Ausstieg

Ausgang vor dem Eintritt: geheftet an der Erde, `camera.fov` 50, Erde sichtbar, Erdmesh `scale.x` 318,55
(sizeScale 50 × Erdradius 6,371). Im Himmel bei 5°: Erde unsichtbar, `scale.x` 6,371 (realistisch).

| Ausstieg | Modus danach | Ziel | `camera.fov` | Erde | Erdmesh `scale.x` |
|---|---|---|---:|---|---:|
| Taste G | attached | mars | 50 | sichtbar | 318,55 |
| Esc | attached | mars | 50 | sichtbar | 318,55 |
| Pos1 | free | sun (Grundstellung) | 50 | sichtbar | 318,55 |
| Klick „Erde“ im Objektbaum | attached | earth | 50 | sichtbar | 318,55 |

`scale.sizeScale` blieb in allen Fällen 50. Erfüllt.

### 5.7 Deep Link

`#date=2027-02-19&view=geo&body=mars` in frischer Ladung (Zwischenschritt `about:blank`): Modus
`geozentrisch`, Ziel `mars`, JD 2 461 456 (19.02.2027 12:00 UTC), Bildwinkel 60° (Standard), Mars auf
(1280,0000; 720,0000): Abstand 0 px (Forderung ≤ 2 px); das Fragment ist danach aus der Adresszeile entfernt.
Erfüllt.

### 5.8 Konsole

Über alle Messungen kein Fehler außer den bekannten React-Meldungen des Entwicklungsservers
(`createRoot() on a container that has already been passed`, 10 Stück, jeweils beim Neuladen und beim
dynamischen `import()` der Module aus der Messung; im Build nicht vorhanden). Keine Warnungen, keine
WebGL-Meldungen.

### 5.9 Handprüfung (Jens)

Offen; Vorschlag zur Reihenfolge:

| Prüfpunkt | Ergebnis |
|---|---|
| Desktop, Maus: G drückt in den Himmelsmodus, erneut G und Esc verlassen ihn; Ziehen schwenkt, Rad zoomt (Bildwinkel), Klick auf Mars und Objektbaum richten den Blick aus | offen |
| Desktop, Tastatur: W/A/S/D schwenken, Q/E zoomen; Steuerkarte (`?`) zeigt zwei neue Zeilen | offen |
| Desktop: Spuren, Ekliptik, Äquator lassen sich im Darstellungspanel schalten; Maßstabsregler sind im Himmelsmodus ausgeblendet (§5.10, Entwurf §11.5) und danach wieder da | offen |
| Desktop: Kino, Szene 20 „Marsschleife“: Zeitsprung zur Opposition, Schleife im Bild, Text in drei Stufen | offen |
| Desktop: Teilen-Knopf im Himmelsmodus erzeugt `view=geo&body=…`; Link in neuem Tab öffnet den Blick | offen |
| Desktop, Controller (falls zur Hand): Stick schwenkt, Trigger zoomen, A richtet den Blick aus | offen |
| A55 hoch und quer: Ziehen mit einem Finger schwenkt, Zwei-Finger-Pinch zoomt den Bildwinkel | offen |
| A55: keine Taste G, der Knopf „Von der Erde“ im Kamera-Panel schaltet ein und aus; Teilen öffnet den Teilen-Dialog | offen |
| A55 hoch: Szene Marsschleife im Kino, die Schleife wird waagerecht abgeschnitten (§7) | offen |
| Desktop: Flug-Knopf aus dem Himmel (Start außerhalb der Erde, kein Durchgleiten) | offen |
| Desktop: Shift+W in der Marsschleife (Kino endet, Mars wird Ziel) | offen |
| Desktop: hohe Zeitrate und Taste R im Himmel (Spuren ruckelfrei?) | offen |
| Desktop: Mondbahn im Himmel sichtbar; Klick auf die Linie richtet den Blick auf den Mond | offen |
| Desktop: Regler „Scheiben vergrößern“ (Maßstabspanel), Hinweis „Größen überhöht“ oben, Jupitermonde spreizen sich, Erdmond bleibt gleich; Link mit Lupe öffnet sie wieder | offen |
| Desktop: Planeten als Lichtpunkte, Venus und Jupiter deutlich heller als Saturn und Neptun; Jupiter bei 1–2° mit vier Monden | offen |
| Desktop: Sonne weiß mit Blendschein, Vollmond hell mit sichtbaren Maria | offen |
| Desktop und A55: Maßstabspanel zeigt im Himmel nur Hinweis und Lupe, danach wieder alle Regler | offen |
| Desktop: Vollmond mit Ziel Erde und mit Ziel Sonne gleich hell (Aufhellung mit Ziel Erde voll) | offen |
| Desktop: Klick auf einen Jupitermond bei Lupe 25 zentriert ihn im Bild | offen |
| A55: Bildrate im Himmel (Lichtpunkte, Mondbahn, Sonnenschein) | offen |
| Desktop: Ein Planet hinter Mond oder Sonne verschwindet (Bedeckung) | offen |

### 5.10 Nachtrag Himmelsbild (30.09.2026)

Anlass war die erste Handprüfung der Himmelsansicht: Regler ohne Wirkung, keine Mondbahn, Planeten ohne
sichtbaren Punkt, eine orange Sonne und ein dunkler Vollmond (Entwurf §11). Der Nachtrag umfasst fünf Änderungen;
gemessen wurde am Prüfrechner wie in §5 (Chrome über Playwright, Vite-Server auf Port 5173, 1600×900 px,
Qualität „high“, Oberfläche ausgeblendet, Uhr angehalten, Pixelwerte mit Python). Commits auf dem Branch
`geozentrisch`: `78ca48a`, `2a0b118`, `17bd97a`, `bc3b806` mit Nacharbeit `ca86d0b`, `52b2bf5`.

**Lupe und Maßstabspanel (Entwurf §11.4, §11.5, `78ca48a`)**

| Größe | Vorher | Nachher | Soll |
|---|---|---|---|
| Tests | 5804 | 5815 | grün |
| Maßstabspanel der Himmelsansicht | alle Regler sichtbar, ohne Wirkung | Grundtext und Regler „Scheiben vergrößern“ (nur im Handmodus) | nur wirksame Elemente |
| Hinweis bei Lupe 20 | — | „Größen überhöht (20×)“ bei x 730–870, y 12–36, oben mittig | verdeckt weder Kopfzeile noch Infopanel |
| Lupenbereich | — | 1× bis 50×, Sonne höchstens 4× | Sonne unter 2,2° |

**Mondbahn (Entwurf §11.1, `2a0b118`)**

| Größe | Vorher | Nachher | Soll |
|---|---|---|---|
| Sichtbare Bahnlinien im Himmel | keine | nur die Mondbahn (`bahn-moon`) | nur der Mond |
| Großkreistest (Toleranz 1e-3) | — | bestanden | Linie liegt auf einem Großkreis |
| Klick auf die Linie (Pixel 975,85 / 434,32) | — | Ziel `moon`, Infopanel „Mond“ | Blick auf den Mond |
| Klick auf die Linie bei Blick auf Mars (Pixel 1333 / 477) | Ziel `mars`, Blickwinkel 2,626 | Ziel `moon`, Blickwinkel 2,300 | Schwenk auf den Mond |
| Tests | 5815 | 5819 | grün |

**Scheinbare Helligkeit (Entwurf §11.2, `17bd97a`)**

Darstellungsmodell vom Erdmittelpunkt aus (Lambert-Kugel), Werte in Größenklassen (mag) am 19.02.2027 12:00 UTC
(JD 2 461 456; Ganymed am 10.02.2027, JD 2 461 447,5):

| Körper | Modell (mag) | Beobachtung / Soll |
|---|---:|---|
| Mars | −1,33 | rund −1,3 bei der Opposition |
| Jupiter | −2,57 | rund −2,6 bis −2,7 |
| Saturn (ohne Ringe) | 0,95 | etwa eine halbe Klasse dunkler als beobachtet |
| Uranus | 5,77 | — |
| Neptun | 7,88 | — |
| Ganymed | 4,76 | unter 9,0 |
| Titan | 8,62 | unter 9,0 (Entwurfsrichtwert 8,5, Ruling 18) |
| Triton | 13,65 | über 9,0, ohne Lichtpunkt |

Reihenfolge Venus < Jupiter < Saturn < Neptun bestätigt; für jeden Katalogkörper liefert die Funktion eine Zahl
oder `null`, nie `NaN`. Tests 5819 → 5825.

**Lichtpunkte (Entwurf §11.2, `bc3b806`, Nacharbeit `ca86d0b`)**

Lichtpunkt je Planet und heller Mond, Größe nach scheinbarer Helligkeit; Blick auf den jeweiligen Körper, 60°,
19.02.2027. Gemessen als Durchmesser der flächengleichen Kreisfläche über der halben Höhe des Maximums im
Differenzbild „Markierungen“ an/aus:

| Körper | Punkt im Material (px) | Breite bei halber Höhe, erste Fassung (px) | Breite bei halber Höhe, nach Nacharbeit (px) | Soll |
|---|---:|---:|---:|---|
| Venus | 9,91 | — | 7,5 | 4–12 |
| Jupiter | 8,76 | 3–4 | 7,0 | 4–12, breiter als Mars |
| Mars | 7,97 | rund 3 | 6,1 | 4–12 |
| Saturn | 6,51 | — | 4,4 | kleiner als Jupiter |
| Uranus | 3,43 | — | 1,6 | kleinster Punkt |

Die erste Fassung des Profils war zu spitz (Breite bei halber Höhe rund 40 % des Materialdurchmessers); die
Nacharbeit brachte einen Kern mit glatter Flanke (t²(3−2t), Faktor 1,6) und lineare Texturfilter. Weitere Messwerte:

| Größe | Wert | Soll |
|---|---|---|
| Reihenfolge der Breite | Venus 7,5 > Jupiter 7,0 > Saturn 4,4 > Uranus 1,6 | nach Helligkeit |
| Jupiter mit Monden, 1,5° Bildwinkel | vier getrennte Maxima bei x = 825 (Io, 237), 810 (Europa, 238), 740 (Ganymed, 179), 724 (Kallisto, 179) | vier Monde einzeln erkennbar |
| Differenzbild „Markierungen“ an/aus | 97 abweichende Pixel, alle innerhalb 8 px um Mars und Jupiter | nur Lichtpunkte ändern sich |
| Kontrollbild aus/aus | 0 abweichende Pixel | 0 |
| Klick auf den Lichtpunkt von Saturn (Ziel Mars) | Ziel wird `saturn` | Blick auf den Punkt |
| Esc | Modus `attached`, kein Lichtpunkt sichtbar, 9 Glyphen wie zuvor | wie vorher |
| Bildrate, 5 s, 30 Tage/s | 60,0 gegen 60,1 Bilder/s vorher | kein Abfall |
| Tests | 5825 → 5834 | grün |

Merkur, Venus und Saturn lagen im Bild mit Blick auf Mars hinter der Kamera; Venus und Saturn wurden einzeln in die
Bildmitte gebracht.

**Sonne und Vollmond (Entwurf §11.3, `52b2bf5`)**

Sonne bei 20° Bildwinkel (45 px je Grad), Vollmond am 20.02.2027 15:00 UTC bei 2° (450 px je Grad), Mittel innerhalb
von 60 % des Scheibenradius:

| Größe | Vorher | Nachher | Soll |
|---|---|---|---|
| Sonne, Scheibenmitte (RGB) | 255 / 224,8 / 131,2 (Blau/Rot 0,52) | 255 / 251,1 / 240,2 (0,94) | nahezu weiß |
| Sonne, Grauwert bei 0,5° / 1° / 2° / 4° / 6° / 8° | 71,1 / 29,4 / 14,6 / 10,4 / 8,3 / 8,1 | 184,5 / 92,1 / 32,1 / 15,1 / 10,2 / 9,0 | monoton fallend |
| Blendschein bei 1° über dem Hintergrund | — | +83 | mindestens +60 |
| Blendschein bei 6° über dem Hintergrund | — | +1 | höchstens +5 |
| Vollmond, Mittel | 87,5 | 172,2 | 170 bis 215 |
| Vollmond, Anteil bei 255 | 0 % | 0 % | 0 % |
| Mars bei Lupe 30, 2°, Anteil bei 255 | 0 % (Mittel 108,7) | 0 % (Mittel 149,7) | unter 5 % |
| Sonne außerhalb der Himmelsansicht (Scheibenmitte) | 255 / 225,1 / 133,8 | 255 / 225,1 / 133,8 | unverändert |
| Tests | 5834 | 5840 | grün |

Ein fester Faktor für die Aufhellung erfüllte Mond und Mars nicht zugleich: bei 3,7 erreicht der Mond 172,2, der
Mars aber 24,6 % Ausbrand; bei 2,6 fällt der Mars auf 8,6 %, und schon bei 2,5 liegt der Mond nur bei 147,2. Die
Aufhellung wird daher je Ziel nach Albedo zurückgenommen (Ruling 22). Die Differenz von 371 Pixeln im Ganzbild der
Außenkontrolle gehört zu Sternen und Rauschen zwischen zwei Ladungen (Höchstwert 135 an Einzelpixeln); die
Scheibenmitte blieb gleich.

**Sammelwerte**

`npx tsc -b --noEmit` und `npm run lint` ohne Meldung, `npm test` 150 Dateien, 5840 Tests grün, `npm run build`
Hauptchunk 1 592,27 kB. Screenshots und Messskripte sind gelöscht, der Baum ist sauber. Die Wort- und
Trailerkontrolle nach der lokalen Projektanleitung ergab bei jedem Commit 0.

### 5.11 Vorprüfung am Desktop (30.09.2026)

Die Punkte der Handprüfung (§5.9) wurden am Desktop automatisch per Browsersteuerung und Pixelmessung vorgeprüft
(Chrome, 1600×900 px, Qualität „high“, Stand `423a1ac`); die Spalte „Ergebnis“ in §5.9 bleibt der Handprüfung
vorbehalten. Bilanz: 15 Punkte bestanden, 1 Befund, 5 nicht automatisierbar (Controller und alle A55-Punkte).

| Prüfpunkt | Ergebnis | Messwert |
|---|---|---|
| Maus: G, Esc, Ziehen, Rad, Klick, Objektbaum | bestanden | Ziehen 100/−30 px: yaw −0,628, pitch −0,188; Rad: Bildwinkel 60 → 45,1 → 79,9; Klick auf den Marspunkt: Ziel `mars` |
| Tastatur W/A/S/D und Q/E; Steuerkarte | bestanden | 400 ms: yaw ±0,52, pitch ±0,52, Bildwinkel +10,1° bzw. −22,6°; Pfeiltasten ändern die Zeitrate, nicht den Blick |
| Spuren, Ekliptik, Äquator; Maßstabsregler weg und wieder da | bestanden | 7 Spurobjekte folgen dem Kästchen; im Himmel 0 Maßstabsknöpfe, danach 3 |
| Kino Szene 20 Marsschleife | bestanden | Start 81,4 Tage vor der Opposition vom 7.11.2005; 13 Stichproben in 60 s, Mars durchgehend im Bild (x 623–1019, y 342–480), zwei Umkehrpunkte; Text 80 / 226 / 1058 Wörter |
| Teilen-Knopf, Link in neuem Tab | bestanden | `#date=2027-02-19T12:00Z&view=geo&body=jupiter&p=…`; Modus, Ziel, Winkel, Bildwinkel 6, Lupe 25 und Zeit gleich |
| Flug-Knopf aus dem Himmel | bestanden | Abstand 685 163 km vom Erdmittelpunkt, konstant über 800 ms, nach W 0,6 s außerhalb der Erde |
| Shift+W in der Marsschleife | Befund, behoben (§6 Nr. 34) | Das Kino endete stets, das Ziel war aber der Körper nächst der Bildmitte: nach 3 s `deimos`, nach 4 s `mars`, nach 7 s `jupiter` |
| Hohe Zeitrate, Taste R | bestanden | 30, −100 und 365 Tage/s: 59,9 bis 60,0 Bilder/s, längstes Bild 17,1 ms, 0 Bilder über 25 ms |
| Mondbahn; Klick auf die Linie | bestanden | nur `bahn-moon` sichtbar; Klick auf den Linienpunkt: Ziel `moon`, Winkel gleich Soll |
| Lupe, Hinweis, Monde spreizen | bestanden | Lupe 25: Jupiterradius 2,76 → 68,95 px, Io 14,9 → 371,4 px; Erdmond 122,685 px unverändert; Hinweis „Größen überhöht (25×)“ nur bei Lupe über 1 |
| Lichtpunkte nach Helligkeit; Jupiter mit vier Monden | bestanden | Helligkeitssumme Venus 8711, Jupiter 9615, Mars 3344, Saturn 4416, Neptun 148; vier getrennte Mondmaxima bei 1° bis 2° |
| Sonne mit Blendschein, Vollmond mit Maria | bestanden (Eindruck offen) | Sonne Mitte 255/255/253; Vollmond Mittel 172 von 255, Standardabweichung 33 |
| Maßstabspanel im Himmel | bestanden (Desktop) | nur Hinweis und „Scheiben vergrößern“ |
| Vollmond bei Ziel Erde, Sonne und Mond | bestanden | Mittel 172,29 / 172,70 / 172,39 |
| Klick auf einen Jupitermond bei Lupe 25 | bestanden | Io, Europa, Ganymed und Kallisto zentriert (Kallisto bei ausgeblendeter Oberfläche; das Infopanel fängt Klicks am rechten Rand ab) |
| Bedeckung | bestanden | Mond bedeckt Venus (JD 2 463 771,840) und Merkur (JD 2 463 657,677), Sonne bedeckt Venus (JD 2 463 385,92): im Differenzbild 0 abweichende Pixel; kurz davor 14 bis 73 |

Beim ersten Besuch mit frischem Profil hält die offene Info-Karte die Tastenkürzel gesperrt, G wirkt erst nach Esc.
Das ist beabsichtigt, fällt aber auf.

## 6. Rulings

Aus der Planung (Plan, Abschnitt Rulings):

1. **Maßstab überlagert statt überschrieben:** kein gemerkter Maßstab in Sitzung und Ansicht; jeder Ausstieg
   zeigt den eigenen Maßstab von selbst; Wächtertest `render/massstab.test.ts`.
2. **Dateinamen** `store/himmelsansicht.ts`, `render/camera/himmelsblick.ts`, `render/himmelslinien.ts`,
   `ui/himmelsmodus.ts`: „Himmel“ statt „geo“, damit sie nicht mit dem Himmelshintergrund
   (`render/milchstrasse.ts`, `HIMMEL_RADIUS`) verwechselt werden.
3. **Bahnlinien aus** in der Himmelsansicht, außer der Mondbahn (überholt, §5.10 und Entwurf §11.1).
4. **Szenenwechsel in oder aus der Himmelsansicht** ist ein Schnitt der Lage; der Blick schwenkt gedämpft.
5. **Zeitraffer der Szene** 2,7 Tage je Sekunde, 60 s, 30° Bildwinkel; Hochformat schneidet die Schleife
   waagerecht ab (§7).
6. **Deep Link:** `view=geo` mit abweichendem `body` richtet den Blick auf den Körper; ohne `body` gilt der
   Blick aus `p`; der Knopf schreibt `view=geo&body=<Ziel>`.
7. **Taste G schaltet um, Esc verlässt;** Esc beendet zuerst ein Kino.
8. **Himmelsschalter** im Darstellungspanel nur in der Himmelsansicht.
9. **Controller-Grafik der Steuerkarte unverändert;** die Tastaturliste bekommt zwei Zeilen.
10. **Opposition nach ekliptikaler Länge,** Suche über den Vorzeichenwechsel der Längendifferenz zur
    Gegensonne nahe 0°; innere Planeten liefern `null`.

Aus der Umsetzung:

11. **Kommentare in `render/`** nennen den eingestellten Maßstab nicht wörtlich als den Zustandsschlüssel des
    Maßstabs, sonst schlägt der Wächtertest an; der Wortlaut im Plan war ein Versehen. Kosten: keine.
12. **Maßstabspanel:** jede Schaltfläche und jeder Regler trägt ein eigenes `disabled` statt eines
    `fieldset`, weil jsdom und Screenreader es so sicher sehen. Falls falsch: nur Markup.
13. **Kommentar in `controller.test.ts`:** Grund für die Übergabe ohne Sprung ist die gehaltene gezeigte Lage
    (Schwelle 10⁶ km bleibt), nicht die Stauchung. Kosten: keine.
14. **Dev-Server** ohne `--host` (Vorabprüfung; lief nicht, wird bei Bedarf gestartet). Kosten: keine.
15. **Belichtung im Himmel:** `exposureTargetId` bleibt das Ziel (`targetId`), nicht die Erde: „Kamera
    belichtet auf das Ziel“ gilt weiter, und im Himmel ist `targetId` der angeschaute Körper; Belichtung
    auf die Erde gäbe stets 1 AE. Kosten, falls falsch: Helligkeit von Mond und gezoomten Planeten. Geprüft
    in §5.2 und §5.4: Mondscheibe bei Finsternis 8,84 gegen 83,99 ohne Schatten, Jupiter
    lesbar.
16. **Blende der Szene:** die 2-s-Blende des Zeitraffers bleibt auch für die Himmelsszene; sie verschiebt die
    Opposition in der Szene um bis zu 17 Tage und schwenkt den Blick in den ersten 2 s um bis zu 6,3°; die
    Rückläufigkeit (±41 Tage) bleibt ganz in der Szene (±81). Text und Kommentar beschreiben es. Kosten, falls
    falsch: kleine Codeänderung (Rate ohne Blende für den Bahntyp `himmel`).
17. **Fachprüfung Befund 7** (Tagesschritte der Spur nicht auf Selbstschnitt geprüft): unkritisch, der Text
    nennt das Zickzack ohne Schnitt nach Rechnung.

Aus dem Nachtrag Himmelsbild (Planung):

18. **Mondgrenze 9,0 statt 8,5:** Titan schwankt im Modell um 8,3 und erreicht 8,62; bei 8,5 blinkte er über das
    Jahr ein und aus. Kosten, falls falsch: Titan oder ein anderer schwacher Mond erscheint zu selten oder zu oft
    als Lichtpunkt; die Grenze ist eine Konstante.
19. **Sonnenfarbe nur im Himmel:** Außerhalb bleibt die orange getönte Scheibe, damit das bewährte Bild der
    übrigen Ansichten unverändert bleibt. Kosten, falls falsch: die Sonne erscheint in den übrigen Ansichten
    weiter orange; die Umschaltung ist ein Parameter.
20. **Hinweis bei jeder Überhöhung:** Schon ab einer Lupe knapp über 1 erscheint der Hinweis, unter 10× mit einer
    Nachkommastelle; er bleibt auch bei ausgeblendeter Oberfläche sichtbar, damit ein Bildschirmfoto die
    Überhöhung nennt. Kosten, falls falsch: ein Hinweis bei Lupe 1,01 wirkt pedantisch; Schwelle anheben.

Aus dem Nachtrag Himmelsbild (Umsetzung):

21. **Linke Spalte im Himmel:** nur das Maßstabspanel hatte wirkungslose Elemente; die Kamera zeigt im Himmel nur
    Modus und Bildwinkel, Kästchen und Beleuchtungsregler wirken auch dort, die Bahnlinien seit der Mondbahn.
    Am Code geprüft, nicht jedes Element im Browser. Kosten, falls falsch: ein weiteres wirkungsloses Element
    bleibt sichtbar.
22. **Aufhellung je Ziel nach Albedo:** `himmelAufhellungFuer` (Bezug 0,12, Exponent 1,5, mindestens 1) statt
    eines festen Faktors, weil der Mond mindestens 3,6 und der Mars höchstens etwa 2,3 braucht. Kosten, falls
    falsch: ein gestalteter Exponent, gestützt auf einen einzigen Marsmesspunkt; Körper neben dem Ziel werden mit
    dessen Faktor belichtet.
23. **Vollmond knapp über der Untergrenze:** Mittel 172 gegen Untergrenze 170, der Faktor 3,7 bleibt, weil mehr
    Faktor den Mars ausbrennen ließe. Kosten, falls falsch: knappe Reserve; die Messung ist deterministisch.
24. **Sonnenschein unverändert:** Deckkraft 0,7, r0 0,08 und die Sonnenfarbe (3, 3, 3) blieben, das Soll war im
    ersten Lauf erfüllt. Kosten: keine.
25. **Punktgröße geht vor Profilvorgabe:** Das Messsoll (Breite bei halber Höhe 4 bis 12 px, Jupiter breiter als
    Mars) geht dem zuerst vorgegebenen Texturprofil vor; die Nacharbeit machte das Profil flacher. Kosten, falls
    falsch: Punkte wirken größer als gewünscht.
26. **Lineare Texturfilter mitgenommen:** dieselbe Textur wurde ohnehin geändert; kleine Punkte flimmern so nicht.
    Kosten: keine.
27. **Faktor 1,6 der Punkttextur bleibt:** das Kernmaximum liegt schon bei 200 bis 240 von 255. Kosten: keine.
28. **Uranus bleibt unter 4 px:** Halbwertsbreite 1,6 px bei 3,4 px Material, folgt der Helligkeitsstaffelung.
    Kosten, falls falsch: `LICHTPUNKT_MIN_PX` anheben.
29. **Mars und Jupiter nur knapp getrennt** (6,1 zu 7,0 px): folgt der Formel mit 0,8 px Materialunterschied.
    Kosten, falls falsch: Steigung in `lichtpunktFuer` erhöhen (Frage 7).
30. **Klickprüfung der Mondbahn** mit Mars als Ausgangsziel per Kamerabefehl statt Klick im Objektbaum; die
    Ausrichtung ist ein bestehender, getesteter Weg. Kosten, falls falsch: die Handprüfung zeigt es.
31. **Kleinere Anpassungen:** `aria-label` „Scheiben vergrößern“ zusätzlich zur Beschriftung mit Wertanzeige,
    Erwartung an `lupe: 1` im übernommenen `geo` der Ansichten, das Linkprofil trug `lupe` ohne Änderung, die
    bestehende Erwartung an den Bahnaufruf um ein Argument ergänzt. Kosten: keine.
32. **Aufhellung mit Ziel Erde voll:** Die Erde ist in der Himmelsansicht der Beobachter, ihre Albedo (0,434) ist ohne
    Belang; `himmelAufhellungFuer('earth')` liefert wie beim Mond den vollen Faktor, sonst bliebe der Vollmond bei
    Ziel Erde (Objektbaum, Textverweis, Link `body=earth`) so dunkel wie vor dem Nachtrag. Kosten, falls falsch: der
    Vollmond wäre bei Ziel Erde heller als bei Ziel Venus; Ausnahme in `exposure.ts` streichen.
33. **Ausrichten auf die dargestellte Lage:** `himmelAusrichten` berechnet die Richtung aus `scaledPositionAt` mit dem
    dargestellten Maßstab (Ziel minus Erde), damit ein Klick auf den Lichtpunkt eines gespreizten Mondes bei Lupe 25
    dorthin zentriert; für Planeten, Erdmond und Lupe 1 gleicht das der wahren Richtung. Deep Links (`himmelsKoerperPatch`)
    und `startBlick` bleiben bei der wahren Richtung, weil die Lupe dort erst nach dem Blick gilt. Kosten, falls
    falsch: beim Einstieg mit Lupe über 1 und einem Mond als Ziel liegt der Blick neben dem Punkt; dann dieselbe
    Funktion dort verwenden.

34. **Shift+W in Himmelsszenen:** In einer Himmelsszene im Kino wird mit Shift+W (Controller: LB) der Szenenkörper
    Ziel (`targetId` der Szene, gelesen vor dem Ende des Kinos), nicht der Körper nächst der Bildmitte. Die Szene
    blickt auf die Mitte der Marsschleife; Mars, Phobos und Deimos liegen im Bild auf einem Pixel, später steht
    Jupiter näher an der Achse (Vorprüfung: `deimos`, `mars`, `jupiter`). In allen anderen Fällen bleibt die Regel
    „Körper nächst der Bildmitte“. Kosten, falls falsch: wer aus der Marsschleife bewusst einen anderen Körper
    nahe der Bildmitte greifen will, bekommt Mars; die Bedingung in `drehen` (`anwenden.ts`) streichen.

## 7. Unschärfen

**Darstellung**

- **Hochformat:** Die Szene Marsschleife ist auf 30° senkrecht eingestellt. Bei 9:16 ergibt das nur rund 17°
  waagerecht; die Schleife (19,5° breit) wird dort an den Seiten abgeschnitten. Gemessen ist das nur im
  Querformat 2560×1440 (Spannweite 898 px von 2560); die Handprüfung am A55 hochkant klärt, ob es stört (Ruling 5).
- **Blende des Zeitraffers:** Die 2-s-Blende verschiebt die Szenenmitte in den ersten Sekunden um bis zu 6,3°
  und die Opposition um bis zu 17 Tage (Ruling 16). Das wirkt als kurzes Nachziehen des Blicks zu Beginn.
- **Planetenpunkte ohne Magnitude (überholt, §5.10, Entwurf §11.2: jetzt Lichtpunkte nach Helligkeit):** Planeten und Monde erscheinen als Scheibe oder kleiner Punkt nach wahrer
  Größe und Beleuchtung, nicht mit scheinbarer Helligkeit (Größenklasse); ein ferner Planet ist im
  Weitwinkel kaum sichtbar, wird aber von seiner Spur und seinem Namen markiert.
- **Galileische Monde im Fernrohr (überholt, §5.10, Entwurf §11.2: bei 1,5° sind vier Monde zu sehen):** Bei 1° Bildwinkel sind Europa, Ganymed und Kallisto kleiner als 1 px und
  ohne Markierung, weil Mondnamen erst ab 8 px Radius erscheinen (§5.4). Nur Io fällt als heller Punkt auf.
- **Spur in Tagesschritten:** Die Anzeige verbindet Tagespunkte; kurze Kurvenstücke am Stillstand
  erscheinen leicht eckig (Fachprüfung Befund 7).
- **Entwicklungsserver:** Die React-Meldungen beim Neuladen (§5.8) stammen aus dem Entwicklungslauf und der
  Messung per `import()`; nicht mit `master` verglichen.

**Nachtrag Himmelsbild**

- **Helligkeit ist ein Darstellungsmodell:** Die Helligkeit der Lichtpunkte ist ein Darstellungsmodell
  (Lambert-Kugel, ohne Ringe und Oppositionseffekt); Saturn erscheint rund eine halbe Größenklasse zu dunkel.
- **Aufhellung gestaltet:** Der Exponent 1,5 und der Bezug 0,12 der Aufhellung je Ziel sind gestaltet, der Exponent
  stützt sich auf einen Marsmesspunkt. Jupiter, Saturn und die galileischen Monde als Ziel sind nicht gemessen
  (Faktor 1, eher zu dunkel). Der Vollmond liegt mit 172 knapp über der Untergrenze 170.
- **Ziele ohne Albedo:** Die Sonne und kleine Monde erhalten die volle Aufhellung 3,7; bei Ziel Sonne werden
  daneben stehende Scheiben mit dem Faktor des Ziels belichtet (Frage 6).
- **Punkte:** Uranus erscheint als Punkt von 1,6 px Halbwertsbreite; Mars und Jupiter unterscheiden sich nur um
  0,9 px (Frage 7).
- **Messumfang:** Vollmond und Marsgegenprobe nur an je einem Datum gemessen; das Verdecken eines Lichtpunkts durch
  Sonne oder Mond ist nur über die Materialeinstellungen getestet, nicht im Bild gemessen. Die Außenkontrolle der
  Sonne zeigt im Ganzbild 371 Pixel Rauschen zwischen zwei Ladungen.
- **Kommentare und Tests:** Der Kommentar an `HIMMEL_AUFHELLUNG` („gilt für alle beleuchteten Körper“) passt nicht
  mehr zur Aufhellung je Ziel; die Verdrahtung des Schalters „Markierungen“ in der Szene, der Zweig Phasenwinkel π
  der Helligkeit und `himmelsMassstab` bei Lupe ≤ 0 (über die Oberfläche nicht erreichbar) haben keinen eigenen Test;
  ein leerer Filter für die Bahnlinien blendet alle Linien aus (nur intern aufrufbar); der Großkreistest prüft nicht
  den Bahnabstand.
- **Oberfläche:** Der Hinweis zeigt bei einer Lupe knapp über 1 „1,0×“; das Panel nennt „12,3×“, der Hinweis „12×“;
  der Lupenregler trägt zwei gleichlautende Beschriftungen. Je Bild entsteht ein temporäres Feld aller Körper im
  Himmel (Bildrate unverändert bei 60 Bildern je Sekunde).

**Kleinigkeiten aus den Prüfungen der einzelnen Schritte (zurückgestellt, alle „kann bleiben“)**

- Gesperrte Maßstabsknöpfe haben kein eigenes `disabled:`-Styling; der Hover-Effekt bleibt sichtbar (gegenstandslos, §5.10: die Regler sind im Himmel ausgeblendet statt gesperrt).
- Ein laufender Voreinstellungs-Tween schreibt unter der Sperre bis 700 ms weiter (harmlos).
- Taste G hat keine Wiederholungssperre (`e.repeat`), gilt für alle Umschalter; Halten der Taste schaltet flackernd.
- `himmel()` in `controller.ts` setzt den Übergang beim Eintritt nicht zurück; Schwelle 10⁶ km beim Ausstieg
  ist grob.
- Die Spurpositionen werden je Bild auch bei angehaltener Zeit neu geschrieben.
- Für `himmelStarten` mit Ziel Sonne oder unbekannter Kennung fehlt ein Test; `view=geo&body` gleich dem Ziel aus
  `p` ebenso; kein `tickCinema`-Test für die Oppositionsszene.
- Testschärfe: Test `OPPOSITION_SUCHE_TAGE` prüft nur die Konstante; Schwelle 40,9 gegen 81 in `scenes.test.ts`;
  der Wächter im Maßstabstest erkennt nur den Wortlaut, nicht eine Destrukturierung.
- Kommentare: Umbrüche in `flug.ts` und im Szenenkommentar.
- Der Präsentationsmodus mit `view=geo&ui=off` hat an Touchgeräten keinen Ausstieg aus dem Himmel (festes Bild,
  vertretbar).
- Die Spuren rechnen bei Sprüngen über 365 Tage und rückwärts je Bild alle Tage neu (7 × 366 Richtungen);
  gemessen nur bei 1 Tag/s.
- Controller-Grafik der Steuerkarte zeigt die Himmelsbelegung nicht (Ruling 9); sie steht nur in der Tastaturliste.

## 8. Fragen an Jens

1. **Galileische Monde im Fernrohr:** durch Entwurf §11.2 beantwortet, bitte bestätigen. Jupiter mit seinen vier
   Monden erscheint bei 1 bis 2° Bildwinkel als Lichtpunkte nach Helligkeit (§5.10: vier getrennte Maxima bei 1,5°).
   Die ursprüngliche Frage, ob Monde bei kleinem Bildwinkel ohne Namen als Punkt markiert werden sollen, ist damit
   umgesetzt.
2. **Blende der Szene:** Reicht die Blende (Ruling 16), oder soll die Rate für Himmelsszenen ohne Blende
   laufen? Kleine Codeänderung.
3. **Hochformat:** Soll die Szene im Hochformat den Bildwinkel vergrößern (z. B. 40° senkrecht)? Handprüfung
   am A55 abwarten.
4. **Hauptchunk:** Der Chunk liegt nach dem Nachtrag Himmelsbild mit 1 592,27 kB (vorher 1 579,98 kB) über der
   Frageschwelle 1 571,79 kB (Phase 5), +23,07 kB gegenüber `master`; soll er geteilt werden (Katalog nachladen)
   oder bleibt es so?
5. **Abschluss:** Tag `v0.8.0`? Fast-Forward `geozentrisch` nach `master`, Branch löschen? Push (vorher Diff auf
   Zugangsdaten prüfen)? Deploy startet Jens selbst.
6. **Ziele ohne Albedo:** Die Sonne und kleine Monde als Ziel erhalten die volle Aufhellung 3,7 (Ruling 22). Soll das
   so bleiben? Alternative: für die Sonne einen eigenen, kleineren Faktor, damit Scheiben neben ihr nicht wie neben
   dem Mond belichtet werden.
7. **Staffelung der Lichtpunkte:** Mars und Jupiter erscheinen nur knapp unterschiedlich groß (6,1 zu 7,0 px). Soll
   die Staffelung nach Helligkeit verstärkt werden (steilere Steigung in `lichtpunktFuer`)? Kleine Codeänderung;
   vorher Handprüfung abwarten.

**Auswirkung auf jensfricke.com:** keine. Es entstehen keine neuen Speicherschlüssel (nur zusätzliche Felder in
`orrery.sitzung.v1` und `orrery.ansichten.v1`), keine Anfragen an fremde Server, keine neuen
Browserfunktionen oder Berechtigungen, keine Änderung an Einbettung, Domain oder `.htaccess`. Die
Datenschutzerklärung bleibt richtig.
