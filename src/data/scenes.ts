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
 * Der Katalog nutzt ausschließlich Körper, die Phase 1 kennt: Sonne, acht
 * Planeten, Erdmond. Die im Entwurf genannten Szenen mit Galileischen
 * Monden, Marsmonden und Pluto kommen mit dem Katalog-Ausbau in Phase 3
 * als reine Datensätze hinzu — die Szenen-Engine bleibt unangetastet.
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
];
