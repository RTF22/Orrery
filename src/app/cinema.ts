import { useStore } from '../store';
import type { AppState } from '../store/types';
import { SCENES, type Scene } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';
import { naechsteMondfinsternis } from '../sim/finsternis';
import { naechsteOpposition } from '../sim/geozentrisch';
import { bodyIndex } from '../data/index';
import { imZeitbereich } from '../sim/time';

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
    // geplant.nummer statt cinema.nummer + 1: plannedSceneAt normalisiert
    // (nicht-negative Ganzzahl); eine unnormalisierte Nummer aus einem alten
    // Zustand liefe sonst unnormalisiert weiter.
    nummer: geplant.nummer + 1,
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
 * Beginnt mit diesem Tick eine Szene? Beim Wechsel der Nummer offensichtlich.
 * Außerdem, wenn `elapsedSec` vor dem Tick 0 war: startCinema und nextScene
 * (ui/cinemaControl.ts) setzen den Zähler auf 0, damit springt eine Szene
 * mit `zeitpunkt` auch an Playlist-Position 0 und nach einem Neustart auf
 * ihr. Der Wiederanlauf nach Ruhe (resumeIfIdle) lässt den Zähler stehen
 * und zählt deshalb nicht als Beginn — kein zweiter Sprung mitten in der
 * Szene.
 */
export function szenenBeginn(
  vorher: AppState['cinema'], nachher: AppState['cinema'],
): boolean {
  return nachher.nummer !== vorher.nummer || vorher.elapsedSec === 0;
}

/**
 * Ziel des Zeitsprungs beim Beginn einer Szene mit `zeitpunkt`, oder null
 * (ohne `zeitpunkt` oder wenn die Suche nichts findet — dann läuft die Szene
 * ohne Sprung). Mondfinsternis: ein Zehntel der Durchgangsdauer vor dem
 * Eintritt in den Kernschatten, der Mond läuft noch unverfinstert ein.
 * Opposition (Entwurf geozentrische Sicht §4.5): so weit davor, dass sie in
 * der Mitte der Szene liegt, halbe Szenendauer mal Zeitraffer der Szene; die
 * Blende der ersten zwei Sekunden kann die Lage der Opposition in der Szene
 * um bis zu rund 17 Tage verschieben.
 */
export function sprungZiel(scene: Scene, jd: number): number | null {
  if (scene.zeitpunkt === 'naechste-mondfinsternis') {
    const f = naechsteMondfinsternis(bodyIndex, jd);
    return f === null ? null : f.eintrittJd - 0.1 * (f.austrittJd - f.eintrittJd);
  }
  if (scene.zeitpunkt === 'naechste-opposition') {
    const opposition = naechsteOpposition(scene.targetId, bodyIndex, jd);
    return opposition === null ? null : opposition - (scene.durationSec / 2) * scene.timeRateDaysPerSec;
  }
  return null;
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

  // Zeitsprung beim Beginn einer Szene mit `zeitpunkt` (Entwurf §4; Beginn
  // siehe szenenBeginn, Ziel siehe sprungZiel): Die Suche läuft ab der
  // aktuellen Zeit, für die Mondfinsternis wie für die Opposition. Findet
  // die Suche nichts, bleibt die Zeit stehen und die Szene läuft ohne
  // Sprung. Der Sprung bleibt nach der Szene bestehen: Das Kino setzt heute
  // schon den Zeitraffer und stellt ihn nicht zurück, die Zeit ist im Kino
  // die des Kinos.
  let jdNeu = zustand.time.jd;
  if (szenenBeginn(vorher, nachher)) {
    const ziel = sprungZiel(geplant.scene, zustand.time.jd);
    if (ziel !== null) jdNeu = ziel;
  }

  useStore.setState({
    cinema: nachher,
    time: {
      ...zustand.time,
      // Die Suche selbst darf über den Zeitbereich hinausreichen (bis zu
      // SUCHE_MAX_TAGE), geschrieben wird nur ein geklemmter Wert.
      jd: imZeitbereich(jdNeu),
      paused: false,
      rateDaysPerSec: blendedRate(
        vonRate, geplant.scene.timeRateDaysPerSec, nachher.elapsedSec,
      ),
    },
  });
}
