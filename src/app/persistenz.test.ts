import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStore, DEFAULT_STATE } from '../store';
import { encodePatch } from '../store/serialize';
import { SCHLUESSEL_SITZUNG, SCHLUESSEL_MERKEN, sitzungSchreiben } from '../store/persist';
import { startZustand, sicherungStarten } from './persistenz';
import type { StartUmgebung, EreignisZiel } from './persistenz';
import { ablageFake } from '../test/ablageFake';

const umgebung = (teil: Partial<StartUmgebung> = {}): StartUmgebung => ({
  hash: '',
  fragmentEntfernen: vi.fn(),
  ablage: ablageFake(),
  navigatorLanguage: 'de-DE',
  ...teil,
});

describe('startZustand', () => {
  it('liefert ohne Fragment und ohne Sitzung den Standard mit dem Thema Sonnensystem', () => {
    const erwartet = structuredClone(DEFAULT_STATE);
    erwartet.ui.info.thema = 'sonnensystem';
    expect(startZustand(umgebung())).toEqual(erwartet);
  });

  it('zeigt das Sonnensystem nicht, wenn ein Link oder eine Sitzung den Start bestimmt', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ camera: { targetId: 'mars' } }));
    expect(startZustand(umgebung({ ablage })).ui.info.thema).toBeNull();
    const link = umgebung({ hash: '#p=' + encodePatch({ camera: { targetId: 'mars' } }) });
    expect(startZustand(link).ui.info.thema).toBeNull();
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

  it('englischer Browser, Nutzer wählt Deutsch: Neuladen bleibt Deutsch', () => {
    // F1: sitzungSchreiben trägt ui.language auch für den Standardwert 'de'
    // ein; ohne das würde der englischsprachige Browser hier wieder Englisch
    // liefern, weil die Sitzung dann keine Sprache enthielte.
    const ablage = ablageFake();
    sitzungSchreiben(ablage, DEFAULT_STATE);
    expect(startZustand(umgebung({ ablage, navigatorLanguage: 'en-US' })).ui.language).toBe('de');
  });

  it('ungültiges Fragment ohne Sitzung: Standard, Fragment trotzdem entfernt', () => {
    const u = umgebung({ ablage: ablageFake(), hash: '#p=!!!nicht-base64!!!' });
    const erwartet = structuredClone(DEFAULT_STATE);
    erwartet.ui.info.thema = 'sonnensystem';
    expect(startZustand(u)).toEqual(erwartet);
    expect(u.fragmentEntfernen).toHaveBeenCalledTimes(1);
  });

  it('ungültiges Fragment mit Sitzung: die Sitzung, Fragment trotzdem entfernt', () => {
    // F4: decodePatch liefert null bei beschädigtem Fragment, startZustand
    // fällt dann auf die Sitzung zurück statt auf den Standard (Ruling 5) —
    // sonst überschriebe die Sicherung eine Sekunde später die Sitzung.
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    const u = umgebung({ ablage, hash: '#p=!!!nicht-base64!!!' });
    expect(startZustand(u).scale.sizeScale).toBe(7);
    expect(u.fragmentEntfernen).toHaveBeenCalledTimes(1);
  });

  it('date im Fragment setzt Zeitpunkt und Pause, ohne p oder Sitzung', () => {
    const u = umgebung({ hash: '#date=2024-03-01T18:45Z' });
    const state = startZustand(u);
    expect(state.time.paused).toBe(true);
    expect(state.time.jd).toBe(Date.UTC(2024, 2, 1, 18, 45, 0, 0) / 86_400_000 + 2440587.5);
    // Ein Link führt kein Thema, zeigt also nicht die Übersicht.
    expect(state.ui.info.thema).toBeNull();
  });

  it('body im Fragment wählt den Körper aus und richtet die Kamera auf ihn', () => {
    const u = umgebung({ hash: '#body=mars' });
    const state = startZustand(u);
    expect(state.camera.targetId).toBe('mars');
    expect(state.camera.mode).toBe('attached');
  });

  it('date überschreibt ein mitgegebenes p, scene lässt date und body außer Acht', () => {
    const p = { camera: { targetId: 'venus' } };
    const uDate = umgebung({ hash: '#p=' + encodePatch(p) + '&date=2024-03-01' });
    const stateDate = startZustand(uDate);
    expect(stateDate.camera.targetId).toBe('venus');
    expect(stateDate.time.paused).toBe(true);

    const uScene = umgebung({ hash: '#scene=systemblick&date=2024-03-01&body=mars' });
    const stateScene = startZustand(uScene);
    expect(stateScene.time).toEqual(DEFAULT_STATE.time);
    expect(stateScene.camera.targetId).toBe(DEFAULT_STATE.camera.targetId);
  });

  it('lang=fr ist keine gültige Sprache: ohne weiteren Schlüssel wie ein beschädigter Link', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ scale: { sizeScale: 7 } }));
    const u = umgebung({ ablage, hash: '#lang=fr' });
    expect(startZustand(u).scale.sizeScale).toBe(7);
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
    // F1: sitzungSchreiben trägt ui.language immer ein, auch beim Standard
    // 'de' — die erwarteten Patches hier tragen es deshalb mit.
    stop = sicherungStarten(useStore, { ablage, ziel, intervallMs: 1000 });
    useStore.getState().setScale({ sizeScale: 2 });
    vi.advanceTimersByTime(500);
    useStore.getState().setScale({ sizeScale: 3 });
    expect(gespeichert()).toBeUndefined();
    vi.advanceTimersByTime(500);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 3 }, ui: { language: 'de' } });
    // Nächste Änderung: neuer Timer, wieder ein volles Intervall.
    useStore.getState().setScale({ sizeScale: 4 });
    vi.advanceTimersByTime(999);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 3 }, ui: { language: 'de' } });
    vi.advanceTimersByTime(1);
    expect(gespeichert()).toEqual({ scale: { sizeScale: 4 }, ui: { language: 'de' } });
  });

  it('pagehide schreibt sofort', () => {
    stop = sicherungStarten(useStore, { ablage, ziel });
    useStore.getState().setScale({ sizeScale: 5 });
    handler.pagehide?.();
    expect(gespeichert()).toEqual({ scale: { sizeScale: 5 }, ui: { language: 'de' } });
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

  it('schreibt nicht, wenn sich nur die Uhr bewegt', () => {
    stop = sicherungStarten(useStore, { ablage, ziel });
    useStore.getState().setTime({ jd: DEFAULT_STATE.time.jd + 1 });
    vi.advanceTimersByTime(3000);
    expect(gespeichert()).toBeUndefined();
  });

  it('schreibt bei einer echten Änderung mit Uhrstand, ruht danach und holt die Uhr bei pagehide nach', () => {
    stop = sicherungStarten(useStore, { ablage, ziel });
    useStore.getState().setTime({ jd: 2460000 });
    useStore.getState().setScale({ sizeScale: 2 });
    vi.advanceTimersByTime(1000);
    expect(gespeichert()).toEqual({ time: { jd: 2460000 }, scale: { sizeScale: 2 }, ui: { language: 'de' } });
    // Nur die Uhr läuft weiter: kein Schreibvorgang mehr.
    useStore.getState().setTime({ jd: 2460001 });
    vi.advanceTimersByTime(3000);
    expect(gespeichert()).toEqual({ time: { jd: 2460000 }, scale: { sizeScale: 2 }, ui: { language: 'de' } });
    // Beim Verlassen der Seite kommt der aktuelle Uhrstand mit.
    handler.pagehide?.();
    expect(gespeichert()).toEqual({ time: { jd: 2460001 }, scale: { sizeScale: 2 }, ui: { language: 'de' } });
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
