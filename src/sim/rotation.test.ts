import { describe, it, expect } from 'vitest';
import { positionAt, velocityAt, rotationAt, AU_KM } from './orbit';
import { bodyIndex, getBody } from '../data/index';
import { J2000 } from './time';
import { EKLIPTIK_SCHIEFE_GRAD, poleVector } from './frames';
import type { Body, BodyIndex } from './types';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

describe('Mondbahn', () => {
  it('hält den Mond im bekannten Abstandsbereich zur Erde', () => {
    // Der Test bildet positionAt('moon') - positionAt('earth'). Der Mond
    // ist relativ zu genau dem Erde-Mond-Schwerpunkt modelliert, den der
    // "earth"-Datensatz repräsentiert (siehe Kommentar in
    // data/bodies/earth.ts) — dieser gemeinsame Term kürzt sich in der
    // Differenz exakt heraus. Gemessen wird also unmittelbar die Mondbahn
    // selbst, a(1∓e), und die Werte landen entsprechend auf den bekannten
    // Perigäums-/Apogäumsdistanzen (≈363 300 km / ≈405 500 km), nicht
    // darunter.
    let min = Infinity, max = -Infinity;
    for (let t = 0; t < 28; t += 0.25) {
      const mond = positionAt('moon', bodyIndex, J2000 + t);
      const erde = positionAt('earth', bodyIndex, J2000 + t);
      const d = betrag({ x: mond.x - erde.x, y: mond.y - erde.y, z: mond.z - erde.z });
      min = Math.min(min, d); max = Math.max(max, d);
    }
    expect(min).toBeGreaterThan(355_000);
    expect(min).toBeLessThan(372_000);
    expect(max).toBeGreaterThan(398_000);
    expect(max).toBeLessThan(412_000);
  });

  it('lässt den Mond die Erde in rund 27.3 Tagen umrunden', () => {
    const rel = (t: number) => {
      const m = positionAt('moon', bodyIndex, J2000 + t);
      const e = positionAt('earth', bodyIndex, J2000 + t);
      return { x: m.x - e.x, y: m.y - e.y, z: m.z - e.z };
    };
    const p0 = rel(0);
    const p1 = rel(27.32166);
    const d = betrag({ x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z });
    expect(d / 384_400).toBeLessThan(0.05);
  });
});

describe('velocityAt', () => {
  it('liefert für die Erde rund 29.8 km/s', () => {
    const v = betrag(velocityAt('earth', bodyIndex, J2000));
    expect(v).toBeGreaterThan(29.0);
    expect(v).toBeLessThan(30.6);
  });

  it('liefert für Merkur rund 47.9 km/s und für Neptun rund 5.4 km/s', () => {
    expect(betrag(velocityAt('mercury', bodyIndex, J2000))).toBeGreaterThan(38);
    expect(betrag(velocityAt('mercury', bodyIndex, J2000))).toBeLessThan(60);
    expect(betrag(velocityAt('neptune', bodyIndex, J2000))).toBeGreaterThan(5.0);
    expect(betrag(velocityAt('neptune', bodyIndex, J2000))).toBeLessThan(5.8);
  });

  it('steht bei der Erde nahezu senkrecht auf dem Ortsvektor', () => {
    // Bei kleiner Exzentrizität ist der Winkel dicht an 90 Grad.
    const p = positionAt('earth', bodyIndex, J2000);
    const v = velocityAt('earth', bodyIndex, J2000);
    const cos = (p.x * v.x + p.y * v.y + p.z * v.z) / (betrag(p) * betrag(v));
    expect(Math.abs(cos)).toBeLessThan(0.05);
  });

  it('ruht die Sonne', () => {
    expect(betrag(velocityAt('sun', bodyIndex, J2000))).toBeCloseTo(0, 9);
  });
});

describe('rotationAt', () => {
  it('dreht die Erde in 23.934 Stunden einmal ganz herum', () => {
    const erde = getBody('earth');
    const p0 = rotationAt(erde, J2000);
    const p1 = rotationAt(erde, J2000 + erde.physical.rotationPeriodH / 24);
    const differenz = Math.abs(((p1 - p0) % (2 * Math.PI)));
    expect(Math.min(differenz, 2 * Math.PI - differenz)).toBeLessThan(1e-6);
  });

  it('dreht die Venus retrograd', () => {
    const venus = getBody('venus');
    expect(venus.physical.rotationPeriodH).toBeLessThan(0);
    expect(rotationAt(venus, J2000 + 1)).toBeLessThan(rotationAt(venus, J2000));
  });

  it('bindet die Rotation des Mondes an seine Umlaufzeit', () => {
    const mond = getBody('moon');
    expect(Math.abs(mond.physical.rotationPeriodH / 24 - 27.32166)).toBeLessThan(0.01);
  });
});

