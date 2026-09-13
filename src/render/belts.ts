import * as THREE from 'three';
import type { BeltElements, BeltSpec } from '../sim/belts';
import { generateBelt, beltCount, HAUPTGUERTEL, KUIPERGUERTEL } from '../sim/belts';
import type { QualityTier } from '../store/types';
import type { Vec3 } from '../sim/types';
import { AU_KM } from '../sim/orbit';
import { J2000 } from '../sim/time';
import { RENDER_UNIT_KM } from './units';
import { bodyLighting, irradianceFactor } from './lighting';
import type { LightingSettings } from './lighting';

/**
 * Punktwolken der Gürtel: ein `THREE.Points` je Gürtel, die Bahnrechnung
 * vollständig im Vertex-Shader (siehe Entwurf
 * docs/superpowers/specs/2026-09-13-guertel-design.md, Abschnitt 2). Die
 * Bahnelemente kommen aus `sim/belts.ts` und liegen als Attribute auf der
 * GPU; pro Frame sendet die CPU nur Uniforms. 50 000 Keplerlösungen je Bild
 * in JavaScript wären der teuerste Teil der ganzen Szene.
 */

/**
 * Feste Keime der beiden Wolken — verschieden, damit die Gürtel nicht
 * dieselbe Winkelfolge tragen. Wie beim Standardkeim des Kinos
 * (store/index.ts) ein Datum: Gleicher Keim und gleiche Anzahl ergeben
 * identische Attribute, der Gürtel ist zwischen zwei Sitzungen also
 * wiedererkennbar und jede Pixelmessung nachstellbar.
 */
export const HAUPTGUERTEL_KEIM = 20260913;
export const KUIPERGUERTEL_KEIM = 20260914;

/**
 * Mittlerer Sonnenabstand je Gürtel in AE — Bezugspunkt der Beleuchtung.
 * Ein Wert je Gürtel statt einer Rechnung je Teilchen: Der Hauptgürtel ist
 * mit 2,1 bis 3,3 AE radial schmal genug, dass die Bestrahlungsstärke über
 * die Wolke hinweg um weniger als den Faktor 2,5 schwankt — bei
 * 50 000 Teilchen wäre eine Beleuchtung pro Teilchen reine Rechenzeit ohne
 * sichtbaren Gewinn.
 */
const HAUPTGUERTEL_ABSTAND_AE = 2.7;
const KUIPERGUERTEL_ABSTAND_AE = 43;

/**
 * Albedo der Hauptgürtel-Teilchen: 0,06, der typische Wert dunkler C-Typ-
 * Asteroiden, die den äußeren Hauptgürtel dominieren. Bewusst kein an die
 * Sichtbarkeit angepasster Wert — sichtbar werden die Teilchen über die
 * Punktgröße (siehe PUNKT_BASIS_PX), nicht über eine falsche Helligkeit.
 */
export const BELT_ALBEDO = 0.06;

/**
 * Albedo der Kuipergürtel-Teilchen: 0,12. Die Kuiper-Wolke (sim/belts.ts)
 * besteht zu 60 % aus kalten klassischen KBOs, zu 25 % aus heißen und zu
 * 15 % aus Plutinos; die Herschel-Radiometrie („TNOs are Cool") misst dafür
 * geometrische Albedos von rund 0,14, 0,085 und 0,08 — gewichtet 0,12.
 * Wieder ein Messwert und keine Sichtbarkeitszahl (Entwurf, Abschnitt 2):
 * Der Kuipergürtel ist schlicht doppelt so hell wie der C-Typ-dominierte
 * Hauptgürtel.
 */
export const KUIPERGUERTEL_ALBEDO = 0.12;

/**
 * Grundgröße eines Teilchens in geräteunabhängigen Pixeln. Mit
 * `uPixelRatio` multipliziert ergibt das auf jedem Bildschirm dieselbe
 * physische Größe; der Nahzuschlag im Vertex-Shader hebt sie auf bis zu
 * vier Gerätepixel, wenn die Kamera sehr dicht am Teilchen steht.
 */
const PUNKT_BASIS_PX = 1.0;

/** Render-Einheiten je AE — die Brücke aus der Rechnung in AE ins Bild. */
const EINHEITEN_PRO_AE = AU_KM / RENDER_UNIT_KM;

/**
 * Newton-Schritte der Keplergleichung im Shader. Fünf genügen bei e ≤ 0,35
 * (Deckel der Verteilungen in sim/belts.ts) weit: Der Startwert
 * E = M + e·sin M liegt bereits in der Größenordnung e² daneben, jeder
 * Schritt verdoppelt die Stellenzahl. Nachgemessen in belts.test.ts gegen
 * die iterative Lösung aus sim/kepler.ts.
 */
