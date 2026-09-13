import { AU_KM } from '../sim/orbit';

/**
 * Die vier Größen aus `state.display`, die das Aussehen der Beleuchtung
 * bestimmen. Bewusst ein eigenes Interface und nicht `AppState['display']`:
 * Die Rechnung hier kennt weder Bahnlinien noch Beschriftungen.
 */
export interface LightingSettings {
  /** Bestrahlungsstärke bei 1 AE; Bezugswert der ganzen Kalibrierung. */
  brightness: number;
  /** Abfallexponent des Sonnenlichts; 2 ist der physikalische Wert. */
  lightFalloff: number;
  /** Nachtseitenanteil: Bruchteil des eigenen Tagniveaus, 0 = physikalisch. */
  nightFill: number;
  /** Distanzausgleich: 0 = physikalischer Abfall, 1 = überall gleich hell. */
  lightCompensation: number;
}

/**
 * Grenzen der Farbverstärkung — reine Zahlenwächter, keine Bildgestaltung.
 *
 * Die Verstärkung `E^-c` kann das Material nicht ausbrennen: Auf dem Material
 * kommt `E · E^-c = E^(1-c)` an, und das ist für jeden Körper jenseits von
 * 1 AE höchstens 1, diesseits ist die Verstärkung kleiner als 1. Die obere
 * Grenze darf deshalb innerhalb des Katalogs nie greifen: Eris steht bei
 * „Realistisch" rund 97 AE weit, das verlangt bei vollem Ausgleich (c = 1,
 * quadratischer Abfall) eine Verstärkung von 97² ≈ 9 500. Die frühere
 * Grenze 12 griff schon ab 4,3 AE und ließ alles von Jupiter an dunkler,
 * als der Distanzausgleich versprach — Pluto bei einem Median von 21–25 von
 * 255 (docs/phase3a-abnahme.md, Nachtrag). Die Grenze 1e5 lässt Reserve bis
 * etwa 300 AE bei c = 1 und fängt nur noch Körper weit jenseits des Katalogs
 * ab; die untere Grenze schützt einen Körper dicht am Sonnenmittelpunkt vor
 * einem auf null zusammengefallenen Material.
 */
export const MAX_COLOR_GAIN = 1e5;
export const MIN_COLOR_GAIN = 0.02;

/** Für die Sonne selbst und alles im Ursprung gilt der Bezugswert. */
const BEZUG_IM_URSPRUNG = 1;

export interface BodyLighting {
  /**
   * Faktor auf `material.color`. Er hebt ferne Körper an, ohne das Punktlicht
   * anzutasten — ein einziges Licht kann nicht für jeden Körper einen anderen
   * Abfall haben, ein Materialfaktor pro Körper schon.
   */
  colorGain: number;
  /**
   * Das Niveau der voll besonnten Stelle nach dem Ausgleich, in denselben
   * Einheiten wie `brightness`. Bezugsgröße für die Nachtseite.
   */
  dayLevel: number;
  /**
   * `material.emissiveIntensity`. Das Emissiv ist hier kein Selbstleuchten,
   * sondern das Fülllicht: Es hebt die Nachtseite von absolut null auf einen
   * festen Bruchteil der Tagseite. Ohne es bleibt die abgewandte Hälfte
   * mathematisch schwarz — genau der Befund aus dem Dauerlauf.
   */
  emissiveIntensity: number;
}

/**
 * Bestrahlungsstärke relativ zu 1 AE: `(AE / d)^k`. Das ist genau der
 * Abfall, den das Punktlicht in scene.ts erzeugt (Intensität auf 1 AE
 * kalibriert, `decay = k`) — hier nur ohne die Render-Einheiten, damit die
 * Rechnung in AE lesbar bleibt.
 */
export function irradianceFactor(distanceKm: number, falloff: number): number {
  if (!(distanceKm > 0)) return BEZUG_IM_URSPRUNG;
  return Math.pow(AU_KM / distanceKm, falloff);
}

/**
 * Die Beleuchtung eines einzelnen Körpers an seinem dargestellten Abstand.
 *
 * Zwei Eingriffe, beide bewusst nicht physikalisch:
 *
 * 1. **Distanzausgleich.** Das Tagniveau ist `brightness * E^(1-c)` statt
 *    `brightness * E`. Bei c = 0 bleibt alles physikalisch, bei c = 1 sind
 *    alle Körper gleich hell. Der Ausgleich wirkt nur auf den Abstandsanteil
 *    E, nie auf `brightness` — sonst würde der Helligkeitsregler bei c = 1
 *    wirkungslos, weil sein Beitrag gleich wieder herausgeteilt würde.
 *    Erreicht wird das Niveau über `colorGain = E^-c` auf dem Material,
 *    denn das Licht selbst gilt für alle Körper gemeinsam. `dayLevel` ist
 *    dabei ausdrücklich aus der **geklemmten** Verstärkung gerechnet,
 *    `brightness · E · colorGain` — also die Größe, die das Material
 *    tatsächlich bekommt, nicht die Formel, die es bekommen sollte. Greift
 *    die Klemme, sinkt damit auch die Nachtseitenfüllung mit; vorher blieb
 *    sie auf dem ungeklemmten Wert stehen und war bei fernen Körpern heller
 *    als die Tagseite.
 * 2. **Nachtseitenfüllung.** Das Emissiv trägt `nightFill` mal das
 *    Tagniveau. Der Faktor 1/π kommt vom Lambert-BRDF: Der direkte Anteil
 *    wird in Three mit `1/π` gewichtet, das Emissiv nicht. Ohne ihn wäre
 *    `nightFill` um π zu groß und die Nachtseite heller als beabsichtigt.
 */
export function bodyLighting(distanceKm: number, s: LightingSettings): BodyLighting {
  const e = irradianceFactor(distanceKm, s.lightFalloff);
  const gain = Math.min(Math.max(Math.pow(e, -s.lightCompensation), MIN_COLOR_GAIN), MAX_COLOR_GAIN);
  const dayLevel = s.brightness * e * gain;
  return {
    colorGain: gain,
    dayLevel,
    emissiveIntensity: (s.nightFill * dayLevel) / Math.PI,
  };
}
