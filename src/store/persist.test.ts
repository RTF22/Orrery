import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from './index';
import type { AppState } from './types';
import { decodeState, fromShareable, toShareable } from './serialize';
import {
  filtereProfil, patchFuer, linkErzeugen, zurueckgesetzt,
  sitzungLesen, sitzungSchreiben, sitzungLoeschen, sitzungMerkenLesen, sitzungMerkenSchreiben,
  SCHLUESSEL_SITZUNG, SCHLUESSEL_MERKEN,
} from './persist';
import type { Ablage } from './persist';
import { ablageFake } from '../test/ablageFake';

/** Ein Zustand, der in jedem Zweig vom Standard abweicht. */
const abgewandelt = (): AppState => {
  const s = structuredClone(DEFAULT_STATE);
  s.time.jd = 2461294.5;
  s.time.rateDaysPerSec = -30;
  s.time.paused = true;
  s.scale.sizeScale = 7;
  s.scale.preset = null;
  s.display.orbits = false;
  s.camera.targetId = 'saturn';
  s.camera.mode = 'attached';
  s.cinema.nummer = 3;
  s.cinema.elapsedSec = 12.5;
  s.visible.mercury = false;
  s.quality.tier = 'high';
  s.ui.hidden = true;
  s.ui.panels.display = false;
  s.ui.language = 'en';
  return s;
};

const werfend: Ablage = {
  getItem: () => { throw new Error('gesperrt'); },
  setItem: () => { throw new DOMException('voll', 'QuotaExceededError'); },
  removeItem: () => { throw new Error('gesperrt'); },
};

describe('filtereProfil', () => {
  const patch = toShareable(abgewandelt());

  it('link streicht Qualität und Bedienzustand, behält die Sprache', () => {
    const p = filtereProfil(patch, 'link');
    expect(p.quality).toBeUndefined();
    expect(p.ui).toEqual({ language: 'en' });
    expect(p.time).toEqual(patch.time);
    expect(p.cinema).toEqual(patch.cinema);
  });

  it('link lässt einen leer gewordenen ui-Zweig ganz weg', () => {
    expect(filtereProfil({ ui: { hidden: true, panels: { display: false } } }, 'link')).toEqual({});
  });

  it('sitzung streicht nichts', () => {
    expect(filtereProfil(patch, 'sitzung')).toEqual(patch);
  });

  it('ansicht streicht Zeitpunkt, Pause, Kino, Qualität und Oberfläche, behält die Zeitrate', () => {
    const p = filtereProfil(patch, 'ansicht');
    expect(p.time).toEqual({ rateDaysPerSec: -30 });
    expect(p.cinema).toBeUndefined();
    expect(p.quality).toBeUndefined();
    expect(p.ui).toBeUndefined();
    expect(p.scale).toEqual(patch.scale);
    expect(p.display).toEqual(patch.display);
    expect(p.camera).toEqual(patch.camera);
    expect(p.visible).toEqual(patch.visible);
  });

  it('lässt einen fehlenden Pfad unberührt', () => {
    expect(filtereProfil({ time: { paused: true } }, 'link')).toEqual({ time: { paused: true } });
  });
});

describe('Round-Trip je Profil', () => {
  it('link: alles außer Qualität und Bedienzustand kommt zurück', () => {
    const s = abgewandelt();
    const zurueck = fromShareable(patchFuer(s, 'link'));
    const erwartet = structuredClone(s);
    erwartet.quality = structuredClone(DEFAULT_STATE.quality);
    erwartet.ui.hidden = DEFAULT_STATE.ui.hidden;
    erwartet.ui.panels = structuredClone(DEFAULT_STATE.ui.panels);
    expect(zurueck).toEqual(erwartet);
  });

  it('sitzung: alles kommt zurück', () => {
    const s = abgewandelt();
    expect(fromShareable(patchFuer(s, 'sitzung'))).toEqual(s);
  });
});

