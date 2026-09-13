import * as THREE from 'three';
import type { Appearance, Vec3 } from '../sim/types';
import type { ScaleSettings } from '../sim/scale';
import { scaledPositionAt } from '../sim/scale';
import { poleVector } from '../sim/frames';
import { bodies, bodyIndex } from '../data/index';
import { kmToUnits, worldToRender } from './units';
import { bodyLighting, irradianceFactor } from './lighting';
import type { LightingSettings } from './lighting';
import { ringProfilTexel } from './ringProfil';

/**
 * Stützpunkte einer Ringscheibe in der lokalen xy-Ebene.
 *
 * Bewusst nicht THREE.RingGeometry: Deren UV-Belegung bildet die Fläche auf
 * ein Quadrat ab. Ringtexturen sind aber radiale Streifen — eine Bildzeile
 * von der Innen- zur Außenkante. Gebraucht wird deshalb u = (r - innen) /
 * (außen - innen), v spielt keine Rolle (hier konstant 0 an der Innenkante,
 * konstant 1 an der Außenkante je Radius, siehe uvs unten).
 *
 * Reine Geometrie ohne Material: Diese Funktion kennt weder Textur noch
 * Szene und ist deshalb ohne DOM vollständig durchrechenbar.
 */
export function ringGeometrieDaten(
  innenUnits: number, aussenUnits: number, segmente: number,
): { positions: Float32Array; uvs: Float32Array; indices: Uint16Array } {
  const punkte = segmente + 1;
  const positions = new Float32Array(punkte * 2 * 3);
  const uvs = new Float32Array(punkte * 2 * 2);
  const indices = new Uint16Array(segmente * 6);

  for (let s = 0; s < punkte; s++) {
    const winkel = (s / segmente) * Math.PI * 2;
    const cos = Math.cos(winkel);
    const sin = Math.sin(winkel);
    const p = s * 6;
    positions[p] = cos * innenUnits;
    positions[p + 1] = sin * innenUnits;
    positions[p + 2] = 0;
    positions[p + 3] = cos * aussenUnits;
    positions[p + 4] = sin * aussenUnits;
    positions[p + 5] = 0;

    const u = s * 4;
    uvs[u] = 0; uvs[u + 1] = 0;
    uvs[u + 2] = 1; uvs[u + 3] = 0;
  }

  for (let s = 0; s < segmente; s++) {
    const i = s * 6;
    const a = s * 2;
    indices[i] = a; indices[i + 1] = a + 1; indices[i + 2] = a + 2;
    indices[i + 3] = a + 1; indices[i + 4] = a + 3; indices[i + 5] = a + 2;
  }

  return { positions, uvs, indices };
}

/** Dreht die lokale Ringnormale (z) auf die Polrichtung des Planeten. */
export function ringAusrichtung(pole: Vec3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(pole.x, pole.y, pole.z).normalize(),
  );
}

/**
 * Vorwärtsstreuung der Ringpartikel.
 *
 * `cosWinkel` ist das Skalarprodukt aus Blickrichtung (Fragment → Kamera)
 * und Lichtrichtung (Fragment → Sonne). Stehen beide entgegengesetzt
 * (cos = -1), steht die Sonne hinter den Ringen und leuchtet durch sie
 * hindurch — der Effekt, den die Cassini-Aufnahmen bekannt gemacht haben.
 * Steht die Sonne vor den Ringen, gibt es nichts zu durchleuchten; der Term
 * ist dann exakt null und nicht etwa schwach positiv.
 *
 * Bewusst eine eigene, exportierte Funktion und zugleich eine Zeile GLSL
 * (siehe RING_FRAGMENT_SHADER unten): Der Shader selbst ist nicht testbar,
 * diese Kennlinie schon — und sie ist der Teil, der falsch sein kann. Beide
 * Stellen müssen dieselbe Formel abbilden, siehe der GLSL-Kommentar dort.
 */
