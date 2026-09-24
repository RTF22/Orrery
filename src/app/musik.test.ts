import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { erzeugeSpieler, musikStarten, type Tonkontext, type Tonumgebung } from './musik';
import { BLENDE_S, UEBERBLENDUNG_S } from './musikFolge';
import { useMusikStand, type MusikEintrag } from '../ui/musikStand';
import { useStore, DEFAULT_STATE } from '../store';

class TestParam {
  ereignisse: [string, number, number][] = [];
  constructor(public value: number) {}
  setValueAtTime(v: number, t: number) { this.ereignisse.push(['setze', v, t]); this.value = v; return this; }
  // Die Attrappe springt sofort ans Ziel; geprüft werden die geplanten Rampen.
  linearRampToValueAtTime(v: number, t: number) { this.ereignisse.push(['rampe', v, t]); this.value = v; return this; }
  cancelScheduledValues(t: number) { this.ereignisse.push(['abbruch', 0, t]); return this; }
  letzteRampe() { return this.ereignisse.filter((e) => e[0] === 'rampe').at(-1); }
}

class TestElement extends EventTarget {
  src = '';
  preload = '';
  loop = false;
  paused = true;
  currentTime = 0;
  duration = Number.NaN;
  abspielen = 0;
  play = vi.fn(() => { this.abspielen += 1; this.paused = false; return Promise.resolve(); });
  pause = vi.fn(() => { this.paused = true; });
  removeAttribute(): void { this.src = ''; }
}

function testUmgebung() {
  const elemente: TestElement[] = [];
  const verstaerker: { gain: TestParam; connect: () => void }[] = [];
  const kontext = {
    currentTime: 10,
    state: 'running',
    destination: {},
    resume: vi.fn(() => Promise.resolve()),
    createGain: () => { const v = { gain: new TestParam(1), connect: () => {} }; verstaerker.push(v); return v; },
    createMediaElementSource: () => ({ connect: () => {} }),
  };
  const umgebung: Tonumgebung = {
    kontext: vi.fn(() => kontext as unknown as Tonkontext),
    element: () => { const el = new TestElement(); elemente.push(el); return el as unknown as HTMLAudioElement; },
  };
  // Reihenfolge der Verstärker: [haupt, blende, kanal 0, kanal 1] (siehe erzeugeSpieler).
  return { umgebung, kontext, elemente, verstaerker };
}

