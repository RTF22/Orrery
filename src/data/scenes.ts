/**
 * Wie sich die Kamera während einer Szene bewegt.
 *
 * - `static` — feste Kugelkoordinate relativ zum Standortkörper
 * - `orbit`  — dieselbe Kugelkoordinate, der Azimut läuft mit
 * - `flyby`  — geradliniger Vorbeiflug seitlich am Körper
 * - `chase`  — hinter dem Körper, ausgerichtet an seinem Geschwindigkeitsvektor
 * - `system` — Draufsicht auf das ganze System, Azimut läuft langsam mit
 */
export type ScenePath = 'static' | 'orbit' | 'flyby' | 'chase' | 'system';

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
    id: 'ferne-sonne',
    titleKey: 'scene.ferneSonne',
    targetId: 'neptune',
    lookAtId: 'sun',
    path: 'static',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 12, elevationDeg: 15, azimuthDeg: 120, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 0.5,
    variation: {
      azimuthDeg: [-40, 40], elevationDeg: [-10, 25], distanceFactor: [0.9, 1.5],
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
    params: { distanceInRadii: 55, elevationDeg: 20, azimuthDeg: 0, azimuthRateDegPerSec: 1.5 },
    durationSec: 45,
    timeRateDaysPerSec: 0.3,
    // Elevation additiv: Basiswert 20° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 10–30°.
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
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
    id: 'ringdurchflug',
    titleKey: 'scene.ringdurchflug',
    targetId: 'saturn',
    path: 'flyby',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 2, elevationDeg: 4, azimuthDeg: 169.53, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 0.05,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-3, 15], distanceFactor: [0.8, 1.5],
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
    // (Frost aus dem Südpol-Geysir, saturn-monde.ts) — flaches Streiflicht
    // (Elevation 8°, enge Variation) und naher Abstand (5 Radien) sollen
    // genau das zeigen.
    id: 'enceladus-hell',
    titleKey: 'scene.enceladusHell',
    targetId: 'enceladus',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 5, elevationDeg: 8, azimuthDeg: 0, azimuthRateDegPerSec: 1.5 },
    durationSec: 30,
    timeRateDaysPerSec: 0.05,
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-2, 18], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // BEFUND wie bei Titan (siehe dort und Bericht): Ein lookAt auf Neptun
    // hält Triton NICHT zuverlässig im Bild — nachgerechnet lag Triton bei
    // J2000 112,6° neben der Blickachse zu Neptun, deutlich außerhalb der
    // 25°-Bildhälfte. Kamera blickt deshalb auf Triton selbst (kein
    // lookAt), das zeigt den Mond zuverlässig. Azimut läuft mit 11°/s fast
    // einmal ganz herum (35 s ≈ 385°), damit Neptun mit guter Chance
    // wenigstens einmal durchs Bild zieht — nicht garantiert. Die
    // Rückläufigkeit selbst (i = 156,83° gegen Neptuns Äquator, neptun-
    // monde.ts) zeigt sich ohnehin erst über mehrere Umläufe (Periode
    // 5,877 Tage); 35 s bei 0,4 Tagen/s decken knapp zweieinhalb Umläufe ab.
    id: 'triton-rueckwaerts',
    titleKey: 'scene.tritonRueckwaerts',
    targetId: 'triton',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 8, elevationDeg: 12, azimuthDeg: 0, azimuthRateDegPerSec: 11 },
    durationSec: 35,
    timeRateDaysPerSec: 0.4,
    // Elevation additiv: Basiswert 12° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 2–22°.
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Iapetus' Bahn ist um 15,47° gegen Saturns Äquator und damit gegen
    // die Ringebene geneigt (saturn-monde.ts) — bei a = 3 562 568 km ergibt
    // das eine maximale Auslenkung von rund 950 000 km aus der Ringebene.
    // BEFUND wie bei Titan/Triton (siehe dort und Bericht): ein lookAt auf
    // Saturn hält Iapetus NICHT im Bild (bei J2000 129,4° neben der
    // Blickachse). Anders als dort bleibt dies eine STATISCHE Szene (kein
    // Azimutlauf, der Saturn zufällig einfinge) — also kein lookAt (Kamera
    // blickt auf Iapetus selbst), und der feste Azimut/Elevations-Versatz
    // ist stattdessen so gewählt, dass er der Richtung Iapetus→Saturn bei
    // J2000 (der Standard-Startzeit der Anwendung) ENTGEGENgesetzt ist:
    // az=215,29°, el=16,73° (aus scaledPositionAt(iapetus)/(saturn)
    // nachgerechnet, siehe Bericht). Die Kamera steht damit bei J2000 auf
    // der von Saturn abgewandten Seite von Iapetus, sodass Saturn beim
    // Blick auf Iapetus ungefähr in dieselbe Richtung fällt. Das gilt nur
    // näherungsweise und nur nahe J2000 — bei anderer Simulationszeit
    // (Iapetus-Umlauf 79,33 Tage) dreht sich die tatsächliche Richtung
    // weiter, während dieser feste Versatz stehen bleibt.
    id: 'iapetus-schief',
    titleKey: 'scene.iapetusSchief',
    targetId: 'iapetus',
    path: 'static',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 8, elevationDeg: 16.73, azimuthDeg: 215.29, azimuthRateDegPerSec: 0 },
    durationSec: 30,
    timeRateDaysPerSec: 0.1,
    // Abweichend vom sonstigen Katalog KEIN voller Azimut-Bereich: Azimut
    // und Elevation sind auf die Saturn-Richtung bei J2000 abgestimmt (s.
    // o.); ein voller [0, 360]-Bereich würde diese Abstimmung bei jedem
    // Abspielen wieder zunichtemachen. [-15, 15] / [-8, 8] halten die
    // Abweichung der Blickachse auf rund 16° und damit unter der 25°-
    // Bildhälfte (nachgerechnet, siehe Bericht).
    variation: {
      azimuthDeg: [-15, 15], elevationDeg: [-8, 8], distanceFactor: [0.8, 1.5],
    },
  },
  {
    // Uranus liegt mit rund 98° Achsneigung praktisch auf der Seite
    // (uranus.ts) — seine Ringebene (Außenkante 51 000 km, 2,01
    // Uranusradien) steht damit nahezu senkrecht zur Bahnebene. Ob sie im
    // Bild als senkrechte Linie erscheint, hängt zusätzlich vom Azimut ab
    // (aufKugel() misst rein ekliptikal, s. Befund bei saturn-ringkante) —
    // per Sichtprüfung erschien der Ring bei einem Azimut während der
    // Rotation eher als dünnes horizontales Band; in jedem Fall zeigt er
    // sich fast kantengleich, passend zu „liegender Planet". 7 Uranusradien
    // halten die Ringaußenkante auch am unteren Rand der Abstands-Variation
    // (Faktor 0,8 → rund 20° Öffnungswinkel) innerhalb der Bildhälfte.
    id: 'uranus-gekippt',
    titleKey: 'scene.uranusGekippt',
    targetId: 'uranus',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 7, elevationDeg: 10, azimuthDeg: 0, azimuthRateDegPerSec: 1.2 },
    durationSec: 35,
    timeRateDaysPerSec: 0.3,
    // Elevation additiv: Basiswert 10° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 0–20°.
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
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
    id: 'ceres-guertel',
    titleKey: 'scene.ceresGuertel',
    targetId: 'ceres',
    path: 'orbit',
    distanceBasis: 'bodyRadius',
    params: { distanceInRadii: 6, elevationDeg: 15, azimuthDeg: 0, azimuthRateDegPerSec: 1 },
    durationSec: 30,
    timeRateDaysPerSec: 2,
    // Elevation additiv: Basiswert 15° plus Versatz [-10, 10] ergibt den
    // beabsichtigten absoluten Bereich 5–25°.
    variation: {
      azimuthDeg: [0, 360], elevationDeg: [-10, 10], distanceFactor: [0.8, 1.5],
    },
  },
];