export function vorwaertsstreuung(cosWinkel: number, staerke: number, schaerfe: number): number {
  return staerke * Math.pow(Math.max(0, -cosWinkel), schaerfe);
}

/**
 * Segmentzahl der Ringgeometrie. 128 Kanten ergeben einen im Bild glatten
 * Kreis auch beim größten dargestellten Radius (Saturns A-Ring-Außenkante,
 * 136 780 km) und bleiben mit 129 Stützpunkten * 2 = 258 Vertizes weit
 * unter der 16-Bit-Indexgrenze von ringGeometrieDaten (Uint16Array, Limit
 * 65536).
 */
const RING_SEGMENTE = 128;

/**
 * Stärke und Schärfe der Vorwärtsstreuung (siehe vorwaertsstreuung). Ein
 * einziger Wertesatz für beide Ringsysteme, nicht einer je Planet: Beide
 * bestehen aus vergleichbar feinem Eis-/Staubmaterial, eine unterschiedliche
 * Streukonstante pro Körper wäre freie Erfindung ohne Datengrundlage.
 * staerke = 0,85 macht Gegenlicht deutlich heller als Direktlicht (uTag
 * liegt bei den äußeren Planeten typischerweise weit unter 1, siehe
 * lighting.ts), schaerfe = 6 bündelt den Effekt auf einen schmalen Kegel um
 * die exakte Gegenlichtrichtung — sichtbar als heller Saum, nicht als
 * flächiges Aufglühen, wie es die Cassini-Gegenlichtaufnahmen zeigen.
 */
const RING_STREUUNG = 0.85;
const RING_SCHAERFE = 6;

/**
 * Gesamthelligkeit eines Ringfragments (linear, vor Tonemapping) — das
 * Gegenstück zur letzten Zeile von RING_FRAGMENT_SHADER als reine Funktion:
 * albedo · (|N·L| · uTag/π + Füllung · uTag + Streuung · uTag/π).
 *
 * `cosNL` ist N·L (Ringnormale gegen Sonnenrichtung, beidseitig über den
 * Betrag), `cosVL` das Skalarprodukt aus Blick- und Lichtrichtung wie bei
 * vorwaertsstreuung(). Wie diese existiert die Funktion, damit der nicht
 * testbare Shader eine testbare Kennlinie hat — konkret dafür, dass die
 * Ersatztextur (ERSATZ_RING_GRAU) unter realen Szenenwerten über der
 * Sichtbarkeitsschwelle bleibt, siehe rings.test.ts. Beide Stellen müssen
 * dieselbe Formel abbilden.
 */
export function ringHelligkeit(
  albedoLinear: number, cosNL: number, cosVL: number, uTag: number, fuellung: number,
): number {
  const direkt = (Math.abs(cosNL) * uTag) / Math.PI;
  const streu = (vorwaertsstreuung(cosVL, RING_STREUUNG, RING_SCHAERFE) * uTag) / Math.PI;
  return albedoLinear * (direkt + fuellung * uTag + streu);
}

