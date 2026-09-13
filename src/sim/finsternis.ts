import type { BodyIndex, Vec3 } from './types';
import { positionAt } from './orbit';

/**
 * Suche der nächsten Mondfinsternis, rein geozentrisch aus `positionAt`
 * (Design-Dokument docs/superpowers/specs/2026-09-13-schatten-design.md,
 * §3 „Finsternis-Suche"). Ohne Renderer, ohne `three`/React/DOM — importiert
 * absichtlich auch nichts aus `src/data/**`, der Aufrufer übergibt den
 * `BodyIndex` (wie bei `positionAt` selbst).
 *
 * Geometrie: Mondvektor `m = positionAt('moon') − positionAt('earth')`
 * (geozentrisch), Sonnenvektor `s = −positionAt('earth')`. Die Achse des
 * Erdschattens zeigt von der Sonne weg, also in Richtung `−s/|s| =
 * erde/|erde|`. Winkelabstand `θ` zwischen `m` und dieser Achse;
 * `abstandKm = θ·|m|` ist die (für kleine θ nahezu exakte) lineare
 * Querablage der Mondmitte von der Schattenachse in Mondentfernung.
 * Kernschattenradius dort: `r_u = 1,02·(R⊕ − |m|·tan(asin((R☉−R⊕)/|s|)))`
 * — die 2 % sind Chauvenets Vergrößerung für die Erdatmosphäre (auch bei
 * Meeus, Astronomical Algorithms, Kap. 54). Partiell, wenn
 * `abstandKm < r_u + R☾`; total, wenn `abstandKm < r_u − R☾`.
 *
 * Suche: ab `jdStart` in Schritten von 0,25 d nach lokalen Minima von θ
 * (jedes Minimum ist ein Vollmond, `θ₋₁ > θ₀ ≤ θ₊₁`); Verfeinerung des
 * Minimums durch goldenen Schnitt über dem festen Fenster [jd₀ − 0,5;
 * jd₀ + 0,5] bis das Intervall unter 1e-4 d liegt (≈ 9 s). Erfüllt das
 * Maximum die Partiell-Bedingung, folgen Eintritt und Austritt durch
 * Bisektion auf `abstandKm = r_u + R☾` links bzw. rechts vom Maximum, sonst
 * weiter zum nächsten Vollmond. Nach `SUCHE_MAX_TAGE` ohne Treffer: `null`
 * (kommt in der Praxis nicht vor — Mondfinsternisse folgen im Abstand von
 * höchstens einem Jahr).
 *
 * Genauigkeit: Die Mondbahn hinter `positionAt` ist ein mittleres
 * Kepler-Modell mit säkularen Raten (data/bodies/moon.ts, Meeus-Elemente).
 * Die großen periodischen Störungen (Evektion ±1,3°, Variation ±0,7°)
 * fehlen; in der Länge entspricht das bis zu ±4 h Versatz im Zeitpunkt, in
 * der Breite bleibt der Fehler unter 0,3°. Ob überhaupt eine Finsternis
 * stattfindet, hängt an der Breite bei Vollmond ab, also an Knoten und
 * Inklination — beide tragen im Modell eine säkulare Rate. Deshalb prüfen
 * die Tests den Zeitpunkt nur auf ±4 h (≈ ±0,17 d), aber die Art (`total`)
 * exakt.
 */

/** 2 % Vergrößerung des Erdschattens für die Erdatmosphäre (Chauvenet/Meeus). */
export const KERNSCHATTEN_VERGROESSERUNG = 1.02;

/** Obere Schranke der Suche in Tagen — wird in der Praxis nie erreicht. */
export const SUCHE_MAX_TAGE = 3 * 365.25;

/** Abstand der Mondmitte von der Kernschattenachse in Mondentfernung, Kernschattenradius dort, Mondradius — alles km. */
export interface KernschattenLage {
  abstandKm: number;
  kernschattenKm: number;
  mondRadiusKm: number;
}

