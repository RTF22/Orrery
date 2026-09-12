import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { ringGeometrieDaten, ringAusrichtung } from './rings';
import { poleVector } from '../sim/frames';

describe('ringGeometrieDaten', () => {
  const daten = ringGeometrieDaten(2, 5, 64);

  it('legt zwei Punkte je Segmentgrenze an — innen und außen', () => {
    // 65 Segmentgrenzen (0..64, das letzte deckt sich mit dem ersten, damit
    // der Ring ohne Naht schließt), je zwei Punkte (innen/außen), je drei
    // Koordinaten (x, y, z).
    expect(daten.positions.length / 3).toBe(2 * (64 + 1));
  });

  it('hält alle Punkte in der lokalen xy-Ebene', () => {
    for (let i = 2; i < daten.positions.length; i += 3) {
      expect(daten.positions[i]).toBe(0);
    }
  });

  it('trifft Innen- und Außenradius genau', () => {
    // Nachkommastellen hergeleitet, nicht wie im Task-12-Brief mit 10
    // behauptet: `positions` ist laut Signatur ein Float32Array, und
    // float32 hat rund 7 signifikante Dezimalstellen. Für einen Betrag im
    // Bereich 2..5 (Exponent 1..2) liegt der größte Rundungsfehler eines
    // einzelnen Float64-nach-Float32-Rundungsschritts bei 2^(Exponent-24),
    // also rund 1,19·10⁻⁷ (r=2) bzw. 2,38·10⁻⁷ (r=5); hypot() zweier
    // gerundeter Komponenten bleibt in derselben Größenordnung. Numerisch
    // nachgemessen (alle 65 Stützpunkte, r=2 und r=5): größte Abweichung
    // 5,77·10⁻⁸ bzw. 1,45·10⁻⁷. 10 Nachkommastellen (Schwelle 5·10⁻¹¹) sind
    // für ein Float32Array damit unerreichbar; 6 Stellen (Schwelle 5·10⁻⁷)
    // liegen mit gut dreifacher Marge über dem gemessenen Höchstfehler.
    for (let i = 0; i < daten.positions.length; i += 6) {
      const rInnen = Math.hypot(daten.positions[i]!, daten.positions[i + 1]!);
      const rAussen = Math.hypot(daten.positions[i + 3]!, daten.positions[i + 4]!);
      expect(rInnen).toBeCloseTo(2, 6);
      expect(rAussen).toBeCloseTo(5, 6);
    }
  });

  it('legt u radial: 0 an der Innenkante, 1 an der Außenkante', () => {
    for (let i = 0; i < daten.uvs.length; i += 4) {
      expect(daten.uvs[i]).toBeCloseTo(0, 10);
      expect(daten.uvs[i + 2]).toBeCloseTo(1, 10);
    }
  });

  it('bildet je Segment zwei Dreiecke', () => {
    // Pro Segment ein Viereck aus zwei Punktpaaren, aufgeteilt in zwei
    // Dreiecke zu je drei Indizes: 64 Segmente * 2 Dreiecke * 3 Indizes.
    expect(daten.indices.length).toBe(64 * 6);
  });
});

describe('ringAusrichtung', () => {
  it('stellt die Ringebene senkrecht auf den Pol', () => {
    const pol = poleVector(40.589, 83.537); // Saturn
    const normale = new THREE.Vector3(0, 0, 1).applyQuaternion(ringAusrichtung(pol));
    expect(normale.x).toBeCloseTo(pol.x, 10);
    expect(normale.y).toBeCloseTo(pol.y, 10);
    expect(normale.z).toBeCloseTo(pol.z, 10);
  });
});