/**
 * Grauwert (sRGB, 8 Bit) der Ersatztextur für Ringe ohne Bildquelle.
 *
 * 128 ist ein Sichtbarkeitswert, kein Albedowert — und das mit Absicht. Der
 * Vorgänger (RGB 38, linear rund 2 %) war aus der realen Albedo des
 * Uranusrings (etwa 0,05) hergeleitet und im Bild schlicht nicht vorhanden:
 * In der Kinoszene `uranus-gekippt` lag uTag bei 0,33 (Preset Schaubild,
 * Standardbeleuchtung; die damalige Klemme MAX_COLOR_GAIN = 12 griff dort
 * bereits — seit der Nachbesserung nach der Abnahme 3a liegt die Klemme bei
 * 1e5 und uTag in dieser Szene bei 0,58, abgelesen am 13.09.2026), die
 * Summe aus Direktlicht und Nachtseitenfüllung bei 0,14 — das Fragment
 * landete bei 0,003 linear, und das ACES-Tonemapping (renderer.ts) drückt
 * alles unter rund 0,01 auf 0 von 255. Pixelmessung am 12.09.2026: 0 an
 * jeder Ringposition außerhalb der Planetenscheibe.
 *
 * Eine albedotreue Darstellung ist an dieser Stelle grundsätzlich nicht zu
 * haben: Die Szene ist nirgends physikalisch belichtet (Fülllicht,
 * Distanzausgleich, Farbverstärkung bis Faktor 12, siehe lighting.ts), und
 * auch die Saturn-Ringtextur ist mit im Mittel rund 0,15 linear weit von
 * Saturns Ringalbedo (0,5 bis 0,6) entfernt. Der Uranusring bekommt deshalb
 * dieselbe Behandlung wie alles andere: einen Wert, der ihn im Bild dunkel,
 * aber zweifelsfrei vorhanden macht. Mit 128 (linear 0,216) misst der Ring
 * in derselben Szene 31 von 255 — gegen 0 vorher — und liegt damit am
 * dunklen Ende dessen, was der Saturnring in offener Ansicht zeigt
 * (`saturn-streiflicht`, Ringpixel rund 25 bis 80; sein uTag ist mit 0,67
 * doppelt so hoch, seine Textur im Mittel dunkler). Rechnung mit den
 * gemessenen Szenenwerten: rings.test.ts.
 */
export const ERSATZ_RING_GRAU = 128;

// mat3(modelMatrix) statt normalMatrix (= Normalenmatrix von modelViewMatrix,
// also Sichtraum): vWeltPos unten steht in Weltraum (modelMatrix), Sonnen-
// und Blickvektor im Fragment-Shader werden daraus gebildet — vNormal muss
// im selben Bezugssystem stehen, sonst vergleicht dot(N, L) zwei verschiedene
// Räume und die Beleuchtung schwankt beim bloßen Drehen der Kamera. Reine
// mat3(modelMatrix) genügt hier ohne inverse Transponierte: Die Ringe werden
// pro Frame ausschließlich mit mesh.scale.setScalar (siehe update() unten)
// gleichförmig skaliert, keine Achse einzeln — bei gleichförmiger Skalierung
// dreht mat3(modelMatrix) die Normale korrekt, ein anschließendes normalize()
// entfernt den (für alle Komponenten gleichen) Skalenfaktor vollständig.
const RING_VERTEX_SHADER = `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWeltPos;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWeltPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #include <logdepthbuf_vertex>
  }
`;

// Die Fragment-Zeile für die Streuung (`uStreuung * pow(max(0.0, -dot(V,
// L)), uSchaerfe)`) bildet exakt dieselbe Formel wie vorwaertsstreuung()
// oben ab: -dot(V, L) entspricht -cosWinkel, uStreuung der staerke, uSchaerfe
// der schaerfe. Die Summenzeile in gl_FragColor spiegelt ringHelligkeit().
// Ändert sich eine dieser Stellen, muss ihr Gegenstück mitgehen — siehe
// rings.test.ts für die geprüften Kennlinien.
//
// RECIPROCAL_PI (aus <common>, dieselbe Konstante wie in Threes eigenen
// Materialien) auf direkt und streu: Der Körper läuft durch Threes
// Lambert-BRDF, die den direkten Anteil intern mit 1/π gewichtet (siehe der
// RECIPROCAL_PI-Kommentar in lighting.ts); dieses ShaderMaterial hat keine
// eingebaute BRDF und muss den Faktor deshalb selbst tragen, sonst ist der
// Ring exakt um π heller als der Planet bei gleicher Albedo. uFuellung *
// uTag bleibt ungeteilt: Sie steht für einen künstlerischen Füllwert der
// Nachtseite, keine Reflexion, und hat kein Vorbild im BRDF-Pfad.
const RING_FRAGMENT_SHADER = `
  #include <common>
  uniform sampler2D tRing;
  uniform vec3 uSonne;
  uniform float uTag;
  uniform float uFuellung;
  uniform float uStreuung;
  uniform float uSchaerfe;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWeltPos;
  #include <logdepthbuf_pars_fragment>
  void main() {
    #include <logdepthbuf_fragment>
    vec4 ring = texture2D(tRing, vUv);
    vec3 L = normalize(uSonne - vWeltPos);
    vec3 V = normalize(-vWeltPos);            // Kamera sitzt im Ursprung
    vec3 N = normalize(vNormal);
    float direkt = abs(dot(N, L)) * uTag * RECIPROCAL_PI; // beidseitig: ein Ring hat keine Rückseite
    float streu = uStreuung * pow(max(0.0, -dot(V, L)), uSchaerfe) * uTag * RECIPROCAL_PI;
    gl_FragColor = vec4(ring.rgb * (direkt + uFuellung * uTag + streu), ring.a);
  }
`;

