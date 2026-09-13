import { useEffect } from 'react';
import { useStore } from '../../store';
import { setSprache, sprache, t } from './index';
import type { Sprache } from './index';

/**
 * Koppelt die Modulvariable von t() an ui.language. setSprache läuft
 * synchron während des Renderns: Ein Effekt käme einen Durchlauf zu spät,
 * und alle Kinder von App lesen t() im selben Durchlauf. Weil App der
 * einzige Aufrufer ist und alle Panels seine Kinder sind, zeichnet ein
 * Sprachwechsel den gesamten Baum neu.
 */
export function useSprache(): Sprache {
  const language = useStore((s) => s.ui.language);
  if (sprache() !== language) setSprache(language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('app.title');
  }, [language]);

  return language;
}
