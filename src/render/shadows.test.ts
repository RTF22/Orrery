import { describe, it, expect } from 'vitest';
import {
  sonnenAnteil, ringTreffer, sonnenGeometrie, waehleOkkluder, kernschattenFarbeLinear,
  MAX_OKKLUDER,
  SCHATTEN_GLSL_FUNKTIONEN, SCHATTEN_GLSL_KOERPER_PARS, SCHATTEN_GLSL_KOERPER_ANWENDUNG,
  SCHATTEN_GLSL_VERTEX_PARS, SCHATTEN_GLSL_VERTEX,
} from './shadows';
import type { RingOkkluder } from './shadows';
import type { Vec3 } from '../sim/types';
import { bodies, bodyIndex, getBody } from '../data/index';
import { positionAt } from '../sim/orbit';
import { scaledPositionAt, scaledRadius, SCALE_PRESETS } from '../sim/scale';
import { poleVector } from '../sim/frames';
import { J2000 } from '../sim/time';
import { createRng, pickInRange } from '../sim/random';

describe('sonnenAnteil — Kreisüberlappung zweier Scheiben', () => {
  // (a) Sonne und Okkluder liegen so weit auseinander, dass sich ihre
  // Scheiben gar nicht berühren — voll sichtbar.
  it('gamma ≥ alpha + beta → volle Sonne (1)', () => {
    expect(sonnenAnteil(0.005, 0.01, 0.02)).toBe(1);
  });

  // (b) Der Okkluder ist mindestens so groß wie die Sonne und deckt sie
  // bei diesem Abstand vollständig — Kernschatten.
  it('beta ≥ alpha, gamma ≤ beta − alpha → voll verdeckt (0)', () => {
    expect(sonnenAnteil(0.005, 0.1, 0.01)).toBe(0);
  });

  // (c) Kleiner, zentrierter Okkluder (gamma = 0): der unverdeckte Anteil
  // ist die Ringfläche außerhalb der Okkluderscheibe, als Flächenverhältnis
  // 1 − (beta/alpha)².
  it('beta < alpha, gamma = 0 → 1 − (beta/alpha)² (0,75)', () => {
    expect(sonnenAnteil(0.01, 0.005, 0)).toBeCloseTo(0.75, 9);
  });

  // (d) Monotonie: alpha + beta = 0,025 (erster Wert trifft exakt die
  // Vollsichtbarkeits-Schwelle), beta − alpha = 0,015 (letzter Wert trifft
  // exakt die Kernschatten-Schwelle) — dazwischen fällt der Anteil streng.
  it('fällt mit sinkendem gamma streng monoton (alpha=0,005, beta=0,02)', () => {
    const alpha = 0.005;
    const beta = 0.02;
    const f1 = sonnenAnteil(alpha, beta, 0.025);
    const f2 = sonnenAnteil(alpha, beta, 0.020);
    const f3 = sonnenAnteil(alpha, beta, 0.015);
    expect(f1).toBeGreaterThan(f2);
    expect(f2).toBeGreaterThan(f3);
  });

  // (e) Gleich große Scheiben im Abstand eines Radius: die Linsenfläche
  // ist geschlossen ausrechenbar (Kreissegment-Formel) und dient als
  // unabhängige Gegenprobe der allgemeinen Formel.
  it('gleich große Scheiben im Abstand eines Radius → 0,6090 unverdeckt', () => {
    const r = 0.01;
    const linse = 2 * r * r * Math.acos(0.5) - r * Math.sqrt(r * r - r * r / 4);
    const erwartet = 1 - linse / (Math.PI * r * r);
    expect(erwartet).toBeCloseTo(0.609, 3);
    expect(sonnenAnteil(r, r, r)).toBeCloseTo(0.609, 3);
  });

  // (f) Wertebereich: für 1000 zufällige, seedfeste Tripel bleibt das
  // Ergebnis in [0, 1] — auch dort, wo die allgemeine Linsenformel greift.
  it('bleibt für 1000 zufällige Tripel in [0, 1]', () => {
    const rng = createRng(20260913);
    for (let i = 0; i < 1000; i++) {
      const alpha = pickInRange(rng, [0.0005, 1]);
      const beta = pickInRange(rng, [0.0005, 1]);
      const gamma = pickInRange(rng, [0, 3]);
      const f = sonnenAnteil(alpha, beta, gamma);
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(1);
    }
  });
});

