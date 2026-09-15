import { useStore } from '../store';
import { t } from './i18n';
import { useSprache } from './i18n/useSprache';
import { Kopfzeile } from './Kopfzeile';
import { Panel } from './panels/Panel';
import { TimePanel } from './panels/TimePanel';
import { ScalePanel } from './panels/ScalePanel';
import { CinemaPanel } from './panels/CinemaPanel';
import { CameraPanel } from './panels/CameraPanel';
import { DisplayPanel } from './panels/DisplayPanel';
import { AnsichtenPanel } from './panels/AnsichtenPanel';
import { BodyTree } from './panels/BodyTree';
import { InfoPanel } from './info/InfoPanel';
import { useShortcuts, SHORTCUTS_PANEL } from './shortcuts/useShortcuts';
import { useIdleHide } from './idle';
import { useWakeLock } from './wakeLock';

/**
 * Belegung für die Übersicht — Wirkung als Sprachschlüssel. Die Taste selbst
 * ist entweder ein Literal (Buchstaben wie „H") oder, wenn sie einen Namen
 * statt eines Symbols trägt, ebenfalls ein Sprachschlüssel.
 */
const KUERZEL: readonly (readonly [string | { key: string }, string])[] = [
  ['H', 'shortcuts.toggleUi'],
  ['F', 'shortcuts.fullscreen'],
  [{ key: 'key.space' }, 'shortcuts.pause'],
  [{ key: 'key.arrows' }, 'shortcuts.rate'],
  ['R', 'shortcuts.reverse'],
  [{ key: 'key.home' }, 'shortcuts.resetCamera'],
  ['C', 'shortcuts.cinema'],
  ['N', 'shortcuts.nextScene'],
  ['L', 'shortcuts.language'],
  ['I', 'shortcuts.info'],
  ['?', 'shortcuts.toggleHelp'],
];

function Kuerzeluebersicht(): React.JSX.Element {
  return (
    <Panel id={SHORTCUTS_PANEL} title={t('shortcuts.title')}>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {KUERZEL.map(([taste, schluessel]) => {
          const label = typeof taste === 'string' ? taste : t(taste.key);
          return (
            <div key={schluessel} className="contents">
              <dt className="font-mono text-xs opacity-80">{label}</dt>
              <dd className="m-0">{t(schluessel)}</dd>
            </div>
          );
        })}
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
  // Muss vor allem anderen stehen, damit t() in diesem Durchlauf schon die
  // neue Tabelle sieht.
  useSprache();
  useShortcuts();
  const untaetig = useIdleHide();
  const versteckt = useStore((s) => s.ui.hidden);
  const laeuftKino = useStore((s) => s.cinema.running);
  // Solange der Film läuft, darf der Bildschirm nicht abschalten.
  useWakeLock(laeuftKino);
  const zeigeKuerzel = useStore((s) => s.ui.panels[SHORTCUTS_PANEL] === true);

  // Im Kino-Modus verschwindet die Oberfläche nach kurzer Ruhe von selbst;
  // außerhalb bleibt sie stehen, bis H gedrückt wird.
  if (versteckt || (laeuftKino && untaetig)) return null;

  return (
    <div className="pointer-events-none fixed inset-0 flex items-start justify-between gap-2 p-3 text-slate-100">
      <div className="flex max-h-full w-72 max-w-full flex-col gap-2 overflow-y-auto">
        <Kopfzeile />
        {/* Die Himmelskörper stehen bewusst gleich unter dem Sprachschalter. */}
        <BodyTree />
        <TimePanel />
        <ScalePanel />
        <CinemaPanel />
        <CameraPanel />
        <DisplayPanel />
        <AnsichtenPanel />
        {zeigeKuerzel ? <Kuerzeluebersicht /> : null}
      </div>
      <InfoPanel />
    </div>
  );
}
