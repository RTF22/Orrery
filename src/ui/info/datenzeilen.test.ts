import { describe, it, expect, afterEach } from 'vitest';
import { datenzeilen } from './datenzeilen';
import { bodyIndex } from '../../data';
import { J2000 } from '../../sim/time';
import { setSprache } from '../i18n';

/** Erste Zahl einer deutschen Ausgabe ('149,6 Mio. km (1 AE)' → 149.6). */
const zahl = (wert: string): number =>
  Number(/-?\d+(?:,\d+)?/.exec(wert.replace(/\./g, ''))?.[0].replace(',', '.'));
const aeWert = (wert: string): number => Number(/\(([\d,]+) AE\)/.exec(wert)?.[1]?.replace(',', '.'));
const zeile = (liste: ReturnType<typeof datenzeilen>, schluessel: string) =>
  liste.find((z) => z.schluessel === schluessel);

afterEach(() => { setSprache('de'); });

describe('datenzeilen', () => {
  it('Grundschule: Durchmesser, Umlaufzeit und Sonnenabstand der Erde', () => {
    const liste = datenzeilen(bodyIndex.earth!, 'grundschule', J2000, bodyIndex);
    expect(liste.map((z) => z.schluessel)).toEqual([
      'info.daten.durchmesser', 'info.daten.umlaufzeit', 'info.daten.abstandSonne',
    ]);
    expect(zeile(liste, 'info.daten.durchmesser')?.wert).toBe('12.742 km');
    expect(Math.abs(zahl(zeile(liste, 'info.daten.umlaufzeit')!.wert) - 365.2)).toBeLessThan(0.3);
    const ae = aeWert(zeile(liste, 'info.daten.abstandSonne')!.wert);
    // J2000 liegt nahe am Perihel der Erde (0,9833 AE, auf zwei Nachkommastellen
    // gerundet „0,98 AE") — die untere Schranke ist deshalb inklusive.
    expect(ae).toBeGreaterThanOrEqual(0.98);
    expect(ae).toBeLessThan(1.02);
    expect(zeile(liste, 'info.daten.abstandSonne')?.live).toBe(true);
  });

  it('Gymnasium: ergänzt Masse, Rotation, Achsneigung, Exzentrizität, Erdabstand und Geschwindigkeit', () => {
    const liste = datenzeilen(bodyIndex.mars!, 'gymnasium', J2000, bodyIndex);
    const schluessel = liste.map((z) => z.schluessel);
    expect(schluessel).toContain('info.daten.masse');
    expect(schluessel).toContain('info.daten.tageslaenge');
    expect(schluessel).toContain('info.daten.achsneigung');
    expect(schluessel).toContain('info.daten.exzentrizitaet');
    expect(schluessel).toContain('info.daten.abstandErde');
    expect(schluessel).toContain('info.daten.geschwindigkeit');
    expect(schluessel).not.toContain('info.daten.a');
    const v = zahl(zeile(liste, 'info.daten.geschwindigkeit')!.wert);
    expect(v).toBeGreaterThan(21);
    expect(v).toBeLessThan(27);
    // Die Erde selbst bekommt keinen Erdabstand.
    expect(zeile(datenzeilen(bodyIndex.earth!, 'gymnasium', J2000, bodyIndex), 'info.daten.abstandErde')).toBeUndefined();
    const erde = datenzeilen(bodyIndex.earth!, 'gymnasium', J2000, bodyIndex);
    const ve = zahl(zeile(erde, 'info.daten.geschwindigkeit')!.wert);
    // Erdbahngeschwindigkeit zur Epoche J2000 rundet auf eine Nachkommastelle
    // exakt zu „30,3 km/s" — die obere Schranke ist deshalb inklusive.
    expect(ve).toBeGreaterThan(29.3);
    expect(ve).toBeLessThanOrEqual(30.3);
    expect(zeile(erde, 'info.daten.achsneigung')?.wert).toBe('23,4°');
  });

  it('Monde: Umlauf um den Mutterkörper mit Hinweis, Geschwindigkeit relativ zum Mutterkörper', () => {
    const liste = datenzeilen(bodyIndex.moon!, 'gymnasium', J2000, bodyIndex);
    const umlauf = zeile(liste, 'info.daten.umlaufzeit')!;
    expect(Math.abs(zahl(umlauf.wert) - 27.3)).toBeLessThan(0.2);
    expect(umlauf.hinweis).toBe('um Erde');
    const v = zahl(zeile(liste, 'info.daten.geschwindigkeit')!.wert);
    expect(v).toBeGreaterThan(0.9);
    expect(v).toBeLessThan(1.1);
  });

  it('Hochschule: Bahnelemente, Bezugsebene, Pol und Albedo; retrograde Rotation als Hinweis', () => {
    const liste = datenzeilen(bodyIndex.venus!, 'hochschule', J2000, bodyIndex);
    const schluessel = liste.map((z) => z.schluessel);
    for (const s of ['info.daten.a', 'info.daten.i', 'info.daten.knoten', 'info.daten.perihel', 'info.daten.laenge',
      'info.daten.bezugsebene', 'info.daten.pol', 'info.daten.albedo']) {
      expect(schluessel).toContain(s);
    }
    expect(zeile(liste, 'info.daten.tageslaenge')?.hinweis).toBe('retrograd');
    expect(zeile(liste, 'info.daten.bezugsebene')?.wert).toBe('Ekliptik J2000');
    expect(zeile(liste, 'info.daten.a')?.hinweis).toContain('je Jahrhundert');
  });

  it('Sonne: keine Bahnzeilen, kein Erdabstand', () => {
    const liste = datenzeilen(bodyIndex.sun!, 'hochschule', J2000, bodyIndex);
    const schluessel = liste.map((z) => z.schluessel);
    expect(schluessel).toEqual(['info.daten.durchmesser', 'info.daten.masse', 'info.daten.tageslaenge',
      'info.daten.achsneigung', 'info.daten.pol']);
  });

  it('formatiert in der Sprache der Oberfläche', () => {
    setSprache('en');
    const liste = datenzeilen(bodyIndex.moon!, 'gymnasium', J2000, bodyIndex);
    expect(zeile(liste, 'info.daten.umlaufzeit')?.hinweis).toBe('around Earth');
    expect(zeile(liste, 'info.daten.durchmesser')?.wert).toBe('3,475 km');
  });
});
