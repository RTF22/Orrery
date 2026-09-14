import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from './index';
import type { AppState } from './types';
import { decodeState, fromShareable, toShareable } from './serialize';
import {
  filtereProfil, patchFuer, linkErzeugen, zurueckgesetzt,
  sitzungLesen, sitzungSchreiben, sitzungLoeschen, sitzungMerkenLesen, sitzungMerkenSchreiben,
  SCHLUESSEL_SITZUNG, SCHLUESSEL_MERKEN,
  ansichtErstellen, ansichtAnwenden, ansichtenLesen, ansichtenSchreiben,
  ansichtenExportieren, ansichtenImportieren, freierName, nameBereinigen,
  SCHLUESSEL_ANSICHTEN, EXPORT_FORMAT, NAME_MAX,
} from './persist';
import type { Ablage, Ansicht } from './persist';
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

  it('schreibt die Sprache auch dann, wenn sie dem Standard entspricht', () => {
    // F1: patchFuer bildet nur Abweichungen ab, DEFAULT_STATE.ui.language ist
    // 'de' — ohne den Zusatz in sitzungSchreiben stünde hier gar kein
    // ui.language, und ein englischsprachiger Browser läse beim nächsten
    // Start wieder Englisch.
    const a = ablageFake();
    sitzungSchreiben(a, structuredClone(DEFAULT_STATE));
    const gespeichert = JSON.parse(a.daten.get(SCHLUESSEL_SITZUNG) ?? '{}') as { ui?: { language?: string } };
    expect(gespeichert.ui?.language).toBe('de');
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

describe('Ansichten: erstellen und anwenden', () => {
  it('ansichtErstellen nimmt nur das Profil ansicht mit', () => {
    expect(ansichtErstellen('Alles', abgewandelt())).toEqual({
      name: 'Alles',
      state: {
        time: { rateDaysPerSec: -30 },
        scale: { sizeScale: 7, preset: null },
        display: { orbits: false },
        camera: { targetId: 'saturn', mode: 'attached' },
        visible: { mercury: false },
      },
    });
  });

  it('ansichtAnwenden ersetzt die Einstellungen und behält Zeitpunkt, Pause, Kino, Qualität und Oberfläche', () => {
    const aktuell = abgewandelt();
    const ansicht: Ansicht = {
      name: 'Erde',
      state: { scale: { sizeScale: 3, preset: null }, display: { labels: false } },
    };
    const s = ansichtAnwenden(aktuell, ansicht);
    // Aus der Ansicht:
    expect(s.scale.sizeScale).toBe(3);
    expect(s.scale.preset).toBeNull();
    expect(s.display.labels).toBe(false);
    // Nicht in der Ansicht, also Standard — eine Ansicht ersetzt die Einstellungen:
    expect(s.display.orbits).toBe(true);
    expect(s.camera.targetId).toBe('sun');
    expect(s.camera.mode).toBe('free');
    expect(s.visible).toEqual({});
    expect(s.time.rateDaysPerSec).toBe(1);
    // Bleibt vom aktuellen Zustand:
    expect(s.time.jd).toBe(aktuell.time.jd);
    expect(s.time.paused).toBe(true);
    expect(s.cinema).toEqual(aktuell.cinema);
    expect(s.quality.tier).toBe('high');
    expect(s.ui).toEqual(aktuell.ui);
  });

  it('ansichtAnwenden mit leerer Ansicht liefert die Standard-Einstellungen zum aktuellen Moment', () => {
    const s = ansichtAnwenden(abgewandelt(), { name: 'Leer', state: {} });
    expect(s.scale).toEqual(DEFAULT_STATE.scale);
    expect(s.time.jd).toBe(2461294.5);
    expect(s.ui.language).toBe('en');
  });
});

describe('Ansichten in der Ablage', () => {
  const mars: Ansicht = { name: 'Mars', state: { camera: { targetId: 'mars' } } };

  it('schreibt und liest die Liste zurück', () => {
    const ablage = ablageFake();
    expect(ansichtenSchreiben(ablage, [mars])).toBe(true);
    expect(JSON.parse(ablage.daten.get(SCHLUESSEL_ANSICHTEN) ?? '')).toEqual([mars]);
    expect(ansichtenLesen(ablage)).toEqual([mars]);
  });

  it('liefert [] ohne Eintrag, ohne Ablage und bei beschädigtem JSON, ohne zu löschen', () => {
    expect(ansichtenLesen(ablageFake())).toEqual([]);
    expect(ansichtenLesen(null)).toEqual([]);
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_ANSICHTEN, '[{');
    expect(ansichtenLesen(ablage)).toEqual([]);
    expect(ablage.daten.get(SCHLUESSEL_ANSICHTEN)).toBe('[{');
  });

  it('prüft Namen und Zustände beim Lesen, streicht Profilfremdes und Dubletten', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_ANSICHTEN, JSON.stringify([
      { name: ' Gut ', state: { scale: { sizeScale: 3 }, time: { jd: 5, rateDaysPerSec: 2 }, ui: { language: 'fr' } } },
      { name: '', state: {} },
      { name: 'OhneZustand' },
      { name: 'Gut', state: {} },
      7,
    ]));
    expect(ansichtenLesen(ablage)).toEqual([
      { name: 'Gut', state: { scale: { sizeScale: 3 }, time: { rateDaysPerSec: 2 } } },
    ]);
  });

  it('wirft bei gesperrter oder voller Ablage nicht', () => {
    expect(ansichtenLesen(werfend)).toEqual([]);
    expect(ansichtenSchreiben(werfend, [mars])).toBe(false);
    expect(ansichtenSchreiben(null, [mars])).toBe(false);
  });
});

