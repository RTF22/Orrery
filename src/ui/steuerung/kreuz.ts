import { zeigerAusgeblendet } from '../idle';

/**
 * Fadenkreuz des Controllers (Entwurf Flug und Controller §5.4): Lage in
 * CSS-Pixeln relativ zur Canvas und Sichtbarkeit als flüchtiger Modulzustand.
 * Die Steuerung bewegt es je Bild und zeichnet es direkt am Element, ohne
 * React-Rendern.
 */

/** Durchmesser des Rings samt Kontur. */
export const KREUZ_PX = 24;

export interface Leinwand { breite: number; hoehe: number }

/** Null, solange das Kreuz nie bewegt wurde: dann steht es in der Mitte. */
let lage: { x: number; y: number } | null = null;
let an = false;
let element: HTMLElement | null = null;
/** Zuletzt geschriebener Stand; geschrieben wird nur bei Änderung. */
let gezeichnet: string | null = null;

const klemme = (wert: number, max: number): number => Math.min(Math.max(wert, 0), Math.max(max, 0));

/** Lage in der Leinwand; nach einer Verkleinerung an den Rand geklemmt. */
export function kreuzLage(l: Leinwand): { x: number; y: number } {
  if (lage === null) return { x: l.breite / 2, y: l.hoehe / 2 };
  return { x: klemme(lage.x, l.breite), y: klemme(lage.y, l.hoehe) };
}

export function kreuzBewegen(dx: number, dy: number, l: Leinwand): void {
  const p = kreuzLage(l);
  lage = { x: klemme(p.x + dx, l.breite), y: klemme(p.y + dy, l.hoehe) };
}

export function kreuzMitte(l: Leinwand): void {
  lage = { x: l.breite / 2, y: l.hoehe / 2 };
}

export function kreuzZeigen(): void { an = true; }
export function kreuzAusblenden(): void { an = false; }

/** Sichtbar ab einer Controller-Eingabe, nicht aber unter ausgeblendetem Mauszeiger (3 s Ruhe). */
export function kreuzSichtbar(): boolean {
  return an && !zeigerAusgeblendet();
}

export function kreuzElementSetzen(el: HTMLElement | null): void {
  element = el;
  gezeichnet = null;
}

/** Setzt Sichtbarkeit und Lage am Element; ohne Änderung bleibt das DOM unberührt. */
export function kreuzZeichnen(l: Leinwand): void {
  if (element === null) return;
  const p = kreuzLage(l);
  const neu = kreuzSichtbar() ? `translate(${p.x - KREUZ_PX / 2}px, ${p.y - KREUZ_PX / 2}px)` : '';
  if (neu === gezeichnet) return;
  gezeichnet = neu;
  element.style.display = neu === '' ? 'none' : 'block';
  if (neu !== '') element.style.transform = neu;
}

/** Für Tests: Lage, Sichtbarkeit und Element vergessen. */
export function kreuzZuruecksetzen(): void {
  lage = null;
  an = false;
  element = null;
  gezeichnet = null;
}
