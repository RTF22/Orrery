import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import {
  ablageHolen, ansichtAnwenden, ansichtErstellen, ansichtenExportieren, ansichtenImportieren,
  ansichtenLesen, ansichtenSchreiben, nameBereinigen, EXPORT_DATEINAME, NAME_MAX,
} from '../../store/persist';
import type { Ablage, Ansicht } from '../../store/persist';
import { flugWiederherstellungMelden } from '../../render/camera/controller';
import type { Key } from '../i18n';
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

/** Meldung unter den Knöpfen; Schlüssel statt Text, damit ein Sprachwechsel sie mitnimmt. */
interface Meldung { schluessel: Key; anzahl: number }

/**
 * Panel „Ansichten" (Entwurf §5.3): benannte Einstellungen speichern, laden,
 * umbenennen und löschen (fünf Sekunden Rückgängig), als JSON-Datei exportieren
 * und importieren. Die Liste lebt als React-Zustand hier und wird bei jeder
 * Änderung in die Ablage geschrieben; sie geht nicht durch den Store, weil sie
 * weder im Link noch in der Sitzung mitreisen darf. Ein Löschen schreibt erst
 * beim Ablauf der Frist — bis dahin steht der Eintrag noch in der Ablage.
 */
export function AnsichtenPanel({ ablage = ablageHolen() }: Props): React.JSX.Element {
  const replaceAll = useStore((s) => s.replaceAll);
  const [liste, setListe] = useState<Ansicht[]>(() => ansichtenLesen(ablage));
  const [name, setName] = useState('');
  const [umbenennung, setUmbenennung] = useState<Umbenennung | null>(null);
  /** Namen mit laufender Rückgängig-Frist. */
  const [schwebend, setSchwebend] = useState<ReadonlySet<string>>(() => new Set());
  const fristen = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  // Der Fristablauf sieht die Liste zum Zeitpunkt des Ablaufs, nicht die beim
  // Klick — nur Rückrufe, die nach dem Render laufen (Fristablauf, await im
  // Import), lesen diesen Ref; synchrone Handler lesen liste direkt.
  const listeRef = useRef(liste);
  listeRef.current = liste;

  const [meldung, setMeldung] = useState<Meldung | null>(null);
  const dateiFeld = useRef<HTMLInputElement | null>(null);

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
    setMeldung(null);
    const ansicht = ansichtErstellen(bereinigt, useStore.getState());
    aktualisiere(vorhanden ? liste.map((a) => (a.name === bereinigt ? ansicht : a)) : [...liste, ansicht]);
    setName('');
    setUmbenennung(null);
  };

  const laden = (ansicht: Ansicht): void => {
    setMeldung(null);
    replaceAll(ansichtAnwenden(useStore.getState(), ansicht));
    // Im laufenden Flug gleitet die Kamera sonst mit 0,15 s über den ganzen Weg.
    flugWiederherstellungMelden();
  };

  const loeschen = (n: string): void => {
    setMeldung(null);
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
    setMeldung(null);
    aktualisiere(liste.map((a) => (a.name === umbenennung.alt ? { ...a, name: neu } : a)));
    setUmbenennung(null);
  };

  // Schwebend gelöschte Einträge stehen zwar noch in der Ablage (die Frist
  // läuft), gehören aber nicht mehr zur Liste — ein Export in diesem Moment
  // soll sie nicht enthalten.
  const exportierbar = liste.filter((a) => !schwebend.has(a.name));

  const exportieren = (): void => {
    setMeldung(null);
    const url = URL.createObjectURL(new Blob([ansichtenExportieren(exportierbar)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = EXPORT_DATEINAME;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importieren = async (datei: File): Promise<void> => {
    let text: string;
    try {
      text = await datei.text();
    } catch {
      // Datei nach der Wahl nicht mehr lesbar: wie eine fremde Datei behandeln.
      setMeldung({ schluessel: 'views.importInvalid', anzahl: 0 });
      return;
    }
    const ergebnis = ansichtenImportieren(text, listeRef.current);
    if (ergebnis.fehler !== null) {
      setMeldung({
        schluessel: ergebnis.fehler === 'umschlag' ? 'views.importInvalid' : 'views.importEmpty',
        anzahl: 0,
      });
      return;
    }
    aktualisiere(ergebnis.liste);
    setMeldung(ergebnis.verworfen > 0 ? { schluessel: 'views.importSkipped', anzahl: ergebnis.verworfen } : null);
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

        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-2">
          <button type="button" className={KNOPF} onClick={exportieren} disabled={exportierbar.length === 0}>
            {t('views.export')}
          </button>
          <button type="button" className={KNOPF} onClick={() => { dateiFeld.current?.click(); }}>
            {t('views.import')}
          </button>
          <input
            ref={dateiFeld}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const datei = e.target.files?.[0];
              // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann.
              e.target.value = '';
              if (datei !== undefined) void importieren(datei);
            }}
          />
        </div>
        {/* Immer im Baum, damit die Live-Region beim ersten Text schon existiert. */}
        <p role="status" className="m-0 text-amber-200">
          {meldung === null ? '' : t(meldung.schluessel).replace('{n}', String(meldung.anzahl))}
        </p>
      </div>
    </Panel>
  );
}