/**
 * Mittelgraue, voll deckende 1×1-Ersatztextur für Ringe, die weder Bild
 * noch Profil mitbringen. Ohne sie bliebe `tRing` unbelegt und der Ring
 * unsichtbar statt — wie bei Körpern ohne Albedo-Textur in bodies.ts — in
 * einer Ersatzdarstellung: ein flächig deckender, ungebänderter Ring.
 *
 * Grauwert und seine Begründung: siehe ERSATZ_RING_GRAU. Kurzfassung: Der
 * Ring soll "dunkel, aber vorhanden" erscheinen; der frühere, aus der
 * realen Albedo hergeleitete Wert 38 war im Bild schwarz.
 */
function ersatzRingTextur(): THREE.DataTexture {
  const g = ERSATZ_RING_GRAU;
  const textur = new THREE.DataTexture(new Uint8Array([g, g, g, 255]), 1, 1, THREE.RGBAFormat);
  textur.colorSpace = THREE.SRGBColorSpace;
  textur.needsUpdate = true;
  return textur;
}

/** Texelzahl des gerechneten Streifens — wie die Breite der Saturn-Ringtextur (2048 px). */
const PROFIL_TEXEL = 2048;

/**
 * Farbe des gerechneten Streifens (sRGB): neutrales, leicht warmes Grau.
 * Die Uranusringe sind im Sichtbaren "slightly red" und im Nahinfrarot grau
 * (Baines et al. 1998); mehr als ein Hauch Wärme ist damit nicht belegt.
 * Die Helligkeit liegt deutlich über ERSATZ_RING_GRAU: Die Struktur steckt
 * im Alphakanal, der dichteste Ring (ε) deckt nur zu 78 %, die feinen
 * inneren zu einem Viertel — mit dem Ersatzgrau blieben sie im Bild unter
 * 10 von 255 (Pixelmessung mit 172/162/152: ε 44, innere Ringe 7 bis 19).
 * Die Messung nach dem Umbau steht in ASSETS.md.
 */
const PROFIL_FARBE: readonly [number, number, number] = [214, 202, 190];

/**
 * Radialer Streifen aus Messdaten (siehe ringProfil.ts), als 2048×1-Textur
 * mit Alphakanal — dasselbe Format wie die Saturn-Ringtextur, sodass der
 * Shader keinen Unterschied kennt. Mipmaps und lineare Filter, weil die
 * schmalen Ringe im Bild ein bis drei Pixel breit sind und ohne Filterung
 * beim Drehen flimmerten (DataTexture filtert standardmäßig mit Nearest).
 */
function profilRingTextur(ring: NonNullable<Appearance['rings']>): THREE.DataTexture {
  const texel = ringProfilTexel(ring.profil!, ring.innerKm, ring.outerKm, PROFIL_TEXEL, PROFIL_FARBE);
  const textur = new THREE.DataTexture(texel, PROFIL_TEXEL, 1, THREE.RGBAFormat);
  textur.colorSpace = THREE.SRGBColorSpace;
  textur.magFilter = THREE.LinearFilter;
  textur.minFilter = THREE.LinearMipmapLinearFilter;
  textur.generateMipmaps = true;
  textur.needsUpdate = true;
  return textur;
}

