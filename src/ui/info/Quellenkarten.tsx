import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../store';
import { quellenFuer, QUELLEN_ART_REIHENFOLGE } from '../../data/quellen';
import type { Quelle } from '../../data/quellen';
import { t } from '../i18n';

interface Props {
  /** Text-Kennung wie 'objekt:earth'. */
  kennung: string;
  /** Schlüssel der hervorgehobenen Karte ('quelle:<id>' oder 'literatur:<id>'). */
  hervorgehoben: string | null;
}

const herausgeberName = (q: Quelle): string =>
  (q.herausgeber === 'sonstige' ? t('quelle.herausgeber.sonstige') : q.herausgeber);

/**
 * Unteres Segment (Entwurf 4c §4.4): Karten zu den passenden Quellen, nach
 * Art gruppiert, in der Gruppe zuerst die Seiten in der Oberflächensprache.
 * Jede Karte ist ein Anker im neuen Tab — nichts wird eingebettet.
 */
export function Quellenkarten({ kennung, hervorgehoben }: Props): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const liste = useMemo(() => quellenFuer(kennung, language), [kennung, language]);
  const karten = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    if (hervorgehoben === null || !hervorgehoben.startsWith('quelle:')) return;
    // jsdom kennt scrollIntoView nicht; im Browser ist es immer da.
    karten.current.get(hervorgehoben.slice('quelle:'.length))?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [hervorgehoben]);

  if (liste.length === 0) {
    return <p className="m-0 text-xs opacity-70">{t('info.keineQuellen')}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {QUELLEN_ART_REIHENFOLGE.filter((art) => liste.some((q) => q.art === art)).map((art) => (
        <section key={art}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">{t(`quelle.art.${art}`)}</h3>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {liste.filter((q) => q.art === art).map((q) => (
              <li key={q.id}>
                <a
                  ref={(el) => {
                    if (el === null) karten.current.delete(q.id);
                    else karten.current.set(q.id, el);
                  }}
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-quelle={q.id}
                  className={`block rounded border px-2 py-1 text-xs transition-colors hover:bg-white/10 ${
                    hervorgehoben === `quelle:${q.id}` ? 'border-sky-300/80 bg-sky-400/20' : 'border-white/15'
                  }`}
                >
                  <span className="font-medium">{q.titel[language]}</span>
                  <span className="mt-0.5 block opacity-70">
                    {herausgeberName(q)} · {q.sprache.toUpperCase()} · {t('info.neuerTab')}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
