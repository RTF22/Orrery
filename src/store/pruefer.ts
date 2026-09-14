import { DEFAULT_STATE } from './index';
import { SCALE_PRESETS } from '../sim/scale';
import { bodyIndex } from '../data';

export type Plain = Record<string, unknown>;

/**
 * Schlüssel, die eine Zuweisung über eckige Klammern (`out[key] = ...`) auf
 * einem gewöhnlichen Objekt nicht als neue Eigenschaft anlegt, sondern als
 * Zugriff auf den Prototyp bzw. den Konstruktor selbst behandelt. Jeder von
 * außen kommende Zustand (URL-Fragment, Ablage, Import) ist beliebiges JSON;
 * `{"__proto__":{"boese":true}}` würde ohne diesen Filter den Prototyp des
 * zurückgegebenen Zustands verändern. Eine einzige Stelle für Prüfer und
 * Serialisierung, damit die Liste nicht zweimal gepflegt werden muss.
 */
export const GEFAEHRLICHE_SCHLUESSEL: ReadonlySet<string> = new Set(['__proto__', 'constructor', 'prototype']);

export function istPlain(x: unknown): x is Plain {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

/** Aufzählungen je Pfad; ein Wert außerhalb der Liste wird verworfen. */
const AUFZAEHLUNGEN: Readonly<Record<string, readonly string[]>> = {
  'camera.mode': ['free', 'attached', 'follow', 'cinema'],
  'quality.tier': ['auto', 'low', 'medium', 'high'],
  'ui.language': ['de', 'en'],
  'scale.preset': Object.keys(SCALE_PRESETS),
};

/** Felder, die null sein dürfen, mit dem Typ des Nicht-null-Falls. */
const NULLBAR: Readonly<Record<string, 'number' | 'string'>> = {
  'camera.freezeJd': 'number',
  'scale.preset': 'string',
};

/** Records mit freien Schlüsseln und ausschließlich booleschen Werten. */
const BOOLESCHE_RECORDS: ReadonlySet<string> = new Set(['visible', 'ui.panels']);

/** Markierung für „dieses Feld fällt weg" — undefined wäre als Wert mehrdeutig. */
const VERWORFEN = Symbol('verworfen');

function pruefeRecord(wert: unknown): Plain | typeof VERWORFEN {
  if (!istPlain(wert)) return VERWORFEN;
  const out: Plain = {};
  for (const [k, v] of Object.entries(wert)) {
    if (!GEFAEHRLICHE_SCHLUESSEL.has(k) && typeof v === 'boolean') out[k] = v;
  }
  return out;
}

function pruefeFeld(pfad: string, wert: unknown, standard: unknown): unknown {
  if (BOOLESCHE_RECORDS.has(pfad)) return pruefeRecord(wert);
  if (wert === null) return Object.hasOwn(NULLBAR, pfad) ? null : VERWORFEN;
  if (Object.hasOwn(AUFZAEHLUNGEN, pfad)) {
    return typeof wert === 'string' && AUFZAEHLUNGEN[pfad]?.includes(wert) ? wert : VERWORFEN;
  }
  if (pfad === 'camera.targetId') {
    return typeof wert === 'string' && Object.hasOwn(bodyIndex, wert) ? wert : VERWORFEN;
  }
  if (istPlain(standard)) return istPlain(wert) ? pruefeZweig(pfad, wert, standard) : VERWORFEN;
  const erwartet = NULLBAR[pfad] ?? typeof standard;
  if (typeof wert !== erwartet) return VERWORFEN;
  if (typeof wert === 'number' && !Number.isFinite(wert)) return VERWORFEN;
  return wert;
}

function pruefeZweig(pfad: string, wert: Plain, standard: Plain): Plain {
  const out: Plain = {};
  for (const [key, kind] of Object.entries(wert)) {
    if (GEFAEHRLICHE_SCHLUESSEL.has(key) || !Object.hasOwn(standard, key)) continue;
    const kindPfad = pfad === '' ? key : `${pfad}.${key}`;
    const ergebnis = pruefeFeld(kindPfad, kind, standard[key]);
    if (ergebnis === VERWORFEN) continue;
    // Ein Zweig, aus dem alles herausgefallen ist, ist keine Abweichung mehr.
    if (istPlain(ergebnis) && Object.keys(ergebnis).length === 0) continue;
    out[key] = ergebnis;
  }
  return out;
}

/**
 * Feldweiser Prüfer für Zustände von außen (URL-Fragment, Ablage, Import).
 * Gleicht gegen die Form von DEFAULT_STATE ab: unbekannte Schlüssel fallen
 * weg, Typen müssen zum Standardwert passen, Zahlen endlich sein,
 * Aufzählungen in ihrer Liste liegen, das Kameraziel ein bekannter Körper
 * sein. Ungültig ist immer nur das einzelne Feld, nie der ganze Zustand —
 * ein Link aus einer älteren Version liefert so noch das Gültige. Das
 * Ergebnis ist ein Patch für fromShareable, kein vollständiger Zustand.
 */
export function pruefeZustand(roh: unknown): Plain {
  return istPlain(roh) ? pruefeZweig('', roh, DEFAULT_STATE as unknown as Plain) : {};
}
