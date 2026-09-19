import { describe, it, expect } from 'vitest';
import {
  blickVektor, rechtsVektor, obenVektor, blickAus, koerperStaende, waehleBezug, hoehe,
  fluggeschwindigkeit, mindesthoehe, laenge, plus, mal, punkt, kreuz, ELEVATION_GRENZE,
  koerperNaechstDerMitte, kugelUm, flugSchritt, blickDrehen, minus, normiert,
  MIN_DISTANCE_KM, MAX_DISTANCE_KM, EINFLUSS_DECKEL,
} from './flug';
import type { KoerperStand } from './flug';
import type { Pose } from './flug';
import { DEFAULT_STATE } from '../../store';
import { bodies, bodyIndex } from '../../data/index';
import { scaledPositionAt, scaledRadius, SCALE_PRESETS } from '../../sim/scale';
import { AU_KM } from '../../sim/orbit';

const jd = DEFAULT_STATE.time.jd;
const s = DEFAULT_STATE.scale;
const lage = (id: string) => scaledPositionAt(id, bodyIndex, jd, s);
const radius = (id: string) => scaledRadius(bodyIndex[id]!, s);

describe('Kameraachsen', () => {
  it('bilden für beliebige Blickrichtungen ein Rechtssystem aus Einheitsvektoren', () => {
    for (const [yaw, pitch] of [[0, 0], [1.3, 0.4], [-2.8, -1.1], [7, 1.5]] as const) {
      const f = blickVektor({ yaw, pitch });
      const r = rechtsVektor({ yaw, pitch });
      const u = obenVektor({ yaw, pitch });
      for (const v of [f, r, u]) expect(laenge(v)).toBeCloseTo(1, 12);
      expect(punkt(f, r)).toBeCloseTo(0, 12);
      expect(punkt(f, u)).toBeCloseTo(0, 12);
      expect(punkt(r, u)).toBeCloseTo(0, 12);
      const k = kreuz(r, f);
      expect(k.x).toBeCloseTo(u.x, 12);
      expect(k.y).toBeCloseTo(u.y, 12);
      expect(k.z).toBeCloseTo(u.z, 12);
    }
  });

  it('hält rechts waagerecht und oben bei waagerechtem Blick auf Ekliptik-Nord', () => {
    const r = rechtsVektor({ yaw: 0, pitch: 0.7 });
    expect(r.x).toBeCloseTo(0, 12);
    expect(r.y).toBeCloseTo(-1, 12);
    expect(r.z).toBe(0);
    const u = obenVektor({ yaw: 2, pitch: 0 });
    expect(u.x).toBeCloseTo(0, 12);
    expect(u.y).toBeCloseTo(0, 12);
    expect(u.z).toBeCloseTo(1, 12);
  });

  it('rechnet Blickrichtungen hin und zurück und begrenzt pitch', () => {
    const b = blickAus(blickVektor({ yaw: 1.2, pitch: -0.3 }));
    expect(b.yaw).toBeCloseTo(1.2, 12);
    expect(b.pitch).toBeCloseTo(-0.3, 12);
    expect(blickAus({ x: 0, y: 0, z: 5 }).pitch).toBe(ELEVATION_GRENZE);
    expect(blickAus({ x: 0, y: 0, z: -5 }).pitch).toBe(-ELEVATION_GRENZE);
  });
});

describe('koerperStaende', () => {
  it('liefert dargestellte Lage und Radius aller sichtbaren Körper', () => {
    const staende = koerperStaende(bodies, bodyIndex, jd, s, { moon: false });
    expect(staende).toHaveLength(bodies.length - 1);
    expect(staende.some((k) => k.id === 'moon')).toBe(false);
    expect(staende.find((k) => k.id === 'sun')!.radius).toBeCloseTo(radius('sun'), 6);
    expect(staende.find((k) => k.id === 'mars')!.pos).toEqual(lage('mars'));
  });
});

