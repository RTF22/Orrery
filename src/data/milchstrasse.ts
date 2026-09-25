// Stufen der Himmelskarte (Entwurf Phase 6 §3.3), gebaut von scripts/milchstrasse-bauen.ts.

export interface HimmelStufe {
  /** Breite in Pixeln; die Höhe ist die Hälfte. */
  readonly breite: number;
  /** Pfad relativ zur Basis der Anwendung. */
  readonly pfad: string;
}

/** Aufsteigend nach Breite; die erste Stufe lädt zuerst (render/milchstrasse.ts). */
export const MILCHSTRASSE_STUFEN: readonly HimmelStufe[] = [
  { breite: 1024, pfad: 'textures/milchstrasse/himmel-1024.ktx2' },
  { breite: 2048, pfad: 'textures/milchstrasse/himmel-2048.ktx2' },
  { breite: 8192, pfad: 'textures/milchstrasse/himmel-8192.ktx2' },
];
