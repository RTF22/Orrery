# Phase 6 — Milchstraße im Hintergrund

Entwurf vom 25.09.2026. Phase 5 ist mit Tag `v0.6.0` abgeschlossen (Gesamtabnahme
`docs/phase5-abnahme.md`). Phase 6 bringt das Band der Milchstraße als Himmelshintergrund,
möglichst lagetreu und im Eindruck eines dunklen Himmels, und schließt mit Tag `v0.7.0`.
Die Veröffentlichung auf dem Webspace folgt danach mit eigener Freigabe.

## 1. Ausgangslage

- **Himmel.** Der Hintergrund besteht nur aus 5070 HYG-Sternen bis 6,0 mag
  (`data/stars/hyg.json`, `ASSETS.md` Abschnitt „Sternkatalog-Quelle“). `render/starfield.ts`
  legt sie als Punkte auf eine Kugel mit Radius 1e9 um den Ursprung, gedreht vom Äquator- ins
  Ekliptiksystem (`equatorialToEcliptic`, J2000, ε = 23,4392911°). Die Kamera sitzt
  konstruktionsbedingt im Ursprung, die Sterne zeigen deshalb keine Parallaxe. Ein diffuses
  Leuchten gibt es nicht.
- **Texturen.** Seit Etappe 5-3 gibt es KTX2-Stufen (1k ETC1S, ab 2k UASTC mit Zstandard),
  gebaut von Hand mit `npm run texturen` (`scripts/texturen-bauen.ts`,
  `scripts/textur-stufe.py`, KTX-Software 4.4.2 in `.cache/werkzeuge/ktx/`). Hochauflösende
  Quellen liegen nur im Cache und sind per sha256 festgehalten. `render/texturen.ts` lädt
  zuerst die kleinste Stufe und dann nach Bedarf bis zur Obergrenze der Qualitätsstufe
  (`TEXTUR_OBERGRENZE`: niedrig 1024, mittel 2048, hoch 8192).
- **Bloom.** `render/postfx.ts` schwärzt im Bloom-Durchgang alle deckenden Objekte außerhalb
  der Bloom-Ebene und blendet durchsichtige aus (`verdunkleSzeneAusserBloom`).
- **Darstellungsschalter.** `display` im Store trägt die Kästchen Bahnen, Beschriftungen,
  Marker, Gürtel, Schatten, Bloom; `ui/panels/DisplayPanel.tsx` zeigt sie über die Liste
  `SCHALTER`.

## 2. Entscheidungen (Jens, 25.09.2026)

- **Eindruck:** wie unter dunklem Himmel mit bloßem Auge — ein sichtbares Band mit
  Dunkelwolken, das sich nicht vor die Planeten drängt. Kein Langzeitfoto-Eindruck, kein
  Helligkeitsregler.
- **Quelle:** NASA SVS „Deep Star Maps 2020“, Variante „Milky Way Background“ (ohne die
  hellen Hipparcos- und Tycho-Sterne), in Himmelskoordinaten.
- **Schalter:** eigenes Kästchen „Milchstraße“ im Darstellungspanel, standardmäßig an.
- **Einordnung:** eigene Phase 6 mit Tag `v0.7.0`; Deploy nur nach Freigabe.

## 3. Quelle und Aufbereitung

### 3.1 Quelle

- NASA SVS „Deep Star Maps 2020“, <https://svs.gsfc.nasa.gov/4851>, Datei
  `milkyway_2020_8k.exr`: Plate carrée in ICRF/J2000 (Rektaszension und Deklination),
  OpenEXR mit Halbfließkommazahlen (HDR). Grundlage sind 1,7 Milliarden Sterne aus Gaia DR2;
  die Variante lässt die hellen Hipparcos- und Tycho-Sterne weg, sodass die HYG-Punkte
  (alle heller als 6,0 mag, also Teil von Hipparcos/Tycho) nicht doppelt erscheinen.
- Die Datei (130,9 MB) liegt nur im Cache (`.cache/`), nicht im Repository; URL und
  sha256 stehen in der Quellliste wie bei den 8k-Planetenquellen.
- **Namensnennung laut SVS:** „NASA/Goddard Space Flight Center Scientific Visualization
  Studio. Gaia DR2: ESA/Gaia/DPAC“. Vor dem ersten Bau wird an der Quelle geprüft, welche
  Bedingungen für den Gaia-Anteil gelten (SVS-Nutzungsbedingungen, ESA-Bedingungen für
  Gaia-Daten). Ergebnis und Wortlaut gehen in `ASSETS.md`. Verlangt eine Bedingung mehr als
  Namensnennung (etwa Weitergabe unter gleichen Bedingungen), wird das dort vermerkt und
  Jens vor dem Commit der Stufen gefragt.

### 3.2 Helligkeitskurve

- Ein Skript liest die EXR-Datei über das vorhandene ffmpeg als Fließkommabild (kein neues
  Python-Paket, keine neue Abhängigkeit in `package.json`) und bildet sie mit einer festen,
  monotonen Kurve (Verstärkung plus Potenz, Parameter im Skript mit Begründung) auf 8 bit
  sRGB ab.
