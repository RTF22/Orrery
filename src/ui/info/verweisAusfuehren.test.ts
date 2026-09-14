// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { verweisAusfuehren } from './verweisAusfuehren';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCENES } from '../../data/scenes';
import { quelleFinden } from '../../data/quellen';
import { fahrtAbbrechen } from '../kamerafahrt';

const keineWirkung = { hebeHervor: () => {} };

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
});

describe('verweisAusfuehren', () => {
  it('objekt: fährt die Kamera und löscht ein gewähltes Thema', () => {
    useStore.getState().setInfo({ thema: 'modell' });
    verweisAusfuehren({ art: 'objekt', kennung: 'saturn' }, keineWirkung);
    expect(useStore.getState().camera.targetId).toBe('saturn');
    expect(useStore.getState().ui.info.thema).toBeNull();
    fahrtAbbrechen();
  });

  it('szene: startet die Szene ohne Mischung im Kino', () => {
    const index = SCENES.findIndex((s) => s.id === 'mondfinsternis');
    expect(index).toBeGreaterThanOrEqual(0);
    verweisAusfuehren({ art: 'szene', kennung: 'mondfinsternis' }, keineWirkung);
    const s = useStore.getState();
    expect(s.cinema).toMatchObject({ running: true, shuffle: false, nummer: index, elapsedSec: 0 });
    expect(s.camera.mode).toBe('cinema');
  });

  it('thema: setzt nur das Thema', () => {
    const kamera = useStore.getState().camera;
    verweisAusfuehren({ art: 'thema', kennung: 'ringe' }, keineWirkung);
    expect(useStore.getState().ui.info.thema).toBe('ringe');
    expect(useStore.getState().camera).toEqual(kamera);
  });

  it('quelle: meldet die Kennung zur Hervorhebung; extern tut nichts', () => {
    const hebeHervor = vi.fn();
    verweisAusfuehren({ art: 'quelle', quelle: quelleFinden('nssdc-earth')! }, { hebeHervor });
    expect(hebeHervor).toHaveBeenCalledWith('nssdc-earth');
    const vorher = useStore.getState();
    verweisAusfuehren({ art: 'extern', url: 'https://example.org' }, { hebeHervor });
    expect(useStore.getState()).toBe(vorher);
    expect(hebeHervor).toHaveBeenCalledTimes(1);
  });
});
