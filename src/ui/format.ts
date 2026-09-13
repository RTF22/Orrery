import { jdToDate, dateToJd } from '../sim/time';
import { t, locale } from './i18n';

/** Ein Formatierer je Locale, beim ersten Gebrauch gebaut. */
const datumsformate = new Map<string, Intl.DateTimeFormat>();

function datumsformat(): Intl.DateTimeFormat {
  const l = locale();
  let f = datumsformate.get(l);
  if (f === undefined) {
    f = new Intl.DateTimeFormat(l, {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    });
    datumsformate.set(l, f);
  }
  return f;
}

export const formatJd = (jd: number): string => datumsformat().format(jdToDate(jd));

/** Zahl in der Locale der aktuellen Sprache, gerundet auf maxStellen. */
export const formatZahl = (n: number, maxStellen = 2): string =>
  n.toLocaleString(locale(), { maximumFractionDigits: maxStellen });

/**
 * Wählt die Einheit nach Größenordnung, damit die Anzeige über den ganzen
 * Bereich von einer Sekunde bis zu tausend Jahren je Sekunde lesbar bleibt.
 * Das Minuszeichen ist ein echtes „−", kein Bindestrich.
 */
export function formatRate(tageProSekunde: number): string {
  if (tageProSekunde === 0) return t('time.rate.paused');
  const vorzeichen = tageProSekunde < 0 ? '−' : '';
  const betrag = Math.abs(tageProSekunde);

  /** „1 Tag/s", aber „2,5 Tage/s" — der Numerus richtet sich nach der Anzeige. */
  const mitEinheit = (wert: number, stamm: string): string => {
    const text = formatZahl(wert);
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
