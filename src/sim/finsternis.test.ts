import { describe, it, expect } from 'vitest';
import { bodyIndex } from '../data/index';
import {
  kernschattenLage,
  istPartiell,
  istTotal,
  naechsteMondfinsternis,
  KERNSCHATTEN_VERGROESSERUNG,
  SUCHE_MAX_TAGE,
} from './finsternis';

// Julianische Daten der drei geprüften Kanon-Finsternisse (Espenak/NASA,
// „Five Millennium Canon of Lunar Eclipses"), alle total:
//   21.01.2000 04:44 UT → jd 2451564,697
//   16.07.2000 13:55 UT → jd 2451742,08
//   21.01.2019 05:12 UT → jd 2458504,717
// Toleranz ±0,17 d (≈ ±4 h, Design-Dokument §3: fehlende Evektion/Variation
// versetzen die Mondlänge um bis zu ±4 h, die Breite bleibt auf < 0,3° genau).
const TOLERANZ_TAGE = 0.17;

describe('KERNSCHATTEN_VERGROESSERUNG und SUCHE_MAX_TAGE', () => {
  it('sind die im Brief festgelegten Konstanten', () => {
    // 1,02: Chauvenets 2-%-Vergrößerung des Erdschattens für die Atmosphäre
    // (auch bei Meeus, Astronomical Algorithms, Kapitel 54).
    expect(KERNSCHATTEN_VERGROESSERUNG).toBe(1.02);
    // 3 Jahre als obere Schranke der Suche — Mondfinsternisse folgen in der
    // Praxis im Abstand von höchstens einem Jahr, die Schranke greift nie.
    expect(SUCHE_MAX_TAGE).toBeCloseTo(3 * 365.25, 8);
  });
});

describe('kernschattenLage', () => {
  it('liefert am Maximum der Finsternis vom 21.01.2000 den Erdschatten in Mondentfernung (rund 4600 km) und den Mondradius', () => {
    // Lehrbuchwert (Design-Dokument §3, Meeus Kap. 54): Kernschattenradius in
    // Mondentfernung liegt nahe 4600 km. Fenster [4400; 4900] deckt die
    // Schwankung mit dem (leicht exzentrischen) Erde-Mond-Abstand ab, ohne
    // eine grob falsche Rechnung (z. B. vertauschte Radien oder ein
    // fehlender Tangens-Term) durchzulassen.
    const l = kernschattenLage(bodyIndex, 2451564.697);
    expect(l.kernschattenKm).toBeGreaterThanOrEqual(4400);
    expect(l.kernschattenKm).toBeLessThanOrEqual(4900);
    expect(l.mondRadiusKm).toBe(1737.4);
  });
});

describe('naechsteMondfinsternis: Kanon-Finsternisse', () => {
  it('findet ab J2000 (2451545) die totale Finsternis vom 21.01.2000', () => {
    const f = naechsteMondfinsternis(bodyIndex, 2451545);
    expect(f).not.toBeNull();
    expect(f!.maximumJd).toBeGreaterThanOrEqual(2451564.697 - TOLERANZ_TAGE);
    expect(f!.maximumJd).toBeLessThanOrEqual(2451564.697 + TOLERANZ_TAGE);
    expect(f!.art).toBe('total');
    expect(f!.eintrittJd).toBeLessThan(f!.maximumJd);
    expect(f!.maximumJd).toBeLessThan(f!.austrittJd);
    // Kernschattendurchgang 2,4 … 4,3 h ≙ 0,10 … 0,18 d.
    const dauerTage = f!.austrittJd - f!.eintrittJd;
    expect(dauerTage).toBeGreaterThanOrEqual(0.10);
    expect(dauerTage).toBeLessThanOrEqual(0.18);
  });

  it('findet ab dem 01.02.2000 (2451575) die nächste totale Finsternis erst am 16.07.2000 — überspringt fünf finsternisfreie Vollmonde', () => {
    const f = naechsteMondfinsternis(bodyIndex, 2451575);
    expect(f).not.toBeNull();
    expect(f!.maximumJd).toBeGreaterThanOrEqual(2451742.08 - TOLERANZ_TAGE);
    expect(f!.maximumJd).toBeLessThanOrEqual(2451742.08 + TOLERANZ_TAGE);
    expect(f!.art).toBe('total');
  });

  it('findet ab 2458490 (11.01.2019) die totale Finsternis vom 21.01.2019', () => {
    const f = naechsteMondfinsternis(bodyIndex, 2458490);
    expect(f).not.toBeNull();
    expect(f!.maximumJd).toBeGreaterThanOrEqual(2458504.717 - TOLERANZ_TAGE);
    expect(f!.maximumJd).toBeLessThanOrEqual(2458504.717 + TOLERANZ_TAGE);
    expect(f!.art).toBe('total');
  });
});