/**
 * Lädt die Ringtextur asynchron nach und ersetzt `tRing` erst bei Erfolg.
 * Bis dahin — und bei einem Fehlschlag dauerhaft — bleibt die dunkelgraue
 * Ersatztextur sichtbar. Analog zu ladeAlbedo in bodies.ts.
 */
function ladeRingTextur(lader: THREE.TextureLoader, pfad: string, material: THREE.ShaderMaterial): void {
  // Körper ohne belegte Ringtextur (siehe ASSETS.md für die dokumentierte
  // Lücke bei Uranus) tragen absichtlich einen leeren Pfad.
  if (pfad === '') return;
  lader.load(
    pfad,
    (textur) => {
      textur.colorSpace = THREE.SRGBColorSpace;
      material.uniforms['tRing']!.value = textur;
      material.needsUpdate = true;
    },
    undefined,
    () => { /* Ersatztextur bleibt bestehen; kein Log-Spam bei fehlendem Bild. */ },
  );
}

export interface RingViews {
  update(
    jd: number,
    s: ScaleSettings,
    cameraKm: THREE.Vector3,
    visible: Record<string, boolean>,
    licht: LightingSettings,
    sonneRender: THREE.Vector3,
  ): void;
  /**
   * Die aktuell gebundene Textur des Rings eines Körpers, sonst `undefined`.
   *
   * Der Körper-Shader (bodies.ts) sampelt für den Ringschatten genau dasselbe
   * Bild, das die Ringscheibe zeichnet. Der Wert wird bewusst pro Bild neu
   * abgefragt statt einmal gemerkt: `ladeRingTextur` ersetzt den
   * Uniform-Wert, sobald das Bild da ist — ein einmal gemerkter Verweis zeigte
   * dauerhaft auf die Ersatz- bzw. Profiltextur.
   */
  ringTextur(bodyId: string): THREE.Texture | undefined;
  /**
   * Entfernt jede Ringscheibe aus der Szene und gibt Geometrie, ShaderMaterial
   * und die aktuell gebundene Textur (Ersatztextur oder nachgeladenes Bild,
   * siehe ladeRingTextur) frei — analog zu SceneHandle.dispose() in scene.ts.
   */
  dispose(): void;
}

interface RingEintrag {
  bodyId: string;
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
}

/**
 * Baut je Körper mit `appearance.rings` eine Ringscheibe: Material mit
 * beidseitigem Direktlicht, Nachtseitenfüllung und Vorwärtsstreuung, ganz
 * aus bodyLighting/den Anzeige-Einstellungen gespeist statt eigener Regeln
 * (siehe Task-13-Brief).
 */
