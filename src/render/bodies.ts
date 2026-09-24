import * as THREE from 'three';
import type { Body, Vec3 } from '../sim/types';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt, scaledRadius } from '../sim/scale';
import { rotationAt } from '../sim/orbit';
import { poleVector } from '../sim/frames';
import { bodies, bodyIndex } from '../data/index';
import { kmToUnits, worldToRender } from './units';
import { BLOOM_LAYER } from './postfx';
import { bodyLighting } from './lighting';
import type { LightingSettings } from './lighting';
import { albedoFaktor, farbMittelLinear } from './albedo';
import {
  MAX_OKKLUDER, sonnenGeometrie, waehleOkkluder,
  SCHATTEN_GLSL_KOERPER_PARS, SCHATTEN_GLSL_KOERPER_ANWENDUNG,
  SCHATTEN_GLSL_VERTEX_PARS, SCHATTEN_GLSL_VERTEX,
} from './shadows';
import { TEXTUREN } from '../data/texturen';

/** Untergrenze, damit Geometrie nie auf null kollabiert. */
export const MIN_RADIUS_UNITS = 1e-4;

export function pickRadiusUnits(body: Body, s: ScaleSettings): number {
  return Math.max(kmToUnits(scaledRadius(body, s)), MIN_RADIUS_UNITS);
}

/**
 * Quaternion, das die lokale y-Achse der Kugelgeometrie (dort liegen ihre
 * Pole) auf die Polrichtung dreht. Ersetzt die frühere Kippung um die
 * x-Achse, die zwar den Betrag der Achsneigung traf, aber eine willkürliche
 * Richtung wählte — mit Ringen und Monden in derselben Ebene fällt das auf.
 */
export function poleAusrichtung(pole: Vec3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(pole.x, pole.y, pole.z).normalize(),
  );
}

export interface BodyViews {
  update(
    jd: number,
    s: ScaleSettings,
    cameraKm: THREE.Vector3,
    visible: Record<string, boolean>,
    licht: LightingSettings,
    schatten: boolean,
  ): void;
  meshes: Map<string, THREE.Mesh>;
  /** Setzt eine geladene Stufe; eine Stufe, die nicht breiter ist als die sitzende, wird verworfen (dispose). */
  setzeTextur(id: string, textur: THREE.Texture, breite: number): void;
  /** Breite der sitzenden Stufe, 0 ohne Textur. */
  texturBreite(id: string): number;
}

/**
 * Die Uniforms des Schattenbausteins (render/shadows.ts) je Körper.
 *
 * Zwei Bezugssysteme treffen hier aufeinander, und das ist Absicht (Entwurf
 * §2, "Sonnenrichtung und Sonnenwinkel aus der echten Geometrie"):
 * `uSonnenRichtung` und `uSonnenWinkel` kommen aus der **echten**,
 * unkomprimierten Geometrie (`sonnenGeometrie` → `positionAt`), Okkluder und
 * Fragmentposition dagegen aus den **dargestellten** Positionen und Radien.
 * Das geht auf, weil `scaledPositionAt` Radien und Mondabstände innerhalb
 * eines Planetensystems mit demselben `sizeScale` skaliert: Die dargestellte
 * Geometrie ist der echten dort exakt ähnlich, und Ähnlichkeit erhält Winkel.
 * Der Sonnenwinkel als bloße Zahl macht die Rechnung unabhängig davon, wo die
 * dargestellte (gedämpfte, komprimiert nahe) Sonne steht. Mit der
 * dargestellten Sonnenposition stünde bei „Schaubild" der Mond 50-fach weiter
 * von der Erde, die Sonne aber weiter bei 1 AE — die Sonnenrichtung am Mond
 * wiche um 7° von der an der Erde ab und der Erdschatten läge am falschen Ort.
 *
 * Längen sind durchgehend Render-Einheiten, kamerarelativ — dasselbe System,
 * in dem `vSchattenPos` im Shader steht.
 */
interface SchattenUniforms {
  uSonnenRichtung: { value: THREE.Vector3 };
  uSonnenWinkel: { value: number };
  uOkkluder: { value: THREE.Vector4[] };
  uOkkluderFarbe: { value: THREE.Vector3[] };
  uOkkluderAnzahl: { value: number };
  uRingEbeneA: { value: THREE.Vector4 };
  uRingEbeneB: { value: THREE.Vector4 };
  uRingAktiv: { value: number };
  tRingSchatten: { value: THREE.Texture };
}

