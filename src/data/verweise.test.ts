import { describe, it, expect } from 'vitest';
import { verweisAufloesen, textKennungGueltig } from './verweise';

describe('verweisAufloesen', () => {
  it('löst die vier internen Schemata gegen die Kataloge auf', () => {
    expect(verweisAufloesen('objekt:earth')).toEqual({ art: 'objekt', kennung: 'earth' });
    expect(verweisAufloesen('szene:mondfinsternis')).toEqual({ art: 'szene', kennung: 'mondfinsternis' });
    expect(verweisAufloesen('thema:modell')).toEqual({ art: 'thema', kennung: 'modell' });
    const quelle = verweisAufloesen('quelle:nssdc-earth');
    expect(quelle?.art).toBe('quelle');
    if (quelle?.art === 'quelle') expect(quelle.quelle.id).toBe('nssdc-earth');
  });

  it('nimmt https-Adressen als extern, sonst nichts', () => {
    expect(verweisAufloesen('https://example.org/a(b)')).toEqual({ art: 'extern', url: 'https://example.org/a(b)' });
    expect(verweisAufloesen('http://example.org')).toBeNull();
    expect(verweisAufloesen('javascript:alert(1)')).toBeNull();
    expect(verweisAufloesen('mailto:x@y.z')).toBeNull();
  });

  it('liefert null für unbekannte Kennungen und Schemata', () => {
    expect(verweisAufloesen('objekt:vulcan')).toBeNull();
    expect(verweisAufloesen('szene:nope')).toBeNull();
    expect(verweisAufloesen('thema:nope')).toBeNull();
    expect(verweisAufloesen('quelle:nope')).toBeNull();
    expect(verweisAufloesen('planet:earth')).toBeNull();
    expect(verweisAufloesen('objekt:')).toBeNull();
    expect(verweisAufloesen('')).toBeNull();
  });

  it('textKennungGueltig prüft Art und Kennung einer Textdatei', () => {
    expect(textKennungGueltig('objekt', 'saturn')).toBe(true);
    expect(textKennungGueltig('szene', 'erdaufgang')).toBe(true);
    expect(textKennungGueltig('thema', 'ringe')).toBe(true);
    expect(textKennungGueltig('quelle', 'nssdc-earth')).toBe(false);
    expect(textKennungGueltig('objekt', 'nope')).toBe(false);
  });
});
