import type { RingBand } from '../sim/types';

/**
 * Radialer Ringstreifen aus Messdaten — für Ringsysteme ohne freie Bildquelle.
 *
 * Für Uranus gibt es (Stand 12.09.2026, siehe ASSETS.md) keine Ringtextur
 * unter einer Lizenz, die zu diesem Projekt passt: Solar System Scope und
 * die NASA-3D-Resources führen keine, das NASA-glTF-Modell ist eine nackte
 * Kugel, Stellariums `uranus_rings.png` stammt laut Quelldatei aus Celestia
 * mit leerem Lizenzfeld. Was es gibt, sind die Messwerte: Der PDS
 * Ring-Moon Systems Node tabelliert für alle Ringe Mittelradius, Breite und
 * normale optische Tiefe. Dieses Modul macht daraus den Streifen, den
 * rings.ts sonst aus einer PNG-Datei liest.
 *
 * Zwei Dinge sind dabei bewusst nicht maßstäblich — die künstlerische
 * Freiheit, die der Datensatz erzwingt:
 *
 * 1. Breite. Die schmalen Uranusringe sind 1,5 bis 60 km breit, das ganze
 *    System 13 800 km. In der Kinoszene `uranus-gekippt` deckt der Streifen
 *    rund 160 Bildpunkte ab, ein Kilometer ist also ein Achtzigstel Pixel:
 *    Maßstäblich gezeichnet verschwände jeder Ring außer ε im Aliasing.
 *    Schmale Ringe bekommen deshalb eine Darstellungsbreite aus Sockel plus
 *    Vielfachem der echten Breite (bandDarstellungsbreiteKm). Der Sockel
 *    macht alle sichtbar, das Vielfache erhält die Rangfolge: ε bleibt der
 *    mit Abstand breiteste, die Ringe 6, 5, 4 die feinsten Linien.
 *
 * 2. Deckkraft der diffusen Komponenten. ζ-Ring und Staubschicht liegen bei
 *    τ ≈ 0,005 — real ein kaum messbarer Schleier. Ein fester Faktor hebt sie
 *    auf einen schwachen, aber sichtbaren Hauch (bandDeckkraft), gedeckelt,
 *    damit keine diffuse Komponente einem dichten Ring gleichkommt.
 *
 * Die schmalen Ringe selbst folgen dagegen der Physik: Ihre Deckkraft ist
 * 1 − e^(−τ) (Lambert-Beer), also der Anteil des Lichts, den ein Ring der
 * gemessenen optischen Tiefe tatsächlich zurückhält — ε (τ ≈ 1,5) deckt
 * damit zu 78 %, der 6-Ring (τ ≈ 0,3) zu 26 %, und die Rangfolge der
 * Helligkeiten im Bild ist die der Messung.
 *
 * Alles hier ist reine Rechnung auf Zahlen und Uint8Array, ohne Three.js —
 * rings.ts verpackt das Ergebnis in eine DataTexture.
 */

/** Sockelbreite jedes schmalen Rings in der Darstellung, Kilometer. */
export const PROFIL_MIN_BREITE_KM = 260;
/** Vielfaches der echten Breite, das auf den Sockel kommt. */
export const PROFIL_BREITENFAKTOR = 6;
/** Verstärkung der optischen Tiefe diffuser Komponenten. */
export const PROFIL_DIFFUS_VERSTAERKUNG = 12;
/** Obergrenze der Deckkraft diffuser Komponenten. */
export const PROFIL_DIFFUS_MAX = 0.12;

/** Breite, mit der ein Band im Streifen gezeichnet wird (siehe Modulkommentar, Punkt 1). */
export function bandDarstellungsbreiteKm(band: RingBand): number {
  if (band.art === 'breit') return band.widthKm;
  return PROFIL_MIN_BREITE_KM + PROFIL_BREITENFAKTOR * band.widthKm;
}

/** Deckkraft eines Bands in [0, 1] (siehe Modulkommentar, Punkt 2 und Lambert-Beer). */
export function bandDeckkraft(band: RingBand): number {
  if (band.art === 'breit') {
    return Math.min(PROFIL_DIFFUS_MAX, band.opticalDepth * PROFIL_DIFFUS_VERSTAERKUNG);
  }
  return 1 - Math.exp(-band.opticalDepth);
}

/**
 * Rechnet den RGBA-Streifen: `breite` Texel von der Innenkante (`innenKm`)
 * zur Außenkante (`aussenKm`), passend zur UV-Belegung aus
 * ringGeometrieDaten (u = 0 innen, u = 1 außen). Die Farbe ist für alle
 * Texel gleich — die Uranusringe sind neutral dunkelgrau mit leichtem
 * Rotstich (Baines et al. 1998, via Wikipedia „Rings of Uranus"), eine
 * radiale Farbvariation ist nicht belegt. Die gesamte Struktur steckt im
 * Alphakanal.
 *
 * Überlappende Bänder (etwa ζ-Ring über der Staubschicht) werden als
 * Schichten zusammengesetzt: 1 − Π(1 − aᵢ). Bänder, die über den Rand des
 * Streifens hinausreichen, werden dort abgeschnitten.
 */
export function ringProfilTexel(
  profil: readonly RingBand[],
  innenKm: number,
  aussenKm: number,
  breite: number,
  farbe: readonly [number, number, number],
): Uint8Array {
  const spanneKm = aussenKm - innenKm;
  const kmJeTexel = spanneKm / breite;
  const durchlass = new Float64Array(breite).fill(1);

  for (const band of profil) {
    const halb = bandDarstellungsbreiteKm(band) / 2;
    const a = bandDeckkraft(band);
    if (a <= 0) continue;
    const von = Math.max(0, Math.floor((band.radiusKm - halb - innenKm) / kmJeTexel));
    const bis = Math.min(breite - 1, Math.ceil((band.radiusKm + halb - innenKm) / kmJeTexel) - 1);
    for (let i = von; i <= bis; i++) durchlass[i]! *= 1 - a;
  }

  const texel = new Uint8Array(breite * 4);
  for (let i = 0; i < breite; i++) {
    texel[i * 4] = farbe[0];
    texel[i * 4 + 1] = farbe[1];
    texel[i * 4 + 2] = farbe[2];
    texel[i * 4 + 3] = Math.round((1 - durchlass[i]!) * 255);
  }
  return texel;
}
