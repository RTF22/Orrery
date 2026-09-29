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
| Tests | 5667 | 5800 (146 Dateien) |
| Hauptchunk | 1 569,20 kB | 1 579,86 kB (+10,66 kB) |

Beide Werte aus frischen Durchläufen auf dem Branch: `npm run lint` ohne Meldung,
`npx tsc -b --noEmit` Ausgang 0, `npm test` (146 Dateien, 5800 Tests, alle grün),
`npm run build` (`tsc -b && vite build`, Hauptchunk `dist/assets/index-*.js`, gzip 436,95 kB). Der
Wert für `master` stammt aus dem Stand vor der Etappe (Aufgabenstellung). Die Frageschwelle für den
Hauptchunk (ab 1 571,79 kB, Abnahme Phase 5) ist damit überschritten; der Zuwachs von 10,66 kB ist
der Code der Himmelsansicht samt Szenentexten (Katalog im Hauptbundle). Siehe §8 Frage 4.

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
| Desktop, Tastatur: Pfeile/WASD schwenken, Q/E zoomen; Steuerkarte (`?`) zeigt zwei neue Zeilen | offen |
| Desktop: Spuren, Ekliptik, Äquator lassen sich im Darstellungspanel schalten; Maßstabsregler sind im Himmelsmodus gesperrt und danach wieder frei | offen |
| Desktop: Kino, Szene 20 „Marsschleife“: Zeitsprung zur Opposition, Schleife im Bild, Text in drei Stufen | offen |
| Desktop: Teilen-Knopf im Himmelsmodus erzeugt `view=geo&body=…`; Link in neuem Tab öffnet den Blick | offen |
| Desktop, Controller (falls zur Hand): Stick schwenkt, Trigger zoomen, A richtet den Blick aus | offen |
| A55 hoch und quer: Ziehen mit einem Finger schwenkt, Zwei-Finger-Pinch zoomt den Bildwinkel | offen |
| A55: keine Taste G, der Knopf „Von der Erde“ im Kamera-Panel schaltet ein und aus; Teilen öffnet den Teilen-Dialog | offen |
| A55 hoch: Szene Marsschleife im Kino, die Schleife wird waagerecht abgeschnitten (§7) | offen |

## 6. Rulings

Aus der Planung (Plan, Abschnitt Rulings):

1. **Maßstab überlagert statt überschrieben:** kein gemerkter Maßstab in Sitzung und Ansicht; jeder Ausstieg
   zeigt den eigenen Maßstab von selbst; Wächtertest `render/massstab.test.ts`.
2. **Dateinamen** `store/himmelsansicht.ts`, `render/camera/himmelsblick.ts`, `render/himmelslinien.ts`,
   `ui/himmelsmodus.ts`: „Himmel“ statt „geo“, damit sie nicht mit dem Himmelshintergrund
   (`render/milchstrasse.ts`, `HIMMEL_RADIUS`) verwechselt werden.
3. **Bahnlinien aus** in der Himmelsansicht.
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

## 7. Unschärfen

**Darstellung**

- **Hochformat:** Die Szene Marsschleife ist auf 30° senkrecht eingestellt. Bei 9:16 ergibt das nur rund 17°
  waagerecht; die Schleife (19,5° breit) wird dort an den Seiten abgeschnitten. Gemessen ist das nur im
  Querformat 2560×1440 (Spannweite 898 px von 2560); die Handprüfung am A55 hochkant klärt, ob es stört (Ruling 5).
- **Blende des Zeitraffers:** Die 2-s-Blende verschiebt die Szenenmitte in den ersten Sekunden um bis zu 6,3°
  und die Opposition um bis zu 17 Tage (Ruling 16). Das wirkt als kurzes Nachziehen des Blicks zu Beginn.
- **Planetenpunkte ohne Magnitude:** Planeten und Monde erscheinen als Scheibe oder kleiner Punkt nach wahrer
  Größe und Beleuchtung, nicht mit scheinbarer Helligkeit (Größenklasse); ein ferner Planet ist im
  Weitwinkel kaum sichtbar, wird aber von seiner Spur und seinem Namen markiert.
