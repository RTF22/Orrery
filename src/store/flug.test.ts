import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from './index';

describe('Standard-Fluglage', () => {
  it('entspricht der Startansicht: Lage auf dem Kugelpunkt, Blick zur Sonne', () => {
    const { camera } = DEFAULT_STATE;
    const { fly } = camera;
    expect(fly.refId).toBe('sun');
    expect(Math.hypot(fly.x, fly.y, fly.z)).toBeCloseTo(camera.distance, 0);
    const blick = [
      Math.cos(fly.pitch) * Math.cos(fly.yaw),
      Math.cos(fly.pitch) * Math.sin(fly.yaw),
      Math.sin(fly.pitch),
    ];
    const zurSonne = [-fly.x, -fly.y, -fly.z].map((v) => v / camera.distance);
    blick.forEach((b, i) => { expect(b).toBeCloseTo(zurSonne[i]!, 12); });
  });
});
