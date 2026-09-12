import { describe, it, expect } from 'vitest';
import { bodies, bodyIndex, getBody } from './index';
import { poleVector, axialTiltDeg } from '../sim/frames';
import { AU_KM, positionAt } from '../sim/orbit';
import { J2000 } from '../sim/time';
import { t } from '../ui/i18n';

describe('Körperkatalog', () => {
  // Die Zahl der Monde wächst über Phase 3a hinweg; festgenagelt bleiben
  // deshalb nur Stern und Planeten, dazu die namentlich erwarteten Monde.
  it('enthält Sonne, acht Planeten und die bisherigen Monde', () => {
    expect(bodies.filter((b) => b.kind === 'planet')).toHaveLength(8);
    expect(bodies.filter((b) => b.kind === 'star')).toHaveLength(1);
    expect(bodies.map((b) => b.id)).toEqual(
      expect.arrayContaining([
        'moon', 'phobos', 'deimos', 'io', 'europa', 'ganymede', 'callisto',
        'mimas', 'enceladus', 'tethys', 'dione', 'rhea', 'titan', 'iapetus',
        'miranda', 'ariel', 'umbriel', 'titania', 'oberon', 'triton',
        'pluto', 'charon', 'ceres', 'eris', 'haumea', 'makemake',
      ]),
    );
  });

  it('gibt nur der Sonne keine Bahn', () => {
    for (const b of bodies) {
      if (b.id === 'sun') expect(b.orbit).toBeNull();
      else expect(b.orbit).not.toBeNull();
    }
  });

  // Dieser Test ist der eigentliche Zweck: er fängt Zahlendreher beim
  // Übertragen der JPL-Tabelle, bevor sie sich als Bahnfehler tarnen.
  it('hält die bekannten großen Halbachsen ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.38710, venus: 0.72333, earth: 1.00000, mars: 1.52371,
      jupiter: 5.20289, saturn: 9.53668, uranus: 19.18916, neptune: 30.06992,
    };
    for (const [id, a] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.a).toBeCloseTo(a, 4);
    }
  });

  it('hält die bekannten Exzentrizitäten ein', () => {
    const erwartet: Record<string, number> = {
      mercury: 0.20564, venus: 0.00677, earth: 0.01671, mars: 0.09339,
      jupiter: 0.04839, saturn: 0.05386, uranus: 0.04726, neptune: 0.00859,
    };
    for (const [id, e] of Object.entries(erwartet)) {
      expect(getBody(id).orbit!.e).toBeCloseTo(e, 4);
    }
  });

  it('liefert plausible physikalische Daten', () => {
    for (const b of bodies) {
      expect(b.physical.radiusKm).toBeGreaterThan(0);
      expect(b.physical.massKg).toBeGreaterThan(0);
      expect(Math.abs(b.physical.rotationPeriodH)).toBeGreaterThan(0);
      // Die aus dem Pol abgeleitete Achsneigung ist ein Winkel und liegt
      // damit immer zwischen 0° und 180°; die eigentliche Prüfung der
      // Pollagen — gegen die bekannte, veröffentlichte Neigung — leistet
      // frames.test.ts.
      const neigung = axialTiltDeg(poleVector(b.physical.pole.raDeg, b.physical.pole.decDeg));
      expect(neigung).toBeGreaterThanOrEqual(0);
      expect(neigung).toBeLessThanOrEqual(180);
    }
    // Die Sonne ist der größte Körper im Katalog.
    const maxRadius = Math.max(...bodies.map((b) => b.physical.radiusKm));
    expect(getBody('sun').physical.radiusKm).toBe(maxRadius);
  });
});

