import { useEffect, useId, useRef } from 'react';
import { t } from '../i18n';
import { useInfoKarte, type InfoReiter } from './zustand';
import { ReiterApp, ReiterBedienung, ReiterUeber } from './inhalte';

const REITER: readonly (readonly [InfoReiter, string])[] = [
  ['app', 'infokarte.reiter.app'],
  ['bedienung', 'infokarte.reiter.bedienung'],
  ['ueber', 'infokarte.reiter.ueber'],
];

const FOKUSSIERBAR = 'button, a[href], [tabindex]';

/**
 * Info-Karte (Entwurf Info-Karte §3): modaler Dialog über abgedunkeltem
 * Hintergrund, drei Reiter, kein Scrollen. Escape wird hier behandelt und
 * als erledigt markiert (preventDefault), damit der globale Kürzel-Hook es
 * nicht zusätzlich als „Kino beenden" liest.
 */
export function InfoKarte(): React.JSX.Element | null {
  const offen = useInfoKarte((s) => s.offen);
  const reiter = useInfoKarte((s) => s.reiter);
  const setReiter = useInfoKarte((s) => s.setReiter);
  const schliessen = useInfoKarte((s) => s.schliessen);
  const titelId = useId();
  const basisId = useId();
  const karte = useRef<HTMLDivElement>(null);
  const ausloeser = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!offen) return;
    ausloeser.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    karte.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus();
    return () => { ausloeser.current?.focus(); };
  }, [offen]);

  if (!offen) return null;

  const tasteImDialog = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      schliessen();
      return;
    }
    if (e.key !== 'Tab' || karte.current === null) return;
    // Nur per Tab erreichbare Ziele: Reiter außer dem aktiven tragen tabIndex −1.
    const ziele = [...karte.current.querySelectorAll<HTMLElement>(FOKUSSIERBAR)].filter((z) => z.tabIndex >= 0);
    if (ziele.length === 0) return;
    const erstes = ziele[0]!;
    const letztes = ziele[ziele.length - 1]!;
    if (!e.shiftKey && document.activeElement === letztes) { e.preventDefault(); erstes.focus(); }
    if (e.shiftKey && document.activeElement === erstes) { e.preventDefault(); letztes.focus(); }
  };

  const tasteAufReiter = (e: React.KeyboardEvent): void => {
    const richtung = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (richtung === 0) return;
    e.preventDefault();
    const i = REITER.findIndex(([id]) => id === reiter);
    const neu = REITER[(i + richtung + REITER.length) % REITER.length]![0];
    setReiter(neu);
    karte.current?.querySelector<HTMLElement>(`#${CSS.escape(`${basisId}-${neu}`)}`)?.focus();
  };

  return (
    <div
      data-testid="infokarte-hintergrund"
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
      onClick={(e) => { if (e.target === e.currentTarget) schliessen(); }}
    >
      <div
        ref={karte}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        onKeyDown={tasteImDialog}
        className="infokarte flex max-h-full w-[min(92vw,34rem)] flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 text-sm text-slate-100 shadow-2xl [@media(max-height:500px)]:w-[min(96vw,48rem)]"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <h2 id={titelId} className="text-base font-semibold">{t('infokarte.titel')}</h2>
          <button
            type="button"
            aria-label={t('infokarte.schliessen')}
            onClick={schliessen}
            className="rounded px-2 py-1 text-lg leading-none opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col [@media(max-height:500px)]:flex-row">
          <div
            role="tablist"
            aria-label={t('infokarte.reiter')}
            className="flex gap-1 border-b border-white/10 px-3 pt-2 [@media(max-height:500px)]:flex-col [@media(max-height:500px)]:border-b-0 [@media(max-height:500px)]:border-r [@media(max-height:500px)]:pb-2"
          >
            {REITER.map(([id, schluessel]) => {
              const aktiv = id === reiter;
              return (
                <button
                  key={id}
                  id={`${basisId}-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={aktiv}
                  aria-controls={`${basisId}-inhalt`}
                  tabIndex={aktiv ? 0 : -1}
                  onClick={() => { setReiter(id); }}
                  onKeyDown={tasteAufReiter}
                  className={`rounded-t px-3 py-1.5 ${aktiv ? 'bg-sky-400/20 font-semibold' : 'opacity-70 hover:opacity-100'}`}
                >
                  {t(schluessel)}
                </button>
              );
            })}
          </div>
          <div
            id={`${basisId}-inhalt`}
            role="tabpanel"
            aria-labelledby={`${basisId}-${reiter}`}
            data-testid="infokarte-inhalt"
            className="min-h-0 flex-1 overflow-hidden px-4 py-3 leading-snug"
          >
            {reiter === 'app' ? <ReiterApp /> : reiter === 'bedienung' ? <ReiterBedienung /> : <ReiterUeber />}
          </div>
        </div>
      </div>
    </div>
  );
}
