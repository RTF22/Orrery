/**
 * Deterministische Bahnelemente für den Hauptgürtel und den Kuipergürtel.
 *
 * Reine Funktionen ohne three-Import: Der Renderer packt die Arrays in
 * Vertex-Attribute und rechnet die Bahnen im Shader (siehe Entwurf
 * docs/superpowers/specs/2026-09-13-guertel-design.md, Abschnitte 2 und 3).
 * Gleicher Keim und gleiche Anzahl ergeben identische Arrays — das macht die
 * Verteilung prüfbar und den Gürtel zwischen zwei Sitzungen wiedererkennbar.
 *
 * Die Verteilungen sind Näherungen an die beobachtete Population (MPC,
 * nummerierte Asteroiden bzw. klassischer Kuipergürtel und Plutinos); jeder
 * Zahlenwert ist an seiner Stelle begründet.
 */
import type { QualityTier } from '../store/types';
import { createRng } from './random';

const GRAD = Math.PI / 180;
const ZWEI_PI = 2 * Math.PI;

/**
 * Gravitationsparameter der Sonne in AE³/Tag²: das Quadrat der Gaußschen
 * Gravitationskonstante k = 0,01720209895 AE^(3/2)/Tag (IAU 1976, in
 * dieser Form seit Gauß, Theoria Motus, 1809). k² = 2,9591220828e-4.
 */
export const GM_SONNE_AE3_TAG2 = 0.01720209895 ** 2;

/** Große Halbachse Jupiters in AE (JPL-Mittelwerte J2000), Bezug der Resonanzen. */
const A_JUPITER_AE = 5.2044;

/** Bahnelemente einer Punktwolke, je Element ein Array; Winkel in Radiant. */
export interface BeltElements {
  count: number;
  /** Große Halbachse in AE */
  a: Float32Array;
  /** Exzentrizität */
  e: Float32Array;
  /** Inklination gegen die Ekliptik */
  inc: Float32Array;
  /** Länge des aufsteigenden Knotens Ω */
  node: Float32Array;
  /** Perihelargument ω */
  peri: Float32Array;
  /** Mittlere Anomalie zur Epoche J2000 */
  m0: Float32Array;
  /** Mittlere Bewegung in Radiant je Tag, n = √(GM/a³) */
  n: Float32Array;
}

/**
 * Eine Teilpopulation eines Gürtels. Die Halbachse wird per
 * Verwerfungsmethode gegen `aDichte` gezogen (Werte in [0, 1], außerhalb
 * von `aBereich` ist die Dichte null); e und i sind Rayleigh-verteilt mit
 * Deckel durch Neuziehen; Ω, ω und M0 sind gleichverteilt.
 */
export interface BeltPopulation {
  /** Beschreibung für Leser des Codes */
  name: string;
  /** Gewicht in der Mischung; die Gewichte eines Gürtels werden normiert. */
  gewicht: number;
  /** Bereich der Halbachse in AE */
  aBereich: readonly [number, number];
  /** Unnormierte Dichte der Halbachse, Werte in [0, 1] */
  aDichte: (a: number) => number;
  /** Rayleigh-Parameter σ und Deckel der Exzentrizität */
  eSigma: number;
  eMax: number;
  /** Rayleigh-Parameter σ und Deckel der Inklination, Radiant */
  iSigmaRad: number;
  iMaxRad: number;
}

/** Verteilungsparameter eines Gürtels: eine Mischung von Teilpopulationen. */
export interface BeltSpec {
  name: string;
  populationen: readonly BeltPopulation[];
}

