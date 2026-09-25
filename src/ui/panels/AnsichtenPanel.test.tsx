// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { AnsichtenPanel } from './AnsichtenPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCHLUESSEL_ANSICHTEN, EXPORT_FORMAT } from '../../store/persist';
import type { Ansicht } from '../../store/persist';
import { setSprache } from '../i18n';
import { ablageFake } from '../../test/ablageFake';
import { flugWiederherstellungMelden } from '../../render/camera/controller';

vi.mock('../../render/camera/controller', async (original) => ({
  ...(await original<typeof import('../../render/camera/controller')>()),
  flugWiederherstellungMelden: vi.fn(),
}));

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

  it('meldet der Kamera beim Laden eine Wiederherstellung, damit ein laufender Flug ruhig hinübergleitet (Abnahme Flug Etappe 2, §7 Frage 4)', () => {
    vi.mocked(flugWiederherstellungMelden).mockClear();
    const ablage = mitAnsichten([
      { name: 'Flug', state: { camera: { mode: 'fly', fly: { refId: 'earth', x: 4e7, y: -3e7, z: 1e7, yaw: 1, pitch: 0 } } } },
    ]);
    useStore.getState().setCamera({ mode: 'fly' });
    render(<AnsichtenPanel ablage={ablage} />);
    expect(flugWiederherstellungMelden).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Ansicht laden: Flug' }));
    expect(useStore.getState().camera.fly.x).toBe(4e7);
    expect(flugWiederherstellungMelden).toHaveBeenCalledTimes(1);
  });

  it('liest eine beschädigte Ablage als leer', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_ANSICHTEN, '[{');
    render(<AnsichtenPanel ablage={ablage} />);
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
  });
});

describe('AnsichtenPanel: umbenennen', () => {
  const zwei = (): ReturnType<typeof mitAnsichten> => mitAnsichten([
    { name: 'Saturn', state: {} },
    { name: 'Erde', state: { display: { orbits: false } } },
  ]);

  it('benennt mit Enter um und schreibt die Ablage', () => {
    const ablage = zwei();
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Umbenennen: Saturn' }));
    const feld = screen.getByRole('textbox', { name: 'Neuer Name' }) as HTMLInputElement;
    expect(feld.value).toBe('Saturn');
    fireEvent.change(feld, { target: { value: 'Saturn nah' } });
    fireEvent.keyDown(feld, { key: 'Enter' });
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn nah' })).toBeTruthy();
    expect(screen.queryByRole('textbox', { name: 'Neuer Name' })).toBeNull();
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn nah', 'Erde']);
  });

  it('lehnt einen vergebenen Namen ab und markiert das Feld', () => {
    const ablage = zwei();
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Umbenennen: Saturn' }));
    const feld = screen.getByRole('textbox', { name: 'Neuer Name' });
    fireEvent.change(feld, { target: { value: ' Erde ' } });
    fireEvent.keyDown(feld, { key: 'Enter' });
    expect(feld.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Name bereits vergeben')).toBeTruthy();
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn', 'Erde']);
  });

  it('bricht mit Escape ab', () => {
    const ablage = zwei();
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Umbenennen: Saturn' }));
    const feld = screen.getByRole('textbox', { name: 'Neuer Name' });
    fireEvent.change(feld, { target: { value: 'Anders' } });
    fireEvent.keyDown(feld, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn', 'Erde']);
  });
});

describe('AnsichtenPanel: löschen mit Rückgängig', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('zeigt fünf Sekunden „Rückgängig", dann ist der Eintrag fort', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Löschen: Saturn' }));
    expect(screen.getByRole('button', { name: 'Rückgängig: Saturn' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Ansicht laden: Saturn' })).toBeNull();
    expect(gespeichert(ablage)).toHaveLength(1);
    act(() => { vi.advanceTimersByTime(4999); });
    expect(gespeichert(ablage)).toHaveLength(1);
    act(() => { vi.advanceTimersByTime(1); });
    expect(gespeichert(ablage)).toEqual([]);
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
  });

  it('Rückgängig stellt die Zeile wieder her', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Löschen: Saturn' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rückgängig: Saturn' }));
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
    act(() => { vi.advanceTimersByTime(6000); });
    expect(gespeichert(ablage)).toHaveLength(1);
  });

  it('Speichern unter dem Namen eines schwebenden Eintrags hebt das Löschen auf', () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    useStore.getState().setDisplay({ orbits: false });
    render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Löschen: Saturn' }));
    fireEvent.change(namensfeld(), { target: { value: 'Saturn' } });
    fireEvent.click(screen.getByRole('button', { name: 'Überschreiben' }));
    act(() => { vi.advanceTimersByTime(6000); });
    expect(gespeichert(ablage)).toEqual([{ name: 'Saturn', state: { display: { orbits: false } } }]);
    expect(screen.getByRole('button', { name: 'Ansicht laden: Saturn' })).toBeTruthy();
  });
});

