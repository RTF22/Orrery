import type { Ablage } from '../store/persist';

/** Kleiner Speicher-Fake für Tests: eine Map hinter der Ablage-Schnittstelle. */
export function ablageFake(): Ablage & { daten: Map<string, string> } {
  const daten = new Map<string, string>();
  return {
    daten,
    getItem: (k) => daten.get(k) ?? null,
    setItem: (k, v) => { daten.set(k, v); },
    removeItem: (k) => { daten.delete(k); },
  };
}
