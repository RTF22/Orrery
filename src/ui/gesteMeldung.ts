/**
 * Meldemechanismus für den Gestenhinweis der Einbettung (Feature Einbettung,
 * Schritt 3), nach dem Muster von `tempoAbonnieren`
 * (ui/steuerung/anwenden.ts): flüchtiger Zustand außerhalb des Stores und
 * außerhalb von React, weil `attachCameraInput` (render-Schicht) selbst keine
 * Komponente kennt und jedes Rad- oder Wisch-Ereignis sonst den Store
 * unnötig oft schriebe.
 *
 * Eigene Datei statt in GestenHinweis.tsx: `gesteMeldung.ts` und
 * `GestenHinweis.tsx` unterscheiden sich zwar im Namen, ein reines Modul
 * bleibt aber ohnehin getrennt von seiner Komponente (NTFS-Kollisionen bei
 * bloßer Groß-/Kleinschreibung).
 */

export type GestenHinweisArt = 'rad' | 'touch';

const hoerer = new Set<(art: GestenHinweisArt) => void>();

/** Von `attachCameraInput`s `onGestenHinweis` aufgerufen (app/main.tsx). */
export function gesteHinweisMelden(art: GestenHinweisArt): void {
  for (const h of hoerer) h(art);
}

export function gesteHinweisAbonnieren(hoerer_: (art: GestenHinweisArt) => void): () => void {
  hoerer.add(hoerer_);
  return () => { hoerer.delete(hoerer_); };
}

/**
 * Schmales Abbild von `navigator` für die Mac-Erkennung (wie
 * `FensterVergleich` in app/einbettung.ts): So kann ein Test „Mac" und
 * „nicht Mac" nachstellen, ohne den echten Browser zu verändern.
 * `userAgentData.platform` ist der modernere Weg, `platform` und
 * `userAgent` der Rückfall (Firefox kennt userAgentData bislang nicht).
 */
export interface PlattformAngaben {
  readonly platform?: string;
  readonly userAgent?: string;
  readonly userAgentData?: { readonly platform?: string };
}

/** Zählt ⌘ statt Strg für die Zoom-Taste (Anforderung 3, Mac-Erkennung). */
export function istMac(n: PlattformAngaben): boolean {
  const plattform = n.userAgentData?.platform ?? n.platform ?? '';
  if (/mac/i.test(plattform)) return true;
  return /mac/i.test(n.userAgent ?? '');
}
