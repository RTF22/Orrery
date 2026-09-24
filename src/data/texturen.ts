// Erzeugt von scripts/texturen-bauen.ts (npm run texturen) — nicht von Hand ändern.
// Stufen der Albedokarten je Körper mit gemessenem Mittel (Entwurf Phase 5 §5.2, §5.3).

export interface TexturStufe {
  /** Breite in Pixeln; die Höhe ist die Hälfte. */
  readonly breite: number;
  /** Pfad relativ zur Basis der Anwendung. */
  readonly pfad: string;
  /** Mittlere lineare Reflexion dieser Stufe (scripts/textur-stufe.py mittel). */
  readonly mittel: number;
}

/** Stufen je Körper-ID, aufsteigend nach Breite. Körper ohne Eintrag behalten ihre Ausweichfarbe. */
export const TEXTUREN: Readonly<Record<string, readonly TexturStufe[]>> = {
  callisto: [
    { breite: 1024, pfad: 'textures/callisto/albedo-1024.ktx2', mittel: 0.0289 },
  ],
  ceres: [
    { breite: 1024, pfad: 'textures/ceres/albedo-1024.ktx2', mittel: 0.2745 },
  ],
  charon: [
    { breite: 1024, pfad: 'textures/charon/albedo-1024.ktx2', mittel: 0.2108 },
  ],
  dione: [
    { breite: 1024, pfad: 'textures/dione/albedo-1024.ktx2', mittel: 0.3095 },
  ],
  earth: [
    { breite: 1024, pfad: 'textures/earth/albedo-1024.ktx2', mittel: 0.1333 },
    { breite: 2048, pfad: 'textures/earth/albedo-2048.ktx2', mittel: 0.1338 },
    { breite: 8192, pfad: 'textures/earth/albedo-8192.ktx2', mittel: 0.1335 },
  ],
  enceladus: [
    { breite: 1024, pfad: 'textures/enceladus/albedo-1024.ktx2', mittel: 0.1723 },
  ],
  eris: [
    { breite: 1024, pfad: 'textures/eris/albedo-1024.ktx2', mittel: 0.3776 },
  ],
  europa: [
    { breite: 1024, pfad: 'textures/europa/albedo-1024.ktx2', mittel: 0.3597 },
  ],
  ganymede: [
    { breite: 1024, pfad: 'textures/ganymede/albedo-1024.ktx2', mittel: 0.2891 },
  ],
  haumea: [
    { breite: 1024, pfad: 'textures/haumea/albedo-1024.ktx2', mittel: 0.2996 },
  ],
  iapetus: [
    { breite: 1024, pfad: 'textures/iapetus/albedo-1024.ktx2', mittel: 0.1084 },
  ],
  io: [
    { breite: 1024, pfad: 'textures/io/albedo-1024.ktx2', mittel: 0.2395 },
  ],
  jupiter: [
    { breite: 1024, pfad: 'textures/jupiter/albedo-1024.ktx2', mittel: 0.4027 },
    { breite: 2048, pfad: 'textures/jupiter/albedo-2048.ktx2', mittel: 0.4024 },
    { breite: 4096, pfad: 'textures/jupiter/albedo-4096.ktx2', mittel: 0.3998 },
  ],
  makemake: [
    { breite: 1024, pfad: 'textures/makemake/albedo-1024.ktx2', mittel: 0.3329 },
  ],
  mars: [
    { breite: 1024, pfad: 'textures/mars/albedo-1024.ktx2', mittel: 0.2115 },
    { breite: 2048, pfad: 'textures/mars/albedo-2048.ktx2', mittel: 0.2111 },
    { breite: 8192, pfad: 'textures/mars/albedo-8192.ktx2', mittel: 0.2103 },
  ],
  mercury: [
    { breite: 1024, pfad: 'textures/mercury/albedo-1024.ktx2', mittel: 0.2281 },
    { breite: 2048, pfad: 'textures/mercury/albedo-2048.ktx2', mittel: 0.2285 },
    { breite: 8192, pfad: 'textures/mercury/albedo-8192.ktx2', mittel: 0.2277 },
  ],
  mimas: [
    { breite: 1024, pfad: 'textures/mimas/albedo-1024.ktx2', mittel: 0.1709 },
  ],
  moon: [
    { breite: 1024, pfad: 'textures/moon/albedo-1024.ktx2', mittel: 0.3122 },
    { breite: 2048, pfad: 'textures/moon/albedo-2048.ktx2', mittel: 0.3124 },
    { breite: 8192, pfad: 'textures/moon/albedo-8192.ktx2', mittel: 0.3113 },
  ],
  neptune: [
    { breite: 1024, pfad: 'textures/neptune/albedo-1024.ktx2', mittel: 0.2088 },
    { breite: 2048, pfad: 'textures/neptune/albedo-2048.ktx2', mittel: 0.2085 },
  ],
  phobos: [
    { breite: 1024, pfad: 'textures/phobos/albedo-1024.ktx2', mittel: 0.2724 },
  ],
  pluto: [
    { breite: 1024, pfad: 'textures/pluto/albedo-1024.ktx2', mittel: 0.1789 },
  ],
  rhea: [
    { breite: 1024, pfad: 'textures/rhea/albedo-1024.ktx2', mittel: 0.1732 },
  ],
  saturn: [
    { breite: 1024, pfad: 'textures/saturn/albedo-1024.ktx2', mittel: 0.5788 },
    { breite: 2048, pfad: 'textures/saturn/albedo-2048.ktx2', mittel: 0.5785 },
    { breite: 4096, pfad: 'textures/saturn/albedo-4096.ktx2', mittel: 0.5767 },
  ],
  sun: [
    { breite: 1024, pfad: 'textures/sun/albedo-1024.ktx2', mittel: 0.3798 },
    { breite: 2048, pfad: 'textures/sun/albedo-2048.ktx2', mittel: 0.3815 },
    { breite: 4096, pfad: 'textures/sun/albedo-4096.ktx2', mittel: 0.3802 },
  ],
  tethys: [
    { breite: 1024, pfad: 'textures/tethys/albedo-1024.ktx2', mittel: 0.296 },
  ],
  titan: [
    { breite: 1024, pfad: 'textures/titan/albedo-1024.ktx2', mittel: 0.2862 },
  ],
  triton: [
    { breite: 1024, pfad: 'textures/triton/albedo-1024.ktx2', mittel: 0.2998 },
  ],
  uranus: [
    { breite: 1024, pfad: 'textures/uranus/albedo-1024.ktx2', mittel: 0.5454 },
    { breite: 2048, pfad: 'textures/uranus/albedo-2048.ktx2', mittel: 0.5429 },
  ],
  venus: [
    { breite: 1024, pfad: 'textures/venus/albedo-1024.ktx2', mittel: 0.2672 },
    { breite: 2048, pfad: 'textures/venus/albedo-2048.ktx2', mittel: 0.2672 },
    { breite: 8192, pfad: 'textures/venus/albedo-8192.ktx2', mittel: 0.2662 },
  ],
};
