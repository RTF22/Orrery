import type { Body, BodyIndex, Vec3 } from '../../sim/types';
import type { ScaleSettings } from '../../sim/scale';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';
import { AU_KM } from '../../sim/orbit';

/**
 * Reine Flugmathematik (Entwurf Flug und Controller §3, §4, §6.1): ohne DOM
 * und ohne Store. Positionen sind dargestellte km (scaledPositionAt), Radien
 * dargestellte Radien (scaledRadius). Hier stehen auch die Grenzen der
 * Kamera, die Orbit-Eingabe (input.ts) und Flug gemeinsam nutzen.
 */

/** Knapp unter dem Pol, damit die Ansicht nicht umklappt. */
export const ELEVATION_GRENZE = Math.PI / 2 - 0.01;
export const MIN_DISTANCE_KM = 1e2;
export const MAX_DISTANCE_KM = 1e13;

/** Ein anderer Körper wird Bezug erst unter diesem Anteil des bisherigen Maßes (§3.3). */
export const BEZUG_RUECKSTELLUNG = 0.8;
/** Untergrenze der Geschwindigkeit in Radien des nächsten Körpers, mal Tempofaktor (§3.4). */
export const TEMPO_UNTERGRENZE_RADIEN = 0.05;
/** Kleinster Abstand vom Mittelpunkt eines sichtbaren Körpers, in dessen Radien (§3.4). */
export const MINDESTABSTAND_RADIEN = 1.05;
/** Obergrenze des Einflussbereichs als Anteil des dargestellten Sonnenabstands (Nachtrag §13.1). */
export const EINFLUSS_DECKEL = 0.5;

/** Blickrichtung, gezählt wie azimuth/elevation: yaw um Ekliptik-Nord, pitch darüber. */
export interface Blick { yaw: number; pitch: number }
/** Gezeigte Kameralage eines Bildes: Weltlage in km und Blickvektor der Länge 1. */
export interface Pose { positionKm: Vec3; blick: Vec3 }
/** Gezeigte Lage mit dem jd ihres Bildes (letztePose, Entwurf §6.1): Übergänge rechnen Körperlagen zu diesem jd. */
export interface GezeigtePose extends Pose { jd: number }
/**
 * Dargestellte Lage und dargestellter Radius eines sichtbaren Körpers, dazu
 * sein Mutterkörper und — bei Sonnenumläufern — der dargestellte
 * Einflussbereich (Nachtrag §13.1). Fehlen beide (Literale in Tests), zählt
 * der Stand zur obersten Ebene.
 */
export interface KoerperStand {
  id: string; pos: Vec3; radius: number;
  mutter?: string | null;
  einfluss?: number;
}

export const plus = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const minus = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const mal = (a: Vec3, k: number): Vec3 => ({ x: a.x * k, y: a.y * k, z: a.z * k });
export const laenge = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);
export const punkt = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const kreuz = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x,
});
export const normiert = (a: Vec3): Vec3 => {
  const l = laenge(a);
  return l === 0 ? { x: 0, y: 0, z: 0 } : mal(a, 1 / l);
};
export const begrenze = (wert: number, min: number, max: number): number =>
  Math.min(Math.max(wert, min), max);

export function blickVektor(b: Blick): Vec3 {
  const c = Math.cos(b.pitch);
  return { x: c * Math.cos(b.yaw), y: c * Math.sin(b.yaw), z: Math.sin(b.pitch) };
}

/** Rechts der Kamera: Blick × Ekliptik-Nord, ohne Rollen stets waagerecht. */
export function rechtsVektor(b: Blick): Vec3 {
  return { x: Math.sin(b.yaw), y: -Math.cos(b.yaw), z: 0 };
}

/** Oben der Kamera: rechts × Blick. */
export function obenVektor(b: Blick): Vec3 {
  const sp = Math.sin(b.pitch);
  return { x: -sp * Math.cos(b.yaw), y: -sp * Math.sin(b.yaw), z: Math.cos(b.pitch) };
}

/** Blickrichtung eines Vektors; pitch bleibt in ±ELEVATION_GRENZE. */
export function blickAus(v: Vec3): Blick {
  const l = laenge(v) || 1;
  const pitch = Math.asin(begrenze(v.z / l, -1, 1));
  return { yaw: Math.atan2(v.y, v.x), pitch: begrenze(pitch, -ELEVATION_GRENZE, ELEVATION_GRENZE) };
}

/**
 * Dargestellter Einflussbereich eines Sonnenumläufers (Nachtrag §13.1):
 * Hill-Radius a · (m / 3M)^(1/3) mit der großen Halbachse zur Epoche,
 * vergrößert um sizeScale wie die Mondbahnen (sim/scale.ts), höchstens
 * EINFLUSS_DECKEL mal der dargestellte Sonnenabstand `pos`. Monde und die
 * Sonne haben keinen.
 */
