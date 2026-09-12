import { describe, it, expect } from 'vitest';
import { plannedSceneAt, sceneIndexFor } from './director';
import { SCENES } from '../data/scenes';

describe('sceneIndexFor', () => {
  it('spielt ohne Mischen der Reihe nach', () => {
    const folge = [0, 1, 2, 3, 4].map((n) => sceneIndexFor(n, 5, 123, false));
    expect(folge).toEqual([0, 1, 2, 3, 4]);
  });

  it('beginnt ohne Mischen nach der letzten Szene wieder vorn', () => {
    expect(sceneIndexFor(5, 5, 123, false)).toBe(0);
    expect(sceneIndexFor(11, 5, 123, false)).toBe(1);
  });

  it('spielt beim Mischen jede Szene einer Runde genau einmal', () => {
    const runde = [0, 1, 2, 3, 4, 5, 6].map((n) => sceneIndexFor(n, 7, 99, true));
    expect([...runde].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('mischt zwei aufeinanderfolgende Runden verschieden', () => {
    const ersteRunde = [0, 1, 2, 3, 4, 5, 6].map((n) => sceneIndexFor(n, 7, 99, true));
    const zweiteRunde = [7, 8, 9, 10, 11, 12, 13].map((n) => sceneIndexFor(n, 7, 99, true));
    expect(zweiteRunde).not.toEqual(ersteRunde);
  });

  it('wiederholt beim Rundenwechsel nicht dieselbe Szene zweimal hintereinander', () => {
    // Der Übergang von der letzten Szene einer Runde zur ersten der nächsten
    // ist die einzige Stelle, an der eine Wiederholung entstehen kann.
    for (let seed = 0; seed < 50; seed++) {
      const letzte = sceneIndexFor(6, 7, seed, true);
      const naechste = sceneIndexFor(7, 7, seed, true);
      expect(naechste, `Keim ${seed}`).not.toBe(letzte);
    }
  });
});

describe('plannedSceneAt', () => {
  it('liefert bei gleichem Keim identische Kamerapfade', () => {
    const a = [0, 1, 2, 3, 4, 5].map((n) => plannedSceneAt(n, SCENES, 4242, true));
    const b = [0, 1, 2, 3, 4, 5].map((n) => plannedSceneAt(n, SCENES, 4242, true));
    expect(a).toEqual(b);
  });

  it('liefert bei verschiedenen Keimen verschiedene Kamerapfade', () => {
    const a = plannedSceneAt(0, SCENES, 1, false);
    const b = plannedSceneAt(0, SCENES, 2, false);
    expect([a.azimuthDeg, a.elevationDeg, a.distanceFactor])
      .not.toEqual([b.azimuthDeg, b.elevationDeg, b.distanceFactor]);
  });

  it('hält die gezogenen Werte in den Bereichen der Szene', () => {
    for (let n = 0; n < 60; n++) {
      const geplant = plannedSceneAt(n, SCENES, 777, true);
      const v = geplant.scene.variation;
      const azimutVersatz = geplant.azimuthDeg - geplant.scene.params.azimuthDeg;
      const elevationVersatz = geplant.elevationDeg - geplant.scene.params.elevationDeg;
      expect(azimutVersatz).toBeGreaterThanOrEqual(v.azimuthDeg[0] - 1e-9);
      expect(azimutVersatz).toBeLessThanOrEqual(v.azimuthDeg[1] + 1e-9);
      expect(elevationVersatz).toBeGreaterThanOrEqual(v.elevationDeg[0] - 1e-9);
      expect(elevationVersatz).toBeLessThanOrEqual(v.elevationDeg[1] + 1e-9);
      expect(geplant.distanceFactor).toBeGreaterThanOrEqual(v.distanceFactor[0] - 1e-9);
      expect(geplant.distanceFactor).toBeLessThanOrEqual(v.distanceFactor[1] + 1e-9);
    }
  });

  it('bleibt in der Elevation unterhalb des Pols', () => {
    // Genau am Pol fiele die Blickrichtung mit dem Up-Vektor zusammen und
    // das Bild kippte unkontrolliert.
    for (let n = 0; n < 200; n++) {
      const geplant = plannedSceneAt(n, SCENES, n * 13 + 1, true);
      expect(Math.abs(geplant.elevationDeg)).toBeLessThan(89.5);
    }
  });

  it('bleibt auch bei sehr großer Nummer rechenbar', () => {
    // Nach einer Nacht Dauerlauf liegt die Nummer im vierstelligen Bereich.
    const geplant = plannedSceneAt(100_000, SCENES, 5, true);
    expect(Number.isFinite(geplant.azimuthDeg)).toBe(true);
    expect(geplant.nummer).toBe(100_000);
  });
});
