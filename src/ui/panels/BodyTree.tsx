import { useState } from 'react';
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

/**
 * Sammelt einen Körper und alle seine Nachkommen (rekursiv über `parent`).
 * Dient dazu, die Sichtbarkeit einer ganzen Mondgruppe auf einmal
 * umzuschalten — der Store kennt nur einzelne Körper, die Kaskade ist reine
 * Baumlogik und lebt deshalb hier statt im Store.
 */
export function kaskadierendeSichtbarkeit(id: string): string[] {
  const kinderVon = new Map<string, string[]>();
  for (const body of bodies) {
    if (body.parent === null) continue;
    const liste = kinderVon.get(body.parent) ?? [];
    liste.push(body.id);
    kinderVon.set(body.parent, liste);
  }
  const ergebnis: string[] = [];
  const sammeln = (aktuelle: string): void => {
    ergebnis.push(aktuelle);
    for (const kind of kinderVon.get(aktuelle) ?? []) sammeln(kind);
  };
  sammeln(id);
  return ergebnis;
}

/** Abstand, aus dem ein Körper formatfüllend, aber vollständig zu sehen ist. */
const FOKUS_FAKTOR = 8;
const FOKUS_MIN_KM = 1e4;

function Zeile({ knoten, tiefe }: { knoten: TreeNode; tiefe: number }): React.JSX.Element {
  const ziel = useStore((s) => s.camera.targetId);
  const versteckt = useStore((s) => s.visible[knoten.body.id] === false);
  const setCamera = useStore((s) => s.setCamera);
  const toggleVisible = useStore((s) => s.toggleVisible);
  // Der Klappzustand lebt bewusst in useState statt im Store: Anders als
  // `visible` würde er sonst das geteilte URL-Fragment bei jedem Auf- und
  // Zuklappen vergrößern (siehe die Begründung bei `toggleVisible` in
  // store/index.ts), obwohl er rein lokale Darstellung ist. Die Wurzel
  // (Sonne, Tiefe 0) startet aufgeklappt, jede Mondgruppe darunter zu.
  const [aufgeklappt, setAufgeklappt] = useState(tiefe === 0);
  const hatKinder = knoten.children.length > 0;

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

  // Blendet mit dem Körper auch alle seine Nachkommen aus bzw. wieder ein.
  // Zielzustand ist das Gegenteil des aktuellen Zustands dieser Zeile — jeder
  // Nachkomme wird nur dann umgeschaltet, wenn er davon abweicht. So kippt
  // nicht die Hälfte der Monde in die falsche Richtung, falls einzelne zuvor
  // schon individuell aus- oder eingeblendet worden waren.
  const sichtbarkeitKaskadieren = (): void => {
    const zielVersteckt = !versteckt;
    const aktuelleSichtbarkeit = useStore.getState().visible;
    kaskadierendeSichtbarkeit(knoten.body.id).forEach((id) => {
      const istVersteckt = aktuelleSichtbarkeit[id] === false;
      if (istVersteckt !== zielVersteckt) toggleVisible(id);
    });
  };

  return (
    <>
      <li className="flex items-center gap-2" style={{ paddingLeft: `${tiefe * 0.9}rem` }}>
        {hatKinder ? (
          <button
            type="button"
            aria-expanded={aufgeklappt}
            aria-label={`${name} ${aufgeklappt ? t('tree.collapse') : t('tree.expand')}`}
            onClick={() => { setAufgeklappt((v) => !v); }}
            className="flex size-4 shrink-0 items-center justify-center text-xs opacity-70 hover:opacity-100"
          >
            <span aria-hidden="true">{aufgeklappt ? '▾' : '▸'}</span>
          </button>
        ) : (
          <span className="inline-block size-4 shrink-0" aria-hidden="true" />
        )}
        <input
          type="checkbox"
          aria-label={`${name} ${t('tree.show')}`}
          checked={!versteckt}
          onChange={sichtbarkeitKaskadieren}
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
      {aufgeklappt ? knoten.children.map((kind) => (
        <Zeile key={kind.body.id} knoten={kind} tiefe={tiefe + 1} />
      )) : null}
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
