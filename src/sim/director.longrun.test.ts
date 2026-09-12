import { describe, it, expect } from 'vitest';
import { plannedSceneAt } from './director';
import { advanceCinema } from '../app/cinema';
import { SCENES } from '../data/scenes';
import { DEFAULT_STATE } from '../store';

describe('Dauerlauf', () => {
  it('spielt eine halbe Stunde durch, ohne dass etwas anwächst', () => {
    let cinema = { ...DEFAULT_STATE.cinema, running: true };
    const schritt = 1 / 60;
    const schritte = 30 * 60 * 60; // 30 Minuten bei 60 Bildern je Sekunde

    for (let i = 0; i < schritte; i++) cinema = advanceCinema(cinema, schritt);

    // Der Zustand hat nach 108 000 Bildern genau dieselben Felder wie am
    // Anfang — es gibt keine mitwachsende Liste, in der eine halbe Stunde
    // Betrieb Spuren hinterlassen könnte.
    expect(Object.keys(cinema).sort()).toEqual(Object.keys(DEFAULT_STATE.cinema).sort());
    expect(cinema.nummer).toBeGreaterThan(20);
    expect(Number.isFinite(cinema.elapsedSec)).toBe(true);
    expect(cinema.elapsedSec).toBeLessThanOrEqual(
      plannedSceneAt(cinema.nummer, SCENES, cinema.seed, cinema.shuffle).scene.durationSec,
    );
  });

  it('liefert nach tausend Szenen noch denselben Film wie beim ersten Lauf', () => {
    const ersterLauf = [990, 995, 999].map((n) => plannedSceneAt(n, SCENES, 20260912, true));
    const zweiterLauf = [990, 995, 999].map((n) => plannedSceneAt(n, SCENES, 20260912, true));
    expect(zweiterLauf).toEqual(ersterLauf);
  });
});