const NEWTON_SCHRITTE = 5;

/**
 * Heliozentrische Position eines Gürtelteilchens in AE, bereits
 * abstandskomprimiert — das Gegenstück zum Vertex-Shader als reine
 * Funktion, in derselben Reihenfolge und mit denselben fünf Newton-
 * Schritten.
 *
 * Sie existiert aus demselben Grund wie `vorwaertsstreuung` in rings.ts:
 * Der Shader selbst ist nicht testbar, seine Rechnung schon — und die
 * Ekliptik-Orientierung ist genau der Teil, der still falsch sein kann.
 * belts.test.ts prüft sie gegen `positionInParentFrame` (sim/orbit.ts) und
 * gegen `compressDistance` (sim/scale.ts). Ändert sich eine Zeile hier,
 * muss ihr Gegenstück im Shader mitgehen.
 */
export function beltPositionAE(
  el: { a: number; e: number; inc: number; node: number; peri: number; m0: number; n: number },
  tage: number, k: number,
): Vec3 {
  const M = el.m0 + el.n * tage;
  let E = M + el.e * Math.sin(M);
  for (let i = 0; i < NEWTON_SCHRITTE; i++) {
    E -= (E - el.e * Math.sin(E) - M) / (1 - el.e * Math.cos(E));
  }

  // Position in der Bahnebene: x zum Perihel, y in Bewegungsrichtung.
  const xBahn = el.a * (Math.cos(E) - el.e);
  const yBahn = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);

  // Drehung: Perihelargument, dann Inklination, dann Knotenlänge — Achsen
  // und Reihenfolge exakt wie in positionInParentFrame.
  const cosO = Math.cos(el.peri), sinO = Math.sin(el.peri);
  const cosI = Math.cos(el.inc), sinI = Math.sin(el.inc);
  const cosN = Math.cos(el.node), sinN = Math.sin(el.node);
  const xEbene = cosO * xBahn - sinO * yBahn;
  const yEbene = sinO * xBahn + cosO * yBahn;
  const x = cosN * xEbene - sinN * yEbene * cosI;
  const y = sinN * xEbene + cosN * yEbene * cosI;
  const z = yEbene * sinI;

  // Abstandskompression mit Fixpunkt 1 AE: r' = A·(r/A)^k mit A = 1 AE,
  // also r' = r^k, wenn r in AE steht (compressDistance in sim/scale.ts).
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return { x: 0, y: 0, z: 0 };
  const faktor = Math.pow(r, k) / r;
  return { x: x * faktor, y: y * faktor, z: z * faktor };
}

/**
 * Lineare Helligkeit eines Gürtelteilchens vor dem Tonemapping — das
 * Gegenstück zur letzten Zeile des Fragment-Shaders: Albedo · uTag / π.
 *
 * Der Faktor 1/π steht hier aus demselben Grund wie in rings.ts: Three
 * gewichtet den direkten Anteil seiner Lambert-BRDF intern mit 1/π; ein
 * eigenes ShaderMaterial hat keine BRDF und muss den Faktor selbst tragen,
 * sonst leuchtet der Gürtel um π heller als ein Planet gleicher Albedo.
 */
export function beltHelligkeit(albedo: number, uTag: number): number {
  return (albedo * uTag) / Math.PI;
}

/**
 * `uTag` eines Gürtels: derselbe Weg wie bei den Ringen (rings.ts) —
 * `brightness · colorGain · irradianceFactor` am mittleren Gürtelabstand,
 * also die geklemmte Verstärkung, die auch die Körper bekommen.
 */
export function beltTagHelligkeit(mittlererAbstandAE: number, licht: LightingSettings): number {
  const abstandKm = mittlererAbstandAE * AU_KM;
  return licht.brightness * bodyLighting(abstandKm, licht).colorGain
    * irradianceFactor(abstandKm, licht.lightFalloff);
}

/**
 * Bahnelemente in die beiden Vertex-Attribute umpacken:
 * `aElem1 = (a, e, inc, node)`, `aElem2 = (peri, m0, n, 0)`. Zwei vec4
 * statt sieben einzelner Attribute — sieben Attribute wären sieben
 * Puffer-Bindungen je Draw-Call für dieselben Daten.
 */
