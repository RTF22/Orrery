import { describe, it, expect } from 'vitest';
import { advanceCinema, blendedRate, RATE_BLEND_SEC } from './cinema';
import { DEFAULT_STATE } from '../store';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';

const basis = { ...DEFAULT_STATE.cinema, running: true };

describe('advanceCinema', () => {
  it('zählt die verstrichene Zeit hoch', () => {
    const nachher = advanceCinema(basis, 0.5);
    expect(nachher.elapsedSec).toBeCloseTo(0.5, 9);
    expect(nachher.nummer).toBe(0);
  });

  it('schaltet nach Ablauf der Szenendauer weiter', () => {
    const dauer = plannedSceneAt(0, SCENES, basis.seed, basis.shuffle).scene.durationSec;
    const nachher = advanceCinema({ ...basis, elapsedSec: dauer - 0.01 }, 0.02);
    expect(nachher.nummer).toBe(1);
    // Der Überhang geht nicht verloren, sonst driftete der Film.
    expect(nachher.elapsedSec).toBeCloseTo(0.01, 6);
  });

  it('überspringt bei einem sehr großen Zeitschritt höchstens eine Szene', () => {
    // Nach einem Tabwechsel kommt ein Riesenschritt an; er darf nicht durch
    // zwanzig Szenen springen.
    const nachher = advanceCinema(basis, 3600);
    expect(nachher.nummer).toBe(1);
  });

  it('rührt nichts an, solange der Kino-Modus aus ist', () => {
    const aus = { ...basis, running: false };
    expect(advanceCinema(aus, 5)).toEqual(aus);
  });
});

describe('blendedRate', () => {
  it('beginnt beim alten und endet beim neuen Zeitraffer', () => {
    expect(blendedRate(1, 30, 0)).toBeCloseTo(1, 6);
    expect(blendedRate(1, 30, RATE_BLEND_SEC)).toBeCloseTo(30, 6);
    expect(blendedRate(1, 30, 60)).toBeCloseTo(30, 6);
  });

  it('blendet geometrisch, nicht linear', () => {
    // Linear läge die Mitte zwischen 1 und 100 bei 50,5 — ein sichtbarer
    // Ruck. Geometrisch liegt sie bei 10.
    expect(blendedRate(1, 100, RATE_BLEND_SEC / 2)).toBeCloseTo(10, 6);
  });

  it('kommt mit einem Vorzeichenwechsel zurecht', () => {
    // Rückwärtslauf vor dem Start des Kino-Modus: Der Betrag wird geblendet,
    // das Vorzeichen des Ziels gilt sofort.
    const wert = blendedRate(-10, 30, RATE_BLEND_SEC / 2);
    expect(wert).toBeGreaterThan(0);
    expect(Number.isFinite(wert)).toBe(true);
  });

  it('kommt mit Stillstand zurecht', () => {
    expect(Number.isFinite(blendedRate(0, 30, 0.5))).toBe(true);
    expect(Number.isFinite(blendedRate(30, 0, 0.5))).toBe(true);
  });
});