/**
 * Kirkwood-Lücken als Produkt gaußförmiger Einbrüche auf 10 % Restdichte.
 *
 * Lage der Resonanzen q:p mit Jupiter (Umlaufzeit des Asteroiden = p/q der
 * Jupiterzeit) nach Kepler-3: a = a_J · (p/q)^(2/3) mit a_J = 5,2044 AE:
 *   4:1  (1/4)^(2/3) = 0,39685 → 2,0654 AE
 *   3:1  (1/3)^(2/3) = 0,48075 → 2,5020 AE
 *   5:2  (2/5)^(2/3) = 0,54288 → 2,8254 AE
 *   7:3  (3/7)^(2/3) = 0,56844 → 2,9584 AE
 *   2:1  (1/2)^(2/3) = 0,62996 → 3,2786 AE
 * Die Breite w ist der Gauß-Parameter in exp(−((a−a_res)/w)²); die
 * Halbwertsbreite beträgt 1,665·w, also 0,017 bis 0,033 AE — die 3:1- und
 * 2:1-Lücken sind in der MPC-Verteilung breiter als 7:3.
 *
 * Nur eine der fünf Lücken ist im erzeugten Gürtel praktisch nicht zu sehen:
 * Die 4:1-Lücke bei 2,0654 AE liegt vor der unteren Bereichsgrenze 2,1 AE,
 * ihr Einbruch ist dort schon wieder auf über 99 % abgeklungen und trägt
 * nichts bei. Die 2:1-Lücke bei 3,2786 AE liegt dagegen mit ihrer Mitte
 * innerhalb des Bereichs 2,1 bis 3,3 AE; die obere Grenze 3,3 AE schneidet
 * nur ihren äußeren Ausläufer ab, rund 1,07 Gaußbreiten (w = 0,020) hinter
 * der Mitte — dort ist kirkwoodDensity(3,3) ≈ 0,715, also noch rund 28 %
 * Einbruch, und rund 93,5 % des Lückenprofils 0,9·exp(−x²) liegen im
 * Bereich. Beide Lücken bleiben in der vollständigen Liste, weil sie die
 * Kanten richtig ausdünnen (die 2:1-Lücke fast vollständig) und weil die
 * Tabelle die Resonanzen physikalisch vollständig beschreiben soll —
 * geprüft wird die Lückenwirkung deshalb an der 3:1-Lücke (belts.test.ts).
 */
const RESONANZEN: ReadonlyArray<{ p: number; q: number; w: number }> = [
  { p: 1, q: 4, w: 0.012 },
  { p: 1, q: 3, w: 0.015 },
  { p: 2, q: 5, w: 0.012 },
  { p: 3, q: 7, w: 0.010 },
  { p: 1, q: 2, w: 0.020 },
];

const LUECKEN: ReadonlyArray<{ aRes: number; w: number }> = RESONANZEN.map((r) => ({
  aRes: A_JUPITER_AE * Math.pow(r.p / r.q, 2 / 3),
  w: r.w,
}));

/** Dichtefaktor der Kirkwood-Lücken in [0,1; 1] als Funktion der Halbachse in AE. */
export function kirkwoodDensity(a: number): number {
  let dichte = 1;
  for (const { aRes, w } of LUECKEN) {
    const x = (a - aRes) / w;
    dichte *= 1 - 0.9 * Math.exp(-x * x);
  }
  return dichte;
}

/** Glockenkurve ohne Normierung, Maximum eins bei mu. */
function glocke(a: number, mu: number, sigma: number): number {
  const x = (a - mu) / sigma;
  return Math.exp(-0.5 * x * x);
}

/**
 * Hauptgürtel: Glockenkurve um 2,7 AE (σ 0,35 AE) über 2,1 bis 3,3 AE,
 * moduliert mit den Kirkwood-Lücken. Mittlere e ≈ 0,14 und i ≈ 8° wie in
 * der MPC-Verteilung der nummerierten Asteroiden.
 */
export const HAUPTGUERTEL: BeltSpec = {
  name: 'Hauptgürtel',
  populationen: [
    {
      name: 'Hauptgürtel mit Kirkwood-Lücken',
      gewicht: 1,
      aBereich: [2.1, 3.3],
      aDichte: (a) => glocke(a, 2.7, 0.35) * kirkwoodDensity(a),
      eSigma: 0.10,
      eMax: 0.35,
      iSigmaRad: 6 * GRAD,
      iMaxRad: 30 * GRAD,
    },
  ],
};

/**
 * Gleichmäßige Dichte mit weichem Rand: eins zwischen den inneren Grenzen,
 * linear auf null an den äußeren Grenzen abfallend.
 */
function plateau(a: number, aussenMin: number, innenMin: number, innenMax: number, aussenMax: number): number {
  if (a <= aussenMin || a >= aussenMax) return 0;
  if (a < innenMin) return (a - aussenMin) / (innenMin - aussenMin);
  if (a > innenMax) return (aussenMax - a) / (aussenMax - innenMax);
  return 1;
}

/**
 * Kuipergürtel: klassischer Gürtel 39 bis 48 AE (85 %), davon eine kalte
 * Population mit niedriger Inklination (60 % des Gürtels) und eine heiße
 * (25 %); dazu 15 % Plutinos in der 3:2-Resonanz mit Neptun bei 39,4 AE.
 * Die Plutinos zählen zur heißen Inklinationsgruppe, so dass insgesamt
 * 60 % kalt und 40 % heiß sind — Zusammensetzung nach Entwurf, Abschnitt 3.2.
 */
const KLASSISCH_A = {
  aBereich: [38.5, 48.5] as const,
  // weicher Rand von 0,5 AE Breite um die nominellen Grenzen 39 und 48 AE
  aDichte: (a: number) => plateau(a, 38.5, 39.5, 47.5, 48.5),
};

