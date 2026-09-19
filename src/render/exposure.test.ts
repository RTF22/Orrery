import { describe, it, expect } from 'vitest';
import {
  exposureTargetId, exposureFor, createExposureMeter, EXPOSURE_ZEITKONSTANTE_S,
} from './exposure';
import { targetExposure } from './lighting';
import { DEFAULT_STATE } from '../store';
import type { AppState } from '../store/types';
import { SCENES } from '../data/scenes';
import { bodyIndex } from '../data/index';
import { scaledPositionAt, SCALE_PRESETS } from '../sim/scale';
import { J2000 } from '../sim/time';

function mitKamera(patch: Partial<AppState['camera']>, scale = DEFAULT_STATE.scale): AppState {
  return { ...DEFAULT_STATE, scale, camera: { ...DEFAULT_STATE.camera, ...patch } };
}

describe('exposureTargetId', () => {
  it('nimmt im freien, gehefteten und folgenden Modus den Kamerazielkörper', () => {
    for (const mode of ['free', 'attached', 'follow'] as const) {
      expect(exposureTargetId(mitKamera({ mode, targetId: 'neptune' }))).toBe('neptune');
    }
  });

  it('nimmt im Kino-Modus den angesehenen Körper der geplanten Szene, sonst den Standort', () => {
    // Ohne Mischen ist Szene Nr. n der Eintrag n des Katalogs (sceneIndexFor).
    for (let n = 0; n < SCENES.length; n++) {
      const szene = SCENES[n]!;
      const state: AppState = {
        ...mitKamera({ mode: 'cinema' }),
        cinema: { ...DEFAULT_STATE.cinema, running: true, shuffle: false, nummer: n },
      };
      expect(exposureTargetId(state), szene.id).toBe(szene.lookAtId ?? szene.targetId);
    }
  });

  it('nimmt im Flug den Bezugskörper', () => {
    expect(exposureTargetId(mitKamera({
      mode: 'fly', targetId: 'sun', fly: { ...DEFAULT_STATE.camera.fly, refId: 'saturn' },
    }))).toBe('saturn');
  });
});

describe('exposureFor', () => {
  it('belichtet bei Ziel Sonne auf die Referenz 1 AE: Faktor π', () => {
    expect(exposureFor(mitKamera({ targetId: 'sun' }), J2000)).toBeCloseTo(Math.PI, 12);
  });

  it('belichtet auf den dargestellten Sonnenabstand des Ziels', () => {
    const s = SCALE_PRESETS.realistisch;
    const state = mitKamera({ mode: 'attached', targetId: 'neptune' }, { ...s, preset: 'realistisch' });
    const p = scaledPositionAt('neptune', bodyIndex, J2000, s);
    const erwartet = targetExposure(Math.hypot(p.x, p.y, p.z), state.display);
    expect(exposureFor(state, J2000)).toBeCloseTo(erwartet, 10);
    expect(erwartet).toBeGreaterThan(Math.PI);
  });
});

describe('createExposureMeter — Adaption', () => {
  const sonne = mitKamera({ targetId: 'sun' });
  const neptun = mitKamera(
    { mode: 'attached', targetId: 'neptune' },
    { ...SCALE_PRESETS.realistisch, preset: 'realistisch' },
  );

  it('startet ohne Anlauf genau auf dem Sollwert des ersten Frames', () => {
    const messer = createExposureMeter();
    expect(messer.update(neptun, J2000, 0.016)).toBeCloseTo(exposureFor(neptun, J2000), 12);
  });

  it('nähert sich einem neuen Ziel monoton und ist nach fünf Zeitkonstanten angekommen', () => {
    const messer = createExposureMeter();
    messer.update(sonne, J2000, 0.016);
    const ziel = exposureFor(neptun, J2000);
    let vorher = Math.PI;
    const schritte = Math.ceil((5 * EXPOSURE_ZEITKONSTANTE_S) / 0.016);
    let wert = vorher;
    for (let i = 0; i < schritte; i++) {
      wert = messer.update(neptun, J2000, 0.016);
      expect(wert).toBeGreaterThanOrEqual(vorher - 1e-12);
      vorher = wert;
    }
    expect(Math.abs(wert / ziel - 1)).toBeLessThan(0.01);
  });

  it('dämpft im logarithmischen Raum: hoch und runter laufen spiegelbildlich', () => {
    // Zwei Messer, beide starten bei π (Ziel Sonne). Einer wechselt auf Neptun
    // (Sollwert über π), der andere auf Merkur (Sollwert unter π). Nach
    // derselben Zeit muss der zurückgelegte Anteil des Weges IM LOG-RAUM gleich
    // sein — sonst rast der eine und kriecht der andere. Der Helligkeitsregler
    // taugt hier nicht als Hebel, weil er nicht in die Belichtung eingeht
    // (siehe Test „hängt nicht von der Helligkeit ab" in lighting.test.ts).
    const hoch = createExposureMeter();
    const runter = createExposureMeter();
    hoch.update(sonne, J2000, 0.016);
    runter.update(sonne, J2000, 0.016);
    const realistisch = { ...SCALE_PRESETS.realistisch, preset: 'realistisch' };
    const zHoch = mitKamera({ mode: 'attached', targetId: 'neptune' }, realistisch);
    const zRunter = mitKamera({ mode: 'attached', targetId: 'mercury' }, realistisch);
    const sollHoch = exposureFor(zHoch, J2000);
    const sollRunter = exposureFor(zRunter, J2000);
    expect(sollHoch).toBeGreaterThan(Math.PI);
    expect(sollRunter).toBeLessThan(Math.PI);
    let wHoch = Math.PI;
    let wRunter = Math.PI;
    for (let i = 0; i < 20; i++) {
      wHoch = hoch.update(zHoch, J2000, 0.016);
      wRunter = runter.update(zRunter, J2000, 0.016);
    }
    const anteilHoch = Math.log(wHoch / Math.PI) / Math.log(sollHoch / Math.PI);
    const anteilRunter = Math.log(wRunter / Math.PI) / Math.log(sollRunter / Math.PI);
    expect(anteilHoch).toBeGreaterThan(0);
    expect(anteilHoch).toBeLessThan(1);
    expect(anteilRunter).toBeCloseTo(anteilHoch, 10);
  });
});
