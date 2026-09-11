import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE, useStore } from './index';
import { toShareable, fromShareable, encodeState, decodeState } from './serialize';
import type { AppState } from './types';

const abgewandelt = (): AppState => {
  const s = structuredClone(DEFAULT_STATE);
  s.time.jd = 2461294.5;
  s.time.rateDaysPerSec = -30;
  s.scale.distanceExponent = 0.42;
  s.camera.targetId = 'saturn';
  s.camera.mode = 'attached';
  s.visible.mercury = false;
  return s;
};

describe('toShareable', () => {
  it('liefert für den Standardzustand ein leeres Objekt', () => {
    expect(toShareable(structuredClone(DEFAULT_STATE))).toEqual({});
  });

  it('nimmt ausschließlich Abweichungen auf', () => {
    const patch = toShareable(abgewandelt());
    const text = JSON.stringify(patch);
    expect(text).toContain('saturn');
    expect(text).not.toContain('brightness');
    expect(text.length).toBeLessThan(300);
  });
});

describe('Round-Trip', () => {
  it('stellt den Zustand über toShareable und fromShareable exakt wieder her', () => {
    const original = abgewandelt();
    expect(fromShareable(toShareable(original))).toEqual(original);
  });

  it('stellt den Zustand über die URL-Kodierung exakt wieder her', () => {
    const original = abgewandelt();
    expect(decodeState(encodeState(original))).toEqual(original);
  });

  it('kodiert URL-sicher', () => {
    const fragment = encodeState(abgewandelt());
    expect(fragment).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('fällt bei beschädigtem Fragment auf den Standardzustand zurück', () => {
    expect(decodeState('kein-gueltiges-base64!!')).toEqual(DEFAULT_STATE);
    expect(decodeState('')).toEqual(DEFAULT_STATE);
  });

  // Ruling 2: Der Base64-Pfad läuft über TextEncoder/TextDecoder statt über
  // das veraltete escape/unescape-Idiom. Ein Zeichen außerhalb von ASCII
  // deckt genau diesen Pfad ab — mit escape/unescape wäre das Ergebnis
  // beschädigt oder der Aufruf hätte eine Deprecation-Warnung ausgelöst.
  it('behält ein Nicht-ASCII-Zeichen beim Kodieren und Dekodieren exakt bei', () => {
    const original = structuredClone(DEFAULT_STATE);
    original.camera.targetId = 'jüpiter-testkörper';
    expect(decodeState(encodeState(original))).toEqual(original);
  });
});

describe('toggleVisible', () => {
  // Ruling 1: Erneutes Anzeigen muss den Schlüssel aus `visible` entfernen,
  // nicht auf `true` setzen — sonst wächst das geteilte Fragment mit jedem
  // Aus- und wieder Einblenden eines Körpers unbegrenzt weiter.
  it('kehrt nach Ausblenden und erneutem Anzeigen zu einem leeren visible-Objekt zurück', () => {
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));

    useStore.getState().toggleVisible('mercury');
    expect(useStore.getState().visible).toEqual({ mercury: false });

    useStore.getState().toggleVisible('mercury');
    expect(useStore.getState().visible).toEqual({});
  });
});