/**
 * 1×1-Textur aus lauter Nullen — Alpha 0, der Shader liest daraus den
 * Durchlass 1. Sie belegt `tRingSchatten` bei jedem Körper ohne Ringträger;
 * ein unbelegter sampler2D wäre in WebGL ein Übersetzungs- bzw. Bindefehler.
 */
function leereRingTextur(): THREE.DataTexture {
  const textur = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
  textur.needsUpdate = true;
  return textur;
}

function neueSchattenUniforms(leer: THREE.Texture): SchattenUniforms {
  return {
    uSonnenRichtung: { value: new THREE.Vector3(1, 0, 0) },
    uSonnenWinkel: { value: 0 },
    uOkkluder: { value: Array.from({ length: MAX_OKKLUDER }, () => new THREE.Vector4()) },
    uOkkluderFarbe: { value: Array.from({ length: MAX_OKKLUDER }, () => new THREE.Vector3(1, 1, 1)) },
    uOkkluderAnzahl: { value: 0 },
    uRingEbeneA: { value: new THREE.Vector4() },
    uRingEbeneB: { value: new THREE.Vector4() },
    uRingAktiv: { value: 0 },
    tRingSchatten: { value: leer },
  };
}

type KoerperMaterial = THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;

/**
 * Ein Körper mitsamt der Farbe, die seine Beleuchtung skaliert.
 *
 * `basisFarbe` ist die Ausgangsfarbe **vor** der Verstärkung aus
 * lighting.ts: solange keine Textur geladen ist die Ausweichfarbe des
 * Körpers, danach Weiß. Ohne diesen Wechsel würde Three die Albedo-Textur
 * mit der Ausweichfarbe multiplizieren — bei der Erde `#2a6fdb`, linear
 * also (0,02 | 0,16 | 0,71): Der Rotkanal der Textur fiele auf zwei
 * Prozent, und der Planet wäre selbst auf der Tagseite fast schwarz.
 *
 * `albedoFaktor` normiert die Reflexion auf die Katalog-Albedo
 * (physical.albedo): vor dem Laden aus der Ausweichfarbe, danach aus dem
 * Mittel in `data/texturen.ts` — siehe albedo.ts. Er geht auf die
 * Materialfarbe und auf das Nachtseiten-Emissiv, damit die Nachtseite
 * derselbe Bruchteil der Tagseite bleibt.
 */
interface KoerperEintrag {
  material: KoerperMaterial;
  basisFarbe: THREE.Color;
  albedoFaktor: number;
  /** Nur bei MeshStandardMaterial belegt: Die Sonne leuchtet selbst und wird nie beschattet. */
  schatten: SchattenUniforms | null;
  /** Breite der sitzenden Stufe, 0 ohne Textur. */
  texturBreite: number;
}

/**
 * @param ringTextur Liefert die Ringtextur eines Ringträgers (rings.ts). Ohne
 *   sie bleibt der Ringschatten bei der leeren Textur, also wirkungslos —
 *   praktisch nur in Tests, die die Ringe nicht mit aufbauen.
 */
