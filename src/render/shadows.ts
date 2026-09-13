import type { Body, BodyIndex, Vec3 } from '../sim/types';
import { positionAt } from '../sim/orbit';
import { isSatellite } from '../sim/scale';
import { poleVector } from '../sim/frames';

/**
 * Reine Rechnung des Schattenwurfs (Phase 3b-2, Entwurf
 * docs/superpowers/specs/2026-09-13-schatten-design.md): Kreisüberlappung
 * für den Halbschatten, Ringtreffer, echte Sonnengeometrie und die
 * Okkluderauswahl je Körper. Ohne `three`-Objekte, damit die gesamte Datei
 * unter `node` testbar bleibt — der Einbau ins Material (`onBeforeCompile`)
 * sitzt in bodies.ts/rings.ts.
 */

/**
 * Höchstens vier Kugel-Okkluder je Körper (Entwurf §2, "Auswahl der Okkluder").
 *
 * Das GLSL weiter unten in dieser Datei trägt dieselbe Zahl fest verdrahtet
 * an drei Stellen (`uniform vec4 uOkkluder[4]`, `uniform vec3
 * uOkkluderFarbe[4]` und die Schleife `for (int i = 0; i < 4; i++)` in
 * `SCHATTEN_GLSL_KOERPER_PARS`/`SCHATTEN_GLSL_KOERPER_ANWENDUNG`) — eine
 * Änderung hier muss dort von Hand nachgezogen werden (oder `${MAX_OKKLUDER}`
 * in diese GLSL-Strings interpolieren; dann den GLSL-Text für den Wert 4
 * byteidentisch halten und die Tests aus shadows/bodies/rings laufen lassen).
 */
export const MAX_OKKLUDER = 4;

/** Ein Kugel-Okkluder mit dargestellter Mitte/Radius und Kernschattenfarbe. */
export interface Okkluder {
  id: string;
  mitte: Vec3;
  radius: number;
  farbe: readonly [number, number, number];
}

/** Ein Ring als Okkluder: Ebene (Mitte, Normale) plus Innen-/Außenradius, dargestellte Werte. */
export interface RingOkkluder {
  bodyId: string;
  mitte: Vec3;
  normale: Vec3;
  innen: number;
  aussen: number;
}

export interface OkkluderAuswahl {
  kugeln: Okkluder[];
  ring: RingOkkluder | null;
}

export interface SonnenGeometrie {
  richtung: Vec3;
  winkelRad: number;
}

function clamp(wert: number, min: number, max: number): number {
  return Math.min(Math.max(wert, min), max);
}

/**
 * Unverdeckter Anteil der Sonnenscheibe (Winkelradius alpha) hinter einer
 * Okkluderscheibe (Winkelradius beta) im Winkelabstand gamma, alle in rad.
 *
 * Ebene Kreisschnitt-Formel in der Tangentialebene der Sonnenrichtung — gültig
 * weil alpha klein ist (< 0,012 rad selbst bei Merkur; Entwurf §2, "Kugel-
 * Okkluder"). Für beta gilt diese Kleinwinkel-Annahme nicht: Phobos sieht Mars
 * unter 0,37 rad, aber nahe der Sonnenrichtung ist der Rand seiner
 * Okkluderkappe lokal noch ein Kreis vom Radius beta.
 *
 * TS-Zwilling von SCHATTEN_GLSL_FUNKTIONEN weiter unten — wortgleiche
 * Rechnung, damit CPU (Okkluderfarbe/-tests) und GPU (Fragment-Shader)
 * dasselbe Ergebnis liefern (Präzedenz: beltPositionAE in belts.ts).
 * Gleichheit sichert shadows.glsl-zwilling.test.ts durch mechanische
 * Übersetzung des GLSL-Rumpfs ab.
 */
