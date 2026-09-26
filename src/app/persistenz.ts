import type { useStore } from '../store';
import type { AppState } from '../store/types';
import { istPlain } from '../store/pruefer';
import type { Plain } from '../store/pruefer';
import { fromShareable } from '../store/serialize';
import { fragmentAuswerten } from '../store/deeplink';
import { sitzungLesen, sitzungMerkenLesen, sitzungSchreiben, sitzungsPatch } from '../store/persist';
import type { Ablage } from '../store/persist';
import { startSprache } from '../ui/i18n';
import type { Sprache } from '../ui/i18n';
import { SYSTEM_THEMA } from '../data/themen';

export interface StartUmgebung {
  /** location.hash, mit führendem „#". */
  hash: string;
  /** Entfernt das Fragment aus der Adresszeile (history.replaceState). */
  fragmentEntfernen: () => void;
  ablage: Ablage | null;
  navigatorLanguage: string;
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
 * gültiges (auch ein gültig-leeres) Fragment ersetzt sie in jedem Fall. Nur
 * der Start aus dem Standard setzt das Thema Sonnensystem.
 */
export function startZustand(u: StartUmgebung): AppState {
  const ergebnis = fragmentAuswerten(u.hash);
  let dekodiert: Plain | null = null;
  if (ergebnis !== null) {
    dekodiert = ergebnis.patch;
    u.fragmentEntfernen();
  }
  const sitzung = dekodiert === null && sitzungMerkenLesen(u.ablage) ? sitzungLesen(u.ablage) : null;
  const patch = dekodiert ?? sitzung ?? {};
  const state = fromShareable(patch);
  state.ui.language = startSprache(u.navigatorLanguage, spracheAus(patch));
  // Ohne Link und ohne gemerkte Sitzung beginnt die Anwendung mit der
  // Übersicht: Das Infopanel erklärt das Sonnensystem (Jens, 16.09.2026).
  // Ein Link führt kein Thema (Entwurf §4.6) und zeigt deshalb sein Ziel.
  if (dekodiert === null && sitzung === null) state.ui.info.thema = SYSTEM_THEMA;
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
 * Vergleichsschlüssel einer Sitzung ohne den Uhrstand: Im Leerlauf ändert
 * sich nur time.jd, und das jedes Bild. Zwei Patches mit gleichem Schlüssel
 * unterscheiden sich höchstens in der Uhr.
 */
function ohneUhr(patch: Plain): string {
  const { time, ...rest } = patch;
  if (!istPlain(time)) return JSON.stringify(rest);
  const zeit = { ...time };
  delete zeit.jd;
  // Ein leer gewordener Zweig ist keine Abweichung mehr (wie in toShareable).
  return JSON.stringify(Object.keys(zeit).length === 0 ? rest : { ...rest, time: zeit });
}

/**
 * Gedrosselte Sicherung: Die Schleife schreibt time.jd in jedem Bild in den
 * Store, eine Entprellung „eine Sekunde nach der letzten Änderung" käme bei
 * laufender Uhr also nie zum Zug. Stattdessen startet die erste Änderung
 * einen Timer, dessen Ablauf den dann aktuellen Stand schreibt — höchstens
 * einmal je Intervall, und nur, wenn sich seit dem letzten Schreiben mehr
 * als die Uhr geändert hat; sonst schriebe die laufende Uhr im Leerlauf
 * jede Sekunde auf die Platte. Den Uhrstand nimmt jeder Schreibvorgang mit,
 * pagehide schreibt sofort und unbedingt. Die Präferenz wird bei jedem
 * Schreibversuch neu gelesen, damit der Hook useSitzungMerken keine
 * Verbindung hierher braucht.
 */
export function sicherungStarten(store: Store, u: SicherungUmgebung): () => void {
  const intervall = u.intervallMs ?? 1000;
  let timer: ReturnType<typeof setTimeout> | null = null;
  // Der Startzustand gilt als gesichert: Ohne Nutzeraktion bleibt es still.
  let zuletzt = ohneUhr(sitzungsPatch(store.getState()));

  const schreiben = (unbedingt: boolean): void => {
    timer = null;
    if (u.ablage === null || !sitzungMerkenLesen(u.ablage)) return;
    const state = store.getState();
    const schluessel = ohneUhr(sitzungsPatch(state));
    if (!unbedingt && schluessel === zuletzt) return;
    if (sitzungSchreiben(u.ablage, state)) zuletzt = schluessel;
  };
  const sofort = (): void => {
    if (timer !== null) clearTimeout(timer);
    schreiben(true);
  };

  const abbestellen = store.subscribe(() => {
    if (timer === null) timer = setTimeout(() => { schreiben(false); }, intervall);
  });
  u.ziel.addEventListener('pagehide', sofort);

  return () => {
    abbestellen();
    u.ziel.removeEventListener('pagehide', sofort);
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
}
