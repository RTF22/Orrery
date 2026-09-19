import type { PadRoh } from './gamepad';

/**
 * Nachgebauter Controller für Tests (Entwurf Flug und Controller §8): 17 Tasten
 * der Standardbelegung, gedrückte mit dem Wert 1. Trigger bekommen über
 * `werte` einen eigenen Wert; über 0,5 gilt eine Taste als gedrückt.
 */
export function padAttrappe(teil: {
  axes?: number[];
  gedrueckt?: readonly number[];
  werte?: Readonly<Record<number, number>>;
  mapping?: string;
} = {}): PadRoh {
  const buttons = Array.from({ length: 17 }, (_, i) => {
    const an = teil.gedrueckt?.includes(i) ?? false;
    const value = teil.werte?.[i] ?? (an ? 1 : 0);
    return { pressed: an || value > 0.5, value };
  });
  return { mapping: teil.mapping ?? 'standard', axes: teil.axes ?? [0, 0, 0, 0], buttons };
}