describe('AnsichtenPanel: exportieren und importieren', () => {
  const dateiFeld = (container: HTMLElement): HTMLInputElement =>
    container.querySelector('input[type="file"]') as HTMLInputElement;

  const exportDatei = (ansichten: unknown): File =>
    new File([JSON.stringify({ format: EXPORT_FORMAT, version: 1, ansichten })], 'a.json', { type: 'application/json' });

  afterEach(() => {
    vi.restoreAllMocks();
    // jsdom kennt keine Blob-URLs; die Stubs aus dem Export-Test wieder entfernen.
    Reflect.deleteProperty(URL, 'createObjectURL');
    Reflect.deleteProperty(URL, 'revokeObjectURL');
  });

  it('Exportieren ist ohne Ansichten deaktiviert', () => {
    render(<AnsichtenPanel ablage={ablageFake()} />);
    expect((screen.getByRole('button', { name: 'Exportieren' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('exportiert die Liste als JSON-Datei mit Umschlag über einen Download-Link und gibt die URL erst nach 1000 ms frei', async () => {
    vi.useFakeTimers();
    try {
      const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:orrery');
      const revokeObjectURL = vi.fn();
      Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
      Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true });
      let dateiname = '';
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
        dateiname = this.download;
      });
      render(<AnsichtenPanel ablage={mitAnsichten([{ name: 'Saturn', state: { scale: { sizeScale: 7 } } }])} />);
      fireEvent.click(screen.getByRole('button', { name: 'Exportieren' }));
      expect(dateiname).toBe('orrery-ansichten.json');
      const blob = createObjectURL.mock.calls[0]?.[0] as Blob;
      expect(JSON.parse(await blob.text())).toEqual({
        format: EXPORT_FORMAT, version: 1, ansichten: [{ name: 'Saturn', state: { scale: { sizeScale: 7 } } }],
      });
      expect(revokeObjectURL).not.toHaveBeenCalled();
      act(() => { vi.advanceTimersByTime(1000); });
      expect(revokeObjectURL).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:orrery');
    } finally {
      vi.useRealTimers();
    }
  });

  it('exportiert schwebend gelöschte Einträge nicht', async () => {
    // Fake-Timer, damit die verzögerte Freigabe der Objekt-URL (EXPORT_FREIGABE_MS)
    // hier nicht als echter Timer über das Testende hinaus weiterläuft.
    vi.useFakeTimers();
    try {
      const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:orrery');
      Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
      Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), configurable: true });
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      render(<AnsichtenPanel ablage={mitAnsichten([{ name: 'Saturn', state: {} }, { name: 'Erde', state: {} }])} />);
      fireEvent.click(screen.getByRole('button', { name: 'Löschen: Saturn' }));
      fireEvent.click(screen.getByRole('button', { name: 'Exportieren' }));
      const blob = createObjectURL.mock.calls[0]?.[0] as Blob;
      expect((JSON.parse(await blob.text()) as { ansichten: { name: string }[] }).ansichten.map((a) => a.name)).toEqual(['Erde']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('importiert eine gültige Datei, hängt sie an und löst Namenskonflikte', async () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    const { container } = render(<AnsichtenPanel ablage={ablage} />);
    const datei = exportDatei([{ name: 'Saturn', state: {} }, { name: 'Erde', state: { display: { orbits: false } } }]);
    fireEvent.change(dateiFeld(container), { target: { files: [datei] } });
    await waitFor(() => { expect(screen.getByRole('button', { name: 'Ansicht laden: Erde' })).toBeTruthy(); });
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn', 'Saturn (2)', 'Erde']);
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('meldet eine fremde Datei und übernimmt nichts', async () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    const { container } = render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(dateiFeld(container), { target: { files: [new File(['kein json'], 'x.json')] } });
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Datei ist kein Ansichten-Export'); });
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn']);
  });

  it('meldet eine Datei ohne gültigen Eintrag', async () => {
    const { container } = render(<AnsichtenPanel ablage={ablageFake()} />);
    fireEvent.change(dateiFeld(container), { target: { files: [exportDatei([{ name: '', state: {} }])] } });
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Datei enthält keine gültige Ansicht'); });
    expect(screen.getByText('Noch keine Ansichten gespeichert.')).toBeTruthy();
  });

  it('nennt die Zahl der verworfenen Einträge; die Meldung geht beim nächsten Erfolg', async () => {
    const ablage = ablageFake();
    const { container } = render(<AnsichtenPanel ablage={ablage} />);
    fireEvent.change(dateiFeld(container), { target: { files: [exportDatei([{ name: 'Erde', state: {} }, { name: '', state: {} }, 7])] } });
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Verworfene Einträge: 2'); });
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Erde']);
    fireEvent.change(namensfeld(), { target: { value: 'Mars' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('meldet eine nicht lesbare Datei wie eine fremde', async () => {
    const ablage = mitAnsichten([{ name: 'Saturn', state: {} }]);
    const { container } = render(<AnsichtenPanel ablage={ablage} />);
    const datei = new File(['x'], 'x.json');
    vi.spyOn(datei, 'text').mockRejectedValue(new Error('nicht lesbar'));
    fireEvent.change(dateiFeld(container), { target: { files: [datei] } });
    await waitFor(() => { expect(screen.getByRole('status').textContent).toBe('Datei ist kein Ansichten-Export'); });
    expect(gespeichert(ablage).map((a) => a.name)).toEqual(['Saturn']);
  });
});
