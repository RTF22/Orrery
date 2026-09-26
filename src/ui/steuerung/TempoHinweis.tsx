import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { tempoAbonnieren, TEMPO_START } from './anwenden';
import { t } from '../i18n';
import { formatZahl } from '../format';

/** Dauer der Einblendung (Entwurf Flug und Controller §4.3). */
export const HINWEIS_MS = 1500;

/**
 * Kurze Einblendung des Flugtempos nach einer Radbewegung, unten in der Mitte.
 * Angezeigt wird der Faktor relativ zum Start (×1 = Startwert), damit die Zahl
 * ohne Kenntnis des Geschwindigkeitsgesetzes lesbar ist.
 *
 * Die role="status"-Region bleibt stets eingehängt (M9 aus der Schlussprüfung
 * Flug Etappe 1): Screenreader melden sie nur zuverlässig, wenn sie schon vor
 * der ersten Änderung im Dokument steht. Ohne Wert bleibt sie leer und ohne
 * Fläche, Rahmen oder Hintergrund (auch die Zeigereingaben bleiben aus).
 *
 * Bei ausgeblendeter Oberfläche (`ui.hidden`) steht an derselben Stelle unten
 * mittig die Minileiste (Feature Einbettung, Schritt 2, Fix-Runde 1, I1): Ein
 * Mausrad-Dreh — der einzige Auslöser dieser Einblendung — zählt zugleich als
 * Eingabe für den Ruhewächter der Minileiste (`ui/idle.ts`, dieselbe Liste an
 * Ereignissen inklusive `wheel`), die Leiste ist also in genau diesem
 * Augenblick sichtbar. Der Hinweis rückt dann höher, damit sich beide nicht
 * überlappen.
 */
export function TempoHinweis(): React.JSX.Element {
  const [wert, setWert] = useState<number | null>(null);
  const versteckt = useStore((s) => s.ui.hidden);

  useEffect(() => {
    let uhr = 0;
    const abbestellen = tempoAbonnieren((neu) => {
      setWert(neu);
      window.clearTimeout(uhr);
      uhr = window.setTimeout(() => { setWert(null); }, HINWEIS_MS);
    });
    return () => {
      abbestellen();
      window.clearTimeout(uhr);
    };
  }, []);

  const sichtbar = wert !== null;
  const lage = versteckt ? 'bottom-16' : 'bottom-6';
  return (
    <div
      role="status"
      className={
        sichtbar
          ? `pointer-events-none fixed ${lage} left-1/2 -translate-x-1/2 rounded bg-black/60 px-3 py-1 text-sm text-slate-100`
          : `pointer-events-none fixed ${lage} left-1/2 -translate-x-1/2`
      }
    >
      {sichtbar ? `${t('fly.tempo')} ×${formatZahl(wert / TEMPO_START)}` : ''}
    </div>
  );
}