// Start kurz vor dem Maximum: Die Abtastung im Vierteltagesraster erkannte
// ein Minimum früher erst am zweiten Stützpunkt und übersprang eine
// Finsternis, deren Maximum weniger als einen Schritt nach dem Start lag.
// Totale Finsternisse 07.09.2025 (Maximum 18:11 UT) und 03.03.2026 (11:33 UT).
describe('naechsteMondfinsternis: Start kurz vor dem Maximum', () => {
  it.each([
    ['07.09.2025', 2460920],
    ['03.03.2026', 2461090],
  ])('findet die Finsternis vom %s auch bei Start bis zu einem Schritt vorher', (_name, frueh) => {
    const bezug = naechsteMondfinsternis(bodyIndex, frueh)!;
    for (const vorher of [0.01, 0.05, 0.1, 0.15, 0.2, 0.24]) {
      const f = naechsteMondfinsternis(bodyIndex, bezug.maximumJd - vorher);
      expect(f!.maximumJd, `Start ${vorher} d vor dem Maximum`).toBeCloseTo(bezug.maximumJd, 3);
    }
  });

  it('liefert eine laufende Finsternis, solange ihr Austritt noch bevorsteht', () => {
    const bezug = naechsteMondfinsternis(bodyIndex, 2460920)!;
    const f = naechsteMondfinsternis(bodyIndex, bezug.austrittJd - 0.01)!;
    expect(f.maximumJd).toBeCloseTo(bezug.maximumJd, 3);
  });

  it('überspringt eine Finsternis, deren Austritt schon vorbei ist', () => {
    const bezug = naechsteMondfinsternis(bodyIndex, 2460920)!;
    const f = naechsteMondfinsternis(bodyIndex, bezug.austrittJd + 0.01)!;
    expect(f.maximumJd).toBeGreaterThan(bezug.austrittJd + 20);
  });
});

// Knoten und Perigäum des Mondes laufen gegen die feste Ekliptik J2000, nicht
// mit den Raten nach Meeus vom Äquinoktium des Datums (Befund aus dem Pilot
// szene-mondfinsternis, Etappe 4d-1). Mit den alten Raten lag der Knoten 1972
// um 0,4° daneben: die Finsternis wurde partiell, und 1959 galt eine
// Halbschattenfinsternis als partiell. Zeiten aus dem NASA-Katalog (TD).
describe('naechsteMondfinsternis: Raten gegen die feste Ekliptik J2000', () => {
  it('findet ab dem 15.01.1972 die totale Finsternis vom 30.01.1972 (10:54:05 TD) als total', () => {
    const f = naechsteMondfinsternis(bodyIndex, 2441331.5);
    expect(f).not.toBeNull();
    expect(f!.maximumJd).toBeGreaterThanOrEqual(2441346.954 - TOLERANZ_TAGE);
    expect(f!.maximumJd).toBeLessThanOrEqual(2441346.954 + TOLERANZ_TAGE);
    expect(f!.art).toBe('total');
  });

  it('übergeht ab dem 01.09.1959 die Halbschattenfinsternis vom 17.09.1959 und findet die totale vom 13.03.1960', () => {
    const f = naechsteMondfinsternis(bodyIndex, 2436812.5);
    expect(f).not.toBeNull();
    expect(f!.maximumJd).toBeGreaterThanOrEqual(2437006.853 - TOLERANZ_TAGE);
    expect(f!.maximumJd).toBeLessThanOrEqual(2437006.853 + TOLERANZ_TAGE);
    expect(f!.art).toBe('total');
  });
});

describe('naechsteMondfinsternis: Ein-/Austritt gegen istPartiell/istTotal', () => {
  const f = naechsteMondfinsternis(bodyIndex, 2451545);

  it('liegt am gefundenen Maximum im Kernschatten (istTotal)', () => {
    expect(f).not.toBeNull();
    expect(istTotal(kernschattenLage(bodyIndex, f!.maximumJd))).toBe(true);
  });

  it('ist kurz vor dem gefundenen Eintritt noch nicht, kurz danach schon verfinstert', () => {
    expect(f).not.toBeNull();
    expect(istPartiell(kernschattenLage(bodyIndex, f!.eintrittJd - 0.01))).toBe(false);
    expect(istPartiell(kernschattenLage(bodyIndex, f!.eintrittJd + 0.005))).toBe(true);
  });
});

describe('naechsteMondfinsternis: Laufzeit', () => {
  it('braucht ab 2451545 unter 200 ms für die erste Suche', () => {
    const start = performance.now();
    naechsteMondfinsternis(bodyIndex, 2451545);
    const dauerMs = performance.now() - start;
    expect(dauerMs).toBeLessThan(200);
  });
});
