import * as THREE from 'three';
import type { Body, Vec3 } from '../sim/types';
import { MARKER_MIN_PIXEL } from './labels';

/**
 * Lichtpunkte der Himmelsansicht (Entwurf geozentrische Sicht §11.2): Planeten,
 * Zwergplaneten und helle Monde erscheinen an ihrer wahren Richtung als weiche
 * Punkte, deren Größe und Deckkraft mit der scheinbaren Helligkeit wachsen —
 * die Konvention der Sternkarten, keine Größenangabe. Sobald die wahre Scheibe
 * groß genug ist, übernimmt die Kugel.
 */

export const LICHTPUNKT_MIN_PX = 2;
export const LICHTPUNKT_MAX_PX = 10;
/** Schwächste Helligkeit, bei der ein Mond noch einen Punkt bekommt (Plan-Ruling: 9 statt 8,5 für Titan). */
export const MOND_GRENZHELLIGKEIT = 9;

const begrenze = (x: number, a: number, b: number): number => Math.min(b, Math.max(a, x));

/** Venus (rund −4,5) erreicht den größten, Neptun (rund 7,8) fast den kleinsten Punkt. */
export function lichtpunktFuer(m: number): { durchmesserPx: number; deckkraft: number } {
  return {
    durchmesserPx: begrenze(LICHTPUNKT_MIN_PX + (8 - m) * 0.64, LICHTPUNKT_MIN_PX, LICHTPUNKT_MAX_PX),
    deckkraft: begrenze(1 - (m - 4) * 0.125, 0.5, 1),
  };
}

export function zeigtLichtpunkt(id: string, kind: Body['kind'], m: number | null): boolean {
  if (m === null || kind === 'star' || id === 'earth' || id === 'moon') return false;
  return kind === 'moon' ? m <= MOND_GRENZHELLIGKEIT : true;
}

export function scheibenUebergang(radiusPixel: number): number {
  return begrenze((MARKER_MIN_PIXEL - radiusPixel) / (MARKER_MIN_PIXEL - 2), 0, 1);
}

export interface LichtpunktEintrag {
  id: string; kind: Body['kind']; renderPos: Vec3; farbe: string;
  radiusPixel: number; m: number | null; sichtbar: boolean;
}

/** Weiche Scheibe als Datentextur (kein Canvas, damit die Schicht auch in node-Tests läuft). */
function weicheScheibe(): THREE.DataTexture {
  const n = 32;
  const daten = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const r = Math.hypot(x + 0.5 - n / 2, y + 0.5 - n / 2) / (n / 2);
      const a = r >= 1 ? 0 : Math.exp(-4 * r * r) * (1 - r);
      const i = (y * n + x) * 4;
      daten[i] = 255; daten[i + 1] = 255; daten[i + 2] = 255;
      daten[i + 3] = Math.round(255 * Math.min(1, a * 1.6));
    }
  }
  const t = new THREE.DataTexture(daten, n, n);
  t.needsUpdate = true;
  return t;
}

export function createLichtpunkte(scene: THREE.Scene): {
  update(an: boolean, eintraege: readonly LichtpunktEintrag[]): ReadonlyMap<string, number>;
} {
  const textur = weicheScheibe();
  const punkte = new Map<string, THREE.Points>();
  const groessen = new Map<string, number>();

  const hole = (e: LichtpunktEintrag): THREE.Points => {
    const vorhanden = punkte.get(e.id);
    if (vorhanden !== undefined) return vorhanden;
    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    const material = new THREE.PointsMaterial({
      map: textur, color: new THREE.Color(e.farbe), sizeAttenuation: false,
      transparent: true, depthTest: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const p = new THREE.Points(geometrie, material);
    // Kamerarelative Lage wie bei Bahnen und Spuren: keine Kullung nach Ursprung.
    p.frustumCulled = false;
    p.name = `lichtpunkt-${e.id}`;
    scene.add(p);
    punkte.set(e.id, p);
    return p;
  };

  return {
    update(an, eintraege) {
      groessen.clear();
      for (const p of punkte.values()) p.visible = false;
      if (!an) return groessen;
      for (const e of eintraege) {
        if (!e.sichtbar || !zeigtLichtpunkt(e.id, e.kind, e.m)) continue;
        const uebergang = scheibenUebergang(e.radiusPixel);
        if (uebergang <= 0) continue;
        const { durchmesserPx, deckkraft } = lichtpunktFuer(e.m!);
        const p = hole(e);
        const pos = p.geometry.getAttribute('position') as THREE.BufferAttribute;
        pos.setXYZ(0, e.renderPos.x, e.renderPos.y, e.renderPos.z);
        pos.needsUpdate = true;
        const mat = p.material as THREE.PointsMaterial;
        mat.size = durchmesserPx;
        mat.opacity = deckkraft * uebergang;
        p.visible = true;
        groessen.set(e.id, durchmesserPx);
      }
      return groessen;
    },
  };
}
