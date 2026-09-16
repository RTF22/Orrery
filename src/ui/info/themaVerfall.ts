import { useStore } from '../../store';
import { grundlage } from './aktuellerText';

/**
 * Themenverfall (Entwurf 4c §3.3 mit Nachträgen 4c-4): Ein gewähltes Thema
 * verfällt, sobald Ziel oder Szene wechseln, außer es wurde im selben Zug
 * gesetzt. „Im selben Zug" heißt im selben `setState`: Die Wurzel des
 * Objektbaums (`fahreZuSystem`) setzt Ziel und Thema in einem Aufruf,
 * „Zurücksetzen" ersetzt den ganzen Zustand auf einmal.
 *
 * Regel je Store-Übergang: Ist das Thema danach gesetzt, gegenüber vorher
 * unverändert und hat die Grundlage (`grundlage` aus ./aktuellerText)
 * gewechselt, wird es auf `null` gesetzt.
 *
 * Warum ein Abonnement statt eines React-Effekts im InfoPanel: Die
 * Oberfläche hängt bei `ui.hidden` und im Kino nach Ruhe ganz aus
 * (ui/App.tsx). Ein Effekt sieht Übergänge nur, solange das Panel eingehängt
 * ist; hängt es sich mit schon neuer Grundlage wieder ein, bliebe das Thema
 * stehen (etwa Taste C nach Ruhe: der Kinostart kommt vor dem Zurücksetzen
 * der Untätigkeit). Außerdem fasst React mehrere Store-Änderungen zu einem
 * Durchlauf zusammen, der Effekt sähe getrennte `setState` dann als einen
 * Zug. Das Abonnement sieht jeden Übergang einzeln und unabhängig von der
 * Oberfläche.
 *
 * Bewusst keine Regel über die Identität von `ui.info`: Auch
 * `ansichtAnwenden` (store/persist.ts) schreibt `ui` neu, ohne ein Thema
 * setzen zu wollen.
 *
 * Einmal nach dem Laden des Startzustands starten (app/main.tsx), damit der
 * Startzustand selbst nichts verwirft. Gibt das Abbestellen zurück.
 */
export function themaVerfallStarten(): () => void {
  return useStore.subscribe((nachher, vorher) => {
    const thema = nachher.ui.info.thema;
    if (thema === null || thema !== vorher.ui.info.thema) return;
    if (grundlage(nachher) === grundlage(vorher)) return;
    nachher.setInfo({ thema: null });
  });
}
