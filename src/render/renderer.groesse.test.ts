// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';

// Eigene Datei, weil vi.mock das ganze Modul ersetzt: Die Testumgebung hat
// kein WebGL, der Renderer wird deshalb durch eine Attrappe ersetzt, die nur
// mitschreibt, was createRenderer bei einer Größenänderung aufruft.
const setSize = vi.fn();
vi.mock('three', async (original) => ({
  ...(await original<typeof import('three')>()),
  WebGLRenderer: class {
    toneMapping = 0;
    setPixelRatio = vi.fn();
    setSize = setSize;
    dispose = vi.fn();
  },
}));

const { createRenderer } = await import('./renderer');

function leinwand(breite: number, hoehe: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.getBoundingClientRect = () => ({ width: breite, height: hoehe }) as DOMRect;
  return canvas;
}

describe('createRenderer: Leinwand ohne Fläche', () => {
  it('überspringt die Größenänderung bei Breite oder Höhe 0 (verstecktes iframe)', () => {
    const nachher = vi.fn();
    const ctx = createRenderer(leinwand(0, 0));
    ctx.afterResize = nachher;
    setSize.mockClear();
    ctx.resize();
    expect(setSize).not.toHaveBeenCalled();
    expect(nachher).not.toHaveBeenCalled();
    expect(Number.isFinite(ctx.camera.aspect) && ctx.camera.aspect > 0).toBe(true);
    ctx.dispose();
  });

  it('passt bei einer echten Fläche Puffer und Seitenverhältnis an', () => {
    const ctx = createRenderer(leinwand(800, 400));
    const nachher = vi.fn();
    ctx.afterResize = nachher;
    ctx.resize();
    expect(setSize).toHaveBeenLastCalledWith(800, 400, false);
    expect(ctx.camera.aspect).toBe(2);
    expect(nachher).toHaveBeenCalledOnce();
    ctx.dispose();
  });
});
