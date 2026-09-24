import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import {
  benoetigteStufe, erzeugeTexturSteuerung, obergrenzeFuer, MAX_NACHLADEN, PRUEF_ABSTAND_MS,
  type TexturLader,
} from './texturen';
import type { TexturStufe } from '../data/texturen';

const stufe = (id: string, breite: number): TexturStufe =>
  ({ breite, pfad: `textures/${id}/albedo-${breite}.ktx2`, mittel: 0.2 });
const LISTE: Record<string, readonly TexturStufe[]> = {
  earth: [stufe('earth', 1024), stufe('earth', 2048), stufe('earth', 8192)],
  mars: [stufe('mars', 1024), stufe('mars', 2048), stufe('mars', 8192)],
  moon: [stufe('moon', 1024), stufe('moon', 2048), stufe('moon', 8192)],
  io: [stufe('io', 1024)],
};

/** Lader, dessen Ladungen der Test einzeln erfüllt oder scheitern lässt. */
function testLader() {
  const offen = new Map<string, { erfuelle: () => void; scheitere: () => void }>();
  const aufrufe: string[] = [];
  const lader: TexturLader = {
    lade: (pfad) => new Promise((erfuelle, scheitere) => {
      aufrufe.push(pfad);
      offen.set(pfad, { erfuelle: () => erfuelle(new THREE.Texture()), scheitere: () => scheitere(new Error('404')) });
    }),
    freigeben: vi.fn(),
  };
  return { lader, aufrufe, offen };
}
const ruhe = () => new Promise((r) => setTimeout(r, 0));

describe('obergrenzeFuer', () => {
  it('folgt der Qualitätsstufe, auto wie mittel', () => {
    expect(obergrenzeFuer('low', 16384)).toBe(1024);
    expect(obergrenzeFuer('medium', 16384)).toBe(2048);
    expect(obergrenzeFuer('auto', 16384)).toBe(2048);
    expect(obergrenzeFuer('high', 16384)).toBe(8192);
  });

  it('bleibt unter der Grenze der Grafikkarte', () => {
    expect(obergrenzeFuer('high', 4096)).toBe(4096);
  });
});

describe('benoetigteStufe', () => {
  const erde = [1024, 2048, 8192];

  it('nimmt die kleinste Stufe mit durchmesserPx ≤ 0,75 · W / 2', () => {
    expect(benoetigteStufe(300, erde, 8192)).toBe(1024);
    expect(benoetigteStufe(384, erde, 8192)).toBe(1024);
    expect(benoetigteStufe(385, erde, 8192)).toBe(2048);
    expect(benoetigteStufe(768, erde, 8192)).toBe(2048);
    expect(benoetigteStufe(769, erde, 8192)).toBe(8192);
  });

  it('endet bei der höchsten erlaubten Stufe', () => {
    expect(benoetigteStufe(5000, erde, 8192)).toBe(8192);
    expect(benoetigteStufe(5000, erde, 2048)).toBe(2048);
    expect(benoetigteStufe(5000, erde, 1024)).toBe(1024);
  });

  it('lädt bei maxTextureSize 4096 keine 8k-Stufe, sondern endet bei 2048', () => {
    expect(benoetigteStufe(5000, erde, 4096)).toBe(2048);
  });

  it('bleibt bei einem Körper mit nur einer Stufe bei ihr', () => {
    expect(benoetigteStufe(5000, [1024], 8192)).toBe(1024);
  });
});

