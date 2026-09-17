import { createElement, memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import { texNachMathml } from './texUebersetzer';
import type { MathKnoten } from './texUebersetzer';

/**
 * Gibt einen Knoten des MathML-Datenbaums aus. React legt alles unterhalb
 * von math im MathML-Namensraum an; die Attribute (display, mathvariant,
 * stretchy, …) gehen unverändert an das Element.
 */
function ausgabe(k: MathKnoten, schluessel: number): ReactNode {
  if ('text' in k) return createElement(k.tag, { key: schluessel, ...k.attribute }, k.text);
  return createElement(k.tag, { key: schluessel, ...k.attribute }, k.kinder.map(ausgabe));
}

/**
 * Eine Formel aus einem Erläuterungstext (Entwurf 4d §3.4). Blockformeln
 * scrollen waagerecht, damit breite Formeln die schmale Spalte nicht
 * sprengen. Übersetzt die Formel nicht, erscheint der TeX-Quelltext; der
 * Dateitest verhindert das in ausgelieferten Texten.
 *
 * Mit `memo` umschlossen (Schlussprüfung 4d-1, Befund M8): `tex` und
 * `block` sind beide Primitive, ein flacher Props-Vergleich genügt also.
 * Ohne `memo` baut `ausgabe` bei jedem Render des Panels (etwa beim Ziehen
 * am Breiten- oder Teilungsgriff) die MathML-Elementbäume aller Formeln neu
 * auf, obwohl `useMemo` nur die Übersetzung selbst zwischenspeichert.
 */
function FormelBasis({ tex, block }: { tex: string; block: boolean }): React.JSX.Element {
  const ergebnis = useMemo(() => texNachMathml(tex, block), [tex, block]);
  if ('fehler' in ergebnis) {
    return (
      <code data-formelfehler={ergebnis.fehler} title={`${ergebnis.fehler} (Stelle ${ergebnis.stelle})`} className="text-amber-300">
        {tex}
      </code>
    );
  }
  const math = ausgabe(ergebnis.baum, 0);
  return block ? <div data-blockformel className="overflow-x-auto py-1">{math}</div> : <>{math}</>;
}

export const Formel = memo(FormelBasis);
