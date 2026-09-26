import { describe, it, expect } from 'vitest';
import { gesteEntscheiden } from './geste';
import type { GesteEingabe } from './geste';

/** Kürzt die Testfälle: Nur die abweichenden Felder je Zeile. */
const basis: GesteEingabe = {
  art: 'rad', zeigerart: 'maus', strgOderCmd: false, beruehrungen: 1, eingebettet: true,
};

describe('gesteEntscheiden', () => {
  it('nicht eingebettet: immer kamera, unabhängig von den übrigen Feldern', () => {
    expect(gesteEntscheiden({ ...basis, eingebettet: false })).toBe('kamera');
    expect(gesteEntscheiden({ ...basis, eingebettet: false, art: 'ziehen', zeigerart: 'touch', beruehrungen: 1 }))
      .toBe('kamera');
    expect(gesteEntscheiden({ ...basis, eingebettet: false, strgOderCmd: true })).toBe('kamera');
  });

  it('eingebettet, Rad ohne Strg/⌘: seite-mit-hinweis', () => {
    expect(gesteEntscheiden({ ...basis, art: 'rad', strgOderCmd: false })).toBe('seite-mit-hinweis');
  });

  it('eingebettet, Rad mit Strg/⌘: kamera', () => {
    expect(gesteEntscheiden({ ...basis, art: 'rad', strgOderCmd: true })).toBe('kamera');
  });

  it('eingebettet, Maus oder Stift ziehen: kamera', () => {
    expect(gesteEntscheiden({ ...basis, art: 'ziehen', zeigerart: 'maus' })).toBe('kamera');
    expect(gesteEntscheiden({ ...basis, art: 'ziehen', zeigerart: 'stift' })).toBe('kamera');
  });

  it('eingebettet, ein Finger zieht: seite-mit-hinweis, danach in derselben Geste seite ohne erneuten Hinweis', () => {
    expect(gesteEntscheiden({ ...basis, art: 'ziehen', zeigerart: 'touch', beruehrungen: 1 }))
      .toBe('seite-mit-hinweis');
    expect(gesteEntscheiden({
      ...basis, art: 'ziehen', zeigerart: 'touch', beruehrungen: 1, hinweisSchonGemeldet: true,
    })).toBe('seite');
  });

  it('eingebettet, zwei oder mehr Finger: kamera (Drehen/Zoomen wie heute)', () => {
    expect(gesteEntscheiden({ ...basis, art: 'ziehen', zeigerart: 'touch', beruehrungen: 2 })).toBe('kamera');
    expect(gesteEntscheiden({ ...basis, art: 'ziehen', zeigerart: 'touch', beruehrungen: 3 })).toBe('kamera');
  });
});
