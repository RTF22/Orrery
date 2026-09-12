import { useStore } from '../store';
import type { AppState } from '../store/types';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';

/** So lange fährt der Zeitraffer beim Szenenwechsel auf den neuen Wert. */
export const RATE_BLEND_SEC = 2;

/** Untergrenze für die geometrische Blende — 0 hat keinen Logarithmus. */
const RATE_EPS = 1e-4;

/**
 * Schaltet die Szene fort. Höchstens eine Szene je Aufruf: Ein Riesenschritt
 * nach einem Tabwechsel soll den Film nicht durchspulen, sondern nur die
 * aktuelle Szene beenden.
 */
export function advanceCinema(
  cinema: AppState['cinema'], dtSek: number,
): AppState['cinema'] {
  if (!cinema.running) return cinema;

  const geplant = plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle);
  const verstrichen = cinema.elapsedSec + dtSek;
  if (verstrichen < geplant.scene.durationSec) {
    return { ...cinema, elapsedSec: verstrichen };
  }
  return {
    ...cinema,
    nummer: cinema.nummer + 1,
    // Der Überhang wandert in die neue Szene, damit sich über Stunden kein
    // Zeitversatz aufsummiert; er wird gedeckelt, falls er die neue Szene
    // schon wieder überschreiten würde.
    elapsedSec: Math.min(verstrichen - geplant.scene.durationSec, geplant.scene.durationSec),
  };
}

/**
 * Geometrische Blende des Zeitraffers. Geometrisch, weil Zeitraffer
 * multiplikativ wirken: Von 1 auf 100 ist die gefühlte Mitte 10, nicht 50.
 */
export function blendedRate(vonRate: number, nachRate: number, elapsedSec: number): number {
  const t = Math.min(Math.max(elapsedSec / RATE_BLEND_SEC, 0), 1);
  if (t >= 1) return nachRate;
  const vorzeichen = nachRate < 0 ? -1 : 1;
  const von = Math.max(Math.abs(vonRate), RATE_EPS);
  const nach = Math.max(Math.abs(nachRate), RATE_EPS);
  return vorzeichen * von * Math.pow(nach / von, t);
}

/**
 * Ein Bild im Kino-Modus: Szene fortschalten und den Zeitraffer der Szene
 * angleichen. Wird aus der Renderschleife gerufen, nicht aus React.
 */
export function tickCinema(dtSek: number): void {
  const zustand = useStore.getState();
  if (!zustand.cinema.running) return;

  const vorher = zustand.cinema;
  const nachher = advanceCinema(vorher, dtSek);

  const geplant = plannedSceneAt(nachher.nummer, SCENES, nachher.seed, nachher.shuffle);
  // Beim Szenenwechsel ist der Ausgangswert der Zeitraffer der vorigen
  // Szene; innerhalb einer Szene ist er es ohnehin.
  const vonRate = nachher.nummer === vorher.nummer
    ? zustand.time.rateDaysPerSec
    : plannedSceneAt(vorher.nummer, SCENES, vorher.seed, vorher.shuffle)
      .scene.timeRateDaysPerSec;

  useStore.setState({
    cinema: nachher,
    time: {
      ...zustand.time,
      paused: false,
      rateDaysPerSec: blendedRate(
        vonRate, geplant.scene.timeRateDaysPerSec, nachher.elapsedSec,
      ),
    },
  });
}
