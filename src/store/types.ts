import type { Niveau } from '../data/themen';

export type CameraMode = 'free' | 'attached' | 'follow' | 'cinema';
export type QualityTier = 'auto' | 'low' | 'medium' | 'high';

/**
 * Grenzen des Infopanels (Entwurf 4c §3.2, §4.6). Zwillinge der Griffe in
 * ui/info/Griff.tsx und der Bereiche in store/pruefer.ts. Die Obergrenze
 * der Breite ist absichtlich weit; die wirksame Obergrenze (60 % der
 * Fensterbreite) rechnet das Panel selbst aus.
 */
export const INFO_BREITE_MIN_REM = 18;
export const INFO_BREITE_MAX_REM = 200;
export const INFO_TEILUNG_MIN = 0.2;
export const INFO_TEILUNG_MAX = 0.9;

/**
 * Der gesamte einstellbare Zustand der Anwendung — eine einzige serialisierbare
 * Wahrheitsquelle. Presets, geteilte URLs und die Sitzungswiederherstellung sind
 * deshalb keine drei Funktionen, sondern dreimal dieselbe Serialisierung.
 */
export interface AppState {
  time: { jd: number; rateDaysPerSec: number; paused: boolean };
  scale: { sizeScale: number; distanceExponent: number; sunDamping: number; preset: string | null };
  display: {
    orbits: boolean; labels: boolean; markers: boolean;
    /** Asteroiden- und Kuipergürtel als Punktwolken (render/belts.ts). */
    belts: boolean;
    /** Analytische Kugel-/Ring-Okkluder und Kernschattenfarbe (render/shadows.ts). */
    shadows: boolean;
    bloom: boolean; brightness: number; lightFalloff: number;
    /**
     * Fülllicht der Nachtseite als Bruchteil des Tagniveaus desselben
     * Körpers, und der Ausgleich des Abstandsabfalls (0 = physikalisch,
     * 1 = alle Körper gleich hell) — siehe render/lighting.ts.
     */
    nightFill: number; lightCompensation: number;
  };
  camera: {
    mode: CameraMode; targetId: string;
    distance: number; azimuth: number; elevation: number;
    /**
     * Nur für den freien Modus: der Zeitpunkt, zu dem der Bezugspunkt
     * eingefroren wurde. Gespeichert wird der Zeitpunkt und nicht die
     * Koordinate, damit der Punkt bei einem Maßstabswechsel mitskaliert.
     * `null` bedeutet „aktuelle Position" — beim Standardziel Sonne, die im
     * Ursprung ruht, ist das ohnehin derselbe Punkt.
     */
    freezeJd: number | null;
  };
  /**
   * Der Kino-Modus. `nummer` und `elapsedSec` beschreiben die Stelle im
   * endlosen Film; zusammen mit `seed` und `shuffle` ist der Film dadurch
   * vollständig reproduzierbar, ohne dass eine Playlist gespeichert wird.
   */
  cinema: {
    running: boolean;
    nummer: number;
    elapsedSec: number;
    seed: number;
    shuffle: boolean;
    /** Hält der Kino-Modus bei einer Nutzereingabe an? */
    pauseOnInput: boolean;
    /** Nach so vielen Sekunden ohne Eingabe läuft er wieder an. */
    idleResumeSec: number;
  };
  /** Nur Abweichungen vom Standard „sichtbar" — siehe toggleVisible in index.ts. */
  visible: Record<string, boolean>;
  quality: { tier: QualityTier };
  ui: {
    hidden: boolean;
    panels: Record<string, boolean>;
    /** Muss mit `Sprache` in ui/i18n/index.ts übereinstimmen; i18n.test.ts prüft die Tabellen. */
    language: 'de' | 'en';
    /**
     * Infopanel (Entwurf 4c §4.6): Niveaustufe der Texte, Breite der
     * rechten Spalte in rem, Anteil des oberen Segments (0,2 bis 0,9) und
     * ein per Verweis gewähltes Thema, das bis zum nächsten Ziel- oder
     * Szenenwechsel den Text stellt.
     */
    info: { niveau: Niveau; breiteRem: number; teilung: number; thema: string | null };
  };
}
