# Geozentrische Sicht — Himmel vom Erdmittelpunkt

Entwurf vom 29.09.2026. Anlass ist die Anfrage einer Privatperson nach einer „explizit
geozentrischen Sicht“: von der Erde aus ins Sonnensystem schauen. Die Anfrage ist kein Auftrag;
abgeleitet wird ein Feature, das für Orrery selbst sinnvoll ist.

## 1. Ziel

Ein neuer Kameramodus zeigt den Himmel so, wie ihn ein Beobachter im Erdmittelpunkt sähe:
Sonne, Mond und Planeten an ihren wahren Richtungen und in wahrer Winkelgröße vor Sternen und
Milchstraße. Im Zeitraffer hinterlassen die Planeten Spuren; dadurch werden rückläufige
Schleifen und Konjunktionen sichtbar. Das ist der Lehrinhalt: warum die Planeten am Himmel
zeitweise rückwärts laufen, obwohl sie die Sonne stets in derselben Richtung umkreisen.

## 2. Entscheidungen (Jens, 29.09.2026)

- **Grundlage ist der echte Himmel** (richtige Winkel und Größen, Planeten als beschriftete
  Punkte), darauf **Zeitraffer und Spuren**. Ein Schaubild mit vergrößerten Planeten von der Erde
  aus scheidet aus, weil dessen Richtungen falsch wären (siehe §3).
- **Beobachter im Erdmittelpunkt, ohne Horizont.** Kein Standort, keine Auf- und Untergänge,
  kein Tageshimmel. Planetariumsprogramme mit Horizont gibt es schon (Stellarium).
- **Weg 1:** eigener Kameramodus, der für seine Dauer den Maßstab „realistisch“ erzwingt. Eine
  zweite, maßstabsunabhängige Himmelsdarstellung (Weg 2) entfällt.

## 3. Warum der Maßstab „realistisch“ nötig ist

`compressDistance` in `sim/scale.ts` staucht heliozentrische Beträge und erhält nur die
Richtungen **von der Sonne aus**. Von der Erde aus gesehen verschiebt die Stauchung die
Richtungen zu den übrigen Planeten; `sizeScale` vergrößert zudem die Winkelgrößen. Bei
`SCALE_PRESETS.realistisch` (`sizeScale` 1, `distanceExponent` 1, `sunDamping` 1) ist die
dargestellte Position jedes Körpers seine echte, und die Kamera in der Erdposition sieht jede
Richtung und jede Winkelgröße richtig. Planeten erscheinen dann als Markierungen unter
`MARKER_MIN_PIXEL` mit Beschriftung (`render/labels.ts`), Sonne und Mond als Scheiben von rund
0,5°.

## 4. Verhalten und Bedienung

### 4.1 Einstieg und Ausstieg

- Neuer Wert `'geozentrisch'` in `CameraMode` (`store/types.ts`). Auswahl dort, wo die übrigen
  Kameramodi auswählbar sind, dazu die **Taste G** (frei; weder `ui/shortcuts/useShortcuts.ts`
  noch die Flugsteuerung belegen sie).
- Beim Einstieg wird der aktuelle `scale` gemerkt und auf `SCALE_PRESETS.realistisch` gesetzt.
  Die Erde (Kugel, Wolken, Atmosphäre) wird über einen Store-Schalter ausgeblendet, nicht über
  `visible`-Getter.
- Beim Ausstieg (Esc, anderer Modus, Kino, Ansicht laden, Deep Link mit anderem Modus) kehren
  der gemerkte Maßstab und die Erde zurück.
- Während des Modus ist der Maßstabsregler gesperrt und nennt in einem kurzen Hinweis den
  Grund.

### 4.2 Blick

- Die Kamera sitzt fest in der dargestellten Erdposition und wandert mit der Erde auf ihrer
  Bahn.
- Umsehen mit Maus, Touch und rechtem Stick; die Blickrichtung liegt als `yaw`/`pitch` in
  ekliptikalen Koordinaten J2000 (dasselbe Bezugssystem wie die übrige Anwendung, siehe
  `sim/frames.ts`). WASD und die Bewegungstasten des Flugs bleiben ohne Wirkung.