const LISTE: MusikEintrag[] = [{ datei: 'a.mp3', titel: 'A' }, { datei: 'b c.mp3' }, { datei: 'c.mp3' }];

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('erzeugeSpieler', () => {
  it('blendet beim ersten Spielen ein und meldet das Stück', () => {
    const t = testUmgebung();
    const beiStueck = vi.fn();
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, beiStueck, () => 0.3);
    spieler.setze(true, 0.5);
    const el = t.elemente[0]!;
    expect(el.src.startsWith('/o/musik/')).toBe(true);
    expect(el.play).toHaveBeenCalledOnce();
    expect(el.preload).toBe('none');
    const [haupt, blende] = t.verstaerker;
    expect(haupt!.gain.value).toBe(0.5);
    expect(blende!.gain.letzteRampe()).toEqual(['rampe', 1, 10 + BLENDE_S]);
    const eintrag = beiStueck.mock.calls[0]![0] as MusikEintrag;
    expect(el.src).toBe(`/o/musik/${encodeURIComponent(eintrag.datei)}`);
  });

  it('blendet aus, hält danach an und setzt an derselben Stelle fort', () => {
    const t = testUmgebung();
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, vi.fn(), () => 0.3);
    spieler.setze(true, 0.5);
    const el = t.elemente[0]!;
    const quelle = el.src;
    el.currentTime = 42;
    spieler.setze(false, 0.5);
    expect(t.verstaerker[1]!.gain.letzteRampe()).toEqual(['rampe', 0, 10 + BLENDE_S]);
    expect(el.pause).not.toHaveBeenCalled();
    vi.advanceTimersByTime(BLENDE_S * 1000);
    expect(el.paused).toBe(true);
    spieler.setze(true, 0.5);
    expect(el.src).toBe(quelle);
    expect(el.currentTime).toBe(42);
    expect(el.play).toHaveBeenCalledTimes(2);
  });

  it('bricht die Pause ab, wenn während des Ausblendens wieder gespielt werden soll', () => {
    const t = testUmgebung();
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, vi.fn(), () => 0.3);
    spieler.setze(true, 0.5);
    spieler.setze(false, 0.5);
    vi.advanceTimersByTime(500);
    spieler.setze(true, 0.5);
    vi.advanceTimersByTime(BLENDE_S * 1000);
    expect(t.elemente[0]!.pause).not.toHaveBeenCalled();
    expect(t.verstaerker[1]!.gain.letzteRampe()).toEqual(['rampe', 1, 10 + BLENDE_S]);
  });

  it('tut nichts, wenn sich weder Soll noch Lautstärke ändern', () => {
    const t = testUmgebung();
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, vi.fn(), () => 0.3);
    spieler.setze(true, 0.5);
    const vorher = t.verstaerker.map((v) => v.gain.ereignisse.length);
    spieler.setze(true, 0.5);
    expect(t.verstaerker.map((v) => v.gain.ereignisse.length)).toEqual(vorher);
    spieler.setze(true, 0.8);
    expect(t.verstaerker[0]!.gain.value).toBe(0.8);
  });

  it('überblendet drei Sekunden vor dem Ende zum nächsten Stück auf dem anderen Element', () => {
    const t = testUmgebung();
    const beiStueck = vi.fn();
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, beiStueck, () => 0.3);
    spieler.setze(true, 0.5);
    const [alt, neu] = t.elemente;
    alt!.duration = 100;
    alt!.currentTime = 100 - UEBERBLENDUNG_S + 0.1;
    alt!.dispatchEvent(new Event('timeupdate'));
    expect(neu!.src).not.toBe('');
    expect(neu!.src).not.toBe(alt!.src);
    expect(neu!.play).toHaveBeenCalledOnce();
    expect(t.verstaerker[3]!.gain.letzteRampe()).toEqual(['rampe', 1, 10 + UEBERBLENDUNG_S]);
    expect(t.verstaerker[2]!.gain.letzteRampe()).toEqual(['rampe', 0, 10 + UEBERBLENDUNG_S]);
    expect(beiStueck).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(UEBERBLENDUNG_S * 1000);
    expect(alt!.pause).toHaveBeenCalled();
    alt!.dispatchEvent(new Event('timeupdate'));
    expect(t.elemente.filter((e) => e.play.mock.calls.length > 0)).toHaveLength(2);
  });

  it('hält bei verdeckter Seite während einer Überblendung beide Elemente an und setzt nur das neue fort', () => {
    const t = testUmgebung();
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, vi.fn(), () => 0.3);
    spieler.setze(true, 0.5);
    const [alt, neu] = t.elemente;
    alt!.duration = 100;
    alt!.currentTime = 98;
    alt!.dispatchEvent(new Event('timeupdate'));
    spieler.setze(false, 0.5);
    vi.advanceTimersByTime(BLENDE_S * 1000);
    expect(alt!.paused).toBe(true);
    expect(neu!.paused).toBe(true);
    const altAufrufe = alt!.play.mock.calls.length;
    spieler.setze(true, 0.5);
    expect(neu!.play).toHaveBeenCalledTimes(2);
    expect(alt!.play.mock.calls.length).toBe(altAufrufe);
  });

  it('spielt ein einzelnes Stück in Schleife ohne Überblendung', () => {
    const t = testUmgebung();
    const spieler = erzeugeSpieler([{ datei: 'x.mp3' }], '/o/musik/', t.umgebung, vi.fn());
    spieler.setze(true, 0.5);
    const [el, zweites] = t.elemente;
    expect(el!.loop).toBe(true);
    el!.duration = 10;
    el!.currentTime = 9;
    el!.dispatchEvent(new Event('timeupdate'));
    expect(zweites!.src).toBe('');
  });

  it('überspringt ein fehlerhaftes Stück und bleibt still, wenn alle scheitern', () => {
    const t = testUmgebung();
    const beiStueck = vi.fn();
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, beiStueck, () => 0.3);
    spieler.setze(true, 0.5);
    const quellen = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const aktiv = t.elemente.find((e) => !e.paused && e.src !== '');
      if (aktiv === undefined) break;
      quellen.add(aktiv.src);
      aktiv.dispatchEvent(new Event('error'));
    }
    expect(quellen.size).toBe(3);
    expect(beiStueck).toHaveBeenLastCalledWith(null);
    const aufrufe = t.elemente.map((e) => e.play.mock.calls.length);
    spieler.setze(false, 0.5);
    spieler.setze(true, 0.5);
    expect(t.elemente.map((e) => e.play.mock.calls.length)).toEqual(aufrufe);
  });

  it('setzt einen gesperrten Kontext nach einer Geste fort', () => {
    const t = testUmgebung();
    t.kontext.state = 'suspended';
    const spieler = erzeugeSpieler(LISTE, '/o/musik/', t.umgebung, vi.fn());
    spieler.setze(true, 0.5);
    spieler.entsperren();
    expect(t.kontext.resume).toHaveBeenCalledOnce();
  });
});

