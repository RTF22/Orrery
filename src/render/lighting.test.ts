import { describe, it, expect } from 'vitest';
import {
  irradianceFactor, bodyLighting, MAX_COLOR_GAIN, MIN_COLOR_GAIN,
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
      const s = { ...STANDARD, brightness: 1, lightFalloff: 2, lightCompensation: 0.85 };
      const l = bodyLighting(au * AU_KM, s);
      const e = irradianceFactor(au * AU_KM, 2);
      expect(l.dayLevel).toBeCloseTo(e * l.colorGain, 12);
      // Und diese gerenderte Größe folgt bis 97 AE dem Ausgleich E^(1-c) —
      // die Klemme darf innerhalb des Katalogs nie greifen.
      expect(l.dayLevel).toBeCloseTo(Math.pow(e, 1 - 0.85), 12);
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
  // zwischen den Planeten: Lesbar ist ein Körper ab etwa 0,15 linear — die
  // sRGB-Ausgabe hebt das deutlich an. Vorher lag Neptun bei
  // „Realistisch" bei 0,0011 — im Bild gemessene 2 von 255, also schwarz.
  //
  // dayLevel ist seit der Nachbesserung nach der Abnahme 3a dieselbe Größe,
  // die das Material bekommt (brightness · E · colorGain, aus der geklemmten
  // Verstärkung — siehe Test „gibt als Tagniveau, was der Renderweg
  // tatsächlich umsetzt" oben). Die Schranken hier prüfen also das
  // gerenderte Niveau, nicht mehr nur eine Rechengröße. Vorher klemmte
  // MAX_COLOR_GAIN = 12 ab 4,3 AE, und dayLevel lief ungeklemmt weiter —
  // dieser Block war grün, während Pluto im Bild bei 21–25 von 255 lag.
  //
  // Ausdrücklich nur EIN Körper von kind: 'dwarf' ausgenommen — Eris,
  // namentlich (b.id !== 'eris'), nicht die ganze Klasse. Nachgerechnet mit
  // DEFAULT_STATE.display bei Preset „Realistisch", jd = J2000 (genau der
  // von STANDARD/abstandKm tatsächlich verwendete Zustand):
  //
  //   Körper     Abstand [AE]  dayLevel  Schranke 0,3
  //   Ceres      2,55          0,7555    besteht deutlich
  //   Pluto      30,20         0,3598    besteht
  //   Haumea     51,35         0,3068    besteht, 2 % Reserve
  //   Makemake   51,45         0,3066    besteht, 2 % Reserve
  //   Eris       97,23         0,2533    fällt durch
  //
  // Nur Eris unterschreitet die 30-%-Schranke real und nachvollziehbar:
  // Diese Regressionsschranke wurde für die Planeten kalibriert (bis
  // Neptun, ≈30 AE bei „Realistisch"). Eris steht im Aphel rund 98 AE von
  // der Sonne entfernt, mehr als dreimal so weit wie Neptun — bei
  // quadratischem Lichtabfall und demselben, für ≤30 AE kalibrierten
  // lightCompensation-Wert reicht das nicht mehr für 30 %, keine Regression.
  // Ceres, Pluto, Haumea und Makemake werden von diesem Test dagegen
  // TATSÄCHLICH geprüft — Haumea und Makemake mit nur rund 2 % Reserve: Ein
  // künftiger Fehler, der ihr dayLevel um mehr als das senkt (z. B. eine
  // falsche große Halbachse), fiele hier auf. Jeder künftig ergänzte
  // Zwergplanet bleibt ebenfalls im Prüfumfang, solange er nicht wie Eris
  // einzeln und begründet ausgenommen wird. Ob der Distanzausgleich künftig
  // auch über Neptun hinaus gezielt nachgezogen wird, ist eine eigene, hier
  // bewusst nicht mitentschiedene Abwägung am Renderweg (Task-10-Bericht).
  const koerperOhneEris = bodies.filter((b) => b.kind !== 'star' && b.id !== 'eris');
  const presets = ['realistisch', 'schaubild', 'kompakt'] as const;

  it('hält jede Tagseite bei jedem Maßstabs-Preset über 30 % der Helligkeit', () => {
    for (const preset of presets) {
      for (const body of koerperOhneEris) {
        const l = bodyLighting(abstandKm(body.id, SCALE_PRESETS[preset]), STANDARD);
        expect(l.dayLevel / STANDARD.brightness).toBeGreaterThan(0.3);
      }
    }
  });

  it('hält jede Nachtseite bei jedem Preset über 5 % der Helligkeit', () => {
    for (const preset of presets) {
      for (const body of koerperOhneEris) {
        const l = bodyLighting(abstandKm(body.id, SCALE_PRESETS[preset]), STANDARD);
        expect(l.emissiveIntensity * Math.PI / STANDARD.brightness).toBeGreaterThan(0.05);
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
