import { describe, it, expect, afterEach } from 'vitest';
import { aktuellerText, ausweichTitel, grundlage } from './aktuellerText';
import { DEFAULT_STATE } from '../../store';
import { SCENES } from '../../data/scenes';
import { sceneIndexFor } from '../../sim/director';
import { setSprache } from '../i18n';

const zustand = (aenderung: (s: typeof DEFAULT_STATE) => void) => {
  const s = structuredClone(DEFAULT_STATE);
  aenderung(s);
  return s;
};

afterEach(() => { setSprache('de'); });

describe('aktuellerText', () => {
  it('nimmt das Kameraziel, wenn kein Kino läuft', () => {
    const s = zustand((z) => { z.camera.targetId = 'saturn'; });
    expect(aktuellerText(s)).toEqual({ art: 'objekt', kennung: 'saturn' });
    expect(grundlage(s)).toBe('objekt:saturn');
  });

  it('nimmt die laufende Szene, auch bei Mischung', () => {
    const s = zustand((z) => { z.cinema.running = true; z.cinema.nummer = 7; z.cinema.shuffle = true; });
    const erwartet = SCENES[sceneIndexFor(7, SCENES.length, s.cinema.seed, true)]!.id;
    expect(aktuellerText(s)).toEqual({ art: 'szene', kennung: erwartet });
    expect(grundlage(s)).toBe(`szene:${erwartet}`);
  });

  it('nimmt die Szene auch im angehaltenen Kino, nach dem Ende wieder das Kameraziel', () => {
    const angehalten = zustand((z) => {
      z.cinema.running = false; z.cinema.nummer = 3; z.cinema.shuffle = false;
      z.camera.mode = 'cinema'; z.camera.targetId = 'jupiter';
    });
    const szene = SCENES[3]!.id;
    expect(aktuellerText(angehalten)).toEqual({ art: 'szene', kennung: szene });
    expect(grundlage(angehalten)).toBe(`szene:${szene}`);

    const beendet = zustand((z) => {
      z.cinema.running = false; z.cinema.nummer = 3; z.cinema.shuffle = false;
      z.camera.mode = 'free'; z.camera.targetId = 'jupiter';
    });
    expect(aktuellerText(beendet)).toEqual({ art: 'objekt', kennung: 'jupiter' });
    expect(grundlage(beendet)).toBe('objekt:jupiter');
  });

  it('ein gewähltes Thema geht vor, ändert aber die Grundlage nicht', () => {
    const s = zustand((z) => { z.ui.info.thema = 'modell'; z.camera.targetId = 'mars'; });
    expect(aktuellerText(s)).toEqual({ art: 'thema', kennung: 'modell' });
    expect(grundlage(s)).toBe('objekt:mars');
  });

  it('ausweichTitel nennt Körper, Szene und Thema in der Sprache der Oberfläche', () => {
    expect(ausweichTitel({ art: 'objekt', kennung: 'earth' })).toBe('Erde');
    expect(ausweichTitel({ art: 'thema', kennung: 'modell' })).toBe('Grenzen des Modells');
    expect(ausweichTitel({ art: 'szene', kennung: 'mondfinsternis' })).not.toMatch(/^\[/);
    setSprache('en');
    expect(ausweichTitel({ art: 'objekt', kennung: 'earth' })).toBe('Earth');
    expect(ausweichTitel({ art: 'objekt', kennung: 'vulcan' })).toBe('vulcan');
  });
});
