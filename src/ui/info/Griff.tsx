import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

interface Props {
  /** senkrecht: stehender Balken (Breite, dx); waagerecht: liegender Balken (Teilung, dy). */
  richtung: 'senkrecht' | 'waagerecht';
  /**
   * Nur senkrecht: An welcher Kante des Panels sitzt der Griff? Links
   * (Infopanel, Standard) vergrößert Pfeil links, rechts (Seitenleiste)
   * Pfeil rechts — die Kante wandert jeweils nach außen.
   */
  kante?: 'links' | 'rechts';
  wert: number;
  min: number;
  max: number;
  schritt: number;
  label: string;
  /** Neuer Wert aus dem Wert beim Anfassen und dem Zeigerversatz in Pixeln. */
  ausVersatz: (startwert: number, deltaPx: number) => number;
  onWert: (wert: number) => void;
  className?: string;
}

/**
 * Trenn- und Breitengriff (Entwurf 4c §3.2): role="separator" mit Wert und
 * Grenzen, Ziehen per Pointer-Capture, Pfeiltasten in Schritten, Pos1/Ende
 * an die Grenzen. Beim Breitengriff vergrößert der Pfeil nach außen
 * (Infopanel links, Seitenleiste rechts, siehe `kante`), beim Teilungsgriff
 * vergrößert Pfeil runter. Pointer-Ereignisse kommen im Browser ohnehin
 * höchstens einmal je Bild, deshalb keine eigene Drosselung (Ruling 6).
 */
export function Griff(p: Props): React.JSX.Element {
  const start = useRef<{ pos: number; wert: number } | null>(null);
  const senkrecht = p.richtung === 'senkrecht';
  const begrenze = (w: number): number => Math.min(Math.max(w, p.min), p.max);
  const runde = (w: number): number => Number(w.toFixed(4));
  const position = (e: PointerEvent): number => (senkrecht ? e.clientX : e.clientY);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0) return;
    // jsdom kennt kein Pointer-Capture; im Browser hält es den Griff auch
    // dann, wenn der Zeiger über die Canvas wandert.
    e.currentTarget.setPointerCapture?.(e.pointerId);
    start.current = { pos: position(e), wert: p.wert };
    // preventDefault unterdrückt auch die Standard-Fokussierung eines
    // <div tabIndex={0}> durch den Klick (sonst würde hier die
    // Textauswahl starten) — deshalb den Fokus von Hand setzen, damit
    // Pfeiltasten sofort nach dem Anfassen wirken, ohne extra Tab.
    e.preventDefault();
    e.currentTarget.focus();
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>): void => {
    if (start.current === null) return;
    p.onWert(runde(begrenze(p.ausVersatz(start.current.wert, position(e) - start.current.pos))));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>): void => {
    if (start.current === null) return;
    start.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    const rechts = p.kante === 'rechts';
    const groesser = senkrecht ? (rechts ? 'ArrowRight' : 'ArrowLeft') : 'ArrowDown';
    const kleiner = senkrecht ? (rechts ? 'ArrowLeft' : 'ArrowRight') : 'ArrowUp';
    let neu: number | null = null;
    if (e.key === groesser) neu = p.wert + p.schritt;
    else if (e.key === kleiner) neu = p.wert - p.schritt;
    else if (e.key === 'Home') neu = p.min;
    else if (e.key === 'End') neu = p.max;
    if (neu === null) return;
    // Vor den globalen Kürzeln (Pfeile ändern sonst die Zeitraffung).
    e.preventDefault();
    p.onWert(runde(begrenze(neu)));
  };

  return (
    <div
      role="separator"
      aria-orientation={senkrecht ? 'vertical' : 'horizontal'}
      aria-valuenow={p.wert}
      aria-valuemin={p.min}
      aria-valuemax={p.max}
      aria-label={p.label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={`touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 ${
        senkrecht ? 'cursor-col-resize' : 'cursor-row-resize'
      } ${p.className ?? ''}`}
    />
  );
}