- **Tonemapping:** Das ganze Bild läuft am Ende der Kette durch `OutputPass` mit ACES
  (`renderer.toneMapping`, Belichtung 1), die Sterne eingeschlossen. Das Skript rechnet
  deshalb vom gewünschten Schirmwert rückwärts: Kurve → Schirmwert (sRGB) → linear → Umkehrung
  der three-ACES-Kurve (`color *= exposure/0.6`, `RRTAndODTFit`; für Grauwerte sind Ein- und
  Ausgangsmatrix neutral) → Texturwert. Die Farbe wird als Verhältnis der Kanäle zur
  Leuchtdichte darübergelegt.
- **Zielwerte** (Schirmwerte von 255, vom Skript an der 2k-Stufe über die Vorwärtsrechnung
  ACES → sRGB vorhergesagt; in der 8k-Stufe heben einzelne Gaia-Sterne das Perzentil):
  - hellste Sternwolken (Schütze, Schild; 99,5-Perzentil des Bandes): 60 bis 70,
  - mittleres Band (Median der Pixel mit galaktischer Breite |b| < 10°): 20 bis 30,
  - galaktische Pole (Mittel über |b| > 80°): höchstens 6.
- Die Farbe der Vorlage bleibt erhalten; die Kurve wirkt auf die Leuchtdichte und skaliert
  die drei Kanäle gemeinsam.

### 3.3 Stufen

- Aus dem 8-bit-Bild entstehen mit der vorhandenen Werkzeugkette die Stufen 1024 (ETC1S),
  2048 und 8192 (UASTC mit Zstandard) als `textures/milchstrasse/himmel-<breite>.ktx2`
  (Seitenverhältnis 2:1). Die Stufen sind versioniert wie die der Körper.
- Erwartete Größe der 8k-Stufe 10 bis 15 MB (Erde 8k: 13 MB).

### 3.4 Lageprüfung im Skript

Das Skript bricht ab, wenn die Karte gespiegelt oder verschoben ist. Es sucht im geglätteten
1k-Bild das Helligkeitsmaximum in einem Fenster von 10° um drei Sollpunkte und verlangt eine
Abweichung von höchstens 2° (galaktisches Zentrum 5°, siehe unten):

| Merkmal | RA | Dec |
|---|---|---|
| Galaktisches Zentrum (Sternwolken um Sgr A*) | 266,4° | −28,9° |
| Große Magellansche Wolke | 80,9° | −69,8° |
| Kleine Magellansche Wolke | 13,2° | −72,8° |

Die Konvention der SVS-Karte nennt die Quelle nicht; sie wurde am 25.09.2026 an der
Vorschau `milkyway_2020_4k_print.jpg` (1024×512) bestimmt: RA 0h in der Bildmitte, RA wächst
nach links, Norden oben. Die Maxima lagen 0,8° (Große) und 0,1° (Kleine Magellansche Wolke)
neben dem Sollpunkt, am galaktischen Zentrum 4° daneben auf der großen Sternwolke im
Schützen (RA 270,5°, Dec −29,0°) — dort gilt deshalb eine Toleranz von 5° statt 2°. Die
Magellanschen Wolken entscheiden Richtung und Nullpunkt. Dieselbe Umrechnung von Pixel in
RA/Dec wie in §4.2 wird im Skript benutzt.

## 4. Darstellung

### 4.1 Modul

- Neues Modul `render/milchstrasse.ts`: eine von innen gesehene Kugel (`BackSide`) um den
  Ursprung, ohne Beleuchtung. Sie wird wie die Sterne nie kamerarelativ verschoben (keine
  Parallaxe) und als deckendes Objekt mit `renderOrder = -1` zuerst gezeichnet (three.js
  zeichnet durchsichtige Objekte wie das Sternfeld nach den deckenden), ohne
  Tiefentest und ohne Schreiben in den Tiefenpuffer, sodass die HYG-Punkte scharf obenauf
  liegen und kein Körper verdeckt wird. `frustumCulled = false` aus demselben Grund wie beim
  Sternfeld.
- **Helligkeit:** fest wie bei den Sternen, unabhängig von Helligkeitsregler und Belichtung.
  Das Tonemapping am Ende der Kette gilt wie für die Sterne und ist in §3.2 eingerechnet.
- **Bloom:** Im Bloom-Durchgang wird die Kugel ausgeblendet bzw. geschwärzt; sie strahlt
  nicht. Ein Test in `postfx.test.ts` hält das fest.

### 4.2 Lage

- Die Kugel nutzt `equatorialToEcliptic` aus `starfield.ts` (gemeinsame Drehung, nicht
  kopiert). Die Umrechnung zwischen RA/Dec und Texturkoordinaten ist eine reine, getestete
  Funktion. Die Kugel ist ein eigenes Gitter auf RA/Dec-Linien mit doppelter Randspalte;
  die Naht der Karte bei RA 180° (linker und rechter Bildrand) liegt auf einem Längenkreis
  und zeigt keine Kante (Test über die Texturkoordinaten beiderseits der Naht, Sichtprüfung §6.2).

