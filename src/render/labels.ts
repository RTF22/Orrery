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

/**
 * Zweite, höhere Schwelle nur für Monde (siehe zeigeLabel unten). Ab 35
 * Katalogkörpern reicht die Markerschwelle allein nicht mehr: Ein Mond wird
 * bei ihr schon als echte Kugel statt als Ersatzglyphe gezeichnet, ist dabei
 * aber noch viel zu klein, um seinen Namen von den Nachbarmonden im selben
 * System (Jupiter, Saturn) unterscheidbar zu machen.
 *
 * Herleitung von 8: Solange die Kamera nah am Mutterplaneten bleibt (der
 * Mondabstand vernachlässigbar gegen die Kameraentfernung ist), skaliert
 * sim/scale.ts Mondbahn UND Mondradius mit demselben sizeScale-Faktor — der
 * scheinbare Mondradius in Pixeln steht damit in einem von der Kamera-
 * entfernung UNABHÄNGIGEN Verhältnis zum scheinbaren Planetenradius, nämlich
 * schlicht (physischer Mondradius / physischer Planetenradius). Für Jupiters
 * kleinsten Galileischen Mond gilt Europa/Jupiter = 1560,8 km / 69911 km =
 * 0,02233 (radiusKm aus data/bodies/europa via jupiter-monde.ts bzw.
 * jupiter.ts). Bei Schwelle 8 bekommt Europa sein Label also erst, sobald
 * Jupiter selbst auf rund 8 / 0,02233 ≈ 358 Pixel angewachsen ist — eine
 * echte Nahaufnahme (bei 1080 Pixel Bildhöhe knapp ein Drittel davon), keine
 * Systemschau. Gegenprobe mit dem tatsächlichen Code (targetFor +
 * apparentRadiusPixels, DEFAULT_STATE, Epoche J2000): Bei der Standard-
 * Startkamera (camera.distance = 8e8 km, Ziel Sonne) misst Jupiter dort nur
 * rund 8,1 Pixel, jeder der vier Galileischen Monde 0,17 bis 0,30 Pixel —
 * zwei Größenordnungen unter dieser Schwelle und damit sicher ausgeblendet.
 * MARKER_MIN_PIXEL (3) allein wäre hier zu niedrig: Bei Jupiter ≈ 134 Pixel
 * wäre die Ersatzglyphe längst durch die echte Kugel ersetzt, während
 * Europas Name noch elf weitere Verdopplungen der Jupitergröße bräuchte.
 */
export const LABEL_MIN_PIXEL_MOND = 8;

/**
 * Textbeschriftung zeigen? Planeten, Zwergplaneten und die Sonne behalten
 * ihr Label unabhängig von ihrer Bildschirmgröße (siehe Spec-Abschnitt
 * „Beschriftungen"). Ein Mond bekommt seines erst ab LABEL_MIN_PIXEL_MOND —
 * sonst überfüllen bei 35 Katalogkörpern allein die Mondnamen des Jupiter-
 * und Saturnsystems die Systemschau.
 */
