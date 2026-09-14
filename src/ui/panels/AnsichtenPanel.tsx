import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import {
  ablageHolen, ansichtAnwenden, ansichtErstellen, ansichtenLesen, ansichtenSchreiben,
  nameBereinigen, NAME_MAX,
} from '../../store/persist';
import type { Ablage, Ansicht } from '../../store/persist';
import { t } from '../i18n';
import { Panel } from './Panel';

/** So lange lässt sich ein Löschen zurücknehmen (Entwurf §5.3). */
const RUECKGAENGIG_MS = 5000;

const KNOPF = 'rounded border border-white/15 px-2 py-1 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent';
const FELD = 'min-w-0 flex-1 rounded border border-white/15 bg-transparent px-2 py-1';
const KLEIN = 'rounded border border-transparent px-1 opacity-70 hover:opacity-100';

interface Props {
  /** Standard ist die echte Ablage; Tests übergeben einen Fake. */
  ablage?: Ablage | null;
}

/** Laufendes Umbenennen einer Zeile; `doppelt` markiert einen abgelehnten Namen. */
interface Umbenennung { alt: string; neu: string; doppelt: boolean }

/**
 * Panel „Ansichten" (Entwurf §5.3): benannte Einstellungen speichern, laden,
 * umbenennen und löschen (fünf Sekunden Rückgängig). Die Liste lebt als
 * React-Zustand hier und wird bei jeder Änderung in die Ablage geschrieben;
 * sie geht nicht durch den Store, weil sie weder im Link noch in der Sitzung
 * mitreisen darf. Ein Löschen schreibt erst beim Ablauf der Frist — bis
 * dahin steht der Eintrag noch in der Ablage.
 */
export function AnsichtenPanel({ ablage = ablageHolen() }: Props): React.JSX.Element {
  const replaceAll = useStore((s) => s.replaceAll);
  const [liste, setListe] = useState<Ansicht[]>(() => ansichtenLesen(ablage));
  const [name, setName] = useState('');
  const [umbenennung, setUmbenennung] = useState<Umbenennung | null>(null);
  /** Namen mit laufender Rückgängig-Frist. */
  const [schwebend, setSchwebend] = useState<ReadonlySet<string>>(() => new Set());
  const fristen = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  // Der Fristablauf sieht die Liste zum Zeitpunkt des Ablaufs, nicht die beim Klick.
  const listeRef = useRef(liste);
  listeRef.current = liste;

  // Laufende Fristen überleben das Panel nicht (etwa beim Ausblenden der
  // Oberfläche mit H); der Eintrag bleibt dann in der Ablage.
  useEffect(() => {
    const laufend = fristen.current;
    return () => {
      for (const id of laufend.values()) clearTimeout(id);
      laufend.clear();
    };
  }, []);

  const aktualisiere = (neu: Ansicht[]): void => {
    setListe(neu);
    ansichtenSchreiben(ablage, neu);
  };

  const bereinigt = nameBereinigen(name) ?? '';
  const vorhanden = liste.some((a) => a.name === bereinigt);

  const fristAbbrechen = (n: string): void => {
    const id = fristen.current.get(n);
    if (id !== undefined) {
      clearTimeout(id);
      fristen.current.delete(n);
    }
    setSchwebend((s) => {
      if (!s.has(n)) return s;
      const kopie = new Set(s);
      kopie.delete(n);
      return kopie;
    });
  };

  const speichern = (): void => {
    if (bereinigt === '') return;
    fristAbbrechen(bereinigt);
    const ansicht = ansichtErstellen(bereinigt, useStore.getState());
    aktualisiere(vorhanden ? liste.map((a) => (a.name === bereinigt ? ansicht : a)) : [...liste, ansicht]);
    setName('');
  };

  const laden = (ansicht: Ansicht): void => {
    replaceAll(ansichtAnwenden(useStore.getState(), ansicht));
  };

  const loeschen = (n: string): void => {
    setSchwebend((s) => new Set(s).add(n));
    fristen.current.set(n, setTimeout(() => {
      fristen.current.delete(n);
      setSchwebend((s) => {
        const kopie = new Set(s);
        kopie.delete(n);
        return kopie;
      });
      aktualisiere(listeRef.current.filter((a) => a.name !== n));
    }, RUECKGAENGIG_MS));
  };

  const umbenennungBestaetigen = (): void => {
    if (umbenennung === null) return;
    const neu = nameBereinigen(umbenennung.neu);
    // Leerer Name: das Feld bleibt offen, bis Escape oder ein gültiger Name kommt.
    if (neu === null) return;
    if (neu === umbenennung.alt) {
      setUmbenennung(null);
      return;
    }
    if (liste.some((a) => a.name === neu)) {
      setUmbenennung({ ...umbenennung, doppelt: true });
      return;
    }
    aktualisiere(liste.map((a) => (a.name === umbenennung.alt ? { ...a, name: neu } : a)));
    setUmbenennung(null);
  };

  /** Eine Zeile: gewöhnlich, im Umbenennen oder mit laufender Rückgängig-Frist. */
  const zeile = (ansicht: Ansicht): React.JSX.Element => {
    const n = ansicht.name;
    if (schwebend.has(n)) {
      return (
        <>
          <span className="min-w-0 flex-1 truncate line-through opacity-60">{n}</span>
          <button
            type="button"
            className={KLEIN}
            aria-label={`${t('views.undo')}: ${n}`}
            onClick={() => { fristAbbrechen(n); }}
          >
            {t('views.undo')}
          </button>
        </>
      );
    }
    if (umbenennung !== null && umbenennung.alt === n) {
      return (
        <>
          <input
            type="text"
            autoFocus
            aria-label={t('views.newName')}
            aria-invalid={umbenennung.doppelt}
            value={umbenennung.neu}
            maxLength={NAME_MAX}
            onChange={(e) => { setUmbenennung({ ...umbenennung, neu: e.target.value, doppelt: false }); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                umbenennungBestaetigen();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setUmbenennung(null);
              }
            }}
            className={`${FELD} ${umbenennung.doppelt ? 'border-red-400' : ''}`}
          />
          {umbenennung.doppelt ? <span className="basis-full text-amber-200">{t('views.nameTaken')}</span> : null}
        </>
      );
    }
    return (
      <>
        <button
          type="button"
          aria-label={`${t('views.load')}: ${n}`}
          onClick={() => { laden(ansicht); }}
          className="min-w-0 flex-1 truncate rounded px-1 text-left hover:bg-white/10"
        >
          {n}
        </button>
        <button
          type="button"
          className={KLEIN}
          aria-label={`${t('views.rename')}: ${n}`}
          onClick={() => { setUmbenennung({ alt: n, neu: n, doppelt: false }); }}
        >
          {t('views.rename')}
        </button>
        <button
          type="button"
          className={KLEIN}
          aria-label={`${t('views.delete')}: ${n}`}
          onClick={() => { loeschen(n); }}
        >
          {t('views.delete')}
        </button>
      </>
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
