import { describe, it, expect } from 'vitest';
import { sonnenAnteil, SCHATTEN_GLSL_FUNKTIONEN } from './shadows';

type Anteil = (alpha: number, beta: number, gamma: number) => number;

const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi);

/**
 * Schneidet den Rumpf von `float sonnenAnteil(...) { ... }` aus dem
 * GLSL-Text und übersetzt ihn mechanisch nach JavaScript. Bewusst nur die
 * Konstrukte, die dort heute vorkommen — jede Erweiterung des Shaders, die
 * hier nicht abgebildet ist, lässt den Restprüfungs-Test unten fallen und
 * verlangt eine bewusste Ergänzung.
 */
function glslSonnenAnteilNachJs(quelle: string): { fn: Anteil; rumpf: string } {
  const kopf = 'float sonnenAnteil(float alpha, float beta, float gamma) {';
  const start = quelle.indexOf(kopf);
  expect(start).toBeGreaterThanOrEqual(0);
  const rumpfStart = start + kopf.length;
  const rumpfEnde = quelle.indexOf('\n}', rumpfStart);
  expect(rumpfEnde).toBeGreaterThan(rumpfStart);

  const rumpf = quelle.slice(rumpfStart, rumpfEnde)
    .replace(/\bfloat\s+/g, 'let ')
    .replace(/\b(acos|sqrt|max|min)\(/g, 'Math.$1(')
    .replace(/\bPI\b/g, 'Math.PI');

  const roh = new Function('alpha', 'beta', 'gamma', 'clamp', rumpf) as
    (a: number, b: number, g: number, c: typeof clamp) => number;
  return { fn: (a, b, g) => roh(a, b, g, clamp), rumpf };
}

describe('sonnenAnteil — TS- und GLSL-Fassung rechnen gleich', () => {
  const { fn: glsl, rumpf } = glslSonnenAnteilNachJs(SCHATTEN_GLSL_FUNKTIONEN);

  it('die Übersetzung lässt keine GLSL-Reste zurück', () => {
    // Taucht hier etwas auf, wurde der Shader um ein Konstrukt erweitert,
    // das der Übersetzer nicht kennt — dann den Übersetzer erweitern.
    expect(rumpf).not.toMatch(/\b(vec[234]|float|int|dot|length|asin|normalize)\b/);
  });

  it('stimmt auf einem Raster aus Sonnenradius, Okkluderradius und Abstand überein', () => {
    // alpha: Winkelradius der Sonne (Merkur bis Neptun, Entwurf §2: < 0,012 rad).
    // beta: Okkluder von winzig bis Phobos-vor-Mars (0,37 rad).
    const alphas = [0.0002, 0.001, 0.0047, 0.012];
    const betas = [0.0001, 0.0005, 0.003, 0.01, 0.05, 0.37];
    let geprueft = 0;
    for (const alpha of alphas) {
      for (const beta of betas) {
        const bisGamma = alpha + beta + 0.01;
        for (let k = 0; k <= 60; k++) {
          const gamma = (bisGamma * k) / 60;
          const ts = sonnenAnteil(alpha, beta, gamma);
          const gl = glsl(alpha, beta, gamma);
          expect(gl, `alpha=${alpha} beta=${beta} gamma=${gamma}`).toBeCloseTo(ts, 9);
          geprueft++;
        }
      }
    }
    expect(geprueft).toBe(alphas.length * betas.length * 61);
  });

  it('stimmt exakt an den Fallgrenzen der Formel überein', () => {
    // Die drei Frühausgänge (voll, verdeckt, Ringkappe) und der Übergang in
    // die Linsenformel liegen genau auf alpha+beta, |beta−alpha| und 0.
    const faelle: [number, number, number][] = [
      [0.005, 0.01, 0.015], [0.005, 0.01, 0.005], [0.01, 0.005, 0.005],
      [0.01, 0.005, 0], [0.005, 0.005, 0.005], [0.005, 0.005, 0.01],
    ];
    for (const [alpha, beta, gamma] of faelle) {
      expect(glsl(alpha, beta, gamma)).toBeCloseTo(sonnenAnteil(alpha, beta, gamma), 12);
    }
  });
});