export interface Mondfinsternis {
  eintrittJd: number;
  maximumJd: number;
  austrittJd: number;
  art: 'total' | 'partiell';
}

/** Schrittweite der Grobsuche über die Vollmonde, in Tagen. */
const SCHRITT_TAGE = 0.25;

/** Halbe Breite des Verfeinerungsfensters um ein gefundenes Minimum/Maximum, in Tagen. */
const FENSTER_HALBE_TAGE = 0.5;

/** Zielgenauigkeit von goldenem Schnitt und Bisektion, in Tagen (≈ 9 s). */
const GENAUIGKEIT_TAGE = 1e-4;

/** Goldener Schnitt, (√5 − 1) / 2. */
const PHI = (Math.sqrt(5) - 1) / 2;

function clamp(wert: number, min: number, max: number): number {
  return Math.min(Math.max(wert, min), max);
}

/** Rohgeometrie eines Zeitpunkts — je Aufruf genau eine Erd- und eine Mondposition. */
interface Geometrie {
  /** Winkelabstand θ zwischen Mondrichtung und Schattenachse, in rad. */
  theta: number;
  /** Erde-Mond-Abstand |m|, in km. */
  mondAbstand: number;
  /** Kernschattenradius in Mondentfernung, in km. */
  kernschattenKm: number;
}

function geometrieAt(index: BodyIndex, jd: number): Geometrie {
  const erde = positionAt('earth', index, jd);
  const mondPos = positionAt('moon', index, jd);
  const mond: Vec3 = { x: mondPos.x - erde.x, y: mondPos.y - erde.y, z: mondPos.z - erde.z };

  const sonne = index['sun'];
  if (!sonne) throw new Error("Sonnenradius nicht verfügbar: 'sun' fehlt im BodyIndex");
  const erdkoerper = index['earth'];
  if (!erdkoerper) throw new Error("Erdradius nicht verfügbar: 'earth' fehlt im BodyIndex");

  const rSonne = sonne.physical.radiusKm;
  const rErde = erdkoerper.physical.radiusKm;

  // |s| = |−erde| = |erde|: die Sonne steht (geozentrisch) genau gegenüber
  // der heliozentrischen Erdposition.
  const dSonne = Math.hypot(erde.x, erde.y, erde.z);
  const dMond = Math.hypot(mond.x, mond.y, mond.z);

  // θ = acos(dot(m, −s) / (|m|·|s|)), mit −s = erde (Achse zeigt von der
  // Sonne weg, also in Richtung der heliozentrischen Erdposition selbst).
  const cosTheta = (mond.x * erde.x + mond.y * erde.y + mond.z * erde.z) / (dMond * dSonne);
  const theta = Math.acos(clamp(cosTheta, -1, 1));

  const kegel = Math.asin((rSonne - rErde) / dSonne);
  const kernschattenKm = KERNSCHATTEN_VERGROESSERUNG * (rErde - dMond * Math.tan(kegel));

  return { theta, mondAbstand: dMond, kernschattenKm };
}

/** Abstand der Mondmitte von der Kernschattenachse in Mondentfernung, Kernschattenradius dort, Mondradius — alles km. */
export function kernschattenLage(index: BodyIndex, jd: number): KernschattenLage {
  const g = geometrieAt(index, jd);
  const mond = index['moon'];
  if (!mond) throw new Error("Mondradius nicht verfügbar: 'moon' fehlt im BodyIndex");

  return {
    abstandKm: g.theta * g.mondAbstand,
    kernschattenKm: g.kernschattenKm,
    mondRadiusKm: mond.physical.radiusKm,
  };
}

/** abstand < kern + mond — der Mond berührt zumindest den Halbschatten-Kern, sprich: den Kernschatten. */
export function istPartiell(l: KernschattenLage): boolean {
  return l.abstandKm < l.kernschattenKm + l.mondRadiusKm;
}

/** abstand < kern − mond — der Mond steht vollständig im Kernschatten. */
export function istTotal(l: KernschattenLage): boolean {
  return l.abstandKm < l.kernschattenKm - l.mondRadiusKm;
}

