import { useEffect } from 'react';
import { useStore, DEFAULT_STATE } from '../../store';
import { toggleCinema, nextScene, stopCinema, cinemaAktiv } from '../cinemaControl';
import { INFO_PANEL, infoOffen, istSchmal } from '../info/konstanten';

/** Panel-Schlüssel der Kürzel-Übersicht. */
export const SHORTCUTS_PANEL = 'shortcuts';

/** Faktor je Tastendruck auf die Zeitraffung — multiplikativ, nie additiv. */
const RATE_SCHRITT = 1.5;

export function istEingabefeld(ziel: EventTarget | null): boolean {
  if (!(ziel instanceof HTMLElement)) return false;
  if (ziel.isContentEditable) return true;
  const tag = ziel.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

function vollbildUmschalten(): void {
  if (document.fullscreenElement === null) {
    void document.documentElement.requestFullscreen?.();
  } else {
    void document.exitFullscreen?.();
  }
}

/** Die Tastenbelegung als reine Funktion — ohne sie wäre sie nicht prüfbar. */
export function handleShortcut(taste: string): boolean {
  const s = useStore.getState();

  switch (taste) {
    case 'h':
      s.setUi({ hidden: !s.ui.hidden });
      return true;
    case 'f':
      vollbildUmschalten();
      return true;
    case ' ':
      s.setTime({ paused: !s.time.paused });
      return true;
    case 'ArrowLeft':
      s.setTime({ rateDaysPerSec: s.time.rateDaysPerSec / RATE_SCHRITT });
      return true;
    case 'ArrowRight':
      s.setTime({ rateDaysPerSec: s.time.rateDaysPerSec * RATE_SCHRITT });
      return true;
    case 'r':
      s.setTime({ rateDaysPerSec: -s.time.rateDaysPerSec });
      return true;
    case 'c':
      toggleCinema();
      return true;
    case 'n':
      nextScene();
      return true;
    case 'Escape':
      // Beendet den Film (auch einen nur angehaltenen) und fällt auf den
      // Zustand von vor dem Start zurück; ohne Kino bleibt die Taste frei.
      if (!cinemaAktiv()) return false;
      stopCinema();
      return true;
    case 'l':
      s.setUi({ language: s.ui.language === 'de' ? 'en' : 'de' });
      return true;
    case 'i':
      // Ohne Eintrag gilt das Panel auf breiten Bildschirmen als offen, auf
      // schmalen als zu (infoOffen, Zwilling der Regel in InfoPanel.tsx);
      // die Taste kippt den so ermittelten Zustand.
      s.setUi({ panels: { ...s.ui.panels, [INFO_PANEL]: !infoOffen(s.ui.panels, istSchmal()) } });
      return true;
    case 'Home':
      s.setCamera({ ...DEFAULT_STATE.camera });
      return true;
    case '?':
      // Anders als die Bedienpanels ist die Übersicht standardmäßig zu —
      // ein fehlender Schlüssel gilt hier also als „nicht angezeigt".
      s.setUi({
        panels: { ...s.ui.panels, [SHORTCUTS_PANEL]: !(s.ui.panels[SHORTCUTS_PANEL] ?? false) },
      });
      return true;
    default:
      return false;
  }
}

/**
 * Globale Tastenkürzel. Ereignisse aus Eingabefeldern bleiben unangetastet,
 * sonst würde die Leertaste im Datumsfeld die Simulation anhalten.
 */
export function useShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (istEingabefeld(e.target)) return;
      if (handleShortcut(e.key)) e.preventDefault();
    };
    // Wer im Kino das Vollbild verlässt (Escape schluckt der Browser dort
    // unter Umständen selbst), verlässt auch das Kino.
    const onFullscreenChange = (): void => {
      // Kein strenger Vergleich mit null: jsdom kennt das Feld nicht (undefined).
      if (!document.fullscreenElement && cinemaAktiv()) stopCinema();
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);
}
