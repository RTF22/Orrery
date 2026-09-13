import { describe, it, expect } from 'vitest';
import {
  irradianceFactor, bodyLighting, MAX_COLOR_GAIN, MIN_COLOR_GAIN,
  targetExposure, EXPOSURE_REFERENCE,
} from './lighting';
import type { LightingSettings } from './lighting';
import { DEFAULT_STATE } from '../store';
import { AU_KM } from '../sim/orbit';
import { bodies, bodyIndex } from '../data/index';
import { scaledPositionAt, SCALE_PRESETS } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';

const STANDARD: LightingSettings = DEFAULT_STATE.display;

/** Abstand eines Körpers von der Sonne im dargestellten Maßstab. */
function abstandKm(id: string, s: ScaleSettings = DEFAULT_STATE.scale): number {
  const p = scaledPositionAt(id, bodyIndex, DEFAULT_STATE.time.jd, s);
  return Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
}

describe('irradianceFactor', () => {
  it('ist bei 1 AE genau 1 — der Fixpunkt der Kalibrierung in scene.ts', () => {
    expect(irradianceFactor(AU_KM, 2)).toBeCloseTo(1, 12);
    expect(irradianceFactor(AU_KM, 0.6)).toBeCloseTo(1, 12);
  });

  it('fällt mit dem gewählten Exponenten', () => {
    expect(irradianceFactor(2 * AU_KM, 2)).toBeCloseTo(0.25, 12);
    expect(irradianceFactor(2 * AU_KM, 1)).toBeCloseTo(0.5, 12);
  });

  it('ist bei Exponent 0 überall gleich', () => {
    expect(irradianceFactor(30 * AU_KM, 0)).toBeCloseTo(1, 12);
  });

  it('liefert für den Ursprung den Bezugswert statt unendlich', () => {
    expect(irradianceFactor(0, 2)).toBe(1);
  });
});

describe('bodyLighting — Tagseite', () => {
  it('ist bei Ausgleich 0 physikalisch: Tagniveau gleich Bestrahlungsstärke', () => {
    const s = { ...STANDARD, brightness: 1, lightFalloff: 2, lightCompensation: 0 };
    expect(bodyLighting(4 * AU_KM, s).dayLevel).toBeCloseTo(1 / 16, 12);
    expect(bodyLighting(4 * AU_KM, s).colorGain).toBeCloseTo(1, 12);
  });

  it('ist bei Ausgleich 1 für jeden Abstand gleich hell', () => {
    const s = { ...STANDARD, lightCompensation: 1 };
    const nah = bodyLighting(0.4 * AU_KM, s).dayLevel;
    const fern = bodyLighting(30 * AU_KM, s).dayLevel;
    expect(fern).toBeCloseTo(nah, 12);
    expect(fern).toBeCloseTo(s.brightness, 12);
  });

  it('skaliert linear mit der Helligkeit — auch bei vollem Ausgleich', () => {
    const eins = bodyLighting(9 * AU_KM, { ...STANDARD, brightness: 1, lightCompensation: 1 });
    const drei = bodyLighting(9 * AU_KM, { ...STANDARD, brightness: 3, lightCompensation: 1 });
    expect(drei.dayLevel).toBeCloseTo(3 * eins.dayLevel, 12);
  });

  it('gibt als Tagniveau, was der Renderweg tatsächlich umsetzt: brightness · E · colorGain', () => {
    // Befund aus der Abnahme 3a (docs/phase3a-abnahme.md, Nachtrag): Pluto
    // blieb bei 30 AE trotz Distanzausgleich bei einem Median von 21–25 von
    // 255. Ursache war die Klemme der Farbverstärkung: dayLevel rechnete
    // E^(1-c), das Material bekam aber nur MAX_COLOR_GAIN · E. Das Tagniveau
    // muss die Größe sein, die auf dem Material auch ankommt — sonst prüfen
    // die Schranken unten eine Zahl, die kein Pixel je erreicht.
    for (const au of [1, 5.2, 9.6, 30, 97]) {
      const c = STANDARD.lightCompensation;
      const s = { ...STANDARD, brightness: 1, lightFalloff: 2, lightCompensation: c };
      const l = bodyLighting(au * AU_KM, s);
      const e = irradianceFactor(au * AU_KM, 2);
      expect(l.dayLevel).toBeCloseTo(e * l.colorGain, 12);
      // Und diese gerenderte Größe folgt bis 97 AE dem Ausgleich E^(1-c) —
      // die Klemme darf innerhalb des Katalogs nie greifen.
      expect(l.dayLevel).toBeCloseTo(Math.pow(e, 1 - c), 12);
    }
  });

  it('hält die Farbverstärkung in Grenzen', () => {
    const fern = bodyLighting(1e-6 * AU_KM, { ...STANDARD, lightCompensation: 1 });
    expect(fern.colorGain).toBeLessThanOrEqual(MAX_COLOR_GAIN);
    const winzig = bodyLighting(1e6 * AU_KM, { ...STANDARD, lightCompensation: 1 });
    expect(winzig.colorGain).toBeGreaterThanOrEqual(MIN_COLOR_GAIN);
  });
});