- **Zoom ändert den Bildwinkel**, etwa 90° bis 1°. Bei 1° erscheint Jupiter mit rund 18 px, die
  galileischen Monde stehen als Punkte daneben.
- Ein Klick auf einen Körper richtet den Blick auf ihn aus (weiche Drehung), statt zu ihm zu
  fliegen; das Infopanel öffnet sich wie gewohnt.

### 4.3 Zeit

Die Zeitsteuerung bleibt unverändert. Die Schleifen entstehen erst im Zeitraffer.

### 4.4 Weitergabe und Speicherung

- Deep Link: `#view=geo`; Blickrichtung und Bildwinkel (`yaw`, `pitch`, `fov`) im
  Grundlagenparameter `p`. Zusammen mit `date` ergibt das Links wie „Mars rückläufig im Januar
  2027“. `scene` behält Vorrang.
- Gespeicherte Sitzung und Ansichten übernehmen den Modus samt Blick. Der Maßstab ergibt sich
  beim Laden aus dem Modus; der gemerkte Maßstab für den Ausstieg wird mitgespeichert, damit
  ein Neuladen im Modus den Weg zurück nicht verliert.
- `ansichtAnwenden` behandelt den Modus wie `'attached'` (bleibt erhalten), nicht wie
  `'cinema'` (wird zu `'free'`).

### 4.5 Kino-Szene „Marsschleife“

- Neue Szene `marsschleife` in `data/scenes.ts`, Kamera im geozentrischen Modus, Blick auf Mars
  mit einem Bildwinkel, der die ganze Schleife samt Umgebung zeigt.
- Zeitpunkt selbst berechnet wie bei `mondfinsternis`: `zeitpunkt: 'naechste-mars-opposition'`
  springt vor die nächste Opposition, sodass die Szene nicht veraltet. Die nächste Opposition
  liegt am 19.02.2027; die Rückläufigkeit umfasst grob Januar bis April.
- Zeitraffer so, dass die Rückläufigkeit samt Vor- und Nachlauf in die Szenendauer passt. Die
  genauen Werte legt der Plan fest und belegt sie in einem Kommentar wie bei `mondfinsternis`.

### 4.6 Nicht enthalten

Horizont, Standort, Refraktion, Tageshimmel, Sternbildlinien und -grenzen, Helligkeit der
Planetenpunkte nach Magnitude, Monatsmarken an den Spuren, Beschriftung der Linien,
Sonnenfinsternis als zugesagte Funktion (siehe §5.3).

## 5. Darstellung

### 5.1 Spuren

- Für Merkur bis Neptun. Die Sonne erhält keine Spur (ihr Weg ist die Ekliptik), der Mond
  keine (seine Monatsbahn überdeckte alles).
- Jede Spur zeigt die **zurückliegenden 365 Tage**, ein Stützpunkt je Tag, nach hinten
  auslaufend (Deckkraft und Breite nehmen ab). Farbe je Planet fest.
- Richtung: `positionAt(körper) − positionAt('earth')`, normiert, gezeichnet auf einer
  Himmelskugel um die Kamera, Tiefentest aus, hinter den Körpern.
- Aktualisierung: Rückt die Zeit um einen ganzen Tag vor, kommt ein Stützpunkt hinzu
  (Ringpuffer). Rückwärtslauf und Sprünge über die Fensterlänge berechnen alles neu (8 × 365
  Aufrufe von `positionAt`).
- Kästchen `display.spuren`, Standard an; wirkt nur im geozentrischen Modus.

### 5.2 Bezugslinien

- **Ekliptik** als Großkreis in der Ebene z = 0 des ekliptikalen Systems.
- **Himmelsäquator**, um `EKLIPTIK_SCHIEFE_GRAD` um die x-Achse geneigt, mit kleiner Marke am
  Frühlingspunkt (Richtung +x, Äquinoktium J2000).
- Dezent, einzeln schaltbar: `display.ekliptik` (Standard an), `display.aequator` (Standard
  aus). Beide wirken nur im geozentrischen Modus.

