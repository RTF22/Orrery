import { describe, it, expect } from 'vitest';
import { orbitPointsKm, ORBIT_SEGMENTS } from './orbits';
import { bodyIndex } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { scaledPositionAt } from '../sim/scale';
import { J2000 } from '../sim/time';

const betrag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

describe('orbitPointsKm', () => {
  const s = SCALE_PRESETS.schaubild;

  it('liefert einen geschlossenen Linienzug', () => {
    const p = orbitPointsKm('mars', bodyIndex, J2000, s);
    expect(p).toHaveLength(ORBIT_SEGMENTS + 1);
    const ersteZuLetzt = betrag({
      x: p[0]!.x - p[ORBIT_SEGMENTS]!.x,
      y: p[0]!.y - p[ORBIT_SEGMENTS]!.y,
      z: p[0]!.z - p[ORBIT_SEGMENTS]!.z,
    });
    expect(ersteZuLetzt / betrag(p[0]!)).toBeLessThan(0.001);
  });

  it('läuft durch die aktuelle Position des Körpers', () => {
    const jetzt = scaledPositionAt('earth', bodyIndex, J2000, s);
    const p = orbitPointsKm('earth', bodyIndex, J2000, s);
    const naechster = Math.min(...p.map((q) => betrag({
      x: q.x - jetzt.x, y: q.y - jetzt.y, z: q.z - jetzt.z,
    })));
    expect(naechster / betrag(jetzt)).toBeLessThan(0.01);
  });

  it('gibt für die Sonne keine Bahn zurück', () => {
    expect(orbitPointsKm('sun', bodyIndex, J2000, s)).toHaveLength(0);
  });

  // Die Mondbahn ist der Härtefall: Über eine Mondumlaufzeit zieht die Erde
  // selbst rund 0,46 AE weiter. Würde die Bahn im Inertialsystem abgetastet,
  // ergäbe sich eine Zykloide quer durchs Sonnensystem statt einer Ellipse.
  it('zeichnet die Mondbahn als geschlossene Schleife um die Erde', () => {
    const mond = orbitPointsKm('moon', bodyIndex, J2000, s);
    const erde = scaledPositionAt('earth', bodyIndex, J2000, s);
    const abstaende = mond.map((q) => betrag({
      x: q.x - erde.x, y: q.y - erde.y, z: q.z - erde.z,
    }));

    // Mondabstände skalieren laut Maßstabsmodell mit sizeScale.
    expect(Math.min(...abstaende)).toBeGreaterThan(300_000 * s.sizeScale);
    expect(Math.max(...abstaende)).toBeLessThan(460_000 * s.sizeScale);

    const zu = betrag({
      x: mond[0]!.x - mond[ORBIT_SEGMENTS]!.x,
      y: mond[0]!.y - mond[ORBIT_SEGMENTS]!.y,
      z: mond[0]!.z - mond[ORBIT_SEGMENTS]!.z,
    });
    expect(zu).toBeLessThan(20_000 * s.sizeScale);
  });
});
