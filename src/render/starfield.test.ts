import { describe, it, expect } from 'vitest';
import { equatorialToEcliptic, magnitudeToSize, colorIndexToRgb } from './starfield';
import sterne from '../data/stars/hyg.json';

describe('equatorialToEcliptic', () => {
  it('liefert Einheitsvektoren', () => {
    for (const [ra, dec] of [[0, 0], [90, 45], [180, -30], [270, 80]]) {
      const v = equatorialToEcliptic(ra!, dec!);
      expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1, 9);
    }
  });

  it('lässt den Frühlingspunkt auf der x-Achse liegen', () => {
    // RA 0h, Dec 0 ist der gemeinsame Nullpunkt beider Systeme.
    const v = equatorialToEcliptic(0, 0);
    expect(v.x).toBeCloseTo(1, 6);
    expect(v.y).toBeCloseTo(0, 6);
    expect(v.z).toBeCloseTo(0, 6);
  });

  it('kippt den Himmelsnordpol um die Schiefe der Ekliptik', () => {
    // Der Nordpol des Äquatorsystems liegt 23.44 Grad von der Ekliptiknormalen.
    const v = equatorialToEcliptic(0, 90);
    const winkelGrad = Math.acos(v.z) * 180 / Math.PI;
    expect(winkelGrad).toBeCloseTo(23.44, 1);
  });
});

describe('Darstellungsabbildungen', () => {
  it('macht helle Sterne größer als schwache', () => {
    expect(magnitudeToSize(-1.5)).toBeGreaterThan(magnitudeToSize(2));
    expect(magnitudeToSize(2)).toBeGreaterThan(magnitudeToSize(6));
    expect(magnitudeToSize(6)).toBeGreaterThan(0);
  });

  it('färbt blaue Sterne bläulich und rote rötlich', () => {
    const [rB, , bB] = colorIndexToRgb(-0.3); // heißer Blaustern
    const [rR, , bR] = colorIndexToRgb(1.6);  // kühler Roter Riese
    expect(bB).toBeGreaterThan(rB);
    expect(rR).toBeGreaterThan(bR);
  });
});

describe('Katalog', () => {
  // Die häufig zitierte Hausnummer "rund 9000 Sterne für das bloße Auge" bezieht
  // sich auf den Yale Bright Star Catalog bis Magnitude 6.5 (dort 9096 Einträge).
  // Bei der hier verlangten Grenze von Magnitude 6.0 sind es astronomisch korrekt
  // deutlich weniger — rund 5000 bis 6000 Sterne über den ganzen Himmel verteilt.
  // Die Grenze 6.0 ist bewusst so vorgegeben (siehe unten, mag <= 6.01) und wird
  // hier nicht aufgeweicht; stattdessen ist die Zähler-Erwartung an die reale
  // Verteilung angepasst.
  it('enthält die naked-eye-Sterne bis Magnitude 6', () => {
    const liste = sterne as { mag: number }[];
    expect(liste.length).toBeGreaterThan(4500);
    expect(liste.length).toBeLessThan(6000);
    expect(Math.max(...liste.map((s) => s.mag))).toBeLessThanOrEqual(6.01);
  });

  it('enthält Sirius als hellsten Stern nahe RA 101.3°, Dec -16.7°', () => {
    const liste = sterne as { ra: number; dec: number; mag: number }[];
    const hellster = liste.reduce((a, b) => (b.mag < a.mag ? b : a));
    expect(hellster.mag).toBeLessThan(-1.0);
    expect(hellster.ra).toBeCloseTo(101.3, 0);
    expect(hellster.dec).toBeCloseTo(-16.7, 0);
  });

  it('enthält Beteigeuze und Rigel als Anker des Orion', () => {
    const liste = sterne as { ra: number; dec: number; mag: number }[];
    const nahe = (ra: number, dec: number) => liste.some((s) =>
      Math.abs(s.ra - ra) < 0.5 && Math.abs(s.dec - dec) < 0.5);
    expect(nahe(88.8, 7.4)).toBe(true);  // Beteigeuze
    expect(nahe(78.6, -8.2)).toBe(true); // Rigel
  });
});
