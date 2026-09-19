# Flug und Controller: WASD-Flug, Drehen mit Shift, Xbox-Controller mit Fadenkreuz

Entwurf vom 19.09.2026. Von Jens am 19.09.2026 vor die Etappe 4d-3 geschoben, nach
einer Machbarkeitsprüfung im Chat. Das Vorhaben gehört zu keiner Phase und bekommt
wie „Klickflächen" und „Zeitbereich" kein eigenes Tag.

Ziel: Mit der Tastatur frei durch das Sonnensystem fliegen (WASD), mit gehaltener
Shift-Taste um den Körper in der Bildmitte drehen, und dasselbe mit einem Controller:
linker Stick und Trigger fliegen, der rechte Stick führt ein Fadenkreuz, eine Taste
fährt die Kamera zum Objekt darunter.

## 1. Ausgangslage

- **Kamera** (`render/camera/controller.ts`): Frei und Geheftet drehen auf
  Kugelkoordinaten (`distance`, `azimuth`, `elevation`) um einen Anker. Frei friert
  den Anker zum Zeitpunkt `freezeJd` ein, Geheftet führt ihn mit dem Körper mit,
  Folgen blickt entlang der Bahngeschwindigkeit, im Kino gibt der Director das Ziel
  vor. Der Blickpunkt ist immer der Anker. Gedämpft wird der Versatz zum Anker
  (0,45 s); ein Wechsel von Modus, Ziel oder `freezeJd` erzeugt einen Restversatz,
  der abklingt. Eine Flugkamera, deren Blick nicht auf einem Anker liegt, gibt es
  nicht.
- **Zeigereingabe** (`render/camera/input.ts`): Ziehen dreht (π/600 je Pixel), Rad
  und zwei Finger zoomen vervielfachend, Tippen und Hover gehen über Rückrufe an die
  Szene (`onTipp` → `trefferBei` → `fahreZu`, `onZeiger` → `setZeiger`).
- **Tastenkürzel** (`ui/shortcuts/useShortcuts.ts`): `handleShortcut(e.key)` wirkt
  einmal je `keydown` und übergeht Ereignisse mit Strg, Alt oder Meta sowie aus
  Eingabefeldern. Belegt sind H, F, Leertaste, Pfeil links und rechts, R, C, N,
  Escape, L, I, Pos1 und ?. W, A, S, D, Q und E sind frei. Die Übersicht steht als
  `KUERZEL` in `ui/App.tsx`.
- **Treffer** (`render/treffer.ts`): `findeTreffer` entscheidet in CSS-Pixeln über
  Scheiben, Namen und Bahnen; Zeigerarten `maus` und `finger` mit Fangradius 8 und
  20 px. Die Szene hält den Hover aus dem zuletzt berechneten Bild.
- **Kamerafahrt** (`ui/kamerafahrt.ts`): `fahreZu(id)` und `fahreZuSystem()`
  beenden ein aktives Kino, setzen das Ziel sofort und lassen den Abstand in 1,5 s
  von `camera.distance` aus gleiten; Azimut und Elevation bleiben. `pointerdown`,
  `wheel` und `keydown` am Fenster brechen eine Fahrt ab.
- **Ruhe und Kino** (`ui/idle.ts`, `ui/cinemaControl.ts`): `pointerdown`,
  `pointermove`, `wheel`, `keydown` und `touchstart` am Fenster zählen als Eingabe;
  nach 3 s Ruhe verschwinden Oberfläche und Mauszeiger. Jede Eingabe außer C, N,
  Escape und Klicks in `[data-cinema-control]` hält einen laufenden Film an
  (`noteUserInput`). `stopCinema` stellt Kamera, Zeitraffung und Pause von vor dem
  Start wieder her.
- **Bildschleife** (`app/loop.ts`, `app/main.tsx`): je Bild `tickCinema`, dann
  `szene.update`; eine Ausnahme überspringt nur dieses Bild.

Rahmen aus dem Browser (Machbarkeitsprüfung 19.09.2026):

1. Die Gamepad-API gibt es in Chrome, Edge, Firefox und Safari. Xbox-Controller
   melden sich mit `mapping === 'standard'`.
2. Sie liefert nur in einem sicheren Kontext Werte (HTTPS oder `localhost`); Chrome
   und Firefox (ab Version 81) geben sonst nichts heraus. Auf dem Webspace setzt das
   Let's Encrypt voraus, das für Phase 5 ohnehin offen ist.
3. Ein Controller wird erst sichtbar, nachdem auf der Seite eine seiner Tasten
   gedrückt wurde.
4. Für Achsen und Tasten gibt es keine Ereignisse, nur die Abfrage je Bild.
   Controller-Eingaben erreichen deshalb weder Ruhewächter noch Kino-Pause noch den
   Abbruch einer Kamerafahrt.
5. Strg+W, Strg+T und Strg+N gibt Chrome nicht an die Seite weiter (nur im Vollbild
   mit der Keyboard-Lock-API). Strg taugt deshalb nicht als Umschalter für WASD.

Quellen: Mozilla Hacks, „Securing Gamepad API" (Juli 2020); Chromium blink-dev,
„Intent to Ship: Restrict Gamepad usage"; Chrome for Developers, „Keyboard Lock API";
Mozilla Bug 1052569.

## 2. Entscheidungen (Jens, 19.09.2026)

1. **Erst prüfen, dann einschieben.** Das Vorhaben kommt vor 4d-3, ohne Tag.
2. **WASD fliegt.** Mit gehaltener Shift-Taste dreht WASD stattdessen um einen
   Körper. Strg war der erste Wunsch und fiel wegen Strg+W weg (§1, Punkt 5).
