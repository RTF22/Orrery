import { de } from './de';
import { en } from './en';

export type Key = keyof typeof de;
export type Sprache = 'de' | 'en';

const tabellen: Record<Sprache, Record<Key, string>> = { de, en };

/**
 * Die aktuelle Sprache lebt als Modulvariable, nicht im React-Baum: So
 * bleibt t() synchron und überall aufrufbar (Formatierung, Overlay-Labels
 * über einen Auflöser aus app/). Wer die Sprache ändert, ist der Store
 * (ui.language); der Hook useSprache spiegelt sie hierher.
 */
let aktuell: Sprache = 'de';

export function setSprache(s: Sprache): void { aktuell = s; }
export function sprache(): Sprache { return aktuell; }

/** Locale für Intl: Deutsch de-DE, Englisch en-GB (Tag vor Monat, 24 h). */
export function locale(): 'de-DE' | 'en-GB' {
  return aktuell === 'en' ? 'en-GB' : 'de-DE';
}

/** Unbekannte Schlüssel fallen sichtbar auf, statt still zu verschwinden. */
export function t(key: string): string {
  return (tabellen[aktuell] as Record<string, string>)[key] ?? `[${key}]`;
}

/**
 * Startsprache: Ein geteilter Zustand (URL-Fragment, ab Phase 4b) gewinnt;
 * sonst entscheidet der Browser. DEFAULT_STATE bleibt 'de', damit Englisch
 * im geteilten Zustand eine Abweichung vom Standard ist und mitreist.
 */
export function startSprache(navigatorLanguage: string, ausFragment: Sprache | null): Sprache {
  if (ausFragment !== null) return ausFragment;
  return navigatorLanguage.toLowerCase().startsWith('en') ? 'en' : 'de';
}

export { de, en };