describe('Ansichten: Export und Import', () => {
  const mars: Ansicht = { name: 'Mars', state: { camera: { targetId: 'mars' } } };

  it('der Export trägt den Umschlag, der Import liest ihn zurück', () => {
    const text = ansichtenExportieren([mars]);
    expect(JSON.parse(text)).toEqual({ format: EXPORT_FORMAT, version: 1, ansichten: [mars] });
    expect(ansichtenImportieren(text, [])).toEqual({ liste: [mars], fehler: null, verworfen: 0 });
  });

  it('lehnt fremde Dateien ab und lässt Vorhandenes stehen', () => {
    const fremd = [
      'kein json',
      '{}',
      '[]',
      JSON.stringify({ format: 'x', version: 1, ansichten: [] }),
      JSON.stringify({ format: EXPORT_FORMAT, version: 2, ansichten: [] }),
      JSON.stringify({ format: EXPORT_FORMAT, version: 1, ansichten: {} }),
    ];
    for (const text of fremd) {
      expect(ansichtenImportieren(text, [mars]), text).toEqual({ liste: [mars], fehler: 'umschlag', verworfen: 0 });
    }
  });

  it('meldet „leer", wenn kein Eintrag gültig ist', () => {
    const text = JSON.stringify({ format: EXPORT_FORMAT, version: 1, ansichten: [{ name: '', state: {} }, 'x'] });
    expect(ansichtenImportieren(text, [mars])).toEqual({ liste: [mars], fehler: 'leer', verworfen: 2 });
  });

  it('übernimmt Gültiges, zählt Verworfenes und vergibt Suffixe bei Namenskonflikten', () => {
    const text = JSON.stringify({
      format: EXPORT_FORMAT, version: 1,
      ansichten: [
        { name: 'Mars', state: { scale: { sizeScale: 2 } } },
        { name: 'Mars', state: {} },
        { name: 'Erde', state: { time: { jd: 1 } } },
        { name: 5, state: {} },
      ],
    });
    expect(ansichtenImportieren(text, [mars])).toEqual({
      liste: [
        mars,
        { name: 'Mars (2)', state: { scale: { sizeScale: 2 } } },
        { name: 'Mars (3)', state: {} },
        { name: 'Erde', state: {} },
      ],
      fehler: null,
      verworfen: 1,
    });
  });
});

describe('freierName und nameBereinigen', () => {
  it('zählt hoch, bis der Name frei ist', () => {
    expect(freierName('Mars', new Set())).toBe('Mars');
    expect(freierName('Mars', new Set(['Mars', 'Mars (2)']))).toBe('Mars (3)');
  });

  it('trimmt und lehnt leere, fremde und überlange Namen ab', () => {
    expect(nameBereinigen('  Mars ')).toBe('Mars');
    expect(nameBereinigen('   ')).toBeNull();
    expect(nameBereinigen(7)).toBeNull();
    expect(nameBereinigen('x'.repeat(81))).toBeNull();
    expect(nameBereinigen('x'.repeat(80))).toBe('x'.repeat(80));
  });

  it('hält den Suffix innerhalb von NAME_MAX', () => {
    const lang = 'x'.repeat(NAME_MAX);
    const frei = freierName(lang, new Set([lang]));
    expect(frei.length).toBeLessThanOrEqual(NAME_MAX);
    expect(frei.endsWith(' (2)')).toBe(true);
    expect(nameBereinigen(frei)).toBe(frei);
  });
});
