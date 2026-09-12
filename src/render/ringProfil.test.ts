import { describe, it, expect } from 'vitest';
import type { RingBand } from '../sim/types';
import {
  bandDarstellungsbreiteKm, bandDeckkraft, ringProfilTexel,
  PROFIL_MIN_BREITE_KM, PROFIL_BREITENFAKTOR, PROFIL_DIFFUS_VERSTAERKUNG, PROFIL_DIFFUS_MAX,
} from './ringProfil';

// Drei Bänder aus der PDS-Tabelle für Uranus (siehe data/bodies/uranus.ts):
// der breite ε-Ring, der schmale 6-Ring und der diffuse ζ-Ring.
const epsilon: RingBand = { name: 'ε', radiusKm: 51149, widthKm: 58.1, opticalDepth: 1.5, art: 'schmal' };
const sechs: RingBand = { name: '6', radiusKm: 41838, widthKm: 1.53, opticalDepth: 0.3, art: 'schmal' };
const zeta: RingBand = { name: 'ζ', radiusKm: 39600, widthKm: 3500, opticalDepth: 0.0045, art: 'breit' };

describe('bandDarstellungsbreiteKm — schmale Ringe werden sichtbar verbreitert', () => {
  it('gibt schmalen Ringen mindestens die Mindestbreite', () => {
    expect(bandDarstellungsbreiteKm(sechs)).toBeGreaterThanOrEqual(PROFIL_MIN_BREITE_KM);
  });

  it('hält die Rangfolge der echten Breiten: ε bleibt deutlich breiter als 6', () => {
    expect(bandDarstellungsbreiteKm(epsilon)).toBeCloseTo(
      PROFIL_MIN_BREITE_KM + PROFIL_BREITENFAKTOR * 58.1, 9,
    );
    expect(bandDarstellungsbreiteKm(epsilon)).toBeGreaterThan(2 * bandDarstellungsbreiteKm(sechs));
  });

  it('lässt breite, diffuse Ringe in ihrer echten Breite', () => {
    expect(bandDarstellungsbreiteKm(zeta)).toBe(3500);
  });
});

describe('bandDeckkraft — Deckkraft aus der optischen Tiefe', () => {
  it('folgt bei schmalen Ringen dem Lambert-Beer-Gesetz 1 − e^(−τ)', () => {
    expect(bandDeckkraft(epsilon)).toBeCloseTo(1 - Math.exp(-1.5), 12);
    expect(bandDeckkraft(sechs)).toBeCloseTo(1 - Math.exp(-0.3), 12);
  });

  it('verstärkt diffuse Ringe um einen festen Faktor und deckelt sie', () => {
    expect(bandDeckkraft(zeta)).toBeCloseTo(Math.min(PROFIL_DIFFUS_MAX, 0.0045 * PROFIL_DIFFUS_VERSTAERKUNG), 12);
    const dicht: RingBand = { ...zeta, opticalDepth: 0.5 };
    expect(bandDeckkraft(dicht)).toBe(PROFIL_DIFFUS_MAX);
  });

  it('bleibt in [0, 1]', () => {
    const extrem: RingBand = { ...epsilon, opticalDepth: 50 };
    expect(bandDeckkraft(extrem)).toBeLessThanOrEqual(1);
    expect(bandDeckkraft({ ...epsilon, opticalDepth: 0 })).toBe(0);
  });
});

describe('ringProfilTexel — der radiale Streifen', () => {
  const innen = 37800;
  const aussen = 51600;
  const breite = 2048;
  const farbe: [number, number, number] = [172, 162, 152];
  const texel = ringProfilTexel([epsilon, sechs, zeta], innen, aussen, breite, farbe);
  const alphaBei = (radiusKm: number): number => {
    const i = Math.min(breite - 1, Math.floor(((radiusKm - innen) / (aussen - innen)) * breite));
    return texel[i * 4 + 3]! / 255;
  };

  it('liefert RGBA für jeden Texel', () => {
    expect(texel.length).toBe(breite * 4);
  });

  it('trägt überall dieselbe Farbe — die Struktur steckt allein im Alphakanal', () => {
    for (let i = 0; i < breite; i++) {
      expect(texel[i * 4]).toBe(172);
      expect(texel[i * 4 + 1]).toBe(162);
      expect(texel[i * 4 + 2]).toBe(152);
    }
  });

  it('ist im ε-Ring so deckend wie bandDeckkraft es vorgibt', () => {
    expect(alphaBei(51149)).toBeCloseTo(bandDeckkraft(epsilon), 2);
  });

  it('ist in einer Lücke ohne Band vollständig durchsichtig', () => {
    // 45 000 km: zwischen α (44 718) und β (45 661), im Test kein Band.
    expect(alphaBei(45000)).toBe(0);
  });

  it('zeigt den diffusen ζ-Ring als schwachen Schleier', () => {
    const a = alphaBei(39600);
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThanOrEqual(PROFIL_DIFFUS_MAX + 1 / 255);
  });

  it('verbreitert den 6-Ring auf seine Darstellungsbreite', () => {
    const halb = bandDarstellungsbreiteKm(sechs) / 2;
    expect(alphaBei(41838 - halb * 0.9)).toBeGreaterThan(0);
    expect(alphaBei(41838 + halb * 0.9)).toBeGreaterThan(0);
    expect(alphaBei(41838 - halb * 1.5)).toBe(0);
  });

  it('setzt überlappende Bänder als Schichten zusammen (1 − Π(1 − aᵢ))', () => {
    const doppelt = ringProfilTexel([sechs, sechs], innen, aussen, breite, farbe);
    const i = Math.floor(((41838 - innen) / (aussen - innen)) * breite);
    const a = bandDeckkraft(sechs);
    expect(doppelt[i * 4 + 3]! / 255).toBeCloseTo(1 - (1 - a) * (1 - a), 2);
  });

  it('schneidet Bänder an den Streifenrändern ab, ohne zu überlaufen', () => {
    const rand: RingBand = { ...epsilon, radiusKm: aussen };
    const t = ringProfilTexel([rand], innen, aussen, breite, farbe);
    expect(t.length).toBe(breite * 4);
    expect(t[(breite - 1) * 4 + 3]).toBeGreaterThan(0);
  });
});
