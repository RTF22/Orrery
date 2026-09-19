import { describe, it, expect } from 'vitest';
import { padAuswerten, padLeserErstellen, stickKurve, triggerWert, PAD, STICK_TOTZONE } from './gamepad';
import { padAttrappe } from './padAttrappe';

describe('stickKurve', () => {
  it('hält die kreisförmige Totzone bei null und erreicht bei vollem Ausschlag 1', () => {
    // Betrag 0,141 liegt unter 0,15, obwohl beide Achsen darüber liegen könnten.
    expect(stickKurve(0.1, 0.1)).toEqual({ x: 0, y: 0 });
    const voll = stickKurve(0, -1);
    expect(voll.x).toBe(0);
    expect(voll.y).toBeCloseTo(-1, 12);
  });

  it('skaliert hinter der Totzone neu und quadriert: der halbe Weg ergibt ein Viertel, die Richtung bleibt', () => {
    const b = STICK_TOTZONE + 0.5 * (1 - STICK_TOTZONE);
    const k = stickKurve(b * 0.6, b * 0.8);
    expect(Math.hypot(k.x, k.y)).toBeCloseTo(0.25, 12);
    expect(k.x / k.y).toBeCloseTo(0.75, 12);
  });

  it('zählt NaN und fehlende Achsen als 0 und klemmt Werte außerhalb von ±1', () => {
    expect(stickKurve(NaN, undefined)).toEqual({ x: 0, y: 0 });
    const k = stickKurve(3, NaN);
    expect(k.x).toBeCloseTo(1, 12);
    expect(k.y).toBe(0);
  });
});

describe('triggerWert', () => {
  it('hat eine Totzone von 0,05 und läuft danach linear bis 1', () => {
    expect(triggerWert(0.05)).toBe(0);
    expect(triggerWert(0.525)).toBeCloseTo(0.5, 12);
    expect(triggerWert(1)).toBe(1);
    expect(triggerWert(2)).toBe(1);
    expect(triggerWert(NaN)).toBe(0);
    expect(triggerWert(-0.3)).toBe(0);
  });
});

describe('padAuswerten', () => {
  it('bleibt beim ersten Auftauchen ohne Wirkung und nimmt den Tastenstand als Vorzustand', () => {
    const { bild, gedrueckt } = padAuswerten(padAttrappe({ gedrueckt: [PAD.A], axes: [1, 0, 0, 0] }), null);
    expect(bild.flanken).toEqual([]);
    expect(bild.eingabe).toBe(false);
    expect(bild.absicht.links).toEqual({ x: 0, y: 0 });
    expect(gedrueckt[PAD.A]).toBe(true);
    // Die gehaltene Freigabetaste löst auch im nächsten Bild nichts aus.
    expect(padAuswerten(padAttrappe({ gedrueckt: [PAD.A] }), gedrueckt).bild.flanken).toEqual([]);
  });

  it('meldet Tasten beim Drücken, nicht beim Halten', () => {
    const leer = padAuswerten(padAttrappe(), null).gedrueckt;
    const erst = padAuswerten(padAttrappe({ gedrueckt: [PAD.B, PAD.MENUE] }), leer);
    expect(erst.bild.flanken).toEqual([PAD.B, PAD.MENUE]);
    expect(erst.bild.eingabe).toBe(true);
    expect(padAuswerten(padAttrappe({ gedrueckt: [PAD.B, PAD.MENUE] }), erst.gedrueckt).bild.flanken).toEqual([]);
  });

  it('bildet die Absicht aus Sticks, Triggern und LB', () => {
    const leer = padAuswerten(padAttrappe(), null).gedrueckt;
    const { bild } = padAuswerten(
      padAttrappe({ axes: [0.8, 0, 0, -1], werte: { [PAD.RT]: 1, [PAD.LT]: 0.3 }, gedrueckt: [PAD.LB] }), leer,
    );
    expect(bild.absicht.links.x).toBeCloseTo(((0.8 - 0.15) / 0.85) ** 2, 12);
    expect(bild.absicht.links.y).toBe(0);
    expect(bild.absicht.rechts.y).toBeCloseTo(-1, 12);
    expect(bild.absicht.vor).toBeCloseTo(1 - (0.3 - 0.05) / 0.95, 12);
    expect(bild.absicht.lb).toBe(true);
    expect(bild.eingabe).toBe(true);
  });

  it('meldet keine Eingabe, solange alles in den Totzonen bleibt und keine Taste neu gedrückt wird', () => {
    const vorher = padAuswerten(padAttrappe({ gedrueckt: [PAD.LB] }), null).gedrueckt;
    const { bild } = padAuswerten(
      padAttrappe({ axes: [0.1, 0, 0, 0.1], werte: { [PAD.RT]: 0.04 }, gedrueckt: [PAD.LB] }), vorher,
    );
    expect(bild.eingabe).toBe(false);
  });
});

describe('padLeserErstellen', () => {
  it('liefert den ersten Controller mit Standardbelegung und übergeht fremde und leere Einträge', () => {
    const fremd = padAttrappe({ mapping: '' });
    const echt = padAttrappe();
    const lesen = padLeserErstellen({ isSecureContext: true, navigator: { getGamepads: () => [null, fremd, echt] } });
    expect(lesen()).toBe(echt);
  });

  it('bleibt ohne sicheren Kontext still und fragt den Browser gar nicht', () => {
    let aufrufe = 0;
    const lesen = padLeserErstellen({
      isSecureContext: false,
      navigator: { getGamepads: () => { aufrufe += 1; return [padAttrappe()]; } },
    });
    expect(lesen()).toBeNull();
    expect(aufrufe).toBe(0);
  });

  it('bleibt ohne Gamepad-API still', () => {
    expect(padLeserErstellen({ isSecureContext: true, navigator: {} })()).toBeNull();
    expect(padLeserErstellen({ isSecureContext: true })()).toBeNull();
  });

  it('schaltet sich einmalig ab, wenn getGamepads wirft', () => {
    let aufrufe = 0;
    const lesen = padLeserErstellen({
      isSecureContext: true,
      navigator: { getGamepads: () => { aufrufe += 1; throw new Error('Berechtigungsregel'); } },
    });
    expect(lesen()).toBeNull();
    expect(lesen()).toBeNull();
    expect(aufrufe).toBe(1);
  });
});
