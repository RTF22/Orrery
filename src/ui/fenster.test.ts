import { describe, it, expect } from 'vitest';
import { spaltenBreite } from './fenster';

// Umgebung node (kein jsdom): remPx() liefert hier immer 16, siehe fenster.ts.
describe('spaltenBreite', () => {
  it('klemmt auf den Anteil der Fensterbreite, wenn er unter der Höchstbreite liegt', () => {
    // 1024 px · 0,4 / 16 = 25,6 → floor 25; Grenzen 14/32, gespeichert 32.
    expect(spaltenBreite(32, 14, 32, 0.4, 1024)).toEqual({ breite: 25, obergrenze: 25 });
  });

  it('nimmt ohne Fensterbreite die Höchstbreite als Obergrenze und lässt den gespeicherten Wert stehen', () => {
    expect(spaltenBreite(18, 14, 32, 0.4, null)).toEqual({ breite: 18, obergrenze: 32 });
  });

  it('hält die Obergrenze mindestens auf der Mindestbreite, auch bei sehr schmalem Fenster', () => {
    // 200 px · 0,4 / 16 = 5 → unter der Mindestbreite 14, also Obergrenze 14.
    expect(spaltenBreite(18, 14, 32, 0.4, 200)).toEqual({ breite: 14, obergrenze: 14 });
  });

  it('lässt den gespeicherten Wert unverändert, wenn er unter der Obergrenze liegt', () => {
    expect(spaltenBreite(16, 14, 32, 0.4, 1024)).toEqual({ breite: 16, obergrenze: 25 });
  });
});
