import { describe, it, expect } from 'vitest';
import fixture from './__fixtures__/monde-horizons.json';
import { positionAt } from './orbit';
import { bodyIndex } from '../data/index';
import { poleVector } from './frames';
import type { Vec3 } from './types';

interface Eintrag {
  id: string;
  jd: number;
  soll: Vec3;
  /** Geschwindigkeit zum selben Zeitpunkt, in km/s — nur für die Ebenentests gebraucht. */
  sollGeschwindigkeit: Vec3;
}

const eintraege = fixture.eintraege as Eintrag[];

/** Relativvektor Mond → Mutterkörper, in km. */
function relativ(id: string, jd: number): Vec3 {
  const mond = bodyIndex[id]!;
  const p = positionAt(id, bodyIndex, jd);
  const m = positionAt(mond.parent!, bodyIndex, jd);
  return { x: p.x - m.x, y: p.y - m.y, z: p.z - m.z };
}

const betrag = (v: Vec3): number => Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);

const kreuz = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

/** Winkel zwischen zwei Vektoren beliebiger Länge, in Grad. */
function winkelZwischen(a: Vec3, b: Vec3): number {
  const cosPhi = (a.x * b.x + a.y * b.y + a.z * b.z) / (betrag(a) * betrag(b));
  const geklemmt = Math.min(1, Math.max(-1, cosPhi));
  return (Math.acos(geklemmt) * 180) / Math.PI;
}

/**
 * Bahnnormale aus zwei Simulationspositionen im Achtelabstand eines
 * Umlaufs, n = r(jd) × r(jd + P/8). Die Umlaufzeit P folgt aus den
 * hinterlegten Bahnelementen (LDot ist die mittlere Längenänderung in Grad
 * je julianisches Jahrhundert): P_tage = 36525 / (LDot / 360). Ein
 * Achtelumlauf steht weit genug von r(jd) entfernt, um eine stabil
 * bestimmbare Normale zu ergeben, und ist gleichzeitig kurz genug, dass
 * sich die Bahnebene selbst (Knoten- und Inklinationsdrift) in dieser
 * Zeitspanne nicht merklich weiterdreht.
 */
function bahnnormaleIst(id: string, jd: number): Vec3 {
  const mond = bodyIndex[id]!;
  const pTage = 36525 / (mond.orbit!.LDot / 360);
  return kreuz(relativ(id, jd), relativ(id, jd + pTage / 8));
}

/**
 * Für Phobos und Deimos gleichermaßen zutreffende Schranke, mit einer
 * dokumentierten Ausnahme für Deimos — siehe Kommentar am ersten
 * Ebenentest unten.
 */
const NEIGUNGS_SCHRANKE_GRAD: Record<string, number> = { phobos: 0.5, deimos: 1.0 };

