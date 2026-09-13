/**
 * Albedo-Normierung als reine Pixelrechnung — ohne three, ohne DOM, damit
 * sie in der node-Testumgebung läuft. Die Canvas-Auswertung, die die Pixel
 * liefert, sitzt in bodies.ts.
 *
 * Warum überhaupt: Die Albedo-Texturen sind kontrastnormierte Mosaike, keine
 * Reflexionskarten. Die Enceladus-Karte hat ein Mittel von 0,18 linear, der
 * Körper eine Albedo von 1,0 — ohne Normierung wäre der hellste Körper des
 * Sonnensystems so grau wie der Erdmond.
 */

/**
 * Unter dieser linearen Reflexion zählt ein Pixel als Datenlücke: die
 * unbelichteten Kartenteile von Pluto (rund 30 % der Fläche) und Triton
 * (rund 38 %), siehe ASSETS.md. Die reale Albedo-Dichotomie von Iapetus
 * (dunkle Seite 0,05) liegt zehnmal darüber und zählt mit.
 */
export const LUECKEN_SCHWELLE_LINEAR = 0.005;

/**
 * Klemme des Albedofaktors — Zahlenwächter gegen eine nach dem
 * Lückenausschluss fast leere Textur, keine Gestaltung. albedo.test.ts hält
 * fest, dass kein Körper des Katalogs sie erreicht.
 */
export const ALBEDO_FAKTOR_MIN = 0.1;
export const ALBEDO_FAKTOR_MAX = 30;

/** sRGB-Kanalwert 0–255 → lineare Reflexion 0–1 (IEC 61966-2-1). */
export function srgbZuLinear(wert: number): number {
  const v = wert / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Mittlere lineare Reflexion einer Rektangularkarte.
 *
 * `daten` sind RGBA-Pixel (wie `ImageData.data`), zeilenweise von +90° bis
 * −90° Breite. Jede Zeile wiegt mit dem Kosinus ihrer Breite — auf der
 * Kugel ist eine Polzeile fast nichts, in der Karte so breit wie der
 * Äquator. Pixel unter der Lückenschwelle zählen nicht. `null`, wenn kein
 * Pixel zählt.
 */
export function mittlereReflexion(
  daten: ArrayLike<number>, breite: number, hoehe: number,
): number | null {
  let summe = 0;
  let gewichtSumme = 0;
  for (let zeile = 0; zeile < hoehe; zeile++) {
    const breiteGrad = 90 - ((zeile + 0.5) / hoehe) * 180;
    const gewicht = Math.cos((breiteGrad * Math.PI) / 180);
    for (let spalte = 0; spalte < breite; spalte++) {
      const i = (zeile * breite + spalte) * 4;
      const grau = (
        srgbZuLinear(daten[i]!) + srgbZuLinear(daten[i + 1]!) + srgbZuLinear(daten[i + 2]!)
      ) / 3;
      if (grau < LUECKEN_SCHWELLE_LINEAR) continue;
      summe += grau * gewicht;
      gewichtSumme += gewicht;
    }
  }
  return gewichtSumme > 0 ? summe / gewichtSumme : null;
}

/**
 * Faktor auf Materialfarbe und Nachtseiten-Emissiv, damit die mittlere
 * Reflexion der Textur (oder der Ausweichfarbe) der Katalog-Albedo
 * entspricht. 1 ohne Albedo (die Sonne) und ohne Messwert (Textur noch
 * nicht geladen, Canvas nicht verfügbar).
 */
export function albedoFaktor(albedo: number | undefined, mittel: number | null): number {
  if (albedo === undefined || mittel === null || !(mittel > 0)) return 1;
  return Math.min(Math.max(albedo / mittel, ALBEDO_FAKTOR_MIN), ALBEDO_FAKTOR_MAX);
}

/** Mittlere lineare Reflexion einer Ausweichfarbe `#rrggbb`. */
export function farbMittelLinear(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  return (
    srgbZuLinear((n >> 16) & 255) + srgbZuLinear((n >> 8) & 255) + srgbZuLinear(n & 255)
  ) / 3;
}
