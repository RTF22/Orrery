import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import {
  createMilchstrasse, himmelsGitter, naechsteHimmelStufe, raDecZuUv, HIMMEL_RADIUS,
} from './milchstrasse';
import { equatorialToEcliptic } from './starfield';
import { obergrenzeFuer, type TexturLader } from './texturen';
import type { HimmelStufe } from '../data/milchstrasse';

const STUFEN: HimmelStufe[] = [1024, 2048, 8192].map((breite) => ({
  breite, pfad: `textures/milchstrasse/himmel-${breite}.ktx2`,
}));

function testLader() {
  const offen = new Map<string, { erfuelle: (t?: THREE.Texture) => void; scheitere: () => void }>();
  const aufrufe: string[] = [];
  const lader: TexturLader = {
    lade: (pfad) => new Promise((erfuelle, scheitere) => {
      aufrufe.push(pfad);
      offen.set(pfad, {
        erfuelle: (t) => erfuelle(t ?? new THREE.Texture()),
        scheitere: () => scheitere(new Error('404')),
      });
    }),
    freigeben: vi.fn(),
  };
  return { lader, aufrufe, offen };
}
const ruhe = () => new Promise((r) => setTimeout(r, 0));

describe('raDecZuUv', () => {
  it('legt RA 0h in die Bildmitte, RA wächst nach links, Süden bei v = 0', () => {
    expect(raDecZuUv(0, 0)).toEqual({ u: 0.5, v: 0.5 });
    expect(raDecZuUv(90, 0).u).toBeCloseTo(0.25, 12);
    expect(raDecZuUv(270, 0).u).toBeCloseTo(0.75, 12);
    expect(raDecZuUv(0, -90).v).toBe(0);
    expect(raDecZuUv(0, 90).v).toBe(1);
  });

  it('legt die Naht auf RA 180° an den Bildrand', () => {
    expect(raDecZuUv(180, 0).u).toBe(0);
    expect(raDecZuUv(180.001, 0).u).toBeCloseTo(1, 4);
    expect(raDecZuUv(179.999, 0).u).toBeCloseTo(0, 4);
  });
});

describe('himmelsGitter', () => {
  const g = himmelsGitter(8, 4, 1);

  it('liegt auf der Einheitskugel und nutzt die Drehung des Sternfelds', () => {
    for (let k = 0; k < g.positionen.length / 3; k++) {
      const [x, y, z] = [g.positionen[3 * k]!, g.positionen[3 * k + 1]!, g.positionen[3 * k + 2]!];
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 5);
      const u = g.uvs[2 * k]!, v = g.uvs[2 * k + 1]!;
      const soll = equatorialToEcliptic(180 - u * 360, v * 180 - 90);
      expect(x).toBeCloseTo(soll.x, 5);
      expect(y).toBeCloseTo(soll.y, 5);
      expect(z).toBeCloseTo(soll.z, 5);
    }
  });

  it('stimmt im Inneren mit raDecZuUv überein', () => {
    for (let i = 1; i < 8; i++) {
      const u = i / 8;
      expect(raDecZuUv(180 - u * 360, 0).u).toBeCloseTo(u, 12);
    }
  });

  it('doppelt die Randspalte: gleicher Ort, u = 0 und u = 1', () => {
    for (let j = 0; j <= 4; j++) {
      const a = j * 9, b = j * 9 + 8;
      for (let c = 0; c < 3; c++) expect(g.positionen[3 * a + c]).toBeCloseTo(g.positionen[3 * b + c]!, 6);
      expect(g.uvs[2 * a]).toBe(0);
      expect(g.uvs[2 * b]).toBe(1);
    }
  });

  it('bildet zwei Dreiecke je Zelle', () => {
    expect(g.indizes.length).toBe(8 * 4 * 6);
    expect(Math.max(...g.indizes)).toBe(9 * 5 - 1);
  });
});

