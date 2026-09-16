// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { themaVerfallStarten } from './themaVerfall';
import { useStore, DEFAULT_STATE } from '../../store';
import { fahreZuSystem, fahrtAbbrechen } from '../kamerafahrt';
import { startCinema, stopCinema, noteUserInput } from '../cinemaControl';

/** Fahrt ohne Bildplanung: Ziel und Thema setzt fahreZuSystem sofort, der Abstand interessiert hier nicht. */
const ohneFahrt = { anfordern: () => 1, abbrechen: () => { /* nichts geplant */ } };

let abbestellen: (() => void) | null = null;

beforeEach(() => {
  fahrtAbbrechen();
  // stopCinema räumt die Modulvariablen der Kino-Steuerung (gemerkter
  // Zustand, Pausenmarke), bevor der Standard geladen wird.
  stopCinema();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  abbestellen = themaVerfallStarten();
});

afterEach(() => {
  abbestellen?.();
  abbestellen = null;
  fahrtAbbrechen();
  stopCinema();
});

const thema = (): string | null => useStore.getState().ui.info.thema;

describe('themaVerfallStarten', () => {
  it('Kinostart aus dem Startzustand verwirft das Thema, ohne dass ein InfoPanel eingehängt ist', () => {
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    startCinema();
    expect(useStore.getState().cinema.running).toBe(true);
    expect(thema()).toBeNull();
  });

  it('Wurzel des Objektbaums aus laufendem Kino mit schon gesetztem Sonnensystem behält das Thema', () => {
    startCinema();
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    expect(thema()).toBe('sonnensystem');
    fahreZuSystem(ohneFahrt);
    const s = useStore.getState();
    expect(s.cinema.running).toBe(false);
    expect(s.camera.mode).toBe('attached');
    expect(s.camera.targetId).toBe('sun');
    expect(thema()).toBe('sonnensystem');
  });

  it('Wurzel aus angehaltenem Kino mit schon gesetztem Sonnensystem behält das Thema', () => {
    useStore.getState().setCinema({ pauseOnInput: true });
    startCinema();
    noteUserInput();
    expect(useStore.getState().cinema.running).toBe(false);
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    fahreZuSystem(ohneFahrt);
    expect(useStore.getState().camera.mode).toBe('attached');
    expect(thema()).toBe('sonnensystem');
  });

  it('eine Themenwahl ohne Grundlagenwechsel bleibt', () => {
    useStore.getState().setCamera({ targetId: 'saturn' });
    useStore.getState().setInfo({ thema: 'ringe' });
    useStore.getState().setTime({ jd: 2460000 });
    useStore.getState().setInfo({ niveau: 'grundschule' });
    expect(thema()).toBe('ringe');
  });

  it('ein Zielwechsel ohne Themenwechsel verwirft', () => {
    useStore.getState().setInfo({ thema: 'ringe' });
    useStore.getState().setCamera({ targetId: 'mars' });
    expect(thema()).toBeNull();
  });

  it('ein Szenenwechsel im Kino ohne Themenwechsel verwirft', () => {
    useStore.getState().setCinema({ shuffle: false, nummer: 0 });
    startCinema();
    useStore.getState().setInfo({ thema: 'ringe' });
    useStore.getState().setCinema({ nummer: 1 });
    expect(thema()).toBeNull();
  });

  it('Ziel und neues Thema im selben setState bleiben', () => {
    useStore.getState().setCamera({ targetId: 'saturn' });
    useStore.getState().setInfo({ thema: 'ringe' });
    useStore.setState((s) => ({
      camera: { ...s.camera, targetId: 'sun' },
      ui: { ...s.ui, info: { ...s.ui.info, thema: 'sonnensystem' } },
    }));
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(thema()).toBe('sonnensystem');
  });

  it('dokumentiert: getrennte setState „erst Thema, dann Ziel" verwerfen das Thema', () => {
    useStore.getState().setCamera({ targetId: 'saturn' });
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    useStore.getState().setCamera({ targetId: 'sun' });
    expect(thema()).toBeNull();
  });

  it('dokumentiert: gleicher Themenwert und neue Grundlage im selben setState verwerfen ebenfalls', () => {
    // Deshalb beendet „Zurücksetzen" ein aktives Kino vor dem Ersetzen des Zustands.
    useStore.getState().setCamera({ targetId: 'saturn' });
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    useStore.setState((s) => ({
      camera: { ...s.camera, targetId: 'sun' },
      ui: { ...s.ui, info: { ...s.ui.info, thema: 'sonnensystem' } },
    }));
    expect(thema()).toBeNull();
  });

  it('nach dem Abbestellen verfällt nichts mehr', () => {
    abbestellen?.();
    abbestellen = null;
    useStore.getState().setInfo({ thema: 'ringe' });
    useStore.getState().setCamera({ targetId: 'mars' });
    expect(thema()).toBe('ringe');
  });
});