describe('bodyLighting — Nachtseite', () => {
  it('ist bei nightFill 0 vollständig unbeleuchtet', () => {
    expect(bodyLighting(AU_KM, { ...STANDARD, nightFill: 0 }).emissiveIntensity).toBe(0);
  });

  it('hält denselben Anteil der Tagseite, unabhängig vom Abstand', () => {
    const s = { ...STANDARD, nightFill: 0.2 };
    for (const au of [0.4, 1, 9.6, 30]) {
      const l = bodyLighting(au * AU_KM, s);
      // Das Emissiv trägt kein 1/π des Lambert-BRDF, der direkte Anteil schon
      // — deshalb der Faktor π beim Rückrechnen.
      expect(l.emissiveIntensity * Math.PI / l.dayLevel).toBeCloseTo(0.2, 12);
    }
  });

  it('bleibt auch bei 30 AE und quadratischem Abfall über null', () => {
    const s = { ...STANDARD, lightFalloff: 2, lightCompensation: 0 };
    expect(bodyLighting(30 * AU_KM, s).emissiveIntensity).toBeGreaterThan(0);
  });
});

describe('Standardeinstellung — kein Körper bleibt schwarz', () => {
  // Der Befund aus dem 30-Minuten-Dauerlauf: Planeten waren vollständig
  // schwarz. Dieser Block ist die Regressionsschranke dafür. Geprüft wird
  // absolut (Anteil der Helligkeitseinstellung), nicht als Verhältnis
  // zwischen den Planeten. Vorher lag Neptun bei „Realistisch" bei 0,0011 —
  // im Bild gemessene 2 von 255, also schwarz.
  //
  // dayLevel ist seit der Nachbesserung nach der Abnahme 3a dieselbe Größe,
  // die das Material bekommt (brightness · E · colorGain, aus der geklemmten
  // Verstärkung — siehe Test „gibt als Tagniveau, was der Renderweg
  // tatsächlich umsetzt" oben). Die Schranken hier prüfen also das
  // gerenderte Niveau, nicht mehr nur eine Rechengröße. Vorher klemmte
  // MAX_COLOR_GAIN = 12 ab 4,3 AE, und dayLevel lief ungeklemmt weiter —
  // dieser Block war grün, während Pluto im Bild bei 21–25 von 255 lag.
  //
  // Was die Schranken seit der Zielbelichtung bedeuten: Die Kamera belichtet
  // auf ihr Ziel (targetExposure), der betrachtete Körper erreicht also
  // immer die Referenz — unabhängig vom Distanzausgleich. dayLevel bei
  // Helligkeit 1 ist dann genau die Strahldichte einer weißen Fläche in der
  // Systemschau (Ziel Sonne, Faktor π, den Three mit 1/π wieder kürzt):
  // die eine Ansicht, in der alle Körper mit einer gemeinsamen Belichtung
  // nebeneinander stehen. Dort und nur dort entscheidet der Ausgleich über
  // Sichtbarkeit. Kriterium des Entwurfs (Abschnitt 5) für diese Ansicht:
  // fernster Planet über 40 von 255 auf der Tagseite, über 12 auf der
  // Nachtseite — nach ACES und sRGB entspricht das linear rund 0,039 bzw.
  // 0,013 für eine weiße Fläche.
  //
  // Nachgerechnet mit DEFAULT_STATE.display (lightCompensation 0,7) bei
  // Preset „Realistisch", jd = J2000 — dem Preset mit den größten Abständen
  // und genau dem von STANDARD/abstandKm verwendeten Zustand:
  //
  //   Körper     Abstand [AE]  dayLevel  Nachtseite  Schranke 0,06 / 0,015
  //   Ceres      2,55          0,5708    0,1427      besteht deutlich
  //   Neptun     30,12         0,1296    0,0324      besteht
  //   Pluto      30,20         0,1294    0,0324      besteht
  //   Haumea     51,35         0,0941    0,0235      besteht
  //   Makemake   51,45         0,0940    0,0235      besteht
  //   Eris       97,23         0,0642    0,0160      besteht, 7 % Reserve
  //
  // Die Schranken liegen über dem Kriterium des Entwurfs (0,039 / 0,013)
  // und 7 % unter Eris, dem fernsten Körper des Katalogs. Damit prüft der
  // Block ALLE Körper — die frühere Ausnahme für Eris (bei 0,85 kalibrierte
  // 30-%-Schranke, die Eris mit 0,2533 verfehlte) entfällt. Ein künftiger
  // Fehler, der das Niveau eines fernen Körpers um mehr als diese Reserve
  // senkt (falsche große Halbachse, eine wieder greifende Klemme, ein
  // versehentlich gesenkter Ausgleich: schon 0,65 drückt Eris auf 0,041),
  // fällt hier auf. Die Messung, die diese Kalibrierung trägt, steht in
  // docs/phase3a-abnahme.md (Nachtrag 13.09.2026): Systemschau bei 0,7,
  // Neptun 136, Uranus 108 (Maximum) bzw. 74,5 (Median) von 255.
  const koerper = bodies.filter((b) => b.kind !== 'star');
  const presets = ['realistisch', 'schaubild', 'kompakt'] as const;

  it('steht auf dem in der Systemschau gemessenen Distanzausgleich 0,7', () => {
    // Seit der Zielbelichtung bestimmt der Ausgleich nicht mehr, wie hell der
    // betrachtete Körper ist (das regelt targetExposure), sondern nur die
    // Staffelung der übrigen Körper im selben Bild. Der Wert ist gemessen,
    // nicht geschätzt (docs/phase3a-abnahme.md, Nachtrag 13.09.2026):
    // Systemschau bei 0,7 zeigt Neptun mit 136 und Uranus mit 108 (Maximum)
    // bzw. 74,5 (Median) von 255 — weit über dem Kriterium 40 bzw. 12 des
    // Entwurfs, bei physikalischerer Abstufung als mit 0,85.
    expect(STANDARD.lightCompensation).toBe(0.7);
  });

  it('hält jede Tagseite bei jedem Maßstabs-Preset über 6 % der Helligkeit — auch Eris', () => {
    for (const preset of presets) {
      for (const body of koerper) {
        const l = bodyLighting(abstandKm(body.id, SCALE_PRESETS[preset]), STANDARD);
        expect(l.dayLevel / STANDARD.brightness, `${body.id} @ ${preset}`).toBeGreaterThan(0.06);
      }
    }
  });

  it('hält jede Nachtseite bei jedem Preset über 1,5 % der Helligkeit — auch Eris', () => {
    for (const preset of presets) {
      for (const body of koerper) {
        const l = bodyLighting(abstandKm(body.id, SCALE_PRESETS[preset]), STANDARD);
        expect(l.emissiveIntensity * Math.PI / STANDARD.brightness, `${body.id} @ ${preset}`).toBeGreaterThan(0.015);
      }
    }
  });

  it('lässt ferne Körper trotzdem dunkler bleiben als nahe', () => {
    // Der Ausgleich staucht den Bereich, er hebt ihn nicht auf: Die
    // Abstandsstaffelung muss erkennbar bleiben.
    const merkur = bodyLighting(abstandKm('mercury'), STANDARD).dayLevel;
    const jupiter = bodyLighting(abstandKm('jupiter'), STANDARD).dayLevel;
    const neptun = bodyLighting(abstandKm('neptune'), STANDARD).dayLevel;
    expect(merkur).toBeGreaterThan(jupiter);
    expect(jupiter).toBeGreaterThan(neptun);
  });
});

