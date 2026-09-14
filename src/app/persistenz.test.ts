import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStore, DEFAULT_STATE } from '../store';
import { encodePatch } from '../store/serialize';
import { SCHLUESSEL_SITZUNG, SCHLUESSEL_MERKEN } from '../store/persist';
import { fragmentLesen, startZustand, sicherungStarten } from './persistenz';
import type { StartUmgebung, EreignisZiel } from './persistenz';
import { ablageFake } from '../test/ablageFake';

const umgebung = (teil: Partial<StartUmgebung> = {}): StartUmgebung => ({
  hash: '',
  fragmentEntfernen: vi.fn(),
  ablage: ablageFake(),
  navigatorLanguage: 'de-DE',
  ...teil,
});

describe('fragmentLesen', () => {
  it('liest nur das p-Fragment', () => {
    expect(fragmentLesen('#p=abc')).toBe('abc');
    expect(fragmentLesen('#x=1')).toBeNull();
    expect(fragmentLesen('')).toBeNull();
  });
});

describe('startZustand', () => {
  it('liefert den Standard ohne Fragment und ohne Sitzung', () => {
    expect(startZustand(umgebung())).toEqual(DEFAULT_STATE);
  });

  it('nimmt das Fragment vor der Sitzung und entfernt es', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    const u = umgebung({ ablage, hash: '#p=' + encodePatch({ scale: { sizeScale: 3 } }) });
    expect(startZustand(u).scale.sizeScale).toBe(3);
    expect(u.fragmentEntfernen).toHaveBeenCalledTimes(1);
  });

  it('nimmt die Sitzung, wenn kein Fragment da ist', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    const u = umgebung({ ablage });
    expect(startZustand(u).scale.sizeScale).toBe(7);
    expect(u.fragmentEntfernen).not.toHaveBeenCalled();
  });

  it('ignoriert die Sitzung, wenn „merken" aus ist', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    ablage.daten.set(SCHLUESSEL_MERKEN, '0');
    expect(startZustand(umgebung({ ablage })).scale.sizeScale).toBe(DEFAULT_STATE.scale.sizeScale);
  });

  it('Sprache: Fragment vor Browser, sonst Browser', () => {
    const mitSprache = '#p=' + encodePatch({ ui: { language: 'en' } });
    const ohneSprache = '#p=' + encodePatch({ time: { paused: true } });
    expect(startZustand(umgebung({ hash: mitSprache, navigatorLanguage: 'de-DE' })).ui.language).toBe('en');
    expect(startZustand(umgebung({ hash: ohneSprache, navigatorLanguage: 'en-US' })).ui.language).toBe('en');
    expect(startZustand(umgebung({ hash: ohneSprache, navigatorLanguage: 'de-DE' })).ui.language).toBe('de');
  });

  it('Sprache aus der Sitzung schlägt den Browser', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ ui: { language: 'en' } }));
    expect(startZustand(umgebung({ ablage, navigatorLanguage: 'de-DE' })).ui.language).toBe('en');
  });

  it('ungültiges Fragment: Standard, Fragment trotzdem entfernt', () => {
    const u = umgebung({ hash: '#p=!!!nicht-base64!!!' });
    expect(startZustand(u)).toEqual(DEFAULT_STATE);
    expect(u.fragmentEntfernen).toHaveBeenCalledTimes(1);
  });
});

describe('sicherungStarten', () => {
  let ablage: ReturnType<typeof ablageFake>;
  let handler: Partial<Record<'pagehide', () => void>>;
  let ziel: EreignisZiel;
  let stop: (() => void) | null = null;

  const gespeichert = (): unknown => {
    const text = ablage.daten.get(SCHLUESSEL_SITZUNG);
    return text === undefined ? undefined : JSON.parse(text);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
    ablage = ablageFake();
    handler = {};
    ziel = {
      addEventListener: (typ, h) => { handler[typ] = h; },
      removeEventListener: (typ) => { delete handler[typ]; },
    };
  });

  afterEach(() => {
    stop?.();
    stop = null;
    vi.useRealTimers();
  });

  it('schreibt höchstens einmal je Intervall, und zwar den letzten Stand', () => {
    stop = sicherungStarten(useStore, { ablage, ziel, intervallMs: 1000 });
    useStore.getState().setScale({ sizeScale: 2 });
    vi.advanceTimersByTime(500);
    useStore.getState().setScale({ sizeScale: 3 });
    expect(gespeichert()).toBeUndefined();
    vi.advanceTimersByTime(500);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 3 } });
    // Nächste Änderung: neuer Timer, wieder ein volles Intervall.
    useStore.getState().setScale({ sizeScale: 4 });
    vi.advanceTimersByTime(999);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 3 } });
    vi.advanceTimersByTime(1);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 4 } });
  });

  it('pagehide schreibt sofort', () => {
    stop = sicherungStarten(useStore, { ablage, ziel });
    useStore.getState().setScale({ sizeScale: 5 });
    handler.pagehide?.();
    expect(gespeichert()).toEqual({ scale: { sizeScale: 5 } });
  });

  it('schreibt nicht, wenn „merken" aus ist', () => {
    ablage.daten.set(SCHLUESSEL_MERKEN, '0');
    stop = sicherungStarten(useStore, { ablage, ziel });
    useStore.getState().setScale({ sizeScale: 6 });
    vi.advanceTimersByTime(2000);
    handler.pagehide?.();
    expect(gespeichert()).toBeUndefined();
  });

  it('schreibt ohne Ablage nicht und wirft nicht', () => {
    stop = sicherungStarten(useStore, { ablage: null, ziel });
    useStore.getState().setScale({ sizeScale: 6 });
    expect(() => { vi.advanceTimersByTime(2000); }).not.toThrow();
  });

  it('hört nach dem Abbestellen auf', () => {
    stop = sicherungStarten(useStore, { ablage, ziel });
    stop();
    stop = null;
    expect(handler.pagehide).toBeUndefined();
    useStore.getState().setScale({ sizeScale: 8 });
    vi.advanceTimersByTime(2000);
    expect(gespeichert()).toBeUndefined();
  });
});