describe('musikStarten', () => {
  const ereignisse = () => ({ visibilityState: 'visible' as DocumentVisibilityState, addEventListener: vi.fn(), removeEventListener: vi.fn() });

  beforeEach(() => {
    useMusikStand.setState({ verfuegbar: false, aktuell: null });
    useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  });

  it('bleibt ohne Liste still und legt keinen Tonkontext an', async () => {
    const t = testUmgebung();
    const laden = vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve(null) }));
    const ergebnis = await musikStarten({ basis: '/o/', laden, umgebung: t.umgebung, dokument: ereignisse(), fenster: ereignisse() });
    expect(ergebnis).toBeNull();
    expect(laden).toHaveBeenCalledWith('/o/musik/stuecke.json');
    expect(t.umgebung.kontext).not.toHaveBeenCalled();
    expect(useMusikStand.getState().verfuegbar).toBe(false);
  });

  it('bleibt bei kaputter oder leerer Liste still', async () => {
    const t = testUmgebung();
    for (const antwort of [
      { ok: true, json: () => Promise.reject(new SyntaxError('kein JSON')) },
      { ok: true, json: () => Promise.resolve([{ titel: 'ohne Datei' }]) },
    ]) {
      const ergebnis = await musikStarten({ basis: '/o/', laden: () => Promise.resolve(antwort), umgebung: t.umgebung, dokument: ereignisse(), fenster: ereignisse() });
      expect(ergebnis).toBeNull();
    }
    expect(t.umgebung.kontext).not.toHaveBeenCalled();
  });

  it('meldet verfügbare Musik und spielt, sobald das Kino läuft', async () => {
    const t = testUmgebung();
    const ergebnis = await musikStarten({
      basis: '/o/', laden: () => Promise.resolve({ ok: true, json: () => Promise.resolve(LISTE) }),
      umgebung: t.umgebung, dokument: ereignisse(), fenster: ereignisse(),
    });
    expect(ergebnis).not.toBeNull();
    expect(useMusikStand.getState().verfuegbar).toBe(true);
    expect(ergebnis!.spieler.stand().spielt).toBe(false);
    useStore.getState().setCinema({ running: true });
    expect(ergebnis!.spieler.stand().spielt).toBe(true);
    expect(useMusikStand.getState().aktuell).not.toBeNull();
    useStore.getState().setTon({ stumm: true });
    expect(ergebnis!.spieler.stand().spielt).toBe(false);
    ergebnis!.beenden();
  });
});