### 5.3 Folgen des Ausblendens der Erde

- Die Erde bleibt **Okkluder** in `render/shadows.ts`; nur ihr Netz wird nicht gezeichnet. Eine
  Mondfinsternis ist aus dem Erdmittelpunkt also richtig zu sehen.
- Ein Mond vor der Sonne wäre ebenfalls zu sehen. Weil das Mondmodell im Zeitpunkt bis zu ±4 h
  abweicht (`sim/finsternis.ts`), wird das nicht als Funktion zugesagt.
- Die Kamera liegt innerhalb der Erdkugel; der Nahbereich der Kamera ist darauf zu prüfen, dass
  der Mond (rund 384 000 km) und nahe Körper ohne Tiefenfehler erscheinen.

## 6. Aufbau

Schichten wie gehabt: `ui/` → `store/` → `render/` → `sim/`.

| Schicht | Datei | Inhalt |
|---|---|---|
| sim | `sim/geozentrisch.ts` (neu) | geozentrische Richtung, ekliptikale Länge und Breite, Suche der nächsten Opposition (Minimum des Winkels zur Gegensonne, Grobsuche und Verfeinerung nach dem Muster von `finsternis.ts`); ohne `three`, ohne Import aus `data/` |
| store | `store/types.ts`, Aktionen, `pruefer`, `persist`, `deeplink` | Modus, gemerkter Maßstab, Schalter „Erde ausblenden“, drei `display`-Kästchen, Blick (`yaw`, `pitch`, `fov`), `view=geo` |
| render | `render/camera/` | Kamera im Erdmittelpunkt, Blick, Bildwinkel-Zoom, Ausrichten per Klick |
| render | `render/himmel.ts` (neu) | Spuren, Ekliptik, Äquator, Frühlingspunkt |
| render | `render/bodies.ts` | Erde auf Schalter ausblenden, Okkluder bleibt |
| app | `app/cinema.ts` | Zeitpunkt `naechste-mars-opposition` |
| ui | Kameraauswahl, `useShortcuts`, Maßstabsregler, Darstellungskästchen, Steuerkarte, i18n | Bedienung DE/EN |
| data | `data/scenes.ts`, `data/texte/` | Szene `marsschleife` samt Texten in drei Stufen und zwei Sprachen (6 Dateien, vom Vollständigkeitstest verlangt) |

Die Hochschulfassung des Szenentexts folgt den Regeln der Hochschultexte (Belegliste, geprüfte
DOI, eine Prüfrunde).

## 7. Tests und Abnahme

- **sim:** Mars-Opposition 19.02.2027 auf ±2 Tage; geozentrische Richtungen gegen
  JPL-Horizons-Stichproben (Toleranz nach Genauigkeit der Bahnelemente, im Plan festgelegt);
  Umkehrpunkte der Schleife: die ekliptikale Länge des Mars nimmt um die Opposition zeitweise ab.
- **store / Deep Link:** Maßstab hin und zurück; Ausstieg über jeden Weg aus §4.1 stellt ihn
  wieder her; `#view=geo` rundet über Sitzung und Ansicht verlustfrei; Prüfer verwirft
  ungültige Blickwerte.
- **render:** Spuren-Ringpuffer (Vorlauf, Rückwärtslauf, Sprung); Linien in der richtigen
  Ebene; Erde ausgeblendet, Okkluder aktiv.
- **Sichtprüfung mit Pixelwerten:** Spurende und Planetenmarkierung decken sich (≤ 1 px);
  Differenzbild Erde an/aus zeigt keine Erde, aber weiter den beschatteten Mond während einer
  Mondfinsternis; die Schleife ist in der Kino-Szene sichtbar.
- Vor „fertig“: `npm run lint`, `npx tsc -b --noEmit`, `npm test`, `npm run build`.

## 8. Auswirkung auf jensfricke.com