describe('waehleBezug', () => {
  const staende = koerperStaende(bodies, bodyIndex, jd, s, {});

  it('nimmt zwischen den Planeten die Sonne', () => {
    const mitte = mal(plus(lage('earth'), lage('mars')), 0.5);
    expect(waehleBezug(mitte, staende, null)).toBe('sun');
  });

  it('nimmt in Erdnähe die Erde und dicht am Mond den Mond', () => {
    expect(waehleBezug(plus(lage('earth'), { x: 3 * radius('earth'), y: 0, z: 0 }), staende, null)).toBe('earth');
    expect(waehleBezug(plus(lage('moon'), { x: 0, y: 0, z: 1.5 * radius('moon') }), staende, null)).toBe('moon');
  });

  it('wechselt erst unter vier Fünfteln des bisherigen Maßes (Rückstellbereich)', () => {
    const zwei: KoerperStand[] = [
      { id: 'a', pos: { x: 0, y: 0, z: 0 }, radius: 1 },
      { id: 'b', pos: { x: 10, y: 0, z: 0 }, radius: 1 },
    ];
    expect(waehleBezug({ x: 4.9, y: 0, z: 0 }, zwei, null)).toBe('a');
    expect(waehleBezug({ x: 4.9, y: 0, z: 0 }, zwei, 'b')).toBe('b');
    expect(waehleBezug({ x: 4, y: 0, z: 0 }, zwei, 'b')).toBe('a');
  });

  it('wählt ohne Rückstellbereich, wenn der bisherige Bezug fehlt (ausgeblendet)', () => {
    const ohneErde = koerperStaende(bodies, bodyIndex, jd, s, { earth: false });
    const nahErde = plus(lage('earth'), { x: 3 * radius('earth'), y: 0, z: 0 });
    expect(waehleBezug(nahErde, ohneErde, 'earth')).toBe('sun');
  });

  it('liefert ohne Körper null', () => {
    expect(waehleBezug({ x: 0, y: 0, z: 0 }, [], 'sun')).toBeNull();
  });
});

describe('waehleBezug nach Systemen (Nachtrag §13.1)', () => {
  const staende = koerperStaende(bodies, bodyIndex, jd, s, {});
  const erdeStand = staende.find((k) => k.id === 'earth')!;

  it('gibt Sonnenumläufern den Einflussbereich: Hill-Radius mal sizeScale, höchstens der halbe Sonnenabstand', () => {
    const e = bodyIndex.earth!;
    const hill = e.orbit!.a * AU_KM * Math.cbrt(e.physical.massKg / (3 * bodyIndex.sun!.physical.massKg));
    const real = koerperStaende([e], bodyIndex, jd, SCALE_PRESETS.realistisch, {})[0]!;
    expect(real.einfluss! / hill).toBeCloseTo(1, 12);
    const kompakt = koerperStaende([e], bodyIndex, jd, SCALE_PRESETS.kompakt, {})[0]!;
    const deckel = EINFLUSS_DECKEL * laenge(scaledPositionAt('earth', bodyIndex, jd, SCALE_PRESETS.kompakt));
    expect(kompakt.einfluss! / deckel).toBeCloseTo(1, 12);
    expect(erdeStand.mutter).toBe('sun');
    const mond = staende.find((k) => k.id === 'moon')!;
    expect(mond.mutter).toBe('earth');
    expect(mond.einfluss).toBeUndefined();
    expect(staende.find((k) => k.id === 'sun')!.einfluss).toBeUndefined();
  });

  it('bleibt zwischen Erde und Mond bei der Erde und nimmt dicht vor dem Mond den Mond', () => {
    const erde = lage('earth');
    const mond = lage('moon');
    const richtung = normiert(minus(mond, erde));
    const d = laenge(minus(mond, erde)) / radius('earth');
    const auf = (erdradien: number) => plus(erde, mal(richtung, erdradien * radius('earth')));
    // Vor dem Nachtrag gewann hier ab rund 15 Erdradien die Sonne.
    expect(waehleBezug(auf(30), staende, null)).toBe('earth');
    expect(waehleBezug(auf(30), staende, 'earth')).toBe('earth');
    // Bisher Erde: Der Mond gewinnt erst unter vier Fünfteln des Erdmaßes, rund 11 Erdradien vor ihm.
    expect(waehleBezug(auf(d - 12), staende, 'earth')).toBe('earth');
    expect(waehleBezug(auf(d - 8), staende, 'earth')).toBe('moon');
  });

  it('verlässt das Erdsystem erst jenseits des Rückstellbereichs und tritt unter 1 ein', () => {
    const aussen = normiert(erdeStand.pos);
    const bei = (t: number) => plus(erdeStand.pos, mal(aussen, t * erdeStand.einfluss!));
    expect(waehleBezug(bei(0.9), staende, 'sun')).toBe('earth');
    expect(waehleBezug(bei(1.1), staende, 'sun')).toBe('sun');
    expect(waehleBezug(bei(1.1), staende, 'earth')).toBe('earth');
    expect(waehleBezug(bei(1.3), staende, 'earth')).toBe('sun');
  });

  it('nimmt bei überlappenden Bereichen das tiefere System, ein bisheriges erst unter vier Fünfteln', () => {
    const zwei: KoerperStand[] = [
      { id: 'stern', pos: { x: 0, y: 0, z: 0 }, radius: 100, mutter: null },
      { id: 'a', pos: { x: 1000, y: 0, z: 0 }, radius: 1, mutter: 'stern', einfluss: 50 },
      { id: 'b', pos: { x: 1060, y: 0, z: 0 }, radius: 1, mutter: 'stern', einfluss: 40 },
      { id: 'am', pos: { x: 1010, y: 0, z: 0 }, radius: 0.5, mutter: 'a' },
    ];
    // x = 1035: Tiefe in a 35/50 = 0,7, in b 25/40 = 0,625.
    expect(waehleBezug({ x: 1035, y: 0, z: 0 }, zwei, null)).toBe('b');
    expect(waehleBezug({ x: 1035, y: 0, z: 0 }, zwei, 'a')).toBe('a');
    // x = 1045: in a 0,9, in b 0,375 < 0,8 · 0,9 — auch vom Mond am aus gewinnt b.
    expect(waehleBezug({ x: 1045, y: 0, z: 0 }, zwei, 'am')).toBe('b');
  });

  it('lässt Monde eines ausgeblendeten Mutterkörpers auf oberster Ebene mitbewerben', () => {
    const ohneErde = koerperStaende(bodies, bodyIndex, jd, s, { earth: false });
    expect(waehleBezug(plus(lage('moon'), { x: 0, y: 0, z: 1.5 * radius('moon') }), ohneErde, null)).toBe('moon');
  });
});

