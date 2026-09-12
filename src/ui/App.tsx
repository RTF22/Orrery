import { useStore } from '../store';
import { t } from './i18n';
import { Panel } from './panels/Panel';
import { TimePanel } from './panels/TimePanel';
import { useShortcuts, SHORTCUTS_PANEL } from './shortcuts/useShortcuts';

/** Belegung für die Übersicht — Wirkung als Sprachschlüssel. */
const KUERZEL: readonly (readonly [string, string])[] = [
  ['H', 'shortcuts.toggleUi'],
  ['F', 'shortcuts.fullscreen'],
  ['␣', 'shortcuts.pause'],
  ['◀ ▶', 'shortcuts.rate'],
  ['R', 'shortcuts.reverse'],
  ['Pos1', 'shortcuts.resetCamera'],
  ['?', 'shortcuts.toggleHelp'],
];

function Kuerzeluebersicht(): React.JSX.Element {
  return (
    <Panel id={SHORTCUTS_PANEL} title={t('shortcuts.title')}>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {KUERZEL.map(([taste, schluessel]) => (
          <div key={taste} className="contents">
            <dt className="font-mono text-xs opacity-80">{taste}</dt>
            <dd className="m-0">{t(schluessel)}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/**
 * Die Bedienoberfläche liegt als eigene Ebene über der Canvas. Sie lässt
 * Zeigereignisse durch (`pointer-events-none`); nur die Panels selbst fangen
 * sie wieder ein, damit das Ziehen der Kamera überall sonst funktioniert.
 *
 * Die Panels für Zeit, Maßstab, Kamera und Objektbaum füllen die Aufgaben 17
 * bis 19; hier steht zunächst das Gerüst mit Tastenkürzeln und Übersicht.
 */
export function App(): React.JSX.Element | null {
  useShortcuts();
  const versteckt = useStore((s) => s.ui.hidden);
  const zeigeKuerzel = useStore((s) => s.ui.panels[SHORTCUTS_PANEL] === true);

  if (versteckt) return null;

  return (
    <div className="pointer-events-none fixed inset-0 flex flex-col gap-2 p-3 text-slate-100">
      <div className="flex w-72 max-w-full flex-col gap-2 overflow-y-auto">
        <TimePanel />
        {zeigeKuerzel ? <Kuerzeluebersicht /> : null}
      </div>
    </div>
  );
}