describe('ringTreffer — Strahl gegen Ringebene', () => {
  const ringZ: RingOkkluder = {
    bodyId: 'ring-z', mitte: { x: 0, y: 0, z: 0 }, normale: { x: 0, y: 0, z: 1 },
    innen: 2, aussen: 4,
  };

  it('trifft den Ringbereich bei u = 0,5', () => {
    const u = ringTreffer({ x: 3, y: 0, z: -1 }, { x: 0, y: 0, z: 1 }, ringZ);
    expect(u).toBeCloseTo(0.5, 9);
  });

  it('Treffer außerhalb des Ringbereichs (u > 1) → null', () => {
    expect(ringTreffer({ x: 5, y: 0, z: -1 }, { x: 0, y: 0, z: 1 }, ringZ)).toBeNull();
  });

  it('Ebene liegt hinter dem Start (t ≤ 0) → null', () => {
    expect(ringTreffer({ x: 3, y: 0, z: 1 }, { x: 0, y: 0, z: 1 }, ringZ)).toBeNull();
  });

  it('Richtung parallel zur Ringebene (Nenner ≈ 0) → null', () => {
    expect(ringTreffer({ x: 3, y: 0, z: -1 }, { x: 1, y: 0, z: 0 }, ringZ)).toBeNull();
  });

  it('Uranus-Fall: Normale (1,0,0), seitlicher Start → u = 0,5', () => {
    const ringX: RingOkkluder = {
      bodyId: 'ring-x', mitte: { x: 0, y: 0, z: 0 }, normale: { x: 1, y: 0, z: 0 },
      innen: 2, aussen: 4,
    };
    const u = ringTreffer({ x: -1, y: 3, z: 0 }, { x: 1, y: 0, z: 0 }, ringX);
    expect(u).toBeCloseTo(0.5, 9);
  });
});

describe('sonnenGeometrie — echte Sonnenrichtung und Sonnenwinkel', () => {
  it('earth: Richtung entgegen positionAt, Winkel ≈ asin(695700/|r|)', () => {
    const r = positionAt('earth', bodyIndex, J2000);
    const betrag = Math.hypot(r.x, r.y, r.z);
    const g = sonnenGeometrie('earth', bodyIndex, J2000);

    expect(Math.hypot(g.richtung.x, g.richtung.y, g.richtung.z)).toBeCloseTo(1, 12);
    expect(g.richtung.x).toBeCloseTo(-r.x / betrag, 12);
    expect(g.richtung.y).toBeCloseTo(-r.y / betrag, 12);
    expect(g.richtung.z).toBeCloseTo(-r.z / betrag, 12);
    // 695 700 km ist der Sonnenradius (sun.physical.radiusKm).
    expect(g.winkelRad).toBeCloseTo(Math.asin(695_700 / betrag), 5);
  });

  it('moon: Richtung weicht durch Parallaxe leicht von der Erdrichtung ab', () => {
    const gErde = sonnenGeometrie('earth', bodyIndex, J2000);
    const gMond = sonnenGeometrie('moon', bodyIndex, J2000);
    const cosWinkel = gErde.richtung.x * gMond.richtung.x
      + gErde.richtung.y * gMond.richtung.y + gErde.richtung.z * gMond.richtung.z;
    const winkel = Math.acos(Math.min(Math.max(cosWinkel, -1), 1));
    // Nicht identisch (Parallaxe zwischen Erd- und Mondstandort) ...
    expect(winkel).toBeGreaterThan(0);
    // ... aber klein, weil der Erde-Mond-Abstand winzig gegen den
    // Sonnenabstand ist.
    expect(winkel).toBeLessThan(0.003);
  });
});

