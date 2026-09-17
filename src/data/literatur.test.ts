import { describe, it, expect } from 'vitest';
import {
  LITERATUR, adsAdresse, autorenzeile, erstautorNachname, hauptadresse, istPreprint, jahrMitSuffix, publikationFinden,
} from './literatur';
import type { Publikation } from './literatur';

const DOI = /^10\.\d{4,9}\/\S+$/;
const ARXIV = /^(\d{4}\.\d{4,5}(v\d+)?|[a-z-]+(\.[A-Z]{2})?\/\d{7})$/;
const KENNUNG = /^[a-z][a-z0-9-]*-(\d{4})[a-z]?$/;

/** Erfundene Testdaten, nicht im Katalog. */
const VOLL: Publikation = {
  id: 'muster-2020a', autoren: ['Muster, A.', 'de Beispiel, B.'], etAl: true, jahr: 2020,
  titel: 'Erfundene Arbeit', erschienen: 'Testzeitschrift 1, 1',
  doi: '10.0000/test.1', arxiv: '2001.00001', bibcode: '2020A&A...1....1M',
};
const PREPRINT: Publikation = {
  id: 'beispiel-2021', autoren: ['Beispiel, B.'], etAl: false, jahr: 2021,
  titel: 'Nur als Preprint', erschienen: 'arXiv', arxiv: '2101.00002',
};
const BERICHT: Publikation = {
  id: 'amt-2019', autoren: ['Amt, A.'], etAl: false, jahr: 2019,
  titel: 'Bericht', erschienen: 'Technischer Bericht', url: 'https://example.org/bericht',
};

describe('Literaturkatalog (Entwurf 4d §4.4)', () => {
  it('hat eindeutige Kennungen im Muster Erstautor-Jahr mit passendem Jahr', () => {
    const ids = LITERATUR.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const diesesJahr = new Date().getFullYear();
    for (const p of LITERATUR) {
      const treffer = KENNUNG.exec(p.id);
      expect(treffer, p.id).not.toBeNull();
      expect(Number(treffer?.[1]), p.id).toBe(p.jahr);
      expect(p.jahr, p.id).toBeGreaterThanOrEqual(1600);
      expect(p.jahr, p.id).toBeLessThanOrEqual(diesesJahr);
    }
  });

  it('hat vollständige Angaben in gültigen Formaten', () => {
    for (const p of LITERATUR) {
      expect(p.autoren.length, p.id).toBeGreaterThanOrEqual(1);
      expect(p.autoren.length, p.id).toBeLessThanOrEqual(3);
      for (const autor of p.autoren) expect(autor, p.id).toMatch(/^\S.*, \S/);
      expect(p.titel.trim().length, p.id).toBeGreaterThan(0);
      expect(p.erschienen.trim().length, p.id).toBeGreaterThan(0);
      expect(p.doi !== undefined || p.arxiv !== undefined || p.url !== undefined, `${p.id}: DOI, arXiv oder URL`).toBe(true);
      if (p.doi !== undefined) expect(p.doi, p.id).toMatch(DOI);
      if (p.arxiv !== undefined) expect(p.arxiv, p.id).toMatch(ARXIV);
      if (p.bibcode !== undefined) {
        expect(p.bibcode, p.id).toHaveLength(19);
        expect(p.bibcode.slice(0, 4), p.id).toBe(String(p.jahr));
      }
      if (p.url !== undefined) expect(p.url, p.id).toMatch(/^https:\/\//);
    }
  });
});

describe('Hilfsfunktionen des Literaturkatalogs', () => {
  it('bildet die Hauptadresse aus DOI, sonst arXiv, sonst URL', () => {
    expect(hauptadresse(VOLL)).toBe('https://doi.org/10.0000/test.1');
    expect(hauptadresse(PREPRINT)).toBe('https://arxiv.org/abs/2101.00002');
    expect(hauptadresse(BERICHT)).toBe('https://example.org/bericht');
  });

  it('erkennt Preprints, Erstautor, Jahr mit Suffix und bildet die Autorenzeile', () => {
    expect(istPreprint(PREPRINT)).toBe(true);
    expect(istPreprint(VOLL)).toBe(false);
    expect(istPreprint(BERICHT)).toBe(false);
    expect(erstautorNachname(VOLL)).toBe('Muster');
    expect(erstautorNachname({ ...VOLL, autoren: ['de Pater, I.'] })).toBe('de Pater');
    expect(jahrMitSuffix(VOLL)).toBe('2020a');
    expect(jahrMitSuffix(PREPRINT)).toBe('2021');
    expect(autorenzeile(VOLL)).toBe('Muster, A., de Beispiel, B. et al.');
    expect(autorenzeile(PREPRINT)).toBe('Beispiel, B.');
  });

  it('kodiert Bibcodes in der ADS-Adresse und findet keine unbekannten Einträge', () => {
    expect(adsAdresse('2020A&A...1....1M')).toBe('https://ui.adsabs.harvard.edu/abs/2020A%26A...1....1M/abstract');
    expect(publikationFinden('gibt-es-nicht-2000')).toBeUndefined();
  });
});
