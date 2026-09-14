import type { useStore } from '../store';
import type { AppState } from '../store/types';
import { istPlain } from '../store/pruefer';
import type { Plain } from '../store/pruefer';
import { decodePatch, fromShareable } from '../store/serialize';
import { FRAGMENT_PRAEFIX, sitzungLesen, sitzungMerkenLesen, sitzungSchreiben } from '../store/persist';
import type { Ablage } from '../store/persist';
import { startSprache } from '../ui/i18n';
import type { Sprache } from '../ui/i18n';

export interface StartUmgebung {
  /** location.hash, mit führendem „#". */
  hash: string;
  /** Entfernt das Fragment aus der Adresszeile (history.replaceState). */
  fragmentEntfernen: () => void;
  ablage: Ablage | null;
  navigatorLanguage: string;
}

export function fragmentLesen(hash: string): string | null {
  return hash.startsWith(FRAGMENT_PRAEFIX) ? hash.slice(FRAGMENT_PRAEFIX.length) : null;
}

/** Nur eine im Patch tatsächlich enthaltene Sprache darf den Browser überstimmen. */
function spracheAus(patch: Plain): Sprache | null {
  const ui = patch.ui;
  if (!istPlain(ui)) return null;
  return ui.language === 'en' || ui.language === 'de' ? ui.language : null;
}

/**
 * Startzustand: Fragment vor Sitzung vor Standard (Entwurf §4.1). Ein
 * Fragment wird sofort aus der Adresse entfernt, damit ein späteres Neuladen
 * die gesicherte Sitzung nimmt und nicht immer wieder den alten Link. Die
 * Sitzung ist auch der Rückfall für ein **beschädigtes** Fragment: Ohne
 * dieses Rulings (5) würde `startZustand` einen defekten Link wie einen
 * leeren behandeln, und eine Sekunde später überschriebe die automatische
 * Sicherung die eigentlich noch vorhandene Sitzung mit dem Standard. Die
 * Sitzung zählt dabei wie immer nur, wenn „Sitzung merken" an ist; ein
 * gültiges (auch ein gültig-leeres) Fragment ersetzt sie in jedem Fall.
 */
export function startZustand(u: StartUmgebung): AppState {
  const fragment = fragmentLesen(u.hash);
  let dekodiert: Plain | null = null;
  if (fragment !== null) {
    dekodiert = decodePatch(fragment);
    u.fragmentEntfernen();
  }
  const patch = dekodiert ?? (sitzungMerkenLesen(u.ablage) ? sitzungLesen(u.ablage) ?? {} : {});
  const state = fromShareable(patch);
  state.ui.language = startSprache(u.navigatorLanguage, spracheAus(patch));
  return state;
}

export interface EreignisZiel {
  addEventListener(typ: 'pagehide', h: () => void): void;
  removeEventListener(typ: 'pagehide', h: () => void): void;
}

export interface SicherungUmgebung {
  ablage: Ablage | null;
  ziel: EreignisZiel;
  /** Mindestabstand zweier Schreibvorgänge; Standard 1000 ms. */
  intervallMs?: number;
}

type Store = Pick<typeof useStore, 'getState' | 'subscribe'>;

/**
 * Gedrosselte Sicherung: Die Schleife schreibt time.jd in jedem Bild in den
 * Store, eine Entprellung „eine Sekunde nach der letzten Änderung" käme bei
 * laufender Uhr also nie zum Zug. Stattdessen startet die erste Änderung
 * einen Timer, dessen Ablauf den dann aktuellen Stand schreibt — höchstens
 * einmal je Intervall. pagehide schreibt sofort. Die Präferenz wird bei
 * jedem Schreibversuch neu gelesen, damit der Hook useSitzungMerken keine
 * Verbindung hierher braucht.
 */
export function sicherungStarten(store: Store, u: SicherungUmgebung): () => void {
  const intervall = u.intervallMs ?? 1000;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const schreiben = (): void => {
    timer = null;
    if (u.ablage === null || !sitzungMerkenLesen(u.ablage)) return;
    sitzungSchreiben(u.ablage, store.getState());
  };
  const sofort = (): void => {
    if (timer !== null) clearTimeout(timer);
    schreiben();
  };

  const abbestellen = store.subscribe(() => {
    if (timer === null) timer = setTimeout(schreiben, intervall);
  });
  u.ziel.addEventListener('pagehide', sofort);

  return () => {
    abbestellen();
    u.ziel.removeEventListener('pagehide', sofort);
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
}