3. **Drehpunkt für Shift** ist der Körper nächst der Bildmitte.
4. **Maus im Flug:** Ziehen schaut um, das Rad regelt die Fluggeschwindigkeit.
   Außerhalb des Flugs bleibt die Maus wie heute.
5. **Bezug:** Die fliegende Kamera wird mit dem nächsten Körper mitgeführt; nähert
   man sich einem anderen, wechselt der Bezug.
6. **Controller mit beweglichem Fadenkreuz:** rechter Stick führt das Kreuz, linker
   Stick lenkt den Blick, Trigger fliegen, LB gehalten wirkt wie Shift, A fährt zum
   Objekt unter dem Kreuz, B in die Draufsicht, R3 holt das Kreuz zur Mitte.
7. **Der Controller steuert zusätzlich** Zeit, Kino und Oberfläche.
8. **Infopanel und Objektbaum folgen dem Ziel**, nicht dem Bezugskörper des Flugs.
   Beim Vorbeiflug am Mond springt der Text nicht um.
9. Abschnitte 3 bis 10 dieses Entwurfs wurden im Chat einzeln freigegeben; was beim
   Niederschreiben hinzukam, steht in §12.2. Testgerät für die Prüfung von Hand ist
   ein Xbox-Controller.

## 3. Flugmodus und Zustand

### 3.1 Modus `fly`

Neuer Kameramodus `fly`, angezeigt als „Flug" / „Fly". Frei, Geheftet, Folgen und
Kino bleiben unverändert; die Anwendung startet wie heute in Frei mit Blick auf die
Sonne. In den Flug führen WASD ohne Shift (§4.1), linker Stick oder Trigger ohne LB
(§5.2) und eine fünfte Schaltfläche im Kamera-Panel. Jeder Eintritt übernimmt die
gerade gezeigte Kameralage (`letztePose()`, §6), die Kamera springt also nicht.

### 3.2 Felder

`camera.fly = { refId, x, y, z, yaw, pitch }`:

- `refId`: Bezugskörper des Flugs (§3.3), eine Kennung aus dem Katalog.
- `x`, `y`, `z`: Lage der Kamera relativ zum Bezugskörper in dargestellten km, also
  im Raum von `scaledPositionAt` nach den Maßstabsreglern.
- `yaw`, `pitch`: Blickrichtung im Ekliptiksystem, gezählt wie `azimuth` und
  `elevation`. Blickvektor `(cos pitch · cos yaw, cos pitch · sin yaw, sin pitch)`.

Kein Rollen: „Oben" ist immer Ekliptik-Nord, `pitch` endet bei `ELEVATION_GRENZE`
(π/2 − 0,01) wie die Elevation heute. `targetId` bleibt vom Flug unberührt und
bestimmt weiter Infopanel und Objektbaum (Entscheidung 8). Die Standardwerte
entsprechen der Startansicht: Bezug Sonne, Lage auf dem Punkt von `distance` 8·10⁸ km,
`azimuth` 0,6 und `elevation` 0,5, Blick auf die Sonne.

### 3.3 Bezugskörper

Maß ist der Abstand in dargestellten Radien, q = |p − p_K| / R_K, mit `R_K` aus
`scaledRadius`. Das ähnelt dem physikalischen Einflussbereich: Zwischen den Planeten
gewinnt die Sonne, in Erdnähe die Erde, dicht am Mond der Mond. Kandidaten sind alle
Körper mit `visible[id] !== false`.

- Der Bezug wechselt erst, wenn ein anderer Körper q < 0,8 · q_Bezug erreicht
  (Rückstellbereich 20 %, gegen Flattern an der Grenze).
- Beim Wechsel wird die Lage auf den neuen Körper umgerechnet; die Weltlage bleibt
  bis auf Rundung gleich.
- Ist der Bezugskörper ausgeblendet, wird im nächsten Bild ohne Rückstellbereich
  neu gewählt.
- Die Wahl läuft je Bild, auch ohne Eingabe: Bei laufender Uhr kann ein Körper auf
  die Kamera zukommen.

### 3.4 Geschwindigkeit und Mindesthöhe

- Höhe h = kleinster Abstand zu einer sichtbaren Oberfläche, min(|p − p_K| − R_K).
  Ringe zählen nicht.
- Geschwindigkeit v = f · max(h, 0,05 · R_n) je Sekunde, `R_n` der Radius des
  Körpers mit der kleinsten Höhe. Nahe am Mond fliegt man langsam, zwischen den
  Planeten schnell. Auf eine Oberfläche zu nähert man sich von selbst gebremst, die
  Untergrenze erlaubt trotzdem das Gleiten dicht über ihr.
- Tempofaktor f: Start 0,5, das Rad ändert ihn um ×1,25 je Raststufe (100 px
  `deltaY`), Bereich 0,02 bis 20. Er ist flüchtig (Modulzustand) und steht nicht in
  Link, Sitzung oder Ansicht.
- Mindesthöhe (nur im Flug; die übrigen Modi behalten ihre Abstandsgrenzen): Die
  Kamera bleibt mindestens 1,05 · R_K vom Mittelpunkt jedes sichtbaren Körpers
  entfernt. Eine Lage darunter (Maßstabswechsel, Link) wird radial hinausgeschoben.
- Die Lage bleibt innerhalb von 10¹³ km um den Bezugskörper, wie `MAX_DISTANCE_KM`.

### 3.5 Persistenz

Link, Sitzung und Ansichten tragen `camera` samt `fly` wie bisher als Ganzes; ein
geteilter Link zeigt dieselbe Flugposition. Der Prüfer (`store/pruefer.ts`) kennt:

- `camera.mode` mit `fly`;
- `camera.fly.refId` wie `camera.targetId` (Katalogkennung);
- `camera.fly.x`, `.y`, `.z` im Bereich ±10¹³;
- `camera.fly.pitch` in ±π/2; `camera.fly.yaw` ohne Bereich (wickelt um wie
  `azimuth`).

Alte Links und Sitzungen ohne `camera.fly` erhalten die Standardwerte. Ungültige
Werte fallen feldweise weg wie bei jedem anderen Feld.

## 4. Tastatur und Maus

### 4.1 Flug (ohne Shift)

- W/S vor und zurück entlang des Blicks, A/D seitwärts, Q/E nach unten und oben,
  jeweils bezogen auf die Kamera (rechts = Blick × Ekliptik-Nord, oben = rechts ×
  Blick).
- Gleichzeitig gehaltene Tasten addieren sich; der Richtungsvektor wird normiert,
  schräg ist also nicht schneller.
- Verarbeitet wird je Bild, solange eine Taste gehalten ist (Geschwindigkeit §3.4
  mal `dt`). `keydown`-Wiederholungen (`e.repeat`) werden übergangen.
- Steht die Kamera nicht im Flug, startet der erste Druck ihn ab der gezeigten Lage.

### 4.2 Shift: Drehen um den Körper nächst der Bildmitte

- Ein Druck von W, A, S, D, Q oder E mit gehaltener Shift-Taste wählt in Flug, Frei
  und Kino den Körper nächst der Bildmitte:
  - liegt die Bildmitte auf einer Körperscheibe (Winkel zur Blickachse kleiner als
    der Winkelradius), gilt der vorderste solche Körper;
  - sonst der Körper mit dem kleinsten Winkel zur Blickachse;
  - nur sichtbare Körper vor der Kamera.

  Das ist rein geometrisch und entspricht Rang 1a der Trefferprüfung; es braucht
  keine Kandidaten aus dem letzten Bild.
- Der Körper wird Ziel wie bei einem Klick: `targetId`, Modus Geheftet,
  `freezeJd` null. Der Themenverfall gilt wie bei jedem Zielwechsel
  (`ui/info/themaVerfall.ts`).
- `distance`, `azimuth` und `elevation` kommen aus der gezeigten Lage relativ zum
  Körper. Die Kamera springt nicht, nur der Blick schwenkt gedämpft auf den Körper.
- Danach, solange Shift gehalten wird:
  - Shift+A/D bewegen die Kamera nach links und rechts um den Körper (60°/s);
  - Shift+W/S fahren näher heran und weiter weg (Faktor 2 je Sekunde), in den
    Grenzen von `input.ts` (10² bis 10¹³ km);
  - Shift+Q/E senken und heben den Blickwinkel (45°/s), begrenzt durch
    `ELEVATION_GRENZE`.
- Neu gewählt wird nur aus Flug, Frei und Kino. In Geheftet und Folgen dreht
  Shift+WASD um das bestehende Ziel, das dort ohnehin in der Mitte steht; ein Mond,
  der gerade vor ihm vorbeizieht, wird so nicht versehentlich Ziel. Folgen wechselt
  dabei in Geheftet.
- Lässt man Shift los, bleibt die Kamera geheftet, bis wieder WASD ohne Shift kommt.

### 4.3 Maus

- **Im Flug:** Ziehen schaut um sich, π/600 je Pixel wie heute. Der Himmel folgt
  der Hand wie in Stellarium: Ziehen nach rechts dreht den Blick nach links, Ziehen
  nach oben senkt ihn. Das Rad ändert den Tempofaktor (§3.4); eine Einblendung unten
  in der Mitte zeigt den neuen Wert („Tempo ×1,5" / „Speed ×1.5") 1,5 s lang.
- Tippen und Hover wirken in jedem Modus wie heute; ein Klick auf einen Körper fährt
  dorthin und beendet damit den Flug.
- In allen anderen Modi bleibt die Maus wie heute.

### 4.4 Abgrenzung

- Erkannt wird nach `e.code` (`KeyW`, `KeyA`, `KeyS`, `KeyD`, `KeyQ`, `KeyE`), also
  nach der Lage auf der Tastatur, auch bei französischer Belegung.
- Keine Wirkung, wenn der Fokus in einem Eingabefeld liegt (wie `istEingabefeld`)
  oder Strg, Alt oder Meta gedrückt ist.
- `blur` des Fensters und `visibilitychange` zu verborgen vergessen alle gehaltenen
  Tasten.
- Pos1 setzt wie bisher `DEFAULT_STATE.camera` und beendet damit auch den Flug.

### 4.5 Kino, Kamerafahrt, Kamera-Panel

- **Kino:** WASD (mit oder ohne Shift) während eines laufenden oder angehaltenen
  Films ruft `stopCinema()` und setzt im selben Takt den Flug bzw. das Drehen ab der
  gezeigten Lage. Zeitraffung und Pause kehren wie bei Escape auf den Stand vor dem
  Film zurück.
- **Kamerafahrt:** Eine Fahrt bricht bei `keydown` ohnehin ab. Aus dem Flug heraus
  setzen `fahreZu` und `fahreZuSystem` vor der Fahrt `distance`, `azimuth` und
  `elevation` aus der gezeigten Lage relativ zum neuen Ziel; sonst begänne die Fahrt
  bei einem veralteten Kugelabstand.
- **Kamera-Panel:** Die Schaltfläche „Flug" wirkt wie ein WASD-Druck. Im Flug wirken
  Abstandsregler und Blickwinkel-Schaltflächen auf das Ziel: Sie beenden den Flug in
  den Modus Geheftet um `targetId`.