export function createBodyViews(
  scene: THREE.Scene, ringTextur?: (bodyId: string) => THREE.Texture | undefined,
): BodyViews {
  const meshes = new Map<string, THREE.Mesh>();
  const eintraege = new Map<string, KoerperEintrag>();
  // Eine einzige leere Textur für alle Körper ohne Ringträger.
  const leereTextur = leereRingTextur();

  for (const body of bodies) {
    const fallbackFarbe = new THREE.Color(body.appearance.color);

    // Die Sonne leuchtet selbst, alle anderen werden beleuchtet.
    const material: KoerperMaterial = body.kind === 'star'
      ? new THREE.MeshBasicMaterial({ color: fallbackFarbe })
      : new THREE.MeshStandardMaterial({
        color: fallbackFarbe, roughness: 1, metalness: 0,
        // Das Fülllicht der Nachtseite; die Stärke setzt update pro Frame.
        emissive: fallbackFarbe.clone(), emissiveIntensity: 0,
      });
    const eintrag: KoerperEintrag = {
      material,
      basisFarbe: fallbackFarbe.clone(),
      // Bis die Textur steht (und dauerhaft bei Körpern ohne Textur): die
      // Ausweichfarbe so skalieren, dass ihr Mittel der Albedo entspricht.
      albedoFaktor: albedoFaktor(body.physical.albedo, farbMittelLinear(body.appearance.color)),
      schatten: material instanceof THREE.MeshStandardMaterial
        ? neueSchattenUniforms(leereTextur) : null,
      texturBreite: 0,
    };
    eintraege.set(body.id, eintrag);

    // Der Schattenbaustein wird in Threes eigenen Standard-Shader eingenäht
    // (Entwurf §2, "Einbau in MeshStandardMaterial"), damit Textur,
    // Lambert-BRDF und das Emissiv-Fülllicht aus Phase 3a unverändert
    // bleiben. Alle Körper bekommen denselben Programm-Cacheschlüssel: Der
    // Quelltext ist für jeden identisch, nur die Uniforms unterscheiden sich
    // — ohne den Schlüssel übersetzte three den Baustein je Material neu.
    const schatten = eintrag.schatten;
    if (schatten !== null) {
      material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, schatten);
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', `#include <common>\n${SCHATTEN_GLSL_VERTEX_PARS}`)
          .replace('#include <project_vertex>', `#include <project_vertex>\n${SCHATTEN_GLSL_VERTEX}`);
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', `#include <common>\n${SCHATTEN_GLSL_KOERPER_PARS}`)
          .replace(
            '#include <lights_fragment_end>',
            `#include <lights_fragment_end>\n${SCHATTEN_GLSL_KOERPER_ANWENDUNG}`,
          );
      };
      material.customProgramCacheKey = () => 'schatten';
    }

    // Einheitskugel; die tatsächliche Größe kommt über scale.
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material);
    // Der Name macht das Mesh für Messungen per scene.getObjectByName auffindbar.
    mesh.name = body.id;
    // Selbstleuchtende Körper zusätzlich auf die Bloom-Ebene: Nur sie
    // bekommen im Post-Processing einen Lichtkranz (siehe postfx.ts).
    if (body.kind === 'star') mesh.layers.enable(BLOOM_LAYER);
    scene.add(mesh);
    meshes.set(body.id, mesh);
  }

  // Dargestellte Positionen und Radien des laufenden Bildes (Render-
  // Einheiten, kamerarelativ). Sie entstehen in Phase 1 der Aktualisierung
  // und sind in Phase 2 die Eingabe der Okkluderauswahl — außerhalb der
  // Schleife angelegt, damit pro Bild keine zwei Maps neu entstehen.
  const positionen = new Map<string, Vec3>();
  const radien = new Map<string, number>();

  return {
    meshes,
    setzeTextur(id, textur, breite) {
      const eintrag = eintraege.get(id);
      const stufen = TEXTUREN[id];
      // Nie herunterstufen (Entwurf Phase 5 §5.4): Kommt eine schmalere
      // Stufe erst nach einer breiteren an, wird sie verworfen.
      if (eintrag === undefined || stufen === undefined || breite <= eintrag.texturBreite) {
        textur.dispose();
        return;
      }
      const { material } = eintrag;
      const alt = material.map;
      material.map = textur;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.emissiveMap = textur;
        material.emissive.setRGB(1, 1, 1);
      }
      eintrag.basisFarbe.setRGB(1, 1, 1);
      // Die Karte ist ein kontrastnormiertes Mosaik — erst der Faktor macht
      // aus ihrem Mittel die Albedo des Körpers (siehe albedo.ts). Alle
      // Stufen teilen das Mittel der 1k-Stufe, damit der Tausch die
      // Helligkeit nicht verschiebt; das Bauskript hält sie auf 0,005 beisammen.
      eintrag.albedoFaktor = albedoFaktor(bodyIndex[id]?.physical.albedo, stufen[0]!.mittel);
      eintrag.texturBreite = breite;
      material.needsUpdate = true;
      alt?.dispose();
    },
    texturBreite: (id) => eintraege.get(id)?.texturBreite ?? 0,
    update(jd, s, cameraKm, visible, licht, schatten) {
      positionen.clear();
      radien.clear();

      for (const body of bodies) {
        const mesh = meshes.get(body.id);
        if (!mesh) continue;
        if (visible[body.id] === false) { mesh.visible = false; continue; }
        mesh.visible = true;

        // THREE.Vector3 erfüllt strukturell das Vec3-Interface der Sim-Schicht.
        const weltKm = scaledPositionAt(body.id, bodyIndex, jd, s);
        const r = worldToRender(weltKm, cameraKm);
        mesh.position.set(r.x, r.y, r.z);

        const radius = pickRadiusUnits(body, s);
        mesh.scale.setScalar(radius);

        // Nur sichtbare Körper werfen Schatten: Was nicht im Bild steht, darf
        // auch nicht verdunkeln. Ausgeblendete Körper fehlen deshalb in
        // beiden Tabellen, und waehleOkkluder lässt sie damit weg.
        positionen.set(body.id, { x: r.x, y: r.y, z: r.z });
        radien.set(body.id, radius);

        // Beleuchtung pro Körper: Das Punktlicht gilt für alle gemeinsam,
        // der Abstandsausgleich und das Fülllicht der Nachtseite hängen am
        // eigenen Sonnenabstand — siehe lighting.ts. Die Sonne ist
        // selbstleuchtend und bleibt davon unberührt.
        const eintrag = eintraege.get(body.id);
        if (eintrag !== undefined && body.kind !== 'star') {
          const sonnenabstandKm = Math.sqrt(weltKm.x ** 2 + weltKm.y ** 2 + weltKm.z ** 2);
          const l = bodyLighting(sonnenabstandKm, licht);
          eintrag.material.color.copy(eintrag.basisFarbe)
            .multiplyScalar(l.colorGain * eintrag.albedoFaktor);
          if (eintrag.material instanceof THREE.MeshStandardMaterial) {
            eintrag.material.emissiveIntensity = l.emissiveIntensity * eintrag.albedoFaktor;
          }
          mesh.userData['albedoFaktor'] = eintrag.albedoFaktor;
        }

        // Ausrichtung: Pol zuerst, dann die Eigenrotation um genau diese Achse.
        const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
        mesh.quaternion.copy(poleAusrichtung(pol));
        mesh.rotateY(rotationAt(body, jd));
      }

      // Phase 2: Okkluder je Körper. Sie braucht die dargestellten Positionen
      // und Radien *aller* Körper und kann deshalb erst laufen, wenn Phase 1
      // vollständig durch ist.
      for (const body of bodies) {
        const u = eintraege.get(body.id)?.schatten;
        if (u === undefined || u === null) continue;

        if (!schatten) {
          // Der Schalter schaltet nur die Uniforms ab, nicht das Programm —
          // so wird beim Umlegen nichts neu übersetzt (Entwurf §2, "Schalter").
          u.uOkkluderAnzahl.value = 0;
          u.uRingAktiv.value = 0;
          continue;
        }

        const sonne = sonnenGeometrie(body.id, bodyIndex, jd);
        u.uSonnenRichtung.value.set(sonne.richtung.x, sonne.richtung.y, sonne.richtung.z);
        u.uSonnenWinkel.value = sonne.winkelRad;

        const auswahl = waehleOkkluder(
          body, bodyIndex, (id) => positionen.get(id), (id) => radien.get(id),
        );
        for (let i = 0; i < auswahl.kugeln.length; i++) {
          const { mitte, radius, farbe } = auswahl.kugeln[i]!;
          u.uOkkluder.value[i]!.set(mitte.x, mitte.y, mitte.z, radius);
          u.uOkkluderFarbe.value[i]!.set(farbe[0], farbe[1], farbe[2]);
        }
        u.uOkkluderAnzahl.value = auswahl.kugeln.length;

        const ring = auswahl.ring;
        if (ring !== null) {
          u.uRingEbeneA.value.set(ring.mitte.x, ring.mitte.y, ring.mitte.z, ring.innen);
          u.uRingEbeneB.value.set(ring.normale.x, ring.normale.y, ring.normale.z, ring.aussen);
          // Pro Bild neu abgefragt: rings.ts tauscht den Uniform-Wert aus,
          // sobald das Ringbild geladen ist (siehe ladeRingTextur dort).
          u.tRingSchatten.value = ringTextur?.(ring.bodyId) ?? leereTextur;
          u.uRingAktiv.value = 1;
        } else {
          u.uRingAktiv.value = 0;
        }
      }
    },
  };
}