export function sonnenAnteil(alpha: number, beta: number, gamma: number): number {
  if (gamma >= alpha + beta) return 1;
  if (beta >= alpha && gamma <= beta - alpha) return 0;
  if (beta < alpha && gamma <= alpha - beta) return 1 - (beta * beta) / (alpha * alpha);

  const a2 = alpha * alpha;
  const b2 = beta * beta;
  const g2 = gamma * gamma;
  const x = (g2 + a2 - b2) / (2 * gamma);
  const y = (g2 + b2 - a2) / (2 * gamma);
  const linse =
    a2 * Math.acos(clamp(x / alpha, -1, 1)) +
    b2 * Math.acos(clamp(y / beta, -1, 1)) -
    gamma * Math.sqrt(Math.max(a2 - x * x, 0));
  return clamp(1 - linse / (Math.PI * a2), 0, 1);
}

/**
 * u in [0, 1] des Treffers eines Strahls (Start p, Richtung d) in der
 * Ringebene, sonst null. Alle Längen in derselben Einheit.
 *
 * Testbarer TS-Zwilling des Ring-Blocks in SCHATTEN_GLSL_KOERPER_ANWENDUNG
 * weiter unten; hat wie ringHelligkeit in rings.ts bewusst keinen Aufrufer
 * in Produktionscode.
 */
export function ringTreffer(p: Vec3, d: Vec3, ring: RingOkkluder): number | null {
  const n = ring.normale;
  const nenner = d.x * n.x + d.y * n.y + d.z * n.z;
  if (Math.abs(nenner) < 1e-12) return null;

  const zaehler = (ring.mitte.x - p.x) * n.x + (ring.mitte.y - p.y) * n.y + (ring.mitte.z - p.z) * n.z;
  const t = zaehler / nenner;
  if (t <= 0) return null;

  const treffer: Vec3 = { x: p.x + t * d.x, y: p.y + t * d.y, z: p.z + t * d.z };
  const r = Math.hypot(treffer.x - ring.mitte.x, treffer.y - ring.mitte.y, treffer.z - ring.mitte.z);
  const u = (r - ring.innen) / (ring.aussen - ring.innen);
  if (u < 0 || u > 1) return null;
  return u;
}

/**
 * Echte Sonnenrichtung (Einheitsvektor Körper → Sonne, Ekliptik) und
 * Winkelradius der Sonne aus positionAt — bewusst die echte, unkomprimierte
 * Geometrie statt der dargestellten (Entwurf §2, "Sonnenrichtung und
 * Sonnenwinkel aus der echten Geometrie"): `scaledPositionAt` skaliert Radien
 * und Mondabstände innerhalb eines Planetensystems gleich, wodurch die
 * dargestellte Geometrie der echten exakt ähnlich ist und Winkel erhalten
 * bleiben — der Sonnenwinkel als Zahl macht die Rechnung unabhängig davon,
 * wo die dargestellte Sonne steht.
 */
export function sonnenGeometrie(bodyId: string, index: BodyIndex, jd: number): SonnenGeometrie {
  const r = positionAt(bodyId, index, jd);
  const betrag = Math.hypot(r.x, r.y, r.z);
  if (betrag === 0) return { richtung: { x: 1, y: 0, z: 0 }, winkelRad: 0 };

  const sonne = index['sun'];
  if (!sonne) throw new Error("Sonnenradius nicht verfügbar: 'sun' fehlt im BodyIndex");

  return {
    richtung: { x: -r.x / betrag, y: -r.y / betrag, z: -r.z / betrag },
    winkelRad: Math.asin(sonne.physical.radiusKm / betrag),
  };
}

/** sRGB-Kanalwert 0–1 → lineare Reflexion 0–1 (IEC 61966-2-1), wie srgbZuLinear in render/albedo.ts. */
function srgbKanalZuLinear(kanal: number): number {
  return kanal <= 0.04045 ? kanal / 12.92 : Math.pow((kanal + 0.055) / 1.055, 2.4);
}

/**
 * Lineares RGB aus appearance.umbra.color (Blutmond-Färbung, Entwurf §2),
 * ohne Eintrag neutral [1, 1, 1].
 */
export function kernschattenFarbeLinear(body: Body): readonly [number, number, number] {
  const hex = body.appearance.umbra?.color;
  if (!hex) return [1, 1, 1];

  const n = parseInt(hex.replace('#', ''), 16);
  return [
    srgbKanalZuLinear(((n >> 16) & 255) / 255),
    srgbKanalZuLinear(((n >> 8) & 255) / 255),
    srgbKanalZuLinear((n & 255) / 255),
  ];
}