describe('erzeugeTexturSteuerung', () => {
  it('lädt beim Start je Körper genau die erste Stufe', () => {
    const { lader, aufrufe } = testLader();
    erzeugeTexturSteuerung(lader, LISTE, vi.fn()).start();
    expect(aufrufe.sort()).toEqual([
      'textures/earth/albedo-1024.ktx2', 'textures/io/albedo-1024.ktx2',
      'textures/mars/albedo-1024.ktx2', 'textures/moon/albedo-1024.ktx2',
    ]);
  });

  it('fragt Körper ohne Eintrag nie an', () => {
    const { lader, aufrufe } = testLader();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, vi.fn());
    steuerung.pruefe(0, () => [{ id: 'deimos', durchmesserPx: 5000 }], 'deimos', 8192);
    expect(aufrufe).toEqual([]);
    expect(steuerung.stand()).not.toHaveProperty('deimos');
  });

  it('meldet geladene Stufen an setze und im Stand', async () => {
    const { lader, offen } = testLader();
    const setze = vi.fn();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, setze);
    steuerung.start();
    expect(steuerung.stand()).toEqual({ earth: 0, mars: 0, moon: 0, io: 0 });
    offen.get('textures/earth/albedo-1024.ktx2')!.erfuelle();
    await ruhe();
    expect(setze).toHaveBeenCalledWith('earth', expect.any(THREE.Texture), 1024);
    expect(steuerung.stand()['earth']).toBe(1024);
  });

  it('prüft höchstens alle PRUEF_ABSTAND_MS', () => {
    const { lader, aufrufe } = testLader();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, vi.fn());
    const bedarf = vi.fn(() => [{ id: 'earth', durchmesserPx: 500 }]);
    steuerung.pruefe(1000, bedarf, 'earth', 8192);
    steuerung.pruefe(1000 + PRUEF_ABSTAND_MS - 1, bedarf, 'earth', 8192);
    expect(bedarf).toHaveBeenCalledOnce();
    steuerung.pruefe(1000 + PRUEF_ABSTAND_MS, bedarf, 'earth', 8192);
    expect(bedarf).toHaveBeenCalledTimes(2);
    expect(aufrufe).toEqual(['textures/earth/albedo-2048.ktx2']);
  });

  it('lädt höchstens zwei Stufen zugleich, das Kameraziel zuerst, dann nach Durchmesser', () => {
    const { lader, aufrufe } = testLader();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, vi.fn());
    steuerung.pruefe(0, () => [
      { id: 'earth', durchmesserPx: 500 },
      { id: 'mars', durchmesserPx: 900 },
      { id: 'moon', durchmesserPx: 400 },
    ], 'moon', 8192);
    expect(MAX_NACHLADEN).toBe(2);
    expect(aufrufe).toEqual(['textures/moon/albedo-2048.ktx2', 'textures/mars/albedo-8192.ktx2']);
  });

  it('rückt nach, sobald eine Ladung fertig ist', async () => {
    const { lader, aufrufe, offen } = testLader();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, vi.fn());
    const bedarf = () => [
      { id: 'earth', durchmesserPx: 500 }, { id: 'mars', durchmesserPx: 900 }, { id: 'moon', durchmesserPx: 400 },
    ];
    steuerung.pruefe(0, bedarf, 'moon', 8192);
    offen.get('textures/moon/albedo-2048.ktx2')!.erfuelle();
    await ruhe();
    steuerung.pruefe(PRUEF_ABSTAND_MS, bedarf, 'moon', 8192);
    expect(aufrufe).toEqual([
      'textures/moon/albedo-2048.ktx2', 'textures/mars/albedo-8192.ktx2', 'textures/earth/albedo-2048.ktx2',
    ]);
  });

  it('stuft nie herunter, auch wenn die Qualitätsstufe sinkt', async () => {
    const { lader, aufrufe, offen } = testLader();
    const setze = vi.fn();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, setze);
    steuerung.pruefe(0, () => [{ id: 'earth', durchmesserPx: 3000 }], 'earth', 8192);
    offen.get('textures/earth/albedo-8192.ktx2')!.erfuelle();
    await ruhe();
    steuerung.pruefe(PRUEF_ABSTAND_MS, () => [{ id: 'earth', durchmesserPx: 3000 }], 'earth', 1024);
    expect(aufrufe).toEqual(['textures/earth/albedo-8192.ktx2']);
    expect(steuerung.stand()['earth']).toBe(8192);
  });

  it('versucht eine gescheiterte Stufe in dieser Sitzung nicht erneut und bleibt still', async () => {
    const { lader, aufrufe, offen } = testLader();
    const setze = vi.fn();
    const warnung = vi.spyOn(console, 'warn');
    const fehler = vi.spyOn(console, 'error');
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, setze);
    const bedarf = () => [{ id: 'earth', durchmesserPx: 3000 }];
    steuerung.pruefe(0, bedarf, 'earth', 8192);
    offen.get('textures/earth/albedo-8192.ktx2')!.scheitere();
    await ruhe();
    steuerung.pruefe(PRUEF_ABSTAND_MS, bedarf, 'earth', 8192);
    steuerung.pruefe(2 * PRUEF_ABSTAND_MS, bedarf, 'earth', 8192);
    expect(aufrufe).toEqual(['textures/earth/albedo-8192.ktx2']);
    expect(setze).not.toHaveBeenCalled();
    expect(warnung).not.toHaveBeenCalled();
    expect(fehler).not.toHaveBeenCalled();
    warnung.mockRestore();
    fehler.mockRestore();
  });

  it('fordert eine Stufe, die schon der Start lädt, nicht ein zweites Mal an', async () => {
    const { lader, aufrufe, offen } = testLader();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, vi.fn());
    steuerung.start();
    steuerung.pruefe(0, () => [{ id: 'io', durchmesserPx: 5000 }, { id: 'earth', durchmesserPx: 100 }], 'io', 8192);
    expect(aufrufe.filter((p) => p.includes('io'))).toEqual(['textures/io/albedo-1024.ktx2']);
    expect(aufrufe.filter((p) => p.includes('earth'))).toEqual(['textures/earth/albedo-1024.ktx2']);
    // Auch nach Abschluss der Startladungen fordert dieselbe Prüfung nichts
    // Neues an: io hat nur eine Stufe, earth braucht bei 100 px nicht mehr als 1024.
    offen.get('textures/earth/albedo-1024.ktx2')!.erfuelle();
    offen.get('textures/mars/albedo-1024.ktx2')!.erfuelle();
    offen.get('textures/moon/albedo-1024.ktx2')!.erfuelle();
    offen.get('textures/io/albedo-1024.ktx2')!.erfuelle();
    await ruhe();
    steuerung.pruefe(1, () => [{ id: 'io', durchmesserPx: 5000 }, { id: 'earth', durchmesserPx: 100 }], 'io', 8192);
    expect(aufrufe.filter((p) => p.includes('io'))).toEqual(['textures/io/albedo-1024.ktx2']);
    expect(aufrufe.filter((p) => p.includes('earth'))).toEqual(['textures/earth/albedo-1024.ktx2']);
  });

  it('wartet mit dem Nachladen, bis alle Startladungen abgeschlossen sind', async () => {
    const { lader, aufrufe, offen } = testLader();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, vi.fn());
    steuerung.start();
    // Startladungen (vier Körper) laufen noch — das Kameraziel Erde bräuchte bei
    // 3000 px längst die 8k-Stufe, darf sie aber nicht schon jetzt anfordern,
    // sonst nimmt sie den Startladungen Bandbreite (Ruling des Controllers).
    steuerung.pruefe(0, () => [{ id: 'earth', durchmesserPx: 3000 }], 'earth', 8192);
    expect(aufrufe).toEqual([
      'textures/earth/albedo-1024.ktx2', 'textures/mars/albedo-1024.ktx2',
      'textures/moon/albedo-1024.ktx2', 'textures/io/albedo-1024.ktx2',
    ]);
    offen.get('textures/earth/albedo-1024.ktx2')!.erfuelle();
    offen.get('textures/mars/albedo-1024.ktx2')!.erfuelle();
    offen.get('textures/moon/albedo-1024.ktx2')!.erfuelle();
    offen.get('textures/io/albedo-1024.ktx2')!.scheitere();
    await ruhe();
    // Die erste Prüfung nach den Startladungen greift sofort, obwohl seit der
    // ersten Prüfung erst 1 ms vergangen ist (PRUEF_ABSTAND_MS wurde nicht
    // gesetzt, solange offeneStarts > 0 war).
    steuerung.pruefe(1, () => [{ id: 'earth', durchmesserPx: 3000 }], 'earth', 8192);
    expect(aufrufe).toEqual([
      'textures/earth/albedo-1024.ktx2', 'textures/mars/albedo-1024.ktx2',
      'textures/moon/albedo-1024.ktx2', 'textures/io/albedo-1024.ktx2',
      'textures/earth/albedo-8192.ktx2',
    ]);
  });

  it('gibt nach dem Beenden eintreffende Texturen frei, statt sie zu setzen', async () => {
    const { lader, offen } = testLader();
    const setze = vi.fn();
    const disposeSpion = vi.spyOn(THREE.Texture.prototype, 'dispose');
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, setze);
    steuerung.start();
    steuerung.beenden();
    offen.get('textures/earth/albedo-1024.ktx2')!.erfuelle();
    await ruhe();
    expect(setze).not.toHaveBeenCalled();
    expect(disposeSpion).toHaveBeenCalledOnce();
    disposeSpion.mockRestore();
  });

  it('fordert nach dem Beenden nichts mehr an', () => {
    const { lader, aufrufe } = testLader();
    const steuerung = erzeugeTexturSteuerung(lader, LISTE, vi.fn());
    steuerung.beenden();
    steuerung.pruefe(0, () => [{ id: 'earth', durchmesserPx: 3000 }], 'earth', 8192);
    expect(aufrufe).toEqual([]);
  });
});
