import { describe, it, expect } from 'vitest';
import { SCENES } from './scenes';
import { bodyIndex } from './index';
import { de } from '../ui/i18n/de';

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
