# Klickflächen: Körper und Bahnen im Bild anspringen, Fahrt heftet an

Entwurf vom 15.09.2026. Dritter von drei Punkten, die Jens am 15.09.2026 vor die
Etappe 4c-4 gezogen hat (a Mondbahn, b Objektbaum, c Klickflächen). Der
Gesamtentwurf (`2026-09-11-sonnensystem-design.md`, §5 „Marker-Glyphen") sah
Ersatzglyphen schon als „auffindbar und anklickbar" vor; umgesetzt wurde das nie.

Ziel: Ein Klick oder Tipp auf einen Körper, seine Beschriftung oder seine Bahn fährt
die Kamera dorthin, genau wie ein Klick im Objektbaum. Jede Kamerafahrt endet im
Modus „Geheftet", damit der Körper dort bleibt, wo die Kamera ankommt.

## 1. Ausgangslage

- **Eingabe** (`render/camera/input.ts`): Pointer-Ereignisse auf der Canvas decken
  Maus, Stift und Finger ab. Ziehen dreht ab dem ersten Pixel, Rad und zwei Finger
  zoomen. Einen Klick erkennt die Eingabe nicht. Eine Testdatei gibt es nicht.
- **Kamerafahrt** (`ui/kamerafahrt.ts`): `fahreZu(id)` wird vom Objektbaum und von
  den Textverweisen (`ui/info/verweisAusfuehren.ts`) gerufen. Die Funktion setzt
  `targetId`, im freien Modus zusätzlich `freezeJd = time.jd`, und gleitet 1,5 s
  logarithmisch im Abstand. `fahreZuSystem()` dient der Wurzel „Sonnensystem"
  (Ziel Sonne, Draufsicht). `pointerdown`, `wheel` und `keydown` brechen eine Fahrt
  ab. Das Kino wird nur beendet, wenn `cinema.running` gilt.
- **Beschriftungen und Ersatzglyphen** (`render/labels.ts`) liegen als HTML in
  `.label-overlay` mit `pointer-events: none` über der Canvas und werden je Bild
  projiziert. Die Glyphe erscheint unter 3 px projiziertem Radius
  (`MARKER_MIN_PIXEL`), Mondnamen ab 8 px (`LABEL_MIN_PIXEL_MOND`).
- **Bahnlinien** (`render/orbits.ts`) sind `THREE.Line` mit 513 kamerarelativen
  Punkten, die je Bild neu geschrieben werden, Deckkraft 0,45.
- **Kamera-Controller** (`render/camera/controller.ts`): Frei und Geheftet teilen
  sich die Kugelkoordinaten. Frei ankert an der Körperposition zum Zeitpunkt
  `freezeJd`, Geheftet am mitlaufenden Körper. Ein Wechsel von Modus, Ziel oder
  `freezeJd` erzeugt einen Restversatz, der gedämpft abklingt.
- **Kino** (`ui/cinemaControl.ts`): Jede Eingabe hält einen laufenden Film über
  `noteUserInput` an (`running: false`, der Modus bleibt `cinema`); nach
  `idleResumeSec` läuft er wieder an. `cinemaAktiv()` gilt für laufend und
  angehalten.

Drei Befunde im heutigen Verhalten:

1. **Die Fahrt zielt auf eine alte Stelle.** Im freien Modus fährt die Kamera zur
   eingefrorenen Position. Bei laufender Uhr zieht der Körper schon während der
   Fahrt davon (Jens, 15.09.2026: „Das versteht kein Kind und Erwachsene sind
   verwirrt.").
2. **Ein Klick während des Kinos wirkt nicht.** `pointerdown` hält den Film an,
   bevor `click` ankommt. `fahreZu` sieht dann `running: false` und beendet das Kino
   nicht; im Modus `cinema` wirkt das neue Ziel nicht, und nach der Ruhefrist läuft
   der Film wieder an. Das betrifft heute schon den Objektbaum. Befund aus dem Code;
   die Tests decken nur das laufende Kino ab. Der Browserbeleg folgt vor dem Fix
   (§9).
3. **Das Overlay projiziert mit der Blickmatrix des vorigen Bildes.**
   `camera.lookAt` setzt nur die Quaternion (three `Object3D.js:724`),
   `matrixWorldInverse` erneuert erst der Renderer (`WebGLRenderer.js:1667`).
   `projectToScreen` in `render/labels.ts` rechnet aber vorher in `scene.update` mit
   `Vector3.project`, also mit `matrixWorldInverse` (`Vector3.js:501`). Beim Drehen
   hinken die Beschriftungen um ein Bild nach; Treffer täten es ebenso.

## 2. Entscheidungen (Jens, 15.09.2026)

1. **Klickwirkung wie im Objektbaum.** Ein einfacher Klick startet `fahreZu`, das
   Infopanel folgt dem Kameraziel. Kein Doppelklick, keine Auswahl ohne Fahrt.
2. **Hover:** Hand-Zeiger, Name am Körper (auch unter der Mondschwelle), Bahnlinie
   des Körpers kräftiger.
3. **Kino:** Ein Klick auf einen Körper beendet den Film, ob laufend oder angehalten,
   und fährt hin.
4. **Treffer:** Kugel, Ersatzglyphe, sichtbare Beschriftung, sichtbare Bahnlinie.
   Ausgeblendete Körper und abgeschaltete Bahnen sind keine Klickflächen.
5. **Ansatz:** Trefferprüfung in Bildschirmpixeln in TypeScript (§3.1).
6. **Touch wirkt wie ein Klick.** Tippen fährt hin; einen Hover gibt es auf Touch
   nicht.
7. **Jede Kamerafahrt endet geheftet.** `fahreZu` und `fahreZuSystem` setzen
   `mode: 'attached'` und `freezeJd: null`, aus jedem Modus (Frei, Verfolgung,
   Kino). Wer danach „Frei" will, schaltet im Kamera-Panel um.

## 3. Aufbau

### 3.1 Ansatz

Verglichen wurden drei Wege:

- **A, gewählt: Trefferprüfung in Bildschirmpixeln.** Eine reine Funktion bekommt
  die Zeigerposition und projizierte Kandidaten und liefert eine Körperkennung. Die
  Körper projiziert das Overlay je Bild ohnehin, die Bahnpunkte liegen kamerarelativ
  im Puffer. Ein Fangradius in Pixeln gilt bei jedem Zoom gleich, über acht
  Größenordnungen des Abstands hinweg. Ohne WebGL testbar.
- **B, verworfen: Raycaster von Three.js.** Winzige Monde bräuchten unsichtbare
  Ersatzkugeln mit abstandsabhängiger Größe, der Linien-Schwellwert steht in
  Welteinheiten und müsste je Bahn umgerechnet werden. HTML-Beschriftungen deckt er
  nicht ab.
- **C, verworfen: GPU-Picking.** Ein zweiter Render-Durchgang neben Bloom und
  Postfx, dicke Ersatzlinien für 1-px-Bahnen, Beschriftungen fehlen ebenfalls.
  Für 35 Körper und 34 Bahnen unverhältnismäßig.

### 3.2 Bausteine

| Baustein | Schicht | Aufgabe |
|---|---|---|
| `render/treffer.ts` (neu) | render | Reine Trefferfunktion `findeTreffer`, Projektion der Bahnpunkte, Konstanten für Fangradius und Tippschwelle |
| `render/labels.ts` | render | Stellt die Rechtecke gezeigter Namen bereit, setzt den hervorgehobenen Körper zuerst und zeigt dessen Namen immer |
| `render/orbits.ts` | render | Hebt die Bahn des hervorgehobenen Körpers hervor |
| `render/scene.ts` | render | Erneuert nach der Kamera die Blickmatrix, hält die Zeigerposition, prüft je Bild den Treffer, liefert `trefferBei` für den Klick |
| `render/camera/input.ts` | render | Unterscheidet Tippen von Ziehen und Gesten, meldet Tippen und Hover über Rückrufe |
| `app/main.tsx` | app | Verdrahtet Rückrufe, Szene, `fahreZu` und den Mauszeiger |
| `ui/kamerafahrt.ts` | ui | Fahrt heftet an; Kino über `cinemaAktiv()` beenden |

Die Schichtenregel bleibt gewahrt: `render/` kennt `ui/` nicht; nur `app/` verbindet
beide. Der Hover-Zustand kommt nicht in den Store. Er ist flüchtig und gehört weder
in den Link noch in Sitzung oder Ansichten.

### 3.3 Datenfluss

**Hover** (nur Maus und Stift, keine Taste gedrückt):

1. `pointermove` auf der Canvas ohne gedrückte Taste → Rückruf `onZeiger(x, y, art)`.
   `onZeiger(null)` melden bei Maus und Stift erst ein Druck, der zum Ziehen wird, ein
   zweiter Zeiger, `pointercancel` und `pointerleave`; ein Druck allein lässt die
   Hervorhebung stehen, damit ein nur durch Hover gezeigter Name bis zum `pointerup`
   treffbar bleibt. Bei Berührung meldet schon `pointerdown` null.
2. `app/main.tsx` reicht das an `szene.setZeiger` weiter. Solange der Mauszeiger
   wegen Untätigkeit ausgeblendet ist (§7), setzt es den Zeiger je Bild auf `null`.

   *Nachtrag nach der Schlussprüfung (15.09.2026):* Ursprünglich meldete jedes
   `pointerdown` null; ein Klick auf einen nur durch Hover sichtbaren Namen traf dann
   nichts oder den Planeten, dessen Name zurückkehrte. Ohne den Ruhezustand hoben im
   Kino Bahnen und Monde unter dem unsichtbaren Zeiger sich hervor.
3. Die Szene prüft in jedem `update` nach dem Projizieren den Treffer (die Körper
   ziehen bei laufender Uhr unter einem ruhenden Zeiger weg), gibt den Treffer an
   Overlay und Bahnen und stellt ihn über `szene.hervorgehoben()` bereit.
4. `app/main.tsx` setzt nach jedem Bild `canvas.style.cursor` auf `pointer` oder
   zurück.

**Klick oder Tipp:**

1. `pointerdown` bricht wie heute eine laufende Fahrt ab und hält ein laufendes Kino
   an.
2. `pointerup` ohne Geste (§5) → Rückruf `onTipp(x, y, art)`.
3. `app/main.tsx` fragt `szene.trefferBei(x, y, art)` und ruft bei einem Treffer
   `fahreZu(id)`.

`trefferBei` prüft gegen die Kandidaten des zuletzt berechneten Bildes. Die Schleife
rechnet `update` und zeichnet danach im selben Durchlauf; die Kandidaten gehören also
zu dem Bild, das gerade zu sehen ist.

## 4. Treffer

### 4.1 Koordinaten, Blickmatrix, Zeigerart

- Alle Rechnungen laufen in CSS-Pixeln relativ zur Canvas: `clientX/Y` minus
  `getBoundingClientRect()` der Canvas. Das Overlay rechnet heute schon so
  (`clientWidth/Height`).
- `scene.update` ruft direkt nach `kamera.update` einmal
  `ctx.camera.updateMatrixWorld()`. Overlay, Treffer und gezeichnetes Bild nutzen
  damit dieselbe Blickmatrix (Befund 3).
- Zeigerart `'maus' | 'finger'`: `pointerType === 'touch'` ist Finger, Maus und Stift
  zählen als Maus.

| Konstante in `render/treffer.ts` | Maus | Finger |
|---|---|---|
| Fangradius | 8 px | 20 px |
| Tippschwelle (Bewegung, ab der gezogen wird) | 4 px | 10 px |

### 4.2 Kandidaten und Rangfolge

`findeTreffer(zeiger, kandidaten, fangPx): string | null` bekommt drei Listen:

- **Scheiben:** Kennung, Mittelpunkt, Pixelradius, Tiefe (NDC-z), Mond ja/nein,
  Glyphe ja/nein (§4.3).
- **Namen:** Kennung und Rechteck jeder gerade gezeigten Beschriftung.
- **Bahnen:** Kennung und Polylinie in Bildschirmkoordinaten, Segmente hinter der
  Kamera schon entfernt (§4.4).

Der erste zutreffende Rang entscheidet:

1. Der Zeiger liegt auf einer Scheibe, zweistufig:
   1. auf einer echten Scheibe → die vorderste echte (kleinste Tiefe);
   2. sonst auf einer oder mehreren Glyphenscheiben → die mit der nächsten Mitte; bei
      gleichem Abstand (auf 0,5 px) Sonne, Planet und Zwergplanet vor Mond, dann die
      vordere (dieselbe Regel wie Rang 3).
2. Der Zeiger liegt in einem Namensrechteck → dieser Körper. Gezeigte Namen
   überlappen sich nie (Kollisionsauflösung im Overlay), das Rechteck ist eindeutig.
3. Eine Scheibenmitte liegt im Fangradius um den Zeiger → die nächste; bei gleichem
   Abstand (auf 0,5 px) Sonne, Planet und Zwergplanet vor Mond, dann die vordere.
4. Eine Bahnlinie liegt im Fangradius → die mit dem kleinsten Abstand zu einem ihrer
   Segmente (Lotfußpunkt auf das Segment geklemmt).
5. Sonst `null`.

Ein Planet schlägt so seine Monde, solange der Zeiger auf ihm liegt, und winzige
Mondbahnen um einen Planeten stören den Klick auf den Planeten nicht. Die Tiefe
entscheidet nur zwischen echten Scheiben: Io vor der sichtbaren Jupiterscheibe bleibt
Io, eine Mondglyphe über einer echten Planetenscheibe verliert gegen den Planeten.
Ringe und Gürtel sind keine Kandidaten.

*Nachtrag nach der Schlussprüfung (15.09.2026):* Rang 1 nahm ursprünglich die
vorderste aller Scheiben. In der Systemansicht sind Mars und Deimos beide Glyphen mit
3 px Radius und Mitten unter 1 px auseinander; stand Deimos vorn, traf der Klick auf
die Marsmitte Deimos (Abnahme §9.4). Mit der zweistufigen Regel trifft die Marsmitte
Mars und die Deimosmitte Deimos, sobald sie mehr als 0,5 px auseinanderliegen.

### 4.3 Scheiben und Namen

- **Scheibe:** Mittelpunkt und Radius stammen aus den `LabelEintrag`-Daten, die die
  Szene je Bild baut und projiziert. Zeigt der Körper eine Ersatzglyphe, gilt als
  Radius mindestens `MARKER_MIN_PIXEL`, und die Scheibe trägt `glyphe: true` (genau
  dann, wenn der Radius angehoben wurde; sonst `false`). Unsichtbare Körper
  (`sichtbar: false`) und Punkte hinter der Kamera fallen weg.
- **Name:** Das Overlay kennt die Bildposition jeder gezeigten Beschriftung. Lage und
  Größe des Namensfelds relativ zum Ankerpunkt misst es mit
  `getBoundingClientRect()` genau dann, wenn sich Text, Glyphenzustand oder
  Hervorhebung eines Eintrags ändern oder die Sprache wechselt, und legt das Ergebnis
  ab. Je Bild
  entsteht das Rechteck aus Ankerpunkt plus abgelegtem Versatz, ohne erzwungenes
  Layout. Eine neue Methode `LabelOverlay.namensRechtecke()` liefert die Rechtecke des
  letzten `update`.

### 4.4 Bahnen

- Geprüft wird die gezeichnete Polylinie selbst: alle 513 Punkte aus dem
  Positionspuffer der Linie. Ausdünnen fällt weg. Nah an einem Planeten hat seine
  Bahn im Bild Radien um 10⁵ px; bei jedem vierten Punkt wiche die Sehne dort rund
  30 px von der gezeichneten Linie ab, bei 512 Segmenten unter 2 px.
- Die Projektion rechnet mit dem Produkt aus `projectionMatrix` und
  `matrixWorldInverse` direkt auf den Zahlen, ohne `Vector3` je Punkt. Ein
  Zwillingstest vergleicht sie mit `Vector3.project`.
- Segmente mit einem Endpunkt bei w ≤ 0 (hinter der Kamera) werden übersprungen.
- Bahnen ausgeblendeter Körper und alle Bahnen bei `display.orbits: false` sind keine
  Kandidaten.
- `OrbitLines` stellt die Linien bereits als `lines` bereit; die Szene liest daraus
  Sichtbarkeit und Puffer.

### 4.5 Wann gerechnet wird, Kosten

- Nur mit Mauszeiger über der Canvas prüft die Szene je Bild; ohne Zeiger rechnet
  sie nichts zusätzlich. `trefferBei` rechnet einmal je Klick.
- Aufwand je Bild: 34 Bahnen × 513 Punkte ≈ 17 500 Projektionen samt Segmentabstand
  und 35 Scheiben.
- Messung im Plan, wie beim Bahnumbau: Rechenzeit von Projektion und `findeTreffer`
  in Node; im Browser Bildabstände über `performance.now()` bei 365 d/s mit ruhendem
  Zeiger über der Canvas gegen Zeiger außerhalb. Kriterium: mittlerer Bildabstand
  höchstens 1 ms schlechter, kein Bildabstand über 25 ms.

## 5. Eingabe: Tippen, Ziehen, Hover

`attachCameraInput(element, rueckrufe?)` bekommt optionale Rückrufe
`{ onTipp(x, y, art), onZeiger(x, y, art) | onZeiger(null) }`. Ohne Rückrufe verhält
sich die Eingabe wie heute, bis auf die Totzone.

- **Totzone:** Ein gedrückter Zeiger dreht erst, wenn er sich weiter als die
  Tippschwelle (§4.1) vom Startpunkt entfernt hat. Dann wird die ganze Strecke seit
  dem Start auf einmal nachgeholt, danach dreht er wie heute Bild für Bild. Beim
  Tippen zuckt die Kamera so nicht, beim Ziehen springt sie nicht.
- **Tippen:** `pointerup` meldet `onTipp`, wenn
  - der Zeiger die Tippschwelle nie überschritten hat,
  - während des Drucks kein zweiter Zeiger dazukam (Zoomen mit zwei Fingern),
  - bei der Maus die Haupttaste gedrückt war (`button === 0`).
  
  Eine Zeitgrenze gibt es nicht. `pointercancel` meldet nichts. Ausgewertet wird
  `pointerup`, nicht `click`; der zusätzliche Klick des Browsers nach einer Berührung
  zählt daher nicht doppelt.
- **Hover:** `pointermove` ohne gedrückten Zeiger auf der Canvas, ohne gedrückte
  Taste (`buttons === 0`, auch nicht außerhalb gedrückt, etwa an einem Regler) und
  nicht bei Berührung meldet `onZeiger(x, y, art)`. Bei Maus und Stift bleibt die
  Hervorhebung während eines Drucks stehen; `onZeiger(null)` melden das Überschreiten
  der Tippschwelle, ein zweiter Zeiger, `pointercancel` und `pointerleave`. Bei
  Berührung meldet `pointerdown` null. Während des Ziehens gibt es keine
  Hervorhebung. Wechselt der Zeiger auf ein Panel oder die Kopfzeile, verlässt er die
  Canvas und die Hervorhebung erlischt.

  *Nachtrag nach der Schlussprüfung (15.09.2026):* Vorher meldeten jedes
  `pointerdown` null und jedes `pointermove` ohne eigenen Druck Hover, auch mit einer
  außerhalb gedrückten Taste.
- Das Rad und die Zwei-Finger-Geste bleiben unverändert.

## 6. Kamerafahrt heftet an, Kino

- `fahre` in `ui/kamerafahrt.ts` setzt Ziel, `mode: 'attached'` und `freezeJd: null`,
  aus jedem Modus. Das gilt für `fahreZu` (Klick im Bild, Objektbaum, Textverweise)
  und für `fahreZuSystem` (Wurzel „Sonnensystem"). Die Sonne ruht im Ursprung, dort
  ist Geheftet optisch gleich Frei. Aus „Verfolgung" heraus lief die Draufsicht
  bisher falsch: Die Sonne hat keine Bahngeschwindigkeit, der Blick hob sich nur um
  ein Viertel des Abstands.
- Der Controller erzeugt beim Wechsel wie bisher einen Restversatz, der gedämpft
  abklingt. Der Anker ist jetzt der mitlaufende Körper; der Blick endet auf ihm,
  nicht auf seiner alten Stelle. Die Dämpfung ist kritisch mit Zeitkonstante 0,45 s
  (`render/camera/damping.ts`), der Restversatz fällt wie (1 + ωt)·e^(−ωt) mit
  ω ≈ 4,4/s. Bei einer Fahrt von der Sonne zur Erde (Versatz anfangs 1 AE,
  Endabstand rund 2,5·10⁶ km) steht die Erde nach 1,5 s noch deutlich neben der
  Bildmitte, nach 2,5 s rund 17 px und nach 3 s rund 2 px daneben. Sie bleibt dabei
  im Bild und läuft auf die Mitte zu. Ein Angleichen von Dämpfung und Fahrtdauer
  gehört nicht zu diesem Entwurf.
- Das Kino wird beendet, wenn `cinemaAktiv()` gilt, also auch im angehaltenen Zustand
  (Befund 2). `stopCinema` stellt zuerst die Kamera von vor dem Kino her; danach setzt
  die Fahrt Ziel und Modus. Die Ruhefrist startet den Film nicht wieder, weil
  `stopCinema` die gemerkte Pause löscht.
- „Frei" bleibt über das Kamera-Panel erreichbar und friert wie bisher den aktuellen
  Zeitpunkt ein (`CameraPanel.tsx`).
- Ein Klick auf das aktuelle Ziel fährt erneut an und setzt den Abstand zurück. Ein
  Klick ins Leere tut nichts.
- Der Kommentar zu `freezeJd` in `fahre` und der Absatz im Controller, der das
  Einfrieren dem Objektbaum zuschreibt, werden nachgezogen.

## 7. Hervorhebung

- **Name:** `LabelOverlay.update` bekommt die Kennung des hervorgehobenen Körpers.
  Dieser wird bei der Platzierung zuerst gesetzt und zeigt seinen Namen immer, auch
  unter der Mondschwelle und auch bei `display.labels: false`. Er trägt die Klasse
  `hervorgehoben` (kräftigere Schrift, in `index.css`).
- **Bahn:** `OrbitLines.update` bekommt dieselbe Kennung; deren Linie erhält die
  Deckkraft 0,9 statt 0,45. Die Farbe bleibt.
- **Mauszeiger:** `app/main.tsx` setzt nach jedem Bild `canvas.style.cursor` auf
  `pointer`, solange `szene.hervorgehoben()` eine Kennung liefert, sonst auf den
  Standard. `.zeiger-aus` (Ruhezustand nach `IDLE_HIDE_SEC` ohne Eingabe, in jedem
  Modus) bleibt mit `!important` vorrangig.
- **Ruhezustand:** Solange der Mauszeiger ausgeblendet ist (`.zeiger-aus`), ruht die
  Hervorhebung: `app/main.tsx` fragt je Bild `zeigerAusgeblendet()` aus `ui/idle.ts`
  ab und setzt den Zeiger der Szene auf `null`. Die Abfrage folgt dem Ruhewächter
  synchron, nicht der Klasse, die Reacts Effekt erst später entfernt; so löscht das
  Bild direkt nach der Weckbewegung den neu gemeldeten Zeiger nicht wieder.
  *Nachtrag nach der Schlussprüfung (15.09.2026):* Vorher hoben im Kino mit geparkter
  Maus vorbeiziehende Bahnen und Monde sich unter dem unsichtbaren Zeiger hervor.
- Auf Touch-Geräten gibt es keinen Hover und damit keine Hervorhebung.
- Neue Texte für die Oberfläche entstehen nicht; `ui/i18n` bleibt unverändert.

## 8. Tests

| Datei | Prüft |
|---|---|
| `ui/kamerafahrt.test.ts` | Fahrt setzt `attached` und `freezeJd: null` aus Frei, Verfolgung und Kino, auch `fahreZuSystem`; angehaltenes Kino (`running: false`, Modus `cinema`) wird beendet. Die bisherigen Erwartungen `freezeJd = time.jd` und `mode: 'free'` werden umgestellt. Der Kinofall wird zuerst rot geschrieben. |
| `ui/panels/BodyTree.test.tsx` | Klick auf eine Körperzeile heftet an; die Erwartung zum Einfrieren im freien Modus entfällt. |
| `render/treffer.test.ts` (neu) | Rangfolge Scheibe → Name → Mitte im Fangradius → Bahn; vorderste echte Scheibe; Glyphenscheiben nach nächster Mitte (Mars/Deimos), Glyphe über echter Planetenscheibe trifft den Planeten; Gleichstand Planet vor Mond; Fangradius Maus und Finger an der Grenze; Segmentabstand mit Lotfußpunkt innerhalb und außerhalb; Segmente mit w ≤ 0 übersprungen; leere Kandidaten ergeben `null`; Bahnprojektion als Zwilling von `Vector3.project`. |
| `render/labels.test.ts` | Hervorgehobener Mond unter der Schwelle zeigt seinen Namen, auch bei `labels: false`, und gewinnt die Kollision; `namensRechtecke` nur für gezeigte Namen; Messung verfällt bei Sprachwechsel und Glyphenwechsel; `glyphe` genau bei angehobenem Radius. |
| `render/orbits.test.ts` | Deckkraft 0,9 für die hervorgehobene Bahn, 0,45 für alle anderen. |
| `render/camera/input.test.ts` (neu) | Tippen unter der Schwelle: genau ein `onTipp`, keine Drehung; über der Schwelle: Drehung mit nachgeholter Strecke, kein `onTipp`; zweiter Zeiger verhindert das Tippen; rechte Maustaste tippt nicht; `pointercancel` tippt nicht; Hover nur ohne Druck, ohne gedrückte Taste und nicht bei Berührung; Maus- und Stiftdruck ohne Bewegung melden kein `null`, Ziehen über die Schwelle, zweiter Zeiger, `pointercancel` und `pointerleave` melden `null`, Berührung schon beim Druck; ohne Rückrufe keine Fehler. |
| `ui/idle.test.ts` | `zeigerAusgeblendet()` gilt ab der Ruhezeit und endet mit der Weckeingabe, bevor die Klasse `zeiger-aus` fällt. |
| `render/scene.test.ts` | `updateMatrixWorld` nach der Kamera (Blickmatrix passt im selben `update`); `setZeiger` reicht die Treffer-Kennung an Overlay und Bahnen; ohne Zeiger wird `null` gereicht; `trefferBei` liefert die Kennung aus den Kandidaten des letzten Bildes. |

Die Schichtentests (`render/schichten.test.ts`, `store/schichten.test.ts`) laufen
unverändert mit: `render/treffer.ts` importiert weder `ui/` noch `store/`.

## 9. Abnahme (Sichtprüfung)

Playwright am Prüfrechner, Pixelwerte statt Eindrücke. Direkt nach jedem Navigate
`quality.tier: 'high'`, Uhr angehalten (`setCinema({ running: false })` und
`setTime({ paused: true })`), `pauseOnInput: false`, Differenzbilder in derselben
Ladung mit `setUi({ hidden: true })`.

1. **Vorher-Belege** (vor Task 1, auf master): (a) Erde aus der Systemansicht bei
   365 d/s im freien Modus über den Objektbaum anfahren, Abstand des Erdmittelpunkts
   zur Bildmitte nach der Fahrt in Pixeln messen; (b) Kino starten, per
   `pointerdown` anhalten, Körper im Objektbaum anklicken, danach Modus und
   Wiederanlauf nach `idleResumeSec` + 1 s festhalten.
2. **Fahrt heftet an:** wie 1a nach dem Fix; der Erdmittelpunkt steht 3 s nach
   Fahrtbeginn höchstens 3 px neben der Bildmitte (Werte bei 1,5 s und 2 s werden
   mitgeschrieben, §6), das Kamera-Panel zeigt „Geheftet".
3. **Hover:** Differenzbild Zeiger über einem Körper gegen Zeiger im Leeren; die
   abweichenden Pixel liegen nur auf seiner Bahnlinie und an seinem Namen.
   Kontrollbild zweimal Zeiger im Leeren mit 0 abweichenden Pixeln. Mauszeiger
   `pointer` über dem Körper, Standard im Leeren.
4. **Klick-Rundgang:** Für jeden sichtbaren Körper an seine projizierte Position
   klicken und `camera.targetId` prüfen. Trefferquote und Fehlzuordnungen stehen im
   Protokoll; von ihrem Planeten verdeckte Monde zählen getrennt.
5. **Bahnklick:** Ein Punkt auf der Neptunbahn weit vom Planeten entfernt führt zu
   `neptune`, derselbe Punkt 30 px senkrecht daneben zu keinem Ziel.
6. **Tippen:** Mit Touch-Emulation (`hasTouch`, `touchscreen.tap`) wirkt ein Tipp wie
   der Klick. Ein Druck mit 6 px Bewegung bleibt unter der Fingerschwelle und ändert
   den Azimut nicht; auf einem Körper ist er ein Tipp und fährt hin, auf leerer Fläche
   geschieht nichts. *Nachtrag nach der Schlussprüfung (15.09.2026):* Früher hieß es
   hier „fährt nicht"; das widersprach §5, wonach ein Druck unter der Schwelle ein
   Tipp ist.
7. **Kino:** Wie 1b und zusätzlich per Klick im Bild; der Film endet, die Kamera fährt
   hin und ist geheftet, nach `idleResumeSec` + 1 s läuft kein Film.
8. **Kosten:** §4.5 im Browser bei 365 d/s, dazu die Node-Messung.

Protokoll: `docs/klickflaechen-abnahme.md`.

## 10. Tasks

Eine Etappe, jeder Task mit eigenem Commit und grünen Tests:

1. Fahrt heftet an, Kino über `cinemaAktiv()` beenden (§6), mit den Vorher-Belegen
   aus §9.1.
2. Blickmatrix nach der Kamera erneuern (Befund 3).
3. `render/treffer.ts`: Trefferfunktion, Bahnprojektion, Konstanten, Node-Messung.
4. Hervorhebung und Namensrechtecke im Overlay, Hervorhebung der Bahnen (§4.3, §7).
5. Eingabe: Totzone, Tippen, Hover-Rückrufe (§5).
6. Szene und Verdrahtung in `app/main.tsx`: Zeiger, Treffer je Bild, `trefferBei`,
   `fahreZu`, Mauszeiger.
7. Abnahme nach §9 und Protokoll.

## 11. Nicht-Ziele

- Doppelklick, Kontextmenü, Auswahl ohne Kamerafahrt.
- Ringe, Gürtel und Kinoszenen als Klickflächen.
- Tastaturbedienung des 3D-Bilds; der Objektbaum deckt sie ab.
- Ein Ersatz für den Hover auf Touch-Geräten.
- Eigene Zeigerform beim Ziehen.
- Hervorhebung des aktuellen Kameraziels ohne Zeiger.
