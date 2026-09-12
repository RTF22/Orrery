import { describe, it, expect } from 'vitest';
import {
  EKLIPTIK_SCHIEFE_GRAD, poleVector, axialTiltDeg, equatorToEcliptic,
} from './frames';

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
});
