// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { GROB_ABFRAGE } from '../info/konstanten';
import { laeuftAlsApp, grobJetzt } from './geraet';

/** Ersetzt matchMedia so, dass nur die angegebenen Abfragen zutreffen. */
function stubMatchMedia(...zutreffend: string[]): void {
  vi.stubGlobal('matchMedia', (abfrage: string) => ({
    matches: zutreffend.includes(abfrage), media: abfrage,
    addEventListener: () => {}, removeEventListener: () => {},
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'standalone');
});

describe('laeuftAlsApp', () => {
  it('ist wahr bei navigator.standalone === true', () => {
    Object.defineProperty(navigator, 'standalone', { value: true, configurable: true });
    expect(laeuftAlsApp()).toBe(true);
  });

  it('ist wahr bei (display-mode: fullscreen)', () => {
    stubMatchMedia('(display-mode: fullscreen)');
    expect(laeuftAlsApp()).toBe(true);
  });

  it('ist wahr bei (display-mode: standalone)', () => {
    stubMatchMedia('(display-mode: standalone)');
    expect(laeuftAlsApp()).toBe(true);
  });

  it('ist sonst falsch', () => {
    stubMatchMedia();
    expect(laeuftAlsApp()).toBe(false);
  });

  it('ist ohne window.matchMedia falsch', () => {
    expect(laeuftAlsApp()).toBe(false);
  });
});

describe('grobJetzt', () => {
  it('folgt GROB_ABFRAGE', () => {
    stubMatchMedia(GROB_ABFRAGE);
    expect(grobJetzt()).toBe(true);
    stubMatchMedia();
    expect(grobJetzt()).toBe(false);
  });

  it('ist ohne window.matchMedia falsch', () => {
    expect(grobJetzt()).toBe(false);
  });
});