- **Kürzelübersicht (?):** neue Zeilen für WASD, Q/E, Shift und das Rad im Flug, auf
  Deutsch und Englisch.

## 5. Controller und Fadenkreuz

### 5.1 Erkennung

- Je Bild liest die Steuerung `navigator.getGamepads()`, vor `tickCinema`.
- Es gilt der erste Controller mit `mapping === 'standard'`; andere werden übergangen.
- Ohne `isSecureContext`, ohne `navigator.getGamepads` oder wenn der Aufruf wirft
  (etwa wegen einer Berechtigungsregel der einbettenden Seite), schaltet sich die
  Controller-Steuerung einmalig und still ab. Tastatur und Maus laufen weiter.
- Beim ersten Auftauchen gilt der aktuelle Tastenstand als Vorzustand: Der
  Tastendruck, mit dem der Browser den Controller freigibt (§1, Punkt 3), löst keine
  Wirkung aus.
- Trennen (`gamepaddisconnected` oder Eintrag fehlt) blendet das Fadenkreuz aus und
  vergisst alle gehaltenen Zustände.

### 5.2 Sticks und Trigger

Achsen nach der Standardbelegung: 0/1 linker Stick, 2/3 rechter Stick (y positiv =
unten); Trigger als Tasten 6 (LT) und 7 (RT) mit stufenlosem `value`.

- Sticks: kreisförmige Totzone 0,15, danach auf 0 bis 1 neu skaliert und quadriert
  (feine kleine Ausschläge). Trigger: Totzone 0,05, linear. NaN zählt als 0.
- **Linker Stick im Flug:** lenkt den Blick, bei vollem Ausschlag 90°/s. Rechts =
  nach rechts schauen, oben = nach oben schauen, wie in Spielen.
- **RT/LT im Flug:** vorwärts und rückwärts, Geschwindigkeit §3.4 mal Triggerwert.
- **LB gehalten:** wie Shift (§4.2). Zusammen mit linkem Stick oder Trigger wählt der
  erste Ausschlag den Körper nächst der Bildmitte, nach denselben Regeln wie Shift;
  danach dreht der linke Stick um
  ihn (90°/s, rechts = Kamera nach rechts, oben = Kamera nach oben), RT fährt heran,
  LT weiter weg (Faktor 2 je Sekunde bei vollem Druck).
- Linker Stick oder Trigger ohne LB starten den Flug ab der gezeigten Lage, wie WASD.
- **Rechter Stick:** bewegt das Fadenkreuz, bei vollem Ausschlag eine Canvas-Höhe je
  Sekunde; es bleibt innerhalb der Canvas.

### 5.3 Tasten

Tasten wirken beim Drücken (Flanke), nicht beim Halten.

| Taste (Index) | Wirkung | entspricht |
|---|---|---|
| A (0) | Kamerafahrt zum Objekt unter dem Kreuz (`trefferBei` mit Zeigerart `pad`, dann `fahreZu`); ohne Treffer nichts | Klick |
| B (1) | `fahreZuSystem()` | Wurzel im Objektbaum |
| R3 (11) | Fadenkreuz zur Canvas-Mitte | – |
| Steuerkreuz ← → (14, 15) | Zeitraffung langsamer, schneller | Pfeil links, rechts |
| Steuerkreuz ↑ (12) | Pause | Leertaste |
| Steuerkreuz ↓ (13) | Zeit rückwärts | R |
| Menü/Start (9) | Kino ein/aus | C |
| RB (5) | nächste Szene | N |
| View (8) | Oberfläche ein/aus | H |
| Y (3) | Infopanel ein/aus | I |

Die Tastenzeilen ab dem Steuerkreuz rufen `handleShortcut` mit dem entsprechenden
Schlüssel; Tastatur und Controller verhalten sich dadurch gleich, auch im Kino. X (2),
L3 (10) und die Xbox-Taste (16) bleiben frei; die Xbox-Taste belegen Windows, Steam
und die Xbox Game Bar.

### 5.4 Fadenkreuz

- Ring von etwa 24 px mit Mittelpunkt, weiß mit dunkler Kontur, im Overlay mit
  `pointer-events: none`, über der Bedienoberfläche.
- Die Lage (CSS-Pixel relativ zur Canvas, Start in der Mitte) setzt die Steuerung je
  Bild direkt am Element, ohne React-Rendern. Bei Größenänderung wird sie in die
  Canvas geklemmt.
- Sichtbar ab der ersten Controller-Eingabe; es bleibt sichtbar, wenn die Oberfläche
  mit H ausgeblendet ist.
- Solange es sichtbar ist, geht seine Lage als Zeiger der Art `pad` an
  `szene.setZeiger`; hervorgehoben wird wie beim Hover mit der Maus.
- `pointermove` der Maus blendet es aus, die Maus übernimmt den Hover. Nach 3 s Ruhe
  blendet es mit dem Mauszeiger aus (`zeigerAusgeblendet()`). Die nächste
  Stick-Eingabe zeigt es an seiner letzten Lage.
- Neue Zeigerart `pad` in `render/treffer.ts`: Fangradius 20 px wie der Finger.

### 5.5 Anbindung an Ruhe, Kino und Fahrt

Weil der Controller keine Fensterereignisse auslöst (§1, Punkt 4):

- Jede Controller-Eingabe (Stick oder Trigger über der Totzone, Tastenflanke) meldet
  sich beim Ruhewächter (`handleInput`), damit Oberfläche und Kreuz sichtbar bleiben.
- Sie ruft `noteUserInput()` wie eine Mauseingabe, außer Menü/Start und RB (wie C und
  N auf der Tastatur).
