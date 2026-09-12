import * as THREE from 'three';
import type { RenderContext } from './renderer';
import type { AppState } from '../store/types';

/**
 * Zielsignatur — sie bleibt bis Task 15 unverändert. Die Szene holt sich
 * Maßstab, Sichtbarkeiten und Kameramodus selbst aus dem übergebenen
 * Zustand, statt mit jedem Task einen weiteren Parameter zu bekommen.
 */
export interface SceneHandle {
  update: (jd: number, dt: number, state: AppState) => void;
}

/**
 * Baut die Szene auf. Vorerst nur eine emissive Kugel im Ursprung plus ein
 * Punktlicht, damit der Durchstich sichtbar wird — Task 10 ersetzt das
 * durch die tatsächlichen Körper.
 */
export function buildScene(ctx: RenderContext): SceneHandle {
  const sonne = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 32),
    new THREE.MeshBasicMaterial({ color: 0xffd9a0 }),
  );
  ctx.scene.add(sonne);
  ctx.scene.add(new THREE.PointLight(0xffffff, 1, 0, 2));

  return { update: () => { /* Task 10 füllt das */ } };
}
