// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BodyTree, buildTree, kaskadierendeSichtbarkeit, ZWERGPLANETEN_ZWEIG } from './BodyTree';
import { bodies, bodyIndex } from '../../data/index';
import { useStore, DEFAULT_STATE } from '../../store';
import { fahrtAbbrechen } from '../kamerafahrt';

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

const PLANETEN = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const ZWERGE = ['pluto', 'ceres', 'eris', 'haumea', 'makemake'];

describe('buildTree', () => {
  it('stellt Sonne, Planeten und den Zweig Zwergplaneten auf eine Ebene', () => {
    expect(buildTree(bodies).map((k) => k.id)).toEqual(['sun', ...PLANETEN, ZWERGPLANETEN_ZWEIG]);
  });

  it('lässt die Sonne ohne Kinder, obwohl in den Daten alle Planeten an ihr hängen', () => {
    expect(buildTree(bodies)[0]!.children).toEqual([]);
  });

  it('sammelt die fünf Zwergplaneten in einem Zweig ohne eigenen Körper', () => {
    const zweig = buildTree(bodies).find((k) => k.id === ZWERGPLANETEN_ZWEIG)!;
    expect(zweig.body).toBeNull();
    expect(zweig.children.map((k) => k.id)).toEqual(ZWERGE);
  });

  it('hängt den Mond unter die Erde und Charon unter Pluto', () => {
    const ebene = buildTree(bodies);
    expect(ebene.find((k) => k.id === 'earth')!.children.map((k) => k.id)).toEqual(['moon']);
    const pluto = ebene.find((k) => k.id === ZWERGPLANETEN_ZWEIG)!.children.find((k) => k.id === 'pluto')!;
    expect(pluto.children.map((k) => k.id)).toContain('charon');
  });
});

describe('kaskadierendeSichtbarkeit', () => {
  it('umfasst bei der Sonne nur die Sonne', () => {
    expect(kaskadierendeSichtbarkeit('sun')).toEqual(['sun']);
  });

  it('umfasst beim Zweig Zwergplaneten alle Zwergplaneten samt Monden', () => {
    const erwartet = bodies
      .filter((b) => b.kind === 'dwarf' || (b.parent !== null && bodyIndex[b.parent]?.kind === 'dwarf'))
      .map((b) => b.id);
    expect(erwartet).toContain('charon');
    expect([...kaskadierendeSichtbarkeit(ZWERGPLANETEN_ZWEIG)].sort()).toEqual([...erwartet].sort());
  });

  it('liefert für unbekannte Kennungen nichts', () => {
    expect(kaskadierendeSichtbarkeit('vulcan')).toEqual([]);
  });
});

describe('BodyTree', () => {
  it('zeigt die deutschen Namen', () => {
    render(<BodyTree />);
    expect(screen.getByText('Sonnensystem')).toBeTruthy();
    expect(screen.getByText('Merkur')).toBeTruthy();
    expect(screen.getByText('Neptun')).toBeTruthy();
  });

  it('zeigt Sonne und Planeten sofort, den Zweig Zwergplaneten eingeklappt', () => {
    render(<BodyTree />);
    expect(screen.getByText('Sonne')).toBeTruthy();
    expect(screen.getByText('Zwergplaneten')).toBeTruthy();
    expect(screen.queryByText('Pluto')).toBeNull();
  });

  it('klappt die Wurzel zu', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByRole('button', { name: /Sonnensystem einklappen/ }));
    expect(screen.queryByText('Merkur')).toBeNull();
    expect(screen.getByText('Sonnensystem')).toBeTruthy();
  });

  it('gibt der Wurzel kein Kästchen', () => {
    render(<BodyTree />);
    expect(screen.queryByLabelText(/Sonnensystem anzeigen/)).toBeNull();
  });

  it('fährt beim Klick auf Sonnensystem zur Sonne', () => {
    useStore.getState().setCamera({ targetId: 'saturn' });
    render(<BodyTree />);
    fireEvent.click(screen.getByText('Sonnensystem'));
    expect(useStore.getState().camera.targetId).toBe('sun');
  });

  it('setzt bei Klick das Kameraziel', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByText('Saturn'));
    expect(useStore.getState().camera.targetId).toBe('saturn');
  });

  it('friert im freien Modus den Bezugspunkt auf die aktuelle Zeit ein', () => {
    useStore.getState().setTime({ jd: 2460000 });
    render(<BodyTree />);
    fireEvent.click(screen.getByText('Saturn'));
    const { camera } = useStore.getState();
    // Der freie Modus bleibt frei — gedreht und gezoomt wird ab jetzt um die
    // Position, die Saturn in diesem Augenblick hat.
    expect(camera.mode).toBe('free');
    expect(camera.freezeJd).toBe(2460000);
  });

  it('lässt den gehefteten Modus den Körper weiter mitführen', () => {
    useStore.getState().setCamera({ mode: 'attached' });
    render(<BodyTree />);
    fireEvent.click(screen.getByText('Saturn'));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.freezeJd).toBeNull();
  });

  it('blendet einen Körper über das Kaestchen aus', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByLabelText(/Neptun anzeigen/));
    expect(useStore.getState().visible.neptune).toBe(false);
  });

  it('blendet über das Kästchen der Sonne nur die Sonne aus', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByLabelText('Sonne anzeigen'));
    const { visible } = useStore.getState();
    expect(visible.sun).toBe(false);
    expect(visible.earth).toBeUndefined();
    expect(visible.pluto).toBeUndefined();
  });
});

