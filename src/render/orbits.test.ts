import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createOrbitLines, orbitPointsKm, ORBIT_SEGMENTS } from './orbits';
import { bodyIndex } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { scaledPositionAt } from '../sim/scale';
import { J2000 } from '../sim/time';
import { kmToUnits } from './units';

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

describe('createOrbitLines — Mondbahn über die Zeit', () => {
  const s = SCALE_PRESETS.schaubild;

  /** Abstände aller Stützpunkte der Linie zur aktuellen Position der Erde. */
  function abstaendeZurErde(jd: number): number[] {
    const szene = new THREE.Scene();
    const linien = createOrbitLines(szene);
    // Aufbau zur Epoche — danach läuft nur noch die Zeit weiter, der
    // Maßstab bleibt gleich, es gibt also keinen weiteren rebuild.
    linien.rebuild(J2000, s);
    linien.update(new THREE.Vector3(0, 0, 0), {}, true, jd, s);

    const linie = linien.lines.get('moon');
    if (linie === undefined) throw new Error('Mondlinie fehlt');
    const attr = linie.geometry.getAttribute('position');
    const erde = scaledPositionAt('earth', bodyIndex, jd, s);

    const werte: number[] = [];
    for (let i = 0; i < attr.count; i++) {
      werte.push(betrag({
        x: attr.getX(i) - kmToUnits(erde.x),
        y: attr.getY(i) - kmToUnits(erde.y),
        z: attr.getZ(i) - kmToUnits(erde.z),
      }));
    }
    return werte;
  }

  it('bleibt zehn Tage nach dem Aufbau um die Erde herum', () => {
    // Ohne Nachführung bliebe die Schleife an der Erdposition des Aufbaus
    // kleben — nach zehn Tagen liegt die Erde rund 25 Mio. km weiter, also
    // deutlich außerhalb der (mit sizeScale skalierten) Mondbahn.
    const abstaende = abstaendeZurErde(J2000 + 10);
    expect(Math.min(...abstaende)).toBeGreaterThan(kmToUnits(300_000 * s.sizeScale));
    expect(Math.max(...abstaende)).toBeLessThan(kmToUnits(460_000 * s.sizeScale));
  });

  it('liegt direkt nach dem Aufbau um die Erde herum', () => {
    const abstaende = abstaendeZurErde(J2000);
    expect(Math.min(...abstaende)).toBeGreaterThan(kmToUnits(300_000 * s.sizeScale));
    expect(Math.max(...abstaende)).toBeLessThan(kmToUnits(460_000 * s.sizeScale));
  });

  // Die Probe aufs Exempel: Kugel und Linie stammen aus getrennten Pfaden
  // (bodies.ts beziehungsweise orbits.ts). Laufen sie auseinander, stimmt
  // eine der beiden Verankerungen nicht.
  it('trägt den Mond auf seiner eigenen Bahnlinie', () => {
    for (const versatzTage of [0, 1, 10, 27]) {
      const jd = J2000 + versatzTage;
      const szene = new THREE.Scene();
      const linien = createOrbitLines(szene);
      linien.rebuild(J2000, s);
      linien.update(new THREE.Vector3(0, 0, 0), {}, true, jd, s);

      const attr = linien.lines.get('moon')!.geometry.getAttribute('position');
      const mond = scaledPositionAt('moon', bodyIndex, jd, s);
      let naechster = Infinity;
      for (let i = 0; i < attr.count; i++) {
        naechster = Math.min(naechster, betrag({
          x: attr.getX(i) - kmToUnits(mond.x),
          y: attr.getY(i) - kmToUnits(mond.y),
          z: attr.getZ(i) - kmToUnits(mond.z),
        }));
      }
      // Zwei Prozent des Bahnradius — mehr als der Abstand zweier der 512
      // Stützpunkte, aber weit unter jeder sichtbaren Ablösung.
      expect(naechster, `${versatzTage} Tage nach dem Aufbau`)
        .toBeLessThan(kmToUnits(0.02 * 384_400 * s.sizeScale));
    }
  });
});
