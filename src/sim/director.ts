import type { Scene } from '../data/scenes';
import { createRng, hashSeed, pickInRange } from './random';

export interface PlannedScene {
  scene: Scene;
  /** Laufende Nummer seit dem Start des Kino-Modus. */
  nummer: number;
  azimuthDeg: number;
  elevationDeg: number;
  distanceFactor: number;
}

/** Knapp unter dem Pol — genau am Pol kippt das Bild (siehe Test). */
const MAX_ELEVATION_DEG = 89;

/**
 * Fisher-Yates auf einer Runde. Die Runde wird aus Keim und Rundennummer
 * neu erzeugt, statt fortgeschrieben zu werden: Dadurch ist die Reihenfolge
 * eine reine Funktion der Nummer und der Dauerlauf legt nichts an.
 */
function rohreihenfolge(anzahl: number, seed: number, runde: number): number[] {
  const rng = createRng(hashSeed(seed, runde * 7919 + 13));
  const folge = Array.from({ length: anzahl }, (_, i) => i);
  for (let i = anzahl - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const merk = folge[i]!;
    folge[i] = folge[j]!;
    folge[j] = merk;
  }
  return folge;
}

/**
 * Die gemischte Runde, entschärft um die einzige Stelle, an der zwei
 * gleiche Szenen aufeinanderfolgen können: den Rundenwechsel. Beginnt die
 * neue Runde mit der Szene, die die vorige beendet hat, wird sie mit der
 * zweiten getauscht.
 *
 * Verglichen wird gegen die **ungetauschte** vorige Runde. Das ist zulässig,
 * weil der Tausch nur die ersten beiden Plätze betrifft und damit ab drei
 * Szenen nie den letzten — und es hält den Aufwand konstant. Eine Kette, die
 * sich Runde für Runde zurückhangelt, hätte nach einigen Stunden Dauerlauf
 * den Aufrufstapel gesprengt.
 */
function rundenreihenfolge(anzahl: number, seed: number, runde: number): number[] {
  const folge = rohreihenfolge(anzahl, seed, runde);
  if (anzahl > 2 && runde > 0) {
    const vorige = rohreihenfolge(anzahl, seed, runde - 1);
    if (folge[0] === vorige[anzahl - 1]) {
      const merk = folge[0]!;
      folge[0] = folge[1]!;
      folge[1] = merk;
    }
  }
  return folge;
}

export function sceneIndexFor(
  nummer: number, anzahl: number, seed: number, shuffle: boolean,
): number {
  if (anzahl <= 0) return 0;
  if (!shuffle) return nummer % anzahl;
  const runde = Math.floor(nummer / anzahl);
  const platz = nummer % anzahl;
  return rundenreihenfolge(anzahl, seed, runde)[platz] ?? 0;
}

/**
 * Die n-te Szene samt ihrer gezogenen Variation — vollständig aus Nummer
 * und Keim bestimmt. Zwei Läufe mit demselben Keim ergeben deshalb
 * denselben Film, ohne dass irgendetwas gespeichert werden müsste.
 */
export function plannedSceneAt(
  nummer: number, szenen: readonly Scene[], seed: number, shuffle: boolean,
): PlannedScene {
  const index = sceneIndexFor(nummer, szenen.length, seed, shuffle);
  const scene = szenen[index]!;
  const rng = createRng(hashSeed(seed, nummer));

  const elevation = scene.params.elevationDeg + pickInRange(rng, scene.variation.elevationDeg);

  return {
    scene,
    nummer,
    azimuthDeg: scene.params.azimuthDeg + pickInRange(rng, scene.variation.azimuthDeg),
    elevationDeg: Math.min(Math.max(elevation, -MAX_ELEVATION_DEG), MAX_ELEVATION_DEG),
    distanceFactor: pickInRange(rng, scene.variation.distanceFactor),
  };
}