function normiert(v: Vec3): Vec3 {
  const laenge = Math.hypot(v.x, v.y, v.z);
  return { x: v.x / laenge, y: v.y / laenge, z: v.z / laenge };
}

interface BewerteterKandidat {
  body: Body;
  mitte: Vec3;
  radius: number;
  winkelRad: number;
}

/**
 * Okkluder eines Körpers aus dargestellten Positionen/Radien (als Funktionen
 * übergeben, weil bodies.ts sie pro Frame schon hat — siehe Task-Brief).
 *
 * Kandidaten: Ist body selbst ein Satellit (isSatellite), zuerst sein
 * Mutterkörper, dann die Geschwistermonde (gleicher parent, kind 'moon').
 * Sonst die eigenen Monde (kind 'moon', parent === body.id) — das lässt
 * Sonne, andere Planeten und Zwergplaneten ohne Monde automatisch leer
 * (Entwurf §2: "Sonne, Zwergplaneten ohne Monde, andere Planeten ... nie
 * Okkluder, nie beschattet"), ohne eine eigene Ausnahmeliste zu brauchen.
 * Kandidaten ohne dargestellte Position/Radius (unsichtbar) fallen weg.
 * Der Mutterkörper bleibt immer vorn; die Geschwister werden nach
 * Winkelradius absteigend sortiert, danach wird auf MAX_OKKLUDER gekürzt.
 */
export function waehleOkkluder(
  body: Body, index: BodyIndex,
  position: (id: string) => Vec3 | undefined, radius: (id: string) => number | undefined,
): OkkluderAuswahl {
  const p0 = position(body.id);
  if (!p0) return { kugeln: [], ring: null };

  let mutter: Body | null = null;
  let geschwister: Body[];
  if (isSatellite(body) && body.parent !== null) {
    mutter = index[body.parent] ?? null;
    geschwister = Object.values(index).filter(
      (c) => c.id !== body.id && c.parent === body.parent && c.kind === 'moon',
    );
  } else {
    geschwister = Object.values(index).filter((c) => c.parent === body.id && c.kind === 'moon');
  }

  const kugeln: Okkluder[] = [];

  if (mutter) {
    const mitte = position(mutter.id);
    const r = radius(mutter.id);
    if (mitte !== undefined && r !== undefined) {
      kugeln.push({ id: mutter.id, mitte, radius: r, farbe: kernschattenFarbeLinear(mutter) });
    }
  }

  const bewertet: BewerteterKandidat[] = [];
  for (const kandidat of geschwister) {
    const mitte = position(kandidat.id);
    const r = radius(kandidat.id);
    if (mitte === undefined || r === undefined) continue;
    const d = Math.hypot(mitte.x - p0.x, mitte.y - p0.y, mitte.z - p0.z);
    if (d <= 0) continue;
    bewertet.push({ body: kandidat, mitte, radius: r, winkelRad: Math.asin(Math.min(r / d, 1)) });
  }
  bewertet.sort((a, b) => b.winkelRad - a.winkelRad);
  for (const eintrag of bewertet) {
    kugeln.push({
      id: eintrag.body.id, mitte: eintrag.mitte, radius: eintrag.radius,
      farbe: kernschattenFarbeLinear(eintrag.body),
    });
  }

  let ring: RingOkkluder | null = null;
  const traegerId = isSatellite(body) && body.parent !== null ? body.parent : body.id;
  const traeger = index[traegerId];
  if (traeger?.appearance.rings) {
    const traegerMitte = position(traegerId);
    const traegerRadius = radius(traegerId);
    if (traegerMitte !== undefined && traegerRadius !== undefined) {
      const sizeScale = traegerRadius / traeger.physical.radiusKm;
      ring = {
        bodyId: traeger.id,
        mitte: traegerMitte,
        normale: normiert(poleVector(traeger.physical.pole.raDeg, traeger.physical.pole.decDeg)),
        innen: traeger.appearance.rings.innerKm * sizeScale,
        aussen: traeger.appearance.rings.outerKm * sizeScale,
      };
    }
  }

  return { kugeln: kugeln.slice(0, MAX_OKKLUDER), ring };
}

