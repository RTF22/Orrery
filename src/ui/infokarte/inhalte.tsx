import { useStore } from '../../store';
import { t } from '../i18n';
import { useGrob } from '../fenster';
import { useSteuerKarte } from '../steuerkarte/zustand';
import { usePadVerbunden } from '../steuerung/padVerbunden';
import { laeuftAlsApp } from './geraet';
import { installieren, useInstallation } from './installation';
import { useInfoKarte } from './zustand';
import { VERSION } from './version';

const REPO = 'https://github.com/RTF22/Orrery';
const ASSETS = 'https://github.com/RTF22/Orrery/blob/master/ASSETS.md';

/** Linkstil wie `LINK` in ui/info/Literaturkarten.tsx — gemeinsame Konstante statt zweier gleicher Zeichenketten. */
const LINKSTIL = 'text-sky-300 underline decoration-sky-300/50 underline-offset-2 hover:text-sky-200';

/** Externer Link: immer neuer Tab, sichtbares ↗, Hinweis für Screenreader. */
export function ExternerLink({ href, children }: { href: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINKSTIL}>
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> {t('infokarte.neuerTab')}</span>
    </a>
  );
}

const LISTE = 'm-0 flex list-none flex-col gap-1.5 p-0';

/** Reiter „App“: Einrichtung als App (Entwurf Info-Karte §4.1). */
export function ReiterApp(): React.JSX.Element {
  const ereignis = useInstallation((s) => s.ereignis);
  if (laeuftAlsApp()) return <p>{t('infokarte.app.laeuft')}</p>;
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0">{t('infokarte.app.einleitung')}</p>
      <ul className={LISTE}>
        <li>{t('infokarte.app.android')}</li>
        <li>{t('infokarte.app.ios')}</li>
        <li>{t('infokarte.app.desktop')}</li>
      </ul>
      {ereignis !== null ? (
        <button
          type="button"
          onClick={() => { void installieren(); }}
          className="self-start rounded border border-sky-300/60 bg-sky-400/20 px-3 py-1.5 font-semibold"
        >
          {t('infokarte.app.installieren')}
        </button>
      ) : null}
    </div>
  );
}

/** Tasten des Desktop-Blocks; Beschreibungen aus der vorhandenen Tastenübersicht. */
const TASTEN: readonly (readonly [string | { key: string }, string])[] = [
  [{ key: 'infokarte.bedienung.tastenLeer' }, 'shortcuts.pause'],
  ['← →', 'shortcuts.rate'],
  ['C', 'shortcuts.cinema'],
  ['I', 'shortcuts.info'],
  ['H', 'shortcuts.toggleUi'],
  ['F', 'shortcuts.fullscreen'],
  ['L', 'shortcuts.language'],
];

/** Reiter „Bedienung“: nur der Block, der zum Eingabegerät passt (Entwurf §4.2). */
export function ReiterBedienung(): React.JSX.Element {
  const grob = useGrob();
  const schliessen = useInfoKarte((s) => s.schliessen);
  const padVerbunden = usePadVerbunden();

  if (grob) {
    const controllerKarte = (): void => {
      schliessen();
      useSteuerKarte.getState().oeffnen('controller');
    };
    return (
      <div className="flex flex-col gap-2">
        <p className="m-0">{t('infokarte.bedienung.einleitung')}</p>
        <ul className={LISTE}>
          <li>{t('infokarte.bedienung.touchDrehen')}</li>
          <li>{t('infokarte.bedienung.touchZoom')}</li>
          <li>{t('infokarte.bedienung.touchTippen')}</li>
          <li>{t('infokarte.bedienung.touchBoegen')}</li>
        </ul>
        {padVerbunden ? (
          <button type="button" onClick={controllerKarte} className={`self-start ${LINKSTIL}`}>
            {t('infokarte.bedienung.controllerKarte')}
          </button>
        ) : null}
      </div>
    );
  }

  const alleKuerzel = (): void => {
    schliessen();
    useSteuerKarte.getState().oeffnen();
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="m-0">{t('infokarte.bedienung.einleitung')}</p>
      <ul className={LISTE}>
        <li>{t('infokarte.bedienung.mausDrehen')}</li>
        <li>{t('infokarte.bedienung.mausZoom')}</li>
        <li>{t('infokarte.bedienung.mausKlick')}</li>
      </ul>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
        {TASTEN.map(([taste, schluessel]) => (
          <div key={schluessel} className="contents">
            <dt className="font-mono text-xs opacity-80">{typeof taste === 'string' ? taste : t(taste.key)}</dt>
            <dd className="m-0">{t(schluessel)}</dd>
          </div>
        ))}
      </dl>
      <button type="button" onClick={alleKuerzel} className={`self-start ${LINKSTIL}`}>
        {t('infokarte.bedienung.alleKuerzel')}
      </button>
    </div>
  );
}

/** Reiter „Über“: Projekt, Quellcode, Lizenz, Version (Entwurf §4.3). */
export function ReiterUeber(): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  // ui.language ist als Typ auf 'de' | 'en' beschränkt (store/types.ts); die
  // Making-of-Seiten gibt es nur in diesen beiden Sprachen, der Vergleich auf
  // 'de' hält den Fall trotzdem fest, falls der Typ einmal wächst.
  const sprache = language === 'de' ? 'de' : 'en';
  const entstehung = `${import.meta.env.BASE_URL}doku/making-of/${sprache}/`;
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0">{t('infokarte.ueber.text')}</p>
      <p className="m-0"><ExternerLink href={REPO}>{t('infokarte.ueber.quellcode')}</ExternerLink></p>
      <p className="m-0"><ExternerLink href={entstehung}>{t('infokarte.ueber.entstehung')}</ExternerLink></p>
      <p className="m-0">{t('infokarte.ueber.recht')}</p>
      <p className="m-0">
        {t('infokarte.ueber.drittrechte')}{' '}
        <ExternerLink href={ASSETS}>{t('infokarte.ueber.assets')}</ExternerLink>
      </p>
      <p className="m-0">{t('infokarte.ueber.nichtkommerziell')}</p>
      <p className="m-0 text-xs opacity-70">{t('infokarte.ueber.version')} {VERSION}</p>
    </div>
  );
}