- Jede Eingabe außer A und B ruft `fahrtAbbrechen()`; A und B starten selbst eine
  Fahrt, die die laufende ersetzt.
- Flug und Drehen mit dem Controller beenden ein Kino wie WASD (§4.5).
- Die Kürzelübersicht (?) bekommt einen Abschnitt „Controller" auf Deutsch und
  Englisch.

## 6. Aufbau

### 6.1 Bausteine

| Ort | Inhalt |
|---|---|
| `store/types.ts`, `store/index.ts` | Modus `fly`, Feld `camera.fly` mit Standardwerten (§3.2). |
| `store/pruefer.ts` | Aufzählung, Bereiche und Kennungsprüfung der neuen Felder (§3.5). |
| `render/camera/flug.ts` (neu, rein) | Bezugswahl mit Rückstellbereich, Höhe und Geschwindigkeit, Flugschritt (Lage + Steuerabsicht + `dt` → neue Lage), Blickschritt, Umrechnung Fluglage ↔ Kugelkoordinaten um einen Körper, Körper nächst der Bildmitte, Mindesthöhe. Ohne DOM, ohne Store-Zugriff; Positionen und Sichtbarkeit kommen als Werte herein. |
| `render/camera/controller.ts` | Ziel für `fly`: Anker ist der mitgeführte Bezugskörper, Lage und Blickrichtung werden getrennt gedämpft (Startwert 0,15 s). Jeder Übergang in den Flug oder aus ihm übernimmt die gezeigte Lage als Ausgangszustand; weder Lage noch Blick springen, ein Bezugswechsel erzeugt keinen Scheinversatz. Neu `letztePose()`: gezeigte Weltlage, Blickvektor und `jd` des letzten Bildes. |
| `render/camera/input.ts` | Im Flug: Ziehen → Blick, Rad → Tempofaktor (über einen Rückruf, `input.ts` kennt den Faktor nicht). |
| `render/treffer.ts` | Zeigerart `pad`. |
| `ui/steuerung/tastatur.ts` (neu) | Gehaltene Tasten nach `e.code`, Abgrenzung §4.4. |
| `ui/steuerung/gamepad.ts` (neu) | Controller lesen, Totzonen und Kurve, Flanken; als reine Funktion von Controllerzustand und Vorzustand, die Absicht, Tastenflanken und neuen Vorzustand liefert, plus dünner Leser um `navigator.getGamepads()`. |
| `ui/steuerung/anwenden.ts` (neu) | `steuerungTakt(jd, dt)`: führt Tastatur- und Controller-Absicht zusammen, setzt Übergänge (Flug, Drehen, Kino beenden, Fahrt abbrechen), schreibt den Store, führt Tastenaktionen aus, meldet Eingaben an Ruhewächter und Kino-Pause, bewegt das Fadenkreuz. Tempofaktor als Modulzustand. |
| `ui/steuerung/Fadenkreuz.tsx`, `ui/steuerung/TempoHinweis.tsx` (neu) | Anzeige; Modulnamen unterscheiden sich von den Komponenten (NTFS). |
| `ui/idle.ts` | Neu `eingabeMelden()`: Controller-Eingaben erreichen den Wächter aus `useIdleHide`. |
| `ui/kamerafahrt.ts` | Aus dem Flug: Kugelkoordinaten aus der gezeigten Lage (§4.5). |
| `ui/panels/CameraPanel.tsx`, `ui/App.tsx`, `ui/i18n` | Schaltfläche „Flug", Regler im Flug (§4.5), Kürzelübersicht, Texte de/en. |
| `app/main.tsx` | Verdrahtung (§6.2). Im DEV-Build liegt `letztePose` wie `window.kamera` für Messungen bereit. |

Die Schichtentests gelten weiter: `render` importiert nichts aus `ui`, `store` weder
aus `ui` noch aus `render`. `ui/steuerung` darf `render/camera/flug.ts` nutzen;
`letztePose` und `trefferBei` erreicht es über Rückrufe aus `app/main.tsx`, nicht
über die Szene selbst.

### 6.2 Ablauf je Bild

1. Die Bildschleife schreibt `time.jd` fort (unverändert).
2. `steuerungTakt(jd, dt)`: Tastatur und Controller lesen, Absicht bilden,
   Übergänge und Tastenaktionen ausführen, im Flug Flugschritt, Bezugswahl und
   Mindesthöhe (auch ohne Eingabe), Fadenkreuz bewegen und an `setZeiger` geben.
3. `tickCinema(dt)`, danach wie heute `szene.update` mit Controller; der Controller
   hält `letztePose` für das nächste Bild fest.

Taste A ruft `trefferBei` mit den Kandidaten des zuletzt berechneten Bildes, wie ein
Klick.

## 7. Fehlerfälle

- Keine Gamepad-API, kein sicherer Kontext, `getGamepads()` wirft: Controller-Teil
  still aus (§5.1), einmal je Seitenladung geprüft.
- Achswerte NaN oder außerhalb von ±1: als 0 bzw. geklemmt.
- Fluglage in einem Körper (Maßstabswechsel, Link, heranziehender Körper): radial auf
  die Mindesthöhe hinausgeschoben (§3.4).
- Bezugskörper ausgeblendet oder unbekannt: Neuwahl im nächsten Bild (§3.3); im Link
  fällt eine unbekannte `refId` schon im Prüfer weg.
- Hängende Tasten: `blur` und `visibilitychange` vergessen sie (§4.4); Trennen des
  Controllers vergisst dessen Zustand (§5.1).
- Ausnahmen in der Steuerung fängt die Bildschleife je Bild ab (`app/loop.ts`).

## 8. Tests (Vitest)

