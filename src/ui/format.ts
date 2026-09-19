import { jdToDate, dateToJd } from '../sim/time';
import { AU_KM } from '../sim/orbit';
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

/**
 * JD → „2026-09-11" für `<input type="date">`. Leer bei nicht endlichen Daten
 * und bei Jahren (UTC) außerhalb 1 bis 9999 — `<input type="date">` kann
 * Jahre vor 1 grundsätzlich nicht darstellen, `toISOString` liefert für
 * Jahre über 9999 ein erweitertes Format, das das Feld ebenfalls ablehnt.
 */
export function jdZuDatumsfeld(jd: number): string {
  const d = jdToDate(jd);
  if (!Number.isFinite(d.getTime())) return '';
  const jahr = d.getUTCFullYear();
  if (jahr < 1 || jahr > 9999) return '';
  return d.toISOString().slice(0, 10);
}

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

/**
 * Abstand nach Größenordnung (Entwurf 4c §5.2): unter 1 Mio. km in km, sonst
 * in Mio. km, ab 0,1 AE zusätzlich in AE. Zwei Nachkommastellen unter
 * 10 Mio. km, danach eine.
 */
export function formatAbstand(km: number): string {
  if (km < 1e6) return `${formatZahl(km, 0)} km`;
  const mio = `${formatZahl(km / 1e6, km < 1e7 ? 2 : 1)} ${t('unit.millionKm')}`;
  if (km < 0.1 * AU_KM) return mio;
  return `${mio} (${formatZahl(km / AU_KM, 2)} ${t('unit.au')})`;
}

const HOCHGESTELLT = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** Masse als Mantisse mit zwei Nachkommastellen und hochgestelltem Zehnerexponenten. */
export function formatMasse(kg: number): string {
  let exponent = Math.floor(Math.log10(kg));
  let mantisse = kg / 10 ** exponent;
  // Rundet die Mantisse auf zwei Nachkommastellen auf 10 (z. B. 9,995 → 10,00):
  // ohne diese Prüfung entstünde „10 · 10ⁿ" statt „1 · 10ⁿ⁺¹" — der Exponent
  // muss dieselbe Rundung mitgehen wie die angezeigte Mantisse.
  if (Math.round(mantisse * 100) / 100 >= 10) {
    exponent += 1;
    mantisse /= 10;
  }
  const hoch = String(exponent).split('').map((z) => (z === '-' ? '⁻' : HOCHGESTELLT[Number(z)] ?? z)).join('');
  return `${formatZahl(mantisse, 2)} · 10${hoch} kg`;
}
