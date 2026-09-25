/**
 * Belegung für die Übersicht — Wirkung als Sprachschlüssel. Die Taste selbst
 * ist entweder ein Literal (Buchstaben wie „H") oder, wenn sie einen Namen
 * statt eines Symbols trägt, ebenfalls ein Sprachschlüssel.
 */
/** Zeilen der Kürzelübersicht: Taste (Literal oder Textschlüssel) und Textschlüssel der Wirkung. */
export type Kuerzel = readonly (readonly [string | { key: string }, string])[];

export const KUERZEL: Kuerzel = [
  ['H', 'shortcuts.toggleUi'],
  ['F', 'shortcuts.fullscreen'],
  [{ key: 'key.space' }, 'shortcuts.pause'],
  [{ key: 'key.arrows' }, 'shortcuts.rate'],
  ['R', 'shortcuts.reverse'],
  [{ key: 'key.home' }, 'shortcuts.resetCamera'],
  ['W A S D', 'shortcuts.fly'],
  ['Q E', 'shortcuts.flyUpDown'],
  ['Shift + W A S D', 'shortcuts.orbit'],
  [{ key: 'key.drag' }, 'shortcuts.flyLook'],
  [{ key: 'key.wheel' }, 'shortcuts.flySpeed'],
  ['C', 'shortcuts.cinema'],
  ['N', 'shortcuts.nextScene'],
  ['L', 'shortcuts.language'],
  ['I', 'shortcuts.info'],
  ['?', 'shortcuts.toggleHelp'],
];

/** M ist nur mit Musik des Betreibers belegt (useShortcuts.ts). */
export const MUSIK_KUERZEL: Kuerzel = [['M', 'shortcuts.mute']];

/** Controller nach der Standardbelegung (Entwurf Flug und Controller §5.2, §5.3). */
export const PAD_KUERZEL: Kuerzel = [
  [{ key: 'padKey.leftStick' }, 'shortcuts.padLook'],
  ['RT / LT', 'shortcuts.padFly'],
  [{ key: 'padKey.lbStick' }, 'shortcuts.padOrbit'],
  [{ key: 'padKey.rightStick' }, 'shortcuts.padCrosshair'],
  ['A', 'shortcuts.padGoTo'],
  ['B', 'shortcuts.padSystem'],
  ['R3', 'shortcuts.padCenter'],
  [{ key: 'padKey.dpadSides' }, 'shortcuts.rate'],
  [{ key: 'padKey.dpadUp' }, 'shortcuts.pause'],
  [{ key: 'padKey.dpadDown' }, 'shortcuts.reverse'],
  [{ key: 'padKey.menu' }, 'shortcuts.cinema'],
  ['RB', 'shortcuts.nextScene'],
  [{ key: 'padKey.view' }, 'shortcuts.toggleUi'],
  ['Y', 'shortcuts.info'],
];
