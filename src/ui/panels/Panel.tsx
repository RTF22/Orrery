import type { ReactNode } from 'react';
import { useStore } from '../../store';

interface PanelProps {
  /** Schlüssel in `ui.panels` — der Klappzustand lebt im Store, nicht lokal. */
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * Einklappbarer Abschnitt der Bedienoberfläche. Die Kopfzeile ist ein echter
 * `<button>`: Tastaturbedienung und Screenreader-Ansage gibt es damit ohne
 * eigenes ARIA-Gerüst.
 */
export function Panel({ id, title, children }: PanelProps): React.JSX.Element {
  const offen = useStore((s) => s.ui.panels[id] !== false);
  const setUi = useStore((s) => s.setUi);
  const panels = useStore((s) => s.ui.panels);

  return (
    <section className="pointer-events-auto rounded-lg border border-white/10 bg-slate-900/70 text-slate-100 backdrop-blur-md">
      <button
        type="button"
        aria-expanded={offen}
        onClick={() => { setUi({ panels: { ...panels, [id]: !offen } }); }}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-semibold"
      >
        <span>{title}</span>
        <span aria-hidden="true" className="text-xs opacity-70">{offen ? '▾' : '▸'}</span>
      </button>
      {offen ? <div className="border-t border-white/10 px-3 py-2 text-sm">{children}</div> : null}
    </section>
  );
}