- `flug.ts`: Bezugswahl (Sonne zwischen den Planeten, Erde in Erdnähe, Mond dicht am
  Mond, Rückstellbereich an der Grenze, ausgeblendeter Bezug); Weltlage beim
  Bezugswechsel gleich; Geschwindigkeit proportional zur Höhe mit Untergrenze;
  Mindesthöhe; Körper nächst der Mitte (Scheibe vor Winkel, vorderste Scheibe,
  nichts hinter der Kamera, nichts Ausgeblendetes); Hin- und Rückrechnung
  Fluglage ↔ Kugelkoordinaten; `pitch` an der Grenze.
- `pruefer.ts`: neue Felder im und außerhalb des Bereichs, unbekannte `refId`, alter
  Zustand ohne `camera.fly`.
- `tastatur.ts`: `e.code` statt `e.key`, `e.repeat`, Eingabefelder, Strg/Alt/Meta,
  `blur` und `visibilitychange`.
- `gamepad.ts` mit nachgebauten Objekten: Totzone und Kurve, Trigger, Flanken,
  Vorzustand beim ersten Auftauchen, fremde Belegung, NaN, Trennen, fehlender
  sicherer Kontext, werfendes `getGamepads`.
- `anwenden.ts`: Eintritt in den Flug aus Geheftet ab `letztePose`; Shift und LB
  wählen das Ziel nächst der Mitte; Kino endet samt Wiederherstellung; Fahrt bricht
  ab außer bei A/B; `noteUserInput` außer bei Menü/Start und RB; `eingabeMelden` bei
  jeder Controller-Eingabe; Tastenzeilen rufen `handleShortcut`.
- `kamerafahrt.ts`: Fahrt aus dem Flug beginnt bei der gezeigten Lage.
- `controller.ts`: kein Sprung beim Eintritt in den Flug, beim Bezugswechsel und
  beim Übergang in Geheftet.
- `Fadenkreuz.tsx`: Sichtbarkeit nach Controller-Eingabe, Mausbewegung, Ruhe.

Eine bekannte Lücke bleibt wie bei den Klickflächen: `app/main.tsx` hat keine
Verdrahtungstests; die Abnahme im Browser deckt sie.

## 9. Abnahme (Sichtprüfung)

Messung per Playwright mit Pixelwerten, Verfahren wie in der lokalen
Projektanleitung (Uhr anhalten, `quality.tier` hoch, Oberfläche aus, Differenzbilder
in derselben Ladung). Ein Init-Skript vor dem Laden (`addInitScript`) ersetzt
`navigator.getGamepads` durch einen steuerbaren Controller; Tasten der Tastatur hält
`page.keyboard.down/up`, Zeiten misst `performance.now()` in der Seite.

1. **Flug:** W gehalten, Uhr angehalten: Der Scheibendurchmesser des Ziels wächst;
   Durchmesser in px vorher und nachher.
2. **Mitführung:** Flug nahe Saturn, Uhr 10 d/s, 5 s ohne Eingabe: Saturn bleibt bis
   auf wenige px an seinem Platz (zum Vergleich: im Modus Frei läuft er aus dem Bild).
3. **Bezugswechsel:** Flug von der Erde zum Mond über die Grenze; größter Schritt der
   gezeigten Lage je Bild aus `letztePose` nicht größer als der Flugschritt.
4. **Shift:** Shift+A mit einem Körper abseits der Mitte: Er wird Ziel und steht nach
   1 s auf ±2 px mittig; das Infopanel zeigt seinen Text.
5. **Fadenkreuz:** Differenzbild Kreuz an/aus; Kreuz auf einer Bahn hebt deren
   Deckkraft auf 0,9; A mit dem Kreuz auf einem Körper: Ziel steht 3 s nach
   Fahrtbeginn mittig (Vergleich: Abnahme Klickflächen, 1,6 px).
6. **Ruhe und Kino:** Oberfläche bleibt bei Stick-Eingabe über 3 s hinaus sichtbar;
   ein Stick hält das Kino an, Menü/Start und RB nicht; WASD beendet es und fliegt
   ab dem gezeigten Bild.
7. **Kosten:** mittlerer und größter Bildabstand mit aktivem und ohne Controller,
   gemessen mit eigenem rAF-Zähler.

Von Hand mit dem Xbox-Controller (Jens): Tempo, Totzonen, Drehraten,
Kreuzgeschwindigkeit. Die Startwerte (§12) lassen sich danach per Ruling ändern.

## 10. Etappen

Jede Etappe mit eigenem Plan, eigenem Branch, Fast-Forward nach `master` und
Abnahmeprotokoll.

- **Etappe 1 „Flug mit Tastatur und Maus"** (Branch `flug-1`, etwa 9 bis 10 Tasks):
  Store und Prüfer; `flug.ts`; Controller-Ziel für den Flug und `letztePose`;
  Tastatur und `steuerungTakt` für den Flug; Shift-Drehen; Maus und Tempo-Hinweis;
  Kino, Fahrt und Kamera-Panel; Kürzelübersicht; Abnahme (§9 Punkte 1 bis 4 und der
  Tastaturteil von 6). Abnahme `docs/flug-etappe1-abnahme.md`.
- **Etappe 2 „Controller und Fadenkreuz"** (Branch `flug-2`, etwa 7 bis 8 Tasks):
  `gamepad.ts`; Controller-Absicht in `steuerungTakt`; Fadenkreuz mit Zeigerart `pad`
  und Hover; A, B und R3; Tastenzeilen für Zeit, Kino und Oberfläche; Ruhe, Kino und
  Fahrt; Kürzelübersicht; Abnahme (§9 Punkte 5 bis 7) und Prüfung von Hand.
  Abnahme `docs/flug-etappe2-abnahme.md`.

