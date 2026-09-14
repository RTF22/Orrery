import { describe, it, expect } from 'vitest';
import { pruefeZustand } from './pruefer';

describe('pruefeZustand', () => {
  it('liefert für Nicht-Objekte ein leeres Objekt', () => {
    expect(pruefeZustand(null)).toEqual({});
    expect(pruefeZustand('x')).toEqual({});
    expect(pruefeZustand([1])).toEqual({});
    expect(pruefeZustand(undefined)).toEqual({});
  });

  it('lässt einen gültigen Patch unverändert durch', () => {
    const patch = {
      time: { jd: 2451545.5, paused: true },
      scale: { sizeScale: 3, preset: null },
      ui: { language: 'en' },
    };
    expect(pruefeZustand(patch)).toEqual(patch);
  });

  it('verwirft feldweise: falscher Typ, NaN, Infinity, unbekannter Schlüssel', () => {
    expect(pruefeZustand({
      time: { jd: 'x', rateDaysPerSec: NaN, paused: true },
      display: { brightness: Infinity, orbits: false },
      fremd: 1,
    })).toEqual({ time: { paused: true }, display: { orbits: false } });
  });

  it('prüft Aufzählungen', () => {
    expect(pruefeZustand({
      ui: { language: 'fr' }, camera: { mode: 'orbit' },
      quality: { tier: 'ultra' }, scale: { preset: 'riesig' },
    })).toEqual({});
    const gueltig = {
      ui: { language: 'en' }, camera: { mode: 'follow' },
      quality: { tier: 'low' }, scale: { preset: 'kompakt' },
    };
    expect(pruefeZustand(gueltig)).toEqual(gueltig);
  });

  it('erlaubt null nur bei freezeJd und preset', () => {
    expect(pruefeZustand({
      camera: { freezeJd: null, targetId: null },
      scale: { preset: null, sizeScale: null },
    })).toEqual({ camera: { freezeJd: null }, scale: { preset: null } });
    expect(pruefeZustand({ camera: { freezeJd: 2451545 } })).toEqual({ camera: { freezeJd: 2451545 } });
    expect(pruefeZustand({ camera: { freezeJd: 'gestern' } })).toEqual({});
  });

  it('kennt nur bekannte Körper als Kameraziel', () => {
    expect(pruefeZustand({ camera: { targetId: 'mars' } })).toEqual({ camera: { targetId: 'mars' } });
    expect(pruefeZustand({ camera: { targetId: 'vulcan' } })).toEqual({});
    expect(pruefeZustand({ camera: { targetId: 'toString' } })).toEqual({});
  });

  it('nimmt in visible und ui.panels nur boolesche Werte', () => {
    const roh = JSON.parse(
      '{"visible":{"mars":false,"moon":"nein","__proto__":{"x":1}},"ui":{"panels":{"display":false,"views":1}}}',
    ) as unknown;
    expect(pruefeZustand(roh)).toEqual({ visible: { mars: false }, ui: { panels: { display: false } } });
  });

  it('wehrt __proto__ ab', () => {
    const out = pruefeZustand(JSON.parse('{"__proto__":{"boese":true},"time":{"paused":true}}'));
    expect(out).toEqual({ time: { paused: true } });
    expect((out as { boese?: unknown }).boese).toBeUndefined();
  });

  it('lässt leere Zweige weg', () => {
    expect(pruefeZustand({ time: {}, display: { orbits: 'ja' }, visible: {} })).toEqual({});
  });
});

describe('pruefeZustand: Wertebereiche', () => {
  it('verwirft Werte außerhalb des Regler- und Kamerabereichs feldweise', () => {
    expect(pruefeZustand({
      scale: { sizeScale: 5000, distanceExponent: 0.5 },
      display: { brightness: -1, nightFill: 0.4 },
      camera: { distance: 1e20, elevation: 3, azimuth: 1e6 },
      time: { rateDaysPerSec: 1e9, jd: 2461294.5 },
      cinema: { idleResumeSec: 0, seed: -12 },
    })).toEqual({
      scale: { distanceExponent: 0.5 },
      display: { nightFill: 0.4 },
      camera: { azimuth: 1e6 },
      time: { jd: 2461294.5 },
      cinema: { seed: -12 },
    });
  });

  it('lässt die Grenzen selbst zu', () => {
    const roh = { scale: { sizeScale: 1000 }, camera: { distance: 100 }, cinema: { idleResumeSec: 1 } };
    expect(pruefeZustand(roh)).toEqual(roh);
  });

  it('prüft freezeJd nur, wenn es eine Zahl ist', () => {
    expect(pruefeZustand({ camera: { freezeJd: null } })).toEqual({ camera: { freezeJd: null } });
    expect(pruefeZustand({ camera: { freezeJd: -5 } })).toEqual({});
  });
});