Keine. Es entstehen keine neuen Speicherschlüssel (nur zusätzliche Felder in
`orrery.sitzung.v1` und `orrery.ansichten.v1`), keine Anfragen an fremde Server, keine neuen
Browserfunktionen oder Berechtigungen, keine Änderung an Einbettung, Domain oder `.htaccess`.
Die Datenschutzerklärung bleibt richtig.

## 9. Zuschnitt

Eine Etappe auf dem Branch `geozentrisch`, jeder Task mit eigenem Commit und grünen Tests:

1. sim: Richtung und Oppositionssuche
2. store: Modus, Maßstab, Schalter, Persistenz, Ansichten
3. Kamera im Erdmittelpunkt
4. Spuren und Bezugslinien
5. Oberfläche und Tastenkürzel
6. Deep Link
7. Kino-Szene `marsschleife`
8. Szenentexte (drei Stufen, DE/EN) mit einer Fachprüfung
9. Abnahme mit Protokoll `docs/geozentrisch-abnahme.md`

Tag `v0.8.0` nach der Abnahme, sofern Jens ihn will.

## 10. Nachtrag aus der Planung (29.09.2026)

Beim Lesen des Codes für den Plan (`docs/superpowers/plans/2026-09-29-geozentrisch.md`) ergaben
sich folgende Präzisierungen; sie ändern das sichtbare Verhalten aus §4 und §5 nicht, außer wo
vermerkt.

1. **Maßstab wird überlagert, nicht überschrieben** (statt §4.1 „merken und setzen“ und §4.4
   „gemerkter Maßstab wird mitgespeichert“): `state.scale` bleibt unverändert; eine Funktion
   `dargestellterMassstab(state)` in `store/himmelsansicht.ts` liefert in der Himmelsansicht
   `SCALE_PRESETS.realistisch`, sonst `state.scale`. Alle Leser in `render/` gehen über sie. Jeder
   Ausstieg stellt den alten Maßstab damit von selbst wieder her, Sitzung und Ansichten brauchen
   kein zusätzliches Feld.
2. **Himmelsansicht** heißt: `camera.mode === 'geozentrisch'` oder ein Kino, dessen aktuelle Szene
   den neuen Bahntyp `himmel` trägt (Szene `marsschleife`). Ein Szenenwechsel in die Himmelsansicht
   oder aus ihr heraus ist ein Schnitt.
3. **Spuren** laufen nur in der Deckkraft aus; WebGL zeichnet Linien mit 1 px, eine Breite lässt
   sich nicht staffeln (§5.1).
4. **Bahnlinien** sind in der Himmelsansicht aus: Die Erdbahn verliefe durch die Kamera und läge
   als Großkreis über dem ganzen Himmel.
5. **Tastatur und Controller** (statt §4.2 „WASD ohne Wirkung, rechter Stick“): W/S heben und
   senken den Blick, A/D schwenken, Q/E zoomen; am Controller schwenkt der linke Stick, RT/LT
   zoomen. Der rechte Stick bleibt das Fadenkreuz, A richtet den Blick auf den Körper darunter.
6. **Zeitpunkt der Szene** generisch als `zeitpunkt: 'naechste-opposition'` für den Zielkörper;
   die Opposition gilt in ekliptikaler Länge (Längendifferenz zur Sonne 180°).
7. **Startblick:** auf das Ziel, wenn es weder Erde noch Sonne ist, sonst zur Gegensonne.
   Ausstieg mit G, Esc oder Modusknopf: Ziel Erde → Fahrt zur Erde, sonst geheftet um das Ziel an
   der gezeigten Lage. Die drei Kästchen aus §5 erscheinen im Darstellungspanel nur in der
   Himmelsansicht.

## 11. Nachtrag nach der ersten Handprüfung (30.09.2026)

**Anlass (Jens):** Im Prinzip funktioniert alles, das Bild ist aber wenig beeindruckend. Man sieht nur
Spuren und Markierungen, einzig die Sonne ist als Körper zu erkennen und unerwartet klein; der Mond hat
keine Bahnlinie. Gemessen bei 1600 × 900 px und 60° Bildwinkel am 19.02.2027: Sonne eine orange
Scheibe von rund 6 bis 8 px mit schwachem Schein, Mond (fast voll) eine graue Scheibe von rund 8 px
ohne Beschriftung, Planeten nur als Ersatzglyphen von 3 px. Das entspricht dem echten Himmel: Sonne
und Mond sind dort ebenfalls nur ein halbes Grad groß. Der Eindruck des echten Himmels kommt von
Helligkeit und Blendung, nicht von Größe.

