import { t } from '../i18n';

/** Reiter „App“: Einrichtung als App (Entwurf Info-Karte §4.1). */
export function ReiterApp(): React.JSX.Element {
  return <p>{t('infokarte.app.einleitung')}</p>;
}

/** Reiter „Bedienung“: passend zum Eingabegerät (Entwurf §4.2). */
export function ReiterBedienung(): React.JSX.Element {
  return <p>{t('infokarte.bedienung.einleitung')}</p>;
}

/** Reiter „Über“: Projekt, Quellcode, Lizenz (Entwurf §4.3). */
export function ReiterUeber(): React.JSX.Element {
  return <p>{t('infokarte.ueber.text')}</p>;
}
