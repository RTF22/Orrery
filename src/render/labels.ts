import * as THREE from 'three';
import type { Vec3 } from '../sim/types';
import { t } from '../ui/i18n';

/** Unterhalb dieser projizierten Größe braucht ein Körper eine Ersatzglyphe. */
export const MARKER_MIN_PIXEL = 3;

/**
 * Scheinbarer Radius in Bildschirmpixeln.
 * Die Bildhöhe entspricht 2 * tan(fov/2) * Abstand in Weltgrößen.
 */
export function apparentRadiusPixels(
  radiusUnits: number, abstandUnits: number, fovGrad: number, hoehePixel: number,
): number {
  const sichtbareHoehe = 2 * Math.tan((fovGrad * Math.PI / 180) / 2) * Math.max(abstandUnits, 1e-9);
  return (radiusUnits / sichtbareHoehe) * hoehePixel;
}

export const needsMarker = (radiusPixel: number): boolean => radiusPixel < MARKER_MIN_PIXEL;

/** Bildschirmkoordinaten; null, wenn der Punkt hinter der Kamera liegt. */
export function projectToScreen(
  renderPos: Vec3, camera: THREE.PerspectiveCamera, breite: number, hoehe: number,
): { x: number; y: number; tiefe: number } | null {
  const v = new THREE.Vector3(renderPos.x, renderPos.y, renderPos.z).project(camera);
  if (v.z > 1) return null;
  return { x: (v.x * 0.5 + 0.5) * breite, y: (-v.y * 0.5 + 0.5) * hoehe, tiefe: v.z };
}

/** Ein Körper, so wie ihn das Overlay braucht — ohne Three.js-Begriffe. */
export interface LabelEintrag {
  id: string;
  nameKey: string;
  farbe: string;
  /** Position relativ zur Kamera, in Render-Einheiten. */
  renderPos: Vec3;
  radiusUnits: number;
  sichtbar: boolean;
}

export interface LabelOverlay {
  update(
    eintraege: readonly LabelEintrag[],
    camera: THREE.PerspectiveCamera,
    zeigeLabels: boolean,
    zeigeMarker: boolean,
  ): void;
  dispose(): void;
}

/** Halber Platzbedarf einer Beschriftung — grob, aber für die Kollision genug. */
const LABEL_HALB_BREITE = 44;
const LABEL_HALB_HOEHE = 9;

function ueberlappt(
  a: { x: number; y: number }, b: { x: number; y: number },
): boolean {
  return Math.abs(a.x - b.x) < LABEL_HALB_BREITE * 2
    && Math.abs(a.y - b.y) < LABEL_HALB_HOEHE * 2;
}

/**
 * Beschriftungen und Marker als HTML-Overlay statt als Textur: Die Schrift
 * bleibt bei jedem Zoom scharf, und die Größe folgt der Systemschrift des
 * Betrachters statt einer festen Pixelgröße.
 */
export function createLabelOverlay(container: HTMLElement): LabelOverlay {
  const wurzel = document.createElement('div');
  wurzel.className = 'label-overlay';
  container.appendChild(wurzel);

  const knoten = new Map<string, { wrapper: HTMLElement; glyphe: HTMLElement; text: HTMLElement }>();

  const hole = (eintrag: LabelEintrag) => {
    const vorhanden = knoten.get(eintrag.id);
    if (vorhanden !== undefined) return vorhanden;

    const wrapper = document.createElement('div');
    wrapper.className = 'koerper-label';
    const glyphe = document.createElement('span');
    glyphe.className = 'koerper-glyphe';
    glyphe.style.backgroundColor = eintrag.farbe;
    const text = document.createElement('span');
    text.className = 'koerper-name';
    text.textContent = t(eintrag.nameKey);
    wrapper.append(glyphe, text);
    wurzel.appendChild(wrapper);

    const neu = { wrapper, glyphe, text };
    knoten.set(eintrag.id, neu);
    return neu;
  };

  return {
    update(eintraege, camera, zeigeLabels, zeigeMarker) {
      const breite = wurzel.clientWidth;
      const hoehe = wurzel.clientHeight;

      // Erst alles projizieren, dann nach Tiefe sortiert platzieren: Bei
      // Überlappung gewinnt der vordere Körper, der hintere tritt zurück.
      const kandidaten = eintraege.flatMap((eintrag) => {
        if (!eintrag.sichtbar) return [];
        const p = projectToScreen(eintrag.renderPos, camera, breite, hoehe);
        if (p === null) return [];
        const abstand = Math.hypot(eintrag.renderPos.x, eintrag.renderPos.y, eintrag.renderPos.z);
        const radiusPixel = apparentRadiusPixels(eintrag.radiusUnits, abstand, camera.fov, hoehe);
        return [{ eintrag, p, radiusPixel }];
      });
      kandidaten.sort((a, b) => a.p.tiefe - b.p.tiefe);

      const platziert: { x: number; y: number }[] = [];
      const gezeigt = new Set<string>();

      for (const { eintrag, p, radiusPixel } of kandidaten) {
        // Die Glyphe ersetzt den Körper erst, wenn er zu klein zum Treffen ist.
        const brauchtGlyphe = zeigeMarker && needsMarker(radiusPixel);
        if (!zeigeLabels && !brauchtGlyphe) continue;
        if (platziert.some((q) => ueberlappt(q, p))) continue;

        const el = hole(eintrag);
        el.wrapper.style.transform = `translate(${p.x}px, ${p.y}px)`;
        el.wrapper.hidden = false;
        el.glyphe.hidden = !brauchtGlyphe;
        el.text.hidden = !zeigeLabels;
        platziert.push(p);
        gezeigt.add(eintrag.id);
      }

      for (const [id, el] of knoten) {
        if (!gezeigt.has(id)) el.wrapper.hidden = true;
      }
    },
    dispose() {
      wurzel.remove();
      knoten.clear();
    },
  };
}