**Grundsatz (Jens, 30.09.2026):** Richtungen bleiben exakt. Überhöht werden nur die Darstellung der
Helligkeit und, auf Wunsch des Nutzers, die Winkelgrößen; jede Größenüberhöhung wird angezeigt.

### 11.1 Mondbahn

- In der Himmelsansicht zeichnet die Bahnlinienschicht genau eine Bahn: die des Mondes (Ausnahme von
  §10 Punkt 4). Vom Erdmittelpunkt aus ist sie sein Weg am Himmel, ein Großkreis rund 5° gegen die
  Ekliptik geneigt; wo sie die Ekliptik schneidet, liegen die Knoten, an denen Finsternisse möglich
  sind. Die Linie folgt `display.orbits` und der Sichtbarkeit des Mondes, auch in Himmelsszenen.
- Ein Klick auf die Linie richtet den Blick auf den Mond (Jens). Der Bahntreffer liefert die Kennung
  `moon`, der Klick in der Himmelsansicht richtet den Blick aus wie bei einem Klick auf den Körper.
- Die Planetenbahnen bleiben in der Himmelsansicht aus.

### 11.2 Lichtpunkte

- In der Himmelsansicht ersetzt eine WebGL-Punktschicht die Ersatzglyphen: Jeder Körper außer Sonne,
  Erde und Mond erscheint an seiner wahren Richtung als weicher Lichtpunkt, dessen Durchmesser und
  Deckkraft mit der scheinbaren Helligkeit wachsen. Die Beschriftungen bleiben wie bisher.
- Die scheinbare Helligkeit ist eine Modellrechnung ohne `three` in `sim/`:
  `m = m☉ − 2,5 · lg(p · (R/Δ)² · Φ(α) · (1 AE/r)²)` mit `m☉ = −26,74`, geometrischer Albedo `p`,
  Radius `R`, Abstand zur Erde `Δ`, Abstand zur Sonne `r` und Lambert-Phasenfunktion `Φ(α)`. Ringe,
  Oppositionseffekt und Farbe bleiben außer Acht; die Rechnung muss Venus heller als Jupiter und
  Jupiter heller als Saturn liefern und Neptun schwächer als die übrigen Planeten. Für `p` gilt
  `physical.albedo`; ein Körper ohne Wert erhält einen im Plan festgelegten Ersatz.
- **Auswahl:** Planeten und Zwergplaneten immer, mit Mindestdurchmesser und Mindestdeckkraft, damit
  kein Körper verschwindet, der heute eine Glyphe trägt. Monde nur bis zu einer im Plan festgelegten
  Grenzhelligkeit (Richtwert m ≤ 8,5, also etwa Titan und die galileischen Monde); das beantwortet
  zugleich Frage 1 aus dem Abnahmeprotokoll.
- **Übergang zur Scheibe:** Wird die wahre Scheibe größer als die Ersatzgröße (`MARKER_MIN_PIXEL`),
  blendet der Punkt aus und die Kugel übernimmt, wie heute bei der Glyphe.
- **Klickflächen:** Treffer und Hervorhebung nutzen den Radius des Lichtpunkts, wo die Glyphe genutzt
  wurde.
- Außerhalb der Himmelsansicht ändert sich nichts.

### 11.3 Sonne und Mond

- Die Sonne erhält in der Himmelsansicht einen Blendschein: einen weichen Halo von wenigen Grad um die
  Scheibe, die selbst in wahrer Größe bleibt. Die Scheibe soll weiß bis gelblich erscheinen, nicht
  orange; die Ursache des Farbtons klärt der Plan am Code.
- Die Mondscheibe soll bei Vollmond hell wirken. Der Plan legt Messpunkt und Zielwert fest (Ruling 15,
  Belichtung auf das Ziel, bleibt in Kraft).

