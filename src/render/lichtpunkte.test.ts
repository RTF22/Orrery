import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  lichtpunktFuer, zeigtLichtpunkt, scheibenUebergang, createLichtpunkte,
  LICHTPUNKT_MIN_PX, LICHTPUNKT_MAX_PX, MOND_GRENZHELLIGKEIT,
} from './lichtpunkte';
import type { LichtpunktEintrag } from './lichtpunkte';
import { MARKER_MIN_PIXEL } from './labels';

describe('lichtpunktFuer', () => {
  it('macht hellere Körper größer und deckender, in festen Grenzen', () => {
    const venus = lichtpunktFuer(-4.5);
    const jupiter = lichtpunktFuer(-2.7);
    const neptun = lichtpunktFuer(7.8);
    const pluto = lichtpunktFuer(14.4);
    expect(venus.durchmesserPx).toBeCloseTo(LICHTPUNKT_MAX_PX, 6);
    expect(jupiter.durchmesserPx).toBeLessThan(venus.durchmesserPx);
    expect(neptun.durchmesserPx).toBeLessThan(jupiter.durchmesserPx);
    expect(pluto.durchmesserPx).toBe(LICHTPUNKT_MIN_PX);
    expect(venus.deckkraft).toBe(1);
    expect(pluto.deckkraft).toBe(0.5);
    expect(lichtpunktFuer(-30).durchmesserPx).toBe(LICHTPUNKT_MAX_PX);
  });
});

describe('zeigtLichtpunkt', () => {
  it('zeigt Planeten und Zwergplaneten immer, Monde nur hell genug, nie Sonne, Erde und Erdmond', () => {
    expect(zeigtLichtpunkt('pluto', 'dwarf', 14.4)).toBe(true);
    expect(zeigtLichtpunkt('neptune', 'planet', 7.8)).toBe(true);
    expect(zeigtLichtpunkt('ganymede', 'moon', 4.2)).toBe(true);
    expect(zeigtLichtpunkt('titan', 'moon', 8.3)).toBe(true);
    expect(zeigtLichtpunkt('rhea', 'moon', MOND_GRENZHELLIGKEIT + 0.6)).toBe(false);
    expect(zeigtLichtpunkt('moon', 'moon', -12)).toBe(false);
    expect(zeigtLichtpunkt('earth', 'planet', null)).toBe(false);
    expect(zeigtLichtpunkt('sun', 'star', null)).toBe(false);
    expect(zeigtLichtpunkt('mars', 'planet', null)).toBe(false);
  });
});

describe('scheibenUebergang', () => {
  it('blendet den Punkt aus, sobald die wahre Scheibe groß genug ist', () => {
    expect(scheibenUebergang(0.1)).toBe(1);
    expect(scheibenUebergang(2)).toBe(1);
    expect(scheibenUebergang(MARKER_MIN_PIXEL)).toBe(0);
    expect(scheibenUebergang(40)).toBe(0);
    expect(scheibenUebergang(2.5)).toBeCloseTo(0.5, 6);
  });
});

describe('createLichtpunkte', () => {
  const eintrag = (id: string, patch: Partial<LichtpunktEintrag> = {}): LichtpunktEintrag => ({
    id, kind: 'planet', renderPos: { x: 0, y: 0, z: -1e5 }, farbe: '#ff8844',
    radiusPixel: 0.4, m: -1.3, sichtbar: true, ...patch,
  });
  const punkteIn = (szene: THREE.Scene) => szene.children.filter((o): o is THREE.Points => o instanceof THREE.Points);

  it('zeichnet je Körper einen Punkt mit Tiefentest und liefert seinen Durchmesser', () => {
    const szene = new THREE.Scene();
    const lp = createLichtpunkte(szene);
    const groessen = lp.update(true, [eintrag('mars'), eintrag('jupiter', { m: -2.7 })]);
    expect(groessen.get('mars')).toBeCloseTo(lichtpunktFuer(-1.3).durchmesserPx, 6);
    expect(groessen.get('jupiter')!).toBeGreaterThan(groessen.get('mars')!);
    const sichtbar = punkteIn(szene).filter((p) => p.visible);
    expect(sichtbar).toHaveLength(2);
    for (const p of sichtbar) {
      const mat = p.material as THREE.PointsMaterial;
      expect(mat.depthTest).toBe(true);
      expect(mat.depthWrite).toBe(false);
      expect(mat.sizeAttenuation).toBe(false);
    }
  });

  it('zeichnet nichts, wenn aus, abgewählt, zu schwach oder als Scheibe groß genug', () => {
    const szene = new THREE.Scene();
    const lp = createLichtpunkte(szene);
    lp.update(true, [eintrag('mars')]);
    expect(lp.update(false, [eintrag('mars')]).size).toBe(0);
    expect(lp.update(true, [eintrag('mars', { sichtbar: false })]).size).toBe(0);
    expect(lp.update(true, [eintrag('rhea', { kind: 'moon', m: 9.6 })]).size).toBe(0);
    expect(lp.update(true, [eintrag('mars', { radiusPixel: 5 })]).size).toBe(0);
    expect(punkteIn(szene).every((p) => !p.visible)).toBe(true);
  });

  it('setzt den Punkt an die kamerarelative Lage des Körpers', () => {
    const szene = new THREE.Scene();
    const lp = createLichtpunkte(szene);
    lp.update(true, [eintrag('mars', { renderPos: { x: 10, y: -20, z: -3e5 } })]);
    const p = punkteIn(szene)[0]!;
    const pos = p.geometry.getAttribute('position');
    expect([pos.getX(0), pos.getY(0), pos.getZ(0)]).toEqual([10, -20, -3e5]);
  });
});