export function einflussbereich(b: Body, index: BodyIndex, pos: Vec3, s: ScaleSettings): number | undefined {
  const sonne = index.sun;
  if (b.parent !== 'sun' || b.orbit === null || sonne === undefined) return undefined;
  const hill = b.orbit.a * AU_KM * Math.cbrt(b.physical.massKg / (3 * sonne.physical.massKg));
  return Math.min(hill * s.sizeScale, EINFLUSS_DECKEL * laenge(pos));
}

/** Dargestellte Lage, Radius, Mutterkörper und Einflussbereich aller sichtbaren Körper zu `jd`. */
export function koerperStaende(
  liste: readonly Body[], index: BodyIndex, jd: number, s: ScaleSettings,
  visible: Record<string, boolean>,
): KoerperStand[] {
  return liste
    .filter((b) => visible[b.id] !== false)
    .map((b) => {
      const pos = scaledPositionAt(b.id, index, jd, s);
      return { id: b.id, pos, radius: scaledRadius(b, s), mutter: b.parent, einfluss: einflussbereich(b, index, pos, s) };
    });
}

/**
 * Kleinster Abstand in eigenen Radien (§3.3). Ein anderer als `bisher` gewinnt
 * erst unter BEZUG_RUECKSTELLUNG mal dessen Maß; fehlt `bisher` unter den
 * Kandidaten, gilt der beste sofort.
 */
function naechsterInRadien(p: Vec3, kandidaten: readonly KoerperStand[], bisher: string | null): string | null {
  let bester: KoerperStand | null = null;
  let besterQ = Infinity;
  let bisherQ = Infinity;
  for (const k of kandidaten) {
    const q = laenge(minus(p, k.pos)) / k.radius;
    if (k.id === bisher) bisherQ = q;
    if (q < besterQ) { besterQ = q; bester = k; }
  }
  if (bester === null) return null;
  if (bisher !== null && bisherQ < Infinity && besterQ >= BEZUG_RUECKSTELLUNG * bisherQ) return bisher;
  return bester.id;
}

/**
 * Bezugskörper (§3.3, Nachtrag §13.1), zweistufig. Zuerst das System: der
 * Sonnenumläufer, in dessen Einflussbereich die Lage am tiefsten steht
 * (t = Abstand / Einflussbereich < 1). Ein bisheriges System bleibt bis
 * t ≥ 1 / BEZUG_RUECKSTELLUNG, ein anderes gewinnt vorher erst unter
 * BEZUG_RUECKSTELLUNG · t_bisher. Dann darin der Körper mit dem kleinsten
 * Abstand in eigenen Radien. Außerhalb jedes Systems konkurrieren die Sonne,
 * die Sonnenumläufer und Monde ausgeblendeter Mutterkörper. Ohne das hätte im
 * Schaubild die groß dargestellte Sonne schon wenige Erdradien vor der Erde
 * gewonnen.
 */
export function waehleBezug(
  p: Vec3, staende: readonly KoerperStand[], bisher: string | null,
): string | null {
  const zentren = staende.filter((k) => k.einfluss !== undefined && k.einfluss > 0);
  const tiefe = (z: KoerperStand): number => laenge(minus(p, z.pos)) / (z.einfluss ?? Infinity);
  const systemVon = (k: KoerperStand): KoerperStand | null =>
    zentren.find((z) => z.id === k.id || z.id === k.mutter) ?? null;

  let system: KoerperStand | null = null;
  let systemT = Infinity;
  for (const z of zentren) {
    const t = tiefe(z);
    if (t < 1 && t < systemT) { system = z; systemT = t; }
  }
  const bisherStand = bisher === null ? undefined : staende.find((k) => k.id === bisher);
  const bisherSystem = bisherStand === undefined ? null : systemVon(bisherStand);
  if (bisherSystem !== null) {
    const t = tiefe(bisherSystem);
    const anderesTiefer = system !== null && system !== bisherSystem && systemT < BEZUG_RUECKSTELLUNG * t;
    if (t < 1 / BEZUG_RUECKSTELLUNG && !anderesTiefer) system = bisherSystem;
  }
  const kandidaten = system === null
    ? staende.filter((k) => { const eigenes = systemVon(k); return eigenes === null || eigenes === k; })
    : staende.filter((k) => systemVon(k) === system);
  return naechsterInRadien(p, kandidaten, bisher);
}

/** Höhe über der nächsten sichtbaren Oberfläche und Radius dieses Körpers (§3.4). */
export function hoehe(p: Vec3, staende: readonly KoerperStand[]): { h: number; radius: number } {
  let h = Infinity;
  let radius = 0;
  for (const k of staende) {
    const d = laenge(minus(p, k.pos)) - k.radius;
    if (d < h) { h = d; radius = k.radius; }
  }
  return { h, radius };
}

