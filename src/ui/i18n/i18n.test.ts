import { describe, it, expect, afterEach } from 'vitest';
import { de } from './de';
import { en } from './en';
import { t, setSprache, sprache, locale, startSprache } from './index';
import { bodies } from '../../data/index';

/**
 * Werte, die auf Englisch bewusst gleich lauten: Eigennamen, Symbole, und
 * 'time.pause' als echtes Lehnwort (Terminologietabelle: Pause → Pause).
 */
const GLEICH_ERLAUBT = new Set<string>([
  'app.title', 'language.de', 'language.en', 'key.arrows', 'time.pause',
  'body.venus.name', 'body.mars.name', 'body.jupiter.name', 'body.saturn.name',
  'body.uranus.name', 'body.phobos.name', 'body.deimos.name', 'body.io.name',
  'body.europa.name', 'body.mimas.name', 'body.enceladus.name', 'body.tethys.name',
  'body.dione.name', 'body.rhea.name', 'body.titan.name', 'body.iapetus.name',
  'body.miranda.name', 'body.ariel.name', 'body.umbriel.name', 'body.titania.name',
  'body.oberon.name', 'body.triton.name', 'body.pluto.name', 'body.charon.name',
  'body.ceres.name', 'body.eris.name', 'body.haumea.name', 'body.makemake.name',
]);

describe('Sprachressourcen', () => {
  afterEach(() => { setSprache('de'); });

  it('hat für jeden Körper einen Namensschlüssel', () => {
    for (const body of bodies) {
      expect(de, `fehlt: ${body.info.nameKey}`).toHaveProperty(body.info.nameKey);
    }
  });

  it('liefert zu bekannten Schlüsseln den Text', () => {
    expect(t('body.earth.name')).toBe('Erde');
  });

  it('meldet unbekannte Schlüssel erkennbar, statt leer zu bleiben', () => {
    expect(t('gibt.es.nicht')).toContain('gibt.es.nicht');
  });

  it('enthält keine leeren Texte', () => {
    for (const [key, wert] of Object.entries(de)) {
      expect(wert.length, `leer (de): ${key}`).toBeGreaterThan(0);
    }
    for (const [key, wert] of Object.entries(en)) {
      expect(wert.length, `leer (en): ${key}`).toBeGreaterThan(0);
    }
  });

  it('Englisch hat exakt die Schlüssel von Deutsch', () => {
    const deKeys = Object.keys(de).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(deKeys);
  });

  it('Englisch ist übersetzt, nicht kopiert (außer Eigennamen)', () => {
    for (const key of Object.keys(de) as (keyof typeof de)[]) {
      if (GLEICH_ERLAUBT.has(key)) continue;
      expect(en[key], `nicht übersetzt: ${key}`).not.toBe(de[key]);
    }
  });

  it('schaltet die Sprache um', () => {
    setSprache('en');
    expect(sprache()).toBe('en');
    expect(t('body.earth.name')).toBe('Earth');
    expect(t('body.moon.name')).toBe('Moon');
    expect(locale()).toBe('en-GB');
    setSprache('de');
    expect(t('body.earth.name')).toBe('Erde');
    expect(locale()).toBe('de-DE');
  });
});

describe('startSprache', () => {
  it('nimmt Englisch für englische Browser', () => {
    expect(startSprache('en-US', null)).toBe('en');
    expect(startSprache('en', null)).toBe('en');
    expect(startSprache('EN-gb', null)).toBe('en');
  });

  it('nimmt sonst Deutsch', () => {
    expect(startSprache('de-DE', null)).toBe('de');
    expect(startSprache('fr', null)).toBe('de');
    expect(startSprache('', null)).toBe('de');
  });

  it('lässt einen geteilten Zustand gewinnen', () => {
    expect(startSprache('en-US', 'de')).toBe('de');
    expect(startSprache('de-DE', 'en')).toBe('en');
  });
});
