// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BodyTree, buildTree } from './BodyTree';
import { bodies } from '../../data/index';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('buildTree', () => {
  it('setzt die Sonne an die Wurzel', () => {
    const baum = buildTree(bodies);
    expect(baum).toHaveLength(1);
    expect(baum[0]!.body.id).toBe('sun');
  });

  it('hängt die acht Planeten unter die Sonne', () => {
    expect(buildTree(bodies)[0]!.children).toHaveLength(8);
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

  it('blendet einen Körper über das Kaestchen aus', () => {
    render(<BodyTree />);
    fireEvent.click(screen.getByLabelText(/Neptun anzeigen/));
    expect(useStore.getState().visible.neptune).toBe(false);
  });
});
