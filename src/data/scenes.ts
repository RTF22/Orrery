/**
 * Wie sich die Kamera während einer Szene bewegt.
 *
 * - `static` — feste Kugelkoordinate relativ zum Standortkörper
 * - `orbit`  — dieselbe Kugelkoordinate, der Azimut läuft mit
 * - `flyby`  — geradliniger Vorbeiflug seitlich am Körper
 * - `chase`  — hinter dem Körper, ausgerichtet an seinem Geschwindigkeitsvektor
 * - `system` — Draufsicht auf das ganze System, Azimut läuft langsam mit
 * - `sichtlinie` — auf der Linie vom Blickziel (`lookAtId`) zum
 *   Standortkörper, davor stehend und auf den STANDORTKÖRPER blickend;
 *   `lookAtId` bestimmt hier also nur die Linie, nicht das Blickziel
 *   (Entwurf `2026-09-13-schatten-design.md` §4). `azimuthDeg` und
 *   `elevationDeg` sind Versätze auf die Kugelkoordinaten dieser Linie.
 */
export type ScenePath = 'static' | 'orbit' | 'flyby' | 'chase' | 'system' | 'sichtlinie';

/**
 * Bezugsgröße für `distanceInRadii`. `bodyRadius` ist der dargestellte
 * Radius des Standortkörpers, `systemRadius` der dargestellte Abstand des
 * äußersten Planeten. Ohne diese Unterscheidung wäre die Systemschau vom
 * Maßstabs-Preset abhängig: Sonnenradius zu Neptunbahn steht bei
 * „Schaubild" wie 1:94, bei „Realistisch" wie 1:6500.
 */
export type DistanceBasis = 'bodyRadius' | 'systemRadius';

export interface Scene {
  id: string;
  /** Schlüssel in ui/i18n/de.ts — niemals ein fertiger Text. */
  titleKey: string;
  /** Körper, an dem die Kamera hängt. */
  targetId: string;
  /** Körper, den die Kamera ansieht; fehlt er, ist es der Standortkörper. */
  lookAtId?: string;
  path: ScenePath;
  distanceBasis: DistanceBasis;
  params: {
    distanceInRadii: number;
    elevationDeg: number;
    azimuthDeg: number;
    azimuthRateDegPerSec: number;
  };
  durationSec: number;
  timeRateDaysPerSec: number;
  /**
   * Verlangt beim Beginn dieser Szene (Wechsel oder Kinostart auf ihr) einen
   * Zeitsprung: `tickCinema` (app/cinema.ts) sucht dann mit
   * `naechsteMondfinsternis` (sim/finsternis.ts)
   * die nächste Mondfinsternis ab der aktuellen Zeit und stellt `time.jd`
   * kurz vor deren Eintritt. Der Sprung bleibt nach der Szene bestehen — die
   * Zeit ist im Kino die des Kinos (Entwurf §4). Findet die Suche nichts,
   * läuft die Szene ohne Sprung.
   */
  zeitpunkt?: 'naechste-mondfinsternis';
  /**
   * Streuung je Abspielen: Azimut und Elevation additiv in Grad, Abstand
   * multiplikativ als Faktor. Ein Bereich `[0, 0]` schaltet die Variation
   * für dieses Feld ab.
   */
  variation: {
    azimuthDeg: readonly [number, number];
    elevationDeg: readonly [number, number];
    distanceFactor: readonly [number, number];
  };
}

/**
 * Phase 3a (Task 16) erweitert den Katalog auf 18 Szenen: Die ersten sieben
 * stammen aus Phase 1 (Sonne, acht Planeten, Erdmond); die elf neuen nutzen
 * Monde und Zwergplaneten aus dem inzwischen vollständigen Körperkatalog
 * (Sonne, acht Planeten, 20 Monde, fünf Zwergplaneten — 35 Körper, siehe
 * data/index.ts). Alles bleibt reine Daten — Director und Szenen-Engine
 * (render/camera/cinema.ts) sind unverändert.
 *
 * Phase 3b-2 (Task 6) legt die 19. Szene dazu: `mondfinsternis`, die einzige
 * Szene mit Bahntyp `sichtlinie` und mit `zeitpunkt` — sie springt auf die
 * nächste echte Mondfinsternis.
 */