describe('targetExposure — die Kamera belichtet auf das Ziel', () => {
  it('bringt eine weiße Lambert-Fläche am Zielabstand auf die Referenz', () => {
    // Der Renderweg: Das Material bekommt brightness · E · colorGain (= dayLevel),
    // Three gewichtet den direkten Anteil mit 1/π. Die gerenderte Strahldichte
    // der weißen Fläche ist also dayLevel / π — und die muss am Ziel genau
    // EXPOSURE_REFERENCE sein, bei jedem Abstand und jedem Ausgleich.
    for (const au of [0.4, 1, 5.2, 30, 97]) {
      for (const c of [0, 0.7, 1]) {
        const s = { ...STANDARD, brightness: 1, lightCompensation: c };
        const exposure = targetExposure(au * AU_KM, s);
        const l = bodyLighting(au * AU_KM, { ...s, brightness: s.brightness * exposure });
        expect(l.dayLevel / Math.PI, `${au} AE, c=${c}`).toBeCloseTo(EXPOSURE_REFERENCE, 10);
      }
    }
  });

  it('liefert für die Sonne im Ursprung die Referenz 1 AE: Faktor π', () => {
    // irradianceFactor gibt im Ursprung den Bezugswert 1 — die Systemschau
    // (Ziel Sonne) ist damit die Kamera bei 1 AE, ohne Sonderregel.
    expect(targetExposure(0, STANDARD)).toBeCloseTo(Math.PI, 12);
    expect(targetExposure(AU_KM, STANDARD)).toBeCloseTo(Math.PI, 12);
  });

  it('hängt nicht von der Helligkeit ab — die kommt getrennt dazu', () => {
    const eins = targetExposure(9 * AU_KM, { ...STANDARD, brightness: 1 });
    const drei = targetExposure(9 * AU_KM, { ...STANDARD, brightness: 3 });
    expect(drei).toBeCloseTo(eins, 12);
  });

  it('ist bei vollem Distanzausgleich für jeden Abstand gleich', () => {
    const s = { ...STANDARD, lightCompensation: 1 };
    expect(targetExposure(30 * AU_KM, s)).toBeCloseTo(targetExposure(0.4 * AU_KM, s), 12);
  });

  it('steigt mit dem Zielabstand, solange der Ausgleich unvollständig ist', () => {
    expect(targetExposure(30 * AU_KM, STANDARD)).toBeGreaterThan(targetExposure(AU_KM, STANDARD));
  });
});