export function createRingViews(scene: THREE.Scene): RingViews {
  const lader = new THREE.TextureLoader();
  const eintraege: RingEintrag[] = [];

  for (const body of bodies) {
    const ring = body.appearance.rings;
    if (ring === undefined) continue;

    // Geometrie in echten Kilometern (nicht Render-Einheiten): Der
    // Skalierungsfaktor pro Preset ändert sich in update() über
    // mesh.scale, ein Rebuild bei Preset-Wechsel entfällt dadurch
    // vollständig — anders als bei den Bahnlinien (siehe orbits.ts).
    const { positions, uvs, indices } = ringGeometrieDaten(ring.innerKm, ring.outerKm, RING_SEGMENTE);
    // Die Ringscheibe liegt vollständig in der lokalen xy-Ebene (siehe
    // ringGeometrieDaten) — jeder Punkt trägt dieselbe lokale Normale.
    const normals = new Float32Array(positions.length);
    for (let i = 2; i < normals.length; i += 3) normals[i] = 1;

    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometrie.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometrie.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometrie.setIndex(new THREE.BufferAttribute(indices, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        // Startbelegung: gerechnetes Profil, sonst Ersatzgrau; eine
        // Bilddatei (ring.texture) ersetzt beides, sobald sie geladen ist.
        tRing: { value: ring.profil !== undefined ? profilRingTextur(ring) : ersatzRingTextur() },
        uSonne: { value: new THREE.Vector3() },
        uTag: { value: 0 },
        uFuellung: { value: 0 },
        uStreuung: { value: RING_STREUUNG },
        uSchaerfe: { value: RING_SCHAERFE },
      },
      vertexShader: RING_VERTEX_SHADER,
      fragmentShader: RING_FRAGMENT_SHADER,
    });
    ladeRingTextur(lader, ring.texture, material);

    const mesh = new THREE.Mesh(geometrie, material);
    scene.add(mesh);
    eintraege.push({ bodyId: body.id, mesh, material });
  }

  return {
    update(jd, s, cameraKm, visible, licht, sonneRender) {
      for (const { bodyId, mesh, material } of eintraege) {
        if (visible[bodyId] === false) { mesh.visible = false; continue; }
        mesh.visible = true;

        const weltKm = scaledPositionAt(bodyId, bodyIndex, jd, s);
        const r = worldToRender(weltKm, cameraKm);
        mesh.position.set(r.x, r.y, r.z);

        // Ringradien skalieren mit sizeScale wie die Körperradien (siehe
        // scaledRadius in sim/scale.ts) — ohne sunDamping, das gilt nur für
        // die Sonne. Die Geometrie steckt in echten Kilometern, ein
        // einziger Skalenfaktor genügt daher pro Frame.
        mesh.scale.setScalar(kmToUnits(s.sizeScale));

        const body = bodyIndex[bodyId];
        if (body === undefined) continue;
        const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
        mesh.quaternion.copy(ringAusrichtung(pol));

        // Beleuchtung: Sonnenabstand aus der dargestellten (skalierten)
        // Position, wie bei den Körpern (bodies.ts). uTag speist im
        // Fragment-Shader direkt und streu (siehe RING_FRAGMENT_SHADER) und
        // nimmt bewusst denselben geklemmten Weg wie das Material des
        // Planeten — colorGain (in bodies.ts über material.color) mal
        // irradianceFactor, mal brightness als Bezugsgröße der ganzen
        // Kalibrierung (siehe lighting.ts). Seit der Nachbesserung nach der
        // Abnahme 3a rechnet lighting.ts sein dayLevel aus genau derselben
        // geklemmten Verstärkung, beide Wege sind also immer identisch
        // (brightness * E^-c * E = dayLevel); die Klemme aus
        // MAX_COLOR_GAIN/MIN_COLOR_GAIN greift erst weit jenseits des
        // Katalogs und hält dort Ring und Planet gemeinsam im selben Rahmen,
        // statt dass der Ring ungebremst über den Planeten hinauswächst. Der
        // zweite,
        // unabhängige Bruch — Three gewichtet den Planeten intern mit 1/π,
        // dieses ShaderMaterial nicht — sitzt nicht hier, sondern in
        // RECIPROCAL_PI im Fragment-Shader oben.
        const sonnenabstandKm = Math.sqrt(weltKm.x ** 2 + weltKm.y ** 2 + weltKm.z ** 2);
        const l = bodyLighting(sonnenabstandKm, licht);
        const distanzfaktor = irradianceFactor(sonnenabstandKm, licht.lightFalloff);

        (material.uniforms['uSonne']!.value as THREE.Vector3).copy(sonneRender);
        material.uniforms['uTag']!.value = licht.brightness * l.colorGain * distanzfaktor;
        material.uniforms['uFuellung']!.value = licht.nightFill;
      }
    },
    ringTextur(bodyId) {
      const eintrag = eintraege.find((e) => e.bodyId === bodyId);
      return eintrag?.material.uniforms['tRing']?.value as THREE.Texture | undefined;
    },
    dispose() {
      for (const { mesh, material } of eintraege) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        material.dispose();
        (material.uniforms['tRing']!.value as THREE.Texture).dispose();
      }
      eintraege.length = 0;
    },
  };
}