/** km/s: Tempofaktor mal Höhe, nicht unter TEMPO_UNTERGRENZE_RADIEN Radien. */
export function fluggeschwindigkeit(p: Vec3, staende: readonly KoerperStand[], tempo: number): number {
  const { h, radius } = hoehe(p, staende);
  if (!Number.isFinite(h)) return 0;
  return tempo * Math.max(h, TEMPO_UNTERGRENZE_RADIEN * radius);
}

/**
 * Schiebt `p` radial aus jedem Körper auf MINDESTABSTAND_RADIEN hinaus; liegt
 * `p` im Mittelpunkt, nach Ekliptik-Nord. Ohne Änderung kommt `p` selbst zurück.
 */
export function mindesthoehe(p: Vec3, staende: readonly KoerperStand[]): Vec3 {
  let q = p;
  for (const k of staende) {
    const d = minus(q, k.pos);
    const l = laenge(d);
    const min = MINDESTABSTAND_RADIEN * k.radius;
    if (l >= min) continue;
    const richtung = l === 0 ? { x: 0, y: 0, z: 1 } : mal(d, 1 / l);
    q = plus(k.pos, mal(richtung, min));
  }
  return q;
}

/** Steuerabsicht je Achse in −1 … 1: vor (W/S), seit (D/A), hoch (E/Q). */
export interface Absicht { vor: number; seit: number; hoch: number }

/**
 * Körper nächst der Bildmitte (§4.2, Nachtrag §13.5): Liegt die Blickachse auf
 * einer Scheibe (Winkel kleiner als der Winkelradius), der vorderste solche
 * Körper; sonst der mit dem kleinsten Winkel zwischen Achse und Scheibenrand —
 * sonst gewänne ein kleiner Mond knapp neben der Achse gegen eine große
 * Scheibe, deren Rand ihr näher liegt. Nur Körper vor der Kamera; einer, in
 * dem die Kamera steckt, zählt nicht. Entspricht Rang 1a der Trefferprüfung
 * (render/treffer.ts), braucht aber keine Kandidaten.
 */
export function koerperNaechstDerMitte(pose: Pose, staende: readonly KoerperStand[]): string | null {
  let scheibe: { id: string; abstand: number } | null = null;
  let naechster: { id: string; rand: number } | null = null;
  for (const k of staende) {
    const d = minus(k.pos, pose.positionKm);
    const abstand = laenge(d);
    if (abstand <= k.radius) continue;
    const vorn = punkt(d, pose.blick);
    if (vorn <= 0) continue;
    // atan2 statt acos: auch bei winzigen Winkeln ferner Körper genau.
    const winkel = Math.atan2(laenge(kreuz(d, pose.blick)), vorn);
    const winkelradius = Math.asin(k.radius / abstand);
    if (winkel < winkelradius) {
      if (scheibe === null || abstand < scheibe.abstand) scheibe = { id: k.id, abstand };
    } else if (naechster === null || winkel - winkelradius < naechster.rand) {
      naechster = { id: k.id, rand: winkel - winkelradius };
    }
  }
  return scheibe?.id ?? naechster?.id ?? null;
}

/**
 * Kugelkoordinaten der Lage `p` um einen Körper, in den Grenzen der
 * Orbit-Eingabe — damit eine Umlaufkamera dort beginnt, wo die gezeigte
 * Kamera steht (§4.2, §4.5).
 */
export function kugelUm(p: Vec3, koerper: Vec3): { distance: number; azimuth: number; elevation: number } {
  const v = minus(p, koerper);
  const { yaw, pitch } = blickAus(v);
  return { distance: begrenze(laenge(v), MIN_DISTANCE_KM, MAX_DISTANCE_KM), azimuth: yaw, elevation: pitch };
}

/**
 * Ein Flugschritt (§4.1): Richtung aus Absicht und Kameraachsen, ab Länge 1
 * normiert (schräg nicht schneller), Weg = Geschwindigkeit mal dt. Ohne
 * Absicht kommt `p` selbst zurück.
 */
export function flugSchritt(p: Vec3, blick: Blick, absicht: Absicht, geschwindigkeit: number, dt: number): Vec3 {
  let r = plus(
    plus(mal(blickVektor(blick), absicht.vor), mal(rechtsVektor(blick), absicht.seit)),
    mal(obenVektor(blick), absicht.hoch),
  );
  const l = laenge(r);
  if (l === 0) return p;
  if (l > 1) r = mal(r, 1 / l);
  return plus(p, mal(r, geschwindigkeit * dt));
}

/** Dreht den Blick; yaw wickelt nicht, pitch bleibt in ±ELEVATION_GRENZE. */
export function blickDrehen(b: Blick, dYaw: number, dPitch: number): Blick {
  return { yaw: b.yaw + dYaw, pitch: begrenze(b.pitch + dPitch, -ELEVATION_GRENZE, ELEVATION_GRENZE) };
}
