import { describe, it, expect } from 'vitest';
import { solveKepler, normalizeAngle } from './kepler';

describe('normalizeAngle', () => {
  it('normiert auf den Bereich -PI bis PI', () => {
    expect(normalizeAngle(0)).toBeCloseTo(0, 12);
    expect(normalizeAngle(2 * Math.PI + 0.5)).toBeCloseTo(0.5, 12);
    expect(normalizeAngle(-2 * Math.PI - 0.5)).toBeCloseTo(-0.5, 12);

    // Genau auf der Intervallgrenze sind +PI und -PI derselbe Winkel. Welcher
    // Repräsentant herauskommt, entscheidet die Rundung — geprüft wird deshalb
    // nur der Betrag.
    for (const x of [3 * Math.PI, -3 * Math.PI]) {
      expect(Math.abs(normalizeAngle(x))).toBeCloseTo(Math.PI, 9);
    }

    // Die eigentlich zugesicherte Eigenschaft: Das Ergebnis liegt im Zielintervall
    // und beschreibt denselben Winkel wie die Eingabe.
    for (const x of [0.3, 7.9, -12.4, 100, -100]) {
      const n = normalizeAngle(x);
      expect(n).toBeGreaterThanOrEqual(-Math.PI - 1e-12);
      expect(n).toBeLessThanOrEqual(Math.PI + 1e-12);
      expect(Math.cos(n)).toBeCloseTo(Math.cos(x), 9);
      expect(Math.sin(n)).toBeCloseTo(Math.sin(x), 9);
    }
  });
});

describe('solveKepler', () => {
  it('liefert bei Kreisbahn E = M', () => {
    for (const m of [0, 0.5, 1.5, -2.0]) {
      expect(solveKepler(m, 0)).toBeCloseTo(m, 12);
    }
  });

  it('erfüllt die Kepler-Gleichung selbst', () => {
    // Der stärkste Test: die Lösung in die Ausgangsgleichung einsetzen.
    for (const e of [0, 0.01, 0.1, 0.2, 0.3, 0.45, 0.5]) {
      for (const m of [0, 0.3, 1.0, 2.0, 3.0, -1.2, Math.PI]) {
        const E = solveKepler(m, e);
        const zurueck = E - e * Math.sin(E);
        expect(normalizeAngle(zurueck - m)).toBeCloseTo(0, 10);
      }
    }
  });

  it('behandelt M = 0 und M = PI exakt', () => {
    expect(solveKepler(0, 0.3)).toBeCloseTo(0, 12);
    expect(solveKepler(Math.PI, 0.3)).toBeCloseTo(Math.PI, 10);
  });

  it('weist unzulässige Exzentrizitäten zurück', () => {
    expect(() => solveKepler(1, -0.1)).toThrow();
    expect(() => solveKepler(1, 1.0)).toThrow();
  });
});
