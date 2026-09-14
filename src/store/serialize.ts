import type { AppState } from './types';
import { DEFAULT_STATE } from './index';
import { GEFAEHRLICHE_SCHLUESSEL, pruefeZustand } from './pruefer';
import type { Plain } from './pruefer';

export type { Plain };

/**
 * Rekursiver Differenzbildner: nur Felder, die vom Standard abweichen.
 *
 * Bildet ausschließlich hinzugefügte und geänderte Schlüssel ab, niemals
 * entfernte — die Schleife läuft über `Object.entries(ist)`, nie über die
 * Schlüssel von `soll`. Ein Schlüssel, der im Standardzustand vorhanden, im
 * aktuellen Zustand aber gelöscht wurde, erzeugt daher keinen Patch-Eintrag
 * und wird von `fromShareable` mit seinem Standardwert stillschweigend wieder
 * eingesetzt. Das ist unschädlich, solange jeder Record-wertige Zweig, dessen
 * Schlüssel gelöscht werden können, im Standardzustand `{}` ist (siehe die
 * Prüfung bei `DEFAULT_STATE.visible` in serialize.test.ts) — dann gibt es
 * dort keinen von null verschiedenen Standardwert, der zurückkehren könnte.
 * Bekäme ein solcher Zweig künftig nicht-leere Standardeinträge, müsste diff
 * zuerst lernen, Löschungen darzustellen, bevor dieses Verhalten weiterhin
 * sicher wäre — absichtlich nicht vorab gebaut, solange nichts diesen Fall
 * erreichen kann.
 */
function diff(ist: Plain, soll: Plain): Plain {
  const out: Plain = {};
  for (const [key, wert] of Object.entries(ist)) {
    if (GEFAEHRLICHE_SCHLUESSEL.has(key) || typeof wert === 'function') continue;
    const standard = soll[key];
    if (wert !== null && typeof wert === 'object' && !Array.isArray(wert)
        && standard !== null && typeof standard === 'object') {
      const tiefer = diff(wert as Plain, standard as Plain);
      if (Object.keys(tiefer).length > 0) out[key] = tiefer;
    } else if (wert !== standard) {
      out[key] = wert;
    }
  }
  return out;
}

function merge(basis: Plain, patch: Plain): Plain {
  const out: Plain = { ...basis };
  for (const [key, wert] of Object.entries(patch)) {
    if (GEFAEHRLICHE_SCHLUESSEL.has(key)) continue;
    const vorhanden = out[key];
    if (wert !== null && typeof wert === 'object' && !Array.isArray(wert)
        && vorhanden !== null && typeof vorhanden === 'object') {
      out[key] = merge(vorhanden as Plain, wert as Plain);
    } else {
      out[key] = wert;
    }
  }
  return out;
}

/**
 * Nur die Abweichungen vom Standard — das hält geteilte Links kurz. Weil der
 * gesamte einstellbare Zustand ein einziges serialisierbares Objekt ist, sind
 * Presets, URL-Freigabe und Sitzungswiederherstellung keine drei Funktionen,
 * sondern dreimal derselbe Aufruf von toShareable/fromShareable.
 */
export function toShareable(state: AppState): Plain {
  return diff(state as unknown as Plain, DEFAULT_STATE as unknown as Plain);
}

export function fromShareable(patch: Plain): AppState {
  return merge(
    structuredClone(DEFAULT_STATE) as unknown as Plain, patch,
  ) as unknown as AppState;
}

/**
 * Base64URL-Kodierung über den UTF-8-Bytepfad (TextEncoder), nicht über das
 * veraltete escape/unescape-Idiom. Ohne Füllzeichen, damit das Ergebnis im
 * URL-Fragment ohne Maskierung verwendbar ist.
 */
function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binaer = '';
  for (const b of bytes) binaer += String.fromCharCode(b);
  return btoa(binaer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(fragment: string): string {
  const roh = fragment.replace(/-/g, '+').replace(/_/g, '/');
  // Füllzeichen wiederherstellen — manche Engines lehnen ungefülltes Base64 ab.
  const gefuellt = roh + '='.repeat((4 - (roh.length % 4)) % 4);
  const binaer = atob(gefuellt);
  return new TextDecoder().decode(Uint8Array.from(binaer, (c) => c.charCodeAt(0)));
}

export function encodePatch(patch: Plain): string {
  return toBase64Url(JSON.stringify(patch));
}

export function encodeState(state: AppState): string {
  return encodePatch(toShareable(state));
}

/**
 * Geprüfter Patch aus dem Fragment. Leeres Fragment ergibt `{}` (gültig,
 * nichts weicht vom Standard ab); ein beschädigtes Fragment (Base64 oder
 * JSON scheitert) ergibt `null` — die beiden Fälle bleiben unterscheidbar,
 * damit `startZustand` bei einem defekten Link auf die Sitzung zurückfallen
 * kann, statt sie mit dem Standardzustand zu überschreiben (Ruling 5). Der
 * Prüfer verwirft feldweise, siehe pruefer.ts — ein Fragment mit
 * `ui.language: 'fr'` liefert daher den Rest, die Sprache fällt weg.
 */
export function decodePatch(fragment: string): Plain | null {
  if (!fragment) return {};
  try {
    return pruefeZustand(JSON.parse(fromBase64Url(fragment)));
  } catch {
    return null;
  }
}

export function decodeState(fragment: string): AppState {
  return fromShareable(decodePatch(fragment) ?? {});
}