export function beltAttribute(el: BeltElements): { elem1: Float32Array; elem2: Float32Array } {
  const elem1 = new Float32Array(el.count * 4);
  const elem2 = new Float32Array(el.count * 4);
  for (let k = 0; k < el.count; k++) {
    const i = k * 4;
    elem1[i] = el.a[k]!;
    elem1[i + 1] = el.e[k]!;
    elem1[i + 2] = el.inc[k]!;
    elem1[i + 3] = el.node[k]!;
    elem2[i] = el.peri[k]!;
    elem2[i + 1] = el.m0[k]!;
    elem2[i + 2] = el.n[k]!;
    elem2[i + 3] = 0;
  }
  return { elem1, elem2 };
}

// Die Rechnung steht bis zur letzten Zeile in AE und Tagen seit J2000 (nie
// im vollen Julianischen Datum: float32 löst dort nur einen Vierteltag auf).
// Erst `uEinheitenProAE` bringt das Ergebnis ins Bild. Jede Zeile ab `float
// M` hat ihr geprüftes Gegenstück in beltPositionAE() oben — beide müssen
// zusammen geändert werden.
const BELT_VERTEX_SHADER = `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute vec4 aElem1;   // a (AE), e, inc, node
  attribute vec4 aElem2;   // peri, m0, n (rad/Tag), 0
  uniform float uTage;
  uniform float uK;
  uniform vec3 uKameraAE;
  uniform float uEinheitenProAE;
  uniform float uPunkt;
  uniform float uPixelRatio;
  void main() {
    float a = aElem1.x;
    float e = aElem1.y;
    float inc = aElem1.z;
    float node = aElem1.w;
    float peri = aElem2.x;
    float m0 = aElem2.y;
    float n = aElem2.z;

    float M = m0 + n * uTage;
    float E = M + e * sin(M);
    for (int i = 0; i < ${NEWTON_SCHRITTE}; i++) {
      E -= (E - e * sin(E) - M) / (1.0 - e * cos(E));
    }

    float xBahn = a * (cos(E) - e);
    float yBahn = a * sqrt(1.0 - e * e) * sin(E);

    float cosO = cos(peri), sinO = sin(peri);
    float cosI = cos(inc),  sinI = sin(inc);
    float cosN = cos(node), sinN = sin(node);
    float xEbene = cosO * xBahn - sinO * yBahn;
    float yEbene = sinO * xBahn + cosO * yBahn;
    vec3 v = vec3(
      cosN * xEbene - sinN * yEbene * cosI,
      sinN * xEbene + cosN * yEbene * cosI,
      yEbene * sinI
    );

    // Abstandskompression mit Fixpunkt 1 AE (compressDistance, sim/scale.ts)
    float r = max(length(v), 1e-6);
    vec3 pos = (v * (pow(r, uK) / r) - uKameraAE) * uEinheitenProAE;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Nahzuschlag: Teilchen dicht vor der Kamera (unter rund 10 000
    // Render-Einheiten, also 10 Mio. km) werden bis auf das Vierfache
    // größer, der Rest bleibt bei der Grundgröße. Der Deckel hält auch die
    // dichteste Wolke unter vier Gerätepixeln je Teilchen.
    float dist = length(pos);
    gl_PointSize = clamp(uPunkt * uPixelRatio * (1.0 + 3.0 / (1.0 + dist / 1e4)), 1.0, 4.0);

    #include <logdepthbuf_vertex>
  }
`;

// Nicht additiv (kein AdditiveBlending): Bei 50 000 Teilchen summierten
// sich überlappende Punkte in dichten Bildbereichen über die Bloom-Schwelle
// (postfx.ts) und der Gürtel würde als Lichtband glühen statt als Staub.
// Die Summenzeile spiegelt beltHelligkeit() oben.
const BELT_FRAGMENT_SHADER = `
  #include <common>
  uniform float uTag;
  uniform float uAlbedo;
  #include <logdepthbuf_pars_fragment>
  void main() {
    #include <logdepthbuf_fragment>
    // Runde, zum Rand hin weiche Scheibe statt eines harten Quadrats.
    float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
    float deckung = 1.0 - smoothstep(0.5, 1.0, d);
    if (deckung <= 0.0) discard;
    gl_FragColor = vec4(vec3(uAlbedo * uTag * RECIPROCAL_PI), deckung);
  }
`;

export interface BeltViews {
  update(
    jd: number,
    distanceExponent: number,
    cameraKm: THREE.Vector3,
    tier: QualityTier,
    sichtbar: boolean,
    licht: LightingSettings,
    pixelRatio: number,
  ): void;
  /** Nimmt beide Wolken aus der Szene und gibt Geometrie und Material frei. */
  dispose(): void;
}