describe('waehleOkkluder — Okkluderauswahl aus dargestellten Positionen/Radien', () => {
  // Dargestellte Positionen/Radien wie sie bodies.ts pro Frame schon hat:
  // scaledPositionAt/scaledRadius bei J2000 unter dem Schaubild-Maßstab.
  const s = SCALE_PRESETS.schaubild;
  const positionen = new Map<string, Vec3>();
  const radien = new Map<string, number>();
  for (const b of bodies) {
    positionen.set(b.id, scaledPositionAt(b.id, bodyIndex, J2000, s));
    radien.set(b.id, scaledRadius(b, s));
  }
  const position = (id: string): Vec3 | undefined => positionen.get(id);
  const radius = (id: string): number | undefined => radien.get(id);

  function winkelradius(basis: Vec3, mitte: Vec3, r: number): number {
    const d = Math.hypot(mitte.x - basis.x, mitte.y - basis.y, mitte.z - basis.z);
    return Math.asin(Math.min(r / d, 1));
  }

  it('moon: Mutterplanet zuerst, keine Sonne, kein moon selbst, kein Ring', () => {
    const a = waehleOkkluder(getBody('moon'), bodyIndex, position, radius);
    expect(a.kugeln.length).toBeGreaterThan(0);
    expect(a.kugeln[0]!.id).toBe('earth');
    expect(a.kugeln.some((k) => k.id === 'sun')).toBe(false);
    expect(a.kugeln.some((k) => k.id === 'moon')).toBe(false);
    expect(a.ring).toBeNull();
  });

  it('jupiter: höchstens MAX_OKKLUDER Kugeln, alle Jupitermonde, absteigend sortiert', () => {
    const a = waehleOkkluder(getBody('jupiter'), bodyIndex, position, radius);
    expect(a.kugeln.length).toBeLessThanOrEqual(MAX_OKKLUDER);
    expect(a.kugeln.length).toBeGreaterThan(0);
    for (const k of a.kugeln) expect(getBody(k.id).parent).toBe('jupiter');

    const basis = position('jupiter')!;
    const winkel = a.kugeln.map((k) => winkelradius(basis, k.mitte, k.radius));
    for (let i = 1; i < winkel.length; i++) {
      // "Folge nicht steigend": jeder nächste Winkel ist höchstens so groß
      // wie der vorherige (kleine Toleranz gegen Gleichstand-Rundung).
      expect(winkel[i]!).toBeLessThanOrEqual(winkel[i - 1]! + 1e-12);
    }
  });

  it('io: Jupiter zuerst, restliche Ids aus den Jupitermonden, nie io selbst', () => {
    const a = waehleOkkluder(getBody('io'), bodyIndex, position, radius);
    expect(a.kugeln[0]!.id).toBe('jupiter');
    expect(a.kugeln.some((k) => k.id === 'io')).toBe(false);
    for (const k of a.kugeln.slice(1)) expect(getBody(k.id).parent).toBe('jupiter');
  });

  it('saturn: Ring mit den Fact-Sheet-Radien × Größenverhältnis, normierte Polnormale', () => {
    const a = waehleOkkluder(getBody('saturn'), bodyIndex, position, radius);
    expect(a.ring).not.toBeNull();
    expect(a.ring!.bodyId).toBe('saturn');
    // sizeScale = radius('saturn') / physical.radiusKm = 50 (Schaubild-Preset).
    expect(a.ring!.innen).toBeCloseTo(74_658 * 50, 3);
    expect(a.ring!.aussen).toBeCloseTo(136_780 * 50, 3);

    const pol = poleVector(getBody('saturn').physical.pole.raDeg, getBody('saturn').physical.pole.decDeg);
    const laenge = Math.hypot(pol.x, pol.y, pol.z);
    expect(a.ring!.normale.x).toBeCloseTo(pol.x / laenge, 9);
    expect(a.ring!.normale.y).toBeCloseTo(pol.y / laenge, 9);
    expect(a.ring!.normale.z).toBeCloseTo(pol.z / laenge, 9);
    expect(Math.hypot(a.ring!.normale.x, a.ring!.normale.y, a.ring!.normale.z)).toBeCloseTo(1, 9);
  });

  it('titan: Ring gehört zum Mutterplaneten saturn', () => {
    const a = waehleOkkluder(getBody('titan'), bodyIndex, position, radius);
    expect(a.ring).not.toBeNull();
    expect(a.ring!.bodyId).toBe('saturn');
  });

  it('saturn: sieben Katalogmonde ergeben genau MAX_OKKLUDER Kugeln', () => {
    // Saturn führt sieben Monde im Katalog (mimas, enceladus, tethys,
    // dione, rhea, titan, iapetus) — mehr als MAX_OKKLUDER, die Auswahl muss
    // also tatsächlich kürzen und nicht bloß zufällig darunterbleiben.
    const a = waehleOkkluder(getBody('saturn'), bodyIndex, position, radius);
    expect(a.kugeln).toHaveLength(MAX_OKKLUDER);
  });

  it('titan: Saturn zuerst, insgesamt MAX_OKKLUDER Kugeln', () => {
    const a = waehleOkkluder(getBody('titan'), bodyIndex, position, radius);
    expect(a.kugeln).toHaveLength(MAX_OKKLUDER);
    expect(a.kugeln[0]!.id).toBe('saturn');
  });

  it('sun und ceres: leere Auswahl (nie Okkluder, nie beschattet)', () => {
    for (const id of ['sun', 'ceres']) {
      const a = waehleOkkluder(getBody(id), bodyIndex, position, radius);
      expect(a.kugeln).toHaveLength(0);
      expect(a.ring).toBeNull();
    }
  });

  it('charon: pluto als Mutterkörper zählt, obwohl Zwergplanet', () => {
    const a = waehleOkkluder(getBody('charon'), bodyIndex, position, radius);
    expect(a.kugeln[0]!.id).toBe('pluto');
  });
});

