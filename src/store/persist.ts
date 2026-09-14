import type { AppState } from './types';
import { DEFAULT_STATE } from './index';
import { istPlain, pruefeZustand } from './pruefer';
import type { Plain } from './pruefer';
import { encodePatch, toShareable } from './serialize';

/**
 * Drei Verwendungen desselben Diffs (Entwurf §3.1): Der Link lässt
 * Gerätespezifisches und Bedienzustand weg, die Sitzung nimmt alles, eine
 * Ansicht nur die Einstellungen, die man an einen anderen Zeitpunkt
 * mitnehmen will.
 */
export type Profil = 'link' | 'sitzung' | 'ansicht';

const GESTRICHEN: Readonly<Record<Profil, readonly string[]>> = {
  link: ['quality', 'ui.hidden', 'ui.panels'],
  sitzung: [],
  ansicht: ['time.jd', 'time.paused', 'cinema', 'quality', 'ui'],
};

function ohnePfad(obj: Plain, pfad: readonly string[]): Plain {
  const [kopf, ...rest] = pfad;
  if (kopf === undefined || !Object.hasOwn(obj, kopf)) return obj;
  const out: Plain = { ...obj };
  if (rest.length === 0) {
    delete out[kopf];
    return out;
  }
  const kind = out[kopf];
  if (!istPlain(kind)) return out;
  const gekuerzt = ohnePfad(kind, rest);
  // Ein leer gewordener Zweig ist keine Abweichung mehr.
  if (Object.keys(gekuerzt).length === 0) delete out[kopf];
  else out[kopf] = gekuerzt;
  return out;
}

export function filtereProfil(patch: Plain, profil: Profil): Plain {
  return GESTRICHEN[profil].reduce<Plain>((acc, pfad) => ohnePfad(acc, pfad.split('.')), patch);
}

export function patchFuer(state: AppState, profil: Profil): Plain {
  return filtereProfil(toShareable(state), profil);
}

export const FRAGMENT_PRAEFIX = '#p=';

/** Vollständige Adresse zum Teilen; Ursprung und Pfad kommen vom Aufrufer (location). */
export function linkErzeugen(state: AppState, ort: { origin: string; pathname: string }): string {
  return `${ort.origin}${ort.pathname}${FRAGMENT_PRAEFIX}${encodePatch(patchFuer(state, 'link'))}`;
}

/** Standardzustand, aber Sprache und Qualitätsstufe des aktuellen Zustands bleiben. */
export function zurueckgesetzt(aktuell: AppState): AppState {
  const s = structuredClone(DEFAULT_STATE);
  s.ui.language = aktuell.ui.language;
  s.quality.tier = aktuell.quality.tier;
  return s;
}

/* ---------- Ablage (localStorage) ---------- */

/** Nur die drei Methoden, die gebraucht werden — so genügt in Tests ein kleiner Fake. */
export type Ablage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const SCHLUESSEL_SITZUNG = 'orrery.sitzung.v1';
export const SCHLUESSEL_MERKEN = 'orrery.sitzungMerken';

/**
 * Schon der Zugriff auf localStorage kann werfen (SecurityError bei
 * blockierten Cookies); dann gibt es keine Ablage und alle Funktionen unten
 * verhalten sich wie bei leerer Ablage.
 */
export function ablageHolen(): Ablage | null {
  try {
    // Ohne DOM (Tests, Build-Skripte) fehlt die Eigenschaft ganz.
    const g = globalThis as { localStorage?: Ablage };
    return g.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Geprüfter Sitzungs-Patch; null, wenn nichts gespeichert oder der Eintrag beschädigt ist. */
export function sitzungLesen(ablage: Ablage | null): Plain | null {
  try {
    const text = ablage?.getItem(SCHLUESSEL_SITZUNG) ?? null;
    return text === null ? null : pruefeZustand(JSON.parse(text));
  } catch {
    return null;
  }
}

/**
 * `ui.language` steht immer im geschriebenen Patch, auch wenn sie dem
 * Standard `'de'` entspricht. Grund: `patchFuer` bildet nur Abweichungen vom
 * Standard ab; ohne diesen Zusatz enthielte die Sitzung eines Nutzers, der
 * bewusst Deutsch gewählt hat, gar kein `ui.language` — und ein
 * englischsprachiger Browser läse beim nächsten Start wieder Englisch aus
 * `navigator.language`, weil `spracheAus(patch)` dann null ergibt.
 */
export function sitzungSchreiben(ablage: Ablage | null, state: AppState): boolean {
  try {
    if (ablage === null) return false;
    const patch = patchFuer(state, 'sitzung');
    patch.ui = { ...(istPlain(patch.ui) ? patch.ui : {}), language: state.ui.language };
    ablage.setItem(SCHLUESSEL_SITZUNG, JSON.stringify(patch));
    return true;
  } catch {
    // Voll (QuotaExceededError) oder gesperrt: still, die Anwendung läuft weiter.
    return false;
  }
}

export function sitzungLoeschen(ablage: Ablage | null): void {
  try {
    ablage?.removeItem(SCHLUESSEL_SITZUNG);
  } catch {
    // Gesperrt: nichts zu tun.
  }
}

/** Fehlender Eintrag bedeutet „an" — die Sicherung ist der Normalfall. */
export function sitzungMerkenLesen(ablage: Ablage | null): boolean {
  try {
    return ablage?.getItem(SCHLUESSEL_MERKEN) !== '0';
  } catch {
    return true;
  }
}

export function sitzungMerkenSchreiben(ablage: Ablage | null, an: boolean): void {
  try {
    if (an) ablage?.removeItem(SCHLUESSEL_MERKEN);
    else ablage?.setItem(SCHLUESSEL_MERKEN, '0');
  } catch {
    // Gesperrt: nichts zu tun.
  }
}
