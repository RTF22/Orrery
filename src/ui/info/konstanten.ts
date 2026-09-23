/**
 * Konstanten und reine Hilfsfunktionen rund um das Infopanel — bewusst ohne
 * jeden Import (auch nicht aus `./InfoPanel`), damit `ui/shortcuts` sie
 * nutzen kann, ohne die Komponente zu importieren (Fund der Abschlussprüfung
 * von Etappe 1: Taste I und `InfoPanel.tsx` erwarteten sonst zwei
 * unterschiedliche Standardwerte für dieselbe Frage „ist das Panel offen?").
 */

/** Schlüssel in ui.panels; anders als die anderen Panels ohne Standardeintrag (siehe infoOffen). */
export const INFO_PANEL = 'info';

/**
 * Kompaktmodus (Entwurf Phase 5 §4.1, zuvor „schmal“ nach Entwurf 4c §3.4):
 * Breite unter 900 px oder Höhe unter 500 px. Dann gibt es statt zweier
 * Spalten höchstens einen Bogen (ui/bogen.ts). Zwilling der Medienabfragen
 * in `src/index.css` — beide Stellen nur gemeinsam ändern
 * (ui/info/konstanten.test.ts prüft das).
 */
export const SCHMAL_ABFRAGE = '(max-width: 899px), (max-height: 499px)';

/**
 * Gilt der Bildschirm als schmal? Ohne `window`/`matchMedia` (serverseitig,
 * ältere Testumgebungen) gilt „nicht schmal" als sicherer Rückfall.
 */
export function istSchmal(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(SCHMAL_ABFRAGE).matches;
}

/** Grober Zeiger (Finger) — Zwilling der Medienabfrage in `src/index.css` (Entwurf Phase 5 §4.2). */
export const GROB_ABFRAGE = '(pointer: coarse)';

/** Ist der Hauptzeiger grob? Ohne `matchMedia` gilt „nein". */
export function istGrob(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(GROB_ABFRAGE).matches;
}

/**
 * Ist das Infopanel offen? Ohne gespeicherten Wert gilt es auf breiten
 * Bildschirmen als offen, auf schmalen als zu (Entwurf 4c §3.4) — dieselbe
 * Regel für die Taste I (`ui/shortcuts/useShortcuts.ts`) wie für die
 * Komponente selbst (`InfoPanel.tsx`).
 */
export function infoOffen(panels: Record<string, boolean>, schmal: boolean): boolean {
  return panels[INFO_PANEL] ?? !schmal;
}