// ---------------------------------------------------------------------------
// GLSL-Bausteine — Fragment-Shader-Zwilling zu sonnenAnteil oben, plus die
// Uniforms und der Anwendungsblock für den Einbau in MeshStandardMaterial
// (bodies.ts, Task 3) per onBeforeCompile. `PI` kommt aus `#include <common>`,
// das three in jedem Standardmaterial voranstellt.
// ---------------------------------------------------------------------------

export const SCHATTEN_GLSL_FUNKTIONEN = `
float sonnenAnteil(float alpha, float beta, float gamma) {
  if (gamma >= alpha + beta) return 1.0;
  if (beta >= alpha && gamma <= beta - alpha) return 0.0;
  if (beta < alpha && gamma <= alpha - beta) return 1.0 - (beta * beta) / (alpha * alpha);
  float a2 = alpha * alpha; float b2 = beta * beta; float g2 = gamma * gamma;
  float x = (g2 + a2 - b2) / (2.0 * gamma);
  float y = (g2 + b2 - a2) / (2.0 * gamma);
  float linse = a2 * acos(clamp(x / alpha, -1.0, 1.0)) + b2 * acos(clamp(y / beta, -1.0, 1.0))
              - gamma * sqrt(max(a2 - x * x, 0.0));
  return clamp(1.0 - linse / (PI * a2), 0.0, 1.0);
}
float kugelSchatten(vec3 p, vec4 okkluder, vec3 sonne, float alpha) {
  vec3 zu = okkluder.xyz - p;
  float d = length(zu);
  if (dot(zu, sonne) <= 0.0) return 1.0;
  float beta = asin(clamp(okkluder.w / d, 0.0, 1.0));
  float gamma = acos(clamp(dot(zu / d, sonne), -1.0, 1.0));
  return sonnenAnteil(alpha, beta, gamma);
}
`;

export const SCHATTEN_GLSL_KOERPER_PARS = `
uniform vec3 uSonnenRichtung;
uniform float uSonnenWinkel;
uniform vec4 uOkkluder[4];
uniform vec3 uOkkluderFarbe[4];
uniform int uOkkluderAnzahl;
uniform vec4 uRingEbeneA;
uniform vec4 uRingEbeneB;
uniform float uRingAktiv;
uniform sampler2D tRingSchatten;
varying vec3 vSchattenPos;
${SCHATTEN_GLSL_FUNKTIONEN}`;

export const SCHATTEN_GLSL_KOERPER_ANWENDUNG = `
float schattenFaktor = 1.0;
vec3 fuellFarbe = vec3(1.0);
for (int i = 0; i < 4; i++) {
  if (i >= uOkkluderAnzahl) break;
  float f = kugelSchatten(vSchattenPos, uOkkluder[i], uSonnenRichtung, uSonnenWinkel);
  schattenFaktor *= f;
  fuellFarbe *= mix(vec3(1.0), uOkkluderFarbe[i], 1.0 - f);
}
if (uRingAktiv > 0.5) {
  float nenner = dot(uSonnenRichtung, uRingEbeneB.xyz);
  if (abs(nenner) > 1e-6) {
    float t = dot(uRingEbeneA.xyz - vSchattenPos, uRingEbeneB.xyz) / nenner;
    if (t > 0.0) {
      float r = length(vSchattenPos + t * uSonnenRichtung - uRingEbeneA.xyz);
      float u = (r - uRingEbeneA.w) / (uRingEbeneB.w - uRingEbeneA.w);
      if (u >= 0.0 && u <= 1.0) schattenFaktor *= 1.0 - texture2D(tRingSchatten, vec2(u, 0.5)).a;
    }
  }
}
reflectedLight.directDiffuse *= schattenFaktor;
reflectedLight.directSpecular *= schattenFaktor;
totalEmissiveRadiance *= fuellFarbe;
`;

export const SCHATTEN_GLSL_VERTEX_PARS = 'varying vec3 vSchattenPos;';
export const SCHATTEN_GLSL_VERTEX = 'vSchattenPos = (modelMatrix * vec4(transformed, 1.0)).xyz;';
