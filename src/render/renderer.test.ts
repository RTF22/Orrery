// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { pixelRatioFor, watchPixelRatio } from './renderer';

describe('pixelRatioFor', () => {
  it('folgt der Pixeldichte des Geräts', () => {
    expect(pixelRatioFor(1, 2)).toBe(1);
    expect(pixelRatioFor(1.5, 2)).toBe(1.5);
  });

  it('hält den Deckel der Qualitätsstufe ein', () => {
    // Ein 4K-Bildschirm mit Faktor 3 würde sonst die neunfache Fläche
    // rendern — der Deckel ist der wirksamste Hebel gegen Bildratenabfall.
    expect(pixelRatioFor(3, 2)).toBe(2);
    expect(pixelRatioFor(2, 1)).toBe(1);
  });

  it('bleibt bei unbrauchbaren Werten bei eins', () => {
    expect(pixelRatioFor(Number.NaN, 2)).toBe(1);
    expect(pixelRatioFor(0, 2)).toBe(1);
    expect(pixelRatioFor(-1, 2)).toBe(1);
  });
});

describe('watchPixelRatio', () => {
  it('meldet den Wechsel auf einen Monitor mit anderer Pixeldichte', () => {
    // Ein Fensterwechsel zwischen Monitoren löst kein resize-Ereignis aus,
    // wenn das Fenster gleich groß bleibt — nur diese Medienabfrage schlägt an.
    const hoerer: (() => void)[] = [];
    const matchMedia = vi.fn((abfrage: string) => ({
      abfrage,
      addEventListener: (_typ: string, cb: () => void) => { hoerer.push(cb); },
      removeEventListener: vi.fn(),
    }));
    vi.stubGlobal('matchMedia', matchMedia);

    const onChange = vi.fn();
    const stop = watchPixelRatio(onChange);

    expect(matchMedia).toHaveBeenCalledTimes(1);
    expect(String(matchMedia.mock.calls[0]?.[0])).toContain('dppx');

    hoerer[0]!();
    expect(onChange).toHaveBeenCalledTimes(1);
    // Nach dem Wechsel wird die neue Dichte weiter beobachtet.
    expect(matchMedia).toHaveBeenCalledTimes(2);

    stop();
    vi.unstubAllGlobals();
  });

  it('kommt ohne matchMedia aus', () => {
    vi.stubGlobal('matchMedia', undefined);
    const stop = watchPixelRatio(vi.fn());
    expect(typeof stop).toBe('function');
    stop();
    vi.unstubAllGlobals();
  });
});