describe('Höhe, Geschwindigkeit, Mindesthöhe', () => {
  const einer: KoerperStand[] = [{ id: 'k', pos: { x: 0, y: 0, z: 0 }, radius: 10 }];

  it('misst die Höhe über der nächsten Oberfläche', () => {
    expect(hoehe({ x: 110, y: 0, z: 0 }, einer)).toEqual({ h: 100, radius: 10 });
  });

  it('fliegt mit Tempo mal Höhe, dicht über der Oberfläche mit der Untergrenze', () => {
    expect(fluggeschwindigkeit({ x: 110, y: 0, z: 0 }, einer, 0.5)).toBeCloseTo(50, 12);
    // Höhe 0,1 liegt unter 0,05 · 10 = 0,5.
    expect(fluggeschwindigkeit({ x: 10.1, y: 0, z: 0 }, einer, 0.5)).toBeCloseTo(0.25, 12);
    expect(fluggeschwindigkeit({ x: 1, y: 0, z: 0 }, [], 0.5)).toBe(0);
  });

  it('schiebt eine Lage im Körper radial auf 1,05 Radien hinaus', () => {
    const q = mindesthoehe({ x: 5, y: 0, z: 0 }, einer);
    expect(q.x).toBeCloseTo(10.5, 12);
    expect(q.y).toBe(0);
    expect(q.z).toBe(0);
    expect(mindesthoehe({ x: 0, y: 0, z: 0 }, einer)).toEqual({ x: 0, y: 0, z: 10.5 });
    const aussen = { x: 20, y: 0, z: 0 };
    expect(mindesthoehe(aussen, einer)).toBe(aussen);
  });
});

