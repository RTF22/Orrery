// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BodyTree, buildTree, kaskadierendeSichtbarkeit } from './BodyTree';
import { bodies } from '../../data/index';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('buildTree', () => {
  it('setzt die Sonne an die Wurzel', () => {
    const baum = buildTree(bodies);
    expect(baum).toHaveLength(1);
    expect(baum[0]!.body.id).toBe('sun');
  });

  it('hängt die acht Planeten und die fünf Zwergplaneten unter die Sonne', () => {
    // Seit Task 10 hängen unter der Sonne nicht mehr nur die acht Planeten,
    // sondern zusätzlich Pluto, Ceres, Eris, Haumea und Makemake (parent:
    // 'sun', kind: 'dwarf') — macht 13 statt 8 direkte Kinder.
    const kinder = buildTree(bodies)[0]!.children;
    expect(kinder).toHaveLength(13);
    expect(kinder.filter((k) => k.body.kind === 'planet')).toHaveLength(8);
    expect(kinder.filter((k) => k.body.kind === 'dwarf').map((k) => k.body.id).sort()).toEqual(
      ['ceres', 'eris', 'haumea', 'makemake', 'pluto'],
    );
  });

  it('hängt den Mond unter die Erde', () => {
    const erde = buildTree(bodies)[0]!.children.find((k) => k.body.id === 'earth')!;
    expect(erde.children.map((k) => k.body.id)).toEqual(['moon']);
  });
});

describe('BodyTree', () => {
  it('zeigt die deutschen Namen', () => {
    render(<BodyTree />);
    expect(screen.getByText('Merkur')).toBeTruthy();
    expect(screen.getByText('Neptun')).toBeTruthy();
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
    useStore.setState({ visible: {} });
    kaskadierendeSichtbarkeit('jupiter').forEach((id) => {
      expect(['jupiter', 'io', 'europa', 'ganymede', 'callisto']).toContain(id);
    });
    expect(kaskadierendeSichtbarkeit('jupiter')).toHaveLength(5);
  });
});
