import { useMemo } from 'react';
import type { Body } from '../../sim/types';
import type { Niveau } from '../../data/themen';
import { bodyIndex } from '../../data';
import { useStore } from '../../store';
import { t } from '../i18n';
import { isOutOfRange } from '../format';
import { datenzeilen } from './datenblock';
import { useLiveJd } from './useLiveJd';

export const VERWEIS_KNOPF = 'cursor-pointer text-sky-300 underline decoration-sky-300/50 underline-offset-2 hover:text-sky-200';

interface Props {
  body: Body;
  niveau: Niveau;
  /** Klick auf „Grenzen des Modells". */
  onModell: () => void;
}

/** Kennzahlen über dem Text; Live-Werte laufen im Takt von useLiveJd. */
export function Datenblock({ body, niveau, onModell }: Props): React.JSX.Element {
  const jd = useLiveJd();
  const language = useStore((s) => s.ui.language);
  // language steht in den Abhängigkeiten, weil t() und die Locale davon abhängen.
  const zeilen = useMemo(() => datenzeilen(body, niveau, jd, bodyIndex), [body, niveau, jd, language]);
  const ausserhalb = isOutOfRange(jd);

  return (
    <dl data-testid="datenblock" className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
      {zeilen.map((z) => (
        <div key={z.schluessel} className="contents">
          <dt className="opacity-70">{t(z.schluessel)}</dt>
          <dd className="m-0 font-mono tabular-nums">
            {z.wert}
            {z.hinweis !== undefined ? <span className="ml-1 font-sans opacity-70">{z.hinweis}</span> : null}
          </dd>
        </div>
      ))}
      {ausserhalb || niveau === 'hochschule' ? (
        <div className="col-span-2 mt-1">
          {ausserhalb ? <span className="mr-1 text-amber-300">{t('info.ausserhalbFenster')}</span> : null}
          <button type="button" className={VERWEIS_KNOPF} onClick={onModell}>{t('info.modellgrenzen')}</button>
        </div>
      ) : null}
    </dl>
  );
}
