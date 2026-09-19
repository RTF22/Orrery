import { DEFAULT_STATE } from './index';
import { SCALE_PRESETS } from '../sim/scale';
import { bodyIndex } from '../data';
import { istThema, NIVEAUS } from '../data/themen';
import { INFO_BREITE_MAX_REM, INFO_BREITE_MIN_REM, INFO_TEILUNG_MAX, INFO_TEILUNG_MIN } from './types';
import { JD_MIN, JD_MAX } from '../sim/time';

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
  'camera.mode': ['free', 'attached', 'follow', 'cinema', 'fly'],
  'quality.tier': ['auto', 'low', 'medium', 'high'],
  'ui.language': ['de', 'en'],
  'scale.preset': Object.keys(SCALE_PRESETS),
  'ui.info.niveau': NIVEAUS,
};

/** Felder, die null sein dürfen, mit dem Typ des Nicht-null-Falls. */
const NULLBAR: Readonly<Record<string, 'number' | 'string'>> = {
  'camera.freezeJd': 'number',
  'scale.preset': 'string',
  'ui.info.thema': 'string',
};

/** Records mit freien Schlüsseln und ausschließlich booleschen Werten. */
const BOOLESCHE_RECORDS: ReadonlySet<string> = new Set(['visible', 'ui.panels']);

/**
 * Wertebereiche je Zahlpfad. Seit Etappe 2 liest der Import fremde Dateien,
 * „endlich" genügt darum nicht mehr. Die Grenzen sind Zwillinge der Regler
 * und der Kameraeingabe: GROESSE_MIN/MAX in ScalePanel, RATE_MAX in
 * TimePanel, die Reglergrenzen in DisplayPanel und ScalePanel,
 * MIN_/MAX_DISTANCE_KM und ELEVATION_GRENZE in render/camera/input.ts.
 * store/ darf weder ui/ noch render/ importieren, deshalb stehen die Zahlen
 * hier noch einmal; wer dort eine Grenze ändert, zieht sie hier nach. Ein
 * Wert außerhalb fällt weg wie jedes andere ungültige Feld — nicht
 * eingeklemmt, damit ein Eintrag aus einer Datei nie stillschweigend einen
 * anderen Wert bekommt als den, der darin steht. Julianische Tage begrenzt
 * der Zeitbereich aus sim/time.ts (1. Januar 1 bis 31. Dezember 9999).
 * `camera.azimuth` und `camera.fly.yaw` (Winkel ohne Grenze, wickeln um) und
 * `cinema.seed` (beliebige ganze Zahl) bleiben bewusst ohne Eintrag hier. Die
 * Lage im Flug reicht wie `camera.distance` bis 10¹³ km.
 */
const BEREICHE: Readonly<Record<string, readonly [number, number]>> = {
  'time.jd': [JD_MIN, JD_MAX],
  'time.rateDaysPerSec': [-365250, 365250],
  'scale.sizeScale': [1, 1000],
  'scale.distanceExponent': [0.35, 1],
  'scale.sunDamping': [0.1, 1],
  'display.brightness': [0.1, 20],
  'display.lightFalloff': [0, 2],
  'display.nightFill': [0, 0.5],
  'display.lightCompensation': [0, 1],
  'camera.distance': [1e2, 1e13],
  'camera.elevation': [-Math.PI / 2, Math.PI / 2],
  'camera.freezeJd': [JD_MIN, JD_MAX],
  'camera.fly.x': [-1e13, 1e13],
  'camera.fly.y': [-1e13, 1e13],
  'camera.fly.z': [-1e13, 1e13],
  'camera.fly.pitch': [-Math.PI / 2, Math.PI / 2],
  'cinema.nummer': [0, 1e6],
  'cinema.elapsedSec': [0, 1e7],
  'cinema.idleResumeSec': [1, 3600],
  'ui.info.breiteRem': [INFO_BREITE_MIN_REM, INFO_BREITE_MAX_REM],
  'ui.info.teilung': [INFO_TEILUNG_MIN, INFO_TEILUNG_MAX],
};

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
  if (pfad === 'camera.targetId' || pfad === 'camera.fly.refId') {
    return typeof wert === 'string' && Object.hasOwn(bodyIndex, wert) ? wert : VERWORFEN;
  }
  if (pfad === 'ui.info.thema') {
    return typeof wert === 'string' && istThema(wert) ? wert : VERWORFEN;
  }
  if (istPlain(standard)) return istPlain(wert) ? pruefeZweig(pfad, wert, standard) : VERWORFEN;
  const erwartet = NULLBAR[pfad] ?? typeof standard;
  if (typeof wert !== erwartet) return VERWORFEN;
  if (typeof wert === 'number') {
    if (!Number.isFinite(wert)) return VERWORFEN;
    const bereich = BEREICHE[pfad];
    if (bereich !== undefined && (wert < bereich[0] || wert > bereich[1])) return VERWORFEN;
  }
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
 * weg, Typen müssen zum Standardwert passen, Zahlen endlich sein und
 * innerhalb ihres Bereichs liegen (BEREICHE), Aufzählungen in ihrer Liste
 * liegen, das Kameraziel ein bekannter Körper sein. Ungültig ist immer nur
 * das einzelne Feld, nie der ganze Zustand — ein Link aus einer älteren
 * Version liefert so noch das Gültige. Das Ergebnis ist ein Patch für
 * fromShareable, kein vollständiger Zustand.
 */
export function pruefeZustand(roh: unknown): Plain {
  return istPlain(roh) ? pruefeZweig('', roh, DEFAULT_STATE as unknown as Plain) : {};
}