describe('BodyTree mit Zwergplaneten', () => {
  it('klappt den Zweig über seinen Namen auf', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByRole('button', { name: 'Zwergplaneten' }));
    expect(screen.getByText('Pluto')).toBeTruthy();
    expect(screen.getByText('Makemake')).toBeTruthy();
  });

  it('blendet über das Kästchen des Zweigs alle Zwergplaneten samt Monden aus und wieder ein', () => {
    render(<BodyTree />);
    const kaestchen = screen.getByLabelText('Zwergplaneten anzeigen') as HTMLInputElement;
    const ids = kaskadierendeSichtbarkeit(ZWERGPLANETEN_ZWEIG);

    fireEvent.click(kaestchen); // ausblenden
    ids.forEach((id) => { expect(useStore.getState().visible[id]).toBe(false); });
    expect(useStore.getState().visible.neptune).toBeUndefined();
    expect(kaestchen.checked).toBe(false);

    fireEvent.click(kaestchen); // wieder einblenden
    ids.forEach((id) => { expect(useStore.getState().visible[id]).toBeUndefined(); });
    expect(kaestchen.checked).toBe(true);
  });

  it('gilt als eingeblendet, solange noch ein Zwergplanet sichtbar ist', () => {
    useStore.getState().toggleVisible('ceres');
    render(<BodyTree />);
    expect((screen.getByLabelText('Zwergplaneten anzeigen') as HTMLInputElement).checked).toBe(true);
  });
});

describe('BodyTree mit Monden', () => {
  it('zeigt Mondgruppen zunächst eingeklappt', () => {
    // toBeTruthy()/toBeNull() statt toBeInTheDocument(): jest-dom liegt zwar
    // als Abhängigkeit vor, ist aber in src/test/setup.ts nicht eingebunden,
    // und alle bestehenden Paneltests prüfen Präsenz auf diese Weise.
    render(<BodyTree />);
    expect(screen.getByText('Jupiter')).toBeTruthy();
    expect(screen.queryByText('Europa')).toBeNull();
  });

  it('klappt eine Gruppe auf Klick auf', () => {
    // fireEvent aus @testing-library/react, nicht user-event: Letzteres ist
    // keine Abhängigkeit dieses Projekts, und alle bestehenden Paneltests
    // arbeiten mit fireEvent.
    render(<BodyTree />);
    fireEvent.click(screen.getByRole('button', { name: /Jupiter aufklappen/ }));
    expect(screen.getByText('Europa')).toBeTruthy();
  });

  it('blendet mit dem Planeten auch seine Monde aus', () => {
    expect([...kaskadierendeSichtbarkeit('jupiter')].sort())
      .toEqual(['callisto', 'europa', 'ganymede', 'io', 'jupiter']);
  });

  // Der Test oben prüft nur die reine Funktion. Der tatsächlich verdrahtete
  // Weg — Klick auf das Kästchen, toggleVisible je Nachkomme, resultierender
  // Store-Zustand — braucht einen echten Verhaltenstest, sonst bliebe ein
  // Fehler wie "die Kaskade toggelt im UI gar nicht" unbemerkt.
  const galileischeMonde = ['io', 'europa', 'ganymede', 'callisto'];

  it('schaltet beim Ausblenden Jupiters über das Kästchen alle vier Galileischen Monde mit aus', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByRole('button', { name: /Jupiter aufklappen/ }));
    fireEvent.click(screen.getByLabelText(/Jupiter anzeigen/));

    const { visible } = useStore.getState();
    expect(visible.jupiter).toBe(false);
    galileischeMonde.forEach((id) => { expect(visible[id]).toBe(false); });
  });

  it('macht beim Wiedereinblenden Jupiters alle vier Monde erneut sichtbar', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByRole('button', { name: /Jupiter aufklappen/ }));
    const kaestchen = screen.getByLabelText(/Jupiter anzeigen/);
    fireEvent.click(kaestchen); // ausblenden
    fireEvent.click(kaestchen); // wieder einblenden

    const { visible } = useStore.getState();
    // toggleVisible entfernt den Schlüssel beim Wiedereinblenden vollständig
    // (siehe store/index.ts) statt ihn auf true zu setzen.
    expect(visible.jupiter).toBeUndefined();
    galileischeMonde.forEach((id) => { expect(visible[id]).toBeUndefined(); });
  });
});