- **Galileische Monde im Fernrohr:** Bei 1° Bildwinkel sind Europa, Ganymed und Kallisto kleiner als 1 px und
  ohne Markierung, weil Mondnamen erst ab 8 px Radius erscheinen (§5.4). Nur Io fällt als heller Punkt auf.
- **Spur in Tagesschritten:** Die Anzeige verbindet Tagespunkte; kurze Kurvenstücke am Stillstand
  erscheinen leicht eckig (Fachprüfung Befund 7).
- **Entwicklungsserver:** Die React-Meldungen beim Neuladen (§5.8) stammen aus dem Entwicklungslauf und der
  Messung per `import()`; nicht mit `master` verglichen.

**Kleinigkeiten aus den Prüfungen der einzelnen Schritte (zurückgestellt, alle „kann bleiben“)**

- Gesperrte Maßstabsknöpfe haben kein eigenes `disabled:`-Styling; der Hover-Effekt bleibt sichtbar.
- Ein laufender Voreinstellungs-Tween schreibt unter der Sperre bis 700 ms weiter (harmlos).
- Taste G hat keine Wiederholungssperre (`e.repeat`), gilt für alle Umschalter; Halten der Taste schaltet flackernd.
- `himmel()` in `controller.ts` setzt den Übergang beim Eintritt nicht zurück; Schwelle 10⁶ km beim Ausstieg
  ist grob.
- Die Spurpositionen werden je Bild auch bei angehaltener Zeit neu geschrieben.
- Für `himmelStarten` mit Ziel Sonne oder unbekannter Kennung fehlt ein Test; `view=geo&body` gleich dem Ziel aus
  `p` ebenso; kein `tickCinema`-Test für die Oppositionsszene.
- Testschärfe: Test `OPPOSITION_SUCHE_TAGE` prüft nur die Konstante; Schwelle 40,9 gegen 81 in `scenes.test.ts`;
  der Wächter im Maßstabstest erkennt nur den Wortlaut, nicht eine Destrukturierung.
- Kommentare: „siehe Plan, Messwerte“ in `geozentrisch.test.ts` (Prozesssprache), „null bei der
  Längenopposition“ missverständlich, Umbrüche in `flug.ts` und im Szenenkommentar.
- Controller-Grafik der Steuerkarte zeigt die Himmelsbelegung nicht (Ruling 9); sie steht nur in der Tastaturliste.

## 8. Fragen an Jens

1. **Galileische Monde im Fernrohr:** Soll die Szene oder der Himmelsmodus die Monde bei kleinem Bildwinkel
   markieren (Punkt statt Namen ab etwa 1 px)? Heute erscheinen nur Planeten mit Namen; die Planung
   erwartete Markierungen. Bedarf Code (Beschriftungsregel in `render/labels.ts`).
2. **Blende der Szene:** Reicht die Blende (Ruling 16), oder soll die Rate für Himmelsszenen ohne Blende
   laufen? Kleine Codeänderung.
3. **Hochformat:** Soll die Szene im Hochformat den Bildwinkel vergrößern (z. B. 40° senkrecht)? Handprüfung
   am A55 abwarten.
4. **Hauptchunk:** Der Chunk liegt mit 1 579,86 kB über der Frageschwelle 1 571,79 kB (Phase 5); soll er geteilt
   werden (Katalog nachladen) oder bleibt es so?
5. **Abschluss:** Tag `v0.8.0`? Fast-Forward `geozentrisch` nach `master`, Branch löschen? Push (vorher Diff auf
   Zugangsdaten prüfen)? Deploy startet Jens selbst.

**Auswirkung auf jensfricke.com:** keine. Es entstehen keine neuen Speicherschlüssel (nur zusätzliche Felder in
`orrery.sitzung.v1` und `orrery.ansichten.v1`), keine Anfragen an fremde Server, keine neuen
Browserfunktionen oder Berechtigungen, keine Änderung an Einbettung, Domain oder `.htaccess`. Die
Datenschutzerklärung bleibt richtig.
