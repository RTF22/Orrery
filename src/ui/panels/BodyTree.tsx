import { useStore } from '../../store';
import { bodies, bodyIndex } from '../../data/index';
import type { Body } from '../../sim/types';
import { scaledRadius } from '../../sim/scale';
import { t } from '../i18n';
import { Panel } from './Panel';

export interface TreeNode { body: Body; children: TreeNode[] }

export function buildTree(liste: Body[]): TreeNode[] {
  const knoten = new Map<string, TreeNode>(
    liste.map((body) => [body.id, { body, children: [] }]),
  );
  const wurzeln: TreeNode[] = [];
  for (const body of liste) {
    const k = knoten.get(body.id);
    if (k === undefined) continue;
    if (body.parent === null) wurzeln.push(k);
    else knoten.get(body.parent)?.children.push(k);
  }
  return wurzeln;
}

/** Abstand, aus dem ein Körper formatfüllend, aber vollständig zu sehen ist. */
const FOKUS_FAKTOR = 8;
const FOKUS_MIN_KM = 1e4;

function Zeile({ knoten, tiefe }: { knoten: TreeNode; tiefe: number }): React.JSX.Element {
  const ziel = useStore((s) => s.camera.targetId);
  const versteckt = useStore((s) => s.visible[knoten.body.id] === false);
  const setCamera = useStore((s) => s.setCamera);
  const toggleVisible = useStore((s) => s.toggleVisible);

  const name = t(knoten.body.info.nameKey);

  const fokussieren = (): void => {
    const { camera, scale, time } = useStore.getState();
    const radius = scaledRadius(bodyIndex[knoten.body.id] ?? knoten.body, scale);
    setCamera({
      targetId: knoten.body.id,
      distance: Math.max(radius * FOKUS_FAKTOR, FOKUS_MIN_KM),
      // Im freien Modus wird die Position des Körpers als Bezugspunkt
      // eingefroren: Drehen und Zoomen wirken ab jetzt auf ihn, er zieht mit
      // der Zeit aber daran vorbei. Geheftet und Verfolgung führen ihn
      // ohnehin mit und brauchen keinen festen Punkt.
      freezeJd: camera.mode === 'free' ? time.jd : null,
    });
  };

  return (
    <>
      <li className="flex items-center gap-2" style={{ paddingLeft: `${tiefe * 0.9}rem` }}>
        <input
          type="checkbox"
          aria-label={`${name} ${t('tree.show')}`}
          checked={!versteckt}
          onChange={() => { toggleVisible(knoten.body.id); }}
        />
        <button
          type="button"
          title={t('tree.focus')}
          aria-pressed={ziel === knoten.body.id}
          onClick={fokussieren}
          className={`flex items-center gap-2 rounded px-1 py-0.5 text-left hover:bg-white/10 ${
            ziel === knoten.body.id ? 'text-sky-300' : ''
          }`}
        >
          <span
            aria-hidden="true"
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: knoten.body.appearance.color }}
          />
          <span>{name}</span>
        </button>
      </li>
      {knoten.children.map((kind) => (
        <Zeile key={kind.body.id} knoten={kind} tiefe={tiefe + 1} />
      ))}
    </>
  );
}

export function BodyTree(): React.JSX.Element {
  const baum = buildTree(bodies);
  return (
    <Panel id="tree" title={t('panel.bodies')}>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {baum.map((knoten) => <Zeile key={knoten.body.id} knoten={knoten} tiefe={0} />)}
      </ul>
    </Panel>
  );
}
