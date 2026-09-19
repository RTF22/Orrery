/** Julianisches Datum der Epoche J2000.0 (2000-01-01 12:00 UTC). */
export const J2000 = 2451545.0;

/**
 * Zeitbereich, in dem Orrery rechnet: vom Julianischen Tag 0 (4713 v. Chr.)
 * bis zum 31. Dezember 9999, 0 Uhr UTC. Die linear fortgeschriebenen
 * Bahnelemente bleiben darin rechenbar (Exzentrizität e in [0, 1)) — jenseits
 * davon würde etwa Saturns Exzentrizität im Jahr 12 563 negativ, und der
 * Kepler-Löser wiese sie zurück. Store und Bildschleife klemmen auf diesen
 * Bereich, das Kino ebenso; der Prüfer verwirft Werte außerhalb.
 */
export const JD_MIN = 0;
export const JD_MAX = 5373483.5;

/** Klemmt einen Julianischen Tag auf den Zeitbereich [JD_MIN, JD_MAX]. */
export function imZeitbereich(jd: number): number {
  return Math.min(Math.max(jd, JD_MIN), JD_MAX);
}

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