Danach geht es mit 4d-3 weiter.

## 11. Nicht-Ziele

- Rollen, Trägheit oder Flugphysik; Zusammenstöße mit Ringen und Gürteln.
- Controller ohne Standardbelegung, frei belegbare Tasten, Vibration.
- Bildschirm-Joysticks für Berührung.
- Das Fadenkreuz bedient keine Panels, es wählt nur in der Szene.
- Tastenbeschriftung je Tastaturbelegung in der Übersicht (sie nennt W, A, S, D,
  Q, E; wirksam ist die Lage).
- Mausblick mit Pointer Lock.
- Steuern der Kamera während des Kinos, ohne es zu beenden.
- HTTPS auf dem Webspace (Phase 5).

## 12. Startwerte und Präzisierungen

### 12.1 Startwerte

| Größe | Wert |
|---|---|
| Tempofaktor f: Start, Bereich, Radstufe | 0,5; 0,02 bis 20; ×1,25 |
| Tempo-Untergrenze | 0,05 · R_n |
| Mindesthöhe | 1,05 · R_K vom Mittelpunkt |
| Rückstellbereich Bezug | 20 % |
| Dämpfung im Flug (Lage, Blick) | 0,15 s |
| Shift-Drehen A/D, Q/E, W/S | 60°/s, 45°/s, Faktor 2 je s |
| Mausblick | π/600 je Pixel |
| Stick-Totzone und Kurve, Trigger-Totzone | 0,15 quadratisch, 0,05 |
| Stick-Blick, Stick-Drehen mit LB | 90°/s |
| Fadenkreuz bei vollem Ausschlag | eine Canvas-Höhe je Sekunde |
| Fadenkreuz Größe, Fangradius | etwa 24 px, 20 px |
| Tempo-Hinweis | 1,5 s |

### 12.2 Gegenüber dem Chat präzisiert

Die Abschnitte wurden im Chat freigegeben; beim Niederschreiben kamen diese Punkte
hinzu oder wurden genauer:

1. Der Körper nächst der Bildmitte wird rein geometrisch bestimmt (Winkel und
   Winkelradius) statt über die Trefferprüfung; das entspricht deren Rang 1a (§4.2).
2. `fahreZu` und `fahreZuSystem` übernehmen aus dem Flug Abstand und Winkel aus der
   gezeigten Lage (§4.5), sonst begänne die Fahrt bei einem veralteten Abstand.
3. Abstandsregler und Blickwinkel-Schaltflächen des Kamera-Panels beenden den Flug
   in Geheftet um das Ziel (§4.5).
4. Blickrichtung: Maus „Himmel folgt der Hand" (§4.3), Stick wie in Spielen (§5.2).
5. LB wirkt erst zusammen mit Stick oder Trigger, wie Shift erst mit einer Flugtaste
   (§5.2).
6. Der Tastendruck, der den Controller freigibt, löst nichts aus (§5.1).
7. Im Flug dämpft der Controller mit 0,15 s statt 0,45 s, damit die Tasten direkt
   wirken.
8. Die Bezugswahl läuft je Bild auch ohne Eingabe (§3.3).
9. Shift und LB wählen nur aus Flug, Frei und Kino neu; in Geheftet und Folgen
   drehen sie um das bestehende Ziel (§4.2).

## 13. Nachtrag nach der Abnahme von Etappe 1 (19.09.2026)

