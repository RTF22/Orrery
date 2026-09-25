import { useEffect, useId, useRef, type ReactNode } from 'react';
import { t } from '../i18n';

export interface KartenReiter<R extends string> {
  readonly id: R;
  readonly schluessel: string;
}

interface KartendialogProps<R extends string> {
  offen: boolean;
  titelSchluessel: string;
  /** Zugänglicher Name der Reiterleiste. */
  reiterSchluessel: string;
  reiter: readonly KartenReiter<R>[];
  aktiv: R;
  setAktiv(id: R): void;
  schliessen(): void;
  /** Präfix der Prüfkennungen `<kennung>-hintergrund` und `<kennung>-inhalt`. */
  kennung: string;
  /** Tailwind-Klassen für die Breite der Karte (vollständige Klassennamen, damit Tailwind sie findet). */
  breite: string;
  /** Inhalt des aktiven Reiters. */
  children: ReactNode;
}

const FOKUSSIERBAR = 'button, a[href], [tabindex]';

/**
 * Gemeinsamer Rahmen der Karten (Entwurf Info-Karte §3, §7): modaler Dialog
 * über abgedunkeltem Hintergrund, Reiter, kein Scrollen. Escape wird hier
 * behandelt und als erledigt markiert (preventDefault), damit der globale
 * Kürzel-Hook es nicht zusätzlich als „Kino beenden" liest.
 */
export function Kartendialog<R extends string>(p: KartendialogProps<R>): React.JSX.Element | null {
  const titelId = useId();
  const basisId = useId();
  const karte = useRef<HTMLDivElement>(null);
  const ausloeser = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!p.offen) return;
    ausloeser.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    karte.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus();
    // Der Auslöser kann inzwischen aus dem DOM verschwunden sein (etwa: ⓘ im
    // laufenden Kino geöffnet, Kino-Ruhe blendet die Oberfläche samt
    // Kopfzeile aus, Karte schließen) — dann bleibt der Fokus beim Dokument.
    return () => { if (ausloeser.current?.isConnected === true) ausloeser.current.focus(); };
  }, [p.offen]);

  if (!p.offen) return null;

  const tasteImDialog = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      p.schliessen();
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
    const i = p.reiter.findIndex((r) => r.id === p.aktiv);
    const neu = p.reiter[(i + richtung + p.reiter.length) % p.reiter.length]!.id;
    p.setAktiv(neu);
    karte.current?.querySelector<HTMLElement>(`#${CSS.escape(`${basisId}-${neu}`)}`)?.focus();
  };

  return (
    <div
      data-testid={`${p.kennung}-hintergrund`}
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
      onClick={(e) => { if (e.target === e.currentTarget) p.schliessen(); }}
    >
      <div
        ref={karte}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        onKeyDown={tasteImDialog}
        className={`karte flex max-h-full ${p.breite} flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900 text-sm text-slate-100 shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <h2 id={titelId} className="text-base font-semibold">{t(p.titelSchluessel)}</h2>
          <button
            type="button"
            aria-label={t('karte.schliessen')}
            onClick={p.schliessen}
            className="rounded px-2 py-1 text-lg leading-none opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col [@media(max-height:500px)]:flex-row">
          <div
            role="tablist"
            aria-label={t(p.reiterSchluessel)}
            className="flex gap-1 border-b border-white/10 px-3 pt-2 [@media(max-height:500px)]:flex-col [@media(max-height:500px)]:border-b-0 [@media(max-height:500px)]:border-r [@media(max-height:500px)]:pb-2"
          >
            {p.reiter.map((r) => {
              const aktiv = r.id === p.aktiv;
              return (
                <button
                  key={r.id}
                  id={`${basisId}-${r.id}`}
                  type="button"
                  role="tab"
                  aria-selected={aktiv}
                  aria-controls={`${basisId}-inhalt`}
                  tabIndex={aktiv ? 0 : -1}
                  onClick={() => { p.setAktiv(r.id); }}
                  onKeyDown={tasteAufReiter}
                  className={`rounded-t px-3 py-1.5 ${aktiv ? 'bg-sky-400/20 font-semibold' : 'opacity-70 hover:opacity-100'}`}
                >
                  {t(r.schluessel)}
                </button>
              );
            })}
          </div>
          <div
            id={`${basisId}-inhalt`}
            role="tabpanel"
            aria-labelledby={`${basisId}-${p.aktiv}`}
            data-testid={`${p.kennung}-inhalt`}
            className="min-h-0 flex-1 overflow-hidden px-4 py-3 leading-snug"
          >
            {p.children}
          </div>
        </div>
      </div>
    </div>
  );
}
