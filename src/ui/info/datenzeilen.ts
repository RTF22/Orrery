import type { Body, BodyIndex, Vec3 } from '../../sim/types';
import type { Niveau } from '../../data/themen';
import { achsneigungDeg, elementsAt, positionAt, umlaufzeitTage, velocityAt } from '../../sim/orbit';
import { t } from '../i18n';
import { formatAbstand, formatMasse, formatZahl } from '../format';

/** Eine Zeile des Datenblocks; `live` markiert Werte, die mit der Uhr laufen. */
export interface Datenzeile { schluessel: string; wert: string; hinweis?: string; live?: boolean }

const betrag = (v: Vec3): number => Math.hypot(v.x, v.y, v.z);
const abstand = (a: Vec3, b: Vec3): number => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const NULLVEKTOR: Vec3 = { x: 0, y: 0, z: 0 };

/**
 * Gestufter Datenblock (Entwurf 4c §5.1): Grundschule zeigt drei Zeilen,
 * Gymnasium ergänzt sechs, Hochschule die Bahnelemente zur Epoche, Pol,
 * Albedo und Bezugsebene. Alles kommt aus dem Datensatz oder der
 * Simulation; nichts steht doppelt in einem Text.
 */
export function datenzeilen(body: Body, niveau: Niveau, jd: number, index: BodyIndex): Datenzeile[] {
  const zeilen: Datenzeile[] = [];
  const mutter = body.parent === null ? null : index[body.parent] ?? null;
  const umMutter = mutter !== null && mutter.id !== 'sun';

  zeilen.push({ schluessel: 'info.daten.durchmesser', wert: `${formatZahl(2 * body.physical.radiusKm, 0)} km` });

  const umlauf = umlaufzeitTage(body, index);
  if (umlauf !== null) {
    const wert = umlauf < 1000
      ? `${formatZahl(umlauf, 1)} ${t('unit.days')}`
      : `${formatZahl(umlauf / 365.25, 1)} ${t('unit.years')}`;
    zeilen.push(umMutter
      ? { schluessel: 'info.daten.umlaufzeit', wert, hinweis: t('info.umlaufUm').replace('{name}', t(mutter.info.nameKey)) }
      : { schluessel: 'info.daten.umlaufzeit', wert });
  }
  if (body.orbit !== null) {
    zeilen.push({ schluessel: 'info.daten.abstandSonne', wert: formatAbstand(betrag(positionAt(body.id, index, jd))), live: true });
  }
  if (niveau === 'grundschule') return zeilen;

  zeilen.push({ schluessel: 'info.daten.masse', wert: formatMasse(body.physical.massKg) });
  const stunden = Math.abs(body.physical.rotationPeriodH);
  const rotation: Datenzeile = {
    schluessel: 'info.daten.tageslaenge',
    wert: stunden < 48 ? `${formatZahl(stunden, 1)} ${t('unit.hours')}` : `${formatZahl(stunden / 24, 1)} ${t('unit.days')}`,
  };
  if (body.physical.rotationPeriodH < 0) rotation.hinweis = t('info.daten.retrograd');
  zeilen.push(rotation);
  zeilen.push({ schluessel: 'info.daten.achsneigung', wert: `${formatZahl(achsneigungDeg(body, index), 1)}°` });

  if (body.orbit !== null) {
    zeilen.push({ schluessel: 'info.daten.exzentrizitaet', wert: formatZahl(elementsAt(body.orbit, jd).e, 3) });
    if (body.id !== 'earth' && Object.hasOwn(index, 'earth')) {
      const hier = positionAt(body.id, index, jd);
      const erde = positionAt('earth', index, jd);
      zeilen.push({ schluessel: 'info.daten.abstandErde', wert: formatAbstand(abstand(hier, erde)), live: true });
    }
    const v = velocityAt(body.id, index, jd);
    const vMutter = umMutter ? velocityAt(mutter.id, index, jd) : NULLVEKTOR;
    zeilen.push({ schluessel: 'info.daten.geschwindigkeit', wert: `${formatZahl(abstand(v, vMutter), 1)} km/s`, live: true });
  }
  if (niveau === 'gymnasium') return zeilen;

  if (body.orbit !== null) {
    const o = body.orbit;
    const jh = t('info.daten.proJh');
    zeilen.push({ schluessel: 'info.daten.a', wert: `${formatZahl(o.a, 5)} ${t('unit.au')}`, hinweis: `${formatZahl(o.aDot, 6)} ${jh}` });
    zeilen.push({ schluessel: 'info.daten.i', wert: `${formatZahl(o.i, 3)}°`, hinweis: `${formatZahl(o.iDot, 4)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.knoten', wert: `${formatZahl(o.node, 3)}°`, hinweis: `${formatZahl(o.nodeDot, 4)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.perihel', wert: `${formatZahl(o.lp, 3)}°`, hinweis: `${formatZahl(o.lpDot, 4)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.laenge', wert: `${formatZahl(o.L, 3)}°`, hinweis: `${formatZahl(o.LDot, 2)}° ${jh}` });
    zeilen.push({ schluessel: 'info.daten.bezugsebene', wert: t(`info.ebene.${o.frame}`) });
  }
  zeilen.push({
    schluessel: 'info.daten.pol',
    wert: `${formatZahl(body.physical.pole.raDeg, 2)}°, ${formatZahl(body.physical.pole.decDeg, 2)}°`,
  });
  if (body.physical.albedo !== undefined) {
    zeilen.push({ schluessel: 'info.daten.albedo', wert: formatZahl(body.physical.albedo, 3) });
  }
  return zeilen;
}
