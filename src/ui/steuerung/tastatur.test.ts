// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { tastaturAnhaengen, tastenAbsicht } from './tastatur';
import type { Flugtaste, Tastatur } from './tastatur';
import { handleShortcut } from '../shortcuts/useShortcuts';

let tastatur: Tastatur | null = null;
afterEach(() => {
  tastatur?.loesen();
  tastatur = null;
  document.body.innerHTML = '';
});

function taste(
  typ: 'keydown' | 'keyup', code: string, extra: KeyboardEventInit = {}, ziel: EventTarget = window,
): KeyboardEvent {
  const e = new KeyboardEvent(typ, { code, bubbles: true, cancelable: true, ...extra });
  ziel.dispatchEvent(e);
  return e;
}

describe('tastaturAnhaengen', () => {
  it('merkt gehaltene Flugtasten nach e.code und vergisst sie beim Loslassen', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { key: 'w' });
    taste('keydown', 'KeyD', { key: 'd' });
    expect([...tastatur.stand().gehalten].sort()).toEqual(['KeyD', 'KeyW']);
    taste('keyup', 'KeyW', { key: 'w' });
    expect([...tastatur.stand().gehalten]).toEqual(['KeyD']);
  });

  it('erkennt die Lage, nicht den Buchstaben (französische Tastatur: Z auf KeyW)', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { key: 'z' });
    taste('keydown', 'KeyZ', { key: 'w' });
    expect([...tastatur.stand().gehalten]).toEqual(['KeyW']);
  });

  it('übergeht Wiederholungen, Strg/Alt/Meta und Eingabefelder', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { repeat: true });
    taste('keydown', 'KeyA', { ctrlKey: true });
    taste('keydown', 'KeyS', { altKey: true });
    taste('keydown', 'KeyD', { metaKey: true });
    const feld = document.createElement('input');
    document.body.appendChild(feld);
    taste('keydown', 'KeyE', {}, feld);
    expect(tastatur.stand().gehalten.size).toBe(0);
  });

  it('verhindert die Standardwirkung nur bei angenommenen Flugtasten', () => {
    tastatur = tastaturAnhaengen(window);
    expect(taste('keydown', 'KeyW').defaultPrevented).toBe(true);
    expect(taste('keydown', 'KeyH').defaultPrevented).toBe(false);
    expect(taste('keydown', 'KeyA', { ctrlKey: true }).defaultPrevented).toBe(false);
  });

  it('merkt Shift vom letzten Tastenereignis', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'ShiftLeft', { key: 'Shift', shiftKey: true });
    taste('keydown', 'KeyA', { shiftKey: true });
    expect(tastatur.stand().shift).toBe(true);
    taste('keyup', 'ShiftLeft', { key: 'Shift', shiftKey: false });
    expect(tastatur.stand().shift).toBe(false);
    expect(tastatur.stand().gehalten.has('KeyA')).toBe(true);
  });

  it('vergisst alles beim Verlassen des Fensters und beim Verbergen der Seite', () => {
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyW', { shiftKey: true });
    window.dispatchEvent(new Event('blur'));
    expect(tastatur.stand().gehalten.size).toBe(0);
    expect(tastatur.stand().shift).toBe(false);
    taste('keydown', 'KeyW');
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(tastatur.stand().gehalten.size).toBe(0);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  });

  it('läuft vor einem schon registrierten Kürzel-Listener, auch auf fremden Layouts (M3)', () => {
    // Simuliert useShortcuts.ts: bereits vor dem Flug-Listener registriert,
    // liest e.defaultPrevented. Colemag/Neo/Bépo: code KeyS, aber key 'r'.
    let ausgeloest = false;
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (handleShortcut(e.key)) { e.preventDefault(); ausgeloest = true; }
    };
    window.addEventListener('keydown', onKeyDown);
    tastatur = tastaturAnhaengen(window);
    taste('keydown', 'KeyS', { key: 'r' });
    window.removeEventListener('keydown', onKeyDown);
    expect(tastatur.stand().gehalten.has('KeyS')).toBe(true);
    expect(ausgeloest).toBe(false);
  });

  it('hört nach loesen() nicht mehr zu', () => {
    tastatur = tastaturAnhaengen(window);
    tastatur.loesen();
    taste('keydown', 'KeyW');
    expect(tastatur.stand().gehalten.size).toBe(0);
  });
});

describe('tastenAbsicht', () => {
  const absicht = (...tasten: Flugtaste[]) => tastenAbsicht(new Set(tasten));

  it('bildet vor, seit und hoch aus den gehaltenen Tasten', () => {
    expect(absicht('KeyW', 'KeyD', 'KeyE')).toEqual({ vor: 1, seit: 1, hoch: 1 });
    expect(absicht('KeyS', 'KeyA', 'KeyQ')).toEqual({ vor: -1, seit: -1, hoch: -1 });
  });

  it('lässt gegenläufige Tasten sich aufheben', () => {
    expect(absicht('KeyW', 'KeyS')).toEqual({ vor: 0, seit: 0, hoch: 0 });
  });
});
