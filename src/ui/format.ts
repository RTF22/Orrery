import { jdToDate, dateToJd } from '../sim/time';
import { t } from './i18n';

const FORMAT = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
});

export const formatJd = (jd: number): string => FORMAT.format(jdToDate(jd));

/**
 * Wählt die Einheit nach Größenordnung, damit die Anzeige über den ganzen
 * Bereich von einer Sekunde bis zu tausend Jahren je Sekunde lesbar bleibt.
 * Das Minuszeichen ist ein echtes „−", kein Bindestrich.
 */
export function formatRate(tageProSekunde: number): string {
  if (tageProSekunde === 0) return t('time.rate.paused');
  const vorzeichen = tageProSekunde < 0 ? '−' : '';
  const betrag = Math.abs(tageProSekunde);
  const zahl = (n: number): string => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });

  /** „1 Tag/s", aber „2,5 Tage/s" — der Numerus richtet sich nach der Anzeige. */
  const mitEinheit = (wert: number, stamm: string): string => {
    const text = zahl(wert);
    return `${vorzeichen}${text} ${t(`${stamm}${text === '1' ? '' : 's'}`)}`;
  };

  if (betrag < 1 / 3600) return mitEinheit(betrag * 86400, 'time.rate.second');
  if (betrag < 1) return mitEinheit(betrag * 24, 'time.rate.hour');
  if (betrag < 365.25) return mitEinheit(betrag, 'time.rate.day');
  return mitEinheit(betrag / 365.25, 'time.rate.year');
}

const JD_1800 = dateToJd(new Date(Date.UTC(1800, 0, 1)));
const JD_2050 = dateToJd(new Date(Date.UTC(2050, 0, 1)));

/** Außerhalb dieses Fensters sind die Bahnelemente nicht mehr belastbar. */
export const isOutOfRange = (jd: number): boolean => jd < JD_1800 || jd > JD_2050;
