import { describe, it, expect } from 'vitest';
import {
  EKLIPTIK_SCHIEFE_GRAD, poleVector, axialTiltDeg, equatorToEcliptic,
} from './frames';
import { bodies, bodyIndex } from '../data/index';
import type { Vec3 } from './types';

describe('poleVector', () => {
  it('liefert für den Himmelsnordpol die um die Schiefe gekippte Ekliptiknormale', () => {
    // Rektaszension ist am Pol bedeutungslos; Deklination 90° ist der
    // Himmelsnordpol. In Ekliptikkoordinaten steht er um die Schiefe der
    // Ekliptik gekippt — das ist genau die Erdachsneigung.
    const p = poleVector(0, 90);
    const eps = (EKLIPTIK_SCHIEFE_GRAD * Math.PI) / 180;
    expect(p.x).toBeCloseTo(0, 12);
    expect(p.y).toBeCloseTo(Math.sin(eps), 12);
    expect(p.z).toBeCloseTo(Math.cos(eps), 12);
  });

  it('liefert stets einen Einheitsvektor', () => {
    for (const [ra, dec] of [[0, 90], [268.06, 64.5], [257.31, -15.18], [40.59, 83.54]]) {
      const p = poleVector(ra!, dec!);
      expect(Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2)).toBeCloseTo(1, 12);
    }
  });
});

describe('axialTiltDeg', () => {
  it('ist null für die Ekliptiknormale selbst', () => {
    expect(axialTiltDeg({ x: 0, y: 0, z: 1 })).toBeCloseTo(0, 12);
  });

  it('ergibt für den Erdpol die Schiefe der Ekliptik', () => {
    expect(axialTiltDeg(poleVector(0, 90))).toBeCloseTo(EKLIPTIK_SCHIEFE_GRAD, 6);
  });
});

describe('equatorToEcliptic', () => {
  it('ist die Identität, wenn der Pol die Ekliptiknormale ist', () => {
    // Der entartete Fall: Äquatorebene und Ekliptik fallen zusammen, es gibt
    // keinen Knoten. Die Drehung muss dann die Identität liefern statt durch
    // ein Kreuzprodukt der Länge null zu laufen.
    const v = { x: 3, y: -4, z: 5 };
    const r = equatorToEcliptic(v, { x: 0, y: 0, z: 1 });
    expect(r.x).toBeCloseTo(3, 12);
    expect(r.y).toBeCloseTo(-4, 12);
    expect(r.z).toBeCloseTo(5, 12);
  });

  it('bildet die Äquatornormale auf den Pol ab', () => {
    const pole = poleVector(268.06, 64.5);
    const r = equatorToEcliptic({ x: 0, y: 0, z: 1 }, pole);
    expect(r.x).toBeCloseTo(pole.x, 12);
    expect(r.y).toBeCloseTo(pole.y, 12);
    expect(r.z).toBeCloseTo(pole.z, 12);
  });

  it('erhält Längen und Winkel', () => {
    const pole = poleVector(40.59, 83.54);
    const a = equatorToEcliptic({ x: 1, y: 2, z: 3 }, pole);
    const b = equatorToEcliptic({ x: -2, y: 1, z: 0 }, pole);
    expect(Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2)).toBeCloseTo(Math.sqrt(14), 12);
    // Die beiden Ausgangsvektoren stehen senkrecht aufeinander (1*-2 + 2*1 + 0 = 0);
    // eine Drehung darf daran nichts ändern.
    expect(a.x * b.x + a.y * b.y + a.z * b.z).toBeCloseTo(0, 12);
  });

  it('legt die x-Achse in den aufsteigenden Knoten', () => {
    // Der Knoten ist die Schnittgerade von Äquator- und Ekliptikebene. Ein
    // Vektor entlang der lokalen x-Achse muss deshalb in der Ekliptikebene
    // liegen, also z = 0 haben.
    const pole = poleVector(268.06, 64.5);
    const r = equatorToEcliptic({ x: 1, y: 0, z: 0 }, pole);
    expect(r.z).toBeCloseTo(0, 12);
  });

  it('legt die x-Achse in den aufsteigenden, nicht in den absteigenden Knoten', () => {
    // r.z ≈ 0 allein ist tautologisch — beide Knoten liegen in der
    // Ekliptikebene. Unterscheidbar sind sie erst über die Richtung: Eine
    // Vierteldrehung hinter dem aufsteigenden Knoten liegt nördlich der
    // Ekliptik. Ein vertauschtes Vorzeichen in der Knotenrichtung kippt
    // dieses z ins Negative und fällt hier auf.
    const pole = poleVector(268.06, 64.5);
    expect(equatorToEcliptic({ x: 0, y: 1, z: 0 }, pole).z).toBeGreaterThan(0);
  });

  it('legt die lokale Basis exakt in den aufsteigenden Knoten, mit dem richtigen Drehsinn — voller Vektor', () => {
    // Die obigen Tests prüfen nur r.z, also je eine von drei Komponenten.
    // Eine orthonormale, aber falsch orientierte Basis (x-Achse gespiegelt,
    // oder x und y vertauscht) besteht sie trotzdem. Hier wird deshalb der
    // volle Vektor gegen eine von Hand hergeleitete Erwartung geprüft.
    //
    // Für den Himmelsnordpol (ra=0, dec=90) liefert poleVector laut Test
    // oben p = (0, sin ε, cos ε) mit ε = Schiefe der Ekliptik. Damit lässt
    // sich die Basis aus dem Docstring von equatorToEcliptic von Hand
    // ausrechnen:
    //
    //   x = normiert((0,0,1) × p) = normiert((-sin ε, 0, 0)) = (-1, 0, 0)
    //       (sin ε > 0 für 0 < ε < 90°, also einfach das Vorzeichen kürzen)
    //   y = p × x = (p.y·x.z − p.z·x.y, p.z·x.x − p.x·x.z, p.x·x.y − p.y·x.x)
    //             = (sin ε·0 − cos ε·0, cos ε·(−1) − 0·0, 0·0 − sin ε·(−1))
    //             = (0, −cos ε, sin ε)
    //
    // Probe (muss das Rechtssystem ergeben): x × y
    //   = (0·sin ε − 0·(−cos ε), 0·0 − (−1)·sin ε, (−1)·(−cos ε) − 0·0)
    //   = (0, sin ε, cos ε) = p ✓
    //
    // v = (1,0,0) liegt exakt am Knoten und muss auf x abgebildet werden;
    // v = (0,1,0) liegt eine Vierteldrehung weiter und muss auf y abgebildet
    // werden — das legt zugleich den Drehsinn um die Polachse fest.
    const pole = poleVector(0, 90);
    const eps = (EKLIPTIK_SCHIEFE_GRAD * Math.PI) / 180;

    const amKnoten = equatorToEcliptic({ x: 1, y: 0, z: 0 }, pole);
    expect(amKnoten.x).toBeCloseTo(-1, 12);
    expect(amKnoten.y).toBeCloseTo(0, 12);
    expect(amKnoten.z).toBeCloseTo(0, 12);

    const vierteldrehungWeiter = equatorToEcliptic({ x: 0, y: 1, z: 0 }, pole);
    expect(vierteldrehungWeiter.x).toBeCloseTo(0, 12);
    expect(vierteldrehungWeiter.y).toBeCloseTo(-Math.cos(eps), 12);
    expect(vierteldrehungWeiter.z).toBeCloseTo(Math.sin(eps), 12);
  });
});

