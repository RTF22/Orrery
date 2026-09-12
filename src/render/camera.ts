import type { Vec3 } from '../sim/types';
import type { AppState } from '../store/types';

/**
 * Provisorische Kameraplatzierung für Task 10: eine feste Kugelkoordinate
 * um den Ursprung, gespeist aus den Store-Werten Distanz/Azimut/Elevation.
 * Task 14 ersetzt dies durch den vollständigen Controller mit Modi
 * (frei/angeheftet/verfolgend), Dämpfung und Eingabebehandlung.
 */
export function deriveCameraKm(camera: AppState['camera']): Vec3 {
  const { distance, azimuth, elevation } = camera;
  return {
    x: distance * Math.cos(elevation) * Math.cos(azimuth),
    y: distance * Math.cos(elevation) * Math.sin(azimuth),
    z: distance * Math.sin(elevation),
  };
}