describe('kernschattenFarbeLinear — Blutmond-Farbe', () => {
  it('Erde aus dem Katalog (#ff9a5c) ≈ linear [1, 0,323, 0,107]', () => {
    // Seit Task 2 trägt der Datenkatalog selbst appearance.umbra
    // (sim/types.ts, data/bodies/earth.ts) — kein lokal angehängtes
    // Testfeld mehr nötig, kernschattenFarbeLinear liest bodyIndex['earth']
    // direkt.
    const farbe = kernschattenFarbeLinear(bodyIndex['earth']!);
    expect(farbe[0]).toBeCloseTo(1, 2);
    expect(farbe[1]).toBeCloseTo(0.323, 2);
    expect(farbe[2]).toBeCloseTo(0.107, 2);
  });

  it('Mars ohne Umbra-Feld → neutral [1, 1, 1]', () => {
    expect(kernschattenFarbeLinear(bodyIndex['mars']!)).toEqual([1, 1, 1]);
  });
});

describe('GLSL-Bausteine — vorhanden und mit den erwarteten Kernzeilen', () => {
  it('SCHATTEN_GLSL_FUNKTIONEN enthält sonnenAnteil und kugelSchatten', () => {
    expect(SCHATTEN_GLSL_FUNKTIONEN).toContain('float sonnenAnteil(float alpha, float beta, float gamma)');
    expect(SCHATTEN_GLSL_FUNKTIONEN).toContain('float kugelSchatten(vec3 p, vec4 okkluder, vec3 sonne, float alpha)');
  });

  it('SCHATTEN_GLSL_KOERPER_PARS trägt die Uniforms und die Funktionen', () => {
    for (const name of [
      'uniform vec3 uSonnenRichtung;', 'uniform float uSonnenWinkel;', 'uniform vec4 uOkkluder[4];',
      'uniform vec3 uOkkluderFarbe[4];', 'uniform int uOkkluderAnzahl;', 'uniform vec4 uRingEbeneA;',
      'uniform vec4 uRingEbeneB;', 'uniform float uRingAktiv;', 'uniform sampler2D tRingSchatten;',
      'varying vec3 vSchattenPos;',
    ]) {
      expect(SCHATTEN_GLSL_KOERPER_PARS).toContain(name);
    }
    expect(SCHATTEN_GLSL_KOERPER_PARS).toContain('float sonnenAnteil(float alpha, float beta, float gamma)');
  });

  it('SCHATTEN_GLSL_KOERPER_ANWENDUNG multipliziert Diffus/Spekular und färbt das Emissiv', () => {
    // Skalar, nicht vec3: Alle Faktoren sind Skalare, ein Vektor würde nur
    // eine Farbabhängigkeit vortäuschen, die es nicht gibt.
    expect(SCHATTEN_GLSL_KOERPER_ANWENDUNG).toContain('float schattenFaktor = 1.0;');
    expect(SCHATTEN_GLSL_KOERPER_ANWENDUNG).not.toContain('vec3 schattenFaktor');
    expect(SCHATTEN_GLSL_KOERPER_ANWENDUNG).toContain('reflectedLight.directDiffuse *= schattenFaktor;');
    expect(SCHATTEN_GLSL_KOERPER_ANWENDUNG).toContain('reflectedLight.directSpecular *= schattenFaktor;');
    expect(SCHATTEN_GLSL_KOERPER_ANWENDUNG).toContain('totalEmissiveRadiance *= fuellFarbe;');
  });

  it('Vertex-Bausteine setzen vSchattenPos in Weltkoordinaten', () => {
    expect(SCHATTEN_GLSL_VERTEX_PARS).toBe('varying vec3 vSchattenPos;');
    expect(SCHATTEN_GLSL_VERTEX).toBe('vSchattenPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
  });
});
