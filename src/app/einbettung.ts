/**
 * Schmales Abbild von `window` für die Erkennung: nur `self` und `top`, damit
 * ein Test „anderes Fenster" und „Zugriff wirft" nachstellen kann, ohne einen
 * echten iframe zu bauen. `window` selbst erfüllt diese Form.
 */
export interface FensterVergleich {
  readonly self: unknown;
  readonly top: unknown;
}

/**
 * Läuft die Seite in einem fremden iframe (Feature Einbettung und
 * Präsentationsmodus, Schritt 1)? `window.top` kann beim Zugriff selbst schon
 * werfen (SecurityError, etwa in einer Sandbox ohne `allow-same-origin`) —
 * das zählt dann ebenfalls als eingebettet, deshalb der try/catch. Wird
 * einmal beim Start aufgerufen (app/main.tsx); ändert sich zur Laufzeit
 * nicht, ein iframe wechselt seinen Rahmen nicht nachträglich.
 */
export function eingebettetErkennen(fenster: FensterVergleich): boolean {
  try {
    return fenster.self !== fenster.top;
  } catch {
    return true;
  }
}