### 11.4 Scheiben vergrößern

- Regler „Scheiben vergrößern“ von 1× bis 50×, Standard 1×. Er erscheint in der Himmelsansicht im
  Maßstabspanel neben den weiterhin gesperrten Maßstabsreglern.
- `dargestellterMassstab` liefert in der Himmelsansicht
  `{ sizeScale: lupe, distanceExponent: 1, sunDamping: min(1, SONNE_LUPE_MAX / lupe) }` mit
  `SONNE_LUPE_MAX = 4` (Sonne höchstens rund 2,1°). Der Wächtertest `render/massstab.test.ts` bleibt.
- Folgen aus dem Bestand (`scaledPositionAt` rückt Monde mit `sizeScale` vom Mutterkörper ab): Der
  Erdmond behält Richtung und Winkelgröße, weil Abstand und Radius um denselben Faktor wachsen. Die
  Monde der übrigen Planeten spreizen sich um denselben Faktor wie ihr Planet, wie unter einer Lupe
  um ihn herum. Planetenrichtungen, Spuren und Bezugslinien bleiben unberührt.
- Solange der Faktor über 1 liegt, zeigt die Ansicht den Hinweis „Größen überhöht (n×)“. Bedeckungen
  und Finsternisse sind dann nicht maßstäblich.
- Zustand `camera.geo.lupe` (1 bis 50) neben Blick und Bildwinkel: Sitzung, Ansichten und Deep Link
  (`p`) nehmen ihn mit, der Prüfer verwirft Werte außerhalb. Himmelsszenen im Kino zeichnen mit 1×.

### 11.5 Linke Spalte

- **Ergänzung (Jens, 30.09.2026):** Steuerelemente ohne Wirkung werden in der Himmelsansicht
  ausgeblendet, nicht ausgegraut. Das Panel wechselt seinen Inhalt, wie das Kamerapanel heute schon
  den Abstandsregler gegen den Bildwinkel tauscht. Ausgegraute Regler laden zum Klicken ein und
  bleiben für Tastatur und Screenreader im Weg.
- **Maßstab:** Voreinstellungen und die Regler Körpergröße, Abstände und Sonnengröße verschwinden.
  Das Panel zeigt nur den Hinweis, warum der Maßstab realistisch ist, und den Regler „Scheiben
  vergrößern“ (§11.4). Beim Verlassen erscheinen die Regler mit dem unveränderten `state.scale`.
- **Darstellung:** Das Kästchen „Markierungen“ schaltet in der Himmelsansicht die Lichtpunkte (§11.2)
  und bleibt deshalb sichtbar. Die übrigen Kästchen und Regler wirken auch im Himmel (Bahnlinien über
  die Mondbahn, Beleuchtungsregler auf die Mondscheibe und vergrößerte Scheiben).
- Der Plan prüft jedes Steuerelement der linken Spalte am Code auf seine Wirkung in der Himmelsansicht.
  Was dort nichts bewirkt, wird ausgeblendet; die Liste steht im Plan und im Abnahmeprotokoll.

### 11.6 Auswirkung auf jensfricke.com

Keine. Nur ein zusätzliches Feld in bestehenden Speicherschlüsseln; keine fremden Server, keine neuen
Browserfunktionen.

### 11.7 Zuschnitt

Auf dem Branch `geozentrisch`, jeder Task mit eigenem Commit und grünen Tests:

1. store und Oberfläche: `camera.geo.lupe`, `dargestellterMassstab`, Persistenz, Deep Link, Prüfer,
   Regler und Hinweis (DE/EN), linke Spalte ohne wirkungslose Steuerelemente (§11.5)
2. Mondbahn in der Himmelsansicht samt Klick
3. sim: scheinbare Helligkeit
4. render: Lichtpunktschicht, Glyphen aus, Klickflächen
5. Sonne und Mond (Blendschein, Farbton, Belichtung) mit Pixelmessung
6. Nachtrag im Abnahmeprotokoll, danach Handprüfung durch Jens