### 4.3 Laden

- Die 1k-Stufe wird nach den Startladungen der Körper geladen.
- Danach wird bis zur Obergrenze der Qualitätsstufe nachgeladen (niedrig 1k, mittel 2k,
  hoch 8k). Der Himmel füllt immer den ganzen Schirm; die Stufe richtet sich deshalb nach
  der Obergrenze, nicht nach einem Durchmesser. Die Kugel steht dabei hinter allen Körpern
  und belegt keinen der `MAX_NACHLADEN`-Plätze, solange ein Körper wartet.
- Ist das Kästchen aus, wird nichts geladen; beim Einschalten beginnt das Laden.
- Eine gescheiterte Stufe bleibt wie bei den Körpern ohne Meldung aus; die bisherige steht
  weiter, ohne jede Stufe bleibt der Himmel schwarz wie heute.
- Grafikspeicher: 8k transkodiert rund 43 MB mit Mipmaps, nur bei Stufe „hoch“.

## 5. Schalter und Zustand

- Neues Feld `display.milchstrasse: boolean`, Standard `true`, behandelt wie die übrigen
  Darstellungsschalter: geteilter Link, Sitzungswiederherstellung, benannte Ansichten,
  Prüfroutine in `store/pruefer.ts`. Links, Sitzungen und Ansichten ohne das Feld ergeben
  „an“.
- Kästchen „Milchstraße“ / „Milky Way“ im Darstellungspanel direkt unter „Gürtel“. Keine
  Taste, kein Regler.
- Kino: Es gilt der Schalter; keine Szene schaltet ihn um.
- Namensnennung in `ASSETS.md` (wie bei den Texturen), der vorhandene ASSETS-Test deckt die
  neuen Dateien ab.

## 6. Prüfung

### 6.1 Tests

- Umrechnung RA/Dec ↔ Texturkoordinaten an Referenzpunkten und an der Naht (RA 180°).
- Gemeinsame Drehung mit `starfield.ts` (dieselbe Funktion, gleiche Richtung für denselben
  Himmelspunkt).
- Stufenwahl je Qualitätsstufe, Reihenfolge hinter den Körpern, kein Laden bei Kästchen aus.
- Schalter: Standard, Link, Sitzung, Ansichten, Prüfroutine, Kästchen in beiden Sprachen.
- Ausblendung im Bloom-Durchgang.
- `ASSETS.md`-Eintrag über den vorhandenen Test.

### 6.2 Sichtprüfung in Pixelwerten

Playwright-Aufnahme, Messung mit Python (Pillow/numpy), Uhr angehalten, Stufe „hoch“:

- **Differenzbild Kästchen an/aus** in derselben Ladung: auf Körperscheiben ohne ihre
  Randpixel und in den Kernen der Sternpunkte 0 abweichende Pixel; Kontrollbild ohne Umschalten mit 0 abweichenden Pixeln.
- **Lage:** Kamera auf galaktisches Zentrum, Kreuz des Südens mit Kohlensack und die
  Magellanschen Wolken. Maximum bzw. Dunkelfleck liegt an der Sollstelle, gemessen relativ
  zu HYG-Sternen im selben Bild (etwa α/β Crucis neben dem Kohlensack).
- **Helligkeit:** Der Schirm zeigt, was das Skript vorhersagt (Median im Bildausschnitt,
  Abweichung höchstens 3 von 255); weicht er ab, gilt der Schirm, und die Kurve wird
  nachgeführt.
- **Naht:** kein Helligkeitssprung entlang RA 180° (dort, wo der Längenkreis das Band beim
  Kreuz des Südens schneidet).
- **Bildrate** per eigenem rAF-Zähler unverändert gegenüber Kästchen aus; Startladung bleibt
  unter 4 MB (Ziel aus 5-3).

### 6.3 Handprüfung (Jens)

Eindruck am Desktop und auf dem A55 (Stufe „mittel“), Kästchen an/aus.

## 7. Aufteilung

| Task | Inhalt |
|---|---|
| 1 | Quelle und Stufen: Lizenz an der Quelle, Aufbereitungsskript mit Kurve und Lageprüfung, KTX2-Stufen, `ASSETS.md` |
| 2 | Schalter: Zustand, Link, Sitzung, Ansichten, Prüfroutine, Kästchen, beide Sprachen (zunächst ohne Wirkung) |
| 3 | Darstellung: `render/milchstrasse.ts`, Einbindung in die Szene, Laden abhängig vom Schalter, Bloom-Ausnahme |
| 4 | Abnahme: Sichtprüfung, Protokoll `docs/phase6-abnahme.md`; nach Jens' Handprüfung Nachtrag, README-Stand, Tag `v0.7.0` |

Arbeitsweise wie bisher: Branch `phase6`, ein Umsetzer gleichzeitig, eine Prüfrunde je
Task, Rulings ins Ledger, vor „fertig“ `npm run lint`, `npm test`, `npm run build`. Die
Wort- und Trailerprüfung aus der lokalen Projektanleitung gilt für jeden Commit.
