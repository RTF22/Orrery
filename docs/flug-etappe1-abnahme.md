# Abnahme Flug Etappe 1 (Flug mit Tastatur und Maus)

## 1. Umfang

Branch `flug-1` (von `master` 54e90db „Plan Flug Etappe 1: Flug mit Tastatur und Maus"). Plan
`docs/superpowers/plans/2026-09-19-flug-etappe1.md`, Entwurf
`docs/superpowers/specs/2026-09-19-flug-und-controller-design.md` (Abnahme nach §9 Punkte 1 bis 4
und dem Tastaturteil von Punkt 6). Umsetzung:

- 7da1b1f — Kamera: Modus Flug mit Fluglage in Store und Prüfer (Task 1)
- 428eac4 — Flug: Achsen, Bezugswahl, Geschwindigkeit und Mindesthöhe (Task 2)
- 2ff404c — Flug: begrenze aus flug.ts statt Zweitdefinition in input.ts (Task 2, Fixrunde 1)
- 5d2fe5a — Flug: Körper nächst der Bildmitte, Kugelkoordinaten und Flugschritt (Task 3)
- c09fbd6 — Kamera: Flugzweig im Controller, Ein- und Ausstieg ohne Sprung (Task 4)
- b4c6e82 — Kamera: gezeigte Lage trägt ihr jd, Übergänge ohne Sprung bei laufender Uhr (Task 4,
  Fixrunde 1)
- 3c8ddc4 — Plan Flug Etappe 1: gezeigte Lage mit jd in Tasks 6, 7 und 9 (Ruling nach Review von
  Task 4)
- 8e1f5a0 — Steuerung: gehaltene Flugtasten nach ihrer Lage (Task 5)
- af61961 — Steuerung: Flug mit WASD und QE, Bezugswahl und Mindesthöhe je Bild (Task 6)
- 3d13ca2 — Steuerung: Shift+WASD dreht um den Körper nächst der Bildmitte (Task 7)
- 86c0a1a — Flug: Umschauen mit der Maus, Tempo mit dem Rad samt Einblendung (Task 8)
- 4003e90 — Flug: Kamerafahrt und Kamera-Panel beginnen an der gezeigten Lage, Kürzelübersicht
  (Task 9)

Etappe 1 liefert den Kameramodus Flug (`camera.fly` mit Bezugskörper, Lage und Blick, geprüft in
Link, Sitzung und Ansicht), in den WASD und QE ohne Shift an der gerade gezeigten Kameralage
wechseln; Bezug ist der Körper mit dem kleinsten Abstand in dargestellten Radien, das Tempo folgt
der Höhe über der nächsten Oberfläche. Shift+WASD heftet an den Körper nächst der Bildmitte und
dreht um ihn, im Flug schaut Ziehen mit der Maus um und das Rad regelt das Tempo samt Einblendung.
Kino, Kamerafahrt und Kamera-Panel beginnen an der gezeigten Lage (`letztePose()` samt `jd`), die
Kürzelübersicht nennt die neuen Tasten.

## 2. Lint, Tests, Build

Auf 4003e90 (19.09.2026):

- `npm run lint`: `eslint .` ohne Befund.
- `npm test`: Test Files 98 passed (98); Tests 3766 passed (3766).
- `npm run build` (`tsc -b && vite build`): `✓ built in 648ms`, Hauptchunk `index-C5YPCUMw.js`
  1 290,82 kB (gzip 346,88 kB), nur der bekannte Hinweis zu Chunkgrößen über 500 kB.

Testzahl-Herleitung: Ausgangsstand 3692 → 3696 nach 7da1b1f (+4, Task 1: ein Store-, drei
Prüferfälle) → 3708 nach 428eac4 (+12, Task 2; 2ff404c ohne neue Tests) → 3719 nach 5d2fe5a (+11,
Task 3) → 3725 nach c09fbd6 (+6, Task 4: fünf Controller-, ein Belichtungsfall) → 3727 nach
b4c6e82 (+2, Fixrunde 1 zu Task 4: Übergänge bei laufender Uhr) → 3736 nach 8e1f5a0 (+9, Task 5)
→ 3749 nach af61961 (+13, Task 6) → 3756 nach 3d13ca2 (+7, Task 7) → 3760 nach 86c0a1a (+4,
Task 8) → 3766 nach 4003e90 (+6, Task 9). Task 10 (diese Abnahme) ändert keinen Code. Die
Soll-Zahlen des Plans (nach 3c8ddc4) wurden in jedem Task genau erreicht.

## 3. Sichtprüfung

Alle Messungen in einer Seitenladung: Chrome 153 über Playwright am Prüfrechner (2560×1440-Monitor,
59,95 Hz), Viewport 2560×1295 CSS-px, Pixeldichte 1, direkt nach dem Laden `quality.tier = 'high'`,
Maßstab Schaubild (Körper ×50, Abstände k = 0,6, Sonne 0,35). Wartezeiten per
`requestAnimationFrame`-Schleife gegen `performance.now()` in der Seite; vor jedem Screenshot 3 s
Ruhe, bis `renderer.info.memory.textures` gleich blieb. Tasten über `page.keyboard.down/up`. Pixel
mit Python 3.12 (Pillow, numpy): Helligkeit = Luma, Scheibe = zusammenhängende Pixel mit
Helligkeit > 8 ab der hellsten Stelle nahe der erwarteten Lage. Für die Messungen 1, 3 und 4
Oberfläche aus, Kino aus mit `pauseOnInput: false`, Uhr angehalten; Messung 2 ebenso, aber mit
laufender Uhr. Konsole seit dem Laden: 0 Fehler, 0 Warnungen.

| Nr. | Kriterium | Messwert | erfüllt |
|---|---|---|---|
| 1 | Flug mit W: Scheibe B/A innerhalb ±10 % von asin(R/dB)/asin(R/dA); `mode 'fly'`, `fly.refId 'earth'`, `targetId 'earth'` | R = 318 550 km; dA = 10,000 R, W 1012,9 ms gehalten, dB = 6,400 R; Soll 1,5664; Scheibe 278,85 → 438,90 px (Äquivalentdurchmesser), B/A = 1,5740 (+0,49 %; Breite +0,58 %, Höhe +0,68 %); `fly` / `earth` / `earth` | ja |
| 2 | Mitführung, 10 d/s, 5 s: Schwerpunkt der Saturnscheibe verschiebt sich um höchstens 3 px; Gegenprobe Frei: ein Vielfaches | 5005,9 ms, 50,04 d: 0,07 px; Gegenprobe Frei (gleiche Kameralage, `freezeJd`): 465,9 px (Vorhersage aus den Bahnlagen 446 px) | ja |
| 3 | Bezugswechsel: Schritt im Wechselbild höchstens 1,5-mal der größte der drei Schritte davor und danach | Zwei Wechsel (siehe §5): Sonne → Mond 6143,0 km gegen 6337,7 km davor / 6008,3 km danach (0,97 bzw. 1,02); Erde → Sonne 34 795,6 km gegen 34 506,8 / 35 670,5 km (1,01 bzw. 0,98); `refId 'moon'` nach 9021 ms | ja |
| 4 | Shift+A 150 ms: nach 3 s Jupiter höchstens 2 px von der Bildmitte; `targetId 'jupiter'`, `mode 'attached'`; Infopanel „Jupiter" | vorher 138,1 px rechts der Mitte; 152,3 ms gehalten; nach 3018,9 ms Schwerpunkt (1279,500 \| 646,998): 0,002 px von der Pixelmitte (1279,5 \| 647,0), 0,71 px von (1280 \| 647,5); `attached` / `jupiter`; Kopf `heading "Jupiter"` | ja |
| 5 | Kino und Maus: `cinema.running` false, `mode 'fly'`, Rate wie vor dem Kino; größter Schritt in den fünf Bildern um den Wechsel ≤ größter Flugschritt danach; Ziehen 100 px → `fly.yaw` + 100·π/600 (±1 %); Rad eine Raste nach oben → „Tempo ×1,25" | false / `fly` / 1 d/s (vorher 1, im Kino 0,4); jd 2 451 676,1388 nach 5 s; 61 478,4 km ≤ 363 428,7 km (Wechselschritt selbst 8866,9 km); Δyaw 0,5235988 (0,000 %); `role="status"` „Tempo ×1,25", nach 1544,6 ms wieder weg | ja |
| 6 | Kosten: Mittel (b) höchstens 0,5 ms über (a), kein Bildabstand über 25 ms | (a) Geheftet an der Erde, ohne Eingabe: 299 Abstände, Mittel 16,680 ms, größter 16,9 ms; (b) Flug mit gehaltenem W: 300 Abstände, Mittel 16,681 ms, größter 17,0 ms; Differenz +0,001 ms | ja |

Einzelheiten je Messung:

1. `setCamera({ mode: 'attached', targetId: 'earth', distance: 10·R })` mit Azimut −1,0622 zur
   Sonne und Elevation 0,1 (volle Tagseite), jd 2 451 563,4132. Beide Schwerpunkte liegen auf
   (1279,50 | 647,00). Das perspektivisch exakte Verhältnis tan(asin(R/dB))/tan(asin(R/dA)) =
   1,5741 trifft den Messwert; die Vorgabe mit asin weicht davon um 0,5 % ab.
2. Flug wörtlich nach Plan (`x 8R, z 2R, yaw π, pitch −asin(2/√68)`, R = 2 911 600 km), 3 s Ruhe
   bei angehaltener Uhr, dann 10 d/s und 0,5 s Anlauf; t0 bei jd 2 451 568,5842, t0 + 5 s bei jd
   2 451 618,6262. Ein Screenshot dauerte rund 135 ms (1,3 d). Gegenprobe mit `mode 'free'`,
   `distance √68·R`, Azimut 0, Elevation asin(2/√68), `freezeJd` 2 451 619,9602.
3. Uhr angehalten, jd 2 451 671,0012; Start 5 R_E vor der Erde in Richtung Mond, Blick zum Mond.
   Aufgezeichnet 590 Bilder, jedes mit neuer gezeigter Lage, mittlerer Bildabstand 16,68 ms,
   größter 19,1 ms; größter Schritt des ganzen Flugs 72 026 km (Flugmitte).
4. Uhr angehalten, jd 2 451 671,0012. Lage 20 R_J (R_J = 3 495 550 km) um Jupiter, 0,3 rad
   neben der Sonnenrichtung bei Elevation 0,15, Blick 0,1 rad an Jupiter vorbei. Nach Shift+A:
   `distance` 69 911 000 km (20 R_J), Azimut −2,60720 → −2,78185 (−10,0°), Elevation 0,15. Nach
   `setUi({ hidden: false })` zeigt `browser_snapshot` im Infopanel `heading "Jupiter" [level=2]`,
   den Datenblock und den Gymnasialtext; im Objektbaum ist „Jupiter" gedrückt.
5. Oberfläche sichtbar, Standarddarstellung, `pauseOnInput: true`, Uhr 1 d/s, Kamera vorher
   Geheftet an Jupiter. Nach 3 s Ruhe echte Taste `c`: Kino läuft (Szene an Neptun, 0,4 d/s),
   Vollbild gewährt. 5 s später (jd 2 451 676,1388) Aufzeichnung (81 Bilder), W 302,9 ms. Schritte der gezeigten Lage
   in den Bildern 17 bis 21 (Wechsel in Bild 19): 9571,8 / 9571,8 / 8866,9 / 31 523,0 /
   61 478,4 km. Relativ zu Neptun zum jd der gezeigten Lage: Kinoschritte 10 346 km,
   Wechselschritt 8947,8 km, danach wachsend bis 363 715 km. Ziehen ab (1280 | 1000) auf der
   Canvas in 10 Schritten; Rad über der Canvas, `camera.distance` blieb unverändert.
6. Oberfläche sichtbar, Standarddarstellung, Uhr 1 d/s (jd nicht notiert, zwischen 2 451 676 und
   2 451 790), Vollbild aus, Maus ruhig. Beide Fälle laufen an der Bildwiederholrate; der
   Mehraufwand des Flugs liegt unter der Auflösung dieser Messung.

## 4. Rulings

Plan-Rulings (beim Schreiben des Plans, von Jens noch nicht bestätigt):

1. Ruling: `letztePose()` ist eine Modulfunktion des Controllers statt eines Rückrufs aus
   `app/main.tsx` (Entwurf §6.1 „über Rückrufe"): `fahreZu` hat viele Aufrufer (Objektbaum,
   Verweise, Klick). `steuerungTakt` bekommt sie trotzdem als Parameter, damit die Tests eine Lage
   vorgeben können.
2. Ruling: `ELEVATION_GRENZE`, `MIN_DISTANCE_KM` und `MAX_DISTANCE_KM` ziehen von `input.ts` nach
   `flug.ts`; sonst importierten sich `input.ts` und `flug.ts` gegenseitig.
3. Ruling: Im Flug belichtet die Kamera auf den Bezugskörper statt auf das Ziel
   (`exposureTargetId`); sonst wäre ein Flug zum Saturn mit dem Ziel Sonne falsch belichtet. Der
   Entwurf sagt dazu nichts.
4. Ruling: `targetFor` bleibt bei den Umlauf- und Kinomodi; der Flug hat einen eigenen Zweig in
   `update`.
5. Ruling: Der Tempo-Hinweis zeigt den Faktor relativ zum Start (×1 = 0,5), nicht f selbst.
6. Ruling: Der Tempo-Hinweis hängt in `app/main.tsx` neben der Bedienoberfläche und bleibt
   sichtbar, wenn H sie ausblendet.
7. Ruling: Eine gehaltene Flugtaste startet den Flug auch dann, wenn sich W und S aufheben; bewegt
   wird dann nicht.
8. Ruling: Das Kamera-Panel zeigt im Flug den Abstand der gezeigten Lage zum Ziel. Auch die
   Modus-Schaltflächen (nicht nur Regler und Blickwinkel, Entwurf §4.5) beginnen aus dem Flug an
   der gezeigten Lage.
9. Ruling: Der Eintritt in den Flug lässt `freezeJd` unverändert (es wirkt nur im Modus Frei).
10. Ruling: Die Tastenbeschriftungen „W A S D", „Q E" und „Shift + W A S D" stehen als Literale in
    beiden Sprachen.
11. Ruling: Eine Radraste nach unten (`deltaY` > 0, beim Zoom „weiter weg") verlangsamt.
12. Ruling: `flugNachfuehren` schreibt den Store nur bei Bewegung, Mindesthöhe oder Bezugswechsel,
    damit keine Rundungsreste je Bild in den Store wandern.
13. Ruling: Shift ohne Körper vor der Kamera tut nichts, der Flug bleibt.
14. Ruling: Der Flugzweig des Controllers nimmt im allerersten Bild (noch keine gezeigte Lage) die
    Lage aus dem Store, damit ein Link im Flugmodus dort beginnt.
15. Ruling: Abnahme Punkt 4 misst nach 3 s statt 1 s (Entwurf §9): Bei 0,45 s Dämpfung stehen nach
    1 s noch rund 6 % des Anfangsversatzes aus.
16. Ruling: `fahre` setzt Abstand, Azimut und Elevation schon beim Start in den Store (bisher erst
    im ersten Schritt); ohne Flug sind das die bisherigen Werte.
17. Ruling: (nach dem Review von Task 4) `letztePose()` liefert `GezeigtePose` = `Pose` mit dem
    `jd` des Bildes (Entwurf §6.1). Eintritt, Ausstieg, `flugStarten`, `heftenUm` und die Fahrt aus
    dem Flug rechnen Körperlagen zu `pose.jd`; ohne das sprang die Kamera bei laufender Uhr um den
    Weg des Körpers in einem Bild (gemessen 0,5° bei 1 d/s, 27° bei 30 d/s). `flugStarten` und
    `heftenUm` verlieren dafür ihren `jd`-Parameter.

Rulings der Umsetzung (Tasks 2, 3, 7, 9 und 10; das Ruling aus dem Review von Task 4 steht oben als
Plan-Ruling 17, nicht gesondert hier):

- Ruling: (Task 2) `begrenze` in `input.ts` durch den Import aus `./flug` ersetzt, in Fixrunde 1
  (2ff404c) — der Brief verlegte nur die drei Konstanten, die Dopplung entstand durch den
  Planzuschnitt; Kosten bei Irrtum: eine Zeile.
- Ruling: (Task 3) Kein Fixlauf für den Review-Befund „`npm run build` nicht belegt": Lint, Tests
  und Build vor „fertig" gelten für den Abschluss der Etappe (Task 10, §2), die Tasks verlangen
  `tsc -b`; Kosten bei Irrtum: ein reiner Vite-Fehler fiele erst in der Abnahme auf (er trat nicht
  auf, siehe §2).
- Ruling: (Task 9) Die Animations-Startzeit in `kamerafahrt.ts` heißt `startZeit` statt `start` —
  der Ersatzblock des Plans führte ein zweites `const start` ein (Doppeldeklaration); Verhalten
  unverändert.
- Ruling: (Task 10) Umsetzer der Abnahme auf opus statt sonnet (Plan-Hinweis) — der Messaufbau im
  Browser verlangt Urteil; Kosten bei Irrtum: höhere Modellkosten.
- Ruling: (Task 7, nachgetragen bei der Nacharbeit nach der Schlussprüfung, M2) Lässt man Shift bei
  noch gehaltener Flugtaste los, fliegt die Kamera sofort weiter (Plan Task 7 legt das per Test fest
  — „kehrt beim Loslassen von Shift mit gehaltener Taste in den Flug zurück" —, ohne dass einer der
  17 Plan-Rulings dieses Verhalten nennt). Entwurf §4.2 („Lässt man Shift los, bleibt die Kamera
  geheftet, bis wieder WASD ohne Shift kommt") lässt sich auch als neuer Tastendruck lesen; offene
  Frage an Jens, siehe §6.

Rulings dieser Abnahme:

- Ruling: Für die Scheibenmessungen (Messungen 1, 2 und 4) Bahnlinien, Beschriftungen und Marker
  aus (`setDisplay`), abweichend vom Brief. Die Bahnlinie läuft durch die Scheibenmitte und hinge
  mit der Scheibe zusammen (Helligkeit > 8), Namen und Glyphen ebenso; ohne das trägt die
  Scheibenmessung nicht. Messungen 5 und 6 wieder mit Standarddarstellung.
- Ruling: Offene Aufbauwerte gewählt: Messung 1 Azimut zur Sonne und Elevation 0,1 (ganze Scheibe
  über der Schwelle); Gegenprobe von Messung 2 mit Azimut 0 und Elevation asin(2/√68), damit die
  Kamera an derselben Stelle steht wie im Flug; Messung 4 Lage 0,3 rad neben der Sonnenrichtung bei
  Elevation 0,15 und Blick +0,1 rad Gier, vorab in der Seite mit `koerperNaechstDerMitte` auf
  `jupiter` geprüft (am 6. Mai 2000 stehen Saturn und Titan aus Sonnenrichtung hinter Jupiter;
  andere Varianten wählten Io, Europa, Titan oder Saturn); Messung 5 Rate vor dem Kino 1 d/s;
  Messung 6 mit sichtbarer Oberfläche und laufender Uhr (1 d/s).
- Ruling: Messung 3 durchlief zwei Bezugswechsel (Erde → Sonne → Mond); beide sind ausgewertet,
  „der größte der drei Schritte davor und danach" jeweils getrennt und gemeinsam gerechnet.
- Ruling: Bildmitte = (1279,5 | 647,0) in Pixelindizes bei 2560×1295; der Abstand in Messung 4 steht
  zusätzlich gegen (1280 | 647,5) in der Tabelle.
- Ruling: Messung 5 misst die Schritte wie vorgegeben in Weltkoordinaten und zusätzlich relativ zu
  Neptun zum `jd` der gezeigten Lage, weil die Uhr lief und Neptun sich zwischen den Bildern bewegt.

## 5. Bekannte Unschärfen

Aus den Messungen:

- Zwischen Erde und Mond ist im Schaubild die Sonne Bezug. Die Sonne ist dort 12,17·10⁶ km groß
  dargestellt und nur 12,35 ihrer Radien von der Erde entfernt; sie gewinnt deshalb ab rund 15 R_E
  (Messung 3: gezeigte Lage beim Wechsel 14,2 R_E, die Store-Lage läuft der Dämpfung voraus), der
  Mond erst unter rund 8,9 Mondradien. Das folgt der Regel in Entwurf §3.3, hat aber Folgen bei
  laufender Uhr: Eine Probe 30 R_E vor der Erde in Richtung Mond (sofort Bezug Sonne) lag nach 2 d
  bei 1 d/s 43,5 R_E von der Erde entfernt — die Kamera bleibt im Sonnenbezug stehen, Erde und Mond
  ziehen davon. Im Maßstab Realistisch reicht der Erdbezug bis rund 1,7·10⁶ km, also über den Mond
  hinaus.
- Nach W aus dem laufenden Kino bleibt `targetId` das Ziel von vor dem Kino (Messung 5: Jupiter),
  während die Kamera an Neptun fliegt; das Infopanel zeigt dann Jupiter. Ursache ist das
  Zusammenspiel von `stopCinema` (stellt die Kamera von vor dem Start her) und Entscheidung 8 (der
  Flug lässt `targetId` stehen).
- Das mit `c` gestartete Kino fordert Vollbild an; nach W bleibt das Vollbild (bekannt seit 4c-4:
  „Vollbild bleibt nach `stopCinema`").
- Messung 6 liegt an der Bildwiederholrate: Solange ein Bild in die Bildzeit von 16,7 ms passt,
  zeigt der rAF-Zähler keinen Mehraufwand; die Rechenzeit je Bild selbst ist nicht gemessen.

Aus den Reviews der Tasks (zurückgestellt):

- Tests: `hoehe`, `fluggeschwindigkeit` und `mindesthoehe` nur mit einem Körper getestet (Task 2);
  Blickführung im Flug und `FLUG_DAEMPFUNG_S` ungetestet, Ausstieg bei laufender Uhr nur für
  Geheftet getestet, nicht für Frei mit `freezeJd` (Task 4); Wirkung des Tempofaktors auf den Flug
  (`tempoAendern(2)`) und der Rückfall `?? 'sun'` in `flugStarten` ungetestet (Task 6); kein Test
  für Shift aus Frei und für ein aktives Kino ohne gefundenen Körper (Task 7); kein Test für das
  Verlängern der Tempo-Einblendung bei erneuter Radbewegung (Task 8); die Tests der Fahrt aus dem
  Flug setzen `pose.jd = time.jd`, ein abweichendes `pose.jd` ist ungetestet (Task 9).
- `letztePose()` gibt das interne Objekt heraus; `Readonly<GezeigtePose>` würde es absichern
  (Task 4).

Aus der Schlussprüfung (zurückgestellt, M4 und M5):

- M4: Der Abstand im Kamera-Panel veraltet im ruhenden Flug bei laufender Uhr, wenn `targetId` vom
  Bezug abweicht (`CameraPanel.tsx`: `anzeigeAbstand` liest `letztePose()` nur beim Rendern, das
  Panel rendert nur bei Änderungen von `camera`, und `flugNachfuehren` schreibt `camera` ohne
  Bewegung/Bezugswechsel nicht, Ruling 12). Text und Regler zeigen dann einen stehenden Wert, der
  Wert ist zudem stets ein Bild alt. Beheben: im Flug mit dem Takt von `useLiveJd` (250 ms) neu
  rendern, oder so belassen.
- M5: Blickdämpfung über die Sehne (`controller.ts:169`): Gedämpft wird der Blickvektor
  komponentenweise und danach normiert. Bei großen Blicksprüngen (Ansicht oder Link im Flugmodus
  laden, `stopCinema` stellt einen Flug wieder her) läuft der Zwischenvektor nahe am Ursprung
  vorbei, die Drehung wird ungleichförmig; bei genau entgegengesetzter Richtung entsteht der
  Nullvektor (kein NaN, aber `letztePose().blick` ist dann 0). Mit Maus und Tastatur praktisch
  unerreichbar. Beheben (niedrige Priorität): yaw/pitch mit Umwicklung dämpfen oder sphärisch
  interpolieren.
- Vorbestehend: Ein Moduswechsel bei gleichem Ziel (etwa Folgen → Geheftet durch Shift) lässt die
  Kamera ein Bild im Raum stehen und 0,45 s nachholen (Schlüsselwechsel im Controller rechnet den
  Versatz mit dem Anker des Vorbilds); bei 30 d/s sichtbar (Task 4).
- Tastatur: `shift` wird auch bei Ereignissen aus Eingabefeldern gesetzt (folgenlos); `stand()`
  liefert dieselbe veränderliche Menge statt einer Momentaufnahme (Task 5).
- Grenzen: Die 10¹³-km-Grenze greift nur beim Schreiben; ein Link mit Betrag bis √3·10¹³ km
  bleibt ohne Eingabe außerhalb. `tempoAendern` nimmt NaN an (`begrenze` reicht es durch). Bei
  Tempo nahe 20 und einem Bildaussetzer über 50 ms kann ein Schritt durch einen Körper führen
  (Task 6).
- Der Kommentar zu `drehen` („geschieht nichts") ist ungenau: Ein aktives Kino endet auch ohne
  gefundenen Körper. Zwei Zeilen `stopCinema`/`fahrtAbbrechen` stehen doppelt in `flugStarten` und
  `drehen` (Task 7).
- Die Sichtprobe von Task 6 hatte keinen sauberen Vorher-Wert in derselben Ladung; Messung 1 dieser
  Abnahme ersetzt sie.

## 6. Fragen an Jens

1. **(I1, Entwurffrage, geschärft)** Bezugsmaß im Schaubild (§5, erster Punkt): Die Sonne wird
   zwischen Erde und Mond zum Bezug, weil q = |p − p_K| / R_K im Schaubild die Sonne begünstigt (sie
   gewinnt ab rund 15 R_E, der Mond erst unter rund 8,9 Mondradien). Vorschlag der Schlussprüfung:
   Bezug hierarchisch wählen — liegt die Kamera im dargestellten System eines Planeten, konkurriert
   die Sonne nicht; als Systemgrenze ein mit `sizeScale` skalierter Hill-Radius (passt zur Kopplung
   der Mondbahnen an `sizeScale` in `sim/scale.ts`) oder ein Vielfaches der äußersten sichtbaren
   Mondbahn. Alternative: so lassen und in Kürzelübersicht/Doku erwähnen. Vor dem Plan der Etappe 2
   zu entscheiden, die mit derselben Regel fliegt.
2. **(Task-10-Bedenken 2, geschärft)** Ziel nach dem Wechsel vom Kino in den Flug (§5, zweiter
   Punkt): `stopCinema` stellt `targetId` von vor dem Kino her, der Flug lässt es stehen
   (Entscheidung 8) — mit Shift wird dagegen der Körper in der Bildmitte Ziel. Nach W bleibt so das
   Infopanel auf einem Körper stehen, den die Kamera gar nicht ansteuert. Vorschlag: Beim Flugstart
   aus dem Kino `targetId` auf `lookAtId ?? targetId` der laufenden Szene setzen.
3. **(M2)** Lässt man Shift bei noch gehaltener Flugtaste los, fliegt die Kamera heute sofort weiter
   (Ruling in §4 nachgetragen). Soll das stattdessen einen neuen Tastendruck brauchen (dann müsste
   `tastatur.ts` die unter Shift gedrückten Tasten gesondert merken und erst nach ihrem `keyup` für
   den Flug freigeben)?
4. **(M6)** Große Übergänge in den Flug (Wiederherstellung eines Flugs durch `stopCinema`, geladene
   Ansicht im Flugmodus) laufen mit der Flugdämpfung 0,15 s statt der 0,45 s der Umlaufmodi — über
   Systemweiten wirkt das wie ein Sprung. Sollen solche Wiederherstellungen mit 0,45 s dämpfen?
5. **(M7)** „Körper nächst der Bildmitte" wählt heute nach Winkel zur Achse, sobald keine Scheibe
   getroffen wird; das bevorzugt kleine oder ferne Körper knapp neben der Mitte vor einer großen
   Scheibe etwas weiter daneben (Abnahme Messung 4: Varianten wählten Io, Europa, Titan oder Saturn
   statt Jupiter). Vorschlag: Winkel minus Winkelradius (Abstand zum Scheibenrand) als Maß.
6. Bestätigung der 17 Plan-Rulings, der fünf Rulings der Umsetzung (Tasks 2, 3, 7, 9, 10; der
   Ruling zu Task 7 ist der M2-Nachtrag) und der fünf Rulings dieser Abnahme (§4).
7. Freigabe für den Plan der Etappe 2 (Controller und Fadenkreuz) nach dieser Abnahme und nach den
   Antworten auf 1–5, da Etappe 2 auf demselben Bezugsmaß und derselben Blickführung aufbaut.

## 7. Nacharbeit nach der Schlussprüfung

Urteil der Schlussprüfung (54e90db..e55aa0f, Ready to merge: Yes): 0 Critical, 1 Important (I1, eine
Entwurfsfrage, keine Abweichung der Umsetzung vom Entwurf), 9 Minor (M1–M9).

Behoben (Commit `6a16cbb` „Flug: Nacharbeit nach der Schlussprüfung"):

- **A1 (M1):** Shift mit gehaltener Flugtaste, aber ohne getroffenen Körper, setzte im Flug
  Bezugswahl und Mindesthöhe aus. `steuerungTakt` ruft nach `drehen` jetzt zusätzlich
  `flugNachfuehren(jd, dt, null)`, wenn der Modus weiterhin `fly` ist; der `drehen`-Kommentar nennt
  jetzt auch das beendete Kino ohne getroffenen Körper.
- **A2 (M3):** Auf Colemak, Neo 2 und Bépo lösten Flugtasten (nach `e.code`) zugleich ein Kürzel
  (nach `e.key`) aus, weil der Kürzel-Listener vor dem Flug-Listener registriert wurde und beide in
  der Bubble-Phase liefen. Der Flug-`keydown` in `tastatur.ts` läuft jetzt in der Einfangphase
  (`{ capture: true }`); auf QWERTZ/QWERTY/AZERTY ändert sich nichts, und geprüft wurde, dass keine
  andere Stelle (Ruhewächter, Kamerafahrt-Abbruch) `defaultPrevented` auswertet.
- **A3 (M8):** Der Kürzeltext zu Shift+WASD nennt jetzt auch W/S („näher und weiter") in beiden
  Sprachen.
- **A4 (M9):** Die Tempo-Einblendung (`role="status"`) bleibt jetzt stets eingehängt und ist ohne
  Text ohne Fläche, Rahmen oder Hintergrund (im Browser belegt: 0×0 px, `background rgba(0,0,0,0)`,
  `border 0px`, `pointer-events: none`).
- **A5 (Ledger-Minor Task 6):** `tempoAendern` verwirft jetzt NaN und ±Infinity, das Tempo bleibt
  unverändert.

Als Frage oder Unschärfe offen (Code unverändert, siehe §5/§6): I1 (Bezugsmaß im Schaubild), M2
(Shift loslassen, jetzt als Ruling in §4 nachgetragen), M4 (Panel-Abstand veraltet im ruhenden
Flug), M5 (Blickdämpfung über die Sehne), M6 (Dämpfung bei Wiederherstellung), M7 (Maß „nächst der
Bildmitte"), Task-10-Bedenken 2 (Ziel nach W aus dem Kino, geschärft).

Testzahl: 3766 → 3769 (+1 Test zu A1, +1 Test zu A2, +1 Test zu A5; A4 ersetzt den bestehenden
`TempoHinweis`-Test 1:1 (weiterhin ein Test, neuer Ablauf), A3 ist ein reiner Textwechsel ohne
eigenen Test).

Prüfläufe nach der Nacharbeit: `npm test` → Test Files 98 passed (98), Tests 3769 passed (3769),
Dauer 13,62 s. `npx tsc -b` → keine Ausgabe (fehlerfrei). `npm run lint` → `eslint .` ohne Befund.
`npm run build` → `✓ built in 653ms`, Hauptchunk `index-CTXzbhtW.js` 1 291,02 kB (gzip 346,93 kB),
nur der bekannte Chunkgrößen-Hinweis.
