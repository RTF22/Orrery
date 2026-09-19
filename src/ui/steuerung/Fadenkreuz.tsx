import { useEffect, useRef } from 'react';
import { KREUZ_PX, kreuzAusblenden, kreuzElementSetzen } from './kreuz';

/**
 * Fadenkreuz des Controllers (Entwurf Flug und Controller §5.4): Ring mit
 * Mittelpunkt, weiß mit dunkler Kontur, ohne Zeigereingaben. Lage und
 * Sichtbarkeit setzt die Steuerung je Bild direkt am Element (kreuz.ts);
 * React rendert es nur beim Einhängen. Eine Bewegung der Maus blendet es aus,
 * die Maus übernimmt dann den Hover.
 */
export function Fadenkreuz(): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    kreuzElementSetzen(ref.current);
    const beiZeiger = (e: PointerEvent): void => {
      if (e.pointerType !== 'touch') kreuzAusblenden();
    };
    window.addEventListener('pointermove', beiZeiger, { passive: true });
    return () => {
      window.removeEventListener('pointermove', beiZeiger);
      kreuzElementSetzen(null);
    };
  }, []);

  const mitte = KREUZ_PX / 2;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-fadenkreuz=""
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{ display: 'none', width: KREUZ_PX, height: KREUZ_PX }}
    >
      <svg width={KREUZ_PX} height={KREUZ_PX} viewBox={`0 0 ${KREUZ_PX} ${KREUZ_PX}`}>
        <circle cx={mitte} cy={mitte} r={9} fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={3} />
        <circle cx={mitte} cy={mitte} r={9} fill="none" stroke="white" strokeWidth={1.5} />
        <circle cx={mitte} cy={mitte} r={1.5} fill="white" stroke="rgba(0,0,0,0.7)" strokeWidth={1} />
      </svg>
    </div>
  );
}
