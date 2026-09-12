import { describe, it, expect } from 'vitest';
import { bodies, bodyIndex, getBody } from './index';
import { poleVector, axialTiltDeg } from '../sim/frames';
import { AU_KM } from '../sim/orbit';
import { t } from '../ui/i18n';

describe('Körperkatalog', () => {
  // Die Zahl der Monde wächst über Phase 3a hinweg; festgenagelt bleiben
  // deshalb nur Stern und Planeten, dazu die namentlich erwarteten Monde.
  it('enthält Sonne, acht Planeten und die bisherigen Monde', () => {
    expect(bodies.filter((b) => b.kind === 'planet')).toHaveLength(8);
    expect(bodies.filter((b) => b.kind === 'star')).toHaveLength(1);
    expect(bodies.map((b) => b.id)).toEqual(
      expect.arrayContaining([
        'moon', 'phobos', 'deimos', 'io', 'europa', 'ganymede', 'callisto',
      ]),
    );
  });

  it('gibt nur der Sonne keine Bahn', () => {
    for (const b of bodies) {
      if (b.id === 'sun') expect(b.orbit).toBeNull();
      else expect(b.orbit).not.toBeNull();
    }
  });

  // Dieser Test ist der eigentliche Zweck: er fängt Zahlendreher beim
  // Übertragen der JPL-Tabelle, bevor sie sich als Bahnfehler tarnen.
  it('hält die bekannten großen Halbachsen ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.38710, venus: 0.72333, earth: 1.00000, mars: 1.52371,
      jupiter: 5.20289, saturn: 9.53668, uranus: 19.18916, neptune: 30.06992,
    };
    for (const [id, a] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.a).toBeCloseTo(a, 4);
    }
  });

  it('hält die bekannten Exzentrizitäten ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.20564, venus: 0.00677, earth: 0.01671, mars: 0.09339,
      jupiter: 0.04839, saturn: 0.05386, uranus: 0.04726, neptune: 0.00859,
    };
    for (const [id, e] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.e).toBeCloseTo(e, 4);
    }
  });

  it('liefert plausible physikalische Daten', () => {
    for (const b of bodies) {
      expect(b.physical.radiusKm).toBeGreaterThan(0);
      expect(b.physical.massKg).toBeGreaterThan(0);
      expect(Math.abs(b.physical.rotationPeriodH)).toBeGreaterThan(0);
      // Die aus dem Pol abgeleitete Achsneigung ist ein Winkel und liegt
      // damit immer zwischen 0° und 180°; die eigentliche Prüfung der
      // Pollagen — gegen die bekannte, veröffentlichte Neigung — leistet
      // frames.test.ts.
      const neigung = axialTiltDeg(poleVector(b.physical.pole.raDeg, b.physical.pole.decDeg));
      expect(neigung).toBeGreaterThanOrEqual(0);
      expect(neigung).toBeLessThanOrEqual(180);
    }
    // Die Sonne ist der größte Körper im Katalog.
    const maxRadius = Math.max(...bodies.map((b) => b.physical.radiusKm));
    expect(getBody('sun').physical.radiusKm).toBe(maxRadius);
  });
});

describe('Katalog-Invarianten', () => {
  it('hat eindeutige IDs', () => {
    const ids = bodies.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('verweist nur auf existierende Mutterkörper', () => {
    for (const body of bodies) {
      if (body.parent === null) continue;
      expect(bodyIndex[body.parent], `Mutterkörper von ${body.id}`).toBeDefined();
    }
  });

  it('nutzt parentEquator nur, wo der Mutterkörper einen Pol hat', () => {
    for (const body of bodies) {
      if (body.orbit?.frame !== 'parentEquator') continue;
      const mutter = body.parent === null ? undefined : bodyIndex[body.parent];
      expect(mutter?.physical.pole, `Pol des Mutterkörpers von ${body.id}`).toBeDefined();
    }
  });

  it('kennt für jeden Körper einen Namensschlüssel mit hinterlegtem Text', () => {
    for (const body of bodies) {
      // t() gibt für unbekannte Schlüssel `[schlüssel]` zurück — genau darauf
      // wird geprüft. Ein Vergleich mit dem hinterlegten Text aus `de` würde
      // nur die Implementierung von t() nachbilden, ohne eine zusätzliche
      // Fehlerklasse zu fangen; ein Vergleich gegen den Schlüssel selbst wäre
      // zudem tautologisch, weil die eckigen Klammern ihn ohnehin verschieden
      // machen.
      expect(t(body.info.nameKey), body.id).not.toMatch(/^\[.*\]$/);
    }
  });

  it('führt Phobos und Deimos in der Marsäquatorebene', () => {
    for (const id of ['phobos', 'deimos']) {
      const mond = bodyIndex[id];
      expect(mond?.parent).toBe('mars');
      expect(mond?.orbit?.frame).toBe('parentEquator');
      expect(mond?.orbit?.i ?? 99).toBeLessThan(2);
    }
  });

  it('trifft die bekannten Bahnradien der Marsmonde', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer.
    expect((bodyIndex['phobos']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(9376, -2);
    expect((bodyIndex['deimos']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(23463, -2);
  });

  it('führt Io, Europa, Ganymed und Kallisto in der Jupiteräquatorebene', () => {
    for (const id of ['io', 'europa', 'ganymede', 'callisto']) {
      const mond = bodyIndex[id];
      expect(mond?.parent).toBe('jupiter');
      expect(mond?.orbit?.frame).toBe('parentEquator');
      expect(mond?.orbit?.i ?? 99).toBeLessThan(1);
    }
  });

  it('trifft die bekannten Bahnradien der Jupitermonde', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer.
    expect((bodyIndex['io']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(421800, -2);
    expect((bodyIndex['europa']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(671100, -2);
    expect((bodyIndex['ganymede']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(1070400, -2);
    expect((bodyIndex['callisto']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(1882700, -2);
  });

  // Der eigentliche Nachweis, dass die vier Datensätze zueinander passen:
  // Io, Europa und Ganymed stehen in der Laplace-Resonanz, ihre Umlaufzeiten
  // also im Verhältnis 1:2:4 — die Szene „Galileisches Schattenspiel" (später)
  // zeigt genau das.
  it('hält die Laplace-Resonanz 1:2:4 von Io, Europa und Ganymed', () => {
    // LDot ist die mittlere Länge in Grad je julianischem Jahrhundert;
    // die Umlaufzeit in Tagen ist 36525 / (LDot / 360).
    const periode = (id: string): number => 36525 / ((bodyIndex[id]?.orbit?.LDot ?? 0) / 360);
    expect(periode('europa') / periode('io')).toBeCloseTo(2, 1);
    expect(periode('ganymede') / periode('io')).toBeCloseTo(4, 1);
  });
});
