import { describe, it, expect } from 'vitest';
import {
  srgbZuLinear, mittlereReflexion, albedoFaktor, farbMittelLinear,
  LUECKEN_SCHWELLE_LINEAR, ALBEDO_FAKTOR_MIN, ALBEDO_FAKTOR_MAX,
} from './albedo';
import { bodies } from '../data/index';
import { TEXTUREN } from '../data/texturen';
import fixture from './__fixtures__/textur-mittel.json';

/** Prüfspalte der Fixture — Schlüssel `textures/<koerper>/albedo.jpg` wie im bisherigen Katalog. */
const soll = fixture.mittel as Record<string, number>;

/** RGBA-Feld aus Grauwerten (eine Zahl je Pixel), zeilenweise. */
function grauBild(zeilen: number[][]): { daten: number[]; breite: number; hoehe: number } {
  const daten: number[] = [];
  for (const zeile of zeilen) for (const g of zeile) daten.push(g, g, g, 255);
  return { daten, breite: zeilen[0]!.length, hoehe: zeilen.length };
}

describe('srgbZuLinear', () => {
  it('bildet die Enden und das Mittelgrau der sRGB-Kurve ab', () => {
    expect(srgbZuLinear(0)).toBe(0);
    expect(srgbZuLinear(255)).toBeCloseTo(1, 12);
    // 128/255 = 0,502 → ((0,502 + 0,055) / 1,055)^2,4 = 0,2158
    expect(srgbZuLinear(128)).toBeCloseTo(0.2158, 3);
  });
});

describe('mittlereReflexion', () => {
  it('liefert für eine einfarbige Karte die lineare Reflexion dieser Farbe', () => {
    const { daten, breite, hoehe } = grauBild([[128, 128, 128, 128], [128, 128, 128, 128]]);
    expect(mittlereReflexion(daten, breite, hoehe)).toBeCloseTo(srgbZuLinear(128), 12);
  });

  it('gewichtet Polzeilen mit dem Kosinus der Breite', () => {
    // Vier Zeilen = Breiten +67,5°, +22,5°, −22,5°, −67,5°; Gewichte
    // cos = 0,3827, 0,9239, 0,9239, 0,3827. Die helle Zeile liegt am Pol:
    //   (1,0·0,3827 + 0,0513·(0,9239 + 0,9239 + 0,3827)) / 2,6131 = 0,1903,
    // ungewichtet wären es (1,0 + 3·0,0513) / 4 = 0,2885.
    const { daten, breite, hoehe } = grauBild([[255], [64], [64], [64]]);
    const gewichtet = mittlereReflexion(daten, breite, hoehe)!;
    expect(gewichtet).toBeCloseTo(0.1903, 3);
    expect(gewichtet).toBeLessThan((1 + 3 * srgbZuLinear(64)) / 4);
  });

  it('lässt Datenlücken (unbelichtete, schwarze Kartenteile) aus dem Mittel heraus', () => {
    const { daten, breite, hoehe } = grauBild([[255, 0]]);
    expect(mittlereReflexion(daten, breite, hoehe)).toBeCloseTo(1, 12);
  });

  it('liefert null, wenn kein Pixel über der Lückenschwelle liegt', () => {
    const { daten, breite, hoehe } = grauBild([[0, 0], [0, 0]]);
    expect(mittlereReflexion(daten, breite, hoehe)).toBeNull();
    expect(srgbZuLinear(1)).toBeLessThan(LUECKEN_SCHWELLE_LINEAR);
  });
});

describe('albedoFaktor', () => {
  it('normiert das Texturmittel auf die Albedo', () => {
    // Enceladus: Karte 0,178 linear, Albedo 1,0 → Faktor 5,6.
    expect(albedoFaktor(1.0, 0.178)).toBeCloseTo(5.618, 2);
  });

  it('ist 1 ohne Albedo (Sonne) und ohne Messwert (Textur noch nicht geladen)', () => {
    expect(albedoFaktor(undefined, 0.5)).toBe(1);
    expect(albedoFaktor(0.5, null)).toBe(1);
    expect(albedoFaktor(0.5, 0)).toBe(1);
  });

  it('klemmt nach oben und unten — Zahlenwächter, keine Gestaltung', () => {
    expect(albedoFaktor(1.0, 0.01)).toBe(ALBEDO_FAKTOR_MAX);
    expect(albedoFaktor(0.05, 0.9)).toBe(ALBEDO_FAKTOR_MIN);
  });
});

describe('farbMittelLinear', () => {
  it('rechnet die Ausweichfarbe in mittlere lineare Reflexion um', () => {
    expect(farbMittelLinear('#ffffff')).toBeCloseTo(1, 12);
    expect(farbMittelLinear('#000000')).toBe(0);
    expect(farbMittelLinear('#808080')).toBeCloseTo(srgbZuLinear(128), 12);
    // Kanalweise, dann Mittel: (lin(255) + lin(0) + lin(0)) / 3
    expect(farbMittelLinear('#ff0000')).toBeCloseTo(1 / 3, 12);
  });
});

describe('Katalog — kein Körper erreicht die Klemme', () => {
  it('hat für jeden Körper mit Texturstufen einen Messwert in der Fixture', () => {
    for (const id of Object.keys(TEXTUREN)) {
      expect(soll[`textures/${id}/albedo.jpg`], id).toBeGreaterThan(0);
    }
  });

  it('liegt mit albedo / Texturmittel für jeden Körper strikt innerhalb der Klemme', () => {
    for (const body of bodies) {
      const stufen = TEXTUREN[body.id];
      if (stufen === undefined || body.kind === 'star') continue;
      const roh = body.physical.albedo! / stufen[0]!.mittel;
      expect(roh, body.id).toBeGreaterThan(ALBEDO_FAKTOR_MIN);
      expect(roh, body.id).toBeLessThan(ALBEDO_FAKTOR_MAX);
    }
  });

  it('liegt mit albedo / Ausweichfarbe für Körper ohne Textur ebenfalls innerhalb der Klemme', () => {
    for (const body of bodies) {
      if (TEXTUREN[body.id] !== undefined || body.kind === 'star') continue;
      const roh = body.physical.albedo! / farbMittelLinear(body.appearance.color);
      expect(roh, body.id).toBeGreaterThan(ALBEDO_FAKTOR_MIN);
      expect(roh, body.id).toBeLessThan(ALBEDO_FAKTOR_MAX);
    }
  });
});