export const KUIPERGUERTEL: BeltSpec = {
  name: 'Kuipergürtel',
  populationen: [
    {
      name: 'klassisch kalt',
      gewicht: 0.60,
      ...KLASSISCH_A,
      eSigma: 0.05,
      eMax: 0.35,
      iSigmaRad: 3 * GRAD,
      iMaxRad: 35 * GRAD,
    },
    {
      name: 'klassisch heiß',
      gewicht: 0.25,
      ...KLASSISCH_A,
      eSigma: 0.05,
      eMax: 0.35,
      iSigmaRad: 12 * GRAD,
      iMaxRad: 35 * GRAD,
    },
    {
      name: 'Plutinos (3:2 mit Neptun)',
      gewicht: 0.15,
      // ±3,3σ um 39,4 AE; die Resonanz liegt bei 30,07·(3/2)^(2/3) = 39,4 AE
      aBereich: [38.4, 40.4],
      aDichte: (a) => glocke(a, 39.4, 0.3),
      eSigma: 0.15,
      eMax: 0.35,
      iSigmaRad: 12 * GRAD,
      iMaxRad: 35 * GRAD,
    },
  ],
};

/**
 * Rayleigh-verteilter Wert σ·√(−2 ln u) mit Deckel: Werte über `max` werden
 * neu gezogen, damit die Form der Verteilung unterhalb erhalten bleibt
 * (Abschneiden würde am Deckel eine Häufung erzeugen). 1 − rng() liegt in
 * (0, 1], der Logarithmus bleibt endlich.
 */
function rayleigh(rng: () => number, sigma: number, max: number): number {
  for (;;) {
    const w = sigma * Math.sqrt(-2 * Math.log(1 - rng()));
    if (w <= max) return w;
  }
}

/** Halbachse per Verwerfungsmethode gegen die Dichte der Population. */
function halbachse(rng: () => number, pop: BeltPopulation): number {
  const [min, max] = pop.aBereich;
  for (;;) {
    const a = min + (max - min) * rng();
    if (rng() < pop.aDichte(a)) return a;
  }
}

/** Wählt eine Population nach Gewicht. */
function population(rng: () => number, spec: BeltSpec, gesamtGewicht: number): BeltPopulation {
  let rest = rng() * gesamtGewicht;
  for (const pop of spec.populationen) {
    rest -= pop.gewicht;
    if (rest < 0) return pop;
  }
  // Rundungsrest: die letzte Population
  return spec.populationen[spec.populationen.length - 1]!;
}

/**
 * Erzeugt `count` Bahnelemente nach `spec`, deterministisch aus `seed`.
 * Mittlere Bewegung n = √(GM/a³) nach Kepler-3, Epoche der mittleren
 * Anomalie ist J2000.
 */
export function generateBelt(spec: BeltSpec, count: number, seed: number): BeltElements {
  if (spec.populationen.length === 0) {
    throw new Error(`Gürtel ohne Population: ${spec.name}`);
  }
  const rng = createRng(seed);
  const gesamtGewicht = spec.populationen.reduce((s, p) => s + p.gewicht, 0);

  const a = new Float32Array(count);
  const e = new Float32Array(count);
  const inc = new Float32Array(count);
  const node = new Float32Array(count);
  const peri = new Float32Array(count);
  const m0 = new Float32Array(count);
  const n = new Float32Array(count);

  for (let k = 0; k < count; k++) {
    const pop = population(rng, spec, gesamtGewicht);
    const aK = halbachse(rng, pop);
    a[k] = aK;
    e[k] = rayleigh(rng, pop.eSigma, pop.eMax);
    inc[k] = rayleigh(rng, pop.iSigmaRad, pop.iMaxRad);
    node[k] = rng() * ZWEI_PI;
    peri[k] = rng() * ZWEI_PI;
    m0[k] = rng() * ZWEI_PI;
    n[k] = Math.sqrt(GM_SONNE_AE3_TAG2 / (aK * aK * aK));
  }

  return { count, a, e, inc, node, peri, m0, n };
}

/**
 * Teilchen je Gürtel und Qualitätsstufe. Die Zahlen stehen gespiegelt in
 * `QUALITY_SETTINGS.beltParticles` (app/quality.ts) — sim/ importiert
 * nichts aus app/, ein Test dort prüft die Gleichheit beider Tabellen.
 * `auto` verhält sich wie `medium`, wie beim Pixeldichte-Deckel in app/main.tsx.
 */
export const BELT_PARTICLES = {
  low: 0,
  medium: 10_000,
  high: 50_000,
} as const;

export function beltCount(tier: QualityTier): number {
  return BELT_PARTICLES[tier === 'auto' ? 'medium' : tier];
}