describe('Mondbahnen gegen JPL Horizons', () => {
  it('enthält Referenzpunkte für Phobos und Deimos', () => {
    const ids = new Set(eintraege.map((e) => e.id));
    for (const id of ['phobos', 'deimos']) {
      expect(ids.has(id)).toBe(true);
    }
    expect(eintraege.length).toBeGreaterThanOrEqual(10);
  });

  it.each(eintraege)('$id bei JD $jd: Bahnradius auf 1 %', ({ id, jd, soll }) => {
    const ist = betrag(relativ(id, jd));
    expect(Math.abs(ist - betrag(soll)) / betrag(soll)).toBeLessThan(0.01);
  });

  it.each(eintraege)(
    '$id bei JD $jd: Neigung gegen die Äquatorebene des Mutterkörpers auf 0,5°/1,0°',
    ({ id, jd, soll, sollGeschwindigkeit }) => {
      // Der Brief vor dieser Korrektur schlug vor, den Winkel zwischen dem
      // Ist-Ortsvektor und dem Soll-Ortsvektor über deren Kreuzprodukt-
      // z-Komponente zu messen. Das ist aus zwei Gründen falsch: Erstens
      // ist z_x*y - z_y*x nur die z-Komponente von ist × soll und misst
      // damit den Winkel zwischen den Projektionen beider Vektoren in die
      // xy-Ebene — das ist ein Phasenwinkel, keine Aussage über die Lage
      // der Bahnebene. Zweitens ist aus einem einzelnen Ortsvektor die
      // Bahnebene ohnehin nicht bestimmbar: Ein Punkt allein liegt in
      // jeder Ebene, die ihn und den Ursprung enthält. Ein Phasentest
      // widerspricht außerdem der Schrankentabelle, die 5 % Bahnumfang
      // (rund 18°) an anderer Stelle ausdrücklich erlaubt.
      //
      // Richtig bestimmt eine Bahnnormale zwei Größen, die zusammen die
      // Ebene aufspannen: entweder Ort und Geschwindigkeit (n = r × v)
      // oder zwei Ortsvektoren zu verschiedenen Zeiten (n = r(t1) × r(t2),
      // siehe bahnnormaleIst oben).
      //
      // Diese erste Ebenenaussage ist bewusst knotenunabhängig: Geprüft
      // wird nur der Winkel der Bahnnormale zur Polachse des Mutterkörpers
      // (die "Neigung"), nicht die Ausrichtung der Knotenlinie um diese
      // Achse. Das trennt sauber zwei ganz verschiedene Fehlerquellen:
      // Ist die Neigung richtig, aber die Knotenphase über Jahrzehnte
      // unsicher (siehe der zweite Ebenentest unten), bleibt dieser Test
      // hier über alle fünf Epochen streng bei 0,5° — i selbst trägt in
      // mars-monde.ts keine Präzessionsrate (iDot = 0), akkumuliert also
      // keine Unsicherheit über die Zeit.
      //
      // Deimos bekommt eine eigene, weitere Schranke von 1,0°: Seine
      // Bahnelemente sind auf seine eigene Laplace-Ebene bezogen (JPL-
      // Tabelle: Pol 316,6°/53,5°, "tilt angle" 0,9° zur Marsäquatorebene),
      // aber equatorToEcliptic() bekommt für beide Monde denselben Mars-
      // ROTATIONSpol übergeben (siehe Kommentar in mars-monde.ts) — für
      // Phobos praktisch exakt (0,018° Differenz laut selbigem Kommentar),
      // für Deimos nicht. Die echte (Horizons-)Neigung gegen die
      // Marsäquatorebene oszilliert deshalb mit der Präzession der
      // Laplace-Ebene zwischen rund i−0,9° und i+0,9° (gemessen: 0,92°
      // bis 2,66°), während das Modell konstant bei den tabellierten
      // i = 1,8° bleibt — eine in Task 5 bewusst in Kauf genommene
      // Vereinfachung (siehe dortiger Kommentar "Eine eigene Bezugsebene
      // je Mond wäre für einen Effekt unterhalb der Strichstärke einer
      // Bahnlinie eingeführt"), kein neuer Fehler. Der Preis dafür beträgt
      // gemessen bis zu 0,88° — die Schranke von 1,0° lässt dafür Raum,
      // ohne beliebig weit aufgeweicht zu sein.
      const nIst = bahnnormaleIst(id, jd);
      const nSoll = kreuz(soll, sollGeschwindigkeit);
      const mutter = bodyIndex[bodyIndex[id]!.parent!]!;
      const pol = poleVector(mutter.physical.pole.raDeg, mutter.physical.pole.decDeg);

      const neigungIst = winkelZwischen(nIst, pol);
      const neigungSoll = winkelZwischen(nSoll, pol);
      const schranke = NEIGUNGS_SCHRANKE_GRAD[id] ?? 0.5;

      expect(Math.abs(neigungIst - neigungSoll)).toBeLessThan(schranke);
    },
  );

  // Volle Ebenenlage (Winkel zwischen den vollen Bahnnormalen, inklusive
  // Knotenrichtung) wird bewusst nur zur Epoche J2000 geprüft, nicht über
  // alle fünf Stichtage: node trägt in mars-monde.ts eine Präzessionsrate
  // (bei Phobos nodeDot aus einer Knotenpräzessionsperiode von 2,3 Jahren,
  // zweistellig angegeben). Über die 76 Jahre bis zum am weitesten vom
  // Referenzjahr entfernten Stichtag sind das rund 76 / 2,3 ≈ 33 volle
  // Knotenumläufe; die zweistellige Genauigkeit der Periode (± 0,05 Jahre)
  // bedeutet eine relative Unsicherheit von rund 2,2 %, die sich über 33
  // Umläufe zu 33 · 2,2 % · 360° ≈ 261° aufsummiert — mehr als ein voller
  // Umlauf, also eine VOLLE Phasenunsicherheit der Knotenrichtung. Der
  // dadurch maximal mögliche Fehler im Winkel zwischen zwei Bahnebenen
  // gleicher Neigung i, aber unbekannt zueinander verdrehter Knotenlinie,
  // ist 2·i (wenn die Knoten einander genau gegenüberstehen) — bei Phobos
  // 2 · 1,1° = 2,2°, was die gemessene Abweichung am weitesten Stichtag
  // (2076) auch tatsächlich trifft. Das ist eine Grenze der Quelle
  // (zweistellige Präzessionsperiode), kein Fehler im Code oder im
  // Fixture. Wer diesen Test auf weitere Epochen ausdehnen will, muss
  // zuerst eine genauer angegebene Knotenpräzessionsperiode beschaffen.
  const epocheJ2000 = eintraege.filter((e) => e.jd === 2451544.5);

  it.each(epocheJ2000)(
    '$id bei JD $jd: volle Bahnebene inkl. Knoten auf 0,5°/1,0° — nur Epoche J2000',
    ({ id, jd, soll, sollGeschwindigkeit }) => {
      // Dieselbe Deimos-Ausnahme wie beim knotenunabhängigen Test oben,
      // aus demselben Grund (Mars-Rotationspol statt Deimos' eigener
      // Laplace-Ebene) — hier wirkt sie sich auch auf die Knotenlage aus,
      // nicht nur auf die Neigung.
      const nIst = bahnnormaleIst(id, jd);
      const nSoll = kreuz(soll, sollGeschwindigkeit);
      const schranke = NEIGUNGS_SCHRANKE_GRAD[id] ?? 0.5;

      expect(winkelZwischen(nIst, nSoll)).toBeLessThan(schranke);
    },
  );

  it.each(eintraege)('$id bei JD $jd: Position auf 5 % des Bahnumfangs', ({ id, jd, soll }) => {
    // Die bewusst lockere Schranke: Mittlere Bahnelemente kennen die großen
    // Störungen nicht. Die Simulation zeigt Monde bei überhöhter Körpergröße
    // ohnehin überhöht — wenige Grad Phasenversatz sieht niemand, einen
    // falschen Bahnradius sofort.
    const ist = relativ(id, jd);
    const abstand = betrag({ x: ist.x - soll.x, y: ist.y - soll.y, z: ist.z - soll.z });
    expect(abstand).toBeLessThan(0.05 * 2 * Math.PI * betrag(soll));
  });
});
