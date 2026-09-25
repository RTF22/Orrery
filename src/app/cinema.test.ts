import { describe, it, expect } from 'vitest';
import { advanceCinema, blendedRate, RATE_BLEND_SEC, tickCinema, szenenBeginn } from './cinema';
import { DEFAULT_STATE, useStore } from '../store';
import { naechsteMondfinsternis } from '../sim/finsternis';
import { bodyIndex } from '../data/index';
import { J2000, JD_MAX } from '../sim/time';
import { SCENES } from '../data/scenes';
import { plannedSceneAt } from '../sim/director';

const basis = { ...DEFAULT_STATE.cinema, running: true };

describe('advanceCinema', () => {
  it('zählt die verstrichene Zeit hoch', () => {
    const nachher = advanceCinema(basis, 0.5);
    expect(nachher.elapsedSec).toBeCloseTo(0.5, 9);
    expect(nachher.nummer).toBe(0);
  });

  it('schaltet nach Ablauf der Szenendauer weiter', () => {
    const dauer = plannedSceneAt(0, SCENES, basis.seed, basis.shuffle).scene.durationSec;
    const nachher = advanceCinema({ ...basis, elapsedSec: dauer - 0.01 }, 0.02);
    expect(nachher.nummer).toBe(1);
    // Der Überhang geht nicht verloren, sonst driftete der Film.
    expect(nachher.elapsedSec).toBeCloseTo(0.01, 6);
  });

  it('überspringt bei einem sehr großen Zeitschritt höchstens eine Szene', () => {
    // Nach einem Tabwechsel kommt ein Riesenschritt an; er darf nicht durch
    // zwanzig Szenen springen.
    const nachher = advanceCinema(basis, 3600);
    expect(nachher.nummer).toBe(1);
  });

  it('rührt nichts an, solange der Kino-Modus aus ist', () => {
    const aus = { ...basis, running: false };
    expect(advanceCinema(aus, 5)).toEqual(aus);
  });

  it('schreibt beim Wechsel die normalisierte Nummer zurück, nicht die alte plus eins', () => {
    // 2,5 normalisiert auf die Szene 2 (plannedSceneAt rundet ab); ohne den
    // Fix liefe 2,5 + 1 = 3,5 unnormalisiert weiter.
    const dauerZwei = plannedSceneAt(2, SCENES, basis.seed, basis.shuffle).scene.durationSec;
    const ausBruch = advanceCinema({ ...basis, nummer: 2.5, elapsedSec: dauerZwei - 0.01 }, 0.02);
    expect(ausBruch.nummer).toBe(3);

    // −3 normalisiert auf die Szene 0 (Math.max(0, …)); ohne den Fix bliebe
    // die Nummer negativ (−3 + 1 = −2).
    const dauerNull = plannedSceneAt(0, SCENES, basis.seed, basis.shuffle).scene.durationSec;
    const ausNegativ = advanceCinema({ ...basis, nummer: -3, elapsedSec: dauerNull - 0.01 }, 0.02);
    expect(ausNegativ.nummer).toBe(1);
  });
});

describe('blendedRate', () => {
  it('beginnt beim alten und endet beim neuen Zeitraffer', () => {
    expect(blendedRate(1, 30, 0)).toBeCloseTo(1, 6);
    expect(blendedRate(1, 30, RATE_BLEND_SEC)).toBeCloseTo(30, 6);
    expect(blendedRate(1, 30, 60)).toBeCloseTo(30, 6);
  });

  it('blendet geometrisch, nicht linear', () => {
    // Linear läge die Mitte zwischen 1 und 100 bei 50,5 — ein sichtbarer
    // Ruck. Geometrisch liegt sie bei 10.
    expect(blendedRate(1, 100, RATE_BLEND_SEC / 2)).toBeCloseTo(10, 6);
  });

  it('kommt mit einem Vorzeichenwechsel zurecht', () => {
    // Rückwärtslauf vor dem Start des Kino-Modus: Der Betrag wird geblendet,
    // das Vorzeichen des Ziels gilt sofort.
    const wert = blendedRate(-10, 30, RATE_BLEND_SEC / 2);
    expect(wert).toBeGreaterThan(0);
    expect(Number.isFinite(wert)).toBe(true);
  });

  it('kommt mit Stillstand zurecht', () => {
    expect(Number.isFinite(blendedRate(0, 30, 0.5))).toBe(true);
    expect(Number.isFinite(blendedRate(30, 0, 0.5))).toBe(true);
  });
});

describe('szenenBeginn', () => {
  const basis = { ...DEFAULT_STATE.cinema, running: true, nummer: 3, elapsedSec: 12 };

  it('erkennt den Nummernwechsel', () => {
    expect(szenenBeginn(basis, { ...basis, nummer: 4, elapsedSec: 0.2 })).toBe(true);
  });

  it('erkennt den frischen Start: elapsedSec war 0', () => {
    // startCinema und nextScene setzen elapsedSec auf 0 — auch ohne
    // Nummernwechsel beginnt damit eine Szene.
    expect(szenenBeginn({ ...basis, elapsedSec: 0 }, { ...basis, elapsedSec: 0.016 })).toBe(true);
  });

  it('zählt einen laufenden Tick und den Wiederanlauf nach Ruhe nicht als Beginn', () => {
    // resumeIfIdle lässt elapsedSec stehen: kein zweiter Sprung mitten in der Szene.
    expect(szenenBeginn(basis, { ...basis, elapsedSec: 12.016 })).toBe(false);
  });
});