describe('koerperNaechstDerMitte', () => {
  const pose: Pose = { positionKm: { x: 0, y: 0, z: 0 }, blick: { x: 1, y: 0, z: 0 } };
  const k = (id: string, x: number, y: number, r: number): KoerperStand => ({ id, pos: { x, y, z: 0 }, radius: r });

  it('zieht eine Scheibe auf der Blickachse dem kleineren Winkel vor', () => {
    // b steht näher an der Achse als die Mitte von a, aber nur a bedeckt die Bildmitte.
    expect(koerperNaechstDerMitte(pose, [k('a', 100, 8, 10), k('b', 50, 2, 0.5)])).toBe('a');
  });

  it('nimmt von zwei Scheiben auf der Achse die vordere', () => {
    expect(koerperNaechstDerMitte(pose, [k('fern', 100, 0, 10), k('nah', 50, 0, 1)])).toBe('nah');
  });

  it('nimmt sonst den kleinsten Winkel', () => {
    expect(koerperNaechstDerMitte(pose, [k('h', 100, 20, 1), k('g', 100, 10, 1)])).toBe('g');
  });

  it('übergeht Körper hinter der Kamera und den, in dem die Kamera steckt', () => {
    expect(koerperNaechstDerMitte(pose, [k('hinten', -10, 0, 1), k('innen', 0, 0, 5)])).toBeNull();
    expect(koerperNaechstDerMitte(pose, [k('innen', 0, 0, 5), k('f', 100, 50, 1)])).toBe('f');
  });

  it('wählt mit echten Daten den Mars, wenn die Bildmitte auf seiner Scheibe liegt', () => {
    const mars = lage('mars');
    const von = plus(mars, { x: 2e7, y: 0, z: 0 });
    // 1·10⁵ km neben der Mitte, innerhalb des dargestellten Radius (rund 1,7·10⁵ km).
    const blick = normiert(minus(plus(mars, { x: 0, y: 1e5, z: 0 }), von));
    const staende = koerperStaende(bodies, bodyIndex, jd, s, { phobos: false, deimos: false });
    expect(koerperNaechstDerMitte({ positionKm: von, blick }, staende)).toBe('mars');
  });
});

describe('kugelUm', () => {
  it('liefert Abstand, Azimut und Elevation der Lage um einen Körper', () => {
    const koerper = { x: 5e7, y: -3e7, z: 1e6 };
    const d = 2e6;
    const az = 2.5;
    const el = -0.4;
    const p = plus(koerper, {
      x: d * Math.cos(el) * Math.cos(az), y: d * Math.cos(el) * Math.sin(az), z: d * Math.sin(el),
    });
    const kugel = kugelUm(p, koerper);
    expect(kugel.distance).toBeCloseTo(d, 3);
    expect(kugel.azimuth).toBeCloseTo(az, 9);
    expect(kugel.elevation).toBeCloseTo(el, 9);
  });

  it('bleibt in den Grenzen der Orbit-Eingabe', () => {
    const o = { x: 0, y: 0, z: 0 };
    expect(kugelUm({ x: 0, y: 0, z: 1e6 }, o).elevation).toBe(ELEVATION_GRENZE);
    expect(kugelUm({ x: 10, y: 0, z: 0 }, o).distance).toBe(MIN_DISTANCE_KM);
    expect(kugelUm({ x: 1e14, y: 0, z: 0 }, o).distance).toBe(MAX_DISTANCE_KM);
  });
});

describe('flugSchritt', () => {
  const p = { x: 1, y: 2, z: 3 };
  const b = { yaw: 0, pitch: 0 };

  it('fliegt mit W in Blickrichtung, mit D nach rechts, mit E nach oben', () => {
    expect(flugSchritt(p, b, { vor: 1, seit: 0, hoch: 0 }, 10, 0.5)).toEqual({ x: 6, y: 2, z: 3 });
    const rechts = flugSchritt(p, b, { vor: 0, seit: 1, hoch: 0 }, 10, 0.5);
    expect(rechts.x).toBeCloseTo(1, 12);
    expect(rechts.y).toBeCloseTo(-3, 12);
    const oben = flugSchritt(p, b, { vor: 0, seit: 0, hoch: 1 }, 10, 0.5);
    expect(oben.z).toBeCloseTo(8, 12);
  });

  it('fliegt schräg nicht schneller', () => {
    const q = flugSchritt(p, b, { vor: 1, seit: 1, hoch: 0 }, 10, 1);
    expect(laenge(minus(q, p))).toBeCloseTo(10, 12);
  });

  it('bleibt ohne Absicht stehen', () => {
    expect(flugSchritt(p, b, { vor: 0, seit: 0, hoch: 0 }, 10, 1)).toBe(p);
  });
});

describe('blickDrehen', () => {
  it('dreht yaw frei und begrenzt pitch', () => {
    expect(blickDrehen({ yaw: 3, pitch: 1.5 }, 4, 0.2)).toEqual({ yaw: 7, pitch: ELEVATION_GRENZE });
    expect(blickDrehen({ yaw: 0, pitch: 0 }, -1, -0.3)).toEqual({ yaw: -1, pitch: -0.3 });
  });
});
