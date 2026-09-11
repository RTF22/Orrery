import type { AppState } from './types';
import { DEFAULT_STATE } from './index';

type Plain = Record<string, unknown>;

/** Rekursiver Differenzbildner: nur Felder, die vom Standard abweichen. */
function diff(ist: Plain, soll: Plain): Plain {
  const out: Plain = {};
  for (const [key, wert] of Object.entries(ist)) {
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

export function encodeState(state: AppState): string {
  return toBase64Url(JSON.stringify(toShareable(state)));
}

export function decodeState(fragment: string): AppState {
  if (!fragment) return structuredClone(DEFAULT_STATE);
  try {
    return fromShareable(JSON.parse(fromBase64Url(fragment)) as Plain);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}
