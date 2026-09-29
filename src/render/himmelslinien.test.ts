import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  createHimmelsLinien, spurPuffer, spurNachfuehren, grosskreis,
  HIMMEL_KUGEL_EINHEITEN, SPUR_TAGE, SPUR_KOERPER, SPUR_DECKKRAFT,
} from './himmelslinien';
import { geozentrischeRichtung } from '../sim/geozentrisch';
import { EKLIPTIK_SCHIEFE_GRAD, poleVector } from '../sim/frames';
import { bodyIndex } from '../data/index';

const jd = 2461400.3;
const tag = Math.floor(jd);
const R = HIMMEL_KUGEL_EINHEITEN;
const alle = { spuren: true, ekliptik: true, aequator: true };

describe('spurNachfuehren', () => {
  it('rechnet beim ersten Aufruf alle Tage, danach nur die neuen', () => {
    const p = spurPuffer('mars');
    expect(spurNachfuehren(p, jd)).toBe(SPUR_TAGE + 1);
    expect(spurNachfuehren(p, jd + 0.2)).toBe(0);
    expect(spurNachfuehren(p, jd + 1)).toBe(1);
    expect(spurNachfuehren(p, jd + 3)).toBe(2);
  });

  it('rechnet nach einem Sprung über die Fensterlänge und beim Rückwärtslauf alles neu', () => {
    const p = spurPuffer('mars');
    spurNachfuehren(p, jd);
    expect(spurNachfuehren(p, jd + 400)).toBe(SPUR_TAGE + 1);
    expect(spurNachfuehren(p, jd + 399)).toBe(SPUR_TAGE + 1);
  });

  it('hält nach dem Verschieben jeden Tag an seinem Platz', () => {
    const p = spurPuffer('jupiter');
    spurNachfuehren(p, jd);
    spurNachfuehren(p, jd + 5);
    for (const i of [0, 200, SPUR_TAGE]) {
      const soll = geozentrischeRichtung('jupiter', bodyIndex, tag + 5 - SPUR_TAGE + i);
      expect(p.richtungen[i * 3]).toBeCloseTo(soll.x, 12);
      expect(p.richtungen[i * 3 + 2]).toBeCloseTo(soll.z, 12);
    }
  });
});

describe('grosskreis', () => {
  it('legt die Ekliptik in die Ebene z = 0', () => {
    const k = grosskreis(0);
    for (let i = 2; i < k.length; i += 3) expect(k[i]).toBe(0);
  });

  it('legt den Äquator senkrecht zum Himmelsnordpol, durch den Frühlingspunkt', () => {
    const k = grosskreis(EKLIPTIK_SCHIEFE_GRAD);
    const pol = poleVector(0, 90);
    for (let i = 0; i < k.length; i += 3) {
      const skalar = (k[i]! * pol.x + k[i + 1]! * pol.y + k[i + 2]! * pol.z) / R;
      expect(Math.abs(skalar)).toBeLessThan(1e-6);
    }
    expect(k[0]).toBeCloseTo(R, 0);
    expect(k[1]).toBe(0);
  });
});

describe('createHimmelsLinien', () => {
  it('zeigt außerhalb der Himmelsansicht nichts', () => {
    const szene = new THREE.Scene();
    const linien = createHimmelsLinien(szene);
    linien.update(false, jd, alle);
    szene.traverse((o) => { if (o !== szene) expect(o.visible, o.name).toBe(false); });
  });

  it('folgt den drei Schaltern', () => {
    const linien = createHimmelsLinien(new THREE.Scene());
    linien.update(true, jd, { spuren: true, ekliptik: true, aequator: false });
    expect(linien.spuren.size).toBe(SPUR_KOERPER.length);
    for (const l of linien.spuren.values()) expect(l.visible).toBe(true);
    expect(linien.ekliptik.visible).toBe(true);
    expect(linien.aequator.visible).toBe(false);
    expect(linien.fruehlingspunkt.visible).toBe(false);
  });

  it('endet jede Spur genau in der Richtung des Planeten zum aktuellen Zeitpunkt', () => {
    const linien = createHimmelsLinien(new THREE.Scene());
    linien.update(true, jd, alle);
    const pos = linien.spuren.get('mars')!.geometry.getAttribute('position');
    const letzter = pos.count - 1;
    const soll = geozentrischeRichtung('mars', bodyIndex, jd);
    expect(pos.getX(letzter) / R).toBeCloseTo(soll.x, 6);
    expect(pos.getY(letzter) / R).toBeCloseTo(soll.y, 6);
    expect(pos.getZ(letzter) / R).toBeCloseTo(soll.z, 6);
  });

  it('läuft vom ältesten zum jüngsten Punkt von unsichtbar bis SPUR_DECKKRAFT', () => {
    const linien = createHimmelsLinien(new THREE.Scene());
    const farbe = linien.spuren.get('venus')!.geometry.getAttribute('color');
    expect(farbe.itemSize).toBe(4);
    expect(farbe.getW(0)).toBe(0);
    expect(farbe.getW(farbe.count - 1)).toBeCloseTo(SPUR_DECKKRAFT, 6);
  });

  it('rechnet nach einem Zeitsprung die ganze Spur in der neuen Zeit', () => {
    const linien = createHimmelsLinien(new THREE.Scene());
    linien.update(true, jd, alle);
    const neu = jd - 5000;
    linien.update(true, neu, alle);
    const pos = linien.spuren.get('saturn')!.geometry.getAttribute('position');
    const soll = geozentrischeRichtung('saturn', bodyIndex, Math.floor(neu) - SPUR_TAGE);
    expect(pos.getX(0) / R).toBeCloseTo(soll.x, 6);
    expect(pos.getZ(0) / R).toBeCloseTo(soll.z, 6);
  });
});