describe('Katalog-Invarianten', () => {
  it('hat eindeutige IDs', () => {
    const ids = bodies.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('verweist nur auf existierende Mutterkörper', () => {
    for (const body of bodies) {
      if (body.parent === null) continue;
      expect(bodyIndex[body.parent], `Mutterkörper von ${body.id}`).toBeDefined();
    }
  });

  it('nutzt parentEquator nur, wo der Mutterkörper einen Pol hat', () => {
    for (const body of bodies) {
      if (body.orbit?.frame !== 'parentEquator') continue;
      const mutter = body.parent === null ? undefined : bodyIndex[body.parent];
      expect(mutter?.physical.pole, `Pol des Mutterkörpers von ${body.id}`).toBeDefined();
    }
  });

  it('kennt für jeden Körper einen Namensschlüssel mit hinterlegtem Text', () => {
    for (const body of bodies) {
      // t() gibt für unbekannte Schlüssel `[schlüssel]` zurück — genau darauf
      // wird geprüft. Ein Vergleich mit dem hinterlegten Text aus `de` würde
      // nur die Implementierung von t() nachbilden, ohne eine zusätzliche
      // Fehlerklasse zu fangen; ein Vergleich gegen den Schlüssel selbst wäre
      // zudem tautologisch, weil die eckigen Klammern ihn ohnehin verschieden
      // machen.
      expect(t(body.info.nameKey), body.id).not.toMatch(/^\[.*\]$/);
    }
  });

  it('verweist nur auf vorhandene Texturdateien', async () => {
    // Ein Tippfehler im Pfad fiele sonst erst im Browser auf, und dort nur
    // als stumm bleibende Ausweichfarbe (siehe ladeAlbedo in render/bodies.ts).
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration;
    // das Paket wird bewusst nicht als neue Abhängigkeit ergänzt (siehe
    // Task-11-Vorgabe „keine neuen Abhängigkeiten"). Zur Laufzeit unter
    // Vitest/Node funktioniert der dynamische Import unverändert.
    const { existsSync } = await import('node:fs');
    for (const body of bodies) {
      const pfad = body.appearance.textures.albedo;
      if (pfad === '') continue;
      expect(existsSync(`public/${pfad}`), `${body.id}: ${pfad}`).toBe(true);
    }
  });

  it('führt Phobos und Deimos in der Marsäquatorebene', () => {
    for (const id of ['phobos', 'deimos']) {
      const mond = bodyIndex[id];
      expect(mond?.parent).toBe('mars');
      expect(mond?.orbit?.frame).toBe('parentEquator');
      expect(mond?.orbit?.i ?? 99).toBeLessThan(2);
    }
  });

  it('trifft die bekannten Bahnradien der Marsmonde', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer.
    expect((bodyIndex['phobos']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(9376, -2);
    expect((bodyIndex['deimos']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(23463, -2);
  });

  it('führt Io, Europa, Ganymed und Kallisto in der Jupiteräquatorebene', () => {
    for (const id of ['io', 'europa', 'ganymede', 'callisto']) {
      const mond = bodyIndex[id];
      expect(mond?.parent).toBe('jupiter');
      expect(mond?.orbit?.frame).toBe('parentEquator');
      expect(mond?.orbit?.i ?? 99).toBeLessThan(1);
    }
  });

  it('trifft die bekannten Bahnradien der Jupitermonde', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer.
    expect((bodyIndex['io']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(421800, -2);
    expect((bodyIndex['europa']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(671100, -2);
    expect((bodyIndex['ganymede']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(1070400, -2);
    expect((bodyIndex['callisto']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(1882700, -2);
  });

  // Der eigentliche Nachweis, dass die vier Datensätze zueinander passen:
  // Io, Europa und Ganymed stehen in der Laplace-Resonanz, ihre Umlaufzeiten
  // also im Verhältnis 1:2:4 — die Szene „Galileisches Schattenspiel" (später)
  // zeigt genau das.
  it('hält die Laplace-Resonanz 1:2:4 von Io, Europa und Ganymed', () => {
    // LDot ist die mittlere Länge in Grad je julianischem Jahrhundert;
    // die Umlaufzeit in Tagen ist 36525 / (LDot / 360).
    const periode = (id: string): number => 36525 / ((bodyIndex[id]?.orbit?.LDot ?? 0) / 360);
    expect(periode('europa') / periode('io')).toBeCloseTo(2, 1);
    expect(periode('ganymede') / periode('io')).toBeCloseTo(4, 1);
  });

  it('führt Mimas, Enceladus, Tethys, Dione, Rhea, Titan und Iapetus in der Saturnäquatorebene', () => {
    for (const id of ['mimas', 'enceladus', 'tethys', 'dione', 'rhea', 'titan', 'iapetus']) {
      const mond = bodyIndex[id];
      expect(mond?.parent).toBe('saturn');
      expect(mond?.orbit?.frame).toBe('parentEquator');
    }
    // Iapetus' Inklination liegt bei rund 15,5° gegen Saturns Äquator (seine
    // eigene Laplace-Ebene ist laut JPL-Elementtabelle um 14,8° dagegen
    // geneigt, siehe Quellenblock in saturn-monde.ts) und liegt deshalb
    // bewusst außerhalb dieser auf die übrigen, fast äquatornahen Monde
    // zugeschnittenen Prüfung.
    for (const id of ['mimas', 'enceladus', 'tethys', 'dione', 'rhea', 'titan']) {
      expect(bodyIndex[id]?.orbit?.i ?? 99).toBeLessThan(2);
    }
  });

  it('trifft die bekannten Bahnradien der Saturnmonde', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer.
    // Seit Task 8b stammt a aus Horizons' osculating elements (siehe
    // Quellenblock in saturn-monde.ts) statt aus der JPL-Mean-Elements-
    // Tabelle — die erwarteten Werte hier sind deshalb die Rückrechnungen
    // aus dieser Quelle, nicht mehr die (auf sechs Stellen gerundeten)
    // Tabellenwerte. Kleine Differenzen zur Mean-Elements-Tabelle (bis rund
    // 870 km bei Iapetus) sind real und erwartet: Die osculating Elemente
    // enthalten die kurzperiodische Momentaufnahme zur Epoche, die
    // gemittelte Tabelle dagegen nicht (siehe Task-8b-Bericht).
    expect((bodyIndex['mimas']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(186036.8234, -2);
    expect((bodyIndex['enceladus']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(238419.8706, -2);
    expect((bodyIndex['tethys']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(294980.2561, -2);
    expect((bodyIndex['dione']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(377652.1841, -2);
    expect((bodyIndex['rhea']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(527225.2657, -2);
    expect((bodyIndex['titan']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(1221934.9070, -2);
    expect((bodyIndex['iapetus']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(3562568.0967, -2);
  });

  // Der Sondertest aus dem Task-8-Brief: Mimas muss außerhalb des
  // Ringsystems laufen. Seit Task 12 ist `appearance.rings.outerKm` bei
  // Saturn gesetzt (A-Ring-Außenkante, NASA/JPL NSSDC Saturnian Rings Fact
  // Sheet, siehe Herleitung und Quelle in data/bodies/saturn.ts) — geprüft
  // wird jetzt gegen dieses Feld und nicht mehr gegen einen zweiten,
  // gleichlautenden Literalwert hier in der Testdatei.
  it('hält Mimas außerhalb des Ringsystems', () => {
    const ringAussenKm = bodyIndex['saturn']?.appearance.rings?.outerKm ?? 0;
    expect(ringAussenKm).toBeGreaterThan(0);
    expect((bodyIndex['mimas']?.orbit?.a ?? 0) * AU_KM).toBeGreaterThan(ringAussenKm);
  });

  it('führt Miranda, Ariel, Umbriel, Titania und Oberon in der Uranusäquatorebene', () => {
    for (const id of ['miranda', 'ariel', 'umbriel', 'titania', 'oberon']) {
      const mond = bodyIndex[id];
      expect(mond?.parent).toBe('uranus');
      expect(mond?.orbit?.frame).toBe('parentEquator');
    }
    // Uranus liegt fast in der Ekliptik (Pol nahe 0° Deklination gegen die
    // Bahnnormale) — seine Monde laufen deshalb fast exakt in seiner
    // Äquatorebene, aber Horizons misst deren Inklination gegen denselben
    // Pol, den Uranus' eigene (nach IAU-Konvention retrograde) Rotation
    // nutzt: i liegt für alle fünf nahe 180°, nicht nahe 0° (siehe
    // Quellenblock in uranus-monde.ts). Geprüft wird deshalb der Abstand
    // von 180°, nicht von 0°.
    for (const id of ['ariel', 'umbriel', 'titania', 'oberon']) {
      expect(180 - (bodyIndex[id]?.orbit?.i ?? 0)).toBeLessThan(0.5);
    }
    // Miranda hat mit Abstand die am stärksten geneigte Bahn der fünf
    // großen Uranusmonde (rund 4,3° gegen Uranus' Äquator).
    expect(180 - (bodyIndex['miranda']?.orbit?.i ?? 0)).toBeLessThan(5);
  });

  it('trifft die bekannten Bahnradien der Uranusmonde', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer
    // (Horizons osculating elements, siehe Quellenblock in uranus-monde.ts).
    expect((bodyIndex['miranda']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(129871.7551, -2);
    expect((bodyIndex['ariel']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(190941.3470, -2);
    expect((bodyIndex['umbriel']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(266012.1887, -2);
    expect((bodyIndex['titania']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(436292.6756, -2);
    expect((bodyIndex['oberon']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(583549.9441, -2);
  });

  it('führt Triton um Neptun, retrograd', () => {
    const mond = bodyIndex['triton'];
    expect(mond?.parent).toBe('neptune');
    expect(mond?.orbit?.frame).toBe('parentEquator');
    // i > 90° ist per Definition ein retrograder Umlauf (siehe Quellenblock
    // in neptun-monde.ts) — Sondertest 2 unten weist das zusätzlich über
    // die tatsächliche Bahnbewegung nach.
    expect(mond?.orbit?.i ?? 0).toBeGreaterThan(90);
    expect((mond?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(354766.0619, -2);
  });

  // Sondertest 1 (Task-9-Brief): der liegende Uranus. Seine Monde laufen in
  // seiner Äquatorebene, und die steht fast senkrecht auf der Ekliptik —
  // der Fall, für den poleVector()/icrfKnotenVersatzDeg() gebaut wurden.
  it('lässt die Uranusmonde in der Äquatorebene ihres Planeten laufen', () => {
    const pol = poleVector(
      bodyIndex['uranus']!.physical.pole.raDeg,
      bodyIndex['uranus']!.physical.pole.decDeg,
    );
    for (const id of ['miranda', 'ariel', 'umbriel', 'titania', 'oberon']) {
      const p = positionAt(id, bodyIndex, J2000 + 2);
      const u = positionAt('uranus', bodyIndex, J2000 + 2);
      const r = { x: p.x - u.x, y: p.y - u.y, z: p.z - u.z };
      const betrag = Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2);
      const skalar = (r.x * pol.x + r.y * pol.y + r.z * pol.z) / betrag;
      // Bahnneigungen gegen die Laplace-Ebene liegen unter 5°, also |cos| < 0,09.
      expect(Math.abs(skalar), id).toBeLessThan(0.09);
    }
  });

  // Sondertest 2 (Task-9-Brief): Tritons Rücklauf. Über zwei Stützstellen
  // muss der Relativvektor um den Neptunpol im mathematisch negativen Sinn
  // wandern.
  it('lässt Triton retrograd umlaufen', () => {
    const pol = poleVector(
      bodyIndex['neptune']!.physical.pole.raDeg,
      bodyIndex['neptune']!.physical.pole.decDeg,
    );
    const rel = (jd: number) => {
      const p = positionAt('triton', bodyIndex, jd);
      const n = positionAt('neptune', bodyIndex, jd);
      return { x: p.x - n.x, y: p.y - n.y, z: p.z - n.z };
    };
    const a = rel(J2000);
    const b = rel(J2000 + 0.5);
    // Das Kreuzprodukt a × b zeigt in Umlaufrichtung; bei retrogradem Lauf
    // steht es dem Pol entgegen.
    const kreuz = {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
    expect(kreuz.x * pol.x + kreuz.y * pol.y + kreuz.z * pol.z).toBeLessThan(0);
  });
});

describe('Pluto-System und Zwergplaneten (Task 10)', () => {
  it('führt Pluto und die vier übrigen Zwergplaneten heliozentrisch, Charon dagegen um Pluto', () => {
    for (const id of ['pluto', 'ceres', 'eris', 'haumea', 'makemake']) {
      const b = bodyIndex[id];
      expect(b?.kind, id).toBe('dwarf');
      expect(b?.parent, id).toBe('sun');
      expect(b?.orbit?.frame, id).toBe('ecliptic');
    }
    const charon = bodyIndex['charon'];
    expect(charon?.kind).toBe('moon');
    expect(charon?.parent).toBe('pluto');
    expect(charon?.orbit?.frame).toBe('parentEquator');
    // Charon läuft praktisch exakt in Plutos Äquatorebene (gegenseitig
    // gebundene Rotation erzwingt das), siehe Quellenblock in pluto-system.ts.
    expect(charon?.orbit?.i ?? 99).toBeLessThan(1);
  });

  it('trifft den bekannten Bahnradius von Charon', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer
    // (Horizons osculating elements, siehe Quellenblock in pluto-system.ts).
    // Toleranz ±0,005 km (numDigits 2): Der Ist-Wert weicht rechnerisch nur
    // um rund 0,00021 km vom Quellwert ab (die durch die 11-Dezimalstellen-
    // Rundung von orbit.a selbst gesetzte Grenze liegt bei rund 0,00075 km,
    // ein LSB-Fehler in a bei rund 0,0015 km) — ±0,005 km umschließt beides
    // mit deutlicher Reserve (rund 24-fach über dem Ist-Fehler), ohne auf
    // ihn zu trimmen, und bleibt eng genug, um eine falsch abgeschriebene
    // Nachkommastelle in a weiterhin zu fassen. Vorher: ±50 km (numDigits -2).
    expect((bodyIndex['charon']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(19595.76204124312, 2);
  });

  // Grobe Kontrollpunkte aus dem Task-10-Brief. Die tatsächlichen JPL-SBDB-
  // Werte weichen davon in Einzelfällen um bis zu rund 1 % ab (besonders
  // Pluto: die 3:2-Resonanz mit Neptun lässt seine oskulierenden Elemente
  // über den 248-jährigen Umlauf spürbar librieren, siehe Quellenblock in
  // pluto-system.ts) — die Toleranz ist deshalb bewusst weiter als bei den
  // Halbachsen-Tests der acht Planeten oben, die gegen dieselbe gefittete
  // Tabelle prüfen, aus der auch die Katalogwerte stammen.
  it('hält die groben Kontrollwerte der Zwergplaneten aus dem Task-10-Brief ein (± 2 %)', () => {
    const erwartetA: Record<string, number> = {
      ceres: 2.77, pluto: 39.48, haumea: 43.1, makemake: 45.4, eris: 67.8,
    };
    for (const [id, a] of Object.entries(erwartetA)) {
      const ist = bodyIndex[id]!.orbit!.a;
      expect(Math.abs(ist - a) / a, id).toBeLessThan(0.02);
    }
    // ±0,005 (numDigits 2): Ist-Abweichung von der Fact-Sheet-Kontrollgröße
    // rund 0,00304 (≈1,22 %, die oben erläuterte Libration) — ±0,005 (≈2 %)
    // umschließt das mit rund 1,6-facher Reserve. Vorher: ±0,05 (numDigits 1).
    expect(bodyIndex['pluto']!.orbit!.e).toBeCloseTo(0.2488, 2);
    // ±0,05° (numDigits 1): Ist-Abweichung rund 0,0123°, also rund 4-fache
    // Reserve; numDigits 2 (±0,005°) wäre bereits enger als diese reale
    // Libration und ließe den Test fehlschlagen. Vorher: ±0,5° (numDigits 0).
    expect(bodyIndex['pluto']!.orbit!.i).toBeCloseTo(17.16, 1);
    expect(bodyIndex['eris']!.orbit!.e).toBeCloseTo(0.44, 1);
    const erisAphel = bodyIndex['eris']!.orbit!.a * (1 + bodyIndex['eris']!.orbit!.e);
    expect(Math.abs(erisAphel - 97) / 97).toBeLessThan(0.02);
  });

  // Kepler-Gegenprobe (Task-Vorgabe): P_Jahre = a_AE^1,5 gegen die aus LDot
  // zurückgerechnete Umlaufzeit — fängt Zahlendreher in a unabhängig von
  // der SBDB-eigenen Periodenangabe.
  it.each(['ceres', 'pluto', 'haumea', 'makemake', 'eris'])(
    '%s: Umlaufzeit aus LDot stimmt mit dem dritten Keplerschen Gesetz überein',
    (id) => {
      const orbit = bodyIndex[id]!.orbit!;
      const periodeAusLDot = 36525 / (orbit.LDot / 360) / 365.25;
      const periodeKepler = Math.pow(orbit.a, 1.5);
      expect(Math.abs(periodeAusLDot - periodeKepler) / periodeKepler).toBeLessThan(0.001);
    },
  );

  // Der Sondertest aus dem Task-10-Brief: Plutos Perihel liegt innerhalb
  // der Neptunbahn. a(1-e) ≈ 29,7 AE gegen Neptuns 30,07 AE. Der Test
  // belegt zugleich, dass Halbachse und Exzentrizität zueinander passen.
  it('führt Pluto im Perihel innerhalb der Neptunbahn', () => {
    const p = bodyIndex['pluto']!.orbit!;
    const perihel = p.a * (1 - p.e);
    expect(perihel).toBeLessThan(bodyIndex['neptune']!.orbit!.a);
    expect(perihel).toBeGreaterThan(29);
  });
});
