import { useState } from 'react';
import { useStore } from '../../store';
import {
  ablageHolen, ansichtAnwenden, ansichtErstellen, ansichtenLesen, ansichtenSchreiben,
  nameBereinigen, NAME_MAX,
} from '../../store/persist';
import type { Ablage, Ansicht } from '../../store/persist';
import { t } from '../i18n';
import { Panel } from './Panel';

const KNOPF = 'rounded border border-white/15 px-2 py-1 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent';
const FELD = 'min-w-0 flex-1 rounded border border-white/15 bg-transparent px-2 py-1';

interface Props {
  /** Standard ist die echte Ablage; Tests übergeben einen Fake. */
  ablage?: Ablage | null;
}

/**
 * Panel „Ansichten" (Entwurf §5.3): benannte Einstellungen speichern und
 * laden. Die Liste lebt als React-Zustand hier und wird bei jeder Änderung
 * in die Ablage geschrieben; sie geht nicht durch den Store, weil sie weder
 * im Link noch in der Sitzung mitreisen darf.
 */
export function AnsichtenPanel({ ablage = ablageHolen() }: Props): React.JSX.Element {
  const replaceAll = useStore((s) => s.replaceAll);
  const [liste, setListe] = useState<Ansicht[]>(() => ansichtenLesen(ablage));
  const [name, setName] = useState('');

  const aktualisiere = (neu: Ansicht[]): void => {
    setListe(neu);
    ansichtenSchreiben(ablage, neu);
  };

  const bereinigt = nameBereinigen(name) ?? '';
  const vorhanden = liste.some((a) => a.name === bereinigt);

  const speichern = (): void => {
    if (bereinigt === '') return;
    const ansicht = ansichtErstellen(bereinigt, useStore.getState());
    aktualisiere(vorhanden ? liste.map((a) => (a.name === bereinigt ? ansicht : a)) : [...liste, ansicht]);
    setName('');
  };

  const laden = (ansicht: Ansicht): void => {
    replaceAll(ansichtAnwenden(useStore.getState(), ansicht));
  };

  /** Eine Zeile der Liste; Task 4 ergänzt Umbenennen und Löschen. */
  const zeile = (ansicht: Ansicht): React.JSX.Element => {
    const n = ansicht.name;
    return (
      <button
        type="button"
        aria-label={`${t('views.load')}: ${n}`}
        onClick={() => { laden(ansicht); }}
        className="min-w-0 flex-1 truncate rounded px-1 text-left hover:bg-white/10"
      >
        {n}
      </button>
    );
  };

  return (
    <Panel id="views" title={t('panel.views')}>
      <div className="flex flex-col gap-2">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); speichern(); }}>
          <input
            type="text"
            aria-label={t('views.name')}
            placeholder={t('views.name')}
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => { setName(e.target.value); }}
            className={FELD}
          />
          <button type="submit" className={KNOPF} disabled={bereinigt === ''}>
            {t(vorhanden ? 'views.overwrite' : 'views.save')}
          </button>
        </form>

        {liste.length === 0 ? (
          <p className="m-0 opacity-70">{t('views.empty')}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {liste.map((ansicht) => (
              <li key={ansicht.name} className="flex flex-wrap items-center gap-1">
                {zeile(ansicht)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