export const SCENES: readonly Scene[] = [
  {
    // Tief über dem Erdrand, langsam am Terminator entlang: Die Sonne
    // schiebt sich im Streiflicht über die Kante.
    id: 'erdaufgang',
    titleKey: 'scene.erdaufgang',
    targetId: 'earth',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 2.4, elevationDeg: 6, azimuthDeg: 0, azimuthRateDegPerSec: 1.2 },
    durationSec: 40,
    timeRateDaysPerSec: 0.02,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-4, 10], distanceFactor: [0.9, 1.3],
    },
  },
  {
    // Flacher Einfallswinkel — mit den Ringen aus Phase 3 wird daraus das
    // Streiflicht des Entwurfs; bis dahin trägt die Szene der Planet allein.
    id: 'saturn-streiflicht',
    titleKey: 'scene.saturn',
    targetId: 'saturn',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 5, elevationDeg: 4, azimuthDeg: 40, azimuthRateDegPerSec: 0.8 },
    durationSec: 35,
    timeRateDaysPerSec: 0.1,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-3, 12], distanceFactor: [0.85, 1.4],
    },
  },
  {
    // Draufsicht auf das Erde-Mond-System im Zeitraffer: Der Mond zieht in
    // gut einer halben Minute einmal herum (27,3 Tage bei 0,9 Tagen je Sekunde).
    id: 'mondtanz',
    titleKey: 'scene.mondtanz',
    targetId: 'earth',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 150, elevationDeg: 55, azimuthDeg: 0, azimuthRateDegPerSec: 0.5 },
    durationSec: 45,
    timeRateDaysPerSec: 0.9,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-25, 30], distanceFactor: [0.8, 1.2],
    },
  },
  {
    // Standort Neptun, Blick zurück zur Sonne: Sie ist von dort nur noch
    // ein sehr heller Stern.
    // Hinter Neptun, Blick auf ihn zurück zur fernen Sonne: Bahntyp
    // sichtlinie mit rund 180° Azimutversatz stellt die Kamera auf die
    // sonnenabgewandte Seite; der Restversatz von 12° bis 20° setzt die Sonne
    // neben die Neptunscheibe, sodass beide im Bild stehen und Neptun von
    // hinten als schmale Sichel beleuchtet ist. Die Elevation addiert
    // sichtlinie auf die Elevation der Sonnenrichtung statt auf deren
    // Gegenwert; bei Neptuns Bahnneigung von 1,77° verschiebt das den
    // Versatz um höchstens rund 3,6° (Test in camera/cinema.test.ts).
    id: 'ferne-sonne',
    titleKey: 'scene.ferneSonne',
    targetId: 'neptune',
    lookAtId: 'sun',
    path: 'sichtlinie',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 14, elevationDeg: 0, azimuthDeg: 196, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 0.5,
    variation: {
      azimuthDeg: [-4, 4], elevationDeg: [-3, 3], distanceFactor: [0.9, 1.5],
    },
  },
  {
    // Das ganze System von oben über gut ein Jahrzehnt: 30 Tage je Sekunde
    // mal 60 Sekunden sind knapp fünf Jahre; mit der Variation reicht es
    // für einen halben Jupiterumlauf.
    id: 'systemblick',
    titleKey: 'scene.systemblick',
    targetId: 'sun',
    path: 'system',
    distanceBasis: 'systemRadius',
    params: { distanceInRadii: 1.6, elevationDeg: 78, azimuthDeg: 0, azimuthRateDegPerSec: 0.9 },
    durationSec: 60,
    timeRateDaysPerSec: 30,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-25, 10], distanceFactor: [0.85, 1.25],
    },
  },
  {
    // Merkur ist der schnellste Körper im Katalog — die Verfolgung zeigt
    // die Bahnbewegung deutlicher als bei jedem anderen Planeten.
    id: 'merkurjagd',
    titleKey: 'scene.merkurjagd',
    targetId: 'mercury',
    path: 'chase',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 9, elevationDeg: 10, azimuthDeg: 0, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 2,
    variation: {
      azimuthDeg: [0, 0], elevationDeg: [-5, 20], distanceFactor: [0.8, 1.6],
    },
  },
  {
    // Geradliniger Vorbeiflug: Der Körper wächst heran, zieht seitlich
    // vorbei und schrumpft wieder — die einzige Szene mit echter Fahrt
    // statt Drehung.
    id: 'jupiter-vorbeiflug',
    titleKey: 'scene.jupiterVorbeiflug',
    targetId: 'jupiter',
    path: 'flyby',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 4, elevationDeg: 12, azimuthDeg: 200, azimuthRateDegPerSec: 0 },
    durationSec: 35,
    timeRateDaysPerSec: 0.3,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-15, 25], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Jupiter aus 55 Jupiterradien und steiler Aufsicht (55°): Bei dieser
    // Distanz passt Ganymeds Bahn (rund 15,3 Jupiterradien, 1 070 400 km /
    // 69 911 km) sicher ins Bild, Ios (6,0) und Europas (9,6) ohnehin; nur
    // Kallistos Bahn (26,9 Radien) reicht am unteren Rand der Abstands-
    // Variation gelegentlich über den Bildrand hinaus — für die eigentliche
    // 1:2:4-Resonanz (Io:Europa:Ganymed) unerheblich, siehe Sichtprüfung im
    // Bericht. 45 s bei 0,5 Tagen/s zeigen 22,5 simulierte Tage: gut zwölf
    // Io-, sechs Europa- und gut drei Ganymed-Umläufe (Perioden 1,769138 /
    // 3,551181 / 7,154553 Tage, jupiter-monde.ts) — das 4:2:1-Verhältnis
    // wird als wiederkehrendes Muster sichtbar.
    id: 'galileisches-schattenspiel',
    titleKey: 'scene.galileischesSchattenspiel',
    targetId: 'jupiter',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 55, elevationDeg: 55, azimuthDeg: 0, azimuthRateDegPerSec: 1 },
    durationSec: 45,
    timeRateDaysPerSec: 0.5,
    // Elevation additiv (siehe Scene.variation oben): Basiswert 55° plus
    // Versatz [-10, 10] ergibt den beabsichtigten absoluten Bereich 45–65°.
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Kamera nur vier Phobosradien (44 km) hinter dem Mond, dessen
    // Geschwindigkeitsvektor sie folgt, Blick auf Mars: Phobos umkreist
    // Mars in nur 9375 km Abstand — die Kamera steht also rund 5986 km
    // über der Marsoberfläche (9375 km − 3389,5 km Marsradius) —, wodurch
    // Mars den Großteil des Bildes füllt (halber Öffnungswinkel rund 20°,
    // per Geometrie-Stichprobe nachgerechnet, siehe Bericht). BEFUND: Phobos
    // selbst liegt bei chase-Kameras praktisch immer AUSSERHALB des
    // Bildwinkels, nicht knapp davor — der Bahnrichtungsvektor, dem die
    // Kamera folgt, steht fast senkrecht auf der Blickrichtung zu Mars
    // (tangential vs. radial), unabhängig von der Bahnphase. Die Szene ist
    // deshalb ein Blick MIT Phobos auf Mars (dessen Bahnbewegung den
    // Kameraweg treibt), kein Blick AUF Phobos — passend zu „mitlaufend"
    // im Szenennamen. distanceInRadii * distanceFactor bleibt mit
    // höchstens 6 (4 * 1,5) klar unter dem Zehnfachen des Phobosradius.
    id: 'phobos-tiefflug',
    titleKey: 'scene.phobosTiefflug',
    targetId: 'phobos',
    lookAtId: 'mars',
    path: 'chase',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 4, elevationDeg: 8, azimuthDeg: 0, azimuthRateDegPerSec: 0 },
    durationSec: 25,
    timeRateDaysPerSec: 0.05,
    variation: {
      azimuthDeg: [0, 0], elevationDeg: [0, 20], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // 55 Plutoradien (rund 65 400 km) halten Charon (a = 19 596 km, das
    // 16,5-fache des Plutoradius) selbst am unteren Rand der Abstands-
    // Variation (Faktor 0,8 → 44 effektive Radien, halbe Bildhöhe dort
    // rund 24 400 km) sicher im Bild.
    // BEFUND: Das Modell führt Charon vereinfachend um Plutos Mittelpunkt
    // statt um den gemeinsamen, rund 2126 km von Pluto entfernten
    // Schwerpunkt (siehe Quellenblock „BARYZENTRUM AUSSERHALB PLUTOS" in
    // pluto-system.ts) — die Szene zeigt deshalb Charons Umlauf um das
    // ruhende Pluto, nicht den Tanz beider Körper um ein gemeinsames
    // Baryzentrum, wie der Szenenname es nahelegt. Der Bestand (Architektur
    // „Mond umkreist Mutterkörper", dokumentiert und bewusst so gewählt)
    // gilt; die Szene zeigt das bestmögliche Bild des Paars innerhalb
    // dieses Modells.
    id: 'pluto-charon',
    titleKey: 'scene.plutoCharon',
    targetId: 'pluto',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 55, elevationDeg: 20, azimuthDeg: 70.5, azimuthRateDegPerSec: 1.5 },
    durationSec: 45,
    timeRateDaysPerSec: 0.3,
    // Elevation additiv: Basiswert 20° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 10–30°.
    //
    // Azimut auf die Sonnenrichtung (Nachbesserung nach der Abnahme, siehe
    // docs/phase3a-abnahme.md, „Offene Punkte"): Mit Azimut 0° und Variation
    // 0–360° zeigte die Szene das Paar in beiden geprüften Ziehungen nahezu
    // unbeleuchtet — Pluto als Sichel mit höchstens 30 von 255, in der
    // zweiten Ziehung als schwarze Scheibe vor der Sonne. Dieselbe Herleitung
    // wie bei enceladus-hell und triton-rueckwaerts: Richtung Pluto→Sonne zur
    // Epoche J2000 aus Plutos Bahnelementen über positionAt (heliozentrisch
    // x=−1 479 738 352, y=−4 177 504 519, z=875 270 168 km, 30,20 AE) —
    // −plutoPos normiert ergibt Azimut 70,495°, Elevation −11,17°. Charon
    // steht nur 19 596 km daneben, die Parallaxe zur Sonne ist mit
    // arctan(19 596 / 4 517 000 000) ≈ 0,0002° belanglos. Bei Elevation
    // 10–30° und Sonnenelevation −11° liegt der Phasenwinkel zwischen rund
    // 21° und 41° zuzüglich der Azimutstreuung: eine deutlich beleuchtete,
    // leicht angeschnittene Scheibe statt einer Sichel. scenes.test.ts
    // rechnet den Azimut aus denselben Bahnelementen nach, statt die Zahl
    // nur zu wiederholen.
    variation: {
      azimuthDeg: [-20, 20], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // BEFUND, korrigiert nach Sichtprüfung: Elevation 0° liegt in der
    // EKLIPTIKebene, nicht automatisch in Saturns Ringebene — aufKugel()
    // in render/camera/cinema.ts misst Azimut und Elevation rein
    // ekliptikal, ohne den Zielkörper-Pol zu berücksichtigen. Saturns Pol
    // (RA 40,589°/Dek 83,537°) steht laut poleVector() aus sim/frames.ts um
    // 28,05° gegen die Ekliptiknormale geneigt — eine erste Fassung mit
    // Azimut 0° zeigte die Ringe deshalb schräg statt als Kante (sichtbar
    // im ersten Kino-Durchlauf, siehe Bericht). Elevation 0° liegt nur an
    // den beiden Knotenazimuten der Ringebene mit der Ekliptik tatsächlich
    // in der Ringebene; nachgerechnet aus Saturns Pol: 169,53° und 349,53°.
    // Azimut fest auf 169,53° (Variation deshalb bewusst [0, 0], anders als
    // sonst im Katalog — jede Abweichung kippt die Kante wieder schräg).
    // Ringe (Innenkante 74 658 km, Außenkante 136 780 km, saturn.ts)
    // verjüngen sich bei dieser Ausrichtung zur Linie. 8 Saturnradien
    // (466 000 km) halten die Außenkante (2,35 Saturnradien) selbst bei
    // Faktor 0,8 der Abstands-Variation (6,4 effektive Radien, rund 20°
    // Öffnungswinkel) innerhalb der Bildhälfte (Kamera-FOV 50°, renderer.ts).
    id: 'saturn-ringkante',
    titleKey: 'scene.saturnRingkante',
    targetId: 'saturn',
    path: 'static',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 8, elevationDeg: 0, azimuthDeg: 169.53, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 0.2,
    variation: {
      azimuthDeg: [0, 0], elevationDeg: [-1.5, 1.5], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Radius 2 Saturnradien liegt mitten im Ringband (1,28 bis 2,35
    // Radien) — der Vorbeiflug kreuzt den Ring tatsächlich, statt nur an
    // ihm vorbeizuziehen. Azimut 169,53° ist derselbe Ringebenen-Knoten wie
    // bei saturn-ringkante (siehe Befund dort); Elevation 4° hält die
    // Kamera dort knapp über der tatsächlichen Ringebene. Die seitliche
    // Vorbeiflug-Bewegung selbst läuft in cinema.ts rein ekliptikal (quer
    // mit z = 0), driftet über die 4 Radien Weg also zunehmend aus der um
    // 28° geneigten Ringebene heraus — am Ring bleibt sie nur nahe der
    // Bildmitte der Szene wirklich nah dran. Das Ringmaterial zeigt seine
    // Vorwärtsstreuung (Ringe leuchten im Gegenlicht auf) dabei, sobald
    // Sonne, Ring und Kamera näherungsweise fluchten.
    // KORRIGIERT (Nachbesserung): variation.azimuthDeg stand hier weiterhin
    // auf [0, 360] — der Director addiert die Variation additiv auf den
    // Basiswert (plannedSceneAt in sim/director.ts), wodurch die sorgfältig
    // berechneten 169,53° bei jedem Abspielen von einem gleichverteilten
    // Zufallswert über den vollen Kreis überschrieben wurden. Der Ring
    // kreuzte die Kamera dadurch nur noch zufällig, nicht mehr planmäßig.
    // Wie bei saturn-ringkante jetzt [0, 0]: Die Vorbeiflug-Bewegung selbst
    // (quer zur Blickachse, s. o.) liefert bereits genug Bildbewegung, eine
    // zusätzliche Azimut-Streuung ist für diese Szene nicht nötig.
    id: 'ringdurchflug',
    titleKey: 'scene.ringdurchflug',
    targetId: 'saturn',
    path: 'flyby',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 2, elevationDeg: 4, azimuthDeg: 169.53, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 0.05,
    variation: {
      azimuthDeg: [0, 0], elevationDeg: [-3, 15], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // BEFUND, per Geometrie-Stichprobe widerlegt (siehe Bericht): Ein
    // lookAt auf Saturn zeigt NICHT zuverlässig Titan im Vordergrund. Der
    // Kameraversatz (7 Titanradien, rund 18 000 km) ist zwar gegen Titans
    // Abstand von Saturn (1 221 935 km, saturn-monde.ts) winzig, aber die
    // Blickrichtung zu Saturn hängt davon nur in ihrer RICHTUNG ab (rund
    // 0,8° Abweichung) — die Blickrichtung zu TITAN dagegen ist schlicht
    // die Gegenrichtung des frei gewählten Azimut/Elevation-Versatzes,
    // unabhängig von Titans Bahnposition. Beide Richtungen fallen nur bei
    // zufällig passender Bahnphase zusammen; nachgerechnet lag Titan bei
    // J2000 141,8° neben der Blickachse, also klar außerhalb der 25°-
    // Bildhälfte. Kamera blickt deshalb auf Titan selbst (kein lookAt) —
    // das zeigt den Mond zuverlässig. Azimut läuft mit 11°/s fast einmal
    // ganz herum (35 s * 11°/s ≈ 385°), damit Saturn während der Szene mit
    // guter Chance wenigstens einmal durchs Bild zieht — garantiert ist das
    // nicht, siehe Sichtprüfung im Bericht.
    id: 'titan-dunst',
    titleKey: 'scene.titanDunst',
    targetId: 'titan',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 7, elevationDeg: 15, azimuthDeg: 0, azimuthRateDegPerSec: 11 },
    durationSec: 35,
    timeRateDaysPerSec: 0.3,
    // Elevation additiv: Basiswert 15° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 5–25°.
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Reiner Nahflug um den Mond selbst, kein lookAt nötig: Enceladus hat
    // mit Albedo rund 0,99 den höchsten Rückstrahlwert des Sonnensystems
    // (Frost aus dem Südpol-Geysir, saturn-monde.ts) — dafür muss aber die
    // beleuchtete Seite auch im Bild sein.
    // KORRIGIERT (Nachbesserung): Die frühere Begründung, Beleuchtung sei
    // über Szenenfelder nicht steuerbar, ist falsch — azimuthDeg IST der
    // Hebel (aufKugel() in render/camera/cinema.ts platziert die Kamera rein
    // ekliptikal um den Standortkörper; welche Seite dabei zur Kamera zeigt,
    // hängt an genau diesem Winkel). Enceladus umkreist Saturn in nur
    // 238 420 km (a, saturn-monde.ts), Saturn selbst steht rund 9,17 AE
    // (1 372 159 849 km) von der Sonne entfernt (nachgerechnet aus Saturns
    // Bahnelementen zur Epoche J2000 über sim/orbit.ts' positionInParentFrame:
    // heliozentrisch x=959 638 100, y=979 217 915, z=−55 223 571 km) — die
    // Parallaxe zwischen "Richtung Saturn→Sonne" und "Richtung Enceladus→
    // Sonne" beträgt arctan(238 420 / 1 372 159 849) ≈ 0,01°, über die
    // 30 Sekunden Szenendauer zudem praktisch konstant. Die Richtung
    // Saturn→Sonne taugt also als Enceladus→Sonne-Näherung: Aus
    // −saturnPos normiert folgen Azimut 225,58° und Elevation 2,31°
    // (ekliptikal, atan2/asin). Azimut fest auf diesen Wert, Elevation nah
    // an den 2,31° (Basis 10°, siehe Variation) — mit enger Streuung bleibt
    // die Kamera auf der sonnenzugewandten Seite, statt wie zuvor mit
    // variation.azimuthDeg: [0, 360] bei etwa der Hälfte der Ziehungen auf
    // die dunkle Seite zu geraten.
    // BEFUND (Sichtprüfung, außerhalb dieser Korrektur): Die geometrische
    // Ausrichtung stimmt jetzt nachweislich — bei az=0/90/180/225,58/45,58°
    // zeigt Enceladus dieselbe insgesamt gedämpfte Helligkeit, ohne die für
    // eine falsche Hemisphäre typische scharfe Hell-Dunkel-Kante; dieselbe
    // Dämpfung zeigt auch das unveränderte titan-dunst. Die Ursache liegt
    // deshalb nicht am Azimut, sondern an der Beleuchtungsrechnung/den
    // Texturen von Saturnmonden selbst — außerhalb der Reichweite einer
    // Szenendaten-Korrektur und in render/lighting.ts, das dieser Auftrag
    // ausdrücklich nicht anfassen soll. Gemeldet, nicht behoben.
    id: 'enceladus-hell',
    titleKey: 'scene.enceladusHell',
    targetId: 'enceladus',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 5, elevationDeg: 10, azimuthDeg: 225.58, azimuthRateDegPerSec: 1.5 },
    durationSec: 30,
    timeRateDaysPerSec: 0.05,
    // Elevation additiv: Basiswert 10° plus Versatz [-8, 8] ergibt den
    // beabsichtigten absoluten Bereich 2–18°, nah an der berechneten
    // Sonnenelevation (2,31°) — die beleuchtete Seite bleibt so im Bild.
    variation: {
      azimuthDeg: [-20, 20], elevationDeg: [-8, 8], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // NEU AUFGEBAUT (Nachbesserung, ersetzt die vorige mondzentrierte
    // Fassung): Bei 8 Tritonradien Abstand steht der Mond praktisch still
    // im Bild — Rückläufigkeit ist eine BAHN-Eigenschaft und wird nur
    // planetenzentriert sichtbar, wie schon bei galileisches-schattenspiel.
    // Die Szene zielt deshalb jetzt auf Neptun selbst (kein lookAt), Tritons
    // Bahnlinie zeichnet render/orbits.ts automatisch um Neptun; der Mond
    // trägt bei dieser Kameraentfernung kein Label mehr (8-px-Schwelle),
    // was hier hinnehmbar ist — das Motiv ist die Bahn, nicht die Nahsicht.
    //
    // Abstand: Tritons a = 354 766 km / Neptunradius 24 622 km = 14,41
    // Neptunradien. distanceInRadii 45 hält bei distanceFactor 0,8 (engste
    // Ziehung) die Halbbildbreite (45 * 0,8 * 24 622 km * tan 25° ≈
    // 413 000 km, Kamera-FOV 50°, halber Öffnungswinkel 25°, wie bei
    // galileisches-schattenspiel) über Tritons Bahnradius (354 766 km,
    // rund 16 % Marge) — die volle Bahn passt ins Bild.
    //
    // Zeitraffer: 35 s * 0,4 Tage/s = 14 simulierte Tage; Tritons Umlauf
    // dauert 5,877 Tage (neptun-monde.ts) — rund 2,4 volle, sichtbar
    // rückläufige Umläufe.
    //
    // Beleuchtung (derselbe Fehler wie bei enceladus-hell, hier milder, weil
    // Neptun bei 35 Radien-Vielfachen ohnehin nur eine Scheibe im Bild ist,
    // aber ebenso ungeprüft): Richtung Neptun→Sonne zur Epoche J2000, aus
    // Neptuns Bahnelementen über positionInParentFrame nachgerechnet
    // (heliozentrisch x=2 513 956 734, y=−3 738 856 178, z=19 059 249 km) —
    // −neptunePos normiert ergibt Azimut 123,92°, Elevation −0,24°. Neptun-
    // Triton-Abstand (354 766 km) gegen Neptun-Sonne-Abstand (30,12 AE =
    // 4 505 484 129 km) ergibt eine Parallaxe von arctan(354 766 /
    // 4 505 484 129) ≈ 0,0045° — die Neptun-Sonnen-Richtung gilt praktisch
    // unverändert auch für Triton. Azimut fest auf 123,92° mit enger
    // Streuung, statt wie zuvor mit variation.azimuthDeg: [0, 360] bei etwa
    // der Hälfte der Ziehungen die unbeleuchtete Seite zu zeigen.
    id: 'triton-rueckwaerts',
    titleKey: 'scene.tritonRueckwaerts',
    targetId: 'neptune',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 45, elevationDeg: 45, azimuthDeg: 123.92, azimuthRateDegPerSec: 1 },
    durationSec: 35,
    timeRateDaysPerSec: 0.4,
    // Elevation additiv: Basiswert 45° plus Versatz [-15, 15] ergibt den
    // beabsichtigten absoluten Bereich 30–60° — schräg genug, um die stark
    // geneigte (i = 156,83° gegen Neptuns Äquator) Bahnellipse als Ellipse
    // statt als Linie zu zeigen.
    variation: {
      azimuthDeg: [-20, 20], elevationDeg: [-15, 15], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // NEU AUFGEBAUT (Nachbesserung, ersetzt die vorige mondzentrierte
    // Fassung mit festem Azimut-/Elevations-Versatz gegen Saturn): Bei
    // 8 Iapetusradien steht der Mond praktisch still im Bild — die geneigte
    // Bahn ist eine BAHN-Eigenschaft und wird erst planetenzentriert
    // sichtbar (wie galileisches-schattenspiel). Die Szene zielt deshalb
    // jetzt auf Saturn selbst samt Ringsystem (kein lookAt); Iapetus' Bahn
    // zeichnet render/orbits.ts automatisch um Saturn. Iapetus trägt bei
    // dieser Kameraentfernung kein Label mehr (8-px-Schwelle) — hinnehmbar,
    // das Motiv ist die gegen den Ring geneigte Bahn, nicht die Nahsicht auf
    // den Mond.
    //
    // BEFUND (per Sichtprüfung, zwei Fehlschläge vor dieser Zahl): Iapetus'
    // a = 3 562 568 km / Saturnradius 58 232 km = 61,19 Saturnradien — ein
    // für einen Mond ungewöhnlich weiter Umlauf.
    // Erster Versuch, distanceInRadii 185 (die einfache Kugelgeometrie
    // distanceInRadii ≈ Bahnradius / tan(25°) für einen bildfüllenden
    // Kreis): Die Sichtprüfung zeigte eine ganze Systemübersicht mit
    // Jupiter statt Saturn. Ursache: sim/scale.ts skaliert Mond-Offsets MIT
    // sizeScale (Kommentar dort: "Verhältnis Planetenradius zu Mondbahn
    // bleibt bei jedem Preset exakt korrekt"), Saturns eigenen
    // Sonnenabstand dagegen unabhängig davon mit der potenzkomprimierten
    // distanceExponent (0,6 im Schaubild-Voreinstellungspreset) — bei 185
    // lag die Kamera dadurch rund 808 Mio. km von Saturn entfernt, 143 %
    // von Saturns eigenem komprimiertem Sonnenabstand (565 Mio. km,
    // nachgerechnet über compressDistance()): weiter von Saturn weg als
    // Saturn von der Sonne.
    // Zweiter Versuch, distanceInRadii 20 (weit innerhalb von Saturns
    // eigenem Sonnenabstand, rund 15 % bei distanceFactor 1,5): Saturn
    // wieder klar dominant, aber Iapetus' Bahn lag komplett außerhalb des
    // Bildausschnitts — die einfache Kugelgeometrie unterschätzt hier
    // stark, weil sie voraussetzt, dass der Bahnradius klein gegen den
    // Kameraabstand bleibt; bei Iapetus ist die Bahn selbst (rund
    // 178 Mio. km skaliert) in derselben Größenordnung wie ein sinnvoller
    // Kameraabstand zu Saturn, die Näherung passt also nicht mehr.
    // distanceInRadii 40 (per Sichtprüfung gefunden, nicht vorausberechnet):
    // zeigt Saturn samt Ringen deutlich dominant, UND Iapetus' vollständige,
    // klar geneigte Bahnellipse komfortabel im Bild — der Kameraabstand
    // bleibt dabei mit höchstens rund 175 Mio. km (bei distanceFactor 1,5)
    // unter einem Drittel von Saturns komprimiertem Sonnenabstand, weit
    // entfernt vom 143-%-Fehlschlag oben.
    //
    // Zeitraffer: Iapetus' Umlauf dauert 79,33 Tage (saturn-monde.ts,
    // LDot-Rückrechnung). timeRateDaysPerSec 3 * 30 s = 90 simulierte Tage,
    // gut 1,13 Umläufe — die geneigte Ellipse wird während der Szene einmal
    // vollständig durchlaufen (per Sichtprüfung bestätigt).
    //
    // Beleuchtung: dieselbe Saturn→Sonne-Richtung wie bei enceladus-hell
    // (az=225,58°, el=2,31°, siehe Herleitung dort) für eine ordentlich
    // beleuchtete Ausgangslage; die Streuung bleibt trotzdem enger als im
    // sonstigen Katalog, damit die Ringebene nicht zufällig von der
    // Schattenseite gezeigt wird.
    id: 'iapetus-schief',
    titleKey: 'scene.iapetusSchief',
    targetId: 'saturn',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 40, elevationDeg: 45, azimuthDeg: 225.58, azimuthRateDegPerSec: 1 },
    durationSec: 30,
    timeRateDaysPerSec: 3,
    // Elevation additiv: Basiswert 45° plus Versatz [-15, 15] ergibt den
    // beabsichtigten absoluten Bereich 30–60° — schräg genug, um die um
    // 15,47° gegen Saturns Äquator geneigte Bahnellipse als Ellipse statt
    // als Linie zu zeigen.
    variation: {
      azimuthDeg: [-20, 20], elevationDeg: [-15, 15], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Uranus liegt mit rund 98° Achsneigung praktisch auf der Seite
    // (uranus.ts) — seine Ringebene (Außenkante 51 000 km, 2,01
    // Uranusradien) steht damit nahezu senkrecht zur Bahnebene.
    // KORRIGIERT (Nachbesserung): Der vorige Stand ließ params.azimuthDeg
    // bei 0 und variation.azimuthDeg bei [0, 360] — nie auf den tatsächlich
    // maßgeblichen Winkel gesetzt, dasselbe Muster wie bei ringdurchflug.
    // Selbst nachgerechnet (poleVector(257.311, −15.175) aus frames.ts,
    // dieselbe Methode wie bei saturn-ringkante): Uranus' Pol liegt
    // ekliptikal bei Länge 257,65°, Breite 7,72°. Die Ringebene schneidet
    // die durch aufKugel() (rein ekliptikal, Elevation 0) aufgespannte Ebene
    // an zwei Knoten bei Länge ± 90° — 167,65° und 347,65° —, denn dort
    // steht der Azimutvektor senkrecht auf der Projektion des Pols (Herleitung:
    // p·(cos az, sin az, 0) = |proj(p)|·cos(az − Pollänge) wird bei
    // az = Pollänge ± 90° null). Azimut fest auf 167,65° (die kleinere der
    // beiden Lösungen, wie bei saturn-ringkante). Streuung eng auf
    // [-10, 10] statt vollem Kreis: Die scheinbare Ring-Abplattung folgt
    // |Kamerarichtung · Pol| — bei dieser Elevation (Basis 10° ± 10°, s. u.)
    // bleibt sie über den ganzen Streuungsbereich unter rund 0,2 (deutlich
    // "kantig" statt offen). Der weiterhin laufende Azimut (1,2°/s, 35 s
    // Dauer ≈ 42° Drift) lässt den Ring im Lauf der Szene sichtbar öffnen —
    // gewolltes Kamera-Schwenken dieser orbit-Szene, keine Zufallsstreuung,
    // und außerhalb des hier behobenen Fehlers.
    // 7 Uranusradien halten die Ringaußenkante auch am unteren Rand der
    // Abstands-Variation (Faktor 0,8 → rund 20° Öffnungswinkel) innerhalb
    // der Bildhälfte.
    id: 'uranus-gekippt',
    titleKey: 'scene.uranusGekippt',
    targetId: 'uranus',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 7, elevationDeg: 10, azimuthDeg: 167.65, azimuthRateDegPerSec: 1.2 },
    durationSec: 35,
    timeRateDaysPerSec: 0.3,
    // Elevation additiv: Basiswert 10° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 0–20°.
    variation: {
      azimuthDeg: [-10, 10], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Reiner Nahflug um den größten Körper des Hauptgürtels: a = 2,7655 AE
    // liegt zwischen Mars (1,524 AE) und Jupiter (5,203 AE) — die auf
    // Ceres selbst zielende Nahaufnahme trägt den Kontext im Titel, nicht
    // im Bildausschnitt. dayLevel 0,7555 bei „Realistisch" (siehe
    // Regressionsschranke in render/lighting.test.ts) bestätigt: Ceres
    // bleibt hell genug — anders als das dort dokumentierte Befund-Ende
    // der Distanzkalibrierung bei Eris (rund 97 AE).
    // KORRIGIERT (Nachbesserung): timeRateDaysPerSec 2 (48 Stunden
    // Simulationszeit je Sekunde) gegen Ceres' Rotationsperiode von
    // 9,074170 h (zwergplaneten.ts) ergibt 48 / 9,074170 ≈ 5,29 Eigen-
    // umdrehungen je Sekunde auf einem bei 6 Radien Abstand bildfüllenden
    // Körper (render/bodies.ts rendert die Rotation) — das strobt. Gesenkt
    // auf 0,02: 0,02 Tage/s = 0,48 Stunden/s, eine Umdrehung dauert also
    // 9,074170 / 0,48 ≈ 18,9 Sekunden Bildzeit — über die 30 s Szenendauer
    // gut anderthalb ruhig sichtbare Umdrehungen statt gut 158 strobender.
    id: 'ceres-guertel',
    titleKey: 'scene.ceresGuertel',
    targetId: 'ceres',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 6, elevationDeg: 15, azimuthDeg: 0, azimuthRateDegPerSec: 1 },
    durationSec: 30,
    timeRateDaysPerSec: 0.02,
    // Elevation additiv: Basiswert 15° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 5–25°.
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Die nächste echte Mondfinsternis (Entwurf 2026-09-13-schatten-design.md
    // §4). Bahntyp `sichtlinie`: Die Kamera steht auf der Linie Erde → Mond,
    // vier Mondradien vor dem Mond, und blickt auf den MOND — `lookAtId`
    // legt hier nur die Linie fest. Damit sieht sie die erdzugewandte Seite,
    // bei Vollmond also die beleuchtete, über die der Erdschatten zieht.
    // `zeitpunkt` lässt tickCinema beim Wechsel auf diese Szene die nächste
    // Finsternis suchen und die Zeit kurz vor den Eintritt setzen.
    // Zeitraffer: 45 s * 0,0035 Tage/s = 0,1575 simulierte Tage = 3,78 h —
    // ein typischer Kernschattendurchgang (rund 3,5 h) passt damit ganz in
    // die Szene, samt des Vorlaufs von 10 % der Durchgangsdauer, den der
    // Zeitsprung vor den Eintritt legt.
    id: 'mondfinsternis',
    titleKey: 'scene.mondfinsternis',
    targetId: 'moon',
    lookAtId: 'earth',
    path: 'sichtlinie',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 4, elevationDeg: 8, azimuthDeg: 0, azimuthRateDegPerSec: 0.4 },
    durationSec: 45,
    timeRateDaysPerSec: 0.0035,
    zeitpunkt: 'naechste-mondfinsternis',
    // Enge Streuung, anders als bei den freien Rundflügen des Katalogs: Die
    // Kameralinie ist hier keine Geschmacksfrage, sondern der Grund der
    // Szene — ein großer Versatz drehte die Kamera von der beschienenen,
    // erdzugewandten Mondseite weg.
    variation: {
      azimuthDeg: [-20, 20], elevationDeg: [-6, 6], distanceFactor: [0.8, 1.3],
    },
  },
];
