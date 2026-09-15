import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createOrbitLines, ORBIT_SEGMENTS } from './orbits';
import { bodies, bodyIndex } from '../data/index';
import { SCALE_PRESETS, scaledPositionAt, isSatellite } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';
import { J2000 } from '../sim/time';
import type { Vec3 } from '../sim/types';
import { kmToUnits } from './units';

const betrag = (v: Vec3): number => Math.hypot(v.x, v.y, v.z);

/**
 * Stützpunkte einer Linie nach genau einem update-Aufruf. Alle anderen Linien
 * sind ausgeblendet, damit der Test nur die eine rechnet. Die Kamera steht an
 * der übergebenen Stelle — in der Nähe des Körpers bleiben die Float32-Werte
 * klein und genau.
 */
function linieNachUpdate(id: string, jd: number, s: ScaleSettings, kameraKm: Vec3): Vec3[] {
  const linien = createOrbitLines(new THREE.Scene());
  const nurDiese = Object.fromEntries(bodies.map((b) => [b.id, b.id === id]));
  linien.update(new THREE.Vector3(kameraKm.x, kameraKm.y, kameraKm.z), nurDiese, true, jd, s);
  const linie = linien.lines.get(id);
  if (linie === undefined) throw new Error(`Linie fehlt: ${id}`);
  const attr = linie.geometry.getAttribute('position');
  const punkte: Vec3[] = [];
  for (let i = 0; i < attr.count; i++) {
    punkte.push({ x: attr.getX(i), y: attr.getY(i), z: attr.getZ(i) });
  }
  return punkte;
}

/** Kleinster Abstand des Punkts zum Linienzug — zu den Segmenten, nicht nur zu den Stützpunkten. */
function abstandZumLinienzug(p: Vec3, zug: Vec3[]): number {
  let min = Infinity;
  for (let i = 0; i + 1 < zug.length; i++) {
    const a = zug[i]!;
    const b = zug[i + 1]!;
    const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
    const ap = { x: p.x - a.x, y: p.y - a.y, z: p.z - a.z };
    const laenge2 = ab.x ** 2 + ab.y ** 2 + ab.z ** 2;
    const t = laenge2 === 0
      ? 0
      : Math.min(Math.max((ap.x * ab.x + ap.y * ab.y + ap.z * ab.z) / laenge2, 0), 1);
    min = Math.min(min, betrag({ x: ap.x - t * ab.x, y: ap.y - t * ab.y, z: ap.z - t * ab.z }));
  }
  return min;
}

/** Dargestellter Bahnradius: zum Mutterkörper bei Satelliten, sonst zur Sonne. */
function bahnradiusKm(id: string, jd: number, s: ScaleSettings): number {
  const body = bodyIndex[id]!;
  const p = scaledPositionAt(id, bodyIndex, jd, s);
  if (!isSatellite(body)) return betrag(p);
  const m = scaledPositionAt(body.parent!, bodyIndex, jd, s);
  return betrag({ x: p.x - m.x, y: p.y - m.y, z: p.z - m.z });
}

const MIT_BAHN = bodies.filter((b) => b.orbit !== null).map((b) => b.id);
const VERSAETZE_TAGE = [0, 30, 365, 3650, -3650];

describe('createOrbitLines', () => {
  it('legt für die Sonne keine Linie an', () => {
    const linien = createOrbitLines(new THREE.Scene());
    expect(linien.lines.has('sun')).toBe(false);
    expect(linien.lines.size).toBe(MIT_BAHN.length);
  });

  it('schließt jede Linie', () => {
    const s = SCALE_PRESETS.schaubild;
    for (const id of ['mars', 'moon', 'eris']) {
      const zug = linieNachUpdate(id, J2000, s, scaledPositionAt(id, bodyIndex, J2000, s));
      expect(zug).toHaveLength(ORBIT_SEGMENTS + 1);
      // Eine Linie aus lauter Nullpunkten hätte ebenfalls keine Lücke.
      expect(Math.max(...zug.map(betrag)), id).toBeGreaterThan(kmToUnits(bahnradiusKm(id, J2000, s)));
      const erster = zug[0]!;
      const letzter = zug[ORBIT_SEGMENTS]!;
      const luecke = betrag({ x: erster.x - letzter.x, y: erster.y - letzter.y, z: erster.z - letzter.z });
      expect(luecke / kmToUnits(bahnradiusKm(id, J2000, s)), id).toBeLessThan(1e-4);
    }
  });

  // Der Fehler, den diese Tests festhalten: Die Linie wurde nur bei einer
  // Maßstabsänderung neu abgetastet. Monde mit schnell wandernden Elementen
  // (Knoten, Perizentrum) lösten sich dann mit der Zeit von ihrer Linie — der
  // Erdmond nach zehn Jahren um 14 % des Bahnradius.
  for (const preset of ['schaubild', 'realistisch'] as const) {
    it(`trägt jeden Körper zu jeder Zeit auf seiner eigenen Linie (${preset})`, () => {
      const s = SCALE_PRESETS[preset];
      for (const id of MIT_BAHN) {
        for (const tage of VERSAETZE_TAGE) {
          const jd = J2000 + tage;
          const koerper = scaledPositionAt(id, bodyIndex, jd, s);
          const zug = linieNachUpdate(id, jd, s, koerper);
          const radius = kmToUnits(bahnradiusKm(id, jd, s));
          const kennung = `${id}, ${tage} Tage`;

          // Eine Linie aus lauter Nullpunkten läge ebenfalls „auf" dem Körper
          // in der Bildmitte — sie muss sich deshalb wirklich um ihn spannen.
          expect(Math.max(...zug.map(betrag)), kennung).toBeGreaterThan(radius);
          expect(abstandZumLinienzug({ x: 0, y: 0, z: 0 }, zug) / radius, kennung)
            .toBeLessThan(1e-3);
        }
      }
    });
  }

  it('legt die Mondbahn auch nach Jahren um die Erde', () => {
    const s = SCALE_PRESETS.schaubild;
    for (const tage of [10, 3650]) {
      const jd = J2000 + tage;
      const erde = scaledPositionAt('earth', bodyIndex, jd, s);
      const abstaende = linieNachUpdate('moon', jd, s, erde).map(betrag);
      expect(Math.min(...abstaende)).toBeGreaterThan(kmToUnits(300_000 * s.sizeScale));
      expect(Math.max(...abstaende)).toBeLessThan(kmToUnits(460_000 * s.sizeScale));
    }
  });
});
