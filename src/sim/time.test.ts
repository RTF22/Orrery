import { describe, it, expect } from 'vitest';
import { J2000, dateToJd, jdToDate, centuriesSinceJ2000 } from './time';

describe('Julianisches Datum', () => {
  it('bildet die Epoche J2000.0 auf 2451545.0 ab', () => {
    // J2000.0 ist definiert als 2000-01-01 12:00:00 UTC
    const epoche = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    expect(dateToJd(epoche)).toBeCloseTo(J2000, 6);
  });

  it('rechnet ein bekanntes Datum korrekt um', () => {
    // 2026-09-11 00:00 UTC
    const d = new Date(Date.UTC(2026, 8, 11, 0, 0, 0));
    expect(dateToJd(d)).toBeCloseTo(2461294.5, 4);
  });

  it('ist umkehrbar (Round-Trip auf die Millisekunde)', () => {
    const original = new Date(Date.UTC(1969, 6, 20, 20, 17, 40));
    const zurueck = jdToDate(dateToJd(original));
    expect(Math.abs(zurueck.getTime() - original.getTime())).toBeLessThan(2);
  });

  it('behandelt das Schaltjahr 2000 und das Nicht-Schaltjahr 1900', () => {
    const schalttag2000 = new Date(Date.UTC(2000, 1, 29, 0, 0, 0));
    const rueck = jdToDate(dateToJd(schalttag2000));
    expect(rueck.getUTCMonth()).toBe(1);
    expect(rueck.getUTCDate()).toBe(29);

    // 1900 war kein Schaltjahr — der 1. März folgt direkt auf den 28. Februar
    const feb28 = dateToJd(new Date(Date.UTC(1900, 1, 28)));
    const mar01 = dateToJd(new Date(Date.UTC(1900, 2, 1)));
    expect(mar01 - feb28).toBeCloseTo(1, 6);
  });

  it('liefert bei J2000 null Jahrhunderte', () => {
    expect(centuriesSinceJ2000(J2000)).toBeCloseTo(0, 12);
    expect(centuriesSinceJ2000(J2000 + 36525)).toBeCloseTo(1, 12);
  });
});