describe('linkErzeugen', () => {
  it('baut Ursprung, Pfad und Fragment zusammen; das Fragment stellt die Ansicht wieder her', () => {
    const s = abgewandelt();
    const link = linkErzeugen(s, { origin: 'https://beispiel.test', pathname: '/Orrery/' });
    expect(link.startsWith('https://beispiel.test/Orrery/#p=')).toBe(true);
    const zurueck = decodeState(link.slice(link.indexOf('#p=') + 3));
    expect(zurueck.scale.sizeScale).toBe(7);
    expect(zurueck.ui.language).toBe('en');
    expect(zurueck.quality.tier).toBe('auto');
  });
});

describe('zurueckgesetzt', () => {
  it('liefert den Standard mit Sprache und Qualitätsstufe des aktuellen Zustands', () => {
    const z = zurueckgesetzt(abgewandelt());
    expect(z.ui.language).toBe('en');
    expect(z.quality.tier).toBe('high');
    expect(z.scale).toEqual(DEFAULT_STATE.scale);
    expect(z.ui.hidden).toBe(false);
    expect(z.visible).toEqual({});
  });
});

describe('Sitzung in der Ablage', () => {
  it('schreibt und liest den Patch zurück', () => {
    const a = ablageFake();
    expect(sitzungSchreiben(a, abgewandelt())).toBe(true);
    expect(sitzungLesen(a)).toEqual(toShareable(abgewandelt()));
  });

  it('liefert null ohne Eintrag und ohne Ablage', () => {
    expect(sitzungLesen(ablageFake())).toBeNull();
    expect(sitzungLesen(null)).toBeNull();
    expect(sitzungSchreiben(null, abgewandelt())).toBe(false);
  });

  it('ignoriert beschädigtes JSON, ohne es zu löschen', () => {
    const a = ablageFake();
    a.daten.set(SCHLUESSEL_SITZUNG, '{kaputt');
    expect(sitzungLesen(a)).toBeNull();
    expect(a.daten.get(SCHLUESSEL_SITZUNG)).toBe('{kaputt');
  });

  it('prüft gelesene Felder', () => {
    const a = ablageFake();
    a.daten.set(SCHLUESSEL_SITZUNG, '{"ui":{"language":"fr"},"time":{"paused":true}}');
    expect(sitzungLesen(a)).toEqual({ time: { paused: true } });
  });

  it('löscht den Eintrag', () => {
    const a = ablageFake();
    sitzungSchreiben(a, abgewandelt());
    sitzungLoeschen(a);
    expect(a.daten.has(SCHLUESSEL_SITZUNG)).toBe(false);
  });

  it('wirft bei gesperrter oder voller Ablage nicht', () => {
    expect(sitzungLesen(werfend)).toBeNull();
    expect(sitzungSchreiben(werfend, abgewandelt())).toBe(false);
    expect(() => { sitzungLoeschen(werfend); }).not.toThrow();
    expect(sitzungMerkenLesen(werfend)).toBe(true);
    expect(() => { sitzungMerkenSchreiben(werfend, false); }).not.toThrow();
  });
});

describe('Präferenz „Sitzung merken"', () => {
  it('ist ohne Eintrag und ohne Ablage an', () => {
    expect(sitzungMerkenLesen(ablageFake())).toBe(true);
    expect(sitzungMerkenLesen(null)).toBe(true);
  });

  it('aus schreibt „0", an entfernt den Eintrag', () => {
    const a = ablageFake();
    sitzungMerkenSchreiben(a, false);
    expect(a.daten.get(SCHLUESSEL_MERKEN)).toBe('0');
    expect(sitzungMerkenLesen(a)).toBe(false);
    sitzungMerkenSchreiben(a, true);
    expect(a.daten.has(SCHLUESSEL_MERKEN)).toBe(false);
    expect(sitzungMerkenLesen(a)).toBe(true);
  });
});
