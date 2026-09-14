import { describe, it, expect } from 'vitest';
import { QUELLEN, quellenFuer, quelleFinden, QUELLEN_ART_REIHENFOLGE } from './quellen';
import { bodyIndex } from './index';
import { SCENES } from './scenes';
import { istThema } from './themen';

describe('Quellenkatalog', () => {
  it('hat eindeutige Kennungen und nur https-Adressen', () => {
    const ids = QUELLEN.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of QUELLEN) {
      expect(q.id).toMatch(/^[a-z0-9-]+$/);
      expect(q.url, q.id).toMatch(/^https:\/\//);
      expect(q.titel.de.length, q.id).toBeGreaterThan(0);
      expect(q.titel.en.length, q.id).toBeGreaterThan(0);
      expect(q.fuer.length, q.id).toBeGreaterThan(0);
    }
  });

  it('verweist nur auf bekannte Körper, Szenen und Themen', () => {
    for (const q of QUELLEN) {
      for (const ziel of q.fuer) {
        const [art, kennung] = ziel.split(':');
        expect(kennung, `${q.id}: ${ziel}`).toBeTruthy();
        const bekannt = art === 'objekt' ? Object.hasOwn(bodyIndex, kennung ?? '')
          : art === 'szene' ? SCENES.some((s) => s.id === kennung)
            : art === 'thema' ? istThema(kennung ?? '')
              : false;
        expect(bekannt, `${q.id}: ${ziel}`).toBe(true);
      }
    }
  });

  it('liefert zu einer Kennung die passenden Quellen, nach Art und dann Sprache sortiert', () => {
    const liste = quellenFuer('objekt:earth');
    expect(liste.length).toBeGreaterThan(2);
    const raenge = liste.map((q) => QUELLEN_ART_REIHENFOLGE.indexOf(q.art));
    expect(raenge).toEqual([...raenge].sort((a, b) => a - b));
    expect(liste.every((q) => q.fuer.includes('objekt:earth'))).toBe(true);
    expect(quellenFuer('objekt:gibt-es-nicht')).toEqual([]);
  });

  it('findet eine Quelle über ihre Kennung', () => {
    expect(quelleFinden('nssdc-earth')?.herausgeber).toBe('NASA');
    expect(quelleFinden('nope')).toBeUndefined();
  });
});
