import type { Body, BodyIndex, Vec3 } from '../../sim/types';
import type { ScaleSettings } from '../../sim/scale';
import { scaledPositionAt, scaledRadius } from '../../sim/scale';

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

/** Blickrichtung, gezählt wie azimuth/elevation: yaw um Ekliptik-Nord, pitch darüber. */
export interface Blick { yaw: number; pitch: number }
/** Gezeigte Kameralage eines Bildes: Weltlage in km und Blickvektor der Länge 1. */
export interface Pose { positionKm: Vec3; blick: Vec3 }
/** Dargestellte Lage und dargestellter Radius eines sichtbaren Körpers. */
export interface KoerperStand { id: string; pos: Vec3; radius: number }

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

/** Dargestellte Lage und Radius aller sichtbaren Körper zu `jd`. */
export function koerperStaende(
  liste: readonly Body[], index: BodyIndex, jd: number, s: ScaleSettings,
  visible: Record<string, boolean>,
): KoerperStand[] {
  return liste
    .filter((b) => visible[b.id] !== false)
    .map((b) => ({ id: b.id, pos: scaledPositionAt(b.id, index, jd, s), radius: scaledRadius(b, s) }));
}

/**
 * Bezugskörper (§3.3): kleinster Abstand in eigenen Radien. Ein anderer als
 * `bisher` gewinnt erst unter BEZUG_RUECKSTELLUNG mal dessen Maß; fehlt
 * `bisher` unter den Ständen (ausgeblendet), gilt der beste sofort.
 */
export function waehleBezug(
  p: Vec3, staende: readonly KoerperStand[], bisher: string | null,
): string | null {
  let bester: KoerperStand | null = null;
  let besterQ = Infinity;
  let bisherQ = Infinity;
  for (const k of staende) {
    const q = laenge(minus(p, k.pos)) / k.radius;
    if (k.id === bisher) bisherQ = q;
    if (q < besterQ) { besterQ = q; bester = k; }
  }
  if (bester === null) return null;
  if (bisher !== null && bisherQ < Infinity && besterQ >= BEZUG_RUECKSTELLUNG * bisherQ) return bisher;
  return bester.id;
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
