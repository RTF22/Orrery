import { useState } from 'react';
import { useStore } from '../../store';
import { bodies } from '../../data/index';
import type { Body } from '../../sim/types';
import { t } from '../i18n';
import { Panel } from './Panel';
import { fahreZu, fahreZuSystem } from '../kamerafahrt';

/** Kennung der Sammelzeile „Zwergplaneten" — kein Körper des Katalogs. */
export const ZWERGPLANETEN_ZWEIG = 'dwarfs';

/**
 * Eine Zeile des Objektbaums. `body` ist `null` bei einer Sammelzeile ohne
 * eigenen Körper (derzeit nur der Zweig „Zwergplaneten").
 */
export interface TreeNode { id: string; nameKey: string; body: Body | null; children: TreeNode[] }

/**
 * Baut die Ebene unter der Wurzel „Sonnensystem": Sonne, Planeten in
 * Katalogreihenfolge, danach der Zweig mit den Zwergplaneten. In den Daten
 * hängen Planeten und Zwergplaneten an der Sonne (`parent: 'sun'`); der Baum
 * stellt sie bewusst neben die Sonne. Monde bleiben unter ihrem Körper.
 */
export function buildTree(liste: Body[]): TreeNode[] {
  const knoten = new Map<string, TreeNode>(
    liste.map((body) => [body.id, { id: body.id, nameKey: body.info.nameKey, body, children: [] }]),
  );
  const ebene: TreeNode[] = [];
  const zwerge: TreeNode[] = [];
  for (const body of liste) {
    const k = knoten.get(body.id);
    if (k === undefined) continue;
    if (body.parent === null) {
      ebene.push(k);
      continue;
    }
    const eltern = knoten.get(body.parent);
    // Kinder des Zentralgestirns rücken auf dessen Ebene.
    if (eltern?.body?.parent === null) (body.kind === 'dwarf' ? zwerge : ebene).push(k);
    else eltern?.children.push(k);
  }
  if (zwerge.length > 0) {
    ebene.push({ id: ZWERGPLANETEN_ZWEIG, nameKey: 'tree.dwarfs', body: null, children: zwerge });
  }
  return ebene;
}

/** Kennungen aller Körper einer Zeile und der Zeilen darunter. */
export function koerperImZweig(knoten: TreeNode): string[] {
  const ergebnis: string[] = [];
  const sammeln = (k: TreeNode): void => {
    if (k.body !== null) ergebnis.push(k.body.id);
    k.children.forEach(sammeln);
  };
  sammeln(knoten);
  return ergebnis;
}

/**
 * Sammelt die Körper, deren Sichtbarkeit eine Zeile mit umschaltet — entlang
 * des angezeigten Baums, nicht entlang `parent`: Die Sonne umfasst nur sich
 * selbst, der Zweig „Zwergplaneten" alle Zwergplaneten samt Monden. Der Store
 * kennt nur einzelne Körper, die Kaskade ist reine Baumlogik und lebt
 * deshalb hier statt im Store.
 */
export function kaskadierendeSichtbarkeit(id: string): string[] {
  const suchen = (liste: TreeNode[]): TreeNode | undefined => {
    for (const k of liste) {
      if (k.id === id) return k;
      const treffer = suchen(k.children);
      if (treffer !== undefined) return treffer;
    }
    return undefined;
  };
  const start = suchen(buildTree(bodies));
  return start === undefined ? [] : koerperImZweig(start);
}

function KlappKnopf({ name, aufgeklappt, umschalten }: {
  name: string; aufgeklappt: boolean; umschalten: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      aria-expanded={aufgeklappt}
      aria-label={`${name} ${aufgeklappt ? t('tree.collapse') : t('tree.expand')}`}
      onClick={umschalten}
      className="flex size-4 shrink-0 items-center justify-center text-xs opacity-70 hover:opacity-100"
    >
      <span aria-hidden="true">{aufgeklappt ? '▾' : '▸'}</span>
    </button>
  );
}