describe('Bezugsebene parentEquator', () => {
  /** Baut einen Mutterkörper mit gegebener Pollage und einen Trabanten darum. */
  function system(polRa: number, polDec: number, inklination: number): BodyIndex {
    const mutter: Body = {
      id: 'mutter', parent: null, kind: 'planet',
      orbit: null,
      physical: {
        radiusKm: 1000, massKg: 1e24, rotationPeriodH: 24,
        pole: { raDeg: polRa, decDeg: polDec }, rotationAtEpochDeg: 0,
      },
      appearance: { color: '#ffffff' },
      info: { nameKey: 'x' },
    };
    const trabant: Body = {
      ...mutter,
      id: 'trabant', parent: 'mutter', kind: 'moon',
      orbit: {
        a: 0.001, aDot: 0, e: 0, eDot: 0,
        i: inklination, iDot: 0,
        L: 0, LDot: 1000, lp: 0, lpDot: 0, node: 0, nodeDot: 0,
        frame: 'parentEquator',
      },
    };
    return { mutter, trabant };
  }

  it('ist deckungsgleich mit "ecliptic", wenn der Pol die Ekliptiknormale ist', () => {
    // Pol = Ekliptiknormale heißt: Äquatorebene und Ekliptik fallen zusammen.
    // Dann muss die Drehung wirkungslos sein — sonst stimmt die Basiswahl nicht.
    const index = system(270, 90 - EKLIPTIK_SCHIEFE_GRAD, 0);
    const p = positionAt('trabant', index, J2000 + 3);
    expect(p.z).toBeCloseTo(0, 6);
  });

  it('legt eine ungeneigte Bahn in die Äquatorebene des Mutterkörpers', () => {
    // Bahnneigung 0 gegen den Äquator heißt: Die Bahnebene steht senkrecht
    // auf dem Pol. Geprüft wird genau das — das Skalarprodukt aus normiertem
    // Ortsvektor und Polrichtung muss über die ganze Bahn verschwinden.
    const index = system(268.057, 64.495, 0); // Jupiters Pollage
    const pol = poleVector(268.057, 64.495);
    for (const tage of [0, 1, 2, 5, 9]) {
      const p = positionAt('trabant', index, J2000 + tage);
      const betrag = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
      const skalar = (p.x * pol.x + p.y * pol.y + p.z * pol.z) / betrag;
      expect(skalar).toBeCloseTo(0, 9);
    }
  });

  it('hält den Bahnradius unverändert — die Drehung ist längentreu', () => {
    const index = system(268.057, 64.495, 12);
    const p = positionAt('trabant', index, J2000 + 4);
    const r = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
    expect(r).toBeCloseTo(0.001 * AU_KM, 3);
  });

  it('lehnt einen Datensatz ohne Mutterkörper ab, statt still falsch zu rechnen', () => {
    const index = system(268.057, 64.495, 0);
    const waise = { ...index['trabant']!, id: 'waise', parent: null };
    expect(() => positionAt('waise', { ...index, waise }, J2000))
      .toThrow(/parentEquator/);
  });

  it('lehnt einen unbekannten Mutterkörper ab, statt still falsch zu rechnen', () => {
    // "mutter" existiert im Datensatz, aber nicht im Index — der Lookup
    // muss das explizit melden statt z.B. auf undefined-Feldern zu scheitern.
    const index = system(268.057, 64.495, 0);
    const findling = { ...index['trabant']!, id: 'findling', parent: 'spukgestalt' };
    expect(() => positionAt('findling', { ...index, findling }, J2000))
      .toThrow(/Unbekannter Mutterkörper: spukgestalt/);
  });

  it('meldet bei "ecliptic" einen unbekannten Elternkörper mit der allgemeinen Meldung, nicht der Mutterkörper-spezifischen', () => {
    // Für "ecliptic" wird der Mutterkörper nicht gebraucht (keine Drehung
    // nötig) — nur seine Position, die über den rekursiven positionAt-Aufruf
    // angefragt wird. Der fehlende Elternkörper fällt also durch den
    // allgemeinen Körper-Lookup auf, nicht durch den Mutterkörper-Lookup.
    const index = system(268.057, 64.495, 0);
    const findling = {
      ...index['trabant']!,
      id: 'findling',
      parent: 'spukgestalt',
      orbit: { ...index['trabant']!.orbit!, frame: 'ecliptic' as const },
    };
    expect(() => positionAt('findling', { ...index, findling }, J2000))
      .toThrow(/Unbekannter Körper: spukgestalt/);
  });
});
