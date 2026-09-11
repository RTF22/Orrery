export type CameraMode = 'free' | 'attached' | 'follow';
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
    bloom: boolean; brightness: number; lightFalloff: number;
  };
  camera: {
    mode: CameraMode; targetId: string;
    distance: number; azimuth: number; elevation: number;
  };
  /** Nur Abweichungen vom Standard „sichtbar" — siehe toggleVisible in index.ts. */
  visible: Record<string, boolean>;
  quality: { tier: QualityTier };
  ui: { hidden: boolean; panels: Record<string, boolean>; language: 'de' };
}