describe('tickCinema — Zeitsprung auf die nächste Mondfinsternis', () => {
  const indexMondfinsternis = SCENES.findIndex((s) => s.id === 'mondfinsternis');

  /** Stellt das Kino so, dass der nächste Tick auf die Szene `nummer` wechselt. */
  function kinoVorSzene(nummer: number, jd: number): void {
    const vorige = SCENES[nummer - 1]!;
    useStore.setState({
      cinema: {
        ...DEFAULT_STATE.cinema,
        running: true, nummer: nummer - 1,
        elapsedSec: vorige.durationSec + 1, seed: 1, shuffle: false,
      },
      time: { ...DEFAULT_STATE.time, jd },
    });
  }

  it('setzt die Zeit beim Wechsel auf die Szene kurz vor den Eintritt', () => {
    kinoVorSzene(indexMondfinsternis, J2000);
    tickCinema(0.016);

    const f = naechsteMondfinsternis(bodyIndex, J2000)!;
    expect(f).not.toBeNull();
    const erwartet = f.eintrittJd - 0.1 * (f.austrittJd - f.eintrittJd);

    const nachher = useStore.getState();
    expect(nachher.cinema.nummer).toBe(indexMondfinsternis);
    expect(nachher.time.jd).toBeCloseTo(erwartet, 9);
    // Die Finsternis vom 21.01.2000 — die Zeit landet also im Januar 2000,
    // nicht beim Startwert J2000 (jd 2451545).
    expect(nachher.time.jd).toBeGreaterThan(2451560);
    expect(nachher.time.jd).toBeLessThan(2451570);
  });

  it('lässt die Zeit beim Wechsel auf eine Szene ohne zeitpunkt stehen', () => {
    // Gegenprobe: Nur Szenen mit `zeitpunkt` springen. Der Zeitraffer selbst
    // läuft nicht in tickCinema, `time.jd` bleibt hier also exakt stehen.
    const ohne = SCENES.findIndex((s, i) => i > 0 && s.zeitpunkt === undefined);
    kinoVorSzene(ohne, J2000);
    tickCinema(0.016);

    const nachher = useStore.getState();
    expect(nachher.cinema.nummer).toBe(ohne);
    expect(nachher.time.jd).toBe(J2000);
  });

  it('lässt die Zeit innerhalb der Szene stehen, springt nur beim Wechsel', () => {
    kinoVorSzene(indexMondfinsternis, J2000);
    tickCinema(0.016);
    const gesprungen = useStore.getState().time.jd;

    tickCinema(0.016);
    expect(useStore.getState().cinema.nummer).toBe(indexMondfinsternis);
    expect(useStore.getState().time.jd).toBe(gesprungen);
  });

  it('springt auch, wenn das Kino direkt auf der Finsternis-Szene startet', () => {
    // Playlist-Position 0 oder Neustart auf der Szene: keine Nummernänderung,
    // aber elapsedSec 0 wie nach startCinema.
    useStore.setState({
      cinema: {
        ...DEFAULT_STATE.cinema,
        running: true, nummer: indexMondfinsternis, elapsedSec: 0, seed: 1, shuffle: false,
      },
      time: { ...DEFAULT_STATE.time, jd: J2000 },
    });
    tickCinema(0.016);

    const f = naechsteMondfinsternis(bodyIndex, J2000)!;
    const erwartet = f.eintrittJd - 0.1 * (f.austrittJd - f.eintrittJd);
    expect(useStore.getState().cinema.nummer).toBe(indexMondfinsternis);
    expect(useStore.getState().time.jd).toBeCloseTo(erwartet, 9);
  });

  it('springt nach dem Start nur einmal', () => {
    useStore.setState({
      cinema: {
        ...DEFAULT_STATE.cinema,
        running: true, nummer: indexMondfinsternis, elapsedSec: 0, seed: 1, shuffle: false,
      },
      time: { ...DEFAULT_STATE.time, jd: J2000 },
    });
    tickCinema(0.016);

    // Die Zeit mitten in die Finsternis verstellen: Spränge der zweite Tick
    // erneut, landete er wieder vor dem Eintritt — der Test fiele. Ohne
    // diese Verstellung schriebe ein zweiter Sprung denselben Wert und
    // bliebe unsichtbar.
    const f = naechsteMondfinsternis(bodyIndex, J2000)!;
    const mitten = f.eintrittJd + 0.5 * (f.austrittJd - f.eintrittJd);
    useStore.setState({ time: { ...useStore.getState().time, jd: mitten } });
    tickCinema(0.016);
    expect(useStore.getState().time.jd).toBe(mitten);
  });

  it('bleibt beim Sprung nahe JD_MAX im Zeitbereich', () => {
    // Startwert 100 Tage vor JD_MAX: Die gefundene Finsternis liegt hier
    // nachweislich jenseits von JD_MAX (jdNeu wäre ohne Klemmung größer),
    // die Suche selbst darf über den Zeitbereich hinausreichen.
    const start = JD_MAX - 100;
    kinoVorSzene(indexMondfinsternis, start);

    const f = naechsteMondfinsternis(bodyIndex, start)!;
    expect(f).not.toBeNull();
    const jdNeu = f.eintrittJd - 0.1 * (f.austrittJd - f.eintrittJd);
    expect(jdNeu).toBeGreaterThan(JD_MAX);

    tickCinema(0.016);
    const nachher = useStore.getState();
    expect(nachher.cinema.nummer).toBe(indexMondfinsternis);
    expect(nachher.time.jd).toBe(JD_MAX);
  });
});
