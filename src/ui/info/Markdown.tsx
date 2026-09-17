import { Fragment, useMemo } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { parseMarkdown } from './markdownParser';
import type { Block, Inline } from './markdownParser';
import type { Ausrichtung } from './markdownParser';
import { verweisAufloesen } from '../../data/verweise';
import type { Verweis } from '../../data/verweise';
import { VERWEIS_KNOPF } from './Datenblock';
import { Formel } from './Formel';
import { hauptadresse } from '../../data/literatur';

interface Props {
  text: string;
  onVerweis: (v: Verweis) => void;
  /** Die erste Überschrift der Ebene 1 steht schon im Panelkopf. */
  titelAusblenden?: boolean;
}

/** Mittelklick, Strg-, Cmd- oder Umschalt-Klick: der Browser öffnet den Tab, wir greifen nicht ein. */
const willNeuenTab = (e: MouseEvent): boolean => e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey;

/**
 * Ein Verweis im Text. `data-verweis` trägt das Ziel aus der Datei, damit
 * Rundgänge im Browser die Art eines Verweises ablesen können, statt sie aus
 * Store-Änderungen zu erschließen (Abnahme 4c-3, Bekannte Unschärfen 8).
 */
function Verweisknoten({ ziel, onVerweis, children }: { ziel: string; onVerweis: (v: Verweis) => void; children: ReactNode }): React.JSX.Element {
  const v = verweisAufloesen(ziel);
  if (v === null) return <span>{children}</span>;
  if (v.art === 'extern') {
    return <a href={v.url} target="_blank" rel="noopener noreferrer" className={VERWEIS_KNOPF} data-verweis={ziel}>{children}</a>;
  }
  if (v.art === 'quelle' || v.art === 'literatur') {
    // Anker mit echter Adresse: Mittelklick öffnet den Tab, Linksklick hebt
    // die Karte hervor (Entwurf 4c §4.3, 4d §4.2).
    const href = v.art === 'quelle' ? v.quelle.url : hauptadresse(v.publikation);
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={VERWEIS_KNOPF}
        data-verweis={ziel}
        onClick={(e) => {
          if (willNeuenTab(e)) return;
          e.preventDefault();
          onVerweis(v);
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={VERWEIS_KNOPF} data-verweis={ziel} onClick={() => { onVerweis(v); }}>
      {children}
    </button>
  );
}

function Inlines({ kinder, onVerweis }: { kinder: Inline[]; onVerweis: (v: Verweis) => void }): React.JSX.Element {
  return (
    <>
      {kinder.map((k, i) => {
        switch (k.typ) {
          case 'text': return <Fragment key={i}>{k.text}</Fragment>;
          case 'formel': return <Formel key={i} tex={k.tex} block={false} />;
          case 'fett': return <strong key={i}><Inlines kinder={k.kinder} onVerweis={onVerweis} /></strong>;
          case 'kursiv': return <em key={i}><Inlines kinder={k.kinder} onVerweis={onVerweis} /></em>;
          case 'link':
            return (
              <Verweisknoten key={i} ziel={k.ziel} onVerweis={onVerweis}>
                <Inlines kinder={k.kinder} onVerweis={onVerweis} />
              </Verweisknoten>
            );
        }
      })}
    </>
  );
}

const UEBERSCHRIFT_KLASSE = {
  1: 'text-base font-semibold',
  2: 'mt-1 text-sm font-semibold',
  3: 'mt-1 text-sm font-medium opacity-90',
} as const;

const ZELLE = 'whitespace-nowrap border border-white/15 px-2 py-1';
const AUSRICHTUNG: Record<Ausrichtung, string> = { links: 'text-left', mitte: 'text-center', rechts: 'text-right' };

function Blockknoten({ block, onVerweis }: { block: Block; onVerweis: (v: Verweis) => void }): React.JSX.Element {
  switch (block.typ) {
    case 'ueberschrift': {
      // Ebene 1 der Datei wird zu h2: h1 gehört dem Dokument, nicht dem Panel.
      const Tag = (`h${block.ebene + 1}`) as 'h2' | 'h3' | 'h4';
      return <Tag className={UEBERSCHRIFT_KLASSE[block.ebene]}><Inlines kinder={block.kinder} onVerweis={onVerweis} /></Tag>;
    }
    case 'absatz':
      return <p className="m-0"><Inlines kinder={block.kinder} onVerweis={onVerweis} /></p>;
    case 'liste': {
      const Tag = block.geordnet ? 'ol' : 'ul';
      return (
        <Tag className={`m-0 flex flex-col gap-1 pl-5 ${block.geordnet ? 'list-decimal' : 'list-disc'}`}>
          {block.punkte.map((punkt, i) => <li key={i}><Inlines kinder={punkt} onVerweis={onVerweis} /></li>)}
        </Tag>
      );
    }
    case 'formel':
      return <Formel tex={block.tex} block />;
    case 'tabelle':
      // Zellen brechen nicht um; ist die Tabelle breiter als die Spalte,
      // scrollt der Rahmen (Entwurf 4d §3.4).
      return (
        <div data-tabelle className="overflow-x-auto">
          <table className="border-collapse text-xs tabular-nums">
            <thead>
              <tr>
                {block.kopf.map((zelle, i) => (
                  <th key={i} scope="col" className={`${ZELLE} font-semibold ${AUSRICHTUNG[block.ausrichtung[i] ?? 'links']}`}>
                    <Inlines kinder={zelle} onVerweis={onVerweis} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.zeilen.map((zeile, r) => (
                <tr key={r}>
                  {zeile.map((zelle, i) => (
                    <td key={i} className={`${ZELLE} ${AUSRICHTUNG[block.ausrichtung[i] ?? 'links']}`}>
                      <Inlines kinder={zelle} onVerweis={onVerweis} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** Gibt einen Erläuterungstext aus; der Baum kommt aus parseMarkdown. */
export function Markdown({ text, onVerweis, titelAusblenden = false }: Props): React.JSX.Element {
  const bloecke = useMemo(() => {
    const alle = parseMarkdown(text);
    if (!titelAusblenden) return alle;
    const erster = alle.findIndex((b) => b.typ === 'ueberschrift' && b.ebene === 1);
    return erster < 0 ? alle : alle.filter((_, i) => i !== erster);
  }, [text, titelAusblenden]);

  return (
    <div className="flex flex-col gap-2 text-sm leading-relaxed">
      {bloecke.map((block, i) => <Blockknoten key={i} block={block} onVerweis={onVerweis} />)}
    </div>
  );
}
