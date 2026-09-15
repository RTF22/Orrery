import * as THREE from 'three';
import type { RenderContext } from './renderer';
import type { AppState } from '../store/types';
import { createBodyViews } from './bodies';
import { createRingViews } from './rings';
import { createBeltViews } from './belts';
import { createOrbitLines } from './orbits';
import { createStarfield } from './starfield';
import { createLabelOverlay } from './labels';
import type { LabelEintrag } from './labels';
import { createCameraController } from './camera/controller';
import { createExposureMeter } from './exposure';
import type { LightingSettings } from './lighting';
import { scaledPositionAt } from '../sim/scale';
import { bodies, bodyIndex } from '../data/index';
import { AU_KM } from '../sim/orbit';
import { kmToUnits, worldToRender } from './units';
import { findeTreffer, projiziereZug, FANG_PX } from './treffer';
import type { Bahnzug, Kandidaten, Zeigerart } from './treffer';

/**
 * Abstand der Erde von der Sonne in Render-Einheiten — der Fixpunkt der
 * Abstandskompression (siehe compressDistance in sim/scale.ts), also bei
 * jedem Maßstabs-Preset identisch.
 */
const AU_EINHEITEN = kmToUnits(AU_KM);

/**
 * Zielsignatur — sie bleibt bis Task 15 unverändert. Die Szene holt sich
 * Maßstab, Sichtbarkeiten und Kameramodus selbst aus dem übergebenen
 * Zustand, statt mit jedem Task einen weiteren Parameter zu bekommen.
 */
export interface SceneHandle {
  update: (jd: number, dt: number, state: AppState) => void;
  dispose: () => void;
  /** Zeigerposition für die Hover-Hervorhebung; flüchtig, nicht im Store (Entwurf Klickflächen §3.3). */
  setZeiger: (zeiger: { x: number; y: number; art: Zeigerart } | null) => void;
  /** Körper unter dem Zeiger aus dem zuletzt berechneten Bild, oder null. */
  hervorgehoben: () => string | null;
  /** Trefferprüfung gegen die Kandidaten des zuletzt berechneten Bildes, für Tippen/Klick. */
  trefferBei: (x: number, y: number, art: Zeigerart) => string | null;
}

/**
 * Baut die Szene auf: die Körper-Meshes (Task 10) sowie ein Punktlicht an
 * der Sonnenposition, das die Planeten beleuchtet.
 */
