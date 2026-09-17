import { useEffect, useRef } from 'react';
import { adsAdresse, arxivAdresse, autorenzeile, doiAdresse, istPreprint, jahrMitSuffix } from '../../data/literatur';
import type { Publikation } from '../../data/literatur';
import { t } from '../i18n';

interface Props {
  /** Die im Text zitierten Arbeiten, schon sortiert (zitate.ts). */
  arbeiten: readonly Publikation[];
  /** Schlüssel der hervorgehobenen Karte, etwa 'literatur:iess-2019'. */
  hervorgehoben: string | null;
}

const PRAEFIX = 'literatur:';
const LINK = 'text-sky-300 underline decoration-sky-300/50 underline-offset-2 hover:text-sky-200';

/**
 * Literaturkarten unter den Quellenkarten (Entwurf 4d §4.3): nur zu einem
 * Hochschultext und nur mit zitierten Arbeiten. Jeder Link öffnet im neuen
 * Tab, nichts wird eingebettet.
 */
export function Literaturkarten({ arbeiten, hervorgehoben }: Props): React.JSX.Element | null {
  const karten = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (hervorgehoben === null || !hervorgehoben.startsWith(PRAEFIX)) return;
    // jsdom kennt scrollIntoView nicht; im Browser ist es immer da.
    karten.current.get(hervorgehoben.slice(PRAEFIX.length))?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [hervorgehoben]);

  if (arbeiten.length === 0) return null;

  const link = (href: string, schluessel: string): React.JSX.Element => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>{t(schluessel)}</a>
  );

  return (
    <section className="mt-2">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">{t('quelle.art.literatur')}</h3>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {arbeiten.map((p) => (
          <li key={p.id}>
            <article
              ref={(el) => {
                if (el === null) karten.current.delete(p.id);
                else karten.current.set(p.id, el);
              }}
              data-literatur={p.id}
              className={`rounded border px-2 py-1 text-xs transition-colors ${
                hervorgehoben === `${PRAEFIX}${p.id}` ? 'border-sky-300/80 bg-sky-400/20' : 'border-white/15'
              }`}
            >
              <p className="m-0">{`${autorenzeile(p)} (${jahrMitSuffix(p)})`}</p>
              <p className="m-0 font-medium">{p.titel}</p>
              <p className="m-0 opacity-70">{istPreprint(p) ? `${p.erschienen} · ${t('literatur.preprint')}` : p.erschienen}</p>
              <p className="m-0 mt-0.5 flex flex-wrap gap-x-3">
                {p.doi !== undefined ? link(doiAdresse(p.doi), 'literatur.doi') : null}
                {p.arxiv !== undefined ? link(arxivAdresse(p.arxiv), 'literatur.arxiv') : null}
                {p.bibcode !== undefined ? link(adsAdresse(p.bibcode), 'literatur.ads') : null}
                {p.url !== undefined ? link(p.url, 'literatur.seite') : null}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
