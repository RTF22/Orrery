import { useStore } from '../store';
import { t } from './i18n';
import { useSprache } from './i18n/useSprache';
import { Kopfzeile } from './Kopfzeile';
import { Seitenleiste } from './Seitenleiste';
import { Bogenreiter } from './Bogenreiter';
import { useSchmal, useGrob } from './fenster';
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
import { useMusikStand } from './musikStand';

/**
 * Belegung für die Übersicht — Wirkung als Sprachschlüssel. Die Taste selbst
 * ist entweder ein Literal (Buchstaben wie „H") oder, wenn sie einen Namen
 * statt eines Symbols trägt, ebenfalls ein Sprachschlüssel.
 */
/** Zeilen der Kürzelübersicht: Taste (Literal oder Textschlüssel) und Textschlüssel der Wirkung. */
type Kuerzel = readonly (readonly [string | { key: string }, string])[];

const KUERZEL: Kuerzel = [
  ['H', 'shortcuts.toggleUi'],
  ['F', 'shortcuts.fullscreen'],
  [{ key: 'key.space' }, 'shortcuts.pause'],
  [{ key: 'key.arrows' }, 'shortcuts.rate'],
  ['R', 'shortcuts.reverse'],
  [{ key: 'key.home' }, 'shortcuts.resetCamera'],
  ['W A S D', 'shortcuts.fly'],
  ['Q E', 'shortcuts.flyUpDown'],
  ['Shift + W A S D', 'shortcuts.orbit'],
  [{ key: 'key.drag' }, 'shortcuts.flyLook'],
  [{ key: 'key.wheel' }, 'shortcuts.flySpeed'],
  ['C', 'shortcuts.cinema'],
  ['N', 'shortcuts.nextScene'],
  ['L', 'shortcuts.language'],
  ['I', 'shortcuts.info'],
  ['?', 'shortcuts.toggleHelp'],
];

/** M ist nur mit Musik des Betreibers belegt (useShortcuts.ts). */
const MUSIK_KUERZEL: Kuerzel = [['M', 'shortcuts.mute']];

/** Controller nach der Standardbelegung (Entwurf Flug und Controller §5.2, §5.3). */
const PAD_KUERZEL: Kuerzel = [
  [{ key: 'padKey.leftStick' }, 'shortcuts.padLook'],
  ['RT / LT', 'shortcuts.padFly'],
  [{ key: 'padKey.lbStick' }, 'shortcuts.padOrbit'],
  [{ key: 'padKey.rightStick' }, 'shortcuts.padCrosshair'],
  ['A', 'shortcuts.padGoTo'],
  ['B', 'shortcuts.padSystem'],
  ['R3', 'shortcuts.padCenter'],
  [{ key: 'padKey.dpadSides' }, 'shortcuts.rate'],
  [{ key: 'padKey.dpadUp' }, 'shortcuts.pause'],
  [{ key: 'padKey.dpadDown' }, 'shortcuts.reverse'],
  [{ key: 'padKey.menu' }, 'shortcuts.cinema'],
  ['RB', 'shortcuts.nextScene'],
  [{ key: 'padKey.view' }, 'shortcuts.toggleUi'],
  ['Y', 'shortcuts.info'],
];

function Kuerzelliste({ eintraege }: { eintraege: Kuerzel }): React.JSX.Element {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
      {eintraege.map(([taste, schluessel]) => {
        const label = typeof taste === 'string' ? taste : t(taste.key);
        return (
          <div key={schluessel} className="contents">
            <dt className="font-mono text-xs opacity-80">{label}</dt>
            <dd className="m-0">{t(schluessel)}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function Kuerzeluebersicht(): React.JSX.Element {
  // M ist nur mit Musik des Betreibers belegt (useShortcuts.ts).
  const musik = useMusikStand((s) => s.verfuegbar);
  return (
    <Panel id={SHORTCUTS_PANEL} title={t('shortcuts.title')}>
      <Kuerzelliste eintraege={musik ? [...KUERZEL, ...MUSIK_KUERZEL] : KUERZEL} />
      <h3 className="mb-1 mt-3 text-xs font-semibold opacity-80">{t('shortcuts.padTitle')}</h3>
      <Kuerzelliste eintraege={PAD_KUERZEL} />
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
  const schmal = useSchmal();
  const grob = useGrob();
  const versteckt = useStore((s) => s.ui.hidden);
  const laeuftKino = useStore((s) => s.cinema.running);
  // Solange der Film läuft, darf der Bildschirm nicht abschalten.
  useWakeLock(laeuftKino);
  const zeigeKuerzel = useStore((s) => s.ui.panels[SHORTCUTS_PANEL] === true);

  // Im Kino-Modus verschwindet die Oberfläche nach kurzer Ruhe von selbst;
  // außerhalb bleibt sie stehen, bis H gedrückt wird.
  if (versteckt || (laeuftKino && untaetig)) return null;

  return (
    <div className="ui-ebene pointer-events-none fixed inset-0 flex items-start justify-between gap-2 p-3 text-slate-100">
      <Seitenleiste kopf={<Kopfzeile />}>
        {/* Die Himmelskörper stehen bewusst gleich unter dem Sprachschalter. */}
        <BodyTree />
        <TimePanel />
        <ScalePanel />
        <CinemaPanel />
        <CameraPanel />
        <DisplayPanel />
        <AnsichtenPanel />
        {zeigeKuerzel && !grob ? <Kuerzeluebersicht /> : null}
      </Seitenleiste>
      <InfoPanel />
      {schmal ? <Bogenreiter /> : null}
    </div>
  );
}