describe('naechsteHimmelStufe', () => {
  const b = [1024, 2048, 8192];
  it('lädt zuerst die kleinste, danach gleich die breiteste bis zur Obergrenze', () => {
    expect(naechsteHimmelStufe(b, 0, 8192)).toBe(1024);
    expect(naechsteHimmelStufe(b, 1024, 8192)).toBe(8192);
    expect(naechsteHimmelStufe(b, 1024, 2048)).toBe(2048);
    expect(naechsteHimmelStufe(b, 1024, 1024)).toBeNull();
  });
  it('stuft nie herunter', () => {
    expect(naechsteHimmelStufe(b, 8192, 1024)).toBeNull();
    expect(naechsteHimmelStufe(b, 2048, 2048)).toBeNull();
  });
  it('wählt bei maxTextureSize 4096 die 2k-Stufe', () => {
    expect(naechsteHimmelStufe(b, 1024, obergrenzeFuer('high', 4096))).toBe(2048);
  });
});

describe('createMilchstrasse', () => {
  const aufbau = () => {
    const scene = new THREE.Scene();
    const t = testLader();
    const m = createMilchstrasse(scene, t.lader, STUFEN);
    const kugel = scene.getObjectByName('milchstrasse') as THREE.Mesh;
    return { scene, m, kugel, ...t };
  };

  it('legt eine deckende Kugel ohne Tiefentest zuerst in die Szene, anfangs unsichtbar', () => {
    const { kugel } = aufbau();
    const mat = kugel.material as THREE.MeshBasicMaterial;
    expect(kugel.renderOrder).toBe(-1);
    expect(kugel.frustumCulled).toBe(false);
    expect(kugel.visible).toBe(false);
    expect(mat.transparent).toBe(false);
    expect(mat.depthTest).toBe(false);
    expect(mat.depthWrite).toBe(false);
    const p = kugel.geometry.getAttribute('position');
    expect(Math.hypot(p.getX(0), p.getY(0), p.getZ(0)) / HIMMEL_RADIUS).toBeCloseTo(1, 5);
  });

  it('lädt bei ausgeschaltetem Kästchen nichts, beim Einschalten die kleinste Stufe', () => {
    const { m, aufrufe } = aufbau();
    for (let i = 0; i < 5; i++) m.update(false, 8192, true);
    expect(aufrufe).toEqual([]);
    m.update(true, 8192, true);
    expect(aufrufe).toEqual(['textures/milchstrasse/himmel-1024.ktx2']);
  });

  it('wartet, solange die Körper laden', () => {
    const { m, aufrufe } = aufbau();
    m.update(true, 8192, false);
    expect(aufrufe).toEqual([]);
  });

  it('setzt die Textur, zeigt die Kugel und lädt danach die Obergrenze', async () => {
    const { m, kugel, aufrufe, offen } = aufbau();
    m.update(true, 8192, true);
    m.update(true, 8192, true);
    expect(aufrufe).toHaveLength(1);
    const tex = new THREE.Texture();
    offen.get(aufrufe[0]!)!.erfuelle(tex);
    await ruhe();
    m.update(true, 8192, true);
    expect((kugel.material as THREE.MeshBasicMaterial).map).toBe(tex);
    expect(kugel.visible).toBe(true);
    expect(m.stand()).toBe(1024);
    expect(aufrufe[1]).toBe('textures/milchstrasse/himmel-8192.ktx2');
    m.update(false, 8192, true);
    expect(kugel.visible).toBe(false);
  });

  it('versucht eine gescheiterte Stufe nicht erneut', async () => {
    const { m, aufrufe, offen } = aufbau();
    m.update(true, 1024, true);
    offen.get(aufrufe[0]!)!.scheitere();
    await ruhe();
    for (let i = 0; i < 5; i++) m.update(true, 1024, true);
    expect(aufrufe).toHaveLength(1);
    expect(m.stand()).toBe(0);
  });

  it('gibt eine nach dem Abbau eintreffende Textur frei', async () => {
    const { m, aufrufe, offen, scene } = aufbau();
    m.update(true, 8192, true);
    m.dispose();
    const tex = new THREE.Texture();
    const frei = vi.spyOn(tex, 'dispose');
    offen.get(aufrufe[0]!)!.erfuelle(tex);
    await ruhe();
    expect(frei).toHaveBeenCalledOnce();
    expect(scene.getObjectByName('milchstrasse')).toBeUndefined();
  });
});
