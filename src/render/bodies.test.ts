import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { pickRadiusUnits, MIN_RADIUS_UNITS, poleAusrichtung } from './bodies';
import { getBody } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { kmToUnits } from './units';
import { poleVector } from '../sim/frames';

describe('pickRadiusUnits', () => {
  it('rechnet den skalierten Radius in Render-Einheiten um', () => {
    const s = SCALE_PRESETS.realistisch;
    expect(pickRadiusUnits(getBody('earth'), s)).toBeCloseTo(kmToUnits(6371), 6);
  });

  it('wächst mit sizeScale', () => {
    const klein = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.realistisch);
    const gross = pickRadiusUnits(getBody('mars'), SCALE_PRESETS.kompakt);
    expect(gross).toBeGreaterThan(klein);
  });

  it('fällt nie unter die Mindestgröße', () => {
    // Sonst verschwände ein Körper bei winzigem sizeScale völlig aus der Geometrie.
    const winzig = { sizeScale: 1e-6, distanceExponent: 1, sunDamping: 1 };
    expect(pickRadiusUnits(getBody('moon'), winzig)).toBeGreaterThanOrEqual(MIN_RADIUS_UNITS);
  });

  it('hält die Sonne größer als jeden Planeten', () => {
    for (const s of Object.values(SCALE_PRESETS)) {
      expect(pickRadiusUnits(getBody('sun'), s))
        .toBeGreaterThan(pickRadiusUnits(getBody('jupiter'), s));
    }
  });
});

describe('poleAusrichtung', () => {
  it('richtet die lokale y-Achse der Kugel auf den Pol aus', () => {
    // Die SphereGeometry von Three hat ihre Pole auf der lokalen y-Achse.
    // Nach der Ausrichtung muss diese Achse in Weltkoordinaten genau in die
    // Polrichtung zeigen — sonst stehen Ringe und Mondbahnen schief zur Kugel.
    const pol = poleVector(40.589, 83.537);
    const q = poleAusrichtung(pol);
    const achse = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(achse.x).toBeCloseTo(pol.x, 10);
    expect(achse.y).toBeCloseTo(pol.y, 10);
    expect(achse.z).toBeCloseTo(pol.z, 10);
  });

  it('stellt die Kugel bei Pol = Ekliptiknormale aufrecht', () => {
    const q = poleAusrichtung({ x: 0, y: 0, z: 1 });
    const achse = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(achse.z).toBeCloseTo(1, 10);
  });
});