Die Abnahme `docs/flug-etappe1-abnahme.md` stellte in §6 fünf Fragen. Jens folgte
am 19.09.2026 den Empfehlungen („Bei den Fragen folge ich erstmal gerne deinen
Empfehlungen"). Die Punkte ändern §3.3, §4.2, §4.5 und §6.1 und kommen als erste
Tasks in Etappe 2, vor Controller und Fadenkreuz.

### 13.1 Bezug nach Systemen (ändert §3.3)

Im Schaubild ist die Sonne 12,2·10⁶ km groß dargestellt, die Mondbahnen wachsen mit
`sizeScale`. Nach dem Maß q = |p − p_K| / R_K allein gewann deshalb die Sonne ab rund
15 Erdradien vor der Erde; bei laufender Uhr blieb die Kamera zwischen Erde und Mond
im Raum stehen. Die Wahl wird zweistufig:

- **Einflussbereich:** Jeder Körper, der die Sonne umläuft, hat einen dargestellten
  Einflussbereich E_K = min(a_K · (m_K / (3 m_☉))^(1/3) · `sizeScale`,
  0,5 · |p_K|): den Hill-Radius mit der großen Halbachse zur Epoche, vergrößert wie
  die Mondbahnen (`sim/scale.ts`), höchstens der halbe dargestellte Sonnenabstand.
  Im Schaubild zur Epoche J2000 hat die Erde E ≈ 7,4·10⁷ km (rund 232 dargestellte
  Erdradien, der Deckel greift knapp), die Mondbahn liegt bei einem Viertel davon.
- **System:** Die Kamera gehört zum System des Sonnenumläufers mit der kleinsten
  Tiefe t = |p − p_K| / E_K unter t < 1, sonst zur obersten Ebene. Ein bisheriges
  System bleibt bis t ≥ 1 / 0,8 = 1,25; ein anderes gewinnt vorher nur mit
  t < 0,8 · t_bisher (Rückstellbereich wie beim Maß q).
- **Bezug im System:** Kandidaten sind der Sonnenumläufer und seine sichtbaren Monde,
  gewählt nach q mit dem Rückstellbereich aus §3.3. Auf der obersten Ebene
  konkurrieren nach q die Sonne, alle Sonnenumläufer und Monde, deren Mutterkörper
  ausgeblendet ist.
- Zwischen Erde und Mond bleibt die Erde Bezug; der Mond wird es rund 11 Erdradien
  vor ihm. Weit zwischen den Planeten gewinnt weiter die Sonne, nahe einem Planeten
  dieser. Im Schaubild greift der Deckel bei den Riesenplaneten deutlich (Jupiter
  2·10⁸ km statt 2,6·10⁹ km); zwischen Mars- und Jupiterbahn kann deshalb Jupiter
  Bezug sein. Im Maßstab Kompakt reicht die dargestellte Mondbahn über den gedeckelten
  Erdbereich hinaus; dort entscheidet wie bisher q.

### 13.2 Ziel nach dem Wechsel vom Kino in den Flug (ergänzt §4.5 und Entscheidung 8)

Ein Flug, der ein Kino beendet (WASD, später Stick oder Trigger), setzt `targetId` auf
den Körper, auf den die laufende Szene blickt: beim Bahntyp `sichtlinie` den
Standortkörper (`targetId` der Szene), sonst `lookAtId`, ohne ihn den
Standortkörper. Das ist der Blickpunkt von `cinemaTargetFor`. Sonst bliebe das Ziel
von vor dem Kino stehen, und das Infopanel zeigte einen Körper, den die Kamera gar
nicht ansteuert. Shift und LB wählen wie bisher den Körper nächst der Bildmitte. Der
Themenverfall gilt wie bei jedem Zielwechsel.

### 13.3 Shift und LB loslassen (ersetzt den letzten Punkt von §4.2)

Lässt man Shift los, während Flugtasten gehalten sind, bleiben diese Tasten gesperrt,
bis sie losgelassen und neu gedrückt werden; die Kamera bleibt geheftet. Wer den Griff
Shift+A zuerst an Shift löst, fliegt also nicht seitwärts davon. Tastenwiederholungen
(`e.repeat`) lösen die Sperre nicht. Für den Controller gilt dasselbe: Lässt man LB
los, während der linke Stick oder ein Trigger ausgelenkt ist, zählen beide erst
wieder, nachdem sie in der Totzone waren.

### 13.4 Dämpfung von Wiederherstellungen (ergänzt §6.1 und §12.2 Punkt 7)

Weicht beim Eintritt in den Flug die Fluglage aus dem Store von der gezeigten Lage ab
(Kino beenden mit gemerktem Flug, Ansicht im Flugmodus laden), dämpft der Controller
Lage und Blick mit 0,45 s wie die Umlaufmodi, bis beide bis auf 10⁻³ angekommen sind
(Anteil der Lage bzw. Länge der Blickdifferenz); danach wieder mit 0,15 s. Ein
Flugstart per Taste, Stick oder Trigger beginnt an der gezeigten Lage und bleibt bei
0,15 s. Ein Link im Flugmodus setzt die Lage im allerersten Bild ohne Übergang (§6.1).

### 13.5 Körper nächst der Bildmitte (ändert den zweiten Unterpunkt von §4.2)

Liegt die Bildmitte auf keiner Scheibe, gilt der Körper mit dem kleinsten Winkel
zwischen Blickachse und Scheibenrand (Winkel zur Mitte minus Winkelradius), nicht mehr
der mit dem kleinsten Winkel zur Mitte. Sonst gewann ein kleiner Mond knapp neben der
Achse gegen eine große Scheibe, deren Rand der Achse näher lag (Abnahme Etappe 1,
Messung 4: Io, Europa, Titan oder Saturn statt Jupiter).

### 13.6 Etappe 2

Etappe 2 beginnt mit 13.1 bis 13.5, je als eigene Task mit Tests, danach Controller und
Fadenkreuz nach §10. Die Abnahme (`docs/flug-etappe2-abnahme.md`) misst zusätzlich den
Bezug zwischen Erde und Mond bei laufender Uhr, das Ziel nach dem Wechsel vom Kino in
den Flug, die Sperre nach dem Loslassen von Shift und die Dauer einer Wiederherstellung.

## 14. Nachtrag nach der Abnahme von Etappe 2 (19.09.2026)

Jens folgte den Empfehlungen zu den Fragen in §7 der Abnahme (`docs/flug-etappe2-abnahme.md`).

- **Körper nächst der Bildmitte:** Die Regel aus §13.5 (Winkel minus Winkelradius) bleibt. Ein
  kleiner Körper, dessen Rand näher an der Bildmitte liegt als der Rand einer großen Scheibe,
  wird Ziel; das Plankriterium der Abnahme war zu weit gefasst.
- **Vollbild beim Kinostart über den Controller:** bleibt. Verweigert Chrome das Vollbild ohne
  Nutzeraktivierung, läuft das Kino im Fenster.
- **Kamerafahrt und Fadenkreuz (ändert §5.5):** Rechter Stick und R3 brechen eine Kamerafahrt
  nicht mehr ab; wie die Maus darf das Fadenkreuz während der Fahrt weiterwandern. Alle übrigen
  Eingaben außer A und B brechen weiter ab.
- **Wiederherstellung im laufenden Flug (ergänzt §13.4):** Lädt man während des Fluges eine
  Ansicht, meldet das Ansichten-Panel die Wiederherstellung an den Kamera-Controller
  (`flugWiederherstellungMelden` in `render/camera/controller.ts`). Weicht die Lage ab, gleitet
  die Kamera wie beim Eintritt mit 0,45 s hinüber. Das nächste Bild verbraucht die Meldung in
  jedem Modus.
- Alle Rulings der Etappe 2 (Abnahme §4) sind bestätigt.