describe('Pollagen des Katalogs', () => {
  // Kontrollrechnung: Pol (IAU-Bericht) und Bahnelemente (JPL) stammen aus
  // zwei unabhängigen Quellen. Der Winkel zwischen Polrichtung und
  // Bahnnormale muss die veröffentlichte Neigung gegen die eigene Bahnebene
  // ergeben — den „Obliquity to orbit"-Wert der NASA-Fact-Sheets. Gegen die
  // Ekliptik zu prüfen wäre falsch: Nur die Erdbahn *ist* die Ekliptik.
  const NEIGUNG_ZUR_BAHN: Record<string, number> = {
    mercury: 0.034, venus: 177.36, earth: 23.44, moon: 6.68, mars: 25.19,
    jupiter: 3.13, saturn: 26.73, uranus: 97.77, neptune: 28.32,
  };

  /** Bahnnormale in Ekliptikkoordinaten aus Neigung und Knotenlänge. */
  function bahnnormale(iGrad: number, nodeGrad: number): Vec3 {
    const i = (iGrad * Math.PI) / 180;
    const n = (nodeGrad * Math.PI) / 180;
    return { x: Math.sin(i) * Math.sin(n), y: -Math.sin(i) * Math.cos(n), z: Math.cos(i) };
  }

  const winkelGrad = (a: Vec3, b: Vec3): number =>
    (Math.acos(Math.min(Math.max(a.x * b.x + a.y * b.y + a.z * b.z, -1), 1)) * 180) / Math.PI;

  it('trifft die veröffentlichte Neigung gegen die eigene Bahnebene', () => {
    for (const body of bodies) {
      const erwartet = NEIGUNG_ZUR_BAHN[body.id];
      if (erwartet === undefined || body.orbit === null) continue;
      const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
      const normale = bahnnormale(body.orbit.i, body.orbit.node);
      // Bei rückläufiger Rotation ist der IAU-Nordpol das entgegengesetzte
      // Ende der Achse, und die Fact-Sheets messen dort über 90°. Diese
      // Fallunterscheidung prüft mit, dass Polkonvention und Vorzeichen von
      // rotationPeriodH zueinander passen.
      const soll = body.physical.rotationPeriodH < 0 ? 180 - erwartet : erwartet;
      expect(Math.abs(winkelGrad(pol, normale) - soll), `Neigung von ${body.id}`)
        .toBeLessThan(0.3);
    }
  });

  it('stellt die Sonnenachse 7,25 Grad gegen die Ekliptik', () => {
    // Die Sonne hat keine Bahn; für sie ist die Ekliptik der Bezug.
    const sonne = bodyIndex['sun']!;
    const pol = poleVector(sonne.physical.pole.raDeg, sonne.physical.pole.decDeg);
    expect(Math.abs(axialTiltDeg(pol) - 7.25)).toBeLessThan(0.1);
  });

  it('kennt für jeden Körper einen Pol', () => {
    for (const body of bodies) {
      expect(Number.isFinite(body.physical.pole.raDeg), body.id).toBe(true);
      expect(Number.isFinite(body.physical.pole.decDeg), body.id).toBe(true);
    }
  });
});
