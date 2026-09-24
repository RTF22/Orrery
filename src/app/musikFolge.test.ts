import { describe, expect, it } from 'vitest';
import { erzeugeFolge, mischeRunde, sollSpielen } from './musikFolge';

/** Einfacher, wiederholbarer Zufall für Tests (lineare Kongruenz). */
function zufallAus(keim: number): () => number {
  let x = keim;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

describe('sollSpielen', () => {
  const ton = (modus: 'aus' | 'kino' | 'immer', stumm = false) => ({ modus, lautstaerke: 0.5, stumm });

  it('spielt im Modus immer, wenn sichtbar und nicht stumm', () => {
    expect(sollSpielen(ton('immer'), false, true)).toBe(true);
    expect(sollSpielen(ton('immer'), true, true)).toBe(true);
  });

  it('spielt im Modus kino nur bei laufendem Kino', () => {
    expect(sollSpielen(ton('kino'), true, true)).toBe(true);
    expect(sollSpielen(ton('kino'), false, true)).toBe(false);
  });

  it('schweigt im Modus aus, stumm oder bei verdeckter Seite', () => {
    expect(sollSpielen(ton('aus'), true, true)).toBe(false);
    expect(sollSpielen(ton('immer', true), true, true)).toBe(false);
    expect(sollSpielen(ton('immer'), true, false)).toBe(false);
  });
});

describe('mischeRunde', () => {
  it('liefert jede Nummer genau einmal', () => {
    const zufall = zufallAus(7);
    for (const anzahl of [1, 2, 5, 12]) {
      expect([...mischeRunde(anzahl, zufall, null)].sort((a, b) => a - b))
        .toEqual(Array.from({ length: anzahl }, (_, i) => i));
    }
  });

  it('beginnt nie mit dem letzten Stück der Vorrunde', () => {
    const zufall = zufallAus(3);
    for (let vorher = 0; vorher < 4; vorher++) {
      for (let n = 0; n < 50; n++) expect(mischeRunde(4, zufall, vorher)[0]).not.toBe(vorher);
    }
  });

  it('gibt bei einem Stück nur dieses zurück', () => {
    expect(mischeRunde(1, () => 0.5, 0)).toEqual([0]);
  });
});

describe('erzeugeFolge', () => {
  it('spielt alle Stücke, bevor sich eines wiederholt, und nie zweimal hintereinander', () => {
    const folge = erzeugeFolge(5, zufallAus(11));
    const gespielt = Array.from({ length: 50 }, () => folge.naechstes());
    for (let runde = 0; runde < 10; runde++) {
      expect(new Set(gespielt.slice(runde * 5, runde * 5 + 5)).size).toBe(5);
    }
    for (let i = 1; i < gespielt.length; i++) expect(gespielt[i]).not.toBe(gespielt[i - 1]);
  });

  it('wiederholt bei einem Stück immer dasselbe', () => {
    const folge = erzeugeFolge(1, zufallAus(1));
    expect([folge.naechstes(), folge.naechstes(), folge.naechstes()]).toEqual([0, 0, 0]);
  });
});