export function zeigeLabel(radiusPixel: number, istMond: boolean): boolean {
  if (!istMond) return true;
  return radiusPixel > LABEL_MIN_PIXEL_MOND;
}

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
  /**
   * Für die Mond-Schwelle in zeigeLabel (LABEL_MIN_PIXEL_MOND) UND als
   * Rangkriterium in der Kollisionsauflösung von update() — Sonne, Planeten
   * und Zwergplaneten (istMond === false) vor Monden. Kein eigenes
   * Rang-Feld: body.kind kennt zwar vier Klassen (star/planet/moon/dwarf),
   * aber die Beschriftung braucht durchgehend nur die binäre Unterscheidung
   * Mond/Nicht-Mond. Ein zusätzliches Feld würde exakt dieselbe Tatsache ein
   * zweites Mal tragen — zwei Quellen, die auseinanderlaufen könnten, für
   * eine Information, die dieses eine Flag bereits vollständig abbildet.
   */
  istMond: boolean;
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

      // Erst alles projizieren, dann zweistufig sortiert platzieren: zuerst
      // nach Rang (Sonne, Planeten und Zwergplaneten vor Monden), erst
      // INNERHALB desselben Rangs weiter nach Tiefe. Reine Tiefensortierung
      // würde Planet und Mond gleichrangig behandeln — zieht ein Mond vor
      // seinem Planeten vorbei, ist er der vordere und verdrängt dessen
      // Beschriftung, zieht er dahinter, kommt sie zurück. Bei kurzen
      // Umlaufzeiten (Io, Phobos) mehrmals pro Sekunde im Zeitraffer — genau
      // das gemeldete Flackern. Mit dem Rang zuerst gewinnt die
      // Planetenbeschriftung unabhängig davon, wer gerade näher steht; „bei
      // Überlappung gewinnt der vordere Körper" gilt damit nur noch
      // INNERHALB derselben Rangstufe (Planet gegen Planet, Mond gegen Mond).
      const kandidaten = eintraege.flatMap((eintrag) => {
        if (!eintrag.sichtbar) return [];
        const p = projectToScreen(eintrag.renderPos, camera, breite, hoehe);
        if (p === null) return [];
        const abstand = Math.hypot(eintrag.renderPos.x, eintrag.renderPos.y, eintrag.renderPos.z);
        const radiusPixel = apparentRadiusPixels(eintrag.radiusUnits, abstand, camera.fov, hoehe);
        return [{ eintrag, p, radiusPixel }];
      });
      const rang = (istMond: boolean): 0 | 1 => (istMond ? 1 : 0);
      kandidaten.sort((a, b) => {
        const rangUnterschied = rang(a.eintrag.istMond) - rang(b.eintrag.istMond);
        if (rangUnterschied !== 0) return rangUnterschied;
        return a.p.tiefe - b.p.tiefe;
      });

      // Jeder belegte Platz merkt sich zusätzlich, ob er eine Beschriftung
      // trägt oder nur eine Ersatzglyphe (Marker-Punkt für einen zu kleinen
      // Körper). Eine bloße Glyphe ist visuell ein kleiner Punkt — sie soll
      // keiner Beschriftung ihren Platz streitig machen können, sonst könnte
      // ein winziger Mondmarker weiterhin ein Planetenlabel verdecken, auch
      // wenn der Rang das jetzt eigentlich verhindert (z. B. zwei Monde
      // desselben Rangs). Zwei Glyphen weichen sich weiterhin gegenseitig
      // aus, und eine Beschriftung blockiert weiterhin auch eine bloße
      // Glyphe (ein Punkt mitten im Namen eines anderen Körpers wäre
      // ebenfalls unschön) — nur die eine Richtung „Glyphe verdrängt Text"
      // wird hier ausgeschlossen.
      const platziert: { x: number; y: number; hatText: boolean }[] = [];
      const gezeigt = new Set<string>();

      for (const { eintrag, p, radiusPixel } of kandidaten) {
        // Die Glyphe ersetzt den Körper erst, wenn er zu klein zum Treffen ist.
        const brauchtGlyphe = zeigeMarker && needsMarker(radiusPixel);
        // Die Mondschwelle greift VOR der Kollisionsauflösung: Ein zu kleiner
        // Mond belegt gar keinen Platz und tritt keinem anderen Label seinen
        // Platz ab.
        const zeigtText = zeigeLabels && zeigeLabel(radiusPixel, eintrag.istMond);
        if (!zeigtText && !brauchtGlyphe) continue;

        const belegt = zeigtText ? platziert.filter((q) => q.hatText) : platziert;
        if (belegt.some((q) => ueberlappt(q, p))) continue;

        const el = hole(eintrag);
        el.wrapper.style.transform = `translate(${p.x}px, ${p.y}px)`;
        el.wrapper.hidden = false;
        el.glyphe.hidden = !brauchtGlyphe;
        el.text.hidden = !zeigtText;
        platziert.push({ x: p.x, y: p.y, hatText: zeigtText });
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
