export type CameraMode = 'free' | 'attached' | 'follow' | 'cinema';
export type QualityTier = 'auto' | 'low' | 'medium' | 'high';

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
  };
}
