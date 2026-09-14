import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE, useStore } from './index';
import { toShareable, fromShareable, encodeState, decodeState, encodePatch } from './serialize';
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

  it('nimmt eine Abweichung von display.shadows auf, der Standardzustand bleibt leer', () => {
    // Task 2: display.shadows ist ein gewöhnliches Feld unter display —
    // diff ist generisch, aber dieser Test belegt es konkret statt es nur
    // anzunehmen.
    const state = structuredClone(DEFAULT_STATE);
    state.display.shadows = false;
    expect(toShareable(state)).toEqual({ display: { shadows: false } });
    expect(toShareable(structuredClone(DEFAULT_STATE))).toEqual({});
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
    original.visible['körper-über'] = true;
    expect(decodeState(encodeState(original))).toEqual(original);
  });
});

/** Base64URL-Kodierung von rohem Text, unabhängig von encodeState — baut
 * Fragmente, die encodeState so nie erzeugen würde (etwa mit einem
 * __proto__-Schlüssel oder ungültigem JSON), um decodeState direkt gegen
 * beliebige Fragmente zu prüfen. */
function zuFragment(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binaer = '';
  for (const b of bytes) binaer += String.fromCharCode(b);
  return btoa(binaer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

describe('decodeState — Robustheit gegen manipulierte Fragmente', () => {
  it('lässt sich nicht per __proto__-Schlüssel im Fragment auf den Prototyp durchgreifen', () => {
    // Objektliteral-Syntax würde __proto__ selbst als Prototyp interpretieren
    // statt als Eigenschaft — deshalb hier ein wörtlicher JSON-Text, genauso
    // wie ein Angreifer ihn im URL-Fragment platzieren würde.
    const fragment = zuFragment('{"__proto__":{"polluted":true}}');
    const ergebnis = decodeState(fragment);

    expect(Object.getPrototypeOf(ergebnis)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(ergebnis, 'polluted')).toBe(false);
    expect((ergebnis as unknown as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('fällt bei gültigem Base64, das kein gültiges JSON ergibt, auf den Standardzustand zurück', () => {
    // Unterscheidet sich vom Test oben mit ungültigen Base64-Zeichen: hier
    // ist die Base64-Dekodierung selbst erfolgreich, erst JSON.parse scheitert.
    const fragment = zuFragment('das ist kein JSON {');
    expect(decodeState(fragment)).toEqual(DEFAULT_STATE);
  });
});

describe('diff-Grenze: nur Hinzufügungen und Änderungen', () => {
  // diff bildet ausschließlich vom Standard abweichende Schlüssel ab, niemals
  // aus dem aktuellen Zustand gelöschte. Das ist nur deshalb unschädlich, weil
  // visible im Standardzustand leer ist — es kann also nie unter seinen
  // Standard "schrumpfen". Bekäme visible künftig nicht-leere Standardeinträge,
  // müsste diff zuerst lernen, Löschungen darzustellen; dieser Test macht eine
  // solche Änderung sichtbar, statt sie als stillen Datenverlust in einem
  // geteilten Link enden zu lassen.
  it('geht davon aus, dass DEFAULT_STATE.visible leer ist', () => {
    expect(DEFAULT_STATE.visible).toEqual({});
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

describe('decodeState — Prüfung (Pflichtpunkt 4b)', () => {
  it('fällt bei unbekannter Sprache auf Deutsch zurück und behält den Rest', () => {
    const s = decodeState(encodePatch({ ui: { language: 'fr' }, time: { paused: true } }));
    expect(s.ui.language).toBe('de');
    expect(s.time.paused).toBe(true);
  });

  it('verwirft ein Feld mit falschem Typ, nicht das Fragment', () => {
    const s = decodeState(encodePatch({ time: { jd: 'x', rateDaysPerSec: 7 } }));
    expect(s.time.jd).toBe(DEFAULT_STATE.time.jd);
    expect(s.time.rateDaysPerSec).toBe(7);
  });

  it('lässt Funktionen im Zustand nicht in den Patch', () => {
    const mitAktion = { ...structuredClone(DEFAULT_STATE), setTime: () => undefined } as unknown as AppState;
    expect(toShareable(mitAktion)).toEqual({});
  });
});
