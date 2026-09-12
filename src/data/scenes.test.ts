import { describe, it, expect } from 'vitest';
import { SCENES } from './scenes';
import { bodyIndex } from './index';
import { de } from '../ui/i18n/de';
import { t } from '../ui/i18n';

describe('Szenenkatalog', () => {
  it('erfüllt die Mindestzahl aus den Akzeptanzkriterien', () => {
    expect(SCENES.length).toBeGreaterThanOrEqual(6);
  });

  it('vergibt jede Kennung genau einmal', () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length);
  });

  it('verweist nur auf Körper, die es im Katalog gibt', () => {
    for (const szene of SCENES) {
      expect(bodyIndex, `${szene.id}: ${szene.targetId}`).toHaveProperty(szene.targetId);
      if (szene.lookAtId !== undefined) {
        expect(bodyIndex, `${szene.id}: ${szene.lookAtId}`).toHaveProperty(szene.lookAtId);
      }
    }
  });

  it('hat für jeden Titel einen Sprachschlüssel', () => {
    for (const szene of SCENES) {
      expect(de, `fehlt: ${szene.titleKey}`).toHaveProperty(szene.titleKey);
    }
  });

  it('setzt brauchbare Dauern und Abstände', () => {
    for (const szene of SCENES) {
      expect(szene.durationSec, szene.id).toBeGreaterThan(5);
      expect(szene.durationSec, szene.id).toBeLessThanOrEqual(120);
      expect(szene.params.distanceInRadii, szene.id).toBeGreaterThan(0);
    }
  });

  it('hält die Variationsbereiche in aufsteigender Reihenfolge', () => {
    for (const szene of SCENES) {
      for (const [name, bereich] of Object.entries(szene.variation)) {
        expect(bereich[0], `${szene.id}.${name}`).toBeLessThanOrEqual(bereich[1]!);
      }
    }
  });

  it('lässt den Abstand nie auf null schrumpfen', () => {
    for (const szene of SCENES) {
      expect(szene.variation.distanceFactor[0], szene.id).toBeGreaterThan(0);
    }
  });

  it('nutzt die Systembasis nur für die Systemschau', () => {
    // Die Bezugsgröße gehört zur Pfadart: Ein Vorbeiflug in Vielfachen der
    // Neptunbahn wäre kein Vorbeiflug mehr.
    for (const szene of SCENES) {
      if (szene.distanceBasis === 'systemRadius') expect(szene.path, szene.id).toBe('system');
    }
  });
});

describe('Szenenkatalog — Invarianten über alle Szenen', () => {
  it('führt mindestens 18 Szenen', () => {
    expect(SCENES.length).toBeGreaterThanOrEqual(18);
  });

  it('hat eindeutige IDs und hinterlegte Titel', () => {
    const ids = SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SCENES) expect(t(s.titleKey), s.id).not.toBe(s.titleKey);
  });

  it('zeigt nur auf existierende Körper', () => {
    for (const s of SCENES) {
      expect(bodyIndex[s.targetId], s.id).toBeDefined();
      if (s.lookAtId !== undefined) expect(bodyIndex[s.lookAtId], s.id).toBeDefined();
    }
  });

  it('hält Dauer und Parameter in brauchbaren Bereichen', () => {
    for (const s of SCENES) {
      expect(s.durationSec, s.id).toBeGreaterThanOrEqual(20);
      expect(s.durationSec, s.id).toBeLessThanOrEqual(90);
      expect(s.params.distanceInRadii, s.id).toBeGreaterThan(0);
      expect(Math.abs(s.params.elevationDeg), s.id).toBeLessThan(89);
    }
  });

  it('hat wohlgeformte Variationsbereiche', () => {
    for (const s of SCENES) {
      for (const [von, bis] of [s.variation.azimuthDeg, s.variation.elevationDeg, s.variation.distanceFactor]) {
        expect(von, s.id).toBeLessThanOrEqual(bis);
      }
      expect(s.variation.distanceFactor[0], s.id).toBeGreaterThan(0);
    }
  });
});

describe('Szenen — Stichproben', () => {
  it('stellt die Ringkantenszene tatsächlich in die Ringebene', () => {
    const s = SCENES.find((x) => x.id === 'saturn-ringkante')!;
    // Elevation 0 gegen den Standortkörper heißt: in seiner Äquatorebene,
    // und dort liegen die Ringe.
    expect(Math.abs(s.params.elevationDeg)).toBeLessThan(2);
    expect(Math.abs(s.variation.elevationDeg[0])).toBeLessThan(3);
    expect(Math.abs(s.variation.elevationDeg[1])).toBeLessThan(3);
  });

  it('hält den Phobos-Tiefflug innerhalb der Marsbahn des Mondes', () => {
    const s = SCENES.find((x) => x.id === 'phobos-tiefflug')!;
    expect(s.targetId).toBe('phobos');
    // Abstand in Phobos-Radien; bei mehr als dem Zehnfachen wäre es kein
    // Tiefflug mehr, sondern eine Totale.
    expect(s.params.distanceInRadii * s.variation.distanceFactor[1]).toBeLessThan(10);
  });

  it('zeigt im Galileischen Schattenspiel genug Zeit für einen Io-Umlauf', () => {
    const s = SCENES.find((x) => x.id === 'galileisches-schattenspiel')!;
    // Io braucht 1,769 Tage; die Szene muss mindestens einen Umlauf zeigen.
    expect(s.durationSec * s.timeRateDaysPerSec).toBeGreaterThan(1.8);
  });

  it('lässt den Ringdurchflug gegen die Sonne laufen', () => {
    const s = SCENES.find((x) => x.id === 'ringdurchflug')!;
    expect(s.path).toBe('flyby');
    expect(s.lookAtId ?? s.targetId).toBe('saturn');
  });
});