interface BeltEintrag {
  spec: BeltSpec;
  keim: number;
  mittlererAbstandAE: number;
  points: THREE.Points;
  material: THREE.ShaderMaterial;
  /** Teilchenzahl der aktuell hochgeladenen Geometrie; -1 = noch keine. */
  aufgebaut: number;
}

/** Legt die Attribute für `count` Teilchen an und ersetzt die alten. */
function baueGeometrie(eintrag: BeltEintrag, count: number): void {
  const alt = eintrag.points.geometry;
  const geometrie = new THREE.BufferGeometry();
  if (count > 0) {
    const { elem1, elem2 } = beltAttribute(generateBelt(eintrag.spec, count, eintrag.keim));
    geometrie.setAttribute('aElem1', new THREE.BufferAttribute(elem1, 4));
    geometrie.setAttribute('aElem2', new THREE.BufferAttribute(elem2, 4));
  }
  // Ohne `position`-Attribut kennt der Renderer die Zeichenlänge nicht
  // (WebGLRenderer.renderBufferDirect liest sonst geometry.drawRange, das
  // ungesetzt bis Infinity läuft und den Draw-Call verwirft). Statt eines
  // 600 kB großen Nullpuffers nur für diesen Zweck steht die Länge direkt
  // im Zeichenbereich.
  geometrie.setDrawRange(0, count);
  eintrag.points.geometry = geometrie;
  eintrag.aufgebaut = count;
  alt.dispose();
}

/**
 * Baut beide Gürtel als Punktwolken auf: Hauptgürtel und Kuipergürtel, je
 * ein `Points` mit einem Draw-Call. Die Geometrie entsteht erst beim ersten
 * `update`, weil ihre Größe an der Qualitätsstufe hängt.
 */
export function createBeltViews(scene: THREE.Scene): BeltViews {
  const eintraege: BeltEintrag[] = [
    {
      spec: HAUPTGUERTEL, keim: HAUPTGUERTEL_KEIM,
      mittlererAbstandAE: HAUPTGUERTEL_ABSTAND_AE, albedo: BELT_ALBEDO,
    },
    {
      spec: KUIPERGUERTEL, keim: KUIPERGUERTEL_KEIM,
      mittlererAbstandAE: KUIPERGUERTEL_ABSTAND_AE, albedo: KUIPERGUERTEL_ALBEDO,
    },
  ].map(({ spec, keim, mittlererAbstandAE, albedo }) => {
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTage: { value: 0 },
        uK: { value: 1 },
        uKameraAE: { value: new THREE.Vector3() },
        uEinheitenProAE: { value: EINHEITEN_PRO_AE },
        uTag: { value: 0 },
        uAlbedo: { value: albedo },
        uPunkt: { value: PUNKT_BASIS_PX },
        uPixelRatio: { value: 1 },
      },
      vertexShader: BELT_VERTEX_SHADER,
      fragmentShader: BELT_FRAGMENT_SHADER,
    });
    const points = new THREE.Points(new THREE.BufferGeometry(), material);
    // Die Wolke steht nicht an der Position ihres Objekts — jedes Teilchen
    // rechnet seinen Ort im Vertex-Shader. Eine Hüllkugel um den Ursprung
    // wäre daher falsch und würde den ganzen Gürtel wegkullen.
    points.frustumCulled = false;
    points.visible = false;
    scene.add(points);
    return { spec, keim, mittlererAbstandAE, points, material, aufgebaut: -1 };
  });

  return {
    update(jd, distanceExponent, cameraKm, tier, sichtbar, licht, pixelRatio) {
      const count = beltCount(tier);
      for (const eintrag of eintraege) {
        // Ein Stufenwechsel baut die Attribute neu auf; das passiert selten
        // und darf einen Frame kosten (Entwurf, Abschnitt 2).
        if (eintrag.aufgebaut !== count) baueGeometrie(eintrag, count);

        eintrag.points.visible = sichtbar && count > 0;
        if (!eintrag.points.visible) continue;

        const u = eintrag.material.uniforms;
        u['uTage']!.value = jd - J2000;
        u['uK']!.value = distanceExponent;
        (u['uKameraAE']!.value as THREE.Vector3).set(
          cameraKm.x / AU_KM, cameraKm.y / AU_KM, cameraKm.z / AU_KM,
        );
        u['uTag']!.value = beltTagHelligkeit(eintrag.mittlererAbstandAE, licht);
        u['uPixelRatio']!.value = pixelRatio;
      }
    },
    dispose() {
      for (const { points, material } of eintraege) {
        scene.remove(points);
        points.geometry.dispose();
        material.dispose();
      }
      eintraege.length = 0;
    },
  };
}