function Zeile({ knoten, tiefe }: { knoten: TreeNode; tiefe: number }): React.JSX.Element {
  const ziel = useStore((s) => s.camera.targetId);
  const ids = koerperImZweig(knoten);
  // Eine Körperzeile folgt ihrem eigenen Zustand, eine Sammelzeile gilt als
  // ausgeblendet, sobald alle Körper darin ausgeblendet sind.
  const versteckt = useStore((s) => (knoten.body === null
    ? ids.every((id) => s.visible[id] === false)
    : s.visible[knoten.body.id] === false));
  const toggleVisible = useStore((s) => s.toggleVisible);
  // Der Klappzustand lebt bewusst in useState statt im Store: Anders als
  // `visible` würde er sonst das geteilte URL-Fragment bei jedem Auf- und
  // Zuklappen vergrößern (siehe die Begründung bei `toggleVisible` in
  // store/index.ts), obwohl er rein lokale Darstellung ist. Alle Zeilen unter
  // der Wurzel starten zugeklappt.
  const [aufgeklappt, setAufgeklappt] = useState(false);
  const hatKinder = knoten.children.length > 0;
  const umschalten = (): void => { setAufgeklappt((v) => !v); };

  const name = t(knoten.nameKey);

  // Blendet mit der Zeile auch alle Körper darunter aus bzw. wieder ein.
  // Zielzustand ist das Gegenteil des aktuellen Zustands dieser Zeile — jeder
  // Körper wird nur dann umgeschaltet, wenn er davon abweicht. So kippt
  // nicht die Hälfte der Monde in die falsche Richtung, falls einzelne zuvor
  // schon individuell aus- oder eingeblendet worden waren.
  //
  // Bewusste Einschränkung: Das gilt nur für die Ausblend-Richtung. Beim
  // Wiedereinblenden werden ausnahmslos alle Körper darunter sichtbar — auch
  // einer, der vorher einzeln ausgeblendet war, verliert dabei seine
  // Einzelauswahl. Beispiel: Europa wird für sich ausgeblendet, danach
  // Jupiter aus- und wieder eingeblendet — Europa ist danach wieder da.
  // Akzeptiert, weil eine Kaskade, die pro Körper den vorherigen Einzelzustand
  // merkt, einen zusätzlichen Zustand bräuchte, den `visible` (siehe
  // store/index.ts) gerade bewusst nicht führt.
  const sichtbarkeitKaskadieren = (): void => {
    const zielVersteckt = !versteckt;
    const aktuelleSichtbarkeit = useStore.getState().visible;
    ids.forEach((id) => {
      const istVersteckt = aktuelleSichtbarkeit[id] === false;
      if (istVersteckt !== zielVersteckt) toggleVisible(id);
    });
  };

  const { body } = knoten;

  return (
    <>
      <li className="flex items-center gap-2" style={{ paddingLeft: `${tiefe * 0.9}rem` }}>
        {hatKinder ? (
          <KlappKnopf name={name} aufgeklappt={aufgeklappt} umschalten={umschalten} />
        ) : (
          <span className="inline-block size-4 shrink-0" aria-hidden="true" />
        )}
        <input
          type="checkbox"
          aria-label={`${name} ${t('tree.show')}`}
          checked={!versteckt}
          onChange={sichtbarkeitKaskadieren}
        />
        {body === null ? (
          // Eine Sammelzeile hat kein Kameraziel; ihr Name klappt sie auf und zu.
          <button
            type="button"
            aria-expanded={aufgeklappt}
            onClick={umschalten}
            className="rounded px-1 py-0.5 text-left hover:bg-white/10"
          >
            {name}
          </button>
        ) : (
          <button
            type="button"
            title={t('tree.focus')}
            aria-pressed={ziel === body.id}
            onClick={() => { fahreZu(body.id); }}
            className={`flex items-center gap-2 rounded px-1 py-0.5 text-left hover:bg-white/10 ${
              ziel === body.id ? 'text-sky-300' : ''
            }`}
          >
            <span
              aria-hidden="true"
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: body.appearance.color }}
            />
            <span>{name}</span>
          </button>
        )}
      </li>
      {aufgeklappt ? knoten.children.map((kind) => (
        <Zeile key={kind.id} knoten={kind} tiefe={tiefe + 1} />
      )) : null}
    </>
  );
}

export function BodyTree(): React.JSX.Element {
  const baum = buildTree(bodies);
  // Die Wurzel startet aufgeklappt, damit Sonne und Planeten sofort zu sehen
  // sind. Sie hat kein Kästchen: Alles auf einmal auszublenden ergibt keine
  // brauchbare Ansicht.
  const [aufgeklappt, setAufgeklappt] = useState(true);
  const name = t('tree.solarSystem');
  return (
    <Panel id="tree" title={t('panel.bodies')}>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        <li className="flex items-center gap-2">
          <KlappKnopf
            name={name}
            aufgeklappt={aufgeklappt}
            umschalten={() => { setAufgeklappt((v) => !v); }}
          />
          <button
            type="button"
            title={t('tree.focusSystem')}
            onClick={() => { fahreZuSystem(); }}
            className="rounded px-1 py-0.5 text-left font-semibold hover:bg-white/10"
          >
            {name}
          </button>
        </li>
        {aufgeklappt ? baum.map((knoten) => <Zeile key={knoten.id} knoten={knoten} tiefe={1} />) : null}
      </ul>
    </Panel>
  );
}
