/** Julianisches Datum der Epoche J2000.0 (2000-01-01 12:00 UTC). */
export const J2000 = 2451545.0;

/** Millisekunden pro Tag. */
const MS_PRO_TAG = 86_400_000;

/**
 * Julianisches Datum des Unix-Epochenbeginns (1970-01-01 00:00 UTC).
 * Damit ist die Umrechnung eine reine Verschiebung — die gregorianische
 * Schaltjahresregel steckt bereits in Date.UTC.
 */
const JD_UNIX_EPOCHE = 2440587.5;

export function dateToJd(date: Date): number {
  return date.getTime() / MS_PRO_TAG + JD_UNIX_EPOCHE;
}

export function jdToDate(jd: number): Date {
  return new Date(Math.round((jd - JD_UNIX_EPOCHE) * MS_PRO_TAG));
}

/** Julianische Jahrhunderte seit J2000.0 — das Argument aller Bahnelement-Raten. */
export function centuriesSinceJ2000(jd: number): number {
  return (jd - J2000) / 36525;
}
