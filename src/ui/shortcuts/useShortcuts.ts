import { useEffect } from 'react';
import { useStore, DEFAULT_STATE } from '../../store';
import { toggleCinema, nextScene } from '../cinemaControl';

/** Panel-Schlüssel der Kürzel-Übersicht. */
export const SHORTCUTS_PANEL = 'shortcuts';

/** Faktor je Tastendruck auf die Zeitraffung — multiplikativ, nie additiv. */
const RATE_SCHRITT = 1.5;

function istEingabefeld(ziel: EventTarget | null): boolean {
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
    case 'l':
      s.setUi({ language: s.ui.language === 'de' ? 'en' : 'de' });
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
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); };
  }, []);
}
