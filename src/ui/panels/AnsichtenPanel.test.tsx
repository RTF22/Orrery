// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnsichtenPanel } from './AnsichtenPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCHLUESSEL_ANSICHTEN } from '../../store/persist';
import type { Ansicht } from '../../store/persist';
import { setSprache } from '../i18n';
import { ablageFake } from '../../test/ablageFake';

const gespeichert = (ablage: ReturnType<typeof ablageFake>): Ansicht[] =>
  JSON.parse(ablage.daten.get(SCHLUESSEL_ANSICHTEN) ?? '[]') as Ansicht[];

const mitAnsichten = (liste: Ansicht[]): ReturnType<typeof ablageFake> => {
  const ablage = ablageFake();
  ablage.daten.set(SCHLUESSEL_ANSICHTEN, JSON.stringify(liste));
  return ablage;
};

const namensfeld = (): HTMLInputElement =>
  screen.getByRole('textbox', { name: 'Name der Ansicht' }) as HTMLInputElement;

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });
afterEach(() => { setSprache('de'); });

describe('AnsichtenPanel: speichern und laden', () => {
  it('zeigt den Leerzustand und einen deaktivierten Speichern-Knopf', () => {
    render(<AnsichtenPanel ablage={ablageFake()} />);
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Speichern' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('bleibt bei Leerraum als Namen deaktiviert', () => {
    render(<AnsichtenPanel ablage={ablageFake()} />);
    fireEvent.change(namensfeld(), { target: { value: '   ' } });
    expect((screen.getByRole('button', { name: 'Speichern' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('speichert die Einstellungen ohne Zeitpunkt, Kino, Qualität und Oberfläche und leert das Feld', () => {
    const ablage = ablageFake();
    const s = useStore.getState();
    s.setScale({ sizeScale: 7, preset: null });
    s.setTime({ jd: 2461294.5, paused: true });
    useStore.setState({ quality: { tier: 'high' } });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(namensfeld(), { target: { value: ' Saturn ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(gespeichert(ablage)).toEqual([{ name: 'Saturn', state: { scale: { sizeScale: 7, preset: null } } }]);
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
    expect(namensfeld().value).toBe('');
    expect(screen.queryByText('Noch keine Ansichten gespeichert.')).toBeNull();
  });

  it('bietet „Überschreiben" an, wenn der Name vergeben ist, und ersetzt den Eintrag', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: { scale: { sizeScale: 7 } } }]);
    useStore.getState().setDisplay({ orbits: false });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(namensfeld(), { target: { value: 'Saturn' } });
    expect(screen.queryByRole('button', { name: 'Speichern' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Überschreiben' }));
    expect(gespeichert(ablage)).toEqual([{ name: 'Saturn', state: { display: { orbits: false } } }]);
    expect(screen.getAllByRole('button', { name: /^Ansicht laden: / })).toHaveLength(1);
  });

  it('lädt eine Ansicht und lässt Zeitpunkt, Pause, Kino, Qualität und Oberfläche unberührt', () => {
    const ablage = mitAnsichten([
      { name: 'Saturn', state: { scale: { sizeScale: 7, preset: null }, camera: { targetId: 'saturn', mode: 'attached' } } },
    ]);
    const s = useStore.getState();
    s.setTime({ jd: 2461294.5, paused: true });
    s.setDisplay({ orbits: false });
    s.setUi({ language: 'en' });
    useStore.setState({ quality: { tier: 'high' } });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ansicht laden: Saturn' }));
    const z = useStore.getState();
    expect(z.scale.sizeScale).toBe(7);
    expect(z.camera.targetId).toBe('saturn');
    expect(z.camera.mode).toBe('attached');
    expect(z.display.orbits).toBe(true);
    expect(z.time.jd).toBe(2461294.5);
    expect(z.time.paused).toBe(true);
    expect(z.quality.tier).toBe('high');
    expect(z.ui.language).toBe('en');
  });

  it('liest eine beschädigte Ablage als leer', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_ANSICHTEN, '[{');
    render(<AnsichtenPanel ablage={ablage} />);
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
  });
});