/**
 * Verfeinert ein bei `jd0` gefundenes lokales Minimum von θ auf dem festen
 * Fenster [jd0 − 0,5; jd0 + 0,5] per goldenem Schnitt, bis das Intervall
 * unter `GENAUIGKEIT_TAGE` liegt. Je Iteration wird nur eine neue Stelle
 * ausgewertet (die andere ist vom vorigen Schritt bekannt).
 */
function goldenerSchnittMinimum(index: BodyIndex, jd0: number): number {
  let a = jd0 - FENSTER_HALBE_TAGE;
  let b = jd0 + FENSTER_HALBE_TAGE;
  let c = b - PHI * (b - a);
  let d = a + PHI * (b - a);
  let thetaC = geometrieAt(index, c).theta;
  let thetaD = geometrieAt(index, d).theta;

  while (b - a > GENAUIGKEIT_TAGE) {
    if (thetaC < thetaD) {
      b = d;
      d = c;
      thetaD = thetaC;
      c = b - PHI * (b - a);
      thetaC = geometrieAt(index, c).theta;
    } else {
      a = c;
      c = d;
      thetaC = thetaD;
      d = a + PHI * (b - a);
      thetaD = geometrieAt(index, d).theta;
    }
  }
  return (a + b) / 2;
}

/**
 * Bisektion auf die Grenze von `istPartiell` zwischen einem Zeitpunkt
 * innerhalb der Finsternis (`jdVerfinstert`, z. B. das Maximum) und einem
 * Zeitpunkt außerhalb (`jdFrei`, z. B. Maximum ± 0,5 d), bis auf
 * `GENAUIGKEIT_TAGE` genau. Funktioniert für Eintritt (jdFrei < jdVerfinstert)
 * und Austritt (jdFrei > jdVerfinstert) gleichermaßen.
 */
function bisektionsGrenze(index: BodyIndex, jdVerfinstert: number, jdFrei: number): number {
  let a = jdVerfinstert;
  let b = jdFrei;
  while (Math.abs(b - a) > GENAUIGKEIT_TAGE) {
    const mitte = (a + b) / 2;
    if (istPartiell(kernschattenLage(index, mitte))) {
      a = mitte;
    } else {
      b = mitte;
    }
  }
  return (a + b) / 2;
}

/**
 * Sucht ab `jdStart` die nächste Mondfinsternis (partiell oder total).
 * `null`, wenn innerhalb von `SUCHE_MAX_TAGE` keine gefunden wird.
 */
export function naechsteMondfinsternis(index: BodyIndex, jdStart: number): Mondfinsternis | null {
  const jdEnde = jdStart + SUCHE_MAX_TAGE;

  let thetaVorher = geometrieAt(index, jdStart).theta;
  let jdAktuell = jdStart + SCHRITT_TAGE;
  let thetaAktuell = geometrieAt(index, jdAktuell).theta;

  for (let jdNaechster = jdAktuell + SCHRITT_TAGE; jdNaechster <= jdEnde; jdNaechster += SCHRITT_TAGE) {
    const thetaNaechster = geometrieAt(index, jdNaechster).theta;

    if (thetaVorher > thetaAktuell && thetaAktuell <= thetaNaechster) {
      const maximumJd = goldenerSchnittMinimum(index, jdAktuell);
      const lageMax = kernschattenLage(index, maximumJd);

      if (istPartiell(lageMax)) {
        const eintrittJd = bisektionsGrenze(index, maximumJd, maximumJd - FENSTER_HALBE_TAGE);
        const austrittJd = bisektionsGrenze(index, maximumJd, maximumJd + FENSTER_HALBE_TAGE);
        return {
          eintrittJd,
          maximumJd,
          austrittJd,
          art: istTotal(lageMax) ? 'total' : 'partiell',
        };
      }
    }

    thetaVorher = thetaAktuell;
    jdAktuell = jdNaechster;
    thetaAktuell = thetaNaechster;
  }

  return null;
}