export function buildScene(
  ctx: RenderContext,
  overlay: HTMLElement,
  name: (key: string) => string,
): SceneHandle {
  // Die Ringe zuerst: Der Körper-Shader sampelt für den Ringschatten die
  // Textur, die die Ringscheibe selbst zeichnet, und bekommt sie hier als
  // Abfrage gereicht (siehe RingViews.ringTextur).
  const ringe = createRingViews(ctx.scene);
  const koerper = createBodyViews(ctx.scene, (id) => ringe.ringTextur(id));
  const guertel = createBeltViews(ctx.scene);
  const bahnen = createOrbitLines(ctx.scene);
  // Einmalig aufgebaut: Sterne stehen fest auf einer sehr großen Kugel um den
  // Ursprung und werden — anders als Körper und Bahnen — nie pro Frame neu
  // positioniert (siehe Kommentar in starfield.ts).
  createStarfield(ctx.scene);

  // Beschriftungen und Ersatzglyphen liegen als HTML über der Canvas.
  const labels = createLabelOverlay(overlay, name);

  const licht = new THREE.PointLight(0xffffff, 1, 0, 2);
  ctx.scene.add(licht);

  // Kameramodi, Dämpfung und Blickrichtung liegen vollständig im Controller;
  // die Szene braucht davon nur die Position (siehe camera/controller.ts).
  const kamera = createCameraController(ctx.camera);

  // Die Kamera belichtet auf das Ziel (exposure.ts): Der Faktor geht auf die
  // Bestrahlungsstärke — Punktlicht, Körper, Ringe — und bewusst nicht auf
  // das Tonemapping. Sonne, Sterne, Bahnlinien und Bloom hängen nicht an
  // brightness und bleiben deshalb unverändert.
  const belichtung = createExposureMeter();

  // Hover (Entwurf Klickflächen §3.3): flüchtig, nicht im Store.
  let zeiger: { x: number; y: number; art: Zeigerart } | null = null;
  let hover: string | null = null;
  const blick = new THREE.Matrix4();
  const bahnPuffer = new Map<string, Float64Array>();

  /** Kandidaten des zuletzt berechneten Bildes; Bahnen aus den gezeichneten Puffern. */
  const kandidaten = (): Kandidaten => {
    blick.multiplyMatrices(ctx.camera.projectionMatrix, ctx.camera.matrixWorldInverse);
    const zuege: Bahnzug[] = [];
    for (const [id, linie] of bahnen.lines) {
      if (!linie.visible) continue;
      const attr = linie.geometry.getAttribute('position');
      let ziel = bahnPuffer.get(id);
      if (ziel === undefined) {
        ziel = new Float64Array(attr.count * 2);
        bahnPuffer.set(id, ziel);
      }
      projiziereZug(attr.array, attr.count, blick, overlay.clientWidth, overlay.clientHeight, ziel);
      zuege.push({ id, punkte: ziel });
    }
    return { scheiben: labels.trefferScheiben(), namen: labels.namensRechtecke(), bahnen: zuege };
  };

  return {
    update(jd, dt, state) {
      // Die Kamera selbst bleibt konstruktionsbedingt im Ursprung (siehe
      // renderer.ts) — bewegt wird die Welt relativ zu dieser gedachten
      // Kameraposition in Kilometern.
      const { x, y, z } = kamera.update(state, jd, dt, state.scale);
      const cameraKm = new THREE.Vector3(x, y, z);

      // lookAt setzt nur die Quaternion; die Blickmatrix erneuert sonst erst der
      // Renderer. Overlay und Trefferprüfung projizieren aber schon hier.
      ctx.camera.updateMatrixWorld();

      const exposure = belichtung.update(state, jd, dt);
      const belichtet: LightingSettings = {
        ...state.display, brightness: state.display.brightness * exposure,
      };

      // Die momentane Bahnellipse je Bild — ohne Kepler-Löser, siehe orbits.ts.
      bahnen.update(cameraKm, state.visible, state.display.orbits, jd, state.scale, hover);

      koerper.update(jd, state.scale, cameraKm, state.visible, belichtet, state.display.shadows);

      // Das Licht sitzt an der (kamerarelativen) Sonnenposition.
      const sonnenpositionKm = scaledPositionAt('sun', bodyIndex, jd, state.scale);
      const lichtRender = worldToRender(sonnenpositionKm, cameraKm);
      licht.position.set(lichtRender.x, lichtRender.y, lichtRender.z);

      // Ringe bekommen dieselben Argumente wie die Körper, dazu die
      // kamerarelative Sonnenposition für die Vorwärtsstreuung (siehe
      // rings.ts) — dasselbe Punktlicht, das gerade eben positioniert wurde.
      ringe.update(
        jd, state.scale, cameraKm, state.visible, belichtet,
        new THREE.Vector3(lichtRender.x, lichtRender.y, lichtRender.z),
        state.display.shadows,
      );

      // Die Gürtel rechnen ihre Bahnen im Vertex-Shader (belts.ts) und
      // brauchen deshalb nur den Kompressionsexponenten, nicht den ganzen
      // Maßstab: Größen gibt es bei Punkten keine. Die Pixeldichte kommt
      // vom Renderer, damit ein Teilchen auf jedem Bildschirm gleich groß
      // erscheint.
      guertel.update(
        jd, state.scale.distanceExponent, cameraKm, state.quality.tier,
        state.display.belts, belichtet, ctx.renderer.getPixelRatio(),
      );

      // Kalibrierung: Bei 1 AE Abstand vom Licht soll die Bestrahlungsstärke
      // exakt die belichtete Helligkeit betragen — `brightness` mal
      // Zielbelichtung, siehe exposure.ts — unabhängig vom gewählten
      // Abfallexponenten. Ohne diesen Faktor wäre „Helligkeit 1" von der
      // Render-Einheit (1 Einheit = 1000 km) abhängig: bei physikalisch
      // korrektem quadratischem Abfall und Planetenabständen in der
      // Größenordnung 10^5 Render-Einheiten bliebe jeder Körper mit
      // Helligkeit 1 vollständig unbeleuchtet.
      licht.intensity = belichtet.brightness * AU_EINHEITEN ** belichtet.lightFalloff;
      licht.decay = belichtet.lightFalloff;

      // Die Meshes tragen die fertige kamerarelative Position und den
      // skalierten Radius bereits — das Overlay rechnet nichts doppelt.
      const eintraege: LabelEintrag[] = bodies.flatMap((body) => {
        const mesh = koerper.meshes.get(body.id);
        if (mesh === undefined) return [];
        return [{
          id: body.id,
          nameKey: body.info.nameKey,
          farbe: body.appearance.color,
          renderPos: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
          radiusUnits: mesh.scale.x,
          sichtbar: mesh.visible,
          istMond: body.kind === 'moon',
        }];
      });
      // Die Kennung kommt aus dem Store, die Namen aus dem Auflöser (t() in
      // app/main.tsx, gespiegelt durch useSprache). Beide folgen demselben
      // Store-Schreibvorgang; Reacts Commit läuft als Microtask und damit
      // vor dem nächsten Animationsframe, sodass Kennung und Tabelle hier
      // nie auseinanderlaufen.
      labels.update(
        eintraege, ctx.camera, state.display.labels, state.display.markers, state.ui.language, hover,
      );

      // Treffer erst nach dem Projizieren; die Hervorhebung folgt im nächsten
      // Bild — ein Bild Versatz ist nicht zu sehen.
      hover = zeiger === null ? null : findeTreffer(zeiger, kandidaten(), FANG_PX[zeiger.art]);
    },
    dispose() {
      labels.dispose();
      ringe.dispose();
      guertel.dispose();
    },
    setZeiger(neu) {
      zeiger = neu;
      if (neu === null) hover = null;
    },
    hervorgehoben: () => hover,
    trefferBei: (x, y, art) => findeTreffer({ x, y }, kandidaten(), FANG_PX[art]),
  };
}
